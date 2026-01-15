
import { GameId, ExerciseTemplate, GuidePack, NBackConfig, SequenceConfig, StroopConfig, MemoryConfig, SnapshotConfig, AudioNBackConfig, EchoSequenceConfig, StoryListenerConfig, CasilleroPracticeConfig } from './types';
import { Brain, Hash, Layers, Eye, Zap, Mic, Ear, Radio, Users, Compass, Clock, Anchor, BookOpen } from 'lucide-react';

export const GAME_DEFINITIONS: Record<GameId, { title: string; description: string; iconName: string; science: string; color: string }> = {
  nback: {
    title: "N-Back Visual",
    description: "¿Coincide con la posición anterior?",
    iconName: "Layers",
    science: "Entrena la 'Memoria de Trabajo': la capacidad de mantener y manipular información temporalmente. Es crucial para el razonamiento fluido y la inteligencia general.",
    color: "bg-indigo-500"
  },
  'audio-nback': {
    title: "N-Back Auditivo",
    description: "Detecta coincidencias de letras habladas.",
    iconName: "Ear",
    science: "Fuerza al cerebro a mantener un flujo de audio en el 'bucle fonológico' mientras procesa nueva información entrante, mejorando la atención auditiva sostenida.",
    color: "bg-purple-500"
  },
  'casillero-practice': {
    title: "Práctica de Casilleros",
    description: "Convierte números en imágenes rápido.",
    iconName: "BookOpen",
    science: "Automatiza el Código Fonético de Ramón Campayo. Al reducir la carga cognitiva de la conversión, liberas recursos mentales para crear asociaciones más creativas y duraderas.",
    color: "bg-amber-500"
  },
  sequence: {
    title: "Secuencia Visual",
    description: "Memoriza el orden de los números.",
    iconName: "Hash",
    science: "Mejora la capacidad de 'Chunking' (agrupamiento). Tu cerebro aprende a comprimir bits de información (dígitos) en paquetes más grandes para recordarlos mejor.",
    color: "bg-blue-500"
  },
  'echo-sequence': {
    title: "Eco Verbal",
    description: "Repite la secuencia numérica oída.",
    iconName: "Mic",
    science: "Aísla el procesamiento auditivo puro. Entrena la retención inmediata de datos verbales sin apoyo visual, esencial para seguir instrucciones orales.",
    color: "bg-cyan-500"
  },
  memory: {
    title: "Parejas",
    description: "Encuentra las cartas idénticas.",
    iconName: "Brain",
    science: "Ejercita la memoria espacial y episódica a corto plazo. Refuerza la asociación entre 'qué' (objeto) y 'dónde' (ubicación).",
    color: "bg-pink-500"
  },
  stroop: {
    title: "Stroop",
    description: "Evita leer, di el color.",
    iconName: "Zap",
    science: "Entrena el 'Control Inhibitorio'. Debes suprimir una respuesta automática (leer) para ejecutar una tarea menos habitual (identificar color). Clave para la concentración.",
    color: "bg-orange-500"
  },
  snapshot: {
    title: "Instantánea",
    description: "Detalles de una escena fugaz.",
    iconName: "Eye",
    science: "Mejora la memoria icónica (visual ultrarrápida) y la extracción de esencia (gist). Ayuda a captar más detalles del entorno en menos tiempo.",
    color: "bg-emerald-500"
  },
  'story-listener': {
    title: "Narrativa",
    description: "Comprensión de historias breves.",
    iconName: "Radio",
    science: "Entrena la 'Codificación Elaborativa'. En lugar de memorizar palabras sueltas, el cerebro debe construir un modelo mental de significado y contexto.",
    color: "bg-teal-600"
  }
};

