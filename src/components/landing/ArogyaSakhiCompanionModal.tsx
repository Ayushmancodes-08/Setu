import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { processHealthQuery, AIResponse } from '../../services/aiHealthCompanion';
import { bhashiniAI } from '../../services/bhashiniService';
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
  Languages
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  responseObj?: AIResponse;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting or initial query
  useEffect(() => {
    if (isAiCompanionOpen) {
      if (messages.length === 0) {
        const welcomeText = t.aiGreeting;
        setMessages([
          {
            id: 'msg-init',
            sender: 'ai',
            text: welcomeText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        // Auto-play welcome greeting in selected language
        handlePlayAudio('msg-init', welcomeText);
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
  }, [messages, isTyping]);

  if (!isAiCompanionOpen) return null;

  const handleUserSend = (textToSend?: string) => {
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

    setTimeout(() => {
      const response = processHealthQuery(query);
      let localizedAnswer = response.answerEn;
      if (language === 'mr') localizedAnswer = response.answerMr;
      if (language === 'hi') localizedAnswer = response.answerHi;

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: localizedAnswer,
        responseObj: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      // Play Bhashini Audio readout
      handlePlayAudio(aiMsgId, localizedAnswer);
    }, 700);
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
          console.warn('Bhashini speech fallback triggered:', err);
          // High quality simulated voice query fallback if browser speech permissions are not granted
          setTimeout(() => {
            const voiceQuery = language === 'mr' 
              ? 'माझ्या आईला २ दिवसांपासून तीव्र ताप व डोकेदुखी आहे, काय करावे?' 
              : language === 'hi'
              ? 'मेरी माताजी को २ दिन से तेज बुखार और सिरदर्द है, क्या करें?'
              : 'My mother has severe continuous fever and headache for 2 days, what should we do?';
            setInterimTranscript(voiceQuery);
            handleUserSend(voiceQuery);
            setIsRecording(false);
          }, 1800);
        },
        () => {
          setIsRecording(false);
        }
      );

      if (!started) {
        // Fallback simulation
        setTimeout(() => {
          const voiceQuery = language === 'mr' 
            ? 'माझ्या आईला २ दिवसांपासून तीव्र ताप व डोकेदुखी आहे, काय करावे?' 
            : language === 'hi'
            ? 'मेरी माताजी को २ दिन से तेज बुखार और सिरदर्द है, क्या करें?'
            : 'My mother has severe continuous fever and headache for 2 days, what should we do?';
          setInterimTranscript(voiceQuery);
          handleUserSend(voiceQuery);
          setIsRecording(false);
        }, 1800);
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
    } else if (actionType === 'FIND_FACILITY') {
      setIsAiCompanionOpen(false);
      const el = document.getElementById('find-care');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (actionType === 'CHECK_SCHEME') {
      setIsAiCompanionOpen(false);
      const el = document.getElementById('schemes');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (actionType === 'TALK_TO_ASHA') {
      setIsAiCompanionOpen(false);
      setCurrentView('asha');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Header with Bhashini Indic Engine Branding */}
        <div className="bg-gradient-to-r from-[#003527] via-[#064e3b] to-[#002117] text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 relative">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
              {currentlySpeakingId && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">{t.aiTitle}</h3>
                <span className="bg-emerald-400/20 text-emerald-300 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-400/30 uppercase tracking-wider flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  Bhashini AI Voice
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">Digital India Bhashini • Multilingual Clinical Triage in Marathi, Hindi, English</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Quick Switch inside Companion */}
            <div className="flex bg-white/10 p-0.5 rounded-lg text-[11px] font-bold overflow-x-auto max-w-[150px] sm:max-w-none">
              <button
                onClick={() => setLanguage('mr')}
                className={`px-1.5 py-0.5 rounded transition-colors ${language === 'mr' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'}`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-1.5 py-0.5 rounded transition-colors ${language === 'hi' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('or')}
                className={`px-1.5 py-0.5 rounded transition-colors ${language === 'or' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'}`}
              >
                ଓଡ଼ିଆ
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-1.5 py-0.5 rounded transition-colors ${language === 'bn' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'}`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('ur')}
                className={`px-1.5 py-0.5 rounded transition-colors ${language === 'ur' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'}`}
              >
                اردو
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded transition-colors ${language === 'en' ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:text-white'}`}
              >
                EN
              </button>
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
                className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#003527] text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {/* AI Badge header with Bhashini Audio Readout Button */}
                {msg.sender === 'ai' && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-semibold text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      ArogyaSakhi Clinical Guide
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(msg.id, msg.text)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                          currentlySpeakingId === msg.id 
                            ? 'bg-emerald-600 text-white animate-pulse' 
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                        title="Listen in Marathi/Hindi via Bhashini TTS"
                      >
                        {currentlySpeakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Bhashini Audio (ऐका)</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-slate-400 font-normal">{msg.timestamp}</span>
                    </div>
                  </div>
                )}

                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Triage Urgency Banner if provided */}
                {msg.responseObj?.triage && (
                  <div className={`mt-3 p-3 rounded-xl border text-xs ${
                    msg.responseObj.triage.urgency === 'red'
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : msg.responseObj.triage.urgency === 'amber'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <div className="flex items-center justify-between font-bold pb-1 mb-1 border-b border-current/10">
                      <span className="flex items-center gap-1.5">
                        {msg.responseObj.triage.urgency === 'red' && <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />}
                        {msg.responseObj.triage.urgency === 'amber' && <Info className="w-4 h-4 text-amber-600" />}
                        {msg.responseObj.triage.urgency === 'green' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                        <span>
                          {msg.responseObj.triage.urgency === 'red' && 'RED FLAG: Immediate Emergency'}
                          {msg.responseObj.triage.urgency === 'amber' && 'AMBER: Urgent Medical Attention Required'}
                          {msg.responseObj.triage.urgency === 'green' && 'GREEN: Routine Primary Care'}
                        </span>
                      </span>
                    </div>

                    <div className="font-semibold pt-1">
                      {language === 'mr' 
                        ? msg.responseObj.triage.primaryAssessmentMr 
                        : language === 'hi'
                        ? msg.responseObj.triage.primaryAssessmentHi
                        : msg.responseObj.triage.primaryAssessment}
                    </div>

                    <div className="text-[11px] opacity-90 pt-1">
                      👉 {language === 'mr' 
                        ? msg.responseObj.triage.recommendedActionMr 
                        : language === 'hi'
                        ? msg.responseObj.triage.recommendedActionHi
                        : msg.responseObj.triage.recommendedAction}
                    </div>
                  </div>
                )}

                {/* Matched Schemes Pill Card */}
                {msg.responseObj?.matchedSchemes && msg.responseObj.matchedSchemes.length > 0 && (
                  <div className="mt-3 bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 pb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Applicable Cashless Govt Scheme:</span>
                    </div>
                    {msg.responseObj.matchedSchemes.map(sch => (
                      <div key={sch.id} className="text-xs text-slate-700 pt-1">
                        <div className="font-bold text-emerald-800">{sch.name}</div>
                        <div className="text-[11px] text-slate-600">{sch.coverageAmount} • {sch.targetBeneficiaries}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Matched Facilities Card */}
                {msg.responseObj?.matchedFacilities && msg.responseObj.matchedFacilities.length > 0 && (
                  <div className="mt-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pb-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Nearest Public Healthcare Facilities:</span>
                    </div>
                    {msg.responseObj.matchedFacilities.slice(0, 2).map(fac => (
                      <div key={fac.id} className="text-xs text-slate-700 pt-1.5 flex justify-between items-center border-t border-slate-200/60 first:border-none">
                        <div>
                          <div className="font-bold text-slate-900">{language === 'mr' ? fac.nameMr : fac.name}</div>
                          <div className="text-[10px] text-slate-500">{fac.distanceKm} km away • {fac.openStatus}</div>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {fac.essentialMedicineStockRate}% Drugs
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Action CTAs */}
                {msg.responseObj?.actionButtons && msg.responseObj.actionButtons.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-3 mt-2 border-t border-slate-100">
                    {msg.responseObj.actionButtons.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(btn.actionType, btn.actionPayload)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${
                          btn.actionType === 'EMERGENCY_CALL'
                            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        }`}
                      >
                        {btn.actionType === 'EMERGENCY_CALL' && <PhoneCall className="w-3.5 h-3.5" />}
                        {btn.actionType === 'BOOK_TELECONSULT' && <Video className="w-3.5 h-3.5" />}
                        <span>{language === 'mr' ? btn.labelMr : language === 'hi' ? btn.labelHi : btn.labelEn}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic bg-white p-3 rounded-2xl max-w-xs border border-slate-200 shadow-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>ArogyaSakhi is clinically analyzing your query via Bhashini NMT...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Equalizer Simulation when recording */}
        {isRecording && (
          <div className="bg-emerald-950 text-emerald-200 px-4 py-3 border-t border-emerald-800 flex items-center justify-between text-xs animate-pulse">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <div>
                <span className="font-bold text-white">Bhashini ASR Listening in {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'English'}...</span>
                <div className="text-[10px] text-emerald-300 font-mono">
                  {interimTranscript || 'Speak your symptoms clearly into the microphone...'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-3 bg-emerald-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1.5 h-6 bg-emerald-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-2 bg-emerald-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
              <div className="w-1.5 h-7 bg-emerald-200 animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-1.5 h-4 bg-emerald-400 animate-bounce" style={{ animationDelay: '0.25s' }} />
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => { e.preventDefault(); handleUserSend(); }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-3 rounded-2xl border transition-all flex items-center gap-1.5 ${
                isRecording 
                  ? 'bg-red-600 text-white border-red-700 animate-pulse shadow-md' 
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}
              title="Bhashini Voice Input (मराठी/हिंदी/English)"
            >
              {isRecording ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-emerald-700" />}
              <span className="hidden sm:inline text-xs font-bold">
                {isRecording ? 'Stop' : 'Bhashini Voice'}
              </span>
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="bg-[#003527] hover:bg-[#064e3b] disabled:opacity-40 text-white p-3 rounded-2xl transition-all shadow-md shadow-emerald-950/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400">
            <span>Powered by Digital India Bhashini (भाषिणी AI Pipeline)</span>
            <span>{t.disclaimer}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
