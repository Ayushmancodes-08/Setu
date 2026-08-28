import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { offlineSyncManager } from '../services/offlineSync';
import { bhashiniAI } from '../services/bhashiniService';

interface AppContextType {
  currentView: 'landing' | Role;
  setCurrentView: (view: 'landing' | Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS['en'];
  tr: (text: string) => string;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isAiCompanionOpen: boolean;
  setIsAiCompanionOpen: (open: boolean) => void;
  isAiSettingsModalOpen: boolean;
  setIsAiSettingsModalOpen: (open: boolean) => void;
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
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('setu_language');
    if (saved && ['en', 'mr', 'hi', 'or', 'bn', 'ur'].includes(saved)) {
      return saved as Language;
    }
    return 'en';
  });
  const [isOnline, setIsOnlineState] = useState<boolean>(true);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isAiCompanionOpen, setIsAiCompanionOpen] = useState<boolean>(false);
  const [isAiSettingsModalOpen, setIsAiSettingsModalOpen] = useState<boolean>(false);
  const [companionInitialQuery, setCompanionInitialQuery] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('setu_language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  // Automated translation function leveraging Bhashini
  const tr = (text: string): string => {
    return bhashiniAI.tr(text, language);
  };

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
      showToast(t.onlineSyncedMsg);
    } else {
      showToast(t.offlineQueuedMsg);
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
        tr,
        isOnline,
        setIsOnline,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isAiCompanionOpen,
        setIsAiCompanionOpen,
        isAiSettingsModalOpen,
        setIsAiSettingsModalOpen,
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
