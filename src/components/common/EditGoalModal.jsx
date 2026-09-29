import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export default function EditGoalModal({ isOpen, onClose, goal, onUpdateGoal }) {
  const [formData, setFormData] = useState({
    title: '',
    area: 'Computer',
    targetDate: '',
    progress: 0,
    status: 'In Progress',
    note: ''
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || '',
        area: goal.area || 'Computer',
        targetDate: goal.targetDate || '',
        progress: goal.progress || 0,
        status: goal.status || 'In Progress',
        note: goal.note || ''
      });
    }
  }, [goal]);

  if (!goal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onUpdateGoal(goal.childId, {
      ...goal,
      title: formData.title.trim(),
      area: formData.area,
      targetDate: formData.targetDate.trim(),
      progress: parseInt(formData.progress, 10) || 0,
      status: formData.status,
      note: formData.note.trim()
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Goal & Target Details">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
            Goal Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Master PowerPoint Presentation"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Target Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Curriculum Area
            </label>
            <select
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            >
              <option value="Computer">Computer & IT</option>
              <option value="Bible">Bible & Discipleship</option>
              <option value="Math & Science">Math & Science</option>
              <option value="Social Skills">Social Skills</option>
              <option value="Music & Arts">Music & Arts</option>
              <option value="Mentorship">Mentorship & Leadership</option>
            </select>
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Target Completion Date
            </label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />
          </div>
        </div>

        {/* Status & Progress Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Current Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Progress Percentage */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Current Progress (%)</label>
              <span className="text-xs font-bold text-[#0C3440] font-mono">{formData.progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={(e) => {
                const val = Number(e.target.value);
                let st = formData.status;
                if (val === 100) st = 'Completed';
                else if (val > 0 && st === 'Not Started') st = 'In Progress';
                setFormData({ ...formData, progress: val, status: st });
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0C3440]"
            />
          </div>
        </div>

        {/* Mentor Action Plan / Note */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
            Action Plan / Mentor Notes
          </label>
          <textarea
            rows="3"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Log current progress details, next steps, or rehearsals..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        {/* Action Buttons */}
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
            className="px-5 py-2 text-xs font-bold text-white bg-[#0C3440] hover:bg-[#164957] rounded-xl shadow-md shadow-[#0C3440]/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

