
import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  language?: 'zh' | 'en';
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, language = 'zh' }) => {
  const t = (zh: string, en: string) => language === 'zh' ? zh : en;

  const items = [
    { id: Screen.Home, label: t('家园', 'Home'), icon: 'home' },
    { id: Screen.GardenMap, label: t('花园', 'Garden'), icon: 'potted_plant' },
    { id: Screen.MutualAid, label: t('互助', 'Help'), icon: 'diversity_3' },
    { id: Screen.Profile, label: t('我的', 'My'), icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-beige/95 backdrop-blur-xl border-t border-secondary pb-8 pt-4 px-8 max-w-md mx-auto shadow-2xl">
      <div className="flex justify-between items-center">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1.5 w-16 transition-colors ${
              currentScreen === item.id ? 'text-accent-black' : 'text-text-main/40 hover:text-accent-black'
            }`}
          >
            <div className={`${currentScreen === item.id ? 'bg-primary/20' : ''} p-1.5 rounded-xl`}>
              <span className={`material-symbols-outlined text-[24px] ${currentScreen === item.id ? 'filled' : ''}`}>
                {item.icon}
              </span>
            </div>
            <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
