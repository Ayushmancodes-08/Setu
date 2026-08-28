import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Facility, 
  HealthScheme, 
  AshaTask, 
  MedicineItem, 
  DiagnosticOrder, 
  TeleconsultationQueueItem, 
  DistrictMetric, 
  Referral,
  TriageUrgency
} from '../types';
import { 
  MAHARASHTRA_FACILITIES, 
  MAHARASHTRA_SCHEMES, 
  MOCK_ASHA_TASKS, 
  MOCK_MEDICINES, 
  MOCK_DIAGNOSTIC_ORDERS, 
  MOCK_TELECONSULT_QUEUE, 
  DISTRICT_METRICS,
  MOCK_REFERRALS 
} from '../data/mockData';

export interface PatientRecord {
  id: string;
  abhaId: string;
  name: string;
  nameMr: string;
  nameHi: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  village: string;
  taluka: string;
  district: string;
  category: 'Maternal ANC' | 'NCD Patient' | 'Pediatric' | 'General OPD' | 'Elderly Care';
  riskLevel: 'Low' | 'Moderate' | 'High-Risk' | 'Critical';
  vitals: {
    bp: string;
    pulse: string;
    spo2: string;
    temp: string;
    weight: string;
    hemoglobin?: string;
    bloodSugar?: string;
    lastRecordedAt: string;
  };
  diagnoses: string[];
  allergies: string[];
  assignedAsha: string;
  assignedCho: string;
  activePrescriptions: Array<{
    id: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    prescribedBy: string;
    prescribedAt: string;
    status: 'Pending Dispensing' | 'Dispensed' | 'Completed';
  }>;
  recentLabReports: Array<{
    id: string;
    testName: string;
    result: string;
    referenceRange: string;
    status: 'Pending' | 'Normal' | 'Abnormal' | 'Critical';
    reportedAt: string;
  }>;
  schemeEligibility: string[];
}

export interface PrescriptionOrder {
  id: string;
  tokenNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientVillage: string;
  doctorName: string;
  facilityName: string;
  prescribedAt: string;
  items: Array<{
    medicineId?: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions: string;
  }>;
  notes: string;
  status: 'QUEUED' | 'DISPENSED' | 'CANCELLED';
  dispensedAt?: string;
  dispensedBy?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  type: 'clinical' | 'pharmacy' | 'lab' | 'referral' | 'admin' | 'emergency';
}

