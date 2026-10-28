const core=require('./core/bundle.js');
const {NativeGame,attachTigerFrames,attachBearFrames,attachBullFrames,attachWolfFrames,attachMonkeyFrames,attachDeerFrames,attachHawkFrames,attachSnakeFrames,attachBossFrames,attachSkillFx}=core;
const {WxAudio}=require('./audio.js');
const info=wx.getWindowInfo?wx.getWindowInfo():wx.getSystemInfoSync();
let shareData={title:'一棒破局！西游·八十一难，十分钟渡一难',query:''};
let capCache=null;
const canvas=wx.createCanvas();
const requestFrame=fn=>canvas.requestAnimationFrame?canvas.requestAnimationFrame(fn):requestAnimationFrame(fn);
const cancelFrame=id=>canvas.cancelAnimationFrame?canvas.cancelAnimationFrame(id):cancelAnimationFrame(id);
// Rewarded-ad unit ids stay empty until the traffic-master (流量主) account
// is approved (~500 cumulative UV); adsReady is false until then, so every
// ad entry point in the UI stays hidden and the share paths carry the game.
const AD_UNITS={revive:'',double:'',patrol:''};
const adObjects={};
function rewardedAd(unit){const id=AD_UNITS[unit];if(!id||!wx.createRewardedVideoAd)return Promise.resolve(false);const ad=adObjects[unit]||(adObjects[unit]=wx.createRewardedVideoAd({adUnitId:id}));return new Promise(resolve=>{const onClose=res=>{ad.offClose?.(onClose);resolve(!!(res&&res.isEnded));};ad.onClose(onClose);ad.show().catch(()=>ad.load().then(()=>ad.show()).catch(()=>{ad.offClose?.(onClose);resolve(false);}));});}
const adsReady=Object.values(AD_UNITS).some(Boolean)&&typeof wx.createRewardedVideoAd==='function';
// Boot gate accounting mirrors the web shell: only the menu gate set
// (hero sheet + UI textures + skill icons) blocks first paint; battle art
// streams in afterwards and the vector rigs cover any gap.
const GATE_TOTAL=29;
let gateDone=0,gateFailed=0;
const assetProgress=()=>({done:gateDone,total:GATE_TOTAL,failed:gateFailed,complete:gateDone+gateFailed>=GATE_TOTAL});
let launchQuery={};
try{launchQuery=(wx.getLaunchOptionsSync?.()?.query)||{};}catch{}
const game=new NativeGame(canvas,{width:info.windowWidth,height:info.windowHeight,pixelRatio:Math.min(2,info.pixelRatio||1),safeArea:info.safeArea||{},audio:new WxAudio(wx),requestFrame,cancelFrame,load:key=>{try{return wx.getStorageSync(key);}catch{return null;}},save:(key,value)=>wx.setStorageSync(key,value),confirm:(message,accept)=>wx.showModal({title:'取经路',content:message,success:r=>{if(r.confirm)accept();}}),capsuleInset:()=>{if(capCache!==null)return capCache;capCache=0;try{const r=wx.getMenuButtonBoundingClientRect?.();if(r){const top=(info.safeArea&&info.safeArea.top)||0;if(r.bottom>top+20)capCache=Math.max(0,info.windowWidth-r.left+6);}}catch{}return capCache;},share:(data)=>{shareData={title:data.title,query:data.query||''};try{if(wx.shareAppMessage){wx.shareAppMessage({title:data.title,query:data.query});return true;}}catch{}return true;},launchQuery,adsReady,rewardedAd,artStreaming:true,assetProgress});
let moveTouch=null;
const point=t=>({x:t.clientX??t.x,y:t.clientY??t.y});
const start=e=>{for(const t of e.changedTouches||e.touches||[]){const p=point(t);game.touchStart(p.x,p.y);if(game.touchOrigin&&moveTouch===null)moveTouch=t.identifier;}};
const move=e=>{const t=(e.touches||[]).find(t=>t.identifier===moveTouch);if(t){const p=point(t);game.touchMove(p.x,p.y);}};
const end=e=>{if((e.changedTouches||[]).some(t=>t.identifier===moveTouch)){moveTouch=null;game.touchEnd();}};
const hide=()=>game.onHide(),show=()=>game.onShow();
const resize=()=>{const i=wx.getWindowInfo?wx.getWindowInfo():wx.getSystemInfoSync();game.resize(i.windowWidth,i.windowHeight,Math.min(2,i.pixelRatio||1),i.safeArea||{});};
const memory=()=>{game.save.quality='low';game.renderer?.setQuality('low');game.resize(game.w,game.h,1,{top:game.top,bottom:game.h-game.bottom});};
wx.onTouchStart(start);wx.onTouchMove(move);wx.onTouchEnd(end);wx.onTouchCancel?.(end);wx.onHide(hide);wx.onShow(show);wx.onWindowResize?.(resize);wx.onMemoryWarning?.(memory);
wx.setKeepScreenOn?.({keepScreenOn:true});
wx.showShareMenu?.({menus:['shareAppMessage']});
const share=()=>({title:shareData.title,query:shareData.query});
wx.onShareAppMessage?.(share);
module.exports={game,dispose(){wx.offTouchStart?.(start);wx.offTouchMove?.(move);wx.offTouchEnd?.(end);wx.offTouchCancel?.(end);wx.offHide?.(hide);wx.offShow?.(show);wx.offWindowResize?.(resize);wx.offMemoryWarning?.(memory);wx.offShareAppMessage?.(share);game.dispose();wx.setKeepScreenOn?.({keepScreenOn:false});}};

