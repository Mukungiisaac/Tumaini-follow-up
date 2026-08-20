import React, { useState } from 'react';
import { MOCK_BIBLE_CURRICULUM } from '../data/mockData';
import { BookOpen, Award, CheckCircle, Heart, Star, Sparkles } from 'lucide-react';

export default function BibleDiscipleshipView() {
  const [activeSubTab, setActiveSubTab] = useState('memory'); // 'memory' | 'catechism' | 'genesis'
  const [memorized, setMemorized] = useState({});

  const toggleVerse = (v) => {
    setMemorized(prev => ({ ...prev, [v]: !prev[v] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-purple-600 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-purple-200 text-xs font-mono uppercase font-bold tracking-widest">
            <BookOpen className="w-4 h-4" /> SPIRITUAL GROWTH & CHARACTER
          </div>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
            Bible & Discipleship Program
          </h2>
          <p className="text-xs text-purple-100 max-w-xl leading-relaxed">
            Focusing on Scripture memorization, Genesis study modules, and Westminster Shorter Catechism foundations for personal character development.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center shrink-0">
          <span className="text-2xl font-black text-white font-mono">95%</span>
          <p className="text-[10px] text-purple-200 uppercase font-mono tracking-wider">Active Participation</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center bg-slate-200/60 p-1.5 rounded-2xl gap-1 w-fit">
        <button
          onClick={() => setActiveSubTab('memory')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
            activeSubTab === 'memory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Biggest Story Verse Cards
        </button>
        <button
          onClick={() => setActiveSubTab('catechism')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
            activeSubTab === 'catechism' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Westminster Shorter Catechism
        </button>
        <button
          onClick={() => setActiveSubTab('genesis')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
            activeSubTab === 'genesis' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Genesis Study Modules
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
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full font-mono">
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
                      {isDone ? '✓ Recited' : 'Mark Recited'}
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
              <span className="text-xs font-bold font-mono text-purple-600 uppercase">
                QUESTION #{cq.qNo}
              </span>
              <h4 className="text-base font-bold text-slate-900">{cq.question}</h4>
              <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                <span className="text-[10px] font-bold text-purple-800 uppercase font-mono block mb-1">
                  ANSWER:
                </span>
                <p className="text-sm font-semibold text-purple-950">{cq.answer}</p>
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
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full font-mono">
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
    </div>
  );
}
