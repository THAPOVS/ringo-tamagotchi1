// clothing.js — Clothing registry for the selector UI
import { CLOTHING_SPRITES } from './sprites.js';

export const CLOTHING = [
  { id: 'none',         label: 'None',        emoji: '❌' },
  { id: 'cowboy_hat',   label: 'Cowboy Hat',  emoji: '🤠' },
  { id: 'santa_hat',    label: 'Santa Hat',   emoji: '🎅' },
  { id: 'birthday_hat', label: 'B-Day Hat',   emoji: '🎂' },
  { id: 'bow_tie',      label: 'Bow Tie',     emoji: '🎀' },
  { id: 'collar_red',   label: 'Red Collar',  emoji: '🔴' },
  { id: 'sunglasses',   label: 'Sunglasses',  emoji: '😎' },
  { id: 'raincoat',     label: 'Raincoat',    emoji: '🌧️' },
  { id: 'bandana',      label: 'Bandana',     emoji: '🩹' },
];

export function getClothingSprite(id) {
  return CLOTHING_SPRITES[id] ?? CLOTHING_SPRITES.none;
}
