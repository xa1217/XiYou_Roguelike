import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const ink = '#241d29';
const paper = '#13213d';
const esc = value => String(value).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const circle = (x,y,r,fill,stroke=ink,width=4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const line = (d,color,width=5) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const shape = (d,color,stroke=ink,width=4) => `<path d="${d}" fill="${color}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const svg = (w,h,body,label) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><metadata>Original deterministic vector artwork for Xiyou Eighty-One Trials. Created 2026-10-04. No third-party artwork or AI bitmap used in this SVG.</metadata>${body}</svg>`;
const text = (x,y,content,size=20,color=ink,weight=600) => `<text x="${x}" y="${y}" fill="${color}" font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" font-size="${size}" font-weight="${weight}">${esc(content)}</text>`;
const cloud = (x,y,s=1,color='#af9364') => `<g transform="translate(${x} ${y}) scale(${s})">${line('M-34 10 Q-17 -6 -2 7 Q10 -13 24 4 Q47 -1 45 14 Q32 23 20 16 Q8 28 -10 16 Q-24 26 -34 10',color,3)}</g>`;

const heroes = [
  {id:'wukong',name:'孙悟空',weapon:'金箍棒',robe:'#e7352b',light:'#ffd43d',skin:'#e7a14d',bg:'#1675dc'},
  {id:'tangseng',name:'唐三藏',weapon:'九环禅杖',robe:'#f8f0dc',light:'#5fe6d0',skin:'#f0ba8f',bg:'#18b989'},
  {id:'bajie',name:'猪八戒',weapon:'九齿钉耙',robe:'#ef4737',light:'#ffc43d',skin:'#f6a58d',bg:'#f04a2f'},
  {id:'wujing',name:'沙悟净',weapon:'降妖宝杖',robe:'#1fb9a6',light:'#55e5cd',skin:'#c47c55',bg:'#167bd1'},
];

function heroArt(h) {
  const parts = [`<ellipse cx="120" cy="278" rx="70" ry="13" fill="#4d392a" opacity=".18"/>`];
  parts.push(line('M96 236 L87 274 M143 236 L151 274','#644a3c',16));
  parts.push(shape('M84 135 Q122 112 161 140 L174 236 Q128 263 75 235 Z',h.robe));
  parts.push(shape('M85 143 L106 144 L155 234 L130 243 Z',h.light));
  parts.push(line('M83 189 Q127 202 167 184',ink,9));
  if(h.id==='wukong') {
    parts.push(shape('M71 118 Q30 118 29 152 Q15 174 32 200 Q-1 228 27 243 Q42 248 46 236',h.robe));
    parts.push(circle(72,103,18,h.skin),circle(165,103,18,h.skin));
    parts.push(shape('M78 51 L90 27 L105 44 L123 22 L139 46 L157 36 L164 67 Z',h.light));
    parts.push(circle(120,96,51,h.skin));
    parts.push(shape('M82 73 Q119 101 157 73 Q157 126 137 137 Q123 122 120 109 Q114 129 99 132 Q80 110 82 73 Z','#eac194'));
    parts.push(line('M74 63 Q120 48 166 63','#efc35b',10),circle(120,58,8,'#c85c37'));
    parts.push(line('M91 91 L108 85 M132 85 L150 91',ink,4));
    parts.push(circle(103,98,4,ink,'none'),circle(138,98,4,ink,'none'));
    parts.push(line('M108 118 Q121 129 137 116',ink,3));
    parts.push(line('M41 258 L56 38','#b54d35',12),line('M41 258 L44 235 M54 61 L56 38','#e6bc50',16));
    parts.push(circle(53,165,12,h.skin));
    parts.push(shape('M156 148 Q176 157 179 174 L155 184 L146 163 Z',h.robe),circle(163,183,12,h.skin));
  } else if(h.id==='tangseng') {
    parts.push(shape('M69 82 Q91 123 83 170 L106 155 L105 86 Z','#f3e6c6'));
    parts.push(shape('M157 83 Q146 131 167 162 L143 150 L138 86 Z','#f3e6c6'));
    parts.push(circle(120,94,47,h.skin));
    parts.push(shape('M75 67 L83 27 L102 46 L120 18 L139 46 L159 28 L167 67 Z','#cfad56'));
    parts.push(shape('M81 66 L87 41 L103 55 L119 31 L137 55 L155 42 L161 65 Z','#e8d7a7'));
    parts.push(circle(102,95,3,ink,'none'),circle(136,95,3,ink,'none'),line('M113 116 Q122 122 131 115',ink,3));
    parts.push(line('M188 267 L188 46','#cda850',8),circle(188,40,18,'none','#bd9d4e',6));
    for(let i=0;i<3;i++) parts.push(circle(175+i*13,55,8,'none','#d4ae56',3));
    parts.push(circle(173,161,11,h.skin),shape('M87 159 Q88 131 105 134 L112 167 L99 178 Z',h.skin));
    parts.push(circle(98,163,5,'#e9c69e',ink,2));
    parts.push(cloud(117,212,.45,'#7aa7b0'));
  } else if(h.id==='bajie') {
    parts.push(shape('M69 92 L47 53 Q26 78 59 111 Z',h.skin),shape('M166 90 L197 58 Q217 86 177 111 Z',h.skin));
    parts.push(circle(122,99,55,h.skin));
    parts.push(shape('M70 62 Q113 37 165 64 L154 78 Q114 60 80 80 Z','#624135'));
    parts.push(line('M89 90 Q102 84 111 93 M133 91 Q143 84 155 91',ink,4));
    parts.push(`<ellipse cx="121" cy="114" rx="22" ry="15" fill="#edb59a" stroke="${ink}" stroke-width="3"/>`,circle(112,113,3,ink,'none'),circle(129,113,3,ink,'none'));
    parts.push(line('M103 138 Q124 150 144 135',ink,4));
    parts.push(`<ellipse cx="120" cy="188" rx="43" ry="42" fill="${h.skin}" stroke="${ink}" stroke-width="4"/>`);
    parts.push(shape('M78 147 L101 164 L86 207 L71 193 Z',h.robe),shape('M158 146 L140 169 L156 210 L176 191 Z',h.robe));
    parts.push(circle(121,210,3,ink,'none'));
    parts.push(line('M190 267 L190 60','#897768',9),line('M152 60 L229 60','#b9b6a4',8));
    for(let i=0;i<9;i++) parts.push(line(`M${154+i*9} 58 L${154+i*9} 81`,'#b9b6a4',4));
    parts.push(circle(178,167,13,h.skin));
  } else {
    parts.push(circle(119,91,49,h.skin));
    parts.push(shape('M76 73 Q82 26 123 36 Q164 39 167 75 L150 66 L144 89 L132 61 L110 63 L94 86 L91 64 Z','#3e4140'));
    parts.push(shape('M83 111 Q98 141 107 129 L121 151 L134 128 Q154 132 160 109 L147 111 L138 96 L118 101 L101 96 Z','#3e4140'));
    parts.push(line('M90 89 L108 84 M130 84 L147 89',ink,4),circle(103,94,3,ink,'none'),circle(136,94,3,ink,'none'));
    parts.push(shape('M77 51 Q120 34 164 52 L161 63 Q119 47 79 61 Z','#d2ac58'));
    for(let i=0;i<7;i++) { const a=i*Math.PI/6; parts.push(circle(119+Math.cos(a)*33,137+Math.sin(a)*22,7,'#53423c',ink,2)); }
    parts.push(line('M191 267 L191 59','#897363',9));
    parts.push(shape('M165 28 Q176 60 192 47 Q209 51 218 22 Q233 74 193 75 Q153 74 165 28 Z','#d3cfc0'));
    parts.push(circle(179,160,12,h.skin),shape('M83 153 L107 168 L96 184 L73 172 Z',h.robe));
  }
  parts.push(line('M82 276 L101 276 M143 276 L163 276',ink,10));
  return parts.join('');
}

const themes = [
  {id:'forest',name:'竹林山境',bg:'#e9d8a6',dark:'#81965d',accent:'#b56f39'},
  {id:'sand',name:'流沙黄风',bg:'#ecd09a',dark:'#a48e58',accent:'#ba693d'},
  {id:'snow',name:'雪岭冰河',bg:'#dce7e3',dark:'#7da9a2',accent:'#bd6c58'},
  {id:'fire',name:'火焰山',bg:'#d8a47e',dark:'#9b6048',accent:'#d35e35'},
  {id:'water',name:'碧水龙宫',bg:'#b9d7d0',dark:'#5f9f91',accent:'#bd8150'},
  {id:'temple',name:'古寺幻境',bg:'#d6c0cb',dark:'#8e718c',accent:'#b26749'},
];
function themeArt(t) {
  let out = `<rect width="480" height="240" rx="18" fill="${t.bg}"/>`;
  out += shape('M0 158 Q80 104 147 155 Q213 100 271 139 Q367 77 480 141 L480 240 L0 240 Z',t.dark,'none',0);
  out += `<path d="M0 182 Q105 162 177 190 Q279 213 366 173 Q423 153 480 170 L480 240 L0 240 Z" fill="${t.bg}" opacity=".55"/>`;
  out += cloud(84,49,.8,t.dark)+cloud(397,60,.7,t.dark);
  if(t.id==='forest') {
    for(let i=0;i<3;i++){let x=66+i*43;out+=line(`M${x} 184 L${x-2} 58`,ink,5)+line(`M${x-1} 91 L${x+15} 72 M${x} 127 L${x-16} 109`,t.dark,8);}
    out+=circle(359,102,31,'#769459',ink,3)+circle(401,104,34,'#829d63',ink,3)+circle(380,75,34,'#9caf6c',ink,3)+line('M383 128 L383 195',ink,8);
  } else if(t.id==='sand') {
    out+=shape('M0 180 Q150 83 288 179 Q378 139 480 168 L480 240 L0 240 Z','#d7b276','none',0);
    out+=line('M350 192 L350 117 M350 151 L329 151 L329 131 M350 165 L370 165 L370 139','#8c8d57',13);
    out+=shape('M67 194 L82 166 L119 164 L132 195 Z','#bfa579',ink,3)+line('M78 194 L120 193','#806947',2);
  } else if(t.id==='snow') {
    out+=shape('M187 141 L244 56 L302 140 L275 132 L264 146 L242 114 L221 138 L208 132 Z','#eef0de',ink,3);
    for(let i=0;i<2;i++){let x=65+i*55;out+=shape(`M${x} 71 L${x-28} 163 L${x+28} 163 Z`,'#779a91',ink,3)+shape(`M${x} 71 L${x-14} 121 L${x} 113 L${x+13} 121 Z`,'#f4f5e6','none',0)+line(`M${x} 163 L${x} 186`,ink,5);}
    out+=line('M15 207 Q95 195 161 207 M310 204 Q390 215 464 202','#a9c6c5',5);
  } else if(t.id==='fire') {
    out+=shape('M217 171 L290 63 L357 170 L314 150 L285 174 L255 143 Z','#7f493d',ink,3);
    out+=line('M289 65 L273 101 L292 123 L271 160','#ef9b50',8);
    out+=shape('M29 204 Q131 171 204 208 Q298 219 344 194 Q402 183 462 212 L459 240 L31 240 Z','#c66b40','none',0);
    out+=line('M42 214 Q160 193 215 218 M351 213 Q401 194 448 220','#efa457',6);
  } else if(t.id==='water') {
    for(let i=0;i<4;i++) out+=line(`M30 ${164+i*16} Q113 ${153+i*16} 194 ${168+i*16} Q290 ${182+i*16} 394 ${165+i*16} L456 ${167+i*16}`,'#477f79',3);
    out+=shape('M315 105 L370 72 L425 105 L419 114 L323 114 Z','#be985c',ink,3)+shape('M328 114 L414 114 L414 177 L328 177 Z','#9bc1b2',ink,3)+shape('M356 139 Q370 122 386 139 L386 177 L356 177 Z','#517f75',ink,3);
    out+=line('M79 175 L70 135 M77 174 L95 123 M83 161 L101 152',t.dark,5);
  } else {
    out+=shape('M167 101 Q212 102 239 65 Q266 101 316 101 L302 113 L179 113 Z','#70546e',ink,4);
    out+=shape('M184 112 L298 112 L298 192 L184 192 Z','#bfa7b4',ink,3)+shape('M222 150 Q240 119 260 150 L260 192 L222 192 Z','#715d73',ink,3);
    out+=line('M192 192 L288 192 M174 202 L308 202','#654b64',5);
    out+=line('M85 153 L85 109 M385 153 L385 109',ink,4);
    out+=`<ellipse cx="85" cy="122" rx="15" ry="21" fill="#c68468" stroke="${ink}" stroke-width="3"/><ellipse cx="385" cy="122" rx="15" ry="21" fill="#c68468" stroke="${ink}" stroke-width="3"/>`;
  }
  return out;
}

const artifacts=[
  {id:'purple-gourd',name:'紫金葫芦',color:'#bf6ad6'},
  {id:'iron-fan',name:'芭蕉扇',color:'#66c4bd'},
  {id:'diamond-snare',name:'金刚琢',color:'#f0ce71'},
  {id:'nine-dragon',name:'九龙神火罩',color:'#ec835a'},
  {id:'lotus-lantern',name:'宝莲灯',color:'#80b8ff'},
  {id:'golden-rope',name:'捆仙绳',color:'#eacb82'},
  {id:'moon-mirror',name:'月光宝盒',color:'#9ad3ff'},
  {id:'samadhi-fire',name:'三昧真火',color:'#ff765e'},
];
function artifactArt(a) {
  const c=a.color;
  let out = circle(64,64,58,'#f3e4bd',ink,3);
  if(a.id==='purple-gourd') out+=shape('M59 20 L69 20 L69 30 Q92 37 79 56 Q110 86 84 109 Q53 120 39 98 Q23 75 49 57 Q36 39 57 30 Z',c)+line('M56 25 Q39 12 32 31','#769258',5)+line('M48 62 L77 61','#edcb70',6)+circle(54,81,7,'#f3cbe0','none');
  if(a.id==='iron-fan') {
    out+=shape('M61 89 Q10 70 22 29 Q60 11 105 29 Q112 70 70 88 Z',c)+line('M64 86 L64 113','#8d684a',8);
    for(let i=0;i<5;i++) out+=line(`M64 86 L${27+i*18} 34`,'#477971',2);
  }
  if(a.id==='diamond-snare') out+=circle(64,65,35,'none','#b69746',13)+circle(64,65,35,'none',c,8)+circle(48,41,7,'#fff7d2','none');
  if(a.id==='nine-dragon') {
    out+=shape('M25 89 Q22 56 40 32 L43 62 L65 16 L75 62 L89 37 Q113 66 99 90 Z',c)+circle(64,80,23,'none','#f8cf67',8)+circle(64,80,23,'none',ink,2);
  }
  if(a.id==='lotus-lantern') {
    for(let i=0;i<5;i++){const angle=-Math.PI+i*Math.PI/4;const x=64+Math.cos(angle)*35;const y=75+Math.sin(angle)*37;out+=shape(`M64 82 Q${x-11} ${y} ${x} ${y-17} Q${x+14} ${y+7} 64 82 Z`,c);}
    out+=shape('M42 80 L86 80 L79 101 L49 101 Z','#d5b262')+circle(64,68,12,'#f8df92',ink,3);
  }
  if(a.id==='golden-rope') out+=line('M38 38 Q74 8 96 44 Q113 82 66 99 Q34 112 29 83 Q26 56 55 55 Q95 54 85 78 Q76 98 58 85 Q51 78 63 72',ink,11)+line('M38 38 Q74 8 96 44 Q113 82 66 99 Q34 112 29 83 Q26 56 55 55 Q95 54 85 78 Q76 98 58 85 Q51 78 63 72',c,7);
  if(a.id==='moon-mirror') out+=shape('M27 44 L64 23 L103 44 L103 90 L64 110 L27 90 Z','#93776a')+shape('M37 46 L64 33 L94 47 L94 84 L64 97 L37 84 Z',c)+shape('M47 68 L62 43 L83 72 L65 85 Z','#d8f1ea',ink,2);
  if(a.id==='samadhi-fire') out+=shape('M62 15 Q89 34 78 54 Q101 38 103 76 Q111 103 72 114 Q34 117 27 88 Q20 64 43 46 Q36 68 54 69 Q72 54 62 15 Z',c)+shape('M61 55 Q78 71 70 79 Q90 73 87 96 Q75 115 56 105 Q44 95 52 82 Q66 81 61 55 Z','#f6c665',ink,2);
  return out;
}

// Weapon skill emblems are intentionally separate from the full-body hero
// sprites.  They are small, square HUD/upgrade assets with a distinct
// silhouette, so the runtime can show a readable skill identity without
// duplicating any character or artifact artwork.
const weaponSkills=[
  {id:'wukong',name:'金箍棒',color:'#e7352b',accent:'#ffd43d'},
  {id:'tangseng',name:'九环禅杖',color:'#f3e6c6',accent:'#5fe6d0'},
  {id:'bajie',name:'九齿钉耙',color:'#ef4737',accent:'#b9b6a4'},
  {id:'wujing',name:'降妖宝杖',color:'#1fb9a6',accent:'#d3cfc0'},
];
function weaponSkillArt(w) {
  let out=circle(64,64,58,'#f3e4bd',ink,3);
  if(w.id==='wukong') {
    out+=circle(64,64,35,'#f4c74f','#8e4a32',4);
    out+=line('M21 104 L105 24','#b54d35',10)+line('M20 104 L28 93 M98 35 L106 25','#e6bc50',14);
    out+=line('M40 46 Q64 31 88 46 M40 82 Q64 97 88 82','#fff0a6',4);
    out+=circle(64,64,9,'#fff0a6',ink,3);
  } else if(w.id==='tangseng') {
    out+=circle(64,64,31,'#d7f4ed','#3f7c7d',3);
    out+=line('M64 108 L64 18','#bd9d4e',7)+circle(64,16,15,'none','#bd9d4e',5);
    for(let i=0;i<3;i++) out+=circle(64+i*14,33,7,'none','#d4ae56',3);
    out+=shape('M44 70 Q64 38 84 70 L76 91 L52 91 Z',w.color,ink,3);
    out+=circle(64,61,8,w.accent,ink,2);
  } else if(w.id==='bajie') {
    out+=line('M64 110 L64 26','#897768',9);
    out+=line('M28 30 L100 30',w.accent,9);
    for(let i=0;i<9;i++) out+=line(`M${31+i*8} 29 L${31+i*8} 57`,w.accent,4);
    out+=shape('M37 74 Q64 55 91 74 L82 101 L46 101 Z',w.color,ink,3);
    out+=circle(64,76,9,'#f7c16e',ink,2);
  } else {
    out+=circle(64,64,31,'#d7f4ed','#3f7c7d',3);
    out+=line('M64 110 L64 22','#897363',8);
    out+=shape('M36 26 Q50 58 64 45 Q80 48 91 18 Q108 70 64 70 Q20 68 36 26 Z',w.accent,ink,4);
    out+=line('M41 89 Q64 102 87 89','#f8df92',5);
    out+=circle(64,71,8,w.color,ink,2);
  }
  return out;
}
function write(name,content){fs.writeFileSync(path.join(dir,name),content,'utf8');}
for(const h of heroes) write(`hero-${h.id}.svg`,svg(240,300,heroArt(h),`${h.name}原创矢量角色`));
for(const t of themes) write(`theme-${t.id}.svg`,svg(480,240,themeArt(t),`${t.name}原创场景预览`));
for(const a of artifacts) write(`artifact-${a.id}.svg`,svg(128,128,artifactArt(a),`${a.name}原创法宝图标`));
for(const w of weaponSkills) write(`weapon-skill-${w.id}.svg`,svg(128,128,weaponSkillArt(w),`${w.name}本命技能图标`));

let preview = `<rect width="1500" height="1410" fill="${paper}"/>`+text(44,58,'西游 · 八十一难',34)+text(44,93,'原创素材方向 / 四角色 · 六主题 · 八法宝',17,'#745747',500);
for(let i=0;i<4;i++){
  const h=heroes[i],x=40+i*360;
  preview+=`<g transform="translate(${x} 118)"><rect width="338" height="385" rx="20" fill="${h.bg}" stroke="${ink}" stroke-width="3"/>${cloud(78,50,.75,'#a48560')}<g transform="translate(42 22) scale(1.06)">${heroArt(h)}</g>${text(24,341,h.name,24)}${text(24,369,h.weapon,15,'#755948',500)}</g>`;
}
preview+=text(44,553,'西行六境',25);
for(let i=0;i<6;i++){
  const t=themes[i],x=40+(i%3)*480,y=576+Math.floor(i/3)*275;
  preview+=`<g transform="translate(${x} ${y})"><g transform="scale(.94)">${themeArt(t)}</g>${text(12,246,t.name,19)}</g>`;
}
preview+=text(44,1155,'法宝图鉴',25);
for(let i=0;i<8;i++){
  const a=artifacts[i],x=41+i*180;
  preview+=`<g transform="translate(${x} 1180)"><g transform="translate(14 0)">${artifactArt(a)}</g>${text(8,159,a.name,17)}</g>`;
}
preview+=text(44,1380,'Vector artwork: deterministic original code. Character card bitmap is a separate imagegen asset.',12,'#745747',400);
write('xiyou-art-preview.svg',svg(1500,1410,preview,'西游四角色六主题八法宝原创素材预览'));
console.log(JSON.stringify({ok:true,heroFiles:4,themeFiles:6,artifactFiles:8,weaponSkillFiles:4,preview:'xiyou-art-preview.svg'}));
