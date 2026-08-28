import React from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { Role } from '../../types';
import { 
  Building2, 
  Stethoscope, 
  HeartHandshake, 
  Activity, 
  Layers, 
  ShieldCheck, 
  PhoneCall, 
  Search, 
  ArrowRight, 
  Lock, 
  Award,
  Hospital,
  CheckCircle2,
  Users
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentView, setIsEmergencyModalOpen, language } = useApp();
  const { openRoleAuthModal, facilities, patients } = useHealthData();

  const scrollToPortals = () => {
    const el = document.getElementById('role-portals-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-b from-slate-900 via-[#06241b] to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-950">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Official Identity Banner & Hero Text */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-950/90 border border-emerald-700/60 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Government of Maharashtra • Public Health & Family Welfare Department</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            SETU <span className="text-emerald-400">ग्रामीण आरोग्य</span> समन्वय मंच
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            A unified digital health coordination backbone connecting citizens, village Sub-Centres, Primary Health Centres, and District Specialists across Maharashtra.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={scrollToPortals}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs shadow-lg shadow-emerald-950/60 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Access Healthcare Portals</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openRoleAuthModal('doctor')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Doctor Verification & Login</span>
            </button>

            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 border border-red-400/40"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>108 Emergency SOS</span>
            </button>
          </div>
        </div>

        {/* 4-Step Chain of Care Infographic */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Unified Care Loop</span>
              <h3 className="font-extrabold text-base sm:text-lg text-white">How SETU Connects Rural Maharashtra</h3>
            </div>
            <span className="text-xs text-slate-400 bg-slate-900 border border-slate-700 px-3 py-1 rounded-xl font-medium">
              National Health Mission & ABDM Standard
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-900/80 text-rose-300 flex items-center justify-center font-bold text-xs border border-rose-600">1</span>
                <span className="font-extrabold text-rose-300 text-sm">Doorstep Screening</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                Frontline ASHA workers visit rural households, conduct ANC/NCD vitals screenings, and flag high-risk mothers.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-900/80 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-600">2</span>
                <span className="font-extrabold text-emerald-300 text-sm">Sub-Centre Triage</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                Community Health Officers (CHO) conduct rapid diagnostics and connect complex cases over e-Sanjeevani video.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-900/80 text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-600">3</span>
                <span className="font-extrabold text-blue-300 text-sm">Specialist Tele-Hub</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                Hospital Specialist Doctors review vitals, sign digital e-prescriptions, order lab tests, and coordinate admissions.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-900/80 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-600">4</span>
                <span className="font-extrabold text-amber-300 text-sm">Pharmacy & Bed Command</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                Local pharmacists dispense prescribed medicines, and 108 Emergency Ambulances manage critical hospital transfers.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Empanelment Link Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/50 border border-slate-700/60 px-6 py-4 rounded-2xl text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Are you a Medical Specialist or Hospital Administrator?</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => openRoleAuthModal('doctor')}
              className="text-blue-400 hover:text-blue-300 font-bold hover:underline"
            >
              Apply for Doctor Empanelment →
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => openRoleAuthModal('facility')}
              className="text-amber-400 hover:text-amber-300 font-bold hover:underline"
            >
              List a Health Facility →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
