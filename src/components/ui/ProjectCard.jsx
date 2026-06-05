import React, { useRef } from 'react';

/**
 * ProjectCard — project card with mouse-tracking radial glow effect.
 * Props: title, description, tags (array), badge, repoUrl, demoUrl
 */

const BADGE_STYLES = {
  hackathon: { bg: 'rgba(234,179,8,0.15)', color: '#eab308', label: '🏆 Hackathon' },
  capstone:  { bg: 'rgba(168,85,247,0.15)', color: '#a855f7', label: '🎓 Capstone' },
  'real client': { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', label: '🤝 Real Client' },
  personal:  { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', label: '⚡ Personal' },
};

const ProjectCard = ({ title, description, tags = [], badge, repoUrl, demoUrl }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  };

  const badgeInfo = badge ? BADGE_STYLES[badge] || null : null;

  return (
    <div
      ref={cardRef}
      className="glass-card relative overflow-hidden p-6 flex flex-col"
      onMouseMove={handleMouseMove}
      style={{ cursor: 'default' }}
    >
      {/* Mouse-tracking radial glow overlay */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), var(--glow), transparent 70%)',
        }}
      />

      {/* Badge (top-right) */}
      {badgeInfo && (
        <span
          className="absolute top-4 right-4 font-mono text-[10px] font-medium px-2 py-1 rounded-full"
          style={{ background: badgeInfo.bg, color: badgeInfo.color }}
        >
          {badgeInfo.label}
        </span>
      )}

      {/* Content */}
      <h3 className="font-syne font-bold text-lg mb-2 relative z-10" style={{ color: 'var(--text)' }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed mb-4 flex-1 relative z-10" style={{ color: 'var(--muted)' }}>
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4 relative z-10">
        {tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[11px] px-2 py-0.5 rounded"
            style={{
              background: 'rgba(59,130,246,0.1)',
              color: 'var(--accent)',
              border: '1px solid var(--border)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-3 relative z-10">
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-xs py-1.5 px-3"
          >
            GitHub →
          </a>
        )}
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent text-xs py-1.5 px-3"
          >
            Live Demo →
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
