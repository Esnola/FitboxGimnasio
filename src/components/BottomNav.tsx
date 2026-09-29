import React from 'react';
import { useGym } from '../context/GymContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useGym();

  const navItems = [
    { id: 'inicio' as const, label: 'Inicio', icon: 'home' },
    { id: 'clases' as const, label: 'Clases', icon: 'calendar_month' },
    { id: 'wod' as const, label: 'WOD & PRs', icon: 'fitness_center' },
    { id: 'cuota' as const, label: 'Mi Cuota', icon: 'credit_card' },
    { id: 'perfil' as const, label: 'Perfil', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-3 py-2 max-w-md mx-auto bg-[#0c0e12] border-t border-[#444933]/30 shadow-[0_-4px_25px_rgba(0,0,0,0.6)] backdrop-blur-lg">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 transition-all duration-150 active:scale-95 cursor-pointer ${
              isActive
                ? 'text-[#c3f400] font-bold scale-105'
                : 'text-[#c4c9ac] hover:text-[#c3f400]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400",
              }}
            >
              {item.icon}
            </span>
            <span className="font-condensed text-[11px] tracking-wider uppercase mt-0.5 font-bold">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
