import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { GRADE_LEVELS, SKILL_LEVELS } from '../data/mockData';
import { Star, CheckCircle2, ChevronDown, X, Users, Sparkles, Layers } from 'lucide-react';
import ChildImage from '../components/common/ChildImage';

const LEVEL_DESCRIPTIONS = {
  NOT_INTRODUCED: 'Initial stage · Topic has not yet been introduced or assessed',
  LEARNING: 'Introductory stage · Currently practicing fundamental concepts with guidance',
  WITH_HELP: 'Developing stage · Able to complete tasks when guided by a mentor',
  INDEPENDENT: 'Proficient stage · Demonstrates skill and performs tasks without assistance',
  MASTERED: 'Advanced mastery · Excels consistently and can teach/mentor other children'
};

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
    if (!child) return 'NOT_INTRODUCED';
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

  const activeChild = activeCellPopover ? childrenList.find((c) => c.id === activeCellPopover.childId) : null;
  const activeCategory = activeCellPopover ? categories.find((cat) => cat.key === activeCellPopover.category) : null;
  const activeLevelKey = activeChild && activeCategory ? getLevelForCategory(activeChild, activeCategory.key) : null;

  const renderLevelIcon = (levelKey, size = 'md') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    }[size] || 'h-5 w-5';

    if (levelKey === 'MASTERED') {
      return (
        <span className={`flex ${sizeClasses} shrink-0 items-center justify-center rounded-full bg-[#D99B3C] text-white shadow-xs`}>
          <Star className="h-3 w-3 fill-current" />
        </span>
      );
    }
    if (levelKey === 'INDEPENDENT') {
      return <span className={`${sizeClasses} shrink-0 rounded-full bg-[#0C3440]`} />;
    }
    if (levelKey === 'WITH_HELP') {
      return <span className={`${sizeClasses} shrink-0 rounded-full bg-[#38BDF8]`} />;
    }
    if (levelKey === 'LEARNING') {
      return <span className={`${sizeClasses} shrink-0 rounded-full border-2 border-[#D99B3C] bg-[#FEF3C7]`} />;
    }
    return <span className={`${sizeClasses} shrink-0 rounded-full border border-slate-300 bg-slate-100`} />;
  };

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1.5 min-w-0">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#E8F0F0] text-[#0C3440] text-[11px] font-bold uppercase tracking-wider font-mono">
            <span>Cohort Assessment</span>
            <span className="text-[#0C3440]/30">•</span>
            <span>Term 3</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Progress Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
            Skill development across curriculum and character areas. Tap any subject badge to edit progress.
          </p>
        </div>

        {/* Metric Counter Card */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 shrink-0 self-start sm:self-center">
          <div className="h-9 w-9 rounded-lg bg-[#0C3440] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900 tabular-nums leading-none">
                {filteredChildren.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                / {childrenList.length}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mt-0.5">
              {filteredChildren.length === 1 ? 'Child Listed' : 'Children Listed'}
            </span>
          </div>
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

      {/* Mobile Card Grid View */}
      <div className="space-y-3 md:hidden">
        {filteredChildren.map((child) => (
          <article key={child.id} className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <button
              type="button"
              onClick={() => navigate(`/children/${child.id}`)}
              className="flex w-full min-w-0 items-center gap-3 border-b border-slate-100 p-3 text-left hover:bg-slate-50 transition-colors"
            >
              <ChildImage
                src={child.image}
                alt={child.name}
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900">{child.name}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {child.grade}{child.mentor ? ` · ${child.mentor}` : ''}
                </span>
              </span>
              <span className="shrink-0 text-xs font-semibold text-brand-primary">Profile</span>
            </button>

            <div className="grid grid-cols-2 gap-2 p-2.5">
              {categories.map((cat) => {
                const levelKey = getLevelForCategory(child, cat.key);
                const isSelected =
                  activeCellPopover &&
                  activeCellPopover.childId === child.id &&
                  activeCellPopover.category === cat.key;

                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() =>
                      setActiveCellPopover({ childId: child.id, category: cat.key })
                    }
                    className={`flex min-h-11 w-full min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary'
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200'
                    }`}
                    aria-label={`${child.name}, ${cat.label}: ${SKILL_LEVELS[levelKey]?.label}. Tap to edit progress`}
                  >
                    {renderLevelIcon(levelKey, 'sm')}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                        {cat.label}
                      </span>
                      <span className="block truncate text-xs font-semibold text-slate-800">
                        {SKILL_LEVELS[levelKey]?.label}
                      </span>
                    </span>
                  </button>
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

      {/* Desktop Table View */}
      <div className="hidden overflow-hidden rounded-md border border-slate-200 bg-white md:block shadow-xs">
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
                          title={`${cat.label}: ${SKILL_LEVELS[levelKey]?.label} (Click to edit)`}
                          aria-label={`${child.name}, ${cat.label}: ${SKILL_LEVELS[levelKey]?.label}. Update skill level`}
                        >
                          {levelKey === 'MASTERED' ? (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-accent text-white shadow-xs">
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

      {/* Interactive Scrollable Progress Editor Modal / Bottom Sheet */}
      {activeCellPopover && activeChild && activeCategory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:items-center sm:p-4 animate-in fade-in duration-200">
          {/* Backdrop Click */}
          <div
            className="fixed inset-0"
            onClick={() => setActiveCellPopover(null)}
          />

          {/* Sheet Container */}
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-t-2xl sm:rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            {/* Drag Handle on Mobile */}
            <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-slate-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex items-center gap-3 min-w-0">
                <ChildImage
                  src={activeChild.image}
                  alt={activeChild.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary font-mono block">
                    UPDATE {activeCategory.label} PROGRESS
                  </span>
                  <h3 className="truncate text-base font-bold text-slate-900">
                    {activeChild.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveCellPopover(null)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 shadow-xs border border-slate-200/80 transition-all active:scale-95 cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Progress Levels List */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2.5">
              <p className="text-xs text-slate-500 font-medium px-1 pb-1">
                Scroll and select the current progress level for <strong className="text-slate-700">{activeCategory.label}</strong>:
              </p>

              {Object.keys(SKILL_LEVELS).map((levelKey) => {
                const isSelected = activeLevelKey === levelKey;
                const levelData = SKILL_LEVELS[levelKey];

                return (
                  <button
                    key={levelKey}
                    type="button"
                    onClick={() => {
                      handleUpdateChildSkill(activeChild.id, activeCategory.key, levelKey);
                      setActiveCellPopover(null);
                    }}
                    className={`flex w-full items-start gap-3.5 rounded-xl border p-3.5 text-left transition-all active:scale-[0.99] ${
                      isSelected
                        ? 'border-[#0C3440] bg-[#0C3440]/5 ring-1 ring-[#0C3440]'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {renderLevelIcon(levelKey, 'md')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-bold ${isSelected ? 'text-[#0C3440]' : 'text-slate-800'}`}>
                          {levelData.label}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#0C3440] px-2 py-0.5 text-[10px] font-bold text-white">
                            <CheckCircle2 className="h-3 w-3" /> Current
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 leading-snug">
                        {LEVEL_DESCRIPTIONS[levelKey]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-5 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Tap any level to update immediately
              </span>
              <button
                type="button"
                onClick={() => setActiveCellPopover(null)}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