const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: 'p-001',
    abhaId: '91-4821-9902-3312',
    name: 'Sunita Ravindra Shinde',
    nameMr: 'सुनिता रवींद्र शिंदे',
    nameHi: 'सुनीता रवीन्द्र शिंदे',
    age: 24,
    gender: 'Female',
    mobile: '+91 98230 44512',
    village: 'Khamgaon',
    taluka: 'Junnar',
    district: 'Pune',
    category: 'Maternal ANC',
    riskLevel: 'High-Risk',
    vitals: {
      bp: '138/92 mmHg',
      pulse: '88 bpm',
      spo2: '98%',
      temp: '98.6 °F',
      weight: '52 kg',
      hemoglobin: '8.2 g/dL (Severe Anemia)',
      bloodSugar: '108 mg/dL',
      lastRecordedAt: 'Today, 09:30 AM'
    },
    diagnoses: ['ANC 3rd Trimester (32 Weeks)', 'Gestational Anemia', 'Mild Pregnancy-Induced Hypertension'],
    allergies: ['Sulfonamides'],
    assignedAsha: 'Manisha Kadam',
    assignedCho: 'Pooja Jadhav (Khamgaon Sub-Centre)',
    activePrescriptions: [
      {
        id: 'rx-101',
        medicineName: 'Ferrous Ascorbate + Folic Acid (100mg+1.5mg)',
        dosage: '1 Tab',
        frequency: '1-0-1',
        duration: '30 Days',
        instructions: 'After lunch & dinner with water (Not with tea)',
        prescribedBy: 'Dr. Rohini Kulkarni (Junnar RH)',
        prescribedAt: 'Yesterday',
        status: 'Dispensed'
      },
      {
        id: 'rx-102',
        medicineName: 'Calcium Carbonate + Vit D3 (500mg)',
        dosage: '1 Tab',
        frequency: '0-1-0',
        duration: '30 Days',
        instructions: 'After breakfast',
        prescribedBy: 'Dr. Rohini Kulkarni (Junnar RH)',
        prescribedAt: 'Yesterday',
        status: 'Dispensed'
      }
    ],
    recentLabReports: [
      {
        id: 'lab-001',
        testName: 'Complete Blood Count (Hb & Platelets)',
        result: 'Hb: 8.2 g/dL (Low)',
        referenceRange: '11.5 - 15.5 g/dL',
        status: 'Abnormal',
        reportedAt: '27 Aug 2026'
      },
      {
        id: 'lab-002',
        testName: 'Urine Albumin & Sugar Dipstick',
        result: 'Trace (+1 Albumin, Nil Sugar)',
        referenceRange: 'Negative',
        status: 'Normal',
        reportedAt: '27 Aug 2026'
      }
    ],
    schemeEligibility: ['PM-JAY (AB-PMJAY)', 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)', 'Janani Shishu Suraksha Karyakram (JSSK)']
  },
  {
    id: 'p-002',
    abhaId: '91-3184-7719-8804',
    name: 'Shantabai Dnyaneshwar Kale',
    nameMr: 'शांताबाई ज्ञानेश्वर काळे',
    nameHi: 'शांताबाई ज्ञानेश्वर काले',
    age: 62,
    gender: 'Female',
    mobile: '+91 94221 00983',
    village: 'Otur',
    taluka: 'Junnar',
    district: 'Pune',
    category: 'NCD Patient',
    riskLevel: 'Moderate',
    vitals: {
      bp: '162/98 mmHg',
      pulse: '76 bpm',
      spo2: '97%',
      temp: '98.2 °F',
      weight: '68 kg',
      bloodSugar: '210 mg/dL (Random)',
      lastRecordedAt: 'Yesterday, 04:15 PM'
    },
    diagnoses: ['Essential Hypertension (Grade II)', 'Type 2 Diabetes Mellitus', 'Early Osteoarthritis Knee'],
    allergies: ['None Reported'],
    assignedAsha: 'Sunita Patil',
    assignedCho: 'Dr. Sandeep Ghule (Otur PHC)',
    activePrescriptions: [
      {
        id: 'rx-201',
        medicineName: 'Amlodipine 5mg',
        dosage: '1 Tab',
        frequency: '1-0-0',
        duration: '30 Days',
        instructions: 'Morning before food',
        prescribedBy: 'Dr. Sandeep Ghule',
        prescribedAt: '3 days ago',
        status: 'Dispensed'
      },
      {
        id: 'rx-202',
        medicineName: 'Metformin 500mg Sustained Release',
        dosage: '1 Tab',
        frequency: '1-0-1',
        duration: '30 Days',
        instructions: 'With meals',
        prescribedBy: 'Dr. Sandeep Ghule',
        prescribedAt: '3 days ago',
        status: 'Dispensed'
      }
    ],
    recentLabReports: [
      {
        id: 'lab-003',
        testName: 'Fasting & Postprandial Blood Glucose',
        result: 'FBS: 148 mg/dL | PPBS: 210 mg/dL',
        referenceRange: 'FBS < 100 | PPBS < 140 mg/dL',
        status: 'Abnormal',
        reportedAt: '25 Aug 2026'
      }
    ],
    schemeEligibility: ['Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)', 'National Programme for Healthcare of Elderly (NPHCE)']
  },
  {
    id: 'p-003',
    abhaId: '91-5509-2218-4491',
    name: 'Ganesh Bhau Pawar',
    nameMr: 'गणेश भाऊ पवार',
    nameHi: 'गणेश भाऊ पवार',
    age: 38,
    gender: 'Male',
    mobile: '+91 97632 18944',
    village: 'Dingore',
    taluka: 'Junnar',
    district: 'Pune',
    category: 'General OPD',
    riskLevel: 'Moderate',
    vitals: {
      bp: '124/80 mmHg',
      pulse: '96 bpm',
      spo2: '96%',
      temp: '102.4 °F',
      weight: '60 kg',
      lastRecordedAt: 'Today, 08:15 AM'
    },
    diagnoses: ['Acute Febrile Illness (Suspected Dengue / Malaria)', 'Myalgia and Chills'],
    allergies: ['Penicillin'],
    assignedAsha: 'Rukmini Gite',
    assignedCho: 'Kavita Thorat (Dingore SC)',
    activePrescriptions: [],
    recentLabReports: [
      {
        id: 'lab-004',
        testName: 'Malaria Rapid Antigen Test (Pv/Pf)',
        result: 'Pending Analysis',
        referenceRange: 'Negative',
        status: 'Pending',
        reportedAt: 'Today'
      }
    ],
    schemeEligibility: ['PM-JAY', 'MJPJAY']
  },
  {
    id: 'p-004',
    abhaId: '91-8820-1172-6639',
    name: 'Master Aarav Sachin Kulkarni',
    nameMr: 'मास्टर आरव सचिन कुलकर्णी',
    nameHi: 'मास्टर आरव सचिन कुलकर्णी',
    age: 1,
    gender: 'Male',
    mobile: '+91 98810 55432',
    village: 'Khamgaon',
    taluka: 'Junnar',
    district: 'Pune',
    category: 'Pediatric',
    riskLevel: 'Low',
    vitals: {
      bp: 'Normal',
      pulse: '110 bpm',
      spo2: '99%',
      temp: '98.4 °F',
      weight: '9.4 kg',
      lastRecordedAt: '3 days ago'
    },
    diagnoses: ['Routine Growth & Immunization Tracking', 'Due for MR Vaccine 1st Dose + Vitamin A'],
    allergies: ['None'],
    assignedAsha: 'Manisha Kadam',
    assignedCho: 'Pooja Jadhav (Khamgaon Sub-Centre)',
    activePrescriptions: [],
    recentLabReports: [],
    schemeEligibility: ['Universal Immunization Programme (UIP)', 'Janani Shishu Suraksha Karyakram (JSSK)']
  },
  {
    id: 'p-005',
    abhaId: '91-7442-9901-3310',
    name: 'Rameshbhai Gavit',
    nameMr: 'रमेशभाई गावित',
    nameHi: 'रमेशभाई गावित',
    age: 54,
    gender: 'Male',
    mobile: '+91 94055 77123',
    village: 'Toranmal',
    taluka: 'Shahada',
    district: 'Nandurbar',
    category: 'General OPD',
    riskLevel: 'Critical',
    vitals: {
      bp: '178/104 mmHg',
      pulse: '112 bpm',
      spo2: '91%',
      temp: '99.0 °F',
      weight: '64 kg',
      lastRecordedAt: 'Today, 10:45 AM'
    },
    diagnoses: ['Acute Coronary Syndrome (Suspected STEMI)', 'Severe Dyspnea', 'Cardiogenic Pre-Shock'],
    allergies: ['None Reported'],
    assignedAsha: 'Kavita Valvi',
    assignedCho: 'Dr. Chetan Padvi (Toranmal PHC)',
    activePrescriptions: [],
    recentLabReports: [],
    schemeEligibility: ['PM-JAY', 'MJPJAY Tribal Emergency Fund']
  }
];

