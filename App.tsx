
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Screen, UserRole, Transaction, Activity } from './types';
import { MOCK_ACTIVITIES, IMAGES } from './constants';
import HomeScreen from './screens/HomeScreen';
import GardenMapScreen from './screens/GardenMapScreen';
import MutualAidScreen from './screens/MutualAidScreen';
import ProfileScreen from './screens/ProfileScreen';
import ActivityDetailsScreen from './screens/ActivityDetailsScreen';
import PlantIDScreen from './screens/PlantIDScreen';
import ConfirmActivityScreen from './screens/ConfirmActivityScreen';
import VolunteerToolsModal from './components/VolunteerToolsModal';
import WikiDetailScreen from './screens/WikiDetailScreen';
import NotificationScreen from './screens/NotificationScreen';
import HistoryScreen from './screens/HistoryScreen';
import RedeemSuccessScreen from './screens/RedeemSuccessScreen';
import ActivityListScreen from './screens/ActivityListScreen';
import WikiSearchScreen from './screens/WikiSearchScreen';
import PostRequestScreen from './screens/PostRequestScreen';
import HonorWallScreen from './screens/HonorWallScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import SkillReportScreen from './screens/SkillReportScreen';
import AddressSettingsScreen from './screens/AddressSettingsScreen';
import VolunteerPortalScreen from './screens/VolunteerPortalScreen';
import VolunteerSuccessScreen from './screens/VolunteerSuccessScreen';
import VolunteerApplicationsScreen from './screens/VolunteerApplicationsScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import ScanScreen from './screens/ScanScreen';
import ManualStampEntryScreen from './screens/ManualStampEntryScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import PrivacyScreen from './screens/PrivacyScreen';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Initialize screen based on persistent login state
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const savedLoginState = localStorage.getItem('is_logged_in');
    return savedLoginState === 'true' ? Screen.Home : Screen.Login;
  });
  const [prevScreen, setPrevScreen] = useState<Screen | null>(null);
  const [showVolunteerTools, setShowVolunteerTools] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [navigationParams, setNavigationParams] = useState<any>(null);

  // Settings State
  const [language, setLanguage] = useState<'zh' | 'en'>(() => {
    return (localStorage.getItem('app_language') as 'zh' | 'en') || 'zh';
  });
  const [textSize, setTextSize] = useState<'standard' | 'medium' | 'large'>('standard');

  // Persist language change
  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  // Sync isLoggedIn state with storage on mount
  useEffect(() => {
    const savedLoginState = localStorage.getItem('is_logged_in');
    if (savedLoginState === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Core Assets
  const [stamps, setStamps] = useState(12);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', label: '初始余额', type: 'earn', date: 'Apr 20', val: '+12' }
  ]);

  // Community Content
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);

  // User Profile
  const [userProfile, setUserProfile] = useState({
    nickname: '李奶奶',
    avatar: IMAGES.AVATAR,
    phone: localStorage.getItem('user_phone') || '138****8821', // Load from storage
    isVerified: true
  });

  // Role Management
  const [userRole, setUserRole] = useState<UserRole>(UserRole.Resident);

  // Global Text Size Styles
  useEffect(() => {
    const scale = textSize === 'standard' ? '1rem' : textSize === 'medium' ? '1.15rem' : '1.3rem';
    document.documentElement.style.fontSize = scale;
  }, [textSize]);

  const navigateTo = (screen: Screen, params?: any) => {
    setPrevScreen(currentScreen);
    setCurrentScreen(screen);
    setNavigationParams(params);
    if (params?.activityId) setSelectedActivityId(params.activityId);
    if (params?.plantId) setSelectedPlantId(params.plantId);
  };

  const addTransaction = useCallback((label: string, amount: number) => {
    const isEarn = amount > 0;
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      label,
      type: isEarn ? 'earn' : 'spend',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      val: (isEarn ? '+' : '') + amount
    };
    setStamps(prev => prev + amount);
    setTransactions(prev => [newTx, ...prev]);
  }, []);

  const handlePublishEvent = (newActivity: Activity) => {
    setActivities(prev => [newActivity, ...prev]);
    navigateTo(Screen.Home);
  };

  const handleMissionComplete = (missionId: string, label: string, reward: number) => {
    if (completedMissionIds.includes(missionId)) return;
    setCompletedMissionIds(prev => [...prev, missionId]);
    addTransaction(label, reward);
  };

  const handleCertifyStaff = (role: UserRole) => {
    setUserRole(role);
    setUserProfile(prev => ({ ...prev, isVerified: true }));
  };

  const handleLogin = (phone: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('is_logged_in', 'true');
    localStorage.setItem('user_phone', phone); // Save phone
    setUserProfile(prev => ({ ...prev, phone }));
    setCurrentScreen(Screen.Home);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('is_logged_in');
    setCurrentScreen(Screen.Login);
    setUserRole(UserRole.Resident);
    setStamps(12);
    setCompletedMissionIds([]);
  };

  const goBack = () => {
    if (prevScreen) {
      setCurrentScreen(prevScreen);
      setPrevScreen(null);
    } else {
      setCurrentScreen(Screen.Home);
    }
  };

  useEffect(() => {
    if (showVolunteerTools) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showVolunteerTools]);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Login:
        return <LoginScreen onLogin={handleLogin} language={language} />;
      case Screen.Home:
        return <HomeScreen
          userRole={userRole}
          onNavigate={navigateTo}
          onOpenVolunteerTools={() => setShowVolunteerTools(true)}
          activities={activities}
          nickname={userProfile.nickname}
          avatar={userProfile.avatar}
          completedMissionIds={completedMissionIds}
          onMissionComplete={handleMissionComplete}
          language={language}
        />;
      case Screen.GardenMap:
        return <GardenMapScreen
          onNavigate={navigateTo}
          onBack={goBack}
          params={navigationParams}
          language={language}
          onEarnStamps={addTransaction}
          onCompleteDailyMission={() => {
            const missionId = navigationParams?.missionId || 'm24-1';
            const reward = navigationParams?.reward || 5;
            handleMissionComplete(missionId, '日常任务：五感漫步', reward);
            goBack();
          }}
        />;
      case Screen.MutualAid:
        return <MutualAidScreen
          onNavigate={navigateTo}
          onBack={goBack}
          params={navigationParams}
          stamps={stamps}
          setStamps={setStamps}
          onEarnStamps={addTransaction}
          language={language}
        />;
      case Screen.Profile:
        return <ProfileScreen
          userRole={userRole}
          onCertifyStaff={(role) => setUserRole(role)}
          onNavigate={navigateTo}
          onBack={goBack}
          profile={userProfile}
          onUpdateProfile={(update) => setUserProfile(prev => ({ ...prev, ...update }))}
          language={language}
        />;
      case Screen.Settings:
        return <SettingsScreen
          onBack={goBack}
          onLogout={handleLogout}
          onNavigate={navigateTo}
          language={language}
          setLanguage={setLanguage}
          textSize={textSize}
          setTextSize={setTextSize}
          phone={userProfile.phone}
        />;
      case Screen.Privacy:
        return <PrivacyScreen
          onBack={goBack}
          profile={userProfile}
          onUpdateProfile={(update) => setUserProfile(prev => ({ ...prev, ...update }))}
        />;
      case Screen.ActivityDetails:
        const currentActivity = activities.find(a => a.id === selectedActivityId) || activities[0];
        return <ActivityDetailsScreen id={currentActivity.id} activityData={currentActivity} onBack={goBack} onRegister={() => navigateTo(Screen.ConfirmActivity)} />;
      case Screen.PlantID:
        return <PlantIDScreen
          onBack={goBack}
          onNavigate={navigateTo}
          onEarnStamps={(amount, label) => addTransaction(label || '植物识别', amount)}
          mode={navigationParams?.mode}
          pinId={navigationParams?.pinId}
          sensoryType={navigationParams?.sensoryType}
          hint={navigationParams?.hint}
        />;
      case Screen.ConfirmActivity:
        return <ConfirmActivityScreen onBack={goBack} onConfirm={(earned) => {
          addTransaction('挑战任务奖励', earned);
          navigateTo(Screen.MutualAid);
        }} />;
      case Screen.WikiDetail:
        return <WikiDetailScreen id={selectedPlantId || 'p1'} onBack={goBack} />;
      case Screen.Notifications:
        return <NotificationScreen onBack={goBack} />;
      case Screen.History:
        return <HistoryScreen onBack={goBack} stamps={stamps} transactions={transactions} />;
      case Screen.RedeemSuccess:
        return <RedeemSuccessScreen params={navigationParams} onBack={() => navigateTo(Screen.MutualAid)} onConfirmRedeem={(cost, label) => addTransaction(label, -cost)} />;
      case Screen.ActivityList:
        return <ActivityListScreen onNavigate={navigateTo} onBack={goBack} activities={activities} />;
      case Screen.WikiSearch:
        return <WikiSearchScreen onNavigate={navigateTo} onBack={goBack} />;
      case Screen.PostRequest:
        return <PostRequestScreen onBack={goBack} onConfirm={(cost) => {
          addTransaction('发布互助需求', -cost);
          navigateTo(Screen.MutualAid);
        }} />;
      case Screen.HonorWall:
        return <HonorWallScreen onBack={goBack} />;
      case Screen.MyOrders:
        return <MyOrdersScreen onBack={goBack} />;
      case Screen.SkillReport:
        return <SkillReportScreen onBack={goBack} />;
      case Screen.AddressSettings:
        return <AddressSettingsScreen onBack={goBack} />;
      case Screen.VolunteerPortal:
        return <VolunteerPortalScreen onBack={goBack} onConfirm={() => navigateTo(Screen.VolunteerSuccess)} language={language} />;
      case Screen.VolunteerSuccess:
        return <VolunteerSuccessScreen onComplete={() => setUserRole(UserRole.Volunteer)} onBack={() => navigateTo(Screen.Profile)} language={language} />;
      case Screen.VolunteerApplications:
        return <VolunteerApplicationsScreen onBack={goBack} language={language} />;
      case Screen.CreateEvent:
        return <CreateEventScreen onBack={goBack} onPublish={handlePublishEvent} />;
      case Screen.Scan:
        return <ScanScreen
          onBack={goBack}
          onNavigate={navigateTo}
          onConfirm={(reward, label) => {
            addTransaction(label || '服务核销', reward);
            navigateTo(Screen.Home, { rewardSuccess: true });
          }}
          params={navigationParams}
        />;
      case Screen.ManualStampEntry:
        return <ManualStampEntryScreen
          onBack={goBack}
          onConfirm={(reward, label) => {
            addTransaction(label || '手动发放', reward);
            navigateTo(Screen.Home);
          }}
          params={navigationParams}
        />;
      default:
        return <HomeScreen
          userRole={userRole}
          onNavigate={navigateTo}
          onOpenVolunteerTools={() => setShowVolunteerTools(true)}
          activities={activities}
          nickname={userProfile.nickname}
          avatar={userProfile.avatar}
          completedMissionIds={completedMissionIds}
          onMissionComplete={handleMissionComplete}
          language={language}
        />;
    }
  };

  return (
    <div className={`relative min-h-screen max-w-md mx-auto bg-background-beige shadow-2xl overflow-x-hidden lang-${language}`}>
      {renderScreen()}

      {showVolunteerTools && (
        <VolunteerToolsModal
          onClose={() => setShowVolunteerTools(false)}
          onAction={(action) => {
            setShowVolunteerTools(false);
            if (action === 'scan_deduct') navigateTo(Screen.Scan, { scanMode: 'deduct' });
            if (action === 'scan_add') navigateTo(Screen.Scan, { scanMode: 'add' });
            if (action === 'new') navigateTo(Screen.CreateEvent);
            if (action === 'applications') navigateTo(Screen.VolunteerApplications);
            if (action === 'audit') navigateTo(Screen.SkillReport);
          }}
        />
      )}
    </div>
  );
};

export default App;
