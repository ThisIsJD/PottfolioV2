import React, { useState } from 'react';
import RevealWrapper from '../ui/RevealWrapper';
import SectionTag from '../ui/SectionTag';

// ─── Profile image placeholder ────────────────────────────────────────────────
// /* Replace src with actual photo path when ready */
// To swap in a real photo, replace ProfilePlaceholder with:
//   <img src="/your-photo.jpg" alt="John Daniel Labing" className="w-full h-full object-cover rounded-2xl" />
const ProfilePlaceholder = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl flex items-center justify-center overflow-hidden select-none"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        backdropFilter: 'blur(12px)',
        boxShadow: hovered ? '0 0 40px var(--glow)' : '0 0 0px transparent',
        transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
      }}
    >
      {/* Corner accents */}
      <span
        className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 rounded-tl"
        style={{ borderColor: 'var(--accent)' }}
      />
      <span
        className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 rounded-tr"
        style={{ borderColor: 'var(--accent)' }}
      />
      <span
        className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 rounded-bl"
        style={{ borderColor: 'var(--accent)' }}
      />
      <span
        className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 rounded-br"
        style={{ borderColor: 'var(--accent)' }}
      />

      {/* Initials */}
      <span
        className="font-syne font-extrabold"
        style={{
          fontSize: 'clamp(4rem, 12vw, 7rem)',
          color: 'var(--accent)',
          letterSpacing: '-0.03em',
          opacity: hovered ? 1 : 0.75,
          transition: 'opacity 0.35s ease',
        }}
      >
        JD
      </span>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.35,
        }}
      />
    </div>
  );
};

// ─── Recognition item ─────────────────────────────────────────────────────────
const Recognition = ({ icon, title, sub }) => (
  <div
    className="flex items-start gap-3 px-4 py-3 rounded-xl"
    style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      backdropFilter: 'blur(8px)',
    }}
  >
    <span className="text-xl leading-none mt-0.5" aria-hidden="true">
      {icon}
    </span>
    <div>
      <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text)' }}>
        {title}
      </p>
      <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
        {sub}
      </p>
    </div>
  </div>
);

// ─── About section ────────────────────────────────────────────────────────────
const About = () => {
  return (
    <section id="about">
      <div className="section-container">
        {/* Grid: image left, text right */}
        <div className="grid md:grid-cols-[1fr_1.35fr] gap-12 lg:gap-20 items-start">
          {/* ── Left: profile image ── */}
          <RevealWrapper delay={0}>
            <ProfilePlaceholder />
          </RevealWrapper>

          {/* ── Right: text content ── */}
          <div>
            {/* Section tag */}
            <RevealWrapper delay={80}>
              <SectionTag number="02" label="About" />
            </RevealWrapper>

            {/* Heading */}
            <RevealWrapper delay={160}>
              <h2
                className="font-syne font-bold mb-4 leading-tight"
                style={{ fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', color: 'var(--text)' }}
              >
                Who is JD?
              </h2>
            </RevealWrapper>

            {/* Name introduction */}
            <RevealWrapper delay={230}>
              <p
                className="text-base font-medium mb-5 leading-relaxed"
                style={{ color: 'var(--muted2)' }}
              >
                John Daniel Labing is a Full-Stack Developer and CS student at the{' '}
                <span style={{ color: 'var(--text)' }}>University of Nueva Caceres</span>.
              </p>
            </RevealWrapper>

            {/* Areas of focus */}
            <RevealWrapper delay={300}>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: 'var(--muted)' }}
              >
                His focus is deliberate: he is building toward{' '}
                <span style={{ color: 'var(--text)' }}>Full-Stack Web Development</span>,{' '}
                <span style={{ color: 'var(--text)' }}>Mobile Development</span>{' '}
                with React Native, and{' '}
                <span style={{ color: 'var(--text)' }}>AI integration</span> — not as
                checkboxes, but as a cohesive stack for shipping software that works in
                the real world.
              </p>
            </RevealWrapper>

            {/* Location */}
            <RevealWrapper delay={360}>
              <p
                className="font-mono text-xs mb-4 tracking-wide"
                style={{ color: 'var(--muted)' }}
              >
                📍 Based in{' '}
                <span style={{ color: 'var(--accent)' }}>
                  Naga City, Camarines Sur, Philippines
                </span>
              </p>
            </RevealWrapper>

            {/* Work approach */}
            <RevealWrapper delay={420}>
              <p
                className="text-sm leading-relaxed mb-7"
                style={{ color: 'var(--muted)' }}
              >
                JD holds himself to a clear standard: ship on time, ship with quality.
                He treats timelines as commitments — not suggestions — while keeping
                the bar for his own work high. That balance defines how he operates,
                whether working solo or as part of a team.
              </p>
            </RevealWrapper>

            {/* Recognition block */}
            <RevealWrapper delay={500}>
              <div className="flex flex-col gap-3">
                <Recognition
                  icon="🏆"
                  title="Top 5 Finalist — 1st Naga City Mayoral Hackathon"
                  sub="National Level Competition"
                />
                <Recognition
                  icon="📚"
                  title="Consistent Dean's Lister — GWA: 1.45"
                  sub="University of Nueva Caceres"
                />
              </div>
            </RevealWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
