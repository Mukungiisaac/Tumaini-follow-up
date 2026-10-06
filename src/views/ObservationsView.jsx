import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Eye, Plus, Search, Filter, Sparkles, AlertCircle, Target, Edit3, Trash2 } from 'lucide-react';
import ChildImage from '../components/common/ChildImage';

export default function ObservationsView() {
  const { childrenList, openRecordObsModal, openEditObsModal, handleDeleteObservation } = useOutletContext();
  const navigate = useNavigate();

  const [selectedArea, setSelectedArea] = useState('All');
  const [filterText, setFilterText] = useState('');

  // Flatten all observations across children
  const allObservations = childrenList.flatMap((child) =>
    (child.observations || []).map((obs) => ({
      ...obs,
      childName: child.name,
      childGrade: child.grade,
      childCottage: child.cottage,
      childImage: child.image,
      childId: child.id
    }))
  );

  const filteredObservations = allObservations.filter((obs) => {
    const matchesArea = selectedArea === 'All' || obs.area.toLowerCase().includes(selectedArea.toLowerCase());
    const matchesQuery =
      obs.childName.toLowerCase().includes(filterText.toLowerCase()) ||
      obs.text.toLowerCase().includes(filterText.toLowerCase()) ||
      (obs.strength && obs.strength.toLowerCase().includes(filterText.toLowerCase()));
    return matchesArea && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0C3440] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#0C3440]/60">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#D99B3C] text-xs font-mono uppercase font-bold tracking-widest">
            <Eye className="w-4 h-4" /> MENTOR OBSERVATIONS LOG
          </div>
          <h2 className="text-2xl lg:text-3xl font-black tracking-tight">
            Child Development Log
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Record behavioral observations, strengths, challenges, and recommended next steps for holistic care.
          </p>
        </div>

        <button
          onClick={openRecordObsModal}
          className="px-5 py-3 bg-[#0C3440] hover:bg-[#164957] text-white rounded-2xl font-bold text-xs shadow-lg shadow-[#0C3440]/50 border border-[#D99B3C]/40 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Record Observation
        </button>
      </div>

      {/* Search & Area Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student or observation text..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['All', 'Computer', 'Bible', 'Math', 'Social', 'Mentorship'].map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                selectedArea === area
                  ? 'bg-[#0C3440] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Observations List */}
      <div className="space-y-4">
        {filteredObservations.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-3">
            <Eye className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Observations Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or record a new mentor observation note.
            </p>
          </div>
        ) : (
          filteredObservations.map((obs) => (
            <div
              key={obs.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-[#0C3440]/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div
                  onClick={() => navigate(`/children/${obs.childId}`)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <ChildImage
                    src={obs.childImage}
                    alt={obs.childName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0C3440] transition-colors">
                      {obs.childName}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-400">
                      {obs.childGrade} | {obs.childCottage}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#E8F0F0] text-[#0C3440] border border-[#B8CED0] text-xs font-bold rounded-full font-mono">
                    {obs.area}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {obs.date}
                  </span>

                  {/* Edit & Delete quick action buttons */}
                  <div className="flex items-center gap-1 ml-1">
                    <button
                      onClick={() => openEditObsModal && openEditObsModal(obs)}
                      className="p-1.5 text-slate-400 hover:text-[#0C3440] hover:bg-[#E8F0F0] rounded-lg transition-colors cursor-pointer"
                      title="Edit Observation"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this observation permanently?')) {
                          handleDeleteObservation && handleDeleteObservation(obs.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Observation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100">
                "{obs.text}"
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-2 text-xs">
                <div className="bg-emerald-50/60 p-2.5 sm:p-3 rounded-xl border border-emerald-100">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-800 font-mono mb-0.5">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> STRENGTH NOTICED
                  </span>
                  <p className="font-bold text-xs sm:text-sm text-emerald-900">{obs.strength}</p>
                </div>

                <div className="bg-rose-50/60 p-2.5 sm:p-3 rounded-xl border border-rose-100">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-rose-800 font-mono mb-0.5">
                    <AlertCircle className="w-3 h-3 text-rose-600" /> CHALLENGE / FRICTION
                  </span>
                  <p className="font-bold text-xs sm:text-sm text-rose-900">{obs.challenge}</p>
                </div>

                <div className="bg-[#E8F0F0] p-2.5 sm:p-3 rounded-xl border border-[#B8CED0]">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-[#0C3440] font-mono mb-0.5">
                    <Target className="w-3 h-3 text-[#0C3440]" /> RECOMMENDED NEXT STEP
                  </span>
                  <p className="font-bold text-xs sm:text-sm text-[#0C3440]">{obs.nextStep}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

