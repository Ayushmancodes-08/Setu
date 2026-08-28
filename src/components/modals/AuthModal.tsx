import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { Role } from '../../types';
import { setuDB } from '../../services/db';
import { 
  Lock, 
  UserCheck, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Stethoscope, 
  HeartHandshake, 
  Layers, 
  Activity, 
  ShieldAlert,
  UserPlus,
  Hospital,
  Award,
  Phone,
  FileText,
  MapPin,
  Check
} from 'lucide-react';

const ROLE_METADATA: Record<Role, { title: string; subtitle: string; icon: any; color: string; idLabel: string; idPlaceholder: string }> = {
  patient: { 
    title: 'Citizen & Patient Portal', 
    subtitle: 'ABHA Health Locker, Prescriptions & Teleconsultation', 
    icon: Activity, 
    color: 'text-teal-700 bg-teal-50 border-teal-200',
    idLabel: 'ABHA Number or Registered Mobile',
    idPlaceholder: 'e.g. 91-4821-9902-3312 or +91 98230 44512'
  },
  asha: { 
    title: 'ASHA Frontline Field Worker', 
    subtitle: 'Household Registry, High-Risk ANC & NCD Record', 
    icon: HeartHandshake, 
    color: 'text-rose-700 bg-rose-50 border-rose-200',
    idLabel: 'ASHA Worker ID or Mobile',
    idPlaceholder: 'e.g. ASHA-PUN-0482 or +91 98901 23412'
  },
  cho: { 
    title: 'Community Health Officer (CHO)', 
    subtitle: 'Sub-Centre Spoke Triage & e-Sanjeevani Queue', 
    icon: Stethoscope, 
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    idLabel: 'CHO Registration ID or Mobile',
    idPlaceholder: 'e.g. CHO-MH-8819 or +91 94220 88312'
  },
  doctor: { 
    title: 'Specialist Medical Officer Console', 
    subtitle: 'Hub Teleconsultation, e-Rx & Specialty Referrals', 
    icon: Stethoscope, 
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    idLabel: 'MCI / MMC Registration Number or Mobile',
    idPlaceholder: 'e.g. MMC-2016-99410 or +91 98224 11092'
  },
  specialist: { 
    title: 'Civil Hospital Specialist Consultant', 
    subtitle: 'Tertiary Care & Surgical Tele-Hub', 
    icon: Stethoscope, 
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    idLabel: 'Medical Council Reg No / Employee ID',
    idPlaceholder: 'e.g. MMC-2011-44109'
  },
  pharmacist: { 
    title: 'Pharmacy & e-Aushadhi Officer', 
    subtitle: 'e-Prescription Dispensing & Stock Inventory', 
    icon: Layers, 
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    idLabel: 'Pharmacy License Number or Mobile',
    idPlaceholder: 'e.g. PHARM-MH-2018-4412'
  },
  lab: { 
    title: 'Diagnostic Laboratory Wing (LIS)', 
    subtitle: 'Requisitions, Test Results & Panic Alarms', 
    icon: Activity, 
    color: 'text-purple-700 bg-purple-50 border-purple-200',
    idLabel: 'Lab Technician ID or Mobile',
    idPlaceholder: 'e.g. LIS-TECH-8812'
  },
  facility: { 
    title: 'Hospital Bed & 108 Command', 
    subtitle: 'ICU/General Bed Allocation & Fleet Dispatch', 
    icon: Building2, 
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    idLabel: 'Facility Code or Admin Phone',
    idPlaceholder: 'e.g. FAC-PUN-0104'
  },
  dho: { 
    title: 'District Health Officer (DHO)', 
    subtitle: 'Taluka Epidemic Surveillance & Directives', 
    icon: ShieldAlert, 
    color: 'text-red-700 bg-red-50 border-red-200',
    idLabel: 'DHS Administrative Key / Official Mobile',
    idPlaceholder: 'e.g. DHS-MH-DIR-009'
  }
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: Role;
}

