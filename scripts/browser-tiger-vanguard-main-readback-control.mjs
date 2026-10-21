import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/main-readback-control', generatedAt.replaceAll(':','-').replaceAll('.','-'));
fs.mkdirSync(output, { recursive: true });
const reportName = 'browser.json', screenshotPrefix = '', hash = b => crypto.createHash('sha256').update(b).digest('hex');
const rel = f => path.relative(root, f).replaceAll('\\', '/'), read = f => JSON.parse(fs.readFileSync(path.join(root, f)));
const previousFile = 'evidence/current/tiger-vanguard/transform-chain-control/2026-10-14T03-29-15-654Z/browser.json';
const previous = read(previousFile), candidateFile = previous.candidate.file;
const candidate = read(candidateFile), motion = read(previous.motionDraft.file), layout = read(previous.layout.file);
const priorDirectory = path.posix.dirname(previousFile);
const priorCloseout = read(`${priorDirectory}/closeout.json`);
const extra = ['scripts/browser-tiger-vanguard-transform-chain-control.mjs', ...fs.readdirSync(path.join(root, priorDirectory)).map(f => `${priorDirectory}/${f}`)];
const expected = { ...previous.protectedAfter,
  ...Object.fromEntries(extra.map(f => [f, priorCloseout.sha256[f] || hash(fs.readFileSync(path.join(root, f)))])) };
