import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_MEDICINES } from '../../data/mockData';
import { MedicineItem } from '../../types';
import { 
  Layers, 
  Pill, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText,
  Send,
  Building
} from 'lucide-react';

export const PharmacistPortal: React.FC = () => {
  const { showToast } = useApp();
  const [medicines, setMedicines] = useState<MedicineItem[]>(MOCK_MEDICINES);
  const [searchTerm, setSearchTerm] = useState('');
  const [dispensePatientName, setDispensePatientName] = useState('Sunita Shinde');
  const [selectedMedToDispense, setSelectedMedToDispense] = useState(MOCK_MEDICINES[0].id);
  const [dispenseQuantity, setDispenseQuantity] = useState(30);

  const filteredMeds = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDispense = (e: React.FormEvent) => {
    e.preventDefault();
    setMedicines(prev => prev.map(m => {
      if (m.id === selectedMedToDispense) {
        const newStock = Math.max(0, m.currentStock - dispenseQuantity);
        return {
          ...m,
          currentStock: newStock,
          status: newStock === 0 ? 'Critical Stock-Out' : newStock <= m.reorderLevel ? 'Low Stock' : 'In Stock',
          lastDispensedDate: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        };
      }
      return m;
    }));

    showToast(`Dispensed ${dispenseQuantity} units to ${dispensePatientName}. Stock movement logged to audit ledger.`);
  };

  const handleCreateIndent = (medName: string) => {
    showToast(`Emergency Indent for ${medName} submitted to District Drug Store, Pune!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">Ramesh Kulkarni (Pharmacist)</h1>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                  e-Aushadhi Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Otur Primary Health Centre Drug Dispensary • Junnar District Sub-Store
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs">
              <span className="text-emerald-800 font-bold">Overall Drug Stock Rate: </span>
              <strong className="text-emerald-950 font-black text-sm">91.8%</strong>
            </div>
          </div>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Live Inventory Ledger (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Transactional Drug Inventory Ledger</h3>
                <p className="text-xs text-slate-500">Real-time batch tracking & automated re-order thresholds</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter medicines..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-2.5">Drug Name / Category</th>
                    <th className="pb-2.5">Batch / Expiry</th>
                    <th className="pb-2.5 text-right">Current Stock</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMeds.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{med.name}</div>
                        <div className="text-[10px] text-slate-500">{med.genericName} • {med.category}</div>
                      </td>
                      <td className="py-3 text-slate-600">
                        <div>{med.batchNumber}</div>
                        <div className="text-[10px] text-slate-400">Exp: {med.expiryDate}</div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-extrabold text-sm text-slate-900">{med.currentStock}</span>
                        <span className="text-[10px] text-slate-400 block">{med.unit}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          med.status === 'In Stock' ? 'bg-emerald-100 text-emerald-800' :
                          med.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800 animate-pulse'
                        }`}>
                          {med.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {med.status !== 'In Stock' && (
                          <button
                            onClick={() => handleCreateIndent(med.name)}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                          >
                            Indent Supply
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Dispensing Counter & Requisitions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Dispensing Counter Box */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Pill className="w-4 h-4 text-emerald-700" />
                <span>Instant Dispensing Counter</span>
              </h3>

              <form onSubmit={handleDispense} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={dispensePatientName}
                    onChange={(e) => setDispensePatientName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Select Prescribed Drug</label>
                  <select
                    value={selectedMedToDispense}
                    onChange={(e) => setSelectedMedToDispense(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50"
                  >
                    {medicines.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.currentStock} in stock)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Dispense Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={dispenseQuantity}
                    onChange={(e) => setDispenseQuantity(parseInt(e.target.value) || 1)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dispense & Update Ledger</span>
                </button>
              </form>
            </div>

            {/* District Drug Store Requisition Status */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm">District Drug Store Indents</h4>
                <Building className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300">
                Automated monthly supply requisition sent to Pune District Central Warehouse.
              </p>
              <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-xs space-y-1">
                <div className="flex justify-between font-bold text-amber-300">
                  <span>Oxytocin 10 IU Ampoules</span>
                  <span>50 Units In Transit</span>
                </div>
                <div className="text-[10px] text-slate-400">Truck dispatch #MH-12-DS-401 • ETA Tomorrow 11 AM</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
