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
  X,
  Plus
} from 'lucide-react';

export const DhoPortal: React.FC = () => {
  const { showToast, language } = useApp();
  const { 
    districtMetrics, 
    facilities, 
    medicines, 
    directives, 
    issueDirective, 
    outbreakAlerts, 
    reportOutbreakAlert 
  } = useHealthData();

  const [activeTab, setActiveTab] = useState<'surveillance' | 'outbreak_alerts' | 'directives' | 'mmu_fleet'>('surveillance');
  
  // Directive Form State
  const [directiveTitle, setDirectiveTitle] = useState<string>('Pre-monsoon Vector-Borne & Malaria Surveillance Protocol');
  const [directiveTaluka, setDirectiveTaluka] = useState<string>('Junnar Taluka');
  const [directivePriority, setDirectivePriority] = useState<'URGENT' | 'HIGH' | 'ROUTINE'>('URGENT');
  const [directiveBody, setDirectiveBody] = useState<string>('All Primary Health Centres and Ayushman Arogya Mandir Sub-Centres must conduct fever mass screening, maintain RDT Malaria test kits, and log daily positive slide index to State HMIS portal.');

  // Outbreak Form State
  const [isOutbreakModalOpen, setIsOutbreakModalOpen] = useState<boolean>(false);
  const [outDisease, setOutDisease] = useState<string>('Acute Water-Borne Gastroenteritis Spike');
  const [outTaluka, setOutTaluka] = useState<string>('Junnar (Khamgaon Belt)');
  const [outVillage, setOutVillage] = useState<string>('Wadi 2 & Main Gaothan');
  const [outCases, setOutCases] = useState<number>(12);
  const [outSeverity, setOutSeverity] = useState<'RED_ALERT' | 'AMBER_WATCH' | 'MONITORING'>('AMBER_WATCH');

  // MMU Dispatch State
  const [mmuTarget, setMmuTarget] = useState<string>('Toranmal Tribal Hamlet (Shahada Sector)');
  const [mmuDoctor, setMmuDoctor] = useState<string>('Dr. Chetan Padvi & Mobile Team 3');

  const handleSendDirective = async (e: React.FormEvent) => {
    e.preventDefault();
    await issueDirective({
      code: `DIR-MH-${Math.floor(1000 + Math.random() * 9000)}`,
      title: directiveTitle,
      titleMr: directiveTitle,
      issuer: 'Dr. Ramchandra Hankare, DHO Pune',
      issuerDesignation: 'District Health Officer, Directorate of Health Services',
      targetTaluka: directiveTaluka,
      priority: directivePriority,
      body: directiveBody,
      actionItems: ['Conduct 100% Rapid Card Tests for fever cases', 'Daily reporting of platelet count < 50,000 cases to District Epidemic Cell', 'Ensure zero stock-out of IV Fluids & Paracetamol']
    });
    showToast(`Official DHO Health Directive broadcasted to all PHCs & CHOs in ${directiveTaluka}.`);
    setActiveTab('directives');
  };

  const handleReportOutbreak = async (e: React.FormEvent) => {
    e.preventDefault();
    await reportOutbreakAlert({
      disease: outDisease,
      taluka: outTaluka,
      villageCluster: outVillage,
      reportedCases: Number(outCases),
      severity: outSeverity,
      status: 'INVESTIGATION_ONGOING',
      leadEpidemiologist: 'Dr. Sandeep Ghule (MO Otur PHC)'
    });
    showToast(`Outbreak Alert broadcasted: ${outDisease} in ${outTaluka}`);
    setIsOutbreakModalOpen(false);
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
            <span className="text-[11px] text-slate-500 font-medium">e-Aushadhi Monitored</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Outbreak Warnings</span>
            <div className="text-2xl font-black text-amber-600">{outbreakAlerts.length} Warnings</div>
            <span className="text-[11px] text-amber-600 font-medium">IDSP Field Containment Live</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold w-full max-w-2xl">
          <button
            onClick={() => setActiveTab('surveillance')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'surveillance' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Taluka Surveillance Map
          </button>
          <button
            onClick={() => setActiveTab('outbreak_alerts')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'outbreak_alerts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Outbreak Warnings ({outbreakAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab('directives')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'directives' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Issue Directives ({directives.length})
          </button>
          <button
            onClick={() => setActiveTab('mmu_fleet')}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              activeTab === 'mmu_fleet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mobile Medical Units (MMU)
          </button>
        </div>

        {/* TAB 1: TALUKA SURVEILLANCE */}
        {activeTab === 'surveillance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {districtMetrics.map((dm, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{dm.districtName}</h3>
                    <p className="text-xs text-slate-500">{dm.totalFacilities} Health Centers & Spokes</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    dm.riskStatus === 'Alert' ? 'bg-red-100 text-red-800 border-red-300' :
                    dm.riskStatus === 'Moderate' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {dm.riskStatus} Status
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Active Registered Citizens</span>
                    <span className="font-bold text-slate-800">{dm.activePatients.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Avg Teleconsult Wait</span>
                    <span className="font-bold text-slate-800">{dm.avgWaitTimeMinutes} mins</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Referral Completion</span>
                    <span className="font-bold text-emerald-700">{dm.referralCompletionRate}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">High-Risk ANC Monitored</span>
                    <span className="font-bold text-red-600">{dm.highRiskMaternalMonitored}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Stockout Centers: <strong>{dm.facilitiesWithStockout}</strong></span>
                  <span className="text-emerald-700 font-bold">HMIS Live</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: OUTBREAK WARNINGS */}
        {activeTab === 'outbreak_alerts' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">IDSP Epidemic Early Warning & Disease Clustering</h3>
                <p className="text-xs text-slate-500">Automated clustering flags from Sub-Centre POC tests and PHC OPD registers.</p>
              </div>
              <button
                onClick={() => setIsOutbreakModalOpen(true)}
                className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Outbreak Alert</span>
              </button>
            </div>

            <div className="space-y-3">
              {outbreakAlerts.map((alert) => (
                <div key={alert.id} className="bg-red-50/60 border border-red-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <h4 className="font-extrabold text-sm text-red-950">{alert.disease}</h4>
                    </div>
                    <span className="text-[10px] font-black uppercase bg-red-200 text-red-900 px-2 py-0.5 rounded">
                      {alert.severity}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700">
                    Location: <strong>{alert.taluka} ({alert.villageCluster})</strong> • Cases: <strong className="text-red-700">{alert.reportedCases} confirmed</strong> • Lead: {alert.leadEpidemiologist}
                  </div>
                  <div className="text-xs text-slate-800 bg-white p-2.5 rounded-xl border border-red-100 font-medium flex items-center justify-between">
                    <span>Status: <strong className="text-emerald-700">{alert.status}</strong></span>
                    <span className="text-[10px] text-slate-400 font-mono">Reported: {alert.firstReportedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DIRECTIVES */}
        {activeTab === 'directives' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
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
                      onChange={(e) => setDirectivePriority(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="URGENT">URGENT (Immediate Execution)</option>
                      <option value="HIGH">HIGH (Within 24 Hours)</option>
                      <option value="ROUTINE">ROUTINE Notice</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-bold text-xs block mb-1">Mandate & Action Protocol</label>
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
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Official Circular to PHCs & CHOs</span>
                </button>
              </form>
            </div>

            {/* Active Directives List */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">Active Directives in Circulation ({directives.length})</h3>
              {directives.map((d) => (
                <div key={d.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded">{d.code}</span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{d.priority}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{d.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{d.body}</p>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>Target: <strong>{d.targetTaluka}</strong></span>
                    <span>{d.acknowledgementsCount} Acknowledged</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: MMU FLEET */}
        {activeTab === 'mmu_fleet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">MMU-01 (Toranmal Tribal Express)</h4>
                    <p className="text-xs text-slate-500">Vehicle: MH-39-AA-4012 • Shahada Block</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  On Active Route
                </span>
              </div>
              <div className="text-xs text-slate-600">
                Staff: <strong>Dr. Chetan Padvi (BAMS) + ANM Sharda + Lab Tech</strong>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                <span className="text-slate-400 block text-[10px]">Today's Route Schedule:</span>
                <div className="font-medium text-slate-800">Toranmal ➔ Sitakhai ➔ Chadavli ➔ Lekha Camp</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">MMU-02 (Junnar Sahyadri Ghats)</h4>
                    <p className="text-xs text-slate-500">Vehicle: MH-14-GH-8812 • Junnar West</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  On Active Route
                </span>
              </div>
              <div className="text-xs text-slate-600">
                Staff: <strong>Dr. Smita Borse + ANM Rohini + Pharmacist</strong>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                <span className="text-slate-400 block text-[10px]">Today's Route Schedule:</span>
                <div className="font-medium text-slate-800">Khamgaon Wadi ➔ Ghatghar ➔ Naneghat Spoke</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Outbreak Modal */}
      {isOutbreakModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Log New Outbreak Alert</h3>
              <button onClick={() => setIsOutbreakModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReportOutbreak} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Disease / Syndrome Name</label>
                <input
                  type="text"
                  value={outDisease}
                  onChange={(e) => setOutDisease(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Taluka</label>
                  <input
                    type="text"
                    value={outTaluka}
                    onChange={(e) => setOutTaluka(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Village Cluster</label>
                  <input
                    type="text"
                    value={outVillage}
                    onChange={(e) => setOutVillage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Confirmed Cases</label>
                  <input
                    type="number"
                    value={outCases}
                    onChange={(e) => setOutCases(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Severity Level</label>
                  <select
                    value={outSeverity}
                    onChange={(e) => setOutSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                  >
                    <option value="RED_ALERT">RED ALERT</option>
                    <option value="AMBER_WATCH">AMBER WATCH</option>
                    <option value="MONITORING">MONITORING</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md mt-2"
              >
                Broadcast Outbreak Warning
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
