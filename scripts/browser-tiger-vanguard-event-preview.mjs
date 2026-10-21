import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nodeFile = process.argv[2];
if (!/^evidence\/current\/tiger-vanguard\/event-preview\/[\w-]+\/node\.json$/.test(nodeFile || '')) throw new Error('Explicit local node evidence required');
const output = path.dirname(path.join(root, nodeFile));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = file => path.relative(root, file).replaceAll('\\', '/');
const read = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const previousFile = 'evidence/current/tiger-vanguard/composite-playback/2026-10-14T01-07-09-754Z/browser.json';
const previous = read(previousFile), node = read(nodeFile);
const candidateFile = 'evidence/current/tiger-vanguard/full-candidate/2026-10-13T11-20-21-840Z/candidate-table.json';
const motionFile = 'evidence/current/tiger-vanguard/motion-draft/2026-10-13T12-00-07-310Z/motion-draft.json';
const candidate = read(candidateFile), motion = read(motionFile);
const expected = { ...previous.protectedAfter,
  [previousFile]: '7493993cdc79670f22bfc2873f42b89edfb98b1ad0770d0afa3c066b4d7d2d02',
  'scripts/browser-tiger-vanguard-composite-playback.mjs': previous.scriptSha256,
  ...Object.fromEntries(['scripts/tiger-vanguard-motion-draft.mjs', 'scripts/tiger-vanguard-event-preview.mjs',
    'scripts/tiger-vanguard-event-preview-smoke.mjs', nodeFile].map(f => [f, hash(fs.readFileSync(path.join(root, f)))])) };
const fingerprint = () => Object.fromEntries(Object.keys(expected).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const report = { generatedAt: new Date().toISOString(), result: 'FAIL',
  scope: 'Local real pointer UI followed by explicitly accelerated 300s, repositioned, direct-damage and engine-subsystem fixed-step fixtures. Candidate replacement hooks exist only in page memory, not production integration or natural combat/FPS/public acceptance.',
  url: 'http://127.0.0.1:8088/', nodeEvidence: { file: nodeFile, sha256: expected[nodeFile] },
  candidate: { file: candidateFile, sha256: expected[candidateFile] }, motionDraft: { file: motionFile, sha256: expected[motionFile] },
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))), protectedBefore: fingerprint(),
  runtimeReferences: [], pageErrors: [], consoleErrors: [], failedRequests: [], httpErrors: [], externalRequests: [], screenshots: [],
  attackEventSupported: false, attackPreviewed: false, humanMotionReviewed: false, rootApproved: false,
  healthBarLayoutApproved: false, runtimeApproved: false, highFrameApproved: false, fpsAcceptance: false, publicPass: false, releaseReady: false };
