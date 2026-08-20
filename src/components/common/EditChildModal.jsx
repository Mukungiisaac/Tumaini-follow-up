import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function EditChildModal({ isOpen, onClose, child, onUpdateChild }) {
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    age: '',
    grade: 'Grade 7',
    cottage: "Cottage 'B'",
    mentor: 'Sarah Johnson',
    status: 'ON TRACK',
    keyStrength: '',
    currentFocus: '',
    personalStatement: ''
  });

  useEffect(() => {
    if (child) {
      setFormData({
        name: child.name || '',
        fullName: child.fullName || child.name || '',
        age: child.age || '',
        grade: child.grade || 'Grade 7',
        cottage: child.cottage || "Cottage 'B'",
        mentor: child.mentor || 'Sarah Johnson',
        status: child.status || 'ON TRACK',
        keyStrength: child.keyStrength || '',
        currentFocus: child.currentFocus || '',
        personalStatement: child.personalStatement || ''
      });
    }
  }, [child]);

  if (!child) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onUpdateChild({
      ...child,
      name: formData.name.trim(),
      fullName: formData.fullName.trim() || formData.name.trim(),
      age: parseInt(formData.age, 10) || child.age,
      grade: formData.grade,
      cottage: formData.cottage,
      mentor: formData.mentor,
      status: formData.status,
      keyStrength: formData.keyStrength.trim(),
      currentFocus: formData.currentFocus.trim(),
      personalStatement: formData.personalStatement.trim()
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Profile — ${child.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Short Display Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Samuel O."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Samuel Omondi"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Age (Years)
            </label>
            <input
              type="number"
              min="3"
              max="20"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
            />
          </div>

          {/* Grade */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Grade Level
            </label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
            >
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Form 1 (High School)">Form 1 (High School)</option>
              <option value="Form 2 (High School)">Form 2 (High School)</option>
              <option value="Form 3 (High School)">Form 3 (High School)</option>
              <option value="Form 4 (High School)">Form 4 (High School)</option>
            </select>
          </div>

          {/* Cottage */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Cottage / Residence
            </label>
            <select
              value={formData.cottage}
              onChange={(e) => setFormData({ ...formData, cottage: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
            >
              <option value="Cottage 'B'">Cottage 'B'</option>
              <option value="Hope House">Hope House</option>
              <option value="Joy Villa">Joy Villa</option>
              <option value="Peace Cabin">Peace Cabin</option>
              <option value="Grace Cottage">Grace Cottage</option>
            </select>
          </div>

          {/* Mentor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Assigned Mentor
            </label>
            <select
              value={formData.mentor}
              onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
            >
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="David K.">David K.</option>
              <option value="John D.">John D.</option>
              <option value="Esther M.">Esther M.</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
            Overall Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ON TRACK', label: 'ON TRACK', color: 'peer-checked:bg-emerald-600 peer-checked:text-white' },
              { id: 'PROGRESSING', label: 'PROGRESSING', color: 'peer-checked:bg-indigo-600 peer-checked:text-white' },
              { id: 'NEEDS SUPPORT', label: 'NEEDS SUPPORT', color: 'peer-checked:bg-rose-600 peer-checked:text-white' }
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
                <div className={`p-2 text-center rounded-xl text-[11px] font-bold border border-slate-200 text-slate-700 bg-slate-50 transition-all ${st.color}`}>
                  {st.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Key Strength */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
            Key Strength / Aptitude
          </label>
          <input
            type="text"
            value={formData.keyStrength}
            onChange={(e) => setFormData({ ...formData, keyStrength: e.target.value })}
            placeholder="e.g. Computer Engineering, Problem Solving"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
          />
        </div>

        {/* Current Focus */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
            Current Focus Area
          </label>
          <input
            type="text"
            value={formData.currentFocus}
            onChange={(e) => setFormData({ ...formData, currentFocus: e.target.value })}
            placeholder="e.g. Web Development & Coding"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
          />
        </div>

        {/* Personal Statement */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
            Personal Statement / Aspirations
          </label>
          <textarea
            rows="2"
            value={formData.personalStatement}
            onChange={(e) => setFormData({ ...formData, personalStatement: e.target.value })}
            placeholder="Child's dream or personal goal..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
          />
        </div>

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
            className="px-5 py-2 text-xs font-bold text-white bg-[#134E5E] hover:bg-[#0E3D4A] rounded-xl shadow-md shadow-[#134E5E]/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
