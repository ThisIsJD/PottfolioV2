import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

// ─── Scroll indicator — bouncing dot inside a mouse outline ──────────────────
const ScrollIndicator = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      aria-hidden="true"
    >
      {/* Mouse outline */}
      <div
        className="w-6 h-9 rounded-full border-2 flex justify-center pt-1.5"
        style={{ borderColor: 'var(--border-hover)' }}
      >
        {/* Scrolling dot */}
        <motion.div
          className="w-1 h-1.5 rounded-full"
          style={{ background: 'var(--accent)' }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <span
        className="font-mono text-[10px] tracking-widest uppercase"
        style={{ color: 'var(--muted)' }}
      >
        scroll
      </span>
    </motion.div>
  );
};

// ─── Framer Motion variants ───────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

// ─── Chips data ───────────────────────────────────────────────────────────────
const CHIPS = [
  '🏆 Hackathon Top 5 · National',
  "Dean's Lister · GWA 1.45",
  'Open to Internships',
  'Calabanga, Camarines Sur 🇵🇭',
];

// ─── Hero section ─────────────────────────────────────────────────────────────
const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="section-container w-full">
        {/* ── Greeting tag ── */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="font-mono text-sm mb-5 select-none"
          style={{ color: 'var(--accent)' }}
        >
          $ hello, world —
        </motion.p>

        {/* ── Full name ── */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.25}
          className="font-syne font-extrabold leading-[1.08] mb-6"
          style={{ fontSize: 'clamp(2.4rem, 5.95vw, 4.7rem)' }}
        >
          <span className="gradient-text">John Daniel</span>
          <br />
          <span style={{ color: 'var(--text)' }}>Labing.</span>
        </motion.h1>

        {/* ── Typewriter ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="font-syne font-bold mb-6"
          style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
            color: 'var(--muted2)',
          }}
        >
          <span>I&apos;m a </span>
          <TypeAnimation
            sequence={[
              800,
              'Full-Stack Developer',
              1800,
              '',
              400,
              'AI Enthusiast',
              1800,
              '',
              400,
              'Software Engineer',
              1800,
              '',
              400,
            ]}
            wrapper="span"
            speed={55}
            deletionSpeed={70}
            repeat={Infinity}
            cursor={true}
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--glow)',
              color: 'var(--text)',
              padding: '0.1em 0.45rem',
              borderRadius: '4px',
              border: '1px solid var(--border-hover)',
              marginLeft: '0.15rem',
            }}
          />
        </motion.div>

        {/* ── Supporting line ── */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
          className="text-base max-w-md mb-9 leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          A CS student at the University of Nueva Caceres who believes in <span className='gradient-text'>building things that matter</span> — currently seeking internship opportunities in software development.
        </motion.p>

        {/* ── CTA buttons ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.72}
          className="flex flex-wrap gap-4 mb-10"
        >
          <a
            id="hero-download-cv"
            href="/resume.pdf"
            download
            className="btn-accent"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7.5 10.5L3 6h3V1h3v5h3L7.5 10.5zM2 13h11v-1.5H2V13z"
                fill="currentColor"
              />
            </svg>
            Download CV
          </a>
          <a
            id="hero-get-in-touch"
            href="#contact"
            className="btn-outline"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* ── Chips ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.85}
          className="flex flex-wrap gap-2.5"
        >
          {/* {CHIPS.map((chip) => (
            <span
              key={chip}
              className="font-mono text-xs px-3 py-1.5 rounded-full select-none"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--muted2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {chip}
            </span>
          ))} */}
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <ScrollIndicator />
    </section>
  );
};

export default Hero;
