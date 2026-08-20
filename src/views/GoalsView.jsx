import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import { Target, Plus, CheckCircle2, Clock, Edit3 } from 'lucide-react';

export default function GoalsView() {
  const { childrenList, openAddGoalModal, openEditGoalModal } = useOutletContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'In Progress' | 'Completed' | 'Not Started'

  // Flatten all goals across children
  const allGoals = childrenList.flatMap((child) =>
    (child.goals || []).map((goal) => ({
      ...goal,
      childName: child.name,
      childGrade: child.grade,
      childImage: child.image,
      childId: child.id
    }))
  );

  const filteredGoals = allGoals.filter((g) => {
    if (activeTab === 'All') return true;
    return g.status === activeTab;
  });

  const getStatusBadge = (status) => {
    if (status === 'Completed') return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    if (status === 'In Progress') return 'bg-purple-50 text-purple-700 border-purple-200/80';
    return 'bg-slate-100 text-slate-600 border-slate-200/80';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Goals & Next Steps</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Track individual learning targets, action plans, and milestones.
          </p>
        </div>

        <button
          onClick={openAddGoalModal}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Set New Goal
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 w-fit border border-slate-200/60">
        {['All', 'In Progress', 'Completed', 'Not Started'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              activeTab === tab
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-10 text-center border border-slate-200/80 text-slate-500 text-xs shadow-xs">
            No goals found for this filter tab.
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3.5 flex flex-col justify-between hover:shadow-md hover:border-purple-200 transition-all group"
            >
              <div>
                {/* Header info row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-md border border-purple-100/60">
                      {goal.area}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md border ${getStatusBadge(goal.status)}`}>
                      {goal.status}
                    </span>
                  </div>

                  <button
                    onClick={() => openEditGoalModal && openEditGoalModal(goal)}
                    className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold"
                    title="Edit Goal & Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </div>

                {/* Child info row */}
                <div
                  onClick={() => navigate(`/children/${goal.childId}`)}
                  className="flex items-center gap-2.5 mb-2.5 cursor-pointer group/child"
                >
                  <Avatar
                    src={goal.childImage}
                    name={goal.childName}
                    size="sm"
                    className="ring-1 ring-slate-200 group-hover/child:ring-purple-400"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 group-hover/child:text-purple-600 leading-tight truncate">
                      {goal.childName}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-medium">{goal.childGrade}</span>
                  </div>
                </div>

                {/* Goal title */}
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {goal.title}
                </h4>

                {/* Target Date */}
                <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Target: {goal.targetDate || 'Ongoing'}</span>
                </div>

                {/* Mentor note */}
                {goal.note && (
                  <p className="text-xs text-slate-600 mt-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed italic">
                    "{goal.note}"
                  </p>
                )}
              </div>

              {/* Bottom Progress Bar */}
              <div className="pt-2 space-y-1.5 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400 font-mono text-[9px]">PROGRESS</span>
                  <span className="text-purple-600 font-mono text-xs">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
