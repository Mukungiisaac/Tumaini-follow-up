import React, { useState } from 'react';
import { MOCK_COMPUTER_CURRICULUM } from '../data/mockData';
import { Laptop, CheckCircle2, BookOpen, Layers, Award, Terminal, Code } from 'lucide-react';

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
      {/* Header Banner */}
      <div className="bg-[#0b172a] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-primary-light text-xs font-mono uppercase font-bold tracking-widest">
            <Laptop className="w-4 h-4" /> EMPLOYTMENT-ORIENTED IT CURRICULUM
          </div>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
            Computer & Digital Literacy Skills
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Practical 4-Level technology roadmap preparing children from basic typing and office tools to graphic design, HTML/CSS web coding, and digital entrepreneurship.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center shrink-0">
          <span className="text-2xl font-black text-white font-mono">42</span>
          <p className="text-[10px] text-brand-primary-light uppercase font-mono tracking-wider">Active Tech Learners</p>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {MOCK_COMPUTER_CURRICULUM.map((lvl) => (
          <button
            key={lvl.level}
            onClick={() => setSelectedLevel(lvl.level)}
            className={`p-4 rounded-2xl text-left border transition-all ${
              selectedLevel === lvl.level
                ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-purple-900/20'
                : 'bg-white text-slate-800 border-slate-100 hover:border-brand-primary-light'
            }`}
          >
            <span className="text-[10px] font-bold font-mono uppercase tracking-widest block mb-1 opacity-80">
              LEVEL {lvl.level}
            </span>
            <h4 className="text-xs font-bold leading-tight">
              {lvl.title.split(':')[1] || lvl.title}
            </h4>
          </button>
        ))}
      </div>

      {/* Selected Level Modules */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{levelData.title}</h3>
            <p className="text-xs text-slate-500 font-medium">{levelData.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {levelData.modules.map((mod) => {
            const isDone = !!completedModules[mod.id];
            return (
              <div
                key={mod.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-3 py-1 bg-brand-primary-light text-brand-primary text-xs font-bold rounded-full font-mono">
                      {mod.lessonsCount} Lessons
                    </span>
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isDone ? 'Completed' : 'Mark Complete'}</span>
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-3">{mod.title}</h4>

                  {/* Practical Project Card */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1 mb-4">
                    <span className="text-[10px] font-bold text-brand-primary font-mono uppercase tracking-widest flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> PRACTICAL PROJECT
                    </span>
                    <p className="text-xs font-bold text-slate-900">{mod.project}</p>
                  </div>

                  {/* Learning Objectives */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                      LEARNING OBJECTIVES
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {mod.objectives.map((obj, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

