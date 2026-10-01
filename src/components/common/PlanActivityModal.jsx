import React, { useState } from 'react';
import Modal from './Modal';
import { MOCK_MENTORS } from '../../data/mockData';

export default function PlanActivityModal({ isOpen, onClose, onAddActivity, categoryOptions = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Computer',
    date: '',
    time: '15:30',
    location: 'IT Lab 1',
    cottages: 'All Cottages',
    mentor: 'Sarah Johnson',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Format display date
    const formattedDate = formData.date ? new Date(formData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Upcoming';
    const timeLabel = formData.time
      ? new Date(`1970-01-01T${formData.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      : '3:30 PM';
    const displayDate = `${formattedDate}, ${timeLabel}`;

    onAddActivity({
      id: `act-${Date.now()}`,
      title: formData.title.trim(),
      category: formData.category,
      date: formData.date,
      time: formData.time,
      displayDate,
      location: formData.location.trim() || 'IT Lab 1',
      cottages: formData.cottages,
      mentor: formData.mentor,
      status: 'Upcoming',
      attendees: [],
      description: formData.description.trim() || 'Interactive group workshop and hands-on skill rehearsal.'
    });

    setFormData({
      title: '',
      category: 'Computer',
      date: '',
      time: '15:30',
      location: 'IT Lab 1',
      cottages: 'All Cottages',
      mentor: 'Sarah Johnson',
      description: ''
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Plan New Group Activity & Workshop" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Activity Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
            Activity Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Scratch Animation & Logic Challenge"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        {/* Category & Lead Mentor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Category *
            </label>
            <input
              list="plan-activity-categories"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Enter or choose a category"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
            />
            <datalist id="plan-activity-categories">
              {categoryOptions.map((category) => <option key={category} value={category} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Lead Mentor / Facilitator *
            </label>
            <select
              value={formData.mentor}
              onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            >
              {MOCK_MENTORS.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Event Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Start Time *
            </label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />
          </div>
        </div>

        {/* Location & Targeted Cottages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Meeting Location *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. IT Lab 1, Village Chapel"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
              Target Cottages *
            </label>
            <select
              value={formData.cottages}
              onChange={(e) => setFormData({ ...formData, cottages: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            >
              <option value="All Cottages">All Cottages</option>
              <option value="Hope House & Joy Villa">Hope House & Joy Villa</option>
              <option value="Cottage 'B'">Cottage 'B'</option>
              <option value="Peace Cabin">Peace Cabin</option>
            </select>
          </div>
        </div>

        {/* Description / Agenda */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-1">
            Agenda & Objectives
          </label>
          <textarea
            rows="3"
            placeholder="Key learning outcomes, materials required, or activity guidelines..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        {/* Modal Buttons */}
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
            Schedule Activity
          </button>
        </div>
      </form>
    </Modal>
  );
}

