import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Eye,
  Target,
  Compass,
  Laptop,
  BookOpen,
  Calculator,
  Palette,
  UserCheck,
  FileText,
  Settings,
  X
} from 'lucide-react';

export default function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile, isOpen, onClose }) {
  // Support both legacy props and new props
  const collapsed = isCollapsed ?? false;
  const mobileOpen = isMobileOpen ?? isOpen ?? false;
  const handleCloseMobile = onCloseMobile || onClose;

  const mainNav = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Children', path: '/children', icon: Users },
    { name: 'Progress Tracking', path: '/progress', icon: TrendingUp },
    { name: 'Observations', path: '/observations', icon: Eye },
    { name: 'Goals & Next Steps', path: '/goals', icon: Target },
  ];

  const curriculumNav = [
    { name: 'Activities', path: '/activities', icon: Compass },
    { name: 'Computer Curriculum', path: '/curriculum/computer', icon: Laptop },
    { name: 'Bible & Discipleship', path: '/curriculum/bible', icon: BookOpen },
    { name: 'Math & Science', path: '/curriculum/math-science', icon: Calculator },
    { name: 'Music & Creative Arts', path: '/curriculum/music-arts', icon: Palette },
  ];

  const managementNav = [
    { name: 'Mentorship', path: '/mentorship', icon: UserCheck },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const renderNavGroup = (items, title) => (
    <div className="space-y-1.5 mb-6">
      {title ? (
        collapsed ? (
          <div className="my-3 border-t border-white/15 mx-2" />
        ) : (
          <h4 className="px-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono mb-2 transition-all">
            {title}
          </h4>
        )
      ) : null}
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleCloseMobile}
            end={item.path === '/'}
            className={({ isActive }) =>
              `group relative flex items-center transition-all duration-200 ${
                collapsed
                  ? 'justify-center w-11 h-11 mx-auto rounded-lg'
                  : 'gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold'
              } ${
                isActive
                  ? 'bg-white/12 text-white font-semibold border-l-2 border-[#D99B3C]'
                  : 'text-slate-300 hover:text-white hover:bg-white/8'
              }`
            }
          >
            <Icon className={`shrink-0 ${collapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
            
            {!collapsed && <span className="truncate">{item.name}</span>}

            {/* Hover Tooltip when sidebar is collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#0C3440] text-white text-xs font-semibold rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 border border-white/15 flex items-center gap-1.5">
                <span>{item.name}</span>
              </div>
            )}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop - Smooth animation */}
      {mobileOpen && (
        <div
          onClick={handleCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Panel - Smooth slide animation */}
      <aside
        id="primary-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0c3440]/95 backdrop-blur-xl border-r border-white/10 text-slate-100 flex flex-col transition-all duration-300 ease-in-out sidebar-shadow ${
          mobileOpen ? 'translate-x-0 w-64 animate-in slide-in-from-left duration-300' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Header Branding */}
        <div className={`flex items-center border-b border-[#0C3440]/60 transition-all ${
          collapsed ? 'justify-center px-3 py-5' : 'justify-between px-5 py-5'
        }`}>
          <div className="flex items-center gap-3">
            <img
              src="/tumaini-logo.svg"
              alt="Tumaini Children's Village"
              className="w-10 h-10 object-contain shrink-0"
            />
            {!collapsed && (
              <div className="overflow-hidden transition-all">
                <h1 className="text-sm font-black tracking-wider uppercase text-white font-mono leading-tight">
                  TUMAINI
                </h1>
                <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase font-mono truncate">
                  CHILDREN'S VILLAGE
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleCloseMobile}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Close navigation"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <nav className={`flex-1 overflow-y-auto py-6 no-scrollbar transition-all ${
          collapsed ? 'px-2' : 'px-3'
        }`}>
          {renderNavGroup(mainNav)}
          {renderNavGroup(curriculumNav, 'CURRICULUM & ARTS')}
          {renderNavGroup(managementNav, 'MANAGEMENT')}
        </nav>

        {/* Footer Tagline */}
        <div className="p-3 border-t border-white/10 bg-slate-950/20 text-center">
          {collapsed ? (
            <span className="text-[9px] font-bold text-slate-400 font-mono">v2.4</span>
          ) : (
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              Tracking System v2.4
            </p>
          )}
        </div>
      </aside>
    </>
  );
}

