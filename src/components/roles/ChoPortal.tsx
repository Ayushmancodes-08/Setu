import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_TELECONSULT_QUEUE, MOCK_REFERRALS, MAHARASHTRA_FACILITIES } from '../../data/mockData';
import { 
  Stethoscope, 
  Video, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  Pill, 
  Activity, 
  Send, 
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const ChoPortal: React.FC = () => {
  const { language, showToast, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'triage' | 'teleconsult' | 'referrals' | 'stock'>('triage');
  const [triageForm, setTriageForm] = useState({
    patientName: '',
    age: '',
    gender: 'Female',
    bp: '138/90',
    spo2: '98',
    pulse: '84',
    temp: '99.2',
    symptoms: 'Fever with chills and body pain for 3 days'
  });
  const [triageOutput, setTriageOutput] = useState<any>(null);

  const handleRunTriage = (e: React.FormEvent) => {
    e.preventDefault();
    const isRed = triageForm.symptoms.toLowerCase().includes('chest') || parseFloat(triageForm.spo2) < 92;
    const isAmber = triageForm.symptoms.toLowerCase().includes('fever') || parseFloat(triageForm.bp.split('/')[0]) > 140;

    setTriageOutput({
      urgency: isRed ? 'red' : isAmber ? 'amber' : 'green',
      assessment: isRed 
        ? 'High-Risk Emergency: Urgent cardiac/respiratory stabilization required' 
        : isAmber 
        ? 'Moderate Risk: Requires Medical Officer evaluation & rapid diagnostics' 
        : 'Low Risk: Routine symptomatic management',
      recommendedFacility: isRed ? 'Junnar Rural Hospital (Trauma Hub)' : 'Otur PHC / Sub-Centre',
      actions: [
        'Administer Paracetamol 500mg TDS after food',
        'Collect capillary blood sample for Malaria RDT & Hb strip',
        'Initiate assisted e-Sanjeevani teleconsultation if vitals do not stabilize'
      ]
    });

    showToast('Digital Clinical Triage completed.');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">Dr. Anjali Patil (CHO, BAMS)</h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Verified Provider
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Khamgaon Ayushman Arogya Mandir (Sub-Centre) • Otur PHC Cluster • Junnar Block
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Stock-out notification broadcasted to DHO & Pharmacist.')}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold py-2.5 px-4 rounded-xl border border-amber-200 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Report Stock-Out</span>
            </button>
            <button
              onClick={() => setActiveTab('teleconsult')}
              className="bg-[#003527] hover:bg-[#064e3b] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Launch Teleconsult</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('triage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'triage' ? 'bg-[#003527] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Digital Triage Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('teleconsult')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'teleconsult' ? 'bg-[#003527] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Telemedicine Spoke Queue ({MOCK_TELECONSULT_QUEUE.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'referrals' ? 'bg-[#003527] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Referral Pathways</span>
          </button>
        </div>

        {/* Tab 1: Digital Triage Engine */}
        {activeTab === 'triage' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
                Clinical Digital Triage & Vitals Assessment
              </h3>

              <form onSubmit={handleRunTriage} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Patient Name</label>
                    <input
                      type="text"
                      required
                      value={triageForm.patientName}
                      onChange={(e) => setTriageForm({ ...triageForm, patientName: e.target.value })}
                      placeholder="e.g. Babanrao Jadhav"
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Age & Gender</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        value={triageForm.age}
                        onChange={(e) => setTriageForm({ ...triageForm, age: e.target.value })}
                        placeholder="Age"
                        className="w-20 border border-slate-200 rounded-xl p-2.5 text-sm"
                      />
                      <select
                        value={triageForm.gender}
                        onChange={(e) => setTriageForm({ ...triageForm, gender: e.target.value })}
                        className="flex-1 border border-slate-200 rounded-xl p-2.5 text-sm"
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Blood Pressure (BP)</label>
                    <input
                      type="text"
                      value={triageForm.bp}
                      onChange={(e) => setTriageForm({ ...triageForm, bp: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">SpO2 (%)</label>
                    <input
                      type="text"
                      value={triageForm.spo2}
                      onChange={(e) => setTriageForm({ ...triageForm, spo2: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Pulse (bpm)</label>
                    <input
                      type="text"
                      value={triageForm.pulse}
                      onChange={(e) => setTriageForm({ ...triageForm, pulse: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Temperature (°F)</label>
                    <input
                      type="text"
                      value={triageForm.temp}
                      onChange={(e) => setTriageForm({ ...triageForm, temp: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Presenting Symptoms & Duration</label>
                  <textarea
                    rows={3}
                    value={triageForm.symptoms}
                    onChange={(e) => setTriageForm({ ...triageForm, symptoms: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3 px-6 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Run Clinical Triage & Risk Stratification</span>
                </button>
              </form>
            </div>

            {/* Right 1 Col: Triage Result Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
                  Triage Decision Output
                </h4>

                {triageOutput ? (
                  <div className="space-y-4 pt-3 text-xs">
                    <div className={`p-3 rounded-2xl border ${
                      triageOutput.urgency === 'red' ? 'bg-red-50 border-red-200 text-red-900' :
                      triageOutput.urgency === 'amber' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                      'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}>
                      <div className="font-extrabold text-sm uppercase">
                        {triageOutput.urgency === 'red' ? '🚨 Red Alert (Immediate Transfer)' :
                         triageOutput.urgency === 'amber' ? '⚠️ Amber (Urgent Evaluation)' :
                         '✅ Green (Routine / Stable)'}
                      </div>
                      <div className="font-medium mt-1 leading-snug">{triageOutput.assessment}</div>
                    </div>

                    <div>
                      <div className="font-bold text-slate-700">Recommended Care Level:</div>
                      <div className="font-extrabold text-slate-900 mt-0.5">{triageOutput.recommendedFacility}</div>
                    </div>

                    <div>
                      <div className="font-bold text-slate-700 mb-1">Standard Clinical Actions:</div>
                      <ul className="space-y-1 text-slate-600">
                        {triageOutput.actions.map((act: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs italic">
                    Fill patient vitals and click "Run Clinical Triage" to generate decision output.
                  </div>
                )}
              </div>

              {triageOutput && (
                <div className="pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      showToast('Dispatching Electronic Referral with patient vitals...');
                      setActiveTab('referrals');
                    }}
                    className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition-all"
                  >
                    Create Referral
                  </button>
                  <button
                    onClick={() => setActiveTab('teleconsult')}
                    className="flex-1 bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-2.5 rounded-xl text-xs transition-all"
                  >
                    Start Teleconsult
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Telemedicine Spoke Queue */}
        {activeTab === 'teleconsult' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Live e-Sanjeevani Spoke Queue</h3>
                <p className="text-xs text-slate-500">Connected Hub: Junnar Rural Hospital & District Civil Hospital</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                2 Patients in Queue
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {MOCK_TELECONSULT_QUEUE.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#003527]">{item.tokenNumber}</span>
                      <h4 className="font-bold text-base text-slate-900">{item.patientName} ({item.patientAge}y/{item.gender})</h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        item.urgency === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.urgency.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{item.presentingComplaint}</p>
                    <div className="text-[11px] text-slate-400">
                      Vitals: BP {item.vitals.bp} • Pulse {item.vitals.pulse} • SpO2 {item.vitals.spo2} • Temp {item.vitals.temp}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast(`Opening Telemedicine Room with Specialist for ${item.patientName}...`);
                      setCurrentView('doctor');
                    }}
                    className="shrink-0 bg-[#003527] hover:bg-[#064e3b] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm flex items-center gap-2"
                  >
                    <Video className="w-4 h-4 text-emerald-400" />
                    <span>Connect Doctor</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Referral Pathways */}
        {activeTab === 'referrals' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              Active Referrals Dispatched from Khamgaon Sub-Centre
            </h3>

            <div className="space-y-3">
              {MOCK_REFERRALS.map((ref) => (
                <div key={ref.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{ref.referralCode}</span>
                    <span className="bg-blue-100 text-blue-900 font-extrabold px-2 py-0.5 rounded text-[10px]">
                      {ref.status}
                    </span>
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">{ref.patientName} ({ref.patientAge}y)</div>
                  <div className="text-slate-600">
                    <strong>Destination:</strong> {ref.targetFacilityName} ({ref.targetSpecialty})
                  </div>
                  <div className="text-slate-600">{ref.reasonForReferral}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
