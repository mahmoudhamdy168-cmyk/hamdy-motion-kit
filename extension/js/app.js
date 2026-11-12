/* HAMDY Motion Kit v0.3 — panel UI */
(function(){
"use strict";
var D = NABD_DATA, P = NABD_PREVIEW;

/* ================================================================ tabs */
var TABS = [
  {id:'tr',  ar:'الانتقالات'},
  {id:'mp',  ar:'موشن بريستس'},
  {id:'tx',  ar:'حركة النص'},
  {id:'ts',  ar:'ستايلات النص'},
  {id:'ln',  ar:'〰 خطوط'},
  {id:'car', ar:'🎠 كاروسيل'},
  {id:'dp',  ar:'🧊 عمق 3D'},
  {id:'bg',  ar:'🌀 خلفية متحركة'},
  {id:'trk', ar:'🎯 تراكينج'},
  {id:'trim', ar:'✂ تريم باث'},
  {id:'gf', ar:'✨ جنريتيف فيل'},
  {id:'tp',  ar:'🧩 قوالب'},
  {id:'ti',  ar:'عناوين جاهزة'},
  {id:'el',  ar:'عناصر'},
  {id:'fx',  ar:'فلاتر وإفكتات'},
  {id:'cap', ar:'الكابشن'},
  {id:'sfx', ar:'الأصوات'},
  {id:'ez',  ar:'الإيز'},
  {id:'lib', ar:'المكتبة'},
  {id:'tl',  ar:'أدوات'},
  {id:'ed',  ar:'✎ تعديل'},
  {id:'br',  ar:'🎞 بي رول وأصوات'},
  {id:'ai',  ar:'🤖 مساعد Claude'}
];
var KIND_AR = {'in':'دخول وخروج', emph:'تأكيد عند البلاي هيد', loop:'لوب على طول اللاير'};

var MSG = {
  NO_PS:'فوتوشوب مش متسطب أو مش لاقيه. افتحه وجرّب تاني.',
  NO_USER_PATH:'حدد اللاير اللي فيه الخط بتاعك (شيب لاير مرسوم بالـ Pen، أو أي لاير عليه ماسك).',
  NEED_FOLLOWER:'حدد كمان اللاير اللي عايزه يمشي على الخط (مع لاير الخط).',
  TIMEOUT:'After Effects مردّش (ممكن يكون مشغول برندر أو فيه نافذة مفتوحة). استنى شوية وجرّب تاني.',
  NO_FOOTAGE:'حدد لاير الفيديو اللي عايز تعمله تراك.',
  NO_MASK:'ارسم ماسك على لاير الفيديو الأول (بالـ Pen أو Ellipse) وحدده.',
  MENU_MISSING:'الأمر ده مش موجود في نسخة After Effects دي.',
  NO_TRACK:'مفيش تراك على اللاير المحدد. اعمل التراك الأول من القسم 1 ودوس Analyze، وبعدين حدد لاير الفيديو.',
  NO_TRACK_DATA:'التراك لسه ملوش داتا. دوس ▶ Analyze في بانل Tracker الأول.',
  NEED_4PTS:'محتاج تراك Perspective بـ 4 نقط (في بانل Tracker اختار Track Type: Perspective corner pin).',
  NO_TRACK_NULL:'اعمل "نل بيمشي مع التراك" الأول.',
  NEED_PIN_LAYER:'حدد الصورة/الفيديو الجديد مع لاير الفيديو المتتبع.',
  HAS_KEYS:'الفيديو عليه كي فريمز في Position أو Anchor. شيلها أو استخدم Warp Stabilizer.',
  NO_SHAPE:'حدد شيب لاير، أو نص، أو ملف Illustrator/SVG.',
  NO_SAVEFRAME:'نسخة After Effects دي مش بتسمح تصوير فريم من السكريبت. حدّث البرنامج أو استخدم Content-Aware Fill.',
  NO_KEY:'حط مفتاح الخدمة الأول.',
  NEED_PERSON:'حدد لاير الشخص المقصوص الأول (اللي الكاروسيل هيلف حواليه).',
  NO_CARD:'حدد كارت من كروت الكاروسيل (لاير اسمه HAMDY CAROUSEL … | card).',
  COLOR_CARD:'الكارت ده لون مش صورة. اعمل الكاروسيل بـ "صور" أو "صور + ألوان" وحط صورة في الخانة دي.',
  NO_COMP:'افتح كومبوزيشن الأول.',
  NO_KEYS:'حدد كي فريمز في التايملاين الأول.',
  NO_PROPS:'حدد خاصية زي Position أو Scale الأول.',
  NO_TEXT:'اكتب النص الأول.',
  NO_TEXT_LAYER:'حدد لاير تكست أو أكتر.',
  NO_LAYERS:'حدد لاير أو أكتر.',
  NO_ANIM_LAYER:'حدد لاير ينفع يتحرك (مش كاميرا أو نل).',
  NEED2:'حدد لايرين أو أكتر.',
  NO_BEATS:'ما لقيتش بيتس واضحة. جرّب حساسية أعلى أو «كل الصوت».',
  BAD_AUDIO:'مش قادر أفك الصوت ده. لو فيديو MOV أو ملف غريب، صدّر الصوت MP3 أو WAV وحطه في الكومب.',
  NEED_VISUAL:'حدد مع المزيكا الصور أو الكليبات اللي عايز تقطّعها.',
  NEED3:'حدد 3 لايرات أو أكتر عشان التوزيع بينهم، أو اختار «الكومب».',
  NO_TEMPLATE:'مش لاقي تمبليت H.264 في الأفتر بتاعك. جرّب Media Encoder.',
  NO_TEXTLAYER:'حدد لاير نص (أو أكتر) الأول.',
  NO_PX_KEY:'حط مفتاح Pexels الأول (ببلاش من pexels.com/api).',
  NO_FS_KEY:'حط مفتاح Freesound الأول (ببلاش من freesound.org).',
  NEED_IMAGE:'حدد لاير صورة أو فيديو الأول.',
  NO_DEPTH:'مفيش عمق 3D معمول في الكومب ده. حدد اللايرات واعمله الأول.',
  NOT_UNDER:'البلاي هيد لازم يكون جوه اللاير المحدد.',
  NO_ROOM:'مفيش وقت كفاية في الكومب بعد البلاي هيد.',
  NO_FOLDER:'الفولدر مش موجود.',
  NO_FILE:'الملف ده مش موجود على الجهاز.',
  NOTHING:'مفيش حاجة محتاجة تتنظم.',
  NO_ENGINE:'محرك After Effects ماتحمّلش. اقفل البانل وافتحها تاني.',
  NO_AUDIO_LAYER:'حدد لاير فيديو أو صوت فيه صوت (مش بريكومب).',
  NO_CAPS:'مفيش كابشن لسه. فرّغ أو استورد SRT الأول.',
  NO_WRITE:'After Effects مش قادر يكتب الملف. فعّل Allow Scripts to Write Files من Preferences ← Scripting & Expressions.',
  NO_NODE:'الخاصية دي محتاجة البانل تكون مفتوحة جوه After Effects.',
  NO_KEY:'حط مفتاح الـ API الأول.'
};
var OKMSG = {
  OK_HIDE_ON:'اللايرات المساعدة (الأصوات، نسخ الستايل، الماسكات) هتستخبى في التايملاين (Shy) ✓',
  OK_HIDE_OFF:'اللايرات المساعدة هتظهر عادي في التايملاين ✓',
  OK_CAF_TRACK:'الماسك اتظبط ✓ دوس ▶ في بانل Tracker',
  OK_UPDATED:'اتحدّث لآخر نسخة ✓',
  OK_EXPANDED:'اتعمل كومب جديد بالمقاس الجديد والخلفية متكملة ✓',
  OK_PS:'اتفتح في فوتوشوب ✓',
  OK_PS_OPEN:'اتفتح الفريم ✓ (لو مفتحش في فوتوشوب افتحه منه)',
  OK_CAF:'جاهز ✓ دوس Generate Fill Layer في بانل Content-Aware Fill',
  OK_TRK_POINT:'اتفتح التراكر ✓ حط المربع على حاجة واضحة ودوس ▶ Analyze',
  OK_TRK_STABILIZE:'اتفتح التراكر للتثبيت ✓ دوس ▶ Analyze',
  OK_TRK_MASK:'اتفتح تراكر الماسك ✓ دوس ▶ في بانل Tracker',
  OK_TRK_CAMERA:'3D Camera Tracker بيحلل دلوقتي ✓',
  OK_TRK_WARP:'Warp Stabilizer بيحلل دلوقتي ✓',
  OK:'تم ✓',
  OK_SFX:'تم ✓ ومعاه صوت ووش',
  OK_NOSFX:'تم ✓ (ملقتش صوت whoosh في فولدرات المكتبة)',
  OK_NOT916:'تم ✓ (الكومب مش 9:16 فالمقاسات اتظبطت بالنسبة)',
  OK_NOTHING:'مفيش حركات من الكيت على اللايرات دي.'
};

/* =============================================================== state */
var DEF = {
  tab:'tr', paused:false, acc:'#b0101c', lang:'ar', hide:true, perf:'full', ui:{side:300, nav:0, card:132},
  sel:{tr:'zoomIn', mp:'overBottom', tx:'fadeUp', ti:'cine1', el:'burst', cap:'karaoke', sfx:'whoosh_soft', ts:'sticker', fx:'tealOrange', ez:'expo', lib:null, tl:'anchor', ed:null, ln:'trZig', car:'car0', trk:'tPoint', trim:'mDraw', gf:'gCAF', dp:'dPush', ai:'', br:'', tp:'uiSub'},
  filter:{},
  tr:{frames:12, snappy:true, sfx:true, flip:false, mframes:20, oframes:30, ocolor:'orig', oblend:'screen', oamount:100},
  mp:{dir:'both', frames:20, at:'layer', side:'def', rev:false, pivot:'el', bnc:false, bncN:2, bncAmt:50, loopAmt:100},
  tx:{text:'حركة النص', based:'auto', frames:20, size:110, secs:3, doIn:true, doOut:true, font:'', pattern:'normal', cps:14, cursor:true, typeSfx:true},
  cap:{provider:'local', q:'best', keys:{deepgram:'', groq:'', openai:''}, lang:'ar-EG', maxWords:3, maxChars:26, size:70, y:72, font:'', upper:false, stroke:false, shadow:true, box:false, boxOp:75, color:'#ffffff', words:[], caps:[], src:''},
  sfx:{key:'', prompt:'', dur:2, gen:[]},
  fx:{mode:'playhead', amount:100},
  ti:{texts:{}, secs:4, side:'r', font:''},
  el:{secs:4, blend:'screen', amount:100},
  ed:{auto:true},
  trk:{smooth:0, rot:true, scale:true, text:'اكتب هنا', size:60, side:'r', amount:40, zoom:6, swap:false, stabRot:true},
  ez:{curve:[0.65,0,0.35,1], str:1, clip:null},
  fav:{}, recent:[], keys:[], brand:{name:'', cols:['#B0101C','#FFFFFF','#0C0C0D'], font:''},
  tp:{f:{}, c:{}, dur:0, place:'def', size:1, sfx:true},
  br:{src:'video', orient:'any', quality:'hd', fit:true, pxKey:'', fsKey:''},
  ai:{key:'', model:'claude-sonnet-5-5', auto:true, frame:false, t0:null, t1:null, bridge:false, port:47811},
  bg:{speed:100, mirror:false},
  dp:{order:'stack', spread:600, pivot:'front', secs:4, amt:100, at:'playhead', fog:false, dof:false, over:0},
  trim:{frames:24, stagger:0, width:4, stroke:'fill', snappy:true, at:'layer', seg:25, speed:100, addStroke:false, fillAfter:false, strokeFade:false},
  gf:{provider:'stability', key:'', prompt:'', search:'', grow:12, feather:14, hold:'layer', patch:true, follow:false, out:'916', lastPS:null},
  car:{count:8, content:'images', images:[], palette:0, colA:'#ff6b3d', colB:'#3d73ff', aspect:1, design:'clean', round:12, border:0, borderColor:'#ffffff', motion:0, speed:30, reverse:false, hold:1, tiltX:-12, backFade:35, backDim:30, blur:false, orbit:true, spokes:false, chain:false, lineStyle:'solid', lineColor:'#ffffff', intro:true, person:false, secs:8, size:100, radius:100, face:0},
  ln:{frames:20, secs:3, col:'accW', width:100, erase:true, speed:100, flow:'travel', guide:true, reverse:false, text:'نص ماشي على خط', pStart:0, pEnd:100, pFrames:45, pDelay:0, pPause:false, pMid:50, pHold:20, pFrames2:30, size:90, snappy:true, sfx:true, at:'layer'},
  lib:{paths:[], fit:true, screen:false},
  tl:{cutModel:'general', cutMode:'above', cutText:'', tbBy:'word', kSpeed:1, kMode:'relative', kName:'', gShape:'pill', gText:'', gBlur:30, gAnim:true, arRev:false, beatSens:'mid', beatBand:'bass', beatGap:0.25, beatMode:'zoom', beatAmt:100, beatDecay:10, align:'center', alignTo:'comp', vMode:'blur', vSize:'1080x1920', rfmt:'mp4', size:0, fps:30, secs:10, name:'', stagger:3, overlap:0, pct:150, nudge:1, deep:false, plat:'reels', zones:true, safe:true, thirds:false, center:false}
};
var S = load();
function load(){
  var s = JSON.parse(JSON.stringify(DEF)), saved = null;
  try{ saved = JSON.parse(localStorage.getItem('hmk_state') || localStorage.getItem('nabd_state4') || 'null'); }catch(e){}
  if(saved){ for(var k in saved){ if(saved[k] && typeof saved[k]==='object' && !Array.isArray(saved[k]) && s[k] && typeof s[k]==='object'){ for(var j in saved[k]) s[k][j]=saved[k][j]; } else s[k]=saved[k]; } }
  if(!Array.isArray(s.lib.paths)) s.lib.paths = [];
  if(!s.cap.keys) s.cap.keys = {deepgram:'', groq:'', openai:''};
  if(!Array.isArray(s.sfx.gen)) s.sfx.gen = [];
  if(!s.mp6){ if(s.mp && [5,10,15,20,25,30,45].indexOf(s.mp.frames) < 0) s.mp.frames = 20; s.mp6 = 1; } // motion preset durations: 5-frame steps
  if(!s.theme2){ if(s.acc === '#ff6b3d') s.acc = '#b0101c'; s.theme2 = 1; } // new brand colours: black + dark red
  return s;
}
function save(){ try{ localStorage.setItem('hmk_state', JSON.stringify(S)); }catch(e){} }

/* ========================================================= host bridge */
var CEP = !!(window.__adobe_cep__);
var LIBFILES = [];
function asciiJSON(o){ return JSON.stringify(o).replace(/[\u007f-￿]/g, function(c){ return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4); }); }
function rawEval(script, ms){
  return new Promise(function(res){
    var done = false, h = setTimeout(function(){ if(!done){ done = true; res(JSON.stringify({ok:false, code:'TIMEOUT'})); } }, ms || 45000);
    window.__adobe_cep__.evalScript(script, function(r){ if(done) return; done = true; clearTimeout(h); res(r); });
  });
}
function host(cmd, args, ms){
  var payload = {cmd:cmd, tuck:S.hide !== false, mkLang:S.lang}; for(var k in (args||{})) payload[k]=args[k];
  // name of the applied effect, written on the layer markers instead of "HAMDY IN"
  if(payload.mkName === undefined){ try{ var ci = cur(); if(ci) payload.mkName = (S.lang === 'en' ? (ci.en || ci.ar) : (ci.ar || ci.en)) || ''; }catch(e){} }
  if(!CEP) return new Promise(function(res){ setTimeout(function(){ res(mock(payload)); }, 120); });
  return rawEval('NABD.run(' + JSON.stringify(asciiJSON(payload)) + ')', ms).then(function(r){
    try{ return JSON.parse(r); }catch(e){ return {ok:false, code:'NO_ENGINE', msg:String(r)}; }
  });
}
function extPath(){
  var p = decodeURI(window.__adobe_cep__.getSystemPath('extension'));
  return /^Win/i.test(navigator.platform) ? p.replace('file:///','') : p.replace('file://','');
}
var ENG_ERR = '';
function ensureEngine(force){
  if(!CEP) return Promise.resolve(null);
  return host('ping').then(function(r){
    if(!force && r.ok && r.data && r.data.ver===HMK.ver) return r;
    var f = (extPath() + '/jsx/host.jsx').replace(/\\/g,'/'), err = '';
    // 1) load the file from disk and report the exact error (line + message) if it fails
    var s1 = '(function(){ try { var f = new File(' + asciiJSON(f) + '); if(!f.exists) return "ERR:file not found: " + f.fsName; $.evalFile(f); return (typeof NABD === "undefined") ? "ERR:NABD missing" : "OK"; } catch(e) { return "ERR:line " + (e.line || "?") + ": " + e.message; } })()';
    return rawEval(s1, 60000).then(function(o){
      if(String(o).indexOf('ERR:') === 0) err = String(o).slice(4);
      return host('ping');
    }).then(function(r2){
      if((r2.ok && r2.data && r2.data.ver === HMK.ver) || !NODE) return r2;
      // 2) fallback: read the engine with Node and send it straight to After Effects (avoids path/encoding problems)
      var src = ''; try{ src = NODE('fs').readFileSync(f, 'utf8'); }catch(e){ err = err || ('read: ' + e.message); }
      if(!src) return {ok:false, code:'NO_ENGINE', msg:err};
      src = src.replace(/[\u0080-\uffff]/g, function(c){ return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4); });
      return rawEval(src + '\n"HMK_LOADED"', 60000).then(function(o){
        if(String(o) !== 'HMK_LOADED' && !err) err = String(o);
        return host('ping');
      });
    }).then(function(r3){ if(!r3.ok) r3.msg = err || r3.msg; ENG_ERR = r3.ok ? '' : (err || r3.msg || ''); return r3; });
  });
}
function mock(p){
  if(p.cmd==='libPick') return {ok:true, data:{path:null}};
  if(p.cmd==='libList') return {ok:true, data:{files:[]}};
  return {ok:false, code:'MOCK'};
}
function say(r){
  var el = $('toast'); if(!el) return;
  if(r.code==='MOCK'){ el.className='toast info'; el.textContent='ده وضع معاينة بس. الزرار بيشتغل لما البانل تكون مفتوحة جوه After Effects.'; return; }
  if(r.ok){
    var d = typeof r.data==='string' ? r.data : 'OK', m = OKMSG[d];
    if(!m && /^OK_MOVED:/.test(d)) m = 'اتنقل ' + d.split(':')[1] + ' عنصر ✓';
    if(!m && /^OK_CAPS:/.test(d)) m = 'اتحط ' + d.split(':')[1] + ' كابشن ✓';
    if(!m && /^OK_BEATS:/.test(d)) m = trText('اتحط على') + ' ' + d.split(':')[1] + ' ' + trText('بيت ✓');
    if(!m && /^OK_REMOVED:/.test(d)) m = trText('اتشال') + ' ' + d.split(':')[1] + ' ' + trText('ملف من المشروع ✓');
    if(!m && d==='OK_AME') m = 'اتبعت لـ Media Encoder ✓';
    if(!m && d==='OK_FRAME_ONLY') m = 'اتفصل ✓ (ده الفريم اللي عند البلاي هيد بس، لأن اللاير فيديو)';
    if(!m && d==='OK_AME_FALLBACK') m = 'مالقيتش تمبليت MP4 فبعته لـ Media Encoder ✓';
    if(!m && d==='OK_SAVED') m = 'الصورة اتحفظت في فولدر Hamdy Exports ✓';
    if(!m && r.data && r.data.path) m = 'خلص ✓ ' + r.data.path;
    if(!m && /^OK_DPSKIP:/.test(d)) m = 'العمق اتعمل ✓ واتساب ' + d.split(':')[1] + ' لاير عشان متعلق على Parent';
    if(!m && /^OK_SKIPPED:/.test(d)) m = 'تم ✓ واتساب ' + d.split(':')[1] + ' لاير (عليه كي فريمز في الأنكور)';
    el.className='toast ok'; el.textContent = trText(m || 'تم ✓');
  } else {
    el.className='toast bad'; el.textContent = MSG[r.code] ? trText(MSG[r.code]) : (trText('حصل خطأ:') + ' ' + (r.msg || r.code));
    if(r.code === 'NO_ENGINE'){ if(ENG_ERR) el.textContent += ' — ' + ENG_ERR.slice(0, 160); if(!PINGING) engineRetry(false); }
  }
  clearTimeout(el._t); el._t = setTimeout(function(){ el.className='toast'; }, 5500);
}

/* any panel error shows up instead of a silent dead button */
window.addEventListener('error', function(e){ try{ var el = document.getElementById('toast'); if(!el) return; el.className = 'toast bad'; el.textContent = 'مشكلة في البانل: ' + (e.message || e) + ' — صوّرها وابعتها.'; }catch(x){} });
window.addEventListener('unhandledrejection', function(e){ try{ var el = document.getElementById('toast'); if(!el) return; el.className = 'toast bad'; el.textContent = 'مشكلة في البانل: ' + ((e.reason && e.reason.message) || e.reason) + ' — صوّرها وابعتها.'; }catch(x){} });

/* ============================================================ helpers */
var $ = function(id){ return document.getElementById(id); };
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function hexRGB(h){ h = String(h).replace('#',''); return [parseInt(h.substr(0,2),16)/255, parseInt(h.substr(2,2),16)/255, parseInt(h.substr(4,2),16)/255]; }
function byId(list, id){ for(var i=0;i<list.length;i++) if(list[i].id===id) return list[i]; return null; }
function setAcc(){ var r = document.documentElement.style, c = hexRGB(S.acc).map(function(v){ return Math.round(Math.min(1, v*1.25 + 0.12)*255); });
  r.setProperty('--acc', S.acc); r.setProperty('--acc2', 'rgb(' + c.join(',') + ')'); }
var TLABEL = {ffx:'FX', video:'VIDEO', image:'IMG', audio:'SFX'};
function typeName(t){ return {ffx:'بريسيتس', video:'فيديو', image:'صور', audio:'أصوات'}[t] || t; }
function folderName(p){ var s = String(p).replace(/[\\\/]+$/,''); return s.split(/[\\\/]/).pop(); }

function itemsOf(tab){
  switch(tab){
    case 'tr': return D.TRANSITIONS;
    case 'mp': return D.MOTION;
    case 'tx': return D.TEXTS;
    case 'ti': return D.TITLES;
    case 'tp': return HMK_TPL;
    case 'el': return D.ELEMENTS;
    case 'ez': return D.EASES;
    case 'tl': return D.TOOLS;
    case 'cap': return D.CAPSTYLES;
    case 'ts': return D.TSTYLES;
    case 'fx': return D.FILTERS;
    case 'sfx': return NABD_SFX.concat(S.sfx.gen);
    case 'ed': return [];
    case 'ai': return [];
    case 'br': return [];
    case 'ln': return MY_PATH.concat(NABD_LINES.LIST);
    case 'car': return NABD_CAR.SHAPES;
    case 'trk': return NABD_TOOLS2.TRK;
    case 'gf': return NABD_TOOLS2.GF;
    case 'trim': return NABD_TOOLS2.TRIM;
    case 'dp': return NABD_TOOLS2.DEPTH;
    case 'bg': return BG_DIRS;
    case 'lib': return LIBFILES.map(function(f){ return {id:f.path, ar:f.name, en:TLABEL[f.type], g:typeName(f.type), f:f}; });
  }
  return [];
}
function cur(){ var its = itemsOf(S.tab); return byId(its, S.sel[S.tab]) || its[0] || null; }

/* host specs built from data */
function txSpec(tp){
  var k = (S.tx.size||110)/110, pr = [];
  if(tp.op!==undefined) pr.push(['ADBE Text Opacity', tp.op]);
  if(tp.pos) pr.push(['ADBE Text Position 3D', [tp.pos[0]*k, tp.pos[1]*k, 0]]);
  if(tp.sc!==undefined) pr.push(['ADBE Text Scale 3D', [tp.sc, tp.sc, 100]]);
  if(tp.rot) pr.push(['ADBE Text Rotation', tp.rot]);
  if(tp.blur) pr.push(['ADBE Text Blur', [tp.blur[0]*k, tp.blur[1]*k]]);
  if(tp.skew) pr.push(['ADBE Text Skew', tp.skew]);
  if(tp.trk) pr.push(['ADBE Text Tracking Amount', tp.trk]);
  if(tp.chOff) pr.push(['ADBE Text Character Offset', tp.chOff]);
  if(tp.fill){ var c = hexRGB(S.acc); pr.push(['ADBE Text Fill Color', [c[0], c[1], c[2], 1]]); }
  if(tp.scv) pr.push(['ADBE Text Scale 3D', [tp.scv[0], tp.scv[1], 100]]);
  if(tp.rx) pr.push(['ADBE Text Rotation X', tp.rx]);
  if(tp.ry) pr.push(['ADBE Text Rotation Y', tp.ry]);
  return {id:tp.id, props:pr, random:!!tp.random, square:!!tp.square, overshoot:!!tp.overshoot, loop:tp.loop||null, pattern:(tp.random||tp.overshoot) ? 'normal' : S.tx.pattern,
          three:!!tp.three, wig:tp.wig||0, amt:tp.amt||null, src:tp.src||null, tw:!!tp.tw, twEase:tp.twEase||null, twOrder:tp.twOrder||null, twDur:tp.twDur||0, trail:tp.trail||null, fx:tp.fx ? txFxScale(tp.fx, k) : null};
}
function txFxScale(fx, k){
  return fx.map(function(f){
    var o = {m:f.m, ez:f.ez, s:f.s, x:f.x, once:!!f.once, k:(f.k||[]).map(function(q){ return q[3] ? [q[0], q[1]*k, q[2]*k] : [q[0], q[1], q[2]]; })};
    if(f.acc) o.s = (o.s||[]).concat([[f.acc, hexRGB(S.acc)]]);
    return o;
  });
}
function mpSpec(m){ return {id:m.id, kind:m.kind, ease:m.ease, tr:m.tr, keys:m.keys, ex:m.ex, wa:m.wa, feather:m.feather, dbDir:m.dbDir}; }
/* direction override for motion presets: same move, coming from (or leaving to) the chosen side */
function mpSided(m){
  var sd = S.mp.side, rv = !!S.mp.rev;
  if(!m || m.kind === 'loop' || m.kind === 'emph' || ((!sd || sd === 'def') && !rv)) return m;
  var o = {}, k; for(k in m) o[k] = m[k];
  var t = {}; for(k in (m.tr || {})) t[k] = m.tr[k];
  if(rv){ // reverse: inside-out becomes outside-in (scale mirrored around 100%, moves/rotations flipped)
    ['s','sx','sy'].forEach(function(q){ if(t[q] !== undefined) t[q] = t[q] < 100 ? 100 + (100 - t[q]) : Math.max(0, 100 - (t[q] - 100)); });
    ['x','y','r','sk','rx','ry'].forEach(function(q){ if(t[q] !== undefined) t[q] = -t[q]; });
  }
  o.tr = t;
  if(!sd || sd === 'def') return o;
  var mag = Math.max(Math.abs(t.x || 0), Math.abs(t.y || 0)) || 160;
  delete t.x; delete t.y;
  if(sd === 'right') t.x = mag; else if(sd === 'left') t.x = -mag; else if(sd === 'top') t.y = -mag; else if(sd === 'bottom') t.y = mag;
  if(t.sk !== undefined && (sd === 'left' || sd === 'top')) t.sk = -Math.abs(t.sk);
  if(t.sk !== undefined && (sd === 'right' || sd === 'bottom')) t.sk = Math.abs(t.sk);
  o.tr = t; o.dbDir = (sd === 'right' || sd === 'left') ? 90 : 0;
  return o;
}
var EN_LINES = ['YOUR TITLE', 'Subtitle goes here', 'Third line'];
function tiTexts(ti){
  var saved = S.ti.texts[ti.id] || [];
  return ti.lines.map(function(l, i){ if(saved[i]!==undefined) return saved[i]; return (S.lang==='en' && /[\u0600-\u06FF]/.test(l)) ? (EN_LINES[i] || 'Your text') : l; });
}
function titleArgs(ti){
  var L = tiTexts(ti), texts = {}, i;
  for(i=0;i<L.length;i++) texts[String(i)] = L[i];
  var uid = Math.random().toString(36).slice(2,7);
  var parts = ti.parts.map(function(p){
    var o = JSON.parse(JSON.stringify(p));
    if(p.in){ o.inSpec = {spec:mpSpec(byId(D.MOTION, p.in[0])), frames:p.in[1], delay:p.in[2]||0}; }
    if(p.out){ o.outSpec = {spec:mpSpec(byId(D.MOTION, p.out[0])), frames:p.out[1], delay:p.out[2]||0}; }
    delete o.in; delete o.out;
    if(p.loop){ o.loopSpec = mpSpec(byId(D.MOTION, p.loop)); delete o.loop; }
    if(p.key==='count'){
      var a = parseFloat(L[0])||0, b = parseFloat(L[1])||0;
      o.expr = 'var a = ' + a + ', b = ' + b + ', t0 = inPoint + 0.25, t1 = t0 + 1.5;\nvar v = ease(time, t0, t1, a, b);\nMath.round(v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") + ' + JSON.stringify(L[2]||'') + ';';
      texts.count = String(b);
    }
    if(p.key==='down'){
      var N = parseFloat(L[0])||10;
      o.expr = 'var N = ' + N + ', s = Math.max(0, N - (time - inPoint));\nvar v = Math.ceil(s);\nN >= 60 ? Math.floor(v / 60) + ":" + ("0" + (v % 60)).slice(-2) : String(v);';
      texts.down = String(N);
    }
    if(p.key==='pct'){
      var Pc = parseFloat(L[0])||0;
      o.expr = 'Math.round(ease(time, inPoint + 0.4, inPoint + 1.6, 0, ' + Pc + ')) + "%";';
      texts.pct = String(Pc);
    }
    return o;
  });
  return {name:ti.ar, uid:uid, parts:parts, texts:texts, place:ti.place, side:ti.side || S.ti.side, secs:S.ti.secs, acc:hexRGB(S.acc), font:S.ti.font};
}

/* ============================================================ render */
var live = [], stageEl = null;

function renderTabs(){
  $('tabs').innerHTML = TABS.map(function(t){ return '<button data-t="' + t.id + '" class="' + (S.tab===t.id?'on':'') + '">' + t.ar + '</button>'; }).join('');
  Array.prototype.forEach.call($('tabs').children, function(b){ b.onclick = function(){ S.tab = b.dataset.t; save(); $('q').value=''; renderAll(); if(S.tab==='ed') edRefresh(true); }; });
}

