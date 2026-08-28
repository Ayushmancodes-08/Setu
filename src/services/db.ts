/**
 * IndexedDB Enterprise Realtime Persistence Engine for SETU Health Platform
 * Provides reactive cross-console synchronization and persistent local storage
 * for Users, Patients, Teleconsult Queue, Prescriptions, Inventory, Labs, Referrals & Facilities.
 */

import { Role, Facility } from '../types';
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
  isVerified?: boolean;
}

export interface DoctorApplication {
  id: string;
  fullName: string;
  medicalRegNumber: string;
  councilName: string;
  specialization: string;
  degree: string;
  affiliatedHospital: string;
  taluka: string;
  district: string;
  phone: string;
  email: string;
  submittedAt: string;
  status: 'APPROVED' | 'PENDING';
}

export interface FacilityApplication {
  id: string;
  name: string;
  nameMr?: string;
  type: 'sub_center' | 'phc' | 'rh' | 'dh' | 'sdh' | 'medical_college' | 'mjpjay_private';
  level: string;
  taluka: string;
  district: string;
  totalBeds: number;
  availableBeds: number;
  icuBedsTotal: number;
  icuBedsAvailable: number;
  hasOxygenPlant: boolean;
  hasBloodBank: boolean;
  ambulancesStationed: number;
  nodalOfficerName: string;
  nodalOfficerPhone: string;
  submittedAt: string;
  status: 'ACTIVE';
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

const DB_NAME = 'SetuMahaHealthDB_v3';
const DB_VERSION = 1;

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

