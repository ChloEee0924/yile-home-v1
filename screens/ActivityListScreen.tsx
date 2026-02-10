
import React, { useState, useMemo } from 'react';
import { Screen, Activity } from '../types';

interface ActivityListScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  onBack: () => void;
  activities: Activity[];
}

const ActivityListScreen: React.FC<ActivityListScreenProps> = ({ onNavigate, onBack, activities }) => {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = [
    { id: 'All', icon: 'apps' },
    { id: 'Wellness', icon: 'spa' },
    { id: 'Arts', icon: 'palette' },
    { id: 'Social', icon: 'groups' }
  ];

  const filteredActivities = useMemo(() => {
    if (activeTab === 'All') return activities;
    return activities.filter(activity => activity.category === activeTab);
  }, [activeTab, activities]);

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="flex items-center p-6 gap-4 sticky top-0 bg-background-beige/95 backdrop-blur-md z-30">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-white shadow-soft active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-accent-black">Community Board</h1>
      </header>

      <main className="px-6 pb-20 space-y-8">
        {/* Optimized Tabs */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-1 px-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 transform active:scale-95 ${
                  isActive 
                    ? 'bg-accent-black text-white shadow-lg ring-4 ring-accent-black/5' 
                    : 'bg-white text-gray-400 hover:text-accent-black hover:shadow-md'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'filled' : ''}`}>
                  {tab.icon}
                </span>
                {tab.id}
              </button>
            );
          })}
        </div>

        {/* List of Activities */}
        <div className="flex flex-col gap-8">
          {filteredActivities.map((activity, i) => (
            <div 
              key={`${activity.id}-${i}`}
              onClick={() => onNavigate(Screen.ActivityDetails, { activityId: activity.id })}
              className="group flex flex-col rounded-[2.5rem] bg-white shadow-soft overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-500 hover:shadow-xl animate-in fade-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Image with Tag Overlay */}
              <div 
                className="h-56 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url("${activity.imageUrl}")` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-accent-black shadow-sm border border-white/50">
                    {activity.category}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-7">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-accent-black leading-tight flex-1 pr-4">
                    {activity.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-2xl shrink-0">
                    <span className="material-symbols-outlined text-[18px] filled">stars</span>
                    <span className="text-xs font-bold whitespace-nowrap">Earn 5</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    {activity.time}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="py-20 text-center animate-in zoom-in duration-300">
              <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-gray-300">event_busy</span>
              </div>
              <p className="text-gray-400 font-bold">No events in this category yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActivityListScreen;
