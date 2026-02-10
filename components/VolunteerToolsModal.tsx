
import React, { useState } from 'react';

interface VolunteerToolsModalProps {
  onClose: () => void;
  onAction: (action: 'scan_deduct' | 'scan_add' | 'new' | 'applications' | 'audit') => void;
}

const VolunteerToolsModal: React.FC<VolunteerToolsModalProps> = ({ onClose, onAction }) => {
  const [showScanSubMenu, setShowScanSubMenu] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-background-beige/95 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md bg-transparent px-6 pb-20 animate-in slide-in-from-bottom duration-300">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-accent-black tracking-tight mb-2">志愿者工具箱</h2>
          <p className="text-stone-500 font-medium text-lg">快速管理您的志愿服务</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          {/* Scan Entry Area */}
          <div className="col-span-1 min-h-[160px]">
            {!showScanSubMenu ? (
              <button
                onClick={() => setShowScanSubMenu(true)}
                className="w-full h-full group relative flex flex-col items-center justify-center p-6 bg-primary rounded-[2.5rem] shadow-soft active:scale-95 transition-all hover:brightness-105 overflow-hidden animate-in fade-in zoom-in duration-300"
              >
                <div className="w-16 h-16 mb-4 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-4xl text-white font-semibold">qr_code_scanner</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-0.5">扫码核销/录入</h3>
                <p className="text-sm text-white/80 font-medium text-center leading-tight">身份识别与券码核销</p>
              </button>
            ) : (
              <div className="flex flex-col gap-2 h-full animate-in fade-in slide-in-from-left duration-300">
                <button
                  onClick={() => onAction('scan_deduct')}
                  className="flex-1 bg-white border-2 border-primary/20 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm group"
                >
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">remove_circle</span>
                  <span className="text-sm font-bold text-accent-black">扣除印章</span>
                </button>
                <button
                  onClick={() => onAction('scan_add')}
                  className="flex-1 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md group"
                >
                  <span className="material-symbols-outlined text-white group-hover:scale-110 transition-transform">add_circle</span>
                  <span className="text-sm font-bold">录入印章</span>
                </button>
                <button
                  onClick={() => setShowScanSubMenu(false)}
                  className="py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center"
                >
                  返回
                </button>
              </div>
            )}
          </div>

          {/* New Event - Black Card */}
          <button
            onClick={() => onAction('new')}
            className="col-span-1 group relative flex flex-col items-center justify-center p-8 bg-accent-black rounded-[2.5rem] shadow-card active:scale-95 transition-all overflow-hidden"
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
              <span className="material-symbols-outlined text-4xl text-primary font-semibold">calendar_add_on</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-0.5">发布活动</h3>
            <p className="text-sm text-stone-400 font-medium">组织新的社区活动</p>
          </button>

          {/* Volunteer Applications */}
          <button
            onClick={() => onAction('applications')}
            className="col-span-2 group relative flex flex-row items-center justify-between p-6 bg-white rounded-[2rem] shadow-card border border-primary/5 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-3xl text-primary">diversity_1</span>
                <div className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">1</span>
                </div>
              </div>
              <div className="flex flex-col items-start text-left">
                <h3 className="text-lg font-bold text-accent-black leading-tight">申请审核</h3>
                <p className="text-sm text-stone-500 font-medium">审核新的志愿者申请</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-background-beige flex items-center justify-center group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-stone-400 group-hover:text-white text-2xl">arrow_forward</span>
            </div>
          </button>

          {/* Skill Audit */}
          <button
            onClick={() => onAction('audit')}
            className="col-span-2 group relative flex flex-row items-center justify-between p-6 bg-white rounded-[2rem] shadow-card border border-stone-100 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-3xl text-accent-black">fact_check</span>
              </div>
              <div className="flex flex-col items-start text-left">
                <h3 className="text-lg font-bold text-accent-black leading-tight">工时审核</h3>
                <p className="text-sm text-stone-500 font-medium">确认服务工时</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-background-beige flex items-center justify-center group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-stone-400 group-hover:text-white text-2xl">arrow_forward</span>
            </div>
          </button>
        </div>

        <div className="flex justify-center items-center">
          <button onClick={onClose} className="flex items-center justify-center h-16 w-16 rounded-full bg-accent-black text-white shadow-xl active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-3xl font-medium">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerToolsModal;
