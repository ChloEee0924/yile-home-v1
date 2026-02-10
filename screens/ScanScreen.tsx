
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { playSuccessSound } from '../utils/audio';
import { checkAndRequestPermissions } from '../utils/permission';

interface ScanScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen, params?: any) => void;
  onConfirm: (reward: number, label?: string) => void;
  params?: any;
}

const ScanScreen: React.FC<ScanScreenProps> = ({ onBack, onNavigate, onConfirm, params }) => {
  const [status, setStatus] = useState<'scanning' | 'found' | 'processing' | 'success'>('scanning');

  const scanMode = params?.scanMode || 'deduct';
  const rewardAmount = params?.reward || 1;
  const userName = params?.userName || '邻居';
  const isTransferMode = params?.type === 'transfer';

  // Error State for Permissions
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const [isPermissionChecked, setIsPermissionChecked] = useState(false);

  useEffect(() => {
    // Stage 0: Request Permissions
    const initPermissions = async () => {
      const granted = await checkAndRequestPermissions(['camera']);
      if (!granted) {
        setHasPermissionError(true);
      }
      setIsPermissionChecked(true);
    };
    initPermissions();
  }, []);

  useEffect(() => {
    // Stage 1: Scanning to Finding
    const findTimer = setTimeout(() => {
      setStatus('found');

      // Stage 2: Found to Action
      const nextTimer = setTimeout(() => {
        if (scanMode === 'add') {
          // If we are in "Add Stamps" mode, we simulate finding a resident's identity
          onNavigate(Screen.ManualStampEntry, { userName: '张大爷', userId: '8821' });
        } else {
          // If in "Deduct" or "Transfer" mode, we process a transaction
          setStatus('processing');
          setTimeout(() => {
            setStatus('success');
            playSuccessSound(); // Play success chime
            setTimeout(() => {
              if (isTransferMode) {
                onConfirm(rewardAmount, `邻里互助奖励: 从 ${userName} 账户转移`);
              } else {
                onConfirm(-3, '服务核销: 基础剪发'); // Confirm deduction for mall vouchers
              }
            }, 1000);
          }, 1500);
        }
      }, 1500);

      return () => clearTimeout(nextTimer);
    }, 3000); // Wait 3 seconds to simulate scanning

    return () => clearTimeout(findTimer);
  }, [onConfirm, onNavigate, isTransferMode, scanMode, rewardAmount, userName]);

  return (
    <div className="relative h-screen bg-[#1a1c19] overflow-hidden flex flex-col">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at center, #8DA338 2px, transparent 2px)',
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-20 animate-pulse" />
      </div>

      <header className="absolute top-0 left-0 w-full z-30 pt-12 px-6 flex items-center justify-between">
        <button onClick={onBack} className="size-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center border border-white/20 active:scale-90 transition-transform">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className={`px-6 py-2 rounded-full border backdrop-blur-md transition-all duration-500 ${status !== 'scanning' ? 'bg-primary border-primary text-accent-black scale-105 shadow-floating' : 'bg-white/10 border-white/20 text-white'
          }`}>
          <span className="font-bold tracking-tight text-sm">
            {status === 'scanning' ? `正在扫描二维码...` :
              status === 'found' ? `识别到 ${scanMode === 'add' ? '个人通行证' : '服务兑换码'}` :
                status === 'processing' ? `正在处理中...` : '处理完成'}
          </span>
        </div>
        <div className="size-12" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="relative w-full aspect-square max-w-xs">
          {/* Scanner UI */}
          <div className="absolute top-0 left-0 size-20 border-t-4 border-l-4 border-primary rounded-tl-[3rem] shadow-[0_0_20px_rgba(141,163,56,0.3)]" />
          <div className="absolute top-0 right-0 size-20 border-t-4 border-r-4 border-primary rounded-tr-[3rem] shadow-[0_0_20px_rgba(141,163,56,0.3)]" />
          <div className="absolute bottom-0 left-0 size-20 border-b-4 border-l-4 border-primary rounded-bl-[3rem] shadow-[0_0_20px_rgba(141,163,56,0.3)]" />
          <div className="absolute bottom-0 right-0 size-20 border-b-4 border-r-4 border-primary rounded-br-[3rem] shadow-[0_0_20px_rgba(141,163,56,0.3)]" />

          {status === 'scanning' && (
            <div className="absolute top-0 left-6 right-6 h-1.5 bg-primary shadow-[0_0_15px_#8DA338] blur-[1px] animate-[scan_2s_ease-in-out_infinite] rounded-full z-10" />
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            {status === 'processing' ? (
              <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-500">
                <div className="size-24 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <p className="text-primary font-bold">正在验证身份...</p>
              </div>
            ) : status === 'success' ? (
              <div className="size-32 rounded-full bg-primary flex items-center justify-center animate-in zoom-in duration-300">
                <span className="material-symbols-outlined text-6xl text-white filled">check_circle</span>
              </div>
            ) : (
              <div className="size-32 rounded-3xl border-2 border-white/5 flex items-center justify-center overflow-hidden">
                <span className={`material-symbols-outlined text-8xl transition-all duration-500 ${status === 'found' ? 'text-primary scale-110 opacity-100' : 'text-white/10 opacity-50'
                  }`}>
                  {scanMode === 'add' ? 'account_circle' : 'qr_code_scanner'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center space-y-4 max-w-[280px]">
          {hasPermissionError ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-red-400 font-bold text-lg">无法访问相机</p>
              <button
                onClick={async () => {
                  const granted = await checkAndRequestPermissions(['camera'], true);
                  if (granted) {
                    setHasPermissionError(false);
                    window.location.reload();
                  } else {
                    const isSecure = window.isSecureContext;
                    if (!isSecure) {
                      alert("无法访问相机：当前连接不安全 (HTTP)。\n\n请使用 HTTPS 协议或 localhost 访问。如果在手机上如果不使用 HTTPS，浏览器会强制屏蔽相机权限。");
                    } else {
                      alert("权限申请失败。\n请检查浏览器的【设置】或【网站设置】，手动允许访问相机。");
                    }
                  }
                }}
                className="px-6 py-2 bg-white/10 rounded-full text-white text-sm font-bold border border-white/20 active:scale-95"
              >
                重试
              </button>
            </div>
          ) : status === 'scanning' ? (
            <>
              <p className="text-white font-bold text-xl">请扫描服务对象二维码</p>
              <p className="text-white/40 text-sm font-medium leading-relaxed italic">
                {scanMode === 'add'
                  ? '扫描居民的个人二维码或身份识别卡，以便手动发放或录入印章。'
                  : '扫描居民出示的服务兑换码，系统将自动核销并扣除对应印章。'}
              </p>
            </>
          ) : status === 'processing' ? (
            <p className="text-primary font-bold text-xl animate-pulse">验证通过，正在处理印章流水...</p>
          ) : status === 'success' ? (
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
              <p className="text-white font-bold text-lg mb-2">处理成功</p>
              <p className="text-white/60 text-sm">操作已生效，可在历史记录中查看流水详情</p>
            </div>
          ) : (
            <p className="text-white font-bold text-xl">正在跳转下一步...</p>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0%, 100% { top: 10%; opacity: 0; }
          50% { top: 90%; opacity: 1; }
        }
      `}} />
    </div >
  );
};

export default ScanScreen;
