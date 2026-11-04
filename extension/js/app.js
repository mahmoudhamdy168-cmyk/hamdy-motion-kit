/* NABD Motion Kit v0.3 — panel UI */
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
  {id:'trk', ar:'🎯 تراكينج'},
  {id:'trim', ar:'✂ تريم باث'},
  {id:'gf', ar:'✨ جنريتيف فيل'},
  {id:'ti',  ar:'عناوين جاهزة'},
  {id:'el',  ar:'عناصر'},
  {id:'fx',  ar:'فلاتر وإفكتات'},
  {id:'cap', ar:'الكابشن'},
  {id:'sfx', ar:'الأصوات'},
  {id:'ez',  ar:'الإيز'},
  {id:'lib', ar:'المكتبة'},
  {id:'tl',  ar:'أدوات'},
  {id:'ed',  ar:'✎ تعديل'}
];
var KIND_AR = {'in':'دخول وخروج', emph:'تأكيد عند البلاي هيد', loop:'لوب على طول اللاير'};

var MSG = {
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
  NO_CARD:'حدد كارت من كروت الكاروسيل (لاير اسمه NABD CAROUSEL … | card).',
  COLOR_CARD:'الكارت ده لون مش صورة. اعمل الكاروسيل بـ "صور" أو "صور + ألوان" وحط صورة في الخانة دي.',
  NO_COMP:'افتح كومبوزيشن الأول.',
  NO_KEYS:'حدد كي فريمز في التايملاين الأول.',
  NO_PROPS:'حدد خاصية زي Position أو Scale الأول.',
  NO_TEXT:'اكتب النص الأول.',
  NO_TEXT_LAYER:'حدد لاير تكست أو أكتر.',
  NO_LAYERS:'حدد لاير أو أكتر.',
  NO_ANIM_LAYER:'حدد لاير ينفع يتحرك (مش كاميرا أو نل).',
  NEED2:'حدد لايرين أو أكتر.',
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
  tab:'tr', paused:false, acc:'#ff6b3d',
  sel:{tr:'zoomIn', mp:'overBottom', tx:'fadeUp', ti:'cine1', el:'burst', cap:'karaoke', sfx:'whoosh_soft', ts:'sticker', fx:'tealOrange', ez:'expo', lib:null, tl:'anchor', ed:null, ln:'trZig', car:'car0', trk:'tPoint', trim:'mDraw', gf:'gErase'},
  filter:{},
  tr:{frames:12, snappy:true, sfx:true, flip:false, mframes:20},
  mp:{dir:'both', frames:18, at:'layer'},
  tx:{text:'حركة النص', based:'auto', frames:20, size:110, secs:3, doIn:true, doOut:true, font:'', pattern:'normal', cps:14, cursor:true, typeSfx:true},
  cap:{provider:'deepgram', keys:{deepgram:'', groq:'', openai:''}, lang:'ar-EG', maxWords:3, maxChars:26, size:70, y:72, font:'', upper:false, stroke:false, shadow:true, box:false, boxOp:75, color:'#ffffff', words:[], caps:[], src:''},
  sfx:{key:'', prompt:'', dur:2, gen:[]},
  fx:{mode:'playhead', amount:100},
  ti:{texts:{}, secs:4, side:'r', font:''},
  el:{secs:4, blend:'screen', amount:100},
  ed:{auto:true},
  trk:{smooth:0, rot:true, scale:true, text:'اكتب هنا', size:60, side:'r', amount:40, zoom:6, swap:false, stabRot:true},
  trim:{frames:24, stagger:0, width:4, stroke:'fill', snappy:true, at:'layer', seg:25, speed:100, addStroke:false, fillAfter:false, strokeFade:false},
  gf:{provider:'stability', key:'', prompt:'', search:'', grow:12, feather:14, hold:'layer', patch:true, follow:false, out:'916', lastPS:null},
  car:{count:8, content:'images', images:[], palette:0, colA:'#ff6b3d', colB:'#3d73ff', aspect:1, design:'clean', round:12, border:0, borderColor:'#ffffff', motion:0, speed:30, reverse:false, hold:1, tiltX:-12, backFade:35, backDim:30, blur:false, orbit:true, spokes:false, chain:false, lineStyle:'solid', lineColor:'#ffffff', intro:true, person:false, secs:8, size:100, radius:100, face:0},
  ln:{frames:20, secs:3, col:'accW', width:100, erase:true, speed:100, flow:'travel', guide:true, reverse:false, text:'نص ماشي على خط', size:90, snappy:true, sfx:true, at:'layer'},
  lib:{paths:[], fit:true, screen:false},
  tl:{size:0, fps:30, secs:10, name:'', stagger:3, overlap:0, pct:150, nudge:1, deep:false, plat:'reels', zones:true, safe:true, thirds:false, center:false}
};
var S = load();
function load(){
  var s = JSON.parse(JSON.stringify(DEF)), saved = null;
  try{ saved = JSON.parse(localStorage.getItem('hmk_state') || localStorage.getItem('nabd_state4') || 'null'); }catch(e){}
  if(saved){ for(var k in saved){ if(saved[k] && typeof saved[k]==='object' && !Array.isArray(saved[k]) && s[k] && typeof s[k]==='object'){ for(var j in saved[k]) s[k][j]=saved[k][j]; } else s[k]=saved[k]; } }
  if(!Array.isArray(s.lib.paths)) s.lib.paths = [];
  if(!s.cap.keys) s.cap.keys = {deepgram:'', groq:'', openai:''};
  if(!Array.isArray(s.sfx.gen)) s.sfx.gen = [];
  return s;
}
function save(){ try{ localStorage.setItem('hmk_state', JSON.stringify(S)); }catch(e){} }

