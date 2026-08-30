import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { MAHARASHTRA_FACILITIES } from '../../data/mockData';
import { bhashiniAI } from '../../services/bhashiniService';
import { 
  PhoneCall, 
  X, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  CheckCircle2,
  Navigation,
  Clock,
  ArrowRight,
  Truck,
  Heart,
  Zap,
  User,
  Search,
  ChevronRight,
  AlertOctagon,
  Shield,
  Hospital,
  Ambulance,
  Mic,
  MicOff,
  Sparkles,
  Flame,
  Volume2
} from 'lucide-react';

type ReferralLeg = {
  label: string;
  facility: string;
  distance: string;
  bedsAvail: number;
  icuAvail: number;
  status: 'completed' | 'active' | 'pending';
};

const REFERRAL_CHAIN: ReferralLeg[] = [
  { label: 'Sub-Centre / ASHA', facility: 'Khamgaon Sub-Centre (AAM)', distance: '0 km', bedsAvail: 0, icuAvail: 0, status: 'completed' },
  { label: 'Primary Health Centre', facility: 'Otur PHC', distance: '7 km', bedsAvail: 4, icuAvail: 0, status: 'active' },
  { label: 'Rural Hospital', facility: 'Junnar Rural Hospital', distance: '18 km', bedsAvail: 12, icuAvail: 2, status: 'pending' },
  { label: 'District Hospital', facility: 'Pune Civil Hospital (DH)', distance: '65 km', bedsAvail: 38, icuAvail: 8, status: 'pending' },
];

