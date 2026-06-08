import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

/**
 * CursorTrail — Dynamic themed custom cursor.
 *
 * Dark Mode: A stylized rocket that orients to mouse movement direction,
 *   with speed-sensitive flame exhaust (no flame = stopped, small = slow, turbo = fast).
 *   Hover effect: scale up + electric glow aura.
 *
 * Light Mode: An animated atom with three orbital paths and revolving electrons.
 *   Hover effect: orbits expand + electrons speed up + nucleus pulses.
 *
 * - Disabled on touch devices (navigator.maxTouchPoints > 0)
 * - Single requestAnimationFrame loop; theme is read via ref (no restart on toggle)
 * - Cleans up on unmount
 */

// ─── Particle pool for rocket exhaust sparks ─────────────────────────────────
const MAX_PARTICLES = 60;

const CursorTrail = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    if (navigator.maxTouchPoints > 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ── State ──────────────────────────────────────────────────────────────────
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const smoothed = { x: mouse.x, y: mouse.y }; // lerped cursor for smooth rocket pos
    let prevSmoothed = { x: mouse.x, y: mouse.y };

    let visible = false;
    let isHovered = false;
    let animFrameId = null;

    // Speed tracking — smoothed exponential average
    let smoothSpeed = 0;

    // Rocket angle (persists between frames so it doesn't snap to 0 when stopped)
    let rocketAngle = -Math.PI / 2; // default pointing up
    let targetAngle = -Math.PI / 2;

    // Hover scale lerp
    let hoverScale = 1;

    // Atom hover scale lerp
    let atomScale = 1;
    let atomSpeedMult = 1;
    let nucleusPulse = 0;

    // Electron orbit phases
    const electronPhases = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];

    // Exhaust particles (dark mode hover)
    const particles = [];

    // Time counter for animation
    let t = 0;

    // ── Canvas resize ──────────────────────────────────────────────────────────
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ── Mouse tracking ─────────────────────────────────────────────────────────
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      visible = true;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Hover detection (buttons, links, interactive elements) ─────────────────
    const onMouseOver = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, label, select, textarea, [tabindex]');
      if (el) isHovered = true;
    };
    const onMouseOut = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, label, select, textarea, [tabindex]');
      if (el) isHovered = false;
    };
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    // ── Helpers ────────────────────────────────────────────────────────────────
    const lerp = (a, b, f) => a + (b - a) * f;

    // Angle lerp (takes shortest path around the circle)
    const lerpAngle = (a, b, f) => {
      let diff = b - a;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      return a + diff * f;
    };

    // Spawn an exhaust spark particle
    const spawnParticle = (x, y, angle, forceMultiplier = 1) => {
      if (particles.length >= MAX_PARTICLES) return;
      const spread = (Math.random() - 0.5) * 0.7;
      const speed = (2 + Math.random() * 3.5) * forceMultiplier;
      const colorType = Math.random() > 0.45 ? 'cyan' : 'blue';
      particles.push({
        x,
        y,
        vx: Math.cos(angle + Math.PI + spread) * speed,
        vy: Math.sin(angle + Math.PI + spread) * speed,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.015,
        size: 2.0 + Math.random() * 3.0,
        colorType
      });
    };

    // ── Rocket drawing ─────────────────────────────────────────────────────────
    const drawRocket = (cx, cy, angle, speed, scale, hovered) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + Math.PI / 2); // offset so 0° = right matches atan2
      ctx.scale(scale, scale);

      // ── Glowing Aura Behind Rocket ───────────────────────────────────────────
      if (hovered || speed > 1.5) {
        ctx.save();
        const auraRadius = hovered ? 32 : 18;
        const auraOpacity = hovered ? 0.38 : 0.16;
        const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, auraRadius);
        glowGrad.addColorStop(0, `rgba(59, 130, 246, ${auraOpacity})`);
        glowGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── Flame ────────────────────────────────────────────────────────────────
      const flameLen = Math.min(speed * 2.2, 36);
      const flameFlicker = 1 + Math.sin(t * 0.45) * 0.15 + Math.cos(t * 0.7) * 0.08;

      if (flameLen > 0.5) {
        const actualFlame = flameLen * flameFlicker;
        // Outer flame
        const outerGrad = ctx.createLinearGradient(0, 10, 0, 10 + actualFlame + 8);
        outerGrad.addColorStop(0, 'rgba(255, 120, 20, 0.9)');
        outerGrad.addColorStop(0.4, 'rgba(255, 60, 10, 0.6)');
        outerGrad.addColorStop(1, 'rgba(255, 30, 0, 0)');
        ctx.beginPath();
        ctx.moveTo(-5, 10);
        ctx.quadraticCurveTo(0, 10 + actualFlame + 8, 5, 10);
        ctx.fillStyle = outerGrad;
        ctx.fill();

        // Inner bright core
        const innerGrad = ctx.createLinearGradient(0, 10, 0, 10 + actualFlame * 0.6);
        innerGrad.addColorStop(0, 'rgba(255, 240, 150, 1)');
        innerGrad.addColorStop(0.5, 'rgba(255, 160, 30, 0.8)');
        innerGrad.addColorStop(1, 'rgba(255, 80, 0, 0)');
        ctx.beginPath();
        ctx.moveTo(-2.5, 10);
        ctx.quadraticCurveTo(0, 10 + actualFlame * 0.8, 2.5, 10);
        ctx.fillStyle = innerGrad;
        ctx.fill();
      }

      // ── Body (fuselage) ───────────────────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(0, -14);         // nose tip
      ctx.bezierCurveTo(6, -4, 6, 4, 5, 10);   // right side
      ctx.lineTo(-5, 10);                         // nozzle bottom
      ctx.bezierCurveTo(-6, 4, -6, -4, 0, -14); // left side
      ctx.closePath();

      const bodyGrad = ctx.createLinearGradient(-6, -14, 6, 10);
      bodyGrad.addColorStop(0, '#e2e8f0'); // metallic light top
      bodyGrad.addColorStop(0.5, '#94a3b8'); // steel gray middle
      bodyGrad.addColorStop(1, '#475569'); // slate dark tail
      ctx.fillStyle = bodyGrad;

      ctx.save();
      ctx.shadowBlur = hovered ? 28 : 14;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.95)';
      ctx.fill();
      ctx.restore();

      // ── Wings (delta fins) ────────────────────────────────────────────────────
      // Left wing
      ctx.beginPath();
      ctx.moveTo(-5, 5);
      ctx.lineTo(-13, 12);
      ctx.lineTo(-5, 10);
      ctx.closePath();
      ctx.fillStyle = '#3b82f6';
      ctx.fill();

      // Right wing
      ctx.beginPath();
      ctx.moveTo(5, 5);
      ctx.lineTo(13, 12);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.fillStyle = '#3b82f6';
      ctx.fill();

      // ── Cockpit glass ─────────────────────────────────────────────────────────
      ctx.beginPath();
      ctx.ellipse(0, -5, 3, 4.5, 0, 0, Math.PI * 2);
      const glassGrad = ctx.createRadialGradient(-1, -6.5, 0.5, 0, -5, 4);
      glassGrad.addColorStop(0, 'rgba(180, 240, 255, 0.95)');
      glassGrad.addColorStop(0.6, 'rgba(80, 180, 255, 0.7)');
      glassGrad.addColorStop(1, 'rgba(30, 100, 200, 0.4)');
      ctx.fillStyle = glassGrad;
      ctx.fill();

      // ── Nozzle ring ───────────────────────────────────────────────────────────
      ctx.beginPath();
      ctx.ellipse(0, 10, 5, 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      ctx.restore();
    };

    // ── Atom drawing ───────────────────────────────────────────────────────────
    const drawAtom = (cx, cy, scale, speedMult, hovered) => {
      ctx.save();
      ctx.translate(cx, cy);

      const orbitRx = 22 * scale;
      const orbitRy = 9 * scale;
      const nucleusR = hovered ? 5 + Math.sin(nucleusPulse) * 1.5 : 4;

      // ── 1. Soft Background Mask (Clears overlapping text/particles) ─────────
      const backdrop = ctx.createRadialGradient(0, 0, 0, 0, 0, orbitRx * 1.35);
      backdrop.addColorStop(0, 'rgba(240, 244, 255, 0.9)');
      backdrop.addColorStop(0.75, 'rgba(240, 244, 255, 0.55)');
      backdrop.addColorStop(1, 'rgba(240, 244, 255, 0)');
      ctx.fillStyle = backdrop;
      ctx.beginPath();
      ctx.arc(0, 0, orbitRx * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. Orbits (Ellipses rotated 0°, 60°, 120°) ───────────────────────────
      const orbitAngles = [0, Math.PI / 3, (Math.PI * 2) / 3];
      orbitAngles.forEach((rot) => {
        ctx.save();
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, orbitRx, orbitRy, 0, 0, Math.PI * 2);
        ctx.strokeStyle = hovered
          ? 'rgba(15, 23, 42, 0.85)'  // High visibility dark slate
          : 'rgba(15, 23, 42, 0.45)';
        ctx.lineWidth = hovered ? 1.75 : 1.25;
        ctx.stroke();
        ctx.restore();
      });

      // ── 3. Electrons ─────────────────────────────────────────────────────────
      const baseOrbitSpeed = 0.025 * speedMult;
      orbitAngles.forEach((rot, idx) => {
        electronPhases[idx] += baseOrbitSpeed;
        const ex = Math.cos(electronPhases[idx]) * orbitRx;
        const ey = Math.sin(electronPhases[idx]) * orbitRy;

        const cosR = Math.cos(rot);
        const sinR = Math.sin(rot);
        const rx = ex * cosR - ey * sinR;
        const ry = ex * sinR + ey * cosR;

        // White border under electron to pop
        ctx.beginPath();
        ctx.arc(rx, ry, hovered ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Dark electron core
        ctx.beginPath();
        ctx.arc(rx, ry, hovered ? 3.0 : 2.0, 0, Math.PI * 2);
        ctx.fillStyle = hovered ? '#1e3a8a' : '#1d4ed8';
        ctx.fill();
      });

      // ── 4. Nucleus ───────────────────────────────────────────────────────────
      // White outline for nucleus
      ctx.beginPath();
      ctx.arc(0, 0, nucleusR + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      const nucGrad = ctx.createRadialGradient(-0.8, -0.8, 0.3, 0, 0, nucleusR);
      nucGrad.addColorStop(0, '#60a5fa');
      nucGrad.addColorStop(0.6, '#1d4ed8');
      nucGrad.addColorStop(1, '#1e3a8a');
      ctx.beginPath();
      ctx.arc(0, 0, nucleusR, 0, Math.PI * 2);
      ctx.fillStyle = nucGrad;
      ctx.fill();

      ctx.restore();
    };

    // ── Main draw loop ─────────────────────────────────────────────────────────
    const draw = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!visible) {
        animFrameId = requestAnimationFrame(draw);
        return;
      }

      const isDark = themeRef.current === 'dark';

      // Smooth cursor position
      smoothed.x = lerp(smoothed.x, mouse.x, 0.18);
      smoothed.y = lerp(smoothed.y, mouse.y, 0.18);

      // Speed calculation from smoothed position delta
      const dx = smoothed.x - prevSmoothed.x;
      const dy = smoothed.y - prevSmoothed.y;
      const rawSpeed = Math.sqrt(dx * dx + dy * dy);
      smoothSpeed = lerp(smoothSpeed, rawSpeed, 0.15);

      // Update angle only when moving
      if (rawSpeed > 0.4) {
        targetAngle = Math.atan2(dy, dx);
      }
      rocketAngle = lerpAngle(rocketAngle, targetAngle, 0.12);

      prevSmoothed.x = smoothed.x;
      prevSmoothed.y = smoothed.y;

      if (isDark) {
        // ── DARK MODE: Rocket ──────────────────────────────────────────────────

        // Larger rocket: base scale 1.35x, hover scale 1.8x
        hoverScale = lerp(hoverScale, isHovered ? 1.8 : 1.35, 0.1);

        // Nozzle engine position in canvas coords
        const nozzleX = smoothed.x - 10 * hoverScale * Math.cos(rocketAngle);
        const nozzleY = smoothed.y - 10 * hoverScale * Math.sin(rocketAngle);

        // Spawn engine exhaust sparks
        // 1. Spawning from hover state
        if (isHovered && t % 2 === 0) {
          spawnParticle(nozzleX, nozzleY, rocketAngle, 0.85);
        }
        // 2. Spawning from high-speed movement (exhaust plume)
        if (smoothSpeed > 1.5) {
          const count = Math.min(Math.floor(smoothSpeed / 2.5) + 1, 4);
          for (let k = 0; k < count; k++) {
            spawnParticle(nozzleX, nozzleY, rocketAngle, 1.0 + (smoothSpeed * 0.04));
          }
        }

        // Update + draw particles with glowing shadows
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);

          // Intense glowing shadow setup
          ctx.shadowBlur = p.size * 3 * p.life;
          if (p.colorType === 'cyan') {
            ctx.fillStyle = `rgba(34, 211, 238, ${p.life * 0.95})`; // cyan-400
            ctx.shadowColor = 'rgba(34, 211, 238, 0.9)';
          } else {
            ctx.fillStyle = `rgba(59, 130, 246, ${p.life * 0.95})`; // blue-500
            ctx.shadowColor = 'rgba(59, 130, 246, 0.9)';
          }
          ctx.fill();
          ctx.restore();
        }

        drawRocket(smoothed.x, smoothed.y, rocketAngle, smoothSpeed, hoverScale, isHovered);

      } else {
        // ── LIGHT MODE: Atom ───────────────────────────────────────────────────

        // Larger scale: base 1.15x, hover scale 1.65x
        atomScale = lerp(atomScale, isHovered ? 1.65 : 1.15, 0.08);
        atomSpeedMult = lerp(atomSpeedMult, isHovered ? 3.5 : 1, 0.08);
        if (isHovered) nucleusPulse += 0.12;

        drawAtom(smoothed.x, smoothed.y, atomScale, atomSpeedMult, isHovered);
      }

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameId !== null) cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  if (navigator.maxTouchPoints > 0) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

export default CursorTrail;
