/* NABD v0.9 — tracking, generative fill, trim paths tool lists */
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
    {id:'gErase',   ar:'امسح حاجة',          en:'Erase Object',      g:'بالذكاء الاصطناعي', op:'erase',   mask:true,  d:'ارسم ماسك على الحاجة اللي عايز تشيلها (على لاير الفيديو) ودوس. الفريم بيتبعت ويرجع مكانه فاضي وبيتحط كرقعة على المكان بس.'},
    {id:'gFill',    ar:'حط حاجة مكانها',     en:'Generative Fill',   g:'بالذكاء الاصطناعي', op:'fill',    mask:true,  prompt:true, d:'ارسم ماسك واكتب عايز إيه يظهر فيه (بالإنجليزي أحسن).'},
    {id:'gReplace', ar:'ابحث وبدّل',          en:'Search & Replace',  g:'بالذكاء الاصطناعي', op:'replace', mask:false, prompt:true, search:true, d:'من غير ماسك: اكتب الحاجة اللي في الصورة والحاجة اللي عايزها مكانها.'},
    {id:'gOut',     ar:'وسّع الكادر',         en:'Generative Expand', g:'بالذكاء الاصطناعي', op:'outpaint',mask:false, prompt:true, d:'بيكمّل الصورة برة الكادر (مثلاً تحوّل لقطة عرض لـ 9:16) وبيعمل كومب جديد بالمقاس.'},
    {id:'gBg',      ar:'شيل الخلفية',         en:'Remove Background', g:'بالذكاء الاصطناعي', op:'removebg',mask:false, d:'بيشيل خلفية الفريم الحالي ويرجعه PNG شفاف.'},
    {id:'gPS',      ar:'فوتوشوب Generative Fill', en:'Photoshop Round-trip', g:'من غير مفتاح', op:'photoshop', mask:false, d:'بيصوّر الفريم ويفتحه في فوتوشوب. اعمل Generative Fill هناك واحفظ (Ctrl+S)، وارجع دوس "رجّعه من فوتوشوب". بيتحط فوق الفيديو ولو في ماسك بيتقص عليه.'},
    {id:'gCAF',     ar:'Content-Aware Fill للفيديو', en:'Video Content-Aware Fill', g:'من غير مفتاح', op:'caf', mask:true, d:'لمسح حاجة من فيديو كامل: ارسم ماسك (واعمله تراك لو بيتحرك)، دوس، وهيتظبط الماسك Subtract ويفتحلك بانل Content-Aware Fill تدوس فيه Generate.'}
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
