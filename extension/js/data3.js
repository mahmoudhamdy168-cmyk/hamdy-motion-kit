/* HAMDY Motion Kit v0.5 — filters (looks), video FX, audio FX, text styles, CapCut-style text animations
   Ops: {mn: effect match name, n: short name, p: {paramIndex: value}}  value = number | [r,g,b] color
   Every name here is an original HAMDY preset. */
(function(D){
function add(list, items){ items.forEach(function(x){ list.push(x); }); }
function CB(sr,sg,sb, mr,mg,mb, hr,hg,hb){ return {mn:'ADBE Color Balance 2', n:'Color Balance', p:{1:sr,2:sg,3:sb,4:mr,5:mg,6:mb,7:hr,8:hg,9:hb,10:1}}; }
function VIB(v,s){ return {mn:'ADBE Vibrance', n:'Vibrance', p:{1:v,2:s||0}}; }
function BC(b,c){ return {mn:'ADBE Brightness & Contrast 2', n:'Brightness & Contrast', p:{1:b,2:c}}; }
function NOISE(a){ return {mn:'ADBE Noise', n:'Grain', p:{1:a}}; }
function VIG(a){ return {mn:'CS Vignette', n:'Vignette', p:{1:a}}; }
function BW(){ return {mn:'ADBE Black&White', n:'Black & White', p:{}}; }
function TINT(b,w,a){ return {mn:'ADBE Tint', n:'Tint', p:{1:b,2:w,3:a}}; }
function TRI(h,m,s,blend){ return {mn:'ADBE Tritone', n:'Tritone', p:{1:h,2:m,3:s,4:blend}}; }
function GLOW(th,r,i){ return {mn:'ADBE Glo2', n:'Glow', p:{2:th,3:r,4:i}}; }
function BLUR(b){ return {mn:'ADBE Gaussian Blur 2', n:'Blur', p:{1:b,3:1}}; }
function SHARP(a,r){ return {mn:'ADBE Unsharp Mask2', n:'Sharpen', p:{1:a,2:r||1}}; }
function POST(l){ return {mn:'ADBE Posterize', n:'Posterize', p:{1:l}}; }
function PTIME(f){ return {mn:'ADBE Posterize Time', n:'Posterize Time', p:{1:f}}; }
function WAVE(h,w,s){ return {mn:'ADBE Wave Warp', n:'Wave Warp', p:{2:h,3:w,4:0,5:s}}; }

/* ------------------------------------------------------------- looks */
// pv = CSS preview approximation: f (filter), ov (overlay css), b (overlay blend), vig, grain, scan
D.LOOKS = [
  {id:'golden',   ar:'ساعة ذهبية',   en:'Golden Hour',   g:'دافي',   ops:[CB(0,0,-10, 20,3,-20, 10,5,-10), VIB(25)], pv:{f:'sepia(.25) saturate(1.35) hue-rotate(-8deg) brightness(1.05)', ov:'rgba(255,170,60,.22)', b:'soft-light'}},
  {id:'sunset',   ar:'غروب',         en:'Sunset',        g:'دافي',   ops:[CB(5,0,-5, 15,0,-15, 30,5,-25), BC(0,10)], pv:{f:'sepia(.3) saturate(1.45) hue-rotate(-15deg) contrast(1.1)', ov:'rgba(255,90,60,.25)', b:'soft-light'}},
  {id:'peach',    ar:'خوخي',         en:'Peach',         g:'دافي',   ops:[CB(0,0,0, 8,2,0, 15,5,0), VIB(-5,-10), BC(8,-10)], pv:{f:'saturate(.9) brightness(1.08) contrast(.92) sepia(.15)', ov:'rgba(255,150,150,.18)', b:'soft-light'}},
  {id:'autumn',   ar:'خريف',         en:'Autumn',        g:'دافي',   ops:[CB(0,0,-10, 25,5,-30, 10,0,-10), VIB(10,10)], pv:{f:'sepia(.35) saturate(1.3) hue-rotate(-12deg)'}},
  {id:'warmFilm', ar:'فيلم دافي',    en:'Warm Film',     g:'دافي',   ops:[CB(5,0,-5, 15,5,-10, 10,5,-10), BC(0,-5), NOISE(8)], pv:{f:'sepia(.3) saturate(1.1) contrast(.95)', grain:1}},
  {id:'bronze',   ar:'برونز',        en:'Bronze',        g:'دافي',   ops:[TRI([1,.9,.75],[.7,.45,.25],[.12,.07,.03],30)], pv:{f:'sepia(.6) saturate(1.1) contrast(1.05)'}},

  {id:'coolBlue', ar:'أزرق بارد',    en:'Cool Blue',     g:'بارد',   ops:[CB(0,0,10, -10,0,25, 0,0,10)], pv:{f:'hue-rotate(10deg) saturate(1.1)', ov:'rgba(60,140,255,.2)', b:'soft-light'}},
  {id:'winter',   ar:'شتا',          en:'Winter',        g:'بارد',   ops:[CB(0,0,20, -5,0,15, 0,0,5), VIB(0,-25), BC(10,0)], pv:{f:'saturate(.7) brightness(1.1) hue-rotate(15deg) contrast(.95)', ov:'rgba(180,220,255,.2)', b:'soft-light'}},
  {id:'lagoon',   ar:'لاجون',        en:'Lagoon',        g:'بارد',   ops:[CB(0,5,15, -15,10,20, 0,5,5), VIB(30)], pv:{f:'hue-rotate(20deg) saturate(1.3)'}},
  {id:'midnight', ar:'نص الليل',     en:'Midnight',      g:'بارد',   ops:[BC(-20,15), CB(0,0,30, 0,0,15, 0,0,0)], pv:{f:'brightness(.75) contrast(1.15) hue-rotate(15deg) saturate(.9)', ov:'rgba(20,40,120,.3)', b:'multiply'}},
  {id:'matcha',   ar:'ماتشا',        en:'Matcha',        g:'بارد',   ops:[CB(0,10,0, -5,20,-5, 0,5,0), VIB(0,-10)], pv:{f:'saturate(.9)', ov:'rgba(120,200,90,.22)', b:'soft-light'}},

  {id:'tealOrange',ar:'تيل وأورانج', en:'Teal & Orange', g:'سينمائي', ops:[CB(-25,5,30, 0,0,0, 25,5,-20), BC(0,12), VIB(15)], pv:{f:'contrast(1.12) saturate(1.2)', ov:'linear-gradient(180deg, rgba(255,150,70,.25), rgba(0,140,160,.3))', b:'soft-light'}},
  {id:'moody',    ar:'مودي',         en:'Moody',         g:'سينمائي', ops:[BC(-10,20), VIB(0,-30), CB(0,0,15, 0,0,0, 0,0,0), VIG(40)], pv:{f:'brightness(.88) contrast(1.2) saturate(.7)', vig:.5}},
  {id:'blockbuster',ar:'بلوك باستر', en:'Blockbuster',   g:'سينمائي', ops:[CB(0,10,20, 0,0,0, 15,5,-5), BC(0,18), VIG(40)], pv:{f:'contrast(1.2) saturate(1.1)', ov:'linear-gradient(180deg, rgba(255,170,90,.18), rgba(0,90,140,.28))', b:'soft-light', vig:.45}},
  {id:'bleach',   ar:'بليتش',        en:'Bleach Bypass', g:'سينمائي', ops:[VIB(0,-45), BC(0,30)], pv:{f:'saturate(.5) contrast(1.3)'}},
  {id:'fadedFilm',ar:'فيلم باهت',    en:'Faded Film',    g:'سينمائي', ops:[BC(10,-20), CB(5,0,10, 0,0,0, 0,0,0), VIB(0,-20), NOISE(10)], pv:{f:'contrast(.8) brightness(1.08) saturate(.8)', grain:1}},
  {id:'cyberpunk',ar:'سايبر بانك',   en:'Cyberpunk',     g:'سينمائي', ops:[CB(20,0,40, 0,0,0, 30,0,25), VIB(40), BC(0,15)], pv:{f:'hue-rotate(-20deg) saturate(1.6) contrast(1.15)', ov:'linear-gradient(135deg, rgba(255,0,160,.25), rgba(0,220,255,.25))', b:'screen'}},
  {id:'dramatic', ar:'درامي',        en:'Dramatic',      g:'سينمائي', ops:[BC(0,35), VIB(0,-15), VIG(60)], pv:{f:'contrast(1.35) saturate(.85)', vig:.6}},
  {id:'halation', ar:'هالة ضوء',     en:'Halation',      g:'سينمائي', ops:[GLOW(70,60,0.6), CB(0,0,0, 0,0,0, 15,0,-5)], pv:{f:'brightness(1.05) contrast(1.05)', ov:'radial-gradient(60% 50% at 70% 30%, rgba(255,120,80,.35), transparent 70%)', b:'screen'}},

  {id:'mono',     ar:'أبيض وأسود',   en:'Mono',          g:'أبيض وأسود', ops:[BW()], pv:{f:'grayscale(1)'}},
  {id:'noir',     ar:'نوار',         en:'Noir',          g:'أبيض وأسود', ops:[BW(), BC(-10,40), VIG(60)], pv:{f:'grayscale(1) contrast(1.45) brightness(.9)', vig:.6}},
  {id:'silver',   ar:'فضي',          en:'Silver',        g:'أبيض وأسود', ops:[BW(), BC(10,-10), TINT([.05,.06,.08],[.95,.97,1],100)], pv:{f:'grayscale(1) brightness(1.1) contrast(.9)'}},
  {id:'sepia',    ar:'سيبيا',        en:'Sepia',         g:'أبيض وأسود', ops:[TINT([.15,.08,.03],[1,.92,.78],100)], pv:{f:'sepia(1)'}},
  {id:'highMono', ar:'أبيض وأسود حاد',en:'High Contrast Mono',g:'أبيض وأسود', ops:[BW(), BC(0,60)], pv:{f:'grayscale(1) contrast(1.7)'}},
  {id:'keepRed',  ar:'سيب الأحمر',   en:'Keep Red',      g:'أبيض وأسود', ops:[{mn:'ADBE Leave Color', n:'Leave Color', p:{1:100, 2:[.85,.12,.12], 3:25}}], pv:{f:'grayscale(.85)'}},

  {id:'vintage',  ar:'فينتدج',       en:'Vintage',       g:'ريترو',  ops:[CB(0,0,0, 15,0,-10, 0,0,0), VIB(0,-25), BC(0,-10), NOISE(12), VIG(40)], pv:{f:'sepia(.4) saturate(.8) contrast(.9)', grain:1, vig:.4}},
  {id:'polaroid', ar:'بولارويد',     en:'Polaroid',      g:'ريترو',  ops:[CB(0,10,15, 0,0,0, 10,10,-5), BC(8,-15)], pv:{f:'contrast(.85) brightness(1.08) saturate(.9)', ov:'rgba(120,220,200,.15)', b:'soft-light'}},
  {id:'retro70',  ar:'ريترو 70',     en:'Retro 70s',     g:'ريترو',  ops:[TRI([1,.93,.75],[.75,.45,.25],[.15,.1,.15],45), NOISE(10)], pv:{f:'sepia(.5) saturate(1.4) hue-rotate(-10deg)', grain:1}},
  {id:'super8',   ar:'سوبر 8',       en:'Super 8',       g:'ريترو',  ops:[CB(0,0,-5, 15,5,-10, 0,0,0), NOISE(25), BLUR(1.5), VIG(60), PTIME(18)], pv:{f:'sepia(.35) blur(.6px) saturate(1.1)', grain:1, vig:.6}},
  {id:'vhs',      ar:'VHS',          en:'VHS',           g:'ريترو',  ops:[CB(0,0,10, 10,0,10, 0,0,0), VIB(0,20), NOISE(18), WAVE(2,600,2), BLUR(1.2), BC(0,-10)], pv:{f:'saturate(1.3) blur(.5px) contrast(.92)', grain:1, scan:1}},
  {id:'lofi',     ar:'لو-فاي',       en:'Lo-Fi',         g:'ريترو',  ops:[POST(7), NOISE(10), VIB(0,-15)], pv:{f:'contrast(1.1) saturate(.85)', grain:1}},
  {id:'vaporwave',ar:'فيبورويف',     en:'Vaporwave',     g:'ريترو',  ops:[CB(30,0,40, 0,0,0, 20,0,30), VIB(40)], pv:{f:'hue-rotate(-40deg) saturate(1.5)', ov:'linear-gradient(180deg, rgba(255,80,200,.3), rgba(60,220,255,.3))', b:'soft-light'}},

  {id:'vivid',    ar:'حيوي',         en:'Vivid',         g:'حيوي',   ops:[VIB(50,15), BC(0,10)], pv:{f:'saturate(1.6) contrast(1.1)'}},
  {id:'pop',      ar:'بوب',          en:'Pop',           g:'حيوي',   ops:[VIB(30,30), BC(5,20)], pv:{f:'saturate(1.8) contrast(1.2) brightness(1.05)'}},
  {id:'natural',  ar:'طبيعي محسّن',  en:'Natural+',      g:'حيوي',   ops:[VIB(15), SHARP(30)], pv:{f:'saturate(1.15) contrast(1.03)'}},
  {id:'fresh',    ar:'فريش',         en:'Fresh',         g:'حيوي',   ops:[VIB(25), CB(0,0,0, 0,0,0, 0,5,5), BC(8,0)], pv:{f:'saturate(1.3) brightness(1.08)'}},
  {id:'hdr',      ar:'HDR',          en:'HDR',           g:'حيوي',   ops:[SHARP(80,30), VIB(30), BC(0,15)], pv:{f:'contrast(1.25) saturate(1.35)'}},
  {id:'dreamy',   ar:'حالم',         en:'Dreamy',        g:'حيوي',   ops:[GLOW(55,80,0.5), BC(8,0), VIB(0,-10)], pv:{f:'brightness(1.1) blur(.4px) saturate(.9)', ov:'rgba(255,255,255,.18)', b:'screen'}},
  {id:'neonNight',ar:'نيون الليل',   en:'Neon Night',    g:'حيوي',   ops:[VIB(50), CB(15,0,25, 0,0,0, 0,0,0), BC(0,20)], pv:{f:'saturate(1.7) hue-rotate(-15deg) contrast(1.2)'}}
];

/* ----------------------------------------------------------- video FX */
D.VFX = [
  {id:'rain',      ar:'مطر',             en:'Rain',            g:'جو',      ops:[{mn:'CSRainfall', n:'Rain', p:{}}], pv:{rain:1}},
  {id:'snow',      ar:'تلج',             en:'Snow',            g:'جو',      ops:[{mn:'CSSnowfall', n:'Snow', p:{}}], pv:{snow:1}},
  {id:'dust',      ar:'غبار طاير',       en:'Flying Dust',     g:'جو',      ops:[{mn:'CC Star Burst', n:'Dust', p:{}}], pv:{dust:1}},
  {id:'lightRays', ar:'أشعة ضوء',        en:'Light Rays',      g:'جو',      ops:[{mn:'CC Light Rays', n:'Light Rays', p:{}}], pv:{ov:'radial-gradient(40% 40% at 50% 40%, rgba(255,255,230,.55), transparent 70%)', b:'screen'}},
  {id:'grainFX',   ar:'جرين',            en:'Film Grain',      g:'ملمس',    ops:[NOISE(20)], pv:{grain:1}},
  {id:'vignetteFX',ar:'فينييت',          en:'Vignette',        g:'ملمس',    ops:[VIG(60)], pv:{vig:.6}},
  {id:'softBlur',  ar:'بلور ناعم',       en:'Soft Blur',       g:'ملمس',    ops:[BLUR(8)], pv:{f:'blur(1.5px)'}},
  {id:'sharpenFX', ar:'شارب',            en:'Sharpen',         g:'ملمس',    ops:[SHARP(60,2)], pv:{f:'contrast(1.08)'}},
  {id:'dreamGlow', ar:'توهج',            en:'Glow',            g:'ملمس',    ops:[GLOW(50,100,1)], pv:{f:'brightness(1.12)', ov:'rgba(255,255,255,.22)', b:'screen'}},
  {id:'trails',    ar:'ذيل حركة',        en:'Motion Trails',   g:'حركة',    ops:[{mn:'ADBE Echo', n:'Trails', p:{1:-0.033, 2:6, 3:1, 4:0.6}}], pv:{trail:1}},
  {id:'stopMotion',ar:'ستوب موشن',       en:'Stop Motion 8fps',g:'حركة',    ops:[PTIME(8)], pv:{step:8}},
  {id:'stop12',    ar:'متقطع 12',        en:'Choppy 12fps',    g:'حركة',    ops:[PTIME(12)], pv:{step:12}},
  {id:'wobble',    ar:'تموّج مستمر',     en:'Wobble',          g:'حركة',    ops:[WAVE(8,120,1)], pv:{f:'url(#nabdWarp1)'}},
  {id:'camShake',  ar:'هزّة كاميرا مستمرة',en:'Camera Shake',   g:'حركة',    ops:[{mn:'ADBE Geometry2', n:'Shake', p:{4:108}, ex:{2:'wiggle(6, thisComp.height * 0.012)', 8:'wiggle(3, 0.8)'}}], pv:{shake:1}},
  {id:'zoomPulse', ar:'نبض زووم',        en:'Zoom Pulse',      g:'حركة',    ops:[{mn:'ADBE Geometry2', n:'Pulse', p:{}, ex:{4:'value + Math.abs(Math.sin(time * Math.PI * 2)) * 4'}}], pv:{pulse:1}},
  {id:'cartoon',   ar:'كارتون',          en:'Cartoon',         g:'فني',     ops:[{mn:'ADBE Cartoonify', n:'Cartoon', p:{}}], pv:{f:'contrast(1.3) saturate(1.4) url(#nabdPx1)'}},
  {id:'sketch',    ar:'اسكتش',           en:'Sketch',          g:'فني',     ops:[{mn:'ADBE Find Edges', n:'Edges', p:{}}, BW()], pv:{f:'grayscale(1) invert(1) contrast(2.2) brightness(1.2)'}},
  {id:'dotsFX',    ar:'نقط',             en:'Dots',            g:'فني',     ops:[{mn:'CC Ball Action', n:'Dots', p:{}}], pv:{f:'url(#nabdPx2) saturate(1.2)'}},
  {id:'mosaicFX',  ar:'موزاييك',         en:'Mosaic',          g:'فني',     ops:[{mn:'ADBE Mosaic', n:'Mosaic', p:{1:60, 2:34, 3:1}}], pv:{f:'url(#nabdPx3)'}},
  {id:'posterFX',  ar:'بوستر',           en:'Posterize',       g:'فني',     ops:[POST(4)], pv:{f:'contrast(1.4) saturate(1.3)'}},
  {id:'strobeFX',  ar:'ستروب',           en:'Strobe Light',    g:'فني',     ops:[{mn:'ADBE Strobe', n:'Strobe', p:{}}], pv:{strobe:1}}
];

/* ----------------------------------------------------------- audio FX */
function HILO(type, freq){ return {mn:'ADBE Aud HiLo', n:type===1?'High Pass':'Low Pass', p:{1:type, 2:freq}}; }
D.AFX = [
  {id:'telephone', ar:'تليفون',          en:'Telephone',   g:'صوت', ops:[HILO(1,400), HILO(2,3200)]},
  {id:'radio',     ar:'راديو',           en:'Radio',       g:'صوت', ops:[HILO(1,250), HILO(2,5000), {mn:'ADBE Aud BT', n:'Bass & Treble', p:{1:-20, 2:20}}]},
  {id:'underwater',ar:'تحت المايه',      en:'Underwater',  g:'صوت', ops:[HILO(2,450)]},
  {id:'muffled',   ar:'ورا الحيطة',      en:'Muffled',     g:'صوت', ops:[HILO(2,900)]},
  {id:'echoA',     ar:'صدى',             en:'Echo',        g:'صوت', ops:[{mn:'ADBE Aud Delay', n:'Echo', p:{1:300, 2:45, 3:35}}]},
  {id:'hall',      ar:'قاعة كبيرة',      en:'Hall Reverb', g:'صوت', ops:[{mn:'ADBE Aud Reverb', n:'Reverb', p:{1:1500, 2:70, 3:60, 4:40, 5:85, 6:25}}]},
  {id:'bassBoost', ar:'باس زيادة',       en:'Bass Boost',  g:'صوت', ops:[{mn:'ADBE Aud BT', n:'Bass Boost', p:{1:40, 2:0}}]},
  {id:'treble',    ar:'صوت أوضح',        en:'Bright Voice',g:'صوت', ops:[{mn:'ADBE Aud BT', n:'Treble', p:{1:-5, 2:35}}, HILO(1,90)]},
  {id:'robot',     ar:'روبوت',           en:'Robot',       g:'صوت', ops:[{mn:'ADBE Aud Modulator', n:'Robot', p:{2:30, 3:80, 4:60}}]},
  {id:'chorus',    ar:'كورس',            en:'Chorus',      g:'صوت', ops:[{mn:'ADBE Aud_Flange', n:'Chorus', p:{}}]},
  {id:'backwards', ar:'بالعكس',          en:'Backwards',   g:'صوت', ops:[{mn:'ADBE Aud Reverse', n:'Reverse', p:{}}]}
];
D.FILTERS = D.LOOKS.map(function(x){ x.kind='look'; return x; }).concat(D.VFX.map(function(x){ x.kind='vfx'; return x; }), D.AFX.map(function(x){ x.kind='afx'; return x; }));

/* --------------------------------------------------------- text styles */
// fill/stroke colors: '#hex' | 'acc' | null ; sizes are px for a 110px font
D.TSTYLES = [
  {id:'classic',   ar:'كلاسيك',         en:'Classic',        g:'كلاسيك', fill:'#ffffff', shadow:{c:'#000000', op:60, d:4, s:10}},
  {id:'whiteOut',  ar:'أبيض بإطار',     en:'White Outline',  g:'كلاسيك', fill:'#ffffff', stroke:'#000000', sw:10},
  {id:'yellowCap', ar:'أصفر كابشن',     en:'Yellow Caption', g:'كلاسيك', fill:'#ffe600', stroke:'#000000', sw:9},
  {id:'darkText',  ar:'أسود',           en:'Dark',           g:'كلاسيك', fill:'#111111', shadow:{c:'#ffffff', op:40, d:2, s:6}},
  {id:'outlineOnly',ar:'إطار بس',       en:'Outline Only',   g:'كلاسيك', fill:null, stroke:'#ffffff', sw:4},
  {id:'outlineAcc',ar:'إطار بلونك',     en:'Accent Outline', g:'كلاسيك', fill:null, stroke:'acc', sw:5},
  {id:'longShadow',ar:'ظل طويل',        en:'Long Shadow',    g:'كلاسيك', fill:'#ffffff', shadow:{c:'#000000', op:60, d:18, s:2}},
  {id:'cineSpaced',ar:'سينمائي واسع',   en:'Cinematic',      g:'سينمائي', fill:'#ffffff', trk:300, caps:true, shadow:{c:'#000000', op:50, d:0, s:20}},
  {id:'softGlow',  ar:'توهج ناعم',      en:'Soft Glow',      g:'سينمائي', fill:'#ffffff', glow:{th:40, r:40, i:0.6}},
  {id:'goldGrad',  ar:'ذهبي',           en:'Gold',           g:'سينمائي', grad:['#fff0b3','#c8901f'], bevel:{t:3}, shadow:{c:'#000000', op:50, d:4, s:8}},
  {id:'chrome',    ar:'كروم',           en:'Chrome',         g:'سينمائي', grad:['#ffffff','#7d838c'], bevel:{t:3}, shadow:{c:'#000000', op:60, d:5, s:8}},
  {id:'shineGold', ar:'ذهبي بيلمع',     en:'Gold Shine',     g:'سينمائي', grad:['#fff0b3','#c8901f'], sweep:true},
  {id:'shineWhite',ar:'أبيض بيلمع',     en:'White Shine',    g:'سينمائي', fill:'#e8e8e8', sweep:true, shadow:{c:'#000000', op:40, d:3, s:8}},
  {id:'neonPink',  ar:'نيون بينك',      en:'Neon Pink',      g:'نيون', fill:'#ff4fd8', glow:{th:30, r:30, i:1.5}},
  {id:'neonBlue',  ar:'نيون أزرق',      en:'Neon Blue',      g:'نيون', fill:'#3de1ff', glow:{th:30, r:30, i:1.5}},
  {id:'neonGreen', ar:'نيون أخضر',      en:'Neon Green',     g:'نيون', fill:'#39ff88', glow:{th:30, r:30, i:1.5}},
  {id:'neonAcc',   ar:'نيون بلونك',     en:'Neon Accent',    g:'نيون', fill:'acc', glow:{th:30, r:30, i:1.5}},
  {id:'neonLine',  ar:'نيون إطار',      en:'Neon Outline',   g:'نيون', fill:null, stroke:'#ff4fd8', sw:3, glow:{th:20, r:25, i:2}},
  {id:'sunset',    ar:'جرادينت غروب',   en:'Sunset',         g:'جرادينت', grad:['#ffb347','#ff3c6e']},
  {id:'ocean',     ar:'جرادينت بحر',    en:'Ocean',          g:'جرادينت', grad:['#2bd2ff','#5b4bff']},
  {id:'purple',    ar:'جرادينت بنفسجي', en:'Purple',         g:'جرادينت', grad:['#c471ed','#f64f59']},
  {id:'fire',      ar:'نار',            en:'Fire',           g:'جرادينت', grad:['#ffe259','#ff3c00'], glow:{th:50, r:20, i:0.8}},
  {id:'ice',       ar:'تلج',            en:'Ice',            g:'جرادينت', grad:['#e0f7ff','#6ec6ff'], glow:{th:50, r:20, i:0.6}},
  {id:'mint',      ar:'نعناع',          en:'Mint',           g:'جرادينت', grad:['#d4fc79','#25c9a5']},
  {id:'accBox',    ar:'بوكس بلونك',     en:'Accent Box',     g:'بوكس', fill:'#111111', box:{c:'acc', op:100, pad:[26,12], r:8}},
  {id:'blackBox',  ar:'بوكس أسود',      en:'Black Box',      g:'بوكس', fill:'#ffffff', box:{c:'#000000', op:75, pad:[26,12], r:8}},
  {id:'whiteBox',  ar:'بوكس أبيض',      en:'White Box',      g:'بوكس', fill:'#111111', box:{c:'#ffffff', op:100, pad:[26,12], r:8}},
  {id:'redBox',    ar:'بوكس أحمر',      en:'Red Box',        g:'بوكس', fill:'#ffffff', box:{c:'#e02424', op:100, pad:[26,12], r:8}},
  {id:'pill',      ar:'كبسولة',         en:'Pill',           g:'بوكس', fill:'#111111', box:{c:'#ffffff', op:100, pad:[40,12], r:80}},
  {id:'marker',    ar:'هايلايتر',       en:'Highlighter',    g:'بوكس', fill:'#111111', box:{c:'#ffe600', op:100, pad:[14,2], r:2}},
  {id:'comic',     ar:'كوميك',          en:'Comic',          g:'ستيكر', fill:'#ffd400', stroke:'#000000', sw:10, shadow:{c:'#000000', op:100, d:8, s:0}},
  {id:'sticker',   ar:'ستيكر',          en:'Sticker',        g:'ستيكر', fill:'acc', stroke:'#ffffff', sw:14, shadow:{c:'#000000', op:50, d:6, s:8}},
  {id:'stickerDark',ar:'ستيكر غامق',    en:'Dark Sticker',   g:'ستيكر', fill:'#111111', stroke:'#ffffff', sw:14, shadow:{c:'#000000', op:40, d:5, s:8}},
  {id:'retro3d',   ar:'ريترو 3D',       en:'Retro 3D',       g:'ستيكر', fill:'#ffd166', shadow:{c:'#ef476f', op:100, d:8, s:0}, shadow2:{c:'#118ab2', op:100, d:16, s:0}},
  {id:'rgbSplit',  ar:'RGB سبليت',      en:'RGB Split',      g:'ستيكر', fill:'#ffffff', shadow:{c:'#ff0040', op:100, d:5, s:0, a:270}, shadow2:{c:'#00e5ff', op:100, d:5, s:0, a:90}},
  {id:'embossed',  ar:'بارز',           en:'Embossed',       g:'ستيكر', fill:'acc', bevel:{t:4}, shadow:{c:'#000000', op:50, d:4, s:6}},
  {id:'pastel',    ar:'باستيل',         en:'Pastel',         g:'ستيكر', fill:'#ffb6d9', stroke:'#ffffff', sw:8}
];

/* ------------------------------------------- CapCut-style text animations */
add(D.TEXTS, [
  {id:'popUp',      ar:'بوب طالع',      en:'Pop Up',          g:'ظهور', op:0, sc:0, pos:[0,40], overshoot:true},
  {id:'springIn',   ar:'زنبرك',         en:'Spring',          g:'ظهور', op:0, sc:30, overshoot:true},
  {id:'shrinkIn',   ar:'انكماش',        en:'Shrink In',       g:'ظهور', sc:260},
  {id:'blurRise',   ar:'طلوع ببلور',    en:'Blur Rise',       g:'ظهور', op:0, pos:[0,60], blur:[0,30]},
  {id:'fadeRight',  ar:'فيد يمين',      en:'Fade Right',      g:'ظهور', op:0, pos:[80,0], blur:[20,0]},
  {id:'fadeLeft',   ar:'فيد شمال',      en:'Fade Left',       g:'ظهور', op:0, pos:[-80,0], blur:[20,0]},
  {id:'stretchIn',  ar:'انفراد',        en:'Stretch In',      g:'حركة', op:0, scv:[300,0]},
  {id:'squeezeIn',  ar:'انعصار',        en:'Squeeze In',      g:'حركة', op:0, scv:[0,300]},
  {id:'swingDrop',  ar:'مرجحة ونزول',   en:'Swing Drop',      g:'حركة', op:0, rot:25, pos:[0,-40], overshoot:true},
  {id:'flip3D',     ar:'قلب الحروف 3D', en:'Letter Flip 3D',  g:'3D', op:0, rx:90, three:true},
  {id:'flipY3D',    ar:'لف الحروف 3D',  en:'Letter Turn 3D',  g:'3D', op:0, ry:90, three:true},
  {id:'door3D',     ar:'باب 3D',        en:'Door 3D',         g:'3D', op:0, ry:-100, pos:[30,0], three:true},
  {id:'tumble3D',   ar:'شقلبة الحروف',  en:'Tumble 3D',       g:'3D', op:0, rx:-120, sc:50, three:true, random:true},
  {id:'shakeLoop',  ar:'اهتزاز',        en:'Shake',           g:'لوب', loop:'wiggle', pos:[25,0], wig:6},
  {id:'swingLoop',  ar:'تمايل الحروف',  en:'Swing',           g:'لوب', loop:'wiggle', rot:12, wig:1.5},
  {id:'flickerLoop',ar:'وميض الحروف',   en:'Flicker',         g:'لوب', loop:'wiggle', op:0, wig:8},
  {id:'glitchLoop', ar:'جليتش',         en:'Glitch',          g:'لوب', loop:'wiggle', pos:[40,0], skew:20, wig:10},
  {id:'jellyLoop',  ar:'جيلي',          en:'Jelly',           g:'لوب', loop:'wave', scv:[125,80]},
  {id:'bounceLoop', ar:'نطّ الحروف',    en:'Bounce',          g:'لوب', loop:'wave', pos:[0,-45]},
  {id:'colorWave',  ar:'موجة لون',      en:'Color Wave',      g:'لوب', loop:'wave', fill:true, pos:[0,-15]},
  {id:'heartText',  ar:'نبض قلب',       en:'Heartbeat',       g:'لوب', loop:'expr', sc:118, amt:'var t = time % 1;\nvar v = (Math.exp(-t * 14) + (t > 0.22 ? Math.exp(-(t - 0.22) * 14) * 0.7 : 0)) * 100;', lpv:function(t){ var u=t%1; return Math.exp(-u*14)+(u>0.22?Math.exp(-(u-0.22)*14)*0.7:0); }},
  {id:'blinkText',  ar:'رمش',           en:'Blink',           g:'لوب', loop:'expr', op:0, amt:'var v = Math.floor(time * 3) % 2 ? 100 : 0;', lpv:function(t){ return Math.floor(t*3)%2 ? 1 : 0; }},
  {id:'rainbow',    ar:'قوس قزح',       en:'Rainbow',         g:'لوب', loop:'hue'}
]);

/* --------------------------------------------- shape transitions (extra) */
add(D.TRANSITIONS, [
  {id:'clockWipe',  ar:'عقارب ساعة',  en:'Clock Wipe',  g:'أشكال', d:'دايرة بلونك بتتملي زي عقرب الساعة وتفضى.'},
  {id:'starIris',   ar:'نجمة',        en:'Star Iris',   g:'أشكال', d:'نجمة بلونك بتكبر وتغطي الكادر.'},
  {id:'heartIris',  ar:'قلب',         en:'Heart Iris',  g:'أشكال', d:'قلب بلونك بيكبر ويغطي الكادر.'}
]);
})(NABD_DATA);
