import React from 'react';

export default function StatCard({ icon: Icon, title, value, subtitle, color = 'teal', onClick }) {
  const colorMap = {
    teal: { bg: 'bg-[#EBF5F7]', text: 'text-[#134E5E]', iconBg: 'bg-[#D4ECF0]', border: 'border-[#BBE0E6]' },
    taupe: { bg: 'bg-[#F7F4EE]', text: 'text-[#75674D]', iconBg: 'bg-[#EFECE4]', border: 'border-[#DCD4C4]' },
    purple: { bg: 'bg-[#EBF5F7]', text: 'text-[#134E5E]', iconBg: 'bg-[#D4ECF0]', border: 'border-[#BBE0E6]' },
    indigo: { bg: 'bg-[#F7F4EE]', text: 'text-[#75674D]', iconBg: 'bg-[#EFECE4]', border: 'border-[#DCD4C4]' },
    blue: { bg: 'bg-[#EBF5F7]', text: 'text-[#134E5E]', iconBg: 'bg-[#D4ECF0]', border: 'border-[#BBE0E6]' },
    emerald: { bg: 'bg-emerald-50/80', text: 'text-emerald-700', iconBg: 'bg-emerald-100', border: 'border-emerald-200' },
    amber: { bg: 'bg-[#F7F4EE]', text: 'text-[#75674D]', iconBg: 'bg-[#EFECE4]', border: 'border-[#DCD4C4]' },
    rose: { bg: 'bg-rose-50/80', text: 'text-rose-700', iconBg: 'bg-rose-100', border: 'border-rose-200' },
  }[color] || { bg: 'bg-slate-50', text: 'text-slate-800', iconBg: 'bg-slate-100', border: 'border-slate-200' };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#134E5E]/40 transition-all duration-200 flex flex-col justify-between ${
        onClick ? 'cursor-pointer group' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${colorMap.iconBg} ${colorMap.text} transition-transform group-hover:scale-105 shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <div className="text-xl font-extrabold text-slate-800 tracking-tight leading-none mb-1">
          {value}
        </div>
        {subtitle && (
          <p className="text-[11px] font-medium text-slate-500 leading-tight truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
