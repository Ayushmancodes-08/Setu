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
  FileText,
  Clock,
  ChevronRight,
  X,
  Plus,
  TrendingUp,
  TrendingDown,
  Layers,
  Map,
  ShieldCheck,
  AlertOctagon,
  Calendar,
  Filter,
  AlertCircle,
  Radio
} from 'lucide-react';
import { KpiCard, QuickAction, ActivityFeed, AlertBanner, SectionHeader, ProgressBar, ActivityItem } from '../common/DashboardWidgets';

export const DhoPortal: React.FC = () => {
  const { showToast, language, t } = useApp();
  const { 
    districtMetrics, 
    facilities, 
    directives, 
    issueDirective, 
    outbreakAlerts, 
    reportOutbreakAlert 
  } = useHealthData();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'overview' | 'map_intelligence' | 'alerts' | 'directives'>('dashboard');
  
  // Map filter states
  const [selectedBlock, setSelectedBlock] = useState<string>('All');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');

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

  // Aggregated Geographic Villages / Clusters for Map
  const villageClusters = [
    { name: 'Khamgaon Cluster', block: 'Junnar', phc: 'Otur PHC', population: 3840, risk: 'High', cases: 14, primaryIssue: 'Hypertension Spike & Dengue Fever' },
    { name: 'Ghatghar Tribal Spoke', block: 'Junnar', phc: 'Aptale PHC', population: 1920, risk: 'Moderate', cases: 6, primaryIssue: 'Maternal Anemia & Waterborne' },
    { name: 'Otur Town Sector', block: 'Junnar', phc: 'Otur PHC', population: 8400, risk: 'Low', cases: 2, primaryIssue: 'Routine Immunization Follow-ups' },
    { name: 'Toranmal Hill Hamlet', block: 'Shahada', phc: 'Dhadgaon PHC', population: 2100, risk: 'High', cases: 18, primaryIssue: 'Malaria Vector Cluster' },
    { name: 'Manchar Valley Spoke', block: 'Ambegaon', phc: 'Manchar PHC', population: 6500, risk: 'Low', cases: 3, primaryIssue: 'NCD Screening 94% Complete' },
    { name: 'Sitakhai Sector', block: 'Shahada', phc: 'Shahada RH', population: 1450, risk: 'Moderate', cases: 8, primaryIssue: 'Delayed 2nd Trimester ANC Visits' }
  ];

  const filteredClusters = villageClusters.filter(vc => {
    const matchBlock = selectedBlock === 'All' || vc.block === selectedBlock;
    const matchRisk = selectedRiskFilter === 'All' || vc.risk === selectedRiskFilter;
    return matchBlock && matchRisk;
  });

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
                <h1 className="text-xl font-black text-slate-900">{t.dhoPortalTitle}</h1>
                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-300">
                  {t.role_dho}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Surveillance Zone: <strong>Pune & Nandurbar Rural Sectors</strong> • Directorate of Health Services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportHmis}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.exportDistrictReport}</span>
            </button>
          </div>
        </div>

        {/* 1. DISTRICT OVERVIEW 4-KPI SUMMARY BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Registered Population</span>
            <div className="text-2xl font-black text-slate-900">1,24,820</div>
            <span className="text-[11px] text-emerald-700 font-bold">94.2% ABHA Linked</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Active CHOs / ASHAs</span>
            <div className="text-2xl font-black text-slate-900">426 Workers</div>
            <span className="text-[11px] text-emerald-700 font-bold">100% Field Coverage</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Follow-ups Due</span>
            <div className="text-2xl font-black text-amber-600">1,284 Cases</div>
            <span className="text-[11px] text-amber-700 font-medium">91% Completion Rate</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t.highRiskMaternalMonitored}</span>
            <div className="text-2xl font-black text-indigo-700">183 Cases</div>
            <span className="text-[11px] text-slate-500 font-medium">PHC ➔ Hospital Loop</span>
          </div>
        </div>

        {/* 2. HEALTH TRENDS STRIP */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900">{t.districtEpidemicOverview}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Hypertension Screening</span>
                <span className="font-black text-slate-900 text-base">↑ 8.4%</span>
              </div>
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Diabetes Prevalence</span>
                <span className="font-black text-slate-900 text-base">↑ 4.2%</span>
              </div>
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Full Immunization</span>
                <span className="font-black text-slate-900 text-base">98.1%</span>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Maternal Mortality Rate</span>
                <span className="font-black text-slate-900 text-base">↓ 14%</span>
              </div>
              <TrendingDown className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold w-full max-w-3xl overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-red-800 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📊 Command Center
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-red-800 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Taluka Analytics
          </button>
          <button
            onClick={() => setActiveTab('map_intelligence')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === 'map_intelligence' ? 'bg-red-800 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>GIS Map</span>
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'alerts' ? 'bg-red-800 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.activeSurveillanceAlerts} ({outbreakAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab('directives')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'directives' ? 'bg-red-800 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Directives ({directives.length})
          </button>
        </div>

        {/* TAB 0: DHO COMMAND CENTER DASHBOARD */}
        {activeTab === 'dashboard' && (() => {
          const redAlerts = outbreakAlerts.filter(a => a.severity === 'RED_ALERT');

          const dhoActivity: ActivityItem[] = [
            { id: 'd-1', icon: '🚨', title: 'Outbreak Alert: Dengue Vector Cluster', sub: 'Toranmal Hill Sector · 18 confirmed cases', time: '10m ago', badge: 'RED ALERT', badgeColor: 'red' },
            { id: 'd-2', icon: '📢', title: 'Health Directive Broadcasted', sub: 'DIR-MH-9921 · Pre-monsoon screening to 24 PHCs', time: '1h ago', badge: 'Broadcast', badgeColor: 'blue' },
            { id: 'd-3', icon: '🏥', title: 'Junnar RH Bed Census Reported', sub: '14 General / 3 ICU Beds Free · O2 at 99.4%', time: '2h ago', badge: 'Normal', badgeColor: 'emerald' },
            { id: 'd-4', icon: '📈', title: 'District NCD Screening Milestone', sub: '88,400 citizens screened across 4 Talukas', time: '4h ago', badge: 'Target Met', badgeColor: 'purple' },
            { id: 'd-5', icon: '📦', title: 'District Drug Indent Dispatched', sub: 'Central Medical Store released 50k IFA Tabs', time: '6h ago', badge: 'Supplied', badgeColor: 'emerald' }
          ];

          return (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard
                  label="District Population Tracked"
                  value={482}
                  suffix="k Citizens"
                  icon={Users}
                  iconColor="text-red-700"
                  iconBg="bg-red-100"
                  trend="up"
                  trendLabel="Pune Rural"
                  onClick={() => setActiveTab('overview')}
                />
                <KpiCard
                  label="Active Disease Alerts"
                  value={outbreakAlerts.length}
                  icon={ShieldAlert}
                  iconColor="text-amber-600"
                  iconBg="bg-amber-100"
                  trend={outbreakAlerts.length > 0 ? 'up' : 'down'}
                  trendLabel={outbreakAlerts.length > 0 ? 'Surveillance Active' : 'Clear'}
                  urgency={redAlerts.length > 0 ? 'critical' : 'normal'}
                  onClick={() => setActiveTab('alerts')}
                />
                <KpiCard
                  label="Essential Drug Stock Rate"
                  value={94}
                  suffix="%"
                  icon={ShieldCheck}
                  iconColor="text-emerald-600"
                  iconBg="bg-emerald-100"
                  trend="flat"
                  trendLabel="24 PHCs"
                />
                <KpiCard
                  label="Directives Active"
                  value={directives.length}
                  icon={Radio}
                  iconColor="text-blue-600"
                  iconBg="bg-blue-100"
                  trend="up"
                  trendLabel="State Integrated"
                  onClick={() => setActiveTab('directives')}
                />
              </div>

              {/* Epidemic Surveillance Alerts */}
              <div className="space-y-2">
                {redAlerts.length > 0 && (
                  <AlertBanner
                    type="critical"
                    title="🔴 Active Epidemic Cluster Flagged by IDSP"
                    message="Toranmal / Khamgaon tribal spoke: Rapid spike in vector-borne dengue & acute gastroenteritis. Mobile testing van deployed."
                    action={{ label: 'View Alert & Deploy', onClick: () => setActiveTab('alerts') }}
                  />
                )}
                <AlertBanner
                  type="info"
                  title="State Health Mission Real-Time Telemetry Live"
                  message="All 24 PHCs, 148 Sub-Centres, and 2 Sub-District Hospitals transmitting live census every 60 seconds."
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <SectionHeader title="District Health Command Actions" sub="High-level public health authority workflows" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <QuickAction
                    icon={Send}
                    label="Broadcast Directive"
                    sub="Official circular to all PHCs"
                    color="bg-red-800 text-white"
                    onClick={() => setActiveTab('directives')}
                  />
                  <QuickAction
                    icon={AlertOctagon}
                    label="Declare Outbreak"
                    sub="Trigger rapid response"
                    color="bg-amber-600 text-white"
                    onClick={() => setIsOutbreakModalOpen(true)}
                  />
                  <QuickAction
                    icon={Map}
                    label="GIS Heatmap"
                    sub="Disease cluster map"
                    color="bg-blue-700 text-white"
                    onClick={() => setActiveTab('map_intelligence')}
                  />
                  <QuickAction
                    icon={Download}
                    label="HMIS State Export"
                    sub="Official summary report"
                    color="bg-slate-800 text-white"
                    onClick={() => showToast('District Health Annual & Monthly Summary exported to State HMIS portal format (PDF/XLS).')}
                  />
                </div>
              </div>

              {/* Feed and District Health Goals */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                  <SectionHeader
                    title="District Health Intelligence Feed"
                    sub="Live epidemiological tracking & field incident log"
                    action={<button onClick={() => setActiveTab('alerts')} className="text-xs text-red-800 font-bold hover:underline">View All Alerts</button>}
                  />
                  <ActivityFeed items={dhoActivity} maxItems={5} />
                </div>

                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <SectionHeader title="National Health Mission (NHM) Goals" sub="Pune Rural District Targets" />
                  <ProgressBar value={92} max={100} color="bg-emerald-500" label="Institutional Deliveries (92%)" />
                  <ProgressBar value={88} max={100} color="bg-teal-500" label="Universal NCD Screening (88%)" />
                  <ProgressBar value={96} max={100} color="bg-blue-500" label="Childhood Full Immunization (96%)" />
                  <ProgressBar value={100} max={100} color="bg-purple-500" label="e-Sanjeevani Teleconsult Target (100%)" />

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">District Health Index Rank</span>
                    <span className="font-black text-emerald-800">Rank #2 in Maharashtra</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 1: DISTRICT OVERVIEW & TALUKA PERFORMANCE */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {districtMetrics.map((dm, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{dm.districtName}</h3>
                    <p className="text-xs text-slate-500">{dm.totalFacilities} Health Centres & Spokes Connected</p>
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

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span>Stockout Centers: <strong>{dm.facilitiesWithStockout}</strong></span>
                  <span className="text-emerald-700 font-bold">HMIS Live</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: GEOGRAPHIC HEALTH MAP & VILLAGE CLUSTERS */}
        {activeTab === 'map_intelligence' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider">Geographic Visual Intelligence</span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">District Health & Epidemic Map</h3>
                <p className="text-xs text-slate-500">Block and village-level risk clustering and surveillance heatmap.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={selectedBlock}
                  onChange={(e) => setSelectedBlock(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                >
                  <option value="All">All Blocks (Talukas)</option>
                  <option value="Junnar">Junnar Block</option>
                  <option value="Ambegaon">Ambegaon Block</option>
                  <option value="Shahada">Shahada (Nandurbar)</option>
                </select>

                <select
                  value={selectedRiskFilter}
                  onChange={(e) => setSelectedRiskFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                >
                  <option value="All">All Risk Levels</option>
                  <option value="High">🔴 High Risk</option>
                  <option value="Moderate">🟡 Moderate</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>
            </div>

            {/* Simulated Map Visualizer */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span className="font-bold">Maharashtra Rural Health Sector Map • Grid View</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-bold">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Low Risk</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Moderate</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> High Alert Cluster</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {filteredClusters.map((cluster, idx) => (
                  <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{cluster.name}</h4>
                        <p className="text-[11px] text-slate-400">Block: {cluster.block} • {cluster.phc}</p>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        cluster.risk === 'High' ? 'bg-red-950 text-red-300 border border-red-600 animate-pulse' :
                        cluster.risk === 'Moderate' ? 'bg-amber-950 text-amber-300 border border-amber-600' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-600'
                      }`}>
                        {cluster.risk}
                      </span>
                    </div>

                    <div className="text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 space-y-1">
                      <div className="text-slate-300">Population: <strong>{cluster.population.toLocaleString()}</strong></div>
                      <div className="text-slate-300">Surveillance Flag: <strong className="text-red-400">{cluster.primaryIssue}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: AGGREGATED PUBLIC HEALTH ALERTS */}
        {activeTab === 'alerts' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">IDSP Epidemic Alerts & Cluster Detection</h3>
                <p className="text-xs text-slate-500">Automated clustering flags from Sub-Centre field assessments and PHC reports.</p>
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
              {/* Sample High-Level District Alert */}
              <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h4 className="font-extrabold text-sm text-red-950">Dengue & Acute Fever Cluster Surge</h4>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-red-200 text-red-900 px-2 py-0.5 rounded">
                    RED ALERT
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  Block Junnar (Khamgaon & Otur Sector): +32% increase in fever cases with platelet drop risk over the last 7 days.
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-red-100 text-xs text-slate-800 font-medium flex items-center justify-between">
                  <span>Field Action: <strong>Mandated 100% Rapid Card Tests & ASHA door-to-door check</strong></span>
                  <span className="text-emerald-700 font-bold">Investigation Live</span>
                </div>
              </div>

              {/* Sample Follow-Up Gap Alert */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <h4 className="font-extrabold text-sm text-amber-950">NCD Follow-Up Gap Warning</h4>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                    AMBER WATCH
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  47 registered hypertensive patients in Ambegaon block have missed scheduled monthly BP check-ins.
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-amber-100 text-xs text-slate-800 font-medium flex items-center justify-between">
                  <span>Action: <strong>Notified ASHA supervisors to assign home visits</strong></span>
                  <span className="text-amber-700 font-bold">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DIRECTIVES BROADCAST */}
        {activeTab === 'directives' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Broadcast Administrative Health Directive</h3>
                <p className="text-xs text-slate-500">Transmits priority official notifications directly to Medical Officers & ASHA tablets.</p>
              </div>

              <form onSubmit={handleSendDirective} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Directive Subject</label>
                  <input
                    type="text"
                    value={directiveTitle}
                    onChange={(e) => setDirectiveTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Target Taluka</label>
                    <select
                      value={directiveTaluka}
                      onChange={(e) => setDirectiveTaluka(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="Junnar Taluka">Junnar Taluka</option>
                      <option value="Ambegaon Taluka">Ambegaon Taluka</option>
                      <option value="Nandurbar District (All)">Nandurbar District (All)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Priority</label>
                    <select
                      value={directivePriority}
                      onChange={(e) => setDirectivePriority(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="URGENT">URGENT</option>
                      <option value="HIGH">HIGH</option>
                      <option value="ROUTINE">ROUTINE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mandate & Protocol</label>
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
                  <span>Transmit Official Circular</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900">Active Directives in Circulation ({directives.length})</h3>
              {directives.map((d) => (
                <div key={d.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded">{d.code}</span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{d.priority}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{d.title}</h4>
                  <p className="text-slate-600 line-clamp-2">{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Outbreak Log Modal */}
      {isOutbreakModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Log District Outbreak Alert</h3>
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
                  <label className="font-bold text-slate-800 block mb-1">Cases</label>
                  <input
                    type="number"
                    value={outCases}
                    onChange={(e) => setOutCases(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md mt-2"
              >
                Broadcast Alert to Directorate
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
