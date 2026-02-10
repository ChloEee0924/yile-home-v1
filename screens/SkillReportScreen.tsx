
import React from 'react';

interface SkillReportScreenProps {
  onBack: () => void;
}

const SkillReportScreen: React.FC<SkillReportScreenProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="flex items-center p-6 gap-4 sticky top-0 bg-background-beige/95 backdrop-blur-md z-30">
        <button onClick={onBack} className="size-12 flex items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-accent-black">Skill Report</h1>
      </header>

      <main className="p-6 space-y-8 pb-32">
        {/* Radar Chart Placeholder */}
        <section className="bg-white p-8 rounded-[3rem] shadow-soft flex flex-col items-center">
          <div className="relative size-64 mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-18deg">
               {/* Hexagon Pattern */}
               <path d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z" fill="none" stroke="#EAE8DD" strokeWidth="1" />
               <path d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z" fill="none" stroke="#EAE8DD" strokeWidth="1" />
               {/* Skill Area */}
               <path d="M50 15 L70 40 L85 68 L50 80 L30 60 L25 35 Z" fill="#8DA338" fillOpacity="0.2" stroke="#8DA338" strokeWidth="2" />
               
               {/* Labels */}
               <text x="50" y="5" textAnchor="middle" className="text-[5px] font-bold fill-gray-400">Gardening</text>
               <text x="92" y="30" textAnchor="start" className="text-[5px] font-bold fill-gray-400">Teaching</text>
               <text x="92" y="75" textAnchor="start" className="text-[5px] font-bold fill-gray-400">Repair</text>
               <text x="50" y="98" textAnchor="middle" className="text-[5px] font-bold fill-gray-400">Escort</text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-center">
                  <p className="text-3xl font-bold text-accent-black">A+</p>
                  <p className="text-[10px] font-bold text-primary uppercase">Reliability</p>
               </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-accent-black text-center">Your Superpower is Helping!</h2>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
           {[
             { label: 'Help Neighbors', val: '24 times', icon: 'favorite' },
             { label: 'Service Hours', val: '12.5 hrs', icon: 'hourglass_empty' },
             { label: 'Community Rating', val: '4.9/5.0', icon: 'star' },
             { label: 'Skills Learned', val: '6 new', icon: 'school' }
           ].map((s, i) => (
             <div key={i} className="bg-white p-5 rounded-3xl shadow-soft">
                <span className="material-symbols-outlined text-primary mb-2">{s.icon}</span>
                <p className="text-xs text-gray-400 font-bold uppercase">{s.label}</p>
                <p className="text-xl font-bold text-accent-black mt-1">{s.val}</p>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
};

export default SkillReportScreen;
