import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { setuDB } from '../../services/db';
import { 
  FileText, 
  Upload, 
  X, 
  Check, 
  Sparkles, 
  AlertCircle, 
  FileCheck,
  Activity,
  ArrowRight
} from 'lucide-react';

interface UploadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

export const UploadReportModal: React.FC<UploadReportModalProps> = ({ isOpen, onClose, patientId }) => {
  const { showToast, language } = useApp();
  const { patients } = useHealthData();

  const [testName, setTestName] = useState('Complete Blood Count (CBC)');
  const [resultValue, setResultValue] = useState('Hemoglobin: 12.8 g/dL • WBC: 6,400 /mcL • Platelets: 2.4 Lakhs');
  const [referenceRange, setReferenceRange] = useState('Hb: 12.0 - 15.5 g/dL • Normal');
  const [testStatus, setTestStatus] = useState<'Normal' | 'Abnormal' | 'Critical'>('Normal');
  const [selectedFileName, setSelectedFileName] = useState<string | null>('Diagnostic_Lab_Report_2026.pdf');
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(
    'All parameters including Hemoglobin, White Blood Cells, and Platelet count are within normal reference ranges.'
  );

  if (!isOpen) return null;

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setIsProcessingOcr(true);

    setTimeout(() => {
      setIsProcessingOcr(false);
      if (file.name.toLowerCase().includes('lipid') || file.name.toLowerCase().includes('cholesterol')) {
        setTestName('Lipid Profile & Serum Cholesterol');
        setResultValue('Total Cholesterol: 178 mg/dL • HDL: 48 mg/dL • LDL: 98 mg/dL');
        setReferenceRange('Total Cholesterol: < 200 mg/dL (Desirable)');
        setTestStatus('Normal');
        setAiExplanation('Your lipid levels are well-managed. Good cholesterol (HDL) is protective.');
      } else if (file.name.toLowerCase().includes('sugar') || file.name.toLowerCase().includes('glucose') || file.name.toLowerCase().includes('hba1c')) {
        setTestName('HbA1c & Fasting Blood Glucose');
        setResultValue('HbA1c: 5.6% • Fasting Glucose: 92 mg/dL');
        setReferenceRange('HbA1c < 5.7% (Normal Non-Diabetic)');
        setTestStatus('Normal');
        setAiExplanation('Normal glycemic control observed over past 3 months. No active signs of pre-diabetes.');
      } else {
        setTestName('Automated Hemogram & Platelet Analysis');
        setResultValue('Hemoglobin: 13.2 g/dL • RBC: 4.6 M/uL • Platelets: 2.8 Lakhs');
        setReferenceRange('12.0 - 15.5 g/dL');
        setTestStatus('Normal');
        setAiExplanation('Blood counts are healthy and adequate. Normal oxygen carrying capacity.');
      }
      showToast(`AI Document Scanner: Extracted findings from ${file.name}`);
    }, 1200);
  };

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedPatient = patients.find(p => p.id === patientId) || patients[0];
    if (!matchedPatient) return;

    const newReport = {
      id: `lab-${Date.now()}`,
      testName: testName.trim(),
      result: resultValue.trim(),
      referenceRange: referenceRange.trim(),
      status: testStatus,
      reportedAt: 'Just Now',
      explanation: aiExplanation.trim()
    };

    const updatedReports = [newReport, ...(matchedPatient.recentLabReports || [])];

    await setuDB.putItem('patients', {
      ...matchedPatient,
      recentLabReports: updatedReports
    });

    showToast(`Diagnostic Report for "${testName}" added to your health locker!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-300">
                  SMART REPORT SCANNER
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">Upload Diagnostic Lab Report</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload & Dropzone Area */}
        <div className="border-2 border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-50 rounded-2xl p-5 text-center transition-all relative">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleSimulatedFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="font-bold text-xs text-slate-900">
            {selectedFileName ? `Selected: ${selectedFileName}` : 'Click or Drag & Drop PDF / Image Report'}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Supported: PDF, JPG, PNG from any NABL-accredited diagnostic laboratory
          </p>
          {isProcessingOcr && (
            <div className="mt-2 text-xs font-bold text-purple-700 flex items-center justify-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI OCR Extracting laboratory values & findings...</span>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSaveReport} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Investigation / Test Name *</label>
              <input
                type="text"
                required
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g. Complete Blood Count (CBC)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Result Status *</label>
              <select
                value={testStatus}
                onChange={(e) => setTestStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              >
                <option value="Normal">Normal (Within Reference Range)</option>
                <option value="Abnormal">Abnormal / Mild Deviation</option>
                <option value="Critical">Critical / Immediate Attention</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Test Result Finding / Quantitative Value *</label>
            <input
              type="text"
              required
              value={resultValue}
              onChange={(e) => setResultValue(e.target.value)}
              placeholder="e.g. Hemoglobin: 12.8 g/dL"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Reference Normal Range</label>
            <input
              type="text"
              value={referenceRange}
              onChange={(e) => setReferenceRange(e.target.value)}
              placeholder="e.g. 12.0 - 15.5 g/dL"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 flex items-center justify-between mb-1">
              <span>Plain-Language AI Explanation for Patient</span>
              <span className="text-[10px] text-purple-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-Generated
              </span>
            </label>
            <textarea
              rows={2}
              value={aiExplanation}
              onChange={(e) => setAiExplanation(e.target.value)}
              placeholder="Plain language explanation..."
              className="w-full bg-purple-50/50 border border-purple-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Add to Health Records</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
