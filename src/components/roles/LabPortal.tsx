import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Search, 
  FileText, 
  Send, 
  ShieldCheck, 
  Microscope,
  X,
  Download,
  Flame,
  Check
} from 'lucide-react';
import { KpiCard, QuickAction, ActivityFeed, AlertBanner, SectionHeader, ProgressBar, ActivityItem } from '../common/DashboardWidgets';

export const LabPortal: React.FC = () => {
  const { showToast, language, t } = useApp();
  const { diagnosticOrders, submitLabResult } = useHealthData();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders'>('dashboard');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Result Entry Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [resultVal, setResultVal] = useState<string>('8.2 g/dL (Severe Anemia)');
  const [refRange, setRefRange] = useState<string>('11.5 - 15.5 g/dL');
  const [isPanic, setIsPanic] = useState<boolean>(true);
  const [technicianNotes, setTechnicianNotes] = useState<string>('Microscopic smear shows microcytic hypochromic RBCs. Automated counter calibrated.');

  const filteredOrders = diagnosticOrders.filter(o => {
    const matchesCat = activeCategory === 'All' || o.testCategory === activeCategory;
    const matchesSearch = !searchQuery || o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || o.testName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenResultModal = (order: any) => {
    setSelectedOrder(order);
    if (order.testName.includes('Malaria')) {
      setResultVal('Positive for Plasmodium vivax (Pv)');
      setRefRange('Negative');
      setIsPanic(true);
    } else if (order.testName.includes('Sugar') || order.testName.includes('Glucose')) {
      setResultVal('168 mg/dL (Elevated)');
      setRefRange('70 - 100 mg/dL (Fasting)');
      setIsPanic(false);
    } else {
      setResultVal('8.2 g/dL (Low Hb)');
      setRefRange('11.5 - 15.5 g/dL');
      setIsPanic(true);
    }
  };

  const handleSubmitResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    submitLabResult(selectedOrder.id, resultVal, isPanic, technicianNotes);
    setSelectedOrder(null);
    showToast(`Validated report for ${selectedOrder.patientName} (${selectedOrder.testName}). Synced to ABHA EHR.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Lab Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-700 text-white flex items-center justify-center text-xl font-bold shadow-md">
              <Microscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">Diagnostic Laboratory Information System (LIS)</h1>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-300">
                  {t.role_lab}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Junnar Rural Hospital Central Pathology & Microbiology Wing • Lead: <strong>Anand Shinde (Senior Tech)</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Automated Hematology Analyzer Online</span>
            </span>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Sample Requisitions</span>
            <div className="text-2xl font-black text-purple-700">
              {diagnosticOrders.filter(o => o.sampleStatus !== 'Validated').length} Tests
            </div>
            <span className="text-[11px] text-slate-500">From Doctor & CHO Hubs</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Validated Reports Today</span>
            <div className="text-2xl font-black text-emerald-700">
              {diagnosticOrders.filter(o => o.sampleStatus === 'Validated').length} Reports
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">100% Signed</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Critical Panic Alerts</span>
            <div className="text-2xl font-black text-red-600">
              {diagnosticOrders.filter(o => o.isPanicValue).length} Alerts
            </div>
            <span className="text-[11px] text-red-600 font-medium">Doctor Auto-Notified</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Reagent Quality Control</span>
            <div className="text-2xl font-black text-slate-900">Passed</div>
            <span className="text-[11px] text-slate-500">Daily Calibration 07:30 AM</span>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'orders', label: `🧪 Sample Queue & LIS Logs (${diagnosticOrders.length})` }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 0: LIS COMMAND CENTER DASHBOARD */}
        {activeTab === 'dashboard' && (() => {
          const pendingTests = diagnosticOrders.filter(o => o.sampleStatus !== 'Validated');
          const panicTests = diagnosticOrders.filter(o => o.isPanicValue);
          const validatedToday = diagnosticOrders.filter(o => o.sampleStatus === 'Validated');

          const labActivity: ActivityItem[] = [
            { id: 'l-1', icon: '🩸', title: 'Complete Blood Count Validated', sub: 'Sunita Shinde · Hb 8.2 g/dL (Severe Anemia)', time: '8m ago', badge: 'Critical Panic', badgeColor: 'red' },
            { id: 'l-2', icon: '🦟', title: 'Malaria RDT Tested Negative', sub: 'Rajesh Kumar · Pv/Pf antigen absent', time: '25m ago', badge: 'Validated', badgeColor: 'emerald' },
            { id: 'l-3', icon: '🧪', title: 'Lipid Profile Specimen Received', sub: 'Mohan Kale · Fasting Serum tube', time: '1h ago', badge: 'Processing', badgeColor: 'blue' },
            { id: 'l-4', icon: '⚙️', title: 'Analyzer Quality Calibration Passed', sub: 'Sysmex XN-350 Automated 5-Part Counter', time: '3h ago', badge: 'QC Passed', badgeColor: 'purple' },
            { id: 'l-5', icon: '📋', title: 'Urine Routine Specimen Collected', sub: 'Meena Gaikwad · PHC Otur Sample', time: '4h ago', badge: 'Collected', badgeColor: 'blue' }
          ];

          return (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard
                  label="Requisitions Queue"
                  value={pendingTests.length}
                  icon={Clock}
                  iconColor="text-purple-600"
                  iconBg="bg-purple-100"
                  trend="up"
                  trendLabel="Active intake"
                  urgency={pendingTests.length > 0 ? 'warning' : 'normal'}
                  onClick={() => setActiveTab('orders')}
                />
                <KpiCard
                  label="Validated Today"
                  value={validatedToday.length + 14}
                  icon={CheckCircle2}
                  iconColor="text-emerald-600"
                  iconBg="bg-emerald-100"
                  trend="up"
                  trendLabel="+12 vs yday"
                  onClick={() => setActiveTab('orders')}
                />
                <KpiCard
                  label="Panic Critical Values"
                  value={panicTests.length}
                  icon={AlertTriangle}
                  iconColor="text-red-600"
                  iconBg="bg-red-100"
                  trend={panicTests.length > 0 ? 'up' : 'down'}
                  trendLabel={panicTests.length > 0 ? 'Doctor Alerted' : 'Zero'}
                  urgency={panicTests.length > 0 ? 'critical' : 'normal'}
                  onClick={() => setActiveTab('orders')}
                />
                <KpiCard
                  label="QC Analyzer Pass Rate"
                  value={100}
                  suffix="%"
                  icon={ShieldCheck}
                  iconColor="text-blue-600"
                  iconBg="bg-blue-100"
                  trend="flat"
                  trendLabel="Calibrated"
                />
              </div>

              {/* Panic Alert Banner */}
              <div className="space-y-2">
                {panicTests.length > 0 && (
                  <AlertBanner
                    type="critical"
                    title="🔴 Critical Panic Value Flagged"
                    message="Sunita Shinde — Hemoglobin 8.2 g/dL (Severe Microcytic Anemia). Attending Medical Officer auto-notified."
                    action={{ label: 'View Result', onClick: () => setActiveTab('orders') }}
                  />
                )}
                <AlertBanner
                  type="info"
                  title="ABHA LIS Real-Time Sync Active"
                  message="All digitally signed lab reports automatically encrypted and dispatched to patient digital health locker."
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <SectionHeader title="Laboratory Quick Actions" sub="Direct diagnostic bench workflows" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <QuickAction
                    icon={Microscope}
                    label="Process Queue"
                    sub="Verify and Enter Results"
                    color="bg-purple-700 text-white"
                    onClick={() => setActiveTab('orders')}
                    pulse={pendingTests.length > 0}
                  />
                  <QuickAction
                    icon={Flame}
                    label="Emergency Panic Entry"
                    sub="Instant critical alert"
                    color="bg-red-600 text-white"
                    onClick={() => {
                      if (diagnosticOrders[0]) handleOpenResultModal(diagnosticOrders[0]);
                    }}
                  />
                  <QuickAction
                    icon={ShieldCheck}
                    label="Run Analyzer QC"
                    sub="Calibration verification"
                    color="bg-teal-700 text-white"
                    onClick={() => showToast('Analyzer Quality Control (QC) run verified. All controls within 2 SD limits.')}
                  />
                  <QuickAction
                    icon={Download}
                    label="Export Daily LIS"
                    sub="HMIS Format Report"
                    color="bg-slate-800 text-white"
                    onClick={() => showToast('Daily LIS Summary Report exported as PDF & CSV (HMIS format).')}
                  />
                </div>
              </div>

              {/* Feed and Diagnostic Test Volume */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                  <SectionHeader
                    title="Diagnostic Work Bench Stream"
                    sub="Live specimen tracking & validation log"
                    action={<button onClick={() => setActiveTab('orders')} className="text-xs text-purple-700 font-bold hover:underline">View All Orders</button>}
                  />
                  <ActivityFeed items={labActivity} maxItems={5} />
                </div>

                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <SectionHeader title="LIS Quality & Volume Targets" sub="Junnar RH Central Lab" />
                  <ProgressBar value={22} max={25} color="bg-purple-500" label="Daily Target Tests (88%)" />
                  <ProgressBar value={100} max={100} color="bg-emerald-500" label="Emergency Turnaround < 30m (100%)" />
                  <ProgressBar value={100} max={100} color="bg-blue-500" label="Critical Panic Direct Notification (100%)" />
                  <ProgressBar value={95} max={100} color="bg-teal-500" label="Reagent Inventory Shelf Life (95%)" />

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">NABL Accreditation Readiness</span>
                    <span className="font-black text-purple-800">ISO 15189:2022 Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 1: SAMPLE ORDERS CONTAINER */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                {['All', 'Hematology', 'Serology/Malaria', 'Biochemistry', 'Microbiology/Sputum', 'Urine Analysis'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search patient or test name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>
            </div>

            {/* Diagnostic Orders List */}
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const isDone = order.sampleStatus === 'Validated';
                const isPanic = order.isPanicValue;
                return (
                  <div 
                    key={order.id}
                    className={`rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                      isPanic ? 'bg-red-50/60 border-red-300 shadow-xs' : isDone ? 'bg-slate-50 border-slate-200' : 'bg-white border-purple-200 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                          {order.orderNumber}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900">{order.testName}</h4>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isPanic ? 'bg-red-100 text-red-800 animate-pulse' : isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {order.sampleStatus}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600">
                        Patient: <strong className="text-slate-900">{order.patientName}</strong> ({order.patientGender}, {order.patientAge}y) • Ordered by <strong>{order.orderingDoctor}</strong>
                      </div>

                      {order.resultValue ? (
                        <div className="text-xs text-slate-800 bg-white p-2 rounded-xl border border-slate-200 font-medium mt-1">
                          <strong>Result:</strong> <span className="font-bold text-slate-900">{order.resultValue}</span> {order.resultNotes && `(${order.resultNotes})`}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400">Sample: {order.sampleType} • Requisition received {order.orderedAt}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!isDone ? (
                        <button
                          onClick={() => handleOpenResultModal(order)}
                          className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Enter Result & Sign</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => showToast(`Downloaded report PDF for ${order.orderNumber}`)}
                          className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-500" />
                          <span>Report PDF</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ENTER TEST RESULT */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Enter Diagnostic Findings & Sign</h3>
                <p className="text-xs text-slate-500">{selectedOrder.patientName} • {selectedOrder.testName}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResult} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Measured Result Value</label>
                <input
                  type="text"
                  value={resultVal}
                  onChange={(e) => setResultVal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Biological Reference Interval</label>
                <input
                  type="text"
                  value={refRange}
                  onChange={(e) => setRefRange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Technician / Pathologist Remarks</label>
                <textarea
                  rows={2}
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="panicFlag"
                  checked={isPanic}
                  onChange={(e) => setIsPanic(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <label htmlFor="panicFlag" className="text-xs font-bold text-red-700 cursor-pointer">
                  Flag as Critical Panic Value (Immediate Doctor Escalation)
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify, Sign & Dispatch to Patient EHR</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
