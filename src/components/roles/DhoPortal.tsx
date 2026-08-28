import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DISTRICT_METRICS } from '../../data/mockData';
import { 
  ShieldAlert, 
  MapPin, 
  TrendingUp, 
  Pill, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Activity,
  Building,
  Users,
  Filter
} from 'lucide-react';

export const DhoPortal: React.FC = () => {
  const { showToast } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState('Pune (Rural)');
  const [directiveText, setDirectiveText] = useState('Urgent: Ensure replenishment of Oxytocin 10 IU injection and Anti-Snake Venom (ASV) vials at Otur PHC and Junnar sub-store by today 4 PM.');
  const [heatmapMode, setHeatmapMode] = useState<'caseload' | 'waittime' | 'stockout'>('caseload');

  const handleSendDirective = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Administrative Directive dispatched to all 118 Facility Heads & Pharmacists in Pune District!');
  };

  const currentDistrictData = DISTRICT_METRICS.find(d => d.districtName === selectedDistrict) || DISTRICT_METRICS[0];

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* DHO Header Bar */}
        <div className="bg-[#002117] text-white rounded-3xl p-6 shadow-xl border border-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-800 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight">District Health Officer (DHO) Command Center</h1>
                <span className="bg-red-500/20 text-red-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-500/40">
                  Apex District Authority
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-1">
                District Health Administration • Directorate of Health Services, Govt of Maharashtra
              </p>
            </div>
          </div>

          {/* District Selector & Date Range */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-900 border border-emerald-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {DISTRICT_METRICS.map(d => (
                <option key={d.districtName} value={d.districtName}>{d.districtName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Headline Metrics (MEMORY.md Rule 19) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{currentDistrictData.activePatients.toLocaleString()}</div>
              <div className="text-xs text-slate-500 font-semibold">Active Patients Under Care</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-teal-50 text-teal-700">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{currentDistrictData.avgWaitTimeMinutes} Mins</div>
              <div className="text-xs text-slate-500 font-semibold">Average OPD Triage Wait Time</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-700">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{currentDistrictData.referralCompletionRate}%</div>
              <div className="text-xs text-slate-500 font-semibold">Referral Loop Completion Rate</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{currentDistrictData.facilitiesWithStockout} Facilities</div>
              <div className="text-xs text-slate-500 font-semibold">Reporting Stock-Out Flag</div>
            </div>
          </div>
        </div>

        {/* 2 Column Main Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: District Heatmap & Referral Drop-off Funnel (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Heatmap & Geospatial Overview */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>District Geospatial Surveillance Heatmap</span>
                  </h3>
                  <p className="text-xs text-slate-500">{selectedDistrict} • 118 Connected Health Facilities</p>
                </div>

                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setHeatmapMode('caseload')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${heatmapMode === 'caseload' ? 'bg-[#003527] text-white' : 'text-slate-600'}`}
                  >
                    Case Load
                  </button>
                  <button
                    onClick={() => setHeatmapMode('waittime')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${heatmapMode === 'waittime' ? 'bg-[#003527] text-white' : 'text-slate-600'}`}
                  >
                    Wait Times
                  </button>
                  <button
                    onClick={() => setHeatmapMode('stockout')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${heatmapMode === 'stockout' ? 'bg-[#003527] text-white' : 'text-slate-600'}`}
                  >
                    Stock-Outs
                  </button>
                </div>
              </div>

              {/* Interactive Heatmap Map Simulation */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 aspect-video relative flex items-center justify-center overflow-hidden border border-slate-800">
                <div className="text-center space-y-2 relative z-10">
                  <div className="font-extrabold text-lg text-emerald-300">
                    {selectedDistrict} District Geospatial Mesh
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm">
                    {heatmapMode === 'caseload' && 'Highest outpatient density active in Junnar, Ambegaon, and Otur PHC belts.'}
                    {heatmapMode === 'waittime' && 'Average wait times well within 20-minute threshold across 94% sub-centres.'}
                    {heatmapMode === 'stockout' && '2 facilities flagged for low Oxytocin inventory: Otur PHC and Junnar sub-store.'}
                  </p>
                </div>

                {/* Simulated Radar Hotspots */}
                <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-emerald-500/30 rounded-full animate-ping pointer-events-none" />
                <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-amber-500/25 rounded-full animate-ping pointer-events-none" />
                <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-teal-500/30 rounded-full animate-ping pointer-events-none" />
              </div>
            </div>

            {/* Referral Drop-Off Funnel (MEMORY.md Rule 19) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>Referral Drop-Off Funnel Analytics (Monthly)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-slate-700 pb-1">
                    <span>1. Referrals Created by ASHA / Sub-Centre CHO</span>
                    <span>1,420 Cases (100%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-full rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 pb-1">
                    <span>2. Patient Reached Receiving Facility (PHC / RH)</span>
                    <span>1,364 Cases (96.1%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[96.1%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 pb-1">
                    <span>3. Specialist Consultation Completed</span>
                    <span>1,310 Cases (92.2%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full w-[92.2%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-700 pb-1">
                    <span>4. Counter-Referral Follow-up Completed by ASHA</span>
                    <span>1,298 Cases (91.4%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full w-[91.4%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Direct Instruction Dispatcher & Alerts (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Administrative Directive Dispatcher */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Send className="w-4 h-4 text-emerald-700" />
                <span>Issue Direct Administrative Instruction</span>
              </h3>

              <form onSubmit={handleSendDirective} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Directive Message to Facility Heads & Pharmacists</label>
                  <textarea
                    rows={4}
                    value={directiveText}
                    onChange={(e) => setDirectiveText(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Legally accountable instruction logged to official audit trail.</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Broadcast Priority Directive</span>
                </button>
              </form>
            </div>

            {/* Aggregate High-Risk Cohorts Radar */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Aggregate High-Risk Cohorts</span>
              </h4>
              <p className="text-xs text-slate-300">
                Privacy-preserving aggregate metrics (No individual patient identities exposed as per MEMORY.md Rule 23).
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="bg-slate-800 p-3 rounded-xl flex justify-between">
                  <span>High-Risk Maternal Pregnancies (HRP)</span>
                  <strong className="text-pink-300 font-bold">1,240 Cases</strong>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl flex justify-between">
                  <span>Hypertension & Diabetes (NCD) Cohort</span>
                  <strong className="text-amber-300 font-bold">8,420 Active</strong>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl flex justify-between">
                  <span>Suspected TB Sputum Samples Processing</span>
                  <strong className="text-blue-300 font-bold">142 Orders</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
