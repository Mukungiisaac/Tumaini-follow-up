import React, { useContext, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import AddChildModal from '../common/AddChildModal';
import RecordObservationModal from '../common/RecordObservationModal';
import AddGoalModal from '../common/AddGoalModal';
import RecordMilestoneModal from '../common/RecordMilestoneModal';
import EditChildModal from '../common/EditChildModal';
import EditGoalModal from '../common/EditGoalModal';
import EditObservationModal from '../common/EditObservationModal';
import ScheduleOneOnOneModal from '../common/ScheduleOneOnOneModal';
import { MOCK_CHILDREN, MOCK_HOUSES, MOCK_SCHEDULED_SESSIONS, MOCK_MENTORS } from '../../data/mockData';
import { MOCK_ACTIVITIES } from '../../data/mockActivities';
import { AdminAuthContext } from '../../lib/adminAuthContext';
import { insertAppRecords, listAppRecords, removeAppRecord, saveAppRecord } from '../../lib/appRecords';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { deleteChildImage, isChildImageStoragePath, uploadChildImage } from '../../lib/childImages';

function readStoredValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

// Session-level cache for Supabase records (stale-while-revalidate)
const SESSION_CACHE_KEY = 'tumaini-session-records';
function readSessionCache() {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.children || !parsed?.houses) return null;
    return parsed;
  } catch {
    return null;
  }
}
function writeSessionCache(records) {
  try {
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(records));
  } catch {
    // sessionStorage may be unavailable in some environments
  }
}

function readStoredChildren() {
  const children = readStoredValue('tumaini-children', MOCK_CHILDREN);
  if (!Array.isArray(children)) return MOCK_CHILDREN;
  return children.map((child) => {
    const normalizedChild = { ...child };
    if (/^Form [1-4]/.test(normalizedChild.grade || '')) normalizedChild.grade = 'Grade 9';
    delete normalizedChild.currentFocus;
    return normalizedChild;
  });
}

function readSavedLocalRecords() {
  const readArray = (key) => {
    const value = readStoredValue(key, []);
    return Array.isArray(value) ? value : [];
  };

  return {
    children: readArray('tumaini-children'),
    houses: readArray('tumaini-houses'),
    sessions: readArray('tumaini-sessions'),
    activities: readArray('tumaini-activities'),
    mentors: readArray('tumaini-mentors')
  };
}

const DEFAULT_USER = {
  id: 'm1',
  name: 'Sarah Johnson',
  role: 'Head Mentor',
  avatar: '/assets/mentors/sarah_j.jpg',
  email: 'sarah.j@tumaini.org',
  phone: '+254 712 345 678',
  department: 'Holistic Child Mentorship'
};

