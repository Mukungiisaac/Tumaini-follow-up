import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Compass,
  Clock,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  UserCheck,
  CheckCircle2,
  BookOpen,
  Laptop,
  Calculator,
  Palette,
  Edit3,
  Trash2
} from 'lucide-react';
import PlanActivityModal from '../components/common/PlanActivityModal';
import EditActivityModal from '../components/common/EditActivityModal';
import ManageAttendanceModal from '../components/common/ManageAttendanceModal';

const DEFAULT_CATEGORIES = [
  'Computer',
  'Bible & Discipleship',
  'Math & Science',
  'Arts & Creative',
  'Mentorship'
];

export default function ActivitiesView() {
  const {
    childrenList = [],
    activities = [],
    handleAddActivity,
    handleUpdateActivity,
    handleDeleteActivity,
    handleUpdateAttendance
  } = useOutletContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categoryOptions = [...new Set([
    ...DEFAULT_CATEGORIES,
    ...activities.map((activity) => activity.category).filter(Boolean)
  ])];

  // Modal states
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const openAttendanceModal = (act) => {
    setSelectedActivity(act);
    setIsAttendanceModalOpen(true);
  };

  const openEditModal = (act) => {
    setEditingActivity(act);
    setIsEditModalOpen(true);
  };

  const getCategoryIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('computer')) return Laptop;
    if (cat.includes('bible')) return BookOpen;
    if (cat.includes('math') || cat.includes('science')) return Calculator;
    if (cat.includes('arts')) return Palette;
    return Compass;
  };

  const filteredActivities = activities.filter((act) => {
    const matchesCategory =
      selectedCategory === 'All' || act.category === selectedCategory;
    const matchesQuery =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.mentor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });
  const activeActivity = activities.find((activity) => activity.id === selectedActivity?.id) || selectedActivity;

  return (
    <div className="mx-auto max-w-7xl space-y-5 animate-in fade-in duration-300">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-primary">
            <Compass className="h-3.5 w-3.5" /> Group activities
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Activities & workshops
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-500">
            Schedule sessions, coordinate attendance, and keep each event on track.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="text-left sm:text-right">
            <span className="text-xl font-semibold tabular-nums text-slate-900">{activities.length}</span>
            <p className="text-xs text-slate-500">Scheduled {activities.length === 1 ? 'event' : 'events'}</p>
          </div>

          <button
            onClick={() => setIsPlanModalOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" /> Plan activity
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by event title, location or mentor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search activities"
            className="h-10 w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
          />
        </div>

        <div className="no-scrollbar flex w-full items-center gap-1.5 overflow-x-auto sm:w-auto">
          <Filter className="mr-1 h-4 w-4 shrink-0 text-slate-400" />
          {['All', ...categoryOptions].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-primary text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.length === 0 ? (
          <div className="col-span-full rounded-lg border border-slate-200 bg-white px-6 py-12 text-center space-y-3">
            <Compass className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Activities Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search filters or click "Plan New Activity" to schedule a new workshop.
            </p>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const IconComp = getCategoryIcon(act.category);
            const attendanceCount = act.attendees ? act.attendees.length : 0;

            return (
              <div
                key={act.id}
                className="flex flex-col justify-between space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="space-y-3.5">
                  {/* Category Pill, Status Badge & Action Controls */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-brand-primary">
                      <IconComp className="w-3.5 h-3.5 text-[#0C3440]" />
                      {act.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                        act.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : act.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {act.status || 'Upcoming'}
                      </span>

                      {/* Edit & Delete Quick Action Icon Buttons */}
                      <button
                        onClick={() => openEditModal(act)}
                        className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-primary"
                        title="Edit Activity"
                        aria-label={`Edit ${act.title}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(act.id)}
                        className="rounded p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        title="Delete Activity"
                        aria-label={`Delete ${act.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-semibold leading-snug text-slate-900">
                    {act.title}
                  </h4>

                  {/* Description */}
                  {act.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {act.description}
                    </p>
                  )}

                  {/* Event Details Info Grid */}
                  <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 shrink-0 text-brand-primary" />
                      <span className="font-medium text-slate-800">{act.displayDate}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 shrink-0 text-brand-accent" />
                      <span>{act.location}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Users className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>{act.cottages}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <UserCheck className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="text-slate-500">Mentor: <strong className="text-slate-800 font-bold">{act.mentor}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Attendance Footer Bar */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500 text-[11px]">Check-In Progress</span>
                    <span className="font-semibold tabular-nums text-brand-primary">{attendanceCount} attended</span>
                  </div>

                  <button
                    onClick={() => openAttendanceModal(act)}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-teal-800"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Manage Attendance
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Plan New Activity Modal */}
      <PlanActivityModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onAddActivity={handleAddActivity}
        categoryOptions={categoryOptions}
      />

      {/* Edit Activity Modal */}
      <EditActivityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        activity={editingActivity}
        onUpdateActivity={handleUpdateActivity}
        categoryOptions={categoryOptions}
      />

      {/* Manage Attendance Modal */}
      <ManageAttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        activity={activeActivity}
        childrenList={childrenList}
        onUpdateAttendance={handleUpdateAttendance}
      />
    </div>
  );
}

