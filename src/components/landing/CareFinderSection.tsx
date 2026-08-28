import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MAHARASHTRA_FACILITIES } from '../../data/mockData';
import { Facility } from '../../types';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Bed, 
  Stethoscope, 
  Pill, 
  Search, 
  Filter, 
  Video, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const CareFinderSection: React.FC = () => {
  const { t, language, setCurrentView, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  const filteredFacilities = MAHARASHTRA_FACILITIES.filter(fac => {
    const matchesSearch = 
      fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.nameMr.includes(searchTerm) ||
      fac.taluka.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fac.village && fac.village.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'All' || fac.type === selectedType;
    const matchesDistrict = selectedDistrict === 'All' || fac.district === selectedDistrict;

    return matchesSearch && matchesType && matchesDistrict;
  });

  return (
    <section id="find-care" className="py-20 bg-slate-50 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Public Health Network Directory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002117] tracking-tight">
            {t.careFinderTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t.careFinderSubtitle}
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by facility name, Junnar, Otur, Nandurbar, Gadchiroli..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
            {/* Facility Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">{t.filterAll}</option>
              <option value="Sub-Centre">{t.filterSubCentre}</option>
              <option value="PHC">{t.filterPHC}</option>
              <option value="Sub-District Hospital">{t.filterHospital}</option>
              <option value="Diagnostic Lab">{t.filterLabs}</option>
            </select>

            {/* District Filter */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Districts (सर्व जिल्हे)</option>
              <option value="Pune">Pune (पुणे)</option>
              <option value="Gadchiroli">Gadchiroli (गडचिरोली)</option>
              <option value="Nandurbar">Nandurbar (नंदुरबार)</option>
              <option value="Palghar">Palghar (पालघर)</option>
            </select>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 hover:border-emerald-300"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    fac.type === 'Sub-Centre' ? 'bg-teal-50 text-teal-800 border border-teal-200' :
                    fac.type === 'PHC' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    fac.type === 'Diagnostic Lab' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                    'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}>
                    {fac.type}
                  </span>
                  
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3" />
                    {fac.openStatus}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mt-2 tracking-tight leading-snug">
                  {language === 'mr' ? fac.nameMr : fac.name}
                </h3>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{fac.village ? `${fac.village}, ` : ''}{fac.taluka}, {fac.district} ({fac.distanceKm} km)</span>
                </div>
              </div>

              {/* Real-time Indicators */}
              <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-xs">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <div className="text-slate-500 flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-slate-400" />
                    <span>Available Beds</span>
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                    {fac.availableBeds} / {fac.totalBeds}
                  </div>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl">
                  <div className="text-slate-500 flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5 text-amber-500" />
                    <span>Medicine Stock</span>
                  </div>
                  <div className="font-extrabold text-emerald-700 text-sm mt-0.5">
                    {fac.essentialMedicineStockRate}% in stock
                  </div>
                </div>
              </div>

              {/* Specialists list */}
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Stethoscope className="w-3 h-3 text-emerald-600" />
                  <span>Duty Staff / Specialists:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {fac.specialistsAvailable.slice(0, 3).map((spec, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                      {spec}
                    </span>
                  ))}
                  {fac.specialistsAvailable.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-semibold px-1">
                      +{fac.specialistsAvailable.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`tel:${fac.contactNumber.replace(/\s+/g, '')}`}
                  className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.callFacility}</span>
                </a>

                {fac.teleconsultationActive && (
                  <button
                    onClick={() => {
                      showToast(`Connecting to ${fac.name} Telemedicine OPD queue...`);
                      setCurrentView('patient');
                    }}
                    className="flex-1 bg-[#003527] hover:bg-[#064e3b] text-white text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Teleconsult</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredFacilities.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">No healthcare facilities found matching the filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};
