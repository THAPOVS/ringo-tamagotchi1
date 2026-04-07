// backgrounds.js — Pixel art background scenes
// Canvas area: 160×128 (rows 0–127, full width)
// All drawing uses ctx.fillRect() only — no images, no paths

// ─── Park ─────────────────────────────────────────────────────────────────────
function drawPark(ctx, scrollOffset = 0, _ts = 0) {
  const off = Math.floor(scrollOffset) % 160;

  // Sky gradient (flat pixel blocks)
  fill(ctx, 0, 0, 160, 60, '#87ceeb'); // sky blue
  fill(ctx, 60, 0, 160, 20, '#a8ddf5'); // horizon haze

  // Clouds (scroll with offset)
  drawCloud(ctx, (30 + off) % 200 - 20, 10);
  drawCloud(ctx, (100 + off) % 200 - 20, 18);
  drawCloud(ctx, (155 + off) % 200 - 20, 8);

  // Ground
  fill(ctx, 80, 0, 160, 48, '#5aaf3c'); // grass
  fill(ctx, 92, 0, 160, 36, '#4a9f2c'); // darker grass
  fill(ctx, 118, 0, 160, 10, '#8B6914'); // dirt path

  // Trees (scroll)
  drawTree(ctx, (10 - off + 160) % 200 - 10, 55);
  drawTree(ctx, (70 - off + 160) % 200 - 10, 60);
  drawTree(ctx, (130 - off + 160) % 200 - 10, 52);

  // Flowers
  for (let i = 0; i < 6; i++) {
    const fx = ((i * 28 + 15) - off + 160 * 3) % 160;
    drawFlower(ctx, fx, 90 + (i % 2) * 4);
  }

  // Path lines
  for (let i = 0; i < 5; i++) {
    const px = ((i * 32) - off + 160 * 4) % 160;
    fill(ctx, 119, px, 8, 3, '#a07820');
  }
}

