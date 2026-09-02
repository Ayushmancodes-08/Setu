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
  ArrowRight,
  Pill,
  Image as ImageIcon,
  Hospital,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface UploadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

type RecordCategory = 'Diagnostic Lab' | 'Prescription' | 'Imaging / Scan' | 'Discharge Summary';

export const UploadReportModal: React.FC<UploadReportModalProps> = ({ isOpen, onClose, patientId }) => {
  const { showToast, language } = useApp();
  const { patients } = useHealthData();

  const [category, setCategory] = useState<RecordCategory>('Diagnostic Lab');
  const [testName, setTestName] = useState('Complete Blood Count (CBC)');
  const [resultValue, setResultValue] = useState('Hemoglobin: 12.8 g/dL • WBC: 6,400 /mcL • Platelets: 2.4 Lakhs');
  const [referenceRange, setReferenceRange] = useState('Hb: 12.0 - 15.5 g/dL • Normal');
  const [testStatus, setTestStatus] = useState<'Normal' | 'Abnormal' | 'Critical'>('Normal');
  const [doctorOrFacility, setDoctorOrFacility] = useState('Dr. Rohini Kulkarni, MD (Junnar Tele-Hub)');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(
    'All parameters including Hemoglobin, White Blood Cells, and Platelet count are within normal reference ranges.'
  );

  if (!isOpen) return null;

  const handleCategoryChange = (newCat: RecordCategory) => {
    setCategory(newCat);
    if (newCat === 'Prescription') {
      setTestName('Dr. Consultation e-Prescription');
      setResultValue('Tab. Amlodipine 5mg (1-0-0) • Tab. Telmisartan 40mg (0-0-1)');
      setReferenceRange('BP Management & Cardiovascular Support');
      setTestStatus('Normal');
      setAiExplanation('Follow the morning and bedtime regimen as advised. Take with fresh water after food.');
    } else if (newCat === 'Imaging / Scan') {
      setTestName('Chest X-Ray / Abdominal Ultrasound');
      setResultValue('Normal lung fields. Clear costophrenic angles. No active focal consolidation.');
      setReferenceRange('Radiological Impression: Normal Study');
      setTestStatus('Normal');
      setAiExplanation('Radiological findings are normal and healthy. No signs of infection or congestion.');
    } else if (newCat === 'Discharge Summary') {
      setTestName('Hospital Inpatient Discharge Summary');
      setResultValue('Post-treatment stable vitals. Discharge with 14-day recovery medications.');
      setReferenceRange('General Ward / Step-down Recovery');
      setTestStatus('Normal');
      setAiExplanation('Patient successfully discharged in stable clinical state. Follow up in 2 weeks.');
    } else {
      setTestName('Complete Blood Count (CBC)');
      setResultValue('Hemoglobin: 12.8 g/dL • WBC: 6,400 /mcL • Platelets: 2.4 Lakhs');
      setReferenceRange('Hb: 12.0 - 15.5 g/dL • Normal');
      setTestStatus('Normal');
      setAiExplanation('All parameters including Hemoglobin and Platelet count are within healthy reference ranges.');
    }
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setIsProcessingOcr(true);

    setTimeout(() => {
      setIsProcessingOcr(false);
      const name = file.name.toLowerCase();
      if (name.includes('rx') || name.includes('prescription')) {
        setCategory('Prescription');
        setTestName('Consultation Rx Slip');
        setResultValue('Tab. Metformin 500mg • Tab. Atorvastatin 10mg • Daily after dinner');
        setReferenceRange('Metabolic & Lipid Protocol');
        setTestStatus('Normal');
        setAiExplanation('Prescription scanned: 2 active medications detected. Prescribed for 30 days.');
      } else if (name.includes('xray') || name.includes('scan') || name.includes('mri') || name.includes('usg')) {
        setCategory('Imaging / Scan');
        setTestName('Diagnostic Radiology Scan');
        setResultValue('Unremarkable scan study. Clear anatomy, no acute fracture or effusion.');
        setReferenceRange('Radiologist Signature: Dr. Deshmukh');
        setTestStatus('Normal');
        setAiExplanation('Imaging scan parsed successfully. No radiological abnormalities identified.');
      } else if (name.includes('lipid') || name.includes('cholesterol')) {
        setCategory('Diagnostic Lab');
        setTestName('Lipid Profile & Serum Cholesterol');
        setResultValue('Total Cholesterol: 178 mg/dL • HDL: 48 mg/dL • LDL: 98 mg/dL');
        setReferenceRange('Total Cholesterol: < 200 mg/dL (Desirable)');
        setTestStatus('Normal');
        setAiExplanation('Your lipid levels are well-managed. Good cholesterol (HDL) is protective.');
      } else if (name.includes('sugar') || name.includes('glucose') || name.includes('hba1c')) {
        setCategory('Diagnostic Lab');
        setTestName('HbA1c & Fasting Blood Glucose');
        setResultValue('HbA1c: 5.6% • Fasting Glucose: 92 mg/dL');
        setReferenceRange('HbA1c < 5.7% (Normal Non-Diabetic)');
        setTestStatus('Normal');
        setAiExplanation('Normal glycemic control observed over past 3 months. No active signs of pre-diabetes.');
      } else {
        setTestName(file.name.replace(/\.[^/.]+$/, ''));
        setResultValue('Extracted health records and laboratory parameters verified.');
        setReferenceRange('Normal Clinical Reference Limits');
        setTestStatus('Normal');
        setAiExplanation('Document successfully parsed by Setu AI OCR. Findings added to your health locker.');
      }
      showToast(`AI OCR Scanner: Successfully extracted data from ${file.name}`);
    }, 1200);
  };

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedPatient = patients.find(p => p.id === patientId) || patients[0];
    if (!matchedPatient) return;

    const newReport = {
      id: `rec-${Date.now()}`,
      testName: testName.trim(),
      category: category,
      result: resultValue.trim(),
      referenceRange: referenceRange.trim(),
      status: testStatus,
      reportedAt: 'Just Now',
      explanation: aiExplanation.trim(),
      doctorOrFacility: doctorOrFacility.trim(),
      fileName: selectedFileName || 'Health_Document_Upload.pdf',
      uploadedBy: 'Patient'
    };

    const updatedReports = [newReport, ...(matchedPatient.recentLabReports || [])];

    await setuDB.putItem('patients', {
      ...matchedPatient,
      recentLabReports: updatedReports
    });

    showToast(`"${testName}" (${category}) uploaded! Available to doctor in real-time.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-auto animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-full border border-teal-300">
                  ABDM HEALTH LOCKER SYNC
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">Upload Prescription / Lab Report</h3>
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

        {/* Category Tabs */}
        <div className="space-y-1.5">
          <label className="font-bold text-xs text-slate-700 block">Select Document Type *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'Diagnostic Lab', label: 'Lab Report', icon: FileText },
              { id: 'Prescription', label: 'Prescription', icon: Pill },
              { id: 'Imaging / Scan', label: 'Scan / X-Ray', icon: ImageIcon },
              { id: 'Discharge Summary', label: 'Discharge Doc', icon: Hospital },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = category === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleCategoryChange(tab.id as RecordCategory)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload & Dropzone Area */}
        <div className="border-2 border-dashed border-teal-300 bg-teal-50/50 hover:bg-teal-50 rounded-2xl p-5 text-center transition-all relative">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.dcm"
            onChange={handleSimulatedFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-8 h-8 text-teal-700 mx-auto mb-2" />
          <div className="font-bold text-xs text-slate-900">
            {selectedFileName ? `Selected File: ${selectedFileName}` : 'Click or Drag & Drop PDF / Photo / Scan'}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Supported: PDF, JPG, PNG, DICOM • Max file size: 25 MB
          </p>
          {isProcessingOcr && (
            <div className="mt-2 text-xs font-bold text-teal-800 flex items-center justify-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>AI OCR Extracting laboratory values & findings...</span>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSaveReport} className="space-y-3.5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Title / Investigation / Document Name *</label>
              <input
                type="text"
                required
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g. Complete Blood Count (CBC) or Follow-up Rx"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Clinical Status / Findings *</label>
              <select
                value={testStatus}
                onChange={(e) => setTestStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="Normal">Normal (Standard / Healthy)</option>
                <option value="Abnormal">Abnormal / Requires Doctor Review</option>
                <option value="Critical">Critical / Urgent Follow-Up</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Key Results, Dosages or Clinical Findings *</label>
            <input
              type="text"
              required
              value={resultValue}
              onChange={(e) => setResultValue(e.target.value)}
              placeholder="e.g. Hemoglobin: 12.8 g/dL or Tab. Amlodipine 5mg"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Reference Range / Notes</label>
              <input
                type="text"
                value={referenceRange}
                onChange={(e) => setReferenceRange(e.target.value)}
                placeholder="e.g. 12.0 - 15.5 g/dL"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Doctor / Diagnostic Lab / Hospital</label>
              <input
                type="text"
                value={doctorOrFacility}
                onChange={(e) => setDoctorOrFacility(e.target.value)}
                placeholder="e.g. Dr. Rohini Kulkarni / NABL Lab"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 flex items-center justify-between mb-1">
              <span>Patient AI Summary & Understanding</span>
              <span className="text-[10px] text-teal-800 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-Generated
              </span>
            </label>
            <textarea
              rows={2}
              value={aiExplanation}
              onChange={(e) => setAiExplanation(e.target.value)}
              placeholder="Plain language explanation for patient and doctor..."
              className="w-full bg-teal-50/50 border border-teal-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Syncs to Doctor Portal</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-800 hover:bg-teal-900 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save to Health Locker</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
