import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import {
  Search,
  Grid,
  List,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  FileEdit,
  Sparkles,
  Edit3
} from 'lucide-react';
import { GRADE_LEVELS, HOUSE_IDS } from '../data/mockData';

export default function ChildrenDirectoryView() {
  const { childrenList, searchQuery, openAddChildModal, openEditChildModal, openRecordObsModal } = useOutletContext();
  const navigate = useNavigate();

  const [selectedHouse, setSelectedHouse] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'list'

  // Filter logic
  const filteredChildren = childrenList.filter((child) => {
    const matchesSearch =
      !searchQuery ||
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (child.houseId ? `house ${child.houseId}` : 'unassigned').includes(searchQuery.toLowerCase()) ||
      (child.keyStrength || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHouse = selectedHouse === 'All' || (selectedHouse === 'Unassigned' ? !child.houseId : child.houseId === selectedHouse);
    const matchesGrade =
      selectedGrade === 'All' || child.grade === selectedGrade;
    const matchesStatus = selectedStatus === 'All' || child.status === selectedStatus;

    return matchesSearch && matchesHouse && matchesGrade && matchesStatus;
  });

  const getStatusBadge = (status) => {
    if (status === 'ON TRACK') {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dot: 'bg-emerald-500'
      };
    }
    if (status === 'PROGRESSING') {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500'
      };
    }
    return {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500'
    };
  };

  return (
    <div className="relative mx-auto max-w-7xl space-y-5 pb-24 sm:space-y-6 sm:pb-16">
      {/* Header Filter Bar */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Bar */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
              FIND A CHILD
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, house, or key strength..."
                value={searchQuery}
                readOnly
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
            </div>
          </div>

          {/* House Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
              HOUSE
            </label>
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            >
              <option value="All">All Houses</option>
              <option value="Unassigned">Unassigned</option>
              {HOUSE_IDS.map((id) => <option key={id} value={id}>House {id}</option>)}
            </select>
          </div>

          {/* Grade Level Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
              GRADE LEVEL
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
            >
              <option value="All">All Grades</option>
              {GRADE_LEVELS.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Directory Controls Bar */}
      <div className="flex flex-col gap-3 px-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{filteredChildren.length}</span> children
        </p>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          {/* Status Quick Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0C3440] sm:flex-none"
          >
            <option value="All">All Statuses</option>
            <option value="ON TRACK">ON TRACK</option>
            <option value="PROGRESSING">PROGRESSING</option>
            <option value="NEEDS SUPPORT">NEEDS SUPPORT</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setLayoutMode('grid')}
              title="Grid view"
              aria-label="Grid view"
              className={`p-2 rounded-md transition-all ${
                layoutMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              title="List view"
              aria-label="List view"
              className={`p-2 rounded-md transition-all ${
                layoutMode === 'list' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Layout */}
      {filteredChildren.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 space-y-2 shadow-xs">
          <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No children match your filter</h3>
          <p className="text-xs text-slate-500">Try adjusting your house or grade level filter selection.</p>
        </div>
      ) : layoutMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredChildren.map((child) => {
            const badge = getStatusBadge(child.status);
            return (
              <div
                key={child.id}
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition-shadow hover:border-[#0C3440]/30 hover:shadow-md sm:p-5"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Avatar
                      src={child.image}
                      name={child.name}
                      size="lg"
                      className="ring-1 ring-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug break-words">
                          {child.name}
                        </h3>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold rounded-full border whitespace-nowrap ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {child.status}
                        </span>
                      </div>
                      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500">
                        {child.age} years old
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4 py-2.5 sm:py-3 border-y border-slate-100">
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Grade</span>
                      <span className="mt-0.5 block text-xs sm:text-sm font-medium text-slate-800">{child.grade}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">House</span>
                      <span className="mt-0.5 block text-xs sm:text-sm font-medium text-slate-800">{child.houseId ? `House ${child.houseId}` : 'Unassigned'}</span>
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-2 sm:gap-3 mt-3">
                    <div className="bg-slate-50/80 rounded-lg p-2 sm:p-2.5 border border-slate-100">
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Key strength</dt>
                      <dd className="mt-0.5 text-xs font-semibold text-[#0C3440] break-words">{child.keyStrength || 'Not recorded'}</dd>
                    </div>
                    <div className="bg-slate-50/80 rounded-lg p-2 sm:p-2.5 border border-slate-100">
                      <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date joined</dt>
                      <dd className="mt-0.5 text-xs font-medium text-slate-700 break-words">{child.joinedDate || 'Not recorded'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex items-center gap-2 mt-3 sm:mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/children/${child.id}`)}
                    className="flex-1 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-[#0C3440] hover:bg-[#164957] rounded-lg transition-colors text-center"
                  >
                    Open profile
                  </button>
                  <button
                    onClick={() => openEditChildModal(child)}
                    title="Edit Child Profile"
                    className="p-1.5 sm:p-2 text-slate-600 hover:text-[#0C3440] hover:bg-[#E8F0F0] rounded-lg border border-slate-200 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={openRecordObsModal}
                    title="Log Observation"
                    className="p-1.5 sm:p-2 text-[#0C3440] hover:bg-[#E8F0F0] rounded-lg border border-slate-200 transition-colors"
                  >
                    <FileEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode View */
        <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {filteredChildren.map((child) => {
            const badge = getStatusBadge(child.status);
            return (
              <div key={child.id} className="flex items-start justify-between gap-3 p-3.5 transition-colors hover:bg-slate-50/80 sm:items-center sm:gap-4 sm:p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar
                    src={child.image}
                    name={child.name}
                    size="md"
                    className="ring-2 ring-slate-100"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h4 className="truncate text-xs font-bold text-slate-800">{child.name}</h4>
                      <span className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[9px] font-bold ${badge.bg}`}>
                        {child.status}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500 sm:line-clamp-none">
                      {child.age} years old | {child.grade} | {child.houseId ? `House ${child.houseId}` : 'Unassigned'} | Mentor: {child.mentor}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-mono block">STRENGTH</span>
                    <span className="font-semibold text-[#0C3440]">{child.keyStrength}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-mono block">ADMISSION</span>
                    <span className="font-semibold text-slate-700">{child.studentInformation?.admissionNumber || 'Not recorded'}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => openEditChildModal(child)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-[#E8F0F0] hover:text-[#0C3440] rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => navigate(`/children/${child.id}`)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0C3440] hover:bg-[#164957] rounded-lg transition-colors"
                  >
                    Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="w-7 h-7 rounded-lg bg-[#0C3440] text-white text-xs font-bold font-mono">
          1
        </button>
        <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-bold font-mono">
          2
        </button>
        <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-bold font-mono">
          3
        </button>
        <span className="text-slate-400 text-xs font-mono">...</span>
        <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-bold font-mono">
          12
        </button>
        <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Add Child Action Button */}
      <button
        onClick={openAddChildModal}
        title="Add New Child"
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 right-4 z-30 flex items-center justify-center gap-2 rounded-xl bg-[#0C3440] px-4 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#0C3440]/25 transition-colors hover:bg-[#164957] sm:bottom-6 sm:left-auto sm:right-8 sm:w-auto sm:rounded-full sm:px-5 sm:py-3.5 sm:text-xs sm:font-bold sm:font-mono sm:tracking-wider"
      >
        <UserPlus className="w-4 h-4" />
        <span className="sm:hidden">Add child</span>
        <span className="hidden sm:inline">ADD CHILD</span>
      </button>
    </div>
  );
}
