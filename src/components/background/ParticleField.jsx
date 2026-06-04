/**
 * ParticleField.jsx — Light Mode Background
 *
 * 85 floating particles connected by lines when within 130px of each other.
 * Exports: initParticleField(canvas, ctx) → returns cancel function
 */

const PARTICLE_COUNT = 85;
const CONNECTION_DISTANCE = 130;
const PARTICLE_COLOR = '37, 99, 235'; // RGB for rgba()

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function initParticleField(canvas, ctx) {
  let animFrameId = null;

  // Build particle array
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: randomBetween(1.5, 3),
    vx: randomBetween(-0.4, 0.4),
    vy: randomBetween(-0.4, 0.4),
    opacity: randomBetween(0.4, 0.8),
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update positions (toroidal wrap)
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    }

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${p.opacity})`;
      ctx.fill();
    }

    animFrameId = requestAnimationFrame(draw);
  }

  draw();

  return () => {
    if (animFrameId !== null) cancelAnimationFrame(animFrameId);
  };
}
