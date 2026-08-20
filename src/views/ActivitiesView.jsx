import React from 'react';
import { Compass, Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';

export default function ActivitiesView() {
  const activities = [
    {
      id: 'a1',
      title: 'Friday Computer Lab Coding Challenge',
      category: 'Computer',
      date: 'This Friday • 3:30 PM',
      location: 'IT Lab 1',
      cottage: 'All Cottages',
      color: 'bg-purple-50 text-purple-700 border-purple-100'
    },
    {
      id: 'a2',
      title: 'Genesis Chapter 1-3 Discussion Circle',
      category: 'Bible & Discipleship',
      date: 'Saturday • 10:00 AM',
      location: 'Village Chapel Hall',
      cottage: 'Joy Villa & Hope House',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-100'
    },
    {
      id: 'a3',
      title: 'STEM Solar Battery Circuit Workshop',
      category: 'Math & Science',
      date: 'Next Tuesday • 4:00 PM',
      location: 'Science Workshop Room',
      cottage: "Cottage 'B'",
      color: 'bg-blue-50 text-blue-700 border-blue-100'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Group Activities & Workshops</h2>
          <p className="text-xs text-slate-500 mt-1">
            Schedule and track group events, tech challenges, and chapel devotions.
          </p>
        </div>

        <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Plan New Activity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activities.map((act) => (
          <div key={act.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full font-mono ${act.color}`}>
                {act.category}
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-3">{act.title}</h4>

              <div className="space-y-2 text-xs text-slate-600 mt-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{act.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{act.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{act.cottage}</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2 bg-slate-100 hover:bg-purple-600 hover:text-white text-xs font-bold text-slate-800 rounded-xl transition-colors">
              Manage Attendance
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
