
import React from 'react';
import { Activity } from '../types';

interface ActivityDetailsScreenProps {
  id: string;
  activityData: Activity;
  onBack: () => void;
  onRegister: () => void;
}

const ActivityDetailsScreen: React.FC<ActivityDetailsScreenProps> = ({ id, activityData, onBack, onRegister }) => {
  const activity = activityData;

  return (
    <div className="flex flex-col min-h-screen pb-28 overflow-x-hidden">
      <div className="relative w-full h-[45vh] min-h-[400px]">
        <div className="absolute inset-0 rounded-b-[2.5rem] overflow-hidden shadow-soft z-0">
          <div 
            className="w-full h-full bg-center bg-no-repeat bg-cover"
            style={{ backgroundImage: `url("${activity.imageUrl}")` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 z-20 pt-12">
          <button onClick={onBack} className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex gap-3">
            <button className="size-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button className="size-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-6 right-6 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-3 text-white uppercase text-xs font-medium">
            <span className="material-symbols-outlined text-[16px]">spa</span>
            {activity.category}
          </div>
          <h1 className="text-white text-[32px] font-bold leading-tight">{activity.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-white/90">
            <span className="material-symbols-outlined text-[18px] filled">star</span>
            <span className="text-sm font-medium">{activity.rating || 4.5} ({activity.reviewCount || 0} Reviews)</span>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-10">
        <div className="flex gap-4 mb-8">
          <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary-light flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-dark">calendar_today</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Date</p>
              <p className="text-accent-black font-bold text-sm">{activity.time}</p>
            </div>
          </div>
          <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary-light flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-dark">token</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Cost</p>
              <p className="text-accent-black font-bold text-sm">{activity.cost || 'Free'}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">About Activity</h2>
          <p className="text-gray-600 text-lg font-light leading-relaxed">{activity.description}</p>
          <div className="mt-4 p-4 rounded-xl bg-primary-light/40 border border-primary/10 flex gap-3 items-start">
            <span className="material-symbols-outlined text-primary-dark mt-0.5">info</span>
            <p className="text-sm text-text-main leading-snug">Comfortable seating will be provided. No gardening experience is necessary.</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="group relative overflow-hidden rounded-2xl bg-accent-black text-white p-5 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">headphones</span>
                <p className="text-lg font-bold leading-tight">Listen to details</p>
              </div>
              <p className="text-gray-300 text-sm font-light">Audio description of the event</p>
            </div>
            <button className="flex size-12 items-center justify-center rounded-full bg-primary text-accent-black shadow-lg">
              <span className="material-symbols-outlined text-2xl filled">play_arrow</span>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full px-6 py-6 bg-gradient-to-t from-background-beige via-background-beige to-transparent z-30 flex justify-center h-32 pointer-events-none">
        <button 
          onClick={onRegister}
          className="pointer-events-auto w-full max-w-md h-16 rounded-full bg-primary hover:bg-primary-dark text-accent-black text-lg font-bold flex items-center justify-between px-2 shadow-soft active:scale-95 transition-all"
        >
          <span className="w-12"></span>
          <span>Register Now</span>
          <div className="size-12 rounded-full bg-accent-black/10 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_forward</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ActivityDetailsScreen;
