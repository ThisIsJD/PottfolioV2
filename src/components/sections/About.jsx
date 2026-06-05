import React from 'react';
import SectionTag from '../ui/SectionTag';
import RevealWrapper from '../ui/RevealWrapper';
import StatCard from '../ui/StatCard';

const About = () => {
  return (
    <section id="about">
      <div className="section-container">
        <RevealWrapper>
          <SectionTag number="01" label="About" />
        </RevealWrapper>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Bio text */}
          <RevealWrapper delay={100}>
            <div>
              <h2 className="font-syne font-bold text-3xl mb-4" style={{ color: 'var(--text)' }}>
                A bit about me
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
                I'm a 3rd year Computer Science student at the University of Nueva Ecija with a
                passion for building software that solves real problems. I focus on full-stack web
                and mobile development using modern tools like React, Node.js, and cloud platforms.
              </p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
                In 2024, I won 1st place at a National Hackathon with Pataños — a pothole
                reporting mobile app built with React Native and MongoDB. That experience
                taught me how to ship fast under pressure while keeping code quality high.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                I'm currently looking for internship opportunities to apply my skills in
                a professional team environment. I love learning from other developers
                and contributing to impactful projects.
              </p>
            </div>
          </RevealWrapper>

          {/* Stat cards grid */}
          <RevealWrapper delay={250}>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Projects Deployed" value="4+" />
              <StatCard label="National Hackathon" value="1st 🏆" />
              <StatCard label="GWA" value="1.XX" />
              <StatCard label="Year" value="3rd Year" />
            </div>
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
};

export default About;
