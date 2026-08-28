import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { huggingFaceAI, HFConfig } from '../../services/huggingFaceService';
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
  Zap
} from 'lucide-react';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({ isOpen, onClose }) => {
  const { showToast, language } = useApp();
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('Qwen/Qwen2.5-7B-Instruct');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = huggingFaceAI.loadConfig();
      setApiKey(cfg.apiKey);
      setSelectedModel(cfg.triageModel);
      setIsEnabled(cfg.isEnabled);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    huggingFaceAI.saveConfig({
      apiKey: apiKey.trim(),
      triageModel: selectedModel,
      isEnabled: isEnabled && !!apiKey.trim()
    });
    showToast(isEnabled && apiKey.trim() ? 'Hugging Face LLM Inference Engine Activated!' : 'Settings Saved (Using Setu Bhashini Engine).');
    onClose();
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      showToast('Please enter your Hugging Face User Access Token first.');
      return;
    }

    setIsTesting(true);
    try {
      huggingFaceAI.saveConfig({ apiKey: apiKey.trim(), triageModel: selectedModel, isEnabled: true });
      const res = await huggingFaceAI.queryTriageLLM('मुझे तेज सिरदर्द है', 'hi');
      showToast(`Success! Connected to ${res.modelUsed}`);
      setIsEnabled(true);
    } catch (e) {
      showToast('Connection test failed. Check token permissions.');
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
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                AI Inference Engine & LLM Settings
              </h3>
              <p className="text-xs text-slate-500">
                Configure Hugging Face Indic LLMs or Native Offline Bhashini
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine Modes */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div 
            onClick={() => setIsEnabled(false)}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              !isEnabled ? 'bg-emerald-50/80 border-emerald-400 shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-slate-900">Setu Bhashini Native</span>
              {!isEnabled && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              100% Client-Side, 0-Latency, zero API key required, full offline PWA sync support.
            </p>
          </div>

          <div 
            onClick={() => setIsEnabled(true)}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              isEnabled ? 'bg-amber-50/80 border-amber-400 shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-slate-900">Hugging Face Cloud LLM</span>
              {isEnabled && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Serverless neural LLM reasoning (Qwen 2.5, Llama-3, BioMistral, Sarvam).
            </p>
          </div>
        </div>

        {/* Hugging Face Config Fields */}
        {isEnabled && (
          <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Hugging Face Access Token (hf_...)</span>
                </label>
                <a 
                  href="https://huggingface.co/settings/tokens" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  <span>Get Token</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <input
                type="password"
                placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Select Indic / Medical Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
              >
                <option value="Qwen/Qwen2.5-7B-Instruct">Qwen/Qwen2.5-7B-Instruct (Recommended - Multilingual)</option>
                <option value="meta-llama/Meta-Llama-3-8B-Instruct">meta-llama/Meta-Llama-3-8B-Instruct (High Reasoning)</option>
                <option value="BioMistral/BioMistral-7B">BioMistral/BioMistral-7B (Medical Domain LLM)</option>
                <option value="sarvamai/sarvam-2b-v0.5">sarvamai/sarvam-2b (Indic Specialized Small Model)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>{isTesting ? 'Testing Inference...' : 'Test Hugging Face Connection'}</span>
            </button>
          </div>
        )}

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
            <span>Save & Apply Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
};
