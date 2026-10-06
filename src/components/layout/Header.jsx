import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, CheckCircle2, X, Settings, LogOut } from 'lucide-react';
import { MOCK_MENTORS } from '../../data/mockData';

export default function Header({
  onOpenSidebar,
  onToggleSidebar,
  title = 'TUMAINI Dashboard',
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

  const notifications = [
    ...childrenList.flatMap((child) => [
      ...(child.milestones || []).map((milestone) => ({
        id: `milestone-${child.id}-${milestone.id}`,
        title: `Milestone recorded: ${milestone.title}`,
        detail: child.name,
        date: milestone.date
      })),
      ...(child.observations || []).map((observation) => ({
        id: `observation-${child.id}-${observation.id}`,
        title: `Observation added: ${observation.area}`,
        detail: child.name,
        date: observation.date
      }))
    ]),
    ...scheduledSessions
      .filter((session) => (session.status || '').toLowerCase() === 'completed')
      .map((session) => ({
        id: `session-${session.id}`,
        title: `Session completed: ${session.topic}`,
        detail: session.childName,
        date: session.date
      })),
    ...activities
      .filter((activity) => (activity.status || '').toLowerCase() === 'completed')
      .map((activity) => ({
        id: `activity-${activity.id}`,
        title: `Activity completed: ${activity.title}`,
        detail: activity.category,
        date: activity.date
      }))
  ]
    .filter((notification) => notification.date && !Number.isNaN(Date.parse(notification.date)))
    .sort((left, right) => Date.parse(right.date) - Date.parse(left.date))
    .slice(0, 5);

  const formatNotificationDate = (dateString) => new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: new Date(dateString).getFullYear() === today.getFullYear() ? undefined : 'numeric'
  }).format(new Date(`${dateString}T00:00:00`));

  const handleSidebarToggle = onToggleSidebar || onOpenSidebar;

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-2 border-b border-slate-200/80 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur-md sm:gap-4 sm:px-4 sm:py-3.5 lg:px-8">
      {/* Left section: Hamburger + Page Title */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          onClick={handleSidebarToggle}
          className={`shrink-0 rounded-lg border border-slate-200 p-2 transition-colors ${
            isSidebarOpen
              ? 'text-[#0C3440] bg-[#E8F0F0] border-[#B8CED0]'
              : 'text-slate-600 bg-white hover:bg-slate-100'
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
          <h2 className="truncate text-base font-bold leading-snug tracking-tight text-slate-900 sm:text-lg lg:text-xl">
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
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search children or activities..."
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-[#0C3440] rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C3440]/20 transition-all"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-3 lg:gap-5">
        {/* Date & Term pill */}
        <div className="hidden xl:flex flex-col items-end text-right">
          <time dateTime={today.toISOString().slice(0, 10)} className="text-xs font-bold text-slate-800">{formattedDate}</time>
          <span className="mt-0.5 text-[10px] font-semibold text-slate-500">
            SCHOOL TERM 3
          </span>
        </div>

        {/* Notifications dropdown */}
        <div ref={notificationsRef} className="relative">
          <button
            onClick={() => setShowNotifications((open) => !open)}
            className={`relative p-2 rounded-full transition-colors cursor-pointer ${
              showNotifications ? 'bg-slate-100 text-[#0C3440]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label={`Notifications, ${notifications.length} recent updates`}
            aria-expanded={showNotifications}
            aria-controls="notifications-panel"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#0C3440] rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div
              id="notifications-panel"
              className="absolute right-[-3rem] sm:right-0 mt-2 w-[calc(100vw-2rem)] max-w-[340px] sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800">Notifications</h4>
                  <span className="text-[10px] font-bold text-[#0C3440] bg-[#E8F0F0] border border-[#B8CED0] px-2 py-0.5 rounded-full">
                    {notifications.length} Updates
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 shadow-xs border border-slate-200/80 transition-all active:scale-95 cursor-pointer"
                  aria-label="Close notifications"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto mt-2 divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500">No recent updates</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="py-2.5 px-1 flex items-start gap-2.5 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#0C3440] shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 leading-snug">{notification.title}</p>
                        <p className="mt-0.5 truncate text-[11px] text-slate-500">{notification.detail}</p>
                        <span className="mt-0.5 block text-[10px] font-mono text-slate-400">{formatNotificationDate(notification.date)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Account menu */}
        <div ref={profileMenuRef} className="relative border-l border-slate-200 pl-2 sm:pl-3">
          <button
            type="button"
            onClick={() => setShowProfileMenu((open) => !open)}
            className="relative block rounded-full focus:outline-none focus:ring-2 focus:ring-[#0C3440] focus:ring-offset-2"
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
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 shadow-xs transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </button>
          {showProfileMenu && (
            <div id="profile-menu" className="absolute right-0 top-full z-50 mt-3 w-60 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
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
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Settings className="h-4 w-4 text-slate-500" /> Profile settings
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4 text-slate-500" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