const FIRST_AID_CARDS = [
  { color: 'red', title: 'Heart Attack / Chest Pain', keywords: ['chest', 'heart', 'attack', 'pain', 'छाती', 'हृदय', 'ଦରଜ'], steps: ['Sit patient upright and loosen tight clothing.', 'Give Aspirin 300mg chewable (if not allergic).', 'Do NOT give water, solid food or stimulants.', 'Call 108 immediately; start CPR if patient becomes unresponsive.'] },
  { color: 'green', title: 'Snakebite (ASV Protocol)', keywords: ['snake', 'bite', 'snakebite', 'सांप', 'ସାପ'], steps: ['Immobilize the affected limb with a splint; keep it below heart level.', 'Remove tight rings, bracelets, and footwear near the bite immediately.', 'Do NOT cut, suck venom, wash vigorously, or apply tight tourniquets.', 'Rush immediately to nearest PHC for Anti-Snake Venom (ASV) within Golden Hour.'] },
  { color: 'blue', title: 'Severe Bleeding & Trauma', keywords: ['bleed', 'blood', 'trauma', 'cut', 'wound', 'खून', 'ରକ୍ତ'], steps: ['Apply firm, continuous direct pressure with a sterile/clean pad.', 'Elevate the injured limb above heart level if no fracture is suspected.', 'Do NOT pull out deeply embedded penetrating objects.', 'Pack wound firmly and call 108 for emergency resuscitation.'] },
  { color: 'amber', title: 'Severe Pregnancy / ANC Emergency', keywords: ['pregnant', 'delivery', 'maternal', 'pregnancy', 'गर्भ', 'ଗର୍ଭବତୀ'], steps: ['Place the mother in left lateral tilt (lying on her left side).', 'Ensure open airway and do not administer solid food/water if convulsing.', 'Check for active bleeding, amniotic rupture, or high blood pressure.', 'Call 108 immediately and state "Obstetric Code Red" for priority transfer.'] },
  { color: 'purple', title: 'Stroke (Brain Attack / FAST)', keywords: ['stroke', 'paralysis', 'fast', 'lakwa', 'পক্ষাঘাত'], steps: ['Perform FAST check: Face droop, Arm weakness, Slurred speech, Time to call 108.', 'Do NOT give aspirin, food, or water to suspected stroke patients.', 'Keep patient calm, head elevated at 30 degrees, note exact symptom start time.', 'Transfer rapidly to nearest CT-scan equipped Civil / District Hospital.'] },
  { color: 'cyan', title: 'Child Febrile Seizure / Fits', keywords: ['seizure', 'fits', 'child', 'convulsion', 'झटका'], steps: ['Lay the child gently on their side in a safe area away from hard edges.', 'Do NOT restrain the child or insert fingers/spoons into their mouth.', 'Time the seizure — if it lasts longer than 5 minutes, call 108.', 'After seizure stops, sponge with tepid (lukewarm) water to bring down fever.'] },
  { color: 'red', title: 'Severe Burns & Scalds', keywords: ['burn', 'fire', 'scald', 'oil', 'जलना', 'ପୋଡ଼ି'], steps: ['Cool the burn immediately under cool, running tap water for 15-20 minutes.', 'Do NOT apply toothpaste, butter, ice, or burst any blisters.', 'Cover the burned area loosely with a sterile, non-adherent dressing or clean cling film.', 'Keep patient warm and hydrate with ORS if conscious; call 108 for extensive burns.'] },
  { color: 'amber', title: 'Poisoning & Chemical Ingestion', keywords: ['poison', 'chemical', 'insecticide', 'pesticide', 'विष', 'ବିଷ'], steps: ['Identify the poison container/label without inhaling fumes.', 'Do NOT induce vomiting unless specifically told by a poison control doctor.', 'If skin or eyes are exposed, flush thoroughly with copious water for 15 mins.', 'Rush immediately to nearest PHC with the poison packaging or bottle.'] },
  { color: 'blue', title: 'Drowning / Near Drowning', keywords: ['drown', 'water', 'submersion', 'ডুবে', 'ପାଣି'], steps: ['Remove person from water safely without putting yourself at risk.', 'Check for breathing; if not breathing, start CPR immediately with 5 rescue breaths.', 'Perform cycles of 30 chest compressions followed by 2 rescue breaths.', 'Keep patient warm with dry blankets and transfer to hospital even if revived.'] },
  { color: 'purple', title: 'Bone Fracture & Dislocation', keywords: ['fracture', 'bone', 'broken', 'dislocation', 'हड्डी', 'ହାଡ଼'], steps: ['Immobilize the injured area; support the bone above and below the fracture.', 'Apply an ice pack wrapped in a cloth to reduce swelling (max 15 mins).', 'Do NOT attempt to push bone fragments back in or straighten crooked limbs.', 'Cover open wounds with a clean cloth and transport to nearest Trauma Care Centre.'] },
  { color: 'green', title: 'Dog / Animal Bite (Rabies Prevention)', keywords: ['dog', 'animal', 'bite', 'rabies', 'कुत्ता', 'କୁକୁର'], steps: ['Wash the wound immediately under running water with soap for at least 15 minutes.', 'Apply an antiseptic like Povidone-Iodine; do NOT stitch or cauterize the wound.', 'Do NOT apply turmeric, chilli powder, or soil to the bite.', 'Visit PHC on Day 0 for Anti-Rabies Vaccine (ARV) and Immunoglobulin (RIG).'] },
  { color: 'cyan', title: 'Heatstroke & Severe Dehydration', keywords: ['heat', 'heatstroke', 'dehydration', 'sun', 'लू', 'ଅଂଶୁଘାତ'], steps: ['Move person to a shaded, cool, well-ventilated spot immediately.', 'Remove excess clothing and apply cool, wet cloths over neck, armpits, and groin.', 'Fan the patient continuously; give small sips of ORS or cool water if fully conscious.', 'If confusion or loss of consciousness occurs, call 108 immediately.'] },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  red:    { bg: 'bg-red-50',    text: 'text-red-800',    border: 'border-red-200' },
  green:  { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-800',   border: 'border-blue-200' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-800',  border: 'border-amber-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  cyan:   { bg: 'bg-cyan-50',   text: 'text-cyan-800',   border: 'border-cyan-200' },
};

export const EmergencyModal: React.FC = () => {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen, language, t, showToast } = useApp();
  const { getPatientByAbhaOrMobile } = useHealthData();

  const [ambulanceDispatched, setAmbulanceDispatched] = useState(false);
  const [etaSeconds, setEtaSeconds] = useState(480); // 8 minutes
  const [activeTab, setActiveTab] = useState<'sos' | 'referral_chain' | 'first_aid'>('sos');
  const [abhaQuery, setAbhaQuery] = useState('');
  const [foundPatient, setFoundPatient] = useState<any>(null);
  const [selectedFirstAid, setSelectedFirstAid] = useState<number | null>(null);
  const [firstAidSearch, setFirstAidSearch] = useState<string>('');
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);

  const nearestTrauma = MAHARASHTRA_FACILITIES[0];

  const handleVoiceSearch = () => {
    setIsVoiceListening(true);
    bhashiniAI.asr(
      language,
      (transcript) => {
        setFirstAidSearch(transcript);
        showToast(`Voice Search: "${transcript}"`);
      },
      (err) => {
        console.warn('Voice ASR:', err);
      },
      () => {
        setIsVoiceListening(false);
      }
    );
  };

  const filteredFirstAidCards = FIRST_AID_CARDS.filter(card => {
    if (!firstAidSearch.trim()) return true;
    const q = firstAidSearch.toLowerCase();
    return card.title.toLowerCase().includes(q) || 
      card.keywords?.some(k => k.toLowerCase().includes(q)) ||
      card.steps.some(s => s.toLowerCase().includes(q));
  });

  // Countdown timer for ambulance ETA
  useEffect(() => {
    if (!ambulanceDispatched || etaSeconds <= 0) return;
    const timer = setInterval(() => {
      setEtaSeconds(s => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [ambulanceDispatched, etaSeconds]);

  const formatETA = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const etaProgress = ambulanceDispatched ? ((480 - etaSeconds) / 480) * 100 : 0;

  const handleDispatchAmbulance = () => {
    setAmbulanceDispatched(true);
    setEtaSeconds(480);
    showToast('🚑 Ambulance MH-14-EM-8421 dispatched! ETA 8 minutes.');
  };

  const handleAbhaSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const result = getPatientByAbhaOrMobile(abhaQuery.trim());
    setFoundPatient(result || 'NOT_FOUND');
  };

  const handleClose = () => {
    setIsEmergencyModalOpen(false);
    setAmbulanceDispatched(false);
    setEtaSeconds(480);
    setActiveTab('sos');
    setFoundPatient(null);
    setAbhaQuery('');
    setSelectedFirstAid(null);
  };

  if (!isEmergencyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl border border-red-200 animate-in zoom-in-95 duration-200">
        
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white p-5 flex items-start justify-between sticky top-0 z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white shrink-0 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white text-red-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">● LIVE</span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">24×7 Emergency Grid</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{t.emergencyModalTitle || 'Emergency & Referral Coordination'}</h2>
              <p className="text-red-200 text-xs mt-0.5">Multi-leg MJPJAY referral chain · Ambulance dispatch · First-aid</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors mt-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-red-50 border-b border-red-100 flex gap-1 p-2">
          {[
            { id: 'sos', label: '🚑 SOS & Dispatch', icon: PhoneCall },
            { id: 'referral_chain', label: '🏥 Referral Chain', icon: ChevronRight },
            { id: 'first_aid', label: '🩹 First-Aid Guide', icon: Shield },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-red-600 text-white shadow-md' : 'text-red-700 hover:bg-red-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-5">

          {/* TAB: SOS & Dispatch */}
          {activeTab === 'sos' && (
            <>
              {/* ABHA Patient Lookup */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Link Patient to Emergency (Optional)</span>
                </div>
                <form onSubmit={handleAbhaSearch} className="flex gap-2">
                  <input
                    value={abhaQuery}
                    onChange={e => setAbhaQuery(e.target.value)}
                    placeholder="Enter ABHA ID or Mobile Number..."
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  <button type="submit" className="bg-red-600 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-700 flex items-center gap-1">
                    <Search className="w-3.5 h-3.5" /> Find
                  </button>
                </form>
                {foundPatient && foundPatient !== 'NOT_FOUND' && (
                  <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-emerald-900">{foundPatient.name}</span>
                      <span className="text-slate-500 ml-2">{foundPatient.age}y · {foundPatient.riskLevel} · {foundPatient.village}</span>
                    </div>
                  </div>
                )}
                {foundPatient === 'NOT_FOUND' && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> No patient found. Proceeding as unregistered emergency.
                  </div>
                )}
              </div>

              {/* Dial Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="tel:108"
                  onClick={handleDispatchAmbulance}
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white p-4 rounded-2xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-between group active:scale-95"
                >
                  <div>
                    <div className="text-xs text-red-100 font-medium">Free Emergency Ambulance</div>
                    <div className="text-2xl font-black mt-0.5 tracking-tight flex items-center gap-2">
                      <span>Dial 108</span>
                      <PhoneCall className="w-5 h-5 group-hover:animate-ping" />
                    </div>
                    <div className="text-[10px] text-red-200 mt-1">ALS/BLS with O₂ · Paramedic on board</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                </a>

                <a
                  href="tel:104"
                  className="bg-slate-900 hover:bg-black text-white p-4 rounded-2xl shadow-md transition-all flex items-center justify-between group active:scale-95"
                >
                  <div>
                    <div className="text-xs text-slate-300 font-medium">24×7 Arogya Varta Helpline</div>
                    <div className="text-2xl font-black mt-0.5 tracking-tight flex items-center gap-2">
                      <span>Dial 104</span>
                      <PhoneCall className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Immediate doctor triage advice</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <Activity className="w-6 h-6 text-emerald-400" />
                  </div>
                </a>
              </div>

              {/* Additional hotlines */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { num: '1800-233-3400', label: 'MJPJAY Helpline', color: 'amber' },
                  { num: '102', label: 'Janani Express (Maternal)', color: 'pink' },
                  { num: '112', label: 'Police Emergency', color: 'blue' },
                ].map(h => (
                  <a key={h.num} href={`tel:${h.num}`} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl text-center transition-all active:scale-95 group">
                    <div className="text-[11px] text-slate-500 font-medium truncate">{h.label}</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                      {h.num} <PhoneCall className="w-3 h-3 text-slate-400 group-hover:text-red-500 transition-colors" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Ambulance Live Tracker */}
              {ambulanceDispatched && (
                <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl space-y-3 animate-in slide-in-from-top-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      <span>🚑 Unit MH-14-EM-8421 — En Route</span>
                    </div>
                    <div className="text-xl font-black text-emerald-700">
                      {etaSeconds > 0 ? `ETA ${formatETA(etaSeconds)}` : '✅ Arrived'}
                    </div>
                  </div>
                  <div className="w-full bg-emerald-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${etaProgress}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                    <div className="text-center">
                      <div className="font-bold text-emerald-800">Paramedic</div>
                      <div>Ramesh Shinde</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-emerald-800">Equipment</div>
                      <div>AED · O₂ · IV Kit</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-emerald-800">Origin</div>
                      <div>Otur PHC Base</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Nearest Facility */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>Nearest 24/7 Trauma & Emergency Facility</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">
                      {language === 'mr' ? nearestTrauma.nameMr : nearestTrauma.name}
                    </h4>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {nearestTrauma.village}, {nearestTrauma.taluka} · {nearestTrauma.distanceKm} km away
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-lg">
                      {nearestTrauma.icuBedsAvailable} ICU Free
                    </span>
                    <a href={`tel:${nearestTrauma.contactNumber}`} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <PhoneCall className="w-3 h-3" />
                      <span>Call Hospital</span>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: Referral Chain */}
          {activeTab === 'referral_chain' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2 text-xs text-amber-800">
                <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <span className="font-bold">MJPJAY Referral Protocol:</span> Start at the lowest capable level. Escalate only if patient requires higher care. Each step must document reason for referral.
                </div>
              </div>

              <div className="space-y-3">
                {REFERRAL_CHAIN.map((leg, i) => (
                  <div key={i} className={`relative flex gap-3 ${i < REFERRAL_CHAIN.length - 1 ? 'pb-3' : ''}`}>
                    {/* Connector line */}
                    {i < REFERRAL_CHAIN.length - 1 && (
                      <div className="absolute left-5 top-11 w-0.5 h-full bg-slate-200 z-0" />
                    )}
                    {/* Step indicator */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 text-sm font-black border-2 ${
                      leg.status === 'completed' ? 'bg-emerald-600 border-emerald-600 text-white' :
                      leg.status === 'active'    ? 'bg-red-600 border-red-600 text-white animate-pulse' :
                      'bg-slate-100 border-slate-300 text-slate-400'
                    }`}>
                      {leg.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                    </div>
                    {/* Content */}
                    <div className={`flex-1 border rounded-2xl p-3 ${
                      leg.status === 'active' ? 'border-red-300 bg-red-50' :
                      leg.status === 'completed' ? 'border-emerald-200 bg-emerald-50' :
                      'border-slate-200 bg-white'
                    }`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{leg.label}</div>
                          <div className="font-extrabold text-sm text-slate-900 mt-0.5">{leg.facility}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{leg.distance} from patient</div>
                        </div>
                        <div className="text-right shrink-0">
                          {leg.bedsAvail > 0 && (
                            <div className="text-xs">
                              <span className="font-bold text-slate-700">{leg.bedsAvail}</span>
                              <span className="text-slate-400"> beds</span>
                            </div>
                          )}
                          {leg.icuAvail > 0 && (
                            <div className="text-xs">
                              <span className="font-bold text-red-700">{leg.icuAvail}</span>
                              <span className="text-slate-400"> ICU</span>
                            </div>
                          )}
                          {leg.status === 'active' && (
                            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">CURRENT</span>
                          )}
                          {leg.status === 'completed' && (
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">DONE</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => showToast('Referral documentation logged. Facility notified via HMIS.')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ArrowRight className="w-4 h-4" />
                Escalate to Next Referral Level
              </button>
            </div>
          )}

          {/* TAB: First-Aid Guide */}
          {activeTab === 'first_aid' && (
            <div className="space-y-3.5">
              
              {/* Voice-to-Text / Custom Search Bar */}
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-300">
                <Search className="w-4 h-4 text-slate-400 ml-1.5 shrink-0" />
                <input
                  type="text"
                  value={firstAidSearch}
                  onChange={(e) => setFirstAidSearch(e.target.value)}
                  placeholder="Search emergency (e.g. burns, fracture, asthma, snakebite, drowning)..."
                  className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-hidden placeholder:font-normal placeholder:text-slate-400"
                />
                {firstAidSearch && (
                  <button onClick={() => setFirstAidSearch('')} className="text-slate-400 hover:text-slate-600 p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                    isVoiceListening 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                  }`}
                  title="Speak emergency in your language (Voice to Text)"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isVoiceListening ? 'Listening...' : 'Voice Search'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 font-medium">Select an emergency type for step-by-step first-aid protocol:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredFirstAidCards.map((card, i) => {
                  const colors = COLOR_MAP[card.color];
                  const isSelected = selectedFirstAid === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedFirstAid(isSelected ? null : i)}
                      className={`text-left p-3 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? `${colors.bg} ${colors.border} ${colors.text} shadow-md`
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs leading-tight">{card.title}</div>
                    </button>
                  );
                })}
              </div>

              {filteredFirstAidCards.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center text-xs text-amber-900 space-y-2">
                  <p>No preset match for "{firstAidSearch}". For any acute emergency, dial 108 immediately.</p>
                  <a href="tel:108" className="inline-flex items-center gap-1.5 bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs">
                    <PhoneCall className="w-3.5 h-3.5" /> Direct Call 108 SOS
                  </a>
                </div>
              )}

              {selectedFirstAid !== null && filteredFirstAidCards[selectedFirstAid] && (
                <div className={`${COLOR_MAP[filteredFirstAidCards[selectedFirstAid].color].bg} border-2 ${COLOR_MAP[filteredFirstAidCards[selectedFirstAid].color].border} rounded-2xl p-4 animate-in slide-in-from-top-2`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-extrabold text-sm ${COLOR_MAP[filteredFirstAidCards[selectedFirstAid].color].text}`}>
                      {filteredFirstAidCards[selectedFirstAid].title}
                    </h4>
                    <button
                      onClick={() => bhashiniAI.tts(filteredFirstAidCards[selectedFirstAid].steps.join('. '), language)}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-300 flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Listen Audio</span>
                    </button>
                  </div>

                  <ol className="space-y-2">
                    {filteredFirstAidCards[selectedFirstAid].steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <span className={`w-5 h-5 rounded-full ${COLOR_MAP[filteredFirstAidCards[selectedFirstAid].color].bg} border ${COLOR_MAP[filteredFirstAidCards[selectedFirstAid].color].border} ${COLOR_MAP[filteredFirstAidCards[selectedFirstAid].color].text} flex items-center justify-center font-black text-[10px] shrink-0`}>
                          {j + 1}
                        </span>
                        <span className="leading-snug pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-3 pt-3 border-t border-slate-200 flex gap-2">
                    <a href="tel:108" className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1">
                      <PhoneCall className="w-3 h-3" /> Call 108
                    </a>
                    <a href="tel:104" className="flex-1 bg-slate-800 text-white text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1">
                      <PhoneCall className="w-3 h-3" /> Call 104
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
