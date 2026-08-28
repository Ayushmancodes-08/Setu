import { Language } from '../types';

export interface TranslationSchema {
  // Brand & Nav
  brandName: string;
  brandSubtitle: string;
  govHeader: string;
  navHome: string;
  navFindCare: string;
  navSchemes: string;
  navTriage: string;
  navEcosystem: string;
  navPortals: string;
  emergencyBtn: string;
  onlineStatus: string;
  offlineStatus: string;
  switchRole: string;
  searchPlaceholder: string;
  askAiBtn: string;
  findCareBtn: string;
  checkSchemesBtn: string;
  roleLoginBtn: string;
  homeBtn: string;
  searchAbhaNav: string;

  // Hero & Stats
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
  stat4Label: string;
  stat4Value: string;

  // AI Navigator & Voice
  aiTitle: string;
  aiSubtitle: string;
  aiGreeting: string;
  quickSymptoms: string;
  symptom1: string;
  symptom2: string;
  symptom3: string;
  symptom4: string;
  inputPlaceholder: string;
  sendBtn: string;
  listeningBtn: string;
  voiceBtn: string;
  disclaimer: string;
  aiEngineConfig: string;
  bhashiniVoiceTag: string;

  // Care Finder
  careFinderTitle: string;
  careFinderSubtitle: string;
  filterAll: string;
  filterPHC: string;
  filterSubCentre: string;
  filterHospital: string;
  filterLabs: string;
  bedAvailable: string;
  teleconsultActive: string;
  medicineStock: string;
  callFacility: string;
  viewDetails: string;

  // Schemes
  schemeTitle: string;
  schemeSubtitle: string;
  coverageTag: string;
  checkEligibility: string;
  schemeMjpjay: string;
  schemePmmvy: string;
  schemeJssk: string;

  // ABHA & Advisory
  abhaMakerTitle: string;
  abhaMakerSubtitle: string;
  abhaInputPlaceholder: string;
  generateAbhaCard: string;
  instantQrCode: string;
  downloadCard: string;
  healthAdvisoryTitle: string;
  healthAdvisorySubtitle: string;
  readArticle: string;

  // Role Portals
  rolePortalsTitle: string;
  rolePortalsSubtitle: string;
  openPortal: string;
  authorizedConsoles: string;
  supportingConsoles: string;
  role_patient: string;
  role_asha: string;
  role_cho: string;
  role_doctor: string;
  role_pharmacist: string;
  role_lab: string;
  role_facility: string;
  role_dho: string;

  // Patient Portal
  patientPortalTitle: string;
  vitalsOverview: string;
  bloodPressure: string;
  pulseRate: string;
  oxygenSaturation: string;
  bodyTemp: string;
  bodyWeight: string;
  activePrescriptions: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  recentLabReports: string;
  testResult: string;
  referenceRange: string;
  normalStatus: string;
  borderlineStatus: string;
  criticalStatus: string;
  elderModeToggle: string;
  standardModeToggle: string;
  bookAppointmentBtn: string;
  cancelAppointmentBtn: string;
  joinVideoConsult: string;
  logVitalsBtn: string;
  systolicLabel: string;
  diastolicLabel: string;
  fastingGlucoseLabel: string;
  consultDoctorOnline: string;
  noAppointmentsMsg: string;

  // ASHA & CHO
  ashaPortalTitle: string;
  fieldHomeVisits: string;
  highRiskPregnancy: string;
  ncdScreening: string;
  dueTodayLabel: string;
  overdueLabel: string;
  upcomingLabel: string;
  logVisitSubmit: string;
  householdRoster: string;
  syncWithHmis: string;
  recordBpSugar: string;
  referPatientBtn: string;
  teleconsultQueueTitle: string;
  subCenterTriage: string;
  medicineRequestBtn: string;
  clinicalNotesLabel: string;

  // Doctor & Hospital
  doctorPortalTitle: string;
  liveTeleconsultTitle: string;
  issueRxBtn: string;
  referSpecialistBtn: string;
  diagnosticOrderBtn: string;
  consultSummary: string;
  patientVitalsSummary: string;
  inCallStatus: string;
  endCallBtn: string;
  facilityOpsTitle: string;
  bedTrackerTitle: string;
  icuBedsAvailable: string;
  generalBedsAvailable: string;
  oxygenStatusAvailable: string;
  dispatchAmbulanceBtn: string;
  etaMinutesLabel: string;

  // DHO & District
  dhoPortalTitle: string;
  districtEpidemicOverview: string;
  highRiskMaternalMonitored: string;
  medicineStockRateLabel: string;
  activeSurveillanceAlerts: string;
  issueDistrictDirective: string;
  exportDistrictReport: string;

  // Common UI Actions
  save: string;
  cancel: string;
  close: string;
  submit: string;
  delete: string;
  edit: string;
  update: string;
  search: string;
  loading: string;
  error: string;
  success: string;
  retry: string;
  back: string;
  next: string;
  viewAll: string;
  noDataFound: string;
  refresh: string;
  confirm: string;
  actions: string;
  status: string;
  date: string;
  time: string;
  filter: string;
  reset: string;
  download: string;
  print: string;
  export: string;
  copy: string;
  share: string;
  languageName: string;
  helpline: string;
  details: string;
  verified: string;
  offlineMode: string;
  onlineMode: string;
  syncPending: string;
  synced: string;
  yes: string;
  no: string;

