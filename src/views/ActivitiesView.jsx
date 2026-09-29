import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  UserCheck,
  CheckCircle2,
  Sparkles,
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

export default function ActivitiesView() {
  const { childrenList = [] } = useOutletContext();

  const [activities, setActivities] = useState([
    {
      id: 'a1',
      title: 'Friday Computer Lab Coding Challenge',
      category: 'Computer',
      date: '2026-10-24',
      time: '15:30',
      displayDate: 'This Friday â€¢ 3:30 PM',
      location: 'IT Lab 1',
      cottages: 'All Cottages',
      mentor: 'David K.',
      status: 'Upcoming',
      attendees: ['c1', 'c2'],
      description: 'Hands-on practice with touch typing speed, Scratch logic blocks, and digital file organization.'
    },
    {
      id: 'a2',
      title: 'Genesis Chapter 1-3 Discussion Circle',
      category: 'Bible & Discipleship',
      date: '2026-10-25',
      time: '10:00',
      displayDate: 'Saturday â€¢ 10:00 AM',
      location: 'Village Chapel Hall',
      cottages: 'Joy Villa & Hope House',
      mentor: 'John D.',
      status: 'Upcoming',
      attendees: ['c1', 'c3', 'c4'],
      description: 'Small group reflection on God as Creator, moral stewardship, and personal identity.'
    },
    {
      id: 'a3',
      title: 'STEM Solar Battery Circuit Workshop',
      category: 'Math & Science',
      date: '2026-10-28',
      time: '16:00',
      displayDate: 'Next Tuesday â€¢ 4:00 PM',
      location: 'Science Workshop Room',
      cottages: "Cottage 'B'",
      mentor: 'Sarah Johnson',
      status: 'Upcoming',
      attendees: ['c2'],
      description: 'Assembling mini solar circuits, measuring voltage output, and exploring renewable energy basics.'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal states
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleAddActivity = (newActivity) => {
    setActivities([newActivity, ...activities]);
  };

  const handleUpdateActivity = (updatedAct) => {
    setActivities(prev =>
      prev.map(act => (act.id === updatedAct.id ? updatedAct : act))
    );
  };

  const handleDeleteActivity = (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity completely?')) {
      setActivities(prev => prev.filter(act => act.id !== activityId));
    }
  };

  const handleUpdateAttendance = (activityId, newAttendees) => {
    setActivities(prev =>
      prev.map(act => (act.id === activityId ? { ...act, attendees: newAttendees } : act))
    );
  };

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
      selectedCategory === 'All' || act.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesQuery =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.mentor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0C3440] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#0C3440]/60">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#D99B3C] text-xs font-mono uppercase font-bold tracking-widest">
            <Compass className="w-4 h-4" /> GROUP ACTIVITIES & COMMUNITY WORKSHOPS
          </div>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
            Group Activities & Workshops
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Schedule and track group events, tech challenges, chapel devotions, and interactive STEM workshops.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center hidden sm:block">
            <span className="text-xl font-black text-white font-mono">{activities.length}</span>
            <p className="text-[10px] text-[#D99B3C] uppercase font-mono tracking-wider">Scheduled Events</p>
          </div>

          <button
            onClick={() => setIsPlanModalOpen(true)}
            className="px-5 py-3 bg-[#0C3440] hover:bg-[#164957] text-white rounded-2xl font-bold text-xs shadow-lg shadow-[#0C3440]/50 border border-[#D99B3C]/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Plan New Activity
          </button>
        </div>
      </div>

      {/* Toolbar: Search & Category Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by event title, location or mentor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['All', 'Computer', 'Bible', 'Math & Science', 'Mentorship'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0C3440] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-3">
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
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-[#0C3440]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  {/* Category Pill, Status Badge & Action Controls */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 text-xs font-bold rounded-full font-mono bg-[#E8F0F0] text-[#0C3440] border border-[#B8CED0] flex items-center gap-1.5">
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
                        className="p-1.5 text-slate-400 hover:text-[#0C3440] rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Activity"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(act.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-bold text-slate-900 leading-snug tracking-tight">
                    {act.title}
                  </h4>

                  {/* Description */}
                  {act.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  )}

                  {/* Event Details Info Grid */}
                  <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#0C3440] shrink-0" />
                      <span className="font-semibold text-slate-800">{act.displayDate}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[#8A5F20] shrink-0" />
                      <span>{act.location}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{act.cottages}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-slate-500">Mentor: <strong className="text-slate-800 font-bold">{act.mentor}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Attendance Footer Bar */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500 text-[11px]">Check-In Progress</span>
                    <span className="font-mono text-[#0C3440] font-bold">{attendanceCount} Attended</span>
                  </div>

                  <button
                    onClick={() => openAttendanceModal(act)}
                    className="w-full py-2.5 bg-[#0C3440] hover:bg-[#164957] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
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
      />

      {/* Edit Activity Modal */}
      <EditActivityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        activity={editingActivity}
        onUpdateActivity={handleUpdateActivity}
      />

      {/* Manage Attendance Modal */}
      <ManageAttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        activity={selectedActivity}
        childrenList={childrenList}
        onUpdateAttendance={handleUpdateAttendance}
      />
    </div>
  );
}

