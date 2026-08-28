import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  Clock, 
  Activity, 
  Bed, 
  ShieldCheck, 
  Filter, 
  Search, 
  CheckCircle2, 
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const CareFinderSection: React.FC = () => {
  const { setCurrentView, showToast, setIsEmergencyModalOpen, language } = useApp();
  const { facilities, createReferral, openRoleAuthModal } = useHealthData();

  const [searchDistrict, setSearchDistrict] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [onlyIcuAvailable, setOnlyIcuAvailable] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFacilities = facilities.filter(f => {
    const matchesDistrict = searchDistrict === 'All' || f.district === searchDistrict || f.taluka === searchDistrict;
    const matchesType = selectedType === 'All' || f.type === selectedType;
    const matchesIcu = !onlyIcuAvailable || f.icuBedsAvailable > 0;
    const matchesSearch = !searchQuery || 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.taluka.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.village?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesType && matchesIcu && matchesSearch;
  });

  const handleBookFacility = (facilityName: string) => {
    showToast(`OPD Consultation Token allocated at ${facilityName}. Added to your ABHA profile.`);
    setCurrentView('patient');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 border border-slate-300 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Public Health Infrastructure Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Maharashtra Rural Health Network & Bed Tracker
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
              Live facility directory with verified real-time ICU/General bed availability, specialist doctor rosters, and 108 ambulance coordination.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => openRoleAuthModal('facility')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Apply for Hospital Listing</span>
            </button>
            <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-2 rounded-xl">
              {facilities.length} Active Centers
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search hospital or taluka..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* District Filter */}
            <div>
              <select
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Districts & Talukas</option>
                <option value="Pune">Pune District</option>
                <option value="Junnar">Junnar Taluka</option>
                <option value="Nandurbar">Nandurbar (Tribal District)</option>
                <option value="Gadchiroli">Gadchiroli (Tribal District)</option>
              </select>
            </div>

            {/* Facility Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Facility Levels</option>
                <option value="Sub-Centre">Sub-Centre (Arogya Mandir)</option>
                <option value="PHC">Primary Health Centre (PHC)</option>
                <option value="Sub-District Hospital">Sub-District / Rural Hospital</option>
                <option value="District Hospital">District Civil Hospital</option>
              </select>
            </div>

            {/* ICU Only Toggle */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 bg-white border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 cursor-pointer w-full hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={onlyIcuAvailable}
                  onChange={(e) => setOnlyIcuAvailable(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Only with Free ICU Beds</span>
              </label>
            </div>

          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((fac) => {
            const isGovHospital = fac.type.includes('Hospital');
            return (
              <div 
                key={fac.id} 
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-emerald-300 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] uppercase font-black tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {fac.type}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{fac.openStatus}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-emerald-900 transition-colors">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{fac.village ? `${fac.village}, ` : ''}{fac.taluka}, {fac.district} • {fac.distanceKm} km</span>
                    </p>
                  </div>

                  {/* Bed Counters Bar */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">General Beds</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {fac.availableBeds} / {fac.totalBeds} <span className="text-[10px] font-normal text-slate-500">Free</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">ICU / Ventilator</span>
                      <span className={`font-extrabold text-sm ${fac.icuBedsAvailable > 0 ? 'text-blue-700' : 'text-slate-400'}`}>
                        {fac.icuBedsAvailable > 0 ? `${fac.icuBedsAvailable} Available` : 'None / N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Specialists Available */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Duty Specialists & Clinicians</span>
                    <div className="flex flex-wrap gap-1">
                      {fac.specialistsAvailable.map((spec, sidx) => (
                        <span key={sidx} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Essential Medicine Stock Rate */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Essential Drug Stock Rate</span>
                      <span className="font-bold text-emerald-800">{fac.essentialMedicineStockRate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-full rounded-full" 
                        style={{ width: `${fac.essentialMedicineStockRate}%` }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleBookFacility(fac.name)}
                    className="flex-1 bg-[#003527] hover:bg-[#064e3b] text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all text-center flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book OPD Token</span>
                  </button>

                  <a
                    href={`tel:${fac.contactNumber}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2.5 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center"
                    title={`Call Facility Helpdesk ${fac.contactNumber}`}
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
