/* Hamdy Motion Kit — templates batch 2 (50 original designs). Same spec as tpl_data.js. */
(function(T){
  if(!T) return;
  function pop(d){ return {p:'sc', k:[[0,0],[0.3,110],[0.45,100]], ez:'o', d:d||0}; }
  function fade(d, dur){ return {p:'op', k:[[0,0],[dur||0.3,100]], ez:'o', d:d||0}; }
  function rise(d, y){ return {p:'dp', k:[[0,[0,y||60]],[0.45,[0,0]]], ez:'o', d:d||0}; }
  function slide(d, x){ return {p:'dp', k:[[0,[x,0]],[0.45,[0,0]]], ez:'o', d:d||0}; }
  function grow(d, dur){ return {p:'sx', k:[[0,0],[dur||0.45,100]], ez:'o', d:d||0}; }
  function growY(d, dur){ return {p:'sy', k:[[0,0],[dur||0.45,100]], ez:'o', d:d||0}; }
  function draw(d, dur){ return {p:'trim', k:[[0,0],[dur||0.6,100]], ez:'io', d:d||0}; }
  function star(n, r1, r2, rot){ var o = [], i, a; for(i = 0; i < n*2; i++){ a = (rot||-90)*Math.PI/180 + i*Math.PI/n; var r = i % 2 ? r2 : r1; o.push([Math.round(Math.cos(a)*r), Math.round(Math.sin(a)*r)]); } return o; }
  function circ(r, n, start){ var o = [], i, a; for(i = 0; i <= n; i++){ a = (start||-90)*Math.PI/180 + i/n*Math.PI*2; o.push([Math.round(Math.cos(a)*r), Math.round(Math.sin(a)*r)]); } return o; }
  var L3 = 'لوار ثيرد', TI = 'عناوين', CO = 'كول آوت وتوضيح', IG = 'إنفوجرافيك', RM = 'رمضان ومناسبات', PR = 'عروض وتسويق', YT = 'يوتيوب وبودكاست', ED = 'تعليم وتقديم', UI = 'واجهات UI', EX = 'ستايل شرح وكولاج', NW = 'ستايل أخبار';
  var add = [
  /* ---------------- lower thirds */
  {id:'l3Line', ar:'لوار ثيرد خط', en:'Minimal Line L3', g:L3, dur:4.5, cols:['#FF6A3D','#FFFFFF','#B8B8C4'], anc:[0.92,0.82], fields:[{k:'t1', ar:'الاسم'},{k:'t2', ar:'الصفة'}],
   layers:[{t:'rect', n:'Line', s:[6,130], f:'c1', p:[0,0], a:[growY(0,0.4)]},
    {t:'text', n:'Name', fld:'t1', def:'محمود حمدي', fs:56, fc:'c2', just:'r', p:[-30,-28], a:[fade(0.25), slide(0.25,40)]},
    {t:'text', n:'Title', fld:'t2', def:'مصمم موشن جرافيك', fs:32, fc:'c3', just:'r', p:[-30,32], a:[fade(0.45), slide(0.45,40)]}]},
  {id:'l3Block', ar:'لوار ثيرد بلوكات', en:'Bold Block L3', g:L3, dur:4.5, cols:['#7C5CFF','#FFFFFF','#16161C'], anc:[0.94,0.8], fields:[{k:'t1', ar:'الاسم'},{k:'t2', ar:'الصفة'}],
   layers:[{t:'rect', n:'Block', s:[640,100], f:'c1', org:'r', a:[grow(0,0.4)]}, {t:'rect', n:'Block 2', s:[460,60], f:'c3', org:'r', p:[-60,80], a:[grow(0.15,0.4)]},
    {t:'text', n:'Name', fld:'t1', def:'سارة أحمد', fs:58, fc:'c2', just:'r', p:[-36,0], a:[fade(0.3)]}, {t:'text', n:'Title', fld:'t2', def:'مخرجة أفلام', fs:32, fc:'c2', just:'r', p:[-96,80], a:[fade(0.45)]}]},
  {id:'l3Skew', ar:'لوار ثيرد مايل', en:'Angled L3', g:L3, dur:4.5, cols:['#00C2FF','#FFFFFF','#0B1020'], anc:[0.9,0.82], fields:[{k:'t1', ar:'الاسم'},{k:'t2', ar:'الصفة'}],
   layers:[{t:'path', n:'Plate', pts:[[-700,-56],[30,-56],[0,56],[-730,56]], closed:true, f:'c3', a:[slide(0,300), fade(0,0.2)]},
    {t:'path', n:'Accent', pts:[[40,-56],[90,-56],[60,56],[10,56]], closed:true, f:'c1', a:[slide(0.1,200), fade(0.1,0.2)]},
    {t:'text', n:'Name', fld:'t1', def:'كابتن محمد', fs:50, fc:'c2', just:'r', p:[-40,-6], a:[fade(0.3), slide(0.3,60)]},
    {t:'rect', n:'Tag', s:[300,44], f:'c1', org:'r', p:[-30,84], a:[grow(0.35,0.35)]}, {t:'text', n:'Title', fld:'t2', def:'لاعب خط وسط', fs:28, fc:'c3', just:'r', p:[-48,84], a:[fade(0.5)]}]},
  {id:'l3Outline', ar:'لوار ثيرد بيترسم', en:'Outline Draw L3', g:L3, dur:4.5, cols:['#FFFFFF','#FFFFFF','#FF6A3D'], anc:[0.85,0.82], fields:[{k:'t1', ar:'الاسم'},{k:'t2', ar:'الصفة'}],
   layers:[{t:'path', n:'Frame', pts:[[200,-70],[-420,-70],[-420,70],[200,70],[200,-70]], st:['c1',4], trim:true, a:[draw(0,0.7)]},
    {t:'rect', n:'Fill', s:[620,140], f:'c3', p:[-110,0], o:0, a:[{p:'op', k:[[0.6,0],[0.9,90]], ez:'o'}]},
    {t:'text', n:'Name', fld:'t1', def:'نور الدين', fs:54, fc:'c2', just:'r', p:[170,-22], a:[fade(0.7)]}, {t:'text', n:'Title', fld:'t2', def:'مصوّر', fs:30, fc:'c2', just:'r', p:[170,30], a:[fade(0.85)]}]},
  {id:'l3Social', ar:'لوار ثيرد سوشيال', en:'Social Handle L3', g:L3, dur:4.5, cols:['#FF3B5C','#FFFFFF','#111111'], anc:[0.88,0.85], fields:[{k:'t1', ar:'اليوزر'}],
   layers:[{t:'rect', n:'Pill', s:[520,96], r:48, f:'c3', o:90, org:'r', p:[48,0], a:[grow(0.1,0.45)]}, {t:'rect', n:'Icon', s:[96,96], r:28, f:'c1', a:[pop(0)]},
    {t:'ell', n:'Lens', s:[38,38], st:['c2',6], a:[pop(0.1)]}, {t:'text', n:'Handle', fld:'t1', def:'@hamdy.motion', fs:40, fc:'c2', just:'r', p:[-70,0], a:[fade(0.4), slide(0.4,40)]}]},
  {id:'l3Bilingual', ar:'لوار ثيرد عربي وإنجليزي', en:'Bilingual L3', g:L3, dur:5, cols:['#FFC83D','#FFFFFF','#14151A'], anc:[0.5,0.84], fields:[{k:'t1', ar:'بالعربي'},{k:'t2', ar:'بالإنجليزي'}],
   layers:[{t:'rect', n:'Back', s:[900,150], r:20, f:'c3', o:88, a:[grow(0,0.45)]}, {t:'rect', n:'Divider', s:[4,90], f:'c1', a:[growY(0.3,0.3)]},
    {t:'text', n:'Arabic', fld:'t1', def:'محمود حمدي', fs:48, fc:'c2', just:'r', p:[400,0], a:[fade(0.35), slide(0.35,-40)]}, {t:'text', n:'English', fld:'t2', def:'Mahmoud Hamdy', fs:42, fc:'c1', just:'l', p:[-400,0], a:[fade(0.45), slide(0.45,40)]}]},
  /* ---------------- titles */
  {id:'tiBigNum', ar:'رقم عملاق وعنوان', en:'Big Number Title', g:TI, dur:4, cols:['#FF6A3D','#FFFFFF','#FF6A3D'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الرقم'},{k:'t2', ar:'العنوان'}],
   layers:[{t:'text', n:'Number', fld:'t1', def:'01', fs:380, fc:'c1', p:[0,-60], a:[{p:'sc', k:[[0,140],[0.5,100]], ez:'o'}, fade(0,0.3)]}, {t:'rect', n:'Rule', s:[360,6], f:'c3', p:[0,140], a:[grow(0.35)]},
    {t:'text', n:'Title', fld:'t2', def:'البداية', fs:70, fc:'c2', p:[0,215], a:[fade(0.5), rise(0.5,30)]}]},
  {id:'tiEcho', ar:'عنوان متكرر', en:'Echo Stack Title', g:TI, dur:4, cols:['#FFFFFF','#FF6A3D','#FFFFFF'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكلمة'}],
   layers:[-2,-1,1,2].map(function(i){ return {t:'text', n:'Echo ' + i, fld:'t1', def:'موشن', fs:150, fc:'c2', o:Math.abs(i)===1 ? 55 : 25, p:[0,i*130], a:[{p:'dp', k:[[0,[0,-i*130]],[0.6,[0,0]]], ez:'o', d:0.1*Math.abs(i)}]}; })
   .concat([{t:'text', n:'Main', fld:'t1', def:'موشن', fs:150, fc:'c1', a:[pop(0)]}])},
  {id:'tiSplit', ar:'عنوان بيتفتح', en:'Split Reveal Title', g:TI, dur:4, cols:['#FFFFFF','#FF6A3D','#FFFFFF'], anc:[0.5,0.5], fields:[{k:'t1', ar:'فوق'},{k:'t2', ar:'تحت'}],
   layers:[{t:'text', n:'Bottom', fld:'t2', def:'أفكار جديدة كل أسبوع', fs:54, fc:'c2', p:[0,0], o:0, a:[{p:'op', k:[[0.5,0],[0.8,100]], ez:'o'}, {p:'sc', k:[[0.5,80],[0.9,100]], ez:'o'}]},
    {t:'text', n:'Top half', fld:'t1', def:'حمدي ستوديو', fs:120, fc:'c1', a:[{p:'dp', k:[[0.5,[0,0]],[0.9,[0,-110]]], ez:'io'}, pop(0)]},
    {t:'rect', n:'Line', s:[600,6], f:'c3', p:[0,-40], a:[{p:'sx', k:[[0.45,0],[0.8,100]], ez:'o'}]}]},
  {id:'tiLetterbox', ar:'عنوان سينمائي', en:'Cinematic Letterbox', g:TI, dur:5, cols:['#000000','#FFFFFF','#C9A86A'], anc:[0.5,0.5], fields:[{k:'t1', ar:'العنوان'},{k:'t2', ar:'تحته'}],
   layers:[{t:'rect', n:'Bar top', s:[1920,170], f:'c1', p:[0,-455], a:[{p:'dp', k:[[0,[0,-170]],[0.6,[0,0]]], ez:'o'}]},
    {t:'rect', n:'Bar bottom', s:[1920,170], f:'c1', p:[0,455], a:[{p:'dp', k:[[0,[0,170]],[0.6,[0,0]]], ez:'o'}]},
    {t:'text', n:'Title', fld:'t1', def:'الرحلة', fs:120, fc:'c2', trk:400, a:[fade(0.5,0.8), {p:'sc', k:[[0.5,96],[4.5,104]], ez:'l'}]},
    {t:'text', n:'Sub', fld:'t2', def:'فيلم قصير', fs:34, fc:'c3', p:[0,95], trk:300, a:[fade(1.0,0.6)]}]},
  {id:'tiStamp3', ar:'تلات كلمات بخبطة', en:'Three Word Slam', g:TI, dur:3.5, cols:['#FFFFFF','#FF3B3B','#FFC83D'], anc:[0.5,0.5], fields:[{k:'t1', ar:'كلمة 1'},{k:'t2', ar:'كلمة 2'},{k:'t3', ar:'كلمة 3'}],
   layers:[{t:'text', n:'Word 1', fld:'t1', def:'فكّر', fs:130, fc:'c1', p:[0,-150], a:[{p:'sc', k:[[0,260],[0.18,95],[0.26,100]], ez:'l'}, fade(0,0.06)]},
    {t:'text', n:'Word 2', fld:'t2', def:'صمّم', fs:150, fc:'c2', p:[0,0], a:[{p:'sc', k:[[0,260],[0.18,95],[0.26,100]], ez:'l', d:0.35}, fade(0.35,0.06)]},
    {t:'text', n:'Word 3', fld:'t3', def:'حرّك', fs:170, fc:'c3', p:[0,165], a:[{p:'sc', k:[[0,260],[0.18,95],[0.26,100]], ez:'l', d:0.7}, fade(0.7,0.06)]}]},
  {id:'tiMaskCircle', ar:'كلمة جوه دايرة', en:'Circle Badge Title', g:TI, dur:4, cols:['#FF6A3D','#FFFFFF','#FFFFFF'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكلمة'},{k:'t2', ar:'حوالين الدايرة'}],
   layers:[{t:'ell', n:'Disc', s:[460,460], f:'c1', a:[pop(0)]}, {t:'ell', n:'Ring', s:[540,540], st:['c3',4], trim:true, a:[draw(0.2,0.8)]},
    {t:'text', n:'Word', fld:'t1', def:'جديد', fs:120, fc:'c2', a:[pop(0.2)]}, {t:'text', n:'Sub', fld:'t2', def:'كولكشن الشتا', fs:34, fc:'c3', p:[0,320], a:[fade(0.6)]}]},
  /* ---------------- callouts */
  {id:'coLine', ar:'كول آوت بخط', en:'Line Callout', g:CO, dur:4, cols:['#FFFFFF','#111111','#FF6A3D'], anc:[0.45,0.55], fields:[{k:'t1', ar:'الكلام'}],
   layers:[{t:'ell', n:'Dot', s:[26,26], f:'c3', a:[pop(0)]}, {t:'ell', n:'Ring', s:[60,60], st:['c3',3], a:[{p:'sc', k:[[0.1,20],[0.9,160]], ez:'o'}, {p:'op', k:[[0.1,100],[0.9,0]], ez:'o'}]},
    {t:'path', n:'Line', pts:[[0,0],[160,-160],[460,-160]], st:['c1',4], trim:true, a:[draw(0.2,0.5)]},
    {t:'rect', n:'Box', s:[320,80], r:10, f:'c1', org:'l', p:[460,-160], a:[grow(0.65,0.35)]}, {t:'text', n:'Label', fld:'t1', def:'جلد طبيعي', fs:40, fc:'c2', p:[620,-160], a:[fade(0.85)]}]},
  {id:'coHotspot', ar:'نقطة نابضة', en:'Pulsing Hotspot', g:CO, dur:4, cols:['#FF6A3D','#FFFFFF','#FF6A3D'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكلام'}],
   layers:[{t:'ell', n:'Pulse 1', s:[60,60], st:['c3',4], pulse:[0.6,6], o:60}, {t:'ell', n:'Pulse 2', s:[110,110], st:['c3',2], pulse:[0.4,4], o:35},
    {t:'ell', n:'Dot', s:[34,34], f:'c1', a:[pop(0)]}, {t:'text', n:'Label', fld:'t1', def:'هنا', fs:42, fc:'c2', p:[0,-90], a:[fade(0.3), rise(0.3,20)]}]},
  {id:'coBrackets', ar:'أقواس تركيز', en:'Focus Brackets', g:CO, dur:3.5, cols:['#FFFFFF','#FFFFFF','#FF6A3D'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكلام'}],
   layers:[[-1,-1],[1,-1],[1,1],[-1,1]].map(function(q, i){ return {t:'path', n:'Corner ' + (i+1), pts:[[q[0]*260, q[1]*120],[q[0]*260, q[1]*170],[q[0]*200, q[1]*170]].map(function(v){ return v; }), st:['c1',8], a:[{p:'dp', k:[[0,[q[0]*120, q[1]*80]],[0.35,[0,0]]], ez:'b'}, fade(0,0.15)]}; })
   .concat([{t:'text', n:'Label', fld:'t1', def:'المنتج', fs:40, fc:'c3', p:[0,-215], a:[fade(0.35)]}])},
  {id:'coSpot', ar:'سبوت لايت', en:'Spotlight Focus', g:CO, dur:4, cols:['#000000','#FFFFFF','#FFC83D'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكلام'}],
   layers:[{t:'path', n:'Dim', pts:[[-1200,-700],[1200,-700],[1200,700],[-1200,700]], closed:true, f:'c1', o:0, a:[{p:'op', k:[[0,0],[0.4,65]], ez:'o'}]},
    {t:'ell', n:'Ring', s:[420,420], st:['c3',5], a:[{p:'sc', k:[[0,180],[0.5,100]], ez:'o'}, fade(0,0.3)]},
    {t:'text', n:'Label', fld:'t1', def:'ركّز هنا', fs:46, fc:'c2', p:[0,270], a:[fade(0.5)]}]},
  {id:'coSticker', ar:'ستيكر بتحديد أبيض', en:'Sticker Outline', g:EX, dur:3.5, cols:['#FFFFFF','#FF6A3D','#111111'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكلمة'}],
   layers:[{t:'rect', n:'Sticker back', s:[560,200], r:100, f:'c1', rot:-6, sh:[40,8,16], jit:[2,0.6,8], a:[{p:'sc', k:[[0,0],[0.2,115],[0.32,100]], ez:'l'}]},
    {t:'rect', n:'Sticker', s:[520,160], r:80, f:'c2', rot:-6, jit:[2,0.6,8], a:[{p:'sc', k:[[0,0],[0.2,115],[0.32,100]], ez:'l'}]},
    {t:'text', n:'Word', fld:'t1', def:'واو!', fs:90, fc:'c1', rot:-6, jit:[2,0.6,8], a:[{p:'sc', k:[[0.05,0],[0.25,115],[0.37,100]], ez:'l'}]}]},
  {id:'exFact', ar:'هل تعلم؟', en:'Did You Know Card', g:EX, dur:5, cols:['#FFC83D','#1B1B1B','#F3EBDD'], anc:[0.5,0.5], fields:[{k:'t1', ar:'العنوان'},{k:'t2', ar:'المعلومة'}],
   layers:[{t:'rect', n:'Card', s:[900,300], f:'c3', rough:4, sh:[45,10,16], jit:[2,0.4,8], a:[{p:'sy', k:[[0.2,0],[0.6,100]], ez:'o'}]},
    {t:'rect', n:'Tab', s:[300,80], f:'c1', p:[300,-170], rot:-3, jit:[2,0.8,8], a:[pop(0)]}, {t:'text', n:'Tab text', fld:'t1', def:'هل تعلم؟', fs:44, fc:'c2', p:[300,-170], rot:-3, jit:[2,0.8,8], a:[pop(0.05)]},
    {t:'text', n:'Fact', fld:'t2', def:'إن القلب بيدق حوالي\n100 ألف مرة في اليوم', fs:54, fc:'c2', jit:[2,0.4,8], a:[fade(0.6)]}]},
  {id:'exTape', ar:'شريط لزق', en:'Tape Strips', g:EX, dur:3, cols:['#E9D49A','#FFFFFF','#111111'], anc:[0.5,0.5], fields:[],
   layers:[[-420,-230,-28],[420,-230,26],[-420,230,24],[420,230,-30]].map(function(q, i){ return {t:'rect', n:'Tape ' + (i+1), s:[200,54], f:'c1', o:85, rot:q[2], p:[q[0],q[1]], jit:[1,1,8], a:[{p:'sc', k:[[0,180],[0.12,100]], ez:'l', d:i*0.12}, {p:'op', k:[[0,0],[0.04,85]], ez:'l', d:i*0.12}]}; })},
  {id:'exChapter', ar:'كارت فصل', en:'Chapter Card', g:EX, dur:4.5, cols:['#FFFFFF','#FF6A3D','#111111'], anc:[0.5,0.5], fields:[{k:'t1', ar:'رقم الفصل'},{k:'t2', ar:'العنوان'}],
   layers:[{t:'rect', n:'Back', s:[1920,1080], f:'c3', a:[fade(0,0.3)]}, {t:'text', n:'Number', fld:'t1', def:'الفصل ٣', fs:60, fc:'c2', p:[0,-90], trk:200, a:[fade(0.3), rise(0.3,30)]},
    {t:'rect', n:'Rule', s:[260,4], f:'c2', p:[0,-30], a:[grow(0.45)]}, {t:'text', n:'Title', fld:'t2', def:'لما كل حاجة اتغيرت', fs:96, fc:'c1', p:[0,60], a:[fade(0.6), rise(0.6,30)]}]},
  {id:'exPolaroid', ar:'صورة بولارويد', en:'Polaroid Frame', g:EX, dur:4, cols:['#F7F4EC','#2A2A2A','#5A6B7A'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكلام تحت الصورة'}],
   layers:[{t:'rect', n:'Frame', s:[560,660], f:'c1', rot:-4, sh:[45,12,20], jit:[2,0.5,8], a:[{p:'dp', k:[[0,[0,800]],[0.5,[0,0]]], ez:'o'}, {p:'rot', k:[[0,15],[0.5,0]], ez:'o'}]},
    {t:'rect', n:'Photo', s:[500,500], f:'c3', p:[0,-50], rot:-4, jit:[2,0.5,8], a:[{p:'dp', k:[[0,[0,800]],[0.5,[0,0]]], ez:'o'}, {p:'rot', k:[[0,15],[0.5,0]], ez:'o'}]},
    {t:'text', n:'Caption', fld:'t1', def:'صيف ٢٠٢٦', fs:44, fc:'c2', p:[0,265], rot:-4, jit:[2,0.5,8], a:[fade(0.6)]}]},
  {id:'exDoodles', ar:'دودلز', en:'Doodle Pack', g:EX, dur:3, cols:['#FFC83D','#FFFFFF','#FF6A3D'], anc:[0.5,0.5], fields:[],
   layers:[{t:'path', n:'Star', pts:star(5,70,30).concat([star(5,70,30)[0]]), st:['c1',6], p:[-300,-120], trim:true, jit:[2,2,10], a:[draw(0,0.5)]},
    {t:'path', n:'Swirl', pts:[[0,0],[40,-30],[80,0],[40,40],[-20,10],[10,-60],[90,-60],[130,10]], smooth:true, st:['c2',6], p:[200,-140], trim:true, jit:[2,2,10], a:[draw(0.15,0.6)]},
    {t:'path', n:'Sparkle', pts:[[0,-60],[0,60]], st:['c3',7], p:[-80,140], trim:true, a:[draw(0.3,0.25)]}, {t:'path', n:'Sparkle 2', pts:[[-60,0],[60,0]], st:['c3',7], p:[-80,140], trim:true, a:[draw(0.38,0.25)]},
    {t:'path', n:'Underline', pts:[[-220,0],[-80,14],[80,-6],[220,10]], smooth:true, st:['c1',8], p:[150,180], trim:true, jit:[2,1,10], a:[draw(0.45,0.5)]},
    {t:'text', n:'Bang', def:'!', fs:160, fc:'c3', p:[360,60], rot:12, jit:[2,3,10], a:[pop(0.6)]}]},
  /* ---------------- infographics */
  {id:'igBars', ar:'رسم أعمدة', en:'Bar Chart', g:IG, dur:5, cols:['#FF6A3D','#FFFFFF','#3A3A44'], anc:[0.5,0.55], fields:[{k:'t1', ar:'العنوان'}],
   layers:[{t:'rect', n:'Axis', s:[900,4], f:'c3', p:[0,220], a:[grow(0,0.4)]}].concat([[-330,0.45],[-165,0.7],[0,0.55],[165,0.9],[330,0.75]].map(function(b, i){ var h = Math.round(b[1]*380); return [
     {t:'rect', n:'Bar ' + (i+1), s:[110,h], r:8, f:i===3 ? 'c1' : 'c3', p:[b[0], 220 - h/2], a:[{p:'sy', k:[[0,0],[0.6,100]], ez:'o', d:0.2 + i*0.12}]},
     {t:'text', n:'Value ' + (i+1), def:String(Math.round(b[1]*100)), fs:36, fc:'c2', p:[b[0], 190 - h], count:[0, Math.round(b[1]*100), 0.2 + i*0.12, 0.7], suf:'%', a:[fade(0.3 + i*0.12)]}]; }).reduce(function(a, b){ return a.concat(b); }, []))
   .concat([{t:'text', n:'Title', fld:'t1', def:'نمو المتابعين', fs:56, fc:'c2', p:[0,-300], a:[fade(0), rise(0,30)]}])},
  {id:'igDonut', ar:'دونات نسبة', en:'Donut Percentage', g:IG, dur:4.5, cols:['#7C5CFF','#FFFFFF','#2A2A33'], anc:[0.5,0.5], fields:[{k:'t1', ar:'النسبة'},{k:'t2', ar:'الكلام'}],
   layers:[{t:'ell', n:'Track', s:[420,420], st:['c3',40]}, {t:'path', n:'Arc', pts:circ(210,48), smooth:true, st:['c1',40], trim:true, a:[{p:'trim', k:[[0.2,0],[1.6,72]], ez:'io'}]},
    {t:'text', n:'Percent', fld:'t1', def:'72', fs:110, fc:'c2', p:[0,-10], count:[0,72,0.2,1.4], cfld:'t1', suf:'%', a:[fade(0.1)]}, {t:'text', n:'Label', fld:'t2', def:'من المشاهدين ستات', fs:36, fc:'c2', p:[0,300], a:[fade(0.5)]}]},
  {id:'igRing', ar:'دايرة إنجاز', en:'Progress Ring KPI', g:IG, dur:4, cols:['#34C759','#FFFFFF','#2A2A33'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الرقم'},{k:'t2', ar:'تحته'}],
   layers:[{t:'ell', n:'Track', s:[300,300], st:['c3',22]}, {t:'path', n:'Arc', pts:circ(150,48), smooth:true, st:['c1',22], trim:true, a:[{p:'trim', k:[[0.1,0],[1.4,100]], ez:'io'}]},
    {t:'text', n:'Number', fld:'t1', def:'250', fs:90, fc:'c2', count:[0,250,0.1,1.3], cfld:'t1', a:[fade(0.1)]}, {t:'text', n:'Label', fld:'t2', def:'مشروع', fs:36, fc:'c2', p:[0,220], a:[fade(0.4)]}]},
  {id:'igLine', ar:'رسم خطي', en:'Line Graph', g:IG, dur:5, cols:['#00C2FF','#FFFFFF','#2E3240'], anc:[0.5,0.55], fields:[{k:'t1', ar:'العنوان'}],
   layers:[0,1,2,3].map(function(i){ return {t:'rect', n:'Grid ' + (i+1), s:[900,2], f:'c3', p:[0,-150 + i*110], a:[grow(i*0.05,0.4)]}; })
   .concat([{t:'path', n:'Graph', pts:[[-450,180],[-300,120],[-150,150],[0,40],[150,70],[300,-60],[450,-150]], st:['c1',8], trim:true, a:[draw(0.3,1.4)]},
    {t:'ell', n:'End dot', s:[30,30], f:'c1', p:[450,-150], a:[pop(1.6)]}, {t:'text', n:'Title', fld:'t1', def:'المبيعات في 2026', fs:52, fc:'c2', p:[0,-280], a:[fade(0)]}])},
  {id:'igTimeline', ar:'تايم لاين', en:'Timeline', g:IG, dur:6, cols:['#FF6A3D','#FFFFFF','#B8B8C4'], anc:[0.5,0.5], fields:[{k:'t1', ar:'سنة 1'},{k:'t2', ar:'سنة 2'},{k:'t3', ar:'سنة 3'},{k:'t4', ar:'سنة 4'}],
   layers:[{t:'rect', n:'Axis', s:[1300,6], f:'c3', a:[grow(0,0.8)]}].concat([0,1,2,3].map(function(i){ var x = 480 - i*320, up = i % 2 ? 1 : -1; return [
     {t:'ell', n:'Node ' + (i+1), s:[44,44], f:'c1', p:[x,0], a:[pop(0.4 + i*0.35)]},
     {t:'text', n:'Year ' + (i+1), fld:'t' + (i+1), def:['2019','2021','2023','2026'][i], fs:52, fc:'c2', p:[x, up*80], a:[fade(0.5 + i*0.35), rise(0.5 + i*0.35, -up*30)]}]; }).reduce(function(a, b){ return a.concat(b); }, []))},
  {id:'igIcons', ar:'٧ من ١٠', en:'Pictogram 7 of 10', g:IG, dur:4.5, cols:['#FF6A3D','#3A3A44','#FFFFFF'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكلام'}],
   layers:[0,1,2,3,4,5,6,7,8,9].map(function(i){ return {t:'ell', n:'Person ' + (i+1), s:[70,70], f:i < 7 ? 'c1' : 'c2', p:[(i - 4.5)*110 * -1, -40], a:[pop(0.1 + i*0.08)]}; })
   .concat([0,1,2,3,4,5,6,7,8,9].map(function(i){ return {t:'rect', n:'Body ' + (i+1), s:[80,90], r:40, f:i < 7 ? 'c1' : 'c2', p:[(i - 4.5)*110 * -1, 60], a:[pop(0.15 + i*0.08)]}; }))
   .concat([{t:'text', n:'Label', fld:'t1', def:'٧ من كل ١٠ بيتفرجوا على الموبايل', fs:46, fc:'c3', p:[0,200], a:[fade(1)]}])},
  {id:'igVs', ar:'مقارنة أ و ب', en:'A vs B Bars', g:IG, dur:4.5, cols:['#FF3B5C','#2E7CF6','#FFFFFF'], anc:[0.5,0.5], fields:[{k:'t1', ar:'أ'},{k:'t2', ar:'ب'}],
   layers:[{t:'rect', n:'Bar A', s:[500,90], r:12, f:'c1', org:'r', p:[-10,-70], a:[grow(0.2,0.8)]}, {t:'rect', n:'Bar B', s:[330,90], r:12, f:'c2', org:'r', p:[-10,70], a:[grow(0.3,0.8)]},
    {t:'text', n:'Label A', fld:'t1', def:'ريلز', fs:46, fc:'c3', just:'l', p:[20,-70], a:[fade(0.2)]}, {t:'text', n:'Label B', fld:'t2', def:'بوستات', fs:46, fc:'c3', just:'l', p:[20,70], a:[fade(0.3)]},
    {t:'text', n:'Value A', def:'64%', fs:40, fc:'c3', p:[-450,-70], count:[0,64,0.2,0.8], suf:'%', a:[fade(0.4)]}, {t:'text', n:'Value B', def:'36%', fs:40, fc:'c3', p:[-280,70], count:[0,36,0.3,0.8], suf:'%', a:[fade(0.5)]}]},
  {id:'igPin', ar:'دبوس خريطة', en:'Map Pin Drop', g:IG, dur:4, cols:['#FF3B30','#FFFFFF','#000000'], anc:[0.5,0.5], fields:[{k:'t1', ar:'المكان'}],
   layers:[{t:'ell', n:'Shadow', s:[80,24], f:'c3', o:35, p:[0,10], a:[{p:'sc', k:[[0,20],[0.45,100]], ez:'o'}]},
    {t:'path', n:'Pin', pts:[[0,0],[-46,-80],[-50,-120],[-30,-160],[0,-172],[30,-160],[50,-120],[46,-80]], closed:true, smooth:true, f:'c1', a:[{p:'dp', k:[[0,[0,-600]],[0.4,[0,0]],[0.5,[0,-30]],[0.6,[0,0]]], ez:'i'}]},
    {t:'ell', n:'Hole', s:[40,40], f:'c2', p:[0,-118], a:[{p:'dp', k:[[0,[0,-600]],[0.4,[0,0]],[0.5,[0,-30]],[0.6,[0,0]]], ez:'i'}]},
    {t:'text', n:'Label', fld:'t1', def:'القاهرة', fs:50, fc:'c2', p:[0,70], a:[fade(0.6), rise(0.6,20)]}]},
  {id:'igRoute', ar:'خط رحلة', en:'Map Route', g:IG, dur:5, cols:['#FFC83D','#FFFFFF','#FF6A3D'], anc:[0.5,0.5], fields:[{k:'t1', ar:'من'},{k:'t2', ar:'لـ'}],
   layers:[{t:'path', n:'Route', pts:[[500,150],[250,-60],[-100,-140],[-500,40]], smooth:true, st:['c1',7], trim:true, a:[draw(0.3,1.8)]},
    {t:'ell', n:'Start', s:[36,36], f:'c3', p:[500,150], a:[pop(0)]}, {t:'ell', n:'End', s:[36,36], f:'c3', p:[-500,40], a:[pop(2)]},
    {t:'text', n:'From', fld:'t1', def:'القاهرة', fs:42, fc:'c2', p:[500,210], a:[fade(0.1)]}, {t:'text', n:'To', fld:'t2', def:'الرياض', fs:42, fc:'c2', p:[-500,100], a:[fade(2.1)]}]},
  {id:'igFlow', ar:'خطوات مترابطة', en:'Process Flow', g:IG, dur:5, cols:['#2E7CF6','#FFFFFF','#B8B8C4'], anc:[0.5,0.5], fields:[{k:'t1', ar:'خطوة 1'},{k:'t2', ar:'خطوة 2'},{k:'t3', ar:'خطوة 3'}],
   layers:[0,1,2].map(function(i){ var x = 450 - i*450; return [
     {t:'rect', n:'Box ' + (i+1), s:[300,140], r:20, f:'c1', p:[x,0], a:[pop(i*0.6)]},
     {t:'text', n:'Step ' + (i+1), fld:'t' + (i+1), def:['فكرة','تصميم','تنفيذ'][i], fs:46, fc:'c2', p:[x,0], a:[fade(0.15 + i*0.6)]}]
     .concat(i < 2 ? [{t:'path', n:'Arrow ' + (i+1), pts:[[x - 160,0],[x - 290,0]], st:['c3',6], trim:true, a:[draw(0.35 + i*0.6,0.3)]}, {t:'path', n:'Head ' + (i+1), pts:[[x - 270,-16],[x - 292,0],[x - 270,16]], st:['c3',6], trim:true, a:[draw(0.6 + i*0.6,0.15)]}] : []); })
   .reduce(function(a, b){ return a.concat(b); }, [])},
  /* ---------------- Ramadan & occasions */
  {id:'rmLantern', ar:'فوانيس متعلقة', en:'Hanging Lanterns', g:RM, dur:6, cols:['#FFC83D','#FFE9A8','#C9A86A'], anc:[0.5,0.2], fields:[{k:'t1', ar:'الكلام'}],
   layers:[[-500,260,0],[0,360,0.3],[500,220,0.6]].map(function(q, i){ return [
     {t:'rect', n:'String ' + (i+1), s:[3,q[1]], f:'c3', p:[q[0], -q[1]/2 + q[1]/2 - 120], a:[growY(q[2],0.4)]},
     {t:'path', n:'Lantern ' + (i+1), pts:[[q[0]-40,q[1]-120],[q[0]+40,q[1]-120],[q[0]+60,q[1]-40],[q[0]+30,q[1]+40],[q[0]-30,q[1]+40],[q[0]-60,q[1]-40]], closed:true, f:'c1', glow:30, spin:0, a:[pop(q[2] + 0.3)]},
     {t:'ell', n:'Light ' + (i+1), s:[40,40], f:'c2', p:[q[0], q[1]-40], pulse:[0.15,5], a:[pop(q[2] + 0.4)]}]; }).reduce(function(a, b){ return a.concat(b); }, [])
   .concat([{t:'text', n:'Greeting', fld:'t1', def:'رمضان كريم', fs:120, fc:'c2', p:[0,620], a:[fade(1), rise(1,40)]}])},
  {id:'rmCrescent', ar:'هلال ونجوم', en:'Crescent Night', g:RM, dur:6, cols:['#FFE9A8','#0E1A3A','#FFFFFF'], anc:[0.5,0.45], fields:[{k:'t1', ar:'الكلام'}],
   layers:[{t:'ell', n:'Moon', s:[300,300], f:'c1', glow:40, p:[0,-80], a:[pop(0)]}, {t:'ell', n:'Moon cut', s:[260,260], f:'c2', p:[70,-120], a:[pop(0.05)]}]
   .concat([[-520,-260],[-380,-60],[420,-280],[560,-40],[-200,-330],[280,-180],[620,-300],[-640,-160]].map(function(q, i){ return {t:'path', n:'Star ' + (i+1), pts:star(4,22,6), closed:true, f:'c3', p:q, pulse:[0.35, 2 + i*0.7], a:[pop(0.2 + i*0.1)]}; }))
   .concat([{t:'text', n:'Greeting', fld:'t1', def:'رمضان مبارك', fs:110, fc:'c1', p:[0,220], a:[fade(0.8), rise(0.8,40)]}])},
  {id:'rmArch', ar:'إطار قوس', en:'Arch Frame', g:RM, dur:5, cols:['#C9A86A','#FFFFFF','#0E1A3A'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكلام'}],
   layers:[{t:'path', n:'Arch', pts:[[-260,360],[-260,-120],[-180,-260],[0,-360],[180,-260],[260,-120],[260,360]], smooth:false, st:['c1',10], trim:true, a:[draw(0,1.2)]},
    {t:'path', n:'Arch inner', pts:[[-220,330],[-220,-100],[-150,-220],[0,-310],[150,-220],[220,-100],[220,330]], st:['c1',3], trim:true, a:[draw(0.3,1.2)]},
    {t:'text', n:'Text', fld:'t1', def:'تقبّل الله\nصيامكم', fs:72, fc:'c2', a:[fade(1), rise(1,30)]}]},
  {id:'rmEid', ar:'عيد مبارك', en:'Eid Greeting', g:RM, dur:5, cols:['#FFC83D','#FFFFFF','#FF6A3D'], anc:[0.5,0.5], fields:[{k:'t1', ar:'التهنئة'},{k:'t2', ar:'من'}],
   layers:[0,1,2,3,4,5,6,7,8,9,10,11].map(function(i){ var a = i/12*Math.PI*2, r = 380 + (i%3)*60; return {t:i % 2 ? 'rect' : 'ell', n:'Confetti ' + (i+1), s:[22,22], f:['c1','c3','c2'][i%3], p:[Math.round(Math.cos(a)*r), Math.round(Math.sin(a)*r*0.6)], spin:i % 2 ? 180 : 0, a:[{p:'dp', k:[[0,[-Math.round(Math.cos(a)*r), -Math.round(Math.sin(a)*r*0.6)]],[0.7,[0,0]]], ez:'o'}, fade(0,0.2)]}; })
   .concat([{t:'text', n:'Greeting', fld:'t1', def:'عيد مبارك', fs:150, fc:'c1', a:[pop(0.2)]}, {t:'text', n:'From', fld:'t2', def:'كل سنة وإنتم طيبين', fs:44, fc:'c2', p:[0,130], a:[fade(0.6)]}])},
  {id:'rmPrayer', ar:'مواعيد الصلاة', en:'Prayer Times Card', g:RM, dur:6, cols:['#C9A86A','#FFFFFF','#0E1A3A'], anc:[0.5,0.5], fields:[{k:'t1', ar:'المدينة'}],
   layers:[{t:'rect', n:'Card', s:[620,720], r:30, f:'c3', o:92, a:[pop(0)]}, {t:'text', n:'City', fld:'t1', def:'القاهرة', fs:56, fc:'c1', p:[0,-290], a:[fade(0.2)]}]
   .concat([['الفجر','4:45'],['الظهر','11:50'],['العصر','2:50'],['المغرب','5:15'],['العشاء','6:35']].map(function(r, i){ return [
     {t:'rect', n:'Row ' + (i+1), s:[540,82], r:14, f:i===3 ? 'c1' : '#1C2A50', p:[0,-170 + i*100], a:[grow(0.3 + i*0.1,0.35)]},
     {t:'text', n:'Prayer ' + (i+1), def:r[0], fs:38, fc:i===3 ? 'c3' : 'c2', just:'r', p:[240,-170 + i*100], a:[fade(0.45 + i*0.1)]},
     {t:'text', n:'Time ' + (i+1), def:r[1], fs:38, fc:i===3 ? 'c3' : 'c2', just:'l', p:[-240,-170 + i*100], a:[fade(0.5 + i*0.1)]}]; }).reduce(function(a, b){ return a.concat(b); }, []))},
  {id:'rmPattern', ar:'نجمة إسلامية', en:'Geometric Star', g:RM, dur:5, cols:['#C9A86A','#FFFFFF','#C9A86A'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكلام'}],
   layers:[{t:'path', n:'Star 8', pts:star(8,260,190,-90).concat([star(8,260,190,-90)[0]]), st:['c1',6], trim:true, spin:8, a:[draw(0,1.4)]},
    {t:'path', n:'Star 8 inner', pts:star(8,170,120,-67.5).concat([star(8,170,120,-67.5)[0]]), st:['c3',3], trim:true, spin:-12, a:[draw(0.3,1.4)]},
    {t:'text', n:'Text', fld:'t1', def:'بسم الله', fs:70, fc:'c2', a:[fade(1.1)]}]},
  /* ---------------- promo */
  {id:'prTag', ar:'تاج سعر بيتمرجح', en:'Swinging Price Tag', g:PR, dur:4.5, cols:['#FF3B3B','#FFFFFF','#FFC83D'], anc:[0.5,0.35], fields:[{k:'t1', ar:'السعر الجديد'},{k:'t2', ar:'السعر القديم'}],
   layers:[{t:'rect', n:'String', s:[3,160], f:'c2', p:[0,-80], a:[growY(0,0.3)]},
    {t:'path', n:'Tag', pts:[[0,0],[160,90],[160,420],[-160,420],[-160,90]], closed:true, f:'c1', a:[{p:'rot', k:[[0,30],[0.5,-14],[0.9,8],[1.3,-4],[1.7,0]], ez:'io'}]},
    {t:'ell', n:'Hole', s:[30,30], f:'c2', p:[0,70]},
    {t:'text', n:'New price', fld:'t1', def:'٤٩٩', fs:110, fc:'c2', p:[0,230], a:[{p:'rot', k:[[0,30],[0.5,-14],[0.9,8],[1.3,-4],[1.7,0]], ez:'io'}]},
    {t:'text', n:'Old price', fld:'t2', def:'٨٩٩', fs:50, fc:'c3', p:[0,340], a:[fade(0.8)]}, {t:'rect', n:'Strike', s:[130,6], f:'c3', p:[0,340], rot:-10, a:[grow(1.1,0.25)]}]},
  {id:'prBurst', ar:'بادج خصم', en:'Discount Burst', g:PR, dur:4, cols:['#FFC83D','#111111','#FF3B3B'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الخصم'},{k:'t2', ar:'تحته'}],
   layers:[{t:'path', n:'Burst', pts:star(18,240,200), closed:true, f:'c1', spin:20, a:[{p:'sc', k:[[0,0],[0.3,115],[0.45,100]], ez:'o'}, {p:'rot', k:[[0,-120],[0.45,0]], ez:'o'}]},
    {t:'text', n:'Percent', fld:'t1', def:'-50%', fs:130, fc:'c2', p:[0,-20], a:[{p:'sc', k:[[0.2,300],[0.38,92],[0.48,100]], ez:'l'}, fade(0.2,0.05)]},
    {t:'text', n:'Label', fld:'t2', def:'على كل حاجة', fs:38, fc:'c2', p:[0,80], a:[fade(0.5)]}]},
  {id:'prCountdown', ar:'عدّاد تنازلي', en:'Countdown Timer', g:PR, dur:6, cols:['#FF6A3D','#FFFFFF','#1C1C24'], anc:[0.5,0.5], fields:[{k:'t1', ar:'العنوان'}],
   layers:[{t:'text', n:'Title', fld:'t1', def:'العرض بيخلص خلال', fs:50, fc:'c2', p:[0,-200], a:[fade(0)]}]
   .concat([['ساعة',23,-330],['دقيقة',59,0],['ثانية',59,330]].map(function(u, i){ return [
     {t:'rect', n:'Box ' + (i+1), s:[260,240], r:24, f:'c3', p:[u[2],0], a:[pop(0.1 + i*0.1)]},
     {t:'text', n:'Digits ' + (i+1), def:String(u[1]), fs:130, fc:'c1', p:[u[2],-10], count:[u[1], u[1] - 5, 0.4, 5.5], a:[fade(0.2 + i*0.1)]},
     {t:'text', n:'Unit ' + (i+1), def:u[0], fs:32, fc:'c2', p:[u[2],160], a:[fade(0.3 + i*0.1)]}]; }).reduce(function(a, b){ return a.concat(b); }, []))},
  {id:'prRibbon', ar:'شريط عرض محدود', en:'Limited Ribbon', g:PR, dur:4, cols:['#FF3B3B','#FFFFFF','#FFFFFF'], anc:[0.85,0.15], fields:[{k:'t1', ar:'الكلام'}],
   layers:[{t:'rect', n:'Ribbon', s:[700,90], f:'c1', rot:35, sh:[35,8,14], a:[{p:'sx', k:[[0,0],[0.45,100]], ez:'o'}]},
    {t:'text', n:'Text', fld:'t1', def:'عرض لفترة محدودة', fs:40, fc:'c2', rot:35, a:[fade(0.35)]}]},
  {id:'prSlam', ar:'خبطة الخصومات', en:'Sale Slam', g:PR, dur:3.5, cols:['#FFFFFF','#FF3B3B','#111111'], anc:[0.5,0.5], fields:[{k:'t1', ar:'فوق'},{k:'t2', ar:'الكلمة الكبيرة'},{k:'t3', ar:'تحت'}],
   layers:[{t:'rect', n:'Flash', s:[1920,1080], f:'c1', o:0, a:[{p:'op', k:[[0.3,80],[0.5,0]], ez:'o'}]},
    {t:'text', n:'Top', fld:'t1', def:'أكبر', fs:80, fc:'c1', p:[0,-190], a:[{p:'sc', k:[[0,300],[0.15,95],[0.22,100]], ez:'l'}, fade(0,0.05)]},
    {t:'text', n:'Big', fld:'t2', def:'تخفيضات', fs:230, fc:'c2', p:[0,0], jit:[6,1,24], a:[{p:'sc', k:[[0,320],[0.18,94],[0.28,100]], ez:'l', d:0.3}, fade(0.3,0.05)]},
    {t:'text', n:'Bottom', fld:'t3', def:'السنة', fs:80, fc:'c1', p:[0,190], a:[{p:'sc', k:[[0,300],[0.15,95],[0.22,100]], ez:'l', d:0.6}, fade(0.6,0.05)]}]},
  {id:'prCoupon', ar:'كوبون خصم', en:'Coupon Card', g:PR, dur:4.5, cols:['#FFFFFF','#111111','#FF6A3D'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكود'},{k:'t2', ar:'الكلام'}],
   layers:[{t:'rect', n:'Ticket', s:[760,300], r:24, f:'c1', sh:[35,10,24], a:[pop(0)]}, {t:'rect', n:'Code box', s:[440,110], r:14, st:['c3',5], p:[60,30], a:[pop(0.2)]},
    {t:'text', n:'Code', fld:'t1', def:'HAMDY20', fs:62, fc:'c3', p:[60,30], trk:100, a:[fade(0.35)]}, {t:'text', n:'Label', fld:'t2', def:'استخدم الكود ده', fs:36, fc:'c2', p:[60,-80], a:[fade(0.3)]},
    {t:'ell', n:'Notch L', s:[60,60], f:'#15161c', p:[-380,0]}, {t:'ell', n:'Notch R', s:[60,60], f:'#15161c', p:[380,0]}]},
  /* ---------------- YouTube & podcast */
  {id:'ytEnd', ar:'إند سكرين يوتيوب', en:'YouTube End Screen', g:YT, dur:8, out:false, cols:['#FF2D2D','#FFFFFF','#1A1A22'], anc:[0.5,0.5], fields:[{k:'t1', ar:'العنوان'}],
   layers:[{t:'rect', n:'Video 1', s:[640,360], r:16, st:['c2',4], f:'c3', p:[-420,40], a:[slide(0,-300), fade(0,0.3)]}, {t:'rect', n:'Video 2', s:[640,360], r:16, st:['c2',4], f:'c3', p:[420,40], a:[slide(0.1,300), fade(0.1,0.3)]},
    {t:'ell', n:'Subscribe', s:[220,220], st:['c1',8], f:'c3', p:[0,-300], a:[pop(0.3)]}, {t:'path', n:'Play', pts:[[-22,-34],[-22,34],[36,0]], closed:true, f:'c1', p:[0,-300], a:[pop(0.4)]},
    {t:'text', n:'Title', fld:'t1', def:'شكراً إنك اتفرجت!', fs:56, fc:'c2', p:[0,330], a:[fade(0.6), rise(0.6,30)]}]},
  {id:'ytIntro', ar:'إنترو قناة', en:'Channel Intro', g:YT, dur:3, cols:['#FF6A3D','#FFFFFF','#14151A'], anc:[0.5,0.5], fields:[{k:'t1', ar:'اسم القناة'}],
   layers:[{t:'ell', n:'Burst', s:[200,200], f:'c1', a:[{p:'sc', k:[[0,0],[0.5,1300]], ez:'o'}]}, {t:'ell', n:'Burst 2', s:[200,200], f:'c3', a:[{p:'sc', k:[[0.15,0],[0.65,1300]], ez:'o'}]},
    {t:'text', n:'Name', fld:'t1', def:'حمدي ستوديو', fs:140, fc:'c2', a:[{p:'sc', k:[[0.5,60],[0.8,105],[0.95,100]], ez:'o'}, fade(0.5,0.15)]}]},
  {id:'ytOutro', ar:'أوترو سوشيال', en:'Social Outro', g:YT, dur:5, cols:['#FF6A3D','#FFFFFF','#2A2A33'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكلام'},{k:'t2', ar:'اليوزر'}],
   layers:[{t:'text', n:'Thanks', fld:'t1', def:'شكراً للمشاهدة', fs:110, fc:'c2', p:[0,-100], a:[fade(0), rise(0,40)]}]
   .concat([-270,-90,90,270].map(function(x, i){ return {t:'rect', n:'Icon ' + (i+1), s:[110,110], r:30, f:i===0 ? 'c1' : 'c3', p:[x,100], a:[pop(0.4 + i*0.12)]}; }))
   .concat([{t:'text', n:'Handle', fld:'t2', def:'@hamdy.motion', fs:44, fc:'c2', p:[0,230], a:[fade(1)]}])},
  {id:'ytChapter', ar:'تاج الموضوع', en:'Topic Tag', g:YT, dur:4, cols:['#FFC83D','#111111','#FFFFFF'], anc:[0.88,0.1], fields:[{k:'t1', ar:'الموضوع'}],
   layers:[{t:'rect', n:'Pill', s:[460,80], r:40, f:'c1', org:'r', p:[40,0], a:[grow(0,0.4)]}, {t:'text', n:'Text', fld:'t1', def:'الجزء ٢: الألوان', fs:38, fc:'c2', just:'r', p:[0,0], a:[fade(0.3)]}]},
  {id:'ytLive', ar:'شارة لايف', en:'Live Badge', g:YT, dur:5, cols:['#FF2D2D','#FFFFFF','#111111'], anc:[0.12,0.1], fields:[{k:'t1', ar:'الكلمة'},{k:'t2', ar:'المشاهدين'}],
   layers:[{t:'rect', n:'Pill', s:[220,74], r:37, f:'c1', a:[pop(0)]}, {t:'ell', n:'Dot', s:[20,20], f:'c2', p:[70,0], pulse:[0.3,7]}, {t:'text', n:'Live', fld:'t1', def:'مباشر', fs:36, fc:'c2', p:[-15,0], a:[fade(0.2)]},
    {t:'rect', n:'Viewers back', s:[200,74], r:37, f:'c3', o:80, p:[230,0], a:[pop(0.2)]}, {t:'text', n:'Viewers', fld:'t2', def:'1,284', fs:32, fc:'c2', p:[230,0], count:[900,1284,0.3,2], cfld:'t2', a:[fade(0.3)]}]},
  {id:'ytWave', ar:'موجة بودكاست', en:'Podcast Waveform', g:YT, dur:6, cols:['#7C5CFF','#FFFFFF','#2A2A33'], anc:[0.5,0.82], fields:[{k:'t1', ar:'اسم الضيف'}],
   layers:[{t:'rect', n:'Plate', s:[900,150], r:24, f:'c3', o:90, a:[grow(0,0.4)]}, {t:'text', n:'Guest', fld:'t1', def:'ضيف الحلقة: أحمد', fs:42, fc:'c2', just:'r', p:[400,0], a:[fade(0.3)]}]
   .concat([0,1,2,3,4,5,6,7,8,9,10,11].map(function(i){ return {t:'rect', n:'Bar ' + (i+1), s:[14,60], r:7, f:'c1', p:[-400 + i*26,0], pulse:[0.5, 5 + (i*1.7)%6], a:[pop(0.3 + i*0.03)]}; }))},
  /* ---------------- education */
  {id:'edSteps', ar:'خطوات مرقمة', en:'Numbered Steps', g:ED, dur:6, cols:['#2E7CF6','#FFFFFF','#B8B8C4'], anc:[0.5,0.5], fields:[{k:'t1', ar:'خطوة 1'},{k:'t2', ar:'خطوة 2'},{k:'t3', ar:'خطوة 3'}],
   layers:[0,1,2].map(function(i){ var y = -150 + i*150; return [
     {t:'ell', n:'Num ' + (i+1), s:[100,100], f:'c1', p:[360,y], a:[pop(i*0.5)]}, {t:'text', n:'N ' + (i+1), def:String(i+1), fs:52, fc:'c2', p:[360,y], a:[pop(i*0.5 + 0.1)]},
     {t:'text', n:'Step ' + (i+1), fld:'t' + (i+1), def:['افتح البرنامج','اختار القالب','دوس تطبيق'][i], fs:50, fc:'c2', just:'r', p:[270,y], a:[fade(i*0.5 + 0.2), slide(i*0.5 + 0.2, 40)]}]; }).reduce(function(a, b){ return a.concat(b); }, [])},
  {id:'edCheck', ar:'تشيك ليست', en:'Checklist', g:ED, dur:6, cols:['#34C759','#FFFFFF','#B8B8C4'], anc:[0.5,0.5], fields:[{k:'t1', ar:'بند 1'},{k:'t2', ar:'بند 2'},{k:'t3', ar:'بند 3'}],
   layers:[0,1,2].map(function(i){ var y = -150 + i*150; return [
     {t:'rect', n:'Box ' + (i+1), s:[80,80], r:16, st:['c3',5], p:[330,y], a:[pop(i*0.6)]},
     {t:'path', n:'Check ' + (i+1), pts:[[312,y],[328,y+18],[352,y-20]], st:['c1',9], trim:true, a:[draw(i*0.6 + 0.3,0.3)]},
     {t:'text', n:'Item ' + (i+1), fld:'t' + (i+1), def:['اكتب السكريبت','صوّر','عدّل وانشر'][i], fs:50, fc:'c2', just:'r', p:[250,y], a:[fade(i*0.6 + 0.1)]}]; }).reduce(function(a, b){ return a.concat(b); }, [])},
  {id:'edBeforeAfter', ar:'قبل وبعد', en:'Before / After', g:ED, dur:5, cols:['#FFFFFF','#FF6A3D','#111111'], anc:[0.5,0.5], fields:[{k:'t1', ar:'قبل'},{k:'t2', ar:'بعد'}],
   layers:[{t:'rect', n:'Divider', s:[8,1080], f:'c1', a:[{p:'dp', k:[[0,[700,0]],[1.2,[0,0]]], ez:'io'}]},
    {t:'ell', n:'Handle', s:[90,90], f:'c1', sh:[40,6,16], a:[{p:'dp', k:[[0,[700,0]],[1.2,[0,0]]], ez:'io'}]},
    {t:'rect', n:'Tag before', s:[180,64], r:32, f:'c3', o:80, p:[-760,-440], a:[fade(1.2)]}, {t:'text', n:'Before', fld:'t1', def:'قبل', fs:34, fc:'c1', p:[-760,-440], a:[fade(1.2)]},
    {t:'rect', n:'Tag after', s:[180,64], r:32, f:'c2', p:[760,-440], a:[fade(1.3)]}, {t:'text', n:'After', fld:'t2', def:'بعد', fs:34, fc:'c1', p:[760,-440], a:[fade(1.3)]}]},
  {id:'edVs', ar:'VS مواجهة', en:'VS Split', g:ED, dur:4, cols:['#FF3B5C','#2E7CF6','#FFFFFF'], anc:[0.5,0.5], fields:[{k:'t1', ar:'اليمين'},{k:'t2', ar:'الشمال'}],
   layers:[{t:'path', n:'Right side', pts:[[60,-540],[960,-540],[960,540],[-60,540]], closed:true, f:'c1', a:[{p:'dp', k:[[0,[1000,0]],[0.4,[0,0]]], ez:'o'}]},
    {t:'path', n:'Left side', pts:[[-960,-540],[60,-540],[-60,540],[-960,540]], closed:true, f:'c2', a:[{p:'dp', k:[[0,[-1000,0]],[0.4,[0,0]]], ez:'o'}]},
    {t:'text', n:'VS', def:'VS', fs:220, fc:'c3', jit:[5,1,24], a:[{p:'sc', k:[[0.4,350],[0.55,92],[0.65,100]], ez:'l'}, fade(0.4,0.05)]},
    {t:'text', n:'Right', fld:'t1', def:'آيفون', fs:90, fc:'c3', p:[480,0], a:[fade(0.5)]}, {t:'text', n:'Left', fld:'t2', def:'سامسونج', fs:90, fc:'c3', p:[-480,0], a:[fade(0.5)]}]},
  {id:'edReview', ar:'رأي عميل', en:'Testimonial', g:ED, dur:5, cols:['#FFC83D','#FFFFFF','#2A2A33'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الرأي'},{k:'t2', ar:'الاسم'}],
   layers:[{t:'rect', n:'Card', s:[900,420], r:30, f:'c3', a:[pop(0)]}].concat([0,1,2,3,4].map(function(i){ return {t:'path', n:'Star ' + (i+1), pts:star(5,30,13), closed:true, f:'c1', p:[120 - i*70,-120], a:[pop(0.3 + i*0.1)]}; }))
   .concat([{t:'text', n:'Quote', fld:'t1', def:'شغل احترافي وتسليم في المعاد', fs:48, fc:'c2', p:[0,10], a:[fade(0.8)]}, {t:'ell', n:'Avatar', s:[70,70], f:'c1', p:[120,120], a:[pop(1)]}, {t:'text', n:'Name', fld:'t2', def:'منى - صاحبة براند', fs:34, fc:'c2', just:'r', p:[70,120], a:[fade(1.1)]}])},
  {id:'edPhone', ar:'موك أب موبايل', en:'Phone Mockup', g:ED, dur:5, cols:['#1A1A22','#FF6A3D','#FFFFFF'], anc:[0.5,0.5], fields:[{k:'t1', ar:'الكلام على الشاشة'}],
   na:[{p:'dp', k:[[0,[0,700]],[0.7,[0,0]]], ez:'o'}],
   layers:[{t:'rect', n:'Body', s:[440,880], r:70, f:'c1', sh:[50,20,40], spin:0}, {t:'rect', n:'Screen', s:[400,840], r:52, f:'c2'}, {t:'rect', n:'Notch', s:[140,34], r:17, f:'c1', p:[0,-385]},
    {t:'text', n:'Screen text', fld:'t1', def:'تطبيقك\nهنا', fs:64, fc:'c3', a:[fade(0.7)]}]},
  {id:'edBrowser', ar:'نافذة متصفح', en:'Browser Window', g:ED, dur:5, cols:['#FFFFFF','#2E7CF6','#E9E9EE'], anc:[0.5,0.5], fields:[{k:'t1', ar:'اللينك'},{k:'t2', ar:'العنوان'}],
   layers:[{t:'rect', n:'Window', s:[1200,720], r:20, f:'c1', sh:[35,14,40], a:[pop(0)]}, {t:'rect', n:'Bar', s:[1200,70], r:20, f:'c3', p:[0,-325]},
    {t:'ell', n:'Dot 1', s:[20,20], f:'#FF5F57', p:[-560,-325]}, {t:'ell', n:'Dot 2', s:[20,20], f:'#FEBC2E', p:[-525,-325]}, {t:'ell', n:'Dot 3', s:[20,20], f:'#28C840', p:[-490,-325]},
    {t:'rect', n:'URL', s:[700,40], r:20, f:'c1', p:[60,-325]}, {t:'text', n:'URL text', fld:'t1', def:'hamdy.studio', fs:26, fc:'#555A63', just:'l', p:[-270,-325], typ:[0.4,0.8]},
    {t:'text', n:'Headline', fld:'t2', def:'موقعك الجديد', fs:80, fc:'c2', p:[0,0], a:[fade(1.2), rise(1.2,30)]}]}
  ];
  add.forEach(function(t){ T.push(t); });
})(typeof HMK_TPL !== 'undefined' ? HMK_TPL : null);
