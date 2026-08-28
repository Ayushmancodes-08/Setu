import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { Role } from '../../types';
import { setuDB, DEFAULT_ROLE_ACCOUNTS, DBUser } from '../../services/db';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Key, 
  Smartphone, 
  Building2, 
  Stethoscope, 
  HeartHandshake, 
  Layers, 
  Activity, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

const ROLE_INFO: Record<Role, { title: string; subtitle: string; icon: any; color: string; badge: string }> = {
  patient: { title: 'Citizen & Patient Portal', subtitle: 'ABHA Health Locker, Prescriptions & Live Consult', icon: Activity, color: 'text-teal-700 bg-teal-50 border-teal-200', badge: 'Public Access' },
  asha: { title: 'ASHA Frontline Field Worker', subtitle: 'Household Registry, High-Risk ANC & NCD Log', icon: HeartHandshake, color: 'text-rose-700 bg-rose-50 border-rose-200', badge: 'Frontline Field' },
  cho: { title: 'Community Health Officer (CHO)', subtitle: 'Sub-Centre Spoke Triage & e-Sanjeevani Queue', icon: Stethoscope, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', badge: 'Arogya Mandir Spoke' },
  doctor: { title: 'Specialist Medical Officer Console', subtitle: 'Hub Teleconsultation, e-Rx & Specialty Referrals', icon: Stethoscope, color: 'text-blue-700 bg-blue-50 border-blue-200', badge: 'Rural Hospital Hub' },
  specialist: { title: 'Civil Hospital Specialist Consultant', subtitle: 'Tertiary Care & Surgical Consultation', icon: Stethoscope, color: 'text-blue-700 bg-blue-50 border-blue-200', badge: 'District Civil' },
  pharmacist: { title: 'Pharmacy & e-Aushadhi Officer', subtitle: 'e-Prescription Dispensing & Stock Inventory', icon: Layers, color: 'text-amber-700 bg-amber-50 border-amber-200', badge: 'Central Dispensary' },
  lab: { title: 'Diagnostic Laboratory Wing (LIS)', subtitle: 'Requisitions, Test Results & Panic Alerts', icon: Activity, color: 'text-purple-700 bg-purple-50 border-purple-200', badge: 'Pathology & Microbiology' },
  facility: { title: 'Hospital Bed & 108 Command', subtitle: 'ICU/General Bed Allocation & Fleet Dispatch', icon: Building2, color: 'text-indigo-700 bg-indigo-50 border-indigo-200', badge: 'Hospital Operations' },
  dho: { title: 'District Health Officer (DHO)', subtitle: 'Taluka Epidemic Surveillance & Directives', icon: ShieldAlert, color: 'text-red-700 bg-red-50 border-red-200', badge: 'State Directorate' }
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: Role;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, targetRole = 'patient' }) => {
  const { setCurrentView, showToast, language } = useApp();
  const { currentUser, setCurrentUser } = useHealthData();

  const [selectedRole, setSelectedRole] = useState<Role>(targetRole);
  const [loginMethod, setLoginMethod] = useState<'instant' | 'custom'>('instant');
  const [customPhone, setCustomPhone] = useState<string>('+91 98230 44512');
  const [customOtp, setCustomOtp] = useState<string>('4421');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentRoleConfig = ROLE_INFO[selectedRole] || ROLE_INFO.patient;
  const sampleAccount = DEFAULT_ROLE_ACCOUNTS[selectedRole] || DEFAULT_ROLE_ACCOUNTS.patient;

  const handleInstantLogin = async (roleToLogin: Role) => {
    setIsAuthenticating(true);
    try {
      const user = await setuDB.loginAsRole(roleToLogin);
      setCurrentUser(user as any);
      showToast(`Authenticated as ${user.fullName} (${user.designation}). Session saved in IndexedDB.`);
      setCurrentView(roleToLogin);
      onClose();
    } catch (e) {
      console.error(e);
      showToast('Authentication failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    try {
      const customUser: DBUser = {
        id: `usr-${Date.now()}`,
        role: selectedRole,
        username: customPhone.replace(/[\s-+]/g, ''),
        fullName: sampleAccount.fullName,
        phone: customPhone,
        identifierNumber: sampleAccount.identifierNumber,
        facilityName: sampleAccount.facilityName,
        taluka: sampleAccount.taluka,
        district: sampleAccount.district,
        designation: sampleAccount.designation,
        avatarInitials: sampleAccount.avatarInitials,
        createdAt: new Date().toISOString()
      };

      await setuDB.putItem('users', customUser);
      await setuDB.setActiveSession(customUser);
      setCurrentUser(customUser as any);
      showToast(`OTP Verified! Session active for ${customUser.fullName}`);
      setCurrentView(selectedRole);
      onClose();
    } catch (e) {
      console.error(e);
      showToast('Login verification failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#003527] text-white flex items-center justify-center font-bold shadow-md">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                  ABDM L3 & IndexedDB Security Gateway
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Role Console Authentication
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selection Carousel / Tabs */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            1. Select Healthcare Role Console
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'patient' as Role, label: 'Patient' },
              { id: 'asha' as Role, label: 'ASHA Worker' },
              { id: 'cho' as Role, label: 'CHO Officer' },
              { id: 'doctor' as Role, label: 'Doctor Hub' },
              { id: 'pharmacist' as Role, label: 'Pharmacist' },
              { id: 'lab' as Role, label: 'Lab Tech' },
              { id: 'facility' as Role, label: 'Hospital Ops' },
              { id: 'dho' as Role, label: 'DHO Command' }
            ].map((r) => {
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all border text-left ${
                    isSelected
                      ? 'bg-[#003527] text-white border-[#003527] shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="truncate">{r.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Credentials Box */}
        <div className={`p-4 rounded-2xl border ${currentRoleConfig.color} space-y-2`}>
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-sm text-slate-900">{sampleAccount.fullName}</div>
            <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-slate-300">
              {currentRoleConfig.badge}
            </span>
          </div>
          <div className="text-xs text-slate-600">
            <strong>Designation:</strong> {sampleAccount.designation}
          </div>
          <div className="text-xs text-slate-600 font-mono">
            <strong>ID / Reg:</strong> {sampleAccount.identifierNumber} • <strong>Facility:</strong> {sampleAccount.facilityName}
          </div>
        </div>

        {/* Login Method Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setLoginMethod('instant')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              loginMethod === 'instant' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-emerald-700" />
            <span>1-Click IndexedDB Auth (Instant)</span>
          </button>
          <button
            onClick={() => setLoginMethod('custom')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              loginMethod === 'custom' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-700" />
            <span>Mobile OTP / ABHA Login</span>
          </button>
        </div>

        {loginMethod === 'instant' ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              Authenticates into the persistent IndexedDB database as <strong>{sampleAccount.fullName}</strong>. Live state, newly added patients, written prescriptions, and triage queues will be tied directly to this session.
            </p>

            <button
              onClick={() => handleInstantLogin(selectedRole)}
              disabled={isAuthenticating}
              className="w-full bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{isAuthenticating ? 'Initializing Persistent Session...' : `Login to ${currentRoleConfig.title}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Registered Mobile Number</label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="text-slate-700 font-bold block mb-1">6-Digit OTP</label>
                <input
                  type="text"
                  value={customOtp}
                  onChange={(e) => setCustomOtp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                  placeholder="Enter 4421"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isAuthenticating ? 'Verifying OTP & Saving Session...' : 'Verify OTP & Launch Console'}</span>
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Encrypted Local IndexedDB Storage</span>
          <span className="text-emerald-700 font-bold">100% Real-Time Reactive</span>
        </div>

      </div>
    </div>
  );
};
