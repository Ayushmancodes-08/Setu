import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Facility, 
  HealthScheme, 
  AshaTask, 
  MedicineItem, 
  DiagnosticOrder, 
  TeleconsultationQueueItem, 
  DistrictMetric, 
  Referral,
  Role,
  TriageUrgency
} from '../types';
import { 
  MAHARASHTRA_FACILITIES, 
  MAHARASHTRA_SCHEMES, 
  MOCK_ASHA_TASKS, 
  DISTRICT_METRICS 
} from '../data/mockData';
import { 
  setuDB, 
  DBPatient, 
  DBTeleconsult, 
  DBPrescription, 
  DBMedicine, 
  DBLabOrder, 
  DBReferral, 
  DBActivity, 
  DBUser,
  DBDirective,
  DBOutbreakAlert,
  DBPocTest
} from '../services/db';

export type PatientRecord = DBPatient;
export type PrescriptionOrder = DBPrescription;
export type ActivityEvent = DBActivity;

interface HealthDataContextType {
  // Realtime IndexedDB State
  patients: DBPatient[];
  facilities: Facility[];
  medicines: DBMedicine[];
  diagnosticOrders: DBLabOrder[];
  teleconsultQueue: DBTeleconsult[];
  referrals: DBReferral[];
  ashaTasks: AshaTask[];
  prescriptionOrders: DBPrescription[];
  districtMetrics: DistrictMetric[];
  activityLogs: DBActivity[];
  directives: DBDirective[];
  outbreakAlerts: DBOutbreakAlert[];
  pocTests: DBPocTest[];
  
