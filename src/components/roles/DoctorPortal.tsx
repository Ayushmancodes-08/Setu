import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { Appointment } from '../../types';
import { VideoConsultationRoom } from '../video/VideoConsultationRoom';
import { EditProfileModal } from '../modals/EditProfileModal';
import { KpiCard, QuickAction, ActivityFeed, AlertBanner, SectionHeader, ProgressBar, ActivityItem } from '../common/DashboardWidgets';
import { 
  Stethoscope, 
  Video, 
  Pill, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Send, 
  Clock, 
  ChevronRight, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  Sparkles, 
  Download, 
  FileCheck,
  Calendar,
  PhoneCall,
  User,
  X,
  Check
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const { showToast, language, setCurrentView, t } = useApp();
  const { 
    teleconsultQueue, 
    updateTeleconsultStatus, 
    completeConsultationAndIssueRx,
    createDiagnosticOrder,
    createReferral,
    patients,
    submitLabResult,
    appointments,
    updateAppointmentStatus,
    currentUser
  } = useHealthData();

  // Selected queue patient
  const [selectedQueueItem, setSelectedQueueItem] = useState<any>(teleconsultQueue[0] || appointments[0] || null);
  const [isLiveConsulting, setIsLiveConsulting] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'consultation' | 'rx_builder' | 'lab_order' | 'record_lab' | 'referral'>('dashboard');
  const [queueFilter, setQueueFilter] = useState<'all' | 'teleconsult' | 'appointments'>('all');

  // Consultation Clinical Notes
  const [doctorNotes, setDoctorNotes] = useState<string>(
    'Patient presents with severe gestational fatigue at 32 weeks ANC. Microcytic anemia confirmed on peripheral smear. Mild pregnancy-induced hypertension (138/92). Starting oral iron + calcium and scheduling IV iron sucrose trial if Hb remains < 8.5 g/dL.'
  );

  // Rx builder state
  const [rxItems, setRxItems] = useState([
    {
      name: 'Ferrous Ascorbate + Folic Acid Tablets (100mg + 1.5mg)',
      dosage: '1 Tab',
      frequency: '1-0-1 (Twice Daily)',
      duration: '30 Days',
      quantity: 60,
      instructions: 'Take after meals with water. Avoid milk or tea within 1 hour.'
    },
    {
      name: 'Calcium Carbonate + Vitamin D3 Tablets (500mg + 250IU)',
      dosage: '1 Tab',
      frequency: '0-1-0 (Afternoon)',
      duration: '30 Days',
      quantity: 30,
      instructions: 'Take after lunch with water.'
    }
  ]);

  // New item draft
  const [draftMedName, setDraftMedName] = useState<string>('');
  const [draftDosage, setDraftDosage] = useState<string>('1 Tab');
  const [draftFrequency, setDraftFrequency] = useState<string>('1-0-1');
  const [draftDuration, setDraftDuration] = useState<string>('15 Days');
  const [draftInstructions, setDraftInstructions] = useState<string>('After food');

  // Lab Order Requisitions State
  const [selectedTests, setSelectedTests] = useState<string[]>(['Complete Blood Count (CBC)', 'Serum Ferritin & Iron Studies']);
  const [availableTests, setAvailableTests] = useState<string[]>([
    'Complete Blood Count (CBC)',
    'Serum Ferritin & Iron Studies',
    'Lipid Profile',
    'Fasting Blood Glucose',
    'Urine Routine & Micro',
    'Thyroid Profile (TSH)',
    'Liver Function Test (LFT)',
    'Kidney Function Test (KFT/Creatinine)',
    'HbA1c (Glycated Hemoglobin)',
    'Serum Electrolytes (Na+/K+/Cl-)',
    'Vitamin D3 & B12 Levels',
    'Obstetric / Abdominal USG',
    '12-Lead ECG'
  ]);
  const [newTestInput, setNewTestInput] = useState<string>('');
  const [isAddingCustomTest, setIsAddingCustomTest] = useState<boolean>(false);

  // Direct Lab Record Entry State
  const [directTestName, setDirectTestName] = useState<string>('Complete Blood Count (CBC) & Hemoglobin');
  const [directResultValue, setDirectResultValue] = useState<string>('Hemoglobin: 8.2 g/dL (Severe Microcytic Anemia)');
  const [directRefRange, setDirectRefRange] = useState<string>('12.0 - 15.5 g/dL (Female Normal)');
  const [directIsPanic, setDirectIsPanic] = useState<boolean>(true);
  const [directNotes, setDirectNotes] = useState<string>('Marked hypochromia and microcytosis. Prescribed Ferrous Ascorbate + Folic Acid under PMSMA protocol.');

  // Referral State
  const [referralTarget, setReferralTarget] = useState<string>('Junnar Rural Hospital & Trauma Centre');
  const [referralSpecialty, setReferralSpecialty] = useState<string>('Obstetrics & High-Risk Pregnancy');
  const [referralUrgency, setReferralUrgency] = useState<'red' | 'amber' | 'green'>('amber');
  const [referralNotes, setReferralNotes] = useState<string>('High-risk pregnancy with severe gestational anemia requiring parenteral iron or blood transfusion standby.');

  const toggleTest = (test: string) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleAddCustomTest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTestInput.trim();
    if (!trimmed) return;
    if (!availableTests.includes(trimmed)) {
      setAvailableTests(prev => [...prev, trimmed]);
    }
    if (!selectedTests.includes(trimmed)) {
      setSelectedTests(prev => [...prev, trimmed]);
    }
    setNewTestInput('');
    setIsAddingCustomTest(false);
    showToast(`Added diagnostic investigation: "${trimmed}"`);
  };

  const handleAddMedication = () => {
    if (!draftMedName.trim()) return;
    setRxItems(prev => [
      ...prev,
      {
        name: draftMedName,
        dosage: draftDosage,
        frequency: draftFrequency,
        duration: draftDuration,
        quantity: 30,
        instructions: draftInstructions
      }
    ]);
    setDraftMedName('');
    showToast(`Added ${draftMedName} to prescription chart.`);
  };

  const handleRemoveMedication = (index: number) => {
    setRxItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleIssuePrescription = async () => {
    if (!selectedQueueItem) return;
    await completeConsultationAndIssueRx(selectedQueueItem.id, {
      patientId: 'p-001',
      patientName: selectedQueueItem.patientName,
      patientAge: selectedQueueItem.patientAge,
      patientGender: selectedQueueItem.gender || selectedQueueItem.patientGender || 'Female',
      patientVillage: selectedQueueItem.village || selectedQueueItem.patientVillage || 'Khamgaon',
      doctorName: 'Dr. Rohini Kulkarni, MD',
      facilityName: 'Junnar Rural Hospital Telemedicine Hub',
      items: rxItems,
      notes: doctorNotes
    });

    if (selectedQueueItem.appointmentToken) {
      await updateAppointmentStatus(selectedQueueItem.id, 'COMPLETED', 'Doctor consultation finished & e-Rx issued.');
    }

    showToast(`e-Prescription signed & transmitted to Pharmacy Dispensary.`);
    setIsLiveConsulting(false);
  };

  const handleDispatchLabOrders = async () => {
    if (!selectedQueueItem || selectedTests.length === 0) return;
    for (const testName of selectedTests) {
      await createDiagnosticOrder({
        patientName: selectedQueueItem.patientName,
        patientAge: selectedQueueItem.patientAge,
        patientGender: selectedQueueItem.gender || selectedQueueItem.patientGender || 'Female',
        testName: testName,
        testCategory: 'Hematology',
        orderingDoctor: 'Dr. Rohini Kulkarni, MD',
        facility: 'Junnar Rural Hospital Diagnostic Wing'
      });
    }
    showToast(`Dispatched ${selectedTests.length} diagnostic test requisitions to Central Laboratory`);
  };

  const handleRecordDirectLabReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQueueItem) return;

    const created = await createDiagnosticOrder({
      patientName: selectedQueueItem.patientName,
      patientAge: selectedQueueItem.patientAge,
      patientGender: selectedQueueItem.gender || selectedQueueItem.patientGender || 'Female',
      testName: directTestName,
      testCategory: 'Hematology & Pathology',
      orderingDoctor: 'Dr. Rohini Kulkarni, MD',
      facility: 'Junnar Rural Hospital Diagnostic Wing'
    });

    await submitLabResult(
      created.id, 
      directResultValue, 
      directIsPanic, 
      `${directNotes} • Ref Range: ${directRefRange}`
    );

    showToast(`Diagnostic report recorded & verified for ${selectedQueueItem.patientName}. Available in Patient Locker.`);
    setActiveTab('consultation');
  };

  const handleCreateSpecialistReferral = async () => {
    if (!selectedQueueItem) return;
    await createReferral({
      patientId: 'p-001',
      patientName: selectedQueueItem.patientName,
      patientAge: selectedQueueItem.patientAge,
      patientGender: (selectedQueueItem.gender || selectedQueueItem.patientGender || 'Female') as any,
      patientVillage: selectedQueueItem.village || selectedQueueItem.patientVillage || 'Khamgaon',
      referringRole: 'doctor',
      referringProviderName: 'Dr. Rohini Kulkarni, MD',
      referringFacilityName: 'Junnar Rural Hospital Telemedicine Hub',
      targetFacilityName: referralTarget,
      targetSpecialty: referralSpecialty,
      urgency: referralUrgency,
      reasonForReferral: referralNotes
    });
    showToast(`Referral issued to ${referralTarget}. Bed reserved & transfer code generated.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Hub Medical Officer Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-xl font-bold shadow-md">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">{t.doctorPortalTitle}</h1>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-300">
                  {t.role_doctor}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Junnar Rural Hospital Telemedicine Receiving Hub • Registration: <strong>MMC-2014-99812</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-blue-700" />
              <span>Edit Profile</span>
            </button>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-3 py-2 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Tele-Clinic Hub Live</span>
            </span>
          </div>
        </div>

        {/* Workbench Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Appointments & Spoke Teleconsult Queue */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Scheduled Appointments & Queue</span>
              </h3>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {appointments.length + teleconsultQueue.length} Cases
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setQueueFilter('all')}
                className={`flex-1 py-1 rounded-lg transition-all ${queueFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                All Cases
              </button>
              <button
                onClick={() => setQueueFilter('appointments')}
                className={`flex-1 py-1 rounded-lg transition-all ${queueFilter === 'appointments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                Appointments ({appointments.length})
              </button>
              <button
                onClick={() => setQueueFilter('teleconsult')}
                className={`flex-1 py-1 rounded-lg transition-all ${queueFilter === 'teleconsult' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                Spoke Queue ({teleconsultQueue.length})
              </button>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              
              {/* Direct Patient Appointments */}
              {(queueFilter === 'all' || queueFilter === 'appointments') && appointments.map((apt) => {
                const isSelected = selectedQueueItem?.id === apt.id;
                return (
                  <button
                    key={apt.id}
                    onClick={() => {
                      setSelectedQueueItem(apt);
                      setIsLiveConsulting(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 text-teal-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md border border-teal-300">
                        {apt.appointmentToken}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {apt.mode === 'TELECONSULTATION' ? '📹 Video' : '🏥 OPD'}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-slate-900 mt-1.5">{apt.patientName}</div>
                    <div className="text-[11px] text-slate-500">{apt.patientGender}, {apt.patientAge}y • {apt.patientVillage}</div>
                    <div className="mt-1 text-[11px] text-slate-700 line-clamp-1 font-medium">
                      🗓️ {apt.appointmentDate} ({apt.timeSlot})
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-600 italic">
                      "{apt.complaint}"
                    </div>
                  </button>
                );
              })}

              {/* Spoke Teleconsult Queue */}
              {(queueFilter === 'all' || queueFilter === 'teleconsult') && teleconsultQueue.map((item) => {
                const isSelected = selectedQueueItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedQueueItem(item);
                      setIsLiveConsulting(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 text-blue-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {item.tokenNumber}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        item.urgency === 'red' ? 'bg-red-100 text-red-800' : item.urgency === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.urgency}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-slate-900 mt-1.5">{item.patientName}</div>
                    <div className="text-[11px] text-slate-500">{item.gender}, {item.patientAge}y • {item.village}</div>
                    <div className="mt-1 text-[11px] text-slate-700 line-clamp-1 font-medium">
                      🩺 {item.presentingComplaint}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span>CHO: {item.connectedChoName}</span>
                      <span className="font-semibold text-blue-700">{item.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Clinical Console & Consultation Workbench */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            
            {/* Active Case Clinical Banner */}
            {selectedQueueItem ? (
              <div className="space-y-4 pb-4 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">{selectedQueueItem.patientName}</h2>
                      <span className="font-mono bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded-md font-bold">
                        Token: {selectedQueueItem.tokenNumber || selectedQueueItem.appointmentToken}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Age: <strong>{selectedQueueItem.patientAge || selectedQueueItem.age}y</strong> ({selectedQueueItem.gender || selectedQueueItem.patientGender}) • Village: <strong>{selectedQueueItem.village || selectedQueueItem.patientVillage}</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {selectedQueueItem.appointmentToken && (
                      <button
                        onClick={async () => {
                          if (updateAppointmentStatus) {
                            await updateAppointmentStatus(selectedQueueItem.id, 'CONFIRMED', 'Approved by Dr. Rohini Kulkarni');
                          }
                          showToast(`Appointment #${selectedQueueItem.appointmentToken} Approved & Confirmed!`);
                        }}
                        className="px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Approve Appointment</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsLiveConsulting(!isLiveConsulting);
                        showToast(isLiveConsulting ? 'Teleconsult session paused.' : 'Live video connection established with patient.');
                      }}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                        isLiveConsulting ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>{isLiveConsulting ? 'Disconnect Tele-Link' : 'Start Live Video Consult'}</span>
                    </button>
                  </div>
                </div>

                {/* Vitals Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                    <span className="font-bold text-slate-900">{selectedQueueItem.vitals?.bp || '138/86 mmHg'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pulse Rate</span>
                    <span className="font-bold text-slate-900">{selectedQueueItem.vitals?.pulse || '78 bpm'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Oxygen SpO2</span>
                    <span className="font-bold text-emerald-700">{selectedQueueItem.vitals?.spo2 || '98%'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Presenting Issue</span>
                    <span className="font-bold text-slate-800 truncate block">{selectedQueueItem.presentingComplaint || selectedQueueItem.complaint || 'Routine consult'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                Select an appointment or queued patient from the left column to begin consultation.
              </div>
            )}

            {/* Doctor Workbench Navigation Tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto gap-1">
              {[
                { id: 'dashboard', label: '📊 Dashboard' },
                { id: 'consultation', label: '🩺 Consult' },
                { id: 'rx_builder', label: `💊 e-Rx (${rxItems.length})` },
                { id: 'lab_order', label: '🧪 Lab Order' },
                { id: 'referral', label: '📤 Referral' },
              ].map(tab => (
                <button key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2 px-2 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                  }`}
                >{tab.label}</button>
              ))}
            </div>

            {/* TAB 0: DASHBOARD */}
            {activeTab === 'dashboard' && (() => {
              const doctorActivity: ActivityItem[] = [
                { id: 'a1', icon: '✅', title: 'e-Rx issued — Sunita Shinde', sub: 'Ferrous Ascorbate 100mg · 30 days', time: '10m', badge: 'Dispensed', badgeColor: 'emerald' },
                { id: 'a2', icon: '🧪', title: 'Lab order — CBC + Lipid Panel', sub: 'Rajesh Kumar Shinde · Junnar Lab', time: '25m', badge: 'Pending', badgeColor: 'amber' },
                { id: 'a3', icon: '📹', title: 'Teleconsult completed — Priya Patil', sub: 'Otur PHC Spoke · BP 148/92', time: '1h', badge: 'Done', badgeColor: 'blue' },
                { id: 'a4', icon: '🚑', title: 'Referral sent — Junnar RH', sub: 'High-risk ANC · Obstetrics ward', time: '2h', badge: 'Amber', badgeColor: 'amber' },
                { id: 'a5', icon: '💊', title: 'e-Rx — Amlodipine 5mg', sub: 'Mohan Kale · Hypertension', time: '3h', badge: 'Dispensed', badgeColor: 'emerald' },
              ];
              return (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
                  {/* KPI Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <KpiCard label="Pending Queue" value={teleconsultQueue.length + appointments.length} icon={Activity} iconColor="text-blue-600" iconBg="bg-blue-100" trend="up" trendLabel="+2 today" urgency={teleconsultQueue.length + appointments.length > 5 ? 'warning' : 'normal'} onClick={() => setActiveTab('consultation')} />
                    <KpiCard label="e-Rx Issued Today" value={3} icon={Pill} iconColor="text-emerald-600" iconBg="bg-emerald-100" trend="up" trendLabel="+1 vs yday" />
                    <KpiCard label="Lab Orders" value={2} icon={FileText} iconColor="text-purple-600" iconBg="bg-purple-100" trend="flat" trendLabel="same" />
                    <KpiCard label="Referrals" value={1} icon={Send} iconColor="text-amber-600" iconBg="bg-amber-100" trend="down" trendLabel="-1 vs yday" />
                  </div>

                  {/* Alerts */}
                  <div className="space-y-2">
                    {teleconsultQueue.filter(q => q.urgency === 'red').length > 0 && (
                      <AlertBanner type="critical" title="🔴 RED triage patient waiting" message={`${teleconsultQueue.filter(q => q.urgency === 'red')[0]?.patientName || 'Patient'} — immediate consultation required`} action={{ label: 'See Now', onClick: () => { setSelectedQueueItem(teleconsultQueue.find(q => q.urgency === 'red')); setActiveTab('consultation'); } }} />
                    )}
                    <AlertBanner type="warning" title="Lab report ready for review" message="Sunita Shinde — Hb 8.2 g/dL (Critical). Action required." action={{ label: 'Review', onClick: () => setActiveTab('record_lab') }} />
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <SectionHeader title="Quick Actions" sub="Jump directly to key workflows" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <QuickAction icon={Video} label="Start Consult" sub="Next patient" color="bg-blue-700 text-white" onClick={() => { setSelectedQueueItem(teleconsultQueue[0] || appointments[0]); setActiveTab('consultation'); }} pulse={!!(teleconsultQueue.length + appointments.length)} />
                      <QuickAction icon={Pill} label="Write e-Rx" sub="Rx builder" color="bg-emerald-700 text-white" onClick={() => setActiveTab('rx_builder')} />
                      <QuickAction icon={FileText} label="Order Lab" sub="Lab requisition" color="bg-purple-700 text-white" onClick={() => setActiveTab('lab_order')} />
                      <QuickAction icon={Send} label="Refer Patient" sub="Specialist" color="bg-amber-600 text-white" onClick={() => setActiveTab('referral')} />
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
                      <SectionHeader title="Today's Activity" sub="Live clinical feed" />
                      <ActivityFeed items={doctorActivity} maxItems={5} />
                    </div>
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
                      <SectionHeader title="Clinic Performance" sub="Today vs target" />
                      <ProgressBar value={teleconsultQueue.length + appointments.length} max={20} color="bg-blue-500" label="Queue Served" />
                      <ProgressBar value={3} max={10} color="bg-emerald-500" label="e-Prescriptions" />
                      <ProgressBar value={1} max={5} color="bg-amber-500" label="Referrals Issued" />
                      <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
                        <div className="flex justify-between"><span>Avg consult time</span><span className="font-bold text-slate-800">12 mins</span></div>
                        <div className="flex justify-between mt-1"><span>Patient satisfaction</span><span className="font-bold text-emerald-700">⭐ 4.8/5</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* TAB 1: CLINICAL EVALUATION */}
            {activeTab === 'consultation' && (
              <div className="space-y-4">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">Doctor's Clinical Impression & Treatment Notes</label>
                  <textarea
                    rows={4}
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActiveTab('rx_builder')}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Proceed to e-Prescription</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: RX BUILDER */}
            {activeTab === 'rx_builder' && (
              <div className="space-y-4">
                <div className="divide-y divide-slate-100">
                  {rxItems.map((rx, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{rx.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {rx.dosage} • {rx.frequency} • {rx.duration}
                        </div>
                      </div>
                      <button onClick={() => handleRemoveMedication(idx)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Medicine Row */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block text-[11px]">Add Formulation</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Medicine Name (e.g. Amlodipine 5mg)"
                      value={draftMedName}
                      onChange={(e) => setDraftMedName(e.target.value)}
                      className="sm:col-span-2 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Frequency (1-0-1)"
                      value={draftFrequency}
                      onChange={(e) => setDraftFrequency(e.target.value)}
                      className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddMedication}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">e-Aushadhi Sync Active</span>
                  <button
                    onClick={handleIssuePrescription}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 px-6 rounded-2xl text-xs transition-colors shadow-md flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sign & Transmit e-Prescription</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: LAB REQUISITION */}
            {activeTab === 'lab_order' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 block">Select Diagnostic Requisitions for Central Lab:</span>
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    {selectedTests.length} investigations selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableTests.map((test) => {
                    const isChecked = selectedTests.includes(test);
                    return (
                      <button
                        key={test}
                        type="button"
                        onClick={() => toggleTest(test)}
                        className={`p-3 rounded-xl border text-left font-bold transition-all flex items-center justify-between shadow-2xs ${
                          isChecked ? 'bg-blue-50 border-blue-500 text-blue-950 ring-1 ring-blue-300' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{isChecked ? `✓ ${test}` : `+ ${test}`}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Lab Test / Investigation Input */}
                {isAddingCustomTest ? (
                  <form 
                    onSubmit={handleAddCustomTest} 
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-blue-50/70 border-2 border-blue-400 rounded-2xl p-3 shadow-xs"
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder="Type custom test name (e.g. D-Dimer, Troponin I, Chest X-Ray PA View)..."
                      value={newTestInput}
                      onChange={(e) => setNewTestInput(e.target.value)}
                      className="px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 grow"
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsAddingCustomTest(false);
                          setNewTestInput('');
                        }
                      }}
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="submit"
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Investigation</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCustomTest(false);
                          setNewTestInput('');
                        }}
                        className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-300 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomTest(true)}
                    className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Custom Lab Test / Investigation</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={selectedTests.length === 0}
                  onClick={handleDispatchLabOrders}
                  className={`w-full font-bold py-3 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 ${
                    selectedTests.length === 0 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-700 hover:bg-blue-800 text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch {selectedTests.length} Requisitions to Diagnostic Wing</span>
                </button>
              </div>
            )}

            {/* TAB 4: SPECIALIST REFERRAL */}
            {activeTab === 'referral' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Target Specialty Center</label>
                  <select
                    value={referralTarget}
                    onChange={(e) => setReferralTarget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="Junnar Rural Hospital & Trauma Centre">Junnar Rural Hospital & Trauma Centre</option>
                    <option value="Pune Sassoon General Hospital">Pune Sassoon General Hospital</option>
                    <option value="Nandurbar District Civil Hospital">Nandurbar District Civil Hospital</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Clinical Indication for Transfer</label>
                  <textarea
                    rows={3}
                    value={referralNotes}
                    onChange={(e) => setReferralNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
                  />
                </div>

                <button
                  onClick={handleCreateSpecialistReferral}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Issue Inter-Facility Referral Slip</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* LIVE TELECONSULTATION VIDEO SUITE (ZOOM / AGORA COMPATIBLE) */}
      {isLiveConsulting && selectedQueueItem && (
        <VideoConsultationRoom
          isOpen={isLiveConsulting}
          onClose={() => {
            setIsLiveConsulting(false);
            showToast('Teleconsultation session completed.');
          }}
          config={{
            channelName: `e-sanjeevani-${selectedQueueItem.tokenNumber || selectedQueueItem.appointmentToken || '9921'}`,
            userRole: 'doctor',
            participantName: 'Dr. Rohini Kulkarni, MD',
            remoteParticipantName: selectedQueueItem.patientName,
            remoteParticipantRole: 'Patient / Citizen Spoke',
            appointmentToken: selectedQueueItem.tokenNumber || selectedQueueItem.appointmentToken
          }}
          patientVitals={{
            bp: selectedQueueItem.vitals?.bp || '138/88 mmHg',
            pulse: selectedQueueItem.vitals?.pulse || '78 bpm',
            spo2: selectedQueueItem.vitals?.spo2 || '98%',
            sugar: selectedQueueItem.vitals?.sugar || '142 mg/dL',
            temp: selectedQueueItem.vitals?.temp || '98.6 °F'
          }}
          onIssuePrescription={() => {
            setIsLiveConsulting(false);
            setActiveTab('rx_builder');
            showToast('Opening e-Prescription builder for this consultation.');
          }}
        />
      )}

      {/* GLOBAL EDIT PROFILE MODAL */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

    </div>
  );
};
