// Estados, regras e loop
class Game {
  constructor() {
    this.ctx = document.getElementById('game').getContext('2d');
    this.el = {
      score: document.getElementById('score'), level: document.getElementById('level'),
      lives: document.getElementById('lives'), best: document.getElementById('best'),
      overlay: document.getElementById('overlay'),
    };
    this.best = Number(localStorage.getItem('breakout-best') || 0);
    this.paddle = new Paddle();
    this.particles = new Particles();
    this.state = 'ready'; // ready | playing | paused | over
    this.newGame();
    bindInput(this);
    this.last = performance.now();
    requestAnimationFrame(t => this.loop(t));
  }

  newGame() {
    this.score = 0; this.lives = LIVES; this.level = 0;
    this.loadLevel();
  }

  loadLevel() {
    this.bricks = buildBricks(levelMap(this.level));
    this.powerups = [];
    this.slowUntil = 0; this.fireUntil = 0;
    this.paddle.reset();
    this.balls = [Ball.onPaddle(this.paddle)];
    this.hud();
  }

  // Espaço / clique: começa, lança a bola ou continua
  primary() {
    if (this.state !== 'playing') return this.onAny();
    const stuck = this.balls.find(b => b.stuck);
    if (stuck) stuck.launch();
  }
  onAny() {
    if (this.state === 'ready') this.start();
    else if (this.state === 'over') { this.newGame(); this.start(); }
    else if (this.state === 'paused') this.start();
  }
  start() { this.state = 'playing'; this.el.overlay.classList.add('hidden'); }
  togglePause() {
    if (this.state === 'playing') { this.state = 'paused'; this.overlay('PAUSADO', 'Toque ou pressione uma tecla para continuar'); }
    else this.onAny();
  }

  update(dt, now) {
    this.paddle.update(dt, now);
    this.particles.update(dt);
    if (this.fireUntil && now > this.fireUntil) { this.fireUntil = 0; this.balls.forEach(b => { b.fire = false; }); }

    for (const ball of this.balls) {
      const ev = ball.update(dt, this.paddle);
      if (ev === 'wall') Sound.wall();
      if (ev === 'lost') { ball.lost = true; continue; }
      if (ball.hitPaddle(this.paddle)) Sound.paddle();

      for (const b of this.bricks) {
        if (!b.alive) continue;
        if (!ball.hitBrick(b)) continue;
        const pts = damageBrick(b, ball.fire);
        if (pts) {
          this.score += pts * (this.level + 1);
          this.particles.burst(b.x + b.w / 2, b.y + b.h / 2, b.color);
          Sound.brick(Math.floor((b.y - BRICK_TOP) / (BRICK_H + BRICK_GAP)));
          const pu = PowerUp.maybeDrop(b);
          if (pu) this.powerups.push(pu);
        } else {
          Sound.hard();
        }
        if (!ball.fire) break; // uma colisão por frame para bolas normais
      }
    }

    // bolas perdidas
    if (this.balls.some(b => b.lost)) {
      this.balls = this.balls.filter(b => !b.lost);
      if (!this.balls.length) return this.loseLife();
    }

    // power-ups
    for (const p of this.powerups) {
      p.update(dt);
      if (p.alive && p.caughtBy(this.paddle)) {
        p.alive = false;
        applyPowerUp(p.kind, this, now);
        Sound.power();
        this.hud();
      }
    }
    this.powerups = this.powerups.filter(p => p.alive);

    if (this.score > this.best) { this.best = this.score; localStorage.setItem('breakout-best', this.best); }
    this.hud();

    if (breakableLeft(this.bricks) === 0) this.nextLevel();
  }

  loseLife() {
    this.lives--;
    Sound.lose();
    this.hud();
    if (this.lives <= 0) return this.gameOver();
    this.paddle.reset();
    this.balls = [Ball.onPaddle(this.paddle)];
    this.fireUntil = 0; this.slowUntil = 0;
  }

  nextLevel() {
    this.level++;
    Sound.level();
    this.state = 'paused';
    this.loadLevel();
    this.overlay(`NÍVEL ${this.level + 1}`, `<span class="big">${this.score} pontos</span><br>Toque ou pressione uma tecla para continuar`);
  }

  gameOver() {
    this.state = 'over';
    Sound.over();
    this.overlay('GAME OVER', `<span class="big">${this.score} pontos</span><br>Chegou ao nível ${this.level + 1} · Toque para jogar de novo`);
  }

  loop(now) {
    const dt = Math.min(0.033, (now - this.last) / 1000);
    this.last = now;
    if (this.state === 'playing') this.update(dt, now);
    drawScene(this.ctx, this, now);
    requestAnimationFrame(t => this.loop(t));
  }

  hud() {
    this.el.score.textContent = this.score;
    this.el.level.textContent = this.level + 1;
    this.el.lives.textContent = '♥'.repeat(Math.max(0, this.lives));
    this.el.best.textContent = this.best;
  }
  overlay(title, html) {
    this.el.overlay.innerHTML = `<h1>${title}</h1><p>${html}</p>`;
    this.el.overlay.classList.remove('hidden');
  }
}

window.addEventListener('DOMContentLoaded', () => { window.game = new Game(); });
