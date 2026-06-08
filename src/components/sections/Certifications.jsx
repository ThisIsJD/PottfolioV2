import { useState } from 'react';
import { motion } from 'framer-motion';

// ─── Data ─────────────────────────────────────────────────────────────────────
const certGroups = [
  {
    issuer: 'Cisco',
    certs: [
      { name: 'JavaScript Essentials 1', year: 'Feb 2025' },
      { name: 'Networking Essentials', year: '2024' },
    ],
  },
  {
    issuer: 'LinkedIn Learning',
    certs: [
      { name: 'Software Engineering & Problem Solving Series (8 courses)', year: '2025' },
      { name: 'AI-Driven UX & Product Design Series (7 courses)', year: '2025' },
      { name: 'Programming Foundations: Algorithms', year: '2024' },
      { name: 'Java Object-Oriented Programming', year: '2024' },
    ],
  },
  {
    issuer: 'Google Cloud',
    certs: [
      { name: 'Google Workspace Tools', year: '2025' },
    ],
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const groupVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// ─── CertLine sub-component ───────────────────────────────────────────────────
const CertLine = ({ name, year }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '1.5rem',
        padding: '0.55rem 0',
        borderBottom: '1px solid var(--border)',
        cursor: 'default',
      }}
    >
      <motion.span
        className="font-dm-sans"
        animate={{ color: hovered ? 'var(--accent)' : 'var(--muted2)' }}
        transition={{ duration: 0.2 }}
        style={{
          fontSize: '0.88rem',
          fontWeight: 400,
          lineHeight: 1.45,
          flex: 1,
        }}
      >
        {name}
      </motion.span>

      <span
        className="font-mono"
        style={{
          fontSize: '0.72rem',
          color: 'var(--muted)',
          letterSpacing: '0.04em',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {year}
      </span>
    </div>
  );
};

// ─── IssuerGroup sub-component ────────────────────────────────────────────────
const IssuerGroup = ({ issuer, certs, index }) => (
  <motion.div
    variants={groupVariants}
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
  >
    {/* Issuer header */}
    <h3
      className="font-syne"
      style={{
        fontSize: '1rem',
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: '0.65rem',
        lineHeight: 1.2,
      }}
    >
      {issuer}
    </h3>

    {/* Divider */}
    <div
      style={{
        height: '1px',
        background: 'var(--border)',
        marginBottom: '0.1rem',
      }}
    />

    {/* Cert lines */}
    <div>
      {certs.map((cert) => (
        <CertLine key={cert.name} name={cert.name} year={cert.year} />
      ))}
    </div>
  </motion.div>
);

// ─── Certifications section ───────────────────────────────────────────────────
const Certifications = () => (
  <section id="certifications" style={{ position: 'relative', zIndex: 1 }}>
    <div className="section-container">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        style={{ marginBottom: '3rem' }}
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
          04 — Certifications
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
          Certifications &amp; Courses
        </h2>
      </motion.div>

      {/* ── Issuer groups grid ───────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3rem 4rem',
        }}
        className="certs-grid"
      >
        {certGroups.map((group, i) => (
          <IssuerGroup
            key={group.issuer}
            issuer={group.issuer}
            certs={group.certs}
            index={i}
          />
        ))}
      </div>

    </div>

    {/* ── Responsive override — 1 col on mobile ─────────────────────────────── */}
    <style>{`
      @media (max-width: 768px) {
        .certs-grid {
          grid-template-columns: 1fr !important;
          gap: 2.5rem !important;
        }
      }
    `}</style>
  </section>
);

export default Certifications;
