import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, CheckCircle2, X } from 'lucide-react';
import { MOCK_MENTORS } from '../../data/mockData';

export default function Header({
  onOpenSidebar,
  onToggleSidebar,
  title = 'TUMAINI Dashboard',
  subtitle = "Children's Home Portal",
  onSearchChange,
  currentUser,
  isSidebarOpen = false
}) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [today, setToday] = useState(() => new Date());
  const user = currentUser || MOCK_MENTORS[0];

  useEffect(() => {
    const intervalId = setInterval(() => setToday(new Date()), 60_000);
    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(today);

  const notifications = [
    { id: 1, title: 'Samuel O. completed Level 1 Typing', time: '10m ago' },
    { id: 2, title: 'Math Support needed for Sarah M.', time: '1h ago' },
    { id: 3, title: 'Discipleship milestone added by John D.', time: '3h ago' }
  ];

  const handleSidebarToggle = onToggleSidebar || onOpenSidebar;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-sm">
      {/* Left section: Hamburger + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={handleSidebarToggle}
          className={`p-2 rounded-lg border border-slate-200 transition-colors ${
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
          <h2 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight leading-snug truncate">
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
      <div className="flex items-center gap-3 lg:gap-5">
        {/* Date & Term pill */}
        <div className="hidden xl:flex flex-col items-end text-right">
          <time dateTime={today.toISOString().slice(0, 10)} className="text-xs font-bold text-slate-800">{formattedDate}</time>
          <span className="text-[10px] font-bold text-[#8A5F20] uppercase font-mono tracking-wider">
            SCHOOL TERM 3
          </span>
        </div>

        {/* Notifications dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#0C3440] rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase text-slate-800 font-mono">Notifications</h4>
                <span className="text-[10px] font-bold text-[#8A5F20] bg-[#FBF3E4] border border-[#E6C98F] px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0C3440] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-slate-800">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Logged in Mentor User pill */}
        <div
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 pl-3 border-l border-slate-200 cursor-pointer group"
          title="Click to edit user profile in Settings"
        >
          <div className="text-right hidden sm:block">
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0C3440] leading-tight transition-colors">
              {user.name}
            </h4>
            <p className="text-[10px] font-bold text-[#8A5F20] uppercase font-mono tracking-wider">
              {user.role}
            </p>
          </div>
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
              }}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#D99B3C] group-hover:ring-[#0C3440] shadow-xs transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
        </div>
      </div>
    </header>
  );
}

