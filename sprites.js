// sprites.js — Ringo pixel art sprite data
// Each sprite is a flat array of (width × height) entries, row-major order.
// Index formula: row * width + col
// null = transparent pixel, hex string = opaque color

// ─── Color palette ───────────────────────────────────────────────────────────
export const C = {
  W:  '#f5f5f0', // white fur
  WS: '#e8e8e0', // white fur shadow
  B:  '#1a1a1a', // black fur
  BS: '#2d2d2d', // black fur highlight
  P:  '#ff9aaa', // pink (tongue, nose inner)
  PN: '#3d2020', // dark brown nose
  EW: '#ffffff', // eye white sclera
  EP: '#000000', // eye pupil
  EG: '#88ccff', // eye glint
  SK: '#ffd4b8', // skin/paw pad
  YE: '#ffe066', // yellow (for pee animation)
  GR: '#88cc66', // green sparkle
  RD: '#ff4444', // red
  OR: '#ff8844', // orange
  T:  null,      // transparent
};

// ─── drawSprite helper ────────────────────────────────────────────────────────
// Draws a sprite array to a canvas context at (ox, oy)
export function drawSprite(ctx, data, ox, oy, w, h) {
  for (let i = 0; i < data.length; i++) {
    if (data[i] === null) continue;
    const col = i % w;
    const row = Math.floor(i / w);
    ctx.fillStyle = data[i];
    ctx.fillRect(ox + col, oy + row, 1, 1);
  }
}

// ─── Ringo sprites (32×40) ───────────────────────────────────────────────────
// Anatomy reference:
//  Right ear: rows 2–13, cols 5–14   (viewer's left)
//  Left ear:  rows 2–13, cols 18–27  (viewer's right)
//  Head:      rows 3–17, cols 8–24
//  BLACK EYE PATCH (left eye area): rows 6–12, cols 16–24 ← defining feature
//  Right eye: rows 7–10, cols 9–13
//  Nose:      rows 14–15, cols 15–17
//  Tongue:    rows 17–18, cols 14–18  (pink, happy states)
//  Body:      rows 16–38, cols 4–28
//  Tail:      rows 20–30, cols 27–31

const W=32, H=40;
const _ = C.T;

function make(fn) {
  const arr = new Array(W * H).fill(_);
  const set = (r, c, color) => { if (r>=0&&r<H&&c>=0&&c<W) arr[r*W+c]=color; };
  const rect = (r1,c1,r2,c2,color) => {
    for(let r=r1;r<=r2;r++) for(let c=c1;c<=c2;c++) set(r,c,color);
  };
  const ellipse = (cr,cc,rr,rc,color) => {
    for(let r=cr-rr;r<=cr+rr;r++)
      for(let c=cc-rc;c<=cc+rc;c++)
        if(((r-cr)/rr)**2+((c-cc)/rc)**2<=1) set(r,c,color);
  };
  fn(set, rect, ellipse);
  return arr;
}

