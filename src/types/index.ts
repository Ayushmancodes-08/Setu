export type Role = 
  | 'patient' 
  | 'asha' 
  | 'cho' 
  | 'doctor' 
  | 'specialist' 
  | 'pharmacist' 
  | 'lab' 
  | 'facility' 
  | 'dho';

export type Language = 'en' | 'mr' | 'hi';

export type TriageUrgency = 'red' | 'amber' | 'green';

export interface UserProfile {
  id: string;
  name: string;
  nameMr?: string;
  nameHi?: string;
  role: Role;
  mobile: string;
  facilityId?: string;
  facilityName?: string;
  district: string;
  taluka?: string;
  village?: string;
  qualification?: string;
  licenseNumber?: string;
  isVerified: boolean;
  avatarUrl?: string;
}

export interface Facility {
  id: string;
  name: string;
  nameMr: string;
  type: 'Sub-Centre' | 'PHC' | 'CHC' | 'Sub-District Hospital' | 'District Hospital' | 'Diagnostic Lab';
  district: string;
  taluka: string;
  village?: string;
  distanceKm: number;
  openStatus: 'Open 24/7' | 'Open (OPD till 5 PM)' | 'Emergency Only';
  specialistsAvailable: string[];
  totalBeds: number;
  availableBeds: number;
  icuBedsAvailable: number;
  oxygenAvailable: boolean;
  ambulanceAvailable: boolean;
  teleconsultationActive: boolean;
  essentialMedicineStockRate: number; // 0 - 100%
  contactNumber: string;
  latitude: number;
  longitude: number;
  rating: number;
}

export interface HealthScheme {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  shortCode: string;
  ministry: string;
  coverageAmount: string;
  eligibilityCriteria: string[];
  keyBenefits: string[];
  requiredDocuments: string[];
  targetBeneficiaries: string;
  helpline: string;
  applyLinkText: string;
  isStateSpecific: boolean;
}

export interface TriageResult {
  symptoms: string[];
  urgency: TriageUrgency;
  primaryAssessment: string;
  primaryAssessmentMr: string;
  primaryAssessmentHi: string;
  recommendedAction: string;
  recommendedActionMr: string;
  recommendedActionHi: string;
  nearestFacilityType: string;
  redFlags: string[];
  requiresEmergencyAmbulance: boolean;
  followUpHours: number;
}

export interface Referral {
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
  urgency: TriageUrgency;
  reasonForReferral: string;
  status: 'CREATED' | 'SENT' | 'RECEIVED' | 'CONSULTATION_IN_PROGRESS' | 'FOLLOWUP_ASSIGNED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  consultationDate?: string;
  notes?: string;
  assignedAsha?: string;
  dischargeSummary?: string;
}

export interface AshaTask {
  id: string;
  patientName: string;
  patientAge: number;
  village: string;
  householdNumber: string;
  category: 'Maternal ANC' | 'Postnatal PNC' | 'High-Risk NCD' | 'Child Immunization' | 'TB/Infectious Followup' | 'Elderly Care';
  urgency: 'overdue' | 'today' | 'upcoming';
  dueDate: string;
  actionRequired: string;
  actionRequiredMr: string;
  vitalsDue: string[];
  lastVitals?: {
    bp?: string;
    sugar?: string;
    hemoglobin?: string;
    weight?: string;
  };
  isSynced: boolean;
  notes?: string;
  completedAt?: string;
}

export interface MedicineItem {
  id: string;
  code: string;
  name: string;
  genericName: string;
  category: 'Antibiotic' | 'Analgesic' | 'Antihypertensive' | 'Antidiabetic' | 'Maternal Supplement' | 'Pediatric' | 'Emergency' | 'IV Fluid';
  currentStock: number;
  reorderLevel: number;
  unit: string;
  batchNumber: string;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Critical Stock-Out';
  location: string;
  lastDispensedDate: string;
}

export interface DiagnosticOrder {
  id: string;
  orderNumber: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  testName: string;
  testCategory: 'Hematology' | 'Biochemistry' | 'Microbiology/Sputum' | 'Serology/Malaria' | 'Urine Analysis' | 'Radiology';
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

export interface TeleconsultationQueueItem {
  id: string;
  tokenNumber: string;
  patientName: string;
  patientAge: number;
  gender: string;
  village: string;
  presentingComplaint: string;
  urgency: TriageUrgency;
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
}

export interface OfflineMutation {
  id: string;
  type: 'LOG_ASHA_VISIT' | 'REGISTER_PATIENT' | 'CREATE_REFERRAL' | 'DISPENSE_MEDICINE' | 'SUBMIT_LAB_RESULT';
  payload: any;
  timestamp: string;
  status: 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';
  retryCount: number;
  errorMessage?: string;
}

export interface DistrictMetric {
  districtName: string;
  activePatients: number;
  avgWaitTimeMinutes: number;
  referralCompletionRate: number;
  facilitiesWithStockout: number;
  teleconsultationsToday: number;
  highRiskMaternalMonitored: number;
  totalFacilities: number;
  alertCount: number;
  riskStatus: 'Normal' | 'Moderate' | 'Alert' | 'Critical';
}
