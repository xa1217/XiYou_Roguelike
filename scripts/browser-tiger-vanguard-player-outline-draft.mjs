import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), nodeFile = process.argv[2];
if (!/^evidence\/current\/tiger-vanguard\/player-outline-draft\/[\w-]+\/node\.json$/.test(nodeFile || '')) throw Error('Explicit outline node evidence required');
const output = path.dirname(path.join(root, nodeFile)), hash = b => crypto.createHash('sha256').update(b).digest('hex');
const rel = f => path.relative(root, f).replaceAll('\\', '/'), read = f => JSON.parse(fs.readFileSync(path.join(root, f)));
const previousFile = 'evidence/current/tiger-vanguard/feedback-draft/2026-10-14T02-18-07-729Z/browser.json';
const previous = read(previousFile), node = read(nodeFile), candidateFile = previous.candidate.file;
const candidate = read(candidateFile), motion = read(previous.motionDraft.file), layout = read(previous.layout.file);
const priorDirectory = path.posix.dirname(previousFile);
const extra = ['scripts/browser-tiger-vanguard-feedback-draft.mjs', 'scripts/tiger-vanguard-player-outline-draft.mjs',
  'scripts/tiger-vanguard-player-outline-smoke.mjs', nodeFile,
  ...['review.md', 'handoff.json', 'closeout.json'].map(f => `${priorDirectory}/${f}`)];
const expected = { ...previous.protectedAfter, [previousFile]: '2110863dcb29a25387d90d7e6afe65c9ec9947a2269f77c9441508b97b3f0311',
  ...Object.fromEntries(previous.screenshots.map(s => [s.file, s.sha256])),
  ...Object.fromEntries(extra.map(f => [f, hash(fs.readFileSync(path.join(root, f)))])) };
const fingerprint = () => Object.fromEntries(Object.keys(expected).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const report = { generatedAt: new Date().toISOString(), result: 'FAIL',
  scope: 'Evidence-only single hit26 contact fixture after real pointer UI. Replay only already successful current-frame sprite draw commands into bounded masks; overlay a two-screen-pixel inner player ring at actual later candidate alpha overlap. No second actor rendering, source/position/scale or number/bar changes. Not production/natural full gameplay, artistic readability/motion, FPS or public acceptance.',
  url: 'http://127.0.0.1:8088/', priorEvidence: { file: previousFile, sha256: expected[previousFile] },
  candidate: previous.candidate, motionDraft: previous.motionDraft, nodeEvidence: { file: nodeFile, sha256: expected[nodeFile] },
  layout: previous.layout, scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))), protectedBefore: fingerprint(),
  screenshots: [], pageErrors: [], consoleErrors: [], failedRequests: [], httpErrors: [], externalRequests: [], runtimeReferences: [],
  humanMotionReviewed: false, rootApproved: false, healthBarLayoutApproved: false, playerReadabilityApproved: false,
  viewportEdgeApproved: false, statusBadgeGeometryUpdated: false, deathFeedbackObstaclesIntegrated: false,
  extremeMissingBarAt512Approved: false, attackEventSupported: false, attackPreviewed: false, runtimeApproved: false,
  highFrameApproved: false, fpsAcceptance: false, publicPass: false, releaseReady: false };
