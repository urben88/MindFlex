
export interface PegItem {
  number: number;
  word: string;
  association?: string;
  imageUrl?: string;
}

export const PHONETIC_RULES = [
  { digit: 1, letter: 'T, D', example: 'Té, Día' },
  { digit: 2, letter: 'N, Ñ', example: 'Noé, Ñu' },
  { digit: 3, letter: 'M', example: 'Amo, Mamá' },
  { digit: 4, letter: 'C, K, Q', example: 'Oca, Kilo' },
  { digit: 5, letter: 'L', example: 'Ola, Ley' },
  { digit: 6, letter: 'S, Z', example: 'Oso, Zoo' },
  { digit: 7, letter: 'F', example: 'Fe, UFO' },
  { digit: 8, letter: 'CH, G, J', example: 'Hacha, Gato' },
  { digit: 9, letter: 'V, B, P', example: 'Uva, Boa' },
  { digit: 0, letter: 'R', example: 'Aro, Rey' },
];

// URLs estáticas actualizadas y verificadas
export const CASILLERO_BASE: PegItem[] = [
  { 
    number: 1, 
    word: 'Té', 
    association: 'Visualiza una taza de té humeante.',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    number: 2, 
    word: 'Ñu', 
    association: 'Un ñu corriendo por la sabana.',
    imageUrl: 'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=800&q=80'
  },
  { 
    number: 3, 
    word: 'Humo', 
    association: 'Una densa nube de humo.',
    imageUrl: 'https://images.unsplash.com/photo-1524629739564-998813f5dc62?auto=format&fit=crop&w=800&q=80'
  },
  { 
    number: 4, 
    word: 'Oca', 
    association: 'Una oca blanca graznando.',
    imageUrl: 'https://images.unsplash.com/photo-1506509939521-4f16b2053186?auto=format&fit=crop&w=800&q=80'
  },
  { 
    number: 5, 
    word: 'Ola', 
    association: 'Una ola gigante de mar rompiendo.',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80'
  },
  { 
    number: 6, 
    word: 'Oso', 
    association: 'Un oso pardo de pie.',
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80'
  },
  { 
    number: 7, 
    word: 'Ufo', 
    association: 'Un objeto volador misterioso con luces.',
    imageUrl: 'https://images.unsplash.com/photo-1520034475321-cbe63696469a?auto=format&fit=crop&w=800&q=80'
  },
  { 
    number: 8, 
    word: 'Hacha', 
    association: 'Un hacha de leñador clavada en madera.',
    imageUrl: 'https://images.unsplash.com/photo-1615557760920-56c24d193d5f?auto=format&fit=crop&w=800&q=80'
  },
  { 
    number: 9, 
    word: 'Ave', 
    association: 'Un ave rapaz en pleno vuelo.',
    imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80'
  },
  { 
    number: 0, 
    word: 'Aro', 
    association: 'Un aro de luz brillante o anillo.',
    imageUrl: 'https://images.unsplash.com/photo-1533596245281-2856286f9011?auto=format&fit=crop&w=800&q=80'
  },
];

export const CASILLERO_FULL: PegItem[] = [
  ...CASILLERO_BASE,
  { number: 10, word: 'Toro' }, { number: 11, word: 'Teta' }, { number: 12, word: 'Tina' }, { number: 13, word: 'Átomo' }, { number: 14, word: 'Taco' },
  { number: 15, word: 'Tela' }, { number: 16, word: 'Taza' }, { number: 17, word: 'Tufo' }, { number: 18, word: 'Techo' }, { number: 19, word: 'Tubo' },
  { number: 20, word: 'Noria' }, { number: 21, word: 'Nido' }, { number: 22, word: 'Niño' }, { number: 23, word: 'Gnomo' }, { number: 24, word: 'Nuca' },
  { number: 25, word: 'Nilo' }, { number: 26, word: 'Nuez' }, { number: 27, word: 'Naife' }, { number: 28, word: 'Nicho' }, { number: 29, word: 'Nube' },
  { number: 30, word: 'Mar' }, { number: 31, word: 'Moto' }, { number: 32, word: 'Mano' }, { number: 33, word: 'Momia' }, { number: 34, word: 'Maca' },
  { number: 35, word: 'Mula' }, { number: 36, word: 'Mesa' }, { number: 37, word: 'Mafia' }, { number: 38, word: 'Mago' }, { number: 39, word: 'Mapa' },
  { number: 40, word: 'Coro' }, { number: 41, word: 'Cohete' }, { number: 42, word: 'Cuna' }, { number: 43, word: 'Cama' }, { number: 44, word: 'Coco' },
  { number: 45, word: 'Cola' }, { number: 46, word: 'Casa' }, { number: 47, word: 'Café' }, { number: 48, word: 'Coche' }, { number: 49, word: 'Cubo' },
  { number: 50, word: 'Loro' }, { number: 51, word: 'Lata' }, { number: 52, word: 'Luna' }, { number: 53, word: 'Lima' }, { number: 54, word: 'Loco' },
  { number: 55, word: 'Lulú' }, { number: 56, word: 'Losa' }, { number: 57, word: 'Alfa' }, { number: 58, word: 'Lucha' }, { number: 59, word: 'Lobo' },
  { number: 60, word: 'Sor' }, { number: 61, word: 'Seta' }, { number: 62, word: 'Sena' }, { number: 63, word: 'Sima' }, { number: 64, word: 'Saco' },
  { number: 65, word: 'Sol' }, { number: 66, word: 'Sesos' }, { number: 67, word: 'Sofá' }, { number: 68, word: 'Soga' }, { number: 69, word: 'Sapo' },
  { number: 70, word: 'Faro' }, { number: 71, word: 'Foto' }, { number: 72, word: 'Faena' }, { number: 73, word: 'Fama' }, { number: 74, word: 'Foca' },
  { number: 75, word: 'Fila' }, { number: 76, word: 'Foso' }, { number: 77, word: 'Fofó' }, { number: 78, word: 'Ficha' }, { number: 79, word: 'Fobia' },
  { number: 80, word: 'Gorra' }, { number: 81, word: 'Gato' }, { number: 82, word: 'Genio' }, { number: 83, word: 'Goma' }, { number: 84, word: 'Gaucho' },
  { number: 85, word: 'Gol' }, { number: 86, word: 'Gas' }, { number: 87, word: 'Jefe' }, { number: 88, word: 'Chicha' }, { number: 89, word: 'Chivo' },
  { number: 90, word: 'Bar' }, { number: 91, word: 'Bota' }, { number: 92, word: 'Vino' }, { number: 93, word: 'Bomba' }, { number: 94, word: 'Vaca' },
  { number: 95, word: 'Vela' }, { number: 96, word: 'Vaso' }, { number: 97, word: 'Bofetá' }, { number: 98, word: 'Bache' }, { number: 99, word: 'Bebé' },
  { number: 100, word: 'Torero' }
];
