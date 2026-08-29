import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Search, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Package, 
  Send,
  X,
  Printer,
  Activity
} from 'lucide-react';
import { KpiCard, QuickAction, ActivityFeed, AlertBanner, SectionHeader, ProgressBar, ActivityItem } from '../common/DashboardWidgets';

export const PharmacistPortal: React.FC = () => {
  const { showToast, language, t } = useApp();
  const { 
    prescriptionOrders, 
    dispensePrescription, 
    medicines, 
    addNewStockConsignment, 
    updateMedicineStock 
  } = useHealthData();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'pending_rx' | 'inventory' | 'inward_stock' | 'indents'>('dashboard');
  const [searchDrug, setSearchDrug] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Inward Consignment State
  const [inwardName, setInwardName] = useState<string>('Ferrous Ascorbate + Folic Acid Tablets');
  const [inwardBatch, setInwardBatch] = useState<string>('BT-9921');
  const [inwardExpiry, setInwardExpiry] = useState<string>('2028-11-30');
  const [inwardQty, setInwardQty] = useState<number>(1000);
  const [inwardCategory, setInwardCategory] = useState<string>('Maternal Supplement');

  // Indent State
  const [indentDrug, setIndentDrug] = useState<string>('Labetalol 100mg Tablets');
  const [indentQty, setIndentQty] = useState<number>(500);
  const [indentReason, setIndentReason] = useState<string>('Buffer stock needed for Junnar Maternity Wing pre-eclampsia management.');

  const filteredMedicines = medicines.filter(m => {
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch = !searchDrug || m.name.toLowerCase().includes(searchDrug.toLowerCase()) || m.genericName.toLowerCase().includes(searchDrug.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDispense = async (orderId: string, patientName: string) => {
    const success = await dispensePrescription(orderId, 'Anand Deshmukh, Lead Pharmacist');
    if (success) {
      showToast(`Prescription dispensed for ${patientName}. Live inventory stock updated.`);
    }
  };

  const handleSaveConsignment = (e: React.FormEvent) => {
    e.preventDefault();
    addNewStockConsignment({
      name: inwardName,
      batchNumber: inwardBatch,
      expiryDate: inwardExpiry,
      currentStock: inwardQty,
      category: inwardCategory as any,
      location: 'Main Pharmacy Rack B-4'
    });
    showToast(`Stock Inward Logged: +${inwardQty} units of ${inwardName}`);
    setActiveTab('inventory');
  };

  const handleSendIndent = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Emergency Indent IND-MH-8819 for ${indentQty}x ${indentDrug} sent to Pune District Drug Warehouse.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Pharmacy Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">Anand Deshmukh (Pharmacist)</h1>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                  {t.role_pharmacist}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Junnar Rural Hospital Central Dispensary • License: <strong>MH-PHARM-2018-4412</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('inward_stock')}
              className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Stock Inward</span>
            </button>
          </div>
        </div>

        {/* Operational Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending e-Prescriptions</span>
            <div className="text-2xl font-black text-amber-600">
              {prescriptionOrders.filter(p => p.status === 'QUEUED').length} Orders
            </div>
            <span className="text-[11px] text-slate-500">Live Doctor Teleconsult Orders</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Dispensed Today</span>
            <div className="text-2xl font-black text-emerald-700">
              {prescriptionOrders.filter(p => p.status === 'DISPENSED').length} Fulfilled
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">100% Barcode Verified</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Essential Drugs Stocked</span>
            <div className="text-2xl font-black text-slate-900">{medicines.length} SKUs</div>
            <span className="text-[11px] text-slate-500">EDL 2026 Compliant</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Critical Stock Alert</span>
            <div className="text-2xl font-black text-red-600">
              {medicines.filter(m => m.status === 'Critical Stock-Out' || m.status === 'Low Stock').length} Items
            </div>
            <span className="text-[11px] text-red-600 font-medium">Auto-Indent Ready</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: Activity },
            { id: 'pending_rx', label: 'Doctor e-Prescription Queue', icon: Clock, count: prescriptionOrders.filter(p => p.status === 'QUEUED').length },
            { id: 'inventory', label: 'Live Drug Stock & Formulary', icon: Package, count: medicines.length },
            { id: 'inward_stock', label: 'Inward Drug Consignment', icon: Plus },
            { id: 'indents', label: 'District Warehouse Indent', icon: Send }
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

        {/* TAB 0: PHARMACY COMMAND CENTER DASHBOARD */}
        {activeTab === 'dashboard' && (() => {
          const pendingOrders = prescriptionOrders.filter(p => p.status === 'QUEUED');
          const dispensedOrders = prescriptionOrders.filter(p => p.status === 'DISPENSED');
          const criticalMeds = medicines.filter(m => m.status === 'Critical Stock-Out' || m.status === 'Low Stock');

          const pharmaActivity: ActivityItem[] = [
            { id: 'ph-1', icon: '💊', title: 'e-Rx Dispensed & Verified', sub: 'Sunita Shinde (Ferrous Ascorbate + Calcium)', time: '12m ago', badge: 'Fulfilled', badgeColor: 'emerald' },
            { id: 'ph-2', icon: '📦', title: 'Stock Inward Logged', sub: '+1000 Tabs Ferrous Ascorbate (Batch BT-9921)', time: '40m ago', badge: 'Inward', badgeColor: 'blue' },
            { id: 'ph-3', icon: '⚠️', title: 'Low Stock Auto-Trigger', sub: 'Labetalol 100mg fell below 50 units threshold', time: '1h ago', badge: 'Indent Req', badgeColor: 'amber' },
            { id: 'ph-4', icon: '🩺', title: 'e-Rx Arrived from Dr. Rohini', sub: 'Rajesh Kumar (Telmisartan 40mg · 30d)', time: '2h ago', badge: 'Queued', badgeColor: 'purple' },
            { id: 'ph-5', icon: '🚚', title: 'District Indent Dispatched', sub: 'IND-MH-8819 approved by Pune Warehouse', time: '4h ago', badge: 'In Transit', badgeColor: 'blue' }
          ];

          return (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
              {/* KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard
                  label="Pending e-Rx Queue"
                  value={pendingOrders.length}
                  icon={Clock}
                  iconColor="text-amber-600"
                  iconBg="bg-amber-100"
                  trend="up"
                  trendLabel="Live stream"
                  urgency={pendingOrders.length > 0 ? 'warning' : 'normal'}
                  onClick={() => setActiveTab('pending_rx')}
                />
                <KpiCard
                  label="Dispensed Today"
                  value={dispensedOrders.length + 8}
                  icon={CheckCircle2}
                  iconColor="text-emerald-600"
                  iconBg="bg-emerald-100"
                  trend="up"
                  trendLabel="+6 vs yday"
                  onClick={() => setActiveTab('pending_rx')}
                />
                <KpiCard
                  label="Essential Formulary SKUs"
                  value={medicines.length}
                  icon={Package}
                  iconColor="text-blue-600"
                  iconBg="bg-blue-100"
                  trend="flat"
                  trendLabel="EDL 2026"
                  onClick={() => setActiveTab('inventory')}
                />
                <KpiCard
                  label="Critical Stock Alerts"
                  value={criticalMeds.length}
                  icon={AlertTriangle}
                  iconColor="text-red-600"
                  iconBg="bg-red-100"
                  trend={criticalMeds.length > 0 ? 'up' : 'down'}
                  trendLabel={criticalMeds.length > 0 ? 'Action required' : 'Optimal'}
                  urgency={criticalMeds.length > 0 ? 'critical' : 'normal'}
                  onClick={() => setActiveTab('indents')}
                />
              </div>

              {/* Actionable Alerts */}
              <div className="space-y-2">
                {pendingOrders.length > 0 && (
                  <AlertBanner
                    type="critical"
                    title="💊 Unfulfilled Doctor e-Prescriptions Waiting"
                    message={`${pendingOrders.length} teleconsult prescription(s) signed by Specialist Doctors pending patient pickup.`}
                    action={{ label: 'Dispense Now', onClick: () => setActiveTab('pending_rx') }}
                  />
                )}
                {criticalMeds.length > 0 && (
                  <AlertBanner
                    type="warning"
                    title="Buffer Stock Warning"
                    message={`${criticalMeds.map(m => m.name).join(', ')} reached reorder point. Auto-indent ready.`}
                    action={{ label: 'Review Indent', onClick: () => setActiveTab('indents') }}
                  />
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <SectionHeader title="Dispensary Quick Actions" sub="Direct pharmacy operations" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <QuickAction
                    icon={CheckCircle2}
                    label="Dispense Queue"
                    sub="Verify QR & Dispense"
                    color="bg-emerald-700 text-white"
                    onClick={() => setActiveTab('pending_rx')}
                    pulse={pendingOrders.length > 0}
                  />
                  <QuickAction
                    icon={Plus}
                    label="Stock Inward"
                    sub="Log incoming batch"
                    color="bg-amber-600 text-white"
                    onClick={() => setActiveTab('inward_stock')}
                  />
                  <QuickAction
                    icon={Package}
                    label="Formulary Search"
                    sub="Check stock levels"
                    color="bg-blue-700 text-white"
                    onClick={() => setActiveTab('inventory')}
                  />
                  <QuickAction
                    icon={Send}
                    label="Raise Indent"
                    sub="Warehouse requisition"
                    color="bg-purple-700 text-white"
                    onClick={() => setActiveTab('indents')}
                  />
                </div>
              </div>

              {/* Feed and Formulary Compliance */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                  <SectionHeader
                    title="Dispensary Event Stream"
                    sub="Barcode verification & dispensing log"
                    action={<button onClick={() => setActiveTab('pending_rx')} className="text-xs text-emerald-800 font-bold hover:underline">View All</button>}
                  />
                  <ActivityFeed items={pharmaActivity} maxItems={5} />
                </div>

                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <SectionHeader title="Formulary Availability" sub="Junnar RH Dispensary Compliance" />
                  <ProgressBar value={94} max={100} color="bg-emerald-500" label="Essential Drug Availability (94%)" />
                  <ProgressBar value={100} max={100} color="bg-teal-500" label="Maternal & ANC Supplements (100%)" />
                  <ProgressBar value={88} max={100} color="bg-blue-500" label="NCD & Hypertension Drugs (88%)" />
                  <ProgressBar value={100} max={100} color="bg-purple-500" label="QR / Batch Traceability (100%)" />

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Inventory Status</span>
                    <span className="font-black text-emerald-700">🟢 98.2% In-Stock</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 1: E-PRESCRIPTION DISPENSING QUEUE */}
        {activeTab === 'pending_rx' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Incoming e-Prescription Fulfillment Queue</h3>
                <p className="text-xs text-slate-500">Live medication orders created by doctors during teleconsultations.</p>
              </div>
            </div>

            <div className="space-y-4">
              {prescriptionOrders.map((order) => {
                const isPending = order.status === 'QUEUED';
                return (
                  <div 
                    key={order.id}
                    className={`rounded-2xl border p-5 space-y-4 transition-all ${
                      isPending ? 'bg-white border-amber-300 shadow-xs ring-1 ring-amber-400/20' : 'bg-slate-50 border-slate-200 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                            {order.tokenNumber}
                          </span>
                          <span className="font-extrabold text-slate-900 text-base">{order.patientName}</span>
                          <span className="text-xs text-slate-500">({order.patientGender}, {order.patientAge}y • {order.patientVillage})</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Prescribed by <strong>{order.doctorName}</strong> ({order.facilityName}) • {order.prescribedAt}
                        </p>
                      </div>

                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                        isPending ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isPending ? 'PENDING DISPENSING' : 'DISPENSED & SYNCED'}
                      </span>
                    </div>

                    {/* Prescribed Drugs List */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Prescribed Medicines</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                            <div className="font-extrabold text-slate-900">{item.name}</div>
                            <div className="text-slate-600 font-mono">
                              Dosage: <strong>{item.dosage}</strong> • Qty: <strong>{item.quantity}</strong>
                            </div>
                            <div className="text-[11px] text-emerald-700">Frequency: {item.frequency} ({item.duration})</div>
                            <div className="text-[10px] text-slate-500">{item.instructions}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.notes && (
                      <div className="text-xs text-slate-700 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200">
                        <strong>Doctor Clinical Instructions:</strong> {order.notes}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => showToast(`Printing dispensary label for ${order.tokenNumber}`)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Dispensary Label</span>
                      </button>

                      {isPending && (
                        <button
                          onClick={() => handleDispense(order.id, order.patientName)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-6 rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Dispense Medicines & Deduct Stock</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE DRUG INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                {['All', 'Maternal Supplement', 'Antibiotic', 'Analgesic', 'Antihypertensive', 'Antidiabetic', 'Emergency'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-700 text-white shadow-xs'
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
                  placeholder="Search drug or generic name..."
                  value={searchDrug}
                  onChange={(e) => setSearchDrug(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-3">Drug Name / Generic</th>
                    <th className="p-3">Batch & Expiry</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Stock Available</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMedicines.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900">{med.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{med.code} • {med.genericName}</div>
                      </td>
                      <td className="p-3 font-mono">
                        <div className="font-bold text-slate-800">{med.batchNumber}</div>
                        <div className="text-[10px] text-slate-400">Exp: {med.expiryDate}</div>
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {med.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-extrabold text-sm text-slate-900">{med.currentStock}</span>{' '}
                        <span className="text-slate-500 text-[11px]">{med.unit}</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          med.status === 'In Stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {med.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => {
                            updateMedicineStock(med.id, 50);
                            showToast(`Added +50 stock for ${med.name}`);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded text-xs font-bold border border-slate-300"
                        >
                          +50
                        </button>
                        <button
                          onClick={() => {
                            updateMedicineStock(med.id, -10);
                            showToast(`Dispensed -10 stock for ${med.name}`);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded text-xs font-bold border border-slate-300"
                        >
                          -10
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: INWARD STOCK CONSIGNMENT FORM */}
        {activeTab === 'inward_stock' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Record Inward Drug Consignment (e-Aushadhi)</h3>
              <p className="text-xs text-slate-500">Log incoming medicine shipments from Maharashtra State Drug Depot.</p>
            </div>

            <form onSubmit={handleSaveConsignment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Medicine Name & Formulation</label>
                <input
                  type="text"
                  value={inwardName}
                  onChange={(e) => setInwardName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={inwardBatch}
                    onChange={(e) => setInwardBatch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={inwardExpiry}
                    onChange={(e) => setInwardExpiry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Received Quantity (Units)</label>
                  <input
                    type="number"
                    value={inwardQty}
                    onChange={(e) => setInwardQty(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Therapeutic Category</label>
                  <select
                    value={inwardCategory}
                    onChange={(e) => setInwardCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="Maternal Supplement">Maternal Supplement</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Antihypertensive">Antihypertensive</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md"
                >
                  Confirm Inward & Update Central Stock Ledger
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: DISTRICT INDENTS */}
        {activeTab === 'indents' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Emergency Stock Indent to District Drug Warehouse</h3>
              <p className="text-xs text-slate-500">Raise emergency replenishments for low-stock life-saving medicines.</p>
            </div>

            <form onSubmit={handleSendIndent} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Drug Item Required</label>
                <input
                  type="text"
                  value={indentDrug}
                  onChange={(e) => setIndentDrug(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Required Quantity</label>
                <input
                  type="number"
                  value={indentQty}
                  onChange={(e) => setIndentQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Clinical Indent Justification</label>
                <textarea
                  rows={3}
                  value={indentReason}
                  onChange={(e) => setIndentReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Transmit Official Indent to Pune District Warehouse</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
