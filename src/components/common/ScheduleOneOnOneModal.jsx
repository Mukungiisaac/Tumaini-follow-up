import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { MOCK_MENTORS, MEETING_LOCATIONS } from '../../data/mockData';
import { Calendar, Clock, MapPin, UserCheck, MessageSquare } from 'lucide-react';

export default function ScheduleOneOnOneModal({
  isOpen,
  onClose,
  childrenList = [],
  initialChildId = '',
  onScheduleSession
}) {
  const getDefaultDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Default to tomorrow
    return today.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    childId: initialChildId || childrenList[0]?.id || 'c1',
    mentorName: MOCK_MENTORS[0]?.name || 'Sarah Johnson',
    date: getDefaultDate(),
    time: '14:00',
    location: MEETING_LOCATIONS[0],
    customLocation: '',
    topic: 'Social Confidence & Group Play',
    notes: ''
  });

  // Keep form data in sync when modal opens or initialChildId changes
  useEffect(() => {
    if (isOpen) {
      const targetChildId = initialChildId || childrenList[0]?.id || 'c1';
      const childObj = childrenList.find(c => c.id === targetChildId);
      const mentorObj = MOCK_MENTORS.find(m => m.name === childObj?.mentor) || MOCK_MENTORS[0];

      setFormData(prev => ({
        ...prev,
        childId: targetChildId,
        mentorName: mentorObj?.name || 'Sarah Johnson',
        date: prev.date || getDefaultDate(),
        time: prev.time || '14:00',
        location: prev.location || MEETING_LOCATIONS[0],
        customLocation: '',
        topic: prev.topic || 'Social Confidence & Group Play',
        notes: ''
      }));
    }
  }, [isOpen, initialChildId, childrenList]);

  // Update mentor automatically if child selection changes
  const handleChildChange = (selectedId) => {
    const childObj = childrenList.find(c => c.id === selectedId);
    const mentorObj = MOCK_MENTORS.find(m => m.name === childObj?.mentor) || MOCK_MENTORS[0];
    setFormData(prev => ({
      ...prev,
      childId: selectedId,
      mentorName: mentorObj?.name || prev.mentorName
    }));
  };

  const selectedChild = childrenList.find(c => c.id === formData.childId) || childrenList[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.childId || !formData.date || !formData.time) return;

    const finalLocation = formData.location === 'Other (Custom location...)'
      ? (formData.customLocation || 'Village Meeting Room')
      : formData.location;

    onScheduleSession({
      id: `session_${Date.now()}`,
      childId: selectedChild?.id,
      childName: selectedChild?.name || 'Student',
      childImage: selectedChild?.image || '/assets/children/david_k.jpg',
      mentorId: MOCK_MENTORS.find(m => m.name === formData.mentorName)?.id || 'm1',
      mentorName: formData.mentorName,
      date: formData.date,
      time: formData.time,
      location: finalLocation,
      topic: formData.topic || 'Mentorship Check-in',
      notes: formData.notes || 'Bi-weekly 1-on-1 mentor session scheduled.',
      status: 'Scheduled'
    });

    onClose();
  };

  const TOPIC_PRESETS = [
    'Social Confidence & Group Play',
    'Math Support & Fractions',
    'Computer & IT Career Counseling',
    'Discipleship & Scripture Review',
    'Personal Well-being & Cottage Life'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule 1-on-1 Session" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5 overflow-x-hidden">
        {/* Child & Mentor Selector Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
          {/* Target Child Selector */}
          <div className="flex items-center gap-3 min-w-0">
            {selectedChild && (
              <img
                src={selectedChild.image}
                alt={selectedChild.name}
                className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
              />
            )}
            <label className="min-w-0 flex-1 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 block">
                TARGET CHILD
              </span>
              <select
                value={formData.childId}
                onChange={(e) => handleChildChange(e.target.value)}
                className="w-full bg-white font-semibold text-slate-900 text-sm focus:outline-none cursor-pointer truncate"
              >
                {childrenList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.grade} â€¢ {c.cottage})
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Assigned Mentor Selector */}
          <label className="sm:border-l sm:border-slate-200 sm:pl-4 min-w-0 flex flex-col justify-center space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 block">
              ASSIGNED MENTOR
            </span>
            <select
              value={formData.mentorName}
              onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
              className="w-full bg-white font-semibold text-slate-900 text-sm focus:outline-none cursor-pointer truncate"
            >
              {MOCK_MENTORS.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Date & Time Selection (Side by Side) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 min-w-0">
          <div className="min-w-0">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0C3440] shrink-0" /> Meeting Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440] bg-white"
            />
          </div>

          <div className="min-w-0">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0C3440] shrink-0" /> Exact Time
            </label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440] bg-white"
            />
          </div>
        </div>

        {/* Meeting Location / Place */}
        <div className="min-w-0">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0C3440] shrink-0" /> Meeting Place / Location
          </label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440] bg-white truncate"
          >
            {MEETING_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {formData.location === 'Other (Custom location...)' && (
            <input
              type="text"
              required
              placeholder="Specify custom place (e.g. Village Playground Gazebo, Dining Terrace...)"
              value={formData.customLocation}
              onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
              className="w-full mt-3 px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            />
          )}
        </div>

        {/* Focus Topic / Reason */}
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-1">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <MessageSquare className="w-3.5 h-3.5 text-[#0C3440] shrink-0" /> Focus Topic / Reason
            </label>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Quick suggestions below</span>
          </div>
          <input
            type="text"
            required
            placeholder="e.g. Social confidence check-in or math support plan"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />

          {/* Preset chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {TOPIC_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setFormData({ ...formData, topic: preset })}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  formData.topic === preset
                    ? 'bg-[#E8F0F0] text-[#0C3440] border-[#B8CED0] font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Notes / Instructions */}
        <div className="min-w-0">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Meeting Preparation & Agenda Notes
          </label>
          <textarea
            rows="3"
            placeholder="Key discussion points, preparation materials, or goals for this session..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440] resize-y"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 text-sm font-semibold text-white bg-[#0C3440] hover:bg-[#164957] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <UserCheck className="w-4 h-4" /> Schedule Session
          </button>
        </div>
      </form>
    </Modal>
  );
}

