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
  UserCheck
} from 'lucide-react';

interface PortalCard {
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

const PORTALS: PortalCard[] = [
  {
    id: 'patient',
    titleEn: 'Citizen & Patient Portal',
    titleMr: 'नागरिक व रुग्ण पोर्टल',
    roleBadge: 'Public / Beneficiary Access',
    description: 'Digital Health Locker for ABHA card management, real-time prescription tracking, teleconsultation token status, and government health scheme claim submissions.',
    icon: Activity,
    capabilities: ['ABHA Health Locker & QR Verification', 'Active e-Prescriptions with Marathi Audio Guide', 'Live Teleconsultation Video Room', 'Verified Lab Reports & Scheme Pre-auth'],
    themeColor: 'border-teal-200 bg-teal-50/20',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    btnColor: 'bg-teal-700 hover:bg-teal-800'
  },
  {
    id: 'asha',
    titleEn: 'ASHA Frontline Field Worker',
    titleMr: 'आशा सेविका फील्ड पोर्टल',
    roleBadge: 'Community Frontline Level',
    description: 'High-speed mobile interface for rural home visits, high-risk maternal (ANC/PNC) tracking, child immunization rosters, and offline HMIS data synchronization.',
    icon: HeartHandshake,
    capabilities: ['Household Registry & Offline Visit Logger', 'ANC High-Risk Flagging (Severe Anemia & Pre-eclampsia)', 'Child Immunization Scheduler', 'Marathi Speech-to-Text Clinical Dictation'],
    themeColor: 'border-rose-200 bg-rose-50/20',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    btnColor: 'bg-rose-700 hover:bg-rose-800'
  },
  {
    id: 'cho',
    titleEn: 'Community Health Officer (CHO)',
    titleMr: 'समुदाय आरोग्य अधिकारी (CHO)',
    roleBadge: 'Ayushman Arogya Mandir Spoke',
    description: 'Sub-Centre spoke triage terminal for walk-in outpatient screening, point-of-care rapid diagnostics, and initiating e-Sanjeevani teleconsultation with hub doctors.',
    icon: Stethoscope,
    capabilities: ['Sub-Centre Triage & Vital Recording', 'Initiate Assisted e-Sanjeevani Teleconsult', 'Rapid Diagnostic Kit (Malaria/Hb) Log', 'Sub-Centre Drug Kit Dispensing Tracker'],
    themeColor: 'border-emerald-200 bg-emerald-50/20',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    btnColor: 'bg-emerald-700 hover:bg-emerald-800'
  },
  {
    id: 'doctor',
    titleEn: 'Specialist Medical Officer Console',
    titleMr: 'तज्ज्ञ डॉक्टर कन्सोल',
    roleBadge: 'Rural Hospital Hub Level',
    description: 'Clinical teleconsultation workbench for evaluating queued rural cases, issuing digital e-prescriptions, ordering laboratory investigations, and executing specialty referrals.',
    icon: Stethoscope,
    capabilities: ['Interactive Teleconsultation Queue', 'Digital e-Prescription Builder & ABHA Signing', 'One-Click Laboratory Requisition', 'Specialty Referral with Bed Allocation'],
    themeColor: 'border-blue-200 bg-blue-50/20',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    btnColor: 'bg-blue-700 hover:bg-blue-800'
  },
  {
    id: 'pharmacist',
    titleEn: 'Pharmacy & e-Aushadhi Officer',
    titleMr: 'औषध निर्माण व साठा कक्ष',
    roleBadge: 'Facility Pharmacy / Chemist',
    description: 'Dispensing console for fulfilling doctor e-prescriptions, managing essential drug inventory, tracking batch expiry dates, and placing electronic stock indents.',
    icon: Layers,
    capabilities: ['Real-Time e-Prescription Dispensing Queue', 'Batch & Expiry Date Verification', 'Stock-Out Prevention & Low-Stock Alerts', 'Emergency Indent to District Warehouse'],
    themeColor: 'border-amber-200 bg-amber-50/20',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    btnColor: 'bg-amber-700 hover:bg-amber-800'
  },
  {
    id: 'lab',
    titleEn: 'Diagnostic Laboratory Wing',
    titleMr: 'प्रयोगशाळा तंत्रज्ञ पोर्टल',
    roleBadge: 'PHC / Hospital Diagnostic Lab',
    description: 'Laboratory Information System (LIS) for managing diagnostic test requisitions, logging biochemistry & hematology findings, and triggering critical panic value alerts.',
    icon: Activity,
    capabilities: ['Diagnostic Test Requisition Tracker', 'Result Value Entry & Normal Range Verification', 'Automated Critical Panic Value Alarms', 'Immediate Sync with Patient Health Record'],
    themeColor: 'border-purple-200 bg-purple-50/20',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    btnColor: 'bg-purple-700 hover:bg-purple-800'
  },
  {
    id: 'facility',
    titleEn: 'Hospital Bed & 108 Command',
    titleMr: 'रुग्णालय व रुग्णवाहिका समन्वय',
    roleBadge: 'Civil & Rural Hospital Ops',
    description: 'Hospital bed capacity dashboard managing ICU, HDU, and general bed allocation, incoming emergency transfers, and 108 ambulance dispatch coordination.',
    icon: Building2,
    capabilities: ['Live ICU, HDU & General Ward Bed Allocation', 'Incoming Specialty Transfer Acceptance', '108 Emergency Ambulance GPS & Dispatch', 'Clinical Duty Specialist Roster'],
    themeColor: 'border-indigo-200 bg-indigo-50/20',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    btnColor: 'bg-indigo-700 hover:bg-indigo-800'
  },
  {
    id: 'dho',
    titleEn: 'District Health Officer (DHO)',
    titleMr: 'जिल्हा आरोग्य अधिकारी कन्सोल',
    roleBadge: 'District Public Health Admin',
    description: 'High-level public health surveillance console for tracking taluka disease outbreaks, maternal health audits, facility stockouts, and issuing administrative directives.',
    icon: ShieldAlert,
    capabilities: ['Taluka Outbreak Heatmap & Disease Clustering', 'Maternal Death & High-Risk Anemia Audits', 'District Drug Stockout Emergency Indents', 'Export HMIS Monthly Directorate Reports'],
    themeColor: 'border-red-200 bg-red-50/20',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    btnColor: 'bg-red-700 hover:bg-red-800'
  }
];

export const RolePortalsSection: React.FC = () => {
  const { language } = useApp();
  const { openRoleAuthModal } = useHealthData();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5 text-emerald-800" />
            <span>Role-Based Health Operation Workbenches</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Dedicated Portals for Every Healthcare Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Click any portal below to authenticate via IndexedDB and access the live role console.
          </p>
        </div>

        {/* 8 Portals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                className={`bg-white rounded-3xl border ${portal.themeColor} p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 hover:-translate-y-1 group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-100 text-slate-800 group-hover:bg-[#003527] group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${portal.badgeColor}`}>
                      {portal.roleBadge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                      {language === 'mr' ? portal.titleMr : portal.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {portal.description}
                    </p>
                  </div>

                  {/* Capabilities List */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Key Tools</span>
                    {portal.capabilities.map((cap, cidx) => (
                      <div key={cidx} className="flex items-start gap-1.5 text-[11px] text-slate-700 font-medium leading-tight">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch Button with IndexedDB Authentication */}
                <button
                  onClick={() => openRoleAuthModal(portal.id)}
                  className={`w-full ${portal.btnColor} text-white font-bold py-3 rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate & Launch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
