import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MOCK_COMPUTER_CURRICULUM } from '../data/mockData';
import { Laptop, CheckCircle2, BookOpen, Award, Zap, Edit2, Plus, Trash2 } from 'lucide-react';
import Modal from '../components/common/Modal';

export default function ComputerCurriculumView() {
  const { completedModules, handleToggleModule } = useOutletContext();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [curriculumData, setCurriculumData] = useState(MOCK_COMPUTER_CURRICULUM);
  const [activeModal, setActiveModal] = useState(null); // 'edit-module' | 'edit-level' | 'delete-confirm'
  const [editingModule, setEditingModule] = useState(null);
  const [editingLevel, setEditingLevel] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'level' | 'module', data: ... }
  const [formData, setFormData] = useState({
    title: '',
    lessonsCount: '',
    project: '',
    objectives: ['', '', '']
  });
  const [levelFormData, setLevelFormData] = useState({
    title: '',
    subtitle: ''
  });

  const levelData = curriculumData.find((l) => l.level === selectedLevel) || curriculumData[0];

  const handleEditModule = (module, level) => {
    setEditingModule(module);
    setEditingLevel(level);
    setFormData({
      title: module.title,
      lessonsCount: module.lessonsCount.toString(),
      project: module.project,
      objectives: [...module.objectives]
    });
    setActiveModal('edit-module');
  };

  const handleUpdateModule = (e) => {
    e.preventDefault();
    
    const updatedData = curriculumData.map(level => {
      if (level.level === editingLevel) {
        return {
          ...level,
          modules: level.modules.map(mod => 
            mod.id === editingModule.id
              ? {
                  ...mod,
                  title: formData.title,
                  lessonsCount: parseInt(formData.lessonsCount),
                  project: formData.project,
                  objectives: formData.objectives.filter(obj => obj.trim() !== '')
                }
              : mod
          )
        };
      }
      return level;
    });

    setCurriculumData(updatedData);
    setActiveModal(null);
    setEditingModule(null);
    setEditingLevel(null);
    setFormData({ title: '', lessonsCount: '', project: '', objectives: ['', '', ''] });
  };

  const updateObjective = (index, value) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const removeObjective = (index) => {
    if (formData.objectives.length > 1) {
      setFormData(prev => ({
        ...prev,
        objectives: prev.objectives.filter((_, i) => i !== index)
      }));
    }
  };

  // Level handlers
  const handleEditLevel = (lvl, e) => {
    e.stopPropagation();
    setEditingLevel(lvl.level);
    setLevelFormData({ title: lvl.title, subtitle: lvl.subtitle || '' });
    setActiveModal('edit-level');
  };

  const handleUpdateLevel = (e) => {
    e.preventDefault();
    if (!levelFormData.title.trim()) return;
    setCurriculumData(curriculumData.map(l =>
      l.level === editingLevel
        ? { ...l, title: levelFormData.title.trim(), subtitle: levelFormData.subtitle.trim() }
        : l
    ));
    setActiveModal(null);
    setEditingLevel(null);
  };

  // Delete handlers
  const confirmDelete = (type, data, e) => {
    e.stopPropagation();
    setDeleteTarget({ type, data });
    setActiveModal('delete-confirm');
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'level') {
      const remaining = curriculumData.filter(l => l.level !== deleteTarget.data.level);
      setCurriculumData(remaining);
      if (selectedLevel === deleteTarget.data.level) {
        setSelectedLevel(remaining[0]?.level || null);
      }
    } else if (deleteTarget.type === 'module') {
      setCurriculumData(curriculumData.map(l =>
        l.level === deleteTarget.data.levelId
          ? { ...l, modules: l.modules.filter(m => m.id !== deleteTarget.data.module.id) }
          : l
      ));
    }
    setActiveModal(null);
    setDeleteTarget(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingModule(null);
    setEditingLevel(null);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="space-y-6">
        {/* Main Header Banner */}
        <div className="bg-gradient-to-br from-brand-primary to-[#0a2d38] text-white p-8 lg:p-10 rounded-xl shadow-lg">
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center gap-2 text-brand-primary-light text-xs font-semibold uppercase tracking-wider">
              <Laptop className="w-4 h-4" />
              <span>Employment-Oriented IT Curriculum</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Computer & Digital Literacy Skills
            </h1>
            <p className="text-sm lg:text-base text-slate-200 leading-relaxed max-w-2xl">
              A comprehensive 4-level technology roadmap that guides learners from fundamental computer basics through professional web development and digital entrepreneurship. Designed to equip children with practical, job-ready skills.
            </p>
          </div>
        </div>

        {/* Stats & Info Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Learners</p>
                <p className="text-3xl font-bold text-brand-primary">42</p>
              </div>
              <div className="p-3 bg-brand-primary-light rounded-lg">
                <Zap className="w-6 h-6 text-brand-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Curriculum Levels</p>
                <p className="text-3xl font-bold text-brand-primary">4</p>
              </div>
              <div className="p-3 bg-brand-primary-light rounded-lg">
                <BookOpen className="w-6 h-6 text-brand-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Selector */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Select Curriculum Level</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {curriculumData.map((lvl) => (
            <div
              key={lvl.level}
              onClick={() => setSelectedLevel(lvl.level)}
              className={`relative group p-4 rounded-lg text-left border-2 transition-all duration-200 cursor-pointer ${
                selectedLevel === lvl.level
                  ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-brand-primary-light hover:shadow-sm'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
                Level {lvl.level}
              </div>
              <h4 className="text-sm font-bold leading-tight pr-14">
                {lvl.title.split(':')[1]?.trim() || lvl.title}
              </h4>

              {/* Edit / Delete icons — visible on hover */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleEditLevel(lvl, e)}
                  className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                    selectedLevel === lvl.level
                      ? 'text-white/70 hover:text-white hover:bg-white/20'
                      : 'text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light'
                  }`}
                  title="Edit level"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => confirmDelete('level', lvl, e)}
                  className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                    selectedLevel === lvl.level
                      ? 'text-white/70 hover:text-rose-200 hover:bg-white/20'
                      : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                  title="Delete level"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modules Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">{levelData.title}</h2>
          <p className="text-sm text-slate-600">{levelData.subtitle}</p>
          <div className="h-1 w-20 bg-brand-primary rounded-full" />
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {levelData.modules.map((mod) => {
            const isDone = !!completedModules[mod.id];
            return (
              <div
                key={mod.id}
                className={`rounded-lg border transition-all duration-300 p-6 flex flex-col space-y-4 ${
                  isDone
                    ? 'bg-gradient-to-br from-emerald-50 to-emerald-25 border-emerald-200 shadow-sm'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-brand-primary-light'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary-light rounded-full">
                      <BookOpen className="w-3.5 h-3.5 text-brand-primary" />
                      <span className="text-xs font-semibold text-brand-primary">{mod.lessonsCount} Lessons</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{mod.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditModule(mod, levelData.level)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light rounded-lg transition-colors cursor-pointer"
                      title="Edit module"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => confirmDelete('module', { module: mod, levelId: levelData.level }, e)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleModule(mod.id)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="hidden sm:inline">{isDone ? 'Done' : 'Mark'}</span>
                    </button>
                  </div>
                </div>

                {/* Practical Project */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-brand-primary" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Practical Project</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{mod.project}</p>
                </div>

                {/* Learning Objectives */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning Objectives</span>
                  <ul className="space-y-2">
                    {mod.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status Indicator */}
                {isDone && (
                  <div className="pt-2 border-t border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Module Completed
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Module Modal */}
      <Modal 
        isOpen={activeModal === 'edit-module'} 
        onClose={closeModal}
        title="Edit Module" 
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleUpdateModule} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Module Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              placeholder="e.g. Computer Hardware & Peripherals"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Number of Lessons *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.lessonsCount}
                onChange={(e) => setFormData({ ...formData, lessonsCount: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                placeholder="e.g. 4"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Practical Project *
            </label>
            <input
              type="text"
              required
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              placeholder="e.g. Connect & Boot PC Lab"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Learning Objectives *
              </label>
              <button
                type="button"
                onClick={addObjective}
                className="text-xs font-semibold text-brand-primary hover:text-[#0a2d38] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Objective
              </button>
            </div>
            <div className="space-y-3">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    placeholder={`Objective ${index + 1}`}
                  />
                  {formData.objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove objective"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveModal(null);
                setEditingModule(null);
                setEditingLevel(null);
              }}
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm"
            >
              Update Module
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Level Modal */}
      <Modal
        isOpen={activeModal === 'edit-level'}
        onClose={closeModal}
        title="Edit Level"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleUpdateLevel} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Level Title *
            </label>
            <input
              type="text"
              required
              value={levelFormData.title}
              onChange={(e) => setLevelFormData({ ...levelFormData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              placeholder="e.g. Level 1: Computer Basics & Digital Foundations"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={levelFormData.subtitle}
              onChange={(e) => setLevelFormData({ ...levelFormData, subtitle: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              placeholder="e.g. Grades 4-6 • Essential Hardware, Typing & Navigation"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm"
            >
              Update Level
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={activeModal === 'delete-confirm'}
        onClose={closeModal}
        title={deleteTarget?.type === 'level' ? 'Delete Level' : 'Delete Module'}
        maxWidth="max-w-sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">
                {deleteTarget?.type === 'level'
                  ? `Delete "${deleteTarget.data.title}"?`
                  : `Delete "${deleteTarget?.data?.module?.title}"?`}
              </p>
              <p className="text-sm text-slate-600">
                {deleteTarget?.type === 'level'
                  ? 'This will permanently delete the level and all its modules. This cannot be undone.'
                  : 'This module and all its content will be permanently removed. This cannot be undone.'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

