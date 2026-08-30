import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { 
  Stethoscope, 
  Video, 
  UserPlus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Layers, 
  Send, 
  ShieldCheck, 
  Plus, 
  FileText, 
  ArrowRight,
  X,
  Bell,
  Package,
  Heart,
  User,
  Pill
} from 'lucide-react';
import { KpiCard, QuickAction, ActivityFeed, AlertBanner, SectionHeader, ProgressBar, ActivityItem } from '../common/DashboardWidgets';
import { EditProfileModal } from '../modals/EditProfileModal';

export const ChoPortal: React.FC = () => {
  const { showToast, language, setCurrentView, t } = useApp();
  const { 
    patients, 
    enqueueTeleconsult, 
    teleconsultQueue, 
    updatePatientVitals,
    medicines,
    updateMedicineStock,
    addNewStockConsignment,
    pocTests,
    logPocTest,
    directives,
    currentUser
  } = useHealthData();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'opd_queue' | 'triage_intake' | 'rapid_tests' | 'subcenter_stock'>('dashboard');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);

  // New Medicine Form State
  const [newMedName, setNewMedName] = useState('');
  const [newMedGeneric, setNewMedGeneric] = useState('');
  const [newMedCategory, setNewMedCategory] = useState('Essential Medicine');
  const [newMedStock, setNewMedStock] = useState('500');
  const [newMedUnit, setNewMedUnit] = useState('Tablets');
  const [newMedBatch, setNewMedBatch] = useState('BT-2026-01');
  const [newMedExpiry, setNewMedExpiry] = useState('2028-12-31');
  
  // Triage Intake Form State
  const [patientName, setPatientName] = useState<string>('Sunita Ravindra Shinde');
  const [patientAge, setPatientAge] = useState<number>(24);
  const [patientGender, setPatientGender] = useState<'Female' | 'Male'>('Female');
  const [patientVillage, setPatientVillage] = useState<string>('Khamgaon');
  const [complaint, setComplaint] = useState<string>('3rd Trimester pregnancy checkup, fatigue, and headache. Hb low (8.2 g/dL).');
  const [urgency, setUrgency] = useState<'red' | 'amber' | 'green'>('amber');
  const [bp, setBp] = useState<string>('138/92');
  const [pulse, setPulse] = useState<string>('88');
  const [spo2, setSpo2] = useState<string>('98');
  const [temp, setTemp] = useState<string>('98.6');
  const [weight, setWeight] = useState<string>('52');

  // Rapid Test Log State
  const [testPatientName, setTestPatientName] = useState<string>('Sunita Ravindra Shinde');
  const [testVillage, setTestVillage] = useState<string>('Khamgaon');
  const [testType, setTestType] = useState<'Hemoglobin Rapid Strip' | 'Malaria RDT (Pv/Pf)' | 'Blood Sugar (RBS)' | 'Urine Albumin'>('Hemoglobin Rapid Strip');
  const [testFinding, setTestFinding] = useState<string>('8.2 g/dL (Severe Gestational Anemia)');
  const [isTestPanic, setIsTestPanic] = useState<boolean>(true);

  const handleQueueTeleconsult = async (e: React.FormEvent) => {
    e.preventDefault();
    const queued = await enqueueTeleconsult({
      patientName,
      patientAge,
      gender: patientGender,
      village: patientVillage,
      presentingComplaint: complaint,
      urgency,
      vitals: {
        bp: `${bp} mmHg`,
        pulse: `${pulse} bpm`,
        spo2: `${spo2}%`,
        temp: `${temp} °F`,
        weight: `${weight} kg`
      },
      connectedChoName: 'Pooja Jadhav, CHO',
      subCenterName: 'Khamgaon Ayushman Arogya Mandir'
    });

    showToast(`Case queued to Hub Specialist with Token #${queued.tokenNumber}`);
    setActiveTab('opd_queue');
  };

  const handleLogRapidTest = async (e: React.FormEvent) => {
    e.preventDefault();
    await logPocTest({
      patientName: testPatientName,
      patientVillage: testVillage,
      testType: testType,
      resultValue: testFinding,
      isAbnormal: isTestPanic,
      conductedBy: 'Pooja Jadhav, CHO',
      subCenterName: 'Khamgaon Ayushman Arogya Mandir'
    });

    showToast(`Logged rapid diagnostic result: ${testType} -> ${testFinding}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Active DHO Public Health Directives Alert Banner */}
        {directives.length > 0 && (
          <div className="bg-red-950 text-white rounded-2xl p-4 border border-red-800 shadow-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-800 text-red-200 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono bg-red-800 text-red-200 px-2 py-0.5 rounded font-black">
                    Official DHO Directive • {directives[0].code}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-white mt-0.5">{directives[0].title}</h4>
                <p className="text-xs text-red-200 line-clamp-1">{directives[0].body}</p>
              </div>
            </div>
            <button
              onClick={() => showToast('Directive acknowledged by Khamgaon Sub-Centre.')}
              className="bg-red-800 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors"
            >
              Acknowledge Directive
            </button>
          </div>
        )}

        {/* CHO Spoke Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold shadow-md">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">Pooja Jadhav, CHO</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {t.role_cho}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Khamgaon Sub-Centre • Attached to <strong>Otur PHC & Junnar Rural Hospital Telemedicine Hub</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.teleconsultQueueTitle}</span>
            <div className="text-2xl font-black text-emerald-800">
              {teleconsultQueue.filter(item => item.status === 'Waiting').length} Cases
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">{t.teleconsultActive}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.householdRoster}</span>
            <div className="text-2xl font-black text-slate-900">{patients.length} Citizens</div>
            <span className="text-[11px] text-slate-500 font-medium">ABDM ABHA Linked</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">POC Tests Logged</span>
            <div className="text-2xl font-black text-blue-700">{pocTests.length} Tests</div>
            <span className="text-[11px] text-blue-600 font-medium">Sub-Centre Lab</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.medicineStock}</span>
            <div className="text-2xl font-black text-emerald-700">96.4%</div>
            <span className="text-[11px] text-emerald-600 font-medium">Zero Stockout</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold w-full max-w-3xl gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('opd_queue')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'opd_queue' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.teleconsultQueueTitle} ({teleconsultQueue.length})
          </button>
          <button
            onClick={() => setActiveTab('triage_intake')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'triage_intake' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            + {t.subCenterTriage}
          </button>
          <button
            onClick={() => setActiveTab('rapid_tests')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'rapid_tests' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            POC Tests ({pocTests.length})
          </button>
          <button
            onClick={() => setActiveTab('subcenter_stock')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'subcenter_stock' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Drug Stock
          </button>
        </div>

        {/* TAB 0: CHO COMMAND CENTER DASHBOARD */}
        {activeTab === 'dashboard' && (() => {
          const redUrgent = teleconsultQueue.filter(item => item.urgency === 'red').length;
          const lowStockMeds = medicines.filter(m => m.currentStock <= m.reorderLevel).length;

          const choActivity: ActivityItem[] = [
            { id: 'c-1', icon: '📹', title: 'Teleconsultation Queued', sub: 'Sunita Shinde (3rd Tri ANC) · Token #9921', time: '10m ago', badge: 'RED Triage', badgeColor: 'red' },
            { id: 'c-2', icon: '🧪', title: 'POC Hemoglobin Done', sub: '8.2 g/dL · Severe Anemia alert sent', time: '20m ago', badge: 'Critical', badgeColor: 'amber' },
            { id: 'c-3', icon: '💊', title: 'Amlodipine 5mg Dispensed', sub: 'Rajesh Kumar (Hypertension refill)', time: '45m ago', badge: 'Dispensed', badgeColor: 'emerald' },
            { id: 'c-4', icon: '📋', title: 'DHO Circular Received', sub: 'Monsoon Dengue & Malaria Larval Survey', time: '2h ago', badge: 'Directive', badgeColor: 'blue' },
            { id: 'c-5', icon: '🩸', title: 'Random Blood Sugar Checked', sub: 'Ramesh Thoke · 142 mg/dL (Normal)', time: '3h ago', badge: 'Normal', badgeColor: 'purple' }
          ];

          return (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard
                  label="Teleconsult Queue"
                  value={teleconsultQueue.length}
                  icon={Video}
                  iconColor="text-teal-600"
                  iconBg="bg-teal-100"
                  trend="up"
                  trendLabel="Active link"
                  urgency={redUrgent > 0 ? 'critical' : 'normal'}
                  onClick={() => setActiveTab('opd_queue')}
                />
                <KpiCard
                  label="POC Tests Logged"
                  value={pocTests.length}
                  icon={Activity}
                  iconColor="text-blue-600"
                  iconBg="bg-blue-100"
                  trend="up"
                  trendLabel="+4 today"
                  onClick={() => setActiveTab('rapid_tests')}
                />
                <KpiCard
                  label="Sub-Centre Drug Stock"
                  value={96}
                  suffix="%"
                  icon={Package}
                  iconColor="text-emerald-600"
                  iconBg="bg-emerald-100"
                  trend="flat"
                  trendLabel="Zero stockout"
                  onClick={() => setActiveTab('subcenter_stock')}
                />
                <KpiCard
                  label="DHO Directives"
                  value={directives.length}
                  icon={Bell}
                  iconColor="text-amber-600"
                  iconBg="bg-amber-100"
                  trend="down"
                  trendLabel="Actioned"
                />
              </div>

              {/* Status Alert Banners */}
              <div className="space-y-2">
                {redUrgent > 0 && (
                  <AlertBanner
                    type="critical"
                    title="🔴 Immediate Specialist Teleconsult Required"
                    message="High-risk pregnancy triage queued with maternal anemia & elevated blood pressure."
                    action={{ label: 'Open Video Queue', onClick: () => setActiveTab('opd_queue') }}
                  />
                )}
                {lowStockMeds > 0 && (
                  <AlertBanner
                    type="warning"
                    title="Sub-Centre Drug Threshold Warning"
                    message={`${lowStockMeds} essential medicines approaching reorder point at Khamgaon Sub-Centre.`}
                    action={{ label: 'Check Stock', onClick: () => setActiveTab('subcenter_stock') }}
                  />
                )}
              </div>

              {/* Quick Action Grid */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <SectionHeader title="Clinical Quick Actions" sub="Frontline Sub-Centre workflows" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <QuickAction
                    icon={Stethoscope}
                    label="Triage Intake"
                    sub="Log symptoms & vitals"
                    color="bg-teal-700 text-white"
                    onClick={() => setActiveTab('triage_intake')}
                  />
                  <QuickAction
                    icon={Activity}
                    label="Log POC Test"
                    sub="Strip / RDT / Glucose"
                    color="bg-blue-700 text-white"
                    onClick={() => setActiveTab('rapid_tests')}
                  />
                  <QuickAction
                    icon={Video}
                    label="e-Sanjeevani Queue"
                    sub="Connect to MD Doctor"
                    color="bg-emerald-700 text-white"
                    onClick={() => setActiveTab('opd_queue')}
                    pulse={teleconsultQueue.length > 0}
                  />
                  <QuickAction
                    icon={Package}
                    label="Inventory Kit"
                    sub="Medicine stock update"
                    color="bg-slate-800 text-white"
                    onClick={() => setActiveTab('subcenter_stock')}
                  />
                </div>
              </div>

              {/* Activity Feed & Sub-Centre Health Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                  <SectionHeader
                    title="Today's Sub-Centre Stream"
                    sub="Real-time OPD & Tele-Clinic intake"
                    action={<button onClick={() => setActiveTab('opd_queue')} className="text-xs text-teal-700 font-bold hover:underline">View Queue</button>}
                  />
                  <ActivityFeed items={choActivity} maxItems={5} />
                </div>

                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <SectionHeader title="Ayushman Mandir Goals" sub="Khamgaon Village Health Metrics" />
                  <ProgressBar value={14} max={16} color="bg-teal-500" label="Daily OPD Consults (88%)" />
                  <ProgressBar value={5} max={5} color="bg-emerald-500" label="Teleconsultations Completed (100%)" />
                  <ProgressBar value={9} max={10} color="bg-blue-500" label="NCD Strip Blood Sugar Checks (90%)" />
                  <ProgressBar value={100} max={100} color="bg-purple-500" label="ABHA EHR Integration (100%)" />

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Sub-Centre Performance</span>
                    <span className="font-black text-teal-800">⭐⭐⭐⭐⭐ Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 1: LIVE OPD QUEUE */}
        {activeTab === 'opd_queue' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-base text-slate-900">Queued Teleconsultations for Specialist Hub</h3>
                <span className="text-xs text-slate-500 font-mono">e-Sanjeevani Active Link</span>
              </div>

              <div className="divide-y divide-slate-100">
                {teleconsultQueue.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                          {item.tokenNumber}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{item.patientName}</h4>
                        <span className="text-xs text-slate-500">({item.gender}, {item.patientAge} yrs)</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          item.urgency === 'red' ? 'bg-red-100 text-red-800 border border-red-300' :
                          item.urgency === 'amber' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {item.urgency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{item.presentingComplaint}</p>
                      <div className="text-[11px] text-slate-400 font-mono">
                        BP: {item.vitals.bp} • Pulse: {item.vitals.pulse} • SpO2: {item.vitals.spo2} • Temp: {item.vitals.temp}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                        item.status === 'Waiting' ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse' :
                        item.status === 'Prescription Issued' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {item.status}
                      </span>
                      <button
                        onClick={() => {
                          showToast(`Joined teleconsultation session for Token #${item.tokenNumber}`);
                          setCurrentView('doctor');
                        }}
                        className="bg-[#003527] hover:bg-[#064e3b] text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Join Call</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRIAGE & INTAKE */}
        {activeTab === 'triage_intake' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Walk-in Triage & e-Sanjeevani Escalation</h3>
              <p className="text-xs text-slate-500">Record comprehensive clinical vitals and transmit patient token to Specialist Doctor Hub.</p>
            </div>

            <form onSubmit={handleQueueTeleconsult} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Village / Habitat</label>
                  <input
                    type="text"
                    value={patientVillage}
                    onChange={(e) => setPatientVillage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Age & Gender</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(Number(e.target.value))}
                      className="w-16 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs font-bold text-slate-900 text-center"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Triage Severity Rating</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="amber">Amber (Urgent Teleconsult within 30 min)</option>
                    <option value="red">Red (Critical Emergency / Immediate)</option>
                    <option value="green">Green (Routine Outpatient Review)</option>
                  </select>
                </div>
              </div>

              {/* Vitals Input Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-2">
                <div>
                  <label className="text-slate-500 font-bold block mb-1">BP (mmHg)</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-bold block mb-1">Pulse (bpm)</label>
                  <input
                    type="text"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-bold block mb-1">SpO2 (%)</label>
                  <input
                    type="text"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-bold block mb-1">Temp (°F)</label>
                  <input
                    type="text"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-bold block mb-1">Weight (kg)</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold text-xs block mb-1">Chief Complaint & Onset History</label>
                <textarea
                  rows={3}
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Transmit Vitals & Queue e-Sanjeevani Token</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: POINT-OF-CARE RAPID TESTS */}
        {activeTab === 'rapid_tests' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Log Point-of-Care Rapid Diagnostic Result</h3>
                <p className="text-xs text-slate-500">Record on-site Sub-Centre testing (Hemoglobin, Malaria RDT, Urine Albumin, Blood Glucose).</p>
              </div>

              <form onSubmit={handleLogRapidTest} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Patient Name</label>
                    <input
                      type="text"
                      value={testPatientName}
                      onChange={(e) => setTestPatientName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Village</label>
                    <input
                      type="text"
                      value={testVillage}
                      onChange={(e) => setTestVillage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Test Type</label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="Hemoglobin Rapid Strip">Hemoglobin Rapid Strip (Digital Hb)</option>
                    <option value="Malaria RDT (Pv/Pf)">Malaria Rapid Antigen Dipstick (Pv/Pf)</option>
                    <option value="Blood Sugar (RBS)">Blood Glucose Strip (Glucometer RBS)</option>
                    <option value="Urine Albumin">Urine Albumin & Sugar Dipstick</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Result Finding & Units</label>
                  <input
                    type="text"
                    value={testFinding}
                    onChange={(e) => setTestFinding(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="panicVal"
                    checked={isTestPanic}
                    onChange={(e) => setIsTestPanic(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                  />
                  <label htmlFor="panicVal" className="text-xs font-bold text-red-700 cursor-pointer">
                    Flag as Critical Panic Value (Auto-Alert Medical Officer)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md"
                >
                  Save & Attach to Patient Electronic Record
                </button>
              </form>
            </div>

            {/* Logged Tests List */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">Recent Rapid Tests Logged ({pocTests.length})</h3>
              {pocTests.map((t) => (
                <div key={t.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{t.patientName} ({t.patientVillage})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.isAbnormal ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {t.isAbnormal ? 'Abnormal Flag' : 'Normal'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>{t.testType}:</strong> <span className="font-bold text-slate-900">{t.resultValue}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Conducted by: {t.conductedBy}</span>
                    <span>{t.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: SUBCENTER DRUG KIT */}
        {activeTab === 'subcenter_stock' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Sub-Centre Essential Drug Kit A & B Ledger</h3>
                <p className="text-xs text-slate-500">Live inventory synchronized with e-Aushadhi state procurement warehouse.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddMedOpen(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine to Kit</span>
                </button>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300">
                  e-Aushadhi Connected
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {medicines.map((med) => (
                <div key={med.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{med.code}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      med.status === 'In Stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {med.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{med.name}</h4>
                    <p className="text-[11px] text-slate-500">{med.category} • Batch: {med.batchNumber}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span className="font-extrabold text-slate-900">{med.currentStock} {med.unit}</span>
                    <button
                      onClick={() => updateMedicineStock(med.id, -10)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                    >
                      Dispense 10
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Medicine Modal */}
            {isAddMedOpen && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900">Add New Medicine to Drug Kit</h4>
                        <p className="text-xs text-slate-500">Record stock intake in Sub-Centre e-Aushadhi ledger</p>
                      </div>
                    </div>
                    <button onClick={() => setIsAddMedOpen(false)} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newMedName.trim()) return;
                      await addNewStockConsignment({
                        name: newMedName.trim(),
                        genericName: newMedGeneric.trim() || newMedName.trim(),
                        category: newMedCategory,
                        currentStock: parseInt(newMedStock, 10) || 500,
                        unit: newMedUnit,
                        batchNumber: newMedBatch.trim() || `BT-${Date.now().toString().slice(-4)}`,
                        expiryDate: newMedExpiry,
                        reorderLevel: 200,
                        status: 'In Stock',
                        location: 'Rack C-1',
                        lastDispensedDate: 'Today'
                      });
                      showToast(`Added ${newMedName} (${newMedStock} ${newMedUnit}) to Sub-Centre Drug Kit!`);
                      setIsAddMedOpen(false);
                      setNewMedName('');
                      setNewMedGeneric('');
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Medicine / Formulation Name *</label>
                      <input
                        type="text"
                        required
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        placeholder="e.g. Metformin 500mg Tablets IP / ORS Sachet"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Category</label>
                        <select
                          value={newMedCategory}
                          onChange={(e) => setNewMedCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        >
                          <option value="Essential Medicine">Essential Medicine</option>
                          <option value="Maternal Supplement">Maternal Supplement</option>
                          <option value="Analgesic">Analgesic / Antipyretic</option>
                          <option value="Antibiotic">Antibiotic</option>
                          <option value="Antihypertensive">Antihypertensive</option>
                          <option value="Antidiabetic">Antidiabetic</option>
                          <option value="Oral Rehydration">Oral Rehydration (ORS)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Unit of Dispensing</label>
                        <select
                          value={newMedUnit}
                          onChange={(e) => setNewMedUnit(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        >
                          <option value="Tablets">Tablets</option>
                          <option value="Capsules">Capsules</option>
                          <option value="Bottles">Bottles (Syrup/Suspension)</option>
                          <option value="Sachets">Sachets (ORS/Powder)</option>
                          <option value="Vials">Vials / Injections</option>
                          <option value="Tubes">Tubes (Ointment)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Stock Quantity *</label>
                        <input
                          type="number"
                          required
                          value={newMedStock}
                          onChange={(e) => setNewMedStock(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Batch Number</label>
                        <input
                          type="text"
                          value={newMedBatch}
                          onChange={(e) => setNewMedBatch(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                        <input
                          type="date"
                          value={newMedExpiry}
                          onChange={(e) => setNewMedExpiry(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddMedOpen(false)}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl shadow-md flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add to Inventory</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Global Edit Profile Modal */}
        <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />

      </div>
    </div>
  );
};
