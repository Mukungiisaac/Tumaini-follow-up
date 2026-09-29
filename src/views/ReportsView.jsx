import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Printer, FileText, Download, CheckCircle } from 'lucide-react';

export default function ReportsView() {
  const { childrenList } = useOutletContext();
  const [selectedChildId, setSelectedChildId] = useState(childrenList[0]?.id || 'c1');
  const [reportType, setReportType] = useState('individual'); // 'individual' | 'term' | 'computer'

  const child = childrenList.find((c) => c.id === selectedChildId) || childrenList[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Printable Control Header (Hidden during print) */}
      <div className="no-print bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Development Reports Generator</h2>
          <p className="text-xs text-slate-500 mt-1">
            Generate clean, printable termly and individual child progress reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            {childrenList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.grade})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document (Visible in browser & on print) */}
      <div className="bg-white p-8 lg:p-12 rounded-3xl border border-slate-200 shadow-lg space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Report Document Branding Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6">
          <div className="flex items-center gap-4">
            <img
              src="/tumaini-logo.svg"
              alt="Tumaini Children's Village"
              className="w-14 h-14 object-contain"
            />
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-wider font-mono">
                TUMAINI CHILDREN'S VILLAGE
              </h1>
              <p className="text-xs font-bold text-brand-primary uppercase font-mono tracking-widest">
                CHILD DEVELOPMENT TRACKING SYSTEM â€¢ OFFICIAL REPORT
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-500">
            <p><strong className="text-slate-900">TERM:</strong> Term 3, 2026</p>
            <p><strong className="text-slate-900">DATE:</strong> Oct 23, 2026</p>
          </div>
        </div>

        {/* Child Profile Information Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">CHILD NAME</span>
            <span className="text-sm font-bold text-slate-900">{child.name}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">AGE / GRADE</span>
            <span className="text-sm font-bold text-slate-900">{child.age} yrs â€¢ {child.grade}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">COTTAGE</span>
            <span className="text-sm font-bold text-slate-900">{child.cottage}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">ASSIGNED MENTOR</span>
            <span className="text-sm font-bold text-slate-900">{child.mentor}</span>
          </div>
        </div>

        {/* Personal Statement Quote */}
        <div className="p-4 bg-brand-primary-light rounded-2xl border border-brand-primary-light italic text-xs text-brand-primary font-medium">
          "{child.personalStatement}"
        </div>

        {/* Holistic Area Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
            1. Core Subject Competency Levels
          </h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-mono border-b border-slate-200">
                <th className="p-3">CURRICULUM AREA</th>
                <th className="p-3">PROGRESS LEVEL</th>
                <th className="p-3">ASSESSMENT NOTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-bold">Computer & Digital Literacy</td>
                <td className="p-3 font-mono text-brand-primary font-bold">ADVANCED (85%)</td>
                <td className="p-3 text-slate-600">Demonstrates high proficiency in typing, Word, and basic coding logic.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">Bible & Discipleship</td>
                <td className="p-3 font-mono text-brand-primary font-bold">INTERMEDIATE (70%)</td>
                <td className="p-3 text-slate-600">Regularly recites memory verses and participates in cottage devotion.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">Mathematics & Science</td>
                <td className="p-3 font-mono text-blue-600 font-bold">ADVANCED (80%)</td>
                <td className="p-3 text-slate-600">Strong problem solving speed and interest in science labs.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold">Music & Creative Arts</td>
                <td className="p-3 font-mono text-slate-600 font-bold">BEGINNER (50%)</td>
                <td className="p-3 text-slate-600">Enjoys group singing and basic drawing exercises.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Observations & Goals Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 font-mono uppercase">Key Strengths Noticed</h4>
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">
              {child.keyStrength} â€¢ Demonstrates peer mentorship and eagerness to assist younger children in the IT lab.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 font-mono uppercase">Active Development Targets</h4>
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">
              {(child.goals || []).map((goal) => goal.title).join(' • ') || 'No development targets recorded.'}
            </p>
          </div>
        </div>

        {/* Official Signatures Row */}
        <div className="pt-12 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="border-b border-slate-400 w-48 mb-1" />
            <p className="font-bold text-slate-900">{child.mentor}</p>
            <p className="text-slate-400 font-mono text-[10px]">ASSIGNED MENTOR SIGNATURE</p>
          </div>

          <div className="text-right">
            <div className="border-b border-slate-400 w-48 ml-auto mb-1" />
            <p className="font-bold text-slate-900">Sarah Johnson</p>
            <p className="text-slate-400 font-mono text-[10px]">HEAD MENTOR & VILLAGE DIRECTOR</p>
          </div>
        </div>
      </div>
    </div>
  );
}

