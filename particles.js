// particles.js — Particle system for visual effects
// All particles are drawn on-canvas using ctx.fillRect / ctx.font

const particles = [];

// ─── Spawn helpers ────────────────────────────────────────────────────────────

export function spawnHearts(canvasX, canvasY, count = 6) {
  for (let i = 0; i < count; i++) {
    particles.push({
      type: 'heart',
      x: canvasX + (Math.random() - 0.5) * 8,
      y: canvasY,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(0.8 + Math.random() * 1.2),
      life: 1.0,
      decay: 0.025 + Math.random() * 0.02,
      color: Math.random() < 0.5 ? '#ff4488' : '#ff88aa',
    });
  }
}

export function spawnBubbles(canvasX, canvasY, count = 12) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    particles.push({
      type: 'bubble',
      x: canvasX + (Math.random() - 0.5) * 12,
      y: canvasY + (Math.random() - 0.5) * 8,
      vx: Math.cos(angle) * (0.3 + Math.random() * 0.5),
      vy: -(0.5 + Math.random() * 0.8),
      life: 1.0,
      decay: 0.018 + Math.random() * 0.015,
      radius: 1 + Math.floor(Math.random() * 2),
    });
  }
}

export function spawnStars(canvasX, canvasY, count = 8) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    particles.push({
      type: 'star',
      x: canvasX,
      y: canvasY,
      vx: Math.cos(angle) * (0.8 + Math.random() * 0.8),
      vy: Math.sin(angle) * (0.8 + Math.random() * 0.8),
      life: 1.0,
      decay: 0.03 + Math.random() * 0.02,
      color: Math.random() < 0.5 ? '#ffdd00' : '#ffffff',
    });
  }
}

export function spawnZs(canvasX, canvasY) {
  particles.push({
    type: 'z',
    x: canvasX + (Math.random() - 0.5) * 6,
    y: canvasY,
    vx: 0.2 + Math.random() * 0.3,
    vy: -(0.4 + Math.random() * 0.4),
    life: 1.0,
    decay: 0.015,
    size: 1 + Math.floor(Math.random() * 2),
  });
}

export function spawnPoo(canvasX, canvasY) {
  particles.push({
    type: 'poo',
    x: canvasX,
    y: canvasY,
    vx: 0,
    vy: 1.2,
    life: 1.0,
    decay: 0.015,
    landed: false,
    landY: canvasY + 20,
  });
}

export function spawnPee(canvasX, canvasY, count = 4) {
  for (let i = 0; i < count; i++) {
    particles.push({
      type: 'pee',
      x: canvasX + i * 2,
      y: canvasY,
      vx: 0.3 + i * 0.1,
      vy: 0.8 + Math.random() * 0.4,
      life: 1.0,
      decay: 0.03,
      color: '#ffe066',
    });
  }
}

export function spawnChickenLeg(canvasX, canvasY) {
  particles.push({
    type: 'food',
    x: 155, // starts from right edge
    y: canvasY,
    vx: -3.5,
    vy: 0,
    life: 1.0,
    decay: 0,
    targetX: canvasX,
    emoji: '🍗',
    done: false,
  });
}

export function spawnSparkles(canvasX, canvasY, color = '#88ff88', count = 6) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    particles.push({
      type: 'sparkle',
      x: canvasX + (Math.random() - 0.5) * 10,
      y: canvasY + (Math.random() - 0.5) * 10,
      vx: Math.cos(angle) * 0.6,
      vy: Math.sin(angle) * 0.6 - 0.5,
      life: 1.0,
      decay: 0.025,
      color,
    });
  }
}

export function spawnSadParticles(canvasX, canvasY) {
  for (let i = 0; i < 4; i++) {
    particles.push({
      type: 'sad',
      x: canvasX + (Math.random() - 0.5) * 10,
      y: canvasY,
      vx: (Math.random() - 0.5) * 0.8,
      vy: 0.5 + Math.random() * 0.5,
      life: 1.0,
      decay: 0.02,
    });
  }
}

