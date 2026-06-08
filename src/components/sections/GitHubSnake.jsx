import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { useSnakeGame } from '../../hooks/useSnakeGame';
import { getMockGrid } from '../../data/contributions';

// ─── Contribution color maps (match GitHub's palette) ────────────────────────
const COLORS = {
  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
};

// ─── Canvas sizing ───────────────────────────────────────────────────────────
const COLS = 52;
const ROWS = 7;
const CELL_GAP = 3; // gap between cells
const CELL_RADIUS = 2; // rounded corner radius

// ─── Month labels for the top axis ───────────────────────────────────────────
const MONTH_LABELS = [
  { label: 'Jun', week: 0 },
  { label: 'Jul', week: 4 },
  { label: 'Aug', week: 9 },
  { label: 'Sep', week: 13 },
  { label: 'Oct', week: 17 },
  { label: 'Nov', week: 22 },
  { label: 'Dec', week: 26 },
  { label: 'Jan', week: 30 },
  { label: 'Feb', week: 35 },
  { label: 'Mar', week: 39 },
  { label: 'Apr', week: 43 },
  { label: 'May', week: 48 },
];

// Day labels for the left axis
const DAY_LABELS = [
  { label: 'Mon', row: 1 },
  { label: 'Wed', row: 3 },
  { label: 'Fri', row: 5 },
];

