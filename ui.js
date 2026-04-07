// ui.js — HTML UI updates: stat bars, action buttons, alerts, selector thumbnails

import { INTERACTIONS, canActivate, getCooldownRemaining } from './interactions.js';
import { BACKGROUNDS } from './backgrounds.js';
import { CLOTHING } from './clothing.js';
import { CLOTHING_SPRITES, drawSprite, SPRITE_W, SPRITE_H } from './sprites.js';

const MOOD_MESSAGES = {
  happy:   ["Ringo is happy! 🐾", "What a good boy!", "Ringo loves you! 💕"],
  neutral: ["Ringo is okay.", "Everything's fine.", "Ringo is hanging out."],
  sad:     ["Ringo is sad... 😢", "Ringo needs attention!", "Take care of Ringo!"],
  sick:    ["Ringo is sick! 🤒", "Ringo needs help!", "Give Ringo medicine!"],
};

let lastMood = null;
let moodMsgIndex = 0;
let alertTimeout = null;

export function updateUI(state) {
  updateStatBars(state.stats);
  updateActionButtons(state);
  updateMoodCaption(state.mood);
  updateAlertBanner(state);
}

// ─── Stat bars ────────────────────────────────────────────────────────────────
function updateStatBars(stats) {
  setBar('bar-hunger',      stats.hunger,      false);
  setBar('bar-happiness',   stats.happiness,   false);
  setBar('bar-cleanliness', stats.cleanliness, false);
  setBar('bar-energy',      stats.energy,      false);
  setBar('bar-bladder',     stats.bladder,     true);
  setBar('bar-bowel',       stats.bowel,       true);
}

function setBar(id, value, inverted) {
  const el = document.getElementById(id);
  if (!el) return;
  const pct = inverted ? (100 - value) : value;
  el.style.setProperty('--pct', `${pct}%`);
  el.classList.toggle('warning', pct < 35);
  el.classList.toggle('critical', pct < 20);
}

// ─── Action buttons ───────────────────────────────────────────────────────────
function updateActionButtons(state) {
  for (const def of INTERACTIONS) {
    const btn = document.querySelector(`[data-action="${def.id}"]`);
    if (!btn) continue;

    const able = canActivate(def.id, state.stats);
    const cd   = getCooldownRemaining(def.id);

    btn.disabled = !able;
    btn.classList.toggle('on-cooldown', cd > 0);
    btn.classList.toggle('urgent', isUrgent(def.id, state.stats));

    // Cooldown countdown label
    const cdLabel = btn.querySelector('.cd-label');
    if (cdLabel) {
      if (cd > 0) {
        cdLabel.textContent = `${Math.ceil(cd / 1000)}s`;
        cdLabel.style.display = 'block';
      } else {
        cdLabel.style.display = 'none';
      }
    }

    // Show/hide heal button
    if (def.id === 'heal') {
      btn.style.display = state.stats.sick ? 'flex' : 'none';
    }
    // Hide sleep/wake based on state
    if (def.id === 'sleep') btn.style.display = state.stats.sleeping ? 'none' : 'flex';
    if (def.id === 'wake')  btn.style.display = state.stats.sleeping ? 'flex' : 'none';
  }
}

function isUrgent(id, stats) {
  if (id === 'poo'  && stats.bowel   > 80) return true;
  if (id === 'pee'  && stats.bladder > 80) return true;
  if (id === 'feed' && stats.hunger  < 25) return true;
  if (id === 'heal' && stats.sick)         return true;
  return false;
}

// ─── Mood caption ─────────────────────────────────────────────────────────────
function updateMoodCaption(mood) {
  const el = document.getElementById('mood-caption');
  if (!el) return;

  if (mood !== lastMood) {
    lastMood = mood;
    moodMsgIndex = Math.floor(Math.random() * MOOD_MESSAGES[mood].length);
  }
  el.textContent = MOOD_MESSAGES[mood][moodMsgIndex];
  el.className = `mood-caption mood-${mood}`;

  // Update page title
  if (mood === 'sick') document.title = '🤒 Ringo needs help!';
  else if (mood === 'sad') document.title = '😢 Ringo needs you!';
  else document.title = '🐾 Ringo';
}

// ─── Alert banner ─────────────────────────────────────────────────────────────
function updateAlertBanner(state) {
  const el = document.getElementById('alert-banner');
  if (!el) return;

  const alerts = getAlerts(state.stats);
  if (alerts.length > 0) {
    el.textContent = alerts[0];
    el.style.display = 'block';
    el.className = state.stats.sick ? 'alert critical' : 'alert warning';
  } else {
    el.style.display = 'none';
  }
}

function getAlerts(stats) {
  const msgs = [];
  if (stats.sick)             msgs.push('🤒 Ringo is sick! Give him medicine!');
  else if (stats.bowel > 85)  msgs.push('💩 Ringo needs to go NOW!');
  else if (stats.bladder > 85)msgs.push('💧 Ringo really needs to pee!');
  else if (stats.hunger < 20) msgs.push('🍗 Ringo is starving!');
  else if (stats.energy < 15) msgs.push('😴 Ringo is exhausted!');
  else if (stats.happiness < 20) msgs.push('😢 Ringo is very sad!');
  else if (stats.cleanliness < 20) msgs.push('🛁 Ringo needs a bath!');
  return msgs;
}

// ─── Selector thumbnails ──────────────────────────────────────────────────────
export function initSelectorThumbnails() {
  initBgThumbnails();
  initClothingThumbnails();
}

function initBgThumbnails() {
  for (const [id, bgDef] of Object.entries(BACKGROUNDS)) {
    const canvas = document.querySelector(`[data-bg="${id}"] canvas`);
    if (!canvas) continue;
    const tctx = canvas.getContext('2d');
    tctx.imageSmoothingEnabled = false;
    // Draw a 32×24 thumbnail (scaled from 160×128 → 1/5)
    tctx.save();
    tctx.scale(0.2, 0.2);
    bgDef.draw(tctx, 0, 0);
    tctx.restore();
  }
}

function initClothingThumbnails() {
  for (const item of CLOTHING) {
    const canvas = document.querySelector(`[data-clothing="${item.id}"] canvas`);
    if (!canvas) continue;
    const tctx = canvas.getContext('2d');
    tctx.imageSmoothingEnabled = false;

    // White background
    tctx.fillStyle = '#f5f5f0';
    tctx.fillRect(0, 0, 32, 40);

    // Draw sprite at 1:1 (canvas is 32×40)
    const sprite = CLOTHING_SPRITES[item.id];
    if (sprite) drawSprite(tctx, sprite, 0, 0, SPRITE_W, SPRITE_H);
  }
}
