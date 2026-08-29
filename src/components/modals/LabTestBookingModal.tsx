import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import {
  X,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  ChevronRight,
  Microscope,
  Activity,
  TrendingDown,
  ShieldCheck,
  ArrowRight,
  Zap,
  Wallet,
  Navigation,
  Phone,
  Filter,
  SortAsc,
  Info,
  Heart,
  Calendar,
  Truck,
  RefreshCw
} from 'lucide-react';

// ─── Data Types ─────────────────────────────────────────────────────────────

interface LabTest {
  id: string;
  name: string;
  category: 'Blood' | 'Urine' | 'Imaging' | 'Cardiology' | 'Hormones' | 'Infection' | 'Genetics' | 'Nutrition';
  description: string;
  turnaround: string;
  fasting: boolean;
  sampleType: string;
  referenceRange: string;
  tags: string[];
  governmentFree?: boolean;    // free under JSSK/MJPJAY
  mjpjayScheme?: string;
}

interface DiagnosticCenter {
  id: string;
  name: string;
  type: 'Government PHC/Lab' | 'NABL Accredited' | 'Private Clinic Lab' | 'Mobile Lab';
  distanceKm: number;
  openStatus: string;
  rating: number;
  reviewCount: number;
  phone: string;
  address: string;
  homeCollection: boolean;
  homeCollectionCharge: number; // 0 = free
  turnaroundHours: number;
  nabl: boolean;
  icmrApproved: boolean;
  mjpjayEmpanelled: boolean;
  operatingHours: string;
  prices: Record<string, number>; // testId -> price in INR (0 = free under scheme)
  amenities: string[];
}

// ─── Catalog ─────────────────────────────────────────────────────────────────

