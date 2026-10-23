/*
 * 西游·八十一难 — procedural Canvas renderer
 *
 * This file deliberately has no DOM, Image, Path2D, gradient or platform
 * dependencies.  The same renderer is used by the browser prototype and the
 * WeChat mini-program adapter, which supplies a Canvas 2D context.  All art is
 * drawn from simple, original shapes so a playable build has no asset loading
 * gate.
 */

import { battleEnemyAnimation } from './battle-enemy-animation.js';
import { skillFxIdForEffect, skillFxFrameRect } from './skill-fx-animation.js';
import { CAVE_MOUTHS } from './scene-collision.js';

const TAU = Math.PI * 2;
const WORLD_SIZE = 1800;
const EMPTY_LIST = Object.freeze([]);
const compareEnemyDepth = (a, b) => n(a.y) - n(b.y);
const STATUS_BADGES = Object.freeze({
  '眩晕': { glyph: '晕', color: '#ffe06b' },
  '燃烧': { glyph: '燃', color: '#ffae71' },
  '流血': { glyph: '血', color: '#ff9b9b' },
  '减速': { glyph: '慢', color: '#aee4ff' },
  '击退': { glyph: '退', color: '#d6c4ff' },
});
const MAX_STATUS_BADGES = 12;
const MAX_DAMAGE_LABEL_RECTS = 48;
const MAX_DAMAGE_ENEMY_RECTS = 512;
const MAX_HUD_OCCLUSION_RECTS = 2;

function enemyStatusBadge(enemy) {
  const status = enemy?.statusText || enemy?.debuff || enemy?.status
    || (enemy?.stun > 0 ? '眩晕' : enemy?.burn?.ttl > 0 ? '燃烧' : enemy?.bleeds?.length ? '流血'
      // slow is a speed multiplier: 1 is normal, 0 is treated as 1 by the
      // engine. Neither normal speed nor a speed-up is a debuff.
      : enemy?.slow > 0 && enemy.slow < 1 ? '减速' : enemy?.knockback > 0 ? '击退' : '');
  if (status == null || status === '' || status === false) return null;
  const label = typeof status === 'string' ? status : status.name || status.id || '受缚';
  // Boss identity is already carried by its nameplate, not a second status.
  if (enemy?.kind === 'boss' && ['最终妖王', '妖王', enemy.name].includes(label)) return null;
  return STATUS_BADGES[label] || { glyph: String(label).slice(0, 2), color: '#ffe06b' };
}

const THEMES = Object.freeze({
  // paper/ink keep the scroll identity; the extra saturated swatches are used
  // by the three depth layers and remain legible through a phone's small viewport.
  forest: { paper: '#16866e', paperDark: '#37b889', ink: '#071b24', leaf: '#75ec6b', accent: '#f44a48', road: '#ffd14a', motif: '#36e0e8', sky: '#2bb7b0', deep: '#0b4a4d', sticker: '#ffe84e' },
  sand: { paper: '#d87827', paperDark: '#f1b53f', ink: '#26131a', leaf: '#b5ed4b', accent: '#ff4b39', road: '#ffe14e', motif: '#31d9e3', sky: '#64c6d1', deep: '#7b371b', sticker: '#fff06a' },
  snow: { paper: '#4dc1d4', paperDark: '#b3f4ec', ink: '#082333', leaf: '#5decc0', accent: '#ff4d52', road: '#ffe05a', motif: '#3769f2', sky: '#d0ffff', deep: '#1c5b84', sticker: '#fff26b' },
  fire: { paper: '#b53b3e', paperDark: '#e9683e', ink: '#291323', leaf: '#ffad3e', accent: '#ff3b2f', road: '#ffdf4a', motif: '#8b55ff', sky: '#ef7260', deep: '#5c1c31', sticker: '#fff06a' },
  water: { paper: '#168eaa', paperDark: '#4ee0d2', ink: '#071e35', leaf: '#55f0b3', accent: '#ff6445', road: '#ffe04e', motif: '#658cff', sky: '#64ecf2', deep: '#0a4f75', sticker: '#fff069' },
  temple: { paper: '#4e2d91', paperDark: '#8657d3', ink: '#0b0d1d', leaf: '#5ce8ac', accent: '#ff4b55', road: '#ffda4c', motif: '#45e4ee', sky: '#7652d5', deep: '#241552', sticker: '#ffe84f' }
});

const HEROES = Object.freeze({
  wukong: { body: '#b64e34', dark: '#6b3027', light: '#e6a547', skin: '#bf7852', metal: '#efc35b', trim: '#6b4435' },
  tangsanzang: { body: '#d9edf0', dark: '#5b7094', light: '#8ccddd', skin: '#eac39f', metal: '#d1a953', trim: '#45607b' },
  bajie: { body: '#b85f49', dark: '#6a3a35', light: '#e6a46d', skin: '#e6a58b', metal: '#b7b7a2', trim: '#5d4a45' },
  shajing: { body: '#507f79', dark: '#294e51', light: '#91b7a2', skin: '#986b4b', metal: '#d3aa5a', trim: '#3d5e61' }
});

const ENEMY_TINTS = Object.freeze({
  forest: ['#6c4b3f', '#7e6944', '#4f6c52', '#8b5745'],
  sand: ['#87543b', '#986d43', '#6e5939', '#9c5c43'],
  snow: ['#52656b', '#6b5961', '#4d787c', '#87635f'],
  fire: ['#733933', '#934530', '#5c3c3b', '#ad6041'],
  water: ['#355f60', '#476f72', '#6f5c57', '#46644c'],
  temple: ['#57435d', '#76506a', '#4d566d', '#855e4c']
});

// Final guardians deliberately use identity-scoped vector profiles until
// dedicated 32-pose sheets pass the asset preflight.  These profiles are a
// visual distinction only: they never participate in combat, animation
// timing, or the ordinary animal-frame registry.
const FINAL_BOSS_PROFILES = Object.freeze({
  'yin-general': Object.freeze({ body: '#a94435', dark: '#52252b', light: '#efb34f', metal: '#f6d15a', accent: '#d7353e' }),
  'xiong-shanjun': Object.freeze({ body: '#6f4938', dark: '#38282b', light: '#d39a55', metal: '#d8c28a', accent: '#8e5a3f' }),
  'te-chushi': Object.freeze({ body: '#597064', dark: '#273b3c', light: '#d2a65b', metal: '#e6c971', accent: '#3e9b91' }),
});

const noopContext = {
  save() {}, restore() {}, beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, quadraticCurveTo() {}, bezierCurveTo() {}, arc() {},
  fill() {}, stroke() {}, fillRect() {}, strokeRect() {}, clearRect() {}, fillText() {}, setTransform() {}, translate() {}, scale() {}, rotate() {},
  clip() {}, measureText(text) { return { width: String(text).length * 8 }; }
};

