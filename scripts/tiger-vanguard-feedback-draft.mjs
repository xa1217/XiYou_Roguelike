import { isPreviewVanguard } from './tiger-vanguard-event-preview.mjs';

// Evidence only: replace two numeric slots in the original renderer buffer.
// Current-render geometry must come from the body/bar actually drawn, not a
// second animation sample or stale frame. No entity references enter the buffer.
const box = b => b && ['left', 'right', 'top', 'bottom'].every(k => Number.isFinite(b[k]))
  && b.right > b.left && b.bottom > b.top;
const copy = b => ({ left: b.left, right: b.right, top: b.top, bottom: b.bottom });
const writableBox = b => box(b) && ['left', 'right', 'top', 'bottom'].every(k => {
  const descriptor = Object.getOwnPropertyDescriptor(b, k);
  return descriptor && Object.hasOwn(descriptor, 'value') && descriptor.writable === true;
});
const slotPlan = enemies => {
  const rows = []; let count = 0;
  if (!Array.isArray(enemies)) return { rows, count };
  for (const enemy of enemies) {
    if (!enemy || count >= 512) break;
    const row = { enemy, bodyIndex: count++, barIndex: null }; rows.push(row);
    if (count >= 512) break;
    const kind = enemy.kind === 'boss' ? 'boss' : enemy.kind === 'elite' ? 'elite' : 'normal';
    if (enemy.maxHp > 0 && (kind !== 'normal' || enemy.hp < enemy.maxHp)) row.barIndex = count++;
  }
  return { rows, count };
};

export function synchronizeVanguardFeedbackRects(rects, enemies, context) {
  const result = { applied: false, rectCount: rects?.length || 0, replacements: [], errors: [] };
  if (!Array.isArray(rects) || rects.length > 512) { result.errors.push('INVALID_SOURCE_BUFFER'); return result; }
  const plan = slotPlan(enemies);
  if (plan.count !== rects.length) { result.errors.push('SOURCE_SLOT_COUNT_MISMATCH'); return result; }
  if (!Number.isSafeInteger(context?.renderToken) || context.renderToken <= 0) { result.errors.push('INVALID_RENDER_TOKEN'); return result; }
  const binding = context?.binding, state = context?.state;
  if (!binding || binding.enemy?.kind !== 'elite' || !isPreviewVanguard(binding.enemy, state)
    || binding.id !== binding.enemy.id || binding.identity !== binding.enemy.encounterIdentity) return result;
  const updates = [];
  for (const row of plan.rows) {
    if (row.enemy !== binding.enemy || row.enemy.id !== binding.id || row.enemy.encounterIdentity !== binding.identity) continue;
    if (!writableBox(rects[row.bodyIndex]) || (row.barIndex !== null && !writableBox(rects[row.barIndex]))) {
      result.errors.push('INVALID_SOURCE_TARGET_SLOT'); return result;
    }
    let geometry;
    try { geometry = context.geometryFor(row.enemy); } catch { result.errors.push('GEOMETRY_LOOKUP_FAILED'); return result; }
    if (!geometry || geometry.renderToken !== context.renderToken) { result.errors.push('NO_CURRENT_RENDER_GEOMETRY'); return result; }
    if (!box(geometry.body) || (row.barIndex !== null && !box(geometry.bar))) { result.errors.push('INVALID_CURRENT_GEOMETRY'); return result; }
    updates.push({ row, body: copy(geometry.body), bar: row.barIndex !== null ? copy(geometry.bar) : null });
  }
  // Validate the whole plan before committing, so errors leave original slots.
  for (const { row, body, bar } of updates) {
    const beforeBody = copy(rects[row.bodyIndex]), beforeBar = row.barIndex !== null ? copy(rects[row.barIndex]) : null;
    Object.assign(rects[row.bodyIndex], body);
    if (bar) Object.assign(rects[row.barIndex], bar);
    result.replacements.push({ enemyId: binding.id, bodyIndex: row.bodyIndex, barIndex: row.barIndex,
      beforeBody, body, beforeBar, bar, barMissingAtCap: row.barIndex === null && rects.length === 512 });
  }
  result.applied = updates.length > 0;
  return result;
}
