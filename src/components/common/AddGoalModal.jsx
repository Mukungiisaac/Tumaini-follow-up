import React, { useState } from 'react';
import Modal from './Modal';

export default function AddGoalModal({ isOpen, onClose, childrenList = [], onAddGoal }) {
  const [formData, setFormData] = useState({
    childId: childrenList[0]?.id || 'c1',
    title: '',
    area: 'Computer',
    targetDate: '2026-09-30',
    note: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    onAddGoal({
      id: `g_${Date.now()}`,
      childId: formData.childId,
      title: formData.title,
      area: formData.area,
      targetDate: formData.targetDate,
      progress: 0,
      status: 'Not Started',
      note: formData.note || 'Goal initiated by mentor.'
    });

    setFormData({ ...formData, title: '', note: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Development Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Child</label>
          <select
            value={formData.childId}
            onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#134E5E] bg-white"
          >
            {childrenList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.grade})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Goal Description</label>
          <input
            type="text"
            required
            placeholder="e.g. Create and present a PowerPoint deck independently"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Development Area</label>
            <select
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#134E5E] bg-white"
            >
              <option value="Computer">Computer</option>
              <option value="Bible">Bible & Discipleship</option>
              <option value="Math">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Social Skills">Social Skills</option>
              <option value="Music">Music & Arts</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Completion Date</label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#134E5E]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mentor Action Plan / Notes</label>
          <textarea
            rows="2"
            placeholder="Key milestones or resources provided..."
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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
            Save Goal
          </button>
        </div>
      </form>
    </Modal>
  );
}
