import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { Role, Language } from '../../types';
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
  Sparkles,
  KeyRound,
  ShieldCheck,
  Smartphone,
  Check
} from 'lucide-react';

interface RoleConfig {
  id: Role;
  titles: Record<Language, string>;
  badge: string;
  icon: any;
  themeColor: string;
  loginIdLabel: Record<Language, string>;
  loginIdPlaceholder: string;
  demoId: string;
  demoName: string;
  demoRoleText: string;
}

const PRIMARY_ROLES: RoleConfig[] = [
  {
    id: 'patient',
    titles: {
      en: 'Citizen & Patient Portal',
      mr: 'नागरिक व रुग्ण पोर्टल',
      hi: 'नागरिक एवं मरीज पोर्टल',
      or: 'ନାଗରିକ ଏବଂ ରୋଗୀ ପୋର୍ଟାଲ୍',
      bn: 'নাগরিক ও রোগী পোর্টাল',
      ur: 'شہری اور مریض پورٹل'
    },
    badge: 'Primary • Citizen Layer',
    icon: Activity,
    themeColor: 'emerald',
    loginIdLabel: {
      en: 'ABHA Number or Mobile Phone',
      mr: 'आभा क्रमांक किंवा मोबाईल नंबर',
      hi: 'आभा संख्या या मोबाइल नंबर',
      or: 'ଆଭା ନମ୍ବର କିମ୍ବା ମୋବାଇଲ୍ ନମ୍ବର',
      bn: 'আভা নম্বর বা মোবাইল নম্বর',
      ur: 'آبھا نمبر یا موبائل فون'
    },
    loginIdPlaceholder: 'e.g. 91-4821-9902-3312 or 9823044512',
    demoId: '9823044512',
    demoName: 'Rajesh Kumar Shinde',
    demoRoleText: 'Citizen (Khamgaon Village)'
  },
  {
    id: 'asha',
    titles: {
      en: 'ASHA / CHO Field Worker',
      mr: 'आशा व समुदाय आरोग्य अधिकारी',
      hi: 'आशा व सामुदायिक स्वास्थ्य कार्यकर्ता',
      or: 'ଆଶା ଓ ସିଏଚଓ କ୍ଷେତ୍ର କର୍ମୀ',
      bn: 'আশা ও সিএইচও ফিল্ড কর্মী',
      ur: 'آشا / سی ایچ او فیلڈ ورکر'
    },
    badge: 'Primary • Field Layer',
    icon: HeartHandshake,
    themeColor: 'rose',
    loginIdLabel: {
      en: 'ASHA ID or Registered Mobile',
      mr: 'आशा आयडी किंवा नोंदणीकृत मोबाईल',
      hi: 'आशा आईडी या पंजीकृत मोबाइल',
      or: 'ଆଶା ଆଇଡି କିମ୍ବା ପଞ୍ଜୀକୃତ ମୋବାଇଲ୍',
      bn: 'আশা আইডি বা মোবাইল নম্বর',
      ur: 'آشا شناختی کارڈ یا موبائل'
    },
    loginIdPlaceholder: 'e.g. ASHA-PUN-0482 or 9890123412',
    demoId: '9890123412',
    demoName: 'Manisha Kadam',
    demoRoleText: 'Frontline ASHA Worker (Sector 4)'
  },
  {
    id: 'dho',
    titles: {
      en: 'District Health Officer (DHO)',
      mr: 'जिल्हा आरोग्य अधिकारी (DHO)',
      hi: 'जिला स्वास्थ्य अधिकारी (DHO)',
      or: 'ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ଅଧିକାରୀ (DHO)',
      bn: 'জেলা স্বাস্থ্য কর্মকর্তা (DHO)',
      ur: 'ڈسٹرکٹ ہیلتھ آفیسر (DHO)'
    },
    badge: 'Primary • District Intelligence',
    icon: ShieldAlert,
    themeColor: 'red',
    loginIdLabel: {
      en: 'DHS Administrative Key or Mobile',
      mr: 'डीएचएस प्रशासकीय की किंवा मोबाईल',
      hi: 'डीएचएस प्रशासनिक कुंजी या मोबाइल',
      or: 'ପ୍ରଶାସନିକ କି କିମ୍ବା ମୋବାଇଲ୍',
      bn: 'প্রশাসনিক কী বা মোবাইল নম্বর',
      ur: 'انتظامی کی یا موبائل فون'
    },
    loginIdPlaceholder: 'e.g. DHS-MH-DIR-009 or 9820011223',
    demoId: '9820011223',
    demoName: 'Dr. Ramchandra Hankare',
    demoRoleText: 'District Health Officer (Pune)'
  }
];

