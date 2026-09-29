import React, { useState } from 'react';
import Modal from './Modal';

export default function RecordMilestoneModal({ isOpen, onClose, childrenList = [], onRecordMilestone }) {
  const [formData, setFormData] = useState({
    childId: childrenList[0]?.id || 'c1',
    title: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    onRecordMilestone({
      id: `m_${Date.now()}`,
      childId: formData.childId,
      title: formData.title,
      description: formData.description || 'Awarded milestone achievement.',
      date: new Date().toISOString().split('T')[0]
    });

    setFormData({ ...formData, title: '', description: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Milestone Achievement">
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
                {c.name} ({c.grade})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Milestone Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Achieved 40 WPM Touch Typing Certification"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Details & Citation</label>
          <textarea
            rows="3"
            placeholder="Explain what the child accomplished and why it is being celebrated..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            Save Milestone
          </button>
        </div>
      </form>
    </Modal>
  );
}