// ── Base Ringo body (shared across frames) ────────────────────────────────────
function drawBase(set, rect, ellipse, opts = {}) {
  const { tongue = false, tailUp = false, sad = false, squat = false, legUp = false } = opts;

  // Body
  ellipse(28, 15, 12, 11, C.W);
  ellipse(28, 15, 10, 9, C.W);
  // Body shadow
  ellipse(30, 15, 4, 10, C.WS);

  // Tail
  const tailBase = squat ? 26 : 24;
  if (tailUp) {
    set(tailBase-2,27,C.W); set(tailBase-3,28,C.W); set(tailBase-4,29,C.W);
    set(tailBase-3,29,C.W); set(tailBase-2,30,C.W); set(tailBase-1,30,C.B);
    set(tailBase-2,28,C.B); set(tailBase-3,27,C.B);
  } else if (sad) {
    set(tailBase+2,27,C.W); set(tailBase+3,27,C.W);
    set(tailBase+2,28,C.B);
  } else {
    set(tailBase,27,C.W); set(tailBase-1,28,C.W); set(tailBase-2,29,C.W);
    set(tailBase-1,29,C.B); set(tailBase,28,C.B);
    set(tailBase-2,28,C.W); set(tailBase-3,29,C.W);
  }

  // Legs
  const legY = squat ? 35 : 33;
  rect(legY, 6, legY+4, 9, C.W);   // front left
  rect(legY, 18, legY+4, 21, C.W); // front right
  if (legUp) {
    // back left leg raised
    rect(legY-2, 10, legY+1, 13, C.W);
    rect(legY, 22, legY+4, 25, C.W); // back right
  } else {
    rect(legY, 10, legY+4, 13, C.W); // back left
    rect(legY, 22, legY+4, 25, C.W); // back right
  }
  // Paw pads
  rect(legY+4, 6, legY+5, 9, C.SK);
  rect(legY+4, 18, legY+5, 21, C.SK);
  if (!legUp) rect(legY+4, 10, legY+5, 13, C.SK);
  rect(legY+4, 22, legY+5, 25, C.SK);

  // Head
  ellipse(10, 16, 8, 8, C.W);

  // Right ear (viewer left)
  ellipse(7, 9, 6, 4, C.B);
  ellipse(8, 9, 4, 3, C.B);

  // Left ear (viewer right) — black
  ellipse(7, 23, 6, 4, C.B);
  ellipse(8, 23, 4, 3, C.B);

  // BLACK EYE PATCH over left eye area (cols 16–24, rows 6–12)
  ellipse(9, 20, 4, 5, C.B);

  // Right eye (white + pupil)
  ellipse(9, 11, 2, 2, C.EW);
  if (sad) {
    set(9,11,C.EP); // smaller sad eye
  } else {
    set(9,11,C.EP);
    set(8,12,C.EG); // glint
  }

  // Nose
  ellipse(14, 15, 1, 2, C.PN);
  set(14,16,C.P);

  // Mouth
  if (sad) {
    set(16,13,C.PN); set(16,14,C.PN); set(17,15,C.PN); set(16,16,C.PN); set(16,17,C.PN);
  } else {
    set(16,13,C.PN); set(17,14,C.PN); set(17,15,C.PN); set(17,16,C.PN); set(16,17,C.PN);
  }

  // Tongue (happy)
  if (tongue) {
    rect(17,14,18,17,C.P);
    set(18,14,C.P); set(18,17,C.P);
    set(17,15,C.PN); // tongue line
  }
}

// IDLE frame 0 — tail neutral
export const RINGO_IDLE_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false,tailUp:false});
});

// IDLE frame 1 — tail slightly up (breathing)
export const RINGO_IDLE_1 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false,tailUp:false});
  // blink: close right eye
  set(9,10,C.B); set(9,11,C.B); set(9,12,C.B);
});

// HAPPY frames
export const RINGO_HAPPY_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:true,tailUp:true});
});
export const RINGO_HAPPY_1 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:true,tailUp:false});
  // small jump — body up 2px (simplified: just tongue + big eye)
  set(8,12,C.EG); set(8,11,C.EW);
});
export const RINGO_HAPPY_2 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:true,tailUp:true});
  set(8,11,C.EW); set(8,10,C.EG);
});

// EAT frames
export const RINGO_EAT_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false});
  // open mouth wide
  rect(16,13,17,17,C.PN);
  set(16,14,C.P); set(16,15,C.P); set(16,16,C.P);
});
export const RINGO_EAT_1 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:true});
  // extended tongue (licking)
  rect(17,13,19,18,C.P);
});
export const RINGO_EAT_2 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false});
});

