
import React, { useState, useEffect } from 'react';

interface PostRequestScreenProps {
  onBack: () => void;
  onConfirm: (cost: number) => void;
}

const PostRequestScreen: React.FC<PostRequestScreenProps> = ({ onBack, onConfirm }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState(2);
  const [category, setCategory] = useState('Repair');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const templates = [
    { title: '修理台灯', desc: '我客厅的灯一直在闪。', cat: 'Repair', icon: 'handyman' },
    { title: '代买菜', desc: '需要从集市买2斤大米和一些鸡蛋。', cat: 'Market', icon: 'shopping_cart' },
    { title: '手机教学', desc: '找不到怎么清理手机照片。', cat: 'Teaching', icon: 'smartphone' },
    { title: '阳台浇花', desc: '我出远门，需要有人帮我给阳台的花浇水。', cat: 'Gardening', icon: 'potted_plant' }
  ];

  const handleApplyTemplate = (t: typeof templates[0]) => {
    setTitle(t.title);
    setDescription(t.desc);
    setCategory(t.cat);
  };

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsTranscribing(true);
    // Simulate transcription
    setTimeout(() => {
      setIsTranscribing(false);
      setDescription("我需要有人帮我修下收音机，最近它总是有滋滋的声音。");
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="flex items-center p-6 gap-4 sticky top-0 bg-background-beige/95 backdrop-blur-md z-30">
        <button onClick={onBack} className="size-12 flex items-center justify-center rounded-full bg-white shadow-soft active:scale-90 transition-transform">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h1 className="text-2xl font-bold text-accent-black">发布求助</h1>
      </header>

      <main className="flex-1 p-6 space-y-8 pb-32">
        {/* Quick Templates - Horizontal Scroll */}
        <section>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">快速模版</p>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
            {templates.map((t, i) => (
              <button 
                key={i}
                onClick={() => handleApplyTemplate(t)}
                className="shrink-0 flex items-center gap-4 px-6 py-4 bg-white rounded-3xl shadow-soft border-2 border-transparent active:border-primary transition-all active:scale-95"
              >
                <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl filled">{t.icon}</span>
                </div>
                <span className="font-bold text-accent-black text-base whitespace-nowrap">{t.title}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-6">
          <div className="space-y-3">
            <label className="text-lg font-bold text-accent-black">您的需求是？</label>
            <div className="relative">
              <input 
                type="text"
                placeholder="例如：家里水龙头坏了"
                className="w-full p-6 bg-white rounded-[2rem] border-none shadow-soft text-lg focus:ring-2 focus:ring-primary placeholder:text-gray-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-lg font-bold text-accent-black">更多细节</label>
              <button 
                onClick={() => setIsRecording(true)}
                className="flex items-center gap-1.5 text-primary font-bold text-sm bg-primary/5 px-4 py-2 rounded-full active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-xl filled">mic</span>
                语音录入
              </button>
            </div>
            <div className="relative">
              <textarea 
                placeholder="告诉邻居更多详细信息..."
                rows={4}
                className="w-full p-6 bg-white rounded-[2.5rem] border-none shadow-soft text-lg focus:ring-2 focus:ring-primary resize-none placeholder:text-gray-300 leading-relaxed"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Reward Setting */}
        <section className="bg-white p-8 rounded-[3rem] shadow-soft flex flex-col items-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">奖励印章数量</p>
          <div className="flex items-center gap-12">
            <button 
              onClick={() => setReward(Math.max(1, reward - 1))}
              className="size-16 rounded-full bg-background-beige flex items-center justify-center text-accent-black active:scale-90 transition-transform shadow-sm"
            >
              <span className="material-symbols-outlined text-4xl font-bold">remove</span>
            </button>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold text-primary tracking-tighter">{reward}</span>
              <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Stamps</span>
            </div>
            <button 
              onClick={() => setReward(reward + 1)}
              className="size-16 rounded-full bg-background-beige flex items-center justify-center text-accent-black active:scale-90 transition-transform shadow-sm"
            >
              <span className="material-symbols-outlined text-4xl font-bold">add</span>
            </button>
          </div>
          <p className="mt-8 text-xs text-center text-gray-400 leading-relaxed max-w-[220px]">
            这部分印章将暂时从您的账户中扣除，直至服务完成。
          </p>
        </section>
      </main>

      {/* Footer Button */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background-beige via-background-beige/80 to-transparent z-40">
        <button 
          onClick={() => onConfirm(reward)}
          disabled={!title}
          className="w-full h-16 rounded-full bg-accent-black text-white font-bold text-xl shadow-floating active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3 overflow-hidden group"
        >
          <span className="relative z-10">发布至集市</span>
          <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform">send</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Voice Recording Modal */}
      {isRecording && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xl animate-in fade-in duration-300" />
          
          <div className="relative flex flex-col items-center gap-12 animate-in zoom-in duration-300">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-accent-black mb-2">正在倾听...</h2>
              <p className="text-gray-500 font-medium">请清晰地说出您的需求</p>
            </div>

            <div className="relative">
              {/* Pulsing circles */}
              <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full scale-150" />
              <div className="absolute inset-0 animate-pulse bg-primary/10 rounded-full scale-125" />
              
              <div className="relative size-32 rounded-full bg-primary text-white flex items-center justify-center shadow-floating">
                <span className="material-symbols-outlined text-6xl filled">mic</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <span className="text-4xl font-mono font-bold text-accent-black tracking-widest">
                {formatTime(recordingTime)}
              </span>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsRecording(false)}
                  className="px-8 py-4 rounded-full bg-gray-100 text-gray-500 font-bold active:scale-95 transition-transform"
                >
                  取消
                </button>
                <button 
                  onClick={handleStopRecording}
                  className="px-8 py-4 rounded-full bg-accent-black text-white font-bold shadow-lg active:scale-95 transition-transform"
                >
                  停止并转换
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transcribing Overlay */}
      {isTranscribing && (
        <div className="fixed inset-0 z-[101] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4">
            <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-lg font-bold text-accent-black">正在转换语音...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostRequestScreen;
