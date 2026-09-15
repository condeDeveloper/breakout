// Bola
class Ball {
  constructor(x, y, vx, vy) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.stuck = false;    // presa na raquete aguardando lançamento
    this.fire = false;     // atravessa tijolos comuns
    this.trail = [];
  }

  static onPaddle(paddle) {
    const b = new Ball(paddle.cx, paddle.y - BALL_R - 1, 0, 0);
    b.stuck = true;
    return b;
  }

  get speed() { return Math.hypot(this.vx, this.vy); }

  launch() {
    const a = -Math.PI / 2 + (Math.random() * 0.8 - 0.4);
    this.vx = Math.cos(a) * BALL_SPEED; this.vy = Math.sin(a) * BALL_SPEED;
    this.stuck = false;
  }

  setSpeed(s) {
    const cur = this.speed || 1;
    this.vx *= s / cur; this.vy *= s / cur;
  }

  // Retorna 'lost' se caiu, 'wall' se bateu em parede/teto, senão null
  update(dt, paddle) {
    if (this.stuck) { this.x = paddle.cx; this.y = paddle.y - BALL_R - 1; return null; }
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 8) this.trail.shift();

    this.x += this.vx * dt; this.y += this.vy * dt;
    let ev = null;
    if (this.x - BALL_R < 0) { this.x = BALL_R; this.vx = Math.abs(this.vx); ev = 'wall'; }
    if (this.x + BALL_R > W) { this.x = W - BALL_R; this.vx = -Math.abs(this.vx); ev = 'wall'; }
    if (this.y - BALL_R < 0) { this.y = BALL_R; this.vy = Math.abs(this.vy); ev = 'wall'; }
    if (this.y - BALL_R > H) return 'lost';
    return ev;
  }

  // Colisão com a raquete: ângulo depende do ponto de impacto
  hitPaddle(paddle) {
    if (this.vy <= 0) return false;
    if (this.y + BALL_R < paddle.y || this.y - BALL_R > paddle.y + paddle.h) return false;
    if (this.x < paddle.x - BALL_R || this.x > paddle.x + paddle.w + BALL_R) return false;
    const rel = Math.max(-1, Math.min(1, (this.x - paddle.cx) / (paddle.w / 2)));
    const angle = -Math.PI / 2 + rel * (Math.PI / 3);
    const s = Math.min(BALL_MAX, this.speed * BALL_SPEED_UP);
    this.vx = Math.cos(angle) * s + paddle.vx * 0.1;
    this.vy = Math.sin(angle) * s;
    this.y = paddle.y - BALL_R;
    return true;
  }

  // Colisão AABB com um tijolo; reflete no eixo de menor penetração
  hitBrick(b) {
    const nx = Math.max(b.x, Math.min(this.x, b.x + b.w));
    const ny = Math.max(b.y, Math.min(this.y, b.y + b.h));
    const dx = this.x - nx, dy = this.y - ny;
    if (dx * dx + dy * dy > BALL_R * BALL_R) return false;
    if (this.fire && b.type !== 9) return true; // atravessa sem refletir
    if (Math.abs(dx) > Math.abs(dy)) { this.vx = dx > 0 ? Math.abs(this.vx) : -Math.abs(this.vx); }
    else { this.vy = dy > 0 ? Math.abs(this.vy) : -Math.abs(this.vy); }
    return true;
  }
}
