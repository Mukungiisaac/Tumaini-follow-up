import React from 'react';
import { Palette, Music, Sparkles, Award, Star } from 'lucide-react';

export default function MusicArtsView() {
  const guitarRoadmap = [
    { chord: 'Open Chords (G, C, D, Em)', level: 'INDEPENDENT', status: 'Mastered by 8 children' },
    { chord: 'Strumming Patterns & Rhythm', level: 'INDEPENDENT', status: 'Mastered by 6 children' },
    { chord: 'Barre Chords & Lead Tabs', level: 'LEARNING', status: 'In Progress (Grace W., Samuel O.)' }
  ];

  const hymnsLearned = [
    { title: 'Amazing Grace', language: 'English & Swahili', status: 'Choir Ready' },
    { title: 'How Great Thou Art', language: 'English', status: 'Choir Ready' },
    { title: 'Blessed Assurance', language: 'Swahili (Ndiyo Dhamana)', status: 'Choir Ready' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-mono uppercase font-bold tracking-widest">
            <Palette className="w-4 h-4" /> CREATIVE EXPRESSION & MUSIC
          </div>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
            Music & Creative Arts Program
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl leading-relaxed">
            Building social confidence and teamwork through guitar training, choir hymns, drawing, and village art showcases.
          </p>
        </div>
      </div>

      {/* Guitar Roadmap Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-600">
          <Music className="w-5 h-5" />
          <h3 className="text-lg font-bold text-slate-900">Guitar Progression Roadmap</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guitarRoadmap.map((item, idx) => (
            <div key={idx} className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2">
              <span className="text-[10px] font-bold text-indigo-600 font-mono uppercase">STAGE #{idx + 1}</span>
              <h4 className="text-base font-bold text-slate-900">{item.chord}</h4>
              <p className="text-xs text-slate-600 font-medium">{item.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hymns Learned Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Village Hymns & Choir Repertoire</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hymnsLearned.map((hymn, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-600">{hymn.language}</span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                  {hymn.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{hymn.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