const LAB_TESTS: LabTest[] = [
  { id: 't-01', name: 'Complete Blood Count (CBC)', category: 'Blood', description: 'Full hemogram with WBC differential, platelet count, and hemoglobin.', turnaround: '4–6 hrs', fasting: false, sampleType: 'Venous blood (3 mL EDTA)', referenceRange: 'Hb: 11.5–15.5 g/dL; WBC: 4000–11000/µL', tags: ['Anemia', 'Infection', 'Fatigue', 'Routine'], governmentFree: true, mjpjayScheme: 'JSSK / AB-PMJAY' },
  { id: 't-02', name: 'Fasting Blood Glucose (FBS)', category: 'Blood', description: 'Serum glucose after 8-hour overnight fast. Screens for diabetes.', turnaround: '2–4 hrs', fasting: true, sampleType: 'Serum (fluoride tube)', referenceRange: '70–100 mg/dL (Normal); >126 = Diabetic', tags: ['Diabetes', 'Pre-Diabetes', 'NCD Screening'], governmentFree: true },
  { id: 't-03', name: 'HbA1c (Glycated Hemoglobin)', category: 'Blood', description: '3-month average blood sugar control. Key for diabetic management.', turnaround: '6–8 hrs', fasting: false, sampleType: 'Venous blood (EDTA)', referenceRange: '<5.7% Normal; 5.7–6.4% Pre-diabetic; >6.5% Diabetic', tags: ['Diabetes Management', 'NCD'], governmentFree: false },
  { id: 't-04', name: 'Lipid Profile (Cholesterol Panel)', category: 'Blood', description: 'Total cholesterol, LDL, HDL, triglycerides for cardiac risk.', turnaround: '4–6 hrs', fasting: true, sampleType: 'Serum (plain tube)', referenceRange: 'Total Chol: <200 mg/dL; LDL <100; HDL >50', tags: ['Heart Disease', 'Cholesterol', 'Obesity'], governmentFree: true, mjpjayScheme: 'AB-PMJAY Package' },
  { id: 't-05', name: 'Thyroid Profile (TSH + T3 + T4)', category: 'Hormones', description: 'Full thyroid function panel. Essential for fatigue, weight change, pregnancy.', turnaround: '8–12 hrs', fasting: false, sampleType: 'Serum (3 mL)', referenceRange: 'TSH: 0.4–4.0 mIU/L; T4: 60–120 nmol/L', tags: ['Thyroid', 'Fatigue', 'Pregnancy', 'ANC'] },
  { id: 't-06', name: 'Urine Routine & Microscopy (R/M)', category: 'Urine', description: 'Protein, glucose, infection markers, RBC/WBC casts in urine.', turnaround: '2–3 hrs', fasting: false, sampleType: 'Midstream clean catch urine (10 mL)', referenceRange: 'No protein/glucose/RBC in normal urine', tags: ['UTI', 'Pregnancy', 'Kidney', 'Routine'], governmentFree: true },
  { id: 't-07', name: 'Malaria RDT / Rapid Antigen Test', category: 'Infection', description: 'Rapid card test for Plasmodium vivax and falciparum antigens.', turnaround: '20 mins', fasting: false, sampleType: 'Finger-prick blood (3 drops)', referenceRange: 'Negative (no lines = no malaria)', tags: ['Malaria', 'Fever', 'Tribal Area'], governmentFree: true, mjpjayScheme: 'NVBDCP Free Test' },
  { id: 't-08', name: 'Hemoglobin (Hb) Spot Test', category: 'Blood', description: 'Quick hemoglobin screening for anemia. Recommended in ANC visits.', turnaround: '30 mins', fasting: false, sampleType: 'Finger-prick blood', referenceRange: 'Women: >12 g/dL; Pregnant: >11 g/dL', tags: ['Anemia', 'ANC', 'Women Health', 'Maternal'], governmentFree: true },
  { id: 't-09', name: 'HIV 1 & 2 ELISA (ICTC)', category: 'Infection', description: 'Confidential HIV antibody screening. Mandatory in ANC protocol.', turnaround: '24 hrs', fasting: false, sampleType: 'Venous blood (3 mL)', referenceRange: 'Non-Reactive (Negative)', tags: ['HIV', 'ANC', 'Counseling Required'], governmentFree: true, mjpjayScheme: 'JSSK Free (ICTC)' },
  { id: 't-10', name: 'Liver Function Test (LFT)', category: 'Blood', description: 'SGOT, SGPT, bilirubin, albumin, alkaline phosphatase for liver health.', turnaround: '6–8 hrs', fasting: true, sampleType: 'Serum (5 mL)', referenceRange: 'SGPT: 7–56 U/L; Bilirubin total: 0.2–1.2 mg/dL', tags: ['Liver', 'Hepatitis', 'Jaundice', 'Alcohol'] },
  { id: 't-11', name: 'Kidney Function Test (KFT/RFT)', category: 'Blood', description: 'Creatinine, BUN, eGFR, electrolytes for kidney function.', turnaround: '4–6 hrs', fasting: false, sampleType: 'Serum', referenceRange: 'Creatinine: 0.6–1.2 mg/dL; BUN: 7–20 mg/dL', tags: ['Kidney', 'Hypertension', 'Diabetes Complication'] },
  { id: 't-12', name: 'ECG (Electrocardiogram)', category: 'Cardiology', description: '12-lead ECG for arrhythmia, ischemia, block detection.', turnaround: 'Immediate', fasting: false, sampleType: 'Non-invasive (skin electrodes)', referenceRange: 'Normal sinus rhythm 60–100 bpm', tags: ['Heart', 'Chest Pain', 'Hypertension'], governmentFree: true },
  { id: 't-13', name: 'Sputum AFB Smear (TB Test)', category: 'Infection', description: 'Acid-fast bacilli smear for tuberculosis diagnosis under NTEP.', turnaround: '2–3 days', fasting: false, sampleType: 'Morning sputum (3 mL)', referenceRange: 'Negative for AFB', tags: ['TB', 'NTEP', 'Cough', 'Tribal'], governmentFree: true, mjpjayScheme: 'NTEP Free (NIKSHAY)' },
  { id: 't-14', name: 'Urine Pregnancy Test (UPT)', category: 'Urine', description: 'hCG detection for early pregnancy confirmation.', turnaround: '15 mins', fasting: false, sampleType: 'First morning urine', referenceRange: 'Positive = Pregnant (hCG detected)', tags: ['Pregnancy', 'ANC', 'Women Health'], governmentFree: true },
  { id: 't-15', name: 'Serum Ferritin (Iron Store)', category: 'Nutrition', description: 'Iron storage protein. Best marker for iron-deficiency anemia.', turnaround: '8–12 hrs', fasting: false, sampleType: 'Serum (2 mL)', referenceRange: 'Women: 12–150 ng/mL; Men: 12–300 ng/mL', tags: ['Anemia', 'Fatigue', 'ANC', 'Iron Deficiency'] },
];

