/**
 * contributions.js — Mock GitHub contribution data for the snake game.
 *
 * Grid layout: 52 columns (weeks) × 7 rows (days, Sun=0 → Sat=6)
 * Derived from the user's real GitHub contribution screenshot (~163 contributions,
 * Jun 2024 – May 2025) with activity concentrated in Jun–Jul and Jan–May.
 *
 * Each cell: { level: 0–4 }
 *   0 = no contributions
 *   1 = 1–2 contributions (lightest green)
 *   2 = 3–5
 *   3 = 6–9
 *   4 = 10+ (darkest green)
 */

// ─── Hand-crafted grid matching the screenshot ───────────────────────────────
// Weeks 0–51 (left to right), rows 0–6 (Sun–Sat).
// Activity patterns observed:
//   - Weeks 0–8 (Jun–Jul): scattered medium activity
//   - Weeks 9–30 (Aug–Dec): very sparse
//   - Weeks 31–51 (Jan–May): concentrated activity, especially Mar–May

const MOCK_GRID = [
  // Week 0 (early Jun)
  [0, 0, 0, 1, 0, 1, 2],
  // Week 1
  [0, 1, 0, 1, 2, 0, 0],
  // Week 2
  [1, 0, 1, 0, 0, 1, 0],
  // Week 3
  [0, 2, 0, 0, 1, 0, 1],
  // Week 4 (late Jun)
  [2, 0, 1, 1, 0, 0, 0],
  // Week 5
  [0, 0, 3, 0, 0, 1, 0],
  // Week 6
  [0, 1, 0, 0, 2, 0, 0],
  // Week 7 (Jul)
  [1, 4, 0, 0, 0, 1, 0],
  // Week 8
  [0, 0, 1, 0, 0, 0, 1],
  // Week 9 (Aug) — sparse
  [0, 0, 0, 0, 0, 0, 0],
  // Week 10
  [0, 0, 0, 1, 0, 0, 0],
  // Week 11
  [0, 0, 0, 0, 0, 0, 0],
  // Week 12 (Sep)
  [0, 0, 0, 0, 0, 0, 0],
  // Week 13
  [0, 0, 0, 0, 1, 0, 0],
  // Week 14
  [0, 0, 0, 0, 0, 0, 0],
  // Week 15
  [0, 0, 0, 0, 0, 0, 0],
  // Week 16 (Oct)
  [0, 1, 0, 0, 0, 0, 0],
  // Week 17
  [0, 0, 0, 0, 0, 0, 0],
  // Week 18
  [0, 0, 0, 0, 0, 0, 0],
  // Week 19
  [0, 0, 0, 1, 0, 0, 0],
  // Week 20 (Nov)
  [0, 0, 0, 0, 0, 0, 0],
  // Week 21
  [0, 0, 0, 0, 0, 0, 0],
  // Week 22
  [0, 0, 0, 0, 0, 1, 0],
  // Week 23
  [0, 0, 0, 0, 0, 0, 0],
  // Week 24 (Dec)
  [0, 0, 0, 0, 0, 0, 0],
  // Week 25
  [0, 0, 0, 0, 0, 0, 0],
  // Week 26
  [0, 0, 0, 0, 1, 0, 0],
  // Week 27
  [0, 0, 0, 0, 0, 0, 0],
  // Week 28 (Jan) — activity resumes
  [0, 0, 0, 0, 0, 1, 0],
  // Week 29
  [0, 0, 1, 0, 0, 0, 0],
  // Week 30
  [0, 1, 0, 0, 0, 0, 1],
  // Week 31
  [0, 0, 0, 1, 0, 1, 0],
  // Week 32 (Feb)
  [0, 1, 0, 0, 1, 0, 0],
  // Week 33
  [1, 0, 0, 1, 0, 0, 1],
  // Week 34
  [0, 0, 1, 0, 0, 1, 0],
  // Week 35
  [0, 1, 0, 1, 3, 0, 0],
  // Week 36 (Mar)
  [1, 0, 0, 0, 0, 1, 0],
  // Week 37
  [0, 3, 0, 0, 1, 0, 0],
  // Week 38
  [0, 0, 1, 2, 0, 0, 1],
  // Week 39
  [1, 1, 0, 0, 0, 1, 2],
  // Week 40 (Apr)
  [0, 2, 1, 0, 1, 0, 0],
  // Week 41
  [1, 1, 0, 1, 2, 1, 0],
  // Week 42
  [0, 2, 1, 1, 0, 1, 1],
  // Week 43
  [1, 1, 2, 0, 1, 1, 0],
  // Week 44 (late Apr)
  [0, 1, 0, 2, 1, 0, 1],
  // Week 45 (May)
  [1, 2, 1, 0, 1, 2, 0],
  // Week 46
  [0, 1, 2, 1, 0, 1, 1],
  // Week 47
  [1, 0, 1, 1, 2, 1, 0],
  // Week 48
  [0, 1, 0, 1, 1, 0, 1],
  // Week 49
  [1, 1, 1, 0, 1, 1, 0],
  // Week 50
  [0, 1, 0, 1, 0, 1, 1],
  // Week 51
  [1, 0, 0, 1, 1, 0, 0],
];

/**
 * Returns the hand-crafted mock grid as an array of 52 week-columns,
 * each containing 7 day-objects with { level }.
 */
export function getMockGrid() {
  return MOCK_GRID.map((week) =>
    week.map((level) => ({ level }))
  );
}

/**
 * Generates a random mock grid (52×7) with a realistic contribution distribution.
 * Useful as a secondary fallback.
 */
export function generateMockGrid() {
  const grid = [];
  for (let w = 0; w < 52; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const r = Math.random();
      let level;
      if (r < 0.45) level = 0;
      else if (r < 0.65) level = 1;
      else if (r < 0.80) level = 2;
      else if (r < 0.92) level = 3;
      else level = 4;
      week.push({ level });
    }
    grid.push(week);
  }
  return grid;
}
