/* NABD Motion Kit v0.4 — advanced additions to every library */
(function(D){
var noise = D.noise;
function add(list, items){ items.forEach(function(x){ list.push(x); }); }

/* ------------------------------------------------------------ transitions */
add(D.TRANSITIONS, [
  {id:'fisheye',     ar:'عين السمكة',     en:'Fisheye',        g:'تشويه',  d:'العدسة بتتنفخ زي عين السمكة وترجع.'},
  {id:'polar',       ar:'بولار',          en:'Polar Warp',     g:'تشويه',  d:'الكادر بيتلف لدايرة ويفرد تاني، تأثير غريب وجامد.'},
  {id:'bulge',       ar:'انتفاخ',         en:'Bulge',          g:'تشويه',  d:'نص الكادر بيتنفخ لقدام.'},
  {id:'spherize',    ar:'كرة',            en:'Spherize',       g:'تشويه',  d:'الكادر بيتكوّر زي الكرة.'},
  {id:'ripple',      ar:'تموّج مايه',      en:'Ripple',         g:'تشويه',  d:'موجات زي المايه من النص.'},
  {id:'zoomRadial',  ar:'زووم شعاعي',     en:'Radial Zoom',    g:'كاميرا', d:'زووم مع بلور شعاعي من النص، إحساس سرعة.'},
  {id:'spinBlur',    ar:'لف ببلور',       en:'Spin Blur',      g:'لف',     d:'لف ربع لفة مع بلور دوراني.'},
  {id:'rotate90',    ar:'ربع لفّة',        en:'Rotate 90',      g:'لف',     d:'لفة ربع دايرة حادة.'},
  {id:'scrollLeft',  ar:'سكرول شمال',     en:'Scroll Left',    g:'سلايد',  d:'الصورة بتتلف وتكرر نفسها وهي ماشية (Offset).'},
  {id:'scrollRight', ar:'سكرول يمين',     en:'Scroll Right',   g:'سلايد',  d:'سكرول لانهائي ناحية اليمين.'},
  {id:'scrollUp',    ar:'سكرول لفوق',     en:'Scroll Up',      g:'سلايد',  d:'سكرول لانهائي لفوق.'},
  {id:'scrollDown',  ar:'سكرول لتحت',     en:'Scroll Down',    g:'سلايد',  d:'سكرول لانهائي لتحت.'},
  {id:'blurDissolve',ar:'بلور ديسولف',    en:'Blur Dissolve',  g:'كاميرا', d:'الصورة بتتبلور وتطلع منها التانية.'},
  {id:'strobe',      ar:'ستروب',          en:'Strobe',         g:'ضوء',    d:'وميض أبيض متقطع سريع.'},
  {id:'lightSweep',  ar:'شعاع ضوء',       en:'Light Sweep',    g:'ضوء',    d:'شريط ضوء ناعم بيعدّي بالعرض.'},
  {id:'filmBurn',    ar:'حرق فيلم',       en:'Film Burn',      g:'ضوء',    d:'حرق فيلم برتقالي بيرعش على القطع.'},
  {id:'flare',       ar:'لينس فلير',      en:'Lens Flare',     g:'ضوء',    d:'فلير عدسة بيعدّي على الكادر.'},
  {id:'circleCorner',ar:'دايرة من الركن', en:'Corner Circle',  g:'أشكال',  d:'دايرة بلونك بتكبر من الركن.'},
  {id:'stripes',     ar:'شرايط مايلة',    en:'Diagonal Stripes',g:'أشكال', d:'شرايط مايلة بتعدي ورا بعض.'},
  {id:'dots',        ar:'نقط',            en:'Dots',           g:'أشكال',  d:'شبكة نقط بتكبر لحد ما تغطي الكادر.'},
  {id:'brush',       ar:'فرشاة',          en:'Brush Stroke',   g:'أشكال',  d:'ضربة فرشاة تقيلة بتترسم على الكادر.'},
  {id:'doubleWipe',  ar:'مسح مزدوج',      en:'Double Wipe',    g:'أشكال',  d:'لونين بيمسحوا ورا بعض.'},
  {id:'squares',     ar:'مربعات',         en:'Squares',        g:'أشكال',  d:'مربعات بتكبر وتلف لحد ما تغطي.'},
  {id:'panels',      ar:'بانلات',         en:'Panels',         g:'أشكال',  d:'تلات شرايط أفقية بتمشي عكس بعض.'}
]);

/* --------------------------------------------------------- motion presets */
add(D.MOTION, [
  {id:'flipY',      ar:'قلب أفقي 3D',   en:'Flip Y 3D',        g:'3D', kind:'in', ease:'expo', tr:{ry:-90, op:0}, three:true},
  {id:'flipX',      ar:'قلب رأسي 3D',   en:'Flip X 3D',        g:'3D', kind:'in', ease:'expo', tr:{rx:90, op:0}, three:true},
  {id:'flipYBack',  ar:'قلب بأوفرشوت',  en:'Flip Overshoot',   g:'3D', kind:'in', ease:'back', tr:{ry:-100}, three:true},
  {id:'tumble',     ar:'شقلبة 3D',      en:'Tumble 3D',        g:'3D', kind:'in', ease:'expo', tr:{rx:-60, ry:60, s:40, op:0}, three:true},
  {id:'spin3D',     ar:'لف 3D كامل',    en:'Spin 3D',          g:'3D', kind:'in', ease:'expo', tr:{ry:-360, op:0}, three:true},

  {id:'jaws',       ar:'فكوك',          en:'Jaws',             g:'مسح متقدم', kind:'in', ease:'cubic', tr:{cc:100}, cc:'CC Jaws'},
  {id:'gridWipe',   ar:'مسح شبكة',      en:'Grid Wipe',        g:'مسح متقدم', kind:'in', ease:'cubic', tr:{cc:100}, cc:'CC Grid Wipe'},
  {id:'twister',    ar:'تويستر',        en:'Twister',          g:'مسح متقدم', kind:'in', ease:'cubic', tr:{cc:100}, cc:'CC Twister'},
  {id:'radialScale',ar:'دايرة بتكبر',   en:'Radial Scale Wipe',g:'مسح متقدم', kind:'in', ease:'cubic', tr:{cc:100}, cc:'CC Radial ScaleWipe'},
  {id:'lineSweep',  ar:'خط مايل',       en:'Line Sweep',       g:'مسح متقدم', kind:'in', ease:'cubic', tr:{cc:100}, cc:'CS LineSweep'},
  {id:'lightWipe',  ar:'مسح ضوئي',      en:'Light Wipe',       g:'مسح متقدم', kind:'in', ease:'cubic', tr:{cc:100}, cc:'CC Light Wipe'},
  {id:'blockDiss',  ar:'بلوكات',        en:'Block Dissolve',   g:'مسح متقدم', kind:'in', ease:'cubic', tr:{block:100}},
  {id:'lumaDiss',   ar:'ديسولف إضاءة',  en:'Luma Dissolve',    g:'مسح متقدم', kind:'in', ease:'cubic', tr:{luma:100}},

  {id:'stamp',      ar:'ختم',           en:'Stamp',            g:'متقدم', kind:'in', ease:'expo',    tr:{s:300, op:0}},
  {id:'zoomSpin',   ar:'زووم ولف ببلور',en:'Zoom Spin Blur',   g:'متقدم', kind:'in', ease:'expo',    tr:{s:0, r:-360, bl:20}},
  {id:'slideRotate',ar:'سلايد ولف',     en:'Slide Rotate',     g:'متقدم', kind:'in', ease:'back',    tr:{x:-400, r:-30, op:0}},
  {id:'tiltIn',     ar:'ميلان',         en:'Tilt In',          g:'متقدم', kind:'in', ease:'expo',    tr:{sk:-25, r:-8, y:120, op:0}},
  {id:'riseBlur',   ar:'طلوع ببلور',    en:'Rise Blur',        g:'متقدم', kind:'in', ease:'expo',    tr:{y:160, bl:30, op:0}},
  {id:'fallBlur',   ar:'نزول ببلور',    en:'Fall Blur',        g:'متقدم', kind:'in', ease:'expo',    tr:{y:-160, bl:30, op:0}},
  {id:'stretchIn',  ar:'مطّ مطاطي',     en:'Elastic Stretch',  g:'متقدم', kind:'in', ease:'elastic', tr:{sx:300, sy:30, op:0}},
  {id:'dropElastic',ar:'نزول مطاطي',    en:'Elastic Drop',     g:'متقدم', kind:'in', ease:'elastic', tr:{y:-300, op:0}},
  {id:'glide',      ar:'انزلاق ناعم',   en:'Glide',            g:'متقدم', kind:'in', ease:'expo',    tr:{x:600, db:60}, dbDir:90},
  {id:'pendulumIn', ar:'بندول',         en:'Pendulum In',      g:'متقدم', kind:'in', ease:'elastic', tr:{r:60}},
  {id:'blurScale',  ar:'تصغير ببلور',   en:'Blur Scale',       g:'متقدم', kind:'in', ease:'cubic',   tr:{s:130, bl:25, op:0}},
  {id:'bounceScale',ar:'نطّ وتكبير',    en:'Bounce Scale',     g:'متقدم', kind:'in', ease:'back',    tr:{s:20, y:-120, op:0}},

  {id:'swingOnce',  ar:'مرجحة',         en:'Swing',            g:'تأكيد', kind:'emph', keys:{r:[[0,0],[0.2,15],[0.4,-10],[0.6,5],[0.8,-5],[1,0]]}},
  {id:'nod',        ar:'هزّة راس',       en:'Nod',              g:'تأكيد', kind:'emph', keys:{y:[[0,0],[0.25,18],[0.5,0],[0.75,10],[1,0]]}},
  {id:'spinOnce',   ar:'لفّة كاملة',     en:'Spin Once',        g:'تأكيد', kind:'emph', keys:{r:[[0,0],[1,360]]}},
  {id:'squeeze',    ar:'عصرة',          en:'Squeeze',          g:'تأكيد', kind:'emph', keys:{sx:[[0,100],[0.35,70],[0.7,108],[1,100]], sy:[[0,100],[0.35,125],[0.7,95],[1,100]]}},
  {id:'headShake',  ar:'لأ لأ',         en:'Head Shake',       g:'تأكيد', kind:'emph', keys:{x:[[0,0],[0.15,-14],[0.35,14],[0.55,-10],[0.75,6],[1,0]], r:[[0,0],[0.15,-3],[0.35,3],[0.55,-2],[1,0]]}},
  {id:'popTwice',   ar:'بوب مرتين',     en:'Double Pop',       g:'تأكيد', kind:'emph', keys:{s:[[0,100],[0.2,115],[0.4,100],[0.6,112],[1,100]]}},

  {id:'pendulum',   ar:'بندول مستمر',   en:'Pendulum',         g:'لوب', kind:'loop', ex:{r:'value + Math.sin(time*2*Math.PI*0.7)*15'}, lp:function(t){ return {r:Math.sin(t*2*Math.PI*0.7)*15}; }},
  {id:'driftX',     ar:'سرحان أفقي',    en:'Drift',            g:'لوب', kind:'loop', ex:{pos:'var k = thisComp.height/1080;\nvalue + [Math.sin(time*2*Math.PI*0.3)*40*k, 0];'}, lp:function(t){ return {x:Math.sin(t*2*Math.PI*0.3)*40}; }},
  {id:'figure8',    ar:'رقم 8',         en:'Figure 8',         g:'لوب', kind:'loop', ex:{pos:'var k = thisComp.height/1080, a = time*2*Math.PI*0.4;\nvalue + [Math.sin(a)*45*k, Math.sin(2*a)*22*k];'}, lp:function(t){ var a=t*2*Math.PI*0.4; return {x:Math.sin(a)*45, y:Math.sin(2*a)*22}; }},
  {id:'flickerRand',ar:'رعشة ضوء',      en:'Flicker',          g:'لوب', kind:'loop', ex:{op:'seedRandom(Math.floor(time*12), true);\nvalue * (random() > 0.15 ? 1 : 0.3)'}, lp:function(t){ var x=Math.sin(Math.floor(t*12)*127.1)*43758.5; x-=Math.floor(x); return {op:x>0.15?100:30}; }},
  {id:'tiltLoop',   ar:'ميلان مستمر',   en:'Tilt Loop',        g:'لوب', kind:'loop', ex:{sk:'value + Math.sin(time*2*Math.PI*0.8)*10'}, lp:function(t){ return {sk:Math.sin(t*2*Math.PI*0.8)*10}; }},
  {id:'wobbleLoop', ar:'تمايل عشوائي',  en:'Wobble Loop',      g:'لوب', kind:'loop', ex:{r:'wiggle(1.5, 6)'}, lp:function(t){ return {r:noise(t*1.5,4)*6}; }}
]);

/* ----------------------------------------------------------- text presets */
add(D.TEXTS, [
  {id:'zoomLetters', ar:'زووم الحروف',     en:'Zoom Letters',   g:'ظهور', op:0, sc:400, blur:[20,20]},
  {id:'focusIn',     ar:'تركيز',           en:'Focus In',       g:'ظهور', blur:[60,60]},
  {id:'trackWide',   ar:'تباعد واسع',      en:'Wide Tracking',  g:'ظهور', op:0, trk:400, blur:[12,12]},
  {id:'slideTight',  ar:'طلوع خفيف',       en:'Soft Rise',      g:'ظهور', op:0, pos:[0,35]},
  {id:'flipScale',   ar:'فرد الحروف',      en:'Unfold X',       g:'حركة', op:0, scv:[0,100]},
  {id:'stretchY',    ar:'طلوع رأسي',       en:'Stretch Y',      g:'حركة', op:0, scv:[100,0]},
  {id:'rotateDrop',  ar:'لف ونزول',        en:'Rotate Drop',    g:'حركة', op:0, rot:-45, pos:[0,-80]},
  {id:'spinLetters', ar:'لف الحروف',       en:'Spin Letters',   g:'حركة', op:0, rot:360},
  {id:'bounceLetters',ar:'نطّ الحروف',     en:'Bounce Letters', g:'حركة', op:0, pos:[0,-150], overshoot:true},
  {id:'skewLeft',    ar:'سلايد مايل',      en:'Skew Slide',     g:'حركة', op:0, skew:-40, pos:[-80,0]},
  {id:'letterRain',  ar:'مطر حروف',        en:'Letter Rain',    g:'عشوائي', op:0, pos:[0,-300], random:true},
  {id:'randomScaleBlur',ar:'تكبير عشوائي', en:'Random Zoom',    g:'عشوائي', op:0, sc:250, blur:[18,18], random:true},
  {id:'randomRotate',ar:'لف عشوائي',       en:'Random Rotate',  g:'عشوائي', op:0, rot:90, random:true},
  {id:'jitterText',  ar:'رعشة قوية',       en:'Strong Jitter',  g:'لوب', loop:'wiggle', pos:[0,40], rot:20},
  {id:'waveBig',     ar:'موجة كبيرة',      en:'Big Wave',       g:'لوب', loop:'wave', pos:[0,-60]},
  {id:'pulseText',   ar:'نبض الحروف',      en:'Pulse Wave',     g:'لوب', loop:'wave', sc:135}
]);
D.STAGGER = [['normal','من الأول'],['reverse','من الآخر'],['center','من النص'],['edges','من الأطراف'],['shuffle','عشوائي']];

/* --------------------------------------------------------------- titles */
add(D.TITLES, [
  {id:'splitWords', ar:'كلمتين عكس بعض', en:'Split Words', g:'تايبوجرافي', place:'center', lines:['اتنين','كلمتين'], parts:[
    {t:'text', key:0, x:0, y:-70, size:130, bold:true, in:['fromLeft',24,0], out:['fromRight',14,0]},
    {t:'text', key:1, x:0, y:70, size:130, bold:true, c:'acc', in:['fromRight',24,4], out:['fromLeft',14,0]}]},
  {id:'stackWords', ar:'كلام فوق بعض', en:'Stacked', g:'تايبوجرافي', place:'center', lines:['فكّر','اعمل','كرّر'], parts:[
    {t:'text', key:0, x:0, y:-130, size:110, bold:true, in:['overBottom',20,0], out:['fade',10,8]},
    {t:'text', key:1, x:0, y:0, size:110, bold:true, c:'acc', in:['overBottom',20,6], out:['fade',10,4]},
    {t:'text', key:2, x:0, y:130, size:110, bold:true, in:['overBottom',20,12], out:['fade',10,0]}]},
  {id:'neonTitle', ar:'نيون', en:'Neon', g:'سينمائي', place:'center', lines:['نيون'], parts:[
    {t:'text', key:0, x:0, y:0, size:160, bold:true, c:'acc', glow:true, in:['flicker',22,0], out:['flicker',14,0]}]},
  {id:'glitchTitle', ar:'جليتش', en:'Glitch Title', g:'سينمائي', place:'center', lines:['SYSTEM ERROR'], parts:[
    {t:'rect', x:0, y:0, w:760, h:150, c:'acc', in:['blinds',14,0], out:['blinds',10,4]},
    {t:'text', key:0, x:0, y:0, size:100, bold:true, c:'#111', in:['flicker',18,4], out:['flicker',12,0]}]},
  {id:'minimal', ar:'ركن هادي', en:'Minimal Corner', g:'سينمائي', place:'top', lines:['القاهرة','٢٠٢٦'], parts:[
    {t:'rect', x:0, y:-50, w:70, h:4, c:'acc', in:['growSide',18,0], out:['growSide',12,4]},
    {t:'text', key:0, x:0, y:0, size:64, bold:true, trk:200, in:['fade',22,6], out:['fade',12,0]},
    {t:'text', key:1, x:0, y:60, size:34, c:'#aaa', trk:400, in:['fade',22,12], out:['fade',10,0]}]},
  {id:'lowerBox', ar:'لوور ثيرد ببوكس', en:'Boxed Lower Third', g:'سوشيال', place:'lower', lines:['محمود حمدي','موشن ديزاينر'], parts:[
    {t:'box', fit:0, pad:[34,18], c:'acc', r:6, in:['wipeLeft',16,0], out:['wipeRight',12,6]},
    {t:'text', key:0, x:0, y:-30, size:70, bold:true, c:'#111', align:'r', in:['fromRight',18,6], out:['fade',10,0]},
    {t:'box', fit:1, pad:[24,10], c:'#111', r:6, in:['wipeLeft',16,8], out:['wipeRight',12,0]},
    {t:'text', key:1, x:0, y:70, size:40, align:'r', in:['fromRight',18,12], out:['fade',10,0]}]},
  {id:'lowerLine', ar:'لوور ثيرد بخط', en:'Line Lower Third', g:'سوشيال', place:'lower', lines:['اسم الضيف','وصف قصير'], parts:[
    {t:'text', key:0, x:0, y:-36, size:72, bold:true, align:'r', in:['fromBottom',20,0], out:['fromBottom',12,4]},
    {t:'rect', x:0, y:12, w:420, h:6, c:'acc', align:'r', in:['growSide',20,6], out:['growSide',12,2]},
    {t:'text', key:1, x:0, y:56, size:40, c:'#ccc', align:'r', in:['fromTop',20,10], out:['fade',10,0]}]},
  {id:'location', ar:'مكان', en:'Location Tag', g:'سوشيال', place:'lower', lines:['وسط البلد، القاهرة'], parts:[
    {t:'circle', x:0, y:0, d:70, c:'acc', align:'r', in:['elasticPop',22,0], out:['popIn',10,6]},
    {t:'circle', x:0, y:0, d:24, c:'#111', in:['popIn',14,8], out:['popIn',8,4]},
    {t:'text', key:0, x:-70, y:0, size:56, bold:true, align:'r', in:['wipeLeft',20,8], out:['wipeRight',12,0]}]},
  {id:'dateTag', ar:'تاريخ', en:'Date Pill', g:'سوشيال', place:'top', lines:['٤ نوفمبر'], parts:[
    {t:'box', fit:0, pad:[36,14], c:'#fff', r:40, in:['overScale',20,0], out:['popIn',12,4]},
    {t:'text', key:0, x:0, y:0, size:56, bold:true, c:'#111', in:['fade',14,8], out:['fade',8,0]}]},
  {id:'subscribe', ar:'اشترك', en:'Subscribe', g:'سوشيال', place:'lower', side:'c', lines:['اشترك في القناة'], parts:[
    {t:'box', fit:0, pad:[44,20], c:'#e02424', r:14, in:['overScale',22,0], out:['popIn',12,6]},
    {t:'text', key:0, x:0, y:0, size:62, bold:true, in:['fade',14,6], out:['fade',10,0]}]},
  {id:'swipeUp', ar:'اسحب لفوق', en:'Swipe Up', g:'سوشيال', place:'lower', lines:['اسحب لفوق'], side:'c', parts:[
    {t:'text', raw:'⌃', x:0, y:-90, size:120, bold:true, c:'acc', in:['fromBottom',18,0], out:['fade',10,0], loop:'bounceLoop'},
    {t:'text', key:0, x:0, y:20, size:58, bold:true, in:['fromBottom',18,6], out:['fade',10,0]}]},
  {id:'statBig', ar:'رقم ضخم', en:'Big Stat', g:'عدادات', place:'center', lines:['0','250','K'], counter:true, parts:[
    {t:'text', key:'count', x:0, y:-30, size:240, bold:true, c:'acc', in:['stamp',16,0], out:['fade',12,0]},
    {t:'text', raw:'متابع جديد', x:0, y:120, size:52, in:['fromBottom',20,10], out:['fade',10,0]}]},
  {id:'ticker', ar:'شريط أخبار', en:'News Ticker', g:'سوشيال', place:'lower', side:'c', lines:['خبر عاجل • Hamdy Motion Kit • خبر تاني •'], parts:[
    {t:'rect', x:0, y:0, w:2400, h:90, c:'acc', in:['growSide',16,0], out:['growSide',12,0]},
    {t:'text', key:0, x:0, y:0, size:52, bold:true, c:'#111', ticker:true, in:['fade',10,8], out:['fade',8,0]}]}
]);

/* -------------------------------------------------------------- elements */
add(D.ELEMENTS, [
  {id:'confetti',   ar:'كونفيتي',        en:'Confetti',        g:'أشكال', d:'قصاقيص ملونة بتنفجر وتنزل.'},
  {id:'heart',      ar:'قلب',            en:'Heart Pop',       g:'أشكال', d:'قلب بيفرقع بأوفرشوت.'},
  {id:'starBurst',  ar:'نجوم حوالين',    en:'Star Burst',      g:'أشكال', d:'لمعات بتطلع في دايرة.'},
  {id:'spinner',    ar:'تحميل دايري',    en:'Spinner',         g:'أشكال', d:'دايرة تحميل بتلف على طول.'},
  {id:'waveDots',   ar:'موجة نقط',       en:'Wave Dots',       g:'أشكال', d:'صف نقط بيتموج على طول.'},
  {id:'corners',    ar:'أركان كادر',     en:'Frame Corners',   g:'أشكال', d:'أربع أركان بتترسم حوالين الكادر.'},
  {id:'zigzag',     ar:'خط زجزاج',       en:'Zigzag',          g:'أشكال', d:'خط زجزاج بيترسم تحت الكلام.'},
  {id:'cursor',     ar:'ماوس بيدوس',     en:'Cursor Click',    g:'أشكال', d:'سهم ماوس بيدوس ومعاه موجة.'},
  {id:'bubble',     ar:'فقاعة كلام',     en:'Speech Bubble',   g:'أشكال', d:'فقاعة كلام بتفرقع.'},
  {id:'rays',       ar:'أشعة',           en:'Sun Rays',        g:'خلفيات', d:'أشعة شمس بتلف ببطء ورا الكادر.'},
  {id:'bokeh',      ar:'بوكيه',          en:'Bokeh',           g:'أوفرليز', d:'دواير ضوء ناعمة سارحة.'},
  {id:'glitchBars', ar:'شرايط جليتش',    en:'Glitch Bars',     g:'أوفرليز', d:'شرايط ديجيتال بتظهر وتختفي.'},
  {id:'burnLoop',   ar:'حرق فيلم لوب',   en:'Film Burn Loop',  g:'أوفرليز', d:'إضاءة حرق فيلم بترعش على طول.'}
]);

/* ---------------------------------------------------------- expressions */
add(D.EASES, [
  {id:'snap',       ar:'سناب',            en:'Snap 90/10',  g:'إيز', o:90, i:10},
  {id:'gentle',     ar:'هادي جداً',       en:'Gentle 50',   g:'إيز', o:50, i:50},
  {id:'elasticX',   ar:'مطاطي',           en:'Elastic',     g:'إكسبريشن', expr:true},
  {id:'loopOffset', ar:'لوب بيزيد',       en:'loopOut offset', g:'إكسبريشن', expr:true},
  {id:'loopInCycle',ar:'لوب للخلف',       en:'loopIn cycle', g:'إكسبريشن', expr:true},
  {id:'wiggleX',    ar:'ويجل أفقي بس',    en:'Wiggle X only', g:'إكسبريشن', expr:true},
  {id:'wiggleY',    ar:'ويجل رأسي بس',    en:'Wiggle Y only', g:'إكسبريشن', expr:true},
  {id:'sineY',      ar:'موجة رأسية',      en:'Sine Y',      g:'إكسبريشن', expr:true},
  {id:'pendulumDecay',ar:'بندول بيهدى',   en:'Damped Pendulum', g:'إكسبريشن', expr:true},
  {id:'posterize',  ar:'حركة متقطعة 12',  en:'posterizeTime(12)', g:'إكسبريشن', expr:true},
  {id:'flickerOp',  ar:'رعشة شفافية',     en:'Random Flicker', g:'إكسبريشن', expr:true},
  {id:'squashVel',  ar:'سكواش بالسرعة',   en:'Squash on Velocity', g:'إكسبريشن', expr:true},
  {id:'delayFollow',ar:'يتبع اللي قبله',  en:'Delay Follow', g:'إكسبريشن', expr:true},
  {id:'countUp',    ar:'عداد (Source Text)',en:'Count Up',  g:'إكسبريشن', expr:true},
  {id:'typeCursor', ar:'كتابة بمؤشر (Source Text)', en:'Typewriter Cursor', g:'إكسبريشن', expr:true}
]);

/* ---------------------------------------------------------- caption styles */
D.CAPSTYLES = [
  {id:'clean',       ar:'بسيط',              en:'Clean',          anim:'fade'},
  {id:'popWords',    ar:'كلمة كلمة بوب',      en:'Pop Words',      word:'pop'},
  {id:'karaoke',     ar:'كاريوكي',            en:'Karaoke',        word:'karaoke'},
  {id:'fillProgress',ar:'تلوين تدريجي',       en:'Progress Fill',  word:'fill'},
  {id:'bounceActive',ar:'الكلمة النشطة تكبر', en:'Active Bounce',  word:'bounce'},
  {id:'revealWords', ar:'ظهور بالكلمة',        en:'Word Reveal',    word:'reveal'},
  {id:'blurWords',   ar:'بلور بالكلمة',        en:'Blur Words',     word:'blur'},
  {id:'slideUp',     ar:'طلوع',               en:'Slide Up',       anim:'slideUp'},
  {id:'boxed',       ar:'على بوكس',           en:'Boxed',          anim:'fade', box:true},
  {id:'boxKaraoke',  ar:'بوكس كاريوكي',        en:'Box Karaoke',    word:'karaoke', box:true},
  {id:'outline',     ar:'إطار تقيل',           en:'Bold Outline',   word:'pop', stroke:true},
  {id:'single',      ar:'كلمة واحدة',          en:'One Word',       anim:'pop', maxWords:1}
];
D.CAP_LANGS = [
  ['ar-EG','عربي مصري'], ['ar','عربي فصحى'], ['ar-SA','سعودي'], ['ar-AE','إماراتي'], ['ar-KW','كويتي'], ['ar-JO','أردني'],
  ['ar-LB','لبناني'], ['ar-SY','سوري'], ['ar-IQ','عراقي'], ['ar-MA','مغربي'], ['ar-DZ','جزائري'], ['ar-TN','تونسي'], ['en','English'], ['auto','تلقائي']
];
})(NABD_DATA);
