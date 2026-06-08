import React from 'react';
import SectionTag from '../ui/SectionTag';
import RevealWrapper from '../ui/RevealWrapper';
import TimelineItem from '../ui/TimelineItem';

const Leadership = () => {
  return (
    <section id="leadership">
      <div className="section-container">
        <RevealWrapper>
          <SectionTag number="03" label="Leadership" />
          <h2 className="font-syne font-bold text-3xl mb-8" style={{ color: 'var(--text)' }}>
            Competitions & Leadership
          </h2>
        </RevealWrapper>

        <RevealWrapper delay={150}>
          <TimelineItem
            date="2026"
            title="Top 5 Finalist — Naga City 1st Mayoral Hackaton"
            subtitle="IskulAid — Smart Scholarship Matching App"
            description="Developed a smart scholarship matching platform that uses AI to connect deserving students with relevant funding opportunities. The system analyzes academic profiles and personal circumstances to recommend scholarships, streamlining the application process for students and improving scholarship utilization for institutions."
            isLast={true}
          />
        </RevealWrapper>
      </div>
    </section>
  );
};

export default Leadership;
