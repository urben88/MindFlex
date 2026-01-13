import { GoogleGenAI, Type } from "@google/genai";
import { ExerciseTemplate, StoryGameData, ExerciseContent } from "../types";

const API_KEY = process.env.API_KEY || ''; // Injected by environment

// Simple in-memory cache to save tokens during a session for non-persistent items
const memoryCache: {
    exercises: Map<string, ExerciseContent>;
    stories: Map<string, StoryGameData>;
} = {
    exercises: new Map(),
    stories: new Map(),
};

export const aiService = {
  isAvailable: () => !!API_KEY,

  generateExerciseContent: async (template: ExerciseTemplate): Promise<ExerciseContent> => {
    // 1. Check Cache first to save tokens
    if (memoryCache.exercises.has(template.id)) {
        console.log(`[Cache Hit] Exercise: ${template.id}`);
        return memoryCache.exercises.get(template.id)!;
    }

    if (!API_KEY) return aiService.getFallbackContent(template);

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      const prompt = `
        Genera contenido estructurado para un ejercicio de memoria tipo: "${template.type}" (${template.title}).
        Objetivo: ${template.benefits}.
        
        Devuelve un JSON con:
        - instruction: La instrucción principal (corta).
        - steps: 3 pasos específicos para ejecutarlo mentalmente.
        - items: Una lista de 2 a 5 elementos concretos (palabras, objetos o conceptos) para trabajar.
        - example: Un ejemplo de cómo resolverlo (ej. una mnemotecnia, una imagen visual descrita).
        - mechanic: Elige uno: 'timer' (si es visualizar), 'input' (si es asociar), 'audio_list' (si es auditivo), 'flip' (si es observación).
      `;

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

      const text = response.text;
      if (!text) return aiService.getFallbackContent(template);
      
      const content = JSON.parse(text) as ExerciseContent;
      
      // 2. Save to Cache
      memoryCache.exercises.set(template.id, content);
      
      return content;

    } catch (error) {
      console.error("AI Generation failed", error);
      return aiService.getFallbackContent(template);
    }
  },

  generateStoryGame: async (difficulty: string): Promise<StoryGameData | null> => {
    // 1. Check Cache
    const cacheKey = `story_${difficulty}`;
    if (memoryCache.stories.has(cacheKey)) {
         console.log(`[Cache Hit] Story: ${difficulty}`);
         return memoryCache.stories.get(cacheKey)!;
    }

    if (!API_KEY) return null;

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Genera una historia corta en español (max 60 palabras) para un juego de memoria auditiva.
            Dificultad: ${difficulty}.
            Incluye una pregunta sobre un detalle específico de la historia, 4 opciones de respuesta y el índice de la correcta.
            Devuelve SOLO un objeto JSON.
            `,
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

        const text = response.text;
        if (!text) return null;
        
        const story = JSON.parse(text) as StoryGameData;
        
        // 2. Save to Cache
        memoryCache.stories.set(cacheKey, story);

        return story;

    } catch (error) {
        console.error("AI Story Generation failed", error);
        return null;
    }
  },

  getFeedback: async (gameName: string, score: number, accuracy: number): Promise<string> => {
    if (!API_KEY) return `¡Bien hecho! Precisión: ${Math.round(accuracy * 100)}%.`;

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `El usuario jugó "${gameName}". Score: ${score}, Precisión: ${Math.round(accuracy * 100)}%. Da un consejo motivacional muy breve (1 frase) en español.`,
        });
        return response.text || "¡Sigue practicando para mejorar!";
    } catch (error) {
        console.error("AI Feedback failed", error);
        return "¡Buen trabajo! Sigue así.";
    }
  },

  getFallbackContent: (template: ExerciseTemplate): ExerciseContent => {
    const fallbacks: Record<string, ExerciseContent> = {
      visualization: {
          instruction: "Palacio de la Memoria Básico",
          steps: ["Visualiza la puerta de tu casa.", "Coloca un objeto gigante en la entrada.", "Entra y coloca otro objeto en el pasillo."],
          items: ["Elefante Rosa", "Reloj de Arena"],
          example: "Imagina que el elefante bloquea la puerta y debes pasar por debajo.",
          mechanic: "timer"
      },
      association: {
          instruction: "Vinculación Creativa",
          steps: ["Lee las dos palabras.", "Crea una imagen mental que las una.", "Cuanto más absurda, mejor."],
          items: ["Plátano", "Coche"],
          example: "Un coche con ruedas hechas de plátanos que resbalan.",
          mechanic: "input"
      },
      observation: {
          instruction: "Entorno Inmediato",
          steps: ["Mira a tu alrededor.", "Encuentra objetos de un color.", "Cierra los ojos y enuméralos."],
          items: ["Color Rojo", "Formas Circulares"],
          example: "Busca 3 cosas rojas ahora mismo.",
          mechanic: "timer"
      },
      auditory: {
          instruction: "Eco Mental",
          steps: ["Escucha la lista.", "Repítela en tu cabeza con la voz de quien la dijo.", "Dila en voz alta al revés."],
          items: ["Sol", "Mar", "Luz", "Paz"],
          example: "Visualiza cada palabra flotando mientras la escuchas.",
          mechanic: "audio_list"
      }
    };
    
    // Generic fallback mapping based on type
    if (template.type === 'visualization') return fallbacks.visualization;
    if (template.type === 'association') return fallbacks.association;
    if (template.type === 'observation') return fallbacks.observation;
    return fallbacks.auditory;
  }
};