
import React from 'react';

interface HonorWallScreenProps {
  onBack: () => void;
}

const HonorWallScreen: React.FC<HonorWallScreenProps> = ({ onBack }) => {
  const badges = [
    { title: 'Planting Master', level: 'Level 3', desc: 'Planted over 50 flowers in Zone B', icon: 'potted_plant', color: 'bg-green-50 text-primary', status: 'earned' },
    { title: 'Time VIP', level: 'Active', desc: 'Contributed 100+ hours to community', icon: 'hourglass_top', color: 'bg-amber-50 text-amber-500', status: 'earned' },
    { title: 'Friendly Neighbor', level: 'Lvl 1', desc: 'Helped 10 neighbors with tasks', icon: 'volunteer_activism', color: 'bg-blue-50 text-blue-500', status: 'earned' },
    { title: 'Wiki Expert', level: 'Locked', desc: 'Identified 20+ unknown plants', icon: 'menu_book', color: 'bg-gray-100 text-gray-400', status: 'locked' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="flex items-center p-6 gap-4 sticky top-0 bg-background-beige/95 backdrop-blur-md z-30">
        <button onClick={onBack} className="size-12 flex items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-accent-black">Honor Wall</h1>
      </header>

      <main className="p-6 space-y-6">
        <div className="bg-white p-8 rounded-[3rem] shadow-soft text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-8xl">military_tech</span>
          </div>
          <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
             <span className="material-symbols-outlined text-5xl text-primary filled">emoji_events</span>
          </div>
          <h2 className="text-3xl font-bold text-accent-black">Community Star</h2>
          <p className="text-gray-400 text-sm mt-2">You are in the top 5% of contributors!</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {badges.map((badge, i) => (
            <div key={i} className={`flex items-center gap-5 p-5 bg-white rounded-[2.5rem] shadow-soft border border-black/5 ${badge.status === 'locked' ? 'grayscale opacity-60' : ''}`}>
              <div className={`size-20 rounded-3xl flex items-center justify-center shrink-0 ${badge.color}`}>
                <span className="material-symbols-outlined text-4xl">{badge.icon}</span>
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-bold text-accent-black">{badge.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full">{badge.level}</span>
                </div>
                <p className="text-sm text-gray-500 leading-snug">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HonorWallScreen;