// SLEEP frames
export const RINGO_SLEEP_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false,sad:false});
  // eyes closed
  set(9,10,C.B); set(9,11,C.B); set(9,12,C.B);
  // Z
  set(3,20,C.B); set(3,21,C.B); set(4,21,C.B); set(5,20,C.B); set(5,21,C.B);
});
export const RINGO_SLEEP_1 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false});
  set(9,10,C.B); set(9,11,C.B); set(9,12,C.B);
  // bigger Z
  set(2,20,C.B); set(2,22,C.B); set(3,22,C.B); set(4,21,C.B); set(5,20,C.B); set(5,22,C.B);
});

// SICK frames
export const RINGO_SICK_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false,sad:true});
  // X eye
  set(8,10,C.PN); set(9,11,C.PN); set(10,12,C.PN);
  set(8,12,C.PN); set(9,11,C.PN); set(10,10,C.PN);
});
export const RINGO_SICK_1 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false,sad:true});
  set(8,10,C.PN); set(9,11,C.PN); set(10,12,C.PN);
  set(8,12,C.PN); set(10,10,C.PN);
  // sweat drop
  set(6,22,C.EG); set(7,22,C.EG);
});

// BATH frames
export const RINGO_BATH_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false});
  // wet look — darker fur tips
  for(let c=5;c<26;c+=3) set(16,c,C.WS);
});
export const RINGO_BATH_1 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:true});
  // eyes squinting happily
  set(9,10,C.EP); set(9,11,C.EP); set(9,12,C.EP);
});
export const RINGO_BATH_2 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:true});
  // shake: body slightly offset
  for(let c=4;c<28;c+=2) set(15,c,C.WS);
});

// POO frames (squat)
export const RINGO_POO_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{squat:true});
});
export const RINGO_POO_1 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{squat:true,sad:true});
  // straining face
  set(9,10,C.PN); set(9,12,C.PN);
});
export const RINGO_POO_2 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{squat:true,tongue:true});
  // relieved face
  set(8,12,C.EG);
});

// PEE frames (leg up)
export const RINGO_PEE_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{legUp:true});
});
export const RINGO_PEE_1 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{legUp:true,tongue:true});
});

// WALK frames (4-frame cycle)
export const RINGO_WALK_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:true});
});
export const RINGO_WALK_1 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false,tailUp:true});
  // offset front-left leg
  rect(33,6,37,9,_);
  rect(31,5,35,8,C.W); rect(35,5,36,8,C.SK);
});
export const RINGO_WALK_2 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:true,tailUp:false});
});
export const RINGO_WALK_3 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false,tailUp:true});
  // offset front-right leg
  rect(33,18,37,21,_);
  rect(31,19,35,22,C.W); rect(35,19,36,22,C.SK);
});

// SIT frames
export const RINGO_SIT_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false});
});
export const RINGO_SIT_1 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{squat:true});
  // sitting up
  ellipse(32,15,4,8,C.W); // haunches on ground
});
export const RINGO_SIT_2 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{squat:true,tongue:true});
  ellipse(32,15,4,8,C.W);
  set(8,12,C.EG);
});

// SPIN frames
export const RINGO_SPIN_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:true,tailUp:true});
});
export const RINGO_SPIN_1 = make((set,rect,ellipse) => {
  // facing away (back view) — simplified
  ellipse(10,16,8,8,C.W);
  ellipse(7,9,6,4,C.B); ellipse(7,23,6,4,C.B);
  ellipse(28,15,12,11,C.W);
  // tail wagging back view
  set(20,15,C.W); set(19,16,C.W); set(18,17,C.B); set(19,15,C.B);
  // eye patch visible on back of head (black spot)
  ellipse(9,20,3,4,C.B);
});
export const RINGO_SPIN_2 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:true,tailUp:false});
  // side view tilt
  ellipse(9,13,2,2,C.EW); set(9,13,C.EP);
});
export const RINGO_SPIN_3 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:true,tailUp:true});
});

