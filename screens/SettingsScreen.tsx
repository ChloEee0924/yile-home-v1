
import React, { useState } from 'react';
import { Screen } from '../types';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (screen: Screen) => void;
  language: 'zh' | 'en';
  setLanguage: (lang: 'zh' | 'en') => void;
  textSize: 'standard' | 'medium' | 'large';
  setTextSize: (size: 'standard' | 'medium' | 'large') => void;
  phone: string;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onLogout,
  onNavigate,
  language,
  setLanguage,
  textSize,
  setTextSize,
  phone
}) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCacheCleared, setIsCacheCleared] = useState(false);

  interface SectionItem {
    label: string;
    icon: string;
    type: 'toggle' | 'link' | 'options' | 'info';
    value?: string;
    action: () => void;
  }

  interface Section {
    title: string;
    items: SectionItem[];
    footer?: string;
  }

  const t = (zh: string, en: string) => language === 'zh' ? zh : en;

  const sections: Section[] = [
    {
      title: t('个性化偏好', 'PREFERENCES'),
      items: [
        {
          label: t('应用语言', 'App Language'),
          icon: 'language',
          type: 'toggle',
          value: language === 'zh' ? '简体中文' : 'English',
          action: () => setLanguage(language === 'zh' ? 'en' : 'zh')
        },
        {
          label: t('文字大小', 'Text Size'),
          icon: 'format_size',
          type: 'options',
          value: textSize === 'standard' ? t('标准', 'Standard') : textSize === 'medium' ? t('中等', 'Medium') : t('特大', 'Large'),
          action: () => {
            const sizes: ('standard' | 'medium' | 'large')[] = ['standard', 'medium', 'large'];
            const currentIdx = sizes.indexOf(textSize);
            setTextSize(sizes[(currentIdx + 1) % 3]);
          }
        },
      ],
      // 按照图片要求，只保留这一行说明文字
    },
    {
      title: t('账户与安全', 'ACCOUNT & SECURITY'),
      items: [
        { label: t('个人资料修改', 'Edit Profile'), icon: 'person_edit', type: 'link', action: () => onNavigate(Screen.Profile) },
        { label: t('隐私权限管理', 'Privacy Management'), icon: 'security', type: 'link', action: () => onNavigate(Screen.Privacy) },
        { label: t('地址管理', 'Address Settings'), icon: 'location_on', type: 'link', action: () => onNavigate(Screen.AddressSettings) },
        { label: t('绑定手机', 'Phone Number'), icon: 'phone_iphone', type: 'info', value: phone, action: () => { } },
      ]
    },
    {
      title: t('关于应用', 'ABOUT APP'),
      items: [
        {
          label: t('清除应用缓存', 'Clear Cache'),
          icon: 'delete_sweep',
          type: 'info',
          value: isCacheCleared ? t('已清除', 'Cleared') : '42.5 MB',
          action: () => {
            setIsCacheCleared(true);
            setTimeout(() => setIsCacheCleared(false), 3000);
          }
        },
        { label: t('当前版本', 'Version'), icon: 'info', type: 'info', value: 'v2.5.0-preview', action: () => { } },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="sticky top-0 z-50 flex items-center bg-background-beige/95 backdrop-blur-md px-6 py-4 justify-between border-b border-black/5">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full bg-white shadow-soft active:scale-95 transition-all">
          <span className="material-symbols-outlined text-xl font-bold">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-accent-black">{t('设置', 'Settings')}</h1>
        <div className="size-10" />
      </header>

      <main className="flex-1 p-6 space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">
              {section.title}
            </h3>
            <div className="bg-white rounded-[2.5rem] shadow-soft overflow-hidden border border-black/5">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-5 active:bg-gray-50 transition-colors ${i < section.items.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[22px] font-bold">{item.icon}</span>
                    </div>
                    <span className="text-base font-bold text-accent-black">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && <span className={`text-sm font-bold ${item.label === t('清除应用缓存', 'Clear Cache') && isCacheCleared ? 'text-primary' : 'text-gray-400'}`}>{item.value}</span>}
                    {item.type === 'link' && <span className="material-symbols-outlined text-gray-300 font-bold">chevron_right</span>}
                    {item.type === 'toggle' && (
                      <div className={`w-12 h-6 rounded-full relative p-1 transition-colors ${language === 'zh' ? 'bg-primary' : 'bg-gray-400'}`}>
                        <div className={`size-4 bg-white rounded-full shadow-sm transition-transform ${language === 'zh' ? 'translate-x-0' : 'translate-x-6'}`} />
                      </div>
                    )}
                    {item.type === 'options' && (
                      <span className="material-symbols-outlined text-primary text-xl font-bold">tune</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {section.footer && (
              <p className="mt-2 px-3 text-xs text-blue-500 font-bold leading-relaxed">
                {section.footer}
              </p>
            )}
          </div>
        ))}

        <div className="pt-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full py-5 bg-red-50 text-red-500 rounded-[2.5rem] font-bold text-lg shadow-sm border border-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform font-bold">logout</span>
            {t('退出登录', 'Logout')}
          </button>
        </div>
      </main>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-accent-black/80 backdrop-blur-md" onClick={() => setShowLogoutModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl text-center animate-in zoom-in duration-300">
            <span className="material-symbols-outlined text-5xl text-red-500 mb-4 font-bold">logout</span>
            <h2 className="text-2xl font-bold text-accent-black mb-2">{t('确认退出？', 'Logout?')}</h2>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              {t('退出后您将需要重新验证身份以访问个人数据。', 'Requires re-authentication.')}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl active:scale-95 transition-all">{t('取消', 'No')}</button>
              <button onClick={() => { setShowLogoutModal(false); onLogout(); }} className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all">{t('确认', 'Yes')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
