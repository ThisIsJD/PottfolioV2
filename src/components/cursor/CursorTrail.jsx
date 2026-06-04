import { useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

const TRAIL_COUNT = 14;
const HEAD_SIZE = 10;
const LERP = 0.38;

/**
 * CursorTrail — Canvas-based custom cursor with a glowing dot and a 14-segment trailing tail.
 *
 * - Disabled on touch devices (navigator.maxTouchPoints > 0)
 * - Runs a single requestAnimationFrame loop for zero layout thrashing
 * - Cleans up on unmount
 */
const CursorTrail = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    // Disable on touch devices
    if (navigator.maxTouchPoints > 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Mouse position (updated from event, read each frame)
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Trail dots: index 0 = closest to cursor head, index 13 = tail tip
    const trail = Array.from({ length: TRAIL_COUNT }, () => ({
      x: mouse.x,
      y: mouse.y,
    }));

    let animFrameId = null;
    let visible = false; // Don't draw until the mouse has moved at least once

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      visible = true;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!visible) {
        animFrameId = requestAnimationFrame(draw);
        return;
      }

      const isDark = themeRef.current === 'dark';
      const accentR = isDark ? 59  : 37;
      const accentG = isDark ? 130 : 99;
      const accentB = isDark ? 246 : 235;
      const glowColor = isDark
        ? 'rgba(59,130,246,0.5)'
        : 'rgba(37,99,235,0.4)';

      // Update trail: each dot lerps toward the one in front of it
      // trail[0] lerps toward the actual mouse position
      trail[0].x += (mouse.x - trail[0].x) * LERP;
      trail[0].y += (mouse.y - trail[0].y) * LERP;
      for (let i = 1; i < TRAIL_COUNT; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * LERP;
        trail[i].y += (trail[i - 1].y - trail[i].y) * LERP;
      }

      // Draw tail → head (back to front so head renders on top)
      for (let i = TRAIL_COUNT - 1; i >= 0; i--) {
        const t = i / TRAIL_COUNT; // 1 at tail, 0 at head
        const radius = Math.max(1, HEAD_SIZE * (1 - t * 0.8));
        const opacity = 0.8 * (1 - t);

        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentR},${accentG},${accentB},${opacity})`;
        ctx.fill();
      }

      // Draw main cursor dot (at actual mouse position, not lerped trail[0])
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, HEAD_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentR},${accentG},${accentB},1)`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = glowColor;
      ctx.fill();
      // Reset shadow so trail dots don't inherit it
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameId !== null) cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []); // Run once on mount; theme is read via themeRef to avoid restarting the loop

  // Don't render on touch devices at all
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