const DIAGNOSTIC_CENTERS: DiagnosticCenter[] = [
  {
    id: 'dc-01',
    name: 'Otur PHC Government Laboratory',
    type: 'Government PHC/Lab',
    distanceKm: 2.1,
    openStatus: 'Open Now',
    rating: 4.3,
    reviewCount: 218,
    phone: '+91 2132 264222',
    address: 'Otur, Junnar Taluka, Pune',
    homeCollection: false,
    homeCollectionCharge: 0,
    turnaroundHours: 6,
    nabl: false,
    icmrApproved: true,
    mjpjayEmpanelled: true,
    operatingHours: 'Mon–Sat: 8 AM – 4 PM',
    prices: { 't-01': 0, 't-02': 0, 't-04': 0, 't-06': 0, 't-07': 0, 't-08': 0, 't-09': 0, 't-12': 0, 't-13': 0, 't-14': 0 },
    amenities: ['Free under JSSK/MJPJAY', 'Walk-in', 'Result via ABHA EHR', 'ASHA Escort']
  },
  {
    id: 'dc-02',
    name: 'Junnar Rural Hospital – Pathology Wing',
    type: 'Government PHC/Lab',
    distanceKm: 4.8,
    openStatus: 'Open Now',
    rating: 4.1,
    reviewCount: 381,
    phone: '+91 2132 222108',
    address: 'Junnar Town, Pune District',
    homeCollection: false,
    homeCollectionCharge: 0,
    turnaroundHours: 8,
    nabl: false,
    icmrApproved: true,
    mjpjayEmpanelled: true,
    operatingHours: '24 hrs (Emergency); OPD 8 AM – 2 PM',
    prices: { 't-01': 0, 't-02': 0, 't-03': 200, 't-04': 0, 't-05': 350, 't-06': 0, 't-07': 0, 't-08': 0, 't-09': 0, 't-10': 250, 't-11': 180, 't-12': 0, 't-13': 0, 't-14': 0, 't-15': 280 },
    amenities: ['Free for MJPJAY patients', 'Blood Bank on-site', '24/7 Emergency Lab', 'NABL pending']
  },
  {
    id: 'dc-03',
    name: 'LifeCare Diagnostics – Junnar (NABL)',
    type: 'NABL Accredited',
    distanceKm: 5.4,
    openStatus: 'Open Now',
    rating: 4.7,
    reviewCount: 642,
    phone: '+91 98220 33401',
    address: 'Main Market Road, Junnar, Pune – 410502',
    homeCollection: true,
    homeCollectionCharge: 150,
    turnaroundHours: 4,
    nabl: true,
    icmrApproved: true,
    mjpjayEmpanelled: true,
    operatingHours: 'Mon–Sun: 7 AM – 8 PM',
    prices: { 't-01': 350, 't-02': 120, 't-03': 450, 't-04': 550, 't-05': 680, 't-06': 80, 't-07': 150, 't-08': 60, 't-09': 0, 't-10': 700, 't-11': 650, 't-12': 200, 't-13': 0, 't-14': 90, 't-15': 520 },
    amenities: ['NABL ISO 15189:2022', 'Home Collection ₹150', 'WhatsApp Reports', 'Digital PDF Report', 'ABHA Linked']
  },
  {
    id: 'dc-04',
    name: 'Medscope Rural Mobile Lab (Van Service)',
    type: 'Mobile Lab',
    distanceKm: 0.5,
    openStatus: 'Scheduled Today (2 PM–5 PM)',
    rating: 4.2,
    reviewCount: 94,
    phone: '+91 93700 22181',
    address: 'Mobile van — visits Khamgaon every Tuesday & Friday',
    homeCollection: true,
    homeCollectionCharge: 0,
    turnaroundHours: 18,
    nabl: false,
    icmrApproved: true,
    mjpjayEmpanelled: false,
    operatingHours: 'Tue & Fri: 2 PM – 5 PM (Khamgaon)',
    prices: { 't-01': 280, 't-02': 100, 't-03': 380, 't-04': 480, 't-06': 60, 't-07': 0, 't-08': 0, 't-14': 70, 't-15': 420 },
    amenities: ['Doorstep collection (free)', 'Village outreach program', 'SMS report', 'ASHA linked booking']
  },
  {
    id: 'dc-05',
    name: 'Pathcare Plus – Manchar Branch',
    type: 'NABL Accredited',
    distanceKm: 22.3,
    openStatus: 'Open Now',
    rating: 4.5,
    reviewCount: 1204,
    phone: '+91 98901 11223',
    address: 'Manchar Naka, Ambegaon, Pune',
    homeCollection: true,
    homeCollectionCharge: 200,
    turnaroundHours: 6,
    nabl: true,
    icmrApproved: true,
    mjpjayEmpanelled: true,
    operatingHours: 'Mon–Sun: 6:30 AM – 9 PM',
    prices: { 't-01': 299, 't-02': 99, 't-03': 399, 't-04': 499, 't-05': 599, 't-06': 69, 't-07': 120, 't-08': 49, 't-09': 0, 't-10': 599, 't-11': 549, 't-12': 180, 't-13': 0, 't-14': 79, 't-15': 449 },
    amenities: ['NABL Accredited', 'Home Collection ₹200', 'App-based tracking', 'ABHA EHR Sync']
  }
];

