import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Search, 
  Mic, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Pill, 
  CheckCircle2, 
  ArrowRight,
  Stethoscope,
  HeartHandshake
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t, language, openAiCompanionWithQuery, setCurrentView } = useApp();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      openAiCompanionWithQuery(searchInput.trim());
    } else {
      openAiCompanionWithQuery('What health services and free medicines are available at my nearest PHC?');
    }
  };

  const handleQuickSymptomClick = (symptomQuery: string) => {
    setSearchInput(symptomQuery);
    openAiCompanionWithQuery(symptomQuery);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#003527]/5 via-emerald-50/30 to-warm-white pt-10 pb-20 border-b border-slate-200">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Initiative Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 border border-emerald-300/80 shadow-sm px-4 py-1.5 rounded-full text-xs font-bold text-[#003527] animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#002117] tracking-tight leading-[1.15]">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* ArogyaSakhi AI Search & Voice Box */}
          <div className="pt-2 max-w-3xl mx-auto">
            <form 
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 rounded-2xl shadow-xl shadow-emerald-950/5 border border-emerald-200/80 flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500"
            >
              <div className="flex items-center gap-2 pl-3 w-full">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 animate-pulse" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent border-none focus:outline-none py-2"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end pr-1">
                <button
                  type="button"
                  onClick={() => openAiCompanionWithQuery(language === 'mr' ? 'मला छातीत कळ येत आहे आणि घाम येत आहे' : 'I have high fever and severe headache for 3 days')}
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors flex items-center gap-1.5 border border-emerald-200"
                  title="Bhashini Voice Input (Marathi / Hindi / English)"
                >
                  <Mic className="w-4 h-4 text-emerald-700 animate-pulse" />
                  <span className="text-xs font-bold hidden sm:inline">भाषिणी Voice</span>
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#003527] hover:bg-[#064e3b] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-950/20 flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <span>{t.askAiBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Symptom Prompts (ArogyaSakhi Style) */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
              <span className="text-slate-500 font-medium">{t.quickSymptoms}</span>
              <button
                onClick={() => handleQuickSymptomClick('3 days continuous high fever with chills and body ache')}
                className="bg-white/80 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-3 py-1 rounded-full border border-slate-200 transition-all"
              >
                🌡️ {t.symptom1}
              </button>
              <button
                onClick={() => handleQuickSymptomClick('Severe acute chest pain radiating to left arm and sweating')}
                className="bg-red-50 hover:bg-red-100 text-red-800 px-3 py-1 rounded-full border border-red-200 font-semibold transition-all"
              >
                🚨 {t.symptom2}
              </button>
              <button
                onClick={() => handleQuickSymptomClick('How to get free hospital delivery and transport under JSSK scheme in Maharashtra')}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 font-medium transition-all"
              >
                👶 {t.symptom3}
              </button>
              <button
                onClick={() => handleQuickSymptomClick('Check live stock of Paracetamol and Metformin at Otur PHC')}
                className="bg-white/80 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-3 py-1 rounded-full border border-slate-200 transition-all"
              >
                💊 {t.symptom4}
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#find-care"
              className="bg-white hover:bg-slate-50 text-[#003527] font-bold px-6 py-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-sm"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{t.findCareBtn}</span>
            </a>
            <a
              href="#schemes"
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{t.checkSchemesBtn}</span>
            </a>
            <button
              onClick={() => setCurrentView('asha')}
              className="bg-slate-900 hover:bg-black text-white font-semibold px-5 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
            >
              <HeartHandshake className="w-4 h-4 text-pink-400" />
              <span>{language === 'mr' ? 'आशा सेविका फील्ड मोड' : 'ASHA Worker Field Mode'}</span>
            </button>
          </div>
        </div>

        {/* Live System Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#002117] tracking-tight">{t.stat1Value}</div>
              <div className="text-xs text-slate-500 font-medium leading-tight">{t.stat1Label}</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-teal-50 text-teal-700 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#002117] tracking-tight">{t.stat2Value}</div>
              <div className="text-xs text-slate-500 font-medium leading-tight">{t.stat2Label}</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700 shrink-0">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#002117] tracking-tight">{t.stat3Value}</div>
              <div className="text-xs text-slate-500 font-medium leading-tight">{t.stat3Label}</div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-700 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#002117] tracking-tight">{t.stat4Value}</div>
              <div className="text-xs text-slate-500 font-medium leading-tight">{t.stat4Label}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
