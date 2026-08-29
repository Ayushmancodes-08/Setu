import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { processHealthQuery, AIResponse } from '../../services/aiHealthCompanion';
import { groqAI, GroqTriageOutput, ChatHistoryItem } from '../../services/groqAiService';
import { bhashiniAI } from '../../services/bhashiniService';
import { AiSettingsModal } from '../modals/AiSettingsModal';
import { 
  Sparkles, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  PhoneCall, 
  Video, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  Radio,
  Languages,
  Layers,
  FileText,
  Settings,
  Zap,
  Activity,
  Navigation,
  Pill,
  HeartHandshake,
  HelpCircle,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  responseObj?: AIResponse;
  groqTriage?: GroqTriageOutput;
  timestamp: string;
}

export const ArogyaSakhiCompanionModal: React.FC = () => {
  const { 
    isAiCompanionOpen, 
    setIsAiCompanionOpen, 
    companionInitialQuery, 
    setCompanionInitialQuery, 
    language, 
    setLanguage,
    t,
    setIsEmergencyModalOpen,
    setCurrentView,
    showToast
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting or initial query
  useEffect(() => {
    if (isAiCompanionOpen) {
      if (messages.length === 0) {
        const welcomeGreetings: Record<string, string> = {
          mr: 'नमस्कार! मी सेतू AI (SetuAI), महाराष्ट्र शासनाचा क्लिनिकल ट्रायज व आरोग्य योजना मार्गदर्शक आहे.\n\nतुमची लक्षणे (उदा. ताप, छातीत दुखणे, गरोदरपणातील समस्या) सांगा किंवा महात्मा फुले जन आरोग्य योजनेअंतर्गत (MJPJAY) मोफत उपचारांची माहिती मिळवा.',
          hi: 'नमस्कार! मैं सेतु AI (SetuAI), महाराष्ट्र सरकार का क्लिनिकल ट्रायज एवं स्वास्थ्य योजना मार्गदर्शक हूँ।\n\nअपने लक्षण (जैसे बुखार, सीने में दर्द, गर्भावस्था संबंधी समस्या) बताएं या सरकारी मुफ्त योजनाओं की जानकारी प्राप्त करें।',
          or: 'ନମସ୍କାର! ମୁଁ ସେତୁ AI (SetuAI), ଆପଣଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ। ଆପଣଙ୍କର ଲକ୍ଷଣ କୁହନ୍ତୁ ଏବଂ ମାଗଣା ସରକାରୀ ଯୋଜନା ବିଷୟରେ ଜାଣନ୍ତୁ।',
          bn: 'নমস্কার! আমি সেতু AI (SetuAI), আপনার স্বাস্থ্য সহায়ক। আপনার উপসর্গ জানান এবং সরকারি বিনামূল্যে চিকিৎসা সুবিধা সম্পর্কে জানুন।',
          ur: 'سلام! میں سیتو AI (SetuAI) ہوں، آپ کا ہیلتھ گائیڈ۔ اپنی علامات بتائیں اور سرکاری مفت علاج کی معلومات حاصل کریں۔',
          en: 'Namaskar! I am SetuAI (सेतू AI), your official AI Clinical Triage & Government Healthcare Scheme Navigator for Maharashtra.\n\nDescribe your symptoms (e.g. fever, chest pain, pregnancy concerns) or discover 100% cashless treatment under MJPJAY / JSSK.'
        };

        const welcomeText = welcomeGreetings[language] || welcomeGreetings.en;
        const initMsgId = 'msg-init';
        setMessages([
          {
            id: initMsgId,
            sender: 'ai',
            text: welcomeText,
            groqTriage: {
              summary: welcomeText,
              urgency: 'green',
              urgencyLabel: 'SetuAI Active',
              primaryAssessment: 'Interactive Clinical Assessment & Government Schemes',
              clarifyingQuestion: language === 'mr' ? 'आज तुम्हाला काय त्रास जाणवत आहे?' : language === 'hi' ? 'आज आपको मुख्य रूप से क्या समस्या हो रही है?' : 'What health symptoms are you feeling today?',
              choiceChips: language === 'mr' 
                ? ['ताप व थंडी', 'छातीत कळ / अस्वस्थता', 'गरोदरपण तपासणी (ANC)', 'रक्तदाब / शुगर तपासणी']
                : language === 'hi'
                ? ['बुखार और ठंड', 'सीने में दर्द/भारीपन', 'गर्भावस्था जांच (ANC)', 'बीपी/शुगर जांच']
                : ['High Fever & Chills', 'Chest Pain / Pressure', 'Pregnancy Checkup', 'BP / Sugar Check'],
              redFlags: [],
              recommendedAction: 'Describe your symptoms or tap a quick topic above.',
              nearestFacilityType: 'Primary Health Centre (PHC)',
              matchedSchemes: [],
              suggestedMedicationsOrFirstAid: [],
              suggestedActionButtons: [
                { label: '📹 Book Teleconsultation', actionType: 'BOOK_TELECONSULT' },
                { label: '🛡️ Check MJPJAY Free Benefits', actionType: 'CHECK_SCHEME' }
              ],
              confidenceScore: 0.99,
              modelUsed: 'SetuAI Clinical Engine'
            },
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }

      if (companionInitialQuery) {
        handleUserSend(companionInitialQuery);
        setCompanionInitialQuery('');
      }
    } else {
      bhashiniAI.stopSpeaking();
      bhashiniAI.stopSpeechRecognition();
      setCurrentlySpeakingId(null);
    }
  }, [isAiCompanionOpen, companionInitialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, interimTranscript]);

  if (!isAiCompanionOpen) return null;

  const handleUserSend = async (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setInterimTranscript('');
    setIsTyping(true);

    // Build multi-turn conversation history
    const history: ChatHistoryItem[] = messages.slice(-4).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    try {
      const triageResult = await groqAI.runSymptomAndSchemeTriage(query, language, undefined, history);
      const localizedAnswer = triageResult.summary;

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: localizedAnswer,
        groqTriage: triageResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      // Auto-play audio readout if enabled
      if (autoSpeak) {
        handlePlayAudio(aiMsgId, localizedAnswer);
      }
    } catch (err) {
      console.warn('Groq triage error:', err);
      const fallbackResponse = processHealthQuery(query);
      let localizedFallback = fallbackResponse.answerEn;
      if (language === 'mr') localizedFallback = fallbackResponse.answerMr;
      if (language === 'hi') localizedFallback = fallbackResponse.answerHi;

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: localizedFallback,
        responseObj: fallbackResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      if (autoSpeak) {
        handlePlayAudio(aiMsgId, localizedFallback);
      }
    }
  };

  const handlePlayAudio = (msgId: string, text: string) => {
    if (currentlySpeakingId === msgId) {
      bhashiniAI.stopSpeaking();
      setCurrentlySpeakingId(null);
      return;
    }

    setCurrentlySpeakingId(msgId);
    bhashiniAI.speakText(text, language, () => {
      setCurrentlySpeakingId(null);
    });
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      bhashiniAI.stopSpeechRecognition();
      setIsRecording(false);
      if (interimTranscript.trim()) {
        handleUserSend(interimTranscript);
      }
    } else {
      setIsRecording(true);
      setInterimTranscript('');

      const started = bhashiniAI.startSpeechRecognition(
        language,
        (transcript) => {
          setInterimTranscript(transcript);
        },
        (err) => {
          console.warn('Voice recognition notice:', err);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );

      if (!started) {
        setIsRecording(false);
      }
    }
  };

  const handleActionClick = (actionType: string, payload?: string) => {
    bhashiniAI.stopSpeaking();
    if (actionType === 'EMERGENCY_CALL') {
      setIsEmergencyModalOpen(true);
    } else if (actionType === 'BOOK_TELECONSULT') {
      setIsAiCompanionOpen(false);
      setCurrentView('patient');
      showToast('Navigating to Patient Portal to book Teleconsultation...');
    } else if (actionType === 'FIND_FACILITY') {
      setIsAiCompanionOpen(false);
      setCurrentView('patient');
      showToast('Opening Healthcare Facilities Finder...');
    } else if (actionType === 'CHECK_SCHEME') {
      setIsAiCompanionOpen(false);
      setCurrentView('patient');
      showToast('Opening Maharashtra Government Cashless Schemes...');
    } else if (actionType === 'TALK_TO_ASHA') {
      setIsAiCompanionOpen(false);
      setCurrentView('asha');
      showToast('Opening ASHA Frontline Health Worker Portal...');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <AiSettingsModal isOpen={isAiSettingsOpen} onClose={() => setIsAiSettingsOpen(false)} />
      
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Header with SetuAI Branding */}
        <div className="bg-gradient-to-r from-[#003527] via-[#064e3b] to-[#002117] text-white px-5 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 relative">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
              {currentlySpeakingId && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">SetuAI (सेतू AI)</h3>
                <span className="bg-emerald-400/20 text-emerald-300 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-400/30 uppercase tracking-wider flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  Clinical Triage & Navigator
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">Voice-First Diagnostic Companion for Maharashtra</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-Audio Toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`text-xs font-bold px-2 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${
                autoSpeak ? 'bg-emerald-500/30 border-emerald-400/40 text-emerald-200' : 'bg-white/10 border-white/20 text-slate-400'
              }`}
              title="Toggle Auto Audio Narration"
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-emerald-300" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span className="text-[10px] hidden sm:inline">{autoSpeak ? 'Voice: ON' : 'Voice: OFF'}</span>
            </button>

            {/* Model Config Button */}
            <button
              onClick={() => setIsAiSettingsOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 transition-all"
              title="Configure Groq API Key / Models"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI Config</span>
            </button>

            {/* Language Quick Switch */}
            <div className="flex bg-white/10 p-0.5 rounded-lg text-[11px] font-bold overflow-x-auto max-w-[120px] sm:max-w-none">
              {(['mr', 'hi', 'en', 'or', 'bn', 'ur'] as const).map(langCode => (
                <button
                  key={langCode}
                  onClick={() => setLanguage(langCode)}
                  className={`px-1.5 py-0.5 rounded transition-colors ${language === langCode ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  {langCode === 'mr' ? 'मराठी' : langCode === 'hi' ? 'हिंदी' : langCode.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                bhashiniAI.stopSpeaking();
                setIsAiCompanionOpen(false);
              }}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#003527] text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none space-y-3'
                }`}
              >
                {/* AI Badge header with Bhashini Audio Readout Button */}
                {msg.sender === 'ai' && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-semibold text-emerald-800">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SetuAI</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        msg.groqTriage?.modelUsed?.includes('Groq')
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {msg.groqTriage?.modelUsed || 'SetuAI Engine'}
                      </span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(msg.id, msg.text)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                          currentlySpeakingId === msg.id 
                            ? 'bg-emerald-600 text-white animate-pulse' 
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                        title="Listen in Native Voice"
                      >
                        {currentlySpeakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen (ऐका)</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-slate-400 font-normal">{msg.timestamp}</span>
                    </div>
                  </div>
                )}

                {/* Primary Message Text */}
                <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>

                {/* 1. CLARIFYING DIAGNOSTIC QUESTION WITH QUICK-RESPONSE CHOICE CHIPS */}
                {msg.groqTriage?.clarifyingQuestion && (
                  <div className="bg-emerald-50/90 border border-emerald-300 p-3.5 rounded-2xl space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                      <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{msg.groqTriage.clarifyingQuestion}</span>
                    </div>

                    {msg.groqTriage.choiceChips && msg.groqTriage.choiceChips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.groqTriage.choiceChips.map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleUserSend(chip)}
                            className="bg-white hover:bg-emerald-600 hover:text-white text-emerald-900 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1"
                          >
                            <span>👉</span>
                            <span>{chip}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. GROQ / OFFLINE TRIAGE URGENCY BANNER */}
                {msg.groqTriage && (
                  <div className={`p-3 rounded-xl border text-xs ${
                    msg.groqTriage.urgency === 'red'
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : msg.groqTriage.urgency === 'amber'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <div className="flex items-center justify-between font-bold pb-1 mb-1 border-b border-current/10">
                      <span className="flex items-center gap-1.5">
                        {msg.groqTriage.urgency === 'red' && <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />}
                        {msg.groqTriage.urgency === 'amber' && <Info className="w-4 h-4 text-amber-600" />}
                        {msg.groqTriage.urgency === 'green' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                        <span>
                          {msg.groqTriage.urgency === 'red' && 'RED FLAG: Immediate Emergency'}
                          {msg.groqTriage.urgency === 'amber' && 'AMBER: Urgent Medical Attention Required'}
                          {msg.groqTriage.urgency === 'green' && 'GREEN: Routine Primary Care / Home Care'}
                        </span>
                      </span>
                    </div>

                    <div className="font-bold pt-1">
                      {msg.groqTriage.primaryAssessment}
                    </div>

                    <div className="text-[11px] opacity-90 pt-1">
                      👉 {msg.groqTriage.recommendedAction}
                    </div>

                    {msg.groqTriage.redFlags && msg.groqTriage.redFlags.length > 0 && (
                      <div className="mt-2 pt-1 border-t border-current/10 text-[10px] space-y-0.5">
                        <span className="font-bold block uppercase tracking-wide">⚠️ Warning Red Flags to Monitor:</span>
                        {msg.groqTriage.redFlags.map((rf, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span>•</span>
                            <span>{rf}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. NEAREST PUBLIC HOSPITAL / PHC CARD */}
                {msg.groqTriage?.hospitalCard && (
                  <div className="bg-gradient-to-br from-slate-900 to-[#00241b] text-white p-3.5 rounded-2xl border border-emerald-500/30 shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Nearest Equipped Receiving Facility</span>
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                        📍 {msg.groqTriage.hospitalCard.distanceKm} km away
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-white">
                        {language === 'mr' && msg.groqTriage.hospitalCard.nameMr ? msg.groqTriage.hospitalCard.nameMr : msg.groqTriage.hospitalCard.name}
                      </h4>
                      <p className="text-[11px] text-slate-300">{msg.groqTriage.hospitalCard.type}</p>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] pt-1 border-t border-white/10">
                      <span className="text-emerald-300 font-bold">
                        🛏️ {msg.groqTriage.hospitalCard.availableBeds} General Beds
                      </span>
                      {msg.groqTriage.hospitalCard.icuBeds > 0 && (
                        <span className="text-rose-300 font-bold">
                          🚨 {msg.groqTriage.hospitalCard.icuBeds} ICU Beds
                        </span>
                      )}
                      <span className="text-slate-400">
                        {msg.groqTriage.hospitalCard.isOpen24x7 ? '• Open 24/7' : ''}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href={`tel:${msg.groqTriage.hospitalCard.contactNumber}`}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-all"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call {msg.groqTriage.hospitalCard.contactNumber}</span>
                      </a>
                      <button
                        onClick={() => handleActionClick('BOOK_TELECONSULT')}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1 transition-all"
                      >
                        <Video className="w-3 h-3 text-emerald-300" />
                        <span>Book Teleconsult</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. NEAREST MEDICAL STORE / PHARMACY CARD */}
                {msg.groqTriage?.pharmacyCard && (
                  <div className="bg-amber-50/90 border border-amber-300 p-3 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-900 flex items-center gap-1">
                        <Pill className="w-3.5 h-3.5 text-amber-700" />
                        <span>Nearest Pharmacy & Essential Medicines</span>
                      </span>
                      <span className="bg-amber-200/80 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded">
                        📍 {msg.groqTriage.pharmacyCard.distanceKm} km
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{msg.groqTriage.pharmacyCard.name}</div>
                        <div className="text-[10px] text-slate-600">{msg.groqTriage.pharmacyCard.openStatus}</div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                        {msg.groqTriage.pharmacyCard.stockRate}% Stock Rate
                      </span>
                    </div>

                    <div className="pt-1 flex gap-2">
                      <a
                        href={`tel:${msg.groqTriage.pharmacyCard.contactNumber}`}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call Pharmacy</span>
                      </a>
                      <button
                        onClick={() => handleActionClick('FIND_FACILITY')}
                        className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs border border-slate-300 flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3 text-slate-600" />
                        <span>Check Availability</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. SAFE HOME REMEDIES & FIRST AID PILL LIST */}
                {msg.groqTriage?.homeRemedies && msg.groqTriage.homeRemedies.length > 0 && (
                  <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl space-y-1.5 text-xs">
                    <div className="text-emerald-950 font-bold flex items-center gap-1.5 pb-1 border-b border-emerald-200/60">
                      <HeartHandshake className="w-4 h-4 text-emerald-700" />
                      <span>{language === 'mr' ? 'सुरक्षित प्राथमिक / घरगुती उपाय:' : language === 'hi' ? 'सुरक्षित प्राथमिक एवं घरेलू उपाय:' : 'Safe Home Care & First Aid Tips:'}</span>
                    </div>
                    {msg.groqTriage.homeRemedies.map((remedy, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-700 pt-0.5">
                        <span className="text-emerald-600 font-bold">🌿</span>
                        <span>{remedy}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 6. GROQ MATCHED GOVERNMENT SCHEMES CARD */}
                {msg.groqTriage?.matchedSchemes && msg.groqTriage.matchedSchemes.length > 0 && (
                  <div className="bg-emerald-50/90 border border-emerald-300 p-3 rounded-2xl shadow-xs">
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 pb-1 border-b border-emerald-200/80">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Applicable Maharashtra & National Govt Schemes (100% Cashless):</span>
                    </div>
                    <div className="space-y-2 pt-2">
                      {msg.groqTriage.matchedSchemes.map((sch, idx) => (
                        <div key={idx} className="text-xs bg-white p-2.5 rounded-lg border border-emerald-200">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-900">{sch.name}</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              {sch.coverageAmount}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700 mt-1">{sch.benefit}</p>
                          {sch.documentsRequired && (
                            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                              <FileText className="w-3 h-3 text-slate-400" />
                              <span>Documents: {sch.documentsRequired.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. QUICK ACTION BUTTONS */}
                {msg.groqTriage?.suggestedActionButtons && msg.groqTriage.suggestedActionButtons.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                    {msg.groqTriage.suggestedActionButtons.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(btn.actionType, btn.actionPayload)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 ${
                          btn.actionType === 'EMERGENCY_CALL'
                            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                            : 'bg-[#003527] hover:bg-[#064e3b] text-white'
                        }`}
                      >
                        {btn.actionType === 'EMERGENCY_CALL' && <PhoneCall className="w-3.5 h-3.5" />}
                        {btn.actionType === 'BOOK_TELECONSULT' && <Video className="w-3.5 h-3.5 text-emerald-300" />}
                        {btn.actionType === 'CHECK_SCHEME' && <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />}
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 text-xs bg-white p-3 rounded-2xl max-w-fit shadow-xs border border-slate-200">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>SetuAI is clinically evaluating symptoms & locating nearest facilities...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Live Audio Waveform & Speech Recognition Bar when Listening */}
        {isRecording && (
          <div className="bg-red-50 border-t-2 border-red-500 p-3 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom duration-150">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
              <div className="text-xs font-bold text-red-950">
                <span>Listening in {language.toUpperCase()}...</span>
                {interimTranscript && (
                  <span className="italic font-normal text-slate-800 ml-1.5">“{interimTranscript}”</span>
                )}
              </div>
            </div>

            <button
              onClick={toggleVoiceRecording}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
            >
              Done / Send
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button with Silence & Voice Detection */}
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-3 rounded-2xl transition-all shadow-md flex items-center justify-center shrink-0 ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title="Speak in Marathi, Hindi, Odia, Bengali, Urdu or English"
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                language === 'mr' 
                  ? 'तुमची लक्षणे सांगा (उदा. २ दिवसांपासून तीव्र ताप व डोकेदुखी आहे)...' 
                  : language === 'hi'
                  ? 'अपने लक्षण बताएं (उदा. 2 दिन से तेज बुखार और सिरदर्द है)...'
                  : 'Describe your symptoms or ask in your native language...'
              }
              className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="bg-[#003527] hover:bg-[#064e3b] disabled:bg-slate-300 text-white p-3 rounded-2xl transition-all shadow-md flex items-center justify-center shrink-0 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <p className="text-[10px] text-slate-400 text-center mt-2">
            SetuAI provides clinical decision support. In critical life-threatening emergencies, call 108 immediately.
          </p>
        </div>

      </div>
    </div>
  );
};
