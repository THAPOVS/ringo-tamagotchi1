// renderer.js — Canvas rendering orchestration
// Canvas: 160×144 native, scaled 3× via CSS
// Rows 0–127: play area  |  Rows 128–143: UI strip

import { BACKGROUNDS } from './backgrounds.js';
import { SPRITES, drawSprite, SPRITE_W, SPRITE_H } from './sprites.js';
import { getClothingSprite } from './clothing.js';
import { drawParticles } from './particles.js';

const CANVAS_W = 160;
const CANVAS_H = 144;
const BG_H     = 128;

// Ringo center position on canvas
const RINGO_X  = Math.floor((CANVAS_W - SPRITE_W) / 2);  // = 64
const RINGO_Y  = Math.floor((BG_H - SPRITE_H) / 2) + 8;  // centered in bg area, slightly down

let ctx = null;

export function initRenderer(canvas) {
  ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
}

export function renderFrame(timestamp, state, anim) {
  if (!ctx) return;

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // ── Layer 0+1: Background ────────────────────────────────────────────────
  const bgDef = BACKGROUNDS[state.activeBackground] ?? BACKGROUNDS.park;
  bgDef.draw(ctx, state.scrollOffset, timestamp);

  // ── Layer 2: Ringo base sprite ───────────────────────────────────────────
  const frameKey = anim.tick(performance.now());
  const sprite = SPRITES[frameKey] ?? SPRITES.IDLE_0;
  drawSprite(ctx, sprite, RINGO_X, RINGO_Y, SPRITE_W, SPRITE_H);

  // Sick tint overlay (green tint on body area)
  if (state.mood === 'sick') {
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#66ff44';
    ctx.fillRect(RINGO_X + 4, RINGO_Y + 16, 24, 24);
    ctx.globalAlpha = 1.0;
  }

  // ── Layer 3: Clothing overlay ────────────────────────────────────────────
  const clothingSprite = getClothingSprite(state.activeClothing);
  if (clothingSprite) {
    drawSprite(ctx, clothingSprite, RINGO_X, RINGO_Y, SPRITE_W, SPRITE_H);
  }

  // ── Layer 4: Particles ───────────────────────────────────────────────────
  drawParticles(ctx);

  // ── Layer 5: UI strip (rows 128–143) ────────────────────────────────────
  drawUIStrip(ctx, state, timestamp);
}

function drawUIStrip(ctx, state, _ts) {
  const y = BG_H;
  const h = CANVAS_H - BG_H; // 16px

  // Background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, y, CANVAS_W, h);

  // Mood icon (left side)
  const moodEmoji = { happy: '😊', neutral: '😐', sad: '😢', sick: '🤒' }[state.mood] ?? '😐';
  ctx.font = '10px sans-serif';
  ctx.fillText(moodEmoji, 2, y + 11);

  // Mini stat bars (5 bars in 120px space, starting at x=18)
  const bars = [
    { v: state.stats.hunger,       color: '#ff8822', max: 100, inverted: false },
    { v: state.stats.happiness,    color: '#ff66aa', max: 100, inverted: false },
    { v: state.stats.cleanliness,  color: '#44ccaa', max: 100, inverted: false },
    { v: state.stats.energy,       color: '#aadd44', max: 100, inverted: false },
    { v: state.stats.bladder,      color: '#88ddff', max: 100, inverted: true  },
  ];

  const barW   = 20;
  const barH   = 4;
  const barGap = 4;
  let bx = 20;

  for (const bar of bars) {
    const pct = bar.inverted ? 1 - bar.v / bar.max : bar.v / bar.max;
    const fill = Math.round(pct * barW);
    const color = pct < 0.25 ? '#ff4444' : pct < 0.5 ? '#ffaa00' : bar.color;

    // Track
    ctx.fillStyle = '#333355';
    ctx.fillRect(bx, y + 6, barW, barH);
    // Fill
    ctx.fillStyle = color;
    ctx.fillRect(bx, y + 6, fill, barH);
    // Border
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx, y + 5, barW, 1);

    bx += barW + barGap;
  }

  // "RINGO" label
  ctx.font = 'bold 6px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('RINGO', CANVAS_W - 32, y + 8);

  // Sleeping indicator
  if (state.stats.sleeping) {
    ctx.font = '8px sans-serif';
    ctx.fillText('💤', CANVAS_W - 16, y + 14);
  }
}
