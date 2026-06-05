import React from 'react';

/**
 * SectionTag — renders a label like "01 — About"
 * Props: number (string), label (string)
 */
const SectionTag = ({ number, label }) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-8 h-[2px]"
        style={{ background: 'var(--accent)' }}
      />
      <span
        className="font-mono text-sm font-medium tracking-wider uppercase"
        style={{ color: 'var(--accent)' }}
      >
        {number} — {label}
      </span>
    </div>
  );
};

export default SectionTag;
