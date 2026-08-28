import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_ASHA_TASKS } from '../../data/mockData';
import { AshaTask } from '../../types';
import { offlineSyncManager } from '../../services/offlineSync';
import { bhashiniAI } from '../../services/bhashiniService';
import { 
  HeartHandshake, 
  CheckCircle2, 
  Mic, 
  MicOff,
  WifiOff, 
  Wifi, 
  PhoneCall, 
  Video, 
  AlertTriangle, 
  Calendar, 
  Plus, 
  Clock, 
  Check, 
  MapPin, 
  UserPlus,
  Volume2,
  Radio
} from 'lucide-react';

export const AshaPortal: React.FC = () => {
  const { language, isOnline, showToast, setCurrentView } = useApp();
  const [tasks, setTasks] = useState<AshaTask[]>(MOCK_ASHA_TASKS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'overdue' | 'today' | 'upcoming'>('all');
  const [selectedTaskForVisit, setSelectedTaskForVisit] = useState<AshaTask | null>(null);
  const [recordedVitals, setRecordedVitals] = useState({ bp: '', sugar: '', hb: '', notes: '' });
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'all') return true;
    return t.urgency === activeFilter;
  });

  const handleStartVisit = (task: AshaTask) => {
    setSelectedTaskForVisit(task);
    setRecordedVitals({
      bp: task.lastVitals?.bp || '120/80',
      sugar: task.lastVitals?.sugar || '110',
      hb: task.lastVitals?.hemoglobin || '10.5',
      notes: ''
    });
  };

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForVisit) return;

    // Enqueue optimistic offline mutation
    offlineSyncManager.enqueueMutation('LOG_ASHA_VISIT', {
      taskId: selectedTaskForVisit.id,
      patientName: selectedTaskForVisit.patientName,
      vitals: recordedVitals,
      timestamp: new Date().toISOString()
    });

    // Update local state optimistically
    setTasks(prev => prev.map(t => {
      if (t.id === selectedTaskForVisit.id) {
        return {
          ...t,
          isSynced: isOnline,
          notes: recordedVitals.notes || t.notes,
          lastVitals: {
            ...t.lastVitals,
            bp: recordedVitals.bp,
            sugar: recordedVitals.sugar,
            hemoglobin: recordedVitals.hb
          },
          completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return t;
    }));

    showToast(isOnline ? 'Visit logged and synced with PHC server!' : 'Offline Mode: Visit saved locally. Will auto-sync when online.');
    setSelectedTaskForVisit(null);
  };

  const handleVoiceInput = () => {
    setIsVoiceRecording(true);
    setTimeout(() => {
      setIsVoiceRecording(false);
      setRecordedVitals(prev => ({
        ...prev,
        notes: language === 'mr' 
          ? 'मातेला रक्तदाब नियंत्रित आहे, आयर्न सिरप नियमित घेण्यास सांगितले आहे.' 
          : 'Patient vitals stable. Iron supplementation adherence verified.'
      }));
      showToast('Marathi voice notes transcribed successfully.');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] py-6 px-3 sm:px-6 max-w-2xl mx-auto space-y-6">
      
      {/* Top Header Card (ASHA Persona) */}
      <div className="bg-[#003527] text-white p-5 rounded-3xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-pink-300 font-bold text-xl">
              MK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight">Manisha Kadam (ASHA)</h1>
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Khamgaon Beat
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">Khamgaon Village • 142 Households Assigned</p>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
              isOnline ? 'bg-emerald-900/80 text-emerald-300' : 'bg-amber-900/80 text-amber-300 animate-pulse'
            }`}>
              {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
              <span>{isOnline ? 'Synced' : 'Offline'}</span>
            </span>
          </div>
        </div>

        {/* Action Row */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-900/80">
          <div className="bg-emerald-900/40 p-2.5 rounded-xl text-xs">
            <div className="text-emerald-300 font-medium">Overdue / Today's Visits</div>
            <div className="text-xl font-extrabold text-white">2 Tasks Due</div>
          </div>
          <div className="bg-emerald-900/40 p-2.5 rounded-xl text-xs">
            <div className="text-emerald-300 font-medium">High-Risk Pregnancies</div>
            <div className="text-xl font-extrabold text-amber-300">1 Monitored</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs (Queue Ordering: Overdue -> Today -> Upcoming) */}
      <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-2 rounded-xl transition-all ${activeFilter === 'all' ? 'bg-white text-[#003527] shadow-sm' : 'text-slate-600'}`}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => setActiveFilter('overdue')}
          className={`flex-1 py-2 rounded-xl transition-all ${activeFilter === 'overdue' ? 'bg-red-600 text-white shadow-sm' : 'text-red-700'}`}
        >
          Overdue (1)
        </button>
        <button
          onClick={() => setActiveFilter('today')}
          className={`flex-1 py-2 rounded-xl transition-all ${activeFilter === 'today' ? 'bg-[#003527] text-white shadow-sm' : 'text-slate-600'}`}
        >
          Today (2)
        </button>
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`flex-1 py-2 rounded-xl transition-all ${activeFilter === 'upcoming' ? 'bg-white text-[#003527] shadow-sm' : 'text-slate-600'}`}
        >
          Upcoming (1)
        </button>
      </div>

      {/* Task Queue Cards (Mobile First, large tap targets) */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-3xl border p-5 shadow-sm space-y-3 transition-all ${
              task.urgency === 'overdue' ? 'border-red-300 bg-red-50/10' :
              task.urgency === 'today' ? 'border-amber-300 bg-amber-50/10' :
              'border-slate-200'
            }`}
          >
            {/* Header: Urgency + Sync status */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                task.urgency === 'overdue' ? 'bg-red-100 text-red-800' :
                task.urgency === 'today' ? 'bg-amber-100 text-amber-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {task.category} • {task.urgency.toUpperCase()}
              </span>

              <span className={`text-[11px] font-bold flex items-center gap-1 ${
                task.isSynced ? 'text-emerald-700' : 'text-amber-600'
              }`}>
                {task.isSynced ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5 animate-spin-slow" />}
                <span>{task.isSynced ? 'Synced' : 'Queued for sync'}</span>
              </span>
            </div>

            {/* Core Card: WHO, WHY, WHAT */}
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">WHO:</div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {task.patientName} <span className="text-sm font-normal text-slate-500">({task.patientAge} yrs)</span>
              </h3>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{task.village} • {task.householdNumber}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
              <div className="text-[11px] text-slate-400 font-bold uppercase">WHAT TO DO:</div>
              <p className="font-semibold text-slate-900 leading-snug">
                {language === 'mr' ? task.actionRequiredMr : task.actionRequired}
              </p>
              {task.lastVitals && (
                <div className="text-[11px] text-slate-500 pt-1">
                  Last Vitals: BP: {task.lastVitals.bp || 'N/A'} • Hb: {task.lastVitals.hemoglobin || 'N/A'}
                </div>
              )}
            </div>

            {/* Primary Action Buttons (>=56px touch target friendly) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => handleStartVisit(task)}
                className="bg-[#003527] hover:bg-[#064e3b] text-white text-xs font-bold py-3 px-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Log Visit</span>
              </button>

              <button
                onClick={() => {
                  const speech = language === 'mr' ? task.actionRequiredMr : task.actionRequired;
                  bhashiniAI.speakText(`${task.patientName}, ${speech}`, language);
                  showToast('Playing Bhashini audio instruction in Marathi...');
                }}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold py-3 px-3 rounded-2xl border border-emerald-200 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>भाषिणी Audio</span>
              </button>

              <button
                onClick={() => {
                  showToast(`Dialing Otur PHC CHO Anjali Patil for guidance on ${task.patientName}...`);
                  setCurrentView('cho');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3 px-3 rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <PhoneCall className="w-4 h-4 text-emerald-700" />
                <span>Call CHO</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Log Visit Modal Overlay */}
      {selectedTaskForVisit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Log Field Visit: {selectedTaskForVisit.patientName}
                </h3>
                <p className="text-xs text-slate-500">{selectedTaskForVisit.village} • {selectedTaskForVisit.category}</p>
              </div>
              <button onClick={() => setSelectedTaskForVisit(null)} className="text-slate-400 font-bold text-lg p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVisit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    value={recordedVitals.bp}
                    onChange={(e) => setRecordedVitals({ ...recordedVitals, bp: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2 text-sm font-bold text-slate-800"
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Sugar (mg/dL)</label>
                  <input
                    type="text"
                    value={recordedVitals.sugar}
                    onChange={(e) => setRecordedVitals({ ...recordedVitals, sugar: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2 text-sm font-bold text-slate-800"
                    placeholder="110"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Hb (g/dL)</label>
                  <input
                    type="text"
                    value={recordedVitals.hb}
                    onChange={(e) => setRecordedVitals({ ...recordedVitals, hb: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2 text-sm font-bold text-slate-800"
                    placeholder="10.5"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-600 font-bold">Field Observations & Notes</label>
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                      isVoiceRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isVoiceRecording ? 'Recording...' : 'Marathi Voice Note'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={recordedVitals.notes}
                  onChange={(e) => setRecordedVitals({ ...recordedVitals, notes: e.target.value })}
                  placeholder="Enter notes or use voice recording in Marathi..."
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm text-slate-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all"
                >
                  Save & Complete Visit
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTaskForVisit(null)}
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
  );
};
