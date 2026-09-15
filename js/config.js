// Constantes do jogo
const W = 640, H = 480;
const PADDLE_W = 96, PADDLE_H = 14, PADDLE_Y = H - 36, PADDLE_SPEED = 620;
const PADDLE_WIDE = 150;
const BALL_R = 6, BALL_SPEED = 330, BALL_SPEED_UP = 1.02, BALL_MAX = 620;
const BRICK_COLS = 12, BRICK_ROWS = 8, BRICK_TOP = 56, BRICK_H = 20, BRICK_GAP = 4;
const BRICK_W = (W - BRICK_GAP * (BRICK_COLS + 1)) / BRICK_COLS;
const LIVES = 3;
const POWERUP_CHANCE = 0.18;
const POWERUP_SPEED = 120;
const POWERUP_DURATION = 9000; // ms (raquete larga, lenta, fogo)

// Tipos de tijolo: cor, pontos e golpes necessários. 0 = vazio, 9 = indestrutível
const BRICK_TYPES = {
  1: { color: '#ef4444', points: 10, hits: 1 },
  2: { color: '#f97316', points: 20, hits: 1 },
  3: { color: '#facc15', points: 30, hits: 1 },
  4: { color: '#22c55e', points: 40, hits: 1 },
  5: { color: '#38bdf8', points: 50, hits: 1 },
  6: { color: '#a855f7', points: 60, hits: 2 },
  7: { color: '#e2e8f0', points: 100, hits: 3 },
  9: { color: '#475569', points: 0, hits: Infinity },
};

const POWERUPS = {
  wide:  { color: '#38bdf8', symbol: '⬌' },
  multi: { color: '#f472b6', symbol: '✚' },
  slow:  { color: '#a3e635', symbol: '◔' },
  life:  { color: '#fb7185', symbol: '♥' },
  fire:  { color: '#fbbf24', symbol: '⚡' },
};
