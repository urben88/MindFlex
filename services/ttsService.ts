import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

// Helper to decode Base64 from API
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
  /**
   * Speak text using either Browser TTS or AI TTS
   * @param text Text to speak
   * @param rate Speed (1.0 is normal)
   * @param onEnd Callback when finished
   * @param useAi Request high-quality AI voice (adds latency, requires API Key)
   */
  speak: async (text: string, rate: number = 1.0, onEnd?: () => void, useAi: boolean = false) => {
    // Stop any current audio
    ttsService.cancel();

    if (useAi && API_KEY) {
        try {
            await playAiAudio(text, rate, onEnd);
            return;
        } catch (error) {
            console.warn("AI TTS failed, falling back to browser", error);
            // Fallback continues below
        }
    }

    playBrowserAudio(text, rate, onEnd);
  },

  cancel: () => {
    // Cancel Browser
    window.speechSynthesis.cancel();
    
    // Cancel Web Audio
    if (currentSource) {
      try {
        currentSource.stop();
        currentSource.disconnect();
      } catch (e) {
          // ignore
      }
      currentSource = null;
    }
  },

  init: () => {
    window.speechSynthesis.getVoices();
    // Init AudioContext on user gesture usually, but we can try to instantiate
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }
};

const playBrowserAudio = (text: string, rate: number, onEnd?: () => void) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    
    const voices = window.speechSynthesis.getVoices();
    // Try to find a premium browser voice
    const spanishVoice = voices.find(v => v.lang.includes('es') && (v.name.includes('Google') || v.name.includes('Microsoft'))) 
                         || voices.find(v => v.lang.includes('es'));
    if (spanishVoice) utterance.voice = spanishVoice;

    utterance.onend = () => { if (onEnd) onEnd(); };
    utterance.onerror = (e) => { console.error("Browser TTS error", e); if (onEnd) onEnd(); };
    
    window.speechSynthesis.speak(utterance);
};

const playAiAudio = async (text: string, rate: number, onEnd?: () => void) => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: {
        parts: [{ text: text }],
      },
      config: {
        responseModalities: ['AUDIO'], 
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is a balanced, pleasant voice
            },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error("No audio data received from API");

    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const arrayBuffer = decodeBase64(audioData);
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    
    // Note: Changing playbackRate on AudioBuffer shifts pitch unless we use a phase vocoder (complex).
    // For stories (rate ~1.0), this is fine. For extreme rates, browser TTS is safer.
    if (rate !== 1.0) {
        source.playbackRate.value = rate; 
    }

    source.connect(audioContext.destination);
    
    currentSource = source;

    source.onended = () => {
      currentSource = null;
      if (onEnd) onEnd();
    };

    source.start();
};

// Initialize immediately
ttsService.init();