const INITIAL_PRESCRIPTION_ORDERS: PrescriptionOrder[] = [
  {
    id: 'rx-ord-01',
    tokenNumber: 'RX-2026-0881',
    patientId: 'p-001',
    patientName: 'Sunita Ravindra Shinde',
    patientAge: 24,
    patientGender: 'Female',
    patientVillage: 'Khamgaon',
    doctorName: 'Dr. Rohini Kulkarni, MD',
    facilityName: 'Junnar Rural Hospital',
    prescribedAt: 'Today, 10:15 AM',
    items: [
      {
        name: 'Ferrous Ascorbate + Folic Acid (100mg+1.5mg)',
        dosage: '1 Tablet',
        frequency: '1-0-1 (Twice Daily)',
        duration: '30 Days',
        quantity: 60,
        instructions: 'Take with lemon water after food for maximum iron absorption. Do not take with milk/tea.'
      },
      {
        name: 'Calcium Carbonate + Vitamin D3 (500mg+250IU)',
        dosage: '1 Tablet',
        frequency: '0-1-0 (Afternoon)',
        duration: '30 Days',
        quantity: 30,
        instructions: 'After lunch with water.'
      },
      {
        name: 'Paracetamol 500mg',
        dosage: '1 Tablet',
        frequency: 'SOS (As needed)',
        duration: '3 Days',
        quantity: 6,
        instructions: 'Only if body pain or fever > 99.5°F.'
      }
    ],
    notes: 'ANC High-Risk Hb 8.2 g/dL. Dietary counsel provided. Review in 14 days with repeat Hb test.',
    status: 'QUEUED'
  },
  {
    id: 'rx-ord-02',
    tokenNumber: 'RX-2026-0882',
    patientId: 'p-002',
    patientName: 'Shantabai Dnyaneshwar Kale',
    patientAge: 62,
    patientGender: 'Female',
    patientVillage: 'Otur',
    doctorName: 'Dr. Sandeep Ghule, MBBS',
    facilityName: 'Otur PHC',
    prescribedAt: 'Today, 11:30 AM',
    items: [
      {
        name: 'Amlodipine Besylate 5mg',
        dosage: '1 Tablet',
        frequency: '1-0-0 (Morning)',
        duration: '30 Days',
        quantity: 30,
        instructions: 'Strict morning dose before breakfast. Monitor BP weekly.'
      },
      {
        name: 'Metformin Hydrochloride 500mg SR',
        dosage: '1 Tablet',
        frequency: '1-0-1 (Twice Daily)',
        duration: '30 Days',
        quantity: 60,
        instructions: 'Strictly with breakfast and dinner.'
      }
    ],
    notes: 'Hypertension + Diabetes maintenance refill. Salt restriction advised.',
    status: 'QUEUED'
  }
];

