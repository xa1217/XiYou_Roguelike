import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { GameRenderer, drawPortrait } from '../src/renderer.js';

const methods = ['beginPath','closePath','moveTo','lineTo','quadraticCurveTo','bezierCurveTo','arc','fill','stroke','fillRect','strokeRect','clearRect','fillText','setTransform','translate','scale','rotate','clip'];
const themes = ['forest','sand','snow','fire','water','temple'];
const characters = ['wukong','tangseng','bajie','wujing'];
const effectKinds = ['sweep','heavy-sweep','hoe-line','staff-ring','whirl','gourd','fan','fire-ring','lotus','rope','fire-mark','dash','warning'];

function mockCanvas() {
  const counters = { calls:0, stack:0, savedStates:0, badArgs:[], ops:{} };
  const ctx = {};
  for (const op of methods) ctx[op] = (...args) => {
    counters.calls += 1;
    counters.ops[op] = (counters.ops[op] || 0) + 1;
    for (const a of args) if (typeof a === 'number' && !Number.isFinite(a)) counters.badArgs.push([op,args]);
    if (op === 'arc' && args[2] < 0) counters.badArgs.push([op,args]);
  };
  ctx.save = () => { counters.calls += 1; counters.stack += 1; counters.savedStates += 1; };
  ctx.restore = () => { counters.calls += 1; counters.stack -= 1; assert.ok(counters.stack >= 0, 'unbalanced Canvas restore'); };
  const canvas = { width:0, height:0, getContext(type) { assert.equal(type,'2d'); return ctx; } };
  return { canvas, ctx, counters };
}

function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(freeze);
  }
  return value;
}

function makeState(theme='forest', id='wukong') {
  return {
    status:'playing',time:154,stage:{theme},character:{id},
    player:{x:900,y:900,radius:18,hp:145,maxHp:145,xp:7,xpNext:30,level:4,facing:Math.PI,invulnerable:.2},
    enemies:[
      {id:1,x:900,y:870,radius:15,kind:'normal',name:'wolf',variant:'wolf',hp:50,maxHp:100,stun:.2,flash:.1},
      {id:2,x:950,y:935,radius:28,kind:'elite',name:'bear',hp:50,maxHp:100},
      {id:3,x:845,y:935,radius:38,kind:'boss',name:'bull king',hp:500,maxHp:1000}
    ],
    gems:['xp','heal','coin','magnet'].map((kind,i)=>({x:905+i*4,y:902+i*3,kind})),
    projectiles:['light-orb','light-spark','fire-bird','ring'].map((kind,i)=>({kind,x:890+i*12,y:870,radius:7,vx:20,vy:3,ttl:1})),
    effects:effectKinds.map((kind,i)=>({kind,x:870+i*6,y:922,radius:30,ttl:.7,maxTtl:1,angle:Math.PI/3,color:'#abcd12'}))
  };
}

function makeStress() {
  const state = makeState();
  state.player.invulnerable = 0;
  state.enemies = Array.from({length:220},(_,i)=>({id:i,x:80+(i%22)*78,y:80+Math.floor(i/22)*170,radius:17,hp:80,maxHp:100,kind:i%40===0?'boss':i%15===0?'elite':'normal',variant:i%2?'runner':'brute',stun:0,flash:0}));
  state.projectiles = Array.from({length:300},(_,i)=>({id:i,x:(i%30)*60,y:Math.floor(i/30)*180,radius:7,vx:20,vy:4,kind:i%5?'light-orb':'fire-bird'}));
  state.effects = Array.from({length:160},(_,i)=>({id:i,x:(i%20)*90,y:Math.floor(i/20)*180,radius:26,ttl:.5,maxTtl:1,kind:i%2?'sweep':'impact'}));
  state.gems = Array.from({length:240},(_,i)=>({id:i,x:(i%20)*90,y:Math.floor(i/20)*170,radius:7,kind:'xp'}));
  return state;
}

const results = [];
function test(name,fn) { fn(); results.push(name); }

test('six themes/four heroes/all effects have finite balanced Canvas calls without roundRect/DOM',()=>{
  const {canvas,ctx,counters} = mockCanvas();
  const renderer = new GameRenderer(canvas,{width:375,height:667,pixelRatio:2});
  assert.equal(canvas.width,750); assert.equal(canvas.height,1334);
  const originalRandom = Math.random;
  Math.random = () => { throw new Error('renderer must not use Math.random per frame'); };
  try {
    for (const theme of themes) for(const id of characters) {
      const state = freeze(makeState(theme,id));
      const before = JSON.stringify(state);
      renderer.render(state,1/60);
      drawPortrait(ctx,id,32,32,60);
      assert.equal(JSON.stringify(state),before,'renderer changed simulation state');
    }
  } finally { Math.random = originalRandom; }
  assert.equal(counters.stack,0);
  assert.deepEqual(counters.badArgs,[]);
  assert.ok(counters.calls>10000);
  assert.equal('roundRect' in ctx,false); assert.equal('createLinearGradient' in ctx,false);
  renderer.setQuality('low'); renderer.resize(320,568,1); renderer.render({status:'paused'},0);
  renderer.resize(2500,3000,1); renderer.render({player:{x:1700,y:100,radius:42}},0);
  assert.deepEqual(counters.badArgs,[]);
  const beforeDispose = counters.calls;
  renderer.dispose(); renderer.render({});
  assert.equal(counters.calls,beforeDispose,'dispose did not disable rendering');
});

