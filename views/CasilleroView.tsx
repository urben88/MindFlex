
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  ArrowLeft, Book, Search, Zap, Hash, List,
  Flame, Footprints, Cloud, Bird, Waves, PawPrint, 
  Axe, Feather, Circle, Link, Lightbulb, Eye, GraduationCap,
  Sparkles, Move, Maximize, Brain, ChevronDown, ChevronUp
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
          className="p-2 -ml-2 text-slate-400 dark:text-neutral-400 hover:text-slate-600 dark:hover:text-white rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-slate-800 dark:text-white text-lg">Casillero Mental</h1>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#0a0a0a] p-2 flex space-x-2 border-b border-slate-100 dark:border-neutral-900 transition-colors">
        <button
          onClick={() => setActiveTab('basics')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'basics' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-400 dark:text-neutral-500 hover:bg-slate-50 dark:hover:bg-neutral-800'
          }`}
        >
          <Book size={16} />
          Método Campayo
        </button>
        <button
          onClick={() => setActiveTab('reference')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'reference' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-400 dark:text-neutral-500 hover:bg-slate-50 dark:hover:bg-neutral-800'
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
  1: Flame,        // Tea (Antorcha)
  2: Footprints,   // Ñu
  3: Cloud,        // Humo
  4: Bird,         // Oca
  5: Waves,        // Ola
  6: PawPrint,     // Oso
  7: Waves,        // Foca (hábitat marino)
  8: Axe,          // Hacha
  9: Feather,      // Ave
  0: Circle        // Aro
};

const BasicsSection: React.FC = () => {
    const [expandedRule, setExpandedRule] = useState<number | null>(null);

    return (
        <div className="p-6 space-y-10 pb-16">
            {/* Introducción */}
            <section className="space-y-4">
                <div className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden transition-colors">
                    <Brain className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
                    <h2 className="text-2xl font-black mb-2 relative z-10">Mente Prodigiosa</h2>
                    <p className="text-indigo-50 text-sm leading-relaxed relative z-10">
                        Basado en el sistema de <b>Ramón Campayo</b>. Convertimos números abstractos en imágenes <b>concretas, absurdas y recordables</b>.
                    </p>
                </div>
            </section>

            {/* Código Fonético */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Hash className="text-indigo-500" size={24} />
                    1. El Código Alfanumérico
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Asignamos consonantes según la <b>forma o el sonido</b>. Las vocales no tienen valor, solo unen. <i>(Toca una fila para ver el porqué)</i>.
                </p>
                <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden transition-colors shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-neutral-900 transition-colors">
                            <tr>
                                <th className="p-3 text-left font-bold text-slate-600 dark:text-slate-400">Nº</th>
                                <th className="p-3 text-left font-bold text-slate-600 dark:text-slate-400">Sonido</th>
                                <th className="p-3 text-left font-bold text-slate-600 dark:text-slate-400">Ejemplos</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 transition-colors">
                            {PHONETIC_RULES.map((rule) => (
                                <React.Fragment key={rule.digit}>
                                    <tr 
                                        onClick={() => setExpandedRule(expandedRule === rule.digit ? null : rule.digit)}
                                        className="hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                    >
                                        <td className="p-3 font-black text-indigo-600 dark:text-indigo-400">{rule.digit}</td>
                                        <td className="p-3 font-bold text-slate-800 dark:text-white">{rule.letter}</td>
                                        <td className="p-3 text-slate-500 dark:text-slate-400 italic">{rule.example}</td>
                                        <td className="p-3 text-slate-300 dark:text-neutral-700">
                                            {expandedRule === rule.digit ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </td>
                                    </tr>
                                    {expandedRule === rule.digit && (
                                        <tr className="bg-indigo-50/30 dark:bg-indigo-900/10 transition-colors">
                                            <td colSpan={4} className="p-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                                                <div className="flex gap-3">
                                                    <div className="w-1 bg-indigo-500 rounded-full shrink-0" />
                                                    <p><b>Por qué:</b> {rule.details}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Cimientos 1-9 */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Zap className="text-yellow-500" size={24} />
                        2. Los Cimientos (0-9)
                    </h3>
                    <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">Tus perchas</span>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    {CASILLERO_BASE.map((peg) => {
                        const Icon = PEG_ICONS[peg.number] || Circle;
                        const useContain = [0, 1, 2, 4, 7, 8].includes(peg.number);

                        return (
                            <div key={peg.number} className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-neutral-800 shadow-md overflow-hidden relative group transition-colors">
                                <div className="p-5 flex items-center gap-4 relative z-10 bg-white/95 dark:bg-[#0a0a0a]/95 transition-colors">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center font-black text-2xl text-indigo-600 dark:text-indigo-400 shrink-0 transition-colors">
                                        {peg.number}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-black text-2xl text-slate-800 dark:text-white">{peg.word} {peg.emoji}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{peg.association}</div>
                                    </div>
                                    <div className="text-slate-200 dark:text-neutral-800">
                                        <Icon size={32} />
                                    </div>
                                </div>
                                
                                <div className="w-full h-64 bg-slate-50 dark:bg-neutral-900 relative flex items-center justify-center overflow-hidden transition-colors">
                                    {peg.imageUrl ? (
                                        <img 
                                            src={peg.imageUrl} 
                                            alt={peg.word} 
                                            className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${useContain ? 'object-contain p-8' : 'object-cover'}`}
                                        />
                                    ) : (
                                        <Icon size={48} className="text-slate-200 dark:text-neutral-800" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Trucos de Asociación */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Sparkles className="text-purple-500" size={24} />
                    3. La Asociación Inverosímil
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    No imagines cosas normales. Para que el cerebro no olvide, la escena debe ser:
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <AssociationCard icon={Eye} title="Visualizar" desc="Velo como una película real en 4K." color="bg-blue-500" />
                    <AssociationCard icon={Maximize} title="Exagerar" desc="Hazlo gigante, minúsculo o infinito." color="bg-orange-500" />
                    <AssociationCard icon={Move} title="Movimiento" desc="Explosiones, carreras, acción pura." color="bg-red-500" />
                    <AssociationCard icon={Sparkles} title="Absurdo" desc="Ridículo, cómico e imposible." color="bg-purple-500" />
                </div>
            </section>

            {/* Ejemplo Práctico */}
            <section className="bg-slate-900 dark:bg-indigo-950/50 rounded-3xl p-6 text-white space-y-6 transition-colors shadow-2xl border border-indigo-500/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                        <Lightbulb className="text-yellow-300" />
                    </div>
                    <h3 className="text-xl font-bold">Ejemplo Práctico</h3>
                </div>
                <p className="text-slate-300 text-sm italic border-l-2 border-white/20 pl-4">
                    "Memoriza esta lista: Pan, Leche, Zapatos..."
                </p>
                <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shrink-0">1</div>
                        <p className="text-sm text-slate-200"><b>TEA + Pan:</b> Imagina una TEA (antorcha) gigante quemando barras de PAN en lugar de leña. Hueles el pan tostado.</p>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shrink-0">2</div>
                        <p className="text-sm text-slate-200"><b>ÑU + Leche:</b> Un ÑU bañándose en una piscina de LECHE, salpicando todo de color blanco.</p>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shrink-0">3</div>
                        <p className="text-sm text-slate-200"><b>HUMO + Zapatos:</b> De tus ZAPATOS sale un HUMO verde denso porque vas corriendo a mil por hora.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

const AssociationCard: React.FC<{ icon: any; title: string; desc: string; color: string }> = ({ icon: Icon, title, desc, color }) => (
    <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-2xl border border-slate-100 dark:border-neutral-800 transition-colors shadow-sm">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-white mb-3`}>
            <Icon size={18} />
        </div>
        <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{title}</h4>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{desc}</p>
    </div>
);

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
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:border-indigo-500 focus:ring-0 transition-colors"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pb-20 hide-scrollbar">
         {filtered.length === 0 ? (
             <div className="text-center text-slate-400 dark:text-neutral-600 mt-10 italic">No se encontraron resultados</div>
         ) : (
             filtered.map((item) => (
                <div key={item.number} className="flex items-center bg-white dark:bg-[#0a0a0a] p-3 rounded-xl border border-slate-100 dark:border-neutral-800 shadow-sm transition-colors group active:bg-slate-50 dark:active:bg-neutral-900">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg flex items-center justify-center font-bold text-lg mr-4 shrink-0 transition-colors">
                        {item.number}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">{item.emoji || '✨'}</div>
                        <div className="font-bold text-slate-700 dark:text-slate-200 text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {item.word}
                        </div>
                    </div>
                </div>
             ))
         )}
      </div>
    </div>
  );
};
