import React, { useState } from 'react';
import { MOCK_BIBLE_CURRICULUM } from '../data/mockData';
import { BookOpen, CheckCircle2, AlertCircle, Eye, Plus, X } from 'lucide-react';
import Modal from '../components/common/Modal';

export default function BibleDiscipleshipView() {
  const [activeSubTab, setActiveSubTab] = useState('memory');
  const [memorized, setMemorized] = useState({});
  const [passageSubmissions, setPassageSubmissions] = useState({
    c1: 'Submitted',
    c2: 'Missing',
    c3: 'Missing',
    c4: 'Missing',
    c5: 'Submitted',
    c6: 'Missing',
    c7: 'Missing',
    c8: 'Submitted'
  });
  
  const [catechismQuestions, setCatechismQuestions] = useState(MOCK_BIBLE_CURRICULUM.catechismQuestions);
  const [verseCards, setVerseCards] = useState(MOCK_BIBLE_CURRICULUM.memorizationCards);
  const [genesisModules, setGenesisModules] = useState(MOCK_BIBLE_CURRICULUM.genesisModules);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'verse' | 'catechism' | 'genesis'
  const [newQuestion, setNewQuestion] = useState({ question: '', answer: '' });
  const [newVerse, setNewVerse] = useState({ verse: '', text: '', theme: '' });
  const [newGenesis, setNewGenesis] = useState({ title: '', leader: '', attendeesCount: '', status: 'Upcoming' });

  const toggleVerse = (v) => {
    setMemorized(prev => ({ ...prev, [v]: !prev[v] }));
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.question.trim() || !newQuestion.answer.trim()) return;

    const nextQNo = Math.max(...catechismQuestions.map(q => q.qNo)) + 1;
    setCatechismQuestions([
      ...catechismQuestions,
      {
        qNo: nextQNo,
        question: newQuestion.question,
        answer: newQuestion.answer
      }
    ]);

    setNewQuestion({ question: '', answer: '' });
    setActiveModal(null);
  };

  const handleAddVerse = (e) => {
    e.preventDefault();
    if (!newVerse.verse.trim() || !newVerse.text.trim() || !newVerse.theme.trim()) return;

    setVerseCards([
      ...verseCards,
      {
        verse: newVerse.verse,
        text: newVerse.text,
        theme: newVerse.theme
      }
    ]);

    setNewVerse({ verse: '', text: '', theme: '' });
    setActiveModal(null);
  };

  const handleAddGenesis = (e) => {
    e.preventDefault();
    if (!newGenesis.title.trim() || !newGenesis.leader.trim() || !newGenesis.attendeesCount.trim()) return;

    setGenesisModules([
      ...genesisModules,
      {
        title: newGenesis.title,
        leader: newGenesis.leader,
        status: newGenesis.status,
        attendeesCount: parseInt(newGenesis.attendeesCount)
      }
    ]);

    setNewGenesis({ title: '', leader: '', attendeesCount: '', status: 'Upcoming' });
    setActiveModal(null);
  };

  const childNames = [
    { id: 'c1', letter: 'B', name: 'Brian', date: 'Aug 20, 2026' },
    { id: 'c2', letter: 'C', name: 'Caleb', date: 'Aug 20, 2026' },
    { id: 'c3', letter: 'D', name: 'Daniel', date: 'Aug 20, 2026' },
    { id: 'c4', letter: 'D', name: 'David', date: 'Aug 20, 2026' },
    { id: 'c5', letter: 'D', name: 'Deborah', date: 'Aug 20, 2026' },
    { id: 'c6', letter: 'D', name: 'Dennis', date: 'Aug 20, 2026' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="space-y-6">
        {/* Main Header Banner */}
        <div className="bg-gradient-to-br from-brand-primary to-[#0a2d38] text-white p-8 lg:p-10 rounded-xl shadow-lg">
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center gap-2 text-brand-primary-light text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Spiritual Growth & Character Development</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Bible & Discipleship Program
            </h1>
            <p className="text-sm lg:text-base text-slate-200 leading-relaxed max-w-2xl">
              Comprehensive Scripture memorization, Genesis study modules, and Westminster Shorter Catechism training to develop strong biblical foundations and Christian character in learners.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Participation</p>
                <p className="text-3xl font-bold text-brand-primary">95%</p>
              </div>
              <div className="p-3 bg-brand-primary-light rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-brand-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Questions</p>
                <p className="text-3xl font-bold text-brand-primary">{catechismQuestions.length}</p>
              </div>
              <div className="p-3 bg-brand-primary-light rounded-lg">
                <BookOpen className="w-6 h-6 text-brand-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'memory', label: 'Verse Cards' },
          { id: 'catechism', label: 'Catechism Questions' },
          { id: 'genesis', label: 'Genesis Modules' },
          { id: 'passages', label: 'Submissions' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'text-brand-primary border-brand-primary'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Verse Cards */}
      {activeSubTab === 'memory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Scripture Memorization Cards</h2>
              <p className="text-sm text-slate-600">Track learners' progress on memorizing key Scripture passages</p>
              <div className="h-1 w-20 bg-brand-primary rounded-full mt-3" />
            </div>
            <button
              onClick={() => setActiveModal('verse')}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-[#0a2d38] transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Verse
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {verseCards.map((card) => {
              const isDone = !!memorized[card.verse];
              return (
                <div
                  key={card.verse}
                  className={`rounded-lg border p-6 transition-all ${
                    isDone
                      ? 'bg-gradient-to-br from-emerald-50 to-emerald-25 border-emerald-200'
                      : 'bg-white border-slate-200 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary-light rounded-full">
                          <span className="text-xs font-semibold text-brand-primary">{card.theme}</span>
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-3 font-serif">{card.verse}</h3>
                      </div>
                      <button
                        onClick={() => toggleVerse(card.verse)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isDone ? 'Recited' : 'Mark'}
                      </button>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-700 italic bg-slate-50 p-4 rounded-lg border border-slate-200">
                      "{card.text}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Catechism Questions */}
      {activeSubTab === 'catechism' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Westminster Shorter Catechism</h2>
              <p className="text-sm text-slate-600">Biblical questions and answers for spiritual development</p>
              <div className="h-1 w-20 bg-brand-primary rounded-full mt-3" />
            </div>
            <button
              onClick={() => setActiveModal('catechism')}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-[#0a2d38] transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </button>
          </div>

          <div className="space-y-4">
            {catechismQuestions.map((cq) => (
              <div
                key={cq.qNo}
                className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 hover:shadow-md transition-all"
              >
                <div>
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Question #{cq.qNo}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">{cq.question}</h3>
                </div>

                <div className="bg-brand-primary-light rounded-lg p-4 border border-brand-primary-light/50 space-y-1.5">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Answer</span>
                  <p className="text-sm text-slate-800 leading-relaxed">{cq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Genesis Study Modules */}
      {activeSubTab === 'genesis' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Genesis Study Modules</h2>
              <p className="text-sm text-slate-600">Deep dive studies on foundational biblical passages</p>
              <div className="h-1 w-20 bg-brand-primary rounded-full mt-3" />
            </div>
            <button
              onClick={() => setActiveModal('genesis')}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-[#0a2d38] transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Module
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {genesisModules.map((g, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-bold text-slate-900 leading-snug flex-1">{g.title}</h3>
                  <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    g.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {g.status}
                  </span>
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Discussion Leader</p>
                    <p className="text-sm font-semibold text-slate-900">{g.leader}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Participants</p>
                    <p className="text-sm font-semibold text-slate-900">{g.attendeesCount} Children</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Passage Submissions */}
      {activeSubTab === 'passages' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Passage Submission Tracker</h2>
            <p className="text-sm text-slate-600">Monitor Genesis 1:1-27 passage reflection submissions</p>
            <div className="h-1 w-20 bg-brand-primary rounded-full mt-3" />
          </div>

          {/* Submissions Table */}
          <div className="overflow-hidden border border-slate-200 rounded-lg shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {childNames.map((child) => {
                  const status = passageSubmissions[child.id];
                  return (
                    <tr key={child.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs">
                            {child.letter}
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{child.name}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{child.date}</span>
                      </td>

                      <td className="px-6 py-4">
                        {status === 'Submitted' ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Submitted
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold border border-rose-200">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Missing
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => setPassageSubmissions(prev => ({
                            ...prev,
                            [child.id]: status === 'Submitted' ? 'Missing' : 'Submitted'
                          }))}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light transition-colors"
                          title="Toggle status"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Submitted</span>
              </div>
              <p className="text-2xl font-bold text-emerald-700">{Object.values(passageSubmissions).filter(s => s === 'Submitted').length}</p>
            </div>
            <div className="bg-rose-50 rounded-lg p-4 border border-rose-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Missing</span>
              </div>
              <p className="text-2xl font-bold text-rose-700">{Object.values(passageSubmissions).filter(s => s === 'Missing').length}</p>
            </div>
            <div className="bg-slate-100 rounded-lg p-4 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-slate-600" />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Completion</span>
              </div>
              <p className="text-2xl font-bold text-slate-700">{Math.round((Object.values(passageSubmissions).filter(s => s === 'Submitted').length / childNames.length) * 100)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Verse Modal */}
      <Modal isOpen={activeModal === 'verse'} onClose={() => setActiveModal(null)} title="Add Scripture Verse Card" maxWidth="max-w-2xl">
        <form onSubmit={handleAddVerse} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Verse Reference *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Genesis 1:1, Psalm 23:1"
              value={newVerse.verse}
              onChange={(e) => setNewVerse({ ...newVerse, verse: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Scripture Text *
            </label>
            <textarea
              required
              rows="3"
              placeholder="Enter the verse text"
              value={newVerse.text}
              onChange={(e) => setNewVerse({ ...newVerse, text: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Theme *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Trust & Provision, Creation, Guidance"
              value={newVerse.theme}
              onChange={(e) => setNewVerse({ ...newVerse, theme: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newVerse.verse.trim() || !newVerse.text.trim() || !newVerse.theme.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Verse
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Catechism Question Modal */}
      <Modal isOpen={activeModal === 'catechism'} onClose={() => setActiveModal(null)} title="Add Catechism Question" maxWidth="max-w-2xl">
        <form onSubmit={handleAddQuestion} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Question *
            </label>
            <input
              type="text"
              required
              placeholder="Enter the catechism question"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Answer *
            </label>
            <textarea
              required
              rows="4"
              placeholder="Enter the answer to the question"
              value={newQuestion.answer}
              onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newQuestion.question.trim() || !newQuestion.answer.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Question
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Genesis Module Modal */}
      <Modal isOpen={activeModal === 'genesis'} onClose={() => setActiveModal(null)} title="Add Genesis Study Module" maxWidth="max-w-2xl">
        <form onSubmit={handleAddGenesis} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Module Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Part 4: The Call of Jacob"
              value={newGenesis.title}
              onChange={(e) => setNewGenesis({ ...newGenesis, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Discussion Leader *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah Johnson"
              value={newGenesis.leader}
              onChange={(e) => setNewGenesis({ ...newGenesis, leader: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Number of Participants *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 32"
                value={newGenesis.attendeesCount}
                onChange={(e) => setNewGenesis({ ...newGenesis, attendeesCount: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Status *
              </label>
              <select
                value={newGenesis.status}
                onChange={(e) => setNewGenesis({ ...newGenesis, status: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newGenesis.title.trim() || !newGenesis.leader.trim() || !newGenesis.attendeesCount.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Module
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

