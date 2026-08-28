import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { 
  Stethoscope, 
  Video, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  PhoneCall, 
  Plus, 
  Trash2, 
  Send, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  Search,
  ExternalLink,
  Pill
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const { showToast, language, setCurrentView, setIsEmergencyModalOpen } = useApp();
  const { 
    teleconsultQueue, 
    completeConsultationAndIssueRx, 
    createDiagnosticOrder, 
    createReferral,
    patients,
    medicines
  } = useHealthData();

  const [selectedQueueItem, setSelectedQueueItem] = useState(teleconsultQueue[0] || null);
  const [activeTab, setActiveTab] = useState<'consultation' | 'prescribe' | 'lab_order' | 'referral'>('consultation');
  const [isLiveConsulting, setIsLiveConsulting] = useState<boolean>(false);
  const [doctorNotes, setDoctorNotes] = useState<string>('Patient presents in 3rd trimester (32w) with moderate anemia (Hb 8.2 g/dL) and mild pregnancy-induced hypertension (BP 138/92 mmHg). High-risk ANC protocol initiated.');

  // Prescription builder state
  const [rxItems, setRxItems] = useState<Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions: string;
  }>>([
    {
      name: 'Ferrous Ascorbate + Folic Acid (100mg+1.5mg)',
      dosage: '1 Tab',
      frequency: '1-0-1 (Twice daily)',
      duration: '30 Days',
      quantity: 60,
      instructions: 'Take after meals with lemon water. Avoid milk or tea.'
    },
    {
      name: 'Calcium Carbonate + Vitamin D3 (500mg+250IU)',
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

  // Lab Order State
  const [selectedTests, setSelectedTests] = useState<string[]>(['Complete Blood Count (CBC)', 'Serum Ferritin & Iron Studies']);

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

          {/* Right Column: Interactive Consultation & Clinical Action Workbench */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            {selectedQueueItem ? (
              <>
                {/* Active Patient Card Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-slate-900">{selectedQueueItem.patientName}</h2>
                      <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-300">
                        {selectedQueueItem.tokenNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedQueueItem.gender}, {selectedQueueItem.patientAge}y • Spoke: <strong>{selectedQueueItem.subCenterName}</strong> (Lead: {selectedQueueItem.connectedChoName})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isLiveConsulting ? (
                      <button
                        onClick={() => {
                          setIsLiveConsulting(true);
                          showToast(`Joined HD encrypted video room with ${selectedQueueItem.patientName}`);
                        }}
                        className="bg-[#003527] hover:bg-[#064e3b] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <Video className="w-4 h-4 text-emerald-400" />
                        <span>Start Video Call</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsLiveConsulting(false)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                      >
                        <PhoneCall className="w-4 h-4 rotate-[135deg]" />
                        <span>Disconnect Call</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Vitals Telemetry Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">BP</span>
                    <span className="font-bold text-slate-900">{selectedQueueItem.vitals.bp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Pulse</span>
                    <span className="font-bold text-slate-900">{selectedQueueItem.vitals.pulse}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">SpO2</span>
                    <span className="font-bold text-emerald-700">{selectedQueueItem.vitals.spo2}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Temp</span>
                    <span className="font-bold text-slate-900">{selectedQueueItem.vitals.temp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Weight</span>
                    <span className="font-bold text-slate-900">{selectedQueueItem.vitals.weight}</span>
                  </div>
                </div>

                {/* Live Video Room (When Active) */}
                {isLiveConsulting && (
                  <div className="bg-slate-950 text-white rounded-3xl p-5 aspect-video relative flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800">
                    <div className="flex items-center justify-between z-10">
                      <div className="bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="font-bold">Consulting: {selectedQueueItem.patientName}</span>
                        <span className="text-slate-400">({selectedQueueItem.subCenterName})</span>
                      </div>
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 px-2.5 py-1 rounded-xl text-[11px] font-mono">
                        HD 1080p WebRTC
                      </span>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 p-1 mx-auto">
                          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                            <User className="w-10 h-10 text-emerald-300" />
                          </div>
                        </div>
                        <div className="font-bold text-white text-sm">{selectedQueueItem.patientName} (Spoke Feed)</div>
                        <div className="text-xs text-slate-400">CHO Pooja Jadhav assisting at Khamgaon Sub-Centre</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between z-10 pt-2 border-t border-slate-800 text-xs">
                      <span className="text-slate-400">Call Duration: 04:18 Mins</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveTab('prescribe')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs"
                        >
                          Write Prescription
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Sub-Tabs Bar */}
                <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
                  {[
                    { id: 'consultation', label: 'Clinical Assessment & Notes', icon: FileText },
                    { id: 'prescribe', label: 'Issue e-Prescription (Rx)', icon: Pill },
                    { id: 'lab_order', label: 'Laboratory Order Requisition', icon: Activity },
                    { id: 'referral', label: 'Specialty / ICU Referral', icon: Send }
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
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: CLINICAL NOTES */}
                {activeTab === 'consultation' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Clinical History & Examination Findings
                      </label>
                      <textarea
                        rows={4}
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter clinical examination observations, diagnosis, and patient instructions..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          showToast('Clinical notes saved to ABHA Electronic Health Record.');
                          setActiveTab('prescribe');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save Notes & Proceed to Rx</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: INTERACTIVE PRESCRIPTION BUILDER */}
                {activeTab === 'prescribe' && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        + Add Medication from Formulary
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            placeholder="Drug name (e.g. Paracetamol 500mg)..."
                            value={draftMedName}
                            onChange={(e) => setDraftMedName(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                          />
                        </div>
                        <div>
                          <select
                            value={draftFrequency}
                            onChange={(e) => setDraftFrequency(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                          >
                            <option value="1-0-1">1-0-1 (Twice Daily)</option>
                            <option value="1-0-0">1-0-0 (Morning)</option>
                            <option value="0-0-1">0-0-1 (Night)</option>
                            <option value="1-1-1">1-1-1 (Thrice Daily)</option>
                            <option value="SOS">SOS (As needed)</option>
                          </select>
                        </div>
                        <div>
                          <button
                            onClick={handleAddMedication}
                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Drug</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Prescribed Items Table */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Prescription Items ({rxItems.length})
                      </span>
                      <div className="space-y-2">
                        {rxItems.map((item, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                            <div className="space-y-1">
                              <div className="font-extrabold text-sm text-slate-900">{item.name}</div>
                              <div className="text-xs text-slate-600">
                                {item.dosage} • {item.frequency} • Duration: <strong>{item.duration}</strong> (Qty: {item.quantity})
                              </div>
                              <div className="text-[11px] text-emerald-800 font-medium">💡 {item.instructions}</div>
                            </div>
                            <button
                              onClick={() => handleRemoveMedication(idx)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sign & Issue Button */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleIssuePrescription}
                        className="flex-1 bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Digitally Sign & Issue e-Prescription (ABHA Dispatch)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: DIAGNOSTIC REQUISITION */}
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

                {/* TAB 4: SPECIALTY / ICU REFERRAL */}
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