  // Emergency & Toasts
  emergencyModalTitle: string;
  emergencyModalSubtitle: string;
  call108Now: string;
  ambulanceDispatchedMsg: string;
  eta8MinsMsg: string;
  gpsTrackingActive: string;
  nearestTraumaCenter: string;
  firstAidInstructions: string;
  loginSuccessMsg: string;
  logoutSuccessMsg: string;
  vitalsLoggedMsg: string;
  appointmentBookedMsg: string;
  offlineQueuedMsg: string;
  onlineSyncedMsg: string;
  resetDbSuccessMsg: string;
}

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  en: {
    brandName: 'SETU',
    brandSubtitle: 'Rural Healthcare Continuum & Digital Coordination Platform',
    govHeader: 'Government of Maharashtra • Department of Public Health & Family Welfare',
    navHome: 'Home',
    navFindCare: 'Find Hospitals & Labs',
    navSchemes: 'Govt Schemes',
    navTriage: 'AI Triage & Companion',
    navEcosystem: 'Healthcare Ecosystem',
    navPortals: 'Role Portals',
    emergencyBtn: 'EMERGENCY 108',
    onlineStatus: 'Online Mode',
    offlineStatus: 'Offline Mode (ASHA PWA Sync Active)',
    switchRole: 'Switch Operational Role',
    searchPlaceholder: 'Ask symptoms in Marathi, Hindi, Odia, Bengali, Urdu, English or search PHC, medicines...',
    askAiBtn: 'Ask Setu AI Navigator',
    findCareBtn: 'Find Nearest Hospital / PHC',
    checkSchemesBtn: 'Check Scheme Eligibility (MJPJAY)',
    roleLoginBtn: 'Role Login',
    homeBtn: 'Home',
    searchAbhaNav: 'Search ABHA / Patient',

    heroBadge: 'Government of Maharashtra PS:6133 HealthTech Initiative',
    heroTitle: 'Connected Healthcare from Village Sub-Centre to District Hospital',
    heroSubtitle: 'ArogyaSakhi AI Health Companion, assisted teleconsultations, instant digital triage, real-time medicine availability, and seamless referral continuity for rural & underserved communities.',
    stat1Label: 'Rural Sub-Centres & PHCs Connected',
    stat1Value: '14,280+',
    stat2Label: 'Average Triage & Queue Time',
    stat2Value: '4.2 Mins',
    stat3Label: 'Essential Medicine Availability Rate',
    stat3Value: '91.8%',
    stat4Label: 'Referrals Tracked to Completion',
    stat4Value: '88.4%',

    aiTitle: 'ArogyaSakhi — AI Health Companion',
    aiSubtitle: 'Multilingual Clinical Guidance & Healthcare Navigation for Maharashtra',
    aiGreeting: 'Namaskar! I am Setu ArogyaSakhi, your AI Health Companion. Describe your symptoms in plain language, check free treatments under MJPJAY, or find the nearest open PHC.',
    quickSymptoms: 'Popular Inquiries:',
    symptom1: 'High fever & chills for 3 days',
    symptom2: 'Severe chest pain radiating to left arm',
    symptom3: 'Free pregnancy delivery under JSSK',
    symptom4: 'Check Paracetamol & Insulin stock at PHC',
    inputPlaceholder: 'Describe your symptoms or ask a health question...',
    sendBtn: 'Ask AI',
    listeningBtn: 'Listening...',
    voiceBtn: 'Speak in Your Language',
    disclaimer: 'Disclaimer: Setu provides clinical guidance based on Government of Maharashtra triage protocols. In severe emergencies, call 108 or visit your nearest hospital immediately.',
    aiEngineConfig: 'AI Engine',
    bhashiniVoiceTag: 'Bhashini AI Voice',

    careFinderTitle: 'Find Public Healthcare Facilities Near You',
    careFinderSubtitle: 'Locate Sub-Centres, PHCs, Rural Hospitals, and District Facilities with real-time bed, doctor, and medicine visibility.',
    filterAll: 'All Facilities',
    filterPHC: 'Primary Health Centres (PHC)',
    filterSubCentre: 'Ayushman Arogya Mandir (SC)',
    filterHospital: 'Sub-District & District Hospitals',
    filterLabs: 'Empanelled Diagnostic Labs',
    bedAvailable: 'Beds Available',
    teleconsultActive: 'Teleconsultation Active',
    medicineStock: 'Medicine Stock Rate',
    callFacility: 'Call Facility',
    viewDetails: 'View Services & OPD Queue',

    schemeTitle: 'Government Healthcare Schemes & Financial Protection',
    schemeSubtitle: 'Explore 100% cashless healthcare schemes in Maharashtra. Check your eligibility, required documents, and empanelled hospitals.',
    coverageTag: 'Cashless Benefit',
    checkEligibility: 'Check Eligibility & Documents',
    schemeMjpjay: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)',
    schemePmmvy: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    schemeJssk: 'Janani Shishu Suraksha Karyakram (JSSK)',

    abhaMakerTitle: 'Create Your Ayushman Bharat Health Account (ABHA)',
    abhaMakerSubtitle: 'Generate your official 14-digit ABHA ID card instantly with digital QR code verification.',
    abhaInputPlaceholder: 'Enter 12-digit Aadhaar Number or Mobile Number...',
    generateAbhaCard: 'Generate ABHA Card',
    instantQrCode: 'Instant QR Health ID',
    downloadCard: 'Download ABHA Card',
    healthAdvisoryTitle: 'Public Health Advisories & Community Wellness',
    healthAdvisorySubtitle: 'Verified preventive health advisories, seasonal disease warnings, and maternal care guidance.',
    readArticle: 'Read Full Advisory',

    rolePortalsTitle: 'Operational Role Portals (One Shared Network)',
    rolePortalsSubtitle: 'Experience how Setu unifies patients, field ASHA workers, MOs, specialists, pharmacists, lab techs, facility coordinators, and DHOs.',
    openPortal: 'Launch Portal Interface',
    authorizedConsoles: 'Authorized Primary Health Consoles',
    supportingConsoles: 'Authorized Supporting Health Consoles',
    role_patient: 'Patient / Citizen',
    role_asha: 'ASHA Frontline Worker',
    role_cho: 'CHO / Medical Officer',
    role_doctor: 'Doctor / Specialist',
    role_pharmacist: 'Pharmacist / Chemist',
    role_lab: 'Lab Technician',
    role_facility: 'Facility Operations Coordinator',
    role_dho: 'District Health Officer (DHO)',

    patientPortalTitle: 'Citizen Digital Health Locker & Teleconsultation Hub',
    vitalsOverview: 'Latest Vital Parameters',
    bloodPressure: 'Blood Pressure',
    pulseRate: 'Pulse Rate',
    oxygenSaturation: 'Blood Oxygen (SpO2)',
    bodyTemp: 'Body Temperature',
    bodyWeight: 'Body Weight',
    activePrescriptions: 'Active e-Prescriptions & Medicines',
    dosage: 'Dosage',
    frequency: 'Frequency',
    duration: 'Duration',
    instructions: 'Instructions',
    recentLabReports: 'Diagnostic Reports & Panic Alerts',
    testResult: 'Observed Value',
    referenceRange: 'Normal Range',
    normalStatus: 'Normal',
    borderlineStatus: 'Borderline',
    criticalStatus: 'Critical Alert',
    elderModeToggle: 'Elder-Friendly Mode (सुगम मोड)',
    standardModeToggle: 'Standard View',
    bookAppointmentBtn: 'Book Teleconsultation Slot',
    cancelAppointmentBtn: 'Cancel Appointment',
    joinVideoConsult: 'Join Live Teleconsultation',
    logVitalsBtn: 'Record Blood Pressure & Sugar',
    systolicLabel: 'Systolic (mmHg)',
    diastolicLabel: 'Diastolic (mmHg)',
    fastingGlucoseLabel: 'Fasting Blood Sugar (mg/dL)',
    consultDoctorOnline: 'Connect with Specialist Doctor',
    noAppointmentsMsg: 'No active appointments scheduled. Book a slot below.',

    ashaPortalTitle: 'ASHA Field Worker Console • Offline PWA',
    fieldHomeVisits: 'Priority Field Home Visits',
    highRiskPregnancy: 'High-Risk Maternal ANC Monitoring',
    ncdScreening: 'Non-Communicable Diseases (NCD) Registry',
    dueTodayLabel: 'Due Today',
    overdueLabel: 'Overdue Action',
    upcomingLabel: 'Upcoming Visit',
    logVisitSubmit: 'Record Field Visit & Vitals',
    householdRoster: 'Household Roster',
    syncWithHmis: 'Sync with State HMIS',
    recordBpSugar: 'Measure BP & Random Sugar',
    referPatientBtn: 'Refer Patient to CHO / PHC',
    teleconsultQueueTitle: 'Sub-Centre Teleconsultation Queue',
    subCenterTriage: 'Community Spoke Digital Triage',
    medicineRequestBtn: 'Request Medicine Indent',
    clinicalNotesLabel: 'Clinical Notes & Findings',

    doctorPortalTitle: 'Specialist Telemedicine & Referral Hub',
    liveTeleconsultTitle: 'Active Teleconsultation Video Room',
    issueRxBtn: 'Issue Digital e-Prescription',
    referSpecialistBtn: 'Refer to District Hospital',
    diagnosticOrderBtn: 'Order Laboratory Diagnostic',
    consultSummary: 'Consultation Summary',
    patientVitalsSummary: 'Patient Vitals & Presenting Complaints',
    inCallStatus: 'Teleconsultation In Progress',
    endCallBtn: 'End Video Call & Issue Rx',
    facilityOpsTitle: 'Hospital Operations & Resource Coordinator',
    bedTrackerTitle: 'Real-Time Bed & ICU Availability Tracker',
    icuBedsAvailable: 'ICU Ventilator Beds Available',
    generalBedsAvailable: 'General Ward Beds Available',
    oxygenStatusAvailable: 'Liquid Medical Oxygen Available',
    dispatchAmbulanceBtn: 'Dispatch 108 Emergency Ambulance',
    etaMinutesLabel: 'Estimated Arrival (Minutes)',

    dhoPortalTitle: 'District Health Officer (DHO) Command Centre',
    districtEpidemicOverview: 'District Health & Epidemiological Surveillance',
    highRiskMaternalMonitored: 'High-Risk Mothers Monitored',
    medicineStockRateLabel: 'Essential Medicine Stock Availability',
    activeSurveillanceAlerts: 'Active Epidemiological Outbreak Alerts',
    issueDistrictDirective: 'Issue Public Health Directive',
    exportDistrictReport: 'Export District Summary (PDF/Excel)',

    save: 'Save Changes',
    cancel: 'Cancel',
    close: 'Close',
    submit: 'Submit',
    delete: 'Delete',
    edit: 'Edit',
    update: 'Update',
    search: 'Search',
    loading: 'Loading...',
    error: 'Error encountered',
    success: 'Operation successful',
    retry: 'Retry',
    back: 'Back',
    next: 'Next',
    viewAll: 'View All',
    noDataFound: 'No records found',
    refresh: 'Refresh',
    confirm: 'Confirm',
    actions: 'Actions',
    status: 'Status',
    date: 'Date',
    time: 'Time',
    filter: 'Filter',
    reset: 'Reset',
    download: 'Download',
    print: 'Print',
    export: 'Export',
    copy: 'Copy',
    share: 'Share',
    languageName: 'English',
    helpline: 'Toll-Free Helpline',
    details: 'View Details',
    verified: 'Verified Record',
    offlineMode: 'Offline Mode Active',
    onlineMode: 'HMIS Online Active',
    syncPending: 'Mutations Queued',
    synced: 'All Records Synced',
    yes: 'Yes',
    no: 'No',

    emergencyModalTitle: 'Maharashtra Emergency Medical Response (108)',
    emergencyModalSubtitle: '24x7 Real-Time Emergency Ambulance Dispatch & Trauma Resuscitation Grid',
    call108Now: 'Dial 108 Emergency SOS',
    ambulanceDispatchedMsg: '108 Ambulance Dispatched! ETA: 8 minutes to your GPS coordinates.',
    eta8MinsMsg: 'Ambulance en route • ETA: 8 minutes',
    gpsTrackingActive: 'Live GPS Location Shared with Junnar EMS Hub',
    nearestTraumaCenter: 'Nearest Empanelled Trauma Centre: Junnar Rural Hospital',
    firstAidInstructions: 'Keep patient calm, elevate head, loosen tight clothing, do not give liquids if unconscious.',
    loginSuccessMsg: 'Authentication verified successfully.',
    logoutSuccessMsg: 'Signed out of role console.',
    vitalsLoggedMsg: 'Recorded new vitals successfully.',
    appointmentBookedMsg: 'Appointment confirmed with doctor.',
    offlineQueuedMsg: 'Offline mode active — changes stored locally.',
    onlineSyncedMsg: 'Online connection restored — data synchronized.',
    resetDbSuccessMsg: 'IndexedDB reset to initial state.'
  },

  mr: {
    brandName: 'सेतू (SETU)',
    brandSubtitle: 'ग्रामीण आरोग्य सेवा प्रवेश व डिजिटल समन्वय व्यासपीठ',
    govHeader: 'महाराष्ट्र शासन • सार्वजनिक आरोग्य व कुटुंब कल्याण विभाग',
    navHome: 'मुख्यपृष्ठ',
    navFindCare: 'दवाखाने व लॅब्स शोधा',
    navSchemes: 'शासकीय योजना',
    navTriage: 'एआय ट्रायज व सखी',
    navEcosystem: 'आरोग्य परिसंस्था',
    navPortals: 'भूमिका पोर्टल्स',
    emergencyBtn: 'आपत्कालीन १०८',
    onlineStatus: 'ऑनलाइन मोड',
    offlineStatus: 'ऑफलाइन मोड (आशा डेटा सिंक सक्रिय)',
    switchRole: 'कार्यकारी भूमिका बदला',
    searchPlaceholder: 'मराठी, हिंदी, ओडिया, बंगाली, उर्दू किंवा इंग्रजीत लक्षणे सांगा किंवा दवाखाने शोधा...',
    askAiBtn: 'सेतू एआय ला विचारा',
    findCareBtn: 'जवळचे रुग्णालय / पीएचसी शोधा',
    checkSchemesBtn: 'योजना पात्रता तपासा (MJPJAY)',
    roleLoginBtn: 'भूमिका लॉगिन',
    homeBtn: 'मुख्यपृष्ठ',
    searchAbhaNav: 'आभा / रुग्ण शोधा',

    heroBadge: 'महाराष्ट्र शासन PS:6133 हेल्थटेक उपक्रम',
    heroTitle: 'गावातील उपकेंद्रापासून जिल्हा रुग्णालयापर्यंत जोडलेली आरोग्य व्यवस्था',
    heroSubtitle: 'आरोग्यसखी एआय सहचर, सहाय्यक टेलिकन्सल्टेशन, त्वरित डिजिटल ट्रायज, थेट औषध उपलब्धता आणि अखंड संदर्भ सेवा.',
    stat1Label: 'जोडलेली उपकेंद्रे व प्राथमिक आरोग्य केंद्रे',
    stat1Value: '१४,२८०+',
    stat2Label: 'सरासरी ट्रायज व प्रतीक्षा वेळ',
    stat2Value: '४.२ मिनिटे',
    stat3Label: 'अत्यावश्यक औषध उपलब्धता दर',
    stat3Value: '९१.८%',
    stat4Label: 'पूर्णत्वास गेलेले संदर्भ (Referrals)',
    stat4Value: '८८.४%',

    aiTitle: 'आरोग्यसखी — एआय आरोग्य सहचर',
    aiSubtitle: 'महाराष्ट्रासाठी बहुभाषिक वैद्यकीय मार्गदर्शन व आरोग्य नेव्हिगेशन',
    aiGreeting: 'नमस्कार! मी सेतू आरोग्यसखी, तुमची डिजिटल आरोग्य मार्गदर्शक. तुमची लक्षणे सांगा, मोफत उपचारांची माहिती घ्या किंवा दवाखाना शोधा.',
    quickSymptoms: 'वारंवार विचारले जाणारे प्रश्न:',
    symptom1: '३ दिवसांपासून तीव्र ताप व थंडी',
    symptom2: 'छातीत डाव्या बाजूला तीव्र कळ व घाम',
    symptom3: 'जननी शिशु सुरक्षा योजनेतून मोफत प्रसूती',
    symptom4: 'पीएचसी मध्ये पॅरासिटामॉल व इन्सुलिन साठा तपासा',
    inputPlaceholder: 'तुमची लक्षणे लिहा किंवा मराठीत बोला...',
    sendBtn: 'विचारा',
    listeningBtn: 'ऐकत आहे...',
    voiceBtn: 'मराठीत बोला',
    disclaimer: 'सूचना: आरोग्यसखी हे महाराष्ट्र शासनाच्या ट्रायज मार्गदर्शक तत्त्वांवर आधारित सल्ला देते. गंभीर आपत्कालीन परिस्थितीत तात्काळ १०८ वर कॉल करा.',
    aiEngineConfig: 'एआय इंजिन',
    bhashiniVoiceTag: 'भाषिणी एआय व्हॉईस',

    careFinderTitle: 'तुमच्या जवळील शासकीय आरोग्य सुविधा शोधा',
    careFinderSubtitle: 'उपकेंद्र, प्राथमिक आरोग्य केंद्र, ग्रामीण रुग्णालय व जिल्हा रुग्णालय यांची खाटा, डॉक्टर आणि औषध स्थिती थेट पहा.',
    filterAll: 'सर्व सुविधा',
    filterPHC: 'प्राथमिक आरोग्य केंद्र (PHC)',
    filterSubCentre: 'आयुष्मान आरोग्य मंदिर (उपकेंद्र)',
    filterHospital: 'उपजिल्हा व जिल्हा रुग्णालये',
    filterLabs: 'शासकीय निदान प्रयोगशाळा',
    bedAvailable: 'उपलब्ध खाटा',
    teleconsultActive: 'टेलिकन्सल्टेशन सुरू',
    medicineStock: 'औषध साठा दर',
    callFacility: 'संपर्क साधा',
    viewDetails: 'सेवा व रांग स्थिती पहा',

    schemeTitle: 'शासकीय आरोग्य योजना व आर्थिक संरक्षण',
    schemeSubtitle: 'महाराष्ट्रातील १००% मोफत कॅशलेस योजनांची माहिती घ्या. पात्रता, कागदपत्रे व संलग्न रुग्णालये तपासा.',
    coverageTag: 'कॅशलेस लाभ',
    checkEligibility: 'पात्रता व कागदपत्रे तपासा',
    schemeMjpjay: 'महात्मा ज्योतिराव फुले जन आरोग्य योजना (MJPJAY)',
    schemePmmvy: 'प्रधानमंत्री मातृ वंदना योजना (PMMVY)',
    schemeJssk: 'जननी शिशु सुरक्षा कार्यक्रम (JSSK)',

    abhaMakerTitle: 'तुमचे आयुष्मान भारत हेल्थ अकाउंट (ABHA) तयार करा',
    abhaMakerSubtitle: 'डिजिटल क्यूआर कोड पडताळणीसह तुमचे अधिकृत १४-अंकी आभा कार्ड त्वरित मिळवा.',
    abhaInputPlaceholder: '१२-अंकी आधार क्रमांक किंवा मोबाईल क्रमांक टाका...',
    generateAbhaCard: 'आभा कार्ड तयार करा',
    instantQrCode: 'त्वरित क्यूआर हेल्थ आयडी',
    downloadCard: 'आभा कार्ड डाउनलोड करा',
    healthAdvisoryTitle: 'सार्वजनिक आरोग्य सल्लागार व समुदाय कल्याण',
    healthAdvisorySubtitle: 'प्रमाणित प्रतिबंधात्मक आरोग्य सूचना, हंगामी आजार आणि माता-बाल संगोपन मार्गदर्शन.',
    readArticle: 'संपूर्ण माहिती वाचा',

    rolePortalsTitle: 'कार्यकारी भूमिका पोर्टल्स (एकसंध आरोग्य नेटवर्क)',
    rolePortalsSubtitle: 'रुग्ण, आशा सेविका, वैद्यकीय अधिकारी, तज्ज्ञ डॉक्टर, औषध निर्माण अधिकारी, लॅब तंत्रज्ञ आणि जिल्हा आरोग्य अधिकारी यांचा समन्वय.',
    openPortal: 'पोर्टल उघडा',
    authorizedConsoles: 'प्राथमिक अधिकृत आरोग्य कन्सोल',
    supportingConsoles: 'सहाय्यक वैद्यकीय कन्सोल',
    role_patient: 'रुग्ण / नागरिक',
    role_asha: 'आशा सेविका (ASHA)',
    role_cho: 'समुदाय आरोग्य अधिकारी (CHO/MO)',
    role_doctor: 'तज्ज्ञ वैद्यकीय अधिकारी',
    role_pharmacist: 'औषध निर्माण अधिकारी (Pharmacist)',
    role_lab: 'प्रयोगशाळा तंत्रज्ञ (Lab Tech)',
    role_facility: 'रुग्णालय व्यवस्थापक (Coordinator)',
    role_dho: 'जिल्हा आरोग्य अधिकारी (DHO)',

    patientPortalTitle: 'नागरिक डिजिटल हेल्थ लॉकर व टेलिकन्सल्टेशन हब',
    vitalsOverview: 'अद्ययावत आरोग्य मापदंड',
    bloodPressure: 'रक्तदाब (BP)',
    pulseRate: 'नाडीचे ठोके (Pulse)',
    oxygenSaturation: 'ऑक्सिजन पातळी (SpO2)',
    bodyTemp: 'शरीराचे तापमान',
    bodyWeight: 'वजन (किलो)',
    activePrescriptions: 'सक्रिय ई-प्रिस्क्रिप्शन व औषधे',
    dosage: 'मात्रा',
    frequency: 'वेळा',
    duration: 'कालावधी',
    instructions: 'सूचना',
    recentLabReports: 'निदान तपासणी अहवाल',
    testResult: 'तपासणी निष्कर्ष',
    referenceRange: 'सामान्य श्रेणी',
    normalStatus: 'सामान्य',
    borderlineStatus: 'सीमावर्ती',
    criticalStatus: 'तातडीचा इशारा',
    elderModeToggle: 'सुगम मोड (ज्येष्ठ नागरिक)',
    standardModeToggle: 'प्रमाणित दृश्य',
    bookAppointmentBtn: 'टेलिकन्सल्टेशन वेळ निश्चित करा',
    cancelAppointmentBtn: 'अपॉइंटमेंट रद्द करा',
    joinVideoConsult: 'थेट व्हिडिओ सल्लामसलत सुरू करा',
    logVitalsBtn: 'रक्तदाब व साखर नोंदवा',
    systolicLabel: 'सिस्टॉलिक (mmHg)',
    diastolicLabel: 'डायस्टॉलिक (mmHg)',
    fastingGlucoseLabel: 'उपाशीपोटी साखर (mg/dL)',
    consultDoctorOnline: 'तज्ज्ञ डॉक्टरांशी संपर्क साधा',
    noAppointmentsMsg: 'सध्या कोणतीही नियोजित अपॉइंटमेंट नाही. खालील बटणावरून वेळ बुक करा.',

    ashaPortalTitle: 'आशा सेविका फील्ड कन्सोल • ऑफलाइन कार्यक्षम',
    fieldHomeVisits: 'प्राधान्य गृहभेटी',
    highRiskPregnancy: 'अतिजोखमीची माता (ANC) देखरेख',
    ncdScreening: 'असंचारी रोग (NCD) नोंदवही',
    dueTodayLabel: 'आज देय',
    overdueLabel: 'प्रलंबित कृती',
    upcomingLabel: 'आगामी भेट',
    logVisitSubmit: 'गृहभेट व आरोग्य मापदंड नोंदवा',
    householdRoster: 'कुटुंब यादी',
    syncWithHmis: 'शासकीय प्रणालीशी सिंक करा',
    recordBpSugar: 'बीपी व साखर तपासा',
    referPatientBtn: 'रुग्णाला पीएचसी/सीएचओ कडे पाठवा',
    teleconsultQueueTitle: 'उपकेंद्र टेलिकन्सल्टेशन रांग',
    subCenterTriage: 'सामुदायिक डिजिटल ट्रायज',
    medicineRequestBtn: 'औषध पुरवठा मागणी नोंदवा',
    clinicalNotesLabel: 'वैद्यकीय निरीक्षणे व नोंदी',

    doctorPortalTitle: 'तज्ज्ञ डॉक्टर टेलिमेडिसिन व संदर्भ हब',
    liveTeleconsultTitle: 'थेट टेलिकन्सल्टेशन व्हिडिओ कक्ष',
    issueRxBtn: 'डिजिटल ई-प्रिस्क्रिप्शन द्या',
    referSpecialistBtn: 'जिल्हा रुग्णालयात संदर्भित करा',
    diagnosticOrderBtn: 'लॅब चाचणीची शिफारस करा',
    consultSummary: 'सल्लामसलत सारांश',
    patientVitalsSummary: 'रुग्णाची लक्षणे व आरोग्य मापदंड',
    inCallStatus: 'व्हिडिओ सल्लामसलत सुरू आहे',
    endCallBtn: 'कॉल पूर्ण करून प्रिस्क्रिप्शन द्या',
    facilityOpsTitle: 'रुग्णालय व्यवस्थापन व खाटा उपलब्धता',
    bedTrackerTitle: 'थेट खाटा व आयसीयू ट्रॅकर',
    icuBedsAvailable: 'व्हेंटिलेटर आयसीयू खाटा उपलब्ध',
    generalBedsAvailable: 'सर्वसाधारण खाटा उपलब्ध',
    oxygenStatusAvailable: 'वैद्यकीय ऑक्सिजन पुरवठा उपलब्ध',
    dispatchAmbulanceBtn: '१०८ रुग्णवाहिका तात्काळ पाठवा',
    etaMinutesLabel: 'अपेक्षित आगमन वेळ (मिनिटे)',

    dhoPortalTitle: 'जिल्हा आरोग्य अधिकारी (DHO) नियंत्रण कक्ष',
    districtEpidemicOverview: 'जिल्हा आरोग्य व साथीचे रोग नियंत्रण',
    highRiskMaternalMonitored: 'निरीक्षणाखालील अतिजोखमीच्या माता',
    medicineStockRateLabel: 'अत्यावश्यक औषध साठा प्रमाण',
    activeSurveillanceAlerts: 'सक्रिय साथीच्या रोगांचे इशारे',
    issueDistrictDirective: 'सार्वजनिक आरोग्य निर्देश जारी करा',
    exportDistrictReport: 'जिल्हा अहवाल डाउनलोड करा (PDF/Excel)',

    save: 'जतन करा',
    cancel: 'रद्द करा',
    close: 'बंद करा',
    submit: 'सादर करा',
    delete: 'हटवा',
    edit: 'संपादित करा',
    update: 'अद्यतन करा',
    search: 'शोधा',
    loading: 'लोड होत आहे...',
    error: 'त्रुटी आढळली',
    success: 'क्रिया यशस्वी',
    retry: 'पुन्हा प्रयत्न करा',
    back: 'मागे',
    next: 'पुढे',
    viewAll: 'सर्व पहा',
    noDataFound: 'कोणतीही नोंद आढळली नाही',
    refresh: 'ताजे करा',
    confirm: 'पुष्टी करा',
    actions: 'कृती',
    status: 'स्थिती',
    date: 'तारीख',
    time: 'वेळ',
    filter: 'फिल्टर',
    reset: 'रीसेट करा',
    download: 'डाउनलोड',
    print: 'प्रिंट',
    export: 'निर्यात',
    copy: 'कॉपी करा',
    share: 'शेअर करा',
    languageName: 'मराठी',
    helpline: 'टोल-फ्री हेल्पलाईन',
    details: 'तपशील पहा',
    verified: 'प्रमाणित नोंद',
    offlineMode: 'ऑफलाइन मोड सक्रिय',
    onlineMode: 'ऑनलाइन सिंक सक्रिय',
    syncPending: 'बदल रांगेत आहेत',
    synced: 'सर्व नोंदी सिंक झाल्या',
    yes: 'होय',
    no: 'नाही',

    emergencyModalTitle: 'महाराष्ट्र शासन आपत्कालीन वैद्यकीय प्रतिसाद (१०८)',
    emergencyModalSubtitle: '२४x७ तात्काळ रुग्णवाहिका व आघात उपचार नियंत्रण यंत्रणा',
    call108Now: '१०८ तात्काळ आपत्कालीन कॉल करा',
    ambulanceDispatchedMsg: '१०८ रुग्णवाहिका रवाना झाली! अपेक्षित वेळ: ८ मिनिटे.',
    eta8MinsMsg: 'रुग्णवाहिका मार्गावर • अपेक्षित वेळ: ८ मिनिटे',
    gpsTrackingActive: 'थेट जीपीएस स्थान जुन्नर नियंत्रण कक्षाशी जोडले आहे',
    nearestTraumaCenter: 'जवळचे आघात उपचार केंद्र: जुन्नर ग्रामीण रुग्णालय',
    firstAidInstructions: 'रुग्णाला शांत ठेवा, डोके उंच ठेवा, कपडे सैल करा, बेशुद्ध असल्यास पाणी देऊ नका.',
    loginSuccessMsg: 'प्रमाणीकरण यशस्वी झाले.',
    logoutSuccessMsg: 'कन्सोलमधून बाहेर पडलात.',
    vitalsLoggedMsg: 'नवीन आरोग्य मापदंड यशस्वीपणे नोंदवले.',
    appointmentBookedMsg: 'डॉक्टरांसोबत अपॉइंटमेंट निश्चित झाली.',
    offlineQueuedMsg: 'ऑफलाइन मोड सक्रिय — डेटा स्थानिक पातळीवर साठवला आहे.',
    onlineSyncedMsg: 'इंटरनेट जोडणी पूर्ववत — डेटा सिंक झाला.',
    resetDbSuccessMsg: 'स्थानिक डेटाबेस पूर्ववत केला.'
  },

  hi: {
    brandName: 'सेतु (SETU)',
    brandSubtitle: 'ग्रामीण स्वास्थ्य सेवा सुलभता एवं डिजिटल समन्वय मंच',
    govHeader: 'महाराष्ट्र सरकार • सार्वजनिक स्वास्थ्य एवं परिवार कल्याण विभाग',
    navHome: 'मुख्य पृष्ठ',
    navFindCare: 'अस्पताल व लैब्स खोजें',
    navSchemes: 'सरकारी योजनाएं',
    navTriage: 'एआई ट्राइएज व साथी',
    navEcosystem: 'स्वास्थ्य पारिस्थितिकी तंत्र',
    navPortals: 'भूमिका पोर्टल्स',
    emergencyBtn: 'आपातकालीन 108',
    onlineStatus: 'ऑनलाइन मोड',
    offlineStatus: 'ऑफलाइन मोड (आशा डेटा सिंक सक्रिय)',
    switchRole: 'परिचालन भूमिका बदलें',
    searchPlaceholder: 'हिंदी, मराठी, उड़िया, बंगाली, उर्दू या अंग्रेजी में लक्षण बताएं या दवाइयां खोजें...',
    askAiBtn: 'सेतु एआई से पूछें',
    findCareBtn: 'निकटतम अस्पताल / पीएचसी खोजें',
    checkSchemesBtn: 'योजना पात्रता जांचें (MJPJAY)',
    roleLoginBtn: 'भूमिका लॉगिन',
    homeBtn: 'मुख्य पृष्ठ',
    searchAbhaNav: 'आभा / मरीज खोजें',

    heroBadge: 'महाराष्ट्र सरकार PS:6133 हेल्थटेक पहल',
    heroTitle: 'ग्रामीण उप-केंद्र से जिला अस्पताल तक जुड़ी स्वास्थ्य व्यवस्था',
    heroSubtitle: 'आरोग्यसखी एआई स्वास्थ्य साथी, सहायक टेलीकंसल्टेशन, त्वरित डिजिटल ट्राइएज, वास्तविक समय में दवा उपलब्धता और सुचारू रेफरल समन्वय।',
    stat1Label: 'जुड़े हुए उप-केंद्र एवं प्राथमिक स्वास्थ्य केंद्र',
    stat1Value: '14,280+',
    stat2Label: 'औसत ट्राइएज एवं प्रतीक्षा समय',
    stat2Value: '4.2 मिनट',
    stat3Label: 'आवश्यक दवा उपलब्धता दर',
    stat3Value: '91.8%',
    stat4Label: 'सफलतापूर्वक पूर्ण हुए रेफरल',
    stat4Value: '88.4%',

    aiTitle: 'आरोग्यसखी — एआई स्वास्थ्य साथी',
    aiSubtitle: 'महाराष्ट्र के लिए बहुभाषी चिकित्सकीय मार्गदर्शन एवं स्वास्थ्य नेविगेशन',
    aiGreeting: 'नमस्ते! मैं सेतु आरोग्यसखी हूँ, आपकी डिजिटल स्वास्थ्य साथी। अपने लक्षण बताएं, सरकारी योजनाओं की जानकारी लें या अस्पताल खोजें।',
    quickSymptoms: 'अक्सर पूछे जाने वाले प्रश्न:',
    symptom1: '3 दिनों से तेज बुखार और ठंड',
    symptom2: 'सीने के बाईं ओर तेज दर्द और पसीना',
    symptom3: 'जननी शिशु सुरक्षा योजना से मुफ्त प्रसव',
    symptom4: 'पीएचसी में पैरासिटामोल व इंसुलिन का स्टॉक जांचें',
    inputPlaceholder: 'अपने लक्षण लिखें या बोलकर बताएं...',
    sendBtn: 'पूछें',
    listeningBtn: 'सुन रहा है...',
    voiceBtn: 'हिंदी में बोलें',
    disclaimer: 'सूचना: आरोग्यसखी महाराष्ट्र सरकार के ट्राइएज प्रोटोकॉल के आधार पर प्राथमिक मार्गदर्शन प्रदान करती है। गंभीर आपातकाल में तुरंत 108 डायल करें।',
    aiEngineConfig: 'एआई इंजन',
    bhashiniVoiceTag: 'भाषिणी एआई आवाज',

    careFinderTitle: 'अपने निकटतम सरकारी स्वास्थ्य सुविधाएं खोजें',
    careFinderSubtitle: 'उप-केंद्र, पीएचसी, ग्रामीण अस्पताल एवं जिला अस्पतालों में उपलब्ध बिस्तर, डॉक्टर और दवाओं की लाइव स्थिति देखें।',
    filterAll: 'सभी सुविधाएं',
    filterPHC: 'प्राथमिक स्वास्थ्य केंद्र (PHC)',
    filterSubCentre: 'आयुष्मान आरोग्य मंदिर (SC)',
    filterHospital: 'उप-जिला व जिला अस्पताल',
    filterLabs: 'पैनलबद्ध जांच प्रयोगशालाएं',
    bedAvailable: 'उपलब्ध बिस्तर',
    teleconsultActive: 'टेलीकंसल्टेशन सक्रिय',
    medicineStock: 'दवा स्टॉक दर',
    callFacility: 'संपर्क करें',
    viewDetails: 'सेवाएं एवं ओपीडी कतार देखें',

    schemeTitle: 'सरकारी स्वास्थ्य योजनाएं एवं वित्तीय सुरक्षा',
    schemeSubtitle: 'महाराष्ट्र की 100% कैशलेस योजनाओं की जानकारी। अपनी पात्रता, आवश्यक दस्तावेज और अस्पताल सूची देखें।',
    coverageTag: 'कैशलेस लाभ',
    checkEligibility: 'पात्रता व दस्तावेज जांचें',
    schemeMjpjay: 'महात्मा ज्योतिराव फुले जन आरोग्य योजना (MJPJAY)',
    schemePmmvy: 'प्रधानमंत्री मातृ वंदना योजना (PMMVY)',
    schemeJssk: 'जननी शिशु सुरक्षा कार्यक्रम (JSSK)',

    abhaMakerTitle: 'अपना आयुष्मान भारत हेल्थ अकाउंट (ABHA) बनाएं',
    abhaMakerSubtitle: 'डिजिटल क्यूआर कोड सत्यापन के साथ अपना 14-अंकीय आधिकारिक आभा कार्ड तुरंत प्राप्त करें।',
    abhaInputPlaceholder: '12-अंकीय आधार नंबर या मोबाइल नंबर दर्ज करें...',
    generateAbhaCard: 'आभा कार्ड बनाएं',
    instantQrCode: 'तुरंत क्यूआर हेल्थ आईडी',
    downloadCard: 'आभा कार्ड डाउनलोड करें',
    healthAdvisoryTitle: 'सार्वजनिक स्वास्थ्य परामर्श एवं सामुदायिक कल्याण',
    healthAdvisorySubtitle: 'प्रमाणित निवारक स्वास्थ्य दिशानिर्देश, मौसमी बीमारियां और मातृ एवं शिशु स्वास्थ्य देखभाल।',
    readArticle: 'पूरी जानकारी पढ़ें',

    rolePortalsTitle: 'परिचालन भूमिका पोर्टल्स (एक एकीकृत नेटवर्क)',
    rolePortalsSubtitle: 'मरीज, आशा कार्यकर्ता, चिकित्सा अधिकारी, विशेषज्ञ, फार्मासिस्ट, लैब तकनीशियन एवं जिला स्वास्थ्य अधिकारी का सहज समन्वय।',
    openPortal: 'पोर्टल खोलें',
    authorizedConsoles: 'प्राथमिक अधिकृत स्वास्थ्य कंसोल',
    supportingConsoles: 'सहायक चिकित्सकीय कंसोल',
    role_patient: 'मरीज / नागरिक',
    role_asha: 'आशा कार्यकर्ता (ASHA)',
    role_cho: 'सामुदायिक स्वास्थ्य अधिकारी (CHO/MO)',
    role_doctor: 'विशेषज्ञ चिकित्सा अधिकारी',
    role_pharmacist: 'फार्मासिस्ट (औषधि निर्माता)',
    role_lab: 'लैब तकनीशियन',
    role_facility: 'अस्पताल समन्वयक (Coordinator)',
    role_dho: 'जिला स्वास्थ्य अधिकारी (DHO)',

    patientPortalTitle: 'नागरिक डिजिटल हेल्थ लॉकर एवं टेलीकंसल्टेशन केंद्र',
    vitalsOverview: 'नवीनतम स्वास्थ्य मापदंड',
    bloodPressure: 'रक्तचाप (BP)',
    pulseRate: 'नाड़ी गति (Pulse)',
    oxygenSaturation: 'ऑक्सीजन स्तर (SpO2)',
    bodyTemp: 'शरीर का तापमान',
    bodyWeight: 'वजन (किग्रा)',
    activePrescriptions: 'सक्रिय ई-प्रिस्क्रिप्शन और दवाइयां',
    dosage: 'मात्रा',
    frequency: 'समय',
    duration: 'अवधि',
    instructions: 'निर्देश',
    recentLabReports: 'जांच रिपोर्ट एवं परिणाम',
    testResult: 'जांच निष्कर्ष',
    referenceRange: 'सामान्य सीमा',
    normalStatus: 'सामान्य',
    borderlineStatus: 'सीमावर्ती',
    criticalStatus: 'आपात चेतावनी',
    elderModeToggle: 'सुगम मोड (वरिष्ठ नागरिक)',
    standardModeToggle: 'मानक दृश्य',
    bookAppointmentBtn: 'टेलीकंसल्टेशन समय बुक करें',
    cancelAppointmentBtn: 'अपॉइंटमेंट रद्द करें',
    joinVideoConsult: 'वीडियो कंसल्टेशन शुरू करें',
    logVitalsBtn: 'बीपी व शुगर दर्ज करें',
    systolicLabel: 'सिस्टोलिक (mmHg)',
    diastolicLabel: 'डायस्टोलिक (mmHg)',
    fastingGlucoseLabel: 'खाली पेट शुगर (mg/dL)',
    consultDoctorOnline: 'विशेषज्ञ डॉक्टर से सलाह लें',
    noAppointmentsMsg: 'वर्तमान में कोई सक्रिय अपॉइंटमेंट नहीं है। नीचे से स्लॉट बुक करें।',

    ashaPortalTitle: 'आशा कार्यकर्ता फील्ड कंसोल • ऑफलाइन सक्षम',
    fieldHomeVisits: 'प्राथमिकता गृह भ्रमण',
    highRiskPregnancy: 'उच्च जोखिम वाली गर्भवती महिला (ANC) निगरानी',
    ncdScreening: 'गैर-संचारी रोग (NCD) पंजीयन',
    dueTodayLabel: 'आज देय',
    overdueLabel: 'लंबित कार्य',
    upcomingLabel: 'आगामी भ्रमण',
    logVisitSubmit: 'गृह भ्रमण व स्वास्थ्य जांच दर्ज करें',
    householdRoster: 'परिवार सूची',
    syncWithHmis: 'सरकारी पोर्टल से सिंक करें',
    recordBpSugar: 'बीपी व शुगर मापें',
    referPatientBtn: 'मरीज को पीएचसी / सीएचसी रेफर करें',
    teleconsultQueueTitle: 'उप-केंद्र टेलीकंसल्टेशन कतार',
    subCenterTriage: 'सामुदायिक डिजिटल ट्राइएज',
    medicineRequestBtn: 'दवा मांग पत्र भेजें',
    clinicalNotesLabel: 'चिकित्सकीय निष्कर्ष व टिप्पणियां',

    doctorPortalTitle: 'विशेषज्ञ डॉक्टर टेलीमेडिसिन एवं रेफरल हब',
    liveTeleconsultTitle: 'सक्रिय टेलीकंसल्टेशन वीडियो कक्ष',
    issueRxBtn: 'डिजिटल ई-प्रिस्क्रिप्शन जारी करें',
    referSpecialistBtn: 'जिला अस्पताल रेफर करें',
    diagnosticOrderBtn: 'लैब जांच का आदेश दें',
    consultSummary: 'परामर्श सारांश',
    patientVitalsSummary: 'मरीज के लक्षण व स्वास्थ्य मापदंड',
    inCallStatus: 'वीडियो परामर्श जारी है',
    endCallBtn: 'कॉल समाप्त कर प्रिस्क्रिप्शन दें',
    facilityOpsTitle: 'अस्पताल परिचालन एवं बिस्तर उपलब्धता',
    bedTrackerTitle: 'लाइव बेड एवं आईसीयू ट्रैकर',
    icuBedsAvailable: 'वेंटिलेटर आईसीयू बेड उपलब्ध',
    generalBedsAvailable: 'सामान्य वार्ड बेड उपलब्ध',
    oxygenStatusAvailable: 'मेडिकल ऑक्सीजन उपलब्ध',
    dispatchAmbulanceBtn: '108 एम्बुलेंस तुरंत भेजें',
    etaMinutesLabel: 'पहुंचने का अनुमानित समय (मिनट)',

    dhoPortalTitle: 'जिला स्वास्थ्य अधिकारी (DHO) कमान केंद्र',
    districtEpidemicOverview: 'जिला स्वास्थ्य एवं महामारी निगरानी',
    highRiskMaternalMonitored: 'निगरानी में उच्च जोखिम माताएं',
    medicineStockRateLabel: 'आवश्यक दवा स्टॉक उपलब्धता',
    activeSurveillanceAlerts: 'सक्रिय बीमारी प्रकोप चेतावनी',
    issueDistrictDirective: 'सार्वजनिक स्वास्थ्य निर्देश जारी करें',
    exportDistrictReport: 'जिला रिपोर्ट डाउनलोड करें (PDF/Excel)',

    save: 'सुरक्षित करें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    submit: 'जमा करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    update: 'अपडेट करें',
    search: 'खोजें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि उत्पन्न हुई',
    success: 'सफलतापूर्वक संपन्न',
    retry: 'पुनः प्रयास करें',
    back: 'वापस',
    next: 'आगे',
    viewAll: 'सभी देखें',
    noDataFound: 'कोई रिकॉर्ड नहीं मिला',
    refresh: 'ताज़ा करें',
    confirm: 'पुष्टि करें',
    actions: 'क्रियाएं',
    status: 'स्थिति',
    date: 'तारीख',
    time: 'समय',
    filter: 'फ़िल्टर',
    reset: 'रीसेट',
    download: 'डाउनलोड',
    print: 'प्रिंट',
    export: 'निर्यात',
    copy: 'कॉपी करें',
    share: 'साझा करें',
    languageName: 'हिन्दी',
    helpline: 'टोल-फ्री हेल्पलाइन',
    details: 'विवरण देखें',
    verified: 'सत्यापित रिकॉर्ड',
    offlineMode: 'ऑफलाइन मोड सक्रिय',
    onlineMode: 'ऑनलाइन सिंक सक्रिय',
    syncPending: 'डेटा कतार में है',
    synced: 'सभी रिकॉर्ड सिंक हो गए',
    yes: 'हाँ',
    no: 'नहीं',

    emergencyModalTitle: 'महाराष्ट्र आपातकालीन चिकित्सा प्रतिक्रिया (108)',
    emergencyModalSubtitle: '24x7 तत्काल एम्बुलेंस एवं ट्रॉमा केयर ग्रिड',
    call108Now: '108 आपातकालीन कॉल करें',
    ambulanceDispatchedMsg: '108 एम्बुलेंस रवाना हो चुकी है! अनुमानित समय: 8 मिनट।',
    eta8MinsMsg: 'एम्बुलेंस रास्ते में है • अनुमानित समय: 8 मिनट',
    gpsTrackingActive: 'लाइव जीपीएस लोकेशन जुन्नर नियंत्रण केंद्र से साझा की गई है',
    nearestTraumaCenter: 'निकटतम ट्रॉमा सेंटर: जुन्नर ग्रामीण अस्पताल',
    firstAidInstructions: 'मरीज को शांत रखें, सिर ऊंचा रखें, तंग कपड़े ढीले करें, बेहोशी की हालत में पानी न दें।',
    loginSuccessMsg: 'सत्यापन सफलतापूर्वक संपन्न हुआ।',
    logoutSuccessMsg: 'कंसोल से साइन आउट हो गए।',
    vitalsLoggedMsg: 'नए स्वास्थ्य मापदंड दर्ज किए गए।',
    appointmentBookedMsg: 'डॉक्टर के साथ अपॉइंटमेंट की पुष्टि हो गई।',
    offlineQueuedMsg: 'ऑफलाइन मोड सक्रिय — बदलाव स्थानीय रूप से सुरक्षित हैं।',
    onlineSyncedMsg: 'इंटरनेट कनेक्शन बहाल — डेटा सिंक हो गया।',
    resetDbSuccessMsg: 'स्थानीय डेटाबेस रीसेट कर दिया गया।'
  },

  or: {
    brandName: 'ସେତୁ (SETU)',
    brandSubtitle: 'ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ ସେବା ପ୍ରବେଶ ଓ ଡିଜିଟାଲ୍ ସମନ୍ୱୟ ମଞ୍ଚ',
    govHeader: 'ମହାରାଷ୍ଟ୍ର ସରକାର • ସାର୍ବଜନୀନ ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ପରିବାର କଲ୍ୟାଣ ବିଭାଗ',
    navHome: 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
    navFindCare: 'ଡାକ୍ତରଖାନା ଓ ଲ୍ୟାବ୍ ଖୋଜନ୍ତୁ',
    navSchemes: 'ସରକାରୀ ଯୋଜନା',
    navTriage: 'ଏଆଇ ଟ୍ରାଏଜ୍ ଓ ସାଥୀ',
    navEcosystem: 'ସ୍ୱାସ୍ଥ୍ୟ ଇକୋସିଷ୍ଟମ୍',
    navPortals: 'ଭୂମିକା ପୋର୍ଟାଲ୍',
    emergencyBtn: 'ଜରୁରୀକାଳୀନ ୧୦୮',
    onlineStatus: 'ଅନଲାଇନ୍ ମୋଡ୍',
    offlineStatus: 'ଅଫଲାଇନ୍ ମୋଡ୍ (ଆଶା ଡାଟା ସିଙ୍କ୍ ସକ୍ରିୟ)',
    switchRole: 'ଭୂମିକା ପରିବର୍ତ୍ତନ କରନ୍ତୁ',
    searchPlaceholder: 'ଓଡ଼ିଆ, ହିନ୍ଦୀ, ମରାଠୀ, ବଙ୍ଗାଳୀ, ଉର୍ଦ୍ଦୁ କିମ୍ବା ଇଂରାଜୀରେ ଲକ୍ଷଣ କୁହନ୍ତୁ...',
    askAiBtn: 'ସେତୁ ଏଆଇ କୁ ପଚାରନ୍ତୁ',
    findCareBtn: 'ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା / PHC ଖୋଜନ୍ତୁ',
    checkSchemesBtn: 'ଯୋଜନା ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ',
    roleLoginBtn: 'ଲଗଇନ୍ କରନ୍ତୁ',
    homeBtn: 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
    searchAbhaNav: 'ଆଭା / ରୋଗୀ ଖୋଜନ୍ତୁ',

    heroBadge: 'ମହାରାଷ୍ଟ୍ର ସରକାର PS:6133 ହେଲଥଟେକ୍ ପଦକ୍ଷେପ',
    heroTitle: 'ଗ୍ରାମ ଉପ-କେନ୍ଦ୍ରରୁ ଜିଲ୍ଲା ଡାକ୍ତରଖାନା ପର୍ଯ୍ୟନ୍ତ ସଂଯୁକ୍ତ ସ୍ୱାସ୍ଥ୍ୟ ବ୍ୟବସ୍ଥା',
    heroSubtitle: 'ଆରୋଗ୍ୟସଖୀ ଏଆଇ ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ, ସହାୟକ ଟେଲିକନସଲଟେସନ, ତୁରନ୍ତ ଡିଜିଟାଲ୍ ଟ୍ରାଏଜ୍, ବାସ୍ତବ ସମୟରେ ଔଷଧ ଉପଲବ୍ଧତା ଓ ସୁଗମ ରେଫରାଲ୍।',
    stat1Label: 'ସଂଯୁକ୍ତ ଉପ-କେନ୍ଦ୍ର ଏବଂ ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର',
    stat1Value: '୧୪,୨୮୦+',
    stat2Label: 'ହାରାହାରି ଟ୍ରାଏଜ୍ ଓ ଅପେକ୍ଷା ସମୟ',
    stat2Value: '୪.୨ ମିନିଟ୍',
    stat3Label: 'ଆବଶ୍ୟକୀୟ ଔଷଧ ଉପଲବ୍ଧତା ହାର',
    stat3Value: '୯୧.୮%',
    stat4Label: 'ସଫଳତାର ସହ ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଥିବା ରେଫରାଲ୍',
    stat4Value: '୮୮.୪%',

    aiTitle: 'ଆରୋଗ୍ୟସଖୀ — ଏଆଇ ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ',
    aiSubtitle: 'ବହୁଭାଷୀ ଚିକିତ୍ସା ମାର୍ଗଦର୍ଶନ ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ ନେଭିଗେସନ୍',
    aiGreeting: 'ନମସ୍କାର! ମୁଁ ସେତୁ ଆରୋଗ୍ୟସଖୀ, ଆପଣଙ୍କ ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ। ଆପଣଙ୍କ ଲକ୍ଷଣ କୁହନ୍ତୁ, ସରକାରୀ ଯୋଜନା ବିଷୟରେ ଜାଣନ୍ତୁ କିମ୍ବା ଡାକ୍ତରଖାନା ଖୋଜନ୍ତୁ।',
    quickSymptoms: 'ଲୋକପ୍ରିୟ ପ୍ରଶ୍ନ:',
    symptom1: '୩ ଦିନ ଧରି ପ୍ରବଳ ଜ୍ୱର ଓ ଥଣ୍ଡା',
    symptom2: 'ଛାତିର ବାମ ପଟେ ଯନ୍ତ୍ରଣା ଏବଂ ପ୍ରବଳ ଝାଳ',
    symptom3: 'ଜନନୀ ଶିଶୁ ସୁରକ୍ଷା ଯୋଜନାରେ ମାଗଣା ପ୍ରସବ',
    symptom4: 'PHC ରେ ପାରାସିଟାମଲ୍ ଓ ଇନସୁଲିନ୍ ଷ୍ଟକ୍ ଯାଞ୍ଚ କରନ୍ତୁ',
    inputPlaceholder: 'ଆପଣଙ୍କ ଲକ୍ଷଣ ଲେଖନ୍ତୁ କିମ୍ବା କୁହନ୍ତୁ...',
    sendBtn: 'ପଚାରନ୍ତୁ',
    listeningBtn: 'ଶୁଣୁଛି...',
    voiceBtn: 'ଓଡ଼ିଆରେ କୁହନ୍ତୁ',
    disclaimer: 'ସୂଚନା: ଆରୋଗ୍ୟସଖୀ ସରକାରୀ ଟ୍ରାଏଜ୍ ପ୍ରୋଟୋକଲ୍ ଉପରେ ଆଧାରିତ ମାର୍ଗଦର୍ଶନ ପ୍ରଦାନ କରେ। ଜରୁରୀକାଳୀନ ପରିସ୍ଥିତିରେ ତୁରନ୍ତ ୧୦୮ କୁ କଲ୍ କରନ୍ତୁ।',
    aiEngineConfig: 'ଏଆଇ ଇଞ୍ଜିନ୍',
    bhashiniVoiceTag: 'ଭାଷିଣୀ ଏଆଇ ଭଏସ୍',

    careFinderTitle: 'ଆପଣଙ୍କ ନିକଟସ୍ଥ ସରକାରୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ଖୋଜନ୍ତୁ',
    careFinderSubtitle: 'ଉପ-କେନ୍ଦ୍ର, PHC, ଗ୍ରାମୀଣ ଡାକ୍ତରଖାନା ଏବଂ ଜିଲ୍ଲା ଡାକ୍ତରଖାନାରେ ଖାଲି ବେଡ୍, ଡାକ୍ତର ଓ ଔଷଧ ସ୍ଥିତି ଦେଖନ୍ତୁ।',
    filterAll: 'ସମସ୍ତ ସୁବିଧା',
    filterPHC: 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (PHC)',
    filterSubCentre: 'ଆୟୁଷ୍ମାନ ଆରୋଗ୍ୟ ମନ୍ଦିର (ଉପ-କେନ୍ଦ୍ର)',
    filterHospital: 'ଉପ-ଜିଲ୍ଲା ଓ ଜିଲ୍ଲା ଡାକ୍ତରଖାନା',
    filterLabs: 'ସରକାରୀ ନିଦାନ ଲ୍ୟାବ୍',
    bedAvailable: 'ଉପଲବ୍ଧ ବେଡ୍',
    teleconsultActive: 'ଟେଲିକନସଲଟେସନ ସକ୍ରିୟ',
    medicineStock: 'ଔଷଧ ଷ୍ଟକ୍ ହାର',
    callFacility: 'ସମ୍ପର୍କ କରନ୍ତୁ',
    viewDetails: 'ସେବା ଏବଂ ଧାଡ଼ି ସ୍ଥିତି ଦେଖନ୍ତୁ',

    schemeTitle: 'ସରକାରୀ ସ୍ୱାସ୍ଥ୍ୟ ଯୋଜନା ଓ ଆର୍ଥିକ ସୁରକ୍ଷା',
    schemeSubtitle: '୧୦୦% ମାଗଣା କ୍ୟାସଲେସ ସ୍ୱାସ୍ଥ୍ୟ ଯୋଜନା। ଆପଣଙ୍କ ଯୋଗ୍ୟତା, କାଗଜପତ୍ର ଏବଂ ଡାକ୍ତରଖାନା ତାଲିକା ଦେଖନ୍ତୁ।',
    coverageTag: 'କ୍ୟାସଲେସ ଲାଭ',
    checkEligibility: 'ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ',
    schemeMjpjay: 'ମହାତ୍ମା ଜ୍ୟୋତିରାଓ ଫୁଲେ ଜନ ଆରୋଗ୍ୟ ଯୋଜନା (MJPJAY)',
    schemePmmvy: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ମାତୃ ବନ୍ଦନା ଯୋଜନା (PMMVY)',
    schemeJssk: 'ଜନନୀ ଶିଶୁ ସୁରକ୍ଷା କାର୍ଯ୍ୟକ୍ରମ (JSSK)',

    abhaMakerTitle: 'ଆପଣଙ୍କ ଆୟୁଷ୍ମାନ ଭାରତ ହେଲଥ୍ ଆକାଉଣ୍ଟ (ABHA) ତିଆରି କରନ୍ତୁ',
    abhaMakerSubtitle: 'ଡିଜିଟାଲ୍ QR କୋଡ୍ ଯାଞ୍ଚ ସହିତ ୧୪-ଅଙ୍କ ବିଶିଷ୍ଟ ଅଫିସିଆଲ୍ ଆଭା କାର୍ଡ ତୁରନ୍ତ ପାଆନ୍ତୁ।',
    abhaInputPlaceholder: '୧୨-ଅଙ୍କ ବିଶିଷ୍ଟ ଆଧାର ନମ୍ବର କିମ୍ବା ମୋବାଇଲ୍ ନମ୍ବର ଦିଅନ୍ତୁ...',
    generateAbhaCard: 'ଆଭା କାର୍ଡ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
    instantQrCode: 'ତୁରନ୍ତ QR ହେଲଥ୍ ID',
    downloadCard: 'ଆଭା କାର୍ଡ ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
    healthAdvisoryTitle: 'ସାର୍ବଜନୀନ ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ ଏବଂ ସମୁଦାୟ କଲ୍ୟାଣ',
    healthAdvisorySubtitle: 'ପ୍ରମାଣିତ ପ୍ରତିଷେଧକ ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ, ଋତୁକାଳୀନ ରୋଗ ଚେତାବନୀ ଏବଂ ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ ଯତ୍ନ।',
    readArticle: 'ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣୀ ପଢନ୍ତୁ',

    rolePortalsTitle: 'କାର୍ଯ୍ୟକ୍ଷମ ଭୂମିକା ପୋର୍ଟାଲ୍',
    rolePortalsSubtitle: 'ରୋଗୀ, ଆଶା କର୍ମୀ, ଚିକିତ୍ସା ଅଧିକାରୀ, ବିଶେଷଜ୍ଞ, ଫାର୍ମାସିଷ୍ଟ ଏବଂ ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ଅଧିକାରୀଙ୍କ ସମନ୍ୱୟ।',
    openPortal: 'ପୋର୍ଟାଲ୍ ଖୋଲନ୍ତୁ',
    authorizedConsoles: 'ମୁଖ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ କନସୋଲ୍',
    supportingConsoles: 'ସହାୟକ ଚିକିତ୍ସା କନସୋଲ୍',
    role_patient: 'ରୋଗୀ / ନାଗରିକ',
    role_asha: 'ଆଶା କର୍ମୀ (ASHA)',
    role_cho: 'ସାମୁଦାୟିକ ସ୍ୱାସ୍ଥ୍ୟ ଅଧିକାରୀ (CHO/MO)',
    role_doctor: 'ବିଶେଷଜ୍ଞ ଡାକ୍ତର',
    role_pharmacist: 'ଫାର୍ମାସିଷ୍ଟ (ଔଷଧ ନିର୍ମାତା)',
    role_lab: 'ଲ୍ୟାବ୍ ଟେକ୍ନିସିଆନ୍',
    role_facility: 'ଡାକ୍ତରଖାନା ସଂଯୋଜକ (Coordinator)',
    role_dho: 'ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ଅଧିକାରୀ (DHO)',

    patientPortalTitle: 'ନାଗରିକ ଡିଜିଟାଲ୍ ହେଲଥ୍ ଲକର୍ ଓ ଟେଲିକନସଲଟେସନ ହବ୍',
    vitalsOverview: 'ସର୍ବଶେଷ ସ୍ୱାସ୍ଥ୍ୟ ମାପଦଣ୍ଡ',
    bloodPressure: 'ରକ୍ତଚାପ (BP)',
    pulseRate: 'ନାଡ଼ି ସ୍ପନ୍ଦନ (Pulse)',
    oxygenSaturation: 'ଅକ୍ସିଜେନ୍ ସ୍ତର (SpO2)',
    bodyTemp: 'ଶରୀରର ତାପମାତ୍ରା',
    bodyWeight: 'ଓଜନ (କିଲୋଗ୍ରାମ)',
    activePrescriptions: 'ସକ୍ରିୟ ଇ-ପ୍ରେସକ୍ରିପସନ୍ ଏବଂ ଔଷଧ',
    dosage: 'ପରିମାଣ',
    frequency: 'ସମୟ',
    duration: 'ଅବଧି',
    instructions: 'ନିର୍ଦ୍ଦେଶାବଳୀ',
    recentLabReports: 'ନିଦାନ ପରୀକ୍ଷା ରିପୋର୍ଟ',
    testResult: 'ପରୀକ୍ଷା ଫଳାଫଳ',
    referenceRange: 'ସାଧାରଣ ସୀମା',
    normalStatus: 'ସାଧାରଣ',
    borderlineStatus: 'ସୀମାବର୍ତ୍ତୀ',
    criticalStatus: 'ଜରୁରୀ ସତର୍କତା',
    elderModeToggle: 'ସୁଗମ ମୋଡ୍ (ବରିଷ୍ଠ ନାଗରିକ)',
    standardModeToggle: 'ସାଧାରଣ ଦୃଶ୍ୟ',
    bookAppointmentBtn: 'ଟେଲିକନସଲଟେସନ ସମୟ ନିର୍ଦ୍ଧାରଣ କରନ୍ତୁ',
    cancelAppointmentBtn: 'ଆପଏଣ୍ଟମେଣ୍ଟ ବାତିଲ କରନ୍ତୁ',
    joinVideoConsult: 'ଭିଡିଓ ପରାମର୍ଶ ଆରମ୍ଭ କରନ୍ତୁ',
    logVitalsBtn: 'ରକ୍ତଚାପ ଓ ସୁଗାର୍ ରେକର୍ଡ କରନ୍ତୁ',
    systolicLabel: 'ସିଷ୍ଟୋଲିକ୍ (mmHg)',
    diastolicLabel: 'ଡାୟାଷ୍ଟୋଲିକ୍ (mmHg)',
    fastingGlucoseLabel: 'ଫାଷ୍ଟିଂ ବ୍ଲଡ୍ ସୁଗାର୍ (mg/dL)',
    consultDoctorOnline: 'ବିଶେଷଜ୍ଞ ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ',
    noAppointmentsMsg: 'ବର୍ତ୍ତମାନ କୌଣସି ଆପଏଣ୍ଟମେଣ୍ଟ ନାହିଁ। ତଳେ ଥିବା ବଟନରୁ ବୁକ୍ କରନ୍ତୁ।',

    ashaPortalTitle: 'ଆଶା କର୍ମୀ ଫିଲ୍ଡ କନସୋଲ୍ • ଅଫଲାଇନ୍ ସକ୍ଷମ',
    fieldHomeVisits: 'ପ୍ରାଥମିକତା ଗୃହ ପରିଦର୍ଶନ',
    highRiskPregnancy: 'ଉଚ୍ଚ-ବିପଦ ଗର୍ଭବତୀ (ANC) ତଦାରଖ',
    ncdScreening: 'ଅସଂକ୍ରାମକ ରୋଗ (NCD) ରେଜିଷ୍ଟ୍ରି',
    dueTodayLabel: 'ଆଜି ଦେୟ',
    overdueLabel: 'ବକେୟା କାର୍ଯ୍ୟ',
    upcomingLabel: 'ଆଗାମୀ ପରିଦର୍ଶନ',
    logVisitSubmit: 'ପରିଦର୍ଶନ ତଥ୍ୟ ଦାଖଲ କରନ୍ତୁ',
    householdRoster: 'ପରିବାର ତାଲିକା',
    syncWithHmis: 'HMIS ସହ ସିଙ୍କ୍ କରନ୍ତୁ',
    recordBpSugar: 'BP ଓ ସୁଗାର୍ ମାପନ୍ତୁ',
    referPatientBtn: 'ରୋଗୀଙ୍କୁ PHC/CHC କୁ ରେଫର୍ କରନ୍ତୁ',
    teleconsultQueueTitle: 'ଉପ-କେନ୍ଦ୍ର ଟେଲିକନସଲଟେସନ ଧାଡ଼ି',
    subCenterTriage: 'ସାମୁଦାୟିକ ଡିଜିଟାଲ୍ ଟ୍ରାଏଜ୍',
    medicineRequestBtn: 'ଔଷଧ ଚାହିଦା ପତ୍ର ପଠାନ୍ତୁ',
    clinicalNotesLabel: 'ଚିକିତ୍ସା ନିରୀକ୍ଷଣ ଏବଂ ଟିପ୍ପଣୀ',

    doctorPortalTitle: 'ବିଶେଷଜ୍ଞ ଟେଲିମେଡିସିନ୍ ଓ ରେଫରାଲ୍ ହବ୍',
    liveTeleconsultTitle: 'ଲାଇଭ୍ ଟେଲିକନସଲଟେସନ ଭିଡିଓ କକ୍ଷ',
    issueRxBtn: 'ଇ-ପ୍ରେସକ୍ରିପସନ୍ ପ୍ରଦାନ କରନ୍ତୁ',
    referSpecialistBtn: 'ଜିଲ୍ଲା ଡାକ୍ତରଖାନାକୁ ରେଫର୍ କରନ୍ତୁ',
    diagnosticOrderBtn: 'ଲ୍ୟାବ୍ ପରୀକ୍ଷା ନିର୍ଦ୍ଦେଶ ଦିଅନ୍ତୁ',
    consultSummary: 'ପରାମର୍ଶ ସାରାଂଶ',
    patientVitalsSummary: 'ରୋଗୀଙ୍କ ଲକ୍ଷଣ ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ ମାପଦଣ୍ଡ',
    inCallStatus: 'ଭିଡିଓ ପରାମର୍ଶ ଚାଲୁଅଛି',
    endCallBtn: 'କଲ୍ ସମାପ୍ତ କରି ପ୍ରେସକ୍ରିପସନ୍ ଦିଅନ୍ତୁ',
    facilityOpsTitle: 'ଡାକ୍ତରଖାନା ପରିଚାଳନା ଓ ବେଡ୍ ଉପଲବ୍ଧତା',
    bedTrackerTitle: 'ଲାଇଭ୍ ବେଡ୍ ଏବଂ ICU ଟ୍ରାକର୍',
    icuBedsAvailable: 'ଭେଣ୍ଟିଲେଟର ICU ବେଡ୍ ଉପଲବ୍ଧ',
    generalBedsAvailable: 'ସାଧାରଣ ୱାର୍ଡ ବେଡ୍ ଉପଲବ୍ଧ',
    oxygenStatusAvailable: 'ମେଡିକାଲ୍ ଅକ୍ସିଜେନ୍ ଉପଲବ୍ଧ',
    dispatchAmbulanceBtn: '୧୦୮ ଆମ୍ବୁଲାନ୍ସ ତୁରନ୍ତ ପଠାନ୍ତୁ',
    etaMinutesLabel: 'ପହଞ୍ଚିବାର ଆନୁମାନିକ ସମୟ (ମିନିଟ୍)',

    dhoPortalTitle: 'ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ଅଧିକାରୀ (DHO) ନିୟନ୍ତ୍ରଣ କକ୍ଷ',
    districtEpidemicOverview: 'ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ମହାମାରୀ ନିରୀକ୍ଷଣ',
    highRiskMaternalMonitored: 'ତଦାରଖରେ ଥିବା ଗର୍ଭବତୀ ମହିଳା',
    medicineStockRateLabel: 'ଆବଶ୍ୟକୀୟ ଔଷଧ ଷ୍ଟକ୍ ହାର',
    activeSurveillanceAlerts: 'ସକ୍ରିୟ ରୋଗ ପ୍ରକୋପ ସତର୍କତା',
    issueDistrictDirective: 'ସାର୍ବଜନୀନ ନିର୍ଦ୍ଦେଶନାମା ଜାରି କରନ୍ତୁ',
    exportDistrictReport: 'ଜିଲ୍ଲା ରିପୋର୍ଟ ଡାଉନଲୋଡ୍ କରନ୍ତୁ (PDF/Excel)',

    save: 'ସଂରକ୍ଷଣ କରନ୍ତୁ',
    cancel: 'ବାତିଲ କରନ୍ତୁ',
    close: 'ବନ୍ଦ କରନ୍ତୁ',
    submit: 'ଦାଖଲ କରନ୍ତୁ',
    delete: 'ଡିଲିଟ୍ କରନ୍ତୁ',
    edit: 'ସମ୍ପାଦନ କରନ୍ତୁ',
    update: 'ଅପଡେଟ୍ କରନ୍ତୁ',
    search: 'ଖୋଜନ୍ତୁ',
    loading: 'ଲୋଡ୍ ହେଉଛି...',
    error: 'ତ୍ରୁଟି ଦେଖାଦେଲା',
    success: 'କାର୍ଯ୍ୟ ସଫଳ ହେଲା',
    retry: 'ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ',
    back: 'ପଛକୁ',
    next: 'ଆଗକୁ',
    viewAll: 'ସମସ୍ତ ଦେଖନ୍ତୁ',
    noDataFound: 'କୌଣସି ତଥ୍ୟ ମିଳିଲା ନାହିଁ',
    refresh: 'ତାଜା କରନ୍ତୁ',
    confirm: 'ନିଶ୍ଚିତ କରନ୍ତୁ',
    actions: 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ',
    status: 'ସ୍ଥିତି',
    date: 'ତାରିଖ',
    time: 'ସମୟ',
    filter: 'ଫିଲ୍ଟର୍',
    reset: 'ରିସେଟ୍',
    download: 'ଡାଉନଲୋଡ୍',
    print: 'ପ୍ରିଣ୍ଟ୍',
    export: 'ଏକ୍ସପୋର୍ଟ',
    copy: 'କପି କରନ୍ତୁ',
    share: 'ସେୟାର୍ କରନ୍ତୁ',
    languageName: 'ଓଡ଼ିଆ',
    helpline: 'ଟୋଲ୍-ଫ୍ରି ହେଲ୍ପଲାଇନ୍',
    details: 'ବିବରଣୀ ଦେଖନ୍ତୁ',
    verified: 'ପ୍ରମାଣିତ ରେକର୍ଡ',
    offlineMode: 'ଅଫଲାଇନ୍ ମୋଡ୍ ସକ୍ରିୟ',
    onlineMode: 'ଅନଲାଇନ୍ ସିଙ୍କ୍ ସକ୍ରିୟ',
    syncPending: 'ଡାଟା ଧାଡ଼ିରେ ଅଛି',
    synced: 'ସମସ୍ତ ଡାଟା ସିଙ୍କ୍ ହୋଇଛି',
    yes: 'ହଁ',
    no: 'ନାହିଁ',

    emergencyModalTitle: 'ମହାରାଷ୍ଟ୍ର ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା ପ୍ରତିକ୍ରିୟା (୧୦୮)',
    emergencyModalSubtitle: '୨୪x୭ ଜରୁରୀକାଳୀନ ଆମ୍ବୁଲାନ୍ସ ଏବଂ ଟ୍ରମା କେୟାର ଗ୍ରୀଡ୍',
    call108Now: '୧୦୮ କୁ କଲ୍ କରନ୍ତୁ',
    ambulanceDispatchedMsg: '୧୦୮ ଆମ୍ବୁଲାନ୍ସ ପଠାଗଲା! ପହଞ୍ଚିବା ସମୟ: ୮ ମିନିଟ୍।',
    eta8MinsMsg: 'ଆମ୍ବୁଲାନ୍ସ ବାଟରେ ଅଛି • ସମୟ: ୮ ମିନିଟ୍',
    gpsTrackingActive: 'ଲାଇଭ୍ GPS ଲୋକେସନ୍ ଜୁନ୍ନର ନିୟନ୍ତ୍ରଣ କେନ୍ଦ୍ର ସହିତ ସେୟାର୍ କରାଯାଇଛି',
    nearestTraumaCenter: 'ନିକଟସ୍ଥ ଟ୍ରମା ସେଣ୍ଟର୍: ଜୁନ୍ନର ଗ୍ରାମୀଣ ଡାକ୍ତରଖାନା',
    firstAidInstructions: 'ରୋଗୀଙ୍କୁ ଶାନ୍ତ ରଖନ୍ତୁ, ମୁଣ୍ଡ ଉପରକୁ ରଖନ୍ତୁ, ଚିପା ପୋଷାକ ଢିଲା କରନ୍ତୁ, ଅଚେତ ଥିଲେ ପାଣି ଦିଅନ୍ତୁ ନାହିଁ।',
    loginSuccessMsg: 'ପ୍ରମାଣୀକରଣ ସଫଳ ହେଲା।',
    logoutSuccessMsg: 'କନସୋଲ୍ ରୁ ସାଇନ୍ ଆଉଟ୍ ହେଲେ।',
    vitalsLoggedMsg: 'ନୂତନ ସ୍ୱାସ୍ଥ୍ୟ ମାପଦଣ୍ଡ ରେକର୍ଡ ହେଲା।',
    appointmentBookedMsg: 'ଡାକ୍ତରଙ୍କ ସହ ଆପଏଣ୍ଟମେଣ୍ଟ ନିଶ୍ଚିତ ହେଲା।',
    offlineQueuedMsg: 'ଅଫଲାଇନ୍ ମୋଡ୍ ସକ୍ରିୟ — ତଥ୍ୟ ସ୍ଥାନୀୟ ଭାବରେ ସଂରକ୍ଷିତ।',
    onlineSyncedMsg: 'ଅନଲାଇନ୍ ସଂଯୋଗ ସ୍ଥାପିତ — ତଥ୍ୟ ସିଙ୍କ୍ ହେଲା।',
    resetDbSuccessMsg: 'ଡାଟାବେସ୍ ସଫଳତାର ସହ ରିସେଟ୍ ହେଲା।'
  },

  bn: {
    brandName: 'সেতু (SETU)',
    brandSubtitle: 'গ্রামীণ স্বাস্থ্যসেবা অ্যাক্সেস ও ডিজিটাল সমন্বয় প্ল্যাটফর্ম',
    govHeader: 'মহারাষ্ট্র সরকার • জনস্বাস্থ্য ও পরিবার কল্যাণ বিভাগ',
    navHome: 'হোম',
    navFindCare: 'হাসপাতাল ও ল্যাব খুঁজুন',
    navSchemes: 'সরকারি প্রকল্প',
    navTriage: 'এআই ট্রায়াজ ও সাথী',
    navEcosystem: 'স্বাস্থ্য ইকোসিস্টেম',
    navPortals: 'রোল পোর্টাল',
    emergencyBtn: 'জরুরি ১০৮',
    onlineStatus: 'অনলাইন মোড',
    offlineStatus: 'অফলাইন মোড (আশা ডেটা সিঙ্ক সক্রিয়)',
    switchRole: 'ভূমিকা পরিবর্তন করুন',
    searchPlaceholder: 'বাংলা, হিন্দি, মারাঠি, ওড়িয়া, উর্দু বা ইংরেজিতে লক্ষণ বলুন বা ওষুধ খুঁজুন...',
    askAiBtn: 'সেতু এআই-কে জিজ্ঞাসা করুন',
    findCareBtn: 'নিকটতম হাসপাতাল / পিএইচসি খুঁজুন',
    checkSchemesBtn: 'প্রকল্পের যোগ্যতা পরীক্ষা করুন (MJPJAY)',
    roleLoginBtn: 'ভূমিকা লগইন',
    homeBtn: 'হোম',
    searchAbhaNav: 'আভা / রোগী খুঁজুন',

    heroBadge: 'মহারাষ্ট্র সরকার PS:6133 হেলথটেক উদ্যোগ',
    heroTitle: 'গ্রামের উপ-কেন্দ্র থেকে জেলা হাসপাতাল পর্যন্ত সংযুক্ত স্বাস্থ্যসেবা',
    heroSubtitle: 'আরোগ্যসখী এআই স্বাস্থ্য সাথী, সহায়ক টেলিকনসাল্টেশন, তাৎক্ষণিক ডিজিটাল ট্রায়াজ, রিয়েল-টাইম ওষুধ প্রাপ্যতা এবং মসৃণ রেফারেল ব্যবস্থা।',
    stat1Label: 'সংযুক্ত উপ-কেন্দ্র ও প্রাথমিক স্বাস্থ্য কেন্দ্র',
    stat1Value: '১৪,২৮০+',
    stat2Label: 'গড় ট্রায়াজ ও অপেক্ষার সময়',
    stat2Value: '৪.২ মিনিট',
    stat3Label: 'প্রয়োজনীয় ওষুধের প্রাপ্যতা হার',
    stat3Value: '৯১.৮%',
    stat4Label: 'সফলভাবে সম্পন্ন রেফারেল',
    stat4Value: '৮৮.৪%',

    aiTitle: 'আরোগ্যসখী — এআই স্বাস্থ্য সাথী',
    aiSubtitle: 'মহারাষ্ট্রের জন্য বহুভাষিক চিকিৎসাগত দিকনির্দেশনা ও স্বাস্থ্য নেভিগেশন',
    aiGreeting: 'নমস্কার! আমি সেতু আরোগ্যসখী, আপনার ডিজিটাল স্বাস্থ্য সঙ্গী। আপনার লক্ষণ বর্ণনা করুন, সরকারি প্রকল্প সম্পর্কে জানুন বা হাসপাতাল খুঁজুন।',
    quickSymptoms: 'জনপ্রিয় প্রশ্ন:',
    symptom1: '৩ দিন ধরে তীব্র জ্বর ও কাঁপুনি',
    symptom2: 'বুকে তীব্র ব্যথা ও শ্বাসকষ্ট',
    symptom3: 'জননী শিশু সুরক্ষা প্রকল্পে বিনামূল্যে প্রসব',
    symptom4: 'পিএইচসি-তে প্যারাসিটামল ও ইনসুলিন স্টক চেক করুন',
    inputPlaceholder: 'আপনার লক্ষণ লিখুন বা বাংলায় বলুন...',
    sendBtn: 'জিজ্ঞাসা করুন',
    listeningBtn: 'শুনছি...',
    voiceBtn: 'বাংলায় বলুন',
    disclaimer: 'সতর্কতা: আরোগ্যসখী সরকারি ট্রায়াজ প্রোটোকলের ভিত্তিতে প্রাথমিক পরামর্শ প্রদান করে। গুরুতর পরিস্থিতিতে অবিলম্বে ১০৮ নম্বরে কল করুন।',
    aiEngineConfig: 'এআই ইঞ্জিন',
    bhashiniVoiceTag: 'ভাষিণী এআই ভয়েস',

    careFinderTitle: 'আপনার নিকটবর্তী সরকারি স্বাস্থ্যকেন্দ্র খুঁজুন',
    careFinderSubtitle: 'উপ-কেন্দ্র, পিএইচসি, গ্রামীণ ও জেলা হাসপাতালে খালি বেড, ডাক্তার ও ওষুধের অবস্থা দেখুন।',
    filterAll: 'সব সুবিধা',
    filterPHC: 'প্রাথমিক স্বাস্থ্য কেন্দ্র (PHC)',
    filterSubCentre: 'আয়ুষ্মান আরোগ্য মন্দির (উপ-কেন্দ্র)',
    filterHospital: 'উপ-জেলা ও জেলা হাসপাতাল',
    filterLabs: 'সরকারি ডায়াগনস্টিক ল্যাব',
    bedAvailable: 'উপলব্ধ বেড',
    teleconsultActive: 'টেলিকনসাল্টেশন সক্রিয়',
    medicineStock: 'ওষুধ স্টক হার',
    callFacility: 'যোগাযোগ করুন',
    viewDetails: 'পরিষেবা ও ওপিডি কিউ দেখুন',

    schemeTitle: 'সরকারি স্বাস্থ্য প্রকল্প ও আর্থিক সুরক্ষা',
    schemeSubtitle: 'মহারাষ্ট্রের ১০০% ক্যাশলেস স্বাস্থ্য প্রকল্প। আপনার যোগ্যতা, প্রয়োজনীয় নথি ও তালিকাভুক্ত হাসপাতাল দেখুন।',
    coverageTag: 'ক্যাশলেস সুবিধা',
    checkEligibility: 'যোগ্যতা ও নথি পরীক্ষা করুন',
    schemeMjpjay: 'মহাত্মা জ্যোতিরাও ফুলে জন আরোগ্য যোজনা (MJPJAY)',
    schemePmmvy: 'প্রধানমন্ত্রী মাতৃ বন্দনা যোজনা (PMMVY)',
    schemeJssk: 'জননী শিশু সুরক্ষা কার্যক্রম (JSSK)',

    abhaMakerTitle: 'আপনার আয়ুষ্মান ভারত হেলথ অ্যাকাউন্ট (ABHA) তৈরি করুন',
    abhaMakerSubtitle: 'ডিজিটাল কিউআর কোড যাচাইকরণ সহ আপনার ১৪-সংখ্যার অফিশিয়াল আভা কার্ড সাথে সাথে পান।',
    abhaInputPlaceholder: '১২-সংখ্যার আধার নম্বর অথবা মোবাইল নম্বর লিখুন...',
    generateAbhaCard: 'আভা কার্ড তৈরি করুন',
    instantQrCode: 'তাৎক্ষণিক কিউআর হেলথ আইডি',
    downloadCard: 'আভা কার্ড ডাউনলোড করুন',
    healthAdvisoryTitle: 'জনস্বাস্থ্য পরামর্শ ও সম্প্রদায় কল্যাণ',
    healthAdvisorySubtitle: 'যাচাইকৃত স্বাস্থ্যবিধি, মৌসুমী রোগের সতর্কতা এবং মা ও শিশুর যত্ন সংক্রান্ত নির্দেশিকা।',
    readArticle: 'সম্পূর্ণ বিবরণ পড়ুন',

    rolePortalsTitle: 'অপারেশনাল রোল পোর্টাল (একটি সমন্বিত নেটওয়ার্ক)',
    rolePortalsSubtitle: 'রোগী, আশা কর্মী, মেডিকেল অফিসার, বিশেষজ্ঞ, ফার্মাসিস্ট এবং জেলা স্বাস্থ্য কর্মকর্তার সমন্বয়।',
    openPortal: 'পোর্টাল খুলুন',
    authorizedConsoles: 'অনুমোদিত প্রাথমিক স্বাস্থ্য কনসোল',
    supportingConsoles: 'সহায়ক চিকিৎসা কনসোল',
    role_patient: 'রোগী / নাগরিক',
    role_asha: 'আশা কর্মী (ASHA)',
    role_cho: 'কমিউনিটি হেলথ অফিসার (CHO/MO)',
    role_doctor: 'বিশেষজ্ঞ চিকিৎসক',
    role_pharmacist: 'ফার্মাসিস্ট (ওষুধ বিশেষজ্ঞ)',
    role_lab: 'ল্যাব টেকনিশিয়ান',
    role_facility: 'হাসপাতাল সমন্বয়কারী',
    role_dho: 'জেলা স্বাস্থ্য কর্মকর্তা (DHO)',

    patientPortalTitle: 'নাগরিক ডিজিটাল হেলথ লকার ও টেলিমেডিসিন হাব',
    vitalsOverview: 'সর্বশেষ স্বাস্থ্য পরিমাপ',
    bloodPressure: 'রক্তচাপ (BP)',
    pulseRate: 'নাড়ির গতি (Pulse)',
    oxygenSaturation: 'রক্তে অক্সিজেন (SpO2)',
    bodyTemp: 'শরীরের তাপমাত্রা',
    bodyWeight: 'ওজন (কেজি)',
    activePrescriptions: 'বর্তমান ই-প্রেসক্রিপশন ও ওষুধ',
    dosage: 'মাত্রা',
    frequency: 'সময়সূচী',
    duration: 'মেয়াদ',
    instructions: 'নির্দেশনা',
    recentLabReports: 'ডায়াগনস্টিক রিপোর্ট ও ফলাফল',
    testResult: 'পরীক্ষার ফলাফল',
    referenceRange: 'স্বাভাবিক মাত্রা',
    normalStatus: 'স্বাভাবিক',
    borderlineStatus: 'সীমান্তবর্তী',
    criticalStatus: 'জরুরি সতর্কতা',
    elderModeToggle: 'সহজ মোড (বয়স্ক নাগরিকদের জন্য)',
    standardModeToggle: 'সাধারণ দৃশ্য',
    bookAppointmentBtn: 'টেলিকনসাল্টেশনের সময় বুক করুন',
    cancelAppointmentBtn: 'অ্যাপয়েন্টমেন্ট বাতিল করুন',
    joinVideoConsult: 'ভিডিও পরামর্শ শুরু করুন',
    logVitalsBtn: 'রক্তচাপ ও সুগার রেকর্ড করুন',
    systolicLabel: 'সিস্টোলিক (mmHg)',
    diastolicLabel: 'ডায়াস্টোলিক (mmHg)',
    fastingGlucoseLabel: 'ফাস্টিং ব্লাড সুগার (mg/dL)',
    consultDoctorOnline: 'বিশেষজ্ঞ ডাক্তারের সাথে পরামর্শ করুন',
    noAppointmentsMsg: 'বর্তমানে কোনো অ্যাপয়েন্টমেন্ট নির্ধারিত নেই। নিচে থেকে স্লট বুক করুন।',

    ashaPortalTitle: 'আশা কর্মী ফিল্ড কনসোল • অফলাইন সমর্থিত',
    fieldHomeVisits: 'অগ্রাধিকার ভিত্তিক হোম ভিজিট',
    highRiskPregnancy: 'উচ্চ ঝুঁকিপূর্ণ গর্ভবতী (ANC) নজরদারি',
    ncdScreening: 'অসংক্রামক রোগ (NCD) তালিকা',
    dueTodayLabel: 'আজকের নির্ধারিত',
    overdueLabel: 'বকেয়া কাজ',
    upcomingLabel: 'আসন্ন ভিজিট',
    logVisitSubmit: 'হোম ভিজিট ও স্বাস্থ্য তথ্য জমা দিন',
    householdRoster: 'পরিবার তালিকা',
    syncWithHmis: 'HMIS-এর সাথে ডেটা সিঙ্ক করুন',
    recordBpSugar: 'বিপি ও সুগার মাপুন',
    referPatientBtn: 'রোগীকে পিএইচসি/সিএইচসিতে পাঠান',
    teleconsultQueueTitle: 'উপ-কেন্দ্র টেলিকনসাল্টেশন কিউ',
    subCenterTriage: 'কমিউনিটি ডিজিটাল ট্রায়াজ',
    medicineRequestBtn: 'ওষুধের চাহিদা পত্র পাঠান',
    clinicalNotesLabel: 'চিকিৎসা পর্যবেক্ষণ ও মন্তব্য',

    doctorPortalTitle: 'বিশেষজ্ঞ টেলিমেডিসিন ও রেফারেল হাব',
    liveTeleconsultTitle: 'সক্রিয় টেলিকনসাল্টেশন ভিডিও রুম',
    issueRxBtn: 'ই-প্রেসক্রিপশন প্রদান করুন',
    referSpecialistBtn: 'জেলা হাসপাতালে রেফার করুন',
    diagnosticOrderBtn: 'ল্যাব পরীক্ষার নির্দেশ দিন',
    consultSummary: 'পরামর্শের সারসংক্ষেপ',
    patientVitalsSummary: 'রোগীর লক্ষণ ও স্বাস্থ্য পরিমাপ',
    inCallStatus: 'ভিডিও পরামর্শ চলছে',
    endCallBtn: 'কল শেষ করে প্রেসক্রিপশন দিন',
    facilityOpsTitle: 'হাসপাতাল পরিচালনা ও বেড প্রাপ্যতা',
    bedTrackerTitle: 'লাইভ বেড ও আইসিইউ ট্র্যাকার',
    icuBedsAvailable: 'ভেন্টিলেটর আইসিইউ বেড উপলব্ধ',
    generalBedsAvailable: 'সাধারণ ওয়ার্ডের বেড উপলব্ধ',
    oxygenStatusAvailable: 'মেডিকেল অক্সিজেন উপলব্ধ',
    dispatchAmbulanceBtn: '১০৮ অ্যাম্বুলেন্স অবিলম্বে পাঠান',
    etaMinutesLabel: 'পৌঁছানোর সম্ভাব্য সময় (মিনিট)',

    dhoPortalTitle: 'জেলা স্বাস্থ্য কর্মকর্তা (DHO) কমান্ড সেন্টার',
    districtEpidemicOverview: 'জেলা স্বাস্থ্য ও মহামারী নজরদারি',
    highRiskMaternalMonitored: 'নজরদারিতে থাকা উচ্চ ঝুঁকিপূর্ণ মা',
    medicineStockRateLabel: 'প্রয়োজনীয় ওষুধের স্টক হার',
    activeSurveillanceAlerts: 'সক্রিয় রোগ প্রাদুর্ভাবের সতর্কতা',
    issueDistrictDirective: 'জনস্বাস্থ্য নির্দেশিকা জারি করুন',
    exportDistrictReport: 'জেলা রিপোর্ট ডাউনলোড করুন (PDF/Excel)',

    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল করুন',
    close: 'বন্ধ করুন',
    submit: 'জমা দিন',
    delete: 'মুছে ফেলুন',
    edit: 'সম্পাদনা করুন',
    update: 'আপডেট করুন',
    search: 'অনুসন্ধান করুন',
    loading: 'লোড হচ্ছে...',
    error: 'ত্রুটি দেখা দিয়েছে',
    success: 'সফলভাবে সম্পন্ন হয়েছে',
    retry: 'পুনরায় চেষ্টা করুন',
    back: 'পেছনে',
    next: 'সামনে',
    viewAll: 'সব দেখুন',
    noDataFound: 'কোনো রেকর্ড পাওয়া যায়নি',
    refresh: 'রিফ্রেশ করুন',
    confirm: 'নিশ্চিত করুন',
    actions: 'পদক্ষেপ',
    status: 'অবস্থা',
    date: 'তারিখ',
    time: 'সময়',
    filter: 'ফিল্টার',
    reset: 'রিসেট',
    download: 'ডাউনলোড',
    print: 'প্রিন্ট',
    export: 'রপ্তানি',
    copy: 'কপি করুন',
    share: 'শেয়ার করুন',
    languageName: 'বাংলা',
    helpline: 'টোল-ফ্রি হেল্পলাইন',
    details: 'বিস্তারিত দেখুন',
    verified: 'যাচাইকৃত রেকর্ড',
    offlineMode: 'অফলাইন মোড সক্রিয়',
    onlineMode: 'অনলাইন সিঙ্ক সক্রিয়',
    syncPending: 'তথ্য অপেক্ষমাণ',
    synced: 'সব তথ্য সিঙ্ক হয়েছে',
    yes: 'হ্যাঁ',
    no: 'না',

    emergencyModalTitle: 'মহারাষ্ট্র জরুরি চিকিৎসা প্রতিক্রিয়া (১০৮)',
    emergencyModalSubtitle: '২৪x৭ জরুরি অ্যাম্বুলেন্স ও ট্রমা কেয়ার নেটওয়ার্ক',
    call108Now: '১০৮ জরুরি নম্বরে কল করুন',
    ambulanceDispatchedMsg: '১০৮ অ্যাম্বুলেন্স রওনা হয়েছে! আনুমানিক সময়: ৮ মিনিট।',
    eta8MinsMsg: 'অ্যাম্বুলেন্স আসছে • আনুমানিক সময়: ৮ মিনিট',
    gpsTrackingActive: 'লাইভ জিপিএস লোকেশন জুন্নার কন্ট্রোল রুমের সাথে শেয়ার করা হয়েছে',
    nearestTraumaCenter: 'নিকটতম ট্রমা সেন্টার: জুন্নার গ্রামীণ হাসপাতাল',
    firstAidInstructions: 'রোগীকে শান্ত রাখুন, মাথা উঁচু রাখুন, আঁটসাঁট পোশাক ঢিলে করুন, অচেতন থাকলে জল দেবেন না।',
    loginSuccessMsg: 'প্রমাণীকরণ সফল হয়েছে।',
    logoutSuccessMsg: 'কনসোল থেকে সাইন আউট সম্পন্ন হয়েছে।',
    vitalsLoggedMsg: 'নতুন স্বাস্থ্য পরিমাপ সফলভাবে রেকর্ড করা হয়েছে।',
    appointmentBookedMsg: 'ডাক্তারের সাথে অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে।',
    offlineQueuedMsg: 'অফলাইন মোড সক্রিয় — ডেটা স্থানীয়ভাবে সংরক্ষিত।',
    onlineSyncedMsg: 'অনলাইন সংযোগ পুনঃস্থাপিত — ডেটা সিঙ্ক হয়েছে।',
    resetDbSuccessMsg: 'স্থানীয় ডেটাবেস সফলভাবে রিসেট করা হয়েছে।'
  },

  ur: {
    brandName: 'سیتو (SETU)',
    brandSubtitle: 'دیہی صحت کی دیکھ بھال اور ڈیجیٹل کوآرڈینیشن پلیٹ فارم',
    govHeader: 'حکومت مہاراشٹر • محکمہ برائے صحت عامہ اور خاندانی بہبود',
    navHome: 'مرکزی صفحہ',
    navFindCare: 'ہسپتال اور لیب تلاش کریں',
    navSchemes: 'سرکاری اسکیمیں',
    navTriage: 'اے آئی ٹرائیج اور ساتھی',
    navEcosystem: 'ہیلتھ کیئر ایکو سسٹم',
    navPortals: 'رول پورٹلز',
    emergencyBtn: 'ایمرجنسی 108',
    onlineStatus: 'آن لائن موڈ',
    offlineStatus: 'آف لائن موڈ (آشا ڈیٹا سنک فعال)',
    switchRole: 'آپریشنل رول تبدیل کریں',
    searchPlaceholder: 'اردو، ہندی، مراٹھی، اوڈیا، بنگالی یا انگریزی میں اپنی علامات بتائیں...',
    askAiBtn: 'سیتو اے آئی سے پوچھیں',
    findCareBtn: 'قریبی ہسپتال / پی ایچ سی تلاش کریں',
    checkSchemesBtn: 'اسکیم کی اہلیت چیک کریں (MJPJAY)',
    roleLoginBtn: 'رول لاگ ان',
    homeBtn: 'مرکزی صفحہ',
    searchAbhaNav: 'آبھا / مریض تلاش کریں',

    heroBadge: 'حکومت مہاراشٹر PS:6133 ہیلتھ ٹیک پہل',
    heroTitle: 'دیہی ذیلی مرکز سے ضلعی ہسپتال تک مربوط صحت کا نظام',
    heroSubtitle: 'آروگیہ سکھی اے آئی ہیلتھ کمپینین، ٹیلی کنسلٹیشن، فوری ڈیجیٹل ٹرائیج، ادویات کی دستیابی اور بلاتعطل ریفرل کوآرڈینیشن۔',
    stat1Label: 'منسلک ذیلی مراکز اور بنیادی صحت کے مراکز',
    stat1Value: '14,280+',
    stat2Label: 'اوسط ٹرائیج اور انتظار کا وقت',
    stat2Value: '4.2 منٹ',
    stat3Label: 'ضروری ادویات کی دستیابی کی شرح',
    stat3Value: '91.8%',
    stat4Label: 'کامیابی کے ساتھ مکمل شدہ ریفرلز',
    stat4Value: '88.4%',

    aiTitle: 'آروگیہ سکھی — اے آئی ہیلتھ کمپینین',
    aiSubtitle: 'مہاراشٹر کے لیے کثیر لسانی طبی رہنمائی اور ہیلتھ نیویگیشن',
    aiGreeting: 'آداب! میں سیتو آروگیہ سکھی ہوں، آپ کی ڈیجیٹل صحت ساتھی۔ اپنی علامات بتائیں، مفت علاج کی تفصیلات حاصل کریں یا قریبی ہسپتال تلاش کریں۔',
    quickSymptoms: 'اکثر پوچھے جانے والے سوالات:',
    symptom1: '3 دن سے شدید بخار اور سردی لگنا',
    symptom2: 'سینے کے بائیں جانب شدید درد اور پسینہ',
    symptom3: 'جننی ششو سرکشا اسکیم کے تحت مفت زچگی',
    symptom4: 'پی ایچ سی میں پیراسیٹامول اور انسولین کا اسٹاک چیک کریں',
    inputPlaceholder: 'اپنی علامات لکھیں یا اردو میں بولیں...',
    sendBtn: 'پوچھیں',
    listeningBtn: 'سن رہا ہے...',
    voiceBtn: 'اردو میں بولیں',
    disclaimer: 'نوٹ: آروگیہ سکھی سرکاری ٹرائیج پروٹوکول پر مبنی رہنمائی فراہم کرتی ہے۔ ایمرجنسی میں فوری طور پر 108 ڈائل کریں۔',
    aiEngineConfig: 'اے آئی انجن',
    bhashiniVoiceTag: 'بھاشنی اے آئی وائس',

    careFinderTitle: 'اپنے قریبی سرکاری صحت مراکز تلاش کریں',
    careFinderSubtitle: 'سب سینٹر، پی ایچ سی اور ضلعی ہسپتالوں میں بیڈز، ڈاکٹر اور ادویات کی دستیابی لائیو دیکھیں۔',
    filterAll: 'تمام سہولیات',
    filterPHC: 'پرائمری ہیلتھ سینٹر (PHC)',
    filterSubCentre: 'آیوشمان آروگیہ مندر (ذیلی مرکز)',
    filterHospital: 'سب ڈسٹرکٹ اور ڈسٹرکٹ ہسپتال',
    filterLabs: 'سرکاری تشخیصی لیبز',
    bedAvailable: 'دستیاب بستر',
    teleconsultActive: 'ٹیلی کنسلٹیشن فعال',
    medicineStock: 'ادویات کے اسٹاک کی شرح',
    callFacility: 'رابطہ کریں',
    viewDetails: 'خدمات اور او پی ڈی قطار دیکھیں',

    schemeTitle: 'سرکاری ہیلتھ اسکیمیں اور مالی تحفظ',
    schemeSubtitle: 'مہاراشٹر کی 100% کیش لیس اسکیمیں۔ اپنی اہلیت، مطلوبہ دستاویزات اور ہسپتالوں کی فہرست دیکھیں۔',
    coverageTag: 'کیش لیس فائدہ',
    checkEligibility: 'اہلیت اور دستاویزات چیک کریں',
    schemeMjpjay: 'مہاتما جیوتی راؤ پھولے جن آروگیہ یوجنا (MJPJAY)',
    schemePmmvy: 'پردھان منتری ماتر وندنا یوجنا (PMMVY)',
    schemeJssk: 'جننی ششو سرکشا پروگرام (JSSK)',

    abhaMakerTitle: 'اپنا آیوشمان بھارت ہیلتھ اکاؤنٹ (ABHA) بنائیں',
    abhaMakerSubtitle: 'ڈیجیٹل کیو آر کوڈ تصدیق کے ساتھ اپنا 14 ہندسوں کا سرکاری آبھا کارڈ فوری حاصل کریں۔',
    abhaInputPlaceholder: '12 ہندسوں کا آدھار نمبر یا موبائل نمبر درج کریں...',
    generateAbhaCard: 'آبھا کارڈ بنائیں',
    instantQrCode: 'فوری کیو آر ہیلتھ آئی ڈی',
    downloadCard: 'آبھا کارڈ ڈاؤن لوڈ کریں',
    healthAdvisoryTitle: 'عوامی صحت سے متعلق مشورے اور فلاح و بہبود',
    healthAdvisorySubtitle: 'مصدقہ احتیاطی تدابیر، موسمی بیماریوں کے انتباہات اور ماں و بچے کی صحت کی دیکھ بھال۔',
    readArticle: 'مکمل تفصیلات پڑھیں',

    rolePortalsTitle: 'آپریشنل رول پورٹلز (ایک مربوط نیٹ ورک)',
    rolePortalsSubtitle: 'مریض، آشا ورکر، میڈیکل آفیسر، اسپیشلسٹ، فارماسسٹ، لیب ٹیکنیشن اور ڈسٹرکٹ ہیلتھ آفیسر کا رابطہ۔',
    openPortal: 'پورٹل کھولیں',
    authorizedConsoles: 'بنیادی سرکاری صحت کونسولز',
    supportingConsoles: 'معاون طبی کونسولز',
    role_patient: 'مریض / شہری',
    role_asha: 'آشا ورکر (ASHA)',
    role_cho: 'کمیونٹی ہیلتھ آفیسر (CHO/MO)',
    role_doctor: 'ماہر ڈاکٹر (Specialist)',
    role_pharmacist: 'فارماسسٹ (دوا ساز)',
    role_lab: 'لیب ٹیکنیشن',
    role_facility: 'ہسپتال کوآرڈینیٹر',
    role_dho: 'ڈسٹرکٹ ہیلتھ آفیسر (DHO)',

    patientPortalTitle: 'شہری ڈیجیٹل ہیلتھ لاکر اور ٹیلی میڈیسن ہب',
    vitalsOverview: 'تازہ ترین صحت کے پیرامیٹرز',
    bloodPressure: 'بلڈ پریشر (BP)',
    pulseRate: 'نبض کی رفتار (Pulse)',
    oxygenSaturation: 'خون میں آکسیجن (SpO2)',
    bodyTemp: 'جسم کا درجہ حرارت',
    bodyWeight: 'وزن (کلوگرام)',
    activePrescriptions: 'موجودہ ای-نسخہ اور ادویات',
    dosage: 'خوراک',
    frequency: 'اوقات',
    duration: 'مدت',
    instructions: 'ہدایات',
    recentLabReports: 'تشخیصی رپورٹس اور نتائج',
    testResult: 'ٹیسٹ کا نتیجہ',
    referenceRange: 'نارمل حد',
    normalStatus: 'نارمل',
    borderlineStatus: 'بارڈر لائن',
    criticalStatus: 'ہنگامی انتباہ',
    elderModeToggle: 'آسان موڈ (معمر شہریوں کے لیے)',
    standardModeToggle: 'معیاری منظر',
    bookAppointmentBtn: 'ٹیلی کنسلٹیشن کا وقت بک کریں',
    cancelAppointmentBtn: 'ملاقات منسوخ کریں',
    joinVideoConsult: 'ویڈیو مشاورت شروع کریں',
    logVitalsBtn: 'بلڈ پریشر اور شوگر درج کریں',
    systolicLabel: 'سسٹولک (mmHg)',
    diastolicLabel: 'ڈائیسٹولک (mmHg)',
    fastingGlucoseLabel: 'نہار منہ بلڈ شوگر (mg/dL)',
    consultDoctorOnline: 'ماہر ڈاکٹر سے آن لائن رابطہ کریں',
    noAppointmentsMsg: 'فی الحال کوئی ملاقات طے نہیں ہے۔ نیچے سے وقت بک کریں۔',

    ashaPortalTitle: 'آشا ورکر فیلڈ کونسول • آف لائن فعال',
    fieldHomeVisits: 'ترجیحی گھریلو دورے',
    highRiskPregnancy: 'زیادہ خطرے والی حاملہ خواتین کی نگرانی',
    ncdScreening: 'غیر متعدی امراض (NCD) کا اندراج',
    dueTodayLabel: 'آج کی تاریخ',
    overdueLabel: 'تاخیر شدہ کام',
    upcomingLabel: 'آئندہ دورہ',
    logVisitSubmit: 'گھریلو دورہ اور صحت کا ڈیٹا درج کریں',
    householdRoster: 'خاندانوں کی فہرست',
    syncWithHmis: 'سرکاری پورٹل کے ساتھ ڈیٹا سنک کریں',
    recordBpSugar: 'بی پی اور شوگر کی جانچ کریں',
    referPatientBtn: 'مریض کو پی ایچ سی ریفر کریں',
    teleconsultQueueTitle: 'سب سینٹر ٹیلی کنسلٹیشن قطار',
    subCenterTriage: 'کمیونٹی ڈیجیٹل ٹرائیج',
    medicineRequestBtn: 'ادویات کی درخواست بھیجیں',
    clinicalNotesLabel: 'طبی مشاہدات اور نوٹس',

    doctorPortalTitle: 'اسپیشلسٹ ٹیلی میڈیسن اور ریفرل ہب',
    liveTeleconsultTitle: 'لائیو ٹیلی کنسلٹیشن ویڈیو روم',
    issueRxBtn: 'ڈیجیٹل ای-نسخہ جاری کریں',
    referSpecialistBtn: 'ڈسٹرکٹ ہسپتال ریفر کریں',
    diagnosticOrderBtn: 'لیب ٹیسٹ کا حکم دیں',
    consultSummary: 'مشاورت کا خلاصہ',
    patientVitalsSummary: 'مریض کی علامات اور صحت کے اشاریے',
    inCallStatus: 'ویڈیو مشاورت جاری ہے',
    endCallBtn: 'کال ختم کر کے نسخہ جاری کریں',
    facilityOpsTitle: 'ہسپتال کے انتظامات اور بستروں کی دستیابی',
    bedTrackerTitle: 'لائیو بیڈز اور آئی سی یو ٹریکر',
    icuBedsAvailable: 'وینٹی لیٹر آئی سی یو بیڈز دستیاب',
    generalBedsAvailable: 'جنرل وارڈ کے بیڈز دستیاب',
    oxygenStatusAvailable: 'طبی آکسیجن دستیاب',
    dispatchAmbulanceBtn: '108 ایمبولینس فوری روانہ کریں',
    etaMinutesLabel: 'پہنچنے کا متوقع وقت (منٹ)',

    dhoPortalTitle: 'ڈسٹرکٹ ہیلتھ آفیسر (DHO) کنٹرول سینٹر',
    districtEpidemicOverview: 'ضلعی صحت اور وبائی امراض کی نگرانی',
    highRiskMaternalMonitored: 'نگرانی میں ماؤں کی تعداد',
    medicineStockRateLabel: 'ضروری ادویات کے اسٹاک کی شرح',
    activeSurveillanceAlerts: 'بیماری کے پھیلاؤ کے انتباہات',
    issueDistrictDirective: 'عوامی صحت کی ہدایات جاری کریں',
    exportDistrictReport: 'ضلعی رپورٹ ڈاؤن لوڈ کریں (PDF/Excel)',

    save: 'محفوظ کریں',
    cancel: 'منسوخ کریں',
    close: 'بند کریں',
    submit: 'جمع کریں',
    delete: 'حذف کریں',
    edit: 'ترمیم کریں',
    update: 'اپ ڈیٹ کریں',
    search: 'تلاش کریں',
    loading: 'لوڈ ہو رہا ہے...',
    error: 'خرابی پیش آئی',
    success: 'کامیابی سے مکمل ہوا',
    retry: 'دوبارہ کوشش کریں',
    back: 'پیچھے',
    next: 'آگے',
    viewAll: 'تمام دیکھیں',
    noDataFound: 'کوئی ریکارڈ نہیں ملا',
    refresh: 'ریفریش کریں',
    confirm: 'تصدیق کریں',
    actions: 'اقدامات',
    status: 'حیثیت',
    date: 'تاریخ',
    time: 'وقت',
    filter: 'فلٹر',
    reset: 'ری سیٹ',
    download: 'ڈاؤن لوڈ',
    print: 'پرنٹ',
    export: 'ایکسپورٹ',
    copy: 'کاپی کریں',
    share: 'شیئر کریں',
    languageName: 'اردو',
    helpline: 'ٹول فری ہیلپ لائن',
    details: 'تفصیلات دیکھیں',
    verified: 'مصدقہ ریکارڈ',
    offlineMode: 'آف لائن موڈ فعال ہے',
    onlineMode: 'آن لائن سنک فعال ہے',
    syncPending: 'تبدیلیاں قطار میں ہیں',
    synced: 'تمام ریکارڈ سنک ہو گئے',
    yes: 'ہاں',
    no: 'نہیں',

    emergencyModalTitle: 'حکومت مہاراشٹر ایمرجنسی میڈیکل رسپانس (108)',
    emergencyModalSubtitle: '24x7 ایمرجنسی ایمبولینس اور ٹراما کیئر نیٹ ورک',
    call108Now: '108 ایمرجنسی ایس او ایس ڈائل کریں',
    ambulanceDispatchedMsg: '108 ایمبولینس روانہ کر دی گئی ہے! متوقع وقت: 8 منٹ۔',
    eta8MinsMsg: 'ایمبولینس راستے میں ہے • متوقع وقت: 8 منٹ',
    gpsTrackingActive: 'لائیو جی پی ایس لوکیشن کنٹرول روم کے ساتھ شیئر کر دی گئی ہے',
    nearestTraumaCenter: 'قریبی ٹراما سینٹر: جنر رورل ہسپتال',
    firstAidInstructions: 'مریض کو پرسکون رکھیں، سر اونچا رکھیں، کپڑے ڈھیلے کریں، بے ہوشی کی حالت میں پانی نہ دیں۔',
    loginSuccessMsg: 'تصدیق کامیابی سے مکمل ہو گئی۔',
    logoutSuccessMsg: 'کونسول سے لاگ آؤٹ ہو گئے۔',
    vitalsLoggedMsg: 'نئے صحت کے پیرامیٹرز کامیابی سے درج ہو گئے۔',
    appointmentBookedMsg: 'ڈاکٹر کے ساتھ ملاقات کی تصدیق ہو گئی۔',
    offlineQueuedMsg: 'آف لائن موڈ فعال — ڈیٹا مقامی طور پر محفوظ ہے۔',
    onlineSyncedMsg: 'انٹرنیٹ کنکشن بحال — ڈیٹا سنک ہو گیا۔',
    resetDbSuccessMsg: 'مقامی ڈیٹا بیس ری سیٹ ہو گیا۔'
  }
};
