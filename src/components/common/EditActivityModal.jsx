import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { MOCK_MENTORS } from '../../data/mockData';

export default function EditActivityModal({ isOpen, onClose, activity, onUpdateActivity, categoryOptions = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Computer',
    date: '',
    time: '15:30',
    location: 'IT Lab 1',
    houses: 'All Houses',
    mentor: '',
    status: 'Upcoming',
    description: ''
  });

  const [mentorSearchOpen, setMentorSearchOpen] = useState(false);
  const [mentorSearch, setMentorSearch] = useState('');

  const filteredMentors = mentorSearch
    ? MOCK_MENTORS.filter((m) =>
        m.name.toLowerCase().includes(mentorSearch.toLowerCase()) ||
        m.role.toLowerCase().includes(mentorSearch.toLowerCase())
      )
    : MOCK_MENTORS;

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || '',
        category: activity.category || 'Computer',
        date: activity.date || '',
        time: activity.time || '15:30',
        location: activity.location || '',
        houses: activity.houses || activity.cottages || 'All Houses',
        mentor: activity.mentor || '',
        status: activity.status || 'Upcoming',
        description: activity.description || ''
      });
      setMentorSearch('');
    }
  }, [activity]);

  if (!activity) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.mentor.trim()) return;

    // Format display date
    const formattedDate = formData.date
      ? new Date(formData.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      : 'Upcoming';
    const timeLabel = formData.time
      ? new Date(`1970-01-01T${formData.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      : '3:30 PM';
    const displayDate = `${formattedDate}, ${timeLabel}`;

    onUpdateActivity({
      ...activity,
      title: formData.title.trim(),
      category: formData.category,
      date: formData.date,
      time: formData.time,
      displayDate,
      location: formData.location.trim() || 'IT Lab 1',
      houses: formData.houses,
      mentor: formData.mentor.trim(),
      status: formData.status,
      description: formData.description.trim()
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Activity & Workshop Details" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Activity Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Activity Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Category *
            </label>
            <input
              list="edit-activity-categories"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Select or type a category"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
            <datalist id="edit-activity-categories">
              {categoryOptions.map((category) => <option key={category} value={category} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Event Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Lead Mentor & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Lead Mentor/Facilitator - Searchable */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Lead Mentor / Facilitator *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Search or type name"
                value={mentorSearch || formData.mentor}
                onChange={(e) => {
                  setMentorSearch(e.target.value);
                  setMentorSearchOpen(true);
                }}
                onFocus={() => setMentorSearchOpen(true)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              />
              {mentorSearchOpen && (mentorSearch || mentorSearch === '') && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredMentors.length > 0 ? (
                    filteredMentors.map((mentor) => (
                      <button
                        key={mentor.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, mentor: mentor.name });
                          setMentorSearch('');
                          setMentorSearchOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-brand-primary-light text-sm text-slate-900 border-b border-slate-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-semibold">{mentor.name}</div>
                        <div className="text-xs text-slate-600">{mentor.role}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-600 text-center">No mentors found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Meeting Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Event Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Start Time *
            </label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Target Houses */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Target Houses *
          </label>
          <select
            value={formData.houses}
            onChange={(e) => setFormData({ ...formData, houses: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="All Houses">All Houses</option>
            <option value="House 1">House 1</option>
            <option value="House 2">House 2</option>
            <option value="House 3">House 3</option>
            <option value="House 4">House 4</option>
            <option value="House 5">House 5</option>
            <option value="House 6">House 6</option>
          </select>
        </div>

        {/* Description / Agenda */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Agenda & Objectives
          </label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.mentor}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-md shadow-brand-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Activity
          </button>
        </div>
      </form>
    </Modal>
  );
}

