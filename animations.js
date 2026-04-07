// animations.js — Animation state machine for Ringo

export const ANIMATIONS = {
  idle:       { frames: ['IDLE_0','IDLE_1'],                        fps: 2,  loop: true,  then: null },
  happy:      { frames: ['HAPPY_0','HAPPY_1','HAPPY_2'],            fps: 8,  loop: true,  then: null },
  eating:     { frames: ['EAT_0','EAT_1','EAT_2','EAT_1','EAT_0'], fps: 6,  loop: false, then: 'idle' },
  sleeping:   { frames: ['SLEEP_0','SLEEP_1'],                      fps: 1,  loop: true,  then: null },
  sick:       { frames: ['SICK_0','SICK_1'],                        fps: 3,  loop: true,  then: null },
  bath:       { frames: ['BATH_0','BATH_1','BATH_2','BATH_1'],      fps: 5,  loop: false, then: 'idle' },
  poo:        { frames: ['POO_0','POO_1','POO_2'],                  fps: 4,  loop: false, then: 'idle' },
  pee:        { frames: ['PEE_0','PEE_1'],                          fps: 4,  loop: false, then: 'idle' },
  walk:       { frames: ['WALK_0','WALK_1','WALK_2','WALK_3'],      fps: 8,  loop: true,  then: null },
  trick_sit:  { frames: ['SIT_0','SIT_1','SIT_2','SIT_2','SIT_1'], fps: 4,  loop: false, then: 'idle' },
  trick_spin: { frames: ['SPIN_0','SPIN_1','SPIN_2','SPIN_3'],      fps: 10, loop: false, then: 'idle' },
  praise:     { frames: ['PRAISE_0','HAPPY_1','PRAISE_1','HAPPY_1'],fps: 6,  loop: false, then: 'idle' },
  scolded:    { frames: ['SAD_0','SAD_1','SAD_0'],                  fps: 3,  loop: false, then: 'idle' },
  heal:       { frames: ['HEAL_0','HEAL_1','HEAL_1','HAPPY_0'],     fps: 4,  loop: false, then: 'happy' },
};

export class AnimationController {
  constructor() {
    this.current = 'idle';
    this.frameIndex = 0;
    this.lastFrameTime = 0;
    this._locked = false; // prevents mood from overriding one-shot animations
  }

  play(name, force = false) {
    if (!ANIMATIONS[name]) return;
    if (this._locked && !force) return;
    if (this.current === name && !force) return;
    this.current = name;
    this.frameIndex = 0;
    this.lastFrameTime = performance.now();
    this._locked = !ANIMATIONS[name].loop; // lock during one-shot animations
  }

  tick(now) {
    const def = ANIMATIONS[this.current];
    if (!def) { this.current = 'idle'; return 'IDLE_0'; }

    const msPerFrame = 1000 / def.fps;
    if (now - this.lastFrameTime >= msPerFrame) {
      this.lastFrameTime = now;
      this.frameIndex++;
      if (this.frameIndex >= def.frames.length) {
        if (def.loop) {
          this.frameIndex = 0;
        } else {
          this.frameIndex = def.frames.length - 1;
          this._locked = false;
          if (def.then) this.play(def.then, true);
        }
      }
    }
    return def.frames[this.frameIndex];
  }

  isPlaying(name) { return this.current === name; }
  isLocked() { return this._locked; }
}
