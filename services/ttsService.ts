
import { GoogleGenAI, Modality } from "@google/genai";

let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

// Fix: Implement manual decode function following guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Fix: Implement manual PCM audio decoding as required for raw Gemini streams
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const ttsService = {
  speak: async (text: string, rate: number = 1.0, onEnd?: () => void, useAi: boolean = false) => {
    ttsService.cancel();

    if (useAi && process.env.API_KEY) {
        try {
            await playAiAudio(text, rate, onEnd);
            return;
        } catch (error) {
            console.warn("AI TTS failed", error);
        }
    }
    playBrowserAudio(text, rate, onEnd);
  },

  cancel: () => {
    window.speechSynthesis.cancel();
    if (currentSource) {
      try { currentSource.stop(); currentSource.disconnect(); } catch (e) {}
      currentSource = null;
    }
  },

  init: () => {
    window.speechSynthesis.getVoices();
    if (!audioContext && typeof window !== 'undefined') {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }
};

const playBrowserAudio = (text: string, rate: number, onEnd?: () => void) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    utterance.onend = () => { if (onEnd) onEnd(); };
    window.speechSynthesis.speak(utterance);
};

const playAiAudio = async (text: string, rate: number, onEnd?: () => void) => {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    // Fix: Always create a new GoogleGenAI instance right before the call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Fix: Updated generateContent parameters for TTS according to guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: text }] }], // Fix: Must be an array
      config: {
        responseModalities: [Modality.AUDIO], // Fix: Use Modality enum and single element array
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error("No audio data");

    if (!audioContext) audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    if (audioContext.state === 'suspended') await audioContext.resume();

    // Fix: Use manual PCM decoding instead of native AudioContext.decodeAudioData
    const audioBuffer = await decodeAudioData(
      decode(audioData),
      audioContext,
      24000,
      1
    );
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    if (rate !== 1.0) source.playbackRate.value = rate;
    source.connect(audioContext.destination);
    currentSource = source;
    source.onended = () => { currentSource = null; if (onEnd) onEnd(); };
    source.start();
};

ttsService.init();
