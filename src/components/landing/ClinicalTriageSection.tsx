import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Stethoscope, 
  PhoneCall, 
  MapPin, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Volume2
} from 'lucide-react';
import { bhashiniAI } from '../../services/bhashiniService';

interface SymptomProtocol {
  id: string;
  nameEn: string;
  nameMr: string;
  category: string;
  urgency: 'red' | 'amber' | 'green';
  redFlags: string[];
  protocolEn: string;
  protocolMr: string;
  nearestFacilityType: string;
  recommendedDrugs: string[];
}

const PROTOCOLS: SymptomProtocol[] = [
  {
    id: 'sym-cardiac',
    nameEn: 'Acute Chest Pain / Radiating to Left Arm & Sweating',
    nameMr: 'छातीत तीव्र वेदना / डाव्या हाताकडे जाणारी कळ व घाम',
    category: 'Cardiovascular Emergency',
    urgency: 'red',
    redFlags: ['Crushing retrosternal chest pain > 15 mins', 'Cold clammy skin & diaphoresis', 'SpO2 < 92%', 'History of CAD / Diabetes'],
    protocolEn: 'CRITICAL EMERGENCY: Suspected Acute Coronary Syndrome / STEMI. Administer loading dose: Tab Aspirin 300mg chewable + Tab Clopidogrel 300mg + Tab Atorvastatin 80mg. Immediate 108 emergency ambulance transfer to District Hospital ICU.',
    protocolMr: 'अति तातडीची स्थिती: संशयित हृदयविकाराचा झटका. त्वरित १०८ रुग्णवाहिका बोलवून जवळच्या उपजिल्हा/जिल्हा रुग्णालयाच्या अतिदक्षता विभागात दाखल करा.',
    nearestFacilityType: 'Junnar Rural Hospital & Trauma Centre (ICU Equipped)',
    recommendedDrugs: ['Aspirin 300mg Chewable', 'Clopidogrel 300mg', 'Atorvastatin 80mg', 'Oxygen 4L/min']
  },
  {
    id: 'sym-anc-bp',
    nameEn: 'Pregnant Mother with High BP (BP > 140/90) & Severe Headache',
    nameMr: 'गरोदर मातेचा उच्च रक्तदाब (१४०/९० पेक्षा जास्त) व तीव्र डोकेदुखी',
    category: 'Maternal High-Risk (ANC)',
    urgency: 'red',
    redFlags: ['BP >= 140/90 mmHg', 'Blurred vision or epigastric pain', 'Edema on face & feet', 'Gestational age > 28 weeks'],
    protocolEn: 'CRITICAL: Severe Pre-Eclampsia / Imminent Eclampsia warning. Start Tab Labetalol 100mg PO if systolic > 150. Immediate e-Sanjeevani Obstetrician Teleconsult & transfer under JSSK protocol.',
    protocolMr: 'धोकादायक स्थिती: गर्भावस्थेतील तीव्र उच्च रक्तदाब. त्वरित स्त्रीरोग तज्ज्ञांशी ई-संजीवनी द्वारे संपर्क साधा व जननी सुरक्षा योजनेअंतर्गत रेफर करा.',
    nearestFacilityType: 'Junnar Sub-District Hospital (Maternity Wing)',
    recommendedDrugs: ['Labetalol 100mg', 'Magnesium Sulfate (under doctor order)', 'Ferrous Ascorbate']
  },
  {
    id: 'sym-fever',
    nameEn: 'High Grade Fever with Chills & Rigors (Suspected Malaria/Dengue)',
    nameMr: 'थंडी वाजून तीव्र ताप (संशयित हिवताप / डेंग्यू)',
    category: 'Infectious / Vector-borne',
    urgency: 'amber',
    redFlags: ['Temp > 102 °F for > 3 days', 'Severe headache and retro-orbital pain', 'Petechiae / rash', 'Platelet count drop risk'],
    protocolEn: 'URGENT CARE: Perform Malaria RDT (Pv/Pf) and Dengue NS1 antigen test at Sub-Centre/PHC. Start Paracetamol 500mg SOS for fever. Ensure 3-4 liters oral fluids/ORS. Do NOT give Ibuprofen or Aspirin.',
    protocolMr: 'तातडीची तपासणी: उपकेंद्रावर त्वरित मलेरिया व डेंग्यू रॅपिड टेस्ट करा. ताप कमी करण्यासाठी पॅरासिटामॉल द्या व भरपूर पाणी/ओआरएस प्यायला सांगा.',
    nearestFacilityType: 'Otur Primary Health Centre (PHC Lab & OPD)',
    recommendedDrugs: ['Paracetamol 500mg (SOS)', 'Oral Rehydration Salts (ORS)', 'Chloroquine / ACT (if RDT +ve)']
  },
  {
    id: 'sym-peds-diarrhea',
    nameEn: 'Child (< 5 Yrs) Severe Watery Diarrhea & Sunken Eyes',
    nameMr: 'लहान मुलांमधील तीव्र जुलाब व उलट्या (पाणी कमी होणे)',
    category: 'Pediatric Triage',
    urgency: 'amber',
    redFlags: ['Lethargic / floppy child', 'Skin pinch goes back very slowly (> 2s)', 'Unable to drink fluids', 'Passed > 6 watery stools today'],
    protocolEn: 'URGENT: Moderate-to-Severe Dehydration (IMNCI Plan B/C). Administer low-osmolarity ORS 75 mL/kg over 4 hours. Start Zinc Sulfate 20mg daily for 14 days. If child is unconscious, start IV Ringer Lactate immediately.',
    protocolMr: 'तातडीची काळजी: मुलास त्वरित ओआरएस (ORS) द्रावण द्या आणि झिंक २० मिग्रॅ गोळी सुरू करा. सुस्त असल्यास त्वरित प्राथमिक आरोग्य केंद्रात न्या.',
    nearestFacilityType: 'Otur PHC or Junnar Rural Hospital',
    recommendedDrugs: ['Low-Osmolarity ORS Packets', 'Zinc Sulfate 20mg Tablets', 'IV Ringer Lactate']
  },
  {
    id: 'sym-ncd-sugar',
    nameEn: 'Elderly Patient with Uncontrolled Blood Sugar (> 220 mg/dL)',
    nameMr: 'ज्येष्ठ नागरिकांमधील वाढलेली रक्तातील साखर (> २२०)',
    category: 'Non-Communicable Disease (NCD)',
    urgency: 'green',
    redFlags: ['Polyuria / polydipsia', 'No ketoacidosis signs', 'Known Diabetic on irregular meds'],
    protocolEn: 'ROUTINE NCD CARE: Fasting & PPBS confirmation. Review dietary compliance. Schedule CHO / Medical Officer teleconsultation for oral hypoglycemic agent (Metformin / Glimepiride) dosage titration.',
    protocolMr: 'नियमित काळजी: आहाराचे नियम पाळा, नियमित गोळ्या घ्या आणि सीएचओ कडे जाऊन डोस ॲडजस्ट करून घ्या.',
    nearestFacilityType: 'Khamgaon Ayushman Arogya Mandir (Sub-Centre)',
    recommendedDrugs: ['Metformin 500mg SR', 'Glimepiride 1mg / 2mg', 'Dietary Salt/Sugar restriction']
  }
];

