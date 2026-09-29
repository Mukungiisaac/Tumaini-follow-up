import React from 'react';
import { SKILL_LEVELS } from '../../data/mockData';
import { Star } from 'lucide-react';

export default function SkillLevelBadge({ levelKey, showLabel = true, size = 'md', onClick }) {
  const levelInfo = SKILL_LEVELS[levelKey] || SKILL_LEVELS.NOT_INTRODUCED;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  }[size];

  return (
    <button
      type={onClick ? "button" : "span"}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border ${levelInfo.color} ${sizeClasses} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      title={levelInfo.label}
    >
      {levelKey === 'MASTERED' ? (
        <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-700 shrink-0" />
      ) : (
        <span className={`w-2 h-2 rounded-full ${levelInfo.dot} shrink-0`} />
      )}
      {showLabel && <span>{levelInfo.label}</span>}
    </button>
  );
}

