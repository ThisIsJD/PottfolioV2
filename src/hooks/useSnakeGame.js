import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useSnakeGame — Core snake-game logic for the GitHub contribution grid.
 *
 * Grid dimensions: COLS × ROWS (52 × 7).
 * Movement wraps toroidally (goes through walls to the opposite side).
 * Food = any cell with level 1–4. Eating grows the snake and scores level×10.
 * Self-collision = game over.
 * Speed: 115ms per tick.
 */

const COLS = 52;
const ROWS = 7;
const TICK_MS = 115;

export function useSnakeGame(initialGrid) {
  // ─── State ────────────────────────────────────────────────────────────────────
  // grid: current state of contribution cells (cells eaten become level 0)
  const [grid, setGrid] = useState(() => deepClone(initialGrid));
  // snake: array of { c, r } segments (head is index 0)
  const [snake, setSnake] = useState(() => getInitialSnake());
  // direction: { dc, dr } — movement vector per tick
  const [dir, setDir] = useState({ dc: 1, dr: 0 });
  // score
  const [score, setScore] = useState(0);
  // game state
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // ─── Refs (for interval closure) ──────────────────────────────────────────────
  const snakeRef = useRef(snake);
  const dirRef = useRef(dir);
  const nextDirRef = useRef(null);
  const gridRef = useRef(grid);
  const scoreRef = useRef(score);
  const intervalRef = useRef(null);
  const initialGridRef = useRef(initialGrid);

  // Keep refs in sync
  snakeRef.current = snake;
  dirRef.current = dir;
  gridRef.current = grid;
  scoreRef.current = score;

  // Update initialGridRef if the prop changes (e.g., theme switching reloads data)
  useEffect(() => {
    initialGridRef.current = initialGrid;
  }, [initialGrid]);

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  function getInitialSnake() {
    // Start at roughly center-left of the grid, 3 segments long heading right
    const startC = 3;
    const startR = 3;
    return [
      { c: startC, r: startR },
      { c: startC - 1, r: startR },
      { c: startC - 2, r: startR },
    ];
  }

  function deepClone(g) {
    return g.map((week) => week.map((cell) => ({ ...cell })));
  }

  // ─── Step (one tick) ──────────────────────────────────────────────────────────
  const step = useCallback(() => {
    // Apply buffered direction change
    if (nextDirRef.current) {
      dirRef.current = nextDirRef.current;
      nextDirRef.current = null;
    }

    const currentSnake = snakeRef.current;
    const currentDir = dirRef.current;
    const currentGrid = gridRef.current;

    const head = currentSnake[0];
    // New head position (toroidal wrap)
    const newC = ((head.c + currentDir.dc) % COLS + COLS) % COLS;
    const newR = ((head.r + currentDir.dr) % ROWS + ROWS) % ROWS;

    // Self-collision check
    for (let i = 0; i < currentSnake.length; i++) {
      if (currentSnake[i].c === newC && currentSnake[i].r === newR) {
        // Game over
        setGameOver(true);
        setRunning(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }
    }

    const newHead = { c: newC, r: newR };
    const cellLevel = currentGrid[newC][newR].level;

    let newSnake;
    let newGrid = currentGrid;
    let newScore = scoreRef.current;

    if (cellLevel > 0) {
      // Food: grow (don't remove tail) and score
      newSnake = [newHead, ...currentSnake];
      newScore += cellLevel * 10;

      // Mark cell as eaten
      newGrid = currentGrid.map((week, wi) =>
        week.map((cell, di) => {
          if (wi === newC && di === newR) return { level: 0 };
          return cell;
        })
      );
    } else {
      // Empty: move (remove tail)
      newSnake = [newHead, ...currentSnake.slice(0, -1)];
    }

    // Batch state updates
    setSnake(newSnake);
    snakeRef.current = newSnake;
    setDir(dirRef.current);

    if (cellLevel > 0) {
      setGrid(newGrid);
      gridRef.current = newGrid;
      setScore(newScore);
      scoreRef.current = newScore;
    }
  }, []);

  // ─── Direction input ──────────────────────────────────────────────────────────
  const setDirection = useCallback((dc, dr) => {
    const currentDir = dirRef.current;
    // Prevent 180° reversal
    if (dc === -currentDir.dc && dr === -currentDir.dr) return;
    // Prevent setting same direction
    if (dc === currentDir.dc && dr === currentDir.dr) return;
    nextDirRef.current = { dc, dr };
  }, []);

  // ─── Start / restart ─────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const freshGrid = deepClone(initialGridRef.current);
    const freshSnake = getInitialSnake();

    setGrid(freshGrid);
    gridRef.current = freshGrid;
    setSnake(freshSnake);
    snakeRef.current = freshSnake;
    setDir({ dc: 1, dr: 0 });
    dirRef.current = { dc: 1, dr: 0 };
    nextDirRef.current = null;
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    setRunning(true);

    intervalRef.current = setInterval(step, TICK_MS);
  }, [step]);

  // ─── Reset (stop + restore) ──────────────────────────────────────────────────
  const resetGame = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const freshGrid = deepClone(initialGridRef.current);
    const freshSnake = getInitialSnake();

    setGrid(freshGrid);
    gridRef.current = freshGrid;
    setSnake(freshSnake);
    snakeRef.current = freshSnake;
    setDir({ dc: 1, dr: 0 });
    dirRef.current = { dc: 1, dr: 0 };
    nextDirRef.current = null;
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    setRunning(false);
  }, []);

  // ─── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    grid,
    snake,
    score,
    running,
    gameOver,
    startGame,
    resetGame,
    setDirection,
    cols: COLS,
    rows: ROWS,
  };
}
