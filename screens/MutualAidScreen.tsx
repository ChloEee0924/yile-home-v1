
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { IMAGES } from '../constants';
import BottomNav from '../components/BottomNav';
import CommunityCardModal from '../components/CommunityCardModal';

interface MutualAidScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  onBack: () => void;
  params?: any;
  stamps: number;
  setStamps: React.Dispatch<React.SetStateAction<number>>;
  onEarnStamps: (label: string, amount: number) => void;
  language: 'zh' | 'en';
}

interface MarketRequest {
  id: number;
  user: string;
  avatar: string;
  title: string;
  desc: string;
  reward: number;
  tag: string;
  location: string;
  phone: string;
  urgency?: 'Urgent' | 'Low' | 'Medium';
  time: string;
  applicants: number;
}

const MutualAidScreen: React.FC<MutualAidScreenProps> = ({ onNavigate, onBack, params, stamps, setStamps, onEarnStamps, language }) => {
  const [showCard, setShowCard] = useState(false);
  const [activeTab, setActiveTab] = useState<'Mall' | 'Market' | 'MyHelp'>('Mall');
  const [acceptedIds, setAcceptedIds] = useState<Set<number>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<MarketRequest | null>(null);
  const [counterKey, setCounterKey] = useState(0);

  const t = (zh: string, en: string) => language === 'zh' ? zh : en;

  // 找回并优化的官方兑换服务内容
  const mallRewards = [
    { title: t('基础剪发', 'Haircut'), sub: t('社区服务中心', 'Center'), cost: 3, img: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=400&auto=format&fit=crop' },
    { title: t('洗护服务', 'Laundry'), sub: t('5kg衣物', '5kg'), cost: 2, img: 'https://images.unsplash.com/photo-1545173153-5dd9ca104854?q=80&w=400&auto=format&fit=crop' },
    { title: t('有机蔬菜', 'Veggies'), sub: t('农场采摘', 'Farm'), cost: 1, img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop' },
    { title: t('中医理疗', 'Therapy'), sub: t('推拿', 'Massage'), cost: 5, img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?q=80&w=400&auto=format&fit=crop' }
  ];

  const marketRequests: MarketRequest[] = [
    { 
      id: 1, user: t('王伯伯', 'Uncle Wang'), avatar: 'https://i.pravatar.cc/150?u=wang', 
      title: t('修理收音机', 'Fix Radio'), desc: t('我的旧收音机没声音了，这是儿子送的礼物。', 'Fixing my old radio which was a gift from my son.'), 
      reward: 2, tag: t('家电维修', 'Repair'), location: t('8号楼 202室', 'Bldg 8, 202'), phone: '138-0000-0001', urgency: 'Medium', time: t('2小时前', '2h ago'), applicants: 1
    },
    { 
      id: 2, user: t('陈阿姨', 'Auntie Chen'), avatar: 'https://i.pravatar.cc/150?u=chen', 
      title: t('阳台浇花', 'Water Plants'), desc: t('要去探亲3天，阳台上的花没人照顾。', 'Help water plants while I visit family.'), 
      reward: 3, tag: t('园艺', 'Garden'), location: t('5号楼 405室', 'Bldg 5, 405'), phone: '139-1111-2222', urgency: 'Urgent', time: t('1小时前', '1h ago'), applicants: 0
    }
  ];

  const handleAcceptTask = (id: number) => {
    setAcceptedIds(prev => new Set(prev).add(id));
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setActiveTab('MyHelp');
    }, 1500);
  };

  const myAcceptedTasks = marketRequests.filter(req => acceptedIds.has(req.id));

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="sticky top-0 z-50 flex items-center bg-background-beige/90 backdrop-blur-md px-6 py-4 justify-between border-b border-black/5">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined text-xl font-bold">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-accent-black">{t('邻里互助', 'Mutual Aid')}</h1>
        <button onClick={() => onNavigate(Screen.History)} className="flex size-10 items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined text-xl font-bold">history</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col gap-8 px-6 pb-32 pt-6">
        <section className="w-full">
          <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-accent-black shadow-floating p-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10 p-8 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-white/40 text-lg">wallet</span>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{t('我的账户', 'ACCOUNT')}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span key={counterKey} className="text-6xl font-bold text-white tracking-tight transition-all duration-500">
                      {stamps}
                    </span>
                    <span className="text-lg font-bold text-primary">{t('印章', 'Stamps')}</span>
                  </div>
                </div>
                <button onClick={() => setShowCard(true)} className="bg-primary text-accent-black px-5 py-3 rounded-full text-xs font-bold shadow-lg active:scale-95 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg filled">qr_code_2</span>
                  {t('我的名片', 'Card')}
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex p-1.5 bg-white/50 backdrop-blur-md rounded-full shadow-soft border border-black/5 overflow-hidden">
          <button onClick={() => setActiveTab('Mall')} className={`flex-1 py-3 text-xs font-bold rounded-full transition-all duration-300 ${activeTab === 'Mall' ? 'bg-accent-black text-white shadow-md' : 'text-text-main/40 hover:text-text-main'}`}>{t('兑换商城', 'Mall')}</button>
          <button onClick={() => setActiveTab('Market')} className={`flex-1 py-3 text-xs font-bold rounded-full transition-all duration-300 ${activeTab === 'Market' ? 'bg-accent-black text-white shadow-md' : 'text-text-main/40 hover:text-text-main'}`}>{t('邻里集市', 'Market')}</button>
          <button onClick={() => setActiveTab('MyHelp')} className={`flex-1 py-3 text-xs font-bold rounded-full transition-all duration-300 relative ${activeTab === 'MyHelp' ? 'bg-accent-black text-white shadow-md' : 'text-text-main/40 hover:text-text-main'}`}>
            {t('我的帮扶', 'My Help')}
            {myAcceptedTasks.length > 0 && activeTab !== 'MyHelp' && <span className="absolute top-1 right-2 size-2 bg-primary rounded-full animate-pulse"></span>}
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom duration-500">
          <div className="flex justify-between items-end mb-6 px-1">
            <div>
              <h2 className="text-2xl font-bold text-accent-black">{activeTab === 'Mall' ? t('官方兑换', 'Official Mall') : activeTab === 'Market' ? t('邻里集市', 'Community Market') : t('待完成任务', 'My Missions')}</h2>
              <p className="text-sm text-text-main/50 mt-1">{activeTab === 'Mall' ? t('印章兑换社区福利', 'Redeem stamps for perks') : activeTab === 'Market' ? t('助人为乐，获得奖励', 'Help others to earn stamps') : t('联系邻居提供帮助', 'Contact neighbors to help')}</p>
            </div>
          </div>

          {activeTab === 'Mall' && (
            <div className="grid grid-cols-2 gap-5">
              {mallRewards.map((reward, i) => (
                <div key={i} className="group flex flex-col p-3 bg-white rounded-[2.5rem] shadow-soft border border-transparent hover:border-primary/20 transition-all">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-3 shadow-inner">
                    <img src={reward.img} alt={reward.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/50">
                       <span className="material-symbols-outlined text-amber-500 text-xs filled">stars</span>
                       <span className="text-[10px] font-bold text-accent-black">{reward.cost}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-1 pb-2">
                    <h3 className="font-bold text-accent-black leading-tight text-sm">{reward.title}</h3>
                    <p className="text-[10px] text-text-main/50 font-medium">{reward.sub}</p>
                    <button 
                      onClick={() => {
                        if (stamps >= reward.cost) {
                          // 点击兑换后跳转至二维码页面
                          onNavigate(Screen.RedeemSuccess, { rewardName: reward.title, cost: reward.cost });
                        }
                      }} 
                      disabled={stamps < reward.cost}
                      className={`mt-3 w-full py-3 rounded-xl font-bold text-[10px] transition-all ${stamps >= reward.cost ? 'bg-primary/10 text-primary-dark active:scale-95 shadow-sm' : 'bg-gray-100 text-gray-400 opacity-50'}`}
                    >
                      {stamps >= reward.cost ? t('兑换', 'Redeem') : t('印章不足', 'N/A')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Market' && (
            <div className="flex flex-col gap-6">
              {marketRequests.filter(req => !acceptedIds.has(req.id)).length === 0 ? (
                 <div className="py-20 text-center text-gray-300 font-bold">{t('目前没有新需求', 'No new requests')}</div>
              ) : (
                marketRequests.filter(req => !acceptedIds.has(req.id)).map((req) => (
                  <div key={req.id} className="p-6 bg-white rounded-[2.5rem] shadow-soft border border-black/5">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={req.avatar} className="size-12 rounded-full border border-primary/20" alt={req.user} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-accent-black">{req.user}</span>
                          <span className="text-[9px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-bold uppercase">{req.tag}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">{req.time}</p>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-accent-black mb-2">{req.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">{req.desc}</p>
                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-primary">
                        <span className="material-symbols-outlined text-lg filled">stars</span>
                        <span className="text-lg font-bold">+{req.reward}</span>
                        <span className="text-xs font-bold text-gray-400">{t('印章', 'Stamps')}</span>
                      </div>
                      <button onClick={() => handleAcceptTask(req.id)} className="px-8 py-3.5 rounded-2xl bg-accent-black text-white text-sm font-bold active:scale-95 transition-all shadow-lg">{t('我可以帮她', 'Accept')}</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'MyHelp' && (
            <div className="flex flex-col gap-6">
              {myAcceptedTasks.length === 0 ? (
                <div className="py-20 text-center text-gray-300 font-bold">{t('暂无待完成任务', 'No pending tasks')}</div>
              ) : (
                myAcceptedTasks.map((req) => (
                  <div key={req.id} onClick={() => setSelectedTaskDetail(req)} className="p-6 bg-white rounded-[2.5rem] shadow-soft border-2 border-primary/20 cursor-pointer active:scale-95 transition-all hover:bg-primary/5">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                         <img src={req.avatar} className="size-10 rounded-full" alt={req.user} />
                         <span className="font-bold text-accent-black">{req.user}</span>
                       </div>
                       <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full">{t('待完成', 'Visit')}</span>
                    </div>
                    <h3 className="font-bold text-lg text-accent-black mb-1">{req.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{req.desc}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Task Detail Modal */}
      {selectedTaskDetail && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-accent-black/60 backdrop-blur-md" onClick={() => setSelectedTaskDetail(null)} />
          <div className="relative w-full bg-white rounded-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-400">
             <div className="flex justify-between items-start mb-8">
               <div className="flex items-center gap-4">
                 <img src={selectedTaskDetail.avatar} className="size-16 rounded-full" alt={selectedTaskDetail.user} />
                 <div>
                    <h3 className="text-2xl font-bold text-accent-black">{selectedTaskDetail.user}</h3>
                    <p className="text-xs text-primary font-bold">{t('信誉度: A+', 'Trust: A+')}</p>
                 </div>
               </div>
               <button onClick={() => setSelectedTaskDetail(null)} className="size-10 rounded-full bg-background-beige flex items-center justify-center">
                 <span className="material-symbols-outlined font-bold">close</span>
               </button>
             </div>

             <div className="space-y-6 mb-10">
               <div className="p-6 bg-background-beige rounded-[2rem]">
                  <h4 className="text-lg font-bold text-accent-black mb-2">{selectedTaskDetail.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedTaskDetail.desc}</p>
               </div>
               <div className="p-5 bg-background-beige rounded-3xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-xl font-bold">home_pin</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('联系地址', 'ADDRESS')}</span>
                  </div>
                  <p className="text-xl font-bold text-accent-black">{selectedTaskDetail.location}</p>
               </div>
               <div className="p-5 bg-background-beige rounded-3xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-xl font-bold">call</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('联系电话', 'PHONE')}</span>
                  </div>
                  <p className="text-xl font-bold text-accent-black">{selectedTaskDetail.phone}</p>
               </div>
             </div>

             <button onClick={() => onNavigate(Screen.Scan, { reward: selectedTaskDetail.reward, userName: selectedTaskDetail.user, type: 'transfer' })}
               className="w-full py-5 bg-gradient-to-r from-accent-black to-accent-black/90 text-white font-bold rounded-[2.5rem] shadow-floating active:scale-95 transition-all flex items-center justify-center gap-3"
             >
               <span className="material-symbols-outlined text-primary font-bold">qr_code_scanner</span>
               {t('完成服务并扫码领印章', 'Finish & Scan to claim')}
             </button>
          </div>
        </div>
      )}

      {showCard && <CommunityCardModal onClose={() => setShowCard(false)} stamps={stamps} />}
      <BottomNav currentScreen={Screen.MutualAid} onNavigate={onNavigate} language={language} />
    </div>
  );
};

export default MutualAidScreen;
