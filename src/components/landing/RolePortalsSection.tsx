import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { 
  User, 
  HeartHandshake, 
  Stethoscope, 
  Layers, 
  FlaskConical, 
  Building2, 
  ShieldAlert, 
  ArrowRight,
  Activity,
  Sparkles
} from 'lucide-react';

interface PortalCard {
  role: Role;
  titleEn: string;
  titleMr: string;
  titleHi: string;
  badge: string;
  tagline: string;
  icon: any;
  color: string;
  bgGradient: string;
  keyFeatures: string[];
}

export const RolePortalsSection: React.FC = () => {
  const { language, setCurrentView } = useApp();

  const portals: PortalCard[] = [
    {
      role: 'patient',
      titleEn: 'Patient / Citizen Care Hub',
      titleMr: 'रुग्ण / नागरिक आरोग्य पोर्टल',
      titleHi: 'मरीज / नागरिक स्वास्थ्य पोर्टल',
      badge: 'Citizen Access',
      tagline: 'Assisted teleconsultations, ABHA longitudinal records, OPD token status, and medicine availability at nearby PHCs.',
      icon: User,
      color: 'text-teal-600',
      bgGradient: 'from-teal-500/10 to-emerald-500/5',
      keyFeatures: ['Book e-Sanjeevani Teleconsult', 'Digital Triage & Red Flag Assessment', 'Download ABHA Health Records & e-Rx', 'Emergency 108 Geo-SOS Broadcast']
    },
    {
      role: 'asha',
      titleEn: 'ASHA Worker Field Console',
      titleMr: 'आशा सेविका फील्ड कमांड सेंटर',
      titleHi: 'आशा कार्यकर्ता फील्ड कंसोल',
      badge: 'Offline-First PWA',
      tagline: 'Offline task queue (Overdue, Today, Upcoming), High-risk maternal ANC tracking, Marathi voice notes, and instant sync.',
      icon: HeartHandshake,
      color: 'text-pink-600',
      bgGradient: 'from-pink-500/10 to-rose-500/5',
      keyFeatures: ['Offline Task Queue (Overdue / Today)', 'High-Risk Maternal & NCD Logging', 'Marathi & Hindi Voice Dictation', '1-Tap Escalation to CHO Teleconsult']
    },
    {
      role: 'cho',
      titleEn: 'CHO / Medical Officer Hub',
      titleMr: 'समुदाय आरोग्य अधिकारी (CHO/MO)',
      titleHi: 'सीएचओ / चिकित्सा अधिकारी केंद्र',
      badge: 'Sub-Centre / PHC',
      tagline: 'Digital clinical triage tool, OPD token queue, e-Sanjeevani teleconsultation launcher, and verified referral dispatch.',
      icon: Stethoscope,
      color: 'text-emerald-600',
      bgGradient: 'from-emerald-500/10 to-teal-500/5',
      keyFeatures: ['Digital Clinical Triage Engine', 'Live Spoke Telemedicine Room', 'Referral Pathway Generator with Bed Status', 'Local Stock-out Notification Trigger']
    },
    {
      role: 'doctor',
      titleEn: 'Specialist Consultation Workbench',
      titleMr: 'तज्ज्ञ वैद्यकीय अधिकारी वर्कबेंच',
      titleHi: 'विशेषज्ञ डॉक्टर परामर्श वर्कबेंच',
      badge: 'Clinical Workbench',
      tagline: 'e-Sanjeevani video consultation, longitudinal EHR viewer, e-Prescription with dosage validation, and specialist notes.',
      icon: Activity,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500/10 to-indigo-500/5',
      keyFeatures: ['Live Video Teleconsultation Room', 'Integrated Longitudinal EHR Review', 'e-Prescription & Drug Safety Check', 'Counter-Referral Loop Closure']
    },
    {
      role: 'pharmacist',
      titleEn: 'Pharmacist & Drug Inventory',
      titleMr: 'औषध निर्माण अधिकारी (फार्मासिस्ट)',
      titleHi: 'फार्मासिस्ट एवं दवा इन्वेंटरी',
      badge: 'Transactional Inventory',
      tagline: 'Batch-level medicine ledger, real-time stock levels, low-stock & expiry warnings, and District Drug Store indenting.',
      icon: Layers,
      color: 'text-amber-600',
      bgGradient: 'from-amber-500/10 to-orange-500/5',
      keyFeatures: ['Batch-Wise Drug Stock Ledger', 'Instant Prescription Dispensing Counter', 'Stock-Out & Low Inventory Alerts', 'Requisition Order to District Drug Store']
    },
    {
      role: 'lab',
      titleEn: 'Diagnostic Laboratory Hub',
      titleMr: 'प्रयोगशाळा निदान केंद्र (Lab Tech)',
      titleHi: 'जांच प्रयोगशाला केंद्र',
      badge: 'Diagnostics & Panic Alerts',
      tagline: 'Sample accessioning barcode queue, multi-test result entry (CBC, Malaria, TB Sputum), and panic value alerts.',
      icon: FlaskConical,
      color: 'text-purple-600',
      bgGradient: 'from-purple-500/10 to-violet-500/5',
      keyFeatures: ['Barcode Sample Collection Queue', 'Direct Result Entry & Validation', 'Critical Panic Value Alert Broadcaster', 'Reagent Stock & Equipment Status']
    },
    {
      role: 'facility',
      titleEn: 'Facility Operations Coordinator',
      titleMr: 'रुग्णालय व्यवस्थापन समन्वयक',
      titleHi: 'अस्पताल प्रबंधन समन्वयक',
      badge: 'Facility Command',
      tagline: 'Live bed occupancy grid, staff on-duty shift matrix, OPD queue flow management, and inter-facility transfer logistics.',
      icon: Building2,
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-500/10 to-blue-500/5',
      keyFeatures: ['Real-Time Bed Occupancy Heat-Grid', 'Staff Duty Shift & Roster Matrix', 'OPD Wait Time & Queue Flow Control', 'Resource & Maintenance Requisitions']
    },
    {
      role: 'dho',
      titleEn: 'DHO District Command Center',
      titleMr: 'जिल्हा आरोग्य अधिकारी कमांड सेंटर',
      titleHi: 'जिला स्वास्थ्य अधिकारी कमांड सेंटर',
      badge: 'District Governance',
      tagline: 'District-wide geospatial analytics, referral completion drop-off funnel, stock-out radar, and directive broadcast.',
      icon: ShieldAlert,
      color: 'text-rose-600',
      bgGradient: 'from-rose-500/10 to-red-500/5',
      keyFeatures: ['District GIS Heatmap & Surveillance', 'Referral Drop-Off Funnel Analytics', 'Drug Stock-Out & Outage Radar', 'Direct Administrative Instruction Dispatch']
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Interactive Operational Workspaces</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002117] tracking-tight">
            Role Portals — One Shared Healthcare Network
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Setu is not a generic dashboard. Every persona operates on shared healthcare entities with tailored workflows, permissions, and data scopes.
          </p>
        </div>

        {/* 8 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            const title = language === 'mr' ? portal.titleMr : language === 'hi' ? portal.titleHi : portal.titleEn;
            return (
              <div
                key={portal.role}
                className={`bg-gradient-to-b ${portal.bgGradient} bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-5 hover:border-emerald-400 group`}
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-100 ${portal.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 uppercase tracking-wider">
                      {portal.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {portal.tagline}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Core Workflows:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {portal.keyFeatures.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5 leading-tight">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  onClick={() => setCurrentView(portal.role)}
                  className="w-full bg-[#003527] hover:bg-[#064e3b] text-white text-xs font-bold py-3 px-4 rounded-2xl shadow-md shadow-emerald-950/10 transition-all flex items-center justify-center gap-2 group-hover:bg-emerald-700"
                >
                  <span>Launch {portal.titleEn.split(' ')[0]} Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
