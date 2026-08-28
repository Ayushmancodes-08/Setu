import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { bhashiniAI, PatientVoiceTriageResult } from '../../services/bhashiniService';
import { huggingFaceAI } from '../../services/huggingFaceService';
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
  Users,
  Mic,
  Sparkles,
  Volume2
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentView, setIsEmergencyModalOpen, setIsAiSettingsModalOpen, language, t } = useApp();
  const { openRoleAuthModal, facilities, patients } = useHealthData();

  // Language-Agnostic Setu AI Navigator State
  const [heroQuery, setHeroQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoadingLLM, setIsLoadingLLM] = useState<boolean>(false);
  const [heroResult, setHeroResult] = useState<PatientVoiceTriageResult | null>(null);

  const scrollToPortals = () => {
    const el = document.getElementById('role-portals-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSubmit = async (queryText?: string) => {
    const textToProcess = queryText || heroQuery;
    if (!textToProcess.trim()) return;

    setIsLoadingLLM(true);
    // Automatic Language Detection -> Intent Engine -> Same Language Triage Response
    const result = bhashiniAI.runPatientVoiceTriagePipeline(textToProcess);

    if (huggingFaceAI.isConfigured()) {
      try {
        const llmRes = await huggingFaceAI.queryTriageLLM(textToProcess, result.detectedLanguage);
        result.triageGuidance = llmRes.guidance;
        result.suggestedAction = llmRes.suggestedAction;
        result.severity = llmRes.severity;
      } catch (e) {
        console.warn('HF query fallback:', e);
      }
    }

    setHeroResult(result);
    setHeroQuery('');
    setIsLoadingLLM(false);

    // Audio readout in same language
    bhashiniAI.tts(result.triageGuidance, result.detectedLanguage);
  };

  const handleHeroVoiceInput = () => {
    setIsListening(true);
    bhashiniAI.asr(
      language,
      (transcript) => {
        setHeroQuery(transcript);
        handleHeroSubmit(transcript);
      },
      (err) => {
        console.warn('Hero ASR notice:', err);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  return (
    <section className="bg-gradient-to-b from-slate-900 via-[#06241b] to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-950">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Official Identity Banner & Hero Text */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-950/90 border border-emerald-700/60 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {language === 'mr' 
                ? 'महाराष्ट्र शासन • सार्वजनिक आरोग्य व कुटुंब कल्याण विभाग' 
                : language === 'hi' 
                ? 'महाराष्ट्र सरकार • सार्वजनिक स्वास्थ्य एवं परिवार कल्याण विभाग' 
                : language === 'or'
                ? 'ମହାରାଷ୍ଟ୍ର ସରକାର • ସାର୍ବଜନୀନ ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ପରିବାର କଲ୍ୟାଣ ବିଭାଗ'
                : 'Government of Maharashtra • Public Health & Family Welfare Department'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {language === 'mr' ? (
              <>सेतू (SETU) <span className="text-emerald-400">ग्रामीण आरोग्य</span> समन्वय व्यासपीठ</>
            ) : language === 'hi' ? (
              <>सेतु (SETU) <span className="text-emerald-400">ग्रामीण स्वास्थ्य</span> समन्वय मंच</>
            ) : language === 'or' ? (
              <>ସେତୁ (SETU) <span className="text-emerald-400">ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ</span> ସମନ୍ୱୟ ମଞ୍ଚ</>
            ) : language === 'bn' ? (
              <>সেতু (SETU) <span className="text-emerald-400">গ্রামীণ স্বাস্থ্য</span> সমন্বয় প্ল্যাটফর্ম</>
            ) : language === 'ur' ? (
              <>سیتو (SETU) <span className="text-emerald-400">دیہی صحت</span> کوآرڈینیشن پلیٹ فارم</>
            ) : (
              <>SETU <span className="text-emerald-400">Rural Healthcare</span> Continuum Platform</>
            )}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto px-2">
            {language === 'mr'
              ? 'उपकेंद्रापासून जिल्हा रुग्णालयापर्यंत थेट जोडलेली आरोग्य व्यवस्था. टेलिकन्सल्टेशन, औषध उपलब्धता व आपत्कालीन समन्वय.'
              : language === 'hi'
              ? 'उप-केंद्र से जिला अस्पताल तक सीधी जुड़ी डिजिटल स्वास्थ्य व्यवस्था। टेलीकंसल्टेशन, दवा उपलब्धता एवं आपातकालीन समन्वय।'
              : language === 'or'
              ? 'ଗ୍ରାମ ଉପ-କେନ୍ଦ୍ରରୁ ଜିଲ୍ଲା ଡାକ୍ତରଖାନା ପର୍ଯ୍ୟନ୍ତ ସଂଯୁକ୍ତ ସ୍ୱାସ୍ଥ୍ୟ ବ୍ୟବସ୍ଥା। ଟେଲିକନସଲଟେସନ, ଔଷଧ ଉପଲବ୍ଧତା ଓ ଜରୁରୀକାଳୀନ ସମନ୍ୱୟ।'
              : language === 'bn'
              ? 'গ্রামের উপ-কেন্দ্র থেকে জেলা হাসপাতাল পর্যন্ত সংযুক্ত স্বাস্থ্যসেবা ব্যবস্থা। টেলিকনসাল্টেশন, ওষুধ প্রাপ্যতা ও জরুরি সমন্বয়।'
              : language === 'ur'
              ? 'دیہی سب سینٹر سے ضلعی ہسپتال تک مربوط ڈیجیٹل صحت کا نظام۔ ٹیلی کنسلٹیشن اور ادویات کی فراہمی۔'
              : 'A unified digital health coordination backbone connecting citizens, village Sub-Centres, Primary Health Centres, and District Specialists across Maharashtra.'}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <button
              onClick={scrollToPortals}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs shadow-lg shadow-emerald-950/60 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>
                {language === 'mr' ? 'आरोग्य पोर्टल्स पहा' : language === 'hi' ? 'स्वास्थ्य पोर्टल्स देखें' : language === 'or' ? 'ସ୍ୱାସ୍ଥ୍ୟ ପୋର୍ଟାଲ୍ ଦେଖନ୍ତୁ' : language === 'bn' ? 'পোর্টাল দেখুন' : language === 'ur' ? 'پورٹلز دیکھیں' : 'Access Healthcare Portals'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openRoleAuthModal('doctor')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-5 py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>
                {language === 'mr' ? 'डॉक्टर पडताळणी व प्रवेश' : language === 'hi' ? 'डॉक्टर सत्यापन एवं लॉगिन' : language === 'or' ? 'ଡାକ୍ତର ଲଗଇନ୍' : language === 'bn' ? 'ডাক্তার লগইন' : language === 'ur' ? 'ڈاکٹر لاگ ان' : 'Doctor Verification & Login'}
              </span>
            </button>

            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-red-400/40"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>
                {language === 'mr' ? '१०८ आपत्कालीन SOS' : language === 'hi' ? '108 आपातकालीन SOS' : language === 'or' ? '୧୦୮ ଜରୁରୀକାଳୀନ SOS' : language === 'bn' ? '১০৮ জরুরি SOS' : language === 'ur' ? '108 ایمرجنسی SOS' : '108 Emergency SOS'}
              </span>
            </button>
          </div>
        </div>

        {/* 🤖 LANGUAGE-AGNOSTIC SETU AI NAVIGATOR (SehatSakhi-Style Plain Language UX) */}
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-5 sm:p-7 max-w-3xl mx-auto shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">Setu AI Health Navigator</h3>
                <p className="text-[11px] text-emerald-300/80 font-medium">
                  “Describe your health concern in plain language — Hindi, Marathi, Odia, English, anything.”
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30 w-fit">
              Language-Invisible AI
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleHeroVoiceInput}
              className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 ${
                isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isListening ? 'Listening...' : '🎤 Tap & Speak'}</span>
            </button>

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="e.g. मुझे 2 दिन से तेज बुखार है / मला डोकेदुखी आहे / ମୋର ମୁଣ୍ଡ ବିନ୍ଧୁଛି..."
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleHeroSubmit()}
                className="w-full bg-slate-950 border border-emerald-700/60 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                onClick={() => handleHeroSubmit()}
                className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-3 rounded-2xl text-xs flex items-center gap-1 shrink-0"
              >
                <span>Ask</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {heroResult && (
            <div className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-4 space-y-2.5 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-2.5 py-0.5 rounded font-mono font-bold">
                  Understood: {heroResult.canonicalIntent.understoodSummaryLocalized}
                </span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  heroResult.severity === 'URGENT' ? 'bg-red-900 text-red-200' : 'bg-emerald-900 text-emerald-200'
                }`}>
                  Triage: {heroResult.severity}
                </span>
              </div>

              <p className="text-slate-200 font-medium leading-relaxed">
                {heroResult.triageGuidance}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                <span className="text-emerald-300 font-bold">Action: {heroResult.suggestedAction}</span>
                <button
                  onClick={() => bhashiniAI.tts(heroResult.triageGuidance, heroResult.detectedLanguage)}
                  className="text-emerald-400 hover:text-white font-bold flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Voice</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4-Step Chain of Care Infographic */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                {language === 'mr' ? 'एकसंध आरोग्य साखळी' : language === 'hi' ? 'एकीकृत स्वास्थ्य चक्र' : language === 'or' ? 'ଏକୀକୃତ ସ୍ୱାସ୍ଥ୍ୟ ଚକ୍ର' : 'Unified Care Loop'}
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {language === 'mr' 
                  ? 'सेतू ग्रामीण महाराष्ट्राला कसे जोडते?' 
                  : language === 'hi' 
                  ? 'सेतु ग्रामीण महाराष्ट्र को कैसे जोड़ता है?' 
                  : language === 'or'
                  ? 'ସେତୁ ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟକୁ କିପରି ଯୋଡ଼େ?'
                  : 'How SETU Connects Rural Maharashtra'}
              </h3>
            </div>
            <span className="text-xs text-slate-400 bg-slate-900 border border-slate-700 px-3 py-1 rounded-xl font-medium">
              National Health Mission & ABDM Standard
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-900/80 text-rose-300 flex items-center justify-center font-bold text-xs border border-rose-600">1</span>
                <span className="font-extrabold text-rose-300 text-sm">
                  {language === 'mr' ? 'घरोघरी तपासणी' : language === 'hi' ? 'घर-घर जांच' : language === 'or' ? 'ଘର ଘର ଯାଇ ଯାଞ୍ଚ' : 'Doorstep Screening'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {language === 'mr'
                  ? 'आशा सेविका घरोघरी जाऊन माता व ज्येष्ठ नागरिकांची तपासणी करतात आणि उच्च-जोखीम रुग्ण नोंदवतात.'
                  : language === 'hi'
                  ? 'आशा कार्यकर्ता घर-घर जाकर माता एवं वरिष्ठ नागरिकों की जांच करती हैं और जोखिम मामलों को दर्ज करती हैं।'
                  : language === 'or'
                  ? 'ଆଶା କର୍ମୀ ଘର ଘର ଯାଇ ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା କରନ୍ତି ଏବଂ ଗର୍ଭବତୀ ମହିଳାଙ୍କ ଯତ୍ନ ନିଅନ୍ତି।'
                  : 'Frontline ASHA workers visit rural households, conduct ANC/NCD vitals screenings, and flag high-risk mothers.'}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-900/80 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-600">2</span>
                <span className="font-extrabold text-emerald-300 text-sm">
                  {language === 'mr' ? 'उपकेंद्र ट्रायज' : language === 'hi' ? 'उप-केंद्र ट्राइएज' : language === 'or' ? 'ଉପ-କେନ୍ଦ୍ର ଟ୍ରାଏଜ୍' : 'Sub-Centre Triage'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {language === 'mr'
                  ? 'समुदाय आरोग्य अधिकारी (CHO) जलद रक्त चाचण्या करतात आणि ई-संजीवनी द्वारे तज्ज्ञ डॉक्टरांशी जोडतात.'
                  : language === 'hi'
                  ? 'सामुदायिक स्वास्थ्य अधिकारी (CHO) त्वरित जांच करते हैं और ई-संजीवनी से विशेषज्ञ डॉक्टरों से जोड़ते हैं।'
                  : language === 'or'
                  ? 'ସିଏଚଓ (CHO) ରକ୍ତ ପରୀକ୍ଷା କରନ୍ତି ଏବଂ ଟେଲିକନସଲଟେସନ ସହ ଯୋଡ଼ନ୍ତି।'
                  : 'Community Health Officers (CHO) conduct rapid diagnostics and connect complex cases over e-Sanjeevani video.'}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-900/80 text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-600">3</span>
                <span className="font-extrabold text-blue-300 text-sm">
                  {language === 'mr' ? 'तज्ज्ञ डॉक्टर कन्सोल' : language === 'hi' ? 'विशेषज्ञ डॉक्टर केंद्र' : language === 'or' ? 'ବିଶେଷଜ୍ଞ ଡାକ୍ତର କେନ୍ଦ୍ର' : 'Specialist Tele-Hub'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {language === 'mr'
                  ? 'रुग्णालयातील तज्ज्ञ डॉक्टर व्हिडिओ द्वारे तपासणी करतात, डिजिटल ई-प्रिस्क्रिप्शन देतात आणि लॅब ऑर्डर देतात.'
                  : language === 'hi'
                  ? 'अस्पताल के विशेषज्ञ डॉक्टर वीडियो जांच करते हैं, डिजिटल ई-प्रिस्क्रिप्शन जारी करते हैं और लैब ऑर्डर देते हैं।'
                  : language === 'or'
                  ? 'ଡାକ୍ତରଖାନା ବିଶେଷଜ୍ଞ ଡାକ୍ତର ଭିଡିଓ ପରାମର୍ଶ ଦିଅନ୍ତି ଏବଂ ଇ-ପ୍ରେସକ୍ରିପସନ ଜାରି କରନ୍ତି।'
                  : 'Hospital Specialist Doctors review vitals, sign digital e-prescriptions, order lab tests, and coordinate admissions.'}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-900/80 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-600">4</span>
                <span className="font-extrabold text-amber-300 text-sm">
                  {language === 'mr' ? 'औषध वितरण व खाटा' : language === 'hi' ? 'दवा वितरण एवं बिस्तर' : language === 'or' ? 'ଔଷଧ ଓ ବେଡ୍ ପରିଚାଳନା' : 'Pharmacy & Bed Command'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                {language === 'mr'
                  ? 'स्थानिक फार्मासिस्ट मोफत औषध वाटप करतात, आणि १०८ रुग्णवाहिका तात्काळ रुग्णालय हलवण्यास मदत करते.'
                  : language === 'hi'
                  ? 'स्थानीय फार्मासिस्ट मुफ्त दवा वितरित करते हैं, और 108 एम्बुलेंस आपातकालीन अस्पताल स्थानांतरण करती है।'
                  : language === 'or'
                  ? 'ସ୍ଥାନୀୟ ଫାର୍ମାସିଷ୍ଟ ମାଗଣା ଔଷଧ ବଣ୍ଟନ କରନ୍ତି ଏବଂ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ସହାୟତା ପ୍ରଦାନ କରେ।'
                  : 'Local pharmacists dispense prescribed medicines, and 108 Emergency Ambulances manage critical hospital transfers.'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Empanelment Link Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/50 border border-slate-700/60 px-6 py-4 rounded-2xl text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {language === 'mr' 
                ? 'तुम्ही डॉक्टर किंवा रुग्णालय प्रशासक आहात का?' 
                : language === 'hi' 
                ? 'क्या आप डॉक्टर या अस्पताल प्रशासक हैं?' 
                : language === 'or'
                ? 'ଆପଣ ଜଣେ ଡାକ୍ତର କିମ୍ବା ଡାକ୍ତରଖାନା ପ୍ରଶାସକ କି?'
                : 'Are you a Medical Specialist or Hospital Administrator?'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => openRoleAuthModal('doctor')}
              className="text-blue-400 hover:text-blue-300 font-bold hover:underline"
            >
              {language === 'mr' ? 'डॉक्टर नोंदणी करा →' : language === 'hi' ? 'डॉक्टर पंजीकरण करें →' : language === 'or' ? 'ଡାକ୍ତର ପଞ୍ଜୀକରଣ କରନ୍ତୁ →' : 'Apply for Doctor Empanelment →'}
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => openRoleAuthModal('facility')}
              className="text-amber-400 hover:text-amber-300 font-bold hover:underline"
            >
              {language === 'mr' ? 'रुग्णालय जोडा →' : language === 'hi' ? 'अस्पताल जोड़ें →' : language === 'or' ? 'ଡାକ୍ତରଖାନା ଯୋଡନ୍ତୁ →' : 'List a Health Facility →'}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
