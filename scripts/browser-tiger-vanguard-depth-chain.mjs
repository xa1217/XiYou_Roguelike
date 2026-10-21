import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlaywright, browserLaunchOptions } from './browser-runtime.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), generatedAt = new Date().toISOString();
const output = path.join(root, 'evidence/current/tiger-vanguard/depth-chain', generatedAt.replaceAll(':','-').replaceAll('.','-'));
fs.mkdirSync(output, { recursive: true });
const reportName = 'browser.json', screenshotPrefix = '', hash = b => crypto.createHash('sha256').update(b).digest('hex');
const rel = f => path.relative(root, f).replaceAll('\\', '/'), read = f => JSON.parse(fs.readFileSync(path.join(root, f)));
const previousFile = 'evidence/current/tiger-vanguard/depth-control/2026-10-14T06-20-05-385Z/browser.json';
const previous = read(previousFile), candidateFile = previous.candidate.file;
const candidate = read(candidateFile), motion = read(previous.motionDraft.file), layout = read(previous.layout.file);
const priorDirectory = path.posix.dirname(previousFile);
const priorCloseout = read(`${priorDirectory}/closeout.json`);
const extra = ['scripts/browser-tiger-vanguard-chain-png-control.mjs', 'scripts/browser-tiger-vanguard-depth-chain.mjs', ...fs.readdirSync(path.join(root, priorDirectory)).map(f => `${priorDirectory}/${f}`)];
const expected = { ...previous.protectedAfter,
  ...Object.fromEntries(extra.map(f => [f, priorCloseout.sha256[f] || hash(fs.readFileSync(path.join(root, f)))])) };
