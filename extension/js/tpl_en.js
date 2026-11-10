/* Hamdy Motion Kit — English sample text for template previews/defaults (used when the panel is in English). */
var HMK_TPL_EN = {
"2,340 إعجاب":"2,340 likes","آيفون":"iPhone","أحسن موشن في السنة 🎬":"Best motion of the year 🎬","أفكار جديدة كل أسبوع":"New ideas every week",
"أكبر":"Bigger","أكيد 🎬":"Sure 🎬","أهم معلومة في الفيديو":"The key fact in this video","إزاي الذكاء الاصطناعي بيغيّر شغل المصممين":"How AI is changing design work",
"إزاي تعمل موشن جرافيك احترافي":"How to make pro motion graphics","إن القلب بيدق حوالي\\n100 ألف مرة في اليوم":"Your heart beats about\\n100,000 times a day",
"استخدم الكود ده":"Use this code","اشترك":"Subscribe","اكتشاف يغيّر كل حاجة":"A discovery that changes everything","البداية":"The Start",
"التصميم مش شكل بس،\\nالتصميم طريقة تفكير":"Design isn't just looks,\\ndesign is a way of thinking","الجزء ٢: الألوان":"Part 2: Colors",
"الحقيقة اللي محدش قالهالك":"The truth nobody told you","الرحلة":"The Journey","الرياض":"Riyadh","السنة":"Year","العرض بيخلص خلال":"Offer ends in",
"الفصل ٣":"Chapter 3","القاهرة":"Cairo","المبيعات في 2026":"Sales in 2026","المنتج":"Product","الوضع الليلي":"Dark mode","بتتابعه ✓":"Following ✓",
"بسم الله":"Bismillah","بعد":"After","بوستات":"Posts","تخفيضات":"Sale","تطبيقك\\nهنا":"Your app\\nhere","تقبّل الله\\nصيامكم":"May Allah accept\\nyour fasting",
"تقرير خاص":"Special Report","تم الاشتراك":"Subscribed","تمام نتقابل الساعة ٩":"OK, see you at 9","جاري التحميل…":"Loading…","جاهز للتصوير بكرة؟":"Ready for the shoot tomorrow?",
"جديد":"New","جلد طبيعي":"Genuine leather","حرّك":"Animate","حقيقة":"Fact","حمدي ستوديو":"Hamdy Studio","حمدي: الفيديو خلص 🔥":"Hamdy: video's done 🔥",
"خبر عاجل: إطلاق نسخة جديدة من حمدي موشن كيت بمميزات كتير  •  تابعونا لكل جديد  •":"Breaking: a new Hamdy Motion Kit release with lots of features  •  Stay tuned  •",
"دلوقتي":"Now","ده المهم!":"This matters!","رسالة جديدة":"New message","ركّز هنا":"Focus here","رمضان كريم":"Ramadan Kareem","رمضان مبارك":"Ramadan Mubarak",
"ريلز":"Reels","سارة أحمد":"Sara Ahmed","سامسونج":"Samsung","سنة":"years","شغل احترافي وتسليم في المعاد":"Pro work, delivered on time",
"شكراً إنك اتفرجت!":"Thanks for watching!","شكراً للمشاهدة":"Thanks for watching","صمّم":"Design","صيف ٢٠٢٦":"Summer 2026","ضيف الحلقة: أحمد":"Guest: Ahmed",
"عاجل":"Breaking","عرض لفترة محدودة":"Limited-time offer","على كل حاجة":"on everything","عيد مبارك":"Eid Mubarak","فكّر":"Think","فيلم قصير":"Short Film",
"قبل":"Before","كابتن محمد":"Captain Mohamed","كل سنة وإنتم طيبين":"Happy holidays","كولكشن الشتا":"Winter Collection","لاعب خط وسط":"Midfielder",
"لما كل حاجة اتغيرت":"When everything changed","مباشر":"LIVE","متابع":"followers","متابعة":"Follow","متنساش\\nتعمل سيف":"Don't forget\\nto save",
"محمود حمدي":"Mahmoud Hamdy","مخرجة أفلام":"Film Director","مشروع":"projects","مصمم موشن جرافيك":"Motion Graphics Designer","مصوّر":"Photographer",
"من المشاهدين ستات":"of viewers are women","منى - صاحبة براند":"Mona - Brand Owner","موشن":"Motion","موقعك الجديد":"Your new website","نمو المتابعين":"Follower growth",
"نور الدين":"Nour Eldin","هل تعلم؟":"Did you know?","هنا":"Here","واو!":"Wow!","٤٩٩":"499","٧ من كل ١٠ بيتفرجوا على الموبايل":"7 in 10 watch on mobile","٨٩٩":"899",
"فكرة":"Idea","تصميم":"Design","تنفيذ":"Build","الفجر":"Fajr","الظهر":"Dhuhr","العصر":"Asr","المغرب":"Maghrib","العشاء":"Isha","ساعة":"Hours","دقيقة":"Minutes","ثانية":"Seconds","افتح البرنامج":"Open the app","اختار القالب":"Pick a template","دوس تطبيق":"Click Apply","اكتب السكريبت":"Write the script","صوّر":"Shoot","عدّل وانشر":"Edit & post",
"— محمود حمدي":"— Mahmoud Hamdy"
};
/* swap template sample texts to English (keeps the Arabic original in def_ar so switching back works after reload) */
function HMK_TPL_LOCALIZE(list, en){
  (list || []).forEach(function(T){ (T.layers || []).forEach(function(l){
    if(l.t !== 'text' || l.def === undefined) return;
    if(l.def_ar === undefined) l.def_ar = l.def;
    var k = String(l.def_ar).replace(/\n/g, '\\n'), e = HMK_TPL_EN[k];
    l.def = (en && e) ? e.replace(/\\n/g, '\n') : l.def_ar;
  }); });
}