export const ClinicalTriageSection: React.FC = () => {
  const { setCurrentView, language, showToast, setIsEmergencyModalOpen } = useApp();
  const { enqueueTeleconsult, createReferral } = useHealthData();

  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('sym-cardiac');
  const [patientAge, setPatientAge] = useState<number>(45);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female'>('Female');
  const [systolicBp, setSystolicBp] = useState<string>('150');
  const [spo2, setSpo2] = useState<string>('96');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const selected = PROTOCOLS.find(p => p.id === selectedProtocolId) || PROTOCOLS[0];

  const handleSpeakProtocol = () => {
    setIsSpeaking(true);
    const textToSpeak = language === 'mr' ? selected.protocolMr : selected.protocolEn;
    bhashiniAI.speakText(textToSpeak, language === 'mr' ? 'mr' : 'en', () => {
      setIsSpeaking(false);
    });
  };

  const handleEscalateToTeleconsult = async () => {
    await enqueueTeleconsult({
      patientName: `Triage Case (${patientGender}, ${patientAge}y)`,
      patientAge: patientAge,
      gender: patientGender,
      presentingComplaint: selected.nameEn,
      urgency: selected.urgency,
      vitals: {
        bp: `${systolicBp}/90 mmHg`,
        pulse: '88 bpm',
        spo2: `${spo2}%`,
        temp: '99.0 °F',
        weight: '58 kg'
      },
      subCenterName: 'Khamgaon Ayushman Arogya Mandir',
      connectedChoName: 'Field Triage Desk'
    });
    showToast(`Case successfully queued for specialist doctor evaluation with Token`);
    setCurrentView('doctor');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Stethoscope className="w-3.5 h-3.5 text-emerald-800" />
              <span>Standard Treatment Guidelines (STG / ICMR Triage)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Clinical Protocol & Symptom Decision Support
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
              Standardized triage engine for Frontline ASHA workers, CHOs, and Rural Medical Officers to rapidly assess severity and coordinate immediate life-saving care.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">Triage Severity:</span>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-lg border border-red-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Red (Immediate)
              </span>
              <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                Amber (Urgent)
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                Green (Routine)
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Triage Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Symptom & Vital Parameters Selection */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Presenting Clinical Complaint
              </label>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {PROTOCOLS.map((p) => {
                  const isSelected = p.id === selectedProtocolId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProtocolId(p.id)}
                      className={`w-full text-left p-3 rounded-2xl border text-xs transition-all ${
                        isSelected 
                          ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold' 
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">{p.category}</span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          p.urgency === 'red' ? 'bg-red-100 text-red-800' : p.urgency === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.urgency.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-1 text-slate-900 font-semibold">
                        {language === 'mr' ? p.nameMr : p.nameEn}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Vitals Modifier */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Patient Demographics & Vitals
              </label>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Age (Years)</span>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Gender</span>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Systolic BP (mmHg)</span>
                  <input
                    type="text"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Oxygen SpO2 (%)</span>
                  <input
                    type="text"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 font-mono"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Clinical Protocol Output & Immediate Action Flow */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Triage Urgency Header */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              selected.urgency === 'red' 
                ? 'bg-red-50/90 border-red-300 text-red-950' 
                : selected.urgency === 'amber'
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl text-white ${
                  selected.urgency === 'red' ? 'bg-red-600' : selected.urgency === 'amber' ? 'bg-amber-600' : 'bg-emerald-600'
                }`}>
                  {selected.urgency === 'red' ? <AlertOctagon className="w-6 h-6 animate-pulse" /> : <Activity className="w-6 h-6" />}
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider opacity-80">
                    Clinical Triage Rating
                  </div>
                  <div className="text-base sm:text-lg font-black leading-tight">
                    {selected.urgency === 'red' && 'LEVEL 1: CRITICAL EMERGENCY (RED)'}
                    {selected.urgency === 'amber' && 'LEVEL 2: URGENT MEDICAL CARE (AMBER)'}
                    {selected.urgency === 'green' && 'LEVEL 3: ROUTINE OUTPATIENT CARE (GREEN)'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSpeakProtocol}
                className="bg-white/90 hover:bg-white text-slate-800 border border-slate-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all shrink-0"
                title="Listen in Marathi or English"
              >
                <Volume2 className={`w-4 h-4 text-emerald-700 ${isSpeaking ? 'animate-ping' : ''}`} />
                <span>{isSpeaking ? 'Speaking...' : 'Listen Protocol'}</span>
              </button>
            </div>

            {/* Protocol Steps Box */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Mandated Clinical Protocol (ICMR / MoHFW Standards)</span>
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 leading-relaxed font-medium">
                {language === 'mr' ? selected.protocolMr : selected.protocolEn}
              </div>
            </div>

            {/* Red Flag Checklist */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Crucial Red Flag Indicators
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selected.redFlags.map((flag, idx) => (
                  <div key={idx} className="bg-red-50/60 border border-red-200/80 rounded-xl p-2.5 text-xs text-red-900 flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearest Recommended Facility & Drugs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 space-y-1">
                <span className="text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Equipped Receiving Facility</span>
                </span>
                <div className="font-extrabold text-slate-900">{selected.nearestFacilityType}</div>
                <div className="text-[11px] text-slate-600">24x7 Ambulance & ICU beds ready</div>
              </div>

              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-3.5 space-y-1">
                <span className="text-blue-800 text-[11px] font-bold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Immediate Essential Drugs</span>
                </span>
                <div className="font-bold text-slate-900 truncate">
                  {selected.recommendedDrugs.join(', ')}
                </div>
                <div className="text-[11px] text-slate-600">Available at Sub-Centre Drug Kit A/B</div>
              </div>
            </div>

            {/* One-Click Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {selected.urgency === 'red' ? (
                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>Dispatch 108 Ambulance & Alert Trauma Team</span>
                </button>
              ) : (
                <button
                  onClick={handleEscalateToTeleconsult}
                  className="flex-1 bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>Queue Case to Specialist Doctor Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setCurrentView('cho')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold py-3.5 px-5 rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Open Sub-Centre Console</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
