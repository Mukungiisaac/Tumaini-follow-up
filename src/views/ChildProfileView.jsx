import React, { useState } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import RadarChart from '../components/common/RadarChart';
import SkillLevelBadge from '../components/common/SkillLevelBadge';
import {
  Keyboard,
  FileText,
  Code,
  Presentation,
  Table,
  ShieldCheck,
  Palette,
  Globe,
  Quote,
  Sparkles,
  Award,
  Target,
  FileEdit,
  ArrowLeft,
  CheckCircle,
  Plus,
  Edit3,
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  XCircle,
  Laptop,
  BookOpen,
  Calculator,
  SlidersHorizontal
} from 'lucide-react';

export default function ChildProfileView() {
  const { id } = useParams();
  const {
    childrenList,
    scheduledSessions = [],
    openEditChildModal,
    openEditGoalModal,
    openRecordObsModal,
    openAddGoalModal,
    openRecordMilestoneModal,
    openScheduleModal,
    handleUpdateSessionStatus,
    handleUpdateChild
  } = useOutletContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('skills'); // 'skills' | 'observations' | 'goals' | 'milestones' | 'sessions'

  // Find target child or default to first (Samuel O.)
  const child = childrenList.find((c) => c.id === id) || childrenList[0];

  const currentMetrics = child.overviewMetrics || {
    computer: 75,
    bible: 50,
    mathScience: 75,
    arts: 25,
    music: 50,
    social: 75
  };

  const handleUpdateLevel = (metricKey, targetLevel) => {
    const scoreMap = { 1: 25, 2: 50, 3: 75, 4: 100 };
    const newScore = scoreMap[targetLevel] || 25;
    const updatedMetrics = {
      ...currentMetrics,
      [metricKey]: newScore
    };

    if (handleUpdateChild) {
      handleUpdateChild({
        ...child,
        overviewMetrics: updatedMetrics
      });
    }
  };

  const OVERVIEW_CATEGORIES = [
    { key: 'computer', label: 'Computer', icon: Laptop },
    { key: 'bible', label: 'Bible', icon: BookOpen },
    { key: 'mathScience', label: 'Math & Sci', icon: Calculator },
    { key: 'arts', label: 'Arts', icon: Palette }
  ];

  const getSkillIcon = (skillName) => {
    const name = skillName.toLowerCase();
    if (name.includes('typing')) return Keyboard;
    if (name.includes('word')) return FileText;
    if (name.includes('coding')) return Code;
    if (name.includes('powerpoint')) return Presentation;
    if (name.includes('excel')) return Table;
    if (name.includes('safety') || name.includes('security')) return ShieldCheck;
    if (name.includes('design') || name.includes('photo')) return Palette;
    if (name.includes('web') || name.includes('communication')) return Globe;
    return Sparkles;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/children')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </button>

      {/* Top Split Hero Layout (Page 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Large Child Profile Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-md min-h-[420px] flex flex-col justify-between bg-[#0C3440] text-white border border-[#134E5E]/60">
          {/* Background Child Image with Gradient Overlay */}
          <img
            src={child.image}
            alt={child.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2C37] via-[#0C3440]/70 to-[#0C3440]/50" />

          {/* Top Badges */}
          <div className="relative z-10 p-5 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#134E5E]/90 text-white text-xs font-bold rounded-full backdrop-blur-md uppercase tracking-wider border border-white/10">
                {child.grade}
              </span>
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full backdrop-blur-md uppercase tracking-wider">
                AGE {child.age}
              </span>
              <button
                onClick={() => openEditChildModal && openEditChildModal(child)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-full backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
              <button
                onClick={() => openScheduleModal && openScheduleModal(child.id)}
                className="px-3 py-1 bg-[#134E5E] hover:bg-[#0E3D4A] text-white text-xs font-bold rounded-full backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-md border border-[#C2B59B]/40 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" /> Schedule 1-on-1
              </button>
            </div>

            <span className="px-3 py-1 bg-white/90 text-slate-900 text-[11px] font-bold font-mono rounded-full shadow-md uppercase tracking-wider">
              MENTOR: {child.mentor}
            </span>
          </div>

          {/* Bottom Card Content */}
          <div className="relative z-10 p-6 space-y-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">
                {child.name}
              </h2>
              <p className="text-sm font-medium text-slate-200">
                {child.cottage}
              </p>
            </div>

            {/* Glass Personal Statement Quote Box (Page 1) */}
            <div className="bg-[#0A2C37]/80 backdrop-blur-md p-4 rounded-2xl border border-[#C2B59B]/40 space-y-2">
              <div className="flex items-center gap-2 text-[#C2B59B]">
                <Quote className="w-4 h-4 fill-[#C2B59B]" />
                <span className="text-[10px] font-bold uppercase font-mono tracking-widest text-[#C2B59B]">
                  PERSONAL STATEMENT
                </span>
              </div>
              <p className="text-sm italic font-medium text-white leading-relaxed">
                "{child.personalStatement}"
              </p>
            </div>
          </div>
        </div>

        {/* Right: Development Overview Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Development Overview</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#EBF5F7] text-[#134E5E] border border-[#BBE0E6] flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" /> EDITABLE
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Click level bars or select dropdown to update progress live.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* SVG Pentagon Radar Chart */}
            <div className="flex justify-center">
              <RadarChart metrics={currentMetrics} size={250} />
            </div>

            {/* Interactive & Editable Skill Progression Bars */}
            <div className="space-y-4">
              {OVERVIEW_CATEGORIES.map((cat) => {
                const IconComp = cat.icon;
                const score = currentMetrics[cat.key] ?? 50;

                let levelTier = 1;
                let badgeColorClass = 'text-slate-600 bg-slate-100 border-slate-200';
                let activeBarClass = 'bg-slate-500';

                if (score >= 85) {
                  levelTier = 4;
                  badgeColorClass = 'text-emerald-800 bg-emerald-50 border-emerald-200';
                  activeBarClass = 'bg-emerald-600';
                } else if (score >= 65) {
                  levelTier = 3;
                  badgeColorClass = 'text-[#134E5E] bg-[#EBF5F7] border-[#BBE0E6]';
                  activeBarClass = 'bg-[#134E5E]';
                } else if (score >= 40) {
                  levelTier = 2;
                  badgeColorClass = 'text-[#75674D] bg-[#F7F4EE] border-[#DCD4C4]';
                  activeBarClass = 'bg-[#C2B59B]';
                }

                return (
                  <div key={cat.key} className="space-y-1.5 group">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-slate-800">
                        <IconComp className="w-4 h-4 text-[#134E5E]" /> {cat.label}
                      </span>
                      <div className="relative inline-block">
                        <select
                          value={levelTier}
                          onChange={(e) => handleUpdateLevel(cat.key, Number(e.target.value))}
                          className={`text-[10px] font-mono font-bold uppercase py-0.5 px-2 rounded-full border cursor-pointer appearance-none pr-5 focus:outline-none transition-colors ${badgeColorClass}`}
                          title="Click to change level"
                        >
                          <option value={1}>BEGINNER (25%)</option>
                          <option value={2}>INTERMEDIATE (50%)</option>
                          <option value={3}>ADVANCED (75%)</option>
                          <option value={4}>MASTERED (100%)</option>
                        </select>
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none opacity-60">▼</span>
                      </div>
                    </div>

                    {/* Interactive 4-segment Progression Bar */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((seg) => {
                        const isActive = seg <= levelTier;
                        return (
                          <button
                            key={seg}
                            type="button"
                            onClick={() => handleUpdateLevel(cat.key, seg)}
                            className={`h-2.5 rounded-full transition-all cursor-pointer ${
                              isActive ? `${activeBarClass} shadow-xs scale-y-105` : 'bg-slate-200 hover:bg-slate-300'
                            }`}
                            title={`Set ${cat.label} level to segment ${seg}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8">
          <button
            onClick={() => setActiveTab('skills')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'skills'
                ? 'text-[#134E5E] border-b-2 border-[#134E5E]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Skill Map: Computer Focus
          </button>
          <button
            onClick={() => setActiveTab('observations')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'observations'
                ? 'text-[#134E5E] border-b-2 border-[#134E5E]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mentor Observations ({child.observations?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'goals'
                ? 'text-[#134E5E] border-b-2 border-[#134E5E]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Personal Goals ({child.goals?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'milestones'
                ? 'text-[#134E5E] border-b-2 border-[#134E5E]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Milestones Timeline ({child.milestones?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'sessions'
                ? 'text-[#134E5E] border-b-2 border-[#134E5E]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            1-on-1 Meetings ({scheduledSessions.filter(s => s.childId === child.id).length})
          </button>
        </div>

        <div className="pb-2 hidden md:block">
          <button
            onClick={openRecordObsModal}
            className="px-4 py-2 bg-[#0C3440] text-white text-xs font-bold rounded-xl hover:bg-[#134E5E] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <FileEdit className="w-3.5 h-3.5" /> Log Note
          </button>
        </div>
      </div>

      {/* Tab 1: Skill Map Cards (Page 1) */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {/* Skill Map Header Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Technical Skill Breakdown</h4>
              <p className="text-xs text-slate-500">Detailed observations and mastery levels</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> INTRODUCED
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> LEARNING
              </span>
              <span className="flex items-center gap-1.5 text-purple-600">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> INDEPENDENT
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> MASTERED
              </span>
            </div>
          </div>

          {/* Skill Cards Grid (Matching Page 1 Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(child.skillsMap || []).map((skill) => {
              const Icon = getSkillIcon(skill.name);
              return (
                <div
                  key={skill.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div>
                    {/* Top row: Icon & Status Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                        <Icon className="w-6 h-6" />
                      </div>
                      <SkillLevelBadge levelKey={skill.level} size="sm" />
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-bold text-slate-900 mb-2">
                      {skill.name}
                    </h4>

                    {/* Mentor Observation snippet */}
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{skill.note}"
                    </p>
                  </div>

                  {/* Bottom Visual Progress Bar */}
                  <div className="pt-2">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all duration-500"
                        style={{
                          width:
                            skill.level === 'MASTERED'
                              ? '100%'
                              : skill.level === 'INDEPENDENT'
                              ? '75%'
                              : skill.level === 'WITH_HELP'
                              ? '50%'
                              : skill.level === 'LEARNING'
                              ? '30%'
                              : '10%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Mentor Observations */}
      {activeTab === 'observations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase">
              Recorded Observation Log
            </h4>
            <button
              onClick={openRecordObsModal}
              className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Observation
            </button>
          </div>

          {(!child.observations || child.observations.length === 0) ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 text-slate-500 text-xs">
              No observations recorded yet. Click "Add Observation" above.
            </div>
          ) : (
            <div className="space-y-4">
              {child.observations.map((obs) => (
                <div key={obs.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">
                      {obs.area}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {obs.date}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    "{obs.text}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">STRENGTH</span>
                      <span className="font-semibold text-emerald-700">{obs.strength}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">CHALLENGE</span>
                      <span className="font-semibold text-rose-700">{obs.challenge}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block">NEXT STEP</span>
                      <span className="font-semibold text-slate-800">{obs.nextStep}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Personal Goals */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase">
              Target Goals & Action Plans
            </h4>
            <button
              onClick={openAddGoalModal}
              className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(child.goals || []).map((goal) => (
              <div key={goal.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5 hover:border-purple-200 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-md border border-purple-100/60">
                      {goal.area}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 font-mono">
                      Target: {goal.targetDate}
                    </span>
                  </div>

                  <button
                    onClick={() => openEditGoalModal && openEditGoalModal({ ...goal, childId: child.id })}
                    className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Edit Goal & Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{goal.title}</h4>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span className="text-slate-400 font-mono text-[10px]">PROGRESS</span>
                    <span className="text-purple-600 font-mono">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {goal.note && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                    "{goal.note}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Milestones Timeline */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase">
              Milestone & Honor Achievements
            </h4>
            <button
              onClick={openRecordMilestoneModal}
              className="px-4 py-2 bg-[#134E5E] text-white text-xs font-bold rounded-xl hover:bg-[#0E3D4A] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" /> Record Milestone
            </button>
          </div>

          <div className="space-y-4">
            {(child.milestones || []).map((m) => (
              <div key={m.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex items-start gap-4">
                <div className="p-3 bg-[#EBF5F7] text-[#134E5E] rounded-2xl shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-bold text-slate-900">{m.title}</h4>
                    <span className="text-xs font-bold text-slate-400 font-mono">{m.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: 1-on-1 Sessions */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-mono uppercase">
                Scheduled & Past 1-on-1 Sessions
              </h4>
              <p className="text-xs text-slate-500">Mentor check-ins, dates, times, and meeting locations.</p>
            </div>
            <button
              onClick={() => openScheduleModal(child.id)}
              className="px-4 py-2 bg-[#134E5E] text-white text-xs font-bold rounded-xl hover:bg-[#0E3D4A] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <UserCheck className="w-4 h-4" /> Schedule New 1-on-1
            </button>
          </div>

          {scheduledSessions.filter(s => s.childId === child.id).length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-8 space-y-2">
              <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No 1-on-1 sessions scheduled for {child.name} yet.</p>
              <button
                onClick={() => openScheduleModal(child.id)}
                className="text-xs font-bold text-[#134E5E] hover:text-[#0E3D4A] underline cursor-pointer"
              >
                Book first 1-on-1 session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scheduledSessions.filter(s => s.childId === child.id).map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                        Mentor: {s.mentorName}
                      </span>
                      <span
                        className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          s.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : s.status === 'Cancelled'
                            ? 'bg-slate-200 text-slate-600'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{s.topic}</h4>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-purple-700 font-bold">
                        <Calendar className="w-3.5 h-3.5" /> {s.date}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 font-bold font-mono">
                        <Clock className="w-3.5 h-3.5 text-purple-600" /> {s.time}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {s.location}
                      </span>
                    </div>

                    {s.notes && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                        "{s.notes}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => openScheduleModal(child.id)}
                      className="text-slate-500 hover:text-purple-600 font-medium transition-colors cursor-pointer"
                    >
                      Reschedule
                    </button>
                    {s.status === 'Scheduled' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateSessionStatus && handleUpdateSessionStatus(s.id, 'Cancelled')}
                          className="px-2.5 py-1 text-slate-500 hover:text-rose-600 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateSessionStatus && handleUpdateSessionStatus(s.id, 'Completed')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
