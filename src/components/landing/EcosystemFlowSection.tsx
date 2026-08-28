import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartHandshake, 
  Stethoscope, 
  Building2, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  WifiOff, 
  Video, 
  Pill, 
  Activity 
} from 'lucide-react';

export const EcosystemFlowSection: React.FC = () => {
  const { language, setCurrentView } = useApp();

  const steps = [
    {
      role: 'asha',
      level: '1. Village Household Level',
      levelMr: '१. ग्राम व गृहपातळी',
      title: 'ASHA Worker Field Grid',
      titleMr: 'आशा सेविका फील्ड ग्रिड',
      icon: HeartHandshake,
      color: 'from-pink-500 to-rose-600',
      badge: 'Offline-First PWA',
      features: [
        'Door-to-door high-risk pregnancy tracking',
        'Offline vitals logging with voice Marathi notes',
        'Rapid malnutrition & NCD screening',
        'Automatic sync when network reconnects'
      ]
    },
    {
      role: 'cho',
      level: '2. Sub-Centre (Arogya Mandir)',
      levelMr: '२. उपकेंद्र (आरोग्य मंदिर)',
      title: 'CHO Digital Triage & Spoke',
      titleMr: 'सीएचओ डिजिटल ट्रायज व टेलिमेडिसिन',
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-700',
      badge: 'e-Sanjeevani Spoke',
      features: [
        'AI-assisted digital triage (Red/Amber/Green)',
        'Live teleconsultation with Specialist Doctors',
        'Rapid diagnostic card testing (Malaria/Hb)',
        'Direct electronic referral with bed check'
      ]
    },
    {
      role: 'doctor',
      level: '3. PHC & Rural Hospital',
      levelMr: '३. प्राथमिक आरोग्य केंद्र व ग्रामीण रुग्णालय',
      title: 'Clinical Care & Teleconsult Hub',
      titleMr: 'वैद्यकीय उपचार व टेलिकन्सल्ट हब',
      icon: Activity,
      color: 'from-blue-600 to-indigo-700',
      badge: 'e-Prescription & Lab',
      features: [
        'MBBS Medical Officer OPD queue flow',
        'Digital e-Prescription & dosage safety',
        'Integrated clinical laboratory orders',
        '24x7 normal delivery & emergency care'
      ]
    },
    {
      role: 'facility',
      level: '4. Sub-District & District Hospital',
      levelMr: '४. उपजिल्हा व जिल्हा रुग्णालय',
      title: 'Specialist Hub & MJPJAY Surgery',
      titleMr: 'तज्ज्ञ रुग्णालय व महात्मा फुले शस्त्रक्रिया',
      icon: Building2,
      color: 'from-violet-600 to-purple-800',
      badge: 'Cashless ₹5L Surgery',
      features: [
        'OBGYN, Pediatric, Surgery specialist care',
        'ICU, Oxygen & Blood Bank connectivity',
        'MJPJAY Cashless procedure clearance',
        'Counter-referral back to village ASHA'
      ]
    },
    {
      role: 'dho',
      level: '5. District Health Administration',
      levelMr: '५. जिल्हा आरोग्य प्रशासन',
      title: 'DHO Governance & Radar',
      titleMr: 'जिल्हा आरोग्य अधिकारी कमांड सेंटर',
      icon: ShieldAlert,
      color: 'from-slate-800 to-black',
      badge: 'District GIS Radar',
      features: [
        'Referral drop-off funnel analytics',
        'Real-time medicine stock-out alert radar',
        'Maternal mortality & epidemic cluster alert',
        'Direct administrative instruction dispatch'
      ]
    }
  ];

  return (
    <section id="ecosystem" className="py-20 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>End-to-End Continuity of Care</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002117] tracking-tight">
            Connected from Village to District Command
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            How SETU transforms fragmented rural visits into a closed-loop, accountable healthcare continuum for the Government of Maharashtra.
          </p>
        </div>

        {/* 5 Step Timeline / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 hover:border-emerald-300 relative group"
              >
                <div>
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === 'mr' ? step.levelMr : step.level}
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                      {step.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="pt-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-md shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 tracking-tight leading-tight">
                      {language === 'mr' ? step.titleMr : step.title}
                    </h3>
                  </div>

                  {/* Feature Bullets */}
                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    {step.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-1.5 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Launch Portal CTA */}
                <button
                  onClick={() => setCurrentView(step.role as any)}
                  className="w-full bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5 group-hover:border-emerald-300"
                >
                  <span>Explore Role View</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
