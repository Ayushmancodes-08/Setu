import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { Role } from '../../types';
import { 
  PhoneCall, 
  Wifi, 
  WifiOff, 
  Languages, 
  ChevronDown, 
  ShieldAlert, 
  Activity, 
  HeartHandshake, 
  Stethoscope, 
  Building2, 
  Layers, 
  Search, 
  CheckCircle2, 
  X, 
  LogOut, 
  Lock, 
  UserCheck, 
  RefreshCw,
  Home
} from 'lucide-react';

const ROLES: { id: Role; labelEn: string; labelMr: string; labelHi: string; icon: any; color: string; desc: string }[] = [
  { id: 'patient', labelEn: 'Patient Portal', labelMr: 'रुग्ण पोर्टल', labelHi: 'मरीज पोर्टल', icon: Activity, color: 'text-teal-600', desc: 'ABHA Health Locker, Prescriptions & Teleconsult' },
  { id: 'asha', labelEn: 'ASHA Worker', labelMr: 'आशा सेविका', labelHi: 'आशा कार्यकर्ता', icon: HeartHandshake, color: 'text-rose-600', desc: 'Field Home Visits, High-Risk ANC & NCD Registry' },
  { id: 'cho', labelEn: 'CHO / Health Officer', labelMr: 'समुदाय आरोग्य अधिकारी (CHO)', labelHi: 'सीएचओ अधिकारी', icon: Stethoscope, color: 'text-emerald-600', desc: 'Sub-Centre Spoke Triage & e-Sanjeevani Queue' },
  { id: 'doctor', labelEn: 'Specialist Doctor', labelMr: 'तज्ज्ञ डॉक्टर', labelHi: 'विशेषज्ञ डॉक्टर', icon: Stethoscope, color: 'text-blue-600', desc: 'Live Teleconsultation, e-Rx & Specialty Referrals' },
  { id: 'pharmacist', labelEn: 'Pharmacist / e-Aushadhi', labelMr: 'औषध निर्माण अधिकारी', labelHi: 'फार्मासिस्ट', icon: Layers, color: 'text-amber-600', desc: 'e-Prescription Dispensing & Stock Inventory' },
  { id: 'lab', labelEn: 'Diagnostic Lab', labelMr: 'प्रयोगशाळा तंत्रज्ञ', labelHi: 'लैब तकनीशियन', icon: Activity, color: 'text-purple-600', desc: 'Diagnostic Orders, Result Entry & Panic Alerts' },
  { id: 'facility', labelEn: 'Hospital Operations', labelMr: 'रुग्णालय समन्वयक', labelHi: 'अस्पताल समन्वयक', icon: Building2, color: 'text-indigo-600', desc: 'Real-time ICU/General Beds & 108 Ambulance Dispatch' },
  { id: 'dho', labelEn: 'District Health Officer (DHO)', labelMr: 'जिल्हा आरोग्य अधिकारी', labelHi: 'जिला स्वास्थ्य अधिकारी', icon: ShieldAlert, color: 'text-red-600', desc: 'Epidemic Surveillance & Public Health Directives' }
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
    pendingSyncCount,
    showToast
  } = useApp();

  const { 
    getPatientByAbhaOrMobile, 
    currentUser, 
    logout, 
    openRoleAuthModal,
    resetToFreshDatabase 
  } = useHealthData();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedPatient, setSearchedPatient] = useState<any>(null);

  const getRoleTitle = (r: Role) => {
    const item = ROLES.find(x => x.id === r);
    if (!item) return r;
    return language === 'mr' ? item.labelMr : language === 'hi' ? item.labelHi : item.labelEn;
  };

  const handleSearchPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = getPatientByAbhaOrMobile(searchQuery);
    setSearchedPatient(found || 'NOT_FOUND');
  };

  const handleSelectRoleFromMenu = (roleId: Role) => {
    setRoleDropdownOpen(false);
    if (currentUser && currentUser.role === roleId) {
      setCurrentView(roleId);
    } else {
      openRoleAuthModal(roleId);
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Signed out of role console.');
    setCurrentView('landing');
  };

  const handleResetData = async () => {
    if (window.confirm('Reset local IndexedDB to fresh initial state? All newly created records will be reinitialized.')) {
      await resetToFreshDatabase();
      showToast('IndexedDB database reset to default state.');
      setCurrentView('landing');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      
      {/* Official Government Top Flag Bar */}
      <div className="bg-[#08231a] text-slate-200 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-950">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-100">{t.govHeader}</span>
          </div>
          <span className="hidden md:inline text-emerald-800">•</span>
          <span className="hidden md:inline text-slate-300">Public Health & Family Welfare Department</span>
          <span className="hidden lg:inline text-emerald-800">•</span>
          <span className="hidden lg:inline text-emerald-300 font-mono text-[11px]">IndexedDB Realtime Active</span>
        </div>

        <div className="flex items-center gap-3 text-xs ml-auto">
          {/* Emergency 108 Helpline Quick Dial */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white px-2.5 py-0.5 rounded text-[11px] font-bold transition-all shadow-xs"
          >
            <PhoneCall className="w-3 h-3 animate-pulse" />
            <span>108 Toll-Free SOS</span>
          </button>

          {/* Database Reset Helper */}
          <button
            onClick={handleResetData}
            className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
            title="Reset local IndexedDB state"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset DB</span>
          </button>

          {/* Offline / Online Sync State */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
              isOnline 
                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-800' 
                : 'bg-amber-950 text-amber-300 border border-amber-600/60 animate-pulse'
            }`}
            title="Toggle offline mode for field sync testing"
          >
            {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
            <span className="hidden sm:inline">{isOnline ? 'HMIS Online' : `Offline (${pendingSyncCount})`}</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded text-[11px] transition-colors"
            >
              <Languages className="w-3 h-3 text-emerald-300" />
              <span className="font-bold uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-200 py-1 text-slate-800 z-50">
                <button
                  onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 ${language === 'en' ? 'text-emerald-800 font-bold bg-emerald-50/50' : ''}`}
                >
                  English
                </button>
                <button
                  onClick={() => { setLanguage('mr'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 ${language === 'mr' ? 'text-emerald-800 font-bold bg-emerald-50/50' : ''}`}
                >
                  मराठी (Marathi)
                </button>
                <button
                  onClick={() => { setLanguage('hi'); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 ${language === 'hi' ? 'text-emerald-800 font-bold bg-emerald-50/50' : ''}`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Brand & Platform Identity */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#003527] text-white flex items-center justify-center font-black text-xl shadow-xs group-hover:bg-[#064e3b] transition-all">
            से
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900 tracking-tight">SETU</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                सेतू
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none">
              Maharashtra Rural Health Coordination Platform
            </p>
          </div>
        </div>

        {/* Global Patient Lookup & Action Hub */}
        <div className="flex items-center gap-3">
          
          {/* Quick ABHA Patient Search Button */}
          <button
            onClick={() => {
              setSearchModalOpen(true);
              setSearchedPatient(null);
              setSearchQuery('');
            }}
            className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-200 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search ABHA / Patient</span>
            <kbd className="bg-white px-1.5 py-0.5 rounded text-[10px] text-slate-500 border border-slate-300 font-mono">⌘K</kbd>
          </button>

          {/* Active User Session or Role Login Trigger */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-300 px-3 py-1.5 rounded-2xl">
              <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                {currentUser.avatarInitials || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-extrabold text-xs text-slate-900 leading-tight truncate max-w-[120px]">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-emerald-800 font-medium truncate max-w-[120px]">
                  {currentUser.designation.split('(')[0]}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-white transition-colors"
                title="Sign Out of Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openRoleAuthModal('doctor')}
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Role Login</span>
            </button>
          )}

          {/* Direct Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 bg-[#003527] hover:bg-[#064e3b] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span>
                {currentView === 'landing' ? 'Portals & Consoles' : getRoleTitle(currentView as Role)}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Authorized Health Consoles</span>
                  <button 
                    onClick={() => { setCurrentView('landing'); setRoleDropdownOpen(false); }}
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    Public Home
                  </button>
                </div>

                <div className="grid gap-1 py-1 max-h-96 overflow-y-auto">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const isActive = currentView === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleSelectRoleFromMenu(r.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                          isActive 
                            ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">
                            {language === 'mr' ? r.labelMr : language === 'hi' ? r.labelHi : r.labelEn}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">{r.desc}</div>
                        </div>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />}
                      </button>
                    );
                  })}
                </div>

                {/* Additional Quick Empanelment Actions */}
                <div className="pt-2 mt-1 border-t border-slate-100 grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      openRoleAuthModal('doctor');
                    }}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-bold text-center transition-colors"
                  >
                    Apply as Doctor
                  </button>
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      openRoleAuthModal('facility');
                    }}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold text-center transition-colors"
                  >
                    List Hospital
                  </button>
                </div>
              </div>
            )}
          </div>

          {currentView !== 'landing' && (
            <button
              onClick={() => setCurrentView('landing')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}

        </div>
      </div>

      {/* Global Patient Lookup Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-base text-slate-900">ABHA Patient Directory Lookup</h3>
              </div>
              <button 
                onClick={() => setSearchModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchPatient} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter ABHA ID, Mobile or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                autoFocus
              />
              <button
                type="submit"
                className="bg-[#003527] hover:bg-[#064e3b] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Search Record
              </button>
            </form>

            <div className="text-[11px] text-slate-500">
              Try sample records: <span className="font-mono font-bold text-slate-700 cursor-pointer underline" onClick={() => setSearchQuery('Sunita')}>Sunita</span>, <span className="font-mono font-bold text-slate-700 cursor-pointer underline" onClick={() => setSearchQuery('98230 44512')}>98230 44512</span>, <span className="font-mono font-bold text-slate-700 cursor-pointer underline" onClick={() => setSearchQuery('Shantabai')}>Shantabai</span>
            </div>

            {searchedPatient && searchedPatient !== 'NOT_FOUND' && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider bg-emerald-200 text-emerald-900 font-black px-2 py-0.5 rounded-md">
                      Verified ABHA Profile
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{searchedPatient.name}</h4>
                    <p className="text-xs text-slate-600 font-mono">{searchedPatient.abhaId} • {searchedPatient.gender}, {searchedPatient.age} yrs</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    searchedPatient.riskLevel === 'High-Risk' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {searchedPatient.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-emerald-100">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Location</span>
                    <span className="font-medium text-slate-800">{searchedPatient.village}, {searchedPatient.taluka}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Contact</span>
                    <span className="font-medium text-slate-800">{searchedPatient.mobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Recent Blood Pressure</span>
                    <span className="font-semibold text-slate-900">{searchedPatient.vitals.bp}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Category</span>
                    <span className="font-semibold text-slate-900">{searchedPatient.category}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentView('patient');
                      setSearchModalOpen(false);
                    }}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs transition-all text-center"
                  >
                    Open Patient Digital Locker
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('doctor');
                      setSearchModalOpen(false);
                    }}
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-xl text-xs transition-all text-center"
                  >
                    Doctor Consultation
                  </button>
                </div>
              </div>
            )}

            {searchedPatient === 'NOT_FOUND' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center text-xs text-amber-800">
                No matching ABHA record found for "{searchQuery}". Create a new registration in the ASHA or CHO console.
              </div>
            )}

          </div>
        </div>
      )}

    </header>
  );
};
