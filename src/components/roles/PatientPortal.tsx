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
  Heart
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const { language, showToast, setIsEmergencyModalOpen, setCurrentView } = useApp();
  const { patients, teleconsultQueue, facilities } = useHealthData();

  // Active patient (Sunita Shinde)
  const patient = patients.find(p => p.id === 'p-001') || patients[0];
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'teleconsult' | 'lab_reports' | 'abha_card'>('prescriptions');
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [speakingItem, setSpeakingItem] = useState<string | null>(null);

  const handleSpeakPrescription = (medName: string, instructions: string) => {
    setSpeakingItem(medName);
    const text = language === 'mr' 
      ? `औषधाचे नाव: ${medName}. घेण्याची पद्धत: ${instructions}.`
      : `Medicine: ${medName}. Directions: ${instructions}.`;
    bhashiniAI.speakText(text, language === 'mr' ? 'mr' : 'en', () => {
      setSpeakingItem(null);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Patient Profile & ABHA Identity Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-700 to-[#003527] text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
              SR
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
                <span>Assigned ASHA: <strong className="text-slate-800">{patient.assignedAsha}</strong></span>
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
            <span className="font-extrabold text-slate-900 text-sm">{patient.vitals.bp}</span>
            <span className="text-[10px] text-amber-600 block font-medium">Mild High (Monitor)</span>
          </div>
          <div className="p-2 border-r border-slate-100 last:border-0">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Hemoglobin (Hb)</span>
            <span className="font-extrabold text-red-700 text-sm">{patient.vitals.hemoglobin || '8.2 g/dL'}</span>
            <span className="text-[10px] text-red-600 block font-medium">Anemia (Active Treatment)</span>
          </div>
          <div className="p-2 border-r border-slate-100 last:border-0">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Oxygen SpO2</span>
            <span className="font-extrabold text-emerald-700 text-sm">{patient.vitals.spo2}</span>
            <span className="text-[10px] text-emerald-600 block font-medium">Normal / Optimal</span>
          </div>
          <div className="p-2">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Risk Assessment</span>
            <span className="font-extrabold text-red-700 text-sm">{patient.riskLevel} (ANC 32W)</span>
            <span className="text-[10px] text-slate-500 block font-medium">Assigned to Junnar RH</span>
          </div>
        </div>

        {/* Portal Tabs Bar */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
          {[
            { id: 'prescriptions', label: 'Active e-Prescriptions', icon: Pill, count: patient.activePrescriptions.length },
            { id: 'teleconsult', label: 'e-Sanjeevani Teleconsultation', icon: Stethoscope, count: 1 },
            { id: 'lab_reports', label: 'Diagnostic Lab Reports', icon: FileText, count: patient.recentLabReports.length },
            { id: 'abha_card', label: 'ABHA Health Pass & QR', icon: QrCode }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#003527] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.2 text-[10px] rounded-full font-extrabold ${
                    isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ACTIVE DIGITAL PRESCRIPTIONS */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Current Digitally Signed e-Prescriptions</h3>
                  <p className="text-xs text-slate-500">Synced directly with Junnar Rural Hospital Pharmacy & e-Aushadhi stock.</p>
                </div>
                <button
                  onClick={() => showToast('Prescription PDF downloaded to device storage.')}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Rx PDF</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patient.activePrescriptions.map((rx) => (
                  <div key={rx.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-extrabold text-sm text-slate-900">{rx.medicineName}</div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rx.status === 'Dispensed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rx.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Dosage</span>
                          <span className="font-bold text-slate-800">{rx.dosage}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Frequency</span>
                          <span className="font-bold text-emerald-700">{rx.frequency}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Duration</span>
                          <span className="font-bold text-slate-800">{rx.duration}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 font-medium">
                        <strong>Directions:</strong> {rx.instructions}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-mono">By {rx.prescribedBy}</span>
                      <button
                        onClick={() => handleSpeakPrescription(rx.medicineName, rx.instructions)}
                        className="bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${speakingItem === rx.medicineName ? 'animate-ping' : ''}`} />
                        <span>{speakingItem === rx.medicineName ? 'Speaking...' : 'Listen in Marathi'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE TELECONSULTATION ROOM */}
        {activeTab === 'teleconsult' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            {!isCalling ? (
              <div className="text-center py-8 max-w-xl mx-auto space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Video className="w-8 h-8 text-[#003527]" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">e-Sanjeevani Spoke-to-Hub Consultation</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Connected with: <strong>Dr. Rohini Kulkarni, MD (Obstetrics & Gynecology)</strong> at Junnar Rural Hospital Telemedicine Hub.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 text-left space-y-1.5 font-medium">
                  <div>• Your Active Token: <strong className="text-emerald-700">Token #24 (Consulting Now)</strong></div>
                  <div>• Spoke Location: Khamgaon Ayushman Arogya Mandir</div>
                  <div>• Encryption: 256-bit HIPAA / ABDM Compliant Stream</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      setIsCalling(true);
                      showToast('Connected to Dr. Rohini Kulkarni on e-Sanjeevani HD encrypted stream.');
                    }}
                    className="bg-[#003527] hover:bg-[#064e3b] text-white font-bold px-8 py-3 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4 text-emerald-400" />
                    <span>Join Video Consultation Room</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('doctor')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold px-6 py-3 rounded-2xl text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Stethoscope className="w-4 h-4 text-blue-700" />
                    <span>Switch to Doctor View</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Live Video Room Simulator */}
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
                        <div className="text-xs text-emerald-400">Consulting with Sunita Shinde (Khamgaon Sub-Centre Spoke)</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between z-10 pt-3 border-t border-slate-800">
                    <div className="text-xs text-slate-300 hidden sm:flex items-center gap-3">
                      <span>BP: <strong className="text-emerald-400">{patient.vitals.bp}</strong></span>
                      <span>SpO2: <strong className="text-blue-400">{patient.vitals.spo2}</strong></span>
                      <span>Hb: <strong className="text-amber-400">8.2 g/dL</strong></span>
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
                          showToast('Teleconsultation session completed. Prescription synced to your record.');
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
                      <strong>Result:</strong> <span className="font-bold text-slate-900">{lab.result}</span> • Reference: {lab.referenceRange}
                    </div>
                    <div className="text-[11px] text-slate-400">Reported on {lab.reportedAt} • Verified by Lab Officer</div>
                  </div>

                  <button
                    onClick={() => showToast(`Downloaded official report for ${lab.testName}`)}
                    className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Download Report</span>
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

              <div className="pt-4 border-t border-emerald-700/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-emerald-300 block">Linked Scheme</span>
                  <span className="font-bold">MJPJAY & PM-JAY</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-300 block">Assigned PHC</span>
                  <span className="font-bold">Otur PHC / Junnar RH</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => showToast('ABHA Digital Card saved to gallery/wallet.')}
                className="flex-1 bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3 rounded-2xl text-xs transition-all text-center flex items-center justify-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Save Digital ABHA Card</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