// PRAISE / SAD
export const RINGO_PRAISE_0 = RINGO_HAPPY_0;
export const RINGO_PRAISE_1 = RINGO_HAPPY_2;
export const RINGO_SAD_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false,sad:true});
});
export const RINGO_SAD_1 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false,sad:true});
  // tear drop
  set(11,10,C.EG); set(12,10,C.EG);
});

// HEAL frames
export const RINGO_HEAL_0 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:false,sad:true});
  // sparkle
  set(3,18,C.GR); set(2,19,C.GR); set(3,20,C.GR); set(4,19,C.GR);
});
export const RINGO_HEAL_1 = make((set,rect,ellipse) => {
  drawBase(set,rect,ellipse,{tongue:true});
  set(2,16,C.GR); set(3,17,C.GR); set(4,16,C.GR);
  set(2,20,C.GR); set(3,21,C.GR); set(4,20,C.GR);
});

// ─── Export lookup map ────────────────────────────────────────────────────────
export const SPRITES = {
  IDLE_0:   RINGO_IDLE_0,
  IDLE_1:   RINGO_IDLE_1,
  HAPPY_0:  RINGO_HAPPY_0,
  HAPPY_1:  RINGO_HAPPY_1,
  HAPPY_2:  RINGO_HAPPY_2,
  EAT_0:    RINGO_EAT_0,
  EAT_1:    RINGO_EAT_1,
  EAT_2:    RINGO_EAT_2,
  SLEEP_0:  RINGO_SLEEP_0,
  SLEEP_1:  RINGO_SLEEP_1,
  SICK_0:   RINGO_SICK_0,
  SICK_1:   RINGO_SICK_1,
  BATH_0:   RINGO_BATH_0,
  BATH_1:   RINGO_BATH_1,
  BATH_2:   RINGO_BATH_2,
  POO_0:    RINGO_POO_0,
  POO_1:    RINGO_POO_1,
  POO_2:    RINGO_POO_2,
  PEE_0:    RINGO_PEE_0,
  PEE_1:    RINGO_PEE_1,
  WALK_0:   RINGO_WALK_0,
  WALK_1:   RINGO_WALK_1,
  WALK_2:   RINGO_WALK_2,
  WALK_3:   RINGO_WALK_3,
  SIT_0:    RINGO_SIT_0,
  SIT_1:    RINGO_SIT_1,
  SIT_2:    RINGO_SIT_2,
  SPIN_0:   RINGO_SPIN_0,
  SPIN_1:   RINGO_SPIN_1,
  SPIN_2:   RINGO_SPIN_2,
  SPIN_3:   RINGO_SPIN_3,
  PRAISE_0: RINGO_PRAISE_0,
  PRAISE_1: RINGO_PRAISE_1,
  SAD_0:    RINGO_SAD_0,
  SAD_1:    RINGO_SAD_1,
  HEAL_0:   RINGO_HEAL_0,
  HEAL_1:   RINGO_HEAL_1,
};

// ─── Clothing sprites (32×40, null = transparent overlay) ────────────────────
// Each item only sets pixels over the relevant anatomy area

function makeClothing(fn) {
  const arr = new Array(W * H).fill(null);
  const set = (r,c,color) => { if(r>=0&&r<H&&c>=0&&c<W) arr[r*W+c]=color; };
  const rect = (r1,c1,r2,c2,color) => {
    for(let r=r1;r<=r2;r++) for(let c=c1;c<=c2;c++) set(r,c,color);
  };
  fn(set,rect);
  return arr;
}

// Cowboy hat
export const CLOTHING_COWBOY_HAT = makeClothing((set,rect) => {
  // brim
  rect(5,7,6,25,'#8B5E3C');
  // crown
  rect(1,10,5,22,'#6B3F1E');
  rect(2,11,4,21,'#8B5E3C');
  // band
  rect(5,10,5,22,'#2d1a00');
  set(5,16,'#FFD700'); // buckle
});