// ---- Artwork (batch C): the WeChat shell now wires the same art fields the
// web shell (native-app.js) fills — uiImages, skill/FX/hero/enemy sheets,
// crater and painted maps — from the art-* subpackages produced by
// scripts/package-wechat.py. Sheets are WebP copies at identical pixel
// dimensions, so the authored frame contracts validate unchanged. Any failed
// piece simply never lands and the deterministic vector fallback stays.
const loadedPkgs=new Set(),pkgWaiters={};
function ensurePackage(name,cb){if(loadedPkgs.has(name))return cb(true);if(pkgWaiters[name])return void pkgWaiters[name].push(cb);pkgWaiters[name]=[cb];const settle=ok=>{if(ok)loadedPkgs.add(name);const ws=pkgWaiters[name]||[];delete pkgWaiters[name];ws.forEach(f=>f(ok));};if(wx.loadSubpackage)wx.loadSubpackage({name,success:()=>settle(true),fail:()=>settle(false)});else settle(false);}
function artImage(pkgName,file,onload,gate){ensurePackage(pkgName,ok=>{if(!ok){if(gate)gateFailed++;return;}const image=wx.createImage();image.onload=()=>{if(gate)gateDone++;onload(image);};image.onerror=()=>{if(gate)gateFailed++;};image.src=pkgName+'/'+file;});}
const syncRenderer=(field,obj)=>{if(game.renderer)game.renderer[field]=obj;game.draw();};
// Hero card sheet (illustrations subpackage) — part of the boot gate.
ensurePackage('illustrations',ok=>{if(!ok){gateFailed++;return;}const image=wx.createImage();image.onload=()=>{gateDone++;if(!game.disposed){game.heroSheet=image;game.draw();}};image.onerror=()=>{gateFailed++;};image.src='illustrations/hero-cards.jpg';});
// UI textures + skill icons (gate set).
const uiImages={};game.uiImages=uiImages;
for(const [key,file] of Object.entries({paper:'ui-paper.jpg',wood:'ui-wood.jpg',patrol:'ui-patrol.jpg',chapter:'ui-chapter.jpg',poster:'ui-poster.webp',heroPoster_wukong:'hero-poster-wukong.webp',heroPoster_tangsanzang:'hero-poster-tangsanzang.webp',heroPoster_bajie:'hero-poster-bajie.webp',heroPoster_shajing:'hero-poster-shajing.webp',logo:'ui-logo.jpg',header_chapters:'header-chapters.webp',header_talents:'header-talents.webp',header_codex:'header-codex.webp',header_daily:'header-daily.webp',divider:'ui-divider.jpg'})){
  artImage('art-ui',file,image=>{uiImages[key]=image;game.draw();},true);
}
const skillImages={};game.skillImages=skillImages;
for(const [id,file] of Object.entries({'weapon:wukong':'skill-icon-wukong.png','weapon:tangsanzang':'skill-icon-tangsanzang.png','weapon:bajie':'skill-icon-bajie.png','weapon:shajing':'skill-icon-shajing.png','purple-gourd':'skill-icon-purple-gourd.png','iron-fan':'skill-icon-iron-fan.png','diamond-snare':'skill-icon-diamond-snare.png','nine-dragon':'skill-icon-nine-dragon.png','lotus-lantern':'skill-icon-lotus-lantern.png','golden-rope':'skill-icon-golden-rope.png','moon-mirror':'skill-icon-moon-mirror.png','samadhi-fire':'skill-icon-samadhi-fire.png'})){
  artImage('art-ui',file,image=>{skillImages[id]=image;syncRenderer('skillImages',skillImages);},true);
}
// Battle v3 hero atlases. attachBattleV3Frames mirrors native-app.js.
const battleV3Sequences={idle:[0,0,0,0,0,0],move:[1,2,3,1,2,3,2,1],attack:[4,4,5,5,4,5,5,4],hit:[6,5,6,5],stun:[6,6,0,1],dash:[7,5,7,5,7,5,7,5],intro:[0,1,2,3,0,1,2,3,0,1],death:[6,6,5,4,0,0,6,6]};
const attachBattleV3Frames=(image,id)=>{if(!image)return image;const width=Number(image.naturalWidth||image.width)||1,height=Number(image.naturalHeight||image.height)||1;const cols=4,rows=2,cellW=width/cols,cellH=height/rows;const cells=Array.from({length:8},(_,index)=>{const col=index%cols,row=Math.floor(index/cols);return {x:col*cellW,y:row*cellH,w:col===cols-1?width-col*cellW:cellW,h:row===rows-1?height-row*cellH:cellH};});image.__v3BattleSprite=true;image.__prioritySprite=true;image.__battleFrameContract={id,cols,rows,fps:{idle:8,move:12,attack:16,hit:18,stun:8,dash:18,intro:12,death:14},pivot:{x:.5,y:.88}};image.__frameGrids={[id]:{source:{x:0,y:0,w:width,h:height},states:Object.fromEntries(Object.entries(battleV3Sequences).map(([state,sequence])=>[state,{frames:sequence.length,rects:sequence.map(index=>cells[index])}]))}};return image;};
const heroImages={};game.heroImages=heroImages;
for(const [id,file] of Object.entries({wukong:'hero-wukong-battle-v3-sheet.webp',tangsanzang:'hero-tangseng-battle-v3-sheet.webp',bajie:'hero-bajie-battle-v3-sheet.webp',shajing:'hero-wujing-battle-v3-sheet.webp'})){
  artImage('art-heroes',file,image=>{attachBattleV3Frames(image,id);heroImages[id]=image;syncRenderer('heroImages',heroImages);});
}
// Painted enemy + boss atlases with their frames contracts (require from the
// loaded subpackage; any failure keeps the vector identity rig).
const enemyImages={};game.enemyImages=enemyImages;
const contractFor=(pkgName,id,version)=>{try{return require('./'+pkgName+'/enemy-'+id+'-battle-'+version+'-frames.json');}catch{return null;}};
for(const [id,attach,pkgName,version] of [['tiger',attachTigerFrames,'art-enemies-a','v1'],['bear',attachBearFrames,'art-enemies-a','v1'],['bull',attachBullFrames,'art-enemies-a','v1'],['wolf',attachWolfFrames,'art-enemies-a','v1'],['monkey',attachMonkeyFrames,'art-enemies-b','v1'],['deer',attachDeerFrames,'art-enemies-b','v1'],['hawk',attachHawkFrames,'art-enemies-b','v1'],['snake',attachSnakeFrames,'art-enemies-b','v3']]){
  artImage(pkgName,'enemy-'+id+'-battle-'+version+'-sheet.webp',image=>{const contract=contractFor(pkgName,id,version);if(!contract)return;try{attach(image,contract);enemyImages[id]=image;syncRenderer('enemyImages',enemyImages);}catch{/* invalid contract: vector fallback stays */}});
}
for(const bossId of ['yin-general','xiong-shanjun','te-chushi']){
  artImage('art-bosses','enemy-'+bossId+'-battle-v1-sheet.webp',image=>{const contract=contractFor('art-bosses',bossId,'v1');if(!contract)return;try{attachBossFrames(bossId)(image,contract);enemyImages[bossId]=image;syncRenderer('enemyImages',enemyImages);}catch{/* vector fallback stays */}});
}
// Signature skill-effect strips.
const skillFxImages={};game.skillFxImages=skillFxImages;
for(const fxId of ['slash-arc','light-orb','rake-sweep','water-ring','fan-wave','gourd-vortex','palm-burst','fire-bird','mountain-slam','skull-bead','holy-spark','fire-wheel','ring-spin','gold-bead','fire-pool','monkey-clone','whirl-pool']){
  artImage('art-fx','skill-fx-'+fxId+'.webp',image=>{try{if(attachSkillFx(image,fxId)){skillFxImages[fxId]=image;syncRenderer('skillFxImages',skillFxImages);}}catch{/* vector effect stays */}});
}
// Boss landing crater decal.
artImage('art-fx','crater-decal.jpg',image=>{game.craterImage=image;syncRenderer('craterImage',image);});
// Painted chapter maps, loaded per theme on demand (doublefork eagerly: it
// is the first stage and the home backdrop).
const mapImages={forest:{},temple:{},doublefork:{}};game.mapImages=mapImages;
const mapSceneFiles={doublefork:'map-doublefork-high-ridge-v1.jpg',forest:'map-forest-qv1.jpg',temple:'map-temple-qv1.jpg',water:'map-water-qv1.jpg',fire:'map-fire-qv1.jpg',sand:'map-sand-qv1.jpg',snow:'map-snow-qv1.jpg'};
const mapScenePkg={doublefork:'art-maps-a',forest:'art-maps-a',temple:'art-maps-a',water:'art-maps-b',fire:'art-maps-b',sand:'art-maps-b',snow:'art-maps-b'};
const mapSceneLoading={};
game.loadMapScene=key=>{const file=mapSceneFiles[key];if(!file||mapImages[key]?.back||mapSceneLoading[key])return;mapSceneLoading[key]=true;artImage(mapScenePkg[key],file,image=>{mapImages[key]={back:image};game.draw();});};
game.loadMapScene('doublefork');
