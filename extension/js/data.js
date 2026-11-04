/* NABD Motion Kit v0.3 — preset library (single source of truth for previews + After Effects)
   Units: x/y offsets in px on a 1080px-tall frame (scaled to the comp height in AE). */
var NABD_DATA = (function(){

/* ------------------------------------------------------------ transitions */
var TRANSITIONS = [
  {id:'zoomIn',     ar:'زووم للداخل',     en:'Zoom In',      g:'كاميرا', d:'الكادر بيدخل لجوه بسرعة ويطلع منه المشهد التاني.'},
  {id:'zoomOut',    ar:'زووم للخارج',     en:'Zoom Out',     g:'كاميرا', d:'الكادر بيبعد لبره والمشهد التاني بيقرب.'},
  {id:'crashZoom',  ar:'كراش زووم',       en:'Crash Zoom',   g:'كاميرا', d:'زووم عنيف جداً مع بلور، للحظات الجامدة.'},
  {id:'blurZoom',   ar:'بلور زووم',       en:'Blur Zoom',    g:'كاميرا', d:'زووم ناعم مع بلور، هادي وسينمائي.'},
  {id:'shake',      ar:'هزّة كاميرا',     en:'Camera Shake', g:'كاميرا', d:'هزّة قوية حوالين القطع كأن الكاميرا اتخبطت.'},
  {id:'slideLeft',  ar:'سلايد شمال',      en:'Slide Left',   g:'سلايد',  d:'المشهد بيتزق ناحية الشمال والتاني داخل وراه.'},
  {id:'slideRight', ar:'سلايد يمين',      en:'Slide Right',  g:'سلايد',  d:'المشهد بيتزق ناحية اليمين.'},
  {id:'slideUp',    ar:'سلايد لفوق',      en:'Slide Up',     g:'سلايد',  d:'المشهد بيطلع لفوق، مناسب للريلز.'},
  {id:'slideDown',  ar:'سلايد لتحت',      en:'Slide Down',   g:'سلايد',  d:'المشهد بينزل لتحت.'},
  {id:'pushLeft',   ar:'بوش شمال',        en:'Push Left',    g:'سلايد',  d:'سلايد مع تصغير خفيف في النص، إحساس عمق.'},
  {id:'pushRight',  ar:'بوش يمين',        en:'Push Right',   g:'سلايد',  d:'سلايد يمين مع تصغير خفيف.'},
  {id:'stretchLeft',ar:'مطّ شمال',        en:'Stretch Left', g:'سلايد',  d:'الكادر بيتمط بالعرض وهو ماشي.'},
  {id:'stretchRight',ar:'مطّ يمين',       en:'Stretch Right',g:'سلايد',  d:'مطّ بالعرض ناحية اليمين.'},
  {id:'whipLeft',   ar:'ويب شمال',        en:'Whip Left',    g:'ويب',    d:'سلايد سريع جداً مع موشن بلير اتجاهي.'},
  {id:'whipRight',  ar:'ويب يمين',        en:'Whip Right',   g:'ويب',    d:'ويب ناحية اليمين.'},
  {id:'whipUp',     ar:'ويب لفوق',        en:'Whip Up',      g:'ويب',    d:'ويب رأسي لفوق.'},
  {id:'whipDown',   ar:'ويب لتحت',        en:'Whip Down',    g:'ويب',    d:'ويب رأسي لتحت.'},
  {id:'spin',       ar:'لفّة',            en:'Spin',         g:'لف',     d:'الكادر بيلف نص لفة مع عقارب الساعة.'},
  {id:'spinBack',   ar:'لفّة عكسي',       en:'Spin Back',    g:'لف',     d:'نص لفة عكس عقارب الساعة.'},
  {id:'spinZoom',   ar:'لفّة وزووم',      en:'Spin Zoom',    g:'لف',     d:'لف مع زووم جامد، طاقة عالية.'},
  {id:'swing',      ar:'مرجيحة',          en:'Swing',        g:'لف',     d:'ميلان وسلايد مع بعض.'},
  {id:'twirl',      ar:'دوامة',           en:'Twirl',        g:'تشويه',  d:'الصورة بتتلف حوالين نفسها كأنها دوامة.'},
  {id:'warp',       ar:'تموّج',           en:'Liquid Warp',  g:'تشويه',  d:'تشويه سائل بيعدّي على القطع.'},
  {id:'pixelate',   ar:'بكسلة',           en:'Pixelate',     g:'تشويه',  d:'الصورة بتتحول بكسلات كبيرة وترجع.'},
  {id:'glitch',     ar:'جليتش',           en:'Glitch',       g:'جليتش',  d:'اهتزاز وتقطيع ديجيتال سريع.'},
  {id:'blockGlitch',ar:'جليتش بلوكات',    en:'Block Glitch', g:'جليتش',  d:'بكسلات وقفزات متقطعة.'},
  {id:'flash',      ar:'فلاش أبيض',       en:'Flash White',  g:'ضوء',    d:'وميض أبيض بيغطي القطع.'},
  {id:'dip',        ar:'نزول للأسود',     en:'Dip to Black', g:'ضوء',    d:'الصورة بتغمق للأسود وترجع.'},
  {id:'burn',       ar:'حرق ضوء',         en:'Light Burn',   g:'ضوء',    d:'الإضاءة بتولّع لحد الأبيض مع بلور.'},
  {id:'lightLeak',  ar:'تسريب ضوء',       en:'Light Leak',   g:'ضوء',    d:'ضوء دافي بيعدّي على الكادر.'},
  {id:'lensFlash',  ar:'فلاش عدسة',       en:'Lens Flash',   g:'ضوء',    d:'دايرة ضوء بتفرقع من النص.'},
  {id:'shapeLeft',  ar:'مسح شكل شمال',    en:'Shape Wipe L', g:'أشكال',  d:'مستطيل بلونك بيمسح الكادر للشمال.'},
  {id:'shapeRight', ar:'مسح شكل يمين',    en:'Shape Wipe R', g:'أشكال',  d:'مستطيل بلونك بيمسح الكادر لليمين.'},
  {id:'shapeUp',    ar:'مسح شكل لفوق',    en:'Shape Wipe Up',g:'أشكال',  d:'مستطيل بلونك طالع لفوق.'},
  {id:'shapeDown',  ar:'مسح شكل لتحت',    en:'Shape Wipe Dn',g:'أشكال',  d:'مستطيل بلونك نازل لتحت.'},
  {id:'circle',     ar:'دايرة',           en:'Circle Reveal',g:'أشكال',  d:'دايرة بتكبر تغطي الكادر وتصغر عن المشهد الجديد.'},
  {id:'bars',       ar:'شرايط',           en:'Bars',         g:'أشكال',  d:'شرايط بتنزل ورا بعض.'},
  {id:'split',      ar:'باب',             en:'Split',        g:'أشكال',  d:'نصين بيقفلوا على الكادر ويفتحوا.'},
  {id:'diagonal',   ar:'مسح مايل',        en:'Diagonal',     g:'أشكال',  d:'شريط مايل عريض بيعدّي.'}
];

/* --------------------------------------------------------- motion presets */
// kind 'in'   : tr = start state, rest is implicit. Usable as In / Out / both.
// kind 'emph' : keys over the duration, applied at the playhead.
// kind 'loop' : expressions, with a JS preview function (lp).
var MOTION = [
  {id:'fade',      ar:'فيد',            en:'Fade',             g:'ظهور', kind:'in', ease:'smooth', tr:{op:0}},
  {id:'blurFade',  ar:'فيد مع بلور',    en:'Blur Fade',        g:'ظهور', kind:'in', ease:'cubic',  tr:{op:0, bl:40}},
  {id:'scaleFade', ar:'فيد وتكبير',     en:'Scale Fade',       g:'ظهور', kind:'in', ease:'cubic',  tr:{op:0, s:60}},
  {id:'bigFade',   ar:'فيد من كبير',    en:'Big Fade',         g:'ظهور', kind:'in', ease:'cubic',  tr:{op:0, s:150}},
  {id:'zoomBlur',  ar:'زووم بلور',      en:'Zoom Blur',        g:'ظهور', kind:'in', ease:'expo',   tr:{op:0, s:250, bl:30}},
  {id:'blurOnly',  ar:'بلور بس',        en:'Defocus',          g:'ظهور', kind:'in', ease:'cubic',  tr:{bl:60}},
  {id:'flicker',   ar:'وميض',           en:'Flicker',          g:'ظهور', kind:'in', ease:'linear', tr:{flick:1}},

  {id:'fromBottom',ar:'من تحت',         en:'Ease Up',          g:'اتجاهات', kind:'in', ease:'expo', tr:{op:0, y:200}},
  {id:'fromTop',   ar:'من فوق',         en:'Ease Down',        g:'اتجاهات', kind:'in', ease:'expo', tr:{op:0, y:-200}},
  {id:'fromRight', ar:'من اليمين',      en:'Ease From Right',  g:'اتجاهات', kind:'in', ease:'expo', tr:{op:0, x:300}},
  {id:'fromLeft',  ar:'من الشمال',      en:'Ease From Left',   g:'اتجاهات', kind:'in', ease:'expo', tr:{op:0, x:-300}},
  {id:'flyRight',  ar:'طيران من اليمين',en:'Fly In Right',     g:'اتجاهات', kind:'in', ease:'expo', tr:{x:1300, db:140}, dbDir:90},
  {id:'flyLeft',   ar:'طيران من الشمال',en:'Fly In Left',      g:'اتجاهات', kind:'in', ease:'expo', tr:{x:-1300, db:140}, dbDir:90},
  {id:'flyUp',     ar:'طيران من تحت',   en:'Fly In Up',        g:'اتجاهات', kind:'in', ease:'expo', tr:{y:1100, db:140}, dbDir:0},
  {id:'skewIn',    ar:'دخول مايل',      en:'Skew In',          g:'اتجاهات', kind:'in', ease:'expo', tr:{op:0, x:-300, sk:30}},

  {id:'overBottom',ar:'أوفرشوت من تحت', en:'Overshoot Up',     g:'أوفرشوت ونطّ', kind:'in', ease:'back',    tr:{y:250, op:0}},
  {id:'overTop',   ar:'أوفرشوت من فوق', en:'Overshoot Down',   g:'أوفرشوت ونطّ', kind:'in', ease:'back',    tr:{y:-250, op:0}},
  {id:'overRight', ar:'أوفرشوت من اليمين',en:'Overshoot Left', g:'أوفرشوت ونطّ', kind:'in', ease:'back',    tr:{x:350, op:0}},
  {id:'overLeft',  ar:'أوفرشوت من الشمال',en:'Overshoot Right',g:'أوفرشوت ونطّ', kind:'in', ease:'back',    tr:{x:-350, op:0}},
  {id:'overScale', ar:'بوب أوفرشوت',    en:'Overshoot Scale',  g:'أوفرشوت ونطّ', kind:'in', ease:'back',    tr:{s:0}},
  {id:'elasticPop',ar:'بوب مطاطي',      en:'Elastic Pop',      g:'أوفرشوت ونطّ', kind:'in', ease:'elastic', tr:{s:0}},
  {id:'elasticUp', ar:'طلوع مطاطي',     en:'Elastic Rise',     g:'أوفرشوت ونطّ', kind:'in', ease:'elastic', tr:{y:300, op:0}},
  {id:'dropBounce',ar:'سقوط ونطّ',      en:'Drop Bounce',      g:'أوفرشوت ونطّ', kind:'in', ease:'bounce',  tr:{y:-700}},
  {id:'squash',    ar:'سكواش',          en:'Squash',           g:'أوفرشوت ونطّ', kind:'in', ease:'elastic', tr:{sx:150, sy:40, op:0}},

  {id:'popIn',     ar:'بوب',            en:'Pop',              g:'تكبير ولف', kind:'in', ease:'cubic',   tr:{s:0}},
  {id:'growUp',    ar:'طلوع رأسي',      en:'Grow Vertical',    g:'تكبير ولف', kind:'in', ease:'expo',    tr:{sy:0}},
  {id:'growSide',  ar:'فرد أفقي',       en:'Grow Horizontal',  g:'تكبير ولف', kind:'in', ease:'expo',    tr:{sx:0}},
  {id:'spinIn',    ar:'لف وتكبير',      en:'Spin In',          g:'تكبير ولف', kind:'in', ease:'expo',    tr:{r:-180, s:0}},
  {id:'rotateIn',  ar:'لف ودخول',       en:'Rotate In',        g:'تكبير ولف', kind:'in', ease:'expo',    tr:{r:-90, op:0}},
  {id:'swingIn',   ar:'مرجيحة',         en:'Swing In',         g:'تكبير ولف', kind:'in', ease:'elastic', tr:{r:35, op:0}},

  {id:'wipeRight', ar:'مسح لليمين',     en:'Wipe Right',       g:'مسح', kind:'in', ease:'cubic', tr:{wipe:100}, wa:270},
  {id:'wipeLeft',  ar:'مسح للشمال',     en:'Wipe Left',        g:'مسح', kind:'in', ease:'cubic', tr:{wipe:100}, wa:90},
  {id:'wipeDown',  ar:'مسح لتحت',       en:'Wipe Down',        g:'مسح', kind:'in', ease:'cubic', tr:{wipe:100}, wa:180},
  {id:'wipeUp',    ar:'مسح لفوق',       en:'Wipe Up',          g:'مسح', kind:'in', ease:'cubic', tr:{wipe:100}, wa:0},
  {id:'softWipe',  ar:'مسح ناعم',       en:'Soft Wipe',        g:'مسح', kind:'in', ease:'cubic', tr:{wipe:100}, wa:270, feather:250},
  {id:'radialWipe',ar:'مسح دايري',      en:'Radial Wipe',      g:'مسح', kind:'in', ease:'cubic', tr:{rwipe:100}},
  {id:'blinds',    ar:'شرايح',          en:'Blinds',           g:'مسح', kind:'in', ease:'cubic', tr:{blinds:100}},

  {id:'punch',     ar:'بانش',           en:'Punch',            g:'تأكيد', kind:'emph', keys:{s:[[0,100],[0.3,120],[1,100]]}},
  {id:'shakeOnce', ar:'هزّة',           en:'Shake',            g:'تأكيد', kind:'emph', keys:{x:[[0,0],[0.12,-30],[0.26,28],[0.4,-22],[0.55,16],[0.7,-9],[0.85,4],[1,0]]}},
  {id:'wobble',    ar:'تمايل',          en:'Wobble',           g:'تأكيد', kind:'emph', keys:{r:[[0,0],[0.2,-12],[0.4,10],[0.6,-6],[0.8,3],[1,0]]}},
  {id:'jump',      ar:'نطّة',           en:'Jump',             g:'تأكيد', kind:'emph', keys:{y:[[0,0],[0.4,-140],[0.75,0],[0.87,-25],[1,0]]}},
  {id:'rubber',    ar:'رابر باند',      en:'Rubber Band',      g:'تأكيد', kind:'emph', keys:{sx:[[0,100],[0.3,130],[0.5,85],[0.7,108],[1,100]], sy:[[0,100],[0.3,75],[0.5,112],[0.7,95],[1,100]]}},
  {id:'blink',     ar:'رمشة',           en:'Blink',            g:'تأكيد', kind:'emph', keys:{op:[[0,100],[0.2,15],[0.4,100],[0.6,15],[1,100]]}},
  {id:'heartOnce', ar:'دقة قلب',        en:'Heartbeat',        g:'تأكيد', kind:'emph', keys:{s:[[0,100],[0.15,118],[0.3,100],[0.45,112],[1,100]]}},
  {id:'tada',      ar:'تادا',           en:'Tada',             g:'تأكيد', kind:'emph', keys:{s:[[0,100],[0.15,90],[0.35,112],[0.85,112],[1,100]], r:[[0,0],[0.15,-4],[0.3,4],[0.45,-4],[0.6,4],[0.75,-4],[0.9,0],[1,0]]}},

  {id:'pulse',     ar:'نبض',            en:'Pulse',            g:'لوب', kind:'loop', ex:{s:'value + Math.sin(time*2*Math.PI*1)*6'}, lp:function(t){ return {s:100+Math.sin(t*2*Math.PI)*6}; }},
  {id:'heartLoop', ar:'قلب',            en:'Heartbeat Loop',   g:'لوب', kind:'loop', ex:{s:'var t = time % 1;\nvar b = Math.exp(-t*14)*12 + (t > 0.22 ? Math.exp(-(t-0.22)*14)*8 : 0);\nvalue + b;'}, lp:function(t){ var u=t%1; return {s:100+Math.exp(-u*14)*12+(u>0.22?Math.exp(-(u-0.22)*14)*8:0)}; }},
  {id:'float',     ar:'طفو',            en:'Float',            g:'لوب', kind:'loop', ex:{pos:'var k = thisComp.height/1080;\nvalue + [0, Math.sin(time*2*Math.PI*0.5)*20*k];'}, lp:function(t){ return {y:Math.sin(t*Math.PI)*20}; }},
  {id:'sway',      ar:'تمايل مستمر',    en:'Sway',             g:'لوب', kind:'loop', ex:{r:'value + Math.sin(time*2*Math.PI*0.6)*8'}, lp:function(t){ return {r:Math.sin(t*2*Math.PI*0.6)*8}; }},
  {id:'spinLoop',  ar:'لف مستمر',       en:'Spin',             g:'لوب', kind:'loop', ex:{r:'value + time*120'}, lp:function(t){ return {r:(t*120)%360}; }},
  {id:'wiggleLoop',ar:'ويجل',           en:'Wiggle',           g:'لوب', kind:'loop', ex:{pos:'var k = thisComp.height/1080;\nwiggle(2, 25*k);'}, lp:function(t){ return {x:noise(t*2,1)*25, y:noise(t*2,9)*25}; }},
  {id:'shakeLoop', ar:'رعشة',           en:'Jitter',           g:'لوب', kind:'loop', ex:{pos:'var k = thisComp.height/1080;\nwiggle(18, 8*k);'}, lp:function(t){ return {x:noise(t*18,3)*8, y:noise(t*18,5)*8}; }},
  {id:'bounceLoop',ar:'نطّ مستمر',      en:'Bounce Loop',      g:'لوب', kind:'loop', ex:{pos:'var k = thisComp.height/1080;\nvalue + [0, -Math.abs(Math.sin(time*Math.PI*1.5))*80*k];'}, lp:function(t){ return {y:-Math.abs(Math.sin(t*Math.PI*1.5))*80}; }},
  {id:'orbit',     ar:'دوران',          en:'Orbit',            g:'لوب', kind:'loop', ex:{pos:'var k = thisComp.height/1080, a = time*2*Math.PI*0.5;\nvalue + [Math.cos(a)*40*k, Math.sin(a)*40*k];'}, lp:function(t){ var a=t*Math.PI; return {x:Math.cos(a)*40, y:Math.sin(a)*40}; }},
  {id:'jelly',     ar:'جيلي',           en:'Jelly',            g:'لوب', kind:'loop', ex:{sx:'value + Math.sin(time*2*Math.PI*1.5)*7', sy:'value - Math.sin(time*2*Math.PI*1.5)*7'}, lp:function(t){ var v=Math.sin(t*2*Math.PI*1.5)*7; return {sx:100+v, sy:100-v}; }},
  {id:'blinkLoop', ar:'رمش مستمر',      en:'Blink Loop',       g:'لوب', kind:'loop', ex:{op:'value * (Math.sin(time*2*Math.PI*1.2) > -0.5 ? 1 : 0.15)'}, lp:function(t){ return {op:Math.sin(t*2*Math.PI*1.2)>-0.5?100:15}; }},
  {id:'breathe',   ar:'تنفّس',          en:'Breathe',          g:'لوب', kind:'loop', ex:{op:'value * (0.75 + 0.25*Math.sin(time*2*Math.PI*0.5))', s:'value + Math.sin(time*2*Math.PI*0.5)*2'}, lp:function(t){ var v=Math.sin(t*Math.PI); return {op:100*(0.75+0.25*v), s:100+v*2}; }}
];

/* ----------------------------------------------------------- text presets */
// Values are for a ~110px font. based: per unit animation. loop: 'wiggle' | 'wave'
var TEXTS = [
  {id:'fadeUp',      ar:'ظهور لفوق',       en:'Fade Up',          g:'ظهور', op:0, pos:[0,70]},
  {id:'fadeDown',    ar:'ظهور لتحت',       en:'Fade Down',        g:'ظهور', op:0, pos:[0,-70]},
  {id:'fadeUpBlur',  ar:'ظهور لفوق ببلور', en:'Fade Up Blur',     g:'ظهور', op:0, pos:[0,60], blur:[20,20]},
  {id:'blurIn',      ar:'ظهور من البلور',  en:'Blur In',          g:'ظهور', op:0, blur:[40,40]},
  {id:'scalePop',    ar:'بوب',             en:'Scale Pop',        g:'ظهور', op:0, sc:0},
  {id:'popBlur',     ar:'بوب ببلور',       en:'Pop Blur',         g:'ظهور', op:0, sc:0, blur:[15,15]},
  {id:'scaleDown',   ar:'نازل من كبير',    en:'Scale Down',       g:'ظهور', op:0, sc:300},
  {id:'bigScaleBlur',ar:'تكبير وبلور',     en:'Big Scale Blur',   g:'ظهور', op:0, sc:250, blur:[30,30]},
  {id:'cinematic',   ar:'دخول سينمائي',    en:'Cinematic Track',  g:'ظهور', op:0, trk:200, blur:[10,10]},
  {id:'colorIn',     ar:'ظهور ملوّن',      en:'Color In',         g:'ظهور', op:0, fill:true, pos:[0,30]},

  {id:'slideRight',  ar:'دخول من اليمين',  en:'Slide From Right', g:'حركة', op:0, pos:[150,0]},
  {id:'slideLeft',   ar:'دخول من الشمال',  en:'Slide From Left',  g:'حركة', op:0, pos:[-150,0]},
  {id:'blurSlide',   ar:'سلايد ببلور',     en:'Blur Slide',       g:'حركة', op:0, pos:[220,0], blur:[40,0]},
  {id:'riseOver',    ar:'طلوع بأوفرشوت',   en:'Rise Overshoot',   g:'حركة', op:0, pos:[0,120], overshoot:true},
  {id:'dropIn',      ar:'نازل من فوق',     en:'Drop In',          g:'حركة', op:0, pos:[0,-120]},
  {id:'dropBounce',  ar:'سقوط ونطّة',      en:'Drop Bounce',      g:'حركة', op:0, pos:[0,-200], overshoot:true},
  {id:'rotateIn',    ar:'لف ودخول',        en:'Rotate In',        g:'حركة', op:0, rot:90},
  {id:'skewIn',      ar:'دخول مايل',       en:'Skew In',          g:'حركة', op:0, skew:40, pos:[60,0]},
  {id:'tracking',    ar:'تباعد الحروف',    en:'Tracking',         g:'حركة', op:0, trk:80},
  {id:'condense',    ar:'تجميع الحروف',    en:'Condense',         g:'حركة', op:0, trk:-60},

  {id:'randomFade',  ar:'ظهور عشوائي',     en:'Random Fade',      g:'عشوائي', op:0, random:true},
  {id:'randomBlur',  ar:'بلور عشوائي',     en:'Random Blur',      g:'عشوائي', op:0, blur:[25,25], random:true},
  {id:'randomPop',   ar:'بوب عشوائي',      en:'Random Pop',       g:'عشوائي', op:0, sc:0, random:true},
  {id:'randomDrop',  ar:'نزول عشوائي',     en:'Random Drop',      g:'عشوائي', op:0, pos:[0,-100], random:true},
  {id:'typewriter',  ar:'آلة كاتبة',       en:'Typewriter',       g:'عشوائي', op:0, square:true},
  {id:'decode',      ar:'فك شفرة',         en:'Decode',           g:'عشوائي', op:0, chOff:25, random:true, latin:true},

  {id:'wiggleText',  ar:'رعشة الحروف',     en:'Wiggle Loop',      g:'لوب', loop:'wiggle', pos:[0,18], rot:8},
  {id:'waveText',    ar:'موجة',            en:'Wave Loop',        g:'لوب', loop:'wave', pos:[0,-30]}
];

/* ---------------------------------------------------------------- titles */
// Title-local px (1080 tall). Parts animate with motion presets: in/out = [presetId, frames, delayFrames]
var TITLES = [
  {id:'cine1', ar:'عنوان سينمائي', en:'Cinematic', g:'سينمائي', place:'center', lines:['العنوان الرئيسي','سطر صغير تحت'], parts:[
    {t:'rect', x:0, y:-95, w:520, h:3, c:'#fff', in:['growSide',24,0], out:['growSide',14,4]},
    {t:'text', key:0, x:0, y:0, size:120, bold:true, trk:120, in:['blurFade',30,6], out:['blurFade',16,0]},
    {t:'rect', x:0, y:95, w:520, h:3, c:'#fff', in:['growSide',24,0], out:['growSide',14,4]},
    {t:'text', key:1, x:0, y:150, size:40, c:'acc', trk:300, in:['fade',24,14], out:['fade',12,0]}]},
  {id:'cine2', ar:'افتتاحية', en:'Opener', g:'سينمائي', place:'center', lines:['قصة جديدة','٢٠٢٦'], parts:[
    {t:'text', key:0, x:0, y:-20, size:150, bold:true, in:['zoomBlur',30,0], out:['zoomBlur',18,0]},
    {t:'text', key:1, x:0, y:100, size:46, c:'acc', trk:500, in:['fromBottom',22,12], out:['fade',12,0]}]},
  {id:'chapter', ar:'فصل', en:'Chapter', g:'سينمائي', place:'center', lines:['البداية','الفصل الأول'], parts:[
    {t:'text', key:1, x:0, y:-110, size:36, c:'acc', trk:300, in:['fade',20,0], out:['fade',12,0]},
    {t:'text', key:0, x:0, y:0, size:130, bold:true, in:['wipeRight',26,6], out:['wipeLeft',16,0]},
    {t:'rect', x:0, y:90, w:90, h:6, c:'acc', in:['growSide',20,16], out:['growSide',12,0]}]},

  {id:'boxTitle', ar:'نص على بوكس', en:'Box Title', g:'تايبوجرافي', place:'center', lines:['عنوان على بوكس'], parts:[
    {t:'box', fit:0, pad:[40,18], c:'acc', in:['wipeRight',18,0], out:['wipeLeft',14,6]},
    {t:'text', key:0, x:0, y:0, size:100, bold:true, c:'#111', in:['fromBottom',20,8], out:['fade',10,0]}]},
  {id:'underline', ar:'خط تحت', en:'Underline', g:'تايبوجرافي', place:'center', lines:['كلمة مهمة'], parts:[
    {t:'text', key:0, x:0, y:0, size:120, bold:true, in:['fromBottom',22,0], out:['fromBottom',14,4]},
    {t:'rect', x:0, y:85, w:460, h:12, c:'acc', in:['growSide',18,10], out:['growSide',12,0]}]},
  {id:'twoLines', ar:'سطرين', en:'Two Lines', g:'تايبوجرافي', place:'center', lines:['السطر الأول','والسطر التاني'], parts:[
    {t:'text', key:0, x:0, y:-60, size:110, bold:true, in:['overRight',24,0], out:['fromRight',14,4]},
    {t:'text', key:1, x:0, y:70, size:80, c:'acc', in:['overLeft',24,6], out:['fromLeft',14,0]}]},
  {id:'quote', ar:'اقتباس', en:'Quote', g:'تايبوجرافي', place:'center', lines:['الفكرة البسيطة أقوى','— صاحب الكلام'], parts:[
    {t:'text', raw:'”', x:0, y:-150, size:220, bold:true, c:'acc', in:['overScale',22,0], out:['popIn',12,4]},
    {t:'text', key:0, x:0, y:0, size:86, bold:true, in:['blurFade',26,8], out:['fade',14,0]},
    {t:'text', key:1, x:0, y:100, size:42, c:'#bbb', in:['fade',20,18], out:['fade',10,0]}]},
  {id:'bigWord', ar:'كلمة ضخمة', en:'Big Word', g:'تايبوجرافي', place:'center', lines:['واو'], parts:[
    {t:'circle', x:0, y:0, d:420, c:'acc', in:['elasticPop',30,0], out:['popIn',14,4]},
    {t:'text', key:0, x:0, y:0, size:170, bold:true, c:'#111', in:['overScale',24,6], out:['popIn',12,0]}]},

  {id:'lowerThird', ar:'لوور ثيرد', en:'Lower Third', g:'سوشيال', place:'lower', lines:['محمود حمدي','موشن ديزاينر'], parts:[
    {t:'rect', x:0, y:0, w:10, h:150, c:'acc', align:'r', in:['growUp',16,0], out:['growUp',12,8]},
    {t:'text', key:0, x:-40, y:-30, size:70, bold:true, align:'r', in:['fromRight',22,6], out:['fromRight',14,4]},
    {t:'text', key:1, x:-40, y:45, size:42, c:'#ccc', align:'r', in:['fromRight',22,12], out:['fromRight',14,0]}]},
  {id:'handle', ar:'حساب سوشيال', en:'Social Handle', g:'سوشيال', place:'lower', lines:['@nabd.motion'], parts:[
    {t:'circle', x:0, y:0, d:110, c:'acc', align:'r', in:['elasticPop',24,0], out:['popIn',12,6]},
    {t:'text', raw:'@', x:0, y:0, size:62, bold:true, c:'#111', in:['overScale',20,6], out:['popIn',10,4]},
    {t:'text', key:0, x:-90, y:0, size:64, bold:true, align:'r', in:['wipeLeft',22,10], out:['wipeRight',14,0]}]},
  {id:'follow', ar:'زرار تابعنا', en:'Follow Button', g:'سوشيال', place:'center', lines:['تابعنا'], parts:[
    {t:'box', fit:0, pad:[60,26], c:'acc', r:60, in:['elasticPop',26,0], out:['popIn',12,6]},
    {t:'text', key:0, x:0, y:0, size:80, bold:true, c:'#111', in:['overScale',22,6], out:['popIn',10,0]}]},
  {id:'hashtag', ar:'هاشتاج', en:'Hashtag', g:'سوشيال', place:'center', lines:['#حمدي'], parts:[
    {t:'box', fit:0, pad:[34,14], c:'#fff', r:20, in:['growSide',18,0], out:['growSide',12,6]},
    {t:'text', key:0, x:0, y:0, size:80, bold:true, c:'acc', in:['fromBottom',18,8], out:['fade',10,0]}]},

  {id:'counter', ar:'عداد أرقام', en:'Counter', g:'عدادات', place:'center', lines:['0','1000','+'], counter:true, parts:[
    {t:'text', key:'count', x:0, y:0, size:200, bold:true, in:['overScale',20,0], out:['fade',12,0]},
    {t:'rect', x:0, y:130, w:300, h:8, c:'acc', in:['growSide',24,6], out:['growSide',12,0]}]},
  {id:'countdown', ar:'عد تنازلي', en:'Countdown', g:'عدادات', place:'center', lines:['10'], countdown:true, parts:[
    {t:'circle', x:0, y:0, d:380, c:'acc', stroke:14, in:['popIn',18,0], out:['popIn',12,0]},
    {t:'text', key:'down', x:0, y:0, size:150, bold:true, in:['fade',12,4], out:['fade',10,0]}]},
  {id:'progress', ar:'بار نسبة', en:'Progress Bar', g:'عدادات', place:'center', lines:['75'], progress:true, parts:[
    {t:'rect', x:0, y:40, w:800, h:26, c:'#333', r:13, in:['growSide',16,0], out:['fade',12,0]},
    {t:'bar', x:0, y:40, w:800, h:26, c:'acc', r:13},
    {t:'text', key:'pct', x:0, y:-50, size:90, bold:true, in:['fromBottom',18,6], out:['fade',10,0]}]}
];

/* -------------------------------------------------------------- elements */
var ELEMENTS = [
  {id:'burst',     ar:'انفجار خطوط',   en:'Burst',          g:'أشكال', d:'خطوط بتطلع من النص وتختفي، حلوة مع البوب.'},
  {id:'ringPop',   ar:'حلقة',          en:'Ring Pop',       g:'أشكال', d:'دايرة بتكبر وتتلاشى.'},
  {id:'underline', ar:'خط بيترسم',     en:'Underline Draw', g:'أشكال', d:'خط بيترسم تحت الكلام.'},
  {id:'arrow',     ar:'سهم',           en:'Arrow Draw',     g:'أشكال', d:'سهم منحني بيترسم.'},
  {id:'scribble',  ar:'دايرة إيد',     en:'Circle Scribble',g:'أشكال', d:'دايرة كأنها مترسومة بالإيد حوالين حاجة.'},
  {id:'check',     ar:'علامة صح',      en:'Check Mark',     g:'أشكال', d:'علامة صح بتترسم.'},
  {id:'sparkle',   ar:'لمعة',          en:'Sparkle',        g:'أشكال', d:'نجمة لمعة بتفرقع وتلف.'},
  {id:'highlight', ar:'هايلايت',       en:'Highlight',      g:'أشكال', d:'شريط هايلايت بيتمسح ورا الكلام.'},
  {id:'dots',      ar:'نقط تحميل',     en:'Dots Loop',      g:'أشكال', d:'تلات نقط بتنط على طول.'},
  {id:'plus',      ar:'علامات زائد',   en:'Plus Spin',      g:'أشكال', d:'علامة + بتلف وتفرقع.'},
  {id:'gradientBg',ar:'جرادينت متحرك', en:'Moving Gradient',g:'خلفيات', d:'خلفية ألوان بتتحرك ببطء.'},
  {id:'gridBg',    ar:'شبكة',          en:'Grid',           g:'خلفيات', d:'خلفية شبكة خطوط.'},
  {id:'spotBg',    ar:'سبوت لايت',     en:'Spotlight',      g:'خلفيات', d:'خلفية غامقة بإضاءة في النص.'},
  {id:'grain',     ar:'جرين',          en:'Film Grain',     g:'أوفرليز', d:'حبيبات فيلم خفيفة.'},
  {id:'vignette',  ar:'فينييت',        en:'Vignette',       g:'أوفرليز', d:'تغميق الأطراف.'},
  {id:'leakLoop',  ar:'تسريب ضوء لوب', en:'Light Leak Loop',g:'أوفرليز', d:'ضوء دافي بيتحرك على طول.'},
  {id:'scanlines', ar:'سكان لاينز',    en:'Scanlines',      g:'أوفرليز', d:'خطوط شاشة قديمة.'},
  {id:'letterbox', ar:'شرايط سينما',   en:'Letterbox',      g:'أوفرليز', d:'شريطين أسود فوق وتحت 2.35:1.'}
];

/* ----------------------------------------------------------------- eases */
var EASES = [
  {id:'linear', ar:'لينير',            en:'Linear',     g:'إيز', mode:'linear', o:0,  i:0},
  {id:'easy',   ar:'إيزي إيز',         en:'Easy 33',    g:'إيز', o:33, i:33},
  {id:'smooth', ar:'ناعم',             en:'Smooth 60',  g:'إيز', o:60, i:60},
  {id:'strong', ar:'قوي',              en:'Strong 80',  g:'إيز', o:80, i:80},
  {id:'expo',   ar:'إكسبو',            en:'Expo 95',    g:'إيز', o:95, i:95},
  {id:'decel',  ar:'سريع ثم يهدى',     en:'Decelerate', g:'إيز', o:0.1, i:95},
  {id:'accel',  ar:'هادي ثم يسرع',     en:'Accelerate', g:'إيز', o:95, i:0.1},
  {id:'hold',   ar:'هولد',             en:'Hold',       g:'إيز', mode:'hold'},
  {id:'overshoot', ar:'أوفرشوت',       en:'Overshoot',  g:'إكسبريشن', expr:true},
  {id:'bounce',    ar:'نطّة',          en:'Bounce',     g:'إكسبريشن', expr:true},
  {id:'loopCycle', ar:'لوب متكرر',     en:'loopOut cycle', g:'إكسبريشن', expr:true},
  {id:'loopPing',  ar:'لوب رايح جاي',  en:'loopOut pingpong', g:'إكسبريشن', expr:true},
  {id:'loopCont',  ar:'لوب مكمّل',     en:'loopOut continue', g:'إكسبريشن', expr:true},
  {id:'wiggleSoft',ar:'ويجل خفيف',     en:'wiggle(1.5,15)', g:'إكسبريشن', expr:true},
  {id:'wiggleHard',ar:'ويجل جامد',     en:'wiggle(8,40)', g:'إكسبريشن', expr:true},
  {id:'spin',      ar:'لف على طول',    en:'time*90',    g:'إكسبريشن', expr:true},
  {id:'none',      ar:'شيل الإكسبريشن',en:'Remove',     g:'إكسبريشن', expr:true}
];

/* ----------------------------------------------------------------- tools */
var GUIDES = [
  {id:'reels',  ar:'إنستجرام ريلز', z:{top:220,bottom:420,left:60,right:140}},
  {id:'tiktok', ar:'تيك توك',       z:{top:160,bottom:480,left:60,right:160}},
  {id:'shorts', ar:'يوتيوب شورتس',  z:{top:190,bottom:380,left:60,right:190}},
  {id:'generic',ar:'Safe Areas',    z:null}
];
var COMP_SIZES = [
  {ar:'ريلز / تيك توك 9:16', w:1080, h:1920},
  {ar:'بورتريه 4:5', w:1080, h:1350},
  {ar:'مربع 1:1', w:1080, h:1080},
  {ar:'يوتيوب 16:9', w:1920, h:1080},
  {ar:'4K أفقي', w:3840, h:2160},
  {ar:'4K رأسي', w:2160, h:3840}
];
var TOOLS = [
  {id:'anchor',    ar:'نقل الأنكور',        en:'Anchor Point Mover', g:'لايرات', d:'اختار مكان الأنكور من الشبكة واللاير مش هيتحرك من مكانه، حتى لو عليه كي فريمز.'},
  {id:'center',    ar:'سنتر في الكومب',     en:'Center Layer',       g:'لايرات', d:'بيحط اللاير في نص الكومب بالظبط.'},
  {id:'nullCtl',   ar:'نل كنترولر',         en:'Null Controller',    g:'لايرات', d:'نل في نص اللايرات المحددة وكلهم بيتربطوا بيه.'},
  {id:'adjust',    ar:'أدجستمنت هنا',       en:'Adjustment Layer',   g:'لايرات', d:'أدجستمنت لاير بيبدأ من البلاي هيد فوق المحدد.'},
  {id:'fit',       ar:'ملّي الكادر',        en:'Fit to Comp',        g:'لايرات', d:'بيكبّر اللاير لحد ما يملا الكومب.'},
  {id:'precomp',   ar:'بريكومب',            en:'Precompose',         g:'لايرات', d:'بيحط اللايرات المحددة في كومب لوحدها.'},
  {id:'clearNabd', ar:'شيل حركات الكيت',      en:'Remove Kit FX',     g:'لايرات', d:'بيمسح كل الإفكتات اللي الكيت حطها على اللايرات المحددة.'},
  {id:'keysReverse',ar:'اعكس الكي فريمز',   en:'Reverse Keys',       g:'كي فريمز', d:'بيعكس ترتيب الكي فريمز المحددة والإيز بتاعها.'},
  {id:'keysPlayhead',ar:'الكيز للبلاي هيد', en:'Keys to Playhead',   g:'كي فريمز', d:'بينقل أول كي فريم محدد عند البلاي هيد والباقي وراه.'},
  {id:'keysRetime', ar:'سرّع / بطّئ الكيز', en:'Retime Keys',        g:'كي فريمز', d:'بيمط أو يضغط المسافة بين الكي فريمز المحددة بنسبة.'},
  {id:'keysNudge',  ar:'زحّق الكيز',        en:'Nudge Keys',         g:'كي فريمز', d:'بيزحّق الكي فريمز المحددة قدام أو ورا بعدد فريمات.'},
  {id:'sequence',  ar:'ورا بعض',            en:'Sequence Layers',    g:'تايملاين', d:'بيرص اللايرات المحددة ورا بعض، مع تداخل لو عايز.'},
  {id:'stagger',   ar:'تدريج اللايرات',     en:'Stagger',            g:'تايملاين', d:'بيأخر كل لاير عن اللي قبله بعدد فريمات.'},
  {id:'split',     ar:'قص عند البلاي هيد',  en:'Split Layer',        g:'تايملاين', d:'بيقسم اللاير المحدد لنصين عند البلاي هيد.'},
  {id:'trimIn',    ar:'قص البداية هنا',     en:'Trim In',            g:'تايملاين', d:'بداية اللاير تبقى عند البلاي هيد.'},
  {id:'trimOut',   ar:'قص النهاية هنا',     en:'Trim Out',           g:'تايملاين', d:'نهاية اللاير تبقى عند البلاي هيد.'},
  {id:'newComp',   ar:'كومب جديد',          en:'New Comp',           g:'مشروع', d:'كومب بمقاسات السوشيال الجاهزة.'},
  {id:'organize',  ar:'تنظيم المشروع',      en:'Organize Project',   g:'مشروع', d:'بيرتب البروجكت في فولدرات من غير ما يمسح حاجة.'},
  {id:'guides',    ar:'أدلة السوشيال',      en:'Safe Zones',         g:'مشروع', d:'المناطق الآمنة لريلز وتيك توك وشورتس كـ Guide Layer.'}
];

function noise(t, seed){ return 0.55*Math.sin(t*1.3+seed)+0.3*Math.sin(t*2.7+seed*2.1)+0.15*Math.sin(t*5.1+seed*0.7); }

return {TRANSITIONS:TRANSITIONS, MOTION:MOTION, TEXTS:TEXTS, TITLES:TITLES, ELEMENTS:ELEMENTS, EASES:EASES, GUIDES:GUIDES, COMP_SIZES:COMP_SIZES, TOOLS:TOOLS, noise:noise};
})();
