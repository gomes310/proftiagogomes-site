export function confete() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('div');
  c.className = 'confete';
  const cores = ['#FFD84D', '#1E7A4C', '#172238', '#3B7BD9', '#E8590C'];
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.background = cores[i % cores.length];
    p.style.animationDelay = Math.random() * 0.6 + 's';
    c.appendChild(p);
  }
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 2600);
}
