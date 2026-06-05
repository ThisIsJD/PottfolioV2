import React from 'react';

/**
 * StatCard — glass card showing a stat value + label.
 * Props: label (string), value (string)
 */
const StatCard = ({ label, value }) => {
  return (
    <div className="glass-card p-5 text-center">
      <div
        className="font-syne font-bold text-2xl mb-1"
        style={{ color: 'var(--accent)' }}
      >
        {value}
      </div>
      <div
        className="font-mono text-xs tracking-wider uppercase"
        style={{ color: 'var(--muted)' }}
      >
        {label}
      </div>
    </div>
  );
};

export default StatCard;
