/**
 * GalaxyField.jsx — Dark Mode Background
 *
 * 220 twinkling stars, 2 nebulae, and random shooting stars.
 * Exports: initGalaxyField(canvas, ctx) → returns cancel function
 */

const STAR_COUNT = 220;
const STAR_COLOR = '224, 231, 255'; // RGB for rgba()

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function initGalaxyField(canvas, ctx) {
  let animFrameId = null;
  const shootingStars = [];

  // Build star array
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: randomBetween(0.5, 2),
    twinkleSpeed: randomBetween(0.005, 0.025),
    twinklePhase: Math.random() * Math.PI * 2,
    baseOpacity: randomBetween(0.3, 0.85),
  }));

  // Draw the 2 static nebulae (painted once per frame as radial gradients)
  const nebulae = [
    { cx: 0.20, cy: 0.30, r: 0.30, color: '139, 92, 246', alpha: 0.06 },  // purple top-left
    { cx: 0.75, cy: 0.65, r: 0.28, color: '59, 130, 246', alpha: 0.05 },  // blue bottom-right
  ];

  function spawnShootingStar() {
    // Start in the top 45% of the canvas
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height * 0.45);
    shootingStars.push({ x, y, life: 70, maxLife: 70 });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw nebulae
    for (const neb of nebulae) {
      const cx = neb.cx * canvas.width;
      const cy = neb.cy * canvas.height;
      const r = neb.r * Math.min(canvas.width, canvas.height);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `rgba(${neb.color}, ${neb.alpha})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Draw stars (twinkling)
    for (const s of stars) {
      s.twinklePhase += s.twinkleSpeed;
      const opacity = s.baseOpacity + 0.3 * Math.sin(s.twinklePhase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${STAR_COLOR}, ${Math.max(0, Math.min(1, opacity))})`;
      ctx.fill();
    }

    // Maybe spawn a new shooting star (~1% chance per frame)
    if (Math.random() < 0.01) spawnShootingStar();

    // Draw and age shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      const progress = 1 - ss.life / ss.maxLife; // 0 → 1 as it ages
      const alpha = ss.life / ss.maxLife;         // fades out

      // Travel at 45° angle: dx=3, dy=3 per frame
      const tailLength = 80;
      const dx = tailLength * progress;
      const dy = tailLength * progress;

      const grad = ctx.createLinearGradient(
        ss.x + dx, ss.y + dy,     // head (current position)
        ss.x,       ss.y,         // tail (starting point)
      );
      grad.addColorStop(0, `rgba(147, 197, 253, ${alpha * 0.9})`);
      grad.addColorStop(1, 'rgba(147, 197, 253, 0)');

      ctx.beginPath();
      ctx.moveTo(ss.x + dx, ss.y + dy);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Advance position 45° each frame
      ss.x += 3;
      ss.y += 3;
      ss.life--;

      if (ss.life <= 0) shootingStars.splice(i, 1);
    }

    animFrameId = requestAnimationFrame(draw);
  }

  draw();

  return () => {
    if (animFrameId !== null) cancelAnimationFrame(animFrameId);
  };
}
