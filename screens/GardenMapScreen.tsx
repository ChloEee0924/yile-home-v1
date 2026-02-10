
import React, { useState, useEffect, useMemo } from 'react';
import { Screen } from '../types';
import { IMAGES, PLANT_DATABASE } from '../constants';
import BottomNav from '../components/BottomNav';

interface GardenMapScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  onBack: () => void;
  params?: any;
  onCompleteDailyMission: () => void;
  onEarnStamps: (amount: number, label: string) => void;
  language: 'zh' | 'en';
}

type SensoryType = 'Vision' | 'Hearing' | 'Smell' | 'Touch' | 'Taste';

import { loadAMap } from '../utils/amapLoader';
import PlantIDScreen from './PlantIDScreen';

// ... imports

interface MapPin {
  id: string;
  name: string;
  type: SensoryType | 'Landmark';
  top?: string; // Kept for compatibility if needed, but we rely on lnglat
  left?: string;
  lnglat: [number, number];
  rotation: string;
  description: string;
  hint?: string;
  icon?: string;
}

// Mock Center: 某公园中心 [116.397428, 39.90923] (Example)
// Distributed pins around it
const LANDMARK_PINS: MapPin[] = [
  { id: 'l1', name: '社区服务中心', type: 'Landmark', lnglat: [116.397428, 39.90923], top: '50%', left: '50%', rotation: '0deg', description: '这里是领取奖励和咨询的地方。', icon: 'home_pin' },
  { id: 'l2', name: '北区入口', type: 'Landmark', lnglat: [116.396500, 39.91000], top: '10%', left: '45%', rotation: '-1deg', description: '通往怡乐家园的主要通道。', icon: 'door_front' },
  { id: 'l3', name: '长寿亭', type: 'Landmark', lnglat: [116.398500, 39.90950], top: '35%', left: '75%', rotation: '2deg', description: '老人们下棋、聊天的避暑好去处。', icon: 'roofing' },
  { id: 'l4', name: '应急求助站', type: 'Landmark', lnglat: [116.396000, 39.90850], top: '80%', left: '25%', rotation: '0deg', description: '配备了紧急医疗箱和一键报警系统。', icon: 'emergency' },
  { id: 'l5', name: '黄房子 (北区)', type: 'Landmark', lnglat: [116.397000, 39.90980], top: '20%', left: '20%', rotation: '4deg', description: '北区集体种植的核心区域。', icon: 'potted_plant' },
];

const TASK_PINS: MapPin[] = [
  { id: 'v1', name: '红玫瑰', type: 'Vision', lnglat: [116.396800, 39.90900], top: '25%', left: '30%', rotation: '-2deg', description: '经典红玫瑰，花瓣质感如天鹅绒般细腻。', hint: '拍下盛开的红玫瑰' },
  { id: 'v2', name: '向日葵', type: 'Vision', lnglat: [116.398000, 39.90880], top: '45%', left: '65%', rotation: '3deg', description: '高大的亮黄色花朵，总是追随着太阳的方向。', hint: '拍下向日葵的笑脸' },
  { id: 'h1', name: '翠竹风铃', type: 'Hearing', lnglat: [116.397500, 39.91020], top: '15%', left: '55%', rotation: '1deg', description: '倾听竹管敲击出的空灵响声。', hint: '录下一段清脆的竹铃声' },
  { id: 'h2', name: '音乐喷泉', type: 'Hearing', lnglat: [116.397200, 39.90820], top: '60%', left: '40%', rotation: '-1deg', description: '连续不断的流水声，让人心旷神怡。', hint: '录下泉水叮咚声' },
  { id: 's1', name: '薰衣草小径', type: 'Smell', lnglat: [116.396200, 39.90950], top: '35%', left: '20%', rotation: '-3deg', description: '沁人心脾的花香，能有效缓解压力。', hint: '描述薰衣草的宁静香气' },
  { id: 't1', name: '多肉景墙', type: 'Touch', lnglat: [116.395800, 39.90880], top: '75%', left: '15%', rotation: '4deg', description: '触摸多肉植物肥厚的叶片。', hint: '拍下多肉并描述其触感' },
  { id: 'ta1', name: '薄荷午茶', type: 'Taste', lnglat: [116.397800, 39.90800], top: '80%', left: '50%', rotation: '0deg', description: '每日定时供应的清凉薄荷茶。', hint: '描述薄荷茶清凉的味道' }
];

