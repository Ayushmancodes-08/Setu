import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { MAHARASHTRA_FACILITIES } from '../../data/mockData';
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
  Ambulance
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
  { color: 'red', title: 'Heart Attack / Chest Pain', steps: ['Sit patient upright, loosen clothing', 'Give Aspirin 300mg chewable (if not allergic)', 'Do NOT give water / food', 'Call 108 immediately, start CPR if unconscious'] },
  { color: 'green', title: 'Snakebite', steps: ['Immobilize the affected limb with splint', 'Remove rings / tight items near bite', 'Do NOT cut, suck, or tourniquet', 'Rush to nearest PHC for ASV (Anti-Snake Venom)'] },
  { color: 'blue', title: 'Severe Bleeding / Trauma', steps: ['Apply firm continuous direct pressure', 'Elevate limb above heart level', 'Do NOT remove embedded objects', 'Pack wound with clean cloth, call 108'] },
  { color: 'amber', title: 'Severe Pregnancy Emergency', steps: ['Lay patient on left side', 'Check for bleeding, convulsions', 'Do not give food/water if unconscious', 'Call 108 — state "obstetric emergency"'] },
  { color: 'purple', title: 'Stroke (Brain Attack)', steps: ['FAST: Face droop, Arm weakness, Speech slur, Time to call 108', 'Do NOT give aspirin for stroke', 'Keep patient calm, do not give anything by mouth', 'Note time when symptoms started'] },
  { color: 'cyan', title: 'Child Febrile Seizure', steps: ['Lay child on side on soft surface', 'Do not restrain or put anything in mouth', 'Time the seizure — if >5 min, call 108', 'Cool child with tepid sponge after seizure stops'] },
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

  const nearestTrauma = MAHARASHTRA_FACILITIES[0];

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
            <div className="space-y-3">
              <div className="text-xs text-slate-500 font-medium">Select an emergency type for step-by-step first-aid protocol:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FIRST_AID_CARDS.map((card, i) => {
                  const colors = COLOR_MAP[card.color];
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedFirstAid(selectedFirstAid === i ? null : i)}
                      className={`text-left p-3 rounded-2xl border-2 transition-all ${
                        selectedFirstAid === i
                          ? `${colors.bg} ${colors.border} ${colors.text} shadow-md`
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs leading-tight">{card.title}</div>
                    </button>
                  );
                })}
              </div>

              {selectedFirstAid !== null && (
                <div className={`${COLOR_MAP[FIRST_AID_CARDS[selectedFirstAid].color].bg} border-2 ${COLOR_MAP[FIRST_AID_CARDS[selectedFirstAid].color].border} rounded-2xl p-4 animate-in slide-in-from-top-2`}>
                  <h4 className={`font-extrabold text-sm ${COLOR_MAP[FIRST_AID_CARDS[selectedFirstAid].color].text} mb-3`}>
                    {FIRST_AID_CARDS[selectedFirstAid].title}
                  </h4>
                  <ol className="space-y-2">
                    {FIRST_AID_CARDS[selectedFirstAid].steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <span className={`w-5 h-5 rounded-full ${COLOR_MAP[FIRST_AID_CARDS[selectedFirstAid].color].bg} border ${COLOR_MAP[FIRST_AID_CARDS[selectedFirstAid].color].border} ${COLOR_MAP[FIRST_AID_CARDS[selectedFirstAid].color].text} flex items-center justify-center font-black text-[10px] shrink-0`}>
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
