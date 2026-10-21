// EVIDENCE ONLY. Rasterize the already successful current-frame sprite draws
// elsewhere; this pure helper neither redraws game actors nor changes assets.
export function buildOccludedPlayerOutline(input) {
  const { width, height, playerRGBA, occluderRGBA, renderToken, playerToken, occluderToken,
    occluderDrawnAfterPlayer, thickness = 2, alphaThreshold = 8 } = input || {};
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0
    || width > 512 || height > 1024 || width * height > 524288) throw Error('BOUNDED_SCREEN_DIMENSIONS_REQUIRED');
  if (!(playerRGBA instanceof Uint8ClampedArray) || !(occluderRGBA instanceof Uint8ClampedArray)
    || playerRGBA.length !== width * height * 4 || occluderRGBA.length !== playerRGBA.length) throw Error('EXACT_RGBA_BUFFERS_REQUIRED');
  if (!Number.isSafeInteger(thickness) || thickness < 1 || thickness > 3
    || !Number.isSafeInteger(alphaThreshold) || alphaThreshold < 0 || alphaThreshold > 254) throw Error('BOUNDED_OUTLINE_PARAMETERS_REQUIRED');
  const rgba = new Uint8ClampedArray(playerRGBA.length);
  const result = { applied: false, rgba, renderToken, width, height, thickness, alphaThreshold,
    playerPixels: 0, overlapPixels: 0, outlinePixels: 0, screenBounds: null, errors: [], clippedPlayerAtViewport: false };
  if (!Number.isSafeInteger(renderToken) || renderToken <= 0 || playerToken !== renderToken || occluderToken !== renderToken) {
    result.errors.push('CURRENT_RENDER_TOKENS_REQUIRED'); return result;
  }
  if (occluderDrawnAfterPlayer !== true) return result;
  const playerAt = (x,y) => x >= 0 && x < width && y >= 0 && y < height && playerRGBA[(y * width + x) * 4 + 3] > alphaThreshold;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (playerAt(x,y)) {
    result.playerPixels++;
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) result.clippedPlayerAtViewport = true;
  }
  // Do not invent a silhouette edge from a viewport crop.
  if (result.clippedPlayerAtViewport) { result.errors.push('CLIPPED_PLAYER_SILHOUETTE_NOT_SUPPORTED'); return result; }
  let left = width, right = -1, top = height, bottom = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    if (!playerAt(x,y) || occluderRGBA[i+3] <= alphaThreshold) continue;
    result.overlapPixels++;
    let boundary = false;
    for (let dy = -thickness; dy <= thickness && !boundary; dy++) for (let dx = -thickness; dx <= thickness; dx++) {
      if (!playerAt(x+dx,y+dy)) { boundary = true; break; }
    }
    if (!boundary) continue;
    rgba[i] = 255; rgba[i+1] = 240; rgba[i+2] = 166; rgba[i+3] = 210;
    result.outlinePixels++; left = Math.min(left,x); right = Math.max(right,x); top = Math.min(top,y); bottom = Math.max(bottom,y);
  }
  result.applied = result.outlinePixels > 0;
  if (result.applied) result.screenBounds = { left, right: right+1, top, bottom: bottom+1 };
  return result;
}
