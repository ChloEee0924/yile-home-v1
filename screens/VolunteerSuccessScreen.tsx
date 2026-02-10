
import React from 'react';

interface VolunteerSuccessScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

const VolunteerSuccessScreen: React.FC<VolunteerSuccessScreenProps> = ({ onBack, onComplete }) => {
  const handleFinish = () => {
    onComplete(); // 更新角色为 Volunteer
    onBack();
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-beige">
      <div className="flex-1 flex flex-col items-center justify-center px-10">
        <div className="relative mb-12">
          {/* Animated rings */}
          <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full" />
          <div className="absolute -inset-4 animate-pulse bg-primary/10 rounded-full delay-150" />
          
          <div className="relative size-32 rounded-full bg-primary flex items-center justify-center shadow-floating">
            <span className="material-symbols-outlined text-6xl text-white filled">volunteer_activism</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-accent-black text-center mb-4">申请已提交！</h1>
        <p className="text-gray-500 text-center mb-10 leading-relaxed font-medium">
          社区园丁（后台管理员）正在审核您的资料。一旦通过，您将正式成为认证志愿者并获得专属工具权限。
        </p>

        <div className="w-full space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-primary/10 flex items-center gap-4">
             <div className="size-12 rounded-2xl bg-primary-light/50 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">hourglass_empty</span>
             </div>
             <div>
                <p className="text-sm font-bold text-accent-black">审核状态：进行中</p>
                <p className="text-xs text-gray-400 font-medium tracking-tight">预计 24 小时内完成审核</p>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-primary/10 flex items-center gap-4 group cursor-pointer" onClick={handleFinish}>
             <div className="size-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <span className="material-symbols-outlined">bolt</span>
             </div>
             <div>
                <p className="text-sm font-bold text-accent-black">快速体验（测试模式）</p>
                <p className="text-xs text-gray-400 font-medium">点击此处模拟审核通过并返回</p>
             </div>
          </div>
        </div>
      </div>

      <div className="p-8 pb-12">
        <button 
          onClick={handleFinish}
          className="w-full h-16 rounded-full bg-accent-black text-white font-bold text-lg shadow-xl active:scale-95 transition-all"
        >
          返回个人中心
        </button>
      </div>
    </div>
  );
};

export default VolunteerSuccessScreen;