const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    timestamp: '2 mins ago',
    actor: 'Dr. Rohini Kulkarni',
    role: 'Medical Officer',
    action: 'Teleconsultation Completed',
    details: 'Issued digital e-Prescription (RX-2026-0881) for Sunita Shinde (ANC Hb 8.2 g/dL)',
    type: 'clinical'
  },
  {
    id: 'act-2',
    timestamp: '8 mins ago',
    actor: 'Manisha Kadam',
    role: 'ASHA Worker',
    action: 'High-Risk Triage Logged',
    details: 'Recorded home visit vitals for Sunita Shinde (BP 138/92 mmHg, SpO2 98%)',
    type: 'clinical'
  },
  {
    id: 'act-3',
    timestamp: '15 mins ago',
    actor: 'Anand Shinde',
    role: 'Lab Technician',
    action: 'Diagnostic Test Requisition',
    details: 'Blood sample received for Malaria Rapid & CBC (Dingore SC)',
    type: 'lab'
  },
  {
    id: 'act-4',
    timestamp: '22 mins ago',
    actor: 'Pooja Jadhav, CHO',
    role: 'Community Health Officer',
    action: 'Teleconsultation Queued',
    details: 'Assisted teleconsultation token #24 booked for Khamgaon Ayushman Arogya Mandir',
    type: 'clinical'
  },
  {
    id: 'act-5',
    timestamp: '35 mins ago',
    actor: 'Junnar Rural Hospital Command',
    role: 'Facility Coordinator',
    action: 'Ambulance 108 Dispatched',
    details: '108 Ambulance MH-14-AH-2918 assigned to Toranmal emergency cardiac transfer',
    type: 'emergency'
  }
];

interface HealthDataContextType {
  // State
  patients: PatientRecord[];
  facilities: Facility[];
  medicines: MedicineItem[];
  diagnosticOrders: DiagnosticOrder[];
  teleconsultQueue: TeleconsultationQueueItem[];
  referrals: Referral[];
  ashaTasks: AshaTask[];
  prescriptionOrders: PrescriptionOrder[];
  districtMetrics: DistrictMetric[];
  activityLogs: ActivityEvent[];

  // Patient Actions
  registerPatient: (patientData: Partial<PatientRecord>) => PatientRecord;
  updatePatientVitals: (patientId: string, vitals: Partial<PatientRecord['vitals']>, notes?: string) => void;
  getPatientByAbhaOrMobile: (query: string) => PatientRecord | undefined;
  
  // Teleconsultation Actions
  enqueueTeleconsult: (item: Partial<TeleconsultationQueueItem>) => TeleconsultationQueueItem;
  updateTeleconsultStatus: (queueId: string, status: TeleconsultationQueueItem['status']) => void;
  completeConsultationAndIssueRx: (queueId: string, prescriptionData: Omit<PrescriptionOrder, 'id' | 'tokenNumber' | 'prescribedAt' | 'status'>) => void;

  // Pharmacy Actions
  dispensePrescription: (orderId: string, pharmacistName: string) => boolean;
  updateMedicineStock: (medicineId: string, quantityChange: number) => void;
  addNewStockConsignment: (medicineData: Partial<MedicineItem>) => void;

  // Lab Actions
  createDiagnosticOrder: (order: Partial<DiagnosticOrder>) => DiagnosticOrder;
  submitLabResult: (orderId: string, resultValue: string, isPanicValue?: boolean, notes?: string) => void;

  // Referral & Bed Actions
  createReferral: (referralData: Partial<Referral>) => Referral;
  updateReferralStatus: (referralId: string, status: Referral['status']) => void;
  updateFacilityBeds: (facilityId: string, change: { availableBeds?: number; icuBedsAvailable?: number }) => void;

  // ASHA & Community Actions
  completeAshaTask: (taskId: string, recordedVitals?: any, notes?: string) => void;
  addAshaTask: (task: Partial<AshaTask>) => AshaTask;