const fingerprint = () => Object.fromEntries(Object.keys(expected).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const report = { generatedAt: new Date().toISOString(), result: 'FAIL',
  scope: 'Evidence-only same-depth, no-proxy PNG-only then PNG-plus-getImageData sequential control. Six synchronous original game draws with full main Canvas method/state trace and unchanged player order. PNGs are decoded after the browser closes; PNG-only is NOT a no-readback group, since toDataURL is itself readback. Prior draws/export history and phase ordering prevent causal backend claims. No production, depth, art, natural gameplay, motion/FPS/public approval.',
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
  assert.deepEqual(report.protectedBefore, expected); assert.equal(previous.result, 'FAIL'); assert.equal(priorCloseout.browserResult, 'FAIL');
  assert.equal(expected[previous.layout.file], previous.layout.sha256);
  for (const f of ['prototype-2d/native-app.js', 'prototype-2d/assets/manifest.json', 'scripts/serve.mjs', 'scripts/release.mjs',
    ...fs.readdirSync(path.join(root, 'prototype-2d/src')).filter(f => f.endsWith('.js')).map(f => `prototype-2d/src/${f}`)]) {
    const source = fs.readFileSync(path.join(root, f), 'utf8');
    for (const name of ['tiger-vanguard-main-readback-control', candidateFile, previous.motionDraft.file, ...candidate.pages.map(p => p.file)])
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
  const fixture = await bounded(page.evaluate(async ({ observerUrl, layoutUrl, feedbackUrl, depthUrl, pages, candidate, motion, layout, assetHashes }) => {
    const { createVanguardEventPreview } = await import(observerUrl);
    const { projectVanguardLayout } = await import(layoutUrl);
    const { synchronizeVanguardFeedbackRects } = await import(feedbackUrl);
    const { planVanguardPlayerDepth } = await import(depthUrl);
    const g=window.xiyou,e=g.engine,s=e.state,r=g.renderer,preview=createVanguardEventPreview(motion),images={};
    if(g.canvas.width!==390||g.canvas.height!==844||r.pixelRatio!==1)throw Error('Single DPR1 viewport fixture required');
    for(const p of pages){const im=new Image();im.src=p.src;await im.decode();if(im.naturalWidth!==p.width||im.naturalHeight!==p.height)throw Error('Source dimensions differ');images[p.id]=im;}
    const styleKeys=['fillStyle','strokeStyle','globalAlpha','globalCompositeOperation','lineWidth','lineCap','lineJoin','miterLimit',
      'lineDashOffset','shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY','filter','font','textAlign','textBaseline',
      'direction','imageSmoothingEnabled','imageSmoothingQuality','fontKerning','fontStretch','fontVariantCaps','textRendering','letterSpacing','wordSpacing'].filter(k=>k in g.ctx);
    const methodNames=['save','restore','setTransform','resetTransform','translate','scale','rotate','transform','beginPath','closePath','moveTo','lineTo',
      'quadraticCurveTo','bezierCurveTo','arc','arcTo','ellipse','rect','roundRect','fill','stroke','drawImage','fillRect','strokeRect','clearRect','clip','setLineDash',
      'fillText','strokeText','measureText'];
    const transformNames=new Set(['save','restore','setTransform','resetTransform','translate','scale','rotate','transform']);
    const saved={event:e.onEvent,rng:e.rng,enemy:r._drawEnemy,player:r._drawPlayer,bar:r._drawHealthBar,obstacles:r._enemyDamageOcclusionRects,
      feedback:r._drawCombatFeedback,canvasPng:g.canvas.toDataURL,getImageData:g.ctx.getImageData,
      methods:Object.fromEntries(methodNames.filter(k=>typeof g.ctx[k]==='function').map(k=>[k,g.ctx[k]]))};
    const events=[],errors=[],draws=[],snapshots=[],rawReads=[],readbackOrder=[],sourceRegistry=[],sourceRefs=new WeakMap(),frames=[];
    let calls=0,renderToken=0,renderChecks=0,consumerChecks=0,binding,geometryCache=new WeakMap(),captureEnabled=false,recordingFrame=false,
      inPlayer=false,inCandidate=false,inFeedback=false,inAnnotation=false,commands=[],states=[],stateIds,originalPlayerCalls=0,interceptedPlayerCalls=0,
      playerEntry=null,barPaints=[],captures,sequence=0,stackDepth=0,stackUnderflow=false,clipCalls=0,transformCalls=0,readSequence=0;
    const fail=message=>{if(errors.length<100)errors.push(message);throw Error(message);};
    const observe=(name,fn)=>{try{return fn();}catch(error){if(errors.length<100)errors.push('OBSERVATION_FAILED: '+name+': '+String(error));throw error;}};
    const matrix=ctx=>observe('getTransform',()=>{const t=ctx.getTransform();return{a:t.a,b:t.b,c:t.c,d:t.d,e:t.e,f:t.f};});
    const styles=ctx=>observe('styles',()=>Object.fromEntries(styleKeys.map(k=>{const v=ctx[k];
      if(!['string','number','boolean'].includes(typeof v))fail('UNSUPPORTED_STYLE: '+k);return[k,v];})));
    const canvasAttributes=()=>observe('getContextAttributes',()=>typeof g.ctx.getContextAttributes==='function'?g.ctx.getContextAttributes():null);
    const contextSnapshot=()=>({matrix:matrix(g.ctx),styles:styles(g.ctx),dash:observe('getLineDash',()=>g.ctx.getLineDash()),
      canvasWidth:g.canvas.width,canvasHeight:g.canvas.height,attributes:canvasAttributes()});
    const uiSnapshot=()=>({uiAnimation:structuredClone(g.uiAnimation),press:structuredClone(g.press),joy:structuredClone(g.joy),input:structuredClone(g.input),
      running:g.running,frame:g.frame,hidden:g.hidden,disposed:g.disposed,renderDt:g.renderDt,screen:g.screen,status:s.status,
      reducedMotion:g.reducedMotion,top:g.top,bottom:g.bottom,w:g.w,h:g.h,dpr:g.dpr});
    const stateId=()=>{const current={matrix:matrix(g.ctx),styles:styles(g.ctx),dash:observe('getLineDash',()=>g.ctx.getLineDash())},key=JSON.stringify(current);
      if(!stateIds.has(key)){stateIds.set(key,states.length);states.push(current);}return stateIds.get(key);};
    const describeImage=image=>{
      const page=pages.find(p=>images[p.id]===image);
      const isImage=image instanceof HTMLImageElement;
      if(!isImage)fail('UNSUPPORTED_DRAW_IMAGE_SOURCE: '+Object.prototype.toString.call(image));
      const url=page?null:new URL(image.src,location.href);
      const file=page?page.file:url.origin===location.origin?'prototype-2d'+url.pathname:null;
      const sha256=page?page.sha256:assetHashes[file];
      if(!file||!sha256||!image.complete||image.naturalWidth<=0||image.naturalHeight<=0)fail('UNLOCKED_OR_UNREADY_IMAGE_SOURCE');
      return{file,sha256,src:page?'locked-candidate-page:'+page.id:url.href,width:image.width,height:image.height,
        naturalWidth:image.naturalWidth,naturalHeight:image.naturalHeight,complete:image.complete};
    };
    const imageArgs=(image,args)=>{const description=describeImage(image);let ref=sourceRefs.get(image);
      if(ref===undefined){ref=sourceRegistry.length;sourceRefs.set(image,ref);sourceRegistry.push({ref,...description});}
      if(JSON.stringify(sourceRegistry[ref])!==JSON.stringify({ref,...description}))fail('IMAGE_SOURCE_CHANGED');
      return{args:[{imageRef:ref},...args],description,ref};};
    const primitiveArgs=args=>args.map(value=>{
      if(typeof value==='number'&&!Number.isFinite(value))fail('NONFINITE_CANVAS_ARG');
      if(value!==null&&!['string','number','boolean','undefined'].includes(typeof value))fail('UNSUPPORTED_CANVAS_ARG: '+Object.prototype.toString.call(value));
      return value===undefined?{undefined:true}:value;});
    const originalMethod=(name,args)=>{try{return saved.methods[name].apply(g.ctx,args);}
      catch(error){if(errors.length<100)errors.push('ORIGINAL_CANVAS_CALL_FAILED: '+name+': '+String(error));throw error;}};
    const metricKeys=['width','actualBoundingBoxLeft','actualBoundingBoxRight','actualBoundingBoxAscent','actualBoundingBoxDescent',
      'fontBoundingBoxAscent','fontBoundingBoxDescent','emHeightAscent','emHeightDescent','hangingBaseline','alphabeticBaseline','ideographicBaseline'];
    for(const name of Object.keys(saved.methods))g.ctx[name]=function(...args){
      if(!recordingFrame)return originalMethod(name,args);
      if(commands.length>=30000)fail('FRAME_TRACE_LIMIT_EXCEEDED');
      const activeKind=inAnnotation?'annotation':inPlayer?'player':inCandidate?'candidate':inFeedback?'feedback':'other';
      const normalized=name==='drawImage'?imageArgs(args[0],primitiveArgs(args.slice(1))):name==='setLineDash'
        ?{args:[primitiveArgs(args[0]),...primitiveArgs(args.slice(1))]}:{args:primitiveArgs(args)};
      const beforeState=stateId(),returned=originalMethod(name,args);
      const command={name,args:normalized.args,segment:activeKind,state:beforeState};
      if(transformNames.has(name)){
        transformCalls++;if(name==='save')stackDepth++;else if(name==='restore'){stackDepth--;if(stackDepth<0)stackUnderflow=true;}
        command.afterState=stateId();
      }
      if(name==='clip')clipCalls++;
      if(name==='measureText')command.result=observe('TextMetrics',()=>Object.fromEntries(metricKeys.filter(k=>k in returned).map(k=>{
        if(!Number.isFinite(returned[k]))fail('NONFINITE_TEXT_METRIC: '+k);return[k,returned[k]];})));
      commands.push(command);
      if(name==='drawImage'&&(inPlayer&&args[0]===r.heroImages?.[s.character.id]||inCandidate)){
        const kind=inPlayer?'player':'candidate',record={kind,imageRef:normalized.ref,args:args.slice(1),state:beforeState,sequence:++sequence};
        captures[kind].push(record);
      }
      return returned;
    };
    g.canvas.toDataURL=function(...args){if(captureEnabled)readbackOrder.push({sequence:++readSequence,frameIndex:frames.length+1,kind:'main-toDataURL',args});
      try{return saved.canvasPng.apply(this,args);}catch(error){errors.push('MAIN_PNG_EXPORT_FAILED: '+String(error));throw error;}};
    g.ctx.getImageData=function(...args){if(captureEnabled)readbackOrder.push({sequence:++readSequence,frameIndex:frames.length+1,kind:'main-getImageData',args,
      duringRender:recordingFrame});try{return saved.getImageData.apply(this,args);}catch(error){errors.push('MAIN_IMAGE_DATA_FAILED: '+String(error));throw error;}};
    e.rng=()=>{calls++;return saved.rng();};
    e.onEvent=event=>{const before=JSON.stringify(s),rng=calls;try{const accepted=preview.consume(event,s);events.push({type:event.type,target:event.target||null,
      accepted,sourceId:event.sourceId||null,at:s.time});if(JSON.stringify(s)!==before||calls!==rng)fail('Consumer writes state/RNG');consumerChecks++;
    }catch(error){errors.push(String(error));}finally{saved.event(event);}};
    const screenBox=box=>{const z=r._zoom(s.player);return{left:195+(box.left-r.camera.x)*z,right:195+(box.right-r.camera.x)*z,
      top:422+(box.top-r.camera.y)*z,bottom:422+(box.bottom-r.camera.y)*z};};
    r._drawPlayer=function(ctx,...args){interceptedPlayerCalls++;
      if(captureEnabled){const gate=planVanguardPlayerDepth(s,args[0],binding,renderToken,true);
        if(!gate.defer||this._enemyDrawList.length!==1||this._enemyDrawList[0]!==binding.enemy)fail('CONTROL_OUTSIDE_EXACT_SINGLE_CONTACT_FIXTURE');
        playerEntry={matrix:matrix(ctx),styles:styles(ctx),dash:ctx.getLineDash(),contactGate:{...gate,renderToken:undefined}};}
      originalPlayerCalls++;inPlayer=true;try{return saved.player.call(this,ctx,...args);}finally{inPlayer=false;}};
    r._drawEnemy=function(ctx,enemy,...args){const pose=preview.sampleEnemy(enemy,s);if(!pose)return saved.enemy.call(this,ctx,enemy,...args);
      const f=candidate.frames[pose.index],m=motion.frames[pose.index],geometry=projectVanguardLayout(layout,pose),scale=pose.radius*3.2/f.standingReferenceHeight;
      ctx.save();ctx.translate(pose.x,geometry.ground);ctx.scale(pose.facing,1);inCandidate=enemy===binding?.enemy;
      try{ctx.drawImage(images[f.page],f.sourceRect.x,f.sourceRect.y,f.sourceRect.w,f.sourceRect.h,
        -m.pivot.x*scale,-m.pivot.y*scale,f.sourceRect.w*scale,f.sourceRect.h*scale);}finally{inCandidate=false;ctx.restore();}
      const bar={left:geometry.bar.left,right:geometry.bar.right,top:geometry.bar.y,bottom:geometry.bar.bottom};
      r._drawHealthBar(ctx,pose.x,bar.top,pose.radius*2.3,pose.hp/pose.maxHp,'#e66b35');
      if(enemy===binding?.enemy)geometryCache.set(enemy,{renderToken,body:geometry.draw,bar});
      draws.push({renderToken,pose,geometry,bar,screenBar:screenBox(bar),camera:{...r.camera},zoom:r._zoom(s.player)});};
    r._enemyDamageOcclusionRects=function(enemies){const rects=saved.obstacles.call(this,enemies),result=synchronizeVanguardFeedbackRects(rects,enemies,
      {state:s,binding,renderToken,geometryFor:enemy=>geometryCache.get(enemy)});errors.push(...result.errors);return rects;};
    r._drawHealthBar=function(ctx,...args){if(recordingFrame)barPaints.push({args,matrix:matrix(ctx),styles:styles(ctx),dash:ctx.getLineDash()});
      return saved.bar.call(this,ctx,...args);};
    r._drawCombatFeedback=function(...args){inFeedback=true;try{return saved.feedback.apply(this,args);}finally{inFeedback=false;}};
    const draw=()=>{const engineBefore=JSON.stringify(s),rngBefore=calls,elapsedBefore=r.elapsed,contextBefore=contextSnapshot(),uiBefore=uiSnapshot();
      renderToken++;geometryCache=new WeakMap();commands=[];states=[];stateIds=new Map();originalPlayerCalls=0;interceptedPlayerCalls=0;playerEntry=null;
      barPaints=[];captures={player:[],candidate:[]};sequence=0;stackDepth=0;stackUnderflow=false;clipCalls=0;transformCalls=0;g.renderDt=0;
      recordingFrame=captureEnabled;try{g.draw();}finally{recordingFrame=false;}
      preview.reconcile(s);if(JSON.stringify(s)!==engineBefore||calls!==rngBefore||r.elapsed!==elapsedBefore)fail('Draw writes state/RNG/renderer elapsed');renderChecks++;
      const frame={renderToken,draw:draws.at(-1),commands,states,captures,barPaints,playerEntry,originalPlayerCalls,interceptedPlayerCalls,
        transformCalls,stackDepth,stackUnderflow,clipCalls,engineBefore,engineAfter:JSON.stringify(s),rngBefore,rngAfter:calls,
        rendererElapsedBefore:elapsedBefore,rendererElapsedAfter:r.elapsed,camera:{...r.camera},view:structuredClone(r._view),hudBounds:structuredClone(r._hudScreenBounds),
        contextBefore,contextAfter:contextSnapshot(),uiBefore,uiAfter:uiSnapshot(),numbers:structuredClone(s.damageNumbers),
        labelRects:structuredClone(r._damageLabelRects),statusRects:structuredClone(r._statusBadgeRects)};
      if(captureEnabled&&(stackDepth!==0||stackUnderflow||clipCalls||commands[0]?.name!=='setTransform'))fail('INVALID_FULL_FRAME_CHAIN');
      const ctx=g.ctx;recordingFrame=captureEnabled;inAnnotation=true;
      try{ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#2a1729';ctx.fillRect(0,0,390,24);
        ctx.fillStyle='#ffe6b5';ctx.font='bold 9px sans-serif';ctx.fillText('EVIDENCE ONLY / SAME DEPTH / MAIN READBACK CONTROL',5,15);ctx.restore();
      }finally{recordingFrame=false;inAnnotation=false;}
      Object.assign(frame,{contextAfter:contextSnapshot(),uiAfter:uiSnapshot(),transformCalls,stackDepth,stackUnderflow,clipCalls});
      if(captureEnabled&&(stackDepth!==0||stackUnderflow||clipCalls))fail('INVALID_POST_ANNOTATION_CHAIN');
      return frame;};
    const shot=name=>snapshots.push({name,pngBase64:g.canvas.toDataURL('image/png').split(',')[1]});
    const rgbaBase64=data=>{let text='';for(let i=0;i<data.length;i+=8192)text+=String.fromCharCode(...data.subarray(i,i+8192));return btoa(text);};
    const step=dt=>{e.elapsed+=dt;s.time=e.elapsed;e.updateEffects(dt);e.updateEnemies(dt);};
    let restorationChecked=false;
    try{
      for(const key of ['enemies','effects','projectiles','gems','damageNumbers'])s[key].length=0;e.elapsed=s.time=299.95;e.update(.05);
      const leader=s.enemies.find(enemy=>enemy.encounterIdentity?.encounterId==='tiger-vanguard');if(!leader)fail('No scheduled Vanguard');
      binding={enemy:leader,id:leader.id,identity:leader.encounterIdentity};s.enemies=[leader];s.effects.length=0;s.projectiles.length=0;s.gems.length=0;s.damageNumbers.length=0;
      s.player.x=900;s.player.y=1260;leader.x=1010;leader.y=1320;draw();for(let i=0;i<16;i++){step(.025);draw();}
      leader.x=s.player.x+15;leader.y=s.player.y+15;s.player.invulnerable=0;step(.025);draw();e.damageEnemy(leader,1,{});draw();for(let i=0;i<6;i++){step(.025);draw();}
      const stateBefore=JSON.stringify(s),rngBefore=calls,rendererElapsedBefore=r.elapsed,uiAtStart=uiSnapshot();
      if(uiAtStart.running||uiAtStart.frame||uiAtStart.hidden||uiAtStart.disposed||uiAtStart.uiAnimation.active||uiAtStart.press||s.status!=='playing')fail('NONSTATIC_UI_OR_ACTIVE_RAF');
      captureEnabled=true;
      // Same main canvas, six synchronous draws. No await/RAF/screenshot between frames.
      // PNG-only still exports the main canvas and is NOT a no-readback group.
      for(let index=0;index<6;index++){
        const group=index<3?'png-only':'png-plus-getImageData',frame=draw();shot('frame-'+(index+1)+'-'+group);
        if(index>=3){const im=g.ctx.getImageData(0,0,390,844);rawReads.push({frameIndex:index+1,width:im.width,height:im.height,
          colorSpace:im.colorSpace||null,rgbaBase64:rgbaBase64(im.data)});}
        frames.push({...frame,index:index+1,group});
      }
      if(JSON.stringify(s)!==stateBefore||calls!==rngBefore||r.elapsed!==rendererElapsedBefore)fail('Six frames write state/RNG/elapsed');
      const invariant=frame=>({draw:{...frame.draw,renderToken:undefined},commands:frame.commands,states:frame.states,captures:frame.captures,
        barPaints:frame.barPaints,playerEntry:frame.playerEntry,originalPlayerCalls:frame.originalPlayerCalls,interceptedPlayerCalls:frame.interceptedPlayerCalls,
        transformCalls:frame.transformCalls,stackDepth:frame.stackDepth,stackUnderflow:frame.stackUnderflow,clipCalls:frame.clipCalls,
        engineBefore:frame.engineBefore,engineAfter:frame.engineAfter,rngBefore:frame.rngBefore,rngAfter:frame.rngAfter,
        rendererElapsedBefore:frame.rendererElapsedBefore,rendererElapsedAfter:frame.rendererElapsedAfter,camera:frame.camera,view:frame.view,hudBounds:frame.hudBounds,
        contextBefore:frame.contextBefore,contextAfter:frame.contextAfter,uiBefore:frame.uiBefore,uiAfter:frame.uiAfter,
        numbers:frame.numbers,labelRects:frame.labelRects,statusRects:frame.statusRects});
      const first=invariant(frames[0]),invariantDifferences=[];
      for(const frame of frames.slice(1)){const current=invariant(frame);for(const key of Object.keys(first))
        if(JSON.stringify(first[key])!==JSON.stringify(current[key]))invariantDifferences.push({frame:frame.index,key});}
      return {frames,snapshots,rawReads,sourceRegistry,readbackOrder,events,errors,invariantDifferences,renderChecks,consumerChecks,rngCalls:calls,
        sameStateRngRendererElapsed:true,rendererElapsedBefore,rendererElapsedAfter:r.elapsed,uiAtStart,
        sourcePlayerCalls:frames.map(f=>f.originalPlayerCalls),
        sameOriginalPlayerThenCandidateOrder:frames.every(f=>f.captures.player.length===1&&f.captures.candidate.length===1&&f.captures.player[0].sequence<f.captures.candidate[0].sequence),
        noProxyCanvasesCreated:true,mainCanvasNotReset:true,mainContextCreationUnchanged:true,
        pixelDecodeDeferredToNode:true,pngExportIsReadback:true,phaseOrderConfounded:true,actualBackendIdentified:false,
        initialMainClipPathStackDirectlyVerified:false,naturalFiveMinuteSurvival:false,partialEngineStepFixture:true,
        attackPreviewed:false,deathNotExercisedThisRun:true,statusBadgesEmpty:frames.every(f=>f.statusRects.length===0),
        rendererMode:r.battleSceneMode,artMode:r.battleArtMode};
    }finally{
      e.onEvent=saved.event;e.rng=saved.rng;r._drawEnemy=saved.enemy;r._drawPlayer=saved.player;r._drawHealthBar=saved.bar;
      r._enemyDamageOcclusionRects=saved.obstacles;r._drawCombatFeedback=saved.feedback;
      for(const name of Object.keys(saved.methods))g.ctx[name]=saved.methods[name];g.canvas.toDataURL=saved.canvasPng;g.ctx.getImageData=saved.getImageData;
      restorationChecked=e.onEvent===saved.event&&e.rng===saved.rng&&r._drawEnemy===saved.enemy&&r._drawPlayer===saved.player&&r._drawHealthBar===saved.bar
        &&r._enemyDamageOcclusionRects===saved.obstacles&&r._drawCombatFeedback===saved.feedback&&Object.keys(saved.methods).every(name=>g.ctx[name]===saved.methods[name])
        &&g.canvas.toDataURL===saved.canvasPng&&g.ctx.getImageData===saved.getImageData;
      if(!restorationChecked)throw Error('Hook restoration differs');
      recordingFrame=false;captureEnabled=false;g.draw();
    }
  }, { observerUrl, layoutUrl, feedbackUrl, depthUrl, pages, candidate, motion, layout, assetHashes:expected }), 'same depth main readback control', 20000);
  for(const snapshot of fixture.snapshots){const bytes=Buffer.from(snapshot.pngBase64,'base64');delete snapshot.pngBase64;
    const file=path.join(output,snapshot.name+'.png');fs.writeFileSync(file,bytes);
    snapshot.snapshot={file:rel(file),bytes:bytes.length,sha256:hash(bytes),kind:'explicit-evidence-only-same-depth-main-readback-control'};
    report.screenshots.push(snapshot.snapshot);}
  report.rawReads=[];
  for(const raw of fixture.rawReads){const bytes=Buffer.from(raw.rgbaBase64,'base64');delete raw.rgbaBase64;
    assert.equal(bytes.length,390*844*4);const file=path.join(output,'frame-'+raw.frameIndex+'-main-getImageData.rgba');fs.writeFileSync(file,bytes);
    raw.file=rel(file);raw.bytes=bytes.length;raw.sha256=hash(bytes);raw.format='RGBA8 row-major; exact unmodified main getImageData bytes';
    report.rawReads.push({...raw});}
  report.fixture=fixture;report.hookReferenceRestorationChecked=true;
  report.sourceHttpChecks=[];
  for(const image of fixture.sourceRegistry.filter(s=>s.src.startsWith(report.url))){const response=await page.request.get(image.src);
    const actual=response.ok()?hash(await response.body()):null;report.sourceHttpChecks.push({ref:image.ref,file:image.file,status:response.status(),
      expectedSha256:image.sha256,actualSha256:actual,pass:response.status()===200&&actual===image.sha256});}
  report.disposed=await page.evaluate(()=>{window.xiyou.dispose();return window.xiyou.disposed;});
  report.checks={realPointerUiBeforeFixture:report.uiEntry.screen==='game'&&!report.uiEntry.debug,
    sixSynchronousFrames:fixture.frames.length===6,oneOriginalPlayerExecutionEachMode:fixture.sourcePlayerCalls.every(c=>c===1),
    sameOriginalDepthOrder:fixture.sameOriginalPlayerThenCandidateOrder,
    fullRecordedFrameInvariantsEqual:fixture.invariantDifferences.length===0,
    allFullFrameChainsBalancedAndNoClip:fixture.frames.every(f=>f.stackDepth===0&&!f.stackUnderflow&&f.clipCalls===0&&f.commands[0]?.name==='setTransform'),
    allMethodsAndSourcesRecorded:fixture.frames.every(f=>f.commands.length>50&&f.commands.some(c=>c.name==='fillText')&&f.commands.some(c=>c.name==='fillRect'))
      &&fixture.sourceRegistry.length>=2&&report.sourceHttpChecks.every(s=>s.pass),
    mainDimensionsUnchanged:fixture.frames.every(f=>[f.contextBefore,f.contextAfter].every(c=>c.canvasWidth===390&&c.canvasHeight===844)),
    noProxyCanvasesCreated:fixture.noProxyCanvasesCreated,
    uiAndRafStatic:fixture.frames.every(f=>[f.uiBefore,f.uiAfter].every(u=>!u.running&&!u.frame&&!u.hidden&&!u.disposed&&!u.uiAnimation.active&&u.press===null)),
    controlledReadOrder:JSON.stringify(fixture.readbackOrder.map(x=>x.kind))===JSON.stringify(['main-toDataURL','main-toDataURL','main-toDataURL',
      'main-toDataURL','main-getImageData','main-toDataURL','main-getImageData','main-toDataURL','main-getImageData'])
      &&fixture.readbackOrder.every(x=>!x.duringRender),
    stateRngRendererElapsedUnchanged:fixture.sameStateRngRendererElapsed,
    rawReadBytesSaved:report.rawReads.length===3&&report.rawReads.every(x=>x.bytes===390*844*4),
    noProductionReferences:report.runtimeReferences.length===0,fixtureErrorsEmpty:fixture.errors.length===0,
    noErrorsOrExternalNetwork:!report.pageErrors.length&&!report.consoleErrors.length&&!report.failedRequests.length&&!report.httpErrors.length&&!report.externalRequests.length};
} catch (error) { report.error = String(error.stack || error); }
finally {
  if (context) try { await bounded(context.close(), 'context close'); report.contextClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  if (browser) try { await bounded(browser.close(), 'browser close'); report.browserClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  if (server) try { const stopped = new Promise(resolve => server.once('close', resolve)); server.kill(); await bounded(stopped, 'server close'); report.serverClosed = true; } catch (e) { report.cleanupError = String(e); report.result = 'FAIL'; }
  report.protectedAfter = fingerprint(); report.protectedUnchanged = JSON.stringify(report.protectedBefore) === JSON.stringify(report.protectedAfter);
  if (!report.protectedUnchanged) report.result = 'FAIL'; report.finishedAt = new Date().toISOString();
}
// Browser is closed before decoded-PNG pixel acceptance.
try{
  const directory=process.env.CODEX_NODE_MODULES||path.join(process.env.USERPROFILE||'','.cache','codex-runtimes','codex-primary-runtime','dependencies','node','node_modules');
  const {PNG}=await import(pathToFileURL(path.join(directory,'pngjs','lib','png.js')));
  const decoded=report.screenshots.slice(1).map(s=>PNG.sync.read(fs.readFileSync(path.join(root,s.file))));
  const diff=(a,b)=>{assert.equal(a.length,b.length);let changedPixels=0,maxAbsChannelDelta=0,minX=390,minY=844,maxX=-1,maxY=-1;
    const maxDeltaDistribution={exactly1:0,exactly2:0,atLeast3:0},changedChannelPixels=[0,0,0,0];
    for(let i=0;i<a.length;i+=4){let max=0;for(let k=0;k<4;k++){const d=Math.abs(a[i+k]-b[i+k]);if(d)changedChannelPixels[k]++;max=Math.max(max,d);}
      if(!max)continue;changedPixels++;maxAbsChannelDelta=Math.max(maxAbsChannelDelta,max);const x=(i/4)%390,y=Math.floor(i/4/390);
      minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
      maxDeltaDistribution[max===1?'exactly1':max===2?'exactly2':'atLeast3']++;}
    return{changedPixels,maxAbsChannelDelta,bboxInclusive:changedPixels?{minX,maxX,minY,maxY}:null,maxDeltaDistribution,changedChannelPixels};};
  assert.equal(decoded.length,6);assert.ok(decoded.every(p=>p.width===390&&p.height===844));
  report.pixelComparisons={adjacent:decoded.slice(1).map((p,index)=>({from:index+1,to:index+2,...diff(decoded[index].data,p.data)})),
    pngVsGetImageData:report.rawReads.map(raw=>({frameIndex:raw.frameIndex,...diff(decoded[raw.frameIndex-1].data,fs.readFileSync(path.join(root,raw.file)))}))};
  report.checks.allSixPngPixelsStable=report.pixelComparisons.adjacent.every(d=>d.changedPixels===0);
  report.checks.sameFramePngMatchesRawGetImageData=report.pixelComparisons.pngVsGetImageData.every(d=>d.changedPixels===0);
  report.pixelAnalysisAfterBrowserClosed=report.contextClosed===true&&report.browserClosed===true&&report.serverClosed===true;
  report.result=!report.error&&!report.cleanupError&&Object.values(report.checks).every(Boolean)&&report.protectedUnchanged&&report.pixelAnalysisAfterBrowserClosed?
    'REVIEW_EVIDENCE_ONLY_SAME_DEPTH_MAIN_READBACK_REPEATABILITY':'FAIL';
}catch(error){report.pixelAnalysisError=String(error.stack||error);report.result='FAIL';}
report.analysisFinishedAt=new Date().toISOString();fs.writeFileSync(path.join(output,reportName),JSON.stringify(report,null,2));
console.log(JSON.stringify({file:rel(path.join(output,reportName)),result:report.result,checks:report.checks,
  comparisons:report.pixelComparisons,screenshots:report.screenshots.length,rawReads:report.rawReads?.length,
  protectedFiles:Object.keys(expected).length,protectedUnchanged:report.protectedUnchanged,
  browserClosed:report.browserClosed,serverClosed:report.serverClosed,error:report.error,pixelAnalysisError:report.pixelAnalysisError},null,2));
if(report.result==='FAIL')process.exitCode=1;

