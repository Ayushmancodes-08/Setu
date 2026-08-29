import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { groqAI, GroqConfig } from '../../services/groqAiService';
import { huggingFaceAI } from '../../services/huggingFaceService';
import { 
  Cpu, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  X, 
  Server, 
  ExternalLink, 
  ShieldCheck, 
  Layers,
  Zap,
  Flame,
  Bot
} from 'lucide-react';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({ isOpen, onClose }) => {
  const { showToast, language } = useApp();
  const [provider, setProvider] = useState<'groq' | 'grok' | 'huggingface' | 'native'>('groq');
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('llama-3.3-70b-versatile');
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = groqAI.loadConfig();
      setProvider(cfg.provider || 'groq');
      setApiKey(cfg.apiKey || '');
      setSelectedModel(cfg.model || 'llama-3.3-70b-versatile');
      setIsEnabled(cfg.isEnabled !== false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProviderChange = (newProvider: 'groq' | 'grok' | 'huggingface' | 'native') => {
    setProvider(newProvider);
    if (newProvider === 'groq') {
      setSelectedModel('llama-3.3-70b-versatile');
    } else if (newProvider === 'grok') {
      setSelectedModel('grok-beta');
    } else if (newProvider === 'huggingface') {
      setSelectedModel('Qwen/Qwen2.5-7B-Instruct');
    }
  };

  const handleSave = () => {
    groqAI.saveConfig({
      apiKey: apiKey.trim(),
      provider,
      model: selectedModel,
      isEnabled: provider !== 'native' && isEnabled
    });

    if (provider === 'huggingface') {
      huggingFaceAI.saveConfig({
        apiKey: apiKey.trim(),
        triageModel: selectedModel,
        isEnabled: isEnabled && !!apiKey.trim()
      });
    }

    showToast(
      provider === 'native' 
        ? 'Using Setu Native Offline Clinical Engine.' 
        : `${provider.toUpperCase()} AI Engine Activated with ${selectedModel}!`
    );
    onClose();
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim() && provider !== 'native') {
      showToast(`Please enter your ${provider.toUpperCase()} API Key first.`);
      return;
    }

    setIsTesting(true);
    try {
      groqAI.saveConfig({ apiKey: apiKey.trim(), provider, model: selectedModel, isEnabled: true });
      const res = await groqAI.runSymptomAndSchemeTriage('मुझे बुखार और बदन दर्द है', language);
      showToast(`Success! Connected to ${res.modelUsed}`);
      setIsEnabled(true);
    } catch (e) {
      showToast(`Connection test failed for ${provider.toUpperCase()}. Check API key.`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                AI Engine & Clinical LLM Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Train & power Symptom Checker, Scheme Predictor & 24/7 Chatbot
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine Provider Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* 1. GROQ (RECOMMENDED) */}
          <button
            type="button"
            onClick={() => handleProviderChange('groq')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              provider === 'groq' 
                ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-amber-950 font-bold shadow-xs' 
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-xs">⚡ Groq Cloud</span>
            </div>
            <span className="text-[10px] text-amber-700 font-bold block">High Free Limits</span>
            <span className="text-[9px] text-slate-500">LLaMA 3.3 70B</span>
          </button>

          {/* 2. GROK (xAI) */}
          <button
            type="button"
            onClick={() => handleProviderChange('grok')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              provider === 'grok' 
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 text-blue-950 font-bold shadow-xs' 
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-xs">🤖 xAI Grok</span>
            </div>
            <span className="text-[10px] text-blue-700 font-bold block">Grok-2 / Beta</span>
            <span className="text-[9px] text-slate-500">Real-time LLM</span>
          </button>

          {/* 3. HUGGING FACE */}
          <button
            type="button"
            onClick={() => handleProviderChange('huggingface')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              provider === 'huggingface' 
                ? 'bg-yellow-50 border-yellow-500 ring-2 ring-yellow-500/20 text-yellow-950 font-bold shadow-xs' 
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-xs">🤗 HuggingFace</span>
            </div>
            <span className="text-[10px] text-yellow-700 font-bold block">Indic LLMs</span>
            <span className="text-[9px] text-slate-500">Qwen / Sarvam</span>
          </button>

          {/* 4. NATIVE OFFLINE */}
          <button
            type="button"
            onClick={() => handleProviderChange('native')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              provider === 'native' 
                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold shadow-xs' 
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-xs">🛡️ Offline Setu</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block">100% Free / PWA</span>
            <span className="text-[9px] text-slate-500">Zero API Key</span>
          </button>
        </div>

        {/* Configuration Body based on provider */}
        {provider !== 'native' && (
          <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>{provider === 'groq' ? 'Groq API Key (gsk_...)' : provider === 'grok' ? 'xAI API Key (xai-...)' : 'Hugging Face Token (hf_...)'}</span>
                </label>
                <a 
                  href={
                    provider === 'groq' 
                      ? 'https://console.groq.com/keys' 
                      : provider === 'grok' 
                      ? 'https://console.x.ai/' 
                      : 'https://huggingface.co/settings/tokens'
                  } 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <input
                type="password"
                placeholder={provider === 'groq' ? 'gsk_xxxxxxxxxxxxxxxxxxxxxx' : provider === 'grok' ? 'xai-xxxxxxxxxxxxxxxxxxxx' : 'hf_xxxxxxxxxxxxxxxxxxxx'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Select Reasoning Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
              >
                {provider === 'groq' && (
                  <>
                    <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended - Fastest & Smartest)</option>
                    <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Ultra-Fast 0.1s Latency)</option>
                    <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (MoE High Context)</option>
                    <option value="gemma2-9b-it">gemma2-9b-it (Google Gemma 2)</option>
                  </>
                )}

                {provider === 'grok' && (
                  <>
                    <option value="grok-beta">grok-beta (xAI Grok Reasoning Engine)</option>
                    <option value="grok-2-latest">grok-2-latest (State of the Art)</option>
                  </>
                )}

                {provider === 'huggingface' && (
                  <>
                    <option value="Qwen/Qwen2.5-7B-Instruct">Qwen/Qwen2.5-7B-Instruct (Indic Multilingual)</option>
                    <option value="meta-llama/Meta-Llama-3-8B-Instruct">meta-llama/Meta-Llama-3-8B-Instruct</option>
                    <option value="BioMistral/BioMistral-7B">BioMistral/BioMistral-7B (Medical)</option>
                    <option value="sarvamai/sarvam-2b-v0.5">sarvamai/sarvam-2b (Indic Small Model)</option>
                  </>
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>{isTesting ? 'Testing Inference Connection...' : `Test ${provider.toUpperCase()} Connection`}</span>
            </button>
          </div>
        )}

        {/* Free Limits & Capabilities Notice */}
        <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <div className="font-extrabold flex items-center gap-1 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>High Free Limits & 100% Offline Fallback</span>
          </div>
          <p className="text-[11px] text-emerald-800/90 leading-relaxed">
            Groq offers <strong>generous free tier limits</strong> (up to 30 requests/min and thousands of free daily tokens). If offline or without an API key, Setu automatically switches to its native medical triage and Maharashtra scheme engine.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#003527] hover:bg-[#064e3b] text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Save & Activate Engine</span>
          </button>
        </div>

      </div>
    </div>
  );
};