const SUPPORTING_ROLES: RoleConfig[] = [
  {
    id: 'doctor',
    titles: {
      en: 'Specialist Medical Officer',
      mr: 'तज्ज्ञ डॉक्टर कन्सोल',
      hi: 'विशेषज्ञ चिकित्सा अधिकारी',
      or: 'ବିଶେଷଜ୍ଞ ଡାକ୍ତର',
      bn: 'বিশেষজ্ঞ চিকিৎসক কনসোল',
      ur: 'ماہر ڈاکٹر پورٹل'
    },
    badge: 'Hospital Specialist Hub',
    icon: Stethoscope,
    themeColor: 'blue',
    loginIdLabel: {
      en: 'MMC / MCI Medical Reg No or Phone',
      mr: 'एमएमसी नोंदणी क्रमांक किंवा मोबाईल',
      hi: 'एमएमसी मेडिकल पंजीकरण संख्या या फोन',
      or: 'ଡାକ୍ତରୀ ପଞ୍ଜୀକରଣ ନମ୍ବର',
      bn: 'মেডিকেল রেজিস্ট্রেশন নম্বর',
      ur: 'میڈیکل رجسٹریشن نمبر'
    },
    loginIdPlaceholder: 'e.g. MMC-2016-99410 or 9822411092',
    demoId: '9822411092',
    demoName: 'Dr. Rohini Kulkarni, MD',
    demoRoleText: 'Specialist Hub Consultant'
  },
  {
    id: 'cho',
    titles: {
      en: 'CHO Health Officer',
      mr: 'सीएचओ अधिकारी',
      hi: 'सीएचओ अधिकारी',
      or: 'ସିଏଚଓ ଅଧିକାରୀ',
      bn: 'সিএইচও কর্মকর্তা',
      ur: 'سی ایچ او افسر'
    },
    badge: 'Ayushman Arogya Mandir',
    icon: Stethoscope,
    themeColor: 'teal',
    loginIdLabel: {
      en: 'CHO Registration Number',
      mr: 'सीएचओ नोंदणी क्रमांक',
      hi: 'सीएचओ पंजीकरण संख्या',
      or: 'ସିଏଚଓ ପଞ୍ଜୀକରଣ ନମ୍ବର',
      bn: 'সিএইচও রেজিস্ট্রেশন নম্বর',
      ur: 'سی ایچ او رجسٹریشن نمبر'
    },
    loginIdPlaceholder: 'e.g. CHO-MH-8819 or 9422088312',
    demoId: '9422088312',
    demoName: 'Pooja Jadhav, CHO',
    demoRoleText: 'Sub-Centre Clinical Spoke'
  },
  {
    id: 'facility',
    titles: {
      en: 'Hospital Bed & 108 Command',
      mr: 'रुग्णालय खाटा व १०८ कक्ष',
      hi: 'अस्पताल बेड एवं 108 कमांड',
      or: 'ଡାକ୍ତରଖାନା ବେଡ୍ ପରିଚାଳନା',
      bn: 'হাসপাতাল বেড ও ১০৮ কমান্ড',
      ur: 'ہسپتال بیڈ اور 108 کمانڈ'
    },
    badge: 'Hospital Operations Command',
    icon: Building2,
    themeColor: 'indigo',
    loginIdLabel: {
      en: 'Hospital Code or Admin Mobile',
      mr: 'रुग्णालय कोड किंवा प्रशासकीय मोबाईल',
      hi: 'अस्पताल कोड या एडमिन मोबाइल',
      or: 'ଡାକ୍ତରଖାନା କୋଡ୍ କିମ୍ବା ମୋବାଇଲ୍',
      bn: 'হাসপাতাল কোড বা মোবাইল নম্বর',
      ur: 'ہسپتال کوڈ یا موبائل نمبر'
    },
    loginIdPlaceholder: 'e.g. FAC-PUN-0104 or 9422077182',
    demoId: '9422077182',
    demoName: 'Vinayak Shinde',
    demoRoleText: 'Hospital Bed Manager'
  },
  {
    id: 'pharmacist',
    titles: {
      en: 'Pharmacy & Drug Dispensary',
      mr: 'औषध वितरण अधिकारी',
      hi: 'फार्मेसी एवं दवा वितरण',
      or: 'ଫାର୍ମାସିଷ୍ଟ ପୋର୍ଟାଲ୍',
      bn: 'ফার্মাসি ও ওষুধ বিতরণ',
      ur: 'فارمیسی اور ادویات کی تقسیم'
    },
    badge: 'e-Aushadhi Stock Hub',
    icon: Layers,
    themeColor: 'emerald',
    loginIdLabel: {
      en: 'Pharmacy License / Mobile Number',
      mr: 'फार्मसी परवाना किंवा मोबाईल क्रमांक',
      hi: 'फार्मेसी लाइसेंस या मोबाइल नंबर',
      or: 'ଫାର୍ମାସି ଲାଇସେନ୍ସ ନମ୍ବର',
      bn: 'ফার্মেসি লাইসেন্স নম্বর',
      ur: 'فارمیسی لائسنس نمبر'
    },
    loginIdPlaceholder: 'e.g. PHARM-MH-9921 or 9823055412',
    demoId: '9823055412',
    demoName: 'Ganesh More',
    demoRoleText: 'Chief Pharmacist (Otur PHC)'
  },
  {
    id: 'lab',
    titles: {
      en: 'Diagnostic Wing & Pathology',
      mr: 'निदान प्रयोगशाळा तंत्रज्ञ',
      hi: 'डायग्नोस्टिक एवं पैथोलॉजी लैब',
      or: 'ଡାଇଗ୍ନୋଷ୍ଟିକ୍ ଲ୍ୟାବ୍ ପୋର୍ଟାଲ୍',
      bn: 'ডায়াগনস্টিক ও প্যাথলজি ল্যাব',
      ur: 'لیبارٹری اور پیتھالوجی'
    },
    badge: 'Diagnostic Lab Portal',
    icon: Activity,
    themeColor: 'purple',
    loginIdLabel: {
      en: 'Lab Technician ID / Mobile',
      mr: 'लॅब तंत्रज्ञ आयडी किंवा मोबाईल',
      hi: 'लैब तकनीशियन आईडी या मोबाइल',
      or: 'ଲ୍ୟାବ୍ ଆଇଡି କିମ୍ବା ମୋବାଇଲ୍',
      bn: 'ল্যাব টেকনিশিয়ান আইডি',
      ur: 'لیب ٹیکنیشن شناختی کارڈ'
    },
    loginIdPlaceholder: 'e.g. LAB-PUN-0881 or 9823066712',
    demoId: '9823066712',
    demoName: 'Sachin Kamble',
    demoRoleText: 'Senior Lab Technologist'
  }
];