  // Helper
  logActivity: (actor: string, role: string, action: string, details: string, type?: ActivityEvent['type']) => void;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [facilities, setFacilities] = useState<Facility[]>(MAHARASHTRA_FACILITIES);
  const [medicines, setMedicines] = useState<MedicineItem[]>(MOCK_MEDICINES);
  const [diagnosticOrders, setDiagnosticOrders] = useState<DiagnosticOrder[]>(MOCK_DIAGNOSTIC_ORDERS);
  const [teleconsultQueue, setTeleconsultQueue] = useState<TeleconsultationQueueItem[]>(MOCK_TELECONSULT_QUEUE);
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [ashaTasks, setAshaTasks] = useState<AshaTask[]>(MOCK_ASHA_TASKS);
  const [prescriptionOrders, setPrescriptionOrders] = useState<PrescriptionOrder[]>(INITIAL_PRESCRIPTION_ORDERS);
  const [districtMetrics, setDistrictMetrics] = useState<DistrictMetric[]>(DISTRICT_METRICS);
  const [activityLogs, setActivityLogs] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);

  const logActivity = (actor: string, role: string, action: string, details: string, type: ActivityEvent['type'] = 'clinical') => {
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      actor,
      role,
      action,
      details,
      type
    };
    setActivityLogs(prev => [newEvent, ...prev.slice(0, 49)]);
  };

  const registerPatient = (patientData: Partial<PatientRecord>): PatientRecord => {
    const randomAbha = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient: PatientRecord = {
      id: `p-${Date.now()}`,
      abhaId: patientData.abhaId || randomAbha,
      name: patientData.name || 'New Patient',
      nameMr: patientData.nameMr || patientData.name || 'नवीन रुग्ण',
      nameHi: patientData.nameHi || patientData.name || 'नया मरीज',
      age: patientData.age || 30,
      gender: patientData.gender || 'Female',
      mobile: patientData.mobile || '+91 98000 00000',
      village: patientData.village || 'Khamgaon',
      taluka: patientData.taluka || 'Junnar',
      district: patientData.district || 'Pune',
      category: patientData.category || 'General OPD',
      riskLevel: patientData.riskLevel || 'Low',
      vitals: patientData.vitals || {
        bp: '120/80 mmHg',
        pulse: '78 bpm',
        spo2: '98%',
        temp: '98.4 °F',
        weight: '55 kg',
        lastRecordedAt: 'Just now'
      },
      diagnoses: patientData.diagnoses || ['General Health Checkup'],
      allergies: patientData.allergies || ['None Known'],
      assignedAsha: patientData.assignedAsha || 'Manisha Kadam',
      assignedCho: patientData.assignedCho || 'Pooja Jadhav (Khamgaon Sub-Centre)',
      activePrescriptions: [],
      recentLabReports: [],
      schemeEligibility: ['PM-JAY', 'MJPJAY', 'ABHA Verified']
    };

    setPatients(prev => [newPatient, ...prev]);
    logActivity('Registration Desk', 'ASHA / Frontline', 'Registered New Patient', `ABHA: ${newPatient.abhaId} — ${newPatient.name} (${newPatient.village})`, 'clinical');
    return newPatient;
  };

  const updatePatientVitals = (patientId: string, vitals: Partial<PatientRecord['vitals']>, notes?: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          vitals: {
            ...p.vitals,
            ...vitals,
            lastRecordedAt: 'Just now'
          }
        };
      }
      return p;
    }));
    logActivity('Clinical Staff', 'Nurse / ASHA', 'Updated Vitals Record', `Patient ID ${patientId}: BP ${vitals.bp || 'Checked'}, SpO2 ${vitals.spo2 || 'Checked'}. ${notes || ''}`, 'clinical');
  };

  const getPatientByAbhaOrMobile = (query: string): PatientRecord | undefined => {
    const clean = query.replace(/[\s-]/g, '').toLowerCase();
    if (!clean) return undefined;
    return patients.find(p => {
      const pAbha = p.abhaId.replace(/[\s-]/g, '').toLowerCase();
      const pMobile = p.mobile.replace(/[\s-+]/g, '');
      const pName = p.name.toLowerCase();
      return pAbha.includes(clean) || pMobile.includes(clean) || pName.includes(clean);
    });
  };

  const enqueueTeleconsult = (item: Partial<TeleconsultationQueueItem>): TeleconsultationQueueItem => {
    const token = `TK-${Math.floor(20 + Math.random() * 80)}`;
    const newItem: TeleconsultationQueueItem = {
      id: `tq-${Date.now()}`,
      tokenNumber: token,
      patientName: item.patientName || 'Walk-in Patient',
      patientAge: item.patientAge || 28,
      gender: item.gender || 'Female',
      village: item.village || 'Khamgaon',
      presentingComplaint: item.presentingComplaint || 'Clinical evaluation & medication review',
      urgency: item.urgency || 'amber',
      vitals: item.vitals || {
        bp: '130/85 mmHg',
        pulse: '84 bpm',
        spo2: '98%',
        temp: '98.6 °F',
        weight: '54 kg'
      },
      connectedChoName: item.connectedChoName || 'Pooja Jadhav, CHO',
      subCenterName: item.subCenterName || 'Khamgaon Ayushman Arogya Mandir',
      waitingMinutes: 1,
      status: 'Waiting',
      videoRoomId: `room-${Date.now().toString().slice(-6)}`
    };

    setTeleconsultQueue(prev => [...prev, newItem]);
    logActivity(newItem.connectedChoName, 'CHO / Spoke Lead', 'Queued e-Sanjeevani Teleconsult', `Token ${newItem.tokenNumber} for ${newItem.patientName} (${newItem.urgency.toUpperCase()})`, 'clinical');
    return newItem;
  };

  const updateTeleconsultStatus = (queueId: string, status: TeleconsultationQueueItem['status']) => {
    setTeleconsultQueue(prev => prev.map(item => item.id === queueId ? { ...item, status } : item));
  };

  const completeConsultationAndIssueRx = (
    queueId: string, 
    prescriptionData: Omit<PrescriptionOrder, 'id' | 'tokenNumber' | 'prescribedAt' | 'status'>
  ) => {
    const orderNumber = `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRxOrder: PrescriptionOrder = {
      ...prescriptionData,
      id: `rx-ord-${Date.now()}`,
      tokenNumber: orderNumber,
      prescribedAt: 'Just now',
      status: 'QUEUED'
    };

    // Add to Pharmacy Queue
    setPrescriptionOrders(prev => [newRxOrder, ...prev]);

    // Update patient EHR
    setPatients(prev => prev.map(p => {
      if (p.id === prescriptionData.patientId || p.name === prescriptionData.patientName) {
        const newRxEntries = prescriptionData.items.map((it, idx) => ({
          id: `rx-item-${Date.now()}-${idx}`,
          medicineName: it.name,
          dosage: it.dosage,
          frequency: it.frequency,
          duration: it.duration,
          instructions: it.instructions,
          prescribedBy: prescriptionData.doctorName,
          prescribedAt: 'Just now',
          status: 'Pending Dispensing' as const
        }));
        return {
          ...p,
          activePrescriptions: [...newRxEntries, ...p.activePrescriptions]
        };
      }
      return p;
    }));

    // Update queue status
    updateTeleconsultStatus(queueId, 'Prescription Issued');

    logActivity(prescriptionData.doctorName, 'Medical Officer / Specialist', 'Issued Digital e-Prescription', `Prescription ${orderNumber} created for ${prescriptionData.patientName} (${prescriptionData.items.length} medicines)`, 'clinical');
  };

  const dispensePrescription = (orderId: string, pharmacistName: string): boolean => {
    const order = prescriptionOrders.find(o => o.id === orderId);
    if (!order) return false;

    // Deduct stock for each prescribed item if found in inventory
    order.items.forEach(item => {
      setMedicines(prevMeds => prevMeds.map(m => {
        if (m.name.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(m.name.toLowerCase())) {
          const newQty = Math.max(0, m.currentStock - (item.quantity || 10));
          return {
            ...m,
            currentStock: newQty,
            status: newQty === 0 ? 'Critical Stock-Out' : newQty <= m.reorderLevel ? 'Low Stock' : 'In Stock',
            lastDispensedDate: 'Today'
          };
        }
        return m;
      }));
    });

    // Update prescription order status
    setPrescriptionOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'DISPENSED',
      dispensedAt: 'Just now',
      dispensedBy: pharmacistName
    } : o));

    // Update patient EHR active prescriptions status
    setPatients(prev => prev.map(p => {
      if (p.id === order.patientId || p.name === order.patientName) {
        return {
          ...p,
          activePrescriptions: p.activePrescriptions.map(rx => ({
            ...rx,
            status: 'Dispensed'
          }))
        };
      }
      return p;
    }));

    logActivity(pharmacistName, 'Pharmacist', 'Dispensed Medication Order', `Order ${order.tokenNumber} fulfilled for ${order.patientName}. Inventory levels updated.`, 'pharmacy');
    return true;
  };

  const updateMedicineStock = (medicineId: string, quantityChange: number) => {
    setMedicines(prev => prev.map(m => {
      if (m.id === medicineId) {
        const newStock = Math.max(0, m.currentStock + quantityChange);
        const status = newStock === 0 ? 'Critical Stock-Out' : newStock <= m.reorderLevel ? 'Low Stock' : 'In Stock';
        return { ...m, currentStock: newStock, status };
      }
      return m;
    }));
  };

  const addNewStockConsignment = (medicineData: Partial<MedicineItem>) => {
    const newItem: MedicineItem = {
      id: `med-${Date.now()}`,
      code: medicineData.code || `MH-DRUG-${Math.floor(100 + Math.random() * 900)}`,
      name: medicineData.name || 'New Drug',
      genericName: medicineData.genericName || medicineData.name || 'Generic Compound',
      category: medicineData.category || 'Antibiotic',
      currentStock: medicineData.currentStock || 500,
      reorderLevel: medicineData.reorderLevel || 100,
      unit: medicineData.unit || 'Strip of 10 Tablets',
      batchNumber: medicineData.batchNumber || `BT-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: medicineData.expiryDate || '2028-12-31',
      status: 'In Stock',
      location: medicineData.location || 'Central Pharmacy Shelf A-1',
      lastDispensedDate: 'Just arrived'
    };

    setMedicines(prev => [newItem, ...prev]);
    logActivity('e-Aushadhi Officer', 'Pharmacist / Logistics', 'Received New Drug Inward Consignment', `Batch ${newItem.batchNumber}: ${newItem.name} (+${newItem.currentStock} units)`, 'pharmacy');
  };

  const createDiagnosticOrder = (order: Partial<DiagnosticOrder>): DiagnosticOrder => {
    const orderNum = `LAB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: DiagnosticOrder = {
      id: `diag-${Date.now()}`,
      orderNumber: orderNum,
      patientName: order.patientName || 'Patient',
      patientAge: order.patientAge || 30,
      patientGender: order.patientGender || 'Female',
      testName: order.testName || 'Complete Blood Count (CBC)',
      testCategory: order.testCategory || 'Hematology',
      sampleType: order.sampleType || 'Whole Blood (EDTA)',
      sampleStatus: 'Sample Collected',
      orderingDoctor: order.orderingDoctor || 'Dr. Rohini Kulkarni',
      facility: order.facility || 'Junnar Rural Hospital Diagnostic Wing',
      orderedAt: 'Just now'
    };

    setDiagnosticOrders(prev => [newOrder, ...prev]);
    logActivity(newOrder.orderingDoctor, 'Medical Officer', 'Created Diagnostic Requisition', `${newOrder.testName} ordered for ${newOrder.patientName}`, 'lab');
    return newOrder;
  };

  const submitLabResult = (orderId: string, resultValue: string, isPanicValue: boolean = false, notes?: string) => {
    const order = diagnosticOrders.find(o => o.id === orderId);
    if (!order) return;

    setDiagnosticOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      resultValue,
      isPanicValue,
      sampleStatus: isPanicValue ? 'Critical Alert' : 'Validated',
      resultNotes: notes
    } : o));

    // Update patient EHR
    setPatients(prev => prev.map(p => {
      if (p.name === order.patientName) {
        const newReport = {
          id: `lab-rep-${Date.now()}`,
          testName: order.testName,
          result: resultValue,
          referenceRange: order.referenceRange || 'Standard Normal Range',
          status: (isPanicValue ? 'Critical' : 'Normal') as any,
          reportedAt: 'Just now'
        };
        return {
          ...p,
          recentLabReports: [newReport, ...p.recentLabReports]
        };
      }
      return p;
    }));

    logActivity('Diagnostic Wing', 'Lab Technician', 'Verified Diagnostic Test Result', `Report ${order.orderNumber} for ${order.patientName}: ${resultValue} ${isPanicValue ? '⚠️ [CRITICAL ALERT]' : '✅ [VERIFIED]'}`, 'lab');
  };

  const createReferral = (referralData: Partial<Referral>): Referral => {
    const refCode = `REF-MH-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRef: Referral = {
      id: `ref-${Date.now()}`,
      referralCode: refCode,
      patientId: referralData.patientId || 'p-001',
      patientName: referralData.patientName || 'Patient',
      patientAge: referralData.patientAge || 35,
      patientGender: referralData.patientGender || 'Female',
      patientVillage: referralData.patientVillage || 'Khamgaon',
      referringRole: referralData.referringRole || 'cho',
      referringProviderName: referralData.referringProviderName || 'Pooja Jadhav, CHO',
      referringFacilityName: referralData.referringFacilityName || 'Khamgaon Ayushman Arogya Mandir',
      targetFacilityName: referralData.targetFacilityName || 'Junnar Rural Hospital & Trauma Centre',
      targetSpecialty: referralData.targetSpecialty || 'Obstetrics & Gynecology',
      urgency: referralData.urgency || 'amber',
      reasonForReferral: referralData.reasonForReferral || 'Specialist escalation & management',
      status: 'SENT',
      createdAt: 'Just now'
    };

    setReferrals(prev => [newRef, ...prev]);

    // Deduct available bed from target facility if emergency
    setFacilities(prev => prev.map(f => {
      if (f.name.includes(newRef.targetFacilityName) || newRef.targetFacilityName.includes(f.name)) {
        return {
          ...f,
          availableBeds: Math.max(0, f.availableBeds - 1),
          icuBedsAvailable: newRef.urgency === 'red' ? Math.max(0, f.icuBedsAvailable - 1) : f.icuBedsAvailable
        };
      }
      return f;
    }));

    logActivity(newRef.referringProviderName, 'Clinical Lead', 'Initiated Specialist Referral & Bed Reservation', `${newRef.referralCode}: ${newRef.patientName} referred to ${newRef.targetFacilityName} (${newRef.urgency.toUpperCase()})`, 'referral');
    return newRef;
  };

  const updateReferralStatus = (referralId: string, status: Referral['status']) => {
    setReferrals(prev => prev.map(r => r.id === referralId ? { ...r, status } : r));
    logActivity('Referral Coordinator', 'Hospital Admin', 'Updated Referral Status', `Referral ID ${referralId} marked as ${status}`, 'referral');
  };

  const updateFacilityBeds = (facilityId: string, change: { availableBeds?: number; icuBedsAvailable?: number }) => {
    setFacilities(prev => prev.map(f => {
      if (f.id === facilityId) {
        return {
          ...f,
          availableBeds: change.availableBeds !== undefined ? Math.max(0, Math.min(f.totalBeds, change.availableBeds)) : f.availableBeds,
          icuBedsAvailable: change.icuBedsAvailable !== undefined ? Math.max(0, change.icuBedsAvailable) : f.icuBedsAvailable
        };
      }
      return f;
    }));
  };

  const completeAshaTask = (taskId: string, recordedVitals?: any, notes?: string) => {
    setAshaTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          isSynced: true,
          completedAt: 'Just now',
          lastVitals: recordedVitals || t.lastVitals,
          notes: notes || t.notes
        };
      }
      return t;
    }));
    logActivity('ASHA Worker', 'Field Frontline', 'Completed Household Healthcare Visit', `Task #${taskId} synchronized with Maharashtra HMIS.`, 'clinical');
  };

  const addAshaTask = (task: Partial<AshaTask>): AshaTask => {
    const newTask: AshaTask = {
      id: `task-${Date.now()}`,
      patientName: task.patientName || 'New Citizen',
      patientAge: task.patientAge || 28,
      village: task.village || 'Khamgaon',
      householdNumber: task.householdNumber || `HH-${Math.floor(10 + Math.random() * 90)}`,
      category: task.category || 'Maternal ANC',
      urgency: task.urgency || 'today',
      dueDate: 'Today',
      actionRequired: task.actionRequired || 'Routine vitals screening & nutritional counseling',
      actionRequiredMr: task.actionRequiredMr || 'आरोग्य तपासणी व पोषण सल्ला',
      vitalsDue: ['BP', 'Hb', 'Weight', 'Blood Sugar'],
      isSynced: true
    };

    setAshaTasks(prev => [newTask, ...prev]);
    logActivity('ASHA Lead', 'Community Worker', 'Added New Field Follow-up Task', `${newTask.patientName} (${newTask.category}) in ${newTask.village}`, 'clinical');
    return newTask;
  };

  return (
    <HealthDataContext.Provider value={{
      patients,
      facilities,
      medicines,
      diagnosticOrders,
      teleconsultQueue,
      referrals,
      ashaTasks,
      prescriptionOrders,
      districtMetrics,
      activityLogs,
      registerPatient,
      updatePatientVitals,
      getPatientByAbhaOrMobile,
      enqueueTeleconsult,
      updateTeleconsultStatus,
      completeConsultationAndIssueRx,
      dispensePrescription,
      updateMedicineStock,
      addNewStockConsignment,
      createDiagnosticOrder,
      submitLabResult,
      createReferral,
      updateReferralStatus,
      updateFacilityBeds,
      completeAshaTask,
      addAshaTask,
      logActivity
    }}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};
