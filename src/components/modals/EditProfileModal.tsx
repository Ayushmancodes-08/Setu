import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useHealthData } from '../../context/HealthDataContext';
import { setuDB, DBUser } from '../../services/db';
import { 
  User, 
  X, 
  Check, 
  Phone, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  Camera
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { showToast, language, t } = useApp();
  const { currentUser, setCurrentUser, patients } = useHealthData();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [designation, setDesignation] = useState('');
  const [village, setVillage] = useState('Khamgaon');
  const [taluka, setTaluka] = useState('Junnar');
  const [district, setDistrict] = useState('Pune');
  const [identifierNumber, setIdentifierNumber] = useState('');
  const [avatarInitials, setAvatarInitials] = useState('U');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser && isOpen) {
      setFullName(currentUser.fullName || '');
      setPhone(currentUser.phone || '');
      setFacilityName(currentUser.facilityName || '');
      setDesignation(currentUser.designation || '');
      setVillage(currentUser.village || 'Khamgaon');
      setTaluka(currentUser.taluka || 'Junnar');
      setDistrict(currentUser.district || 'Pune');
      setIdentifierNumber(currentUser.identifierNumber || '');
      setAvatarInitials(currentUser.avatarInitials || (currentUser.fullName ? currentUser.fullName.slice(0, 2).toUpperCase() : 'U'));
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Full name is required.');
      return;
    }

    setIsSaving(true);
    try {
      const initials = fullName
        .trim()
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U';

      const updatedUser: DBUser = {
        ...currentUser,
        fullName: fullName.trim(),
        phone: phone.trim(),
        facilityName: facilityName.trim(),
        designation: designation.trim(),
        taluka: taluka.trim(),
        district: district.trim(),
        identifierNumber: identifierNumber.trim(),
        avatarInitials: initials,
        village: village.trim()
      } as any;

      // Update active session & user in IndexedDB
      await setuDB.putItem('users', updatedUser);
      await setuDB.setActiveSession(updatedUser);

      // If user is a citizen/patient, also sync the patient record
      if (currentUser.role === 'patient') {
        const matchedPatient = patients.find(p => 
          p.abhaId === currentUser.identifierNumber ||
          p.mobile.replace(/[\s-+]/g, '') === currentUser.phone.replace(/[\s-+]/g, '') ||
          p.name.toLowerCase() === currentUser.fullName.toLowerCase()
        );

        if (matchedPatient) {
          await setuDB.putItem('patients', {
            ...matchedPatient,
            name: fullName.trim(),
            mobile: phone.trim(),
            village: village.trim(),
            taluka: taluka.trim(),
            district: district.trim(),
            abhaId: identifierNumber.trim() || matchedPatient.abhaId
          });
        }
      }

      // Update state in React context
      setCurrentUser(updatedUser);
      showToast(`Profile updated successfully! Synced across all portals.`);
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      showToast('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#003527] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
              {avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {currentUser.role.toUpperCase()} PROFILE
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  ABDM Synced
                </span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">Edit Profile & Account Details</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Legal Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rajesh Kumar Shinde / Dr. Rohini Kulkarni"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Phone *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98230 44512"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {currentUser.role === 'patient' ? 'ABHA Health Number' : 'License / Registration No'}
              </label>
              <input
                type="text"
                value={identifierNumber}
                onChange={(e) => setIdentifierNumber(e.target.value)}
                placeholder={currentUser.role === 'patient' ? '91-4821-9902-3312' : 'MMC-2016-99410'}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {currentUser.role === 'patient' ? 'Assigned Facility / Sub-Centre' : 'Affiliated Facility / Health Centre'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="e.g. Khamgaon Ayushman Arogya Mandir / Otur PHC"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <Building2 className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Designation / Role Title</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Citizen (Khamgaon Village) / Community Health Officer"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Village / Sector</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Taluka</label>
              <input
                type="text"
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#003527] hover:bg-[#064e3b] text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{isSaving ? 'Saving...' : 'Save & Sync Details'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
