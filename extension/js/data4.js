/* HAMDY Motion Kit v0.6 — typewriter family, layered text styles, extra motions, rendered asset items */
(function(D){
function add(list, items){ items.forEach(function(x){ list.push(x); }); }

/* --------------------------------------------------------- typewriter */
D.TEXTS.forEach(function(t){ if(t.id==='typewriter'){ t.g = 'آلة كاتبة'; t.ar = 'آلة كاتبة كلاسيك'; } });
add(D.TEXTS, [
  // real typing through Source Text (Arabic letters stay connected while typing)
  {id:'typeReal',   ar:'كتابة حقيقية',       en:'Real Typing',        g:'آلة كاتبة', src:{mode:'chars', cur:''}},
  {id:'typeBar',    ar:'كتابة بمؤشر |',      en:'Typing + Bar Cursor',g:'آلة كاتبة', src:{mode:'chars', cur:'|'}},
  {id:'typeUnder',  ar:'كتابة بمؤشر _',      en:'Typing + Underscore',g:'آلة كاتبة', src:{mode:'chars', cur:'_'}},
  {id:'typeBlock',  ar:'تيرمينال █',         en:'Terminal Block',     g:'آلة كاتبة', src:{mode:'chars', cur:'█'}},
  {id:'typeWords',  ar:'كلمة كلمة',          en:'Word by Word',       g:'آلة كاتبة', src:{mode:'words', cur:''}},
  {id:'typeLines',  ar:'سطر سطر',            en:'Line by Line',       g:'آلة كاتبة', src:{mode:'lines', cur:''}},
  {id:'typeErase',  ar:'كتابة ومسح',         en:'Type & Erase',       g:'آلة كاتبة', src:{mode:'chars', cur:'', erase:true}},
  {id:'typeEraseBar',ar:'كتابة ومسح بمؤشر',  en:'Type & Erase + Cursor',g:'آلة كاتبة', src:{mode:'chars', cur:'|', erase:true}},
  // per-letter reveal with a twist (timed by typing speed)
  {id:'typePop',    ar:'كتابة بوب',          en:'Pop Typing',         g:'آلة كاتبة', op:0, sc:0, tw:true, twEase:'back', twDur:0.24},
  {id:'typeBlur',   ar:'كتابة ببلور',        en:'Blur Typing',        g:'آلة كاتبة', op:0, blur:[25,25], tw:true, twDur:0.28},
  {id:'typeDrop',   ar:'كتابة نازلة',        en:'Drop Typing',        g:'آلة كاتبة', op:0, pos:[0,-50], tw:true, twEase:'back', twDur:0.24},
  {id:'typeRise',   ar:'كتابة طالعة',        en:'Rise Typing',        g:'آلة كاتبة', op:0, pos:[0,35], tw:true, twDur:0.22},
  {id:'typeZoom',   ar:'كتابة بزووم',        en:'Zoom Typing',        g:'آلة كاتبة', op:0, sc:300, blur:[10,10], tw:true, twDur:0.22},
  {id:'typeSpin',   ar:'كتابة بلفّة',         en:'Spin Typing',        g:'آلة كاتبة', op:0, rot:-90, sc:40, tw:true, twEase:'back', twDur:0.26},
  {id:'typeFlash',  ar:'كتابة بلون',         en:'Color Flash Typing', g:'آلة كاتبة', op:0, tw:true, twDur:0.06, trail:{fill:true}},
  {id:'typeRandom', ar:'كتابة عشوائية',      en:'Random Typing',      g:'آلة كاتبة', op:0, tw:true, twOrder:'random', twDur:0.08},
  {id:'typeCenter', ar:'كتابة من النص',      en:'Center-out Typing',  g:'آلة كاتبة', op:0, sc:0, tw:true, twOrder:'center', twEase:'back', twDur:0.22},
  {id:'typeDecode', ar:'كتابة بشفرة',        en:'Decode Typing',      g:'آلة كاتبة', op:0, tw:true, twDur:0.05, trail:{chOff:24}, latin:true, d:'الحروف بتتلخبط وبعدين تثبت (للإنجليزي بس).'}
]);
D.TYPE_SPEED = [[8,'بطيء'],[14,'عادي'],[22,'سريع'],[35,'سريع جداً']];

/* --------------------------------------------------------- more motions */
add(D.MOTION, [
  {id:'lightSpeed', ar:'سرعة الضوء',    en:'Light Speed',     g:'متقدم', kind:'in', ease:'expo',    tr:{x:700, sk:35, op:0}},
  {id:'rollIn',     ar:'دحرجة',         en:'Roll In',         g:'متقدم', kind:'in', ease:'expo',    tr:{x:-500, r:-120, op:0}},
  {id:'jackBox',    ar:'علبة مفاجأة',   en:'Jack in the Box', g:'متقدم', kind:'in', ease:'elastic', tr:{s:10, r:30, op:0}},
  {id:'backInUp',   ar:'رجوع لفوق',     en:'Back In Up',      g:'متقدم', kind:'in', ease:'back',    tr:{y:600, s:70, op:0}},
  {id:'zoomInDown', ar:'زووم من فوق',   en:'Zoom In Down',    g:'متقدم', kind:'in', ease:'expo',    tr:{s:10, y:-500, op:0}},
  {id:'bounceBig',  ar:'بوب ضخم',       en:'Big Bounce',      g:'متقدم', kind:'in', ease:'elastic', tr:{s:30, op:0}},
  {id:'flipInX',    ar:'قلب 3D بأوفرشوت',en:'Flip In X',      g:'3D',    kind:'in', ease:'back',    tr:{rx:90, op:0}, three:true},
  {id:'unfoldY',    ar:'فرد 3D',        en:'Unfold 3D',       g:'3D',    kind:'in', ease:'expo',    tr:{ry:90, s:80, op:0}, three:true},
  {id:'jello',      ar:'جيلو',          en:'Jello',           g:'تأكيد', kind:'emph', keys:{sx:[[0,100],[0.22,125],[0.44,82],[0.66,110],[0.83,96],[1,100]], sy:[[0,100],[0.22,78],[0.44,118],[0.66,92],[0.83,103],[1,100]]}}
]);

/* ------------------------------------------------------ layered styles */
// layers: extra copies under the text, linked to it (fill/stroke/sw/dx/dy)
// extrude: {n, dx, dy, c, c2} stacked copies shading from c to c2
add(D.TSTYLES, [
  {id:'doubleOut',  ar:'إطار مزدوج',       en:'Double Outline',  g:'طبقات', fill:'#ffffff', stroke:'#111111', sw:8, layers:[{fill:'#111111', stroke:'acc', sw:24}]},
  {id:'tripleOut',  ar:'إطار تلاتي',       en:'Triple Outline',  g:'طبقات', fill:'#ffffff', stroke:'#111111', sw:6, layers:[{fill:'#111111', stroke:'#ffd400', sw:18}, {fill:'#111111', stroke:'#111111', sw:30}]},
  {id:'candy',      ar:'كاندي',            en:'Candy',           g:'طبقات', fill:'#ff5fa2', stroke:'#ffffff', sw:10, layers:[{fill:'#ff2d7a', stroke:'#ff2d7a', sw:24}]},
  {id:'bubbleGum',  ar:'لبانة',            en:'Bubble Gum',      g:'طبقات', fill:'#ffffff', stroke:'#ff7ac6', sw:12, layers:[{fill:'#ffffff', stroke:'#ffffff', sw:26}], shadow:{c:'#000000', op:35, d:6, s:10}},
  {id:'goldOutline',ar:'ذهبي بإطارين',     en:'Gold Double',     g:'طبقات', grad:['#fff0b3','#c8901f'], stroke:'#2b1d00', sw:6, layers:[{fill:'#2b1d00', stroke:'#fff3c0', sw:16}]},
  {id:'neonDouble', ar:'نيون مزدوج',       en:'Neon Double',     g:'طبقات', fill:null, stroke:'#ffffff', sw:3, glow:{th:20, r:22, i:1.6}, layers:[{fill:null, stroke:'#ff4fd8', sw:12}]},
  {id:'retroStack', ar:'ريترو طبقات',      en:'Retro Stack',     g:'طبقات', fill:'#ffffff', layers:[{fill:'#ff3c6e', dx:4, dy:4}, {fill:'#2bd2ff', dx:8, dy:8}, {fill:'#ffd400', dx:12, dy:12}]},
  {id:'shadowStack',ar:'ظل متدرج',         en:'Stepped Shadow',  g:'طبقات', fill:'#ffffff', layers:[{fill:'#777777', dx:6, dy:6}, {fill:'#444444', dx:12, dy:12}, {fill:'#1a1a1a', dx:18, dy:18}]},
  {id:'outlineEcho',ar:'إطارات صدى',       en:'Outline Echo',    g:'طبقات', fill:null, stroke:'#ffffff', sw:3, layers:[{fill:null, stroke:'acc', sw:3, dx:7, dy:7}, {fill:null, stroke:'#ff3c6e', sw:3, dx:14, dy:14}]},
  {id:'duoTone',    ar:'لونين',            en:'Duotone Offset',  g:'طبقات', fill:'#2bd2ff', layers:[{fill:'#ff3c6e', dx:-6, dy:0}]},
  {id:'pastelStack',ar:'باستيل طبقات',     en:'Pastel Stack',    g:'طبقات', fill:'#ffd6e8', layers:[{fill:'#c3f0ff', dx:6, dy:6}]},
  {id:'extrudeAcc', ar:'3D بلونك',         en:'Extrude Accent',  g:'3D بارز', fill:'acc', extrude:{n:10, dx:1.4, dy:1.6, c:'acc', c2:'#1a0c06'}},
  {id:'extrudeWhite',ar:'3D أبيض',         en:'Extrude White',   g:'3D بارز', fill:'#ffffff', extrude:{n:12, dx:1.2, dy:1.6, c:'#b8b8b8', c2:'#2a2a2a'}},
  {id:'extrudeGold',ar:'3D ذهبي',          en:'Extrude Gold',    g:'3D بارز', grad:['#fff0b3','#d9a43a'], extrude:{n:12, dx:1.2, dy:1.6, c:'#a8741a', c2:'#2d1f05'}},
  {id:'extrudeRed', ar:'3D أحمر',          en:'Extrude Red',     g:'3D بارز', fill:'#ff3b3b', stroke:'#ffffff', sw:4, extrude:{n:10, dx:1.5, dy:1.5, c:'#b01212', c2:'#2a0000'}},
  {id:'extrudeNeon',ar:'3D نيون',          en:'Extrude Neon',    g:'3D بارز', fill:'#3de1ff', extrude:{n:10, dx:0, dy:2, c:'#1b6c9c', c2:'#061826'}, glow:{th:40, r:20, i:0.8}},
  {id:'meme',       ar:'ميم',              en:'Meme',            g:'كلاسيك', fill:'#ffffff', stroke:'#000000', sw:12, caps:true},
  {id:'netflixSub', ar:'ترجمة أفلام',      en:'Movie Subtitle',  g:'كلاسيك', fill:'#ffffff', shadow:{c:'#000000', op:90, d:2, s:6}},
  {id:'hardShadowAcc',ar:'ظل حاد بلونك',   en:'Hard Accent Shadow',g:'كلاسيك', fill:'#ffffff', shadow:{c:'acc', op:100, d:10, s:0}},
  {id:'newsRed',    ar:'عاجل',             en:'Breaking',        g:'بوكس', fill:'#ffffff', box:{c:'#c8102e', op:100, pad:[30,12], r:4}, shadow:{c:'#000000', op:50, d:3, s:6}},
  {id:'glowStroke', ar:'إطار متوهج',       en:'Glow Stroke',     g:'نيون', fill:'#111111', stroke:'acc', sw:6, glow:{th:30, r:24, i:1.2}},
  {id:'lemon',      ar:'ليمون',            en:'Lemon',           g:'جرادينت', grad:['#fffb7d','#ffb300'], stroke:'#6b3e00', sw:8},
  {id:'lava',       ar:'حمم',              en:'Lava',            g:'جرادينت', grad:['#ffdd00','#ff2a00'], stroke:'#2a0800', sw:6, glow:{th:50, r:18, i:0.8}},
  {id:'emerald',    ar:'زمرد',             en:'Emerald',         g:'جرادينت', grad:['#9cffd0','#0f8a5f'], bevel:{t:3}, shadow:{c:'#000000', op:50, d:4, s:8}},
  {id:'sakura',     ar:'ساكورا',           en:'Sakura',          g:'جرادينت', grad:['#ffe3ef','#ff7eb6'], stroke:'#ffffff', sw:8},
  {id:'steel',      ar:'حديد',             en:'Steel',           g:'جرادينت', grad:['#e6edf3','#5b6672'], stroke:'#1a1f24', sw:4, bevel:{t:3}},
  {id:'royal',      ar:'ملكي',             en:'Royal',           g:'جرادينت', grad:['#c9a0ff','#5a1ea8'], stroke:'#ffd76b', sw:4}
]);

/* ------------------------------------------- rendered assets as items */
if(typeof NABD_ASSETS !== 'undefined'){
  D.MATTES = NABD_ASSETS.mattes.map(function(m){ return {id:'matte_' + m.id, ar:m.ar, en:m.en, g:'ماسكات', d:'ترانزيشن بماسك متولّد (' + m.en + '). المشهد القديم بيختفي بالشكل ده وبيبان الجديد.', matte:m}; });
  D.OVERLAYS = NABD_ASSETS.overlays.map(function(o){ return {id:'ov_' + o.id, ar:o.ar, en:o.en, g:'أوفرليز فيديو', d:'فيديو حقيقي متولّد بيتحط فوق شغلك بـ Screen.', ov:o}; });
  add(D.TRANSITIONS, D.MATTES);
  add(D.ELEMENTS, D.OVERLAYS);
}
})(NABD_DATA);
