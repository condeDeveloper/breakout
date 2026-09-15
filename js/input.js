// Teclado, mouse e toque
function bindInput(g) {
  const canvas = document.getElementById('game');
  const keys = new Set();
  const applyKeys = () => {
    g.paddle.dir = (keys.has('ArrowRight') || keys.has('KeyD') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('KeyA') ? 1 : 0);
    if (g.paddle.dir !== 0) g.paddle.target = null;
  };

  window.addEventListener('keydown', e => {
    if (['ArrowLeft', 'ArrowRight', 'Space', 'KeyA', 'KeyD'].includes(e.code)) e.preventDefault();
    if (e.repeat) return;
    if (e.code === 'Space') return g.primary();
    if (e.code === 'KeyP' || e.code === 'Escape') return g.togglePause();
    keys.add(e.code); applyKeys();
    if (g.state !== 'playing') g.onAny();
  });
  window.addEventListener('keyup', e => { keys.delete(e.code); applyKeys(); });
  window.addEventListener('blur', () => { keys.clear(); applyKeys(); });

  const toX = e => { const r = canvas.getBoundingClientRect(); return (e.clientX - r.left) * (W / r.width); };
  canvas.addEventListener('mousemove', e => { g.paddle.target = toX(e); });
  canvas.addEventListener('mousedown', () => g.primary());
  canvas.addEventListener('touchstart', e => { e.preventDefault(); g.paddle.target = toX(e.touches[0]); g.primary(); }, { passive: false });
  canvas.addEventListener('touchmove', e => { e.preventDefault(); g.paddle.target = toX(e.touches[0]); }, { passive: false });

  document.getElementById('overlay').addEventListener('pointerdown', e => { e.preventDefault(); g.onAny(); });
}
