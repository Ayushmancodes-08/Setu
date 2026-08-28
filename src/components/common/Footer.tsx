import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Heart, Phone, MapPin, Building, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language } = useApp();

  return (
    <footer className="bg-[#002117] text-slate-300 pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Col 1: Brand & Mandate */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-bold text-xl">
                से
              </div>
              <div>
                <span className="font-extrabold text-2xl text-white tracking-tight">SETU (सेतू)</span>
                <span className="block text-xs text-emerald-400 font-medium">Maharashtra Rural Health Grid</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              An AI-assisted, connected rural healthcare ecosystem deployed under Maharashtra State Innovation Society (MSIS) Problem Statement 6133. Bridging village Sub-Centres to District Civil Hospitals with assisted teleconsultations, digital triage, real-time medicine availability, and longitudinal EHR continuity.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ABDM Compliant • HL7 FHIR Interoperable • Data Sovereignty Protected</span>
            </div>
          </div>

          {/* Col 2: Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-400" />
              <span>24x7 Emergency Helplines</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex justify-between items-center py-1 border-b border-emerald-900/40">
                <span>Emergency Ambulance</span>
                <span className="font-bold text-red-400 text-base">108</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-emerald-900/40">
                <span>Health Advice (Arogya Varta)</span>
                <span className="font-bold text-emerald-400 text-base">104</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-emerald-900/40">
                <span>Maternal Delivery Transport</span>
                <span className="font-bold text-teal-300 text-base">102</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-emerald-900/40">
                <span>MJPJAY / PM-JAY Cashless</span>
                <span className="font-bold text-amber-300 text-base">155 388</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Integrated Platforms */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <span>National & State Portals</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="https://www.jeevandayee.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-300 transition-colors">MJPJAY Maharashtra Portal</a></li>
              <li><a href="https://pmjay.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-300 transition-colors">Ayushman Bharat PM-JAY</a></li>
              <li><a href="https://esanjeevani.mohfw.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-300 transition-colors">e-Sanjeevani Telemedicine</a></li>
              <li><a href="https://abdm.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-300 transition-colors">ABHA Health ID Generation</a></li>
              <li><a href="https://arogya.maharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-300 transition-colors">Public Health Dept, Govt of Maharashtra</a></li>
            </ul>
          </div>

          {/* Col 4: Focus Rural Districts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>Priority Health Grids</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Gadchiroli (Tribal Telehealth Pilot)</li>
              <li>• Nandurbar (Maternal High-Risk Cohort)</li>
              <li>• Palghar & Mokhada (Nutrition & NRC)</li>
              <li>• Pune Rural (Junnar, Ambegaon, Khed)</li>
              <li>• Nashik (Remote Sub-Centre Links)</li>
              <li>• Melghat / Amravati (Tribal Outreach)</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 SETU Healthcare Ecosystem. Commissioned under Maharashtra State Innovation Society (MSIS), Department of Skills, Employment, Entrepreneurship and Innovation.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Built for Rural Healthcare Accessibility</span>
            <span>•</span>
            <span className="text-emerald-400">Clinical Protocol Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
