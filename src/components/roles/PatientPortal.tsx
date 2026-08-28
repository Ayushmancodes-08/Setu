import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_REFERRALS, MOCK_MEDICINES, MAHARASHTRA_FACILITIES } from '../../data/mockData';
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
  Sparkles,
  Volume2,
  Mic,
  Stethoscope
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const { language, openAiCompanionWithQuery, showToast, setIsEmergencyModalOpen, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'records' | 'teleconsult' | 'queue' | 'medicines'>('records');
  const [isTeleconsultCalling, setIsTeleconsultCalling] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Patient Profile & ABHA Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
              SR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">Sunita Ravindra Shinde</h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  ABHA Linked
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ABHA ID: <span className="font-semibold text-slate-700">91-4821-9902-3312</span> • Age: 24 (Female) • Khamgaon Village, Junnar
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> MJPJAY & JSSK Eligible</span>
                <span>•</span>
                <span>Assigned ASHA: <strong className="text-slate-800">Manisha Kadam</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => openAiCompanionWithQuery('Check my pregnancy care schedule and iron medicine dosage')}
              className="flex-1 md:flex-none bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-2.5 px-4 rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Ask ArogyaSakhi</span>
            </button>
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>108 SOS</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'records' ? 'bg-[#003527] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Health Records & e-Prescriptions</span>
          </button>
          <button
            onClick={() => setActiveTab('teleconsult')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'teleconsult' ? 'bg-[#003527] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Assisted Teleconsultation</span>
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'queue' ? 'bg-[#003527] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Live OPD Token Queue</span>
          </button>
          <button
            onClick={() => setActiveTab('medicines')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'medicines' ? 'bg-[#003527] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Check Medicines at My PHC</span>
          </button>
        </div>

        {/* Tab 1: Health Records */}
        {activeTab === 'records' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Record Card 1 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Obstetric Consultation
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">High-Risk ANC Evaluation Note</h3>
                    <p className="text-xs text-slate-500">Dr. Rohini Kulkarni (OBGYN) • Junnar Rural Hospital</p>
                  </div>
                  <span className="text-xs font-medium text-slate-400">27 Aug 2026</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700 space-y-1">
                  <div><strong>Diagnosis:</strong> 32 Weeks Primigravida with Severe Microcytic Anemia (Hb 8.2 g/dL)</div>
                  <div><strong>Prescribed:</strong> Inj. Ferric Carboxymaltose 500mg IV in 100ml NS + Calcium 500mg BD</div>
                  <div><strong>Scheme Applied:</strong> Janani Shishu Suraksha Karyakram (JSSK) — 100% Free</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const textToRead = language === 'mr'
                        ? 'डॉ. रोहिणी कुलकर्णी यांनी दिलेला सल्ला: ३२ आठवड्यांची गरोदर माता, तीव्र अ‍ॅनिमिया हिमोग्लोबिन ८.२. जननी शिशु सुरक्षा योजनेतून फेरिक कार्बोक्सीमाल्टोज इंजेक्शन मोफत देण्यात येईल.'
                        : 'Doctor Rohini Kulkarni prescription advice: 32 weeks pregnant with severe anemia. Free Ferric Carboxymaltose injection prescribed under JSSK.';
                      bhashiniAI.speakText(textToRead, language);
                      showToast('Playing Bhashini Audio Readout in Marathi/Hindi...');
                    }}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-emerald-200"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Bhashini Audio (ऐका)</span>
                  </button>

                  <button
                    onClick={() => showToast('Downloading Official Encrypted e-Prescription PDF...')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download e-Rx</span>
                  </button>
                </div>
              </div>

              {/* Record Card 2 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Diagnostic Lab Report
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">Complete Blood Count & Ferritin</h3>
                    <p className="text-xs text-slate-500">MahaHealth Central Diagnostic Lab, Manchar Hub</p>
                  </div>
                  <span className="text-xs font-medium text-slate-400">28 Aug 2026</span>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-amber-900">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Critical Panic Value Flagged:</span>
                  </div>
                  <div>Hemoglobin: <strong className="text-red-700">8.2 g/dL (Normal: 12-15)</strong></div>
                  <div>Serum Ferritin: <strong className="text-red-700">9.4 ng/mL (Severe Deficiency)</strong></div>
                </div>

                <button
                  onClick={() => showToast('Downloading Verified Lab Diagnostic Report PDF...')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Lab Report</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Assisted Teleconsultation */}
        {activeTab === 'teleconsult' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {!isTeleconsultCalling ? (
              <div className="max-w-xl mx-auto text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
                  <Video className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Assisted e-Sanjeevani Teleconsultation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect live with <strong>Dr. Rohini Kulkarni (MD Medicine / Specialist)</strong> or <strong>Dr. Swapnil Deshmukh (Otur PHC)</strong> directly from your home or local Ayushman Arogya Mandir.
                </p>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Your Connected Health Spoke:</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">Active Link</span>
                  </div>
                  <div className="text-slate-600">• Spoke: Khamgaon Ayushman Arogya Mandir (CHO Anjali Patil)</div>
                  <div className="text-slate-600">• Receiving Hub: Junnar Rural Hospital Telemedicine Hub</div>
                  <div className="text-slate-600">• Queue Position: <strong>Token #24 (Consulting Next)</strong></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      setIsTeleconsultCalling(true);
                      showToast('Connecting to Dr. Rohini Kulkarni via e-Sanjeevani HD Encrypted Stream...');
                    }}
                    className="bg-[#003527] hover:bg-[#064e3b] text-white font-bold px-8 py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4 text-emerald-400" />
                    <span>Join Live Doctor Video Call</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('doctor')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold px-6 py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Stethoscope className="w-4 h-4 text-blue-700" />
                    <span>Open Doctor Specialist Console</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Live Video Room Container */}
                <div className="bg-slate-950 text-white rounded-3xl p-6 relative aspect-video flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800">
                  
                  {/* Top Call Banner */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-bold text-white">Dr. Rohini Kulkarni, MD</span>
                      <span className="text-slate-400">| Junnar Hospital</span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-emerald-400 font-mono">
                      <span>● e-Sanjeevani Tele-Stream Active</span>
                      <span>HD 1080p</span>
                    </div>
                  </div>

                  {/* Doctor Video Avatar & Simulated Feed */}
                  <div className="flex-1 flex items-center justify-center py-4">
                    <div className="text-center space-y-3">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 p-1 mx-auto shadow-2xl shadow-emerald-500/20">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-white/20">
                          <Stethoscope className="w-12 h-12 text-emerald-300 animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <div className="font-extrabold text-base sm:text-lg text-white">Dr. Rohini Kulkarni</div>
                        <div className="text-xs text-emerald-400 font-medium">Consulting with Sunita Shinde (Khamgaon Sub-Centre Spoke)</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls Bar */}
                  <div className="flex items-center justify-between z-10 pt-3 border-t border-slate-800/80">
                    <div className="text-xs text-slate-300 hidden sm:flex items-center gap-3">
                      <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        BP: <strong className="text-emerald-400">138/92 mmHg</strong>
                      </span>
                      <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        SpO2: <strong className="text-blue-400">98%</strong>
                      </span>
                      <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        Hb: <strong className="text-amber-400">8.2 g/dL</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mx-auto sm:mx-0">
                      <button
                        onClick={() => setCurrentView('doctor')}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                      >
                        <Stethoscope className="w-4 h-4" />
                        <span>Switch to Doctor View</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsTeleconsultCalling(false);
                          showToast('Consultation ended. Prescription synced to your ABHA records.');
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-6 rounded-full transition-all flex items-center gap-1.5 shadow-lg shadow-red-950/40"
                      >
                        <PhoneCall className="w-4 h-4 rotate-[135deg]" />
                        <span>End Call</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Live Token Queue */}
        {activeTab === 'queue' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Today's OPD Token Status</h3>
                <p className="text-xs text-slate-500">Otur Primary Health Centre (PHC) • General OPD</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                Active OPD
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">Your Token Number</div>
                <div className="text-3xl font-black text-[#003527] mt-1">#24</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <div className="text-xs text-emerald-800 font-semibold">Currently Serving</div>
                <div className="text-3xl font-black text-emerald-700 mt-1">#21</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500 font-semibold">Estimated Wait Time</div>
                <div className="text-3xl font-black text-slate-800 mt-1">~6 Mins</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Medicine Availability */}
        {activeTab === 'medicines' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Live Medicine Stock at Otur PHC</h3>
                <p className="text-xs text-slate-500">Verified via e-Aushadhi Real-Time Inventory</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                91.8% Stock Availability
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {MOCK_MEDICINES.map((med) => (
                <div key={med.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{med.name}</div>
                    <div className="text-slate-500 text-[11px]">{med.genericName} • {med.category}</div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      med.status === 'In Stock' ? 'bg-emerald-100 text-emerald-800' :
                      med.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {med.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{med.currentStock} {med.unit} available</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
