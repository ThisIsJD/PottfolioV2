import { useState } from 'react';
import { motion } from 'framer-motion';

// ─── Education data ───────────────────────────────────────────────────────────
const educationData = [
  {
    date: '2023 — Present',
    title: 'Bachelor of Science in Computer Science',
    institution: 'University of Nueva Caceres',
    details: "Consistent Dean's Lister · GWA: 1.45",
  },
  {
    date: '2020 — 2021',
    title: 'Senior High School',
    institution: 'Our Lady of La Porteria Academy',
    details: 'With Honors · STEM Strand',
  },
  {
    date: '2017 — 2020',
    title: 'Junior High School',
    institution: 'Sabang National High School',
    details: 'With High Honors · TLE: EIM',
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const sectionFadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const entryVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// ─── TimelineDot ──────────────────────────────────────────────────────────────
// Two-layer: outer handles spring entrance (scale 0→1), inner handles repeat pulse.
const TimelineDot = ({ index, hovered }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{
      delay: index * 0.15 + 0.12,
      type: 'spring',
      stiffness: 300,
      damping: 20,
    }}
    style={{
      position: 'absolute',
      // The dot column is 20px wide; center the dot on the 1px line
      // Line is at left: 9px (center of 20px column). Dot is 10px → left: 4px
      left: '4px',
      top: '3px',
      zIndex: 2,
    }}
  >
    <motion.div
      animate={{ scale: [1, 1.25, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 }}
      style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: 'var(--accent)',
        boxShadow: hovered
          ? '0 0 14px var(--accent), 0 0 28px var(--glow), 0 0 40px var(--glow)'
          : '0 0 10px var(--accent), 0 0 20px var(--glow)',
        transition: 'box-shadow 0.2s ease',
      }}
    />
  </motion.div>
);

// ─── EntryRow ─────────────────────────────────────────────────────────────────
const EntryRow = ({ entry, index, isLast }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={entryVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        display: 'flex',
        gap: '0',
        paddingBottom: isLast ? '0' : '3.5rem',
        cursor: 'default',
      }}
    >
      {/* ── Timeline column (dot lives here, anchored to the vertical line) ── */}
      <div style={{ width: '20px', flexShrink: 0, position: 'relative' }}>
        <TimelineDot index={index} hovered={hovered} />
      </div>

      {/* ── Date column ─────────────────────────────────────────────────────── */}
      <div
        style={{
          width: '116px',
          flexShrink: 0,
          paddingLeft: '12px',
          paddingTop: '1px',
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: '0.72rem',
            color: 'var(--accent)',
            letterSpacing: '0.08em',
            display: 'block',
            lineHeight: 1.4,
          }}
        >
          {entry.date}
        </span>
      </div>

      {/* ── Content column ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, paddingLeft: '1.5rem' }}>
        <motion.p
          className="font-syne"
          animate={{ color: hovered ? 'var(--accent)' : 'var(--text)' }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: '0.35rem',
          }}
        >
          {entry.title}
        </motion.p>

        <p
          className="font-dm-sans"
          style={{
            fontSize: '0.9rem',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--muted2)',
            marginBottom: '0.3rem',
            lineHeight: 1.5,
          }}
        >
          {entry.institution}
        </p>

        <p
          className="font-dm-sans"
          style={{
            fontSize: '0.82rem',
            fontWeight: 400,
            color: 'var(--muted)',
            lineHeight: 1.6,
          }}
        >
          {entry.details}
        </p>
      </div>
    </motion.div>
  );
};

// ─── Education section ────────────────────────────────────────────────────────
const Education = () => {
  return (
    <section id="education" style={{ position: 'relative', zIndex: 1 }}>
      <div className="section-container">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <motion.div
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          style={{ marginBottom: '3.5rem' }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: '0.78rem',
              color: 'var(--accent)',
              letterSpacing: '0.1em',
              marginBottom: '0.85rem',
            }}
          >
            02 — Education
          </p>
          <h2
            className="font-syne"
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--text)',
              lineHeight: 1.1,
            }}
          >
            Academic Background
          </h2>
        </motion.div>

        {/* ── Timeline entries container ──────────────────────────────────── */}
        <div style={{ position: 'relative' }}>

          {/* Vertical line — full height of the entries block.
              Centered on the 20px dot column: left = 9px (10px center of column - 0.5px line half) */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '9px',
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'var(--border)',
              zIndex: 0,
            }}
          />

          {educationData.map((entry, i) => (
            <EntryRow
              key={entry.date}
              entry={entry}
              index={i}
              isLast={i === educationData.length - 1}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Education;
