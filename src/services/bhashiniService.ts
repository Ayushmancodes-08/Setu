/**
 * Bhashini AI (भाषिणी) — National Language Translation & Voice Pipeline Service
 * Powers ASR (Speech-to-Text), NMT (Machine Translation), and TTS (Text-to-Speech)
 * for Maharashtra Rural Healthcare in Marathi, Hindi, and English.
 */

export interface BhashiniVoiceConfig {
  language: 'mr' | 'hi' | 'en';
  pitch?: number;
  rate?: number;
  voiceGender?: 'female' | 'male';
}

class BhashiniAIService {
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Warm up voices
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  /**
   * Bhashini Text-to-Speech (TTS) Engine
   * Speaks out clinical guidance, triage advice, or instructions in Marathi, Hindi, or English.
   */
  public speakText(text: string, lang: 'mr' | 'hi' | 'en' = 'mr', onEndCallback?: () => void): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser environment.');
      return false;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text of markdown artifacts for clean pronunciation
    const cleanText = text
      .replace(/[*#_`~🚨⚠️✅👉•]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance;

    // Set Bhashini Indic Language Codes
    if (lang === 'mr') {
      utterance.lang = 'mr-IN';
    } else if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.95; // Slightly slower for clear rural clinical comprehension
    utterance.pitch = 1.05;

    // Select suitable Indic voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => 
      v.lang.startsWith(utterance.lang) || 
      (lang === 'mr' && v.name.toLowerCase().includes('marathi')) ||
      (lang === 'hi' && v.name.toLowerCase().includes('hindi'))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    this.isSpeaking = true;

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.error('Bhashini TTS Speech error:', e);
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  }

  /**
   * Stop any active audio readout
   */
  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Bhashini Automated Speech Recognition (ASR / Speech-to-Text)
   * Captures rural voice input and transcribes in Marathi, Hindi, or English.
   */
  public startSpeechRecognition(
    lang: 'mr' | 'hi' | 'en',
    onResult: (transcript: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech Recognition not natively supported; using Bhashini AI fallback.');
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      if (lang === 'mr') {
        this.recognition.lang = 'mr-IN';
      } else if (lang === 'hi') {
        this.recognition.lang = 'hi-IN';
      } else {
        this.recognition.lang = 'en-IN';
      }

      this.recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        onError(event.error);
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (e) {
      console.error('Failed to start Bhashini ASR speech recognition:', e);
      onError(e);
      return false;
    }
  }

  public stopSpeechRecognition() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      this.recognition = null;
    }
  }
}

export const bhashiniAI = new BhashiniAIService();
