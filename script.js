// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Hero network graph ----------
const canvas = document.getElementById('netCanvas');
const ctx = canvas.getContext('2d');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let nodes = [];
let width, height;

function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  width = canvas.width = rect.width;
  height = canvas.height = rect.height;
  const count = Math.max(14, Math.round((width * height) / 14000));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
  }));
}

function step() {
  ctx.clearRect(0, 0, width, height);

  // move nodes
  if (!prefersReducedMotion) {
    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });
  }

  // draw links between nearby nodes
  const maxDist = Math.min(width, height) * 0.28;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = 1 - dist / maxDist;
        ctx.strokeStyle = `rgba(4, 156, 209, ${alpha * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // draw nodes
  nodes.forEach((n) => {
    ctx.fillStyle = 'rgba(234, 242, 248, 0.85)';
    ctx.beginPath();
    ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
    ctx.fill();
  });

  if (!prefersReducedMotion) {
    requestAnimationFrame(step);
  }
}

window.addEventListener('resize', () => {
  resize();
  if (prefersReducedMotion) step();
});

resize();
step();