export function spawnFloatingText(canvasX, canvasY, text, color = '#ffffff') {
  particles.push({
    type: 'text',
    x: canvasX,
    y: canvasY,
    vx: 0,
    vy: -0.5,
    life: 1.0,
    decay: 0.015,
    text,
    color,
  });
}

// ─── Tick ─────────────────────────────────────────────────────────────────────
export function tickParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    if (p.type === 'food') {
      p.x += p.vx;
      if (p.x <= p.targetX) {
        p.done = true;
        particles.splice(i, 1);
        continue;
      }
    } else if (p.type === 'poo' && !p.landed) {
      p.y += p.vy;
      if (p.y >= p.landY) {
        p.landed = true;
        p.vy = 0;
        p.vx = 0;
      }
    } else {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
    }

    if (p.life <= 0) particles.splice(i, 1);
  }
}

// ─── Draw ─────────────────────────────────────────────────────────────────────
export function drawParticles(ctx) {
  for (const p of particles) {
    const alpha = Math.max(0, p.life);
    ctx.globalAlpha = alpha;

    switch (p.type) {
      case 'heart': {
        ctx.fillStyle = p.color;
        const s = Math.max(1, Math.floor(p.life * 3));
        ctx.fillRect(p.x, p.y, s, s);
        ctx.fillRect(p.x + s, p.y - s, s, s);
        ctx.fillRect(p.x - s, p.y - s, s, s);
        ctx.fillRect(p.x, p.y - s * 2, s, s);
        break;
      }
      case 'bubble': {
        const r = p.radius;
        ctx.fillStyle = '#aaddff';
        ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x - r + 1, p.y - r, 1, 1); // glint
        break;
      }
      case 'star': {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);
        ctx.fillRect(p.x - 1, p.y + 1, 1, 1);
        ctx.fillRect(p.x + 2, p.y + 1, 1, 1);
        break;
      }
      case 'z': {
        ctx.fillStyle = '#aaaaff';
        const sz = p.size;
        ctx.fillRect(p.x, p.y, sz * 3, sz);
        ctx.fillRect(p.x + sz * 2, p.y, sz, sz);
        ctx.fillRect(p.x + sz, p.y + sz, sz, sz);
        ctx.fillRect(p.x, p.y + sz * 2, sz, sz);
        ctx.fillRect(p.x, p.y + sz * 2, sz * 3, sz);
        break;
      }
      case 'poo': {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(p.x - 2, p.y, 6, 4);
        ctx.fillRect(p.x - 1, p.y - 2, 4, 3);
        ctx.fillRect(p.x, p.y - 4, 2, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x - 1, p.y + 1, 1, 1); // eyes
        ctx.fillRect(p.x + 2, p.y + 1, 1, 1);
        break;
      }
      case 'pee': {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 1, 3);
        ctx.fillRect(p.x, p.y + 2, 2, 1);
        break;
      }
      case 'food': {
        // Draw chicken leg as colored pixels (emoji fallback via font)
        ctx.font = '8px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('🍗', p.x - 4, p.y + 4);
        break;
      }
      case 'sparkle': {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 1, 1);
        ctx.fillRect(p.x + 1, p.y - 1, 1, 1);
        ctx.fillRect(p.x - 1, p.y + 1, 1, 1);
        break;
      }
      case 'sad': {
        ctx.fillStyle = '#88aaff';
        ctx.fillRect(p.x, p.y, 1, 2);
        ctx.fillRect(p.x, p.y + 2, 2, 1);
        break;
      }
      case 'text': {
        ctx.font = 'bold 6px sans-serif';
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x - p.text.length * 2, p.y);
        break;
      }
    }
  }
  ctx.globalAlpha = 1.0;
}

export function clearParticles() {
  particles.length = 0;
}
