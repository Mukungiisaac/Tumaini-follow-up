import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  CheckCircle2,
  X,
  Settings,
  LogOut,
  Trash2,
  ArrowRight,
  Eye,
  Award,
  Calendar,
  Compass,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import Modal from '../common/Modal';
import { MOCK_MENTORS } from '../../data/mockData';

function getNotificationIcon(type) {
  switch (type) {
    case 'milestone':
      return <Award className="w-4 h-4 text-amber-600" />;
    case 'observation':
      return <Eye className="w-4 h-4 text-teal-600" />;
    case 'session':
      return <Calendar className="w-4 h-4 text-indigo-600" />;
    case 'activity':
      return <Compass className="w-4 h-4 text-emerald-600" />;
    default:
      return <CheckCircle2 className="w-4 h-4 text-[#0C3440]" />;
  }
}

export default function Header({
  onOpenSidebar,
  onToggleSidebar,
  title = 'Tumaini Dashboard',
  subtitle = "Children's Home Portal",
  onSearchChange,
  onSignOut,
  currentUser,
  childrenList = [],
  activities = [],
  scheduledSessions = [],
  isSidebarOpen = false
}) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false);
  const [modalCategoryFilter, setModalCategoryFilter] = useState('all');
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [deletedNotificationIds, setDeletedNotificationIds] = useState(() => {
    try {
      const stored = localStorage.getItem('tumaini-deleted-notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const notificationsRef = useRef(null);
  const profileMenuRef = useRef(null);
  const [today, setToday] = useState(() => new Date());
  const user = currentUser || MOCK_MENTORS[0];

  useEffect(() => {
    const intervalId = setInterval(() => setToday(new Date()), 60_000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!showNotifications) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!notificationsRef.current?.contains(event.target)) setShowNotifications(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setShowNotifications(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [showNotifications]);

  useEffect(() => {
    if (!showProfileMenu) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) setShowProfileMenu(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setShowProfileMenu(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [showProfileMenu]);

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(today);

  const rawNotifications = [
    ...childrenList.flatMap((child) => [
      ...(child.milestones || []).map((milestone) => ({
        id: `milestone-${child.id}-${milestone.id}`,
        type: 'milestone',
        categoryLabel: 'Milestone',
        childId: child.id,
        link: `/children/${child.id}`,
        title: `Milestone recorded: ${milestone.title}`,
        detail: child.name,
        date: milestone.date
      })),
      ...(child.observations || []).map((observation) => ({
        id: `observation-${child.id}-${observation.id}`,
        type: 'observation',
        categoryLabel: 'Observation',
        childId: child.id,
        link: `/children/${child.id}`,
        title: `Observation added: ${observation.area}`,
        detail: child.name,
        date: observation.date
      }))
    ]),
    ...scheduledSessions
      .filter((session) => (session.status || '').toLowerCase() === 'completed')
      .map((session) => ({
        id: `session-${session.id}`,
        type: 'session',
        categoryLabel: 'Mentorship',
        link: `/mentorship`,
        title: `Session completed: ${session.topic}`,
        detail: session.childName,
        date: session.date
      })),
    ...activities
      .filter((activity) => (activity.status || '').toLowerCase() === 'completed')
      .map((activity) => ({
        id: `activity-${activity.id}`,
        type: 'activity',
        categoryLabel: 'Activity',
        link: `/activities`,
        title: `Activity completed: ${activity.title}`,
        detail: activity.category,
        date: activity.date
      }))
  ]
    .filter((notification) => notification.date && !Number.isNaN(Date.parse(notification.date)))
    .sort((left, right) => Date.parse(right.date) - Date.parse(left.date));

  const activeNotifications = rawNotifications.filter(
    (notification) => !deletedNotificationIds.includes(notification.id)
  );

  const recentNotifications = activeNotifications.slice(0, 5);

  const handleDeleteNotification = (id, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    setDeletedNotificationIds((prev) => {
      const next = [...new Set([...prev, id])];
      try {
        localStorage.setItem('tumaini-deleted-notifications', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const handleClearAllNotifications = (event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const allIds = rawNotifications.map((n) => n.id);
    setDeletedNotificationIds((prev) => {
      const next = [...new Set([...prev, ...allIds])];
      try {
        localStorage.setItem('tumaini-deleted-notifications', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const handleRestoreNotifications = () => {
    setDeletedNotificationIds([]);
    try {
      localStorage.removeItem('tumaini-deleted-notifications');
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (notification) => {
    setShowNotifications(false);
    setIsAllNotificationsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const formatNotificationDate = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);
    if (Number.isNaN(dateObj.getTime())) return dateString;
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: dateObj.getFullYear() === today.getFullYear() ? undefined : 'numeric'
    }).format(dateObj);
  };

  const handleSidebarToggle = onToggleSidebar || onOpenSidebar;

  const modalNotifications = activeNotifications.filter((n) => {
    if (modalCategoryFilter !== 'all' && n.type !== modalCategoryFilter) {
      return false;
    }
    if (modalSearchQuery.trim()) {
      const q = modalSearchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchDetail = (n.detail || '').toLowerCase().includes(q);
      const matchCategory = n.categoryLabel.toLowerCase().includes(q);
      return matchTitle || matchDetail || matchCategory;
    }
    return true;
  });

  return (
    <>
      <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-2 border-b border-[#D5E2E4] bg-[#F2F6F7]/95 px-3 py-2.5 shadow-2xs backdrop-blur-xl sm:gap-4 sm:px-4 sm:py-3.5 lg:px-8">
        {/* Left section: Hamburger + Page Title */}
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <button
            onClick={handleSidebarToggle}
            className={`shrink-0 rounded-xl border p-2 transition-all shadow-2xs cursor-pointer ${
              isSidebarOpen
                ? 'text-[#0C3440] bg-[#E8F0F0] border-[#B8CED0]'
                : 'text-[#0C3440] bg-white hover:bg-[#E8F0F0] border-[#D5E2E4]'
            }`}
            title={isSidebarOpen ? 'Close navigation' : 'Open navigation'}
            aria-label={isSidebarOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isSidebarOpen}
            aria-controls="primary-sidebar"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold leading-snug tracking-tight text-[#0C3440] sm:text-lg lg:text-xl">
              {title}
            </h2>
            <p className="text-xs text-slate-500 font-medium hidden sm:block truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-[#0C3440]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search children or activities..."
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#CBDDDF] focus:border-[#0C3440] rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C3440]/15 shadow-2xs transition-all"
            />
          </div>
        </div>

        {/* Right controls */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:gap-5">
          {/* Date & Term pill */}
          <div className="hidden xl:flex flex-col items-end text-right">
            <time dateTime={today.toISOString().slice(0, 10)} className="text-xs font-bold text-[#0C3440]">{formattedDate}</time>
            <span className="mt-0.5 text-[10px] font-semibold text-slate-500">
              SCHOOL TERM 3
            </span>
          </div>

          {/* Notifications dropdown */}
          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => setShowNotifications((open) => !open)}
              className={`relative p-2 rounded-full border transition-all shadow-2xs cursor-pointer ${
                showNotifications ? 'bg-[#E8F0F0] text-[#0C3440] border-[#B8CED0]' : 'bg-white text-[#0C3440] hover:bg-[#E8F0F0] border-[#D5E2E4]'
              }`}
              aria-label={`Notifications, ${activeNotifications.length} active updates`}
              aria-expanded={showNotifications}
              aria-controls="notifications-panel"
            >
              <Bell className="w-4.5 h-4.5" />
              {activeNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center ring-2 ring-white">
                  {activeNotifications.length > 9 ? '9+' : activeNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                {/* Mobile backdrop to easily tap outside and prevent clipping */}
                <div
                  className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-2xs sm:hidden"
                  onClick={() => setShowNotifications(false)}
                  aria-hidden="true"
                />

                <div
                  id="notifications-panel"
                  className="fixed left-3 right-3 top-16 z-50 flex max-h-[82vh] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:max-h-[32rem]"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">Notifications</h4>
                      <span className="text-[10px] font-bold text-[#0C3440] bg-[#E8F0F0] border border-[#B8CED0] px-2 py-0.5 rounded-full font-mono">
                        {activeNotifications.length} {activeNotifications.length === 1 ? 'Update' : 'Updates'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeNotifications.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllNotifications}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors cursor-pointer"
                          title="Clear all notifications"
                        >
                          Clear all
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowNotifications(false)}
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 shadow-xs border border-slate-200/80 transition-all active:scale-95 cursor-pointer"
                        aria-label="Close notifications"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto mt-2 divide-y divide-slate-100 pr-0.5">
                    {activeNotifications.length === 0 ? (
                      <div className="py-8 text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                          <Bell className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">No notifications</p>
                        <p className="text-[11px] text-slate-500">You're all caught up! New updates will appear here.</p>
                        {deletedNotificationIds.length > 0 && (
                          <button
                            type="button"
                            onClick={handleRestoreNotifications}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer underline inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" /> Restore dismissed
                          </button>
                        )}
                      </div>
                    ) : (
                      recentNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className="group py-2.5 px-2 flex items-start gap-2.5 hover:bg-slate-50 rounded-xl transition-all cursor-pointer relative"
                        >
                          <div className="p-2 rounded-xl bg-slate-100 text-[#0C3440] shrink-0 mt-0.5 group-hover:bg-[#E8F0F0] transition-colors">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                                {notification.categoryLabel}
                              </span>
                              <span className="text-[10px] text-slate-300">•</span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {formatNotificationDate(notification.date)}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-[#0C3440] transition-colors leading-snug">
                              {notification.title}
                            </p>
                            {notification.detail && (
                              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                {notification.detail}
                              </p>
                            )}
                          </div>

                          {/* Delete button */}
                          <div className="flex items-center shrink-0 ml-1">
                            <button
                              type="button"
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete this notification"
                              aria-label={`Delete notification: ${notification.title}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Panel Footer: View All link */}
                  {activeNotifications.length > 0 && (
                    <div className="pt-3 mt-1 border-t border-slate-100 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNotifications(false);
                          setIsAllNotificationsOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-[#0C3440] bg-[#E8F0F0] hover:bg-[#D5E2E4] rounded-xl transition-all cursor-pointer"
                      >
                        <span>View all notifications</span>
                        <span className="text-[10px] bg-white text-[#0C3440] px-1.5 py-0.5 rounded-full border border-[#B8CED0] font-mono">
                          {activeNotifications.length}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        {/* Account menu & Log out */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-3">
          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu((open) => !open)}
              className="relative block rounded-full focus:outline-none focus:ring-2 focus:ring-[#0C3440] focus:ring-offset-2 cursor-pointer"
              title="Open profile menu"
              aria-label={`Open profile menu for ${user.name}`}
              aria-expanded={showProfileMenu}
              aria-controls="profile-menu"
            >
              <img
                src={user.avatar}
                alt={user.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
                }}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 shadow-xs transition-all hover:ring-2 hover:ring-[#0C3440]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </button>
            {showProfileMenu && (
              <div id="profile-menu" className="absolute right-0 top-full z-50 mt-3 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                  {user.role && <p className="mt-0.5 text-xs text-slate-500">{user.role}</p>}
                  {user.email && <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-slate-500" /> Profile settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSignOut?.();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-rose-500" /> Log out
                </button>
              </div>
            )}
          </div>

          {/* Reddish log out button near admin profile */}
          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 shadow-2xs transition-all hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 active:scale-95 cursor-pointer"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-500 shrink-0" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
      </header>

      {/* All Notifications Modal */}
      <Modal
        isOpen={isAllNotificationsOpen}
        onClose={() => setIsAllNotificationsOpen(false)}
        title="All System Notifications"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {/* Controls: Search, Filters, Clear All */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={modalSearchQuery}
                onChange={(e) => setModalSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#0C3440] focus:ring-1 focus:ring-[#0C3440]"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2">
              {activeNotifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllNotifications}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete all</span>
                </button>
              )}
              {deletedNotificationIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleRestoreNotifications}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                  title="Restore dismissed notifications"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Restore</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100">
            {[
              { id: 'all', label: 'All', count: activeNotifications.length },
              { id: 'observation', label: 'Observations', count: activeNotifications.filter((n) => n.type === 'observation').length },
              { id: 'milestone', label: 'Milestones', count: activeNotifications.filter((n) => n.type === 'milestone').length },
              { id: 'session', label: 'Mentorship', count: activeNotifications.filter((n) => n.type === 'session').length },
              { id: 'activity', label: 'Activities', count: activeNotifications.filter((n) => n.type === 'activity').length }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setModalCategoryFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer ${
                  modalCategoryFilter === tab.id
                    ? 'bg-[#0C3440] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    modalCategoryFilter === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-slate-100 max-h-[55vh] overflow-y-auto pr-1">
            {modalNotifications.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No notifications found</p>
                <p className="text-xs text-slate-400">
                  {modalSearchQuery ? 'No notifications match your search query.' : 'There are no active notifications in this category.'}
                </p>
              </div>
            ) : (
              modalNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="py-3 px-2 flex items-start justify-between gap-3 hover:bg-slate-50 rounded-2xl transition-all group"
                >
                  <div
                    onClick={() => handleNotificationClick(notification)}
                    className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="p-2.5 rounded-xl bg-slate-100 text-[#0C3440] shrink-0 mt-0.5 group-hover:bg-[#E8F0F0] transition-colors">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0C3440] bg-[#E8F0F0] border border-[#B8CED0] px-2 py-0.5 rounded-md font-mono">
                          {notification.categoryLabel}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {formatNotificationDate(notification.date)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0C3440] transition-colors leading-snug">
                        {notification.title}
                      </h4>
                      {notification.detail && (
                        <p className="mt-0.5 text-xs text-slate-600 font-medium">
                          {notification.detail}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-center">
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#0C3440] bg-[#E8F0F0] hover:bg-[#D5E2E4] rounded-xl transition-all cursor-pointer"
                      title="Go to record"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteNotification(notification.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      title="Delete notification"
                      aria-label={`Delete notification: ${notification.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
