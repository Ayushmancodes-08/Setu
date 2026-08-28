import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { Role } from '../../types';
import { 
  Building2, 
  Stethoscope, 
  HeartHandshake, 
  Activity, 
  Layers, 
  ShieldCheck, 
  PhoneCall, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Users, 
  FileText,
  AlertTriangle
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentView, language, setIsEmergencyModalOpen, showToast } = useApp();
  const { patients, facilities, teleconsultQueue } = useHealthData();

  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<any>(null);

  const totalBeds = facilities.reduce((acc, f) => acc + f.availableBeds, 0);
  const totalIcuBeds = facilities.reduce((acc, f) => acc + f.icuBedsAvailable, 0);
  const waitingTokens = teleconsultQueue.filter(t => t.status === 'Waiting').length;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    const clean = lookupQuery.toLowerCase().trim();
    const found = patients.find(p => 
      p.name.toLowerCase().includes(clean) || 
      p.abhaId.toLowerCase().includes(clean) || 
      p.mobile.includes(clean)
    );
    setLookupResult(found || 'NONE');
  };

  return (
    <section className="bg-gradient-to-b from-slate-900 via-[#07241b] to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-950/60">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Official Tag & Mission Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-emerald-800/40">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>National Digital Health Mission & Public Health Department, Maharashtra</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              SETU <span className="text-emerald-400">ग्रामीण आरोग्य</span> समन्वय मंच
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
              Unified Rural Health Coordination Hub connecting Sub-Centres, Primary Health Centres, Rural Hospitals, and District Specialists across Maharashtra.
            </p>
          </div>

          {/* Quick SOS & Helpline Dial */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-lg shadow-red-950/50 flex items-center gap-2 transition-all hover:scale-105 border border-red-400/40"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Emergency 108 Ambulance SOS</span>
            </button>
            <div className="bg-slate-800/90 border border-slate-700 px-4 py-2.5 rounded-2xl text-xs text-slate-300">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Toll-Free Health Line</span>
              <span className="font-extrabold text-white font-mono text-sm">104 / 1800-120-8040</span>
            </div>
          </div>
        </div>

        {/* Live Operational Health Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/60 backdrop-blur-xs border border-emerald-800/30 rounded-2xl p-4 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Network PHCs & Hospitals</span>
            </span>
            <div className="text-2xl font-extrabold text-white">{facilities.length} Facilities</div>
            <div className="text-[11px] text-emerald-400 font-medium">Junnar, Otur, Nandurbar</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs border border-emerald-800/30 rounded-2xl p-4 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Available Hospital Beds</span>
            </span>
            <div className="text-2xl font-extrabold text-white">{totalBeds} General</div>
            <div className="text-[11px] text-blue-300 font-medium">{totalIcuBeds} ICU / Ventilator Beds Free</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs border border-emerald-800/30 rounded-2xl p-4 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-amber-400" />
              <span>e-Sanjeevani Teleconsults</span>
            </span>
            <div className="text-2xl font-extrabold text-white">{waitingTokens} Active Queue</div>
            <div className="text-[11px] text-amber-300 font-medium">Avg Specialist Wait: 4 Mins</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xs border border-emerald-800/30 rounded-2xl p-4 space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ABDM Health Records</span>
            </span>
            <div className="text-2xl font-extrabold text-white">{patients.length} Registered</div>
            <div className="text-[11px] text-emerald-400 font-medium">100% ABHA Linked</div>
          </div>
        </div>

        {/* Quick ABHA Lookup & Direct Portal Launcher Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Direct ABHA & Token Verification Box */}
          <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span>Instant ABHA / Patient Lookup</span>
                </h3>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 border border-emerald-600/40 px-2 py-0.5 rounded-full font-mono">
                  ABDM Live
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Verify Ayushman Bharat Health Account (ABHA), active prescriptions, or teleconsultation token status:
              </p>

              <form onSubmit={handleLookup} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter ABHA, Name or Mobile..."
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="flex-1 bg-slate-900/90 border border-slate-600 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md"
                >
                  Verify
                </button>
              </form>

              {lookupResult && lookupResult !== 'NONE' && (
                <div className="mt-4 bg-emerald-950/90 border border-emerald-600/50 rounded-2xl p-4 text-xs space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{lookupResult.name}</div>
                      <div className="text-slate-400 text-[11px] font-mono">{lookupResult.abhaId}</div>
                    </div>
                    <span className="bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                      {lookupResult.riskLevel}
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    📍 {lookupResult.village}, {lookupResult.taluka} • 🩺 Last BP: <strong>{lookupResult.vitals.bp}</strong>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setCurrentView('patient')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-all text-center"
                    >
                      Open Patient Portal
                    </button>
                    <button
                      onClick={() => setCurrentView('doctor')}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs transition-all text-center"
                    >
                      Doctor Chart
                    </button>
                  </div>
                </div>
              )}

              {lookupResult === 'NONE' && (
                <div className="mt-4 bg-amber-950/80 border border-amber-600/50 rounded-2xl p-3 text-xs text-amber-200">
                  No record found for "{lookupQuery}". Search with "Sunita", "Shantabai", "Ganesh" or check the ASHA Portal.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>National Health Authority (NHA) Level 3 M1/M2/M3</span>
              <span className="text-emerald-400 font-bold">256-bit Encrypted</span>
            </div>
          </div>

          {/* Direct 8 Portals Fast Grid */}
          <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <h3 className="font-bold text-base text-white">Direct Role Console Launchpad</h3>
                <span className="text-xs text-slate-400">Select your active role</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                {[
                  { id: 'patient' as Role, title: 'Patient / Citizen', sub: 'ABHA & Rx', icon: Activity, bg: 'hover:border-teal-400' },
                  { id: 'asha' as Role, title: 'ASHA Worker', sub: 'Field ANC/NCD', icon: HeartHandshake, bg: 'hover:border-rose-400' },
                  { id: 'cho' as Role, title: 'CHO Officer', sub: 'Sub-Centre Spoke', icon: Stethoscope, bg: 'hover:border-emerald-400' },
                  { id: 'doctor' as Role, title: 'Specialist Doctor', sub: 'Teleconsult Hub', icon: Stethoscope, bg: 'hover:border-blue-400' },
                  { id: 'pharmacist' as Role, title: 'Pharmacist', sub: 'e-Aushadhi Stock', icon: Layers, bg: 'hover:border-amber-400' },
                  { id: 'lab' as Role, title: 'Diagnostic Lab', sub: 'Test Results', icon: Activity, bg: 'hover:border-purple-400' },
                  { id: 'facility' as Role, title: 'Hospital Ops', sub: 'Bed & 108 Dispatch', icon: Building2, bg: 'hover:border-indigo-400' },
                  { id: 'dho' as Role, title: 'DHO Officer', sub: 'District Command', icon: AlertTriangle, bg: 'hover:border-red-400' }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 text-left transition-all hover:scale-[1.02] hover:bg-slate-800 ${item.bg} group`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                      <div className="font-bold text-xs text-white leading-tight">{item.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Supports Marathi, Hindi & English Clinical UI</span>
              <button 
                onClick={() => setCurrentView('doctor')}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
              >
                <span>Launch Doctor Workbench</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
