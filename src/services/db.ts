/**
 * IndexedDB Enterprise Realtime Persistence Engine for SETU Health Platform
 * Provides reactive cross-console synchronization and persistent local storage
 * for Users, Patients, Teleconsult Queue, Prescriptions, Inventory, Labs, Referrals & Facilities.
 */

import { Role } from '../types';
import { 
  MAHARASHTRA_FACILITIES, 
  DISTRICT_METRICS,
  MOCK_ASHA_TASKS 
} from '../data/mockData';

export interface DBUser {
  id: string;
  role: Role;
  username: string;
  fullName: string;
  phone: string;
  identifierNumber: string; // e.g. ABHA ID, Medical Reg No, Employee ID
  facilityName: string;
  taluka: string;
  district: string;
  designation: string;
  avatarInitials: string;
  createdAt: string;
}

export interface DBPrescription {
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

export interface DBPatient {
  id: string;
  abhaId: string;
  name: string;
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
    status: 'Pending Dispensing' | 'Dispensed';
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
  createdAt: string;
}

export interface DBTeleconsult {
  id: string;
  tokenNumber: string;
  patientName: string;
  patientAge: number;
  gender: string;
  village: string;
  presentingComplaint: string;
  urgency: 'red' | 'amber' | 'green';
  vitals: {
    bp: string;
    pulse: string;
    spo2: string;
    temp: string;
    weight: string;
  };
  connectedChoName: string;
  subCenterName: string;
  waitingMinutes: number;
  status: 'Waiting' | 'In Call' | 'Prescription Issued' | 'Referred to District';
  videoRoomId: string;
  createdAt: string;
}

export interface DBMedicine {
  id: string;
  code: string;
  name: string;
  genericName: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  batchNumber: string;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Critical Stock-Out';
  location: string;
  lastDispensedDate: string;
}

export interface DBLabOrder {
  id: string;
  orderNumber: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  testName: string;
  testCategory: string;
  sampleType: string;
  sampleStatus: 'Sample Collected' | 'Processing' | 'Validated' | 'Critical Alert';
  orderingDoctor: string;
  facility: string;
  orderedAt: string;
  resultValue?: string;
  referenceRange?: string;
  isPanicValue?: boolean;
  resultNotes?: string;
}

export interface DBReferral {
  id: string;
  referralCode: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientVillage: string;
  referringRole: Role;
  referringProviderName: string;
  referringFacilityName: string;
  targetFacilityName: string;
  targetSpecialty: string;
  urgency: 'red' | 'amber' | 'green';
  reasonForReferral: string;
  status: 'SENT' | 'RECEIVED' | 'CONSULTATION_IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
}

export interface DBActivity {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  type: 'clinical' | 'pharmacy' | 'lab' | 'referral' | 'admin' | 'emergency';
}

const DB_NAME = 'SetuMahaHealthDB_v2';
const DB_VERSION = 1;

// Default Pre-seeded Users for 1-Click Role Logins
export const DEFAULT_ROLE_ACCOUNTS: Record<Role, DBUser> = {
  patient: {
    id: 'usr-patient-01',
    role: 'patient',
    username: 'sunita.shinde',
    fullName: 'Sunita Ravindra Shinde',
    phone: '+91 98230 44512',
    identifierNumber: '91-4821-9902-3312 (ABHA ID)',
    facilityName: 'Khamgaon Ayushman Arogya Mandir',
    taluka: 'Junnar',
    district: 'Pune',
    designation: 'Citizen / Pregnant Beneficiary (ANC 32W)',
    avatarInitials: 'SR',
    createdAt: '2026-08-20'
  },
  asha: {
    id: 'usr-asha-01',
    role: 'asha',
    username: 'manisha.kadam',
    fullName: 'Manisha Kadam',
    phone: '+91 98901 23412',
    identifierNumber: 'ASHA-PUN-0482',
    facilityName: 'Khamgaon Sub-Centre Sector 4',
    taluka: 'Junnar',
    district: 'Pune',
    designation: 'Frontline Community Health Worker (ASHA)',
    avatarInitials: 'MK',
    createdAt: '2026-08-20'
  },
  cho: {
    id: 'usr-cho-01',
    role: 'cho',
    username: 'pooja.jadhav',
    fullName: 'Pooja Jadhav, CHO',
    phone: '+91 94220 88312',
    identifierNumber: 'CHO-MH-8819',
    facilityName: 'Khamgaon Ayushman Arogya Mandir',
    taluka: 'Junnar',
    district: 'Pune',
    designation: 'Community Health Officer (BAMS / CCH)',
    avatarInitials: 'PJ',
    createdAt: '2026-08-20'
  },
  doctor: {
    id: 'usr-doc-01',
    role: 'doctor',
    username: 'dr.rohini',
    fullName: 'Dr. Rohini Kulkarni, MD',
    phone: '+91 98224 11092',
    identifierNumber: 'MCI-2014-99812 (MCI Reg)',
    facilityName: 'Junnar Rural Hospital & Telemedicine Hub',
    taluka: 'Junnar',
    district: 'Pune',
    designation: 'Medical Officer / Specialist (OBGYN)',
    avatarInitials: 'RK',
    createdAt: '2026-08-20'
  },
  specialist: {
    id: 'usr-spec-01',
    role: 'specialist',
    username: 'dr.deshmukh',
    fullName: 'Dr. Swapnil Deshmukh, MS',
    phone: '+91 98221 44550',
    identifierNumber: 'MCI-2011-44109',
    facilityName: 'Pune District Civil Hospital Tele-Hub',
    taluka: 'Haveli',
    district: 'Pune',
    designation: 'Chief Consultant Surgeon',
    avatarInitials: 'SD',
    createdAt: '2026-08-20'
  },
  pharmacist: {
    id: 'usr-pharm-01',
    role: 'pharmacist',
    username: 'anand.deshmukh',
    fullName: 'Anand Deshmukh',
    phone: '+91 97630 11982',
    identifierNumber: 'PHARM-MH-2018-4412',
    facilityName: 'Junnar Central Hospital Pharmacy',
    taluka: 'Junnar',
    district: 'Pune',
    designation: 'Chief Pharmacist / e-Aushadhi Officer',
    avatarInitials: 'AD',
    createdAt: '2026-08-20'
  },
  lab: {
    id: 'usr-lab-01',
    role: 'lab',
    username: 'anand.shinde',
    fullName: 'Anand Shinde',
    phone: '+91 94055 22910',
    identifierNumber: 'LIS-TECH-8812',
    facilityName: 'Junnar Central Diagnostic Laboratory',
    taluka: 'Junnar',
    district: 'Pune',
    designation: 'Senior Medical Laboratory Technician',
    avatarInitials: 'AS',
    createdAt: '2026-08-20'
  },
  facility: {
    id: 'usr-fac-01',
    role: 'facility',
    username: 'junnar.admin',
    fullName: 'Junnar Emergency Bed Command',
    phone: '+91 2132 222108',
    identifierNumber: 'FAC-PUN-0104',
    facilityName: 'Junnar Rural Hospital & Trauma Centre',
    taluka: 'Junnar',
    district: 'Pune',
    designation: 'Hospital Superintendent & 108 Coordinator',
    avatarInitials: 'JR',
    createdAt: '2026-08-20'
  },
  dho: {
    id: 'usr-dho-01',
    role: 'dho',
    username: 'dho.pune',
    fullName: 'Dr. Ramchandra Hankare, DHO',
    phone: '+91 20 2612 3450',
    identifierNumber: 'DHS-MH-DIR-009',
    facilityName: 'District Health Office, Directorate of Health Services',
    taluka: 'Pune HQ',
    district: 'Pune',
    designation: 'District Health Officer (DHO), Pune',
    avatarInitials: 'RH',
    createdAt: '2026-08-20'
  }
};

class IndexedDBManager {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private changeListeners: Set<() => void> = new Set();

