import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/transform-chain-control', generatedAt.replaceAll(':','-').replaceAll('.','-'));
fs.mkdirSync(output, { recursive: true });
const reportName = 'browser.json', screenshotPrefix = '', hash = b => crypto.createHash('sha256').update(b).digest('hex');
const rel = f => path.relative(root, f).replaceAll('\\', '/'), read = f => JSON.parse(fs.readFileSync(path.join(root, f)));
const previousFile = 'evidence/current/tiger-vanguard/transform-control/2026-10-14T03-09-23-021Z/browser.json';
const previous = read(previousFile), candidateFile = previous.candidate.file;
const candidate = read(candidateFile), motion = read(previous.motionDraft.file), layout = read(previous.layout.file);
const priorDirectory = path.posix.dirname(previousFile);
const extra = ['scripts/browser-tiger-vanguard-transform-control.mjs',
  ...['npm-test.txt','npm-validation.json','post-test-integrity.json','review.md','handoff.json','closeout.json','independent-review.json'].map(f => `${priorDirectory}/${f}`)];
const expected = { ...previous.protectedAfter, [previousFile]: '46382204b2f5191843f012d22bcdad701239b6a140f6013db223a6d6ffec770e',
  ...Object.fromEntries(previous.screenshots.map(s => [s.file, s.sha256])),
  ...Object.fromEntries(extra.map(f => [f, hash(fs.readFileSync(path.join(root, f)))])) };