function n(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

// Animation is simulation-owned state. The renderer only turns the current
// state/frame into a small pose and an optional atlas crop, so pausing the
// engine freezes the exact same visual frame as the gameplay snapshot.
function animationState(entity) {
  return String(entity?.animationState || entity?.state || 'idle');
}

function animationFrame(entity) {
  const frames = Math.max(1, Number(entity?.animationFrames) || 1);
  return ((Math.floor(Number(entity?.frameIndex) || 0) % frames) + frames) % frames;
}

function animationPose(entity, radius) {
  const state = animationState(entity);
  const frames = Math.max(1, Number(entity?.animationFrames) || 1);
  const frame = animationFrame(entity);
  const wave = Math.sin(((frame + .5) / frames) * TAU);
  if (state === 'move') return { y: wave * radius * .055, rotation: wave * .045, scaleX: 1 + wave * .025, scaleY: 1 - wave * .018 };
  if (state === 'attack') return { y: wave * radius * .035, rotation: wave * .12, scaleX: 1 + wave * .035, scaleY: 1 - wave * .025 };
  if (state === 'hit') return { y: wave * radius * .02, rotation: wave * .08, scaleX: 1 - Math.abs(wave) * .035, scaleY: 1 + Math.abs(wave) * .025 };
  if (state === 'stun') return { y: 0, rotation: wave * .18, scaleX: 1, scaleY: 1 };
  if (state === 'dash') return { y: wave * radius * .08, rotation: wave * .06, scaleX: 1.12, scaleY: .9 };
  if (state === 'intro') return { y: (1 - (frame + 1) / frames) * radius * .22, rotation: wave * .06, scaleX: .82 + (frame + 1) / frames * .18, scaleY: .82 + (frame + 1) / frames * .18 };
  return { y: wave * radius * .018, rotation: wave * .018, scaleX: 1 + wave * .012, scaleY: 1 - wave * .012 };
}

// The in-battle rig is intentionally code-native.  Each simulation frame
// changes a small set of limbs/weapon angles, so the playable scene never
// treats a polished character card as a frozen sprite.  This is cheap enough
// for a phone Canvas and still gives eight meaningful movement/attack frames.
function battleMotion(entity, radius = 18) {
  const state = animationState(entity);
  const frames = Math.max(1, Number(entity?.animationFrames) || 1);
  const frame = animationFrame(entity);
  const phase = ((frame + .5) / frames) * TAU;
  const wave = Math.sin(phase);
  const halfWave = Math.sin(phase * .5);
  const move = state === 'move' || state === 'dash';
  const attack = state === 'attack';
  return {
    frame, phase, wave, halfWave,
    stride: move ? wave * radius * .20 : 0,
    armSwing: move ? -wave * .16 : attack ? halfWave * .34 : 0,
    weaponSwing: attack ? -halfWave * .34 : move ? wave * .08 : 0,
    lean: move ? wave * .045 : attack ? halfWave * .08 : 0,
  };
}

function spriteFrameRect(sprite, id, frameIndex, state = 'idle') {
  const grids = sprite?.__frameGrids;
  const rootGrid = (grids && grids[id]) || sprite?.__frameGrid;
  // A battle sprite can provide state-specific frame strips.  Keep the
  // source rectangle fallback compatible with the original one-grid metadata
  // so SVG/legacy adapters continue to render without any special casing.
  const grid = rootGrid?.states?.[state] || rootGrid?.states?.idle || rootGrid;
  if (!grid) return null;
  const source = grid.source || sprite?.__sourceRects?.[id] || { x: 0, y: 0, w: Number(sprite.naturalWidth || sprite.width) || 1, h: Number(sprite.naturalHeight || sprite.height) || 1 };
  const cols = Math.max(1, Math.floor(Number(grid.cols) || 1));
  const rows = Math.max(1, Math.floor(Number(grid.rows) || 1));
  const rects = Array.isArray(grid.rects) ? grid.rects : null;
  const offsets = Array.isArray(grid.offsets) ? grid.offsets : null;
  const scales = Array.isArray(grid.scales) ? grid.scales : null;
  const declaredFrames = rects?.length || Number(grid.frames) || cols * rows;
  const count = Math.max(1, Math.min(rects ? rects.length : cols * rows, Math.floor(declaredFrames)));
  const frame = ((Math.floor(Number(frameIndex) || 0) % count) + count) % count;
  if (rects?.[frame]) {
    const item = rects[frame];
    const offset = offsets?.[frame] || {};
    const scale = scales?.[frame] || {};
    return {
      x: Number(item.x) || source.x, y: Number(item.y) || source.y,
      w: Number(item.w) || source.w, h: Number(item.h) || source.h,
      dx: Number(offset.dx) || 0, dy: Number(offset.dy) || 0,
      scaleX: Number(scale.x ?? scale.scaleX) || 1,
      scaleY: Number(scale.y ?? scale.scaleY) || 1,
      state, frame
    };
  }
  const sw = Number(grid.frameWidth) || source.w / cols;
  const sh = Number(grid.frameHeight) || source.h / rows;
  const offset = offsets?.[frame] || {};
  const scale = scales?.[frame] || {};
  return {
    x: source.x + (frame % cols) * sw, y: source.y + Math.floor(frame / cols) * sh, w: sw, h: sh,
    dx: Number(offset.dx) || 0, dy: Number(offset.dy) || 0,
    scaleX: Number(scale.x ?? scale.scaleX) || 1,
    scaleY: Number(scale.y ?? scale.scaleY) || 1,
    state, frame
  };
}

function method(ctx, name, ...args) {
  if (ctx && typeof ctx[name] === 'function') {
    try { return ctx[name](...args); } catch (_) { return undefined; }
  }
  return undefined;
}

// Browser Image and WeChat's canvas image objects expose different readiness
// fields. Keep the asset path opportunistic: a missing/undecoded image must
// never block the deterministic vector fallback.
function imageReady(image) {
  return Boolean(image && (image.complete === undefined || image.complete || image.naturalWidth > 0 || image.width > 0));
}

function drawImageIfReady(ctx, image, ...args) {
  if (!imageReady(image) || typeof ctx?.drawImage !== 'function') return false;
  try { ctx.drawImage(image, ...args); return true; } catch (_) { return false; }
}

function drawImageCover(ctx, image, x, y, width, height) {
  if (!imageReady(image)) return false;
  const iw = Math.max(1, n(image.naturalWidth || image.videoWidth || image.width, width));
  const ih = Math.max(1, n(image.naturalHeight || image.videoHeight || image.height, height));
  const sourceRatio = iw / ih;
  const targetRatio = Math.max(.001, width / Math.max(1, height));
  let sx = 0, sy = 0, sw = iw, sh = ih;
  if (sourceRatio > targetRatio) { sw = ih * targetRatio; sx = (iw - sw) * .5; }
  else if (sourceRatio < targetRatio) { sh = iw / targetRatio; sy = (ih - sh) * .5; }
  return drawImageIfReady(ctx, image, sx, sy, sw, sh, x, y, width, height);
}

function paint(ctx, fill, stroke, lineWidth = 1) {
  if (fill != null) ctx.fillStyle = fill;
  if (stroke != null) ctx.strokeStyle = stroke;
  if (lineWidth != null) ctx.lineWidth = lineWidth;
}

function path(ctx, commands, fill, stroke, lineWidth = 1) {
  method(ctx, 'beginPath');
  for (const command of commands) {
    const op = command[0];
    if (op === 'M') method(ctx, 'moveTo', command[1], command[2]);
    else if (op === 'L') method(ctx, 'lineTo', command[1], command[2]);
    else if (op === 'Q') method(ctx, 'quadraticCurveTo', command[1], command[2], command[3], command[4]);
    else if (op === 'C') method(ctx, 'bezierCurveTo', command[1], command[2], command[3], command[4], command[5], command[6]);
    else if (op === 'A') method(ctx, 'arc', command[1], command[2], command[3], command[4], command[5], command[6]);
    else if (op === 'Z') method(ctx, 'closePath');
  }
  if (fill != null) { paint(ctx, fill); method(ctx, 'fill'); }
  if (stroke != null) { paint(ctx, null, stroke, lineWidth); method(ctx, 'stroke'); }
}

function circle(ctx, x, y, radius, fill, stroke, lineWidth = 1) {
  method(ctx, 'beginPath');
  method(ctx, 'arc', x, y, Math.max(0, radius), 0, TAU);
  if (fill != null) { paint(ctx, fill); method(ctx, 'fill'); }
  if (stroke != null) { paint(ctx, null, stroke, lineWidth); method(ctx, 'stroke'); }
}

function roundedBox(ctx, x, y, w, h, radius, fill, stroke, lineWidth = 1) {
  const r = Math.min(Math.abs(radius), Math.abs(w) / 2, Math.abs(h) / 2);
  path(ctx, [
    ['M', x + r, y], ['L', x + w - r, y], ['Q', x + w, y, x + w, y + r],
    ['L', x + w, y + h - r], ['Q', x + w, y + h, x + w - r, y + h],
    ['L', x + r, y + h], ['Q', x, y + h, x, y + h - r],
    ['L', x, y + r], ['Q', x, y, x + r, y], ['Z']
  ], fill, stroke, lineWidth);
}

function hash2(x, y) {
  // Stable pseudo-noise for map ornament placement.  It is never seeded from
  // Math.random, so replayed frames have exactly the same decorations.
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function themeFor(stage) {
  const theme = typeof stage?.theme === 'string' ? stage.theme : (typeof stage === 'string' ? stage : 'forest');
  return THEMES[theme] || THEMES.forest;
}

function heroStyle(characterId) {
  const key = String(characterId || '').toLowerCase().replace(/[^a-z]/g, '');
  if (key === 'tangsanzang' || key === 'tangseng' || key === 'tang' || key === 'sanzang') return ['tangsanzang', HEROES.tangsanzang];
  if (key === 'bajie' || key === 'zhubajie') return ['bajie', HEROES.bajie];
  if (key === 'shajing' || key === 'sha' || key === 'wujing') return ['shajing', HEROES.shajing];
  return ['wukong', HEROES.wukong];
}

function alphaColor(color, alpha) {
  // Canvas implementations accept rgba consistently; preserve CSS colors that
  // are not six-digit hex values as-is for old WeChat contexts.
  const match = String(color || '').match(/^#([0-9a-f]{6})$/i);
  if (!match) return color;
  const hex = match[1];
  return `rgba(${parseInt(hex.slice(0, 2), 16)},${parseInt(hex.slice(2, 4), 16)},${parseInt(hex.slice(4, 6), 16)},${clamp(alpha, 0, 1)})`;
}

function drawPortrait(ctx, characterId, x, y, size) {
  const [id, style] = heroStyle(characterId);
  const s = Math.max(1, n(size, 64));
  const r = s * 0.26;
  method(ctx, 'save');
  method(ctx, 'translate', n(x), n(y));
  circle(ctx, 0, s * 0.12, s * 0.45, '#dbc48f', '#5c4235', Math.max(1, s * 0.035));
  if (id === 'wukong') {
    circle(ctx, -s * 0.34, -s * 0.01, s * 0.14, style.body, style.dark, s * 0.03);
    circle(ctx, s * 0.34, -s * 0.01, s * 0.14, style.body, style.dark, s * 0.03);
    path(ctx, [['M', -s * .22, s * .03], ['Q', 0, -s * .22, s * .22, s * .03], ['L', s * .16, s * .29], ['L', -s * .16, s * .29], ['Z']], style.skin, style.dark, s * .03);
    circle(ctx, -s * .08, s * .09, s * .028, '#2b2527'); circle(ctx, s * .08, s * .09, s * .028, '#2b2527');
    paint(ctx, style.metal); method(ctx, 'fillRect', -s * .32, -s * .43, s * .64, s * .13); method(ctx, 'fillRect', -s * .19, -s * .57, s * .38, s * .18);
  } else if (id === 'tangsanzang') {
    circle(ctx, 0, -s * .01, s * .28, style.skin, style.dark, s * .03);
    path(ctx, [['M', -s * .37, s * .18], ['Q', 0, s * .02, s * .37, s * .18], ['L', s * .28, s * .55], ['L', -s * .28, s * .55], ['Z']], style.body, style.dark, s * .035);
    circle(ctx, -s * .09, s * .02, s * .022, '#2b3041'); circle(ctx, s * .09, s * .02, s * .022, '#2b3041');
    paint(ctx, null, style.metal, s * .03); method(ctx, 'beginPath'); method(ctx, 'moveTo', -s * .3, -s * .29); method(ctx, 'lineTo', s * .3, -s * .29); method(ctx, 'stroke');
  } else if (id === 'bajie') {
    circle(ctx, 0, s * .02, s * .29, style.skin, style.dark, s * .03);
    path(ctx, [['M', -s * .23, -s * .11], ['L', -s * .43, -s * .26], ['L', -s * .34, s * .02], ['Z']], style.skin, style.dark, s * .03);
    path(ctx, [['M', s * .23, -s * .11], ['L', s * .43, -s * .26], ['L', s * .34, s * .02], ['Z']], style.skin, style.dark, s * .03);
    circle(ctx, 0, s * .13, s * .13, style.light, style.dark, s * .025); circle(ctx, -s * .055, s * .12, s * .018, '#37282a'); circle(ctx, s * .055, s * .12, s * .018, '#37282a');
    path(ctx, [['M', -s * .33, s * .28], ['Q', 0, s * .12, s * .33, s * .28], ['L', s * .25, s * .6], ['L', -s * .25, s * .6], ['Z']], style.body, style.dark, s * .035);
  } else {
    circle(ctx, 0, s * .02, s * .28, style.skin, style.dark, s * .03);
    path(ctx, [['M', -s * .25, -s * .13], ['Q', 0, -s * .36, s * .25, -s * .13], ['L', s * .3, s * .02], ['L', -s * .3, s * .02], ['Z']], style.dark, style.dark, s * .02);
    path(ctx, [['M', -s * .3, s * .28], ['Q', 0, s * .08, s * .3, s * .28], ['L', s * .24, s * .61], ['L', -s * .24, s * .61], ['Z']], style.body, style.dark, s * .035);
    circle(ctx, -s * .09, s * .03, s * .02, '#252c30'); circle(ctx, s * .09, s * .03, s * .02, '#252c30');
  }
  // portrait frame is deliberately square and parchment-like for UI use
  roundedBox(ctx, -s * .52, -s * .58, s * 1.04, s * 1.2, s * .11, null, '#574235', Math.max(1, s * .035));
  method(ctx, 'restore');
}

class GameRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas || null;
    this.ctx = (canvas && typeof canvas.getContext === 'function' && canvas.getContext('2d')) || noopContext;
    this.width = Math.max(1, n(options.width, 375));
    this.height = Math.max(1, n(options.height, 667));
    this.pixelRatio = Math.max(0.5, n(options.pixelRatio, 1));
    this.quality = options.quality === 'low' ? 'low' : 'high';
    this.showHud = options.showHud !== false;
    // Battle mode is deliberately independent from gallery art.  The
    // authored PNGs remain available to menus/preview screens, while the
    // playable scene uses a deterministic multi-frame vector rig so a single
    // illustration cannot masquerade as animation.
    this.battleArtMode = options.battleArtMode === 'authoredFrames' ? 'authoredFrames' : 'vector';
    this.battleSceneMode = options.battleSceneMode === 'authoredLayers' ? 'authoredLayers' : 'vector';
    // Browser builds can supply the authored transparent SVG hero sprites;
    // wx Canvas keeps the deterministic vector fallback below when SVG is not
    // available. This makes the web slice use real character artwork without
    // adding a runtime network or DOM dependency to the renderer.
    this.heroImages = options.heroImages || {};
    this.skillImages = options.skillImages || {};
    this.skillFxImages = options.skillFxImages || {};
    this.enemyImages = options.enemyImages || {};
    // Scene assets are optional. Browser builds load the authored PNG/SVG
    // layers; the wx adapter can leave this empty and receive the exact same
    // vector scene fallback.
    this.mapImages = options.mapImages || {};
    this.mapAssetDraws = 0;
    this.camera = { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 };
    // The draw buffer owns only temporary references, never simulation order.
    this._enemyDrawList = [];
    // Numeric-only slots are reused; no actor references or unbounded label
    // histories survive a frame. Crowds cannot produce hundreds of badges.
    this._statusBadgeRects = [];
    this._damageLabelRects = [];
    // Numeric-only enemy occlusion rectangles are rebuilt per feedback pass.
    // They are deliberately bounded and never retain enemy references.
    this._damageEnemyRects = [];
    this._bossLabelRects = [];
    // NativeGame paints its CSS-pixel HUD after the world renderer.  Keep the
    // two safe-band edges here and derive bounded world-space rectangles per
    // frame; browser/direct callers remain unchanged when no bounds are set.
    this._hudScreenBounds = null;
    this._hudOcclusionRects = [];
    this._view = { left: 0, top: 0, right: 0, bottom: 0 };
    this._viewCenter = null;
    this.stats = { enemies: 0, projectiles: 0, effects: 0, gems: 0, culledEnemies: 0, culledProjectiles: 0, culledEffects: 0, culledGems: 0, statusCandidates: 0, statusBadges: 0, statusSuppressed: 0,
      damagePlayerCandidates: 0, damagePlayerMoved: 0, damagePlayerUnresolved: 0,
      damageEnemyCandidates: 0, damageEnemyMoved: 0, damageEnemyUnresolved: 0,
      damageBossCandidates: 0, damageBossMoved: 0, damageBossUnresolved: 0,
      damageLabelCandidates: 0, damageLabelMoved: 0, damageLabelUnresolved: 0,
      damageHudCandidates: 0, damageHudMoved: 0, damageHudUnresolved: 0 };
    this.elapsed = 0;
    this.disposed = false;
    if (options.hudScreenBounds) this.setHudScreenBounds(options.hudScreenBounds);
    this.resize(this.width, this.height, this.pixelRatio);
  }

  resize(width, height, pixelRatio = this.pixelRatio) {
    this.width = Math.max(1, n(width, this.width));
    this.height = Math.max(1, n(height, this.height));
    this.pixelRatio = Math.max(0.5, n(pixelRatio, this.pixelRatio));
    if (this.canvas) {
      try { this.canvas.width = Math.round(this.width * this.pixelRatio); } catch (_) { /* read-only in some adapters */ }
      try { this.canvas.height = Math.round(this.height * this.pixelRatio); } catch (_) { /* read-only in some adapters */ }
    }
    return this;
  }

  setQuality(quality) {
    this.quality = quality === 'low' ? 'low' : 'high';
    return this;
  }

  setHudScreenBounds(bounds = null) {
    if (!bounds || typeof bounds !== 'object') { this._hudScreenBounds = null; return this; }
    const width = Math.max(1, this.width), height = Math.max(1, this.height);
    const left = clamp(n(bounds.left, 0), 0, width), right = clamp(n(bounds.right, width), 0, width);
    const top = clamp(n(bounds.top, 0), 0, height), bottom = clamp(n(bounds.bottom, height), 0, height);
    this._hudScreenBounds = { left: Math.min(left, right), right: Math.max(left, right), top, bottom, invalid: bottom < top };
    return this;
  }

  // The world is framed inside the HUD-free band (between the top and
  // bottom UI bars) so the player is never hidden behind the UI when
  // moving to the top or bottom of the view. Falls back to the full
  // canvas when no valid HUD bounds are set. (2026-10-21 playtest change)
  _viewFrame(zoom) {
    const bounds = this._hudScreenBounds;
    const valid = bounds && !bounds.invalid && bounds.right > bounds.left && bounds.bottom > bounds.top;
    const left = valid ? bounds.left : 0, right = valid ? bounds.right : this.width;
    const top = valid ? bounds.top : 0, bottom = valid ? bounds.bottom : this.height;
    return {
      cx: (left + right) / 2, cy: (top + bottom) / 2,
      viewWorldW: (right - left) / zoom, viewWorldH: (bottom - top) / zoom,
    };
  }

  render(state, dt = 0) {
    if (this.disposed || !this.ctx) return;
    const safeState = state || {};
    this.elapsed += clamp(n(dt, 0), 0, 0.1);
    const player = safeState.player || { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2, radius: 18 };
    const mapTheme = themeFor(safeState.stage);
    const zoom = this._zoom(player);
    const frame = this._viewFrame(zoom);
    const viewWorldW = frame.viewWorldW;
    const viewWorldH = frame.viewWorldH;
    this._viewCenter = { x: frame.cx, y: frame.cy };
    const targetX = viewWorldW >= WORLD_SIZE ? WORLD_SIZE / 2 : clamp(n(player.x, WORLD_SIZE / 2), viewWorldW / 2, WORLD_SIZE - viewWorldW / 2);
    const targetY = viewWorldH >= WORLD_SIZE ? WORLD_SIZE / 2 : clamp(n(player.y, WORLD_SIZE / 2), viewWorldH / 2, WORLD_SIZE - viewWorldH / 2);
    const smoothing = this.quality === 'low' || n(dt) <= 0 ? 1 : clamp(n(dt, 0) * 8, 0, 1);
    this.camera.x += (targetX - this.camera.x) * smoothing;
    this.camera.y += (targetY - this.camera.y) * smoothing;
    if (!Number.isFinite(this.camera.x)) this.camera.x = targetX;
    if (!Number.isFinite(this.camera.y)) this.camera.y = targetY;
    this._view.left = this.camera.x - viewWorldW / 2;
    this._view.top = this.camera.y - viewWorldH / 2;
    this._view.right = this.camera.x + viewWorldW / 2;
    this._view.bottom = this.camera.y + viewWorldH / 2;
    this._updateHudOcclusionRects(zoom);
    this.stats.enemies = this.stats.projectiles = this.stats.effects = this.stats.gems = 0;
    this.stats.culledEnemies = this.stats.culledProjectiles = this.stats.culledEffects = this.stats.culledGems = 0;
    this.mapAssetDraws = 0;

    const ctx = this.ctx;
    method(ctx, 'save');
    method(ctx, 'setTransform', this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    paint(ctx, mapTheme.paper);
    method(ctx, 'fillRect', 0, 0, this.width, this.height);
    method(ctx, 'translate', frame.cx, frame.cy);
    method(ctx, 'scale', zoom, zoom);
    method(ctx, 'translate', -this.camera.x, -this.camera.y);
    const mapKey = safeState.battlefield?.mapAssetKey || safeState.stage?.mapAssetKey || null;
    this._drawMap(ctx, mapTheme, mapKey);

    const enemies = this._enemyDrawList;
    enemies.length = 0;
    const sourceEnemies = Array.isArray(safeState.enemies) ? safeState.enemies : EMPTY_LIST;
    const gems = Array.isArray(safeState.gems) ? safeState.gems : EMPTY_LIST;
    const effects = Array.isArray(safeState.effects) ? safeState.effects : EMPTY_LIST;
    const projectiles = Array.isArray(safeState.projectiles) ? safeState.projectiles : EMPTY_LIST;
    for (const enemy of sourceEnemies) {
      if (!enemy) continue;
      const r = clamp(n(enemy.radius, 17), 7, 72);
      // Keep crowns, overhead health/stun markers, and lifted bodies visible
      // even when the enemy's feet are outside the viewport.
      const authored = battleEnemyAnimation(enemy);
      const heightMargin = authored ? r * 3.4 + 4 : r * 2.4 + Math.abs(n(enemy.hopHeight)) * r * .4 + 8;
      if (this._inView(n(enemy.x), n(enemy.y), authored ? r * 3.4 + 4 : r * 1.35 + 4, heightMargin)) enemies.push(enemy);
      else this.stats.culledEnemies += 1;
    }
    enemies.sort(compareEnemyDepth);
    this._layoutBossLabels(enemies, player);
    this.stats.enemies = enemies.length;
    for (const gem of gems) {
      if (!gem) continue;
      const pad = clamp(n(gem.radius, 7), 3, 14) * 1.4 + 2;
      if (this._inView(n(gem.x), n(gem.y), pad)) { this._drawGem(ctx, gem); this.stats.gems += 1; }
      else this.stats.culledGems += 1;
    }
    for (const effect of effects) {
      if (!effect) continue;
      const r = clamp(n(effect.radius, 18), 2, 180);
      // The forward rake lane can enter the viewport while its origin remains
      // outside it; its full length must therefore be included in the bound.
      const pad = battleEnemyAnimation(effect) ? n(effect.bodyRadius, r) * 3.4 + 4 : effect.kind === 'hoe-line'
        ? Math.max(r * 1.4, Math.abs(n(effect.length, r * 2.3)) + r * .12 + Math.abs(n(effect.width, r * .48)) / 2) + 6
        : r * 1.4 + 6;
      if (this._inView(n(effect.x), n(effect.y), pad)) { this._drawEffect(ctx, effect); this.stats.effects += 1; }
      else this.stats.culledEffects += 1;
    }
    for (const projectile of projectiles) {
      if (!projectile) continue;
      const pad = clamp(n(projectile.radius, 7), 2, 24) * 2 + 3;
      if (this._inView(n(projectile.x), n(projectile.y), pad)) { this._drawProjectile(ctx, projectile); this.stats.projectiles += 1; }
      else this.stats.culledProjectiles += 1;
    }
    let playerDrawn = false;
    for (const enemy of enemies) {
      if (!playerDrawn && n(enemy.y) >= n(player.y)) { this._drawPlayer(ctx, player, safeState.character?.id); playerDrawn = true; }
      this._drawEnemy(ctx, enemy, player, mapTheme);
    }
    if (!playerDrawn) this._drawPlayer(ctx, player, safeState.character?.id);
    // Damage labels are the only transient world text that can land on top of
    // the hero silhouette.  Keep the direct helper API unchanged for Node and
    // adapter callers, while the full render pass enables its conservative,
    // finite player-body avoidance.
    this._drawCombatFeedback(ctx, safeState, enemies, { avoidPlayer: true, avoidEnemies: true, avoidBossLabels: true, avoidDamageLabels: true, avoidHud: true });
    method(ctx, 'restore');
    if (this.showHud) this._drawHud(ctx, safeState, mapTheme);
  }

  dispose() {
    this.disposed = true;
    this.canvas = null;
    this.ctx = null;
    this._enemyDrawList.length = 0;
    this._statusBadgeRects.length = 0;
    this._damageLabelRects.length = 0;
    this._damageEnemyRects.length = 0;
    this._bossLabelRects.length = 0;
    this._hudOcclusionRects.length = 0;
    this._hudScreenBounds = null;
  }

  _drawCombatFeedback(ctx, state, enemies, options = {}) {
    const avoidPlayer = options?.avoidPlayer === true;
    const avoidEnemies = options?.avoidEnemies === true;
    const avoidBossLabels = options?.avoidBossLabels === true;
    const avoidDamageLabels = options?.avoidDamageLabels === true;
    const avoidHud = options?.avoidHud === true;
    const playerBox = avoidPlayer ? this._playerOcclusionRect(state?.player) : null;
    const enemyBoxes = avoidEnemies ? this._enemyDamageOcclusionRects(enemies) : (this._damageEnemyRects.length = 0, EMPTY_LIST);
    const bossBoxes = avoidBossLabels ? this._bossLabelRects : EMPTY_LIST;
    const hudBoxes = avoidHud ? this._hudOcclusionRects : EMPTY_LIST;
    this.stats.damagePlayerCandidates = 0;
    this.stats.damagePlayerMoved = 0;
    this.stats.damagePlayerUnresolved = 0;
    this.stats.damageEnemyCandidates = 0;
    this.stats.damageEnemyMoved = 0;
    this.stats.damageEnemyUnresolved = 0;
    this.stats.damageBossCandidates = 0;
    this.stats.damageBossMoved = 0;
    this.stats.damageBossUnresolved = 0;
    this.stats.damageLabelCandidates = 0;
    this.stats.damageLabelMoved = 0;
    this.stats.damageLabelUnresolved = 0;
    this.stats.damageHudCandidates = 0;
    this.stats.damageHudMoved = 0;
    this.stats.damageHudUnresolved = 0;
    const numbers = Array.isArray(state.damageNumbers)
      ? state.damageNumbers
      : Array.isArray(state.floatingTexts) ? state.floatingTexts
        : Array.isArray(state.combatText) ? state.combatText : EMPTY_LIST;
    const damageRects = this._damageLabelRects;
    let damageCount = 0;
    for (const item of numbers) {
      if (!item) continue;
      const x = n(item.x), y = n(item.y), ttl = n(item.ttl, 1), maxTtl = Math.max(.001, n(item.maxTtl, 1));
      const progress = clamp(1 - ttl / maxTtl, 0, 1);
      const text = item.text ?? item.value ?? item.damage;
      if (text == null) continue;
      const rotation = Math.sin((x + y) * .03) * .08;
      method(ctx, 'save');
      ctx.font = `900 ${Math.max(12, Math.min(24, n(item.size, 16)))}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const fill = item.color || (Number(item.value ?? item.damage) >= 100 ? '#ffdd3d' : '#fff0a6');
      // A compact starburst is tied to the same real damage number, so hit
      // feedback cannot outlive or outnumber the simulation's labels.
      const burst = 9 + clamp(Number(item.damage) || 0, 0, 90) * .045;
      // Reserve the number and burst for the later status-badge pass. Store
      // only bounded numeric rectangles, never label/engine references.
      const originalCenterY = y - progress * 28;
      let centerX = x, centerY = originalCenterY;
      let damageRect = null;
      // The production feedback stream is capped at 48 labels. Keep the
      // legacy overflow behavior (draw all labels, reserve only the first 48
      // rectangles) and avoid measuring unbounded legacy collections.
      if (damageCount < MAX_DAMAGE_LABEL_RECTS) {
        const size = clamp(n(item.size, 16), 12, 24), outline = (item.critical ? 3.5 : 2.8) / 2;
        const metrics = method(ctx, 'measureText', String(text));
        const halfWidth = Math.max(n(metrics?.width, String(text).length * size) / 2,
          Math.abs(n(metrics?.actualBoundingBoxLeft)), Math.abs(n(metrics?.actualBoundingBoxRight)));
        const halfHeight = Math.max(size * .6, Math.abs(n(metrics?.actualBoundingBoxAscent)), Math.abs(n(metrics?.actualBoundingBoxDescent)));
        // The star's 1.2-wide miter stroke reaches ~1.55 beyond each tip.
        const w = Math.max(halfWidth + outline, burst + 1.6), h = Math.max(halfHeight + outline, burst + 1.6);
        const cos = Math.abs(Math.cos(rotation)), sin = Math.abs(Math.sin(rotation));
        const rx = cos * w + sin * h, ry = sin * w + cos * h;
        damageRect = { left: centerX - rx, right: centerX + rx, top: centerY - ry, bottom: centerY + ry };
        const playerCollision = Boolean(playerBox && this._rectsOverlap(damageRect, playerBox, 3));
        const enemyCollision = enemyBoxes.some(box => this._rectsOverlap(damageRect, box, 3));
        const bossCollision = bossBoxes.some(box => this._rectsOverlap(damageRect, box, 3));
        const hudCollision = hudBoxes.some(box => this._rectsOverlap(damageRect, box, 3));
        // Damage labels are transient world-space text. When the caller opts
        // into finite number-to-number avoidance, only already accepted
        // rectangles participate; this preserves simulation order and bounds
        // all geometry to MAX_DAMAGE_LABEL_RECTS slots.
        let priorDamageAnchor = null;
        let labelCollision = false;
        if (avoidDamageLabels) {
          for (let i = 0; i < damageCount; i += 1) {
            const box = damageRects[i];
            if (!this._rectsOverlap(damageRect, box, 3)) continue;
            labelCollision = true;
            priorDamageAnchor = box;
            break;
          }
        }
        if (playerCollision || enemyCollision || bossCollision || hudCollision || labelCollision) {
        if (playerCollision) this.stats.damagePlayerCandidates++;
        if (enemyCollision) this.stats.damageEnemyCandidates++;
        if (bossCollision) this.stats.damageBossCandidates++;
        if (hudCollision) this.stats.damageHudCandidates++;
        if (labelCollision) this.stats.damageLabelCandidates++;
        const gap = 4;
        const hudAnchor = hudBoxes.find(box => this._rectsOverlap(damageRect, box, 3));
        const anchor = (playerCollision && playerBox)
          || enemyBoxes.find(box => this._rectsOverlap(damageRect, box, 3))
          || bossBoxes.find(box => this._rectsOverlap(damageRect, box, 3))
          || hudAnchor
          || priorDamageAnchor
          || damageRect;
        const candidates = [
          { x: centerX, y: anchor.top - ry - gap },
          { x: anchor.left - rx - gap, y: centerY },
          { x: anchor.right + rx + gap, y: centerY },
          { x: centerX, y: anchor.bottom + ry + gap },
        ];
        // A hit can overlap an actor and the HUD simultaneously. Actor-only
        // candidates may all remain underneath the HUD despite a clear safe
        // band. Try its two vertical edges first, then retain the four actor
        // candidates: a tall actor may extend beyond the HUD's inner edge.
        // The viewport check rejects outward/off-screen candidates; every
        // accepted candidate still clears ALL registered obstacles below.
        if (hudAnchor && anchor !== hudAnchor) {
          candidates.unshift(
            { x: centerX, y: hudAnchor.top - ry - gap },
            { x: centerX, y: hudAnchor.bottom + ry + gap },
          );
        }
        // Invalid HUD bounds fail closed: the finite full-screen obstacle is
        // intentionally non-evictable, so retain the original label and
        // expose it through the unresolved counter instead of moving it out
        // of the visible viewport.
        const hudFailClosed = hudCollision && this._hudScreenBounds?.invalid === true;
        for (const candidate of hudFailClosed ? EMPTY_LIST : candidates) {
          const rect = { left: candidate.x - rx, right: candidate.x + rx, top: candidate.y - ry, bottom: candidate.y + ry };
          if (playerBox && this._rectsOverlap(rect, playerBox, 3)) continue;
          if (enemyBoxes.some(box => this._rectsOverlap(rect, box, 3))) continue;
          if (bossBoxes.some(box => this._rectsOverlap(rect, box, 3))) continue;
          if (hudBoxes.some(box => this._rectsOverlap(rect, box, 3))) continue;
          if (avoidDamageLabels) {
            let overlapsPrior = false;
            for (let i = 0; i < damageCount; i += 1) {
              if (this._rectsOverlap(rect, damageRects[i], 3)) { overlapsPrior = true; break; }
            }
            if (overlapsPrior) continue;
          }
          if (!this._damageRectInView(rect)) continue;
          centerX = candidate.x; centerY = candidate.y; damageRect = rect;
          if (playerCollision) this.stats.damagePlayerMoved++;
          if (enemyCollision) this.stats.damageEnemyMoved++;
          if (bossCollision) this.stats.damageBossMoved++;
          if (hudCollision) this.stats.damageHudMoved++;
          if (labelCollision) this.stats.damageLabelMoved++;
          break;
        }
        if (centerX === x && centerY === originalCenterY) {
          if (playerCollision) this.stats.damagePlayerUnresolved++;
          if (enemyCollision) this.stats.damageEnemyUnresolved++;
          if (bossCollision) this.stats.damageBossUnresolved++;
          if (hudCollision) this.stats.damageHudUnresolved++;
          if (labelCollision) this.stats.damageLabelUnresolved++;
        }
        }
      }
      if (damageCount < MAX_DAMAGE_LABEL_RECTS) {
        const slot = damageRects[damageCount] || (damageRects[damageCount] = {});
        Object.assign(slot, damageRect);
      }
      method(ctx, 'translate', centerX, centerY); method(ctx, 'rotate', rotation);
      damageCount++;
      method(ctx, 'beginPath'); for (let i = 0; i < 8; i += 1) { const a = i * TAU / 8 + progress * .8; const rr = i % 2 ? burst * .42 : burst; const px = Math.cos(a) * rr, py = Math.sin(a) * rr; if (!i) method(ctx, 'moveTo', px, py); else method(ctx, 'lineTo', px, py); } method(ctx, 'closePath'); paint(ctx, alphaColor(item.critical ? '#ffce31' : '#62e9ff', .48 * (1 - progress * .7)), '#111429', 1.2); method(ctx, 'fill'); method(ctx, 'stroke');
      // Paint the glyph and its own outline last: the filled burst used to
      // cover the digit counters. Restore text paint after the burst stroke.
      paint(ctx, null, '#101020', item.critical ? 3.5 : 2.8); method(ctx, 'strokeText', String(text), 0, 0); paint(ctx, fill); method(ctx, 'fillText', String(text), 0, 0);
      method(ctx, 'restore');
    }
    this._drawStatusBadges(ctx, enemies, state.player, damageRects, damageCount);
  }

  _playerOcclusionRect(player) {
    if (!player) return null;
    const radius = clamp(n(player.radius, 18), 9, 52);
    const x = n(player.x), y = n(player.y);
    return { left: x - radius * 1.5, right: x + radius * 1.5,
      top: y - radius * 2.58, bottom: y + radius * 1.5 };
  }

  _updateHudOcclusionRects(zoom = 1) {
    const rects = this._hudOcclusionRects;
    rects.length = 0;
    const bounds = this._hudScreenBounds;
    if (!bounds) return rects;
    const scale = Math.max(.0001, n(zoom, 1));
    const centerX = this._viewCenter ? this._viewCenter.x : this.width / 2;
    const centerY = this._viewCenter ? this._viewCenter.y : this.height / 2;
    const toWorldX = screenX => this.camera.x + (screenX - centerX) / scale;
    const toWorldY = screenY => this.camera.y + (screenY - centerY) / scale;
    const add = (left, top, right, bottom) => {
      if (rects.length >= MAX_HUD_OCCLUSION_RECTS || right <= left || bottom <= top) return;
      const index = rects.length;
      const slot = rects[index] || {};
      Object.assign(slot, { left: toWorldX(left), right: toWorldX(right), top: toWorldY(top), bottom: toWorldY(bottom) });
      rects[index] = slot;
    };
    if (bounds.invalid) add(0, 0, this.width, this.height);
    else {
      if (bounds.top > 0) add(bounds.left, 0, bounds.right, bounds.top);
      if (bounds.bottom < this.height) add(bounds.left, bounds.bottom, bounds.right, this.height);
    }
    return rects;
  }

  _enemyDamageOcclusionRects(enemies) {
    const rects = this._damageEnemyRects;
    rects.length = 0;
    if (!Array.isArray(enemies)) return rects;
    for (const enemy of enemies) {
      if (!enemy || rects.length >= MAX_DAMAGE_ENEMY_RECTS) break;
      const radius = clamp(n(enemy.radius, 17), 7, 72);
      const x = n(enemy.x), y = n(enemy.y);
      const kind = enemy.kind === 'boss' ? 'boss' : enemy.kind === 'elite' ? 'elite' : 'normal';
      const authored = Boolean(battleEnemyAnimation(enemy));
      const halfX = authored ? radius * 2.3 : kind === 'boss' ? radius * 2 : radius * 1.5;
      const top = y - (authored ? radius * 3.5 : kind === 'boss' ? radius * 2.35 : radius * 2.1);
      const bottom = y + (authored ? radius * 1.45 : kind === 'boss' ? radius * 1.35 : radius * 1.25);
      const bodyIndex = rects.length;
      const body = rects[bodyIndex] || (rects[bodyIndex] = {});
      Object.assign(body, { left: x - halfX, right: x + halfX, top, bottom });
      rects.length = bodyIndex + 1;
      if (rects.length >= MAX_DAMAGE_ENEMY_RECTS) break;
      if (enemy.maxHp > 0 && (kind !== 'normal' || enemy.hp < enemy.maxHp)) {
        const width = radius * (kind === 'boss' ? 3.15 : 2.3);
        const height = Math.max(3, Math.max(20, width) * .08);
        const barIndex = rects.length;
        const bar = rects[barIndex] || (rects[barIndex] = {});
        const barY = this._enemyHealthBarY(enemy, radius);
        Object.assign(bar, { left: x - width / 2, right: x + width / 2, top: barY, bottom: barY + height });
        rects.length = barIndex + 1;
      }
    }
    return rects;
  }

  _rectsOverlap(a, b, gap = 0) {
    return Boolean(a && b && a.left < b.right + gap && a.right > b.left - gap
      && a.top < b.bottom + gap && a.bottom > b.top - gap);
  }

  _damageRectInView(rect) {
    const view = this._view;
    if (!(view.right > view.left && view.bottom > view.top)) return true;
    return rect.left >= view.left && rect.right <= view.right && rect.top >= view.top && rect.bottom <= view.bottom;
  }

  _enemyHealthBarY(enemy, radius) {
    // Authored tiger/bear poses stand taller than the generic vector fallback.
    // Reserve the complete pose envelope, not a crop-dependent/jittery anchor.
    return n(enemy.y) - radius * (battleEnemyAnimation(enemy)?.healthBarOffset || (enemy.kind === 'boss' ? 2.18 : 1.85));
  }

  _layoutBossLabels(enemies, player) {
    const labels = this._bossLabelRects;
    labels.length = 0;
    const view = this._view;
    const playerRadius = clamp(n(player?.radius, 18), 9, 52);
    const playerBox = player ? { left: n(player.x) - playerRadius * 1.5, right: n(player.x) + playerRadius * 1.5,
      top: n(player.y) - playerRadius * 2.2, bottom: n(player.y) + playerRadius * 1.4 } : null;
    const overlaps = (a, b) => a.left < b.right + 4 && a.right > b.left - 4 && a.top < b.bottom + 4 && a.bottom > b.top - 4;
    for (const enemy of enemies) {
      if (!enemy || enemy.kind !== 'boss') continue;
      const radius = clamp(n(enemy.radius, 17), 7, 72), x = n(enemy.x);
      const baseY = n(enemy.y) - radius * 2.75;
      const step = Math.max(24, radius * .72);
      const candidates = [0, -step, step, -step * 2, step * 2, -step * 3, step * 3];
      const slot = labels[labels.length] || (labels[labels.length] = {});
      let chosen = candidates[candidates.length - 1];
      for (const offset of candidates) {
        Object.assign(slot, { id: enemy.id, offset, left: x - 52, right: x + 52, top: baseY + offset - 11, bottom: baseY + offset + 11 });
        if (view.right > view.left && (slot.left < view.left || slot.right > view.right || slot.top < view.top || slot.bottom > view.bottom)) continue;
        if (playerBox && overlaps(slot, playerBox)) continue;
        if (labels.slice(0, labels.length - 1).some(other => overlaps(slot, other))) continue;
        chosen = offset; break;
      }
      Object.assign(slot, { id: enemy.id, offset: chosen, left: x - 52, right: x + 52, top: baseY + chosen - 11, bottom: baseY + chosen + 11 });
    }
  }

  _bossLabelOffset(enemy) {
    const id = enemy?.id;
    for (const slot of this._bossLabelRects) if (slot.id === id) return n(slot.offset, 0);
    return 0;
  }

  _drawStatusBadges(ctx, enemies, player, damageRects = EMPTY_LIST, damageCount = damageRects.length) {
    this.stats.statusCandidates = this.stats.statusBadges = this.stats.statusSuppressed = 0;
    const slots = this._statusBadgeRects, view = this._view;
    const playerRadius = clamp(n(player?.radius, 18), 9, 52);
    const playerBox = player ? { left: n(player.x) - playerRadius * 1.5, right: n(player.x) + playerRadius * 1.5,
      top: n(player.y) - playerRadius * 2.58, bottom: n(player.y) + playerRadius * 1.5 } : null;
    const overlaps = (a, b) => a.left < b.right + 3 && a.right > b.left - 3 && a.top < b.bottom + 3 && a.bottom > b.top - 3;
    // Named threats retain priority. Within a group the existing stable depth
    // order is used; rendering never changes enemy order or gameplay state.
    for (const important of [true, false]) for (const enemy of enemies) {
      if (!enemy || (enemy.kind === 'boss' || enemy.kind === 'elite') !== important) continue;
      const descriptor = enemyStatusBadge(enemy);
      if (!descriptor) continue;
      this.stats.statusCandidates++;
      // Production damage is capped at 48. A larger legacy collection still
      // draws every number, but badges fail closed instead of missing bounds.
      if (this.stats.statusBadges >= MAX_STATUS_BADGES || damageCount > MAX_DAMAGE_LABEL_RECTS) { this.stats.statusSuppressed++; continue; }
      const radius = clamp(n(enemy.radius, 17), 7, 72), x = n(enemy.x);
      const width = descriptor.glyph.length > 1 ? 24 : 16, height = 16;
      let y = this._enemyHealthBarY(enemy, radius) - 11;
      if (enemy.kind === 'boss') y = Math.min(y, n(enemy.y) - radius * 2.05 - 22);
      const slot = slots[this.stats.statusBadges] || (slots[this.stats.statusBadges] = {});
      let placed = false;
      for (const offset of [0, -19, -38]) {
        Object.assign(slot, { left: x - width / 2, right: x + width / 2, top: y + offset - height / 2, bottom: y + offset + height / 2 });
        if (view.right > view.left && (slot.left < view.left || slot.right > view.right || slot.top < view.top || slot.bottom > view.bottom)) continue;
        if (playerBox && overlaps(slot, playerBox)) continue;
        let crowded = false;
        for (let i = 0; i < this.stats.statusBadges; i++) if (overlaps(slot, slots[i])) { crowded = true; break; }
        if (!crowded) for (const label of this._bossLabelRects) if (label.id !== enemy.id && overlaps(slot, label)) { crowded = true; break; }
        if (!crowded) for (let i = 0; i < damageCount; i++) if (overlaps(slot, damageRects[i])) { crowded = true; break; }
        if (crowded) continue;
        this._drawStatusBadge(ctx, descriptor, x, y + offset, width);
        this.stats.statusBadges++; placed = true; break;
      }
      if (!placed) this.stats.statusSuppressed++;
    }
  }

  _drawStatusBadge(ctx, descriptor, x, y, width) {
    method(ctx, 'save'); method(ctx, 'translate', x, y);
    ctx.font = '900 9px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    roundedBox(ctx, -width / 2, -8, width, 16, 6, alphaColor('#201923', .82), descriptor.color, 1);
    paint(ctx, descriptor.color); method(ctx, 'fillText', descriptor.glyph, 0, 0);
    method(ctx, 'restore');
  }

  _inView(x, y, padX, padY = padX) {
    const view = this._view;
    return x + padX >= view.left && x - padX <= view.right && y + padY >= view.top && y - padY <= view.bottom;
  }

  _zoom(player) {
    // World units are intentionally generous for collision math.  This keeps
    // the survivor readable on small phones while still showing an arena ring.
    const base = Math.min(this.width, this.height);
    const radius = clamp(n(player.radius, 18), 8, 42);
    // Keep the four heroes readable at phone scale: their silhouette and
    // weapon should occupy a clear action focal point while the arena still
    // leaves room for incoming mobs.
    // 2026-10-21 playtest change: camera raised 2x — halving the zoom doubles
    // the visible world height (and width) inside a stage.
    return clamp(base / (radius * 14), 1.05, 2.2) / 2;
  }

  _drawMap(ctx, theme, mapKey = null) {
    const themeName = Object.keys(THEMES).find(key => THEMES[key] === theme) || 'forest';
    const left = this._view.left - 80;
    const top = this._view.top - 80;
    const right = this._view.right + 80;
    const bottom = this._view.bottom + 80;
    paint(ctx, theme.paper); method(ctx, 'fillRect', 0, 0, WORLD_SIZE, WORLD_SIZE);
    // Painted chapter scenes (playtest line, 2026-10-22, user-directed):
    // when the stage's authored scene painting has loaded, it IS the
    // battlefield art — one quiet full-world draw under the actors. The
    // vector plate below stays as the pre-load and no-image fallback.
    const scene = this._sceneFor(theme, mapKey);
    const sceneBack = scene?.back || scene?.background || scene;
    if (imageReady(sceneBack)) { this._drawPaintedBattleMap(ctx, theme, sceneBack, left, top, right, bottom); this._drawCaveMouths(ctx, mapKey); return; }
    if (this.battleSceneMode === 'vector') {
      this._drawVectorBattleMap(ctx, theme, left, top, right, bottom, mapKey);
      this._drawCaveMouths(ctx, mapKey);
      return;
    }
    this._drawBackLayer(ctx, theme, left, top, right, bottom, mapKey);
    // Scroll border and route lines
    path(ctx, [['M', 20, 20], ['L', WORLD_SIZE - 20, 20], ['L', WORLD_SIZE - 20, WORLD_SIZE - 20], ['L', 20, WORLD_SIZE - 20], ['Z']], null, alphaColor(theme.ink, .34), 7);
    method(ctx, 'beginPath'); method(ctx, 'moveTo', 60, WORLD_SIZE * .68); method(ctx, 'bezierCurveTo', WORLD_SIZE * .28, WORLD_SIZE * .55, WORLD_SIZE * .38, WORLD_SIZE * .8, WORLD_SIZE * .54, WORLD_SIZE * .67); method(ctx, 'bezierCurveTo', WORLD_SIZE * .7, WORLD_SIZE * .52, WORLD_SIZE * .82, WORLD_SIZE * .64, WORLD_SIZE - 60, WORLD_SIZE * .4); paint(ctx, null, alphaColor(theme.road, .56), 18); method(ctx, 'stroke');
    // Decorative brush tiles are clipped to the visible camera range for a
    // stable frame cost on low-end mini-program devices.
    const step = this.quality === 'low' ? 150 : 108;
    const minX = Math.max(step, Math.floor(left / step) * step);
    const minY = Math.max(step, Math.floor(top / step) * step);
    for (let x = minX; x < Math.min(WORLD_SIZE - step, right); x += step) {
      for (let y = minY; y < Math.min(WORLD_SIZE - step, bottom); y += step) {
        const h = hash2(x / step, y / step);
        if (h < .36) this._drawScenery(ctx, x + (h - .2) * 20, y + (hash2(y, x) - .5) * 20, theme, themeName);
        else if (h < .57) this._drawStone(ctx, x + 12, y - 8, theme);
        else if (h < .69) this._drawCloudMark(ctx, x, y, theme);
      }
    }
    this._drawMidLayer(ctx, theme, left, top, right, bottom, mapKey);
    // Compass-like ink medallion anchors the scroll without looking like a UI
    // logo.  It also remains visible as the camera travels the world.
    circle(ctx, WORLD_SIZE * .5, WORLD_SIZE * .5, 190, null, alphaColor(theme.ink, .08), 3);
    circle(ctx, WORLD_SIZE * .5, WORLD_SIZE * .5, 144, null, alphaColor(theme.ink, .06), 2);
    for (let i = 0; i < 8; i += 1) {
      const a = i * TAU / 8 + .15;
      method(ctx, 'beginPath'); method(ctx, 'moveTo', WORLD_SIZE * .5 + Math.cos(a) * 165, WORLD_SIZE * .5 + Math.sin(a) * 165); method(ctx, 'lineTo', WORLD_SIZE * .5 + Math.cos(a) * 285, WORLD_SIZE * .5 + Math.sin(a) * 285);
      paint(ctx, null, alphaColor(i % 2 ? theme.accent : theme.sticker, .16), 7); method(ctx, 'stroke');
    }
    path(ctx, [['M', WORLD_SIZE * .5, WORLD_SIZE * .5 - 120], ['L', WORLD_SIZE * .5 + 22, WORLD_SIZE * .5], ['L', WORLD_SIZE * .5, WORLD_SIZE * .5 + 120], ['L', WORLD_SIZE * .5 - 22, WORLD_SIZE * .5], ['Z']], null, alphaColor(theme.ink, .12), 2);
    // Camera-edge speed slashes continue the card artwork's strong diagonal
    // energy while leaving the central combat lane readable.
    const cx = this.camera.x, cy = this.camera.y;
    for (let i = 0; i < 9; i += 1) {
      const a = i * TAU / 9 + .17, len = 82 + (i % 3) * 34;
      method(ctx, 'beginPath'); method(ctx, 'moveTo', cx + Math.cos(a) * (len + 46), cy + Math.sin(a) * (len + 46));
      method(ctx, 'lineTo', cx + Math.cos(a) * (len + 142), cy + Math.sin(a) * (len + 142));
      paint(ctx, null, alphaColor(i % 2 ? theme.motif : theme.sticker, .46), 5 + (i % 2) * 2); method(ctx, 'stroke');
    }
    this._drawFrontLayer(ctx, theme, left, top, right, bottom, mapKey);
    this._drawCaveMouths(ctx, mapKey);
  }

  // Cave mouths (playtest line, 2026-10-23): scenes with painted
  // mountains have dark openings at the rock feet — small monsters spawn
  // from them (engine cave spawns), so the decal and the spawn point are
  // the same place. A soft elliptical shadow pool with a near-black core
  // reads as part of the cliff base rather than a pasted sticker.
  _drawCaveMouths(ctx, mapKey) {
    const mouths = CAVE_MOUTHS[mapKey];
    if (!mouths) return;
    for (const [mx, my] of mouths) {
      if (mx < this._view.left - 90 || mx > this._view.right + 90 || my < this._view.top - 90 || my > this._view.bottom + 90) continue;
      method(ctx, 'save'); method(ctx, 'translate', mx, my); method(ctx, 'scale', 1, .58);
      circle(ctx, 0, 0, 34, 'rgba(24,16,10,0.55)', null, 0);
      circle(ctx, 0, 0, 25, 'rgba(10,7,4,0.88)', null, 0);
      circle(ctx, 0, 0, 15, 'rgba(2,2,2,0.95)', null, 0);
      method(ctx, 'restore');
    }
  }

  _drawPaintedBattleMap(ctx, theme, back, left, top, right, bottom) {
    // One quiet cover draw of the authored scene over the whole world — no
    // mid/front sticker layers compete with the actors. A portrait scene
    // (the doublefork valley) is geometry-authored: it is drawn stretched
    // to the full world so its painted ridge and central pass land on the
    // engine's collision ridge (y 700-1100) and corridor (x 790-1010).
    // Square/landscape scenes cover-crop, as the original back layer did.
    const iw = n(back.naturalWidth || back.width, 0), ih = n(back.naturalHeight || back.height, 0);
    const drawn = (iw > 0 && ih > iw)
      ? drawImageIfReady(ctx, back, 0, 0, iw, ih, 0, 0, WORLD_SIZE, WORLD_SIZE)
      : drawImageCover(ctx, back, 0, 0, WORLD_SIZE, WORLD_SIZE);
    if (drawn) this.mapAssetDraws += 1;
    // A light wash keeps the HUD's warm ink palette coherent and the actors
    // the highest-contrast objects on the field.
    paint(ctx, alphaColor(theme.sky, .06));
    method(ctx, 'fillRect', left, top, right - left, bottom - top);
    if (left < 90 || top < 90 || right > WORLD_SIZE - 90 || bottom > WORLD_SIZE - 90) {
      path(ctx, [['M', 26, 26], ['L', WORLD_SIZE - 26, 26], ['L', WORLD_SIZE - 26, WORLD_SIZE - 26], ['L', 26, WORLD_SIZE - 26], ['Z']], null, alphaColor(theme.deep, .40), 12);
      path(ctx, [['M', 52, 52], ['L', WORLD_SIZE - 52, 52], ['L', WORLD_SIZE - 52, WORLD_SIZE - 52], ['L', 52, WORLD_SIZE - 52], ['Z']], null, alphaColor(theme.ink, .20), 3);
    }
  }

  _drawVectorBattleMap(ctx, theme, left, top, right, bottom, mapKey = null) {
    // Calm, readable battlefield plates for the playable scene.  They use
    // the same warm ink/flat-colour language as the Kingdom-Rush-inspired
    // direction, but keep the high-detail gallery paintings out of combat.
    const visibleLeft = Math.max(0, left), visibleTop = Math.max(0, top);
    const visibleRight = Math.min(WORLD_SIZE, right), visibleBottom = Math.min(WORLD_SIZE, bottom);
    paint(ctx, alphaColor(theme.sky, .38));
    method(ctx, 'fillRect', visibleLeft, visibleTop, visibleRight - visibleLeft, visibleBottom - visibleTop);
    // Two quiet clearings frame the first chapter's central ridge.
    if (mapKey === 'doublefork') {
      paint(ctx, alphaColor(theme.paperDark, .18));
      method(ctx, 'fillRect', 0, 90, WORLD_SIZE, 570);
      paint(ctx, alphaColor(theme.paper, .22));
      method(ctx, 'fillRect', 0, 1140, WORLD_SIZE, WORLD_SIZE - 1140);
      // Back ridge silhouette; the stepped contour is deliberately broad so
      // actors remain the highest-contrast objects in the viewport.
      path(ctx, [
        ['M', 0, 760], ['L', 160, 704], ['L', 332, 752], ['L', 520, 676],
        ['L', 704, 742], ['L', 790, 704], ['L', 1010, 704], ['L', 1128, 746],
        ['L', 1310, 682], ['L', 1504, 742], ['L', WORLD_SIZE, 700],
        ['L', WORLD_SIZE, 1115], ['L', 0, 1115], ['Z']
      ], alphaColor(theme.deep, .28), alphaColor(theme.ink, .20), 5);
      // Central pass is the gameplay route through the ridge.
      path(ctx, [['M', 0, 1540], ['C', 420, 1410, 660, 1270, 790, 1100], ['L', 790, 700], ['C', 835, 660, 965, 660, 1010, 700], ['L', 1010, 1100], ['C', 1140, 1270, 1400, 1410, WORLD_SIZE, 1540]], null, alphaColor(theme.ink, .18), 58);
      path(ctx, [['M', 0, 1540], ['C', 420, 1410, 660, 1270, 790, 1100], ['L', 790, 700], ['C', 835, 660, 965, 660, 1010, 700], ['L', 1010, 1100], ['C', 1140, 1270, 1400, 1410, WORLD_SIZE, 1540]], null, alphaColor(theme.road, .58), 38);
      // Cliff faces sit on the sides of the pass; no random diagonal stickers
      // or camera-edge slashes compete with the actors.
      path(ctx, [['M', 0, 1115], ['L', 0, 870], ['L', 250, 910], ['L', 430, 1098], ['L', 640, 1115], ['Z']], alphaColor(theme.deep, .22), alphaColor(theme.ink, .20), 3);
      path(ctx, [['M', WORLD_SIZE, 1115], ['L', WORLD_SIZE, 860], ['L', 1540, 910], ['L', 1360, 1098], ['L', 1160, 1115], ['Z']], alphaColor(theme.deep, .22), alphaColor(theme.ink, .20), 3);
      // A few fixed silhouettes establish depth without a tiled collage.
      method(ctx, 'save'); ctx.globalAlpha = .34;
      [[120,420],[360,520],[1450,420],[1680,520],[170,1370],[1640,1370]].forEach(([x,y]) => this._drawTree(ctx, x, y, theme));
      method(ctx, 'restore');
      // Ink markers at the pass entrance communicate the intended direction.
      circle(ctx, 900, 665, 13, alphaColor(theme.sticker, .84), alphaColor(theme.ink, .70), 3);
      circle(ctx, 900, 1135, 13, alphaColor(theme.sticker, .84), alphaColor(theme.ink, .70), 3);
      return;
    }
    // Other chapters: a quiet themed plate, completed on the playtest line
    // (2026-10-22). The five authored landmarks stay; around them a
    // deterministic, view-culled scatter of themed scenery fills the whole
    // world so no region reads as empty plate, and a double ink border
    // marks the world edge as a deliberate scroll boundary. All vector:
    // mapAssetDraws stays 0 and no image decoding is involved.
    const themeKey = Object.keys(THEMES).find(key => THEMES[key] === theme) || 'forest';
    // Road first (under the scatter): a gentle S across the world.
    path(ctx, [['M', 80, WORLD_SIZE * .76], ['C', WORLD_SIZE * .35, WORLD_SIZE * .56, WORLD_SIZE * .62, WORLD_SIZE * .86, WORLD_SIZE - 80, WORLD_SIZE * .36]], null, alphaColor(theme.ink, .15), 44);
    path(ctx, [['M', 80, WORLD_SIZE * .76], ['C', WORLD_SIZE * .35, WORLD_SIZE * .56, WORLD_SIZE * .62, WORLD_SIZE * .86, WORLD_SIZE - 80, WORLD_SIZE * .36]], null, alphaColor(theme.road, .50), 36);
    // Sampled road points keep scatter off the route so it stays readable.
    const roadPts = [[80, WORLD_SIZE * .76], [520, WORLD_SIZE * .62], [900, WORLD_SIZE * .68], [1280, WORLD_SIZE * .58], [WORLD_SIZE - 80, WORLD_SIZE * .36]];
    method(ctx, 'save'); ctx.globalAlpha = .26;
    const step = 216;
    const minX = Math.max(step, Math.floor(left / step) * step);
    const minY = Math.max(step, Math.floor(top / step) * step);
    for (let x = minX; x < Math.min(WORLD_SIZE - step / 2, right); x += step) {
      for (let y = minY; y < Math.min(WORLD_SIZE - step / 2, bottom); y += step) {
        const h = hash2(x / step, y / step);
        const px = x + (h - .5) * 90, py = y + (hash2(y, x) - .5) * 90;
        if (roadPts.some(([rx, ry]) => (px - rx) * (px - rx) + (py - ry) * (py - ry) < 150 * 150)) continue;
        if (h < .30) this._drawScenery(ctx, px, py, theme, themeKey);
        else if (h < .42) this._drawStone(ctx, px + 12, py - 8, theme);
        else if (h < .50) this._drawCloudMark(ctx, px, py, theme);
      }
    }
    method(ctx, 'restore');
    method(ctx, 'save'); ctx.globalAlpha = .30;
    const landmarks = [[180,220],[510,420],[1450,280],[1650,1380],[260,1460]];
    landmarks.forEach(([x,y]) => this._drawScenery(ctx, x, y, theme, themeKey));
    method(ctx, 'restore');
    // World boundary: nested ink borders, drawn only where the view reaches.
    if (left < 90 || top < 90 || right > WORLD_SIZE - 90 || bottom > WORLD_SIZE - 90) {
      path(ctx, [['M', 26, 26], ['L', WORLD_SIZE - 26, 26], ['L', WORLD_SIZE - 26, WORLD_SIZE - 26], ['L', 26, WORLD_SIZE - 26], ['Z']], null, alphaColor(theme.deep, .40), 12);
      path(ctx, [['M', 52, 52], ['L', WORLD_SIZE - 52, 52], ['L', WORLD_SIZE - 52, WORLD_SIZE - 52], ['L', 52, WORLD_SIZE - 52], ['Z']], null, alphaColor(theme.ink, .20), 3);
    }
  }

  _sceneFor(theme, mapKey = null) {
    const themeName = Object.keys(THEMES).find(key => THEMES[key] === theme) || 'forest';
    return this.mapImages?.[mapKey] || this.mapImages?.[themeName] || this.mapImages?.default || null;
  }

  _drawBackLayer(ctx, theme, left, top, right, bottom, mapKey = null) {
    // Large, quiet silhouettes sit behind the route. Their offset is derived
    // from the camera tile so the scroll feels layered without parallax state.
    const themeName = Object.keys(THEMES).find(key => THEMES[key] === theme) || 'forest';
    const scene = this._sceneFor(theme, mapKey);
    const back = scene?.back || scene?.background || scene;
    if (drawImageCover(ctx, back, 0, 0, WORLD_SIZE, WORLD_SIZE)) {
      this.mapAssetDraws += 1;
      // A light paper wash keeps the HUD's warm ink palette coherent while
      // preserving the hand-painted map's focal values.
      paint(ctx, alphaColor(theme.sky, .08));
      method(ctx, 'fillRect', left, top, right - left, bottom - top);
    } else {
      paint(ctx, alphaColor(theme.sky, .52));
      method(ctx, 'fillRect', left, top, right - left, bottom - top);
    }
    const span = 280;
    const startX = Math.floor(left / span) * span - span;
    const startY = Math.floor(top / span) * span - span;
    for (let x = startX; x < right + span; x += span) {
      for (let y = startY; y < bottom + span; y += span) {
        const h = hash2(x * .006, y * .006);
        if (h < .48) {
          circle(ctx, x + span * .2, y + span * .22, 36 + h * 24, alphaColor(theme.deep, .2));
          circle(ctx, x + span * .38, y + span * .15, 54 + h * 20, alphaColor(theme.deep, .16));
        } else {
          path(ctx, [['M', x - 65, y + 32], ['Q', x + 8, y - 58, x + 88, y + 28], ['L', x + 88, y + 70], ['L', x - 65, y + 70], ['Z']], alphaColor(theme.deep, .08));
        }
      }
    }
  }

  _drawMidLayer(ctx, theme, left, top, right, bottom, mapKey = null) {
    // Ink ribbons and color blocks give each chapter a readable midground.
    const scene = this._sceneFor(theme, mapKey);
    const mid = scene?.mid;
    if (imageReady(mid)) {
      method(ctx, 'save');
      ctx.globalAlpha = .12;
      if (drawImageCover(ctx, mid, left, top, right - left, bottom - top)) this.mapAssetDraws += 1;
      method(ctx, 'restore');
    }
    const span = 196;
    const startX = Math.floor(left / span) * span - span;
    const startY = Math.floor(top / span) * span - span;
    for (let x = startX; x < right + span; x += span) {
      for (let y = startY; y < bottom + span; y += span) {
        const h = hash2(x * .021, y * .017);
        if (h < .24) {
          // Brush blocks use chipped outer edges, slashes and black ink dots.
          path(ctx, [['M', x - 49, y + 17], ['L', x - 25, y - 12], ['L', x - 29, y - 22], ['L', x + 20, y - 34], ['L', x + 17, y - 19], ['L', x + 76, y - 9], ['L', x + 53, y + 18], ['L', x + 61, y + 24], ['L', x + 4, y + 62], ['L', x + 14, y + 37], ['Z']], alphaColor(theme.accent, .54), alphaColor(theme.ink, .82), 2.2);
          method(ctx, 'beginPath'); method(ctx, 'moveTo', x - 45, y + 38); method(ctx, 'lineTo', x + 72, y - 20); paint(ctx, null, alphaColor(theme.ink, .77), 5); method(ctx, 'stroke');
          circle(ctx, x + 83, y + 1, 3, alphaColor(theme.ink, .8)); circle(ctx, x - 38, y - 31, 2, alphaColor(theme.ink, .8));
        } else if (h > .86) {
          // A small sticker-like seal, deliberately asymmetric like hand ink.
          method(ctx, 'beginPath');
          for (let i = 0; i < 8; i += 1) {
            const a = i * TAU / 8;
            const rr = i % 2 ? 11 : 20;
            const px = x + 34 + Math.cos(a) * rr, py = y - 18 + Math.sin(a) * rr;
            if (i === 0) method(ctx, 'moveTo', px, py); else method(ctx, 'lineTo', px, py);
          }
          method(ctx, 'closePath'); paint(ctx, alphaColor(theme.sticker, .9), alphaColor(theme.ink, .92), 2.3); method(ctx, 'fill'); method(ctx, 'stroke');
          if (this.showHud) { method(ctx, 'save'); ctx.font='900 12px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; paint(ctx, theme.ink); method(ctx, 'fillText', '行', x + 34, y - 17); method(ctx, 'restore'); }
        } else if (h > .59 && h < .68) {
          // Short rough black brush tails, never a uniform tiled texture.
          for (let j = 0; j < 3; j += 1) { method(ctx, 'beginPath'); method(ctx, 'moveTo', x - 31 + j * 3, y + 21 + j * 8); method(ctx, 'lineTo', x + 30 - j * 11, y - 11 + j * 10); paint(ctx, null, alphaColor(theme.ink, .68 - j * .1), 4 - j); method(ctx, 'stroke'); }
        }
      }
    }
  }

  _drawFrontLayer(ctx, theme, left, top, right, bottom, mapKey = null) {
    // Foreground brush marks are clipped by the camera bounds by construction.
    const scene = this._sceneFor(theme, mapKey);
    const front = scene?.front;
    // The authored scene preview is used as a low-opacity foreground wash so
    // its hand-drawn roof/foliage silhouettes stay readable without covering
    // combatants. It is drawn after the midground, before actors are sorted.
    if (imageReady(front)) {
      method(ctx, 'save');
      ctx.globalAlpha = .2;
      if (drawImageCover(ctx, front, left, bottom - Math.min(300, bottom - top), right - left, Math.min(300, bottom - top))) this.mapAssetDraws += 1;
      method(ctx, 'restore');
    }
    const span = 142;
    const startX = Math.floor(left / span) * span;
    const startY = Math.floor(top / span) * span;
    for (let x = startX; x < right + span; x += span) {
      const h = hash2(x * .031, 4.2);
      if (h < .34) {
        const y = bottom - 18 - h * 20;
        method(ctx, 'beginPath');
        method(ctx, 'moveTo', x, y + 30); method(ctx, 'lineTo', x + 10, y - 8); method(ctx, 'lineTo', x + 18, y + 25);
        method(ctx, 'moveTo', x + 9, y + 30); method(ctx, 'lineTo', x + 32, y + 3); method(ctx, 'lineTo', x + 40, y + 28);
        paint(ctx, null, alphaColor(theme.deep, .65), 4); method(ctx, 'stroke');
      }
    }
    for (let y = startY; y < bottom + span; y += span) {
      const h = hash2(9.8, y * .029);
      if (h > .72) {
        method(ctx, 'beginPath'); method(ctx, 'moveTo', left - 10, y + 14); method(ctx, 'lineTo', left + 48, y - 18); method(ctx, 'lineTo', left + 82, y + 10);
        paint(ctx, null, alphaColor(theme.accent, .6), 3); method(ctx, 'stroke');
      }
    }
  }

  _drawScenery(ctx, x, y, theme, themeName) {
    if (themeName === 'forest') { this._drawTree(ctx, x, y, theme); return; }
    if (themeName === 'snow') {
      paint(ctx, alphaColor(theme.ink, .25)); method(ctx, 'fillRect', x - 3, y + 6, 6, 26);
      path(ctx, [['M', x, y - 28], ['L', x - 19, y + 16], ['L', x + 19, y + 16], ['Z']], alphaColor(theme.leaf, .66), alphaColor(theme.ink, .3), 2);
      path(ctx, [['M', x, y - 28], ['L', x - 11, y - 2], ['L', x - 3, y - 4], ['L', x + 5, y + 1], ['L', x + 11, y - 2], ['Z']], '#eaf2df', null);
      return;
    }
    if (themeName === 'sand') {
      path(ctx, [['M', x - 28, y + 16], ['Q', x - 6, y - 1, x + 28, y + 16]], null, alphaColor(theme.motif, .4), 2);
      method(ctx, 'beginPath'); method(ctx, 'moveTo', x, y + 18); method(ctx, 'lineTo', x, y - 23); method(ctx, 'moveTo', x, y - 2); method(ctx, 'lineTo', x - 14, y - 2); method(ctx, 'lineTo', x - 14, y - 14); method(ctx, 'moveTo', x, y + 4); method(ctx, 'lineTo', x + 13, y + 4); method(ctx, 'lineTo', x + 13, y - 11); paint(ctx, null, alphaColor(theme.leaf, .76), 7); ctx.lineCap = 'round'; method(ctx, 'stroke'); ctx.lineCap = 'butt';
      return;
    }
    if (themeName === 'fire') {
      path(ctx, [['M', x - 28, y + 18], ['L', x - 12, y - 5], ['L', x - 7, y + 2], ['L', x + 3, y - 23], ['L', x + 22, y + 18], ['Z']], alphaColor(theme.ink, .32), alphaColor(theme.ink, .33), 2);
      path(ctx, [['M', x + 3, y - 20], ['L', x - 2, y - 3], ['L', x + 6, y + 1], ['L', x + 11, y + 17]], null, alphaColor('#f0984f', .55), 3);
      return;
    }
    if (themeName === 'water') {
      for (let i = 0; i < 3; i += 1) path(ctx, [['M', x - 26 + i * 4, y + i * 8], ['Q', x - 10, y - 8 + i * 8, x + 4, y + i * 8], ['Q', x + 14, y + 8 + i * 8, x + 25 - i * 4, y + i * 8]], null, alphaColor(theme.motif, .38), 2);
      method(ctx, 'beginPath'); method(ctx, 'moveTo', x - 15, y - 8); method(ctx, 'lineTo', x - 16, y - 27); method(ctx, 'moveTo', x - 10, y - 5); method(ctx, 'lineTo', x - 8, y - 24); paint(ctx, null, alphaColor(theme.leaf, .66), 3); method(ctx, 'stroke');
      return;
    }
    // small roadside pagodas on the temple scroll
    roundedBox(ctx, x - 14, y - 1, 28, 31, 2, alphaColor(theme.paperDark, .64), alphaColor(theme.ink, .33), 2);
    path(ctx, [['M', x - 25, y - 2], ['Q', x - 13, y - 3, x, y - 20], ['Q', x + 13, y - 3, x + 25, y - 2], ['L', x - 25, y - 2], ['Z']], alphaColor(theme.motif, .5), alphaColor(theme.ink, .28), 2);
    roundedBox(ctx, x - 4, y + 9, 8, 17, 2, alphaColor(theme.ink, .22), null);
  }

  _drawTree(ctx, x, y, theme) {
    paint(ctx, alphaColor(theme.ink, .23)); method(ctx, 'fillRect', x - 4, y + 8, 8, 22);
    circle(ctx, x - 11, y, 15, alphaColor(theme.leaf, .58), alphaColor(theme.ink, .2), 1.5);
    circle(ctx, x + 7, y - 4, 17, alphaColor(theme.leaf, .64), alphaColor(theme.ink, .2), 1.5);
    circle(ctx, x, y - 17, 16, alphaColor(theme.leaf, .72), alphaColor(theme.ink, .2), 1.5);
  }

  _drawStone(ctx, x, y, theme) {
    path(ctx, [['M', x - 18, y + 8], ['L', x - 10, y - 9], ['L', x + 8, y - 14], ['L', x + 18, y + 7], ['L', x + 8, y + 14], ['Z']], alphaColor(theme.paperDark, .7), alphaColor(theme.ink, .25), 2);
    method(ctx, 'beginPath'); method(ctx, 'moveTo', x - 7, y - 6); method(ctx, 'lineTo', x + 7, y - 2); paint(ctx, null, alphaColor(theme.ink, .18), 1.4); method(ctx, 'stroke');
  }

  _drawCloudMark(ctx, x, y, theme) {
    method(ctx, 'beginPath'); method(ctx, 'moveTo', x - 24, y); method(ctx, 'quadraticCurveTo', x - 10, y - 10, x, y); method(ctx, 'quadraticCurveTo', x + 10, y - 11, x + 24, y); method(ctx, 'quadraticCurveTo', x + 10, y + 8, x, y); method(ctx, 'quadraticCurveTo', x - 10, y + 8, x - 24, y); paint(ctx, null, alphaColor(theme.motif, .28), 2); method(ctx, 'stroke');
  }

  _drawGem(ctx, gem) {
    const x = n(gem.x), y = n(gem.y), r = clamp(n(gem.radius, 7), 3, 14);
    const color = gem.kind === 'heal' ? '#d56b61' : gem.kind === 'magnet' ? '#7d89d9' : gem.kind === 'coin' ? '#e8b84e' : '#79c9a7';
    const pulse = 1 + Math.sin(this.elapsed * 4 + x * .013 + y * .009) * .08;
    circle(ctx, x, y + r * .3, r * .75, alphaColor('#3e423b', .22));
    path(ctx, [['M', x, y - r * pulse], ['L', x + r * .74, y], ['L', x, y + r * 1.18], ['L', x - r * .74, y], ['Z']], color, '#4b4639', 1.3);
    path(ctx, [['M', x, y - r * pulse], ['L', x, y + r * 1.18], ['L', x + r * .74, y], ['Z']], alphaColor('#fff8d8', .35));
  }

  _drawProjectile(ctx, projectile) {
    const x = n(projectile.x), y = n(projectile.y), radius = clamp(n(projectile.radius, 7), 2, 24);
    const projectileKind = String(projectile.kind || '').toLowerCase();
    const color = projectile.color || (projectileKind === 'holy' || projectileKind.includes('light') ? '#35d7ff' : projectileKind.includes('bird') ? '#ff6338' : projectileKind.includes('fire') ? '#ffb52e' : '#f3d34a');
    const angle = Math.atan2(n(projectile.vy), n(projectile.vx));
    method(ctx, 'save'); method(ctx, 'translate', x, y); method(ctx, 'rotate', Number.isFinite(angle) ? angle : 0);
    if (projectileKind === 'light-orb') {
      // Authored orb strip: a pulsing painted orb replaces the vector orb
      // once loaded; the pulse loops on renderer time while it flies.
      const fxImage = this.skillFxImages?.['light-orb'];
      const fxRect = fxImage && skillFxFrameRect(fxImage, (this.elapsed * 1.6) % 1);
      if (fxRect) {
        const size = radius * 5.2;
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h, -size / 2, -size / 2, size, size);
        method(ctx, 'restore');
        return;
      }
    }
    if (projectileKind === 'fire-wheel' || projectileKind === 'ring' || projectileKind === 'ring-child') {
      // Painted artifact projectiles (batch 2): the wind-fire wheel and the
      // Qiankun ring spin on renderer time while they fly/bounce.
      const fxId = projectileKind === 'fire-wheel' ? 'fire-wheel' : 'ring-spin';
      const fxImage = this.skillFxImages?.[fxId];
      const fxRect = fxImage && skillFxFrameRect(fxImage, (this.elapsed * (fxId === 'fire-wheel' ? 2.4 : 2)) % 1);
      if (fxRect) {
        const size = radius * (fxId === 'fire-wheel' ? 4.6 : 3.8);
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h, -size / 2, -size / 2, size, size);
        method(ctx, 'restore');
        return;
      }
    }
    circle(ctx, 0, 0, radius * 1.4, alphaColor(color, .18));
    if (projectileKind.includes('bird')) {
      path(ctx, [['M', -radius * 1.5, 0], ['Q', -radius * .2, -radius * 1.2, radius * 1.7, 0], ['Q', -radius * .2, radius * 1.2, -radius * 1.5, 0], ['Z']], color, '#703a2a', 1.2);
      circle(ctx, radius * .8, -radius * .16, radius * .12, '#fff4bd');
    } else if (projectileKind.includes('needle')) {
      path(ctx, [['M', -radius * 2.4, 0], ['L', radius * 1.7, -radius * .45], ['L', radius * 2.4, 0], ['L', radius * 1.7, radius * .45], ['Z']], color, '#2f2930', 1.3);
      method(ctx, 'beginPath'); method(ctx, 'moveTo', -radius * 2.1, 0); method(ctx, 'lineTo', radius * 1.9, 0); paint(ctx, null, '#fff6b8', 1.2); method(ctx, 'stroke');
    } else if (projectileKind.includes('fan')) {
      path(ctx, [['M', -radius * .8, radius * .2], ['Q', 0, -radius * 2, radius * 1.7, -radius * .3], ['L', radius * 1.1, radius * .55], ['Z']], color, '#273b3c', 1.5);
      for (let i = 0; i < 3; i += 1) { method(ctx, 'beginPath'); method(ctx, 'moveTo', radius * (.1 + i * .3), -radius * .3); method(ctx, 'lineTo', radius * (1.3 + i * .15), radius * (.4 + i * .08)); paint(ctx, null, '#fff0a6', 1); method(ctx, 'stroke'); }
    } else if (projectileKind.includes('diamond') || projectileKind.includes('mirror')) {
      path(ctx, [['M', 0, -radius * 1.25], ['L', radius * .8, 0], ['L', 0, radius * 1.25], ['L', -radius * .8, 0], ['Z']], color, '#263650', 1.5);
      path(ctx, [['M', 0, -radius * .8], ['L', radius * .35, 0], ['L', 0, radius * .7], ['Z']], '#fff4a8', null);
    } else if (projectileKind === 'fire-wheel' || projectileKind.includes('fire-wheel')) {
      circle(ctx, 0, 0, radius * 1.15, '#e84c32', '#3c2029', 1.6);
      circle(ctx, 0, 0, radius * .62, null, '#ffd34c', Math.max(2, radius * .18));
      for (let i = 0; i < 6; i += 1) { const a = i * TAU / 6; method(ctx, 'beginPath'); method(ctx, 'moveTo', Math.cos(a) * radius * .2, Math.sin(a) * radius * .2); method(ctx, 'lineTo', Math.cos(a) * radius * 1.18, Math.sin(a) * radius * 1.18); paint(ctx, null, '#ffec8c', 1.3); method(ctx, 'stroke'); }
    } else if (projectileKind === 'ring' || projectileKind.includes('ring-child')) {
      circle(ctx, 0, 0, radius, null, color, Math.max(2, radius * .36));
      circle(ctx, 0, 0, radius * .66, null, '#fff4c5', Math.max(1, radius * .1));
    } else if (projectileKind === 'light-orb' || projectileKind.includes('holy')) {
      // A real traveling light orb carries a tapered comic trail. Its length
      // is visual only; collision remains the engine's original radius.
      path(ctx, [['M', -radius * 4.6, -radius * .15], ['L', -radius * .6, -radius * .9], ['L', radius * .35, 0], ['L', -radius * .6, radius * .9], ['Z']], alphaColor('#3de2ff', .52), '#0f2d55', 1.4);
      path(ctx, [['M', -radius * 3.8, 0], ['L', -radius * .25, -radius * .38], ['L', radius * .4, 0], ['L', -radius * .25, radius * .38], ['Z']], '#d9ffff', null);
      circle(ctx, 0, 0, radius * 1.32, '#47e9ff', '#12355f', 2); circle(ctx, 0, 0, radius * .85, '#f5ffff', '#81eeff', 2);
      for (let i=0;i<3;i+=1) { method(ctx, 'beginPath');method(ctx,'moveTo',-radius*(2.4+i*.5),radius*(1.2+i*.45));method(ctx,'lineTo',-radius*(.9+i*.4),radius*(1.15+i*.35));paint(ctx,null,'#9effff',1.4);method(ctx,'stroke'); }
    } else if (projectileKind === 'rake' || projectileKind === 'slash') {
      path(ctx, [['M', -radius * 1.4, -radius * .5], ['L', radius * 1.8, 0], ['L', -radius * 1.4, radius * .5], ['Z']], color, '#4d4136', 1.2);
    } else {
      circle(ctx, 0, 0, radius, color, '#514033', 1.4);
      circle(ctx, -radius * .25, -radius * .28, radius * .28, alphaColor('#ffffff', .52));
    }
    method(ctx, 'restore');
  }

  _drawEffect(ctx, effect) {
    const x = n(effect.x), y = n(effect.y), radius = clamp(n(effect.radius, 18), 2, 180);
    const ttl = n(effect.ttl, 0), maxTtl = Math.max(.001, n(effect.maxTtl, ttl || 1));
    const progress = clamp(1 - ttl / maxTtl, 0, 1);
    const fade = clamp(ttl / maxTtl, .1, 1);
    const color = effect.color || '#e9c565';
    const kind = String(effect.kind || '').toLowerCase();
    method(ctx, 'save'); method(ctx, 'translate', x, y);
    const actor = battleEnemyAnimation(effect), authoredSprite = this.enemyImages?.[actor?.variant];
    const authoredFrame = kind === 'death' && actor && this.battleArtMode === 'authoredFrames'
      && imageReady(authoredSprite) && actor.drawFrame(authoredSprite, 'death', effect.frameIndex, effect.bodyRadius);
    if (authoredFrame) {
      circle(ctx, 0, effect.bodyRadius * .7, effect.bodyRadius * .72, alphaColor('#382f2b', .2));
      method(ctx, 'scale', (Math.cos(n(effect.facing)) < 0 ? -1 : 1) * (authoredFrame.mirrorX ? -1 : 1), 1);
      ctx.globalAlpha = n(ctx.globalAlpha, 1) * (progress > .75 ? (1 - progress) * 4 : 1);
      method(ctx, 'drawImage', authoredSprite, authoredFrame.x, authoredFrame.y, authoredFrame.w, authoredFrame.h,
        authoredFrame.dx, authoredFrame.dy, authoredFrame.dw, authoredFrame.dh);
      method(ctx, 'restore');
      return;
    }
    // Authored skill-effect strips: signature-weapon effects prefer their
    // painted strip once it has loaded; the frame follows the effect's
    // own progress so animation and gameplay timing stay locked.  Any
    // other kind, or an unloaded strip, falls through to the vector
    // effects below unchanged.
    const fxId = skillFxIdForEffect(kind);
    const fxImage = fxId && this.skillFxImages?.[fxId];
    // The samadhi-fire burst ('mountain') telegraphs with a falling rock
    // during its delay — the vector branch keeps that phase; the painted
    // burst takes over only once the burst itself starts.
    const fxDelay = fxId === 'fire-burst' ? n(effect.delay, 0) : 0;
    const fxAge = maxTtl - ttl;
    const fxPhase = fxId === 'fire-burst' && fxDelay > 0 ? clamp((fxAge - fxDelay) / Math.max(.001, maxTtl - fxDelay), 0, 1) : progress;
    const fxRect = fxImage && fxAge >= fxDelay && skillFxFrameRect(fxImage, fxPhase);
    if (fxRect) {
      ctx.globalAlpha = n(ctx.globalAlpha, 1) * fade;
      if (fxId === 'monkey-clone') {
        // The wooden monkey clones scamper outward: run cycle on renderer
        // time, flipped to face their travel direction.
        const rect = skillFxFrameRect(fxImage, (this.elapsed * 3) % 1) || fxRect;
        const size = radius * 3.6;
        if (n(effect.vx) < 0) method(ctx, 'scale', -1, 1);
        method(ctx, 'drawImage', fxImage, rect.x, rect.y, rect.w, rect.h, -size / 2, -size / 2, size, size);
      } else if (fxId === 'whirl-pool') {
        const rect = skillFxFrameRect(fxImage, (this.elapsed * 2.2) % 1) || fxRect;
        const size = radius * 2.6;
        method(ctx, 'drawImage', fxImage, rect.x, rect.y, rect.w, rect.h, -size / 2, -size / 2, size, size);
      } else if (fxId === 'gold-bead' || fxId === 'fire-pool') {
        // Looping props: the rope bead pulses and the fire pool flickers on
        // renderer time; both are drawn centered on the effect position.
        const rect = skillFxFrameRect(fxImage, (this.elapsed * (fxId === 'gold-bead' ? 1.8 : 2.6)) % 1) || fxRect;
        const size = radius * (fxId === 'gold-bead' ? 3.2 : 2.7);
        method(ctx, 'drawImage', fxImage, rect.x, rect.y, rect.w, rect.h, -size / 2, -size / 2, size, size);
      } else if (fxId === 'fan-wave' || fxId === 'gourd-vortex') {
        // Cone effects: the strip's narrow point sits at the effect origin
        // and the cone widens along +X after rotation.  The gourd vortex
        // lives for seconds, so its frames cycle on renderer time instead
        // of the one-shot progress.
        const rect = fxId === 'gourd-vortex' ? (skillFxFrameRect(fxImage, (this.elapsed * 1.3) % 1) || fxRect) : fxRect;
        const size = radius * 2;
        method(ctx, 'rotate', n(effect.angle));
        method(ctx, 'drawImage', fxImage, rect.x, rect.y, rect.w, rect.h,
          -size * .06, -size / 2, size, size);
      } else if (fxId === 'palm-burst') {
        // The painted palm faces up in its cell; rotate so it strikes
        // outward along the effect angle.
        const size = radius * 2.6;
        method(ctx, 'rotate', n(effect.angle) + Math.PI / 2);
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h, -size / 2, -size / 2, size, size);
      } else if (fxId === 'fire-burst') {
        const size = radius * 2.3;
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h, -size / 2, -size / 2, size, size);
      } else if (fxId === 'rake-sweep') {
        const length = n(effect.length, radius * 2.3), width = n(effect.width, radius * .48);
        method(ctx, 'rotate', n(effect.angle));
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h,
          -radius * .3, -width * 1.1, length + radius * .6, width * 2.2);
      } else if (fxId === 'water-ring') {
        const size = radius * 2.3;
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h, -size / 2, -size / 2, size, size);
      } else {
        method(ctx, 'rotate', n(effect.angle, 0));
        const size = radius * 2.2;
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h, -size / 2, -size / 2, size, size);
      }
      method(ctx, 'restore');
      return;
    }
    if (kind === 'cave-dust') {
      // A monster emerges from a cave mouth: an expanding dusty ring and
      // a low puff in earth tones, gone in about half a second.
      const ring = radius * (.5 + progress * 1.15);
      circle(ctx, 0, 0, ring, null, alphaColor(color, .55 * fade), 3);
      circle(ctx, 0, -radius * .16 * progress, ring * .62, alphaColor(color, .30 * fade), null, 0);
      for (let i = 0; i < 6; i += 1) {
        const a = i * TAU / 6 + .4;
        circle(ctx, Math.cos(a) * ring * .8, Math.sin(a) * ring * .45 - progress * 6, radius * .12, alphaColor(color, .5 * fade), null, 0);
      }
    } else if (kind === 'hit-burst') {
      // Each burst comes from a real damageEnemy call and expires after 260ms.
      const outer = radius * (.75 + progress * .52);
      method(ctx, 'beginPath');
      for (let i=0;i<12;i+=1) { const a=i*TAU/12,rr=i%2?outer*.47:outer; const px=Math.cos(a)*rr,py=Math.sin(a)*rr; if(!i)method(ctx,'moveTo',px,py);else method(ctx,'lineTo',px,py); }
      method(ctx, 'closePath');paint(ctx,alphaColor(color,.78*fade),'#111429',2.1);method(ctx,'fill');method(ctx,'stroke');
      circle(ctx,0,0,radius*.34,'#ffffdb','#182030',1.1);
      for (let i=0;i<5;i+=1){const a=i*TAU/5;method(ctx,'beginPath');method(ctx,'moveTo',Math.cos(a)*outer*1.15,Math.sin(a)*outer*1.15);method(ctx,'lineTo',Math.cos(a)*outer*1.52,Math.sin(a)*outer*1.52);paint(ctx,null,'#ffe451',1.5);method(ctx,'stroke');}
    } else if (kind === 'death' || kind === 'death-burst') {
      const frame = animationFrame(effect);
      const frames = Math.max(1, Number(effect.animationFrames) || 6);
      const t = clamp((frame + progress * frames) / frames, 0, 1);
      const rays = 6 + Math.min(6, frame);
      const outer = radius * (.72 + t * 1.2);
      circle(ctx, 0, 0, radius * (.35 + t * .42), alphaColor(color, .45 * (1 - progress * .7)), alphaColor('#fff2a8', .9 * (1 - progress)), 2.2);
      for (let i = 0; i < rays; i += 1) {
        const a = i * TAU / rays + t * .7;
        method(ctx, 'beginPath'); method(ctx, 'moveTo', Math.cos(a) * radius * .32, Math.sin(a) * radius * .32);
        method(ctx, 'lineTo', Math.cos(a) * outer, Math.sin(a) * outer);
        paint(ctx, null, alphaColor(effect.final ? '#fff2a8' : color, .85 * (1 - progress)), Math.max(1.4, radius * .07)); method(ctx, 'stroke');
      }
      ctx.font = `900 ${Math.max(10, radius * .45)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      paint(ctx, '#fff0a6'); method(ctx, 'fillText', effect.final ? '破' : '击破', 0, -radius * 1.05);
    } else if (kind.includes('warning') || kind.includes('danger') || kind.includes('telegraph')) {
      circle(ctx, 0, 0, radius, alphaColor('#c74c42', .12 + progress * .14), alphaColor('#a93533', .7), 2);
      circle(ctx, 0, 0, radius * progress, null, alphaColor('#e97851', .62), 3);
    } else if (kind.includes('slash') || kind.includes('sweep') || (kind.includes('fan') && kind !== 'fan') || kind.includes('heavy')) {
      const angle = n(effect.angle, 0); method(ctx, 'rotate', angle);
      method(ctx, 'beginPath');
      method(ctx, 'arc', 0, 0, radius, -.56, .56);
      paint(ctx, null, alphaColor(color, .82 * fade), Math.max(2, radius * .075));
      method(ctx, 'stroke');
      path(ctx, [['M', radius * .65, -radius * .35], ['Q', radius * 1.08, 0, radius * .65, radius * .35]], null, alphaColor('#fff0bc', .7 * fade), Math.max(1.5, radius * .035));
      if (kind.includes('heavy')) circle(ctx, radius * .75, 0, radius * .18, alphaColor('#fff5bb', .65 * fade));
    } else if (kind === 'hoe-line') {
      const length = n(effect.length, radius * 2.3), width = n(effect.width, radius * .48);
      method(ctx, 'rotate', n(effect.angle));
      path(ctx, [['M', 0, -width / 2], ['L', length, -width / 2], ['L', length + radius * .12, 0], ['L', length, width / 2], ['L', 0, width / 2], ['Z']], alphaColor(color, .15 * fade), alphaColor(color, .67 * fade), 2);
      for (let i = 0; i < 4; i += 1) { const step = length / 4; path(ctx, [['M', i * step, -width * .34], ['L', (i + .7) * step, width * .34]], null, alphaColor('#fff2b8', .6 * fade), 1.5); }
    } else if (kind === 'staff-ring' || kind === 'fire-ring') {
      circle(ctx, 0, 0, radius, null, alphaColor(color, .72 * fade), Math.max(3, radius * .09));
      circle(ctx, 0, 0, radius * .82, null, alphaColor('#fff0b8', .45 * fade), 1.5);
      if (kind === 'fire-ring' && this.quality !== 'low') for (let i = 0; i < 8; i += 1) { const a = i * TAU / 8 + this.elapsed * 1.8; circle(ctx, Math.cos(a) * radius, Math.sin(a) * radius, radius * .07, alphaColor('#f5bf63', .8 * fade)); }
    } else if (kind === 'monkey-clone') {
      // A readable little interceptor: face, ears, staff and a comic speed
      // slash. It remains an effect object so the engine can pool it.
      circle(ctx, 0, radius * .1, radius * .72, '#d88942', '#38252b', Math.max(1.5, radius * .1));
      circle(ctx, -radius * .65, -radius * .3, radius * .3, '#e6a44d', '#38252b', Math.max(1, radius * .08));
      circle(ctx, radius * .65, -radius * .3, radius * .3, '#e6a44d', '#38252b', Math.max(1, radius * .08));
      circle(ctx, -radius * .22, radius * .02, radius * .08, '#221e29'); circle(ctx, radius * .22, radius * .02, radius * .08, '#221e29');
      method(ctx, 'beginPath'); method(ctx, 'moveTo', radius * .8, radius * .9); method(ctx, 'lineTo', radius * 1.6, -radius * 1.2); paint(ctx, null, '#eec95d', Math.max(2, radius * .1)); method(ctx, 'stroke');
      method(ctx, 'beginPath'); method(ctx, 'moveTo', -radius * 1.6, radius * .5); method(ctx, 'lineTo', -radius * 2.4, radius * .15); paint(ctx, null, '#fff1ad', 1.8); method(ctx, 'stroke');
    } else if (kind === 'palm-strike') {
      method(ctx, 'rotate', n(effect.angle, 0));
      // Five-finger impact stamp, with the requested 卍 mark in the palm.
      path(ctx, [['M', -radius * .62, radius * .5], ['Q', -radius * .9, 0, -radius * .58, -radius * .48], ['L', -radius * .4, -radius * 1.2], ['Q', -radius * .24, -radius * 1.34, -radius * .15, -radius * .98], ['L', -radius * .08, -radius * 1.42], ['Q', radius * .08, -radius * 1.5, radius * .1, -radius * 1.06], ['L', radius * .22, -radius * 1.32], ['Q', radius * .35, -radius * 1.36, radius * .33, -radius * .9], ['L', radius * .52, -radius * 1.12], ['Q', radius * .68, -radius * 1.15, radius * .56, -.42 * radius], ['Q', radius * 1.02, -.18 * radius, radius * .6, radius * .64], ['Q', 0, radius * .94, -radius * .62, radius * .5], ['Z']], alphaColor('#f4cf7a', .82 * fade), '#3e2b2b', Math.max(2, radius * .07));
      ctx.font = `900 ${Math.max(12, radius * .48)}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';paint(ctx,'#8f4e3c');method(ctx,'fillText',String(effect.symbol||'卍'),0,radius*.18);
      circle(ctx, 0, 0, radius * 1.25, null, alphaColor('#ffe77a', .7 * fade), 2.5);
    } else if (kind === 'gourd') {
      circle(ctx, 0, -radius * .3, radius * .22, alphaColor(color, .5 * fade), alphaColor('#663f70', .74 * fade), 1.5);
      circle(ctx, 0, radius * .06, radius * .33, alphaColor(color, .6 * fade), alphaColor('#663f70', .74 * fade), 1.5);
      circle(ctx, 0, 0, radius * (.6 + progress * .38), null, alphaColor(color, .46 * fade), 2);
    } else if (kind === 'rope') {
      circle(ctx, 0, 0, radius * (1 - progress * .2), null, alphaColor(color, .82 * fade), 3);
      for (let i = 0; i < 4; i += 1) { const a = i * Math.PI / 2; path(ctx, [['M', Math.cos(a) * radius * .58, Math.sin(a) * radius * .58], ['L', Math.cos(a + .3) * radius, Math.sin(a + .3) * radius]], null, alphaColor(color, .6 * fade), 2); }
    } else if (kind.includes('whirl') || kind.includes('vortex') || kind.includes('spin')) {
      for (let i = 0; i < (this.quality === 'low' ? 2 : 4); i += 1) {
        const a = this.elapsed * 2.4 + i * Math.PI / 2;
        method(ctx, 'beginPath'); method(ctx, 'arc', 0, 0, radius * (.35 + i * .15), a, a + 1.35); paint(ctx, null, alphaColor(color, .55 * fade), Math.max(2, radius * .055)); method(ctx, 'stroke');
      }
      circle(ctx, 0, 0, radius * .22, alphaColor(color, .2 * fade));
    } else if (kind === 'lotus') {
      for (let i = 0; i < 6; i += 1) { const a = i * TAU / 6 + progress * .3; path(ctx, [['M', 0, 0], ['Q', Math.cos(a - .35) * radius, Math.sin(a - .35) * radius, Math.cos(a) * radius, Math.sin(a) * radius], ['Q', Math.cos(a + .35) * radius, Math.sin(a + .35) * radius, 0, 0], ['Z']], alphaColor(color, .2 * fade), alphaColor(color, .66 * fade), 2); }
      circle(ctx, 0, 0, radius * .23, alphaColor('#fff3bb', .75 * fade));
    } else if (kind === 'fan') {
      method(ctx, 'rotate', n(effect.angle));
      path(ctx, [['M', 0, 0], ['Q', radius * .62, -radius * .94, radius * 1.26, -radius * .1], ['Q', radius * .66, radius * .7, 0, 0], ['Z']], alphaColor(color, .42 * fade), alphaColor('#194c59', .82 * fade), 2.2);
      for (let i = 0; i < 5; i += 1) { const a = -.9 + i * .45; method(ctx, 'beginPath'); method(ctx, 'moveTo', radius * .18, radius * .04); method(ctx, 'lineTo', Math.cos(a) * radius * 1.18, Math.sin(a) * radius * 1.18); paint(ctx, null, alphaColor('#fff1b1', .72 * fade), 1.6); method(ctx, 'stroke'); }
    } else if (kind === 'mountain') {
      path(ctx, [['M', -radius * .9, radius * .55], ['L', -radius * .28, -radius * .78], ['L', 0, -radius * .36], ['L', radius * .32, -radius * 1.02], ['L', radius * 1.02, radius * .55], ['Z']], alphaColor('#c89763', .82 * fade), alphaColor('#402a2a', .86 * fade), 2.4);
      path(ctx, [['M', -radius * .26, -radius * .72], ['L', 0, -radius * .36], ['L', radius * .2, -radius * .74]], null, alphaColor('#fff0af', .7 * fade), 2);
    } else if (kind === 'bead' || kind === 'skull-bead') {
      const count = this.quality === 'low' ? 5 : 8;
      for (let i = 0; i < count; i += 1) { const a = this.elapsed * 1.8 + i * TAU / count; const rr = radius * 1.55; circle(ctx, Math.cos(a) * rr, Math.sin(a) * rr, radius * .28, alphaColor(color, .7 * fade), '#3f3030', 1.4); if (kind === 'skull-bead') circle(ctx, Math.cos(a) * rr, Math.sin(a) * rr - radius * .03, radius * .08, '#3a2d32'); }
    } else if (kind === 'fire-pool' || kind === 'fire-trail') {
      circle(ctx, 0, 0, radius * (.8 + progress * .22), alphaColor('#ec4930', .22 * fade), alphaColor('#ffbd38', .82 * fade), 2.2);
      for (let i = 0; i < 7; i += 1) { const a = i * TAU / 7 + this.elapsed; path(ctx, [['M', Math.cos(a) * radius * .2, Math.sin(a) * radius * .2], ['Q', Math.cos(a + .2) * radius * .65, Math.sin(a + .2) * radius * .65, Math.cos(a) * radius, Math.sin(a) * radius]], null, alphaColor('#ffd246', .74 * fade), 2); }
    } else if (kind.includes('heal') || kind.includes('holy') || kind.includes('light')) {
      for (let i = 0; i < 4; i += 1) {
        const a = i * Math.PI / 2 + this.elapsed * .8;
        method(ctx, 'beginPath'); method(ctx, 'moveTo', Math.cos(a) * radius * .2, Math.sin(a) * radius * .2); method(ctx, 'lineTo', Math.cos(a) * radius, Math.sin(a) * radius); paint(ctx, null, alphaColor(color, .55 * fade), Math.max(1.5, radius * .045)); method(ctx, 'stroke');
      }
      circle(ctx, 0, 0, radius * (.22 + progress * .18), alphaColor('#fff8d0', .66 * fade));
    } else if (kind.includes('dash') || kind.includes('trail')) {
      const a = n(effect.angle, 0); method(ctx, 'rotate', a);
      for (let i = 1; i < 5; i += 1) { roundedBox(ctx, -radius * i * .32, -radius * (.1 + i * .03), radius * .38, radius * (.2 + i * .02), radius * .08, alphaColor(color, fade * (1 - i / 6)), null); }
    } else if (kind.includes('fire') || kind.includes('explod') || kind.includes('impact')) {
      circle(ctx, 0, 0, radius * (.3 + progress * .75), null, alphaColor(color, .84 * fade), Math.max(2, radius * .08));
      const rays = this.quality === 'low' ? 6 : 10;
      for (let i = 0; i < rays; i += 1) { const a = i * TAU / rays; method(ctx, 'beginPath'); method(ctx, 'moveTo', Math.cos(a) * radius * .3, Math.sin(a) * radius * .3); method(ctx, 'lineTo', Math.cos(a) * radius * (0.65 + progress * .4), Math.sin(a) * radius * (0.65 + progress * .4)); paint(ctx, null, alphaColor(color, .7 * fade), Math.max(1.4, radius * .035)); method(ctx, 'stroke'); }
    } else {
      const count = this.quality === 'low' ? 4 : 7;
      for (let i = 0; i < count; i += 1) { const a = i * TAU / count; const rr = radius * (.45 + .48 * progress); circle(ctx, Math.cos(a) * rr, Math.sin(a) * rr, Math.max(1.5, radius * .06), alphaColor(color, fade)); }
    }
    if (['palm-strike', 'mountain', 'explosion', 'heavy-sweep', 'fan'].includes(kind) && fade > .25) {
      const words = { 'palm-strike': '轰！', mountain: '镇！', explosion: '嘭！', 'heavy-sweep': '喝！', fan: '呼！' };
      ctx.font = '900 18px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      method(ctx, 'strokeText', words[kind], 0, -radius * 1.05); paint(ctx, '#ffe15b'); method(ctx, 'fillText', words[kind], 0, -radius * 1.05);
    }
    method(ctx, 'restore');
  }

  _drawEnemy(ctx, enemy, player, theme) {
    if (!enemy) return;
    const x = n(enemy.x), y = n(enemy.y), radius = clamp(n(enemy.radius, 17), 7, 72);
    const kind = enemy.kind === 'boss' ? 'boss' : enemy.kind === 'elite' ? 'elite' : 'normal';
    const tintList = ENEMY_TINTS[typeof enemy.theme === 'string' ? enemy.theme : Object.keys(THEMES).find(key => THEMES[key] === theme) || 'forest'] || ENEMY_TINTS.forest;
    const tint = enemy.flash > 0 ? '#fff1c7' : enemy.color || tintList[Math.abs(Math.floor(n(enemy.id, 0))) % tintList.length];
    const actor = battleEnemyAnimation(enemy), authoredSprite = this.enemyImages?.[actor?.variant];
    const authoredFrame = actor && this.battleArtMode === 'authoredFrames' && imageReady(authoredSprite)
      && actor.drawFrame(authoredSprite, animationState(enemy), animationFrame(enemy), radius);
    method(ctx, 'save'); method(ctx, 'translate', x, y);
    circle(ctx, 0, radius * .7, radius * .72, alphaColor('#382f2b', .2));
    const pose = animationPose(enemy, radius);
    const bob = Math.sin(this.elapsed * (kind === 'boss' ? 2 : 4) + n(enemy.id, 0) * .8) * radius * .045;
    if (!authoredFrame) {
      method(ctx, 'translate', 0, bob + pose.y - n(enemy.hopHeight, 0) * radius * .4);
      method(ctx, 'rotate', pose.rotation);
    }
    const enemyFacing = Number.isFinite(Number(enemy.facing))
      ? Number(enemy.facing)
      : Math.atan2(n(player?.y) - y, n(player?.x) - x);
    const facing = Math.cos(enemyFacing) < 0 ? -1 : 1;
    method(ctx, 'scale', facing * (authoredFrame ? (authoredFrame.mirrorX ? -1 : 1) : pose.scaleX), authoredFrame ? 1 : pose.scaleY);
    if (kind !== 'normal') circle(ctx, 0, -radius * .25, radius * 1.2, alphaColor(kind === 'boss' ? '#ff4b32' : '#ff9b2f', .14), alphaColor(kind === 'boss' ? '#e84936' : '#c77835', .7), Math.max(1.5, radius * .07));
    if (kind === 'boss') this._drawBossAura(ctx, radius, enemy);
    const variantText = String(enemy.variantName || enemy.name || '').toLowerCase();
    const spriteKey = kind === 'boss' ? 'boss' : kind === 'elite' ? 'brute' : (/蛛|蝎|虫|spider/.test(variantText) ? 'spider' : /鸟|鹰|鹏|鹤|bird|hawk/.test(variantText) ? 'bird' : 'creature');
    const sprite = this.enemyImages?.[spriteKey];
    const spriteReady = this.battleArtMode === 'authoredFrames' && sprite?.__v3BattleSprite === true && imageReady(sprite);
    if (authoredFrame) {
      method(ctx, 'drawImage', authoredSprite, authoredFrame.x, authoredFrame.y, authoredFrame.w, authoredFrame.h,
        authoredFrame.dx, authoredFrame.dy, authoredFrame.dw, authoredFrame.dh);
    } else if (spriteReady) {
      // The authored Boss PNG already contains its helmet, silhouette and
      // weapon. Keep it inside a compact 2.3r×2.45r box so the named health
      // bar remains readable on a portrait viewport.
      const scale = spriteKey === 'boss' ? [2.3, 2.45, 1.15, 1.26] : [2.56, 2.7, 1.28, 1.35];
      const frame = spriteFrameRect(sprite, spriteKey, animationFrame(enemy), animationState(enemy));
      if (frame) {
        const dw = radius * scale[0] * frame.scaleX;
        const dh = radius * scale[1] * frame.scaleY;
        method(ctx, 'drawImage', sprite, frame.x, frame.y, frame.w, frame.h,
          -dw * .5 + frame.dx * radius, -dh * .5 + frame.dy * radius, dw, dh);
      }
      else method(ctx, 'drawImage', sprite, -radius * scale[2], -radius * scale[3], radius * scale[0], radius * scale[1]);
    }
    else this._drawDemonBody(ctx, enemy, radius, tint, theme, battleMotion(enemy, radius));
    if (kind !== 'normal' && !authoredFrame && !(kind === 'boss' && spriteReady)) this._drawCrown(ctx, radius, kind === 'boss' ? '#e6b951' : '#b9b9a2');
    if (kind === 'boss' && !authoredFrame && !spriteReady) this._drawBossWeapon(ctx, radius, enemy, theme);
    method(ctx, 'restore');
    if (enemy.maxHp > 0 && (kind !== 'normal' || enemy.hp < enemy.maxHp)) this._drawHealthBar(ctx, x, this._enemyHealthBarY(enemy, radius), radius * (kind === 'boss' ? 3.15 : 2.3), enemy.hp / enemy.maxHp, kind === 'boss' ? '#ef3e37' : '#e66b35');
    if (kind === 'boss') this._drawBossLabel(ctx, x, y - radius * 2.75 + this._bossLabelOffset(enemy), enemy);
    // Stun is represented once by the compact status pass. A second crown
    // of stars here used to compete with the badge, health bar and silhouette.
  }

  _drawBossAura(ctx, r, enemy) {
    const pulse = 1 + Math.sin(this.elapsed * 3 + n(enemy.id, 0)) * .08;
    circle(ctx, 0, 0, r * 1.48 * pulse, alphaColor('#ef403b', .08), alphaColor('#f8c735', .75), Math.max(2, r * .055));
    const rays = this.quality === 'low' ? 6 : 10;
    for (let i = 0; i < rays; i += 1) {
      const a = i * TAU / rays + this.elapsed * .25;
      method(ctx, 'beginPath'); method(ctx, 'moveTo', Math.cos(a) * r * 1.32, Math.sin(a) * r * 1.32); method(ctx, 'lineTo', Math.cos(a) * r * 1.7, Math.sin(a) * r * 1.7);
      paint(ctx, null, alphaColor('#ffcf3d', .5), Math.max(1.5, r * .045)); method(ctx, 'stroke');
    }
    const entrance = enemy.spawnProgress ?? enemy.entrance ?? enemy.intro;
    if (Number.isFinite(Number(entrance)) && Number(entrance) < 1) {
      const t = clamp(Number(entrance), 0, 1);
      circle(ctx, 0, 0, r * (2.2 - t * .8), null, alphaColor('#32d7e9', .72 * (1 - t)), Math.max(2, r * .08));
      method(ctx, 'beginPath'); method(ctx, 'moveTo', -r * 2.2, 0); method(ctx, 'lineTo', r * 2.2, 0); paint(ctx, null, alphaColor('#fff0a1', .65 * (1 - t)), 3); method(ctx, 'stroke');
    }
  }

  _drawBossWeapon(ctx, r, enemy, theme) {
    const variant = String(enemy.variant || enemy.name || '').toLowerCase();
    const bossId = enemy?.bossIdentity?.bossId;
    const angle = Math.sin(this.elapsed * .8) * .08;
    method(ctx, 'save'); method(ctx, 'rotate', angle);
    if (bossId === 'yin-general') {
      method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .42, r * .35); method(ctx, 'lineTo', r * 1.55, -r * 1.15); method(ctx, 'moveTo', r * .68, r * .55); method(ctx, 'lineTo', r * 1.86, -r * .55);
      paint(ctx, null, '#f6d15a', Math.max(2.2, r * .095)); method(ctx, 'stroke');
      circle(ctx, r * 1.55, -r * 1.15, r * .12, '#d7353e', '#51242a', 1.2);
      circle(ctx, r * 1.86, -r * .55, r * .11, '#d7353e', '#51242a', 1.2);
      method(ctx, 'restore'); return;
    }
    if (bossId === 'xiong-shanjun') {
      path(ctx, [['M', r * .38, r * .5], ['L', r * 1.25, -r * .65], ['L', r * 1.7, -r * .32], ['L', r * .86, r * .85], ['Z']], '#d8c28a', '#38282b', Math.max(1.5, r * .055));
      circle(ctx, r * 1.5, -r * .48, r * .34, '#8e5a3f', '#38282b', Math.max(1.4, r * .055));
      method(ctx, 'restore'); return;
    }
    if (bossId === 'te-chushi') {
      method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .42, r * .48); method(ctx, 'lineTo', r * 1.75, -r * 1.3); method(ctx, 'moveTo', r * 1.32, -r * .8); method(ctx, 'quadraticCurveTo', r * 1.9, -r * .72, r * 1.78, -r * .1);
      paint(ctx, null, '#e6c971', Math.max(2.2, r * .09)); method(ctx, 'stroke');
      circle(ctx, r * 1.75, -r * 1.3, r * .12, '#3e9b91', '#273b3c', 1.2);
      method(ctx, 'restore'); return;
    }
    method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .55, r * .45); method(ctx, 'lineTo', r * 1.75, -r * 1.2); paint(ctx, null, theme.sticker || '#f6ce3a', Math.max(2.4, r * .11)); method(ctx, 'stroke');
    if (/dragon|龙|snake|蛇/.test(variant)) {
      path(ctx, [['M', r * 1.15, -r * 1.5], ['Q', r * 1.65, -r * 1.95, r * 2.0, -r * 1.42], ['Q', r * 1.58, -r * 1.15, r * 1.15, -r * 1.5], ['Z']], '#35bfc6', '#243c4a', 1.8);
    } else {
      circle(ctx, r * 1.75, -r * 1.2, r * .22, theme.accent, theme.ink, 1.5);
    }
    method(ctx, 'restore');
  }

  _drawBossLabel(ctx, x, y, enemy) {
    const label = enemy.final ? '最终妖王' : (enemy.name || '妖王');
    method(ctx, 'save'); method(ctx, 'translate', x, y); ctx.font = '900 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    roundedBox(ctx, -52, -11, 104, 22, 9, alphaColor('#241b27', .9), '#ffce42', 1.6);
    paint(ctx, '#ffe58a'); method(ctx, 'fillText', String(label).slice(0, 12), 0, 1); method(ctx, 'restore');
  }

  _drawDemonBody(ctx, enemy, r, tint, theme, motion = battleMotion(enemy, r)) {
    const bossId = enemy?.kind === 'boss' ? enemy?.bossIdentity?.bossId : null;
    const bossProfile = FINAL_BOSS_PROFILES[bossId];
    if (bossProfile) {
      this._drawFinalBossBody(ctx, r, bossProfile, motion);
      return;
    }
    const variant = String(enemy.variant || enemy.name || '').toLowerCase();
    const runner = /fox|wolf|monkey|hawk|runner|蝎|狐|狼/.test(variant);
    const brute = /bull|bear|king|demon|牛|熊|王|妖王|巨/.test(variant);
    const dragon = /dragon|龙|snake|蛇|蛟/.test(variant);
    const spider = /spider|蛛|web/.test(variant);
    const bird = /bird|hawk|鹰|鸟|鹤/.test(variant);
    if (dragon) { this._drawDragonDemon(ctx, r, tint, theme, motion); return; }
    if (spider) { this._drawSpiderDemon(ctx, r, tint, theme, motion); return; }
    if (bird) { this._drawBirdDemon(ctx, r, tint, theme, motion); return; }
    const bodyR = brute ? r * 1.1 : r;
    const bodyY = brute ? -r * .18 : 0;
    path(ctx, [['M', -bodyR * .75, bodyY + bodyR * .9], ['Q', -bodyR * 1.05, bodyY + bodyR * .15, -bodyR * .65, bodyY - bodyR * .55], ['Q', 0, bodyY - bodyR * 1.1, bodyR * .65, bodyY - bodyR * .55], ['Q', bodyR * 1.05, bodyY + bodyR * .15, bodyR * .75, bodyY + bodyR * .9], ['Z']], tint, '#48372f', Math.max(1.3, r * .08));
    if (runner) {
      path(ctx, [['M', -r * .5, -r * .62], ['L', -r * 1.02, -r * 1.02], ['L', -r * .42, -r * .84], ['Z']], tint, '#48372f', r * .055);
      path(ctx, [['M', r * .5, -r * .62], ['L', r * 1.02, -r * 1.02], ['L', r * .42, -r * .84], ['Z']], tint, '#48372f', r * .055);
    } else {
      path(ctx, [['M', -r * .5, -r * .6], ['L', -r * .75, -r * 1.15], ['L', -r * .16, -r * .78], ['Z']], theme.accent, '#48372f', r * .055);
      path(ctx, [['M', r * .5, -r * .6], ['L', r * .75, -r * 1.15], ['L', r * .16, -r * .78], ['Z']], theme.accent, '#48372f', r * .055);
    }
    circle(ctx, -r * .26, -r * .45, r * .1, '#f6d575', '#49352f', r * .035); circle(ctx, r * .26, -r * .45, r * .1, '#f6d575', '#49352f', r * .035);
    circle(ctx, -r * .26, -r * .45, r * .04, '#342b2c'); circle(ctx, r * .26, -r * .45, r * .04, '#342b2c');
    if (brute) { path(ctx, [['M', -r * .34, r * .02], ['Q', 0, r * .22, r * .34, r * .02]], null, alphaColor('#fff1c2', .62), r * .07); }
    else { path(ctx, [['M', -r * .27, r * .15], ['Q', 0, r * .31, r * .27, r * .15]], null, '#432f2e', r * .05); }
    // simple legs keep enemies readable at very small zoom values
    method(ctx, 'beginPath'); method(ctx, 'moveTo', -r * .35, r * .65); method(ctx, 'lineTo', -r * .48 + motion.stride, r * 1.08); method(ctx, 'moveTo', r * .35, r * .65); method(ctx, 'lineTo', r * .48 - motion.stride, r * 1.08); paint(ctx, null, '#4b372f', Math.max(2, r * .13)); method(ctx, 'stroke');
  }

  _drawFinalBossBody(ctx, r, profile, motion = {}) {
    const stride = n(motion.stride, 0);
    const bodyR = r * 1.12;
    const bodyY = -r * .12;
    path(ctx, [['M', -bodyR * .8, bodyY + bodyR * .92], ['Q', -bodyR * 1.12, bodyY + bodyR * .18, -bodyR * .7, bodyY - bodyR * .58], ['Q', 0, bodyY - bodyR * 1.16, bodyR * .7, bodyY - bodyR * .58], ['Q', bodyR * 1.12, bodyY + bodyR * .18, bodyR * .8, bodyY + bodyR * .92], ['Z']], profile.body, profile.dark, Math.max(1.6, r * .085));
    if (profile === FINAL_BOSS_PROFILES['yin-general']) {
      path(ctx, [['M', -r * .5, -r * .62], ['L', -r * 1.02, -r * 1.16], ['L', -r * .16, -r * .86], ['Z']], profile.accent, profile.dark, r * .055);
      path(ctx, [['M', r * .5, -r * .62], ['L', r * 1.02, -r * 1.16], ['L', r * .16, -r * .86], ['Z']], profile.accent, profile.dark, r * .055);
      for (const offset of [-.34, 0, .34]) path(ctx, [['M', offset * r, -r * .84], ['L', offset * .7 * r, -r * .26]], null, profile.dark, Math.max(1.4, r * .055));
      circle(ctx, -r * .26, -r * .47, r * .1, profile.light, profile.dark, r * .03); circle(ctx, r * .26, -r * .47, r * .1, profile.light, profile.dark, r * .03);
    } else if (profile === FINAL_BOSS_PROFILES['xiong-shanjun']) {
      circle(ctx, -r * .58, -r * .72, r * .3, profile.accent, profile.dark, r * .06); circle(ctx, r * .58, -r * .72, r * .3, profile.accent, profile.dark, r * .06);
      path(ctx, [['M', -r * .8, -r * .2], ['L', -r * 1.16, r * .18], ['L', -r * .72, r * .5], ['Z']], profile.metal, profile.dark, r * .05);
      path(ctx, [['M', r * .8, -r * .2], ['L', r * 1.16, r * .18], ['L', r * .72, r * .5], ['Z']], profile.metal, profile.dark, r * .05);
      circle(ctx, -r * .26, -r * .46, r * .105, profile.light, profile.dark, r * .03); circle(ctx, r * .26, -r * .46, r * .105, profile.light, profile.dark, r * .03);
      path(ctx, [['M', -r * .28, r * .08], ['Q', 0, r * .28, r * .28, r * .08]], null, profile.light, r * .075);
    } else {
      path(ctx, [['M', -r * .48, -r * .62], ['L', -r * 1.1, -r * 1.28], ['L', -r * .16, -r * .9], ['Z']], profile.light, profile.dark, r * .06);
      path(ctx, [['M', r * .48, -r * .62], ['L', r * 1.1, -r * 1.28], ['L', r * .16, -r * .9], ['Z']], profile.light, profile.dark, r * .06);
      circle(ctx, -r * .26, -r * .46, r * .11, profile.metal, profile.dark, r * .03); circle(ctx, r * .26, -r * .46, r * .11, profile.metal, profile.dark, r * .03);
      circle(ctx, 0, -r * .05, r * .2, profile.accent, profile.dark, r * .045);
      circle(ctx, 0, -r * .05, r * .08, null, profile.metal, Math.max(1.2, r * .035));
    }
    method(ctx, 'beginPath'); method(ctx, 'moveTo', -r * .37, r * .67); method(ctx, 'lineTo', -r * .52 + stride, r * 1.12); method(ctx, 'moveTo', r * .37, r * .67); method(ctx, 'lineTo', r * .52 - stride, r * 1.12); paint(ctx, null, profile.dark, Math.max(2, r * .14)); method(ctx, 'stroke');
    path(ctx, [['M', -r * .72, r * .25], ['Q', 0, r * .43, r * .72, r * .25], ['L', r * .58, r * .48], ['Q', 0, r * .63, -r * .58, r * .48], ['Z']], profile.accent, profile.dark, Math.max(1.1, r * .04));
  }

  _drawDragonDemon(ctx, r, tint, theme) {
    path(ctx, [['M', -r * .9, r * .7], ['Q', -r * 1.1, 0, -r * .55, -r * .6], ['Q', 0, -r * 1.4, r * .8, -r * .55], ['Q', r * 1.2, 0, r * .85, r * .7], ['Z']], tint, theme.ink, Math.max(1.5, r * .08));
    path(ctx, [['M', -r * .45, -r * .65], ['L', -r * 1.1, -r * 1.28], ['L', -r * .12, -r * .9], ['Z']], theme.accent, theme.ink, r * .06);
    path(ctx, [['M', r * .35, -r * .68], ['L', r * 1.08, -r * 1.22], ['L', r * .1, -r * .92], ['Z']], theme.accent, theme.ink, r * .06);
    circle(ctx, -r * .25, -r * .45, r * .11, '#f7da41', theme.ink, r * .035); circle(ctx, r * .25, -r * .45, r * .11, '#f7da41', theme.ink, r * .035);
    method(ctx, 'beginPath'); method(ctx, 'moveTo', -r * .2, -r * .07); method(ctx, 'quadraticCurveTo', 0, r * .25, r * .2, -r * .07); paint(ctx, null, '#3b2330', r * .06); method(ctx, 'stroke');
  }

  _drawSpiderDemon(ctx, r, tint, theme) {
    circle(ctx, 0, -r * .28, r * .72, tint, theme.ink, Math.max(1.4, r * .07));
    circle(ctx, 0, -r * .72, r * .42, tint, theme.ink, Math.max(1.2, r * .06));
    for (let i = 0; i < 4; i += 1) {
      const side = i % 2 ? 1 : -1, yy = -r * .2 + i * r * .35;
      method(ctx, 'beginPath'); method(ctx, 'moveTo', side * r * .42, yy); method(ctx, 'quadraticCurveTo', side * r * 1.12, yy - r * .26, side * r * 1.3, yy + r * .1); paint(ctx, null, theme.ink, Math.max(1.5, r * .075)); method(ctx, 'stroke');
    }
    for (const x of [-.2, .2]) circle(ctx, x * r, -r * .77, r * .09, '#f8d448', theme.ink, r * .03);
  }

  _drawBirdDemon(ctx, r, tint, theme) {
    path(ctx, [['M', -r * .78, r * .72], ['Q', -r * 1.2, -r * .2, 0, -r * .82], ['Q', r * 1.2, -r * .2, r * .78, r * .72], ['Q', 0, r * 1.1, -r * .78, r * .72], ['Z']], tint, theme.ink, Math.max(1.4, r * .075));
    path(ctx, [['M', 0, -r * .58], ['L', r * .92, -r * .42], ['L', 0, -r * .18], ['Z']], theme.sticker || '#f5c83d', theme.ink, r * .045);
    circle(ctx, -r * .2, -r * .58, r * .1, '#fff1a1', theme.ink, r * .03); circle(ctx, r * .2, -r * .58, r * .1, '#fff1a1', theme.ink, r * .03);
  }

  _drawCrown(ctx, r, color) {
    path(ctx, [['M', -r * .7, -r * 1.28], ['L', -r * .4, -r * 1.78], ['L', 0, -r * 1.34], ['L', r * .4, -r * 1.78], ['L', r * .7, -r * 1.28], ['Z']], color, '#533e2e', Math.max(1.5, r * .055));
    circle(ctx, 0, -r * 1.39, r * .09, '#fff3ad');
  }

  _drawHealthBar(ctx, x, y, width, ratio, color) {
    const w = Math.max(20, width), h = Math.max(3, w * .08), left = x - w / 2;
    roundedBox(ctx, left, y, w, h, h / 2, alphaColor('#302b29', .7), null);
    roundedBox(ctx, left + 1, y + 1, (w - 2) * clamp(n(ratio, 0), 0, 1), h - 2, (h - 2) / 2, color, null);
  }

  _drawStatusStars(ctx, x, y, r, color) {
    for (let i = 0; i < 3; i += 1) {
      const a = this.elapsed * 2 + i * TAU / 3;
      circle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r * .35, r * .12, color, '#65482d', 1);
    }
  }

  _drawPlayer(ctx, player, characterId) {
    const [id, style] = heroStyle(characterId || player.characterId || player.character || 'wukong');
    const x = n(player.x, WORLD_SIZE / 2), y = n(player.y, WORLD_SIZE / 2), r = clamp(n(player.radius, 19), 9, 52);
    const facing = Math.cos(n(player.facing, 0)) < 0 ? -1 : 1;
    const pose = animationPose(player, r);
    const motion = battleMotion(player, r);
    const gait = animationState(player) === 'move' ? pose.y * .7 : 0;
    method(ctx, 'save'); method(ctx, 'translate', x, y + pose.y); method(ctx, 'scale', facing * pose.scaleX, pose.scaleY); method(ctx, 'rotate', pose.rotation);
    circle(ctx, 0, r * .9, r * .84, alphaColor('#3b302b', .26));
    const sprite = this.heroImages?.[id];
    const spriteReady = this.battleArtMode === 'authoredFrames' && sprite?.__v3BattleSprite === true && (sprite.complete === undefined || sprite.complete || sprite.naturalWidth > 0 || sprite.width > 0);
    if (spriteReady) {
      if (sprite.__v3BattleSprite) {
        const frame = spriteFrameRect(sprite, id, animationFrame(player), animationState(player));
        const frameRatio = frame ? frame.w / Math.max(1, frame.h) : 1;
        const h = r * 4.85, w = h * frameRatio;
        if (frame) {
          const dw = w * frame.scaleX, dh = h * frame.scaleY;
          method(ctx, 'drawImage', sprite, frame.x, frame.y, frame.w, frame.h,
            -dw * .5 + frame.dx * r, -r * 2.58 + frame.dy * r, dw, dh);
        }
      } else if (sprite.__v2BattleSprite) {
        // Retired single-pose atlas support is gallery-only and intentionally
        // unreachable in normal battleArtMode:'authoredFrames'.
        const source = sprite.__sourceRects?.[id];
        const spriteRatio = source ? source.w / source.h : (Number(sprite.width) || 320) / Math.max(1, Number(sprite.height) || 520);
        const h = r * 4.6;
        const w = h * spriteRatio;
        const frame = spriteFrameRect(sprite, id, animationFrame(player), animationState(player));
        if (frame) {
          const dw = w * frame.scaleX, dh = h * frame.scaleY;
          method(ctx, 'drawImage', sprite, frame.x, frame.y, frame.w, frame.h,
            -dw * .5 + frame.dx * r, -r * 2.5 + frame.dy * r, dw, dh);
        }
        else if (source) method(ctx, 'drawImage', sprite, source.x, source.y, source.w, source.h, -w * .5, -r * 2.5, w, h);
        else method(ctx, 'drawImage', sprite, -w * .5, -r * 2.5, w, h);
      } else {
        const frame = spriteFrameRect(sprite, id, animationFrame(player), animationState(player));
        if (frame) {
          const dw = r * 2.84 * frame.scaleX, dh = r * 3.55 * frame.scaleY;
          method(ctx, 'drawImage', sprite, frame.x, frame.y, frame.w, frame.h,
            -dw * .5 + frame.dx * r, -r * 1.58 + frame.dy * r, dw, dh);
        }
        else method(ctx, 'drawImage', sprite, -r * 1.42, -r * 1.58, r * 2.84, r * 3.55);
      }
    } else {
      // legs and robe/body
      method(ctx, 'beginPath'); method(ctx, 'moveTo', -r * .3, r * .54); method(ctx, 'lineTo', -r * .38 + gait + motion.stride, r * 1.08); method(ctx, 'moveTo', r * .3, r * .54); method(ctx, 'lineTo', r * .38 - gait - motion.stride, r * 1.08); paint(ctx, null, style.dark, Math.max(2, r * .16)); method(ctx, 'stroke');
      path(ctx, [['M', -r * .65, r * .65], ['Q', 0, -r * .1, r * .65, r * .65], ['L', r * .48, r * 1.03], ['L', -r * .48, r * 1.03], ['Z']], style.body, style.dark, Math.max(1.4, r * .07));
      if (id === 'wukong') this._drawWukong(ctx, r, style, motion);
      else if (id === 'tangsanzang') this._drawTang(ctx, r, style, motion);
      else if (id === 'bajie') this._drawBajie(ctx, r, style, motion);
      else this._drawShajing(ctx, r, style, motion);
    }
    this._drawAttackTrail(ctx, r, player, style);
    if (n(player.hitFlash, 0) > 0) {
      circle(ctx, 0, 0, r * 1.28, alphaColor('#fff7d2', .28), alphaColor('#ffef9b', .9), Math.max(2, r * .09));
      for (let i = 0; i < 6; i += 1) { const a = i * TAU / 6; method(ctx, 'beginPath'); method(ctx, 'moveTo', Math.cos(a) * r * 1.1, Math.sin(a) * r * 1.1); method(ctx, 'lineTo', Math.cos(a) * r * 1.65, Math.sin(a) * r * 1.65); paint(ctx, null, '#fff7d2', Math.max(1.3, r * .05)); method(ctx, 'stroke'); }
    }
    method(ctx, 'restore');
    if (n(player.invulnerable, 0) > 0) circle(ctx, x, y, r * 1.35, null, alphaColor('#f6dc87', .52), Math.max(1.5, r * .08));
  }

  _drawAttackTrail(ctx, r, player, style) {
    const rawFlash = n(player.attackFlash ?? player.attackTimer ?? player.swing, 0);
    // A faint live arc keeps the hero's current weapon readable between
    // attack frames; the brighter pass still follows the real attackFlash.
    const flash = rawFlash > 0 ? rawFlash : .12 + (Math.sin(this.elapsed * 5.5) + 1) * .035;
    const angle = n(player.attackAngle, n(player.facing, 0));
    method(ctx, 'save'); method(ctx, 'rotate', angle);
    const reach = r * (1.2 + clamp(n(player.weaponLevel, 1), 1, 5) * .2);
    const arcAlpha = rawFlash > 0 ? .82 : .25;
    method(ctx, 'beginPath'); method(ctx, 'arc', 0, 0, reach, -.95, .95); paint(ctx, null, alphaColor(style.light || '#f7d351', arcAlpha), Math.max(2, r * (rawFlash > 0 ? .11 : .06))); method(ctx, 'stroke');
    for (let i = 0; i < 3; i += 1) {
      method(ctx, 'beginPath'); method(ctx, 'moveTo', reach * (.5 + i * .12), -reach * (.75 + i * .11)); method(ctx, 'lineTo', reach * (1.12 + i * .12), -reach * (.91 + i * .1));
      paint(ctx, null, alphaColor('#fff0a6', .65 - i * .14), Math.max(1.2, r * .045)); method(ctx, 'stroke');
    }
    method(ctx, 'restore');
  }

  _drawWukong(ctx, r, style, motion = {}) {
    circle(ctx, 0, -r * .54, r * .55, style.skin, style.dark, r * .07);
    circle(ctx, -r * .56, -r * .58, r * .2, style.body, style.dark, r * .06); circle(ctx, r * .56, -r * .58, r * .2, style.body, style.dark, r * .06);
    path(ctx, [['M', -r * .55, -r * .82], ['Q', 0, -r * 1.24, r * .55, -r * .82], ['L', r * .35, -r * .68], ['L', -r * .35, -r * .68], ['Z']], style.metal, style.dark, r * .055);
    circle(ctx, -r * .18, -r * .59, r * .055, '#282329'); circle(ctx, r * .18, -r * .59, r * .055, '#282329');
    // Ruyi Jingu Bang, angle follows the facing direction through the mirrored body
    method(ctx, 'save'); method(ctx, 'rotate', motion.weaponSwing || 0);
    method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .34, r * .18); method(ctx, 'lineTo', r * 1.55, -r * 1.12); paint(ctx, null, style.metal, Math.max(2, r * .1)); method(ctx, 'stroke');
    circle(ctx, r * 1.55, -r * 1.12, r * .13, style.body, style.dark, r * .04); method(ctx, 'restore');
  }

  _drawTang(ctx, r, style, motion = {}) {
    circle(ctx, 0, -r * .6, r * .48, style.skin, style.dark, r * .06);
    path(ctx, [['M', -r * .48, -r * .55], ['Q', 0, -r * 1.1, r * .48, -r * .55], ['L', r * .4, -.1 * r], ['L', -r * .4, -.1 * r], ['Z']], style.body, style.dark, r * .06);
    circle(ctx, -r * .17, -r * .58, r * .045, '#27324a'); circle(ctx, r * .17, -r * .58, r * .045, '#27324a');
    method(ctx, 'save'); method(ctx, 'rotate', motion.weaponSwing || 0); method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .3, r * .25); method(ctx, 'lineTo', r * 1.5, r * .25); paint(ctx, null, style.metal, Math.max(2, r * .07)); method(ctx, 'stroke'); circle(ctx, r * 1.5, r * .25, r * .16, '#9be5ee', style.dark, r * .04); method(ctx, 'restore');
  }

  _drawBajie(ctx, r, style, motion = {}) {
    circle(ctx, 0, -r * .55, r * .55, style.skin, style.dark, r * .07);
    path(ctx, [['M', -r * .42, -r * .54], ['L', -r * .82, -r * .88], ['L', -r * .62, -.35 * r], ['Z']], style.skin, style.dark, r * .05); path(ctx, [['M', r * .42, -r * .54], ['L', r * .82, -r * .88], ['L', r * .62, -.35 * r], ['Z']], style.skin, style.dark, r * .05);
    circle(ctx, -r * .18, -r * .62, r * .055, '#3a292e'); circle(ctx, r * .18, -r * .62, r * .055, '#3a292e'); circle(ctx, 0, -r * .39, r * .19, style.light, style.dark, r * .04);
    method(ctx, 'save'); method(ctx, 'rotate', motion.weaponSwing || 0); method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .3, r * .2); method(ctx, 'lineTo', r * 1.58, -r * .15); paint(ctx, null, style.metal, Math.max(2, r * .11)); method(ctx, 'stroke');
    for (let i = 0; i < 3; i += 1) { method(ctx, 'beginPath'); method(ctx, 'moveTo', r * (1.3 + i * .14), -r * (.42 - i * .08)); method(ctx, 'lineTo', r * (1.5 + i * .14), -r * (.07 - i * .08)); paint(ctx, null, style.metal, Math.max(1.4, r * .055)); method(ctx, 'stroke'); } method(ctx, 'restore');
  }

  _drawShajing(ctx, r, style, motion = {}) {
    circle(ctx, 0, -r * .58, r * .5, style.skin, style.dark, r * .07);
    path(ctx, [['M', -r * .52, -r * .72], ['Q', 0, -r * 1.08, r * .52, -r * .72], ['L', r * .37, -.25 * r], ['L', -r * .37, -.25 * r], ['Z']], style.dark, style.dark, r * .05);
    circle(ctx, -r * .16, -r * .59, r * .05, '#293131'); circle(ctx, r * .16, -r * .59, r * .05, '#293131');
    method(ctx, 'save'); method(ctx, 'rotate', motion.weaponSwing || 0); method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .25, r * .15); method(ctx, 'lineTo', r * 1.4, -r * .82); paint(ctx, null, style.metal, Math.max(2, r * .09)); method(ctx, 'stroke');
    circle(ctx, r * 1.4, -r * .82, r * .2, style.metal, style.dark, r * .045); method(ctx, 'restore');
  }

  _drawHud(ctx, state, theme) {
    const player = state.player || {};
    const hpRatio = clamp(n(player.hp, 0) / Math.max(1, n(player.maxHp, 1)), 0, 1);
    const xpRatio = clamp(n(player.xp, 0) / Math.max(1, n(player.xpNext, 1)), 0, 1);
    method(ctx, 'save'); method(ctx, 'setTransform', this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    // parchment HUD cards
    const cardWidth = Math.min(232, Math.max(116, this.width - 122));
    const barWidth = cardWidth - 24;
    roundedBox(ctx, 12, 12, cardWidth, 62, 12, alphaColor('#fbf1cf', .93), alphaColor(theme.ink, .55), 1.5);
    roundedBox(ctx, 24, 37, barWidth, 10, 5, alphaColor('#47382f', .18), null);
    roundedBox(ctx, 25, 38, (barWidth - 2) * hpRatio, 8, 4, '#c85b4b', null);
    roundedBox(ctx, 24, 54, barWidth, 8, 4, alphaColor('#47382f', .16), null);
    roundedBox(ctx, 25, 55, (barWidth - 2) * xpRatio, 6, 3, '#67a688', null);
    paint(ctx, theme.ink); ctx.font = 'bold 11px sans-serif'; method(ctx, 'fillText', `生命 ${Math.ceil(n(player.hp, 0))}/${Math.ceil(n(player.maxHp, 0))}`, 24, 29); method(ctx, 'fillText', `Lv.${Math.max(1, Math.floor(n(player.level, 1)))}`, 12 + cardWidth - 40, 29);
    const time = n(state.time, 0); const minutes = Math.floor(time / 60); const seconds = Math.floor(time % 60); const clock = `${minutes}:${String(seconds).padStart(2, '0')}`;
    roundedBox(ctx, this.width - 100, 12, 88, 34, 10, alphaColor('#fbf1cf', .93), alphaColor(theme.ink, .55), 1.5);
    paint(ctx, theme.ink); ctx.font = 'bold 14px sans-serif'; method(ctx, 'fillText', clock, this.width - 78, 34);
    const stage = state.stage || {};
    const chapter = n(stage.chapter, n(state.chapter, 1));
    const stageName = stage.name || stage.location || `第${Math.max(1, chapter)}难`;
    roundedBox(ctx, this.width - 172, 54, 160, 24, 8, alphaColor('#241b27', .86), alphaColor(theme.sticker || '#f4ca3f', .76), 1.1);
    paint(ctx, '#ffe58a'); ctx.font = '900 10px sans-serif'; method(ctx, 'fillText', `第${Math.max(1, chapter)}难 · ${String(stageName).slice(0, 8)}`, this.width - 160, 70);
    const skills = Array.isArray(state.skills) ? state.skills.slice(0, 5) : EMPTY_LIST;
    skills.forEach((skill, index) => {
      const sx = 12 + index * 34, sy = this.height - 56;
      roundedBox(ctx, sx, sy, 28, 28, 7, alphaColor('#241b27', .86), alphaColor(skill?.color || theme.sticker || '#f4ca3f', .8), 1.1);
      const icon = this.skillImages?.[skill?.id];
      if (!drawImageIfReady(ctx, icon, sx + 3, sy + 3, 22, 22)) {
        paint(ctx, skill?.color || '#fff0a6'); ctx.font = '900 10px sans-serif'; method(ctx, 'fillText', String(skill?.level || index + 1), sx + 10, sy + 18);
      } else {
        paint(ctx, '#fff0a6'); ctx.font = '900 8px sans-serif'; method(ctx, 'fillText', String(skill?.level || index + 1), sx + 19, sy + 10);
      }
    });
    const boss = Array.isArray(state.enemies) ? state.enemies.find((enemy) => enemy?.kind === 'boss') : null;
    if (boss) {
      roundedBox(ctx, this.width / 2 - 92, 84, 184, 18, 8, alphaColor('#241b27', .86), alphaColor('#ef3e37', .8), 1.1);
      roundedBox(ctx, this.width / 2 - 89, 87, 178 * clamp(n(boss.hp, 0) / Math.max(1, n(boss.maxHp, 1)), 0, 1), 12, 5, '#ef3e37', null);
      paint(ctx, '#fff0a6'); ctx.font = '900 9px sans-serif'; method(ctx, 'fillText', String(boss.name || (boss.final ? '最终妖王' : '妖王')).slice(0, 16), this.width / 2, 97);
    }
    if (state.status === 'upgrade' || state.status === 'paused' || state.status === 'won' || state.status === 'lost') {
      const label = state.status === 'upgrade' ? '选择法宝' : state.status === 'paused' ? '暂停' : state.status === 'won' ? '功德圆满' : '西游未完';
      roundedBox(ctx, this.width / 2 - 76, this.height - 48, 152, 32, 12, alphaColor('#fbf1cf', .95), alphaColor(theme.ink, .6), 1.5);
      paint(ctx, theme.ink); ctx.font = 'bold 14px sans-serif'; method(ctx, 'fillText', label, this.width / 2 - 28, this.height - 27);
    }
    method(ctx, 'restore');
  }
}

export { GameRenderer, drawPortrait };
export default GameRenderer;




