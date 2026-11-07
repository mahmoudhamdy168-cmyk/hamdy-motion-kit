/* Hamdy Motion Kit — stock search: Pexels (free videos & photos) and Freesound (free sound effects).
   Keys are the user's own free API keys, stored only in this panel. Files are cached in
   Documents/Hamdy Motion Kit/stock and placed at the playhead. */
function HMK_MAKE_STOCK(A){
  var S = A.S, host = A.host, save = A.save, say = A.say, $ = A.$, esc = A.esc, NODE = A.NODE, CEP = A.CEP, trText = A.trText, seg = A.seg, chk = A.chk, openURL = A.openURL;
  var RES = [], BUSY = false, PAGE = 1, LASTQ = '', AUDIO = null;

  function cacheDir(){
    var os = NODE('os'), path = NODE('path'), fs = NODE('fs');
    var d = path.join(os.homedir(), 'Documents', 'Hamdy Motion Kit', 'stock');
    try{ fs.mkdirSync(d, {recursive:true}); }catch(e){}
    return d;
  }
  function download(url, dest, hops){
    return new Promise(function(res, rej){
      var lib = /^https:/.test(url) ? NODE('https') : NODE('http');
      lib.get(url, {headers:{'user-agent':'HamdyMotionKit'}}, function(r){
        if(r.statusCode >= 300 && r.statusCode < 400 && r.headers.location && (hops||0) < 6){ r.resume(); return res(download(new URL(r.headers.location, url).href, dest, (hops||0) + 1)); }
        if(r.statusCode !== 200){ r.resume(); return rej(new Error('HTTP ' + r.statusCode)); }
        var fs = NODE('fs'), tmp = dest + '.part', w = fs.createWriteStream(tmp);
        r.pipe(w); w.on('finish', function(){ w.close(function(){ try{ fs.renameSync(tmp, dest); res(dest); }catch(e){ rej(e); } }); }); w.on('error', rej);
      }).on('error', rej);
    });
  }
  function getJSON(url, headers){
    return fetch(url, {headers:headers || {}}).then(function(r){ return r.json().then(function(j){ if(!r.ok) throw new Error((j && (j.error || j.detail)) || ('HTTP ' + r.status)); return j; }); });
  }
  function search(q, more){
    var st = S.br; q = (q || '').trim(); if(!q) return;
    if(!more){ PAGE = 1; RES = []; } else PAGE++;
    LASTQ = q; BUSY = true; render();
    var p;
    if(st.src === 'sfx'){
      if(!st.fsKey){ BUSY = false; render(); return say({ok:false, code:'NO_FS_KEY'}); }
      p = getJSON('https://freesound.org/apiv2/search/text/?query=' + encodeURIComponent(q) + '&page=' + PAGE + '&page_size=24&fields=id,name,duration,previews,images,username,license&token=' + encodeURIComponent(st.fsKey))
        .then(function(j){ return (j.results || []).map(function(r){ return {kind:'sfx', id:'fs' + r.id, name:r.name, dur:r.duration, thumb:r.images && (r.images.waveform_m || r.images.waveform_l), url:r.previews && (r.previews['preview-hq-mp3'] || r.previews['preview-lq-mp3']), by:r.username, lic:licName(r.license), page:'https://freesound.org/s/' + r.id + '/'}; }); });
    } else {
      if(!st.pxKey){ BUSY = false; render(); return say({ok:false, code:'NO_PX_KEY'}); }
      var vid = st.src === 'video', orient = st.orient === 'any' ? '' : '&orientation=' + st.orient;
      p = getJSON((vid ? 'https://api.pexels.com/videos/search?query=' : 'https://api.pexels.com/v1/search?query=') + encodeURIComponent(q) + '&per_page=24&page=' + PAGE + orient, {Authorization:st.pxKey})
        .then(function(j){
          if(vid) return (j.videos || []).map(function(v){ var f = pickVideo(v.video_files || []); return {kind:'video', id:'pv' + v.id, name:(v.user && v.user.name ? v.user.name : 'Pexels') + ' · ' + v.duration + 's', thumb:v.image, url:f && f.link, ext:'mp4', by:v.user && v.user.name, lic:'Pexels License', page:v.url, w:f && f.width, h:f && f.height}; });
          return (j.photos || []).map(function(ph){ return {kind:'photo', id:'pp' + ph.id, name:ph.alt || ('Photo ' + ph.id), thumb:ph.src && ph.src.medium, url:ph.src && (ph.src.large2x || ph.src.original), ext:'jpg', by:ph.photographer, lic:'Pexels License', page:ph.url}; });
        });
    }
    p.then(function(list){ RES = RES.concat(list); }, function(e){ say({ok:false, msg:String(e.message || e)}); })
      .then(function(){ BUSY = false; render(); });
  }
  function pickVideo(files){
    var want = S.br.quality === '4k' ? 3840 : (S.br.quality === 'sd' ? 960 : 1920), best = null;
    files.filter(function(f){ return /mp4/.test(f.file_type || 'mp4') && f.width; }).forEach(function(f){
      var w = Math.max(f.width, f.height);
      if(!best || Math.abs(w - want) < Math.abs(Math.max(best.width, best.height) - want)) best = f;
    });
    return best;
  }
  function licName(u){ u = String(u || ''); if(/zero|cc0/i.test(u)) return 'CC0'; if(/by-nc/i.test(u)) return 'CC BY-NC'; if(/by\//i.test(u) || /by\/4|by\/3/.test(u)) return 'CC BY'; if(/sampling/i.test(u)) return 'Sampling+'; return 'CC'; }
  function place(r){
    if(!NODE){ return say({ok:false, code:'NO_NODE'}); }
    if(!r.url){ return say({ok:false, msg:'no file'}); }
    var path = NODE('path'), fs = NODE('fs'), ext = r.kind === 'sfx' ? 'mp3' : (r.ext || 'mp4');
    var dest = path.join(cacheDir(), r.id + '.' + ext), t = $('toast');
    t.className = 'toast info'; t.textContent = trText('بنزّل…') + ' ' + r.name;
    (fs.existsSync(dest) ? Promise.resolve(dest) : download(r.url, dest)).then(function(f){
      if(r.kind === 'sfx' && r.lic && r.lic !== 'CC0'){ try{ fs.writeFileSync(f + '.txt', r.name + ' by ' + r.by + ' (' + r.lic + ') ' + r.page); }catch(e){} }
      return host('libUse', {path:f, fit:r.kind !== 'sfx' && S.br.fit, screen:false});
    }).then(say, function(e){ say({ok:false, msg:String(e.message || e)}); });
  }
  function preview(r, btn){
    if(AUDIO){ AUDIO.pause(); if(AUDIO._id === r.id){ AUDIO = null; return; } }
    AUDIO = new Audio(r.url); AUDIO._id = r.id; AUDIO.play();
  }
  function render(){
    if(S.tab !== 'br') return;
    var grid = $('grid'); grid.className = 'grid brgrid';
    $('count').textContent = RES.length ? RES.length + '' : '';
    var h = '';
    if(!RES.length && !BUSY) h = '<div class="edempty">' + (LASTQ ? trText('مفيش نتايج. جرّب كلمة تانية بالإنجليزي.') : trText('اكتب اللي بتدور عليه على الجنب (بالإنجليزي أحسن) ودوس بحث.')) + '</div>';
    h += RES.map(function(r, i){
      return '<div class="card brc" data-i="' + i + '"><div class="thumb brth' + (r.kind === 'sfx' ? ' wave' : '') + '" style="background-image:url(\'' + esc(r.thumb || '') + '\')">' + (r.kind === 'sfx' ? '<button class="brplay" data-play="' + i + '">▶</button>' : '') + (r.kind === 'video' ? '<span class="brtag">▶ ' + (r.w ? r.w + 'p' : '') + '</span>' : '') + '</div>' +
        '<div class="meta"><b>' + esc(r.name).slice(0, 60) + '</b><span>' + esc(r.by || '') + ' · ' + esc(r.lic || '') + (r.dur ? ' · ' + r.dur.toFixed(1) + 's' : '') + '</span></div></div>';
    }).join('');
    if(BUSY) h += '<div class="edempty">…</div>';
    else if(RES.length) h += '<div class="brmore"><button class="btn" id="brMore">' + trText('نتايج أكتر') + '</button></div>';
    grid.innerHTML = h;
    Array.prototype.forEach.call(grid.querySelectorAll('.brc'), function(c){ c.onclick = function(e){ if(e.target.dataset.play) return; place(RES[+c.dataset.i]); }; });
    Array.prototype.forEach.call(grid.querySelectorAll('[data-play]'), function(b){ b.onclick = function(e){ e.stopPropagation(); preview(RES[+b.dataset.play], b); }; });
    if($('brMore')) $('brMore').onclick = function(){ search(LASTQ, true); };
  }
  function side(){
    var st = S.br, h = '<div class="head"><h2>🎞 ' + trText('بي رول وأصوات') + '</h2><p>' + trText('دوّر على فيديوهات وصور ببلاش من Pexels، وأصوات من Freesound، ودوس على أي نتيجة تنزل في الكومب عند البلاي هيد.') + '</p></div>';
    h += '<div class="field"><span class="lbl">' + trText('بتدور على') + '</span>' + seg('br.src', [['video','فيديو'],['photo','صور'],['sfx','أصوات']], st.src) + '</div>';
    h += '<div class="field"><input type="text" id="brQ" value="' + esc(LASTQ) + '" placeholder="city night, rain, whoosh…" style="width:100%"><button class="btn primary" id="brGo" style="margin-top:6px">' + trText('بحث') + '</button></div>';
    if(st.src !== 'sfx'){
      h += '<div class="field"><span class="lbl">' + trText('الاتجاه') + '</span>' + seg('br.orient', [['any','أي'],['portrait','طولي'],['landscape','عرضي'],['square','مربع']], st.orient) + '</div>';
      if(st.src === 'video') h += '<div class="field"><span class="lbl">' + trText('الجودة') + '</span>' + seg('br.quality', [['sd','SD'],['hd','Full HD'],['4k','4K']], st.quality) + '</div>';
      h += chk('br.fit', 'كبّره يملا الكادر', st.fit);
      h += '<div class="field"><span class="lbl">' + trText('مفتاح Pexels (ببلاش)') + '</span><input type="password" id="brPx" value="' + esc(st.pxKey || '') + '" style="width:100%"><button class="btn" id="brPxLink" style="margin-top:6px">' + trText('هات مفتاح من pexels.com/api') + '</button></div>';
    } else {
      h += '<div class="field"><span class="lbl">' + trText('مفتاح Freesound (ببلاش)') + '</span><input type="password" id="brFs" value="' + esc(st.fsKey || '') + '" style="width:100%"><button class="btn" id="brFsLink" style="margin-top:6px">' + trText('هات مفتاح من freesound.org') + '</button></div>';
      h += '<div class="hint">' + trText('بنزّل نسخة MP3 عالية الجودة. لو الصوت رخصته CC BY لازم تكتب اسم صاحبه في وصف الفيديو، وبنحط جنب الملف txt فيه الاسم والرخصة. CC BY-NC مش للشغل التجاري.') + '</div>';
    }
    h += '<div class="hint">' + trText('الملفات بتتحفظ في Documents/Hamdy Motion Kit/stock فمش هتتنزل تاني.') + '</div>';
    return h;
  }
  function bindSide(){
    var q = $('brQ');
    if(q){ q.onkeydown = function(e){ if(e.key === 'Enter') search(q.value); }; }
    if($('brGo')) $('brGo').onclick = function(){ search(q.value); };
    if($('brPx')) $('brPx').onchange = function(){ S.br.pxKey = $('brPx').value.trim(); save(); };
    if($('brFs')) $('brFs').onchange = function(){ S.br.fsKey = $('brFs').value.trim(); save(); };
    if($('brPxLink')) $('brPxLink').onclick = function(){ openURL('https://www.pexels.com/api/'); };
    if($('brFsLink')) $('brFsLink').onclick = function(){ openURL('https://freesound.org/apiv2/apply/'); };
  }
  function onSet(k){ if(k === 'br.src'){ RES = []; render(); } }
  return {render:render, side:side, bindSide:bindSide, onSet:onSet};
}