export default function AppLayout() {
  const auth = useContext(AdminAuthContext);
  const useRemoteRecords = isSupabaseConfigured;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.matchMedia('(max-width: 1023px)').matches);
  const [searchQuery, setSearchQuery] = useState('');
  
  // App-wide state — seed from session cache immediately for instant render
  const cachedRecords = useRemoteRecords ? readSessionCache() : null;
  const [childrenList, setChildrenList] = useState(() =>
    useRemoteRecords ? (cachedRecords?.children ?? []) : readStoredChildren()
  );
  const [houses, setHouses] = useState(() =>
    useRemoteRecords ? (cachedRecords?.houses ?? []) : readStoredValue('tumaini-houses', MOCK_HOUSES)
  );
  const [scheduledSessions, setScheduledSessions] = useState(() =>
    useRemoteRecords ? (cachedRecords?.sessions ?? []) : readStoredValue('tumaini-sessions', MOCK_SCHEDULED_SESSIONS)
  );
  const [activities, setActivities] = useState(() =>
    useRemoteRecords ? (cachedRecords?.activities ?? []) : readStoredValue('tumaini-activities', MOCK_ACTIVITIES)
  );
  const [mentors, setMentors] = useState(() =>
    readStoredValue('tumaini-mentors', MOCK_MENTORS)
  );
  const [localCurrentUser, setLocalCurrentUser] = useState(() => readStoredValue('tumaini-user', DEFAULT_USER));
  // Show skeleton only when there is no cached data at all (true cold start)
  const [isDataLoading, setIsDataLoading] = useState(useRemoteRecords && !cachedRecords);
  const [dataError, setDataError] = useState('');
  const [localImportCount, setLocalImportCount] = useState(0);
  const [isImportingLocalData, setIsImportingLocalData] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message = 'Saved successfully', type = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type, id: Date.now() });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const currentUser = useRemoteRecords && auth?.user
    ? {
        id: auth.user.id,
        name: auth.user.user_metadata?.display_name || auth.admin?.display_name || auth.user.email,
        email: auth.user.email,
        role: 'Administrator',
        avatar: auth.user.user_metadata?.avatar_url || '',
        phone: auth.user.user_metadata?.phone || '',
        department: auth.user.user_metadata?.department || ''
      }
    : localCurrentUser;

  useEffect(() => {
    if (!useRemoteRecords) return undefined;

    let isActive = true;
    const hasCachedData = Boolean(readSessionCache());

    const loadRecords = async (isInitial = false) => {
      // Only show the blocking skeleton on a true cold start (no cache)
      if (isInitial && !hasCachedData) setIsDataLoading(true);
      try {
        const records = await listAppRecords();
        if (!isActive) return;
        // Persist to session cache so next navigation is instant
        writeSessionCache(records);
        setChildrenList(records.children);
        setHouses(records.houses);
        setScheduledSessions(records.sessions);
        setActivities(records.activities);
        if (isInitial) {
          const remoteCount = Object.values(records).reduce((count, items) => count + items.length, 0);
          const localRecords = readSavedLocalRecords();
          const localCount = Object.values(localRecords).reduce((count, items) => count + items.length, 0);
          setLocalImportCount(remoteCount === 0 ? localCount : 0);
        }
        setDataError('');
      } catch {
        if (isActive && !hasCachedData) {
          setDataError('Could not load shared records from Supabase. Check the database tables and access policies.');
        }
      } finally {
        if (isActive) setIsDataLoading(false);
      }
    };

    loadRecords(true);
    const channel = supabase
      .channel('shared-app-records')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_records' }, () => loadRecords(false))
      .subscribe();

    return () => {
      isActive = false;
      supabase.removeChannel(channel);
    };
  }, [useRemoteRecords]);

  useEffect(() => {
    if (useRemoteRecords) return;
    try {
      localStorage.setItem('tumaini-children', JSON.stringify(childrenList));
    } catch {
      // Keep the in-memory session usable when browser storage is unavailable or full.
    }
  }, [childrenList, useRemoteRecords]);

  useEffect(() => {
    if (useRemoteRecords) return;
    try {
      localStorage.setItem('tumaini-houses', JSON.stringify(houses));
    } catch {
      // Keep the in-memory session usable when browser storage is unavailable or full.
    }
  }, [houses, useRemoteRecords]);

  useEffect(() => {
    if (useRemoteRecords) return;
    try {
      localStorage.setItem('tumaini-sessions', JSON.stringify(scheduledSessions));
    } catch {
    }
  }, [scheduledSessions, useRemoteRecords]);

  useEffect(() => {
    if (useRemoteRecords) return;
    try {
      localStorage.setItem('tumaini-activities', JSON.stringify(activities));
    } catch {
    }
  }, [activities, useRemoteRecords]);

  useEffect(() => {
    if (useRemoteRecords) return;
    try {
      // Strip avatars to max 50KB each before storing to avoid quota errors
      const stripped = mentors.map(m => ({
        ...m,
        avatar: typeof m.avatar === 'string' && m.avatar.startsWith('data:') && m.avatar.length > 50000
          ? m.avatar.substring(0, 50000) // truncate oversized base64 — should never hit this after canvas resize
          : m.avatar
      }));
      localStorage.setItem('tumaini-mentors', JSON.stringify(stripped));
    } catch {
      // localStorage quota exceeded — mentors will reset on refresh
      console.warn('[AppLayout] Could not persist mentor data to localStorage. Storage may be full.');
    }
  }, [mentors, useRemoteRecords]);

  useEffect(() => {
    if (useRemoteRecords) return;
    try {
      localStorage.setItem('tumaini-user', JSON.stringify(localCurrentUser));
    } catch {
    }
  }, [localCurrentUser, useRemoteRecords]);

  const persistRecord = async (recordType, record) => {
    if (!useRemoteRecords) return true;
    try {
      await saveAppRecord(recordType, record, auth.user.id);
      setDataError('');
      return true;
    } catch {
      setDataError('Could not save this change to Supabase. Please try again.');
      return false;
    }
  };

  const handleImportLocalData = async () => {
    const localRecords = readSavedLocalRecords();
    const count = Object.values(localRecords).reduce((total, items) => total + items.length, 0);
    if (count === 0 || !window.confirm(`Import ${count} records saved in this browser? This shares them with all active admins and does not remove the local copy.`)) return;

    setIsImportingLocalData(true);
    try {
      const existingRecords = await listAppRecords();
      const existingCount = Object.values(existingRecords).reduce((total, items) => total + items.length, 0);
      if (existingCount > 0) {
        setLocalImportCount(0);
        setDataError('Import canceled because shared records already exist. No local records were copied.');
        return;
      }

      await insertAppRecords(localRecords, auth.user.id);
      const importedRecords = await listAppRecords();
      setChildrenList(importedRecords.children);
      setHouses(importedRecords.houses);
      setScheduledSessions(importedRecords.sessions);
      setActivities(importedRecords.activities);
      setLocalImportCount(0);
      setDataError('');
    } catch {
      setDataError('Could not import browser records. No local copy was removed; check for duplicate IDs and try again.');
    } finally {
      setIsImportingLocalData(false);
    }
  };

  const mutateChild = async (childId, update) => {
    const child = childrenList.find((item) => item.id === childId);
    if (!child) return false;
    const updatedChild = update(child);
    if (await persistRecord('children', updatedChild)) {
      setChildrenList((prev) => prev.map((item) => item.id === childId ? updatedChild : item));
      return true;
    }
    return false;
  };

  const handleUpdateHouse = (updatedHouse) => {
    persistRecord('houses', updatedHouse).then((saved) => {
      if (saved) {
        setHouses((prev) => prev.map((house) => house.id === updatedHouse.id ? updatedHouse : house));
        showToast('Updated successfully');
      }
    });
  };

  const handleUpdateUser = async (updatedUserData) => {
    if (useRemoteRecords) {
      try {
        await auth.updateAdminProfile({
          display_name: updatedUserData.name || updatedUserData.display_name || currentUser.name,
          phone: updatedUserData.phone || currentUser.phone || '',
          department: updatedUserData.department || currentUser.department || '',
          avatar_url: updatedUserData.avatar ?? currentUser.avatar ?? ''
        });
        showToast('Updated successfully');
      } catch {
        setDataError('Could not update the admin profile. Please try again.');
      }
      return;
    }
    setLocalCurrentUser((prev) => ({ ...prev, ...updatedUserData }));
    showToast('Updated successfully');
  };

  // Modals state
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [isRecordObsOpen, setIsRecordObsOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isRecordMilestoneOpen, setIsRecordMilestoneOpen] = useState(false);
  const [isEditChildOpen, setIsEditChildOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isEditObsOpen, setIsEditObsOpen] = useState(false);
  const [editingObservation, setEditingObservation] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleChildId, setScheduleChildId] = useState('');

  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const handleViewportChange = (event) => {
      setIsMobileViewport(event.matches);
      setSidebarOpen(false);
    };
    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobileViewport) {
      setSidebarOpen(prev => !prev);
    } else {
      setIsCollapsed(prev => !prev);
    }
  };

  // Handlers for state updates
  const handleAddChild = async (newChild, imageFile) => {
    let childToSave = newChild;
    let uploadedImagePath = '';
    if (imageFile) {
      try {
        uploadedImagePath = await uploadChildImage(imageFile, newChild.id);
        childToSave = { ...newChild, image: uploadedImagePath };
      } catch (error) {
        setDataError(`Could not upload the child photo to Supabase Storage: ${error?.message || 'Unknown Storage error'}`);
        throw error;
      }
    }

    if (!(await persistRecord('children', childToSave))) {
      if (uploadedImagePath) {
        try {
          await deleteChildImage(uploadedImagePath);
        } catch (error) {
          setDataError(`Could not save the child record or clean up its uploaded photo: ${error?.message || 'Unknown Storage error'}`);
        }
      }
      return false;
    }
    setChildrenList((prev) => [childToSave, ...prev]);
    showToast('Saved successfully');
    return true;
  };

  const handleUpdateChild = async (updatedChild, imageFile, successMessage = 'Updated successfully') => {
    const existingChild = childrenList.find((item) => item.id === updatedChild.id);
    if (!existingChild) return false;

    const oldImagePath = isChildImageStoragePath(existingChild.image) ? existingChild.image : '';
    let childToSave = updatedChild;
    let uploadedImagePath = '';
    if (imageFile) {
      try {
        uploadedImagePath = await uploadChildImage(imageFile, updatedChild.id);
        childToSave = { ...updatedChild, image: uploadedImagePath };
      } catch (error) {
        setDataError(`Could not upload the child photo to Supabase Storage: ${error?.message || 'Unknown Storage error'}`);
        throw error;
      }
    }

    const saved = await mutateChild(childToSave.id, () => childToSave);
    if (!saved) {
      if (uploadedImagePath) {
        try {
          await deleteChildImage(uploadedImagePath);
        } catch (error) {
          setDataError(`Could not clean up the new child photo from Supabase Storage: ${error?.message || 'Unknown Storage error'}`);
        }
      }
      return false;
    }

    if (oldImagePath && oldImagePath !== childToSave.image) {
      try {
        await deleteChildImage(oldImagePath);
      } catch (error) {
        // Non-critical: the new photo was already saved. Log silently — no need to alarm the user.
        console.warn('[AppLayout] Old child Storage image could not be deleted (non-critical):', error?.message);
      }
    }

    showToast(successMessage);
    return true;
  };

  const openEditChildModal = (childToEdit) => {
    setEditingChild(childToEdit);
    setIsEditChildOpen(true);
  };

  const handleUpdateGoal = (childId, updatedGoal) => {
    mutateChild(childId, (child) => ({
      ...child,
      goals: (child.goals || []).map((goal) => goal.id === updatedGoal.id ? updatedGoal : goal)
    }));
    showToast('Updated successfully');
  };

  const openEditGoalModal = (goalToEdit) => {
    setEditingGoal(goalToEdit);
    setIsEditGoalOpen(true);
  };

  const handleRecordObservation = (obs) => {
    mutateChild(obs.childId, (child) => ({
      ...child,
      observations: [obs, ...(child.observations || [])]
    }));
    showToast('Saved successfully');
  };

  const handleUpdateObservation = (updatedObs) => {
    const child = childrenList.find((item) => item.observations?.some((observation) => observation.id === updatedObs.id));
    if (!child) return;
    mutateChild(child.id, (current) => ({
      ...current,
      observations: current.observations.map((observation) => observation.id === updatedObs.id ? updatedObs : observation)
    }));
    showToast('Updated successfully');
  };

  const handleDeleteObservation = (obsId) => {
    const child = childrenList.find((item) => item.observations?.some((observation) => observation.id === obsId));
    if (!child) return;
    mutateChild(child.id, (current) => ({
      ...current,
      observations: (current.observations || []).filter((observation) => observation.id !== obsId)
    }));
  };

  const openEditObsModal = (obs) => {
    setEditingObservation(obs);
    setIsEditObsOpen(true);
  };

  const handleAddGoal = (goal) => {
    mutateChild(goal.childId, (child) => ({ ...child, goals: [goal, ...(child.goals || [])] }));
    showToast('Saved successfully');
  };

  const handleRecordMilestone = (milestone) => {
    mutateChild(milestone.childId, (child) => ({
      ...child,
      milestones: [milestone, ...(child.milestones || [])]
    }));
    showToast('Saved successfully');
  };

  const handleUpdateChildSkill = (childId, skillId, newLevel) => {
    mutateChild(childId, (child) => ({
      ...child,
      skillLevels: { ...(child.skillLevels || {}), [skillId]: newLevel }
    }));
    showToast('Updated successfully');
  };

  const handleScheduleSession = (newSession) => {
    persistRecord('sessions', newSession).then((saved) => {
      if (saved) {
        setScheduledSessions((prev) => [newSession, ...prev]);
        showToast('Saved successfully');
      }
    });
  };

  const handleUpdateSessionStatus = (sessionId, newStatus) => {
    const session = scheduledSessions.find((item) => item.id === sessionId);
    if (!session) return;
    const updatedSession = { ...session, status: newStatus };
    persistRecord('sessions', updatedSession).then((saved) => {
      if (saved) {
        setScheduledSessions((prev) => prev.map((item) => item.id === sessionId ? updatedSession : item));
        showToast('Updated successfully');
      }
    });
  };

  const handleAddActivity = (activity) => {
    persistRecord('activities', activity).then((saved) => {
      if (saved) {
        setActivities((prev) => [activity, ...prev]);
        showToast('Saved successfully');
      }
    });
  };

  const handleUpdateActivity = (updatedActivity) => {
    persistRecord('activities', updatedActivity).then((saved) => {
      if (saved) {
        setActivities((prev) => prev.map((activity) => activity.id === updatedActivity.id ? updatedActivity : activity));
        showToast('Updated successfully');
      }
    });
  };

  const handleDeleteActivity = (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    const deleteActivity = async () => {
      if (useRemoteRecords) {
        try {
          await removeAppRecord('activities', activityId);
        } catch {
          setDataError('Could not delete this activity from Supabase. Please try again.');
          return;
        }
      }
      setActivities((prev) => prev.filter((activity) => activity.id !== activityId));
    };
    deleteActivity();
  };

  const handleUpdateAttendance = (activityId, attendees) => {
    const activity = activities.find((item) => item.id === activityId);
    if (!activity) return;
    const updatedActivity = { ...activity, attendees };
    handleUpdateActivity(updatedActivity);
  };

  const openScheduleModal = (childId = '') => {
    setScheduleChildId(childId);
    setIsScheduleModalOpen(true);
  };

  // Determine header title based on current path
  const getHeaderTitles = () => {
    const p = location.pathname;
    if (p === '/') return { title: 'Tumaini Dashboard', subtitle: "Children's Home Portal" };
    if (p === '/children') return { title: 'Children Directory', subtitle: 'Browse, search, and manage profiles for all enrolled children' };
    if (p.startsWith('/children/')) return { title: 'Child Profile View', subtitle: 'Detailed holistic development, skill maps, and observations' };
    if (p === '/progress') return { title: 'Progress Tracking Matrix', subtitle: 'Holistic development tracking across core curriculum areas' };
    if (p === '/observations') return { title: 'Mentor Observations Log', subtitle: 'Record and review individual development notes & observations' };
    if (p === '/goals') return { title: 'Goals & Next Steps', subtitle: 'Track target goals, milestones, and recommended mentor actions' };
    if (p.startsWith('/curriculum/computer')) return { title: 'Computer Curriculum', subtitle: 'Grades 4-9 Progressive IT Skills & Digital Literacy Modules' };
    if (p.startsWith('/curriculum/bible')) return { title: 'Bible & Discipleship', subtitle: 'Scripture memorization, Genesis studies, and Catechism growth' };
    if (p.startsWith('/curriculum/math-science')) return { title: 'Math & Science Support', subtitle: 'STEM tutoring, student progress, and learning activities' };
    if (p.startsWith('/curriculum/music-arts')) return { title: 'Music & Creative Arts', subtitle: 'Guitar progression, hymns, and artistic achievements' };
    if (p === '/mentorship') return { title: 'Mentorship Program', subtitle: '1-on-1 conversations, leadership, and personal growth' };
    if (p === '/reports') return { title: 'Development Reports', subtitle: 'Printable individual, termly, and subject growth analytics' };
    if (p === '/settings') return { title: 'System Settings', subtitle: 'Configure cottages, mentors, and system preferences' };
    return { title: 'Tumaini Dashboard', subtitle: "Children's Home Portal" };
  };

  const titles = getHeaderTitles();

  const handleAddMentor = (mentor) => {
    setMentors((prev) => {
      const updated = [...prev, mentor];
      try { localStorage.setItem('tumaini-mentors', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast('Mentor added');
  };

  const handleUpdateMentor = (updatedMentor) => {
    setMentors((prev) => {
      const updated = prev.map((m) => m.id === updatedMentor.id ? updatedMentor : m);
      try { localStorage.setItem('tumaini-mentors', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast('Mentor updated');
  };

  const handleDeleteMentor = (mentorId) => {
    setMentors((prev) => {
      const updated = prev.filter((m) => m.id !== mentorId);
      try { localStorage.setItem('tumaini-mentors', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showToast('Mentor removed');
  };

  const contextValue = {
    childrenList,
    houses,
    scheduledSessions,
    activities,
    mentors,
    searchQuery,
    currentUser,
    isDataLoading,
    showToast,
    showSuccessToast: showToast,
    handleSignOut: auth?.signOut,
    handleUpdateUser,
    openAddChildModal: () => setIsAddChildOpen(true),
    openEditChildModal,
    openEditGoalModal,
    openRecordObsModal: () => setIsRecordObsOpen(true),
    openAddGoalModal: () => setIsAddGoalOpen(true),
    openRecordMilestoneModal: () => setIsRecordMilestoneOpen(true),
    openScheduleModal,
    handleScheduleSession,
    handleUpdateSessionStatus,
    handleUpdateChild,
    handleUpdateHouse,
    handleUpdateGoal,
    handleUpdateChildSkill,
    handleAddActivity,
    handleUpdateActivity,
    handleDeleteActivity,
    handleUpdateAttendance,
    handleUpdateObservation,
    handleDeleteObservation,
    openEditObsModal,
    handleAddMentor,
    handleUpdateMentor,
    handleDeleteMentor
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        {/* Top Header */}
        <Header
          title={titles.title}
          subtitle={titles.subtitle}
          onToggleSidebar={handleToggleSidebar}
          onSearchChange={(q) => setSearchQuery(q)}
          currentUser={currentUser}
          onSignOut={auth?.signOut}
          childrenList={childrenList}
          activities={activities}
          scheduledSessions={scheduledSessions}
          isSidebarOpen={isMobileViewport ? sidebarOpen : !isCollapsed}
        />

        {/* Dynamic Page View Outlet */}
        <main className="mx-auto w-full max-w-7xl flex-1 p-3 sm:p-6 lg:p-8">
          {localImportCount > 0 && (
            <section className="mb-4 flex flex-col gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-5 text-amber-950">
                This browser has {localImportCount} saved records, but the shared database is empty. Import them only if these are the records you want to share with all admins.
              </p>
              <button
                onClick={handleImportLocalData}
                disabled={isImportingLocalData}
                className="shrink-0 rounded-md border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-950 hover:bg-amber-100 disabled:opacity-60"
              >
                {isImportingLocalData ? 'Importing...' : 'Import browser records'}
              </button>
            </section>
          )}
          {dataError && (
            <div role="alert" className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {dataError}
            </div>
          )}
          <Outlet context={contextValue} />
        </main>
      </div>

      {/* Modals */}
      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={() => setIsAddChildOpen(false)}
        onAddChild={handleAddChild}
      />
      <EditChildModal
        isOpen={isEditChildOpen}
        onClose={() => setIsEditChildOpen(false)}
        child={editingChild}
        onUpdateChild={handleUpdateChild}
      />
      <EditGoalModal
        isOpen={isEditGoalOpen}
        onClose={() => setIsEditGoalOpen(false)}
        goal={editingGoal}
        onUpdateGoal={handleUpdateGoal}
      />
      <EditObservationModal
        isOpen={isEditObsOpen}
        onClose={() => setIsEditObsOpen(false)}
        observation={editingObservation}
        childrenList={childrenList}
        onUpdateObservation={handleUpdateObservation}
      />
      <RecordObservationModal
        isOpen={isRecordObsOpen}
        onClose={() => setIsRecordObsOpen(false)}
        childrenList={childrenList}
        onRecordObservation={handleRecordObservation}
      />
      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        childrenList={childrenList}
        onAddGoal={handleAddGoal}
      />
      <RecordMilestoneModal
        isOpen={isRecordMilestoneOpen}
        onClose={() => setIsRecordMilestoneOpen(false)}
        childrenList={childrenList}
        onRecordMilestone={handleRecordMilestone}
      />
      <ScheduleOneOnOneModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        childrenList={childrenList}
        initialChildId={scheduleChildId}
        onScheduleSession={handleScheduleSession}
      />

      {/* Green Success Pop Message */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 max-w-[calc(100vw-2rem)] rounded-2xl bg-emerald-600 text-white font-medium text-sm shadow-xl shadow-emerald-950/25 border border-emerald-500/80 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="font-semibold text-white tracking-wide">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 -mr-1 p-1 hover:bg-emerald-700/80 rounded-lg text-emerald-100 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
