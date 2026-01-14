
import { GoogleGenAI, Type } from "@google/genai";
import { ExerciseTemplate, StoryGameData, ExerciseContent } from "../types";

const memoryCache: {
    exercises: Map<string, ExerciseContent>;
    stories: Map<string, StoryGameData>;
} = {
    exercises: new Map(),
    stories: new Map(),
};

export const aiService = {
  isAvailable: () => !!process.env.API_KEY,

  generateExerciseContent: async (template: ExerciseTemplate): Promise<ExerciseContent> => {
    if (memoryCache.exercises.has(template.id)) {
        return memoryCache.exercises.get(template.id)!;
    }

    if (!process.env.API_KEY) return aiService.getFallbackContent(template);

    try {
      // Fix: Use process.env.API_KEY directly for GoogleGenAI initialization
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Genera contenido estructurado para: "${template.type}" (${template.title}). Objetivo: ${template.benefits}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    instruction: { type: Type.STRING },
                    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                    items: { type: Type.ARRAY, items: { type: Type.STRING } },
                    example: { type: Type.STRING },
                    mechanic: { type: Type.STRING, enum: ['timer', 'input', 'flip', 'audio_list'] }
                }
            }
        }
      });

      const content = JSON.parse(response.text || '{}') as ExerciseContent;
      memoryCache.exercises.set(template.id, content);
      return content;
    } catch (error) {
      console.error("AI Generation failed", error);
      return aiService.getFallbackContent(template);
    }
  },

  generateStoryGame: async (difficulty: string): Promise<StoryGameData | null> => {
    const cacheKey = `story_${difficulty}`;
    if (memoryCache.stories.has(cacheKey)) return memoryCache.stories.get(cacheKey)!;
    if (!process.env.API_KEY) return null;

    try {
        // Fix: Use process.env.API_KEY directly for GoogleGenAI initialization
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Genera una historia corta en español. Dificultad: ${difficulty}.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        text: { type: Type.STRING },
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        correctIndex: { type: Type.INTEGER }
                    }
                }
            }
        });

        const story = JSON.parse(response.text || '{}') as StoryGameData;
        memoryCache.stories.set(cacheKey, story);
        return story;
    } catch (error) {
        return null;
    }
  },

  getFeedback: async (gameName: string, score: number, accuracy: number): Promise<string> => {
    if (!process.env.API_KEY) return `¡Bien hecho! Precisión: ${Math.round(accuracy * 100)}%.`;
    try {
        // Fix: Use process.env.API_KEY directly for GoogleGenAI initialization
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Usuario jugó ${gameName}. Score ${score}, Acc ${Math.round(accuracy * 100)}%. Consejo breve.`,
        });
        return response.text || "¡Buen trabajo!";
    } catch (error) {
        return "¡Sigue así!";
    }
  },

  getFallbackContent: (template: ExerciseTemplate): ExerciseContent => {
    const fallbacks: Record<string, ExerciseContent> = {
      visualization: {
          instruction: "Palacio de la Memoria Básico",
          steps: ["Visualiza la puerta de tu casa.", "Coloca un objeto gigante.", "Entra y coloca otro."],
          items: ["Elefante Rosa", "Reloj"],
          example: "Imagina que el elefante bloquea la puerta.",
          mechanic: "timer"
      },
      association: {
          instruction: "Vinculación Creativa",
          steps: ["Lee las palabras.", "Crea una imagen mental.", "Hazla absurda."],
          items: ["Plátano", "Coche"],
          example: "Un coche con ruedas de plátano.",
          mechanic: "input"
      }
    };
    return fallbacks[template.type as keyof typeof fallbacks] || fallbacks.visualization;
  }
};
