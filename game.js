// game.js — Game state, tick loop, localStorage persistence
import { AnimationController } from './animations.js';
import { tickParticles, spawnZs } from './particles.js';
import { renderFrame } from './renderer.js';
import { updateUI } from './ui.js';
import { canActivate, activate, getCooldownRemaining, INTERACTIONS } from './interactions.js';

// ─── Constants ────────────────────────────────────────────────────────────────
const TICK_MS       = 3000;   // 3 seconds per stat decay tick
const MAX_CATCHUP   = 200;    // max ticks to catch up on load

export const DECAY = {
  hunger:      -2,
  happiness:   -1,
  cleanliness: -0.5,
  energy:      -1,
  bladder:     +3,
  bowel:       +1.5,
};

// ─── State ────────────────────────────────────────────────────────────────────
export const state = {
  stats: {
    hunger:      100,
    happiness:   100,
    cleanliness: 100,
    energy:      100,
    bladder:     0,
    bowel:       0,
    sick:        false,
    sleeping:    false,
  },
  mood:             'happy',
  activeBackground: 'park',
  activeClothing:   'none',
  scrollOffset:     0,
  walking:          false,
  walkEndTime:      0,
  lastTick:         Date.now(),
  lastZTime:        0,
};

export const anim = new AnimationController();

// ─── Mood derivation ──────────────────────────────────────────────────────────
function deriveMood(stats) {
  if (stats.sick) return 'sick';
  if (stats.hunger < 40 || stats.happiness < 40 || stats.energy < 15) return 'sad';
  if (stats.happiness > 70 && stats.hunger > 60 && stats.energy > 30) return 'happy';
  return 'neutral';
}

// ─── Stat tick ────────────────────────────────────────────────────────────────
function applyDecay(stats, ticks = 1) {
  if (stats.sleeping) {
    // While sleeping: energy recovers, hunger decays slowly, others paused
    stats.energy  = clamp(stats.energy  + 5     * ticks, 0, 100);
    stats.hunger  = clamp(stats.hunger  + DECAY.hunger * 0.5 * ticks, 0, 100);
    stats.bladder = clamp(stats.bladder + DECAY.bladder * ticks, 0, 100);
  } else {
    stats.hunger      = clamp(stats.hunger      + DECAY.hunger      * ticks, 0, 100);
    stats.happiness   = clamp(stats.happiness   + DECAY.happiness   * ticks, 0, 100);
    stats.cleanliness = clamp(stats.cleanliness + DECAY.cleanliness * ticks, 0, 100);
    stats.energy      = clamp(stats.energy      + DECAY.energy      * ticks, 0, 100);
    stats.bladder     = clamp(stats.bladder     + DECAY.bladder     * ticks, 0, 100);
    stats.bowel       = clamp(stats.bowel       + DECAY.bowel       * ticks, 0, 100);
  }

  // Update sick flag
  stats.sick = stats.hunger < 20 || stats.cleanliness < 20 ||
               stats.bladder > 85 || stats.bowel > 85;
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// ─── localStorage ─────────────────────────────────────────────────────────────
const SAVE_KEY = 'ringo_save_v2';

function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    stats:            state.stats,
    activeBackground: state.activeBackground,
    activeClothing:   state.activeClothing,
    lastSaved:        Date.now(),
  }));
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);

    // Restore stats
    Object.assign(state.stats, saved.stats);
    state.activeBackground = saved.activeBackground || 'park';
    state.activeClothing   = saved.activeClothing   || 'none';

    // Catch-up ticks for time elapsed
    const elapsed = (Date.now() - saved.lastSaved) / 1000;
    const missedTicks = Math.min(Math.floor(elapsed / (TICK_MS / 1000)), MAX_CATCHUP);
    if (missedTicks > 0) applyDecay(state.stats, missedTicks);
  } catch (e) {
    console.warn('Could not load save:', e);
  }
}

// ─── Game loop ────────────────────────────────────────────────────────────────
let lastSaveTickCount = 0;
let tickCount = 0;

function tick() {
  applyDecay(state.stats);
  tickCount++;

  // Walking: scroll background, stop after walkEndTime
  if (state.walking) {
    state.scrollOffset += 2;
    if (Date.now() >= state.walkEndTime) {
      state.walking = false;
      anim.play('idle', true);
    }
  }

  // Sleeping: emit Z particles occasionally
  if (state.stats.sleeping && Date.now() - state.lastZTime > 2500) {
    spawnZs(78, 42);
    state.lastZTime = Date.now();
  }

  // Update mood and trigger mood animation
  const newMood = deriveMood(state.stats);
  state.mood = newMood;
  if (!anim.isLocked()) {
    if (newMood === 'happy' && !anim.isPlaying('happy')) anim.play('happy');
    else if (newMood === 'sick' && !anim.isPlaying('sick')) anim.play('sick');
    else if ((newMood === 'sad' || newMood === 'neutral') && !anim.isPlaying('idle')) anim.play('idle');
  }

  // Auto-save every 10 ticks
  if (tickCount - lastSaveTickCount >= 10) {
    saveState();
    lastSaveTickCount = tickCount;
  }
}

// ─── rAF render loop ──────────────────────────────────────────────────────────
function loop(ts) {
  const now = Date.now();

  // Stat tick
  if (now - state.lastTick >= TICK_MS) {
    tick();
    state.lastTick = now;
  }

  tickParticles();
  renderFrame(ts, state, anim);
  updateUI(state);

  requestAnimationFrame(loop);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
export function initGame() {
  loadState();

  // Wire up action buttons
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.action;
      activate(id, state, anim);
      saveState();
    });
  });

  // Wire up background selector
  document.querySelectorAll('[data-bg]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeBackground = btn.dataset.bg;
      document.querySelectorAll('[data-bg]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      saveState();
    });
  });

  // Wire up clothing selector
  document.querySelectorAll('[data-clothing]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeClothing = btn.dataset.clothing;
      document.querySelectorAll('[data-clothing]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      saveState();
    });
  });

  // Tricks submenu toggle
  const tricksToggle = document.getElementById('tricks-toggle');
  const tricksMenu   = document.getElementById('tricks-menu');
  if (tricksToggle && tricksMenu) {
    tricksToggle.addEventListener('click', () => {
      tricksMenu.classList.toggle('visible');
    });
    document.addEventListener('click', (e) => {
      if (!tricksToggle.contains(e.target) && !tricksMenu.contains(e.target)) {
        tricksMenu.classList.remove('visible');
      }
    });
  }

  // Mark active selectors from loaded state
  document.querySelector(`[data-bg="${state.activeBackground}"]`)?.classList.add('active');
  document.querySelector(`[data-clothing="${state.activeClothing}"]`)?.classList.add('active');

  requestAnimationFrame(loop);
}
