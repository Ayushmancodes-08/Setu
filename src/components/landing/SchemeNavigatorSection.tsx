import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MAHARASHTRA_SCHEMES } from '../../data/mockData';
import { HealthScheme } from '../../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Phone, 
  HelpCircle, 
  ArrowRight,
  ExternalLink,
  Gift
} from 'lucide-react';

export const SchemeNavigatorSection: React.FC = () => {
  const { t, language, showToast } = useApp();
  const [selectedScheme, setSelectedScheme] = useState<HealthScheme>(MAHARASHTRA_SCHEMES[0]);

  return (
    <section id="schemes" className="py-20 bg-white border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Cashless Healthcare Entitlements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002117] tracking-tight">
            {t.schemeTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t.schemeSubtitle}
          </p>
        </div>

        {/* Scheme Selector Pills */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {MAHARASHTRA_SCHEMES.map((scheme) => {
            const isSelected = selectedScheme.id === scheme.id;
            return (
              <button
                key={scheme.id}
                onClick={() => setSelectedScheme(scheme)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#003527] text-white shadow-md shadow-emerald-950/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{scheme.shortCode}</span>
                {scheme.isStateSpecific && (
                  <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded font-extrabold">
                    Maha State
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scheme Detail Card */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 w-fit px-3 py-1 rounded-full mb-3">
                  <span>{selectedScheme.ministry}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {language === 'mr' ? selectedScheme.nameMr : language === 'hi' ? selectedScheme.nameHi : selectedScheme.name}
                </h3>
                <div className="text-sm font-bold text-emerald-700 mt-2 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-600" />
                  <span>Coverage: {selectedScheme.coverageAmount}</span>
                </div>
              </div>

              {/* Target Beneficiaries */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 pb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Who is Eligible? (पात्रता):</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">{selectedScheme.targetBeneficiaries}</p>
                <ul className="mt-2 space-y-1 text-slate-700">
                  {selectedScheme.eligibilityCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Benefits List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Key Benefits & Covered Procedures (प्रमुख लाभ):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {selectedScheme.keyBenefits.map((benefit, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Documents Checklist & Action */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Required Documents Checklist</span>
                </h4>
                
                <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
                  {selectedScheme.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="bg-emerald-50 p-3 rounded-xl text-xs text-emerald-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Dedicated Helpline:</span>
                  </div>
                  <div className="font-extrabold text-emerald-800 text-sm mt-0.5">{selectedScheme.helpline}</div>
                </div>

                <button
                  onClick={() => showToast(`Opening ${selectedScheme.shortCode} Arogyamitra verification assistant...`)}
                  className="w-full bg-[#003527] hover:bg-[#064e3b] text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{selectedScheme.applyLinkText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
