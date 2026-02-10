
import React from 'react';
import { PLANT_DATABASE } from '../constants';

interface WikiDetailScreenProps {
  id: string;
  onBack: () => void;
}

const WikiDetailScreen: React.FC<WikiDetailScreenProps> = ({ id, onBack }) => {
  const plant = PLANT_DATABASE.find(p => p.id === id) || PLANT_DATABASE[0];

  return (
    <div className="flex flex-col min-h-screen bg-background-beige pb-10">
      <div className="relative h-80 w-full">
        <div 
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${plant.imageUrl}")` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background-beige via-transparent to-transparent"></div>
        </div>
        <button 
          onClick={onBack}
          className="absolute top-12 left-6 flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </div>

      <main className="px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-black/5">
          <div className="flex items-center gap-2 text-primary-dark mb-2">
            <span className="material-symbols-outlined filled text-xl">spa</span>
            <span className="text-xs font-bold uppercase tracking-widest">Flora Guide</span>
          </div>
          <h1 className="text-3xl font-bold text-accent-black mb-1">{plant.name}</h1>
          <p className="text-primary-dark/60 italic text-sm font-medium mb-6">{plant.scientificName}</p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: 'Sunlight', val: plant.sunlight, icon: 'light_mode' },
              { label: 'Water', val: plant.water, icon: 'water_drop' },
              { label: 'Growth', val: plant.growth, icon: 'trending_up' }
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center p-3 rounded-2xl bg-background-beige/50 border border-black/5">
                <span className="material-symbols-outlined text-primary mb-1">{item.icon}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{item.label}</span>
                <span className="text-[10px] font-bold text-accent-black">{item.val}</span>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold text-accent-black mb-3 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {plant.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {plant.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-primary-light text-primary-dark rounded-full text-[10px] font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-accent-black mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Planting Method (种植方法)
              </h3>
              <div className="flex flex-col gap-6">
                {plant.plantingGuide.map((step) => (
                  <div key={step.step} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm z-10">
                        {step.step}
                      </div>
                      {step.step < plant.plantingGuide.length && (
                        <div className="w-0.5 flex-1 bg-primary/20 my-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <h4 className="font-bold text-accent-black text-base mb-1">{step.action}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-accent-black text-white p-6 rounded-3xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                  Did you know?
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Gardening for just 30 minutes a day can lower stress hormone levels and improve sleep quality in adults over 60.
                </p>
              </div>
              <span className="absolute -right-4 -bottom-4 material-symbols-outlined text-[100px] text-white/5 rotate-12">spa</span>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WikiDetailScreen;
