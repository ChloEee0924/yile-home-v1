
import React, { useState } from 'react';
import { IMAGES } from '../constants';

interface ManualStampEntryScreenProps {
  onBack: () => void;
  onConfirm: (amount: number, label: string) => void;
  params?: any;
}

const ManualStampEntryScreen: React.FC<ManualStampEntryScreenProps> = ({ onBack, onConfirm, params }) => {
  const [amount, setAmount] = useState(5);
  const [label, setLabel] = useState('互助奖励');
  const userName = params?.userName || '居民';
  const userId = params?.userId || '----';

  const quickLabels = ['互助奖励', '活动全勤', '节日礼包', '文明之星'];

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="flex items-center p-6 gap-4 sticky top-0 bg-background-beige/95 backdrop-blur-md z-30">
        <button onClick={onBack} className="size-12 flex items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-accent-black">发放印章</h1>
      </header>

      <main className="p-6 space-y-8 pb-40">
        <section className="bg-white rounded-[2.5rem] p-8 shadow-soft border border-black/5 flex flex-col items-center">
          <div className="size-24 rounded-full border-4 border-primary-light/30 bg-cover bg-center mb-4" 
               style={{ backgroundImage: `url("${IMAGES.ZHANG_AVATAR}")` }} />
          <h3 className="text-2xl font-bold text-accent-black">{userName}</h3>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">ID: #{userId}-MEMBER</p>
        </section>

        <section className="space-y-4">
           <p className="text-sm font-bold text-accent-black px-1 uppercase tracking-widest">发放数量</p>
           <div className="bg-white rounded-[2.5rem] shadow-soft p-10 flex flex-col items-center">
              <div className="flex items-center gap-12">
                <button 
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                  className="size-14 rounded-full bg-background-beige flex items-center justify-center active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-3xl font-bold">remove</span>
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-7xl font-bold text-primary tracking-tighter">{amount}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stamps</span>
                </div>
                <button 
                  onClick={() => setAmount(amount + 1)}
                  className="size-14 rounded-full bg-background-beige flex items-center justify-center active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-3xl font-bold">add</span>
                </button>
              </div>
           </div>
        </section>

        <section className="space-y-4">
           <p className="text-sm font-bold text-accent-black px-1 uppercase tracking-widest">奖励事由</p>
           <input 
             type="text" 
             value={label}
             onChange={(e) => setLabel(e.target.value)}
             className="w-full p-5 bg-white rounded-2xl border-none shadow-soft text-lg font-bold focus:ring-2 focus:ring-primary"
             placeholder="请输入发放原因..."
           />
           <div className="flex flex-wrap gap-2">
              {quickLabels.map(l => (
                <button 
                  key={l}
                  onClick={() => setLabel(l)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${label === l ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-400 border border-black/5'}`}
                >
                  {l}
                </button>
              ))}
           </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-beige via-background-beige to-transparent z-40">
        <button 
          onClick={() => onConfirm(amount, label)}
          className="w-full h-16 rounded-full bg-accent-black text-white font-bold text-xl shadow-floating active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          确认发放
          <span className="material-symbols-outlined">verified</span>
        </button>
      </div>
    </div>
  );
};

export default ManualStampEntryScreen;
