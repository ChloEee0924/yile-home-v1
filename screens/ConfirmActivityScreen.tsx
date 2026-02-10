
import React, { useState } from 'react';
import { IMAGES } from '../constants';

interface ConfirmActivityScreenProps {
  onBack: () => void;
  onConfirm: (totalReward: number) => void;
}

const ConfirmActivityScreen: React.FC<ConfirmActivityScreenProps> = ({ onBack, onConfirm }) => {
  const [selectedActivities, setSelectedActivities] = useState<number[]>([0]); // Default first one selected
  
  const activities = [
    { title: 'Sensory Garden Walk', sub: '10 mins interaction', reward: 5, icon: 'spa' },
    { title: 'Morning Exercise', sub: 'Tai Chi session', reward: 2, icon: 'fitness_center' },
    { title: 'Community Help', sub: 'Assisted neighbor', reward: 3, icon: 'volunteer_activism' }
  ];

  const toggleActivity = (idx: number) => {
    if (selectedActivities.includes(idx)) {
      setSelectedActivities(selectedActivities.filter(i => i !== idx));
    } else {
      setSelectedActivities([...selectedActivities, idx]);
    }
  };

  const totalReward = selectedActivities.reduce((acc, idx) => acc + activities[idx].reward, 0);

  return (
    <div className="flex flex-col h-screen bg-background-beige overflow-hidden">
      <header className="flex items-center justify-between px-6 pt-12 pb-4 sticky top-0 z-10 bg-background-beige/95 backdrop-blur-md">
        <button onClick={onBack} className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-soft active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-accent-black">Resident Pass Info</h1>
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined text-[24px] text-primary">verified</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-40 no-scrollbar">
        {/* Resident Profile & Balance Card */}
        <section className="mt-4 bg-white rounded-[2.5rem] p-8 shadow-soft border border-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
             <span className="material-symbols-outlined text-9xl">badge</span>
          </div>
          
          <div className="flex flex-col items-center relative z-10">
            <div 
              className="w-28 h-28 rounded-full bg-cover bg-center border-[6px] border-primary-light/30 shadow-md mb-4"
              style={{ backgroundImage: `url("${IMAGES.AVATAR}")` }}
            />
            <h2 className="text-2xl font-bold text-accent-black">Grandma Li</h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-6">#ID 1024-MEMBER</p>
            
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="bg-background-beige/50 rounded-3xl p-5 flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Account</span>
                <div className="flex items-baseline gap-1 text-primary">
                  <span className="text-xl font-bold">Verified Member</span>
                </div>
              </div>
              <div className="bg-background-beige/50 rounded-3xl p-5 flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Trust Rating</span>
                <div className="flex items-baseline gap-1 text-accent-black">
                  <span className="text-3xl font-bold">A+</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action: Add Stamps */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-xl font-bold text-accent-black">Record Today's Activity</h3>
            <span className="text-xs font-bold text-primary-dark">Select all that apply</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {activities.map((item, i) => {
              const isSelected = selectedActivities.includes(i);
              return (
                <button 
                  key={i} 
                  onClick={() => toggleActivity(i)}
                  className={`group relative flex items-center justify-between p-5 rounded-[2rem] shadow-soft transition-all border-2 ${
                    isSelected ? 'bg-primary/5 border-primary' : 'bg-white border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-primary text-white shadow-md' : 'bg-background-beige text-accent-black'
                    }`}>
                      <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-accent-black">{item.title}</span>
                      <span className="text-xs text-gray-400 font-medium">{item.sub}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={`size-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-primary border-primary text-white scale-110' : 'border-gray-200 text-transparent'
                    }`}>
                      <span className="material-symbols-outlined text-lg font-bold">check</span>
                    </div>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-primary' : 'text-gray-400'}`}>
                      +{item.reward} Stamps
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* Summary Footer */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-beige via-background-beige to-transparent z-20 flex flex-col gap-4">
        <div className="bg-accent-black text-white p-5 rounded-3xl shadow-floating flex items-center justify-between animate-in slide-in-from-bottom duration-500">
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Total to add</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">{totalReward}</span>
              <span className="text-sm font-medium text-white/80 tracking-tight">New Stamps</span>
            </div>
          </div>
          <button 
            onClick={() => onConfirm(totalReward)}
            disabled={totalReward === 0}
            className="h-14 pl-6 pr-4 rounded-2xl bg-primary hover:bg-primary-dark active:scale-95 transition-all text-accent-black font-bold flex items-center gap-3 shadow-lg disabled:opacity-20"
          >
            <span>Confirm Record</span>
            <div className="size-8 rounded-full bg-accent-black/10 flex items-center justify-center">
              <span className="material-symbols-outlined">send</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActivityScreen;