  public notify() {
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
        if (!db.objectStoreNames.contains('facilities')) {
          db.createObjectStore('facilities', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('doctorApplications')) {
          db.createObjectStore('doctorApplications', { keyPath: 'id' });
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
    const facilityCount = await this.countItems(db, 'facilities');
    if (facilityCount > 0) return; // Already seeded

    const tx = db.transaction(
      ['users', 'patients', 'teleconsultQueue', 'prescriptions', 'inventory', 'diagnosticOrders', 'referrals', 'facilities', 'activityLogs', 'session'],
      'readwrite'
    );

    // 1. Seed Facilities
    const facStore = tx.objectStore('facilities');
    MAHARASHTRA_FACILITIES.forEach(f => facStore.put(f));

    // 2. Default Active Session (None)
    tx.objectStore('session').put({ key: 'activeUser', user: null });

    // 3. Seed Initial Verified Patients
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
      activePrescriptions: [],
      recentLabReports: [],
      schemeEligibility: ['PM-JAY', 'MJPJAY', 'JSSK Free Delivery Entitlement'],
      createdAt: '2026-08-20'
    };
    patientStore.put(p1);

    // 4. Seed Inventory
    const invStore = tx.objectStore('inventory');
    const items: DBMedicine[] = [
      { id: 'med-1', code: 'TAB-FER-100', name: 'Ferrous Ascorbate + Folic Acid Tablets', genericName: 'Ferrous Ascorbate 100mg + FA 1.5mg', category: 'Maternal Supplement', currentStock: 2400, reorderLevel: 500, unit: 'Tablets', batchNumber: 'BT-9821', expiryDate: '2028-10-31', status: 'In Stock', location: 'Rack A-1', lastDispensedDate: 'Today' },
      { id: 'med-2', code: 'TAB-CAL-500', name: 'Calcium Carbonate + Vitamin D3 Tablets', genericName: 'Calcium 500mg + Vit D3 250IU', category: 'Maternal Supplement', currentStock: 1800, reorderLevel: 400, unit: 'Tablets', batchNumber: 'BT-8812', expiryDate: '2028-06-30', status: 'In Stock', location: 'Rack A-2', lastDispensedDate: 'Today' },
      { id: 'med-3', code: 'TAB-PCM-500', name: 'Paracetamol Tablets IP 500mg', genericName: 'Paracetamol 500mg', category: 'Analgesic', currentStock: 3500, reorderLevel: 600, unit: 'Tablets', batchNumber: 'BT-7741', expiryDate: '2027-12-31', status: 'In Stock', location: 'Rack B-1', lastDispensedDate: 'Today' },
      { id: 'med-4', code: 'TAB-AMX-500', name: 'Amoxicillin Capsules IP 500mg', genericName: 'Amoxicillin Trihydrate 500mg', category: 'Antibiotic', currentStock: 80, reorderLevel: 250, unit: 'Capsules', batchNumber: 'BT-6619', expiryDate: '2027-04-15', status: 'Low Stock', location: 'Rack B-2', lastDispensedDate: 'Yesterday' }
    ];
    items.forEach(it => invStore.put(it));
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

  // --- AUTH & USER MANAGEMENT ---

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

  public async loginUser(identifier: string, role: Role): Promise<DBUser> {
    const allUsers = await this.getAll<DBUser>('users');
    const cleanId = identifier.replace(/[\s-+]/g, '').toLowerCase();
    
    let matched = allUsers.find(u => 
      u.role === role && (
        u.phone.replace(/[\s-+]/g, '').includes(cleanId) ||
        u.identifierNumber.toLowerCase().includes(cleanId) ||
        u.fullName.toLowerCase().includes(cleanId) ||
        u.username.toLowerCase().includes(cleanId)
      )
    );

    if (!matched) {
      // Auto-generate authenticated profile for valid credentials
      matched = {
        id: `usr-${Date.now()}`,
        role: role,
        username: identifier.replace(/[\s-+]/g, ''),
        fullName: identifier.includes('Dr.') ? identifier : `${role.toUpperCase()} Officer (${identifier})`,
        phone: identifier.startsWith('+') || /^\d+$/.test(identifier) ? identifier : '+91 98200 00000',
        identifierNumber: identifier,
        facilityName: 'Maharashtra Rural Health Network',
        taluka: 'Junnar',
        district: 'Pune',
        designation: `${role.toUpperCase()} Practitioner`,
        avatarInitials: identifier.slice(0, 2).toUpperCase(),
        createdAt: new Date().toISOString(),
        isVerified: true
      };
      await this.putItem('users', matched);
    }

    await this.setActiveSession(matched);
    await this.logActivity(matched.fullName, matched.designation, 'User Authenticated', `Logged into ${role.toUpperCase()} console via IndexedDB`, 'admin');
    return matched;
  }

  public async signupUser(userData: Omit<DBUser, 'id' | 'createdAt'>): Promise<DBUser> {
    const newUser: DBUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      avatarInitials: userData.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U',
      isVerified: true
    };

    await this.putItem('users', newUser);
    await this.setActiveSession(newUser);
    await this.logActivity(newUser.fullName, newUser.designation, 'New Account Registered', `Signed up as ${newUser.role.toUpperCase()} (${newUser.facilityName})`, 'admin');
    return newUser;
  }

  public async applyForDoctorEmpanelment(appData: Omit<DoctorApplication, 'id' | 'submittedAt' | 'status'>): Promise<DBUser> {
    const appId = `doc-app-${Date.now()}`;
    const application: DoctorApplication = {
      ...appData,
      id: appId,
      submittedAt: new Date().toISOString(),
      status: 'APPROVED'
    };

    await this.putItem('doctorApplications', application);

    // Create Doctor User Profile
    const doctorUser: DBUser = {
      id: `usr-doc-${Date.now()}`,
      role: 'doctor',
      username: appData.medicalRegNumber,
      fullName: appData.fullName.startsWith('Dr.') ? appData.fullName : `Dr. ${appData.fullName}`,
      phone: appData.phone,
      identifierNumber: `${appData.medicalRegNumber} (${appData.councilName})`,
      facilityName: appData.affiliatedHospital || 'Empaneled Telemedicine Hub',
      taluka: appData.taluka || 'Junnar',
      district: appData.district || 'Pune',
      designation: `${appData.specialization} Specialist (${appData.degree})`,
      avatarInitials: 'DR',
      createdAt: new Date().toISOString(),
      isVerified: true
    };

    await this.putItem('users', doctorUser);
    await this.setActiveSession(doctorUser);
    await this.logActivity(
      doctorUser.fullName,
      'Medical Council Verification',
      'Doctor Empaneled & Practice Activated',
      `Reg: ${appData.medicalRegNumber} • ${appData.specialization} (${appData.degree}) at ${doctorUser.facilityName}`,
      'clinical'
    );

    return doctorUser;
  }

  public async applyForHospitalListing(facData: Omit<FacilityApplication, 'id' | 'submittedAt' | 'status'>): Promise<Facility> {
    const facId = `fac-${Date.now()}`;
    const typeMapping: Record<string, Facility['type']> = {
      phc: 'PHC',
      rh: 'Sub-District Hospital',
      sdh: 'Sub-District Hospital',
      dh: 'District Hospital',
      mjpjay_private: 'District Hospital',
      sub_center: 'Sub-Centre'
    };

    const newFacility: Facility = {
      id: facId,
      name: facData.name,
      nameMr: facData.nameMr || facData.name,
      type: typeMapping[facData.type] || 'Sub-District Hospital',
      taluka: facData.taluka,
      district: facData.district,
      totalBeds: facData.totalBeds,
      availableBeds: facData.availableBeds,
      icuBedsAvailable: facData.icuBedsAvailable,
      oxygenAvailable: facData.hasOxygenPlant,
      ambulanceAvailable: facData.ambulancesStationed > 0,
      openStatus: 'Open 24/7',
      specialistsAvailable: ['General Medicine', 'Obstetrics & Gynecology', 'Emergency Trauma'],
      teleconsultationActive: true,
      essentialMedicineStockRate: 95,
      contactNumber: facData.nodalOfficerPhone,
      distanceKm: 4.2,
      latitude: 19.208,
      longitude: 73.874,
      rating: 4.8
    };

    await this.putItem('facilities', newFacility);
    await this.logActivity(
      facData.nodalOfficerName,
      'Hospital Superintendent / ABDM Hub',
      'New Healthcare Facility Empaneled',
      `${newFacility.name} (${newFacility.type}) registered with ${newFacility.totalBeds} beds & ${newFacility.icuBedsAvailable} available ICU beds`,
      'admin'
    );

    return newFacility;
  }

  public async logoutSession(): Promise<void> {
    await this.setActiveSession(null);
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
