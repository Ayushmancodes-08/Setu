import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
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
  FileCheck
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const { showToast, language, setCurrentView } = useApp();
  const { 
    teleconsultQueue, 
    updateTeleconsultStatus, 
    completeConsultationAndIssueRx,
    createDiagnosticOrder,
    createReferral,
    patients,
    submitLabResult
  } = useHealthData();

  // Selected queue patient
  const [selectedQueueItem, setSelectedQueueItem] = useState(teleconsultQueue[0] || null);
  const [isLiveConsulting, setIsLiveConsulting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'consultation' | 'rx_builder' | 'lab_order' | 'record_lab' | 'referral'>('consultation');

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
      patientGender: selectedQueueItem.gender,
      patientVillage: selectedQueueItem.village,
      doctorName: 'Dr. Rohini Kulkarni, MD',
      facilityName: 'Junnar Rural Hospital Telemedicine Hub',
      items: rxItems,
      notes: doctorNotes
    });
    showToast(`Prescription signed & dispatched to Pharmacy Queue for ${selectedQueueItem.patientName}`);
    setIsLiveConsulting(false);
    setActiveTab('consultation');
  };

  const handleDispatchLabOrder = async () => {
    if (!selectedQueueItem || selectedTests.length === 0) return;
    for (const testName of selectedTests) {
      await createDiagnosticOrder({
        patientName: selectedQueueItem.patientName,
        patientAge: selectedQueueItem.patientAge,
        patientGender: selectedQueueItem.gender,
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

    // Create order first
    const created = await createDiagnosticOrder({
      patientName: selectedQueueItem.patientName,
      patientAge: selectedQueueItem.patientAge,
      patientGender: selectedQueueItem.gender,
      testName: directTestName,
      testCategory: 'Hematology & Pathology',
      orderingDoctor: 'Dr. Rohini Kulkarni, MD',
      facility: 'Junnar Rural Hospital Diagnostic Wing'
    });

    // Directly submit validated result
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
      patientGender: selectedQueueItem.gender as any,
      patientVillage: selectedQueueItem.village,
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
                <h1 className="text-xl font-black text-slate-900">Dr. Rohini Kulkarni, MD (OBGYN)</h1>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-300">
                  e-Sanjeevani Hub Specialist
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Junnar Rural Hospital Telemedicine Receiving Hub • Registration: <strong>MCI-2014-99812</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Tele-Clinic Hub Live</span>
            </span>
            <button
              onClick={() => setCurrentView('pharmacist')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-slate-300 transition-colors"
            >
              Check Pharmacy Queue
            </button>
          </div>
        </div>

        {/* Workbench Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Live Queue of Spoke Patients */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>e-Sanjeevani Waiting Queue</span>
              </h3>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {teleconsultQueue.length} Queued
              </span>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {teleconsultQueue.map((item) => {
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

          {/* Right Column: Patient Clinical Console & Actions */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            {selectedQueueItem ? (
              <>
                {/* Active Patient Summary Banner */}
                <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        TOKEN: {selectedQueueItem.tokenNumber}
                      </span>
                      <h2 className="text-lg font-black">{selectedQueueItem.patientName}</h2>
                      <span className="text-xs text-slate-400">({selectedQueueItem.gender}, {selectedQueueItem.patientAge}y)</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Sub-Centre Spoke: <strong>{selectedQueueItem.subCenterName}</strong> • Attending CHO: {selectedQueueItem.connectedChoName}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsLiveConsulting(!isLiveConsulting);
                      updateTeleconsultStatus(selectedQueueItem.id, 'In Call');
                    }}
                    className={`font-bold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center gap-2 transition-all ${
                      isLiveConsulting
                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{isLiveConsulting ? 'Connected (End Video)' : 'Start e-Sanjeevani Call'}</span>
                  </button>
                </div>

                {/* Vitals Telemetry Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Blood Pressure</span>
                    <span className="font-extrabold text-slate-900">{selectedQueueItem.vitals.bp}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Pulse Rate</span>
                    <span className="font-extrabold text-slate-900">{selectedQueueItem.vitals.pulse}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Oxygen (SpO2)</span>
                    <span className="font-extrabold text-emerald-700">{selectedQueueItem.vitals.spo2}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Temperature</span>
                    <span className="font-extrabold text-slate-900">{selectedQueueItem.vitals.temp}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Body Weight</span>
                    <span className="font-extrabold text-slate-900">{selectedQueueItem.vitals.weight}</span>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold w-full overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('consultation')}
                    className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap ${
                      activeTab === 'consultation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Clinical Findings
                  </button>
                  <button
                    onClick={() => setActiveTab('rx_builder')}
                    className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap ${
                      activeTab === 'rx_builder' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    e-Prescription Builder ({rxItems.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('record_lab')}
                    className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap ${
                      activeTab === 'record_lab' ? 'bg-white text-blue-700 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    + Record Lab Report
                  </button>
                  <button
                    onClick={() => setActiveTab('lab_order')}
                    className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap ${
                      activeTab === 'lab_order' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Lab Requisitions
                  </button>
                  <button
                    onClick={() => setActiveTab('referral')}
                    className={`py-2 px-3 rounded-xl transition-all whitespace-nowrap ${
                      activeTab === 'referral' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Specialty Referral
                  </button>
                </div>

                {/* TAB 1: CLINICAL NOTES */}
                {activeTab === 'consultation' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Doctor's Clinical Impression & Treatment Protocol
                      </label>
                      <textarea
                        rows={4}
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveTab('rx_builder')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Pill className="w-4 h-4" />
                        <span>Proceed to e-Prescription ({rxItems.length} Drugs)</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('record_lab')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Write Lab Diagnostic Findings</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: RX BUILDER */}
                {activeTab === 'rx_builder' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {rxItems.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="font-bold text-slate-900">{item.name}</div>
                            <div className="text-[11px] text-slate-500">
                              Dosage: <strong>{item.dosage}</strong> • Frequency: <strong>{item.frequency}</strong> • Duration: {item.duration}
                            </div>
                            <div className="text-[10px] text-slate-600 italic">Instructions: {item.instructions}</div>
                          </div>
                          <button
                            onClick={() => handleRemoveMedication(idx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Drug Draft Box */}
                    <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 space-y-3 text-xs">
                      <span className="font-bold text-blue-900 uppercase tracking-wider block text-[11px]">
                        Add Drug from Maharashtra Essential Drug Formulary
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Medicine Name (e.g. Paracetamol 500mg)"
                          value={draftMedName}
                          onChange={(e) => setDraftMedName(e.target.value)}
                          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                        />
                        <input
                          type="text"
                          placeholder="Dosage & Timing (e.g. 1-0-1 after food)"
                          value={draftInstructions}
                          onChange={(e) => setDraftInstructions(e.target.value)}
                          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                        />
                      </div>
                      <button
                        onClick={handleAddMedication}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Drug to Prescription</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-end">
                      <button
                        onClick={handleIssuePrescription}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-2xl text-xs shadow-md transition-all flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>Digitally Sign & Dispatch to Pharmacy Queue</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: RECORD LAB REPORT */}
                {activeTab === 'record_lab' && (
                  <form onSubmit={handleRecordDirectLabReport} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">Record & Attach Diagnostic Test Report</h4>
                        <p className="text-[11px] text-slate-500">
                          Directly enter lab findings into patient's EHR for instant viewing and patient PDF download.
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-900 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                        ABDM EHR Synchronized
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Diagnostic Test Name</label>
                        <input
                          type="text"
                          value={directTestName}
                          onChange={(e) => setDirectTestName(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Biological Reference Range</label>
                        <input
                          type="text"
                          value={directRefRange}
                          onChange={(e) => setDirectRefRange(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Result Finding & Units</label>
                      <input
                        type="text"
                        value={directResultValue}
                        onChange={(e) => setDirectResultValue(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Clinical Remarks / Interpretation Notes</label>
                      <textarea
                        rows={2}
                        value={directNotes}
                        onChange={(e) => setDirectNotes(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="directPanic"
                        checked={directIsPanic}
                        onChange={(e) => setDirectIsPanic(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <label htmlFor="directPanic" className="font-bold text-red-700 cursor-pointer">
                        Flag as Critical Abnormal Finding
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Save & Sign Diagnostic Report to Patient EHR</span>
                    </button>
                  </form>
                )}

                {/* TAB 4: LAB REQUISITIONS */}
                {activeTab === 'lab_order' && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Select Laboratory Test Panels
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        'Complete Blood Count (CBC & Platelets)',
                        'Serum Ferritin & Iron Studies',
                        'Urine Albumin & Sugar Dipstick',
                        'Malaria Rapid Antigen Test (Pv/Pf)',
                        'Fasting & Postprandial Blood Glucose',
                        'Lipid Profile & Serum Creatinine'
                      ].map((test, idx) => {
                        const isChecked = selectedTests.includes(test);
                        return (
                          <label key={idx} className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                            isChecked ? 'bg-blue-50/80 border-blue-400 text-blue-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTests(prev => [...prev, test]);
                                } else {
                                  setSelectedTests(prev => prev.filter(t => t !== test));
                                }
                              }}
                              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                            />
                            <span>{test}</span>
                          </label>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleDispatchLabOrder}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl text-xs shadow-xs transition-all flex items-center gap-2"
                    >
                      <Activity className="w-4 h-4" />
                      <span>Dispatch Laboratory Requisition</span>
                    </button>
                  </div>
                )}

                {/* TAB 5: SPECIALTY / ICU REFERRAL */}
                {activeTab === 'referral' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-500 block mb-1 font-bold">Target Referral Center</label>
                        <select
                          value={referralTarget}
                          onChange={(e) => setReferralTarget(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                        >
                          <option value="Junnar Rural Hospital & Trauma Centre">Junnar Rural Hospital & Trauma Centre</option>
                          <option value="Nandurbar District Civil Hospital">Nandurbar District Civil Hospital</option>
                          <option value="Sasoon General Hospital, Pune">Sasoon General Hospital, Pune</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-500 block mb-1 font-bold">Target Specialty</label>
                        <select
                          value={referralSpecialty}
                          onChange={(e) => setReferralSpecialty(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                        >
                          <option value="Obstetrics & High-Risk Pregnancy">Obstetrics & High-Risk Pregnancy</option>
                          <option value="Cardiology & Critical Care">Cardiology & Critical Care</option>
                          <option value="Pediatrics & NICU">Pediatrics & NICU</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-500 block mb-1 font-bold text-xs">Clinical Referral Justification</label>
                      <textarea
                        rows={3}
                        value={referralNotes}
                        onChange={(e) => setReferralNotes(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateSpecialistReferral}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl text-xs shadow-xs transition-all flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Reserve Bed & Generate Referral Transfer Code</span>
                      </button>
                    </div>
                  </div>
                )}

              </>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">
                Select a patient from the teleconsultation queue on the left to begin examination.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
