import React from 'react';
import SectionTag from '../ui/SectionTag';
import RevealWrapper from '../ui/RevealWrapper';
import CertCard from '../ui/CertCard';
import certifications from '../../data/certifications';

const Certifications = () => {
  return (
    <section id="certifications">
      <div className="section-container">
        <RevealWrapper>
          <SectionTag number="04" label="Certifications" />
          <h2 className="font-syne font-bold text-3xl mb-8" style={{ color: 'var(--text)' }}>
            Certifications & Courses
          </h2>
        </RevealWrapper>

        <RevealWrapper delay={150}>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}
          >
            {certifications.map((cert, i) => (
              <CertCard key={i} {...cert} />
            ))}
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
};

export default Certifications;