  // Realtime Session & Auth State
  currentUser: DBUser | null;
  setCurrentUser: (user: DBUser | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authTargetRole: Role;
  setAuthTargetRole: (role: Role) => void;
  openRoleAuthModal: (role: Role) => void;
  logout: () => Promise<void>;

  // Realtime Patient Actions
  registerPatient: (patientData: Partial<DBPatient>) => Promise<DBPatient>;
  updatePatientVitals: (patientId: string, vitals: Partial<DBPatient['vitals']>, notes?: string) => Promise<void>;
  getPatientByAbhaOrMobile: (query: string) => DBPatient | undefined;
  
  // Realtime Teleconsultation Actions
  enqueueTeleconsult: (item: Partial<DBTeleconsult>) => Promise<DBTeleconsult>;
  updateTeleconsultStatus: (queueId: string, status: DBTeleconsult['status']) => Promise<void>;
  completeConsultationAndIssueRx: (queueId: string, prescriptionData: Omit<DBPrescription, 'id' | 'tokenNumber' | 'prescribedAt' | 'status'>) => Promise<void>;

  // Realtime Pharmacy Actions
  dispensePrescription: (orderId: string, pharmacistName: string) => Promise<boolean>;
  updateMedicineStock: (medicineId: string, quantityChange: number) => Promise<void>;
  addNewStockConsignment: (medicineData: Partial<DBMedicine>) => Promise<void>;

  // Realtime Lab Actions
  createDiagnosticOrder: (order: Partial<DBLabOrder>) => Promise<DBLabOrder>;
  submitLabResult: (orderId: string, resultValue: string, isPanicValue?: boolean, notes?: string) => Promise<void>;

  // Realtime Referral & Bed Actions
  createReferral: (referralData: Partial<DBReferral>) => Promise<DBReferral>;
  updateReferralStatus: (referralId: string, status: DBReferral['status']) => Promise<void>;
  updateFacilityBeds: (facilityId: string, change: { availableBeds?: number; icuBedsAvailable?: number }) => void;

  // Frontline ASHA & CHO Actions
  completeAshaTask: (taskId: string, recordedVitals?: any, notes?: string) => Promise<void>;
  addAshaTask: (task: Partial<AshaTask>) => Promise<AshaTask>;
  logPocTest: (pocData: Omit<DBPocTest, 'id' | 'timestamp'>) => Promise<DBPocTest>;

  // DHO Public Health Command Actions
  issueDirective: (dirData: Omit<DBDirective, 'id' | 'issuedAt' | 'acknowledgementsCount'>) => Promise<DBDirective>;
  acknowledgeDirective: (dirId: string) => Promise<void>;
  reportOutbreakAlert: (outbreak: Omit<DBOutbreakAlert, 'id' | 'firstReportedAt'>) => Promise<DBOutbreakAlert>;
  updateOutbreakStatus: (outbreakId: string, status: DBOutbreakAlert['status']) => Promise<void>;

  // Database Reset
  resetToFreshDatabase: () => Promise<void>;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<DBPatient[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>(MAHARASHTRA_FACILITIES);
  const [medicines, setMedicines] = useState<DBMedicine[]>([]);
  const [diagnosticOrders, setDiagnosticOrders] = useState<DBLabOrder[]>([]);
  const [teleconsultQueue, setTeleconsultQueue] = useState<DBTeleconsult[]>([]);
  const [referrals, setReferrals] = useState<DBReferral[]>([]);
  const [ashaTasks, setAshaTasks] = useState<AshaTask[]>(MOCK_ASHA_TASKS);
  const [prescriptionOrders, setPrescriptionOrders] = useState<DBPrescription[]>([]);
  const [districtMetrics, setDistrictMetrics] = useState<DistrictMetric[]>(DISTRICT_METRICS);
  const [activityLogs, setActivityLogs] = useState<DBActivity[]>([]);
  const [directives, setDirectives] = useState<DBDirective[]>([]);
  const [outbreakAlerts, setOutbreakAlerts] = useState<DBOutbreakAlert[]>([]);
  const [pocTests, setPocTests] = useState<DBPocTest[]>([]);

  // Auth State
  const [currentUser, setCurrentUser] = useState<DBUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authTargetRole, setAuthTargetRole] = useState<Role>('patient');

  // Load live persistent data from IndexedDB
  const syncFromIndexedDB = useCallback(async () => {
    try {
      const [
        storedPatients,
        storedQueue,
        storedRx,
        storedMeds,
        storedLabs,
        storedRefs,
        storedFacilities,
        storedTasks,
        storedDirs,
        storedOutbreaks,
        storedPoc,
        storedActivities,
        storedSession
      ] = await Promise.all([
        setuDB.getAll<DBPatient>('patients'),
        setuDB.getAll<DBTeleconsult>('teleconsultQueue'),
        setuDB.getAll<DBPrescription>('prescriptions'),
        setuDB.getAll<DBMedicine>('inventory'),
        setuDB.getAll<DBLabOrder>('diagnosticOrders'),
        setuDB.getAll<DBReferral>('referrals'),
        setuDB.getAll<Facility>('facilities'),
        setuDB.getAll<AshaTask>('ashaTasks'),
        setuDB.getAll<DBDirective>('directives'),
        setuDB.getAll<DBOutbreakAlert>('outbreakAlerts'),
        setuDB.getAll<DBPocTest>('pocTests'),
        setuDB.getAll<DBActivity>('activityLogs'),
        setuDB.getActiveSession()
      ]);

      if (storedPatients && storedPatients.length > 0) setPatients(storedPatients);
      if (storedQueue) setTeleconsultQueue(storedQueue);
      if (storedRx) setPrescriptionOrders(storedRx);
      if (storedMeds && storedMeds.length > 0) setMedicines(storedMeds);
      if (storedLabs) setDiagnosticOrders(storedLabs);
      if (storedRefs) setReferrals(storedRefs);
      if (storedFacilities && storedFacilities.length > 0) setFacilities(storedFacilities);
      if (storedTasks && storedTasks.length > 0) setAshaTasks(storedTasks);
      if (storedDirs) setDirectives(storedDirs);
      if (storedOutbreaks) setOutbreakAlerts(storedOutbreaks);
      if (storedPoc) setPocTests(storedPoc);
      if (storedActivities) setActivityLogs(storedActivities);
      if (storedSession) setCurrentUser(storedSession);
    } catch (e) {
      console.error('Failed to sync from IndexedDB', e);
    }
  }, []);

  useEffect(() => {
    syncFromIndexedDB();
    const unsubscribe = setuDB.subscribe(() => {
      syncFromIndexedDB();
    });
    return () => unsubscribe();
  }, [syncFromIndexedDB]);

  const openRoleAuthModal = (role: Role) => {
    setAuthTargetRole(role);
    setIsAuthModalOpen(true);
  };

  const logout = async () => {
    await setuDB.logoutSession();
    setCurrentUser(null);
  };

  const registerPatient = async (patientData: Partial<DBPatient>): Promise<DBPatient> => {
    const randomAbha = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient: DBPatient = {
      id: `p-${Date.now()}`,
      abhaId: patientData.abhaId || randomAbha,
      name: patientData.name || 'New Patient',
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
      assignedCho: patientData.assignedCho || 'Pooja Jadhav, CHO',
      activePrescriptions: [],
      recentLabReports: [],
      schemeEligibility: ['PM-JAY', 'MJPJAY', 'ABHA Verified'],
      createdAt: new Date().toISOString()
    };

    await setuDB.putItem('patients', newPatient);
    await setuDB.logActivity(
      currentUser?.fullName || 'Registration Desk',
      currentUser?.designation || 'Frontline / ASHA',
      'Registered New Patient',
      `ABHA: ${newPatient.abhaId} — ${newPatient.name} (${newPatient.village})`,
      'clinical'
    );
    return newPatient;
  };

  const updatePatientVitals = async (patientId: string, vitals: Partial<DBPatient['vitals']>, notes?: string) => {
    const p = await setuDB.getById<DBPatient>('patients', patientId);
    if (p) {
      p.vitals = { ...p.vitals, ...vitals, lastRecordedAt: 'Just now' };
      await setuDB.putItem('patients', p);
      await setuDB.logActivity(
        currentUser?.fullName || 'Clinical Staff',
        currentUser?.designation || 'Nurse / ASHA',
        'Updated Vitals Record',
        `Patient: ${p.name} — BP: ${vitals.bp || 'Checked'}, SpO2: ${vitals.spo2 || 'Checked'}. ${notes || ''}`,
        'clinical'
      );
    }
  };

  const getPatientByAbhaOrMobile = (query: string): DBPatient | undefined => {
    const clean = query.replace(/[\s-]/g, '').toLowerCase();
    if (!clean) return undefined;
    return patients.find(p => {
      const pAbha = p.abhaId.replace(/[\s-]/g, '').toLowerCase();
      const pMobile = p.mobile.replace(/[\s-+]/g, '');
      const pName = p.name.toLowerCase();
      return pAbha.includes(clean) || pMobile.includes(clean) || pName.includes(clean);
    });
  };

  const enqueueTeleconsult = async (item: Partial<DBTeleconsult>): Promise<DBTeleconsult> => {
    const token = `TK-${Math.floor(20 + Math.random() * 80)}`;
    const newItem: DBTeleconsult = {
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
      connectedChoName: currentUser?.fullName || item.connectedChoName || 'Pooja Jadhav, CHO',
      subCenterName: currentUser?.facilityName || item.subCenterName || 'Khamgaon Ayushman Arogya Mandir',
      waitingMinutes: 1,
      status: 'Waiting',
      videoRoomId: `maha-room-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    await setuDB.putItem('teleconsultQueue', newItem);
    await setuDB.logActivity(
      newItem.connectedChoName,
      'CHO / Spoke Lead',
      'Queued e-Sanjeevani Teleconsult',
      `Token ${newItem.tokenNumber} for ${newItem.patientName} (${newItem.urgency.toUpperCase()})`,
      'clinical'
    );
    return newItem;
  };

  const updateTeleconsultStatus = async (queueId: string, status: DBTeleconsult['status']) => {
    const item = await setuDB.getById<DBTeleconsult>('teleconsultQueue', queueId);
    if (item) {
      item.status = status;
      await setuDB.putItem('teleconsultQueue', item);
    }
  };

  const completeConsultationAndIssueRx = async (
    queueId: string, 
    prescriptionData: Omit<DBPrescription, 'id' | 'tokenNumber' | 'prescribedAt' | 'status'>
  ) => {
    const orderNumber = `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRxOrder: DBPrescription = {
      ...prescriptionData,
      id: `rx-ord-${Date.now()}`,
      tokenNumber: orderNumber,
      prescribedAt: 'Just now',
      status: 'QUEUED'
    };

    await setuDB.putItem('prescriptions', newRxOrder);

    const allPatients = await setuDB.getAll<DBPatient>('patients');
    const matchedPatient = allPatients.find(p => p.id === prescriptionData.patientId || p.name.toLowerCase() === prescriptionData.patientName.toLowerCase());
    if (matchedPatient) {
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
      matchedPatient.activePrescriptions = [...newRxEntries, ...matchedPatient.activePrescriptions];
      await setuDB.putItem('patients', matchedPatient);
    }

    await updateTeleconsultStatus(queueId, 'Prescription Issued');

    await setuDB.logActivity(
      prescriptionData.doctorName,
      'Medical Officer / Specialist',
      'Issued Digital e-Prescription',
      `Prescription ${orderNumber} signed for ${prescriptionData.patientName} (${prescriptionData.items.length} drugs dispatched to Pharmacy Queue)`,
      'clinical'
    );
  };

  const dispensePrescription = async (orderId: string, pharmacistName: string): Promise<boolean> => {
    const order = await setuDB.getById<DBPrescription>('prescriptions', orderId);
    if (!order) return false;

    const allMeds = await setuDB.getAll<DBMedicine>('inventory');
    for (const item of order.items) {
      const matchedMed = allMeds.find(m => 
        m.name.toLowerCase().includes(item.name.toLowerCase()) || 
        item.name.toLowerCase().includes(m.name.toLowerCase())
      );
      if (matchedMed) {
        matchedMed.currentStock = Math.max(0, matchedMed.currentStock - (item.quantity || 10));
        matchedMed.status = matchedMed.currentStock === 0 ? 'Critical Stock-Out' : matchedMed.currentStock <= matchedMed.reorderLevel ? 'Low Stock' : 'In Stock';
        matchedMed.lastDispensedDate = 'Today';
        await setuDB.putItem('inventory', matchedMed);
      }
    }

    order.status = 'DISPENSED';
    order.dispensedAt = 'Just now';
    order.dispensedBy = pharmacistName;
    await setuDB.putItem('prescriptions', order);

    const allPatients = await setuDB.getAll<DBPatient>('patients');
    const matchedPatient = allPatients.find(p => p.id === order.patientId || p.name.toLowerCase() === order.patientName.toLowerCase());
    if (matchedPatient) {
      matchedPatient.activePrescriptions = matchedPatient.activePrescriptions.map(rx => ({
        ...rx,
        status: 'Dispensed'
      }));
      await setuDB.putItem('patients', matchedPatient);
    }

    await setuDB.logActivity(
      pharmacistName,
      'Pharmacist / e-Aushadhi',
      'Dispensed Medication Order',
      `Order ${order.tokenNumber} fulfilled for ${order.patientName}. Inventory levels updated in IndexedDB.`,
      'pharmacy'
    );
    return true;
  };

  const updateMedicineStock = async (medicineId: string, quantityChange: number) => {
    const med = await setuDB.getById<DBMedicine>('inventory', medicineId);
    if (med) {
      med.currentStock = Math.max(0, med.currentStock + quantityChange);
      med.status = med.currentStock === 0 ? 'Critical Stock-Out' : med.currentStock <= med.reorderLevel ? 'Low Stock' : 'In Stock';
      await setuDB.putItem('inventory', med);
    }
  };

  const addNewStockConsignment = async (medicineData: Partial<DBMedicine>) => {
    const newItem: DBMedicine = {
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

    await setuDB.putItem('inventory', newItem);
    await setuDB.logActivity(
      currentUser?.fullName || 'e-Aushadhi Officer',
      'Pharmacist / Logistics',
      'Received Stock Inward Consignment',
      `Batch ${newItem.batchNumber}: ${newItem.name} (+${newItem.currentStock} units)`,
      'pharmacy'
    );
  };

  const createDiagnosticOrder = async (order: Partial<DBLabOrder>): Promise<DBLabOrder> => {
    const orderNum = `LAB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: DBLabOrder = {
      id: `diag-${Date.now()}`,
      orderNumber: orderNum,
      patientName: order.patientName || 'Patient',
      patientAge: order.patientAge || 30,
      patientGender: order.patientGender || 'Female',
      testName: order.testName || 'Complete Blood Count (CBC)',
      testCategory: order.testCategory || 'Hematology',
      sampleType: order.sampleType || 'Whole Blood (EDTA)',
      sampleStatus: 'Sample Collected',
      orderingDoctor: currentUser?.fullName || order.orderingDoctor || 'Dr. Rohini Kulkarni, MD',
      facility: currentUser?.facilityName || order.facility || 'Junnar Rural Hospital Diagnostic Wing',
      orderedAt: 'Just now'
    };

    await setuDB.putItem('diagnosticOrders', newOrder);
    await setuDB.logActivity(
      newOrder.orderingDoctor,
      'Medical Officer',
      'Created Diagnostic Requisition',
      `${newOrder.testName} ordered for ${newOrder.patientName}`,
      'lab'
    );
    return newOrder;
  };

  const submitLabResult = async (orderId: string, resultValue: string, isPanicValue: boolean = false, notes?: string) => {
    const order = await setuDB.getById<DBLabOrder>('diagnosticOrders', orderId);
    if (!order) return;

    order.resultValue = resultValue;
    order.isPanicValue = isPanicValue;
    order.sampleStatus = isPanicValue ? 'Critical Alert' : 'Validated';
    order.resultNotes = notes;
    await setuDB.putItem('diagnosticOrders', order);

    const allPatients = await setuDB.getAll<DBPatient>('patients');
    const matchedPatient = allPatients.find(p => p.name.toLowerCase() === order.patientName.toLowerCase());
    if (matchedPatient) {
      const newReport = {
        id: `lab-rep-${Date.now()}`,
        testName: order.testName,
        result: resultValue,
        referenceRange: order.referenceRange || 'Standard Normal Range',
        status: (isPanicValue ? 'Critical' : 'Normal') as any,
        reportedAt: 'Just now'
      };
      matchedPatient.recentLabReports = [newReport, ...matchedPatient.recentLabReports];
      await setuDB.putItem('patients', matchedPatient);
    }

    await setuDB.logActivity(
      currentUser?.fullName || 'Diagnostic Wing',
      'Lab Technician',
      'Verified Diagnostic Test Result',
      `Report ${order.orderNumber} for ${order.patientName}: ${resultValue} ${isPanicValue ? '⚠️ [CRITICAL ALERT]' : '✅ [VERIFIED]'}`,
      'lab'
    );
  };

  const createReferral = async (referralData: Partial<DBReferral>): Promise<DBReferral> => {
    const refCode = `REF-MH-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRef: DBReferral = {
      id: `ref-${Date.now()}`,
      referralCode: refCode,
      patientId: referralData.patientId || 'p-001',
      patientName: referralData.patientName || 'Patient',
      patientAge: referralData.patientAge || 35,
      patientGender: referralData.patientGender || 'Female',
      patientVillage: referralData.patientVillage || 'Khamgaon',
      referringRole: currentUser?.role || referralData.referringRole || 'cho',
      referringProviderName: currentUser?.fullName || referralData.referringProviderName || 'Pooja Jadhav, CHO',
      referringFacilityName: currentUser?.facilityName || referralData.referringFacilityName || 'Khamgaon Ayushman Arogya Mandir',
      targetFacilityName: referralData.targetFacilityName || 'Junnar Rural Hospital & Trauma Centre',
      targetSpecialty: referralData.targetSpecialty || 'Obstetrics & High-Risk Pregnancy',
      urgency: referralData.urgency || 'amber',
      reasonForReferral: referralData.reasonForReferral || 'Specialist escalation & management',
      status: 'SENT',
      createdAt: 'Just now'
    };

    await setuDB.putItem('referrals', newRef);

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

    await setuDB.logActivity(
      newRef.referringProviderName,
      'Clinical Lead',
      'Initiated Specialist Referral & Bed Reservation',
      `${newRef.referralCode}: ${newRef.patientName} referred to ${newRef.targetFacilityName} (${newRef.urgency.toUpperCase()})`,
      'referral'
    );
    return newRef;
  };

  const updateReferralStatus = async (referralId: string, status: DBReferral['status']) => {
    const ref = await setuDB.getById<DBReferral>('referrals', referralId);
    if (ref) {
      ref.status = status;
      await setuDB.putItem('referrals', ref);
      await setuDB.logActivity(
        currentUser?.fullName || 'Referral Coordinator',
        'Hospital Admin',
        'Updated Referral Status',
        `Referral ${ref.referralCode} marked as ${status}`,
        'referral'
      );
    }
  };

  const updateFacilityBeds = async (facilityId: string, change: { availableBeds?: number; icuBedsAvailable?: number }) => {
    const fac = await setuDB.getById<Facility>('facilities', facilityId);
    if (fac) {
      fac.availableBeds = change.availableBeds !== undefined ? Math.max(0, Math.min(fac.totalBeds, change.availableBeds)) : fac.availableBeds;
      fac.icuBedsAvailable = change.icuBedsAvailable !== undefined ? Math.max(0, change.icuBedsAvailable) : fac.icuBedsAvailable;
      await setuDB.putItem('facilities', fac);
    }
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

  const completeAshaTask = async (taskId: string, recordedVitals?: any, notes?: string) => {
    const task = await setuDB.getById<AshaTask>('ashaTasks', taskId);
    if (task) {
      task.isSynced = true;
      task.completedAt = 'Just now';
      task.lastVitals = recordedVitals || task.lastVitals;
      task.notes = notes || task.notes;
      await setuDB.putItem('ashaTasks', task);
    }
    setAshaTasks(prev => prev.map(t => t.id === taskId ? { ...t, isSynced: true, completedAt: 'Just now', lastVitals: recordedVitals || t.lastVitals, notes: notes || t.notes } : t));
  };

  const addAshaTask = async (task: Partial<AshaTask>): Promise<AshaTask> => {
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

    await setuDB.putItem('ashaTasks', newTask);
    setAshaTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const logPocTest = async (pocData: Omit<DBPocTest, 'id' | 'timestamp'>): Promise<DBPocTest> => {
    const newTest: DBPocTest = {
      ...pocData,
      id: `poc-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    await setuDB.putItem('pocTests', newTest);
    await setuDB.logActivity(
      pocData.conductedBy,
      'CHO / Field Clinician',
      'Point-of-Care Rapid Test Logged',
      `${pocData.testType}: ${pocData.resultValue} for ${pocData.patientName} (${pocData.patientVillage})`,
      'clinical'
    );
    return newTest;
  };

  const issueDirective = async (dirData: Omit<DBDirective, 'id' | 'issuedAt' | 'acknowledgementsCount'>): Promise<DBDirective> => {
    const newDir: DBDirective = {
      ...dirData,
      id: `dir-${Date.now()}`,
      issuedAt: 'Just now',
      acknowledgementsCount: 0
    };

    await setuDB.putItem('directives', newDir);
    await setuDB.logActivity(
      dirData.issuer,
      dirData.issuerDesignation,
      'Issued Public Health Directive',
      `${newDir.code}: ${newDir.title} (Broadcasted to ${newDir.targetTaluka})`,
      'admin'
    );
    return newDir;
  };

  const acknowledgeDirective = async (dirId: string) => {
    const dir = await setuDB.getById<DBDirective>('directives', dirId);
    if (dir) {
      dir.acknowledgementsCount = (dir.acknowledgementsCount || 0) + 1;
      await setuDB.putItem('directives', dir);
    }
  };

  const reportOutbreakAlert = async (outbreak: Omit<DBOutbreakAlert, 'id' | 'firstReportedAt'>): Promise<DBOutbreakAlert> => {
    const newAlert: DBOutbreakAlert = {
      ...outbreak,
      id: `out-${Date.now()}`,
      firstReportedAt: 'Today'
    };

    await setuDB.putItem('outbreakAlerts', newAlert);
    await setuDB.logActivity(
      outbreak.leadEpidemiologist,
      'IDSP Surveillance Officer',
      'Triggered Outbreak Epidemic Alert',
      `${newAlert.disease} in ${newAlert.villageCluster} (${newAlert.reportedCases} cases)`,
      'admin'
    );
    return newAlert;
  };

  const updateOutbreakStatus = async (outbreakId: string, status: DBOutbreakAlert['status']) => {
    const out = await setuDB.getById<DBOutbreakAlert>('outbreakAlerts', outbreakId);
    if (out) {
      out.status = status;
      await setuDB.putItem('outbreakAlerts', out);
    }
  };

  const resetToFreshDatabase = async () => {
    await setuDB.resetDatabase();
    await syncFromIndexedDB();
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
      directives,
      outbreakAlerts,
      pocTests,
      currentUser,
      setCurrentUser,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authTargetRole,
      setAuthTargetRole,
      openRoleAuthModal,
      logout,
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
      logPocTest,
      issueDirective,
      acknowledgeDirective,
      reportOutbreakAlert,
      updateOutbreakStatus,
      resetToFreshDatabase
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
