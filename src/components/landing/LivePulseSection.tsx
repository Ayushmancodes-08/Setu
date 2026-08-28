import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DISTRICT_METRICS } from '../../data/mockData';
import { DistrictMetric } from '../../types';
import { 
  BarChart3, 
  Clock, 
  Pill, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  MapPin, 
  TrendingUp, 
  Users,
  Video
} from 'lucide-react';

export const LivePulseSection: React.FC = () => {
  const { setCurrentView } = useApp();
  const [selectedMetric, setSelectedMetric] = useState<'waitTime' | 'referrals' | 'stock' | 'teleconsult'>('waitTime');

  return (
    <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Real-Time State Telemetry</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Pulse of Maharashtra Rural Health
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Live operational metrics streaming from 14,280+ connected public health centres across Maharashtra districts.
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setSelectedMetric('waitTime')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedMetric === 'waitTime' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Wait Times</span>
            </button>
            <button
              onClick={() => setSelectedMetric('referrals')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedMetric === 'referrals' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Referral %</span>
            </button>
            <button
              onClick={() => setSelectedMetric('stock')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedMetric === 'stock' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Drug Stock</span>
            </button>
            <button
              onClick={() => setSelectedMetric('teleconsult')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedMetric === 'teleconsult' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Teleconsults</span>
            </button>
          </div>
        </div>

        {/* District Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DISTRICT_METRICS.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/80 p-5 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{item.districtName}</span>
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {item.totalFacilities} Public Facilities Connected
                  </div>
                </div>

                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                  item.riskStatus === 'Normal' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  item.riskStatus === 'Moderate' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                }`}>
                  {item.riskStatus} Status
                </span>
              </div>

              {/* Dynamic Focus Metric Bar */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50">
                {selectedMetric === 'waitTime' && (
                  <div>
                    <div className="text-xs text-slate-400 flex justify-between">
                      <span>Avg OPD Triage + Wait Time</span>
                      <span className="font-bold text-emerald-400">{item.avgWaitTimeMinutes} mins</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.avgWaitTimeMinutes < 20 ? 'bg-emerald-500' : item.avgWaitTimeMinutes < 25 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, (item.avgWaitTimeMinutes / 40) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {selectedMetric === 'referrals' && (
                  <div>
                    <div className="text-xs text-slate-400 flex justify-between">
                      <span>Referral Loop Completion Rate</span>
                      <span className="font-bold text-teal-300">{item.referralCompletionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                        style={{ width: `${item.referralCompletionRate}%` }}
                      />
                    </div>
                  </div>
                )}

                {selectedMetric === 'stock' && (
                  <div>
                    <div className="text-xs text-slate-400 flex justify-between">
                      <span>Facilities with Stock-out Flag</span>
                      <span className="font-bold text-amber-400">{item.facilitiesWithStockout} of {item.totalFacilities}</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(item.facilitiesWithStockout / item.totalFacilities) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {selectedMetric === 'teleconsult' && (
                  <div>
                    <div className="text-xs text-slate-400 flex justify-between">
                      <span>Teleconsultations Completed Today</span>
                      <span className="font-bold text-blue-400">{item.teleconsultationsToday} Sessions</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(item.teleconsultationsToday / 500) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.activePatients.toLocaleString()} active patients</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <AlertCircle className="w-3.5 h-3.5 text-pink-400" />
                  <span>{item.highRiskMaternalMonitored} High-Risk Pregnancies</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DHO Full Radar Launch Banner */}
        <div className="mt-10 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-white text-base">
              Authorized District Health Administration View
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Access the complete DHO command center with referral drop-off funnels, GIS disease clusters, and direct stock replenishment instructions.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('dho')}
            className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
          >
            Launch DHO Command Center
          </button>
        </div>

      </div>
    </section>
  );
};
