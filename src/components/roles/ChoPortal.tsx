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
  X
} from 'lucide-react';

export const ChoPortal: React.FC = () => {
  const { showToast, language, setCurrentView } = useApp();
  const { 
    patients, 
    enqueueTeleconsult, 
    teleconsultQueue, 
    updatePatientVitals,
    medicines,
    updateMedicineStock
  } = useHealthData();

  const [activeTab, setActiveTab] = useState<'opd_queue' | 'triage_intake' | 'rapid_tests' | 'subcenter_stock'>('opd_queue');
  
  // Triage Intake Form State
  const [patientName, setPatientName] = useState<string>('Sunita Ravindra Shinde');
  const [patientAge, setPatientAge] = useState<number>(24);
  const [patientGender, setPatientGender] = useState<'Female' | 'Male'>('Female');
  const [complaint, setComplaint] = useState<string>('3rd Trimester pregnancy checkup, fatigue, and headache. Hb low (8.2 g/dL).');
  const [urgency, setUrgency] = useState<'red' | 'amber' | 'green'>('amber');
  const [bp, setBp] = useState<string>('138/92');
  const [pulse, setPulse] = useState<string>('88');
  const [spo2, setSpo2] = useState<string>('98');
  const [temp, setTemp] = useState<string>('98.6');
  const [weight, setWeight] = useState<string>('52');

  // Rapid Test Log State
  const [testType, setTestType] = useState<string>('Digital Hemoglobinometer (Hb)');
  const [testFinding, setTestFinding] = useState<string>('8.2 g/dL (Severe Gestational Anemia)');
  const [isTestPanic, setIsTestPanic] = useState<boolean>(true);

  const handleQueueTeleconsult = async (e: React.FormEvent) => {
    e.preventDefault();
    const queued = await enqueueTeleconsult({
      patientName,
      patientAge,
      gender: patientGender,
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

  const handleLogRapidTest = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Logged rapid diagnostic result: ${testType} -> ${testFinding}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* CHO Spoke Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold shadow-md">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">Pooja Jadhav, CHO (Community Health Officer)</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Ayushman Arogya Mandir (Sub-Centre Spoke)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Khamgaon Sub-Centre • Attached to <strong>Otur PHC & Junnar Rural Hospital Telemedicine Hub</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('doctor')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Doctor Hub Console</span>
            </button>
          </div>
        </div>

        {/* Operational Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
          {[
            { id: 'opd_queue', label: 'Active OPD & Teleconsult Tokens', icon: Clock, count: teleconsultQueue.length },
            { id: 'triage_intake', label: 'Walk-in Intake & e-Sanjeevani Escalation', icon: UserPlus },
            { id: 'rapid_tests', label: 'Point-of-Care Rapid Diagnostic Tests', icon: Activity },
            { id: 'subcenter_stock', label: 'Sub-Centre Drug Kit Stock', icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#003527] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.2 text-[10px] rounded-full font-bold ${
                    isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ACTIVE OPD & TELECONSULT TOKENS */}
        {activeTab === 'opd_queue' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Sub-Centre Spoke Teleconsultation Stream</h3>
                <p className="text-xs text-slate-500">Live tokens connected to Junnar Rural Hospital Telemedicine Hub.</p>
              </div>
              <button
                onClick={() => setActiveTab('triage_intake')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Queue New Patient</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teleconsultQueue.map((item) => (
                <div key={item.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-slate-300">
                        {item.tokenNumber}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        item.urgency === 'red' ? 'bg-red-100 text-red-800' : item.urgency === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.urgency}
                      </span>
                    </div>

                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{item.patientName}</div>
                      <div className="text-xs text-slate-500">{item.gender}, {item.patientAge}y • {item.village}</div>
                    </div>

                    <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 font-medium">
                      <strong>Complaint:</strong> {item.presentingComplaint}
                    </div>

                    <div className="grid grid-cols-4 gap-1 bg-white p-2 rounded-lg border border-slate-200 text-[10px]">
                      <div>BP: <strong>{item.vitals.bp}</strong></div>
                      <div>SpO2: <strong className="text-blue-700">{item.vitals.spo2}</strong></div>
                      <div>Pulse: <strong>{item.vitals.pulse}</strong></div>
                      <div>Temp: <strong>{item.vitals.temp}</strong></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-800">Status: {item.status}</span>
                    <button
                      onClick={() => setCurrentView('doctor')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1 transition-all"
                    >
                      <span>Join Hub Consult</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: WALK-IN INTAKE & TELECONSULT ESCALATION FORM */}
        {activeTab === 'triage_intake' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Patient Triage & e-Sanjeevani Escalation Form</h3>
              <p className="text-xs text-slate-500">Record point-of-care vitals and submit case to Hub Specialist queue.</p>
            </div>

            <form onSubmit={handleQueueTeleconsult} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-slate-700 font-bold block mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Triage Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="amber">Amber (Urgent Consult)</option>
                    <option value="red">Red (Critical Emergency)</option>
                    <option value="green">Green (Routine OPD)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
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
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Log Point-of-Care Rapid Diagnostic Result</h3>
              <p className="text-xs text-slate-500">Record on-site Sub-Centre testing (Hemoglobin, Malaria RDT, Urine Albumin, Blood Glucose).</p>
            </div>

            <form onSubmit={handleLogRapidTest} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Test Type</label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                >
                  <option value="Digital Hemoglobinometer (Hb)">Digital Hemoglobinometer (Hb)</option>
                  <option value="Malaria Rapid Antigen Dipstick (Pv/Pf)">Malaria Rapid Antigen Dipstick (Pv/Pf)</option>
                  <option value="Blood Glucose Strip (Glucometer)">Blood Glucose Strip (Glucometer)</option>
                  <option value="Urine Albumin & Sugar Dipstick">Urine Albumin & Sugar Dipstick</option>
                  <option value="Rapid Pregnancy Diagnostic Kit (UPT)">Rapid Pregnancy Diagnostic Kit (UPT)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Result Finding & Units</label>
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
        )}

        {/* TAB 4: SUBCENTRE DRUG KIT STOCK */}
        {activeTab === 'subcenter_stock' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Sub-Centre Drug Kit A & B Inventory</h3>
                <p className="text-xs text-slate-500">Essential drugs stocked at Khamgaon Ayushman Arogya Mandir.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {medicines.slice(0, 6).map((med) => (
                <div key={med.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">{med.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      med.status === 'In Stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {med.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-mono">
                    Stock: <strong>{med.currentStock} {med.unit}</strong> • Batch: {med.batchNumber}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        updateMedicineStock(med.id, -5);
                        showToast(`Dispensed 5 units of ${med.name}`);
                      }}
                      className="flex-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-1.5 rounded-lg text-xs"
                    >
                      Dispense 5
                    </button>
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
