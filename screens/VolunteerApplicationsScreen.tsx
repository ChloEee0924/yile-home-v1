
import React, { useState } from 'react';
import { IMAGES } from '../constants';

interface VolunteerApplicationsScreenProps {
  onBack: () => void;
}

const VolunteerApplicationsScreen: React.FC<VolunteerApplicationsScreenProps> = ({ onBack }) => {
  const [apps, setApps] = useState([
    { id: '1', name: 'Grandpa Zhang', avatar: IMAGES.ZHANG_AVATAR, skills: ['Repairing', 'Teaching'], status: 'pending', date: 'Just now' }
  ]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastApprovedName, setLastApprovedName] = useState('');

  const handleAudit = (id: string, approve: boolean) => {
    const app = apps.find(a => a.id === id);
    if (approve && app) {
      setLastApprovedName(app.name);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    setApps(prev => prev.filter(app => app.id !== id));
    // In a real app, this would update the backend status
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="flex items-center p-6 gap-4 sticky top-0 bg-background-beige/95 backdrop-blur-md z-30">
        <button onClick={onBack} className="size-12 flex items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-accent-black">Review Applicants</h1>
      </header>

      <main className="p-6 space-y-6">
        <div className="bg-primary/10 p-5 rounded-3xl border border-primary/10 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary-dark">info</span>
          <p className="text-sm font-medium text-primary-dark leading-relaxed">
            As the Gardener, you verify residents' skills to maintain community safety.
          </p>
        </div>

        {apps.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="size-20 rounded-full bg-white flex items-center justify-center mx-auto shadow-soft">
              <span className="material-symbols-outlined text-4xl text-gray-200">done_all</span>
            </div>
            <p className="text-gray-400 font-bold">All caught up!</p>
            <button 
              onClick={onBack}
              className="px-6 py-2 bg-accent-black text-white rounded-full font-bold text-sm shadow-md"
            >
              Return Home
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map(app => (
              <div key={app.id} className="bg-white rounded-[2.5rem] p-6 shadow-soft border border-black/5 animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <img src={app.avatar} className="size-16 rounded-full border-2 border-primary/20" alt={app.name} />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-accent-black">{app.name}</h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-wider">{app.date}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest ml-1">Self-declared Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {app.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-background-beige rounded-full text-[10px] font-bold text-accent-black border border-primary/5">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-background-beige/50 p-4 rounded-2xl relative overflow-hidden">
                    <p className="text-sm italic text-gray-500 font-medium relative z-10">
                      "I have been fixing things for 40 years. I'd love to help neighbors with their broken appliances."
                    </p>
                    <span className="absolute right-2 bottom-2 material-symbols-outlined text-4xl opacity-5">format_quote</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleAudit(app.id, false)}
                    className="flex-1 py-4 rounded-full bg-gray-100 text-gray-500 font-bold active:scale-95 transition-transform"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleAudit(app.id, true)}
                    className="flex-[2] py-4 rounded-full bg-primary text-white font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    Approve
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Audit Success Feedback */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-10">
          <div className="bg-accent-black/90 backdrop-blur-md rounded-[3rem] p-8 shadow-floating flex flex-col items-center gap-4 animate-in zoom-in duration-500 border border-white/10">
            <div className="relative">
               <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
               <span className="material-symbols-outlined text-[80px] filled relative z-10 text-primary">verified</span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">审核通过!</h3>
              <p className="text-primary font-bold text-sm mt-1">{lastApprovedName} 已正式成为社区志愿者</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerApplicationsScreen;
