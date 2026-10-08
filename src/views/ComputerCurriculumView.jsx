import React, { useState } from 'react';
import { MOCK_COMPUTER_CURRICULUM } from '../data/mockData';
import { Laptop, CheckCircle2, BookOpen, Award, Zap } from 'lucide-react';

export default function ComputerCurriculumView() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [completedModules, setCompletedModules] = useState({});

  const levelData = MOCK_COMPUTER_CURRICULUM.find((l) => l.level === selectedLevel) || MOCK_COMPUTER_CURRICULUM[0];

  const toggleModule = (modId) => {
    setCompletedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="space-y-6">
        {/* Main Header Banner */}
        <div className="bg-gradient-to-br from-brand-primary to-[#0a2d38] text-white p-8 lg:p-10 rounded-xl shadow-lg">
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center gap-2 text-brand-primary-light text-xs font-semibold uppercase tracking-wider">
              <Laptop className="w-4 h-4" />
              <span>Employment-Oriented IT Curriculum</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Computer & Digital Literacy Skills
            </h1>
            <p className="text-sm lg:text-base text-slate-200 leading-relaxed max-w-2xl">
              A comprehensive 4-level technology roadmap that guides learners from fundamental computer basics through professional web development and digital entrepreneurship. Designed to equip children with practical, job-ready skills.
            </p>
          </div>
        </div>

        {/* Stats & Info Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Learners</p>
                <p className="text-3xl font-bold text-brand-primary">42</p>
              </div>
              <div className="p-3 bg-brand-primary-light rounded-lg">
                <Zap className="w-6 h-6 text-brand-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Curriculum Levels</p>
                <p className="text-3xl font-bold text-brand-primary">4</p>
              </div>
              <div className="p-3 bg-brand-primary-light rounded-lg">
                <BookOpen className="w-6 h-6 text-brand-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Selector */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Select Curriculum Level</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MOCK_COMPUTER_CURRICULUM.map((lvl) => (
            <button
              key={lvl.level}
              onClick={() => setSelectedLevel(lvl.level)}
              className={`p-4 rounded-lg text-left border-2 transition-all duration-200 ${
                selectedLevel === lvl.level
                  ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-brand-primary-light hover:shadow-sm'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
                Level {lvl.level}
              </div>
              <h4 className="text-sm font-bold leading-tight">
                {lvl.title.split(':')[1]?.trim() || lvl.title}
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* Modules Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">{levelData.title}</h2>
          <p className="text-sm text-slate-600">{levelData.subtitle}</p>
          <div className="h-1 w-20 bg-brand-primary rounded-full" />
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {levelData.modules.map((mod) => {
            const isDone = !!completedModules[mod.id];
            return (
              <div
                key={mod.id}
                className={`rounded-lg border transition-all duration-300 p-6 flex flex-col space-y-4 ${
                  isDone
                    ? 'bg-gradient-to-br from-emerald-50 to-emerald-25 border-emerald-200 shadow-sm'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-brand-primary-light'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary-light rounded-full">
                      <BookOpen className="w-3.5 h-3.5 text-brand-primary" />
                      <span className="text-xs font-semibold text-brand-primary">{mod.lessonsCount} Lessons</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{mod.title}</h3>
                  </div>

                  <button
                    onClick={() => toggleModule(mod.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{isDone ? 'Done' : 'Mark'}</span>
                  </button>
                </div>

                {/* Practical Project */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-brand-primary" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Practical Project</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{mod.project}</p>
                </div>

                {/* Learning Objectives */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning Objectives</span>
                  <ul className="space-y-2">
                    {mod.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status Indicator */}
                {isDone && (
                  <div className="pt-2 border-t border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Module Completed
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

