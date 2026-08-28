import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  Heart, 
  Bug, 
  Droplet, 
  Baby, 
  ShieldAlert, 
  ChevronRight, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle2,
  PhoneCall,
  ArrowRight
} from 'lucide-react';

interface AdvisoryArticle {
  id: string;
  category: 'Vector-Borne' | 'Cardiology' | 'Maternal Health' | 'Waterborne';
  titleEn: string;
  titleMr: string;
  alertLevel: 'RED_ALERT' | 'AMBER_WATCH' | 'ADVISORY';
  location: string;
  publishedDate: string;
  readTime: string;
  summary: string;
  symptoms: string[];
  protocolSteps: string[];
  contactAction: string;
}

const HEALTH_ADVISORIES: AdvisoryArticle[] = [
  {
    id: 'adv-01',
    category: 'Vector-Borne',
    titleEn: 'Monsoon Dengue & Malaria Surge: High-Priority Rapid Screening in Junnar & Ambegaon',
    titleMr: 'पावसाळी डेंग्यू व हिवताप वाढ: जुन्नर व आंबेगाव तालुक्यात तातडीची तपासणी मोहीम',
    alertLevel: 'RED_ALERT',
    location: 'Junnar, Ambegaon, Otur Ghats',
    publishedDate: '28 Aug 2026',
    readTime: '3 min advisory',
    summary: 'District Health Office Pune has issued an alert following fever clusters. Frontline ASHAs and CHOs are mandated to perform on-site RDT card testing for all fever cases lasting >48 hours.',
    symptoms: ['Sudden high-grade fever with chills', 'Retro-orbital eye pain & severe body ache', 'Platelet count drop below 100,000/uL', 'Persistent vomiting or abdominal pain'],
    protocolSteps: [
      'Take only Paracetamol for fever; strictly avoid Ibuprofen/Aspirin (reduces bleeding risk).',
      'Consume oral rehydration salts (ORS), tender coconut water, and boiled fluids.',
      'Visit nearest Ayushman Arogya Mandir (Sub-Centre) for 10-minute Rapid Diagnostic Dipstick.'
    ],
    contactAction: 'Visit Sub-Centre for 10-min Rapid Malaria/Dengue Test'
  },
  {
    id: 'adv-02',
    category: 'Cardiology',
    titleEn: 'Rural Cardiovascular Alert: Recognizing Acute Ischemic Heart Disease & Golden Hour Management',
    titleMr: 'ग्रामीण हृदयविकार जागृती: छातीत दुखणे व तत्काळ १ तासातील गोल्डन अवर उपचार',
    alertLevel: 'AMBER_WATCH',
    location: 'Statewide Rural Maharashtra',
    publishedDate: '26 Aug 2026',
    readTime: '4 min advisory',
    summary: 'Cardiovascular emergencies in rural adults require immediate triage. Early administration of Sorbitrate and Aspirin loading dose at Primary Health Centres significantly reduces mortality.',
    symptoms: ['Crushing retrosternal chest tightness radiating to left arm or jaw', 'Sudden cold profuse sweating (diaphoresis)', 'Unexplained shortness of breath with nausea', 'Extreme sudden dizziness and fatigue'],
    protocolSteps: [
      'Immediately dial 108 Emergency Ambulance for GPS-tracked transport.',
      'Keep patient resting in a semi-reclined posture with tight clothing loosened.',
      'If prescribed, chew Dispersible Aspirin 300mg + Clopidogrel 300mg immediately as loading dose.'
    ],
    contactAction: 'Dial 108 for Emergency Trauma & Cardiac Transport'
  },
  {
    id: 'adv-03',
    category: 'Maternal Health',
    titleEn: 'Maternal Anemia Prevention: PMSMA 3rd Trimester Hemoglobin Screening Protocol',
    titleMr: 'माता ॲनिमिया प्रतिबंध: गरोदरपणातील तिसऱ्या तिमाहीतील हिमोग्लोबिन तपासणी',
    alertLevel: 'ADVISORY',
    location: 'Nandurbar, Pune, Nashik Rural',
    publishedDate: '24 Aug 2026',
    readTime: '3 min advisory',
    summary: 'Under the Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA), every pregnant mother with Hb < 9.0 g/dL is eligible for free Parenteral IV Iron Sucrose at Rural Hospitals.',
    symptoms: ['Extreme fatigue and breathlessness on light exertion', 'Pale conjunctiva, tongue, and nail beds', 'Swelling in feet and ankles (edema)', 'Frequent dizziness and palpitation'],
    protocolSteps: [
      'Mandatory monthly ANC vitals check with your village ASHA worker.',
      'Take 1 IFA tablet (Iron & Folic Acid) and 1 Calcium tablet daily after meals.',
      'For severe anemia (Hb < 8 g/dL), schedule specialist teleconsultation at Sub-Centre.'
    ],
    contactAction: 'Book High-Risk ANC Review at Village Sub-Centre'
  },
  {
    id: 'adv-04',
    category: 'Waterborne',
    titleEn: 'Acute Diarrheal Illness Notice: Well Water Super-Chlorination in Tribal Sectors',
    titleMr: 'जलजन्य आजार प्रतिबंध: गावातील विहिरींचे टीसीएल पावडरने शुद्धीकरण',
    alertLevel: 'AMBER_WATCH',
    location: 'Toranmal, Shahada, Ghatghar',
    publishedDate: '22 Aug 2026',
    readTime: '2 min advisory',
    summary: 'Public Health Engineering has initiated a mandatory super-chlorination drive across all community borewells and drinking water reservoirs to prevent waterborne gastroenteritis.',
    symptoms: ['Frequent watery loose stools (>3 times in 24 hours)', 'Sunken eyes, extreme thirst, and dry mouth', 'Muscle cramping in calves and abdomen', 'Fever with vomiting'],
    protocolSteps: [
      'Drink only water boiled for at least 10 minutes.',
      'Mix 1 packet of WHO-formula ORS in 1 litre of clean drinking water.',
      'Give Zinc tablets (20mg daily for 14 days) to children under 5 years.'
    ],
    contactAction: 'Collect Free ORS & Zinc from Village ASHA'
  }
];