const fingerprint = () => Object.fromEntries(Object.keys(expected).map(f => [f, hash(fs.readFileSync(path.join(root, f)))]));
const report = { generatedAt: new Date().toISOString(), result: 'FAIL',
  scope: 'Evidence-only tiger-vanguard depth-chain diagnostic A1/A2/B1/B2. A uses original player→candidate→feedback; B defers one accepted player draw to feedback for candidate→player→feedback. Each frame uses the full original transform call chain and three reset transparent proxies; no getter→setter CTM refill, no extra main.getImageData, no production/art/runtime/ZIP/deploy changes. The four synchronous frames and 16 PNGs are decoded only after browser closure. This is diagnostic evidence only and cannot grant motion, readability, depth, FPS, public or release approval.',
  url: 'http://127.0.0.1:8088/', priorEvidence: { file: previousFile, sha256: expected[previousFile] },
  candidate: previous.candidate, motionDraft: previous.motionDraft,
  layout: previous.layout, scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))), protectedBefore: fingerprint(),
  screenshots: [], pageErrors: [], consoleErrors: [], consoleWarnings: [], failedRequests: [], httpErrors: [], externalRequests: [], runtimeReferences: [],
  humanMotionReviewed: false, rootApproved: false, healthBarLayoutApproved: false, playerReadabilityApproved: false,
  viewportEdgeApproved: false, statusBadgeGeometryUpdated: false, deathFeedbackObstaclesIntegrated: false,
  extremeMissingBarAt512Approved: false, attackEventSupported: false, attackPreviewed: false, runtimeApproved: false,
  highFrameApproved: false, fpsAcceptance: false, publicPass: false, releaseReady: false,
  proxyEquivalentToActualMainPaintSupportProven: false };
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
    for (const name of ['tiger-vanguard-chain-png-control', candidateFile, previous.motionDraft.file, ...candidate.pages.map(p => p.file)])
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
  page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); else if (m.type() === 'warning') report.consoleWarnings.push(m.text()); });
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
    const proxies=Object.fromEntries(['playerLayer','playerSprite','candidate'].map(name=>{
      const canvas=document.createElement('canvas');return[name,{canvas,ctx:null}];}));
    for(const name of methodNames)if(typeof g.ctx[name]!=='function')throw Error('REQUIRED_MAIN_CANVAS_METHOD_MISSING: '+name);
    const saved={event:e.onEvent,rng:e.rng,enemy:r._drawEnemy,player:r._drawPlayer,bar:r._drawHealthBar,obstacles:r._enemyDamageOcclusionRects,
      feedback:r._drawCombatFeedback,canvasPng:g.canvas.toDataURL,getImageData:g.ctx.getImageData,
      methods:Object.fromEntries(methodNames.filter(k=>typeof g.ctx[k]==='function').map(k=>[k,g.ctx[k]]))};
    const events=[],errors=[],draws=[],snapshots=[],readbackOrder=[],mainReadGuardCalls=[],sourceRegistry=[],sourceRefs=new WeakMap(),frames=[];
    let calls=0,renderToken=0,renderChecks=0,consumerChecks=0,binding,geometryCache=new WeakMap(),captureEnabled=false,recordingFrame=false,
      inPlayer=false,inCandidate=false,inFeedback=false,inAnnotation=false,commands=[],states=[],stateIds,originalPlayerCalls=0,interceptedPlayerCalls=0,
      playerEntry=null,barPaints=[],captures,sequence=0,stackDepth=0,stackUnderflow=false,clipCalls=0,transformCalls=0,readSequence=0,mirrorEnabled=false,proxyTrace=[],matrixChecks=[],proxyResets=[],proxyStack={},
      depthMode=false,pending=null,depthFlushed=false,depthTransaction=null,depthGate=null,depthOrder='A';
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
    const resetProxies=()=>{proxyTrace=[];matrixChecks=[];proxyResets=[];proxyStack={};
      if(!mirrorEnabled)return;
      for(const [key,p]of Object.entries(proxies)){
        p.canvas.width=390;p.canvas.height=844;p.ctx=p.canvas.getContext('2d',{willReadFrequently:true});
        if(!p.ctx)fail('PROXY_CONTEXT_MISSING: '+key);
        for(const method of methodNames)if(typeof p.ctx[method]!=='function')fail('PROXY_METHOD_MISSING: '+key+':'+method);
        proxyStack[key]=0;proxyResets.push({kind:key,width:p.canvas.width,height:p.canvas.height,matrix:matrix(p.ctx),
          attributes:p.ctx.getContextAttributes(),styles:styles(p.ctx),dash:p.ctx.getLineDash()});
      }
    };
    const proxyCall=(key,name,args,commandIndex,phase)=>{
      const p=proxies[key];try{const before=matrix(p.ctx),value=p.ctx[name](...args),after=matrix(p.ctx);
        proxyTrace.push({kind:key,name,args:name==='drawImage'?imageArgs(args[0],primitiveArgs(args.slice(1))).args:
          name==='setLineDash'?{dash:primitiveArgs(args[0])}:primitiveArgs(args),commandIndex,phase,before,after});
        if(name==='save')proxyStack[key]++;else if(name==='restore'){proxyStack[key]--;if(proxyStack[key]<0)fail('PROXY_STACK_UNDERFLOW: '+key);}
        return value;
      }catch(error){errors.push('PROXY_CALL_FAILED: '+key+':'+name+': '+String(error));throw error;}
    };
    const checkProxyMatrix=(key,main,commandIndex,phase)=>{const actual=matrix(proxies[key].ctx),equal=JSON.stringify(main)===JSON.stringify(actual);
      matrixChecks.push({kind:key,main,proxy:actual,commandIndex,phase,equal});if(!equal)fail('PROXY_MATRIX_MISMATCH: '+key+':'+phase);
    };
    const replayPaint=(key,name,args,commandIndex,beforeState)=>{
      const current=states[beforeState],p=proxies[key];checkProxyMatrix(key,current.matrix,commandIndex,'before-paint');
      try{for(const [k,v]of Object.entries(current.styles))p.ctx[k]=v;p.ctx.setLineDash(current.dash);}
      catch(error){errors.push('PROXY_STYLE_SYNC_FAILED: '+key+': '+String(error));throw error;}
      const installed={styles:styles(p.ctx),dash:p.ctx.getLineDash()};
      if(JSON.stringify(installed)!==JSON.stringify({styles:current.styles,dash:current.dash}))fail('PROXY_PAINT_STYLE_MISMATCH: '+key);
      proxyTrace.push({kind:key,phase:'paint-style-install',commandIndex,...installed});
      proxyCall(key,name,args,commandIndex,'paint');
    };
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
      const commandIndex=commands.length-1;
      if(mirrorEnabled){
        if(name==='clip')fail('UNSUPPORTED_PROXY_CLIP');
        if(transformNames.has(name))for(const key of Object.keys(proxies)){
          proxyCall(key,name,args,commandIndex,'transform');checkProxyMatrix(key,states[command.afterState].matrix,commandIndex,'after-transform');
        }
        else if(inPlayer){
          if(name==='measureText')fail('UNSUPPORTED_PLAYER_MEASURE_TEXT');
          const prior=commands.slice(0,-1).filter(c=>c.segment==='player'&&!transformNames.has(c.name));
          if(!prior.length&&name!=='beginPath')fail('PLAYER_PROXY_PATH_MUST_START_WITH_BEGIN_PATH');
          replayPaint('playerLayer',name,args,commandIndex,beforeState);
        }
      }
      if(name==='drawImage'&&(inPlayer&&args[0]===r.heroImages?.[s.character.id]||inCandidate)){
        const kind=inPlayer?'player':'candidate',record={kind,imageRef:normalized.ref,args:args.slice(1),state:beforeState,sequence:++sequence};
        captures[kind].push(record);
        if(mirrorEnabled)replayPaint(kind==='player'?'playerSprite':'candidate','drawImage',args,commandIndex,beforeState);
      }
      return returned;
    };
    g.canvas.toDataURL=function(...args){if(captureEnabled)readbackOrder.push({sequence:++readSequence,frameIndex:frames.length+1,kind:'main-toDataURL',args});
      try{return saved.canvasPng.apply(this,args);}catch(error){errors.push('MAIN_PNG_EXPORT_FAILED: '+String(error));throw error;}};
    g.ctx.getImageData=function(...args){mainReadGuardCalls.push({frameIndex:frames.length+1,captureEnabled,duringRender:recordingFrame,args});
      fail('FORBIDDEN_EXTRA_MAIN_GET_IMAGE_DATA');};
    e.rng=()=>{calls++;return saved.rng();};
    e.onEvent=event=>{const before=JSON.stringify(s),rng=calls;try{const accepted=preview.consume(event,s);events.push({type:event.type,target:event.target||null,
      accepted,sourceId:event.sourceId||null,at:s.time});if(JSON.stringify(s)!==before||calls!==rng)fail('Consumer writes state/RNG');consumerChecks++;
    }catch(error){errors.push(String(error));}finally{saved.event(event);}};
    const screenBox=box=>{const z=r._zoom(s.player);return{left:195+(box.left-r.camera.x)*z,right:195+(box.right-r.camera.x)*z,
      top:422+(box.top-r.camera.y)*z,bottom:422+(box.bottom-r.camera.y)*z};};
    const executePlayer=(ctx,args)=>{originalPlayerCalls++;inPlayer=true;try{return saved.player.call(r,ctx,...args);}finally{inPlayer=false;}};
    r._drawPlayer=function(ctx,...args){interceptedPlayerCalls++;
      const gate=planVanguardPlayerDepth(s,args[0],binding,renderToken,depthMode);
      const single=Array.isArray(this._enemyDrawList)&&this._enemyDrawList.length===1&&this._enemyDrawList[0]===binding.enemy;
      if(captureEnabled){
        if(depthMode&&(!gate.defer||!single))fail('CONTROL_OUTSIDE_EXACT_SINGLE_CONTACT_FIXTURE');
        if(!depthMode&&gate.defer)fail('ORIGINAL_MODE_UNEXPECTED_DEPTH_GATE');
        playerEntry={matrix:matrix(ctx),styles:styles(ctx),dash:ctx.getLineDash(),contactGate:{...gate,renderToken:undefined},depthMode,order:depthOrder};
      }
      if(depthMode&&gate.defer&&single){
        if(pending)fail('DUPLICATE_DEFERRED_PLAYER_CALL');
        pending={ctx,args,entry:{matrix:matrix(ctx),styles:styles(ctx),dash:ctx.getLineDash(),gate,renderToken,order:depthOrder}};
        return;
      }
      return executePlayer(ctx,args);};
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
    r._drawCombatFeedback=function(ctx,state,enemies,options){
      if(pending){
        const queued=pending;pending=null;const before=matrix(ctx),beforeStyles=styles(ctx),beforeDash=ctx.getLineDash();
        const gate=planVanguardPlayerDepth(s,queued.args[0],binding,renderToken,true);
        const valid=queued.entry.renderToken===renderToken&&gate.defer&&Array.isArray(enemies)&&enemies.length===1&&enemies[0]===binding.enemy
          &&JSON.stringify(before)===JSON.stringify(queued.entry.matrix);
        if(!valid)fail('DEFERRED_DRAW_REJECTED_LATE_OR_CTM_MISMATCH');
        ctx.save();
        try{
          for(const [k,v] of Object.entries(queued.entry.styles))ctx[k]=v;
          ctx.setLineDash(queued.entry.dash);
          depthTransaction={tag:'one-tagged-depth-style-transaction',before:beforeStyles,queued:styles(ctx),beforeDash,queuedDash:ctx.getLineDash(),beforeCtm:before,queuedCtm:matrix(ctx)};
          executePlayer(ctx,queued.args);
          depthFlushed=true;
        }finally{ctx.restore();}
        const restored={matrix:matrix(ctx),styles:styles(ctx),dash:ctx.getLineDash()};
        if(JSON.stringify(restored.matrix)!==JSON.stringify(before)||JSON.stringify(restored.styles)!==JSON.stringify(beforeStyles)||JSON.stringify(restored.dash)!==JSON.stringify(beforeDash))
          fail('DEFERRED_PLAYER_TRANSACTION_LEAK');
        depthTransaction.restored=restored;
      }
      inFeedback=true;try{return saved.feedback.call(this,ctx,state,enemies,options);}finally{inFeedback=false;}};
    const draw=()=>{const engineBefore=JSON.stringify(s),rngBefore=calls,elapsedBefore=r.elapsed,contextBefore=contextSnapshot(),uiBefore=uiSnapshot();
      renderToken++;geometryCache=new WeakMap();commands=[];states=[];stateIds=new Map();originalPlayerCalls=0;interceptedPlayerCalls=0;playerEntry=null;pending=null;depthFlushed=false;depthTransaction=null;depthGate=null;
      barPaints=[];captures={player:[],candidate:[]};sequence=0;stackDepth=0;stackUnderflow=false;clipCalls=0;transformCalls=0;resetProxies();g.renderDt=0;
      recordingFrame=captureEnabled;try{g.draw();}finally{recordingFrame=false;}
      preview.reconcile(s);if(JSON.stringify(s)!==engineBefore||calls!==rngBefore||r.elapsed!==elapsedBefore)fail('Draw writes state/RNG/renderer elapsed');renderChecks++;
      if(pending)fail('DEFERRED_DRAW_NOT_CONSUMED');
      const frame={renderToken,draw:draws.at(-1),commands,states,captures,barPaints,playerEntry,originalPlayerCalls,interceptedPlayerCalls,
        transformCalls,stackDepth,stackUnderflow,clipCalls,engineBefore,engineAfter:JSON.stringify(s),rngBefore,rngAfter:calls,
        rendererElapsedBefore:elapsedBefore,rendererElapsedAfter:r.elapsed,camera:{...r.camera},view:structuredClone(r._view),hudBounds:structuredClone(r._hudScreenBounds),
        contextBefore,contextAfter:contextSnapshot(),uiBefore,uiAfter:uiSnapshot(),numbers:structuredClone(s.damageNumbers),
        labelRects:structuredClone(r._damageLabelRects),statusRects:structuredClone(r._statusBadgeRects)};
      if(captureEnabled&&(stackDepth!==0||stackUnderflow||clipCalls||commands[0]?.name!=='setTransform'))fail('INVALID_FULL_FRAME_CHAIN');
      const ctx=g.ctx;recordingFrame=captureEnabled;inAnnotation=true;
      try{ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#2a1729';ctx.fillRect(0,0,390,24);
        ctx.fillStyle='#ffe6b5';ctx.font='bold 9px sans-serif';ctx.fillText('EVIDENCE ONLY / SAME DEPTH / CHAIN PNG CONTROL',5,15);ctx.restore();
      }finally{recordingFrame=false;inAnnotation=false;}
      Object.assign(frame,{contextAfter:contextSnapshot(),uiAfter:uiSnapshot(),transformCalls,stackDepth,stackUnderflow,clipCalls});
      if(captureEnabled&&(stackDepth!==0||stackUnderflow||clipCalls))fail('INVALID_POST_ANNOTATION_CHAIN');
      Object.assign(frame,{proxyTrace,matrixChecks,proxyResets,proxyStack,mirrorEnabled,depthMode,depthFlushed,depthTransaction,depthOrder});
      if(mirrorEnabled&&Object.values(proxyStack).some(n=>n!==0))fail('UNBALANCED_PROXY_STACK');
      return frame;};
    const shot=(name,canvas=g.canvas,proxyKind=null)=>{
      if(proxyKind)readbackOrder.push({sequence:++readSequence,frameIndex:frames.length+1,kind:'proxy-toDataURL',proxyKind,args:['image/png']});
      try{snapshots.push({name,frameIndex:frames.length+1,proxyKind,pngBase64:canvas.toDataURL('image/png').split(',')[1]});}
      catch(error){errors.push('PNG_EXPORT_FAILED: '+name+': '+String(error));throw error;}
    };
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
      // Four synchronous frames in one evaluate: A1/A2 keep original player→candidate order;
      // B1/B2 defer exactly one accepted player draw so candidate→player is observed. Every
      // frame has the same full transform trace and three reset transparent proxies.
      for(const spec of [{id:'A1',depth:false},{id:'A2',depth:false},{id:'B1',depth:true},{id:'B2',depth:true}]){
        depthMode=spec.depth;depthOrder=spec.depth?'B':'A';mirrorEnabled=true;const frame=draw();
        shot(spec.id+'-main');
        for(const [key,p]of Object.entries(proxies))shot(spec.id+'-'+key+'-proxy',p.canvas,key);
        frames.push({...frame,id:spec.id,index:frames.length+1,group:spec.depth?'deferred-once':'original'});
      }
      if(JSON.stringify(s)!==stateBefore||calls!==rngBefore||r.elapsed!==rendererElapsedBefore)fail('Four frames write state/RNG/elapsed');
      const invariant=frame=>({draw:{...frame.draw,renderToken:undefined},commands:frame.commands,states:frame.states,captures:frame.captures,
        barPaints:frame.barPaints,playerEntry:frame.playerEntry,originalPlayerCalls:frame.originalPlayerCalls,interceptedPlayerCalls:frame.interceptedPlayerCalls,
        transformCalls:frame.transformCalls,stackDepth:frame.stackDepth,stackUnderflow:frame.stackUnderflow,clipCalls:frame.clipCalls,
        engineBefore:frame.engineBefore,engineAfter:frame.engineAfter,rngBefore:frame.rngBefore,rngAfter:frame.rngAfter,
        rendererElapsedBefore:frame.rendererElapsedBefore,rendererElapsedAfter:frame.rendererElapsedAfter,camera:frame.camera,view:frame.view,hudBounds:frame.hudBounds,
        contextBefore:frame.contextBefore,contextAfter:frame.contextAfter,uiBefore:frame.uiBefore,uiAfter:frame.uiAfter,
        numbers:frame.numbers,labelRects:frame.labelRects,statusRects:frame.statusRects});
      const invariantDifferences=[], modeInvariantDifferences=[];
      for(const [left,right] of [[frames[0],frames[1]],[frames[2],frames[3]]]){const a=invariant(left),b=invariant(right);
        for(const key of Object.keys(a))if(JSON.stringify(a[key])!==JSON.stringify(b[key]))modeInvariantDifferences.push({pair:[left.id,right.id],key});}
      invariantDifferences.push(...modeInvariantDifferences);
      const crossTraceDifferences=[];
      const normalizedTrace=frame=>frame.commands.map(c=>({ ...c, state:frame.states[c.state], afterState:c.afterState===undefined?undefined:frame.states[c.afterState] }));
      for(const [a,b] of [[frames[0],frames[2]],[frames[0],frames[3]],[frames[1],frames[2]],[frames[1],frames[3]]]){
        const ac=normalizedTrace(a),bc=normalizedTrace(b),limit=Math.max(ac.length,bc.length);
        for(let i=0;i<limit;i++)if(JSON.stringify(ac[i])!==JSON.stringify(bc[i]))crossTraceDifferences.push({pair:[a.id,b.id],index:i,a:ac[i]||null,b:bc[i]||null});
      }
      const crossNonPlayerDifferences=[];
      for(const [a,b] of [[frames[0],frames[2]],[frames[0],frames[3]],[frames[1],frames[2]],[frames[1],frames[3]]]){
        const strip=frame=>normalizedTrace(frame).filter(c=>c.segment!=='player'&&!(c.segment==='feedback'&&['save','restore'].includes(c.name)));
        const ac=strip(a),bc=strip(b),limit=Math.max(ac.length,bc.length);
        for(let i=0;i<limit;i++)if(JSON.stringify(ac[i])!==JSON.stringify(bc[i]))crossNonPlayerDifferences.push({pair:[a.id,b.id],index:i,a:ac[i]||null,b:bc[i]||null});
      }
      return {frames,snapshots,sourceRegistry,readbackOrder,mainReadGuardCalls,events,errors,invariantDifferences,renderChecks,consumerChecks,rngCalls:calls,
        modeInvariantDifferences,crossTraceDifferences,crossNonPlayerDifferences,
        sameStateRngRendererElapsed:true,rendererElapsedBefore,rendererElapsedAfter:r.elapsed,uiAtStart,
        sourcePlayerCalls:frames.map(f=>f.originalPlayerCalls),
        sameOriginalPlayerThenCandidateOrder:frames.filter(f=>f.depthOrder==='A').every(f=>f.captures.player.length===1&&f.captures.candidate.length===1&&f.captures.player[0].sequence<f.captures.candidate[0].sequence),
        candidateThenOriginalPlayerOrder:frames.filter(f=>f.depthOrder==='B').every(f=>f.captures.player.length===1&&f.captures.candidate.length===1&&f.captures.player[0].sequence>f.captures.candidate[0].sequence),
        acceptedDeferredDepth:frames.filter(f=>f.depthOrder==='B').every(f=>f.depthFlushed&&f.depthTransaction?.tag==='one-tagged-depth-style-transaction'),
        proxyCanvasCount:3,proxyCreationRequestedWillReadFrequently:true,mainCanvasNotReset:true,mainContextCreationUnchanged:true,
        mainCtmAndStylesNeverInstalledByMirror:true,fixedMainAnnotationIsRecordedException:true,
        mainReadGuardScope:'After source decode and hook installation until hook restoration; excludes cleanup draw/dispose',
        proxyEquivalentToActualMainPaintSupportProven:false,
        depthModes:frames.map(f=>({id:f.id,depthMode:f.depthMode,depthFlushed:f.depthFlushed,order:f.depthOrder,transaction:f.depthTransaction})),
        sameModePairs:[['A1','A2'],['B1','B2']],crossModePairs:[['A1','B1'],['A1','B2'],['A2','B1'],['A2','B2']],
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
      recordingFrame=false;captureEnabled=false;mirrorEnabled=false;for(const p of Object.values(proxies)){p.canvas.width=1;p.canvas.height=1;}g.draw();
    }
  }, { observerUrl, layoutUrl, feedbackUrl, depthUrl, pages, candidate, motion, layout, assetHashes:expected }), 'same depth chain PNG mirror baseline', 20000);
  for(const snapshot of fixture.snapshots){const bytes=Buffer.from(snapshot.pngBase64,'base64');delete snapshot.pngBase64;
    const file=path.join(output,snapshot.name+'.png');fs.writeFileSync(file,bytes);
    snapshot.snapshot={file:rel(file),bytes:bytes.length,sha256:hash(bytes),frameIndex:snapshot.frameIndex,proxyKind:snapshot.proxyKind,kind:'explicit-evidence-only-same-depth-chain-png-control'};
    report.screenshots.push(snapshot.snapshot);}
  report.fixture=fixture;report.hookReferenceRestorationChecked=true;
  report.sourceHttpChecks=[];
  for(const image of fixture.sourceRegistry.filter(s=>s.src.startsWith(report.url))){const response=await page.request.get(image.src);
    const actual=response.ok()?hash(await response.body()):null;report.sourceHttpChecks.push({ref:image.ref,file:image.file,status:response.status(),
      expectedSha256:image.sha256,actualSha256:actual,pass:response.status()===200&&actual===image.sha256});}
  report.disposed=await page.evaluate(()=>{window.xiyou.dispose();return window.xiyou.disposed;});
  report.checks={realPointerUiBeforeFixture:report.uiEntry.screen==='game'&&!report.uiEntry.debug,
    fourSynchronousFrames:fixture.frames.length===4&&fixture.frames.map(f=>f.id).join(',')==='A1,A2,B1,B2',
    oneOriginalPlayerExecutionEachMode:fixture.frames.every(f=>f.originalPlayerCalls===1&&f.interceptedPlayerCalls===1),
    sameOriginalDepthOrder:fixture.sameOriginalPlayerThenCandidateOrder&&fixture.candidateThenOriginalPlayerOrder,
    acceptedDeferredDepth:fixture.acceptedDeferredDepth,
    fullRecordedSameModeInvariantsEqual:fixture.modeInvariantDifferences.length===0,
    crossModeNonPlayerTraceExact:fixture.crossNonPlayerDifferences.length===0,
    allFullFrameChainsBalancedAndNoClip:fixture.frames.every(f=>f.stackDepth===0&&!f.stackUnderflow&&f.clipCalls===0&&f.commands[0]?.name==='setTransform'),
    allMethodsAndSourcesRecorded:fixture.frames.every(f=>f.commands.length>50&&f.commands.some(c=>c.name==='fillText')&&f.commands.some(c=>c.name==='fillRect'))
      &&fixture.sourceRegistry.length>=2&&report.sourceHttpChecks.every(s=>s.pass),
    mainDimensionsUnchanged:fixture.frames.every(f=>[f.contextBefore,f.contextAfter].every(c=>c.canvasWidth===390&&c.canvasHeight===844)),
    threeTransparentProxiesOnly:fixture.proxyCanvasCount===3,
    noExtraMainGetImageData:fixture.mainReadGuardCalls.length===0,
    repeatedProxyTraceExact:[[fixture.frames[0],fixture.frames[1]],[fixture.frames[2],fixture.frames[3]]].every(([a,b])=>['proxyTrace','matrixChecks','proxyResets','proxyStack']
      .every(key=>JSON.stringify(a[key])===JSON.stringify(b[key]))),
    mirroredMatricesExact:fixture.frames.every(f=>!f.mirrorEnabled?f.matrixChecks.length===0:
      f.matrixChecks.length===3*f.transformCalls+f.commands.filter(c=>c.segment==='player'&&!['save','restore','setTransform','resetTransform','translate','scale','rotate','transform'].includes(c.name)).length+2
      &&f.matrixChecks.every(m=>m.equal)),
    proxiesResetAndBalanced:fixture.frames.every(f=>!f.mirrorEnabled?f.proxyResets.length===0:
      f.proxyResets.length===3&&f.proxyResets.every(p=>p.width===390&&p.height===844&&p.attributes.willReadFrequently===true
        &&JSON.stringify(p.matrix)===JSON.stringify({a:1,b:0,c:0,d:1,e:0,f:0}))&&Object.values(f.proxyStack).every(n=>n===0)),
    exactPlayerReplayCounts:fixture.frames.every(f=>f.commands.filter(c=>c.segment==='player').length===58
      &&f.commands.filter(c=>c.segment==='player'&&!['save','restore','setTransform','resetTransform','translate','scale','rotate','transform'].includes(c.name)).length===50
      &&(!f.mirrorEnabled||f.proxyTrace.filter(c=>c.phase==='paint'&&c.kind==='playerLayer').length===50
        &&f.proxyTrace.filter(c=>c.phase==='paint'&&c.kind==='playerSprite').length===1&&f.proxyTrace.filter(c=>c.phase==='paint'&&c.kind==='candidate').length===1)),
    uiAndRafStatic:fixture.frames.every(f=>[f.uiBefore,f.uiAfter].every(u=>!u.running&&!u.frame&&!u.hidden&&!u.disposed&&!u.uiAnimation.active&&u.press===null)),
    controlledPngReadOrder:JSON.stringify(fixture.readbackOrder.map(x=>x.kind+(x.proxyKind?':'+x.proxyKind:'')))===
      JSON.stringify(Array.from({length:4},()=>['main-toDataURL','proxy-toDataURL:playerLayer','proxy-toDataURL:playerSprite','proxy-toDataURL:candidate']).flat()),
    stateRngRendererElapsedUnchanged:fixture.sameStateRngRendererElapsed,
    allFrameProxyPngsSaved:fixture.snapshots.filter(x=>x.proxyKind).length===12,
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
  const decodedEntries=report.screenshots.slice(1).map(s=>({...s,png:PNG.sync.read(fs.readFileSync(path.join(root,s.file)))}));
  const decoded=decodedEntries.filter(s=>!s.proxyKind).map(s=>s.png);
  const diff=(a,b)=>{assert.equal(a.length,b.length);let changedPixels=0,maxAbsChannelDelta=0,minX=390,minY=844,maxX=-1,maxY=-1;
    const maxDeltaDistribution={exactly1:0,exactly2:0,atLeast3:0},changedChannelPixels=[0,0,0,0];
    for(let i=0;i<a.length;i+=4){let max=0;for(let k=0;k<4;k++){const d=Math.abs(a[i+k]-b[i+k]);if(d)changedChannelPixels[k]++;max=Math.max(max,d);}
      if(!max)continue;changedPixels++;maxAbsChannelDelta=Math.max(maxAbsChannelDelta,max);const x=(i/4)%390,y=Math.floor(i/4/390);
      minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
      maxDeltaDistribution[max===1?'exactly1':max===2?'exactly2':'atLeast3']++;}
    return{changedPixels,maxAbsChannelDelta,bboxInclusive:changedPixels?{minX,maxX,minY,maxY}:null,maxDeltaDistribution,changedChannelPixels};};
  assert.equal(decoded.length,4);assert.ok(decoded.every(p=>p.width===390&&p.height===844));
  assert.equal(decodedEntries.length,16);assert.ok(decodedEntries.every(p=>p.png.width===390&&p.png.height===844));
  const mainById=Object.fromEntries(decodedEntries.filter(s=>!s.proxyKind).map(s=>[s.name.replace(/-main$/,''),s.png]));
  const proxyByKind=Object.fromEntries(['playerLayer','playerSprite','candidate'].map(key=>[key,
    Object.fromEntries(decodedEntries.filter(s=>s.proxyKind===key).map(s=>[s.name.replace(new RegExp(`-${key}-proxy$`),''),s.png]))]));
  const sameMode=(left,right)=>diff(mainById[left].data,mainById[right].data);
  const crossPairs=[['A1','B1'],['A1','B2'],['A2','B1'],['A2','B2']];
  const cross=Object.fromEntries(crossPairs.map(([left,right])=>[`${left}/${right}`,diff(mainById[left].data,mainById[right].data)]));
  const exact=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const unionAlphaChanged=(left,right)=>{const a=mainById[left],b=mainById[right],players=proxyByKind.playerLayer;let changedOutside=0;
    const mask=players[left].data,maskB=players[right].data;for(let i=0;i<a.data.length;i+=4){let changed=false;for(let k=0;k<4;k++)if(a.data[i+k]!==b.data[i+k]){changed=true;break;}
      if(changed&&mask[i+3]===0&&maskB[i+3]===0)changedOutside++;}return changedOutside;};
  const overlap=(left,right)=>{const a=proxyByKind.playerSprite[left].data,b=proxyByKind.candidate[right].data;let n=0;for(let i=0;i<a.length;i+=4)if(a[i+3]>8&&b[i+3]>8)n++;return n;};
  report.pixelComparisons={sameMode:{A1_A2:sameMode('A1','A2'),B1_B2:sameMode('B1','B2')},cross,
    proxies:Object.fromEntries(['playerLayer','playerSprite','candidate'].map(key=>{const frames=['A1','A2','B1','B2'];return[key,{pairs:frames.slice(1).map((id,i)=>({from:frames[i],to:id,...diff(proxyByKind[key][frames[i]].data,proxyByKind[key][id].data)})),alphaPositivePixels:frames.map(id=>({id,count:Array.from(proxyByKind[key][id].data).filter((v,i)=>i%4===3&&v>0).length}))}]})),
    crossMapsExact:crossPairs.slice(1).every(pair=>exact(cross['A1/B1'],cross[`${pair[0]}/${pair[1]}`])),outsidePlayerAlphaUnionChangedPixels:unionAlphaChanged('A1','B1'),bodyOverlapAlpha8:overlap('A1','B1')};
  report.checks.sameModeChangedPixelsZero=report.pixelComparisons.sameMode.A1_A2.changedPixels===0&&report.pixelComparisons.sameMode.B1_B2.changedPixels===0;
  report.checks.crossDifferenceMapsExact=report.pixelComparisons.crossMapsExact;
  report.checks.crossChangedPixelsPositive=Object.values(report.pixelComparisons.cross).every(d=>d.changedPixels>0);
  report.checks.proxyPngsFourFrameExact=Object.values(report.pixelComparisons.proxies).every(p=>p.pairs.every(d=>d.changedPixels===0)&&p.alphaPositivePixels.every(a=>a.count>0));
  report.checks.outsidePlayerAlphaUnionUnchanged=report.pixelComparisons.outsidePlayerAlphaUnionChangedPixels===0;
  report.checks.bodyOverlapAlpha8Positive=report.pixelComparisons.bodyOverlapAlpha8>0;
  report.pixelAnalysisAfterBrowserClosed=report.contextClosed===true&&report.browserClosed===true&&report.serverClosed===true;
  report.result=!report.error&&!report.cleanupError&&Object.values(report.checks).every(Boolean)&&report.protectedUnchanged&&report.pixelAnalysisAfterBrowserClosed?
    'REVIEW_EVIDENCE_ONLY_SAME_DEPTH_CHAIN_PNG_BASELINE':'FAIL';
}catch(error){report.pixelAnalysisError=String(error.stack||error);report.result='FAIL';}
report.analysisFinishedAt=new Date().toISOString();fs.writeFileSync(path.join(output,reportName),JSON.stringify(report,null,2));
console.log(JSON.stringify({file:rel(path.join(output,reportName)),result:report.result,checks:report.checks,
  comparisons:report.pixelComparisons,screenshots:report.screenshots.length,consoleWarnings:report.consoleWarnings,
  protectedFiles:Object.keys(expected).length,protectedUnchanged:report.protectedUnchanged,
  browserClosed:report.browserClosed,serverClosed:report.serverClosed,error:report.error,pixelAnalysisError:report.pixelAnalysisError},null,2));
if(report.result==='FAIL')process.exitCode=1;


