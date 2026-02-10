
import React from 'react';
import { Transaction } from '../types';

interface HistoryScreenProps {
  onBack: () => void;
  stamps: number;
  transactions: Transaction[];
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack, stamps, transactions }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="flex items-center p-6 gap-4 sticky top-0 bg-background-beige/95 backdrop-blur-md z-30 border-b border-black/5">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-accent-black">History</h1>
      </header>

      <main className="p-6">
        {/* Total Savings Card */}
        <div className="bg-[#2D3321] text-white p-10 rounded-[2.5rem] mb-10 relative overflow-hidden shadow-floating">
          <div className="relative z-10">
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-2">TOTAL SAVINGS</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-bold tracking-tighter">{stamps}</span>
              <span className="text-lg font-bold text-white/60">Stamps</span>
            </div>
          </div>
          {/* Background Decorative Wallet Icon */}
          <div className="absolute top-1/2 -right-12 -translate-y-1/2 opacity-10 rotate-12 scale-125">
            <span className="material-symbols-outlined text-[180px] filled">account_balance_wallet</span>
          </div>
          {/* Subtle light effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        </div>

        <h3 className="text-lg font-bold mb-6 px-1 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          Transactions
        </h3>
        
        <div className="space-y-4">
          {transactions.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-5 bg-white rounded-[2rem] shadow-soft border border-black/5 animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-4">
                <div className={`size-12 rounded-2xl flex items-center justify-center ${
                  item.type === 'earn' ? 'bg-[#EBF1D1] text-primary' : 'bg-red-50 text-red-400'
                }`}>
                  <span className="material-symbols-outlined text-2xl font-bold">
                    {item.type === 'earn' ? 'add' : 'remove'}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-accent-black text-base">{item.label}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold ${item.type === 'earn' ? 'text-[#8DA338]' : 'text-red-500'}`}>
                  {item.val}
                </span>
                <span className={`material-symbols-outlined text-sm filled ${item.type === 'earn' ? 'text-primary' : 'text-red-300'}`}>stars</span>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl text-gray-300">history</span>
              </div>
              <p className="text-gray-400 font-bold">暂无历史记录</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryScreen;
