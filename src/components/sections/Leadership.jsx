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
            date="2024"
            title="National Hackathon — 1st Place"
            subtitle="Pataños — Pothole Reporting App"
            description="Led a team to build a mobile application for reporting road hazards in under 24 hours. The app featured real-time GPS mapping, photo uploads, and a community-driven prioritization system. Awarded 1st place among national-level participants."
            isLast={true}
          />
        </RevealWrapper>
      </div>
    </section>
  );
};

export default Leadership;
