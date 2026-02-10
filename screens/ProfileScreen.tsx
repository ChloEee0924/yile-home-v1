
import React, { useState, useRef } from 'react';
import { Screen, UserRole } from '../types';
import { IMAGES } from '../constants';
import BottomNav from '../components/BottomNav';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
  userRole: UserRole;
  onCertifyStaff: (role: UserRole) => void;
  profile: { nickname: string; avatar: string };
  onUpdateProfile: (update: Partial<{ nickname: string; avatar: string }>) => void;
  language: 'zh' | 'en';
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate, onBack, userRole, onCertifyStaff, profile, onUpdateProfile, language }) => {
  const [showCertifyModal, setShowCertifyModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(profile.nickname);
  const [staffId, setStaffId] = useState('');
  const [certifyError, setCertifyError] = useState(false);
  const [isRealNameVerified, setIsRealNameVerified] = useState(true);

  const t = (zh: string, en: string) => language === 'zh' ? zh : en;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCertify = () => {
    if (staffId.toUpperCase() === 'STAFF99') {
      onCertifyStaff(UserRole.Staff);
      setShowCertifyModal(false);
      setStaffId('');
    } else {
      setCertifyError(true);
      setTimeout(() => setCertifyError(false), 2000);
    }
  };

  const handleAvatarEdit = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveNickname = () => {
    onUpdateProfile({ nickname: nicknameInput });
    setIsEditingName(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <div className="sticky top-0 z-20 flex items-center bg-background-beige/90 backdrop-blur-md p-6 pb-2 justify-between border-b border-black/5">
        <button onClick={onBack} className="text-text-main flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-secondary">
          <span className="material-symbols-outlined text-3xl font-bold">arrow_back</span>
        </button>
        <h2 className="text-text-main text-xl font-bold flex-1 text-center">{t('个人中心', 'Profile Center')}</h2>
        <button onClick={() => onNavigate(Screen.Settings)} className="text-text-main flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-secondary">
          <span className="material-symbols-outlined text-3xl font-bold">settings</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center pt-10 pb-8 px-6">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className="relative mb-5 group">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-40 w-40 shadow-xl ring-8 ring-white overflow-hidden cursor-pointer active:scale-95 transition-all"
            style={{ backgroundImage: `url("${profile.avatar}")` }}
            onClick={handleAvatarEdit}
          />
          <button
            onClick={handleAvatarEdit}
            className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-full border-[5px] border-background-beige flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-xl font-bold">photo_camera</span>
          </button>
        </div>

        {isEditingName ? (
          <div className="flex items-center gap-2 mb-2 animate-in fade-in zoom-in duration-200">
            <input
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              onBlur={saveNickname}
              onKeyDown={(e) => e.key === 'Enter' && saveNickname()}
              autoFocus
              className="bg-white border-none rounded-xl px-4 py-2 text-2xl font-bold text-center text-accent-black shadow-soft focus:ring-2 focus:ring-primary w-48"
            />
            <button onClick={saveNickname} className="text-primary material-symbols-outlined font-bold text-3xl">check_circle</button>
          </div>
        ) : (
          <h1
            onClick={() => setIsEditingName(true)}
            className="text-3xl font-bold text-text-main mb-2 flex items-center gap-2 cursor-pointer group hover:text-primary transition-colors"
          >
            {profile.nickname}
            <span className="material-symbols-outlined text-gray-300 text-xl group-hover:text-primary transition-colors">edit</span>
          </h1>
        )}

        <button
          onClick={() => setIsRealNameVerified(!isRealNameVerified)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${isRealNameVerified ? 'bg-primary-light' : 'bg-gray-200 opacity-60'}`}
        >
          <span className={`material-symbols-outlined text-xl filled ${isRealNameVerified ? 'text-primary-dark' : 'text-gray-400'}`}>
            {isRealNameVerified ? 'verified' : 'new_releases'}
          </span>
          <span className={`font-semibold text-sm ${isRealNameVerified ? 'text-primary-dark' : 'text-gray-500'}`}>
            {isRealNameVerified ? t('已实名居民', 'Verified Resident') : t('未实名认证', 'Not Verified')}
          </span>
        </button>
      </div>

      <div className="flex-1 px-6 pb-32 space-y-4 pt-4">
        <h3 className="text-xl font-bold text-text-main px-1 mb-2">{t('功能菜单', 'Menu')}</h3>

        <div className="flex flex-col gap-4">
          {/* 找回工作人员认证入口 - 突出显示的黑色卡片 */}
          {userRole !== UserRole.Staff && (
            <button
              onClick={() => setShowCertifyModal(true)}
              className="group flex items-center w-full p-4 bg-accent-black rounded-[2rem] shadow-lg active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="size-14 rounded-2xl bg-white/20 text-white flex items-center justify-center mr-4 shrink-0">
                <span className="material-symbols-outlined text-3xl font-bold">badge</span>
              </div>
              <div className="flex-1 text-left z-10">
                <p className="text-lg font-bold text-white leading-tight">{t('工作人员认证', 'Staff Verification')}</p>
              </div>
              <span className="material-symbols-outlined text-primary text-2xl font-bold">chevron_right</span>
            </button>
          )}

          {[
            { label: t('我的订单', 'My Orders'), icon: 'receipt_long', color: 'bg-blue-50 text-blue-500', screen: Screen.MyOrders },
            { label: t('能力报告', 'Skill Report'), icon: 'analytics', color: 'bg-purple-50 text-purple-500', screen: Screen.SkillReport },
            { label: t('地址管理', 'Address Settings'), icon: 'pin_drop', color: 'bg-orange-50 text-orange-500', screen: Screen.AddressSettings },
            // 移除了图片标记的多余设置按钮
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className="group flex items-center w-full p-4 bg-white rounded-[2rem] shadow-soft border border-black/5 active:scale-[0.98] transition-all"
            >
              <div className={`size-14 rounded-2xl flex items-center justify-center mr-4 shrink-0 ${item.color}`}>
                <span className="material-symbols-outlined text-3xl font-bold">{item.icon}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-lg font-bold text-text-main leading-tight">{item.label}</p>
              </div>
              <span className="material-symbols-outlined text-gray-300 font-bold">chevron_right</span>
            </button>
          ))}

          {userRole === UserRole.Resident && (
            <button
              onClick={() => onNavigate(Screen.VolunteerPortal)}
              className="group relative flex items-center w-full p-6 bg-primary rounded-[2.5rem] shadow-floating active:scale-[0.98] transition-all mt-4 overflow-hidden"
            >
              <div className="size-14 rounded-2xl bg-white/20 text-white flex items-center justify-center mr-4 shrink-0">
                <span className="material-symbols-outlined text-3xl font-bold">diversity_1</span>
              </div>
              <div className="flex-1 text-left z-10 text-white">
                <p className="text-xl font-bold leading-tight">{t('加入志愿者', 'Join Volunteers')}</p>
                <p className="text-sm opacity-80 font-medium">{t('服务邻里，收获快乐', 'Serve neighbors, earn joy')}</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Staff Certification Modal */}
      {showCertifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-accent-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowCertifyModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                <span className="material-symbols-outlined text-4xl font-bold">security</span>
              </div>
              <h3 className="text-2xl font-bold text-accent-black">工作人员认证</h3>
              <p className="text-gray-500 font-medium mt-2">请输入您的内部认证编号以开启管理面板</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">认证编号</label>
                <input
                  type="text"
                  placeholder="例如: STAFF99"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className={`w-full p-5 bg-background-beige border-none rounded-2xl text-lg font-bold focus:ring-2 focus:ring-primary transition-all ${certifyError ? 'ring-2 ring-red-500 bg-red-50' : ''}`}
                />
                {certifyError && <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-pulse">认证码错误，请重新输入</p>}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCertifyModal(false)} className="flex-1 py-4 rounded-xl bg-gray-100 text-gray-500 font-bold active:scale-95 transition-all">取消</button>
                <button onClick={handleCertify} className="flex-[2] py-4 rounded-xl bg-accent-black text-white font-bold shadow-lg active:scale-95 transition-all">确认认证</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav currentScreen={Screen.Profile} onNavigate={onNavigate} language={language} />
    </div>
  );
};

export default ProfileScreen;
