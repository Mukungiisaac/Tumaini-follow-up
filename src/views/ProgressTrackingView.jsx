import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { GRADE_LEVELS, SKILL_LEVELS } from '../data/mockData';
import { Star, CheckCircle2, ChevronDown } from 'lucide-react';
import ChildImage from '../components/common/ChildImage';

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
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <div className="flex min-w-0 items-start justify-between gap-3 sm:items-end sm:gap-4">
        <div className="min-w-0 space-y-1.5">
          <span className="text-[10px] font-bold tracking-[0.14em] text-brand-primary uppercase">
            Cohort assessment <span className="mx-1 text-slate-300">/</span> Term 3
          </span>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Progress matrix
          </h2>
          <p className="text-sm leading-5 text-slate-500">
            Skill development across curriculum and character areas.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-semibold tabular-nums text-slate-900">{filteredChildren.length}</p>
          <p className="text-xs text-slate-500">{filteredChildren.length === 1 ? 'child shown' : 'children shown'}</p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3 border-y border-slate-200 py-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block sm:hidden">
          <span className="sr-only">Filter by grade</span>
          <select
            value={gradeFilter}
            onChange={(event) => setGradeFilter(event.target.value)}
            className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
          >
            {gradesList.map((grade) => (
              <option key={grade} value={grade}>
                {grade === 'ALL GRADES' ? 'All grades' : grade}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </label>
        <div className="hidden max-w-full flex-wrap items-center gap-1 rounded-md bg-slate-100 p-1 sm:flex">
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
            className="h-11 w-full min-w-0 appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 sm:w-auto sm:min-w-44 sm:rounded-md"
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

      <div className="flex min-w-0 flex-col gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3 sm:px-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
          Skill levels
        </span>
        <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-xs font-medium text-slate-700 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5">
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

      <div className="space-y-3 md:hidden">
        {filteredChildren.map((child) => (
          <article key={child.id} className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => navigate(`/children/${child.id}`)}
              className="flex w-full min-w-0 items-center gap-3 border-b border-slate-100 p-3 text-left"
            >
              <ChildImage
                src={child.image}
                alt={child.name}
                className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900">{child.name}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {child.grade}{child.mentor ? ` · ${child.mentor}` : ''}
                </span>
              </span>
              <span className="shrink-0 text-xs font-semibold text-brand-primary">Profile</span>
            </button>
            <div className="grid grid-cols-2 gap-2 p-3">
              {categories.map((cat, index) => {
                const levelKey = getLevelForCategory(child, cat.key);
                const isPopoverOpen =
                  activeCellPopover &&
                  activeCellPopover.childId === child.id &&
                  activeCellPopover.category === cat.key;

                return (
                  <div key={cat.key} className="relative min-w-0">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveCellPopover(
                          isPopoverOpen ? null : { childId: child.id, category: cat.key }
                        )
                      }
                      className="flex min-h-11 w-full min-w-0 items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-2 text-left"
                      aria-label={`${child.name}, ${cat.label}: ${SKILL_LEVELS[levelKey]?.label}. Update skill level`}
                      aria-expanded={Boolean(isPopoverOpen)}
                    >
                      {levelKey === 'MASTERED' ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-accent text-white">
                          <Star className="h-3 w-3 fill-current" />
                        </span>
                      ) : levelKey === 'INDEPENDENT' ? (
                        <span className="h-4 w-4 shrink-0 rounded-full bg-brand-primary" />
                      ) : levelKey === 'WITH_HELP' ? (
                        <span className="h-4 w-4 shrink-0 rounded-full bg-blue-300" />
                      ) : levelKey === 'LEARNING' ? (
                        <span className="h-4 w-4 shrink-0 rounded-full border border-brand-accent-light bg-brand-accent-light" />
                      ) : (
                        <span className="h-4 w-4 shrink-0 rounded-full border border-slate-300 bg-slate-100" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[10px] font-semibold uppercase tracking-wide text-slate-500">{cat.label}</span>
                        <span className="block truncate text-xs text-slate-700">{SKILL_LEVELS[levelKey]?.label}</span>
                      </span>
                    </button>
                    {isPopoverOpen && (
                      <div className={`absolute ${index % 2 === 0 ? 'left-0' : 'right-0'} top-full z-40 mt-1 w-52 max-w-[calc(100vw-2rem)] space-y-1 rounded-lg border border-slate-200 bg-white p-2 text-left shadow-lg`}>
                        <span className="block px-2 text-[10px] font-bold uppercase text-slate-400">
                          Update {cat.label}
                        </span>
                        {Object.keys(SKILL_LEVELS).map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              handleUpdateChildSkill(child.id, cat.key, key);
                              setActiveCellPopover(null);
                            }}
                            className="flex min-h-10 w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-primary"
                          >
                            <span>{SKILL_LEVELS[key].label}</span>
                            {levelKey === key && <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
        {filteredChildren.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            No children match these filters.
          </div>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-md border border-slate-200 bg-white md:block">
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
                      <ChildImage
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
