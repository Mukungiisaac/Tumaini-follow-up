import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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
import { MOCK_CHILDREN, MOCK_HOUSES, MOCK_SCHEDULED_SESSIONS } from '../../data/mockData';

function readStoredValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.matchMedia('(max-width: 1023px)').matches);
  const [searchQuery, setSearchQuery] = useState('');
  
  // App-wide state
  const [childrenList, setChildrenList] = useState(readStoredChildren);
  const [houses, setHouses] = useState(() => readStoredValue('tumaini-houses', MOCK_HOUSES));
  const [scheduledSessions, setScheduledSessions] = useState(() => readStoredValue('tumaini-sessions', MOCK_SCHEDULED_SESSIONS));
  const [currentUser, setCurrentUser] = useState(() => readStoredValue('tumaini-user', DEFAULT_USER));

  useEffect(() => {
    try {
      localStorage.setItem('tumaini-children', JSON.stringify(childrenList));
    } catch {
      // Keep the in-memory session usable when browser storage is unavailable or full.
    }
  }, [childrenList]);

  useEffect(() => {
    try {
      localStorage.setItem('tumaini-houses', JSON.stringify(houses));
    } catch {
      // Keep the in-memory session usable when browser storage is unavailable or full.
    }
  }, [houses]);

  useEffect(() => {
    try {
      localStorage.setItem('tumaini-sessions', JSON.stringify(scheduledSessions));
    } catch {
    }
  }, [scheduledSessions]);

  useEffect(() => {
    try {
      localStorage.setItem('tumaini-user', JSON.stringify(currentUser));
    } catch {
    }
  }, [currentUser]);

  const handleUpdateHouse = (updatedHouse) => {
    setHouses((prev) => prev.map((house) => house.id === updatedHouse.id ? updatedHouse : house));
  };

  const handleUpdateUser = (updatedUserData) => {
    setCurrentUser(prev => ({ ...prev, ...updatedUserData }));
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
  const handleAddChild = (newChild) => {
    setChildrenList((prev) => [newChild, ...prev]);
  };

  const handleUpdateChild = (updatedChild) => {
    setChildrenList((prev) => prev.map((child) => {
      if (child.id !== updatedChild.id) return child;
      const mergedChild = { ...child, ...updatedChild };
      delete mergedChild.currentFocus;
      return mergedChild;
    }));
  };

  const openEditChildModal = (childToEdit) => {
    setEditingChild(childToEdit);
    setIsEditChildOpen(true);
  };

  const handleUpdateGoal = (childId, updatedGoal) => {
    setChildrenList(prev => prev.map(c => {
      if (c.id === childId) {
        const updatedGoals = (c.goals || []).map(g => g.id === updatedGoal.id ? updatedGoal : g);
        return { ...c, goals: updatedGoals };
      }
      return c;
    }));
  };

  const openEditGoalModal = (goalToEdit) => {
    setEditingGoal(goalToEdit);
    setIsEditGoalOpen(true);
  };

  const handleRecordObservation = (obs) => {
    setChildrenList((prev) => prev.map(c => {
      if (c.id === obs.childId) {
        return { ...c, observations: [obs, ...(c.observations || [])] };
      }
      return c;
    }));
  };

  const handleUpdateObservation = (updatedObs) => {
    setChildrenList(prev => prev.map(c => {
      const hasObs = (c.observations || []).some(o => o.id === updatedObs.id);
      if (hasObs) {
        return { ...c, observations: c.observations.map(o => o.id === updatedObs.id ? updatedObs : o) };
      }
      return c;
    }));
  };

  const handleDeleteObservation = (obsId) => {
    setChildrenList(prev => prev.map(c => ({
      ...c,
      observations: (c.observations || []).filter(o => o.id !== obsId)
    })));
  };

  const openEditObsModal = (obs) => {
    setEditingObservation(obs);
    setIsEditObsOpen(true);
  };

  const handleAddGoal = (goal) => {
    setChildrenList((prev) => prev.map(c => {
      if (c.id === goal.childId) {
        return { ...c, goals: [goal, ...(c.goals || [])] };
      }
      return c;
    }));
  };

  const handleRecordMilestone = (milestone) => {
    setChildrenList((prev) => prev.map(c => {
      if (c.id === milestone.childId) {
        return { ...c, milestones: [milestone, ...(c.milestones || [])] };
      }
      return c;
    }));

  };

  const handleUpdateChildSkill = (childId, skillId, newLevel) => {
    setChildrenList((prev) => prev.map(c => {
      if (c.id === childId) {
        const updatedSkills = (c.skillsMap || []).map(s => {
          if (s.id === skillId) return { ...s, level: newLevel };
          return s;
        });
        return { ...c, skillsMap: updatedSkills };
      }
      return c;
    }));
  };

  const handleScheduleSession = (newSession) => {
    setScheduledSessions((prev) => [newSession, ...prev]);
  };

  const handleUpdateSessionStatus = (sessionId, newStatus) => {
    setScheduledSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: newStatus } : s));
  };

  const openScheduleModal = (childId = '') => {
    setScheduleChildId(childId);
    setIsScheduleModalOpen(true);
  };

  // Determine header title based on current path
  const getHeaderTitles = () => {
    const p = location.pathname;
    if (p === '/') return { title: 'TUMAINI Dashboard', subtitle: "Children's Home Portal" };
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
    return { title: 'TUMAINI Dashboard', subtitle: "Children's Home Portal" };
  };

  const titles = getHeaderTitles();

  const contextValue = {
    childrenList,
    houses,
    scheduledSessions,
    searchQuery,
    currentUser,
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
    handleUpdateObservation,
    handleDeleteObservation,
    openEditObsModal
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
          isSidebarOpen={isMobileViewport ? sidebarOpen : !isCollapsed}
        />

        {/* Dynamic Page View Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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
    </div>
  );
}