const fingerprint = () => Object.fromEntries(Object.keys(expected).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const report = { generatedAt: new Date().toISOString(), result: 'FAIL',
  scope: 'Evidence-only original-transform-chain mirror control in one explicit hit26 fixture. A records main draws with no proxy operations; B/C replay all original world/player save/restore/setTransform/translate/scale/rotate operations on three transparent proxies, without getTransform-to-setTransform installation. Main player draw order/methods are unchanged. Observe exact CTM equality and repeated proxy stability, not transparent-proxy equivalence to actual main paint support, depth approval, production, natural gameplay, motion/FPS or public acceptance.',
  url: 'http://127.0.0.1:8088/', priorEvidence: { file: previousFile, sha256: expected[previousFile] },
  candidate: previous.candidate, motionDraft: previous.motionDraft,
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
  assert.deepEqual(report.protectedBefore, expected); assert.equal(previous.result, 'DIAGNOSTIC_COMPLETED_SAME_DEPTH_TRANSFORM_ROUND_TRIP');
  assert.equal(expected[previous.layout.file], previous.layout.sha256);
  for (const f of ['prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', 'scripts/serve.mjs', 'scripts/release.mjs',
    ...fs.readdirSync(path.join(root, 'prototype-2d/src')).filter(f => f.endsWith('.js')).map(f => `prototype-2d/src/${f}`)]) {
    const source = fs.readFileSync(path.join(root, f), 'utf8');
    for (const name of ['tiger-vanguard-transform-chain-control', candidateFile, previous.motionDraft.file, ...candidate.pages.map(p => p.file)])
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
  const depthUrl = moduleUrl(fs.readFileSync(path.join(root, 'scripts/tiger-vanguard-player-depth-draft.mjs'), 'utf8')
    .replace("'./tiger-vanguard-event-preview.mjs'", JSON.stringify(observerUrl)));
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
  const entryFile = path.join(output, `${screenshotPrefix}real-ui-before-fixture.png`), entry = await page.screenshot({ path: entryFile });
  report.screenshots.push({ file: rel(entryFile), bytes: entry.length, sha256: hash(entry), kind: 'real-ui-before-explicit-fixture' });
  for (const f of ['prototype-2d/src/engine.js', 'prototype-2d/src/renderer.js', 'prototype-2d/native-app.js']) {
    const response = await page.request.get(new URL(f.replace('prototype-2d/', ''), report.url).href);
    assert.equal(response.status(), 200); assert.equal(hash(await response.body()), expected[f]);
  }
  const fixture = await bounded(page.evaluate(async ({ observerUrl, layoutUrl, feedbackUrl, depthUrl, pages, candidate, motion, layout }) => {
    const { createVanguardEventPreview } = await import(observerUrl);
    const { projectVanguardLayout } = await import(layoutUrl);
    const { synchronizeVanguardFeedbackRects } = await import(feedbackUrl);
    const { planVanguardPlayerDepth } = await import(depthUrl);
    const g=window.xiyou,e=g.engine,s=e.state,r=g.renderer,preview=createVanguardEventPreview(motion),images={};
    if(g.canvas.width!==390||g.canvas.height!==844||r.pixelRatio!==1)throw Error('Single DPR1 viewport fixture required');
    for(const p of pages){const im=new Image();im.src=p.src;await im.decode();if(im.naturalWidth!==p.width||im.naturalHeight!==p.height)throw Error('Source dimensions differ');images[p.id]=im;}
    const masks={};for(const name of ['playerLayer','playerSprite','candidate']){const canvas=document.createElement('canvas');canvas.width=390;canvas.height=844;
      masks[name]={canvas,ctx:canvas.getContext('2d',{willReadFrequently:true})};}
    const styleKeys=['fillStyle','strokeStyle','globalAlpha','globalCompositeOperation','lineWidth','lineCap','lineJoin','miterLimit',
      'lineDashOffset','shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY','filter','font','textAlign','textBaseline',
      'direction','imageSmoothingEnabled','imageSmoothingQuality'];
    const matrix=ctx=>{const t=ctx.getTransform();return{a:t.a,b:t.b,c:t.c,d:t.d,e:t.e,f:t.f};};
    const style=ctx=>Object.fromEntries(styleKeys.map(k=>[k,ctx[k]]));
    const contextSnapshot=()=>({matrix:matrix(g.ctx),styles:style(g.ctx),dash:g.ctx.getLineDash(),canvasWidth:g.canvas.width,canvasHeight:g.canvas.height});
    const syncStyles=(ctx,styles,dash)=>{try{for(const [k,v]of Object.entries(styles))ctx[k]=v;ctx.setLineDash(dash);}
      catch(error){errors.push('PROXY_STYLE_SYNC_FAILED: '+String(error));throw error;}};
    const transformNames=['save','restore','setTransform','resetTransform','translate','scale','rotate','transform'];
    const pathPaintNames=['beginPath','closePath','moveTo','lineTo','quadraticCurveTo','bezierCurveTo','arc','ellipse','rect','roundRect',
      'fill','stroke','drawImage','fillRect','strokeRect'];
    const saved={event:e.onEvent,rng:e.rng,enemy:r._drawEnemy,player:r._drawPlayer,bar:r._drawHealthBar,obstacles:r._enemyDamageOcclusionRects,
      feedback:r._drawCombatFeedback,fillText:g.ctx.fillText,strokeText:g.ctx.strokeText,
      methods:Object.fromEntries([...transformNames,...pathPaintNames,'clip'].map(name=>[name,g.ctx[name]]))};
    const events=[],errors=[],draws=[],snapshots=[];let calls=0,renderToken=0,renderChecks=0,consumerChecks=0,binding,geometryCache=new WeakMap(),
      captureEnabled=false,mirrorEnabled=false,chainRecording=false,inPlayer=false,inCandidate=false,inFeedback=false,captures,paints,playerCommands,
      originalPlayerCalls,interceptedPlayerCalls,sequence,playerEntry,barPaints,transformChain,matrixChecks,stackDepth,stackUnderflow,clipCalls;
    e.rng=()=>{calls++;return saved.rng();};
    e.onEvent=event=>{const before=JSON.stringify(s),rng=calls;try{const accepted=preview.consume(event,s);events.push({type:event.type,target:event.target||null,
      accepted,sourceId:event.sourceId||null,at:s.time});if(JSON.stringify(s)!==before||calls!==rng)throw Error('Consumer writes state/RNG');consumerChecks++;
    }catch(error){errors.push(String(error));}finally{saved.event(event);}};
    const screenBox=box=>{const z=r._zoom(s.player);return{left:195+(box.left-r.camera.x)*z,right:195+(box.right-r.camera.x)*z,
      top:422+(box.top-r.camera.y)*z,bottom:422+(box.bottom-r.camera.y)*z};};
    const originalCall=(name,ctx,args)=>{try{return saved.methods[name].apply(ctx,args);}
      catch(error){errors.push('ORIGINAL_CANVAS_CALL_FAILED: '+name+': '+String(error));throw error;}};
    const proxyCall=(name,ctx,args)=>{try{return ctx[name](...args);}
      catch(error){errors.push('PROXY_CANVAS_CALL_FAILED: '+name+': '+String(error));throw error;}};
    const checkMatrix=(kind,proxy,main)=>{try{const actual=matrix(proxy),equal=JSON.stringify(actual)===JSON.stringify(main);
      matrixChecks.push({kind,main,proxy:actual,equal});if(!equal)errors.push('PROXY_MATRIX_MISMATCH: '+kind);}
      catch(error){errors.push('PROXY_MATRIX_OBSERVATION_FAILED: '+kind+': '+String(error));throw error;}};
    for(const name of transformNames)g.ctx[name]=function(...args){
      const before=chainRecording?matrix(this):null,returned=originalCall(name,this,args);
      if(chainRecording){
        if(name==='save')stackDepth++;else if(name==='restore'){stackDepth--;if(stackDepth<0)stackUnderflow=true;}
        const after=matrix(this);transformChain.push({name,args,before,after});
        if(mirrorEnabled)for(const [key,mask]of Object.entries(masks)){proxyCall(name,mask.ctx,args);checkMatrix('transform:'+name+':'+key,mask.ctx,after);}
      }return returned;
    };
    g.ctx.clip=function(...args){const returned=originalCall('clip',this,args);
      if(chainRecording){clipCalls++;errors.push('UNSUPPORTED_CLIP_IN_CAPTURED_CHAIN');}return returned;};
    for(const name of pathPaintNames)g.ctx[name]=function(...args){
      const active=captureEnabled&&(inPlayer||inCandidate&&name==='drawImage');
      const t=active?matrix(this):null,styles=active?style(this):null,dash=active?this.getLineDash():null;
      const returned=originalCall(name,this,args);
      if(active){
        if(inPlayer){
          if(playerCommands.length===0&&name!=='beginPath')errors.push('PLAYER_PATH_DOES_NOT_START_WITH_BEGIN_PATH');
          playerCommands.push({name,args:name==='drawImage'?['current-hero-source',...args.slice(1)]:args,transform:t,styles,dash});
          if(mirrorEnabled){const c=masks.playerLayer.ctx;checkMatrix('player-command:'+name,c,t);
            syncStyles(c,styles,dash);proxyCall(name,c,args);}
        }
        if(name==='drawImage'){
          const image=args[0],kind=inPlayer&&image===r.heroImages?.[s.character.id]?'player':inCandidate?'candidate':null;
          if(kind){const record={renderToken,kind,args:args.slice(1),transform:t,alpha:styles.globalAlpha,
            smoothing:styles.imageSmoothingEnabled,quality:styles.imageSmoothingQuality,composite:styles.globalCompositeOperation,
            source:kind==='player'?image.src.split('/').at(-1):'locked-candidate-page',width:image.naturalWidth,height:image.naturalHeight,sequence:++sequence};
            captures[kind].push(record);
            if(mirrorEnabled){const c=masks[kind==='player'?'playerSprite':'candidate'].ctx;checkMatrix(kind+'-source',c,t);
              syncStyles(c,styles,dash);proxyCall('drawImage',c,args);}
          }
        }
      }return returned;
    };
    const executePlayer=(ctx,args)=>{originalPlayerCalls++;inPlayer=true;try{return saved.player.call(r,ctx,...args);}finally{inPlayer=false;}};
    r._drawPlayer=function(ctx,...args){
      interceptedPlayerCalls++;
      const gate=planVanguardPlayerDepth(s,args[0],binding,renderToken,true);
      if(captureEnabled&&(!gate.defer||this._enemyDrawList.length!==1||this._enemyDrawList[0]!==binding.enemy)){
        errors.push('CONTROL_OUTSIDE_EXACT_SINGLE_CONTACT_FIXTURE');throw Error('Control outside fixture');}
      playerEntry={matrix:matrix(ctx),styles:style(ctx),dash:ctx.getLineDash(),contactGate:gate};
      return executePlayer(ctx,args);
    };
    r._drawEnemy=function(ctx,enemy,...args){
      const pose=preview.sampleEnemy(enemy,s);if(!pose)return saved.enemy.call(this,ctx,enemy,...args);
      const f=candidate.frames[pose.index],m=motion.frames[pose.index],geometry=projectVanguardLayout(layout,pose),scale=pose.radius*3.2/f.standingReferenceHeight;
      ctx.save();ctx.translate(pose.x,geometry.ground);ctx.scale(pose.facing,1);inCandidate=enemy===binding?.enemy;
      try{ctx.drawImage(images[f.page],f.sourceRect.x,f.sourceRect.y,f.sourceRect.w,f.sourceRect.h,
        -m.pivot.x*scale,-m.pivot.y*scale,f.sourceRect.w*scale,f.sourceRect.h*scale);}finally{inCandidate=false;ctx.restore();}
      const bar={left:geometry.bar.left,right:geometry.bar.right,top:geometry.bar.y,bottom:geometry.bar.bottom};
      r._drawHealthBar(ctx,pose.x,bar.top,pose.radius*2.3,pose.hp/pose.maxHp,'#e66b35');
      if(enemy===binding?.enemy)geometryCache.set(enemy,{renderToken,body:geometry.draw,bar});
      draws.push({renderToken,pose,geometry,bar,screenBar:screenBox(bar),camera:{...r.camera},zoom:r._zoom(s.player)});
    };
    r._enemyDamageOcclusionRects=function(enemies){
      const rects=saved.obstacles.call(this,enemies),result=synchronizeVanguardFeedbackRects(rects,enemies,
        {state:s,binding,renderToken,geometryFor:enemy=>geometryCache.get(enemy)});errors.push(...result.errors);return rects;
    };
    r._drawHealthBar=function(ctx,...args){
      const record=captureEnabled?{args,transform:matrix(ctx),styles:style(ctx),dash:ctx.getLineDash()}:null;
      const returned=saved.bar.call(this,ctx,...args);if(record)barPaints.push(record);return returned;
    };
    for(const name of ['fillText','strokeText'])g.ctx[name]=function(...args){if(inFeedback)paints.push({name,args,font:this.font,fill:this.fillStyle,
      stroke:this.strokeStyle,lineWidth:this.lineWidth,align:this.textAlign,baseline:this.textBaseline,alpha:this.globalAlpha,transform:matrix(this)});
      try{return saved[name].apply(this,args);}catch(error){errors.push('ORIGINAL_TEXT_CALL_FAILED: '+name+': '+String(error));throw error;}};
    r._drawCombatFeedback=function(ctx,state,enemies,options){
      paints=[];inFeedback=true;try{saved.feedback.call(this,ctx,state,enemies,options);}finally{inFeedback=false;}
    };
    const draw=()=>{const state=JSON.stringify(s),rng=calls,frameContextBefore=contextSnapshot();renderToken++;geometryCache=new WeakMap();captures={player:[],candidate:[]};paints=[];playerCommands=[];
      originalPlayerCalls=0;interceptedPlayerCalls=0;sequence=0;playerEntry=null;barPaints=[];transformChain=[];matrixChecks=[];stackDepth=0;stackUnderflow=false;clipCalls=0;
      for(const mask of Object.values(masks)){mask.canvas.width=390;mask.canvas.height=844;}
      chainRecording=captureEnabled;g.renderDt=0;
      try{g.draw();}finally{chainRecording=false;}
      preview.reconcile(s);if(JSON.stringify(s)!==state||calls!==rng)throw Error('Draw writes state/RNG');renderChecks++;
      if(captureEnabled&&(transformChain[0]?.name!=='setTransform'||stackDepth!==0||stackUnderflow||clipCalls)){
        errors.push('INVALID_CHAIN_START_STACK_OR_CLIP');}
      const frame={renderToken,draw:draws.at(-1),captures,playerCommands,paints,barPaints,originalPlayerCalls,interceptedPlayerCalls,playerEntry,frameContextBefore,frameContextAfter:contextSnapshot(),
        transformChain,matrixChecks,mirrorEnabled,stackDepth,stackUnderflow,clipCalls,
        numbers:structuredClone(s.damageNumbers),labelRects:structuredClone(r._damageLabelRects),statusRects:structuredClone(r._statusBadgeRects)};
      const ctx=g.ctx;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#2a1729';ctx.fillRect(0,0,390,24);
      ctx.fillStyle='#ffe6b5';ctx.font='bold 9px sans-serif';ctx.fillText('EVIDENCE ONLY / SAME DEPTH / ORIGINAL TRANSFORM CHAIN',5,15);ctx.restore();return frame;};
    const shot=(name,canvas=g.canvas)=>snapshots.push({name,pngBase64:canvas.toDataURL('image/png').split(',')[1]});
    const step=dt=>{e.elapsed+=dt;s.time=e.elapsed;e.updateEffects(dt);e.updateEnemies(dt);};
    try{
      for(const key of ['enemies','effects','projectiles','gems','damageNumbers'])s[key].length=0;e.elapsed=s.time=299.95;e.update(.05);
      const leader=s.enemies.find(enemy=>enemy.encounterIdentity?.encounterId==='tiger-vanguard');if(!leader)throw Error('No scheduled Vanguard');
      binding={enemy:leader,id:leader.id,identity:leader.encounterIdentity};s.enemies=[leader];s.effects.length=0;s.projectiles.length=0;s.gems.length=0;s.damageNumbers.length=0;
      s.player.x=900;s.player.y=1260;leader.x=1010;leader.y=1320;draw();for(let i=0;i<16;i++){step(.025);draw();}
      leader.x=s.player.x+15;leader.y=s.player.y+15;s.player.invulnerable=0;step(.025);draw();e.damageEnemy(leader,1,{});draw();for(let i=0;i<6;i++){step(.025);draw();}
      const stateBefore=JSON.stringify(s),rngBefore=calls,rendererElapsedBefore=r.elapsed;captureEnabled=true;mirrorEnabled=false;
      const original=draw();shot('hit26-mirror-off');const originalPixels=g.ctx.getImageData(0,0,390,844).data;
      mirrorEnabled=true;const before=draw();shot('hit26-chain-mirror-on');
      const beforePixels=g.ctx.getImageData(0,0,390,844).data,beforeMasks={};
      for(const [name,mask]of Object.entries(masks)){beforeMasks[name]=mask.ctx.getImageData(0,0,390,844).data;shot('before-'+name+'-chain-proxy',mask.canvas);}
      const after=draw();shot('hit26-chain-mirror-repeat');const afterPixels=g.ctx.getImageData(0,0,390,844).data,afterMasks={};
      for(const [name,mask]of Object.entries(masks)){afterMasks[name]=mask.ctx.getImageData(0,0,390,844).data;shot('after-'+name+'-chain-proxy',mask.canvas);}
      if(JSON.stringify(s)!==stateBefore||calls!==rngBefore||r.elapsed!==rendererElapsedBefore)throw Error('Triplet writes state/RNG/renderer elapsed');
      const invariant=frame=>({draw:{...frame.draw,renderToken:undefined},
        captures:Object.fromEntries(Object.entries(frame.captures).map(([k,v])=>[k,v.map(c=>({...c,renderToken:undefined}))])),
        playerCommands:frame.playerCommands,paints:frame.paints,barPaints:frame.barPaints,numbers:frame.numbers,frameContextBefore:frame.frameContextBefore,frameContextAfter:frame.frameContextAfter,
        transformChain:frame.transformChain,labelRects:frame.labelRects,statusRects:frame.statusRects,
        playerEntry:{...frame.playerEntry,contactGate:{...frame.playerEntry.contactGate,renderToken:undefined}},
        originalPlayerCalls:frame.originalPlayerCalls,interceptedPlayerCalls:frame.interceptedPlayerCalls});
      const invariantDifferences=[],originalInvariant=invariant(original),beforeInvariant=invariant(before),afterInvariant=invariant(after);
      for(const key of Object.keys(originalInvariant))if(JSON.stringify(originalInvariant[key])!==JSON.stringify(beforeInvariant[key])
        ||JSON.stringify(beforeInvariant[key])!==JSON.stringify(afterInvariant[key]))invariantDifferences.push(key);
      if(invariantDifferences.length)errors.push('STRICT_MAIN_INVARIANT_DIFFERENCES: '+invariantDifferences.join(','));
      let changedPixelsOffOn=0,changedPixelsRepeat=0,sourceMaskDifferences=0;
      const perMaskDifferences={playerLayer:0,playerSprite:0,candidate:0},maskAlphaPixels={playerLayer:0,playerSprite:0,candidate:0};
      for(let i=0;i<beforePixels.length;i+=4){
        if([0,1,2,3].some(k=>originalPixels[i+k]!==beforePixels[i+k]))changedPixelsOffOn++;
        if([0,1,2,3].some(k=>beforePixels[i+k]!==afterPixels[i+k]))changedPixelsRepeat++;
        let anyMask=false;
        for(const name of Object.keys(masks)){if(afterMasks[name][i+3]>0)maskAlphaPixels[name]++;
          if([0,1,2,3].some(k=>beforeMasks[name][i+k]!==afterMasks[name][i+k])){perMaskDifferences[name]++;anyMask=true;}}
        if(anyMask)sourceMaskDifferences++;
      }
      return {original,before,after,snapshots,events,errors,invariantDifferences,renderChecks,consumerChecks,rngCalls:calls,
        changedPixelsOffOn,changedPixelsRepeat,sourceMaskDifferences,perMaskDifferences,maskAlphaPixels,allBeforeAfterMasksSaved:true,masksAreRasterProxies:true,
        proxyEquivalentToActualMainPaintSupportProven:false,initialMainClipDirectlyVerified:false,observedCapturedClipCalls:original.clipCalls+before.clipCalls+after.clipCalls,
        sameStateRngRendererElapsed:true,rendererElapsedBefore,rendererElapsedAfter:r.elapsed,
        originalPlayerCallsPerTriplet:[original.originalPlayerCalls,before.originalPlayerCalls,after.originalPlayerCalls],
        sameOriginalPlayerThenCandidateOrder:[original,before,after].every(frame=>frame.captures.player.length===1&&frame.captures.candidate.length===1
          &&frame.captures.player[0].sequence<frame.captures.candidate[0].sequence),
        mirrorChecks:[original.matrixChecks.length,before.matrixChecks.length,after.matrixChecks.length],
        expectedMirrorChecks:[before,after].map(f=>3*f.transformChain.length+f.playerCommands.length+f.captures.player.length+f.captures.candidate.length),
        exactProxyMatrices:before.matrixChecks.length>0&&after.matrixChecks.length>0&&[...before.matrixChecks,...after.matrixChecks].every(c=>c.equal),
        naturalFiveMinuteSurvival:false,partialEngineStepFixture:true,attackPreviewed:false,deathNotExercisedThisRun:true,
        statusBadgesEmpty:original.statusRects.length===0&&before.statusRects.length===0&&after.statusRects.length===0,rendererMode:r.battleSceneMode,artMode:r.battleArtMode};
    }finally{
      e.onEvent=saved.event;e.rng=saved.rng;r._drawEnemy=saved.enemy;r._drawPlayer=saved.player;r._drawHealthBar=saved.bar;r._enemyDamageOcclusionRects=saved.obstacles;r._drawCombatFeedback=saved.feedback;
      for(const name of [...transformNames,...pathPaintNames,'clip'])g.ctx[name]=saved.methods[name];g.ctx.fillText=saved.fillText;g.ctx.strokeText=saved.strokeText;
      if(e.onEvent!==saved.event||e.rng!==saved.rng||r._drawEnemy!==saved.enemy||r._drawPlayer!==saved.player||r._drawHealthBar!==saved.bar||r._enemyDamageOcclusionRects!==saved.obstacles
        ||r._drawCombatFeedback!==saved.feedback||[...transformNames,...pathPaintNames,'clip'].some(name=>g.ctx[name]!==saved.methods[name])
        ||g.ctx.fillText!==saved.fillText||g.ctx.strokeText!==saved.strokeText)throw Error('Hook restoration differs');
      chainRecording=false;captureEnabled=false;mirrorEnabled=false;for(const mask of Object.values(masks)){mask.canvas.width=1;mask.canvas.height=1;}g.draw();
    }
  }, { observerUrl, layoutUrl, feedbackUrl, depthUrl, pages, candidate, motion, layout }), 'single contact original transform chain control', 20000);
  for(const s of fixture.snapshots){const bytes=Buffer.from(s.pngBase64,'base64');delete s.pngBase64;const f=path.join(output,screenshotPrefix+s.name+'.png');fs.writeFileSync(f,bytes);
    s.snapshot={file:rel(f),bytes:bytes.length,sha256:hash(bytes),kind:'explicit-evidence-only-transform-chain-control'};report.screenshots.push(s.snapshot);}
  report.fixture=fixture;report.hookReferenceRestorationChecked=true;
  report.disposed=await page.evaluate(()=>{window.xiyou.dispose();return window.xiyou.disposed;});
  report.checks={realPointerUiBeforeFixture:report.uiEntry.screen==='game'&&!report.uiEntry.debug,
    oneOriginalPlayerExecutionEachMode:fixture.originalPlayerCallsPerTriplet.every(c=>c===1),
    sameOriginalDepthOrder:fixture.sameOriginalPlayerThenCandidateOrder,
    strictMainArgsStylesSourcesMatricesBodyBarFeedbackUnchanged:fixture.invariantDifferences.length===0,
    noMainFramePixelChanges:fixture.changedPixelsOffOn===0&&fixture.changedPixelsRepeat===0,
    exactOriginalAndProxyTransformMatrices:fixture.exactProxyMatrices,
    completeMatrixObservationCounts:fixture.mirrorChecks[1]===fixture.expectedMirrorChecks[0]&&fixture.mirrorChecks[2]===fixture.expectedMirrorChecks[1],
    mainCanvasDimensionsPreserved:[fixture.original,fixture.before,fixture.after].every(f=>[f.frameContextBefore,f.frameContextAfter].every(c=>c.canvasWidth===390&&c.canvasHeight===844)),
    originalFrameDoesNotRunProxy:fixture.mirrorChecks[0]===0,
    repeatedProxyPixelsStable:fixture.sourceMaskDifferences===0&&Object.values(fixture.perMaskDifferences).every(n=>n===0),
    allThreeProxiesNonempty:Object.values(fixture.maskAlphaPixels).every(n=>n>0),
    allBeforeAfterMasksSaved:fixture.allBeforeAfterMasksSaved,
    chainStartsWithOriginalSetTransformAndBalanced:[fixture.original,fixture.before,fixture.after].every(f=>f.transformChain[0]?.name==='setTransform'&&f.stackDepth===0&&!f.stackUnderflow),
    noObservedClipInCapturedChain:fixture.observedCapturedClipCalls===0,
    sameStateRngRendererElapsed:fixture.sameStateRngRendererElapsed,
    noProductionReferences:report.runtimeReferences.length===0,fixtureErrorsEmpty:fixture.errors.length===0,
    noErrorsOrExternalNetwork:!report.pageErrors.length&&!report.consoleErrors.length&&!report.failedRequests.length&&!report.httpErrors.length&&!report.externalRequests.length};
  report.result=Object.values(report.checks).every(Boolean)?'REVIEW_EVIDENCE_ONLY_ORIGINAL_TRANSFORM_CHAIN_STABILITY':'FAIL';
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (context) try { await bounded(context.close(), 'context close'); report.contextClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  if (browser) try { await bounded(browser.close(), 'browser close'); report.browserClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  if (server) try { const stopped = new Promise(resolve => server.once('close', resolve)); server.kill(); await bounded(stopped, 'server close'); report.serverClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL'; report.finishedAt = new Date().toISOString(); fs.writeFileSync(path.join(output, reportName), JSON.stringify(report,null,2));
}
console.log(JSON.stringify({ file: rel(path.join(output,reportName)), result: report.result, checks: report.checks,
  screenshots: report.screenshots.length, protectedFiles: Object.keys(expected).length, protectedUnchanged: report.protectedUnchanged,
  browserClosed: report.browserClosed, serverClosed: report.serverClosed, error: report.error },null,2));
if (report.result === 'FAIL') process.exitCode = 1;
