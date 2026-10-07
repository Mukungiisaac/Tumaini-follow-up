import React, { useState, useRef } from 'react';
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

export default function AddChildModal({ isOpen, onClose, onAddChild }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '10',
    grade: '',
    houseId: '',
    mentor: 'Sarah Johnson',
    joinedDate: '',
    healthStatus: 'Not recorded',
    healthNotes: '',
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
      saved = await onAddChild({
      id: `c_${Date.now()}`,
      name: formData.name.trim(),
      fullName: formData.name.trim(),
      age: parseInt(formData.age, 10),
      grade: formData.grade,
      houseId: formData.houseId,
      cottage: formData.houseId ? `House ${formData.houseId}` : 'Unassigned',
      mentor: formData.mentor,
      joinedDate: formData.joinedDate,
      healthStatus: formData.healthStatus,
      healthNotes: formData.healthNotes.trim(),
      studentInformation: formData.studentInformation,
      image: formData.imageUrl || '',     // empty -> Avatar component shows initials
      status: 'PROGRESSING',
      keyStrength: formData.keyStrength || 'Curiosity',
      personalStatement: formData.personalStatement || 'I want to learn and grow every day.',
      overviewMetrics: { computer: 60, bible: 60, mathScience: 60, arts: 60, music: 60, social: 60 },
      skillsMap: [],
      academicRecords: [],
      observations: [],
      goals: [],
      milestones: []
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

    // Reset
    setFormData({
      name: '', age: '10', grade: '', houseId: '',
      mentor: 'Sarah Johnson', joinedDate: '', healthStatus: 'Not recorded', healthNotes: '', keyStrength: '',
      studentInformation: { ...EMPTY_STUDENT_INFORMATION },
      personalStatement: '', imageUrl: ''
    });
    setSaveError('');
    onClose();
  };

  const hasPhoto = !!formData.imageUrl;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enroll New Child" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Profile Photo Section */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center gap-5">
          {/* Live preview */}
          <div className="relative shrink-0">
            {hasPhoto ? (
              <ChildImage
                src={formData.imageUrl}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[#E8F0F0] shadow-md"
              />
            ) : (
              <InitialAvatar name={formData.name || '?'} size={80} />
            )}
            {hasPhoto && (
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute -top-1 -right-1 p-0.5 bg-rose-500 text-white rounded-full shadow cursor-pointer"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-xs font-bold text-slate-700 uppercase font-mono">Profile Photo <span className="text-slate-400 font-normal normal-case">(optional)</span></p>

            {/* URL input */}
            <input
              type="url"
              placeholder="Paste image URL..."
              value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
              onChange={(e) => setFormData(f => ({ ...f, imageUrl: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />

            {/* File upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#E8F0F0] text-[#0C3440] border border-[#B8CED0] rounded-xl text-xs font-bold hover:bg-[#0C3440] hover:text-white transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Upload from device
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="text-[10px] text-slate-400">If no photo is provided, the child's initials will be displayed automatically.</p>
          </div>
        </div>

          {/* Core Fields */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Joy Wambui"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Age
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
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440] ${
                formData.studentInformation?.dateOfBirth
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 cursor-default'
                  : 'border-slate-200'
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Grade Level</label>
            <select
              required
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440] bg-white"
            >
              <option value="" disabled>Select grade level</option>
              {GRADE_LEVELS.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">House</label>
            <select
              value={formData.houseId}
              onChange={(e) => setFormData({ ...formData, houseId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440] bg-white"
            >
              <option value="">Unassigned</option>
              {HOUSE_IDS.map((id) => <option key={id} value={id}>House {id}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Mentor</label>
            <select
              value={formData.mentor}
              onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440] bg-white"
            >
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="David K.">David K.</option>
              <option value="John D.">John D.</option>
              <option value="Esther M.">Esther M.</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date Joined</label>
            <input
              type="date"
              value={formData.joinedDate}
              onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Health Status</label>
            <select
              value={formData.healthStatus}
              onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440] bg-white"
            >
              <option>Not recorded</option>
              <option>Good</option>
              <option>Under observation</option>
              <option>Ongoing care</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Health Notes</label>
          <textarea
            rows="2"
            value={formData.healthNotes}
            onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
            placeholder="Relevant care notes"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        <StudentInformationFields
          value={formData.studentInformation}
          onChange={(studentInformation) => setFormData({ ...formData, studentInformation })}
          sponsorTitle={`${formData.name.trim() || "Child's"} Sponsor`}
        />

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Key Strength</label>
          <input
            type="text"
            placeholder="e.g. Mathematics, Problem Solving, Music"
            value={formData.keyStrength}
            onChange={(e) => setFormData({ ...formData, keyStrength: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Personal Statement / Dream Quote</label>
          <textarea
            rows="2"
            placeholder='"I want to become a lawyer and protect child rights."'
            value={formData.personalStatement}
            onChange={(e) => setFormData({ ...formData, personalStatement: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        {saveError && <p role="alert" className="text-sm text-rose-700">{saveError}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#0C3440] hover:bg-[#164957] rounded-xl transition-colors shadow-md shadow-[#0C3440]/20"
          >
            {isSaving ? 'Saving...' : 'Enroll Child'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