  constructor() {
    this.initDB();
  }

  public subscribe(callback: () => void) {
    this.changeListeners.add(callback);
    return () => {
      this.changeListeners.delete(callback);
    };
  }

  private notify() {
    this.changeListeners.forEach(cb => {
      try { cb(); } catch (e) { console.error('Listener error', e); }
    });
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db: IDBDatabase = event.target.result;

        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('session')) {
          db.createObjectStore('session', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('patients')) {
          const pStore = db.createObjectStore('patients', { keyPath: 'id' });
          pStore.createIndex('abhaId', 'abhaId', { unique: false });
          pStore.createIndex('name', 'name', { unique: false });
        }
        if (!db.objectStoreNames.contains('teleconsultQueue')) {
          db.createObjectStore('teleconsultQueue', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('prescriptions')) {
          db.createObjectStore('prescriptions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('inventory')) {
          db.createObjectStore('inventory', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('diagnosticOrders')) {
          db.createObjectStore('diagnosticOrders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('referrals')) {
          db.createObjectStore('referrals', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('activityLogs')) {
          db.createObjectStore('activityLogs', { keyPath: 'id' });
        }
      };

      request.onsuccess = async (event: any) => {
        const db: IDBDatabase = event.target.result;
        await this.seedInitialDataIfEmpty(db);
        resolve(db);
      };

      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });

    return this.dbPromise;
  }

  private async seedInitialDataIfEmpty(db: IDBDatabase) {
    const userCount = await this.countItems(db, 'users');
    if (userCount > 0) return; // Already seeded

    const tx = db.transaction(
      ['users', 'patients', 'teleconsultQueue', 'prescriptions', 'inventory', 'diagnosticOrders', 'referrals', 'activityLogs', 'session'],
      'readwrite'
    );

    // 1. Seed Role Users
    const userStore = tx.objectStore('users');
    Object.values(DEFAULT_ROLE_ACCOUNTS).forEach(u => userStore.put(u));

    // 2. Default Active Session (None or Guest)
    tx.objectStore('session').put({ key: 'activeUser', user: null });

    // 3. Seed Patients
    const patientStore = tx.objectStore('patients');
    const p1: DBPatient = {
      id: 'p-001',
      abhaId: '91-4821-9902-3312',
      name: 'Sunita Ravindra Shinde',
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
        hemoglobin: '8.2 g/dL (Severe Gestational Anemia)',
        bloodSugar: '108 mg/dL',
        lastRecordedAt: 'Today, 09:30 AM'
      },
      diagnoses: ['ANC 3rd Trimester (32 Weeks)', 'Gestational Anemia', 'Pregnancy-Induced Hypertension'],
      allergies: ['Sulfonamides'],
      assignedAsha: 'Manisha Kadam',
      assignedCho: 'Pooja Jadhav, CHO (Khamgaon Sub-Centre)',
      activePrescriptions: [
        {
          id: 'rx-item-01',
          medicineName: 'Ferrous Ascorbate + Folic Acid (100mg+1.5mg)',
          dosage: '1 Tab',
          frequency: '1-0-1',
          duration: '30 Days',
          instructions: 'Take with lemon water after food. Avoid tea/milk.',
          prescribedBy: 'Dr. Rohini Kulkarni, MD',
          prescribedAt: 'Yesterday',
          status: 'Dispensed'
        },
        {
          id: 'rx-item-02',
          medicineName: 'Calcium Carbonate + Vit D3 (500mg)',
          dosage: '1 Tab',
          frequency: '0-1-0',
          duration: '30 Days',
          instructions: 'After lunch with water.',
          prescribedBy: 'Dr. Rohini Kulkarni, MD',
          prescribedAt: 'Yesterday',
          status: 'Dispensed'
        }
      ],
      recentLabReports: [
        {
          id: 'lab-01',
          testName: 'Complete Blood Count (Hb & Platelets)',
          result: 'Hb: 8.2 g/dL (Low)',
          referenceRange: '11.5 - 15.5 g/dL',
          status: 'Abnormal',
          reportedAt: '27 Aug 2026'
        }
      ],
      schemeEligibility: ['PM-JAY', 'MJPJAY', 'JSSK Free Delivery Entitlement'],
      createdAt: '2026-08-20'
    };

    const p2: DBPatient = {
      id: 'p-002',
      abhaId: '91-3184-7719-8804',
      name: 'Shantabai Dnyaneshwar Kale',
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
        bloodSugar: '210 mg/dL',
        lastRecordedAt: 'Yesterday, 04:15 PM'
      },
      diagnoses: ['Essential Hypertension (Grade II)', 'Type 2 Diabetes Mellitus'],
      allergies: ['None Reported'],
      assignedAsha: 'Sunita Patil',
      assignedCho: 'Dr. Sandeep Ghule',
      activePrescriptions: [],
      recentLabReports: [],
      schemeEligibility: ['MJPJAY', 'NPHCE Elderly Healthcare'],
      createdAt: '2026-08-22'
    };

    const p3: DBPatient = {
      id: 'p-003',
      abhaId: '91-5509-2218-4491',
      name: 'Ganesh Bhau Pawar',
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
      diagnoses: ['Acute Febrile Illness (Suspected Malaria / Dengue)'],
      allergies: ['Penicillin'],
      assignedAsha: 'Rukmini Gite',
      assignedCho: 'Kavita Thorat',
      activePrescriptions: [],
      recentLabReports: [],
      schemeEligibility: ['PM-JAY', 'MJPJAY'],
      createdAt: '2026-08-28'
    };

    patientStore.put(p1);
    patientStore.put(p2);
    patientStore.put(p3);

    // 4. Seed Teleconsult Queue
    const tqStore = tx.objectStore('teleconsultQueue');
    const tq1: DBTeleconsult = {
      id: 'tq-001',
      tokenNumber: 'TK-24',
      patientName: 'Sunita Ravindra Shinde',
      patientAge: 24,
      gender: 'Female',
      village: 'Khamgaon',
      presentingComplaint: '32 Weeks Gestational High-Risk ANC evaluation, fatigue, pallor (Hb 8.2 g/dL)',
      urgency: 'amber',
      vitals: {
        bp: '138/92 mmHg',
        pulse: '88 bpm',
        spo2: '98%',
        temp: '98.6 °F',
        weight: '52 kg'
      },
      connectedChoName: 'Pooja Jadhav, CHO',
      subCenterName: 'Khamgaon Ayushman Arogya Mandir',
      waitingMinutes: 2,
      status: 'Waiting',
      videoRoomId: 'maha-tele-room-024',
      createdAt: '2026-08-28 09:15 AM'
    };
    tqStore.put(tq1);

    // 5. Seed Prescriptions
    const rxStore = tx.objectStore('prescriptions');
    const rx1: DBPrescription = {
      id: 'rx-ord-001',
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
          instructions: 'Take after food with lemon water for high absorption.'
        },
        {
          name: 'Calcium Carbonate + Vitamin D3 (500mg)',
          dosage: '1 Tablet',
          frequency: '0-1-0 (Afternoon)',
          duration: '30 Days',
          quantity: 30,
          instructions: 'Take after lunch with water.'
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
      notes: 'ANC High-Risk Hb 8.2 g/dL. Dietary counsel given. Review in 14 days.',
      status: 'QUEUED'
    };
    rxStore.put(rx1);

    // 6. Seed Inventory
    const invStore = tx.objectStore('inventory');
    const items: DBMedicine[] = [
      { id: 'med-1', code: 'TAB-FER-100', name: 'Ferrous Ascorbate + Folic Acid Tablets', genericName: 'Ferrous Ascorbate 100mg + FA 1.5mg', category: 'Maternal Supplement', currentStock: 2400, reorderLevel: 500, unit: 'Tablets', batchNumber: 'BT-9821', expiryDate: '2028-10-31', status: 'In Stock', location: 'Rack A-1', lastDispensedDate: 'Today' },
      { id: 'med-2', code: 'TAB-CAL-500', name: 'Calcium Carbonate + Vitamin D3 Tablets', genericName: 'Calcium 500mg + Vit D3 250IU', category: 'Maternal Supplement', currentStock: 1800, reorderLevel: 400, unit: 'Tablets', batchNumber: 'BT-8812', expiryDate: '2028-06-30', status: 'In Stock', location: 'Rack A-2', lastDispensedDate: 'Today' },
      { id: 'med-3', code: 'TAB-PCM-500', name: 'Paracetamol Tablets IP 500mg', genericName: 'Paracetamol 500mg', category: 'Analgesic', currentStock: 3500, reorderLevel: 600, unit: 'Tablets', batchNumber: 'BT-7741', expiryDate: '2027-12-31', status: 'In Stock', location: 'Rack B-1', lastDispensedDate: 'Today' },
      { id: 'med-4', code: 'TAB-AMX-500', name: 'Amoxicillin Capsules IP 500mg', genericName: 'Amoxicillin Trihydrate 500mg', category: 'Antibiotic', currentStock: 80, reorderLevel: 250, unit: 'Capsules', batchNumber: 'BT-6619', expiryDate: '2027-04-15', status: 'Low Stock', location: 'Rack B-2', lastDispensedDate: 'Yesterday' },
      { id: 'med-5', code: 'TAB-AML-5', name: 'Amlodipine Tablets IP 5mg', genericName: 'Amlodipine Besylate 5mg', category: 'Antihypertensive', currentStock: 1200, reorderLevel: 300, unit: 'Tablets', batchNumber: 'BT-5510', expiryDate: '2028-08-31', status: 'In Stock', location: 'Rack C-1', lastDispensedDate: '3 days ago' },
      { id: 'med-6', code: 'TAB-MET-500', name: 'Metformin Hydrochloride 500mg SR', genericName: 'Metformin 500mg Sustained Release', category: 'Antidiabetic', currentStock: 1600, reorderLevel: 400, unit: 'Tablets', batchNumber: 'BT-4420', expiryDate: '2028-09-30', status: 'In Stock', location: 'Rack C-2', lastDispensedDate: 'Yesterday' },
      { id: 'med-7', code: 'TAB-LAB-100', name: 'Labetalol Tablets 100mg', genericName: 'Labetalol Hydrochloride', category: 'Emergency', currentStock: 30, reorderLevel: 100, unit: 'Tablets', batchNumber: 'BT-3318', expiryDate: '2027-05-31', status: 'Low Stock', location: 'Emergency Safe', lastDispensedDate: '4 days ago' }
    ];
    items.forEach(it => invStore.put(it));

    // 7. Seed Diagnostics
    const labStore = tx.objectStore('diagnosticOrders');
    const l1: DBLabOrder = {
      id: 'lab-ord-01',
      orderNumber: 'LAB-2026-0891',
      patientName: 'Sunita Ravindra Shinde',
      patientAge: 24,
      patientGender: 'Female',
      testName: 'Complete Blood Count (CBC & Platelets)',
      testCategory: 'Hematology',
      sampleType: 'Whole Blood (EDTA)',
      sampleStatus: 'Sample Collected',
      orderingDoctor: 'Dr. Rohini Kulkarni, MD',
      facility: 'Junnar Rural Hospital Central Pathology Wing',
      orderedAt: 'Today, 09:45 AM'
    };
    const l2: DBLabOrder = {
      id: 'lab-ord-02',
      orderNumber: 'LAB-2026-0892',
      patientName: 'Ganesh Bhau Pawar',
      patientAge: 38,
      patientGender: 'Male',
      testName: 'Malaria Rapid Card Antigen (Pv / Pf)',
      testCategory: 'Serology/Malaria',
      sampleType: 'Capillary Whole Blood',
      sampleStatus: 'Processing',
      orderingDoctor: 'Dr. Sandeep Ghule',
      facility: 'Otur PHC Clinical Lab',
      orderedAt: 'Today, 08:30 AM'
    };
    labStore.put(l1);
    labStore.put(l2);

    // 8. Seed Referrals
    const refStore = tx.objectStore('referrals');
    const r1: DBReferral = {
      id: 'ref-001',
      referralCode: 'REF-MH-PUN-8841',
      patientId: 'p-001',
      patientName: 'Sunita Ravindra Shinde',
      patientAge: 24,
      patientGender: 'Female',
      patientVillage: 'Khamgaon',
      referringRole: 'cho',
      referringProviderName: 'Pooja Jadhav, CHO',
      referringFacilityName: 'Khamgaon Ayushman Arogya Mandir',
      targetFacilityName: 'Junnar Rural Hospital & Trauma Centre',
      targetSpecialty: 'Obstetrics & High-Risk Pregnancy',
      urgency: 'amber',
      reasonForReferral: '32 weeks gestational age with persistent severe anemia (Hb 8.2 g/dL) and Borderline Hypertension (138/92). Requires specialist OBGYN evaluation.',
      status: 'SENT',
      createdAt: 'Today, 09:15 AM'
    };
    refStore.put(r1);

    // 9. Seed Activities
    const actStore = tx.objectStore('activityLogs');
    const act1: DBActivity = {
      id: 'act-1',
      timestamp: '2 mins ago',
      actor: 'Dr. Rohini Kulkarni',
      role: 'Medical Officer',
      action: 'Teleconsultation Completed',
      details: 'Issued digital e-Prescription (RX-2026-0881) for Sunita Shinde (ANC Hb 8.2 g/dL)',
      type: 'clinical'
    };
    const act2: DBActivity = {
      id: 'act-2',
      timestamp: '8 mins ago',
      actor: 'Manisha Kadam',
      role: 'ASHA Worker',
      action: 'High-Risk Triage Logged',
      details: 'Recorded home visit vitals for Sunita Shinde (BP 138/92 mmHg, SpO2 98%)',
      type: 'clinical'
    };
    actStore.put(act1);
    actStore.put(act2);
  }

