import { useEffect, useRef, useState } from 'react';

/**
 * RevealWrapper — scroll-triggered entrance animation using IntersectionObserver.
 * Props: children, delay (optional ms for transition-delay)
 */
const RevealWrapper = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // Only animate once
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default RevealWrapper;