const CATEGORIES = ['All', 'Blood', 'Urine', 'Imaging', 'Cardiology', 'Hormones', 'Infection', 'Genetics', 'Nutrition'];

// ─── Sub-components ──────────────────────────────────────────────────────────

const PriceTag: React.FC<{ price: number; isFree?: boolean; schemeName?: string }> = ({ price, isFree, schemeName }) => {
  if (isFree || price === 0) {
    return (
      <span className="inline-flex flex-col items-end">
        <span className="text-base font-black text-emerald-600">FREE</span>
        {schemeName && <span className="text-[9px] text-emerald-700 font-bold">{schemeName}</span>}
      </span>
    );
  }
  return <span className="text-base font-black text-slate-900">₹{price}</span>;
};

// ─── Main Component ──────────────────────────────────────────────────────────

interface LabTestBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillTestId?: string;
}

export const LabTestBookingModal: React.FC<LabTestBookingModalProps> = ({ isOpen, onClose, prefillTestId }) => {
  const { showToast, language } = useApp();
  const { createDiagnosticOrder, patients } = useHealthData();

  const patient = patients[0];
  const userDistrictKm = 2.1; // mock user position near Khamgaon

  // Step state
  const [step, setStep] = useState<'select_test' | 'compare_labs' | 'confirm'>('select_test');

  // Test selection
  const [testSearch, setTestSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  // Lab comparison
  const [selectedCenter, setSelectedCenter] = useState<DiagnosticCenter | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');
  const [homeCollectionOnly, setHomeCollectionOnly] = useState(false);
  const [nablOnly, setNablOnly] = useState(false);

  // Confirm
  const [bookingDate, setBookingDate] = useState('Tomorrow');
  const [bookingTime, setBookingTime] = useState('8:00 AM – 10:00 AM');
  const [homeCollection, setHomeCollection] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Live "searching nearby labs" shimmer
  const [isSearchingLabs, setIsSearchingLabs] = useState(false);

  useEffect(() => {
    if (prefillTestId) {
      const t = LAB_TESTS.find(t => t.id === prefillTestId);
      if (t) { setSelectedTest(t); setStep('compare_labs'); }
    }
  }, [prefillTestId]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep('select_test');
      setSelectedTest(null);
      setSelectedCenter(null);
      setTestSearch('');
      setIsSearchingLabs(false);
    }
  }, [isOpen]);

  // Simulate real-time lab search with a delay shimmer
  const handleSelectTest = (test: LabTest) => {
    setSelectedTest(test);
    setIsSearchingLabs(true);
    setStep('compare_labs');
    setTimeout(() => setIsSearchingLabs(false), 1400);
  };

  const handleSelectCenter = (center: DiagnosticCenter) => {
    setSelectedCenter(center);
    setStep('confirm');
    if (center.homeCollection) setHomeCollection(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTest || !selectedCenter) return;
    setIsBooking(true);
    await new Promise(r => setTimeout(r, 1000));

    await createDiagnosticOrder({
      patientName: patient?.name || 'Rajesh Kumar Shinde',
      patientAge: patient?.age || 30,
      patientGender: patient?.gender || 'Male',
      testName: selectedTest.name,
      testCategory: selectedTest.category,
      sampleType: selectedTest.sampleType,
      sampleStatus: 'Sample Collected',
      orderingDoctor: 'Patient Self-Booked (Setu App)',
      facility: selectedCenter.name,
    });

    showToast(`✅ Lab test booked at ${selectedCenter.name}! Token will be sent via SMS.`);
    setIsBooking(false);
    onClose();
  };

  // Filter + sort labs
  const availableCenters = DIAGNOSTIC_CENTERS.filter(c => {
    const hasTest = !selectedTest || selectedTest.id in c.prices;
    const passHome = !homeCollectionOnly || c.homeCollection;
    const passNabl = !nablOnly || c.nabl;
    return hasTest && passHome && passNabl;
  }).sort((a, b) => {
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'price') {
      const pa = selectedTest ? (a.prices[selectedTest.id] ?? 9999) : a.distanceKm;
      const pb = selectedTest ? (b.prices[selectedTest.id] ?? 9999) : b.distanceKm;
      return pa - pb;
    }
    return b.rating - a.rating;
  });

  // Filter tests
  const filteredTests = LAB_TESTS.filter(t => {
    const catOk = selectedCategory === 'All' || t.category === selectedCategory;
    const searchOk = !testSearch || t.name.toLowerCase().includes(testSearch.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(testSearch.toLowerCase()));
    const freeOk = !showFreeOnly || t.governmentFree;
    return catOk && searchOk && freeOk;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl max-h-[96vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col">

        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 p-4 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center shrink-0">
              <Microscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-black text-sm text-slate-900">Book a Lab Test</h2>
              <p className="text-[11px] text-slate-500">
                {step === 'select_test' ? 'Step 1: Choose your test' :
                  step === 'compare_labs' ? `Step 2: Compare labs near you — "${selectedTest?.name}"` :
                    'Step 3: Confirm booking'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Step pills */}
            <div className="hidden sm:flex gap-1">
              {['Test', 'Compare', 'Book'].map((s, i) => (
                <span key={s} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  i === (step === 'select_test' ? 0 : step === 'compare_labs' ? 1 : 2)
                    ? 'bg-purple-700 text-white'
                    : i < (step === 'select_test' ? 0 : step === 'compare_labs' ? 1 : 2)
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                }`}>{i + 1}. {s}</span>
              ))}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── STEP 1: SELECT TEST ─────────────────────────────────────────────── */}
        {step === 'select_test' && (
          <div className="p-4 space-y-4">

            {/* Scheme banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">JSSK / AB-PMJAY:</span> Many tests are <span className="font-black">completely FREE</span> for eligible patients under government health schemes. Tests marked "FREE" cost ₹0 at government facilities.
              </div>
            </div>

            {/* Search bar */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={testSearch}
                  onChange={e => setTestSearch(e.target.value)}
                  placeholder="Search test (e.g. CBC, sugar, thyroid, malaria...)"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 bg-slate-50"
                />
              </div>
              <button
                onClick={() => setShowFreeOnly(!showFreeOnly)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${showFreeOnly ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-400'}`}
              >
                <Wallet className="w-3.5 h-3.5" />
                Free Only
              </button>
            </div>

            {/* Category pills */}
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                    selectedCategory === cat
                      ? 'bg-purple-700 text-white border-purple-700'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Test list */}
            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {filteredTests.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">No tests found. Try a different keyword.</div>
              )}
              {filteredTests.map(test => (
                <button
                  key={test.id}
                  onClick={() => handleSelectTest(test)}
                  className="w-full text-left bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-2xl p-3.5 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-purple-800">{test.name}</span>
                        {test.governmentFree && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-300">FREE ✓</span>
                        )}
                        {test.fasting && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200">Fasting Required</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-1">{test.description}</p>
                      <div className="flex gap-3 mt-1.5 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{test.turnaround}</span>
                        <span className="flex items-center gap-1"><Activity className="w-3 h-3" />{test.sampleType}</span>
                      </div>
                      <div className="flex gap-1 flex-wrap mt-1.5">
                        {test.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 shrink-0 mt-1 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: COMPARE LABS ────────────────────────────────────────────── */}
        {step === 'compare_labs' && selectedTest && (
          <div className="p-4 space-y-4">

            {/* Test info banner */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-purple-900">{selectedTest.name}</span>
                <button onClick={() => setStep('select_test')} className="text-[10px] text-purple-600 font-bold hover:underline flex items-center gap-1">
                  ← Change Test
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white rounded-xl p-2 border border-purple-100">
                  <span className="text-slate-400 block text-[10px]">Sample Type</span>
                  <span className="font-bold text-slate-700">{selectedTest.sampleType}</span>
                </div>
                <div className="bg-white rounded-xl p-2 border border-purple-100">
                  <span className="text-slate-400 block text-[10px]">Turnaround</span>
                  <span className="font-bold text-slate-700">{selectedTest.turnaround}</span>
                </div>
                {selectedTest.fasting && (
                  <div className="col-span-2 bg-amber-50 border border-amber-200 rounded-xl p-2 flex items-center gap-2 text-amber-800 font-bold">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    ⚠️ 8-hour fast required before this test. Do not eat or drink (except water) from midnight.
                  </div>
                )}
                <div className="col-span-2 bg-white rounded-xl p-2 border border-purple-100">
                  <span className="text-slate-400 block text-[10px]">Reference Range</span>
                  <span className="font-bold text-slate-700 text-[10px]">{selectedTest.referenceRange}</span>
                </div>
              </div>
            </div>

            {/* Searching shimmer */}
            {isSearchingLabs ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                  <span>Finding labs near Khamgaon, Junnar...</span>
                </div>
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-24" />
                ))}
              </div>
            ) : (
              <>
                {/* Filters & Sort */}
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                    <Filter className="w-3 h-3" /> Sort:
                  </div>
                  {(['distance', 'price', 'rating'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all capitalize ${sortBy === s ? 'bg-purple-700 text-white border-purple-700' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                    >
                      {s === 'distance' ? '📍 Nearest' : s === 'price' ? '💰 Cheapest' : '⭐ Best Rated'}
                    </button>
                  ))}
                  <button
                    onClick={() => setHomeCollectionOnly(!homeCollectionOnly)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1 ${homeCollectionOnly ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                  >
                    <Truck className="w-3 h-3" /> Home Pickup
                  </button>
                  <button
                    onClick={() => setNablOnly(!nablOnly)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${nablOnly ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                  >
                    NABL Only
                  </button>
                </div>

                {/* Location context */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  <Navigation className="w-3 h-3 text-purple-600" />
                  <span>Your location: <strong className="text-slate-700">Khamgaon, Junnar</strong> — showing labs within 30 km</span>
                </div>

                {/* Lab Cards */}
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {availableCenters.map(center => {
                    const testPrice = selectedTest ? (center.prices[selectedTest.id] ?? null) : null;
                    const isFreeForTest = testPrice === 0;
                    const totalWithHome = testPrice !== null && center.homeCollection
                      ? testPrice + center.homeCollectionCharge
                      : testPrice;
                    const eta = `${(center.distanceKm / 25 * 60).toFixed(0)} min drive`;

                    return (
                      <button
                        key={center.id}
                        onClick={() => handleSelectCenter(center)}
                        className="w-full text-left bg-white border-2 border-slate-200 hover:border-purple-400 rounded-2xl p-4 transition-all group shadow-xs hover:shadow-md"
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-sm text-slate-900 group-hover:text-purple-800">{center.name}</span>
                              {center.nabl && <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-300">NABL</span>}
                              {center.mjpjayEmpanelled && <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">MJPJAY ✓</span>}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{center.type}</div>
                          </div>

                          {/* Price — STAR FEATURE */}
                          <div className="text-right shrink-0">
                            {testPrice === null ? (
                              <span className="text-xs text-slate-400 italic">Not available</span>
                            ) : (
                              <>
                                <PriceTag
                                  price={testPrice}
                                  isFree={isFreeForTest}
                                  schemeName={isFreeForTest ? selectedTest.mjpjayScheme : undefined}
                                />
                                {!isFreeForTest && center.homeCollection && center.homeCollectionCharge > 0 && (
                                  <div className="text-[10px] text-blue-600 font-bold">
                                    +₹{center.homeCollectionCharge} home pickup
                                  </div>
                                )}
                                {!isFreeForTest && center.homeCollection && center.homeCollectionCharge === 0 && (
                                  <div className="text-[10px] text-emerald-600 font-bold">Free home pickup</div>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {/* Distance */}
                          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                            <div className="text-[10px] text-slate-400">Distance</div>
                            <div className="font-extrabold text-xs text-slate-900">{center.distanceKm} km</div>
                            <div className="text-[9px] text-slate-400">{eta}</div>
                          </div>
                          {/* Turnaround */}
                          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                            <div className="text-[10px] text-slate-400">Results In</div>
                            <div className="font-extrabold text-xs text-slate-900">{center.turnaroundHours}h</div>
                            <div className="text-[9px] text-slate-400">turnaround</div>
                          </div>
                          {/* Rating */}
                          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                            <div className="text-[10px] text-slate-400">Rating</div>
                            <div className="font-extrabold text-xs text-yellow-600 flex items-center justify-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                              {center.rating}
                            </div>
                            <div className="text-[9px] text-slate-400">{center.reviewCount} reviews</div>
                          </div>
                          {/* Open status */}
                          <div className={`rounded-xl p-2 border ${center.openStatus.includes('Open Now') ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                            <div className="text-[10px] text-slate-400">Status</div>
                            <div className={`text-[9px] font-bold leading-tight ${center.openStatus.includes('Open Now') ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {center.openStatus.includes('Open Now') ? '🟢 Open' : '🟡 Scheduled'}
                            </div>
                          </div>
                        </div>

                        {/* Amenities + Home Collection */}
                        <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                          {center.homeCollection && (
                            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-bold px-2 py-0.5 rounded-full">
                              <Truck className="w-2.5 h-2.5" />
                              Home Collection
                              {center.homeCollectionCharge === 0 ? ' (Free)' : ` (₹${center.homeCollectionCharge})`}
                            </span>
                          )}
                          {center.amenities.slice(0, 2).map(a => (
                            <span key={a} className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded-full">{a}</span>
                          ))}
                        </div>

                        {/* Book CTA */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-[10px] text-slate-400">{center.operatingHours}</div>
                          <span className="flex items-center gap-1 text-purple-700 text-xs font-black group-hover:gap-2 transition-all">
                            Select & Book <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── STEP 3: CONFIRM ─────────────────────────────────────────────────── */}
        {step === 'confirm' && selectedTest && selectedCenter && (() => {
          const testPrice = selectedCenter.prices[selectedTest.id] ?? 0;
          const homeCharge = homeCollection ? selectedCenter.homeCollectionCharge : 0;
          const total = testPrice + homeCharge;
          const isFree = testPrice === 0;

          return (
            <div className="p-4 space-y-4">
              <button onClick={() => setStep('compare_labs')} className="text-xs text-purple-600 font-bold hover:underline flex items-center gap-1">
                ← Change Lab
              </button>

              {/* Summary Card */}
              <div className="bg-gradient-to-br from-purple-700 to-purple-900 text-white rounded-2xl p-5 space-y-4">
                <div>
                  <div className="text-xs text-purple-200 font-bold uppercase tracking-wider">Booking Summary</div>
                  <h3 className="font-black text-lg mt-1 leading-tight">{selectedTest.name}</h3>
                  <p className="text-sm text-purple-200 mt-0.5">{selectedCenter.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/10 rounded-xl p-2.5">
                    <div className="text-purple-200">Distance</div>
                    <div className="font-black text-white">{selectedCenter.distanceKm} km away</div>
                    <div className="text-purple-300 text-[10px]">~{(selectedCenter.distanceKm / 25 * 60).toFixed(0)} min drive</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5">
                    <div className="text-purple-200">Results Ready</div>
                    <div className="font-black text-white">Within {selectedCenter.turnaroundHours}h</div>
                    <div className="text-purple-300 text-[10px]">Synced to ABHA EHR</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5">
                    <div className="text-purple-200">Test Price</div>
                    <div className={`font-black text-lg ${isFree ? 'text-emerald-300' : 'text-white'}`}>
                      {isFree ? 'FREE' : `₹${testPrice}`}
                    </div>
                    {isFree && <div className="text-emerald-300 text-[10px]">{selectedTest.mjpjayScheme || 'JSSK/MJPJAY'}</div>}
                  </div>
                  <div className={`rounded-xl p-2.5 ${homeCollection && homeCharge > 0 ? 'bg-blue-500/30' : 'bg-white/10'}`}>
                    <div className="text-purple-200">Total Payable</div>
                    <div className={`font-black text-lg ${total === 0 ? 'text-emerald-300' : 'text-white'}`}>
                      {total === 0 ? 'FREE' : `₹${total}`}
                    </div>
                    {homeCollection && <div className="text-[10px] text-purple-200">incl. home pickup</div>}
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Preferred Date</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Today', 'Tomorrow', 'Day After'].map(d => (
                    <button
                      key={d}
                      onClick={() => setBookingDate(d)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${bookingDate === d ? 'bg-purple-700 text-white border-purple-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold text-slate-700 block mt-2">Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {['7:00 AM – 9:00 AM', '9:00 AM – 11:00 AM', '11:00 AM – 1:00 PM', '3:00 PM – 5:00 PM'].map(slot => (
                    <button
                      key={slot}
                      onClick={() => setBookingTime(slot)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${bookingTime === slot ? 'bg-purple-700 text-white border-purple-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-300'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Home Collection Toggle */}
              {selectedCenter.homeCollection && (
                <button
                  onClick={() => setHomeCollection(!homeCollection)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${homeCollection ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-blue-300'}`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <Truck className={`w-5 h-5 ${homeCollection ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Home Sample Collection</div>
                      <div className="text-[10px] text-slate-500">
                        {selectedCenter.homeCollectionCharge === 0 ? 'Free doorstep pickup' : `₹${selectedCenter.homeCollectionCharge} extra charge`}
                      </div>
                    </div>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${homeCollection ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${homeCollection ? 'translate-x-5' : ''}`} />
                  </div>
                </button>
              )}

              {/* Fasting reminder */}
              {selectedTest.fasting && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2 text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-black">Fasting Required!</span> Do not eat or drink (except water) for at least 8 hours before your sample collection time.
                  </div>
                </div>
              )}

              {/* Confirm button */}
              <button
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-black py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-700/30"
              >
                {isBooking ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Booking...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Confirm Lab Test Booking {total > 0 ? `— ₹${total}` : '— FREE'}</>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                A confirmation SMS will be sent to your registered mobile. Bring your ABHA card or this booking reference to the lab.
              </p>
            </div>
          );
        })()}

      </div>
    </div>
  );
};
