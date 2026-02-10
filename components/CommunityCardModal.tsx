
import React from 'react';
import { IMAGES } from '../constants';

interface CommunityCardModalProps {
  onClose: () => void;
  stamps: number;
}

const CommunityCardModal: React.FC<CommunityCardModalProps> = ({ onClose, stamps }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-accent-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-sm animate-in zoom-in duration-300">
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Card Header */}
          <div className="bg-primary p-8 flex flex-col items-center text-white relative">
            <div className="absolute top-4 right-4 text-white/40">
              <span className="material-symbols-outlined text-4xl">eco</span>
            </div>
            <div 
              className="size-24 rounded-full border-4 border-white/30 bg-cover bg-center mb-4 shadow-lg"
              style={{ backgroundImage: `url("${IMAGES.AVATAR}")` }}
            />
            <h3 className="text-2xl font-bold">Grandma Li</h3>
            <p className="text-white/70 text-sm font-medium">Yile Home Member #1024</p>
          </div>

          {/* Card Body */}
          <div className="p-8 flex flex-col items-center gap-6">
            <div className="p-4 bg-background-beige rounded-3xl border-2 border-primary/10">
              <div className="size-48 bg-white rounded-2xl flex items-center justify-center relative">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-36 h-36 border-[12px] border-accent-black rounded-lg">
                       <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full p-2">
                          <div className="border-4 border-accent-black"></div>
                          <div className="border-4 border-accent-black opacity-20"></div>
                          <div className="border-4 border-accent-black"></div>
                          <div className="border-4 border-accent-black"></div>
                       </div>
                    </div>
                 </div>
                 <div className="size-12 bg-white rounded-xl shadow-lg flex items-center justify-center z-10 border border-secondary">
                    <span className="material-symbols-outlined text-primary">spa</span>
                 </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm font-bold text-accent-black">Scan this QR Code</p>
              <p className="text-xs text-gray-400 mt-1">For check-in or credit exchange</p>
            </div>

            <div className="w-full flex justify-around items-center pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stamps}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stamps</p>
              </div>
              <div className="h-10 w-px bg-gray-100"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-black">A+</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Credit</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full flex items-center justify-center gap-2 text-white font-bold opacity-80 hover:opacity-100 transition-opacity"
        >
          <span className="material-symbols-outlined">close</span>
          Close Card
        </button>
      </div>
    </div>
  );
};

export default CommunityCardModal;
