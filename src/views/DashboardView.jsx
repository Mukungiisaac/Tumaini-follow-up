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
  TrendingUp,
  Palette,
  Heart,
  ChevronRight,
  Zap,
  BarChart3
} from 'lucide-react';

export default function DashboardView() {
  const {
    childrenList,
    scheduledSessions = [],
    isDataLoading = false,
    openAddChildModal,
    openRecordObsModal,
    openAddGoalModal,
    openRecordMilestoneModal,
    openScheduleModal
  } = useOutletContext();

  const navigate = useNavigate();
  const childrenNeedingSupport = childrenList.filter((child) => child.status === 'NEEDS SUPPORT');
  const activeMentorships = childrenList.filter((child) => Boolean(child.mentor)).length;
  const computerLearners = childrenList.filter((child) =>
    (child.skillsMap || []).some((skill) => skill.category?.toLowerCase().includes('computer'))
  ).length;
  const bibleProgressPct = childrenList.length
    ? Math.round(childrenList.reduce((total, child) => total + (child.overviewMetrics?.bible || 0), 0) / childrenList.length)
    : 0;
  const openGoalCount = childrenList.reduce((total, child) => total + (child.goals || []).filter((goal) =>
    !['complete', 'completed', 'cancelled'].includes((goal.status || '').toLowerCase())
  ).length, 0);
  const mathScienceGoalCount = childrenList.reduce((total, child) => total + (child.goals || []).filter((goal) =>
    /math|science/i.test(goal.area || '') && !['complete', 'completed', 'cancelled'].includes((goal.status || '').toLowerCase())
  ).length, 0);
  const computerMilestoneCount = childrenList.reduce((total, child) => total + (child.milestones || []).filter((milestone) =>
    /computer|digital|typing|web|coding|tech/i.test(`${milestone.title} ${milestone.description}`)
  ).length, 0);
  const socialObservationCount = childrenList.reduce((total, child) => total + (child.observations || []).filter((observation) =>
    /social|character|relationship/i.test(observation.area || '')
  ).length, 0);
  const artsAndMusicLearners = childrenList.filter((child) =>
    (child.skillsMap || []).some((skill) => /music|art/i.test(skill.category || ''))
  ).length;
  const scheduledSessionCount = scheduledSessions.filter((session) => session.status === 'Scheduled').length;
  const recentProgress = childrenList.flatMap((child) => [
    ...(child.observations || []).map((record) => ({
      id: `${child.id}-observation-${record.id}`,
      childName: child.name,
      image: child.image,
      category: record.area || 'Observation',
      date: record.date,
      title: record.text || 'Observation recorded'
    })),
    ...(child.milestones || []).map((record) => ({
      id: `${child.id}-milestone-${record.id}`,
      childName: child.name,
      image: child.image,
      category: 'Milestone',
      date: record.date,
      title: record.title
    })),
    ...(child.academicRecords || []).map((record) => ({
      id: `${child.id}-academic-${record.id}`,
      childName: child.name,
      image: child.image,
      category: 'Academic',
      date: record.date,
      title: `${record.subject}${record.result ? `: ${record.result}` : ' record added'}`
    }))
  ]).sort((first, second) => (Date.parse(second.date || '') || 0) - (Date.parse(first.date || '') || 0)).slice(0, 4);

  const focusAreas = [
    { title: 'Computer Skills', icon: Laptop, path: '/curriculum/computer', value: `${computerLearners} learners`, detail: `${computerMilestoneCount} achievements`, tone: 'bg-[#E8F0F0] text-[#0C3440]' },
    { title: 'Bible & Discipleship', icon: BookOpen, path: '/curriculum/bible', value: `${bibleProgressPct}% average`, detail: `${childrenList.reduce((total, child) => total + (child.goals || []).filter((goal) => /bible|discipleship/i.test(goal.area || '')).length, 0)} goals`, tone: 'bg-emerald-50 text-emerald-700' },
    { title: 'Math & Science', icon: Calculator, path: '/curriculum/math-science', value: `${childrenNeedingSupport.length} need support`, detail: `${mathScienceGoalCount} open goals`, tone: 'bg-amber-50 text-amber-800' },
    { title: 'Social Skills', icon: Heart, path: '/progress', value: `${socialObservationCount} observations`, detail: 'Social development', tone: 'bg-rose-50 text-rose-700' },
    { title: 'Music & Arts', icon: Palette, path: '/curriculum/music-arts', value: `${artsAndMusicLearners} learners`, detail: 'With recorded skills', tone: 'bg-sky-50 text-sky-700' },
    { title: 'Mentorship Program', icon: UserCheck, path: '/mentorship', value: `${activeMentorships} children`, detail: `${scheduledSessionCount} sessions scheduled`, tone: 'bg-slate-100 text-slate-700' }
  ];

  // Skeleton shimmer block helper
  const Skeleton = ({ className }) => (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
  );

  if (isDataLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
        {/* Stat card skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-7 w-10" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          ))}
        </div>
        {/* Quick actions skeleton */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <Skeleton className="h-4 w-36 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
        {/* Focus areas + recent activity skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
            <Skeleton className="h-4 w-32 mb-4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Top Overview Cards Row (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <StatCard
          title="TOTAL"
          value={childrenList.length}
          subtitle="Children Enrolled"
          icon={Users}
          color="purple"
          onClick={() => navigate('/children')}
        />
        <StatCard
          title="MENTORED"
          value={activeMentorships}
          subtitle="Active Mentorships"
          icon={UserCheck}
          color="indigo"
          onClick={() => navigate('/mentorship')}
        />
        <StatCard
          title="TECH"
          value={computerLearners}
          subtitle="Computer Learners"
          icon={Laptop}
          color="blue"
          onClick={() => navigate('/curriculum/computer')}
        />
        <StatCard
          title="BIBLE"
          value={`${bibleProgressPct}%`}
          subtitle="Average Progress"
          icon={BookOpen}
          color="emerald"
          onClick={() => navigate('/curriculum/bible')}
        />
        <StatCard
          title="SUPPORT"
          value={childrenNeedingSupport.length}
          subtitle="Children Needing Support"
          icon={Heart}
          color="rose"
          onClick={() => navigate('/children')}
        />
        <StatCard
          title="GOALS"
          value={openGoalCount}
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
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100/60">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Needs Attention</h3>
                  <p className="text-xs text-slate-500">Children requiring follow-up or extra support</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/children')}
                className="text-[11px] font-bold text-brand-primary hover:text-brand-primary tracking-wider uppercase font-mono flex items-center gap-0.5 transition-colors"
              >
                VIEW ALL ({childrenNeedingSupport.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {childrenNeedingSupport.length === 0 ? (
              <p className="rounded-lg bg-emerald-50 px-4 py-5 text-sm text-emerald-800">No children are currently marked as needing support.</p>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {childrenNeedingSupport.slice(0, 3).map((child) => (
                <div
                  key={child.id}
                  className="bg-white rounded-lg p-4 border border-slate-200 flex flex-col justify-between min-h-[205px]"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar
                        src={child.image}
                        name={child.name}
                        size="md"
                        className="ring-1 ring-slate-200"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900">{child.name}</h4>
                        <span className="text-xs text-slate-500">{child.age} years · {child.grade}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {child.goals?.find((goal) => !['complete', 'completed'].includes((goal.status || '').toLowerCase()))?.title
                        || child.observations?.[0]?.text
                        || 'Needs a follow-up check-in.'}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/children/${child.id}`)}
                    className="w-full mt-4 py-2 px-3 text-sm font-semibold text-[#0C3440] bg-[#E8F0F0] hover:bg-[#D4E4E4] rounded-lg transition-colors text-center"
                  >
                    Open child record
                  </button>
                </div>
              ))}
            </div>
            )}
          </div>

          {/* Development Focus Areas */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Development Focus Areas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {focusAreas.map(({ title, icon: Icon, path, value, detail, tone }) => (
                <button
                  key={title}
                  onClick={() => navigate(path)}
                  className="min-h-[148px] text-left bg-white rounded-xl p-5 border border-slate-200 hover:border-[#B8CED0] hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tone}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="mt-5">
                    <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
                    <p className="mt-1 text-xs text-slate-600">{value} <span className="text-slate-300">|</span> {detail}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#8A5F20]" />
              <h3 className="text-base font-semibold text-slate-900">Quick Actions</h3>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => openScheduleModal('')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors text-left group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-[#E8F0F0] text-[#0C3440] shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">Schedule 1-on-1</h4>
                  <p className="text-xs text-slate-500 truncate">Date, time & location</p>
                </div>
              </button>

              <button
                onClick={openAddChildModal}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors text-left group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-[#E8F0F0] text-[#0C3440] transition-colors shrink-0">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">Add Child</h4>
                  <p className="text-xs text-slate-500 truncate">Enroll a new child</p>
                </div>
              </button>

              <button
                onClick={openRecordObsModal}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors text-left group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-amber-50 text-amber-800 transition-colors shrink-0">
                  <FileEdit className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">Record Observation</h4>
                  <p className="text-xs text-slate-500 truncate">Log a behavior or note</p>
                </div>
              </button>

              <button
                onClick={openAddGoalModal}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors text-left group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-amber-50 text-amber-800 transition-colors shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">Add Goal</h4>
                  <p className="text-xs text-slate-500 truncate">Set a new target</p>
                </div>
              </button>

              <button
                onClick={openRecordMilestoneModal}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors text-left group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 transition-colors shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">Record Milestone</h4>
                  <p className="text-xs text-slate-500 truncate">Celebrate achievement</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/activities')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors text-left group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700 transition-colors shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">Plan Activity</h4>
                  <p className="text-xs text-slate-500 truncate">Schedule a group task</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => navigate('/reports')}
              className="w-full mt-2 py-2.5 text-xs font-semibold text-[#0C3440] hover:bg-[#E8F0F0] border border-[#B8CED0] rounded-lg transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5" /> View reports
            </button>
          </div>

          {/* Recent Progress Timeline Widget */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-primary" />
              <h3 className="text-sm font-bold text-slate-800">Recent Progress</h3>
            </div>

            <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200/80">
              {recentProgress.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Circle dot on line */}
                  <span className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-brand-primary ring-2 ring-white" />
                  
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-semibold text-[#0C3440]">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.date ? new Date(`${item.date}T00:00:00`).toLocaleDateString() : 'Date not recorded'}
                      </span>
                    </div>

                    <h4 className="text-sm font-medium text-slate-800 leading-snug line-clamp-2">
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
              {recentProgress.length === 0 && (
                <p className="text-sm text-slate-500 py-4">Academic records, observations, and milestones will appear here as they are added.</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

