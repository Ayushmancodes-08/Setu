import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { CareFinderSection } from './components/landing/CareFinderSection';
import { SchemeNavigatorSection } from './components/landing/SchemeNavigatorSection';
import { EcosystemFlowSection } from './components/landing/EcosystemFlowSection';
import { LivePulseSection } from './components/landing/LivePulseSection';
import { RolePortalsSection } from './components/landing/RolePortalsSection';
import { ArogyaSakhiCompanionModal } from './components/landing/ArogyaSakhiCompanionModal';
import { EmergencyModal } from './components/modals/EmergencyModal';

// Role Portals
import { PatientPortal } from './components/roles/PatientPortal';
import { AshaPortal } from './components/roles/AshaPortal';
import { ChoPortal } from './components/roles/ChoPortal';
import { DoctorPortal } from './components/roles/DoctorPortal';
import { PharmacistPortal } from './components/roles/PharmacistPortal';
import { LabPortal } from './components/roles/LabPortal';
import { FacilityPortal } from './components/roles/FacilityPortal';
import { DhoPortal } from './components/roles/DhoPortal';

import { Sparkles, PhoneCall } from 'lucide-react';

export const App: React.FC = () => {
  const { 
    currentView, 
    setIsAiCompanionOpen, 
    setIsEmergencyModalOpen, 
    toastMessage 
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-slate-900 selection:bg-emerald-500 selection:text-white">
      
      {/* Official Government Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <>
            <HeroSection />
            <CareFinderSection />
            <SchemeNavigatorSection />
            <EcosystemFlowSection />
            <LivePulseSection />
            <RolePortalsSection />
          </>
        )}

        {currentView === 'patient' && <PatientPortal />}
        {currentView === 'asha' && <AshaPortal />}
        {currentView === 'cho' && <ChoPortal />}
        {currentView === 'doctor' && <DoctorPortal />}
        {currentView === 'pharmacist' && <PharmacistPortal />}
        {currentView === 'lab' && <LabPortal />}
        {currentView === 'facility' && <FacilityPortal />}
        {currentView === 'dho' && <DhoPortal />}
      </main>

      {/* Official Government Footer */}
      <Footer />

      {/* Floating Action Buttons (ArogyaSakhi AI & Quick SOS) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Floating ArogyaSakhi AI Trigger */}
        <button
          onClick={() => setIsAiCompanionOpen(true)}
          className="bg-gradient-to-r from-[#003527] to-emerald-700 hover:from-[#064e3b] hover:to-emerald-600 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl border-2 border-emerald-400/40 flex items-center gap-2.5 transition-all hover:scale-105 group"
          title="Open ArogyaSakhi AI Health Companion"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>
          <span className="hidden sm:inline font-extrabold text-sm tracking-tight">
            Ask ArogyaSakhi AI
          </span>
        </button>

        {/* Floating SOS Trigger (Mobile View) */}
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="sm:hidden bg-red-600 text-white p-3.5 rounded-full shadow-xl flex items-center justify-center animate-bounce"
        >
          <PhoneCall className="w-5 h-5" />
        </button>
      </div>

      {/* Modals & Drawers */}
      <ArogyaSakhiCompanionModal />
      <EmergencyModal />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-md text-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