export const GUIDE_PACKS: GuidePack[] = [
  {
    id: 'guide_focus',
    title: 'Atención de Acero',
    question: '¿Te distraes con facilidad?',
    description: 'Un programa diseñado para fortalecer tu control inhibitorio y tu capacidad de mantener el foco en entornos ruidosos.',
    science: 'La distracción suele ser un fallo en la inhibición. Estos ejercicios entrenan a tu cerebro para ignorar lo irrelevante.',
    recommendedGames: ['stroop', 'audio-nback'],
    recommendedExercises: ['ex9', 'ex3'],
    color: 'from-orange-400 to-red-500',
    iconName: 'Zap'
  },
  {
    id: 'guide_short_term',
    title: 'Memoria de Trabajo',
    question: '¿Olvidas lo que ibas a hacer?',
    description: 'Ejercicios para ampliar tu "RAM mental", permitiéndote sostener más variables en tu cabeza simultáneamente.',
    science: 'La memoria de trabajo es el espacio de trabajo mental. Al igual que un músculo, se puede expandir con carga progresiva.',
    recommendedGames: ['nback', 'sequence'],
    recommendedExercises: ['ex5', 'ex10'],
    color: 'from-blue-400 to-indigo-500',
    iconName: 'Layers'
  },
  {
    id: 'guide_listening',
    title: 'Escucha Profunda',
    question: '¿Te hablan y no retienes?',
    description: 'Mejora drásticamente cómo procesas y almacenas la información auditiva en tiempo real.',
    science: 'Muchas veces no es "mala memoria", es "mala codificación". Estos juegos te fuerzan a procesar activamente el audio.',
    recommendedGames: ['story-listener', 'echo-sequence'],
    recommendedExercises: ['ex7', 'ex11'],
    color: 'from-teal-400 to-emerald-500',
    iconName: 'Ear'
  },
  {
    id: 'guide_names',
    title: 'Rostros y Nombres',
    question: '¿Olvidas cómo se llama?',
    description: 'Técnicas de asociación visual y verbal para anclar identidades en tu memoria a largo plazo.',
    science: 'Recordar nombres requiere conectar información abstracta (nombre) con visual (cara). La asociación creativa es la clave.',
    recommendedGames: ['memory', 'snapshot'],
    recommendedExercises: ['ex4', 'ex2'],
    color: 'from-pink-400 to-rose-500',
    iconName: 'Users'
  }
];

type DifficultySettings = {
  easy: any;
  medium: any;
  hard: any;
};

export const DIFFICULTY_CONFIGS: Record<GameId, DifficultySettings> = {
  nback: {
    easy: { n: 1, speedMs: 2500, totalTurns: 15, multiplier: 1 } as NBackConfig,
    medium: { n: 2, speedMs: 2000, totalTurns: 20, multiplier: 1.5 } as NBackConfig,
    hard: { n: 3, speedMs: 1500, totalTurns: 25, multiplier: 2.5 } as NBackConfig,
  },
  'audio-nback': {
    easy: { n: 1, speedMs: 3000, totalTurns: 15, multiplier: 1.2 } as AudioNBackConfig,
    medium: { n: 2, speedMs: 2500, totalTurns: 20, multiplier: 1.8 } as AudioNBackConfig,
    hard: { n: 3, speedMs: 2000, totalTurns: 25, multiplier: 3.0 } as AudioNBackConfig,
  },
  'casillero-practice': {
    easy: { maxNumber: 20, rounds: 5, timePerRound: 0, multiplier: 1 } as CasilleroPracticeConfig,
    medium: { maxNumber: 50, rounds: 10, timePerRound: 20, multiplier: 1.5 } as CasilleroPracticeConfig,
    hard: { maxNumber: 100, rounds: 15, timePerRound: 12, multiplier: 2.5 } as CasilleroPracticeConfig,
  },
  sequence: {
    easy: { startLength: 3, displayTimeMs: 1200, multiplier: 1 } as SequenceConfig,
    medium: { startLength: 4, displayTimeMs: 1000, multiplier: 1.5 } as SequenceConfig,
    hard: { startLength: 5, displayTimeMs: 800, multiplier: 2.0 } as SequenceConfig,
  },
  'echo-sequence': {
    easy: { startLength: 3, speechRate: 0.8, multiplier: 1.2 } as EchoSequenceConfig,
    medium: { startLength: 4, speechRate: 1.0, multiplier: 1.7 } as EchoSequenceConfig,
    hard: { startLength: 5, speechRate: 1.3, multiplier: 2.5 } as EchoSequenceConfig,
  },
  stroop: {
    easy: { timeLimit: 45, conflictProbability: 0.3, multiplier: 1 } as StroopConfig,
    medium: { timeLimit: 30, conflictProbability: 0.5, multiplier: 1.5 } as StroopConfig,
    hard: { timeLimit: 20, conflictProbability: 0.8, multiplier: 2.0 } as StroopConfig,
  },
  memory: {
    easy: { pairCount: 6, previewTimeMs: 3000, multiplier: 1 } as MemoryConfig,   
    medium: { pairCount: 10, previewTimeMs: 1500, multiplier: 1.5 } as MemoryConfig, 
    hard: { pairCount: 15, previewTimeMs: 0, multiplier: 2.0 } as MemoryConfig,    
  },
  snapshot: {
    easy: { itemsCount: 4, memorizeTimeMs: 5000, rounds: 5, multiplier: 1 } as SnapshotConfig,
    medium: { itemsCount: 7, memorizeTimeMs: 4000, rounds: 7, multiplier: 1.5 } as SnapshotConfig,
    hard: { itemsCount: 12, memorizeTimeMs: 3000, rounds: 10, multiplier: 2.0 } as SnapshotConfig,
  },
  'story-listener': {
    easy: { storyLengthWords: 40, questionComplexity: 'simple', multiplier: 1 } as StoryListenerConfig,
    medium: { storyLengthWords: 80, questionComplexity: 'simple', multiplier: 1.5 } as StoryListenerConfig,
    hard: { storyLengthWords: 120, questionComplexity: 'inference', multiplier: 2.0 } as StoryListenerConfig,
  }
};