  private countItems(db: IDBDatabase, storeName: string): Promise<number> {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.count();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(0);
      } catch (e) {
        resolve(0);
      }
    });
  }

  // --- GENERIC CRUD ---

  public async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  public async getById<T>(storeName: string, id: string): Promise<T | undefined> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  public async putItem<T>(storeName: string, item: T): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => {
        this.notify();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  }

  public async deleteItem(storeName: string, id: string): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => {
        this.notify();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  }

  // --- AUTH & SESSION IN INDEXEDDB ---

  public async getActiveSession(): Promise<DBUser | null> {
    const db = await this.initDB();
    return new Promise((resolve) => {
      try {
        const tx = db.transaction('session', 'readonly');
        const store = tx.objectStore('session');
        const req = store.get('activeUser');
        req.onsuccess = () => resolve(req.result?.user || null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  public async setActiveSession(user: DBUser | null): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('session', 'readwrite');
      const store = tx.objectStore('session');
      const req = store.put({ key: 'activeUser', user });
      req.onsuccess = () => {
        this.notify();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  }

  public async loginAsRole(role: Role): Promise<DBUser> {
    const defaultAcc = DEFAULT_ROLE_ACCOUNTS[role];
    await this.setActiveSession(defaultAcc);
    await this.logActivity(defaultAcc.fullName, defaultAcc.designation, 'User Logged In', `Authenticated into ${role.toUpperCase()} Console via IndexedDB Session`, 'admin');
    return defaultAcc;
  }

  public async logoutSession(): Promise<void> {
    await this.setActiveSession(null);
    this.notify();
  }

  public async logActivity(actor: string, role: string, action: string, details: string, type: DBActivity['type'] = 'clinical') {
    const act: DBActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor,
      role,
      action,
      details,
      type
    };
    await this.putItem('activityLogs', act);
  }

  public async resetDatabase(): Promise<void> {
    if (typeof window === 'undefined') return;
    window.indexedDB.deleteDatabase(DB_NAME);
    this.dbPromise = null;
    await this.initDB();
    this.notify();
  }
}

export const setuDB = new IndexedDBManager();
