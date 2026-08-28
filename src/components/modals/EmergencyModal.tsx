import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MAHARASHTRA_FACILITIES } from '../../data/mockData';
import { 
  PhoneCall, 
  X, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  HeartHandshake, 
  Activity, 
  CheckCircle2,
  Navigation
} from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen, language, showToast } = useApp();
  const [ambulanceDispatched, setAmbulanceDispatched] = useState(false);

  if (!isEmergencyModalOpen) return null;

  const handleDispatchAmbulance = () => {
    setAmbulanceDispatched(true);
    showToast(language === 'mr' ? '१०८ रुग्णवाहिका रवाना झाली - अपेक्षित वेळ ८ मिनिटे' : '108 Ambulance Dispatched! ETA: 8 minutes to your GPS coordinates.');
  };

  const nearestTrauma = MAHARASHTRA_FACILITIES[0]; // Junnar Trauma Centre

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-red-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-white shrink-0 animate-bounce">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-red-700 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  24x7 Emergency Grid
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
                {language === 'mr' ? 'आपत्कालीन मदत व रुग्णवाहिका १०८' : 'Maharashtra Emergency Medical Response'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => { setIsEmergencyModalOpen(false); setAmbulanceDispatched(false); }}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Main Dial Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="tel:108"
              onClick={handleDispatchAmbulance}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white p-4 rounded-2xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-between group active:scale-95"
            >
              <div>
                <div className="text-xs text-red-100 font-medium">Free Emergency Ambulance</div>
                <div className="text-2xl font-black mt-0.5 tracking-tight flex items-center gap-2">
                  <span>Dial 108</span>
                  <PhoneCall className="w-5 h-5 group-hover:animate-ping" />
                </div>
                <div className="text-[10px] text-red-200 mt-1">ALS / BLS with oxygen & paramedic</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
            </a>

            <a
              href="tel:104"
              className="bg-slate-900 hover:bg-black text-white p-4 rounded-2xl shadow-md transition-all flex items-center justify-between group active:scale-95"
            >
              <div>
                <div className="text-xs text-slate-300 font-medium">24x7 Doctor Guidance (Arogya Varta)</div>
                <div className="text-2xl font-black mt-0.5 tracking-tight flex items-center gap-2">
                  <span>Dial 104</span>
                  <PhoneCall className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Immediate doctor triage advice</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
            </a>
          </div>

          {/* Ambulance Dispatch Live Simulation Tracker */}
          {ambulanceDispatched && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs space-y-2 animate-in slide-in-from-top-3">
              <div className="flex items-center justify-between font-bold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Ambulance Unit #MH-14-EM-8421 Dispatched</span>
                </span>
                <span className="text-emerald-700 font-extrabold">ETA: 8 mins</span>
              </div>
              <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-2/3 animate-pulse" />
              </div>
              <div className="text-slate-600 text-[11px] flex items-center justify-between">
                <span>GPS Location: Near Khamgaon Sub-Centre, Junnar Taluka</span>
                <span className="font-semibold text-emerald-800">Paramedic: Ramesh Shinde</span>
              </div>
            </div>
          )}

          {/* Nearest 24x7 Trauma & ICU Facility */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>Nearest Open 24/7 Trauma & Emergency Facility:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  {language === 'mr' ? nearestTrauma.nameMr : nearestTrauma.name}
                </h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  {nearestTrauma.village}, {nearestTrauma.taluka} ({nearestTrauma.distanceKm} km away)
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-lg">
                  {nearestTrauma.icuBedsAvailable} ICU Beds Available
                </span>
                <a
                  href={`tel:${nearestTrauma.contactNumber}`}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call Hospital</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick First-Aid Protocols */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Immediate First-Aid Protocols while waiting:</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-bold text-red-800 pb-1">Heart Attack / Chest Pain</div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Keep patient sitting upright. Loosen tight clothes. Give Disprin/Aspirin 300mg chewable if advised.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-bold text-emerald-800 pb-1">Snakebite Protocol</div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Immobilize limb with splint. Do not tie tight tourniquets or cut wound. Head straight to PHC for ASV.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-bold text-blue-800 pb-1">Severe Bleeding / Trauma</div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Apply firm continuous direct pressure using a clean cloth. Elevate the bleeding limb above heart level.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
