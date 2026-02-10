
import React, { useState } from 'react';

interface VolunteerPortalScreenProps {
  onBack: () => void;
  onConfirm: () => void;
  language: 'zh' | 'en';
}

const VolunteerPortalScreen: React.FC<VolunteerPortalScreenProps> = ({ onBack, onConfirm, language }) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (zh: string, en: string) => language === 'zh' ? zh : en;

  const skills = [
    { id: 'Gardening', label: t('园艺护理', 'Gardening') },
    { id: 'Repairing', label: t('维修家电', 'Repairing') },
    { id: 'Shopping', label: t('代买物资', 'Shopping') },
    { id: 'Teaching', label: t('老年课堂', 'Teaching') },
    { id: 'Listening', label: t('心理陪伴', 'Listening') },
    { id: 'Escorting', label: t('就医陪护', 'Escorting') }
  ];

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId) ? prev.filter(s => s !== skillId) : [...prev, skillId]
    );
  };

  const handleActivate = () => {
    setIsSubmitting(true);
    // Simulate submission to the "Gardener" backend
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm();
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="flex items-center p-6 gap-4 sticky top-0 bg-background-beige/95 backdrop-blur-md z-30">
        <button onClick={onBack} className="size-12 flex items-center justify-center rounded-full bg-white shadow-soft active:scale-90 transition-transform">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h1 className="text-2xl font-bold text-accent-black">{t('成为志愿者', 'Be a Volunteer')}</h1>
      </header>

      <main className="p-6 space-y-8 flex-1">
        <div className="relative h-64 rounded-[3rem] overflow-hidden shadow-floating group">
          <img
            src="https://images.unsplash.com/photo-1559023953-a12ed1527632?q=80&w=600&auto=format&fit=crop"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            alt="Community Volunteering"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
            <h2 className="text-white text-3xl font-bold leading-tight">{t('点亮社区，温暖邻里', 'Light up the community together')}</h2>
          </div>
        </div>

        <section className="space-y-6">
          <div className="flex gap-4">
            <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-soft">
              <span className="material-symbols-outlined">check</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-accent-black">{t('分享你的智慧', 'Share Your Wisdom')}</h3>
              <p className="text-sm text-gray-500 font-medium">{t('你的技能可以帮助邻居修好收音机或学会使用智能手机。', 'Your skills can help neighbors fix radios or learn smartphones.')}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-soft">
              <span className="material-symbols-outlined">check</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-accent-black">{t('赚取双倍印章', 'Earn Double Stamps')}</h3>
              <p className="text-sm text-gray-500 font-medium">{t('作为志愿者，每次提供帮助都能获得额外印章奖励。', 'Volunteers earn bonus stamps for every help provided.')}</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-[3rem] shadow-soft border border-black/5">
          <p className="text-sm font-bold text-accent-black mb-5 uppercase tracking-widest">{t('选择你的技能:', 'Select your skills:')}</p>
          <div className="flex flex-wrap gap-3">
            {skills.map(s => {
              const isSelected = selectedSkills.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSkill(s.id)}
                  className={`px-5 py-3 rounded-full border-2 font-bold text-sm transition-all duration-300 active:scale-95 flex items-center gap-2 ${isSelected
                    ? 'bg-primary border-primary text-white shadow-md ring-4 ring-primary/20'
                    : 'bg-white border-primary/20 text-primary hover:border-primary/50'
                    }`}
                >
                  {isSelected && <span className="material-symbols-outlined text-sm filled">check_circle</span>}
                  {s.label}
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-xs text-gray-400 leading-relaxed italic">
            {t('* 注：申请将由社区园丁（管理员）审核。审核通过后您将收到通知。', '* Note: Applications are reviewed by the community Gardener. You will be notified once approved.')}
          </p>
        </section>
      </main>

      <div className="p-6 pb-10">
        <button
          onClick={handleActivate}
          disabled={selectedSkills.length === 0 || isSubmitting}
          className={`w-full h-16 rounded-full font-bold text-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 overflow-hidden relative ${selectedSkills.length > 0 ? 'bg-accent-black text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-3">
              <div className="size-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              <span>{t('提交中...', 'Submitting...')}</span>
            </div>
          ) : (
            <>
              <span>{t('立即激活身份', 'Activate Now')}</span>
              <span className="material-symbols-outlined text-primary">electric_bolt</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VolunteerPortalScreen;
