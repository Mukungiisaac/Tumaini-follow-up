import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import Avatar from '../components/common/Avatar';
import {
  Users,
  UserCheck,
  Laptop,
  BookOpen,
  Calculator,
  Target,
  AlertCircle,
  PlusCircle,
  FileEdit,
  Award,
  Calendar,
  ArrowRight,
  TrendingUp,
  Palette,
  Heart,
  ChevronRight,
  Zap,
  BarChart3
} from 'lucide-react';

export default function DashboardView() {
  const {
    dashboardStats,
    needsAttention,
    recentProgress,
    openAddChildModal,
    openRecordObsModal,
    openAddGoalModal,
    openRecordMilestoneModal,
    openScheduleModal
  } = useOutletContext();

  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Top Overview Cards Row (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <StatCard
          title="TOTAL"
          value={dashboardStats.totalChildren}
          subtitle="Children Enrolled"
          icon={Users}
          color="purple"
          onClick={() => navigate('/children')}
        />
        <StatCard
          title="MENTORED"
          value={dashboardStats.activeMentorships}
          subtitle="Active Mentorships"
          icon={UserCheck}
          color="indigo"
          onClick={() => navigate('/mentorship')}
        />
        <StatCard
          title="TECH"
          value={dashboardStats.computerLearners}
          subtitle="Computer Learners"
          icon={Laptop}
          color="blue"
          onClick={() => navigate('/curriculum/computer')}
        />
        <StatCard
          title="BIBLE"
          value={dashboardStats.bibleProgressPct}
          subtitle="Active Progress"
          icon={BookOpen}
          color="emerald"
          onClick={() => navigate('/curriculum/bible')}
        />
        <StatCard
          title="SUPPORT"
          value={dashboardStats.mathSupportNeeds}
          subtitle="Math/Science Needs"
          icon={Calculator}
          color="rose"
          onClick={() => navigate('/curriculum/math-science')}
        />
        <StatCard
          title="GOALS"
          value={dashboardStats.activeGoalsCount}
          subtitle="Active Targets"
          icon={Target}
          color="amber"
          onClick={() => navigate('/goals')}
        />
      </div>

      {/* Main Grid: Left 2 Columns, Right 1 Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Needs Attention Section */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100/60">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Needs Attention</h3>
                  <p className="text-xs text-slate-500 font-medium">Children requiring follow-up or extra support</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/children?filter=support')}
                className="text-[11px] font-bold text-purple-600 hover:text-purple-700 tracking-wider uppercase font-mono flex items-center gap-0.5 transition-colors"
              >
                VIEW ALL <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {needsAttention.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/60 hover:bg-white hover:border-purple-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2.5">
                      <Avatar
                        src={item.image}
                        name={item.name}
                        size="md"
                        className="ring-2 ring-white shadow-2xs"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">{item.name}</h4>
                        <span className="text-[11px] font-medium text-slate-400">Age {item.age}</span>
                      </div>
                    </div>

                    <div className="mb-2.5">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md ${item.badgeBg}`}>
                        {item.category}
                      </span>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (item.actionText === 'Schedule 1-on-1') {
                        openScheduleModal(item.childId);
                      } else {
                        navigate(`/children/${item.childId}`);
                      }
                    }}
                    className="w-full mt-2 py-1.5 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 hover:border-purple-300 rounded-lg transition-colors text-center shadow-2xs cursor-pointer"
                  >
                    {item.actionText}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Development Focus Areas */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 px-0.5">Development Focus Areas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Computer Skills Card */}
              <div
                onClick={() => navigate('/curriculum/computer')}
                className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-800 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] group"
              >
                <div>
                  <div className="p-2.5 bg-white/10 rounded-xl w-fit mb-3 text-purple-300">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Computer Skills</h4>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-300 font-mono">
                    <div><span className="font-bold text-white text-sm">42</span> Active</div>
                    <div><span className="font-bold text-white text-sm">12</span> Milestones</div>
                  </div>
                </div>
              </div>

              {/* Bible & Discipleship Card */}
              <div
                onClick={() => navigate('/curriculum/bible')}
                className="bg-gradient-to-br from-purple-700 to-indigo-700 text-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-purple-600/50 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] group"
              >
                <div>
                  <div className="p-2.5 bg-white/10 rounded-xl w-fit mb-3 text-purple-100">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Bible & Discipleship</h4>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-purple-100 font-mono">
                    <div><span className="font-bold text-white text-sm">95%</span> Active</div>
                    <div><span className="font-bold text-white text-sm">8</span> Goals</div>
                  </div>
                </div>
              </div>

              {/* Math & Science Card */}
              <div
                onClick={() => navigate('/curriculum/math-science')}
                className="bg-gradient-to-br from-slate-800 to-blue-950 text-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-700 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] group"
              >
                <div>
                  <div className="p-2.5 bg-white/10 rounded-xl w-fit mb-3 text-blue-300">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Math & Science</h4>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-blue-100 font-mono">
                    <div><span className="font-bold text-white text-sm">18</span> Supported</div>
                    <div><span className="font-bold text-white text-sm">5</span> Tutors</div>
                  </div>
                </div>
              </div>

              {/* Social Skills Card */}
              <div
                onClick={() => navigate('/progress')}
                className="bg-white text-slate-800 rounded-2xl p-4 border border-slate-200/80 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="p-2 bg-purple-50 rounded-xl w-fit text-purple-600 mb-2.5">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Social Skills</h4>
                  <span className="text-[11px] font-semibold text-purple-600 flex items-center gap-1 mt-1.5">
                    View Activities <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Music & Arts Card */}
              <div
                onClick={() => navigate('/curriculum/music-arts')}
                className="bg-white text-slate-800 rounded-2xl p-4 border border-slate-200/80 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="p-2 bg-purple-50 rounded-xl w-fit text-purple-600 mb-2.5">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Music & Arts</h4>
                  <span className="text-[11px] font-semibold text-purple-600 flex items-center gap-1 mt-1.5">
                    View Activities <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Mentorship Program Card */}
              <div
                onClick={() => navigate('/mentorship')}
                className="bg-white text-slate-800 rounded-2xl p-4 border border-slate-200/80 hover:border-purple-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="p-2 bg-purple-50 rounded-xl w-fit text-purple-600 mb-2.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Mentorship Program</h4>
                  <span className="text-[11px] font-semibold text-purple-600 flex items-center gap-1 mt-1.5">
                    View Reports <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-[#0C3440] text-white rounded-2xl p-5 shadow-sm border border-[#134E5E]/80 space-y-3.5">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-[#C2B59B]" />
              <h3 className="text-sm font-bold tracking-tight text-white">Quick Actions</h3>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => openScheduleModal('')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#134E5E] hover:bg-[#0E3D4A] border border-[#C2B59B]/40 transition-colors text-left group cursor-pointer shadow-sm"
              >
                <div className="p-1.5 rounded-lg bg-white/20 text-white shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">Schedule 1-on-1</h4>
                  <p className="text-[10px] text-[#C2B59B] truncate font-medium">Date, time & location</p>
                </div>
              </button>

              <button
                onClick={openAddChildModal}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-left group cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-white/10 text-white group-hover:bg-white/20 transition-colors shrink-0">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">Add Child</h4>
                  <p className="text-[10px] text-slate-300 truncate">Enroll a new student</p>
                </div>
              </button>

              <button
                onClick={openRecordObsModal}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-left group cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-white/10 text-white group-hover:bg-white/20 transition-colors shrink-0">
                  <FileEdit className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">Record Observation</h4>
                  <p className="text-[10px] text-slate-300 truncate">Log a behavior or note</p>
                </div>
              </button>

              <button
                onClick={openAddGoalModal}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-left group cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-white/10 text-white group-hover:bg-white/20 transition-colors shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">Add Goal</h4>
                  <p className="text-[10px] text-slate-300 truncate">Set a new target</p>
                </div>
              </button>

              <button
                onClick={openRecordMilestoneModal}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-left group cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-white/10 text-white group-hover:bg-white/20 transition-colors shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">Record Milestone</h4>
                  <p className="text-[10px] text-slate-300 truncate">Celebrate achievement</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/activities')}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-left group cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-white/10 text-white group-hover:bg-white/20 transition-colors shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">Plan Activity</h4>
                  <p className="text-[10px] text-slate-300 truncate">Schedule a group task</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => navigate('/reports')}
              className="w-full mt-3 py-2 text-xs font-bold uppercase font-mono tracking-wider text-[#C2B59B] hover:text-white border border-[#C2B59B]/40 hover:border-[#C2B59B] rounded-xl transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5" /> VIEW FULL REPORTS
            </button>
          </div>

          {/* Recent Progress Timeline Widget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-800">Recent Progress</h3>
            </div>

            <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200/80">
              {recentProgress.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Circle dot on line */}
                  <span className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-white" />
                  
                  <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/60 hover:bg-white hover:border-purple-200 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        {item.timeAgo}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 leading-snug">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-2">
                      <Avatar
                        src={item.image}
                        name={item.childName}
                        size="xs"
                      />
                      <span className="text-[11px] font-medium text-slate-600">
                        {item.childName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Encouraging Footer Tagline Banner */}
      <div className="pt-6 text-center border-t border-slate-200/70 space-y-1.5">
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
        </div>
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
          MONITORING GROWTH • CELEBRATING PROGRESS • SHAPING A BRIGHTER FUTURE
        </p>
      </div>
    </div>
  );
}
