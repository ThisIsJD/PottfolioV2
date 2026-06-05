import React from 'react';
import SectionTag from '../ui/SectionTag';
import RevealWrapper from '../ui/RevealWrapper';
import SkillCategory from '../ui/SkillCategory';
import skills from '../../data/skills';

const Skills = () => {
  return (
    <section id="skills">
      <div className="section-container">
        <RevealWrapper>
          <SectionTag number="06" label="Skills" />
          <h2 className="font-syne font-bold text-3xl mb-8" style={{ color: 'var(--text)' }}>
            Technical Skills
          </h2>
        </RevealWrapper>

        <RevealWrapper delay={150}>
          <div
            className="grid gap-8"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
          >
            {skills.map((cat, i) => (
              <SkillCategory key={i} category={cat.category} skills={cat.skills} />
            ))}
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
};

export default Skills;
