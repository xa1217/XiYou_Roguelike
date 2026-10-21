import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildOccludedPlayerOutline } from './tiger-vanguard-player-outline-draft.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rgba = () => new Uint8ClampedArray(7*7*4);
const rectangle = (b,l,t,r,d,alpha=255) => { for(let y=t;y<d;y++) for(let x=l;x<r;x++) b[(y*7+x)*4+3]=alpha; return b; };
const player = rectangle(rgba(),2,2,5,5), enemy = rectangle(rgba(),1,1,6,6);
const input = extra => ({ width:7,height:7,playerRGBA:player,occluderRGBA:enemy,renderToken:1,playerToken:1,occluderToken:1,occluderDrawnAfterPlayer:true,thickness:1,...extra });
const tests=[],record=(name,run)=>{run();tests.push({name,result:'PASS'});};
record('inner one-pixel ring appears only where the later sprite overlaps, not a solid fill',()=>{
  const result=buildOccludedPlayerOutline(input());assert.equal(result.applied,true);assert.equal(result.playerPixels,9);assert.equal(result.overlapPixels,9);assert.equal(result.outlinePixels,8);
  assert.equal(result.rgba[(3*7+3)*4+3],0);assert.deepEqual(result.screenBounds,{left:2,right:5,top:2,bottom:5});
  for(let i=0;i<result.rgba.length;i+=4)if(result.rgba[i+3]){assert.ok(player[i+3]>8&&enemy[i+3]>8);assert.deepEqual([...result.rgba.slice(i,i+4)],[255,240,166,210]);}
});
record('transparent/non-overlapping/earlier draws produce no hint',()=>{
  for(const extra of [{occluderDrawnAfterPlayer:false},{occluderRGBA:rectangle(rgba(),1,1,6,6,8)},{occluderRGBA:rectangle(rgba(),5,5,6,6)}])assert.equal(buildOccludedPlayerOutline(input(extra)).applied,false);
});
record('missing/invalid/stale current-frame tokens fail closed without an outline',()=>{
  for(const extra of [{renderToken:undefined,playerToken:undefined,occluderToken:undefined},{renderToken:0},{renderToken:1.5},{playerToken:2},{occluderToken:2}]){
    const result=buildOccludedPlayerOutline(input(extra));assert.equal(result.applied,false);assert.deepEqual(result.errors,['CURRENT_RENDER_TOKENS_REQUIRED']);assert.ok(result.rgba.every(v=>v===0));
  }
});
record('viewport crop is not treated as a semantic silhouette edge',()=>{
  const result=buildOccludedPlayerOutline(input({playerRGBA:rectangle(rgba(),0,2,3,5)}));assert.equal(result.applied,false);assert.equal(result.clippedPlayerAtViewport,true);assert.deepEqual(result.errors,['CLIPPED_PLAYER_SILHOUETTE_NOT_SUPPORTED']);
});
record('dimensions/buffers/parameters bounded and source arrays never mutated',()=>{
  const p=player.slice(),e=enemy.slice();buildOccludedPlayerOutline(input());assert.deepEqual(player,p);assert.deepEqual(enemy,e);
  for(const extra of [{width:513},{height:1025},{width:NaN},{playerRGBA:new Uint8ClampedArray(1)},{thickness:4},{alphaThreshold:255}])assert.throws(()=>buildOccludedPlayerOutline(input(extra)));
});
const generatedAt=new Date().toISOString(),dir=path.join(root,'evidence/current/tiger-vanguard/player-outline-draft',generatedAt.replaceAll(':','-').replaceAll('.','-'));
fs.mkdirSync(dir,{recursive:true});
const file='scripts/tiger-vanguard-player-outline-draft.mjs',report={generatedAt,result:'PASS_EVIDENCE_ONLY_OCCLUDED_PLAYER_OUTLINE_MASK',
  scope:'Synthetic RGBA helper checks only, not real sprites/browser, artistic readability, natural gameplay, motion, FPS or public acceptance.',
  helper:{file,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')},tests,
  alphaThreshold:8,thicknessScreenPixels:2,color:[255,240,166,210],maskScope:'inner player-alpha ring intersected with later candidate-alpha pixels; no solid hero fill',
  sourceImagesChanged:false,playerReadabilityApproved:false,rootApproved:false,runtimeApproved:false,highFrameApproved:false,publicPass:false,releaseReady:false};
fs.writeFileSync(path.join(dir,'node.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({file:path.relative(root,path.join(dir,'node.json')).replaceAll('\\','/'),result:report.result,tests},null,2));
