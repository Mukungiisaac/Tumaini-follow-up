import React, { useState } from 'react';
import Modal from './Modal';

export default function RecordObservationModal({ isOpen, onClose, childrenList = [], onRecordObservation }) {
  const [formData, setFormData] = useState({
    childId: childrenList[0]?.id || 'c1',
    area: 'Computer',
    text: '',
    strength: '',
    challenge: '',
    nextStep: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text) return;

    onRecordObservation({
      id: `ob_${Date.now()}`,
      childId: formData.childId,
      date: new Date().toISOString().split('T')[0],
      area: formData.area,
      text: formData.text,
      strength: formData.strength || 'Perseverance',
      challenge: formData.challenge || 'None noted',
      nextStep: formData.nextStep || 'Follow up next week'
    });

    setFormData({ ...formData, text: '', strength: '', challenge: '', nextStep: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Mentor Observation">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Child</label>
          <select
            value={formData.childId}
            onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440] bg-white"
          >
            {childrenList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.grade} | {c.cottage})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Development Area</label>
          <select
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440] bg-white"
          >
            <option value="Computer">Computer & Digital Skills</option>
            <option value="Bible & Discipleship">Bible & Discipleship</option>
            <option value="Math & Science">Math & Science</option>
            <option value="Social Skills">Social & Emotional Skills</option>
            <option value="Music & Creative Arts">Music & Creative Arts</option>
            <option value="Mentorship">Mentorship & Character</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Observation Note</label>
          <textarea
            rows="3"
            required
            placeholder="Write a brief, meaningful observation..."
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Strength Noticed</label>
            <input
              type="text"
              placeholder="e.g. Speed Math, Helping Peers"
              value={formData.strength}
              onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Challenge / Friction</label>
            <input
              type="text"
              placeholder="e.g. Shyness, Math anxiety"
              value={formData.challenge}
              onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Recommended Next Step</label>
          <input
            type="text"
            placeholder="e.g. Assign peer tutor for fractions"
            value={formData.nextStep}
            onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
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
            Save Observation
          </button>
        </div>
      </form>
    </Modal>
  );
}

