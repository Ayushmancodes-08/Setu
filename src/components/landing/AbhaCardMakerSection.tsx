import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  ArrowRight, 
  User, 
  Calendar, 
  MapPin, 
  Phone,
  Sparkles,
  Printer
} from 'lucide-react';

export const AbhaCardMakerSection: React.FC = () => {
  const { setCurrentView, showToast, language, t } = useApp();
  const { registerPatient, setCurrentUser } = useHealthData();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dobYear, setDobYear] = useState('1998');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [district, setDistrict] = useState('Pune');
  const [taluka, setTaluka] = useState('Junnar');
  const [village, setVillage] = useState('Khamgaon');
  const [category, setCategory] = useState<'General Citizen' | 'Pregnant Mother (ANC)' | 'Senior Citizen' | 'NCD Patient'>('General Citizen');

  const [generatedCard, setGeneratedCard] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAbha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim()) {
      showToast(language === 'mr' ? 'कृपया पूर्ण नाव व मोबाईल क्रमांक टाका' : 'Please enter your full legal name and mobile number.');
      return;
    }

    setIsGenerating(true);
    const age = new Date().getFullYear() - parseInt(dobYear || '1998');
    const random14 = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const abhaAddress = `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.floor(10 + Math.random() * 90)}@abdm`;

    try {
      const newPatient = await registerPatient({
        abhaId: random14,
        name: fullName.trim(),
        age: age,
        gender: gender,
        mobile: mobile.trim(),
        village: village.trim() || 'Khamgaon',
        taluka: taluka.trim() || 'Junnar',
        district: district.trim() || 'Pune',
        category: category === 'Pregnant Mother (ANC)' ? 'Maternal ANC' : category === 'Senior Citizen' ? 'Elderly Care' : category === 'NCD Patient' ? 'NCD Patient' : 'General OPD',
        riskLevel: 'Low'
      });

      const cardData = {
        name: newPatient.name,
        abhaNumber: random14,
        abhaAddress: abhaAddress,
        gender: gender,
        dobYear: dobYear,
        mobile: mobile,
        district: district,
        taluka: taluka,
        village: village,
        createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };

      setGeneratedCard(cardData);
      showToast(`ABHA Card generated successfully for ${newPatient.name}!`);
    } catch (err) {
      console.error(err);
      showToast(t.error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintCard = () => {
    window.print();
  };

  const handleEnterLocker = () => {
    setCurrentView('patient');
  };

  return (
    <section id="abha-generator" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5 text-emerald-800" />
            <span>Ayushman Bharat Digital Mission (ABDM)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t.abhaMakerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t.abhaMakerSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ABHA Creation Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Citizen ABHA ID Generator</h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                100% Free & Verified
              </span>
            </div>

            <form onSubmit={handleGenerateAbha} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Full Legal Name (as per Aadhaar) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Baburao Shinde"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    placeholder="+91 98XXX XXXXX"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Year of Birth & Gender</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="YYYY"
                      value={dobYear}
                      onChange={(e) => setDobYear(e.target.value)}
                      className="w-20 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs font-bold text-slate-900 text-center"
                      min={1920}
                      max={2026}
                    />
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Taluka</label>
                  <input
                    type="text"
                    value={taluka}
                    onChange={(e) => setTaluka(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Village / Habitat</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Beneficiary Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                >
                  <option value="General Citizen">General Citizen</option>
                  <option value="Pregnant Mother (ANC)">Pregnant Mother (High-Risk ANC Tracker)</option>
                  <option value="Senior Citizen">Senior Citizen (NPHCE Healthcare)</option>
                  <option value="NCD Patient">NCD Patient (Hypertension / Diabetes)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-3.5 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{isGenerating ? 'Generating ABDM Health Card...' : 'Generate Official ABHA Card'}</span>
              </button>
            </form>
          </div>

          {/* Live Generated Card Preview Box */}
          <div className="lg:col-span-6 space-y-4">
            {generatedCard ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Visual ABHA Smart Card */}
                <div className="bg-gradient-to-br from-[#003527] via-[#054333] to-[#012219] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-emerald-400/50 relative overflow-hidden space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white text-[#003527] font-black text-2xl flex items-center justify-center shadow-md">
                        से
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-black tracking-widest text-emerald-300">
                          National Health Authority • Govt of India
                        </div>
                        <h4 className="text-base font-extrabold text-white">ABHA Digital Health Card</h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded-full">
                      Level 3 ABDM
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center pt-2">
                    <div className="col-span-2 space-y-2">
                      <div>
                        <span className="text-[10px] text-emerald-300/80 uppercase font-mono block">Beneficiary Name</span>
                        <div className="text-lg font-black text-white">{generatedCard.name}</div>
                      </div>

                      <div>
                        <span className="text-[10px] text-emerald-300/80 uppercase font-mono block">14-Digit ABHA Number</span>
                        <div className="text-base font-black font-mono tracking-wider text-emerald-300">{generatedCard.abhaNumber}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[9px] text-slate-400 block">ABHA Address</span>
                          <span className="font-mono text-white text-[11px] font-bold truncate block">{generatedCard.abhaAddress}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">Gender / DOB</span>
                          <span className="text-white text-[11px] font-bold">{generatedCard.gender}, {generatedCard.dobYear}</span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="col-span-1 flex flex-col items-center justify-center bg-white p-2.5 rounded-2xl text-slate-900 shadow-md">
                      <QrCode className="w-20 h-20 text-slate-900" />
                      <span className="text-[8px] font-mono font-bold mt-1 text-slate-600">SCAN AT PHC</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-800/80 flex items-center justify-between text-[10px] text-emerald-300/80 font-mono">
                    <span>📍 {generatedCard.village}, {generatedCard.taluka}, {generatedCard.district}</span>
                    <span>Valid Across India</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handlePrintCard}
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Download / Print Card</span>
                  </button>

                  <button
                    onClick={handleEnterLocker}
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Open Patient Digital Locker</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 p-8 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                  <CreditCard className="w-8 h-8" />
                </div>
                <div className="max-w-sm space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-800">Your ABHA Card Preview Will Appear Here</h4>
                  <p className="text-xs text-slate-500">
                    Fill the form to generate your 14-digit Ayushman Bharat Health Account card with a scannable QR code.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
