/* HAMDY v0.9 — tracking, generative fill, trim paths tool lists */
var NABD_TOOLS2 = {
  TRK: [
    {id:'tPoint',  ar:'تراك نقطة',          en:'Track a Point',      g:'1) اعمل التراك', d:'بيفتح التراكر على الفيديو المحدد ومعاه نقطة جاهزة. حط المربع على حاجة واضحة في الكادر ودوس ▶ Analyze في بانل Tracker.', kind:'point'},
    {id:'tStab',   ar:'تراك للتثبيت',        en:'Stabilize Track',    g:'1) اعمل التراك', d:'زي اللي قبله بس مجهز للتثبيت. بعد الـ Analyze ارجع هنا واستخدم "ثبّت الكادر".', kind:'stabilize'},
    {id:'tMask',   ar:'تراك ماسك / وش',     en:'Track Mask / Face',  g:'1) اعمل التراك', d:'ارسم ماسك حوالين الوش أو الحاجة بالـ Pen أو Ellipse على الفيديو، وبعدين دوس. بيفتح تراكر الماسك على طول.', kind:'mask'},
    {id:'tCam',    ar:'تراك كاميرا 3D',      en:'3D Camera Tracker',  g:'1) اعمل التراك', d:'بيحط 3D Camera Tracker وبيبدأ التحليل لوحده في الخلفية. لما يخلص اختار نقط وكليك يمين ← Create Null and Camera.', kind:'camera'},
    {id:'tWarp',   ar:'وارب ستابلايزر',      en:'Warp Stabilizer',    g:'1) اعمل التراك', d:'تثبيت أوتوماتيك للكادر المهزوز بضغطة. التحليل بيشتغل لوحده.', kind:'warp'},
    {id:'tNull',   ar:'نل بيمشي مع التراك',  en:'Track → Null',       g:'2) استخدم التراك', d:'بيقرا التراك اللي عملته ويعمل Null مربوط بيه بإكسبريشن (لو عدّلت التراك النل بيتعدل). لو التراك فيه نقطتين بياخد اللف والحجم كمان.'},
    {id:'tAttach', ar:'اربط المحدد بالتراك', en:'Attach Selected',    g:'2) استخدم التراك', d:'حدد أي لايرات (نص، صورة، شيب) ودوس: بيتربطوا بآخر نل تراك وهيمشوا مع الحاجة.'},
    {id:'tText',   ar:'نص بيمشي مع الحاجة',  en:'Tracked Text',       g:'2) استخدم التراك', d:'بيعمل نص فوق المكان المتتبع ومربوط بيه.'},
    {id:'tCall',   ar:'عنوان بخط (Callout)', en:'Tracked Callout',    g:'2) استخدم التراك', d:'دايرة على المكان + خط بيترسم + نص، كلهم ماشيين مع التراك.'},
    {id:'tBlur',   ar:'بلور على الوش',       en:'Tracked Blur',       g:'2) استخدم التراك', d:'بلور بيضارى وش أو لوحة عربية وماشي معاها.', style:'blur'},
    {id:'tPixel',  ar:'بكسلات على الوش',     en:'Tracked Pixelate',   g:'2) استخدم التراك', d:'موزاييك (بكسلات) ماشي مع التراك.', style:'pixel'},
    {id:'tDark',   ar:'تغميق مكان',          en:'Tracked Darken',     g:'2) استخدم التراك', d:'بيغمّق المكان المتتبع (لإخفاء أو تركيز).', style:'dark'},
    {id:'tPin',    ar:'حط صورة على شاشة',    en:'Screen Replace',     g:'2) استخدم التراك', d:'لو عملت تراك Perspective بـ 4 نقط على شاشة أو لوحة: حدد الصورة/الفيديو الجديد والفيديو، ودوس. بيتركب بـ Corner Pin مربوط بالتراك.'},
    {id:'tStabUse',ar:'ثبّت الكادر',         en:'Stabilize from Track',g:'2) استخدم التراك', d:'بيثبت الفيديو على النقطة المتتبعة (ولو فيه نقطتين بيثبت اللف كمان) وبيعمل زووم بسيط يداري الأطراف.'},
    {id:'tBake',   ar:'حوّل لكي فريمز',       en:'Bake to Keyframes',  g:'3) خلّص', d:'حدد النل (أو أي لاير عليه إكسبريشن حركة) وحوّله لكي فريمز عادية تعدلها بإيدك.'}
  ],
  GF: [
    {id:'gCAF',     ar:'امسح من الفيديو كله', en:'Video Content-Aware Fill', g:'مجاني', op:'caf', mask:true, d:'مجاني جوه After Effects ومن غير نت. ارسم ماسك حوالين الحاجة على لاير الفيديو وحدده، وبعدين: 1) "جهّز وتراك" بيظبط الماسك ويفتح تراكر الماسك (دوس ▶) 2) "املا" بيفتح Content-Aware Fill (دوس Generate Fill Layer).'},
    {id:'gPS',      ar:'فوتوشوب Generative Fill', en:'Photoshop Generative Fill', g:'مجاني', op:'photoshop', mask:false, prompt:true, d:'مجاني مع اشتراك أدوبي. ارسم ماسك على الحاجة (اختياري) واكتب عايز إيه (أو سيبه فاضي عشان يمسحها). بيفتح الفريم في فوتوشوب ويعمل التحديد ويحاول يعمل Generative Fill لوحده. لما يعجبك دوس "رجّعه" وبيرجع مكانه.'},
    {id:'gErase',   ar:'امسح حاجة',          en:'Erase Object',      g:'بمفتاح', op:'erase',   mask:true,  d:'ارسم ماسك على الحاجة اللي عايز تشيلها (على لاير الفيديو) ودوس. الفريم بيتبعت ويرجع مكانه فاضي وبيتحط كرقعة على المكان بس.'},
    {id:'gFill',    ar:'حط حاجة مكانها',     en:'Generative Fill',   g:'بمفتاح', op:'fill',    mask:true,  prompt:true, d:'ارسم ماسك واكتب عايز إيه يظهر فيه (بالإنجليزي أحسن).'},
    {id:'gReplace', ar:'ابحث وبدّل',          en:'Search & Replace',  g:'بمفتاح', op:'replace', mask:false, prompt:true, search:true, d:'من غير ماسك: اكتب الحاجة اللي في الصورة والحاجة اللي عايزها مكانها.'},
    {id:'gOut',     ar:'وسّع الكادر',         en:'Generative Expand', g:'بمفتاح', op:'outpaint',mask:false, prompt:true, d:'بيكمّل الصورة برة الكادر (مثلاً تحوّل لقطة عرض لـ 9:16) وبيعمل كومب جديد بالمقاس.'},
    {id:'gBg',      ar:'شيل الخلفية',         en:'Remove Background', g:'بمفتاح', op:'removebg',mask:false, d:'بيشيل خلفية الفريم الحالي ويرجعه PNG شفاف.'}
  ],
  TRIM: [
    {id:'mDraw',   ar:'يترسم',             en:'Draw On',          g:'أساسي',   style:'draw'},
    {id:'mDE',     ar:'يترسم ويتمسح',       en:'Draw & Erase',     g:'أساسي',   style:'drawErase'},
    {id:'mCenter', ar:'من النص للأطراف',     en:'From Center',      g:'أساسي',   style:'center'},
    {id:'mRev',    ar:'من الآخر',           en:'Reverse Draw',     g:'أساسي',   style:'reverse'},
    {id:'mErase',  ar:'يتمسح',             en:'Erase',            g:'أساسي',   style:'erase'},
    {id:'mChase',  ar:'مطاردة',             en:'Chase',            g:'حركة',    style:'chase'},
    {id:'mTravel', ar:'لوب ماشي',           en:'Travel Loop',      g:'حركة',    style:'travel'},
    {id:'mOne',    ar:'واحدة واحدة',         en:'One by One',       g:'حركة',    style:'draw', individual:true},
    {id:'mLogo',   ar:'ظهور لوجو',          en:'Logo Reveal',      g:'جاهز',    style:'draw', addStroke:true, fillAfter:true, strokeFade:true},
    {id:'mHand',   ar:'كتابة بخط اليد',      en:'Handwriting Text', g:'جاهز',    style:'draw', addStroke:true, individual:true, fillAfter:true, strokeFade:true},
    {id:'mOutline',ar:'إطار بيلف حوالين',    en:'Outline Chase',    g:'جاهز',    style:'travel', addStroke:true}
  ]
};

