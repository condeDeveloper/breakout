// Tijolos: construção a partir do mapa do nível e contagem dos destrutíveis
function buildBricks(map) {
  const bricks = [];
  map.forEach((row, r) => {
    for (let c = 0; c < BRICK_COLS; c++) {
      const ch = row[c];
      if (!ch || ch === '.') continue;
      const type = Number(ch);
      const def = BRICK_TYPES[type];
      if (!def) continue;
      bricks.push({
        x: BRICK_GAP + c * (BRICK_W + BRICK_GAP),
        y: BRICK_TOP + r * (BRICK_H + BRICK_GAP),
        w: BRICK_W, h: BRICK_H,
        type, color: def.color, points: def.points,
        hits: def.hits, maxHits: def.hits,
        alive: true,
      });
    }
  });
  return bricks;
}

function breakableLeft(bricks) {
  return bricks.filter(b => b.alive && b.type !== 9).length;
}

// Aplica um golpe. Retorna pontos ganhos (0 se ainda não quebrou ou indestrutível).
function damageBrick(b, fire) {
  if (b.type === 9) return 0;
  b.hits = fire ? 0 : b.hits - 1;
  if (b.hits <= 0) { b.alive = false; return b.points; }
  return 0;
}
