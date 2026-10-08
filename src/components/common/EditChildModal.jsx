import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { Upload, X } from 'lucide-react';
import { GRADE_LEVELS, HOUSE_IDS } from '../../data/mockData';
import StudentInformationFields from './StudentInformationFields';
import { EMPTY_STUDENT_INFORMATION } from '../../data/studentInformation';
import ChildImage from './ChildImage';

/**
 * Resize + compress a File/Blob to a JPEG base64 data URL.
 * maxDim: longest edge in px. quality: 0–1 JPEG quality.
 */
function compressImageToBase64(file, maxDim = 400, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image file.')); };
    img.src = url;
  });
}

/** Calculate completed years from a YYYY-MM-DD date string. Returns '' if invalid. */
function calcAgeFromDob(dob) {
  if (!dob) return '';
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? String(age) : '';
}

/* Inline letter-avatar shown when no photo is provided */
function InitialAvatar({ name, size = 80 }) {
  const letter = (name || '?').trim()[0].toUpperCase();
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="rounded-full bg-[#0C3440] text-white flex items-center justify-center font-black font-mono select-none shrink-0"
    >
      {letter}
    </div>
  );
}

export default function EditChildModal({ isOpen, onClose, child, onUpdateChild }) {
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    age: '',
    grade: 'Grade 7',
    houseId: '',
    mentor: 'Sarah Johnson',
    joinedDate: '',
    healthStatus: 'Not recorded',
    healthNotes: '',
    status: 'ON TRACK',
    keyStrength: '',
    studentInformation: { ...EMPTY_STUDENT_INFORMATION },
    personalStatement: '',
    imageUrl: ''
  });

  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Auto-calculate age whenever Date of Birth changes inside StudentInformationFields
  useEffect(() => {
    const dob = formData.studentInformation?.dateOfBirth;
    const calculated = calcAgeFromDob(dob);
    if (calculated) {
      setFormData((prev) => ({ ...prev, age: calculated }));
    }
  }, [formData.studentInformation?.dateOfBirth]);

  useEffect(() => {
    if (child) {
      setSaveError('');
      setFormData({
        name: child.name || '',
        fullName: child.fullName || child.name || '',
        age: child.age || '',
        grade: child.grade || 'Grade 7',
        houseId: child.houseId || '',
        mentor: child.mentor || 'Sarah Johnson',
        joinedDate: child.joinedDate || '',
        healthStatus: child.healthStatus || 'Not recorded',
        healthNotes: child.healthNotes || '',
        status: child.status || 'ON TRACK',
        keyStrength: child.keyStrength || '',
        studentInformation: {
          ...EMPTY_STUDENT_INFORMATION,
          ...child.studentInformation,
          birthCertificateName: { ...EMPTY_STUDENT_INFORMATION.birthCertificateName, ...child.studentInformation?.birthCertificateName },
          mother: { ...EMPTY_STUDENT_INFORMATION.mother, ...child.studentInformation?.mother },
          father: { ...EMPTY_STUDENT_INFORMATION.father, ...child.studentInformation?.father },
          guardian: { ...EMPTY_STUDENT_INFORMATION.guardian, ...child.studentInformation?.guardian }
        },
        personalStatement: child.personalStatement || '',
        imageUrl: child.image || ''
      });
    }
  }, [child]);

  if (!child) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaveError('');
    try {
      const base64 = await compressImageToBase64(file);
      setFormData((prev) => ({ ...prev, imageUrl: base64 }));
    } catch {
      setSaveError('Could not read the selected image. Please try another file.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearPhoto = () => {
    setFormData(f => ({ ...f, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSaving(true);
    setSaveError('');
    let saved;
    let failureMessage = '';
    try {
      // imageFile is null — photo is already embedded as base64 in formData.imageUrl
      saved = await onUpdateChild({
      ...child,
      name: formData.name.trim(),
      fullName: formData.fullName.trim() || formData.name.trim(),
      age: parseInt(formData.age, 10) || child.age,
      grade: formData.grade,
      houseId: formData.houseId,
      cottage: formData.houseId ? `House ${formData.houseId}` : 'Unassigned',
      mentor: formData.mentor,
      joinedDate: formData.joinedDate,
      healthStatus: formData.healthStatus,
      healthNotes: formData.healthNotes.trim(),
      status: formData.status,
      keyStrength: formData.keyStrength.trim(),
      studentInformation: formData.studentInformation,
      personalStatement: formData.personalStatement.trim(),
      image: formData.imageUrl || ''
      }, null);
    } catch (error) {
      saved = false;
      failureMessage = error?.message || 'Could not upload the child photo. Please try again.';
    } finally {
      setIsSaving(false);
    }
    if (saved === false) {
      setSaveError(failureMessage || 'Could not save the child or upload the photo. Please try again.');
      return;
    }

    onClose();
  };

  const hasPhoto = !!formData.imageUrl;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Profile - ${child.name}`} maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Profile Photo Section */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-start gap-5">
            {/* Live preview */}
            <div className="relative shrink-0">
              {hasPhoto ? (
                <ChildImage
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
              ) : (
                <InitialAvatar name={formData.name || child.name} size={96} />
              )}
              {hasPhoto && (
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="absolute -top-1 -right-1 p-1 bg-rose-500 text-white rounded-full shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
                  title="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Profile Photo <span className="text-slate-400 font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <p className="text-xs text-slate-500">Upload a photo or paste an image URL</p>
              </div>

              {/* URL input */}
              <input
                type="url"
                placeholder="Paste image URL..."
                value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                onChange={(e) => setFormData(f => ({ ...f, imageUrl: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              />

              {/* File upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center w-10 h-10 bg-brand-primary text-white border border-brand-primary rounded-lg hover:bg-[#0a2d38] transition-colors cursor-pointer shadow-sm"
                title="Upload from device"
              >
                <Upload className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <p className="text-xs text-slate-500 italic">If no photo is provided, the child's initials will display automatically.</p>
            </div>
          </div>
        </div>

        {/* Identity Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Short Display Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Samuel O."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Samuel Omondi"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Age (Years)
              {formData.studentInformation?.dateOfBirth && (
                <span className="ml-1 text-[10px] font-normal normal-case text-emerald-600">· auto-calculated</span>
              )}
            </label>
            <input
              type="number"
              min="1"
              max="25"
              value={formData.age}
              readOnly={!!formData.studentInformation?.dateOfBirth}
              onChange={(e) => !formData.studentInformation?.dateOfBirth && setFormData({ ...formData, age: e.target.value })}
              className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440] ${
                formData.studentInformation?.dateOfBirth
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 cursor-default'
                  : 'border-slate-200'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Grade Level</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            >
              {GRADE_LEVELS.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">House</label>
            <select
              value={formData.houseId}
              onChange={(e) => setFormData({ ...formData, houseId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            >
              <option value="">Unassigned</option>
              {HOUSE_IDS.map((id) => <option key={id} value={id}>House {id}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Assigned Mentor</label>
            <select
              value={formData.mentor}
              onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            >
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="David K.">David K.</option>
              <option value="John D.">John D.</option>
              <option value="Esther M.">Esther M.</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Date Joined</label>
            <input
              type="date"
              value={formData.joinedDate}
              onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Health Status</label>
            <select
              value={formData.healthStatus}
              onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            >
              <option>Not recorded</option>
              <option>Good</option>
              <option>Under observation</option>
              <option>Ongoing care</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Health Notes</label>
          <textarea
            rows="2"
            value={formData.healthNotes}
            onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
            placeholder="Relevant care notes"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        <StudentInformationFields
          value={formData.studentInformation}
          onChange={(studentInformation) => setFormData({ ...formData, studentInformation })}
          sponsorTitle={`${formData.fullName.trim() || formData.name.trim() || child.name} Sponsor`}
        />

        {/* Status Radio */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Overall Status</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ON TRACK', label: 'ON TRACK', active: 'bg-emerald-600 text-white border-emerald-600' },
              { id: 'PROGRESSING', label: 'PROGRESSING', active: 'bg-brand-primary text-white border-brand-primary' },
              { id: 'NEEDS SUPPORT', label: 'NEEDS SUPPORT', active: 'bg-rose-600 text-white border-rose-600' }
            ].map((st) => (
              <label key={st.id} className="cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={st.id}
                  checked={formData.status === st.id}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="sr-only peer"
                />
                <div className={`p-2 text-center rounded-xl text-[11px] font-bold border transition-all ${
                  formData.status === st.id
                    ? st.active
                    : 'border-slate-200 text-slate-700 bg-slate-50 hover:border-slate-300'
                }`}>
                  {st.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Key Strength */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Key Strength / Aptitude</label>
          <input
            type="text"
            value={formData.keyStrength}
            onChange={(e) => setFormData({ ...formData, keyStrength: e.target.value })}
            placeholder="e.g. Computer Engineering, Problem Solving"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        {/* Personal Statement */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Personal Statement / Aspirations</label>
          <textarea
            rows="2"
            value={formData.personalStatement}
            onChange={(e) => setFormData({ ...formData, personalStatement: e.target.value })}
            placeholder="Child's dream or personal goal..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        {saveError && <p role="alert" className="text-sm text-rose-700">{saveError}</p>}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary rounded-xl shadow-md shadow-brand-primary/20 transition-all"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

