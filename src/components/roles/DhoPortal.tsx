import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { 
  ShieldAlert, 
  Activity, 
  Send, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Truck, 
  FileText,
  Clock,
  ChevronRight,
  X
} from 'lucide-react';

export const DhoPortal: React.FC = () => {
  const { showToast, language } = useApp();
  const { districtMetrics, facilities, medicines } = useHealthData();

  const [activeTab, setActiveTab] = useState<'surveillance' | 'outbreak_alerts' | 'directives' | 'mmu_fleet'>('surveillance');
  
  // Directive Form State
  const [directiveTitle, setDirectiveTitle] = useState<string>('Pre-monsoon Vector-Borne & Malaria Surveillance Protocol');
  const [directiveTaluka, setDirectiveTaluka] = useState<string>('Junnar Taluka');
  const [directivePriority, setDirectivePriority] = useState<string>('High Priority');
  const [directiveBody, setDirectiveBody] = useState<string>('All Primary Health Centres and Ayushman Arogya Mandir Sub-Centres must conduct fever mass screening, maintain RDT Malaria test kits, and log daily positive slide index to State HMIS portal.');

  // MMU Dispatch State
  const [mmuTarget, setMmuTarget] = useState<string>('Toranmal Tribal Hamlet (Shahada Sector)');
  const [mmuDoctor, setMmuDoctor] = useState<string>('Dr. Chetan Padvi & Mobile Team 3');

  const handleSendDirective = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Official DHO Health Directive broadcasted to all PHCs & CHOs in ${directiveTaluka}.`);
  };

  const handleDispatchMmu = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Mobile Medical Unit (MMU-04) dispatched to ${mmuTarget} with Doctor & Diagnostic kit.`);
  };

  const handleExportHmis = () => {
    showToast('Exported Maharashtra HMIS Directorate Monthly Summary (August 2026).');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* DHO Command Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-700 text-white flex items-center justify-center text-xl font-bold shadow-md">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">District Health Office (DHO) Command Console</h1>
                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-300">
                  Directorate of Health Services, Maharashtra
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Surveillance Zone: <strong>Pune & Nandurbar Rural Sectors</strong> • Active Sub-Centres: <strong>1,840</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportHmis}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export HMIS Monthly Report</span>
            </button>
          </div>
        </div>

        {/* District Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Active Teleconsults</span>
            <div className="text-2xl font-black text-slate-900">1,482 Cases</div>
            <span className="text-[11px] text-emerald-600 font-bold">98.4% Specialist Turnaround</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">High-Risk Maternal (ANC)</span>
            <div className="text-2xl font-black text-red-600">842 Monitored</div>
            <span className="text-[11px] text-red-600 font-medium">100% Tracking Under JSSK</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Facilities with Zero Stockouts</span>
            <div className="text-2xl font-black text-emerald-700">92.8%</div>
            <span className="text-[11px] text-slate-500">e-Aushadhi Automated Replenish</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">108 Emergency Response Avg</span>
            <div className="text-2xl font-black text-blue-700">14.2 Mins</div>
            <span className="text-[11px] text-blue-600 font-medium">GPS Auto-Routing</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
          {[
            { id: 'surveillance', label: 'Taluka Public Health Surveillance', icon: Activity },
            { id: 'outbreak_alerts', label: 'Epidemic & Outbreak Alerts', icon: AlertTriangle, count: 2 },
            { id: 'directives', label: 'Issue Administrative Directives', icon: Send },
            { id: 'mmu_fleet', label: 'Mobile Medical Units (MMU)', icon: Truck, count: 4 }
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

        {/* TAB 1: TALUKA SURVEILLANCE */}
        {activeTab === 'surveillance' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Taluka-Level Health Telemetry & Risk Index</h3>
                <p className="text-xs text-slate-500">Real-time consolidated data from Ayushman Arogya Mandirs, PHCs, and Rural Hospitals.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-3">Taluka / Sector</th>
                    <th className="p-3">Active Patients</th>
                    <th className="p-3">Teleconsults Today</th>
                    <th className="p-3">High-Risk ANC</th>
                    <th className="p-3">Stockout PHCs</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {districtMetrics.map((met, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900">{met.districtName}</div>
                        <div className="text-[10px] text-slate-400">{met.totalFacilities} Health Centers</div>
                      </td>
                      <td className="p-3 font-bold text-slate-800">{met.activePatients.toLocaleString()}</td>
                      <td className="p-3 font-bold text-blue-700">{met.teleconsultationsToday}</td>
                      <td className="p-3 font-bold text-red-600">{met.highRiskMaternalMonitored}</td>
                      <td className="p-3 font-mono">{met.facilitiesWithStockout}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          met.riskStatus === 'Critical' ? 'bg-red-100 text-red-800 animate-pulse' : met.riskStatus === 'Alert' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {met.riskStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: OUTBREAK ALERTS */}
        {activeTab === 'outbreak_alerts' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Epidemic Early Warning System (IDSP)</h3>
              <p className="text-xs text-slate-500">Automated clustering flags based on daily fever, diarrhea, and jaundice syndromes.</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'out-1',
                  type: 'Suspected Dengue / Malaria Spike',
                  taluka: 'Junnar (Khamgaon & Dingore belt)',
                  cases: '14 Confirmed Rapid +ve in 48h',
                  urgency: 'High Alert',
                  action: 'Vector control fogging, Abate larvicide application in water storage, and mobile fever clinic ordered.'
                },
                {
                  id: 'out-2',
                  type: 'Severe Gestational Anemia Cluster',
                  taluka: 'Shahada & Toranmal (Nandurbar Tribal)',
                  cases: '8 Mothers with Hb < 8.0 g/dL',
                  urgency: 'Critical',
                  action: 'Specialist OBGYN team scheduled with IV Ferric Carboxymaltose camp at Toranmal PHC.'
                }
              ].map((alert) => (
                <div key={alert.id} className="bg-red-50/60 border border-red-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <h4 className="font-extrabold text-sm text-red-950">{alert.type}</h4>
                    </div>
                    <span className="text-[10px] font-black uppercase bg-red-200 text-red-900 px-2 py-0.5 rounded">
                      {alert.urgency}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700">
                    Location: <strong>{alert.taluka}</strong> • Volume: <strong className="text-red-700">{alert.cases}</strong>
                  </div>
                  <div className="text-xs text-slate-800 bg-white p-2.5 rounded-xl border border-red-100 font-medium">
                    <strong>Mandated Action:</strong> {alert.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DIRECTIVES FORM */}
        {activeTab === 'directives' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Broadcast Administrative Health Directive</h3>
              <p className="text-xs text-slate-500">Transmits priority official notifications directly to Medical Officers & ASHA tablets.</p>
            </div>

            <form onSubmit={handleSendDirective} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Directive Subject</label>
                <input
                  type="text"
                  value={directiveTitle}
                  onChange={(e) => setDirectiveTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Target Sector / Taluka</label>
                  <select
                    value={directiveTaluka}
                    onChange={(e) => setDirectiveTaluka(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="Junnar Taluka">Junnar Taluka</option>
                    <option value="Ambegaon Taluka">Ambegaon Taluka</option>
                    <option value="Nandurbar District (All)">Nandurbar District (All)</option>
                    <option value="Statewide Rural (All PHCs)">Statewide Rural (All PHCs)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Priority Level</label>
                  <select
                    value={directivePriority}
                    onChange={(e) => setDirectivePriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="High Priority">High Priority (Immediate Action)</option>
                    <option value="Standard Advisory">Standard Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Directive Guidelines & Protocol Text</label>
                <textarea
                  rows={4}
                  value={directiveBody}
                  onChange={(e) => setDirectiveBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Official Directive to All Stakeholders</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: MOBILE MEDICAL UNITS */}
        {activeTab === 'mmu_fleet' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Mobile Medical Units (MMU) & Tribal Health Vans</h3>
                <p className="text-xs text-slate-500">Equipped with portable ultrasound, digital ECG, point-of-care lab, and doctors for remote hamlets.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'mmu-1', name: 'MMU Unit 01 (Junnar Ghats)', team: 'Dr. Kavita Thorat + ANM + Lab Tech', location: 'Dingore / Ghatghar Foothills', status: 'In Field / Camp Active' },
                { id: 'mmu-2', name: 'MMU Unit 02 (Toranmal Tribal)', team: 'Dr. Chetan Padvi + Pharmacist', location: 'Toranmal Village Cluster', status: 'In Field / Camp Active' }
              ].map((mmu) => (
                <div key={mmu.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-sm text-slate-900">{mmu.name}</div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {mmu.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Team: {mmu.team}</div>
                  <div className="text-[11px] text-slate-500">📍 Active Hamlet: {mmu.location}</div>
                  <button
                    onClick={() => showToast(`Radio telemetry connected to ${mmu.name}`)}
                    className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-1.5 rounded-lg text-xs border border-slate-200 mt-2"
                  >
                    View Camp Census & Telemetry
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