const bounded = async (promise, name, ms = 15000) => {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${name} timeout`)), ms); })]); }
  finally { clearTimeout(timer); }
};
let browser, context, server;
try {
  assert.deepEqual(report.protectedBefore, expected); assert.equal(node.result, 'PASS_EVIDENCE_ONLY_EVENT_CLOCK');
  const runtimeFiles = ['prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', 'scripts/serve.mjs', 'scripts/release.mjs',
    ...fs.readdirSync(path.join(root, 'prototype-2d/src')).filter(f=>f.endsWith('.js')).map(f=>`prototype-2d/src/${f}`)];
  const names = [candidateFile, motionFile, 'tiger-vanguard-event-preview.mjs', ...candidate.pages.map(p=>p.file)];
  for (const file of runtimeFiles) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    for (const name of names) if (text.includes(name) || text.includes(path.basename(name))) report.runtimeReferences.push({ file, name });
  }
  assert.equal(report.runtimeReferences.length, 0);
  const pages = candidate.pages.map(p => {
    const bytes = fs.readFileSync(path.join(root,p.file)); assert.equal(hash(bytes),p.sha256);
    return { ...p, src:`data:image/png;base64,${bytes.toString('base64')}` };
  });
  const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  const clockUrl = moduleUrl(fs.readFileSync(path.join(root,'scripts/tiger-vanguard-motion-draft.mjs'),'utf8'));
  const observerUrl = moduleUrl(fs.readFileSync(path.join(root,'scripts/tiger-vanguard-event-preview.mjs'),'utf8')
    .replace("'./tiger-vanguard-motion-draft.mjs'", JSON.stringify(clockUrl)));
  server = spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:'8088'},windowsHide:true,stdio:['ignore','pipe','pipe']});
  report.serverStarted = true; report.serverOutput = '';
  await bounded(new Promise((resolve,reject)=>{
    server.once('error',reject); server.once('exit',code=>reject(new Error(`Local server exited ${code}`)));
    server.stdout.on('data',b=>{report.serverOutput+=b; if(report.serverOutput.includes('127.0.0.1:8088'))resolve();});
    server.stderr.on('data',b=>{report.serverOutput+=b;});
  }),'local server startup');
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  context = await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
  const page = await context.newPage(); page.setDefaultTimeout(15000);
  page.on('pageerror',e=>report.pageErrors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
  page.on('requestfailed',r=>report.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)report.httpErrors.push({url:r.url(),status:r.status()});});
  page.on('request',r=>{if(/^https?:/.test(r.url())&&new URL(r.url()).origin!=='http://127.0.0.1:8088')report.externalRequests.push(r.url());});
  await page.route('https://**/*',r=>r.abort());
  await page.goto(report.url,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.xiyou?.enemyImages?.snake?.__snakeBattleSprite===true);
  await page.mouse.click(195,485);
  await page.waitForFunction(()=>window.xiyou?.screen==='select'&&!window.xiyou.getUIMotionState().active);
  await page.mouse.click(195,615);
  await page.waitForFunction(()=>window.xiyou?.engine?.state?.status==='playing'&&window.xiyou.engine.state.time>=1);
  report.uiEntry=await page.evaluate(()=>{
    const g=window.xiyou;g.cancel(g.frame);g.frame=0;g.running=false;g.renderDt=0;g.draw();
    return {screen:g.screen,status:g.engine.state.status,time:g.engine.state.time,debug:g.platform.debug,canvasCount:document.querySelectorAll('canvas').length};
  });
  const entryFile=path.join(output,'real-ui-before-fixture.png'),entry=await page.screenshot({path:entryFile});
  report.screenshots.push({file:rel(entryFile),bytes:entry.length,sha256:hash(entry),kind:'real-ui-before-explicit-fixtures'});
  for(const file of ['prototype-2d/src/engine.js','prototype-2d/src/renderer.js','prototype-2d/native-app.js']){
    const response=await page.request.get(new URL(file.replace('prototype-2d/',''),report.url).href);
    assert.equal(response.status(),200);assert.equal(hash(await response.body()),expected[file]);
  }
  const fixture=await bounded(page.evaluate(async({observerUrl,pages,candidate,motion})=>{
    const {createVanguardEventPreview}=await import(observerUrl);
    const g=window.xiyou,e=g.engine,s=e.state,r=g.renderer,preview=createVanguardEventPreview(motion),images={};
    for(const p of pages){const im=new Image();im.src=p.src;await im.decode();if(im.naturalWidth!==p.width||im.naturalHeight!==p.height)throw Error('Source size mismatch');images[p.id]=im;}
    const originalEvent=e.onEvent, originalEnemy=r._drawEnemy, originalEffect=r._drawEffect, originalRng=e.rng;
    const events=[],draws=[],errors=[],snapshots=[],rngValues=[];let calls=0,renderChecks=0,consumerChecks=0;
    e.rng=()=>{calls++;const value=originalRng();rngValues.push(value);return value;};
    e.onEvent=event=>{
      const before=JSON.stringify(s),beforeCalls=calls;
      try{const accepted=preview.consume(event,s);events.push({type:event.type,target:event.target||null,enemyId:event.enemy?.id||null,accepted,at:s.time,amount:event.amount||0,sourceId:event.sourceId||null});
        if(before!==JSON.stringify(s)||beforeCalls!==calls)throw Error('Preview consumer changed state or RNG');consumerChecks++;
      }catch(error){errors.push(String(error));}finally{originalEvent(event);}
    };
    const drawPose=(ctx,pose,kind)=>{
      const f=candidate.frames[pose.index],m=motion.frames[pose.index],scale=pose.radius*3.2/f.standingReferenceHeight;
      const ground=pose.y+pose.radius*.7;
      ctx.save();ctx.translate(pose.x,ground);ctx.scale(pose.facing,1);
      ctx.drawImage(images[f.page],f.sourceRect.x,f.sourceRect.y,f.sourceRect.w,f.sourceRect.h,-m.pivot.x*scale,-m.pivot.y*scale,f.sourceRect.w*scale,f.sourceRect.h*scale);ctx.restore();
      const zoom=r._zoom(s.player);
      draws.push({...pose,kind,at:s.time,ground,scale,camera:{...r.camera},zoom,pixelRatio:r.pixelRatio,
        screenX:r.width/2+(pose.x-r.camera.x)*zoom,screenGroundY:r.height/2+(ground-r.camera.y)*zoom,
        healthBarY:kind==='elite'?r._enemyHealthBarY({y:pose.y,kind:'elite'},pose.radius):null});
    };
    r._drawEnemy=function(ctx,enemy,...args){const pose=preview.sampleEnemy(enemy,s);if(!pose)return originalEnemy.call(this,ctx,enemy,...args);
      drawPose(ctx,pose,'elite');this._drawHealthBar(ctx,enemy.x,this._enemyHealthBarY(enemy,enemy.radius),enemy.radius*2.3,enemy.hp/enemy.maxHp,'#e66b35');};
    r._drawEffect=function(ctx,effect){const pose=preview.sampleEffect(effect,s);if(!pose)return originalEffect.call(this,ctx,effect);drawPose(ctx,pose,'death');};
    const draw=()=>{const before=JSON.stringify(s),beforeCalls=calls;g.renderDt=0;g.draw();preview.reconcile(s);
      if(before!==JSON.stringify(s)||beforeCalls!==calls)throw Error('Preview render changed state or RNG');renderChecks++;
      const c=g.ctx;c.save();c.setTransform(1,0,0,1,0,0);c.fillStyle='#2a1729';c.fillRect(0,0,390,24);c.fillStyle='#ffe6b5';c.font='bold 9px sans-serif';c.fillText('EVIDENCE ONLY / ACCELERATED + DIRECT DAMAGE / NOT RUNTIME',5,15);c.restore();};
    const shot=name=>snapshots.push({name,at:s.time,lastDraw:draws.at(-1)||null,pngBase64:g.canvas.toDataURL('image/png').split(',')[1]});
    const step=dt=>{e.elapsed+=dt;s.time=e.elapsed;e.updateEffects(dt);e.updateEnemies(dt);draw();};
    try{
      for(const key of ['enemies','effects','projectiles','gems','damageNumbers'])s[key].length=0;
      e.elapsed=s.time=299.95;e.update(.05);
      const leader=s.enemies.find(enemy=>enemy.encounterIdentity?.encounterId==='tiger-vanguard');if(!leader)throw Error('No scheduled Vanguard');
      const ordinary=e.spawnEnemy('normal',0,{variant:'tiger'}),homonym=e.spawnEnemy('elite',0,e.stage.eliteEncounters[0]);
      s.enemies=[leader,ordinary,homonym];s.effects.length=0;s.projectiles.length=0;s.gems.length=0;s.damageNumbers.length=0;
      s.player.x=900;s.player.y=1260;leader.x=1010;leader.y=1320;ordinary.x=790;ordinary.y=1340;homonym.x=1000;homonym.y=1150;
      const identity={...leader.encounterIdentity},health={hp:leader.hp,maxHp:leader.maxHp,radius:leader.radius};
      draw();shot('world-start-move');for(let i=0;i<16;i++)step(.025);shot('world-follow-move');
      // Keep only the scheduled leader during the explicit contact/damage fixture.
      s.enemies=[leader];leader.x=s.player.x+15;leader.y=s.player.y+15;s.player.invulnerable=0;step(.025);shot('contact-no-invented-attack');
      e.damageEnemy(leader,1,{});draw();shot('real-hit-start');for(let i=0;i<6;i++)step(.025);shot('hit-visual-after-actual-timer');
      for(let i=0;i<5;i++)step(.025);shot('hit-finished-move');e.damageEnemy(leader,leader.hp+1,{});draw();shot('real-kill-death-start');
      const death=s.effects.find(effect=>effect.kind==='death'&&effect.encounterIdentity===leader.encounterIdentity),deathTtlAtCreation=death.maxTtl;
      for(let i=0;i<14;i++)step(.025);shot('death-frame31-before-original-expiry');for(let i=0;i<3;i++)step(.025);shot('original-death-expired');
      const expired=!s.effects.includes(death)&&preview.retainedRecords===0;
      return {identity,health,deathTtlAtCreation,expired,events,draws,snapshots,errors,renderChecks,consumerChecks,rngCalls:calls,rngValues,
        attackEventSupported:false,attackPreviewed:draws.some(d=>d.state==='attack'),
        controlsUnbound:ordinary.encounterIdentity===null&&homonym.encounterIdentity===null,
        worldPositionChanged:new Set(draws.filter(d=>d.state==='move').map(d=>`${d.x},${d.y}`)).size>1,
        actualAndVisualHitDiffer:draws.some(d=>d.state==='hit'&&d.actualHitTimer===0&&d.visualHitRemainingMs>0),
        sourceIndicesByState:Object.fromEntries(['move','hit','death'].map(state=>[state,[...new Set(draws.filter(d=>d.state===state).map(d=>d.index))].sort((a,b)=>a-b)])),
        canvasCount:document.querySelectorAll('canvas').length,rendererMode:r.battleSceneMode,artMode:r.battleArtMode,
        liveMemoryHookOnly:true,partialEngineStepFixture:true,naturalFiveMinuteSurvival:false,healthBarUsesActualHp:true,healthBarLayoutApproved:false};
    }finally{e.onEvent=originalEvent;e.rng=originalRng;r._drawEnemy=originalEnemy;r._drawEffect=originalEffect;g.draw();}
  },{observerUrl,pages,candidate,motion}),'identity event world-follow fixture',20000);
  for(const shot of fixture.snapshots){const bytes=Buffer.from(shot.pngBase64,'base64');delete shot.pngBase64;const file=path.join(output,`${shot.name}.png`);fs.writeFileSync(file,bytes);shot.snapshot={file:rel(file),bytes:bytes.length,sha256:hash(bytes),kind:'real-ui-current-renderer-with-in-memory-candidate-replacement-explicit-fixture'};report.screenshots.push(shot.snapshot);}
  report.fixture=fixture;
  assert.deepEqual(fixture.errors,[]);assert.equal(fixture.expired,true);assert.equal(fixture.deathTtlAtCreation,.42);assert.equal(fixture.attackPreviewed,false);
  assert.equal(fixture.controlsUnbound,true);assert.equal(fixture.worldPositionChanged,true);assert.equal(fixture.actualAndVisualHitDiffer,true);
  assert.deepEqual(fixture.sourceIndicesByState.hit,[24,25,26,27]);assert.deepEqual(fixture.sourceIndicesByState.death,[28,29,30,31]);
  report.hooksRestored=await page.evaluate(()=>{const g=window.xiyou;g.dispose();return g.disposed;});
  report.checks={realPointerUiBeforeFixtures:report.uiEntry.screen==='game'&&report.uiEntry.status==='playing'&&!report.uiEntry.debug,
    servedSourceHashesMatch:true,identityWorldFollowMoveHitDeath:true,noStateOrRngWritesByObserver:true,originalDeathExpiry:true,
    controlsExcluded:true,noInventedAttack:true,noProductionReferences:true,
    noErrorsOrExternalNetwork:!report.pageErrors.length&&!report.consoleErrors.length&&!report.failedRequests.length&&!report.httpErrors.length&&!report.externalRequests.length};
  report.result=Object.values(report.checks).every(Boolean)?'REVIEW_IDENTITY_EVENT_WORLD_FOLLOW_PREVIEW':'FAIL';
}catch(error){report.error=String(error.stack||error);}
finally{
  if(context)try{await bounded(context.close(),'context close');report.contextClosed=true;}catch(e){report.cleanupError=String(e);report.result='FAIL';}
  if(browser)try{await bounded(browser.close(),'browser close');report.browserClosed=true;}catch(e){report.cleanupError=String(e);report.result='FAIL';}
  if(server)try{const stopped=new Promise(resolve=>server.once('close',resolve));server.kill();await bounded(stopped,'server close');report.serverClosed=true;}catch(e){report.cleanupError=String(e);report.result='FAIL';}
  report.protectedAfter=fingerprint();report.protectedUnchanged=JSON.stringify(report.protectedBefore)===JSON.stringify(report.protectedAfter);
  if(!report.protectedUnchanged)report.result='FAIL';report.finishedAt=new Date().toISOString();fs.writeFileSync(path.join(output,'browser.json'),JSON.stringify(report,null,2));
}
console.log(JSON.stringify({file:rel(path.join(output,'browser.json')),result:report.result,checks:report.checks,
  sourceIndices:report.fixture?.sourceIndicesByState,screenshots:report.screenshots.length,protectedUnchanged:report.protectedUnchanged,
  browserClosed:report.browserClosed,serverClosed:report.serverClosed,error:report.error},null,2));
if(report.result==='FAIL')process.exitCode=1;