// ─── Beach ────────────────────────────────────────────────────────────────────
function drawBeach(ctx, scrollOffset = 0, ts = 0) {
  const off = Math.floor(scrollOffset) % 160;
  const wave = Math.floor(ts / 400) % 2;

  // Sky
  fill(ctx, 0, 0, 160, 55, '#5bb8f5');
  fill(ctx, 55, 0, 160, 15, '#88d4f0');

  // Sun
  fill(ctx, 8, 130, 14, 14, '#ffe066');
  fill(ctx, 6, 134, 18, 6, '#ffe066');
  fill(ctx, 10, 132, 10, 10, '#fff4aa');

  // Ocean
  const oceanY = 70;
  fill(ctx, oceanY, 0, 160, 58, '#2980b9');
  fill(ctx, oceanY + 5, 0, 160, 8, '#3498db');

  // Waves (animated)
  for (let i = 0; i < 5; i++) {
    const wx = ((i * 35) - off * 2 + 160 * 4) % 160;
    const wy = oceanY + 2 + wave * 2;
    fill(ctx, wy, wx, 18, 2, '#7fd4f8');
    fill(ctx, wy + 1, wx + 2, 14, 1, '#ffffff');
  }

  // Sand
  fill(ctx, 95, 0, 160, 33, '#f4d48c');
  fill(ctx, 108, 0, 160, 20, '#e8c870');

  // Shells & pebbles
  for (let i = 0; i < 4; i++) {
    const sx = ((i * 42 + 8) - off + 640) % 160;
    fill(ctx, 110 + (i%2)*3, sx, 4, 2, '#f0b0a0');
  }

  // Palm tree
  const px = (120 - off + 320) % 200;
  if (px > -10 && px < 170) drawPalm(ctx, px, 72);
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function drawHome(ctx, _scrollOffset = 0, ts = 0) {
  // Walls
  fill(ctx, 0, 0, 160, 128, '#f5e6d0'); // warm wall

  // Floor
  fill(ctx, 100, 0, 160, 28, '#c4956a'); // wood
  // Floor planks
  for (let i = 0; i < 8; i++) fill(ctx, 100 + i * 3, 0, 160, 1, '#b0804c');

  // Window (back wall, left)
  fill(ctx, 10, 10, 60, 50, '#87ceeb');
  fill(ctx, 10, 10, 62, 2, '#f0d090');  // frame top
  fill(ctx, 58, 10, 62, 2, '#f0d090');  // frame bottom
  fill(ctx, 10, 10, 50, 2, '#f0d090');  // frame left
  fill(ctx, 10, 68, 50, 2, '#f0d090');  // frame right
  fill(ctx, 10, 37, 50, 2, '#f0d090');  // cross
  fill(ctx, 30, 10, 40, 2, '#f0d090');  // cross
  // Curtains
  fill(ctx, 10, 10, 50, 8, '#ff9999');
  fill(ctx, 10, 62, 50, 8, '#ff9999');

  // Rug
  fill(ctx, 95, 15, 100, 130, '#cc4444');
  fill(ctx, 96, 17, 98, 126, '#dd6666');
  for (let i = 0; i < 8; i++) fill(ctx, 96, 17 + i*15, 98, 2, '#ffaa88');

  // Picture frame (right wall)
  fill(ctx, 15, 100, 50, 50, '#f0d090');
  fill(ctx, 17, 102, 46, 46, '#88ccff');
  // heart in picture
  drawPixelHeart(ctx, 125, 35, '#ff6688');

  // Lamp
  fill(ctx, 20, 80, 60, 16, '#ffe066'); // shade
  fill(ctx, 10, 86, 20, 4, '#ffcc00');  // bulb glow
  fill(ctx, 60, 86, 40, 4, '#8B6914');  // pole
  fill(ctx, 96, 82, 4, 12, '#8B6914'); // base

  // Blinking light
  if (Math.floor(ts / 1000) % 3 === 0) {
    fill(ctx, 11, 87, 3, 2, '#ffffff');
  }
}

// ─── Night ────────────────────────────────────────────────────────────────────
function drawNight(ctx, _scrollOffset = 0, ts = 0) {
  // Sky
  fill(ctx, 0, 0, 160, 128, '#0a0a2e');
  fill(ctx, 85, 0, 160, 43, '#0d0d1a');

  // Moon
  fill(ctx, 8, 120, 20, 20, '#fffff0');
  fill(ctx, 8, 128, 20, 8, '#0a0a2e'); // crescent cutout
  fill(ctx, 5, 123, 24, 2, '#ffffcc');

  // Stars (blinking based on timestamp)
  const starPositions = [
    [5,10],[12,30],[8,55],[15,80],[3,100],[20,45],[7,130],[18,15],
    [25,65],[10,90],[22,20],[6,110],[28,40],[14,75],[2,50],[30,95],
  ];
  for (const [r,c] of starPositions) {
    const blink = Math.floor((ts / 500 + r + c) / 1) % 4;
    const brightness = blink < 2 ? '#ffffff' : '#aaaadd';
    ctx.fillStyle = brightness;
    ctx.fillRect(c, r, 1, 1);
    if (blink === 0) ctx.fillRect(c+1, r, 1, 1); // twinkle
  }

  // Ground (dark)
  fill(ctx, 90, 0, 160, 38, '#1a2a1a');
  fill(ctx, 100, 0, 160, 28, '#0f1a0f');

  // Fireflies
  const ff = Math.floor(ts / 300) % 3;
  const fireflies = [[75,30],[68,80],[80,120],[72,50],[78,100]];
  for (let i = 0; i < fireflies.length; i++) {
    if ((i + ff) % 3 === 0) {
      ctx.fillStyle = '#aaff66';
      ctx.fillRect(fireflies[i][1], fireflies[i][0], 1, 1);
    }
  }

  // Trees silhouettes
  drawTreeSilhouette(ctx, 5, 55);
  drawTreeSilhouette(ctx, 110, 60);
}

// ─── Snow ─────────────────────────────────────────────────────────────────────
function drawSnow(ctx, _scrollOffset = 0, ts = 0) {
  // Sky
  fill(ctx, 0, 0, 160, 128, '#d8e8f0');

  // Snowflakes falling
  const flakes = [
    [10,20],[25,45],[15,80],[30,110],[5,135],[35,15],[20,60],[28,95],
    [8,30],[22,70],[18,100],[32,50],[12,130],[26,85],[3,40],[38,120],
  ];
  const fallOffset = Math.floor(ts / 200) % 128;
  for (const [r,c] of flakes) {
    const yr = (r + fallOffset) % 128;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(c, yr, 1, 1);
    if (yr < 127) ctx.fillRect(c, yr + 1, 1, 1);
  }

  // Snow ground
  fill(ctx, 88, 0, 160, 40, '#f0f8ff');
  fill(ctx, 90, 0, 160, 38, '#e8f0f8');
  // Snow bumps
  for (let i = 0; i < 8; i++) {
    const bx = i * 22 + 5;
    fill(ctx, 88, bx, 6, 12, '#ffffff');
    fill(ctx, 87, bx + 2, 7, 8, '#ffffff');
  }

  // Snow trees
  drawSnowTree(ctx, 10, 55);
  drawSnowTree(ctx, 100, 60);

  // Snowman
  fill(ctx, 70, 65, 20, 14, '#f0f0f0'); // body
  fill(ctx, 60, 67, 12, 10, '#f0f0f0'); // head
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(70, 71, 2, 2); // eye
  ctx.fillRect(70, 75, 2, 2);
  ctx.fillRect(75, 72, 2, 6); // smile
  ctx.fillRect(57, 70, 2, 2); // buttons
  ctx.fillRect(62, 70, 2, 2);
  // Carrot nose
  ctx.fillStyle = '#ff8800';
  ctx.fillRect(66, 71, 4, 2);
  // Scarf
  fill(ctx, 71, 63, 4, 18, '#cc2244');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fill(ctx, y, x, h, w, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCloud(ctx, x, y) {
  fill(ctx, y, x, 5, 18, '#ffffff');
  fill(ctx, y - 3, x + 3, 5, 10, '#ffffff');
  fill(ctx, y - 2, x + 1, 4, 14, '#f0f0f0');
}

function drawTree(ctx, x, y) {
  // Trunk
  fill(ctx, y + 20, x + 7, 15, 6, '#8B5E3C');
  // Canopy layers
  fill(ctx, y + 10, x + 2, 12, 16, '#2d8b2d');
  fill(ctx, y + 4, x + 4, 10, 12, '#3aa03a');
  fill(ctx, y, x + 6, 8, 8, '#4ab04a');
}

function drawFlower(ctx, x, y) {
  fill(ctx, y, x, 3, 3, '#ff88aa');
  fill(ctx, y + 1, x - 1, 1, 5, '#ff88aa');
  fill(ctx, y + 1, x + 1, 1, 1, '#ffff66');
  fill(ctx, y + 3, x + 1, 4, 1, '#4a9f2c');
}

function drawPalm(ctx, x, y) {
  // Trunk (curved)
  for (let i = 0; i < 30; i++) {
    const tx = x + Math.floor(i * 0.3);
    fill(ctx, y + i, tx, 1, 4, '#a07820');
  }
  // Leaves
  const lx = x + 8, ly = y;
  fill(ctx, ly, lx - 12, 3, 8, '#3a8a2a');
  fill(ctx, ly - 2, lx - 6, 3, 8, '#4aaa3a');
  fill(ctx, ly, lx, 3, 12, '#3a8a2a');
  fill(ctx, ly - 3, lx + 4, 3, 8, '#4aaa3a');
  // Coconuts
  fill(ctx, ly + 2, lx - 2, 4, 4, '#8B5E3C');
}

function drawPixelHeart(ctx, x, y, color) {
  ctx.fillStyle = color;
  const h = [[0,1],[0,2],[0,4],[0,5],[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],
             [2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[3,1],[3,2],[3,3],[3,4],[3,5],
             [4,2],[4,3],[4,4],[5,3]];
  for (const [r,c] of h) ctx.fillRect(x + c, y + r, 1, 1);
}

function drawTreeSilhouette(ctx, x, y) {
  fill(ctx, y + 15, x + 5, 28, 4, '#0a150a'); // trunk
  fill(ctx, y, x, 20, 16, '#0a150a');          // canopy
  fill(ctx, y + 5, x + 2, 15, 12, '#111f11');
}

function drawSnowTree(ctx, x, y) {
  fill(ctx, y + 15, x + 5, 28, 4, '#5a4a3a'); // trunk
  fill(ctx, y, x, 18, 16, '#336633');          // canopy
  fill(ctx, y, x, 4, 16, '#e8f0f8');           // snow on top
  fill(ctx, y + 6, x - 2, 4, 20, '#e8f0f8');  // snow shelf
  fill(ctx, y + 12, x - 3, 4, 22, '#e8f0f8'); // snow shelf
}

// ─── Registry ─────────────────────────────────────────────────────────────────
export const BACKGROUNDS = {
  park:  { label: 'Park',  emoji: '🌳', draw: drawPark,  scrollable: true  },
  beach: { label: 'Beach', emoji: '🏖️', draw: drawBeach, scrollable: true  },
  home:  { label: 'Home',  emoji: '🏠', draw: drawHome,  scrollable: false },
  night: { label: 'Night', emoji: '🌙', draw: drawNight, scrollable: false },
  snow:  { label: 'Snow',  emoji: '❄️', draw: drawSnow,  scrollable: false },
};