/* overlay transitions (generated clips: film burn, light leaks, flashes, glitch, spray, ink, paper…) */
if(typeof HMK_OTR !== 'undefined' && typeof NABD_DATA !== 'undefined'){
  NABD_DATA.OTR = HMK_OTR.map(function(o){
    return {id:'otr_' + o.id, ar:o.ar, en:o.en, g:o.g, otr:o,
      d: o.kind==='light' ? 'فيديو أوفرلي بيتحط بين الكليبين بـ Screen، أقوى لحظة فيه على القطع.' : 'فيديو بيغطي الشاشة في نصه ومعاه ماسك Luma، بيخفي القديم ويكشف الجديد.'};
  });
  Array.prototype.unshift.apply(NABD_DATA.TRANSITIONS, NABD_DATA.OTR);
}

/* advanced text animations: per-character combos + effect-based reveals (blur, glitch, wave, blinds, wipe, glow, echo, liquid…).
   fx: [{m: effect matchName, k: [[param, start, rest, scaleWithSize?]], s: [[param, value]], x: [[param, expression]], once: keep only one copy}]
   pv: preview hints for the panel (CSS approximations). */
(function(D){
  if(!D) return;
  var CEN = 'var r = sourceRectAtTime(time, false);\n[r.left + r.width / 2, r.top + r.height / 2]';
  var G1 = 'إفكتات نص', G2 = 'حركات أدفانسد';
  [
    {id:'axBlurIn',   ar:'ظهور بلور سينمائي', en:'Cinematic Blur In', g:G1, op:0, sc:112, fx:[{m:'ADBE Gaussian Blur 2', k:[[1, 60, 0, 1]], s:[[3, 1]]}], pv:['blur']},
    {id:'axZoom',     ar:'انفجار زووم',        en:'Zoom Blast',        g:G1, op:0, sc:180, fx:[{m:'CC Radial Fast Blur', x:[[1, CEN]], k:[[2, 90, 0]]}], pv:['zoom']},
    {id:'axGlitch',   ar:'دخول جليتش',         en:'Glitch In',         g:G1, op:0, square:true, random:true, fx:[{m:'ADBE Turbulent Displace', s:[[3, 40], [5, 1.5]], x:[[6, 'time * 600']], k:[[2, 140, 0, 1]]}], pv:['rgb', 'turb']},
    {id:'axSmoke',    ar:'دخان',               en:'Smoke In',          g:G1, op:0, random:true, blur:[40, 40], fx:[{m:'ADBE Turbulent Displace', s:[[3, 80], [5, 3]], x:[[6, 'time * 120']], k:[[2, 120, 0, 1]]}], pv:['turb']},
    {id:'axWave',     ar:'موجة مية',           en:'Liquid Wave',       g:G1, op:0, pos:[0, 30], fx:[{m:'ADBE Wave Warp', s:[[3, 90], [5, 2]], k:[[2, 40, 0, 1]]}], pv:['wave']},
    {id:'axLiquid',   ar:'سايل (Liquid)',      en:'Liquid Melt',       g:G1, fx:[{m:'ADBE Gaussian Blur 2', k:[[1, 40, 0, 1]], s:[[3, 1]]}, {m:'ADBE Simple Choker', k:[[2, 25, 0]]}], pv:['liquid']},
    {id:'axBlinds',   ar:'شيش (Blinds)',       en:'Venetian Blinds',   g:G1, fx:[{m:'ADBE Venetian Blinds', s:[[2, 0], [3, 14], [4, 2]], k:[[1, 100, 0]]}], pv:['blinds']},
    {id:'axWipeR',    ar:'مسح من اليمين',      en:'Soft Wipe ←',       g:G1, fx:[{m:'ADBE Linear Wipe', s:[[2, 90], [3, 120]], k:[[1, 100, 0]]}], pv:['wipeR']},
    {id:'axWipeL',    ar:'مسح من الشمال',      en:'Soft Wipe →',       g:G1, fx:[{m:'ADBE Linear Wipe', s:[[2, 270], [3, 120]], k:[[1, 100, 0]]}], pv:['wipe']},
    {id:'axRadial',   ar:'مسح دائري',          en:'Clock Wipe',        g:G1, fx:[{m:'ADBE Radial Wipe', x:[[3, CEN]], s:[[5, 30]], k:[[1, 100, 0]]}], pv:['radial']},
    {id:'axDissolve', ar:'ذوبان بكسلات',       en:'Block Dissolve',    g:G1, fx:[{m:'ADBE Block Dissolve', s:[[2, 14], [3, 14], [5, 0]], k:[[1, 100, 0]]}], pv:['dissolve']},
    {id:'axGlow',     ar:'وهج',                en:'Glow Burst',        g:G1, op:0, sc:120, fx:[{m:'ADBE Glo2', s:[[3, 60]], k:[[4, 4, 0]]}], pv:['glow']},
    {id:'axNeon',     ar:'نيون بيرعش',         en:'Neon Flicker',      g:G1, op:0, square:true, random:true, fx:[{m:'ADBE Glo2', s:[[3, 25], [4, 1.5]], once:true}], pv:['neon', 'flicker']},
    {id:'axEcho',     ar:'ذيل حركة (Echo)',    en:'Echo Trail',        g:G1, op:0, pos:[-250, 0], blur:[30, 0], fx:[{m:'ADBE Echo', s:[[1, -0.033], [3, 0.8], [4, 0.7], [5, 5]], k:[[2, 8, 0]]}], pv:['echo']},
    {id:'axSpeed',    ar:'سرعة ومط',           en:'Speed Stretch',     g:G2, op:0, pos:[-320, 0], scv:[260, 60], blur:[40, 0]},
    {id:'axCascade',  ar:'شلال 3D',            en:'3D Cascade',        g:G2, three:true, rx:-90, pos:[0, -40], op:0},
    {id:'axSpin',     ar:'لف 3D',              en:'Spin 3D',           g:G2, three:true, ry:180, op:0, sc:70},
    {id:'axFlip',     ar:'لوحة مطار',          en:'Flipboard',         g:G2, three:true, rx:90, square:true, chOff:8, latin:true},
    {id:'axSlot',     ar:'سلوت ماشين',         en:'Slot Roll',         g:G2, chOff:30, pos:[0, -50], blur:[0, 30], op:0, latin:true},
    {id:'axStretch',  ar:'مطّة وفرقعة',        en:'Rubber Pop',  g:G2, scv:[60, 0], overshoot:true},
    {id:'axDrop',     ar:'وقعة من فوق',        en:'Sky Drop',       g:G2, pos:[0, -260], op:0, overshoot:true},
    {id:'axExplode',  ar:'انفجار حروف',        en:'Letter Explode',    g:G2, random:true, rot:-180, sc:0, pos:[0, 80], blur:[20, 20], op:0},
    {id:'axSkew',     ar:'ميل سريع',           en:'Skew Slide',        g:G2, skew:-40, pos:[200, 0], op:0, blur:[30, 0]}
  ].forEach(function(t){ D.TEXTS.push(t); });
})(typeof NABD_DATA !== 'undefined' ? NABD_DATA : null);

