import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Bed, 
  Users, 
  Clock, 
  Truck, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  PhoneCall
} from 'lucide-react';

export const FacilityPortal: React.FC = () => {
  const { showToast } = useApp();

  const bedCategories = [
    { name: 'General Female Ward', total: 16, occupied: 12, available: 4, type: 'general' },
    { name: 'General Male Ward', total: 14, occupied: 10, available: 4, type: 'general' },
    { name: 'Maternity / Labor Ward (JSSK)', total: 10, occupied: 8, available: 2, type: 'maternity' },
    { name: 'Special Newborn Care Unit (SNCU)', total: 4, occupied: 3, available: 1, type: 'neonatal' },
    { name: 'Intensive Care Unit (ICU / HDU)', total: 6, occupied: 3, available: 3, type: 'icu' }
  ];

  const dutyStaff = [
    { role: 'Medical Officer (Shift In-Charge)', name: 'Dr. Swapnil Deshmukh', status: 'On Duty', phone: '+91 94220 88214' },
    { role: 'Staff Nurse (Labor Room)', name: 'Sister Jayashree Shinde', status: 'On Duty', phone: '+91 98210 33412' },
    { role: 'Staff Nurse (General Ward)', name: 'Sister Sunanda Jadhav', status: 'On Duty', phone: '+91 98210 33413' },
    { role: 'Pharmacist', name: 'Ramesh Kulkarni', status: 'On Duty', phone: '+91 94231 11200' },
    { role: 'Lab Technician', name: 'Vikas Shinde', status: 'On Duty', phone: '+91 98221 44901' },
    { role: '108 Ambulance ALS Pilot', name: 'Ramesh Borhade', status: 'Standby / Ready', phone: '+91 94225 55800' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-800 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">Otur PHC & Junnar Cluster Operations</h1>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Facility Level Command
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Facility Coordinator: Suresh Tambe • Public Health Dept, Govt of Maharashtra
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Emergency inter-facility transfer requisition dispatched!')}
              className="bg-[#003527] hover:bg-[#064e3b] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Coordinate Transfer</span>
            </button>
          </div>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Bed Occupancy Matrix (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Bed className="w-4 h-4 text-indigo-600" />
                  <span>Real-Time Bed Occupancy Heat-Grid</span>
                </h3>
                <p className="text-xs text-slate-500">Live capacity status across 50 sanctioned beds</p>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-500 font-medium">Total Available: </span>
                <strong className="text-emerald-700 font-extrabold text-sm">14 Beds</strong>
              </div>
            </div>

            {/* Bed Category Bars */}
            <div className="space-y-4">
              {bedCategories.map((bed, idx) => {
                const occupancyRate = Math.round((bed.occupied / bed.total) * 100);
                return (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">{bed.name}</span>
                      <span className="font-extrabold text-slate-700">
                        {bed.available} Available <span className="text-slate-400 font-normal">({bed.occupied}/{bed.total} Occupied)</span>
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occupancyRate > 85 ? 'bg-red-500' : occupancyRate > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: On-Duty Staff Shift Roster (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>On-Duty Clinical Shift Matrix</span>
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                Shift A (Morning)
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {dutyStaff.map((staff, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{staff.name}</div>
                    <div className="text-[11px] text-slate-500">{staff.role}</div>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                      {staff.status}
                    </span>
                    <a href={`tel:${staff.phone.replace(/\s+/g, '')}`} className="block text-[10px] text-emerald-700 font-bold mt-1">
                      Call Staff
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
