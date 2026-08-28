import { TriageResult, HealthScheme } from '../types';
import { MAHARASHTRA_SCHEMES, MAHARASHTRA_FACILITIES, MOCK_MEDICINES } from '../data/mockData';

export interface AIResponse {
  answerEn: string;
  answerMr: string;
  answerHi: string;
  triage?: TriageResult;
  matchedSchemes?: HealthScheme[];
  matchedFacilities?: typeof MAHARASHTRA_FACILITIES;
  matchedMedicines?: typeof MOCK_MEDICINES;
  actionButtons?: {
    labelEn: string;
    labelMr: string;
    labelHi: string;
    actionType: 'EMERGENCY_CALL' | 'BOOK_TELECONSULT' | 'FIND_FACILITY' | 'CHECK_SCHEME' | 'TALK_TO_ASHA';
    actionPayload?: string;
  }[];
}

export function processHealthQuery(query: string): AIResponse {
  const lower = query.toLowerCase();

  // 1. Critical Red Flag: Cardiac / Chest Pain / Heart Attack
  if (
    lower.includes('chest pain') || lower.includes('heart') || lower.includes('छातीत') || lower.includes('कळ') ||
    lower.includes('सीना') || lower.includes('heart attack') || lower.includes('छाती')
  ) {
    return {
      answerEn: 'CRITICAL WARNING: Chest pain, especially with sweating, shortness of breath, or left arm radiation, is a potential cardiac emergency (Heart Attack). Do not delay.',
      answerMr: 'तातडीचा इशारा: छातीत दुखणे, घाम येणे, डाव्या हातात कळ येणे किंवा धाप लागणे ही हृदयविकाराची (हार्ट अटॅक) लक्षणे असू शकतात. एक क्षणही वाया घालवू नका.',
      answerHi: 'आपातकालीन चेतावनी: सीने में तेज दर्द, पसीना आना, बाएं हाथ में दर्द फैलना या सांस फूलना दिल के दौरे (हार्ट अटैक) के लक्षण हो सकते हैं। तुरंत कदम उठाएं।',
      triage: {
        symptoms: ['Acute Chest Pain', 'Diaphoresis', 'Dyspnea'],
        urgency: 'red',
        primaryAssessment: 'Suspected Acute Coronary Syndrome (ACS) / NSTEMI',
        primaryAssessmentMr: 'संशयित तीव्र कोरोनरी सिंड्रोम / हृदयविकाराचा झटका',
        primaryAssessmentHi: 'संभावित एक्यूट कोरोनरी सिंड्रोम / दिल का दौरा',
        recommendedAction: 'Dial 108 immediately for Advanced Life Support (ALS) Ambulance. Keep patient sitting upright and calm. Head directly to Junnar Rural Hospital or District Civil Hospital.',
        recommendedActionMr: 'तातडीने १०८ डायल करून आयसीयू रुग्णवाहिका बोलवा. रुग्णाला शांत बसवून ठेवा. तात्काळ जुन्नर ग्रामीण रुग्णालय किंवा जिल्हा रुग्णालयात घेऊन जा.',
        recommendedActionHi: 'तुरंत 108 डायल करके एंबुलेंस बुलाएं। मरीज को शांत बैठाएं। सीधे जुन्नर या जिला अस्पताल ले जाएं।',
        nearestFacilityType: 'Sub-District / District Hospital with ICU',
        redFlags: ['Chest pressure > 15 mins', 'Radiating pain to jaw/arm', 'Cold sweats', 'Unconsciousness'],
        requiresEmergencyAmbulance: true,
        followUpHours: 0,
      },
      matchedSchemes: [MAHARASHTRA_SCHEMES[0], MAHARASHTRA_SCHEMES[1]],
      matchedFacilities: [MAHARASHTRA_FACILITIES[0], MAHARASHTRA_FACILITIES[3]],
      actionButtons: [
        {
          labelEn: '🚨 Call 108 Emergency Ambulance',
          labelMr: '🚨 १०८ रुग्णवाहिका तात्काळ बोलवा',
          labelHi: '🚨 108 आपातकालीन एम्बुलेंस बुलाएं',
          actionType: 'EMERGENCY_CALL',
          actionPayload: '108'
        },
        {
          labelEn: 'Find Nearest Emergency ICU',
          labelMr: 'जवळचे आयसीयू रुग्णालय पहा',
          labelHi: 'निकटतम आईसीयू अस्पताल देखें',
          actionType: 'FIND_FACILITY',
          actionPayload: 'Sub-District Hospital'
        }
      ]
    };
  }

  // 2. Snakebite Emergency (Common in rural Maharashtra)
  if (lower.includes('snake') || lower.includes('चावला') || lower.includes('साप') || lower.includes('सांप') || lower.includes('विंचू') || lower.includes('scorpion')) {
    return {
      answerEn: 'EMERGENCY: Snakebite detected. Polyvalent Anti-Snake Venom (ASV) is available 100% free at Otur PHC and Junnar Rural Hospital. Immobilize the bitten limb immediately. Do not tie tight tourniquets or make cuts.',
      answerMr: 'आपत्कालीन: सर्पदंशाची शक्यता. ओतूर प्राथमिक आरोग्य केंद्र आणि जुन्नर ग्रामीण रुग्णालयात अँटी-स्नेक व्हेनम (ASV) इंजेक्शन पूर्णपणे मोफत उपलब्ध आहे. दंश झालेला हात किंवा पाय न हलवता स्थिर ठेवा.',
      answerHi: 'आपातकाल: सर्पदंश की आशंका। ओतूर पीएचसी और जुन्नर ग्रामीण अस्पताल में एंटी-स्नेक वेनम (ASV) 100% निःशुल्क उपलब्ध है। मरीज का अंग स्थिर रखें।',
      triage: {
        symptoms: ['Snake Bite', 'Fang Marks', 'Local Swelling'],
        urgency: 'red',
        primaryAssessment: 'Suspected Envenomation (Neurotoxic / Vasculotoxic)',
        primaryAssessmentMr: 'विषारी सर्पदंश / विषबाधा शक्यता',
        primaryAssessmentHi: 'विषैला सर्पदंश / विष की आशंका',
        recommendedAction: 'Immediate transport to Otur PHC or Junnar Hospital for Anti-Snake Venom (ASV) administration and vital monitoring.',
        recommendedActionMr: 'त्वरित ओतूर पीएचसी किंवा जुन्नर रुग्णालयात ASV इंजेक्शन व वैद्यकीय देखरेखीसाठी न्या.',
        recommendedActionHi: 'तुरंत ओतूर पीएचसी या जुन्नर अस्पताल ले जाएं जहां ASV इंजेक्शन उपलब्ध है।',
        nearestFacilityType: 'PHC / Rural Hospital with ASV stock',
        redFlags: ['Ptosis (drooping eyelids)', 'Respiratory difficulty', 'Bleeding from gums', 'Rapid swelling'],
        requiresEmergencyAmbulance: true,
        followUpHours: 0,
      },
      matchedMedicines: [MOCK_MEDICINES[5]],
      matchedFacilities: [MAHARASHTRA_FACILITIES[1], MAHARASHTRA_FACILITIES[0]],
      actionButtons: [
        {
          labelEn: '🚨 Call 108 Ambulance',
          labelMr: '🚨 १०८ रुग्णवाहिका बोलवा',
          labelHi: '🚨 108 एम्बुलेंस बुलाएं',
          actionType: 'EMERGENCY_CALL',
          actionPayload: '108'
        }
      ]
    };
  }

  // 3. Pregnancy / Maternal Care / JSSK / PMSMA
  if (
    lower.includes('pregnant') || lower.includes('pregnancy') || lower.includes('गर्भवती') || lower.includes('गरोदर') ||
    lower.includes('बाळंतपण') || lower.includes('delivery') || lower.includes('jssk') || lower.includes('pmsma')
  ) {
    return {
      answerEn: 'Under Maharashtra Government Janani Shishu Suraksha Karyakram (JSSK), all institutional deliveries (normal & C-section), lab tests, medicines, blood transfusions, and ambulance drop-back are 100% FREE with zero out-of-pocket expense.',
      answerMr: 'महाराष्ट्र शासनाच्या जननी शिशु सुरक्षा कार्यक्रम (JSSK) अंतर्गत शासकीय रुग्णालयातील सर्व प्रसूती (नॉर्मल व सिझेरियन), औषधे, सोनोग्राफी, रक्त तपासण्या आणि १०२ रुग्णवाहिका प्रवास पूर्णपणे मोफत आहे.',
      answerHi: 'महाराष्ट्र सरकार के जननी शिशु सुरक्षा कार्यक्रम (JSSK) के तहत सरकारी अस्पताल में सभी प्रसव (सामान्य व सी-सेक्शन), दवाएं, सोनोग्राफी, जांच और 102 एम्बुलेंस पूर्णतः मुफ्त हैं।',
      triage: {
        symptoms: ['Antenatal Care', 'Routine / High-Risk Checkup'],
        urgency: 'amber',
        primaryAssessment: 'Maternal Care & High-Risk Pregnancy Screening',
        primaryAssessmentMr: 'मातृ काळजी व उच्च जोखीम तपासणी',
        primaryAssessmentHi: 'मातृत्व देखभाल एवं हाई-रिस्क प्रसव जांच',
        recommendedAction: 'Visit nearest PHC on the 9th of this month for free specialist PMSMA checkup, USG scan, and iron supplements. Connect with your village ASHA worker.',
        recommendedActionMr: 'प्रत्येक महिन्याच्या ९ तारखेला मोफत तज्ज्ञ तपासणीसाठी (PMSMA) जवळच्या प्राथमिक आरोग्य केंद्रात जा व आशा सेविकेशी संपर्क साधा.',
        recommendedActionHi: 'हर महीने की 9 तारीख को मुफ्त विशेषज्ञ जांच (PMSMA) के लिए नजदीकी पीएचसी जाएं व आशा दीदी से संपर्क करें।',
        nearestFacilityType: 'PHC / Sub-Centre',
        redFlags: ['High BP (> 140/90)', 'Severe headache or blurred vision', 'Decreased fetal movement', 'Vaginal bleeding'],
        requiresEmergencyAmbulance: false,
        followUpHours: 24,
      },
      matchedSchemes: [MAHARASHTRA_SCHEMES[2], MAHARASHTRA_SCHEMES[3]],
      matchedFacilities: [MAHARASHTRA_FACILITIES[1], MAHARASHTRA_FACILITIES[0]],
      actionButtons: [
        {
          labelEn: 'Connect with Village ASHA',
          labelMr: 'गावच्या आशा सेविकेशी बोला',
          labelHi: 'गांव की आशा दीदी से बात करें',
          actionType: 'TALK_TO_ASHA'
        },
        {
          labelEn: 'View JSSK & PMSMA Benefits',
          labelMr: 'जेएसएसके योजना लाभ पहा',
          labelHi: 'जेएसएसके योजना लाभ देखें',
          actionType: 'CHECK_SCHEME',
          actionPayload: 'scheme-03'
        }
      ]
    };
  }

  // 4. Fever / Malaria / Dengue / Infection
  if (lower.includes('fever') || lower.includes('ताप') || lower.includes('बुखार') || lower.includes('malaria') || lower.includes('dengue') || lower.includes('थंडी')) {
    return {
      answerEn: 'Fever with chills in rural areas requires immediate blood testing for Malaria (Pv/Pf) and Dengue. Otur PHC and Khamgaon Sub-Centre offer rapid card tests and free Paracetamol.',
      answerMr: 'थंडी वाजून येणाऱ्या तापासाठी हिवताप (मलेरिया) आणि डेंग्यूची रक्त तपासणी आवश्यक आहे. ओतूर प्राथमिक आरोग्य केंद्रात मोफत रॅपिड टेस्ट व पॅरासिटामॉल गोळ्या उपलब्ध आहेत.',
      answerHi: 'ठंड लगकर आने वाले बुखार में मलेरिया व डेंगू की जांच जरूरी है। ओतूर पीएचसी में मुफ्त रैपिड जांच और पैरासिटामोल उपलब्ध हैं।',
      triage: {
        symptoms: ['Fever with chills', 'Body ache', 'Headache'],
        urgency: 'amber',
        primaryAssessment: 'Suspected Malaria / Viral Febrile Illness',
        primaryAssessmentMr: 'संशयित हिवताप (मलेरिया) किंवा विषाणूजन्य ताप',
        primaryAssessmentHi: 'संभावित मलेरिया / वायरल बुखार',
        recommendedAction: 'Get rapid finger-prick test done at your nearest Sub-Centre / PHC. Drink plenty of boiled water and take Paracetamol 500mg as advised.',
        recommendedActionMr: 'उपकेंद्र किंवा पीएचसी मध्ये जाऊन रक्ताची मोफत तपासणी करून घ्या. भरपूर पाणी प्या व डॉक्टरांच्या सल्ल्याने औषध घ्या.',
        recommendedActionHi: 'उप-केंद्र या पीएचसी में खून की जांच कराएं। खूब पानी पिएं और डॉक्टर की सलाह अनुसार दवा लें।',
        nearestFacilityType: 'PHC / Sub-Centre',
        redFlags: ['Fever > 103°F', 'Convulsions (fits)', 'Extreme lethargy', 'Yellow eyes / vomiting blood'],
        requiresEmergencyAmbulance: false,
        followUpHours: 12,
      },
      matchedMedicines: [MOCK_MEDICINES[0], MOCK_MEDICINES[1]],
      matchedFacilities: [MAHARASHTRA_FACILITIES[2], MAHARASHTRA_FACILITIES[1]],
      actionButtons: [
        {
          labelEn: 'Start Assisted Teleconsultation',
          labelMr: 'टेलिकन्सल्टेशन सुरू करा',
          labelHi: 'टेलीकंसल्टेशन शुरू करें',
          actionType: 'BOOK_TELECONSULT'
        },
        {
          labelEn: 'Find Nearest Diagnostic Lab',
          labelMr: 'जवळची मोफत लॅब शोधा',
          labelHi: 'निकटतम निःशुल्क लैब खोजें',
          actionType: 'FIND_FACILITY',
          actionPayload: 'Diagnostic Lab'
        }
      ]
    };
  }

  // 5. Medicine Stock / Pharmacy Query
  if (lower.includes('medicine') || lower.includes('stock') || lower.includes('औषध') || lower.includes('दवा') || lower.includes('paracetamol') || lower.includes('insulin')) {
    return {
      answerEn: 'Live Drug Stock Alert: Essential medicines (Paracetamol, Metformin, IFA, ASV) are currently 91.8% in stock across Otur PHC and Junnar Hospital. Low stock of Oxytocin is actively being replenished.',
      answerMr: 'थेट औषध साठा स्थिती: ओतूर प्राथमिक आरोग्य केंद्र आणि जुन्नर ग्रामीण रुग्णालयात पॅरासिटामॉल, मेटफॉर्मिन, लोहयुक्त गोळ्या आणि सर्पदंश लस मुबलक उपलब्ध आहेत (९१.८% साठा दर).',
      answerHi: 'दवाओं का लाइव स्टॉक: ओतूर पीएचसी व जुन्नर अस्पताल में पैरासिटामोल, मेटफॉर्मिन, आयरन की गोलियां एवं एंटी-स्नेक वेनम उपलब्ध हैं (91.8% उपलब्धता दर)।',
      matchedMedicines: MOCK_MEDICINES,
      matchedFacilities: [MAHARASHTRA_FACILITIES[1], MAHARASHTRA_FACILITIES[0]],
      actionButtons: [
        {
          labelEn: 'View Full PHC Drug Inventory',
          labelMr: 'पीएचसी औषध साठा पहा',
          labelHi: 'पीएचसी दवा सूची देखें',
          actionType: 'FIND_FACILITY'
        }
      ]
    };
  }

  // 6. Default Smart Health Navigation
  return {
    answerEn: `ArogyaSakhi AI Companion has analyzed your query: "${query}". You can access free OPD consultations, subsidized surgeries under MJPJAY (up to ₹5 Lakh cashless), and instant assisted teleconsultations at your nearest Ayushman Arogya Mandir.`,
    answerMr: `आरोग्यसखी (ArogyaSakhi) एआय सहचराने तुमच्या प्रश्नाचे विश्लेषण केले आहे: "${query}". आपण जवळच्या प्राथमिक आरोग्य केंद्रात मोफत तपासणी, महात्मा फुले जन आरोग्य योजनेअंतर्गत ₹५ लाखांपर्यंत मोफत शस्त्रक्रिया आणि टेलिकन्सल्टेशन सुविधा मिळवू शकता.`,
    answerHi: `आरोग्यसखी (ArogyaSakhi) एआई साथी ने आपके सवाल का विश्लेषण किया: "${query}". आप निकटतम स्वास्थ्य केंद्र पर मुफ्त परामर्श, महात्मा ज्योतिराव फुले योजना के तहत ₹5 लाख तक का कैशलेस इलाज एवं टेलीकंसल्टेशन प्राप्त कर सकते हैं।`,
    triage: {
      symptoms: [query],
      urgency: 'green',
      primaryAssessment: 'Routine Primary Care / Health Inquiry',
      primaryAssessmentMr: 'नियमित प्राथमिक आरोग्य सल्ला',
      primaryAssessmentHi: 'सामान्य प्राथमिक स्वास्थ्य परामर्श',
      recommendedAction: 'Connect with your local CHO at the Sub-Centre or start an assisted e-Sanjeevani teleconsultation with a specialist doctor.',
      recommendedActionMr: 'उपकेंद्रातील आरोग्य अधिकाऱ्यांशी संपर्क साधा किंवा ई-संजीवनी द्वारे तज्ज्ञ डॉक्टरांचा सल्ला घ्या.',
      recommendedActionHi: 'उप-केंद्र के स्वास्थ्य अधिकारी से मिलें या ई-संजीवनी के माध्यम से विशेषज्ञ डॉक्टर से परामर्श लें।',
      nearestFacilityType: 'Sub-Centre / PHC',
      redFlags: ['Difficulty breathing', 'Loss of consciousness', 'Severe unyielding pain'],
      requiresEmergencyAmbulance: false,
      followUpHours: 48,
    },
    matchedSchemes: [MAHARASHTRA_SCHEMES[0], MAHARASHTRA_SCHEMES[1]],
    matchedFacilities: [MAHARASHTRA_FACILITIES[2], MAHARASHTRA_FACILITIES[1]],
    actionButtons: [
      {
        labelEn: 'Start Teleconsultation',
        labelMr: 'टेलिकन्सल्टेशन सुरू करा',
        labelHi: 'टेलीकंसल्टेशन शुरू करें',
        actionType: 'BOOK_TELECONSULT'
      },
      {
        labelEn: 'Explore Govt Schemes',
        labelMr: 'शासकीय योजना पहा',
        labelHi: 'सरकारी योजनाएं देखें',
        actionType: 'CHECK_SCHEME',
        actionPayload: 'scheme-01'
      }
    ]
  };
}
