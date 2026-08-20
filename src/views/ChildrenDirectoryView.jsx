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
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Edit3
} from 'lucide-react';

export default function ChildrenDirectoryView() {
  const { childrenList, searchQuery, openAddChildModal, openEditChildModal, openRecordObsModal } = useOutletContext();
  const navigate = useNavigate();

  const [selectedCottage, setSelectedCottage] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'list'

  // Filter logic
  const filteredChildren = childrenList.filter((child) => {
    const matchesSearch =
      !searchQuery ||
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.cottage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.keyStrength.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCottage = selectedCottage === 'All' || child.cottage === selectedCottage;
    const matchesGrade =
      selectedGrade === 'All' ||
      child.grade === selectedGrade ||
      child.grade.includes(selectedGrade.split(' ')[0] + ' ' + (selectedGrade.split(' ')[1] || ''));
    const matchesStatus = selectedStatus === 'All' || child.status === selectedStatus;

    return matchesSearch && matchesCottage && matchesGrade && matchesStatus;
  });

  const getStatusBadge = (status) => {
    if (status === 'ON TRACK') {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dot: 'bg-emerald-500',
        icon: CheckCircle
      };
    }
    if (status === 'PROGRESSING') {
      return {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        dot: 'bg-indigo-500',
        icon: TrendingUp
      };
    }
    return {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500',
      icon: AlertTriangle
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative pb-16 max-w-7xl mx-auto">
      {/* Header Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {/* Search Bar */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
              FIND A CHILD
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, cottage, or key strength..."
                value={searchQuery}
                readOnly
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Cottage Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
              COTTAGE
            </label>
            <select
              value={selectedCottage}
              onChange={(e) => setSelectedCottage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Cottages</option>
              <option value="Cottage 'B'">Cottage 'B'</option>
              <option value="Hope House">Hope House</option>
              <option value="Joy Villa">Joy Villa</option>
              <option value="Peace Cabin">Peace Cabin</option>
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
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Grades</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Form 1 (High School)">Form 1 (High School)</option>
              <option value="Form 2 (High School)">Form 2 (High School)</option>
              <option value="Form 3 (High School)">Form 3 (High School)</option>
              <option value="Form 4 (High School)">Form 4 (High School)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Controls Bar */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-slate-500 font-medium font-mono">
          Showing <span className="font-bold text-slate-800">{filteredChildren.length}</span> children
        </p>

        <div className="flex items-center gap-2">
          {/* Status Quick Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs"
          >
            <option value="All">All Statuses</option>
            <option value="ON TRACK">ON TRACK</option>
            <option value="PROGRESSING">PROGRESSING</option>
            <option value="NEEDS SUPPORT">NEEDS SUPPORT</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                layoutMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
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
          <p className="text-xs text-slate-500">Try adjusting your cottage or grade level filter selection.</p>
        </div>
      ) : layoutMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredChildren.map((child) => {
            const badge = getStatusBadge(child.status);
            return (
              <div
                key={child.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Row: Photo & Status Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <Avatar
                      src={child.image}
                      name={child.name}
                      size="lg"
                      className="ring-2 ring-slate-100 shadow-xs"
                    />
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${badge.bg}`}>
                      {child.status}
                    </span>
                  </div>

                  {/* Name & Details */}
                  <div className="space-y-0.5 mb-3">
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">
                      {child.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      {child.age} yrs • {child.grade} • {child.cottage}
                    </p>
                  </div>

                  {/* Key Strength Tag */}
                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
                        KEY STRENGTH
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold border border-purple-100/60">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span className="truncate">{child.keyStrength}</span>
                      </span>
                    </div>

                    {/* Current Focus Tag */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
                        CURRENT FOCUS
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100/60">
                        <Target className="w-3 h-3 shrink-0" />
                        <span className="truncate">{child.currentFocus}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/children/${child.id}`)}
                    className="flex-1 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-purple-600 hover:text-white rounded-lg transition-colors text-center"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => openEditChildModal(child)}
                    title="Edit Child Profile"
                    className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg border border-slate-200 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={openRecordObsModal}
                    title="Log Observation"
                    className="p-1.5 bg-[#0b172a] text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <FileEdit className="w-4 h-4" />
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
              <div key={child.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={child.image}
                    name={child.name}
                    size="md"
                    className="ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-800">{child.name}</h4>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${badge.bg}`}>
                        {child.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {child.age} yrs • {child.grade} • {child.cottage} • Mentor: {child.mentor}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-mono block">STRENGTH</span>
                    <span className="font-semibold text-purple-700">{child.keyStrength}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-mono block">FOCUS</span>
                    <span className="font-semibold text-indigo-700">{child.currentFocus}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditChildModal(child)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => navigate(`/children/${child.id}`)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
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
        <button className="w-7 h-7 rounded-lg bg-[#0b172a] text-white text-xs font-bold font-mono">
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
        className="fixed bottom-6 right-8 z-30 p-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-2xl shadow-purple-900/40 flex items-center gap-2 text-xs font-bold font-mono tracking-wider transition-transform hover:scale-105"
      >
        <UserPlus className="w-4 h-4" />
        <span className="hidden sm:inline">ADD CHILD</span>
      </button>
    </div>
  );
}