export const EXERCISE_TEMPLATES: ExerciseTemplate[] = [
  // Visual / General
  { id: 'ex1', title: 'Palacio de la Memoria', type: 'visualization', difficulty: 'Difícil', description: 'Construye un espacio mental.', benefits: 'Mejora la memoria espacial y la capacidad de recuperar listas largas.' },
  { id: 'ex2', title: 'Asociación Absurda', type: 'association', difficulty: 'Medio', description: 'Une conceptos dispares.', benefits: 'Fomenta la creatividad y fortalece las conexiones neuronales nuevas.' },
  { id: 'ex3', title: 'Observación Activa', type: 'observation', difficulty: 'Fácil', description: 'Detalles del entorno.', benefits: 'Entrena la atención plena y la memoria a corto plazo visual.' },
  { id: 'ex4', title: 'Recordar Nombres', type: 'association', difficulty: 'Medio', description: 'Técnica para rostros.', benefits: 'Utilidad práctica social y fortalecimiento de la memoria asociativa.' },
  { id: 'ex5', title: 'Lista de la Compra', type: 'association', difficulty: 'Fácil', description: 'Cadena de objetos.', benefits: 'Técnica básica de mnemotecnia para uso diario.' },
  { id: 'ex6', title: 'Foto Mental', type: 'observation', difficulty: 'Fácil', description: 'Captura una imagen mental.', benefits: 'Mejora la memoria icónica (visual inmediata).' },
  // Auditory / Encoding
  { id: 'ex7', title: 'Escucha y Visualiza', type: 'auditory', difficulty: 'Medio', description: 'Visualiza vívidamente lo que escuchas.', benefits: 'Conecta las cortezas auditiva y visual para una codificación profunda.' },
  { id: 'ex8', title: 'Método Loci Auditivo', type: 'encoding', difficulty: 'Difícil', description: 'Coloca palabras oídas en lugares.', benefits: 'Avanzada técnica de doble codificación para discursos o instrucciones.' },
  { id: 'ex9', title: 'Historia Instantánea', type: 'encoding', difficulty: 'Medio', description: 'Crea narrativa con palabras al azar.', benefits: 'Mejora la fluidez verbal y la memoria de trabajo.' },
  { id: 'ex10', title: 'Chunking Auditivo', type: 'auditory', difficulty: 'Fácil', description: 'Agrupa números oídos.', benefits: 'Estrategia fundamental para ampliar la capacidad de retención numérica.' },
  { id: 'ex11', title: 'Escucha Intencional', type: 'auditory', difficulty: 'Medio', description: 'Detecta info específica.', benefits: 'Entrena la atención selectiva en entornos ruidosos.' },
  { id: 'ex12', title: 'Recuperación Diferida', type: 'encoding', difficulty: 'Difícil', description: 'Recuerda tras una pausa.', benefits: 'Fortalece la consolidación de la memoria a largo plazo.' },
];
