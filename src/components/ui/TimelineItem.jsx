import React from 'react';

/**
 * TimelineItem — vertical timeline entry with a glowing dot, used for Education & Leadership.
 * Props: date, title, subtitle, description, isLast (boolean)
 */
const TimelineItem = ({ date, title, subtitle, description, isLast = false }) => {
  return (
    <div className="relative flex gap-6 pb-10">
      {/* Vertical line + dot */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div
          className="w-3 h-3 rounded-full mt-1.5 shrink-0 animate-pulse-glow"
          style={{ background: 'var(--accent)' }}
        />
        {/* Line */}
        {!isLast && (
          <div
            className="w-[2px] flex-1 mt-2"
            style={{ background: 'var(--border)' }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 -mt-0.5">
        <span
          className="font-mono text-xs tracking-wider"
          style={{ color: 'var(--muted)' }}
        >
          {date}
        </span>
        <h3 className="font-syne font-bold text-lg mt-1" style={{ color: 'var(--text)' }}>
          {title}
        </h3>
        {subtitle && (
          <p className="italic text-sm mt-0.5" style={{ color: 'var(--muted2)' }}>
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;
