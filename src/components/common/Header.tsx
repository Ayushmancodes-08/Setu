import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { 
  PhoneCall, 
  Wifi, 
  WifiOff, 
  Languages, 
  UserCheck, 
  ChevronDown, 
  ShieldAlert, 
  Activity, 
  HeartHandshake,
  Stethoscope,
  Building2,
  Layers,
  Sparkles,
  Home
} from 'lucide-react';

const ROLES: { id: Role; labelEn: string; labelMr: string; labelHi: string; icon: any; color: string }[] = [
  { id: 'patient', labelEn: 'Patient / Citizen', labelMr: 'रुग्ण / नागरिक', labelHi: 'मरीज / नागरिक', icon: Activity, color: 'text-teal-600' },
  { id: 'asha', labelEn: 'ASHA Frontline Worker', labelMr: 'आशा सेविका', labelHi: 'आशा कार्यकर्ता', icon: HeartHandshake, color: 'text-pink-600' },
  { id: 'cho', labelEn: 'CHO / Medical Officer', labelMr: 'समुदाय आरोग्य अधिकारी (CHO)', labelHi: 'सीएचओ / चिकित्सा अधिकारी', icon: Stethoscope, color: 'text-emerald-600' },
  { id: 'doctor', labelEn: 'Doctor / Specialist', labelMr: 'तज्ज्ञ वैद्यकीय अधिकारी', labelHi: 'विशेषज्ञ डॉक्टर', icon: Stethoscope, color: 'text-blue-600' },
  { id: 'pharmacist', labelEn: 'Pharmacist / Chemist', labelMr: 'औषध निर्माण अधिकारी', labelHi: 'फार्मासिस्ट', icon: Layers, color: 'text-amber-600' },
  { id: 'lab', labelEn: 'Lab Technician', labelMr: 'प्रयोगशाळा तंत्रज्ञ', labelHi: 'लैब तकनीशियन', icon: Activity, color: 'text-purple-600' },
  { id: 'facility', labelEn: 'Facility Operations', labelMr: 'रुग्णालय समन्वयक', labelHi: 'अस्पताल समन्वयक', icon: Building2, color: 'text-indigo-600' },
  { id: 'dho', labelEn: 'District Health Officer (DHO)', labelMr: 'जिल्हा आरोग्य अधिकारी', labelHi: 'जिला स्वास्थ्य अधिकारी', icon: ShieldAlert, color: 'text-rose-600' }
];

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    language, 
    setLanguage, 
    t, 
    isOnline, 
    setIsOnline, 
    setIsEmergencyModalOpen,
    setIsAiCompanionOpen,
    pendingSyncCount
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const getRoleTitle = (r: Role) => {
    const item = ROLES.find(x => x.id === r);
    if (!item) return r;
    return language === 'mr' ? item.labelMr : language === 'hi' ? item.labelHi : item.labelEn;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Government of Maharashtra Top Bar */}
      <div className="bg-[#002117] text-slate-200 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{t.govHeader}</span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-emerald-300 font-semibold">PS:6133 Rural HealthTech Innovation</span>
        </div>

        <div className="flex items-center gap-4 text-xs ml-auto">
          {/* Offline / Online Toggle Simulator */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
              isOnline 
                ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-800' 
                : 'bg-amber-900/80 text-amber-300 border border-amber-500/40 hover:bg-amber-800 animate-pulse'
            }`}
            title="Click to toggle offline mode simulation for ASHA & Field testing"
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isOnline ? 'Online Sync Active' : `Offline (${pendingSyncCount} queued)`}</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 hover:text-white transition-colors bg-white/10 px-2 py-0.5 rounded"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-200 py-1 text-slate-800 z-50">
                <button
                  onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 font-medium ${language === 'en' ? 'text-emerald-700 bg-emerald-50/60 font-bold' : ''}`}
                >
                  English
                </button>
                <button
                  onClick={() => { setLanguage('mr'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 font-medium ${language === 'mr' ? 'text-emerald-700 bg-emerald-50/60 font-bold' : ''}`}
                >
                  मराठी (Marathi)
                </button>
                <button
                  onClick={() => { setLanguage('hi'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 font-medium ${language === 'hi' ? 'text-emerald-700 bg-emerald-50/60 font-bold' : ''}`}
                >
                  हिंदी (Hindi)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003527] to-[#10b981] flex items-center justify-center text-white font-bold text-xl shadow-md ring-2 ring-emerald-500/20">
            से
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-[#003527] tracking-tight">{t.brandName}</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                MahaHealth
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block leading-tight">
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* Center Nav Links (when on Landing) */}
        {currentView === 'landing' ? (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a href="#find-care" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
              {t.navFindCare}
            </a>
            <a href="#schemes" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
              {t.navSchemes}
            </a>
            <a href="#ecosystem" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
              {t.navEcosystem}
            </a>
            <button
              onClick={() => setIsAiCompanionOpen(true)}
              className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 transition-all hover:bg-emerald-100"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>ArogyaSakhi AI</span>
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Landing Page</span>
            </button>
            <div className="h-4 w-px bg-slate-300 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-400">Current Workspace:</span>
              <span className="text-xs font-bold text-[#003527] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {getRoleTitle(currentView)}
              </span>
            </div>
          </div>
        )}

        {/* Right Actions: Role Selector & SOS Button */}
        <div className="flex items-center gap-3">
          {/* Role Portal Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 transition-all shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">
                {currentView === 'landing' ? t.switchRole : getRoleTitle(currentView)}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 text-slate-800 z-50 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Healthcare Workspace
                </div>
                <div className="py-1 max-h-96 overflow-y-auto">
                  <button
                    onClick={() => { setCurrentView('landing'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-emerald-50 flex items-center gap-3 transition-colors ${currentView === 'landing' ? 'bg-emerald-50/80 font-bold text-emerald-800' : ''}`}
                  >
                    <Home className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold">Public Health Portal & ArogyaSakhi</div>
                      <div className="text-[10px] text-slate-500">Citizen landing page & scheme finder</div>
                    </div>
                  </button>
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const isSelected = currentView === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => { setCurrentView(r.id); setRoleDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs hover:bg-emerald-50 flex items-center gap-3 transition-colors ${isSelected ? 'bg-emerald-50/80 font-bold text-emerald-800' : ''}`}
                      >
                        <div className={`p-1.5 rounded-lg bg-slate-100 ${r.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {language === 'mr' ? r.labelMr : language === 'hi' ? r.labelHi : r.labelEn}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {r.id === 'patient' && 'Teleconsult, ABHA records, Token queue'}
                            {r.id === 'asha' && 'Offline visit queue, High-risk ANC/NCD'}
                            {r.id === 'cho' && 'Sub-Centre triage, e-Sanjeevani, referrals'}
                            {r.id === 'doctor' && 'Specialist consult workbench & e-Rx'}
                            {r.id === 'pharmacist' && 'Live drug inventory & stock-out radar'}
                            {r.id === 'lab' && 'Diagnostic sample queue & panic alerts'}
                            {r.id === 'facility' && 'Bed capacity, staff shifts, transfers'}
                            {r.id === 'dho' && 'District governance, referral funnel, map'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 108 Emergency SOS Button */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-red-500/20 hover:shadow-red-500/40 transition-all active:scale-95 animate-pulse"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t.emergencyBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
