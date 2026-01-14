import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  ArrowLeft, Book, Search, Zap, Hash, List,
  Coffee, Footprints, Cloud, Bird, Waves, PawPrint, 
  Rocket, Axe, Feather, Circle, Link, Lightbulb, Eye, GraduationCap
} from 'lucide-react';
import { PHONETIC_RULES, CASILLERO_BASE, CASILLERO_FULL } from '../data/casilleroData';

export const CasilleroView: React.FC = () => {
  const { navigate } = useStore();
  const [activeTab, setActiveTab] = useState<'basics' | 'reference'>('basics');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-black relative transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-neutral-800 p-4 sticky top-0 z-20 flex items-center justify-between shadow-sm transition-colors">
        <button 
          onClick={() => navigate('home')}
          className="p-2 -ml-2 text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Casillero Mental</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#0a0a0a] p-2 flex space-x-2 border-b border-slate-100 dark:border-neutral-900 transition-colors">
        <button
          onClick={() => setActiveTab('basics')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'basics' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-400 dark:text-neutral-500 hover:bg-slate-50 dark:hover:bg-neutral-800'
          }`}
        >
          <Book size={16} />
          Fundamentos
        </button>
        <button
          onClick={() => setActiveTab('reference')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'reference' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-400 dark:text-neutral-500 hover:bg-slate-50 dark:hover:bg-neutral-800'
          }`}
        >
          <List size={16} />
          Lista 0-100
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
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
  2: Footprints,   // Ñu
  3: Cloud,        // Humo
  4: Bird,         // Oca
  5: Waves,        // Ola
  6: PawPrint,     // Oso
  7: Rocket,       // Ufo
  8: Axe,          // Hacha
  9: Feather,      // Ave
  0: Circle        // Aro
};

const GuideStep: React.FC<{ number: number; title: string; desc: string; icon: React.ElementType; color: string }> = ({ number, title, desc, icon: Icon, color }) => (
    <div className="flex gap-4 items-start bg-white dark:bg-[#0a0a0a] p-4 rounded-xl border border-slate-100 dark:border-neutral-800 shadow-sm transition-colors">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shrink-0 font-bold text-white shadow-sm`}>
            {number}
        </div>
        <div>
            <div className="flex items-center gap-2 mb-1">
                <Icon size={16} className="text-slate-400 dark:text-neutral-500" />
                <h4 className="font-bold text-slate-800 dark:text-slate-100">{title}</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
        </div>
    </div>
);

const BasicsSection: React.FC = () => {
    return (
        <div className="p-6 space-y-8 pb-12">
            <section className="space-y-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">Guía de Inicio Rápido</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        El Sistema Mayor (Casillero) te permite memorizar cualquier cifra convirtiendo números abstractos en imágenes tangibles.
                    </p>
                </div>

                <div className="space-y-3">
                    <GuideStep number={1} title="El Código Fonético" desc="Cada número (0-9) tiene asignado un sonido de consonante (ej: 1 = T/D, 2 = N)." icon={Hash} color="bg-indigo-500" />
                    <GuideStep number={2} title="Crear Palabras" desc="Para el número 1, usamos la 'T'. Si agregamos la vocal 'e', formamos 'Té'." icon={Lightbulb} color="bg-blue-500" />
                    <GuideStep number={3} title="Fijar la Imagen" desc="Memoriza las imágenes base de abajo. El 1 SIEMPRE será una taza de Té." icon={Eye} color="bg-emerald-500" />
                    <GuideStep number={4} title="Asociar" desc="Imagina a la persona u objeto interactuando con tu imagen del casillero." icon={Link} color="bg-orange-500" />
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Zap className="text-yellow-500" size={24} />
                        Los Cimientos (0-9)
                    </h3>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-full">Memorizar esto</span>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    {CASILLERO_BASE.map((peg) => {
                        const Icon = PEG_ICONS[peg.number] || Circle;
                        const useContain = [0, 1, 2, 4, 7, 8].includes(peg.number);

                        return (
                            <div key={peg.number} className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-neutral-800 shadow-lg overflow-hidden relative group transition-colors">
                                <div className="p-5 flex items-center gap-4 border-b border-slate-50 dark:border-neutral-900 relative z-10 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm transition-colors">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center font-black text-2xl text-slate-400 dark:text-neutral-500 shrink-0 transition-colors">
                                        {peg.number}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-black text-2xl text-slate-800 dark:text-slate-100">{peg.word}</div>
                                        <div className="text-sm text-slate-500 dark:text-neutral-400 leading-snug">{peg.association}</div>
                                    </div>
                                    <div className="text-slate-300 dark:text-neutral-700">
                                        <Icon size={28} strokeWidth={1.5} />
                                    </div>
                                </div>
                                
                                <div className="w-full h-64 bg-white dark:bg-neutral-900 relative flex items-center justify-center overflow-hidden transition-colors">
                                    {peg.imageUrl ? (
                                        <img 
                                            src={peg.imageUrl} 
                                            alt={peg.word} 
                                            loading="lazy"
                                            className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${useContain ? 'object-contain p-4' : 'object-cover'}`}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-300 dark:text-neutral-700">
                                            <Icon size={48} />
                                        </div>
                                    )}
                                    {!useContain && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="bg-slate-100 dark:bg-neutral-900 rounded-3xl p-6 transition-colors">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <GraduationCap className="text-slate-600 dark:text-neutral-400" size={24} />
                    Reglas Fonéticas
                </h3>
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] shadow-sm transition-colors">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-neutral-900 transition-colors">
                            <tr>
                                <th className="p-3 text-left font-bold text-slate-600 dark:text-neutral-400">Nº</th>
                                <th className="p-3 text-left font-bold text-slate-600 dark:text-neutral-400">Sonido</th>
                                <th className="p-3 text-left font-bold text-slate-600 dark:text-neutral-400">Ejemplo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 transition-colors">
                            {PHONETIC_RULES.map((rule) => (
                                <tr key={rule.digit} className="bg-white dark:bg-[#0a0a0a] hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
                                    <td className="p-3 font-bold text-center text-primary dark:text-indigo-400">{rule.digit}</td>
                                    <td className="p-3 font-medium text-slate-700 dark:text-slate-200">{rule.letter}</td>
                                    <td className="p-3 text-slate-500 dark:text-neutral-500">{rule.example}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

const ReferenceSection: React.FC<{ searchTerm: string; setSearchTerm: (s: string) => void }> = ({ searchTerm, setSearchTerm }) => {
  const filtered = CASILLERO_FULL
    .filter(item => item.number.toString().includes(searchTerm) || item.word.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.number - b.number);

  return (
    <div className="p-4 h-full flex flex-col bg-slate-50 dark:bg-black transition-colors">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500" size={20} />
        <input 
            type="text"
            placeholder="Buscar número o palabra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] dark:text-slate-100 focus:border-indigo-500 focus:ring-0 transition-colors"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pb-20 hide-scrollbar">
         {filtered.length === 0 ? (
             <div className="text-center text-slate-400 dark:text-neutral-600 mt-10">No encontrado</div>
         ) : (
             filtered.map((item) => (
                <div key={item.number} className="flex items-center bg-white dark:bg-[#0a0a0a] p-3 rounded-xl border border-slate-100 dark:border-neutral-800 shadow-sm transition-colors">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-lg flex items-center justify-center font-bold text-lg mr-4 shrink-0 transition-colors">
                        {item.number}
                    </div>
                    <div className="font-bold text-slate-700 dark:text-slate-200 text-lg">
                        {item.word}
                    </div>
                </div>
             ))
         )}
      </div>
    </div>
  );
};