const GardenMapScreen: React.FC<GardenMapScreenProps> = ({ onNavigate, onBack, params, onCompleteDailyMission, onEarnStamps, language }) => {
  const [activeSensory, setActiveSensory] = useState<SensoryType | null>(null);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [checkingInPin, setCheckingInPin] = useState<MapPin | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Map Refs
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const markersRef = React.useRef<any[]>([]);
  const walkingRef = React.useRef<any>(null);

  // Guided Route State
  const isGuidedMode = params?.mode === 'guided';
  const targetId = params?.targetId;
  const [visitedWaypointIds, setVisitedWaypointIds] = useState<Set<string>>(new Set());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [navRoute, setNavRoute] = useState<MapPin | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Computed Routes
  const [landmarkPins, setLandmarkPins] = useState<MapPin[]>(LANDMARK_PINS);
  const [taskPins, setTaskPins] = useState<MapPin[]>(TASK_PINS);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Auto-start navigation if targetId is present
  useEffect(() => {
    if (targetId && isGuidedMode) {
      const target = landmarkPins.find(p => p.id === targetId);
      if (target) {
        setNavRoute(target);
      }
    }
  }, [targetId, isGuidedMode, landmarkPins]);

  // Computed Routes - Depend on State now
  const routeWaypoints = useMemo(() => {
    if (!isGuidedMode) return [];
    if (targetId) {
      return [landmarkPins.find(p => p.id === targetId)].filter(Boolean) as MapPin[];
    }
    return [
      taskPins.find(p => p.id === 'v1'),
      taskPins.find(p => p.id === 's1'),
      taskPins.find(p => p.id === 'h2')
    ].filter(Boolean) as MapPin[];
  }, [isGuidedMode, targetId, landmarkPins, taskPins]);

  const filteredPins = activeSensory
    ? taskPins.filter(p => p.type === activeSensory)
    : (isGuidedMode ? routeWaypoints : landmarkPins);

  // Init Map
  useEffect(() => {
    let map: any;

    const initMap = async () => {
      try {
        const AMap = await loadAMap({
          key: '568f3f2272e1f62b8ac09a53e9af1d17', // ⚠️ 请替换为您申请的 Key
          securityJsCode: '4f6dd27bf93b6865ab12f09e2ddf7b16', // ⚠️ 请替换为您申请的安全密钥
          plugins: ['AMap.MoveAnimation', 'AMap.Geolocation', 'AMap.Walking']
        });

        if (!mapContainerRef.current) return;

        map = new AMap.Map(mapContainerRef.current, {
          zoom: 17,
          center: [116.397428, 39.90923], // Mock Center
          viewMode: '3D',
          pitch: 45,
          mapStyle: 'amap://styles/whitesmoke',
        });

        mapInstanceRef.current = map;

        // Add Geolocation
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          position: 'RB',
          offset: [20, 80],
          zoomToAccuracy: true,
        });
        map.addControl(geolocation);

        // Relocate Logic
        geolocation.getCurrentPosition((status: string, result: any) => {
          if (status === 'complete') {
            const userLng = result.position.getLng();
            const userLat = result.position.getLat();
            setUserLocation([userLng, userLat]);

            // Randomize/Clustering Logic: Place pins around the user within ~100-200 meters (~0.001 - 0.002 degrees)
            // We use fixed offsets to keep relative positions somewhat consistent but centered on user

            const generateOffset = (index: number, total: number, radius: number = 0.0015) => {
              const angle = (index / total) * 2 * Math.PI;
              return {
                lng: radius * Math.cos(angle) * 1.5, // slightly wider in longitude
                lat: radius * Math.sin(angle)
              };
            };

            setLandmarkPins(prev => prev.map((p, i) => {
              const offset = generateOffset(i, prev.length, 0.0008 + (Math.random() * 0.0005));
              return {
                ...p,
                lnglat: [userLng + offset.lng, userLat + offset.lat]
              };
            }));

            setTaskPins(prev => prev.map((p, i) => {
              // Interleave task pins
              const offset = generateOffset(i, prev.length, 0.0012 + (Math.random() * 0.0005));
              return {
                ...p,
                lnglat: [userLng + offset.lng, userLat + offset.lat]
              };
            }));

            // Center Map
            map.setCenter([userLng, userLat]);
            console.log('Map relocated to user:', userLng, userLat);
          }
        });

        renderMarkers();
      } catch (e) {
        console.error('Failed to load map', e);
      }
    };

    if (!mapInstanceRef.current) {
      initMap();
    }

    return () => {
      if (map) map.destroy();
    };
  }, []);

  // Auto-enable fullscreen for guided mode
  useEffect(() => {
    if (isGuidedMode) {
      setIsFullScreen(true);
    }
  }, [isGuidedMode]);

  // Update Markers
  useEffect(() => {
    renderMarkers();
  }, [activeSensory, isGuidedMode, filteredPins, visitedWaypointIds]);

  const renderMarkers = () => {
    const map = mapInstanceRef.current;
    if (!map || !window.AMap) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    filteredPins.forEach(pin => {
      const isVisited = visitedWaypointIds.has(pin.id);
      const isTargetInRoute = isGuidedMode && !isVisited && (visitedWaypointIds.size === routeWaypoints.findIndex(w => w.id === pin.id));

      const div = document.createElement('div');
      div.className = `custom-marker-container absolute flex flex-col items-center transition-all duration-500 hover:scale-110 active:scale-90 ${selectedPin?.id === pin.id ? 'z-30' : 'z-20'}`;
      div.innerHTML = `
        <div class="relative cursor-pointer">
          ${isTargetInRoute ? '<span class="absolute inset-0 animate-ping rounded-full bg-primary/40 scale-[2]"></span>' : ''}
          <span class="material-symbols-outlined text-[48px] filled drop-shadow-lg transition-colors ${isVisited ? 'text-gray-400 opacity-60' : selectedPin?.id === pin.id ? 'text-primary' : (pin.type === 'Landmark' ? 'text-accent-black/80' : 'text-primary/60')
        }">
            ${isVisited ? 'check_circle' : (pin.type === 'Landmark' ? (pin.icon || 'location_on') : 'stars')}
          </span>
        </div>
        <span class="font-hand font-bold text-[10px] px-2 py-1 rounded-full shadow-md whitespace-nowrap ${isVisited ? 'bg-gray-100 text-gray-400' : pin.type === 'Landmark' ? 'bg-accent-black text-white' : 'bg-white/90 text-accent-black'}" style="transform: rotate(${pin.rotation})">
          ${pin.name}
        </span>
      `;

      div.onclick = () => handlePinClick(pin);

      const marker = new window.AMap.Marker({
        position: new window.AMap.LngLat(pin.lnglat[0], pin.lnglat[1]),
        content: div,
        offset: new window.AMap.Pixel(-24, -48),
        zIndex: selectedPin?.id === pin.id ? 100 : 10
      });

      marker.setMap(map);
      markersRef.current.push(marker);
    });
  };

  const handlePinClick = (pin: MapPin) => {
    setSelectedPin(pin);
    if (isGuidedMode && routeWaypoints.some(w => w.id === pin.id)) {
      const newVisited = new Set(visitedWaypointIds);
      newVisited.add(pin.id);
      setVisitedWaypointIds(newVisited);
      if (newVisited.size === routeWaypoints.length) {
        setTimeout(() => setShowSuccessModal(true), 1500);
      }
    }
  };

  // Handle Navigation Route Drawing
  useEffect(() => {
    if (!mapInstanceRef.current || !window.AMap) return;

    if (walkingRef.current) {
      walkingRef.current.clear();
    }

    if (navRoute) {
      // Draw route from "My Location" (Mocked as North Entrance) to Destination
      window.AMap.plugin('AMap.Walking', function () {
        const walking = new window.AMap.Walking({
          map: mapInstanceRef.current,
          panel: "panel",
          hideMarkers: false,
          isOutline: true,
          outlineColor: '#ffeeee',
          autoFitView: true
        });

        // Start: Current User Location OR Mock
        const start = userLocation
          ? new window.AMap.LngLat(userLocation[0], userLocation[1])
          : new window.AMap.LngLat(116.396500, 39.91000);
        const end = new window.AMap.LngLat(navRoute.lnglat[0], navRoute.lnglat[1]);

        walking.search(start, end, function (status: any, result: any) {
          if (status === 'complete') {
            console.log('Walking route drawn');
          } else {
            console.error('Walking route failed ' + result);
          }
        });

        walkingRef.current = walking;
      });
    }
  }, [navRoute]);

  const handleNavigateTo = () => {
    if (selectedPin) {
      setNavRoute(selectedPin);
      setSelectedPin(null);
      setIsFullScreen(true); // Auto enter fullscreen for navigation
    }
  };

  const startCheckIn = () => {
    if (!selectedPin || selectedPin.type === 'Landmark') return;
    setCheckingInPin(selectedPin);
  };

  const handleReset = () => {
    setActiveSensory(null);
    setSelectedPin(null);
    setVisitedWaypointIds(new Set());
    setNavRoute(null);
  };

  const categories = [
    { id: 'Vision' as SensoryType, label: '视觉', sub: 'Look', icon: 'visibility' },
    { id: 'Hearing' as SensoryType, label: '听觉', sub: 'Listen', icon: 'hearing' },
    { id: 'Smell' as SensoryType, label: '嗅觉', sub: 'Scent', icon: 'air' },
    { id: 'Touch' as SensoryType, label: '触觉', sub: 'Feel', icon: 'back_hand' },
    { id: 'Taste' as SensoryType, label: '味觉', sub: 'Flavor', icon: 'restaurant' }
  ];

  return (
    <div className={`flex flex-col min-h-screen bg-background-beige ${isFullScreen ? 'overflow-hidden' : ''}`}>
      {/* Header */}
      {!isFullScreen && (
        <header className="flex items-center p-6 justify-between bg-background-beige sticky top-0 z-20">
          <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full bg-white shadow-soft">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-text-main text-xl font-bold flex-1 text-center">探索花园</h2>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate(Screen.WikiSearch)}
              className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[24px]">menu_book</span>
            </button>
            <button onClick={() => setShowHelpModal(true)} className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
              <span className="material-symbols-outlined text-[24px]">help</span>
            </button>
          </div>
        </header>
      )}

      {/* Guided Mode Progress Header */}
      {(isGuidedMode || navRoute) && isFullScreen && (
        <div className="fixed top-12 left-0 right-0 z-[110] px-6">
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-xl flex items-center justify-between border border-white/50">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark">
                <span className="material-symbols-outlined filled">navigation</span>
              </div>
              <div>
                <p className="text-xs font-bold text-primary-dark uppercase tracking-widest">{navRoute ? '目的地导航' : '今日漫步路线'}</p>
                <p className="text-sm font-bold text-accent-black">
                  {navRoute ? `前往: ${navRoute.name}` : `已到达 ${visitedWaypointIds.size}/${routeWaypoints.length} 个目标`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!navRoute && (
                <button
                  onClick={() => setShowSuccessModal(true)}
                  className="px-3 py-2 bg-primary text-accent-black text-xs font-bold rounded-full shadow-sm active:scale-95 transition-all"
                >
                  直接打卡
                </button>
              )}
              <button onClick={() => {
                setNavRoute(null);
                if (isGuidedMode) {
                  onBack(); // Exit guided mode completely
                } else {
                  setIsFullScreen(false);
                }
              }} className="size-10 rounded-full bg-accent-black/5 flex items-center justify-center text-accent-black">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={`flex-1 px-6 space-y-8 ${isFullScreen ? 'p-0 h-screen fixed inset-0 z-[100] bg-white' : 'pb-32'}`}>
        {/* 地图区域 */}
        <section className={`relative transition-all duration-500 ease-in-out ${isFullScreen ? 'w-screen h-screen rounded-0' : 'w-full rounded-[2.5rem] p-2 bg-white shadow-soft'}`}>
          <div className={`relative w-full h-full rounded-[2rem] overflow-hidden bg-[#e6e2d6] ${isFullScreen ? 'rounded-none h-full' : 'aspect-[4/3]'}`}>
            {/* AMAP CONTAINER */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {!isFullScreen && !isGuidedMode && !navRoute && (
              <button onClick={() => setIsFullScreen(true)} className="absolute bottom-4 right-4 z-50 size-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center text-accent-black">
                <span className="material-symbols-outlined">fullscreen</span>
              </button>
            )}

            {isFullScreen && !isGuidedMode && !navRoute && (
              <button onClick={() => setIsFullScreen(false)} className="absolute top-12 left-6 z-50 size-12 bg-white/80 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-accent-black">
                <span className="material-symbols-outlined">fullscreen_exit</span>
              </button>
            )}

            {/* 快捷 AI 识别入口 - Always visible */}
            <div className={`absolute bottom-4 right-4 z-20 flex flex-col gap-2 ${isFullScreen ? 'bottom-24' : ''}`}>
              <button
                onClick={() => onNavigate(Screen.PlantID, { mode: 'camera' })}
                className="size-12 bg-primary text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-primary-dark transition-all scale-100 active:scale-95"
              >
                <span className="material-symbols-outlined filled">photo_camera</span>
              </button>
            </div>
          </div>

          {selectedPin && (
            <div className={`absolute inset-x-4 z-[120] animate-in slide-in-from-bottom duration-300 ${isFullScreen ? 'bottom-10' : 'bottom-4'}`}>
              <div className="bg-accent-black text-white p-5 rounded-3xl shadow-2xl border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      {selectedPin.type === 'Landmark' ? (selectedPin.icon || 'location_on') : (categories.find(c => c.id === selectedPin.type)?.icon)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {selectedPin.type === 'Landmark' ? '重要地点' : `${selectedPin.type} 探索`}
                    </span>
                  </div>
                  <button onClick={() => setSelectedPin(null)} className="size-8 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                <h3 className="text-xl font-bold mb-1">{selectedPin.name}</h3>
                <p className="text-xs text-white/60 mb-5 leading-relaxed">{selectedPin.description}</p>

                {selectedPin.type !== 'Landmark' || (isGuidedMode && selectedPin.id === params?.targetId) ? (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={startCheckIn}
                      className="w-full py-3 bg-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all border border-white/20"
                    >
                      <span className="material-symbols-outlined">qr_code_scanner</span>
                      拍照/扫码打卡
                    </button>

                    <button
                      onClick={() => {
                        // Direct Check-in Logic
                        onEarnStamps(1, `${selectedPin.name} 打卡`);

                        if (isGuidedMode && routeWaypoints.some(w => w.id === selectedPin.id)) {
                          const newVisited = new Set(visitedWaypointIds);
                          newVisited.add(selectedPin.id);
                          setVisitedWaypointIds(newVisited);

                          // Visual feedback for individual check-in
                          setToastMessage(`打卡成功：${selectedPin.name}`);
                          setTimeout(() => setToastMessage(null), 2000);

                          if (newVisited.size === routeWaypoints.length) {
                            setTimeout(() => setShowSuccessModal(true), 1500);
                          }
                        }
                        setSelectedPin(null); // Close modal
                      }}
                      className="w-full py-3 bg-primary text-accent-black font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
                    >
                      <span className="material-symbols-outlined">check_circle</span>
                      直接打卡 (获得 1 枚印章)
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleNavigateTo}
                    className="w-full py-4 bg-primary/10 text-primary font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined">near_me</span>
                    导航前往
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 感官任务分类 */}
        {!isFullScreen && (
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">task_alt</span>
                <h3 className="text-xl font-bold text-text-main">五感探索任务</h3>
              </div>
              {activeSensory && (
                <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-black/5 rounded-full text-xs font-bold text-text-main/60">
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  回到地图
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((item) => {
                const isActive = activeSensory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSensory(isActive ? null : item.id); setSelectedPin(null); }}
                    className={`flex flex-col items-center justify-center p-5 rounded-[2rem] shadow-soft transition-all duration-300 group ${isActive ? 'bg-primary border-4 border-primary-light' : 'bg-white'}`}
                  >
                    <div className={`size-12 rounded-full flex items-center justify-center mb-2 transition-colors ${isActive ? 'bg-white text-primary' : 'bg-primary/10 text-primary'}`}>
                      <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    </div>
                    <span className={`font-bold text-base ${isActive ? 'text-white' : 'text-text-main'}`}>{item.label}</span>
                    <span className={`text-[10px] font-medium tracking-wider uppercase mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                      {item.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* 植物百科快捷入口 - 找回百科推荐功能 */}
        {!isFullScreen && (
          <section className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_stories</span>
                <h3 className="text-xl font-bold text-text-main">园艺知识百科</h3>
              </div>
              <button
                onClick={() => onNavigate(Screen.WikiSearch)}
                className="text-sm font-bold text-primary-dark"
              >
                探索更多
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
              {PLANT_DATABASE.map((plant) => (
                <div
                  key={plant.id}
                  onClick={() => onNavigate(Screen.WikiDetail, { plantId: plant.id })}
                  className="shrink-0 w-44 bg-white rounded-3xl shadow-soft p-3 border border-black/5 active:scale-95 transition-transform"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-3">
                    <img src={plant.imageUrl} className="w-full h-full object-cover" alt={plant.name} />
                  </div>
                  <h4 className="font-bold text-accent-black mb-1">{plant.name}</h4>
                  <div className="flex items-center gap-1">
                    {plant.tags.slice(0, 1).map(tag => (
                      <span key={tag} className="text-[9px] font-bold bg-primary-light/40 text-primary-dark px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-accent-black/80 backdrop-blur-md" onClick={() => setShowHelpModal(false)} />
          <div className="relative w-full bg-white rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-500 max-w-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-accent-black">探索指南</h3>
              <button onClick={() => setShowHelpModal(false)} className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">near_me</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  点击地图上的<span className="font-bold text-primary">打卡点</span>图标，查看该植物或景点的详细信息。
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">qr_code_scanner</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  根据提示，使用<span className="font-bold text-accent-black">相机拍照</span>或<span className="font-bold text-accent-black">语音描述</span>进行 AI 识别打卡。
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">stars</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  每完成一次五感探索，即可获得 <span className="font-bold text-primary">1 枚印章</span> 奖励。
                </p>
              </div>
            </div>
            <button onClick={() => setShowHelpModal(false)} className="w-full mt-8 py-4 bg-accent-black text-white font-bold rounded-2xl shadow-lg">
              我知道了
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-accent-black/80 backdrop-blur-md" />
          <div className="relative w-full bg-white rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-500 flex flex-col items-center text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 scale-[2]"></div>
              <div className="size-24 rounded-full bg-primary flex items-center justify-center text-white shadow-floating relative z-10">
                <span className="material-symbols-outlined text-5xl filled">emoji_events</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-accent-black mb-2">{params?.missionLabel || '任务'}完成!</h2>
            <p className="text-gray-500 font-medium mb-8">
              {params?.missionId === 'fixed-planting'
                ? '您已到达黄房子并参与了今日种植课。'
                : '您已经完成了今日感官漫步，身心都得到了大自然的滋养。'}
            </p>
            <div className="w-full p-6 bg-background-beige rounded-3xl flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-500 filled text-3xl">stars</span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">今日奖励</p>
                  <p className="text-xl font-bold text-accent-black">+{params?.reward || 5} 枚印章</p>
                </div>
              </div>
              <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined">verified</span>
              </div>
            </div>
            <button onClick={onCompleteDailyMission} className="w-full py-5 bg-accent-black text-white font-bold rounded-[2rem] text-lg shadow-xl active:scale-95 transition-all">
              领取并返回
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes dash { to { stroke-dashoffset: -28; } }
      `}} />
      {!isFullScreen && <BottomNav currentScreen={Screen.GardenMap} onNavigate={onNavigate} />}

      {/* Embed PlantID Screen for Check-in */}
      {checkingInPin && (
        <div className="fixed inset-0 z-[150] bg-black">
          <PlantIDScreen
            onBack={() => setCheckingInPin(null)}
            onNavigate={onNavigate}
            onEarnStamps={(amount, label) => {
              onEarnStamps(amount, label);
              // Mark as visited when earning stamp
              if (isGuidedMode && routeWaypoints.some(w => w.id === checkingInPin.id)) {
                const newVisited = new Set(visitedWaypointIds);
                newVisited.add(checkingInPin.id);
                setVisitedWaypointIds(newVisited);

                setToastMessage(`打卡成功：${checkingInPin.name}`);
                setTimeout(() => setToastMessage(null), 2000);

                if (newVisited.size === routeWaypoints.length) {
                  setTimeout(() => setShowSuccessModal(true), 1500);
                }
              }
              setCheckingInPin(null);
            }}
            mode={(checkingInPin.type === 'Hearing' || checkingInPin.type === 'Smell' || checkingInPin.type === 'Taste') ? 'voice' : 'camera'}
            pinId={checkingInPin.id}
            sensoryType={checkingInPin.type}
            hint={checkingInPin.hint}
          />
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-accent-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">check_circle</span>
            <span className="font-bold text-sm">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenMapScreen;
