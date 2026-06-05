import React from 'react';
import SectionTag from '../ui/SectionTag';
import RevealWrapper from '../ui/RevealWrapper';
import TimelineItem from '../ui/TimelineItem';

const Education = () => {
  return (
    <section id="education">
      <div className="section-container">
        <RevealWrapper>
          <SectionTag number="02" label="Education" />
          <h2 className="font-syne font-bold text-3xl mb-8" style={{ color: 'var(--text)' }}>
            Academic Background
          </h2>
        </RevealWrapper>

        <RevealWrapper delay={150}>
          <TimelineItem
            date="2023 — Present"
            title="University of Nueva Ecija"
            subtitle="Bachelor of Science in Computer Science"
            description="Studying core CS fundamentals including data structures, algorithms, operating systems, database management, and software engineering. Active participant in university coding events and hackathons."
            isLast={true}
          />
        </RevealWrapper>
      </div>
    </section>
  );
};

export default Education;
