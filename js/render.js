// Desenho da cena
function drawScene(ctx, g, now) {
  ctx.fillStyle = '#06061a';
  ctx.fillRect(0, 0, W, H);

  // tijolos
  for (const b of g.bricks) {
    if (!b.alive) continue;
    const dmg = b.maxHits === Infinity ? 1 : b.hits / b.maxHits;
    ctx.fillStyle = b.color;
    ctx.globalAlpha = 0.45 + 0.55 * dmg;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    ctx.fillRect(b.x, b.y, b.w, 3);
    if (b.type === 9) { // listras no indestrutível
      ctx.fillStyle = 'rgba(0,0,0,.25)';
      for (let x = b.x + 4; x < b.x + b.w; x += 10) ctx.fillRect(x, b.y, 4, b.h);
    } else if (b.maxHits > 1 && b.hits < b.maxHits) { // rachaduras
      ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(b.x + b.w * 0.3, b.y); ctx.lineTo(b.x + b.w * 0.5, b.y + b.h * 0.6); ctx.lineTo(b.x + b.w * 0.7, b.y + b.h); ctx.stroke();
    }
  }

  // power-ups
  for (const p of g.powerups) {
    ctx.save();
    ctx.shadowBlur = 12; ctx.shadowColor = p.def.color;
    ctx.fillStyle = p.def.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#06061a';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(p.def.symbol, p.x, p.y + 1);
  }

  g.particles.draw(ctx);

  // raquete
  const pd = g.paddle;
  const grad = ctx.createLinearGradient(pd.x, 0, pd.x + pd.w, 0);
  grad.addColorStop(0, '#0ea5e9'); grad.addColorStop(0.5, '#7dd3fc'); grad.addColorStop(1, '#0ea5e9');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.roundRect(pd.x, pd.y, pd.w, pd.h, 7); ctx.fill();
  if (pd.wideUntil) { ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.stroke(); }

  // bolas
  for (const b of g.balls) {
    b.trail.forEach((t, i) => {
      ctx.globalAlpha = (i / b.trail.length) * 0.3;
      ctx.fillStyle = b.fire ? '#fbbf24' : '#fff';
      ctx.beginPath(); ctx.arc(t.x, t.y, BALL_R * 0.8, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.shadowBlur = b.fire ? 18 : 8; ctx.shadowColor = b.fire ? '#f59e0b' : '#fff';
    ctx.fillStyle = b.fire ? '#fbbf24' : '#fff';
    ctx.beginPath(); ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // efeitos ativos
  const active = [];
  if (g.paddle.wideUntil) active.push(['wide', g.paddle.wideUntil]);
  if (g.slowUntil > now) active.push(['slow', g.slowUntil]);
  if (g.fireUntil > now) active.push(['fire', g.fireUntil]);
  active.forEach(([k, until], i) => {
    const frac = Math.max(0, (until - now) / POWERUP_DURATION);
    ctx.fillStyle = POWERUPS[k].color;
    ctx.fillRect(10 + i * 70, 10, 60 * frac, 4);
    ctx.globalAlpha = 0.3; ctx.fillRect(10 + i * 70, 10, 60, 4); ctx.globalAlpha = 1;
  });

  // dica de lançamento
  if (g.balls.some(b => b.stuck) && g.state === 'playing') {
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.font = '13px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Espaço ou toque para lançar', W / 2, H - 60);
  }
}
