/* Generated from prototype-2d/src by npm run build. Do not edit. */
const factories={
"content":function(module,exports,require){
/**
 * Static game data for 西游·八十一难.
 *
 * The simulation only consumes plain objects from this module.  Keeping the
 * data here makes balancing a content change rather than a code change and
 * lets the mini-program pre-load it without a DOM or network request.
 */

const BALANCE = Object.freeze({
  duration: 600,
  eliteTimes: Object.freeze([80, 160, 250, 340, 430, 520]),
  bossTime: 300,
  finalBossTime: 570,
  maxEnemies: 280,
  maxProjectiles: 300,
  maxEffects: 160,
  maxGems: 240,
  worldSize: 1800,
  playerRadius: 18,
});

const CHARACTERS = [
  {
    id: 'wukong', name: '孙悟空', title: '齐天大圣', weapon: '金箍棒',
    description: '挥棒横扫前方，第三击起蓄出重击，越战越勇。', color: '#e6a43a',
    stats: { hp: 145, speed: 245, damage: 28 }, passive: '大圣威势：重击有机会眩晕敌人，拾取经验后短暂获得 3% 移速。',
    weaponLevels: [
      '1级：前方扇形挥棒，攻击间隔 1 秒。',
      '2级：攻速提升，攻击间隔 0.75 秒。',
      '3级：攻击间隔 0.5 秒；每第三击为 2 倍伤害、1 倍范围重击。',
      '4级：重击 2.5 倍伤害、1.5 倍范围。',
      '5级：重击 3 倍伤害、2 倍范围；命中有 30% 几率眩晕。',
    ],
  },
  {
    id: 'tangseng', name: '唐三藏', title: '旃檀功德佛', weapon: '九环禅杖',
    description: '以圣光球锁定最近敌人，穿透与弹射让密集妖群无处可逃。', color: '#5ec5e8',
    stats: { hp: 105, speed: 210, damage: 24 }, passive: '慈悲心：每次升级回复 6% 最大生命，光球击退效果增强。',
    weaponLevels: [
      '1级：向最近敌人发射圣光球，穿行 8 个身位造成伤害。',
      '2级：命中后停留 0.25 秒持续灼伤。',
      '3级：停留 0.5 秒并分裂 5 个光点，各在小怪间弹射 2 次。',
      '4级：停留 0.75 秒，分裂 10 个光点，在 3 只小怪间弹射 3 次。',
      '5级：施放瞬间击退 0.25 秒，停留 1 秒，分裂 15 个光点，在 5 只小怪间弹射 5 次。',
    ],
  },
  {
    id: 'bajie', name: '猪八戒', title: '净坛使者', weapon: '九齿钉耙',
    description: '宽阔直线夯击并施加流血，烈焰神鸟从耙尖扑向附近妖怪。', color: '#d98865',
    stats: { hp: 185, speed: 185, damage: 32 }, passive: '天蓬体魄：受到致命伤时保留 1 点生命（每局一次）。',
    weaponLevels: [
      '1级：宽线夯击并流血 3 秒，累计为普通伤害的 5%。',
      '2级：流血累计 10%，弹道宽度 +25%。',
      '3级：流血累计 15%，宽度 +50%，召唤 3 只火鸟。',
      '4级：流血累计 20%，宽度 +75%，召唤 6 只火鸟。',
      '5级：流血累计 25%，宽度翻倍，召唤 9 只火鸟，落地爆炸。',
    ],
  },
  {
    id: 'wujing', name: '沙悟净', title: '金身罗汉', weapon: '降妖宝杖',
    description: '旋转宝杖造成环形伤害，水泥沙漩涡拖慢并吸附妖群。', color: '#b28bca',
    stats: { hp: 165, speed: 205, damage: 26 }, passive: '流沙护身：漩涡每命中 12 个目标获得 1 层护盾（最多 3 层）。',
    weaponLevels: [
      '1级：旋转一圈造成环形伤害，间隔 1.5 秒。',
      '2级：旋转加速，间隔 1.25 秒。',
      '3级：间隔 1 秒；每 5 次旋转生成 3 个小漩涡，持续 1.5 秒。',
      '4级：间隔 0.75 秒；漩涡持续 2 秒、扩大至人物大小并缓慢吸附。',
      '5级：漩涡持续 3 秒，强力吸附普通怪、显著减速精英，对首领轻微减速。',
    ],
  },
];

const ARTIFACTS = [
  { id:'purple-gourd',name:'紫金葫芦',icon:'gourd',color:'#bf6ad6',cooldown:9,kind:'absorb',description:'前方扇形缓吸普通妖怪，接近葫口才收伏；精英与首领只受持续伤害及减速。',levels:['1级：吸附范围200，吸速120，持续2.4秒。','2级：范围225，吸速150，伤害增加。','3级：范围250，吸速180，首领仅减速灼伤。','4级：范围275，吸速210，冷却5.5秒。','5级：范围300，吸速240，冷却4.5秒。'] },
  { id:'iron-fan',name:'芭蕉扇',icon:'fan',color:'#66c4bd',cooldown:8,kind:'cone',description:'朝一侧扇动，少量伤害并按妖怪级别产生不同幅度击退；高阶可向两侧扇动。',levels:['1级：一侧扇动，普通大击退、精英中击退、首领小击退。','2级：扇动范围与伤害增加。','3级：范围235，普通击退212。','4级：两侧扇动，范围260。','5级：两侧扇动，范围285，普通击退260。'] },
  { id:'diamond-snare',name:'乾坤圈',icon:'ring',color:'#f0ce71',cooldown:7,kind:'bounce',description:'首击高伤并反向，撞妖或屏幕边缘会反弹；子圈只单体反弹且永不递归分裂。',levels:['1级：反弹3次，每次伤害1个目标。','2级：反弹5次，每次最多2个目标。','3级：反弹7次，最多3目标；每撞妖生1个反弹3次子圈。','4级：反弹9次，最多4目标；每撞妖生1个反弹4次子圈。','5级：反弹11次，最多5目标；每撞妖生2个反弹5次子圈。'] },
  { id:'nine-dragon',name:'风火轮',icon:'flame',color:'#ec835a',cooldown:10,kind:'line',description:'快速向前掷出风火轮，穿透沿途敌人并留下火径。',levels:['1级：1只轮，火径持续1秒。','2级：1只轮，火径持续2秒。','3级：2只轮，宽度增加，火径3秒。','4级：2只轮，火径4秒，伤害增加。','5级：2只轮，火径5秒，伤害与宽度增加。'] },
  { id:'lotus-lantern',name:'七十二变',icon:'monkey',color:'#e6a43a',cooldown:14,kind:'summon',description:'吹出木棍小猴拦截妖怪，每只猴只拦截有限目标。',levels:['1级：3只小猴，每猴拦截1个目标。','2级：6只小猴，每猴拦截1个目标。','3级：9只小猴，每猴拦截2个目标。','4级：12只小猴，每猴拦截2个目标。','5级：15只小猴，每猴拦截3个目标，伤害提高。'] },
  { id:'golden-rope',name:'念力佛珠',icon:'beads',color:'#eacb82',cooldown:12,kind:'orbit',description:'佛珠绕身持续旋转，数量、转速与伤害随等级提升。',levels:['1级：1颗佛珠绕身旋转。','2级：3颗佛珠，转速增加。','3级：5颗佛珠，伤害提高。','4级：6颗佛珠，轨道稍扩大。','5级：9颗骷髅念珠高速环绕。'] },
  { id:'moon-mirror',name:'如来神掌',icon:'palm',color:'#e7cb80',cooldown:16,kind:'strike',description:'浅金色神掌从天落下，掌心卍印；按等级在周围多个方向降下。',levels:['1级：1方向神掌，初始直径为角色2倍。','2级：左右两方向落掌。','3级：周围3方向落掌。','4级：四方向落掌，范围与伤害增加。','5级：四周5方向落掌，伤害范围进一步提高。'] },
  { id:'samadhi-fire',name:'搬山诀',icon:'mountain',color:'#b99468',cooldown:11,kind:'meteor',description:'银角念咒请山落地，初始山体为人物5倍，伤害与范围随等级增长。',levels:['1级：5倍人物大小山体落地。','2级：山体范围增加20%，伤害提高。','3级：山体范围增加40%，伤害提高。','4级：山体范围增加60%，伤害提高。','5级：山体范围增加80%，落山重创妖群。'] },
];
// Primary public-domain source: 《西游记》第九十九回“历难簿”.
// https://zh.wikisource.org/zh-hans/西遊記/第099回
// Each tuple owns its name AND encounter mapping; no separate name override.
// The book lists 80 trials, then completes 81 with the old turtle's river
// plunge and wet scriptures. Minor glyphs are normalized for modern display:
// 39 “⿰山兜山” -> “金兜山”; 55 keeps the source's “稀柿同”.
// Non-combat chapters become explicitly original guardian dreamscapes.
// Their guardians are never the Buddhist/Daoist helpers from the original.
const stageSeeds = [
  ['金蝉遭贬','灵山转世幻境','慢心劫影','失念魇将',['懈怠魔影','散念幻灵'],'temple','原著非战斗磨难，原创守关幻境改编：金蝉子遭贬的前缘化为慢心与失念试炼；佛祖是授命者，不是敌人。难名据第99回，前缘据第100回。'],
  ['出胎几杀','江州衙署','危生魇王','夜惊幻影',['危生魔影','冷雾幻灵'],'temple','原著非战斗磨难，原创守关幻境改编：江流儿出生后面临刘洪威胁，以危生魇王表现险境。依据江流儿身世记述与第99回难簿。'],
  ['满月抛江','洪江漂流处','逆流魇王','浪涡幻影',['漂木幻灵','浪沫魔影'],'water','原著非战斗磨难，原创守关幻境改编：满月婴儿随木板漂江，以逆流魇王和浪涡表现护生试炼；不将救助者龙王设为敌人。依据江流儿身世记述。'],
  ['寻亲报冤','金山寺至江州','冤锁魇王','伪印幻影',['冤锁魔影','江匪幻象'],'temple','原著非战斗磨难，原创守关幻境改编：寻母、认亲、揭发刘洪与报父仇，以冤锁魇王表现受阻亲缘；原创首领不冒充原著妖怪。依据江流儿身世记述。'],
  ['出城逢虎','河州卫外双叉岭','寅将军','特处士',['苍狼妖','山精树鬼','虎妖'],'forest','依据第13回：出河州卫后陷入双叉岭虎穴，寅将军是虎精，特处士是野牛精；随从妖群按原文山精树鬼演绎。'],
  ['折从落坑','双叉岭陷坑虎穴','熊山君','寅将军',['熊罴妖','野牛妖','苍狼妖'],'forest','依据第13回：二从者在虎穴遇害，熊山君、特处士与寅将军聚宴。难名按第99回原文为“折从落坑”。'],
  ['双叉岭上','双叉岭猎户山道','斑斓猛虎','毒蛇群魁',['长蛇','山林猛虎','毒虫'],'forest','依据第13回：刘伯钦驱散虎蛇并与斑斓虎搏斗；猛虎与蛇群战斗化放大，不把救人的太白金星或刘伯钦设为敌人。毒蛇群魁为原著兽群的原创集体表现。'],
  ['两界山头','两界山五行山麓','封石魇王','压山石影',['封石幻灵','枯藤魔影'],'forest','原著非战斗磨难，原创守关幻境改编：唐僧揭帖解救悟空，以封石魇王表现五百年山封；孙悟空与山神是同行者及助力。依据第14回。'],
  ['陡涧换马','蛇盘山鹰愁涧','小白龙试炼幻身','涧浪龙影',['水鳞幻灵','涧蛇幻影'],'water','依据第15回：白龙吞马后与悟空交战，受点化成为龙马。采用剧情回响中的试炼幻身，水鳞与龙影随从为原创表现，不将归顺后的白龙作邪恶敌人。'],
  ['夜被火烧','观音禅院','贪焰魇王','炭烟幻影',['焰鼠幻灵','炭烟魔影'],'fire','原著非战斗磨难，原创守关幻境改编：金池长老贪袈裟引发夜火，以贪焰魇王表现火灾与贪念；观音及救火护法不是敌人。依据第16回。'],
  ['失却袈裟','黑风山黑风洞','黑熊精','凌虚子',['苍狼妖','黑风小妖','蛇妖'],'forest','依据第17回：黑熊精盗袈裟，苍狼精凌虚子与白衣秀士参与黑风山事件。'],
  ['收降八戒','高老庄云栈洞','猪刚鬣试炼幻身','云栈猪影',['山猪幻灵','石壁魔影'],'forest','依据第18—19回：悟空在高老庄、云栈洞收降猪刚鬣。首领采用归顺前剧情回响，随从是原创幻象，不将取经队伍的猪八戒持续设为邪恶角色。'],
  ['黄风怪阻','黄风岭黄风洞','黄风怪','虎先锋',['虎妖','黄风小妖','沙尘妖'],'sand','依据第20—21回：虎先锋掳走唐僧，黄风怪以三昧神风阻路；沙尘妖为神风的原创具象。'],
  ['请求灵吉','小须弥山求援道','风障魇王','迷途风影',['风障幻灵','沙旋魔影'],'sand','原著非战斗磨难，原创守关幻境改编：悟空赴小须弥山请灵吉菩萨，以风障魇王表现求援路上的风伤与迷障；灵吉是降妖援者。依据第21回。'],
  ['流沙难渡','流沙河岸','流沙河妖试炼幻身','河沙旋影',['沙水幻灵','浪骨幻影'],'water','依据第22回：流沙河妖拦截取经人，后受点化成为沙悟净。使用归顺前剧情回响，河沙随从为原创幻象。'],
  ['收得沙僧','流沙河九骷髅渡','沙悟净试炼幻身','骷髅浪影',['骷髅幻灵','水沙魔影'],'water','依据第22回：悟净受戒，以九骷髅与葫芦渡河。首领与随从为入队前事件的试炼回响，木叉与观音均为助力。'],
  ['四圣显化','四圣化宅','欲念魇王','锦帐幻影',['绮梦幻灵','贪欲魔影'],'temple','原著非战斗磨难，原创守关幻境改编：四圣化作母女考验禅心，以欲念魇王表现八戒动念；四位圣者不作为敌人。依据第23回。'],
  ['五庄观中','万寿山五庄观','贪果魇王','果园藤影',['果壳幻灵','青藤魔影'],'forest','原著非战斗磨难，原创守关幻境改编：偷食人参果、争执与推倒果树，以贪果魇王表现贪念；镇元大仙、清风与明月不作为邪恶敌人。依据第24—25回。'],
  ['难活人参','五庄观人参果园','枯根魇王','败叶幻影',['枯根幻灵','败叶魔影'],'forest','原著非战斗磨难，原创守关幻境改编：悟空访求医树之法，以枯根魇王表现果树生机受损；观音与镇元大仙是救树和解的助力。依据第25—26回。'],
  ['贬退心猿','白虎岭白骨洞','白骨夫人','白骨老妪幻身',['白骨妖','尸衣幻影'],'forest','依据第27回：白骨夫人三变试探，唐僧误解悟空后将其遣退；中期首领为同一白骨精的老妪化身，随从为尸魔主题演绎。'],
  ['黑松林失散','碗子山黑松林','黄袍怪','波月洞妖将',['波月小妖','狼妖','树魅'],'forest','依据第28回：唐僧在黑松林失散，误入碗子山波月洞被黄袍怪擒获；波月洞妖将为洞内小妖的原创统领。'],
  ['宝象国捎书','波月洞至宝象国','黄袍怪','波月洞巡山将',['波月小妖','宫墙妖影'],'temple','依据第29—30回：百花羞托信给宝象国，八戒与沙僧返波月洞救人并迎战黄袍怪。巡山将与妖影为同一事件的原创随从。'],
  ['金銮殿变虎','宝象国金銮殿','黄袍怪','宫殿狼影',['黄袍妖影','虎形幻灵'],'temple','依据第30—31回：黄袍怪把唐僧变作虎，悟空回归后识破奎木狼真身。狼影与虎形幻灵是法术的原创表现，百花羞不是敌人。'],
  ['平顶山逢魔','平顶山巡山道','银角大王','精细鬼',['巡山小妖','伶俐虫','山石妖影'],'forest','依据第32—33回：银角以山岳压住悟空，平顶山小妖精细鬼、伶俐虫带宝巡行；山石妖影为压山术的原创表现。'],
  ['莲花洞高悬','平顶山莲花洞','金角大王','银角大王',['精细鬼','伶俐虫','莲花洞小妖'],'fire','依据第33—35回：金角、银角在莲花洞以葫芦、净瓶、绳索等宝物设局，师徒遭吊缚。'],
  ['乌鸡国救主','乌鸡国宝林寺古井','青毛狮子怪','假王狮影',['井雾妖影','宫卫妖影'],'temple','依据第36—38回：真王托梦，师徒在井中救起乌鸡国王；青毛狮子怪是占国妖王，假王与宫卫妖影为其法术的原创回响。'],
  ['被魔化身','乌鸡国金銮殿','青毛狮子怪','假唐僧幻身',['狮鬃小妖','变形妖影'],'temple','依据第39回：青毛狮子怪变成唐僧混淆真假，文殊菩萨收回坐骑；中期首领为妖怪的假唐僧化身，文殊不是敌人。'],
  ['号山逢怪','号山枯松涧','红孩儿','火云洞巡山将',['火云小妖','烟火妖影'],'fire','依据第40回：红孩儿假扮受缚孩童，引师徒入局；巡山将与烟火妖影为火云洞小妖的原创战斗表现。'],
  ['风摄圣僧','号山火云洞外','红孩儿','妖风火影',['火云小妖','赤焰妖影'],'fire','依据第40—41回：红孩儿以妖风摄走唐僧。中期首领将摄人妖风原创具象化，地点与妖王延续火云洞事件。'],
  ['心猿遭害','火云洞三昧火场','红孩儿','三昧焰影',['烈焰小妖','火星妖影'],'fire','依据第41回：悟空受三昧真火与冷水激荡所伤，八戒、沙僧救醒。焰影与火星妖影为三昧火的原创具象。'],
  ['请圣降妖','号山火云洞','红孩儿','火云洞妖将',['火云小妖','焰枪妖影'],'fire','依据第42回：观音设莲台收伏红孩儿为善财童子，游戏重演收伏前的抵抗；观音是降妖援者，原创妖将统领火云随从。'],
  ['黑河沉没','黑水河水府','鼍龙怪','黑水河妖将',['黑水小妖','鼍甲妖影'],'water','依据第43回：鼍龙伪装船家沉船掳师，西海龙太子摩昂协助降妖；摩昂与西海龙王不是敌人，妖将与鼍甲影为原创随从。'],
  ['搬运车迟','车迟国役僧工地','虎力大仙','鹿力大仙',['役使道徒妖影','虎纹小妖'],'temple','依据第44回：车迟国三妖道压迫僧众搬运建材，悟空解救役僧；道徒妖影为压迫场景的原创战斗回响。'],
  ['大赌输赢','车迟国斗法坛','鹿力大仙','虎力大仙',['鹿角小妖','虎纹小妖','法坛妖影'],'temple','依据第45—46回：双方比求雨、坐禅、猜物、砍头与剖腹等法术；以鹿力、虎力对应妖道赌斗。小妖与法坛影为原创演绎。'],
  ['祛道兴僧','车迟国油锅法坛','羊力大仙','鹿角残影',['羊角小妖','油焰妖影'],'fire','依据第46回：羊力大仙油锅赌斗败亡，三妖显出虎、鹿、羊真形，僧众获释；鹿角残影与油焰妖影为斗法的原创表现。'],
  ['路逢大水','通天河陈家庄','灵感大王','鳜婆妖影',['鲤鱼妖','通天河水妖'],'water','依据第47回：通天河阻路，陈家庄被迫献童男女；灵感大王赴祭遭悟空、八戒迎击。鳜婆妖影取自后续水府献计者。'],
  ['身落天河','通天河冰面与水府','灵感大王','鳜婆',['寒水鱼妖','冰浪妖影'],'snow','依据第48回：灵感大王听鳜婆之计结冰诱渡，使唐僧坠河；冰浪妖影为冰裂场景的原创演绎。'],
  ['鱼篮现身','通天河灵感水府','灵感大王','水府鱼将',['水府小妖','鲤鳞妖影'],'water','依据第49回：观音携鱼篮收回莲池金鱼，解救唐僧；观音是援者，水府鱼将为原创小妖统领。'],
  ['金兜山遇怪','金兜山金兜洞','独角兕大王','金兜巡山将',['金兜小妖','牛角妖影'],'forest','依据第50回：独角兕大王以金刚琢套走兵器；难名采用原文缺字“⿰山兜山”的通行写法金兜山。巡山将与牛角影为原创随从。'],
  ['普天神难伏','金兜洞前斗法地','独角兕大王','金刚琢幻影',['金兜小妖','套兵环影'],'fire','依据第51—52回：哪吒、水火诸神的法器被金刚琢收走；诸神是助战者，金刚琢幻影与套兵环影为宝物法术的原创具象。'],
  ['问佛根源','灵山求援径','迷源魇王','疑障幻影',['疑念魔影','迷源幻灵'],'temple','原著非战斗磨难，原创守关幻境改编：悟空赴灵山问妖怪根源，以迷源魇王表现求援前的疑障；如来、罗汉与太上老君是指路、收妖助力。依据第52回。'],
  ['吃水遭毒','子母河与解阳山落胎泉','如意真仙','聚仙庵泉影',['泉雾妖影','守泉小妖'],'water','依据第53回：唐僧、八戒饮子母河水怀胎，悟空赴解阳山破如意真仙阻拦取得落胎泉水；泉影与守泉小妖为原创演绎。'],
  ['西梁国留婚','西梁女国王宫','情网魇王','锦婚幻影',['绮梦幻灵','丝结魔影'],'temple','原著非战斗磨难，原创守关幻境改编：女王留婚与师徒脱身，以情网魇王表现难舍的牵绊；女王、女官和女国百姓不是妖怪敌人。依据第54回。'],
  ['琵琶洞受苦','毒敌山琵琶洞','蝎子精','毒尾幻影',['蝎甲妖影','毒穴小妖'],'sand','依据第55回：蝎子精掳走唐僧，以倒马毒桩伤悟空、八戒；昴日星官是救援者，毒尾与蝎甲影为原著毒术的原创具象。'],
  ['再贬心猿','西行山道草寇林','离心魇王','争执幻影',['离心魔影','草寇幻象'],'forest','原著非战斗磨难，原创守关幻境改编：悟空打杀草寇后再被唐僧遣退，以离心魇王表现师徒失和；此处不是白骨精或六耳猕猴本体。依据第56回。'],
  ['难辨猕猴','花果山至辨真幻境','六耳猕猴','假悟空幻影',['假沙僧幻影','假八戒幻影','镜像猴影'],'forest','依据第57—58回：六耳猕猴假冒悟空并组织假取经队，最终在如来处辨真；随从皆为假形回响，真取经人、谛听与如来不是敌人。'],
  ['路阻火焰山','八百里火焰山','炎障魇王','火岭幻影',['热浪幻灵','焦岩魔影'],'fire','原著非战斗磨难，原创守关幻境改编：火焰山酷热阻路，以炎障魇王表现无法通行的火障；火焰山土地是指路援者。依据第59回。'],
  ['求取芭蕉扇','翠云山芭蕉洞','铁扇公主试炼幻身','罗刹风影',['风刃幻灵','蕉叶魔影'],'forest','依据第59—60回：悟空与罗刹女铁扇公主交手借扇；采用借扇前剧情回响，罗刹风影及风刃随从为原创法术表现。'],
  ['收缚魔王','积雷山至火焰山','牛魔王','玉面狐狸',['积雷山小妖','牛角妖影'],'fire','依据第60—61回：悟空、八戒与牛魔王斗法，天兵协助收伏，得真扇息火；玉面狐狸在摩云洞事件中出现。'],
  ['赛城扫塔','祭赛国金光寺宝塔','灞波儿奔','奔波儿灞',['鱼精小妖','塔内水影'],'temple','依据第62回：师徒在祭赛国金光寺扫塔，捉到夜守塔的鲇鱼精灞波儿奔与黑鱼精奔波儿灞；塔内水影为原创场景表现。'],
  ['取宝救僧','乱石山碧波潭','九头虫','万圣龙王',['碧波水妖','鱼精小妖'],'water','依据第63回：悟空、八戒赴碧波潭夺回佛宝，二郎神助战；万圣龙王与九头虫参与盗宝，二郎神不是敌人。'],
  ['棘林吟咏','荆棘岭木仙庵','诗墨魇王','缠枝幻影',['墨字幻灵','棘枝魔影'],'forest','原著非战斗磨难，原创守关幻境改编：树精留唐僧吟诗、杏仙求婚，以诗墨魇王表现迷留与缠绊；原创首领不冒充十八公等原著树精的新别号。依据第64回。'],
  ['小雷音遇难','小雷音寺金铙殿','黄眉怪','金铙幻影',['小雷音妖兵','铙光妖影'],'temple','依据第65回：黄眉怪冒充佛祖，以金铙困住悟空；敌人是冒充者及原创宝物幻影，真实佛祖与弥勒不是敌人。'],
  ['诸天神遭困','小雷音寺袋阵','黄眉怪','人种袋幻影',['小雷音妖兵','袋风妖影'],'temple','依据第66回：黄眉以人种袋困住诸神，弥勒收回童子与宝物；诸神和弥勒是助力，人种袋幻影为原创表现。'],
  ['稀柿同秽阻','七绝山稀柿同','红鳞大蟒','蟒尾幻影',['蛇蜕妖影','秽泥幻灵'],'forest','依据第67回：悟空降伏吞人的大蟒，八戒拱开七绝山稀柿同秽路。难名保留第99回“稀柿同”写法；蟒尾、蛇蜕与秽泥为原创具象。'],
  ['朱紫国行医','朱紫国宫廷诊所','病气魇王','沉疴幻影',['瘀气魔影','药渣幻灵'],'temple','原著非战斗磨难，原创守关幻境改编：悟空悬丝诊脉、配药为国王医治，以病气魇王表现疾病；国王、御医不是敌人，赛太岁留在后续降妖关。依据第68—69回。'],
  ['拯救疲癃','朱紫国王宫','瘀毒魇王','忧思幻影',['忧思魔影','瘀毒幻灵'],'temple','原著非战斗磨难，原创守关幻境改编：国王服药得救并陈述失后缘由，以瘀毒魇王表现积病与忧思；国王不是敌人。依据第69回。'],
  ['降妖取后','麒麟山獬豸洞','赛太岁','有来有去',['獬豸洞小妖','紫金铃烟影'],'fire','依据第70—71回：赛太岁以紫金铃放烟火，悟空取铃救回金圣宫；有来有去是传话小妖，烟影为铃术的原创具象，观音是收妖援者。'],
  ['七情迷没','盘丝岭盘丝洞','七蜘蛛精合阵','盘丝蛛影',['蛛丝小妖','浴泉蛛影'],'forest','依据第72回：七蜘蛛精设盘丝网擒唐僧。首领合阵是七只原著蜘蛛精的原创集体战斗形态，蛛影为法术随从。'],
  ['多目遭伤','黄花观','百眼魔君','蜘蛛精幻阵',['蜈蚣妖影','毒目幻灵'],'temple','依据第73回：蜈蚣精百眼魔君以多目金光伤人，毗蓝婆援救；蜘蛛精幻阵与毒目幻灵为原著联合设局的原创表现，毗蓝婆不是敌人。'],
  ['路阻狮驼','狮驼岭狮驼洞','青狮大王','小钻风',['巡山妖兵','狮驼小妖'],'forest','依据第74回：小钻风巡山，青狮、白象、大鹏三妖占狮驼岭，悟空入洞探路。'],
  ['怪分三色','狮驼岭三魔阵','白象大王','青狮大王',['象牙妖兵','狮鬃妖兵','鹏羽妖兵'],'forest','依据第75—76回：青狮吞人、白象卷鼻、大鹏持兵围困师徒。普通妖兵以三妖眷属为原创分类。'],
  ['城里遇灾','狮驼国城','金翅大鹏雕','白象大王',['狮驼城妖兵','鹏羽妖兵'],'temple','依据第76—77回：大鹏占据狮驼国，师徒入城后再被擒；不将该地误作金平府或金兜洞。'],
  ['请佛收魔','狮驼国降魔阵','金翅大鹏雕','青狮大王',['三魔残影','狮驼妖兵'],'temple','依据第77回：悟空请如来，文殊、普贤与佛祖收回三魔；重演收伏前妖魔抵抗，佛菩萨均是援者，三魔残影为原创法术表现。'],
  ['比丘救子','比丘国小子城','白鹿精国丈','白面狐狸精',['鹿角妖影','宫廷狐影'],'temple','依据第78回：白鹿精国丈与狐狸美后惑王谋害孩童，悟空请神保护儿童；战斗以祸首妖怪及原创妖影演绎，不将孩童、百姓或救援神灵设为敌人。'],
  ['辨认真邪','比丘国至清华洞','白鹿精','白面狐狸精',['清华洞小妖','鹿角妖影'],'forest','依据第79回：悟空识破妖国丈，追至清华洞，寿星收回白鹿，狐狸精被除；寿星不是敌人。'],
  ['松林救怪','黑松林','迷援魇王','缚树幻影',['鼠形幻灵','伪泣魔影'],'forest','原著非战斗磨难，原创守关幻境改编：地涌夫人假装被缚女子求救，以迷援魇王表现善心受骗；首领为原创心障，真实妖王在无底洞关登场。依据第80回。'],
  ['僧房卧病','镇海禅林寺僧房','病梦魇王','夜鼠幻影',['病梦幻灵','夜鼠魔影'],'temple','原著非战斗磨难，原创守关幻境改编：唐僧卧病寺中、鼠怪夜间作祟，以病梦魇王表现病弱与夜惊；僧人是受害者，原创鼠影指向后续无底洞事件。依据第81回。'],
  ['无底洞遭困','陷空山无底洞','地涌夫人','无底洞鼠将',['白毛鼠妖影','地穴小妖'],'forest','依据第82—83回：金鼻白毛老鼠精地涌夫人擒唐僧，李天王与哪吒收妖；鼠将为原创洞府统领，天王、哪吒不是敌人。'],
  ['灭法国难行','灭法国宝方客店','惧僧魇王','藏柜幻影',['惧念魔影','锁柜幻灵'],'temple','原著非战斗磨难，原创守关幻境改编：师徒藏柜避杀僧之令，悟空剃发使国王改心，以惧僧魇王表现暴政与恐惧；国王及民众不是妖怪敌人。依据第84—85回。'],
  ['隐雾山遇魔','隐雾山折岳连环洞','南山大王','分瓣梅花幻影',['豹斑小妖','雾中妖兵'],'forest','依据第85—86回：豹子精南山大王以分瓣梅花计掳师，制造假人头惑众；中期首领为该计策的原创法术具象。'],
  ['凤仙郡求雨','天竺外郡凤仙郡','旱瘴魇王','枯泉幻影',['旱尘幻灵','龟裂魔影'],'sand','原著非战斗磨难，原创守关幻境改编：师徒助郡侯改过、为百姓求雨，以旱瘴魇王表现旱灾；玉帝、雷公、电母、龙王均不是邪恶敌人。依据第87回。'],
  ['失落兵器','玉华州至豹头山虎口洞','黄狮精','刁钻古怪',['狼头小妖','豹头山妖兵'],'forest','依据第88—89回：黄狮精夜盗三件兵器，刁钻古怪、古怪刁钻采购宴用猪羊；玉华州王子与铁匠不是敌人。'],
  ['会庆钉钯','豹头山虎口洞','黄狮精','古怪刁钻',['狼头小妖','虎口洞妖兵'],'forest','依据第89回：黄狮精设庆钉钯会，师兄弟变装夺回兵器；难名保留第99回“钉钯”写法。'],
  ['竹节山遭难','竹节山九曲盘桓洞','九灵元圣','狻猊狮精',['抟象狮精','猱狮精','雪狮精'],'forest','依据第90回：九灵元圣率狮怪擒师徒与玉华州王父子；太乙救苦天尊与狮奴是收妖助力，不设为敌人。'],
  ['玄英洞受苦','青龙山玄英洞','辟寒大王','辟暑大王',['辟尘妖影','玄英洞小妖'],'snow','依据第91回：三犀假佛偷灯油、掳唐僧至玄英洞；辟寒、辟暑、辟尘为三只犀牛精，普通辟尘妖影是原创分身表现。'],
  ['赶捉犀牛','青龙山至西海岸','辟尘大王','辟寒大王',['犀角妖兵','玄英洞水妖影'],'water','依据第92回：三犀败逃海中，四木禽星与西海龙太子帮助捉妖；援者不是敌人，妖兵与水影为三犀逃亡的原创战斗演绎。'],
  ['天竺招婚','天竺国御花园与毛颖山','玉兔精','假公主幻影',['玉兔妖影','月杵幻灵'],'temple','依据第93—95回：玉兔假冒公主招唐僧成婚，悟空识破并追至毛颖山；太阴星君与嫦娥是收回玉兔的助力，假公主是妖怪化身。'],
  ['铜台府监禁','铜台府地灵县牢狱','冤狱魇王','盗赃幻影',['枷锁魔影','冤印幻灵'],'temple','原著非战斗磨难，原创守关幻境改编：寇员外遇害，师徒蒙冤被监禁，以冤狱魇王表现误判与枷锁；寇员外、官差和百姓不是妖怪敌人。依据第96—97回。'],
  ['凌云渡脱胎','灵山凌云渡','尘身魇王','执岸幻影',['尘身幻灵','执念魔影'],'water','原著非战斗磨难，原创守关幻境改编：接引佛撑无底船，唐僧渡河脱凡胎，以尘身魇王表现放下尘身的内在考验；接引佛是渡人援者。依据第98回。'],
  ['通天河遇鼋湿经书','通天河东岸晒经石','夺经阴魔','风雷阴魔',['风雾阴魔','雷电阴魔','湿墨妖影'],'water','依据第99回：老鼋因未获代问寿数而沉水，师徒与经书落水；登岸后阴魔以风、雾、雷、电暗夺真经，悟空护经至天明。首领名与湿墨妖影是原著阴魔的原创具象，老鼋不是邪恶妖王。'],
];

const STAGES = stageSeeds.map((entry, index) => {
  const [name, location, boss, midBoss, enemies, theme, sourceNote] = entry;
  const id = index + 1;
  const firstEncounter = id === 1 ? {
    name: '双叉岭遇妖', canonicalTrialName: name, encounterName: '双叉岭', location: '河州卫外·双叉岭', theme: 'forest',
    mapAssetKey: 'doublefork',
    adaptationNote: '首关按玩法规格重编为第13回双叉岭战斗；原历难簿名为“金蝉遭贬”，后80难保持原编号与难名。',
    boss: '双叉岭三妖', midBoss: '虎小首领',
    enemies: Object.freeze(['虎妖', '熊妖', '野牛妖', '苍狼妖', '猿妖', '鹿妖', '鹰妖', '蛇妖']),
    enemyRoster: Object.freeze([
      Object.freeze({ name: '虎妖', variant: 'tiger' }), Object.freeze({ name: '熊妖', variant: 'bear' }),
      Object.freeze({ name: '野牛妖', variant: 'bull' }), Object.freeze({ name: '苍狼妖', variant: 'wolf' }),
      Object.freeze({ name: '猿妖', variant: 'monkey' }), Object.freeze({ name: '鹿妖', variant: 'deer' }),
      Object.freeze({ name: '鹰妖', variant: 'hawk' }), Object.freeze({ name: '蛇妖', variant: 'snake' }),
    ]),
    // At five minutes the authored tiger vanguard is the chapter's mid-boss
    // encounter. It consumes the generic mid-boss slot so the scheduler must
    // not also create a second, unnamed boss at the same timestamp.
    // Identity only: no approved vanguard action sheet is bound yet.
    eliteEncounters: Object.freeze([Object.freeze({ at: 300, encounterId: 'tiger-vanguard', actionId: 'tiger-vanguard', name: '双叉岭虎先锋', variant: 'tiger', replacesMidBoss: true, xp: 30 })]),
    // The three guardians share the previous final encounter's total HP and
    // reward budget, preserving a ten-minute first-stage difficulty envelope.
    finalBosses: Object.freeze([
      // These IDs are identity contracts for a future boss-specific renderer;
      // they intentionally do not point at the ordinary animal battle sheets.
      Object.freeze({ bossId: 'yin-general', actionId: 'yin-general', name: '寅将军', variant: 'tiger', hpScale: .36, damageScale: .65, radius: 50, xp: 28, coin: 28, aliases: Object.freeze([]) }),
      Object.freeze({ bossId: 'xiong-shanjun', actionId: 'xiong-shanjun', name: '熊山君', variant: 'bear', hpScale: .34, damageScale: .65, radius: 54, xp: 28, coin: 28, aliases: Object.freeze([]) }),
      Object.freeze({ bossId: 'te-chushi', actionId: 'te-chushi', name: '特处士', variant: 'bull', hpScale: .30, damageScale: .65, radius: 52, xp: 24, coin: 24, aliases: Object.freeze(['待处士']) }),
    ]),
    description: '双叉岭：山林八兽阻路，虎先锋于五分钟登场；最终收伏寅将军、熊山君与特处士三妖。',
    sourceNote: '首关战斗改编据第13回双叉岭三妖：寅将军为虎精、熊山君为熊精、特处士为野牛精；“待处士”保留为别名。原第99回首难“金蝉遭贬”映射保留在canonicalTrialName，后80难保持难名与序号。',
  } : {};
  return Object.freeze({
    id, name, location, boss, midBoss, enemies: Object.freeze(enemies.slice()),
    theme, chapter: Math.min(9, Math.floor(index / 9) + 1),
    description: `${location}：${name}。破除${boss}守关之阵，守护取经愿心。`,
    sourceNote,
    ...firstEncounter,
  });
});

const TALENTS = [
  { id: 'iron-body', name: '金刚之躯', description: '提升最大生命。', maxLevel: 10, baseCost: 80, stat: 'maxHp', value: 0.035 },
  { id: 'swift-cloud', name: '筋斗云', description: '提升移动速度。', maxLevel: 10, baseCost: 80, stat: 'speed', value: 0.025 },
  { id: 'sharp-eye', name: '火眼金睛', description: '提升所有伤害。', maxLevel: 10, baseCost: 120, stat: 'damage', value: 0.03 },
  { id: 'fortune', name: '福缘', description: '提升经验与金币掉落。', maxLevel: 10, baseCost: 100, stat: 'pickup', value: 0.04 },
  { id: 'warding', name: '护法心灯', description: '减少受到的伤害。', maxLevel: 10, baseCost: 100, stat: 'damageReduction', value: 0.025 },
  { id: 'dash-master', name: '踏云步', description: '缩短闪避冷却。', maxLevel: 8, baseCost: 140, stat: 'dashCooldown', value: 0.045 },
];

const DAILY_CHALLENGES = [
  { id: 'daily-kills', name: '百妖除尽', description: '单局击败 300 名妖怪。', target: 300, reward: 120 },
  { id: 'daily-elite', name: '降伏精怪', description: '单局击败 3 名精英。', target: 3, reward: 150 },
  { id: 'daily-no-dash', name: '稳如金刚', description: '不使用闪避通关一难。', target: 1, reward: 220 },
  { id: 'daily-stage', name: '西行一程', description: '完成任意一难。', target: 1, reward: 100 },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

function getStage(index) {
  const id = Math.max(1, Math.min(STAGES.length, Number(index) || 1));
  return STAGES[id - 1];
}

// cooldown / linger / whirlDuration / knockback: seconds; range / radius /
// whirlRadius / width: world pixels. bounce is hops per light point;
// bounceTargets caps distinct enemies used by that point. whirlRadius is the
// vortex radius, independent of the ordinary spin attack's range.
const weaponTuning = {
  wukong: [
    { cooldown: 1, damage: 1, range: 115, arc: 1.15, heavyEvery: 0 },
    { cooldown: 0.75, damage: 1.05, range: 120, arc: 1.15, heavyEvery: 0 },
    { cooldown: 0.5, damage: 1.1, range: 125, arc: 1.25, heavyEvery: 3, heavyMultiplier: 2, heavyRadius: 1 },
    { cooldown: 0.5, damage: 1.2, range: 130, arc: 1.5, heavyEvery: 3, heavyMultiplier: 2.5, heavyRadius: 1.5 },
    { cooldown: 0.5, damage: 1.3, range: 140, arc: 1.6, heavyEvery: 3, heavyMultiplier: 3, heavyRadius: 2, stunChance: 0.3 },
  ],
  tangseng: [
    { cooldown: 1.5, damage: 1, range: 8 * 36, projectileSpeed: 430, radius: 9, linger: 0, bounce: 0, bounceTargets: 0, split: 0, knockback: 0 },
    { cooldown: 1.5, damage: 1.12, range: 8 * 36, projectileSpeed: 450, radius: 10, linger: 0.25, bounce: 0, bounceTargets: 0, split: 0, knockback: 0 },
    { cooldown: 1.5, damage: 1.22, range: 8 * 36, projectileSpeed: 470, radius: 11, linger: 0.5, bounce: 2, bounceTargets: 2, split: 5, knockback: 0 },
    { cooldown: 1.5, damage: 1.35, range: 8 * 36, projectileSpeed: 490, radius: 12, linger: 0.75, bounce: 3, bounceTargets: 3, split: 10, knockback: 0 },
    { cooldown: 1.5, damage: 1.5, range: 8 * 36, projectileSpeed: 520, radius: 13, linger: 1, bounce: 5, bounceTargets: 5, split: 15, knockback: 0.25 },
  ],
  bajie: [
    { cooldown: 1, damage: 1, range: 135, width: 28, bleed: 0.05, bleedTicks: [0.015, 0.015, 0.02], birds: 0, explosion: 0 },
    { cooldown: 1, damage: 1.1, range: 142.5, width: 35, bleed: 0.1, bleedTicks: [0.03, 0.03, 0.04], birds: 0, explosion: 0 },
    { cooldown: 1, damage: 1.2, range: 150, width: 42, bleed: 0.15, bleedTicks: [0.045, 0.045, 0.06], birds: 3, explosion: 0 },
    { cooldown: 1, damage: 1.3, range: 157.5, width: 49, bleed: 0.2, bleedTicks: [0.06, 0.06, 0.08], birds: 6, explosion: 0 },
    { cooldown: 1, damage: 1.45, range: 165, width: 56, bleed: 0.25, bleedTicks: [0.075, 0.075, 0.1], birds: 9, explosion: 64 },
  ],
  wujing: [
    { cooldown: 1.5, damage: 1, range: 76, whirlRadius: 0, whirlDuration: 0, whirlDamage: 0 },
    { cooldown: 1.25, damage: 1.08, range: 84, whirlRadius: 0, whirlDuration: 0, whirlDamage: 0 },
    { cooldown: 1, damage: 1.15, range: 92, whirlRadius: 18, whirlDuration: 1.5, whirlDamage: 0.05, whirlEvery: 5, pull: 0 },
    { cooldown: 0.75, damage: 1.25, range: 104, whirlRadius: 36, whirlDuration: 2, whirlDamage: 0.08, whirlEvery: 5, pull: 18 },
    { cooldown: 0.75, damage: 1.4, range: 116, whirlRadius: 36, whirlDuration: 3, whirlDamage: 0.12, whirlEvery: 5, pull: 42 },
  ],
};

function getWeaponStats(characterId, level = 1) {
  const list = weaponTuning[characterId] || weaponTuning.wukong;
  return clone(list[Math.max(1, Math.min(5, Number(level) || 1)) - 1]);
}

const artifactCooldowns = {
  'purple-gourd': [9, 7.5, 6.5, 5.5, 4.5], 'iron-fan': [8, 6.5, 6, 5, 4],
  'diamond-snare': [7, 6, 5.5, 5, 4], 'nine-dragon': [10, 9, 8, 7, 6],
  'lotus-lantern': [14, 14, 14, 11, 10], 'golden-rope': [12, 11, 10, 9, 8],
  'moon-mirror': [16, 13, 12, 10, 9], 'samadhi-fire': [11, 10, 9, 8, 7],
};
const artifactTuning = Object.fromEntries(ARTIFACTS.map((artifact) => [artifact.id,
  Array.from({ length: 5 }, (_, i) => ({
    level: i + 1,
    cooldown: artifactCooldowns[artifact.id]?.[i] || Math.max(2.5, artifact.cooldown * (1 - i * 0.1)),
    damage: 0.8 + i * 0.25,
    radius: 72 + i * 10,
    duration: 1.5 + i * 0.35,
    power: 1 + i * 0.18,
  })),
]));

function getArtifactStats(id, level = 1) {
  const list = artifactTuning[id] || artifactTuning[ARTIFACTS[0].id];
  return clone(list[Math.max(1, Math.min(5, Number(level) || 1)) - 1]);
}


Object.assign(module.exports,{BALANCE,CHARACTERS,ARTIFACTS,STAGES,TALENTS,DAILY_CHALLENGES,getStage,getWeaponStats,getArtifactStats});

},
"tiger-animation":function(module,exports,require){
// The ordinary chapter-one tiger owns this atlas. Elite/Boss tiger variants
// deliberately keep their separate rigs; a shared variant is not an art key.
const TIGER_SPRITE_ID = 'tiger-normal-v1';
const TIGER_FRAME_COUNTS = Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
const TIGER_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

function isBattleTiger(entity) {
  return entity?.battleSpriteId === TIGER_SPRITE_ID && entity.variant === 'tiger'
    && (entity.kind === 'normal' || (entity.kind === 'death' && entity.enemyKind === 'normal'));
}

function attachTigerFrames(image, contract) {
  const width = Number(image?.naturalWidth || image?.width);
  const height = Number(image?.naturalHeight || image?.height);
  if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
      || contract.referenceBodyHeight !== 130 || contract.sourceRects?.length !== 32
      || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
    throw new Error('Invalid ordinary tiger atlas dimensions/anchors');
  }
  const states = {};
  let expectedIndex = 0;
  for (const [state, count] of Object.entries(TIGER_FRAME_COUNTS)) {
    const sequence = contract.states?.[state];
    if (sequence?.length !== count) throw new Error(`Invalid tiger ${state} frame count`);
    states[state] = sequence.map(index => {
      if (index !== expectedIndex++) throw new Error('Invalid tiger frame order');
      const source = contract.sourceRects[index];
      const rootX = contract.previewRootXs[index % 8];
      const baseline = contract.previewBaselines[Math.floor(index / 8)];
      if (source?.index !== index || source.state !== state
          || ![source.x, source.y, source.w, source.h, rootX, baseline].every(Number.isFinite)
          || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
          || source.x + source.w > width || source.y + source.h > height) {
        throw new Error(`Invalid tiger source rectangle ${index}`);
      }
      return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline });
    });
    Object.freeze(states[state]);
  }
  image.__tigerBattleSprite = true;
  image.__prioritySprite = true;
  image.__tigerFrames = Object.freeze({ referenceBodyHeight: 130, states: Object.freeze(states) });
  return image;
}

function tigerDrawFrame(image, state, frameIndex, radius) {
  if (!image?.__tigerBattleSprite || !image.__tigerFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (TIGER_FRAME_COUNTS[state] ? state : 'idle');
  const frames = image.__tigerFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = frames[['idle', 'move'].includes(resolvedState) ? index % frames.length : Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__tigerFrames.referenceBodyHeight;
  // Keep a single source-pixel scale across all poses, including the prone
  // death poses. No stretch-to-fit, extra bob, rotation or squash is applied.
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}

Object.assign(module.exports,{TIGER_SPRITE_ID,TIGER_FRAME_COUNTS,TIGER_FPS,isBattleTiger,attachTigerFrames,tigerDrawFrame});

},
"bear-animation":function(module,exports,require){
// The ordinary chapter-one bear owns this atlas. Elite/Boss bear variants
// deliberately keep their separate rigs; a shared variant is not an art key.
const BEAR_SPRITE_ID = 'bear-normal-v1';
const BEAR_FRAME_COUNTS = Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
const BEAR_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

function isBattleBear(entity) {
  return entity?.battleSpriteId === BEAR_SPRITE_ID && entity.variant === 'bear'
    && (entity.kind === 'normal' || (entity.kind === 'death' && entity.enemyKind === 'normal'));
}

function attachBearFrames(image, contract) {
  const width = Number(image?.naturalWidth || image?.width);
  const height = Number(image?.naturalHeight || image?.height);
  if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
      || contract.referenceBodyHeight !== 136 || contract.sourceRects?.length !== 32
      || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
    throw new Error('Invalid ordinary bear atlas dimensions/anchors');
  }
  const states = {};
  let expectedIndex = 0;
  for (const [state, count] of Object.entries(BEAR_FRAME_COUNTS)) {
    const sequence = contract.states?.[state];
    if (sequence?.length !== count) throw new Error(`Invalid bear ${state} frame count`);
    states[state] = sequence.map(index => {
      if (index !== expectedIndex++) throw new Error('Invalid bear frame order');
      const source = contract.sourceRects[index];
      const rootX = contract.previewRootXs[index % 8];
      const baseline = contract.previewBaselines[Math.floor(index / 8)];
      if (source?.index !== index || source.state !== state
          || ![source.x, source.y, source.w, source.h, rootX, baseline].every(Number.isFinite)
          || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
          || source.x + source.w > width || source.y + source.h > height) {
        throw new Error(`Invalid bear source rectangle ${index}`);
      }
      return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline });
    });
    Object.freeze(states[state]);
  }
  image.__bearBattleSprite = true;
  image.__prioritySprite = true;
  image.__bearFrames = Object.freeze({ referenceBodyHeight: 136, states: Object.freeze(states) });
  return image;
}

function bearDrawFrame(image, state, frameIndex, radius) {
  if (!image?.__bearBattleSprite || !image.__bearFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (BEAR_FRAME_COUNTS[state] ? state : 'idle');
  const frames = image.__bearFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = frames[['idle', 'move'].includes(resolvedState) ? index % frames.length : Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__bearFrames.referenceBodyHeight;
  // Keep a single source-pixel scale across all poses, including the prone
  // death poses. No stretch-to-fit, extra bob, rotation or squash is applied.
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}

Object.assign(module.exports,{BEAR_SPRITE_ID,BEAR_FRAME_COUNTS,BEAR_FPS,isBattleBear,attachBearFrames,bearDrawFrame});

},
"bull-animation":function(module,exports,require){
// The ordinary chapter-one bull owns this atlas. Elite/Boss bull variants
// deliberately keep their separate rigs; a shared variant is not an art key.
const BULL_SPRITE_ID = 'bull-normal-v1';
const BULL_FRAME_COUNTS = Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
const BULL_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

function isBattleBull(entity) {
  return entity?.battleSpriteId === BULL_SPRITE_ID && entity.variant === 'bull'
    && (entity.kind === 'normal' || (entity.kind === 'death' && entity.enemyKind === 'normal'));
}

function attachBullFrames(image, contract) {
  const width = Number(image?.naturalWidth || image?.width);
  const height = Number(image?.naturalHeight || image?.height);
  if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
      || contract.referenceBodyHeight !== 150 || contract.sourceRects?.length !== 32
      || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
    throw new Error('Invalid ordinary bull atlas dimensions/anchors');
  }
  const states = {};
  let expectedIndex = 0;
  for (const [state, count] of Object.entries(BULL_FRAME_COUNTS)) {
    const sequence = contract.states?.[state];
    if (sequence?.length !== count) throw new Error(`Invalid bull ${state} frame count`);
    states[state] = sequence.map(index => {
      if (index !== expectedIndex++) throw new Error('Invalid bull frame order');
      const source = contract.sourceRects[index];
      const rootX = contract.previewRootXs[index % 8];
      const baseline = contract.previewBaselines[Math.floor(index / 8)];
      if (source?.index !== index || source.state !== state
          || ![source.x, source.y, source.w, source.h, rootX, baseline].every(Number.isFinite)
          || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
          || source.x + source.w > width || source.y + source.h > height) {
        throw new Error(`Invalid bull source rectangle ${index}`);
      }
      return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline });
    });
    Object.freeze(states[state]);
  }
  image.__bullBattleSprite = true;
  image.__prioritySprite = true;
  image.__bullFrames = Object.freeze({ referenceBodyHeight: 150, states: Object.freeze(states) });
  return image;
}

function bullDrawFrame(image, state, frameIndex, radius) {
  if (!image?.__bullBattleSprite || !image.__bullFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (BULL_FRAME_COUNTS[state] ? state : 'idle');
  const frames = image.__bullFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = frames[['idle', 'move'].includes(resolvedState) ? index % frames.length : Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__bullFrames.referenceBodyHeight;
  // Keep a single source-pixel scale across all poses, including the prone
  // death poses. No stretch-to-fit, extra bob, rotation or squash is applied.
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}

Object.assign(module.exports,{BULL_SPRITE_ID,BULL_FRAME_COUNTS,BULL_FPS,isBattleBull,attachBullFrames,bullDrawFrame});

},
"wolf-animation":function(module,exports,require){
// The ordinary chapter-one wolf owns this atlas. Named/elite/Boss wolf
// variants deliberately keep their vector rigs; a shared variant is not an
// art key.
const WOLF_SPRITE_ID = 'wolf-normal-v1';
const WOLF_FRAME_COUNTS = Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
const WOLF_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

function isBattleWolf(entity) {
  return entity?.battleSpriteId === WOLF_SPRITE_ID && entity.variant === 'wolf'
    && (entity.kind === 'normal' || (entity.kind === 'death' && entity.enemyKind === 'normal'));
}

function attachWolfFrames(image, contract) {
  const width = Number(image?.naturalWidth || image?.width);
  const height = Number(image?.naturalHeight || image?.height);
  if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
      || contract.referenceBodyHeight !== 170 || contract.sourceRects?.length !== 32
      || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
    throw new Error('Invalid ordinary wolf atlas dimensions/anchors');
  }
  const states = {};
  let expectedIndex = 0;
  for (const [state, count] of Object.entries(WOLF_FRAME_COUNTS)) {
    const sequence = contract.states?.[state];
    if (sequence?.length !== count) throw new Error(`Invalid wolf ${state} frame count`);
    states[state] = sequence.map(index => {
      if (index !== expectedIndex++) throw new Error('Invalid wolf frame order');
      const source = contract.sourceRects[index];
      const rootX = contract.previewRootXs[index % 8];
      const baseline = contract.previewBaselines[Math.floor(index / 8)];
      if (source?.index !== index || source.state !== state
          || ![source.x, source.y, source.w, source.h, rootX, baseline].every(Number.isFinite)
          || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
          || source.x + source.w > width || source.y + source.h > height) {
        throw new Error(`Invalid wolf source rectangle ${index}`);
      }
      return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline });
    });
    Object.freeze(states[state]);
  }
  image.__wolfBattleSprite = true;
  image.__prioritySprite = true;
  image.__wolfFrames = Object.freeze({ referenceBodyHeight: 170, states: Object.freeze(states) });
  return image;
}

function wolfDrawFrame(image, state, frameIndex, radius) {
  if (!image?.__wolfBattleSprite || !image.__wolfFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (WOLF_FRAME_COUNTS[state] ? state : 'idle');
  const frames = image.__wolfFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = frames[['idle', 'move'].includes(resolvedState) ? index % frames.length : Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__wolfFrames.referenceBodyHeight;
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}

Object.assign(module.exports,{WOLF_SPRITE_ID,WOLF_FRAME_COUNTS,WOLF_FPS,isBattleWolf,attachWolfFrames,wolfDrawFrame});

},
"monkey-animation":function(module,exports,require){
// The ordinary chapter-one monkey owns this atlas. Elite/Boss monkey variants
// deliberately keep their separate rigs; a shared variant is not an art key.
const MONKEY_SPRITE_ID = 'monkey-normal-v1';
const MONKEY_FRAME_COUNTS = Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
const MONKEY_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

function isBattleMonkey(entity) {
  return entity?.battleSpriteId === MONKEY_SPRITE_ID && entity.variant === 'monkey'
    && (entity.kind === 'normal' || (entity.kind === 'death' && entity.enemyKind === 'normal'));
}

function attachMonkeyFrames(image, contract) {
  const width = Number(image?.naturalWidth || image?.width);
  const height = Number(image?.naturalHeight || image?.height);
  if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
      || contract.referenceBodyHeight !== 165 || contract.sourceRects?.length !== 32
      || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
    throw new Error('Invalid ordinary monkey atlas dimensions/anchors');
  }
  const states = {};
  let expectedIndex = 0;
  for (const [state, count] of Object.entries(MONKEY_FRAME_COUNTS)) {
    const sequence = contract.states?.[state];
    if (sequence?.length !== count) throw new Error(`Invalid monkey ${state} frame count`);
    states[state] = sequence.map(index => {
      if (index !== expectedIndex++) throw new Error('Invalid monkey frame order');
      const source = contract.sourceRects[index];
      const rootX = contract.previewRootXs[index % 8];
      const baseline = contract.previewBaselines[Math.floor(index / 8)];
      if (source?.index !== index || source.state !== state
          || ![source.x, source.y, source.w, source.h, rootX, baseline].every(Number.isFinite)
          || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
          || source.x + source.w > width || source.y + source.h > height) {
        throw new Error(`Invalid monkey source rectangle ${index}`);
      }
      return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline });
    });
    Object.freeze(states[state]);
  }
  image.__monkeyBattleSprite = true;
  image.__prioritySprite = true;
  image.__monkeyFrames = Object.freeze({ referenceBodyHeight: 165, states: Object.freeze(states) });
  return image;
}

function monkeyDrawFrame(image, state, frameIndex, radius) {
  if (!image?.__monkeyBattleSprite || !image.__monkeyFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (MONKEY_FRAME_COUNTS[state] ? state : 'idle');
  const frames = image.__monkeyFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = frames[['idle', 'move'].includes(resolvedState) ? index % frames.length : Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__monkeyFrames.referenceBodyHeight;
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}

Object.assign(module.exports,{MONKEY_SPRITE_ID,MONKEY_FRAME_COUNTS,MONKEY_FPS,isBattleMonkey,attachMonkeyFrames,monkeyDrawFrame});

},
"deer-animation":function(module,exports,require){
// The ordinary chapter-one deer owns this atlas. Elite/Boss deer variants
// deliberately keep their separate rigs; a shared variant is not an art key.
const DEER_SPRITE_ID = 'deer-normal-v1';
const DEER_FRAME_COUNTS = Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
const DEER_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

function isBattleDeer(entity) {
  return entity?.battleSpriteId === DEER_SPRITE_ID && entity.variant === 'deer'
    && (entity.kind === 'normal' || (entity.kind === 'death' && entity.enemyKind === 'normal'));
}

function attachDeerFrames(image, contract) {
  const width = Number(image?.naturalWidth || image?.width);
  const height = Number(image?.naturalHeight || image?.height);
  if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
      || contract.referenceBodyHeight !== 205 || contract.sourceRects?.length !== 32
      || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
    throw new Error('Invalid ordinary deer atlas dimensions/anchors');
  }
  const states = {};
  let expectedIndex = 0;
  for (const [state, count] of Object.entries(DEER_FRAME_COUNTS)) {
    const sequence = contract.states?.[state];
    if (sequence?.length !== count) throw new Error(`Invalid deer ${state} frame count`);
    states[state] = sequence.map(index => {
      if (index !== expectedIndex++) throw new Error('Invalid deer frame order');
      const source = contract.sourceRects[index];
      const rootX = contract.previewRootXs[index % 8];
      const baseline = contract.previewBaselines[Math.floor(index / 8)];
      if (source?.index !== index || source.state !== state
          || ![source.x, source.y, source.w, source.h, rootX, baseline].every(Number.isFinite)
          || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
          || source.x + source.w > width || source.y + source.h > height) {
        throw new Error(`Invalid deer source rectangle ${index}`);
      }
      // The authored idle-7 pose faces left; normalize that source pose before
      // applying the actor's direction. Keep the original PNG bytes unchanged.
      return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline, mirrorX: index === 7 });
    });
    Object.freeze(states[state]);
  }
  image.__deerBattleSprite = true;
  image.__prioritySprite = true;
  image.__deerFrames = Object.freeze({ referenceBodyHeight: 205, states: Object.freeze(states) });
  return image;
}

function deerDrawFrame(image, state, frameIndex, radius) {
  if (!image?.__deerBattleSprite || !image.__deerFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (DEER_FRAME_COUNTS[state] ? state : 'idle');
  const frames = image.__deerFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = ['idle', 'move'].includes(resolvedState) ? frames[index % frames.length] : frames[Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__deerFrames.referenceBodyHeight;
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h, mirrorX: frame.mirrorX,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}

Object.assign(module.exports,{DEER_SPRITE_ID,DEER_FRAME_COUNTS,DEER_FPS,isBattleDeer,attachDeerFrames,deerDrawFrame});

},
"hawk-animation":function(module,exports,require){
// The ordinary chapter-one hawk owns this atlas. Elite/Boss hawk variants
// deliberately keep their separate rigs; a shared variant is not an art key.
const HAWK_SPRITE_ID = 'hawk-normal-v1';
const HAWK_FRAME_COUNTS = Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
const HAWK_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

function isBattleHawk(entity) {
  return entity?.battleSpriteId === HAWK_SPRITE_ID && entity.variant === 'hawk'
    && (entity.kind === 'normal' || (entity.kind === 'death' && entity.enemyKind === 'normal'));
}

function attachHawkFrames(image, contract) {
  const width = Number(image?.naturalWidth || image?.width);
  const height = Number(image?.naturalHeight || image?.height);
  if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
      || contract.referenceBodyHeight !== 180 || contract.sourceRects?.length !== 32
      || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
    throw new Error('Invalid ordinary hawk atlas dimensions/anchors');
  }
  const states = {};
  let expectedIndex = 0;
  for (const [state, count] of Object.entries(HAWK_FRAME_COUNTS)) {
    const sequence = contract.states?.[state];
    if (sequence?.length !== count) throw new Error(`Invalid hawk ${state} frame count`);
    states[state] = sequence.map(index => {
      if (index !== expectedIndex++) throw new Error('Invalid hawk frame order');
      const source = contract.sourceRects[index];
      const rootX = contract.previewRootXs[index % 8];
      const baseline = contract.previewBaselines[Math.floor(index / 8)];
      if (source?.index !== index || source.state !== state
          || ![source.x, source.y, source.w, source.h, rootX, baseline].every(Number.isFinite)
          || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
          || source.x + source.w > width || source.y + source.h > height) {
        throw new Error(`Invalid hawk source rectangle ${index}`);
      }
      return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline });
    });
    Object.freeze(states[state]);
  }
  image.__hawkBattleSprite = true;
  image.__prioritySprite = true;
  image.__hawkFrames = Object.freeze({ referenceBodyHeight: 180, states: Object.freeze(states) });
  return image;
}

function hawkDrawFrame(image, state, frameIndex, radius) {
  if (!image?.__hawkBattleSprite || !image.__hawkFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (HAWK_FRAME_COUNTS[state] ? state : 'idle');
  const frames = image.__hawkFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = ['idle', 'move'].includes(resolvedState) ? frames[index % frames.length] : frames[Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__hawkFrames.referenceBodyHeight;
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}

Object.assign(module.exports,{HAWK_SPRITE_ID,HAWK_FRAME_COUNTS,HAWK_FPS,isBattleHawk,attachHawkFrames,hawkDrawFrame});

},
"snake-animation":function(module,exports,require){
// The ordinary chapter-one snake owns this atlas. Elite/Boss snake variants
// deliberately keep their separate rigs; a shared variant is not an art key.
const SNAKE_SPRITE_ID = 'snake-normal-v3';
const SNAKE_FRAME_COUNTS = Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 });
const SNAKE_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

function isBattleSnake(entity) {
  return entity?.battleSpriteId === SNAKE_SPRITE_ID && entity.variant === 'snake'
    && (entity.kind === 'normal' || (entity.kind === 'death' && entity.enemyKind === 'normal'));
}

function attachSnakeFrames(image, contract) {
  const width = Number(image?.naturalWidth || image?.width);
  const height = Number(image?.naturalHeight || image?.height);
  if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
      || contract.referenceBodyHeight !== 170 || contract.sourceRects?.length !== 32
      || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
    throw new Error('Invalid ordinary snake atlas dimensions/anchors');
  }
  const states = {};
  let expectedIndex = 0;
  for (const [state, count] of Object.entries(SNAKE_FRAME_COUNTS)) {
    const sequence = contract.states?.[state];
    if (sequence?.length !== count) throw new Error(`Invalid snake ${state} frame count`);
    states[state] = sequence.map(index => {
      if (index !== expectedIndex++) throw new Error('Invalid snake frame order');
      const source = contract.sourceRects[index];
      const rootX = contract.previewRootXs[index % 8];
      const baseline = contract.previewBaselines[Math.floor(index / 8)];
      if (source?.index !== index || source.state !== state
          || ![source.x, source.y, source.w, source.h, rootX, baseline].every(Number.isFinite)
          || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
          || source.x + source.w > width || source.y + source.h > height) {
        throw new Error(`Invalid snake source rectangle ${index}`);
      }
      // Source idle-4 faces left. Normalize it before the entity facing is
      // applied; retain the original PNG and the same fixed root/scale.
      return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline, mirrorX: index === 4 });
    });
    Object.freeze(states[state]);
  }
  image.__snakeBattleSprite = true;
  image.__prioritySprite = true;
  image.__snakeFrames = Object.freeze({ referenceBodyHeight: 170, states: Object.freeze(states) });
  return image;
}

function snakeDrawFrame(image, state, frameIndex, radius) {
  if (!image?.__snakeBattleSprite || !image.__snakeFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (SNAKE_FRAME_COUNTS[state] ? state : 'idle');
  const frames = image.__snakeFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = ['idle', 'move'].includes(resolvedState) ? frames[index % frames.length] : frames[Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__snakeFrames.referenceBodyHeight;
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h, mirrorX: frame.mirrorX,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}

Object.assign(module.exports,{SNAKE_SPRITE_ID,SNAKE_FRAME_COUNTS,SNAKE_FPS,isBattleSnake,attachSnakeFrames,snakeDrawFrame});

},
"boss-animation":function(module,exports,require){
// Dedicated atlases for the three named first-stage final bosses.
// Binding is identity-only: an entity must carry the engine-issued
// battleSpriteId AND the matching frozen bossIdentity. Variant, name or a
// copied sprite ID alone never suffices, and ordinary species atlases are
// never used for these bosses (or vice versa). Mid-bosses (including the
// tiger vanguard) and later-stage bosses stay on the vector identity rig
// until they receive their own scoped contracts.
const BOSS_FPS = Object.freeze({ idle: 8, move: 12, attack: 16, hit: 16, death: 10 });

const BOSS_DEFS = Object.freeze({
  'yin-general': Object.freeze({
    bossId: 'yin-general', spriteId: 'yin-general-boss-v1', referenceBodyHeight: 168,
    frameCounts: Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 }), healthBarOffset: 2.85,
  }),
  'xiong-shanjun': Object.freeze({
    bossId: 'xiong-shanjun', spriteId: 'xiong-shanjun-boss-v1', referenceBodyHeight: 190,
    frameCounts: Object.freeze({ idle: 8, move: 8, attack: 8, hit: 4, death: 4 }), healthBarOffset: 2.9,
  }),
  'te-chushi': Object.freeze({
    bossId: 'te-chushi', spriteId: 'te-chushi-boss-v1', referenceBodyHeight: 165,
    // The authored sheet genuinely contains seven move and seven attack
    // poses; the counts record that instead of padding with duplicates.
    frameCounts: Object.freeze({ idle: 8, move: 7, attack: 7, hit: 4, death: 4 }), healthBarOffset: 2.8,
  }),
});

function bossSpriteIdFor(bossId) {
  return BOSS_DEFS[bossId]?.spriteId || null;
}

function isBattleBoss(entity, bossId) {
  const def = BOSS_DEFS[bossId];
  return Boolean(def) && entity?.battleSpriteId === def.spriteId
    && entity.bossIdentity?.bossId === bossId
    && (entity.kind === 'boss' || (entity.kind === 'death' && entity.enemyKind === 'boss'));
}

function attachBossFrames(bossId) {
  const def = BOSS_DEFS[bossId];
  if (!def) throw new Error(`Unknown boss atlas: ${bossId}`);
  const totalFrames = Object.values(def.frameCounts).reduce((sum, count) => sum + count, 0);
  return function attach(image, contract) {
    const width = Number(image?.naturalWidth || image?.width);
    const height = Number(image?.naturalHeight || image?.height);
    if (width !== 1774 || height !== 887 || contract?.size?.[0] !== width || contract?.size?.[1] !== height
        || contract.referenceBodyHeight !== def.referenceBodyHeight || contract.sourceRects?.length !== totalFrames
        || contract.previewRootXs?.length !== 8 || contract.previewBaselines?.length !== 4) {
      throw new Error(`Invalid ${bossId} boss atlas dimensions/anchors`);
    }
    const states = {};
    let expectedIndex = 0;
    // Rows cannot be derived from the global index: te-chushi legitimately
    // has 8/7/7/8 frames per row. Each rectangle instead proves its own
    // cell — poses are bottom-aligned on a row baseline and horizontally
    // centered on a column root (both within a pixel in these contracts).
    const expectedRow = { idle: 0, move: 1, attack: 2, hit: 3, death: 3 };
    for (const [state, count] of Object.entries(def.frameCounts)) {
      const sequence = contract.states?.[state];
      if (sequence?.length !== count) throw new Error(`Invalid ${bossId} ${state} frame count`);
      states[state] = sequence.map(index => {
        if (index !== expectedIndex++) throw new Error(`Invalid ${bossId} frame order`);
        const source = contract.sourceRects[index];
        if (source?.index !== index || source.state !== state
            || ![source.x, source.y, source.w, source.h].every(Number.isFinite)
            || source.x < 0 || source.y < 0 || source.w <= 0 || source.h <= 0
            || source.x + source.w > width || source.y + source.h > height) {
          throw new Error(`Invalid ${bossId} source rectangle ${index}`);
        }
        const bottom = source.y + source.h;
        let row = -1, rowDistance = Infinity;
        contract.previewBaselines.forEach((baseline, i) => {
          const distance = Math.abs(baseline - bottom);
          if (distance < rowDistance) { rowDistance = distance; row = i; }
        });
        const col = Math.min(7, Math.max(0, Math.floor((source.x + source.w / 2) / (width / 8))));
        const rootX = contract.previewRootXs[col];
        if (row !== expectedRow[state] || rowDistance > 3 || !Number.isFinite(rootX)
            || Math.abs(rootX - (source.x + source.w / 2)) > 4) {
          throw new Error(`Invalid ${bossId} source rectangle ${index} anchors`);
        }
        return Object.freeze({ x: source.x, y: source.y, w: source.w, h: source.h, rootX, baseline: contract.previewBaselines[row] });
      });
      Object.freeze(states[state]);
    }
    image.__bossBattleSprite = true;
    image.__prioritySprite = true;
    image.__bossSpriteId = def.spriteId;
    image.__bossFrames = Object.freeze({ referenceBodyHeight: def.referenceBodyHeight, states: Object.freeze(states) });
    return image;
  };
}

function bossDrawFrame(bossId, image, state, frameIndex, radius) {
  const def = BOSS_DEFS[bossId];
  if (!def || !image?.__bossBattleSprite || image.__bossSpriteId !== def.spriteId || !image.__bossFrames) return null;
  const resolvedState = state === 'stun' ? 'hit' : (def.frameCounts[state] ? state : 'idle');
  const frames = image.__bossFrames.states[resolvedState];
  const index = Math.max(0, Math.floor(Number(frameIndex) || 0));
  const frame = frames[['idle', 'move'].includes(resolvedState) ? index % frames.length : Math.min(index, frames.length - 1)];
  const scale = radius * 3.2 / image.__bossFrames.referenceBodyHeight;
  // One source-pixel scale across all poses, exactly like the species
  // atlases: no stretch-to-fit, bob, rotation or squash.
  return { x: frame.x, y: frame.y, w: frame.w, h: frame.h,
    dx: (frame.x - frame.rootX) * scale, dy: radius * .7 + (frame.y - frame.baseline) * scale,
    dw: frame.w * scale, dh: frame.h * scale };
}

Object.assign(module.exports,{BOSS_FPS,BOSS_DEFS,bossSpriteIdFor,isBattleBoss,attachBossFrames,bossDrawFrame});

},
"skill-fx-animation":function(module,exports,require){
/*
 * 西游·八十一难 — authored skill-effect sprite strips
 *
 * The four signature weapons fire constantly, so their battle effects are
 * the most-seen animation in the game.  Each effect kind can be backed by
 * a painted horizontal strip (square cells, one row) generated for this
 * project:
 *
 *   sweep / heavy-sweep (Wukong)  -> 'slash-arc'  golden staff slash
 *   light-orb projectile (Sanzang)-> 'light-orb'  pulsing prayer orb
 *   hoe-line (Bajie)              -> 'rake-sweep' rake energy streak
 *   staff-ring (Wujing)           -> 'water-ring' expanding water ring
 *
 * Frames advance with the effect's own progress (ttl), so the animation
 * always matches the gameplay timing; the orb loops on renderer time
 * instead.  When a strip has not loaded (or the platform supplies none,
 * as on WeChat), the renderer keeps its procedural vector effect — this
 * module only ever upgrades the pixels, never the mechanics.
 */

const SKILL_FX = Object.freeze({
  'slash-arc': Object.freeze({ cell: 256, frames: 6 }),
  'light-orb': Object.freeze({ cell: 256, frames: 6 }),
  'rake-sweep': Object.freeze({ cell: 256, frames: 6 }),
  'water-ring': Object.freeze({ cell: 256, frames: 6 }),
  // Acquired-artifact effects (playtest line, 2026-10-22): the treasures a
  // run picks up get the same painted treatment as the signature weapons.
  'fan-wave': Object.freeze({ cell: 256, frames: 6 }),
  'gourd-vortex': Object.freeze({ cell: 256, frames: 6 }),
  'palm-burst': Object.freeze({ cell: 256, frames: 6 }),
  'fire-burst': Object.freeze({ cell: 256, frames: 6 }),
  // Acquired-artifact batch 2 (2026-10-22): the wind-fire wheel and the
  // Qiankun ring are projectiles (routed in _drawProjectile like the orb);
  // the golden rope beads and the wheel's fire trail are effects.
  'fire-wheel': Object.freeze({ cell: 256, frames: 6 }),
  'ring-spin': Object.freeze({ cell: 256, frames: 6 }),
  'gold-bead': Object.freeze({ cell: 256, frames: 6 }),
  'fire-pool': Object.freeze({ cell: 256, frames: 6 }),
  // Batch 3 (2026-10-22): the seventy-two-changes wooden monkey clones and
  // Wujing's water whirl pools complete the acquired-skill set.
  'monkey-clone': Object.freeze({ cell: 256, frames: 6 }),
  'whirl-pool': Object.freeze({ cell: 256, frames: 6 }),
});

// The effect kinds each strip serves.  Signature kinds come from the
// weapon code paths; artifact kinds from fireArtifact in the engine.
function skillFxIdForEffect(kind) {
  if (kind === 'sweep' || kind === 'heavy-sweep') return 'slash-arc';
  if (kind === 'hoe-line') return 'rake-sweep';
  if (kind === 'staff-ring') return 'water-ring';
  if (kind === 'fan') return 'fan-wave';
  if (kind === 'gourd') return 'gourd-vortex';
  if (kind === 'palm-strike') return 'palm-burst';
  if (kind === 'mountain') return 'fire-burst';
  if (kind === 'bead' || kind === 'skull-bead') return 'gold-bead';
  if (kind === 'fire-trail' || kind === 'fire-pool') return 'fire-pool';
  if (kind === 'monkey-clone') return 'monkey-clone';
  if (kind === 'whirl') return 'whirl-pool';
  return null;
}

function attachSkillFx(image, fxId) {
  const def = SKILL_FX[fxId];
  if (!def || !image) return null;
  const width = Number(image.naturalWidth || image.width || 0);
  const height = Number(image.naturalHeight || image.height || 0);
  if (width !== def.cell * def.frames || height !== def.cell) return null;
  image.__skillFx = fxId;
  return image;
}

function skillFxReady(image) {
  return !!(image && SKILL_FX[image.__skillFx]);
}

// Source rect for a phase in [0, 1].  Phases outside the range clamp to
// the first/last frame so a long-lived effect never samples outside the
// strip.
function skillFxFrameRect(image, phase) {
  const def = image && SKILL_FX[image.__skillFx];
  if (!def) return null;
  const p = Math.min(0.9999, Math.max(0, Number(phase) || 0));
  const frame = Math.floor(p * def.frames);
  return { x: frame * def.cell, y: 0, w: def.cell, h: def.cell, frame, frames: def.frames };
}

Object.assign(module.exports,{SKILL_FX,skillFxIdForEffect,attachSkillFx,skillFxReady,skillFxFrameRect});

},
"scene-collision":function(module,exports,require){
// Scene collision masks for the painted chapter scenes (playtest line,
// 2026-10-23). The painted scenes are arena illustrations: an open plaza
// surrounded by terrain masses — mountains, cliffs, rivers, lava, ponds,
// ruins. These 120x120 bitmasks (15 world units per cell, row-major,
// 1 = blocked) were traced from the artwork as rendered (forest/temple in
// their center-cropped cover view) so movement collision matches the
// background: actors can no longer walk through mountains, rivers, lava
// or buildings, or climb onto the painted sky. Doublefork's mask adds
// its side massifs and sky strip on top of its authored ridge rule in
// engine.js (both must pass). Masks were baked by
// evidence/current/scene-collision/build_scene_collision.py — regenerate
// there, never hand-edit the base64.
const SCENE_MASK_COLS = 120;
const SCENE_MASK_ROWS = 120;
const SCENE_MASKS = Object.freeze({
  water: '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+D/////////////////+AAAAB/////////////+AAAAAAAP///////////AAAAAAAAAA/////////4AAAAAAAAAAAP///////gAAAAAAAAAAAAP/////8AAAAAAAAAAAAAP/////wAAAAAAAAAAAAAf////+AAAAAAAAAAAAAAf////4AAAAAAAAAAAAAAf////AAAAAAAAAAAAAAA////4AAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAB///4AAAAAAAAAAAAAAAB///gAAAAAAAAAAAAAAAB///gAAAAAAAAAAAAAAAD///gAAAAAAAAAAAAAAAD///gAAAAAAAAAAAAAAAH///gAAAAAAAAAAAAAAAH///gAAAAAAAAAAAAAAAH///gAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAH///AAAAAAAAAAAAAAAAH///AAAAAAAAAAAAAAAAH///AAAAAAAAAAAAAAAAH///gAAAAAAAAAAAAAAAH///gAAAAAAAAAAAAAAAH///wAAAAAAAAAAAAAAAD///wAAAAAAAAAAAAAAAD///4AAAAAAAAAAAAAAAD///4AAAAAAAAAAAAAAAD///8AAAAAAAAAAAAAAAD///8AAAAAAAAAAAAAAAD///+AAAAAAAAAAAAAAAD////AAAAAAAAAAAAAAAB////4AAAAAAAAAAAAAAB/////AAAAAAAAAAAAAAB/////wAAAAAAAAAAAAAB/////4AAAAAAAAAAAAAB/////4AAAAAAAAAAAAAB/////4AAAAAAAAAAAAAB/////4AAAAAAAAAAAAAA/////4AAAAAAAAAAAAAA/////4AAAAAAAAAAAAAA/////4AAAAAAAAAAAAAB/////8AAAAAAAAAAAAAB/////8AAAAAAAAAAAB/D/////8AAAAAAAAAAD//j/////8AAAAAAAAAAP//3/////4AAAAAAAAAAf////////wAAAAAAAAAB//////8AAAAAAAAAAAAH//////8AAAAAAAAAAAAP//////8AAAAAAAAAAAAf//////8AAAAAAAAAAAAf//////8AAAAAAAAAAAAf//////8AAAAAAAAAAAAf//////8AAAAAAAAAAAAf//////8AAAAAAAAAAAAf//////8AAAAAAAAAAAAf//////8AAAAAAAAAAAAf//////8AAAAAAAAAAAAf//////8AAAAQAAAAAAB///////8AAAAYAAAAAD////////8AAAAcAAAAH/////////8AAAAf/gAP//////////8AAAAf//////////////8AAAAf//////////////8AAAAf//////////////8AAAAf//////////////8AAAAf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////',
  fire: '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+H//////////////////8AP/////////////////8AH/////////////////4AD/////////////////4AA//////////+//////wAA//8AB/////wf/////gAA//AAAP7//8Af/////gAB/wAAAAAP/AAP/////AAB//AAAAAAwAAP////wAAB//gAAAAAAAAH8Af4AAAB//gAAAAAAAAHAAAAAAAB//wAAAAAAAAAAAAAAAAB//wAAAAAAAAAAAAAAAAB//wAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAB//8AAAAAAAAAAAAAAAAB//8AAAAAAAAAAAAAAAAD//8AAAAAAAAAAAAAAAAD//+AAAAAAAAAAAAAAAAH//+AAAAAAAAAAAAAAAAH//+AAAAAAAAAAAAAAAAP///AAAAAAAAAAAAAAAAf///AAAAAAAAAAAAAAAAf///AAAAAAAAAAAAAAAA////gAAAAAAAAAAAAAAA////gAAAAAAAAAAAAAAA////gAAAAAAAAAAAAAAA////gAAAAAAAAAAAAAAA////wAAAAAAAAAAAAAAA////wAAAAAAAAAAAAAAAf///wAAAAAAAAAAAAAAAf///4AAAAAAAAAAAAAAAf///4AAAAAAAAAAAAAAAf///wAAAAAAAAAAAAAAAf///wAAAAAAAAAAAAAAAf///wAAAAAAAAAAAAAAAf///wAAAAAAAAAAAAAAAP///wAAAAAAAAAAAAAAAP///wAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAP///gAAAAAAAAAAAAAAAf///gAAAAAAAAAAAAAAAf///gAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAA////gAAAAAAAAAAAAAAA////gAAAAAAAAAAAAAAB////gAAAAAAAAAAAAAAB////wAAAAAAAAAAAAAAB////wAAAAAAAAAAAAAAD////wAAAAAAAAAAAAAP/////4AAAAAAAAAAAAA//////4AAAAAD4AAAAAB//////8AAAAAP/4AAAAH//////8AAAAA//8AAAAf//////8/4AAB///AAAAf/////////AAH///gAAAf/////////gAP///4AAAf/////////wAP///8AAAf/////////8AP///+AAAP/////////+AP///+AAAP//////////AP////AAAP//////////AP////AAAP//////////AP////gAAH//////////AP////gAAD//////////AP////wAAB///n//////AD////wAAAf//h//////AA////gAAAP//g//////AAP///AAAOD//+//////AAH//8MAAfgD///////+AAAf/w/AB/4H////8//+AAAQAB/wD/+P////4f/+AAB8AD/8P///////wH4DwAH/gH//////////jgAH8AP/4P//////////v4Af/A//+f///////////+B//x/////////////B//j///////////////wH//////////////////A///////////////////P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////',
  sand: '/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7///////////////////wf///////////////////H///////////////////g///////////////////wD//////////////////4AP/////////////////4AB/////////f///////8AA////////+f///////+AAf///////8f////////AAH///////4f////////AAD///////wf////////gAB///////wP////////wAA///////wP////////wAAf//////wP////////wAAP//////4P////////4AAH//////4H//7/////4AAD//////4B//x/////8AAB/4f///4A//g/////8AAA+AB///8Af/A/////8AAAAAAf//4AP8Af////+AAAAAAf//AAAAAP////+AAAAAAB/4AAAAAP/////AAAAAAAAAAAAAAH/////AAAAAAAAAAAAAAAf////AAAAAAAAAAAAAAAP////AAAAAAAAAAAAAAH/////AAAAAAAAAAAAAAP/////AAAAAAAAAAAAAAP/////AAAAAAAAAAAAAAf/////AAAAAAAAAAAAAAf/////AAAAAAAAAAAAAA//////AAAAAAAAAAAAAB//////AAAAAAAAAAAAAB//////AAAAAAAAAAAAAD/////+AAAAAAAAAAAAAD/////+AAAAAAAAAAAAAD/////+AAAAAAAAAAAAAD/////+AAAAAAAAAAAAAB/////+AAAAAAAAAAAAAB/////+AAAAAAAAAAAAAB//////AAAAAAAAAAAAAB///f//AAAAAAAAAAAAAB//4P//AAAAAAAAAAAAAB//AH//AAAAAAAAAAAAAA//AH//AAAAAAAAAAAAAA//AD//AAAAAAAAAAAAAA//AB//gAAAAAAAAAAAAB//AB//gAAAAAAAAAAAAB//AA//gAAAAAAAAAAAAD//AA//gAAAAAAAAAAAAD//AAf/gAAAAAAAAAAAAH//AAf/gAAAAAAAAAAAAP//AAf/gAAAAAAAAAAAAP//AAf/gAAAAAAAAAAAAf//AAP/gAAAAAAAAAAAAf//AAP/gAAAAAAAAAAAAf//AAP/gAAAAAAAAAAAAf//AAH/AAAAAAAAAAAAAf//AAH/AAAAAAAAAAAAA///AAH/AAAAAAAAAAAAA///AAD/AAAAAAAAAAAAA///AAD/AAAAAAAAAAAAA///AAB+AAAAAAAAAAAAA///AAA+AAAAAAAAAAAAA///AAAeAAAAAAAAAAAAAf//AAAMAAAAAAAAAAAAAP//AAAMAAAAAAAAAAAAAH//AAAAAAAAAAAAAAAAPj//AAAAAAAAAAA/AH///x/////wAAAAAAB//////4/////4AAAD8AD//////+AA///4AAAH/gP///////AA///4AAAf/4f///////AA///4AAA//4f///////AA///4AAB//8////////gA///8AAB//8////////gA///8AAB///////////gA///8AAB///////////gA///8AAB///////////gA///8AAB///////////gA///+AAB///////////gA///+AAB///////////gA///+AAB///////////gA///+AAB///////////AA///+AAB///////////AA///+AAA//9////////AA///8AAAf/9///////+AA///8AAAP/5///////+AA///4AAAH/4///////+AA///4AAAD/gf//////8AA///wAAAB4Af//////8AA///wAAAAAAP//////8OA///gAAAwAAP//////8/wAAAAAAB+AAH/////////AAAA/gH/gAD/////////AAAD/8f/8AD/////////AAAP/////AB/////////AAA//////gAf////////AAB//////wAP////////AAD//////4AD////////AAD//////+AB/+B/////AAD///////AAfAAH////AAD///////gAAAAAP///AAD///////gAAAAAA///AAD///////gAAAAAA///AAD///////wAAAAAA///AAD///////wAAAAAA///AAH///////wAAAAAA///',
  snow: '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8D///////////////////x///////////////////+f///////////////////H///////////////////j/w/////////////////g8Af////////////////wAAP////////////////4AAH////////////////8AAD////////////////8AAA//////8f////////+AAAf/////4D/////////AAAP/////gA/////////gAAH/9///AAD//+f////gAAD/wf/+AAB//8P////wAAB+AP/8AAA//4P////wAAAQAD/AAAAf/wH////4AAAAABwAAAAH/gD////4AAAAAAAAAAAD4AD////8AAAAAAAAAAAAAAA////8AAAAAAAAAAAAAAAH///+AAAAAAAAAAAAAAB////+AAAAAAAAAAAAAAB////+AAAAAAAAAAAAAAD////+AAAAAAAAAAAAAAD////+AAAAAAAAAAAAAAH////+AAAAAAAAAAAAAAH////+AAAAAAAAAAAAAAP////8AAAAAAAAAAAAAAP////8AAAAAAAAAAAAAAf////8AAAAAAAAAAAAAAf////8AAAAAAAAAAAAAA/////8AAAAAAAAAAAAAA/////8AAAAAAAAAAAAAA/////8AAAAAAAAAAAAAA/////8AAAAAAAAAAAAAA/////4AAAAAAAAAAAAAA/////8AAAAAAAAAAAAAAf////8AAAAAAAAAAAAAAf////8AAAAAAAAAAAAAAf////+AAAAAAAAAAAAAAf////+AAAAAAAAAAAAAAf////+AAAAAAAAAAAAAAf/////AAAAAAAAAAAAAAf/9///AAAAAAAAAAAAAAf/B///AAAAAAAAAAAAAAf/A///gAAAAAAAAAAAAAP/A///gAAAAAAAAAAAAAf/Af//gAAAAAAAAAAAAAf/Af//gAAAAAAAAAAAAAf/Af//gAAAAAAAAAAAAA//AP//wAAAAAAAAAAAAA//AP//wAAAAAAAAAAAAA//AH//wAAAAAAAAAAAAB//AH//wAAAAAAAAAAAAB//AH//wAAAAAAAAAAAAB//AD//wAAAAAAAAAAAAB//AD//wAAAAAAAAAAAAD//AB//wAAAAAAAAAAAAD//AB//wAAAAAAAAAAAAD//AA//wAAAAAAAAAAAAD//AA//wAAAAAAAAAAAAD//AAf/wAAAAAAAAAAAAB//AAP/wAAAAAAAAAAAAB//AAH/gAAAAAAAAAAAAB//AAD/AAAAAAAAAAAAAB//AAB+AAAAAAAAAAAAAB//AAA8AAAAAAAAAAAfgB//AAAcAAAAAHAAf///4A//H//wAAAAAf8D////+A//f//wAAAAA////////g/////wAAAAD////////wf////wAAAAH////////wH////4AAAAP////////wD////4AAAAP////////wA8///4AAAAP////////4AA///8AAAAP////////4AA///8AAAAP////////4AA///8AAAAP////////4AA///8AAAAP////////8AA///8B/4AP////////8AA///8P//AP////////4AA///8///wP////////4AA///8///8P////////4AA///4///+P////////4AA///4////v////////wAA///4////n////////wAA///4////3////////wAA///4f///3////////gAA///wf///7////////gAA///wf///z////////n4A///wH///h//////////4///wB///B///////////f//wAf//h///////////P//gAH8Pw///////////AAAADwAf4///////////AAAAP/h/8f//////////AAAAf///+f//////////AAAB/////H//////////AAAD/////h//////////AAAP/////w//////////AAAP/////wP/////////AAAP/////wH/8H//////AAAP/////wB+AAP/////AAAP/////4AAAAAf////AAAf/////4AAAAAA////AAAf/////4AAAAAA////AAAf/////4AAAAAA////AAAf/////8AAAAAA////',
  forest: '//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4///////////////////wH//////////////////AB////////////////P+AA///////////////+D8AA///////////////8A4AA///////////////4AAAA/5/8H//////////wAAAA/8fgB//////////gAAAA/8GAAf/////////AAAAA/+AAAH/////////j8AAA/+AAAD///////////ADw//AAAB///////////w/8//AAAA////////////////gAAAP///////////////gAAAH////j//////////gAAAA///8D//////////gAAAAB//gB//////////gAAAAAB8AA//////////gAAAAAAAAA//////////gAAAAAAAAAfwB//wAH//AAAAAAAAAAOAAH4AAA//AAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAA//gAAAAAAAAAAAAAAAAA//gAAAAAAAAAAAAAAAAA//wAAAAAAAAAAAAAAAAA//wAAAAAAAAAAAAAAAAA//4AAAAAAAAAAAAAAAAA//4AAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAA//+AAAAAAAAAAAAAAAAA//+AAAAAAAAAAAAAAAAA//+AAAAAAAAAAAAAAAAA//+AAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAA///gAAAAAAAAAAAAAAAA///gAAAAAAAAAAAAAAAA///gAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAD///AAAAAAAAAAAAAAAAP//+AAAAAAAAAAAAAAAAf//+AAAAAAAAAAAAAAAAf//+AAAAAAAAAAAAAAAAf//+AAAAAAAAAAAAAAAAf//8AAAAAAAAAAAAAAAAf//8AAAAAAAAAAAAAAAAf//8AAAAAAAAAAAAAAAAf//8AAAAAAAAAAAAAAAA///+AAAAAAAAAAAAAAAA///+AAAAAAeAAAAAAAAA///+AAAAAB/wAAAAAAAA////AAAAAH/wAAAAAAAA////AAAAAH/wAAAAAAAA////AAAAAH/wAAAAAAAA////gAAAAH/wA/8Af//8////gAAAAH/4D///////////gAAAAD/wf///////////gAAAAAcB////////////AAAAAAAB////////////AAAAAAAB///////////+AAAAAAAB///////////+AAAAAAAB///////////8AAAAAAAB//////////+AAAAAAAAB//////////+AAAAAAAAB//////////+AAAAAAAAB//////////+AAAAAAAAB//////////+AAAAAAAAB//////////+AAAAAAIAB///////////AAAAAAfAB///////////AAAAAAfgA///////////AAAAAAfgA///////////AAAAAAfgA///////////AAAAAA/wA///////////AAAAAA/wA///////////AAAAAA/wAf//////////AAAAAA/4Af//////////AAAAAA/44f//////////AAAAAAf/8f/////////+AAAAAAf/+f/////////+AAAAAAP//P/////////+AAAAAAP//v/////////+AAAAAAP////////////+AAAAAAH//3/////////8AAAAAAH//3/////////8AAAAAAP//3/////////8AAAAAAP//z/////////8AAAAAAf//z/////////4AAAAAAf//x/////////4AAAAAAf//x/////////4AAAAAA///x/////////4AAAAAA///w////////',
  temple: '//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4///////////////////wH//////////////////AB////////////////P+AA///////////////+D8AA///////////////8A4AA///////////////4AAAA/5/8H//////////wAAAA/8fgB//////////gAAAA/8GAAf/////////AAAAA/+AAAH/////////j8AAA/+AAAD///////////ADw//AAAB///////////w/8//AAAA////////////////gAAAP///////////////gAAAH////j//////////gAAAA///8D//////////gAAAAB//gB//////////gAAAAAB8AA//////////gAAAAAAAAA//////////gAAAAAAAAAfwB//wAH//AAAAAAAAAAOAAH4AAA//AAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAA//gAAAAAAAAAAAAAAAAA//gAAAAAAAAAAAAAAAAA//wAAAAAAAAAAAAAAAAA//wAAAAAAAAAAAAAAAAA//4AAAAAAAAAAAAAAAAA//4AAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAA//+AAAAAAAAAAAAAAAAA//+AAAAAAAAAAAAAAAAA//+AAAAAAAAAAAAAAAAA//+AAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAA///gAAAAAAAAAAAAAAAA///gAAAAAAAAAAAAAAAA///gAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAA///AAAAAAAAAAAAAAAAD///AAAAAAAAAAAAAAAAP//+AAAAAAAAAAAAAAAAf//+AAAAAAAAAAAAAAAAf//+AAAAAAAAAAAAAAAAf//+AAAAAAAAAAAAAAAAf//8AAAAAAAAAAAAAAAAf//8AAAAAAAAAAAAAAAAf//8AAAAAAAAAAAAAAAAf//8AAAAAAAAAAAAAAAA///+AAAAAAAAAAAAAAAA///+AAAAAAeAAAAAAAAA///+AAAAAB/wAAAAAAAA////AAAAAH/wAAAAAAAA////AAAAAH/wAAAAAAAA////AAAAAH/wAAAAAAAA////gAAAAH/wA/8Af//8////gAAAAH/4D///////////gAAAAD/wf///////////gAAAAAcB////////////AAAAAAAB////////////AAAAAAAB///////////+AAAAAAAB///////////+AAAAAAAB///////////8AAAAAAAB//////////+AAAAAAAAB//////////+AAAAAAAAB//////////+AAAAAAAAB//////////+AAAAAAAAB//////////+AAAAAAAAB//////////+AAAAAAIAB///////////AAAAAAfAB///////////AAAAAAfgA///////////AAAAAAfgA///////////AAAAAAfgA///////////AAAAAA/wA///////////AAAAAA/wA///////////AAAAAA/wAf//////////AAAAAA/4Af//////////AAAAAA/44f//////////AAAAAAf/8f/////////+AAAAAAf/+f/////////+AAAAAAP//P/////////+AAAAAAP//v/////////+AAAAAAP////////////+AAAAAAH//3/////////8AAAAAAH//3/////////8AAAAAAP//3/////////8AAAAAAP//z/////////8AAAAAAf//z/////////4AAAAAAf//x/////////4AAAAAAf//x/////////4AAAAAA///x/////////4AAAAAA///w////////',
  doublefork: '/////////////////////////////////////////////////////////////////+AAf//gD////////////8AAAAAAAB///////////8AAAAAAAAP//////////4AAAAAAAAH//////////wAAAAAAAAD//////////gAAAAAAAAA/////////+AAAAAAAAAAP////////4AAAAAAAAAAH////////wAAAAAAAAAAB////////AAAAAAAAAAAA///////+AAAAAAAAAAAB////////AAAAAAAAAAAB////////gAAAAAAAAAAB////////gAAAAAAAAAAB////////wAAAAAAAAAAD////////wAAAAAAAAAAD////////4AAAAAAAAAAD////////8AAAAAAAAAAD////////8AAAAAAAAAAD////////8AAAAAAAAAAB////////4AAAAAAAAAAA////////4AAAAAAAAAAAf///////wAAAAAAAAAAAP///////gAAAAAAAAAAAP///////gAAAAAAAAAAAH///////AAAAAAAAAAAAf///////AAAAAAAAAAAB////////AAAAAAAAAAAH////////gAAAAAAAAAAf////////4AAAAAAAAAB/////////8AAAAAAAAAH//////////AAAAAAAAAP//////////gAAAAAAAAf//////////wAAAAAAAB///////////8AAAAAAAD///////////+AAAAAAAH////////////AAAAAAAP////////////gAAAAAAf////////////wAAAAAAf////////////wAAAAAAf////////////4AAAAAAf////////////4AAAAAA/////////////8AAAAAA/////////////8AAAAAA/////////////+AAAAAB/////////////+AAAAAB//////////////AAAAAB//////////////AAAAAB//////////////gAAAAD//////////////gAAAAD//////////////gAAAAD//////////////AAAAAD//////////////AAAAAD//////////////AAAAAD//////////////AAAAAH//////////////AAAAAD//////////////AAAAAD//////////////AAAAAD/////////////+AAAAAB/////////////+AAAAAB/////////////+AAAAAB/////////////8AAAAAA/////////////8AAAAAA/////////////4AAAAAAf////////////wAAAAAAf////////////gAAAAAAH////////////AAAAAAAB///////////+AAAAAAAA///////////8AAAAAAAAP//////////4AAAAAAAAD//////////AAAAAAAAAB/////////8AAAAAAAAAAf////////gAAAAAAAAAAH////////AAAAAAAAAAAB///////+AAAAAAAAAAAAf//////8AAAAAAAAAAAAP//////4AAAAAAAAAAAAH//////wAAAAAAAAAAAAD//////gAAAAAAAAAAAAD//////wAAAAAAAAAAAAB//////8AAAAAAAAAAAAA//////+AAAAAAAAAAAAA///////gAAAAAAAAAAAAf//////4AAAAAAAAAAAA///////8AAAAAAAAAAAB////////AAAAAAAAAAAB////////gAAAAAAAAAAD////////wAAAAAAAAAAH////////wAAAAAAAAAAH////////4AAAAAAAAAAP////////4AAAAAAAAAAf////////4AAAAAAAAAB/////////8AAAAAAAAAD/////////4AAAAAAAAAH/////////wAAAAAAAAAP/////////AAAAAAAAAAf////////+AAAAAAAAAAf////////4AAAAAAAAAAP////////gAAAAAAAAAAP////////gAAAAAAAAAAH////////4AAAAAAAAAAH////////+AAAAAAAAAAD/////////gAAAAAAAAAD/////////4AAAAAAAAAH/////////8AAAAAAEAAf//////////AAAAAAOAB///////////AAAAAAfAH///////////AAAAAA/gf//////////+AAAAAB/x///////////+AAPgAD/////////////+AA/wAH/////////////+AA/4AH/////////////8AB/4AP/////////////8AB/4AP/////////////4AB/wAP/9///////////gAD/wAP/9///////////AAD/wAP/8//////',
});
const CAVE_MOUTHS = Object.freeze({
  doublefork: [[668,656],[620,1136],[1132,656],[1180,1136],[520,1300]],
  water: [[170,760],[1535,760],[1255,1280]],
  fire: [[300,520],[1000,575],[880,1150],[580,1330]],
  sand: [[880,520],[1420,520],[420,760],[1000,1150]],
  snow: [[410,760],[1050,470],[1000,1170],[1560,900]],
  forest: [[320,760],[1250,560],[720,1240],[920,1330]],
  temple: [[320,760],[1250,560],[720,1240],[920,1330]],
});
function caveMouthsFor(key) { return CAVE_MOUTHS[key] || []; }
const decoded = {};
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function maskFor(key) {
  // Hand-rolled base64 decode: the shared core also runs in the WeChat
  // bundle, where atob is not guaranteed to exist.
  if (!decoded[key]) {
    const text = SCENE_MASKS[key].replace(/=+$/, '');
    const bits = new Uint8Array((text.length * 3) >> 2);
    let buffer = 0, bitsInBuffer = 0, out = 0;
    for (let i = 0; i < text.length; i++) {
      buffer = (buffer << 6) | B64.indexOf(text[i]); bitsInBuffer += 6;
      if (bitsInBuffer >= 8) { bitsInBuffer -= 8; bits[out++] = (buffer >> bitsInBuffer) & 0xff; }
    }
    decoded[key] = bits;
  }
  return decoded[key];
}
function sceneMaskHas(key) { return Boolean(SCENE_MASKS[key]); }
// Circle-vs-mask test in world coordinates: true when any blocked cell
// intersects the circle. Cells outside the grid count as open (the world
// clamp in moveEntity handles the boundary).
function sceneCircleBlocked(key, x, y, radius, worldSize) {
  if (!SCENE_MASKS[key]) return false;
  const bits = maskFor(key);
  const cell = worldSize / SCENE_MASK_COLS;
  const c0 = Math.max(0, Math.floor((x - radius) / cell)), c1 = Math.min(SCENE_MASK_COLS - 1, Math.floor((x + radius) / cell));
  const r0 = Math.max(0, Math.floor((y - radius) / cell)), r1 = Math.min(SCENE_MASK_ROWS - 1, Math.floor((y + radius) / cell));
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      const idx = r * SCENE_MASK_COLS + c;
      if (!(bits[idx >> 3] & (0x80 >> (idx & 7)))) continue;
      const nx = Math.max(c * cell, Math.min(x, (c + 1) * cell));
      const ny = Math.max(r * cell, Math.min(y, (r + 1) * cell));
      if ((x - nx) * (x - nx) + (y - ny) * (y - ny) <= radius * radius) return true;
    }
  }
  return false;
}

Object.assign(module.exports,{SCENE_MASK_COLS,SCENE_MASK_ROWS,CAVE_MOUTHS,caveMouthsFor,sceneMaskHas,sceneCircleBlocked});

},
"battle-enemy-animation":function(module,exports,require){
const { TIGER_SPRITE_ID, TIGER_FRAME_COUNTS, TIGER_FPS, isBattleTiger, tigerDrawFrame } = require('tiger-animation');
const { BEAR_SPRITE_ID, BEAR_FRAME_COUNTS, BEAR_FPS, isBattleBear, bearDrawFrame } = require('bear-animation');
const { BULL_SPRITE_ID, BULL_FRAME_COUNTS, BULL_FPS, isBattleBull, bullDrawFrame } = require('bull-animation');
const { WOLF_SPRITE_ID, WOLF_FRAME_COUNTS, WOLF_FPS, isBattleWolf, wolfDrawFrame } = require('wolf-animation');
const { MONKEY_SPRITE_ID, MONKEY_FRAME_COUNTS, MONKEY_FPS, isBattleMonkey, monkeyDrawFrame } = require('monkey-animation');
const { DEER_SPRITE_ID, DEER_FRAME_COUNTS, DEER_FPS, isBattleDeer, deerDrawFrame } = require('deer-animation');
const { HAWK_SPRITE_ID, HAWK_FRAME_COUNTS, HAWK_FPS, isBattleHawk, hawkDrawFrame } = require('hawk-animation');
const { SNAKE_SPRITE_ID, SNAKE_FRAME_COUNTS, SNAKE_FPS, isBattleSnake, snakeDrawFrame } = require('snake-animation');
const { BOSS_DEFS, BOSS_FPS, isBattleBoss, bossDrawFrame, bossSpriteIdFor } = require('boss-animation');

// One shared decision for clocks, retained death identity, culling and drawing.
// No per-frame allocations and no variant-only match for elites or bosses.
const actors = Object.freeze({
  tiger: Object.freeze({ id: TIGER_SPRITE_ID, variant: 'tiger', frames: TIGER_FRAME_COUNTS, fps: TIGER_FPS, healthBarOffset: 3.05, matches: isBattleTiger, drawFrame: tigerDrawFrame }),
  bear: Object.freeze({ id: BEAR_SPRITE_ID, variant: 'bear', frames: BEAR_FRAME_COUNTS, fps: BEAR_FPS, healthBarOffset: 3.4, matches: isBattleBear, drawFrame: bearDrawFrame }),
  bull: Object.freeze({ id: BULL_SPRITE_ID, variant: 'bull', frames: BULL_FRAME_COUNTS, fps: BULL_FPS, healthBarOffset: 3.45, matches: isBattleBull, drawFrame: bullDrawFrame }),
  wolf: Object.freeze({ id: WOLF_SPRITE_ID, variant: 'wolf', frames: WOLF_FRAME_COUNTS, fps: WOLF_FPS, healthBarOffset: 3.35, matches: isBattleWolf, drawFrame: wolfDrawFrame }),
  monkey: Object.freeze({ id: MONKEY_SPRITE_ID, variant: 'monkey', frames: MONKEY_FRAME_COUNTS, fps: MONKEY_FPS, healthBarOffset: 3.35, matches: isBattleMonkey, drawFrame: monkeyDrawFrame }),
  deer: Object.freeze({ id: DEER_SPRITE_ID, variant: 'deer', frames: DEER_FRAME_COUNTS, fps: DEER_FPS, healthBarOffset: 3.55, matches: isBattleDeer, drawFrame: deerDrawFrame }),
  hawk: Object.freeze({ id: HAWK_SPRITE_ID, variant: 'hawk', frames: HAWK_FRAME_COUNTS, fps: HAWK_FPS, healthBarOffset: 3.7, matches: isBattleHawk, drawFrame: hawkDrawFrame }),
  snake: Object.freeze({ id: SNAKE_SPRITE_ID, variant: 'snake', frames: SNAKE_FRAME_COUNTS, fps: SNAKE_FPS, healthBarOffset: 3.45, matches: isBattleSnake, drawFrame: snakeDrawFrame }),
});

// Named final bosses resolve through their engine-issued sprite ID plus
// frozen identity, in a registry separate from the species table. The
// actor's `variant` slot carries the bossId because the renderer uses it
// as the enemyImages key; it is never matched against entity.variant.
const bossActors = Object.freeze(Object.fromEntries(Object.entries(BOSS_DEFS).map(([bossId, def]) => [
  def.spriteId,
  Object.freeze({
    id: def.spriteId, variant: bossId, frames: def.frameCounts, fps: BOSS_FPS,
    healthBarOffset: def.healthBarOffset,
    matches: entity => isBattleBoss(entity, bossId),
    drawFrame: (image, state, frameIndex, radius) => bossDrawFrame(bossId, image, state, frameIndex, radius),
  }),
])));

function battleEnemyAnimation(entity) {
  const boss = bossActors[entity?.battleSpriteId];
  if (boss?.matches?.(entity)) return boss;
  const actor = actors[entity?.variant];
  return actor?.matches?.(entity) ? actor : null;
}

function battleEnemySpriteId(stageId, kind, variant) {
  return stageId === 1 && kind === 'normal' ? actors[variant]?.id || null : null;
}

// Boss art binds through the frozen bossIdentity issued by content, never
// through variant: the same tiger/bear/bull variants also name ordinary
// enemies, elites and the unbound mid-boss.
function battleBossSpriteId(stageId, identity) {
  return stageId === 1 ? bossSpriteIdFor(identity?.bossId) : null;
}

Object.assign(module.exports,{battleEnemyAnimation,battleEnemySpriteId,battleBossSpriteId});

},
"engine":function(module,exports,require){
const {
  ARTIFACTS,
  BALANCE,
  CHARACTERS,
  getArtifactStats,
  getStage,
  getWeaponStats,
} = require('content');
const { battleEnemyAnimation, battleEnemySpriteId, battleBossSpriteId } = require('battle-enemy-animation');
const { sceneCircleBlocked, sceneMaskHas, caveMouthsFor } = require('scene-collision');

const TAU = Math.PI * 2;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const normalize = (x, y) => {
  const length = Math.hypot(x, y);
  return length > 0.001 ? { x: x / length, y: y / length } : { x: 0, y: 0 };
};

// Entity animation clocks are part of the simulation snapshot, so pausing and
// replaying the engine also freezes or repeats every visible transition.
const ANIMATION_FRAMES = Object.freeze({
  // Battle art is vector-rigged rather than a single polished illustration.
  // Keep enough simulation frames for a readable Kingdom-Rush-like cadence;
  // the renderer turns each frame into a distinct limb/weapon pose.
  idle: 6, move: 8, attack: 8, hit: 4, stun: 4, dash: 8, intro: 10, death: 8,
});
const animationFrames = (state) => ANIMATION_FRAMES[state] || ANIMATION_FRAMES.idle;

function mulberry32(seed) {
  let value = (Number(seed) >>> 0) || 0x9e3779b9;
  return () => {
    value |= 0; value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WEAPON_PREFIX = 'weapon:';
// Playtest change (2026-10-21): normals arrive in waves every WAVE_SECONDS.
// Small waves are single-species; every 5th wave is a big mixed-species wave.
const WAVE_SECONDS = 5;
const BIG_WAVE_EVERY = 4;

class GameEngine {
  constructor(options = {}) {
    this.options = options;
    this.debugMode = options.debug === true;
    this.viewRect = null;
    this.debugInvincible = false;
    this.seed = Number(options.seed == null ? Date.now() : options.seed) >>> 0;
    this.random = mulberry32(this.seed);
    this.character = CHARACTERS.find((item) => item.id === options.characterId) || CHARACTERS[0];
    this.stage = getStage(options.stageId || 1);
    this.talents = options.talents || {};
    this.difficulty = options.difficulty === 'hard' ? 'hard' : 'normal';
    this.onEvent = typeof options.onEvent === 'function' ? options.onEvent : () => {};
    this.nextId = 1;
    this.disposed = false;
    this.elapsed = 0;
    this.weaponShots = 0;
    this.spawnAccumulator = WAVE_SECONDS - 1;
    this.waveIndex = 0;
    this.elitesSpawned = new Set();
    this.bossSpawned = false;
    this.finalBossSpawned = false;
    this.pendingUpgrades = 0;
    this.poolingEnabled = true;
    this.pools = { projectile: [], effect: [], gem: [] };
    this.poolStats = { created: { projectile: 0, effect: 0, gem: 0 }, reused: { projectile: 0, effect: 0, gem: 0 }, released: { projectile: 0, effect: 0, gem: 0 } };
    this.rng = this.random;
    this.state = this.createState();
  }

  createState() {
    const talentMultiplier = (name, fallback = 0) => Number(this.talents[name] || fallback);
    const hpBonus = clamp(talentMultiplier('iron-body') * 0.035, 0, 0.35);
    const speedBonus = clamp(talentMultiplier('swift-cloud') * 0.025, 0, 0.25);
    const character = this.character;
    const maxHp = Math.round(character.stats.hp * (1 + hpBonus));
    const skills = [{ id: `${WEAPON_PREFIX}${character.id}`, level: 1, isWeapon: true }];
    return {
      status: 'playing', time: 0,
      player: {
        x: BALANCE.worldSize / 2, y: BALANCE.worldSize / 2,
        hp: maxHp, maxHp, radius: BALANCE.playerRadius, speed: character.stats.speed * (1 + speedBonus),
        facing: 0, level: 1, xp: 0, xpNext: 24, invulnerable: 0, dashCooldown: 0,
        animationState: 'idle', frameIndex: 0, frameTime: 0, animationFrames: animationFrames('idle'),
        attackTimer: 0, hitTimer: 0, dashTimer: 0,
      },
      enemies: [], projectiles: [], effects: [], gems: [], damageNumbers: [], shakeT: 0, shakeMag: 0, skills,
      choices: [], kills: 0, damage: 0,
      stage: this.stage, battlefield: this.stage.encounterName ? {
        id: 'double-ridge', name: this.stage.encounterName, theme: this.stage.theme,
        mapAssetKey: this.stage.mapAssetKey || null,
        openCenter: true, perimeter: 'mountain-forest',
        ridgeRect: this.stage.mapAssetKey === 'doublefork' ? { x: 0, y: 700, width: BALANCE.worldSize, height: 400 } : null,
        pathCorridor: this.stage.mapAssetKey === 'doublefork' ? { x: 790, y: 700, width: 220, height: 400 } : null,
      } : null,
      character: this.character, seed: this.seed,
      coins: 0,
    };
  }

  emit(event) {
    try { this.onEvent({ time: this.state.time, ...event }); } catch (_) { /* consumer errors never stop simulation */ }
  }

  allocId(prefix) { return `${prefix}-${this.nextId++}`; }

  setAnimation(entity, state, frameCount = animationFrames(state)) {
    if (!entity) return;
    const nextState = state || 'idle';
    if (entity.animationState !== nextState) {
      entity.animationState = nextState; entity.frameIndex = 0; entity.frameTime = 0;
    }
    entity.animationFrames = Math.max(1, Number(frameCount) || animationFrames(nextState));
  }

  stepAnimation(entity, state, dt, frameRate = 10, frameCount = animationFrames(state)) {
    if (!entity) return;
    this.setAnimation(entity, state, frameCount);
    const duration = 1 / Math.max(1, Number(frameRate) || 10);
    entity.frameTime = Math.max(0, Number(entity.frameTime) || 0) + Math.max(0, Number(dt) || 0);
    while (entity.frameTime >= duration) {
      entity.frameTime -= duration;
      entity.frameIndex = (Math.max(0, Number(entity.frameIndex) || 0) + 1) % entity.animationFrames;
    }
  }

  stepEnemyAnimation(enemy, state, dt, frameRate) {
    const actor = battleEnemyAnimation(enemy);
    if (!actor) { this.stepAnimation(enemy, state, dt, frameRate); return; }
    const authoredState = state === 'stun' ? 'hit' : state;
    const count = actor.frames[authoredState] || actor.frames.idle;
    const fps = actor.fps[authoredState] || actor.fps.idle;
    this.setAnimation(enemy, state, count);
    const loop = state === 'idle' || state === 'move';
    enemy.frameTime = Math.max(0, enemy.frameTime || 0) + dt;
    if (loop) enemy.frameTime %= count / fps;
    else enemy.frameTime = Math.min(enemy.frameTime, count / fps);
    enemy.frameIndex = Math.min(count - 1, Math.floor((enemy.frameTime + 1e-8) * fps));
  }

  // The first chapter's authored map has a steep central ridge. Only the
  // narrow stone pass through the ridge is traversable; both open clearings
  // remain fully walkable. The testable seam is this small movement helper,
  // which also lets dash and joystick movement share the same terrain rule.
  isWalkable(x, y, radius = this.state?.player?.radius || BALANCE.playerRadius) {
    const battlefield = this.state?.battlefield;
    const r = Math.max(0, Number(radius) || 0);
    // Painted scenes carry a collision mask traced from the artwork
    // (scene-collision.js): mountains, rivers, lava, ponds and ruins in
    // the background block movement exactly where they are painted, and
    // nobody climbs onto the painted sky. Doublefork's mask adds its
    // side massifs and sky strip on top of the authored ridge rule
    // below — both must pass.
    const terrainKey = battlefield?.mapAssetKey || this.stage?.mapAssetKey || this.stage?.theme;
    if (sceneMaskHas(terrainKey) && sceneCircleBlocked(terrainKey, x, y, r, BALANCE.worldSize)) return false;
    if (battlefield?.mapAssetKey !== 'doublefork') return true;
    const ridge = battlefield.ridgeRect || { x: 0, y: 700, width: BALANCE.worldSize, height: 400 };
    const corridor = battlefield.pathCorridor || { x: 790, y: 700, width: 220, height: 400 };
    const ridgeTop = ridge.y;
    const ridgeBottom = ridge.y + ridge.height;
    const pathLeft = corridor.x;
    const pathRight = corridor.x + corridor.width;
    if (y + r <= ridgeTop || y - r >= ridgeBottom) return true;
    return x - r >= pathLeft && x + r <= pathRight;
  }

  movePlayer(dx, dy) {
    return this.moveEntity(this.state.player, dx, dy, this.state.player.radius);
  }

  moveEntity(entity, dx, dy, radius = entity?.radius || BALANCE.playerRadius) {
    if (!entity) return false;
    const r = Math.max(0, Number(radius) || 0);
    // Unstick: an entity whose center is buried in scenery (half-radius
    // probe — merely brushing a wall with the disc edge is normal play
    // and must never teleport anyone) steps to the nearest fully
    // walkable ground first, so a knockback edge case can never leave
    // it trapped inside a wall.
    if (!this.isWalkable(entity.x, entity.y, r * 0.5)) {
      let escaped = false;
      for (let ring = 10; ring <= 120 && !escaped; ring += 10) {
        for (let step = 0; step < 16 && !escaped; step += 1) {
          const angle = (step / 16) * TAU;
          const nx = clamp(entity.x + Math.cos(angle) * ring, r, BALANCE.worldSize - r);
          const ny = clamp(entity.y + Math.sin(angle) * ring, r, BALANCE.worldSize - r);
          if (this.isWalkable(nx, ny, r)) { entity.x = nx; entity.y = ny; escaped = true; }
        }
      }
    }
    // Sweep in small substeps: a fast move (the 180-unit dash above all)
    // must not tunnel through scenery thinner than the jump — only the
    // landing point used to be checked, which let a dash cross a ruin
    // wall and strand the hero inside it.
    const stepX = Number(dx) || 0;
    const stepY = Number(dy) || 0;
    const steps = Math.max(1, Math.ceil(Math.hypot(stepX, stepY) / 8));
    let moved = false;
    for (let i = 0; i < steps; i += 1) {
      if (this._moveStep(entity, stepX / steps, stepY / steps, r)) moved = true;
    }
    return moved;
  }

  _moveStep(entity, dx, dy, radius = entity?.radius || BALANCE.playerRadius) {
    const nextX = clamp(entity.x + (Number(dx) || 0), radius, BALANCE.worldSize - radius);
    const nextY = clamp(entity.y + (Number(dy) || 0), radius, BALANCE.worldSize - radius);
    // Try the full vector first, then slide along a clear axis so the ridge
    // feels like a solid boundary instead of trapping the joystick.
    if (this.isWalkable(nextX, nextY, radius)) { entity.x = nextX; entity.y = nextY; return true; }
    let moved = false;
    if (this.isWalkable(nextX, entity.y, radius)) { entity.x = nextX; moved = true; }
    if (this.isWalkable(entity.x, nextY, radius)) { entity.y = nextY; moved = true; }
    return moved;
  }

  playerAnimationState(direction) {
    const player = this.state.player;
    if (player.dashTimer > 0) return 'dash';
    if (player.hitTimer > 0) return 'hit';
    if (player.attackTimer > 0) return 'attack';
    return direction?.x || direction?.y ? 'move' : 'idle';
  }

  update(dtSeconds, input = {}) {
    if (this.disposed || this.state.status !== 'playing') return this.state;
    const dt = clamp(Number(dtSeconds) || 0, 0, 0.05);
    if (!dt) return this.state;
    this.state.player.speedBoost = Math.max(0, (this.state.player.speedBoost || 0) - dt);
    this.state.player.attackFlash = Math.max(0, (this.state.player.attackFlash || 0) - dt);
    this.state.player.hitFlash = Math.max(0, (this.state.player.hitFlash || 0) - dt);
    this.state.player.attackTimer = Math.max(0, (this.state.player.attackTimer || 0) - dt);
    this.state.player.hitTimer = Math.max(0, (this.state.player.hitTimer || 0) - dt);
    this.state.player.dashTimer = Math.max(0, (this.state.player.dashTimer || 0) - dt);
    for (let i = this.state.damageNumbers.length - 1; i >= 0; i -= 1) {
      const number = this.state.damageNumbers[i]; number.ttl -= dt; number.y -= 18 * dt;
      if (number.ttl <= 0) this.state.damageNumbers.splice(i, 1);
    }
    const direction = normalize(Number(input.x) || 0, Number(input.y) || 0);
    if (direction.x || direction.y) {
      const moveSpeed = this.state.player.speed * (this.state.player.speedBoost > 0 ? 1.03 : 1);
      this.state.player.facing = Math.atan2(direction.y, direction.x);
      this.movePlayer(direction.x * moveSpeed * dt, direction.y * moveSpeed * dt);
    }
    this.elapsed += dt;
    this.state.time = this.elapsed;
    this.state.player.invulnerable = Math.max(0, this.state.player.invulnerable - dt);
    this.state.player.dashCooldown = Math.max(0, this.state.player.dashCooldown - dt);
    if (this.state.shakeT > 0) this.state.shakeT = Math.max(0, this.state.shakeT - dt);
    this.spawnAccumulator += dt;
    this.advanceSpawns();
    this.updateEffects(dt);
    this.updateEnemies(dt);
    if (this.state.status !== 'playing') return this.state;
    this.updateProjectiles(dt);
    this.updateGems(dt);
    if (this.state.status === 'playing') this.autoAttack(dt);
    this.stepAnimation(this.state.player, this.playerAnimationState(direction), dt, 12);
    this.trimCaps();
    this.checkVictory();
    return this.state;
  }

  advanceSpawns() {
    const time = this.state.time;
    // Wave spawning replaces the old per-enemy trickle: the accumulator now
    // counts toward whole waves, so overall pressure still follows
    // spawnInterval(time) via the batch size computed in spawnWave.
    while (this.spawnAccumulator >= WAVE_SECONDS && this.state.enemies.length < BALANCE.maxEnemies) {
      this.spawnAccumulator -= WAVE_SECONDS;
      this.spawnWave(time);
    }
    BALANCE.eliteTimes.forEach((mark, index) => {
      if (time >= mark && !this.elitesSpawned.has(mark)) {
        this.elitesSpawned.add(mark);
        const count = 1 + Math.floor(index / 2);
        for (let i = 0; i < count; i += 1) this.spawnEnemy('elite', index + i);
        this.emit({ type: 'elite', at: mark, index, count });
      }
    });
    for (const encounter of this.stage.eliteEncounters || []) {
      if (time >= encounter.at && !this.elitesSpawned.has(encounter.at)) {
        this.elitesSpawned.add(encounter.at);
        const authoredLeader = this.spawnEnemy('elite', 0, encounter);
        // Bind only at the authored scheduling site, never by tiger variant,
        // display name or a generic spawn override. This identity reserves a
        // future action contract; it does not approve or select any artwork.
        if (authoredLeader && this.stage.id === 1 && encounter.encounterId && encounter.actionId) {
          authoredLeader.encounterIdentity = Object.freeze({ encounterId: encounter.encounterId, variant: encounter.variant || null, actionId: encounter.actionId });
        }
        // Authored encounters can occupy the generic mid-boss slot. Mark the
        // slot consumed after spawning the authored leader, preventing two
        // different leaders from appearing on the same frame. Keep seeded
        // runs reproducible: the skipped generic boss would have sampled one
        // additional spawn point, so consume the same sample without adding
        // an entity. This also preserves the authored leader's original spawn
        // position in the random stream.
        if (encounter.replacesMidBoss === true && encounter.at === BALANCE.bossTime) {
          this.spawnPoint();
          this.bossSpawned = true;
        }
        this.emit({ type: 'elite', at: encounter.at, count: 1, encounter: true, replacesMidBoss: encounter.replacesMidBoss === true, names: [encounter.name] });
      }
    }
    if (time >= BALANCE.bossTime && !this.bossSpawned) {
      this.bossSpawned = true;
      const boss = this.spawnBoss(false, this.stage.enemyRoster ? { variant: 'tiger' } : {});
      this.emit({ type: 'boss', final: false, names: boss ? [boss.name] : [] });
    }
    if (time >= BALANCE.finalBossTime && !this.finalBossSpawned) {
      this.finalBossSpawned = true;
      const roster = this.stage.finalBosses ? this.stage.finalBosses.map((boss) => this.spawnBoss(true, boss)) : [this.spawnBoss(true)];
      this.emit({ type: 'boss', final: true, names: roster.filter(Boolean).map((boss) => boss.name) });
    }
  }

  spawnInterval(time) {
    // 1.02s at start, reaching 0.17s near the final minute (playtest
    // difficulty pass, 2026-10-23: denser waves across the whole run).
    return clamp(1.02 - (time / BALANCE.duration) * 0.85, 0.17, 1.02);
  }

  spawnWave(time) {
    const roster = this.stage.enemyRoster || this.stage.enemies || [];
    const index = this.waveIndex;
    this.waveIndex += 1;
    const big = index % BIG_WAVE_EVERY === BIG_WAVE_EVERY - 1;
    // Batch size preserves the old trickle's throughput over one wave
    // window; big waves double it and mix every species in the roster.
    const batch = Math.max(1, Math.round(WAVE_SECONDS / this.spawnInterval(time))) * (big ? 2 : 1);
    let forced;
    if (!big && roster.length) {
      // Small wave: a single species, rotating through the roster so each
      // kind gets its own wave before the next big mixed wave lands.
      const entry = roster[index % roster.length];
      forced = typeof entry === 'string' ? { name: entry } : { name: entry.name, variant: entry.variant };
    }
    let spawned = 0;
    for (let i = 0; i < batch && this.state.enemies.length < BALANCE.maxEnemies; i += 1) {
      if (this.spawnEnemy('normal', 0, forced)) spawned += 1;
    }
    this.emit({ type: 'wave', index, big, count: spawned, species: big ? null : (forced ? forced.name : null) });
  }

  spawnPoint(preferCave = false) {
    const player = this.state.player;
    this._caveSpawn = null;
    // Cave spawns: scenes with painted mountains have cave mouths at the
    // rock feet (scene-collision.js). When one is in a sensible range
    // band around the hero, small monsters mostly walk out of the
    // mountain instead of materialising on open ground. Live builds
    // only: debug engines keep the frozen spawn contract the animation
    // gates choreograph against (they teleport their subjects anyway);
    // the dedicated scene-collision gate covers cave spawns on a
    // non-debug engine.
    if (preferCave && !this.debugMode) {
      const key = this.state?.battlefield?.mapAssetKey || this.stage?.mapAssetKey || this.stage?.theme;
      const mouths = caveMouthsFor(key).filter(([mx, my]) => {
        const distance = Math.hypot(mx - player.x, my - player.y);
        return distance >= 300 && distance <= 780 && this.isWalkable(mx, my, 24);
      });
      if (mouths.length && this.rng() < 0.55) {
        const [mx, my] = mouths[Math.floor(this.rng() * mouths.length)];
        this._caveSpawn = { x: mx, y: my };
        return { x: mx, y: my };
      }
    }
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const angle = this.rng() * TAU;
      const radius = 470 + this.rng() * 130;
      const point = { x: clamp(player.x + Math.cos(angle) * radius, 24, BALANCE.worldSize - 24), y: clamp(player.y + Math.sin(angle) * radius, 24, BALANCE.worldSize - 24) };
      if (this.isWalkable(point.x, point.y, 24)) return point;
    }
    // If the random ring lands inside scenery repeatedly, search outward
    // from the historic stable point (the doublefork stone pass) for the
    // nearest walkable ground so a spawn never lands inside a mountain,
    // river or ruin. Deterministic: fixed rings, fixed direction order.
    const seed = { x: 900, y: clamp(player.y, 24, BALANCE.worldSize - 24) };
    if (this.isWalkable(seed.x, seed.y, 24)) return seed;
    for (let ring = 40; ring <= 900; ring += 40) {
      for (let step = 0; step < 16; step += 1) {
        const angle = (step / 16) * TAU;
        const point = { x: clamp(seed.x + Math.cos(angle) * ring, 24, BALANCE.worldSize - 24), y: clamp(seed.y + Math.sin(angle) * ring, 24, BALANCE.worldSize - 24) };
        if (this.isWalkable(point.x, point.y, 24)) return point;
      }
    }
    return { x: player.x, y: player.y };
  }

  bossLand(boss) {
    const r = boss.radius;
    this.effect({ x: boss.x, y: boss.y, kind: 'crater', radius: r * 1.9, color: '#3a2a1c', ttl: 900 });
    this.effect({ x: boss.x, y: boss.y, kind: 'shockwave', radius: r * 3.6, color: '#d8b878', ttl: 0.55 });
    this.effect({ x: boss.x, y: boss.y, kind: 'cave-dust', radius: r * 2.8, color: '#9a7d55', ttl: 1.0 });
    // Chunks of shattered earth burst outward from the impact point; the
    // renderer flies them on ballistic arcs so the landing reads as the
    // ground itself breaking, not a decal fading in.
    this.effect({ x: boss.x, y: boss.y, kind: 'shockwave', radius: r * 4.2, color: '#a8895a', ttl: 0.7 });
    for (let i = 0; i < 12; i += 1) {
      const a = (i / 12) * Math.PI * 2 + (boss.id % 7) * 0.3;
      const sp = 130 + ((i * 53) % 110);
      this.effect({ x: boss.x, y: boss.y, kind: 'debris', radius: 7 + ((i * 29) % 7), color: '#4a3826', ttl: 0.9 + ((i * 37) % 40) / 100, vx: Math.cos(a) * sp, vy: -(170 + ((i * 71) % 130)), spin: (i % 5) - 2 });
    }
    this.state.shakeT = 0.55; this.state.shakeMag = 16;
    // The landing shockwave flattens every lesser demon on the field; elites
    // and bosses ride it out.
    for (const enemy of [...this.state.enemies]) {
      if (enemy !== boss && enemy.kind === 'normal' && enemy.hp > 0) this.damageEnemy(enemy, enemy.hp + 1, {});
    }
    // Never leave the hero standing inside the boss's footprint.
    const p = this.state.player, dx = p.x - boss.x, dy = p.y - boss.y, d = Math.hypot(dx, dy), min = r + p.radius + 4;
    if (d < min) {
      const a = d > 0.01 ? Math.atan2(dy, dx) : -Math.PI / 2;
      p.x = clamp(boss.x + Math.cos(a) * min, p.radius, BALANCE.worldSize - p.radius);
      p.y = clamp(boss.y + Math.sin(a) * min, p.radius, BALANCE.worldSize - p.radius);
    }
    this.emit({ type: 'boss-land', x: boss.x, y: boss.y, final: Boolean(boss.final), name: boss.name });
  }

  spawnEnemy(kind = 'normal', variant = 0, override = {}) {
    if (this.state.enemies.length >= BALANCE.maxEnemies) {
      if (kind === 'normal') return null;
      const index = this.state.enemies.findIndex((enemy) => enemy.kind === 'normal');
      if (index < 0) return null;
      this.state.enemies.splice(index, 1);
    }
    const position = this.spawnPoint(kind === 'normal');
    if (this._caveSpawn) {
      // Dust burst at the cave mouth so the emergence reads on screen.
      this.effect({ x: position.x, y: position.y, kind: 'cave-dust', radius: 30, color: '#9a7d55', ttl: 0.55 });
      this._caveSpawn = null;
    }
    const progress = clamp(this.state.time / BALANCE.duration, 0, 1);
    const hard = this.difficulty === 'hard' ? 1.25 : 1;
    const levelScale = 1 + progress * 1.65;
    const chapterScale = 1 + (this.stage.chapter - 1) * 0.085;
    const normalNames = this.stage.enemyRoster || this.stage.enemies;
    let hp = 36 * levelScale * chapterScale * hard;
    let speed = 42 + progress * 28;
    let radius = 15;
    const selected = normalNames[Math.floor(this.rng() * normalNames.length)] || '山野妖怪';
    let name = typeof selected === 'string' ? selected : selected.name;
    let variantName = typeof selected === 'string' ? undefined : selected.variant;
    let color = '#725d5a';
    if (kind === 'elite') {
      hp *= 5;
      speed *= 1.12;
      radius = 25;
      name = `${this.stage.midBoss}·精锐`;
      if (this.stage.enemyRoster) variantName = 'tiger';
      color = '#c48a53';
    }
    name = override.name || name; variantName = override.variant || variantName;
    const enemy = {
      id: this.allocId('enemy'), x: position.x, y: position.y, hp, maxHp: hp, radius,
      kind, name, variant: variantName || variant, variantName, color, speed, stun: 0, flash: 0,
      facing: 0,
      animationState: 'move', frameIndex: 0, frameTime: 0, animationFrames: animationFrames('move'),
      hitTimer: 0, spawnProgress: 1, spawnTimer: 0,
      damage: (9 + progress * 13) * (kind === 'elite' ? 1.5 : 1) * chapterScale * hard,
      xp: override.xp || (kind === 'elite' ? 9 : 2),
      encounterIdentity: null,
    };
    const battleSpriteId = battleEnemySpriteId(this.stage.id, kind, enemy.variant);
    if (battleSpriteId) {
      Object.assign(enemy, { battleSpriteId, visualAttackTimer: 0, visualHitTimer: 0 });
    }
    this.state.enemies.push(enemy);
    return enemy;
  }

  spawnBoss(finalBoss, override = {}) {
    if (this.state.enemies.length >= BALANCE.maxEnemies) {
      const expendable = this.state.enemies.findIndex((enemy) => !enemy.final && enemy.kind === 'normal');
      if (expendable < 0) return null;
      this.state.enemies.splice(expendable, 1);
    }
    const position = this.spawnPoint();
    const progress = clamp(this.state.time / BALANCE.duration, 0, 1);
    const chapterScale = 1 + (this.stage.chapter - 1) * 0.085;
    const hp = (finalBoss ? 1900 : 800) * (1 + progress * 1.15) * chapterScale * (this.difficulty === 'hard' ? 1.25 : 1) * (override.hpScale || 1);
    // Final guardians may carry a stable, boss-only identity for a future
    // renderer.  Variant remains encounter metadata and must never be used as
    // a boss sprite lookup.  Mid-bosses and generic later-stage bosses stay
    // explicitly unbound until they receive their own scoped contract.
    const bossIdentity = finalBoss && this.stage.id === 1 && override.bossId && override.actionId
      ? Object.freeze({ bossId: override.bossId, variant: override.variant || null, actionId: override.actionId })
      : null;
    const boss = {
      id: this.allocId('boss'), x: position.x, y: position.y, hp, maxHp: hp, radius: override.radius || (finalBoss ? 76 : 60),
      kind: 'boss', name: override.name || (finalBoss ? this.stage.boss : this.stage.midBoss), variant: override.variant || (finalBoss ? 1 : 0), aliases: [...(override.aliases || [])],
      color: finalBoss ? '#9b4e86' : '#a56a46', speed: finalBoss ? 34 : 38, stun: 0, flash: 0, facing: 0,
      animationState: 'intro', frameIndex: 0, frameTime: 0, animationFrames: animationFrames('intro'),
      hitTimer: 0, spawnProgress: 0, spawnTimer: 1.2,
      damage: (finalBoss ? 35 : 24) * chapterScale * (override.damageScale || 1), xp: override.xp || (finalBoss ? 80 : 30), coin: override.coin || (finalBoss ? 80 : 35), final: finalBoss,
      bossIdentity,
      encounterIdentity: null,
      dropHeight: 780, landed: false,
    };
    if (this.stage.id === 1 && ['tiger', 'bear', 'bull'].includes(boss.variant)) {
      const attackPattern = { tiger: 'tiger-claw', bear: 'bear-slam', bull: 'bull-charge' }[boss.variant];
      Object.assign(boss, { attackPattern, attackPhase: 'cooldown', attackCooldown: 4, attackWindup: 0, attackTimer: 0, attackHit: false });
    }
    // Named first-stage final bosses acquire their dedicated atlas through
    // the frozen identity only. Unbound bosses keep the vector identity rig.
    const battleSpriteId = battleBossSpriteId(this.stage.id, bossIdentity);
    if (battleSpriteId) {
      Object.assign(boss, { battleSpriteId, visualAttackTimer: 0, visualHitTimer: 0 });
    }
    this.state.enemies.push(boss);
    return boss;
  }

  updateBossPattern(boss, dt) {
    const player = this.state.player;
    const aimVector = normalize(player.x - boss.x, player.y - boss.y);
    if (aimVector.x || aimVector.y) boss.facing = Math.atan2(aimVector.y, aimVector.x);
    if (boss.attackPhase === 'windup') {
      boss.attackWindup = Math.max(0, boss.attackWindup - dt);
      if (boss.attackWindup <= 1e-8) {
        boss.attackPhase = 'active';
        boss.attackHit = false;
        boss.attackTimer = boss.attackPattern === 'bull-charge' ? 0.72 : boss.attackPattern === 'bear-slam' ? 0.26 : 0.28;
        boss.attackDuration = boss.attackTimer;
        if (boss.attackPattern === 'tiger-claw') {
          for (let j = 0; j < 5; j += 1) {
            const angle = boss.attackAngle + (j - 2) * 0.18;
            this.projectile({ x: boss.x, y: boss.y, vx: Math.cos(angle) * 200, vy: Math.sin(angle) * 200, radius: 9, color: '#f7af67', kind: 'boss-orb', bossPattern: 'tiger-claw', sourceId: boss.id, ttl: 2.6, damage: boss.damage * 0.7, hostile: true });
          }
        } else if (boss.attackPattern === 'bear-slam') {
          const target = boss.attackTarget;
          const radius = boss.attackRadius;
          this.effect({ x: target.x, y: target.y, kind: 'explosion', bossPattern: 'bear-slam', sourceId: boss.id, radius, color: '#d9935f', ttl: 0.28 });
          if (distance(target, player) <= radius + player.radius) this.damagePlayer(boss.damage * 1.25);
        } else if (boss.attackPattern === 'bull-charge') {
          boss.attackSpeed = 290;
        }
        this.emit({ type: 'boss-attack', sourceId: boss.id, pattern: boss.attackPattern, phase: 'active' });
      }
      return;
    }
    if (boss.attackPhase === 'active' || boss.attackPhase === 'recovery') {
      if (boss.attackPhase === 'active' && boss.attackPattern === 'bull-charge') {
        this.moveEntity(boss, Math.cos(boss.attackAngle) * boss.attackSpeed * dt, Math.sin(boss.attackAngle) * boss.attackSpeed * dt, boss.radius);
        if (!boss.attackHit && distance(boss, player) <= boss.radius + player.radius + 8) {
          boss.attackHit = true;
          this.damagePlayer(boss.damage * 1.05);
        }
      }
      boss.attackTimer = Math.max(0, boss.attackTimer - dt);
      if (boss.attackTimer <= 1e-8) {
        if (boss.attackPhase === 'active') { boss.attackPhase = 'recovery'; boss.attackTimer = 0.6; boss.attackDuration = 0.6; }
        else { boss.attackPhase = 'cooldown'; boss.attackCooldown = 5.5; }
      }
      return;
    }
    const vector = normalize(player.x - boss.x, player.y - boss.y);
    this.moveEntity(boss, vector.x * boss.speed * (boss.slow || 1) * dt, vector.y * boss.speed * (boss.slow || 1) * dt, boss.radius);
    boss.attackCooldown = Math.max(0, boss.attackCooldown - dt);
    if (boss.attackCooldown > 0) return;
    boss.attackPhase = 'windup';
    boss.attackWindup = boss.attackPattern === 'bull-charge' ? 0.62 : boss.attackPattern === 'bear-slam' ? 0.88 : 0.7;
    boss.attackWindupDuration = boss.attackWindup;
    boss.attackAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
    boss.attackTarget = { x: player.x, y: player.y };
    if (boss.attackPattern === 'tiger-claw') {
      this.effect({ x: boss.x, y: boss.y, kind: 'warning', warningShape: 'cone', bossPattern: boss.attackPattern, sourceId: boss.id, radius: 520, length: 520, arc: 0.84, angle: boss.attackAngle, color: '#f7af67', ttl: boss.attackWindup });
    } else if (boss.attackPattern === 'bear-slam') {
      boss.attackRadius = 116;
      this.effect({ x: boss.attackTarget.x, y: boss.attackTarget.y, kind: 'warning', warningShape: 'circle', bossPattern: boss.attackPattern, sourceId: boss.id, radius: boss.attackRadius, color: '#d9935f', ttl: boss.attackWindup });
    } else {
      const chargeDistance = Math.min(520, distance(boss, player));
      this.effect({ x: boss.x, y: boss.y, kind: 'warning', warningShape: 'line', bossPattern: boss.attackPattern, sourceId: boss.id, radius: 42, width: 42, length: chargeDistance, angle: boss.attackAngle, color: '#d9bc74', ttl: boss.attackWindup });
    }
    this.emit({ type: 'boss-attack', sourceId: boss.id, pattern: boss.attackPattern, phase: 'windup' });
  }

  updateEnemies(dt) {
    const player = this.state.player;
    for (const enemy of this.state.enemies.slice()) {
      enemy.slow = enemy.nextSlow || 1;
      enemy.nextSlow = 1;
      enemy.stun = Math.max(0, enemy.stun - dt);
      enemy.knockback = Math.max(0, (enemy.knockback || 0) - dt);
      enemy.flash = Math.max(0, enemy.flash - dt);
      enemy.hitTimer = Math.max(0, (enemy.hitTimer || 0) - dt);
      const actor = battleEnemyAnimation(enemy);
      if (actor) {
        enemy.visualAttackTimer = Math.max(0, enemy.visualAttackTimer - dt);
        enemy.visualHitTimer = Math.max(0, enemy.visualHitTimer - dt);
      }
      if (enemy.spawnTimer > 0) {
        enemy.spawnTimer = Math.max(0, enemy.spawnTimer - dt);
        enemy.spawnProgress = clamp(1 - enemy.spawnTimer / 1.2, 0, 1);
        if (enemy.spawnTimer <= 0 && enemy.dropHeight && !enemy.landed) { enemy.landed = true; this.bossLand(enemy); }
        this.stepAnimation(enemy, 'intro', dt, 10);
        continue;
      }
      enemy.spawnProgress = 1;
      if (enemy.burn?.ttl > 0) {
        this.damageEnemy(enemy, enemy.burn.damage * Math.min(dt, enemy.burn.ttl), {});
        enemy.burn.ttl = Math.max(0, enemy.burn.ttl - dt);
      }
      if (enemy.bleeds?.length) {
        for (let b = enemy.bleeds.length - 1; b >= 0; b -= 1) {
          const bleed = enemy.bleeds[b];
          bleed.timer -= dt;
          if (bleed.timer <= 0 && bleed.tick < bleed.ticks.length) {
            this.damageEnemy(enemy, bleed.baseDamage * bleed.ticks[bleed.tick], { knockback: 0 });
            bleed.tick += 1; bleed.timer += 1;
          }
          if (bleed.tick >= bleed.ticks.length) enemy.bleeds.splice(b, 1);
        }
      }
      if (enemy.hp <= 0 || enemy.stun > 0 || enemy.knockback > 0) {
        this.stepEnemyAnimation(enemy, (actor ? enemy.visualHitTimer : enemy.hitTimer) > 0 ? 'hit' : enemy.stun > 0 ? 'stun' : 'idle', dt, 10);
        continue;
      }
      const vector = normalize(player.x - enemy.x, player.y - enemy.y);
      if (vector.x || vector.y) enemy.facing = Math.atan2(vector.y, vector.x);
      const speed = enemy.speed * (enemy.slow || 1);
      if (enemy.attackPattern) this.updateBossPattern(enemy, dt);
      else this.moveEntity(enemy, vector.x * speed * dt, vector.y * speed * dt, enemy.radius);
      if (enemy.kind === 'boss' && !enemy.attackPattern) {
        enemy.attackCooldown = (enemy.attackCooldown == null ? 4 : enemy.attackCooldown) - dt;
        if (enemy.attackCooldown <= 0) {
          enemy.attackCooldown = enemy.final ? 5.5 : 7;
          const count = enemy.final ? 7 : 4;
          const aim = Math.atan2(player.y - enemy.y, player.x - enemy.x);
          for (let j = 0; j < count; j += 1) {
            const angle = aim + (j - (count - 1) / 2) * 0.22;
            this.projectile({ x: enemy.x, y: enemy.y, vx: Math.cos(angle) * 160, vy: Math.sin(angle) * 160, radius: 9, color: '#d15c70', kind: 'boss-orb', ttl: 4, damage: enemy.damage * 0.7, hostile: true });
          }
          this.effect({ x: player.x, y: player.y, kind: 'warning', radius: enemy.final ? 74 : 56, color: '#da6377', ttl: 1.1, hostileDamage: enemy.damage * 0.9 });
        }
      }
      const touching = distance(enemy, player) <= enemy.radius + player.radius;
      if (actor && touching && enemy.visualAttackTimer <= 1e-8 && enemy.visualHitTimer <= 1e-8) {
        // Visual-only contact swing. Do not gate damage, movement, RNG, or
        // collision with this timer; player invulnerability is unchanged.
        enemy.visualAttackTimer = actor.frames.attack / actor.fps.attack;
        this.setAnimation(enemy, 'attack', actor.frames.attack);
        enemy.frameTime = 0; enemy.frameIndex = 0;
      }
      if ((!enemy.attackPattern || enemy.attackPhase === 'cooldown') && touching && player.invulnerable <= 0) {
        // Contact chips away at health; discrete boss volleys are the large
        // threats. A fixed contact scale keeps damage identical at 20/60 FPS.
        this.damagePlayer(enemy.damage * 0.05);
        if (this.state.status === 'lost') break;
      }
      this.stepEnemyAnimation(enemy, (actor ? enemy.visualHitTimer : enemy.hitTimer) > 1e-8 ? 'hit' : enemy.attackWindup > 0 || enemy.attackTimer > 0 || enemy.visualAttackTimer > 0 ? 'attack' : 'move', dt, enemy.kind === 'boss' ? 8 : 12);
    }
    this.separateEnemies();
  }

  // Playtest addition (2026-10-22): soft body separation. Enemies steer to
  // the exact same point (the player) with no mutual collision, so a
  // converging wave interpenetrated into one stacked blob — visible
  // clipping the user reported. After each movement tick, overlapping
  // bodies are eased apart along their axis, weighted by mass (radius^2)
  // so bosses barely yield, and enemies are kept out of the player's disc
  // so the hero is never stood inside of. Pushes go through moveEntity, so
  // ridge and world bounds still apply. Iteration follows the stable enemy
  // array order with an index-hash tiebreak for coincident bodies: fully
  // deterministic and consumes no RNG.
  separateEnemies() {
    const enemies = this.state.enemies;
    const player = this.state.player;
    const cell = 64;
    const grid = new Map();
    for (let i = 0; i < enemies.length; i += 1) {
      const key = `${Math.floor(enemies[i].x / cell)},${Math.floor(enemies[i].y / cell)}`;
      const bucket = grid.get(key);
      if (bucket) bucket.push(i); else grid.set(key, [i]);
    }
    const push = (enemy, dx, dy) => { if (dx || dy) this.moveEntity(enemy, dx, dy, enemy.radius); };
    for (let i = 0; i < enemies.length; i += 1) {
      const a = enemies[i];
      if (a.hp <= 0) continue;
      if (player && player.hp > 0) {
        const dx = a.x - player.x, dy = a.y - player.y;
        const min = (a.radius + player.radius) * .92;
        const d2 = dx * dx + dy * dy;
        if (d2 < min * min) {
          const d = Math.sqrt(d2);
          if (d > 1e-4) push(a, dx / d * (min - d), dy / d * (min - d));
          else push(a, min, 0);
        }
      }
      const cx = Math.floor(a.x / cell), cy = Math.floor(a.y / cell);
      for (let gx = cx - 1; gx <= cx + 1; gx += 1) for (let gy = cy - 1; gy <= cy + 1; gy += 1) {
        const bucket = grid.get(`${gx},${gy}`);
        if (!bucket) continue;
        for (const j of bucket) {
          if (j <= i) continue;
          const b = enemies[j];
          if (b.hp <= 0) continue;
          const dx = b.x - a.x, dy = b.y - a.y;
          const min = (a.radius + b.radius) * .82;
          const d2 = dx * dx + dy * dy;
          if (d2 >= min * min) continue;
          const d = Math.sqrt(d2);
          let ux, uy;
          if (d > 1e-4) { ux = dx / d; uy = dy / d; } else { const t = ((i * 31 + j * 17) % 628) / 100; ux = Math.cos(t); uy = Math.sin(t); }
          const overlap = min - d;
          const ma = a.radius * a.radius, mb = b.radius * b.radius, total = ma + mb;
          push(a, -ux * overlap * (mb / total), -uy * overlap * (mb / total));
          push(b, ux * overlap * (ma / total), uy * overlap * (ma / total));
        }
      }
    }
  }

  autoAttack(dt) {
    const weaponSkill = this.state.skills.find((skill) => skill.isWeapon);
    if (!weaponSkill) return;
    weaponSkill.cooldown = Math.max(0, (weaponSkill.cooldown || 0) - dt);
    if (weaponSkill.cooldown <= 0) {
      weaponSkill.cooldown = getWeaponStats(this.character.id, weaponSkill.level).cooldown;
      this.fireWeapon(weaponSkill);
    }
    for (const skill of this.state.skills) {
      if (skill.isWeapon || skill.level <= 0) continue;
      skill.cooldown = Math.max(0, (skill.cooldown || 0) - dt);
      if (skill.cooldown <= 0) {
        const stats = getArtifactStats(skill.id, skill.level);
        skill.cooldown = stats.cooldown;
        this.fireArtifact(skill, stats);
      }
    }
  }

  fireWeapon(skill) {
    const stats = getWeaponStats(this.character.id, skill.level);
    const player = this.state.player;
    const baseDamage = this.character.stats.damage * stats.damage * (1 + clamp(Number(this.talents['sharp-eye'] || 0) * 0.03, 0, 0.3) + (player.damageBonus || 0));
    const target = this.nearestEnemy();
    const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : player.facing;
    player.facing = angle;
    player.attackFlash = 0.2; player.attackAngle = angle;
    player.attackTimer = Math.max(player.attackTimer || 0, 0.24);
    this.weaponShots += 1;
    this.emit({ type: 'attack', weapon: this.character.id });
    if (this.character.id === 'wukong') {
      const heavy = stats.heavyEvery && this.weaponShots % stats.heavyEvery === 0;
      this.effect({ x: player.x, y: player.y, kind: heavy ? 'heavy-sweep' : 'sweep', radius: stats.range * (heavy ? stats.heavyRadius : 1), angle, color: this.character.color, ttl: 0.18 });
      const arc = (stats.arc || 1.15) * (heavy ? 1.25 : 1);
      this.hitCone(angle, stats.range * (heavy ? stats.heavyRadius : 1), arc, baseDamage * (heavy ? stats.heavyMultiplier : 1), heavy ? stats.stunChance || 0 : 0, heavy);
    } else if (this.character.id === 'tangseng') {
      const targetDistance = target ? Math.min(distance(target, player), stats.range) : stats.range;
      const targetPoint = { x: player.x + Math.cos(angle) * targetDistance, y: player.y + Math.sin(angle) * targetDistance };
      this.projectile({ x: player.x, y: player.y, vx: Math.cos(angle) * stats.projectileSpeed, vy: Math.sin(angle) * stats.projectileSpeed, radius: stats.radius, color: this.character.color, kind: 'light-orb', ttl: targetDistance / stats.projectileSpeed + stats.linger + 0.05, damage: baseDamage, target: targetPoint, linger: stats.linger, bounce: stats.bounce, targetLimit: stats.bounceTargets || (skill.level >= 5 ? 5 : skill.level >= 4 ? 3 : 2), split: stats.split, knockback: stats.knockback, pierce: true });
    } else if (this.character.id === 'bajie') {
      this.effect({ x: player.x, y: player.y, kind: 'hoe-line', radius: stats.range, length: stats.range, angle, color: this.character.color, ttl: 0.22, width: stats.width });
      this.hitLine(angle, stats.range, stats.width, baseDamage, stats.bleedTicks);
      const birds = stats.birds || 0;
      for (let i = 0; i < birds; i += 1) {
        const spread = (i - (birds - 1) / 2) * 0.14;
        const birdTarget = this.sortedEnemies(player)[i % Math.max(1, this.state.enemies.length)];
        this.projectile({ x: player.x, y: player.y, vx: Math.cos(angle + spread) * 290, vy: Math.sin(angle + spread) * 290, radius: 9, color: '#f58c42', kind: 'fire-bird', ttl: 1.6, damage: baseDamage * 0.55, explosion: stats.explosion, targetId: birdTarget?.id, speed: 290 });
      }
    } else {
      this.effect({ x: player.x, y: player.y, kind: 'staff-ring', radius: stats.range, angle: 0, color: this.character.color, ttl: 0.24 });
      this.hitCircle(player.x, player.y, stats.range, baseDamage);
      if (stats.whirlDuration && this.weaponShots % stats.whirlEvery === 0) {
        for (const direction of [-1, 0, 1]) {
          this.effect({ x: player.x + direction * stats.range * 0.75, y: player.y + (direction === 0 ? -stats.range * 0.75 : 0), kind: 'whirl', radius: stats.whirlRadius || (skill.level >= 4 ? 36 : 18), color: '#8bb8bf', ttl: stats.whirlDuration, damage: baseDamage * stats.whirlDamage / Math.max(stats.whirlDuration, 0.1), slowPower: skill.level, pull: stats.pull || 0, hitIds: true });
        }
      }
    }
  }

  fireArtifact(skill, stats) {
    const player = this.state.player;
    const level = skill.level;
    const target = this.nearestEnemy();
    const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : player.facing;
    player.attackFlash = Math.max(player.attackFlash || 0, 0.18); player.attackAngle = angle;
    player.attackTimer = Math.max(player.attackTimer || 0, 0.22);
    const damage = this.character.stats.damage * stats.damage * stats.power * (1 + clamp(Number(this.talents['sharp-eye'] || 0) * 0.03, 0, 0.3) + (player.damageBonus || 0));
    this.emit({ type: 'attack', artifact: skill.id });
    if (skill.id === 'lotus-lantern') {
      const count = [3, 6, 9, 12, 15][level - 1];
      const intercepts = [1, 1, 2, 2, 3][level - 1];
      for (let i = 0; i < count; i += 1) {
        const direction = angle + i / count * TAU;
        this.effect({ x: player.x, y: player.y, kind: 'monkey-clone', radius: 16, angle: direction, color: '#e6a43a', ttl: 4, damage: damage * (0.6 + level * 0.1), intercepts, vx: Math.cos(direction) * 165, vy: Math.sin(direction) * 165, hitIds: true });
      }
    } else if (skill.id === 'moon-mirror') {
      for (let i = 0; i < level; i += 1) {
        const direction = level === 1 ? angle : level === 2 ? angle + (i === 0 ? -Math.PI / 2 : Math.PI / 2) : angle + i / level * TAU;
        const x = player.x + Math.cos(direction) * (78 + level * 10);
        const y = player.y + Math.sin(direction) * (78 + level * 10);
        this.effect({ x, y, kind: 'palm-strike', radius: 36 * (1 + (level - 1) * 0.18), angle: direction, color: '#e7cb80', ttl: 0.5, delay: 0.3, burstDamage: damage * (1.8 + level * 0.15), symbol: '卍' });
      }
    } else if (skill.id === 'golden-rope') {
      const count = [1, 3, 5, 6, 9][level - 1];
      for (let i = this.state.effects.length - 1; i >= 0; i -= 1) if (this.state.effects[i].artifactId === skill.id) { this.release('effect', this.state.effects[i]); this.state.effects.splice(i, 1); }
      for (let i = 0; i < count; i += 1) this.effect({ x: player.x, y: player.y, kind: level === 5 ? 'skull-bead' : 'bead', radius: 8 + level, angle: i / count * TAU, color: level === 5 ? '#f0e4c6' : '#d9b77b', ttl: stats.cooldown + 0.1, damage: damage * 0.17, orbitRadius: 55 + level * 6, angularSpeed: 1.4 + level * 0.45, artifactId: skill.id, hitIds: true });
    } else if (skill.id === 'purple-gourd') {
      this.effect({ x: player.x, y: player.y, kind: 'gourd', radius: 175 + level * 25, angle, arc: 1.1 + level * 0.1, color: '#a879cb', ttl: 2.4, damage: damage * 0.22, pull: 90 + level * 30, slowPower: level, followPlayer: true });
    } else if (skill.id === 'samadhi-fire') {
      const point = target && distance(target, player) < 440 ? target : { x: player.x + Math.cos(angle) * 150, y: player.y + Math.sin(angle) * 150 };
      this.effect({ x: point.x, y: point.y, kind: 'mountain', radius: 90 * (1 + (level - 1) * 0.2), angle, color: '#b58d65', ttl: 0.8, delay: 0.45, burstDamage: damage * (2.1 + level * 0.35), silverHorn: true });
    } else if (skill.id === 'iron-fan') {
      const directions = level >= 4 ? [angle, angle + Math.PI] : [angle];
      for (const direction of directions) {
        this.effect({ x: player.x, y: player.y, kind: 'fan', radius: 160 + level * 25, angle: direction, color: '#68c2aa', ttl: 0.35, arc: 1.45 + level * 0.12 });
        for (const enemy of this.state.enemies.slice()) {
          const difference = Math.atan2(enemy.y - player.y, enemy.x - player.x) - direction;
          if (distance(enemy, player) > 160 + level * 25 + enemy.radius || Math.abs(Math.atan2(Math.sin(difference), Math.cos(difference))) > (1.45 + level * 0.12) / 2) continue;
          this.damageEnemy(enemy, damage * 0.32, { knockback: enemy.kind === 'normal' ? 140 + level * 24 : enemy.kind === 'elite' ? 45 + level * 8 : 10 + level * 3 });
          enemy.knockback = Math.max(enemy.knockback || 0, 0.25);
        }
      }
    } else if (skill.id === 'nine-dragon') {
      const count = [1, 1, 2, 2, 2][level - 1];
      for (let i = 0; i < count; i += 1) {
        const direction = angle + (i - (count - 1) / 2) * 0.12;
        this.projectile({ x: player.x, y: player.y, vx: Math.cos(direction) * 600, vy: Math.sin(direction) * 600, radius: level >= 3 ? 22 + level * 2 : 13, color: '#f3873c', kind: 'fire-wheel', ttl: 0.9, damage: damage * 0.9, pierce: true, trail: level, trailTimer: 0 });
      }
    } else if (skill.id === 'diamond-snare') {
      this.projectile({ x: player.x, y: player.y, vx: Math.cos(angle) * 410, vy: Math.sin(angle) * 410, radius: 12, color: '#e7cb75', kind: 'ring', ttl: 7, damage: damage * 1.4, targetId: target?.id, speed: 410, maxBounces: [3, 5, 7, 9, 11][level - 1], bounceCount: 0, aoeTargets: level, splitChildren: level >= 5 ? 2 : level >= 3 ? 1 : 0, childBounces: level >= 5 ? 5 : level === 4 ? 4 : 3, child: false, pierce: true, bounds: { x: player.x - 330, y: player.y - 390, w: 660, h: 780 }, hitIds: true });
    }
  }
  nearestEnemy() {
    const player = this.state.player;
    let best = null; let bestDistance = Infinity;
    for (const enemy of this.state.enemies) { const d = distance(enemy, player); if (d < bestDistance) { best = enemy; bestDistance = d; } }
    return best;
  }

  sortedEnemies(origin, predicate = () => true) {
    return this.state.enemies.filter(predicate).sort((a, b) => distance(a, origin) - distance(b, origin));
  }

  projectile(data) {
    if (this.state.projectiles.length >= BALANCE.maxProjectiles) return;
    this.state.projectiles.push(this.acquire('projectile', { id: this.allocId('projectile'), x: 0, y: 0, vx: 0, vy: 0, radius: 5, color: '#fff', ...data, ttl: data.ttl == null ? 1 : data.ttl, age: 0 }));
  }

  effect(data) {
    if (this.state.effects.length >= BALANCE.maxEffects) return;
    const ttl = data.ttl == null ? 0.2 : data.ttl;
    this.state.effects.push(this.acquire('effect', { id: this.allocId('effect'), x: data.x, y: data.y, kind: data.kind, radius: data.radius || 0, angle: data.angle || 0, color: data.color || '#fff', ttl, maxTtl: ttl, ...data }));
  }

  acquire(kind, data) {
    let object = this.poolingEnabled ? this.pools[kind].pop() : null;
    if (object) this.poolStats.reused[kind] += 1;
    else { object = {}; this.poolStats.created[kind] += 1; }
    const hit = object.hit instanceof Set ? object.hit : null;
    const hitIds = object.hitIds instanceof Set ? object.hitIds : null;
    // Reset values while retaining stable property slots; no entity from a
    // previous attack can leave a target, explosion, or damage flag behind.
    for (const key of Object.keys(object)) object[key] = undefined;
    Object.assign(object, data);
    if (kind === 'projectile') { object.hit = hit || new Set(); object.hit.clear(); }
    if (kind === 'effect' && data.hitIds) { object.hitIds = hitIds || new Set(); object.hitIds.clear(); }
    return object;
  }

  release(kind, object) {
    const limit = kind === 'projectile' ? BALANCE.maxProjectiles : kind === 'gem' ? BALANCE.maxGems : BALANCE.maxEffects;
    if (this.poolingEnabled && this.pools[kind].length < limit) this.pools[kind].push(object);
    this.poolStats.released[kind] += 1;
  }

  // The platform reports the visible world rect (camera view) each
  // frame; bouncing projectiles ricochet inside it so their bounces stay
  // on screen. Invalid or degenerate rects are ignored, and headless
  // engines simply never set one (legacy cast-box behaviour).
  setViewRect(rect) {
    if (!rect || !Number.isFinite(rect.x) || !Number.isFinite(rect.y) || !Number.isFinite(rect.w) || !Number.isFinite(rect.h) || rect.w < 200 || rect.h < 200) return;
    this.viewRect = { x: rect.x, y: rect.y, w: rect.w, h: rect.h };
  }

  updateProjectiles(dt) {
    for (let i = this.state.projectiles.length - 1; i >= 0; i -= 1) {
      const shot = this.state.projectiles[i];
      const previous = { x: shot.x, y: shot.y };
      shot.age += dt; shot.ttl -= dt;
      const wasAnchored = shot.anchored;
      if (shot.returning) {
        const direction = normalize(this.state.player.x - shot.x, this.state.player.y - shot.y);
        shot.vx = direction.x * (shot.speed || 390); shot.vy = direction.y * (shot.speed || 390);
        if (distance(shot, this.state.player) < 22) shot.ttl = 0;
      }
      if (shot.targetId && !shot.anchored) {
        const target = this.state.enemies.find((enemy) => enemy.id === shot.targetId && enemy.hp > 0);
        if (target) {
          const direction = normalize(target.x - shot.x, target.y - shot.y);
          const speed = shot.speed || 420; shot.vx = direction.x * speed; shot.vy = direction.y * speed;
        }
      }
      shot.x += shot.vx * dt; shot.y += shot.vy * dt;
      if (shot.kind === 'fire-wheel' && shot.trail) {
        shot.trailTimer = (shot.trailTimer || 0) - dt;
        if (shot.trailTimer <= 0) { shot.trailTimer = 0.07; this.effect({ x: shot.x, y: shot.y, kind: 'fire-trail', radius: shot.radius, color: '#ef7650', ttl: shot.trail, damage: (shot.damage || 10) * 0.09 }); }
      }
      if (shot.kind === 'ring' || shot.kind === 'ring-child') {
        // Bounce arena: the live screen rect when the platform supplies
        // one (the ring ricochets at the visible edges), else the
        // cast-time box kept for headless determinism. One wall bounce
        // per frame even at a corner (the old per-axis calls could count
        // a corner as two bounces).
        const view = this.viewRect;
        const inset = shot.radius || 5;
        const box = view
          ? { x: view.x + inset, y: view.y + inset, w: view.w - inset * 2, h: view.h - inset * 2 }
          : shot.bounds;
        if (box) {
          let hitWall = false;
          if (shot.x < box.x) { shot.x = box.x; shot.vx = Math.abs(shot.vx); hitWall = true; }
          else if (shot.x > box.x + box.w) { shot.x = box.x + box.w; shot.vx = -Math.abs(shot.vx); hitWall = true; }
          if (shot.y < box.y) { shot.y = box.y; shot.vy = Math.abs(shot.vy); hitWall = true; }
          else if (shot.y > box.y + box.h) { shot.y = box.y + box.h; shot.vy = -Math.abs(shot.vy); hitWall = true; }
          if (hitWall) this.bounceRing(shot, null);
        }
      }
      if ((shot.kind === 'light-spark' || shot.kind === 'moon-blade') && this.viewRect) {
        // Sparks chain between enemies; when their current target is
        // gone they would otherwise drift off-screen and expire unseen.
        // With a live view rect they ricochet at the screen edges
        // instead, so every bounce stays where the player can see it.
        const targetAlive = shot.targetId && this.state.enemies.some((enemy) => enemy.id === shot.targetId && enemy.hp > 0);
        if (!targetAlive) {
          const view = this.viewRect, r = shot.radius || 4;
          if (shot.x < view.x + r) { shot.x = view.x + r; shot.vx = Math.abs(shot.vx); }
          else if (shot.x > view.x + view.w - r) { shot.x = view.x + view.w - r; shot.vx = -Math.abs(shot.vx); }
          if (shot.y < view.y + r) { shot.y = view.y + r; shot.vy = Math.abs(shot.vy); }
          else if (shot.y > view.y + view.h - r) { shot.y = view.y + view.h - r; shot.vy = -Math.abs(shot.vy); }
        }
      }
      if (shot.kind === 'light-orb' && shot.target && !shot.anchored && this.segmentDistance(previous, shot, shot.target) <= 0.01) {
        shot.x = shot.target.x; shot.y = shot.target.y;
        shot.vx = 0; shot.vy = 0; shot.anchored = true; shot.ttl = shot.linger || 0;
        if (shot.split) this.splitOrb(shot);
      }
      if (wasAnchored && shot.kind === 'light-orb') {
        for (const enemy of this.state.enemies.slice()) if (distance(enemy, shot) <= 32 + enemy.radius) this.damageEnemy(enemy, shot.damage * dt, {});
      }
      if (shot.hostile) {
        const player = this.state.player;
        if (this.segmentDistance(previous, shot, player) <= shot.radius + player.radius) { this.damagePlayer(shot.damage); shot.ttl = 0; }
      }
      for (const enemy of this.state.enemies.slice()) {
        if (shot.hostile || wasAnchored && shot.kind === 'light-orb') break;
        if (shot.hit.has(enemy.id)) continue;
        if (this.segmentDistance(previous, shot, enemy) <= (shot.radius || 5) + enemy.radius) {
          shot.hit.add(enemy.id);
          this.damageEnemy(enemy, shot.damage || 12, { knockback: shot.knockback, stun: shot.stun || 0 });
          if (enemy.hp <= 0 && shot.refundOnKill && shot.refundSkill) {
            const skill = this.state.skills.find((item) => item.id === shot.refundSkill);
            if (skill) skill.cooldown = Math.max(0, (skill.cooldown || 0) - shot.refundOnKill);
          }
          if (shot.refund && shot.refundSkill) {
            const skill = this.state.skills.find((item) => item.id === shot.refundSkill);
            if (skill) skill.cooldown = Math.max(0, (skill.cooldown || 0) - shot.refund);
          }
          if (shot.explosion) this.explodeProjectile(shot);
          if (shot.returnToPlayer && !shot.returning) { shot.returning = true; shot.targetId = null; shot.pierce = true; }
          if (shot.kind === 'light-spark' || shot.kind === 'moon-blade') {
            shot.bounceCount = (shot.bounceCount || 0) + 1;
            if (shot.bounceCount <= (shot.maxBounces || 0)) {
              const pool = (shot.targetIds || []).map((id) => this.state.enemies.find((item) => item.id === id && item.hp > 0)).filter(Boolean);
              const next = this.sortedEnemies(shot, (item) => pool.includes(item) && item.id !== enemy.id)[0];
              if (next) { shot.targetId = next.id; shot.hit.clear(); shot.hit.add(enemy.id); }
              else shot.ttl = 0;
            } else shot.ttl = 0;
            break;
          }
          if (shot.kind === 'ring' || shot.kind === 'ring-child') {
            this.bounceRing(shot, enemy);
            break;
          }
          if (!shot.pierce) { shot.ttl = 0; break; }
        }
      }
      if (shot.ttl <= 0 || shot.x < -120 || shot.y < -120 || shot.x > BALANCE.worldSize + 120 || shot.y > BALANCE.worldSize + 120) {
        if (shot.explosion && !shot.exploded) this.explodeProjectile(shot);
        this.state.projectiles.splice(i, 1);
        this.release('projectile', shot);
      }
    }
  }

  splitOrb(orb) {
    const pool = this.sortedEnemies(orb, (enemy) => enemy.kind === 'normal').slice(0, orb.targetLimit || 2);
    for (let i = 0; i < Math.min(orb.split, 15); i += 1) {
      const angle = i / orb.split * TAU;
      this.projectile({ x: orb.x, y: orb.y, vx: Math.cos(angle) * 420, vy: Math.sin(angle) * 420, radius: 4, color: '#d8f8ff', kind: 'light-spark', ttl: 3, damage: orb.damage * 0.28, targetId: pool[i % Math.max(pool.length, 1)]?.id, targetIds: pool.map((item) => item.id), speed: 420, maxBounces: orb.bounce || 0, bounceCount: 0, targetLimit: orb.targetLimit || 2 });
    }
  }

  bounceRing(shot, enemy) {
    shot.bounceCount = (shot.bounceCount || 0) + 1;
    shot.targetId = null; shot.hit.clear(); if (enemy) shot.hit.add(enemy.id);
    if (enemy) {
      const nearby = this.sortedEnemies(enemy, (candidate) => candidate.id !== enemy.id && distance(candidate, enemy) < 110).slice(0, Math.max(0, (shot.aoeTargets || 1) - 1));
      for (const candidate of nearby) this.damageEnemy(candidate, shot.damage * 0.45, {});
      if (shot.bounceCount === 1) { shot.vx *= -1; shot.vy *= -1; }
      else { const angle = Math.atan2(shot.vy, shot.vx) + Math.PI + 0.28; shot.vx = Math.cos(angle) * shot.speed; shot.vy = Math.sin(angle) * shot.speed; }
    } else {
      for (const candidate of this.sortedEnemies(shot, (item) => distance(item, shot) < 110).slice(0, shot.aoeTargets || 1)) this.damageEnemy(candidate, shot.damage * 0.45, {});
    }
    if (!shot.child && shot.splitChildren) for (let i = 0; i < shot.splitChildren; i += 1) {
        const angle = Math.atan2(shot.vy, shot.vx) + Math.PI + (i - (shot.splitChildren - 1) / 2) * 0.8;
        this.projectile({ x: shot.x, y: shot.y, vx: Math.cos(angle) * 360, vy: Math.sin(angle) * 360, radius: 8, color: '#e7cb75', kind: 'ring-child', ttl: 5, damage: shot.damage * 0.4, speed: 360, maxBounces: shot.childBounces, bounceCount: 0, aoeTargets: 1, splitChildren: 0, child: true, pierce: true, bounds: { ...shot.bounds } });
    }
    if (shot.bounceCount >= shot.maxBounces) shot.ttl = 0;
  }

  explodeProjectile(shot) {
    if (shot.exploded) return;
    shot.exploded = true;
    this.effect({ x: shot.x, y: shot.y, kind: 'explosion', radius: shot.explosion, color: shot.color, ttl: 0.28 });
    this.hitCircle(shot.x, shot.y, shot.explosion, (shot.damage || 12) * 0.65);
  }

  damagePlayer(amount) {
    const player = this.state.player;
    if (this.debugMode && this.debugInvincible) return;
    if (this.state.status !== 'playing' || player.invulnerable > 0) return;
    const value = amount * (1 - clamp(Number(this.talents.warding || 0) * 0.025, 0, 0.25));
    const absorbed = Math.min(player.shield || 0, value);
    player.shield = Math.max(0, (player.shield || 0) - absorbed); player.hp -= value - absorbed;
    player.invulnerable = 0.6; this.emit({ type: 'hit', target: 'player', amount: value });
    player.hitFlash = 0.28;
    player.hitTimer = 0.28; this.setAnimation(player, 'hit');
    if (player.hp <= 0) {
      if (this.character.id === 'bajie' && !player.lastStandUsed) { player.hp = 1; player.lastStandUsed = true; player.invulnerable = 2; }
      else this.lose();
    }
  }

  segmentDistance(a, b, point) {
    const dx = b.x - a.x; const dy = b.y - a.y;
    const lengthSq = dx * dx + dy * dy;
    const t = lengthSq ? clamp(((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSq, 0, 1) : 0;
    return Math.hypot(point.x - (a.x + dx * t), point.y - (a.y + dy * t));
  }

  updateEffects(dt) {
    for (let i = this.state.effects.length - 1; i >= 0; i -= 1) {
      const effect = this.state.effects[i];
      // Authored telegraphs stay synchronized with the boss even when stun or
      // knockback delays its windup. They never damage by merely expiring.
      if (effect.kind === 'warning' && effect.bossPattern) {
        const owner = this.state.enemies.find((enemy) => enemy.id === effect.sourceId && enemy.hp > 0);
        effect.ttl = owner?.attackPhase === 'windup' ? owner.attackWindup + dt : 0;
      }
      const activeDt = Math.min(dt, Math.max(0, effect.ttl)); effect.ttl -= dt;
      const actor = battleEnemyAnimation(effect);
      if (actor && effect.animationState === 'death') {
        effect.frameTime = Math.min(effect.maxTtl, Math.max(0, effect.maxTtl - effect.ttl));
        effect.animationFrames = actor.frames.death;
        effect.frameIndex = Math.min(actor.frames.death - 1, Math.floor((effect.frameTime + 1e-8) * actor.fps.death));
      } else if (effect.animationState) this.stepAnimation(effect, effect.animationState, activeDt, effect.animationState === 'death' ? 14 : 10);
      if (effect.followPlayer) { effect.x = this.state.player.x; effect.y = this.state.player.y; }
      if (effect.kind === 'bead' || effect.kind === 'skull-bead') {
        effect.x = this.state.player.x + Math.cos(effect.angle + this.state.time * effect.angularSpeed) * effect.orbitRadius;
        effect.y = this.state.player.y + Math.sin(effect.angle + this.state.time * effect.angularSpeed) * effect.orbitRadius;
      }
      if (effect.kind === 'monkey-clone') {
        const target = this.sortedEnemies(effect, (enemy) => !effect.hitIds.has(enemy.id) && distance(enemy, effect) < 210)[0];
        if (target) { const direction = normalize(target.x - effect.x, target.y - effect.y); effect.vx = direction.x * 165; effect.vy = direction.y * 165; }
        effect.x += effect.vx * activeDt; effect.y += effect.vy * activeDt;
        for (const enemy of this.state.enemies.slice()) if (!effect.hitIds.has(enemy.id) && distance(enemy, effect) < effect.radius + enemy.radius) {
          effect.hitIds.add(enemy.id); this.damageEnemy(enemy, effect.damage, {}); enemy.stun = Math.max(enemy.stun, 1.1); effect.intercepts -= 1;
          if (effect.intercepts <= 0) { effect.ttl = 0; break; }
        }
      }
      if (effect.delay > 0) { effect.delay -= activeDt; if (effect.delay <= 0 && effect.burstDamage) { this.hitCircle(effect.x, effect.y, effect.radius, effect.burstDamage); effect.burstDamage = 0; } }
      if (effect.kind === 'gourd') {
        const mouth = { x: effect.x + Math.cos(effect.angle) * 28, y: effect.y + Math.sin(effect.angle) * 28 };
        for (const enemy of this.state.enemies.slice()) {
          const relative = Math.atan2(enemy.y - effect.y, enemy.x - effect.x) - effect.angle;
          if (distance(effect, enemy) > effect.radius + enemy.radius || Math.abs(Math.atan2(Math.sin(relative), Math.cos(relative))) > effect.arc / 2) continue;
          if (enemy.kind === 'normal') {
            const direction = normalize(mouth.x - enemy.x, mouth.y - enemy.y);
            const pull = Math.min(distance(enemy, mouth), effect.pull * activeDt);
            enemy.x += direction.x * pull; enemy.y += direction.y * pull; enemy.nextSlow = Math.min(enemy.nextSlow || 1, 0.4);
            if (distance(enemy, mouth) <= 18 + enemy.radius * 0.3) this.damageEnemy(enemy, enemy.hp, {});
          } else {
            this.damageEnemy(enemy, effect.damage * activeDt, {});
            enemy.nextSlow = Math.min(enemy.nextSlow || 1, enemy.kind === 'elite' ? 0.62 : 0.85);
          }
        }
      }
      if (['whirl', 'fire-ring', 'rope', 'fire-mark', 'poison', 'fire-pool', 'fan', 'bead', 'skull-bead', 'fire-trail'].includes(effect.kind)) {
        for (const enemy of this.state.enemies.slice()) if (distance(effect, enemy) <= effect.radius + enemy.radius) {
          if (effect.kind === 'fan') {
            const difference = Math.atan2(enemy.y - effect.y, enemy.x - effect.x) - effect.angle;
            if (Math.abs(Math.atan2(Math.sin(difference), Math.cos(difference))) > 0.75) continue;
          }
          this.damageEnemy(enemy, (effect.damage == null ? 4 : effect.damage) * activeDt, { knockback: 0 });
          if (effect.kind === 'whirl') {
            if (this.character.id === 'wujing' && !effect.hitIds?.has(enemy.id)) {
              effect.hitIds?.add(enemy.id);
              this.state.player.whirlHits = (this.state.player.whirlHits || 0) + 1;
              if (this.state.player.whirlHits >= 12) { this.state.player.whirlHits = 0; this.state.player.shield = Math.min(30, (this.state.player.shield || 0) + 10); }
            }
            const level = effect.slowPower || 3;
            const slow = level >= 5 ? (enemy.kind === 'normal' ? 0.32 : enemy.kind === 'elite' ? 0.62 : 0.82) : level >= 4 ? (enemy.kind === 'normal' ? 0.55 : 0.78) : 0.9;
            enemy.nextSlow = Math.min(enemy.nextSlow || 1, slow);
            if (effect.pull) {
              const pull = normalize(effect.x - enemy.x, effect.y - enemy.y);
              const strength = enemy.kind === 'normal' ? 1 : enemy.kind === 'elite' ? 0.4 : 0.12;
              enemy.x += pull.x * effect.pull * activeDt * strength; enemy.y += pull.y * effect.pull * activeDt * strength;
            }
          }
        }
      }
      if (effect.kind === 'rope') for (const enemy of this.state.enemies) if (distance(effect, enemy) <= effect.radius) enemy.nextSlow = Math.min(enemy.nextSlow || 1, 0.65);
      if (effect.ttl <= 0) {
        if (effect.hostileDamage && distance(effect, this.state.player) <= effect.radius + this.state.player.radius) this.damagePlayer(effect.hostileDamage);
        if (effect.burstDamage) {
          this.hitCircle(effect.x, effect.y, effect.radius, effect.burstDamage);
          this.effect({ x: effect.x, y: effect.y, kind: 'explosion', radius: effect.radius, color: effect.color, ttl: 0.25 });
        }
        if (effect.fireAfter) this.effect({ x: effect.x, y: effect.y, kind: 'fire-pool', radius: effect.radius, color: '#ee8054', ttl: 3, damage: (effect.damage || 6) * 0.4 });
        this.state.effects.splice(i, 1);
        this.release('effect', effect);
      }
    }
  }

  hitCircle(x, y, radius, amount) {
    for (const enemy of this.state.enemies.slice()) if (Math.hypot(enemy.x - x, enemy.y - y) <= radius + enemy.radius) this.damageEnemy(enemy, amount, {});
  }

  hitCone(angle, radius, arc, amount, stunChance = 0, critical = false) {
    const player = this.state.player;
    for (const enemy of this.state.enemies.slice()) {
      const d = distance(enemy, player); if (d > radius + enemy.radius) continue;
      let delta = Math.atan2(enemy.y - player.y, enemy.x - player.x) - angle;
      delta = Math.atan2(Math.sin(delta), Math.cos(delta));
      if (Math.abs(delta) <= arc / 2) this.damageEnemy(enemy, amount, { stun: this.rng() < stunChance ? 1.4 : 0, critical });
    }
  }

  hitLine(angle, length, width, amount, bleedTicks = null) {
    const player = this.state.player;
    for (const enemy of this.state.enemies.slice()) {
      const dx = enemy.x - player.x; const dy = enemy.y - player.y;
      const forward = dx * Math.cos(angle) + dy * Math.sin(angle);
      const lateral = Math.abs(-dx * Math.sin(angle) + dy * Math.cos(angle));
      if (forward >= 0 && forward <= length && lateral <= width + enemy.radius) {
        this.damageEnemy(enemy, amount, {});
        if (bleedTicks) {
          if (!enemy.bleeds) enemy.bleeds = [];
          // Every hit has three exact one-second ticks. Up to three concurrent
          // applications fit the one-second attack rhythm and stay bounded.
          enemy.bleeds.push({ baseDamage: amount, ticks: bleedTicks.slice(), tick: 0, timer: 1 });
          if (enemy.bleeds.length > 3) enemy.bleeds.shift();
        }
      }
    }
  }

  damageEnemy(enemy, amount, options = {}) {
    if (!enemy || enemy.hp <= 0) return;
    const value = Math.max(0, Number(amount) || 0);
    enemy.hp -= value; enemy.flash = 0.12; this.state.damage += value;
    const actor = battleEnemyAnimation(enemy);
    if (actor) {
      if (enemy.visualHitTimer <= 1e-8) { enemy.frameTime = 0; enemy.frameIndex = 0; }
      enemy.visualHitTimer = actor.frames.hit / actor.fps.hit;
      enemy.visualAttackTimer = 0;
    }
    enemy.hitTimer = Math.max(enemy.hitTimer || 0, 0.12); this.setAnimation(enemy, 'hit');
    // Per-target feedback throttling bounds orbit/DoT labels without changing
    // damage, status application or the RNG stream. Every hit still emits below.
    // Playtest display rule (2026-10-22): labels show whole numbers only. A hit
    // that rounds to zero (sub-point DoT ticks from whirl/fire pools) stays
    // silent instead of floating "0.0"/"0.1"; the damage value is untouched.
    const shownDamage = Math.round(value);
    if (value > 0 && shownDamage > 0 && this.state.time >= (enemy.feedbackAt || -1)) {
      enemy.feedbackAt = this.state.time + .09;
      this.state.damageNumbers.push({ x: enemy.x, y: enemy.y - enemy.radius - 8, damage: shownDamage, ttl: 1.25, maxTtl: 1.25, color: options.critical ? '#fff03d' : '#fff3b8', critical: Boolean(options.critical), size: options.critical ? 22 : 17 });
      if (this.state.damageNumbers.length > 48) this.state.damageNumbers.splice(0, this.state.damageNumbers.length - 48);
    }
    this.emit({ type: 'hit', target: 'enemy', amount: value, critical: Boolean(options.critical), enemy });
    if (options.knockback && options.knockback <= 1) {
      enemy.knockback = Math.max(enemy.knockback || 0, options.knockback);
      const away = normalize(enemy.x - this.state.player.x, enemy.y - this.state.player.y);
      enemy.x += away.x * 14; enemy.y += away.y * 14;
    } else if (options.knockback) {
      const away = normalize(enemy.x - this.state.player.x, enemy.y - this.state.player.y);
      enemy.x += away.x * options.knockback; enemy.y += away.y * options.knockback;
    }
    if (options.stun) enemy.stun = Math.max(enemy.stun, options.stun);
    if (enemy.hp <= 0) this.killEnemy(enemy);
  }

  killEnemy(enemy) {
    const index = this.state.enemies.indexOf(enemy); if (index < 0) return;
    const actor = battleEnemyAnimation(enemy);
    this.effect({
      x: enemy.x, y: enemy.y, kind: 'death', radius: enemy.radius * (enemy.kind === 'boss' ? 1.8 : 1.25),
      color: enemy.kind === 'boss' ? '#ffcf4f' : (enemy.color || '#f2a14a'), ttl: enemy.kind === 'boss' ? 0.72 : 0.42,
      animationState: 'death', frameIndex: 0, frameTime: 0, animationFrames: actor ? actor.frames.death : animationFrames('death'),
      enemyKind: enemy.kind, variant: enemy.variant, name: enemy.name, final: Boolean(enemy.final), bossIdentity: enemy.bossIdentity || null,
      encounterIdentity: enemy.encounterIdentity || null,
      ...(actor ? { battleSpriteId: actor.id, facing: enemy.facing, bodyRadius: enemy.radius } : {}),
    });
    this.state.enemies.splice(index, 1); this.state.kills += 1;
    const value = enemy.xp || 2;
    this.dropGem(enemy.x, enemy.y, value, 'xp');
    if (enemy.kind === 'boss') { this.dropGem(enemy.x, enemy.y, enemy.coin || (enemy.final ? 80 : 35), 'coin'); this.emit({ type: 'kill', enemy, boss: true, final: Boolean(enemy.final) }); }
    else {
      if (this.rng() < 0.045) this.dropGem(enemy.x + 8, enemy.y, 1, 'heal');
      if (enemy.kind === 'elite' || this.rng() < 0.22) this.dropGem(enemy.x - 8, enemy.y, enemy.kind === 'elite' ? 5 : 1, 'coin');
      if (this.rng() < 0.004) this.dropGem(enemy.x, enemy.y + 8, 1, 'magnet');
      this.emit({ type: 'kill', enemy });
    }
  }

  dropGem(x, y, value, kind) {
    if (this.state.gems.length >= BALANCE.maxGems) {
      const compatible = this.state.gems.find((gem) => gem.kind === kind);
      if (compatible) { compatible.value += value; return; }
      const displaced = this.state.gems.shift();
      const receiver = this.state.gems.find((gem) => gem.kind === displaced.kind);
      if (receiver) receiver.value += displaced.value;
      this.release('gem', displaced);
    }
    this.state.gems.push(this.acquire('gem', { id: this.allocId('gem'), x, y, value, kind }));
  }

  updateGems(dt = 0.05) {
    const player = this.state.player;
    for (let i = this.state.gems.length - 1; i >= 0; i -= 1) {
      const gem = this.state.gems[i];
      const d = distance(gem, player);
      const pickupRadius = 30 + (Number(this.talents.fortune || 0) * 8);
      if (d <= pickupRadius) {
        this.state.gems.splice(i, 1); this.collectGem(gem); this.release('gem', gem); continue;
      }
      if (d < 170 && gem.kind === 'xp' || gem.magnetized) {
        const vector = normalize(player.x - gem.x, player.y - gem.y);
        gem.x += vector.x * 270 * dt; gem.y += vector.y * 270 * dt;
      }
    }
  }

  collectGem(gem) {
    if (gem.kind === 'xp') {
      this.state.player.xp += gem.value * (1 + clamp(Number(this.talents.fortune || 0) * 0.04, 0, 0.4));
      while (this.state.player.xp >= this.state.player.xpNext) {
        this.state.player.xp -= this.state.player.xpNext;
        this.state.player.level += 1;
        // A full run reaches roughly 23–26 upgrades from authentic drops.
        // Exponential requirements previously stopped most builds at level 12.
        const level = this.state.player.level;
        this.state.player.xpNext = Math.round(22 + level * 3 + level * level * 0.15);
        this.pendingUpgrades += 1;
      }
      if (this.pendingUpgrades && this.state.status === 'playing') this.openUpgrade();
    } else if (gem.kind === 'heal') this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + this.state.player.maxHp * 0.12);
    else if (gem.kind === 'coin') this.state.coins += Math.round(gem.value * (1 + clamp(Number(this.talents.fortune || 0) * 0.04, 0, 0.4)));
    else if (gem.kind === 'magnet') for (const remaining of this.state.gems) remaining.magnetized = true;
    this.emit({ type: 'pickup', kind: gem.kind, value: gem.value });
    if (this.character.id === 'wukong' && gem.kind === 'xp') this.state.player.speedBoost = 0.75;
  }

  openUpgrade() {
    this.state.status = 'upgrade';
    if (this.character.id === 'tangseng') this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + this.state.player.maxHp * 0.06);
    this.state.choices = this.makeChoices();
    this.emit({ type: 'upgrade', choices: this.state.choices });
  }

  makeChoices() {
    const owned = this.state.skills;
    const weapon = owned.find((skill) => skill.isWeapon);
    const choices = [];
    if (weapon && weapon.level < 5) choices.push(this.choiceFor(weapon.id, weapon.level));
    const candidates = ARTIFACTS.filter((artifact) => {
      const skill = owned.find((item) => item.id === artifact.id);
      return skill ? skill.level < 5 : owned.length < 5;
    });
    const shuffled = candidates.slice();
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(this.rng() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    for (const artifact of shuffled) {
      if (choices.length >= 3) break;
      const existing = owned.find((skill) => skill.id === artifact.id);
      choices.push(this.choiceFor(artifact.id, existing ? existing.level : 0));
    }
    const maxed = owned.length >= 5 && owned.every((skill) => skill.level >= 5);
    while (choices.length < 3) choices.push({ id: `boon:${choices.length}`, name: maxed ? '功德精进' : '临战心得', description: '提升 8% 伤害并回复 8% 生命。', level: 1, isWeapon: false, color: '#eacb82', icon: 'boon', boon: true });
    return choices.slice(0, 3);
  }

  choiceFor(id, level) {
    if (id.startsWith(WEAPON_PREFIX)) {
      const next = level + 1; return { id, name: this.character.weapon, description: this.character.weaponLevels[next - 1] || '武器精进', level: next, isWeapon: true, color: this.character.color, icon: 'weapon' };
    }
    const artifact = ARTIFACTS.find((item) => item.id === id);
    const next = level + 1;
    return { id, name: artifact ? artifact.name : id, description: artifact ? (artifact.levels[next - 1] || artifact.description) : '法宝精进', level: next, isWeapon: false, color: artifact ? artifact.color : '#eacb82', icon: artifact ? artifact.icon : 'artifact' };
  }

  chooseUpgrade(id) {
    if (this.disposed || this.state.status !== 'upgrade') return false;
    const choice = this.state.choices.find((item) => item.id === id);
    if (!choice) return false;
    if (choice.boon) {
      this.state.player.maxHp = Math.round(this.state.player.maxHp * 1.04); this.state.player.hp = Math.min(this.state.player.maxHp, this.state.player.hp + this.state.player.maxHp * 0.08); this.state.player.damageBonus = (this.state.player.damageBonus || 0) + 0.08;
    } else {
      let skill = this.state.skills.find((item) => item.id === choice.id);
      if (skill) skill.level = Math.min(5, skill.level + 1);
      else if (this.state.skills.length < 5) { skill = { id: choice.id, level: 1, isWeapon: Boolean(choice.isWeapon), cooldown: 0 }; this.state.skills.push(skill); }
      else return false;
    }
    this.pendingUpgrades = Math.max(0, this.pendingUpgrades - 1);
    this.state.choices = []; this.state.status = 'playing'; this.emit({ type: 'upgrade', selected: choice.id });
    if (this.pendingUpgrades > 0) this.openUpgrade();
    return true;
  }

  pause() { if (this.state.status === 'playing') this.state.status = 'paused'; return this.state.status; }
  resume() { if (this.state.status === 'paused') this.state.status = 'playing'; return this.state.status; }

  useDash(input = {}, fromArtifact = false) {
    if (this.disposed || this.state.status !== 'playing') return false;
    if (!fromArtifact && this.state.player.dashCooldown > 0) return false;
    const hasDirection = Math.hypot(Number(input.x) || 0, Number(input.y) || 0) > 0.001;
    const direction = hasDirection ? normalize(Number(input.x) || 0, Number(input.y) || 0) : { x: Math.cos(this.state.player.facing), y: Math.sin(this.state.player.facing) };
    const cooldown = 5 * (1 - clamp(Number(this.talents['dash-master'] || 0) * 0.045, 0, 0.36));
    this.movePlayer(direction.x * 180, direction.y * 180);
    this.state.player.invulnerable = 0.45; this.state.player.dashCooldown = fromArtifact ? Math.min(this.state.player.dashCooldown, cooldown * 0.5) : cooldown;
    this.state.player.dashTimer = 0.42; this.setAnimation(this.state.player, 'dash');
    this.effect({ x: this.state.player.x, y: this.state.player.y, kind: 'dash', radius: 34, angle: this.state.player.facing, color: '#bde9ff', ttl: 0.25 });
    this.emit({ type: 'dash' }); return true;
  }

  checkVictory() {
    if (this.state.status !== 'playing') return;
    if (this.state.time >= BALANCE.duration && this.finalBossSpawned && !this.state.enemies.some((enemy) => enemy.final)) {
      this.state.status = 'won'; this.emit({ type: 'win' });
    }
  }
  lose() { if (this.state.status === 'playing' || this.state.status === 'upgrade') { this.state.status = 'lost'; this.emit({ type: 'lose' }); } }

  trimCaps() {
    while (this.state.enemies.length > BALANCE.maxEnemies) this.state.enemies.shift();
    while (this.state.projectiles.length > BALANCE.maxProjectiles) this.release('projectile', this.state.projectiles.shift());
    while (this.state.effects.length > BALANCE.maxEffects) this.release('effect', this.state.effects.shift());
    while (this.state.gems.length > BALANCE.maxGems) this.state.gems.shift();
  }

  debug(action, payload = {}) {
    if (!this.debugMode) return false;
    if (action === 'invincible') { this.debugInvincible = payload.enabled !== false; return true; }
    if (action === 'pooling') { this.poolingEnabled = payload.enabled !== false; for (const pool of Object.values(this.pools)) pool.length = 0; return true; }
    if (action === 'spawn') return this.spawnEnemy(payload.kind || 'normal', payload.variant || 0);
    if (action === 'damage') { const enemy = this.state.enemies.find((item) => item.id === payload.id) || this.state.enemies[0]; if (enemy) this.damageEnemy(enemy, payload.amount || enemy.hp); return true; }
    if (action === 'xp') { this.dropGem(this.state.player.x, this.state.player.y, payload.value || 100, 'xp'); return true; }
    if (action === 'time') { this.elapsed = Number(payload.value) || 0; this.state.time = this.elapsed; return true; }
    if (action === 'killFinal') { for (const enemy of this.state.enemies.filter((item) => item.final)) this.killEnemy(enemy); return true; }
    if (action === 'spawnBoss') return this.spawnBoss(Boolean(payload.final), payload.override || {});
    if (action === 'spawnWave') { this.spawnWave(this.state.time); return true; }
    if (action === 'clearField') { for (const enemy of [...this.state.enemies]) if (enemy.kind === 'normal' || (payload.all && enemy.kind === 'elite')) this.damageEnemy(enemy, enemy.hp + 1, {}); return true; }
    if (action === 'snapshot') return { state: this.getSnapshot(), meta: { elapsed: this.elapsed, elitesSpawned: [...this.elitesSpawned], bossSpawned: this.bossSpawned, finalBossSpawned: this.finalBossSpawned, waveIndex: this.waveIndex, spawnAccumulator: this.spawnAccumulator } };
    if (action === 'restore') { if (!payload.state) return false; this.state = payload.state; const m = payload.meta || {}; this.elapsed = m.elapsed || 0; this.state.time = this.elapsed; this.elitesSpawned = new Set(m.elitesSpawned || []); this.bossSpawned = Boolean(m.bossSpawned); this.finalBossSpawned = Boolean(m.finalBossSpawned); this.waveIndex = m.waveIndex || 0; this.spawnAccumulator = m.spawnAccumulator || 0; return true; }
    return false;
  }

  getSnapshot() {
    return JSON.parse(JSON.stringify(this.state, (key, value) => value instanceof Set ? Array.from(value) : value));
  }

  dispose() { this.disposed = true; this.state.enemies.length = 0; this.state.projectiles.length = 0; this.state.effects.length = 0; this.state.gems.length = 0; for (const pool of Object.values(this.pools)) pool.length = 0; this.onEvent = () => {}; }
}

module.exports.default=GameEngine;


Object.assign(module.exports,{GameEngine});

},
"renderer":function(module,exports,require){
/*
 * 西游·八十一难 — procedural Canvas renderer
 *
 * This file deliberately has no DOM, Image, Path2D, gradient or platform
 * dependencies.  The same renderer is used by the browser prototype and the
 * WeChat mini-program adapter, which supplies a Canvas 2D context.  All art is
 * drawn from simple, original shapes so a playable build has no asset loading
 * gate.
 */

const { battleEnemyAnimation } = require('battle-enemy-animation');
const { skillFxIdForEffect, skillFxFrameRect } = require('skill-fx-animation');
const { CAVE_MOUTHS } = require('scene-collision');

const TAU = Math.PI * 2;
const WORLD_SIZE = 1800;
const EMPTY_LIST = Object.freeze([]);
const compareEnemyDepth = (a, b) => n(a.y) - n(b.y);
const STATUS_BADGES = Object.freeze({
  '眩晕': { glyph: '晕', color: '#ffe06b' },
  '燃烧': { glyph: '燃', color: '#ffae71' },
  '流血': { glyph: '血', color: '#ff9b9b' },
  '减速': { glyph: '慢', color: '#aee4ff' },
  '击退': { glyph: '退', color: '#d6c4ff' },
});
const MAX_STATUS_BADGES = 12;
const MAX_DAMAGE_LABEL_RECTS = 48;
const MAX_DAMAGE_ENEMY_RECTS = 512;
const MAX_HUD_OCCLUSION_RECTS = 2;

function enemyStatusBadge(enemy) {
  const status = enemy?.statusText || enemy?.debuff || enemy?.status
    || (enemy?.stun > 0 ? '眩晕' : enemy?.burn?.ttl > 0 ? '燃烧' : enemy?.bleeds?.length ? '流血'
      // slow is a speed multiplier: 1 is normal, 0 is treated as 1 by the
      // engine. Neither normal speed nor a speed-up is a debuff.
      : enemy?.slow > 0 && enemy.slow < 1 ? '减速' : enemy?.knockback > 0 ? '击退' : '');
  if (status == null || status === '' || status === false) return null;
  const label = typeof status === 'string' ? status : status.name || status.id || '受缚';
  // Boss identity is already carried by its nameplate, not a second status.
  if (enemy?.kind === 'boss' && ['最终妖王', '妖王', enemy.name].includes(label)) return null;
  return STATUS_BADGES[label] || { glyph: String(label).slice(0, 2), color: '#ffe06b' };
}

const THEMES = Object.freeze({
  // paper/ink keep the scroll identity; the extra saturated swatches are used
  // by the three depth layers and remain legible through a phone's small viewport.
  forest: { paper: '#16866e', paperDark: '#37b889', ink: '#071b24', leaf: '#75ec6b', accent: '#f44a48', road: '#ffd14a', motif: '#36e0e8', sky: '#2bb7b0', deep: '#0b4a4d', sticker: '#ffe84e' },
  sand: { paper: '#d87827', paperDark: '#f1b53f', ink: '#26131a', leaf: '#b5ed4b', accent: '#ff4b39', road: '#ffe14e', motif: '#31d9e3', sky: '#64c6d1', deep: '#7b371b', sticker: '#fff06a' },
  snow: { paper: '#4dc1d4', paperDark: '#b3f4ec', ink: '#082333', leaf: '#5decc0', accent: '#ff4d52', road: '#ffe05a', motif: '#3769f2', sky: '#d0ffff', deep: '#1c5b84', sticker: '#fff26b' },
  fire: { paper: '#b53b3e', paperDark: '#e9683e', ink: '#291323', leaf: '#ffad3e', accent: '#ff3b2f', road: '#ffdf4a', motif: '#8b55ff', sky: '#ef7260', deep: '#5c1c31', sticker: '#fff06a' },
  water: { paper: '#168eaa', paperDark: '#4ee0d2', ink: '#071e35', leaf: '#55f0b3', accent: '#ff6445', road: '#ffe04e', motif: '#658cff', sky: '#64ecf2', deep: '#0a4f75', sticker: '#fff069' },
  temple: { paper: '#4e2d91', paperDark: '#8657d3', ink: '#0b0d1d', leaf: '#5ce8ac', accent: '#ff4b55', road: '#ffda4c', motif: '#45e4ee', sky: '#7652d5', deep: '#241552', sticker: '#ffe84f' }
});

const HEROES = Object.freeze({
  wukong: { body: '#b64e34', dark: '#6b3027', light: '#e6a547', skin: '#bf7852', metal: '#efc35b', trim: '#6b4435' },
  tangsanzang: { body: '#d9edf0', dark: '#5b7094', light: '#8ccddd', skin: '#eac39f', metal: '#d1a953', trim: '#45607b' },
  bajie: { body: '#b85f49', dark: '#6a3a35', light: '#e6a46d', skin: '#e6a58b', metal: '#b7b7a2', trim: '#5d4a45' },
  shajing: { body: '#507f79', dark: '#294e51', light: '#91b7a2', skin: '#986b4b', metal: '#d3aa5a', trim: '#3d5e61' }
});

const ENEMY_TINTS = Object.freeze({
  forest: ['#6c4b3f', '#7e6944', '#4f6c52', '#8b5745'],
  sand: ['#87543b', '#986d43', '#6e5939', '#9c5c43'],
  snow: ['#52656b', '#6b5961', '#4d787c', '#87635f'],
  fire: ['#733933', '#934530', '#5c3c3b', '#ad6041'],
  water: ['#355f60', '#476f72', '#6f5c57', '#46644c'],
  temple: ['#57435d', '#76506a', '#4d566d', '#855e4c']
});

// Final guardians deliberately use identity-scoped vector profiles until
// dedicated 32-pose sheets pass the asset preflight.  These profiles are a
// visual distinction only: they never participate in combat, animation
// timing, or the ordinary animal-frame registry.
const FINAL_BOSS_PROFILES = Object.freeze({
  'yin-general': Object.freeze({ body: '#a94435', dark: '#52252b', light: '#efb34f', metal: '#f6d15a', accent: '#d7353e' }),
  'xiong-shanjun': Object.freeze({ body: '#6f4938', dark: '#38282b', light: '#d39a55', metal: '#d8c28a', accent: '#8e5a3f' }),
  'te-chushi': Object.freeze({ body: '#597064', dark: '#273b3c', light: '#d2a65b', metal: '#e6c971', accent: '#3e9b91' }),
});

const noopContext = {
  save() {}, restore() {}, beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, quadraticCurveTo() {}, bezierCurveTo() {}, arc() {},
  fill() {}, stroke() {}, fillRect() {}, strokeRect() {}, clearRect() {}, fillText() {}, setTransform() {}, translate() {}, scale() {}, rotate() {},
  clip() {}, measureText(text) { return { width: String(text).length * 8 }; }
};

function n(value, fallback = 0) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

// Animation is simulation-owned state. The renderer only turns the current
// state/frame into a small pose and an optional atlas crop, so pausing the
// engine freezes the exact same visual frame as the gameplay snapshot.
function animationState(entity) {
  return String(entity?.animationState || entity?.state || 'idle');
}

function animationFrame(entity) {
  const frames = Math.max(1, Number(entity?.animationFrames) || 1);
  return ((Math.floor(Number(entity?.frameIndex) || 0) % frames) + frames) % frames;
}

function animationPose(entity, radius) {
  const state = animationState(entity);
  const frames = Math.max(1, Number(entity?.animationFrames) || 1);
  const frame = animationFrame(entity);
  const wave = Math.sin(((frame + .5) / frames) * TAU);
  if (state === 'move') return { y: wave * radius * .055, rotation: wave * .045, scaleX: 1 + wave * .025, scaleY: 1 - wave * .018 };
  if (state === 'attack') return { y: wave * radius * .035, rotation: wave * .12, scaleX: 1 + wave * .035, scaleY: 1 - wave * .025 };
  if (state === 'hit') return { y: wave * radius * .02, rotation: wave * .08, scaleX: 1 - Math.abs(wave) * .035, scaleY: 1 + Math.abs(wave) * .025 };
  if (state === 'stun') return { y: 0, rotation: wave * .18, scaleX: 1, scaleY: 1 };
  if (state === 'dash') return { y: wave * radius * .08, rotation: wave * .06, scaleX: 1.12, scaleY: .9 };
  if (state === 'intro') return { y: (1 - (frame + 1) / frames) * radius * .22, rotation: wave * .06, scaleX: .82 + (frame + 1) / frames * .18, scaleY: .82 + (frame + 1) / frames * .18 };
  return { y: wave * radius * .018, rotation: wave * .018, scaleX: 1 + wave * .012, scaleY: 1 - wave * .012 };
}

// The in-battle rig is intentionally code-native.  Each simulation frame
// changes a small set of limbs/weapon angles, so the playable scene never
// treats a polished character card as a frozen sprite.  This is cheap enough
// for a phone Canvas and still gives eight meaningful movement/attack frames.
function battleMotion(entity, radius = 18) {
  const state = animationState(entity);
  const frames = Math.max(1, Number(entity?.animationFrames) || 1);
  const frame = animationFrame(entity);
  const phase = ((frame + .5) / frames) * TAU;
  const wave = Math.sin(phase);
  const halfWave = Math.sin(phase * .5);
  const move = state === 'move' || state === 'dash';
  const attack = state === 'attack';
  return {
    frame, phase, wave, halfWave,
    stride: move ? wave * radius * .20 : 0,
    armSwing: move ? -wave * .16 : attack ? halfWave * .34 : 0,
    weaponSwing: attack ? -halfWave * .34 : move ? wave * .08 : 0,
    lean: move ? wave * .045 : attack ? halfWave * .08 : 0,
  };
}

function spriteFrameRect(sprite, id, frameIndex, state = 'idle') {
  const grids = sprite?.__frameGrids;
  const rootGrid = (grids && grids[id]) || sprite?.__frameGrid;
  // A battle sprite can provide state-specific frame strips.  Keep the
  // source rectangle fallback compatible with the original one-grid metadata
  // so SVG/legacy adapters continue to render without any special casing.
  const grid = rootGrid?.states?.[state] || rootGrid?.states?.idle || rootGrid;
  if (!grid) return null;
  const source = grid.source || sprite?.__sourceRects?.[id] || { x: 0, y: 0, w: Number(sprite.naturalWidth || sprite.width) || 1, h: Number(sprite.naturalHeight || sprite.height) || 1 };
  const cols = Math.max(1, Math.floor(Number(grid.cols) || 1));
  const rows = Math.max(1, Math.floor(Number(grid.rows) || 1));
  const rects = Array.isArray(grid.rects) ? grid.rects : null;
  const offsets = Array.isArray(grid.offsets) ? grid.offsets : null;
  const scales = Array.isArray(grid.scales) ? grid.scales : null;
  const declaredFrames = rects?.length || Number(grid.frames) || cols * rows;
  const count = Math.max(1, Math.min(rects ? rects.length : cols * rows, Math.floor(declaredFrames)));
  const frame = ((Math.floor(Number(frameIndex) || 0) % count) + count) % count;
  if (rects?.[frame]) {
    const item = rects[frame];
    const offset = offsets?.[frame] || {};
    const scale = scales?.[frame] || {};
    return {
      x: Number(item.x) || source.x, y: Number(item.y) || source.y,
      w: Number(item.w) || source.w, h: Number(item.h) || source.h,
      dx: Number(offset.dx) || 0, dy: Number(offset.dy) || 0,
      scaleX: Number(scale.x ?? scale.scaleX) || 1,
      scaleY: Number(scale.y ?? scale.scaleY) || 1,
      state, frame
    };
  }
  const sw = Number(grid.frameWidth) || source.w / cols;
  const sh = Number(grid.frameHeight) || source.h / rows;
  const offset = offsets?.[frame] || {};
  const scale = scales?.[frame] || {};
  return {
    x: source.x + (frame % cols) * sw, y: source.y + Math.floor(frame / cols) * sh, w: sw, h: sh,
    dx: Number(offset.dx) || 0, dy: Number(offset.dy) || 0,
    scaleX: Number(scale.x ?? scale.scaleX) || 1,
    scaleY: Number(scale.y ?? scale.scaleY) || 1,
    state, frame
  };
}

function method(ctx, name, ...args) {
  if (ctx && typeof ctx[name] === 'function') {
    try { return ctx[name](...args); } catch (_) { return undefined; }
  }
  return undefined;
}

// Browser Image and WeChat's canvas image objects expose different readiness
// fields. Keep the asset path opportunistic: a missing/undecoded image must
// never block the deterministic vector fallback.
function imageReady(image) {
  return Boolean(image && (image.complete === undefined || image.complete || image.naturalWidth > 0 || image.width > 0));
}

function drawImageIfReady(ctx, image, ...args) {
  if (!imageReady(image) || typeof ctx?.drawImage !== 'function') return false;
  try { ctx.drawImage(image, ...args); return true; } catch (_) { return false; }
}

function drawImageCover(ctx, image, x, y, width, height) {
  if (!imageReady(image)) return false;
  const iw = Math.max(1, n(image.naturalWidth || image.videoWidth || image.width, width));
  const ih = Math.max(1, n(image.naturalHeight || image.videoHeight || image.height, height));
  const sourceRatio = iw / ih;
  const targetRatio = Math.max(.001, width / Math.max(1, height));
  let sx = 0, sy = 0, sw = iw, sh = ih;
  if (sourceRatio > targetRatio) { sw = ih * targetRatio; sx = (iw - sw) * .5; }
  else if (sourceRatio < targetRatio) { sh = iw / targetRatio; sy = (ih - sh) * .5; }
  return drawImageIfReady(ctx, image, sx, sy, sw, sh, x, y, width, height);
}

function paint(ctx, fill, stroke, lineWidth = 1) {
  if (fill != null) ctx.fillStyle = fill;
  if (stroke != null) ctx.strokeStyle = stroke;
  if (lineWidth != null) ctx.lineWidth = lineWidth;
}

function path(ctx, commands, fill, stroke, lineWidth = 1) {
  method(ctx, 'beginPath');
  for (const command of commands) {
    const op = command[0];
    if (op === 'M') method(ctx, 'moveTo', command[1], command[2]);
    else if (op === 'L') method(ctx, 'lineTo', command[1], command[2]);
    else if (op === 'Q') method(ctx, 'quadraticCurveTo', command[1], command[2], command[3], command[4]);
    else if (op === 'C') method(ctx, 'bezierCurveTo', command[1], command[2], command[3], command[4], command[5], command[6]);
    else if (op === 'A') method(ctx, 'arc', command[1], command[2], command[3], command[4], command[5], command[6]);
    else if (op === 'Z') method(ctx, 'closePath');
  }
  if (fill != null) { paint(ctx, fill); method(ctx, 'fill'); }
  if (stroke != null) { paint(ctx, null, stroke, lineWidth); method(ctx, 'stroke'); }
}

function circle(ctx, x, y, radius, fill, stroke, lineWidth = 1) {
  method(ctx, 'beginPath');
  method(ctx, 'arc', x, y, Math.max(0, radius), 0, TAU);
  if (fill != null) { paint(ctx, fill); method(ctx, 'fill'); }
  if (stroke != null) { paint(ctx, null, stroke, lineWidth); method(ctx, 'stroke'); }
}

function roundedBox(ctx, x, y, w, h, radius, fill, stroke, lineWidth = 1) {
  const r = Math.min(Math.abs(radius), Math.abs(w) / 2, Math.abs(h) / 2);
  path(ctx, [
    ['M', x + r, y], ['L', x + w - r, y], ['Q', x + w, y, x + w, y + r],
    ['L', x + w, y + h - r], ['Q', x + w, y + h, x + w - r, y + h],
    ['L', x + r, y + h], ['Q', x, y + h, x, y + h - r],
    ['L', x, y + r], ['Q', x, y, x + r, y], ['Z']
  ], fill, stroke, lineWidth);
}

function hash2(x, y) {
  // Stable pseudo-noise for map ornament placement.  It is never seeded from
  // Math.random, so replayed frames have exactly the same decorations.
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function themeFor(stage) {
  const theme = typeof stage?.theme === 'string' ? stage.theme : (typeof stage === 'string' ? stage : 'forest');
  return THEMES[theme] || THEMES.forest;
}

function heroStyle(characterId) {
  const key = String(characterId || '').toLowerCase().replace(/[^a-z]/g, '');
  if (key === 'tangsanzang' || key === 'tangseng' || key === 'tang' || key === 'sanzang') return ['tangsanzang', HEROES.tangsanzang];
  if (key === 'bajie' || key === 'zhubajie') return ['bajie', HEROES.bajie];
  if (key === 'shajing' || key === 'sha' || key === 'wujing') return ['shajing', HEROES.shajing];
  return ['wukong', HEROES.wukong];
}

function alphaColor(color, alpha) {
  // Canvas implementations accept rgba consistently; preserve CSS colors that
  // are not six-digit hex values as-is for old WeChat contexts.
  const match = String(color || '').match(/^#([0-9a-f]{6})$/i);
  if (!match) return color;
  const hex = match[1];
  return `rgba(${parseInt(hex.slice(0, 2), 16)},${parseInt(hex.slice(2, 4), 16)},${parseInt(hex.slice(4, 6), 16)},${clamp(alpha, 0, 1)})`;
}

function drawPortrait(ctx, characterId, x, y, size) {
  const [id, style] = heroStyle(characterId);
  const s = Math.max(1, n(size, 64));
  const r = s * 0.26;
  method(ctx, 'save');
  method(ctx, 'translate', n(x), n(y));
  circle(ctx, 0, s * 0.12, s * 0.45, '#dbc48f', '#5c4235', Math.max(1, s * 0.035));
  if (id === 'wukong') {
    circle(ctx, -s * 0.34, -s * 0.01, s * 0.14, style.body, style.dark, s * 0.03);
    circle(ctx, s * 0.34, -s * 0.01, s * 0.14, style.body, style.dark, s * 0.03);
    path(ctx, [['M', -s * .22, s * .03], ['Q', 0, -s * .22, s * .22, s * .03], ['L', s * .16, s * .29], ['L', -s * .16, s * .29], ['Z']], style.skin, style.dark, s * .03);
    circle(ctx, -s * .08, s * .09, s * .028, '#2b2527'); circle(ctx, s * .08, s * .09, s * .028, '#2b2527');
    paint(ctx, style.metal); method(ctx, 'fillRect', -s * .32, -s * .43, s * .64, s * .13); method(ctx, 'fillRect', -s * .19, -s * .57, s * .38, s * .18);
  } else if (id === 'tangsanzang') {
    circle(ctx, 0, -s * .01, s * .28, style.skin, style.dark, s * .03);
    path(ctx, [['M', -s * .37, s * .18], ['Q', 0, s * .02, s * .37, s * .18], ['L', s * .28, s * .55], ['L', -s * .28, s * .55], ['Z']], style.body, style.dark, s * .035);
    circle(ctx, -s * .09, s * .02, s * .022, '#2b3041'); circle(ctx, s * .09, s * .02, s * .022, '#2b3041');
    paint(ctx, null, style.metal, s * .03); method(ctx, 'beginPath'); method(ctx, 'moveTo', -s * .3, -s * .29); method(ctx, 'lineTo', s * .3, -s * .29); method(ctx, 'stroke');
  } else if (id === 'bajie') {
    circle(ctx, 0, s * .02, s * .29, style.skin, style.dark, s * .03);
    path(ctx, [['M', -s * .23, -s * .11], ['L', -s * .43, -s * .26], ['L', -s * .34, s * .02], ['Z']], style.skin, style.dark, s * .03);
    path(ctx, [['M', s * .23, -s * .11], ['L', s * .43, -s * .26], ['L', s * .34, s * .02], ['Z']], style.skin, style.dark, s * .03);
    circle(ctx, 0, s * .13, s * .13, style.light, style.dark, s * .025); circle(ctx, -s * .055, s * .12, s * .018, '#37282a'); circle(ctx, s * .055, s * .12, s * .018, '#37282a');
    path(ctx, [['M', -s * .33, s * .28], ['Q', 0, s * .12, s * .33, s * .28], ['L', s * .25, s * .6], ['L', -s * .25, s * .6], ['Z']], style.body, style.dark, s * .035);
  } else {
    circle(ctx, 0, s * .02, s * .28, style.skin, style.dark, s * .03);
    path(ctx, [['M', -s * .25, -s * .13], ['Q', 0, -s * .36, s * .25, -s * .13], ['L', s * .3, s * .02], ['L', -s * .3, s * .02], ['Z']], style.dark, style.dark, s * .02);
    path(ctx, [['M', -s * .3, s * .28], ['Q', 0, s * .08, s * .3, s * .28], ['L', s * .24, s * .61], ['L', -s * .24, s * .61], ['Z']], style.body, style.dark, s * .035);
    circle(ctx, -s * .09, s * .03, s * .02, '#252c30'); circle(ctx, s * .09, s * .03, s * .02, '#252c30');
  }
  // portrait frame is deliberately square and parchment-like for UI use
  roundedBox(ctx, -s * .52, -s * .58, s * 1.04, s * 1.2, s * .11, null, '#574235', Math.max(1, s * .035));
  method(ctx, 'restore');
}

class GameRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas || null;
    this.ctx = (canvas && typeof canvas.getContext === 'function' && canvas.getContext('2d')) || noopContext;
    this.width = Math.max(1, n(options.width, 375));
    this.height = Math.max(1, n(options.height, 667));
    this.pixelRatio = Math.max(0.5, n(options.pixelRatio, 1));
    this.quality = options.quality === 'low' ? 'low' : 'high';
    this.showHud = options.showHud !== false;
    // Battle mode is deliberately independent from gallery art.  The
    // authored PNGs remain available to menus/preview screens, while the
    // playable scene uses a deterministic multi-frame vector rig so a single
    // illustration cannot masquerade as animation.
    this.battleArtMode = options.battleArtMode === 'authoredFrames' ? 'authoredFrames' : 'vector';
    this.battleSceneMode = options.battleSceneMode === 'authoredLayers' ? 'authoredLayers' : 'vector';
    // Browser builds can supply the authored transparent SVG hero sprites;
    // wx Canvas keeps the deterministic vector fallback below when SVG is not
    // available. This makes the web slice use real character artwork without
    // adding a runtime network or DOM dependency to the renderer.
    this.heroImages = options.heroImages || {};
    this.skillImages = options.skillImages || {};
    this.skillFxImages = options.skillFxImages || {};
    this.enemyImages = options.enemyImages || {};
    this.craterImage = options.craterImage || null;
    // Scene assets are optional. Browser builds load the authored PNG/SVG
    // layers; the wx adapter can leave this empty and receive the exact same
    // vector scene fallback.
    this.mapImages = options.mapImages || {};
    this.mapAssetDraws = 0;
    this.camera = { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 };
    // The draw buffer owns only temporary references, never simulation order.
    this._enemyDrawList = [];
    // Numeric-only slots are reused; no actor references or unbounded label
    // histories survive a frame. Crowds cannot produce hundreds of badges.
    this._statusBadgeRects = [];
    this._damageLabelRects = [];
    // Numeric-only enemy occlusion rectangles are rebuilt per feedback pass.
    // They are deliberately bounded and never retain enemy references.
    this._damageEnemyRects = [];
    this._bossLabelRects = [];
    // NativeGame paints its CSS-pixel HUD after the world renderer.  Keep the
    // two safe-band edges here and derive bounded world-space rectangles per
    // frame; browser/direct callers remain unchanged when no bounds are set.
    this._hudScreenBounds = null;
    this._hudOcclusionRects = [];
    this._view = { left: 0, top: 0, right: 0, bottom: 0 };
    this._viewCenter = null;
    this.stats = { enemies: 0, projectiles: 0, effects: 0, gems: 0, culledEnemies: 0, culledProjectiles: 0, culledEffects: 0, culledGems: 0, statusCandidates: 0, statusBadges: 0, statusSuppressed: 0,
      damagePlayerCandidates: 0, damagePlayerMoved: 0, damagePlayerUnresolved: 0,
      damageEnemyCandidates: 0, damageEnemyMoved: 0, damageEnemyUnresolved: 0,
      damageBossCandidates: 0, damageBossMoved: 0, damageBossUnresolved: 0,
      damageLabelCandidates: 0, damageLabelMoved: 0, damageLabelUnresolved: 0,
      damageHudCandidates: 0, damageHudMoved: 0, damageHudUnresolved: 0 };
    this.elapsed = 0;
    this.disposed = false;
    if (options.hudScreenBounds) this.setHudScreenBounds(options.hudScreenBounds);
    this.resize(this.width, this.height, this.pixelRatio);
  }

  resize(width, height, pixelRatio = this.pixelRatio) {
    this.width = Math.max(1, n(width, this.width));
    this.height = Math.max(1, n(height, this.height));
    this.pixelRatio = Math.max(0.5, n(pixelRatio, this.pixelRatio));
    if (this.canvas) {
      try { this.canvas.width = Math.round(this.width * this.pixelRatio); } catch (_) { /* read-only in some adapters */ }
      try { this.canvas.height = Math.round(this.height * this.pixelRatio); } catch (_) { /* read-only in some adapters */ }
    }
    return this;
  }

  setQuality(quality) {
    this.quality = quality === 'low' ? 'low' : 'high';
    return this;
  }

  setHudScreenBounds(bounds = null) {
    if (!bounds || typeof bounds !== 'object') { this._hudScreenBounds = null; return this; }
    const width = Math.max(1, this.width), height = Math.max(1, this.height);
    const left = clamp(n(bounds.left, 0), 0, width), right = clamp(n(bounds.right, width), 0, width);
    const top = clamp(n(bounds.top, 0), 0, height), bottom = clamp(n(bounds.bottom, height), 0, height);
    this._hudScreenBounds = { left: Math.min(left, right), right: Math.max(left, right), top, bottom, invalid: bottom < top };
    return this;
  }

  // The world is framed inside the HUD-free band (between the top and
  // bottom UI bars) so the player is never hidden behind the UI when
  // moving to the top or bottom of the view. Falls back to the full
  // canvas when no valid HUD bounds are set. (2026-10-21 playtest change)
  _viewFrame(zoom) {
    const bounds = this._hudScreenBounds;
    const valid = bounds && !bounds.invalid && bounds.right > bounds.left && bounds.bottom > bounds.top;
    const left = valid ? bounds.left : 0, right = valid ? bounds.right : this.width;
    const top = valid ? bounds.top : 0, bottom = valid ? bounds.bottom : this.height;
    return {
      cx: (left + right) / 2, cy: (top + bottom) / 2,
      viewWorldW: (right - left) / zoom, viewWorldH: (bottom - top) / zoom,
    };
  }

  render(state, dt = 0) {
    if (this.disposed || !this.ctx) return;
    const safeState = state || {};
    this.elapsed += clamp(n(dt, 0), 0, 0.1);
    const player = safeState.player || { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2, radius: 18 };
    const mapTheme = themeFor(safeState.stage);
    const zoom = this._zoom(player);
    const frame = this._viewFrame(zoom);
    const viewWorldW = frame.viewWorldW;
    const viewWorldH = frame.viewWorldH;
    this._viewCenter = { x: frame.cx, y: frame.cy };
    // Keep the hero at the view centre even near the world rim. Clamping the
    // target to the world pinned the hero against the screen edge (and under
    // the bottom HUD) across the whole southern half of the map; the theme
    // paper fill covers the margin this reveals, like a scroll painting.
    const rim = 150;
    const targetX = viewWorldW >= WORLD_SIZE ? WORLD_SIZE / 2 : clamp(n(player.x, WORLD_SIZE / 2), viewWorldW / 2 - rim, WORLD_SIZE - viewWorldW / 2 + rim);
    const targetY = viewWorldH >= WORLD_SIZE ? WORLD_SIZE / 2 : clamp(n(player.y, WORLD_SIZE / 2), viewWorldH / 2 - rim, WORLD_SIZE - viewWorldH / 2 + rim);
    const smoothing = this.quality === 'low' || n(dt) <= 0 ? 1 : clamp(n(dt, 0) * 8, 0, 1);
    this.camera.x += (targetX - this.camera.x) * smoothing;
    this.camera.y += (targetY - this.camera.y) * smoothing;
    if (!Number.isFinite(this.camera.x)) this.camera.x = targetX;
    if (!Number.isFinite(this.camera.y)) this.camera.y = targetY;
    const shakeT = n(safeState.shakeT, 0);
    const shakeK = shakeT > 0 ? n(safeState.shakeMag, 12) * Math.min(1, shakeT / 0.55) : 0;
    this._shakeX = shakeK ? Math.sin(this.elapsed * 91) * shakeK : 0;
    this._shakeY = shakeK ? Math.cos(this.elapsed * 113) * shakeK : 0;
    this._view.left = this.camera.x + this._shakeX - viewWorldW / 2;
    this._view.top = this.camera.y + this._shakeY - viewWorldH / 2;
    this._view.right = this.camera.x + this._shakeX + viewWorldW / 2;
    this._view.bottom = this.camera.y + this._shakeY + viewWorldH / 2;
    this._updateHudOcclusionRects(zoom);
    this.stats.enemies = this.stats.projectiles = this.stats.effects = this.stats.gems = 0;
    this.stats.culledEnemies = this.stats.culledProjectiles = this.stats.culledEffects = this.stats.culledGems = 0;
    this.mapAssetDraws = 0;

    const ctx = this.ctx;
    method(ctx, 'save');
    method(ctx, 'setTransform', this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    paint(ctx, mapTheme.paper);
    method(ctx, 'fillRect', 0, 0, this.width, this.height);
    method(ctx, 'translate', frame.cx, frame.cy);
    method(ctx, 'scale', zoom, zoom);
    method(ctx, 'translate', -(this.camera.x + (this._shakeX || 0)), -(this.camera.y + (this._shakeY || 0)));
    const mapKey = safeState.battlefield?.mapAssetKey || safeState.stage?.mapAssetKey || null;
    this._drawMap(ctx, mapTheme, mapKey);

    const enemies = this._enemyDrawList;
    enemies.length = 0;
    const sourceEnemies = Array.isArray(safeState.enemies) ? safeState.enemies : EMPTY_LIST;
    const gems = Array.isArray(safeState.gems) ? safeState.gems : EMPTY_LIST;
    const effects = Array.isArray(safeState.effects) ? safeState.effects : EMPTY_LIST;
    const projectiles = Array.isArray(safeState.projectiles) ? safeState.projectiles : EMPTY_LIST;
    for (const enemy of sourceEnemies) {
      if (!enemy) continue;
      const r = clamp(n(enemy.radius, 17), 7, 72);
      // Keep crowns, overhead health/stun markers, and lifted bodies visible
      // even when the enemy's feet are outside the viewport.
      const authored = battleEnemyAnimation(enemy);
      const heightMargin = authored ? r * 3.4 + 4 : r * 2.4 + Math.abs(n(enemy.hopHeight)) * r * .4 + 8;
      if (this._inView(n(enemy.x), n(enemy.y), authored ? r * 3.4 + 4 : r * 1.35 + 4, heightMargin)) enemies.push(enemy);
      else this.stats.culledEnemies += 1;
    }
    enemies.sort(compareEnemyDepth);
    this._layoutBossLabels(enemies, player);
    this.stats.enemies = enemies.length;
    for (const gem of gems) {
      if (!gem) continue;
      const pad = clamp(n(gem.radius, 7), 3, 14) * 1.4 + 2;
      if (this._inView(n(gem.x), n(gem.y), pad)) { this._drawGem(ctx, gem); this.stats.gems += 1; }
      else this.stats.culledGems += 1;
    }
    for (const effect of effects) {
      if (!effect) continue;
      const r = clamp(n(effect.radius, 18), 2, 180);
      // The forward rake lane can enter the viewport while its origin remains
      // outside it; its full length must therefore be included in the bound.
      const pad = battleEnemyAnimation(effect) ? n(effect.bodyRadius, r) * 3.4 + 4 : effect.kind === 'hoe-line'
        ? Math.max(r * 1.4, Math.abs(n(effect.length, r)) + r * .12 + Math.abs(n(effect.width, r * .48)) / 2) + 6
        : r * 1.4 + 6;
      if (this._inView(n(effect.x), n(effect.y), pad)) { this._drawEffect(ctx, effect); this.stats.effects += 1; }
      else this.stats.culledEffects += 1;
    }
    for (const projectile of projectiles) {
      if (!projectile) continue;
      const pad = clamp(n(projectile.radius, 7), 2, 24) * 2 + 3;
      if (this._inView(n(projectile.x), n(projectile.y), pad)) { this._drawProjectile(ctx, projectile); this.stats.projectiles += 1; }
      else this.stats.culledProjectiles += 1;
    }
    let playerDrawn = false;
    for (const enemy of enemies) {
      if (!playerDrawn && n(enemy.y) >= n(player.y)) { this._drawPlayer(ctx, player, safeState.character?.id); playerDrawn = true; }
      this._drawEnemy(ctx, enemy, player, mapTheme);
    }
    if (!playerDrawn) this._drawPlayer(ctx, player, safeState.character?.id);
    // Damage labels are the only transient world text that can land on top of
    // the hero silhouette.  Keep the direct helper API unchanged for Node and
    // adapter callers, while the full render pass enables its conservative,
    // finite player-body avoidance.
    this._drawCombatFeedback(ctx, safeState, enemies, { avoidPlayer: true, avoidEnemies: true, avoidBossLabels: true, avoidDamageLabels: true, avoidHud: true });
    method(ctx, 'restore');
    if (this.showHud) this._drawHud(ctx, safeState, mapTheme);
  }

  dispose() {
    this.disposed = true;
    this.canvas = null;
    this.ctx = null;
    this._enemyDrawList.length = 0;
    this._statusBadgeRects.length = 0;
    this._damageLabelRects.length = 0;
    this._damageEnemyRects.length = 0;
    this._bossLabelRects.length = 0;
    this._hudOcclusionRects.length = 0;
    this._hudScreenBounds = null;
  }

  _drawCombatFeedback(ctx, state, enemies, options = {}) {
    const avoidPlayer = options?.avoidPlayer === true;
    const avoidEnemies = options?.avoidEnemies === true;
    const avoidBossLabels = options?.avoidBossLabels === true;
    const avoidDamageLabels = options?.avoidDamageLabels === true;
    const avoidHud = options?.avoidHud === true;
    const playerBox = avoidPlayer ? this._playerOcclusionRect(state?.player) : null;
    const enemyBoxes = avoidEnemies ? this._enemyDamageOcclusionRects(enemies) : (this._damageEnemyRects.length = 0, EMPTY_LIST);
    const bossBoxes = avoidBossLabels ? this._bossLabelRects : EMPTY_LIST;
    const hudBoxes = avoidHud ? this._hudOcclusionRects : EMPTY_LIST;
    this.stats.damagePlayerCandidates = 0;
    this.stats.damagePlayerMoved = 0;
    this.stats.damagePlayerUnresolved = 0;
    this.stats.damageEnemyCandidates = 0;
    this.stats.damageEnemyMoved = 0;
    this.stats.damageEnemyUnresolved = 0;
    this.stats.damageBossCandidates = 0;
    this.stats.damageBossMoved = 0;
    this.stats.damageBossUnresolved = 0;
    this.stats.damageLabelCandidates = 0;
    this.stats.damageLabelMoved = 0;
    this.stats.damageLabelUnresolved = 0;
    this.stats.damageHudCandidates = 0;
    this.stats.damageHudMoved = 0;
    this.stats.damageHudUnresolved = 0;
    const numbers = Array.isArray(state.damageNumbers)
      ? state.damageNumbers
      : Array.isArray(state.floatingTexts) ? state.floatingTexts
        : Array.isArray(state.combatText) ? state.combatText : EMPTY_LIST;
    const damageRects = this._damageLabelRects;
    let damageCount = 0;
    for (const item of numbers) {
      if (!item) continue;
      const x = n(item.x), y = n(item.y), ttl = n(item.ttl, 1), maxTtl = Math.max(.001, n(item.maxTtl, 1));
      const progress = clamp(1 - ttl / maxTtl, 0, 1);
      const text = item.text ?? item.value ?? item.damage;
      if (text == null) continue;
      const rotation = Math.sin((x + y) * .03) * .08;
      method(ctx, 'save');
      ctx.font = `900 ${Math.max(12, Math.min(24, n(item.size, 16)))}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const fill = item.color || (Number(item.value ?? item.damage) >= 100 ? '#ffdd3d' : '#fff0a6');
      // A compact starburst is tied to the same real damage number, so hit
      // feedback cannot outlive or outnumber the simulation's labels.
      const burst = 9 + clamp(Number(item.damage) || 0, 0, 90) * .045;
      // Reserve the number and burst for the later status-badge pass. Store
      // only bounded numeric rectangles, never label/engine references.
      const originalCenterY = y - progress * 28;
      let centerX = x, centerY = originalCenterY;
      let damageRect = null;
      // The production feedback stream is capped at 48 labels. Keep the
      // legacy overflow behavior (draw all labels, reserve only the first 48
      // rectangles) and avoid measuring unbounded legacy collections.
      if (damageCount < MAX_DAMAGE_LABEL_RECTS) {
        const size = clamp(n(item.size, 16), 12, 24), outline = (item.critical ? 3.5 : 2.8) / 2;
        const metrics = method(ctx, 'measureText', String(text));
        const halfWidth = Math.max(n(metrics?.width, String(text).length * size) / 2,
          Math.abs(n(metrics?.actualBoundingBoxLeft)), Math.abs(n(metrics?.actualBoundingBoxRight)));
        const halfHeight = Math.max(size * .6, Math.abs(n(metrics?.actualBoundingBoxAscent)), Math.abs(n(metrics?.actualBoundingBoxDescent)));
        // The star's 1.2-wide miter stroke reaches ~1.55 beyond each tip.
        const w = Math.max(halfWidth + outline, burst + 1.6), h = Math.max(halfHeight + outline, burst + 1.6);
        const cos = Math.abs(Math.cos(rotation)), sin = Math.abs(Math.sin(rotation));
        const rx = cos * w + sin * h, ry = sin * w + cos * h;
        damageRect = { left: centerX - rx, right: centerX + rx, top: centerY - ry, bottom: centerY + ry };
        const playerCollision = Boolean(playerBox && this._rectsOverlap(damageRect, playerBox, 3));
        const enemyCollision = enemyBoxes.some(box => this._rectsOverlap(damageRect, box, 3));
        const bossCollision = bossBoxes.some(box => this._rectsOverlap(damageRect, box, 3));
        const hudCollision = hudBoxes.some(box => this._rectsOverlap(damageRect, box, 3));
        // Damage labels are transient world-space text. When the caller opts
        // into finite number-to-number avoidance, only already accepted
        // rectangles participate; this preserves simulation order and bounds
        // all geometry to MAX_DAMAGE_LABEL_RECTS slots.
        let priorDamageAnchor = null;
        let labelCollision = false;
        if (avoidDamageLabels) {
          for (let i = 0; i < damageCount; i += 1) {
            const box = damageRects[i];
            if (!this._rectsOverlap(damageRect, box, 3)) continue;
            labelCollision = true;
            priorDamageAnchor = box;
            break;
          }
        }
        if (playerCollision || enemyCollision || bossCollision || hudCollision || labelCollision) {
        if (playerCollision) this.stats.damagePlayerCandidates++;
        if (enemyCollision) this.stats.damageEnemyCandidates++;
        if (bossCollision) this.stats.damageBossCandidates++;
        if (hudCollision) this.stats.damageHudCandidates++;
        if (labelCollision) this.stats.damageLabelCandidates++;
        const gap = 4;
        const hudAnchor = hudBoxes.find(box => this._rectsOverlap(damageRect, box, 3));
        const anchor = (playerCollision && playerBox)
          || enemyBoxes.find(box => this._rectsOverlap(damageRect, box, 3))
          || bossBoxes.find(box => this._rectsOverlap(damageRect, box, 3))
          || hudAnchor
          || priorDamageAnchor
          || damageRect;
        const candidates = [
          { x: centerX, y: anchor.top - ry - gap },
          { x: anchor.left - rx - gap, y: centerY },
          { x: anchor.right + rx + gap, y: centerY },
          { x: centerX, y: anchor.bottom + ry + gap },
        ];
        // A hit can overlap an actor and the HUD simultaneously. Actor-only
        // candidates may all remain underneath the HUD despite a clear safe
        // band. Try its two vertical edges first, then retain the four actor
        // candidates: a tall actor may extend beyond the HUD's inner edge.
        // The viewport check rejects outward/off-screen candidates; every
        // accepted candidate still clears ALL registered obstacles below.
        if (hudAnchor && anchor !== hudAnchor) {
          candidates.unshift(
            { x: centerX, y: hudAnchor.top - ry - gap },
            { x: centerX, y: hudAnchor.bottom + ry + gap },
          );
        }
        // Invalid HUD bounds fail closed: the finite full-screen obstacle is
        // intentionally non-evictable, so retain the original label and
        // expose it through the unresolved counter instead of moving it out
        // of the visible viewport.
        const hudFailClosed = hudCollision && this._hudScreenBounds?.invalid === true;
        for (const candidate of hudFailClosed ? EMPTY_LIST : candidates) {
          const rect = { left: candidate.x - rx, right: candidate.x + rx, top: candidate.y - ry, bottom: candidate.y + ry };
          if (playerBox && this._rectsOverlap(rect, playerBox, 3)) continue;
          if (enemyBoxes.some(box => this._rectsOverlap(rect, box, 3))) continue;
          if (bossBoxes.some(box => this._rectsOverlap(rect, box, 3))) continue;
          if (hudBoxes.some(box => this._rectsOverlap(rect, box, 3))) continue;
          if (avoidDamageLabels) {
            let overlapsPrior = false;
            for (let i = 0; i < damageCount; i += 1) {
              if (this._rectsOverlap(rect, damageRects[i], 3)) { overlapsPrior = true; break; }
            }
            if (overlapsPrior) continue;
          }
          if (!this._damageRectInView(rect)) continue;
          centerX = candidate.x; centerY = candidate.y; damageRect = rect;
          if (playerCollision) this.stats.damagePlayerMoved++;
          if (enemyCollision) this.stats.damageEnemyMoved++;
          if (bossCollision) this.stats.damageBossMoved++;
          if (hudCollision) this.stats.damageHudMoved++;
          if (labelCollision) this.stats.damageLabelMoved++;
          break;
        }
        if (centerX === x && centerY === originalCenterY) {
          if (playerCollision) this.stats.damagePlayerUnresolved++;
          if (enemyCollision) this.stats.damageEnemyUnresolved++;
          if (bossCollision) this.stats.damageBossUnresolved++;
          if (hudCollision) this.stats.damageHudUnresolved++;
          if (labelCollision) this.stats.damageLabelUnresolved++;
        }
        }
      }
      if (damageCount < MAX_DAMAGE_LABEL_RECTS) {
        const slot = damageRects[damageCount] || (damageRects[damageCount] = {});
        Object.assign(slot, damageRect);
      }
      method(ctx, 'translate', centerX, centerY); method(ctx, 'rotate', rotation);
      damageCount++;
      method(ctx, 'beginPath'); for (let i = 0; i < 8; i += 1) { const a = i * TAU / 8 + progress * .8; const rr = i % 2 ? burst * .42 : burst; const px = Math.cos(a) * rr, py = Math.sin(a) * rr; if (!i) method(ctx, 'moveTo', px, py); else method(ctx, 'lineTo', px, py); } method(ctx, 'closePath'); paint(ctx, alphaColor(item.critical ? '#ffce31' : '#62e9ff', .48 * (1 - progress * .7)), '#111429', 1.2); method(ctx, 'fill'); method(ctx, 'stroke');
      // Paint the glyph and its own outline last: the filled burst used to
      // cover the digit counters. Restore text paint after the burst stroke.
      paint(ctx, null, '#101020', item.critical ? 3.5 : 2.8); method(ctx, 'strokeText', String(text), 0, 0); paint(ctx, fill); method(ctx, 'fillText', String(text), 0, 0);
      method(ctx, 'restore');
    }
    this._drawStatusBadges(ctx, enemies, state.player, damageRects, damageCount);
  }

  _playerOcclusionRect(player) {
    if (!player) return null;
    const radius = clamp(n(player.radius, 18), 9, 52);
    const x = n(player.x), y = n(player.y);
    return { left: x - radius * 1.5, right: x + radius * 1.5,
      top: y - radius * 2.58, bottom: y + radius * 1.5 };
  }

  _updateHudOcclusionRects(zoom = 1) {
    const rects = this._hudOcclusionRects;
    rects.length = 0;
    const bounds = this._hudScreenBounds;
    if (!bounds) return rects;
    const scale = Math.max(.0001, n(zoom, 1));
    const centerX = this._viewCenter ? this._viewCenter.x : this.width / 2;
    const centerY = this._viewCenter ? this._viewCenter.y : this.height / 2;
    const toWorldX = screenX => this.camera.x + (screenX - centerX) / scale;
    const toWorldY = screenY => this.camera.y + (screenY - centerY) / scale;
    const add = (left, top, right, bottom) => {
      if (rects.length >= MAX_HUD_OCCLUSION_RECTS || right <= left || bottom <= top) return;
      const index = rects.length;
      const slot = rects[index] || {};
      Object.assign(slot, { left: toWorldX(left), right: toWorldX(right), top: toWorldY(top), bottom: toWorldY(bottom) });
      rects[index] = slot;
    };
    if (bounds.invalid) add(0, 0, this.width, this.height);
    else {
      if (bounds.top > 0) add(bounds.left, 0, bounds.right, bounds.top);
      if (bounds.bottom < this.height) add(bounds.left, bounds.bottom, bounds.right, this.height);
    }
    return rects;
  }

  _enemyDamageOcclusionRects(enemies) {
    const rects = this._damageEnemyRects;
    rects.length = 0;
    if (!Array.isArray(enemies)) return rects;
    for (const enemy of enemies) {
      if (!enemy || rects.length >= MAX_DAMAGE_ENEMY_RECTS) break;
      const radius = clamp(n(enemy.radius, 17), 7, 72);
      const x = n(enemy.x), y = n(enemy.y);
      const kind = enemy.kind === 'boss' ? 'boss' : enemy.kind === 'elite' ? 'elite' : 'normal';
      const authored = Boolean(battleEnemyAnimation(enemy));
      const halfX = authored ? radius * 2.3 : kind === 'boss' ? radius * 2 : radius * 1.5;
      const top = y - (authored ? radius * 3.5 : kind === 'boss' ? radius * 2.35 : radius * 2.1);
      const bottom = y + (authored ? radius * 1.45 : kind === 'boss' ? radius * 1.35 : radius * 1.25);
      const bodyIndex = rects.length;
      const body = rects[bodyIndex] || (rects[bodyIndex] = {});
      Object.assign(body, { left: x - halfX, right: x + halfX, top, bottom });
      rects.length = bodyIndex + 1;
      if (rects.length >= MAX_DAMAGE_ENEMY_RECTS) break;
      if (enemy.maxHp > 0 && (kind !== 'normal' || enemy.hp < enemy.maxHp)) {
        const width = radius * (kind === 'boss' ? 3.15 : 2.3);
        const height = Math.max(3, Math.max(20, width) * .08);
        const barIndex = rects.length;
        const bar = rects[barIndex] || (rects[barIndex] = {});
        const barY = this._enemyHealthBarY(enemy, radius);
        Object.assign(bar, { left: x - width / 2, right: x + width / 2, top: barY, bottom: barY + height });
        rects.length = barIndex + 1;
      }
    }
    return rects;
  }

  _rectsOverlap(a, b, gap = 0) {
    return Boolean(a && b && a.left < b.right + gap && a.right > b.left - gap
      && a.top < b.bottom + gap && a.bottom > b.top - gap);
  }

  _damageRectInView(rect) {
    const view = this._view;
    if (!(view.right > view.left && view.bottom > view.top)) return true;
    return rect.left >= view.left && rect.right <= view.right && rect.top >= view.top && rect.bottom <= view.bottom;
  }

  _enemyHealthBarY(enemy, radius) {
    // Authored tiger/bear poses stand taller than the generic vector fallback.
    // Reserve the complete pose envelope, not a crop-dependent/jittery anchor.
    return n(enemy.y) - radius * (battleEnemyAnimation(enemy)?.healthBarOffset || (enemy.kind === 'boss' ? 2.18 : 1.85));
  }

  _layoutBossLabels(enemies, player) {
    const labels = this._bossLabelRects;
    labels.length = 0;
    const view = this._view;
    const playerRadius = clamp(n(player?.radius, 18), 9, 52);
    const playerBox = player ? { left: n(player.x) - playerRadius * 1.5, right: n(player.x) + playerRadius * 1.5,
      top: n(player.y) - playerRadius * 2.2, bottom: n(player.y) + playerRadius * 1.4 } : null;
    const overlaps = (a, b) => a.left < b.right + 4 && a.right > b.left - 4 && a.top < b.bottom + 4 && a.bottom > b.top - 4;
    for (const enemy of enemies) {
      if (!enemy || enemy.kind !== 'boss') continue;
      const radius = clamp(n(enemy.radius, 17), 7, 72), x = n(enemy.x);
      const baseY = n(enemy.y) - radius * 2.75;
      const step = Math.max(24, radius * .72);
      const candidates = [0, -step, step, -step * 2, step * 2, -step * 3, step * 3];
      const slot = labels[labels.length] || (labels[labels.length] = {});
      let chosen = candidates[candidates.length - 1];
      for (const offset of candidates) {
        Object.assign(slot, { id: enemy.id, offset, left: x - 52, right: x + 52, top: baseY + offset - 11, bottom: baseY + offset + 11 });
        if (view.right > view.left && (slot.left < view.left || slot.right > view.right || slot.top < view.top || slot.bottom > view.bottom)) continue;
        if (playerBox && overlaps(slot, playerBox)) continue;
        if (labels.slice(0, labels.length - 1).some(other => overlaps(slot, other))) continue;
        chosen = offset; break;
      }
      Object.assign(slot, { id: enemy.id, offset: chosen, left: x - 52, right: x + 52, top: baseY + chosen - 11, bottom: baseY + chosen + 11 });
    }
  }

  _bossLabelOffset(enemy) {
    const id = enemy?.id;
    for (const slot of this._bossLabelRects) if (slot.id === id) return n(slot.offset, 0);
    return 0;
  }

  _drawStatusBadges(ctx, enemies, player, damageRects = EMPTY_LIST, damageCount = damageRects.length) {
    this.stats.statusCandidates = this.stats.statusBadges = this.stats.statusSuppressed = 0;
    const slots = this._statusBadgeRects, view = this._view;
    const playerRadius = clamp(n(player?.radius, 18), 9, 52);
    const playerBox = player ? { left: n(player.x) - playerRadius * 1.5, right: n(player.x) + playerRadius * 1.5,
      top: n(player.y) - playerRadius * 2.58, bottom: n(player.y) + playerRadius * 1.5 } : null;
    const overlaps = (a, b) => a.left < b.right + 3 && a.right > b.left - 3 && a.top < b.bottom + 3 && a.bottom > b.top - 3;
    // Named threats retain priority. Within a group the existing stable depth
    // order is used; rendering never changes enemy order or gameplay state.
    for (const important of [true, false]) for (const enemy of enemies) {
      if (!enemy || (enemy.kind === 'boss' || enemy.kind === 'elite') !== important) continue;
      const descriptor = enemyStatusBadge(enemy);
      if (!descriptor) continue;
      this.stats.statusCandidates++;
      // Production damage is capped at 48. A larger legacy collection still
      // draws every number, but badges fail closed instead of missing bounds.
      if (this.stats.statusBadges >= MAX_STATUS_BADGES || damageCount > MAX_DAMAGE_LABEL_RECTS) { this.stats.statusSuppressed++; continue; }
      const radius = clamp(n(enemy.radius, 17), 7, 72), x = n(enemy.x);
      const width = descriptor.glyph.length > 1 ? 24 : 16, height = 16;
      let y = this._enemyHealthBarY(enemy, radius) - 11;
      if (enemy.kind === 'boss') y = Math.min(y, n(enemy.y) - radius * 2.05 - 22);
      const slot = slots[this.stats.statusBadges] || (slots[this.stats.statusBadges] = {});
      let placed = false;
      for (const offset of [0, -19, -38]) {
        Object.assign(slot, { left: x - width / 2, right: x + width / 2, top: y + offset - height / 2, bottom: y + offset + height / 2 });
        if (view.right > view.left && (slot.left < view.left || slot.right > view.right || slot.top < view.top || slot.bottom > view.bottom)) continue;
        if (playerBox && overlaps(slot, playerBox)) continue;
        let crowded = false;
        for (let i = 0; i < this.stats.statusBadges; i++) if (overlaps(slot, slots[i])) { crowded = true; break; }
        if (!crowded) for (const label of this._bossLabelRects) if (label.id !== enemy.id && overlaps(slot, label)) { crowded = true; break; }
        if (!crowded) for (let i = 0; i < damageCount; i++) if (overlaps(slot, damageRects[i])) { crowded = true; break; }
        if (crowded) continue;
        this._drawStatusBadge(ctx, descriptor, x, y + offset, width);
        this.stats.statusBadges++; placed = true; break;
      }
      if (!placed) this.stats.statusSuppressed++;
    }
  }

  _drawStatusBadge(ctx, descriptor, x, y, width) {
    method(ctx, 'save'); method(ctx, 'translate', x, y);
    ctx.font = '900 9px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    roundedBox(ctx, -width / 2, -8, width, 16, 6, alphaColor('#201923', .82), descriptor.color, 1);
    paint(ctx, descriptor.color); method(ctx, 'fillText', descriptor.glyph, 0, 0);
    method(ctx, 'restore');
  }

  _inView(x, y, padX, padY = padX) {
    const view = this._view;
    return x + padX >= view.left && x - padX <= view.right && y + padY >= view.top && y - padY <= view.bottom;
  }

  _zoom(player) {
    // World units are intentionally generous for collision math.  This keeps
    // the survivor readable on small phones while still showing an arena ring.
    const base = Math.min(this.width, this.height);
    const radius = clamp(n(player.radius, 18), 8, 42);
    // Keep the four heroes readable at phone scale: their silhouette and
    // weapon should occupy a clear action focal point while the arena still
    // leaves room for incoming mobs.
    // 2026-10-21 playtest change: camera raised 2x — halving the zoom doubles
    // the visible world height (and width) inside a stage.
    return clamp(base / (radius * 14), 1.05, 2.2) / 2;
  }

  // The currently visible world rect (camera view from the last draw).
  // The platform feeds this to the engine so bouncing projectiles
  // ricochet at the screen edges.
  viewRect() {
    const v = this._view;
    return { x: v.left, y: v.top, w: v.right - v.left, h: v.bottom - v.top };
  }

  _drawMap(ctx, theme, mapKey = null) {
    const themeName = Object.keys(THEMES).find(key => THEMES[key] === theme) || 'forest';
    const left = this._view.left - 80;
    const top = this._view.top - 80;
    const right = this._view.right + 80;
    const bottom = this._view.bottom + 80;
    paint(ctx, theme.paper); method(ctx, 'fillRect', 0, 0, WORLD_SIZE, WORLD_SIZE);
    // Painted chapter scenes (playtest line, 2026-10-22, user-directed):
    // when the stage's authored scene painting has loaded, it IS the
    // battlefield art — one quiet full-world draw under the actors. The
    // vector plate below stays as the pre-load and no-image fallback.
    const scene = this._sceneFor(theme, mapKey);
    const sceneBack = scene?.back || scene?.background || scene;
    if (imageReady(sceneBack)) { this._drawPaintedBattleMap(ctx, theme, sceneBack, left, top, right, bottom); this._drawWorldRim(ctx, theme, left, top, right, bottom); this._drawCaveMouths(ctx, mapKey); return; }
    if (this.battleSceneMode === 'vector') {
      this._drawVectorBattleMap(ctx, theme, left, top, right, bottom, mapKey);
      this._drawWorldRim(ctx, theme, left, top, right, bottom);
      this._drawCaveMouths(ctx, mapKey);
      return;
    }
    this._drawBackLayer(ctx, theme, left, top, right, bottom, mapKey);
    // Scroll border and route lines
    path(ctx, [['M', 20, 20], ['L', WORLD_SIZE - 20, 20], ['L', WORLD_SIZE - 20, WORLD_SIZE - 20], ['L', 20, WORLD_SIZE - 20], ['Z']], null, alphaColor(theme.ink, .34), 7);
    method(ctx, 'beginPath'); method(ctx, 'moveTo', 60, WORLD_SIZE * .68); method(ctx, 'bezierCurveTo', WORLD_SIZE * .28, WORLD_SIZE * .55, WORLD_SIZE * .38, WORLD_SIZE * .8, WORLD_SIZE * .54, WORLD_SIZE * .67); method(ctx, 'bezierCurveTo', WORLD_SIZE * .7, WORLD_SIZE * .52, WORLD_SIZE * .82, WORLD_SIZE * .64, WORLD_SIZE - 60, WORLD_SIZE * .4); paint(ctx, null, alphaColor(theme.road, .56), 18); method(ctx, 'stroke');
    // Decorative brush tiles are clipped to the visible camera range for a
    // stable frame cost on low-end mini-program devices.
    const step = this.quality === 'low' ? 150 : 108;
    const minX = Math.max(step, Math.floor(left / step) * step);
    const minY = Math.max(step, Math.floor(top / step) * step);
    for (let x = minX; x < Math.min(WORLD_SIZE - step, right); x += step) {
      for (let y = minY; y < Math.min(WORLD_SIZE - step, bottom); y += step) {
        const h = hash2(x / step, y / step);
        if (h < .36) this._drawScenery(ctx, x + (h - .2) * 20, y + (hash2(y, x) - .5) * 20, theme, themeName);
        else if (h < .57) this._drawStone(ctx, x + 12, y - 8, theme);
        else if (h < .69) this._drawCloudMark(ctx, x, y, theme);
      }
    }
    this._drawMidLayer(ctx, theme, left, top, right, bottom, mapKey);
    // Compass-like ink medallion anchors the scroll without looking like a UI
    // logo.  It also remains visible as the camera travels the world.
    circle(ctx, WORLD_SIZE * .5, WORLD_SIZE * .5, 190, null, alphaColor(theme.ink, .08), 3);
    circle(ctx, WORLD_SIZE * .5, WORLD_SIZE * .5, 144, null, alphaColor(theme.ink, .06), 2);
    for (let i = 0; i < 8; i += 1) {
      const a = i * TAU / 8 + .15;
      method(ctx, 'beginPath'); method(ctx, 'moveTo', WORLD_SIZE * .5 + Math.cos(a) * 165, WORLD_SIZE * .5 + Math.sin(a) * 165); method(ctx, 'lineTo', WORLD_SIZE * .5 + Math.cos(a) * 285, WORLD_SIZE * .5 + Math.sin(a) * 285);
      paint(ctx, null, alphaColor(i % 2 ? theme.accent : theme.sticker, .16), 7); method(ctx, 'stroke');
    }
    path(ctx, [['M', WORLD_SIZE * .5, WORLD_SIZE * .5 - 120], ['L', WORLD_SIZE * .5 + 22, WORLD_SIZE * .5], ['L', WORLD_SIZE * .5, WORLD_SIZE * .5 + 120], ['L', WORLD_SIZE * .5 - 22, WORLD_SIZE * .5], ['Z']], null, alphaColor(theme.ink, .12), 2);
    // Camera-edge speed slashes continue the card artwork's strong diagonal
    // energy while leaving the central combat lane readable.
    const cx = this.camera.x, cy = this.camera.y;
    for (let i = 0; i < 9; i += 1) {
      const a = i * TAU / 9 + .17, len = 82 + (i % 3) * 34;
      method(ctx, 'beginPath'); method(ctx, 'moveTo', cx + Math.cos(a) * (len + 46), cy + Math.sin(a) * (len + 46));
      method(ctx, 'lineTo', cx + Math.cos(a) * (len + 142), cy + Math.sin(a) * (len + 142));
      paint(ctx, null, alphaColor(i % 2 ? theme.motif : theme.sticker, .46), 5 + (i % 2) * 2); method(ctx, 'stroke');
    }
    this._drawFrontLayer(ctx, theme, left, top, right, bottom, mapKey);
    this._drawCaveMouths(ctx, mapKey);
  }

  // Cave mouths (playtest line, 2026-10-23): scenes with painted
  // mountains have dark openings at the rock feet — small monsters spawn
  // from them (engine cave spawns), so the decal and the spawn point are
  // the same place. A soft elliptical shadow pool with a near-black core
  // reads as part of the cliff base rather than a pasted sticker.
  _drawCaveMouths(ctx, mapKey) {
    const mouths = CAVE_MOUTHS[mapKey];
    if (!mouths) return;
    for (const [mx, my] of mouths) {
      if (mx < this._view.left - 90 || mx > this._view.right + 90 || my < this._view.top - 90 || my > this._view.bottom + 90) continue;
      method(ctx, 'save'); method(ctx, 'translate', mx, my); method(ctx, 'scale', 1, .58);
      circle(ctx, 0, 0, 34, 'rgba(24,16,10,0.55)', null, 0);
      circle(ctx, 0, 0, 25, 'rgba(10,7,4,0.88)', null, 0);
      circle(ctx, 0, 0, 15, 'rgba(2,2,2,0.95)', null, 0);
      method(ctx, 'restore');
    }
  }

  _drawPaintedBattleMap(ctx, theme, back, left, top, right, bottom) {
    // One quiet cover draw of the authored scene over the whole world — no
    // mid/front sticker layers compete with the actors. A portrait scene
    // (the doublefork valley) is geometry-authored: it is drawn stretched
    // to the full world so its painted ridge and central pass land on the
    // engine's collision ridge (y 700-1100) and corridor (x 790-1010).
    // Square/landscape scenes cover-crop, as the original back layer did.
    const iw = n(back.naturalWidth || back.width, 0), ih = n(back.naturalHeight || back.height, 0);
    const drawn = (iw > 0 && ih > iw)
      ? drawImageIfReady(ctx, back, 0, 0, iw, ih, 0, 0, WORLD_SIZE, WORLD_SIZE)
      : drawImageCover(ctx, back, 0, 0, WORLD_SIZE, WORLD_SIZE);
    if (drawn) this.mapAssetDraws += 1;
    // Continue the painting past the world rim: when the centred camera
    // looks beyond the map edge, mirror a strip of the painting across the
    // rim so the terrain reads as continuing, over a deep shade underlay —
    // never a flat band or a smeared stretch.
    if (drawn && iw > 0 && ih > iw) {
      const sx = iw / WORLD_SIZE, sy = ih / WORLD_SIZE;
      const ovB = bottom - WORLD_SIZE, ovT = -top, ovL = -left, ovR = right - WORLD_SIZE;
      const fx = Math.min(0, left), fw = right - fx;
      paint(ctx, alphaColor(theme.deep, .85));
      if (ovB > 0) method(ctx, 'fillRect', fx, WORLD_SIZE, fw, ovB);
      if (ovT > 0) method(ctx, 'fillRect', fx, top, fw, ovT);
      if (ovL > 0) method(ctx, 'fillRect', left, 0, ovL, WORLD_SIZE);
      if (ovR > 0) method(ctx, 'fillRect', WORLD_SIZE, 0, ovR, WORLD_SIZE);
      const D = 90;
      if (ovB > 0) { const d = Math.min(D, ovB); method(ctx, 'save'); method(ctx, 'translate', 0, 2 * WORLD_SIZE); method(ctx, 'scale', 1, -1); drawImageIfReady(ctx, back, 0, ih - d * sy, iw, d * sy, 0, WORLD_SIZE - d, WORLD_SIZE, d); method(ctx, 'restore'); }
      if (ovT > 0) { const d = Math.min(D, ovT); method(ctx, 'save'); method(ctx, 'scale', 1, -1); drawImageIfReady(ctx, back, 0, 0, iw, d * sy, 0, 0, WORLD_SIZE, d); method(ctx, 'restore'); }
      if (ovL > 0) { const d = Math.min(D, ovL); method(ctx, 'save'); method(ctx, 'scale', -1, 1); drawImageIfReady(ctx, back, 0, 0, d * sx, ih, 0, 0, d, WORLD_SIZE); method(ctx, 'restore'); }
      if (ovR > 0) { const d = Math.min(D, ovR); method(ctx, 'save'); method(ctx, 'translate', 2 * WORLD_SIZE, 0); method(ctx, 'scale', -1, 1); drawImageIfReady(ctx, back, iw - d * sx, 0, d * sx, ih, WORLD_SIZE - d, 0, d, WORLD_SIZE); method(ctx, 'restore'); }
    }
    // A light wash keeps the HUD's warm ink palette coherent and the actors
    // the highest-contrast objects on the field.
    paint(ctx, alphaColor(theme.sky, .06));
    method(ctx, 'fillRect', left, top, right - left, bottom - top);
    if (left < 90 || top < 90 || right > WORLD_SIZE - 90 || bottom > WORLD_SIZE - 90) {
      path(ctx, [['M', 26, 26], ['L', WORLD_SIZE - 26, 26], ['L', WORLD_SIZE - 26, WORLD_SIZE - 26], ['L', 26, WORLD_SIZE - 26], ['Z']], null, alphaColor(theme.deep, .40), 12);
      path(ctx, [['M', 52, 52], ['L', WORLD_SIZE - 52, 52], ['L', WORLD_SIZE - 52, WORLD_SIZE - 52], ['L', 52, WORLD_SIZE - 52], ['Z']], null, alphaColor(theme.ink, .20), 3);
    }
  }

  _drawWorldRim(ctx, theme, left, top, right, bottom) {
    if (left >= 0 && top >= 0 && right <= WORLD_SIZE && bottom <= WORLD_SIZE) return;
    path(ctx, [['M', 0, 0], ['L', WORLD_SIZE, 0], ['L', WORLD_SIZE, WORLD_SIZE], ['L', 0, WORLD_SIZE], ['Z']], null, alphaColor(theme.deep, .5), 9);
  }

  _drawVectorBattleMap(ctx, theme, left, top, right, bottom, mapKey = null) {
    // Calm, readable battlefield plates for the playable scene.  They use
    // the same warm ink/flat-colour language as the Kingdom-Rush-inspired
    // direction, but keep the high-detail gallery paintings out of combat.
    const visibleLeft = Math.max(0, left), visibleTop = Math.max(0, top);
    const visibleRight = Math.min(WORLD_SIZE, right), visibleBottom = Math.min(WORLD_SIZE, bottom);
    paint(ctx, alphaColor(theme.sky, .38));
    method(ctx, 'fillRect', visibleLeft, visibleTop, visibleRight - visibleLeft, visibleBottom - visibleTop);
    // Two quiet clearings frame the first chapter's central ridge.
    if (mapKey === 'doublefork') {
      paint(ctx, alphaColor(theme.paperDark, .18));
      method(ctx, 'fillRect', 0, 90, WORLD_SIZE, 570);
      paint(ctx, alphaColor(theme.paper, .22));
      method(ctx, 'fillRect', 0, 1140, WORLD_SIZE, WORLD_SIZE - 1140);
      // Back ridge silhouette; the stepped contour is deliberately broad so
      // actors remain the highest-contrast objects in the viewport.
      path(ctx, [
        ['M', 0, 760], ['L', 160, 704], ['L', 332, 752], ['L', 520, 676],
        ['L', 704, 742], ['L', 790, 704], ['L', 1010, 704], ['L', 1128, 746],
        ['L', 1310, 682], ['L', 1504, 742], ['L', WORLD_SIZE, 700],
        ['L', WORLD_SIZE, 1115], ['L', 0, 1115], ['Z']
      ], alphaColor(theme.deep, .28), alphaColor(theme.ink, .20), 5);
      // Central pass is the gameplay route through the ridge.
      path(ctx, [['M', 0, 1540], ['C', 420, 1410, 660, 1270, 790, 1100], ['L', 790, 700], ['C', 835, 660, 965, 660, 1010, 700], ['L', 1010, 1100], ['C', 1140, 1270, 1400, 1410, WORLD_SIZE, 1540]], null, alphaColor(theme.ink, .18), 58);
      path(ctx, [['M', 0, 1540], ['C', 420, 1410, 660, 1270, 790, 1100], ['L', 790, 700], ['C', 835, 660, 965, 660, 1010, 700], ['L', 1010, 1100], ['C', 1140, 1270, 1400, 1410, WORLD_SIZE, 1540]], null, alphaColor(theme.road, .58), 38);
      // Cliff faces sit on the sides of the pass; no random diagonal stickers
      // or camera-edge slashes compete with the actors.
      path(ctx, [['M', 0, 1115], ['L', 0, 870], ['L', 250, 910], ['L', 430, 1098], ['L', 640, 1115], ['Z']], alphaColor(theme.deep, .22), alphaColor(theme.ink, .20), 3);
      path(ctx, [['M', WORLD_SIZE, 1115], ['L', WORLD_SIZE, 860], ['L', 1540, 910], ['L', 1360, 1098], ['L', 1160, 1115], ['Z']], alphaColor(theme.deep, .22), alphaColor(theme.ink, .20), 3);
      // A few fixed silhouettes establish depth without a tiled collage.
      method(ctx, 'save'); ctx.globalAlpha = .34;
      [[120,420],[360,520],[1450,420],[1680,520],[170,1370],[1640,1370]].forEach(([x,y]) => this._drawTree(ctx, x, y, theme));
      method(ctx, 'restore');
      // Ink markers at the pass entrance communicate the intended direction.
      circle(ctx, 900, 665, 13, alphaColor(theme.sticker, .84), alphaColor(theme.ink, .70), 3);
      circle(ctx, 900, 1135, 13, alphaColor(theme.sticker, .84), alphaColor(theme.ink, .70), 3);
      return;
    }
    // Other chapters: a quiet themed plate, completed on the playtest line
    // (2026-10-22). The five authored landmarks stay; around them a
    // deterministic, view-culled scatter of themed scenery fills the whole
    // world so no region reads as empty plate, and a double ink border
    // marks the world edge as a deliberate scroll boundary. All vector:
    // mapAssetDraws stays 0 and no image decoding is involved.
    const themeKey = Object.keys(THEMES).find(key => THEMES[key] === theme) || 'forest';
    // Road first (under the scatter): a gentle S across the world.
    path(ctx, [['M', 80, WORLD_SIZE * .76], ['C', WORLD_SIZE * .35, WORLD_SIZE * .56, WORLD_SIZE * .62, WORLD_SIZE * .86, WORLD_SIZE - 80, WORLD_SIZE * .36]], null, alphaColor(theme.ink, .15), 44);
    path(ctx, [['M', 80, WORLD_SIZE * .76], ['C', WORLD_SIZE * .35, WORLD_SIZE * .56, WORLD_SIZE * .62, WORLD_SIZE * .86, WORLD_SIZE - 80, WORLD_SIZE * .36]], null, alphaColor(theme.road, .50), 36);
    // Sampled road points keep scatter off the route so it stays readable.
    const roadPts = [[80, WORLD_SIZE * .76], [520, WORLD_SIZE * .62], [900, WORLD_SIZE * .68], [1280, WORLD_SIZE * .58], [WORLD_SIZE - 80, WORLD_SIZE * .36]];
    method(ctx, 'save'); ctx.globalAlpha = .26;
    const step = 216;
    const minX = Math.max(step, Math.floor(left / step) * step);
    const minY = Math.max(step, Math.floor(top / step) * step);
    for (let x = minX; x < Math.min(WORLD_SIZE - step / 2, right); x += step) {
      for (let y = minY; y < Math.min(WORLD_SIZE - step / 2, bottom); y += step) {
        const h = hash2(x / step, y / step);
        const px = x + (h - .5) * 90, py = y + (hash2(y, x) - .5) * 90;
        if (roadPts.some(([rx, ry]) => (px - rx) * (px - rx) + (py - ry) * (py - ry) < 150 * 150)) continue;
        if (h < .30) this._drawScenery(ctx, px, py, theme, themeKey);
        else if (h < .42) this._drawStone(ctx, px + 12, py - 8, theme);
        else if (h < .50) this._drawCloudMark(ctx, px, py, theme);
      }
    }
    method(ctx, 'restore');
    method(ctx, 'save'); ctx.globalAlpha = .30;
    const landmarks = [[180,220],[510,420],[1450,280],[1650,1380],[260,1460]];
    landmarks.forEach(([x,y]) => this._drawScenery(ctx, x, y, theme, themeKey));
    method(ctx, 'restore');
    // World boundary: nested ink borders, drawn only where the view reaches.
    if (left < 90 || top < 90 || right > WORLD_SIZE - 90 || bottom > WORLD_SIZE - 90) {
      path(ctx, [['M', 26, 26], ['L', WORLD_SIZE - 26, 26], ['L', WORLD_SIZE - 26, WORLD_SIZE - 26], ['L', 26, WORLD_SIZE - 26], ['Z']], null, alphaColor(theme.deep, .40), 12);
      path(ctx, [['M', 52, 52], ['L', WORLD_SIZE - 52, 52], ['L', WORLD_SIZE - 52, WORLD_SIZE - 52], ['L', 52, WORLD_SIZE - 52], ['Z']], null, alphaColor(theme.ink, .20), 3);
    }
  }

  _sceneFor(theme, mapKey = null) {
    const themeName = Object.keys(THEMES).find(key => THEMES[key] === theme) || 'forest';
    return this.mapImages?.[mapKey] || this.mapImages?.[themeName] || this.mapImages?.default || null;
  }

  _drawBackLayer(ctx, theme, left, top, right, bottom, mapKey = null) {
    // Large, quiet silhouettes sit behind the route. Their offset is derived
    // from the camera tile so the scroll feels layered without parallax state.
    const themeName = Object.keys(THEMES).find(key => THEMES[key] === theme) || 'forest';
    const scene = this._sceneFor(theme, mapKey);
    const back = scene?.back || scene?.background || scene;
    if (drawImageCover(ctx, back, 0, 0, WORLD_SIZE, WORLD_SIZE)) {
      this.mapAssetDraws += 1;
      // A light paper wash keeps the HUD's warm ink palette coherent while
      // preserving the hand-painted map's focal values.
      paint(ctx, alphaColor(theme.sky, .08));
      method(ctx, 'fillRect', left, top, right - left, bottom - top);
    } else {
      paint(ctx, alphaColor(theme.sky, .52));
      method(ctx, 'fillRect', left, top, right - left, bottom - top);
    }
    const span = 280;
    const startX = Math.floor(left / span) * span - span;
    const startY = Math.floor(top / span) * span - span;
    for (let x = startX; x < right + span; x += span) {
      for (let y = startY; y < bottom + span; y += span) {
        const h = hash2(x * .006, y * .006);
        if (h < .48) {
          circle(ctx, x + span * .2, y + span * .22, 36 + h * 24, alphaColor(theme.deep, .2));
          circle(ctx, x + span * .38, y + span * .15, 54 + h * 20, alphaColor(theme.deep, .16));
        } else {
          path(ctx, [['M', x - 65, y + 32], ['Q', x + 8, y - 58, x + 88, y + 28], ['L', x + 88, y + 70], ['L', x - 65, y + 70], ['Z']], alphaColor(theme.deep, .08));
        }
      }
    }
  }

  _drawMidLayer(ctx, theme, left, top, right, bottom, mapKey = null) {
    // Ink ribbons and color blocks give each chapter a readable midground.
    const scene = this._sceneFor(theme, mapKey);
    const mid = scene?.mid;
    if (imageReady(mid)) {
      method(ctx, 'save');
      ctx.globalAlpha = .12;
      if (drawImageCover(ctx, mid, left, top, right - left, bottom - top)) this.mapAssetDraws += 1;
      method(ctx, 'restore');
    }
    const span = 196;
    const startX = Math.floor(left / span) * span - span;
    const startY = Math.floor(top / span) * span - span;
    for (let x = startX; x < right + span; x += span) {
      for (let y = startY; y < bottom + span; y += span) {
        const h = hash2(x * .021, y * .017);
        if (h < .24) {
          // Brush blocks use chipped outer edges, slashes and black ink dots.
          path(ctx, [['M', x - 49, y + 17], ['L', x - 25, y - 12], ['L', x - 29, y - 22], ['L', x + 20, y - 34], ['L', x + 17, y - 19], ['L', x + 76, y - 9], ['L', x + 53, y + 18], ['L', x + 61, y + 24], ['L', x + 4, y + 62], ['L', x + 14, y + 37], ['Z']], alphaColor(theme.accent, .54), alphaColor(theme.ink, .82), 2.2);
          method(ctx, 'beginPath'); method(ctx, 'moveTo', x - 45, y + 38); method(ctx, 'lineTo', x + 72, y - 20); paint(ctx, null, alphaColor(theme.ink, .77), 5); method(ctx, 'stroke');
          circle(ctx, x + 83, y + 1, 3, alphaColor(theme.ink, .8)); circle(ctx, x - 38, y - 31, 2, alphaColor(theme.ink, .8));
        } else if (h > .86) {
          // A small sticker-like seal, deliberately asymmetric like hand ink.
          method(ctx, 'beginPath');
          for (let i = 0; i < 8; i += 1) {
            const a = i * TAU / 8;
            const rr = i % 2 ? 11 : 20;
            const px = x + 34 + Math.cos(a) * rr, py = y - 18 + Math.sin(a) * rr;
            if (i === 0) method(ctx, 'moveTo', px, py); else method(ctx, 'lineTo', px, py);
          }
          method(ctx, 'closePath'); paint(ctx, alphaColor(theme.sticker, .9), alphaColor(theme.ink, .92), 2.3); method(ctx, 'fill'); method(ctx, 'stroke');
          if (this.showHud) { method(ctx, 'save'); ctx.font='900 12px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; paint(ctx, theme.ink); method(ctx, 'fillText', '行', x + 34, y - 17); method(ctx, 'restore'); }
        } else if (h > .59 && h < .68) {
          // Short rough black brush tails, never a uniform tiled texture.
          for (let j = 0; j < 3; j += 1) { method(ctx, 'beginPath'); method(ctx, 'moveTo', x - 31 + j * 3, y + 21 + j * 8); method(ctx, 'lineTo', x + 30 - j * 11, y - 11 + j * 10); paint(ctx, null, alphaColor(theme.ink, .68 - j * .1), 4 - j); method(ctx, 'stroke'); }
        }
      }
    }
  }

  _drawFrontLayer(ctx, theme, left, top, right, bottom, mapKey = null) {
    // Foreground brush marks are clipped by the camera bounds by construction.
    const scene = this._sceneFor(theme, mapKey);
    const front = scene?.front;
    // The authored scene preview is used as a low-opacity foreground wash so
    // its hand-drawn roof/foliage silhouettes stay readable without covering
    // combatants. It is drawn after the midground, before actors are sorted.
    if (imageReady(front)) {
      method(ctx, 'save');
      ctx.globalAlpha = .2;
      if (drawImageCover(ctx, front, left, bottom - Math.min(300, bottom - top), right - left, Math.min(300, bottom - top))) this.mapAssetDraws += 1;
      method(ctx, 'restore');
    }
    const span = 142;
    const startX = Math.floor(left / span) * span;
    const startY = Math.floor(top / span) * span;
    for (let x = startX; x < right + span; x += span) {
      const h = hash2(x * .031, 4.2);
      if (h < .34) {
        const y = bottom - 18 - h * 20;
        method(ctx, 'beginPath');
        method(ctx, 'moveTo', x, y + 30); method(ctx, 'lineTo', x + 10, y - 8); method(ctx, 'lineTo', x + 18, y + 25);
        method(ctx, 'moveTo', x + 9, y + 30); method(ctx, 'lineTo', x + 32, y + 3); method(ctx, 'lineTo', x + 40, y + 28);
        paint(ctx, null, alphaColor(theme.deep, .65), 4); method(ctx, 'stroke');
      }
    }
    for (let y = startY; y < bottom + span; y += span) {
      const h = hash2(9.8, y * .029);
      if (h > .72) {
        method(ctx, 'beginPath'); method(ctx, 'moveTo', left - 10, y + 14); method(ctx, 'lineTo', left + 48, y - 18); method(ctx, 'lineTo', left + 82, y + 10);
        paint(ctx, null, alphaColor(theme.accent, .6), 3); method(ctx, 'stroke');
      }
    }
  }

  _drawScenery(ctx, x, y, theme, themeName) {
    if (themeName === 'forest') { this._drawTree(ctx, x, y, theme); return; }
    if (themeName === 'snow') {
      paint(ctx, alphaColor(theme.ink, .25)); method(ctx, 'fillRect', x - 3, y + 6, 6, 26);
      path(ctx, [['M', x, y - 28], ['L', x - 19, y + 16], ['L', x + 19, y + 16], ['Z']], alphaColor(theme.leaf, .66), alphaColor(theme.ink, .3), 2);
      path(ctx, [['M', x, y - 28], ['L', x - 11, y - 2], ['L', x - 3, y - 4], ['L', x + 5, y + 1], ['L', x + 11, y - 2], ['Z']], '#eaf2df', null);
      return;
    }
    if (themeName === 'sand') {
      path(ctx, [['M', x - 28, y + 16], ['Q', x - 6, y - 1, x + 28, y + 16]], null, alphaColor(theme.motif, .4), 2);
      method(ctx, 'beginPath'); method(ctx, 'moveTo', x, y + 18); method(ctx, 'lineTo', x, y - 23); method(ctx, 'moveTo', x, y - 2); method(ctx, 'lineTo', x - 14, y - 2); method(ctx, 'lineTo', x - 14, y - 14); method(ctx, 'moveTo', x, y + 4); method(ctx, 'lineTo', x + 13, y + 4); method(ctx, 'lineTo', x + 13, y - 11); paint(ctx, null, alphaColor(theme.leaf, .76), 7); ctx.lineCap = 'round'; method(ctx, 'stroke'); ctx.lineCap = 'butt';
      return;
    }
    if (themeName === 'fire') {
      path(ctx, [['M', x - 28, y + 18], ['L', x - 12, y - 5], ['L', x - 7, y + 2], ['L', x + 3, y - 23], ['L', x + 22, y + 18], ['Z']], alphaColor(theme.ink, .32), alphaColor(theme.ink, .33), 2);
      path(ctx, [['M', x + 3, y - 20], ['L', x - 2, y - 3], ['L', x + 6, y + 1], ['L', x + 11, y + 17]], null, alphaColor('#f0984f', .55), 3);
      return;
    }
    if (themeName === 'water') {
      for (let i = 0; i < 3; i += 1) path(ctx, [['M', x - 26 + i * 4, y + i * 8], ['Q', x - 10, y - 8 + i * 8, x + 4, y + i * 8], ['Q', x + 14, y + 8 + i * 8, x + 25 - i * 4, y + i * 8]], null, alphaColor(theme.motif, .38), 2);
      method(ctx, 'beginPath'); method(ctx, 'moveTo', x - 15, y - 8); method(ctx, 'lineTo', x - 16, y - 27); method(ctx, 'moveTo', x - 10, y - 5); method(ctx, 'lineTo', x - 8, y - 24); paint(ctx, null, alphaColor(theme.leaf, .66), 3); method(ctx, 'stroke');
      return;
    }
    // small roadside pagodas on the temple scroll
    roundedBox(ctx, x - 14, y - 1, 28, 31, 2, alphaColor(theme.paperDark, .64), alphaColor(theme.ink, .33), 2);
    path(ctx, [['M', x - 25, y - 2], ['Q', x - 13, y - 3, x, y - 20], ['Q', x + 13, y - 3, x + 25, y - 2], ['L', x - 25, y - 2], ['Z']], alphaColor(theme.motif, .5), alphaColor(theme.ink, .28), 2);
    roundedBox(ctx, x - 4, y + 9, 8, 17, 2, alphaColor(theme.ink, .22), null);
  }

  _drawTree(ctx, x, y, theme) {
    paint(ctx, alphaColor(theme.ink, .23)); method(ctx, 'fillRect', x - 4, y + 8, 8, 22);
    circle(ctx, x - 11, y, 15, alphaColor(theme.leaf, .58), alphaColor(theme.ink, .2), 1.5);
    circle(ctx, x + 7, y - 4, 17, alphaColor(theme.leaf, .64), alphaColor(theme.ink, .2), 1.5);
    circle(ctx, x, y - 17, 16, alphaColor(theme.leaf, .72), alphaColor(theme.ink, .2), 1.5);
  }

  _drawStone(ctx, x, y, theme) {
    path(ctx, [['M', x - 18, y + 8], ['L', x - 10, y - 9], ['L', x + 8, y - 14], ['L', x + 18, y + 7], ['L', x + 8, y + 14], ['Z']], alphaColor(theme.paperDark, .7), alphaColor(theme.ink, .25), 2);
    method(ctx, 'beginPath'); method(ctx, 'moveTo', x - 7, y - 6); method(ctx, 'lineTo', x + 7, y - 2); paint(ctx, null, alphaColor(theme.ink, .18), 1.4); method(ctx, 'stroke');
  }

  _drawCloudMark(ctx, x, y, theme) {
    method(ctx, 'beginPath'); method(ctx, 'moveTo', x - 24, y); method(ctx, 'quadraticCurveTo', x - 10, y - 10, x, y); method(ctx, 'quadraticCurveTo', x + 10, y - 11, x + 24, y); method(ctx, 'quadraticCurveTo', x + 10, y + 8, x, y); method(ctx, 'quadraticCurveTo', x - 10, y + 8, x - 24, y); paint(ctx, null, alphaColor(theme.motif, .28), 2); method(ctx, 'stroke');
  }

  _drawGem(ctx, gem) {
    const x = n(gem.x), y = n(gem.y), r = clamp(n(gem.radius, 7), 3, 14);
    const color = gem.kind === 'heal' ? '#d56b61' : gem.kind === 'magnet' ? '#7d89d9' : gem.kind === 'coin' ? '#e8b84e' : '#79c9a7';
    const pulse = 1 + Math.sin(this.elapsed * 4 + x * .013 + y * .009) * .08;
    circle(ctx, x, y + r * .3, r * .75, alphaColor('#3e423b', .22));
    path(ctx, [['M', x, y - r * pulse], ['L', x + r * .74, y], ['L', x, y + r * 1.18], ['L', x - r * .74, y], ['Z']], color, '#4b4639', 1.3);
    path(ctx, [['M', x, y - r * pulse], ['L', x, y + r * 1.18], ['L', x + r * .74, y], ['Z']], alphaColor('#fff8d8', .35));
  }

  _drawProjectile(ctx, projectile) {
    const x = n(projectile.x), y = n(projectile.y), radius = clamp(n(projectile.radius, 7), 2, 24);
    const projectileKind = String(projectile.kind || '').toLowerCase();
    const color = projectile.color || (projectileKind === 'holy' || projectileKind.includes('light') ? '#35d7ff' : projectileKind.includes('bird') ? '#ff6338' : projectileKind.includes('fire') ? '#ffb52e' : '#f3d34a');
    const angle = Math.atan2(n(projectile.vy), n(projectile.vx));
    method(ctx, 'save'); method(ctx, 'translate', x, y); method(ctx, 'rotate', Number.isFinite(angle) ? angle : 0);
    if (projectileKind === 'light-orb') {
      // Authored orb strip: a pulsing painted orb replaces the vector orb
      // once loaded; the pulse loops on renderer time while it flies.
      const fxImage = this.skillFxImages?.['light-orb'];
      const fxRect = fxImage && skillFxFrameRect(fxImage, (this.elapsed * 1.6) % 1);
      if (fxRect) {
        const size = radius * 4.2;
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h, -size / 2, -size / 2, size, size);
        method(ctx, 'restore');
        return;
      }
    }
    if (projectileKind === 'fire-wheel' || projectileKind === 'ring' || projectileKind === 'ring-child') {
      // Painted artifact projectiles (batch 2): the wind-fire wheel and the
      // Qiankun ring spin on renderer time while they fly/bounce.
      const fxId = projectileKind === 'fire-wheel' ? 'fire-wheel' : 'ring-spin';
      const fxImage = this.skillFxImages?.[fxId];
      const fxRect = fxImage && skillFxFrameRect(fxImage, (this.elapsed * (fxId === 'fire-wheel' ? 2.4 : 2)) % 1);
      if (fxRect) {
        const size = radius * (fxId === 'fire-wheel' ? 3.6 : 3);
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h, -size / 2, -size / 2, size, size);
        method(ctx, 'restore');
        return;
      }
    }
    circle(ctx, 0, 0, radius * 1.4, alphaColor(color, .18));
    if (projectileKind.includes('bird')) {
      path(ctx, [['M', -radius * 1.5, 0], ['Q', -radius * .2, -radius * 1.2, radius * 1.7, 0], ['Q', -radius * .2, radius * 1.2, -radius * 1.5, 0], ['Z']], color, '#703a2a', 1.2);
      circle(ctx, radius * .8, -radius * .16, radius * .12, '#fff4bd');
    } else if (projectileKind.includes('needle')) {
      path(ctx, [['M', -radius * 2.4, 0], ['L', radius * 1.7, -radius * .45], ['L', radius * 2.4, 0], ['L', radius * 1.7, radius * .45], ['Z']], color, '#2f2930', 1.3);
      method(ctx, 'beginPath'); method(ctx, 'moveTo', -radius * 2.1, 0); method(ctx, 'lineTo', radius * 1.9, 0); paint(ctx, null, '#fff6b8', 1.2); method(ctx, 'stroke');
    } else if (projectileKind.includes('fan')) {
      path(ctx, [['M', -radius * .8, radius * .2], ['Q', 0, -radius * 2, radius * 1.7, -radius * .3], ['L', radius * 1.1, radius * .55], ['Z']], color, '#273b3c', 1.5);
      for (let i = 0; i < 3; i += 1) { method(ctx, 'beginPath'); method(ctx, 'moveTo', radius * (.1 + i * .3), -radius * .3); method(ctx, 'lineTo', radius * (1.3 + i * .15), radius * (.4 + i * .08)); paint(ctx, null, '#fff0a6', 1); method(ctx, 'stroke'); }
    } else if (projectileKind.includes('diamond') || projectileKind.includes('mirror')) {
      path(ctx, [['M', 0, -radius * 1.25], ['L', radius * .8, 0], ['L', 0, radius * 1.25], ['L', -radius * .8, 0], ['Z']], color, '#263650', 1.5);
      path(ctx, [['M', 0, -radius * .8], ['L', radius * .35, 0], ['L', 0, radius * .7], ['Z']], '#fff4a8', null);
    } else if (projectileKind === 'fire-wheel' || projectileKind.includes('fire-wheel')) {
      circle(ctx, 0, 0, radius * 1.15, '#e84c32', '#3c2029', 1.6);
      circle(ctx, 0, 0, radius * .62, null, '#ffd34c', Math.max(2, radius * .18));
      for (let i = 0; i < 6; i += 1) { const a = i * TAU / 6; method(ctx, 'beginPath'); method(ctx, 'moveTo', Math.cos(a) * radius * .2, Math.sin(a) * radius * .2); method(ctx, 'lineTo', Math.cos(a) * radius * 1.18, Math.sin(a) * radius * 1.18); paint(ctx, null, '#ffec8c', 1.3); method(ctx, 'stroke'); }
    } else if (projectileKind === 'ring' || projectileKind.includes('ring-child')) {
      circle(ctx, 0, 0, radius, null, color, Math.max(2, radius * .36));
      circle(ctx, 0, 0, radius * .66, null, '#fff4c5', Math.max(1, radius * .1));
    } else if (projectileKind === 'light-orb' || projectileKind.includes('holy')) {
      // A real traveling light orb carries a tapered comic trail. Its length
      // is visual only; collision remains the engine's original radius.
      path(ctx, [['M', -radius * 4.6, -radius * .15], ['L', -radius * .6, -radius * .9], ['L', radius * .35, 0], ['L', -radius * .6, radius * .9], ['Z']], alphaColor('#3de2ff', .52), '#0f2d55', 1.4);
      path(ctx, [['M', -radius * 3.8, 0], ['L', -radius * .25, -radius * .38], ['L', radius * .4, 0], ['L', -radius * .25, radius * .38], ['Z']], '#d9ffff', null);
      circle(ctx, 0, 0, radius * 1.32, '#47e9ff', '#12355f', 2); circle(ctx, 0, 0, radius * .85, '#f5ffff', '#81eeff', 2);
      for (let i=0;i<3;i+=1) { method(ctx, 'beginPath');method(ctx,'moveTo',-radius*(2.4+i*.5),radius*(1.2+i*.45));method(ctx,'lineTo',-radius*(.9+i*.4),radius*(1.15+i*.35));paint(ctx,null,'#9effff',1.4);method(ctx,'stroke'); }
    } else if (projectileKind === 'rake' || projectileKind === 'slash') {
      path(ctx, [['M', -radius * 1.4, -radius * .5], ['L', radius * 1.8, 0], ['L', -radius * 1.4, radius * .5], ['Z']], color, '#4d4136', 1.2);
    } else {
      circle(ctx, 0, 0, radius, color, '#514033', 1.4);
      circle(ctx, -radius * .25, -radius * .28, radius * .28, alphaColor('#ffffff', .52));
    }
    method(ctx, 'restore');
  }

  _drawEffect(ctx, effect) {
    const x = n(effect.x), y = n(effect.y), radius = clamp(n(effect.radius, 18), 2, 180);
    const ttl = n(effect.ttl, 0), maxTtl = Math.max(.001, n(effect.maxTtl, ttl || 1));
    const progress = clamp(1 - ttl / maxTtl, 0, 1);
    const fade = clamp(ttl / maxTtl, .1, 1);
    const color = effect.color || '#e9c565';
    const kind = String(effect.kind || '').toLowerCase();
    method(ctx, 'save'); method(ctx, 'translate', x, y);
    const actor = battleEnemyAnimation(effect), authoredSprite = this.enemyImages?.[actor?.variant];
    const authoredFrame = kind === 'death' && actor && this.battleArtMode === 'authoredFrames'
      && imageReady(authoredSprite) && actor.drawFrame(authoredSprite, 'death', effect.frameIndex, effect.bodyRadius);
    if (authoredFrame) {
      circle(ctx, 0, effect.bodyRadius * .7, effect.bodyRadius * .72, alphaColor('#382f2b', .2));
      method(ctx, 'scale', (Math.cos(n(effect.facing)) < 0 ? -1 : 1) * (authoredFrame.mirrorX ? -1 : 1), 1);
      ctx.globalAlpha = n(ctx.globalAlpha, 1) * (progress > .75 ? (1 - progress) * 4 : 1);
      method(ctx, 'drawImage', authoredSprite, authoredFrame.x, authoredFrame.y, authoredFrame.w, authoredFrame.h,
        authoredFrame.dx, authoredFrame.dy, authoredFrame.dw, authoredFrame.dh);
      method(ctx, 'restore');
      return;
    }
    // Authored skill-effect strips: signature-weapon effects prefer their
    // painted strip once it has loaded; the frame follows the effect's
    // own progress so animation and gameplay timing stay locked.  Any
    // other kind, or an unloaded strip, falls through to the vector
    // effects below unchanged.
    const fxId = skillFxIdForEffect(kind);
    const fxImage = fxId && this.skillFxImages?.[fxId];
    // The samadhi-fire burst ('mountain') telegraphs with a falling rock
    // during its delay — the vector branch keeps that phase; the painted
    // burst takes over only once the burst itself starts.
    const fxDelay = fxId === 'fire-burst' ? n(effect.delay, 0) : 0;
    const fxAge = maxTtl - ttl;
    const fxPhase = fxId === 'fire-burst' && fxDelay > 0 ? clamp((fxAge - fxDelay) / Math.max(.001, maxTtl - fxDelay), 0, 1) : progress;
    const fxRect = fxImage && fxAge >= fxDelay && skillFxFrameRect(fxImage, fxPhase);
    if (fxRect) {
      ctx.globalAlpha = n(ctx.globalAlpha, 1) * fade;
      if (fxId === 'monkey-clone') {
        // The wooden monkey clones scamper outward: run cycle on renderer
        // time, flipped to face their travel direction.
        const rect = skillFxFrameRect(fxImage, (this.elapsed * 3) % 1) || fxRect;
        const size = radius * 3;
        if (n(effect.vx) < 0) method(ctx, 'scale', -1, 1);
        method(ctx, 'drawImage', fxImage, rect.x, rect.y, rect.w, rect.h, -size / 2, -size / 2, size, size);
      } else if (fxId === 'whirl-pool') {
        const rect = skillFxFrameRect(fxImage, (this.elapsed * 2.2) % 1) || fxRect;
        const size = radius * 2;
        method(ctx, 'drawImage', fxImage, rect.x, rect.y, rect.w, rect.h, -size / 2, -size / 2, size, size);
      } else if (fxId === 'gold-bead' || fxId === 'fire-pool') {
        // Looping props: the rope bead pulses and the fire pool flickers on
        // renderer time; both are drawn centered on the effect position.
        const rect = skillFxFrameRect(fxImage, (this.elapsed * (fxId === 'gold-bead' ? 1.8 : 2.6)) % 1) || fxRect;
        const size = radius * (fxId === 'gold-bead' ? 2.4 : 2);
        method(ctx, 'drawImage', fxImage, rect.x, rect.y, rect.w, rect.h, -size / 2, -size / 2, size, size);
      } else if (fxId === 'fan-wave' || fxId === 'gourd-vortex') {
        // Cone effects: the strip's narrow point sits at the effect origin
        // and the cone widens along +X after rotation.  The gourd vortex
        // lives for seconds, so its frames cycle on renderer time instead
        // of the one-shot progress.
        const rect = fxId === 'gourd-vortex' ? (skillFxFrameRect(fxImage, (this.elapsed * 1.3) % 1) || fxRect) : fxRect;
        // Cone length must equal the gameplay radius: the strip is drawn
        // from -6% of its size, so size = radius * 1.06 puts the cone tip
        // exactly at the damage/pull reach (it was 2x before the audit).
        const size = radius * 1.06;
        method(ctx, 'rotate', n(effect.angle));
        method(ctx, 'drawImage', fxImage, rect.x, rect.y, rect.w, rect.h,
          -size * .06, -size / 2, size, size);
      } else if (fxId === 'palm-burst') {
        // The painted palm faces up in its cell; rotate so it strikes
        // outward along the effect angle.
        const size = radius * 2;
        method(ctx, 'rotate', n(effect.angle) + Math.PI / 2);
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h, -size / 2, -size / 2, size, size);
      } else if (fxId === 'fire-burst') {
        const size = radius * 2;
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h, -size / 2, -size / 2, size, size);
      } else if (fxId === 'rake-sweep') {
        // The rake lane's leading edge must land exactly on the damage
        // range (effect.length === stats.range, set by the engine). The
        // strip is drawn from -10% so its tip reaches +length.
        const length = n(effect.length, radius), width = n(effect.width, radius * .48);
        method(ctx, 'rotate', n(effect.angle));
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h,
          -radius * .1, -width * 1.1, length * 1.1, width * 2.2);
      } else if (fxId === 'water-ring') {
        const size = radius * 2;
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h, -size / 2, -size / 2, size, size);
      } else {
        method(ctx, 'rotate', n(effect.angle, 0));
        const size = radius * 2;
        method(ctx, 'drawImage', fxImage, fxRect.x, fxRect.y, fxRect.w, fxRect.h, -size / 2, -size / 2, size, size);
      }
      method(ctx, 'restore');
      return;
    }
    if (kind === 'debris') {
      const age = n(effect.maxTtl, 0) - n(effect.ttl, 0);
      const dx = n(effect.vx, 0) * age, dy = n(effect.vy, 0) * age + 330 * age * age;
      const rot = n(effect.spin, 0) * age * 3 + n(effect.id, 0);
      const fadeD = clamp(n(effect.ttl, 0) / Math.max(0.01, n(effect.maxTtl, 1) * 0.35), 0, 1);
      method(ctx, 'save'); method(ctx, 'translate', dx, dy); method(ctx, 'rotate', rot);
      const s = radius * (0.7 + 0.3 * fadeD);
      path(ctx, [['M', -s, s * .6], ['L', -s * .4, -s * .7], ['L', s * .8, -s * .4], ['L', s, s * .5], ['Z']], alphaColor(color, .95 * fadeD), alphaColor('#241708', .8 * fadeD), 1);
      method(ctx, 'restore');
    } else if (kind === 'crater') {
      const age = n(effect.maxTtl, 0) - n(effect.ttl, 0);
      const decal = this.craterImage;
      if (decal && imageReady(decal)) {
        const ds2 = clamp(age / 0.32, 0, 1);
        const dent2 = 1 + 2.70158 * Math.pow(ds2 - 1, 3) + 1.70158 * Math.pow(ds2 - 1, 2);
        circle(ctx, 0, 0, radius * .8 * dent2, alphaColor('#1c1108', .35));
        method(ctx, 'save');
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = Math.min(1, age * 4) * .97;
        const dw = radius * 3.1 * dent2;
        drawImageIfReady(ctx, decal, -dw / 2, -dw / 2, dw, dw);
        method(ctx, 'restore');
        if (age > 0.05) { const seed2 = n(effect.id, 0); for (let i = 0; i < 8; i += 1) { const a = i * TAU / 8 + (seed2 % 7) * .25, rx = Math.cos(a) * radius * 1.02 * dent2, ry = Math.sin(a) * radius * .82 * dent2, s2 = radius * (.12 + ((seed2 + i * 13) % 12) / 60) * dent2, rot = ((seed2 + i * 7) % 20) / 10 - 1, c2 = Math.cos(rot), sn2 = Math.sin(rot); const pt = (px, py) => [rx + px * c2 - py * sn2, ry + px * sn2 + py * c2]; const p = [pt(-s2, s2 * .55), pt(-s2 * .45, -s2 * .85), pt(s2 * .2, -s2 * .95), pt(s2 * .85, -s2 * .2), pt(s2, s2 * .6)]; path(ctx, [['M', p[0][0], p[0][1]], ['L', p[1][0], p[1][1]], ['L', p[2][0], p[2][1]], ['L', p[3][0], p[3][1]], ['L', p[4][0], p[4][1]], ['Z']], alphaColor('#40301e', .95), alphaColor('#17100a', .7), 1); } }
      } else {
      const ds = clamp(age / 0.32, 0, 1);
      const dent = 1 + 2.70158 * Math.pow(ds - 1, 3) + 1.70158 * Math.pow(ds - 1, 2);
      const grow = clamp(age / 0.5, 0, 1), crack = 1 - Math.pow(1 - grow, 2);
      const seed = n(effect.id, 0);
      const blobPts = (rr, squash, seedOff) => { const pts = []; for (let i = 0; i < 16; i += 1) { const a = i * TAU / 16, wob = 0.8 + ((seed * 31 + i * 47 + seedOff) % 41) / 100; pts.push([Math.cos(a) * rr * wob, Math.sin(a) * rr * wob * squash]); } return pts; };
      const blobPath = (rr, squash, seedOff, fill) => { const pts = blobPts(rr, squash, seedOff); path(ctx, [...pts.map((p, i) => i === 0 ? ['M', p[0], p[1]] : ['L', p[0], p[1]]), ['Z']], fill, null); };
      blobPath(radius * dent, .8, 0, alphaColor('#241708', .55));
      blobPath(radius * .7 * dent, .78, 13, alphaColor('#17100a', .5));
      blobPath(radius * .42 * dent, .75, 29, alphaColor('#0d0803', .45));
      const rock = (cx2, cy2, s2, rot, fill) => { const c = Math.cos(rot), sn = Math.sin(rot); const pt = (px, py) => [cx2 + px * c - py * sn, cy2 + px * sn + py * c]; const p = [pt(-s2, s2 * .55), pt(-s2 * .45, -s2 * .85), pt(s2 * .2, -s2 * .95), pt(s2 * .85, -s2 * .2), pt(s2, s2 * .6)]; path(ctx, [['M', p[0][0], p[0][1]], ['L', p[1][0], p[1][1]], ['L', p[2][0], p[2][1]], ['L', p[3][0], p[3][1]], ['L', p[4][0], p[4][1]], ['Z']], fill, alphaColor('#17100a', .7), 1); };
      if (age > 0.05) { for (let i = 0; i < 10; i += 1) { const a = i * TAU / 10 + (seed % 7) * .25, rx = Math.cos(a) * radius * .97 * dent, ry = Math.sin(a) * radius * .78 * dent, s2 = radius * (.13 + ((seed + i * 13) % 12) / 60) * dent; rock(rx, ry, s2, ((seed + i * 7) % 20) / 10 - 1, alphaColor('#40301e', .95)); } for (let i = 0; i < 4; i += 1) { const a = (seed * 3 + i * 97) % 628 / 100, rr = radius * (1.18 + ((seed + i * 31) % 20) / 100) * dent; rock(Math.cos(a) * rr, Math.sin(a) * rr * .8, radius * .11 * dent, i * 1.3, alphaColor('#4a3826', .85)); } }
      if (age > 0.15) for (let i = 0; i < 6; i += 1) { const a = (seed + i * 83) % 628 / 100, rr = radius * (.18 + ((seed + i * 41) % 45) / 100), s3 = radius * (.04 + ((seed + i * 17) % 5) / 100); rock(Math.cos(a) * rr * dent, Math.sin(a) * rr * .8 * dent, s3, i * .9, alphaColor('#4a3826', .8)); }
      for (let i = 0; i < 11; i += 1) { const a0 = i * TAU / 11 + (seed % 5) * .35; const len = radius * (.55 + ((seed + i * 37) % 80) / 100) * crack; const w0 = 3 + ((seed + i * 23) % 30) / 10; let px3 = Math.cos(a0) * radius * .24, py3 = Math.sin(a0) * radius * .19, ang = a0; const pts = [[px3, py3]]; for (let sgm = 1; sgm <= 3; sgm += 1) { ang += (((seed + i * 41 + sgm * 17) % 23) / 23 - .5) * .85; px3 += Math.cos(ang) * len / 3; py3 += Math.sin(ang) * len / 3 * .82; pts.push([px3, py3]); } for (let sgm = 0; sgm < 3; sgm += 1) { const pA = pts[sgm], pB = pts[sgm + 1], dx = pB[0] - pA[0], dy = pB[1] - pA[1], dl = Math.hypot(dx, dy) || 1, nx = -dy / dl, ny = dx / dl, wA = w0 * (1 - sgm / 3.6), wB = w0 * (1 - (sgm + 1) / 3.6); path(ctx, [['M', pA[0] + nx * wA, pA[1] + ny * wA], ['L', pB[0] + nx * wB, pB[1] + ny * wB], ['L', pB[0] - nx * wB, pB[1] - ny * wB], ['L', pA[0] - nx * wA, pA[1] - ny * wA], ['Z']], alphaColor('#120b06', .72), null); } if (crack > .5) { const bp = pts[1], ba = a0 + .95 + ((seed + i * 7) % 10) / 14; method(ctx, 'beginPath'); method(ctx, 'moveTo', bp[0], bp[1]); method(ctx, 'lineTo', bp[0] + Math.cos(ba) * radius * .24 * crack, bp[1] + Math.sin(ba) * radius * .19 * crack); paint(ctx, null, alphaColor('#120b06', .5), 1.6); method(ctx, 'stroke'); } }
      }
    } else if (kind === 'shockwave') {
      const ez = 1 - Math.pow(1 - progress, 2);
      circle(ctx, 0, 0, radius * (.2 + .8 * ez), null, alphaColor(color, .75 * (1 - progress)), 5 * (1 - progress) + 1);
      circle(ctx, 0, 0, radius * .55 * ez, alphaColor('#c9a86a', .20 * (1 - progress)));
    } else if (kind === 'cave-dust') {
      // A monster emerges from a cave mouth: an expanding dusty ring and
      // a low puff in earth tones, gone in about half a second.
      const ring = radius * (.5 + progress * 1.15);
      circle(ctx, 0, 0, ring, null, alphaColor(color, .55 * fade), 3);
      circle(ctx, 0, -radius * .16 * progress, ring * .62, alphaColor(color, .30 * fade), null, 0);
      for (let i = 0; i < 6; i += 1) {
        const a = i * TAU / 6 + .4;
        circle(ctx, Math.cos(a) * ring * .8, Math.sin(a) * ring * .45 - progress * 6, radius * .12, alphaColor(color, .5 * fade), null, 0);
      }
    } else if (kind === 'hit-burst') {
      // Each burst comes from a real damageEnemy call and expires after 260ms.
      const outer = radius * (.75 + progress * .52);
      method(ctx, 'beginPath');
      for (let i=0;i<12;i+=1) { const a=i*TAU/12,rr=i%2?outer*.47:outer; const px=Math.cos(a)*rr,py=Math.sin(a)*rr; if(!i)method(ctx,'moveTo',px,py);else method(ctx,'lineTo',px,py); }
      method(ctx, 'closePath');paint(ctx,alphaColor(color,.78*fade),'#111429',2.1);method(ctx,'fill');method(ctx,'stroke');
      circle(ctx,0,0,radius*.34,'#ffffdb','#182030',1.1);
      for (let i=0;i<5;i+=1){const a=i*TAU/5;method(ctx,'beginPath');method(ctx,'moveTo',Math.cos(a)*outer*1.15,Math.sin(a)*outer*1.15);method(ctx,'lineTo',Math.cos(a)*outer*1.52,Math.sin(a)*outer*1.52);paint(ctx,null,'#ffe451',1.5);method(ctx,'stroke');}
    } else if (kind === 'death' || kind === 'death-burst') {
      const frame = animationFrame(effect);
      const frames = Math.max(1, Number(effect.animationFrames) || 6);
      const t = clamp((frame + progress * frames) / frames, 0, 1);
      const rays = 6 + Math.min(6, frame);
      const outer = radius * (.72 + t * 1.2);
      circle(ctx, 0, 0, radius * (.35 + t * .42), alphaColor(color, .45 * (1 - progress * .7)), alphaColor('#fff2a8', .9 * (1 - progress)), 2.2);
      for (let i = 0; i < rays; i += 1) {
        const a = i * TAU / rays + t * .7;
        method(ctx, 'beginPath'); method(ctx, 'moveTo', Math.cos(a) * radius * .32, Math.sin(a) * radius * .32);
        method(ctx, 'lineTo', Math.cos(a) * outer, Math.sin(a) * outer);
        paint(ctx, null, alphaColor(effect.final ? '#fff2a8' : color, .85 * (1 - progress)), Math.max(1.4, radius * .07)); method(ctx, 'stroke');
      }
      ctx.font = `900 ${Math.max(10, radius * .45)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      paint(ctx, '#fff0a6'); method(ctx, 'fillText', effect.final ? '破' : '击破', 0, -radius * 1.05);
    } else if (kind.includes('warning') || kind.includes('danger') || kind.includes('telegraph')) {
      circle(ctx, 0, 0, radius, alphaColor('#c74c42', .12 + progress * .14), alphaColor('#a93533', .7), 2);
      circle(ctx, 0, 0, radius * progress, null, alphaColor('#e97851', .62), 3);
    } else if (kind.includes('slash') || kind.includes('sweep') || (kind.includes('fan') && kind !== 'fan') || kind.includes('heavy')) {
      const angle = n(effect.angle, 0); method(ctx, 'rotate', angle);
      method(ctx, 'beginPath');
      method(ctx, 'arc', 0, 0, radius, -.56, .56);
      paint(ctx, null, alphaColor(color, .82 * fade), Math.max(2, radius * .075));
      method(ctx, 'stroke');
      path(ctx, [['M', radius * .65, -radius * .35], ['Q', radius * 1.08, 0, radius * .65, radius * .35]], null, alphaColor('#fff0bc', .7 * fade), Math.max(1.5, radius * .035));
      if (kind.includes('heavy')) circle(ctx, radius * .75, 0, radius * .18, alphaColor('#fff5bb', .65 * fade));
    } else if (kind === 'hoe-line') {
      const length = n(effect.length, radius), width = n(effect.width, radius * .48);
      method(ctx, 'rotate', n(effect.angle));
      path(ctx, [['M', 0, -width / 2], ['L', length - radius * .12, -width / 2], ['L', length, 0], ['L', length - radius * .12, width / 2], ['L', 0, width / 2], ['Z']], alphaColor(color, .15 * fade), alphaColor(color, .67 * fade), 2);
      for (let i = 0; i < 4; i += 1) { const step = length / 4; path(ctx, [['M', i * step, -width * .34], ['L', (i + .7) * step, width * .34]], null, alphaColor('#fff2b8', .6 * fade), 1.5); }
    } else if (kind === 'staff-ring' || kind === 'fire-ring') {
      circle(ctx, 0, 0, radius, null, alphaColor(color, .72 * fade), Math.max(3, radius * .09));
      circle(ctx, 0, 0, radius * .82, null, alphaColor('#fff0b8', .45 * fade), 1.5);
      if (kind === 'fire-ring' && this.quality !== 'low') for (let i = 0; i < 8; i += 1) { const a = i * TAU / 8 + this.elapsed * 1.8; circle(ctx, Math.cos(a) * radius, Math.sin(a) * radius, radius * .07, alphaColor('#f5bf63', .8 * fade)); }
    } else if (kind === 'monkey-clone') {
      // A readable little interceptor: face, ears, staff and a comic speed
      // slash. It remains an effect object so the engine can pool it.
      circle(ctx, 0, radius * .1, radius * .72, '#d88942', '#38252b', Math.max(1.5, radius * .1));
      circle(ctx, -radius * .65, -radius * .3, radius * .3, '#e6a44d', '#38252b', Math.max(1, radius * .08));
      circle(ctx, radius * .65, -radius * .3, radius * .3, '#e6a44d', '#38252b', Math.max(1, radius * .08));
      circle(ctx, -radius * .22, radius * .02, radius * .08, '#221e29'); circle(ctx, radius * .22, radius * .02, radius * .08, '#221e29');
      method(ctx, 'beginPath'); method(ctx, 'moveTo', radius * .8, radius * .9); method(ctx, 'lineTo', radius * 1.6, -radius * 1.2); paint(ctx, null, '#eec95d', Math.max(2, radius * .1)); method(ctx, 'stroke');
      method(ctx, 'beginPath'); method(ctx, 'moveTo', -radius * 1.6, radius * .5); method(ctx, 'lineTo', -radius * 2.4, radius * .15); paint(ctx, null, '#fff1ad', 1.8); method(ctx, 'stroke');
    } else if (kind === 'palm-strike') {
      method(ctx, 'rotate', n(effect.angle, 0));
      // Five-finger impact stamp, with the requested 卍 mark in the palm.
      path(ctx, [['M', -radius * .62, radius * .5], ['Q', -radius * .9, 0, -radius * .58, -radius * .48], ['L', -radius * .4, -radius * 1.2], ['Q', -radius * .24, -radius * 1.34, -radius * .15, -radius * .98], ['L', -radius * .08, -radius * 1.42], ['Q', radius * .08, -radius * 1.5, radius * .1, -radius * 1.06], ['L', radius * .22, -radius * 1.32], ['Q', radius * .35, -radius * 1.36, radius * .33, -radius * .9], ['L', radius * .52, -radius * 1.12], ['Q', radius * .68, -radius * 1.15, radius * .56, -.42 * radius], ['Q', radius * 1.02, -.18 * radius, radius * .6, radius * .64], ['Q', 0, radius * .94, -radius * .62, radius * .5], ['Z']], alphaColor('#f4cf7a', .82 * fade), '#3e2b2b', Math.max(2, radius * .07));
      ctx.font = `900 ${Math.max(12, radius * .48)}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';paint(ctx,'#8f4e3c');method(ctx,'fillText',String(effect.symbol||'卍'),0,radius*.18);
      circle(ctx, 0, 0, radius * 1.25, null, alphaColor('#ffe77a', .7 * fade), 2.5);
    } else if (kind === 'gourd') {
      circle(ctx, 0, -radius * .3, radius * .22, alphaColor(color, .5 * fade), alphaColor('#663f70', .74 * fade), 1.5);
      circle(ctx, 0, radius * .06, radius * .33, alphaColor(color, .6 * fade), alphaColor('#663f70', .74 * fade), 1.5);
      circle(ctx, 0, 0, radius * (.6 + progress * .38), null, alphaColor(color, .46 * fade), 2);
    } else if (kind === 'rope') {
      circle(ctx, 0, 0, radius * (1 - progress * .2), null, alphaColor(color, .82 * fade), 3);
      for (let i = 0; i < 4; i += 1) { const a = i * Math.PI / 2; path(ctx, [['M', Math.cos(a) * radius * .58, Math.sin(a) * radius * .58], ['L', Math.cos(a + .3) * radius, Math.sin(a + .3) * radius]], null, alphaColor(color, .6 * fade), 2); }
    } else if (kind.includes('whirl') || kind.includes('vortex') || kind.includes('spin')) {
      for (let i = 0; i < (this.quality === 'low' ? 2 : 4); i += 1) {
        const a = this.elapsed * 2.4 + i * Math.PI / 2;
        method(ctx, 'beginPath'); method(ctx, 'arc', 0, 0, radius * (.35 + i * .15), a, a + 1.35); paint(ctx, null, alphaColor(color, .55 * fade), Math.max(2, radius * .055)); method(ctx, 'stroke');
      }
      circle(ctx, 0, 0, radius * .22, alphaColor(color, .2 * fade));
    } else if (kind === 'lotus') {
      for (let i = 0; i < 6; i += 1) { const a = i * TAU / 6 + progress * .3; path(ctx, [['M', 0, 0], ['Q', Math.cos(a - .35) * radius, Math.sin(a - .35) * radius, Math.cos(a) * radius, Math.sin(a) * radius], ['Q', Math.cos(a + .35) * radius, Math.sin(a + .35) * radius, 0, 0], ['Z']], alphaColor(color, .2 * fade), alphaColor(color, .66 * fade), 2); }
      circle(ctx, 0, 0, radius * .23, alphaColor('#fff3bb', .75 * fade));
    } else if (kind === 'fan') {
      method(ctx, 'rotate', n(effect.angle));
      path(ctx, [['M', 0, 0], ['Q', radius * .49, -radius * .75, radius, -radius * .08], ['Q', radius * .52, radius * .56, 0, 0], ['Z']], alphaColor(color, .42 * fade), alphaColor('#194c59', .82 * fade), 2.2);
      for (let i = 0; i < 5; i += 1) { const a = -.9 + i * .45; method(ctx, 'beginPath'); method(ctx, 'moveTo', radius * .18, radius * .04); method(ctx, 'lineTo', Math.cos(a) * radius, Math.sin(a) * radius); paint(ctx, null, alphaColor('#fff1b1', .72 * fade), 1.6); method(ctx, 'stroke'); }
    } else if (kind === 'mountain') {
      path(ctx, [['M', -radius * .9, radius * .55], ['L', -radius * .28, -radius * .78], ['L', 0, -radius * .36], ['L', radius * .32, -radius * 1.02], ['L', radius * 1.02, radius * .55], ['Z']], alphaColor('#c89763', .82 * fade), alphaColor('#402a2a', .86 * fade), 2.4);
      path(ctx, [['M', -radius * .26, -radius * .72], ['L', 0, -radius * .36], ['L', radius * .2, -radius * .74]], null, alphaColor('#fff0af', .7 * fade), 2);
    } else if (kind === 'bead' || kind === 'skull-bead') {
      const count = this.quality === 'low' ? 5 : 8;
      for (let i = 0; i < count; i += 1) { const a = this.elapsed * 1.8 + i * TAU / count; const rr = radius * 1.55; circle(ctx, Math.cos(a) * rr, Math.sin(a) * rr, radius * .28, alphaColor(color, .7 * fade), '#3f3030', 1.4); if (kind === 'skull-bead') circle(ctx, Math.cos(a) * rr, Math.sin(a) * rr - radius * .03, radius * .08, '#3a2d32'); }
    } else if (kind === 'fire-pool' || kind === 'fire-trail') {
      circle(ctx, 0, 0, radius * (.8 + progress * .22), alphaColor('#ec4930', .22 * fade), alphaColor('#ffbd38', .82 * fade), 2.2);
      for (let i = 0; i < 7; i += 1) { const a = i * TAU / 7 + this.elapsed; path(ctx, [['M', Math.cos(a) * radius * .2, Math.sin(a) * radius * .2], ['Q', Math.cos(a + .2) * radius * .65, Math.sin(a + .2) * radius * .65, Math.cos(a) * radius, Math.sin(a) * radius]], null, alphaColor('#ffd246', .74 * fade), 2); }
    } else if (kind.includes('heal') || kind.includes('holy') || kind.includes('light')) {
      for (let i = 0; i < 4; i += 1) {
        const a = i * Math.PI / 2 + this.elapsed * .8;
        method(ctx, 'beginPath'); method(ctx, 'moveTo', Math.cos(a) * radius * .2, Math.sin(a) * radius * .2); method(ctx, 'lineTo', Math.cos(a) * radius, Math.sin(a) * radius); paint(ctx, null, alphaColor(color, .55 * fade), Math.max(1.5, radius * .045)); method(ctx, 'stroke');
      }
      circle(ctx, 0, 0, radius * (.22 + progress * .18), alphaColor('#fff8d0', .66 * fade));
    } else if (kind.includes('dash') || kind.includes('trail')) {
      const a = n(effect.angle, 0); method(ctx, 'rotate', a);
      for (let i = 1; i < 5; i += 1) { roundedBox(ctx, -radius * i * .32, -radius * (.1 + i * .03), radius * .38, radius * (.2 + i * .02), radius * .08, alphaColor(color, fade * (1 - i / 6)), null); }
    } else if (kind.includes('fire') || kind.includes('explod') || kind.includes('impact')) {
      circle(ctx, 0, 0, radius * (.3 + progress * .75), null, alphaColor(color, .84 * fade), Math.max(2, radius * .08));
      const rays = this.quality === 'low' ? 6 : 10;
      for (let i = 0; i < rays; i += 1) { const a = i * TAU / rays; method(ctx, 'beginPath'); method(ctx, 'moveTo', Math.cos(a) * radius * .3, Math.sin(a) * radius * .3); method(ctx, 'lineTo', Math.cos(a) * radius * (0.65 + progress * .4), Math.sin(a) * radius * (0.65 + progress * .4)); paint(ctx, null, alphaColor(color, .7 * fade), Math.max(1.4, radius * .035)); method(ctx, 'stroke'); }
    } else {
      const count = this.quality === 'low' ? 4 : 7;
      for (let i = 0; i < count; i += 1) { const a = i * TAU / count; const rr = radius * (.45 + .48 * progress); circle(ctx, Math.cos(a) * rr, Math.sin(a) * rr, Math.max(1.5, radius * .06), alphaColor(color, fade)); }
    }
    if (['palm-strike', 'mountain', 'explosion', 'heavy-sweep', 'fan'].includes(kind) && fade > .25) {
      const words = { 'palm-strike': '轰！', mountain: '镇！', explosion: '嘭！', 'heavy-sweep': '喝！', fan: '呼！' };
      ctx.font = '900 18px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      method(ctx, 'strokeText', words[kind], 0, -radius * 1.05); paint(ctx, '#ffe15b'); method(ctx, 'fillText', words[kind], 0, -radius * 1.05);
    }
    method(ctx, 'restore');
  }

  _drawEnemy(ctx, enemy, player, theme) {
    if (!enemy) return;
    const x = n(enemy.x), y = n(enemy.y), radius = clamp(n(enemy.radius, 17), 7, enemy.kind === 'boss' ? 84 : 72);
    const kind = enemy.kind === 'boss' ? 'boss' : enemy.kind === 'elite' ? 'elite' : 'normal';
    const tintList = ENEMY_TINTS[typeof enemy.theme === 'string' ? enemy.theme : Object.keys(THEMES).find(key => THEMES[key] === theme) || 'forest'] || ENEMY_TINTS.forest;
    const tint = enemy.flash > 0 ? '#fff1c7' : enemy.color || tintList[Math.abs(Math.floor(n(enemy.id, 0))) % tintList.length];
    const actor = battleEnemyAnimation(enemy), authoredSprite = this.enemyImages?.[actor?.variant];
    const authoredFrame = actor && this.battleArtMode === 'authoredFrames' && imageReady(authoredSprite)
      && actor.drawFrame(authoredSprite, animationState(enemy), animationFrame(enemy), radius);
    const falling = enemy.dropHeight && n(enemy.spawnTimer, 0) > 0;
    let fallDy = 0;
    if (falling) {
      const fp = clamp(1 - n(enemy.spawnTimer, 0) / 1.2, 0, 1);
      fallDy = -n(enemy.dropHeight, 0) * Math.pow(1 - fp, 1.7);
      circle(ctx, x, y, radius * (2.3 - 1.2 * fp), null, alphaColor('#e03428', .35 + .35 * fp), 4);
      circle(ctx, x, y, radius * (0.6 + 0.75 * fp), alphaColor('#1c1410', .16 + .22 * fp));
    }
    if (enemy.kind === 'elite' && !falling) {
      const pulse = Math.sin(this.elapsed * 4.2) * .5 + .5;
      circle(ctx, x, y + radius * .5, radius * (1.08 + pulse * .14), null, alphaColor('#e8402f', .38 + .3 * pulse), 3);
      circle(ctx, x, y + radius * .5, radius * .8, null, alphaColor('#ffb03a', .25), 1.5);
    }
    method(ctx, 'save'); method(ctx, 'translate', x, y + fallDy);
    if (!falling) circle(ctx, 0, radius * .7, radius * .72, alphaColor('#382f2b', .2));
    const pose = animationPose(enemy, radius);
    const bob = Math.sin(this.elapsed * (kind === 'boss' ? 2 : 4) + n(enemy.id, 0) * .8) * radius * .045;
    if (!authoredFrame) {
      method(ctx, 'translate', 0, bob + pose.y - n(enemy.hopHeight, 0) * radius * .4);
      method(ctx, 'rotate', pose.rotation);
    }
    const enemyFacing = Number.isFinite(Number(enemy.facing))
      ? Number(enemy.facing)
      : Math.atan2(n(player?.y) - y, n(player?.x) - x);
    const facing = Math.cos(enemyFacing) < 0 ? -1 : 1;
    method(ctx, 'scale', facing * (authoredFrame ? (authoredFrame.mirrorX ? -1 : 1) : pose.scaleX), authoredFrame ? 1 : pose.scaleY);
    if (kind !== 'normal') circle(ctx, 0, -radius * .25, radius * 1.2, alphaColor(kind === 'boss' ? '#ff4b32' : '#ff9b2f', .14), alphaColor(kind === 'boss' ? '#e84936' : '#c77835', .7), Math.max(1.5, radius * .07));
    if (kind === 'boss') this._drawBossAura(ctx, radius, enemy);
    const variantText = String(enemy.variantName || enemy.name || '').toLowerCase();
    const spriteKey = kind === 'boss' ? 'boss' : kind === 'elite' ? 'brute' : (/蛛|蝎|虫|spider/.test(variantText) ? 'spider' : /鸟|鹰|鹏|鹤|bird|hawk/.test(variantText) ? 'bird' : 'creature');
    const sprite = this.enemyImages?.[spriteKey];
    const spriteReady = this.battleArtMode === 'authoredFrames' && sprite?.__v3BattleSprite === true && imageReady(sprite);
    if (authoredFrame) {
      method(ctx, 'drawImage', authoredSprite, authoredFrame.x, authoredFrame.y, authoredFrame.w, authoredFrame.h,
        authoredFrame.dx, authoredFrame.dy, authoredFrame.dw, authoredFrame.dh);
    } else if (spriteReady) {
      // The authored Boss PNG already contains its helmet, silhouette and
      // weapon. Keep it inside a compact 2.3r×2.45r box so the named health
      // bar remains readable on a portrait viewport.
      const scale = spriteKey === 'boss' ? [2.3, 2.45, 1.15, 1.26] : [2.56, 2.7, 1.28, 1.35];
      const frame = spriteFrameRect(sprite, spriteKey, animationFrame(enemy), animationState(enemy));
      if (frame) {
        const dw = radius * scale[0] * frame.scaleX;
        const dh = radius * scale[1] * frame.scaleY;
        method(ctx, 'drawImage', sprite, frame.x, frame.y, frame.w, frame.h,
          -dw * .5 + frame.dx * radius, -dh * .5 + frame.dy * radius, dw, dh);
      }
      else method(ctx, 'drawImage', sprite, -radius * scale[2], -radius * scale[3], radius * scale[0], radius * scale[1]);
    }
    else this._drawDemonBody(ctx, enemy, radius, tint, theme, battleMotion(enemy, radius));
    if (kind !== 'normal' && !authoredFrame && !(kind === 'boss' && spriteReady)) this._drawCrown(ctx, radius, kind === 'boss' ? '#e6b951' : '#b9b9a2');
    if (kind === 'boss' && !authoredFrame && !spriteReady) this._drawBossWeapon(ctx, radius, enemy, theme);
    method(ctx, 'restore');
    if (enemy.maxHp > 0 && (kind !== 'normal' || enemy.hp < enemy.maxHp)) this._drawHealthBar(ctx, x, this._enemyHealthBarY(enemy, radius), radius * (kind === 'boss' ? 3.15 : 2.3), enemy.hp / enemy.maxHp, kind === 'boss' ? '#ef3e37' : '#e66b35');
    if (kind === 'boss') this._drawBossLabel(ctx, x, y - radius * 2.75 + this._bossLabelOffset(enemy), enemy);
    // Stun is represented once by the compact status pass. A second crown
    // of stars here used to compete with the badge, health bar and silhouette.
  }

  _drawBossAura(ctx, r, enemy) {
    const pulse = 1 + Math.sin(this.elapsed * 3 + n(enemy.id, 0)) * .08;
    circle(ctx, 0, 0, r * 1.48 * pulse, alphaColor('#ef403b', .08), alphaColor('#f8c735', .75), Math.max(2, r * .055));
    const rays = this.quality === 'low' ? 6 : 10;
    for (let i = 0; i < rays; i += 1) {
      const a = i * TAU / rays + this.elapsed * .25;
      method(ctx, 'beginPath'); method(ctx, 'moveTo', Math.cos(a) * r * 1.32, Math.sin(a) * r * 1.32); method(ctx, 'lineTo', Math.cos(a) * r * 1.7, Math.sin(a) * r * 1.7);
      paint(ctx, null, alphaColor('#ffcf3d', .5), Math.max(1.5, r * .045)); method(ctx, 'stroke');
    }
    const entrance = enemy.spawnProgress ?? enemy.entrance ?? enemy.intro;
    if (Number.isFinite(Number(entrance)) && Number(entrance) < 1) {
      const t = clamp(Number(entrance), 0, 1);
      circle(ctx, 0, 0, r * (2.2 - t * .8), null, alphaColor('#32d7e9', .72 * (1 - t)), Math.max(2, r * .08));
      method(ctx, 'beginPath'); method(ctx, 'moveTo', -r * 2.2, 0); method(ctx, 'lineTo', r * 2.2, 0); paint(ctx, null, alphaColor('#fff0a1', .65 * (1 - t)), 3); method(ctx, 'stroke');
    }
  }

  _drawBossWeapon(ctx, r, enemy, theme) {
    const variant = String(enemy.variant || enemy.name || '').toLowerCase();
    const bossId = enemy?.bossIdentity?.bossId;
    const angle = Math.sin(this.elapsed * .8) * .08;
    method(ctx, 'save'); method(ctx, 'rotate', angle);
    if (bossId === 'yin-general') {
      method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .42, r * .35); method(ctx, 'lineTo', r * 1.55, -r * 1.15); method(ctx, 'moveTo', r * .68, r * .55); method(ctx, 'lineTo', r * 1.86, -r * .55);
      paint(ctx, null, '#f6d15a', Math.max(2.2, r * .095)); method(ctx, 'stroke');
      circle(ctx, r * 1.55, -r * 1.15, r * .12, '#d7353e', '#51242a', 1.2);
      circle(ctx, r * 1.86, -r * .55, r * .11, '#d7353e', '#51242a', 1.2);
      method(ctx, 'restore'); return;
    }
    if (bossId === 'xiong-shanjun') {
      path(ctx, [['M', r * .38, r * .5], ['L', r * 1.25, -r * .65], ['L', r * 1.7, -r * .32], ['L', r * .86, r * .85], ['Z']], '#d8c28a', '#38282b', Math.max(1.5, r * .055));
      circle(ctx, r * 1.5, -r * .48, r * .34, '#8e5a3f', '#38282b', Math.max(1.4, r * .055));
      method(ctx, 'restore'); return;
    }
    if (bossId === 'te-chushi') {
      method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .42, r * .48); method(ctx, 'lineTo', r * 1.75, -r * 1.3); method(ctx, 'moveTo', r * 1.32, -r * .8); method(ctx, 'quadraticCurveTo', r * 1.9, -r * .72, r * 1.78, -r * .1);
      paint(ctx, null, '#e6c971', Math.max(2.2, r * .09)); method(ctx, 'stroke');
      circle(ctx, r * 1.75, -r * 1.3, r * .12, '#3e9b91', '#273b3c', 1.2);
      method(ctx, 'restore'); return;
    }
    method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .55, r * .45); method(ctx, 'lineTo', r * 1.75, -r * 1.2); paint(ctx, null, theme.sticker || '#f6ce3a', Math.max(2.4, r * .11)); method(ctx, 'stroke');
    if (/dragon|龙|snake|蛇/.test(variant)) {
      path(ctx, [['M', r * 1.15, -r * 1.5], ['Q', r * 1.65, -r * 1.95, r * 2.0, -r * 1.42], ['Q', r * 1.58, -r * 1.15, r * 1.15, -r * 1.5], ['Z']], '#35bfc6', '#243c4a', 1.8);
    } else {
      circle(ctx, r * 1.75, -r * 1.2, r * .22, theme.accent, theme.ink, 1.5);
    }
    method(ctx, 'restore');
  }

  _drawBossLabel(ctx, x, y, enemy) {
    const label = enemy.final ? '最终妖王' : (enemy.name || '妖王');
    method(ctx, 'save'); method(ctx, 'translate', x, y); ctx.font = '900 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    roundedBox(ctx, -52, -11, 104, 22, 9, alphaColor('#241b27', .9), '#ffce42', 1.6);
    paint(ctx, '#ffe58a'); method(ctx, 'fillText', String(label).slice(0, 12), 0, 1); method(ctx, 'restore');
  }

  _drawDemonBody(ctx, enemy, r, tint, theme, motion = battleMotion(enemy, r)) {
    const bossId = enemy?.kind === 'boss' ? enemy?.bossIdentity?.bossId : null;
    const bossProfile = FINAL_BOSS_PROFILES[bossId];
    if (bossProfile) {
      this._drawFinalBossBody(ctx, r, bossProfile, motion);
      return;
    }
    const variant = String(enemy.variant || enemy.name || '').toLowerCase();
    const runner = /fox|wolf|monkey|hawk|runner|蝎|狐|狼/.test(variant);
    const brute = /bull|bear|king|demon|牛|熊|王|妖王|巨/.test(variant);
    const dragon = /dragon|龙|snake|蛇|蛟/.test(variant);
    const spider = /spider|蛛|web/.test(variant);
    const bird = /bird|hawk|鹰|鸟|鹤/.test(variant);
    if (dragon) { this._drawDragonDemon(ctx, r, tint, theme, motion); return; }
    if (spider) { this._drawSpiderDemon(ctx, r, tint, theme, motion); return; }
    if (bird) { this._drawBirdDemon(ctx, r, tint, theme, motion); return; }
    const bodyR = brute ? r * 1.1 : r;
    const bodyY = brute ? -r * .18 : 0;
    path(ctx, [['M', -bodyR * .75, bodyY + bodyR * .9], ['Q', -bodyR * 1.05, bodyY + bodyR * .15, -bodyR * .65, bodyY - bodyR * .55], ['Q', 0, bodyY - bodyR * 1.1, bodyR * .65, bodyY - bodyR * .55], ['Q', bodyR * 1.05, bodyY + bodyR * .15, bodyR * .75, bodyY + bodyR * .9], ['Z']], tint, '#48372f', Math.max(1.3, r * .08));
    if (runner) {
      path(ctx, [['M', -r * .5, -r * .62], ['L', -r * 1.02, -r * 1.02], ['L', -r * .42, -r * .84], ['Z']], tint, '#48372f', r * .055);
      path(ctx, [['M', r * .5, -r * .62], ['L', r * 1.02, -r * 1.02], ['L', r * .42, -r * .84], ['Z']], tint, '#48372f', r * .055);
    } else {
      path(ctx, [['M', -r * .5, -r * .6], ['L', -r * .75, -r * 1.15], ['L', -r * .16, -r * .78], ['Z']], theme.accent, '#48372f', r * .055);
      path(ctx, [['M', r * .5, -r * .6], ['L', r * .75, -r * 1.15], ['L', r * .16, -r * .78], ['Z']], theme.accent, '#48372f', r * .055);
    }
    circle(ctx, -r * .26, -r * .45, r * .1, '#f6d575', '#49352f', r * .035); circle(ctx, r * .26, -r * .45, r * .1, '#f6d575', '#49352f', r * .035);
    circle(ctx, -r * .26, -r * .45, r * .04, '#342b2c'); circle(ctx, r * .26, -r * .45, r * .04, '#342b2c');
    if (brute) { path(ctx, [['M', -r * .34, r * .02], ['Q', 0, r * .22, r * .34, r * .02]], null, alphaColor('#fff1c2', .62), r * .07); }
    else { path(ctx, [['M', -r * .27, r * .15], ['Q', 0, r * .31, r * .27, r * .15]], null, '#432f2e', r * .05); }
    // simple legs keep enemies readable at very small zoom values
    method(ctx, 'beginPath'); method(ctx, 'moveTo', -r * .35, r * .65); method(ctx, 'lineTo', -r * .48 + motion.stride, r * 1.08); method(ctx, 'moveTo', r * .35, r * .65); method(ctx, 'lineTo', r * .48 - motion.stride, r * 1.08); paint(ctx, null, '#4b372f', Math.max(2, r * .13)); method(ctx, 'stroke');
  }

  _drawFinalBossBody(ctx, r, profile, motion = {}) {
    const stride = n(motion.stride, 0);
    const bodyR = r * 1.12;
    const bodyY = -r * .12;
    path(ctx, [['M', -bodyR * .8, bodyY + bodyR * .92], ['Q', -bodyR * 1.12, bodyY + bodyR * .18, -bodyR * .7, bodyY - bodyR * .58], ['Q', 0, bodyY - bodyR * 1.16, bodyR * .7, bodyY - bodyR * .58], ['Q', bodyR * 1.12, bodyY + bodyR * .18, bodyR * .8, bodyY + bodyR * .92], ['Z']], profile.body, profile.dark, Math.max(1.6, r * .085));
    if (profile === FINAL_BOSS_PROFILES['yin-general']) {
      path(ctx, [['M', -r * .5, -r * .62], ['L', -r * 1.02, -r * 1.16], ['L', -r * .16, -r * .86], ['Z']], profile.accent, profile.dark, r * .055);
      path(ctx, [['M', r * .5, -r * .62], ['L', r * 1.02, -r * 1.16], ['L', r * .16, -r * .86], ['Z']], profile.accent, profile.dark, r * .055);
      for (const offset of [-.34, 0, .34]) path(ctx, [['M', offset * r, -r * .84], ['L', offset * .7 * r, -r * .26]], null, profile.dark, Math.max(1.4, r * .055));
      circle(ctx, -r * .26, -r * .47, r * .1, profile.light, profile.dark, r * .03); circle(ctx, r * .26, -r * .47, r * .1, profile.light, profile.dark, r * .03);
    } else if (profile === FINAL_BOSS_PROFILES['xiong-shanjun']) {
      circle(ctx, -r * .58, -r * .72, r * .3, profile.accent, profile.dark, r * .06); circle(ctx, r * .58, -r * .72, r * .3, profile.accent, profile.dark, r * .06);
      path(ctx, [['M', -r * .8, -r * .2], ['L', -r * 1.16, r * .18], ['L', -r * .72, r * .5], ['Z']], profile.metal, profile.dark, r * .05);
      path(ctx, [['M', r * .8, -r * .2], ['L', r * 1.16, r * .18], ['L', r * .72, r * .5], ['Z']], profile.metal, profile.dark, r * .05);
      circle(ctx, -r * .26, -r * .46, r * .105, profile.light, profile.dark, r * .03); circle(ctx, r * .26, -r * .46, r * .105, profile.light, profile.dark, r * .03);
      path(ctx, [['M', -r * .28, r * .08], ['Q', 0, r * .28, r * .28, r * .08]], null, profile.light, r * .075);
    } else {
      path(ctx, [['M', -r * .48, -r * .62], ['L', -r * 1.1, -r * 1.28], ['L', -r * .16, -r * .9], ['Z']], profile.light, profile.dark, r * .06);
      path(ctx, [['M', r * .48, -r * .62], ['L', r * 1.1, -r * 1.28], ['L', r * .16, -r * .9], ['Z']], profile.light, profile.dark, r * .06);
      circle(ctx, -r * .26, -r * .46, r * .11, profile.metal, profile.dark, r * .03); circle(ctx, r * .26, -r * .46, r * .11, profile.metal, profile.dark, r * .03);
      circle(ctx, 0, -r * .05, r * .2, profile.accent, profile.dark, r * .045);
      circle(ctx, 0, -r * .05, r * .08, null, profile.metal, Math.max(1.2, r * .035));
    }
    method(ctx, 'beginPath'); method(ctx, 'moveTo', -r * .37, r * .67); method(ctx, 'lineTo', -r * .52 + stride, r * 1.12); method(ctx, 'moveTo', r * .37, r * .67); method(ctx, 'lineTo', r * .52 - stride, r * 1.12); paint(ctx, null, profile.dark, Math.max(2, r * .14)); method(ctx, 'stroke');
    path(ctx, [['M', -r * .72, r * .25], ['Q', 0, r * .43, r * .72, r * .25], ['L', r * .58, r * .48], ['Q', 0, r * .63, -r * .58, r * .48], ['Z']], profile.accent, profile.dark, Math.max(1.1, r * .04));
  }

  _drawDragonDemon(ctx, r, tint, theme) {
    path(ctx, [['M', -r * .9, r * .7], ['Q', -r * 1.1, 0, -r * .55, -r * .6], ['Q', 0, -r * 1.4, r * .8, -r * .55], ['Q', r * 1.2, 0, r * .85, r * .7], ['Z']], tint, theme.ink, Math.max(1.5, r * .08));
    path(ctx, [['M', -r * .45, -r * .65], ['L', -r * 1.1, -r * 1.28], ['L', -r * .12, -r * .9], ['Z']], theme.accent, theme.ink, r * .06);
    path(ctx, [['M', r * .35, -r * .68], ['L', r * 1.08, -r * 1.22], ['L', r * .1, -r * .92], ['Z']], theme.accent, theme.ink, r * .06);
    circle(ctx, -r * .25, -r * .45, r * .11, '#f7da41', theme.ink, r * .035); circle(ctx, r * .25, -r * .45, r * .11, '#f7da41', theme.ink, r * .035);
    method(ctx, 'beginPath'); method(ctx, 'moveTo', -r * .2, -r * .07); method(ctx, 'quadraticCurveTo', 0, r * .25, r * .2, -r * .07); paint(ctx, null, '#3b2330', r * .06); method(ctx, 'stroke');
  }

  _drawSpiderDemon(ctx, r, tint, theme) {
    circle(ctx, 0, -r * .28, r * .72, tint, theme.ink, Math.max(1.4, r * .07));
    circle(ctx, 0, -r * .72, r * .42, tint, theme.ink, Math.max(1.2, r * .06));
    for (let i = 0; i < 4; i += 1) {
      const side = i % 2 ? 1 : -1, yy = -r * .2 + i * r * .35;
      method(ctx, 'beginPath'); method(ctx, 'moveTo', side * r * .42, yy); method(ctx, 'quadraticCurveTo', side * r * 1.12, yy - r * .26, side * r * 1.3, yy + r * .1); paint(ctx, null, theme.ink, Math.max(1.5, r * .075)); method(ctx, 'stroke');
    }
    for (const x of [-.2, .2]) circle(ctx, x * r, -r * .77, r * .09, '#f8d448', theme.ink, r * .03);
  }

  _drawBirdDemon(ctx, r, tint, theme) {
    path(ctx, [['M', -r * .78, r * .72], ['Q', -r * 1.2, -r * .2, 0, -r * .82], ['Q', r * 1.2, -r * .2, r * .78, r * .72], ['Q', 0, r * 1.1, -r * .78, r * .72], ['Z']], tint, theme.ink, Math.max(1.4, r * .075));
    path(ctx, [['M', 0, -r * .58], ['L', r * .92, -r * .42], ['L', 0, -r * .18], ['Z']], theme.sticker || '#f5c83d', theme.ink, r * .045);
    circle(ctx, -r * .2, -r * .58, r * .1, '#fff1a1', theme.ink, r * .03); circle(ctx, r * .2, -r * .58, r * .1, '#fff1a1', theme.ink, r * .03);
  }

  _drawCrown(ctx, r, color) {
    path(ctx, [['M', -r * .7, -r * 1.28], ['L', -r * .4, -r * 1.78], ['L', 0, -r * 1.34], ['L', r * .4, -r * 1.78], ['L', r * .7, -r * 1.28], ['Z']], color, '#533e2e', Math.max(1.5, r * .055));
    circle(ctx, 0, -r * 1.39, r * .09, '#fff3ad');
  }

  _drawHealthBar(ctx, x, y, width, ratio, color) {
    const w = Math.max(20, width), h = Math.max(3, w * .08), left = x - w / 2;
    roundedBox(ctx, left, y, w, h, h / 2, alphaColor('#302b29', .7), null);
    roundedBox(ctx, left + 1, y + 1, (w - 2) * clamp(n(ratio, 0), 0, 1), h - 2, (h - 2) / 2, color, null);
  }

  _drawStatusStars(ctx, x, y, r, color) {
    for (let i = 0; i < 3; i += 1) {
      const a = this.elapsed * 2 + i * TAU / 3;
      circle(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r * .35, r * .12, color, '#65482d', 1);
    }
  }

  _drawPlayer(ctx, player, characterId) {
    const [id, style] = heroStyle(characterId || player.characterId || player.character || 'wukong');
    const x = n(player.x, WORLD_SIZE / 2), y = n(player.y, WORLD_SIZE / 2), r = clamp(n(player.radius, 19), 9, 52);
    const facing = Math.cos(n(player.facing, 0)) < 0 ? -1 : 1;
    const pose = animationPose(player, r);
    const motion = battleMotion(player, r);
    const gait = animationState(player) === 'move' ? pose.y * .7 : 0;
    method(ctx, 'save'); method(ctx, 'translate', x, y + pose.y); method(ctx, 'scale', facing * pose.scaleX, pose.scaleY); method(ctx, 'rotate', pose.rotation);
    circle(ctx, 0, r * .9, r * .84, alphaColor('#3b302b', .26));
    const sprite = this.heroImages?.[id];
    const spriteReady = this.battleArtMode === 'authoredFrames' && sprite?.__v3BattleSprite === true && (sprite.complete === undefined || sprite.complete || sprite.naturalWidth > 0 || sprite.width > 0);
    if (spriteReady) {
      if (sprite.__v3BattleSprite) {
        const frame = spriteFrameRect(sprite, id, animationFrame(player), animationState(player));
        const frameRatio = frame ? frame.w / Math.max(1, frame.h) : 1;
        const h = r * 4.85, w = h * frameRatio;
        if (frame) {
          const dw = w * frame.scaleX, dh = h * frame.scaleY;
          method(ctx, 'drawImage', sprite, frame.x, frame.y, frame.w, frame.h,
            -dw * .5 + frame.dx * r, -r * 2.58 + frame.dy * r, dw, dh);
        }
      } else if (sprite.__v2BattleSprite) {
        // Retired single-pose atlas support is gallery-only and intentionally
        // unreachable in normal battleArtMode:'authoredFrames'.
        const source = sprite.__sourceRects?.[id];
        const spriteRatio = source ? source.w / source.h : (Number(sprite.width) || 320) / Math.max(1, Number(sprite.height) || 520);
        const h = r * 4.6;
        const w = h * spriteRatio;
        const frame = spriteFrameRect(sprite, id, animationFrame(player), animationState(player));
        if (frame) {
          const dw = w * frame.scaleX, dh = h * frame.scaleY;
          method(ctx, 'drawImage', sprite, frame.x, frame.y, frame.w, frame.h,
            -dw * .5 + frame.dx * r, -r * 2.5 + frame.dy * r, dw, dh);
        }
        else if (source) method(ctx, 'drawImage', sprite, source.x, source.y, source.w, source.h, -w * .5, -r * 2.5, w, h);
        else method(ctx, 'drawImage', sprite, -w * .5, -r * 2.5, w, h);
      } else {
        const frame = spriteFrameRect(sprite, id, animationFrame(player), animationState(player));
        if (frame) {
          const dw = r * 2.84 * frame.scaleX, dh = r * 3.55 * frame.scaleY;
          method(ctx, 'drawImage', sprite, frame.x, frame.y, frame.w, frame.h,
            -dw * .5 + frame.dx * r, -r * 1.58 + frame.dy * r, dw, dh);
        }
        else method(ctx, 'drawImage', sprite, -r * 1.42, -r * 1.58, r * 2.84, r * 3.55);
      }
    } else {
      // legs and robe/body
      method(ctx, 'beginPath'); method(ctx, 'moveTo', -r * .3, r * .54); method(ctx, 'lineTo', -r * .38 + gait + motion.stride, r * 1.08); method(ctx, 'moveTo', r * .3, r * .54); method(ctx, 'lineTo', r * .38 - gait - motion.stride, r * 1.08); paint(ctx, null, style.dark, Math.max(2, r * .16)); method(ctx, 'stroke');
      path(ctx, [['M', -r * .65, r * .65], ['Q', 0, -r * .1, r * .65, r * .65], ['L', r * .48, r * 1.03], ['L', -r * .48, r * 1.03], ['Z']], style.body, style.dark, Math.max(1.4, r * .07));
      if (id === 'wukong') this._drawWukong(ctx, r, style, motion);
      else if (id === 'tangsanzang') this._drawTang(ctx, r, style, motion);
      else if (id === 'bajie') this._drawBajie(ctx, r, style, motion);
      else this._drawShajing(ctx, r, style, motion);
    }
    this._drawAttackTrail(ctx, r, player, style);
    if (n(player.hitFlash, 0) > 0) {
      circle(ctx, 0, 0, r * 1.28, alphaColor('#fff7d2', .28), alphaColor('#ffef9b', .9), Math.max(2, r * .09));
      for (let i = 0; i < 6; i += 1) { const a = i * TAU / 6; method(ctx, 'beginPath'); method(ctx, 'moveTo', Math.cos(a) * r * 1.1, Math.sin(a) * r * 1.1); method(ctx, 'lineTo', Math.cos(a) * r * 1.65, Math.sin(a) * r * 1.65); paint(ctx, null, '#fff7d2', Math.max(1.3, r * .05)); method(ctx, 'stroke'); }
    }
    method(ctx, 'restore');
    if (n(player.invulnerable, 0) > 0) circle(ctx, x, y, r * 1.35, null, alphaColor('#f6dc87', .52), Math.max(1.5, r * .08));
    // Floating HP bar under the hero (Survivor.io grammar): only while hurt.
    const hpFrac = clamp(n(player.hp, 0) / Math.max(1, n(player.maxHp, 1)), 0, 1);
    if (hpFrac < 1) {
      const bw = r * 2.3, bx = x - bw / 2, by = y + r * 1.5;
      roundedBox(ctx, bx - 1, by - 1, bw + 2, 7, 3, alphaColor('#241a12', .72), null);
      if (hpFrac > 0) roundedBox(ctx, bx, by, Math.max(3, bw * hpFrac), 5, 2, hpFrac > .35 ? '#7ec850' : '#e0483a', null);
    }
  }

  _drawAttackTrail(ctx, r, player, style) {
    const rawFlash = n(player.attackFlash ?? player.attackTimer ?? player.swing, 0);
    // A faint live arc keeps the hero's current weapon readable between
    // attack frames; the brighter pass still follows the real attackFlash.
    const flash = rawFlash > 0 ? rawFlash : .12 + (Math.sin(this.elapsed * 5.5) + 1) * .035;
    const angle = n(player.attackAngle, n(player.facing, 0));
    method(ctx, 'save'); method(ctx, 'rotate', angle);
    const reach = r * (1.2 + clamp(n(player.weaponLevel, 1), 1, 5) * .2);
    const arcAlpha = rawFlash > 0 ? .82 : .25;
    method(ctx, 'beginPath'); method(ctx, 'arc', 0, 0, reach, -.95, .95); paint(ctx, null, alphaColor(style.light || '#f7d351', arcAlpha), Math.max(2, r * (rawFlash > 0 ? .11 : .06))); method(ctx, 'stroke');
    for (let i = 0; i < 3; i += 1) {
      method(ctx, 'beginPath'); method(ctx, 'moveTo', reach * (.5 + i * .12), -reach * (.75 + i * .11)); method(ctx, 'lineTo', reach * (1.12 + i * .12), -reach * (.91 + i * .1));
      paint(ctx, null, alphaColor('#fff0a6', .65 - i * .14), Math.max(1.2, r * .045)); method(ctx, 'stroke');
    }
    method(ctx, 'restore');
  }

  _drawWukong(ctx, r, style, motion = {}) {
    circle(ctx, 0, -r * .54, r * .55, style.skin, style.dark, r * .07);
    circle(ctx, -r * .56, -r * .58, r * .2, style.body, style.dark, r * .06); circle(ctx, r * .56, -r * .58, r * .2, style.body, style.dark, r * .06);
    path(ctx, [['M', -r * .55, -r * .82], ['Q', 0, -r * 1.24, r * .55, -r * .82], ['L', r * .35, -r * .68], ['L', -r * .35, -r * .68], ['Z']], style.metal, style.dark, r * .055);
    circle(ctx, -r * .18, -r * .59, r * .055, '#282329'); circle(ctx, r * .18, -r * .59, r * .055, '#282329');
    // Ruyi Jingu Bang, angle follows the facing direction through the mirrored body
    method(ctx, 'save'); method(ctx, 'rotate', motion.weaponSwing || 0);
    method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .34, r * .18); method(ctx, 'lineTo', r * 1.55, -r * 1.12); paint(ctx, null, style.metal, Math.max(2, r * .1)); method(ctx, 'stroke');
    circle(ctx, r * 1.55, -r * 1.12, r * .13, style.body, style.dark, r * .04); method(ctx, 'restore');
  }

  _drawTang(ctx, r, style, motion = {}) {
    circle(ctx, 0, -r * .6, r * .48, style.skin, style.dark, r * .06);
    path(ctx, [['M', -r * .48, -r * .55], ['Q', 0, -r * 1.1, r * .48, -r * .55], ['L', r * .4, -.1 * r], ['L', -r * .4, -.1 * r], ['Z']], style.body, style.dark, r * .06);
    circle(ctx, -r * .17, -r * .58, r * .045, '#27324a'); circle(ctx, r * .17, -r * .58, r * .045, '#27324a');
    method(ctx, 'save'); method(ctx, 'rotate', motion.weaponSwing || 0); method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .3, r * .25); method(ctx, 'lineTo', r * 1.5, r * .25); paint(ctx, null, style.metal, Math.max(2, r * .07)); method(ctx, 'stroke'); circle(ctx, r * 1.5, r * .25, r * .16, '#9be5ee', style.dark, r * .04); method(ctx, 'restore');
  }

  _drawBajie(ctx, r, style, motion = {}) {
    circle(ctx, 0, -r * .55, r * .55, style.skin, style.dark, r * .07);
    path(ctx, [['M', -r * .42, -r * .54], ['L', -r * .82, -r * .88], ['L', -r * .62, -.35 * r], ['Z']], style.skin, style.dark, r * .05); path(ctx, [['M', r * .42, -r * .54], ['L', r * .82, -r * .88], ['L', r * .62, -.35 * r], ['Z']], style.skin, style.dark, r * .05);
    circle(ctx, -r * .18, -r * .62, r * .055, '#3a292e'); circle(ctx, r * .18, -r * .62, r * .055, '#3a292e'); circle(ctx, 0, -r * .39, r * .19, style.light, style.dark, r * .04);
    method(ctx, 'save'); method(ctx, 'rotate', motion.weaponSwing || 0); method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .3, r * .2); method(ctx, 'lineTo', r * 1.58, -r * .15); paint(ctx, null, style.metal, Math.max(2, r * .11)); method(ctx, 'stroke');
    for (let i = 0; i < 3; i += 1) { method(ctx, 'beginPath'); method(ctx, 'moveTo', r * (1.3 + i * .14), -r * (.42 - i * .08)); method(ctx, 'lineTo', r * (1.5 + i * .14), -r * (.07 - i * .08)); paint(ctx, null, style.metal, Math.max(1.4, r * .055)); method(ctx, 'stroke'); } method(ctx, 'restore');
  }

  _drawShajing(ctx, r, style, motion = {}) {
    circle(ctx, 0, -r * .58, r * .5, style.skin, style.dark, r * .07);
    path(ctx, [['M', -r * .52, -r * .72], ['Q', 0, -r * 1.08, r * .52, -r * .72], ['L', r * .37, -.25 * r], ['L', -r * .37, -.25 * r], ['Z']], style.dark, style.dark, r * .05);
    circle(ctx, -r * .16, -r * .59, r * .05, '#293131'); circle(ctx, r * .16, -r * .59, r * .05, '#293131');
    method(ctx, 'save'); method(ctx, 'rotate', motion.weaponSwing || 0); method(ctx, 'beginPath'); method(ctx, 'moveTo', r * .25, r * .15); method(ctx, 'lineTo', r * 1.4, -r * .82); paint(ctx, null, style.metal, Math.max(2, r * .09)); method(ctx, 'stroke');
    circle(ctx, r * 1.4, -r * .82, r * .2, style.metal, style.dark, r * .045); method(ctx, 'restore');
  }

  _drawHud(ctx, state, theme) {
    const player = state.player || {};
    const hpRatio = clamp(n(player.hp, 0) / Math.max(1, n(player.maxHp, 1)), 0, 1);
    const xpRatio = clamp(n(player.xp, 0) / Math.max(1, n(player.xpNext, 1)), 0, 1);
    method(ctx, 'save'); method(ctx, 'setTransform', this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    // parchment HUD cards
    const cardWidth = Math.min(232, Math.max(116, this.width - 122));
    const barWidth = cardWidth - 24;
    roundedBox(ctx, 12, 12, cardWidth, 62, 12, alphaColor('#fbf1cf', .93), alphaColor(theme.ink, .55), 1.5);
    roundedBox(ctx, 24, 37, barWidth, 10, 5, alphaColor('#47382f', .18), null);
    roundedBox(ctx, 25, 38, (barWidth - 2) * hpRatio, 8, 4, '#c85b4b', null);
    roundedBox(ctx, 24, 54, barWidth, 8, 4, alphaColor('#47382f', .16), null);
    roundedBox(ctx, 25, 55, (barWidth - 2) * xpRatio, 6, 3, '#67a688', null);
    paint(ctx, theme.ink); ctx.font = 'bold 11px sans-serif'; method(ctx, 'fillText', `生命 ${Math.ceil(n(player.hp, 0))}/${Math.ceil(n(player.maxHp, 0))}`, 24, 29); method(ctx, 'fillText', `Lv.${Math.max(1, Math.floor(n(player.level, 1)))}`, 12 + cardWidth - 40, 29);
    const time = n(state.time, 0); const minutes = Math.floor(time / 60); const seconds = Math.floor(time % 60); const clock = `${minutes}:${String(seconds).padStart(2, '0')}`;
    roundedBox(ctx, this.width - 100, 12, 88, 34, 10, alphaColor('#fbf1cf', .93), alphaColor(theme.ink, .55), 1.5);
    paint(ctx, theme.ink); ctx.font = 'bold 14px sans-serif'; method(ctx, 'fillText', clock, this.width - 78, 34);
    const stage = state.stage || {};
    const chapter = n(stage.chapter, n(state.chapter, 1));
    const stageName = stage.name || stage.location || `第${Math.max(1, chapter)}难`;
    roundedBox(ctx, this.width - 172, 54, 160, 24, 8, alphaColor('#241b27', .86), alphaColor(theme.sticker || '#f4ca3f', .76), 1.1);
    paint(ctx, '#ffe58a'); ctx.font = '900 10px sans-serif'; method(ctx, 'fillText', `第${Math.max(1, chapter)}难 · ${String(stageName).slice(0, 8)}`, this.width - 160, 70);
    const skills = Array.isArray(state.skills) ? state.skills.slice(0, 5) : EMPTY_LIST;
    skills.forEach((skill, index) => {
      const sx = 12 + index * 34, sy = this.height - 56;
      roundedBox(ctx, sx, sy, 28, 28, 7, alphaColor('#241b27', .86), alphaColor(skill?.color || theme.sticker || '#f4ca3f', .8), 1.1);
      const icon = this.skillImages?.[skill?.id];
      if (!drawImageIfReady(ctx, icon, sx + 3, sy + 3, 22, 22)) {
        paint(ctx, skill?.color || '#fff0a6'); ctx.font = '900 10px sans-serif'; method(ctx, 'fillText', String(skill?.level || index + 1), sx + 10, sy + 18);
      } else {
        paint(ctx, '#fff0a6'); ctx.font = '900 8px sans-serif'; method(ctx, 'fillText', String(skill?.level || index + 1), sx + 19, sy + 10);
      }
    });
    const boss = Array.isArray(state.enemies) ? state.enemies.find((enemy) => enemy?.kind === 'boss') : null;
    if (boss) {
      roundedBox(ctx, this.width / 2 - 92, 84, 184, 18, 8, alphaColor('#241b27', .86), alphaColor('#ef3e37', .8), 1.1);
      roundedBox(ctx, this.width / 2 - 89, 87, 178 * clamp(n(boss.hp, 0) / Math.max(1, n(boss.maxHp, 1)), 0, 1), 12, 5, '#ef3e37', null);
      paint(ctx, '#fff0a6'); ctx.font = '900 9px sans-serif'; method(ctx, 'fillText', String(boss.name || (boss.final ? '最终妖王' : '妖王')).slice(0, 16), this.width / 2, 97);
    }
    if (state.status === 'upgrade' || state.status === 'paused' || state.status === 'won' || state.status === 'lost') {
      const label = state.status === 'upgrade' ? '选择法宝' : state.status === 'paused' ? '暂停' : state.status === 'won' ? '功德圆满' : '西游未完';
      roundedBox(ctx, this.width / 2 - 76, this.height - 48, 152, 32, 12, alphaColor('#fbf1cf', .95), alphaColor(theme.ink, .6), 1.5);
      paint(ctx, theme.ink); ctx.font = 'bold 14px sans-serif'; method(ctx, 'fillText', label, this.width / 2 - 28, this.height - 27);
    }
    method(ctx, 'restore');
  }
}


module.exports.default=GameRenderer;





Object.assign(module.exports,{GameRenderer,drawPortrait});

},
"progression":function(module,exports,require){
const { TALENTS, DAILY_CHALLENGES } = require('content');

const SAVE_KEY = 'xiyou-survivor-save-v1';
const CHAPTER_NAMES = ['东土启程','山川收徒','佛门试心','降魔伏怪','水国奇缘','真假心猿','狮驼险途','天竺寻真','灵山功成'];
function dayKey(now=new Date()){ return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; }
function newSave(){return {version:1,unlockedStage:1,talents:{},talentPoints:0,bestScore:0,wins:0,runs:0,streak:0,scrolls:0,totalKills:0,lastRun:null,muted:false,volume:.65,quality:'auto',daily:{day:dayKey(),progress:{},claimed:[]},records:{},seenArtifacts:[],patrolSince:0,claimedChapters:[],tutorialSeen:false};}
function sanitizeSave(value){const s={...newSave(),...(value&&typeof value==='object'?value:{})};for(const key of ['unlockedStage','talentPoints','bestScore','wins','runs','streak','scrolls','totalKills'])s[key]=Math.max(key==='unlockedStage'?1:0,Math.floor(Number(s[key])||0));s.unlockedStage=Math.min(81,s.unlockedStage);s.talents={...(s.talents||{})};for(const t of TALENTS)s.talents[t.id]=Math.min(t.maxLevel,Math.max(0,Math.floor(Number(s.talents[t.id])||0)));s.volume=Math.min(1,Math.max(0,Number(s.volume)||0));s.muted=!!s.muted;s.quality=['auto','high','low'].includes(s.quality)?s.quality:'auto';s.records=s.records&&typeof s.records==='object'?s.records:{};s.seenArtifacts=Array.isArray(s.seenArtifacts)?s.seenArtifacts:[];s.patrolSince=Number(s.patrolSince)>0?Number(s.patrolSince):Date.now();s.claimedChapters=Array.isArray(s.claimedChapters)?[...new Set(s.claimedChapters.map(Number).filter(n=>n>=1&&n<=9))]:[];refreshDaily(s);return s;}
function refreshDaily(save,now=new Date()){const day=dayKey(now);if(!save.daily||save.daily.day!==day)save.daily={day,progress:{},claimed:[]};save.daily.progress=save.daily.progress||{};save.daily.claimed=Array.isArray(save.daily.claimed)?save.daily.claimed:[];return save.daily;}
function talentCost(save,id){const t=TALENTS.find(t=>t.id===id);return t?t.baseCost*((save.talents[id]||0)+1):Infinity;}
function buyTalent(save,id){const t=TALENTS.find(t=>t.id===id);if(!t)return {ok:false,message:'未知经脉'};const lv=save.talents[id]||0,cost=talentCost(save,id);if(lv>=t.maxLevel)return {ok:false,message:'此经脉已圆满'};if(save.talentPoints<cost)return {ok:false,message:'悟性不足，闯关与每日禅试可获取'};save.talentPoints-=cost;save.talents[id]=lv+1;return {ok:true,message:`${t.name}提升至${lv+1}级`};}
function dailyRows(save){refreshDaily(save);return DAILY_CHALLENGES.map(c=>({...c,progress:Math.min(c.target,save.daily.progress[c.id]||0),claimed:save.daily.claimed.includes(c.id),complete:(save.daily.progress[c.id]||0)>=c.target}));}
function claimDaily(save,id){const c=dailyRows(save).find(c=>c.id===id);if(!c||!c.complete||c.claimed)return {ok:false,message:c?.claimed?'今日已经领取':'达成目标后再来领取'};save.talentPoints+=c.reward;save.daily.claimed.push(id);return {ok:true,message:`悟性 +${c.reward}`};}
function recordRun(save,state,stats={}){refreshDaily(save);const won=state.status==='won',score=state.kills*10+state.player.level*100+(won?1000:0),reward=Math.max(12,Math.floor(state.kills*.16))+Math.floor(state.time/30)+(won?80:0);save.runs++;save.totalKills+=state.kills;save.bestScore=Math.max(save.bestScore,score);save.talentPoints+=reward;save.lastRun={stageId:state.stage.id,characterId:state.character.id,characterName:state.character.name,stageName:state.stage.name,time:Math.floor(state.time),kills:state.kills,won};if(won){save.wins++;save.streak++;save.scrolls++;if(state.stage.id===save.unlockedStage)save.unlockedStage=Math.min(81,save.unlockedStage+1);}else save.streak=0;const record=save.records[state.stage.id]||{wins:0,bestScore:0};record.bestScore=Math.max(record.bestScore,score);record.wins+=(won?1:0);save.records[state.stage.id]=record;for(const skill of state.skills)if(!skill.isWeapon&&!save.seenArtifacts.includes(skill.id))save.seenArtifacts.push(skill.id);const p=save.daily.progress;p['daily-kills']=Math.max(p['daily-kills']||0,state.kills);p['daily-elite']=Math.max(p['daily-elite']||0,stats.elites||0);if(won){p['daily-stage']=1;if(!(stats.dashes||0))p['daily-no-dash']=1;}return {reward,score,won};}
// Patrol （巡山遣使）: idle earnings that accrue in real time between
// sessions, a meta staple of survivors-like peers. The hourly rate grows
// with the highest unlocked stage and accrual caps at 8 hours, so coming
// back daily pays better than leaving it for a week.
const PATROL_CAP_MS=8*3600*1000;
function patrolRatePerHour(save){return 20+save.unlockedStage;}
function patrolAccrued(save,now=Date.now()){const elapsed=Math.min(PATROL_CAP_MS,Math.max(0,now-(save.patrolSince||now)));return {ms:elapsed,amount:Math.floor(elapsed/60000*patrolRatePerHour(save)/60),capped:now-(save.patrolSince||now)>=PATROL_CAP_MS};}
function claimPatrol(save,now=Date.now()){const {amount}=patrolAccrued(save,now);if(amount<=0)return {ok:false,message:'巡山刚出发，过一会儿再来'};save.talentPoints+=amount;save.patrolSince=now;return {ok:true,message:`巡山归来，悟性 +${amount}`,amount};}
// Chapter rewards: clearing all nine trials of a chapter pays out once,
// which also gives 经文 a second source beyond single-stage clears.
function chapterComplete(save,chapter){const start=chapter*9+1;for(let id=start;id<start+9;id++)if(!(save.records[id]?.wins>0))return false;return true;}
function chapterReward(chapter){return {talentPoints:300+chapter*50,scrolls:1};}
function claimChapter(save,chapter){if(save.claimedChapters.includes(chapter))return {ok:false,message:'本章奖励已领取'};if(!chapterComplete(save,chapter))return {ok:false,message:'通关本章全部九难后领取'};const r=chapterReward(chapter);save.talentPoints+=r.talentPoints;save.scrolls+=r.scrolls;save.claimedChapters.push(chapter);return {ok:true,message:`章节奖励：悟性 +${r.talentPoints} · 经文 +${r.scrolls}`};}


Object.assign(module.exports,{SAVE_KEY,CHAPTER_NAMES,dayKey,newSave,sanitizeSave,refreshDaily,talentCost,buyTalent,dailyRows,claimDaily,recordRun,PATROL_CAP_MS,patrolRatePerHour,patrolAccrued,claimPatrol,chapterComplete,chapterReward,claimChapter});

},
"native-ui":function(module,exports,require){
const { GameEngine } = require('engine');
const { GameRenderer, drawPortrait } = require('renderer');
const { CHARACTERS, ARTIFACTS, STAGES, TALENTS, BALANCE, getStage } = require('content');
const { SAVE_KEY, CHAPTER_NAMES, sanitizeSave, buyTalent, talentCost, recordRun, dailyRows, claimDaily, patrolAccrued, claimPatrol, chapterComplete, claimChapter, chapterReward } = require('progression');

// River stone, tea wood, vermilion seals and aged sutra paper are shared by
// menus and the in-run HUD. Text colours stay dark enough for parchment.
const C={bg:'#e7d6ad',panel:'#f6e9c9',raised:'#d9bf8b',ink:'#34291f',muted:'#766044',gold:'#8b4d1f',red:'#a13e2a',line:'#654a31',jade:'#456943',cyan:'#416e70',blue:'#667d83',green:'#64774b',wood:'#60452e',woodLight:'#a57b49',paper:'#fff3d7',primary:'#9f4728',light:'#fff4d7'};
const HERO_INK={wukong:'#954a22',tangsanzang:'#35676b',tangseng:'#35676b',bajie:'#884445',shajing:'#4e6652',wujing:'#4e6652'};
// Chapter-list map chips: theme paper colours mirror renderer THEMES so a
// stage reads as its battlefield (ridge/forest/temple/water/fire/sand/snow)
// instead of a bare text row. Playtest addition, 2026-10-22.
const THEME_CHIPS={doublefork:['#16866e','山'],forest:['#16866e','林'],temple:['#4e2d91','寺'],water:['#168eaa','水'],fire:['#b53b3e','炎'],sand:['#d87827','沙'],snow:['#4dc1d4','雪']};
const MOTION={enter:250,item:190,stagger:30,press:160};
// Talent rows speak in numbers, not prose: the stat label for each talent's
// content-table stat key, and a percent formatter for its per-level value.
const TALENT_STATS={maxHp:'最大生命',speed:'移动速度',damage:'全部伤害',pickup:'经验获取',damageReduction:'受伤减免',dashCooldown:'闪避冷却缩短'};
const pct=v=>`${(v*100).toFixed(1).replace(/\.0$/,'')}%`;
const clamp01=x=>Math.max(0,Math.min(1,x));
// Exact cubic-bezier(.23,1,.32,1) from the shared animate skill.
const easeOut=t=>{if(t<=0||t>=1)return clamp01(t);let a=0,b=1,u=t;for(let i=0;i<12;i++){const x=3*(1-u)*(1-u)*u*.23+3*(1-u)*u*u*.32+u*u*u;if(x<t)a=u;else b=u;u=(a+b)/2;}return 1-Math.pow(1-u,3);};
const fmt=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
const idName=id=>ARTIFACTS.find(a=>a.id===id)?.name||id;
class NativeGame {
  constructor(canvas,platform={}){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.platform=platform;this.audio=platform.audio||{play(){},startMusic(){},stopMusic(){},setMuted(){},dispose(){}};
    this.save=sanitizeSave(platform.load?.(SAVE_KEY));this.audio.setMuted(this.save.muted);this.screen='home';this.characterId='wukong';this.admin=platform.admin===true;this.adminOpen=false;this.adminSpeed=1;this.adminSnap=null;this.stageId=this.save.unlockedStage;this.heroImages=platform.heroImages||{};this.portraitImages=platform.portraitImages||{};this.skillImages=platform.skillImages||{};this.skillFxImages=platform.skillFxImages||{};this.enemyImages=platform.enemyImages||{};this.craterImage=platform.craterImage||null;this.mapImages=platform.mapImages||{};this.uiImages=platform.uiImages||{};this.page=0;this.input={x:0,y:0};this.buttons=[];this.engine=null;this.renderer=null;this.frame=0;this.running=false;this.disposed=false;this.hidden=false;this.autoPaused=false;this.stats={};this.metrics={frames:0,maxUpdateMs:0,maxRenderMs:0,peakEnemies:0,peakProjectiles:0,peakEffects:0};this.samples=[];this.touchOrigin=null;this.joy=null;this.message='';this.result=null;this.clock=platform.now||(()=>Date.now());this.raf=platform.requestFrame||((fn)=>setTimeout(()=>fn(this.clock()),16));this.cancel=platform.cancelFrame||clearTimeout;
    this.reducedMotion=platform.reducedMotion??globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
    this.uiAnimation={key:'',sequence:0,frameIndex:0,startedAt:0,elapsed:0,progress:1,eased:1,from:0,active:false,duration:MOTION.enter};this.press=null;
    this.resize(platform.width||390,platform.height||844,platform.pixelRatio||1,platform.safeArea||{});
  }
  motionKey(){return this.screen==='game'?`game:${this.engine?.state.status||'playing'}${this.engine?.state.status==='upgrade'?':'+this.engine.state.player.level:''}`:`${this.screen}:${this.page}`;}
  syncMotion(){const now=this.clock(),m=this.uiAnimation,key=this.motionKey();if(m.key!==key){const from=m.active?m.eased:0;m.key=key;m.sequence++;m.frameIndex=0;m.startedAt=now;m.elapsed=0;m.from=from;m.progress=0;m.eased=from;m.duration=this.screen==='select'?MOTION.item+MOTION.stagger*3:MOTION.enter;m.active=!this.hidden&&key!=='game:playing';if(this.press?.key!==key)this.press=null;}if(m.active){m.elapsed=Math.max(0,now-m.startedAt);m.progress=clamp01(m.elapsed/m.duration);m.eased=m.from+(1-m.from)*easeOut(m.progress);m.frameIndex++;if(m.progress===1)m.active=false;}else{m.progress=1;m.eased=1;}if(this.press&&now-this.press.startedAt>=MOTION.press)this.press=null;}
  withMotion(paint,index=null,anchorY=this.h/2){const m=this.uiAnimation,c=this.ctx;let p=m.eased;if(index!==null&&m.active){const q=clamp01((m.elapsed-index*MOTION.stagger)/MOTION.item);p=m.from+(1-m.from)*easeOut(q);}c.save();c.globalAlpha=(Number.isFinite(c.globalAlpha)?c.globalAlpha:1)*(.25+.75*p);if(!this.reducedMotion){const s=.97+.03*p;c.translate(this.w/2,anchorY+8*(1-p));c.scale(s,s);c.translate(-this.w/2,-anchorY);}paint();c.restore();}
  withPress(x,y,w,h,paint){const c=this.ctx,p=this.press;let amount=0;if(p&&p.key===this.uiAnimation.key&&p.x===x&&p.y===y)amount=1-easeOut(clamp01((this.clock()-p.startedAt)/MOTION.press));c.save();if(amount&&!this.reducedMotion){const s=1-.03*amount;c.translate(x+w/2,y+h/2+amount);c.scale(s,s);c.translate(-x-w/2,-y-h/2);}paint(amount);c.restore();}
  getUIMotionState(){const m=this.uiAnimation;return {key:m.key,sequence:m.sequence,frameIndex:m.frameIndex,elapsedMs:Math.round(m.elapsed),progress:m.progress,eased:m.eased,active:m.active,pressActive:!!this.press,reducedMotion:this.reducedMotion,selectedCharacter:this.characterId};}
  persist(){try{this.platform.save?.(SAVE_KEY,this.save);}catch{this.message='存档写入失败，请检查设备空间';}}
  resize(w,h,dpr=1,safe={}){
    this.w=w;this.h=h;this.dpr=Math.min(2,Math.max(1,dpr));
    const safeTop=Number.isFinite(Number(safe?.top))?Number(safe.top):0;
    // bottom is an absolute CSS edge: finite zero means no usable band.
    // Only absent/nullish or non-finite values use the viewport fallback.
    const bottomValue=Number(safe?.bottom??h),safeBottom=Number.isFinite(bottomValue)?bottomValue:h;
    this.top=Math.min(h,Math.max(12,safeTop));this.bottom=Math.min(h,Math.max(12,h-safeBottom));
    this.canvas.width=Math.round(w*this.dpr);this.canvas.height=Math.round(h*this.dpr);
    if(this.renderer){this.renderer.resize(w,h,this.dpr);this.renderer.setHudScreenBounds({left:0,right:w,top:this.top+149,bottom:h-this.bottom-90});}
    this.draw();
  }
  text(value,x,y,size=14,color=C.ink,align='left',weight='normal'){const c=this.ctx;c.fillStyle=color;c.font=`${weight} ${size}px serif`;c.textAlign=align;c.textBaseline='top';c.fillText(String(value),x,y);}
  box(x,y,w,h,fill=C.panel,stroke=C.line){const c=this.ctx;if(h<=8){c.fillStyle=fill;c.fillRect(x,y,w,h);if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.strokeRect(x+.5,y+.5,w-1,h-1);}return;}const cut=Math.min(7,Math.max(3,Math.min(w,h)*.08));const poly=(ox,oy)=>{c.beginPath();c.moveTo(x+cut+ox,y+oy);c.lineTo(x+w-cut+ox,y+oy);c.lineTo(x+w+ox,y+cut+oy);c.lineTo(x+w+ox,y+h-cut+oy);c.lineTo(x+w-cut+ox,y+h+oy);c.lineTo(x+cut+ox,y+h+oy);c.lineTo(x+ox,y+h-cut+oy);c.lineTo(x+ox,y+cut+oy);c.closePath();};c.fillStyle='rgba(56,37,22,.22)';poly(1,3);c.fill();c.fillStyle=fill;poly(0,0);c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;poly(0,0);c.stroke();c.strokeStyle='rgba(255,245,208,.5)';c.lineWidth=1;c.beginPath();c.moveTo(x+9,y+4);c.lineTo(x+w-9,y+4);c.stroke();}if(w>90&&h>36){c.strokeStyle='rgba(113,80,42,.10)';c.lineWidth=1;for(let i=0;i<3;i++){const py=y+12+i*(h-20)/3;c.beginPath();c.moveTo(x+7,py);c.lineTo(x+13+(i*7)%13,py+1);c.moveTo(x+w-19,py+7);c.lineTo(x+w-8,py+6);c.stroke();}}}
  wrap(value,x,y,width,size=12,color=C.muted,maxLines=4){let line='',n=0;const c=this.ctx;c.font=`${size}px serif`;for(const ch of String(value)){if(ch==='\n'||(c.measureText(line+ch).width>width&&line)){this.text(line,x,y+n*size*1.7,size,color);line=ch==='\n'?'':ch;n++;if(n>=maxLines)return n;}else line+=ch;}if(line)this.text(line,x,y+n*size*1.7,size,color);return n+1;}
  button(label,x,y,w,h,action,options={}){const disabled=!!options.disabled;this.withPress(x,y,w,h,()=>{this.box(x,y,w,h,disabled?C.raised:options.primary?C.primary:C.panel,options.selected?C.gold:C.line);if(options.primary)this.tex(this.uiImages.wood,x+2,y+2,w-4,h-4,.5);if(options.primary){this.ctx.fillStyle=C.woodLight;this.ctx.fillRect(x+9,y+9,3,h-18);this.ctx.fillRect(x+w-12,y+9,3,h-18);}this.text(label,x+w/2,y+(h-16)/2,options.size||14,disabled?C.muted:options.primary?C.light:C.ink,'center','bold');});this.buttons.push({x,y,w,h,action,disabled,label});}
  portrait(id,x,y,size){const image=this.portraitImages[id]||this.heroImages[id];
    // Prefer the same polished card strip for every selection tile once it is
    // decoded. This avoids a load-order mix where two heroes show cards and
    // two show SVG/vector fallbacks in the same menu. v3 sheets are gameplay-
    // only 4×2 atlases and are never drawn as portraits.
    if(this.heroSheet&&(this.heroSheet.width||this.heroSheet.naturalWidth)){const index=Math.max(0,CHARACTERS.findIndex(c=>c.id===id)),pw=this.heroSheet.width/4;this.ctx.drawImage(this.heroSheet,index*pw+pw*.04,this.heroSheet.height*.1,pw*.92,this.heroSheet.height*.77,x-size*.5,y-size*.625,size,size*1.25);return;}
    if(image&&!image.__v3BattleSprite&&(image.width||image.naturalWidth)){const rect=image.__sourceRects?.[id]||image.__sourceRect;const sw=rect?.w||image.naturalWidth||image.width,sh=rect?.h||image.naturalHeight||image.height,scale=Math.min(size/sw,size*1.35/sh);if(rect)this.ctx.drawImage(image,rect.x,rect.y,sw,sh,x-sw*scale/2,y-sh*scale/2,sw*scale,sh*scale);else this.ctx.drawImage(image,x-sw*scale/2,y-sh*scale/2,sw*scale,sh*scale);return;}
    drawPortrait(this.ctx,id,x,y,size);}
  skillIcon(id,x,y,size){const image=this.skillImages?.[id],c=this.ctx;const ready=image&&(image.complete===undefined||image.complete||image.naturalWidth>0||image.width>0);if(ready&&typeof c.drawImage==='function'){try{c.drawImage(image,x,y,size,size);return true;}catch{}}
    const artifact=ARTIFACTS.find(a=>a.id===id);const palette=artifact?.color||({
      'weapon:wukong':'#e7352b','weapon:tangsanzang':'#5fe6d0','weapon:bajie':'#ef4737','weapon:shajing':'#1fb9a6'
    }[id]||C.gold);c.fillStyle=palette;c.beginPath();c.arc(x+size/2,y+size/2,size*.38,0,Math.PI*2);c.fill();c.strokeStyle=C.ink;c.lineWidth=1;c.stroke();return false;}
  titleText(value,x,y,size=25,align='left',theme='ink'){const c=this.ctx;const g=c.createLinearGradient(0,y,0,y+size*1.3);if(theme==='gold'){g.addColorStop(0,'#fff3c4');g.addColorStop(.55,'#e9bc63');g.addColorStop(1,'#9a641c');}else{g.addColorStop(0,'#54402a');g.addColorStop(.6,'#33241a');g.addColorStop(1,'#1d130b');}c.save();c.font=`bold ${size}px "KaiTi","STKaiti","Kaiti SC","Songti SC",serif`;c.textAlign=align;c.textBaseline='top';c.shadowColor='rgba(24,14,4,.4)';c.shadowBlur=3;c.shadowOffsetY=1;c.fillStyle=g;c.fillText(String(value),x,y);c.restore();}
  header(title,sub){this.text(sub||'玄奘西行录',20,this.top+12,9,C.gold);if(this.screen==='home'&&this.uiImages?.logo&&(this.uiImages.logo.naturalWidth||this.uiImages.logo.width))this.tex(this.uiImages.logo,16,this.top+23,152,39);else this.titleText(title,20,this.top+29,25,'left','ink');if(this.admin)this.button('管',this.w-124,this.top+19,50,44,()=>{this.adminOpen=!this.adminOpen;this.draw();});this.button(this.screen==='home'?(this.save.muted?'静音':'有声'):'返回',this.w-70,this.top+19,50,44,()=>{if(this.screen==='home'){this.save.muted=!this.save.muted;this.audio.setMuted(this.save.muted);this.persist();}else this.go('home');});}
  go(screen){if(this.screen==='game'&&screen!=='game')this.stopRun();if(screen===this.screen){this.draw();return;}this._pendingScreen=screen;this._fadePhase='out';this._fadeAt=this.clock();this.draw();}
  draw(){if(this.disposed||this.hidden||!this.ctx)return;this.syncMotion();const c=this.ctx;c.setTransform(this.dpr,0,0,this.dpr,0,0);this.buttons=[];const ap=this.platform.assetProgress?.();if(ap&&!ap.complete&&!this._bootDone){this._bootStartAt??=this.clock();if(this.clock()-this._bootStartAt<6000){this.bootPage(ap);this.schedule();return;}this._bootDone=true;}if(ap&&ap.complete)this._bootDone=true;if(this.screen==='game'&&this.engine){this.drawGame();this.schedule();return;}c.fillStyle=C.bg;c.fillRect(0,0,this.w,this.h);c.fillStyle=C.wood;c.fillRect(0,0,7,this.h);c.fillRect(this.w-7,0,7,this.h);c.fillStyle=C.woodLight;c.fillRect(7,0,2,this.h);c.fillRect(this.w-9,0,2,this.h);c.strokeStyle='rgba(105,74,38,.09)';c.lineWidth=1;for(let i=0;i<22;i++){const yy=(i*47+13)%this.h;c.beginPath();c.moveTo(14,yy);c.lineTo(26+(i%5)*7,yy+2);c.moveTo(this.w-18,yy+19);c.lineTo(this.w-33-(i%3)*7,yy+18);c.stroke();}const title={home:'西游·八十一难',select:'选一位同行者',chapters:'九九难图',talents:'经脉修行',daily:'每日禅试',codex:'法宝图鉴',settings:'行者设置'}[this.screen]||'西游·八十一难';this.header(title);const stripKey={chapters:'header_chapters',talents:'header_talents',codex:'header_codex',daily:'header_daily'}[this.screen];const stripImg=stripKey?this.uiImages?.[stripKey]:null;const stripH=stripImg&&(stripImg.naturalWidth||stripImg.width)?58:0;const y=this.top+96+stripH;if(stripH){this.tex(stripImg,16,this.top+92,this.w-32,54);this.ctx.fillStyle='rgba(24,17,10,.16)';this.ctx.fillRect(16,this.top+92,this.w-32,54);this.box(16,this.top+92,this.w-32,54,'rgba(0,0,0,0)',C.gold);const div=this.uiImages?.divider;if(div&&(div.naturalWidth||div.width))this.tex(div,16,this.top+146,this.w-32,9);}const paint=()=>{switch(this.screen){case'home':this.home(y);break;case'select':this.select(y);break;case'chapters':this.chapters(y);break;case'talents':this.talents(y);break;case'daily':this.daily(y);break;case'codex':this.codex(y);break;case'settings':this.settings(y);break;}};if(this.screen==='select')paint();else this.withMotion(paint);if(this.screen==='home'){const pw2=(this.w-48)/2,py2=this.top+62;this.box(20,py2,pw2,26,C.panel,C.gold);this.box(28+pw2,py2,pw2,26,C.panel,C.gold);const c2=this.ctx;c2.fillStyle=C.gold;c2.beginPath();c2.arc(36,py2+13,5,0,Math.PI*2);c2.fill();c2.fillStyle=C.jade;c2.beginPath();c2.arc(44+pw2,py2+13,5,0,Math.PI*2);c2.fill();this.text('悟性 '+this.save.talentPoints,48,py2+7,11,C.ink);this.text('经文 '+this.save.scrolls,56+pw2,py2+7,11,C.ink);}const TABS=[['home','行','首页'],['chapters','难','章节'],['talents','修','修行'],['codex','宝','图鉴'],['daily','禅','禅试']];if(TABS.some(t=>t[0]===this.screen)){const ty=this.h-this.bottom-58;c.fillStyle='rgba(245,232,199,.97)';c.fillRect(0,ty,this.w,58);c.fillStyle=C.wood;c.fillRect(0,ty,this.w,3);TABS.forEach((t,i)=>{const tx=i*this.w/5,act=t[0]===this.screen;if(act){c.fillStyle=C.gold;c.fillRect(tx+this.w/10-16,ty+6,32,3);}this.text(t[1],tx+this.w/10,ty+13,17,act?C.gold:C.muted,'center','bold');this.text(t[2],tx+this.w/10,ty+36,10,act?C.ink:C.muted,'center',act?'bold':'');this.buttons.push({x:tx,y:ty,w:this.w/5,h:58,action:()=>this.go(t[0])});});}this.loadingBar();this.drawFx();if(this.admin&&this.adminOpen)this.adminOverlay();if(this.message){this.box(20,this.h-this.bottom-43,this.w-40,33,C.raised,C.gold);this.text(this.message,this.w/2,this.h-this.bottom-34,11,C.ink,'center');}if(this._fadePhase==='out'){const a=Math.min(1,(this.clock()-this._fadeAt)/130);c.fillStyle=`rgba(24,17,10,${(a*.96).toFixed(3)})`;c.fillRect(0,0,this.w,this.h);if(a>=1){this.screen=this._pendingScreen;this.page=0;this._fadePhase='in';this._fadeAt=this.clock();}}else if(this._fadePhase==='in'){const a=1-Math.min(1,(this.clock()-this._fadeAt)/260);if(a<=0.01)this._fadePhase=null;else{c.fillStyle=`rgba(24,17,10,${(a*.96).toFixed(3)})`;c.fillRect(0,0,this.w,this.h);}}this.schedule();}
  // Boot asset progress (playtest, 2026-10-22): one slim bar under the header
  // on every menu screen. While assets stream in it shows the settled count
  // and percentage; failures are counted and named instead of being folded
  // into "complete". Once the startup queue drains, the finished state
  // lingers ~2.5 s (the platform schedules one redraw past that point) and
  // then the bar retires instead of occupying every menu forever.
  bootPage(p){const c=this.ctx;c.fillStyle='#241c14';c.fillRect(0,0,this.w,this.h);const poster=this.uiImages?.poster;if(poster&&(poster.naturalWidth||poster.width)){this.tex(poster,0,0,this.w,this.h,.95);c.fillStyle='rgba(30,22,14,.48)';c.fillRect(0,0,this.w,this.h);}const cx=this.w/2;const logo=this.uiImages?.logo;if(logo&&(logo.naturalWidth||logo.width)){this.box(cx-140,this.h*.155-8,280,102,'rgba(20,14,8,.55)',C.gold);this.tex(logo,cx-132,this.h*.155,264,86);}this.text('玄奘西行录',cx,this.h*.28,13,'#d8b878','center');this.titleText('西游 · 八十一难',cx,this.h*.28+26,33,'center','gold');const bw=this.w-96,bx=48,by=this.h*.66,ratio=p.total?Math.min(1,p.done/p.total):0;this.box(bx,by,bw,14,'#171208','#8b6b3d');c.fillStyle=C.jade;c.fillRect(bx+2,by+2,Math.max(0,(bw-4)*ratio),10);this.text(`载入中 ${Math.floor(ratio*100)}%`,cx,by+24,12,'#e8d5a8','center');const tips=['贴士：巡山遣使会在你离线时替你收集悟性。','贴士：每一章九难全通，可领取章节奖励。','贴士：遁是带无敌的位移，冷却好了别省着。','贴士：法宝在战斗中能升到 Lv.5，先去图鉴看看搭配。','贴士：精英妖物从开局一分多钟起接连现身，奖励丰厚。'];this.text(tips[Math.floor(this.clock()/2800)%tips.length],cx,by+54,11,'rgba(232,213,168,.9)','center');this.text('取经之路 · 正在铺开',cx,this.h-58,10,'rgba(232,213,168,.65)','center');}
  loadingBar(){const p=this.platform.assetProgress?.();if(!p||!p.total)return;const failed=p.failed||0;if(p.complete){this._assetsDoneAt??=this.clock();if(this.clock()-this._assetsDoneAt>2500)return;}const c=this.ctx,y=this.top+68,w=this.w-40,ratio=Math.min(1,p.done/p.total);c.fillStyle='rgba(101,74,49,.25)';c.fillRect(20,y,w,5);c.fillStyle=p.complete?C.jade:C.gold;c.fillRect(20,y,Math.round(w*ratio),5);this.text(p.complete?(failed?`资源加载完成 · ${p.total} 项（${failed} 项失败，已用备用画面）`:`资源加载完成 · ${p.total} 项`):`资源加载中 ${p.done}/${p.total} · ${Math.round(ratio*100)}%${failed?` · ${failed} 项失败`:''}`,20,y+9,10,p.complete?(failed?C.red:C.jade):C.muted);}
  home(y){const w=this.w-40,compact=this.h<720,hh=Math.min(350,compact?220:this.h*.4);this.box(20,y,w,hh,C.raised);const c=this.ctx;
    c.save();c.beginPath();c.rect(23,y+3,w-6,hh-6);c.clip();c.fillStyle='#c1c394';c.fillRect(23,y+3,w-6,hh-6);
    const poster=this.uiImages.poster,posterReady=!!(poster&&(poster.naturalWidth||poster.width));
    if(posterReady){const iw=poster.naturalWidth||poster.width,ih=poster.naturalHeight||poster.height,scale=Math.max((w-6)/iw,(hh-6)/ih);c.drawImage(poster,23+(w-6-iw*scale)/2,y+3+(hh-6-ih*scale)/2,iw*scale,ih*scale);c.fillStyle='rgba(43,36,28,.14)';c.fillRect(23,y+3,w-6,hh-6);}
    else{const scene=this.mapImages.doublefork?.back||this.mapImages.forest?.back;if(scene&&(scene.naturalWidth||scene.width)){const iw=scene.naturalWidth||scene.width,ih=scene.naturalHeight||scene.height,scale=Math.max((w-6)/iw,(hh-6)/ih);c.drawImage(scene,23+(w-6-iw*scale)/2,y+3+(hh-6-ih*scale)/2,iw*scale,ih*scale);c.fillStyle='rgba(247,229,182,.50)';c.fillRect(23,y+3,w-6,hh-6);}else{c.fillStyle='#e9d393';c.beginPath();c.arc(this.w*.78,y+65,45,0,Math.PI*2);c.fill();for(let i=0;i<3;i++){c.fillStyle=['#9ba57a','#748663','#4e6749'][i];c.beginPath();c.moveTo(23,y+hh);c.lineTo(23,y+hh*.64+i*20);c.lineTo(75,y+hh*.39+i*25);c.lineTo(124,y+hh*.66+i*15);c.lineTo(this.w-94,y+hh*.34+i*30);c.lineTo(this.w-23,y+hh*.57+i*27);c.lineTo(this.w-23,y+hh);c.closePath();c.fill();}}
    c.strokeStyle='#dfc389';c.lineWidth=14;c.beginPath();c.moveTo(62,y+hh);c.bezierCurveTo(78,y+hh*.76,137,y+hh*.75,148,y+hh*.49);c.stroke();}
    c.restore();
    if(posterReady){this.box(30,y+16,compact?150:172,compact?76:94,'rgba(43,36,28,.85)',C.gold);this.titleText('一念成佛',42,y+25,compact?24:29,'left','gold');this.titleText('一棒破局',42,y+57,compact?24:29,'left','gold');}
    else{this.box(30,y+16,compact?170:195,compact?84:103,'#f1dfb4',C.wood);this.titleText('一念成佛',42,y+27,compact?26:31,'left','ink');this.titleText('一棒破局',42,y+61,compact?26:31,'left','ink');}
    c.fillStyle=C.red;c.fillRect(this.w-68,y+13,30,39);c.strokeStyle=C.light;c.lineWidth=1;c.strokeRect(this.w-64,y+17,22,31);this.text('西',this.w-53,y+18,12,C.light,'center','bold');this.text('行',this.w-53,y+33,12,C.light,'center','bold');
    if(!posterReady)this.homeHero(this.w*.64,y+hh-(compact?62:94),compact?106:150);this.box(30,y+hh-42,w-20,32,C.panel,C.wood);this.text('四人取经 · 法宝构筑',40,y+hh-33,10,C.ink);this.text('十分钟一难',this.w-40,y+hh-33,10,C.gold,'right');let z=y+hh+(compact?10:16);this.button('踏上西行',20,z,w,compact?46:52,()=>this.go('select'),{primary:true});z+=compact?55:63;const daily=dailyRows(this.save),dailyDone=daily.filter(d=>d.complete).length,dailyClaim=daily.some(d=>d.complete&&!d.claimed)||patrolAccrued(this.save).amount>0;const labels=[['难','九九难图','chapters'],['修','经脉修行','talents'],['禅',`每日禅试 ${dailyDone}/4${dailyClaim?' · 领':''}`,'daily']];const cw=(w-16)/3;labels.forEach((l,i)=>{this.button(l[1],20+i*(cw+8),z,cw,compact?44:50,()=>this.go(l[2]),{size:11});});z+=compact?54:62;this.button('法宝图鉴',20,z,(w-8)/2,42,()=>this.go('codex'));this.button('设置与帮助',24+w/2,z,(w-8)/2,42,()=>this.go('settings'));this.text(`已渡 ${this.save.wins} 难 · 最高 ${this.save.bestScore} 分 · 悟性 ${this.save.talentPoints} · 经文 ${this.save.scrolls}${this.save.lastRun?` · 上局 ${this.save.lastRun.kills} 斩`:''}`,this.w/2,z+55,10,C.muted,'center');}
  select(y){const sel=CHARACTERS.find(c=>c.id===this.characterId)||CHARACTERS[0];const px=20,pw=this.w-40;const fixed=386;const ph=Math.max(240,Math.min(360,this.h-this.bottom-y-fixed));const poster=this.uiImages?.['heroPoster_'+sel.id];this.withPress(px,y,pw,ph,()=>{this.box(px,y,pw,ph,'#2a2019',C.gold);const drew=poster?this.tex(poster,px+3,y+3,pw-6,ph-6,1,.3):false;if(!drew){this.ctx.fillStyle='#3a2c1e';this.ctx.fillRect(px+3,y+3,pw-6,ph-6);this.portrait(sel.id,px+pw/2,y+ph*.4,Math.min(170,ph*.55));}const c=this.ctx;c.fillStyle='rgba(22,15,8,.82)';c.fillRect(px+3,y+ph-67,pw-6,64);c.fillStyle=C.gold;c.fillRect(px+3,y+ph-67,pw-6,2);this.text(sel.name,px+16,y+ph-58,23,'#fff3d7','left','bold');this.text(sel.title,px+17,y+ph-29,11,'#d8b878');this.text(sel.weapon,px+pw-16,y+ph-29,11,'#e8d5a8','right');});this.buttons.push({x:px,y,w:pw,h:ph,label:'下一位同行者',action:()=>{const i=CHARACTERS.findIndex(c=>c.id===sel.id);this.characterId=CHARACTERS[(i+1)%CHARACTERS.length].id;this.draw();}});
  const sy=y+ph+10,mx={hp:Math.max(...CHARACTERS.map(c=>c.stats.hp)),speed:Math.max(...CHARACTERS.map(c=>c.stats.speed)),damage:Math.max(...CHARACTERS.map(c=>c.stats.damage))};[['最大生命','hp',C.red],['移动速度','speed',C.jade],['攻击','damage',C.gold]].forEach(([label,key,col],i)=>{const ry=sy+i*22;this.text(label,px,ry+1,11,C.muted);this.box(px+58,ry+2,pw-118,10,C.line,null);this.ctx.fillStyle=col;this.ctx.fillRect(px+60,ry+4,Math.max(6,(pw-122)*(sel.stats[key]/mx[key])),6);this.text(String(sel.stats[key]),px+pw,ry,12,C.ink,'right','bold');});
  const py=sy+72;this.box(px,py,pw,46,C.panel,C.line);this.text('被动',px+12,py+7,10,C.gold,'left','bold');this.wrap(sel.passive,px+46,py+7,pw-58,11,C.ink,2);
  const ty=py+56,th=66,tw=(pw-18)/4;CHARACTERS.forEach((ch,i)=>{const x=px+i*(tw+6),on=ch.id===sel.id,im=this.uiImages?.['heroPoster_'+ch.id];this.withPress(x,ty,tw,th,()=>{this.box(x,ty,tw,th,on?'#ecd3a0':C.panel,on?C.red:C.line);const drew=im?this.tex(im,x+3,ty+3,tw-6,th-24,1,.1):false;if(!drew)this.portrait(ch.id,x+tw/2,ty+24,40);this.text(ch.name,x+tw/2,ty+th-19,10,on?C.ink:C.muted,'center',on?'bold':'normal');if(on){this.ctx.fillStyle=C.red;this.ctx.fillRect(x+tw-21,ty+5,16,16);this.text('选',x+tw-13,ty+7,9,C.light,'center','bold');}});this.buttons.push({x,y:ty,w:tw,h:th,label:ch.name,action:()=>{this.characterId=ch.id;this.draw();}});});
  const gy=ty+th+10,s=getStage(this.stageId);this.box(px,gy,pw,56);this.text(`第${s.id}难 · ${s.name}`,px+12,gy+8,14,C.gold,'left','bold');this.text(`${s.location} · ${s.boss}`,px+12,gy+31,10,C.muted);const by=gy+62;this.button('‹',px,by,40,40,()=>{this.stageId=Math.max(1,this.stageId-1);this.draw();});this.button('关卡列表',px+48,by,pw-96,40,()=>this.go('chapters'));this.button('›',px+pw-40,by,40,40,()=>{this.stageId=Math.min(this.save.unlockedStage,this.stageId+1);this.draw();});this.button('入山 · 开始十分钟试炼',px,by+48,pw,50,()=>this.startRun(),{primary:true});}
  homeHero(x,y,size){const sheet=this.heroSheet;if(!sheet||!(sheet.width||sheet.naturalWidth))return;const pw=sheet.width/4;const index=Math.max(0,CHARACTERS.findIndex(c=>c.id==='wukong'));this.ctx.drawImage(sheet,index*pw+pw*.04,sheet.height*.1,pw*.92,sheet.height*.77,x-size*.5,y-size*.625,size,size*1.25);}
  chapters(y){const size=this.h<720?6:9,totalPages=Math.ceil(STAGES.length/size),chapter=Math.floor(this.page*size/9),rows=STAGES.slice(this.page*size,this.page*size+size);this.text(`第${chapter+1}章 · ${CHAPTER_NAMES[chapter]}`,20,y,17,C.gold);const chDone=Array.from({length:9},(_,k)=>this.save.records[chapter*9+1+k]?.wins||0).filter(w=>w>0).length,chClaimed=this.save.claimedChapters.includes(chapter),chFull=chapterComplete(this.save,chapter);if(chFull&&!chClaimed){this.tex(this.uiImages.chapter,this.w-192,y-2,34,34);this.button(`领奖 ${chapterReward(chapter).talentPoints} 悟性`,this.w-150,y-5,130,34,()=>{const r=claimChapter(this.save,chapter);this.message=r.message;if(r.ok)this.burst(this.w-85,y+12);this.persist();this.audio.play('level');this.draw();},{size:11});}else this.text(chClaimed?'章节奖励已领取':`本章已通关 ${chDone}/9`,this.w-20,y+3,10,C.muted,'right');rows.forEach((s,i)=>{const ry=y+35+i*49,open=s.id<=this.save.unlockedStage;this.box(20,ry,this.w-40,43,C.panel,this.stageId===s.id?C.gold:C.line);const chip=THEME_CHIPS[s.mapAssetKey==='doublefork'?'doublefork':s.theme]||THEME_CHIPS.forest;this.box(27,ry+6,30,30,chip[0]);this.text(chip[1],42,ry+12,14,'#fff8e6','center','bold');this.text(`${String(s.id).padStart(2,'0')} · ${s.name}`,66,ry+7,13,open?C.ink:C.muted);const rec=this.save.records[s.id];this.text(open?(rec?.bestScore?`${s.location} · 最佳 ${rec.bestScore}${rec.wins?` · 已通关 ${rec.wins} 次`:''}`:s.location):'尚未渡过前难',66,ry+25,9,C.muted);this.text(open?'选择':'锁',this.w-35,ry+14,11,open?C.gold:C.muted,'right');this.buttons.push({x:20,y:ry,w:this.w-40,h:43,disabled:!open,action:()=>{this.stageId=s.id;this.go('select');}});});const by=y+rows.length*49+50;this.button('上一页',20,by,100,44,()=>{this.page=Math.max(0,this.page-1);this.draw();},{disabled:this.page===0});this.text(`${this.page+1} / ${totalPages}`,this.w/2,by+15,12,C.muted,'center');this.button('下一页',this.w-120,by,100,44,()=>{this.page=Math.min(totalPages-1,this.page+1);this.draw();},{disabled:this.page>=totalPages-1});}
  talents(y){this.titleText(`悟性 ${this.save.talentPoints}`,20,y,20,'left','gold');const c=this.ctx,cx0=this.w/2;const pos=TALENTS.map((t,i)=>({x:cx0+(i%2?64:-64),y:y+64+i*72}));c.save();c.lineWidth=3;c.lineCap='round';for(let i=0;i<pos.length-1;i++){const a=pos[i],b=pos[i+1],la=this.save.talents[TALENTS[i].id]||0,lb=this.save.talents[TALENTS[i+1].id]||0;c.strokeStyle=la>0&&lb>0?'#c9962e':'rgba(138,109,72,.45)';c.beginPath();c.moveTo(a.x,a.y);c.quadraticCurveTo(cx0,(a.y+b.y)/2,b.x,b.y);c.stroke();}c.restore();const glyphs={'iron-body':'躯','swift-cloud':'云','sharp-eye':'眼','fortune':'福','warding':'灯','dash-master':'步'};if(!this.talentSel||!TALENTS.some(t=>t.id===this.talentSel))this.talentSel=(TALENTS.find(t=>(this.save.talents[t.id]||0)<t.maxLevel)||TALENTS[0]).id;TALENTS.forEach((t,i)=>{const p=pos[i],lv=this.save.talents[t.id]||0,maxed=lv>=t.maxLevel,sel=t.id===this.talentSel;c.beginPath();c.arc(p.x,p.y,26,0,Math.PI*2);c.fillStyle=maxed?'#c9962e':C.panel;c.fill();c.lineWidth=sel?4:2.5;c.strokeStyle=sel?C.red:(lv>0||maxed)?'#c9962e':C.line;c.stroke();this.text(glyphs[t.id]||t.name[0],p.x,p.y-11,20,maxed?C.light:C.ink,'center','bold');this.text(`${lv}/${t.maxLevel}`,p.x,p.y+34,9,C.muted,'center');this.text(t.name,i%2?p.x+44:p.x-44,p.y-7,12,C.ink,i%2?'left':'right','bold');this.buttons.push({x:p.x-32,y:p.y-32,w:64,h:64,action:()=>{this.talentSel=t.id;this.audio.play('click');this.draw();}});});const t=TALENTS.find(t=>t.id===this.talentSel),lv=this.save.talents[t.id]||0,cost=talentCost(this.save,t.id),sy=this.h-this.bottom-142;this.box(16,sy,this.w-32,80,C.panel,C.gold);this.text(`${t.name} · ${lv}/${t.maxLevel}`,28,sy+10,15,C.ink,'left','bold');this.text(`${TALENT_STATS[t.stat]||t.description} 当前 +${pct(t.value*lv)}${lv>=t.maxLevel?' · 已圆满':` · 下一级 +${pct(t.value)}`}`,28,sy+34,10,C.muted);if(lv<t.maxLevel)this.button(`参悟 · ${cost} 悟性`,this.w-148,sy+40,120,32,()=>{const doBuy=()=>{const r=buyTalent(this.save,t.id);this.message=r.message;this.persist();if(r.ok)this.burst(this.w/2,sy+20);this.audio.play(r.ok?'level':'click');this.draw();};if(this.platform.confirm)this.platform.confirm(`花费 ${cost} 悟性，将「${t.name}」提升至 ${lv+1} 级？`,doBuy);else doBuy();});}
  daily(y){this.wrap('目标按本地日期刷新，奖励每日限领一次。',20,y,this.w-40,12,C.muted,2);const patrol=patrolAccrued(this.save),patrolH=Math.floor(patrol.ms/3600000),patrolM=Math.floor(patrol.ms%3600000/60000);this.box(20,y+30,this.w-40,56,C.panel,C.gold);this.tex(this.uiImages.patrol,26,y+36,44,44);this.text('巡山遣使',78,y+38,14,C.gold,'left','bold');this.text(`已巡 ${patrolH} 小时 ${patrolM} 分 · 悟性 +${patrol.amount}${patrol.capped?'（已攒满 8 小时）':''}`,78,y+60,10,C.muted);this.button(patrol.amount>0?'领取':'攒取中',this.w-116,y+41,84,34,()=>{const r=claimPatrol(this.save);this.message=r.message;if(r.ok){this.persist();this.burst(this.w-74,y+58);}this.audio.play(r.ok?'level':'click');this.draw();},{disabled:patrol.amount<=0,size:12});dailyRows(this.save).forEach((d,i)=>{const ry=y+100+i*110;this.box(20,ry,this.w-40,102);this.text(d.name,32,ry+10,18,C.gold);this.text(`${d.description}  ${d.progress}/${d.target}`,32,ry+38,11,C.muted);this.button(d.claimed?'已领取':d.complete?`领取 ${d.reward} 悟性`:'前往取经',32,ry+58,this.w-64,34,()=>{if(d.complete){const r=claimDaily(this.save,d.id);this.message=r.message;this.persist();if(r.ok)this.burst(this.w/2,ry+75);this.draw();}else this.go('select');},{disabled:d.claimed,size:12});});}
  codex(y){const rows=ARTIFACTS.slice(this.page*4,this.page*4+4);this.text('八件法宝 · 本命武器另占一槽',20,y,12,C.gold);rows.forEach((a,i)=>{const ry=y+31+i*113,seen=this.save.seenArtifacts.includes(a.id);this.box(20,ry,this.w-40,104);if(!seen)this.ctx.globalAlpha=.3;this.skillIcon(a.id,32,ry+12,40);this.ctx.globalAlpha=1;this.text(seen?a.name:'未觉醒法宝',82,ry+10,18,C.ink,'left','bold');this.wrap(seen?a.description:'尚未在战斗中遇见。闯关升级途中择得后，这里会记下它的形貌与妙用。',82,ry+36,this.w-114,11,C.muted,2);this.text(seen?'已觉醒 · 战斗中可升至 Lv.5':'未觉醒 · 战斗升级时择得',82,ry+81,10,C.gold);});this.button('上一页',20,y+493,100,44,()=>{this.page=Math.max(0,this.page-1);this.draw();},{disabled:!this.page});this.button('下一页',this.w-120,y+493,100,44,()=>{this.page=Math.min(Math.ceil(ARTIFACTS.length/4)-1,this.page+1);this.draw();},{disabled:(this.page+1)*4>=ARTIFACTS.length});}
  settings(y){this.button(this.save.muted?'开启声音':'静音全部音效',20,y,this.w-40,48,()=>{this.save.muted=!this.save.muted;this.audio.setMuted(this.save.muted);this.persist();this.draw();});this.button(`画质：${{auto:'自动',high:'精致',low:'省电'}[this.save.quality]}`,20,y+60,this.w-40,48,()=>{const qs=['auto','high','low'];this.save.quality=qs[(qs.indexOf(this.save.quality)+1)%3];this.persist();this.draw();});this.wrap('取经生存法\n拖动任意空白区域移动，法宝自动索敌。拾取妖怪掉落的经验升级，每次三选一。共一把本命武器和四件法宝，各五级。\n每两分钟精英现身，五分钟首领来袭，九分半最终首领登场。十分钟后击败最终首领通关。\n右下“遁”可闪避，五秒冷却。升级与暂停时战斗时间冻结。',20,y+136,this.w-40,13,C.muted,13);this.text('隐私：存档仅保存本机，不收集账号信息。',20,Math.min(this.h-this.bottom-75,y+487),10,C.gold);this.text('v1.0.0 · 西游八十一难',20,Math.min(this.h-this.bottom-49,y+513),10,C.muted);}
  startRun(){this.stopRun();const st=getStage(this.stageId);this.platform.loadMapScene?.(st.mapAssetKey||st.theme);this.screen='game';this.message='';this._runStartedAt=this.clock();this._fadePhase='in';this._fadeAt=this.clock();this.result=null;this.stats={elites:0,dashes:0};this.engine=new GameEngine({characterId:this.characterId,stageId:this.stageId,seed:Date.now(),talents:this.save.talents,debug:this.platform.debug===true,onEvent:e=>this.event(e)});this.renderer=new GameRenderer(this.canvas,{width:this.w,height:this.h,pixelRatio:this.dpr,quality:this.save.quality==='low'?'low':'high',showHud:false,hudScreenBounds:{left:0,right:this.w,top:this.top+135,bottom:this.h-this.bottom-90},heroImages:this.heroImages,skillImages:this.skillImages,skillFxImages:this.skillFxImages,enemyImages:this.enemyImages||{},craterImage:this.craterImage||null,mapImages:this.mapImages||{},battleArtMode:'authoredFrames',battleSceneMode:'vector'});this.audio.startMusic(getStage(this.stageId).theme);this.lastTime=this.clock();this.running=true;this.schedule();this.draw();}
  event(e){if(e.type==='kill'){if(e.enemy?.kind==='elite')this.stats.elites++;this.audio.play('kill');}if(e.type==='dash'){this.stats.dashes++;this.audio.play('dash');}if(e.type==='hit')this.audio.play(e.target==='player'?'hurt':(e.critical?'crit':'hit'));if(e.type==='attack')this.audio.play('attack');if(e.type==='upgrade'&&e.choices)this.audio.play('level');if(e.type==='boss')this.audio.play('boss');if(e.type==='boss-land')this.audio.play('boss');if(e.type==='elite')this.audio.play('elite');if(e.type==='pickup')this.audio.play('pickup');if(e.type==='win'||e.type==='lose'){const prevBest=this.save.bestScore,prevUnlocked=this.save.unlockedStage,prevSeen=new Set(this.save.seenArtifacts),prevDaily=dailyRows(this.save).map(d=>d.progress);this.result=recordRun(this.save,this.engine.state,this.stats);this.resultExtras={newBest:this.result.score>prevBest&&prevBest>0,unlocked:this.save.unlockedStage>prevUnlocked?this.save.unlockedStage:0,newArtifacts:this.save.seenArtifacts.filter(id=>!prevSeen.has(id)).map(id=>ARTIFACTS.find(a=>a.id===id)?.name||id),dailyProgress:dailyRows(this.save).some((d,i)=>d.progress>(prevDaily[i]||0))};this.persist();this.audio.stopMusic();this.audio.play(e.type);}}
  wake(){if(this.hidden||this.disposed)return;if(this.engine?.state.status==='playing'&&!this.running){this.running=true;this.lastTime=this.clock();}this.schedule();}
  // Gameplay and finite UI motion share one owned RAF; static menus go idle.
  schedule(){if(!this.frame&&!this.hidden&&!this.disposed&&(this.running||this.uiAnimation.active||this.press||this.fx))this.frame=this.raf(()=>this.tick());}
  tick(){this.frame=0;if(this.hidden||this.disposed)return;const now=this.clock(),dt=Math.min(.05,Math.max(0,(now-(this.lastTime??now))/1000));this.lastTime=now;const start=this.clock();if(this.engine&&this.renderer)this.engine.setViewRect(this.renderer.viewRect());if(this.running&&this.engine?.state.status==='playing'){const reps=this.adminOpen?0:(this.adminSpeed>=1?this.adminSpeed:(this._slowFlip=!this._slowFlip,this._slowFlip?1:0));for(let i=0;i<reps;i++)this.engine.update(dt,this.input);this.renderDt=dt;}else this.renderDt=0;this.running=!!(this.engine&&this.screen==='game'&&this.engine.state.status==='playing');const mid=this.clock();this.draw();const end=this.clock();this.metrics.frames++;this.metrics.maxUpdateMs=Math.max(this.metrics.maxUpdateMs,mid-start);this.metrics.maxRenderMs=Math.max(this.metrics.maxRenderMs,end-mid);if(end-start>32)this.metrics.slowFrames++;const s=this.engine?.state;if(s){this.metrics.peakEnemies=Math.max(this.metrics.peakEnemies,s.enemies.length);this.metrics.peakProjectiles=Math.max(this.metrics.peakProjectiles,s.projectiles.length);this.metrics.peakEffects=Math.max(this.metrics.peakEffects,s.effects.length);}this.samples.push(end-start);if(this.samples.length>180)this.samples.shift();this.schedule();}
  drawGame(){const s=this.engine.state;this.renderer.render(s,this.renderDt||0);const c=this.ctx;c.setTransform(this.dpr,0,0,this.dpr,0,0);const y=this.top;c.fillStyle='rgba(236,218,174,.96)';c.fillRect(0,0,this.w,y+148);c.fillRect(0,this.h-this.bottom-89,this.w,this.bottom+89);this.tex(this.uiImages.paper,0,0,this.w,y+148,.30);this.tex(this.uiImages.paper,0,this.h-this.bottom-89,this.w,this.bottom+89,.30);c.fillStyle=C.wood;c.fillRect(0,y+146,this.w,3);const xpR=Math.min(1,s.player.xp/s.player.xpNext);c.fillStyle='#2c2115';c.fillRect(0,y,this.w,14);c.fillStyle=C.jade;c.fillRect(0,y,this.w*xpR,14);this.text('经验 '+Math.floor(s.player.xp)+' / '+s.player.xpNext,10,y+2,9,'#fff8e6','left');this.text('Lv.'+s.player.level,this.w-10,y+1,11,'#fff8e6','right','bold');c.fillRect(0,this.h-this.bottom-90,this.w,3);if(this.admin)this.button('管',this.w-104,y+24,40,44,()=>{this.adminOpen=!this.adminOpen;this.draw();});this.button('Ⅱ',this.w-57,y+24,40,44,()=>{if(s.status==='playing')this.engine.pause();this.draw();},{size:16});this.text(`${this.stageId} · ${s.stage.name}`,18,y+27,10,C.gold);this.text(fmt(s.time),18,y+43,21,C.ink);this.text(s.kills+' 击破',100,y+50,11,C.muted);this.box(16,y+79,this.w-32,5,C.line,null);this.box(16,y+79,(this.w-32)*Math.max(0,s.player.hp/s.player.maxHp),5,C.red,null);this.text('生命 '+Math.ceil(s.player.hp)+' / '+s.player.maxHp,18,y+92,9,C.ink);const boss=s.enemies.find(e=>e.kind==='boss');if(boss){this.box(18,y+113,this.w-36,6,C.line,null);this.box(18,y+113,(this.w-36)*boss.hp/boss.maxHp,6,C.gold,null);this.text(boss.name,this.w/2,y+123,12,C.gold,'center');}const by=this.h-this.bottom-65;this.button(s.player.dashCooldown>0?Math.ceil(s.player.dashCooldown)+'s':'遁',this.w-73,by,55,55,()=>{this.engine.useDash(this.input);},{disabled:s.player.dashCooldown>0});const buildY=this.h-this.bottom-66;s.skills.forEach((sk,i)=>{const sx=16+i*51;this.box(sx,buildY,45,28,C.panel,sk.isWeapon?C.gold:C.line);this.skillIcon(sk.id,sx+3,buildY+3,19);this.text(String(sk.level),sx+34,buildY+9,9,C.gold,'center','bold');});if(this.joy){c.strokeStyle='rgba(100,71,39,.5)';c.lineWidth=1;c.beginPath();c.arc(this.joy.x,this.joy.y,38,0,Math.PI*2);c.stroke();c.fillStyle='rgba(192,150,86,.65)';c.beginPath();c.arc(this.joy.x+this.input.x*23,this.joy.y+this.input.y*23,14,0,Math.PI*2);c.fill();}if(s.status==='playing'&&this._runStartedAt){const el=this.clock()-this._runStartedAt,dur=this.reducedMotion?900:1500;if(el>=0&&el<dur){const a=el<200?el/200:(el>dur-400?Math.max(0,(dur-el)/400):1),st=getStage(this.stageId),cy=this.h*.38;c.save();c.globalAlpha=a;c.fillStyle='rgba(24,17,10,.45)';c.fillRect(0,0,this.w,this.h);c.fillStyle='rgba(20,14,8,.88)';c.fillRect(0,cy-60,this.w,124);c.fillStyle=C.gold;c.fillRect(0,cy-60,this.w,2);c.fillRect(0,cy+62,this.w,2);this.text(`第 ${st.id} 难`,this.w/2,cy-46,13,'#d8b878','center');this.text(st.name,this.w/2,cy-24,27,'#fff3d7','center','bold');this.text(`${st.location} · ${st.boss}`,this.w/2,cy+16,11,'#c9b489','center');this.text('存活十分钟 · 击败最终妖王',this.w/2,cy+36,10,'#a68d5f','center');c.restore();}}
if(s.status==='upgrade')this.upgradeOverlay(s);else if(s.status==='paused')this.pauseOverlay();else if(['won','lost'].includes(s.status))this.resultOverlay(s);if(this.admin&&this.adminOpen)this.adminOverlay();if(this._fadePhase==='in'){const a=1-Math.min(1,(this.clock()-this._fadeAt)/260);if(a<=0.01)this._fadePhase=null;else{c.fillStyle=`rgba(24,17,10,${(a*.96).toFixed(3)})`;c.fillRect(0,0,this.w,this.h);}}}
  adminOverlay(){this.shade();const px=16,pw=this.w-32,py=this.top+64,ph=this.h-py-80;this.scrollPanel(py,ph);let y=py+12;this.titleText('管理员 · 测试面板',px+16,y,17,'left','ink');this.button('关闭',px+pw-78,y-4,62,34,()=>{this.adminOpen=false;this.draw();});y+=36;const e=this.engine,inRun=this.screen==='game'&&e;const sec=t=>{this.text(t,px+14,y,10,C.gold,'left','bold');y+=17;};let col=0;const btn=(label,fn)=>{const bw=pw/2-20,bx=px+14+col*(bw+8);this.button(label,bx,y,bw,35,()=>{fn();this.draw();});col+=1;if(col>1){col=0;y+=41;}};const endRow=()=>{if(col){col=0;y+=41;}};
  if(inRun){const s=e.state;this.text(`时间 ${fmt(s.time)} · 击杀 ${s.kills} · 敌人 ${s.enemies.length} · Lv.${s.player.level} · 经验 ${Math.floor(s.player.xp)}/${s.player.xpNext}`,px+14,y,10,C.muted);y+=20;const jump=t=>{for(const m of BALANCE.eliteTimes)if(m<t-1)e.elitesSpawned.add(m);for(const enc of e.stage.eliteEncounters||[])if(enc.at<t-1)e.elitesSpawned.add(enc.at);e.bossSpawned=t>BALANCE.bossTime+1;e.finalBossSpawned=t>BALANCE.finalBossTime+1;e.debug('time',{value:t});};
  sec('时间轴');btn('跳到精英战',()=>{const m=BALANCE.eliteTimes.find(m=>!e.elitesSpawned.has(m));if(m!=null)jump(Math.max(0,m-2));});btn('跳到中Boss',()=>jump(BALANCE.bossTime-2));btn('跳到终Boss',()=>jump(BALANCE.finalBossTime-2));btn('跳到结算前',()=>jump(BALANCE.duration-5));btn('+30 秒',()=>jump(Math.min(BALANCE.duration-1,s.time+30)));btn('-30 秒',()=>jump(Math.max(0,s.time-30)));btn('重开本局',()=>this.startRun());endRow();
  sec('经验与状态');btn('经验 +本级',()=>e.debug('xp',{value:s.player.xpNext}));btn('经验 +5级',()=>e.debug('xp',{value:s.player.xpNext*6}));btn(`无敌 ${e.debugInvincible?'开':'关'}`,()=>e.debug('invincible',{enabled:!e.debugInvincible}));btn(`倍速 ×${this.adminSpeed}`,()=>{this.adminSpeed=this.adminSpeed===1?2:this.adminSpeed===2?4:this.adminSpeed===4?0.5:1;});btn('回满生命',()=>{s.player.hp=s.player.maxHp;});btn('回出生点',()=>{s.player.x=900;s.player.y=1500;});endRow();
  sec('刷怪与清场');btn('刷一波怪',()=>e.debug('spawnWave'));btn('刷精英',()=>e.debug('spawn',{kind:'elite'}));btn('刷中Boss',()=>e.debug('spawnBoss',{final:false}));btn('刷终Boss',()=>e.debug('spawnBoss',{final:true}));btn('清小怪',()=>e.debug('clearField',{}));btn('清精英',()=>e.debug('clearField',{all:true}));btn('杀终Boss',()=>e.debug('killFinal'));endRow();
  sec('快照（时光回退）');btn('存快照',()=>{this.adminSnap=e.debug('snapshot');});btn(this.adminSnap?'读快照':'读快照（无）',()=>{if(this.adminSnap)e.debug('restore',this.adminSnap);});endRow();
  }else{this.text(`悟性 ${this.save.talentPoints} · 经文 ${this.save.scrolls} · 已解锁 ${this.save.unlockedStage} 难`,px+14,y,10,C.muted);y+=20;
  sec('局外资源');btn('悟性 +1000',()=>{this.save.talentPoints+=1000;this.persist();});btn('经文 +10',()=>{this.save.scrolls+=10;this.persist();});btn('解锁全部难',()=>{this.save.unlockedStage=STAGES.length;this.persist();});btn('天赋全满',()=>{for(const t of TALENTS)this.save.talents[t.id]=t.maxLevel;this.persist();});btn('巡山攒满 8h',()=>{this.save.patrolSince=Date.now()-8*3600*1000;this.persist();});btn('重置存档',()=>{this.save=sanitizeSave(null);this.stageId=1;this.persist();});endRow();
  sec('进局测试');btn('开始试炼',()=>{this.adminOpen=false;this.startRun();});endRow();}
  this.text('仅本地 ?admin=1 可见 · 微信端不启用',px+14,py+ph-20,9,C.muted);}
  shade(){const c=this.ctx;c.fillStyle=`rgba(35,30,22,${.35+.3*this.uiAnimation.eased})`;c.fillRect(0,0,this.w,this.h);this.buttons=[];}
  // Cover-fit texture draw for the meta art pack (paper/wood/icons). Returns
  // false when the platform supplied no image, so every call site degrades
  // to the flat vector look on its own.
  tex(img,x,y,w,h,alpha=1,focusY=.5){const c=this.ctx;if(!img||!(img.naturalWidth||img.width))return false;const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height,sc=Math.max(w/iw,h/ih);c.save();c.globalAlpha=alpha;c.beginPath();c.rect(x,y,w,h);c.clip();c.drawImage(img,x+(w-iw*sc)/2,y+(h-ih*sc)*focusY*2,iw*sc,ih*sc);c.restore();return true;}
  // Reward burst: a short gold/vermilion sparkle pop on successful claims
  // and purchases. Purely cosmetic; runs on the shared menu RAF via fx.
  burst(x,y){this.fx={x,y,startedAt:this.clock()};this.schedule();}
  drawFx(){const f=this.fx;if(!f)return;const t=(this.clock()-f.startedAt)/650;if(t>=1){this.fx=null;return;}const c=this.ctx;for(let i=0;i<10;i++){const a=i/10*Math.PI*2+i*1.7,dist=t*(26+(i%3)*10),px=f.x+Math.cos(a)*dist,py=f.y+Math.sin(a)*dist*.6-t*22;c.save();c.globalAlpha=1-t;c.fillStyle=i%2?C.gold:C.red;c.beginPath();c.arc(px,py,2.6*(1-t*.5),0,Math.PI*2);c.fill();c.restore();}this.schedule();}
  scrollPanel(y,h){this.box(16,y,this.w-32,h,C.bg,C.wood);this.tex(this.uiImages.paper,18,y+2,this.w-36,h-4,.45);this.ctx.fillStyle=C.wood;this.ctx.fillRect(12,y-2,this.w-24,7);this.ctx.fillRect(12,y+h-5,this.w-24,7);this.ctx.fillStyle=C.woodLight;this.ctx.fillRect(19,y-1,this.w-38,2);this.ctx.fillRect(19,y+h-4,this.w-38,2);}
  upgradeOverlay(s){this.shade();const y=Math.max(this.top+50,(this.h-470)/2);this.withMotion(()=>{this.scrollPanel(y-20,447);this.text('悟得一法',this.w/2,y,30,C.gold,'center','bold');this.text('本命一槽 · 法宝四槽 · 选一项',this.w/2,y+43,11,C.muted,'center');});s.choices.forEach((ch,i)=>{const ry=y+82+i*111;this.withMotion(()=>this.withPress(20,ry,this.w-40,99,()=>{this.box(20,ry,this.w-40,99,C.panel,ch.isWeapon?C.red:C.line);this.ctx.fillStyle=ch.isWeapon?C.red:C.jade;this.ctx.fillRect(27,ry+13,3,24);this.skillIcon(ch.id,34,ry+12,30);this.text(ch.name,72,ry+11,18,C.ink,'left','bold');this.text(ch.isWeapon?'本命武器':'法宝',this.w-33,ry+13,10,C.muted,'right');this.wrap(ch.description,72,ry+37,this.w-104,11,C.muted,2);this.text(`将升至 Lv.${ch.level}`,72,ry+77,10,C.gold);}),i,ry+50);this.buttons.push({x:20,y:ry,w:this.w-40,h:99,label:ch.name,action:()=>{this.engine.chooseUpgrade(ch.id);this.input={x:0,y:0};this.audio.play('click');this.wake();this.draw();}});});}
  pauseOverlay(){this.shade();const y=this.h/2-150;this.withMotion(()=>{this.scrollPanel(y-30,272);this.text('且歇片刻',this.w/2,y,32,C.gold,'center','bold');this.button('继续西行',30,y+65,this.w-60,50,()=>{this.engine.resume();this.audio.startMusic(getStage(this.stageId).theme);this.wake();this.draw();},{primary:true});this.button(`声音设置 · ${this.save.muted?'已静音':'已开启'}`,30,y+125,this.w-60,46,()=>{this.save.muted=!this.save.muted;this.audio.setMuted(this.save.muted);this.persist();if(!this.save.muted)this.audio.play('click');this.draw();});this.button('退出本局',30,y+181,this.w-60,48,()=>{this.platform.confirm?.('结束本局？本局不会结算，悟性、每日进度和图鉴登记都不会计入。',()=>this.go('home'))||(!this.platform.confirm&&this.go('home'));});});}
  resultOverlay(s){this.shade();const y=this.h/2-180,won=s.status==='won';this.withMotion(()=>{this.scrollPanel(y-30,348);this.text(won?'此难已破':'暂渡未成',this.w/2,y,34,won?C.gold:C.red,'center','bold');this.text(`${s.stage.location} · ${s.character.name}`,this.w/2,y+49,12,C.muted,'center');this.ctx.strokeStyle=C.woodLight;this.ctx.lineWidth=1;this.ctx.beginPath();this.ctx.moveTo(47,y+75);this.ctx.lineTo(this.w-47,y+75);this.ctx.stroke();this.text(`斩妖 ${s.kills} · 等级 ${s.player.level} · 用时 ${fmt(s.time)} · 得分 ${this.result?.score||0}`,this.w/2,y+88,13,C.ink,'center');this.text(`悟性 +${this.result?.reward||0}`,this.w/2,y+122,20,C.gold,'center');const ex=this.resultExtras,exParts=[];if(ex){if(ex.newBest)exParts.push('新纪录！');if(ex.unlocked)exParts.push(`解锁第 ${ex.unlocked} 难`);if(ex.newArtifacts?.length)exParts.push(`新图鉴 · ${ex.newArtifacts.join('、')}`);if(ex.dailyProgress)exParts.push('每日禅试有新进展');}if(exParts.length)this.text(exParts.join('  '),this.w/2,y+152,11,C.jade,'center');this.button(won&&s.stage.id<81?'再闯下一难':'再试一次',30,y+178,this.w-60,50,()=>{if(won)this.stageId=Math.min(81,s.stage.id+1);this.startRun();},{primary:true});this.button('回到大唐',30,y+240,this.w-60,48,()=>this.go('home'));});}
  touchStart(x,y){if(this.hidden||this.disposed)return;const b=this.buttons.slice().reverse().find(b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h);if(b){if(!b.disabled){this.press={x:b.x,y:b.y,w:b.w,h:b.h,key:this.motionKey(),startedAt:this.clock()};this.audio.play('click');b.action();this.draw();}return;}if(this.screen==='game'&&this.engine?.state.status==='playing'){this.touchOrigin={x,y};this.joy={x,y};}}
  touchMove(x,y){if(!this.touchOrigin)return;const dx=x-this.touchOrigin.x,dy=y-this.touchOrigin.y,length=Math.hypot(dx,dy);this.input={x:dx/Math.max(40,length),y:dy/Math.max(40,length)};}
  touchEnd(){this.touchOrigin=null;this.joy=null;this.input={x:0,y:0};}
  onHide(){this.hidden=true;if(this.engine?.state.status==='playing'){this.engine.pause();this.autoPaused=true;}this.running=false;this.cancel(this.frame);this.frame=0;this.uiAnimation.active=false;this.press=null;this.touchEnd();this.audio.stopMusic();this.persist();}
  onShow(){if(this.disposed)return;this.hidden=false;this.cancel(this.frame);this.frame=0;this.lastTime=this.clock();const paused=this.screen==='game'&&this.engine?.state.status==='paused';if(this.screen==='game'&&this.engine&&this.engine.state.status==='playing')this.running=true;if(paused){this.uiAnimation.key=this.motionKey();this.uiAnimation.active=false;this.uiAnimation.progress=1;this.uiAnimation.eased=1;}this.draw();}
  stopRun(){this.running=false;this.cancel(this.frame);this.frame=0;this.uiAnimation.active=false;this.press=null;this.engine?.dispose();this.renderer?.dispose();this.engine=null;this.renderer=null;this.audio.stopMusic();this.touchEnd();}
  getMetrics(){const sorted=this.samples.slice().sort((a,b)=>a-b);return {...this.metrics,p95WorkMs:sorted[Math.floor(sorted.length*.95)]||0,running:this.running,canvasCount:1,uiMotion:this.getUIMotionState()};}
  dispose(){this.disposed=true;this.stopRun();this.persist();this.audio.dispose();this.buttons=[];}
}

Object.assign(module.exports,{NativeGame});

}
};
const cache={};function requireCore(id){if(cache[id])return cache[id].exports;if(!factories[id])throw new Error("Missing core module "+id);const m={exports:{}};cache[id]=m;factories[id](m,m.exports,requireCore);return m.exports;}
module.exports=Object.assign({},...["content","tiger-animation","bear-animation","bull-animation","wolf-animation","monkey-animation","deer-animation","hawk-animation","snake-animation","boss-animation","skill-fx-animation","scene-collision","battle-enemy-animation","engine","renderer","progression","native-ui"].map(requireCore));
