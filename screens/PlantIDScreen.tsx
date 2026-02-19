
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { identifyPlant, identifyPlantByDescription } from '../services/geminiService';
import { checkAndRequestPermissions } from '../utils/permission';
import { PlantInfo, Screen } from '../types';

interface PlantIDScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onEarnStamps: (amount: number, label?: string) => void;
  mode?: 'camera' | 'voice';
  pinId?: string;
  sensoryType?: string;
  hint?: string;
}

const PlantIDScreen: React.FC<PlantIDScreenProps> = ({ onBack, onNavigate, onEarnStamps, mode: initialMode = 'camera', pinId, sensoryType, hint }) => {
  const [mode, setMode] = useState<'camera' | 'voice'>(initialMode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [identification, setIdentification] = useState<PlantInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showStampAward, setShowStampAward] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasSimulatedRef = useRef(false);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Permission state
  const [hasCheckedPermissions, setHasCheckedPermissions] = useState(false);

  const startCamera = async () => {
    if (!hasCheckedPermissions) return; // Don't start if we haven't checked/asked yet

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Start camera failed", err);
      // Fallback silently
    }
  };

  const retryPermissions = async () => {
    setError(null);
    const result = await checkAndRequestPermissions(['camera', 'microphone'], true);
    if (result) {
      if (mode === 'camera') startCamera();
    } else {
      // Auto-fallback or silent fail - no alerts/errors as requested
      console.log("Permission retry failed - Using mock mode");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
  };

  useEffect(() => {
    // Initialize permissions for both camera and microphone sequentially
    const init = async () => {
      await checkAndRequestPermissions(['camera', 'microphone']);
      setHasCheckedPermissions(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (!hasCheckedPermissions) return;

    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode, hasCheckedPermissions]);

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

  const triggerStampAward = () => {
    setShowStampAward(true);
    onEarnStamps(1, `${sensoryType || 'Sensory'} Discovery`); // 实际增加全局印章数量，并提供具体标签
    setTimeout(() => setShowStampAward(false), 3000);
  };

  const captureAndIdentify = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    setError(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Check if video is active/ready
    if (video.videoWidth === 0 || video.paused || video.ended) {
      // Mock/Fallback for demo/no-permission
      setTimeout(async () => {
        try {
          // Direct Mock Result to ensure it works without API Key
          const mockResult: PlantInfo = {
            name: hint?.includes('玫瑰') ? 'Red Rose' : (hint?.includes('向日葵') ? 'Sunflower' : 'Garden Plant'),
            scientificName: hint?.includes('玫瑰') ? 'Rosa chinensis' : 'Helianthus annuus',
            description: 'A beautiful flowering plant common in gardens. It brings color and life to the environment.',
            careTips: ['Water regularly', 'Needs full sun', 'Prune dead leaves'],
            sourceType: 'plant'
          };
          setIdentification(mockResult);
          if (pinId) triggerStampAward();
        } catch (e) { console.error(e); }
        finally { setIsProcessing(false); }
      }, 2000);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);

    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];

    try {
      const result = await identifyPlant(base64Image);
      result.sourceType = 'plant';
      setIdentification(result);
      if (pinId) triggerStampAward();
      setIdentification(result);
      if (pinId) triggerStampAward();
    } catch (err: any) {
      console.error("Identification failed:", err);
      setError(err.message || "无法识别植物，请检查网络或重试");
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  }, [pinId, sensoryType]);

  // Auto-simulate identification for demo (Must be after captureAndIdentify definition)
  useEffect(() => {
    if (mode === 'camera' && !identification && !isProcessing && !hasSimulatedRef.current) {
      // Small initial delay before starting the countdown to simulate "looking"
      const timer = setTimeout(() => {
        hasSimulatedRef.current = true;
        captureAndIdentify();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mode, identification, isProcessing, captureAndIdentify]);

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);

    setTimeout(async () => {
      try {
        let mockDescription = "A nice plant";
        if (sensoryType === 'Smell') mockDescription = "Refreshing citrus smell from green leaves";
        if (sensoryType === 'Taste') mockDescription = "Cooling mint flavor with sweet aftertaste";
        if (sensoryType === 'Hearing') mockDescription = pinId === 'h1' ? "Bamboo chimes sound" : "Water flowing sound";

        const result = await identifyPlantByDescription(mockDescription);
        result.sourceType = sensoryType === 'Hearing' ? 'sound' : 'plant';
        setIdentification(result);
        if (pinId) triggerStampAward();
      } catch (err: any) {
        console.error("Voice ID failed:", err);
        setError(err.message || "无法识别描述，请重试");
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSensoryIcon = () => {
    switch (sensoryType) {
      case 'Vision': return 'visibility';
      case 'Hearing': return 'graphic_eq';
      case 'Smell': return 'air';
      case 'Touch': return 'back_hand';
      case 'Taste': return 'restaurant';
      default: return 'spa';
    }
  };

  const getAwardColor = () => {
    switch (sensoryType) {
      case 'Smell': return 'text-purple-500 bg-purple-400/30';
      case 'Taste': return 'text-orange-500 bg-orange-400/30';
      case 'Touch': return 'text-teal-500 bg-teal-400/30';
      default: return 'text-amber-500 bg-amber-400/30';
    }
  };

  return (
    <div className="relative h-screen bg-[#1a1c19] overflow-hidden flex flex-col font-display">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {mode === 'camera' ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full bg-[#1a1c19] flex items-center justify-center p-12">
            <div className={`relative size-64 rounded-full flex items-center justify-center transition-all duration-700 ${isRecording ? 'bg-primary/5' : 'bg-white/5'}`}>
              <div className={`absolute inset-0 rounded-full border-2 border-primary/20 ${isRecording ? 'animate-ping' : ''}`} />
              <div className={`absolute -inset-8 rounded-full border-2 border-primary/10 ${isRecording ? 'animate-pulse' : ''}`} />
              <span className={`material-symbols-outlined text-[120px] transition-colors ${isRecording ? 'text-primary' : 'text-white/20'}`}>
                {getSensoryIcon()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Header UI */}
      <header className="absolute top-0 left-0 w-full z-30 pt-12 px-6">
        <div className="flex items-center justify-between gap-4">
          <button onClick={onBack} className="flex items-center justify-center size-12 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 active:scale-90 transition-transform">
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-lg">
            <button
              onClick={() => setMode('camera')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${mode === 'camera' ? 'bg-white text-accent-black' : 'text-white/60'}`}
            >
              <span className="material-symbols-outlined text-lg">photo_camera</span>
              拍照识别
            </button>
            <button
              onClick={() => setMode('voice')}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${mode === 'voice' ? 'bg-white text-accent-black' : 'text-white/60'}`}
            >
              <span className="material-symbols-outlined text-lg">mic</span>
              语音描述
            </button>
          </div>

          <button onClick={() => setShowHelp(true)} className="flex items-center justify-center size-12 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      {/* Center Guidance */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 z-10 pointer-events-none">
        {mode === 'camera' ? (
          <div className="relative w-full aspect-[3/4] max-w-xs">
            <div className="absolute top-0 left-0 size-16 border-t-4 border-l-4 border-white/80 rounded-tl-3xl shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            <div className="absolute top-0 right-0 size-16 border-t-4 border-r-4 border-white/80 rounded-tr-3xl shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            <div className="absolute bottom-0 left-0 size-16 border-b-4 border-l-4 border-white/80 rounded-bl-3xl shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            <div className="absolute bottom-0 right-0 size-16 border-b-4 border-r-4 border-white/80 rounded-br-3xl shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            <div className="absolute -bottom-16 left-0 right-0 text-center">
              <p className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white text-base font-bold border border-white/10 inline-block shadow-lg">
                {hint || (sensoryType === 'Touch' ? '拍摄植物并感受其纹理' : '将植物置于框内')}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-white text-2xl font-bold tracking-tight">
                {isRecording ? "正在倾听..." : pinId ? hint : "捕捉周围的声音或描述"}
              </h2>
              {isRecording && (
                <span className="text-white font-mono text-4xl tracking-widest font-bold bg-white/5 px-6 py-2 rounded-2xl border border-white/5">
                  {formatTime(recordingTime)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="absolute bottom-12 left-0 w-full flex items-center justify-center z-30 px-10">
        <div className="flex items-center gap-10">
          <button className="flex flex-col items-center gap-2 group opacity-40">
            <div className="size-14 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">image</span>
            </div>
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">图鉴</span>
          </button>

          {mode === 'camera' ? (
            <button
              onClick={captureAndIdentify}
              disabled={isProcessing}
              className="relative size-24 rounded-full border-[6px] border-white/20 flex items-center justify-center bg-white/5 active:scale-95 transition-all"
            >
              <div className={`size-[72px] rounded-full bg-primary flex items-center justify-center shadow-floating ${isProcessing ? 'animate-pulse' : ''}`}>
                <div className="size-[60px] rounded-full border-2 border-white/30" />
              </div>
            </button>
          ) : (
            <button
              onClick={() => isRecording ? handleStopRecording() : setIsRecording(true)}
              className={`relative size-24 rounded-full border-[6px] transition-all flex items-center justify-center active:scale-95 group ${isRecording ? 'border-primary/50 bg-primary/20' : 'border-white/20 bg-white/5'
                }`}
            >
              <div className={`size-[72px] rounded-full flex items-center justify-center shadow-floating transition-colors ${isRecording ? 'bg-accent-black' : 'bg-primary'
                }`}>
                <span className={`material-symbols-outlined text-4xl filled transition-colors ${isRecording ? 'text-primary' : 'text-accent-black'}`}>
                  {isRecording ? 'stop' : 'mic'}
                </span>
              </div>
            </button>
          )}

          <button
            onClick={() => onNavigate(Screen.WikiSearch)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="size-14 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/10 flex items-center justify-center group-active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-3xl">auto_stories</span>
            </div>
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">百科</span>
          </button>
        </div>
      </div>

      {/* Identification Result Overlay */}
      {/* Identification Result Overlay - Half Screen Wiki Style */}
      {identification && (
        <div
          className="absolute inset-x-0 bottom-0 z-50 flex flex-col justify-end pointer-events-none"
        >
          <div
            className="w-full bg-background-beige rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] pointer-events-auto h-[55vh] flex flex-col animate-in slide-in-from-bottom duration-500"
          >
            {/* Handle Bar */}
            <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIdentification(null)}>
              <div className="w-12 h-1.5 rounded-full bg-gray-300"></div>
            </div>

            <div className="px-6 pb-2 flex justify-between items-start shrink-0">
              <div>
                <div className="flex items-center gap-1 text-primary-dark mb-1">
                  <span className="material-symbols-outlined filled text-sm">spa</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Wiki Result</span>
                </div>
                <h2 className="text-2xl font-bold text-accent-black">{identification.name}</h2>
                <p className="text-primary-dark/60 italic text-xs font-medium">{identification.scientificName || 'Plantae'}</p>
              </div>
              <button onClick={() => setIdentification(null)} className="size-8 rounded-full bg-white/50 flex items-center justify-center active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-20 space-y-6">

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '光照', val: '半阴', icon: 'light_mode' },
                  { label: '水分', val: '每周', icon: 'water_drop' },
                  { label: '生长', val: '快', icon: 'trending_up' }
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center p-2 rounded-xl bg-white/60 border border-black/5">
                    <span className="material-symbols-outlined text-primary mb-0.5 text-lg">{item.icon}</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">{item.label}</span>
                    <span className="text-[10px] font-bold text-accent-black">{item.val}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-4 border border-black/5">
                <h3 className="text-sm font-bold text-accent-black mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full"></span>
                  植物简介
                </h3>
                <p className="text-gray-600 leading-relaxed text-xs">
                  {identification.description}
                </p>
              </div>

              {/* Care Tips */}
              <div>
                <h3 className="text-sm font-bold text-accent-black mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full"></span>
                  养护小贴士
                </h3>
                <div className="space-y-2">
                  {identification.careTips.slice(0, 2).map((tip, i) => (
                    <div key={i} className="flex gap-3 text-xs text-gray-600 bg-white p-3 rounded-xl border border-black/5">
                      <span className="text-primary font-bold">{i + 1}</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIdentification(null)}
                className="w-full py-3 bg-accent-black text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">center_focus_weak</span>
                继续识别
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Stamp Success Feedback */}
      {showStampAward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-10">
          <div className="bg-white rounded-[3rem] p-8 shadow-floating flex flex-col items-center gap-4 animate-in zoom-in duration-500">
            <div className="relative">
              <div className={`absolute inset-0 animate-ping rounded-full ${getAwardColor().split(' ')[1]}`}></div>
              <span className={`material-symbols-outlined text-[80px] filled relative z-10 ${getAwardColor().split(' ')[0]}`}>stars</span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-accent-black">{sensoryType} 打卡成功!</h3>
              <p className="text-primary font-bold text-lg mt-1">+1 印章</p>
            </div>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-md flex flex-col items-center justify-center gap-6">
          <div className="size-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <p className="text-white font-bold text-lg animate-pulse">正在利用 AI 感知花园...</p>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[70] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-red-500/90 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-md font-bold text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantIDScreen;
