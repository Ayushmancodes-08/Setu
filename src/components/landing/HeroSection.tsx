import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { bhashiniAI, PatientVoiceTriageResult } from '../../services/bhashiniService';
import { groqAI, GroqTriageOutput } from '../../services/groqAiService';
import { 
  Heart, 
  Building2, 
  Truck, 
  Pill, 
  Stethoscope, 
  PhoneCall, 
  ArrowRight,
  ShieldCheck,
  Video,
  Award,
  CheckCircle2,
  Users,
  Mic,
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  FileText,
  Navigation,
  HeartHandshake
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentView, setIsEmergencyModalOpen, setIsAiSettingsModalOpen, language, t, setCompanionInitialQuery, setIsAiCompanionOpen } = useApp();
  const { openRoleAuthModal, facilities, patients } = useHealthData();

  // Language-Agnostic Setu AI Navigator State
  const [heroQuery, setHeroQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoadingLLM, setIsLoadingLLM] = useState<boolean>(false);
  const [heroTriage, setHeroTriage] = useState<GroqTriageOutput | null>(null);
  const [isSpeakingHero, setIsSpeakingHero] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToPortals = () => {
    const el = document.getElementById('role-portals-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSubmit = async (queryText?: string, isVoiceMode = false) => {
    const textToProcess = queryText || heroQuery;
    if (!textToProcess.trim()) return;

    setIsLoadingLLM(true);
    bhashiniAI.stopSpeaking();
    setIsSpeakingHero(false);

    try {
      const triageResult = await groqAI.runSymptomAndSchemeTriage(textToProcess, language);
      setHeroTriage(triageResult);
      setHeroQuery('');

      if (isVoiceMode && triageResult.summary) {
        setIsSpeakingHero(true);
        bhashiniAI.speakText(triageResult.summary, language, () => {
          setIsSpeakingHero(false);
        });
      }
    } catch (e) {
      console.warn('Groq triage notice in hero:', e);
    } finally {
      setIsLoadingLLM(false);
    }
  };

  const recognitionRef = useRef<any>(null);

  const handleHeroVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
      setIsListening(false);
      return;
    }

    bhashiniAI.stopSpeaking();
    setIsSpeakingHero(false);
    setIsListening(true);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        if (language === 'mr') recognition.lang = 'mr-IN';
        else if (language === 'hi') recognition.lang = 'hi-IN';
        else if (language === 'bn') recognition.lang = 'bn-IN';
        else if (language === 'ur') recognition.lang = 'ur-IN';
        else recognition.lang = 'en-IN';

        recognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript && currentTranscript.trim()) {
            setHeroQuery(currentTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition notice:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          recognitionRef.current = null;
          // Auto submit if text exists
          if (heroQuery && heroQuery.trim()) {
            handleHeroSubmit(heroQuery.trim(), true);
          }
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition start failed, trying fallback:', e);
      }
    }

    // Fallback: Browser microphone prompt
    bhashiniAI.asr(
      language,
      (transcript) => {
        setHeroQuery(transcript);
        handleHeroSubmit(transcript, true);
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );
  };

  const handleToggleVoicePlay = (textToSpeak: string) => {
    if (isSpeakingHero) {
      bhashiniAI.stopSpeaking();
      setIsSpeakingHero(false);
    } else {
      setIsSpeakingHero(true);
      bhashiniAI.speakText(textToSpeak, language, () => {
        setIsSpeakingHero(false);
      });
    }
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

        {/* 🤖 ADVANCED MULTILINGUAL AI SYMPTOM CHECKER & HEALTH NAVIGATOR */}
        <div className="bg-slate-900/95 border border-emerald-500/40 rounded-3xl p-5 sm:p-7 max-w-4xl mx-auto shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>SetuAI Clinical Symptom Checker & Health Navigator</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Bhashini + Groq LLaMA-3.3
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-300/80 font-medium">
                  {language === 'mr' 
                    ? 'आपल्या भाषेत लक्षणे सांगा — मराठी, हिंदी, ओडिया, बंगाली, उर्दू किंवा इंग्रजी.' 
                    : language === 'hi'
                    ? 'अपनी भाषा में लक्षण बताएं — हिन्दी, मराठी, ओडिया, बंगाली, उर्दू या अंग्रेजी।'
                    : 'Describe your symptoms in plain language — Hindi, Marathi, Odia, Bengali, Urdu, English.'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setCompanionInitialQuery(heroQuery || 'Fever and cold');
                setIsAiCompanionOpen(true);
              }}
              className="text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-xl flex items-center gap-1 w-fit transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open Full Chat Dialogue</span>
            </button>
          </div>

          {/* Input & Voice Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleHeroVoiceInput}
              className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 ${
                isListening ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title="Speak your health concerns"
            >
              <Mic className="w-4 h-4" />
              <span>{isListening ? 'Listening...' : '🎤 Tap & Speak'}</span>
            </button>

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder={
                  language === 'mr' 
                    ? 'उदा. मला २ दिवसांपासून तीव्र ताप व डोकेदुखी आहे...' 
                    : language === 'hi'
                    ? 'उदा. मुझे 2 दिन से तेज बुखार और सिरदर्द है...'
                    : 'e.g. I have severe chest discomfort / 2 days fever with chills...'
                }
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleHeroSubmit()}
                className="w-full bg-slate-950 border border-emerald-700/60 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                onClick={() => handleHeroSubmit()}
                disabled={isLoadingLLM || !heroQuery.trim()}
                className="bg-white hover:bg-slate-100 disabled:bg-slate-700 text-slate-900 font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-1 shrink-0 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoadingLLM ? (
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                ) : (
                  <>
                    <span>Analyze</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SAMPLE QUICK SYMPTOMS PILLS */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Quick Examples:</span>
            {[
              { label: language === 'mr' ? 'ताप व थंडी (Fever)' : language === 'hi' ? 'तेज बुखार (Fever)' : 'Fever & Chills', query: language === 'mr' ? 'मला २ दिवसांपासून तीव्र ताप आणि थंडी वाजते आहे' : language === 'hi' ? 'मुझे 2 दिन से तेज बुखार और ठंड लग रही है' : 'I have high fever and severe shivering for 2 days' },
              { label: language === 'mr' ? 'छातीत कळ (Chest Pain)' : language === 'hi' ? 'सीने में दर्द (Chest Pain)' : 'Chest Discomfort', query: language === 'mr' ? 'माझ्या छातीत तीव्र कळ येत आहे आणि घाम येतोय' : language === 'hi' ? 'मेरे सीने में तेज दर्द और पसीना आ रहा है' : 'I feel severe chest pressure radiating to left arm' },
              { label: language === 'mr' ? 'गरोदरपण तपासणी (Pregnancy)' : language === 'hi' ? 'गर्भावस्था जांच (ANC)' : 'Pregnancy Care', query: language === 'mr' ? 'मी गरोदर आहे आणि मला मोफत तपासणी व पोषण आहाराची माहिती हवी आहे' : language === 'hi' ? 'मैं गर्भवती हूँ और मुझे मुफ्त जांच व सरकारी योजना चाहिए' : 'I am pregnant and need antenatal care benefits under JSSK' },
              { label: language === 'mr' ? 'डोकेदुखी / BP' : language === 'hi' ? 'सिरदर्द / बीपी' : 'Headache & BP', query: language === 'mr' ? 'मला तीव्र डोकेदुखी आणि चक्कर येत आहे' : language === 'hi' ? 'मुझे तेज सिरदर्द और चक्कर आ रहे हैं' : 'I have severe throbbing headache and dizziness' }
            ].map((ex, idx) => (
              <button
                key={idx}
                onClick={() => handleHeroSubmit(ex.query)}
                className="text-[11px] bg-slate-800 hover:bg-emerald-800 text-emerald-300 hover:text-white border border-slate-700 hover:border-emerald-500 px-2.5 py-1 rounded-xl transition-all"
              >
                {ex.label}
              </button>
            ))}
          </div>

          {/* ADVANCED TRIAGE RESULT BOX */}
          {heroTriage && (
            <div className="bg-slate-950/95 border border-emerald-500/50 rounded-2xl p-5 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header Status & Urgency Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                    heroTriage.urgency === 'red'
                      ? 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
                      : heroTriage.urgency === 'amber'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                  }`}>
                    {heroTriage.urgency === 'red' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                    {heroTriage.urgency === 'amber' && <Info className="w-3.5 h-3.5 text-amber-400" />}
                    {heroTriage.urgency === 'green' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{heroTriage.urgencyLabel}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {heroTriage.modelUsed}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleVoicePlay(heroTriage.summary)}
                    className={`font-bold flex items-center gap-1 px-3 py-1 rounded-lg text-xs transition-all ${
                      isSpeakingHero
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-white/10 hover:bg-white/20 text-emerald-300'
                    }`}
                  >
                    {isSpeakingHero ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeakingHero ? 'Stop Voice' : '🔊 Listen Voice'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCompanionInitialQuery(heroTriage.primaryAssessment);
                      setIsAiCompanionOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Full Navigator</span>
                  </button>
                </div>
              </div>

              {/* Assessment Summary in Native Language */}
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-sm text-emerald-300">
                  {heroTriage.primaryAssessment}
                </h4>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                  {heroTriage.summary}
                </p>
                <p className="text-emerald-400 font-bold text-xs pt-1">
                  👉 {heroTriage.recommendedAction}
                </p>
              </div>

              {/* 1. CLARIFYING DIAGNOSTIC QUESTION WITH INTERACTIVE CHOICE CHIPS */}
              {heroTriage.clarifyingQuestion && (
                <div className="bg-emerald-950/60 border border-emerald-500/40 p-3.5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200">
                    <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{heroTriage.clarifyingQuestion}</span>
                  </div>

                  {heroTriage.choiceChips && heroTriage.choiceChips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {heroTriage.choiceChips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleHeroSubmit(chip)}
                          className="bg-slate-900 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-600/60 text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                        >
                          <span>👉</span>
                          <span>{chip}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. RICH HOSPITAL CARD */}
              {heroTriage.hospitalCard && (
                <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-extrabold text-white text-xs sm:text-sm">
                        {language === 'mr' && heroTriage.hospitalCard.nameMr ? heroTriage.hospitalCard.nameMr : heroTriage.hospitalCard.name}
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                        📍 {heroTriage.hospitalCard.distanceKm} km away
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {heroTriage.hospitalCard.type} • 🛏️ {heroTriage.hospitalCard.availableBeds} General Beds • 🚨 {heroTriage.hospitalCard.icuBeds} ICU Beds
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${heroTriage.hospitalCard.contactNumber}`}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Hospital</span>
                    </a>
                    <button
                      onClick={() => {
                        setCurrentView('patient');
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Teleconsult</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. SAFE HOME REMEDIES */}
              {heroTriage.homeRemedies && heroTriage.homeRemedies.length > 0 && (
                <div className="bg-emerald-950/40 border border-emerald-600/30 p-3 rounded-2xl space-y-1.5">
                  <div className="text-emerald-300 font-bold flex items-center gap-1.5 pb-1 border-b border-emerald-800/40">
                    <HeartHandshake className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'mr' ? 'सुरक्षित घरगुती व प्राथमिक काळजी:' : language === 'hi' ? 'सुरक्षित घरेलू एवं प्राथमिक देखभाल:' : 'Safe Home Care & First Aid:'}</span>
                  </div>
                  {heroTriage.homeRemedies.map((remedy, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-300 text-xs">
                      <span className="text-emerald-400 font-bold">🌿</span>
                      <span>{remedy}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. MATCHED CASHLESS GOVERNMENT SCHEMES */}
              {heroTriage.matchedSchemes && heroTriage.matchedSchemes.length > 0 && (
                <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Eligible Maharashtra 100% Cashless Healthcare Schemes:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {heroTriage.matchedSchemes.map((sch, idx) => (
                      <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-300">{sch.name}</span>
                          <span className="bg-emerald-900/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                            {sch.coverageAmount}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{sch.benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  ? 'सेतु ग्रामीण स्वास्थ्य व्यवस्था को कैसे जोड़ता है?' 
                  : language === 'or'
                  ? 'ସେତୁ କିପରି ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ ବ୍ୟବସ୍ଥାକୁ ସଂଯୋଗ କରେ?'
                  : 'How Setu Unifies Rural Maharashtra Healthcare'}
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded-full">
              4-Tier Synchronized Continuum
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 space-y-3 relative group hover:border-emerald-500/60 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
                  01
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                  Village Spoke
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">
                {language === 'mr' ? '१. उपकेंद्र व आशा सेविका' : language === 'hi' ? '१. उप-केंद्र एवं आशा' : '1. Sub-Centre & ASHA'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'mr' 
                  ? 'आशा सेविका घरोघरी जाऊन डिजिटल आरोग्य नोंदी (EHR) करतात आणि गर्भवती व बालकांची तपासणी करतात.' 
                  : language === 'hi' 
                  ? 'आशा कार्यकर्ता घर-घर जाकर डिजिटल स्वास्थ्य रिकॉर्ड और गर्भवती महिलाओं की जांच करती हैं।' 
                  : 'Frontline ASHA workers capture vital screenings, ANC checkups, and update village EHR records.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 space-y-3 relative group hover:border-emerald-500/60 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-sm">
                  02
                </div>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded">
                  Hub PHC
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">
                {language === 'mr' ? '२. प्राथमिक आरोग्य केंद्र (PHC)' : language === 'hi' ? '२. प्राथमिक स्वास्थ्य केंद्र (PHC)' : '2. Primary Health Centre'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'mr'
                  ? 'उपकेंद्रातील गंभीर रुग्णांना पीएचसीमध्ये टेलिकन्सल्टेशन व १०-मिनिट रॅपिड रक्त तपासणी मिळते.'
                  : language === 'hi'
                  ? 'उपकेंद्र से रेफर मरीजों को पीएचसी में तुरंत डॉक्टर परामर्श और 10-मिनट लैब टेस्ट मिलते हैं।'
                  : 'PHC medical officers review escalated cases and conduct rapid diagnostics and digital triage.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 space-y-3 relative group hover:border-emerald-500/60 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-sm">
                  03
                </div>
                <span className="text-[10px] font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded">
                  District Hub
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">
                {language === 'mr' ? '३. जिल्हा रुग्णालय व तज्ज्ञ' : language === 'hi' ? '३. जिला अस्पताल विशेषज्ञ' : '3. District Specialists'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'mr'
                  ? 'ग्रामीण रुग्णालय आणि जिल्हा तज्ज्ञ थेट व्हिडिओद्वारे मार्गदर्शन करतात व शस्त्रक्रिया नियोजित करतात.'
                  : language === 'hi'
                  ? 'जिला अस्पताल के विशेषज्ञ डॉक्टर लाइव वीडियो के जरिए जटिल मामलों में मार्गदर्शन करते हैं।'
                  : 'Tertiary specialists in cardiology, gynecology, and pediatrics provide remote expert consults.'}
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 space-y-3 relative group hover:border-emerald-500/60 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                  04
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                  Cashless Schemes
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">
                {language === 'mr' ? '४. १००% मोफत योजना (MJPJAY)' : language === 'hi' ? '४. १००% मुफ्त योजना (MJPJAY)' : '4. 100% Cashless Schemes'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'mr'
                  ? 'महात्मा फुले जन आरोग्य योजना व जेएसएसके अंतर्गत ५ लाखांपर्यंतचे सर्व उपचार व औषधे १००% मोफत.'
                  : language === 'hi'
                  ? 'महात्मा ज्योतिराव फुले योजना और जेएसएसके के तहत ₹5 लाख तक का कैशलेस इलाज एवं मुफ्त दवाइयां।'
                  : 'Patients receive seamless cashless treatment under MJPJAY and free institutional delivery via JSSK.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