test('viewport rejection preserves edge sprites, overhead bars, long forward effects and buffer identity',()=>{
  const {canvas} = mockCanvas();
  const renderer = new GameRenderer(canvas,{width:390,height:844,pixelRatio:2,showHud:false});
  const state = makeState(); state.enemies=[]; state.effects=[]; state.projectiles=[]; state.gems=[];
  renderer.render(state,0);
  const v = renderer._view;
  const recorded = {enemy:[],projectile:[],effect:[],gem:[]};
  renderer._drawEnemy = (_,obj) => recorded.enemy.push(obj.id);
  renderer._drawProjectile = (_,obj) => recorded.projectile.push(obj.id);
  renderer._drawEffect = (_,obj) => recorded.effect.push(obj.id);
  renderer._drawGem = (_,obj) => recorded.gem.push(obj.id);
  state.enemies = [
    {id:'behind',x:900,y:1030,radius:17},
    {id:'above',x:900,y:800,radius:17},
    {id:'far',x:80,y:80,radius:17},
    {id:'edge',x:v.right+8,y:900,radius:17},
    {id:'overhead',x:900,y:v.bottom+70,radius:40,kind:'boss',stun:1}
  ];
  state.projectiles = [{id:'edge',x:v.left-8,y:900,radius:7},{id:'far',x:50,y:50,radius:7}];
  state.effects = [
    {id:'long-lane',x:v.left-320,y:900,kind:'hoe-line',radius:40,length:400,width:40,angle:0,ttl:1,maxTtl:1},
    {id:'edge-ring',x:v.right+25,y:900,kind:'staff-ring',radius:30,ttl:1,maxTtl:1},
    {id:'far',x:50,y:50,kind:'sweep',radius:20,ttl:1,maxTtl:1}
  ];
  state.gems = [{id:'edge',x:v.right+6,y:900,radius:7},{id:'far',x:50,y:50,radius:7}];
  freeze(state);
  const before=JSON.stringify(state), buffer=renderer._enemyDrawList;
  renderer.render(state,0);
  assert.deepEqual(recorded.enemy,['above','edge','behind','overhead']);
  assert.deepEqual(recorded.projectile,['edge']);
  assert.deepEqual(recorded.effect,['long-lane','edge-ring']);
  assert.deepEqual(recorded.gem,['edge']);
  assert.equal(renderer._enemyDrawList,buffer);
  assert.equal(JSON.stringify(state),before);
  renderer.render(state,0);
  assert.equal(renderer._enemyDrawList,buffer,'per-frame sorting buffer was reallocated');
  renderer.dispose();
  assert.equal(buffer.length,0,'disposed renderer retained enemy references');
});

test('showHud:false does not draw texts; malformed nullable collections remain finite',()=>{
  const {canvas,counters}=mockCanvas();
  const renderer=new GameRenderer(canvas,{width:390,height:844,pixelRatio:2,showHud:false});
  renderer.render({enemies:[null],projectiles:[null],effects:[null],gems:[null]},0);
  assert.equal(counters.ops.fillText||0,0);
  assert.deepEqual(counters.badArgs,[]);
  renderer.showHud=true; renderer.render(makeState(),0);
  assert.ok(counters.ops.fillText>0);
});

const stress = freeze(makeStress());
const before = JSON.stringify(stress);
const m=mockCanvas();
const renderer=new GameRenderer(m.canvas,{width:390,height:844,pixelRatio:2,quality:'high',showHud:false});
const t=performance.now();
for(let i=0;i<120;i++)renderer.render(stress,1/60);
const elapsed=performance.now()-t;
assert.equal(JSON.stringify(stress),before);
assert.equal(m.counters.stack,0); assert.deepEqual(m.counters.badArgs,[]);
assert.ok(renderer.stats.enemies<220); assert.ok(renderer.stats.projectiles<300); assert.ok(renderer.stats.effects<160);
assert.ok(m.counters.calls/120<31007*.5,'outside viewport work was not materially reduced');
console.log(JSON.stringify({
  ok:true,tests:results,pressure:{frames:120,viewport:'390x844 DPR2',quality:'high',showHud:false,
  inputs:{enemies:220,projectiles:300,effects:160,gems:240},drawn:{...renderer.stats},
  calls:m.counters.calls,callsPerFrame:m.counters.calls/120,elapsedMs:Number(elapsed.toFixed(3)),
  averageMockMs:Number((elapsed/120).toFixed(3)),note:'Node Canvas mock measures JavaScript and call counts; it is not GPU/WeChat FPS.'}
},null,2));
renderer.dispose();

