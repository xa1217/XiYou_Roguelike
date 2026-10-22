import {NativeGame} from './src/native-ui.js';import {AudioManager} from './src/audio.js';
import {attachTigerFrames} from './src/tiger-animation.js';
import {attachBearFrames} from './src/bear-animation.js';
import {attachBullFrames} from './src/bull-animation.js';
import {attachWolfFrames} from './src/wolf-animation.js';
import {attachMonkeyFrames} from './src/monkey-animation.js';
import {attachDeerFrames} from './src/deer-animation.js';
import {attachHawkFrames} from './src/hawk-animation.js';
import {attachSnakeFrames} from './src/snake-animation.js';
import {attachBossFrames} from './src/boss-animation.js';
import {attachSkillFx} from './src/skill-fx-animation.js';
const canvas=document.querySelector('canvas');const audio=new AudioManager();const debugAllowed=(location.hostname==='localhost'||location.hostname==='127.0.0.1')&&new URLSearchParams(location.search).has('debug');const game=new NativeGame(canvas,{width:390,height:Math.min(844,window.innerHeight),pixelRatio:window.devicePixelRatio,debug:debugAllowed,audio,requestFrame:fn=>requestAnimationFrame(fn),cancelFrame:id=>cancelAnimationFrame(id),now:()=>performance.now(),load:key=>{try{return JSON.parse(localStorage.getItem(key));}catch{return null;}},save:(key,v)=>localStorage.setItem(key,JSON.stringify(v)),confirm:(text,accept)=>{if(confirm(text))accept();}});window.xiyou=game;
const fit=()=>{const r=canvas.getBoundingClientRect();if(r.width>0&&r.height>0)game.resize(Math.round(r.width),Math.round(r.height),window.devicePixelRatio||1,{top:0,bottom:r.height});};window.addEventListener('resize',fit,{passive:true});window.addEventListener('orientationchange',()=>setTimeout(fit,80),{passive:true});fit();
const p=e=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*game.w/r.width,y:(e.clientY-r.top)*game.h/r.height};};canvas.addEventListener('pointerdown',e=>{audio.unlock();canvas.setPointerCapture(e.pointerId);const q=p(e);game.touchStart(q.x,q.y);});canvas.addEventListener('pointermove',e=>{const q=p(e);game.touchMove(q.x,q.y);});canvas.addEventListener('pointerup',()=>game.touchEnd());canvas.addEventListener('pointercancel',()=>game.touchEnd());
const keys=new Set();const input=()=>{game.input={x:Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft')),y:Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'))};};window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(e.key===' '){e.preventDefault();game.engine?.useDash(game.input);}else if(k==='p'||e.key==='escape'){e.preventDefault();if(game.engine?.state.status==='playing'){game.engine.pause();game.draw();}else if(game.engine?.state.status==='paused'){game.engine.resume();game.wake();game.draw();}}else if(k==='m'){game.save.muted=!game.save.muted;game.audio.setMuted(game.save.muted);game.persist();game.draw();}else{keys.add(k);input();}});window.addEventListener('keyup',e=>{keys.delete(e.key.toLowerCase());input();});document.addEventListener('visibilitychange',()=>document.hidden?game.onHide():game.onShow());window.addEventListener('pagehide',()=>game.dispose());
// Large authored PNGs are fetched one at a time. This keeps the playable
// entry responsive on a public Quick Tunnel, where many concurrent multi-MB
// streams can be cancelled by the anonymous edge connection. SVG fallbacks
// remain immediate while the queued sprites decode.
const imageQueue=[],priorityImageQueue=[];let imageQueueScheduled=false,imageQueueBusy=false;
const pumpImageQueue=()=>{if(imageQueueBusy)return;const item=priorityImageQueue.shift()||imageQueue.shift();if(!item)return;imageQueueBusy=true;const finish=()=>{imageQueueBusy=false;pumpImageQueue();};item.image.onload=async()=>{try{await item.onload?.();}catch{item.onerror?.();}finally{finish();}};item.image.onerror=()=>{try{item.onerror?.();}finally{finish();}};item.image.src=item.src;};
const queueImage=(image,src,onload,onerror,priority=false)=>{const item={image,src,onload,onerror};(priority?priorityImageQueue:imageQueue).push(item);if(!imageQueueScheduled){imageQueueScheduled=true;queueMicrotask(()=>{imageQueueScheduled=false;pumpImageQueue();});}};
const sheet=new Image();queueImage(sheet,'./assets/hero-cards-v2-comic.png',()=>{game.heroSheet=sheet;game.draw();});
// Transparent authored SVG art is retained for character cards and special
// previews. The playable battle slice uses the real v3 frame sheets below;
// the renderer's vector rig remains the deterministic fallback, so a single
// polished illustration is never presented as a fake animation frame.
const heroImages={};game.heroImages=heroImages;
// Keep menu/gallery art separate from gameplay sheets. NativeGame exposes the
// v3 map through heroImages for the renderer and browser evidence, while
// portraitImages stays on the lightweight SVG/card path for selection UI.
const portraitImages={};game.portraitImages=portraitImages;
// The SVGs are menu/gallery fallbacks only. Their legacy frame metadata stays
// available for offline previews, but native-ui.portrait deliberately ignores
// a v3 gameplay sheet when drawing a menu portrait.
const BATTLE_FRAME_COUNTS={idle:2,move:4,attack:4,hit:2,stun:2,dash:4,intro:6,death:6};
const BATTLE_FRAME_SCALE={
  idle:[1,.99], move:[.98,1.02], attack:[.96,1.12], hit:[1.08,.98], stun:[1,.96],
  dash:[1.08,1.14], intro:[.72,1], death:[1,.24]
};
const BATTLE_FRAME_OFFSET={
  idle:[0,.01], move:[-.04,.05], attack:[-.02,.03], hit:[.04,-.02], stun:[0,.01],
  dash:[-.08,.1], intro:[-.05,.02], death:[.02,-.08]
};
const animationFramesFor=(source,state)=>{
  const count=BATTLE_FRAME_COUNTS[state]||2, scaleRange=BATTLE_FRAME_SCALE[state]||[1,1], offsetRange=BATTLE_FRAME_OFFSET[state]||[0,0];
  const rects=[], offsets=[], scales=[];
  for(let i=0;i<count;i+=1){
    const t=count<=1?0:i/(count-1), phase=(i%2)*1.5;
    const inset=Math.min(2,Math.floor(Math.min(source.w,source.h)/80))+phase;
    rects.push({x:source.x+inset,y:source.y+inset*.5,w:Math.max(1,source.w-inset*2),h:Math.max(1,source.h-inset)});
    offsets.push({dx:offsetRange[0]+(offsetRange[1]-offsetRange[0])*t,dy:Math.sin(t*Math.PI)*Math.abs(offsetRange[1]-offsetRange[0])*.35});
    const eased=Math.sin(t*Math.PI);
    scales.push({x:1+(scaleRange[1]-1)*eased,y:1+(scaleRange[0]-1)*eased});
  }
  return {source,rects,offsets,scales,frames:count};
};
const attachAnimationFrames=(image,id,source)=>{
  if(!image)return image;
  const rect=source||{x:0,y:0,w:Number(image.naturalWidth||image.width)||1,h:Number(image.naturalHeight||image.height)||1};
  image.__frameGrids=image.__frameGrids||{};
  image.__frameGrids[id]={source:rect,states:Object.fromEntries(Object.keys(BATTLE_FRAME_COUNTS).map(state=>[state,animationFramesFor(rect,state)]))};
  image.__animationFrameContract=image.__animationFrameContract||{};
  image.__animationFrameContract[id]={states:{...BATTLE_FRAME_COUNTS},source:rect};
  return image;
};
// The atlas remains available to the gallery/asset audit. It is not the
// gameplay renderer's source: startRun() selects battleArtMode:'authoredFrames'.
for(const [id,file] of Object.entries({wukong:'hero-wukong.svg',tangsanzang:'hero-tangseng.svg',bajie:'hero-bajie.svg',shajing:'hero-wujing.svg'})){
  const image=new Image();image.onload=()=>{portraitImages[id]=image;game.draw();};image.src=`./assets/${file}`;
}
// Skill slots reuse the eight authored artifact icons and add four distinct
// weapon emblems.  They are small painted PNGs queued ahead of the
// multi-megabyte battle sheets, and the renderer fallback remains if one
// has not loaded yet.
const skillIconFiles={
  'weapon:wukong':'skill-icon-wukong.png',
  'weapon:tangsanzang':'skill-icon-tangsanzang.png',
  'weapon:bajie':'skill-icon-bajie.png',
  'weapon:shajing':'skill-icon-shajing.png',
  'purple-gourd':'skill-icon-purple-gourd.png',
  'iron-fan':'skill-icon-iron-fan.png',
  'diamond-snare':'skill-icon-diamond-snare.png',
  'nine-dragon':'skill-icon-nine-dragon.png',
  'lotus-lantern':'skill-icon-lotus-lantern.png',
  'golden-rope':'skill-icon-golden-rope.png',
  'moon-mirror':'skill-icon-moon-mirror.png',
  'samadhi-fire':'skill-icon-samadhi-fire.png'
};
const skillImages={};game.skillImages=skillImages;
const skillFxImages={};game.skillFxImages=skillFxImages;
for(const [id,file] of Object.entries(skillIconFiles)){
  const image=new Image();queueImage(image,`./assets/${file}`,()=>{skillImages[id]=image;if(game.renderer)game.renderer.skillImages=skillImages;game.draw();},()=>{});
}
// Battle v3 sheets are real 4×2 animation atlases generated for gameplay,
// not crops of the old gallery illustrations.  Each cell is a distinct pose:
// idle/walk occupy the first row, attack/hit/dash the second row.  The
// renderer mirrors the right-facing source for left-facing travel.
const battleV3Sequences={
  idle:[0,1,2,3,2,1], move:[1,2,3,1,2,3,2,1], attack:[4,4,5,5,4,5,5,4],
  hit:[6,5,6,5], stun:[6,6,0,1], dash:[7,5,7,5,7,5,7,5], intro:[0,1,2,3,0,1,2,3,0,1], death:[6,6,5,4,0,0,6,6]
};
const attachBattleV3Frames=(image,id)=>{
  if(!image)return image;
  const width=Number(image.naturalWidth||image.width)||1,height=Number(image.naturalHeight||image.height)||1;
  const cols=4,rows=2,cellW=width/cols,cellH=height/rows;
  const cells=Array.from({length:8},(_,index)=>{const col=index%cols,row=Math.floor(index/cols);return {x:col*cellW,y:row*cellH,w:col===cols-1?width-col*cellW:cellW,h:row===rows-1?height-row*cellH:cellH};});
  image.__v3BattleSprite=true;image.__prioritySprite=true;image.__battleFrameContract={id,cols,rows,fps:{idle:8,move:12,attack:16,hit:18,stun:8,dash:18,intro:12,death:14},pivot:{x:.5,y:.88}};
  image.__frameGrids={[id]:{source:{x:0,y:0,w:width,h:height},states:Object.fromEntries(Object.entries(battleV3Sequences).map(([state,sequence])=>[state,{frames:sequence.length,rects:sequence.map(index=>cells[index])}]))}};
  return image;
};
const battleV3Files={wukong:'hero-wukong-battle-v3-sheet.png',tangsanzang:'hero-tangseng-battle-v3-sheet.png',bajie:'hero-bajie-battle-v3-sheet.png',shajing:'hero-wujing-battle-v3-sheet.png'};
for(const [id,file] of Object.entries(battleV3Files)){
  const image=new Image();queueImage(image,`./assets/${file}`,()=>{attachBattleV3Frames(image,id);heroImages[id]=image;if(game.renderer)game.renderer.heroImages=heroImages;game.draw();},()=>{},true);
}
// Retired single-pose battle PNGs are deliberately not fetched at startup.
// They remain in the repository for provenance/gallery comparison only; the
// playable path uses the four real v3 sheets above and vector fallback.
const enemyImages={};game.enemyImages=enemyImages;for(const [id,file] of Object.entries({creature:'enemy-creature.svg',brute:'enemy-brute.svg',bird:'enemy-bird.svg',spider:'enemy-spider.svg',boss:'enemy-boss.svg'})){const image=new Image();image.onload=()=>{attachAnimationFrames(image,id);if(!enemyImages[id]?.__prioritySprite)enemyImages[id]=image;if(game.renderer)game.renderer.enemyImages=enemyImages;game.draw();};image.src=`./assets/${file}`;}
// This measured atlas is not a uniform grid. Publish it to the renderer only
// after both image decoding and rectangle validation succeed; failures retain
// the same deterministic vector rig. Large images still use the serial queue.
for(const [id,attach,version='v1'] of [['tiger',attachTigerFrames],['bear',attachBearFrames],['bull',attachBullFrames],['wolf',attachWolfFrames],['monkey',attachMonkeyFrames],['deer',attachDeerFrames],['hawk',attachHawkFrames],['snake',attachSnakeFrames,'v3']]){
  const image=new Image();
  queueImage(image,`./assets/enemy-${id}-battle-${version}-sheet.png`,async()=>{
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
    try{
      const response=await fetch(`./assets/enemy-${id}-battle-${version}-frames.json`,{signal:controller.signal});
      if(!response.ok)throw new Error('Enemy frame contract unavailable');
      attach(image,await response.json());enemyImages[id]=image;
      if(game.renderer)game.renderer.enemyImages=enemyImages;game.draw();
    }catch{/* Missing/invalid/timed-out contract retains the vector fallback. */}
    finally{clearTimeout(timeout);}
  },()=>{},true);
}
// Signature-weapon skill-effect strips: the renderer prefers these
// painted animations for the four signature effects once a strip loads
// and keeps its vector effects otherwise, so they ride the same serial
// queue after the battle sheets.
const skillFxFiles={
  'slash-arc':'skill-fx-slash-arc.png',
  'light-orb':'skill-fx-light-orb.png',
  'rake-sweep':'skill-fx-rake-sweep.png',
  'water-ring':'skill-fx-water-ring.png'
};
for(const [fxId,file] of Object.entries(skillFxFiles)){
  const image=new Image();
  queueImage(image,`./assets/${file}`,()=>{if(attachSkillFx(image,fxId)){skillFxImages[fxId]=image;if(game.renderer)game.renderer.skillFxImages=skillFxImages;}},()=>{},true);
}
// Named final-boss atlases load through the same serial queue and contract
// discipline, keyed by bossId; failures keep the vector identity profiles.
for(const bossId of ['yin-general','xiong-shanjun','te-chushi']){
  const image=new Image();
  queueImage(image,`./assets/enemy-${bossId}-battle-v1-sheet.png`,async()=>{
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
    try{
      const response=await fetch(`./assets/enemy-${bossId}-battle-v1-frames.json`,{signal:controller.signal});
      if(!response.ok)throw new Error('Boss frame contract unavailable');
      attachBossFrames(bossId)(image,await response.json());enemyImages[bossId]=image;
      if(game.renderer)game.renderer.enemyImages=enemyImages;game.draw();
    }catch{/* Missing/invalid/timed-out contract retains the vector fallback. */}
    finally{clearTimeout(timeout);}
  },()=>{},true);
}

// Gallery maps are also kept out of the battle startup path. The combat map
// uses the quiet vector plate, while chapter previews can opt into authored
// layers later without competing with animation-sheet decoding.
const mapImages={forest:{},temple:{},doublefork:{}};game.mapImages=mapImages;

