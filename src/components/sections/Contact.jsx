import React from 'react';
import SectionTag from '../ui/SectionTag';
import RevealWrapper from '../ui/RevealWrapper';

const contactLinks = [
  {
    label: '✉ Email',
    href: 'mailto:johndaniel.labing@unc.edu.ph',
  },
  {
    label: '🔗 LinkedIn',
    href: 'https://linkedin.com/in/johndaniellabing',
  },
  {
    label: '🐙 GitHub',
    href: 'https://github.com/ThisIsJD',
  },
  {
    label: '📄 Resume',
    href: '/resume.pdf',
    download: true,
  },
];

const Contact = () => {
  return (
    <section id="contact">
      <div className="section-container text-center">
        <RevealWrapper>
          <SectionTag number="07" label="Contact" />
          <h2 className="font-syne font-bold text-3xl mb-3" style={{ color: 'var(--text)' }}>
            Let's Connect
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto" style={{ color: 'var(--muted)' }}>
            I'm always open to new opportunities, collaborations, and conversations.
            Feel free to reach out through any of the links below.
          </p>
        </RevealWrapper>

        <RevealWrapper delay={150}>
          <div className="flex flex-wrap justify-center gap-4">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.download ? undefined : '_blank'}
                rel={link.download ? undefined : 'noopener noreferrer'}
                download={link.download || undefined}
                className="font-mono text-sm px-5 py-3 rounded-lg transition-all"
                style={{
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                  e.currentTarget.style.boxShadow = '0 0 12px var(--glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
};

export default Contact;
