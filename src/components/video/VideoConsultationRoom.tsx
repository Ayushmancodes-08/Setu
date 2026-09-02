import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { bhashiniAI } from '../../services/bhashiniService';
import { 
  teleconsultVideo, 
  VideoSessionConfig, 
  InCallMessage,
  LiveCaption
} from '../../services/teleconsultVideoService';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Share2, 
  MessageSquare, 
  Settings, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  Volume2, 
  Languages, 
  Send, 
  FileText, 
  Pill, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users, 
  ChevronRight, 
  X,
  Stethoscope,
  Smile,
  Zap,
  Radio
} from 'lucide-react';

interface VideoConsultationRoomProps {
  isOpen: boolean;
  onClose: () => void;
  config: VideoSessionConfig;
  patientVitals?: {
    bp?: string;
    pulse?: string;
    spo2?: string;
    sugar?: string;
    temp?: string;
  };
  onIssuePrescription?: () => void;
}

export const VideoConsultationRoom: React.FC<VideoConsultationRoomProps> = ({
  isOpen,
  onClose,
  config,
  patientVitals = { bp: '138/88 mmHg', pulse: '78 bpm', spo2: '98%', sugar: '142 mg/dL', temp: '98.6 °F' },
  onIssuePrescription
}) => {
  const { language, showToast, t } = useApp();
  
  // Streams and states
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker' | 'presentation'>('speaker');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVirtualBgEnabled, setIsVirtualBgEnabled] = useState(false);
  
  // Drawers
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVitalsHudOpen, setIsVitalsHudOpen] = useState(true);
  const [isCaptionsEnabled, setIsCaptionsEnabled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSimulatedRemoteCamera, setIsSimulatedRemoteCamera] = useState(true);

  // Chat
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<InCallMessage[]>([]);

  // Captions & Live Transcripts
  const [currentCaption, setCurrentCaption] = useState<LiveCaption | null>(null);

  // Call Duration Timer
  const [durationSeconds, setDurationSeconds] = useState(0);

  // Video Element Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initial call mounting
  useEffect(() => {
    if (!isOpen) return;

    teleconsultVideo.initCall(config);
    setMessages(teleconsultVideo.getMessages());

    // Request local camera and microphone
    let isMounted = true;
    teleconsultVideo.startLocalMedia(true, true).then((stream) => {
      if (isMounted) {
        setLocalStream(stream);
      }
    });

    const unsubscribe = teleconsultVideo.subscribe(() => {
      if (isMounted) {
        setRemoteStream(teleconsultVideo.getRemoteStream());
        setIsAudioMuted(teleconsultVideo.getIsAudioMuted());
        setIsVideoMuted(teleconsultVideo.getIsVideoMuted());
        setIsScreenSharing(teleconsultVideo.getIsScreenSharing());
        setMessages([...teleconsultVideo.getMessages()]);
        setCurrentCaption(teleconsultVideo.getCurrentCaption());
      }
    });

    // Call duration timer
    const timer = setInterval(() => {
      setDurationSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      isMounted = false;
      unsubscribe();
      clearInterval(timer);
      teleconsultVideo.endCall();
    };
  }, [isOpen, config]);

  // Bind local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isVideoMuted]);

  // Bind remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleToggleAudio = () => {
    const muted = teleconsultVideo.toggleAudio();
    setIsAudioMuted(muted);
    showToast(muted ? 'Microphone Muted' : 'Microphone Unmuted');
  };

  const handleToggleVideo = () => {
    const videoOff = teleconsultVideo.toggleVideo();
    setIsVideoMuted(videoOff);
    showToast(videoOff ? 'Camera Turned Off' : 'Camera Turned On');
  };

  const handleToggleScreenShare = async () => {
    const stream = await teleconsultVideo.toggleScreenShare();
    setIsScreenSharing(!!stream);
    if (stream) {
      showToast('Screen Sharing Active');
      setViewMode('presentation');
    } else {
      showToast('Screen Sharing Ended');
      setViewMode('speaker');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    teleconsultVideo.sendMessage(chatInput.trim());
    setChatInput('');
  };

  const handleSendQuickAdvice = (text: string) => {
    teleconsultVideo.sendMessage(text, true);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const stats = teleconsultVideo.getStats();

  // Minimized PiP View Widget
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-3xl p-4 shadow-2xl border-2 border-emerald-500/60 w-80 animate-in fade-in slide-in-from-bottom-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold truncate">{config.remoteParticipantName}</span>
          </div>
          <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold">
            {formatTimer(durationSeconds)}
          </span>
        </div>

        <div className="py-3 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Teleconsultation in Progress</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleAudio}
              className={`p-2 rounded-full ${isAudioMuted ? 'bg-red-600' : 'bg-slate-800 text-emerald-400'}`}
            >
              {isAudioMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleToggleVideo}
              className={`p-2 rounded-full ${isVideoMuted ? 'bg-red-600' : 'bg-slate-800 text-emerald-400'}`}
            >
              {isVideoMuted ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-full"
              title="Expand Room"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
              title="End Call"
            >
              <PhoneOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden text-white font-sans selection:bg-emerald-600"
    >
      {/* 1. TOP BAR (ROOM STATUS, TIMER & UTILITIES) */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0 shadow-lg z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shadow-md">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm sm:text-base text-white truncate">
                {config.remoteParticipantName}
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                {config.remoteParticipantRole.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>Token: <strong className="text-slate-200 font-mono">{config.appointmentToken || 'TELE-9921'}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">e-Sanjeevani Verified Hub</span>
            </p>
          </div>
        </div>

        {/* Middle: Live Call Timer & Network Quality Indicator */}
        <div className="hidden sm:flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-xs font-bold text-white">{formatTimer(durationSeconds)}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300 font-semibold">{stats.latencyMs}ms ({stats.resolution})</span>
          </div>
        </div>

        {/* Right Action Icons: View Modes, Fullscreen, Minimize, Close */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* View Mode Toggle */}
          <div className="hidden md:flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setViewMode('speaker')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${viewMode === 'speaker' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Speaker View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              50/50 Grid
            </button>
            <button
              onClick={() => setViewMode('presentation')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${viewMode === 'presentation' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Prescription View
            </button>
          </div>

          <button
            onClick={() => setIsVitalsHudOpen(!isVitalsHudOpen)}
            className={`p-2 rounded-xl border text-xs transition-all font-bold ${
              isVitalsHudOpen 
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Live Vitals Overlay"
          >
            <Activity className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Minimize to Picture-in-Picture"
          >
            <Minimize2 className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="hidden sm:block p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Fullscreen Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN VIDEO VIEWPORT CANVAS */}
      <div className="flex-1 relative flex overflow-hidden p-3 sm:p-5 gap-4">
        
        {/* Left/Main Video Container */}
        <div className="flex-1 relative flex flex-col justify-between rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-2xl">
          
          {/* Dynamic Grid Layouts */}
          <div className={`w-full h-full p-2 sm:p-4 grid gap-3 sm:gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2' 
              : viewMode === 'presentation'
              ? 'grid-cols-1 lg:grid-cols-12'
              : 'grid-cols-1'
          }`}>

            {/* SCREEN SHARE / CLINICAL PRESENTATION VIEW */}
            {viewMode === 'presentation' && (
              <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <FileText className="w-4 h-4" />
                    <span>Live Prescription & Diagnostic Reports Screen</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded">
                    Interactive Live Canvas
                  </span>
                </div>

                {/* Prescription & Clinical Vitals Live Sheet */}
                <div className="my-auto space-y-4 max-w-lg mx-auto w-full bg-slate-900/90 p-5 rounded-2xl border border-slate-700 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-white">e-Prescription & Vitals Summary</h4>
                      <p className="text-[11px] text-slate-400">Patient: {config.participantName}</p>
                    </div>
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-[10px] font-bold">
                      Active Teleconsult
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <div><span className="text-slate-500">Blood Pressure:</span> <strong className="text-white">{patientVitals.bp}</strong></div>
                    <div><span className="text-slate-500">Pulse:</span> <strong className="text-white">{patientVitals.pulse}</strong></div>
                    <div><span className="text-slate-500">SpO2 Oxygen:</span> <strong className="text-emerald-400">{patientVitals.spo2}</strong></div>
                    <div><span className="text-slate-500">Blood Glucose:</span> <strong className="text-white">{patientVitals.sugar}</strong></div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Prescribed Formulations:</span>
                    <div className="bg-slate-950 p-2.5 rounded-xl text-xs space-y-1 text-slate-200">
                      <div className="font-bold text-emerald-400">1. Ferrous Ascorbate + Folic Acid (100mg + 1.5mg)</div>
                      <div className="text-[11px] text-slate-400">1 Tab • 1-0-1 (Twice Daily after meals) • 30 Days</div>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl text-xs space-y-1 text-slate-200">
                      <div className="font-bold text-teal-400">2. Calcium Carbonate + Vitamin D3 (500mg + 250IU)</div>
                      <div className="text-[11px] text-slate-400">1 Tab • 0-1-0 (Afternoon with water) • 30 Days</div>
                    </div>
                  </div>

                  {config.userRole === 'doctor' && onIssuePrescription && (
                    <button
                      onClick={onIssuePrescription}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>Issue & Sign e-Prescription</span>
                    </button>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 text-center pt-2">
                  Encrypted Health Information Exchange (ABDM / e-Sanjeevani Grid)
                </div>
              </div>
            )}

            {/* REMOTE PARTICIPANT STREAM (DOCTOR / PATIENT) */}
            <div className={`relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/80 overflow-hidden flex flex-col justify-between p-4 shadow-inner ${
              viewMode === 'presentation' ? 'lg:col-span-4 h-full' : 'h-full min-h-[300px]'
            }`}>
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-radial from-emerald-900/10 via-transparent to-black/60 pointer-events-none" />

              {/* Remote Header Bar */}
              <div className="relative z-10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">{config.remoteParticipantName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({config.remoteParticipantRole})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSimulatedRemoteCamera(!isSimulatedRemoteCamera)}
                    className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-full text-[10px] font-bold border border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <Video className="w-3 h-3 text-emerald-400" />
                    <span>{isSimulatedRemoteCamera ? 'Feed: Live Video' : 'Feed: Avatar'}</span>
                  </button>
                  <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-full text-[10px] text-emerald-400 font-bold border border-emerald-500/20">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>1080p 60fps</span>
                  </div>
                </div>
              </div>

              {/* Remote Stream Center Visualizer / Real WebRTC Stream */}
              {remoteStream ? (
                <div className="absolute inset-0 w-full h-full bg-black">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-16 left-4 z-10 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>⚡ Live WebRTC Remote Video Feed</span>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 my-auto flex flex-col items-center justify-center gap-4 py-4 w-full h-full max-h-[460px]">
                  {/* Full Interactive Video Feed Card */}
                  <div className="relative w-full max-w-lg aspect-video rounded-3xl bg-gradient-to-tr from-slate-950 via-teal-950/80 to-slate-900 border-2 border-emerald-500/40 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
                    {/* Scanlines & Camera Grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
                    
                    {/* Top HUD */}
                    <div className="flex items-center justify-between text-[11px] z-10">
                      <span className="bg-red-600 text-white font-black px-2.5 py-0.5 rounded-full tracking-wider flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        LIVE STREAM
                      </span>
                      <span className="font-mono text-emerald-300 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-[10px]">
                        1080p FHD • 60 FPS
                      </span>
                    </div>

                    {/* Central Face Portrait Display */}
                    <div className="flex flex-col items-center justify-center gap-2.5 my-auto z-10">
                      <div className="relative">
                        <div className="absolute -inset-2 rounded-full bg-emerald-500/20 animate-pulse" />
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-teal-700 via-emerald-600 to-teal-900 border-3 border-emerald-400 shadow-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-white relative z-10">
                          {config.userRole === 'doctor' ? '👨‍🌾' : '👩‍⚕️'}
                        </div>
                        <span className="absolute bottom-0 right-0 bg-emerald-500 text-slate-950 p-1.5 rounded-full shadow-lg z-20 border-2 border-slate-900">
                          <Volume2 className="w-4 h-4 animate-bounce" />
                        </span>
                      </div>

                      <div className="text-center">
                        <div className="font-black text-sm sm:text-base text-white drop-shadow-md">
                          {config.remoteParticipantName}
                        </div>
                        <div className="text-[11px] text-emerald-300 font-medium flex items-center justify-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{config.remoteParticipantRole} • Connected</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Telemetry Strip */}
                    <div className="flex items-center justify-between text-[10px] text-slate-300 z-10 bg-black/50 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-slate-800">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        <span>Speaking • High-Fidelity Audio Linked</span>
                      </span>
                      <span className="font-mono text-slate-400">e-Sanjeevani ABDM Protocol</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Remote Stream Footer HUD */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <span>Location: Junnar Rural Hospital Hub</span>
                <span className="font-mono text-emerald-400">Echo Cancelled • Dual Test Active</span>
              </div>
            </div>

            {/* LOCAL PARTICIPANT STREAM (YOU) */}
            <div className={`relative rounded-2xl bg-slate-950 border border-slate-700/80 overflow-hidden flex flex-col justify-between p-4 shadow-inner ${
              viewMode === 'speaker' 
                ? 'absolute bottom-6 right-6 w-48 sm:w-64 h-36 sm:h-48 z-20 shadow-2xl border-2 border-emerald-500/60' 
                : viewMode === 'presentation'
                ? 'hidden'
                : 'h-full min-h-[300px]'
            }`}>
              
              {/* Local Real Video Element or Avatar Fallback */}
              {!isVideoMuted && localStream ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover -scale-x-100 ${isVirtualBgEnabled ? 'blur-[1px]' : ''}`}
                />
              ) : (
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-teal-900/80 border border-teal-500/40 text-teal-200 flex items-center justify-center text-xl font-bold">
                    {config.participantName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Camera Disabled</span>
                </div>
              )}

              {/* Local Overlay Header */}
              <div className="relative z-10 flex items-center justify-between text-xs">
                <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white border border-slate-700">
                  You ({config.participantName})
                </span>
                {isAudioMuted && (
                  <span className="bg-red-600 text-white p-1 rounded-full shadow-xs">
                    <MicOff className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Local Overlay Footer */}
              <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-300 bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 rounded-md">
                <span>Local Spoke</span>
                <span className="text-emerald-400 font-mono">Live</span>
              </div>
            </div>

          </div>

          {/* 4. LIVE VITALS HUD OVERLAY (BP, PULSE, SPO2) */}
          {isVitalsHudOpen && (
            <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-xl space-y-2 text-xs max-w-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <div className="flex items-center gap-1.5 text-teal-400 font-bold text-[11px]">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Live Patient Vitals HUD</span>
                </div>
                <button onClick={() => setIsVitalsHudOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Blood Pressure</span>
                  <span className="font-extrabold text-white">{patientVitals.bp}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Pulse Rate</span>
                  <span className="font-extrabold text-white">{patientVitals.pulse}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Blood SpO2</span>
                  <span className="font-extrabold text-emerald-400">{patientVitals.spo2}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[9px] uppercase">Blood Sugar</span>
                  <span className="font-extrabold text-white">{patientVitals.sugar}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 5. IN-CALL CHAT & CLINICAL DRAWER */}
        {isChatOpen && (
          <div className="w-80 sm:w-96 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-2xl p-4 animate-in slide-in-from-right-4 duration-200 z-30 shrink-0">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-xs">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>In-Call Clinical Consultation Chat</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto my-3 space-y-2.5 pr-1 text-xs">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`p-3 rounded-2xl ${
                    msg.senderRole === 'system'
                      ? 'bg-slate-950/80 text-slate-400 text-[10px] text-center border border-slate-800'
                      : msg.sender === config.participantName
                      ? 'bg-emerald-700 text-white ml-auto max-w-[85%]'
                      : 'bg-slate-800 text-slate-200 mr-auto max-w-[85%] border border-slate-700'
                  }`}
                >
                  {msg.senderRole !== 'system' && (
                    <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 mb-1 font-bold">
                      <span>{msg.sender}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}
                  <p className="leading-snug">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Quick Doctor Shortcuts */}
            {config.userRole === 'doctor' && (
              <div className="py-2 border-t border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Quick Clinical Directives:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    onClick={() => handleSendQuickAdvice("Please check your BP once more with ASHA worker.")}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700"
                  >
                    + Check BP Again
                  </button>
                  <button 
                    onClick={() => handleSendQuickAdvice("Drink warm water and rest for 20 minutes.")}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700"
                  >
                    + Rest Advice
                  </button>
                  <button 
                    onClick={() => handleSendQuickAdvice("Your e-Prescription has been generated and signed.")}
                    className="text-[10px] bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-700/60 font-bold"
                  >
                    + Rx Ready
                  </button>
                </div>
              </div>
            )}

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Type in-call message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>

      {/* 6. ZOOM-STYLE FLOATING BOTTOM CONTROL PANEL */}
      <div className="bg-slate-900/95 border-t border-slate-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xl z-30">
        
        {/* Left: Device & Filter Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVirtualBgEnabled(!isVirtualBgEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              isVirtualBgEnabled 
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Blur Background"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Blur Background</span>
          </button>
        </div>

        {/* Center: Core Zoom Control Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* MUTE / UNMUTE AUDIO */}
          <button
            onClick={handleToggleAudio}
            className={`p-3 sm:px-5 sm:py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
              isAudioMuted 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
            <span className="hidden md:inline">{isAudioMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* START / STOP VIDEO */}
          <button
            onClick={handleToggleVideo}
            className={`p-3 sm:px-5 sm:py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
              isVideoMuted 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4 text-emerald-400" />}
            <span className="hidden md:inline">{isVideoMuted ? 'Start Video' : 'Stop Video'}</span>
          </button>

          {/* SCREEN SHARE / PRESENTATION */}
          <button
            onClick={handleToggleScreenShare}
            className={`p-3 sm:px-5 sm:py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border shadow-lg ${
              isScreenSharing 
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-600/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            <Share2 className="w-4 h-4 text-teal-400" />
            <span className="hidden md:inline">{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
          </button>

          {/* IN-CALL CHAT */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`p-3 sm:px-5 sm:py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border shadow-lg ${
              isChatOpen 
                ? 'bg-blue-600 text-white border-blue-400 shadow-blue-600/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">Chat ({messages.length})</span>
          </button>

          {/* END / LEAVE CALL */}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to end this teleconsultation call?')) {
                onClose();
                showToast('Teleconsultation ended. Clinical records synchronized.');
              }
            }}
            className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black py-3 px-5 sm:px-6 rounded-2xl text-xs transition-all shadow-xl shadow-red-600/30 flex items-center gap-2 active:scale-95"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>

        </div>

        {/* Right: e-Rx Fast CTA for Doctors */}
        <div className="flex items-center gap-2">
          {config.userRole === 'doctor' && onIssuePrescription && (
            <button
              onClick={onIssuePrescription}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md"
            >
              <Pill className="w-3.5 h-3.5" />
              <span>e-Prescription</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