const bounded = async (promise, name, ms = 15000) => { let timer; try {
  return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Error(`${name} timeout`)), ms); })]);
} finally { clearTimeout(timer); } };
let server, browser, context;
try {
  assert.deepEqual(report.protectedBefore, expected); assert.equal(node.result, 'PASS_EVIDENCE_ONLY_OCCLUDED_PLAYER_OUTLINE_MASK');
  assert.equal(expected[previous.layout.file], previous.layout.sha256); assert.equal(expected[node.helper.file], node.helper.sha256);
  for (const f of ['prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', 'scripts/serve.mjs', 'scripts/release.mjs',
    ...fs.readdirSync(path.join(root, 'prototype-2d/src')).filter(f => f.endsWith('.js')).map(f => `prototype-2d/src/${f}`)]) {
    const source = fs.readFileSync(path.join(root, f), 'utf8');
    for (const name of ['tiger-vanguard-player-outline-draft', candidateFile, previous.motionDraft.file, ...candidate.pages.map(p => p.file)])
      if (source.includes(name) || source.includes(path.basename(name))) report.runtimeReferences.push({ file: f, name });
  }
  assert.equal(report.runtimeReferences.length, 0);
  const pages = candidate.pages.map(p => { const bytes = fs.readFileSync(path.join(root, p.file)); assert.equal(hash(bytes), p.sha256);
    return { ...p, src: `data:image/png;base64,${bytes.toString('base64')}` }; });
  const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  const clockUrl = moduleUrl(fs.readFileSync(path.join(root, 'scripts/tiger-vanguard-motion-draft.mjs'), 'utf8'));
  const observerUrl = moduleUrl(fs.readFileSync(path.join(root, 'scripts/tiger-vanguard-event-preview.mjs'), 'utf8')
    .replace("'./tiger-vanguard-motion-draft.mjs'", JSON.stringify(clockUrl)));
  const layoutUrl = moduleUrl(fs.readFileSync(path.join(root, 'scripts/tiger-vanguard-layout-draft.mjs'), 'utf8'));
  const feedbackUrl = moduleUrl(fs.readFileSync(path.join(root, 'scripts/tiger-vanguard-feedback-draft.mjs'), 'utf8')
    .replace("'./tiger-vanguard-event-preview.mjs'", JSON.stringify(observerUrl)));
  const outlineUrl = moduleUrl(fs.readFileSync(path.join(root, 'scripts/tiger-vanguard-player-outline-draft.mjs'), 'utf8'));
  server = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: root, env: { ...process.env, PORT: '8088' }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  report.serverOutput = '';
  await bounded(new Promise((resolve, reject) => { server.once('error', reject); server.once('exit', c => reject(Error(`Server exited ${c}`)));
    server.stdout.on('data', b => { report.serverOutput += b; if (report.serverOutput.includes('127.0.0.1:8088')) resolve(); });
    server.stderr.on('data', b => { report.serverOutput += b; }); }), 'server startup');
  const pw = await loadPlaywright(); browser = await pw.chromium.launch(browserLaunchOptions()); report.browser = browser.version();
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage(); page.setDefaultTimeout(15000);
  page.on('pageerror', e => report.pageErrors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
  page.on('requestfailed', r => report.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
  page.on('response', r => { if (r.status() >= 400) report.httpErrors.push({ url: r.url(), status: r.status() }); });
  page.on('request', r => { if (/^https?:/.test(r.url()) && new URL(r.url()).origin !== 'http://127.0.0.1:8088') report.externalRequests.push(r.url()); });
  await page.route('https://**/*', r => r.abort());
  await page.goto(report.url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.xiyou?.enemyImages?.snake?.__snakeBattleSprite === true);
  await page.mouse.click(195, 485);
  await page.waitForFunction(() => window.xiyou?.screen === 'select' && !window.xiyou.getUIMotionState().active);
  await page.mouse.click(195, 615);
  await page.waitForFunction(() => window.xiyou?.engine?.state?.status === 'playing' && window.xiyou.engine.state.time >= 1);
  report.uiEntry = await page.evaluate(() => { const g = window.xiyou; g.cancel(g.frame); g.frame = 0; g.running = false; g.renderDt = 0; g.draw();
    return { screen: g.screen, status: g.engine.state.status, debug: g.platform.debug, time: g.engine.state.time }; });
  const entryFile = path.join(output, 'real-ui-before-fixture.png'), entry = await page.screenshot({ path: entryFile });
  report.screenshots.push({ file: rel(entryFile), bytes: entry.length, sha256: hash(entry), kind: 'real-ui-before-explicit-fixture' });
  for (const f of ['prototype-2d/src/engine.js', 'prototype-2d/src/renderer.js', 'prototype-2d/native-app.js']) {
    const response = await page.request.get(new URL(f.replace('prototype-2d/', ''), report.url).href);
    assert.equal(response.status(), 200); assert.equal(hash(await response.body()), expected[f]);
  }
  const fixture = await bounded(page.evaluate(async ({ observerUrl, layoutUrl, feedbackUrl, outlineUrl, pages, candidate, motion, layout }) => {
    const { createVanguardEventPreview } = await import(observerUrl);
    const { projectVanguardLayout } = await import(layoutUrl);
    const { synchronizeVanguardFeedbackRects } = await import(feedbackUrl);
    const { buildOccludedPlayerOutline } = await import(outlineUrl);
    const g = window.xiyou, e = g.engine, s = e.state, r = g.renderer, preview = createVanguardEventPreview(motion), images = {};
    if (g.canvas.width !== 390 || g.canvas.height !== 844 || r.pixelRatio !== 1) throw Error('Single DPR1 viewport fixture required');
    for (const p of pages) { const im = new Image(); im.src = p.src; await im.decode();
      if (im.naturalWidth !== p.width || im.naturalHeight !== p.height) throw Error('Source dimensions differ'); images[p.id] = im; }
    const masks = {};
    for (const name of ['player','candidate','outline']) { const canvas = document.createElement('canvas'); canvas.width=390;canvas.height=844;
      masks[name] = { canvas, ctx:canvas.getContext('2d',{willReadFrequently:true}) }; }
    const saved = { event:e.onEvent, rng:e.rng, enemy:r._drawEnemy, player:r._drawPlayer, obstacles:r._enemyDamageOcclusionRects,
      feedback:r._drawCombatFeedback, drawImage:g.ctx.drawImage, fillText:g.ctx.fillText, strokeText:g.ctx.strokeText };
    const events=[],errors=[],draws=[],snapshots=[],renders=[]; let calls=0,renderToken=0,renderChecks=0,consumerChecks=0,binding,
      geometryCache=new WeakMap(),captureEnabled=false,hintEnabled=false,inPlayer=false,captureCandidate=false,inFeedback=false,
      captures,paints,outline,playerCalls,sequence,outlineCompositeCalls=0;
    e.rng=()=>{calls++;return saved.rng();};
    e.onEvent=event=>{const state=JSON.stringify(s),rng=calls;try{const accepted=preview.consume(event,s);
      events.push({type:event.type,target:event.target||null,accepted,sourceId:event.sourceId||null,at:s.time});
      if(JSON.stringify(s)!==state||calls!==rng)throw Error('Consumer writes state/RNG');consumerChecks++;
    }catch(error){errors.push(String(error));}finally{saved.event(event);}};
    const screenBox=box=>{const z=r._zoom(s.player);return{left:195+(box.left-r.camera.x)*z,right:195+(box.right-r.camera.x)*z,
      top:422+(box.top-r.camera.y)*z,bottom:422+(box.bottom-r.camera.y)*z};};
    const matrix=ctx=>{const t=ctx.getTransform();return{a:t.a,b:t.b,c:t.c,d:t.d,e:t.e,f:t.f};};
    g.ctx.drawImage=function(image,...args){
      const kind=inPlayer&&image===r.heroImages?.[s.character.id]?'player':captureCandidate?'candidate':null;
      const record=kind&&captureEnabled?{renderToken,kind,args:args.slice(),transform:matrix(this),alpha:this.globalAlpha,
        smoothing:this.imageSmoothingEnabled,quality:this.imageSmoothingQuality,composite:this.globalCompositeOperation,
        width:image.naturalWidth,height:image.naturalHeight,source:kind==='player'?image.src.split('/').at(-1):'locked-candidate-page'}:null;
      const returned=saved.drawImage.call(this,image,...args);
      if(record){record.sequence=++sequence;captures[kind].push(record);const c=masks[kind].ctx,t=record.transform;
        c.save();c.setTransform(t.a,t.b,t.c,t.d,t.e,t.f);c.globalAlpha=record.alpha;c.globalCompositeOperation=record.composite;
        c.imageSmoothingEnabled=record.smoothing;c.imageSmoothingQuality=record.quality;c.drawImage(image,...args);c.restore();}
      return returned;
    };
    r._drawPlayer=function(ctx,...args){playerCalls++;inPlayer=true;try{return saved.player.call(this,ctx,...args);}finally{inPlayer=false;}};
    r._drawEnemy=function(ctx,enemy,...args){
      const pose=preview.sampleEnemy(enemy,s);if(!pose)return saved.enemy.call(this,ctx,enemy,...args);
      const f=candidate.frames[pose.index],m=motion.frames[pose.index],geometry=projectVanguardLayout(layout,pose),scale=pose.radius*3.2/f.standingReferenceHeight;
      ctx.save();ctx.translate(pose.x,geometry.ground);ctx.scale(pose.facing,1);
      captureCandidate=enemy===binding?.enemy;
      try{ctx.drawImage(images[f.page],f.sourceRect.x,f.sourceRect.y,f.sourceRect.w,f.sourceRect.h,
        -m.pivot.x*scale,-m.pivot.y*scale,f.sourceRect.w*scale,f.sourceRect.h*scale);}finally{captureCandidate=false;ctx.restore();}
      const bar={left:geometry.bar.left,right:geometry.bar.right,top:geometry.bar.y,bottom:geometry.bar.bottom};
      r._drawHealthBar(ctx,pose.x,bar.top,pose.radius*2.3,pose.hp/pose.maxHp,'#e66b35');
      if(enemy===binding?.enemy)geometryCache.set(enemy,{renderToken,body:geometry.draw,bar});
      draws.push({renderToken,pose,geometry,bar,screenBar:screenBox(bar),camera:{...r.camera},zoom:r._zoom(s.player)});
    };
    r._enemyDamageOcclusionRects=function(enemies){
      const rects=saved.obstacles.call(this,enemies),result=synchronizeVanguardFeedbackRects(rects,enemies,
        {state:s,binding,renderToken,geometryFor:enemy=>geometryCache.get(enemy)});
      if(result.errors.length)errors.push(...result.errors);return rects;
    };
    for(const name of ['fillText','strokeText'])g.ctx[name]=function(...args){if(inFeedback)paints.push({name,args,font:this.font,
      fill:this.fillStyle,stroke:this.strokeStyle,lineWidth:this.lineWidth,align:this.textAlign,baseline:this.textBaseline,
      alpha:this.globalAlpha,transform:matrix(this)});return saved[name].apply(this,args);};
    r._drawCombatFeedback=function(ctx,state,enemies,options){
      if(captureEnabled){
        if(captures.player.length!==1||captures.candidate.length!==1||playerCalls!==1)errors.push('Exactly one actual player/candidate source draw required');
        const p=captures.player[0],c=captures.candidate[0];
        if(p&&c){const playerRGBA=masks.player.ctx.getImageData(0,0,390,844).data,occluderRGBA=masks.candidate.ctx.getImageData(0,0,390,844).data;
          outline=buildOccludedPlayerOutline({width:390,height:844,playerRGBA,occluderRGBA,renderToken,playerToken:p.renderToken,
            occluderToken:c.renderToken,occluderDrawnAfterPlayer:c.sequence>p.sequence});
          errors.push(...outline.errors);
          const bar=screenBox(geometryCache.get(binding.enemy).bar);let hintBarOverlap=0;
          for(let y=Math.max(0,Math.floor(bar.top)-1);y<Math.min(844,Math.ceil(bar.bottom)+1);y++)
            for(let x=Math.max(0,Math.floor(bar.left)-1);x<Math.min(390,Math.ceil(bar.right)+1);x++)if(outline.rgba[(y*390+x)*4+3])hintBarOverlap++;
          outline.hintBarOverlap=hintBarOverlap;if(hintBarOverlap)errors.push('Hint intersects actual candidate health bar');
          masks.outline.ctx.putImageData(new ImageData(outline.rgba,390,844),0,0);
          if(hintEnabled&&outline.applied&&!hintBarOverlap){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
            saved.drawImage.call(ctx,masks.outline.canvas,0,0);outlineCompositeCalls++;ctx.restore();}
        }
      }
      paints=[];inFeedback=true;try{saved.feedback.call(this,ctx,state,enemies,options);}finally{inFeedback=false;}
    };
    const draw=()=>{const state=JSON.stringify(s),rng=calls;renderToken++;geometryCache=new WeakMap();captures={player:[],candidate:[]};
      outline=null;paints=[];playerCalls=0;sequence=0;for(const m of Object.values(masks)){m.ctx.setTransform(1,0,0,1,0,0);m.ctx.clearRect(0,0,390,844);}
      g.renderDt=0;g.draw();preview.reconcile(s);if(JSON.stringify(s)!==state||calls!==rng)throw Error('Draw writes state/RNG');renderChecks++;
      const frame={renderToken,draw:draws.at(-1),captures,paints,playerCalls,outline:outline?{...outline,rgba:undefined}:null,
        numbers:structuredClone(s.damageNumbers),labelRects:structuredClone(r._damageLabelRects),statusRects:structuredClone(r._statusBadgeRects),
        stateUnchanged:true,rngUnchanged:true};renders.push(frame);
      const ctx=g.ctx;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#2a1729';ctx.fillRect(0,0,390,24);
      ctx.fillStyle='#ffe6b5';ctx.font='bold 9px sans-serif';ctx.fillText('EVIDENCE ONLY / PLAYER INNER OUTLINE / CONTACT FIXTURE',5,15);ctx.restore();return frame;};
    const shot=(name,canvas=g.canvas)=>snapshots.push({name,pngBase64:canvas.toDataURL('image/png').split(',')[1]});
    const step=dt=>{e.elapsed+=dt;s.time=e.elapsed;e.updateEffects(dt);e.updateEnemies(dt);};
    try{
      for(const key of ['enemies','effects','projectiles','gems','damageNumbers'])s[key].length=0;e.elapsed=s.time=299.95;e.update(.05);
      const leader=s.enemies.find(enemy=>enemy.encounterIdentity?.encounterId==='tiger-vanguard');if(!leader)throw Error('No scheduled Vanguard');
      binding={enemy:leader,id:leader.id,identity:leader.encounterIdentity};s.enemies=[leader];s.effects.length=0;s.projectiles.length=0;s.gems.length=0;s.damageNumbers.length=0;
      s.player.x=900;s.player.y=1260;leader.x=1010;leader.y=1320;draw();
      for(let i=0;i<16;i++){step(.025);draw();}
      leader.x=s.player.x+15;leader.y=s.player.y+15;s.player.invulnerable=0;step(.025);draw();e.damageEnemy(leader,1,{});draw();
      for(let i=0;i<6;i++){step(.025);draw();}
      const stateBefore=JSON.stringify(s),rngBefore=calls;captureEnabled=true;hintEnabled=false;const before=draw();shot('hit26-without-player-hint');
      const beforePixels=g.ctx.getImageData(0,0,390,844).data;hintEnabled=true;const after=draw();shot('hit26-with-player-hint');
      const afterPixels=g.ctx.getImageData(0,0,390,844).data,hintRGBA=outline.rgba;
      shot('player-current-source-draw',masks.player.canvas);shot('candidate-current-source-draw',masks.candidate.canvas);shot('occluded-player-inner-outline-mask',masks.outline.canvas);
      if(JSON.stringify(s)!==stateBefore||calls!==rngBefore)throw Error('Pair writes state/RNG');
      const invariant=frame=>({draw:{...frame.draw,renderToken:undefined},captures:Object.fromEntries(Object.entries(frame.captures).map(([k,v])=>[k,v.map(c=>({...c,renderToken:undefined}))])),
        paints:frame.paints,numbers:frame.numbers,labelRects:frame.labelRects,statusRects:frame.statusRects,playerCalls:frame.playerCalls});
      if(JSON.stringify(invariant(before))!==JSON.stringify(invariant(after)))throw Error('Pair original drawing or feedback changed');
      let changedPixels=0,outsideHintMask=0;for(let i=0;i<beforePixels.length;i+=4)if([0,1,2,3].some(k=>beforePixels[i+k]!==afterPixels[i+k])){
        changedPixels++;if(!hintRGBA[i+3])outsideHintMask++;}
      if(!changedPixels||outsideHintMask||!after.outline.applied)throw Error('Hint pixel change missing or outside exact mask');
      return{before,after,snapshots,events,errors,renderChecks,consumerChecks,rngCalls:calls,changedPixels,outsideHintMask,outlineCompositeCalls,
        sameStateRngSourceDrawsBarNumberFieldsFinalPaint:true,originalPlayerCallsPerPair:[before.playerCalls,after.playerCalls],
        currentMaskCanvases:3,maskPixels:390*844,naturalFiveMinuteSurvival:false,partialEngineStepFixture:true,
        attackPreviewed:false,deathNotExercisedThisRun:true,statusBadgesEmpty:before.statusRects.length===0&&after.statusRects.length===0,
        rendererMode:r.battleSceneMode,artMode:r.battleArtMode};
    }finally{
      e.onEvent=saved.event;e.rng=saved.rng;r._drawEnemy=saved.enemy;r._drawPlayer=saved.player;r._enemyDamageOcclusionRects=saved.obstacles;
      r._drawCombatFeedback=saved.feedback;g.ctx.drawImage=saved.drawImage;g.ctx.fillText=saved.fillText;g.ctx.strokeText=saved.strokeText;
      if(e.onEvent!==saved.event||e.rng!==saved.rng||r._drawEnemy!==saved.enemy||r._drawPlayer!==saved.player||r._enemyDamageOcclusionRects!==saved.obstacles
        ||r._drawCombatFeedback!==saved.feedback||g.ctx.drawImage!==saved.drawImage||g.ctx.fillText!==saved.fillText||g.ctx.strokeText!==saved.strokeText)throw Error('Hook restoration differs');
      for(const mask of Object.values(masks)){mask.canvas.width=1;mask.canvas.height=1;}g.draw();
    }
  }, { observerUrl, layoutUrl, feedbackUrl, outlineUrl, pages, candidate, motion, layout }), 'single contact player outline fixture', 20000);
  for(const s of fixture.snapshots){const bytes=Buffer.from(s.pngBase64,'base64');delete s.pngBase64;const f=path.join(output,s.name+'.png');fs.writeFileSync(f,bytes);
    s.snapshot={file:rel(f),bytes:bytes.length,sha256:hash(bytes),kind:'explicit-evidence-only-current-draw-player-outline-fixture'};report.screenshots.push(s.snapshot);}
  report.fixture=fixture;assert.deepEqual(fixture.errors,[]);report.hookReferenceRestorationChecked=true;
  report.disposed=await page.evaluate(()=>{window.xiyou.dispose();return window.xiyou.disposed;});
  report.checks={realPointerUiBeforeFixture:report.uiEntry.screen==='game'&&!report.uiEntry.debug,
    actualCurrentSourceDrawReplayOnly:fixture.before.captures.player.length===1&&fixture.after.captures.player.length===1&&fixture.after.captures.candidate.length===1,
    laterCandidateAlphaOverlap:fixture.after.outline.overlapPixels>0&&fixture.after.captures.candidate[0].sequence>fixture.after.captures.player[0].sequence,
    oneOriginalPlayerDrawEachMode:fixture.originalPlayerCallsPerPair.every(c=>c===1),
    originalStateRngSourceArgsMatricesBarAndFeedbackUnchanged:fixture.sameStateRngSourceDrawsBarNumberFieldsFinalPaint,
    addedCompositeDrawExplicit:fixture.outlineCompositeCalls===1,onlyExactOutlineMaskPixelsChanged:fixture.changedPixels>0&&fixture.outsideHintMask===0,
    actualCandidateBarProtected:fixture.after.outline.hintBarOverlap===0,boundedThreeMasks:fixture.currentMaskCanvases===3,
    noProductionReferences:report.runtimeReferences.length===0,noInventedAttack:fixture.attackPreviewed===false,
    noErrorsOrExternalNetwork:!report.pageErrors.length&&!report.consoleErrors.length&&!report.failedRequests.length&&!report.httpErrors.length&&!report.externalRequests.length};
  report.result=Object.values(report.checks).every(Boolean)?'REVIEW_EVIDENCE_ONLY_OCCLUDED_PLAYER_OUTLINE':'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (context) try { await bounded(context.close(), 'context close'); report.contextClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  if (browser) try { await bounded(browser.close(), 'browser close'); report.browserClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  if (server) try { const stopped = new Promise(resolve => server.once('close', resolve)); server.kill(); await bounded(stopped, 'server close'); report.serverClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL'; report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(report,null,2));
}
console.log(JSON.stringify({ file: rel(path.join(output,'browser.json')), result: report.result, checks: report.checks,
  screenshots: report.screenshots.length, protectedFiles: Object.keys(expected).length, protectedUnchanged: report.protectedUnchanged,
  browserClosed: report.browserClosed, serverClosed: report.serverClosed, error: report.error },null,2));
if (report.result === 'FAIL') process.exitCode = 1;


