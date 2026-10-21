import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { GameEngine } from '../prototype-2d/src/engine.js';
import { planVanguardPlayerDepth } from './tiger-vanguard-player-depth-draft.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),engine=new GameEngine({seed:141017,stageId:1,characterId:'wukong'});
engine.elapsed=engine.state.time=300;engine.advanceSpawns();const s=engine.state,p=s.player,enemy=s.enemies.find(e=>e.encounterIdentity);
s.enemies=[enemy];s.effects=[];s.projectiles=[];p.x=900;p.y=1260;enemy.x=915;enemy.y=1275;
const binding={enemy,id:enemy.id,identity:enemy.encounterIdentity},tests=[],record=(name,run)=>{run();tests.push({name,result:'PASS'});};
record('exact bound scheduled contact only; state/RNG are never written',()=>{
  const before=JSON.stringify(s),rng=engine.rng;assert.equal(planVanguardPlayerDepth(s,p,binding,1,true).defer,true);
  assert.equal(planVanguardPlayerDepth(s,p,binding,1,false).defer,false);assert.equal(JSON.stringify(s),before);assert.equal(engine.rng,rng);
});
record('wrong stage/id/object/frozen identity/player/paused/dead fail closed',()=>{
  const cases=[()=>planVanguardPlayerDepth({...s,stage:{id:2}},p,binding,1,true),()=>planVanguardPlayerDepth(s,{...p},binding,1,true),
    ()=>planVanguardPlayerDepth({...s,status:'paused'},p,binding,1,true),()=>planVanguardPlayerDepth(s,p,{...binding,id:'wrong'},1,true),
    ()=>planVanguardPlayerDepth(s,p,{...binding,identity:Object.freeze({...binding.identity})},1,true),
    ()=>planVanguardPlayerDepth(s,p,{...binding,enemy:{...enemy}},1,true)];for(const test of cases)assert.equal(test().defer,false);
  const hp=enemy.hp;enemy.hp=0;assert.equal(planVanguardPlayerDepth(s,p,binding,1,true).defer,false);enemy.hp=hp;
});
record('multiple targets, effects/projectiles, missing/invalid token are outside scope',()=>{
  for(const state of [{...s,enemies:[enemy,{...enemy}]},{...s,effects:[{kind:'death'}]},{...s,projectiles:[{}]}])assert.equal(planVanguardPlayerDepth(state,p,binding,1,true).defer,false);
  for(const token of [undefined,0,-1,NaN,1.5,Infinity])assert.equal(planVanguardPlayerDepth(s,p,binding,token,true).defer,false);
});
record('nonfinite/out-of-range/distant/front geometry retains normal depth',()=>{
  const x=enemy.x,y=enemy.y,radius=enemy.radius;
  for(const values of [{x:NaN},{radius:73},{radius:0},{x:1100},{y:1259}]){Object.assign(enemy,{x,y,radius},values);assert.equal(planVanguardPlayerDepth(s,p,binding,1,true).defer,false);}
  Object.assign(enemy,{x,y,radius});assert.equal(planVanguardPlayerDepth(s,p,binding,1,true).defer,true);
});
const generatedAt=new Date().toISOString(),dir=path.join(root,'evidence/current/tiger-vanguard/player-depth-draft',generatedAt.replaceAll(':','-').replaceAll('.','-'));
fs.mkdirSync(dir,{recursive:true});const file='scripts/tiger-vanguard-player-depth-draft.mjs',report={generatedAt,result:'PASS_EVIDENCE_ONLY_SINGLE_CONTACT_DEPTH_GUARD',
  scope:'Node scheduling guard only; no actual reordered drawing, pixels, natural gameplay, artistic readability, motion, FPS or public acceptance.',
  helper:{file,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')},tests,
  contactPredicate:'world circle radii, target.y>=player.y; not alpha or semantic silhouette',
  singleTargetOnly:true,emptyEffectsProjectilesOnly:true,playerReadabilityApproved:false,enemyReadabilityApproved:false,
  rootApproved:false,runtimeApproved:false,highFrameApproved:false,publicPass:false,releaseReady:false};
engine.dispose();fs.writeFileSync(path.join(dir,'node.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({file:path.relative(root,path.join(dir,'node.json')).replaceAll('\\','/'),result:report.result,tests},null,2));
