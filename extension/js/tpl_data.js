/* Hamdy Motion Kit — ready templates (original designs).
   Designed on a 1920x1080 canvas around an anchor point (anc = fraction of the comp).
   Layer types: rect / ell / path / text / bg. Colours: "c1".."c3" = editable template colours, or a hex.
   a = animations: {p:'dp'|'sc'|'sx'|'sy'|'rot'|'op'|'trim'|'w', k:[[sec, value]...], ez:'o'|'i'|'io'|'l'|'b', d:delay}
   Extras: jit [px, deg, fps] stop-motion jitter, rough (paper edge), sh [opacity%, distance, softness] shadow,
   glow, typ [start, dur] typewriter, count [from, to, start, dur] (+cfld = field with the target number),
   scroll speed (ticker), pulse [amount, speed], spin deg/s. */
var HMK_TPL = (function(){
  function scribble(rx, ry, turns, n, wob){
    var out = [], i, a, r;
    for(i = 0; i <= n; i++){ a = -Math.PI * 0.6 + i / n * Math.PI * 2 * turns; r = 1 + Math.sin(i * 1.7) * wob; out.push([Math.round(Math.cos(a) * rx * r), Math.round(Math.sin(a) * ry * r)]); }
    return out;
  }
  var POP = {p:'sc', k:[[0,0],[0.32,108],[0.48,100]], ez:'o'};
  function pop(d){ return {p:'sc', k:[[0,0],[0.3,110],[0.45,100]], ez:'o', d:d||0}; }
  function fade(d, dur){ return {p:'op', k:[[0,0],[dur||0.3,100]], ez:'o', d:d||0}; }
  function rise(d, y){ return {p:'dp', k:[[0,[0,y||60]],[0.45,[0,0]]], ez:'o', d:d||0}; }
  var CURSOR = [[0,0],[0,46],[12,35],[22,56],[30,52],[20,32],[36,32]];
  var T = [
  /* ------------------------------------------------------------------ UI */
  {id:'uiSub', sfx:'click_1', ar:'زرار اشتراك', en:'Subscribe Button', g:'واجهات UI', dur:3.5, cols:['#FF2D2D','#FFFFFF','#3A3A3A'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'النص قبل الضغطة'},{k:'t2', ar:'النص بعد الضغطة'}],
   layers:[
    {t:'rect', n:'Button', s:[440,112], r:56, f:'c1', a:[POP, {p:'sc', k:[[1.6,100],[1.7,92],[1.85,100]], ez:'io'}]},
    {t:'rect', n:'Done', s:[440,112], r:56, f:'c3', o:0, a:[{p:'op', k:[[1.68,0],[1.78,100]], ez:'l'}, {p:'sc', k:[[1.6,100],[1.7,92],[1.85,100]], ez:'io'}]},
    {t:'path', n:'Play', pts:[[-150,-18],[-150,18],[-120,0]], closed:true, f:'c2', a:[pop(0.1)]},
    {t:'text', n:'Label', fld:'t1', def:'اشترك', fs:54, fc:'c2', p:[30,0], a:[fade(0.15), {p:'op', k:[[1.7,100],[1.75,0]], ez:'l'}]},
    {t:'text', n:'Label 2', fld:'t2', def:'تم الاشتراك', fs:48, fc:'c2', p:[30,0], o:0, a:[{p:'op', k:[[1.75,0],[1.85,100]], ez:'l'}]},
    {t:'path', n:'Cursor', pts:CURSOR, closed:true, f:'#FFFFFF', st:['#111111',3], p:[90,20], a:[{p:'dp', k:[[0.6,[240,190]],[1.45,[0,0]]], ez:'io'}, {p:'sc', k:[[1.6,100],[1.7,80],[1.85,100]], ez:'io'}, fade(0.5,0.2)]}
   ]},
  {id:'uiFollow', ar:'كارت متابعة', en:'Follow Card', g:'واجهات UI', dur:3.5, cols:['#2E7CF6','#FFFFFF','#16181D'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'الاسم'},{k:'t2', ar:'اليوزر'},{k:'t3', ar:'الزرار'},{k:'t4', ar:'بعد الضغطة'}],
   layers:[
    {t:'rect', n:'Card', s:[820,190], r:40, f:'c3', sh:[45,10,30], a:[POP]},
    {t:'ell', n:'Avatar', s:[120,120], f:'c1', p:[300,0], a:[pop(0.12)]},
    {t:'text', n:'Name', fld:'t1', def:'محمود حمدي', fs:44, fc:'c2', just:'r', p:[215,-24], a:[fade(0.2), rise(0.2,20)]},
    {t:'text', n:'Handle', fld:'t2', def:'@hamdy.motion', fs:30, fc:'#8A8F99', just:'r', p:[215,28], a:[fade(0.28), rise(0.28,20)]},
    {t:'rect', n:'Button', s:[230,84], r:42, f:'c1', p:[-250,0], a:[pop(0.3), {p:'sc', k:[[1.6,100],[1.7,90],[1.85,100]], ez:'io'}]},
    {t:'rect', n:'Done', s:[230,84], r:42, f:'#3A3D45', p:[-250,0], o:0, a:[{p:'op', k:[[1.68,0],[1.78,100]], ez:'l'}, {p:'sc', k:[[1.6,100],[1.7,90],[1.85,100]], ez:'io'}]},
    {t:'text', n:'Label', fld:'t3', def:'متابعة', fs:38, fc:'c2', p:[-250,0], a:[fade(0.35), {p:'op', k:[[1.7,100],[1.75,0]], ez:'l'}]},
    {t:'text', n:'Label 2', fld:'t4', def:'بتتابعه ✓', fs:34, fc:'c2', p:[-250,0], o:0, a:[{p:'op', k:[[1.75,0],[1.85,100]], ez:'l'}]},
    {t:'path', n:'Cursor', pts:CURSOR, closed:true, f:'#FFFFFF', st:['#111111',3], p:[-200,20], a:[{p:'dp', k:[[0.6,[200,180]],[1.45,[0,0]]], ez:'io'}, {p:'sc', k:[[1.6,100],[1.7,80],[1.85,100]], ez:'io'}, fade(0.5,0.2)]}
   ]},
  {id:'uiLike', ar:'لايك وعدّاد', en:'Like Burst', g:'واجهات UI', dur:3, cols:['#FF3B5C','#FFFFFF','#FFB3C1'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'عدد اللايكات'}],
   layers:[
    {t:'ell', n:'Ring', s:[220,220], st:['c3',10], a:[{p:'sc', k:[[0.15,30],[0.6,150]], ez:'o'}, {p:'op', k:[[0.15,100],[0.6,0]], ez:'o'}]},
    {t:'text', n:'Heart', def:'♥', fs:220, fc:'c1', p:[0,-10], font:'sym', a:[{p:'sc', k:[[0,0],[0.25,125],[0.42,92],[0.55,100]], ez:'o'}]},
    {t:'text', n:'Count', fld:'t1', def:'12500', fs:64, fc:'c2', p:[0,170], count:[0,12500,0.25,1.2], cfld:'t1', a:[fade(0.25)]}
   ]},
  {id:'uiNotif', sfx:'notification', ar:'إشعار موبايل', en:'Phone Notification', g:'واجهات UI', dur:3.5, cols:['#25D366','#F5F5F7','#111111'], anc:[0.5,0.13],
   fields:[{k:'t1', ar:'العنوان'},{k:'t2', ar:'الرسالة'},{k:'t3', ar:'الوقت'}],
   na:[{p:'dp', k:[[0,[0,-300]],[0.55,[0,0]]], ez:'b'}],
   layers:[
    {t:'rect', n:'Card', s:[820,170], r:40, f:'c2', sh:[35,8,30]},
    {t:'rect', n:'Icon', s:[96,96], r:24, f:'c1', p:[330,0]},
    {t:'text', n:'Title', fld:'t1', def:'رسالة جديدة', fs:40, fc:'c3', just:'r', p:[255,-28]},
    {t:'text', n:'Body', fld:'t2', def:'حمدي: الفيديو خلص 🔥', fs:32, fc:'#555A63', just:'r', p:[255,24]},
    {t:'text', n:'Time', fld:'t3', def:'دلوقتي', fs:26, fc:'#8A8F99', just:'l', p:[-370,-40]}
   ]},
  {id:'uiChat', ar:'فقاعات شات', en:'Chat Bubbles', g:'واجهات UI', dur:4, cols:['#2E7CF6','#FFFFFF','#E9E9EE'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'رسالة 1'},{k:'t2', ar:'رد'},{k:'t3', ar:'رسالة 2'}],
   layers:[
    {t:'rect', n:'Bubble 1', s:[560,100], r:50, f:'c3', p:[-160,-140], a:[pop(0), rise(0,30)]},
    {t:'text', n:'Text 1', fld:'t1', def:'جاهز للتصوير بكرة؟', fs:38, fc:'#111111', p:[-160,-140], a:[fade(0.15)]},
    {t:'rect', n:'Bubble 2', s:[480,100], r:50, f:'c1', p:[200,0], a:[pop(0.7), rise(0.7,30)]},
    {t:'text', n:'Text 2', fld:'t2', def:'أكيد 🎬', fs:38, fc:'c2', p:[200,0], a:[fade(0.85)]},
    {t:'rect', n:'Bubble 3', s:[600,100], r:50, f:'c3', p:[-140,140], a:[pop(1.4), rise(1.4,30)]},
    {t:'text', n:'Text 3', fld:'t3', def:'تمام نتقابل الساعة ٩', fs:38, fc:'#111111', p:[-140,140], a:[fade(1.55)]}
   ]},
  {id:'uiSearch', sfx:'typing', ar:'بحث بيكتب', en:'Typing Search Bar', g:'واجهات UI', dur:3.5, cols:['#FF6A3D','#FFFFFF','#202124'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'جملة البحث'}],
   layers:[
    {t:'rect', n:'Bar', s:[960,116], r:58, f:'c2', sh:[30,8,26], a:[{p:'sx', k:[[0,20],[0.45,100]], ez:'o'}, fade(0,0.2)]},
    {t:'ell', n:'Lens', s:[40,40], st:['c3',6], p:[400,-6], a:[fade(0.3)]},
    {t:'path', n:'Lens handle', pts:[[414,8],[430,24]], st:['c3',6], a:[fade(0.3)]},
    {t:'text', n:'Query', fld:'t1', def:'إزاي تعمل موشن جرافيك احترافي', fs:42, fc:'c3', just:'r', p:[350,0], typ:[0.5,1.5]},
    {t:'rect', n:'Button', s:[150,76], r:38, f:'c1', p:[-385,0], a:[pop(2.1)]}
   ]},
  {id:'uiProgress', ar:'شريط تحميل', en:'Loading Bar', g:'واجهات UI', dur:3.5, cols:['#7C5CFF','#FFFFFF','#2A2A33'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'الكلام'}],
   layers:[
    {t:'rect', n:'Track', s:[900,28], r:14, f:'c3', a:[{p:'sx', k:[[0,0],[0.4,100]], ez:'o'}]},
    {t:'rect', n:'Fill', s:[900,28], r:14, f:'c1', org:'l', p:[-450,0], a:[{p:'sx', k:[[0.3,0],[2.6,100]], ez:'io'}]},
    {t:'text', n:'Percent', def:'100%', fs:64, fc:'c2', p:[0,-80], count:[0,100,0.3,2.3], suf:'%', a:[fade(0.2)]},
    {t:'text', n:'Label', fld:'t1', def:'جاري التحميل…', fs:34, fc:'#9A9AA8', p:[0,70], a:[fade(0.35)]}
   ]},
  {id:'uiToggle', sfx:'toggle', ar:'زرار تشغيل', en:'Toggle Switch', g:'واجهات UI', dur:3, cols:['#34C759','#FFFFFF','#3A3A3F'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'الكلام'}],
   layers:[
    {t:'rect', n:'Track', s:[230,124], r:62, f:'c3', p:[140,0], a:[pop(0)]},
    {t:'rect', n:'Track On', s:[230,124], r:62, f:'c1', p:[140,0], o:0, a:[{p:'op', k:[[0.8,0],[1.05,100]], ez:'io'}]},
    {t:'ell', n:'Knob', s:[100,100], f:'c2', p:[87,0], sh:[30,4,10], a:[pop(0.1), {p:'dp', k:[[0.8,[0,0]],[1.05,[106,0]]], ez:'io'}]},
    {t:'text', n:'Label', fld:'t1', def:'الوضع الليلي', fs:48, fc:'c2', just:'r', p:[-20,0], a:[fade(0.2)]}
   ]},
  {id:'uiPost', ar:'بوست سوشيال', en:'Social Post', g:'واجهات UI', dur:4, cols:['#FF6A3D','#FFFFFF','#14151A'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'الاسم'},{k:'t2', ar:'اللايكات'},{k:'t3', ar:'الكابشن'}],
   na:[{p:'dp', k:[[0,[0,260]],[0.6,[0,0]]], ez:'b'}],
   layers:[
    {t:'rect', n:'Card', s:[640,780], r:30, f:'c2', sh:[35,12,40]},
    {t:'rect', n:'Photo', s:[600,470], r:18, f:'c1', p:[0,-40]},
    {t:'ell', n:'Avatar', s:[64,64], f:'c3', p:[255,-345]},
    {t:'text', n:'Name', fld:'t1', def:'hamdy.motion', fs:30, fc:'c3', just:'r', p:[205,-345]},
    {t:'text', n:'Heart', def:'♥', fs:64, fc:'#FF3B5C', p:[255,240], font:'sym', a:[{p:'sc', k:[[1,0],[1.2,130],[1.35,100]], ez:'o'}]},
    {t:'text', n:'Likes', fld:'t2', def:'2,340 إعجاب', fs:28, fc:'c3', just:'r', p:[205,242]},
    {t:'text', n:'Caption', fld:'t3', def:'أحسن موشن في السنة 🎬', fs:30, fc:'#444852', just:'r', p:[275,310]}
   ]},
  {id:'uiCounter', ar:'عدّاد أرقام', en:'Big Counter', g:'واجهات UI', dur:3.5, cols:['#FFC83D','#FFFFFF','#FFC83D'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'الرقم'},{k:'t2', ar:'تحته'}],
   layers:[
    {t:'text', n:'Number', fld:'t1', def:'100000', fs:220, fc:'c1', p:[0,-30], count:[0,100000,0.1,1.8], cfld:'t1', a:[fade(0,0.2), {p:'sc', k:[[0,80],[0.5,100]], ez:'o'}]},
    {t:'text', n:'Label', fld:'t2', def:'متابع', fs:64, fc:'c2', p:[0,130], a:[fade(0.4), rise(0.4,30)]},
    {t:'rect', n:'Line', s:[420,8], r:4, f:'c3', p:[0,190], a:[{p:'sx', k:[[0.5,0],[1,100]], ez:'o'}]}
   ]},
  /* ------------------------------------------------------- explainer / collage */
  {id:'exPaper', ar:'عنوان ورق مقصوص', en:'Paper Cut Title', g:'ستايل شرح وكولاج', dur:4, cols:['#F2E8D5','#1B1B1B','#E9D49A'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'العنوان'}],
   layers:[
    {t:'rect', n:'Paper', s:[980,200], f:'c1', rot:-2, rough:7, sh:[55,10,14], jit:[3,0.8,8], a:[{p:'sc', k:[[0,0],[0.18,112],[0.3,100]], ez:'l'}]},
    {t:'rect', n:'Tape', s:[170,48], f:'c3', o:85, rot:-24, p:[-450,-100], jit:[2,1.5,8], a:[{p:'op', k:[[0.25,0],[0.3,85]], ez:'l'}]},
    {t:'text', n:'Title', fld:'t1', def:'الحقيقة اللي محدش قالهالك', fs:74, fc:'c2', rot:-2, jit:[3,0.8,8], a:[{p:'op', k:[[0.2,0],[0.25,100]], ez:'l'}]}
   ]},
  {id:'exMarker', ar:'هايلايت ماركر', en:'Marker Highlight', g:'ستايل شرح وكولاج', dur:3.5, cols:['#FFE14D','#111111','#FFFFFF'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'الكلمة'}],
   layers:[
    {t:'rect', n:'Marker', s:[760,86], f:'c1', o:90, org:'r', p:[380,8], rot:-1, a:[{p:'sx', k:[[0.2,0],[0.65,100]], ez:'o'}]},
    {t:'text', n:'Word', fld:'t1', def:'أهم معلومة في الفيديو', fs:72, fc:'c2', a:[fade(0,0.15)]}
   ]},
  {id:'exArrow', ar:'سهم ومعلومة', en:'Arrow Callout', g:'ستايل شرح وكولاج', dur:3.5, cols:['#FF4D2E','#FFFFFF','#111111'], anc:[0.55,0.45],
   fields:[{k:'t1', ar:'الكلام'}],
   layers:[
    {t:'path', n:'Arrow', pts:[[-300,170],[-210,60],[-90,10],[0,0]], smooth:true, st:['c1',9], trim:true, a:[{p:'trim', k:[[0,0],[0.5,100]], ez:'o'}]},
    {t:'path', n:'Head', pts:[[-34,-20],[0,0],[-28,26]], st:['c1',9], trim:true, a:[{p:'trim', k:[[0.45,0],[0.62,100]], ez:'o'}]},
    {t:'text', n:'Label', fld:'t1', def:'ده المهم!', fs:60, fc:'c1', p:[-340,230], jit:[3,2,8], a:[{p:'sc', k:[[0.5,0],[0.62,115],[0.72,100]], ez:'l'}]}
   ]},
  {id:'exCircle', ar:'دايرة بالقلم', en:'Scribble Circle', g:'ستايل شرح وكولاج', dur:3, cols:['#FF4D2E','#FFFFFF','#111111'], anc:[0.5,0.5], fields:[],
   layers:[
    {t:'path', n:'Scribble', pts:scribble(260,130,1.15,40,0.04), smooth:true, st:['c1',8], trim:true, jit:[2,0.6,10], a:[{p:'trim', k:[[0,0],[0.8,100]], ez:'io'}]}
   ]},
  {id:'exSticky', ar:'ورقة لاصقة', en:'Sticky Note', g:'ستايل شرح وكولاج', dur:4, cols:['#FFE873','#222222','#E5403A'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'الملاحظة'}],
   layers:[
    {t:'rect', n:'Note', s:[400,400], f:'c1', rot:4, rough:2, sh:[45,12,20], jit:[2,0.6,8], a:[{p:'dp', k:[[0,[0,-700]],[0.35,[0,0]],[0.45,[0,-20]],[0.55,[0,0]]], ez:'o'}]},
    {t:'text', n:'Text', fld:'t1', def:'متنساش\nتعمل سيف', fs:56, fc:'c2', rot:4, jit:[2,0.6,8], a:[{p:'dp', k:[[0,[0,-700]],[0.35,[0,0]],[0.45,[0,-20]],[0.55,[0,0]]], ez:'o'}]},
    {t:'ell', n:'Pin', s:[44,44], f:'c3', p:[10,-178], sh:[50,6,8], a:[{p:'sc', k:[[0.55,0],[0.7,120],[0.8,100]], ez:'o'}]}
   ]},
  {id:'exStamp', sfx:'thud', ar:'ختم', en:'Stamp', g:'ستايل شرح وكولاج', dur:3, cols:['#D7263D','#FFFFFF','#111111'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'كلمة الختم'}],
   layers:[
    {t:'rect', n:'Frame', s:[560,170], r:14, st:['c1',12], rot:-12, rough:3, a:[{p:'sc', k:[[0,320],[0.16,92],[0.26,100]], ez:'l'}, fade(0,0.08)]},
    {t:'text', n:'Word', fld:'t1', def:'حقيقة', fs:100, fc:'c1', rot:-12, a:[{p:'sc', k:[[0,320],[0.16,92],[0.26,100]], ez:'l'}, fade(0,0.08)]}
   ]},
  {id:'exClip', ar:'قصاصة جرنال', en:'Newspaper Clip', g:'ستايل شرح وكولاج', dur:4, cols:['#EDE8DC','#111111','#9A958A'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'المانشيت'}],
   layers:[
    {t:'rect', n:'Paper', s:[860,540], f:'c1', rot:3, rough:9, sh:[50,14,24], jit:[2,0.5,8], a:[{p:'dp', k:[[0,[0,900]],[0.45,[0,0]]], ez:'o'}, {p:'rot', k:[[0,-14],[0.45,0]], ez:'o'}]},
    {t:'text', n:'Headline', fld:'t1', def:'اكتشاف يغيّر كل حاجة', fs:66, fc:'c2', p:[0,-170], rot:3, jit:[2,0.5,8], a:[{p:'dp', k:[[0,[0,900]],[0.45,[0,0]]], ez:'o'}, {p:'rot', k:[[0,-14],[0.45,0]], ez:'o'}]},
    {t:'rect', n:'Line 1', s:[720,14], f:'c3', p:[0,-60], rot:3, a:[{p:'dp', k:[[0,[0,900]],[0.47,[0,0]]], ez:'o'}]},
    {t:'rect', n:'Line 2', s:[720,14], f:'c3', p:[0,-15], rot:3, a:[{p:'dp', k:[[0,[0,900]],[0.49,[0,0]]], ez:'o'}]},
    {t:'rect', n:'Line 3', s:[720,14], f:'c3', p:[0,30], rot:3, a:[{p:'dp', k:[[0,[0,900]],[0.51,[0,0]]], ez:'o'}]},
    {t:'rect', n:'Line 4', s:[520,14], f:'c3', p:[-100,75], rot:3, a:[{p:'dp', k:[[0,[0,900]],[0.53,[0,0]]], ez:'o'}]},
    {t:'rect', n:'Line 5', s:[720,14], f:'c3', p:[0,140], rot:3, a:[{p:'dp', k:[[0,[0,900]],[0.55,[0,0]]], ez:'o'}]}
   ]},
  {id:'exNumber', ar:'رقم بخط الإيد', en:'Doodle Number', g:'ستايل شرح وكولاج', dur:3.5, cols:['#FF4D2E','#FFFFFF','#FF4D2E'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'الرقم'},{k:'t2', ar:'تحته'}],
   layers:[
    {t:'text', n:'Number', fld:'t1', def:'309', fs:260, fc:'c1', count:[0,309,0,1.1], cfld:'t1', jit:[3,1.5,8], a:[fade(0,0.1)]},
    {t:'path', n:'Underline', pts:scribble(220,14,0.5,10,0.2).map(function(q){ return [q[0], q[1] + 150]; }), smooth:true, st:['c3',9], trim:true, a:[{p:'trim', k:[[0.9,0],[1.3,100]], ez:'o'}]},
    {t:'text', n:'Label', fld:'t2', def:'سنة', fs:64, fc:'c2', p:[0,230], jit:[2,1,8], a:[fade(1.1,0.1)]}
   ]},
  /* ------------------------------------------------------------------ news */
  {id:'nwLower', ar:'لوار ثيرد أخبار', en:'News Lower Third', g:'ستايل أخبار', dur:4.5, cols:['#C8102E','#FFFFFF','#111111'], anc:[0.94,0.8],
   fields:[{k:'t1', ar:'الاسم'},{k:'t2', ar:'الصفة'}],
   layers:[
    {t:'rect', n:'Bar', s:[760,92], f:'c1', org:'r', a:[{p:'sx', k:[[0,0],[0.45,100]], ez:'o'}]},
    {t:'text', n:'Name', fld:'t1', def:'محمود حمدي', fs:52, fc:'#FFFFFF', just:'r', p:[-34,0], a:[fade(0.3), {p:'dp', k:[[0,[40,0]],[0.4,[0,0]]], ez:'o', d:0.3}]},
    {t:'rect', n:'Bar 2', s:[560,58], f:'c2', org:'r', p:[0,76], a:[{p:'sx', k:[[0.2,0],[0.6,100]], ez:'o'}]},
    {t:'text', n:'Title', fld:'t2', def:'مصمم موشن جرافيك', fs:32, fc:'c3', just:'r', p:[-34,76], a:[fade(0.5)]}
   ]},
  {id:'nwBreak', ar:'شريط عاجل', en:'Breaking Ticker', g:'ستايل أخبار', dur:6, cols:['#E10600','#111111','#FFFFFF'], anc:[0.5,0.92],
   fields:[{k:'t1', ar:'الكلمة'},{k:'t2', ar:'الخبر'}],
   layers:[
    {t:'rect', n:'Bar', s:[1920,82], f:'c2', a:[{p:'sy', k:[[0,0],[0.35,100]], ez:'o'}]},
    {t:'text', n:'Ticker', fld:'t2', def:'خبر عاجل: إطلاق نسخة جديدة من حمدي موشن كيت بمميزات كتير  •  تابعونا لكل جديد  •', fs:38, fc:'c3', just:'r', p:[680,0], scroll:-160, gap:300, a:[fade(0.4)]},
    {t:'rect', n:'Tag', s:[270,82], f:'c1', p:[825,0], a:[{p:'sx', k:[[0.15,0],[0.45,100]], ez:'o'}]},
    {t:'text', n:'Tag text', fld:'t1', def:'عاجل', fs:46, fc:'c3', p:[825,0], a:[fade(0.4)]}
   ]},
  {id:'nwHead', ar:'عنوان تقرير', en:'News Headline', g:'ستايل أخبار', dur:4.5, cols:['#C8102E','#0E1A2B','#FFFFFF'], anc:[0.5,0.78],
   fields:[{k:'t1', ar:'التصنيف'},{k:'t2', ar:'العنوان'}],
   layers:[
    {t:'rect', n:'Back', s:[1300,140], f:'c2', o:92, a:[{p:'sx', k:[[0,0],[0.45,100]], ez:'o'}]},
    {t:'rect', n:'Tag', s:[230,58], f:'c1', p:[520,-98], a:[{p:'sy', k:[[0.3,0],[0.55,100]], ez:'o'}]},
    {t:'text', n:'Tag text', fld:'t1', def:'تقرير خاص', fs:32, fc:'c3', p:[520,-98], a:[fade(0.45)]},
    {t:'text', n:'Headline', fld:'t2', def:'إزاي الذكاء الاصطناعي بيغيّر شغل المصممين', fs:56, fc:'c3', a:[fade(0.35), rise(0.35,30)]}
   ]},
  {id:'nwLoc', ar:'تاج مكان', en:'Location Tag', g:'ستايل أخبار', dur:4, cols:['#E10600','#111111','#FFFFFF'], anc:[0.9,0.12],
   fields:[{k:'t1', ar:'المكان'},{k:'t2', ar:'الحالة'}],
   layers:[
    {t:'rect', n:'Bar', s:[440,74], f:'c2', o:88, org:'r', a:[{p:'sx', k:[[0,0],[0.4,100]], ez:'o'}]},
    {t:'text', n:'Place', fld:'t1', def:'القاهرة', fs:42, fc:'c3', just:'r', p:[-30,0], a:[fade(0.3)]},
    {t:'ell', n:'Live dot', s:[22,22], f:'c1', p:[-330,0], pulse:[0.25,8], a:[pop(0.4)]},
    {t:'text', n:'Live', fld:'t2', def:'مباشر', fs:30, fc:'c1', just:'r', p:[-350,0], a:[fade(0.45)]}
   ]},
  {id:'nwQuote', ar:'كارت اقتباس', en:'Quote Card', g:'ستايل أخبار', dur:5, cols:['#C8102E','#FFFFFF','#9AA3B2'], anc:[0.5,0.5],
   fields:[{k:'t1', ar:'الاقتباس'},{k:'t2', ar:'القائل'}],
   layers:[
    {t:'text', n:'Mark', def:'”', fs:260, fc:'c1', p:[420,-150], font:'sym', a:[pop(0)]},
    {t:'text', n:'Quote', fld:'t1', def:'التصميم مش شكل بس،\nالتصميم طريقة تفكير', fs:62, fc:'c2', a:[fade(0.25), rise(0.25,30)]},
    {t:'rect', n:'Line', s:[120,6], f:'c1', p:[0,140], a:[{p:'sx', k:[[0.6,0],[0.95,100]], ez:'o'}]},
    {t:'text', n:'Name', fld:'t2', def:'— محمود حمدي', fs:34, fc:'c3', p:[0,190], a:[fade(0.8)]}
   ]},
  /* ------------------------------------------------------------- scenes */
  {id:'bgGrad', ar:'خلفية جريدينت متحركة', en:'Moving Gradient', g:'مشاهد وخلفيات', dur:10, out:false, cols:['#1B1F5E','#FF5A36','#7A2CFF'], fields:[], layers:[{t:'bg', kind:'grad'}]},
  {id:'bgGrid', ar:'خلفية جريد', en:'Grid Background', g:'مشاهد وخلفيات', dur:10, out:false, cols:['#0E0F14','#3A3E52','#FFFFFF'], fields:[], layers:[{t:'bg', kind:'grid'}]},
  {id:'bgPaper', ar:'خلفية ورق', en:'Paper Background', g:'مشاهد وخلفيات', dur:10, out:false, cols:['#EFE7D6','#B9AA8C','#FFFFFF'], fields:[], layers:[{t:'bg', kind:'paper'}]},
  {id:'bgSmoke', ar:'خلفية دخان', en:'Smoke Background', g:'مشاهد وخلفيات', dur:10, out:false, cols:['#07070A','#5B3FB0','#FFFFFF'], fields:[], layers:[{t:'bg', kind:'noise'}]}
  ];
  return T;
})();
