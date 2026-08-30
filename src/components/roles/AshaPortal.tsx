import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { bhashiniAI, VitalsVoiceExtraction } from '../../services/bhashiniService';
import { Language } from '../../types';
import { KpiCard, QuickAction, ActivityFeed, AlertBanner, SectionHeader, ProgressBar, ActivityItem } from '../common/DashboardWidgets';
import { 
  HeartHandshake, 
  UserPlus, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  Mic, 
  MicOff,
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Search, 
  Stethoscope, 
  Activity, 
  Baby, 
  Users,
  X,
  Sparkles,
  Send,
  ArrowRight,
  ClipboardList,
  AlertTriangle,
  Languages,
  Volume2,
  Check,
  Radio
} from 'lucide-react';

export const AshaPortal: React.FC = () => {
  const { isOnline, setIsOnline, showToast, language, setCurrentView, t } = useApp();
  const { ashaTasks, completeAshaTask, addAshaTask, registerPatient, patients, createReferral } = useHealthData();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'today_work' | 'patients' | 'visit_workflow' | 'language_bridge' | 'referrals' | 'offline_sync'>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Offline sync queue state
  const [offlinePendingCount, setOfflinePendingCount] = useState<number>(0);

  // Field Visit Workflow state
  const [selectedPatientForVisit, setSelectedPatientForVisit] = useState<any>(patients[0] || null);
  const [visitBp, setVisitBp] = useState<string>('148/92');
  const [visitPulse, setVisitPulse] = useState<string>('82');
  const [visitSpo2, setVisitSpo2] = useState<string>('97');
  const [visitTemp, setVisitTemp] = useState<string>('98.4');
  const [visitGlucose, setVisitGlucose] = useState<string>('142');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Headache', 'Dizziness']);
  const [availableSymptoms, setAvailableSymptoms] = useState<string[]>([
    'Headache',
    'Dizziness',
    'Fever > 48h',
    'Chest Discomfort',
    'Swelling (Edema)',
    'Cough / Breathlessness',
    'Severe Fatigue'
  ]);
  const [newSymptomInput, setNewSymptomInput] = useState<string>('');
  const [isAddingSymptom, setIsAddingSymptom] = useState<boolean>(false);
  const [visitNotes, setVisitNotes] = useState<string>('Patient counseled on salt restriction and daily Amlodipine tablet adherence.');
  const [aiTriageStatus, setAiTriageStatus] = useState<'ROUTINE' | 'FOLLOW_UP' | 'URGENT'>('FOLLOW_UP');

  // USE CASE #3: Voice Clinical Data Entry State
  const [isVoiceEntryListening, setIsVoiceEntryListening] = useState<boolean>(false);
  const [voiceParsedVitals, setVoiceParsedVitals] = useState<VitalsVoiceExtraction | null>(null);

  // USE CASE #5: ASHA <-> Patient Live Language Bridge State
  const [bridgePatientLang, setBridgePatientLang] = useState<Language>('or'); // Odia patient
  const [bridgeChoLang, setBridgeChoLang] = useState<Language>('hi'); // Hindi CHO
  const [bridgePatientInput, setBridgePatientInput] = useState<string>('ମୋତେ ଛାତିରେ ବ୍ୟଥା ହେଉଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।');
  const [bridgeChoTranslated, setBridgeChoTranslated] = useState<string>('मुझे सीने में दर्द हो रहा है और सांस लेने में तकलीफ हो रही है।');
  const [bridgeChoInput, setBridgeChoInput] = useState<string>('आपको यह दवा दिन में दो बार भोजन के बाद लेनी है।');
  const [bridgePatientTranslated, setBridgePatientTranslated] = useState<string>('ଆପଣଙ୍କୁ ଏହି ଔଷଧ ଦିନକୁ ଦୁଇଥର ଖାଇବା ପରେ ନେବାକୁ ପଡିବ।');
  const [isPatientListening, setIsPatientListening] = useState<boolean>(false);
  const [isChoListening, setIsChoListening] = useState<boolean>(false);

  // New Patient Registration State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [regName, setRegName] = useState<string>('');
  const [regAge, setRegAge] = useState<number>(32);
  const [regGender, setRegGender] = useState<'Female' | 'Male'>('Female');
  const [regVillage, setRegVillage] = useState<string>('Khamgaon');
  const [regMobile, setRegMobile] = useState<string>('+91 98230 44512');
  const [regCategory, setRegCategory] = useState<'Maternal ANC' | 'NCD Patient' | 'Elderly Care' | 'General'>('Maternal ANC');
  const [regRisk, setRegRisk] = useState<'Low' | 'Moderate' | 'High-Risk'>('High-Risk');

  // Referral Modal State
  const [isReferralModalOpen, setIsReferralModalOpen] = useState<boolean>(false);
  const [referralTargetFacility, setReferralTargetFacility] = useState<string>('Otur Primary Health Centre');
  const [referralReason, setReferralReason] = useState<string>('Elevated blood pressure (148/92) with persistent headache & fatigue.');
  const [referralUrgency, setReferralUrgency] = useState<'amber' | 'red' | 'green'>('amber');

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleAddCustomSymptom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSymptomInput.trim();
    if (!trimmed) return;
    if (!availableSymptoms.includes(trimmed)) {
      setAvailableSymptoms(prev => [...prev, trimmed]);
    }
    if (!selectedSymptoms.includes(trimmed)) {
      setSelectedSymptoms(prev => [...prev, trimmed]);
    }
    setNewSymptomInput('');
    setIsAddingSymptom(false);
    showToast(`Added observed symptom: "${trimmed}"`);
  };

  const handleStartFieldVisit = (patientObj: any) => {
    setSelectedPatientForVisit(patientObj);
    setActiveTab('visit_workflow');
  };

  const handleSaveVisit = () => {
    if (!isOnline) {
      setOfflinePendingCount(prev => prev + 1);
      showToast(`Offline Mode: Visit for ${selectedPatientForVisit?.name} queued in local storage.`);
    } else {
      showToast(`Visit recorded for ${selectedPatientForVisit?.name}. Vitals and assessment synced to Setu.`);
    }
    setActiveTab('today_work');
  };

  // Trigger ASHA/CHO Voice Clinical Data Entry (USE CASE #3)
  const handleStartVoiceVitalsEntry = () => {
    setIsVoiceEntryListening(true);
    bhashiniAI.asr(
      language,
      (transcript) => {
        const parsed = bhashiniAI.parseVitalsVoiceInput(transcript);
        setVoiceParsedVitals(parsed);
      },
      (err) => {
        console.warn('Voice ASR notice:', err);
      },
      () => {
        setIsVoiceEntryListening(false);
      }
    );
  };

  // Apply parsed vitals to the active form
  const handleApplyParsedVitals = () => {
    if (!voiceParsedVitals) return;
    if (voiceParsedVitals.systolic && voiceParsedVitals.diastolic) {
      setVisitBp(`${voiceParsedVitals.systolic}/${voiceParsedVitals.diastolic}`);
    }
    if (voiceParsedVitals.bloodGlucose) {
      setVisitGlucose(voiceParsedVitals.bloodGlucose.toString());
    }
    showToast(`Applied voice-parsed clinical values to visit chart.`);
    setVoiceParsedVitals(null);
  };

  // Live Language Bridge Translation Handlers (USE CASE #5)
  const handleTranslatePatientToCho = (text: string, pLang = bridgePatientLang, cLang = bridgeChoLang) => {
    setBridgePatientInput(text);
    const trans = bhashiniAI.liveBridgeTranslate(text, pLang, cLang);
    setBridgeChoTranslated(trans);
  };

  const handleTranslateChoToPatient = (text: string, cLang = bridgeChoLang, pLang = bridgePatientLang) => {
    setBridgeChoInput(text);
    const trans = bhashiniAI.liveBridgeTranslate(text, cLang, pLang);
    setBridgePatientTranslated(trans);
  };

  // Left Side: Patient Speech-to-Text handler
  const handleStartPatientVoice = () => {
    if (isPatientListening) {
      bhashiniAI.stopASR();
      setIsPatientListening(false);
      return;
    }
    if (isChoListening) {
      bhashiniAI.stopASR();
      setIsChoListening(false);
    }
    setIsPatientListening(true);
    showToast(`🎙️ Patient Mic Active: Listening in ${bridgePatientLang === 'or' ? 'Odia (ଓଡ଼ିଆ)' : bridgePatientLang}...`);
    bhashiniAI.asr(
      bridgePatientLang,
      (transcript) => {
        setBridgePatientInput(transcript);
        const trans = bhashiniAI.liveBridgeTranslate(transcript, bridgePatientLang, bridgeChoLang);
        setBridgeChoTranslated(trans);
      },
      (err) => {
        console.warn('Patient Voice ASR notice:', err);
      },
      () => {
        setIsPatientListening(false);
      }
    );
  };

  // Right Side: CHO / ASHA Speech-to-Text handler
  const handleStartChoVoice = () => {
    if (isChoListening) {
      bhashiniAI.stopASR();
      setIsChoListening(false);
      return;
    }
    if (isPatientListening) {
      bhashiniAI.stopASR();
      setIsPatientListening(false);
    }
    setIsChoListening(true);
    showToast(`🎙️ CHO/ASHA Mic Active: Listening in ${bridgeChoLang === 'hi' ? 'Hindi (हिन्दी)' : bridgeChoLang}...`);
    bhashiniAI.asr(
      bridgeChoLang,
      (transcript) => {
        setBridgeChoInput(transcript);
        const trans = bhashiniAI.liveBridgeTranslate(transcript, bridgeChoLang, bridgePatientLang);
        setBridgePatientTranslated(trans);
      },
      (err) => {
        console.warn('CHO Voice ASR notice:', err);
      },
      () => {
        setIsChoListening(false);
      }
    );
  };

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReferral({
      patientName: selectedPatientForVisit?.name || 'Patient',
      patientAge: selectedPatientForVisit?.age || 40,
      patientGender: selectedPatientForVisit?.gender || 'Female',
      patientVillage: selectedPatientForVisit?.village || 'Khamgaon',
      targetFacilityName: referralTargetFacility,
      reasonForReferral: referralReason,
      urgency: referralUrgency,
      referringProviderName: 'Manisha Kadam, ASHA Worker',
      referringFacilityName: 'Khamgaon Village Sector'
    });
    showToast(`Referral issued to ${referralTargetFacility} for ${selectedPatientForVisit?.name}.`);
    setIsReferralModalOpen(false);
  };

  const handleRegisterBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const newP = await registerPatient({
      name: regName,
      age: regAge,
      gender: regGender,
      mobile: regMobile,
      village: regVillage,
      category: regCategory as any,
      riskLevel: regRisk,
      assignedAsha: 'Manisha Kadam'
    });

    showToast(`Registered new citizen: ${newP.name} (ABHA generated).`);
    setIsRegisterModalOpen(false);
    setRegName('');
  };

  const handleSyncOfflineQueue = () => {
    setOfflinePendingCount(0);
    showToast('Sync completed: 100% field records synchronized with central Setu servers.');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ASHA / CHO Field Command Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-700 text-white flex items-center justify-center text-xl font-bold shadow-md">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">{t.ashaPortalTitle}</h1>
                <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-rose-300">
                  {t.role_asha}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Assigned Village: <strong>Khamgaon & Otur Spoke (Sector 4)</strong> • Sub-Centre: <strong>Ayushman Arogya Mandir</strong>
              </p>
            </div>
          </div>

          {/* Offline Sync State Indicator */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 ${
              offlinePendingCount > 0 ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${offlinePendingCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span>{offlinePendingCount > 0 ? `🟠 ${offlinePendingCount} ${t.syncPending}` : `🟢 ${t.synced}`}</span>
            </div>

            {offlinePendingCount > 0 && (
              <button
                onClick={handleSyncOfflineQueue}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-all shadow-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.syncWithHmis}</span>
              </button>
            )}

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ {t.role_patient}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-xs font-bold">
          {[
          { id: 'dashboard', label: '📊 Dashboard', icon: Activity },
            { id: 'today_work', label: `📋 ${t.fieldHomeVisits} (${ashaTasks.filter(item => !item.completedAt).length})`, icon: ClipboardList },
            { id: 'visit_workflow', label: `🩺 ${t.logVisitSubmit}`, icon: Activity },
            { id: 'language_bridge', label: '🌐 Language Bridge', icon: Languages },
            { id: 'patients', label: `👥 ${t.householdRoster} (${patients.length})`, icon: Users },
            { id: 'referrals', label: `🚑 ${t.referPatientBtn}`, icon: Send }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 0: ASHA COMMAND CENTER DASHBOARD */}
        {activeTab === 'dashboard' && (() => {
          const pendingTasks = ashaTasks.filter(item => !item.completedAt);
          const highRiskCount = patients.filter((p: any) => p.riskLevel === 'High-Risk').length;
          const maternalCount = patients.filter((p: any) => p.category?.toLowerCase().includes('anc') || p.category?.toLowerCase().includes('maternal')).length;
          
          const ashaActivity: ActivityItem[] = [
            { id: 'act-1', icon: '🩺', title: 'ANC Checkup completed', sub: 'Sunita Shinde (32w) · BP: 148/92', time: '15m ago', badge: 'High Risk', badgeColor: 'red' },
            { id: 'act-2', icon: '👶', title: 'Infant Immunization Logged', sub: 'Aarav Patil (Pentavalent-2)', time: '1h ago', badge: 'Completed', badgeColor: 'emerald' },
            { id: 'act-3', icon: '🚑', title: 'Emergency Referral Issued', sub: 'Pre-eclampsia referral to Junnar RH', time: '2h ago', badge: 'Urgent', badgeColor: 'amber' },
            { id: 'act-4', icon: '💊', title: 'IFA Tablets Distributed', sub: '30 Iron tablets to Meena Gaikwad', time: '3h ago', badge: 'Routine', badgeColor: 'blue' },
            { id: 'act-5', icon: '📝', title: 'New Citizen Registered', sub: 'Ramesh Thoke (NCD Registry)', time: '4h ago', badge: 'ABHA Linked', badgeColor: 'purple' }
          ];

          return (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard
                  label="Pending Visits"
                  value={pendingTasks.length}
                  icon={ClipboardList}
                  iconColor="text-rose-600"
                  iconBg="bg-rose-100"
                  trend="down"
                  trendLabel="2 completed"
                  urgency={pendingTasks.length > 0 ? 'warning' : 'normal'}
                  onClick={() => setActiveTab('today_work')}
                />
                <KpiCard
                  label="High-Risk Cases"
                  value={highRiskCount}
                  icon={AlertTriangle}
                  iconColor="text-red-600"
                  iconBg="bg-red-100"
                  trend="up"
                  trendLabel="Needs attention"
                  urgency="critical"
                  onClick={() => setActiveTab('patients')}
                />
                <KpiCard
                  label="Maternal / ANC"
                  value={maternalCount}
                  icon={Baby}
                  iconColor="text-pink-600"
                  iconBg="bg-pink-100"
                  trend="flat"
                  trendLabel="Tracked"
                  onClick={() => setActiveTab('patients')}
                />
                <KpiCard
                  label="Enrolled Families"
                  value={patients.length}
                  icon={Users}
                  iconColor="text-purple-600"
                  iconBg="bg-purple-100"
                  trend="up"
                  trendLabel="+3 this week"
                  onClick={() => setActiveTab('patients')}
                />
              </div>

              {/* Status Alert Banners */}
              <div className="space-y-2">
                {highRiskCount > 0 && (
                  <AlertBanner
                    type="critical"
                    title="⚠️ High-Risk Maternal Follow-up Alert"
                    message="Sunita Shinde (Khamgaon) recorded BP 148/92 mmHg during previous screening. Re-check scheduled today."
                    action={{ label: 'Start Visit Now', onClick: () => { setSelectedPatientForVisit(patients[0]); setActiveTab('visit_workflow'); } }}
                  />
                )}
                {offlinePendingCount > 0 && (
                  <AlertBanner
                    type="warning"
                    title="Local Queue Offline"
                    message={`${offlinePendingCount} field visits cached locally on device. Tap to sync.`}
                    action={{ label: 'Sync to Cloud', onClick: handleSyncOfflineQueue }}
                  />
                )}
              </div>

              {/* Quick Action Buttons */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <SectionHeader title="Quick Actions" sub="Primary frontline clinical tasks" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <QuickAction
                    icon={Activity}
                    label="Log Field Visit"
                    sub="Record vitals & symptoms"
                    color="bg-rose-700 text-white"
                    onClick={() => setActiveTab('visit_workflow')}
                    pulse={pendingTasks.length > 0}
                  />
                  <QuickAction
                    icon={UserPlus}
                    label="Register Citizen"
                    sub="Generate ABHA ID"
                    color="bg-purple-700 text-white"
                    onClick={() => setIsRegisterModalOpen(true)}
                  />
                  <QuickAction
                    icon={Languages}
                    label="Language Bridge"
                    sub="Live Voice Translation"
                    color="bg-indigo-700 text-white"
                    onClick={() => setActiveTab('language_bridge')}
                  />
                  <QuickAction
                    icon={Send}
                    label="Refer Patient"
                    sub="Transfer to PHC/SDH"
                    color="bg-amber-600 text-white"
                    onClick={() => setActiveTab('referrals')}
                  />
                </div>
              </div>

              {/* Bottom Row: Recent Feed & Village Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                  <SectionHeader
                    title="Recent Field Activities"
                    sub="Live synchronization trail"
                    action={<button onClick={() => setActiveTab('today_work')} className="text-xs text-rose-700 font-bold hover:underline">View All Tasks</button>}
                  />
                  <ActivityFeed items={ashaActivity} maxItems={5} />
                </div>

                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <SectionHeader title="Sector 4 Coverage" sub="Khamgaon Village Target: 100%" />
                  <ProgressBar value={12} max={15} color="bg-rose-500" label="Daily Target Visits (80%)" />
                  <ProgressBar value={8} max={8} color="bg-emerald-500" label="ANC 3rd Trimester Scanned (100%)" />
                  <ProgressBar value={24} max={30} color="bg-purple-500" label="NCD Screening Complete (80%)" />
                  <ProgressBar value={18} max={20} color="bg-blue-500" label="IFA & Calcium Adherence (90%)" />

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">ASHA Honorarium Score</span>
                    <span className="font-black text-emerald-700">₹4,850 (Grade A)</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 1: TODAY'S FIELD VISITS QUEUE */}
        {activeTab === 'today_work' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Assigned Field Visits for Today</h3>
                  <p className="text-xs text-slate-500">Prioritized by clinical severity (🔴 High-Risk ANC → 🟡 Follow-ups → 🟢 Routine Care).</p>
                </div>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="text-xs text-rose-800 font-bold hover:underline"
                >
                  + Add Doorstep Screening
                </button>
              </div>

              <div className="space-y-3">
                {ashaTasks.map((task) => {
                  const isRed = task.urgency === 'overdue';
                  const isAmber = task.urgency === 'today';
                  const isDone = !!task.completedAt;
                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                        isDone ? 'bg-slate-50 border-slate-200 opacity-60' :
                        isRed ? 'bg-red-50/60 border-red-200' :
                        isAmber ? 'bg-amber-50/60 border-amber-200' : 'bg-emerald-50/60 border-emerald-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isRed ? 'bg-red-200 text-red-900' : isAmber ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                          }`}>
                            {task.urgency.toUpperCase()}
                          </span>
                          <span className="font-extrabold text-sm text-slate-900">{task.patientName}</span>
                          <span className="text-xs text-slate-500">({task.patientAge}y • {task.village})</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">
                          {task.category}: {task.actionRequired}
                        </p>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>Scheduled: <strong>{task.dueDate}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {!isDone ? (
                          <>
                            <button
                              onClick={() => {
                                const found = patients.find(p => p.name === task.patientName) || {
                                  id: task.id,
                                  name: task.patientName,
                                  age: task.patientAge,
                                  gender: 'Female',
                                  village: task.village,
                                  category: task.category
                                };
                                handleStartFieldVisit(found);
                              }}
                              className="flex-1 sm:flex-none bg-rose-700 hover:bg-rose-800 text-white font-bold py-2 px-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
                            >
                              <Activity className="w-3.5 h-3.5" />
                              <span>Start Triage Visit</span>
                            </button>
                            <button
                              onClick={() => completeAshaTask(task.id)}
                              className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-xl border border-slate-300 text-xs transition-colors"
                            >
                              Mark Done
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Visit Recorded</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STEP-BY-STEP FIELD VISIT & VITALS TRIAGE */}
        {activeTab === 'visit_workflow' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Active Patient Bar & Voice Entry Trigger */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-full border border-rose-300">
                  Active Doorstep Triage
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                  Field Check-in: {selectedPatientForVisit?.name || 'Sunita Shinde'}
                </h3>
                <p className="text-xs text-slate-500">
                  Village: <strong>{selectedPatientForVisit?.village || 'Khamgaon'}</strong> • Age: <strong>{selectedPatientForVisit?.age || 32}y</strong>
                </p>
              </div>

              {/* USE CASE #3: Voice Entry Button */}
              <button
                onClick={handleStartVoiceVitalsEntry}
                className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                  isVoiceEntryListening ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>{isVoiceEntryListening ? 'Listening vitals...' : '🎤 Voice Clinical Entry'}</span>
              </button>
            </div>

            {/* USE CASE #3: Detected Voice Vitals Card */}
            {voiceParsedVitals && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>BHASHINI Voice-Extracted Clinical Parameters:</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">
                    Detected {voiceParsedVitals.detectedLanguage.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs italic text-slate-700 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  "{voiceParsedVitals.rawTranscript}"
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-slate-400 text-[10px] block">BP Reading</span>
                    <span className="font-black text-slate-900">{voiceParsedVitals.systolic} / {voiceParsedVitals.diastolic} mmHg</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-slate-400 text-[10px] block">Blood Glucose</span>
                    <span className="font-black text-slate-900">{voiceParsedVitals.bloodGlucose} mg/dL</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-slate-400 text-[10px] block">Patient Name</span>
                    <span className="font-bold text-slate-900 truncate block">{voiceParsedVitals.patientName}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-slate-400 text-[10px] block">Age</span>
                    <span className="font-bold text-slate-900">{voiceParsedVitals.age} Years</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleApplyParsedVitals}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm & Apply to Form</span>
                  </button>
                  <button
                    onClick={() => setVoiceParsedVitals(null)}
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-xl border border-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Vitals Input Grid */}
            <div className="space-y-4">
              <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">1. Record Vital Signs:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="text-slate-500 font-bold block mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={visitBp}
                    onChange={(e) => setVisitBp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                  />
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="text-slate-500 font-bold block mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    value={visitPulse}
                    onChange={(e) => setVisitPulse(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                  />
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="text-slate-500 font-bold block mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={visitSpo2}
                    onChange={(e) => setVisitSpo2(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-emerald-800"
                  />
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="text-slate-500 font-bold block mb-1">Temp (°F)</label>
                  <input
                    type="text"
                    value={visitTemp}
                    onChange={(e) => setVisitTemp(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                  />
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="text-slate-500 font-bold block mb-1">Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={visitGlucose}
                    onChange={(e) => setVisitGlucose(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Symptoms Tagging */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">2. Observed Symptoms:</h4>
                <span className="text-[11px] text-slate-500 font-medium">
                  {selectedSymptoms.length} selected
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {availableSymptoms.map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1 shadow-2xs ${
                        isChecked ? 'bg-rose-100 text-rose-900 border-rose-300 ring-1 ring-rose-200' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? `✓ ${sym}` : `+ ${sym}`}
                    </button>
                  );
                })}

                {/* + Add More Symptoms input / trigger */}
                {isAddingSymptom ? (
                  <form 
                    onSubmit={handleAddCustomSymptom} 
                    className="flex items-center gap-1.5 bg-white border-2 border-blue-400 rounded-xl p-1 shadow-xs"
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder="Type new symptom..."
                      value={newSymptomInput}
                      onChange={(e) => setNewSymptomInput(e.target.value)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-900 bg-transparent focus:outline-hidden min-w-[170px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsAddingSymptom(false);
                          setNewSymptomInput('');
                        }
                      }}
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingSymptom(false);
                        setNewSymptomInput('');
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingSymptom(true)}
                    className="px-3 py-1.5 rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition-all flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add More Symptoms</span>
                  </button>
                )}
              </div>
            </div>

            {/* Field Notes & Actions */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-800 block">3. Counseling & Visit Clinical Notes:</label>
              <textarea
                rows={3}
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setIsReferralModalOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-5 rounded-2xl text-xs transition-all shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Escalate & Create Referral Slip</span>
              </button>

              <button
                onClick={handleSaveVisit}
                className="bg-rose-700 hover:bg-rose-800 text-white font-extrabold py-3 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save & Complete Visit Record</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 3: USE CASE #5 — BHASHINI LIVE LANGUAGE BRIDGE */}
        {activeTab === 'language_bridge' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-300">
                  USE CASE #5 — BHASHINI Anuvaad Bridge
                </span>
                <h3 className="font-extrabold text-xl text-slate-900 mt-1">Live ASHA / CHO ↔ Patient Language Bridge</h3>
                <p className="text-xs text-slate-500">
                  Instant bidirectional speech-to-text translation and voice synthesis for tribal & linguistic minority patient communication.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Real-Time Bilateral Speech Bridge</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Patient Side (e.g. Speaks Odia / Tribal / Regional) */}
              <div className={`rounded-2xl border p-5 space-y-4 flex flex-col justify-between transition-all ${
                isPatientListening ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-300 shadow-md' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                      <span>👤</span> Patient Voice Input
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-medium">Language:</span>
                      <select
                        value={bridgePatientLang}
                        onChange={(e) => {
                          const newLang = e.target.value as Language;
                          setBridgePatientLang(newLang);
                          handleTranslatePatientToCho(bridgePatientInput, newLang, bridgeChoLang);
                        }}
                        className="text-[11px] bg-white border border-slate-300 font-bold px-2 py-1 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="or">Odia (ଓଡ଼ିଆ)</option>
                        <option value="mr">Marathi (मराठी)</option>
                        <option value="bn">Bengali (বাংলা)</option>
                        <option value="ur">Urdu (اردو)</option>
                        <option value="hi">Hindi (हिन्दी)</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  {/* Speech to Text Mic Button for Patient */}
                  <div>
                    <button
                      type="button"
                      onClick={handleStartPatientVoice}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                        isPatientListening 
                          ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isPatientListening ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          <span>🔴 Listening Patient... Click to Stop</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          <span>🎤 Speak to Text (Patient Mic)</span>
                        </>
                      )}
                    </button>
                    {isPatientListening && (
                      <p className="text-[10px] text-red-600 font-semibold text-center mt-1 animate-pulse">
                        🎙️ Patient is speaking... converting speech to text in real-time
                      </p>
                    )}
                  </div>

                  {/* Quick Preset Phrases for Instant Testing */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Voice Test Phrases:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTranslatePatientToCho('ମୋତେ ଛାତିରେ ବ୍ୟଥା ହେଉଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।')}
                        className="text-[10px] bg-white hover:bg-blue-100 border border-slate-200 hover:border-blue-300 text-slate-700 font-medium px-2 py-1 rounded-lg transition-colors"
                      >
                        ଛାତିରେ ଯନ୍ତ୍ରଣା (Chest Pain)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTranslatePatientToCho('ମୋତେ ଦୁଇ ଦିନ ହେଲା ଜ୍ୱର ଏବଂ ଥଣ୍ଡା ହେଉଛି।')}
                        className="text-[10px] bg-white hover:bg-blue-100 border border-slate-200 hover:border-blue-300 text-slate-700 font-medium px-2 py-1 rounded-lg transition-colors"
                      >
                        ଜ୍ୱର ହେଉଛି (Fever)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTranslatePatientToCho('ମୋତେ ଭୀଷଣ ମୁଣ୍ଡ ବିନ୍ଧା ଓ ଚକ୍କର ଆସୁଛି।')}
                        className="text-[10px] bg-white hover:bg-blue-100 border border-slate-200 hover:border-blue-300 text-slate-700 font-medium px-2 py-1 rounded-lg transition-colors"
                      >
                        ମୁଣ୍ଡ ବିନ୍ଧା (Headache)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Patient Speech Transcript / Input:</label>
                    <textarea
                      rows={3}
                      value={bridgePatientInput}
                      onChange={(e) => handleTranslatePatientToCho(e.target.value)}
                      placeholder="Patient voice transcript will appear here..."
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-blue-800 block">CHO / ASHA Hears ({bridgeChoLang.toUpperCase()} Translation):</span>
                    <p className="text-xs font-bold text-blue-950">"{bridgeChoTranslated}"</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => bhashiniAI.tts(bridgeChoTranslated, bridgeChoLang)}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs mt-3"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>🔊 Listen in {bridgeChoLang === 'hi' ? 'Hindi' : bridgeChoLang.toUpperCase()} (ASHA/CHO)</span>
                </button>
              </div>

              {/* CHO Side (e.g. Speaks Hindi / Regional) */}
              <div className={`rounded-2xl border p-5 space-y-4 flex flex-col justify-between transition-all ${
                isChoListening ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300 shadow-md' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                      <span>👩‍⚕️</span> CHO / ASHA Response Voice Input
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-medium">Language:</span>
                      <select
                        value={bridgeChoLang}
                        onChange={(e) => {
                          const newLang = e.target.value as Language;
                          setBridgeChoLang(newLang);
                          handleTranslateChoToPatient(bridgeChoInput, newLang, bridgePatientLang);
                        }}
                        className="text-[11px] bg-white border border-slate-300 font-bold px-2 py-1 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="hi">Hindi (हिन्दी)</option>
                        <option value="mr">Marathi (मराठी)</option>
                        <option value="or">Odia (ଓଡ଼ିଆ)</option>
                        <option value="bn">Bengali (বাংলা)</option>
                        <option value="ur">Urdu (اردو)</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  {/* Speech to Text Mic Button for CHO / ASHA */}
                  <div>
                    <button
                      type="button"
                      onClick={handleStartChoVoice}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                        isChoListening 
                          ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isChoListening ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          <span>🔴 Listening CHO/ASHA... Click to Stop</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          <span>🎤 Speak to Text (CHO/ASHA Mic)</span>
                        </>
                      )}
                    </button>
                    {isChoListening && (
                      <p className="text-[10px] text-red-600 font-semibold text-center mt-1 animate-pulse">
                        🎙️ CHO/ASHA is speaking directions... converting speech to text in real-time
                      </p>
                    )}
                  </div>

                  {/* Quick Preset Phrases for Instant Testing */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick CHO Voice Presets:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTranslateChoToPatient('आपको यह दवा दिन में दो बार भोजन के बाद लेनी है।')}
                        className="text-[10px] bg-white hover:bg-emerald-100 border border-slate-200 hover:border-emerald-300 text-slate-700 font-medium px-2 py-1 rounded-lg transition-colors"
                      >
                        दवा भोजन के बाद लें (Medication)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTranslateChoToPatient('आपको पूरा आराम करने की सलाह दी जाती है।')}
                        className="text-[10px] bg-white hover:bg-emerald-100 border border-slate-200 hover:border-emerald-300 text-slate-700 font-medium px-2 py-1 rounded-lg transition-colors"
                      >
                        पूरा आराम करें (Rest)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTranslateChoToPatient('जांच के लिए तुरंत प्राथमिक स्वास्थ्य केंद्र (PHC) जाएं।')}
                        className="text-[10px] bg-white hover:bg-emerald-100 border border-slate-200 hover:border-emerald-300 text-slate-700 font-medium px-2 py-1 rounded-lg transition-colors"
                      >
                        PHC अस्पताल जाएं (Referral)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">CHO Directions Transcript / Input:</label>
                    <textarea
                      rows={3}
                      value={bridgeChoInput}
                      onChange={(e) => handleTranslateChoToPatient(e.target.value)}
                      placeholder="CHO voice transcript will appear here..."
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Patient Hears ({bridgePatientLang.toUpperCase()} Translation):</span>
                    <p className="text-xs font-bold text-emerald-950">"{bridgePatientTranslated}"</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => bhashiniAI.tts(bridgePatientTranslated, bridgePatientLang)}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs mt-3"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>🔊 Play Voice to Patient in {bridgePatientLang === 'or' ? 'Odia' : bridgePatientLang.toUpperCase()}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: VILLAGE POPULATION ROSTER */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Village Population Health Register</h3>
                <p className="text-xs text-slate-500">Track ABHA verification, high-risk flags, and routine check-up due dates.</p>
              </div>
              <input
                type="text"
                placeholder="Search patient name, ABHA or village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs w-full sm:w-64"
              />
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {patients.map((p) => (
                <div key={p.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{p.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.riskLevel === 'High-Risk' || p.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.riskLevel || 'Low'} Risk
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      ABHA: <span className="font-mono">{p.abhaId}</span> • Age: <strong>{p.age}y</strong> ({p.gender}) • Village: <strong>{p.village}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartFieldVisit(p)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-3.5 rounded-xl text-xs transition-colors"
                  >
                    Conduct Visit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* NEW PATIENT REGISTRATION MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">Register Village Resident (ABHA)</h3>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterBeneficiary} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Age</label>
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Gender</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-700 hover:bg-rose-800 text-white font-extrabold py-3 rounded-2xl text-xs transition-all shadow-md mt-2"
              >
                ✓ Complete Doorstep Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REFERRAL MODAL */}
      {isReferralModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">Issue Fast-Track Referral</h3>
              <button onClick={() => setIsReferralModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Target Government Hospital</label>
                <select
                  value={referralTargetFacility}
                  onChange={(e) => setReferralTargetFacility(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="Otur Primary Health Centre">Otur Primary Health Centre (PHC)</option>
                  <option value="Junnar Rural Hospital & Trauma Centre">Junnar Rural Hospital & Trauma Centre</option>
                  <option value="Pune Sassoon General Hospital">Pune Sassoon General Hospital</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Clinical Reason for Transfer</label>
                <textarea
                  rows={3}
                  value={referralReason}
                  onChange={(e) => setReferralReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3 rounded-2xl text-xs transition-all shadow-md mt-2"
              >
                Generate Referral Slip & Alert Hospital
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