function renderGrid(){
  var its = itemsOf(S.tab), q = $('q').value.trim().toLowerCase(), fl = S.filter[S.tab] || 'الكل';
  var groups = ['الكل'], favs = S.fav[S.tab] || [];
  var recs = projRecent(S.tab);
  if(recs.length) groups.push(RECENT_G);
  if(favs.length) groups.push('★');
  its.forEach(function(it){ if(groups.indexOf(it.g)<0) groups.push(it.g); });
  if(groups.indexOf(fl)<0) fl = 'الكل';
  $('filters').innerHTML = groups.length>2 ? groups.map(function(g){ return '<button data-g="' + esc(g) + '" class="' + (g===fl?'on':'') + '">' + g + '</button>'; }).join('') : '';
  Array.prototype.forEach.call($('filters').children, function(b){ b.onclick = function(){ S.filter[S.tab] = b.dataset.g || b.textContent; save(); renderGrid(); }; });
  $('count').textContent = its.length + (S.lang==='en' ? ' items' : ' عنصر');

  var grid = $('grid'); if(IO) IO.disconnect(); grid.innerHTML = ''; live = [];
  grid.className = 'grid' + (S.tab==='tl' ? ' small' : '');
  if(S.tab==='ed'){ $('filters').innerHTML=''; renderEdit(); return; }
  if(S.tab==='ai'){ $('filters').innerHTML=''; AI.renderChat(); return; }
  if(S.tab==='br'){ $('filters').innerHTML=''; STOCK.render(); return; }
  var shown = its.filter(function(it){
    if(fl===RECENT_G){ if(recs.indexOf(it.id)<0) return false; }
    else if(fl==='★'){ if(favs.indexOf(it.id)<0) return false; }
    else if(fl!=='الكل' && it.g!==fl) return false;
    if(q && (it.ar + ' ' + (it.en||'')).toLowerCase().indexOf(q)<0) return false;
    return true;
  });
  if(fl===RECENT_G) shown.sort(function(a, b){ return recs.indexOf(a.id) - recs.indexOf(b.id); });

  if(!shown.length){
    grid.innerHTML = '<div class="empty">' + (S.tab==='lib' ? (S.lib.paths.length ? 'مفيش ملفات في الفولدرات دي. ضيف بريسيتس .ffx أو أوفرليز أو أصوات ودوس "تحديث".' : 'ضيف فولدر الريسورسز بتاعك من اللوحة اللي على اليمين (زي Add Folder).') : 'مفيش نتايج.') + '</div>';
    return;
  }
  shown.forEach(function(it){
    var c = document.createElement('div');
    c.className = 'card' + (S.sel[S.tab]===it.id ? ' sel' : '');
    c.innerHTML = '<div class="thumb"></div><div class="nm"><span>' + esc(it.ar) + '</span><em>' + esc(it.en||'') + '</em></div><button class="favb' + (favs.indexOf(it.id)>=0 ? ' on' : '') + '" title="مفضلة">★</button>';
    var th = c.firstChild;
    c.querySelector('.favb').onclick = function(e){ e.stopPropagation(); var f = S.fav[S.tab] = S.fav[S.tab] || [], i = f.indexOf(it.id); if(i>=0) f.splice(i,1); else f.push(it.id); save(); e.target.classList.toggle('on', i<0); if(fl==='★' || (!f.length) || (f.length===1 && i<0)) renderGrid(); };
    mountThumb(th, it, false);
    c.onclick = function(){ if(c._noClick) return; S.sel[S.tab] = it.id; save(); Array.prototype.forEach.call(grid.children, function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); if(S.tab==='cap' && S.cap.words.length) rechunk(); renderSide(); if(S.tab==='sfx') playSfx(it); };
    c.ondblclick = function(){ S.sel[S.tab] = it.id; renderSide(); apply(); };
    if(S.tab !== 'ed') dragOut(c, it);
    if(S.tab==='lib' && it.f.type==='video'){
      c.onmouseenter = function(){ var v=th.querySelector('video'); if(v) v.play().catch(function(){}); };
      c.onmouseleave = function(){ var v=th.querySelector('video'); if(v) v.pause(); };
    }
    grid.appendChild(c);
  });
}

function fileURL(p){
  var s = String(p).replace(/\\/g,'/'), parts = s.split('/');
  var enc = parts.map(function(seg,i){ return (i===0 && /^[A-Za-z]:$/.test(seg)) ? seg : encodeURIComponent(seg); }).join('/');
  return 'file://' + (enc.charAt(0)==='/' ? '' : '/') + enc;
}
function libThumb(f, big){
  if(f.type==='image' && !/\.(psd|ai|exr|tif|tiff)$/i.test(f.name)) return '<div class="libth"><img loading="lazy" src="' + fileURL(f.path) + '"></div>';
  if(f.type==='video') return '<div class="libth"><video muted loop playsinline preload="metadata" src="' + fileURL(f.path) + '#t=0.5"' + (big?' autoplay controls':'') + '></video></div>';
  if(f.type==='audio') return '<div class="libth"><span class="bigicon">♪</span>' + (big ? '<audio controls src="' + fileURL(f.path) + '"></audio>' : '') + '</div>';
  return '<div class="libth"><span class="bigicon">FX</span></div>';
}

function guideSVG(g, opt){
  var w, h, x, y, s = '<svg viewBox="0 0 160 100"><rect width="160" height="100" fill="#121216"/>';
  if(g.z){
    h = 92; w = h*9/16; x = (160-w)/2; y = 4;
    s += '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="#2a2a31"/>';
    var t=g.z.top/1920*h, b=g.z.bottom/1920*h, l=g.z.left/1080*w, r=g.z.right/1080*w;
    if(opt.zones){
      s += '<g fill="#ff2a40" opacity=".35"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+t+'"/><rect x="'+x+'" y="'+(y+h-b)+'" width="'+w+'" height="'+b+'"/><rect x="'+(x+w-r)+'" y="'+(y+t)+'" width="'+r+'" height="'+(h-t-b)+'"/></g>';
      s += '<rect x="'+x+'" y="'+(y+t)+'" width="'+l+'" height="'+(h-t-b)+'" fill="#ff2a40" opacity=".22"/>';
    }
    if(opt.safe) s += '<rect x="'+(x+l)+'" y="'+(y+t)+'" width="'+(w-l-r)+'" height="'+(h-t-b)+'" fill="none" stroke="#33ff73" stroke-width="1.2"/>';
  } else {
    w=150; h=84; x=5; y=8;
    s += '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3" fill="#2a2a31"/>';
    if(opt.safe) s += '<rect x="'+(x+w*.05)+'" y="'+(y+h*.05)+'" width="'+(w*.9)+'" height="'+(h*.9)+'" fill="none" stroke="#33ff73" stroke-width="1.2"/><rect x="'+(x+w*.1)+'" y="'+(y+h*.1)+'" width="'+(w*.8)+'" height="'+(h*.8)+'" fill="none" stroke="#33ccff" stroke-width="1.2"/>';
  }
  if(opt.thirds) s += '<g stroke="#33ccff" stroke-width=".8"><line x1="'+(x+w/3)+'" y1="'+y+'" x2="'+(x+w/3)+'" y2="'+(y+h)+'"/><line x1="'+(x+2*w/3)+'" y1="'+y+'" x2="'+(x+2*w/3)+'" y2="'+(y+h)+'"/><line x1="'+x+'" y1="'+(y+h/3)+'" x2="'+(x+w)+'" y2="'+(y+h/3)+'"/><line x1="'+x+'" y1="'+(y+2*h/3)+'" x2="'+(x+w)+'" y2="'+(y+2*h/3)+'"/></g>';
  if(opt.center){ var cx=x+w/2, cy=y+h/2; s += '<g stroke="#fff"><line x1="'+(cx-5)+'" y1="'+cy+'" x2="'+(cx+5)+'" y2="'+cy+'"/><line x1="'+cx+'" y1="'+(cy-5)+'" x2="'+cx+'" y2="'+(cy+5)+'"/></g>'; }
  return s + '</svg>';
}

var TICON = {
  cutout:'<rect x="20" y="16" width="120" height="68" rx="6" fill="#2f2f38"/><g fill="none" stroke="#55555f" stroke-width="2" stroke-dasharray="4 4"><rect x="20" y="16" width="120" height="68" rx="6"/></g><circle cx="80" cy="40" r="13" fill="var(--acc)"/><path d="M56 84q4-28 24-28t24 28z" fill="var(--acc)"/>',
  tbreak:'<g font-family="sans-serif" font-size="20" fill="#fff" text-anchor="middle"><rect x="18" y="34" width="38" height="30" rx="4" fill="#2f2f38"/><text x="37" y="55">' + (S.lang==='en' ? 'Hi' : 'أهلاً') + '</text><rect x="62" y="34" width="38" height="30" rx="4" fill="var(--acc)"/><text x="81" y="55" fill="#111">' + (S.lang==='en' ? 'and' : 'بيك') + '</text><rect x="106" y="34" width="38" height="30" rx="4" fill="#2f2f38"/><text x="125" y="55">' + (S.lang==='en' ? 'bye' : 'هنا') + '</text></g>',
  rekey:'<g fill="var(--acc)"><path d="M40 50l10-10 10 10-10 10z"/><path d="M75 50l10-10 10 10-10 10z"/><path d="M110 50l10-10 10 10-10 10z"/></g><path d="M50 66q35 24 70 0" fill="none" stroke="#fff" stroke-width="3"/><circle cx="120" cy="66" r="4" fill="#fff"/>',
  brand:'<g><rect x="28" y="28" width="30" height="44" rx="6" fill="var(--acc)"/><rect x="65" y="28" width="30" height="44" rx="6" fill="#ffffff"/><rect x="102" y="28" width="30" height="44" rx="6" fill="#2a2a31" stroke="#55555f"/></g>',
  glass:'<defs><linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#b0101c"/><stop offset="1" stop-color="#5a6cff"/></linearGradient></defs><rect x="10" y="10" width="140" height="80" fill="url(#tg)" opacity=".55"/><rect x="34" y="36" width="92" height="30" rx="15" fill="#ffffff" fill-opacity=".22" stroke="#fff" stroke-opacity=".8"/><text x="80" y="56" font-size="12" fill="#fff" text-anchor="middle" font-family="sans-serif">glass</text>',
  fixAr:'<text x="80" y="62" font-size="34" fill="var(--acc)" text-anchor="middle" font-family="sans-serif" direction="rtl">عربي</text><path d="M40 78h80" stroke="#55555f" stroke-width="2"/><path d="M48 74l-8 4 8 4" fill="none" stroke="#fff" stroke-width="2"/>',
  beat:'<g fill="var(--acc)"><rect x="22" y="44" width="6" height="12"/><rect x="34" y="30" width="6" height="40"/><rect x="46" y="40" width="6" height="20"/><rect x="58" y="18" width="6" height="64"/><rect x="70" y="38" width="6" height="24"/><rect x="82" y="26" width="6" height="48"/><rect x="94" y="42" width="6" height="16"/><rect x="106" y="20" width="6" height="60"/><rect x="118" y="36" width="6" height="28"/><rect x="130" y="44" width="6" height="12"/></g><g fill="#fff"><path d="M61 10l-4-6h8z"/><path d="M109 10l-4-6h8z"/></g>',
  align:'<line x1="40" y1="14" x2="40" y2="86" stroke="var(--acc)" stroke-width="3"/><rect x="40" y="22" width="80" height="16" rx="3" fill="#55555f"/><rect x="40" y="44" width="50" height="16" rx="3" fill="#77777f"/><rect x="40" y="66" width="96" height="16" rx="3" fill="#99999f"/>',
  vertical:'<rect x="20" y="30" width="64" height="40" rx="3" fill="#55555f"/><path d="M92 50h14" stroke="#fff" stroke-width="3"/><path d="M106 44l8 6-8 6z" fill="#fff"/><rect x="118" y="12" width="28" height="76" rx="3" fill="#2f2f38"/><rect x="118" y="38" width="28" height="24" fill="var(--acc)"/>',
  unused:'<rect x="40" y="20" width="80" height="60" rx="4" fill="none" stroke="#55555f" stroke-width="2"/><g fill="#77777f"><rect x="50" y="30" width="60" height="8" rx="2"/><rect x="50" y="46" width="60" height="8" rx="2"/></g><rect x="50" y="62" width="60" height="8" rx="2" fill="var(--acc)"/><path d="M116 60l14 14M130 60l-14 14" stroke="#f55" stroke-width="3"/>',
  render:'<rect x="34" y="22" width="92" height="56" rx="6" fill="#2a2a31" stroke="#55555f"/><path d="M72 36l22 14-22 14z" fill="var(--acc)"/>',
  savePng:'<rect x="34" y="20" width="92" height="60" rx="4" fill="#2a2a31" stroke="#55555f"/><path d="M40 74l26-26 18 18 12-10 24 18z" fill="var(--acc)"/><circle cx="104" cy="36" r="7" fill="#fff"/>',
  anchor:'<rect x="50" y="22" width="60" height="56" rx="4" fill="#2a2a31" stroke="#55555f"/><g fill="#55555f"><circle cx="50" cy="22" r="3"/><circle cx="80" cy="22" r="3"/><circle cx="110" cy="22" r="3"/><circle cx="50" cy="50" r="3"/><circle cx="110" cy="50" r="3"/><circle cx="50" cy="78" r="3"/><circle cx="80" cy="78" r="3"/><circle cx="110" cy="78" r="3"/></g><circle cx="80" cy="50" r="6" fill="none" stroke="var(--acc)" stroke-width="2.5"/><path d="M80 40v20M70 50h20" stroke="var(--acc)" stroke-width="2"/>',
  center:'<rect x="30" y="16" width="100" height="68" rx="3" fill="none" stroke="#55555f" stroke-width="2"/><rect x="66" y="38" width="28" height="24" fill="var(--acc)"/><path d="M80 18v12M80 70v12M32 50h12M116 50h12" stroke="#fff" stroke-width="2"/>',
  nullCtl:'<rect x="68" y="18" width="24" height="24" fill="none" stroke="var(--acc)" stroke-width="2.5"/><g stroke="#77777f" stroke-width="2"><line x1="80" y1="42" x2="52" y2="66"/><line x1="80" y1="42" x2="80" y2="66"/><line x1="80" y1="42" x2="108" y2="66"/></g><g fill="#2a2a31" stroke="#99999f"><rect x="42" y="66" width="20" height="14" rx="3"/><rect x="70" y="66" width="20" height="14" rx="3"/><rect x="98" y="66" width="20" height="14" rx="3"/></g>',
  adjust:'<rect x="40" y="30" width="80" height="12" rx="3" fill="#fff" opacity=".9"/><rect x="40" y="48" width="80" height="12" rx="3" fill="#3b3b44"/><rect x="40" y="66" width="80" height="12" rx="3" fill="#3b3b44"/><path d="M60 22v64" stroke="var(--acc)" stroke-width="2"/>',
  fit:'<rect x="40" y="22" width="80" height="56" rx="4" fill="none" stroke="#55555f" stroke-width="2"/><rect x="64" y="38" width="32" height="24" fill="var(--acc)" opacity=".8"/><g stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M56 30h-8v8M104 30h8v8M56 70h-8v-8M104 70h8v-8"/></g>',
  precomp:'<rect x="48" y="30" width="64" height="44" rx="4" fill="none" stroke="var(--acc)" stroke-width="2.5"/><g fill="#3b3b44"><rect x="56" y="38" width="48" height="8" rx="2"/><rect x="56" y="50" width="48" height="8" rx="2"/><rect x="56" y="62" width="30" height="6" rx="2"/></g>',
  clearNabd:'<path d="M58 34h44l-4 44H62z" fill="none" stroke="#ff5470" stroke-width="2.5"/><path d="M52 34h56M72 26h16" stroke="#ff5470" stroke-width="2.5" stroke-linecap="round"/>',
  keysReverse:'<g fill="var(--acc)"><path d="M50 50l8-8 8 8-8 8z"/><path d="M94 50l8-8 8 8-8 8z"/></g><path d="M70 38h20l-6-6M90 62H70l6 6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  keysPlayhead:'<path d="M60 20v62" stroke="#4aa3ff" stroke-width="2"/><path d="M54 18h12l-6 7z" fill="#4aa3ff"/><g fill="var(--acc)"><path d="M62 50l7-7 7 7-7 7z"/><path d="M88 50l7-7 7 7-7 7z"/></g>',
  keysRetime:'<g fill="var(--acc)"><path d="M40 50l7-7 7 7-7 7z"/><path d="M106 50l7-7 7 7-7 7z"/></g><path d="M58 50h44M64 44l-6 6 6 6M96 44l6 6-6 6" fill="none" stroke="#fff" stroke-width="2"/>',
  keysNudge:'<g fill="var(--acc)"><path d="M64 50l7-7 7 7-7 7z"/></g><path d="M86 50h22M100 44l8 6-8 6" fill="none" stroke="#fff" stroke-width="2"/>',
  sequence:'<g fill="var(--acc)"><rect x="30" y="30" width="34" height="10" rx="3"/><rect x="64" y="46" width="34" height="10" rx="3" opacity=".8"/><rect x="98" y="62" width="34" height="10" rx="3" opacity=".6"/></g>',
  stagger:'<g fill="var(--acc)"><rect x="40" y="26" width="50" height="10" rx="3"/><rect x="54" y="44" width="50" height="10" rx="3" opacity=".8"/><rect x="68" y="62" width="50" height="10" rx="3" opacity=".6"/></g>',
  split:'<rect x="30" y="42" width="100" height="16" rx="3" fill="#3b3b44"/><path d="M80 24v52" stroke="#4aa3ff" stroke-width="2"/><path d="M74 22h12l-6 7z" fill="#4aa3ff"/><rect x="30" y="42" width="48" height="16" rx="3" fill="var(--acc)"/>',
  trimIn:'<rect x="30" y="42" width="100" height="16" rx="3" fill="#3b3b44"/><path d="M70 24v52" stroke="#4aa3ff" stroke-width="2"/><rect x="70" y="42" width="60" height="16" rx="3" fill="var(--acc)"/>',
  trimOut:'<rect x="30" y="42" width="100" height="16" rx="3" fill="#3b3b44"/><path d="M90 24v52" stroke="#4aa3ff" stroke-width="2"/><rect x="30" y="42" width="60" height="16" rx="3" fill="var(--acc)"/>',
  newComp:'<rect x="62" y="22" width="36" height="56" rx="5" fill="none" stroke="var(--acc)" stroke-width="3"/><path d="M80 40v20M70 50h20" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
  organize:'<path d="M44 34h22l6 6h44v34H44z" fill="none" stroke="var(--acc2)" stroke-width="2.2"/><g stroke="#77777f" stroke-width="2" stroke-linecap="round"><path d="M56 52h48M56 60h36M56 68h42"/></g>',
  guides:'<rect x="66" y="10" width="28" height="80" rx="4" fill="#2a2a31"/><rect x="66" y="10" width="28" height="12" fill="#ff2a40" opacity=".4"/><rect x="66" y="70" width="28" height="20" fill="#ff2a40" opacity=".4"/><rect x="69" y="22" width="20" height="48" fill="none" stroke="#33ff73"/>'
};
function toolSVG(id){ return '<svg viewBox="0 0 160 100"><rect width="160" height="100" fill="#121216"/>' + (TICON[id]||'') + '</svg>'; }

function mountThumb(box, it, big){
  var o = null, now = performance.now(), off = big ? 0 : Math.random()*1500;
  switch(S.tab){
    case 'tr':
      if(it.matte){ o = {k:'spr', el:P.mountSprite(box, 'assets/thumbs/p_' + it.matte.id + '.jpg', 'mt')}; break; }
      if(it.otr){ o = {k:'spr', el:P.mountSprite(box, 'assets/' + it.otr.thumb, 'mt')}; box.classList.add('otrth'); break; }
      o = {k:'tr', it:it, el:P.mountTr(box)}; break;
    case 'mp': o = {k:'mp', it:it, el:P.mountMp(box)}; break;
    case 'tx':
      var txt = big ? (S.tx.text || ' ') : (it.latin ? 'MOTION' : (S.lang==='en' ? 'Text Animation' : 'حركة النص'));
      var fs = big ? Math.max(18, Math.min(46, 260/Math.max(4, (S.tx.text||'').length*0.75))) : (S.lang==='en' && !it.latin ? 16 : 24);
      o = {k:'tx', it:it, el:P.mountTx(box, txt, (it.src||it.tw) ? 'chars' : (it.by || S.tx.based), fs)}; break;
    case 'ti': o = {k:'ti', it:it, el:P.mountTitle(box, it, tiTexts(it), {side:it.side || S.ti.side})}; break;
    case 'cap': o = {k:'cap', it:it, el:P.mountCap(box, it, capOpt(big))}; break;
    case 'ts': P.mountStyle(box, it, big ? (S.tx.text || SAMPLE_NAME()) : SAMPLE_NAME(), S.acc); break;
    case 'fx': o = {k:'fx', it:it, el:P.mountLook(box, it, big)}; break;
    case 'sfx': box.classList.add('svgth'); box.innerHTML = P.waveSVG(it.pk || [], undefined, S.acc) + '<span class="badge">' + (it.dur ? it.dur.toFixed(1) + 's' : 'AI') + '</span>'; if(big) o = {k:'sfx', it:it, box:box}; break;
    case 'el':
      if(it.ov){ o = {k:'spr', el:P.mountSprite(box, 'assets/' + it.ov.thumb, 'ov')}; break; }
      o = {k:'el', it:it, box:box}; box.classList.add('elx'); break;
    case 'ez': o = {k:'ez', it:it, el:P.mountEz(box, it.curve ? {id:'curve', bz:S.ez.curve} : it)}; break;
    case 'car': o = {k:'car', el:P.mountCar(box, it, carOpts(big))}; break;
    case 'trk': o = {k:'trk', it:it, box:box}; break;
    case 'gf': o = {k:'gf', it:it, box:box}; break;
    case 'trim': o = {k:'trim', el:P.mountTrim(box, trimItem(it), {acc:S.acc})}; break;
    case 'tp': o = {k:'tpl', it:it, el:P.mountTpl(box, it, {zoom:/^(واجهات UI|ستايل شرح وكولاج|كول آوت وتوضيح|إنفوجرافيك|عروض وتسويق|تعليم وتقديم|عناوين)$/.test(it.g) && it.id!=='edBeforeAfter' && it.id!=='edVs' && it.id!=='tiLetterbox' ? (big ? 1.3 : 1.6) : 1})}; break;
    case 'dp': o = {k:'dp', el:P.mountDepth(box, it)}; break;
    case 'bg': o = {k:'bg', it:it, el:mountBg(box)}; break;
    case 'ln': var lc = lnColors();
      if(big){ var car = COMP.w / COMP.h; box.style.aspectRatio = COMP.w + ' / ' + COMP.h; box.style.alignSelf = 'center'; box.style.maxWidth = '100%';
        if(car >= 1.3){ box.style.width = '100%'; box.style.height = 'auto'; } else { box.style.height = 'min(28vh, 210px)'; box.style.width = 'auto'; box.style.minHeight = '120px'; } }
      o = {k:'ln', el:P.mountLine(box, it.mine ? it.pv : it, {c1:lc[0], c2:lc[1], width:S.ln.width, comp:big ? COMP : null, size:S.ln.size, speed:S.ln.speed, erase:S.ln.erase, flow:S.ln.flow, guide:S.ln.guide, pStart:S.ln.pStart, pEnd:S.ln.pEnd, pFrames:S.ln.pFrames, pDelay:S.ln.pDelay, pPause:S.ln.pPause, pMid:S.ln.pMid, pHold:S.ln.pHold, pFrames2:S.ln.pFrames2, text:big ? S.ln.text : 'نص على خط'})}; break;
    case 'tl': box.classList.add('svgth'); box.innerHTML = it.id==='guides' ? guideSVG(byId(D.GUIDES, S.tl.plat), S.tl) : toolSVG(it.id); break;
    case 'lib': box.innerHTML = libThumb(it.f, big) + '<span class="badge">' + TLABEL[it.f.type] + '</span>'; break;
  }
  if(o){ o.t0 = now - off; o.box = o.box || box; o.heavy = /^(el|trk|gf|sfx)$/.test(o.k); if(big) stageEl = o; else { live.push(o); watchVis(o); if(S.paused){ try{ step(o, now + 1100); }catch(e){} } } }
}

/* side pane */
function seg(name, opts, val){
  return '<div class="seg" data-seg="' + name + '">' + opts.map(function(o){ return '<button data-v="' + o[0] + '" class="' + (String(o[0])===String(val)?'on':'') + '">' + o[1] + '</button>'; }).join('') + '</div>';
}
function chk(name, label, val){ return '<label class="check"><input type="checkbox" data-k="' + name + '"' + (val?' checked':'') + '> ' + label + '</label>'; }
function num(name, label, val){ return '<div class="field"><label>' + label + '</label><input type="number" data-k="' + name + '" value="' + val + '"></div>'; }
function head(it, extra){ return '<h2>' + esc(it.ar) + ' <span class="en">' + esc(it.en||'') + '</span></h2>' + (extra ? '<p class="desc">' + extra + '</p>' : ''); }

