// interactions.js — All action definitions and handlers

import {
  spawnHearts, spawnBubbles, spawnStars, spawnZs, spawnPoo, spawnPee,
  spawnChickenLeg, spawnSparkles, spawnSadParticles, spawnFloatingText
} from './particles.js';

// Ringo's canvas position (center of sprite bounding box)
const RINGO_CX = 64;
const RINGO_CY = 60;

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// ─── Interaction definitions ──────────────────────────────────────────────────
// Each entry: { id, label, emoji, cooldownMs, condition(stats), onActivate(state, anim) }

export const INTERACTIONS = [
  {
    id: 'pet',
    label: 'Pet',
    emoji: '🖐️',
    cooldownMs: 2000,
    condition: () => true,
    onActivate(state, anim) {
      state.stats.happiness = clamp(state.stats.happiness + 25, 0, 100);
      anim.play('praise', true);
      spawnHearts(RINGO_CX, RINGO_CY - 10, 6);
      spawnFloatingText(RINGO_CX - 8, RINGO_CY - 18, 'Good boy!', '#ff88aa');
    },
  },
  {
    id: 'feed',
    label: 'Feed',
    emoji: '🍗',
    cooldownMs: 3000,
    condition: (stats) => stats.hunger < 92,
    onActivate(state, anim) {
      state.stats.hunger = clamp(state.stats.hunger + 40, 0, 100);
      state.stats.bowel  = clamp(state.stats.bowel  + 8,  0, 100);
      state.stats.happiness = clamp(state.stats.happiness + 5, 0, 100);
      anim.play('eating', true);
      spawnChickenLeg(RINGO_CX, RINGO_CY);
    },
  },
  {
    id: 'bath',
    label: 'Bath',
    emoji: '🛁',
    cooldownMs: 5000,
    condition: () => true,
    onActivate(state, anim) {
      state.stats.cleanliness = clamp(state.stats.cleanliness + 60, 0, 100);
      state.stats.happiness   = clamp(state.stats.happiness   + 5,  0, 100);
      anim.play('bath', true);
      spawnBubbles(RINGO_CX, RINGO_CY, 12);
    },
  },
  {
    id: 'poo',
    label: 'Poo',
    emoji: '💩',
    cooldownMs: 0,
    condition: (stats) => stats.bowel > 20,
    onActivate(state, anim) {
      state.stats.bowel       = clamp(state.stats.bowel       - 80, 0, 100);
      state.stats.happiness   = clamp(state.stats.happiness   + 10, 0, 100);
      state.stats.cleanliness = clamp(state.stats.cleanliness - 5,  0, 100);
      anim.play('poo', true);
      spawnPoo(RINGO_CX + 10, RINGO_CY + 20);
      spawnFloatingText(RINGO_CX - 4, RINGO_CY - 14, 'Relief!', '#aaaaff');
    },
  },
  {
    id: 'pee',
    label: 'Pee',
    emoji: '💧',
    cooldownMs: 0,
    condition: (stats) => stats.bladder > 20,
    onActivate(state, anim) {
      state.stats.bladder   = clamp(state.stats.bladder   - 80, 0, 100);
      state.stats.happiness = clamp(state.stats.happiness + 5,  0, 100);
      anim.play('pee', true);
      spawnPee(RINGO_CX + 12, RINGO_CY + 18, 4);
    },
  },
  {
    id: 'play',
    label: 'Play',
    emoji: '🎮',
    cooldownMs: 4000,
    condition: (stats) => stats.energy > 15,
    onActivate(state, anim) {
      state.stats.happiness = clamp(state.stats.happiness + 30, 0, 100);
      state.stats.energy    = clamp(state.stats.energy    - 10, 0, 100);
      anim.play('happy', true);
      spawnStars(RINGO_CX, RINGO_CY - 8, 8);
      spawnFloatingText(RINGO_CX - 6, RINGO_CY - 18, 'Yay!', '#ffdd00');
    },
  },
  {
    id: 'sleep',
    label: 'Sleep',
    emoji: '😴',
    cooldownMs: 0,
    condition: (stats) => !stats.sleeping,
    onActivate(state, anim) {
      state.stats.sleeping = true;
      anim.play('sleeping', true);
      spawnZs(RINGO_CX + 10, RINGO_CY - 12);
    },
  },
  {
    id: 'wake',
    label: 'Wake',
    emoji: '☀️',
    cooldownMs: 0,
    condition: (stats) => stats.sleeping,
    onActivate(state, anim) {
      state.stats.sleeping = false;
      anim.play('idle', true);
      spawnStars(RINGO_CX, RINGO_CY - 5, 4);
    },
  },
  {
    id: 'heal',
    label: 'Heal',
    emoji: '💊',
    cooldownMs: 10000,
    condition: (stats) => stats.sick,
    onActivate(state, anim) {
      state.stats.sick        = false;
      state.stats.hunger      = clamp(state.stats.hunger      + 20, 0, 100);
      state.stats.cleanliness = clamp(state.stats.cleanliness + 20, 0, 100);
      state.stats.happiness   = clamp(state.stats.happiness   + 10, 0, 100);
      anim.play('heal', true);
      spawnSparkles(RINGO_CX, RINGO_CY - 5, '#88ff88', 8);
      spawnFloatingText(RINGO_CX - 10, RINGO_CY - 18, 'All better!', '#88ff88');
    },
  },
  {
    id: 'trick_sit',
    label: 'Sit',
    emoji: '🎪',
    cooldownMs: 3000,
    condition: (stats) => stats.energy > 5 && !stats.sleeping,
    onActivate(state, anim) {
      state.stats.happiness = clamp(state.stats.happiness + 15, 0, 100);
      state.stats.energy    = clamp(state.stats.energy    - 5,  0, 100);
      anim.play('trick_sit', true);
      spawnStars(RINGO_CX + 8, RINGO_CY - 5, 4);
    },
  },
  {
    id: 'trick_spin',
    label: 'Spin',
    emoji: '🌀',
    cooldownMs: 4000,
    condition: (stats) => stats.energy > 8 && !stats.sleeping,
    onActivate(state, anim) {
      state.stats.happiness = clamp(state.stats.happiness + 20, 0, 100);
      state.stats.energy    = clamp(state.stats.energy    - 8,  0, 100);
      anim.play('trick_spin', true);
      spawnStars(RINGO_CX, RINGO_CY, 10);
      spawnFloatingText(RINGO_CX - 8, RINGO_CY - 18, 'Spin!', '#ffaa44');
    },
  },
  {
    id: 'praise',
    label: 'Praise',
    emoji: '👏',
    cooldownMs: 2000,
    condition: (stats) => !stats.sleeping,
    onActivate(state, anim) {
      state.stats.happiness = clamp(state.stats.happiness + 15, 0, 100);
      anim.play('praise', true);
      spawnHearts(RINGO_CX, RINGO_CY - 8, 8);
      spawnFloatingText(RINGO_CX - 12, RINGO_CY - 20, 'Good dog!', '#ff4488');
    },
  },
  {
    id: 'scold',
    label: 'Scold',
    emoji: '😠',
    cooldownMs: 5000,
    condition: (stats) => !stats.sleeping,
    onActivate(state, anim) {
      state.stats.happiness = clamp(state.stats.happiness - 20, 0, 100);
      anim.play('scolded', true);
      spawnSadParticles(RINGO_CX, RINGO_CY - 5);
      spawnFloatingText(RINGO_CX - 10, RINGO_CY - 18, 'Bad dog!', '#ff4444');
    },
  },
  {
    id: 'walk',
    label: 'Walk',
    emoji: '🚶',
    cooldownMs: 6000,
    condition: (stats) => stats.energy > 15 && !stats.sleeping,
    onActivate(state, anim) {
      state.stats.happiness = clamp(state.stats.happiness + 20, 0, 100);
      state.stats.energy    = clamp(state.stats.energy    - 15, 0, 100);
      state.stats.hunger    = clamp(state.stats.hunger    - 5,  0, 100);
      anim.play('walk', true);
      state.walking = true;
      state.walkEndTime = Date.now() + 6000;
      spawnFloatingText(RINGO_CX - 6, RINGO_CY - 18, 'Walkies!', '#88ddff');
    },
  },
];

// ─── Cooldown tracker ─────────────────────────────────────────────────────────
const cooldowns = {};

export function canActivate(id, stats) {
  const def = INTERACTIONS.find(i => i.id === id);
  if (!def) return false;
  if (!def.condition(stats)) return false;
  if (cooldowns[id] && Date.now() < cooldowns[id]) return false;
  return true;
}

export function activate(id, state, anim) {
  const def = INTERACTIONS.find(i => i.id === id);
  if (!def) return;
  if (!canActivate(id, state.stats)) return;
  def.onActivate(state, anim);
  if (def.cooldownMs > 0) cooldowns[id] = Date.now() + def.cooldownMs;
}

export function getCooldownRemaining(id) {
  if (!cooldowns[id]) return 0;
  return Math.max(0, cooldowns[id] - Date.now());
}
