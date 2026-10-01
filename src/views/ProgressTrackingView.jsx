import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { GRADE_LEVELS, SKILL_LEVELS } from '../data/mockData';
import { Star, CheckCircle2, ChevronDown } from 'lucide-react';

export default function ProgressTrackingView() {
  const { childrenList, handleUpdateChildSkill } = useOutletContext();
  const navigate = useNavigate();

  const [gradeFilter, setGradeFilter] = useState('ALL GRADES');
  const [skillFilter, setSkillFilter] = useState('ALL LEVELS');
  const [activeCellPopover, setActiveCellPopover] = useState(null); // { childId, category }

  const gradesList = ['ALL GRADES', ...GRADE_LEVELS];
  const skillFilters = ['ALL LEVELS', ...Object.keys(SKILL_LEVELS)];

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
    if (child.skillLevels?.[catKey]) return child.skillLevels[catKey];

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
    const matchesGrade = gradeFilter === 'ALL GRADES' || c.grade.toLowerCase().includes(
      gradeFilter.toLowerCase().split(' ')[0] + ' ' + (gradeFilter.toLowerCase().split(' ')[1] || '')
    );
    const matchesSkill = skillFilter === 'ALL LEVELS' || categories.some(
      (category) => getLevelForCategory(c, category.key) === skillFilter
    );
    return matchesGrade && matchesSkill;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold tracking-[0.14em] text-brand-primary uppercase">
            Cohort assessment <span className="mx-1 text-slate-300">/</span> Term 3
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Progress matrix
          </h2>
          <p className="text-sm text-slate-500">
            Skill development across curriculum and character areas.
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold tabular-nums text-slate-900">{filteredChildren.length}</p>
          <p className="text-xs text-slate-500">{filteredChildren.length === 1 ? 'child shown' : 'children shown'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-y border-slate-200 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-md bg-slate-100 p-1">
          {gradesList.map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`shrink-0 rounded px-3 py-2 text-xs font-semibold transition-colors ${
                gradeFilter === g
                  ? 'bg-white text-brand-primary shadow-sm'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
              }`}
              aria-pressed={gradeFilter === g}
            >
              {g}
            </button>
          ))}
        </div>

        <label className="relative flex shrink-0 items-center">
          <span className="sr-only">Filter by skill level</span>
          <select
            value={skillFilter}
            onChange={(event) => setSkillFilter(event.target.value)}
            className="h-10 min-w-44 appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
          >
            {skillFilters.map((level) => (
              <option key={level} value={level}>
                {level === 'ALL LEVELS' ? 'All skill levels' : SKILL_LEVELS[level].label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-500" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-md border border-slate-200 bg-white px-4 py-3">
        <span className="text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase">
          Skill levels
        </span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-700">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full border border-slate-300 bg-slate-100" />
            <span>Not Introduced</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full border border-brand-accent-light bg-brand-accent-light" />
            <span>Learning</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-blue-300" />
            <span>With Help</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-brand-primary" />
            <span>Independent</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-white">
              <Star className="h-2.5 w-2.5 fill-current" />
            </span>
            <span>Mentors Others</span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="sticky left-0 z-10 w-72 border-r border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase">
                  Child
                </th>
                {categories.map((cat) => (
                  <th
                    key={cat.key}
                    className="px-3 py-3 text-center text-[10px] font-bold tracking-[0.08em] text-slate-500 uppercase"
                  >
                    {cat.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChildren.map((child) => (
                <tr key={child.id} className="group transition-colors hover:bg-slate-50/70">
                  <td className="sticky left-0 z-[1] border-r border-slate-100 bg-white px-5 py-3 group-hover:bg-slate-50">
                    <div
                      onClick={() => navigate(`/children/${child.id}`)}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <img
                        src={child.image}
                        alt={child.name}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold text-slate-900 group-hover:text-brand-primary">
                          {child.name}
                        </h4>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {child.grade} <span className="px-1 text-slate-300">/</span> {child.mentor}
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
                      <td key={cat.key} className="relative px-3 py-3 text-center">
                        <button
                          onClick={() =>
                            setActiveCellPopover(
                              isPopoverOpen ? null : { childId: child.id, category: cat.key }
                            )
                          }
                          className="inline-flex items-center justify-center rounded-full p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                          title={`${cat.label}: ${SKILL_LEVELS[levelKey]?.label}`}
                          aria-label={`${child.name}, ${cat.label}: ${SKILL_LEVELS[levelKey]?.label}. Update skill level`}
                        >
                          {levelKey === 'MASTERED' ? (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-accent text-white">
                              <Star className="h-3.5 w-3.5 fill-current" />
                            </span>
                          ) : levelKey === 'INDEPENDENT' ? (
                            <span className="h-6 w-6 rounded-full bg-brand-primary" />
                          ) : levelKey === 'WITH_HELP' ? (
                            <span className="h-6 w-6 rounded-full bg-blue-300" />
                          ) : levelKey === 'LEARNING' ? (
                            <span className="h-6 w-6 rounded-full border border-brand-accent-light bg-brand-accent-light" />
                          ) : (
                            <span className="h-6 w-6 rounded-full border border-slate-300 bg-slate-100" />
                          )}
                        </button>

                        {/* Interactive Status Selector Popover */}
                        {isPopoverOpen && (
                          <div className="absolute left-1/2 top-full z-40 mt-1 w-48 -translate-x-1/2 space-y-1 rounded-md border border-slate-200 bg-white p-2 text-left shadow-lg animate-in fade-in zoom-in-95">
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
                                className="flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-primary"
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
              {filteredChildren.length === 0 && (
                <tr>
                  <td colSpan={categories.length + 1} className="px-5 py-12 text-center text-sm text-slate-500">
                    No children match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

