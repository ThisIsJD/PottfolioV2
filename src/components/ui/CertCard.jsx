import React from 'react';

/**
 * CertCard — certification card showing issuer, name, and year.
 * Props: issuer, name, year
 */
const CertCard = ({ issuer, name, year }) => {
  return (
    <div
      className="glass-card p-5 transition-transform"
      style={{ cursor: 'default' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span
        className="font-mono text-xs font-medium tracking-wider uppercase block mb-2"
        style={{ color: 'var(--accent)' }}
      >
        {issuer}
      </span>
      <h3
        className="font-medium text-sm leading-snug"
        style={{ color: 'var(--text)' }}
      >
        {name}
      </h3>
      <span
        className="font-mono text-xs mt-2 block"
        style={{ color: 'var(--muted)' }}
      >
        {year}
      </span>
    </div>
  );
};

export default CertCard;
