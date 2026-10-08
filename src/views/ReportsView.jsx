import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Download } from 'lucide-react';
import CustomSelect from '../components/common/CustomSelect';

export default function ReportsView() {
  const { childrenList } = useOutletContext();
  const [selectedChildId, setSelectedChildId] = useState(childrenList[0]?.id || 'c1');

  const child = childrenList.find((c) => c.id === selectedChildId) || childrenList[0];

  const handlePrint = () => {
    window.print();
  };

  const competencies = [
    {
      area: 'Computer & Digital Literacy',
      level: 'ADVANCED',
      percentage: 85,
      note: 'Demonstrates high proficiency in typing, Word, and basic coding logic.'
    },
    {
      area: 'Bible & Discipleship',
      level: 'INTERMEDIATE',
      percentage: 70,
      note: 'Regularly recites memory verses and participates in cottage devotion.'
    },
    {
      area: 'Mathematics & Science',
      level: 'ADVANCED',
      percentage: 80,
      note: 'Strong problem solving speed and interest in science labs.'
    },
    {
      area: 'Music & Creative Arts',
      level: 'BEGINNER',
      percentage: 50,
      note: 'Enjoys group singing and basic drawing exercises.'
    }
  ];

  return (
    <>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Control Header (Hidden during print) */}
      <div className="no-print space-y-8 animate-in fade-in duration-300 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Development Reports Generator</h2>
            <p className="text-xs text-slate-600 mt-1">
              Generate professional, printable child development reports in PDF format.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <CustomSelect
              value={selectedChildId}
              onChange={setSelectedChildId}
              options={childrenList.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.grade})`
              }))}
              className="w-full sm:w-60"
              buttonClassName="py-2 text-xs font-semibold"
              aria-label="Select child for report"
            />

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-brand-primary hover:bg-[#0a2d38] text-white font-bold text-xs rounded-lg shadow-md transition-colors inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Download className="w-4 h-4" /> Generate PDF
            </button>
          </div>
        </div>
      </div>

      {/* Professional Report Document */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg">
        
        {/* Print Area - Professional Report */}
        <div className="p-8 lg:p-12 space-y-8">
          
          {/* Header with Logo */}
          <div className="space-y-6 border-b-2 border-brand-primary pb-8">
            <div className="flex items-start justify-between gap-6">
              {/* Logo and Branding */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 pt-1">
                  <img
                    src="/tumaini-logo.svg"
                    alt="Tumaini Children's Village"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-brand-primary tracking-tight">
                    TUMAINI
                  </h1>
                  <h2 className="text-lg font-bold text-slate-900 -mt-1">
                    CHILDREN'S VILLAGE
                  </h2>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mt-2">
                    Child Development Tracking System
                  </p>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
                    Official Progress Report
                  </p>
                </div>
              </div>

              {/* Report Metadata */}
              <div className="text-right space-y-1">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Term</p>
                  <p className="text-sm font-bold text-brand-primary">Term 3, 2026</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Report Date</p>
                  <p className="text-sm font-bold text-slate-900">October 23, 2026</p>
                </div>
              </div>
            </div>

            {/* Decorative Line */}
            <div className="h-px bg-gradient-to-r from-brand-primary via-brand-primary-light to-transparent" />
          </div>

          {/* Child Profile Card */}
          <div className="bg-gradient-to-br from-brand-primary-light to-slate-50 rounded-lg border border-brand-primary-light p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Child Profile</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="border-r border-slate-300 pr-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Child Name</p>
                <p className="text-sm font-bold text-slate-900">{child.name}</p>
              </div>
              <div className="border-r border-slate-300 pr-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Age / Grade</p>
                <p className="text-sm font-bold text-slate-900">{child.age} yrs | {child.grade}</p>
              </div>
              <div className="border-r border-slate-300 pr-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">House Assignment</p>
                <p className="text-sm font-bold text-slate-900">{child.cottage}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Assigned Mentor</p>
                <p className="text-sm font-bold text-slate-900">{child.mentor}</p>
              </div>
            </div>
          </div>

          {/* Personal Statement */}
          <div className="bg-brand-primary-light/50 border-l-4 border-brand-primary rounded-lg p-5 space-y-2">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Personal Statement</p>
            <p className="text-sm italic text-slate-800 font-medium leading-relaxed">
              "{child.personalStatement}"
            </p>
          </div>

          {/* Competency Assessment Table */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
                Curriculum Area Assessments
              </h3>
              <p className="text-xs text-slate-600">Progress levels and competency evaluations across all development areas</p>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-primary text-white">
                    <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wide">Curriculum Area</th>
                    <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wide">Progress Level</th>
                    <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wide">Assessment Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {competencies.map((comp, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                    >
                      <td className="px-5 py-4 font-semibold text-sm text-slate-900">
                        {comp.area}
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                            {comp.level}
                          </p>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-brand-primary rounded-full h-2 transition-all"
                              style={{ width: `${comp.percentage}%` }}
                            />
                          </div>
                          <p className="text-xs font-semibold text-slate-700">{comp.percentage}%</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-700 leading-relaxed">
                        {comp.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-slate-200">
            {/* Strengths */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Key Strengths</h4>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    <strong>{child.keyStrength}:</strong> Demonstrates exceptional ability in this area with consistent performance.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-1">•</span>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    Peer Mentorship: Shows eagerness to assist and guide younger children in various activities.
                  </p>
                </div>
              </div>
            </div>

            {/* Development Targets */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Active Development Targets</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                {(child.goals || []).map((goal, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <p className="text-sm text-slate-800">
                      <strong>{goal.title}:</strong> Target completion {new Date(goal.targetDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} ({goal.progress}% progress)
                    </p>
                  </div>
                ))}
                {(!child.goals || child.goals.length === 0) && (
                  <p className="text-sm text-slate-600 italic">No development targets recorded.</p>
                )}
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="pt-12 border-t-2 border-slate-200 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Mentor Signature */}
              <div className="space-y-3">
                <div className="border-b-2 border-slate-400 h-12 flex items-end pb-1">
                  <span className="text-slate-400 text-[10px] font-semibold">_________________________</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{child.mentor}</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Assigned Mentor</p>
                </div>
              </div>

              {/* Director Signature */}
              <div className="space-y-3 text-right">
                <div className="border-b-2 border-slate-400 h-12 flex items-end justify-end pb-1">
                  <span className="text-slate-400 text-[10px] font-semibold">_________________________</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Sarah Johnson</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Head Mentor & Director</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-4 text-center space-y-1">
              <p className="text-[10px] text-slate-500 font-semibold">
                TUMAINI CHILDREN'S VILLAGE | Child Development Tracking System
              </p>
              <p className="text-[10px] text-slate-400">
                This report is confidential and for authorized personnel only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
