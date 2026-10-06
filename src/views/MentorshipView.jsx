import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { MOCK_MENTORS } from '../data/mockData';
import { UserCheck, MessageSquare, Shield, Users, Calendar, Clock, MapPin, Plus, CheckCircle, XCircle } from 'lucide-react';
import ChildImage from '../components/common/ChildImage';

export default function MentorshipView() {
  const { scheduledSessions = [], openScheduleModal, handleUpdateSessionStatus } = useOutletContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'Scheduled' | 'Completed'

  const filteredSessions = scheduledSessions.filter(session => {
    if (filter === 'Scheduled') return session.status === 'Scheduled';
    if (filter === 'Completed') return session.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#0C3440] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#0C3440]/60">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#D99B3C] text-xs font-mono uppercase font-bold tracking-widest">
            <UserCheck className="w-4 h-4" /> HOLISTIC CHILD MENTORSHIP
          </div>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
            Mentorship & Character Development
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            One-on-one mentor conversations, group leadership circles, emotional safety, and career aspiration counseling.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
            <span className="text-2xl font-black text-white font-mono">{scheduledSessions.length}</span>
            <p className="text-[10px] text-[#D99B3C] uppercase font-mono tracking-wider">1-on-1 Sessions</p>
          </div>

          <button
            onClick={() => openScheduleModal('')}
            className="px-5 py-3 bg-[#0C3440] hover:bg-[#164957] text-white rounded-2xl font-bold text-xs shadow-lg shadow-[#0C3440]/50 border border-[#D99B3C]/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Schedule 1-on-1
          </button>
        </div>
      </div>

      {/* Scheduled 1-on-1 Sessions List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0C3440]" /> Scheduled 1-on-1 Meetings
            </h3>
            <p className="text-xs text-slate-500">Upcoming and completed mentor sessions with location and time.</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({scheduledSessions.length})
            </button>
            <button
              onClick={() => setFilter('Scheduled')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filter === 'Scheduled' ? 'bg-white text-[#0C3440] shadow-xs' : 'text-slate-600 hover:text-[#0C3440]'
              }`}
            >
              Upcoming ({scheduledSessions.filter(s => s.status === 'Scheduled').length})
            </button>
            <button
              onClick={() => setFilter('Completed')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                filter === 'Completed' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Completed ({scheduledSessions.filter(s => s.status === 'Completed').length})
            </button>
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
            <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">No 1-on-1 sessions match the selected filter.</p>
            <button
              onClick={() => openScheduleModal('')}
              className="text-xs font-bold text-[#0C3440] hover:text-[#164957] underline"
            >
              Schedule a new 1-on-1 session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map((s) => (
              <div
                key={s.id}
                className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 hover:bg-white hover:border-[#0C3440]/25 transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  {/* Top bar: Child info & status badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      onClick={() => navigate(`/children/${s.childId}`)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <ChildImage
                        src={s.childImage}
                        alt={s.childName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E8F0F0]"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0C3440] transition-colors">
                          {s.childName}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-500">
                          Mentor: <strong className="text-slate-700">{s.mentorName}</strong>
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        s.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : s.status === 'Cancelled'
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-[#E8F0F0] text-[#0C3440] border border-[#B8CED0]'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  {/* Topic Title */}
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {s.topic}
                  </h4>

                  {/* Date, Time, Location Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium">
                    <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 text-[#0C3440] font-semibold">
                      <Calendar className="w-3.5 h-3.5" /> {s.date}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 text-slate-800 font-semibold font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#0C3440]" /> {s.time}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {s.location}
                    </span>
                  </div>

                  {/* Notes */}
                  {s.notes && (
                    <p className="text-xs text-slate-600 leading-relaxed bg-white/60 p-3 rounded-xl border border-slate-100 italic">
                      "{s.notes}"
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <button
                    onClick={() => openScheduleModal(s.childId)}
                    className="text-slate-500 hover:text-[#0C3440] font-medium transition-colors cursor-pointer"
                  >
                    Reschedule
                  </button>

                  {s.status === 'Scheduled' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateSessionStatus && handleUpdateSessionStatus(s.id, 'Cancelled')}
                        className="px-2.5 py-1 text-slate-500 hover:text-rose-600 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateSessionStatus && handleUpdateSessionStatus(s.id, 'Completed')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
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

      {/* Mentor Roster */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Village Mentor Roster</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_MENTORS.map((m) => (
            <div key={m.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4 text-center">
              <img
                src={m.avatar}
                alt={m.name}
                className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-[#E8F0F0] shadow-md"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{m.name}</h4>
                <p className="text-xs text-[#0C3440] font-bold font-mono uppercase">{m.role}</p>
                <p className="text-[11px] text-slate-400 mt-1">{m.email}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                <span><strong className="text-slate-900">20+</strong> Mapped</span>
                <button
                  onClick={() => openScheduleModal('')}
                  className="text-[11px] font-bold text-[#0C3440] hover:text-[#164957] uppercase font-mono tracking-wider cursor-pointer"
                >
                  Book 1-on-1
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentorship Focus Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
          <div className="p-3 bg-[#E8F0F0] text-[#0C3440] rounded-2xl w-fit">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900">1-on-1 Check-ins</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bi-weekly private mentor chats reviewing emotional health, cottage life, and personal challenges.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
          <div className="p-3 bg-[#FBF3E4] text-[#8A5F20] rounded-2xl w-fit">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Small Group Leadership</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Encouraging peer-led discussions, cottage chores responsibility, and teamwork skills.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
            <Shield className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Career Aspirations</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Helping Grade 9 students plan further-study goals, IT certifications, and vocational pathways.
          </p>
        </div>
      </div>
    </div>
  );
}

