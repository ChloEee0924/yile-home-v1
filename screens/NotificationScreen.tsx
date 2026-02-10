
import React from 'react';

interface NotificationScreenProps {
  onBack: () => void;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ onBack }) => {
  const notices = [
    { title: 'Welcome Volunteer!', desc: 'The gardener approved your application. You can now help neighbors!', time: 'Just now', type: 'volunteer', icon: 'diversity_1' },
    { title: 'Stamp Earned!', desc: 'You got 5 stamps for Garden Walk activity.', time: '2h ago', type: 'reward', icon: 'stars' },
    { title: 'Event Tomorrow', desc: 'Don\'t forget your Afternoon Tea at 3:00 PM.', time: '5h ago', type: 'event', icon: 'calendar_today' },
    { title: 'New Plant Wiki', desc: 'Learn about the healing powers of Lavender.', time: 'Yesterday', type: 'info', icon: 'menu_book' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="flex items-center p-6 gap-4 sticky top-0 bg-background-beige/95 backdrop-blur-md z-30 border-b border-black/5">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-accent-black">Notifications</h1>
      </header>

      <main className="p-6 space-y-6">
        <div className="flex justify-between items-center px-1 mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">RECENT</span>
          <button className="text-[10px] font-bold text-primary-dark uppercase tracking-widest border-b-2 border-primary/20 pb-0.5">Mark all as read</button>
        </div>

        <div className="space-y-4">
          {notices.map((n, i) => (
            <div key={i} className="flex gap-4 p-5 bg-white rounded-[2rem] shadow-soft border border-black/5 hover:border-primary/20 transition-all animate-in slide-in-from-right duration-500" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 ${
                n.type === 'reward' ? 'bg-amber-100 text-amber-600' :
                n.type === 'event' ? 'bg-blue-100 text-blue-600' : 
                n.type === 'volunteer' ? 'bg-primary text-white shadow-md' : 'bg-primary-light text-primary'
              }`}>
                <span className={`material-symbols-outlined text-2xl ${n.type === 'volunteer' ? 'filled' : ''}`}>{n.icon}</span>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-accent-black text-base">{n.title}</h3>
                  <span className={`text-[10px] font-bold whitespace-nowrap mt-1 ${n.time === 'Just now' ? 'text-primary' : 'text-gray-400'}`}>{n.time}</span>
                </div>
                <p className="text-sm text-gray-500 leading-snug">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="py-20 text-center flex flex-col items-center">
          <div className="size-20 bg-gray-100/50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
            <span className="material-symbols-outlined text-4xl text-gray-300">done_all</span>
          </div>
          <p className="text-gray-400 font-bold">No more notifications</p>
        </div>
      </main>
    </div>
  );
};

export default NotificationScreen;
