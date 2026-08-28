import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { offlineSyncManager } from '../services/offlineSync';

interface AppContextType {
  currentView: 'landing' | Role;
  setCurrentView: (view: 'landing' | Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS['en'];
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isAiCompanionOpen: boolean;
  setIsAiCompanionOpen: (open: boolean) => void;
  companionInitialQuery: string;
  setCompanionInitialQuery: (q: string) => void;
  openAiCompanionWithQuery: (query: string) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  pendingSyncCount: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-001',
  name: 'Sunita Ravindra Shinde',
  nameMr: 'सुनिता रवींद्र शिंदे',
  nameHi: 'सुनीता रवीन्द्र शिंदे',
  role: 'patient',
  mobile: '+91 98230 44512',
  district: 'Pune',
  taluka: 'Junnar',
  village: 'Khamgaon',
  isVerified: true
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'landing' | Role>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [isOnline, setIsOnlineState] = useState<boolean>(true);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isAiCompanionOpen, setIsAiCompanionOpen] = useState<boolean>(false);
  const [companionInitialQuery, setCompanionInitialQuery] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const unsub = offlineSyncManager.subscribe((queue) => {
      setPendingSyncCount(queue.filter(m => m.status === 'QUEUED' || m.status === 'SYNCING').length);
    });
    return () => unsub();
  }, []);

  const setIsOnline = (online: boolean) => {
    setIsOnlineState(online);
    offlineSyncManager.setSimulatedOnline(online);
    if (online) {
      showToast(language === 'mr' ? 'नेटवर्क परत आले - डेटा सिंक झाला' : language === 'hi' ? 'नेटवर्क सक्रिय - डेटा सिंक हो गया' : 'Online connection restored — Sync completed');
    } else {
      showToast(language === 'mr' ? 'ऑफलाइन मोड सक्रिय - बदल सुरक्षित ठेवले जात आहेत' : language === 'hi' ? 'ऑफलाइन मोड सक्रिय - डेटा सुरक्षित है' : 'Offline mode active — mutations queued locally');
    }
  };

  const openAiCompanionWithQuery = (query: string) => {
    setCompanionInitialQuery(query);
    setIsAiCompanionOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        language,
        setLanguage,
        t,
        isOnline,
        setIsOnline,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isAiCompanionOpen,
        setIsAiCompanionOpen,
        companionInitialQuery,
        setCompanionInitialQuery,
        openAiCompanionWithQuery,
        currentUser,
        setCurrentUser,
        pendingSyncCount,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
