
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (phone: string) => void;
  language: 'zh' | 'en';
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, language }) => {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (zh: string, en: string) => language === 'zh' ? zh : en;

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 11) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin(phone);
    }, 1500);
  };

  const handleWeChatLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin('138****8821'); // WeChat default
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBF6] p-8 font-display">
      <div className="flex-1 flex flex-col justify-center items-center max-w-sm mx-auto w-full">
        {/* Brand Header */}
        <div className="mb-16 text-center animate-in fade-in zoom-in duration-700">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
            <div className="relative size-28 rounded-full bg-primary flex items-center justify-center mx-auto shadow-floating border-4 border-white">
              <span className="material-symbols-outlined text-6xl text-white filled">spa</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-accent-black tracking-tighter mb-3">{t('怡乐家园', 'Yile Home')}</h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-primary/30"></div>
            <p className="text-stone-500 font-medium text-sm tracking-widest uppercase">{t('温馨社区 · 互助相伴', 'Warm Community · Mutual Aid')}</p>
            <div className="h-px w-8 bg-primary/30"></div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handlePhoneLogin} className="w-full space-y-8">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">smartphone</span>
                <div className="h-4 w-px bg-gray-200"></div>
              </div>
              <input
                type="tel"
                placeholder={t('请输入手机号码', 'Enter Phone Number')}
                maxLength={11}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-16 pr-6 py-6 bg-white border-2 border-transparent focus:border-primary/30 rounded-[2rem] shadow-soft text-2xl font-bold tracking-widest placeholder:text-gray-200 placeholder:font-normal placeholder:tracking-normal outline-none transition-all focus:shadow-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={phone.length < 11 || isSubmitting}
            className={`w-full py-6 rounded-[2rem] font-bold text-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 overflow-hidden relative group ${phone.length === 11 ? 'bg-accent-black text-white' : 'bg-gray-100 text-gray-300 opacity-60'
              }`}
          >
            {isSubmitting ? (
              <div className="size-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="relative z-10">{t('立即登录', 'Login Now')}</span>
                <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                {phone.length === 11 && <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>}
              </>
            )}
          </button>
        </form>

        {/* Alternative Login */}
        <div className="w-full mt-20 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
          <div className="relative flex items-center justify-center mb-10">
            <div className="absolute inset-x-0 h-px bg-gray-100" />
            <span className="relative bg-[#FBFBF6] px-6 text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">{t('其他快捷登录', 'OR LOGIN WITH')}</span>
          </div>

          <button
            onClick={handleWeChatLogin}
            disabled={isSubmitting}
            className="w-full py-5 bg-[#07C160] text-white rounded-[2rem] font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-4 hover:brightness-105"
          >
            <div className="size-8 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M8.22 3.1c-4.14 0-7.5 2.76-7.5 6.16 0 1.9 1.1 3.58 2.8 4.7l-.7 2.6c-.1.2 0 .4.2.5.1 0 .2.1.3.1.1 0 .2 0 .3-.1l3.1-1.6c.5.1 1 .1 1.5.1 4.14 0 7.5-2.76 7.5-6.16 0-3.4-3.36-6.16-7.5-6.16zm5.2 9.17c-2.8 0-5.07-1.87-5.07-4.17S10.62 3.93 13.42 3.93c2.81 0 5.08 1.86 5.08 4.17 0 1.28-.7 2.45-1.9 3.2l.47 1.76c.07.14 0 .27-.14.34-.07.03-.13.04-.2.04-.07 0-.13-.02-.2-.06l-2.09-1.08c-.34.03-.68.04-1.03.04z" />
              </svg>
            </div>
            <span>{t('微信一键登录', 'WeChat Login')}</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8 animate-in fade-in duration-1000 delay-500">
        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
          {t('登录即代表同意', 'By logging in, you agree to')} <span className="text-primary-dark font-bold hover:underline cursor-pointer">{t('用户协议', 'Terms')}</span> {t('与', '&')} <span className="text-primary-dark font-bold hover:underline cursor-pointer">{t('隐私政策', 'Privacy Policy')}</span>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
