import { GoogleGenAI } from "@google/genai";

const safeGetApiKey = (): string => {
  try {
    if (typeof window !== 'undefined' && (window as any).process?.env?.API_KEY) {
      return (window as any).process.env.API_KEY;
    }
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
      return process.env.API_KEY;
    }
    return '';
  } catch (e) {
    return '';
  }
};

let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const ttsService = {
  speak: async (text: string, rate: number = 1.0, onEnd?: () => void, useAi: boolean = false) => {
    const key = safeGetApiKey();
    ttsService.cancel();

    if (useAi && key) {
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
    const key = safeGetApiKey();
    if (!key) throw new Error("API Key missing");
    const ai = new GoogleGenAI({ apiKey: key });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: { parts: [{ text: text }] },
      config: {
        responseModalities: ['AUDIO'], 
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error("No audio data");

    if (!audioContext) audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContext.state === 'suspended') await audioContext.resume();

    const audioBuffer = await audioContext.decodeAudioData(decodeBase64(audioData));
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    if (rate !== 1.0) source.playbackRate.value = rate;
    source.connect(audioContext.destination);
    currentSource = source;
    source.onended = () => { currentSource = null; if (onEnd) onEnd(); };
    source.start();
};

ttsService.init();