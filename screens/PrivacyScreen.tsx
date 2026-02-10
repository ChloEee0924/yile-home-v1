
import React, { useState } from 'react';

interface PrivacyScreenProps {
  onBack: () => void;
  profile: { nickname: string; phone: string; isVerified: boolean };
  onUpdateProfile: (update: any) => void;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack, profile, onUpdateProfile }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [realName, setRealName] = useState(profile.isVerified ? '李梅' : '');
  const [idNumber, setIdNumber] = useState(profile.isVerified ? '4401**********0021' : '');
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  
  // Phone changing flow
  const [phoneFlowStep, setPhoneFlowStep] = useState<'idle' | 'verify_old' | 'enter_new'>('idle');
  const [smsCode, setSmsCode] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      onUpdateProfile({ isVerified: true });
      setIsVerifying(false);
      setIsEditingIdentity(false);
      alert('认证信息已保存');
    }, 1500);
  };

  const startPhoneChange = () => {
    setPhoneFlowStep('verify_old');
    setIsSendingSms(true);
    setTimeout(() => setIsSendingSms(false), 2000);
  };

  const verifyOldPhone = () => {
    if (smsCode === '1234') {
      setPhoneFlowStep('enter_new');
      setSmsCode('');
    } else {
      alert('验证码错误，请输入 1234 模拟测试');
    }
  };

  const confirmNewPhone = () => {
    if (newPhone.length === 11) {
      onUpdateProfile({ phone: newPhone.slice(0,3) + '****' + newPhone.slice(7) });
      setPhoneFlowStep('idle');
      setNewPhone('');
      alert('手机号更换成功！');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-beige">
      <header className="sticky top-0 z-50 flex items-center bg-background-beige/95 backdrop-blur-md px-6 py-4 justify-between border-b border-black/5">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full bg-white shadow-soft">
          <span className="material-symbols-outlined font-bold">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-accent-black">隐私权限管理</h1>
        <div className="size-10" />
      </header>

      <main className="p-6 space-y-8 pb-32">
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">实名认证状态</h3>
          <div 
            onClick={() => profile.isVerified && setIsEditingIdentity(!isEditingIdentity)}
            className={`bg-white rounded-[2.5rem] p-8 shadow-soft border transition-all active:scale-[0.98] cursor-pointer ${profile.isVerified ? 'border-primary/20' : 'border-black/5'} flex items-center gap-6`}
          >
            <div className={`size-16 rounded-full flex items-center justify-center shrink-0 ${profile.isVerified ? 'bg-primary/20 text-primary' : 'bg-amber-50 text-amber-500'}`}>
              <span className="material-symbols-outlined text-4xl filled">{profile.isVerified ? 'verified' : 'pending'}</span>
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold text-accent-black">{profile.isVerified ? '已认证' : '未认证'}</p>
              <p className="text-sm text-gray-500 font-medium">实名认证有助于提升社区互助可信度</p>
            </div>
            {profile.isVerified && (
              <span className="material-symbols-outlined text-gray-300">
                {isEditingIdentity ? 'expand_less' : 'chevron_right'}
              </span>
            )}
          </div>
        </section>

        {(!profile.isVerified || isEditingIdentity) && (
          <section className="space-y-4 animate-in slide-in-from-bottom duration-500">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">{profile.isVerified ? '修改身份信息' : '身份信息录入'}</h3>
            <div className="bg-white rounded-[2.5rem] p-6 shadow-soft space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">真实姓名</label>
                <input 
                  type="text"
                  placeholder="请输入姓名"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  className="w-full p-4 bg-background-beige rounded-2xl text-lg font-bold border-none outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">身份证号</label>
                <input 
                  type="text"
                  placeholder="请输入18位身份证号"
                  maxLength={18}
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full p-4 bg-background-beige rounded-2xl text-lg font-bold border-none outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
              <button 
                onClick={handleVerify}
                disabled={!realName || idNumber.length < 10 || isVerifying}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all ${realName && idNumber.length >= 10 ? 'bg-accent-black text-white' : 'bg-gray-200 text-gray-400'}`}
              >
                {isVerifying ? '正在保存...' : '确认并保存'}
              </button>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">绑定手机号</h3>
          <div className="bg-white rounded-[2.5rem] p-6 shadow-soft space-y-6 border border-black/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl font-bold">smartphone</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">当前绑定</p>
                  <p className="text-lg font-bold text-accent-black">{profile.phone}</p>
                </div>
              </div>
              {phoneFlowStep === 'idle' && (
                <button 
                  onClick={startPhoneChange}
                  className="px-4 py-2 bg-background-beige rounded-xl text-xs font-bold text-primary-dark active:scale-95 transition-all"
                >
                  更换手机号
                </button>
              )}
            </div>

            {phoneFlowStep === 'verify_old' && (
              <div className="pt-4 border-t border-gray-50 space-y-4 animate-in fade-in duration-300">
                <p className="text-sm font-bold text-accent-black">验证旧手机号</p>
                <p className="text-xs text-gray-400">已向 {profile.phone} 发送 4 位验证码</p>
                <div className="flex gap-4 items-center">
                  <input 
                    type="tel"
                    maxLength={4}
                    placeholder="1234"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    className="flex-1 p-4 bg-background-beige rounded-2xl text-xl font-bold tracking-[1em] text-center focus:ring-2 focus:ring-primary outline-none"
                  />
                  <button 
                    onClick={verifyOldPhone}
                    disabled={smsCode.length < 4}
                    className={`px-6 py-4 rounded-2xl font-bold ${smsCode.length === 4 ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-300'}`}
                  >
                    验证
                  </button>
                </div>
              </div>
            )}

            {phoneFlowStep === 'enter_new' && (
              <div className="pt-4 border-t border-gray-50 space-y-4 animate-in slide-in-from-right duration-300">
                <p className="text-sm font-bold text-primary">请输入新手机号</p>
                <div className="space-y-4">
                  <input 
                    type="tel"
                    maxLength={11}
                    placeholder="输入 11 位新手机号"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-4 bg-background-beige rounded-2xl text-lg font-bold focus:ring-2 focus:ring-primary outline-none"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setPhoneFlowStep('idle')} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 font-bold">取消</button>
                    <button 
                      onClick={confirmNewPhone}
                      disabled={newPhone.length < 11}
                      className={`flex-[2] py-4 rounded-2xl font-bold ${newPhone.length === 11 ? 'bg-accent-black text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}
                    >
                      确认更换
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="p-8 bg-accent-black rounded-[3rem] text-white relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <h4 className="flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
              隐私协议保障
            </h4>
            <p className="text-xs text-white/50 leading-relaxed font-medium">
              您的真实姓名与身份证信息仅用于社区认证，系统将进行高强度加密存储。未经允许不会向任何第三方披露。
            </p>
          </div>
          <span className="absolute -right-6 -bottom-6 material-symbols-outlined text-[100px] text-white/5 rotate-12">shield</span>
        </section>
      </main>
    </div>
  );
};

export default PrivacyScreen;