export const HealthAdvisoryBlogSection: React.FC = () => {
  const { showToast, setIsEmergencyModalOpen } = useApp();
  const [selectedAdvisory, setSelectedAdvisory] = useState<AdvisoryArticle | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filteredAdvisories = activeFilter === 'ALL' 
    ? HEALTH_ADVISORIES 
    : HEALTH_ADVISORIES.filter(a => a.category === activeFilter);

  return (
    <section id="health-advisories" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-900 border border-red-300 px-3.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-red-800" />
              <span>Public Health Directorate Advisories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Epidemic Early Warnings & Disease Surveillance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Verified clinical advisories, seasonal disease alerts, and prevention guidelines issued by the Integrated Disease Surveillance Programme (IDSP) Maharashtra.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
            {['ALL', 'Vector-Borne', 'Cardiology', 'Maternal Health', 'Waterborne'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeFilter === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'All Alerts' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Advisory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAdvisories.map((advisory) => (
            <div
              key={advisory.id}
              className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                    advisory.alertLevel === 'RED_ALERT' ? 'bg-red-100 text-red-800 border-red-300' :
                    advisory.alertLevel === 'AMBER_WATCH' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {advisory.alertLevel.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{advisory.publishedDate}</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  {advisory.titleEn}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {advisory.summary}
                </p>

                {/* Symptoms Preview */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Recognize Warning Signs:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                    {advisory.symptoms.slice(0, 2).map((sym, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold">•</span>
                        <span className="text-[11px] leading-tight">{sym}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{advisory.location}</span>
                </div>
                <button
                  onClick={() => setSelectedAdvisory(advisory)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1"
                >
                  <span>Read Protocol</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Advisory Detail Modal */}
      {selectedAdvisory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  selectedAdvisory.alertLevel === 'RED_ALERT' ? 'bg-red-100 text-red-800 border-red-300' :
                  selectedAdvisory.alertLevel === 'AMBER_WATCH' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {selectedAdvisory.alertLevel.replace('_', ' ')} • {selectedAdvisory.category}
                </span>
                <h3 className="font-black text-lg text-slate-900">{selectedAdvisory.titleEn}</h3>
                <p className="text-xs font-bold text-slate-500">{selectedAdvisory.titleMr}</p>
              </div>
              <button
                onClick={() => setSelectedAdvisory(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-1">Official IDSP Briefing:</h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  {selectedAdvisory.summary}
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-2">Key Clinical Symptoms to Monitor:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedAdvisory.symptoms.map((sym, idx) => (
                    <div key={idx} className="bg-red-50/60 border border-red-100 p-2.5 rounded-xl text-red-950 font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-2">Standard Treatment & Public Action Protocol:</h4>
                <div className="space-y-2">
                  {selectedAdvisory.protocolSteps.map((step, idx) => (
                    <div key={idx} className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-emerald-950 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setSelectedAdvisory(null);
                  showToast(selectedAdvisory.contactAction);
                }}
                className="flex-1 bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md"
              >
                {selectedAdvisory.contactAction}
              </button>
              <button
                onClick={() => {
                  setSelectedAdvisory(null);
                  setIsEmergencyModalOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-3 rounded-2xl text-xs transition-all shadow-md flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>108 Emergency</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
