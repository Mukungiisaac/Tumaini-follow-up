import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  'aria-label': ariaLabel
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleOutsideClick = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' || typeof opt === 'number'
      ? { value: String(opt), label: String(opt) }
      : { value: String(opt.value), label: opt.label ?? String(opt.value) }
  );

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value).toLowerCase() === String(value).toLowerCase()
  );

  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <div ref={containerRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-slate-50 hover:bg-white border border-slate-200 focus:border-[#0C3440] rounded-xl text-sm font-medium text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#0C3440]/15 cursor-pointer shadow-2xs text-left ${buttonClassName}`}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0C3440]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-50 ${dropdownClassName}`}
        >
          {normalizedOptions.map((opt) => {
            const isSelected =
              String(opt.value).toLowerCase() === String(value).toLowerCase();
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#E8F0F0] text-[#0C3440] font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#0C3440] shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
