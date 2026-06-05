import React from 'react';
import SectionTag from '../ui/SectionTag';

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center">
      <div className="section-container">
        {/* Greeting tag */}
        <div className="animate-fade-up delay-100">
          <SectionTag number="00" label="Welcome" />
        </div>

        {/* Name */}
        <h1 className="font-syne font-extrabold text-5xl md:text-7xl leading-tight mb-4 animate-fade-up delay-200">
          <span className="gradient-text">John Daniel</span>
          <br />
          <span style={{ color: 'var(--text)' }}>Labing</span>
        </h1>

        {/* Role */}
        <p
          className="font-syne font-bold text-xl md:text-2xl mb-4 animate-fade-up delay-300"
          style={{ color: 'var(--muted2)' }}
        >
          Full-Stack Developer
        </p>

        {/* Description */}
        <p
          className="text-base md:text-lg max-w-lg mb-8 animate-fade-up delay-400"
          style={{ color: 'var(--muted)', lineHeight: '1.7' }}
        >
          3rd year CS student at the University of Nueva Ecija, building
          full-stack web and mobile applications. National hackathon champion
          and open to internship opportunities.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 animate-fade-up delay-500">
          <a href="#projects" className="btn-accent">
            View Projects
          </a>
          <a href="/resume.pdf" download className="btn-outline">
            Download Resume
          </a>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-3 animate-fade-up delay-600">
          {[
            '🏆 National Hackathon',
            '📍 Nueva Ecija, PH',
            '🎓 3rd Year CS',
            '🔍 Open to Internships',
          ].map((chip) => (
            <span
              key={chip}
              className="font-mono text-xs px-3 py-1.5 rounded-full"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--muted2)',
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
