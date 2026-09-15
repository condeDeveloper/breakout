// Raquete
class Paddle {
  constructor() { this.reset(); }

  reset() {
    this.w = PADDLE_W; this.h = PADDLE_H;
    this.x = W / 2 - this.w / 2; this.y = PADDLE_Y;
    this.dir = 0; this.target = null; this.vx = 0;
    this.wideUntil = 0;
  }

  get cx() { return this.x + this.w / 2; }

  setWide(now) {
    this.wideUntil = now + POWERUP_DURATION;
    const cx = this.cx; this.w = PADDLE_WIDE; this.x = cx - this.w / 2;
  }

  update(dt, now) {
    const before = this.x;
    if (this.wideUntil && now > this.wideUntil) {
      const cx = this.cx; this.w = PADDLE_W; this.x = cx - this.w / 2; this.wideUntil = 0;
    }
    if (this.target !== null) {
      this.x = this.target - this.w / 2;
    } else {
      this.x += this.dir * PADDLE_SPEED * dt;
    }
    this.x = Math.max(0, Math.min(W - this.w, this.x));
    this.vx = dt > 0 ? (this.x - before) / dt : 0;
  }
}
