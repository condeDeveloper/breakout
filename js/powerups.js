// Power-ups que caem dos tijolos
class PowerUp {
  constructor(x, y, kind) {
    this.x = x; this.y = y; this.kind = kind; this.r = 11;
    this.def = POWERUPS[kind];
    this.alive = true;
  }

  static maybeDrop(brick) {
    if (Math.random() > POWERUP_CHANCE) return null;
    const kinds = Object.keys(POWERUPS);
    // vida extra é mais rara
    const pool = kinds.flatMap(k => k === 'life' ? [k] : [k, k, k]);
    return new PowerUp(brick.x + brick.w / 2, brick.y + brick.h / 2, pool[Math.floor(Math.random() * pool.length)]);
  }

  update(dt) {
    this.y += POWERUP_SPEED * dt;
    if (this.y - this.r > H) this.alive = false;
  }

  caughtBy(paddle) {
    return this.y + this.r >= paddle.y && this.y - this.r <= paddle.y + paddle.h &&
           this.x >= paddle.x - this.r && this.x <= paddle.x + paddle.w + this.r;
  }
}

// Aplica o efeito no estado do jogo
function applyPowerUp(kind, g, now) {
  switch (kind) {
    case 'wide': g.paddle.setWide(now); break;
    case 'life': g.lives = Math.min(6, g.lives + 1); break;
    case 'slow':
      g.slowUntil = now + POWERUP_DURATION;
      g.balls.forEach(b => { if (!b.stuck) b.setSpeed(Math.max(BALL_SPEED * 0.65, b.speed * 0.6)); });
      break;
    case 'fire':
      g.fireUntil = now + POWERUP_DURATION;
      g.balls.forEach(b => { b.fire = true; });
      break;
    case 'multi': {
      const src = g.balls.find(b => !b.stuck) || g.balls[0];
      for (const da of [-0.5, 0.5]) {
        const s = src.speed || BALL_SPEED;
        const a = Math.atan2(src.vy || -1, src.vx || 0) + da;
        const nb = new Ball(src.x, src.y, Math.cos(a) * s, Math.sin(a) * s);
        nb.fire = src.fire;
        g.balls.push(nb);
      }
      break;
    }
  }
}
