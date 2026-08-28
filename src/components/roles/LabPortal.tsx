import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_DIAGNOSTIC_ORDERS } from '../../data/mockData';
import { DiagnosticOrder } from '../../types';
import { 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Activity, 
  QrCode, 
  Clock, 
  FileCheck,
  Send
} from 'lucide-react';

export const LabPortal: React.FC = () => {
  const { showToast } = useApp();
  const [orders, setOrders] = useState<DiagnosticOrder[]>(MOCK_DIAGNOSTIC_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<DiagnosticOrder | null>(null);
  const [resultVal, setResultVal] = useState('');
  const [isPanicFlag, setIsPanicFlag] = useState(false);
  const [resultNotes, setResultNotes] = useState('');

  const handleOpenResultEntry = (order: DiagnosticOrder) => {
    setSelectedOrder(order);
    setResultVal(order.resultValue || '');
    setIsPanicFlag(order.isPanicValue || false);
    setResultNotes(order.resultNotes || '');
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          sampleStatus: isPanicFlag ? 'Critical Alert' : 'Validated',
          resultValue: resultVal,
          isPanicValue: isPanicFlag,
          resultNotes: resultNotes
        };
      }
      return o;
    }));

    if (isPanicFlag) {
      showToast(`CRITICAL PANIC VALUE BROADCAST! Alert SMS & notification dispatched to Dr. Swapnil Deshmukh.`);
    } else {
      showToast(`Diagnostic report validated and synced to patient ABHA longitudinal record.`);
    }

    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-800 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <FlaskConical className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">Vikas Shinde (Senior Lab Tech)</h1>
                <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                  NABL Standards
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Otur PHC Clinical Laboratory & Hub Diagnostics • Hematology & Biochemistry Unit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-purple-50 border border-purple-200 px-3.5 py-1.5 rounded-xl text-xs">
              <span className="text-purple-800 font-bold">Equipment Status: </span>
              <strong className="text-purple-950 font-black">Sysmex CBC & Semi-Auto Analyzer Online (100%)</strong>
            </div>
          </div>
        </div>

        {/* Diagnostic Sample Queue Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Laboratory Sample Processing Queue</h3>
              <p className="text-xs text-slate-500">Scan barcodes, enter test parameters, and broadcast panic values</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
              4 Orders in Queue
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2.5">Barcode / Patient</th>
                  <th className="pb-2.5">Test Requested</th>
                  <th className="pb-2.5">Sample Type</th>
                  <th className="pb-2.5">Ordering Doctor</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900">{ord.patientName} ({ord.patientAge}y/{ord.patientGender})</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ord.orderNumber}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-800">{ord.testName}</div>
                      <div className="text-[10px] text-slate-500">{ord.testCategory}</div>
                    </td>
                    <td className="py-3.5 text-slate-600">
                      <div>{ord.sampleType}</div>
                      <div className="text-[10px] text-slate-400">{ord.orderedAt}</div>
                    </td>
                    <td className="py-3.5 text-slate-600">
                      {ord.orderingDoctor}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        ord.sampleStatus === 'Critical Alert' ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse' :
                        ord.sampleStatus === 'Validated' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.sampleStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleOpenResultEntry(ord)}
                        className="bg-[#003527] hover:bg-[#064e3b] text-white text-[11px] font-bold py-1.5 px-3 rounded-xl transition-all"
                      >
                        {ord.sampleStatus === 'Validated' ? 'Edit / Review' : 'Enter Results'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enter Results Modal Overlay */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Result Entry: {selectedOrder.testName}
                  </h3>
                  <p className="text-xs text-slate-500">Patient: {selectedOrder.patientName} • {selectedOrder.orderNumber}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 font-bold text-lg p-1">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveResult} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Measured Result Value / Parameter Data</label>
                  <input
                    type="text"
                    required
                    value={resultVal}
                    onChange={(e) => setResultVal(e.target.value)}
                    placeholder="e.g. Hb: 8.2 g/dL, Platelets: 2.1 Lakhs, Ferritin: 9.4 ng/mL"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-800"
                  />
                </div>

                <div className="bg-red-50 p-3 rounded-2xl border border-red-200 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="panicCheck"
                    checked={isPanicFlag}
                    onChange={(e) => setIsPanicFlag(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <label htmlFor="panicCheck" className="text-red-950 font-bold cursor-pointer">
                    Flag as Critical Panic Value (Immediate Doctor & ASHA Alert)
                  </label>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Technician Diagnostic Notes & Recommendations</label>
                  <textarea
                    rows={3}
                    value={resultNotes}
                    onChange={(e) => setResultNotes(e.target.value)}
                    placeholder="Enter technician remarks..."
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Validate & Publish Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