type AuthTab = 'login' | 'signup' | 'apply_doctor' | 'apply_hospital';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, targetRole = 'patient' }) => {
  const { setCurrentView, showToast } = useApp();
  const { setCurrentUser } = useHealthData();

  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [selectedRole, setSelectedRole] = useState<Role>(targetRole);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('4421');

  // Sign Up Form States
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupRole, setSignupRole] = useState<Role>(targetRole);
  const [signupDesignation, setSignupDesignation] = useState('');
  const [signupFacility, setSignupFacility] = useState('');
  const [signupDistrict, setSignupDistrict] = useState('Pune');
  const [signupTaluka, setSignupTaluka] = useState('Junnar');

  // Doctor Application States
  const [docName, setDocName] = useState('');
  const [docRegNo, setDocRegNo] = useState('');
  const [docCouncil, setDocCouncil] = useState('Maharashtra Medical Council (MMC)');
  const [docSpecialty, setDocSpecialty] = useState('General Medicine');
  const [docDegree, setDocDegree] = useState('MD / DNB');
  const [docHospital, setDocHospital] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docTaluka, setDocTaluka] = useState('Junnar');
  const [docDistrict, setDocDistrict] = useState('Pune');

  // Hospital Listing Application States
  const [facName, setFacName] = useState('');
  const [facType, setFacType] = useState<'phc' | 'rh' | 'dh' | 'sdh' | 'mjpjay_private'>('rh');
  const [facLevel, setFacLevel] = useState('Rural Hospital & Trauma Hub');
  const [facDistrict, setFacDistrict] = useState('Pune');
  const [facTaluka, setFacTaluka] = useState('Junnar');
  const [facTotalBeds, setFacTotalBeds] = useState(50);
  const [facIcuBeds, setFacIcuBeds] = useState(8);
  const [facOxygen, setFacOxygen] = useState(true);
  const [facBloodBank, setFacBloodBank] = useState(true);
  const [facAmbulances, setFacAmbulances] = useState(2);
  const [facNodalName, setFacNodalName] = useState('');
  const [facNodalPhone, setFacNodalPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(targetRole);
      setSignupRole(targetRole);
      setActiveTab('login');
      setLoginIdentifier('');
    }
  }, [isOpen, targetRole]);

  if (!isOpen) return null;

  const currentMeta = ROLE_METADATA[selectedRole] || ROLE_METADATA.patient;
  const Icon = currentMeta.icon;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast('Please enter your ABHA ID, Mobile Number, or Registration ID.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await setuDB.loginUser(loginIdentifier.trim(), selectedRole);
      setCurrentUser(user);
      showToast(`Authenticated as ${user.fullName} (${user.designation}).`);
      setCurrentView(selectedRole);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupPhone.trim()) {
      showToast('Please enter full name and phone number.');
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await setuDB.signupUser({
        role: signupRole,
        username: signupPhone.replace(/[\s-+]/g, ''),
        fullName: signupName.trim(),
        phone: signupPhone.trim(),
        identifierNumber: `ABDM-${signupRole.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        facilityName: signupFacility.trim() || 'Maharashtra Rural Health Network',
        taluka: signupTaluka,
        district: signupDistrict,
        designation: signupDesignation.trim() || `${signupRole.toUpperCase()} Officer`,
        avatarInitials: signupName.slice(0, 2).toUpperCase()
      });

      setCurrentUser(newUser);
      showToast(`Account created! Welcome, ${newUser.fullName}.`);
      setCurrentView(signupRole);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Doctor Empanelment
  const handleDoctorApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docRegNo.trim() || !docPhone.trim()) {
      showToast('Please complete required medical council details.');
      return;
    }

    setIsLoading(true);
    try {
      const docUser = await setuDB.applyForDoctorEmpanelment({
        fullName: docName.trim(),
        medicalRegNumber: docRegNo.trim(),
        councilName: docCouncil,
        specialization: docSpecialty,
        degree: docDegree,
        affiliatedHospital: docHospital.trim() || 'Junnar Rural Hospital Telemedicine Spoke',
        taluka: docTaluka,
        district: docDistrict,
        phone: docPhone.trim(),
        email: docEmail.trim() || `${docRegNo.toLowerCase()}@mahahealth.gov.in`
      });

      setCurrentUser(docUser);
      showToast(`Doctor credentials verified! Practice activated for ${docUser.fullName}.`);
      setCurrentView('doctor');
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Doctor verification submission failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Hospital Listing
  const handleHospitalApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim() || !facNodalName.trim() || !facNodalPhone.trim()) {
      showToast('Please complete hospital name and nodal officer contact.');
      return;
    }

    setIsLoading(true);
    try {
      const newFacility = await setuDB.applyForHospitalListing({
        name: facName.trim(),
        type: facType,
        level: facLevel,
        taluka: facTaluka,
        district: facDistrict,
        totalBeds: Number(facTotalBeds),
        availableBeds: Math.floor(Number(facTotalBeds) * 0.4),
        icuBedsTotal: Number(facIcuBeds),
        icuBedsAvailable: Math.floor(Number(facIcuBeds) * 0.3),
        hasOxygenPlant: facOxygen,
        hasBloodBank: facBloodBank,
        ambulancesStationed: Number(facAmbulances),
        nodalOfficerName: facNodalName.trim(),
        nodalOfficerPhone: facNodalPhone.trim()
      });

      showToast(`Hospital empanelled! ${newFacility.name} is now live in Care Finder & Bed Command.`);
      setCurrentView('facility');
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Hospital listing failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#003527] text-white flex items-center justify-center font-bold shadow-md">
              <Icon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  ABDM Security Gateway
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">Realtime IDB</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {currentMeta.title}
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

        {/* Dynamic Action Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 truncate ${
              activeTab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Login</span>
          </button>

          <button
            onClick={() => setActiveTab('signup')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 truncate ${
              activeTab === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>Sign Up</span>
          </button>

          <button
            onClick={() => setActiveTab('apply_doctor')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 truncate ${
              activeTab === 'apply_doctor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
            <span>Apply Doctor</span>
          </button>

          <button
            onClick={() => setActiveTab('apply_hospital')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 truncate ${
              activeTab === 'apply_hospital' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Hospital className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>List Hospital</span>
          </button>
        </div>

        {/* 1. LOGIN VIEW */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  {currentMeta.idLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={currentMeta.idPlaceholder}
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Security PIN / OTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter 4-6 digit PIN or OTP"
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{isLoading ? 'Verifying Credentials...' : `Authenticate into ${currentMeta.title}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <button 
                type="button" 
                onClick={() => setActiveTab('signup')}
                className="text-emerald-700 hover:underline font-bold"
              >
                New user? Sign Up here
              </button>
              <button 
                type="button" 
                onClick={() => setActiveTab('apply_doctor')}
                className="text-blue-700 hover:underline font-bold"
              >
                Are you a Doctor? Apply for Verification
              </button>
            </div>
          </form>
        )}

        {/* 2. SIGN UP VIEW */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">Full Legal Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Smt. Manisha Kadam / Rajesh Patil"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Mobile Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  placeholder="+91 98XXX XXXXX"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Healthcare Role</label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as Role)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                >
                  <option value="patient">Patient / Citizen</option>
                  <option value="asha">ASHA Worker</option>
                  <option value="cho">Community Health Officer (CHO)</option>
                  <option value="doctor">Medical Officer / Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="lab">Lab Technician</option>
                  <option value="facility">Hospital Operations</option>
                  <option value="dho">District Health Officer (DHO)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">District</label>
                <input
                  type="text"
                  value={signupDistrict}
                  onChange={(e) => setSignupDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Taluka / Block</label>
                <input
                  type="text"
                  value={signupTaluka}
                  onChange={(e) => setSignupTaluka(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">Affiliated Health Facility / Village</label>
                <input
                  type="text"
                  placeholder="e.g. Khamgaon Ayushman Arogya Mandir / Junnar RH"
                  value={signupFacility}
                  onChange={(e) => setSignupFacility(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isLoading ? 'Creating Account...' : 'Complete Sign Up & Launch Console'}</span>
            </button>
          </form>
        )}

        {/* 3. APPLY FOR DOCTOR EMPANELMENT */}
        {activeTab === 'apply_doctor' && (
          <form onSubmit={handleDoctorApply} className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900">
              <strong className="block font-bold">Maharashtra Medical Council / ABDM Doctor Empanelment</strong>
              Enter your Medical Council registration details to be verified and issued telemedicine prescribing authority.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Doctor Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Swapnil Deshmukh"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Medical Registration No. <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. MMC-2018-99410"
                  value={docRegNo}
                  onChange={(e) => setDocRegNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Medical Council</label>
                <select
                  value={docCouncil}
                  onChange={(e) => setDocCouncil(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                >
                  <option value="Maharashtra Medical Council (MMC)">Maharashtra Medical Council (MMC)</option>
                  <option value="National Medical Commission (NMC)">National Medical Commission (NMC)</option>
                  <option value="Maharashtra Council of Indian Medicine (MCIM)">Maharashtra Council of Indian Medicine (MCIM)</option>
                  <option value="Maharashtra Dental Council (MDC)">Maharashtra Dental Council (MDC)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Specialization <span className="text-red-500">*</span></label>
                <select
                  value={docSpecialty}
                  onChange={(e) => setDocSpecialty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Obstetrics & Gynecology (OBGYN)">Obstetrics & Gynecology (OBGYN)</option>
                  <option value="Pediatrics & Child Health">Pediatrics & Child Health</option>
                  <option value="General Surgery">General Surgery</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Dermatology">Dermatology</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Highest Degree</label>
                <input
                  type="text"
                  placeholder="e.g. MBBS, MD (Medicine), MS (OBGYN)"
                  value={docDegree}
                  onChange={(e) => setDocDegree(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Contact Phone <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  placeholder="+91 98224 11092"
                  value={docPhone}
                  onChange={(e) => setDocPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-medium"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">Primary Affiliated Hospital / Spoke Hub</label>
                <input
                  type="text"
                  placeholder="e.g. Junnar Rural Hospital & Trauma Centre"
                  value={docHospital}
                  onChange={(e) => setDocHospital(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-blue-200" />
              <span>{isLoading ? 'Verifying with Medical Registry...' : 'Submit Credentials & Activate Doctor Console'}</span>
            </button>
          </form>
        )}

        {/* 4. APPLY FOR HOSPITAL LISTING */}
        {activeTab === 'apply_hospital' && (
          <form onSubmit={handleHospitalApply} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
              <strong className="block font-bold">Maharashtra Public Health Facility & Bed Registry Empanelment</strong>
              List your hospital, PHC, or clinic to accept real-time emergency referrals and coordinate 108 ambulance admissions.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">Facility Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Otur Community Health Center & Trauma Hub"
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Facility Type</label>
                <select
                  value={facType}
                  onChange={(e) => setFacType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                >
                  <option value="rh">Rural Hospital (RH)</option>
                  <option value="phc">Primary Health Centre (PHC)</option>
                  <option value="sdh">Sub-District Hospital (SDH)</option>
                  <option value="dh">District Civil Hospital (DH)</option>
                  <option value="mjpjay_private">Empaneled Private Hospital (MJPJAY)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">District / Taluka</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={facDistrict}
                    onChange={(e) => setFacDistrict(e.target.value)}
                    className="w-1/2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                    placeholder="District"
                  />
                  <input
                    type="text"
                    value={facTaluka}
                    onChange={(e) => setFacTaluka(e.target.value)}
                    className="w-1/2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                    placeholder="Taluka"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Total General Beds</label>
                <input
                  type="number"
                  value={facTotalBeds}
                  onChange={(e) => setFacTotalBeds(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold"
                  min={5}
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">ICU & HDU Bed Capacity</label>
                <input
                  type="number"
                  value={facIcuBeds}
                  onChange={(e) => setFacIcuBeds(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold"
                  min={0}
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Medical Superintendent / Nodal Officer <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Dr. S. K. Shinde (MS)"
                  value={facNodalName}
                  onChange={(e) => setFacNodalName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Nodal Officer Contact <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  placeholder="+91 94220 XXXXX"
                  value={facNodalPhone}
                  onChange={(e) => setFacNodalPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-medium"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={facOxygen}
                    onChange={(e) => setFacOxygen(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-bold text-slate-700">24x7 PSA Oxygen Plant Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={facBloodBank}
                    onChange={(e) => setFacBloodBank(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Blood Storage Unit Active</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Hospital className="w-4 h-4 text-amber-200" />
              <span>{isLoading ? 'Empanelling Facility...' : 'List Hospital & Activate Bed Command'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