function renderSide(){
  var it = cur(), side = $('side'), h = '';
  stageEl = null;
  if(!it && S.tab!=='lib' && S.tab!=='ed' && S.tab!=='ai' && S.tab!=='br'){ side.innerHTML=''; return; }
  switch(S.tab){
    case 'tr':
      if(it.otr){
        h += '<div class="stage" id="stage"></div>' + head(it, it.d);
        h += '<div class="field"><span class="lbl">المدة (فريمات)</span>' + seg('tr.oframes', [[16,'16'],[20,'20'],[24,'24'],[30,'30'],[40,'40'],[50,'50']], S.tr.oframes) + '</div>';
        if(it.otr.kind==='light'){
          h += '<div class="field"><span class="lbl">طريقة الدمج</span>' + seg('tr.oblend', [['screen','Screen'],['add','Add'],['overlay','Overlay'],['soft','Soft Light']], S.tr.oblend) + '</div>';
          h += '<div class="field"><span class="lbl">اللون</span>' + seg('tr.ocolor', [['orig','الأصلي'],['acc','لوني']], S.tr.ocolor) + '</div>';
        } else {
          h += '<div class="field"><span class="lbl">اللون</span>' + seg('tr.ocolor', [['orig','الأصلي'],['acc','لوني'],['white','أبيض'],['black','أسود']], S.tr.ocolor) + '</div>';
        }
        h += '<div class="field"><span class="lbl">الشدة</span>' + seg('tr.oamount', [[60,'60%'],[80,'80%'],[100,'100%']], S.tr.oamount) + '</div>';
        h += '<div class="row">' + chk('tr.flip', 'اقلبه بالعرض', S.tr.flip) + chk('tr.sfx', 'صوت ووش', S.tr.sfx) + '</div>';
        h += '<button class="btn primary" id="go">حط الترانزيشن</button>';
        h += '<div class="hint">' + (it.otr.kind==='light' ? 'ده فيديو أوفرلي بيتحط فوق القطع بالـ Blend Mode اللي تختاره، وأقوى لحظة فيه بتيجي على القطع بالظبط فبتداري النقلة.' : 'ده فيديو بيغطي الشاشة كلها في نصه (معاه ماسك Luma جاهز) فالكليب القديم بيختفي تحته والجديد بيبان.') + ' حط البلاي هيد على القطع أو حدد الكليبين. اللاير اسمه HAMDY OTR وعليه ماركر HAMDY CUT مكان القطع، فتقدر تحركه أو تمطه.</div>';
        break;
      }
      if(it.matte){
        h += '<div class="stage" id="stage"></div>' + head(it, it.d);
        h += '<div class="field"><span class="lbl">المدة (فريمات)</span>' + seg('tr.mframes', [[12,'12'],[16,'16'],[20,'20'],[26,'26'],[34,'34'],[45,'45']], S.tr.mframes) + '</div>';
        h += '<div class="row">' + chk('tr.flip', 'اقلب الماسك', S.tr.flip) + chk('tr.sfx', 'صوت ووش', S.tr.sfx) + '</div>';
        h += '<button class="btn primary" id="go">حط الترانزيشن</button>';
        h += '<div class="hint">حدد كليبين (القديم والجديد) والماسك هيتحط على القطع. لو حددت لاير واحد بس، بيعمله ظهور بالماسك ده من أول اللاير. الماسك لاير فيديو حقيقي اسمه HAMDY MATTE فتقدر تكبّره أو تحركه.</div>';
        break;
      }
      h += '<div class="stage" id="stage"></div>' + head(it, it.d);
      h += '<div class="field"><span class="lbl">المدة (فريمات)</span>' + seg('tr.frames', [[8,'8'],[10,'10'],[12,'12'],[16,'16'],[20,'20'],[24,'24']], S.tr.frames) + '</div>';
      h += '<div class="field"><span class="lbl">الإحساس</span>' + seg('tr.snappy', [['true','سريع وحاد'],['false','ناعم']], S.tr.snappy) + '</div>';
      h += chk('tr.sfx', 'ضيف صوت ووش من المكتبة', S.tr.sfx);
      h += '<button class="btn primary" id="go">حط الترانزيشن</button>';
      h += '<div class="hint">حط البلاي هيد على القطع، أو حدد الكليبين. ترانزيشنز الأشكال بتاخد لونك المختار فوق. دبل كليك على أي بوكس = تطبيق على طول.</div>';
      break;
    case 'mp':
      h += '<div class="stage" id="stage"></div>' + head(it, KIND_AR[it.kind]);
      if(it.kind==='in'){
        h += '<div class="field"><span class="lbl">استخدمها كـ</span>' + seg('mp.dir', [['in','دخول'],['out','خروج'],['both','الاتنين']], S.mp.dir) + '</div>';
        h += '<div class="field"><span class="lbl">مكانها</span>' + seg('mp.at', [['layer','أول وآخر اللاير'],['playhead','عند البلاي هيد']], S.mp.at) + '</div>';
      }
      if(it.kind!=='loop' && it.kind!=='emph') h += '<div class="field"><span class="lbl">الاتجاه</span>' + seg('mp.side', [['def','الأصلي'],['right','يمين'],['left','شمال'],['top','فوق'],['bottom','تحت']], S.mp.side || 'def') + '</div>' +
        chk('mp.rev', 'اعكس الحركة (جوه ↔ برا)', !!S.mp.rev);
      if(it.kind!=='loop' && it.kind!=='emph'){
        h += chk('mp.bnc', 'ارتداد في آخر الحركة', !!S.mp.bnc);
        if(S.mp.bnc) h += '<div class="field"><span class="lbl">عدد الارتدادات</span>' + seg('mp.bncN', [[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5']], S.mp.bncN || 2) + '</div>' +
          '<div class="field"><span class="lbl">قوة الارتداد</span>' + seg('mp.bncAmt', [[20,'خفيف'],[50,'عادي'],[80,'قوي'],[110,'قوي جداً']], S.mp.bncAmt || 50) + '</div>';
      }
      h += '<div class="field"><span class="lbl">الحركة بتبدأ من (الأنكر)</span>' + seg('mp.pivot', [['el','نص العنصر'],['comp','نص الكومب'],['top','فوق'],['bottom','تحت'],['right','يمين'],['left','شمال']], S.mp.pivot || 'el') + '</div>';
      if(it.kind==='loop') h += '<div class="field"><span class="lbl">قوة الحركة</span>' + seg('mp.loopAmt', [[25,'25%'],[50,'50%'],[100,'100%'],[150,'150%'],[200,'200%'],[300,'300%']], S.mp.loopAmt || 100) + '</div><div class="hint">تقدر تغيّرها بعدين من سلايدر HAMDY LOOP Strength على اللاير (0 = واقف).</div>';
      if(it.kind!=='loop') h += '<div class="field"><span class="lbl">المدة (فريمات)</span>' + seg('mp.frames', [[5,'5'],[10,'10'],[15,'15'],[20,'20'],[25,'25'],[30,'30'],[45,'45']], S.mp.frames) + '</div>';
      h += '<button class="btn primary" id="go">طبّق على اللايرات المحددة</button>';
      h += '<button class="btn warn" id="clear">شيل حركات الكيت من المحدد</button>';
      h += '<div class="hint">بتشتغل على أي لاير: تكست، شيب، صورة أو فيديو. بتنزل كإفكت اسمه HAMDY في Effect Controls، فاللاير نفسه وكي فريمز بتوعك مبيتلمسوش. وفوق اللاير بيتحط ماركر HAMDY IN (آخر الدخول) وHAMDY OUT (أول الخروج): اسحبهم في التايملاين وطول الحركة يتغير.</div>';
      break;
    case 'tx':
      h += '<div class="stage" id="stage"></div>' + head(it, it.loop ? 'لوب على طول اللاير' : '');
      h += '<div class="field"><label>النص (عربي أو إنجليزي)</label><textarea id="txtIn" dir="auto">' + esc(S.tx.text) + '</textarea></div>';
      h += '<div class="field"><span class="lbl">الحركة على</span>' + seg('tx.based', [['auto','تلقائي'],['chars','حروف'],['words','كلمات'],['lines','سطور']], S.tx.based) + '</div>';
      if(it.src || it.tw){
        h += '<div class="field"><span class="lbl">سرعة الكتابة</span>' + seg('tx.cps', D.TYPE_SPEED, S.tx.cps) + '</div>';
        h += '<div class="row">' + num('tx.size','الحجم',S.tx.size) + num('tx.secs','ثواني',S.tx.secs) + '</div>';
        h += '<div class="row">' + (it.src && it.src.cur ? chk('tx.cursor', 'المؤشر بيرمش', S.tx.cursor) : '') + chk('tx.typeSfx', 'صوت كيبورد', S.tx.typeSfx) + '</div>';
      } else
      h += '<div class="row">' + num('tx.frames','فريمات',S.tx.frames) + num('tx.size','الحجم',S.tx.size) + num('tx.secs','ثواني',S.tx.secs) + '</div>';
      h += '<div class="field"><label>اسم الخط PostScript (اختياري)</label><input type="text" data-k="tx.font" dir="ltr" placeholder="Cairo-Bold" value="' + esc(S.tx.font) + '"></div>';
      if(!it.loop && !it.random && !it.square && !it.overshoot && !it.src && !it.tw) h += '<div class="field"><span class="lbl">ترتيب الحروف</span>' + seg('tx.pattern', D.STAGGER, S.tx.pattern) + '</div>';
      if(!it.loop && !it.src) h += '<div class="row">' + chk('tx.doIn', 'دخول', S.tx.doIn) + chk('tx.doOut', 'خروج', S.tx.doOut) + '</div>';
      h += '<button class="btn primary" id="go">اعمل نص جديد بالحركة دي</button>';
      h += '<div class="row"><button class="btn" id="go2">طبّق على المحدد</button><button class="btn warn" id="clear">شيل الحركات</button></div>';
      if(it.src) h += '<div class="hint">الكتابة دي حقيقية من Source Text، فالحروف العربي بتتوصل وانت بتكتب. السرعة والمؤشر بيتعدلوا بعدين من صفحة التعديل أو من Effect Controls (HAMDY TYPE).</div>';
      else if(it.tw) h += '<div class="hint">كل حرف بيظهر بالحركة دي على حسب سرعة الكتابة. تقدر تغيّر السرعة بعدين من HAMDY TYPE Speed.</div>';
      else h += '<div class="hint">' + (it.latin ? 'الحركة دي معمولة للإنجليزي (بتبدّل الحروف).' : 'في التلقائي: العربي بيتحرك كلمة كلمة علشان الحروف متتقطعش، والإنجليزي حرف حرف.') + '</div>';
      break;
    case 'ti':
      h += '<div class="stage" id="stage"></div>' + head(it, '');
      var L = tiTexts(it), labels = it.counter ? ['من','إلى','بعد الرقم (+ أو %)'] : (it.countdown ? ['عدد الثواني'] : (it.progress ? ['النسبة %'] : ['السطر الأول','السطر التاني','السطر التالت']));
      L.forEach(function(v, i){ h += '<div class="field"><label>' + labels[i] + '</label><input type="text" class="tiline" data-i="' + i + '" dir="auto" value="' + esc(v) + '"></div>'; });
      if(it.place==='lower') h += '<div class="field"><span class="lbl">الناحية</span>' + seg('ti.side', [['r','يمين'],['c','نص'],['l','شمال']], S.ti.side) + '</div>';
      h += '<div class="row">' + num('ti.secs','المدة (ثواني)',S.ti.secs) + '<div class="field"><label>الخط (PostScript)</label><input type="text" data-k="ti.font" dir="ltr" placeholder="Cairo-Bold" value="' + esc(S.ti.font) + '"></div></div>';
      h += '<button class="btn primary" id="go">ضيف العنوان عند البلاي هيد</button>';
      h += '<div class="hint">العنوان بينزل لايرات مربوطة بـ Null اسمه HAMDY TITLE، فتحرّكه أو تكبّره كله مرة واحدة، وتعدّل الكلام من اللاير نفسه. البوكسات بتكبر مع الكلام لوحدها.</div>';
      break;
    case 'el':
      if(it.ov){
        h += '<div class="stage" id="stage"></div>' + head(it, it.d);
        h += '<div class="field"><span class="lbl">طريقة الدمج</span>' + seg('el.blend', [['screen','Screen'],['add','Add'],['overlay','Overlay'],['normal','Normal']], S.el.blend) + '</div>';
        h += '<div class="field"><span class="lbl">القوة</span>' + seg('el.amount', [[40,'40%'],[60,'60%'],[80,'80%'],[100,'100%']], S.el.amount) + '</div>';
        h += '<div class="row">' + num('el.secs','المدة (ثواني)',S.el.secs) + '</div>';
        h += '<button class="btn primary" id="go">ضيف الأوفرلي عند البلاي هيد</button>';
        h += '<div class="hint">فيديو حقيقي بيتحط فوق شغلك وبيملا الكادر. لو المدة أطول من الفيديو بيلف لوحده (لوب).</div>';
        break;
      }
      h += '<div class="stage elx" id="stage"></div>' + head(it, it.d);
      h += '<div class="row">' + num('el.secs','المدة (ثواني)',S.el.secs) + '</div>';
      h += '<button class="btn primary" id="go">ضيف العنصر عند البلاي هيد</button>';
      h += '<div class="hint">بياخد لونك المختار فوق. الخلفيات بتنزل تحت كل اللايرات، والأوفرليز فوق.</div>';
      break;
    case 'cap': h += capSide(it); break;
    case 'ts':
      h += '<div class="stage" id="stage"></div>' + head(it, it.g);
      h += '<div class="field"><label>النص (للمعاينة وللنص الجديد)</label><input type="text" id="tsText" dir="auto" value="' + esc(S.tx.text) + '"></div>';
      h += '<button class="btn primary" id="go">طبّق على التكست المحدد</button>';
      h += '<button class="btn" id="goNew">اعمل نص جديد بالستايل ده</button>';
      h += '<div class="hint">الستايل بيغيّر لون النص والإطار وبيضيف إفكتات اسمها HAMDY STYLE (ظل، توهج، جرادينت، لمعة، بوكس). لو طبّقت ستايل تاني بيحل مكان القديم. وتقدر تحط عليه أي حركة من تاب حركة النص.</div>';
      break;
    case 'fx':
      h += '<div class="stage" id="stage"></div>' + head(it, trText({look:'فلتر ألوان', vfx:'إفكت فيديو', afx:'إفكت صوت'}[it.kind]) + ' · ' + trText(it.g));
      if(it.kind !== 'afx'){
        h += '<div class="field"><span class="lbl">يتحط على</span>' + seg('fx.mode', [['playhead','أدجستمنت من البلاي هيد'],['whole','أدجستمنت للكومب كله'],['selected','اللايرات المحددة']], S.fx.mode) + '</div>';
        if(S.fx.mode !== 'selected') h += '<div class="field"><span class="lbl">القوة</span>' + seg('fx.amount', [[25,'25%'],[50,'50%'],[75,'75%'],[100,'100%']], S.fx.amount) + '</div>';
      }
      h += '<button class="btn primary" id="go">' + (it.kind==='afx' ? 'طبّق على لايرات الصوت المحددة' : 'طبّق') + '</button>';
      h += '<div class="hint">' + (it.kind==='afx' ? 'حدد لاير فيه صوت (فيديو أو أوديو). الإفكتات بتنزل باسم HAMDY AUDIO وتقدر تظبطها من Effect Controls.' : 'الفلتر بيتعمل من إفكتات After Effects الأصلية، فكل حاجة فيه تتعدّل من Effect Controls. المعاينة تقريبية، وفي الكبيرة اسحب عينك على الخط: شمال قبل ويمين بعد.') + '</div>';
      break;
    case 'sfx': h += sfxSide(it); break;
    case 'ez':
      if(it.curve){ h += curveSide(it); break; }
      if(it.auto){
        h += '<div class="stage ease" id="stage"></div>' + head(it, it.d);
        h += '<div class="field"><span class="lbl">القوة</span>' + seg('ez.str', [[0.5,'خفيف'],[1,'عادي'],[1.8,'قوي']], S.ez.str) + '</div>';
        h += '<button class="btn primary" id="go">طبّق على اللايرات المحددة</button>';
        h += '<div class="hint">' + (it.keyed ? 'حدد اللاير (أو البروبرتي اللي عليها كي فريمز) ودوس. الحركة بتشتغل بعد آخر كي فريم.' : 'حدد لاير أو أكتر ودوس.') + ' كل الإعدادات بتنزل Sliders على اللاير باسم HAMDY ' + it.en + ' فتقدر تغيّرها بعدين.</div>';
        break;
      }
      h += '<div class="stage ease" id="stage"></div>' + head(it, '');
      h += '<button class="btn primary" id="go">' + (it.expr ? (it.id==='none' ? 'شيل الإكسبريشن من المحدد' : 'طبّق على الخاصية المحددة') : 'طبّق على الكي فريمز المحددة') + '</button>';
      h += '<div class="hint">' + (it.expr ? 'حدد خاصية في التايملاين (زي Position أو Rotation). الأوفرشوت والنطّة واللوب محتاجين كي فريمز على الخاصية.' : 'حدد الكي فريمز في التايملاين وبعدين دوس الزرار.') + '</div>';
      break;
    case 'lib':
      h += '<div class="stage" id="stage"></div>';
      if(it) h += '<h2 class="fname">' + esc(it.ar) + '</h2><p class="desc">' + typeName(it.f.type) + ' · ' + esc(folderName(S.lib.paths[it.f.folder]||'')) + '</p>';
      h += '<div class="field"><span class="lbl">فولدرات المكتبة</span><div class="folders">' + (S.lib.paths.length ? S.lib.paths.map(function(p,i){ return '<div class="folder"><span title="' + esc(p) + '">📁 ' + esc(folderName(p)) + '</span><button data-rm="' + i + '" title="شيل">×</button></div>'; }).join('') : '<div class="pathline">لسه مضفتش فولدرات</div>') + '</div></div>';
      h += '<div class="row"><button class="btn" id="pick">+ ضيف فولدر</button><button class="btn" id="refresh">تحديث</button></div>';
      h += '<div class="row">' + chk('lib.fit', 'ملّي الكادر', S.lib.fit) + chk('lib.screen', 'Screen للأوفرليز', S.lib.screen) + '</div>';
      h += '<button class="btn primary" id="go"' + (it?'':' disabled') + '>' + (it && it.f.type==='ffx' ? 'طبّق البريسيت على المحدد' : 'ضيف عند البلاي هيد') + '</button>';
      h += '<div class="hint">اعمل فولدرات لـ: بريسيتس .ffx، أوفرليز وتسريبات ضوء، أصوات وSFX. أي صوت اسمه فيه whoosh أو swoosh بيتحط تلقائي مع الترانزيشنز.</div>';
      break;
    case 'ed': h += editSide(); break;
    case 'ai': h += AI.side(); break;
    case 'br': h += STOCK.side(); break;
    case 'ln': h += lineSide(it); break;
    case 'car': h += carSide(it); break;
    case 'trk': h += trkSide(it); break;
    case 'gf': h += gfSide(it); break;
    case 'trim': h += trimSide(it); break;
    case 'tp': h += tpSide(it); break;
    case 'dp': h += dpSide(it); break;
    case 'bg': h += bgSide(it); break;
    case 'tl':
      h += '<div class="stage svgth" id="stage">' + (it.id==='guides' ? guideSVG(byId(D.GUIDES, S.tl.plat), S.tl) : toolSVG(it.id)) + '</div>' + head(it, it.d);
      h += toolControls(it);
      break;
  }
  h += '<div class="toast" id="toast"></div>';
  side.innerHTML = h;
  addResetBtn(side);
  var st = $('stage');
  if(st && it && S.tab!=='tl' && S.tab!=='ed') mountThumb(st, it, true);
  if(S.tab==='ed') bindEditSide();
  if(S.tab==='ai') AI.bindSide();
  if(S.tab==='tp') bindTp();
  if(S.tab==='tl' && it && (it.id==='rekey' || it.id==='brand' || it.id==='tbreak')) bindToolExtra(it);
  if(S.tab==='br') STOCK.bindSide();
  if(S.tab==='ez' && it && it.curve) bindCurve();
  Array.prototype.forEach.call(document.querySelectorAll('#side [data-al]'), function(b){ b.onclick = function(){ S.tl.align = b.dataset.al; save(); Array.prototype.forEach.call(document.querySelectorAll('#side [data-al]'), function(x){ x.classList.toggle('on', x===b); }); }; });
  if(S.tab==='car') bindCar();
  if(S.tab==='trk') bindTrk();
  if(S.tab==='dp') bindDp();
  if(S.tab==='gf') bindGf();
  if(S.tab==='ln'){
    var lt = $('lnText'); if(lt) lt.addEventListener('input', function(){ S.ln.text = lt.value; save(); mountThumb($('stage'), cur(), true); });
    if($('lnSel')) $('lnSel').onclick = function(){ lineApply(cur(), true).then(say); };
  }
  if(st && !it && S.tab==='lib') st.innerHTML = '<div class="libth"><span class="bigicon">📁</span></div>';
  bindSide();
  if(S.tab==='cap') bindCap();
  if(S.tab==='sfx') bindSfx();
  if(S.tab==='ts'){
    var tt = $('tsText'); if(tt) tt.addEventListener('input', function(){ S.tx.text = tt.value; save(); mountThumb($('stage'), cur(), true); });
    if($('goNew')) $('goNew').onclick = function(){ host('textStyle', {st:stHost(cur()), mode:'new', text:S.tx.text, size:S.tx.size, secs:S.tx.secs, font:S.tx.font}).then(say); };
  }
}

function toolControls(it){
  var h = '';
  switch(it.id){
    case 'cutout':
      h += '<div class="field"><span class="lbl">بتفصل إيه</span>' + seg('tl.cutModel', [['general','أي حاجة'],['person','أشخاص']], S.tl.cutModel) + '</div>';
      h += '<div class="field"><span class="lbl">النتيجة</span>' + seg('tl.cutMode', [['above','لاير فوق الأصلي'],['replace','بدل الأصلي'],['behind','نص ورا الشخص']], S.tl.cutMode) + '</div>';
      if(S.tl.cutMode==='behind') h += '<div class="field"><span class="lbl">النص (لو مفيش لاير نص متحدد)</span><input type="text" data-k="tl.cutText" value="' + esc(S.tl.cutText||'') + '" placeholder="حمدي" style="width:100%"></div>';
      h += '<div class="hint okline">بيشتغل على جهازك ببلاش ومن غير مفتاح. أول مرة بس بينزّل الموديل لوحده (176 ميجا).</div>';
      h += '<div class="hint">حدد لاير صورة (أو فيديو، وساعتها بيفصل الفريم اللي عند البلاي هيد بس). للنص ورا الشخص: حدد الصورة ولاير النص مع بعض، أو سيبه يعمل نص جديد.</div>';
      h += '<div class="hint" id="cutStatus"></div>';
      break;
    case 'tbreak':
      h += '<div class="field"><span class="lbl">قسّمه</span>' + seg('tl.tbBy', [['word','كلمات'],['line','سطور'],['char','حروف']], S.tl.tbBy) + '</div>';
      h += '<div class="hint">' + (S.tl.tbBy==='char' ? 'خلي بالك: الحروف العربي بتتفصل عن بعض لو قسّمته حروف. للعربي استخدم كلمات أو سطور.' : 'كل جزء بيبقى لاير لوحده في نفس مكانه بالظبط، والحروف العربي بتفضل متشبكة. اللاير الأصلي بيتقفل.') + '</div>';
      break;
    case 'rekey':
      h += '<div class="field"><span class="lbl">احفظ الكي فريمز المحددة</span><input type="text" id="kName" placeholder="اسم الحركة" style="width:100%"><button class="btn" id="kSave" style="margin-top:6px">احفظ</button></div>';
      h += '<div class="field"><span class="lbl">لما تطبّق</span>' + seg('tl.kMode', [['relative','من مكان اللاير'],['absolute','نفس القيم بالظبط']], S.tl.kMode) + '</div>';
      h += '<div class="field"><span class="lbl">السرعة</span>' + seg('tl.kSpeed', [[0.5,'أبطأ'],[1,'عادي'],[1.5,'أسرع'],[2,'×2']], S.tl.kSpeed) + '</div>';
      h += '<div class="klist">' + ((S.keys||[]).length ? S.keys.map(function(k, i){ return '<div class="krow"><b>' + esc(k.name) + '</b><span>' + k.data.props.length + ' بروبرتي</span><button class="btn" data-kapply="' + i + '">طبّق</button><button class="btn warn" data-kdel="' + i + '">×</button></div>'; }).join('') : '<div class="hint">لسه مفيش حركات محفوظة. حدد كي فريمز في التايملاين (من كذا بروبرتي لو عايز) واكتب اسم ودوس احفظ.</div>') + '</div>';
      h += '<div class="hint">الحركة بتتطبق عند البلاي هيد على اللايرات المحددة، على نفس البروبرتيز (بوزيشن، سكيل، إفكت…).</div>';
      return h;
    case 'brand':
      var B = S.brand;
      h += '<div class="field"><span class="lbl">اسم البراند</span><input type="text" id="bName" value="' + esc(B.name||'') + '" style="width:100%"></div>';
      h += '<div class="tpcols">' + [0,1,2].map(function(i){ return '<label><input type="color" data-bc="' + i + '" value="' + B.cols[i] + '"><span>' + ['الأساسي','الفاتح','الغامق'][i] + '</span></label>'; }).join('') + '</div>';
      h += '<div class="field"><span class="lbl">اسم الفونت (PostScript)</span><input type="text" id="bFont" value="' + esc(B.font||'') + '" placeholder="Cairo-Bold" dir="ltr" style="width:100%"></div>';
      h += '<div class="hint">الألوان دي بتظهر كزرار «ألوان البراند» في القوالب، وبتتحفظ على جهازك.</div>';
      return h;
    case 'glass':
      h += '<div class="field"><span class="lbl">الشكل</span>' + seg('tl.gShape', [['pill','كبسولة'],['card','كارت'],['circle','دايرة']], S.tl.gShape) + '</div>';
      h += '<div class="field"><span class="lbl">نص على الزجاج (اختياري)</span><input type="text" data-k="tl.gText" value="' + esc(S.tl.gText||'') + '" style="width:100%"></div>';
      h += '<div class="field"><span class="lbl">البلور</span>' + seg('tl.gBlur', [[12,'خفيف'],[30,'وسط'],[60,'تقيل']], S.tl.gBlur) + '</div>';
      h += chk('tl.gAnim', 'يدخل بنطّة', S.tl.gAnim);
      h += '<div class="hint">زجاج بيكسر الصورة اللي تحته ومعمول بإفكتات الأفتر نفسه (من غير بلجنز). كل حاجة من نل HAMDY GLASS CTRL: العرض والطول والاستدارة والبلور والانكسار واللمعة والحافة. حرّك النل يتحرك الزجاج كله.</div>';
      break;
    case 'fixAr':
      h += chk('tl.arRev', 'النص نفسه مقلوب (الحروف بالعكس)', S.tl.arRev);
      h += '<div class="hint">حدد لاير النص العربي. بيظبط الاتجاه من اليمين للشمال ونوع الكتابة (Middle Eastern) عشان الحروف تتشبك صح. محتاج After Effects 2024 أو أحدث.</div>';
      break;
    case 'beat':
      h += '<div class="field"><span class="lbl">الحساسية</span>' + seg('tl.beatSens', [['low','قليلة'],['mid','وسط'],['high','عالية']], S.tl.beatSens) + '</div>';
      h += '<div class="field"><span class="lbl">يسمع إيه</span>' + seg('tl.beatBand', [['bass','الدرامز والباس'],['all','كل الصوت']], S.tl.beatBand) + '</div>';
      h += '<div class="field"><span class="lbl">أقل مسافة بين بيتين</span>' + seg('tl.beatGap', [[0.15,'0.15 ث'],[0.25,'0.25 ث'],[0.4,'0.4 ث'],[0.6,'0.6 ث']], S.tl.beatGap) + '</div>';
      h += '<div class="field"><span class="lbl">يعمل إيه على كل بيت</span>' + seg('tl.beatMode', [['markers','ماركرات بس'],['zoom','زووم'],['shake','هزة'],['flash','فلاش'],['glow','جلو'],['blur','بلور'],['cut','قطّع الصور']], S.tl.beatMode) + '</div>';
      if(S.tl.beatMode!=='markers' && S.tl.beatMode!=='cut') h += '<div class="field"><span class="lbl">القوة</span>' + seg('tl.beatAmt', [[50,'50%'],[100,'100%'],[160,'160%']], S.tl.beatAmt) + '</div>';
      h += '<div class="hint">' + (S.tl.beatMode==='cut' ? 'حدد لاير المزيكا والصور أو الكليبات اللي عايز تقطّعها (بالترتيب) ودوس الزرار.' : 'حدد لاير المزيكا ودوس الزرار.') + '</div><div class="hint">التحليل بيحصل على جهازك. الماركرات بتتحط على لاير المزيكا، والإفكت بيقرا منها، فلو حركت أو مسحت ماركر الإفكت بيتبعه. القوة والهدوء من HAMDY Beat Amount وDecay.</div>';
      break;
    case 'align':
      h += '<div class="field"><span class="lbl">محاذاة</span><div class="algrid">' + [['left','⇤'],['hcenter','↔'],['right','⇥'],['top','⤒'],['vcenter','↕'],['bottom','⤓'],['center','◎'],['distH','⋯ H'],['distV','⋮ V']].map(function(a){ return '<button class="btn' + (S.tl.align===a[0]?' on':'') + '" data-al="' + a[0] + '">' + a[1] + '</button>'; }).join('') + '</div></div>';
      h += '<div class="field"><span class="lbl">بالنسبة لـ</span>' + seg('tl.alignTo', [['comp','الكومب'],['sel','اللايرات المحددة']], S.tl.alignTo) + '</div>';
      h += '<div class="hint">بيحسب حدود اللاير الحقيقية (النص والشيب كمان)، ولو عليه كي فريمز في البوزيشن بيزحّقهم كلهم مع بعض.</div>';
      break;
    case 'vertical':
      h += '<div class="field"><span class="lbl">المقاس</span>' + seg('tl.vSize', [['1080x1920','9:16'],['1080x1350','4:5'],['1080x1080','1:1']], S.tl.vSize) + '</div>';
      h += '<div class="field"><span class="lbl">الطريقة</span>' + seg('tl.vMode', [['blur','في النص وخلفية مبلّرة'],['fill','يملا الكادر']], S.tl.vMode) + '</div>';
      break;
    case 'render':
      h += '<div class="field"><span class="lbl">الصيغة</span>' + seg('tl.rfmt', [['mp4','MP4 (H.264)'],['hq','جودة عالية'],['ame','Media Encoder']], S.tl.rfmt) + '</div>';
      h += '<div class="hint">بيترندر في فولدر Hamdy Exports جنب ملف المشروع (أو على الديسكتوب لو المشروع مش متسيف). الأفتر هيقف لحد ما الرندر يخلص.</div>';
      break;
    case 'anchor':
      h += '<div class="agrid">';
      [[0,0,'↖'],[0.5,0,'↑'],[1,0,'↗'],[0,0.5,'←'],[0.5,0.5,'●'],[1,0.5,'→'],[0,1,'↙'],[0.5,1,'↓'],[1,1,'↘']].forEach(function(a){ h += '<button data-ax="' + a[0] + '" data-ay="' + a[1] + '">' + a[2] + '</button>'; });
      h += '</div><div class="hint">دوس على المكان اللي عايز الأنكور فيه. بيشتغل على كل اللايرات المحددة.</div>';
      return h;
    case 'keysRetime':
      h += '<div class="field"><span class="lbl">النسبة</span>' + seg('tl.pct', [[50,'50% أسرع'],[75,'75%'],[125,'125%'],[150,'150%'],[200,'200% أبطأ']], S.tl.pct) + '</div>'; break;
    case 'keysNudge':
      h += '<div class="nudge">' + [-5,-1,1,5].map(function(n){ return '<button class="btn" data-nudge="' + n + '">' + (n>0?'+':'') + n + '</button>'; }).join('') + '</div><div class="hint">بالفريمات. موجب = قدام، سالب = ورا.</div>';
      return h;
    case 'sequence': h += '<div class="row">' + num('tl.overlap','تداخل (فريمات)',S.tl.overlap) + '</div>'; break;
    case 'stagger': h += '<div class="row">' + num('tl.stagger','فريمات بين كل لاير',S.tl.stagger) + '</div>'; break;
    case 'newComp':
      h += '<div class="field"><label>المقاس</label><select data-k="tl.size">' + D.COMP_SIZES.map(function(c,i){ return '<option value="' + i + '"' + (+S.tl.size===i?' selected':'') + '>' + c.ar + ' — ' + c.w + '×' + c.h + '</option>'; }).join('') + '</select></div>';
      h += '<div class="field"><span class="lbl">FPS</span>' + seg('tl.fps', [[24,'24'],[25,'25'],[30,'30'],[50,'50'],[60,'60']], S.tl.fps) + '</div>';
      h += '<div class="row">' + num('tl.secs','ثواني',S.tl.secs) + '<div class="field"><label>الاسم</label><input type="text" data-k="tl.name" value="' + esc(S.tl.name) + '" placeholder="HAMDY Comp"></div></div>';
      break;
    case 'organize': h += chk('tl.deep', 'رتّب كمان الحاجات اللي جوه فولدرات', S.tl.deep); break;
    case 'guides':
      h += '<div class="field"><span class="lbl">المنصة</span>' + seg('tl.plat', D.GUIDES.map(function(g){ return [g.id, g.ar]; }), S.tl.plat) + '</div>';
      h += chk('tl.zones', 'المناطق المغطاة (أحمر)', S.tl.zones) + chk('tl.safe', 'إطار المنطقة الآمنة', S.tl.safe) + chk('tl.thirds', 'قاعدة الأثلاث', S.tl.thirds) + chk('tl.center', 'علامة المنتصف', S.tl.center);
      break;
  }
  h += '<button class="btn primary" id="go">' + (it.id==='organize' ? 'نظّم المشروع' : 'نفّذ') + '</button>';
  return h;
}

function setPath(path, v){ var p = path.split('.'); S[p[0]][p[1]] = v; save(); }
/* reset button: puts this tab's settings back to the defaults (keeps lists, keys and other saved data) */
function resetTab(){
  var k = S.tab, d = DEF[k], n = 0;
  if(!d || typeof d !== 'object' || !S[k]) return 0;
  for(var j in d){ if(d[j] === null || typeof d[j] !== 'object'){ if(S[k][j] !== d[j]){ S[k][j] = d[j]; n++; } } }
  var it = cur();
  if(k === 'tp' && it){ if(S.tp.f) delete S.tp.f[it.id]; if(S.tp.c) delete S.tp.c[it.id]; n++; }
  if(S.lang === 'en' && typeof SAMPLE !== 'undefined' && SAMPLE.en && SAMPLE.en[k] !== undefined && S[k].text === SAMPLE.ar[k]) S[k].text = SAMPLE.en[k];
  save(); return n;
}
function addResetBtn(side){
  if(/^(ed|ai|br|lib|cap)$/.test(S.tab) || !DEF[S.tab] || typeof DEF[S.tab] !== 'object') return;
  var h2 = side.querySelector('h2'); if(!h2) return;
  var b = document.createElement('button');
  b.className = 'btn rstBtn'; b.type = 'button'; b.textContent = '↺ ' + trText('رجّع الإعدادات الأصلية');
  b.onclick = function(){ resetTab(); renderSide(); renderGrid(); var t = $('toast'); if(t){ t.className = 'toast ok'; t.textContent = trText('الإعدادات رجعت للأصل ✓'); clearTimeout(t._t); t._t = setTimeout(function(){ t.className = 'toast'; }, 2500); } };
  h2.parentNode.insertBefore(b, h2.nextSibling);
}
var PROJ = '', RECENT_G = '🕘 مؤخراً', LS_T = null, COMP = {w:1920, h:1080}; // size of the active comp (from the engine ping)
function liveStage(){
  if(/^(tl|ed|ai|br)$/.test(S.tab)) return;
  clearTimeout(LS_T);
  LS_T = setTimeout(function(){ var st = $('stage'), it = cur(); if(st && it){ try{ mountThumb(st, it, true); }catch(e){} } }, 140);
}
function bindSide(){
  var sd = $('side');
  if(sd && !sd._live){ sd._live = true; sd.addEventListener('input', liveStage); sd.addEventListener('change', liveStage); sd.addEventListener('click', function(e){ if(e.target.closest && e.target.closest('.seg button')) liveStage(); }); }
  var side = $('side');
  Array.prototype.forEach.call(side.querySelectorAll('[data-seg]'), function(g){
    Array.prototype.forEach.call(g.children, function(b){
      b.onclick = function(){
        var v = b.dataset.v; if(v==='true') v=true; else if(v==='false') v=false; else if(v!=='' && !isNaN(+v)) v=+v;
        setPath(g.dataset.seg, v); if(/^ai\./.test(g.dataset.seg)) AI.onSet(g.dataset.seg); if(/^br\./.test(g.dataset.seg)){ STOCK.onSet(g.dataset.seg); renderSide(); }
        Array.prototype.forEach.call(g.children, function(x){ x.classList.toggle('on', x===b); });
        var k = g.dataset.seg;
        if(k==='cap.maxWords' && S.cap.words.length) rechunk();
        if(/^(ln|car|trim|trk|gf|dp)\./.test(k) || k==='tx.based' || k==='tx.cps' || k==='ti.side' || k==='tl.plat' || k==='tx.pattern' || /^(cap|fx)\./.test(k)){ renderSide(); renderGrid(); }
        else if(k==='tr.frames' || k==='tr.snappy' || k==='mp.dir' || k==='mp.frames' || k==='mp.side' || k==='mp.pivot' || k==='mp.bncN' || k==='mp.bncAmt' || k==='mp.loopAmt'){ /* previews read state live */ }
      };
    });
  });
  Array.prototype.forEach.call(side.querySelectorAll('[data-k]'), function(inp){
    var ev = inp.type==='checkbox' ? 'change' : 'input';
    inp.addEventListener(ev, function(){
      var v = inp.type==='checkbox' ? inp.checked : (inp.type==='number' ? (parseFloat(inp.value)||0) : inp.value);
      setPath(inp.dataset.k, v);
      if(/^tl\.(zones|safe|thirds|center)$/.test(inp.dataset.k)){ $('stage').innerHTML = guideSVG(byId(D.GUIDES, S.tl.plat), S.tl); renderGrid(); }
      if(inp.dataset.k==='tx.size'){ /* no-op */ }
      if(/^ai\./.test(inp.dataset.k)) AI.onSet(inp.dataset.k);
      if(inp.dataset.k==='ln.pPause' || inp.dataset.k==='mp.bnc') renderSide();
      if((inp.dataset.k==='ln.pMid' || inp.dataset.k==='ln.pStart') && $('lnMirror')){ var mb = $('lnMirror').querySelector('b'); if(mb) mb.textContent = (2*(+S.ln.pMid||0) - (+S.ln.pStart||0)) + '%'; }
      if(/^ln\.(erase|guide|speed|pStart|pEnd|pFrames|pDelay|pMid|pHold|pFrames2)$/.test(inp.dataset.k) && $('stage')) mountThumb($('stage'), cur(), true);
      if(/^car\./.test(inp.dataset.k)){ if(inp.dataset.k==='car.count') renderCarSlots(); renderGrid(); if($('stage')) mountThumb($('stage'), cur(), true); }
    });
  });
  var ti = $('txtIn');
  if(ti) ti.addEventListener('input', function(){ S.tx.text = ti.value; save(); mountThumb($('stage'), cur(), true); });
  Array.prototype.forEach.call(side.querySelectorAll('.tiline'), function(inp){
    inp.addEventListener('input', function(){
      var it = cur(), arr = tiTexts(it).slice(0); arr[+inp.dataset.i] = inp.value; S.ti.texts[it.id] = arr; save();
      mountThumb($('stage'), it, true);
    });
  });
  if($('go')) $('go').onclick = apply;
  if($('go2')) $('go2').onclick = function(){ host('textApply', txArgs()).then(say); };
  if($('clear')) $('clear').onclick = function(){ host('clearNabd').then(say); };
  if($('pick')) $('pick').onclick = function(){
    host('libPick').then(function(r){
      if(r.code==='MOCK'){ say(r); return; }
      if(r.ok && r.data.path && S.lib.paths.indexOf(r.data.path)<0){ S.lib.paths.push(r.data.path); save(); refreshLib(); }
    });
  };
  if($('refresh')) $('refresh').onclick = refreshLib;
  Array.prototype.forEach.call(side.querySelectorAll('[data-rm]'), function(b){ b.onclick = function(){ S.lib.paths.splice(+b.dataset.rm, 1); save(); refreshLib(); }; });
  Array.prototype.forEach.call(side.querySelectorAll('[data-ax]'), function(b){ b.onclick = function(){ host('anchor', {fx:+b.dataset.ax, fy:+b.dataset.ay}).then(say); }; });
  Array.prototype.forEach.call(side.querySelectorAll('[data-nudge]'), function(b){ b.onclick = function(){ host('keys', {op:'nudge', frames:+b.dataset.nudge}).then(say); }; });
}

function txArgs(tp){
  tp = tp || cur();
  return {spec:txSpec(tp), based:tp.by || S.tx.based, frames:S.tx.frames, size:S.tx.size, secs:S.tx.secs, doIn:S.tx.doIn, doOut:S.tx.doOut, text:S.tx.text, font:S.tx.font,
          cps:S.tx.cps, cursor:S.tx.cursor, acc:hexRGB(S.acc), sfx:((tp.src||tp.tw) && S.tx.typeSfx) ? sfxPath({id:'typing'}) : null};
}
var orgArm = 0;
function apply(){
  var it = cur(); if(!it) return;
  var p, acc = hexRGB(S.acc);
  switch(S.tab){
    case 'tr':
      if(it.otr){ p = host('otrApply', otrArgs(it)); break; }
      if(it.matte){ p = host('matteTr', {file:assetPath(it.matte.file), frames:S.tr.mframes, flip:S.tr.flip, sfx:S.tr.sfx ? sfxPath({id:'whoosh_soft'}) : null}); break; }
      p = host('transition', {type:it.id, frames:S.tr.frames, snappy:S.tr.snappy, sfx:S.tr.sfx, libPaths:S.lib.paths, acc:acc}); break;
    case 'mp': p = host('motion', {loopAmt:S.mp.loopAmt || 100, bounce:{on:!!S.mp.bnc, amt:S.mp.bncAmt || 50, n:S.mp.bncN || 2}, pivot:S.mp.pivot || 'el', spec:mpSpec(mpSided(it)), dir:S.mp.dir, frames:S.mp.frames, at:S.mp.at}); break;
    case 'tx': if(S.tab==='tx' && S.sel.tx){ p = host('textCreate', txArgs()); } break;
    case 'ti': p = host('title', titleArgs(it)); break;
    case 'el':
      if(it.ov){ p = host('overlay', {file:assetPath(it.ov.file), secs:S.el.secs, blend:S.el.blend, amount:S.el.amount, label:it.en, audio:false}); break; }
      p = host('element', {id:it.id, secs:S.el.secs, acc:acc}); break;
    case 'cap':
      if(!S.cap.caps.length){ say({ok:false, code:'NO_CAPS'}); return; }
      p = host('captions', {caps:S.cap.caps.map(function(c){ return {s:c.s, e:c.e, text:capClean(S.cap.upper ? c.text.toUpperCase() : c.text), words:c.w}; }), style:it,
        opts:{size:S.cap.size, y:S.cap.y, font:S.cap.font, stroke:S.cap.stroke, shadow:S.cap.shadow, box:S.cap.box, boxOp:S.cap.boxOp, color:hexRGB(S.cap.color), acc:acc, boxColor:[0,0,0]}});
      break;
    case 'sfx': p = host('libUse', {path:sfxPath(it), fit:false, screen:false}); break;
    case 'ts': p = host('textStyle', {st:stHost(it), mode:'selected'}); break;
    case 'fx': p = host('look', {ops:it.ops, kind:it.kind, label:it.en, mode:S.fx.mode, whole:S.fx.mode==='whole', amount:S.fx.amount}); break;
    case 'ln': p = lineApply(it, false); break;
    case 'car': p = host('carousel', carArgs(it)); break;
    case 'trk': p = trkApply(it); break;
    case 'trim': p = host('trimApply', trimArgs(it)); break;
    case 'tp': p = host('tplApply', tpArgs(it)); break;
    case 'dp': p = host('dpRig', dpArgs(it)); break;
    case 'bg': p = host('bgScroll', {ang:it.ang, speed:+S.bg.speed || 100, mirror:!!S.bg.mirror}); break;
    case 'gf': gfRun(it); return;
    case 'ez': if(it.auto){ p = host('autoAnim', {kind:it.auto, strength:S.ez.str}); break; }
      if(it.curve){ var cv = S.ez.curve; p = host('easeCurve', {x1:cv[0], y1:cv[1], x2:cv[2], y2:cv[3]}); break; }
      p = it.expr ? host('expr', {id:it.id}) : host('ease', {mode:it.mode||'bez', i:it.i, o:it.o}); break;
    case 'lib': p = host('libUse', {path:it.f.path, fit:S.lib.fit, screen:S.lib.screen}); break;
    case 'tl':
      switch(it.id){
        case 'anchor': p = host('anchor', {fx:0.5, fy:0.5}); break;
        case 'keysReverse': p = host('keys', {op:'reverse'}); break;
        case 'keysPlayhead': p = host('keys', {op:'playhead'}); break;
        case 'keysRetime': p = host('keys', {op:'retime', pct:S.tl.pct}); break;
        case 'keysNudge': p = host('keys', {op:'nudge', frames:1}); break;
        case 'sequence': p = host('sequence', {overlap:S.tl.overlap}); break;
        case 'stagger': p = host('stagger', {frames:S.tl.stagger}); break;
        case 'trimIn': p = host('trim', {side:'in'}); break;
        case 'trimOut': p = host('trim', {side:'out'}); break;
        case 'guides': p = host('guides', {plat:S.tl.plat, zones:S.tl.zones, safe:S.tl.safe, thirds:S.tl.thirds, center:S.tl.center}); break;
        case 'newComp': var c = D.COMP_SIZES[+S.tl.size||0]; p = host('newComp', {w:c.w, h:c.h, fps:S.tl.fps, secs:S.tl.secs, name:S.tl.name || ('HAMDY ' + c.ar)}); break;
        case 'beat': beatRun(); return;
        case 'tbreak': p = host('textBreak', {by:S.tl.tbBy}); break;
        case 'cutout': cutoutRun(); return;
        case 'rekey': case 'brand': return;
        case 'glass': p = host('liquidGlass', {shape:S.tl.gShape, text:S.tl.gText, blur:S.tl.gBlur, anim:S.tl.gAnim, font:S.tx && S.tx.font}); break;
        case 'fixAr': p = host('fixArabic', {reverse:S.tl.arRev}); break;
        case 'align': p = host('alignLayers', {mode:S.tl.align, to:S.tl.alignTo}); break;
        case 'vertical': var vs = S.tl.vSize.split('x'); p = host('verticalize', {w:+vs[0], h:+vs[1], mode:S.tl.vMode}); break;
        case 'unused':
          if(Date.now() - orgArm > 6000 || !UNUSED){ host('unusedItems', {remove:false}).then(function(r){ if(!r.ok) return say(r); UNUSED = r.data.count; orgArm = Date.now(); var t=$('toast'); t.className='toast info'; t.textContent = r.data.count ? (trText('في') + ' ' + r.data.count + ' ' + trText('ملف مش مستخدم:') + ' ' + r.data.names.slice(0,6).join('، ') + (r.data.count>6?' …':'') + '. ' + trText('دوس تاني عشان تمسحهم من المشروع (مش من الهارد).')) : trText('مفيش ملفات مش مستخدمة ✓'); }); return; }
          orgArm = 0; UNUSED = 0; p = host('unusedItems', {remove:true}); break;
        case 'render': p = host('renderNow', {fmt:S.tl.rfmt}, 600000).then(function(r){ if(r.ok && r.data && r.data.path) host('openFolder', {path:dirOf(r.data.path)}); return r; }); break;
        case 'savePng': p = host('saveFramePng', {}).then(function(r){ if(r.ok && r.data && r.data.path){ host('openFolder', {path:dirOf(r.data.path)}); r = {ok:true, data:'OK_SAVED'}; } return r; }); break;
        case 'organize':
          if(Date.now() - orgArm > 4000){ orgArm = Date.now(); var t=$('toast'); t.className='toast info'; t.textContent='دوس تاني للتأكيد. هيتنقل كل حاجة لفولدرات ومش هيتمسح حاجة.'; return; }
          orgArm = 0; p = host('organize', {deep:S.tl.deep}); break;
        default: p = host(it.id);
      }
      break;
  }
  if(p) p.then(function(r){ say(r); if(r.ok){ ED_DIRTY = true; pushRecent(S.tab, S.sel[S.tab]); } });
  return p;
}

var CURVES = [
  ['easeInOutSine',[0.37,0,0.63,1]],['easeInOutQuad',[0.45,0,0.55,1]],['easeInOutCubic',[0.65,0,0.35,1]],['easeInOutQuart',[0.76,0,0.24,1]],['easeInOutExpo',[0.87,0,0.13,1]],
  ['easeOutSine',[0.61,1,0.88,1]],['easeOutCubic',[0.33,1,0.68,1]],['easeOutQuart',[0.25,1,0.5,1]],['easeOutExpo',[0.16,1,0.3,1]],['easeOutBack',[0.34,1.56,0.64,1]],
  ['easeInSine',[0.12,0,0.39,0]],['easeInCubic',[0.32,0,0.67,0]],['easeInExpo',[0.7,0,0.84,0]],['easeInBack',[0.36,0,0.66,-0.56]]];
function curveSide(it){
  var c = S.ez.curve, h = '<div class="head"><h2>' + it.ar + ' <span class="en">Curve Editor</span></h2><p>' + trText('اسحب النقطتين لحد ما توصل للإحساس اللي عايزه، أو اختار واحد جاهز. بيتحوّل لسرعة وتأثير حقيقيين في الكي فريمز.') + '</p></div>';
  h += '<div class="cved"><svg id="cvSvg" viewBox="-20 -60 240 340"><rect x="0" y="0" width="200" height="200" fill="#121216" stroke="#26262c"/>' +
    '<g stroke="#1e1e24">' + [40,80,120,160].map(function(v){ return '<line x1="' + v + '" y1="0" x2="' + v + '" y2="200"/><line x1="0" y1="' + v + '" x2="200" y2="' + v + '"/>'; }).join('') + '</g>' +
    '<line id="cvL1" stroke="#77777f" stroke-width="1.5"/><line id="cvL2" stroke="#77777f" stroke-width="1.5"/><path id="cvPath" fill="none" stroke="var(--acc)" stroke-width="3"/>' +
    '<circle cx="0" cy="200" r="4" fill="#fff"/><circle cx="200" cy="0" r="4" fill="#fff"/><circle id="cvH1" r="9" fill="var(--acc)" stroke="#fff" stroke-width="2" style="cursor:grab"/><circle id="cvH2" r="9" fill="var(--acc2)" stroke="#fff" stroke-width="2" style="cursor:grab"/>' +
    '<circle id="cvDot" r="6" fill="#fff"/></svg><div class="cvnum" id="cvNum"></div></div>';
  h += '<div class="cvpre">' + CURVES.map(function(k){ return '<button class="btn" data-cv="' + k[1].join(',') + '">' + k[0].replace('ease','') + '</button>'; }).join('') + '</div>';
  h += '<button class="btn primary" id="go">' + trText('طبّق على الكي فريمز المحددة') + '</button>';
  h += '<div class="row"><button class="btn" id="cvRead">' + trText('اقرا من الكي فريم') + '</button><button class="btn" id="cvCopy">' + trText('انسخ الإيز') + '</button></div>';
  h += '<div class="row"><button class="btn" id="cvPaste"' + (S.ez.clip ? '' : ' disabled') + '>' + trText('الصق') + '</button><button class="btn" id="cvPasteIn"' + (S.ez.clip ? '' : ' disabled') + '>' + trText('الصق الدخلة بس') + '</button><button class="btn" id="cvPasteOut"' + (S.ez.clip ? '' : ' disabled') + '>' + trText('الصق الخرجة بس') + '</button></div>';
  h += '<div class="hint">' + trText('حدد كي فريمز (اتنين أو أكتر) في التايملاين. المنحنى بيتطبق على كل مسافة بين كي فريمين ورا بعض.') + '</div>';
  return h;
}
function bindCurve(){
  var svg = $('cvSvg'); if(!svg) return;
  function draw(){
    var c = S.ez.curve, P1 = [c[0]*200, 200 - c[1]*200], P2 = [c[2]*200, 200 - c[3]*200];
    $('cvH1').setAttribute('cx', P1[0]); $('cvH1').setAttribute('cy', P1[1]); $('cvH2').setAttribute('cx', P2[0]); $('cvH2').setAttribute('cy', P2[1]);
    $('cvL1').setAttribute('x1', 0); $('cvL1').setAttribute('y1', 200); $('cvL1').setAttribute('x2', P1[0]); $('cvL1').setAttribute('y2', P1[1]);
    $('cvL2').setAttribute('x1', 200); $('cvL2').setAttribute('y1', 0); $('cvL2').setAttribute('x2', P2[0]); $('cvL2').setAttribute('y2', P2[1]);
    $('cvPath').setAttribute('d', 'M0 200 C' + P1[0] + ' ' + P1[1] + ' ' + P2[0] + ' ' + P2[1] + ' 200 0');
    $('cvNum').textContent = 'cubic-bezier(' + c.map(function(v){ return (+v).toFixed(2); }).join(', ') + ')';
  }
  function drag(id, ix){
    var h = $(id);
    h.onpointerdown = function(e){
      h.setPointerCapture(e.pointerId);
      h.onpointermove = function(ev){
        var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; var q = pt.matrixTransform(svg.getScreenCTM().inverse());
        S.ez.curve[ix] = Math.round(Math.max(0, Math.min(1, q.x/200))*100)/100; S.ez.curve[ix+1] = Math.round(Math.max(-0.6, Math.min(1.6, (200 - q.y)/200))*100)/100; draw();
      };
      h.onpointerup = function(){ h.onpointermove = null; save(); var st = $('stage') || null; renderGrid(); };
    };
  }
  drag('cvH1', 0); drag('cvH2', 2); draw();
  if($('cvRead')) $('cvRead').onclick = function(){ host('easeCopy', {}).then(function(r){ if(!r.ok) return say(r); if(r.data.curve){ S.ez.curve = r.data.curve.map(function(v){ return Math.round(v*100)/100; }); S.ez.curve[0] = Math.max(0, Math.min(1, S.ez.curve[0])); S.ez.curve[2] = Math.max(0, Math.min(1, S.ez.curve[2])); save(); draw(); renderGrid(); say({ok:true, data:'OK'}); } else say({ok:false, code:'NO_KEYS'}); }); };
  if($('cvCopy')) $('cvCopy').onclick = function(){ host('easeCopy', {}).then(function(r){ if(!r.ok) return say(r); S.ez.clip = r.data; save(); renderSide(); var t=$('toast'); t.className='toast ok'; t.textContent = trText('الإيز اتنسخ ✓ حدد كي فريمز تانية ودوس «الصق».'); }); };
  [['cvPaste','both'],['cvPasteIn','in'],['cvPasteOut','out']].forEach(function(b){ if($(b[0])) $(b[0]).onclick = function(){ if(S.ez.clip) host('easePaste', {ease:S.ez.clip, which:b[1]}).then(say); }; });
  Array.prototype.forEach.call(document.querySelectorAll('[data-cv]'), function(b){ b.onclick = function(){ S.ez.curve = b.dataset.cv.split(',').map(Number); save(); draw(); renderGrid(); }; });
  var t0 = performance.now();
  (function anim(){ var d = $('cvDot'); if(!d) return; var u = ((performance.now() - t0) / 1400) % 1.4; u = Math.min(1, u); var f = P.easeFn({bz:S.ez.curve})(u); d.setAttribute('cx', u*200); d.setAttribute('cy', 200 - f*200); requestAnimationFrame(anim); })();
}
function capClean(t){ return S.cap.nopunct ? String(t).replace(/[.,!?؟،؛:;"'“”«»…]+/g, '').replace(/\s{2,}/g, ' ').trim() : t; }
/* ============================================================ templates tab */
var TP_PLACE = {top:[0.5,0.15], center:[0.5,0.5], bottom:[0.5,0.84], left:[0.3,0.5], right:[0.7,0.5]};
function bindToolExtra(it){
  if(it.id==='rekey'){
    if($('kSave')) $('kSave').onclick = function(){ var nm = ($('kName').value||'').trim() || ('حركة ' + ((S.keys||[]).length + 1)); host('keySave', {}).then(function(r){ if(!r.ok) return say(r); S.keys = S.keys || []; S.keys.push({name:nm, data:r.data}); save(); renderSide(); var t=$('toast'); t.className='toast ok'; t.textContent = trText('اتحفظت ✓'); }); };
    Array.prototype.forEach.call(document.querySelectorAll('#side [data-kapply]'), function(b){ b.onclick = function(){ var k = S.keys[+b.dataset.kapply]; host('keyApply', {preset:k.data, mode:S.tl.kMode, speed:S.tl.kSpeed}).then(say); }; });
    Array.prototype.forEach.call(document.querySelectorAll('#side [data-kdel]'), function(b){ b.onclick = function(){ S.keys.splice(+b.dataset.kdel, 1); save(); renderSide(); }; });
  }
  if(it.id==='brand'){
    if($('bName')) $('bName').oninput = function(){ S.brand.name = $('bName').value; save(); };
    if($('bFont')) $('bFont').oninput = function(){ S.brand.font = $('bFont').value; save(); };
    Array.prototype.forEach.call(document.querySelectorAll('#side [data-bc]'), function(inp){ inp.oninput = function(){ S.brand.cols[+inp.dataset.bc] = inp.value; save(); }; });
  }
}
function tplOpts(it){
  var f = {}, k;
  (it.fields||[]).forEach(function(x){ var v = S.tp.f[it.id] && S.tp.f[it.id][x.k]; if(v !== undefined && v !== '') f[x.k] = v; });
  return {fields:f, cols:(S.tp.c[it.id] || it.cols), anc:(S.tp.place!=='def' && it.layers[0].t!=='bg') ? TP_PLACE[S.tp.place] : null, scale:it.layers[0].t==='bg' ? 1 : S.tp.size};
}
function tpSide(it){
  var h = '<div class="stage" id="stage"></div>' + head(it, ''), o = tplOpts(it), cols = o.cols;
  h += '<div class="field"><span class="lbl">عدّل قبل الإضافة</span>';
  (it.fields||[]).forEach(function(x){
    var v = (S.tp.f[it.id] && S.tp.f[it.id][x.k]) || '', def = '';
    it.layers.forEach(function(l){ if(l.fld===x.k) def = l.def; });
    h += '<label class="tpf"><span>' + x.ar + '</span>' + (String(def).indexOf('\n') >= 0 ? '<textarea rows="2" data-tpf="' + x.k + '" placeholder="' + esc(def) + '">' + esc(v) + '</textarea>' : '<input type="text" data-tpf="' + x.k + '" value="' + esc(v) + '" placeholder="' + esc(def) + '">') + '</label>';
  });
  h += '<div class="tpcols">' + [0,1,2].map(function(i){ return '<label><input type="color" data-tpc="' + i + '" value="' + cols[i] + '"><span>' + ['لون 1','لون 2','لون 3'][i] + '</span></label>'; }).join('') + '<button class="btn" id="tpReset">رجّع الأصلي</button><button class="btn" id="tpBrand">ألوان البراند</button></div></div>';
  if(it.layers[0].t!=='bg'){
    h += '<div class="field"><span class="lbl">المكان</span>' + seg('tp.place', [['def','الأصلي'],['top','فوق'],['center','النص'],['bottom','تحت'],['right','يمين'],['left','شمال']], S.tp.place) + '</div>';
    h += '<div class="field"><span class="lbl">الحجم</span>' + seg('tp.size', [[0.7,'صغير'],[1,'عادي'],[1.3,'كبير']], S.tp.size) + '</div>';
  }
  h += '<div class="field"><span class="lbl">المدة</span>' + seg('tp.dur', [[0,'الأصلية'],[3,'3 ث'],[5,'5 ث'],[8,'8 ث']], S.tp.dur) + '</div>';
  h += chk('tp.sfx', 'صوت مع الدخلة', S.tp.sfx);
  h += '<button class="btn primary" id="go">حط القالب</button>';
  h += '<div class="hint">القالب بينزل لايرات أفتر عادية كلها متعلقة على نل اسمه HAMDY TPL. حرّك النل أو كبّره يتحرك القالب كله، والألوان التلاتة من HAMDY Color 1 و2 و3 عليه، فتقدر تغيّرها بعد ما ينزل. النصوص لايرات نص عادية.</div>';
  return h;
}
function tpArgs(it){
  var o = tplOpts(it);
  return {spec:it, fields:o.fields, colors:o.cols, dur:S.tp.dur || it.dur, anchor:o.anc, scale:o.scale, font:(S.brand && S.brand.font) || (S.tx && S.tx.font), sfx:(S.tp.sfx && it.layers[0].t!=='bg') ? sfxPath({id:it.sfx || ({'واجهات UI':'pop_1','ستايل شرح وكولاج':'swish_1','ستايل أخبار':'whoosh_bright'}[it.g]) || 'pop_1'}) : null};
}
function bindTp(){
  var it = cur(); if(!it) return;
  var tmr = null;
  function later(){ clearTimeout(tmr); tmr = setTimeout(function(){ save(); }, 400); }
  Array.prototype.forEach.call(document.querySelectorAll('#side [data-tpf]'), function(inp){ inp.oninput = function(){ S.tp.f[it.id] = S.tp.f[it.id] || {}; S.tp.f[it.id][inp.dataset.tpf] = inp.value; later(); }; });
  Array.prototype.forEach.call(document.querySelectorAll('#side [data-tpc]'), function(inp){ inp.oninput = function(){ var c = (S.tp.c[it.id] || it.cols).slice(); c[+inp.dataset.tpc] = inp.value; S.tp.c[it.id] = c; later(); }; });
  if($('tpReset')) $('tpReset').onclick = function(){ delete S.tp.f[it.id]; delete S.tp.c[it.id]; save(); renderSide(); };
  if($('tpBrand')) $('tpBrand').onclick = function(){ S.tp.c[it.id] = S.brand.cols.slice(); save(); renderSide(); };
}
/* ============================================================ quick search (Ctrl+K / Ctrl+Space) */
function projRecent(tab){ var P = (S.recP || {})[PROJ || '—']; return (P && P[tab]) || []; }
function pushRecent(tab, id){ if(!id || tab==='ed' || tab==='ai' || tab==='br') return;
  // per project (the open .aep), per tab: shown as the "recent" filter at the top of each tab
  S.recP = S.recP || {}; var pk = PROJ || '—', P = S.recP[pk] = S.recP[pk] || {}, L = (P[tab] || []).filter(function(x){ return x !== id; }); L.unshift(id); P[tab] = L.slice(0, 30); P._t = Date.now();
  var ks = Object.keys(S.recP); if(ks.length > 25){ ks.sort(function(a, b){ return (S.recP[a]._t||0) - (S.recP[b]._t||0); }); delete S.recP[ks[0]]; } var k = tab + ':' + id; S.recent = (S.recent||[]).filter(function(x){ return x!==k; }); S.recent.unshift(k); S.recent = S.recent.slice(0, 12); save(); }
var QS = null;
function qsIndex(){
  var out = [];
  TABS.forEach(function(t){
    if(/^(ed|ai|br|lib)$/.test(t.id)) return;
    var its = []; try{ its = itemsOf(t.id) || []; }catch(e){}
    its.forEach(function(it){ if(it && it.id) out.push({tab:t.id, tabName:trText(t.ar), it:it, key:(it.ar + ' ' + (it.en||'') + ' ' + (it.g||'') + ' ' + trText(it.g||'') + ' ' + t.ar).toLowerCase()}); });
  });
  return out;
}
function qsScore(key, q){
  if(!q) return 1;
  var words = q.split(/\s+/), sc = 0;
  for(var i = 0; i < words.length; i++){ var w = words[i]; if(!w) continue; var p = key.indexOf(w); if(p < 0){ // loose subsequence
      var j = 0, k; for(k = 0; k < key.length && j < w.length; k++) if(key[k]===w[j]) j++; if(j < w.length) return 0; sc += 1; } else sc += 10 - Math.min(9, p/10); }
  return sc;
}
function qsOpen(){
  if(QS){ QS.inp.focus(); return; }
  var idx = qsIndex(), box = document.createElement('div'); box.className = 'qs';
  box.innerHTML = '<div class="qsbox"><input id="qsIn" placeholder="' + trText('دوّر في الكيت كله… (Enter يطبّق، Esc يقفل)') + '"><div class="qslist" id="qsList"></div></div>';
  document.body.appendChild(box);
  var inp = box.querySelector('input'), list = box.querySelector('.qslist'), res = [], cur = 0;
  QS = {box:box, inp:inp};
  function draw(){
    var q = inp.value.trim().toLowerCase();
    if(!q){ res = (S.recent||[]).map(function(k){ var pr = k.split(':'); return idx.filter(function(x){ return x.tab===pr[0] && x.it.id===pr[1]; })[0]; }).filter(Boolean);
      var fv = []; Object.keys(S.fav||{}).forEach(function(tb){ (S.fav[tb]||[]).forEach(function(id){ var x = idx.filter(function(y){ return y.tab===tb && y.it.id===id; })[0]; if(x && res.indexOf(x)<0) fv.push(x); }); }); res = res.concat(fv).slice(0, 30); }
    else res = idx.map(function(x){ return {x:x, s:qsScore(x.key, q)}; }).filter(function(o){ return o.s > 0; }).sort(function(a,b){ return b.s - a.s; }).slice(0, 40).map(function(o){ return o.x; });
    cur = Math.min(cur, Math.max(0, res.length - 1));
    list.innerHTML = res.length ? res.map(function(x, i){ var f = (S.fav[x.tab]||[]).indexOf(x.it.id)>=0; return '<div class="qsi' + (i===cur?' on':'') + '" data-i="' + i + '"><b>' + (f?'★ ':'') + esc(x.it.ar) + '</b><span>' + esc(x.it.en||'') + '</span><em>' + esc(x.tabName) + '</em></div>'; }).join('') : '<div class="qsempty">' + (q ? trText('مفيش نتايج') : trText('اكتب اسم أي حاجة: ترانزيشن، حركة نص، قالب، أداة…')) + '</div>';
    Array.prototype.forEach.call(list.children, function(el){ el.onmouseenter = function(){ cur = +el.dataset.i; mark(); }; el.onclick = function(){ cur = +el.dataset.i; go(false); }; });
  }
  function mark(){ Array.prototype.forEach.call(list.children, function(el, i){ el.classList.toggle('on', i===cur); }); var on = list.children[cur]; if(on && on.scrollIntoView) on.scrollIntoView({block:'nearest'}); }
  function close(){ if(!QS) return; box.remove(); QS = null; }
  function go(applyNow){
    var x = res[cur]; if(!x) return; close();
    S.tab = x.tab; S.sel[x.tab] = x.it.id; S.filter[x.tab] = 'الكل'; save(); renderAll();
    if(applyNow) apply();
  }
  inp.oninput = function(){ cur = 0; draw(); };
  inp.onkeydown = function(e){
    if(e.key==='ArrowDown'){ cur = Math.min(res.length-1, cur+1); mark(); e.preventDefault(); }
    else if(e.key==='ArrowUp'){ cur = Math.max(0, cur-1); mark(); e.preventDefault(); }
    else if(e.key==='Enter'){ go(!e.shiftKey); e.preventDefault(); }
    else if(e.key==='Escape'){ close(); }
  };
  box.onmousedown = function(e){ if(e.target===box) close(); };
  draw(); setTimeout(function(){ inp.focus(); }, 0);
}
document.addEventListener('keydown', function(e){
  if((e.ctrlKey || e.metaKey) && (e.key==='k' || e.key==='K' || e.code==='KeyK' || e.code==='Space')){ e.preventDefault(); qsOpen(); }
});
var SEG = null;
function cutoutRun(){
  if(!NODE){ say({ok:false, code:'NO_NODE'}); return; }
  if(!SEG) SEG = HMK_MAKE_SEG({NODE:NODE});
  function msg(m){ var el = $('cutStatus'); if(el) el.textContent = m; var t = $('toast'); t.className = 'toast info'; t.textContent = m; }
  msg(trText('بجهّز الصورة…'));
  host('layerFrame', {}).then(function(r){
    if(!r.ok) return say(r);
    var fr = r.data;
    return SEG.cut(fr.path, S.tl.cutModel, msg).then(function(png){
      msg(trText('بحط النتيجة في الكومب…'));
      return host('placeCutout', {path:png, index:fr.index, mode:S.tl.cutMode, still:fr.still, text:S.tl.cutText, font:(S.brand && S.brand.font) || (S.tx && S.tx.font)});
    }).then(function(r2){ msg(''); say(r2); });
  }).catch(function(e){ msg(''); say({ok:false, msg:String(e && e.message || e)}); });
}
var UNUSED = 0;
function dirOf(p){ return String(p).replace(/[\\\/][^\\\/]*$/, ''); }
/* ---- on the beat: decode the selected music layer on this machine and find onsets ---- */
function beatRun(){
  var t = $('toast'); t.className = 'toast info'; t.textContent = trText('بحلّل المزيكا…');
  host('capSource', {}).then(function(r){
    if(!r.ok) return say(r);
    var src = r.data, fs = NODE && NODE('fs');
    if(!fs) return say({ok:false, code:'NO_NODE'});
    var buf; try{ buf = fs.readFileSync(src.path); }catch(e){ return say({ok:false, msg:String(e.message||e)}); }
    var ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), AC = window.AudioContext || window.webkitAudioContext, ac = new AC();
    ac.decodeAudioData(ab, function(audio){
      try{ ac.close(); }catch(e){}
      var beats = detectBeats(audio, S.tl), st = (src.stretch || 100) / 100, times = [];
      beats.forEach(function(b){ var ct = src.start + b * st; if(ct >= src.inPoint - 0.001 && ct <= src.outPoint) times.push(Math.round(ct * 1000) / 1000); });
      if(!times.length) return say({ok:false, code:'NO_BEATS'});
      host('beatApply', {audio:src.index, times:times, mode:S.tl.beatMode, amt:S.tl.beatAmt, decay:S.tl.beatDecay}).then(say);
    }, function(){ say({ok:false, code:'BAD_AUDIO'}); });
  });
}
function detectBeats(audio, o){
  var sr = audio.sampleRate, n = audio.length, ch = audio.numberOfChannels, x = new Float32Array(n), c, i;
  for(c = 0; c < ch; c++){ var d = audio.getChannelData(c); for(i = 0; i < n; i++) x[i] += d[i] / ch; }
  if(o.beatBand !== 'all'){ var a = Math.exp(-2 * Math.PI * 160 / sr), y = 0; for(i = 0; i < n; i++){ y = (1 - a) * x[i] + a * y; x[i] = y; } }
  var hop = Math.round(sr / 100), N = Math.floor(n / hop), env = new Float32Array(N), fl = new Float32Array(N);
  for(i = 0; i < N; i++){ var s = 0, j0 = i * hop, j; for(j = j0; j < j0 + hop; j++) s += x[j] * x[j]; env[i] = Math.log(1 + 1000 * Math.sqrt(s / hop)); }
  for(i = 1; i < N; i++) fl[i] = Math.max(0, env[i] - env[i-1]);
  var k = {low:2.2, mid:1.5, high:1.0}[o.beatSens] || 1.5, W = 50, out = [], last = -9, gap = o.beatGap || 0.25;
  for(i = 1; i < N - 1; i++){
    if(fl[i] < fl[i-1] || fl[i] < fl[i+1]) continue;
    var a0 = Math.max(0, i - W), a1 = Math.min(N, i + W), m = 0, q = 0, cnt = a1 - a0, j2;
    for(j2 = a0; j2 < a1; j2++) m += fl[j2]; m /= cnt;
    for(j2 = a0; j2 < a1; j2++) q += (fl[j2] - m) * (fl[j2] - m); q = Math.sqrt(q / cnt);
    if(fl[i] > m + k * q && fl[i] > 0.02){ var tt = i / 100; if(tt - last >= gap){ out.push(tt); last = tt; } }
  }
  return out;
}
function refreshLib(){
  if(!S.lib.paths.length){ LIBFILES = []; if(S.tab==='lib') renderAll(); return; }
  host('libList', {paths:S.lib.paths}).then(function(r){
    LIBFILES = r.ok ? (r.data.files || []) : [];
    if(!r.ok) say(r);
    if(S.tab==='lib') renderAll();
  });
}

function renderAll(){ document.body.classList.toggle('ed', S.tab==='ed' || S.tab==='ai' || S.tab==='br'); document.body.classList.toggle('aitab', S.tab==='ai' || S.tab==='br'); renderTabs(); renderGrid(); renderSide(); var tn = TABS.filter(function(t){ return t.id===S.tab; })[0].ar; $('q').placeholder = S.lang==='en' ? 'Search ' + trText(tn) + '...' : 'ابحث في ' + tn + '...'; }

/* ===================================================== text style -> host */
function stHost(st){
  var c = function(v){ return v ? hexRGB(v==='acc' ? S.acc : v) : null; }, o = {};
  o.fill = c(st.fill); o.stroke = c(st.stroke); o.sw = st.sw; o.trk = st.trk; o.caps = st.caps;
  if(st.grad) o.grad = [hexRGB(st.grad[0]), hexRGB(st.grad[1])];
  if(st.bevel) o.bevel = st.bevel; if(st.glow) o.glow = st.glow; if(st.sweep) o.sweep = true;
  ['shadow','shadow2'].forEach(function(k){ if(st[k]){ o[k] = JSON.parse(JSON.stringify(st[k])); o[k].c = hexRGB(st[k].c); } });
  if(st.box){ o.box = JSON.parse(JSON.stringify(st.box)); o.box.c = c(st.box.c); }
  if(st.layers) o.layers = st.layers.map(function(l){ return {fill:c(l.fill), stroke:c(l.stroke), sw:l.sw, dx:l.dx||0, dy:l.dy||0}; });
  if(st.extrude) o.extrude = {n:st.extrude.n, dx:st.extrude.dx, dy:st.extrude.dy, c:c(st.extrude.c), c2:c(st.extrude.c2 || st.extrude.c)};
  return o;
}

/* ========================================================= node helpers */
var NODE = (function(){ try{ if(window.cep_node && window.cep_node.require) return window.cep_node.require; if(typeof require==='function') return require; }catch(e){} return null; })();
function nodeOK(){ return !!(NODE && CEP); }
function httpsReq(method, url, headers, body){
  return new Promise(function(res, rej){
    var https = NODE('https'), u = new URL(url), Buf = NODE('buffer').Buffer;
    var req = https.request({method:method, hostname:u.hostname, path:u.pathname + u.search, headers:headers}, function(r){
      var chunks = []; r.on('data', function(c){ chunks.push(c); }); r.on('end', function(){ res({status:r.statusCode, body:Buf.concat(chunks)}); });
    });
    req.on('error', rej);
    req.setTimeout(240000, function(){ req.destroy(new Error('timeout')); });
    if(body) req.write(body);
    req.end();
  });
}
function multipart(fields, fileBuf, fileName, mime){
  var Buf = NODE('buffer').Buffer, bnd = '----nabd' + Date.now().toString(16), parts = [];
  Object.keys(fields).forEach(function(k){ [].concat(fields[k]).forEach(function(v){ parts.push(Buf.from('--' + bnd + '\r\nContent-Disposition: form-data; name="' + k + '"\r\n\r\n' + v + '\r\n')); }); });
  parts.push(Buf.from('--' + bnd + '\r\nContent-Disposition: form-data; name="file"; filename="' + fileName + '"\r\nContent-Type: ' + mime + '\r\n\r\n'));
  parts.push(fileBuf); parts.push(Buf.from('\r\n--' + bnd + '--\r\n'));
  return {body:Buf.concat(parts), type:'multipart/form-data; boundary=' + bnd};
}
function wavEncode(samples, sr){
  var Buf = NODE('buffer').Buffer, n = samples.length, b = Buf.alloc(44 + n*2);
  b.write('RIFF',0); b.writeUInt32LE(36 + n*2, 4); b.write('WAVE',8); b.write('fmt ',12); b.writeUInt32LE(16,16); b.writeUInt16LE(1,20); b.writeUInt16LE(1,22);
  b.writeUInt32LE(sr,24); b.writeUInt32LE(sr*2,28); b.writeUInt16LE(2,32); b.writeUInt16LE(16,34); b.write('data',36); b.writeUInt32LE(n*2,40);
  for(var i=0;i<n;i++){ var v = Math.max(-1, Math.min(1, samples[i])); b.writeInt16LE(Math.round(v*32767), 44 + i*2); }
  return b;
}
function decodeSegment(path, a, b){
  var buf = NODE('fs').readFileSync(path), ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  var AC = window.AudioContext || window.webkitAudioContext, ctx = new AC();
  return ctx.decodeAudioData(ab).then(function(audio){
    try{ ctx.close(); }catch(e){}
    var sr = 16000, st = Math.max(0, a), dur = Math.max(0.2, Math.min(audio.duration, b) - st);
    var off = new OfflineAudioContext(1, Math.ceil(dur*sr), sr), src = off.createBufferSource();
    src.buffer = audio; src.connect(off.destination); src.start(0, st, dur);
    return off.startRendering();
  }).then(function(r){ return wavEncode(r.getChannelData(0), 16000); });
}

/* ============================================================== captions */
var CAP_STATUS = '';
function capOpt(big){
  var first = S.cap.caps[0];
  return {text: big && first ? S.cap.caps.slice(0,3).map(function(c){ return c.text; }).join(' ') : null, maxWords:S.cap.maxWords, size:S.cap.size, y:S.cap.y,
          stroke:S.cap.stroke, shadow:S.cap.shadow, box:S.cap.box, boxOp:S.cap.boxOp, acc:S.acc, upper:S.cap.upper};
}
function fmtT(t){ var m = Math.floor(t/60), s = t - m*60; return m + ':' + (s<10?'0':'') + s.toFixed(1); }
function chunkWords(words, maxWords, maxChars){
  var caps = [], cur = null, PUNCT = /[.!?؟،,؛;:…]$/;
  words.forEach(function(w, i){
    var prev = words[i-1];
    var brk = !cur || cur.w.length >= maxWords || (cur.text + ' ' + w.w).length > maxChars || (prev && w.s - prev.e > 0.5) || (prev && PUNCT.test(prev.w));
    if(brk){ if(cur) caps.push(cur); cur = {s:w.s, e:w.e, text:w.w, w:[w.s]}; }
    else { cur.text += ' ' + w.w; cur.e = w.e; cur.w.push(w.s); }
  });
  if(cur) caps.push(cur);
  for(var i=0;i<caps.length-1;i++){ if(caps[i+1].s - caps[i].e < 0.35) caps[i].e = caps[i+1].s; }
  return caps;
}
function rechunk(){ var mw = (byId(D.CAPSTYLES, S.sel.cap)||{}).maxWords || S.cap.maxWords; S.cap.caps = chunkWords(S.cap.words, mw, S.cap.maxChars); save(); }
function spreadWords(text, s, e){
  var ws = text.split(/\s+/).filter(Boolean), tot = ws.reduce(function(a,w){ return a + w.length + 1; }, 0), t = s, out = [];
  ws.forEach(function(w){ var d = (e-s)*(w.length+1)/tot; out.push({w:w, s:t, e:t+d}); t += d; });
  return out;
}
function setCapStatus(t, cls){ CAP_STATUS = t; var el = $('capStatus'); if(el){ el.textContent = t; el.className = 'hint ' + (cls||''); } }
function transcribe(){
  if(!nodeOK()){ say({ok:false, code:'NO_NODE'}); return; }
  var prov = S.cap.provider, key = (S.cap.keys[prov]||'').trim();
  if(prov === 'local') return transcribeLocal();
  if(prov === 'premiere'){ $('srtIn') && $('srtIn').click(); return; }
  if(!key){ say({ok:false, code:'NO_KEY'}); return; }
  setCapStatus('١/٤ بجيب اللاير المحدد...');
  host('capSource').then(function(r){
    if(!r.ok){ say(r); setCapStatus(''); return; }
    var src = r.data, a = src.inPoint - src.start, b = src.outPoint - src.start, k = (src.stretch||100)/100;
    a = a / k; b = b / k;
    setCapStatus('٢/٤ بجهّز الصوت...');
    return decodeSegment(src.path, a, b).then(function(wav){ return {wav:wav, mime:'audio/wav', name:'audio.wav'}; }, function(){
      var buf = NODE('fs').readFileSync(src.path);
      return {wav:buf, mime: /\.mp3$/i.test(src.path) ? 'audio/mpeg' : (/\.wav$/i.test(src.path) ? 'audio/wav' : 'video/mp4'), name:src.path.split(/[\\\/]/).pop(), raw:true};
    }).then(function(aud){
      setCapStatus('٣/٤ بفرّغ الكلام (' + {deepgram:'Deepgram', groq:'Groq', openai:'OpenAI'}[prov] + ')...');
      var job;
      if(prov !== 'deepgram' && !aud.raw && (b - a) > 600){
        // long audio: Groq/OpenAI take max 25 MB, so send it in 10-minute pieces and stitch the timings
        var parts = [], t;
        for(t = a; t < b; t += 600) parts.push([t, Math.min(b, t + 600)]);
        var all = [];
        job = parts.reduce(function(pr, seg2, i){
          return pr.then(function(){
            setCapStatus('٣/٤ بفرّغ جزء ' + (i+1) + ' من ' + parts.length + '...');
            return decodeSegment(src.path, seg2[0], seg2[1]).then(function(w){ return whisperTranscribe({wav:w, mime:'audio/wav', name:'part.wav'}, key, prov); })
              .then(function(ws){ ws.forEach(function(x){ all.push({w:x.w, s:x.s + (seg2[0]-a), e:x.e + (seg2[0]-a)}); }); });
          });
        }, Promise.resolve()).then(function(){ return all; });
      } else job = (prov==='deepgram' ? dgTranscribe(aud, key) : whisperTranscribe(aud, key, prov));
      return job.then(function(words){
        var off = aud.raw ? -a : 0;
        S.cap.words = words.map(function(w){ return {w:w.w, s:src.inPoint + (w.s+off)*k, e:src.inPoint + (w.e+off)*k}; }).filter(function(w){ return w.e > src.inPoint - 0.01 && w.s < src.outPoint + 0.01; });
        S.cap.src = src.name; rechunk();
        setCapStatus('٤/٤ تم ✓ ' + S.cap.words.length + ' كلمة في ' + S.cap.caps.length + ' كابشن. راجعهم تحت وبعدين دوس "حط الكابشن".', 'okline');
        renderSide();
      });
    });
  }).catch(function(e){ setCapStatus('حصل خطأ: ' + (e && e.message || e), 'badline'); });
}
var ASR = null;
function transcribeLocal(){
  if(!ASR) ASR = HMK_MAKE_ASR({NODE:NODE});
  setCapStatus('بجيب اللاير المحدد...');
  host('capSource').then(function(r){
    if(!r.ok){ say(r); setCapStatus(''); return; }
    var src = r.data, k = (src.stretch||100)/100, a = (src.inPoint - src.start) / k, b = (src.outPoint - src.start) / k;
    setCapStatus('بجهّز الصوت...');
    return decodeSegment(src.path, a, b).then(function(wav){
      return ASR.run(wav, S.cap.lang, S.cap.q || 'best', function(msg){ setCapStatus(msg); });
    }).then(function(words){
      S.cap.words = words.map(function(w){ return {w:w.w, s:src.inPoint + w.s*k, e:src.inPoint + w.e*k}; }).filter(function(w){ return w.e > src.inPoint - 0.01 && w.s < src.outPoint + 0.01; });
      S.cap.src = src.name; rechunk();
      setCapStatus('تم ✓ ' + S.cap.words.length + ' كلمة في ' + S.cap.caps.length + ' كابشن، والتفريغ حصل على جهازك. راجعهم تحت وبعدين دوس "حط الكابشن".', 'okline');
      renderSide();
    });
  }).catch(function(e){
    var m = String(e && e.message || e);
    if(m === 'MAC_NEEDS_BREW') m = 'على الماك: افتح Terminal واكتب brew install whisper-cpp مرة واحدة، وبعدين دوس تاني.';
    setCapStatus('حصل خطأ: ' + m, 'badline');
  });
}
function dgTranscribe(aud, key){
  var lang = S.cap.lang, q = 'model=nova-3&smart_format=true&punctuate=true' + (lang==='auto' ? '&detect_language=true' : '&language=' + encodeURIComponent(lang));
  return httpsReq('POST', 'https://api.deepgram.com/v1/listen?' + q, {'Authorization':'Token ' + key, 'Content-Type':aud.mime, 'Content-Length':aud.wav.length}, aud.wav).then(function(r){
    var j = JSON.parse(r.body.toString('utf8'));
    if(r.status >= 300) throw new Error((j.err_msg || j.message || ('HTTP ' + r.status)));
    var alt = j.results.channels[0].alternatives[0];
    return (alt.words || []).map(function(w){ return {w:w.punctuated_word || w.word, s:w.start, e:w.end}; });
  });
}
function whisperTranscribe(aud, key, prov){
  var url = prov==='groq' ? 'https://api.groq.com/openai/v1/audio/transcriptions' : 'https://api.openai.com/v1/audio/transcriptions';
  var fields = {model: prov==='groq' ? 'whisper-large-v3' : 'whisper-1', response_format:'verbose_json', 'timestamp_granularities[]':['word','segment']};
  var lang = S.cap.lang; if(lang!=='auto') fields.language = lang.split('-')[0];
  if(aud.wav.length > 25*1024*1024) return Promise.reject(new Error('الملف أكبر من 25 ميجا. قص اللاير لجزء أصغر أو استخدم Deepgram.'));
  var mp = multipart(fields, aud.wav, aud.name, aud.mime);
  return httpsReq('POST', url, {'Authorization':'Bearer ' + key, 'Content-Type':mp.type, 'Content-Length':mp.body.length}, mp.body).then(function(r){
    var j = JSON.parse(r.body.toString('utf8'));
    if(r.status >= 300) throw new Error((j.error && j.error.message) || ('HTTP ' + r.status));
    if(j.words && j.words.length) return j.words.map(function(w){ return {w:String(w.word).trim(), s:w.start, e:w.end}; }).filter(function(w){ return w.w; });
    var out = [];
    (j.segments || []).forEach(function(sg){ out = out.concat(spreadWords(String(sg.text).trim(), sg.start, sg.end)); });
    return out;
  });
}
function srtTime(t){ var h=Math.floor(t/3600), m=Math.floor(t%3600/60), s=Math.floor(t%60), ms=Math.round((t-Math.floor(t))*1000); if(ms===1000){ms=0;s++;} function z(n,l){ return ('000'+n).slice(-l); } return z(h,2)+':'+z(m,2)+':'+z(s,2)+','+z(ms,3); }
function toSRT(caps){ return caps.map(function(c,i){ return (i+1) + '\r\n' + srtTime(c.s) + ' --> ' + srtTime(c.e) + '\r\n' + c.text + '\r\n'; }).join('\r\n'); }
function parseSRT(txt){
  var out = [], blocks = String(txt).replace(/\r/g,'').split(/\n\s*\n/);
  function tt(x){ var m = x.match(/(\d+):(\d+):(\d+)[,.](\d+)/); return m ? (+m[1])*3600 + (+m[2])*60 + (+m[3]) + (+m[4])/1000 : 0; }
  blocks.forEach(function(b){
    var lines = b.split('\n').filter(function(l){ return l.trim()!==''; }), ti = -1;
    for(var i=0;i<lines.length;i++) if(lines[i].indexOf('-->')>=0){ ti = i; break; }
    if(ti<0) return;
    var pr = lines[ti].split('-->'), s = tt(pr[0]), e = tt(pr[1]), text = lines.slice(ti+1).join(' ').replace(/<[^>]+>/g,'').trim();
    if(text) out = out.concat(spreadWords(text, s, e));
  });
  return out;
}
function capSide(it){
  var h = '<div class="stage" id="stage"></div>' + head(it, '');
  h += '<div class="sect">١. التفريغ</div>';
  h += '<div class="field"><span class="lbl">الخدمة</span>' + seg('cap.provider', [['local','على جهازي'],['premiere','Premiere'],['groq','Groq'],['deepgram','Deepgram'],['openai','OpenAI']], S.cap.provider) + '</div>';
  if(S.cap.provider==='local'){
    if(!ASR && NODE) ASR = HMK_MAKE_ASR({NODE:NODE});
    var stt = ASR ? ASR.status(S.cap.q || 'best') : null;
    h += '<div class="field"><span class="lbl">الدقة</span>' + seg('cap.q', [['fast','سريع'],['best','دقيق'],['egypt','عامية مصري']], S.cap.q || 'best') + '</div>';
    h += '<div class="hint okline">التفريغ بيحصل على جهازك ببلاش ومن غير حساب ولا مفتاح ولا إنترنت.' + (!stt ? '' : (!stt.exe || !stt.model) ? ' أول مرة بس البلجن هيجهّز نفسه لوحده (' + (stt.exe ? '' : 'برنامج 20 ميجا + ') + 'موديل ' + stt.mb + ' ميجا) وبعد كده بيشتغل على طول.' : ' جاهز ✓') + '</div>';
    h += '<div class="hint">«دقيق» الأحسن لأغلب الكلام. «عامية مصري» أتقل بس بيفهم المصري أحسن. «سريع» للتجربة.</div>';
  }
  if(S.cap.provider==='premiere'){
    h += '<div class="hint okline">من غير ما ينزل أي حاجة: Premiere فيه تفريغ مجاني جوّاه.<br>1) حط الفيديو في Premiere وافتح Window ← Text.<br>2) Transcribe ← اختار Arabic.<br>3) Create Captions ← وبعدين من قايمة الـ … اختار Export to SRT file.<br>4) ارجع هنا ودوس «استيراد SRT» وكمّل عادي.</div>';
  }
  if(S.cap.provider==='groq' && !S.cap.keys.groq) h += '<div class="hint okline">Groq مجاني (حوالي 8 ساعات صوت في اليوم ومن غير فيزا): 1) دوس الزرار تحت وسجّل بحساب جوجل 2) دوس Create API Key 3) انسخ المفتاح وحطه في الخانة.</div><button class="btn" id="capFreeKey">افتح صفحة المفتاح المجاني</button>';
  if(S.cap.provider==='deepgram' && !S.cap.keys.deepgram) h += '<div class="hint">Deepgram بيدي رصيد مجاني كبير أول ما تسجل، وأدق في العامية المصري.</div><button class="btn" id="capFreeKey">افتح صفحة Deepgram</button>';
  if(S.cap.provider!=='local' && S.cap.provider!=='premiere') h += '<div class="field"><label>مفتاح ' + {deepgram:'Deepgram', groq:'Groq', openai:'OpenAI'}[S.cap.provider] + ' (بيتحفظ على جهازك بس)</label><input type="password" id="capKey" dir="ltr" value="' + esc(S.cap.keys[S.cap.provider]||'') + '" placeholder="API key"></div>';
  h += '<div class="field"><label>اللغة واللهجة</label><select id="capLang">' + D.CAP_LANGS.map(function(l){ return '<option value="' + l[0] + '"' + (S.cap.lang===l[0]?' selected':'') + '>' + l[1] + '</option>'; }).join('') + '</select></div>';
  h += '<button class="btn primary" id="capGo">فرّغ اللاير المحدد</button>';
  h += '<div class="' + (CAP_STATUS ? 'hint' : 'hint') + '" id="capStatus">' + (CAP_STATUS || 'حدد لاير فيديو أو صوت في الكومب. بيتفرّغ الجزء اللي ظاهر منه بس (من In لـ Out).') + '</div>';
  h += '<div class="row"><button class="btn" id="srtIn">استيراد SRT</button><button class="btn" id="srtOut"' + (S.cap.caps.length?'':' disabled') + '>تصدير SRT</button></div>';
  h += '<div class="sect">٢. الشكل</div>';
  if(!it.maxWords) h += '<div class="field"><span class="lbl">أقصى كلمات في الكابشن</span>' + seg('cap.maxWords', [[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6']], S.cap.maxWords) + '</div>';
  h += '<div class="row">' + num('cap.size','الحجم',S.cap.size) + num('cap.y','المكان من فوق %',S.cap.y) + '</div>';
  h += '<div class="row"><div class="field"><label>لون الكلام</label><input type="color" data-k="cap.color" value="' + S.cap.color + '"></div><div class="field"><label>الخط (PostScript)</label><input type="text" data-k="cap.font" dir="ltr" placeholder="Cairo-Bold" value="' + esc(S.cap.font) + '"></div></div>';
  h += '<div class="row">' + chk('cap.shadow','ظل',S.cap.shadow) + chk('cap.stroke','إطار',S.cap.stroke) + chk('cap.box','بوكس ورا',S.cap.box) + chk('cap.upper','CAPS للإنجليزي',S.cap.upper) + chk('cap.nopunct','شيل الترقيم',S.cap.nopunct) + '</div>';
  h += '<div class="sect">' + (S.lang==='en' ? '3. Review the words' : '٣. راجع الكلام') + ' (' + S.cap.caps.length + ')</div>';
  if(S.cap.caps.length){
    h += '<div class="caplist">' + S.cap.caps.map(function(c,i){ return '<div class="capline"><span class="ct">' + fmtT(c.s) + '</span><input type="text" class="capedit" data-ci="' + i + '" dir="auto" value="' + esc(c.text) + '"></div>'; }).join('') + '</div>';
    h += '<div class="row"><button class="btn" id="capRe">قسّم تاني</button><button class="btn warn" id="capClear">امسح</button></div>';
  } else h += '<div class="pathline">لسه مفيش كابشن. المعاينة فوق بتوريك شكل الستايل.</div>';
  h += '<button class="btn primary" id="go"' + (S.cap.caps.length?'':' disabled') + '>حط الكابشن في الكومب</button>';
  h += '<div class="hint">كل كابشن بيبقى لاير تكست لوحده، كلهم مربوطين بـ Null اسمه HAMDY CAPTIONS، فتحرّكهم أو تكبّرهم مرة واحدة. Deepgram بيدعم 17 لهجة عربي منهم المصري، وGroq مجاني بس توقيت الكلمات فيه تقريبي.</div>';
  return h;
}
function openURL(u){ try{ if(window.cep && window.cep.util) window.cep.util.openURLInDefaultBrowser(u); else window.open(u); }catch(e){ window.open(u); } }
function bindCap(){
  if($('capFreeKey')) $('capFreeKey').onclick = function(){ openURL(S.cap.provider==='groq' ? 'https://console.groq.com/keys' : 'https://console.deepgram.com/signup'); };
  var k = $('capKey'); if(k) k.addEventListener('input', function(){ S.cap.keys[S.cap.provider] = k.value; save(); });
  var l = $('capLang'); if(l) l.addEventListener('change', function(){ S.cap.lang = l.value; save(); });
  if($('capGo')) $('capGo').onclick = transcribe;
  if($('srtOut')) $('srtOut').onclick = function(){ host('saveText', {text:toSRT(S.cap.caps), ext:'srt'}).then(function(r){ if(!r.ok) say(r); else if(r.data && r.data.path){ var t=$('toast'); t.className='toast ok'; t.textContent='اتحفظ ✓ ' + r.data.path; } }); };
  if($('srtIn')) $('srtIn').onclick = function(){ host('openText', {ext:'srt'}).then(function(r){ if(!r.ok){ say(r); return; } if(r.data && r.data.text){ S.cap.words = parseSRT(r.data.text); rechunk(); setCapStatus('اتستورد ' + S.cap.caps.length + ' كابشن ✓', 'okline'); renderSide(); } }); };
  if($('capRe')) $('capRe').onclick = function(){ rechunk(); renderSide(); };
  if($('capClear')) $('capClear').onclick = function(){ S.cap.words = []; S.cap.caps = []; save(); CAP_STATUS=''; renderSide(); };
  Array.prototype.forEach.call(document.querySelectorAll('.capedit'), function(inp){
    inp.addEventListener('change', function(){
      var c = S.cap.caps[+inp.dataset.ci]; if(!c) return;
      c.text = inp.value.trim(); var sp = spreadWords(c.text, c.s, c.e); c.w = sp.map(function(x){ return x.s; });
      var nw = []; S.cap.caps.forEach(function(cc){ nw = nw.concat(spreadWords(cc.text, cc.s, cc.e)); }); S.cap.words = nw;
      save(); mountThumb($('stage'), cur(), true);
    });
  });
}

/* ================================================================== sfx */
var AUD = null;
function sfxPath(it){
  if(it.path) return it.path;
  if(CEP) return (extPath() + '/sfx/' + it.id + '.wav').replace(/\\/g,'/');
  return 'sfx/' + it.id + '.wav';
}
function sfxURL(it){ return CEP ? fileURL(sfxPath(it)) : (it.path ? fileURL(it.path) : 'sfx/' + it.id + '.wav'); }
function playSfx(it){
  try{ if(AUD){ AUD.pause(); } AUD = new Audio(sfxURL(it)); AUD._id = it.id; AUD.play().catch(function(){}); }catch(e){}
}
function sfxSide(it){
  var h = '<div class="stage svgth" id="stage"></div>' + head(it, trText(it.g||'') + (it.dur ? ' · ' + it.dur.toFixed(2) + (S.lang==='en' ? ' s' : ' ثانية') : ''));
  h += '<div class="row"><button class="btn" id="sfxPlay">▶ اسمع</button><button class="btn primary" id="go">ضيف عند البلاي هيد</button></div>';
  h += '<div class="hint">الأصوات دي متولّدة بالكود جوه الكيت، يعني ملكك وتستخدمها في أي شغل من غير حقوق. ولأي صوت تاني ضيف فولدراتك من تاب المكتبة.</div>';
  h += '<div class="sect">ولّد صوت بالذكاء الاصطناعي (ElevenLabs)</div>';
  h += '<div class="field"><label>اوصف الصوت (بالإنجليزي أحسن)</label><input type="text" id="sfxPrompt" dir="ltr" placeholder="fast cinematic whoosh with deep bass" value="' + esc(S.sfx.prompt) + '"></div>';
  h += '<div class="field"><span class="lbl">المدة</span>' + seg('sfx.dur', [[1,'1s'],[2,'2s'],[3,'3s'],[5,'5s']], S.sfx.dur) + '</div>';
  h += '<div class="field"><label>مفتاح ElevenLabs</label><input type="password" id="sfxKey" dir="ltr" value="' + esc(S.sfx.key) + '" placeholder="API key"></div>';
  h += '<button class="btn" id="sfxGen">ولّد وضيف</button>';
  return h;
}
function bindSfx(){
  var it = cur();
  if($('sfxPlay')) $('sfxPlay').onclick = function(){ playSfx(it); };
  var pk = $('sfxPrompt'); if(pk) pk.addEventListener('input', function(){ S.sfx.prompt = pk.value; save(); });
  var kk = $('sfxKey'); if(kk) kk.addEventListener('input', function(){ S.sfx.key = kk.value; save(); });
  if($('sfxGen')) $('sfxGen').onclick = genSfx;
}
function genSfx(){
  if(!nodeOK()){ say({ok:false, code:'NO_NODE'}); return; }
  if(!S.sfx.key.trim()){ say({ok:false, code:'NO_KEY'}); return; }
  if(!S.sfx.prompt.trim()){ var t0=$('toast'); t0.className='toast bad'; t0.textContent='اكتب وصف الصوت الأول.'; return; }
  var t=$('toast'); t.className='toast info'; t.textContent='بولّد الصوت...';
  var body = JSON.stringify({text:S.sfx.prompt, duration_seconds:S.sfx.dur, prompt_influence:0.4});
  httpsReq('POST', 'https://api.elevenlabs.io/v1/sound-generation', {'xi-api-key':S.sfx.key.trim(), 'Content-Type':'application/json', 'Accept':'audio/mpeg', 'Content-Length':NODE('buffer').Buffer.byteLength(body)}, body).then(function(r){
    if(r.status >= 300){ var m = r.body.toString('utf8'); throw new Error(m.slice(0,160)); }
    var fs = NODE('fs'), path = NODE('path'), dir = S.lib.paths[0] || path.join(NODE('os').homedir(), 'Documents', 'HAMDY SFX');
    try{ fs.mkdirSync(dir, {recursive:true}); }catch(e){}
    var name = S.sfx.prompt.replace(/[^\w\- ]+/g,'').trim().slice(0,40).replace(/\s+/g,'_') || 'sfx';
    var file = path.join(dir, 'NABD_' + name + '_' + Date.now().toString(36) + '.mp3');
    fs.writeFileSync(file, r.body);
    var item = {id:'gen_' + Date.now().toString(36), ar:S.sfx.prompt.slice(0,40), en:'AI', g:'متولّد', path:file, pk:[]};
    S.sfx.gen.push(item); S.sel.sfx = item.id; save();
    return host('libUse', {path:file, fit:false, screen:false}).then(function(res){ renderAll(); say(res); playSfx(item); });
  }).catch(function(e){ var t2=$('toast'); t2.className='toast bad'; t2.textContent='حصل خطأ: ' + (e && e.message || e); });
}



/* ================================================================ lines tab */
var LN_COLS = [['accW','لونك + أبيض'],['accK','لونك + أسود'],['acc','لونك بس'],['W','أبيض'],['K','أسود']];
function lnColors(){
  var a = S.acc;
  switch(S.ln.col){ case 'accK': return [a, '#111111']; case 'acc': return [a, a]; case 'W': return ['#ffffff', a]; case 'K': return ['#111111', a]; }
  return [a, '#ffffff'];
}
var MY_PATH = [
  {id:'myText',   ar:'نص على خطك',        en:'Text on Your Path',   g:'خطك انت', mode:'mine', mine:'text',   pv:{id:'tpS', mode:'path'}},
  {id:'myFollow', ar:'لاير يمشي على خطك',  en:'Layer Follows Path',  g:'خطك انت', mode:'mine', mine:'follow', pv:{id:'lpInfinity', mode:'travel'}},
  {id:'myDraw',   ar:'خطك يترسم',          en:'Draw Your Path',      g:'خطك انت', mode:'mine', mine:'draw',   pv:{id:'elScribble', mode:'draw'}},
  {id:'myComet',  ar:'مذنب على خطك',       en:'Comet on Your Path',  g:'خطك انت', mode:'mine', mine:'comet',  pv:{id:'lpWave', mode:'travel'}}
];
function travelCtl(){
  if(S.ln.flow === 'static') return '<div class="row">' + num('ln.pStart','مكانه على الخط %',S.ln.pStart) + '</div>';
  if(S.ln.flow !== 'travel') return '';
  var h = '<div class="row">' + num('ln.pStart','يبدأ من %',S.ln.pStart) + (S.ln.pPause ? '' : num('ln.pEnd', 'يقف عند %',S.ln.pEnd)) + '</div>' +
    '<div class="row">' + num('ln.pFrames', S.ln.pPause ? 'يوصل للوقفة بعد (فريمات)' : 'يوصل بعد (فريمات)',S.ln.pFrames) + num('ln.pDelay','يستنى قبلها (فريمات)',S.ln.pDelay) + '</div>' +
    chk('ln.pPause', 'يقف في النص شوية وبعدين يكمّل', S.ln.pPause);
  if(S.ln.pPause) h += '<div class="row">' + num('ln.pMid','يقف عند %',S.ln.pMid) + num('ln.pHold','يفضل واقف (فريمات)',S.ln.pHold) + '</div>' +
    '<div class="row">' + num('ln.pFrames2','يكمّل ويخرج في (فريمات)',S.ln.pFrames2) + '</div>' +
    '<div class="hint" id="lnMirror">' + trText('بيخرج من الناحية التانية بنفس المسافة: بيخلص عند') + ' <b>' + (2*(+S.ln.pMid||0) - (+S.ln.pStart||0)) + '%</b>. ' + trText('عشان يدخل ويخرج من برا الشاشة خلّي البداية بالسالب، مثلاً -40 والوقفة 50 → يخرج عند 140.') + '</div>';
  return h +
    '<div class="hint">0% أول الخط و100% آخره. الكلمة بتمشي وبعدين تقف ثابتة، واللاير بيكمّل لآخر الكومب وانت اقطعه زي ما تحب. التوقيت بينزل ماركرز على اللاير (HAMDY PATH START / STOP / GO / END): اسحبهم في التايملاين والحركة تتظبط معاهم. والأماكن (%) تقدر تغيّرها من Effect Controls.</div>';
}
function mineSide(it){
  var h = '<div class="stage" id="stage"></div>' + head(it, it.g);
  h += '<div class="hint">ارسم الخط بنفسك: من غير ما تحدد أي لاير، خد أداة الـ Pen (حرف G) وارسم في الكومب، هيتعمل شيب لاير فيه الخط. أو ارسم ماسك على أي لاير. وبعدين حدد اللاير ده ودوس.</div>';
  if(it.mine==='text'){
    h += '<div class="field"><label>الكلام</label><textarea id="lnText" dir="auto">' + esc(S.ln.text) + '</textarea></div>';
    h += '<div class="field"><span class="lbl">الحركة</span>' + seg('ln.flow', [['travel','يمشي من أول الخط لآخره'],['loop','يلف على طول'],['static','ثابت']], S.ln.flow) + '</div>';
    h += '<div class="row">' + num('ln.size','الحجم',S.ln.size) + (S.ln.flow==='travel' ? '' : num('ln.secs','ثواني',S.ln.secs)) + '</div>' + travelCtl() + chk('ln.reverse', 'اعكس الاتجاه', S.ln.reverse);
    h += '<div class="hint">لو عدّلت الخط بعدين (حركت نقطه)، النص بيمشي على الشكل الجديد لوحده.</div>';
  } else if(it.mine==='follow'){
    h += '<div class="hint">حدد اللاير اللي فيه الخط + اللاير (أو اللايرات) اللي عايزها تمشي عليه.</div>';
    h += '<div class="field"><span class="lbl">الحركة</span>' + seg('ln.flow', [['travel','من الأول للآخر'],['loop','تلف على طول']], S.ln.flow==='static' ? 'travel' : S.ln.flow) + '</div>';
    h += chk('ln.orient', 'تلف مع اتجاه الخط', S.ln.orient !== false);
  } else {
    h += '<div class="field"><span class="lbl">سرعة الرسم (فريمات)</span>' + seg('ln.frames', [[10,'10'],[14,'14'],[20,'20'],[26,'26'],[34,'34'],[48,'48']], S.ln.frames) + '</div>';
    h += '<div class="field"><span class="lbl">التخانة (لو الخط ماسك)</span>' + seg('ln.width', [[50,'رفيع'],[100,'عادي'],[200,'تخين']], S.ln.width) + '</div>';
  }
  h += '<button class="btn primary" id="go">طبّق على خطك</button>';
  return h;
}
function mineApply(it){
  var l = S.ln, c1 = hexRGB(lnColors()[0]).concat([1]);
  switch(it.mine){
    case 'text': return host('myPathText', {text:l.text, size:l.size, secs:l.secs, flow:l.flow, speed:l.speed, reverse:l.reverse, font:S.tx.font, pStart:+l.pStart||0, pEnd:(l.pEnd===''||l.pEnd==null)?100:+l.pEnd, pFrames:+l.pFrames||45, pDelay:+l.pDelay||0, pPause:!!l.pPause, pMid:+l.pMid||0, pHold:+l.pHold||0, pFrames2:+l.pFrames2||30});
    case 'follow': return host('myPathFollow', {flow:l.flow==='static' ? 'travel' : l.flow, orient:l.orient !== false, speed:25});
    case 'draw': return host('myPathDraw', {style:'draw', frames:l.frames, width:Math.round(6*l.width/100), strokeColor:c1, addStroke:false, snappy:true});
    case 'comet': return host('myPathDraw', {style:'travel', seg:25, speed:100, frames:l.frames, width:Math.round(6*l.width/100), strokeColor:c1});
  }
}
function lineSide(it){
  if(it.mine) return mineSide(it);
  var h = '<div class="stage" id="stage"></div>' + head(it, it.g), m = it.mode;
  if(m==='path'){
    h += '<div class="field"><label>الكلام</label><textarea id="lnText" dir="auto">' + esc(S.ln.text) + '</textarea></div>';
    h += '<div class="field"><span class="lbl">الحركة</span>' + seg('ln.flow', [['travel','يمشي من أول الخط لآخره'],['loop','يلف على طول'],['static','ثابت على الخط']], S.ln.flow) + '</div>';
    h += '<div class="row">' + num('ln.size','الحجم',S.ln.size) + (S.ln.flow==='travel' ? '' : num('ln.secs','ثواني',S.ln.secs)) + (S.ln.flow==='loop' ? num('ln.speed','السرعة',S.ln.speed) : '') + '</div>' + travelCtl();
    h += '<div class="row">' + chk('ln.guide', 'ارسم الخط نفسه', S.ln.guide) + chk('ln.reverse', 'اعكس اتجاه المسار', S.ln.reverse) + '</div>';
    h += '<div class="field"><span class="lbl">لون الخط</span>' + seg('ln.col', LN_COLS, S.ln.col) + '</div>';
    h += '<button class="btn primary" id="go">اعمل نص جديد على المسار</button>';
    h += '<button class="btn" id="lnSel">حط التكست المحدد على المسار</button>';
    h += '<div class="hint">المسار بينزل كماسك اسمه HAMDY PATH على لاير النص: تقدر تسحب نقطه وتعدّل شكله براحتك والكلام والخط المرسوم بيمشوا عليه. السرعة ومكان النص من صفحة التعديل (HAMDY PATH).</div>';
    return h;
  }
  if(m==='cover') h += '<div class="field"><span class="lbl">المدة (فريمات)</span>' + seg('ln.frames', [[14,'14'],[18,'18'],[20,'20'],[24,'24'],[30,'30'],[40,'40']], S.ln.frames) + '</div>';
  if(m==='draw' || m==='attach') h += '<div class="field"><span class="lbl">سرعة الرسم (فريمات)</span>' + seg('ln.frames', [[10,'10'],[14,'14'],[20,'20'],[26,'26'],[34,'34']], S.ln.frames) + '</div>';
  if(m==='travel') h += '<div class="field"><span class="lbl">السرعة</span>' + seg('ln.speed', [[50,'هادي'],[100,'عادي'],[170,'سريع'],[260,'سريع جداً']], S.ln.speed) + '</div>';
  h += '<div class="field"><span class="lbl">الألوان</span>' + seg('ln.col', LN_COLS, S.ln.col) + '</div>';
  h += '<div class="field"><span class="lbl">التخانة</span>' + seg('ln.width', [[50,'رفيع'],[75,'75%'],[100,'عادي'],[140,'تخين'],[200,'تخين جداً']], S.ln.width) + '</div>';
  if(m==='draw' || m==='travel') h += '<div class="row">' + num('ln.secs','المدة (ثواني)',S.ln.secs) + '</div>';
  if(m==='draw' || m==='attach') h += chk('ln.erase', 'يتمسح في الآخر', S.ln.erase);
  if(m==='attach') h += '<div class="field"><span class="lbl">يبدأ</span>' + seg('ln.at', [['layer','مع أول اللاير'],['playhead','عند البلاي هيد']], S.ln.at) + '</div>';
  if(m==='cover') h += '<div class="row">' + chk('ln.snappy', 'سريع وحاد', S.ln.snappy) + chk('ln.sfx', 'صوت ووش', S.ln.sfx) + '</div>';
  h += '<button class="btn primary" id="go">' + ({cover:'حط الترانزيشن', draw:'ضيف عند البلاي هيد', travel:'ضيف عند البلاي هيد', attach:'طبّق على اللايرات المحددة'})[m] + '</button>';
  h += '<div class="hint">' + ({
    cover:'حط البلاي هيد على القطع أو حدد الكليبين. الخطوط بتغطي الكادر وتكشف المشهد الجديد.',
    draw:'الخطوط شيب لاير حقيقي، والألوان والتخانة والتوقيت كلهم يتعدلوا من صفحة التعديل (HAMDY LINE).',
    travel:'لوب بيلف على طول اللاير. السرعة وطول الخط يتعدلوا من صفحة التعديل.',
    attach:'الخط بيتربط باللاير وبيكبر ويصغر مع الكلام لوحده، ولو حطيت حركة على اللاير بيتحرك معاه.'
  })[m] + '</div>';
  return h;
}
function lineApply(it, selected){
  if(it.mine) return mineApply(it);
  var lc = lnColors().map(hexRGB), base = {kind:it.id, label:it.en, colors:lc, width:S.ln.width};
  switch(it.mode){
    case 'cover': base.mode = 'cover'; base.frames = S.ln.frames; base.snappy = S.ln.snappy; base.sfx = S.ln.sfx ? sfxPath({id:'whoosh_fast'}) : null; return host('lineFx', base);
    case 'draw': base.mode = 'draw'; base.frames = S.ln.frames; base.secs = S.ln.secs; base.erase = S.ln.erase; return host('lineFx', base);
    case 'travel': base.mode = 'travel'; base.secs = S.ln.secs; base.speed = S.ln.speed; return host('lineFx', base);
    case 'attach': base.frames = S.ln.frames; base.erase = S.ln.erase; base.at = S.ln.at; return host('lineAttach', base);
    case 'path': return host('textPath', {kind:it.id, mode:selected ? 'selected' : 'new', text:S.ln.text, size:S.ln.size, secs:S.ln.secs, font:S.tx.font, flow:S.ln.flow, speed:S.ln.speed, guide:S.ln.guide, reverse:S.ln.reverse, colors:lc, pStart:+S.ln.pStart||0, pEnd:(S.ln.pEnd===''||S.ln.pEnd==null)?100:+S.ln.pEnd, pFrames:+S.ln.pFrames||45, pDelay:+S.ln.pDelay||0, pPause:!!S.ln.pPause, pMid:+S.ln.pMid||0, pHold:+S.ln.pHold||0, pFrames2:+S.ln.pFrames2||30});
  }
}

/* ============================================================== carousel tab */
var CAR_DESIGNS = {
  clean:{ar:'نضيف', round:12, border:0},
  polaroid:{ar:'بولارويد', round:3, border:10, borderColor:'#ffffff'},
  neon:{ar:'نيون', round:14, border:4, borderColor:'acc', lineStyle:'glow', orbit:true, lineColor:'acc'},
  soft:{ar:'ناعم مدوّر', round:45, border:0},
  film:{ar:'فيلم', round:2, border:8, borderColor:'#111111'},
  circle:{ar:'دواير', round:100, border:3, borderColor:'#ffffff', aspect:1}
};
function carHex(v){ return v==='acc' ? S.acc : v; }
function carImgURL(p){ return p ? (CEP ? fileURL(p) : p) : null; }
function carOpts(big){
  var c = S.car;
  return {count:big ? c.count : Math.min(c.count, 10), content:c.content, images:c.images.map(carImgURL), palette:c.palette, colA:carHex(c.colA), colB:carHex(c.colB), aspect:c.aspect, round:c.round, border:c.border, borderColor:carHex(c.borderColor),
    motion:c.motion, speed:c.speed, reverse:c.reverse, hold:c.hold, tiltX:c.tiltX, backFade:c.backFade, backDim:c.backDim, blur:c.blur, orbit:c.orbit, spokes:c.spokes, chain:c.chain, lineStyle:c.lineStyle, lineColor:carHex(c.lineColor), intro:c.intro, size:c.size, radius:c.radius, face:c.face};
}
function carArgs(it){
  var c = S.car;
  return {shp:it.shp, count:c.count, secs:c.secs, motion:c.motion, speed:c.speed, reverse:c.reverse, hold:c.hold, content:c.content, images:c.images.filter(function(x){ return x !== undefined; }).length ? c.images.map(function(x){ return x || null; }) : [],
    aspect:c.aspect, round:c.round, border:c.border, borderColor:hexRGB(carHex(c.borderColor)), tiltX:c.tiltX, backFade:c.backFade, backDim:c.backDim, blur:c.blur ? 6 : 0,
    palette:c.palette, colA:hexRGB(carHex(c.colA)), colB:hexRGB(carHex(c.colB)), lineColor:hexRGB(carHex(c.lineColor)), orbit:c.orbit, spokes:c.spokes, chain:c.chain, lineStyle:c.lineStyle,
    intro:c.intro, person:c.person, rows:it.rows || 2, turns:it.turns || 2, size:c.size, radius:c.radius, face:c.face};
}
function carSide(it){
  var c = S.car, h = '<div class="stage" id="stage"></div>' + head(it, it.d);
  h += '<div class="field"><span class="lbl">المحتوى</span>' + seg('car.content', [['images','صور'],['colors','ألوان'],['mixed','صور + ألوان']], c.content) + '</div>';
  h += '<div class="row">' + num('car.count','عدد الكروت',c.count) + num('car.secs','المدة (ثواني)',c.secs) + '</div>';
  if(c.content !== 'colors'){
    h += '<div class="field"><span class="lbl">الصور (دوس على أي خانة تحط فيها صورة أو فيديو)</span><div class="slots" id="carSlots"></div></div>';
    h += '<div class="row"><button class="btn" id="carPickAll">+ اختار صور كتير</button><button class="btn" id="carClear">امسح الصور</button></div>';
    if(c.content==='images') h += '<div class="hint">لو الصور أقل من عدد الكروت بتتكرر. في "صور + ألوان" الخانات الفاضية بتبقى ألوان.</div>';
  }
  if(c.content !== 'images'){
    h += '<div class="field"><span class="lbl">ألوان الكروت</span>' + seg('car.palette', [[0,'تدرج'],[1,'متبادل'],[2,'قوس قزح'],[3,'لون واحد']], c.palette) + '</div>';
    h += '<div class="row"><div class="field"><label>لون 1</label><input type="color" data-k="car.colA" value="' + carHex(c.colA) + '"></div><div class="field"><label>لون 2</label><input type="color" data-k="car.colB" value="' + carHex(c.colB) + '"></div></div>';
  }
  h += '<div class="field"><span class="lbl">الديزاين</span><div class="seg" id="carDesign">' + Object.keys(CAR_DESIGNS).map(function(k){ return '<button data-v="' + k + '" class="' + (c.design===k?'on':'') + '">' + CAR_DESIGNS[k].ar + '</button>'; }).join('') + '</div></div>';
  h += '<div class="field"><span class="lbl">شكل الكارت</span>' + seg('car.aspect', [[1,'مربع'],[0.8,'4:5'],[0.75,'3:4'],[0.5625,'9:16'],[1.7778,'16:9']], c.aspect) + '</div>';
  h += '<div class="field"><span class="lbl">الحركة</span>' + seg('car.motion', [[0,'لف مستمر'],[1,'يقف على كل صورة'],[2,'رايح جاي'],[4,'يلف ويقف'],[3,'يدوي']], c.motion) + '</div>';
  h += '<div class="field"><span class="lbl">السرعة</span>' + seg('car.speed', [[12,'هادية'],[30,'عادية'],[60,'سريعة'],[120,'سريعة جداً']], c.speed) + '</div>';
  h += '<div class="field"><span class="lbl">الميل</span>' + seg('car.tiltX', [[0,'من غير'],[-12,'خفيف'],[-25,'متوسط'],[-40,'كتير'],[15,'من تحت']], c.tiltX) + '</div>';
  h += '<div class="field"><span class="lbl">الكروت بتبص</span>' + seg('car.face', [[0,'لبرة'],[1,'قدام دايماً'],[2,'للكاميرا']], c.face) + '</div>';
  h += '<div class="row">' + seg('car.size', [[70,'كروت صغيرة'],[100,'عادي'],[140,'كبيرة']], c.size) + '</div>';
  h += '<div class="field"><span class="lbl">العمق</span>' + seg('car.backFade', [[0,'من غير'],[35,'اللي ورا باهت'],[70,'باهت جداً']], c.backFade) + '</div>';
  h += '<div class="row">' + chk('car.blur', 'بلور للي ورا', c.blur) + chk('car.reverse', 'عكس الاتجاه', c.reverse) + chk('car.intro', 'يتفرد من النص', c.intro) + '</div>';
  h += '<div class="field"><span class="lbl">الخطوط</span><div class="row">' + chk('car.orbit', 'خط المدار', c.orbit) + chk('car.spokes', 'خطوط للمركز', c.spokes) + chk('car.chain', 'خط بيوصل الكروت', c.chain) + '</div></div>';
  h += '<div class="row">' + seg('car.lineStyle', [['solid','خط عادي'],['dashed','متقطع'],['glow','متوهج']], c.lineStyle) + '<div class="field"><label>لون الخطوط</label><input type="color" data-k="car.lineColor" value="' + carHex(c.lineColor) + '"></div></div>';
  h += chk('car.person', 'يلف حوالين اللاير المحدد (شخص مقصوص)', c.person);
  h += '<button class="btn primary" id="go">اعمل الكاروسيل</button>';
  h += '<button class="btn" id="carSwap">بدّل صورة الكارت المحدد في After Effects</button>';
  h += '<div class="hint">كل حاجة بتتعدل بعدين من صفحة التعديل (HAMDY CAROUSEL): الشكل نفسه (Shape من 0 لـ 16)، الحركة، السرعة، نص القطر، المسافات، الميل، الأركان، الإطار، الألوان، والخطوط. ولو عايز الكروت تلف حوالين شخص: اقطعه في لاير لوحده (Roto Brush)، حدده، وعلّم على الاختيار اللي فوق.</div>';
  return h;
}
function renderCarSlots(){
  var box = $('carSlots'); if(!box) return;
  var c = S.car, h = '';
  for(var i=0;i<c.count;i++){
    var p = c.images[i], u = carImgURL(p), isVid = p && /\.(mp4|mov|m4v)$/i.test(p);
    h += '<div class="slot' + (p ? ' has' : '') + '" data-slot="' + i + '"' + (p && !isVid ? ' style="background-image:url(\'' + String(u).replace(/'/g, "\\'") + '\')"' : '') + '><b>' + (i+1) + '</b>' + (isVid ? '▶' : (p ? '' : '+')) + (p ? '<i data-rmslot="' + i + '">×</i>' : '') + '</div>';
  }
  box.innerHTML = h;
  Array.prototype.forEach.call(box.querySelectorAll('[data-slot]'), function(sl){
    sl.onclick = function(ev){
      var i = +sl.dataset.slot;
      if(ev.target && ev.target.dataset && ev.target.dataset.rmslot !== undefined){ S.car.images[i] = null; trimImgs(); save(); renderCarSlots(); mountThumb($('stage'), cur(), true); return; }
      host('carPick', {multi:false}).then(function(r){
        if(r.code==='MOCK'){ say(r); return; }
        if(r.ok && r.data.paths.length){ S.car.images[i] = r.data.paths[0]; save(); renderCarSlots(); mountThumb($('stage'), cur(), true); }
      });
    };
  });
}
function trimImgs(){ var a = S.car.images; while(a.length && !a[a.length-1]) a.pop(); }
function bindCar(){
  renderCarSlots();
  if($('carPickAll')) $('carPickAll').onclick = function(){
    host('carPick', {multi:true}).then(function(r){
      if(r.code==='MOCK'){ say(r); return; }
      if(r.ok && r.data.paths.length){
        var ps = r.data.paths, imgs = S.car.images, k = 0, i;
        for(i=0; i<Math.max(S.car.count, imgs.length) && k<ps.length; i++){ if(!imgs[i]) imgs[i] = ps[k++]; }
        while(k < ps.length) imgs.push(ps[k++]);
        if(imgs.length > S.car.count) S.car.count = Math.min(40, imgs.length);
        save(); renderSide(); renderGrid();
      }
    });
  };
  if($('carClear')) $('carClear').onclick = function(){ S.car.images = []; save(); renderSide(); renderGrid(); };
  if($('carSwap')) $('carSwap').onclick = function(){
    host('carPick', {multi:false}).then(function(r){
      if(r.code==='MOCK'){ say(r); return; }
      if(r.ok && r.data.paths.length) host('carSwap', {path:r.data.paths[0]}).then(say);
    });
  };
  var dg = $('carDesign');
  if(dg) Array.prototype.forEach.call(dg.children, function(b){ b.onclick = function(){
    var d = CAR_DESIGNS[b.dataset.v]; S.car.design = b.dataset.v;
    ['round','border','borderColor','lineStyle','orbit','lineColor','aspect'].forEach(function(k){ if(d[k] !== undefined) S.car[k] = d[k]; });
    if(d.border === 0) S.car.border = 0;
    save(); renderSide(); renderGrid();
  }; });
}

/* ============================================================== tracking tab */
var TRK_INFO = null;
function trkSide(it){
  var t = S.trk, h = '<div class="stage" id="stage"></div>' + head(it, it.d);
  if(/^1/.test(it.g)){
    h += '<div class="hint">الخطوات: 1) حدد لاير الفيديو 2) دوس الزرار 3) في بانل Tracker حط المربع على حاجة واضحة ودوس ▶ Analyze Forward 4) ارجع هنا واختار حاجة من "استخدم التراك".</div>';
    h += '<button class="btn primary" id="go">ابدأ</button>';
    return h;
  }
  h += '<div class="field"><span class="lbl">التراك اللي اتقرا</span><div class="pathline" id="trkInfo">' + trkInfoHTML() + '</div></div><button class="btn" id="trkRead">اقرأ التراك من الفيديو المحدد</button>';
  switch(it.id){
    case 'tNull':
      h += '<div class="field"><span class="lbl">تنعيم الحركة</span>' + seg('trk.smooth', [[0,'من غير'],[1,'خفيف'],[3,'متوسط'],[6,'كتير']], t.smooth) + '</div>';
      h += '<div class="row">' + chk('trk.rot', 'خد اللف', t.rot) + chk('trk.scale', 'خد الحجم', t.scale) + '</div>';
      h += '<div class="hint">لو حددت لايرات تانية مع الفيديو هتتربط بالنل على طول.</div>'; break;
    case 'tText': case 'tCall':
      h += '<div class="field"><label>الكلام</label><input type="text" data-k="trk.text" dir="auto" value="' + esc(t.text) + '"></div>';
      h += '<div class="row">' + num('trk.size','الحجم',t.size) + (it.id==='tCall' ? '<div class="field"><span class="lbl">الناحية</span>' + seg('trk.side', [['r','يمين'],['l','شمال']], t.side) + '</div>' : '') + '</div>'; break;
    case 'tBlur': case 'tPixel': case 'tDark':
      h += '<div class="field"><span class="lbl">القوة</span>' + seg('trk.amount', [[20,'خفيف'],[40,'متوسط'],[70,'قوي'],[100,'قوي جداً']], t.amount) + '</div>';
      h += '<div class="hint">المقاس والقوة بيتعدلوا بعدين من صفحة التعديل (HAMDY TRK Width / Height / Amount).</div>'; break;
    case 'tPin': h += chk('trk.swap', 'الصورة مقلوبة؟ بدّل الركنين اللي تحت', t.swap); break;
    case 'tStabUse':
      h += chk('trk.stabRot', 'ثبّت اللف كمان (لو التراك بنقطتين)', t.stabRot);
      h += '<div class="field"><span class="lbl">زووم يداري الأطراف</span>' + seg('trk.zoom', [[0,'0%'],[6,'6%'],[12,'12%'],[20,'20%']], t.zoom) + '</div>'; break;
  }
  h += '<button class="btn primary" id="go">' + ({tAttach:'اربط المحدد', tBake:'حوّل المحدد لكي فريمز'}[it.id] || 'نفّذ') + '</button>';
  return h;
}
function trkInfoHTML(){
  if(!TRK_INFO) return 'لسه مقريتش. حدد لاير الفيديو ودوس "اقرأ".';
  if(!TRK_INFO.trackers.length) return 'مفيش تراك على "' + esc(TRK_INFO.layer || '—') + '"' + (TRK_INFO.nulls.length ? ' · نلات التراك: ' + TRK_INFO.nulls.length : '');
  return TRK_INFO.trackers.map(function(tr){ return '📍 ' + esc(tr.name) + ': ' + tr.points.map(function(p){ return esc(p.name) + (p.keys ? ' ✓' + p.keys : ' (فاضي)'); }).join('، '); }).join('<br>') + (TRK_INFO.nulls.length ? '<br>نلات التراك: ' + TRK_INFO.nulls.length : '');
}
function bindTrk(){
  if($('trkRead')) $('trkRead').onclick = function(){ host('trkInfo').then(function(r){ if(r.ok){ TRK_INFO = r.data; $('trkInfo').innerHTML = trkInfoHTML(); } else say(r); }); };
}
function trkApply(it){
  var t = S.trk;
  if(it.kind) return host('trkStart', {kind:it.kind});
  switch(it.id){
    case 'tNull': return host('trkNull', {smooth:t.smooth, rot:t.rot, scale:t.scale});
    case 'tAttach': return host('trkAttach', {});
    case 'tText': return host('trkText', {text:t.text, size:t.size, font:S.tx.font, acc:hexRGB(S.acc)});
    case 'tCall': return host('trkText', {text:t.text, size:t.size, font:S.tx.font, style:'callout', side:t.side, acc:hexRGB(S.acc)});
    case 'tBlur': case 'tPixel': case 'tDark': return host('trkCover', {style:it.style, amount:t.amount});
    case 'tPin': return host('trkPin', {swap:t.swap});
    case 'tStabUse': return host('trkStab', {rot:t.stabRot, zoom:t.zoom});
    case 'tBake': return host('trkBake', {});
  }
}

/* ============================================================== trim tab */
function trimItem(it){ var o = {}; for(var k in it) o[k] = it[k]; ['addStroke','fillAfter','strokeFade'].forEach(function(k){ if(S.trim[k]) o[k] = true; }); return o; }
function trimSide(it){
  var t = S.trim, h = '<div class="stage" id="stage"></div>' + head(it, it.g);
  h += '<div class="field"><span class="lbl">المدة (فريمات)</span>' + seg('trim.frames', [[12,'12'],[18,'18'],[24,'24'],[36,'36'],[48,'48'],[72,'72']], t.frames) + '</div>';
  h += '<div class="field"><span class="lbl">بين كل لاير والتاني</span>' + seg('trim.stagger', [[0,'مع بعض'],[3,'3 فريم'],[6,'6'],[10,'10']], t.stagger) + '</div>';
  if(it.style==='travel') h += '<div class="field"><span class="lbl">طول الخط الماشي</span>' + seg('trim.seg', [[10,'قصير'],[25,'متوسط'],[50,'طويل']], t.seg) + '</div><div class="field"><span class="lbl">السرعة</span>' + seg('trim.speed', [[50,'هادي'],[100,'عادي'],[200,'سريع']], t.speed) + '</div>';
  if(!it.addStroke) h += chk('trim.addStroke', 'ضيف Stroke للأشكال اللي ملهاش (لوجو أو نص متحوّل)', t.addStroke);
  if(it.addStroke || t.addStroke) h += '<div class="field"><span class="lbl">تخانة الـ Stroke</span>' + seg('trim.width', [[2,'2'],[4,'4'],[8,'8'],[14,'14']], t.width) + '</div><div class="field"><span class="lbl">لون الـ Stroke</span>' + seg('trim.stroke', [['fill','لون الشكل'],['white','أبيض'],['acc','لونك']], t.stroke) + '</div>';
  if(!it.fillAfter) h += chk('trim.fillAfter', 'الـ Fill يظهر بعد ما الرسم يخلص', t.fillAfter);
  if(!it.strokeFade && (it.fillAfter || t.fillAfter)) h += chk('trim.strokeFade', 'الـ Stroke يختفي لما الـ Fill يظهر', t.strokeFade);
  h += '<div class="row">' + chk('trim.snappy', 'سريع وحاد', t.snappy) + '</div>';
  h += '<div class="field"><span class="lbl">يبدأ</span>' + seg('trim.at', [['layer','مع أول اللاير'],['playhead','عند البلاي هيد']], t.at) + '</div>';
  h += '<button class="btn primary" id="go">طبّق على المحدد</button>';
  h += '<div class="hint">حدد شيب لاير أو أكتر، أو نص (بيتحوّل لشيب لوحده)، أو ملف Illustrator/SVG. بيتحط Trim Paths واحد على اللاير كله، والتحكم في البداية والنهاية والإزاحة من صفحة التعديل (HAMDY TRIM).</div>';
  return h;
}
function trimArgs(it){
  var t = S.trim, sc = t.stroke==='white' ? [1,1,1,1] : (t.stroke==='acc' ? hexRGB(S.acc).concat([1]) : null);
  return {style:it.style, frames:t.frames, stagger:t.stagger, individual:!!it.individual, addStroke:!!(it.addStroke || t.addStroke), fillAfter:!!(it.fillAfter || t.fillAfter), strokeFade:!!(it.strokeFade || t.strokeFade),
          width:t.width, strokeColor:sc, snappy:t.snappy, at:t.at, seg:t.seg, speed:t.speed};
}

/* ============================================================ depth 3D tab */
/* ===================================================== endless background */
var BG_DIRS = [
  {id:'bgLeft',  ar:'يمشي شمال',       en:'Scroll Left',  g:'أفقي وطولي', ang:180},
  {id:'bgRight', ar:'يمشي يمين',       en:'Scroll Right', g:'أفقي وطولي', ang:0},
  {id:'bgUp',    ar:'يطلع لفوق',       en:'Scroll Up',    g:'أفقي وطولي', ang:270},
  {id:'bgDown',  ar:'ينزل لتحت',       en:'Scroll Down',  g:'أفقي وطولي', ang:90},
  {id:'bgUR',    ar:'مايل فوق يمين',   en:'Diagonal ↗',   g:'مايل', ang:315},
  {id:'bgDR',    ar:'مايل تحت يمين',   en:'Diagonal ↘',   g:'مايل', ang:45},
  {id:'bgDL',    ar:'مايل تحت شمال',   en:'Diagonal ↙',   g:'مايل', ang:135},
  {id:'bgUL',    ar:'مايل فوق شمال',   en:'Diagonal ↖',   g:'مايل', ang:225}
];
var BG_PAT = 'url("data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#1c1c22"/><circle cx="20" cy="20" r="9" fill="#b0101c"/><rect x="48" y="46" width="18" height="18" rx="4" fill="#ececf1" opacity=".85"/><path d="M8 66 L22 52 L36 66" stroke="#e0303c" stroke-width="4" fill="none"/><circle cx="62" cy="16" r="4" fill="#ececf1" opacity=".5"/></svg>') + '")';
function mountBg(box){
  box.innerHTML = '<div class="bgscroll" style="position:absolute;inset:0;background-size:40px 40px"></div>';
  box.firstChild.style.backgroundImage = BG_PAT;
  return {pat:box.firstChild};
}
function drawBg(el, it, t){
  var a = it.ang * Math.PI/180, sp = (+S.bg.speed || 100) * 0.12;
  el.pat.style.backgroundPosition = (Math.cos(a)*sp*t).toFixed(1) + 'px ' + (Math.sin(a)*sp*t).toFixed(1) + 'px';
}
function bgSide(it){
  var h = '<div class="stage" id="stage"></div>' + head(it, 'الصورة بتتكرر جنب نفسها وتفضل ماشية في الاتجاه ده لآخر الكومب من غير ما تخلص.');
  h += '<div class="field"><span class="lbl">السرعة</span>' + seg('bg.speed', [[40,'بطيء'],[100,'عادي'],[220,'سريع'],[400,'سريع جداً']], +S.bg.speed || 100) + '</div>';
  h += chk('bg.mirror', 'مرايا عند الأطراف (لو أطراف الصورة مش بتركب على بعض)', !!S.bg.mirror);
  h += '<button class="btn primary" id="go">طبّق على اللاير المحدد</button>';
  h += '<div class="hint">حدد لاير الخلفية (صورة أو فيديو) ودوس طبّق. بينزل عليه إفكت Motion Tile اسمه HAMDY BG Scroll، وسلايدر HAMDY BG Speed للسرعة (بكسل في الثانية) وHAMDY BG Angle للاتجاه، تقدر تغيّرهم بعدين. لو الصورة صورة ثابتة اللاير بيتمد لآخر الكومب.</div>';
  return h;
}
function dpSide(it){
  var d = S.dp, h = '<div class="stage" id="stage"></div>' + head(it, it.d);
  h += '<div class="field"><span class="lbl">ترتيب الطبقات (الأول = الأقرب)</span>' + seg('dp.order', [['stack','زي التايملاين'],['reverse','بالعكس'],['random','عشوائي']], d.order) + '</div>';
  h += '<div class="field"><span class="lbl">المسافة بين كل طبقة والتانية</span>' + seg('dp.spread', [[150,'150'],[300,'300'],[600,'600'],[1000,'1000'],[1600,'1600']], d.spread) + '</div>';
  h += '<div class="field"><span class="lbl">الطبقة اللي تفضل في مكانها</span>' + seg('dp.pivot', [['front','أول واحدة'],['middle','اللي في النص'],['back','آخر واحدة']], d.pivot) + '</div>';
  if(it.move!=='none'){
    h += '<div class="field"><span class="lbl">قوة الحركة</span>' + seg('dp.amt', [[50,'هادية'],[100,'عادية'],[170,'قوية']], d.amt) + '</div>';
    if(it.move!=='float' && it.move!=='shake'){
      h += '<div class="field"><span class="lbl">المدة</span>' + seg('dp.secs', [[2,'2 ث'],[4,'4 ث'],[6,'6 ث'],[10,'10 ث'],[0,'طول الكومب']], d.secs) + '</div>';
      h += '<div class="field"><span class="lbl">تبدأ</span>' + seg('dp.at', [['playhead','عند البلاي هيد'],['start','من أول الكومب']], d.at) + '</div>';
    }
  }
  h += '<div class="field"><span class="lbl">تكبير الطبقات البعيدة (عشان الأطراف ما تبانش)</span>' + seg('dp.over', [[0,'0%'],[5,'5%'],[10,'10%'],[20,'20%']], d.over) + '</div>';
  h += '<div class="row">' + chk('dp.fog', 'ضباب للبعيد', d.fog) + chk('dp.dof', 'فوكس وعمق ميدان', d.dof) + '</div>';
  h += '<button class="btn primary" id="go">اعمل العمق + الحركة</button>';
  h += '<div class="row"><button class="btn" id="dpMove">غيّر الحركة بس</button><button class="btn" id="dpOrder">حدّث الترتيب والمسافة</button></div>';
  h += '<div class="row"><button class="btn" id="dpBake">ثبّت (Bake)</button><button class="btn warn" id="dpRemove">رجّعه 2D</button></div>';
  h += '<div class="hint">حدد اللايرات (لايرين أو أكتر) ودوس الزرار. المشهد هيفضل زي ما هو بالظبط من الكاميرا، بس كل طبقة هتبقى في عمق مختلف. التحكم كله من النل HAMDY DEPTH CTRL: Spread للمسافة، Pivot للطبقة الثابتة، Fog وBlur Level وFocus On. ولكل لاير HAMDY Depth Index (ترتيبه) وHAMDY Depth Offset (تزقه لقدام أو لورا بإيدك). الكاميرا متعلقة على HAMDY DEPTH RIG، فلو عايز تحركها بإيدك حرّك الريج.</div>';
  return h;
}
function dpArgs(it){
  var d = S.dp;
  return {move:it.move, order:d.order, spread:d.spread, pivot:d.pivot, amt:d.amt, secs:d.secs, at:d.at, fog:d.fog, dof:d.dof, over:d.over};
}
function bindDp(){
  var it = cur();
  if($('dpMove')) $('dpMove').onclick = function(){ host('dpMove', dpArgs(it)).then(say); };
  if($('dpOrder')) $('dpOrder').onclick = function(){ var a = dpArgs(it); a.keepMove = true; host('dpRig', a).then(say); };
  if($('dpBake')) $('dpBake').onclick = function(){ host('dpBake', {}).then(say); };
  if($('dpRemove')) $('dpRemove').onclick = function(){ host('dpRemove', {}).then(say); };
}

/* ======================================================= generative fill tab */
var GF_STATUS = '';
function gfSide(it){
  var g = S.gf, h = '<div class="stage" id="stage"></div>' + head(it, it.g);
  var ai = it.op !== 'photoshop' && it.op !== 'caf';
  if(ai){
    h += '<div class="field"><span class="lbl">الخدمة</span>' + seg('gf.provider', [['stability','Stability AI'],['openai','OpenAI']], g.provider) + '</div>';
    if(g.provider==='stability') h += '<div class="field"><label>مفتاح Stability (platform.stability.ai ← API Keys)</label><input type="password" id="gfKey" dir="ltr" value="' + esc(g.key) + '" placeholder="sk-..."></div>';
    else h += '<div class="field"><label>مفتاح OpenAI (نفس مفتاح الكابشن)</label><input type="password" id="gfKeyO" dir="ltr" value="' + esc(S.cap.keys.openai || '') + '" placeholder="sk-..."></div>';
    if(it.op==='removebg' && g.provider==='openai') h += '<div class="hint badline">شيل الخلفية شغال مع Stability بس.</div>';
  }
  if(it.search) h += '<div class="field"><label>الحاجة الموجودة في الصورة</label><input type="text" data-k="gf.search" dir="auto" value="' + esc(g.search) + '" placeholder="the blue car"></div>';
  if(it.prompt) h += '<div class="field"><label>' + (it.op==='outpaint' ? 'وصف اختياري للي يتكمل' : 'عايز إيه يظهر') + '</label><textarea data-k="gf.prompt" dir="auto" placeholder="a small palm tree">' + esc(g.prompt) + '</textarea></div>';
  if(it.op==='outpaint') h += '<div class="field"><span class="lbl">المقاس الجديد</span>' + seg('gf.out', [['916','9:16'],['11','1:1'],['45','4:5'],['169','16:9'],['wide','أعرض 25%']], g.out) + '</div>';
  if(it.mask && it.op!=='caf') h += '<div class="field"><span class="lbl">وسّع الماسك</span>' + seg('gf.grow', [[0,'0'],[12,'12px'],[25,'25px'],[45,'45px']], g.grow) + '</div>';
  if(it.op==='erase' || it.op==='fill' || it.op==='photoshop'){
    h += '<div class="field"><span class="lbl">يفضل لحد</span>' + seg('gf.hold', [['layer','طول اللاير'],['frame','الفريم ده بس']], g.hold) + '</div>';
    h += '<div class="row">' + chk('gf.patch', 'قص الرقعة على الماسك بس', g.patch) + chk('gf.follow', 'خليها تمشي مع آخر نل تراك', g.follow) + '</div>';
  }
  if(it.op==='photoshop'){
    h += '<button class="btn primary" id="go">1) ابعت الفريم لفوتوشوب</button>';
    h += '<button class="btn" id="gfBack"' + (g.lastPS ? '' : ' disabled') + '>2) رجّعه من فوتوشوب</button>';
  } else if(it.op==='caf'){
    h += '<button class="btn primary" id="go">1) جهّز الماسك وتراك</button>';
    h += '<button class="btn" id="gfCafFill">2) املا الفيديو (Content-Aware Fill)</button>';
  } else h += '<button class="btn primary" id="go">نفّذ</button>';
  h += '<div class="hint" id="gfStatus">' + (GF_STATUS || 'ده بيشتغل على فريم واحد (صورة). للقطات الثابتة بيفضل على طول اللاير، وللقطات المتحركة شغّل "خليها تمشي مع التراك" بعد ما تعمل تراك.') + '</div>';
  return h;
}
function setGf(msg, cls){ GF_STATUS = msg; var e = $('gfStatus'); if(e){ e.textContent = msg; e.className = 'hint' + (cls ? ' ' + cls : ''); } }
function bindGf(){
  var k = $('gfKey'); if(k) k.addEventListener('input', function(){ S.gf.key = k.value.trim(); save(); });
  var ko = $('gfKeyO'); if(ko) ko.addEventListener('input', function(){ S.cap.keys.openai = ko.value.trim(); save(); });
  if($('gfCafFill')) $('gfCafFill').onclick = function(){ host('gfCAF', {grow:S.gf.grow, step:'fill'}).then(function(r){ say(r); if(r.ok) setGf('اتفتح Content-Aware Fill ✓ اختار Object (لحاجة بتتحرك) أو Surface (لحاجة ثابتة) ودوس Generate Fill Layer.', 'okline'); }); };
  if($('gfBack')) $('gfBack').onclick = function(){
    var L = S.gf.lastPS; if(!L) return;
    setGf('بستلم الصورة من فوتوشوب...');
    var go = function(p){ return host('gfImport', {path:p, time:L.time, src:L.src, patch:S.gf.patch && !!L.src, hold:S.gf.hold, feather:S.gf.feather, grow:S.gf.grow, follow:S.gf.follow, label:'Photoshop'}); };
    var outP = L.out || L.path;
    host('gfPSBack', {out:outP}).then(function(r){
      if(!r.ok){ return go(L.path); }                       // no BridgeTalk: user saved over the frame himself
      return waitFile(outP, 60000).then(function(){ return go(outP); }, function(){ return go(L.path); });
    }).then(function(r){ say(r); if(r.ok) setGf('رجع من فوتوشوب واتحط ✓', 'okline'); });
  };
}
function waitFile(path, ms){
  var fs = NODE('fs'), t0 = Date.now(), last = -1;
  return new Promise(function(res, rej){
    (function poll(){
      var sz = -1; try{ sz = fs.statSync(path).size; }catch(e){}
      if(sz > 0 && sz === last) return res(path);
      last = sz;
      if(Date.now() - t0 > (ms || 20000)) return rej(new Error('الفريم متصورش (' + path + ')'));
      setTimeout(poll, 350);
    })();
  });
}
function imgFromBuf(buf){ return createImageBitmap(new Blob([buf], {type:'image/png'})); }
function canvasBuf(cv){ var d = cv.toDataURL('image/png'); return NODE('buffer').Buffer.from(d.split(',')[1], 'base64'); }
function multipartN(fields, files){
  var Buf = NODE('buffer').Buffer, bnd = '----nabd' + Date.now().toString(16) + Math.random().toString(16).slice(2), parts = [];
  Object.keys(fields).forEach(function(k){ if(fields[k] === undefined || fields[k] === null || fields[k] === '') return; parts.push(Buf.from('--' + bnd + '\r\nContent-Disposition: form-data; name="' + k + '"\r\n\r\n' + fields[k] + '\r\n')); });
  files.forEach(function(f){ parts.push(Buf.from('--' + bnd + '\r\nContent-Disposition: form-data; name="' + f.name + '"; filename="' + f.filename + '"\r\nContent-Type: ' + (f.mime || 'image/png') + '\r\n\r\n')); parts.push(f.buf); parts.push(Buf.from('\r\n')); });
  parts.push(Buf.from('--' + bnd + '--\r\n'));
  return {body:Buf.concat(parts), type:'multipart/form-data; boundary=' + bnd};
}
function outExt(w, h, mode){
  var tw = w, th = h;
  switch(mode){
    case '916': if(w/h > 9/16){ th = Math.round(w*16/9); } else { tw = Math.round(h*9/16); } break;
    case '11': tw = th = Math.max(w, h); break;
    case '45': if(w/h > 0.8){ th = Math.round(w/0.8); } else { tw = Math.round(h*0.8); } break;
    case '169': if(w/h < 16/9){ tw = Math.round(h*16/9); } else { th = Math.round(w*9/16); } break;
    case 'wide': tw = Math.round(w*1.25); break;
  }
  var ex = {l:Math.floor((tw-w)/2), r:Math.ceil((tw-w)/2), u:Math.floor((th-h)/2), d:Math.ceil((th-h)/2)};
  ['l','r','u','d'].forEach(function(k){ ex[k] = Math.min(2000, Math.max(0, ex[k])); });
  return ex;
}
function stabilityCall(op, frameBuf, maskBuf, g, ex){
  var ep = {erase:'erase', fill:'inpaint', replace:'search-and-replace', outpaint:'outpaint', removebg:'remove-background'}[op];
  var fields = {output_format:'png'}, files = [{name:'image', filename:'frame.png', buf:frameBuf}];
  if(maskBuf && (op==='erase' || op==='fill')){ files.push({name:'mask', filename:'mask.png', buf:maskBuf}); fields.grow_mask = 5; }
  if(op==='fill') fields.prompt = g.prompt || 'natural continuation of the scene';
  if(op==='replace'){ fields.prompt = g.prompt; fields.search_prompt = g.search; }
  if(op==='outpaint'){ fields.left = ex.l; fields.right = ex.r; fields.up = ex.u; fields.down = ex.d; if(g.prompt) fields.prompt = g.prompt; }
  var mp = multipartN(fields, files);
  return httpsReq('POST', 'https://api.stability.ai/v2beta/stable-image/edit/' + ep, {'Authorization':'Bearer ' + g.key, 'Accept':'image/*', 'Content-Type':mp.type, 'Content-Length':mp.body.length}, mp.body).then(function(r){
    if(r.status !== 200){ var t = r.body.toString(); try{ var j = JSON.parse(t); t = (j.errors || [j.message || j.name || t]).join(' / '); }catch(e){} throw new Error('Stability ' + r.status + ': ' + t); }
    return r.body;
  });
}
function openaiCall(op, frameBuf, maskBuf, g, ex, W, H){
  var key = S.cap.keys.openai;
  if(op==='removebg') return Promise.reject(new Error('شيل الخلفية شغال مع Stability بس.'));
  var prompt = {erase:'Remove the object in the masked area and fill it seamlessly with the surrounding background. Keep everything else identical.',
                fill:'In the masked area: ' + (g.prompt || 'natural continuation of the scene') + '. Match the lighting, perspective and grain of the photo. Keep everything else identical.',
                replace:'Replace ' + g.search + ' with ' + g.prompt + '. Keep everything else identical.',
                outpaint:'Extend this photo naturally into the empty transparent area. ' + (g.prompt || '') + ' Keep the original part identical.'}[op];
  var w2 = W + (ex ? ex.l + ex.r : 0), h2 = H + (ex ? ex.u + ex.d : 0);
  var size = w2/h2 > 1.2 ? '1536x1024' : (w2/h2 < 0.83 ? '1024x1536' : '1024x1024');
  return imgFromBuf(frameBuf).then(function(img){
    var cv = document.createElement('canvas'); cv.width = w2; cv.height = h2;
    var cx = cv.getContext('2d'); cx.drawImage(img, ex ? ex.l : 0, ex ? ex.u : 0);
    var imageBuf = canvasBuf(cv), mk = null;
    var pm = Promise.resolve(null);
    if(op==='outpaint'){
      var m = document.createElement('canvas'); m.width = w2; m.height = h2; var mx = m.getContext('2d'); mx.fillStyle = '#000'; mx.fillRect(ex.l, ex.u, W, H); mk = canvasBuf(m);
    } else if(maskBuf){
      pm = imgFromBuf(maskBuf).then(function(mi){
        var m = document.createElement('canvas'); m.width = W; m.height = H; var mx = m.getContext('2d'); mx.drawImage(mi, 0, 0, W, H);
        var d = mx.getImageData(0, 0, W, H), a = d.data; for(var i=0;i<a.length;i+=4){ var v = a[i]; a[i] = a[i+1] = a[i+2] = 0; a[i+3] = 255 - v; } mx.putImageData(d, 0, 0); return canvasBuf(m);
      });
    }
    return pm.then(function(mb){
      if(mb) mk = mb;
      var files = [{name:'image', filename:'image.png', buf:imageBuf}]; if(mk) files.push({name:'mask', filename:'mask.png', buf:mk});
      var mp = multipartN({model:'gpt-image-1', prompt:prompt, size:size}, files);
      return httpsReq('POST', 'https://api.openai.com/v1/images/edits', {'Authorization':'Bearer ' + key, 'Content-Type':mp.type, 'Content-Length':mp.body.length}, mp.body);
    }).then(function(r){
      var j = {}; try{ j = JSON.parse(r.body.toString()); }catch(e){}
      if(r.status !== 200 || !j.data){ throw new Error('OpenAI ' + r.status + ': ' + ((j.error && j.error.message) || r.body.toString().slice(0, 200))); }
      return imgFromBuf(NODE('buffer').Buffer.from(j.data[0].b64_json, 'base64'));
    }).then(function(out){
      var cv2 = document.createElement('canvas'); cv2.width = w2; cv2.height = h2; cv2.getContext('2d').drawImage(out, 0, 0, w2, h2); return canvasBuf(cv2);
    });
  });
}
function gfRun(it){
  if(!CEP){ say({code:'MOCK'}); return; }
  if(!nodeOK()){ setGf('Node مش شغال في البانل. أعد تسطيب الإكستنشن.', 'badline'); return; }
  var g = S.gf, op = it.op;
  if(op==='caf'){ host('gfCAF', {grow:g.grow, step:'track'}).then(function(r){ say(r); if(r.ok) setGf('الماسك اتظبط ✓ في بانل Tracker دوس ▶ (Track forward) لحد آخر اللقطة، وبعدين دوس "2) املا الفيديو".', 'okline'); }); return; }
  var ai = op !== 'photoshop';
  if(ai && g.provider==='stability' && !g.key){ say({ok:false, code:'NO_KEY'}); return; }
  if(ai && g.provider==='openai' && !S.cap.keys.openai){ say({ok:false, code:'NO_KEY'}); return; }
  if((op==='fill' || op==='replace') && !g.prompt){ setGf('اكتب الوصف الأول.', 'badline'); return; }
  if(op==='replace' && !g.search){ setGf('اكتب الحاجة اللي عايز تبدّلها.', 'badline'); return; }
  setGf('بصوّر الفريم...');
  var F, fs = NODE('fs'), path = NODE('path');
  host('gfFrame', {needMask:!!it.mask, grow:g.grow, feather:0}).then(function(r){
    if(!r.ok){ say(r); setGf(''); throw null; }
    F = r.data;
    return waitFile(F.frame).then(function(){ return F.mask ? waitFile(F.mask) : null; });
  }).then(function(){
    if(F.mask) host('gfCleanup');
    if(op==='photoshop'){
      var outP = path.join(path.dirname(F.frame), 'ps_' + Date.now() + '.png');
      S.gf.lastPS = {path:F.frame, out:outP, time:F.time, src:F.src}; save();
      return host('gfPhotoshop', {path:F.frame, mask:F.mask, prompt:g.prompt}).then(function(r){ say(r); setGf('اتفتح في فوتوشوب والتحديد جاهز. لو الـ Generative Fill مااشتغلش لوحده دوس Generative Fill من الشريط اللي تحت الصورة واختار النتيجة اللي تعجبك، وبعدين ارجع هنا ودوس "2) رجّعه".', 'okline'); if($('gfBack')) $('gfBack').disabled = false; throw null; });
    }
    setGf('ببعت للذكاء الاصطناعي... (ممكن ياخد دقيقة)');
    var fb = fs.readFileSync(F.frame), mb = F.mask ? fs.readFileSync(F.mask) : null, ex = op==='outpaint' ? outExt(F.w, F.h, g.out) : null;
    return (g.provider==='openai' ? openaiCall(op, fb, mb, g, ex, F.w, F.h) : stabilityCall(op, fb, mb, g, ex)).then(function(buf){ return {buf:buf, ex:ex}; });
  }).then(function(res){
    var out = path.join(path.dirname(F.frame), 'nabd_' + op + '_' + Date.now() + '.png');
    fs.writeFileSync(out, res.buf);
    setGf('رجع ✓ بحطه في الكومب...');
    var args = {path:out, time:F.time, src:F.src, label:it.en, feather:g.feather, grow:g.grow, follow:g.follow, hold:g.hold};
    if(op==='erase' || op==='fill'){ args.patch = g.patch && !!F.src; }
    if(op==='replace'){ args.patch = false; }
    if(op==='removebg'){ args.patch = false; args.hold = 'layer'; }
    if(op==='outpaint'){ args.ext = res.ex; args.patch = false; args.below = true; }
    return host('gfImport', args);
  }).then(function(r){ if(r){ say(r); if(r.ok) setGf('خلص ✓ اللاير اسمه HAMDY FILL، والصورة متخزنة في Documents/HAMDY Fill.', 'okline'); } })
  .catch(function(e){ if(e){ setGf('حصل خطأ: ' + (e.message || e), 'badline'); } });
}


/* ============================================================ drag out to AE */
// HTML drag & drop doesn't leave a CEP panel reliably, so we capture the mouse ourselves: press on a card, drag
// it outside the panel and let go over After Effects -> applied to the selected layer(s).
var DRAG = null;
function dragOut(card, it){
  card.addEventListener('pointerdown', function(e){
    if(e.button !== 0) return;
    DRAG = {card:card, it:it, x:e.clientX, y:e.clientY, id:e.pointerId, on:false};
    try{ card.setPointerCapture(e.pointerId); }catch(x){}
  });
  card.addEventListener('pointermove', function(e){
    if(!DRAG || DRAG.card !== card) return;
    if(!DRAG.on && Math.abs(e.clientX - DRAG.x) + Math.abs(e.clientY - DRAG.y) > 8){ DRAG.on = true; card.classList.add('dragging'); document.body.classList.add('dragout'); }
    if(DRAG.on){
      var out = e.clientX < 0 || e.clientY < 0 || e.clientX > window.innerWidth || e.clientY > window.innerHeight;
      document.body.classList.toggle('dragready', out);
    }
  });
  function end(e, cancel){
    if(!DRAG || DRAG.card !== card) return;
    var d = DRAG; DRAG = null;
    try{ card.releasePointerCapture(d.id); }catch(x){}
    card.classList.remove('dragging'); document.body.classList.remove('dragout'); document.body.classList.remove('dragready');
    if(!d.on || cancel) return;
    card._noClick = true; setTimeout(function(){ card._noClick = false; }, 50);
    var out = e.clientX < 0 || e.clientY < 0 || e.clientX > window.innerWidth || e.clientY > window.innerHeight;
    if(!out) return;
    S.sel[S.tab] = d.it.id; save();
    Array.prototype.forEach.call(card.parentNode ? card.parentNode.children : [], function(x){ x.classList.remove('sel'); }); card.classList.add('sel');
    renderSide(); apply();
  }
  card.addEventListener('pointerup', function(e){ end(e, false); });
  card.addEventListener('pointercancel', function(e){ end(e, true); });
  card.addEventListener('lostpointercapture', function(e){ if(DRAG && DRAG.card === card && !DRAG.on){ DRAG = null; } });
}

/* ============================================================ resizable layout */
function uiApply(){
  var u = S.ui || (S.ui = {side:300, nav:0, card:132});
  var side = $('side'); if(side) side.style.width = Math.max(220, Math.min(700, u.side || 300)) + 'px';
  var nav = $('tabs'); if(nav) nav.style.flex = u.nav ? ('0 1 ' + u.nav + 'px') : '';
  document.documentElement.style.setProperty('--card-min', (u.card || 132) + 'px');
  var cs = $('cardSize'); if(cs) cs.value = u.card || 132;
}
function splitter(el, onMove, onReset){
  if(!el) return;
  el.addEventListener('pointerdown', function(e){
    e.preventDefault(); el.setPointerCapture(e.pointerId); el.classList.add('on'); document.body.classList.add('resizing');
    function mv(ev){ onMove(ev); }
    function up(ev){ el.releasePointerCapture(e.pointerId); el.classList.remove('on'); document.body.classList.remove('resizing'); el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); save(); }
    el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up);
  });
  el.addEventListener('dblclick', function(){ onReset(); uiApply(); save(); });
}
function initLayout(){
  var rtl = function(){ return document.documentElement.getAttribute('dir') !== 'ltr'; };
  splitter($('vsplit'), function(ev){
    var r = $('side').getBoundingClientRect();
    S.ui.side = Math.round(Math.max(220, Math.min(700, rtl() ? r.right - ev.clientX : ev.clientX - r.left)));
    $('side').style.width = S.ui.side + 'px';
  }, function(){ S.ui.side = 300; });
  splitter($('hsplit'), function(ev){
    var r = $('tabs').getBoundingClientRect();
    S.ui.nav = Math.round(Math.max(160, rtl() ? r.right - ev.clientX : ev.clientX - r.left));
    $('tabs').style.flex = '0 1 ' + S.ui.nav + 'px';
  }, function(){ S.ui.nav = 0; });
  var cs = $('cardSize');
  if(cs) cs.addEventListener('input', function(){ S.ui.card = +cs.value; document.documentElement.style.setProperty('--card-min', S.ui.card + 'px'); });
  if(cs) cs.addEventListener('change', save);
  uiApply();
}
/* ============================================================ language */
// Arabic is the source language; English comes from js/i18n_en.js. Every rendered text node / placeholder / title
// is translated by exact match, so new UI only needs a dictionary line.
var TR_OBS = null;
function trText(t){ if(S.lang !== 'en' || !t) return t; var k = t.trim(); var e = I18N_EN[k]; return e ? t.replace(k, e) : t; }
function trNode(root){
  if(S.lang !== 'en' || !root) return;
  if(root.nodeType === 3){ var v = root.data; if(/[؀-ۿ]/.test(v)){ var nv = trText(v); if(nv !== v) root.data = nv; } return; }
  if(root.nodeType !== 1) return;
  if(root.matches && root.matches('.captxt, .tsstage, textarea, input[type=text], .ttx, .tstext')) return; // user text stays as typed
  ['placeholder','title'].forEach(function(a){ var v = root.getAttribute && root.getAttribute(a); if(v && /[؀-ۿ]/.test(v)){ var nv = trText(v); if(nv !== v) root.setAttribute(a, nv); } });
  var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false), n, list = [];
  while((n = w.nextNode())){ if(/[؀-ۿ]/.test(n.data)) list.push(n); }
  list.forEach(function(x){ var p = x.parentNode; if(p && p.closest && p.closest('.captxt, .tsstage, textarea, .tstext, .u, .nmUser')) return; var nv = trText(x.data); if(nv !== x.data) x.data = nv; });
  Array.prototype.forEach.call(root.querySelectorAll ? root.querySelectorAll('[placeholder],[title]') : [], function(el){ ['placeholder','title'].forEach(function(a){ var v = el.getAttribute(a); if(v && /[؀-ۿ]/.test(v)){ var nv = trText(v); if(nv !== v) el.setAttribute(a, nv); } }); });
}
function SAMPLE_NAME(){ return S.lang==='en' ? 'Hamdy' : 'حمدي'; }
function applyLang(){
  window.HMK_LANG = S.lang;
  if(typeof HMK_TPL_LOCALIZE==='function') HMK_TPL_LOCALIZE(window.HMK_TPL, S.lang==='en');
  // sample texts follow the panel language (only while they are still the untouched defaults)
  var sf = SAMPLE[S.lang==='en' ? 'ar' : 'en'], st = SAMPLE[S.lang==='en' ? 'en' : 'ar'];
  ['tx','trk','ln'].forEach(function(k){ if(S[k] && S[k].text === sf[k]) S[k].text = st[k]; });
  document.documentElement.setAttribute('dir', S.lang === 'en' ? 'ltr' : 'rtl');
  document.documentElement.setAttribute('lang', S.lang === 'en' ? 'en' : 'ar');
  document.body.classList.toggle('en', S.lang === 'en');
  if($('langBtn')) $('langBtn').textContent = S.lang === 'en' ? 'ع' : 'EN';
  if(TR_OBS){ TR_OBS.disconnect(); TR_OBS = null; }
  if(S.lang === 'en'){
    TR_OBS = new MutationObserver(function(ms){ ms.forEach(function(m){ Array.prototype.forEach.call(m.addedNodes, trNode); if(m.type === 'characterData') trNode(m.target); }); });
    TR_OBS.observe(document.body, {childList:true, subtree:true});
    trNode(document.body);
  }
}
var SAMPLE = {ar:{tx:'حركة النص', trk:'اكتب هنا', ln:'نص ماشي على خط'}, en:{tx:'Text Animation', trk:'Type here', ln:'Text moving on a line'}};
function setLang(l){
  var from = SAMPLE[S.lang === 'en' ? 'en' : 'ar'], to = SAMPLE[l];
  if(S.tx.text === from.tx) S.tx.text = to.tx;
  if(S.trk.text === from.trk) S.trk.text = to.trk;
  if(S.ln.text === from.ln) S.ln.text = to.ln;
  S.lang = l; save();
  location.reload();
}
/* ============================================================== edit page */
var ED = null, ED_DIRTY = true, ED_BUSY = false;
function otrArgs(it){
  var o = it.otr, c = S.tr.ocolor, col = null;
  if(c==='acc') col = hexRGB(S.acc); else if(c==='white' && o.kind==='cover') col = [1,1,1]; else if(c==='black' && o.kind==='cover') col = [0.02,0.02,0.02];
  if(o.kind==='light' && c!=='acc') col = null;
  if(o.kind==='cover' && c==='acc' && !o.tint) col = hexRGB(S.acc);
  return {file:assetPath(o.file), matte:o.matte ? assetPath(o.matte) : null, kind:o.kind, mid:o.mid, frames0:o.frames, frames:S.tr.oframes,
    blend:S.tr.oblend, color:col, amount:S.tr.oamount, flip:S.tr.flip, label:o.en, sfx:S.tr.sfx ? sfxPath({id:/flash|glitch/i.test(o.id) ? 'whoosh_fast' : 'whoosh_soft'}) : null};
}
function assetPath(rel){ return CEP ? (extPath() + '/assets/' + rel).replace(/\\/g,'/') : 'assets/' + rel; }
function rgbHex(c){ return '#' + c.slice(0,3).map(function(v){ var h = Math.round(Math.max(0,Math.min(1,v))*255).toString(16); return h.length<2 ? '0'+h : h; }).join(''); }
var ED_PROP_AR = {'Opacity':'الشفافية','Scale':'الحجم','Scale Height':'الطول','Scale Width':'العرض','Position':'المكان','Rotation':'اللف','Skew':'الميلان','Anchor Point':'نقطة الارتكاز','Blurriness':'البلور','Color':'اللون','Shadow Color':'لون الظل','Distance':'المسافة','Softness':'النعومة','Direction':'الاتجاه','Glow Radius':'نص قطر التوهج','Glow Intensity':'قوة التوهج','Glow Threshold':'عتبة التوهج','Slider':'القيمة','Checkbox':'تشغيل','Offset':'الإزاحة','Start':'البداية','End':'النهاية','Fill Color':'لون الحروف','Tracking Amount':'المسافة بين الحروف','Character Offset':'إزاحة الحروف','Transition Completion':'نسبة الانتقال','Amount':'الكمية','Saturation':'التشبع','Brightness':'السطوع','Contrast':'التباين','Temporal Frequency':'سرعة الاهتزاز','Edge Thickness':'سُمك الحافة','Light Intensity':'قوة الإضاءة'};
function edName(n){ return ED_PROP_AR[n] ? ED_PROP_AR[n] + ' <span style="color:#666">' + esc(n) + '</span>' : esc(n); }
function presetName(id){
  var lists = [D.MOTION, D.TEXTS, D.TRANSITIONS, D.TSTYLES], i, it;
  for(i=0;i<lists.length;i++){ it = byId(lists[i], id); if(it) return it.ar; }
  return id;
}
function edTitle(g){
  var m = g.match(/^(?:NABD|HAMDY) (IN|OUT|FX|LOOP) (.+)$/);
  if(m) return {IN:'دخول', OUT:'خروج', FX:'تأكيد', LOOP:'لوب'}[m[1]] + ' · ' + presetName(m[2]);
  if(g==='HAMDY TYPE') return 'آلة كاتبة: السرعة والمؤشر';
  if(g==='HAMDY STYLE') return 'ستايل النص';
  if(g==='HAMDY PATH') return 'نص على مسار: المكان والسرعة';
  if(g==='HAMDY TRIM') return 'تريم باث: البداية والنهاية والإزاحة';
  if(g==='HAMDY STAB') return 'تثبيت الكادر: القوة';
  if(g==='HAMDY CAR') return 'كارت كاروسيل';
  if(/^(?:NABD|HAMDY) CAROUSEL/.test(ED && ED.layer ? ED.layer.name : '') && g==='LAYER') return 'تحكم الكاروسيل (Shape 0-16 · Motion 0 لف، 1 وقفات، 2 رايح جاي، 3 يدوي، 4 يلف ويقف)';
  if(g==='HAMDY LOOK') return 'فلتر ألوان';
  if(g==='HAMDY AUDIO') return 'إفكت صوت';
  if(g==='LAYER') return 'إفكتات اللاير ده';
  return g;
}
function edRefresh(force){
  if(!CEP){ ED = edMock(); renderEdit(); renderSideIfEd(); return; }
  if(ED_BUSY) return; ED_BUSY = true;
  host('inspect').then(function(r){
    ED_BUSY = false; ED_DIRTY = false;
    if(!r.ok){ ED = null; renderEdit(); return; }
    var nd = r.data, sig = JSON.stringify(nd);
    if(!force && ED && ED._sig === sig) return;
    nd._sig = sig; ED = nd; renderEdit(); renderSideIfEd();
  });
}
function renderSideIfEd(){ if(S.tab==='ed'){ var a = document.activeElement; if(!(a && $('side').contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName))) renderSide(); } }
function edMock(){
  var nm = S.lang==='en' ? 'Text Animation' : 'حركة النص';
  return {layer:{idx:1, name:nm, inF:0, outF:90, op:100}, fps:30, kids:[], text:{text:nm, size:110, fill:[1,1,1], stroke:null, sw:0, trk:0, font:'Cairo-Bold'},
    groups:[{g:'HAMDY IN overBottom', t0:0, fr:18, items:[{n:'HAMDY IN overBottom', path:[4,1], kind:'fx', on:true, props:[{n:'Position', path:[4,1,2], t:'2', nk:2, k0:[960,1300], k1:[960,540]}, {n:'Opacity', path:[4,1,9], t:'1', nk:2, k0:0, k1:100}]}]},
            {g:'HAMDY TYPE', items:[{n:'HAMDY TYPE Speed', path:[4,2], kind:'fx', on:true, props:[{n:'Slider', path:[4,2,1], t:'1', nk:0, v:14}]}, {n:'HAMDY TYPE Cursor', path:[4,3], kind:'fx', on:true, props:[{n:'Checkbox', path:[4,3,1], t:'1', nk:0, v:1}]}]},
            {g:'HAMDY STYLE', items:[{n:'HAMDY STYLE Glow', path:[4,4], kind:'fx', on:true, props:[{n:'Glow Radius', path:[4,4,3], t:'1', nk:0, v:30}, {n:'Color A', path:[4,4,8], t:'c', nk:0, v:[1,0.4,0.2,1]}]}]}]};
}
function rangeFor(p, v){
  var a = Math.abs(v), span = Math.max(/Opacity|Amount|Completion|Saturation/i.test(p.n) ? 100 : 50, a*2.5);
  if(/Opacity|Completion/i.test(p.n)) return [0, 100];
  var neg = v < 0 || /Rotat|Angle|Skew|Offset|Direction|Position|Hue|Brightness|Contrast/i.test(p.n);
  return [neg ? -span : 0, span];
}
function edValueHTML(p, v, key){
  var id = 'ev' + Math.random().toString(36).slice(2,8), h = '';
  if(p.t==='c') return '<input type="color" data-ed="' + id + '" data-kind="c" data-key="' + key + '" value="' + rgbHex(v) + '">';
  if(p.t==='1'){
    var r = rangeFor(p, v), step = Math.abs(r[1]-r[0]) > 20 ? 1 : 0.01;
    return '<input type="range" data-ed="' + id + '" data-kind="1r" data-key="' + key + '" min="' + r[0] + '" max="' + r[1] + '" step="' + step + '" value="' + v + '"><input type="number" data-ed="' + id + '" data-kind="1" data-key="' + key + '" step="any" value="' + v + '">';
  }
  v.forEach(function(x, i){ h += '<input type="number" data-ed="' + id + '" data-kind="v" data-i="' + i + '" data-n="' + v.length + '" data-key="' + key + '" step="any" value="' + x + '">'; });
  return h;
}
function renderEdit(){
  if(S.tab!=='ed') return;
  var grid = $('grid'); grid.className = 'grid edgrid';
  $('count').textContent = ED && ED.layer ? ED.layer.name : '';
  if(!ED || !ED.layer){ grid.innerHTML = '<div class="edempty">حدد لاير في After Effects عليه حاجة من الكيت (حركة، ستايل، آلة كاتبة، فلتر، ترانزيشن أو أوفرلي)<br>وهتلاقي كل حاجة اتطبقت عليه هنا تقدر تعدلها من غير ما تدخل Effect Controls.</div>'; return; }
  if(!ED.groups.length){ grid.innerHTML = (CLIP ? '<div class="edclip">' + clipPasteBtn('edPaste2') + '</div>' : '') + '<div class="edempty">اللاير ده مفيهوش حاجات من الكيت لسه.<br>طبّق أي حاجة من التابات التانية وارجع هنا.</div>'; if($('edPaste2')) $('edPaste2').onclick = clipPaste; return; }
  var h = '<div class="edwrap">' + (CLIP ? '<div class="edclip">' + clipPasteBtn('edPaste2') + '</div>' : '');
  ED.groups.forEach(function(G, gi){
    h += '<div class="edcard" data-g="' + gi + '"><h3><span>' + esc(edTitle(G.g)) + ' <span class="tag">' + esc(G.g) + '</span></span><span class="acts">' +
      (edWhich(G) ? '<button class="cpy" data-gact="copy">📋 نسخ ' + (edWhich(G) === 'in' ? 'الدخول' : 'الخروج') + '</button>' : '') + edOtherEndBtn(G) + '<button data-gact="off">إيقاف/تشغيل</button><button class="del" data-gact="del">' + (G.g==='LAYER' ? 'امسح اللاير' : 'امسح') + '</button></span></h3>';
    if(G.fr) h += '<div class="edtime">يبدأ من فريم <input type="number" data-gt="t0" value="' + G.t0 + '"> المدة <input type="number" data-gt="fr" min="1" value="' + G.fr + '"> فريم <button class="btn" data-gact="retime" style="padding:2px 10px;width:auto">طبّق التوقيت</button></div>';
    G.items.forEach(function(it, ii){
      h += '<div class="edsub"><span>' + esc(it.n) + '</span><label><input type="checkbox" data-on="' + ii + '"' + (it.on?' checked':'') + '> on</label></div>';
      it.props.forEach(function(p, pi){
        var ref = gi + ':' + ii + ':' + pi;
        if(p.nk > 0){
          h += '<div class="edp" data-ref="' + ref + '"><div class="pn">' + edName(p.n) + ' <span class="kf">◆ بداية</span></div><div class="pv">' + edValueHTML(p, p.k0, 'first') + '</div></div>';
          h += '<div class="edp" data-ref="' + ref + '"><div class="pn"><span class="kf">◆ نهاية</span></div><div class="pv">' + edValueHTML(p, p.k1, 'last') + '</div></div>';
        } else {
          h += '<div class="edp" data-ref="' + ref + '"><div class="pn">' + edName(p.n) + (p.ex ? ' <span class="ex">ƒx</span>' : '') + '</div><div class="pv">' + edValueHTML(p, p.v, '') + '</div></div>';
        }
      });
    });
    h += '</div>';
  });
  h += '</div>';
  grid.innerHTML = h;
  if($('edPaste2')) $('edPaste2').onclick = clipPaste;
  bindEditGrid(grid);
}
/* a motion preset / text animation that is only on one end of the layer can be added to the other end too */
function edOther(G){
  var m = /^(?:HAMDY|NABD) (IN|OUT) ([A-Za-z0-9_]+)/.exec(G.g || ''); if(!m) return null;
  var it = byId(D.MOTION, m[2]), src = 'mp';
  if(!it){ it = byId(D.TEXTS, m[2]); src = 'tx'; }
  if(!it || it.kind === 'loop' || it.kind === 'emph') return null;
  var dir = m[1] === 'IN' ? 'out' : 'in', other = 'HAMDY ' + dir.toUpperCase() + ' ' + m[2];
  if((ED.groups || []).some(function(x){ return x.g.indexOf(other) === 0 || x.g.indexOf('NABD ' + dir.toUpperCase() + ' ' + m[2]) === 0; })) return null;
  return {it:it, src:src, dir:dir};
}
var CLIP = null; // copied kit animation (one IN or OUT group), pasted onto other layers
function edWhich(G){ var m = /^(?:HAMDY|NABD) (IN|OUT) /.exec(G.g || ''); return m ? m[1].toLowerCase() : (G.fr ? 'in' : null); }
function clipPasteBtn(id){ return CLIP ? '<button class="btn primary" id="' + id + '">📥 ' + trText('الصق') + ' «' + esc(CLIP.label) + '» ' + trText(CLIP.which === 'out' ? '(خروج)' : '(دخول)') + ' ' + trText('على اللايرات المحددة') + '</button>' : ''; }
function clipPaste(){
  if(!CLIP) return;
  host('fxPaste', {data:CLIP.data}).then(function(r){
    if(!r.ok){ say(r); return; }
    var d = r.data || {}, t = $('toast');
    // if nothing animatable came across, fall back to re-applying the same preset (same frames) on the selected layers
    if(!d.keys && CLIP.pre){
      var it = CLIP.pre.src === 'mp' ? byId(D.MOTION, CLIP.pre.id) : byId(D.TEXTS, CLIP.pre.id), p, nm = it ? ((S.lang === 'en' ? (it.en || it.ar) : (it.ar || it.en)) || '') : '';
      if(it && CLIP.pre.src === 'mp') p = host('motion', {spec:mpSpec(it), dir:CLIP.which, frames:CLIP.pre.fr || S.mp.frames, at:'layer', mkName:nm});
      else if(it) p = host('textApply', Object.assign(txArgs(it), {doIn:CLIP.which === 'in', doOut:CLIP.which === 'out', frames:CLIP.pre.fr || S.tx.frames, mkName:nm}));
      if(p){ p.then(function(r2){ say(r2); if(r2.ok) edRefresh(true); }); return; }
    }
    if(t){ t.className = 'toast ' + (d.keys ? 'ok' : 'bad'); t.textContent = d.keys ? trText('اتلصق ✓') + ' (' + d.fx + ' fx · ' + d.keys + ' key)' : trText('الحركة ما اتلصقتش:') + ' ' + (d.err || ('fx ' + d.fx + ', keys 0')); clearTimeout(t._t); t._t = setTimeout(function(){ t.className = 'toast'; }, 7000); }
    edRefresh(true);
  });
}
function edOtherEndBtn(G){
  var o = edOther(G); if(!o) return '';
  return '<button class="addo" data-gact="addOther">' + (o.dir === 'out' ? '＋ ضيفه في النهاية' : '＋ ضيفه في البداية') + '</button>';
}
function edSend(cmd, args){ args = args || {}; args.idx = ED.layer.idx; return host(cmd, args).then(function(r){ if(!r.ok) say(r); return r; }); }
function bindEditGrid(grid){
  Array.prototype.forEach.call(grid.querySelectorAll('.edp'), function(row){
    var ref = row.dataset.ref.split(':'), G = ED.groups[+ref[0]], P = G.items[+ref[1]].props[+ref[2]];
    var ins = row.querySelectorAll('input');
    function collect(src){
      if(P.t==='c') return hexRGB(src.value);
      if(P.t==='1') return parseFloat(src.value) || 0;
      var v = []; Array.prototype.forEach.call(ins, function(x){ v[+x.dataset.i] = parseFloat(x.value) || 0; }); return v;
    }
    Array.prototype.forEach.call(ins, function(inp){
      inp.addEventListener('input', function(){
        if(inp.dataset.kind==='1r'){ var n = row.querySelector('input[data-kind="1"]'); if(n) n.value = inp.value; }
        if(inp.dataset.kind==='1'){ var rg = row.querySelector('input[data-kind="1r"]'); if(rg) rg.value = inp.value; }
      });
      inp.addEventListener('change', function(){
        var v = collect(inp);
        edSend('setProp', {path:P.path, v:v, key:inp.dataset.key || null}).then(function(r){ if(r.ok){ if(inp.dataset.key==='first') P.k0 = v; else if(inp.dataset.key==='last') P.k1 = v; else P.v = v; } });
      });
    });
  });
  Array.prototype.forEach.call(grid.querySelectorAll('.edcard'), function(card){
    var G = ED.groups[+card.dataset.g];
    Array.prototype.forEach.call(card.querySelectorAll('[data-on]'), function(cb){
      cb.onchange = function(){ var it = G.items[+cb.dataset.on]; edSend('toggleItem', {path:it.path, on:cb.checked}).then(function(r){ if(r.ok) it.on = cb.checked; }); };
    });
    Array.prototype.forEach.call(card.querySelectorAll('[data-gact]'), function(b){
      b.onclick = function(){
        var act = b.dataset.gact;
        if(act==='del'){
          if(!b._arm){ b._arm = true; b.textContent = 'متأكد؟'; setTimeout(function(){ b._arm = false; b.textContent = G.g==='LAYER' ? 'امسح اللاير' : 'امسح'; }, 3000); return; }
          edSend('delGroup', {g:G.g}).then(function(r){ if(r.ok) edRefresh(true); });
        } else if(act==='off'){
          var on = !G.items.every(function(it){ return !it.on; }) ? false : true, ps = G.items.map(function(it){ return edSend('toggleItem', {path:it.path, on:on}); });
          Promise.all(ps).then(function(){ edRefresh(true); });
        } else if(act==='copy'){
          var w = edWhich(G);
          edSend('fxCopy', {which:w, items:G.items.map(function(x){ return {path:x.path, kind:x.kind}; })}).then(function(r){
            if(!r.ok) return;
            var mm = /^(?:HAMDY|NABD) (?:IN|OUT) ([A-Za-z0-9_]+)/.exec(G.g || ''), pre = null;
            if(mm){ if(byId(D.MOTION, mm[1])) pre = {src:'mp', id:mm[1], fr:G.fr}; else if(byId(D.TEXTS, mm[1])) pre = {src:'tx', id:mm[1], fr:G.fr}; }
            CLIP = {data:r.data, label:edTitle(G.g), which:w, pre:pre};
            var t = $('toast'); if(t){ t.className = 'toast ok'; t.textContent = trText('اتنسخ ✓ حدد لاير تاني ودوس «الصق»'); clearTimeout(t._t); t._t = setTimeout(function(){ t.className = 'toast'; }, 3500); }
            renderEdit(); renderSide();
          });
        } else if(act==='addOther'){
          var o = edOther(G); if(!o) return;
          var nm = (S.lang === 'en' ? (o.it.en || o.it.ar) : (o.it.ar || o.it.en)) || '';
          var pr = o.src === 'mp' ? edSend('motion', {spec:mpSpec(o.it), dir:o.dir, frames:G.fr || S.mp.frames, at:'layer', mkName:nm})
                                  : edSend('textApply', Object.assign(txArgs(o.it), {doIn:o.dir === 'in', doOut:o.dir === 'out', frames:G.fr || S.tx.frames, mkName:nm}));
          pr.then(function(r){ if(r.ok){ say(r); edRefresh(true); } });
        } else if(act==='retime'){
          var t0 = +card.querySelector('[data-gt=t0]').value, fr = +card.querySelector('[data-gt=fr]').value;
          edSend('retime', {g:G.g, t0:t0, fr:Math.max(1, fr)}).then(function(r){ if(r.ok){ say(r); edRefresh(true); } });
        }
      };
    });
  });
}
function editSide(){
  var h = '<div class="stage svgth" id="stage"><svg viewBox="0 0 160 100"><rect width="160" height="100" fill="#121216"/><rect x="34" y="30" width="92" height="8" rx="4" fill="#3b3b44"/><circle cx="70" cy="34" r="7" fill="var(--acc)"/><rect x="34" y="50" width="92" height="8" rx="4" fill="#3b3b44"/><circle cx="104" cy="54" r="7" fill="var(--acc)"/><rect x="34" y="70" width="92" height="8" rx="4" fill="#3b3b44"/><circle cx="52" cy="74" r="7" fill="var(--acc)"/></svg></div>';
  h += '<h2 class="fname">صفحة التعديل</h2><p class="desc">كل اللي الكيت حطه على اللاير المحدد: قيم، ألوان، توقيت، وتقدر توقف أو تمسح أي حاجة.</p>';
  h += '<div class="row"><button class="btn primary" id="edRead">اقرأ اللاير المحدد</button></div>' + clipPasteBtn('edPaste');
  h += chk('ed.auto', 'تحديث تلقائي لما أغيّر التحديد', S.ed.auto);
  if(ED && ED.layer){
    var L = ED.layer;
    h += '<div class="field"><span class="lbl">اللاير</span><div class="pathline">#' + L.idx + ' · ' + esc(L.name) + ' · فريم ' + L.inF + ' ← ' + L.outF + '</div></div>';
    h += '<div class="row"><div class="field"><label>شفافية اللاير</label><input type="number" id="edOp" min="0" max="100" value="' + L.op + '"></div><div class="field"><label>آخر فريم</label><input type="number" id="edOut" value="' + L.outF + '"></div></div>';
    if(/^(?:NABD|HAMDY) (OV|LOOK|TR|FX|MATTE)/.test(L.name)) h += '<div class="field"><span class="lbl">طريقة الدمج</span><div class="seg" id="edBlend">' + [['screen','Screen'],['add','Add'],['overlay','Overlay'],['normal','Normal']].map(function(o){ return '<button data-v="' + o[0] + '" class="' + (L.blend===o[0]?'on':'') + '">' + o[1] + '</button>'; }).join('') + '</div></div>';
    if(ED.text){
      var T = ED.text;
      h += '<div class="field"><label>الكلام</label><textarea id="edText" dir="auto">' + esc(T.text.replace(/\r/g,'\n')) + '</textarea></div>';
      h += '<div class="row"><div class="field"><label>الحجم</label><input type="number" id="edSize" value="' + Math.round(T.size) + '"></div><div class="field"><label>التراكينج</label><input type="number" id="edTrk" value="' + Math.round(T.trk||0) + '"></div></div>';
      h += '<div class="row"><div class="field"><label>لون الحروف</label><input type="color" id="edFill" value="' + (T.fill ? rgbHex(T.fill) : '#ffffff') + '"></div><div class="field"><label>لون الإطار</label><input type="color" id="edStroke" value="' + (T.stroke ? rgbHex(T.stroke) : '#000000') + '"></div><div class="field"><label>سُمك الإطار</label><input type="number" id="edSw" value="' + Math.round(T.sw||0) + '"></div></div>';
      h += '<div class="field"><label>الخط PostScript</label><input type="text" id="edFont" dir="ltr" value="' + esc(T.font||'') + '"></div>';
      if(ED.kids && ED.kids.length) h += '<div class="hint">الستايل ده عامل ' + ED.kids.length + ' طبقة مربوطة باللاير (اسمها HAMDY STYLE). أي حركة أو تعديل بيمشي عليهم كمان.</div>';
    }
    h += '<button class="btn warn" id="clear">شيل كل حاجات الكيت من اللاير</button>';
  }
  return h;
}
function bindEditSide(){
  if($('edRead')) $('edRead').onclick = function(){ edRefresh(true); };
  if($('edPaste')) $('edPaste').onclick = clipPaste;
  if(!ED || !ED.layer) return;
  function on(id, ev, fn){ var e = $(id); if(e) e.addEventListener(ev, fn); }
  on('edOp', 'change', function(){ edSend('setLayer', {op:+this.value}); });
  on('edOut', 'change', function(){ edSend('setLayer', {outF:+this.value}); });
  on('edText', 'change', function(){ edSend('setText', {text:this.value}); });
  on('edSize', 'change', function(){ edSend('setText', {size:+this.value}); });
  on('edTrk', 'change', function(){ edSend('setText', {trk:+this.value}); });
  on('edFill', 'change', function(){ edSend('setText', {fill:hexRGB(this.value)}); });
  on('edStroke', 'change', function(){ edSend('setText', {stroke:hexRGB(this.value), sw:Math.max(1, +($('edSw').value)||4)}); });
  on('edSw', 'change', function(){ edSend('setText', {sw:+this.value}); });
  on('edFont', 'change', function(){ if(this.value) edSend('setText', {font:this.value}); });
  var bl = $('edBlend');
  if(bl) Array.prototype.forEach.call(bl.children, function(b){ b.onclick = function(){ edSend('setLayer', {blend:b.dataset.v}).then(function(r){ if(r.ok){ Array.prototype.forEach.call(bl.children, function(x){ x.classList.toggle('on', x===b); }); } }); }; });
  if($('clear')) $('clear').onclick = function(){ host('clearNabd').then(function(r){ say(r); edRefresh(true); }); };
}
setInterval(function(){
  if(S.tab!=='ed' || !CEP || S.paused) return;
  if(!S.ed.auto && !ED_DIRTY) return;
  var a = document.activeElement;
  if(a && /INPUT|TEXTAREA|SELECT/.test(a.tagName) && a.id!=='q') return;
  edRefresh(false);
}, 1500);

/* ============================================================ animate */
// previews: only cards on screen move, grid at a lower frame rate, heavy SVG cards even lower
var IO = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.target._o) e.target._o.vis = e.isIntersecting; }); }, {root:null, rootMargin:'60px'}) : null;
function watchVis(o){ if(IO && o.box){ o.vis = false; o.box._o = o; IO.observe(o.box); } }
var lastGrid = 0;
function tick(now){
  if(!document.hidden){
    var light = S.perf === 'light', gap = light ? 1000/12 : 1000/30;
    if(!S.paused && now - lastGrid >= gap){
      lastGrid = now;
      for(var i=0;i<live.length;i++){
        var o = live[i];
        if(o.vis === false) continue;
        if(o.heavy && now - (o.lt||0) < (light ? 250 : 90)) continue;
        o.lt = now;
        try{ step(o, now); }catch(e){}
      }
    }
    if(stageEl){ try{ step(stageEl, now); }catch(e){} }
  }
  requestAnimationFrame(tick);
}
function step(o, now){
  var t = (now - o.t0)/1000;
  switch(o.k){
    case 'tr': P.drawTr(o.el, o.it.id, t, S.tr.frames, S.tr.snappy, S.acc); break;
    case 'mp': P.drawMp(o.el, mpSided(o.it), t, {dir:S.mp.dir, frames:S.mp.frames, pivot:S.mp.pivot, loopAmt:S.mp.loopAmt || 100, bnc:S.mp.bnc ? {n:S.mp.bncN || 2, amt:S.mp.bncAmt || 50} : null}); break;
    case 'tx': P.drawTx(o.el, o.it, t, (o.it.tw ? S.tx.doIn : true), o.it.loop ? false : S.tx.doOut, S.acc, (o.it.random||o.it.overshoot) ? 'normal' : S.tx.pattern, S.tx.cps); break;
    case 'spr': P.drawSprite(o.el, t); break;
    case 'ln': P.drawLine(o.el, t); break;
    case 'car': P.drawCar(o.el, t); break;
    case 'trk': o.box.innerHTML = P.trkSVG(o.it, t, S.acc); break;
    case 'gf': o.box.innerHTML = P.gfSVG(o.it, t, S.acc); break;
    case 'trim': P.drawTrim(o.el, t); break;
    case 'tpl': P.drawTpl(o.el, t, tplOpts(o.it)); break;
    case 'dp': P.drawDepth(o.el, t, S.dp, S.acc); break;
    case 'bg': drawBg(o.el, o.it, t); break;
    case 'ti': P.drawTitle(o.el, t); break;
    case 'el': o.box.innerHTML = P.elSVG(o.it.id, t, S.acc); break;
    case 'ez': P.drawEz(o.el, t); break;
    case 'cap': P.drawCap(o.el, t); break;
    case 'fx': P.drawLook(o.el, t); break;
    case 'sfx': if(AUD && AUD._id===o.it.id && !AUD.paused){ var pr = AUD.currentTime/(AUD.duration||1); o.box.innerHTML = P.waveSVG(o.it.pk||[], pr, S.acc); } break;
  }
}

