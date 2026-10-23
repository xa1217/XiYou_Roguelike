/**
 * Static game data for 西游·八十一难.
 *
 * The simulation only consumes plain objects from this module.  Keeping the
 * data here makes balancing a content change rather than a code change and
 * lets the mini-program pre-load it without a DOM or network request.
 */

export const BALANCE = Object.freeze({
  duration: 600,
  eliteTimes: Object.freeze([120, 240, 360, 480]),
  bossTime: 300,
  finalBossTime: 570,
  maxEnemies: 220,
  maxProjectiles: 300,
  maxEffects: 160,
  maxGems: 240,
  worldSize: 1800,
  playerRadius: 18,
});

export const CHARACTERS = [
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

export const ARTIFACTS = [
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

export const STAGES = stageSeeds.map((entry, index) => {
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

export const TALENTS = [
  { id: 'iron-body', name: '金刚之躯', description: '提升最大生命。', maxLevel: 10, baseCost: 80, stat: 'maxHp', value: 0.035 },
  { id: 'swift-cloud', name: '筋斗云', description: '提升移动速度。', maxLevel: 10, baseCost: 80, stat: 'speed', value: 0.025 },
  { id: 'sharp-eye', name: '火眼金睛', description: '提升所有伤害。', maxLevel: 10, baseCost: 120, stat: 'damage', value: 0.03 },
  { id: 'fortune', name: '福缘', description: '提升经验与金币掉落。', maxLevel: 10, baseCost: 100, stat: 'pickup', value: 0.04 },
  { id: 'warding', name: '护法心灯', description: '减少受到的伤害。', maxLevel: 10, baseCost: 100, stat: 'damageReduction', value: 0.025 },
  { id: 'dash-master', name: '踏云步', description: '缩短闪避冷却。', maxLevel: 8, baseCost: 140, stat: 'dashCooldown', value: 0.045 },
];

export const DAILY_CHALLENGES = [
  { id: 'daily-kills', name: '百妖除尽', description: '单局击败 300 名妖怪。', target: 300, reward: 120 },
  { id: 'daily-elite', name: '降伏精怪', description: '单局击败 3 名精英。', target: 3, reward: 150 },
  { id: 'daily-no-dash', name: '稳如金刚', description: '不使用闪避通关一难。', target: 1, reward: 220 },
  { id: 'daily-stage', name: '西行一程', description: '完成任意一难。', target: 1, reward: 100 },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

export function getStage(index) {
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

export function getWeaponStats(characterId, level = 1) {
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

export function getArtifactStats(id, level = 1) {
  const list = artifactTuning[id] || artifactTuning[ARTIFACTS[0].id];
  return clone(list[Math.max(1, Math.min(5, Number(level) || 1)) - 1]);
}

