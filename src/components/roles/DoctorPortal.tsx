import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_TELECONSULT_QUEUE, MOCK_MEDICINES } from '../../data/mockData';
import { 
  Video, 
  FileText, 
  Pill, 
  Send, 
  CheckCircle2, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Share2,
  Stethoscope,
  Sparkles
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const { showToast, setCurrentView } = useApp();
  const [selectedQueueItem, setSelectedQueueItem] = useState(MOCK_TELECONSULT_QUEUE[0]);
  const [activeCall, setActiveCall] = useState(false);
  const [prescriptionList, setPrescriptionList] = useState<{ name: string; dosage: string; frequency: string; days: string }[]>([
    { name: 'Telmisartan 40mg', dosage: '1 Tab', frequency: 'Once Daily (Morning)', days: '30 Days' },
    { name: 'Paracetamol 500mg', dosage: '1 Tab', frequency: 'SOS / If needed for headache', days: '5 Days' }
  ]);
  const [newMed, setNewMed] = useState({ name: 'Metformin 500mg', dosage: '1 Tab', frequency: 'Twice Daily', days: '30 Days' });
  const [clinicalNotes, setClinicalNotes] = useState('Patient examined via Khamgaon Spoke. BP is 168/104 mmHg. Advised lifestyle modification, low salt diet, and continuous BP monitoring by ASHA Manisha Kadam.');

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    setPrescriptionList([...prescriptionList, newMed]);
    showToast(`Added ${newMed.name} to e-Prescription.`);
  };

  const handleSignAndIssueRx = () => {
    showToast(`Digitally signed e-Prescription issued! Auto-routed to Otur PHC Pharmacy & Patient ABHA.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Doctor Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">Dr. Rohini Kulkarni, MD (Medicine)</h1>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                  Specialist Consultant
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Junnar Rural Hospital & Trauma Hub • Telemedicine e-Sanjeevani Central Roster
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Available for Spoke Consultations</span>
            </span>
          </div>
        </div>

        {/* 2 Column Workbench Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Live Video & EHR (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Video Call Simulation Box */}
            <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-800 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-slate-300">
                    Active Spoke: {selectedQueueItem.subCenterName} ({selectedQueueItem.connectedChoName})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-800 px-2.5 py-0.5 rounded text-emerald-400 font-mono">
                    Token {selectedQueueItem.tokenNumber}
                  </span>
                  <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                    HD Tele-Stream
                  </span>
                </div>
              </div>

              {/* Main Call View */}
              <div className="aspect-video bg-slate-900 rounded-2xl flex flex-col justify-between relative border border-slate-800/80 overflow-hidden p-5">
                
                {/* Top Patient Telemetry Bar */}
                <div className="flex items-center justify-between z-10">
                  <div className="bg-slate-900/90 border border-slate-700/80 px-3.5 py-1.5 rounded-xl text-xs text-slate-200 flex items-center gap-4 backdrop-blur-sm">
                    <div>BP: <strong className="text-red-400 font-mono">{selectedQueueItem.vitals.bp}</strong></div>
                    <div>Pulse: <strong className="text-emerald-400 font-mono">{selectedQueueItem.vitals.pulse} bpm</strong></div>
                    <div>SpO2: <strong className="text-blue-400 font-mono">{selectedQueueItem.vitals.spo2}</strong></div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>e-Sanjeevani Tele-Stream Active</span>
                  </div>
                </div>

                {/* Patient Avatar & Live Stream Simulation */}
                <div className="flex-1 flex items-center justify-center py-4">
                  <div className="text-center space-y-3">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 p-1 mx-auto shadow-2xl shadow-emerald-500/20">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-2 border-white/20">
                        <Video className="w-12 h-12 text-emerald-400 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <div className="font-extrabold text-base sm:text-lg text-white">{selectedQueueItem.patientName} ({selectedQueueItem.patientAge}y / {selectedQueueItem.gender})</div>
                      <div className="text-xs text-emerald-400 font-medium">Spoke: {selectedQueueItem.subCenterName} • Connected via CHO Anjali Patil</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Chief Complaint Bar */}
                <div className="z-10 bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-2.5 rounded-xl text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold">Presenting Complaint: </span>
                  <span className="italic">"{selectedQueueItem.presentingComplaint}"</span>
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('patient')}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <span>View as Patient (सुनिता शिंदे)</span>
                  </button>

                  <button
                    onClick={() => showToast('Digital Stethoscope: Streaming real-time S1/S2 heart sounds from Khamgaon Spoke...')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-3 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Digital Stethoscope</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    handleSignAndIssueRx();
                    showToast('Consultation completed! Counter-referral & e-Rx synced to ABHA record.');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Complete & Sign Consultation</span>
                </button>
              </div>
            </div>

            {/* Longitudinal EHR & Diagnostic Timeline */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Patient Longitudinal EHR & Lab History</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Otur PHC Clinical Lab • CBC & Blood Sugar</span>
                    <span className="text-slate-400 font-normal">24 Aug 2026</span>
                  </div>
                  <div className="text-slate-600">RBS: <strong>184 mg/dL</strong> (Elevated) • Hb: <strong>11.2 g/dL</strong> • Urine Albumin: <strong>Nil</strong></div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>ASHA Field Visit Log • Manisha Kadam</span>
                    <span className="text-slate-400 font-normal">20 Aug 2026</span>
                  </div>
                  <div className="text-slate-600">Blood pressure was 158/96 mmHg. Advised patient to avoid excess salt and take prescribed medications without skipping.</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: e-Prescription Pad & Spoke Queue (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Spoke Patient Queue Selector */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-700 animate-pulse" />
                    <span>Live e-Sanjeevani Spoke Queue</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Select a patient to start live video consultation</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {MOCK_TELECONSULT_QUEUE.length} In Queue
                </span>
              </div>

              <div className="space-y-2.5">
                {MOCK_TELECONSULT_QUEUE.map((item) => {
                  const isSelected = selectedQueueItem.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedQueueItem(item);
                        if (item.id === 'tc-00') {
                          setPrescriptionList([
                            { name: 'Inj. Ferric Carboxymaltose 500mg IV', dosage: '1 Dose', frequency: 'In 100ml NS Slow Infusion', days: 'Stat (Today)' },
                            { name: 'Tab Calcium Carbonate 500mg', dosage: '1 Tab', frequency: 'Twice Daily after food', days: '30 Days' },
                            { name: 'Syrup IFA (Iron & Folic Acid)', dosage: '5 ml', frequency: 'Once Daily', days: '30 Days' }
                          ]);
                          setClinicalNotes('32 Weeks Primigravida with microcytic anemia (Hb 8.2 g/dL). Free IV Iron infusion administered under JSSK. Follow-up CBC in 14 days with ASHA Manisha Kadam.');
                        } else if (item.id === 'tc-01') {
                          setPrescriptionList([
                            { name: 'Telmisartan 40mg', dosage: '1 Tab', frequency: 'Once Daily (Morning)', days: '30 Days' },
                            { name: 'Paracetamol 500mg', dosage: '1 Tab', frequency: 'SOS / If needed for headache', days: '5 Days' }
                          ]);
                          setClinicalNotes('Hypertensive urgency (BP 168/104). Advised low salt diet, lifestyle modifications, and weekly ASHA BP logs.');
                        } else {
                          setPrescriptionList([
                            { name: 'Paracetamol 250mg Suspension', dosage: '5 ml', frequency: 'TDS (Every 8 hours)', days: '5 Days' },
                            { name: 'Amoxicillin 250mg DT', dosage: '1 Tab', frequency: 'Twice Daily', days: '5 Days' }
                          ]);
                          setClinicalNotes('Viral febrile illness. Maintain hydration with ORS and monitor fever chart.');
                        }
                        showToast(`Switched consultation to ${item.patientName} (${item.tokenNumber})`);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-50/80 border-emerald-400 shadow-md ring-2 ring-emerald-500/20' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                              {item.tokenNumber}
                            </span>
                            <span className="font-extrabold text-sm text-slate-900">
                              {item.patientName}
                            </span>
                            <span className="text-xs text-slate-500">
                              ({item.patientAge}y/{item.gender})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-1 font-medium">
                            {item.presentingComplaint}
                          </p>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Vitals: BP {item.vitals.bp} • SpO2 {item.vitals.spo2} • {item.subCenterName}
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {isSelected ? 'Consulting Now' : `${item.waitingMinutes}m wait`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-700" />
                  <span>Digital e-Prescription Pad</span>
                </h3>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  e-Aushadhi Checked
                </span>
              </div>

              {/* Prescribed Items Table */}
              <div className="space-y-2">
                {prescriptionList.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-slate-500 text-[11px]">{item.frequency} • {item.days}</div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2 py-0.5 rounded">
                      {item.dosage}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Drug Form */}
              <form onSubmit={handleAddMed} className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100 space-y-2 text-xs">
                <div className="font-bold text-emerald-900">Add Drug to Prescription:</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    placeholder="Medicine Name"
                    className="border border-slate-200 rounded-xl p-2 text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    placeholder="Dosage (1 Tab)"
                    className="border border-slate-200 rounded-xl p-2 text-xs bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newMed.frequency}
                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                    placeholder="Frequency"
                    className="border border-slate-200 rounded-xl p-2 text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={newMed.days}
                    onChange={(e) => setNewMed({ ...newMed, days: e.target.value })}
                    placeholder="Duration"
                    className="border border-slate-200 rounded-xl p-2 text-xs bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 rounded-xl text-xs transition-all"
                >
                  + Add Medication
                </button>
              </form>

              {/* Clinical Notes & Counter-Referral Advice */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Specialist Clinical Advice & ASHA Instructions:</label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <button
                onClick={handleSignAndIssueRx}
                className="w-full bg-[#003527] hover:bg-[#064e3b] text-white text-xs font-extrabold py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Digitally Sign & Dispatch e-Prescription</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
