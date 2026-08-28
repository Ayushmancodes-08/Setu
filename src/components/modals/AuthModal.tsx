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
  Award
} from 'lucide-react';

interface RoleConfig {
  titleEn: string;
  titleMr: string;
  badge: string;
  icon: any;
  theme: string;
  loginIdLabel: string;
  loginIdPlaceholder: string;
  signupTitle: string;
}

const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  patient: {
    titleEn: 'Citizen & Patient Portal',
    titleMr: 'नागरिक व रुग्ण पोर्टल',
    badge: 'Public / Citizen Access',
    icon: Activity,
    theme: 'text-teal-700 bg-teal-50 border-teal-200',
    loginIdLabel: 'ABHA Number or Registered Mobile',
    loginIdPlaceholder: 'e.g. 91-4821-9902-3312 or +91 98230 44512',
    signupTitle: 'New Citizen / Patient ABHA Registration'
  },
  asha: {
    titleEn: 'ASHA Frontline Field Worker Portal',
    titleMr: 'आशा सेविका फील्ड पोर्टल',
    badge: 'Community Frontline Level',
    icon: HeartHandshake,
    theme: 'text-rose-700 bg-rose-50 border-rose-200',
    loginIdLabel: 'ASHA Worker ID or Registered Mobile',
    loginIdPlaceholder: 'e.g. ASHA-PUN-0482 or +91 98901 23412',
    signupTitle: 'New ASHA Worker Registration'
  },
  cho: {
    titleEn: 'Community Health Officer (CHO) Console',
    titleMr: 'समुदाय आरोग्य अधिकारी (CHO) कन्सोल',
    badge: 'Ayushman Arogya Mandir Spoke',
    icon: Stethoscope,
    theme: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    loginIdLabel: 'CHO Registration Number or Mobile',
    loginIdPlaceholder: 'e.g. CHO-MH-8819 or +91 94220 88312',
    signupTitle: 'New CHO Officer Registration'
  },
  doctor: {
    titleEn: 'Specialist Medical Officer & Doctor Console',
    titleMr: 'तज्ज्ञ डॉक्टर व वैद्यकीय अधिकारी कन्सोल',
    badge: 'Rural Hospital Specialist Hub',
    icon: Stethoscope,
    theme: 'text-blue-700 bg-blue-50 border-blue-200',
    loginIdLabel: 'MCI / MMC Medical Registration Number or Mobile',
    loginIdPlaceholder: 'e.g. MMC-2016-99410 or +91 98224 11092',
    signupTitle: 'Doctor Empanelment & License Verification'
  },
  specialist: {
    titleEn: 'Civil Hospital Specialist Consultant Console',
    titleMr: 'जिल्हा रुग्णालय तज्ज्ञ कन्सोल',
    badge: 'District Civil Hospital Level',
    icon: Stethoscope,
    theme: 'text-blue-700 bg-blue-50 border-blue-200',
    loginIdLabel: 'Medical Council Reg No or Employee ID',
    loginIdPlaceholder: 'e.g. MMC-2011-44109',
    signupTitle: 'Specialist Consultant Registration'
  },
  pharmacist: {
    titleEn: 'Pharmacy & e-Aushadhi Console',
    titleMr: 'औषध निर्माण व साठा कक्ष',
    badge: 'Facility Central Dispensary',
    icon: Layers,
    theme: 'text-amber-700 bg-amber-50 border-amber-200',
    loginIdLabel: 'Pharmacy License Number or Mobile',
    loginIdPlaceholder: 'e.g. PHARM-MH-2018-4412 or +91 97630 11982',
    signupTitle: 'Pharmacist Registration & Dispensary Setup'
  },
  lab: {
    titleEn: 'Diagnostic Laboratory Wing (LIS)',
    titleMr: 'प्रयोगशाळा तंत्रज्ञ पोर्टल',
    badge: 'Pathology & Diagnostic Lab',
    icon: Activity,
    theme: 'text-purple-700 bg-purple-50 border-purple-200',
    loginIdLabel: 'Lab Technician ID or Mobile',
    loginIdPlaceholder: 'e.g. LIS-TECH-8812 or +91 94055 22910',
    signupTitle: 'Lab Technician Registration'
  },
  facility: {
    titleEn: 'Hospital Bed & 108 Command Console',
    titleMr: 'रुग्णालय व रुग्णवाहिका समन्वय',
    badge: 'Hospital Operations Command',
    icon: Building2,
    theme: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    loginIdLabel: 'Facility Code or Admin Phone',
    loginIdPlaceholder: 'e.g. FAC-PUN-0104 or +91 2132 222108',
    signupTitle: 'Apply for Hospital / Health Facility Listing'
  },
  dho: {
    titleEn: 'District Health Officer (DHO) Command',
    titleMr: 'जिल्हा आरोग्य अधिकारी कन्सोल',
    badge: 'District Public Health Directorate',
    icon: ShieldAlert,
    theme: 'text-red-700 bg-red-50 border-red-200',
    loginIdLabel: 'DHS Administrative Key or Official Mobile',
    loginIdPlaceholder: 'e.g. DHS-MH-DIR-009 or +91 20 2612 3450',
    signupTitle: 'District Public Health Officer Registration'
  }
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: Role;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, targetRole = 'patient' }) => {
  const { setCurrentView, showToast, language } = useApp();
  const { setCurrentUser } = useHealthData();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Common Login States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('4421');

  // Role-Specific Sign Up States:
  // Citizen / Patient
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState<number>(26);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [patientVillage, setPatientVillage] = useState('Khamgaon');
  const [patientTaluka, setPatientTaluka] = useState('Junnar');
  const [patientCategory, setPatientCategory] = useState<'Maternal ANC' | 'NCD Patient' | 'Pediatric' | 'General OPD' | 'Elderly Care'>('Maternal ANC');

  // Doctor / Specialist
  const [docName, setDocName] = useState('');
  const [docRegNo, setDocRegNo] = useState('');
  const [docCouncil, setDocCouncil] = useState('Maharashtra Medical Council (MMC)');
  const [docSpecialty, setDocSpecialty] = useState('General Medicine');
  const [docDegree, setDocDegree] = useState('MBBS / MD');
  const [docHospital, setDocHospital] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docTaluka, setDocTaluka] = useState('Junnar');

  // Hospital / Facility Listing
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

  // ASHA / CHO / Pharmacist / Lab / DHO General Worker States
  const [workerName, setWorkerName] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerIdNumber, setWorkerIdNumber] = useState('');
  const [workerFacility, setWorkerFacility] = useState('');
  const [workerTaluka, setWorkerTaluka] = useState('Junnar');
  const [workerDistrict, setWorkerDistrict] = useState('Pune');
  const [workerDesignation, setWorkerDesignation] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab('login');
      setLoginIdentifier('');
      setLoginPin('4421');
    }
  }, [isOpen, targetRole]);

  if (!isOpen) return null;

  const currentConfig = ROLE_CONFIGS[targetRole] || ROLE_CONFIGS.patient;
  const Icon = currentConfig.icon;

  // Handle Login for this specific role
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast(`Please enter your ${currentConfig.loginIdLabel}.`);
      return;
    }

    setIsLoading(true);
    try {
      const user = await setuDB.loginUser(loginIdentifier.trim(), targetRole);
      setCurrentUser(user);
      showToast(`Authenticated as ${user.fullName} (${user.designation}).`);
      setCurrentView(targetRole);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Role-Specific Sign Up
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (targetRole === 'patient') {
        if (!patientName.trim() || !patientPhone.trim()) {
          showToast('Please enter full name and mobile number.');
          setIsLoading(false);
          return;
        }

        const generatedAbha = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Register Citizen as User
        const newUser = await setuDB.signupUser({
          role: 'patient',
          username: patientPhone.replace(/[\s-+]/g, ''),
          fullName: patientName.trim(),
          phone: patientPhone.trim(),
          identifierNumber: `${generatedAbha} (ABHA ID)`,
          facilityName: `${patientVillage} Ayushman Arogya Mandir`,
          taluka: patientTaluka,
          district: 'Pune',
          designation: `Citizen / ${patientCategory}`,
          avatarInitials: patientName.slice(0, 2).toUpperCase()
        });

        // Add to Live Patient Registry
        await setuDB.putItem('patients', {
          id: `p-${Date.now()}`,
          abhaId: generatedAbha,
          name: patientName.trim(),
          age: Number(patientAge),
          gender: patientGender,
          mobile: patientPhone.trim(),
          village: patientVillage,
          taluka: patientTaluka,
          district: 'Pune',
          category: patientCategory,
          riskLevel: 'Low',
          vitals: {
            bp: '120/80 mmHg',
            pulse: '78 bpm',
            spo2: '98%',
            temp: '98.4 °F',
            weight: '56 kg',
            lastRecordedAt: 'Just registered'
          },
          diagnoses: ['General Health Checkup'],
          allergies: ['None Known'],
          assignedAsha: 'Manisha Kadam',
          assignedCho: 'Pooja Jadhav, CHO',
          activePrescriptions: [],
          recentLabReports: [],
          schemeEligibility: ['PM-JAY', 'MJPJAY', 'JSSK Free Delivery'],
          createdAt: new Date().toISOString()
        });

        setCurrentUser(newUser);
        showToast(`ABHA Account Created! ABHA ID: ${generatedAbha}.`);
        setCurrentView('patient');
        onClose();

      } else if (targetRole === 'doctor' || targetRole === 'specialist') {
        if (!docName.trim() || !docRegNo.trim() || !docPhone.trim()) {
          showToast('Please fill in doctor name, medical council registration no, and phone.');
          setIsLoading(false);
          return;
        }

        const docUser = await setuDB.applyForDoctorEmpanelment({
          fullName: docName.trim(),
          medicalRegNumber: docRegNo.trim(),
          councilName: docCouncil,
          specialization: docSpecialty,
          degree: docDegree,
          affiliatedHospital: docHospital.trim() || 'Junnar Rural Hospital Tele-Hub',
          taluka: docTaluka,
          district: 'Pune',
          phone: docPhone.trim(),
          email: docEmail.trim() || `${docRegNo.toLowerCase()}@mahahealth.gov.in`
        });

        setCurrentUser(docUser);
        showToast(`Medical license verified! Doctor console activated for ${docUser.fullName}.`);
        setCurrentView(targetRole);
        onClose();

      } else if (targetRole === 'facility') {
        if (!facName.trim() || !facNodalName.trim() || !facNodalPhone.trim()) {
          showToast('Please complete hospital name and nodal officer contact.');
          setIsLoading(false);
          return;
        }

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

        const facUser = await setuDB.signupUser({
          role: 'facility',
          username: facNodalPhone.replace(/[\s-+]/g, ''),
          fullName: facNodalName.trim(),
          phone: facNodalPhone.trim(),
          identifierNumber: `FAC-${facTaluka.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
          facilityName: newFacility.name,
          taluka: facTaluka,
          district: facDistrict,
          designation: 'Hospital Superintendent & 108 Coordinator',
          avatarInitials: facNodalName.slice(0, 2).toUpperCase()
        });

        setCurrentUser(facUser);
        showToast(`Hospital empanelled! ${newFacility.name} is now live in Care Finder.`);
        setCurrentView('facility');
        onClose();

      } else {
        // ASHA, CHO, Pharmacist, Lab, DHO
        if (!workerName.trim() || !workerPhone.trim()) {
          showToast('Please fill in your full name and mobile number.');
          setIsLoading(false);
          return;
        }

        const workerUser = await setuDB.signupUser({
          role: targetRole,
          username: workerPhone.replace(/[\s-+]/g, ''),
          fullName: workerName.trim(),
          phone: workerPhone.trim(),
          identifierNumber: workerIdNumber.trim() || `${targetRole.toUpperCase()}-MH-${Math.floor(1000 + Math.random() * 9000)}`,
          facilityName: workerFacility.trim() || 'Maharashtra Rural Health Network',
          taluka: workerTaluka,
          district: workerDistrict,
          designation: workerDesignation.trim() || currentConfig.badge,
          avatarInitials: workerName.slice(0, 2).toUpperCase()
        });

        setCurrentUser(workerUser);
        showToast(`Account registered! Welcome to the ${currentConfig.titleEn}.`);
        setCurrentView(targetRole);
        onClose();
      }
    } catch (err) {
      console.error(err);
      showToast('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Role-Specific Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#003527] text-white flex items-center justify-center font-bold shadow-md">
              <Icon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {currentConfig.badge}
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">ABDM L3</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {language === 'mr' ? currentConfig.titleMr : currentConfig.titleEn}
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

        {/* 2 Scoped Tabs Only: Login vs Sign Up for THIS Role */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Login to Console</span>
          </button>

          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-700" />
            <span>{targetRole === 'facility' ? 'List Hospital' : targetRole === 'doctor' ? 'Apply for Empanelment' : 'New Sign Up'}</span>
          </button>
        </div>

        {/* TAB 1: ROLE-SCOPED LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  {currentConfig.loginIdLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={currentConfig.loginIdPlaceholder}
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Security PIN / 6-Digit OTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter PIN or OTP"
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
              <span>{isLoading ? 'Verifying Credentials...' : `Authenticate as ${targetRole.toUpperCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={() => setActiveTab('signup')}
                className="text-xs text-emerald-700 hover:underline font-bold"
              >
                Don't have an account? {targetRole === 'facility' ? 'Apply to list your hospital' : targetRole === 'doctor' ? 'Apply for doctor verification' : 'Create a new account here'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: ROLE-SCOPED SIGN UP */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* CITIZEN / PATIENT SIGN UP */}
            {targetRole === 'patient' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-800 block mb-1">Full Legal Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Sunita Ravindra Shinde"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    placeholder="+91 98XXX XXXXX"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Age & Gender</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(Number(e.target.value))}
                      className="w-16 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs text-slate-900 font-bold text-center"
                      min={1}
                      max={120}
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs text-slate-900 font-bold"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Village / Habitat</label>
                  <input
                    type="text"
                    placeholder="e.g. Khamgaon"
                    value={patientVillage}
                    onChange={(e) => setPatientVillage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Taluka</label>
                  <input
                    type="text"
                    value={patientTaluka}
                    onChange={(e) => setPatientTaluka(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-800 block mb-1">Healthcare Category</label>
                  <select
                    value={patientCategory}
                    onChange={(e) => setPatientCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                  >
                    <option value="Maternal ANC">Maternal ANC (Pregnant Mother)</option>
                    <option value="NCD Patient">NCD (Diabetes / Blood Pressure)</option>
                    <option value="Pediatric">Pediatric / Child Care</option>
                    <option value="Elderly Care">Elderly Healthcare</option>
                    <option value="General OPD">General OPD Patient</option>
                  </select>
                </div>
              </div>
            )}

            {/* DOCTOR / SPECIALIST SIGN UP & EMPANELMENT */}
            {(targetRole === 'doctor' || targetRole === 'specialist') && (
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
                  <label className="font-bold text-slate-800 block mb-1">Medical Reg Number <span className="text-red-500">*</span></label>
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
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Specialization</label>
                  <select
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Obstetrics & Gynecology (OBGYN)">Obstetrics & Gynecology (OBGYN)</option>
                    <option value="Pediatrics & Child Health">Pediatrics & Child Health</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Highest Degree</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, MD (Medicine), MS"
                    value={docDegree}
                    onChange={(e) => setDocDegree(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Phone Number <span className="text-red-500">*</span></label>
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
                  <label className="font-bold text-slate-800 block mb-1">Affiliated Hospital / Telemedicine Hub</label>
                  <input
                    type="text"
                    placeholder="e.g. Junnar Rural Hospital & Trauma Centre"
                    value={docHospital}
                    onChange={(e) => setDocHospital(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>
            )}

            {/* HOSPITAL / FACILITY LISTING */}
            {targetRole === 'facility' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-800 block mb-1">Hospital / Facility Name <span className="text-red-500">*</span></label>
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
                  <label className="font-bold text-slate-800 block mb-1">Facility Level</label>
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
                  <label className="font-bold text-slate-800 block mb-1">Nodal Officer / MS Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. S. K. Shinde"
                    value={facNodalName}
                    onChange={(e) => setFacNodalName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Nodal Contact Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    placeholder="+91 94220 XXXXX"
                    value={facNodalPhone}
                    onChange={(e) => setFacNodalPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-medium"
                    required
                  />
                </div>
              </div>
            )}

            {/* ASHA, CHO, PHARMACIST, LAB, DHO GENERAL WORKER SIGN UP */}
            {['asha', 'cho', 'pharmacist', 'lab', 'dho'].includes(targetRole) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-800 block mb-1">Full Legal Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Smt. Pooja Jadhav"
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    placeholder="+91 94220 88312"
                    value={workerPhone}
                    onChange={(e) => setWorkerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Employee / License ID</label>
                  <input
                    type="text"
                    placeholder="e.g. REG-MH-8819"
                    value={workerIdNumber}
                    onChange={(e) => setWorkerIdNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">District</label>
                  <input
                    type="text"
                    value={workerDistrict}
                    onChange={(e) => setWorkerDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Taluka</label>
                  <input
                    type="text"
                    value={workerTaluka}
                    onChange={(e) => setWorkerTaluka(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-800 block mb-1">Facility / Workplace Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Khamgaon Ayushman Arogya Mandir / Junnar Central Lab"
                    value={workerFacility}
                    onChange={(e) => setWorkerFacility(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isLoading ? 'Creating Account...' : targetRole === 'facility' ? 'Empanel Hospital & Activate Bed Command' : targetRole === 'doctor' ? 'Verify License & Activate Practice' : `Register as ${targetRole.toUpperCase()}`}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
