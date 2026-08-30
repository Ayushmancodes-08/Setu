import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { bhashiniAI } from '../../services/bhashiniService';
import { Appointment } from '../../types';
import { VideoConsultationRoom } from '../video/VideoConsultationRoom';
import { LabTestBookingModal } from '../modals/LabTestBookingModal';
import { UploadReportModal } from '../modals/UploadReportModal';
import { EditProfileModal } from '../modals/EditProfileModal';
import { 
  User, 
  Heart, 
  Activity, 
  Pill, 
  FileText, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Volume2, 
  Mic, 
  Sparkles, 
  Search, 
  ArrowRight, 
  Send, 
  Baby, 
  Smile, 
  Eye, 
  ChevronRight, 
  X, 
  QrCode, 
  Clock, 
  HelpCircle, 
  Plus, 
  Navigation, 
  Upload, 
  Share2, 
  AlertTriangle,
  Flame,
  Smartphone,
  Video,
  Stethoscope,
  VideoOff,
  MicOff,
  UserCheck,
  FileCheck
} from 'lucide-react';

const AVAILABLE_DOCTORS = [
  {
    id: 'doc-001',
    name: 'Dr. Rohini Kulkarni, MD',
    specialty: 'Obstetrics & High-Risk Pregnancy',
    degree: 'MBBS, MD (OBGYN)',
    facility: 'Junnar Rural Hospital Telemedicine Hub',
    experience: '12 Years',
    availableSlots: ['11:30 AM - 12:00 PM', '02:00 PM - 02:30 PM', '04:30 PM - 05:00 PM'],
    teleconsultReady: true
  },
  {
    id: 'doc-002',
    name: 'Dr. Sandeep Ghule, MBBS',
    specialty: 'General Medicine & Chronic Care',
    degree: 'MBBS, DNB (Fam. Med)',
    facility: 'Otur Primary Health Centre (PHC)',
    experience: '8 Years',
    availableSlots: ['10:00 AM - 10:30 AM', '12:00 PM - 12:30 PM', '03:00 PM - 03:30 PM'],
    teleconsultReady: true
  },
  {
    id: 'doc-003',
    name: 'Dr. Swapnil Deshmukh, MS',
    specialty: 'General Surgery & Trauma Resuscitation',
    degree: 'MBBS, MS (General Surgery)',
    facility: 'Junnar Trauma & Specialty Hospital',
    experience: '15 Years',
    availableSlots: ['01:30 PM - 02:00 PM', '05:00 PM - 05:30 PM'],
    teleconsultReady: true
  },
  {
    id: 'doc-004',
    name: 'Dr. Priyanka Patil, MD',
    specialty: 'Pediatrics & Neonatal Care',
    degree: 'MBBS, MD (Pediatrics)',
    facility: 'Manchar Sub-District Hospital',
    experience: '9 Years',
    availableSlots: ['09:30 AM - 10:00 AM', '11:00 AM - 11:30 AM'],
    teleconsultReady: true
  }
];

