
export interface PegItem {
  number: number;
  word: string;
  association?: string;
  imageUrl?: string;
  emoji?: string;
  logic?: string;
}

export interface PhoneticRule {
  digit: number;
  letter: string;
  logic: string;
  example: string;
  details: string;
}

export const PHONETIC_RULES: PhoneticRule[] = [
  { 
    digit: 1, 
    letter: 'T, D', 
    logic: 'La "t" es una línea vertical, igual que el 1.', 
    example: 'Té, Día',
    details: 'Porque la letra "t" tiene un solo trazo vertical, igual que el número 1. (La "d" se incluye por sonido similar).'
  },
  { 
    digit: 2, 
    letter: 'N, Ñ', 
    logic: 'La "n" tiene dos patitas.', 
    example: 'Noé, Ñu',
    details: 'Porque la letra "n" tiene dos patitas (trazos verticales).'
  },
  { 
    digit: 3, 
    letter: 'M', 
    logic: 'La "m" tiene tres patitas.', 
    example: 'Humo',
    details: 'Porque la letra "m" tiene tres patitas.'
  },
  { 
    digit: 4, 
    letter: 'C, K, Q', 
    logic: 'Cuatro empieza por C.', 
    example: 'Oca, Kilo, Esquí',
    details: 'Porque la palabra "Cuatro" empieza por C. Además, una "C" mayúscula parece un 4 si se le añade una línea.'
  },
  { 
    digit: 5, 
    letter: 'L', 
    logic: 'L es 50 en romanos.', 
    example: 'Ola, Ley',
    details: 'Porque el número romano L vale 50 (contiene el 5). También porque la mano abierta (5 dedos) forma un ángulo como una L entre el pulgar y el índice.'
  },
  { 
    digit: 6, 
    letter: 'S, Z', 
    logic: 'Seis empieza por S.', 
    example: 'Oso, Zoo',
    details: 'Porque la palabra "Seis" empieza por S y la palabra "Zeta" tiene un sonido similar.'
  },
  { 
    digit: 7, 
    letter: 'F', 
    logic: 'F parece un 7 invertido.', 
    example: 'Fe',
    details: 'Porque una "F" mayúscula se parece a un 7 puesto al revés y con una rayita.'
  },
  { 
    digit: 8, 
    letter: 'CH, G, J', 
    logic: 'g parece un 8.', 
    example: 'Hacha, Gato',
    details: 'Porque la letra "g" escrita a mano parece un 8. También porque la palabra "oCHo" contiene el sonido CH.'
  },
  { 
    digit: 9, 
    letter: 'V, B, P', 
    logic: '9 parece una b o p.', 
    example: 'Uva, Boa, Pie',
    details: 'Porque el número 9 parece una "b" o una "p" invertida o girada.'
  },
  { 
    digit: 0, 
    letter: 'R', 
    logic: 'ceRo contiene la R.', 
    example: 'Aro, Rey',
    details: 'Porque la palabra "ceRo" contiene la R. (No usa la "C" porque ya la usó en el 4).'
  },
];

export const CASILLERO_BASE: PegItem[] = [
  { 
    number: 1, 
    word: 'Tea', 
    emoji: '🔥',
    association: 'Visualiza una antorcha (Tea) ardiendo con fuego vivo y calor.',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    number: 2, 
    word: 'Ñu', 
    emoji: '🐃',
    association: 'Un animal africano con cuernos corriendo o embistiendo.',
    imageUrl: 'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=800&q=80'
  },
  { 
    number: 3, 
    word: 'Humo', 
    emoji: '💨',
    association: 'Una columna de humo negro y denso que puedes oler.',
    imageUrl: 'https://services.meteored.com/img/article/el-viaje-del-humo-180891-1_1280.jpg'
  },
  { 
    number: 4, 
    word: 'Oca', 
    emoji: '🦢',
    association: 'Un ave blanca grande graznando muy fuerte.',
    imageUrl: 'https://m.media-amazon.com/images/I/81SM6k+7epL.png'
  },
  { 
    number: 5, 
    word: 'Ola', 
    emoji: '🌊',
    association: 'Un tsunami gigante de agua azul a punto de romper.',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80'
  },
  { 
    number: 6, 
    word: 'Oso', 
    emoji: '🐻',
    association: 'Un oso pardo gigante, peludo y feroz.',
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80'
  },
  { 
    number: 7, 
    word: 'Fe', 
    emoji: '🙏',
    association: 'Visualiza una luz divina o una sensación de fe y paz absoluta.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWJYPtKRgtKc6Kr1ghyXroM5q1v0qQVYNXEw&s'
  },
  { 
    number: 8, 
    word: 'Hacha', 
    emoji: '🪓',
    association: 'Un hacha afilada clavada en un tronco de madera.',
    imageUrl: 'https://i.etsystatic.com/13677386/r/il/86f301/5036799324/il_570xN.5036799324_e7z6.jpg'
  },
  { 
    number: 9, 
    word: 'Ave', 
    emoji: '🦅',
    association: 'Un pájaro rapaz gigante en pleno vuelo.',
    imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80'
  },
  { 
    number: 0, 
    word: 'Aro', 
    emoji: '⭕',
    association: 'Un aro metálico o de hula-hop girando sin parar.',
    imageUrl: 'https://www.visualizeledshow.com/images/cerchio.jpg'
  },
];

