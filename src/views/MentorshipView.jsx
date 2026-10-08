import React, { useState, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { MOCK_MENTORS as INITIAL_MENTORS } from '../data/mockData';
import {
  UserCheck, MessageSquare, Shield, Users, Calendar, Clock, MapPin,
  Plus, CheckCircle, XCircle, Edit2, Trash2, UserPlus, Mail, Briefcase, Upload
} from 'lucide-react';
import ChildImage from '../components/common/ChildImage';
import Modal from '../components/common/Modal';

export default function MentorshipView() {
  const { scheduledSessions = [], openScheduleModal, handleUpdateSessionStatus, childrenList = [] } = useOutletContext();
  const navigate = useNavigate();

  // ── Local mentor state ──────────────────────────────────────────────────────
  const [mentors, setMentors] = useState(INITIAL_MENTORS);
  const [filter, setFilter] = useState('ALL');

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [activeModal, setActiveModal] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [mentorForm, setMentorForm] = useState({ name: '', role: '', email: '', avatar: '' });
  const [assignSearch, setAssignSearch] = useState('');

  const avatarFileRef = useRef(null);

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setMentorForm(prev => ({ ...prev, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getMappedCount = (mentorName) =>
    childrenList.filter(c => c.mentor === mentorName).length;

  const getAssignedChildren = (mentorName) =>
    childrenList.filter(c => c.mentor === mentorName);

  const filteredSessions = scheduledSessions.filter(s => {
    if (filter === 'Scheduled') return s.status === 'Scheduled';
    if (filter === 'Completed') return s.status === 'Completed';
    return true;
  });

  // ── Mentor CRUD ──────────────────────────────────────────────────────────────
  const openAddMentor = () => {
    setMentorForm({ name: '', role: '', email: '', avatar: '' });
    setSelectedMentor(null);
    setActiveModal('add-mentor');
  };

  const openEditMentor = (m) => {
    setMentorForm({ name: m.name, role: m.role, email: m.email, avatar: m.avatar });
    setSelectedMentor(m);
    setActiveModal('edit-mentor');
  };

  const openAssign = (m) => {
    setSelectedMentor(m);
    setAssignSearch('');
    setActiveModal('assign');
  };

  const openDeleteMentor = (m) => {
    setSelectedMentor(m);
    setActiveModal('delete-mentor');
  };

  const handleSaveMentor = (e) => {
    e.preventDefault();
    if (!mentorForm.name.trim() || !mentorForm.role.trim() || !mentorForm.email.trim()) return;
    if (selectedMentor) {
      setMentors(prev => prev.map(m =>
        m.id === selectedMentor.id ? { ...m, ...mentorForm } : m
      ));
    } else {
      setMentors(prev => [...prev, {
        id: `m_${Date.now()}`,
        name: mentorForm.name.trim(),
        role: mentorForm.role.trim(),
        email: mentorForm.email.trim(),
        avatar: mentorForm.avatar.trim() || ''
      }]);
    }
    setActiveModal(null);
  };

  const handleConfirmDeleteMentor = () => {
    if (!selectedMentor) return;
    setMentors(prev => prev.filter(m => m.id !== selectedMentor.id));
    setActiveModal(null);
    setSelectedMentor(null);
  };

  // Toggle child ↔ mentor assignment (updates childrenList via context if available,
  // otherwise we do a local visual toggle by tracking overrides in state)
  const { handleUpdateChild } = useOutletContext();

  const toggleAssign = (child) => {
    if (!selectedMentor) return;
    const newMentor = child.mentor === selectedMentor.name ? '' : selectedMentor.name;
    if (handleUpdateChild) {
      handleUpdateChild({ ...child, mentor: newMentor }, null, '');
    }
  };

  // ── Assign modal filtered list ───────────────────────────────────────────────
  const assignableChildren = childrenList.filter(c =>
    c.name.toLowerCase().includes(assignSearch.toLowerCase()) ||
    (c.grade || '').toLowerCase().includes(assignSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* ── Header Banner ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-brand-primary to-[#0a2d38] text-white p-8 lg:p-10 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-brand-primary-light text-xs font-semibold uppercase tracking-wider">
              <UserCheck className="w-4 h-4" />
              <span>Holistic Child Mentorship</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              Mentorship & Character Development
            </h1>
            <p className="text-sm text-slate-200 max-w-xl leading-relaxed">
              One-on-one mentor conversations, group leadership circles, emotional safety, and career aspiration counseling.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-center min-w-[72px]">
              <span className="text-2xl font-bold text-white block">{mentors.length}</span>
              <p className="text-[10px] text-brand-primary-light uppercase tracking-wider">Mentors</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-center min-w-[72px]">
              <span className="text-2xl font-bold text-white block">{scheduledSessions.length}</span>
              <p className="text-[10px] text-brand-primary-light uppercase tracking-wider">Sessions</p>
            </div>
            <button
              onClick={() => openScheduleModal('')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-brand-primary rounded-lg font-semibold text-sm hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Schedule 1-on-1
            </button>
          </div>
        </div>
      </div>

      {/* ── Scheduled Sessions ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-primary" /> Scheduled 1-on-1 Meetings
            </h3>
            <p className="text-xs text-slate-500">Upcoming and completed mentor sessions with location and time.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg w-fit">
            {[['ALL', 'All', scheduledSessions.length], ['Scheduled', 'Upcoming', scheduledSessions.filter(s => s.status === 'Scheduled').length], ['Completed', 'Completed', scheduledSessions.filter(s => s.status === 'Completed').length]].map(([val, label, count]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  filter === val ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-500 font-medium">No 1-on-1 sessions match the selected filter.</p>
            <button onClick={() => openScheduleModal('')} className="text-sm font-semibold text-brand-primary hover:underline cursor-pointer">
              Schedule a new 1-on-1 session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map((s) => (
              <div key={s.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-brand-primary/30 hover:shadow-sm transition-all flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div onClick={() => navigate(`/children/${s.childId}`)} className="flex items-center gap-3 cursor-pointer group">
                    <ChildImage src={s.childImage} alt={s.childName} className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-primary-light" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{s.childName}</h4>
                      <span className="text-xs text-slate-500">Mentor: <strong className="text-slate-700">{s.mentorName}</strong></span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    s.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : s.status === 'Cancelled' ? 'bg-slate-100 text-slate-600 border-slate-200'
                    : 'bg-brand-primary-light text-brand-primary border-brand-primary/20'
                  }`}>{s.status}</span>
                </div>

                <p className="text-sm font-semibold text-slate-900">{s.topic}</p>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-brand-primary">
                    <Calendar className="w-3.5 h-3.5" /> {s.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-brand-primary" /> {s.time}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {s.location}
                  </span>
                </div>

                {s.notes && (
                  <p className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-100">"{s.notes}"</p>
                )}

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <button onClick={() => openScheduleModal(s.childId)} className="text-xs text-slate-500 hover:text-brand-primary font-medium transition-colors cursor-pointer">
                    Reschedule
                  </button>
                  {s.status === 'Scheduled' && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleUpdateSessionStatus?.(s.id, 'Cancelled')} className="text-xs px-2.5 py-1 text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors cursor-pointer">
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                      <button onClick={() => handleUpdateSessionStatus?.(s.id, 'Completed')} className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-sm">
                        <CheckCircle className="w-3.5 h-3.5" /> Complete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Mentor Roster ─────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Mentor Roster</h3>
            <p className="text-sm text-slate-500 mt-0.5">Manage mentors and their assigned students</p>
          </div>
          <button
            onClick={openAddMentor}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold text-sm hover:bg-[#0a2d38] transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Mentor
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mentors.map((m) => {
            const mapped = getMappedCount(m.name);
            return (
              <div key={m.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                {/* Top action bar */}
                <div className="flex items-center justify-end gap-1 px-4 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditMentor(m)}
                    className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light rounded-lg transition-colors cursor-pointer"
                    title="Edit mentor"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openAssign(m)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    title="Assign students"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openDeleteMentor(m)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete mentor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Avatar + info */}
                <div className="px-6 pb-5 pt-1 text-center space-y-3">
                  <div className="relative inline-block">
                    {m.avatar ? (
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-brand-primary-light shadow-md"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div
                      style={{ display: m.avatar ? 'none' : 'flex' }}
                      className="w-20 h-20 rounded-full bg-brand-primary text-white text-2xl font-bold items-center justify-center mx-auto ring-4 ring-brand-primary-light shadow-md"
                    >
                      {m.name.charAt(0)}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">{m.name}</h4>
                    <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mt-0.5">{m.role}</p>
                    <div className="flex items-center justify-center gap-1.5 mt-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <p className="text-xs text-slate-500 truncate max-w-[160px]">{m.email}</p>
                    </div>
                  </div>

                  {/* Stats + actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-600">
                        <strong className="text-slate-900">{mapped}</strong> student{mapped !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => openScheduleModal('')}
                      className="text-xs font-semibold text-brand-primary hover:text-[#0a2d38] transition-colors cursor-pointer"
                    >
                      Book 1-on-1
                    </button>
                  </div>

                  {/* Assigned students preview */}
                  {mapped > 0 && (
                    <div className="flex -space-x-2 justify-center pt-1">
                      {getAssignedChildren(m.name).slice(0, 5).map(c => (
                        <ChildImage
                          key={c.id}
                          src={c.image}
                          alt={c.name}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                        />
                      ))}
                      {mapped > 5 && (
                        <div className="w-7 h-7 rounded-full bg-slate-200 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                          +{mapped - 5}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Focus Pillars ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { icon: MessageSquare, bg: 'bg-brand-primary-light', color: 'text-brand-primary', title: '1-on-1 Check-ins', desc: 'Bi-weekly private mentor chats reviewing emotional health, cottage life, and personal challenges.' },
          { icon: Users, bg: 'bg-amber-50', color: 'text-amber-700', title: 'Small Group Leadership', desc: 'Encouraging peer-led discussions, cottage chores responsibility, and teamwork skills.' },
          { icon: Shield, bg: 'bg-emerald-50', color: 'text-emerald-600', title: 'Career Aspirations', desc: 'Helping Grade 9 students plan further-study goals, IT certifications, and vocational pathways.' }
        ].map(({ icon: Icon, bg, color, title, desc }) => (
          <div key={title} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-all">
            <div className={`p-3 ${bg} ${color} rounded-xl w-fit`}>
              <Icon className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">{title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── Add / Edit Mentor Modal ────────────────────────────────────────────── */}
      <Modal
        isOpen={activeModal === 'add-mentor' || activeModal === 'edit-mentor'}
        onClose={() => setActiveModal(null)}
        title={activeModal === 'edit-mentor' ? 'Edit Mentor' : 'Add New Mentor'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveMentor} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={mentorForm.name}
              onChange={e => setMentorForm({ ...mentorForm, name: e.target.value })}
              placeholder="e.g. Sarah Johnson"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <Briefcase className="w-3.5 h-3.5 inline mr-1" />Role / Specialty *
            </label>
            <input
              type="text"
              required
              value={mentorForm.role}
              onChange={e => setMentorForm({ ...mentorForm, role: e.target.value })}
              placeholder="e.g. Head Mentor, Computer & Tech Mentor"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <Mail className="w-3.5 h-3.5 inline mr-1" />Email Address *
            </label>
            <input
              type="email"
              required
              value={mentorForm.email}
              onChange={e => setMentorForm({ ...mentorForm, email: e.target.value })}
              placeholder="e.g. sarah.j@tumaini.org"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Avatar (optional)</label>
            {/* Preview */}
            {mentorForm.avatar && (
              <div className="flex justify-center mb-3">
                <img
                  src={mentorForm.avatar}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-brand-primary-light shadow-md"
                  onError={e => e.target.style.display = 'none'}
                />
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={mentorForm.avatar.startsWith('data:') ? '' : mentorForm.avatar}
                onChange={e => setMentorForm({ ...mentorForm, avatar: e.target.value })}
                placeholder="Paste image URL..."
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => avatarFileRef.current?.click()}
                className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-brand-primary text-white rounded-lg hover:bg-[#0a2d38] transition-colors shadow-sm cursor-pointer"
                title="Upload from device"
              >
                <Upload className="w-5 h-5" />
              </button>
              <input
                ref={avatarFileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFile}
                className="hidden"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5 italic">Paste a URL or upload a photo from your device.</p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={() => setActiveModal(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm">
              {activeModal === 'edit-mentor' ? 'Update Mentor' : 'Add Mentor'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Assign Students Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={activeModal === 'assign'}
        onClose={() => setActiveModal(null)}
        title={`Assign Students — ${selectedMentor?.name || ''}`}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search students by name or grade..."
            value={assignSearch}
            onChange={e => setAssignSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          />
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {assignableChildren.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">No students found.</p>
            )}
            {assignableChildren.map(child => {
              const isAssigned = child.mentor === selectedMentor?.name;
              return (
                <div
                  key={child.id}
                  onClick={() => toggleAssign(child)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isAssigned
                      ? 'bg-brand-primary-light border-brand-primary/30'
                      : 'bg-white border-slate-200 hover:border-brand-primary/30 hover:bg-slate-50'
                  }`}
                >
                  <ChildImage src={child.image} alt={child.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{child.name}</p>
                    <p className="text-xs text-slate-500">{child.grade}{child.houseId ? ` • House ${child.houseId}` : ''}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isAssigned ? 'bg-brand-primary border-brand-primary' : 'border-slate-300'
                  }`}>
                    {isAssigned && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              {selectedMentor ? getMappedCount(selectedMentor.name) : 0} student(s) assigned
            </p>
            <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm">
              Done
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Mentor Modal ───────────────────────────────────────────────── */}
      <Modal
        isOpen={activeModal === 'delete-mentor'}
        onClose={() => setActiveModal(null)}
        title="Delete Mentor"
        maxWidth="max-w-sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">Delete "{selectedMentor?.name}"?</p>
              <p className="text-sm text-slate-600">
                This mentor will be removed from the roster. Students currently assigned to them will not be automatically reassigned.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
            <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleConfirmDeleteMentor} className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