// ─── Fade-up animation variant ──────────────────────────────────────────────
const sectionFadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── GitHubSnake component ──────────────────────────────────────────────────
const GitHubSnake = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Load mock contribution data
  const [initialGrid] = useState(() => getMockGrid());

  const {
    grid,
    snake,
    score,
    running,
    gameOver,
    startGame,
    resetGame,
    setDirection,
  } = useSnakeGame(initialGrid);

  // ─── Calculate cell size from container width ──────────────────────────────
  const [cellSize, setCellSize] = useState(14);
  const LABEL_OFFSET_X = 32; // space for day labels on the left
  const LABEL_OFFSET_Y = 20; // space for month labels on top

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const availableWidth = containerWidth - LABEL_OFFSET_X - 8; // 8px padding
      const newCellSize = Math.max(
        8,
        Math.min(18, Math.floor((availableWidth - (COLS - 1) * CELL_GAP) / COLS))
      );
      setCellSize(newCellSize);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // ─── Canvas dimensions ─────────────────────────────────────────────────────
  const canvasWidth = LABEL_OFFSET_X + COLS * (cellSize + CELL_GAP) - CELL_GAP + 8;
  const canvasHeight = LABEL_OFFSET_Y + ROWS * (cellSize + CELL_GAP) - CELL_GAP + 8;

  // ─── Draw ──────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const colors = COLORS[theme] || COLORS.dark;
    const isDark = theme === 'dark';

    // ── Month labels ─────────────────────────────────────────────────────────
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = isDark
      ? 'rgba(148, 163, 184, 0.7)'
      : 'rgba(71, 85, 105, 0.7)';
    ctx.textBaseline = 'top';
    for (const { label, week } of MONTH_LABELS) {
      const x = LABEL_OFFSET_X + week * (cellSize + CELL_GAP);
      ctx.fillText(label, x, 2);
    }

    // ── Day labels ───────────────────────────────────────────────────────────
    ctx.textBaseline = 'middle';
    ctx.font = '9px "JetBrains Mono", monospace';
    for (const { label, row } of DAY_LABELS) {
      const y = LABEL_OFFSET_Y + row * (cellSize + CELL_GAP) + cellSize / 2;
      ctx.fillText(label, 0, y);
    }

    // ── Build snake lookup set for O(1) hit testing ──────────────────────────
    const snakeSet = new Set();
    const headKey = `${snake[0].c},${snake[0].r}`;
    for (const seg of snake) {
      snakeSet.add(`${seg.c},${seg.r}`);
    }

    // ── Draw grid cells ──────────────────────────────────────────────────────
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        const x = LABEL_OFFSET_X + c * (cellSize + CELL_GAP);
        const y = LABEL_OFFSET_Y + r * (cellSize + CELL_GAP);

        const key = `${c},${r}`;
        if (snakeSet.has(key)) continue; // drawn separately

        const level = grid[c]?.[r]?.level ?? 0;
        ctx.fillStyle = colors[level];
        roundRect(ctx, x, y, cellSize, cellSize, CELL_RADIUS);
      }
    }

    // ── Draw snake ───────────────────────────────────────────────────────────
    for (let i = snake.length - 1; i >= 0; i--) {
      const seg = snake[i];
      const x = LABEL_OFFSET_X + seg.c * (cellSize + CELL_GAP);
      const y = LABEL_OFFSET_Y + seg.r * (cellSize + CELL_GAP);

      const isHead = i === 0;
      const t = 1 - i / Math.max(snake.length - 1, 1); // 1 at head, 0 at tail

      if (isHead) {
        // Head: bright accent with glow
        ctx.save();
        const accentHex = isDark ? '#3b82f6' : '#2563eb';
        ctx.shadowColor = accentHex;
        ctx.shadowBlur = 12;
        ctx.fillStyle = accentHex;
        roundRect(ctx, x, y, cellSize, cellSize, CELL_RADIUS);
        ctx.restore();
      } else {
        // Body: gradient opacity from head to tail
        const alpha = 0.25 + 0.65 * t;
        ctx.fillStyle = isDark
          ? `rgba(59, 130, 246, ${alpha})`
          : `rgba(37, 99, 235, ${alpha})`;
        roundRect(ctx, x, y, cellSize, cellSize, CELL_RADIUS);
      }
    }

    // ── Overlays ─────────────────────────────────────────────────────────────
    if (!running && !gameOver) {
      // "Press Space / Start" overlay
      drawOverlay(ctx, canvasWidth, canvasHeight, isDark, 'Press Space to Start', null);
    } else if (gameOver) {
      // "Game Over" overlay
      drawOverlay(ctx, canvasWidth, canvasHeight, isDark, 'Game Over', `Score: ${score}`);
    }
  }, [grid, snake, running, gameOver, score, theme, cellSize, canvasWidth, canvasHeight]);

  // Redraw on every state change
  useEffect(() => {
    draw();
  }, [draw]);

  // ─── Keyboard controls ────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setDirection(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setDirection(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setDirection(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setDirection(1, 0);
          break;
        case ' ':
          e.preventDefault();
          if (!running) startGame();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setDirection, running, startGame]);

  // ─── Touch / swipe controls ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      const minSwipe = 20;

      if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) {
        // Tap — start/restart
        if (!running) startGame();
        return;
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        setDirection(dx > 0 ? 1 : -1, 0);
      } else {
        setDirection(0, dy > 0 ? 1 : -1);
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [running, startGame, setDirection]);

  // ─── Legend ────────────────────────────────────────────────────────────────
  const colors = COLORS[theme] || COLORS.dark;

  return (
    <section id="github" style={{ position: 'relative', zIndex: 1 }}>
      <div className="section-container">
        {/* ── Section header ─────────────────────────────────────────────── */}
        <motion.div
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          style={{ marginBottom: '2rem' }}
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
            07 — Contributions
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
            GitHub Activity
          </h2>
          <p
            style={{
              fontSize: '0.92rem',
              color: 'var(--muted)',
              marginTop: '0.75rem',
              maxWidth: '520px',
            }}
          >
            Navigate the snake to eat contribution cells. Use arrow keys or WASD
            to move. Swipe on mobile.
          </p>
        </motion.div>

        {/* ── Game container ─────────────────────────────────────────────── */}
        <motion.div
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          ref={containerRef}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: 'clamp(1rem, 3vw, 1.5rem)',
            overflow: 'hidden',
          }}
        >
          {/* ── Score row ───────────────────────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--muted)',
                  letterSpacing: '0.05em',
                }}
              >
                Score
              </span>
              <span
                className="font-syne"
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'var(--accent)',
                  minWidth: '3rem',
                }}
              >
                {score}
              </span>
            </div>

            {/* ── Controls ────────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={startGame}
                className="font-mono"
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  background: running ? 'transparent' : 'var(--accent)',
                  color: running ? 'var(--muted)' : '#fff',
                  border: `1px solid ${running ? 'var(--border)' : 'var(--accent)'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={(e) => {
                  if (!running) {
                    e.currentTarget.style.boxShadow = '0 0 16px var(--glow)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {gameOver ? '↺ Restart' : running ? '▶ Running' : '▶ Start'}
              </button>
              <button
                onClick={resetGame}
                className="font-mono"
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  background: 'transparent',
                  color: 'var(--muted)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                ↺ Reset
              </button>
            </div>
          </div>

          {/* ── Canvas ─────────────────────────────────────────────────── */}
          <div
            style={{
              width: '100%',
              overflowX: 'auto',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                display: 'block',
                borderRadius: '6px',
                minWidth: `${canvasWidth}px`,
              }}
              tabIndex={0}
              aria-label="GitHub Snake Game — use arrow keys to control the snake"
            />
          </div>

          {/* ── Legend + controls hint ───────────────────────────────── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            {/* Legend */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: '0.65rem',
                  color: 'var(--muted)',
                  marginRight: '0.25rem',
                }}
              >
                Less
              </span>
              {colors.map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: cellSize - 2,
                    height: cellSize - 2,
                    background: color,
                    borderRadius: '2px',
                  }}
                />
              ))}
              <span
                className="font-mono"
                style={{
                  fontSize: '0.65rem',
                  color: 'var(--muted)',
                  marginLeft: '0.25rem',
                }}
              >
                More
              </span>
            </div>

            {/* Controls hint */}
            <div
              className="font-mono"
              style={{
                fontSize: '0.65rem',
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  padding: '0.15rem 0.35rem',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                  fontSize: '0.6rem',
                }}
              >
                ←↑↓→
              </span>
              <span>or</span>
              <span
                style={{
                  padding: '0.15rem 0.35rem',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                  fontSize: '0.6rem',
                }}
              >
                WASD
              </span>
              <span>to move</span>
              <span
                style={{
                  padding: '0.15rem 0.35rem',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                  fontSize: '0.6rem',
                }}
              >
                Space
              </span>
              <span>to start</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Canvas helpers ──────────────────────────────────────────────────────────

/**
 * Draw a filled rounded rectangle.
 */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draw a semi-transparent overlay with centered text.
 */
function drawOverlay(ctx, w, h, isDark, title, subtitle) {
  ctx.save();
  ctx.fillStyle = isDark
    ? 'rgba(7, 11, 20, 0.75)'
    : 'rgba(240, 244, 255, 0.75)';
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Title
  ctx.font = 'bold 16px "Syne", sans-serif';
  ctx.fillStyle = isDark ? '#e2e8f0' : '#0f172a';
  ctx.fillText(title, w / 2, subtitle ? h / 2 - 10 : h / 2);

  // Subtitle
  if (subtitle) {
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillStyle = isDark ? '#3b82f6' : '#2563eb';
    ctx.fillText(subtitle, w / 2, h / 2 + 12);
  }

  ctx.restore();
}

export default GitHubSnake;
