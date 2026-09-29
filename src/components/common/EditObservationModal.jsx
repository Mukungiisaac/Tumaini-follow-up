import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { MOCK_CHILDREN } from '../../data/mockData';

export default function EditObservationModal({ isOpen, onClose, observation, childrenList, onUpdateObservation }) {
  const [formData, setFormData] = useState({
    childId: '',
    date: '',
    area: 'Computer',
    text: '',
    strength: '',
    challenge: '',
    nextStep: ''
  });

  useEffect(() => {
    if (observation) {
      setFormData({
        childId: observation.childId || '',
        date: observation.date || '',
        area: observation.area || 'Computer',
        text: observation.text || '',
        strength: observation.strength || '',
        challenge: observation.challenge || '',
        nextStep: observation.nextStep || ''
      });
    }
  }, [observation]);

  if (!observation) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;
    onUpdateObservation({
      ...observation,
      childId: formData.childId,
      date: formData.date,
      area: formData.area,
      text: formData.text.trim(),
      strength: formData.strength.trim(),
      challenge: formData.challenge.trim(),
      nextStep: formData.nextStep.trim()
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Observation Note" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Child & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Student *</label>
            <select
              value={formData.childId}
              onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            >
              {(childrenList || []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />
          </div>
        </div>

        {/* Area */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Curriculum Area *</label>
          <select
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          >
            <option value="Computer">Computer & IT</option>
            <option value="Bible & Discipleship">Bible & Discipleship</option>
            <option value="Math & Science">Math & Science</option>
            <option value="Arts & Creative">Arts & Creative</option>
            <option value="Social">Social Skills</option>
            <option value="Mentorship">Mentorship</option>
          </select>
        </div>

        {/* Observation Text */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">Observation Note *</label>
          <textarea
            required
            rows="3"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Describe what was observed..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440] resize-none"
          />
        </div>

        {/* Strength / Challenge / Next Step */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-emerald-700 uppercase font-mono mb-1">Strength Noticed</label>
            <input
              type="text"
              value={formData.strength}
              onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              placeholder="e.g. Peer Leadership"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-rose-700 uppercase font-mono mb-1">Challenge / Friction</label>
            <input
              type="text"
              value={formData.challenge}
              onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              placeholder="e.g. Patience"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#0C3440] uppercase font-mono mb-1">Recommended Next Step</label>
            <input
              type="text"
              value={formData.nextStep}
              onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              placeholder="e.g. Assign peer mentor role"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#0C3440] hover:bg-[#164957] rounded-xl transition-colors shadow-md shadow-[#0C3440]/20 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