const ALL_ROLES = [...PRIMARY_ROLES, ...SUPPORTING_ROLES];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: Role;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, targetRole = 'patient' }) => {
  const { setCurrentView, showToast, language } = useApp();
  const { setCurrentUser } = useHealthData();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>(targetRole);

  // Form Fields
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPin, setLoginPin] = useState<string>('4421');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Registration Fields
  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [district, setDistrict] = useState<string>('Pune');
  const [taluka, setTaluka] = useState<string>('Junnar');
  const [village, setVillage] = useState<string>('Khamgaon');
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [age, setAge] = useState<number>(32);
  const [hospitalName, setHospitalName] = useState<string>('');
  const [licenseNumber, setLicenseNumber] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const activeR = targetRole || 'patient';
      setSelectedRole(activeR);
      const cfg = ALL_ROLES.find(r => r.id === activeR) || PRIMARY_ROLES[0];
      setLoginIdentifier(cfg.demoId);
      setLoginPin('4421');
    }
  }, [isOpen, targetRole]);

  if (!isOpen) return null;

  const currentConfig = ALL_ROLES.find(r => r.id === selectedRole) || PRIMARY_ROLES[0];
  const Icon = currentConfig.icon;
  const currentTitle = currentConfig.titles[language] || currentConfig.titles.en;
  const currentLoginLabel = currentConfig.loginIdLabel[language] || currentConfig.loginIdLabel.en;

  const handle1ClickQuickLogin = (demoRole: RoleConfig) => {
    setSelectedRole(demoRole.id);
    setLoginIdentifier(demoRole.demoId);
    setLoginPin('4421');
    executeAuth(demoRole.demoId, demoRole.id);
  };

  const executeAuth = async (identifier: string, roleToAuth: Role) => {
    setIsLoading(true);
    try {
      const user = await setuDB.loginUser(identifier.trim(), roleToAuth);
      setCurrentUser(user);
      showToast(`Authenticated as ${user.fullName} (${user.designation}).`);
      setCurrentView(roleToAuth);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast(`Please enter your ${currentLoginLabel}.`);
      return;
    }
    executeAuth(loginIdentifier, selectedRole);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobileNumber.trim()) {
      showToast('Please fill in your full legal name and mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      if (selectedRole === 'patient') {
        const generatedAbha = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const newUser = await setuDB.signupUser({
          role: 'patient',
          username: mobileNumber.replace(/[\s-+]/g, ''),
          fullName: fullName.trim(),
          phone: mobileNumber.trim(),
          identifierNumber: generatedAbha,
          facilityName: `${village} Ayushman Arogya Mandir`,
          taluka,
          district,
          designation: 'Citizen (ABHA Verified)',
          avatarInitials: fullName.slice(0, 2).toUpperCase()
        });

        await setuDB.putItem('patients', {
          id: `pat-${Date.now()}`,
          abhaId: generatedAbha,
          name: fullName.trim(),
          age,
          gender,
          mobile: mobileNumber.trim(),
          village,
          taluka,
          district,
          category: gender === 'Female' && age < 40 ? 'Maternal ANC' : 'General OPD',
          riskLevel: 'Low',
          vitals: {
            bp: '120/80 mmHg',
            pulse: '72 bpm',
            spo2: '99%',
            temp: '98.4 °F',
            weight: '55 kg',
            lastRecordedAt: 'Just Now'
          },
          diagnoses: ['General Health Checkup'],
          allergies: [],
          assignedAsha: 'Manisha Kadam',
          assignedCho: 'Pooja Jadhav, CHO',
          activePrescriptions: [],
          recentLabReports: [],
          schemeEligibility: ['MJPJAY', 'PM-JAY'],
          createdAt: new Date().toISOString()
        });

        setCurrentUser(newUser);
        showToast(`ABHA Registered! Welcome ${newUser.fullName}.`);
        setCurrentView('patient');
        onClose();
      } else {
        const workerUser = await setuDB.signupUser({
          role: selectedRole,
          username: mobileNumber.replace(/[\s-+]/g, ''),
          fullName: fullName.trim(),
          phone: mobileNumber.trim(),
          identifierNumber: licenseNumber.trim() || `${selectedRole.toUpperCase()}-MH-${Math.floor(1000 + Math.random() * 9000)}`,
          facilityName: hospitalName.trim() || `${village} Ayushman Arogya Mandir`,
          taluka,
          district,
          designation: currentConfig.badge,
          avatarInitials: fullName.slice(0, 2).toUpperCase()
        });

        setCurrentUser(workerUser);
        showToast(`Account registered! Welcome to ${currentTitle}.`);
        setCurrentView(selectedRole);
        onClose();
      }
    } catch (err) {
      console.error(err);
      showToast('Registration failed. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with ABDM Trust Badge */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#003527] text-white flex items-center justify-center font-black shadow-md shrink-0">
              <Icon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {currentConfig.badge}
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  ABDM Verified
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                {currentTitle}
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Demonstration Login Banner */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-emerald-950 font-bold">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {language === 'mr' ? '१-क्लिक चाचणी प्रवेश:' : language === 'hi' ? '1-क्लिक फास्ट डेमो प्रवेश:' : language === 'or' ? '୧-କ୍ଲିକ୍ ଡେମୋ ପ୍ରବେଶ:' : language === 'bn' ? '১-ক্লিক ডেমো লগইন:' : language === 'ur' ? '1 کلک فاسٹ ڈیمو لاگ ان:' : '1-Click Fast Demo Login:'}
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 font-mono bg-emerald-100 px-2 py-0.5 rounded">PIN: 4421</span>
          </div>

          <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-200 text-xs">
            <div>
              <div className="font-extrabold text-slate-900">{currentConfig.demoName}</div>
              <div className="text-[11px] text-slate-500">{currentConfig.demoRoleText} • {currentConfig.demoId}</div>
            </div>
            <button
              onClick={() => handle1ClickQuickLogin(currentConfig)}
              disabled={isLoading}
              className="bg-[#003527] hover:bg-[#064e3b] text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1"
            >
              <span>{language === 'mr' ? 'थेट प्रवेश' : language === 'hi' ? 'सीधे लॉगिन' : language === 'or' ? 'ସିଧାସଳଖ ପ୍ରବେଶ' : language === 'bn' ? 'লগইন করুন' : language === 'ur' ? 'لاگ ان' : 'Sign In Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authMode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'mr' ? 'सुरक्षित भूमिका लॉगिन' : language === 'hi' ? 'सुरक्षित भूमिका लॉगिन' : language === 'or' ? 'ସୁରକ୍ଷିତ ଲଗଇନ୍' : language === 'bn' ? 'সুরক্ষিত লগইন' : language === 'ur' ? 'محفوظ لاگ ان' : 'Secure Role Login'}
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authMode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {selectedRole === 'patient' 
              ? (language === 'mr' ? 'नवीन आभा नोंदणी' : language === 'hi' ? 'नया आभा पंजीकरण' : language === 'or' ? 'ନୂତନ ଆଭା ପଞ୍ଜୀକରଣ' : language === 'bn' ? 'নতুন আভা রেজিস্ট্রেশন' : language === 'ur' ? 'نیا آبھا رجسٹریشن' : 'New ABHA Registration')
              : (language === 'mr' ? 'नवीन कर्मचारी नोंदणी' : language === 'hi' ? 'नया स्वास्थ्यकर्मी पंजीकरण' : language === 'or' ? 'ନୂତନ ପଞ୍ଜୀକରଣ' : language === 'bn' ? 'নতুন রেজিস্ট্রেশন' : language === 'ur' ? 'نیا رجسٹریشن' : 'New Health Worker Registration')}
          </button>
        </div>

        {/* LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {currentLoginLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={currentConfig.loginIdPlaceholder}
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-medium focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800">
                  {language === 'mr' ? 'सुरक्षा पिन' : language === 'hi' ? 'सुरक्षा पिन' : language === 'or' ? 'ସୁରକ୍ଷା ପିନ୍' : language === 'bn' ? 'সুরক্ষা পিন' : language === 'ur' ? 'سیکیورٹی پن' : 'Security PIN'}
                </label>
                <span className="text-[10px] text-emerald-800 font-mono font-bold">Demo Default: 4421</span>
              </div>
              <input
                type="password"
                placeholder="4-digit PIN (4421)"
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold tracking-widest focus:outline-none transition-colors"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#003527] hover:bg-[#064e3b] text-white font-black py-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating with ABDM...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>
                    {language === 'mr' ? 'प्रवेश करा व डॅशबोर्ड उघडा' : language === 'hi' ? 'प्रवेश करें एवं डैशबोर्ड खोलें' : language === 'or' ? 'ପ୍ରବେଶ କରନ୍ତୁ' : language === 'bn' ? 'ড্যাশবোর্ডে প্রবেশ করুন' : language === 'ur' ? 'ڈیش بورڈ کھولیں' : 'Authenticate & Open Dashboard'}
                  </span>
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTRATION FORM */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Full Legal Name (as on Aadhaar) *</label>
              <input
                type="text"
                placeholder="e.g. Sunita Ravindra Shinde"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Mobile Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+91 98XXX XXXXX"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                  required
                />
              </div>

              {selectedRole === 'patient' ? (
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Gender & Age</label>
                  <div className="flex gap-1.5">
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value, 10))}
                      className="w-16 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs font-bold text-slate-900 text-center"
                      min={1}
                      max={120}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="font-bold text-slate-800 block mb-1">License / Reg Number</label>
                  <input
                    type="text"
                    placeholder="e.g. MMC-2018-0912"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Taluka</label>
                <input
                  type="text"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Village / Town</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span>Registering on National ABDM Registry...</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-300" />
                  <span>
                    {selectedRole === 'patient' 
                      ? (language === 'mr' ? 'नोंदणी पूर्ण करा व आभा मिळवा' : language === 'hi' ? 'पंजीकरण पूरा करें एवं आभा प्राप्त करें' : language === 'or' ? 'ପଞ୍ଜୀକରଣ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ' : language === 'bn' ? 'রেজিস্ট্রেশন সম্পন্ন করুন' : language === 'ur' ? 'رجسٹریشن مکمل کریں' : 'Complete Registration & Generate ABHA')
                      : (language === 'mr' ? 'आरोग्य कर्मचारी नोंदणी पूर्ण करा' : language === 'hi' ? 'स्वास्थ्यकर्मी पंजीकरण पूरा करें' : language === 'or' ? 'କର୍ମୀ ପଞ୍ଜୀକରଣ କରନ୍ତୁ' : language === 'bn' ? 'কর্মী রেজিস্ট্রেশন করুন' : language === 'ur' ? 'ہیلتھ ورکر رجسٹریشن مکمل کریں' : 'Complete Healthcare Worker Registration')}
                  </span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
