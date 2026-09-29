import React, { useState, useRef } from 'react';
import Modal from './Modal';
import { Camera, Upload, X } from 'lucide-react';
import { GRADE_LEVELS, HOUSE_IDS } from '../../data/mockData';
import StudentInformationFields from './StudentInformationFields';
import { EMPTY_STUDENT_INFORMATION } from '../../data/studentInformation';

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
    imageUrl: ''       // optional URL or base64
  });

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormData(f => ({ ...f, imageUrl: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setFormData(f => ({ ...f, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onAddChild({
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
      image: formData.imageUrl || '',     // empty â†’ Avatar component shows initials
      status: 'PROGRESSING',
      keyStrength: formData.keyStrength || 'Curiosity',
      personalStatement: formData.personalStatement || 'I want to learn and grow every day.',
      overviewMetrics: { computer: 60, bible: 60, mathScience: 60, arts: 60, music: 60, social: 60 },
      skillsMap: [],
      academicRecords: [],
      observations: [],
      goals: [],
      milestones: []
    });

    // Reset
    setFormData({
      name: '', age: '10', grade: '', houseId: '',
      mentor: 'Sarah Johnson', joinedDate: '', healthStatus: 'Not recorded', healthNotes: '', keyStrength: '',
      studentInformation: { ...EMPTY_STUDENT_INFORMATION },
      personalStatement: '', imageUrl: ''
    });
    onClose();
  };

  const hasPhoto = !!formData.imageUrl;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enroll New Child" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* â”€â”€ Profile Photo Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center gap-5">
          {/* Live preview */}
          <div className="relative shrink-0">
            {hasPhoto ? (
              <img
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

        {/* â”€â”€ Core Fields â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age</label>
            <input
              type="number"
              min="3"
              max="18"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
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
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#0C3440] hover:bg-[#164957] rounded-xl transition-colors shadow-md shadow-[#0C3440]/20"
          >
            Enroll Child
          </button>
        </div>
      </form>
    </Modal>
  );
}