/* ========================================================= host bridge */
var CEP = !!(window.__adobe_cep__);
var LIBFILES = [];
function asciiJSON(o){ return JSON.stringify(o).replace(/[\u007f-￿]/g, function(c){ return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4); }); }
function rawEval(script){ return new Promise(function(res){ window.__adobe_cep__.evalScript(script, function(r){ res(r); }); }); }
function host(cmd, args){
  var payload = {cmd:cmd}; for(var k in (args||{})) payload[k]=args[k];
  if(!CEP) return new Promise(function(res){ setTimeout(function(){ res(mock(payload)); }, 120); });
  return rawEval('NABD.run(' + JSON.stringify(asciiJSON(payload)) + ')').then(function(r){
    try{ return JSON.parse(r); }catch(e){ return {ok:false, code:'NO_ENGINE', msg:String(r)}; }
  });
}
function extPath(){
  var p = decodeURI(window.__adobe_cep__.getSystemPath('extension'));
  return /^Win/i.test(navigator.platform) ? p.replace('file:///','') : p.replace('file://','');
}
function ensureEngine(){
  if(!CEP) return Promise.resolve(null);
  return host('ping').then(function(r){
    if(r.ok && r.data && r.data.ver===HMK.ver) return r;
    var f = (extPath() + '/jsx/host.jsx').replace(/\\/g,'/');
    return rawEval('$.evalFile("' + f.replace(/"/g,'\\"') + '")').then(function(){ return host('ping'); });
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
    if(!m && /^OK_SKIPPED:/.test(d)) m = 'تم ✓ واتساب ' + d.split(':')[1] + ' لاير (عليه كي فريمز في الأنكور)';
    el.className='toast ok'; el.textContent = m || 'تم ✓';
  } else {
    el.className='toast bad'; el.textContent = MSG[r.code] || ('حصل خطأ: ' + (r.msg || r.code));
  }
  clearTimeout(el._t); el._t = setTimeout(function(){ el.className='toast'; }, 5500);
}

/* ============================================================ helpers */
var $ = function(id){ return document.getElementById(id); };
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function hexRGB(h){ h = String(h).replace('#',''); return [parseInt(h.substr(0,2),16)/255, parseInt(h.substr(2,2),16)/255, parseInt(h.substr(4,2),16)/255]; }
function byId(list, id){ for(var i=0;i<list.length;i++) if(list[i].id===id) return list[i]; return null; }
function setAcc(){ document.documentElement.style.setProperty('--acc', S.acc); }
var TLABEL = {ffx:'FX', video:'VIDEO', image:'IMG', audio:'SFX'};
function typeName(t){ return {ffx:'بريسيتس', video:'فيديو', image:'صور', audio:'أصوات'}[t] || t; }
function folderName(p){ var s = String(p).replace(/[\\\/]+$/,''); return s.split(/[\\\/]/).pop(); }

function itemsOf(tab){
  switch(tab){
    case 'tr': return D.TRANSITIONS;
    case 'mp': return D.MOTION;
    case 'tx': return D.TEXTS;
    case 'ti': return D.TITLES;
    case 'el': return D.ELEMENTS;
    case 'ez': return D.EASES;
    case 'tl': return D.TOOLS;
    case 'cap': return D.CAPSTYLES;
    case 'ts': return D.TSTYLES;
    case 'fx': return D.FILTERS;
    case 'sfx': return NABD_SFX.concat(S.sfx.gen);
    case 'ed': return [];
    case 'ln': return NABD_LINES.LIST;
    case 'car': return NABD_CAR.SHAPES;
    case 'trk': return NABD_TOOLS2.TRK;
    case 'gf': return NABD_TOOLS2.GF;
    case 'trim': return NABD_TOOLS2.TRIM;
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
          three:!!tp.three, wig:tp.wig||0, amt:tp.amt||null, src:tp.src||null, tw:!!tp.tw, twEase:tp.twEase||null, twOrder:tp.twOrder||null, twDur:tp.twDur||0, trail:tp.trail||null};
}
function mpSpec(m){ return {id:m.id, kind:m.kind, ease:m.ease, tr:m.tr, keys:m.keys, ex:m.ex, wa:m.wa, feather:m.feather, dbDir:m.dbDir}; }
function tiTexts(ti){
  var saved = S.ti.texts[ti.id] || [];
  return ti.lines.map(function(l, i){ return saved[i]!==undefined ? saved[i] : l; });
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
  var groups = ['الكل'];
  its.forEach(function(it){ if(groups.indexOf(it.g)<0) groups.push(it.g); });
  if(groups.indexOf(fl)<0) fl = 'الكل';
  $('filters').innerHTML = groups.length>2 ? groups.map(function(g){ return '<button class="' + (g===fl?'on':'') + '">' + g + '</button>'; }).join('') : '';
  Array.prototype.forEach.call($('filters').children, function(b){ b.onclick = function(){ S.filter[S.tab] = b.textContent; save(); renderGrid(); }; });
  $('count').textContent = its.length + ' عنصر';

  var grid = $('grid'); grid.innerHTML = ''; live = [];
  grid.className = 'grid' + (S.tab==='tl' ? ' small' : '');
  if(S.tab==='ed'){ $('filters').innerHTML=''; renderEdit(); return; }
  var shown = its.filter(function(it){
    if(fl!=='الكل' && it.g!==fl) return false;
    if(q && (it.ar + ' ' + (it.en||'')).toLowerCase().indexOf(q)<0) return false;
    return true;
  });
  if(!shown.length){
    grid.innerHTML = '<div class="empty">' + (S.tab==='lib' ? (S.lib.paths.length ? 'مفيش ملفات في الفولدرات دي. ضيف بريسيتس .ffx أو أوفرليز أو أصوات ودوس "تحديث".' : 'ضيف فولدر الريسورسز بتاعك من اللوحة اللي على اليمين (زي Add Folder).') : 'مفيش نتايج.') + '</div>';
    return;
  }
  shown.forEach(function(it){
    var c = document.createElement('div');
    c.className = 'card' + (S.sel[S.tab]===it.id ? ' sel' : '');
    c.innerHTML = '<div class="thumb"></div><div class="nm"><span>' + esc(it.ar) + '</span><em>' + esc(it.en||'') + '</em></div>';
    var th = c.firstChild;
    mountThumb(th, it, false);
    c.onclick = function(){ S.sel[S.tab] = it.id; save(); Array.prototype.forEach.call(grid.children, function(x){ x.classList.remove('sel'); }); c.classList.add('sel'); if(S.tab==='cap' && S.cap.words.length) rechunk(); renderSide(); if(S.tab==='sfx') playSfx(it); };
    c.ondblclick = function(){ S.sel[S.tab] = it.id; renderSide(); apply(); };
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
      o = {k:'tr', it:it, el:P.mountTr(box)}; break;
    case 'mp': o = {k:'mp', it:it, el:P.mountMp(box)}; break;
    case 'tx':
      var txt = big ? (S.tx.text || ' ') : (it.latin ? 'MOTION' : 'حركة النص');
      var fs = big ? Math.max(18, Math.min(46, 260/Math.max(4, (S.tx.text||'').length*0.75))) : 24;
      o = {k:'tx', it:it, el:P.mountTx(box, txt, (it.src||it.tw) ? 'chars' : S.tx.based, fs)}; break;
    case 'ti': o = {k:'ti', it:it, el:P.mountTitle(box, it, tiTexts(it), {side:it.side || S.ti.side})}; break;
    case 'cap': o = {k:'cap', it:it, el:P.mountCap(box, it, capOpt(big))}; break;
    case 'ts': P.mountStyle(box, it, big ? (S.tx.text || 'حمدي') : 'حمدي', S.acc); break;
    case 'fx': o = {k:'fx', it:it, el:P.mountLook(box, it, big)}; break;
    case 'sfx': box.classList.add('svgth'); box.innerHTML = P.waveSVG(it.pk || [], undefined, S.acc) + '<span class="badge">' + (it.dur ? it.dur.toFixed(1) + 's' : 'AI') + '</span>'; if(big) o = {k:'sfx', it:it, box:box}; break;
    case 'el':
      if(it.ov){ o = {k:'spr', el:P.mountSprite(box, 'assets/' + it.ov.thumb, 'ov')}; break; }
      o = {k:'el', it:it, box:box}; box.classList.add('elx'); break;
    case 'ez': o = {k:'ez', it:it, el:P.mountEz(box, it)}; break;
    case 'car': o = {k:'car', el:P.mountCar(box, it, carOpts(big))}; break;
    case 'trk': o = {k:'trk', it:it, box:box}; break;
    case 'gf': o = {k:'gf', it:it, box:box}; break;
    case 'trim': o = {k:'trim', el:P.mountTrim(box, trimItem(it), {acc:S.acc})}; break;
    case 'ln': var lc = lnColors(); o = {k:'ln', el:P.mountLine(box, it, {c1:lc[0], c2:lc[1], width:S.ln.width, speed:S.ln.speed, erase:S.ln.erase, flow:S.ln.flow, guide:S.ln.guide, text:big ? S.ln.text : 'نص على خط'})}; break;
    case 'tl': box.classList.add('svgth'); box.innerHTML = it.id==='guides' ? guideSVG(byId(D.GUIDES, S.tl.plat), S.tl) : toolSVG(it.id); break;
    case 'lib': box.innerHTML = libThumb(it.f, big) + '<span class="badge">' + TLABEL[it.f.type] + '</span>'; break;
  }
  if(o){ o.t0 = now - off; if(big) stageEl = o; else live.push(o); }
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
  if(!it && S.tab!=='lib' && S.tab!=='ed'){ side.innerHTML=''; return; }
  switch(S.tab){
    case 'tr':
      if(it.matte){
        h += '<div class="stage" id="stage"></div>' + head(it, it.d);
        h += '<div class="field"><span class="lbl">المدة (فريمات)</span>' + seg('tr.mframes', [[12,'12'],[16,'16'],[20,'20'],[26,'26'],[34,'34'],[45,'45']], S.tr.mframes) + '</div>';
        h += '<div class="row">' + chk('tr.flip', 'اقلب الماسك', S.tr.flip) + chk('tr.sfx', 'صوت ووش', S.tr.sfx) + '</div>';
        h += '<button class="btn primary" id="go">حط الترانزيشن</button>';
        h += '<div class="hint">حدد كليبين (القديم والجديد) والماسك هيتحط على القطع. لو حددت لاير واحد بس، بيعمله ظهور بالماسك ده من أول اللاير. الماسك لاير فيديو حقيقي اسمه NABD MATTE فتقدر تكبّره أو تحركه.</div>';
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
      if(it.kind!=='loop') h += '<div class="field"><span class="lbl">المدة (فريمات)</span>' + seg('mp.frames', [[10,'10'],[14,'14'],[18,'18'],[24,'24'],[30,'30'],[40,'40']], S.mp.frames) + '</div>';
      h += '<button class="btn primary" id="go">طبّق على اللايرات المحددة</button>';
      h += '<button class="btn warn" id="clear">شيل حركات الكيت من المحدد</button>';
      h += '<div class="hint">بتشتغل على أي لاير: تكست، شيب، صورة أو فيديو. بتنزل كإفكت اسمه NABD في Effect Controls، فاللاير نفسه وكي فريمز بتوعك مبيتلمسوش.</div>';
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
      if(it.src) h += '<div class="hint">الكتابة دي حقيقية من Source Text، فالحروف العربي بتتوصل وانت بتكتب. السرعة والمؤشر بيتعدلوا بعدين من صفحة التعديل أو من Effect Controls (NABD TYPE).</div>';
      else if(it.tw) h += '<div class="hint">كل حرف بيظهر بالحركة دي على حسب سرعة الكتابة. تقدر تغيّر السرعة بعدين من NABD TYPE Speed.</div>';
      else h += '<div class="hint">' + (it.latin ? 'الحركة دي معمولة للإنجليزي (بتبدّل الحروف).' : 'في التلقائي: العربي بيتحرك كلمة كلمة علشان الحروف متتقطعش، والإنجليزي حرف حرف.') + '</div>';
      break;
    case 'ti':
      h += '<div class="stage" id="stage"></div>' + head(it, '');
      var L = tiTexts(it), labels = it.counter ? ['من','إلى','بعد الرقم (+ أو %)'] : (it.countdown ? ['عدد الثواني'] : (it.progress ? ['النسبة %'] : ['السطر الأول','السطر التاني','السطر التالت']));
      L.forEach(function(v, i){ h += '<div class="field"><label>' + labels[i] + '</label><input type="text" class="tiline" data-i="' + i + '" dir="auto" value="' + esc(v) + '"></div>'; });
      if(it.place==='lower') h += '<div class="field"><span class="lbl">الناحية</span>' + seg('ti.side', [['r','يمين'],['c','نص'],['l','شمال']], S.ti.side) + '</div>';
      h += '<div class="row">' + num('ti.secs','المدة (ثواني)',S.ti.secs) + '<div class="field"><label>الخط (PostScript)</label><input type="text" data-k="ti.font" dir="ltr" placeholder="Cairo-Bold" value="' + esc(S.ti.font) + '"></div></div>';
      h += '<button class="btn primary" id="go">ضيف العنوان عند البلاي هيد</button>';
      h += '<div class="hint">العنوان بينزل لايرات مربوطة بـ Null اسمه NABD TITLE، فتحرّكه أو تكبّره كله مرة واحدة، وتعدّل الكلام من اللاير نفسه. البوكسات بتكبر مع الكلام لوحدها.</div>';
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
      h += '<div class="hint">الستايل بيغيّر لون النص والإطار وبيضيف إفكتات اسمها NABD STYLE (ظل، توهج، جرادينت، لمعة، بوكس). لو طبّقت ستايل تاني بيحل مكان القديم. وتقدر تحط عليه أي حركة من تاب حركة النص.</div>';
      break;
    case 'fx':
      h += '<div class="stage" id="stage"></div>' + head(it, {look:'فلتر ألوان', vfx:'إفكت فيديو', afx:'إفكت صوت'}[it.kind] + ' · ' + it.g);
      if(it.kind !== 'afx'){
        h += '<div class="field"><span class="lbl">يتحط على</span>' + seg('fx.mode', [['playhead','أدجستمنت من البلاي هيد'],['whole','أدجستمنت للكومب كله'],['selected','اللايرات المحددة']], S.fx.mode) + '</div>';
        if(S.fx.mode !== 'selected') h += '<div class="field"><span class="lbl">القوة</span>' + seg('fx.amount', [[25,'25%'],[50,'50%'],[75,'75%'],[100,'100%']], S.fx.amount) + '</div>';
      }
      h += '<button class="btn primary" id="go">' + (it.kind==='afx' ? 'طبّق على لايرات الصوت المحددة' : 'طبّق') + '</button>';
      h += '<div class="hint">' + (it.kind==='afx' ? 'حدد لاير فيه صوت (فيديو أو أوديو). الإفكتات بتنزل باسم NABD AUDIO وتقدر تظبطها من Effect Controls.' : 'الفلتر بيتعمل من إفكتات After Effects الأصلية، فكل حاجة فيه تتعدّل من Effect Controls. المعاينة تقريبية، وفي الكبيرة اسحب عينك على الخط: شمال قبل ويمين بعد.') + '</div>';
      break;
    case 'sfx': h += sfxSide(it); break;
    case 'ez':
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
    case 'ln': h += lineSide(it); break;
    case 'car': h += carSide(it); break;
    case 'trk': h += trkSide(it); break;
    case 'gf': h += gfSide(it); break;
    case 'trim': h += trimSide(it); break;
    case 'tl':
      h += '<div class="stage svgth" id="stage">' + (it.id==='guides' ? guideSVG(byId(D.GUIDES, S.tl.plat), S.tl) : toolSVG(it.id)) + '</div>' + head(it, it.d);
      h += toolControls(it);
      break;
  }
  h += '<div class="toast" id="toast"></div>';
  side.innerHTML = h;
  var st = $('stage');
  if(st && it && S.tab!=='tl' && S.tab!=='ed') mountThumb(st, it, true);
  if(S.tab==='ed') bindEditSide();
  if(S.tab==='car') bindCar();
  if(S.tab==='trk') bindTrk();
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
      h += '<div class="row">' + num('tl.secs','ثواني',S.tl.secs) + '<div class="field"><label>الاسم</label><input type="text" data-k="tl.name" value="' + esc(S.tl.name) + '" placeholder="NABD Comp"></div></div>';
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
function bindSide(){
  var side = $('side');
  Array.prototype.forEach.call(side.querySelectorAll('[data-seg]'), function(g){
    Array.prototype.forEach.call(g.children, function(b){
      b.onclick = function(){
        var v = b.dataset.v; if(v==='true') v=true; else if(v==='false') v=false; else if(v!=='' && !isNaN(+v)) v=+v;
        setPath(g.dataset.seg, v);
        Array.prototype.forEach.call(g.children, function(x){ x.classList.toggle('on', x===b); });
        var k = g.dataset.seg;
        if(k==='cap.maxWords' && S.cap.words.length) rechunk();
        if(/^(ln|car|trim|trk|gf)\./.test(k) || k==='tx.based' || k==='tx.cps' || k==='ti.side' || k==='tl.plat' || k==='tx.pattern' || /^(cap|fx)\./.test(k)){ renderSide(); renderGrid(); }
        else if(k==='tr.frames' || k==='tr.snappy' || k==='mp.dir' || k==='mp.frames'){ /* previews read state live */ }
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
      if(/^ln\.(erase|guide|speed)$/.test(inp.dataset.k) && $('stage')) mountThumb($('stage'), cur(), true);
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

function txArgs(){
  var tp = cur();
  return {spec:txSpec(tp), based:S.tx.based, frames:S.tx.frames, size:S.tx.size, secs:S.tx.secs, doIn:S.tx.doIn, doOut:S.tx.doOut, text:S.tx.text, font:S.tx.font,
          cps:S.tx.cps, cursor:S.tx.cursor, acc:hexRGB(S.acc), sfx:((tp.src||tp.tw) && S.tx.typeSfx) ? sfxPath({id:'typing'}) : null};
}
var orgArm = 0;
function apply(){
  var it = cur(); if(!it) return;
  var p, acc = hexRGB(S.acc);
  switch(S.tab){
    case 'tr':
      if(it.matte){ p = host('matteTr', {file:assetPath(it.matte.file), frames:S.tr.mframes, flip:S.tr.flip, sfx:S.tr.sfx ? sfxPath({id:'whoosh_soft'}) : null}); break; }
      p = host('transition', {type:it.id, frames:S.tr.frames, snappy:S.tr.snappy, sfx:S.tr.sfx, libPaths:S.lib.paths, acc:acc}); break;
    case 'mp': p = host('motion', {spec:mpSpec(it), dir:S.mp.dir, frames:S.mp.frames, at:S.mp.at}); break;
    case 'tx': if(S.tab==='tx' && S.sel.tx){ p = host('textCreate', txArgs()); } break;
    case 'ti': p = host('title', titleArgs(it)); break;
    case 'el':
      if(it.ov){ p = host('overlay', {file:assetPath(it.ov.file), secs:S.el.secs, blend:S.el.blend, amount:S.el.amount, label:it.en, audio:false}); break; }
      p = host('element', {id:it.id, secs:S.el.secs, acc:acc}); break;
    case 'cap':
      if(!S.cap.caps.length){ say({ok:false, code:'NO_CAPS'}); return; }
      p = host('captions', {caps:S.cap.caps.map(function(c){ return {s:c.s, e:c.e, text:S.cap.upper ? c.text.toUpperCase() : c.text, words:c.w}; }), style:it,
        opts:{size:S.cap.size, y:S.cap.y, font:S.cap.font, stroke:S.cap.stroke, shadow:S.cap.shadow, box:S.cap.box, boxOp:S.cap.boxOp, color:hexRGB(S.cap.color), acc:acc, boxColor:[0,0,0]}});
      break;
    case 'sfx': p = host('libUse', {path:sfxPath(it), fit:false, screen:false}); break;
    case 'ts': p = host('textStyle', {st:stHost(it), mode:'selected'}); break;
    case 'fx': p = host('look', {ops:it.ops, kind:it.kind, label:it.en, mode:S.fx.mode, whole:S.fx.mode==='whole', amount:S.fx.amount}); break;
    case 'ln': p = lineApply(it, false); break;
    case 'car': p = host('carousel', carArgs(it)); break;
    case 'trk': p = trkApply(it); break;
    case 'trim': p = host('trimApply', trimArgs(it)); break;
    case 'gf': gfRun(it); return;
    case 'ez': p = it.expr ? host('expr', {id:it.id}) : host('ease', {mode:it.mode||'bez', i:it.i, o:it.o}); break;
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
        case 'newComp': var c = D.COMP_SIZES[+S.tl.size||0]; p = host('newComp', {w:c.w, h:c.h, fps:S.tl.fps, secs:S.tl.secs, name:S.tl.name || ('NABD ' + c.ar)}); break;
        case 'organize':
          if(Date.now() - orgArm > 4000){ orgArm = Date.now(); var t=$('toast'); t.className='toast info'; t.textContent='دوس تاني للتأكيد. هيتنقل كل حاجة لفولدرات ومش هيتمسح حاجة.'; return; }
          orgArm = 0; p = host('organize', {deep:S.tl.deep}); break;
        default: p = host(it.id);
      }
      break;
  }
  if(p) p.then(function(r){ say(r); if(r.ok) ED_DIRTY = true; });
}

function refreshLib(){
  if(!S.lib.paths.length){ LIBFILES = []; if(S.tab==='lib') renderAll(); return; }
  host('libList', {paths:S.lib.paths}).then(function(r){
    LIBFILES = r.ok ? (r.data.files || []) : [];
    if(!r.ok) say(r);
    if(S.tab==='lib') renderAll();
  });
}

function renderAll(){ document.body.classList.toggle('ed', S.tab==='ed'); renderTabs(); renderGrid(); renderSide(); $('q').placeholder = 'ابحث في ' + TABS.filter(function(t){ return t.id===S.tab; })[0].ar + '...'; }

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
      return (prov==='deepgram' ? dgTranscribe(aud, key) : whisperTranscribe(aud, key, prov)).then(function(words){
        var off = aud.raw ? -a : 0;
        S.cap.words = words.map(function(w){ return {w:w.w, s:src.inPoint + (w.s+off)*k, e:src.inPoint + (w.e+off)*k}; }).filter(function(w){ return w.e > src.inPoint - 0.01 && w.s < src.outPoint + 0.01; });
        S.cap.src = src.name; rechunk();
        setCapStatus('٤/٤ تم ✓ ' + S.cap.words.length + ' كلمة في ' + S.cap.caps.length + ' كابشن. راجعهم تحت وبعدين دوس "حط الكابشن".', 'okline');
        renderSide();
      });
    });
  }).catch(function(e){ setCapStatus('حصل خطأ: ' + (e && e.message || e), 'badline'); });
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
  h += '<div class="field"><span class="lbl">الخدمة</span>' + seg('cap.provider', [['deepgram','Deepgram'],['groq','Groq (مجاني)'],['openai','OpenAI']], S.cap.provider) + '</div>';
  h += '<div class="field"><label>مفتاح ' + {deepgram:'Deepgram', groq:'Groq', openai:'OpenAI'}[S.cap.provider] + ' (بيتحفظ على جهازك بس)</label><input type="password" id="capKey" dir="ltr" value="' + esc(S.cap.keys[S.cap.provider]||'') + '" placeholder="API key"></div>';
  h += '<div class="field"><label>اللغة واللهجة</label><select id="capLang">' + D.CAP_LANGS.map(function(l){ return '<option value="' + l[0] + '"' + (S.cap.lang===l[0]?' selected':'') + '>' + l[1] + '</option>'; }).join('') + '</select></div>';
  h += '<button class="btn primary" id="capGo">فرّغ اللاير المحدد</button>';
  h += '<div class="' + (CAP_STATUS ? 'hint' : 'hint') + '" id="capStatus">' + (CAP_STATUS || 'حدد لاير فيديو أو صوت في الكومب. بيتفرّغ الجزء اللي ظاهر منه بس (من In لـ Out).') + '</div>';
  h += '<div class="row"><button class="btn" id="srtIn">استيراد SRT</button><button class="btn" id="srtOut"' + (S.cap.caps.length?'':' disabled') + '>تصدير SRT</button></div>';
  h += '<div class="sect">٢. الشكل</div>';
  if(!it.maxWords) h += '<div class="field"><span class="lbl">أقصى كلمات في الكابشن</span>' + seg('cap.maxWords', [[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6']], S.cap.maxWords) + '</div>';
  h += '<div class="row">' + num('cap.size','الحجم',S.cap.size) + num('cap.y','المكان من فوق %',S.cap.y) + '</div>';
  h += '<div class="row"><div class="field"><label>لون الكلام</label><input type="color" data-k="cap.color" value="' + S.cap.color + '"></div><div class="field"><label>الخط (PostScript)</label><input type="text" data-k="cap.font" dir="ltr" placeholder="Cairo-Bold" value="' + esc(S.cap.font) + '"></div></div>';
  h += '<div class="row">' + chk('cap.shadow','ظل',S.cap.shadow) + chk('cap.stroke','إطار',S.cap.stroke) + chk('cap.box','بوكس ورا',S.cap.box) + chk('cap.upper','CAPS للإنجليزي',S.cap.upper) + '</div>';
  h += '<div class="sect">٣. راجع الكلام (' + S.cap.caps.length + ')</div>';
  if(S.cap.caps.length){
    h += '<div class="caplist">' + S.cap.caps.map(function(c,i){ return '<div class="capline"><span class="ct">' + fmtT(c.s) + '</span><input type="text" class="capedit" data-ci="' + i + '" dir="auto" value="' + esc(c.text) + '"></div>'; }).join('') + '</div>';
    h += '<div class="row"><button class="btn" id="capRe">قسّم تاني</button><button class="btn warn" id="capClear">امسح</button></div>';
  } else h += '<div class="pathline">لسه مفيش كابشن. المعاينة فوق بتوريك شكل الستايل.</div>';
  h += '<button class="btn primary" id="go"' + (S.cap.caps.length?'':' disabled') + '>حط الكابشن في الكومب</button>';
  h += '<div class="hint">كل كابشن بيبقى لاير تكست لوحده، كلهم مربوطين بـ Null اسمه NABD CAPTIONS، فتحرّكهم أو تكبّرهم مرة واحدة. Deepgram بيدعم 17 لهجة عربي منهم المصري، وGroq مجاني بس توقيت الكلمات فيه تقريبي.</div>';
  return h;
}
function bindCap(){
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
  var h = '<div class="stage svgth" id="stage"></div>' + head(it, (it.g||'') + (it.dur ? ' · ' + it.dur.toFixed(2) + ' ثانية' : ''));
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
    var fs = NODE('fs'), path = NODE('path'), dir = S.lib.paths[0] || path.join(NODE('os').homedir(), 'Documents', 'NABD SFX');
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
function lineSide(it){
  var h = '<div class="stage" id="stage"></div>' + head(it, it.g), m = it.mode;
  if(m==='path'){
    h += '<div class="field"><label>الكلام</label><textarea id="lnText" dir="auto">' + esc(S.ln.text) + '</textarea></div>';
    h += '<div class="field"><span class="lbl">الحركة</span>' + seg('ln.flow', [['travel','يمشي من أول الخط لآخره'],['loop','يلف على طول'],['static','ثابت على الخط']], S.ln.flow) + '</div>';
    h += '<div class="row">' + num('ln.size','الحجم',S.ln.size) + num('ln.secs','ثواني',S.ln.secs) + (S.ln.flow==='loop' ? num('ln.speed','السرعة',S.ln.speed) : '') + '</div>';
    h += '<div class="row">' + chk('ln.guide', 'ارسم الخط نفسه', S.ln.guide) + chk('ln.reverse', 'اعكس اتجاه المسار', S.ln.reverse) + '</div>';
    h += '<div class="field"><span class="lbl">لون الخط</span>' + seg('ln.col', LN_COLS, S.ln.col) + '</div>';
    h += '<button class="btn primary" id="go">اعمل نص جديد على المسار</button>';
    h += '<button class="btn" id="lnSel">حط التكست المحدد على المسار</button>';
    h += '<div class="hint">المسار بينزل كماسك اسمه NABD PATH على لاير النص: تقدر تسحب نقطه وتعدّل شكله براحتك والكلام والخط المرسوم بيمشوا عليه. السرعة ومكان النص من صفحة التعديل (NABD PATH).</div>';
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
    draw:'الخطوط شيب لاير حقيقي، والألوان والتخانة والتوقيت كلهم يتعدلوا من صفحة التعديل (NABD LINE).',
    travel:'لوب بيلف على طول اللاير. السرعة وطول الخط يتعدلوا من صفحة التعديل.',
    attach:'الخط بيتربط باللاير وبيكبر ويصغر مع الكلام لوحده، ولو حطيت حركة على اللاير بيتحرك معاه.'
  })[m] + '</div>';
  return h;
}
function lineApply(it, selected){
  var lc = lnColors().map(hexRGB), base = {kind:it.id, label:it.en, colors:lc, width:S.ln.width};
  switch(it.mode){
    case 'cover': base.mode = 'cover'; base.frames = S.ln.frames; base.snappy = S.ln.snappy; base.sfx = S.ln.sfx ? sfxPath({id:'whoosh_fast'}) : null; return host('lineFx', base);
    case 'draw': base.mode = 'draw'; base.frames = S.ln.frames; base.secs = S.ln.secs; base.erase = S.ln.erase; return host('lineFx', base);
    case 'travel': base.mode = 'travel'; base.secs = S.ln.secs; base.speed = S.ln.speed; return host('lineFx', base);
    case 'attach': base.frames = S.ln.frames; base.erase = S.ln.erase; base.at = S.ln.at; return host('lineAttach', base);
    case 'path': return host('textPath', {kind:it.id, mode:selected ? 'selected' : 'new', text:S.ln.text, size:S.ln.size, secs:S.ln.secs, font:S.tx.font, flow:S.ln.flow, speed:S.ln.speed, guide:S.ln.guide, reverse:S.ln.reverse, colors:lc});
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
  h += '<div class="hint">كل حاجة بتتعدل بعدين من صفحة التعديل (NABD CAROUSEL): الشكل نفسه (Shape من 0 لـ 16)، الحركة، السرعة، نص القطر، المسافات، الميل، الأركان، الإطار، الألوان، والخطوط. ولو عايز الكروت تلف حوالين شخص: اقطعه في لاير لوحده (Roto Brush)، حدده، وعلّم على الاختيار اللي فوق.</div>';
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
      h += '<div class="hint">المقاس والقوة بيتعدلوا بعدين من صفحة التعديل (NABD TRK Width / Height / Amount).</div>'; break;
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
  h += '<div class="hint">حدد شيب لاير أو أكتر، أو نص (بيتحوّل لشيب لوحده)، أو ملف Illustrator/SVG. بيتحط Trim Paths واحد على اللاير كله، والتحكم في البداية والنهاية والإزاحة من صفحة التعديل (NABD TRIM).</div>';
  return h;
}
function trimArgs(it){
  var t = S.trim, sc = t.stroke==='white' ? [1,1,1,1] : (t.stroke==='acc' ? hexRGB(S.acc).concat([1]) : null);
  return {style:it.style, frames:t.frames, stagger:t.stagger, individual:!!it.individual, addStroke:!!(it.addStroke || t.addStroke), fillAfter:!!(it.fillAfter || t.fillAfter), strokeFade:!!(it.strokeFade || t.strokeFade),
          width:t.width, strokeColor:sc, snappy:t.snappy, at:t.at, seg:t.seg, speed:t.speed};
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
    h += '<button class="btn primary" id="go">ابعت الفريم لفوتوشوب</button>';
    h += '<button class="btn" id="gfBack"' + (g.lastPS ? '' : ' disabled') + '>رجّعه من فوتوشوب</button>';
  } else h += '<button class="btn primary" id="go">' + (it.op==='caf' ? 'جهّز وافتح Content-Aware Fill' : 'نفّذ') + '</button>';
  h += '<div class="hint" id="gfStatus">' + (GF_STATUS || 'ده بيشتغل على فريم واحد (صورة). للقطات الثابتة بيفضل على طول اللاير، وللقطات المتحركة شغّل "خليها تمشي مع التراك" بعد ما تعمل تراك.') + '</div>';
  return h;
}
function setGf(msg, cls){ GF_STATUS = msg; var e = $('gfStatus'); if(e){ e.textContent = msg; e.className = 'hint' + (cls ? ' ' + cls : ''); } }
function bindGf(){
  var k = $('gfKey'); if(k) k.addEventListener('input', function(){ S.gf.key = k.value.trim(); save(); });
  var ko = $('gfKeyO'); if(ko) ko.addEventListener('input', function(){ S.cap.keys.openai = ko.value.trim(); save(); });
  if($('gfBack')) $('gfBack').onclick = function(){
    var L = S.gf.lastPS; if(!L) return;
    host('gfImport', {path:L.path, time:L.time, src:L.src, patch:S.gf.patch && !!L.src, hold:S.gf.hold, feather:S.gf.feather, grow:S.gf.grow, follow:S.gf.follow, label:'Photoshop'}).then(function(r){ say(r); if(r.ok) setGf('رجع من فوتوشوب واتحط ✓', 'okline'); });
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
  if(op==='caf'){ host('gfCAF', {grow:g.grow}).then(function(r){ say(r); if(r.ok) setGf('الماسك بقى Subtract واتفتح Content-Aware Fill: اختار Object أو Surface ودوس Generate Fill Layer.', 'okline'); }); return; }
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
      S.gf.lastPS = {path:F.frame, time:F.time, src:F.src}; save();
      return host('gfPhotoshop', {path:F.frame}).then(function(r){ say(r); setGf('اتفتح في فوتوشوب. اعمل Generative Fill واحفظ بـ Ctrl+S (نفس الملف)، وبعدين دوس "رجّعه من فوتوشوب".', 'okline'); if($('gfBack')) $('gfBack').disabled = false; throw null; });
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
  }).then(function(r){ if(r){ say(r); if(r.ok) setGf('خلص ✓ اللاير اسمه NABD FILL، والصورة متخزنة في Documents/NABD Fill.', 'okline'); } })
  .catch(function(e){ if(e){ setGf('حصل خطأ: ' + (e.message || e), 'badline'); } });
}
/* ============================================================== edit page */
var ED = null, ED_DIRTY = true, ED_BUSY = false;
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
  var m = g.match(/^NABD (IN|OUT|FX|LOOP) (.+)$/);
  if(m) return {IN:'دخول', OUT:'خروج', FX:'تأكيد', LOOP:'لوب'}[m[1]] + ' · ' + presetName(m[2]);
  if(g==='NABD TYPE') return 'آلة كاتبة: السرعة والمؤشر';
  if(g==='NABD STYLE') return 'ستايل النص';
  if(g==='NABD PATH') return 'نص على مسار: المكان والسرعة';
  if(g==='NABD TRIM') return 'تريم باث: البداية والنهاية والإزاحة';
  if(g==='NABD STAB') return 'تثبيت الكادر: القوة';
  if(g==='NABD CAR') return 'كارت كاروسيل';
  if(/^NABD CAROUSEL/.test(ED && ED.layer ? ED.layer.name : '') && g==='LAYER') return 'تحكم الكاروسيل (Shape 0-16 · Motion 0 لف، 1 وقفات، 2 رايح جاي، 3 يدوي، 4 يلف ويقف)';
  if(g==='NABD LOOK') return 'فلتر ألوان';
  if(g==='NABD AUDIO') return 'إفكت صوت';
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
  return {layer:{idx:1, name:'حركة النص', inF:0, outF:90, op:100}, fps:30, kids:[], text:{text:'حركة النص', size:110, fill:[1,1,1], stroke:null, sw:0, trk:0, font:'Cairo-Bold'},
    groups:[{g:'NABD IN overBottom', t0:0, fr:18, items:[{n:'NABD IN overBottom', path:[4,1], kind:'fx', on:true, props:[{n:'Position', path:[4,1,2], t:'2', nk:2, k0:[960,1300], k1:[960,540]}, {n:'Opacity', path:[4,1,9], t:'1', nk:2, k0:0, k1:100}]}]},
            {g:'NABD TYPE', items:[{n:'NABD TYPE Speed', path:[4,2], kind:'fx', on:true, props:[{n:'Slider', path:[4,2,1], t:'1', nk:0, v:14}]}, {n:'NABD TYPE Cursor', path:[4,3], kind:'fx', on:true, props:[{n:'Checkbox', path:[4,3,1], t:'1', nk:0, v:1}]}]},
            {g:'NABD STYLE', items:[{n:'NABD STYLE Glow', path:[4,4], kind:'fx', on:true, props:[{n:'Glow Radius', path:[4,4,3], t:'1', nk:0, v:30}, {n:'Color A', path:[4,4,8], t:'c', nk:0, v:[1,0.4,0.2,1]}]}]}]};
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
  if(!ED.groups.length){ grid.innerHTML = '<div class="edempty">اللاير ده مفيهوش حاجات من الكيت لسه.<br>طبّق أي حاجة من التابات التانية وارجع هنا.</div>'; return; }
  var h = '<div class="edwrap">';
  ED.groups.forEach(function(G, gi){
    h += '<div class="edcard" data-g="' + gi + '"><h3><span>' + esc(edTitle(G.g)) + ' <span class="tag">' + esc(G.g) + '</span></span><span class="acts">' +
      '<button data-gact="off">إيقاف/تشغيل</button><button class="del" data-gact="del">' + (G.g==='LAYER' ? 'امسح اللاير' : 'امسح') + '</button></span></h3>';
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
  bindEditGrid(grid);
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
  h += '<div class="row"><button class="btn primary" id="edRead">اقرأ اللاير المحدد</button></div>';
  h += chk('ed.auto', 'تحديث تلقائي لما أغيّر التحديد', S.ed.auto);
  if(ED && ED.layer){
    var L = ED.layer;
    h += '<div class="field"><span class="lbl">اللاير</span><div class="pathline">#' + L.idx + ' · ' + esc(L.name) + ' · فريم ' + L.inF + ' ← ' + L.outF + '</div></div>';
    h += '<div class="row"><div class="field"><label>شفافية اللاير</label><input type="number" id="edOp" min="0" max="100" value="' + L.op + '"></div><div class="field"><label>آخر فريم</label><input type="number" id="edOut" value="' + L.outF + '"></div></div>';
    if(/^NABD (OV|LOOK|TR|FX|MATTE)/.test(L.name)) h += '<div class="field"><span class="lbl">طريقة الدمج</span><div class="seg" id="edBlend">' + [['screen','Screen'],['add','Add'],['overlay','Overlay'],['normal','Normal']].map(function(o){ return '<button data-v="' + o[0] + '" class="' + (L.blend===o[0]?'on':'') + '">' + o[1] + '</button>'; }).join('') + '</div></div>';
    if(ED.text){
      var T = ED.text;
      h += '<div class="field"><label>الكلام</label><textarea id="edText" dir="auto">' + esc(T.text.replace(/\r/g,'\n')) + '</textarea></div>';
      h += '<div class="row"><div class="field"><label>الحجم</label><input type="number" id="edSize" value="' + Math.round(T.size) + '"></div><div class="field"><label>التراكينج</label><input type="number" id="edTrk" value="' + Math.round(T.trk||0) + '"></div></div>';
      h += '<div class="row"><div class="field"><label>لون الحروف</label><input type="color" id="edFill" value="' + (T.fill ? rgbHex(T.fill) : '#ffffff') + '"></div><div class="field"><label>لون الإطار</label><input type="color" id="edStroke" value="' + (T.stroke ? rgbHex(T.stroke) : '#000000') + '"></div><div class="field"><label>سُمك الإطار</label><input type="number" id="edSw" value="' + Math.round(T.sw||0) + '"></div></div>';
      h += '<div class="field"><label>الخط PostScript</label><input type="text" id="edFont" dir="ltr" value="' + esc(T.font||'') + '"></div>';
      if(ED.kids && ED.kids.length) h += '<div class="hint">الستايل ده عامل ' + ED.kids.length + ' طبقة مربوطة باللاير (اسمها NABD STYLE). أي حركة أو تعديل بيمشي عليهم كمان.</div>';
    }
    h += '<button class="btn warn" id="clear">شيل كل حاجات الكيت من اللاير</button>';
  }
  return h;
}
function bindEditSide(){
  if($('edRead')) $('edRead').onclick = function(){ edRefresh(true); };
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
function tick(now){
  if(!S.paused){
    live.forEach(function(o){ step(o, now); });
    if(stageEl) step(stageEl, now);
  }
  requestAnimationFrame(tick);
}
function step(o, now){
  var t = (now - o.t0)/1000;
  switch(o.k){
    case 'tr': P.drawTr(o.el, o.it.id, t, S.tr.frames, S.tr.snappy, S.acc); break;
    case 'mp': P.drawMp(o.el, o.it, t, {dir:S.mp.dir, frames:S.mp.frames}); break;
    case 'tx': P.drawTx(o.el, o.it, t, (o.it.tw ? S.tx.doIn : true), o.it.loop ? false : S.tx.doOut, S.acc, (o.it.random||o.it.overshoot) ? 'normal' : S.tx.pattern, S.tx.cps); break;
    case 'spr': P.drawSprite(o.el, t); break;
    case 'ln': P.drawLine(o.el, t); break;
    case 'car': P.drawCar(o.el, t); break;
    case 'trk': o.box.innerHTML = P.trkSVG(o.it, t, S.acc); break;
    case 'gf': o.box.innerHTML = P.gfSVG(o.it, t, S.acc); break;
    case 'trim': P.drawTrim(o.el, t); break;
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
  if(r && r.ok){ st.className='chip live'; st.innerHTML='<i></i><span>' + (r.data.comp ? esc(r.data.comp) : 'متصل') + '</span>'; }
  else { st.className='chip'; st.innerHTML='<i style="background:var(--bad)"></i><span>المحرك مش شغال</span>'; }
}
renderAll();
if(S.tab==='ed') edRefresh(true);
requestAnimationFrame(tick);
ensureEngine().then(function(r){ setStatus(r); if(CEP && S.lib.paths.length) refreshLib(); });
if($('verTxt')) $('verTxt').textContent = HMK.ver;
HMK_UPD.onStatus(function(msg, kind){ var t = $('toast'); if(!t) return; t.className = 'toast ' + (kind==='bad' ? 'bad' : (kind==='ok' ? 'ok' : '')); t.textContent = msg; clearTimeout(t._h); t._h = setTimeout(function(){ t.className = 'toast'; }, 6000); });
if($('updBtn')) $('updBtn').onclick = function(){ HMK_UPD.check(true); };
try{ var up = localStorage.getItem('hmk_updated_to'); if(up){ localStorage.removeItem('hmk_updated_to'); setTimeout(function(){ say({ok:true, data:'OK_UPDATED'}); }, 600); } }catch(e){}
setTimeout(function(){ HMK_UPD.check(false); }, 2500);
if(CEP) setInterval(function(){ host('ping').then(setStatus); }, 4000);
})();
