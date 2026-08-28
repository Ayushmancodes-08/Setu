import React from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { Role } from '../../types';
import { 
  HeartHandshake, 
  Stethoscope, 
  Layers, 
  Activity, 
  Building2, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Lock,
  UserCheck,
  Sparkles,
  Users
} from 'lucide-react';

interface PrimaryRole {
  id: Role;
  titleEn: string;
  titleMr: string;
  roleBadge: string;
  description: string;
  icon: any;
  capabilities: string[];
  themeColor: string;
  badgeColor: string;
  btnColor: string;
}

const PRIMARY_SETU_ROLES: PrimaryRole[] = [
  {
    id: 'patient',
    titleEn: '1. Citizen & Patient Portal',
    titleMr: 'नागरिक व रुग्ण पोर्टल',
    roleBadge: 'Primary Role • Citizen Layer',
    description: 'Empowers rural patients with Setu AI health guidance, digital health profile, medication schedules, report explanations, nearby healthcare facility discovery, and 1-tap SOS.',
    icon: Activity,
    capabilities: [
      'Setu AI Conversational Health Guidance & Triage',
      'Digital Health Profile & Chronic BP/Sugar Tracking',
      'Understand Your Report & Reference Ranges',
      'Government Scheme Discovery & Eligibility Check',
      'Medication Reminders & Safety Checks',
      '1-Tap Emergency Assistance & ASHA Linkage'
    ],
    themeColor: 'border-teal-300 bg-gradient-to-b from-teal-50/50 to-white ring-1 ring-teal-200',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    btnColor: 'bg-teal-700 hover:bg-teal-800'
  },
  {
    id: 'asha',
    titleEn: '2. ASHA / CHO Field Worker Portal',
    titleMr: 'आशा व समुदाय आरोग्य अधिकारी पोर्टल',
    roleBadge: 'Primary Role • Field Layer',
    description: 'Task-first mobile workbench for frontline village health workers. Manage household registries, record vitals, conduct one-screen visits with AI triage, and work 100% offline.',
    icon: HeartHandshake,
    capabilities: [
      'Task-First Daily Queue (Urgent, Follow-ups, Visits)',
      'One-Screen Field Visit & Triage Workflow',
      '100% Offline-First Engine with Local Sync Queue',
      'New Citizen & Household Registration',
      'High-Risk Maternal ANC & Child Immunization Roster',
      'Specialist Referrals to PHC & Rural Hospital'
    ],
    themeColor: 'border-rose-300 bg-gradient-to-b from-rose-50/50 to-white ring-1 ring-rose-200',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    btnColor: 'bg-rose-700 hover:bg-rose-800'
  },
  {
    id: 'dho',
    titleEn: '3. District Health Officer (DHO) Portal',
    titleMr: 'जिल्हा आरोग्य अधिकारी कन्सोल',
    roleBadge: 'Primary Role • District Intelligence',
    description: 'High-level public health surveillance and population analytics. Monitor district disease trends, view geographic block-level maps, track ASHA performance, and broadcast directives.',
    icon: ShieldAlert,
    capabilities: [
      'Population-Level Analytics (1,24,820 Citizens Monitored)',
      'Geographic Visual Map & Village Risk Heatmap',
      'Automated IDSP Epidemic & Disease Cluster Alerts',
      'NCD & Maternal Health Indicator Trends',
      'ASHA / CHO Field Coverage & Follow-Up Tracking',
      'Broadcast Administrative Directives to PHCs'
    ],
    themeColor: 'border-red-300 bg-gradient-to-b from-red-50/50 to-white ring-1 ring-red-200',
    badgeColor: 'bg-red-100 text-red-900 border-red-300',
    btnColor: 'bg-red-700 hover:bg-red-800'
  }
];

export const RolePortalsSection: React.FC = () => {
  const { t } = useApp();
  const { openRoleAuthModal } = useHealthData();

  return (
    <section id="role-portals-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5 text-emerald-800" />
            <span>{t.authorizedConsoles}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            {t.rolePortalsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.rolePortalsSubtitle}
          </p>
        </div>

        {/* 3 Primary Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRIMARY_SETU_ROLES.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                className={`bg-white rounded-3xl border ${portal.themeColor} p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-5 hover:-translate-y-1 group`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3.5 rounded-2xl bg-white text-slate-800 shadow-sm border border-slate-200 group-hover:bg-[#003527] group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${portal.badgeColor}`}>
                      {portal.roleBadge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-lg text-slate-900 leading-tight">
                      {(t as any)[`role_${portal.id}`] || portal.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                      {portal.description}
                    </p>
                  </div>

                  {/* Capabilities List */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">{t.details}</span>
                    {portal.capabilities.map((cap, cidx) => (
                      <div key={cidx} className="flex items-start gap-2 text-xs text-slate-700 font-medium leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch Button with IndexedDB Authentication */}
                <button
                  onClick={() => openRoleAuthModal(portal.id)}
                  className={`w-full ${portal.btnColor} text-white font-black py-3.5 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02]`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t.openPortal}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            );
          })}
        </div>

        {/* Secondary Supporting Actor Bridges */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{t.supportingConsoles}:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openRoleAuthModal('doctor')}
              className="text-blue-700 hover:text-blue-800 font-bold hover:underline"
            >
              {t.role_doctor} →
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => openRoleAuthModal('cho')}
              className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
            >
              {t.role_cho} →
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => openRoleAuthModal('facility')}
              className="text-indigo-700 hover:text-indigo-800 font-bold hover:underline"
            >
              {t.role_facility} →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
