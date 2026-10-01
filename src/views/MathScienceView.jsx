import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Calculator, AlertCircle, Users, Sparkles, BookOpen, UserCheck } from 'lucide-react';

export default function MathScienceView() {
  const { childrenList } = useOutletContext();
  const navigate = useNavigate();

  // Children needing math/sci support
  const supportChildren = childrenList.filter(c => (c.overviewMetrics?.mathScience || 80) < 70);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#0e2a47] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-mono uppercase font-bold tracking-widest">
            <Calculator className="w-4 h-4" /> STEM TUTORING & NUMERACY
          </div>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
            Math & Science Academic Support
          </h2>
          <p className="text-xs text-blue-100 max-w-xl leading-relaxed">
            Individual tutoring sessions, hands-on science experiment labs, and peer tutoring networks to build confidence in STEM.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center shrink-0">
          <span className="text-2xl font-black text-white font-mono">18</span>
          <p className="text-[10px] text-blue-200 uppercase font-mono tracking-wider">Students Supported</p>
        </div>
      </div>

      {/* Children Needing Academic Support */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" /> Students Receiving Peer Tutoring
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportChildren.map((c) => (
            <div key={c.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <img src={c.image} alt={c.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{c.name}</h4>
                  <p className="text-xs text-slate-500">{c.grade} | {c.cottage}</p>
                </div>
              </div>

              <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100 text-xs text-rose-800 font-medium">
                Support plan: {c.goals?.find((goal) => /math|science/i.test(goal.area || ''))?.title
                  || c.observations?.find((observation) => /math|science/i.test(observation.area || ''))?.nextStep
                  || 'Not recorded'}
              </div>

              <button
                onClick={() => navigate(`/children/${c.id}`)}
                className="w-full py-2 bg-slate-100 hover:bg-brand-primary hover:text-white text-xs font-bold text-slate-800 rounded-xl transition-colors"
              >
                View Tutoring Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Science Projects */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Hands-on Science Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-blue-600 font-mono uppercase">LAB PROJECT #1</span>
            <h4 className="text-sm font-bold text-slate-900">Solar Energy & Battery Circuits</h4>
            <p className="text-xs text-slate-600">Grade 6-7 students build miniature solar panel circuits powering LED lamps.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-blue-600 font-mono uppercase">LAB PROJECT #2</span>
            <h4 className="text-sm font-bold text-slate-900">Plant Photosynthesis & Soil Testing</h4>
            <p className="text-xs text-slate-600">Primary 4-5 students test cottage garden soil pH and sunlight growth rates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

