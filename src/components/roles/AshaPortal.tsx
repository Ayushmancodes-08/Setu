import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { bhashiniAI } from '../../services/bhashiniService';
import { 
  HeartHandshake, 
  UserPlus, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  Mic, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Search, 
  Stethoscope, 
  Activity, 
  Baby, 
  Users,
  X
} from 'lucide-react';

export const AshaPortal: React.FC = () => {
  const { isOnline, setIsOnline, showToast, language, setCurrentView } = useApp();
  const { ashaTasks, completeAshaTask, addAshaTask, registerPatient, patients } = useHealthData();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [isVisitModalOpen, setIsVisitModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);

  // Visit Form state
  const [vitalsBp, setVitalsBp] = useState<string>('138/92');
  const [vitalsHb, setVitalsHb] = useState<string>('8.2');
  const [vitalsSugar, setVitalsSugar] = useState<string>('110');
  const [vitalsWeight, setVitalsWeight] = useState<string>('52');
  const [visitNotes, setVisitNotes] = useState<string>('Mother counseled on IFA tablet compliance and iron-rich diet (spinach, jaggery).');

  // New Registration form state
  const [regName, setRegName] = useState<string>('');
  const [regAge, setRegAge] = useState<number>(24);
  const [regGender, setRegGender] = useState<'Female' | 'Male'>('Female');
  const [regVillage, setRegVillage] = useState<string>('Khamgaon');
  const [regMobile, setRegMobile] = useState<string>('+91 98230 44512');
  const [regCategory, setRegCategory] = useState<'Maternal ANC' | 'NCD Patient' | 'Pediatric'>('Maternal ANC');
  const [regRisk, setRegRisk] = useState<'Low' | 'Moderate' | 'High-Risk'>('High-Risk');

  const filteredTasks = ashaTasks.filter(t => {
    const matchesCat = activeCategory === 'All' || t.category.includes(activeCategory);
    const matchesSearch = !searchQuery || t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || t.village.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenVisit = (task: any) => {
    setSelectedTask(task);
    setIsVisitModalOpen(true);
  };

  const handleSubmitVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    completeAshaTask(selectedTask.id, {
      bp: `${vitalsBp} mmHg`,
      sugar: `${vitalsSugar} mg/dL`,
      hemoglobin: `${vitalsHb} g/dL`,
      weight: `${vitalsWeight} kg`
    }, visitNotes);
    setIsVisitModalOpen(false);
    showToast(`Home visit recorded for ${selectedTask.patientName}. HMIS synced.`);
  };

  const handleRegisterNewBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const newP = await registerPatient({
      name: regName,
      age: regAge,
      gender: regGender,
      mobile: regMobile,
      village: regVillage,
      category: regCategory as any,
      riskLevel: regRisk,
      assignedAsha: 'Manisha Kadam'
    });

    addAshaTask({
      patientName: newP.name,
      patientAge: newP.age,
      village: newP.village,
      category: regCategory as any,
      actionRequired: `First trimester ANC registration & tetanus toxoid check`,
      urgency: 'today'
    });

    setIsRegisterModalOpen(false);
    setRegName('');
    showToast(`Registered ${newP.name} with ABHA ID: ${newP.abhaId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ASHA Field Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">Manisha Kadam (ASHA Sevika)</h1>
                <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-rose-300">
                  Khamgaon Sub-Centre Sector 4
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Catchment Population: <strong>1,420 Residents (284 Households)</strong> • Junnar Taluka, Pune
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Beneficiary</span>
            </button>

            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`text-xs font-bold py-2.5 px-4 rounded-xl border flex items-center gap-1.5 transition-all ${
                isOnline ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
              <span>{isOnline ? 'HMIS Auto-Sync Live' : 'Offline Mode (Local Storage)'}</span>
            </button>
          </div>
        </div>

        {/* Task Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Due Visits Today</span>
            <div className="text-2xl font-black text-slate-900">{ashaTasks.filter(t => !t.completedAt).length} Households</div>
            <span className="text-[11px] text-rose-600 font-bold">2 High-Risk ANC Flagged</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Severe Anemia / Pre-eclampsia</span>
            <div className="text-2xl font-black text-red-600">3 Cases</div>
            <span className="text-[11px] text-slate-500">Under Junnar RH teleconsult</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Child Immunization Due</span>
            <div className="text-2xl font-black text-blue-600">4 Children</div>
            <span className="text-[11px] text-slate-500">MR-1 & Pentavalent</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed & Synced</span>
            <div className="text-2xl font-black text-emerald-700">{ashaTasks.filter(t => t.completedAt).length} Visits</div>
            <span className="text-[11px] text-emerald-600 font-bold">100% Uploaded</span>
          </div>
        </div>

        {/* Task Filter & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
              {['All', 'Maternal ANC', 'Postnatal PNC', 'NCD', 'Child Immunization'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search beneficiary or household..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              />
            </div>

          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => {
              const isDone = !!task.completedAt;
              return (
                <div
                  key={task.id}
                  className={`rounded-2xl border p-4 flex flex-col justify-between space-y-3 transition-all ${
                    isDone 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : task.category.includes('ANC') 
                      ? 'bg-white border-rose-200 hover:border-rose-400 shadow-xs' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">
                        {task.householdNumber}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isDone 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : task.urgency === 'overdue' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isDone ? 'Completed' : task.urgency.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{task.patientName}</h4>
                      <p className="text-xs text-slate-500">{task.patientAge}y • {task.village} • {task.category}</p>
                    </div>

                    <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                      <strong>Action:</strong> {task.actionRequired}
                    </div>

                    {task.lastVitals && (
                      <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded-lg border border-slate-200 text-[11px]">
                        <div>BP: <strong className="text-slate-900">{task.lastVitals.bp}</strong></div>
                        <div>Hb: <strong className="text-red-700">{task.lastVitals.hemoglobin}</strong></div>
                        <div>Sugar: <strong className="text-slate-900">{task.lastVitals.sugar}</strong></div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    {!isDone ? (
                      <button
                        onClick={() => handleOpenVisit(task)}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Log Home Visit & Vitals</span>
                      </button>
                    ) : (
                      <div className="flex-1 text-center py-1.5 text-xs text-emerald-700 font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Visit Completed & Synced</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MODAL: LOG HOME VISIT */}
      {isVisitModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Log Household Visit & Vitals</h3>
                <p className="text-xs text-slate-500">{selectedTask.patientName} ({selectedTask.householdNumber})</p>
              </div>
              <button 
                onClick={() => setIsVisitModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitVisit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    value={vitalsBp}
                    onChange={(e) => setVitalsBp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 font-mono"
                    placeholder="120/80"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Hemoglobin Hb (g/dL)</label>
                  <input
                    type="text"
                    value={vitalsHb}
                    onChange={(e) => setVitalsHb(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 font-mono"
                    placeholder="11.5"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Random Blood Sugar (mg/dL)</label>
                  <input
                    type="text"
                    value={vitalsSugar}
                    onChange={(e) => setVitalsSugar(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 font-mono"
                    placeholder="110"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Body Weight (kg)</label>
                  <input
                    type="text"
                    value={vitalsWeight}
                    onChange={(e) => setVitalsWeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 font-mono"
                    placeholder="52"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold text-xs block mb-1">Counseling Given & Field Observations</label>
                <textarea
                  rows={3}
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium"
                  placeholder="Record nutritional guidance, IFA tablet count handed over, or warning symptoms..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Visit & Sync HMIS</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: REGISTER NEW BENEFICIARY */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Register New Rural Beneficiary</h3>
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterNewBeneficiary} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name (नाव)</label>
                <input
                  type="text"
                  placeholder="e.g. Kavita Sachin Jadhav"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Age</label>
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Gender</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Village (गाव)</label>
                  <input
                    type="text"
                    value={regVillage}
                    onChange={(e) => setRegVillage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Mobile Contact</label>
                  <input
                    type="text"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Health Category</label>
                  <select
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="Maternal ANC">Maternal ANC (Pregnant)</option>
                    <option value="NCD Patient">NCD (Hypertension/Diabetes)</option>
                    <option value="Pediatric">Pediatric (Infant/Child)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Initial Risk Level</label>
                  <select
                    value={regRisk}
                    onChange={(e) => setRegRisk(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="High-Risk">High-Risk (Flagged)</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Low">Low / Routine</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md"
                >
                  Generate ABHA & Create Beneficiary Profile
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
