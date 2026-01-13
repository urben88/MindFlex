
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  ArrowLeft, Book, Search, Brain, Zap, Hash, List,
  Coffee, Footprints, Cloud, Bird, Waves, PawPrint, 
  Rocket, Axe, Feather, Circle
} from 'lucide-react';
import { PHONETIC_RULES, CASILLERO_BASE, CASILLERO_FULL } from '../data/casilleroData';

export const CasilleroView: React.FC = () => {
  const { navigate } = useStore();
  const [activeTab, setActiveTab] = useState<'basics' | 'reference'>('basics');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => navigate('home')}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-slate-800 text-lg">Casillero Mental</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 flex space-x-2 border-b border-slate-100">
        <button
          onClick={() => setActiveTab('basics')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'basics' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          <Book size={16} />
          Fundamentos
        </button>
        <button
          onClick={() => setActiveTab('reference')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'reference' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'
          }`}
        >
          <List size={16} />
          Lista 0-100
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'basics' ? (
          <BasicsSection />
        ) : (
          <ReferenceSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        )}
      </div>
    </div>
  );
};

const PEG_ICONS: Record<number, React.ElementType> = {
  1: Coffee,       // Té
  2: Footprints,   // Ñu (corriendo)
  3: Cloud,        // Humo
  4: Bird,         // Oca
  5: Waves,        // Ola
  6: PawPrint,     // Oso
  7: Rocket,       // Ufo (Flying object)
  8: Axe,          // Hacha
  9: Feather,      // Ave
  0: Circle        // Aro
};

const BasicsSection: React.FC = () => (
  <div className="p-6 space-y-8 pb-12">
    {/* Intro */}
    <section>
      <h2 className="text-2xl font-black text-slate-800 mb-4">¿Qué es el Casillero?</h2>
      <p className="text-slate-600 leading-relaxed mb-4">
        Es tu "disco duro" mental. El cerebro no retiene números abstractos, pero sí imágenes.
        El sistema convierte cada número del 0 al 100 en una <strong>palabra-imagen fija</strong>.
      </p>
      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm text-indigo-800">
        <span className="font-bold">Regla de Oro:</span> Una vez aprendas que 1 es "Té", siempre será "Té". Nunca lo cambies.
      </div>
    </section>

    {/* Base 1-9 */}
    <section>
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Zap className="text-yellow-500" size={24} />
        Los Cimientos (0-9)
      </h3>
      <p className="text-sm text-slate-500 mb-4">Memoriza estas asociaciones. Son la base de todo.</p>
      
      <div className="grid grid-cols-1 gap-3">
        {CASILLERO_BASE.map((peg) => {
          const Icon = PEG_ICONS[peg.number] || Circle;
          return (
            <div key={peg.number} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-lg text-slate-400 shrink-0">
                  {peg.number}
               </div>
               <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Icon size={24} />
               </div>
               <div>
                  <div className="font-black text-lg text-slate-800">{peg.word}</div>
                  <div className="text-xs text-slate-500 leading-snug">{peg.association}</div>
               </div>
            </div>
          );
        })}
      </div>
    </section>

    {/* Construction Rules */}
    <section>
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Hash className="text-blue-500" size={24} />
        Construcción (10-99)
      </h3>
      <p className="text-slate-600 leading-relaxed mb-4">
        Para números mayores, usamos un código fonético. Cada dígito tiene consonantes asignadas.
        Las vocales no cuentan, se usan de relleno para formar palabras.
      </p>
      
      <div className="overflow-hidden rounded-xl border border-slate-200 mb-6">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left font-bold text-slate-600">Nº</th>
              <th className="p-3 text-left font-bold text-slate-600">Sonido</th>
              <th className="p-3 text-left font-bold text-slate-600">Ejemplo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PHONETIC_RULES.map((rule) => (
              <tr key={rule.digit} className="bg-white">
                <td className="p-3 font-bold text-center text-primary">{rule.digit}</td>
                <td className="p-3 font-medium text-slate-700">{rule.letter}</td>
                <td className="p-3 text-slate-500">{rule.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-white p-5 rounded-xl border-l-4 border-indigo-500 shadow-sm">
        <h4 className="font-bold text-slate-800 mb-2">Ejemplo: 42</h4>
        <div className="flex items-center gap-2 text-sm text-slate-600">
           <span className="font-bold bg-slate-100 px-2 py-1 rounded">4</span> = C
           <span>+</span>
           <span className="font-bold bg-slate-100 px-2 py-1 rounded">2</span> = N
           <span>→</span>
           <span className="font-bold text-indigo-600">CuNa</span>
        </div>
        <p className="mt-2 text-xs text-slate-400">Las vocales 'u' y 'a' rellenan para crear la imagen.</p>
      </div>
    </section>

    {/* Usage */}
    <section>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Brain className="text-emerald-500" size={24} />
            Cómo usarlo
        </h3>
        <p className="text-slate-600 mb-3">
            Para memorizar una lista, asocia el <strong>objeto de la lista</strong> con la <strong>imagen del casillero</strong>.
        </p>
        <ul className="list-disc list-outside pl-5 space-y-2 text-sm text-slate-600">
            <li><strong>Hazlo absurdo:</strong> Si el nº 1 es "Té" y debes recordar "Zapatos", imagina que bebes té de un zapato sucio.</li>
            <li><strong>Exagera:</strong> Tamaño gigante, colores brillantes, mucho movimiento.</li>
            <li><strong>No razones:</strong> La primera imagen que venga es la mejor.</li>
        </ul>
    </section>
  </div>
);

const ReferenceSection: React.FC<{ searchTerm: string; setSearchTerm: (s: string) => void }> = ({ searchTerm, setSearchTerm }) => {
  // Filter and then sort by number to ensure 0 comes first (0, 1, 2...)
  const filtered = CASILLERO_FULL
    .filter(
      item => 
          item.number.toString().includes(searchTerm) || 
          item.word.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.number - b.number);

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
            type="text"
            placeholder="Buscar número o palabra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-0"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pb-20">
         {filtered.length === 0 ? (
             <div className="text-center text-slate-400 mt-10">No encontrado</div>
         ) : (
             filtered.map((item) => (
                <div key={item.number} className="flex items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-lg flex items-center justify-center font-bold text-lg mr-4">
                        {item.number}
                    </div>
                    <div className="font-bold text-slate-700 text-lg">
                        {item.word}
                    </div>
                    {item.number <= 9 && (
                        <div className="ml-auto text-xs text-slate-400 hidden sm:block">
                            (Base)
                        </div>
                    )}
                </div>
             ))
         )}
      </div>
    </div>
  );
};