/* depth 3D (multiplane camera moves) */
if(typeof NABD_TOOLS2 !== 'undefined'){
  NABD_TOOLS2.DEPTH = [
    {id:'dPush',  move:'push',  ar:'دخول للمشهد',  en:'Push In',        g:'حركات كاميرا', d:'الكاميرا بتدخل لجوه والطبقات بتفترق عن بعض.'},
    {id:'dPull',  move:'pull',  ar:'رجوع لورا',          en:'Pull Out',       g:'حركات كاميرا', d:'الكاميرا بترجع لورا. لو الأطراف بانت زوّد «تكبير الخلفية».'},
    {id:'dPanL',  move:'panL',  ar:'بان لشمال',     en:'Parallax Pan ←', g:'حركات كاميرا', d:'الكاميرا بتتحرك بالعرض والقريب بيتحرك أسرع من البعيد.'},
    {id:'dPanR',  move:'panR',  ar:'بان ليمين',     en:'Parallax Pan →', g:'حركات كاميرا', d:'نفس البان بس للناحية التانية.'},
    {id:'dRise',  move:'rise',  ar:'طلوع (كرين)',   en:'Crane Up',       g:'حركات كاميرا', d:'الكاميرا بتطلع لفوق وهي داخلة شوية.'},
    {id:'dOrbit', move:'orbit', ar:'لفة خفيفة',     en:'Orbit',          g:'حركات كاميرا', d:'الكاميرا بتلف حوالين المشهد لفة صغيرة.'},
    {id:'dPushOrbit', move:'pushOrbit', ar:'دخول ولف', en:'Push + Orbit', g:'حركات كاميرا', d:'دخول مع لفة خفيفة، شكلها سينمائي.'},
    {id:'dDolly', move:'dolly', ar:'دولي زووم',     en:'Dolly Zoom (Vertigo)', g:'حركات كاميرا', d:'الكاميرا بتدخل والزووم بيوسع، فاللي في النص ثابت والخلفية بتتمط.'},
    {id:'dFloat', move:'float', ar:'طفو (لوب)',      en:'Float Loop',     g:'لوب', d:'حركة طفو هادية على طول الكومب. قوتها من HAMDY Move Amount.'},
    {id:'dShake', move:'shake', ar:'كاميرا إيد',     en:'Handheld',       g:'لوب', d:'اهتزاز كاميرا إيد طبيعي على طول الكومب.'},
    {id:'dNone',  move:'none',  ar:'عمق بس',         en:'Depth Only',     g:'لوب', d:'بيعمل العمق والكاميرا من غير حركة، وإنت تحرك HAMDY DEPTH RIG بنفسك.'}
  ];
}
