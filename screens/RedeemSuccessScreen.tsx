
import React, { useEffect, useState } from 'react';

interface RedeemSuccessScreenProps {
  onBack: () => void;
  onConfirmRedeem?: (cost: number, label: string) => void;
  params?: any;
}

const RedeemSuccessScreen: React.FC<RedeemSuccessScreenProps> = ({ onBack, onConfirmRedeem, params }) => {
  const [isScanning, setIsScanning] = useState(false);
  const rewardName = params?.rewardName || '基础剪发';
  const cost = params?.cost || 0;

  // 模拟志愿者扫描：扫描成功后再执行扣除逻辑
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(true);
      setTimeout(() => {
        // 扫描成功，触发扣分
        if (onConfirmRedeem) {
           onConfirmRedeem(cost, `${rewardName} 兑换成功`);
        }
        onBack();
      }, 2000);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onBack, onConfirmRedeem, cost, rewardName]);

  return (
    <div className="flex flex-col min-h-screen bg-[#8DA338]">
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
        <div className="absolute top-12 left-0 right-0 flex flex-col items-center">
          <div className="size-16 rounded-full bg-white/20 flex items-center justify-center mb-4 border border-white/30 backdrop-blur-sm">
            <span className="material-symbols-outlined text-3xl text-white filled">qr_code_scanner</span>
          </div>
          <h1 className="text-[32px] font-bold text-white text-center">请出示二维码</h1>
          <p className="text-white/80 text-center mt-2 px-10 leading-snug">
            志愿者扫描二维码成功以后将自动扣取 {cost} 印章。
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-10 pt-12 shadow-2xl relative mt-32">
          <div className="absolute top-1/2 -left-4 size-8 rounded-full bg-[#8DA338] -translate-y-1/2"></div>
          <div className="absolute top-1/2 -right-4 size-8 rounded-full bg-[#8DA338] -translate-y-1/2"></div>

          <div className="flex flex-col items-center gap-8">
            <div className="relative group">
              <div className="size-56 bg-white rounded-3xl flex items-center justify-center border-2 border-primary/20 p-4 shadow-inner">
                <div className="w-full h-full border-2 border-accent-black rounded-xl relative overflow-hidden flex items-center justify-center">
                  <div className="grid grid-cols-6 grid-rows-6 gap-2 w-full h-full p-3 opacity-10">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-black' : ''}`}></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 border-[8px] border-accent-black rounded-lg flex flex-col p-3">
                       <div className="flex justify-between">
                         <div className="size-8 border-4 border-accent-black"></div>
                         <div className="size-8 border-4 border-accent-black"></div>
                       </div>
                       <div className="flex-1"></div>
                       <div className="flex">
                         <div className="size-8 border-4 border-accent-black"></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              {isScanning && (
                <div className="absolute inset-0 bg-primary/40 backdrop-blur-[4px] flex items-center justify-center rounded-3xl animate-in zoom-in duration-300">
                  <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary animate-spin">refresh</span>
                    <span className="text-primary font-bold text-base">扫描成功，扣除中...</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center space-y-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">兑换服务</p>
              <p className="text-2xl font-bold text-accent-black tracking-[0.1em]">{rewardName}</p>
            </div>

            <div className="w-full border-t border-dashed border-gray-100 pt-8 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">消耗印章</span>
                <span className="text-sm font-bold text-red-500">-{cost} 枚</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">当前状态</span>
                <span className="text-sm font-bold text-accent-black">待扫描核销</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 pb-12">
        <button 
          onClick={onBack}
          className="w-full h-16 rounded-full bg-accent-black text-white font-bold text-lg shadow-xl active:scale-95 transition-all"
        >
          取消兑换并返回
        </button>
      </div>
    </div>
  );
};

export default RedeemSuccessScreen;
