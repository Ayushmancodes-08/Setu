import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { bhashiniAI } from '../../services/bhashiniService';
import { 
  User, 
  Video, 
  FileText, 
  Clock, 
  Pill, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Volume2, 
  Stethoscope,
  QrCode,
  ArrowRight,
  ExternalLink,
  Heart,
  Printer,
  X,
  FileCheck2
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const { language, showToast, setIsEmergencyModalOpen, setCurrentView } = useApp();
  const { patients, teleconsultQueue, facilities } = useHealthData();

  // Active patient (Sunita Shinde or first registered patient)
  const patient = patients.find(p => p.id === 'p-001') || patients[0] || {
    id: 'p-001',
    name: 'Sunita Ravindra Shinde',
    age: 24,
    gender: 'Female',
    abhaId: '91-4821-9902-3312',
    village: 'Khamgaon',
    taluka: 'Junnar',
    district: 'Pune',
    assignedAsha: 'Manisha Kadam',
    vitals: {
      bp: '138/92 mmHg',
      pulse: '88 bpm',
      spo2: '98%',
      temp: '98.6 °F',
      weight: '52 kg'
    },
    activePrescriptions: [
      {
        id: 'rx-1',
        medicineName: 'Ferrous Ascorbate + Folic Acid Tablets',
        dosage: '1 Tab (100mg + 1.5mg)',
        frequency: '1-0-1 (Twice Daily)',
        duration: '30 Days',
        instructions: 'Take after meals with water. Avoid milk or tea within 1 hour.',
        prescribedBy: 'Dr. Rohini Kulkarni, MD',
        prescribedAt: 'Today, 10:15 AM',
        status: 'Pending Dispensing' as const
      },
      {
        id: 'rx-2',
        medicineName: 'Calcium Carbonate + Vitamin D3 Tablets',
        dosage: '1 Tab (500mg + 250IU)',
        frequency: '0-1-0 (Afternoon)',
        duration: '30 Days',
        instructions: 'Take after lunch with water.',
        prescribedBy: 'Dr. Rohini Kulkarni, MD',
        prescribedAt: 'Today, 10:15 AM',
        status: 'Pending Dispensing' as const
      }
    ],
    recentLabReports: [
      {
        id: 'lab-1',
        testName: 'Complete Blood Count (CBC) & Hemoglobin',
        result: 'Hemoglobin: 8.2 g/dL (Severe Gestational Anemia)',
        referenceRange: '12.0 - 15.5 g/dL (Female Normal)',
        status: 'Critical' as const,
        reportedAt: 'Today, 09:45 AM'
      },
      {
        id: 'lab-2',
        testName: 'Serum Ferritin & Iron Studies',
        result: 'Serum Ferritin: 11.4 ng/mL (Iron Depletion)',
        referenceRange: '30.0 - 150.0 ng/mL',
        status: 'Abnormal' as const,
        reportedAt: 'Today, 09:45 AM'
      }
    ]
  };

  const [activeTab, setActiveTab] = useState<'prescriptions' | 'teleconsult' | 'lab_reports' | 'abha_card'>('prescriptions');
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [speakingItem, setSpeakingItem] = useState<string | null>(null);

  // Lab Report Slip Download Modal State
  const [selectedLabReport, setSelectedLabReport] = useState<any>(null);

  const handleSpeakPrescription = (medName: string, instructions: string) => {
    setSpeakingItem(medName);
    const text = language === 'mr' 
      ? `औषधाचे नाव: ${medName}. घेण्याची पद्धत: ${instructions}.`
      : `Medicine: ${medName}. Directions: ${instructions}.`;
    bhashiniAI.speakText(text, language === 'mr' ? 'mr' : 'en', () => {
      setSpeakingItem(null);
    });
  };

  const handleDownloadLabSlip = (report: any) => {
    setSelectedLabReport(report);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Patient Profile & ABHA Identity Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-700 to-[#003527] text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
              {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PT'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{patient.name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  ABHA Linked & Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                ABHA ID: <span className="font-bold text-slate-800">{patient.abhaId}</span> • Age: {patient.age}y ({patient.gender}) • {patient.village}, {patient.taluka}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  MJPJAY & PM-JAY Eligible
                </span>
                <span>•</span>
                <span>Assigned ASHA: <strong className="text-slate-800">{patient.assignedAsha || 'Manisha Kadam'}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('abha_card')}
              className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-700" />
              <span>Digital ABHA Pass</span>
            </button>

            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              <span>Emergency 108 SOS</span>
            </button>
          </div>
        </div>

        {/* Clinical Vitals Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="p-2 border-r border-slate-100 last:border-0">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Blood Pressure</span>
            <span className="font-extrabold text-slate-900 text-sm">{patient.vitals.bp || '120/80 mmHg'}</span>
          </div>
          <div className="p-2 border-r border-slate-100 last:border-0">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Pulse Rate</span>
            <span className="font-extrabold text-slate-900 text-sm">{patient.vitals.pulse || '78 bpm'}</span>
          </div>
          <div className="p-2 border-r border-slate-100 last:border-0">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Oxygen (SpO2)</span>
            <span className="font-extrabold text-emerald-700 text-sm">{patient.vitals.spo2 || '98%'}</span>
          </div>
          <div className="p-2">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Temperature</span>
            <span className="font-extrabold text-slate-900 text-sm">{patient.vitals.temp || '98.4 °F'}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold w-full max-w-xl">
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'prescriptions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Active e-Rx ({patient.activePrescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('teleconsult')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'teleconsult' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            e-Sanjeevani Room
          </button>
          <button
            onClick={() => setActiveTab('lab_reports')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'lab_reports' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Diagnostic Reports ({patient.recentLabReports.length})
          </button>
          <button
            onClick={() => setActiveTab('abha_card')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'abha_card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ABHA Pass
          </button>
        </div>

        {/* TAB 1: PRESCRIPTIONS WITH AUDIO READOUT */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Current Doctor e-Prescriptions</h3>
                  <p className="text-xs text-slate-500">Includes AI Bhashini Marathi voice directions for illiterate and rural patients.</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-xl">
                  e-Aushadhi Sync Active
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {patient.activePrescriptions.map((rx) => (
                  <div key={rx.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{rx.medicineName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rx.status === 'Dispensed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rx.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        <strong>Dosage:</strong> {rx.dosage} • <strong>Timing:</strong> {rx.frequency} • <strong>Duration:</strong> {rx.duration}
                      </div>
                      <div className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                        🗣️ <em>"{rx.instructions}"</em>
                      </div>
                      <div className="text-[11px] text-slate-400">Prescribed by {rx.prescribedBy} • {rx.prescribedAt}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakPrescription(rx.medicineName, rx.instructions)}
                        disabled={speakingItem === rx.medicineName}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Volume2 className={`w-4 h-4 ${speakingItem === rx.medicineName ? 'animate-bounce text-emerald-600' : ''}`} />
                        <span>{speakingItem === rx.medicineName ? 'Playing Voice...' : 'Listen (मराठी आवाजात ऐका)'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TELECONSULTATION ROOM */}
        {activeTab === 'teleconsult' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {!isCalling ? (
              <div className="text-center py-10 space-y-4 max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
                  <Video className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">e-Sanjeevani Video Teleconsultation</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect directly with Dr. Rohini Kulkarni (OBGYN Specialist, Junnar Rural Hospital Hub) from your village Sub-Centre.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsCalling(true);
                      showToast('Connecting to e-Sanjeevani HD encrypted clinical stream...');
                    }}
                    className="bg-[#003527] hover:bg-[#064e3b] text-white font-bold px-6 py-3.5 rounded-2xl text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4 text-emerald-400" />
                    <span>Join Video Consultation Room</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('doctor')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold px-6 py-3 rounded-2xl text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Stethoscope className="w-4 h-4 text-blue-700" />
                    <span>Switch to Doctor Hub View</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-950 text-white rounded-3xl p-6 relative aspect-video flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800">
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-bold text-white">Dr. Rohini Kulkarni, MD</span>
                      <span className="text-slate-400">| Junnar Hospital</span>
                    </div>

                    <div className="bg-emerald-950/80 border border-emerald-600 px-3 py-1 rounded-xl text-xs text-emerald-300 font-mono">
                      e-Sanjeevani HD 1080p Stream Active
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center py-4">
                    <div className="text-center space-y-3">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 p-1 mx-auto shadow-2xl shadow-emerald-500/20">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-white/20">
                          <Stethoscope className="w-12 h-12 text-emerald-300" />
                        </div>
                      </div>
                      <div>
                        <div className="font-extrabold text-lg text-white">Dr. Rohini Kulkarni</div>
                        <div className="text-xs text-emerald-400">Consulting with {patient.name} (Khamgaon Sub-Centre Spoke)</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between z-10 pt-3 border-t border-slate-800">
                    <div className="text-xs text-slate-300 hidden sm:flex items-center gap-3">
                      <span>BP: <strong className="text-emerald-400">{patient.vitals.bp}</strong></span>
                      <span>SpO2: <strong className="text-blue-400">{patient.vitals.spo2}</strong></span>
                      <span>Pulse: <strong className="text-amber-400">{patient.vitals.pulse}</strong></span>
                    </div>

                    <div className="flex items-center gap-3 mx-auto sm:mx-0">
                      <button
                        onClick={() => setCurrentView('doctor')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Stethoscope className="w-4 h-4" />
                        <span>Doctor Console</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsCalling(false);
                          showToast('Teleconsultation completed. Prescription updated.');
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-6 rounded-full transition-all flex items-center gap-1.5 shadow-lg"
                      >
                        <PhoneCall className="w-4 h-4 rotate-[135deg]" />
                        <span>End Consultation</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DIAGNOSTIC LAB REPORTS */}
        {activeTab === 'lab_reports' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Verified Diagnostic Lab Reports</h3>
                <p className="text-xs text-slate-500">Directly synchronized with PHC / Rural Hospital Diagnostic Laboratory.</p>
              </div>
            </div>

            <div className="space-y-3">
              {patient.recentLabReports.map((lab) => (
                <div key={lab.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{lab.testName}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        lab.status === 'Abnormal' || lab.status === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {lab.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      <strong>Result:</strong> <span className="font-bold text-slate-900">{lab.result}</span> • Reference Range: {lab.referenceRange}
                    </div>
                    <div className="text-[11px] text-slate-400">Reported on {lab.reportedAt} • Verified by Medical Specialist</div>
                  </div>

                  <button
                    onClick={() => handleDownloadLabSlip(lab)}
                    className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-700" />
                    <span>Download / Print Official Slip</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DIGITAL ABHA HEALTH PASS */}
        {activeTab === 'abha_card' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-[#003527] to-teal-800 rounded-3xl p-6 text-white shadow-xl space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">National Health Authority</div>
                  <div className="text-xl font-black">Ayushman Bharat Digital Health Card</div>
                </div>
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-xs font-mono text-xs font-bold">
                  ABDM L3
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="w-16 h-16 rounded-xl bg-white text-[#003527] flex items-center justify-center text-xl font-black shadow-md">
                  SR
                </div>
                <div>
                  <div className="text-lg font-bold">{patient.name}</div>
                  <div className="text-xs text-emerald-200 font-mono">{patient.abhaId}</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">DOB: 12/04/2002 • Gender: Female</div>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-800/80 flex items-center justify-between text-xs font-mono">
                <span>📍 {patient.village}, {patient.taluka}</span>
                <span>Government of Maharashtra</span>
              </div>
            </div>

            <button
              onClick={() => {
                window.print();
                showToast('Printed official ABHA Health Pass');
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print ABHA Identity Pass</span>
            </button>
          </div>
        )}

      </div>

      {/* Official Diagnostic Report Slip Modal */}
      {selectedLabReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header with Govt / Hospital Seal */}
            <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
              <div>
                <div className="text-[10px] uppercase font-black tracking-wider text-emerald-800">
                  Government of Maharashtra • Directorate of Health Services
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  Junnar Rural Hospital & Diagnostic Pathology Laboratory
                </h2>
                <p className="text-xs text-slate-500">
                  National Accreditation Board for Testing and Calibration Laboratories (NABL) Certified
                </p>
              </div>
              <button
                onClick={() => setSelectedLabReport(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient & Report Metadata Grid */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Patient Name</span>
                <span className="font-extrabold text-slate-900">{patient.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">ABHA Number</span>
                <span className="font-mono font-bold text-slate-900">{patient.abhaId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Age / Gender</span>
                <span className="font-bold text-slate-900">{patient.age} Yrs / {patient.gender}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Sample Collected At</span>
                <span className="font-bold text-slate-800">Khamgaon Sub-Centre Spoke</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Reporting Date</span>
                <span className="font-bold text-slate-800">{selectedLabReport.reportedAt}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Referring Doctor</span>
                <span className="font-bold text-blue-700">Dr. Rohini Kulkarni, MD</span>
              </div>
            </div>

            {/* Test Investigation Findings Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <div className="bg-slate-900 text-white p-3 font-bold grid grid-cols-3">
                <span>Test Investigation</span>
                <span>Observed Result</span>
                <span>Biological Reference Range</span>
              </div>
              <div className="p-4 grid grid-cols-3 items-center border-t border-slate-100 bg-white">
                <span className="font-extrabold text-slate-900">{selectedLabReport.testName}</span>
                <span className={`font-black ${selectedLabReport.status === 'Critical' ? 'text-red-600' : 'text-slate-900'}`}>
                  {selectedLabReport.result}
                </span>
                <span className="text-slate-600 font-mono">{selectedLabReport.referenceRange}</span>
              </div>
            </div>

            {/* Verification Seal & Doctor Sign-off */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="font-bold block">Digitally Signed & Validated</span>
                  <span className="text-[10px] text-slate-500 font-mono">Hash: ABDM-LAB-9921-VERIFIED</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-slate-900 block">Dr. Rohini Kulkarni, MD</span>
                <span className="text-[10px] text-slate-500">Medical Officer In-Charge (MMC-2014-99812)</span>
              </div>
            </div>

            {/* Print / Save Action */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handlePrintSlip}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
