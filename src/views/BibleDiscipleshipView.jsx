import React, { useState } from 'react';
import { MOCK_BIBLE_CURRICULUM } from '../data/mockData';
import { BookOpen, Award, CheckCircle, Heart, Star, Sparkles, AlertCircle, CheckCircle2, Clock, Eye } from 'lucide-react';

export default function BibleDiscipleshipView() {
  const [activeSubTab, setActiveSubTab] = useState('memory'); // 'memory' | 'catechism' | 'genesis' | 'passages'
  const [memorized, setMemorized] = useState({});
  const [passageSubmissions, setPassageSubmissions] = useState({
    c1: 'Submitted',
    c2: 'Missing',
    c3: 'Missing',
    c4: 'Missing',
    c5: 'Submitted',
    c6: 'Missing',
    c7: 'Missing',
    c8: 'Submitted'
  });

  const toggleVerse = (v) => {
    setMemorized(prev => ({ ...prev, [v]: !prev[v] }));
  };

  const childNames = [
    { id: 'c1', letter: 'B', name: 'Brian', date: 'Aug 20, 2026' },
    { id: 'c2', letter: 'C', name: 'Caleb', date: 'Aug 20, 2026' },
    { id: 'c3', letter: 'D', name: 'Daniel', date: 'Aug 20, 2026' },
    { id: 'c4', letter: 'D', name: 'David', date: 'Aug 20, 2026' },
    { id: 'c5', letter: 'D', name: 'Deborah', date: 'Aug 20, 2026' },
    { id: 'c6', letter: 'D', name: 'Dennis', date: 'Aug 20, 2026' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-brand-primary text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-primary-light text-xs font-mono uppercase font-bold tracking-widest">
            <BookOpen className="w-4 h-4" /> SPIRITUAL GROWTH & CHARACTER
          </div>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
            Bible & Discipleship Program
          </h2>
          <p className="text-xs text-brand-primary-light max-w-xl leading-relaxed">
            Focusing on Scripture memorization, Genesis study modules, and Westminster Shorter Catechism foundations for personal character development.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center shrink-0">
          <span className="text-2xl font-black text-white font-mono">95%</span>
          <p className="text-[10px] text-brand-primary-light uppercase font-mono tracking-wider">Active Participation</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center bg-slate-200/60 p-1.5 rounded-2xl gap-1 w-fit overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('memory')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap ${
            activeSubTab === 'memory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Biggest Story Verse Cards
        </button>
        <button
          onClick={() => setActiveSubTab('catechism')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap ${
            activeSubTab === 'catechism' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Westminster Shorter Catechism
        </button>
        <button
          onClick={() => setActiveSubTab('genesis')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap ${
            activeSubTab === 'genesis' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Genesis Study Modules
        </button>
        <button
          onClick={() => setActiveSubTab('passages')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap ${
            activeSubTab === 'passages' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Passage Submissions
        </button>
      </div>

      {/* Tab 1: Verse Cards */}
      {activeSubTab === 'memory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_BIBLE_CURRICULUM.memorizationCards.map((card) => {
            const isDone = !!memorized[card.verse];
            return (
              <div
                key={card.verse}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-brand-primary-light text-brand-primary text-xs font-bold rounded-full font-mono">
                      {card.theme}
                    </span>
                    <button
                      onClick={() => toggleVerse(card.verse)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isDone ? 'Recited' : 'Mark Recited'}
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-2 font-serif">{card.verse}</h4>
                  <p className="text-sm italic text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl">
                    "{card.text}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Westminster Catechism */}
      {activeSubTab === 'catechism' && (
        <div className="space-y-4">
          {MOCK_BIBLE_CURRICULUM.catechismQuestions.map((cq) => (
            <div key={cq.qNo} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
              <span className="text-xs font-bold font-mono text-brand-primary uppercase">
                QUESTION #{cq.qNo}
              </span>
              <h4 className="text-base font-bold text-slate-900">{cq.question}</h4>
              <div className="bg-brand-primary-light/60 p-4 rounded-2xl border border-brand-primary-light">
                <span className="text-[10px] font-bold text-brand-primary uppercase font-mono block mb-1">
                  ANSWER:
                </span>
                <p className="text-sm font-semibold text-slate-900">{cq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Genesis Study Modules */}
      {activeSubTab === 'genesis' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_BIBLE_CURRICULUM.genesisModules.map((g, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <span className="px-3 py-1 bg-brand-primary-light text-brand-primary text-xs font-bold rounded-full font-mono">
                {g.status}
              </span>
              <h4 className="text-base font-bold text-slate-900">{g.title}</h4>
              <p className="text-xs text-slate-500 font-medium">Discussion Leader: {g.leader}</p>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 font-mono font-bold">
                {g.attendeesCount} Children Participating
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Passage Submissions Tracker */}
      {activeSubTab === 'passages' && (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-brand-accent-light rounded-3xl p-6 border border-brand-accent-light space-y-3">
            <h3 className="text-lg font-bold text-brand-accent">Genesis 1:1-27 Passage Submission Tracker</h3>
            <p className="text-xs text-brand-accent-light leading-relaxed">Monitor which children have submitted their passage reflections and responses. Click status to update.</p>
          </div>

          {/* Submissions Table */}
          <div className="overflow-hidden border border-slate-200/80 rounded-3xl shadow-xs">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/60">
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase font-mono tracking-wider">NAME</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase font-mono tracking-wider">DATE</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase font-mono tracking-wider">PASSAGE</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase font-mono tracking-wider">STATUS</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase font-mono tracking-wider">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {childNames.map((child) => {
                  const status = passageSubmissions[child.id];
                  return (
                    <tr key={child.id} className="hover:bg-slate-50/40 transition-colors">
                      {/* Name with Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs">
                            {child.letter}
                          </div>
                          <span className="text-xs font-bold text-slate-900">{child.name}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-600 font-medium">{child.date}</span>
                      </td>

                      {/* Passage */}
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500 font-medium">-</span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        {status === 'Submitted' ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary-light text-brand-primary rounded-full text-xs font-bold border border-brand-primary-light">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Submitted
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-full text-xs font-bold border border-rose-200">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Missing
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setPassageSubmissions(prev => ({
                            ...prev,
                            [child.id]: status === 'Submitted' ? 'Missing' : 'Submitted'
                          }))}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-brand-primary-light rounded-2xl p-4 border border-brand-primary-light space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                <span className="text-xs font-bold text-slate-500 uppercase font-mono">Submitted</span>
              </div>
              <p className="text-2xl font-black text-brand-primary">{Object.values(passageSubmissions).filter(s => s === 'Submitted').length}</p>
            </div>
            <div className="bg-rose-100 rounded-2xl p-4 border border-rose-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-bold text-slate-500 uppercase font-mono">Missing</span>
              </div>
              <p className="text-2xl font-black text-rose-700">{Object.values(passageSubmissions).filter(s => s === 'Missing').length}</p>
            </div>
            <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-600" />
                <span className="text-xs font-bold text-slate-500 uppercase font-mono">Completion</span>
              </div>
              <p className="text-2xl font-black text-slate-800">{Math.round((Object.values(passageSubmissions).filter(s => s === 'Submitted').length / childNames.length) * 100)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

