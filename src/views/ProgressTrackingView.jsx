import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { GRADE_LEVELS, SKILL_LEVELS } from '../data/mockData';
import { Star, Filter, CheckCircle2, ChevronDown } from 'lucide-react';

export default function ProgressTrackingView() {
  const { childrenList, handleUpdateChildSkill } = useOutletContext();
  const navigate = useNavigate();

  const [gradeFilter, setGradeFilter] = useState('ALL GRADES');
  const [activeCellPopover, setActiveCellPopover] = useState(null); // { childId, category }

  const gradesList = ['ALL GRADES', ...GRADE_LEVELS];

  const categories = [
    { key: 'computer', label: 'COMPUTER' },
    { key: 'math', label: 'MATH' },
    { key: 'science', label: 'SCIENCE' },
    { key: 'bible', label: 'BIBLE' },
    { key: 'social', label: 'SOCIAL' },
    { key: 'character', label: 'CHARACTER' },
    { key: 'music', label: 'MUSIC' },
    { key: 'arts', label: 'ARTS' }
  ];

  // Helper to map numeric level or metric to skill level key
  const getLevelForCategory = (child, catKey) => {
    const metrics = child.overviewMetrics || {};
    let val = 50;
    if (catKey === 'computer') val = metrics.computer || 85;
    else if (catKey === 'math') val = metrics.mathScience || 80;
    else if (catKey === 'science') val = (metrics.mathScience || 80) - 10;
    else if (catKey === 'bible') val = metrics.bible || 75;
    else if (catKey === 'social') val = metrics.social || 78;
    else if (catKey === 'character') val = (metrics.social || 78) + 5;
    else if (catKey === 'music') val = metrics.music || 65;
    else if (catKey === 'arts') val = metrics.arts || 50;

    if (val >= 90) return 'MASTERED';
    if (val >= 75) return 'INDEPENDENT';
    if (val >= 60) return 'WITH_HELP';
    if (val >= 40) return 'LEARNING';
    return 'NOT_INTRODUCED';
  };

  const filteredChildren = childrenList.filter((c) => {
    if (gradeFilter === 'ALL GRADES') return true;
    return c.grade.toLowerCase().includes(gradeFilter.toLowerCase().split(' ')[0] + ' ' + (gradeFilter.toLowerCase().split(' ')[1] || ''));
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header (Page 4) */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
          COHORT ASSESSMENT
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Progress Matrix
        </h2>
        <p className="text-xs text-slate-500 max-w-2xl">
          Holistic development tracking across all core curriculum and character building areas for Term 3.
        </p>
      </div>

      {/* Grade Selector Pills Filter Bar (Page 4) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center bg-slate-200/60 p-1.5 rounded-2xl gap-1">
          {gradesList.map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                gradeFilter === g
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <button className="px-5 py-2.5 bg-[#0b172a] text-white text-xs font-bold font-mono rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-2">
          <Filter className="w-4 h-4" /> FILTER
        </button>
      </div>

      {/* Skill Levels Visual Legend (Page 4) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono block">
          SKILL LEVELS
        </span>

        <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full border-2 border-slate-200 bg-slate-100" />
            <span>Not Introduced</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-primary-light" />
            <span>Learning</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-300" />
            <span>With Help</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#0b172a]" />
            <span>Independent</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0b172a] text-white flex items-center justify-center">
              <Star className="w-3.5 h-3.5 fill-white text-white" />
            </span>
            <span>Mentors Others</span>
          </div>
        </div>
      </div>

      {/* Progress Matrix Table (Page 4) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-5 px-6 text-xs font-bold text-slate-800 uppercase font-mono tracking-wider w-64">
                  CHILD PROFILING
                </th>
                {categories.map((cat) => (
                  <th
                    key={cat.key}
                    className="py-5 px-4 text-center text-xs font-bold text-slate-800 uppercase font-mono tracking-wider"
                  >
                    {cat.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChildren.map((child) => (
                <tr key={child.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Child Profiling Info Cell */}
                  <td className="py-4 px-6">
                    <div
                      onClick={() => navigate(`/children/${child.id}`)}
                      className="flex items-center gap-3.5 cursor-pointer group"
                    >
                      <img
                        src={child.image}
                        alt={child.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-purple-400 transition-all"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                          {child.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {child.grade} â€¢ Mentor: {child.mentor}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Subject Matrix Cells */}
                  {categories.map((cat) => {
                    const levelKey = getLevelForCategory(child, cat.key);
                    const isPopoverOpen =
                      activeCellPopover &&
                      activeCellPopover.childId === child.id &&
                      activeCellPopover.category === cat.key;

                    return (
                      <td key={cat.key} className="py-4 px-4 text-center relative">
                        <button
                          onClick={() =>
                            setActiveCellPopover(
                              isPopoverOpen ? null : { childId: child.id, category: cat.key }
                            )
                          }
                          className="inline-flex items-center justify-center p-1 rounded-full hover:scale-110 transition-transform focus:outline-none"
                          title={`${cat.label}: ${SKILL_LEVELS[levelKey]?.label}`}
                        >
                          {levelKey === 'MASTERED' ? (
                            <span className="w-8 h-8 rounded-full bg-[#0b172a] text-white flex items-center justify-center shadow-md">
                              <Star className="w-4 h-4 fill-white text-white" />
                            </span>
                          ) : levelKey === 'INDEPENDENT' ? (
                            <span className="w-8 h-8 rounded-full bg-[#0b172a] shadow-xs" />
                          ) : levelKey === 'WITH_HELP' ? (
                            <span className="w-8 h-8 rounded-full bg-blue-300 shadow-xs" />
                          ) : levelKey === 'LEARNING' ? (
                            <span className="w-8 h-8 rounded-full bg-brand-primary-light shadow-xs" />
                          ) : (
                            <span className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-100 shadow-xs" />
                          )}
                        </button>

                        {/* Interactive Status Selector Popover */}
                        {isPopoverOpen && (
                          <div className="absolute z-40 top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 space-y-1 text-left animate-in fade-in zoom-in-95">
                            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono px-2 block">
                              Update {cat.label}
                            </span>
                            {Object.keys(SKILL_LEVELS).map((lk) => (
                              <button
                                key={lk}
                                onClick={() => {
                                  handleUpdateChildSkill(child.id, cat.key, lk);
                                  setActiveCellPopover(null);
                                }}
                                className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-brand-primary-light hover:text-brand-primary flex items-center justify-between"
                              >
                                <span>{SKILL_LEVELS[lk].label}</span>
                                {levelKey === lk && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

