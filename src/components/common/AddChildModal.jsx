import React, { useState } from 'react';
import Modal from './Modal';

export default function AddChildModal({ isOpen, onClose, onAddChild }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '10',
    grade: 'Grade 5',
    cottage: "Cottage 'B'",
    mentor: 'Sarah Johnson',
    keyStrength: '',
    currentFocus: '',
    personalStatement: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    onAddChild({
      id: `c_${Date.now()}`,
      name: formData.name,
      fullName: formData.name,
      age: parseInt(formData.age, 10),
      grade: formData.grade,
      cottage: formData.cottage,
      mentor: formData.mentor,
      image: '/assets/children/samuel_o.jpg',
      status: 'PROGRESSING',
      keyStrength: formData.keyStrength || 'Curiosity',
      currentFocus: formData.currentFocus || 'Computer Basics',
      personalStatement: formData.personalStatement || "I want to learn and grow every day.",
      overviewMetrics: { computer: 60, bible: 60, mathScience: 60, arts: 60, music: 60, social: 60 },
      skillsMap: [],
      observations: [],
      goals: [],
      milestones: []
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enroll New Child">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Joy Wambui"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Age</label>
            <input
              type="number"
              min="4"
              max="18"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Grade Level</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#134E5E] bg-white"
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cottage</label>
            <select
              value={formData.cottage}
              onChange={(e) => setFormData({ ...formData, cottage: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#134E5E] bg-white"
            >
              <option value="Cottage 'B'">Cottage 'B'</option>
              <option value="Hope House">Hope House</option>
              <option value="Joy Villa">Joy Villa</option>
              <option value="Peace Cabin">Peace Cabin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Mentor</label>
            <select
              value={formData.mentor}
              onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#134E5E] bg-white"
            >
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="David K.">David K.</option>
              <option value="John D.">John D.</option>
              <option value="Esther M.">Esther M.</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Key Strength</label>
          <input
            type="text"
            placeholder="e.g. Mathematics, Problem Solving, Music"
            value={formData.keyStrength}
            onChange={(e) => setFormData({ ...formData, keyStrength: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Focus Area</label>
          <input
            type="text"
            placeholder="e.g. Touch Typing, Reading, Fractions"
            value={formData.currentFocus}
            onChange={(e) => setFormData({ ...formData, currentFocus: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Personal Statement / Dream Quote</label>
          <textarea
            rows="2"
            placeholder='"I want to become a lawyer and protect child rights."'
            value={formData.personalStatement}
            onChange={(e) => setFormData({ ...formData, personalStatement: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
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
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#134E5E] hover:bg-[#0E3D4A] rounded-xl transition-colors shadow-md shadow-[#134E5E]/20"
          >
            Enroll Child
          </button>
        </div>
      </form>
    </Modal>
  );
}