export const CASILLERO_FULL: PegItem[] = [
  ...CASILLERO_BASE,
  { number: 10, word: 'Toro', emoji: '🐂' }, { number: 11, word: 'Teta', emoji: '🍼' }, { number: 12, word: 'Tina', emoji: '🛁' }, { number: 13, word: 'Átomo', emoji: '⚛️' }, { number: 14, word: 'Taco', emoji: '🌮' },
  { number: 15, word: 'Tela', emoji: '🧵' }, { number: 16, word: 'Taza', emoji: '🍵' }, { number: 17, word: 'Tufo', emoji: '🤢' }, { number: 18, word: 'Techo', emoji: '🏠' }, { number: 19, word: 'Tubo', emoji: '🧪' },
  { number: 20, word: 'Noria', emoji: '🎡' }, { number: 21, word: 'Nido', emoji: '🪺' }, { number: 22, word: 'Niño', emoji: '👶' }, { number: 23, word: 'Gnomo', emoji: '👺' }, { number: 24, word: 'Nuca', emoji: '🧘' },
  { number: 25, word: 'Nilo', emoji: '🐊' }, { number: 26, word: 'Nuez', emoji: '🥜' }, { number: 27, word: 'Naife', emoji: '🔪' }, { number: 28, word: 'Nicho', emoji: '⚰️' }, { number: 29, word: 'Nube', emoji: '☁️' },
  { number: 30, word: 'Mar', emoji: '⚓' }, { number: 31, word: 'Moto', emoji: '🏍️' }, { number: 32, word: 'Mano', emoji: '✋' }, { number: 33, word: 'Momia', emoji: '🧟' }, { number: 34, word: 'Maca', emoji: '🦜' },
  { number: 35, word: 'Mula', emoji: '🫏' }, { number: 36, word: 'Mesa', emoji: '🪑' }, { number: 37, word: 'Mafia', emoji: '🕶️' }, { number: 38, word: 'Mago', emoji: '🪄' }, { number: 39, word: 'Mapa', emoji: '🗺️' },
  { number: 40, word: 'Coro', emoji: '🎶' }, { number: 41, word: 'Cohete', emoji: '🚀' }, { number: 42, word: 'Cuna', emoji: '🛏️' }, { number: 43, word: 'Cama', emoji: '😴' }, { number: 44, word: 'Coco', emoji: '🥥' },
  { number: 45, word: 'Cola', emoji: '🥤' }, { number: 46, word: 'Casa', emoji: '🏡' }, { number: 47, word: 'Café', emoji: '☕' }, { number: 48, word: 'Coche', emoji: '🚗' }, { number: 49, word: 'Cubo', emoji: '📦' },
  { number: 50, word: 'Loro', emoji: '🦜' }, { number: 51, word: 'Lata', emoji: '🥫' }, { number: 52, word: 'Luna', emoji: '🌙' }, { number: 53, word: 'Lima', emoji: '🍋' }, { number: 54, word: 'Loco', emoji: '🤪' },
  { number: 55, word: 'Lulú', emoji: '🐩' }, { number: 56, word: 'Losa', emoji: '🪦' }, { number: 57, word: 'Alfa', emoji: '🐺' }, { number: 58, word: 'Lucha', emoji: '🤼' }, { number: 59, word: 'Lobo', emoji: '🐺' },
  { number: 60, word: 'Sor', emoji: '⛪' }, { number: 61, word: 'Seta', emoji: '🍄' }, { number: 62, word: 'Sena', emoji: '🗼' }, { number: 63, word: 'Sima', emoji: '🕕' }, { number: 64, word: 'Saco', emoji: '💰' },
  { number: 65, word: 'Sol', emoji: '☀️' }, { number: 66, word: 'Sesos', emoji: '🧠' }, { number: 67, word: 'Sofá', emoji: '🛋️' }, { number: 68, word: 'Soga', emoji: '🪢' }, { number: 69, word: 'Sapo', emoji: '🐸' },
  { number: 70, word: 'Faro', emoji: '🚨' }, { number: 71, word: 'Foto', emoji: '📸' }, { number: 72, word: 'Faena', emoji: '🐂' }, { number: 73, word: 'Fama', emoji: '🌟' }, { number: 74, word: 'Foca', emoji: '🦭' },
  { number: 75, word: 'Fila', emoji: '👥' }, { number: 76, word: 'Foso', emoji: '🏰' }, { number: 77, word: 'Fofó', emoji: '🤡' }, { number: 78, word: 'Ficha', emoji: '🪙' }, { number: 79, word: 'Fobia', emoji: '😨' },
  { number: 80, word: 'Gorra', emoji: '🧢' }, { number: 81, word: 'Gato', emoji: '🐱' }, { number: 82, word: 'Genio', emoji: '🧞' }, { number: 83, word: 'Goma', emoji: '🩹' }, { number: 84, word: 'Gaucho', emoji: '🐎' },
  { number: 85, word: 'Gol', emoji: '⚽' }, { number: 86, word: 'Gas', emoji: '⛽' }, { number: 87, word: 'Jefe', emoji: '💼' }, { number: 88, word: 'Chicha', emoji: '🍗' }, { number: 89, word: 'Chivo', emoji: '🐐' },
  { number: 90, word: 'Bar', emoji: '🍻' }, { number: 91, word: 'Bota', emoji: '🥾' }, { number: 92, word: 'Vino', emoji: '🍷' }, { number: 93, word: 'Bomba', emoji: '💣' }, { number: 94, word: 'Vaca', emoji: '🐄' },
  { number: 95, word: 'Vela', emoji: '🕯️' }, { number: 96, word: 'Vaso', emoji: '🥃' }, { number: 97, word: 'Bofetá', emoji: '🖐️' }, { number: 98, word: 'Bache', emoji: '🕳️' }, { number: 99, word: 'Bebé', emoji: '👶' },
  { number: 100, word: 'Torero', emoji: '🐂' }
];
