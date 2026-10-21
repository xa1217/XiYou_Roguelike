// Evidence-only registration/timing draft. This module is not a game actor or
// runtime asset contract. Source pixels, crops and whole-page scales stay fixed.
export const MOTION_DRAFT_RATES = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });
const PLANES = Object.freeze({ idle: 212, move: 432, attack: 656, hit: 863 });
const COLUMN_PITCH = 1774 / 8;
const COLUMN_ROOT = 125;

export function createMotionDraft(candidate, input) {
  const draft = {
    schema: 'xiyou-motion-registration-draft/v1',
    id: 'tiger-vanguard-source-lattice-motion-draft',
    status: 'REVIEW', scope: 'EVIDENCE_ONLY_NOT_A_RUNTIME_CONTRACT',
    runtimeApproved: false, highFrameApproved: false, publicPass: false,
    input,
    sourcePages: candidate.pages.map(p => ({ id: p.id, file: p.file, sha256: p.sha256, width: p.width, height: p.height, standingReferenceHeight: p.standingReferenceHeight })),
    rootPolicy: {
      x: 'Draft source-column registration: column*221.75+125, chosen near standing pelvis, NOT a measured/authored original root. Keeps authored within-column pose displacement instead of following changing sword/tail bbox.',
      y: 'One source ground plane per standing state (idle212/move432/attack656/hit863). Airborne source poses retain their gap. Death uses lowest-alpha bbox as a provisional floor proxy, which includes the blade and is NOT anatomical ground contact.',
      patch: 'Transfer x registration from original7/30/31 using previously documented near-foot/approximate-shoulder x references at fixed443/170 scale. These are annotations, not exact semantic matches. Idle uses support foot y; death uses provisional lowest-alpha floor.',
      columnPitch: COLUMN_PITCH, firstColumnRoot: COLUMN_ROOT, standingStatePlanes: PLANES,
      unresolved: ['Original sheet column centers are a layout hypothesis, not authored body roots', 'Patch death shoulder x annotations are approximate', 'Death floor includes blade, so hand/foot contact still needs in-context visual review'],
    },
    timingPolicy: {
      units: 'source poses per second, NOT display FPS',
      rationale: 'idle1s breath, move2/3s stride, attack0.5s, hit0.25s, death0.4s. Uniform per-state clocks fit the existing actor clock shape but do not register this elite as an ordinary tiger.',
      visualOnly: true, damageSynchronizationApproved: false,
      gameplayUnchanged: true, eliteDeathEffectTtlSeconds: 0.42,
      note: 'Four death poses fit within existing elite0.42s TTL at10 poses/s. Current non-actor0.12s hit timer cannot show four poses at16/s; any future integration needs isolated visual timers, never extended damage/stun/invulnerability.',
      priorityDraft: ['death (terminal)', 'hit interrupts attack', 'attack', 'move or idle'],
    },
    states: Object.fromEntries(Object.entries(candidate.states).map(([state, s]) => [state, {
      frames: [...s.frames], sourcePosesPerSecond: MOTION_DRAFT_RATES[state],
      durationMs: s.frames.length / MOTION_DRAFT_RATES[state] * 1000,
      loop: state === 'idle' || state === 'move',
      end: state === 'death' ? 'hold-last' : state === 'attack' || state === 'hit' ? 'resume-locomotion' : 'loop',
    }])),
    frames: candidate.frames.map(f => {
      let rootX = f.index % 8 * COLUMN_PITCH + COLUMN_ROOT;
      let rootY = PLANES[f.state] ?? f.visibleRect.y + f.visibleRect.h;
      let registration = { method: 'source-column-x/state-plane-y', rootX, rootY };
      if (f.state === 'death') registration.method = 'source-column-x/provisional-visible-bottom-y';
      if (f.page === 'patch') {
        // Visible-local x annotations from the completed endpoint diagnostics;
        // do not substitute image bbox width or adjust per-frame scale.
        const reference = {
          7: { originalVisibleX: 1569, originalReferenceX: 54, patchReferenceX: 129.5, kind: 'near-support-foot', uncertainty: 'alpha-window reference, not pelvis' },
          30: { originalVisibleX: 1327, originalReferenceX: 108, patchReferenceX: 302, kind: 'approximate-shoulder', uncertainty: 'manual approximate point, not exact plate center' },
          31: { originalVisibleX: 1552, originalReferenceX: 116, patchReferenceX: 350, kind: 'approximate-shoulder', uncertainty: 'manual approximate point, not exact plate center' },
        }[f.index];
        const originalRootX = rootX;
        rootX = f.visibleRect.x + reference.patchReferenceX + (originalRootX - reference.originalVisibleX - reference.originalReferenceX) * 443 / 170;
        rootY = f.visibleRect.y + f.visibleRect.h;
        registration = { method: 'fixed-scale-reference-transfer-x/provisional-floor-y', originalRootX, ...reference, rootX, rootY };
      }
      return {
        index: f.index, state: f.state, page: f.page, sourceRect: { ...f.sourceRect },
        rgbaSha256: f.rgbaSha256, standingReferenceHeight: f.standingReferenceHeight,
        pivot: { x: rootX - f.sourceRect.x, y: rootY - f.sourceRect.y }, registration,
        controlPivot: { x: f.diagnosticPivot.x, y: f.diagnosticPivot.y },
      };
    }),
  };
  return draft;
}

// Used unchanged by Node probes and browser playback. An interrupted action
// starts a new local clock. This helper never changes a game entity or timer.
export function selectDraftPose(draft, state, elapsedMs, resume = 'idle') {
  if (!Object.hasOwn(draft.states, state)) throw new Error('Unknown draft state');
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) throw new Error('Invalid elapsed clock');
  if (resume !== 'idle' && resume !== 'move') throw new Error('Invalid resume state');
  const spec = draft.states[state];
  if (!spec.loop && state !== 'death' && elapsedMs + 1e-7 >= spec.durationMs) {
    return selectDraftPose(draft, resume, Math.max(0, elapsedMs - spec.durationMs), resume);
  }
  const clock = spec.loop ? elapsedMs % spec.durationMs : Math.min(elapsedMs, spec.durationMs);
  const slot = Math.min(spec.frames.length - 1, Math.floor((clock + 1e-7) * spec.sourcePosesPerSecond / 1000));
  return { state, index: spec.frames[slot], held: state === 'death' && elapsedMs >= spec.durationMs };
}

export function draftPlacement(frame, height, facing, policy = 'draft') {
  if (!Number.isFinite(height) || height <= 0 || ![1, -1].includes(facing)) throw new Error('Invalid draw size/facing');
  if (!['draft', 'control'].includes(policy)) throw new Error('Unknown placement policy');
  const scale = height / frame.standingReferenceHeight, p = policy === 'draft' ? frame.pivot : frame.controlPivot;
  return { scale, facing, x: -p.x * scale, y: -p.y * scale, w: frame.sourceRect.w * scale, h: frame.sourceRect.h * scale };
}
