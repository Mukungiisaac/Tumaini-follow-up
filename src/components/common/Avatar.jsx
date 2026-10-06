import React, { useState } from 'react';
import { useChildImageUrl } from '../../lib/childImages';

export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = useChildImageUrl(src);

  const getInitials = (n) => {
    if (!n) return '?';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-14 h-14 text-base'
  }[size] || 'w-10 h-10 text-xs';

  if (!imageUrl || imageError) {
    return (
      <div
        className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#0C3440] to-[#0C3440] text-white font-bold flex items-center justify-center shrink-0 shadow-xs border border-white/20 ${className}`}
        title={name}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      onError={() => setImageError(true)}
      className={`${sizeClasses} rounded-full object-cover shrink-0 ${className}`}
    />
  );
}