export const PatientPortal: React.FC = () => {
  const { language, t, showToast, setIsEmergencyModalOpen, setCurrentView } = useApp();
  const { 
    patients, 
    facilities, 
    updatePatientVitals, 
    appointments, 
    bookAppointment, 
    cancelAppointment,
    currentUser,
    diagnosticOrders
  } = useHealthData();

  // Active patient profile dynamically mapped from currentUser
  const patient: any = (currentUser && patients.find(p => 
    (currentUser.identifierNumber && p.abhaId === currentUser.identifierNumber) ||
    (currentUser.phone && p.mobile.replace(/[\s-+]/g, '') === currentUser.phone.replace(/[\s-+]/g, '')) ||
    (currentUser.fullName && p.name.toLowerCase() === currentUser.fullName.toLowerCase())
  )) || (currentUser && currentUser.fullName.toLowerCase().includes('sunita') ? patients.find(p => p.name.toLowerCase().includes('sunita')) : null) || patients.find(p => p.name.toLowerCase().includes('rajesh')) || patients[0] || {
    id: 'p-001',
    name: currentUser?.fullName || 'Rajesh Kumar Shinde',
    age: 47,
    gender: 'Male',
    abhaId: currentUser?.identifierNumber || '91-8841-2091-7741',
    village: currentUser?.village || 'Khamgaon',
    taluka: currentUser?.taluka || 'Junnar',
    district: currentUser?.district || 'Pune',
    mobile: currentUser?.phone || '+91 98230 44512',
    bloodGroup: 'B+',
    allergies: 'None reported',
    chronicConditions: 'Hypertension',
    assignedAsha: 'Manisha Kadam, ASHA (+91 98230 44512)',
    vitals: {
      bp: '138/86 mmHg',
      pulse: '76 bpm',
      spo2: '98%',
      temp: '98.4 °F',
      weight: '68 kg'
    },
    activePrescriptions: [
      {
        id: 'rx-1',
        medicineName: 'Amlodipine 5mg Tablets',
        dosage: '1 Tab (5mg)',
        frequency: '1-0-0 (Morning with breakfast)',
        duration: '30 Days',
        instructions: 'Take daily after breakfast. Do not miss doses.',
        prescribedBy: 'Dr. Rohini Kulkarni, MD',
        prescribedAt: 'Yesterday, 10:15 AM',
        status: 'Dispensed' as const
      },
      {
        id: 'rx-2',
        medicineName: 'Telmisartan 40mg Tablets',
        dosage: '1 Tab (40mg)',
        frequency: '0-0-1 (Night after dinner)',
        duration: '30 Days',
        instructions: 'Take with warm water before sleep.',
        prescribedBy: 'Dr. Rohini Kulkarni, MD',
        prescribedAt: 'Yesterday, 10:15 AM',
        status: 'Dispensed' as const
      }
    ],
    recentLabReports: [
      {
        id: 'lab-1',
        testName: 'Lipid Profile & Serum Cholesterol',
        result: 'Total Cholesterol: 182 mg/dL',
        referenceRange: '125 - 200 mg/dL (Normal Range)',
        status: 'Normal' as const,
        reportedAt: '2 days ago',
        explanation: 'Your cholesterol is within the normal reference range. Continue balanced diet and physical activity.'
      },
      {
        id: 'lab-2',
        testName: 'Fasting Blood Glucose (FBS)',
        result: 'Blood Sugar: 104 mg/dL',
        referenceRange: '70 - 100 mg/dL (Borderline)',
        status: 'Borderline' as const,
        reportedAt: '2 days ago',
        explanation: 'Slightly borderline fasting sugar. Recommended to monitor dietary sugar and recheck in 3 months.'
      }
    ]
  };

  const [activeModule, setActiveModule] = useState<'dashboard' | 'appointments' | 'medications' | 'reports' | 'healthcare' | 'schemes' | 'women_child' | 'chronic' | 'wellbeing' | 'emergency' | 'timeline'>('dashboard');
  const [elderlyMode, setElderlyMode] = useState<boolean>(false);
  const [showFullProfile, setShowFullProfile] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Setu AI Conversational Guidance State
  const [aiQuery, setAiQuery] = useState<string>('');
  const [isAiListening, setIsAiListening] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<{
    guidance: string;
    severity: 'LOW' | 'MODERATE' | 'URGENT';
    actionText: string;
    escalateToAsha: boolean;
  } | null>(null);

  // Lab Test Booking Modal State
  const [isLabBookingOpen, setIsLabBookingOpen] = useState<boolean>(false);
  const [labPrefillTestId, setLabPrefillTestId] = useState<string | undefined>(undefined);

  // Appointment Booking Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState(AVAILABLE_DOCTORS[0]);
  const [aptDate, setAptDate] = useState<string>('Today');
  const [aptTimeSlot, setAptTimeSlot] = useState<string>('11:30 AM - 12:00 PM');
  const [aptMode, setAptMode] = useState<'TELECONSULTATION' | 'IN_PERSON_OPD'>('TELECONSULTATION');
  const [aptComplaint, setAptComplaint] = useState<string>('Routine health follow-up & prescription refill review.');
  
  // Live Teleconsultation Video Room State
  const [activeVideoApt, setActiveVideoApt] = useState<Appointment | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);

  // Chronic BP Logger State
  const [newSystolic, setNewSystolic] = useState<string>('138');
  const [newDiastolic, setNewDiastolic] = useState<string>('86');
  const [newGlucose, setNewGlucose] = useState<string>('104');

  // Scheme Need Filter State
  const [selectedSchemeNeed, setSelectedSchemeNeed] = useState<string>('ALL');

  // Wellbeing Mood State
  const [currentMood, setCurrentMood] = useState<string>('Calm');

  // Audio readout state
  const [speakingItem, setSpeakingItem] = useState<string | null>(null);

  // Mock Emergency Contact
  const emergencyContacts = [
    { name: 'Sunita Shinde (Spouse)', relation: 'Spouse', phone: '+91 98221 00192' },
    { name: 'Manisha Kadam (Assigned ASHA)', relation: 'Village ASHA Worker', phone: '+91 98230 44512' },
    { name: 'Dr. Sandeep Ghule (MO Otur PHC)', relation: 'Primary Health Centre Doctor', phone: '+91 2132 264222' }
  ];

  const handleAiConsult = (queryText: string) => {
    if (!queryText.trim()) return;
    
    // BHASHINI Architecture: Speech/Text -> Lang Detect -> Setu Triage -> Translation -> TTS
    const triage = bhashiniAI.runPatientVoiceTriagePipeline(queryText, language);
    
    setAiResponse({
      guidance: triage.triageGuidance,
      severity: triage.severity,
      actionText: triage.suggestedAction,
      escalateToAsha: triage.escalateToAsha
    });

    setAiQuery('');
    
    // Automatically synthesize voice output in user language
    bhashiniAI.tts(triage.triageGuidance, triage.detectedLanguage);
  };

  const handleVoiceInput = () => {
    setIsAiListening(true);
    bhashiniAI.asr(
      language,
      (transcript) => {
        setAiQuery(transcript);
        handleAiConsult(transcript);
      },
      (err) => {
        console.warn('ASR notice:', err);
      },
      () => {
        setIsAiListening(false);
      }
    );
  };

  const handleSpeakText = (text: string, id: string) => {
    setSpeakingItem(id);
    bhashiniAI.tts(text, language, () => {
      setSpeakingItem(null);
    });
  };

  const handleLogVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (updatePatientVitals) {
      updatePatientVitals(patient.id, {
        bp: `${newSystolic}/${newDiastolic} mmHg`,
        pulse: patient.vitals.pulse,
        spo2: patient.vitals.spo2,
        temp: patient.vitals.temp,
        weight: patient.vitals.weight
      });
    }
    showToast(`Recorded new vitals: BP ${newSystolic}/${newDiastolic} mmHg.`);
  };

  const handleBookAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newApt = await bookAppointment({
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientVillage: patient.village,
      patientMobile: patient.mobile,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      facilityName: selectedDoctor.facility,
      appointmentDate: aptDate,
      timeSlot: aptTimeSlot,
      mode: aptMode,
      complaint: aptComplaint
    });

    showToast(`Appointment Confirmed with ${selectedDoctor.name}! Token #${newApt.appointmentToken}`);
    setIsBookModalOpen(false);
    setActiveModule('appointments');
  };

  const handleCancelApt = async (aptId: string) => {
    await cancelAppointment(aptId);
    showToast('Appointment cancelled successfully.');
  };

  return (
    <div className={`min-h-screen ${elderlyMode ? 'bg-amber-50/40 text-slate-950 text-base' : 'bg-slate-50 text-slate-900'} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Accessibility & Elder Mode Toggle Bar */}
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold">
          <div className="flex items-center gap-2 text-slate-600">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>Setu Citizen Health Companion • Rural Access Mode</span>
          </div>
          <button
            onClick={() => setElderlyMode(!elderlyMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              elderlyMode ? 'bg-amber-600 text-white border-amber-700 shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{elderlyMode ? t.standardModeToggle : t.elderModeToggle}</span>
          </button>
        </div>

        {/* 1. HEALTH PROFILE CARD (AT THE TOP) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-700 to-[#003527] text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
                {patient.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className={`${elderlyMode ? 'text-2xl font-black' : 'text-xl font-extrabold'} text-slate-900`}>{patient.name}</h1>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                    ABHA Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Village: <strong>{patient.village}</strong> • Age: <strong>{patient.age}y</strong> ({patient.gender}) • ABHA: <span className="font-mono font-bold text-slate-700">{patient.abhaId}</span>
                </p>
              </div>
            </div>

            {/* Health Status Indicator & Quick Book CTA */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2.5 rounded-2xl text-xs border border-slate-300 transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Edit Profile</span>
              </button>

              <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Health Status</span>
                <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  🟢 Stable (Active Care)
                </span>
              </div>

              <button
                onClick={() => setIsBookModalOpen(true)}
                className="bg-[#003527] hover:bg-[#064e3b] text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Doctor Appointment</span>
              </button>
            </div>

          </div>

          {/* Quick Health Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
              <span className="font-black text-slate-900 text-sm">{patient.bloodGroup || 'B+'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Allergies</span>
              <span className="font-bold text-slate-800 text-sm">{patient.allergies || 'None reported'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Chronic Conditions</span>
              <span className="font-bold text-amber-800 text-sm">{patient.chronicConditions || 'Hypertension'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned ASHA / CHO</span>
              <span className="font-bold text-teal-900 text-xs truncate block">{patient.assignedAsha || 'Manisha Kadam (+91 98230 44512)'}</span>
            </div>
          </div>
        </div>

        {/* 2. 🤖 SETU AI HEALTH ASSISTANT (CONVERSATIONAL GUIDANCE) */}
        <div className="bg-gradient-to-br from-[#003527] to-[#04241b] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/80 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-emerald-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-white">Setu AI Health Guidance</h3>
                <p className="text-xs text-emerald-300/80">
                  Ask symptoms in your own words (Marathi / Hindi / English) or speak via microphone.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full">
              Multilingual Voice Assistant
            </span>
          </div>

          {/* Voice & Input Box */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleVoiceInput}
              className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 ${
                isAiListening ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isAiListening ? 'Listening...' : '🎤 Speak to Setu'}</span>
            </button>

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Type symptoms (e.g. want to consult doctor for headache and medication check)..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiConsult(aiQuery)}
                className="w-full bg-slate-900/80 border border-emerald-700/80 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
              />
              <button
                onClick={() => handleAiConsult(aiQuery)}
                className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-3 rounded-2xl text-xs transition-colors shrink-0 flex items-center gap-1"
              >
                <span>Ask</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* AI Guidance Output Card */}
          {aiResponse && (
            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-5 space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  aiResponse.severity === 'URGENT' ? 'bg-red-900 text-red-200 border border-red-500' :
                  aiResponse.severity === 'MODERATE' ? 'bg-amber-900 text-amber-200 border border-amber-500' :
                  'bg-emerald-900 text-emerald-200 border border-emerald-500'
                }`}>
                  Triage Severity: {aiResponse.severity}
                </span>

                <button
                  onClick={() => handleSpeakText(aiResponse.guidance, 'ai-guidance')}
                  className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 font-bold"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen in Audio</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {aiResponse.guidance}
              </p>

              <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/80 text-xs text-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Suggested Next Action:</strong> {aiResponse.actionText}</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Doctor Teleconsult</span>
                </button>
                {aiResponse.escalateToAsha && (
                  <button
                    onClick={() => showToast('Escalation notification dispatched to ASHA Manisha Kadam.')}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
                  >
                    📞 Request ASHA Check-in
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mandated Medical Disclaimer */}
          <div className="text-[11px] text-emerald-300/70 border-t border-emerald-800/60 pt-3 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span><strong>Medical Disclaimer:</strong> AI guidance is for general health education and basic triage assistance only. It does not replace a qualified healthcare professional.</span>
          </div>
        </div>

        {/* 3. PATIENT MODULE TABS BAR */}
        <div className="flex border-b border-slate-200 gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
          {[
            { id: 'dashboard', label: '📊 Health Overview', icon: Activity },
            { id: 'appointments', label: `📅 Doctor Appointments (${appointments.length})`, icon: Calendar },
            { id: 'medications', label: '💊 Medicines & Reminders', icon: Pill },
            { id: 'reports', label: '🧪 Understand Reports', icon: FileText },
            { id: 'healthcare', label: '🏥 Find Healthcare', icon: MapPin },
            { id: 'schemes', label: '🛡️ Government Schemes', icon: ShieldCheck },
            { id: 'women_child', label: '👩 Women & Child Care', icon: Baby },
            { id: 'chronic', label: '💗 Chronic Care (BP/Sugar)', icon: Heart },
            { id: 'wellbeing', label: '🧠 Wellbeing Check-in', icon: Smile },
            { id: 'emergency', label: '🚨 Emergency SOS', icon: PhoneCall },
            { id: 'timeline', label: '📋 Health Timeline', icon: Activity }
          ].map((tab) => {
            const isActive = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#003527] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
          {/* Special action button — Lab Test Booking */}
          <button
            onClick={() => { setLabPrefillTestId(undefined); setIsLabBookingOpen(true); }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap bg-purple-700 hover:bg-purple-800 text-white shadow-xs border border-purple-800 font-bold"
          >
            <span>🧪 Book Lab Test</span>
          </button>
        </div>

        {/* MODULE 1: HEALTH OVERVIEW DASHBOARD */}
        {activeModule === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left: Vitals & Care Reminders */}
            <div className="md:col-span-2 space-y-4">
              
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900">Upcoming Appointments & Care Timeline</h3>
                  <button
                    onClick={() => setIsBookModalOpen(true)}
                    className="text-xs text-emerald-800 font-bold hover:underline"
                  >
                    + Book New Consult
                  </button>
                </div>

                <div className="space-y-3">
                  {appointments.slice(0, 2).map((apt) => (
                    <div key={apt.id} className="bg-teal-50 border border-teal-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-teal-600 text-white font-bold">
                          {apt.mode === 'TELECONSULTATION' ? <Video className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-slate-900">{apt.doctorName}</span>
                            <span className="bg-teal-200 text-teal-900 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                              {apt.appointmentToken}
                            </span>
                          </div>
                          <div className="text-slate-600 mt-0.5">
                            {apt.doctorSpecialty} • <strong>{apt.appointmentDate} at {apt.timeSlot}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {apt.mode === 'TELECONSULTATION' && (
                          <button
                            onClick={() => setActiveVideoApt(apt)}
                            className="flex-1 sm:flex-none bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join Video Room</span>
                          </button>
                        )}
                        <button
                          onClick={() => setActiveModule('appointments')}
                          className="bg-white hover:bg-slate-100 text-slate-800 font-bold py-2 px-3 rounded-xl border border-slate-300 transition-colors text-xs"
                        >
                          View Pass
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Vitals Trend Summary */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900">Recent Health Parameters</h3>
                  <button onClick={() => setActiveModule('chronic')} className="text-xs text-teal-800 font-bold hover:underline">
                    Log New Reading →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                    <span className="font-black text-slate-900 text-sm">{patient.vitals.bp}</span>
                    <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">🟡 Controlled</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Pulse Rate</span>
                    <span className="font-black text-slate-900 text-sm">{patient.vitals.pulse}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">🟢 Normal</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Oxygen (SpO2)</span>
                    <span className="font-black text-emerald-700 text-sm">{patient.vitals.spo2}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">🟢 Optimal</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Body Temp</span>
                    <span className="font-black text-slate-900 text-sm">{patient.vitals.temp}</span>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Normal</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Quick Contacts & Help Desk */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-base text-slate-900">Your Healthcare Contacts</h3>
                
                <div className="space-y-2 text-xs">
                  {emergencyContacts.map((contact, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{contact.name}</div>
                        <div className="text-[11px] text-slate-500">{contact.relation}</div>
                      </div>
                      <a
                        href={`tel:${contact.phone}`}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-colors"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Tap Emergency Trigger */}
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-red-950 font-black">
                  <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce" />
                  <span>Immediate Medical Emergency?</span>
                </div>
                <p className="text-xs text-red-900">
                  Notify emergency services, your family contacts, and village health worker in 1 tap.
                </p>
                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Launch Emergency SOS</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* MODULE: DOCTOR APPOINTMENTS & TELECONSULTATION */}
        {activeModule === 'appointments' && (
          <div className="space-y-6">
            
            {/* Header & Quick Action */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  e-Sanjeevani Integrated
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 mt-1">Doctor Appointments & Teleconsultations</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Book online video teleconsults or in-person OPD appointments with government specialist doctors.
                </p>
              </div>

              <button
                onClick={() => setIsBookModalOpen(true)}
                className="bg-[#003527] hover:bg-[#064e3b] text-white font-black text-xs py-3 px-5 rounded-2xl transition-all shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Book New Appointment</span>
              </button>
            </div>

            {/* My Active Appointments List */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h4 className="font-black text-sm text-slate-900 uppercase tracking-wider">Your Scheduled Appointments ({appointments.length})</h4>
              
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-slate-900">{apt.doctorName}</span>
                        <span className="bg-teal-100 text-teal-900 font-mono text-xs px-2.5 py-0.5 rounded-full font-bold border border-teal-200">
                          {apt.appointmentToken}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          apt.status === 'COMPLETED' ? 'bg-slate-200 text-slate-700' : 'bg-red-100 text-red-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        Specialty: <strong>{apt.doctorSpecialty}</strong> • Facility: <strong>{apt.facilityName}</strong>
                      </p>

                      <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 flex flex-wrap gap-4">
                        <span>🗓️ Date: <strong>{apt.appointmentDate}</strong></span>
                        <span>⏰ Time Slot: <strong>{apt.timeSlot}</strong></span>
                        <span>Mode: <strong>{apt.mode === 'TELECONSULTATION' ? '📹 Video Teleconsult' : '🏥 In-Person OPD'}</strong></span>
                      </div>

                      {apt.complaint && (
                        <p className="text-[11px] text-slate-500">
                          <strong>Reason / Symptoms:</strong> {apt.complaint}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      {apt.mode === 'TELECONSULTATION' && apt.status !== 'CANCELLED' && (
                        <button
                          onClick={() => setActiveVideoApt(apt)}
                          className="flex-1 md:flex-none bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join Video Teleconsult</span>
                        </button>
                      )}

                      {apt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancelApt(apt.id)}
                          className="bg-white hover:bg-red-50 text-red-700 font-bold py-2.5 px-3 rounded-xl border border-red-200 transition-colors text-xs"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Doctors Roster */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h4 className="font-black text-sm text-slate-900 uppercase tracking-wider">Available Government Specialist Doctors</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_DOCTORS.map((doc) => (
                  <div key={doc.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-extrabold text-sm text-slate-900">{doc.name}</h5>
                          <p className="text-xs text-emerald-800 font-semibold">{doc.specialty}</p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          Available Today
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {doc.degree} • {doc.facility} ({doc.experience} Exp)
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setIsBookModalOpen(true);
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Slot with {doc.name.split(' ')[1]}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* MODULE 3: MEDICATIONS & REMINDERS */}
        {activeModule === 'medications' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Your Active Medications & Schedule</h3>
                <p className="text-xs text-slate-500">Track doses, set reminders, and verify safety instructions.</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-xl">
                2 Active Prescriptions
              </span>
            </div>

            {/* Medication Safety Badge */}
            <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs text-teal-950">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span><strong>Medication Safety Verification:</strong> No known interaction or allergy conflicts detected between your active medications.</span>
            </div>

            {/* Prescriptions List */}
            <div className="divide-y divide-slate-100">
              {patient.activePrescriptions.map((rx: any) => (
                <div key={rx.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">{rx.medicineName}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {rx.dosage}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Schedule: <strong>{rx.frequency}</strong> • Duration: <strong>{rx.duration}</strong>
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong>Instructions:</strong> {rx.instructions}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSpeakText(`${rx.medicineName}. ${rx.instructions}`, rx.id)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Listen in Marathi/English"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                      <span>Audio Guide</span>
                    </button>
                    <button
                      onClick={() => showToast(`Dose logged for ${rx.medicineName}. Adherence recorded.`)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3.5 rounded-xl text-xs transition-colors"
                    >
                      ✓ Mark Taken
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 4: UNDERSTAND YOUR REPORT (LABS) */}
        {activeModule === 'reports' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Understand Your Diagnostic Reports</h3>
                <p className="text-xs text-slate-500">Plain-language explanation of laboratory findings and reference values.</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-[#003527] hover:bg-[#064e3b] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patient.recentLabReports.map((lab: any) => (
                <div key={lab.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-extrabold text-sm text-slate-900">{lab.testName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lab.status === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {lab.status}
                      </span>
                    </div>

                    <div className="text-xs bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <div className="font-black text-slate-900">{lab.result}</div>
                      <div className="text-[11px] text-slate-500">Reference: {lab.referenceRange}</div>
                    </div>

                    <div className="text-xs text-slate-700 bg-teal-50/60 p-3 rounded-xl border border-teal-100 leading-relaxed font-medium">
                      <strong>What this means:</strong> {lab.explanation}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400">{lab.reportedAt}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast(`Report shared with ASHA Manisha Kadam for follow-up review.`)}
                        className="text-[11px] text-teal-800 hover:text-teal-900 font-bold flex items-center gap-1"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Share</span>
                      </button>
                      <button
                        onClick={() => { setLabPrefillTestId(undefined); setIsLabBookingOpen(true); }}
                        className="bg-purple-700 hover:bg-purple-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                      >
                        🔁 Book Repeat Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Booked Lab Tests Tracking List */}
            <div className="bg-purple-50/60 border border-purple-200 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-200 text-purple-800 flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-purple-950">Your Booked Lab Tests & Orders</h4>
                    <p className="text-[11px] text-purple-700">Real-time status of scheduled sample collections & laboratory processing</p>
                  </div>
                </div>
                <span className="bg-purple-200 text-purple-900 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {diagnosticOrders.length > 0 ? `${diagnosticOrders.length} Active Orders` : '1 Scheduled'}
                </span>
              </div>

              <div className="space-y-2.5">
                {diagnosticOrders.length > 0 ? (
                  diagnosticOrders.map((order) => (
                    <div key={order.id} className="bg-white p-4 rounded-2xl border border-purple-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900">{order.testName}</span>
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                            {order.orderNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Facility: <strong>{order.facility}</strong> • Sample: {order.sampleType}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          order.sampleStatus === 'Validated' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {order.sampleStatus || 'Sample Collection Scheduled'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">Complete Blood Count (CBC) + ESR</span>
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                          LAB-2026-8821
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Facility: <strong>Junnar Rural Hospital Diagnostic Wing</strong> • Home Phlebotomist: <strong>Rahul Deshmukh</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" />
                        <span>Home Collection: Tomorrow 08:30 AM</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Book new test CTA */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="font-black text-sm text-purple-900">Need a new lab test?</div>
                <p className="text-xs text-purple-700 mt-0.5">Compare prices & distance across 5 nearby diagnostic centers. Free tests under JSSK/MJPJAY highlighted.</p>
              </div>
              <button
                onClick={() => { setLabPrefillTestId(undefined); setIsLabBookingOpen(true); }}
                className="shrink-0 bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-purple-700/20"
              >
                🧪 Book Lab Test
              </button>
            </div>
          </div>
        )}

        {/* MODULE 5: HEALTHCARE ACCESS & NEARBY FACILITIES */}
        {activeModule === 'healthcare' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Nearby Public Health Facilities & Centres</h3>
              <p className="text-xs text-slate-500">Operating hours, distance, and contact details for Government Health Centres.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Primary Health Centre</span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-1">Otur Primary Health Centre (PHC)</h4>
                    <p className="text-xs text-slate-500">2.4 km away • Open 24/7 • Government Facility</p>
                  </div>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Services: <strong>OPD, Normal Delivery, Malaria/Dengue Lab, e-Sanjeevani</strong></div>
                  <div>Medical Officer: <strong>Dr. Sandeep Ghule (MBBS)</strong></div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                  <a
                    href="tel:+912132264222"
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs text-center transition-colors"
                  >
                    Call Facility
                  </a>
                  <button
                    onClick={() => showToast('Directions to Otur PHC mapped (2.4 km via Junnar-Otur Rd).')}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl text-xs text-center border border-slate-300 transition-colors"
                  >
                    Directions
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Sub-District Rural Hospital</span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-1">Junnar Rural Hospital & Trauma Hub</h4>
                    <p className="text-xs text-slate-500">8.7 km away • Open 24/7 • Specialty Hub</p>
                  </div>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>Services: <strong>Trauma Resuscitation, Surgery, Blood Storage, High-Risk ANC</strong></div>
                  <div>Contact: <strong>+91 2132 222108</strong></div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                  <a
                    href="tel:+912132222108"
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs text-center transition-colors"
                  >
                    Call Facility
                  </a>
                  <button
                    onClick={() => showToast('Directions to Junnar Rural Hospital mapped (8.7 km).')}
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl text-xs text-center border border-slate-300 transition-colors"
                  >
                    Directions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 6: GOVERNMENT SCHEME DISCOVERY */}
        {activeModule === 'schemes' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Government Health Schemes & Cashless Support</h3>
              <p className="text-xs text-slate-500">Select what support you need to view eligible state and national health programs.</p>
            </div>

            {/* Need-Based Quick Filters */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Which support do you need?</span>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                {[
                  { id: 'ALL', label: 'All Schemes' },
                  { id: 'HOSPITAL', label: '🏥 Hospital Treatment' },
                  { id: 'MEDICINE', label: '💊 Free Medicines' },
                  { id: 'LABS', label: '🧪 Diagnostic Tests' },
                  { id: 'MATERNAL', label: '👩 Maternal Care' },
                  { id: 'CHILD', label: '👶 Child Healthcare' },
                  { id: 'DISABILITY', label: '♿ Disability Support' }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setSelectedSchemeNeed(btn.id)}
                    className={`px-3.5 py-2 rounded-xl transition-all ${
                      selectedSchemeNeed === btn.id ? 'bg-[#003527] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Schemes Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">₹5 Lakh Cashless</span>
                  <span className="text-[10px] text-slate-400 font-mono">National Scheme</span>
                </div>
                <h4 className="font-black text-sm text-slate-900">Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY / PM-JAY)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cashless secondary and tertiary hospital treatment up to ₹5,00,000 per family per year at empaneled government and private hospitals.
                </p>
                <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div><strong>Required Documents:</strong> Ration Card (Yellow/Orange) + Aadhaar Card</div>
                  <div><strong>Eligibility:</strong> All rural residents holding verified ABHA / Ration card</div>
                </div>
                <button
                  onClick={() => showToast('MJPJAY Pre-authorization guidance initiated with ASHA.')}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                >
                  Check Eligibility & Apply with ASHA
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">Maternal Benefit</span>
                  <span className="text-[10px] text-slate-400 font-mono">100% Free Deliveries</span>
                </div>
                <h4 className="font-black text-sm text-slate-900">Janani Shishu Suraksha Karyakram (JSSK)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Completely free institutional delivery, C-section, free diagnostics, drugs, food, and free transport for mother and newborn up to 1 year.
                </p>
                <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div><strong>Required Documents:</strong> MCP Mother & Child Card + Bank Passbook</div>
                  <div><strong>Eligibility:</strong> All pregnant mothers in rural government hospitals</div>
                </div>
                <button
                  onClick={() => showToast('JSSK registration verified in your Mother & Child file.')}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                >
                  View JSSK Mother Benefit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 7: WOMEN & CHILD HEALTH */}
        {activeModule === 'women_child' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Women & Child Health Tracker</h3>
              <p className="text-xs text-slate-500">Maternal ANC milestones, child vaccination schedule, and nutrition monitoring.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Maternal Health */}
              <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-5 space-y-3">
                <h4 className="font-black text-sm text-rose-950 flex items-center gap-1.5">
                  <Baby className="w-4 h-4 text-rose-600" />
                  <span>Maternal ANC Journey</span>
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="bg-white p-3 rounded-xl border border-rose-100 flex items-center justify-between">
                    <span>1st Trimester Vitals & Hb Test</span>
                    <span className="text-emerald-700 font-bold">✓ Completed</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-100 flex items-center justify-between">
                    <span>2nd Trimester Ultrasound Scan</span>
                    <span className="text-emerald-700 font-bold">✓ Completed</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-100 flex items-center justify-between">
                    <span>3rd Trimester Hemoglobin & BP Check</span>
                    <span className="text-amber-700 font-bold">Due Next Week</span>
                  </div>
                </div>
              </div>

              {/* Child Immunization Schedule */}
              <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-5 space-y-3">
                <h4 className="font-black text-sm text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>National Immunization Schedule</span>
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <span>BCG, OPV-0, Hepatitis B (Birth)</span>
                    <span className="text-emerald-700 font-bold">✓ Up to date</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <span>Pentavalent-1 + Rota-1 (6 Weeks)</span>
                    <span className="text-emerald-700 font-bold">✓ Up to date</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <span>Measles-Rubella (MR-1) (9 Months)</span>
                    <span className="text-blue-700 font-bold">Scheduled at PHC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 8: CHRONIC DISEASE (BP & SUGAR LOG) */}
        {activeModule === 'chronic' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Chronic Care Monitoring (Hypertension & Diabetes)</h3>
                <p className="text-xs text-slate-500">Record home readings, observe trends, and receive lifestyle alerts.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Vitals Form */}
              <form onSubmit={handleLogVitals} className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-black text-sm text-slate-900">Log New Daily Reading</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={newSystolic}
                      onChange={(e) => setNewSystolic(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={newDiastolic}
                      onChange={(e) => setNewDiastolic(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fasting Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    value={newGlucose}
                    onChange={(e) => setNewGlucose(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs"
                >
                  Save Reading to Record
                </button>
              </form>

              {/* Trend Visualizer */}
              <div className="lg:col-span-7 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-black text-sm text-slate-900">7-Day Blood Pressure Trend</h4>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Mon: 136/88</span>
                    <span>Tue: 140/90</span>
                    <span>Wed: 138/86</span>
                    <span>Thu: 135/84</span>
                    <span className="font-bold text-slate-900">Today: {patient.vitals.bp}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                  <p className="text-[11px] text-slate-600 pt-1">
                    Your blood pressure readings have remained stable this week. Continue morning Amlodipine dose.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 9: WELLBEING CHECK-IN */}
        {activeModule === 'wellbeing' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Mental Wellbeing & Stress Check-in</h3>
              <p className="text-xs text-slate-500">Discreet self-care support, breathing exercises, and village health worker check-in.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">How are you feeling today?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                  {['Peaceful / Calm', 'Slightly Stressed', 'Tired / Fatigued', 'Need to Talk'].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setCurrentMood(m);
                        showToast(`Mood noted: ${m}. Showing personalized relaxation tips.`);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        currentMood === m ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-500/20' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2-Minute Breathing Guide */}
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 space-y-2 text-xs text-teal-950">
                <h4 className="font-black text-sm text-teal-900">2-Minute Deep Breathing Guide (अनुलोम-विलोम)</h4>
                <p className="leading-relaxed">
                  Sit upright comfortably. Inhale slowly through your left nostril for 4 seconds, hold for 2 seconds, and exhale smoothly through the right nostril for 4 seconds. Repeat 5 times to reduce daily stress and calm your heart rate.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 10: EMERGENCY SOS */}
        {activeModule === 'emergency' && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider bg-red-200 text-red-900 px-2.5 py-0.5 rounded-full border border-red-300">
                Priority Emergency Assistance
              </span>
              <h3 className="font-black text-xl text-red-950 mt-2">Emergency Response & Medical SOS</h3>
              <p className="text-xs text-red-900 max-w-xl">
                1-tap direct emergency calling, automatic GPS location transmission, and instant alerts to your assigned ASHA worker and family.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold py-4 px-5 rounded-2xl text-xs transition-all shadow-md flex flex-col items-center justify-center gap-1.5 text-center"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                <span>Call Emergency Services</span>
                <span className="text-[10px] font-normal opacity-90">Ambulance & Trauma Hub</span>
              </button>

              <a
                href="tel:+919823044512"
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 px-5 rounded-2xl text-xs transition-all shadow-md flex flex-col items-center justify-center gap-1.5 text-center"
              >
                <User className="w-5 h-5 text-emerald-400" />
                <span>Call My ASHA / CHO</span>
                <span className="text-[10px] font-normal opacity-90">Manisha Kadam</span>
              </a>

              <a
                href="tel:+919822100192"
                className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-extrabold py-4 px-5 rounded-2xl text-xs transition-all shadow-md flex flex-col items-center justify-center gap-1.5 text-center"
              >
                <PhoneCall className="w-5 h-5 text-red-600" />
                <span>Call Emergency Contact</span>
                <span className="text-[10px] font-normal text-slate-500">Sunita Shinde (Spouse)</span>
              </a>
            </div>
          </div>
        )}

        {/* MODULE 11: HEALTH TIMELINE */}
        {activeModule === 'timeline' && (() => {
          const timelineEvents = [
            { id: 'tl-1', date: 'Today, 10:30 AM', type: 'visit', icon: '🩺', title: 'Teleconsultation — Dr. Rohini Kulkarni', detail: 'BP reviewed, Iron supplement dose adjusted. Follow-up in 30 days.', badge: 'Completed', badgeColor: 'emerald' },
            { id: 'tl-2', date: 'Today, 10:15 AM', type: 'prescription', icon: '💊', title: 'e-Prescription Issued — RX-9921', detail: 'Amlodipine 5mg + Telmisartan 40mg. 30-day supply. Dispensed by Anand Deshmukh, Pharmacist.', badge: 'Dispensed', badgeColor: 'teal' },
            { id: 'tl-3', date: '2 days ago', type: 'lab', icon: '🧪', title: 'Lab Report — Lipid Profile + FBS', detail: 'Cholesterol 182 mg/dL (Normal). FBS 104 mg/dL (Borderline). Flagged for dietary counseling.', badge: 'Borderline', badgeColor: 'amber' },
            { id: 'tl-4', date: '1 week ago', type: 'visit', icon: '🏥', title: 'OPD Visit — Otur PHC', detail: 'Hypertension follow-up. New prescription issued. BP: 142/90.', badge: 'Completed', badgeColor: 'emerald' },
            { id: 'tl-5', date: '2 weeks ago', type: 'vitals', icon: '❤️', title: 'Vitals Recorded by ASHA — Manisha Kadam', detail: 'BP: 148/92, SpO₂: 97%, Pulse: 82 bpm, Temp: 98.4°F. Moderate risk flag raised.', badge: 'Moderate Risk', badgeColor: 'orange' },
            { id: 'tl-6', date: '1 month ago', type: 'referral', icon: '🚑', title: 'Referral — Junnar Rural Hospital', detail: 'Referred for hypertension specialist consultation. Reason: BP persistently >140/90.', badge: 'Completed', badgeColor: 'blue' },
            { id: 'tl-7', date: '2 months ago', type: 'prescription', icon: '💊', title: 'e-Prescription — RX-9112', detail: 'Telmisartan 40mg (Night). First-line hypertension management. Dispensed.', badge: 'Dispensed', badgeColor: 'teal' },
            { id: 'tl-8', date: '3 months ago', type: 'lab', icon: '🧪', title: 'Lab Report — CBC + HbA1c', detail: 'Hb: 12.1 g/dL (Low Normal). HbA1c: 5.9% (Pre-diabetic range). Lifestyle counseling recommended.', badge: 'Action Required', badgeColor: 'red' },
            { id: 'tl-9', date: '3 months ago', type: 'visit', icon: '🩺', title: 'Initial NCD Screening — ASHA Visit', detail: 'ASHA Manisha Kadam first documented hypertension. Patient enrolled in NCD registry.', badge: 'Enrolled', badgeColor: 'slate' },
          ];

          const TYPE_COLORS: Record<string, { bg: string; border: string; dot: string }> = {
            visit:        { bg: 'bg-teal-50',    border: 'border-teal-200',    dot: 'bg-teal-600'    },
            prescription: { bg: 'bg-blue-50',    border: 'border-blue-200',    dot: 'bg-blue-600'    },
            lab:          { bg: 'bg-purple-50',  border: 'border-purple-200',  dot: 'bg-purple-600'  },
            vitals:       { bg: 'bg-rose-50',    border: 'border-rose-200',    dot: 'bg-rose-500'    },
            referral:     { bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-500'   },
          };

          const BADGE_COLORS: Record<string, string> = {
            emerald: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
            teal:    'bg-teal-100 text-teal-800 border border-teal-300',
            amber:   'bg-amber-100 text-amber-800 border border-amber-300',
            orange:  'bg-orange-100 text-orange-800 border border-orange-300',
            blue:    'bg-blue-100 text-blue-800 border border-blue-300',
            red:     'bg-red-100 text-red-800 border border-red-300',
            slate:   'bg-slate-100 text-slate-700 border border-slate-300',
          };

          return (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Health Timeline</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Complete chronological history — visits, prescriptions, lab reports, referrals</p>
                </div>
                <button
                  onClick={() => showToast('Health summary downloading as PDF...')}
                  className="bg-[#003527] text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-[#064e3b] flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Export PDF
                </button>
              </div>

              {/* Filter pills */}
              <div className="flex gap-2 flex-wrap">
                {['All', 'Visits', 'Prescriptions', 'Lab Reports', 'Vitals', 'Referrals'].map(f => (
                  <button key={f} className="bg-slate-100 hover:bg-[#003527] hover:text-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 transition-all">
                    {f}
                  </button>
                ))}
              </div>

              {/* Timeline list */}
              <div className="relative space-y-0">
                {/* Vertical connector line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 z-0" />
                
                <div className="space-y-3">
                  {timelineEvents.map((event, idx) => {
                    const colors = TYPE_COLORS[event.type] || TYPE_COLORS.visit;
                    return (
                      <div key={event.id} className="relative flex gap-3">
                        {/* Dot indicator */}
                        <div className={`w-10 h-10 rounded-full ${colors.dot} flex items-center justify-center shrink-0 z-10 text-base shadow-sm`}>
                          {event.icon}
                        </div>
                        {/* Card */}
                        <div className={`flex-1 border ${colors.border} ${colors.bg} rounded-2xl p-3.5`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] text-slate-400 font-semibold">{event.date}</div>
                              <div className="font-bold text-sm text-slate-900 mt-0.5 leading-snug">{event.title}</div>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{event.detail}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${BADGE_COLORS[event.badgeColor] || BADGE_COLORS.slate}`}>
                              {event.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => showToast('Loading earlier health history...')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-200 transition-all"
                >
                  Load Earlier Records
                </button>
              </div>
            </div>
          );
        })()}

      </div>

      {/* BOOK APPOINTMENT MODAL */}
      {isBookModalOpen && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-lg text-slate-900">Book Doctor Appointment</h3>
                <p className="text-xs text-slate-500">Select doctor, consultation mode, and convenient time slot.</p>
              </div>
              <button onClick={() => setIsBookModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookAppointmentSubmit} className="space-y-4 text-xs">
              
              {/* Select Doctor */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Select Specialist Doctor</label>
                <select
                  value={selectedDoctor.id}
                  onChange={(e) => {
                    const doc = AVAILABLE_DOCTORS.find(d => d.id === e.target.value) || AVAILABLE_DOCTORS[0];
                    setSelectedDoctor(doc);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold"
                >
                  {AVAILABLE_DOCTORS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty} ({d.facility})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-2 font-bold">
                  <button
                    type="button"
                    onClick={() => setAptMode('TELECONSULTATION')}
                    className={`p-3 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 ${
                      aptMode === 'TELECONSULTATION'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Video className="w-4 h-4 text-emerald-700" />
                    <span>📹 Teleconsult Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAptMode('IN_PERSON_OPD')}
                    className={`p-3 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 ${
                      aptMode === 'IN_PERSON_OPD'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 text-emerald-700" />
                    <span>🏥 In-Person OPD</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Slot Selection */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Preferred Date</label>
                  <select
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold"
                  >
                    <option value="Today">Today (29 Aug)</option>
                    <option value="Tomorrow">Tomorrow (30 Aug)</option>
                    <option value="Monday, 31 Aug">Monday, 31 Aug</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Available Slot</label>
                  <select
                    value={aptTimeSlot}
                    onChange={(e) => setAptTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold"
                  >
                    {selectedDoctor.availableSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reason / Presenting Complaint */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Chief Symptoms / Reason for Visit</label>
                <textarea
                  rows={3}
                  value={aptComplaint}
                  onChange={(e) => setAptComplaint(e.target.value)}
                  placeholder="Describe what symptoms or guidance you need from the doctor..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#003527] hover:bg-[#064e3b] text-white font-black py-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Confirm & Generate Digital Token Slip</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LIVE TELECONSULTATION VIDEO ROOM (ZOOM / AGORA COMPATIBLE) */}
      {activeVideoApt && (
        <VideoConsultationRoom
          isOpen={!!activeVideoApt}
          onClose={() => {
            setActiveVideoApt(null);
            showToast('Teleconsultation session closed. Doctor e-Prescription will sync automatically.');
          }}
          config={{
            channelName: `e-sanjeevani-${activeVideoApt.appointmentToken || '9921'}`,
            userRole: 'patient',
            participantName: patient.name,
            remoteParticipantName: activeVideoApt.doctorName,
            remoteParticipantRole: activeVideoApt.doctorSpecialty || 'Specialist Doctor',
            appointmentToken: activeVideoApt.appointmentToken
          }}
          patientVitals={{
            bp: patient.vitals.bp,
            pulse: `${patient.vitals.pulse} bpm`,
            spo2: `${patient.vitals.spo2}%`,
            sugar: patient.vitals.bloodSugar,
            temp: patient.vitals.temp
          }}
        />
      )}

      {/* LAB TEST BOOKING MODAL — Real-time Price + Distance Comparison */}
      <LabTestBookingModal
        isOpen={isLabBookingOpen}
        onClose={() => setIsLabBookingOpen(false)}
        prefillTestId={labPrefillTestId}
      />

      {/* UPLOAD DIAGNOSTIC REPORT MODAL */}
      <UploadReportModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        patientId={patient.id}
      />

      {/* GLOBAL EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

    </div>
  );
};
