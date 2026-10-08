import React, { useState } from 'react';
import { MOCK_BIBLE_CURRICULUM } from '../data/mockData';
import { BookOpen, CheckCircle2, AlertCircle, Eye, Plus, Edit2, Check, Trash2 } from 'lucide-react';
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
  const [bibleStudyModules, setBibleStudyModules] = useState(MOCK_BIBLE_CURRICULUM.genesisModules.map((m, idx) => ({
    ...m,
    id: idx,
    keyLesson: m.keyLesson || '',
    completed: m.completed || false
  })));
  
  // Bible Stories state
  const [bibleStories, setBibleStories] = useState([
    { id: 0, title: 'David and Goliath', book: '1 Samuel 17', keyLesson: 'Faith and courage in God', status: 'Completed' },
    { id: 1, title: 'Noah and the Ark', book: 'Genesis 6-9', keyLesson: 'Obedience and God\'s faithfulness', status: 'Active' },
    { id: 2, title: 'Daniel in the Lion\'s Den', book: 'Daniel 6', keyLesson: 'Prayer and trust in God', status: 'Upcoming' }
  ]);

  // Hymns state
  const [hymns, setHymns] = useState([
    { id: 0, title: 'Amazing Grace', composer: 'John Newton', status: 'Learned' },
    { id: 1, title: 'How Great Thou Art', composer: 'Carl Boberg', status: 'In Progress' },
    { id: 2, title: 'It Is Well With My Soul', composer: 'Horatio Spafford', status: 'Not Started' }
  ]);
  
  const [activeModal, setActiveModal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'verse'|'catechism'|'module'|'story'|'hymn', item }
  const [newQuestion, setNewQuestion] = useState({ question: '', answer: '' });
  const [newVerse, setNewVerse] = useState({ verse: '', text: '', theme: '' });
  const [newModule, setNewModule] = useState({ title: '', leader: '', attendeesCount: '', status: 'Upcoming', keyLesson: '' });
  const [newStory, setNewStory] = useState({ title: '', book: '', keyLesson: '', status: 'Upcoming' });
  const [newHymn, setNewHymn] = useState({ title: '', composer: '', status: 'Not Started' });

  const toggleVerse = (v) => {
    setMemorized(prev => ({ ...prev, [v]: !prev[v] }));
  };

  // Delete helpers
  const confirmDelete = (type, item) => {
    setDeleteTarget({ type, item });
    setActiveModal('delete-confirm');
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { type, item } = deleteTarget;
    if (type === 'verse')     setVerseCards(c => c.filter(x => x.verse !== item.verse));
    if (type === 'catechism') setCatechismQuestions(q => q.filter(x => x.qNo !== item.qNo));
    if (type === 'module')    setBibleStudyModules(m => m.filter(x => x.id !== item.id));
    if (type === 'story')     setBibleStories(s => s.filter(x => x.id !== item.id));
    if (type === 'hymn')      setHymns(h => h.filter(x => x.id !== item.id));
    setActiveModal(null);
    setDeleteTarget(null);
  };

  // Edit Handlers
  const handleEditVerse = (card) => {
    setEditingItem(card);
    setNewVerse({ verse: card.verse, text: card.text, theme: card.theme });
    setActiveModal('edit-verse');
  };

  const handleUpdateVerse = (e) => {
    e.preventDefault();
    if (!newVerse.verse.trim() || !newVerse.text.trim() || !newVerse.theme.trim()) return;

    setVerseCards(verseCards.map(card =>
      card.verse === editingItem.verse
        ? { verse: newVerse.verse, text: newVerse.text, theme: newVerse.theme }
        : card
    ));

    setNewVerse({ verse: '', text: '', theme: '' });
    setEditingItem(null);
    setActiveModal(null);
  };

  const handleEditQuestion = (question) => {
    setEditingItem(question);
    setNewQuestion({ question: question.question, answer: question.answer });
    setActiveModal('edit-catechism');
  };

  const handleUpdateQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.question.trim() || !newQuestion.answer.trim()) return;

    setCatechismQuestions(catechismQuestions.map(q =>
      q.qNo === editingItem.qNo
        ? { ...q, question: newQuestion.question, answer: newQuestion.answer }
        : q
    ));

    setNewQuestion({ question: '', answer: '' });
    setEditingItem(null);
    setActiveModal(null);
  };

  const handleEditModule = (module) => {
    setEditingItem(module);
    setNewModule({
      title: module.title,
      leader: module.leader,
      attendeesCount: module.attendeesCount.toString(),
      status: module.status,
      keyLesson: module.keyLesson || ''
    });
    setActiveModal('edit-module');
  };

  const handleUpdateModule = (e) => {
    e.preventDefault();
    if (!newModule.title.trim() || !newModule.leader.trim() || !newModule.attendeesCount.trim()) return;

    setBibleStudyModules(bibleStudyModules.map(m =>
      m.id === editingItem.id
        ? {
            ...m,
            title: newModule.title,
            leader: newModule.leader,
            attendeesCount: parseInt(newModule.attendeesCount),
            status: newModule.status,
            keyLesson: newModule.keyLesson
          }
        : m
    ));

    setNewModule({ title: '', leader: '', attendeesCount: '', status: 'Upcoming', keyLesson: '' });
    setEditingItem(null);
    setActiveModal(null);
  };

  const toggleModuleStatus = (moduleId) => {
    setBibleStudyModules(bibleStudyModules.map(m =>
      m.id === moduleId
        ? {
            ...m,
            status: m.status === 'Active' ? 'Upcoming' : m.status === 'Upcoming' ? 'Completed' : 'Active'
          }
        : m
    ));
  };

  // Bible Story Handlers
  const handleEditStory = (story) => {
    setEditingItem(story);
    setNewStory({
      title: story.title,
      book: story.book,
      keyLesson: story.keyLesson || '',
      status: story.status
    });
    setActiveModal('edit-story');
  };

  const handleUpdateStory = (e) => {
    e.preventDefault();
    if (!newStory.title.trim() || !newStory.book.trim()) return;

    setBibleStories(bibleStories.map(s =>
      s.id === editingItem.id
        ? {
            ...s,
            title: newStory.title,
            book: newStory.book,
            keyLesson: newStory.keyLesson,
            status: newStory.status
          }
        : s
    ));

    setNewStory({ title: '', book: '', keyLesson: '', status: 'Upcoming' });
    setEditingItem(null);
    setActiveModal(null);
  };

  const handleAddStory = (e) => {
    e.preventDefault();
    if (!newStory.title.trim() || !newStory.book.trim()) return;

    setBibleStories([
      ...bibleStories,
      {
        id: bibleStories.length,
        title: newStory.title,
        book: newStory.book,
        keyLesson: newStory.keyLesson || '',
        status: newStory.status
      }
    ]);

    setNewStory({ title: '', book: '', keyLesson: '', status: 'Upcoming' });
    setActiveModal(null);
  };

  const toggleStoryStatus = (storyId) => {
    setBibleStories(bibleStories.map(s =>
      s.id === storyId
        ? {
            ...s,
            status: s.status === 'Active' ? 'Upcoming' : s.status === 'Upcoming' ? 'Completed' : 'Active'
          }
        : s
    ));
  };

  // Hymn Handlers
  const handleEditHymn = (hymn) => {
    setEditingItem(hymn);
    setNewHymn({
      title: hymn.title,
      composer: hymn.composer,
      status: hymn.status
    });
    setActiveModal('edit-hymn');
  };

  const handleUpdateHymn = (e) => {
    e.preventDefault();
    if (!newHymn.title.trim() || !newHymn.composer.trim()) return;

    setHymns(hymns.map(h =>
      h.id === editingItem.id
        ? {
            ...h,
            title: newHymn.title,
            composer: newHymn.composer,
            status: newHymn.status
          }
        : h
    ));

    setNewHymn({ title: '', composer: '', status: 'Not Started' });
    setEditingItem(null);
    setActiveModal(null);
  };

  const handleAddHymn = (e) => {
    e.preventDefault();
    if (!newHymn.title.trim() || !newHymn.composer.trim()) return;

    setHymns([
      ...hymns,
      {
        id: hymns.length,
        title: newHymn.title,
        composer: newHymn.composer,
        status: newHymn.status
      }
    ]);

    setNewHymn({ title: '', composer: '', status: 'Not Started' });
    setActiveModal(null);
  };

  const toggleHymnStatus = (hymnId) => {
    setHymns(hymns.map(h =>
      h.id === hymnId
        ? {
            ...h,
            status: h.status === 'In Progress' ? 'Not Started' : h.status === 'Not Started' ? 'Learned' : 'In Progress'
          }
        : h
    ));
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

  const handleAddModule = (e) => {
    e.preventDefault();
    if (!newModule.title.trim() || !newModule.leader.trim() || !newModule.attendeesCount.trim()) return;

    setBibleStudyModules([
      ...bibleStudyModules,
      {
        id: bibleStudyModules.length,
        title: newModule.title,
        leader: newModule.leader,
        status: newModule.status,
        attendeesCount: parseInt(newModule.attendeesCount),
        keyLesson: newModule.keyLesson || '',
        completed: false
      }
    ]);

    setNewModule({ title: '', leader: '', attendeesCount: '', status: 'Upcoming', keyLesson: '' });
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
          { id: 'modules', label: 'Bible Study Modules' },
          { id: 'stories', label: 'Bible Stories' },
          { id: 'hymns', label: 'Hymns' },
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditVerse(card)}
                          className="flex-shrink-0 p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light rounded-lg transition-colors cursor-pointer"
                          title="Edit verse"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete('verse', card)}
                          className="flex-shrink-0 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete verse"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                      Question #{cq.qNo}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2">{cq.question}</h3>
                  </div>
                  <button
                    onClick={() => handleEditQuestion(cq)}
                    className="flex-shrink-0 p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light rounded-lg transition-colors cursor-pointer"
                    title="Edit question"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => confirmDelete('catechism', cq)}
                    className="flex-shrink-0 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

      {/* Tab 3: Bible Study Modules */}
      {activeSubTab === 'modules' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Bible Study Modules</h2>
              <p className="text-sm text-slate-600">Deep dive studies on biblical books and passages (Genesis, Exodus, etc.)</p>
              <div className="h-1 w-20 bg-brand-primary rounded-full mt-3" />
            </div>
            <button
              onClick={() => setActiveModal('module')}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-[#0a2d38] transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Module
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {bibleStudyModules.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900 leading-snug flex-1">{g.title}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleModuleStatus(g.id)}
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                        g.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : g.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      title="Click to change status"
                    >
                      {g.status}
                    </button>
                    <button
                      onClick={() => handleEditModule(g)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light rounded-lg transition-colors cursor-pointer"
                      title="Edit module"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete('module', g)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
                  {g.keyLesson && (
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Key Lesson</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{g.keyLesson}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Bible Stories */}
      {activeSubTab === 'stories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Bible Stories</h2>
              <p className="text-sm text-slate-600">Individual stories and narratives from across Scripture</p>
              <div className="h-1 w-20 bg-brand-primary rounded-full mt-3" />
            </div>
            <button
              onClick={() => setActiveModal('story')}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-[#0a2d38] transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Story
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {bibleStories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{story.title}</h3>
                    <p className="text-xs text-brand-primary font-semibold mt-1">{story.book}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStoryStatus(story.id)}
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                        story.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : story.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      title="Click to change status"
                    >
                      {story.status}
                    </button>
                    <button
                      onClick={() => handleEditStory(story)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light rounded-lg transition-colors cursor-pointer"
                      title="Edit story"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete('story', story)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {story.keyLesson && (
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Key Lesson</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{story.keyLesson}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Hymns */}
      {activeSubTab === 'hymns' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Hymns & Worship Songs</h2>
              <p className="text-sm text-slate-600">Track hymns being taught and learner mastery progress</p>
              <div className="h-1 w-20 bg-brand-primary rounded-full mt-3" />
            </div>
            <button
              onClick={() => setActiveModal('hymn')}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-primary text-white rounded-lg font-semibold text-xs hover:bg-[#0a2d38] transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Hymn
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {hymns.map((hymn) => (
              <div
                key={hymn.id}
                className={`rounded-lg border p-6 space-y-4 transition-all ${
                  hymn.status === 'Learned'
                    ? 'bg-gradient-to-br from-emerald-50 to-emerald-25 border-emerald-200'
                    : 'bg-white border-slate-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{hymn.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">by {hymn.composer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleHymnStatus(hymn.id)}
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                        hymn.status === 'Learned'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : hymn.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      title="Click to change status"
                    >
                      {hymn.status}
                    </button>
                    <button
                      onClick={() => handleEditHymn(hymn)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light rounded-lg transition-colors cursor-pointer"
                      title="Edit hymn"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete('hymn', hymn)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete hymn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {hymn.status === 'Learned' && (
                  <div className="flex items-center gap-2 text-emerald-700 pt-3 border-t border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-semibold">Mastered by learners</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Passage Submissions */}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={activeModal === 'delete-confirm'}
        onClose={() => { setActiveModal(null); setDeleteTarget(null); }}
        title="Confirm Delete"
        maxWidth="max-w-sm"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">
                {deleteTarget?.type === 'verse'     && `Delete verse "${deleteTarget.item.verse}"?`}
                {deleteTarget?.type === 'catechism' && `Delete Question #${deleteTarget.item.qNo}?`}
                {deleteTarget?.type === 'module'    && `Delete module "${deleteTarget.item.title}"?`}
                {deleteTarget?.type === 'story'     && `Delete story "${deleteTarget.item.title}"?`}
                {deleteTarget?.type === 'hymn'      && `Delete hymn "${deleteTarget.item.title}"?`}
              </p>
              <p className="text-sm text-slate-600">This will permanently remove this item. This cannot be undone.</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => { setActiveModal(null); setDeleteTarget(null); }}
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

      {/* Add Bible Study Module Modal */}
      <Modal isOpen={activeModal === 'module'} onClose={() => setActiveModal(null)} title="Add Bible Study Module" maxWidth="max-w-2xl">
        <form onSubmit={handleAddModule} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Module Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Exodus 1-15: The Journey from Egypt"
              value={newModule.title}
              onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
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
              value={newModule.leader}
              onChange={(e) => setNewModule({ ...newModule, leader: e.target.value })}
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
                value={newModule.attendeesCount}
                onChange={(e) => setNewModule({ ...newModule, attendeesCount: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Status *
              </label>
              <select
                value={newModule.status}
                onChange={(e) => setNewModule({ ...newModule, status: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Key Lesson (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Brief summary of the module's key learning points"
              value={newModule.keyLesson}
              onChange={(e) => setNewModule({ ...newModule, keyLesson: e.target.value })}
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
              disabled={!newModule.title.trim() || !newModule.leader.trim() || !newModule.attendeesCount.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Module
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Verse Modal */}
      <Modal isOpen={activeModal === 'edit-verse'} onClose={() => { setActiveModal(null); setEditingItem(null); }} title="Edit Scripture Verse Card" maxWidth="max-w-2xl">
        <form onSubmit={handleUpdateVerse} className="space-y-5">
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
              onClick={() => { setActiveModal(null); setEditingItem(null); }}
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newVerse.verse.trim() || !newVerse.text.trim() || !newVerse.theme.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Verse
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Catechism Question Modal */}
      <Modal isOpen={activeModal === 'edit-catechism'} onClose={() => { setActiveModal(null); setEditingItem(null); }} title="Edit Catechism Question" maxWidth="max-w-2xl">
        <form onSubmit={handleUpdateQuestion} className="space-y-5">
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
              onClick={() => { setActiveModal(null); setEditingItem(null); }}
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newQuestion.question.trim() || !newQuestion.answer.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Question
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Bible Study Module Modal */}
      <Modal isOpen={activeModal === 'edit-module'} onClose={() => { setActiveModal(null); setEditingItem(null); }} title="Edit Bible Study Module" maxWidth="max-w-2xl">
        <form onSubmit={handleUpdateModule} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Module Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Exodus 1-15: The Journey from Egypt"
              value={newModule.title}
              onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
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
              value={newModule.leader}
              onChange={(e) => setNewModule({ ...newModule, leader: e.target.value })}
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
                value={newModule.attendeesCount}
                onChange={(e) => setNewModule({ ...newModule, attendeesCount: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Status *
              </label>
              <select
                value={newModule.status}
                onChange={(e) => setNewModule({ ...newModule, status: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Key Lesson (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Brief summary of the module's key learning points"
              value={newModule.keyLesson}
              onChange={(e) => setNewModule({ ...newModule, keyLesson: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => { setActiveModal(null); setEditingItem(null); }}
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newModule.title.trim() || !newModule.leader.trim() || !newModule.attendeesCount.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Module
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Bible Story Modal */}
      <Modal isOpen={activeModal === 'story'} onClose={() => setActiveModal(null)} title="Add Bible Story" maxWidth="max-w-2xl">
        <form onSubmit={handleAddStory} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Story Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. The Good Samaritan, Feeding of the 5000"
              value={newStory.title}
              onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Bible Reference *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Luke 10:25-37, John 6:1-15"
              value={newStory.book}
              onChange={(e) => setNewStory({ ...newStory, book: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Key Lesson (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="What children should learn from this story"
              value={newStory.keyLesson}
              onChange={(e) => setNewStory({ ...newStory, keyLesson: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Status *
            </label>
            <select
              value={newStory.status}
              onChange={(e) => setNewStory({ ...newStory, status: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            >
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
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
              disabled={!newStory.title.trim() || !newStory.book.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Story
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Bible Story Modal */}
      <Modal isOpen={activeModal === 'edit-story'} onClose={() => { setActiveModal(null); setEditingItem(null); }} title="Edit Bible Story" maxWidth="max-w-2xl">
        <form onSubmit={handleUpdateStory} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Story Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. The Good Samaritan, Feeding of the 5000"
              value={newStory.title}
              onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Bible Reference *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Luke 10:25-37, John 6:1-15"
              value={newStory.book}
              onChange={(e) => setNewStory({ ...newStory, book: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Key Lesson (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="What children should learn from this story"
              value={newStory.keyLesson}
              onChange={(e) => setNewStory({ ...newStory, keyLesson: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Status *
            </label>
            <select
              value={newStory.status}
              onChange={(e) => setNewStory({ ...newStory, status: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            >
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => { setActiveModal(null); setEditingItem(null); }}
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newStory.title.trim() || !newStory.book.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Story
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Hymn Modal */}
      <Modal isOpen={activeModal === 'hymn'} onClose={() => setActiveModal(null)} title="Add Hymn" maxWidth="max-w-2xl">
        <form onSubmit={handleAddHymn} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Hymn Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Amazing Grace, How Great Thou Art"
              value={newHymn.title}
              onChange={(e) => setNewHymn({ ...newHymn, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Composer/Author *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Newton, Carl Boberg"
              value={newHymn.composer}
              onChange={(e) => setNewHymn({ ...newHymn, composer: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Learning Status *
            </label>
            <select
              value={newHymn.status}
              onChange={(e) => setNewHymn({ ...newHymn, status: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Learned">Learned</option>
            </select>
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
              disabled={!newHymn.title.trim() || !newHymn.composer.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Hymn
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Hymn Modal */}
      <Modal isOpen={activeModal === 'edit-hymn'} onClose={() => { setActiveModal(null); setEditingItem(null); }} title="Edit Hymn" maxWidth="max-w-2xl">
        <form onSubmit={handleUpdateHymn} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Hymn Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Amazing Grace, How Great Thou Art"
              value={newHymn.title}
              onChange={(e) => setNewHymn({ ...newHymn, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Composer/Author *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Newton, Carl Boberg"
              value={newHymn.composer}
              onChange={(e) => setNewHymn({ ...newHymn, composer: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Learning Status *
            </label>
            <select
              value={newHymn.status}
              onChange={(e) => setNewHymn({ ...newHymn, status: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Learned">Learned</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => { setActiveModal(null); setEditingItem(null); }}
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newHymn.title.trim() || !newHymn.composer.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary hover:bg-[#0a2d38] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Hymn
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
