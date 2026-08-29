import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { 
  Building2, 
  Bed, 
  Activity, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  Navigation,
  Send,
  Users,
  X,
  Truck
} from 'lucide-react';
import { KpiCard, QuickAction, ActivityFeed, AlertBanner, SectionHeader, ProgressBar, ActivityItem } from '../common/DashboardWidgets';

export const FacilityPortal: React.FC = () => {
  const { showToast, language, t } = useApp();
  const { facilities, referrals, updateFacilityBeds, updateReferralStatus } = useHealthData();

  const activeHospital = facilities.find(f => f.id === 'fac-01') || facilities[0];

  const [generalBedsFree, setGeneralBedsFree] = useState<number>(activeHospital.availableBeds);
  const [icuBedsFree, setIcuBedsFree] = useState<number>(activeHospital.icuBedsAvailable);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bed_manager' | 'incoming_referrals' | 'ambulance_dispatch' | 'duty_roster'>('dashboard');

  // Ambulance Dispatch State
  const [ambulances, setAmbulances] = useState<Array<{
    id: string;
    vehicleNo: string;
    driverName: string;
    status: 'Available at Base' | 'En Route to Emergency' | 'Patient On-Board' | 'Returning to Base';
    assignedCase: string;
    eta: string;
  }>>([
    { id: 'amb-1', vehicleNo: 'MH-14-AH-2918', driverName: 'Sunil Gade', status: 'En Route to Emergency', assignedCase: 'Toranmal Cardiac Transfer', eta: '12 Mins' },
    { id: 'amb-2', vehicleNo: 'MH-14-BT-1102', driverName: 'Sachin Shinde', status: 'Available at Base', assignedCase: 'Junnar Rural Hospital Base', eta: 'Ready' }
  ]);

  const handleAdmitPatient = () => {
    if (generalBedsFree <= 0) {
      showToast('No general beds free. Alert DHO for diversion.');
      return;
    }
    const newCount = generalBedsFree - 1;
    setGeneralBedsFree(newCount);
    updateFacilityBeds(activeHospital.id, { availableBeds: newCount });
    showToast(`Admitted patient to General Ward. ${newCount} beds remaining.`);
  };

  const handleDischargePatient = () => {
    const newCount = Math.min(activeHospital.totalBeds, generalBedsFree + 1);
    setGeneralBedsFree(newCount);
    updateFacilityBeds(activeHospital.id, { availableBeds: newCount });
    showToast(`Patient discharged. General beds free: ${newCount}`);
  };

  const handleToggleIcuBed = (delta: number) => {
    const newIcu = Math.max(0, icuBedsFree + delta);
    setIcuBedsFree(newIcu);
    updateFacilityBeds(activeHospital.id, { icuBedsAvailable: newIcu });
    showToast(`ICU Bed count updated: ${newIcu} available.`);
  };

  const handleAcceptReferral = (refId: string, patientName: string) => {
    updateReferralStatus(refId, 'RECEIVED');
    showToast(`Referral for ${patientName} marked as Received & Admitted.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Facility Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-700 text-white flex items-center justify-center text-xl font-bold shadow-md">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">{t.facilityOpsTitle}</h1>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-300">
                  {t.role_facility}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeHospital.taluka}, {activeHospital.district} • Contact: <strong>{activeHospital.contactNumber}</strong> • 24x7 Emergency Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{t.oxygenStatusAvailable}</span>
            </span>
          </div>
        </div>

        {/* Live Bed Counters Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.generalBedsAvailable}</span>
            <div className="text-2xl font-black text-slate-900">{generalBedsFree} / {activeHospital.totalBeds}</div>
            <div className="flex gap-1.5 pt-1">
              <button
                onClick={handleAdmitPatient}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-[11px] px-2.5 py-1 rounded-lg border border-indigo-200"
              >
                + Admit
              </button>
              <button
                onClick={handleDischargePatient}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2.5 py-1 rounded-lg border border-slate-300"
              >
                - Discharge
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">ICU / Ventilator Free</span>
            <div className="text-2xl font-black text-blue-700">{icuBedsFree} Beds</div>
            <div className="flex gap-1.5 pt-1">
              <button
                onClick={() => handleToggleIcuBed(-1)}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[11px] px-2.5 py-1 rounded-lg border border-blue-200"
              >
                Occupy
              </button>
              <button
                onClick={() => handleToggleIcuBed(1)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2.5 py-1 rounded-lg border border-slate-300"
              >
                Release
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Incoming Emergencies</span>
            <div className="text-2xl font-black text-red-600">{referrals.length} Cases</div>
            <span className="text-[11px] text-red-600 font-medium">108 Ambulances En Route</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Oxygen Purity</span>
            <div className="text-2xl font-black text-emerald-700">99.4%</div>
            <span className="text-[11px] text-emerald-600 font-bold">PSA Generator Normal</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: Activity },
            { id: 'bed_manager', label: 'Ward & Bed Management', icon: Bed },
            { id: 'incoming_referrals', label: 'Incoming Referrals', icon: Send, count: referrals.length },
            { id: 'ambulance_dispatch', label: '108 Ambulance Fleet', icon: Navigation, count: ambulances.length },
            { id: 'duty_roster', label: 'Specialist Roster', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-700 text-white shadow-xs'
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

        {/* TAB 0: FACILITY COMMAND CENTER DASHBOARD */}
        {activeTab === 'dashboard' && (() => {
          const urgentReferrals = referrals.filter(r => r.urgency === 'red' || r.urgency === 'amber');
          const availableAmbs = ambulances.filter(a => a.status === 'Available at Base');

          const facilityActivity: ActivityItem[] = [
            { id: 'f-1', icon: '🚑', title: '108 Ambulance Dispatched', sub: 'MH-14-AH-2918 · Toranmal Cardiac Transfer (ETA 12m)', time: '5m ago', badge: 'Active Run', badgeColor: 'red' },
            { id: 'f-2', icon: '🛏️', title: 'Maternity Bed Reserved', sub: 'Sunita Shinde (Pre-eclampsia referral from ASHA)', time: '20m ago', badge: 'Admitted', badgeColor: 'emerald' },
            { id: 'f-3', icon: '💨', title: 'Oxygen Plant Purity Verified', sub: '99.4% PSA Oxygen · 500 LPM Pressure Steady', time: '1h ago', badge: 'Normal', badgeColor: 'blue' },
            { id: 'f-4', icon: '🩺', title: 'Specialist On-Call Joined', sub: 'Dr. Rohini Kulkarni (MD ObGyn) · OPD Room 4', time: '2h ago', badge: 'On Duty', badgeColor: 'purple' },
            { id: 'f-5', icon: '🏥', title: 'Ward Patient Discharged', sub: 'General Medicine Bed #14 freed for new intake', time: '3h ago', badge: 'Discharged', badgeColor: 'emerald' }
          ];

          return (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard
                  label="General Beds Free"
                  value={generalBedsFree}
                  suffix={` / ${activeHospital.totalBeds}`}
                  icon={Bed}
                  iconColor="text-indigo-600"
                  iconBg="bg-indigo-100"
                  trend={generalBedsFree < 5 ? 'down' : 'up'}
                  trendLabel={generalBedsFree < 5 ? 'High Census' : 'Adequate'}
                  urgency={generalBedsFree <= 2 ? 'critical' : 'normal'}
                  onClick={() => setActiveTab('bed_manager')}
                />
                <KpiCard
                  label="ICU / Ventilator Free"
                  value={icuBedsFree}
                  suffix=" Beds"
                  icon={Activity}
                  iconColor="text-blue-600"
                  iconBg="bg-blue-100"
                  trend="flat"
                  trendLabel="3 Total"
                  urgency={icuBedsFree === 0 ? 'critical' : 'normal'}
                  onClick={() => setActiveTab('bed_manager')}
                />
                <KpiCard
                  label="Incoming Referrals"
                  value={referrals.length}
                  icon={Send}
                  iconColor="text-red-600"
                  iconBg="bg-red-100"
                  trend="up"
                  trendLabel="108 En route"
                  urgency={urgentReferrals.length > 0 ? 'warning' : 'normal'}
                  onClick={() => setActiveTab('incoming_referrals')}
                />
                <KpiCard
                  label="108 Fleet Ready"
                  value={availableAmbs.length}
                  suffix={` / ${ambulances.length}`}
                  icon={Navigation}
                  iconColor="text-emerald-600"
                  iconBg="bg-emerald-100"
                  trend="flat"
                  trendLabel="GPS Active"
                  onClick={() => setActiveTab('ambulance_dispatch')}
                />
              </div>

              {/* Facility Alert Banners */}
              <div className="space-y-2">
                {urgentReferrals.length > 0 && (
                  <AlertBanner
                    type="critical"
                    title="🚨 Urgent Inbound Emergency Transfer"
                    message="High-risk obstetrics referral en route from Otur Spoke. Emergency Trauma team standby activated."
                    action={{ label: 'View Inbound', onClick: () => setActiveTab('incoming_referrals') }}
                  />
                )}
                <AlertBanner
                  type="info"
                  title="PSA Oxygen Plant Generator Online"
                  message="99.4% medical oxygen purity with 48-hour backup cylinder manifold at full charge."
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <SectionHeader title="Hospital Operations Quick Actions" sub="Direct triage and hospital control" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <QuickAction
                    icon={Bed}
                    label="Admit Patient"
                    sub="Ward bed allocation"
                    color="bg-indigo-700 text-white"
                    onClick={handleAdmitPatient}
                  />
                  <QuickAction
                    icon={Truck}
                    label="Dispatch 108"
                    sub="Ambulance tracking"
                    color="bg-red-600 text-white"
                    onClick={() => setActiveTab('ambulance_dispatch')}
                    pulse={ambulances.some(a => a.status === 'En Route to Emergency')}
                  />
                  <QuickAction
                    icon={Send}
                    label="Accept Referral"
                    sub="Inbound casualty"
                    color="bg-amber-600 text-white"
                    onClick={() => setActiveTab('incoming_referrals')}
                  />
                  <QuickAction
                    icon={Users}
                    label="Staff Roster"
                    sub="Specialist on-call"
                    color="bg-slate-800 text-white"
                    onClick={() => setActiveTab('duty_roster')}
                  />
                </div>
              </div>

              {/* Activity Stream and Ward Census */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                  <SectionHeader
                    title="Hospital Command Log"
                    sub="Real-time admissions, discharges & trauma alerts"
                    action={<button onClick={() => setActiveTab('incoming_referrals')} className="text-xs text-indigo-700 font-bold hover:underline">View Referrals</button>}
                  />
                  <ActivityFeed items={facilityActivity} maxItems={5} />
                </div>

                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <SectionHeader title="Ward Bed Utilization" sub="Junnar Rural Hospital Capacity" />
                  <ProgressBar value={activeHospital.totalBeds - generalBedsFree} max={activeHospital.totalBeds} color="bg-indigo-500" label={`General Ward (${Math.round(((activeHospital.totalBeds - generalBedsFree) / activeHospital.totalBeds) * 100)}%)`} />
                  <ProgressBar value={activeHospital.icuBedsAvailable - icuBedsFree} max={activeHospital.icuBedsAvailable || 3} color="bg-red-500" label="ICU / Ventilator Ward" />
                  <ProgressBar value={100} max={100} color="bg-emerald-500" label="Trauma OT Readiness (100%)" />
                  <ProgressBar value={94} max={100} color="bg-teal-500" label="Emergency Drug Stock (94%)" />

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Facility Accreditation</span>
                    <span className="font-black text-indigo-800">NQAS Certified Hub</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 1: BED MANAGER */}
        {activeTab === 'bed_manager' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Ward-Level Bed Capacity Allocation</h3>
              <p className="text-xs text-slate-500">Live census of hospital departments at Junnar Rural Hospital.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Maternity & Labor Ward', total: 16, free: 4, type: 'ANC / Deliveries' },
                { name: 'Intensive Care Unit (ICU)', total: 6, free: icuBedsFree, type: 'Ventilator & Monitors' },
                { name: 'Trauma & Emergency HDU', total: 8, free: 2, type: 'Accident & Resuscitation' },
                { name: 'Female General Medical Ward', total: 10, free: Math.floor(generalBedsFree / 2), type: 'Inpatient Medicine' },
                { name: 'Male General Medical Ward', total: 10, free: Math.ceil(generalBedsFree / 2), type: 'Inpatient Medicine' }
              ].map((ward, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{ward.name}</div>
                      <div className="text-[11px] text-slate-500">{ward.type}</div>
                    </div>
                    <span className="text-[11px] font-black bg-white px-2 py-0.5 rounded border border-slate-200">
                      {ward.free} / {ward.total} Free
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full" 
                      style={{ width: `${((ward.total - ward.free) / ward.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INCOMING REFERRALS */}
        {activeTab === 'incoming_referrals' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Incoming Rural Referrals & Bed Reservations</h3>
                <p className="text-xs text-slate-500">Transfers initiated by Sub-Centres and PHCs across Junnar taluka.</p>
              </div>
            </div>

            <div className="space-y-3">
              {referrals.map((ref) => (
                <div key={ref.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-slate-300">
                        {ref.referralCode}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900">{ref.patientName}</h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        ref.urgency === 'red' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ref.urgency}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      From: <strong>{ref.referringFacilityName}</strong> ({ref.referringProviderName}) • Target Specialty: <strong>{ref.targetSpecialty}</strong>
                    </div>

                    <div className="text-xs text-slate-700 bg-white p-2 rounded-xl border border-slate-200 font-medium">
                      <strong>Clinical Reason:</strong> {ref.reasonForReferral}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ref.status !== 'RECEIVED' ? (
                      <button
                        onClick={() => handleAcceptReferral(ref.id, ref.patientName)}
                        className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Allocate Bed</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        Bed Allocated / Admitted
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 108 AMBULANCE FLEET */}
        {activeTab === 'ambulance_dispatch' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">108 Emergency Ambulance GPS & Fleet Command</h3>
                <p className="text-xs text-slate-500">Real-time telemetry and emergency dispatch for Junnar & Ambegaon sectors.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ambulances.map((amb) => (
                <div key={amb.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-red-600 text-white">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-mono font-black text-sm text-slate-900">{amb.vehicleNo}</div>
                        <div className="text-xs text-slate-500">Pilot: {amb.driverName}</div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      amb.status === 'Available at Base' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800 animate-pulse'
                    }`}>
                      {amb.status}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div>Active Mission: <strong>{amb.assignedCase}</strong></div>
                    <div className="text-slate-500">ETA to Destination: <strong className="text-red-700">{amb.eta}</strong></div>
                  </div>

                  <button
                    onClick={() => showToast(`Contacting Pilot ${amb.driverName} (${amb.vehicleNo}) via direct radio dispatch.`)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs transition-colors"
                  >
                    Radio Dispatch Call
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DUTY SPECIALIST ROSTER */}
        {activeTab === 'duty_roster' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Hospital Specialist On-Duty Roster</h3>
              <p className="text-xs text-slate-500">Current clinical shift coverage at Junnar Trauma Hub.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Dr. Rohini Kulkarni', role: 'Obstetrician & Gynecologist', shift: 'Morning Shift (08:00 - 16:00)', status: 'Active on Tele-Hub' },
                { name: 'Dr. Sandeep Ghule', role: 'General Physician & Trauma', shift: 'Morning Shift (08:00 - 16:00)', status: 'In Emergency OPD' },
                { name: 'Dr. Chetan Padvi', role: 'Pediatric Specialist', shift: 'On-Call Teleconsult', status: 'Available' },
                { name: 'Staff Nurse Sunita Patil', role: 'Labor Room In-Charge', shift: '24h Emergency Wing', status: 'On-Duty' }
              ].map((doc, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
                  <div className="font-extrabold text-sm text-slate-900">{doc.name}</div>
                  <div className="text-xs text-indigo-700 font-semibold">{doc.role}</div>
                  <div className="text-[11px] text-slate-500">{doc.shift}</div>
                  <span className="inline-block text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
