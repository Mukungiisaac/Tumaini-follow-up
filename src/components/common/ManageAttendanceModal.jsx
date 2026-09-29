import React, { useState } from 'react';
import Modal from './Modal';
import { UserCheck, CheckCircle2, Search } from 'lucide-react';

export default function ManageAttendanceModal({ isOpen, onClose, activity, childrenList, onUpdateAttendance }) {
  if (!activity) return null;

  const [attendees, setAttendees] = useState(activity.attendees || []);
  const [filterQuery, setFilterQuery] = useState('');

  const toggleAttendee = (childId) => {
    const isAttending = attendees.includes(childId);
    let nextAttendees;
    if (isAttending) {
      nextAttendees = attendees.filter(id => id !== childId);
    } else {
      nextAttendees = [...attendees, childId];
    }
    setAttendees(nextAttendees);
    if (onUpdateAttendance) {
      onUpdateAttendance(activity.id, nextAttendees);
    }
  };

  const filteredChildren = (childrenList || []).filter(c =>
    c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.cottage.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Attendance â€” ${activity.title}`} maxWidth="max-w-lg">
      <div className="space-y-4">
        {/* Attendance Summary */}
        <div className="bg-[#E8F0F0] p-4 rounded-2xl border border-[#B8CED0] flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-[#0C3440] font-mono uppercase">Check-In Status</h4>
            <p className="text-xs text-slate-600 font-medium">{activity.location} â€¢ {activity.cottages}</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-[#0C3440] font-mono">{attendees.length} / {childrenList.length}</span>
            <p className="text-[10px] font-bold text-[#8A5F20] uppercase font-mono">Present</p>
          </div>
        </div>

        {/* Filter input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student to mark present..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        {/* Roster list */}
        <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto space-y-1 pr-1">
          {filteredChildren.map((c) => {
            const isPresent = attendees.includes(c.id);
            return (
              <div
                key={c.id}
                onClick={() => toggleAttendee(c.id)}
                className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                  isPresent
                    ? 'bg-emerald-50/80 border border-emerald-200'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={c.image} alt={c.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{c.name}</h5>
                    <span className="text-[10px] text-slate-500 font-medium">{c.grade} â€¢ {c.cottage}</span>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1.5 transition-colors ${
                  isPresent
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}>
                  {isPresent ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Present
                    </>
                  ) : (
                    'Mark Present'
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0C3440] hover:bg-[#164957] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
}

