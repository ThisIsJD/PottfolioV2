import React from 'react';

/**
 * SkillCategory — a column of skills under a category header.
 * Props: category (string), skills (array of strings)
 */
const SkillCategory = ({ category, skills = [] }) => {
  return (
    <div>
      <h3
        className="font-mono text-sm font-medium tracking-wider uppercase mb-4"
        style={{ color: 'var(--accent)' }}
      >
        {category}
      </h3>
      <ul className="space-y-2.5">
        {skills.map((skill) => (
          <li
            key={skill}
            className="flex items-center gap-3 text-sm transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            <span
              className="w-1 h-1 rounded-full shrink-0"
              style={{ background: 'var(--accent)' }}
            />
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillCategory;
