import React, { useState } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import StudentInformationPanel from '../components/common/StudentInformationPanel';
import ChildImage from '../components/common/ChildImage';
import {
  Quote,
  Award,
  FileEdit,
  ArrowLeft,
  CheckCircle,
  Plus,
  Edit3,
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  XCircle,
} from 'lucide-react';

export default function ChildProfileView() {
  const { id } = useParams();
  const {
    childrenList,
    houses = [],
    scheduledSessions = [],
    openEditChildModal,
    openEditGoalModal,
    openRecordObsModal,
    openAddGoalModal,
    openRecordMilestoneModal,
    openScheduleModal,
    handleUpdateSessionStatus,
    handleUpdateChild
  } = useOutletContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('student-info');
  const [isEditingCaseHistory, setIsEditingCaseHistory] = useState(false);
  const [caseHistoryDraft, setCaseHistoryDraft] = useState({ caseHistory: '', howJoined: '' });
  const [academicEntry, setAcademicEntry] = useState({
    subject: '',
    term: '',
    schoolYear: '',
    result: '',
    notes: ''
  });

  // Find target child or default to first (Samuel O.)
  const child = childrenList.find((c) => c.id === id) || childrenList[0];
  const assignedHouse = houses.find((house) => house.id === child.houseId);

  const startEditingCaseHistory = () => {
    setCaseHistoryDraft({
      caseHistory: child.studentInformation?.caseHistory || '',
      howJoined: child.studentInformation?.howJoined || ''
    });
    setIsEditingCaseHistory(true);
  };

  const saveCaseHistory = (event) => {
    event.preventDefault();
    handleUpdateChild?.({
      ...child,
      studentInformation: {
        ...child.studentInformation,
        ...caseHistoryDraft
      }
    });
    setIsEditingCaseHistory(false);
  };

  const handleAddAcademicRecord = (event) => {
    event.preventDefault();
    if (!academicEntry.subject.trim()) return;

    const record = {
      id: `ar_${Date.now()}`,
      ...academicEntry,
      subject: academicEntry.subject.trim(),
      date: new Date().toISOString().slice(0, 10)
    };
    handleUpdateChild?.({
      ...child,
      academicRecords: [record, ...(child.academicRecords || [])]
    });
    setAcademicEntry({ subject: '', term: '', schoolYear: '', result: '', notes: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/children')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </button>

      {/* Top Split Hero Layout (Page 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-[200px_minmax(0,1fr)] bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs">
          <div className="relative aspect-[3/4] max-h-[380px] sm:aspect-auto sm:max-h-none sm:min-h-full bg-[#E8F0F0] overflow-hidden">
            <ChildImage
              src={child.image}
              alt={child.name}
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          </div>

          <div className="min-w-0 p-4 sm:p-6 flex flex-col justify-between gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#E8F0F0] text-[#0C3440] text-xs font-semibold rounded-md">{child.grade}</span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">Age {child.age}</span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-amber-50 text-amber-800 text-xs font-medium rounded-md">{child.houseId ? `House ${child.houseId}` : 'House unassigned'}</span>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Student profile</p>
                <h2 className="mt-0.5 text-xl sm:text-2xl font-bold text-slate-900 break-words">{child.fullName || child.name}</h2>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-600">Assigned mentor: {child.mentor || 'Not assigned'}</p>
              </div>

              {child.personalStatement && (
                <blockquote className="border-l-2 border-[#D99B3C] pl-2.5 sm:pl-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    <Quote className="w-3 h-3 text-[#8A5F20]" /> Personal statement
                  </div>
                  <p className="mt-0.5 text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-3 sm:line-clamp-none">{child.personalStatement}</p>
                </blockquote>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 sm:pt-4 border-t border-slate-100">
              <button
                onClick={() => openEditChildModal && openEditChildModal(child)}
                className="flex-1 sm:flex-initial px-3 py-1.5 sm:py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
              <button
                onClick={() => openScheduleModal && openScheduleModal(child.id)}
                className="flex-1 sm:flex-initial px-3 py-1.5 sm:py-2 bg-[#0C3440] hover:bg-[#164957] text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" /> Schedule 1-on-1
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-3 sm:space-y-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Student at a glance</h3>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500">Admission and learner details</p>
          </div>
          <dl className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 sm:border-0 sm:p-0 sm:bg-transparent">
              <dt className="text-[10px] font-semibold uppercase text-slate-400">Admission Number</dt>
              <dd className="mt-0.5 text-xs sm:text-sm font-medium text-slate-800 break-words">{child.studentInformation?.admissionNumber || 'Not recorded'}</dd>
            </div>
            <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 sm:border-0 sm:p-0 sm:bg-transparent">
              <dt className="text-[10px] font-semibold uppercase text-slate-400">Date Joined</dt>
              <dd className="mt-0.5 text-xs sm:text-sm font-medium text-slate-800 break-words">{child.joinedDate || 'Not recorded'}</dd>
            </div>
            <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 sm:border-0 sm:p-0 sm:bg-transparent">
              <dt className="text-[10px] font-semibold uppercase text-slate-400">Date of Birth</dt>
              <dd className="mt-0.5 text-xs sm:text-sm font-medium text-slate-800 break-words">{child.studentInformation?.dateOfBirth || 'Not recorded'}</dd>
            </div>
            <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 sm:border-0 sm:p-0 sm:bg-transparent">
              <dt className="text-[10px] font-semibold uppercase text-slate-400">Stream</dt>
              <dd className="mt-0.5 text-xs sm:text-sm font-medium text-slate-800 break-words">{child.studentInformation?.stream || 'Not recorded'}</dd>
            </div>
          </dl>
          <section className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3">
            <h4 className="text-xs font-semibold text-slate-700">{child.fullName || child.name} Sponsor</h4>
            <dl className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="min-w-0">
                <dt className="text-[10px] font-medium uppercase text-slate-400">Sponsor name</dt>
                <dd className="mt-0.5 truncate text-xs sm:text-sm font-medium text-slate-800">{child.studentInformation?.sponsorName || 'Not recorded'}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] font-medium uppercase text-slate-400">Sponsor email</dt>
                <dd className="mt-0.5 break-all text-xs sm:text-sm font-medium text-slate-800">{child.studentInformation?.sponsorEmail || 'Not recorded'}</dd>
              </div>
            </dl>
          </section>
          <button
            type="button"
            onClick={() => setActiveTab('student-info')}
            className="w-full px-4 py-2 sm:py-2.5 bg-[#E8F0F0] hover:bg-[#D4E4E4] text-[#0C3440] text-xs sm:text-sm font-semibold rounded-lg transition-colors"
          >
            View student information
          </button>
        </div>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden" aria-label="Placement and care details">
        <div className="bg-white p-3 sm:p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">HOUSE & PARENTS</span>
          <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">{child.houseId ? `House ${child.houseId}` : 'Unassigned'}</p>
          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-600 line-clamp-2">
            {assignedHouse?.parentOne || assignedHouse?.parentTwo
              ? [assignedHouse.parentOne, assignedHouse.parentTwo].filter(Boolean).join(' & ')
              : 'Parent couple not recorded'}
          </p>
        </div>
        <div className="bg-white p-3 sm:p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">DATE JOINED</span>
          <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">{child.joinedDate || 'Not recorded'}</p>
        </div>
        <div className="bg-white p-3 sm:p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">HEALTH STATUS</span>
          <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">{child.healthStatus || 'Not recorded'}</p>
        </div>
        <div className="bg-white p-3 sm:p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">HEALTH NOTES</span>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-600 line-clamp-2">{child.healthNotes || 'No notes recorded'}</p>
        </div>
      </section>

      {/* Profile Section Tabs */}
      <div className="border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('student-info')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
              activeTab === 'student-info'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Student Information
          </button>
          <button
            onClick={() => setActiveTab('case-history')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
              activeTab === 'case-history'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Case History
          </button>
          <button
            onClick={() => setActiveTab('observations')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'observations'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mentor Observations ({child.observations?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('academics')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer whitespace-nowrap ${
              activeTab === 'academics'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Academic Records ({child.academicRecords?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'goals'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Personal Goals ({child.goals?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'milestones'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Milestones Timeline ({child.milestones?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'sessions'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            1-on-1 Meetings ({scheduledSessions.filter(s => s.childId === child.id).length})
          </button>
        </div>

        <div className="pb-2 hidden md:block">
          <button
            onClick={openRecordObsModal}
            className="px-4 py-2 bg-[#0C3440] text-white text-xs font-bold rounded-xl hover:bg-[#0C3440] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <FileEdit className="w-3.5 h-3.5" /> Log Note
          </button>
        </div>
      </div>

      {activeTab === 'student-info' && <StudentInformationPanel child={child} />}

      {activeTab === 'case-history' && (
        <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Case History</h3>
              <p className="mt-1 text-sm text-slate-500">Background and admission history for {child.fullName || child.name}.</p>
            </div>
            {!isEditingCaseHistory && (
              <button
                type="button"
                onClick={startEditingCaseHistory}
                className="px-3 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit history
              </button>
            )}
          </div>

          {isEditingCaseHistory ? (
            <form onSubmit={saveCaseHistory} className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">Child's Case History</span>
                <textarea
                  rows="7"
                  value={caseHistoryDraft.caseHistory}
                  onChange={(event) => setCaseHistoryDraft({ ...caseHistoryDraft, caseHistory: event.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">How the Child Joined Tumaini</span>
                <textarea
                  rows="5"
                  value={caseHistoryDraft.howJoined}
                  onChange={(event) => setCaseHistoryDraft({ ...caseHistoryDraft, howJoined: event.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
                />
              </label>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingCaseHistory(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0C3440] hover:bg-[#164957] text-white text-sm font-semibold rounded-lg">
                  Save history
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <article className="p-4 bg-slate-50 border border-slate-200 rounded-lg min-h-36">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Child's Case History</h4>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{child.studentInformation?.caseHistory || 'Not recorded'}</p>
              </article>
              <article className="p-4 bg-slate-50 border border-slate-200 rounded-lg min-h-36">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">How the Child Joined Tumaini</h4>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{child.studentInformation?.howJoined || 'Not recorded'}</p>
              </article>
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Mentor Observations */}
      {activeTab === 'observations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase">
              Recorded Observation Log
            </h4>
            <button
              onClick={openRecordObsModal}
              className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Observation
            </button>
          </div>

          {(!child.observations || child.observations.length === 0) ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 text-slate-500 text-xs">
              No observations recorded yet. Click "Add Observation" above.
            </div>
          ) : (
            <div className="space-y-4">
              {child.observations.map((obs) => (
                <div key={obs.id} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-brand-primary-light text-brand-primary text-xs font-bold rounded-full">
                      {obs.area}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {obs.date}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                    "{obs.text}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-2.5 sm:pt-3 border-t border-slate-100 text-xs">
                    <div className="bg-emerald-50/50 p-2 sm:p-2.5 rounded-lg border border-emerald-100/60">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 font-mono block">STRENGTH</span>
                      <span className="mt-0.5 font-semibold text-emerald-700 text-xs sm:text-sm block">{obs.strength}</span>
                    </div>
                    <div className="bg-rose-50/50 p-2 sm:p-2.5 rounded-lg border border-rose-100/60">
                      <span className="text-[10px] font-bold uppercase text-rose-800 font-mono block">CHALLENGE</span>
                      <span className="mt-0.5 font-semibold text-rose-700 text-xs sm:text-sm block">{obs.challenge}</span>
                    </div>
                    <div className="bg-slate-50/80 p-2 sm:p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-500 font-mono block">NEXT STEP</span>
                      <span className="mt-0.5 font-semibold text-slate-800 text-xs sm:text-sm block">{obs.nextStep}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'academics' && (
        <div className="space-y-5">
          <form onSubmit={handleAddAcademicRecord} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Add academic record</h4>
              <p className="text-xs text-slate-500 mt-1">Record any subject or learning area used by Tumaini.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                required
                aria-label="Subject or learning area"
                placeholder="Subject / learning area"
                value={academicEntry.subject}
                onChange={(event) => setAcademicEntry({ ...academicEntry, subject: event.target.value })}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
              <input
                aria-label="Term"
                placeholder="Term"
                value={academicEntry.term}
                onChange={(event) => setAcademicEntry({ ...academicEntry, term: event.target.value })}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
              <input
                aria-label="School year"
                placeholder="School year"
                value={academicEntry.schoolYear}
                onChange={(event) => setAcademicEntry({ ...academicEntry, schoolYear: event.target.value })}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
              <input
                aria-label="Result or grade"
                placeholder="Result / grade"
                value={academicEntry.result}
                onChange={(event) => setAcademicEntry({ ...academicEntry, result: event.target.value })}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <textarea
                aria-label="Academic notes"
                rows="2"
                placeholder="Notes or next steps"
                value={academicEntry.notes}
                onChange={(event) => setAcademicEntry({ ...academicEntry, notes: event.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
              />
              <button type="submit" className="px-4 py-2 bg-[#0C3440] text-white text-xs font-bold rounded-lg inline-flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Record
              </button>
            </div>
          </form>

          {(child.academicRecords || []).length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">
              No academic records have been added for this child.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {child.academicRecords.map((record) => (
                <article key={record.id} className="p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{record.subject}</h5>
                    <p className="text-xs text-slate-600 mt-1">
                      {[record.term, record.schoolYear].filter(Boolean).join(' · ') || 'Term/year not recorded'}
                    </p>
                    {record.notes && <p className="text-xs text-slate-600 mt-2">{record.notes}</p>}
                  </div>
                  <div className="sm:text-right">
                    <p className="text-sm font-bold text-[#0C3440]">{record.result || 'Result not recorded'}</p>
                    <time className="text-[11px] text-slate-400">Recorded {record.date}</time>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Personal Goals */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase">
              Target Goals & Action Plans
            </h4>
            <button
              onClick={openAddGoalModal}
              className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(child.goals || []).map((goal) => (
              <div key={goal.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5 hover:border-brand-primary-light transition-all">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-brand-primary-light text-brand-primary text-xs font-bold rounded-md border border-brand-primary-light">
                      {goal.area}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 font-mono">
                      Target: {goal.targetDate}
                    </span>
                  </div>

                  <button
                    onClick={() => openEditGoalModal && openEditGoalModal({ ...goal, childId: child.id })}
                    className="p-1.5 text-slate-500 hover:text-brand-primary hover:bg-brand-primary-light rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Edit Goal & Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{goal.title}</h4>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span className="text-slate-400 font-mono text-[10px]">PROGRESS</span>
                    <span className="text-brand-primary font-mono">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {goal.note && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                    "{goal.note}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Milestones Timeline */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 font-mono uppercase">
              Milestone & Honor Achievements
            </h4>
            <button
              onClick={openRecordMilestoneModal}
              className="px-4 py-2 bg-[#0C3440] text-white text-xs font-bold rounded-xl hover:bg-[#164957] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" /> Record Milestone
            </button>
          </div>

          <div className="space-y-4">
            {(child.milestones || []).map((m) => (
              <div key={m.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex items-start gap-4">
                <div className="p-3 bg-[#E8F0F0] text-[#0C3440] rounded-2xl shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-bold text-slate-900">{m.title}</h4>
                    <span className="text-xs font-bold text-slate-400 font-mono">{m.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: 1-on-1 Sessions */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-mono uppercase">
                Scheduled & Past 1-on-1 Sessions
              </h4>
              <p className="text-xs text-slate-500">Mentor check-ins, dates, times, and meeting locations.</p>
            </div>
            <button
              onClick={() => openScheduleModal(child.id)}
              className="px-4 py-2 bg-[#0C3440] text-white text-xs font-bold rounded-xl hover:bg-[#164957] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <UserCheck className="w-4 h-4" /> Schedule New 1-on-1
            </button>
          </div>

          {scheduledSessions.filter(s => s.childId === child.id).length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-8 space-y-2">
              <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No 1-on-1 sessions scheduled for {child.name} yet.</p>
              <button
                onClick={() => openScheduleModal(child.id)}
                className="text-xs font-bold text-[#0C3440] hover:text-[#164957] underline cursor-pointer"
              >
                Book first 1-on-1 session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scheduledSessions.filter(s => s.childId === child.id).map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-primary bg-brand-primary-light px-2.5 py-1 rounded-lg">
                        Mentor: {s.mentorName}
                      </span>
                      <span
                        className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          s.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : s.status === 'Cancelled'
                            ? 'bg-slate-200 text-slate-600'
                            : 'bg-brand-primary-light text-brand-primary border border-brand-primary-light'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{s.topic}</h4>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-brand-primary font-bold">
                        <Calendar className="w-3.5 h-3.5" /> {s.date}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 font-bold font-mono">
                        <Clock className="w-3.5 h-3.5 text-brand-primary" /> {s.time}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {s.location}
                      </span>
                    </div>

                    {s.notes && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                        "{s.notes}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => openScheduleModal(child.id)}
                      className="text-slate-500 hover:text-brand-primary font-medium transition-colors cursor-pointer"
                    >
                      Reschedule
                    </button>
                    {s.status === 'Scheduled' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateSessionStatus && handleUpdateSessionStatus(s.id, 'Cancelled')}
                          className="px-2.5 py-1 text-slate-500 hover:text-rose-600 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateSessionStatus && handleUpdateSessionStatus(s.id, 'Completed')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

