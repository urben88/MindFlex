import React from 'react';
import { useStore } from '../store/useStore';
import { Home, Gamepad2, Dumbbell, BarChart2, Settings } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { view, navigate } = useStore();

  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'games', icon: Gamepad2, label: 'Juegos' },
    { id: 'exercises', icon: Dumbbell, label: 'Ejercicios' },
    { id: 'stats', icon: BarChart2, label: 'Stats' },
    { id: 'settings', icon: Settings, label: 'Ajustes' },
  ];

  const isGameMode = ['active_game', 'active_exercise', 'game_summary'].includes(view);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {!isGameMode && (
        <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-primary tracking-tight">MindFlex</h1>
        </header>
      )}
      
      <main className={`flex-1 overflow-y-auto ${isGameMode ? 'p-0' : 'p-4 pb-24'}`}>
        <div className={`max-w-md mx-auto w-full ${isGameMode ? 'h-full' : ''}`}>
          {children}
        </div>
      </main>

      {/* Conditional rendering of bottom tabs - hide inside game */}
      {!isGameMode && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-pb z-20">
          <div className="flex justify-around items-center h-16 max-w-md mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id as any)}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                    isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};