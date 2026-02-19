
import React, { useMemo, useState } from 'react';
import { Screen, UserRole, Activity } from '../types';
import { IMAGES } from '../constants';
import BottomNav from '../components/BottomNav';
import { getBeijingDate, getCurrentWeekDays } from '../utils/dateUtils';

interface HomeScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  onOpenVolunteerTools: () => void;
  userRole: UserRole;
  activities: Activity[];
  nickname: string;
  avatar: string;
  completedMissionIds: string[];
  onMissionComplete: (id: string, label: string, reward: number) => void;
  language: 'zh' | 'en';
}

interface Mission {
  id: string;
  title: string;
  desc: string;
  category: string;
  reward: number;
  bonus?: string;
  icon: string;
  fixed?: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenVolunteerTools,
  userRole,
  activities,
  nickname,
  avatar,
  completedMissionIds,
  onMissionComplete,
  language
}) => {
  const isAuthorized = userRole === UserRole.Staff || userRole === UserRole.Volunteer;
  const t = (zh: string, en: string) => language === 'zh' ? zh : en;

  // Use Dynamic Date
  const { day: todayDay } = React.useMemo(() => getBeijingDate(), []);
  const [selectedDate, setSelectedDate] = useState(todayDay);

  // Initial selection to today
  React.useEffect(() => {
    setSelectedDate(todayDay);
  }, [todayDay]);

  // Mock Dynamic Missions with i18n
  // Map mission IDs to weekday index (0-6)
  // 0: Mon, 1: Tue, ... 6: Sun
  const dynamicMissionsTemplate: Mission[] = [
    { id: 'm-mon', title: t('草本晨间茶', 'Morning Herb Tea'), desc: t('在服务中心尝试今日推荐的新鲜薄荷茶。', 'Try today\'s fresh mint tea at the center.'), category: t('10 分钟味觉探索', '10m Taste Exploration'), reward: 5, icon: 'restaurant' },
    { id: 'm-tue', title: t('花园写生之旅', 'Garden Sketching'), desc: t('带上纸笔，捕捉园中花朵最动人的瞬间。', 'Capture the flowers with paper and pen.'), category: t('20 分钟视觉探索', '20m Visual Exploration'), reward: 5, icon: 'palette' },
    { id: 'm-wed', title: t('聆听自然共鸣', 'Natural Resonance'), desc: t('寻找翠竹风铃，记录一段大自然的旋律。', 'Find bamboo chimes and record nature.'), category: t('10 分钟听觉探索', '10m Audio Exploration'), reward: 5, icon: 'hearing' },
    { id: 'm-thu', title: t('五感花园漫步', 'Sensory Walk'), desc: t('去社区花园深呼吸，听听鸟叫，找寻大自然的声音。', 'Take a deep breath and listen to birds.'), category: t('10 分钟感官探索', '10m Sensory Exploration'), reward: 5, icon: 'timer' },
    { id: 'm-fri', title: t('多肉景墙探秘', 'Succulent Wall'), desc: t('感受不同多肉植物的厚实叶片与独特纹理。', 'Feel the textures of succulents.'), category: t('15 分钟触觉探索', '15m Touch Exploration'), reward: 5, icon: 'back_hand' },
    { id: 'm-sat', title: t('晨间气功体验', 'Morning Qigong'), desc: t('加入长寿亭的太极小组，感受身体的律动。', 'Join Tai Chi at the Longevity Pavilion.'), category: t('30 分钟社区社交', '30m Community Social'), reward: 5, icon: 'fitness_center' },
    { id: 'm-sun', title: t('寻找芳香奇迹', 'Scent Miracle'), desc: t('在薰衣草小径中，辨识出今日最浓郁的香气。', 'Identify the strongest scent on the path.'), category: t('10 分钟嗅觉探索', '10m Scent Exploration'), reward: 5, icon: 'air' },
  ];

  const FIXED_PLANTING_MISSION: Mission = {
    id: 'fixed-planting',
    title: t('黄房子种植课', 'Yellow House Planting'),
    desc: t('前往北区黄房子参与社区集体种植。', 'Visit the North Zone Yellow House for planting.'),
    category: t('每周二/四/六固定活动', 'Tue/Thu/Sat Event'),
    reward: 3,
    bonus: t('植物开花结果额外奖励 1 印章', 'Bonus 1 for flowering'),
    icon: 'potted_plant',
    fixed: true
  };

  // const { day: todayDay, month: todayMonth } = React.useMemo(() => getBeijingDate(), []);

  const calendarDays = useMemo(() => getCurrentWeekDays(language), [language]);

  const missionsForDay = useMemo(() => {
    // Determine which mission from the template to show based on the selected date
    // We can map the selectedDate (day of month) to a weekday index (0-6)
    // First find the full date object corresponding to the selectedDate in the current week
    const selectedDayData = calendarDays.find(d => d.date === selectedDate);

    // Default to Monday (0) if not found (shouldn't happen if selectedDate is in calendarDays)
    let weekdayIndex = 0;
    if (selectedDayData && selectedDayData.fullDate) {
      // getBeijingDate uses 0=Sunday, 1=Monday... 6=Saturday in standard JS new Date().getDay()
      // But our template uses 0=Mon, ... 6=Sun OR we can just use the index directly
      // Let's rely on standard JS getDay(): 0=Sun, 1=Mon...6=Sat.
      // Our template array `dynamicMissionsTemplate` has size 7. 
      // Let's assume index 0 = Mon, 1 = Tue... 5 = Sat, 6 = Sun.

      const jsDay = selectedDayData.fullDate.getDay(); // 0(Sun) - 6(Sat)
      // Convert to 0(Mon) - 6(Sun)
      weekdayIndex = jsDay === 0 ? 6 : jsDay - 1;
    }

    const dailyMission = dynamicMissionsTemplate[weekdayIndex];
    const list = dailyMission ? [dailyMission] : [];

    const isPlantingDay = selectedDayData?.isPlantingDay;
    if (isPlantingDay) {
      list.push(FIXED_PLANTING_MISSION);
    }
    return list;
  }, [selectedDate, language, calendarDays]);

  const isPast = selectedDate < todayDay; // Simple comparison for same month
  const isFuture = selectedDate > todayDay;
  const isToday = selectedDate === todayDay;

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background-beige/95 backdrop-blur-sm p-6 pb-2">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate(Screen.Profile)}>
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-14 shadow-sm border-2 border-white"
            style={{ backgroundImage: `url("${avatar}")` }}
          />
          <div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-accent-black">{t('怡乐家园', 'Yile Home')}</h1>
            <p className="text-sm font-medium text-text-main/60">
              {userRole === UserRole.Staff ? t('管理员认证中', 'Admin Verification') : `${t('早安', 'Good morning')}, ${nickname}`}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate(Screen.Notifications)}
          className="flex size-12 items-center justify-center rounded-full bg-white shadow-soft text-accent-black hover:bg-secondary transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">notifications</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-6 pt-4 overflow-y-auto no-scrollbar">
        <section aria-label="Weather">
          <div className="flex items-stretch justify-between gap-4 rounded-3xl bg-surface-beige p-6 shadow-soft">
            <div className="flex flex-col justify-center gap-2 flex-[2]">
              <div className="flex items-center gap-3 mb-1">
                <span className="material-symbols-outlined text-amber-500 text-[36px] filled">wb_sunny</span>
                <span className="text-4xl font-bold text-accent-black">24°C</span>
              </div>
              <p className="text-lg font-bold text-text-main/80">{t('晴空万里', 'Sunny Skies')}</p>
              <div className="mt-1 inline-flex items-center gap-1.5 bg-primary-light/40 px-3 py-1 rounded-full w-fit">
                <span className="material-symbols-outlined text-[18px] text-primary-dark filled">water_drop</span>
                <span className="text-primary-dark text-sm font-bold">{t('节气：谷雨', 'Term: Grain Rain')}</span>
              </div>
            </div>
            <div
              className="w-1/3 aspect-square bg-center bg-no-repeat bg-cover rounded-2xl flex-1 shadow-inner overflow-hidden border-2 border-white/50"
              style={{ backgroundImage: `url("${IMAGES.GARDEN_THUMB}")` }}
            >
              <div className="w-full h-full bg-black/10 backdrop-blur-[1px] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl opacity-60">rainy</span>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Daily Missions">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-bold text-accent-black">{t('智能任务推送', 'Daily Missions')}</h2>
            <button
              onClick={() => onNavigate(Screen.History)}
              className="flex items-center gap-1 text-[11px] font-bold text-primary-dark bg-primary-light/30 px-3 py-1.5 rounded-full hover:bg-primary-light/50 transition-all"
            >
              {t('查看历史', 'History')}
              <span className="material-symbols-outlined text-sm">history</span>
            </button>
          </div>

          <div className="flex justify-between items-center mb-6 bg-white/40 p-2 rounded-[2rem] backdrop-blur-sm shadow-soft ring-1 ring-black/5 overflow-x-auto no-scrollbar">
            {calendarDays.map((item, idx) => {
              const isSelected = selectedDate === item.date;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(item.date)}
                  className={`flex flex-col items-center justify-center min-w-[3.2rem] h-12 rounded-2xl transition-all duration-300 relative ${isSelected ? 'bg-primary text-white shadow-lg scale-110 z-10' : 'text-text-main/40 hover:text-text-main/60'
                    } ${item.isToday && !isSelected ? 'ring-2 ring-primary ring-inset' : ''}`}
                >
                  <span className="text-[10px] font-bold mb-0.5">{item.day}</span>
                  <span className="text-base font-bold leading-none">{item.date}</span>
                  {item.isPlantingDay && (
                    <div className={`absolute top-1 right-1 size-1.5 rounded-full bg-amber-400 border border-white shadow-sm`}></div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-4">
            {missionsForDay.map((mission) => {
              const missionKey = `${selectedDate}-${mission.id}`;
              const isDone = completedMissionIds.includes(missionKey);

              return (
                <div
                  key={mission.id}
                  className={`relative overflow-hidden rounded-[2.5rem] p-6 shadow-soft border border-white/40 transition-all duration-500 ${isDone || isPast ? 'bg-[#f8faf0] grayscale-[0.3]' : isFuture ? 'bg-[#F2F3EF]' : mission.fixed ? 'bg-[#FFF9E6]' : 'bg-[#E2E6D1]'
                    }`}
                >
                  <div className="relative z-10 flex flex-col gap-3">
                    <div className={`flex items-center justify-between`}>
                      <div className={`flex items-center gap-2 ${isFuture ? 'text-gray-400' : isDone ? 'text-primary' : 'text-primary-dark/70'}`}>
                        <span className="material-symbols-outlined filled text-[18px]">
                          {isFuture ? 'lock' : isDone ? 'task_alt' : mission.icon}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                          {isFuture ? t('任务预告', 'Upcoming') : isDone ? t('任务已完成', 'Completed') : isPast ? t('已结束', 'Ended') : mission.category}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className={`text-xl font-bold leading-tight ${isFuture ? 'text-gray-400' : 'text-accent-black'}`}>
                        {mission.title}
                      </h3>
                      <p className={`text-sm font-medium leading-relaxed ${isFuture ? 'text-gray-300' : 'text-text-main/60'}`}>
                        {isDone ? t('感谢您的参与，奖励已存入互助账户。', 'Thank you! Reward claimed.') : isFuture ? t('敬请期待，暂时无法提前开始。', 'Stay tuned! Starting soon.') : mission.desc}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 backdrop-blur-md border ${isFuture ? 'bg-gray-100 border-gray-200 text-gray-400' :
                        isDone || isPast ? 'bg-primary/10 border-primary/20 text-primary-dark' :
                          'bg-white/60 border-white/50 text-accent-black'
                        }`}>
                        <span className={`material-symbols-outlined filled text-[18px] ${isFuture ? 'text-gray-300' : isDone || isPast ? 'text-primary' : 'text-amber-500'
                          }`}>stars</span>
                        <span className="text-xs font-bold">
                          {isFuture ? t('待领印章', 'Pending') : isDone || isPast ? t('已领取', 'Claimed') : `+${mission.reward} ${t('枚印章', 'Stamps')}`}
                        </span>
                      </div>

                      {isToday && !isDone && (
                        <button
                          onClick={() => {
                            const params: any = { mode: 'guided', showRoute: true, missionId: missionKey, reward: mission.reward };
                            if (mission.id === 'fixed-planting') {
                              params.targetId = 'l5'; // Yellow House
                              params.missionLabel = '种植任务';
                            }
                            onNavigate(Screen.GardenMap, params);
                          }}
                          className="bg-accent-black text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center gap-2"
                        >
                          <span>{mission.id === 'fixed-planting' ? t('完成种植', 'Start Planting') : t('开启挑战', 'Start Challenge')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Community Board Restored */}
        <section aria-label="Community Board" className="mt-4 pb-12">
          <div className="flex items-center justify-between px-1 mb-4">
            <h2 className="text-xl font-bold text-accent-black">{t('社区公告栏', 'Community Board')}</h2>
            <button
              onClick={() => onNavigate(Screen.ActivityList)}
              className="text-sm font-bold text-primary-dark hover:text-primary transition-colors flex items-center gap-1"
            >
              {t('查看全部', 'View All')} <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
          <div className="flex flex-col gap-5">
            {activities.slice(0, 2).map((activity) => (
              <div
                key={activity.id}
                onClick={() => onNavigate(Screen.ActivityDetails, { activityId: activity.id })}
                className="group flex flex-col rounded-[2.5rem] bg-white shadow-soft overflow-hidden cursor-pointer active:scale-[0.98] transition-all border border-black/5"
              >
                <div
                  className="h-48 w-full bg-cover bg-center relative"
                  style={{ backgroundImage: `url("${activity.imageUrl}")` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-accent-black shadow-sm">
                      {activity.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex gap-4 items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-accent-black leading-tight mb-2">{activity.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                  <button className="shrink-0 size-12 rounded-full bg-primary/10 hover:bg-primary group-hover:bg-primary transition-all flex items-center justify-center text-primary group-hover:text-white">
                    <span className="material-symbols-outlined">arrow_outward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {isAuthorized && (
        <div className="fixed bottom-28 right-6 z-40 animate-in zoom-in duration-300">
          <button
            onClick={onOpenVolunteerTools}
            className="group relative flex size-16 items-center justify-center rounded-full bg-primary shadow-floating transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-white text-[32px] filled transform group-hover:rotate-12 transition-transform">eco</span>
          </button>
        </div>
      )}

      <BottomNav currentScreen={Screen.Home} onNavigate={onNavigate} />
    </div>
  );
};

export default HomeScreen;