/* =============================================================== boot */
P.injectFilters();
setAcc();
$('acc').value = S.acc;
$('acc').addEventListener('input', function(){ S.acc = this.value; save(); setAcc(); });
$('q').addEventListener('input', renderGrid);
$('pause').onclick = function(){ S.paused = !S.paused; save(); this.textContent = S.paused ? '▶' : '⏸'; };
$('pause').textContent = S.paused ? '▶' : '⏸';
function setStatus(r){
  var st = $('status');
  if(!CEP){ st.className='chip mock'; st.innerHTML='<i></i><span>وضع المعاينة</span>'; return; }
  if(r && r.ok && r.data && r.data.ver && r.data.ver !== HMK.ver){ st.className='chip'; st.title = trText('المحرك اللي جوه الأفتر نسخة قديمة') + ' (' + r.data.ver + ' ≠ ' + HMK.ver + ')'; st.innerHTML='<i style="background:#e0a030"></i><span>' + trText('محرك قديم') + ' ' + esc(r.data.ver) + ' ⟳</span>'; return; }
  if(r && r.ok && r.data && r.data.w && r.data.h && (r.data.w !== COMP.w || r.data.h !== COMP.h)){ COMP = {w:r.data.w, h:r.data.h}; if(S.tab === 'ln') liveStage(); }
  if(r && r.ok && r.data && r.data.proj !== undefined && r.data.proj !== PROJ){ PROJ = r.data.proj; if(S.filter[S.tab] === RECENT_G) renderGrid(); }
  if(r && r.ok){ st.className='chip live'; st.innerHTML='<i></i><span>' + (r.data.comp ? esc(r.data.comp) : 'متصل') + '</span>'; }
  else if(r && r.code === 'TIMEOUT'){ st.className='chip'; st.title = trText('الأفتر مشغول بحاجة تانية (ريندر، بريفيو، أو نافذة مفتوحة). أول ما يفضى هيرجع لوحده.'); st.innerHTML='<i style="background:#e0a030"></i><span>' + trText('الأفتر مشغول…') + '</span>'; }
  else { st.className='chip'; st.title = trText('دوس هنا عشان أشغّله تاني'); st.innerHTML='<i style="background:var(--bad)"></i><span>' + trText('المحرك مش شغال') + ' ⟳</span>'; }
}
var ENG_FAILS = 0;
function engineRetry(manual){
  if(!CEP) return;
  PINGING = true;
  ensureEngine(true).then(function(r){ PINGING = false; setStatus(r); ENG_FAILS = r && r.ok ? 0 : ENG_FAILS + 1;
    if(manual){ var el = $('toast'); if(!el) return; var ok = r && r.ok && r.data && r.data.ver === HMK.ver; el.className = 'toast ' + (ok ? 'ok' : 'bad'); el.textContent = ok ? trText('المحرك اشتغل ✓') : trText('لسه مش شغال. اقفل البانل وافتحها تاني من Window › Extensions، ولو فضل كده اقفل الأفتر وافتحه.') + (r && r.msg ? ' (' + String(r.msg).slice(0, 120) + ')' : ''); clearTimeout(el._t); el._t = setTimeout(function(){ el.className = 'toast'; }, 9000); } });
}
var AI = HMK_MAKE_AI({S:S, host:host, save:save, say:say, $:$, esc:esc, NODE:NODE, CEP:CEP, apply:apply, itemsOf:itemsOf, byId:byId, trText:trText, seg:seg, chk:chk, openURL:openURL, extPath:extPath, rawEval:rawEval, MSG:MSG, dirty:function(){ ED_DIRTY = true; }});
AI.init();
var STOCK = HMK_MAKE_STOCK({S:S, host:host, save:save, say:say, $:$, esc:esc, NODE:NODE, CEP:CEP, trText:trText, seg:seg, chk:chk, openURL:openURL});
applyLang();
initLayout();
renderAll();
if(S.tab==='ed') edRefresh(true);
requestAnimationFrame(tick);
ensureEngine(true).then(function(r){ setStatus(r); if(CEP && S.lib.paths.length) refreshLib(); }); // always reload the engine when the panel opens, so an update takes effect right away
if($('verTxt')) $('verTxt').textContent = HMK.ver;
if($('langBtn')) $('langBtn').onclick = function(){ setLang(S.lang === 'en' ? 'ar' : 'en'); };
if($('hideBtn')){ $('hideBtn').classList.toggle('on', S.hide !== false); $('hideBtn').onclick = function(){ S.hide = S.hide === false; save(); $('hideBtn').classList.toggle('on', S.hide !== false); say({ok:true, data: S.hide !== false ? 'OK_HIDE_ON' : 'OK_HIDE_OFF'}); }; }
if($('qsBtn')) $('qsBtn').onclick = function(){ qsOpen(); };
HMK_UPD.onStatus(function(msg, kind){ var t = $('toast'); if(!t) return; t.className = 'toast ' + (kind==='bad' ? 'bad' : (kind==='ok' ? 'ok' : '')); t.textContent = msg; clearTimeout(t._h); t._h = setTimeout(function(){ t.className = 'toast'; }, 6000); });
if($('updBtn')) $('updBtn').onclick = function(){ HMK_UPD.check(true); };
try{ var up = localStorage.getItem('hmk_updated_to'); if(up){ localStorage.removeItem('hmk_updated_to'); setTimeout(function(){ say({ok:true, data:'OK_UPDATED'}); }, 600); } }catch(e){}
setTimeout(function(){ HMK_UPD.check(false); }, 2500);
var PINGING = false;
if(CEP) setInterval(function(){ if(PINGING || document.hidden) return; PINGING = true; host('ping').then(function(r){ PINGING = false; if(r && ((!r.ok && r.code !== 'TIMEOUT') || (r.ok && r.data && r.data.ver !== HMK.ver)) && ENG_FAILS < 3) return engineRetry(false); if(r && r.ok) ENG_FAILS = 0; setStatus(r); }); }, 5000);
if($('status')) $('status').addEventListener('click', function(){ if(CEP && !this.classList.contains('live')) engineRetry(true); });
})();
