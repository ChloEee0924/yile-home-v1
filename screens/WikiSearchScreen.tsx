
import React, { useState, useMemo } from 'react';
import { Screen, PlantData } from '../types';
import { PLANT_DATABASE } from '../constants';

interface WikiSearchScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  onBack: () => void;
}

const WikiSearchScreen: React.FC<WikiSearchScreenProps> = ({ onNavigate, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Daily recommended plant logic (simplied for mock)
  const dailyPlant = useMemo(() => {
    const day = new Date().getDate();
    return PLANT_DATABASE[day % PLANT_DATABASE.length];
  }, []);

  const filteredPlants = useMemo(() => {
    return PLANT_DATABASE.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="sticky top-0 z-30 bg-background-beige/95 backdrop-blur-md px-6 pt-12 pb-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-white shadow-sm shrink-0">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Search plants, healing effects..."
              className="w-full bg-white border-none rounded-full py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary shadow-soft"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {!searchQuery && (
          <section aria-label="Daily Recommendation">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-bold text-accent-black">Daily Selection</h2>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">Random</span>
            </div>
            <div 
              onClick={() => onNavigate(Screen.WikiDetail, { plantId: dailyPlant.id })}
              className="group relative h-64 w-full rounded-[2.5rem] overflow-hidden shadow-floating cursor-pointer active:scale-[0.98] transition-all"
            >
              <img src={dailyPlant.imageUrl} alt={dailyPlant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  {dailyPlant.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] text-white font-bold border border-white/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{dailyPlant.name}</h3>
                <p className="text-white/70 text-sm line-clamp-1">{dailyPlant.description}</p>
              </div>
            </div>
          </section>
        )}

        <section aria-label="Plant List">
          <h2 className="text-xl font-bold text-accent-black mb-4 px-1">
            {searchQuery ? `Search Results (${filteredPlants.length})` : 'All Plants'}
          </h2>
          <div className="flex flex-col gap-4">
            {filteredPlants.map((plant) => (
              <div 
                key={plant.id}
                onClick={() => onNavigate(Screen.WikiDetail, { plantId: plant.id })}
                className="flex items-center gap-4 p-4 bg-white rounded-3xl shadow-soft cursor-pointer active:scale-[0.98] transition-all hover:border-primary/20 border border-transparent"
              >
                <div className="size-20 rounded-2xl overflow-hidden shrink-0">
                  <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-accent-black mb-0.5">{plant.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">wb_sunny</span>
                      {plant.sunlight}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">water_drop</span>
                      {plant.water}
                    </div>
                  </div>
                </div>
                <button className="size-10 rounded-full bg-background-beige flex items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            ))}
          </div>
          {filteredPlants.length === 0 && (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">search_off</span>
              <p className="text-gray-400 font-bold">No plants found matching your search</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default WikiSearchScreen;