// Santa hat
export const CLOTHING_SANTA_HAT = makeClothing((set,rect) => {
  rect(5,10,6,22,'#ffffff'); // brim
  rect(1,13,5,21,'#cc0000');
  rect(2,14,4,20,'#dd1111');
  set(0,16,'#ffffff'); set(0,17,'#ffffff'); // pompom
  set(1,15,'#ffffff'); set(1,18,'#ffffff');
});

// Birthday hat
export const CLOTHING_BIRTHDAY_HAT = makeClothing((set,rect) => {
  // cone
  for(let r=0;r<=6;r++) {
    const w = Math.floor(r*1.3)+1;
    for(let c=16-w;c<=16+w;c++) set(r,c, r%2===0?'#ff66aa':'#ffdd00');
  }
  rect(6,9,7,23,'#ffdd00'); // brim
  set(0,16,'#ff0066'); // star
});

// Bow tie
export const CLOTHING_BOW_TIE = makeClothing((set,rect) => {
  // left wing
  rect(19,10,21,14,'#cc2244');
  set(19,10,'#ff3366'); set(21,10,'#ff3366');
  // right wing
  rect(19,18,21,22,'#cc2244');
  set(19,22,'#ff3366'); set(21,22,'#ff3366');
  // knot
  rect(19,15,21,17,'#ff3366');
  set(20,16,'#cc2244');
});

// Red collar
export const CLOTHING_COLLAR_RED = makeClothing((set,rect) => {
  rect(18,9,19,23,'#cc0000');
  set(18,16,'#FFD700'); set(19,16,'#FFD700'); // tag
});

// Sunglasses
export const CLOTHING_SUNGLASSES = makeClothing((set,rect) => {
  // left lens (over eye patch side)
  rect(8,16,11,23,'#1a1a4e');
  // right lens
  rect(8,8,11,14,'#1a1a4e');
  // bridge
  rect(9,14,10,16,'#aaaaaa');
  // frames
  for(let c=16;c<=23;c++) { set(8,c,'#888888'); set(11,c,'#888888'); }
  for(let c=8;c<=14;c++) { set(8,c,'#888888'); set(11,c,'#888888'); }
  set(8,16,'#888888'); set(8,23,'#888888');
  set(11,8,'#888888'); set(11,14,'#888888');
});

// Raincoat
export const CLOTHING_RAINCOAT = makeClothing((set,rect) => {
  // body coat
  rect(17,4,38,28,'#ffdd00');
  // lapels
  rect(17,4,22,8,'#ffcc00');
  rect(17,20,22,28,'#ffcc00');
  // buttons
  set(20,15,'#ffffff'); set(24,15,'#ffffff'); set(28,15,'#ffffff');
  // hood trim
  rect(15,10,17,22,'#ffcc00');
});

// Bandana
export const CLOTHING_BANDANA = makeClothing((set,rect) => {
  rect(17,10,20,22,'#cc3300');
  // pattern dots
  for(let c=11;c<=21;c+=3) set(18,c,'#ffffff');
  for(let c=12;c<=20;c+=3) set(19,c,'#ffddaa');
  // triangle knot
  set(20,15,'#aa2200'); set(21,15,'#aa2200'); set(21,14,'#aa2200'); set(21,16,'#aa2200');
});

export const CLOTHING_NONE = new Array(W * H).fill(null);

export const CLOTHING_SPRITES = {
  none:         CLOTHING_NONE,
  cowboy_hat:   CLOTHING_COWBOY_HAT,
  santa_hat:    CLOTHING_SANTA_HAT,
  birthday_hat: CLOTHING_BIRTHDAY_HAT,
  bow_tie:      CLOTHING_BOW_TIE,
  collar_red:   CLOTHING_COLLAR_RED,
  sunglasses:   CLOTHING_SUNGLASSES,
  raincoat:     CLOTHING_RAINCOAT,
  bandana:      CLOTHING_BANDANA,
};

export const SPRITE_W = W;
export const SPRITE_H = H;
