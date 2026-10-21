// EVIDENCE ONLY. Conservative draw rectangles and alpha>8 visible-bbox proxies
// use the existing per-page fixed scale and unapproved motion-draft pivots.
const finite = (...values) => values.every(Number.isFinite);
const rect = r => r && finite(r.x, r.y, r.w, r.h) && r.w > 0 && r.h > 0;
const union = boxes => ({ left: Math.min(...boxes.map(b => b.left)), right: Math.max(...boxes.map(b => b.right)),
  top: Math.min(...boxes.map(b => b.top)), bottom: Math.max(...boxes.map(b => b.bottom)) });
const frozenBox = b => Object.freeze(b);

export function buildVanguardLayoutDraft(candidate, motion) {
  if (candidate?.frames?.length !== 32 || motion?.frames?.length !== 32) throw Error('Expected locked 32-pose inputs');
  const pages = new Map(candidate.pages.map(p => [p.id, p]));
  const frames = candidate.frames.map((f, index) => {
    const m = motion.frames[index], page = pages.get(f.page), source = f.sourceRect, visible = f.visibleRect;
    if (f.index !== index || m.index !== index || f.state !== m.state || f.page !== m.page
      || !page || f.standingReferenceHeight !== page.standingReferenceHeight || m.standingReferenceHeight !== f.standingReferenceHeight
      || !finite(f.standingReferenceHeight, m.pivot?.x, m.pivot?.y) || f.standingReferenceHeight <= 0
      || !rect(source) || !rect(visible) || JSON.stringify(source) !== JSON.stringify(m.sourceRect)
      || source.x < 0 || source.y < 0 || source.x + source.w > page.width || source.y + source.h > page.height
      || visible.x < source.x || visible.y < source.y || visible.x + visible.w > source.x + source.w
      || visible.y + visible.h > source.y + source.h) throw Error(`Invalid fixed-scale pose ${index}`);
    const reference = f.standingReferenceHeight, px = m.pivot.x, py = m.pivot.y;
    const normalized = r => frozenBox({ left: (r.x - source.x - px) / reference,
      right: (r.x - source.x + r.w - px) / reference,
      top: (r.y - source.y - py) / reference, bottom: (r.y - source.y + r.h - py) / reference });
    return Object.freeze({ index, state: f.state, page: f.page, standingReferenceHeight: reference,
      draw: normalized(source), visibleAlpha8Proxy: normalized(visible) });
  });
  const alive = frames.filter(f => f.state !== 'death');
  if (alive.length !== 28) throw Error('Expected 28 alive poses and four death poses');
  return Object.freeze({ schema: 'xiyou-vanguard-layout-evidence/v1', scope: 'EVIDENCE_ONLY_NOT_A_RUNTIME_CONTRACT',
    standingHeightInRadii: 3.2, groundOffsetInRadii: .7, gapWorld: 4,
    frames: Object.freeze(frames), aliveDrawEnvelope: frozenBox(union(alive.map(f => f.draw))),
    aliveVisibleAlpha8Envelope: frozenBox(union(alive.map(f => f.visibleAlpha8Proxy))),
    includesUnsupportedAttackPosesConservatively: true, rootApproved: false, runtimeApproved: false,
    healthBarLayoutApproved: false, highFrameApproved: false, publicPass: false });
}

export function projectVanguardLayout(draft, pose) {
  if (!pose || !Number.isInteger(pose.index) || !draft?.frames?.[pose.index]
    || !finite(pose.x, pose.y, pose.radius) || pose.radius <= 0 || ![-1, 1].includes(pose.facing)) return null;
  const f = draft.frames[pose.index], height = pose.radius * draft.standingHeightInRadii;
  const ground = pose.y + pose.radius * draft.groundOffsetInRadii;
  const project = b => {
    const a = b.left * height * pose.facing, c = b.right * height * pose.facing;
    return { left: pose.x + Math.min(a, c), right: pose.x + Math.max(a, c),
      top: ground + b.top * height, bottom: ground + b.bottom * height };
  };
  // Same background width/height rules as the current renderer helper.
  const widthArgument = pose.radius * 2.3, width = Math.max(20, widthArgument), barHeight = Math.max(3, width * .08);
  const stableTop = ground + draft.aliveDrawEnvelope.top * height;
  const bar = f.state === 'death' ? null : { x: pose.x, y: stableTop - draft.gapWorld - barHeight,
    widthArgument, width, height: barHeight, left: pose.x - width / 2, right: pose.x + width / 2,
    bottom: stableTop - draft.gapWorld, gapWorld: draft.gapWorld };
  return { index: f.index, state: f.state, ground, standingHeight: height,
    draw: project(f.draw), visibleAlpha8Proxy: project(f.visibleAlpha8Proxy), bar };
}
