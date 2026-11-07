/* Hamdy Motion Kit — AI assistant.
   1) In-panel chat with Claude (Anthropic API, the user's own key, kept only in this panel's localStorage).
   2) A local bridge (127.0.0.1) so the Claude Desktop app can drive After Effects through the
      "Hamdy AE" MCP extension (mcp/hamdy-ae.mcpb). Both use the same tools below. */
function HMK_MAKE_AI(A){
  var S = A.S, host = A.host, save = A.save, say = A.say, $ = A.$, esc = A.esc, NODE = A.NODE, CEP = A.CEP, apply = A.apply, itemsOf = A.itemsOf,
    byId = A.byId, trText = A.trText, seg = A.seg, chk = A.chk, openURL = A.openURL, extPath = A.extPath, rawEval = A.rawEval, MSG = A.MSG, HMK = window.HMK;
  var MODELS = [['claude-sonnet-5-5','Sonnet 5.5'],['claude-haiku-5-5','Haiku 5.5'],['claude-opus-5-5','Opus 5.5']];
  var SYS = [
    'You are the motion-design assistant inside "Hamdy Motion Kit", an Adobe After Effects panel. You act directly in After Effects by calling tools.',
    'SCOPE: the user selects layers in AE and may set a time range [T0,T1] in the panel. Only touch the selected layers and keep new keyframes inside the range unless the user asks otherwise. The context of the selection is attached to each user message, so do not call get_context unless you need more.',
    'run_script runs ExtendScript (ES3) inside one undo step. Rules: no let/const, no arrow functions, no template strings, no Array.forEach/map/filter, no JSON object; use plain for-loops and var. Provided variables: comp (active CompItem), SEL (array of selected layers), T0, T1 (seconds), log(msg) to report, and HMK helpers:',
    '  HMK.key(prop, t, value, ease) adds a keyframe with ease = "linear"|"ease"|"out"|"in"|"strong"|"snappy";',
    '  HMK.tr(layer, "position"|"scale"|"rotation"|"opacity"|"anchor") returns that transform property;',
    '  HMK.fx(layer, matchName, name) adds an effect; HMK.slider(layer, name, value) adds a slider control; HMK.layer(indexOrName).',
    'Values: position [x,y] (or [x,y,z] for 3D, comp pixels, origin top-left), scale percent [x,y] ([x,y,z] for 3D), rotation degrees, opacity 0-100. Snap times to frames with comp.frameDuration. Use matchNames, e.g. layer.property("ADBE Transform Group").property("ADBE Position"), "ADBE Effect Parade", "ADBE Text Properties" > "ADBE Text Animators" (addProperty("ADBE Text Animator"), its "ADBE Text Animator Properties" and "ADBE Text Selectors").',
    'Separated dimensions: if position.dimensionsSeparated is true use "ADBE Position_0"/"ADBE Position_1". If a property already has keys inside the range, replace them only when the user wants a new move.',
    'Prefer editable keyframes with good eases for moves the user may tweak; use expressions for loops/procedural motion. Prefix any layer or effect you create with "HAMDY AI". Return a short summary string from the script.',
    'KIT: the panel has many ready presets (transitions, overlay transitions, motion presets, text animations, text styles, titles, elements, looks, lines, carousels, trim paths, depth 3D camera moves, eases, sounds). When a request matches a preset, prefer kit_list + kit_apply: it is cheaper and looks polished. kit_apply acts on the current AE selection and playhead (use set_time first when needed). You can pass settings to override the panel options of that tab.',
    'Use get_frame only when you need to see the picture (it costs tokens). If a script throws, read the error, fix it and retry (at most twice).',
    'Be brief. Answer in the user\'s language; if they write Egyptian Arabic, answer in Egyptian Arabic. Do not paste long code in your reply; just say what you did.'
  ].join('\n');
  var TABS_OK = ['tr','mp','tx','ts','ti','el','fx','ln','car','trim','dp','ez','sfx'];
  var TOOLS = [
    {name:'get_context', description:'Read the active comp: size, fps, duration, playhead, work area, the panel time range, and details of the selected layers (transform values and keyframes, text, effects). Pass layers (indices) for details of other layers, or all=true for a short list of every layer.',
      input_schema:{type:'object', properties:{layers:{type:'array', items:{type:'integer'}}, all:{type:'boolean'}}}},
    {name:'run_script', description:'Run ExtendScript in After Effects (ES3) as one undo step. Variables: comp, SEL, T0, T1, log(), HMK helpers. Returns the script return value and log, or the error.',
      input_schema:{type:'object', properties:{description:{type:'string', description:'one line: what the script does'}, code:{type:'string'}}, required:['code']}},
    {name:'get_frame', description:'See the rendered comp frame at a time (seconds, default = playhead) as a small image.',
      input_schema:{type:'object', properties:{time:{type:'number'}}}},
    {name:'set_time', description:'Move the AE playhead to a time in seconds.', input_schema:{type:'object', properties:{time:{type:'number'}}, required:['time']}},
    {name:'kit_list', description:'List the ready presets of a panel tab as "id | name | group". Tabs: tr=transitions (incl. overlay film burn/leaks/glitch/spray), mp=motion presets, tx=text animations, ts=text styles, ti=titles, el=elements & overlays, fx=looks/filters, ln=lines, car=3D carousels, trim=trim paths, dp=depth 3D camera moves, ez=eases & expressions, sfx=sounds. Optional query filters by name.',
      input_schema:{type:'object', properties:{tab:{type:'string', 'enum':TABS_OK}, query:{type:'string'}}, required:['tab']}},
    {name:'kit_apply', description:'Apply a preset from the kit to the current AE selection at the playhead, exactly like clicking it in the panel. settings (optional) overrides that tab\'s panel options for this call, e.g. {"frames":20} or {"doIn":true,"doOut":false}; call kit_settings to see them.',
      input_schema:{type:'object', properties:{tab:{type:'string', 'enum':TABS_OK}, id:{type:'string'}, settings:{type:'object'}}, required:['tab','id']}},
    {name:'kit_settings', description:'Show the current panel options of a tab (the keys kit_apply settings can override).',
      input_schema:{type:'object', properties:{tab:{type:'string', 'enum':TABS_OK}}, required:['tab']}}
  ];
  var MSGS = [], BUSY = false, LOGEL = null, PENDING = null, USAGE = {i:0, o:0, c:0};

  /* ---------------------------------------------------------------- tools */
  function range(){ var a = S.ai; return {t0:(a.t0===null||a.t0===undefined) ? null : a.t0, t1:(a.t1===null||a.t1===undefined) ? null : a.t1}; }
  function txt(o){ return typeof o === 'string' ? o : JSON.stringify(o); }
  function hostP(cmd, args){ return host(cmd, args); }
  function readFrame(path){
    var fs = NODE && NODE('fs');
    if(!fs) return Promise.reject(new Error('no fs'));
    return new Promise(function(res, rej){
      var n = 0;
      (function wait(){
        var ok = false; try{ ok = fs.existsSync(path) && fs.statSync(path).size > 0; }catch(e){}
        if(ok){ setTimeout(function(){
          try{
            var b64 = fs.readFileSync(path).toString('base64'), img = new Image();
            img.onload = function(){
              var k = Math.min(1, 768 / Math.max(img.width, img.height)), cv = document.createElement('canvas');
              cv.width = Math.round(img.width*k); cv.height = Math.round(img.height*k);
              cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
              try{ fs.unlinkSync(path); }catch(e){}
              res(cv.toDataURL('image/jpeg', 0.82).split(',')[1]);
            };
            img.onerror = function(){ rej(new Error('bad image')); };
            img.src = 'data:image/png;base64,' + b64;
          }catch(e){ rej(e); }
        }, 150); return; }
        if(++n > 60) return rej(new Error('frame not saved'));
        setTimeout(wait, 150);
      })();
    });
  }
  function kitList(tab, q){
    var its = itemsOf(tab) || [];
    q = (q||'').toLowerCase();
    var out = its.filter(function(it){ return !q || ((it.en||'') + ' ' + it.ar + ' ' + it.id + ' ' + (it.g||'')).toLowerCase().indexOf(q) >= 0; })
      .map(function(it){ return it.id + ' | ' + (it.en || it.ar) + ' | ' + (trText(it.g||'') || ''); });
    return out.length ? out.join('\n') : 'nothing found';
  }
  function kitApply(tab, id, settings){
    var its = itemsOf(tab) || [], it = byId(its, id);
    if(!it) return Promise.resolve({error:'unknown id ' + id + ' in tab ' + tab + ' (use kit_list)'});
    var oldTab = S.tab, oldSel = S.sel[tab], backup = null, st = S[tab];
    if(settings && st && typeof st === 'object'){ backup = JSON.parse(JSON.stringify(st)); for(var k in settings){ if(k in st) st[k] = settings[k]; } }
    S.tab = tab; S.sel[tab] = id;
    var p;
    try{ p = apply(); }catch(e){ p = Promise.resolve({ok:false, msg:String(e)}); }
    S.tab = oldTab;
    if(oldTab !== tab) S.sel[tab] = oldSel;
    if(backup) S[tab] = backup;
    return (p || Promise.resolve({ok:true, data:'started'})).then(function(r){ return r && r.ok ? {ok:true, applied:(it.en||it.ar), result:r.data} : {error:(r && (MSG[r.code] ? trText(MSG[r.code]) : (r.msg || r.code))) || 'failed'}; });
  }
  function exec(name, input){
    input = input || {};
    var R = range();
    switch(name){
      case 'get_context':
        return hostP('aiContext', {t0:R.t0, t1:R.t1, all:!!input.all, layers:input.layers || null}).then(function(r){ return r.ok ? txt(r.data) : {error:r.msg || r.code}; });
      case 'run_script':
        return hostP('aiRun', {code:String(input.code||''), t0:R.t0, t1:R.t1}).then(function(r){
          A.dirty();
          if(r.ok) return 'OK' + (r.data && r.data.result ? '\nreturn: ' + r.data.result : '') + (r.data && r.data.log ? '\nlog: ' + r.data.log : '');
          return {error:(r.msg || r.code)};
        });
      case 'get_frame':
        return hostP('aiFrame', {t:input.time}).then(function(r){
          if(!r.ok) return {error:r.msg || r.code};
          return readFrame(r.data.path).then(function(b64){ return {image:b64, note:'frame at ' + r.data.t.toFixed(2) + 's, comp ' + r.data.w + 'x' + r.data.h}; }, function(e){ return {error:String(e.message||e)}; });
        });
      case 'set_time':
        return hostP('aiSetTime', {t:+input.time||0}).then(function(r){ return r.ok ? 'playhead at ' + r.data.t : {error:r.msg||r.code}; });
      case 'kit_list': return Promise.resolve(kitList(input.tab, input.query));
      case 'kit_settings': return Promise.resolve(txt(S[input.tab] || {}));
      case 'kit_apply': return kitApply(input.tab, input.id, input.settings);
    }
    return Promise.resolve({error:'unknown tool ' + name});
  }
  /* tool result -> Anthropic content */
  function toContent(res){
    if(res && res.image) return [{type:'image', source:{type:'base64', media_type:'image/jpeg', data:res.image}}, {type:'text', text:res.note||''}];
    if(res && res.error) return [{type:'text', text:'ERROR: ' + res.error}];
    return [{type:'text', text:String(res)}];
  }

  /* ---------------------------------------------------------------- chat */
  function sysBlocks(){ return [{type:'text', text:SYS, cache_control:{type:'ephemeral'}}]; }
  function toolsBlock(){ var t = JSON.parse(JSON.stringify(TOOLS)); t[t.length-1].cache_control = {type:'ephemeral'}; return t; }
  function trimHistory(){
    // drop old turns (keep the last ~8 user turns) and strip old images to save tokens
    var users = [], i;
    for(i = 0; i < MSGS.length; i++){ if(MSGS[i].role==='user' && typeof MSGS[i].content !== 'string' && MSGS[i].content[0] && MSGS[i].content[0].type==='text' && MSGS[i]._turn) users.push(i); }
    if(users.length > 8) MSGS = MSGS.slice(users[users.length-8]);
    var last = MSGS.length - 1;
    MSGS.forEach(function(m, mi){
      if(mi >= last - 1 || typeof m.content === 'string') return;
      m.content.forEach(function(b){
        if(b.type==='image'){ b.type='text'; b.text='[old frame removed]'; delete b.source; }
        if(b.type==='tool_result' && Array.isArray(b.content)) b.content = b.content.map(function(x){ return x.type==='image' ? {type:'text', text:'[old frame removed]'} : x; });
      });
    });
  }
  function call(){
    var a = S.ai;
    return fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{'content-type':'application/json', 'x-api-key':a.key, 'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({model:a.model, max_tokens:4096, system:sysBlocks(), tools:toolsBlock(),
        messages:MSGS.map(function(m){ return {role:m.role, content:m.content}; })})
    }).then(function(r){ return r.json().then(function(j){ if(!r.ok) throw new Error((j.error && j.error.message) || ('HTTP ' + r.status)); return j; }); });
  }
  function ask(code, desc){
    return new Promise(function(res){
      PENDING = res;
      addBubble('tool', '<b>' + esc(desc || trText('سكريبت')) + '</b><pre>' + esc(code) + '</pre><div class="aiact"><button class="btn primary" data-ai="yes">' + trText('شغّله') + '</button><button class="btn" data-ai="no">' + trText('لأ') + '</button></div>', true);
    });
  }
  function send(text){
    if(BUSY || !text.trim()) return;
    if(!S.ai.key){ addBubble('err', trText('حط مفتاح Anthropic API الأول من الإعدادات على الجنب.')); return; }
    BUSY = true; setBusy(true);
    addBubble('user', esc(text));
    var R = range();
    hostP('aiContext', {t0:R.t0, t1:R.t1}).then(function(r){
      var ctx = r.ok ? txt(r.data) : '(no comp open: ' + (r.msg||r.code) + ')';
      var content = [{type:'text', text:text + '\n\n<ae_context>' + ctx + '</ae_context>'}];
      if(S.ai.frame && r.ok) return exec('get_frame', {}).then(function(f){ if(f && f.image) content.push({type:'image', source:{type:'base64', media_type:'image/jpeg', data:f.image}}); return content; });
      return content;
    }).then(function(content){
      MSGS.push({role:'user', content:content, _turn:true});
      trimHistory();
      return loop(0);
    }).catch(function(e){ addBubble('err', esc(String(e.message||e))); })
      .then(function(){ BUSY = false; setBusy(false); });
  }
  function loop(step){
    if(step > 14){ addBubble('err', trText('وقفت عشان الخطوات كترت. قولّي أكمّل لو عايز.')); return Promise.resolve(); }
    return call().then(function(j){
      if(j.usage){ USAGE.i += (j.usage.input_tokens||0); USAGE.o += (j.usage.output_tokens||0); USAGE.c += (j.usage.cache_read_input_tokens||0); showUsage(); }
      MSGS.push({role:'assistant', content:j.content});
      j.content.forEach(function(b){ if(b.type==='text' && b.text.trim()) addBubble('bot', md(b.text)); });
      var uses = j.content.filter(function(b){ return b.type==='tool_use'; });
      if(j.stop_reason !== 'tool_use' || !uses.length) return;
      var results = [];
      return uses.reduce(function(pr, u){
        return pr.then(function(){
          var gate = (u.name==='run_script' && !S.ai.auto) ? ask(u.input.code, u.input.description) : Promise.resolve(true);
          return gate.then(function(ok){
            if(!ok){ results.push({type:'tool_result', tool_use_id:u.id, content:[{type:'text', text:'The user declined to run this script.'}]}); return; }
            var lab = {get_context:'قرا الكومب', run_script:'نفّذ', get_frame:'شاف الفريم', set_time:'حرّك البلاي هيد', kit_list:'دوّر في الكيت', kit_apply:'طبّق من الكيت', kit_settings:'شاف الإعدادات'}[u.name] || u.name;
            var bub = addBubble('tool', '⚙ ' + trText(lab) + (u.input.description ? ': ' + esc(u.input.description) : (u.input.id ? ': ' + esc(u.input.id) : '')) + (u.name==='run_script' ? '<details><summary>code</summary><pre>' + esc(u.input.code||'') + '</pre></details>' : ''));
            return exec(u.name, u.input).then(function(res){
              if(res && res.error) bub.classList.add('bad');
              results.push({type:'tool_result', tool_use_id:u.id, content:toContent(res), is_error:!!(res && res.error)});
            });
          });
        });
      }, Promise.resolve()).then(function(){ MSGS.push({role:'user', content:results}); return loop(step + 1); });
    });
  }
  function md(s){ return esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\n/g, '<br>'); }
  function addBubble(kind, html, keep){
    var log = $('aiLog'); if(!log) return document.createElement('div');
    var d = document.createElement('div'); d.className = 'aib ' + kind; d.innerHTML = html;
    log.appendChild(d); log.scrollTop = log.scrollHeight;
    if(keep) Array.prototype.forEach.call(d.querySelectorAll('[data-ai]'), function(b){ b.onclick = function(){ var f = PENDING; PENDING = null; d.querySelector('.aiact').remove(); if(f) f(b.dataset.ai==='yes'); }; });
    HIST.push({kind:kind, html:keep ? html.replace(/<div class="aiact">[\s\S]*$/, '') : html});
    return d;
  }
  var HIST = [];
  function setBusy(b){ var s = $('aiSend'); if(s){ s.disabled = b; s.textContent = b ? '…' : trText('ابعت'); } }
  function showUsage(){ var u = $('aiUse'); if(u) u.textContent = 'tokens: in ' + USAGE.i + ' · cached ' + USAGE.c + ' · out ' + USAGE.o; }

  /* ---------------------------------------------------------------- UI */
  function renderChat(){
    var grid = $('grid'); grid.className = 'grid aigrid';
    $('count').textContent = '';
    var R = range();
    grid.innerHTML = '<div class="aiwrap"><div class="aiscope" id="aiScope"></div><div class="ailog" id="aiLog"></div>' +
      '<div class="aiin"><textarea id="aiText" rows="3" placeholder="' + trText('حدد اللاير في الأفتر وقولّي عايز إيه… مثلاً: خلّي اللوجو يدخل من تحت بنطّة ويلف لفة خفيفة في الآخر') + '"></textarea>' +
      '<div class="aibtns"><button class="btn primary" id="aiSend">' + trText('ابعت') + '</button><button class="btn" id="aiNew">' + trText('شات جديد') + '</button><span id="aiUse" class="aiuse"></span></div></div></div>';
    var log = $('aiLog');
    if(!HIST.length) log.innerHTML = '<div class="aib bot">' + trText('أهلاً! حدد لاير أو أكتر في After Effects، وحدد الوقت من الجنب لو عايز، وقولّي الحركة اللي في دماغك. هنفّذها في الأفتر على طول، وكل طلب بيترجع بـ Ctrl+Z واحدة.') + '</div>';
    HIST.forEach(function(h){ var d = document.createElement('div'); d.className = 'aib ' + h.kind; d.innerHTML = h.html; log.appendChild(d); });
    log.scrollTop = log.scrollHeight;
    scopeText(); showUsage(); setBusy(BUSY);
    var ta = $('aiText');
    $('aiSend').onclick = function(){ var v = ta.value; ta.value = ''; send(v); };
    ta.onkeydown = function(e){ if(e.key==='Enter' && (e.ctrlKey || e.metaKey)){ e.preventDefault(); $('aiSend').click(); } };
    $('aiNew').onclick = function(){ if(BUSY) return; MSGS = []; HIST = []; USAGE = {i:0,o:0,c:0}; renderChat(); };
  }
  function scopeText(){
    var el = $('aiScope'); if(!el) return;
    var R = range(), t = (R.t0===null) ? trText('من غير وقت محدد (البلاي هيد)') : (trText('الوقت:') + ' ' + R.t0.toFixed(2) + 's → ' + (R.t1===null ? '?' : R.t1.toFixed(2) + 's'));
    el.textContent = '🎯 ' + trText('اللايرات المحددة في الأفتر') + ' · ⏱ ' + t;
  }
  function side(){
    var a = S.ai, h = '<div class="head"><h2>🤖 ' + trText('مساعد Claude') + '</h2><p>' + trText('بيحرّك وبيعدّل جوه After Effects بالكلام. بيبعت بس اللايرات المحددة والوقت اللي إنت مختاره، فالتوكنز قليلة.') + '</p></div>';
    h += '<div class="field"><span class="lbl">' + trText('مفتاح Anthropic API') + '</span><input type="password" id="aiKey" value="' + esc(a.key||'') + '" placeholder="sk-ant-..." style="width:100%"><button class="btn" id="aiKeyLink" style="margin-top:6px">' + trText('هات مفتاح من console.anthropic.com') + '</button></div>';
    h += '<div class="field"><span class="lbl">' + trText('الموديل') + '</span>' + seg('ai.model', MODELS, a.model) + '</div>';
    h += '<div class="field"><span class="lbl">' + trText('الوقت اللي هيشتغل فيه') + '</span><div class="row"><button class="btn" id="aiT0">' + trText('البداية = البلاي هيد') + '</button><button class="btn" id="aiT1">' + trText('النهاية = البلاي هيد') + '</button></div><div class="row"><button class="btn" id="aiWA">' + trText('الوورك إريا') + '</button><button class="btn" id="aiLay">' + trText('طول اللاير المحدد') + '</button><button class="btn" id="aiClr">' + trText('مسح') + '</button></div></div>';
    h += '<div class="row">' + chk('ai.frame', 'ابعت صورة الفريم مع كل رسالة', a.frame) + '</div>';
    h += '<div class="row">' + chk('ai.auto', 'نفّذ السكريبتات من غير ما يسألني', a.auto) + '</div>';
    h += '<div class="field" style="margin-top:14px"><span class="lbl">' + trText('ربط بتطبيق Claude Desktop (باشتراكك)') + '</span>' + chk('ai.bridge', 'شغّل الربط', a.bridge) +
      '<div class="hint" id="aiBridgeSt"></div><button class="btn" id="aiMcpb">' + trText('افتح فولدر إضافة Claude (hamdy-ae.mcpb)') + '</button>' +
      '<div class="hint">' + trText('مرة واحدة بس: افتح Claude Desktop ← Settings ← Extensions واسحب ملف hamdy-ae.mcpb جوه، أو دوس عليه دبل كليك. بعد كده سيب الربط شغال هنا واكتب لClaude في التطبيق نفسه.') + '</div></div>';
    return h;
  }
  function timeNow(){ return new Promise(function(res){ if(!CEP) return res({t:0}); rawEval('(function(){var c=app.project.activeItem;if(!(c instanceof CompItem))return "";var s=c.selectedLayers;return c.time+","+c.workAreaStart+","+(c.workAreaStart+c.workAreaDuration)+","+(s.length?s[0].inPoint+","+s[0].outPoint:"");})()', 5000).then(function(r){ var p = String(r).split(','); res({t:+p[0], w0:+p[1], w1:+p[2], l0:p[3]!==undefined ? +p[3] : null, l1:p[4]!==undefined ? +p[4] : null, none:!r}); }); }); }
  function bindSide(){
    var k = $('aiKey');
    if(k) k.onchange = function(){ S.ai.key = k.value.trim(); save(); };
    if($('aiKeyLink')) $('aiKeyLink').onclick = function(){ openURL('https://console.anthropic.com/settings/keys'); };
    function setR(f){ timeNow().then(function(n){ if(n.none){ say({ok:false, code:'NO_COMP'}); return; } f(n); if(S.ai.t0!==null && S.ai.t1!==null && S.ai.t1 < S.ai.t0){ var x = S.ai.t0; S.ai.t0 = S.ai.t1; S.ai.t1 = x; } save(); scopeText(); }); }
    if($('aiT0')) $('aiT0').onclick = function(){ setR(function(n){ S.ai.t0 = n.t; if(S.ai.t1===null) S.ai.t1 = n.t + 1; }); };
    if($('aiT1')) $('aiT1').onclick = function(){ setR(function(n){ S.ai.t1 = n.t; if(S.ai.t0===null) S.ai.t0 = Math.max(0, n.t - 1); }); };
    if($('aiWA')) $('aiWA').onclick = function(){ setR(function(n){ S.ai.t0 = n.w0; S.ai.t1 = n.w1; }); };
    if($('aiLay')) $('aiLay').onclick = function(){ setR(function(n){ if(n.l0===null || isNaN(n.l0)){ say({ok:false, code:'NO_LAYERS'}); return; } S.ai.t0 = n.l0; S.ai.t1 = n.l1; }); };
    if($('aiClr')) $('aiClr').onclick = function(){ S.ai.t0 = null; S.ai.t1 = null; save(); scopeText(); };
    if($('aiMcpb')) $('aiMcpb').onclick = function(){ if(!CEP) return; var p = (extPath() + '/mcp').replace(/\\/g,'/'); rawEval('Folder("' + p.replace(/"/g,'') + '").execute()', 5000); };
    bridgeStatus();
  }

  /* ---------------------------------------------------------------- bridge for Claude Desktop (MCP) */
  var SRV = null, BR_ERR = '', BR_HITS = 0;
  function bridgeStatus(){ var el = $('aiBridgeSt'); if(!el) return; el.textContent = SRV ? ('🟢 ' + trText('الربط شغال على') + ' 127.0.0.1:' + S.ai.port + (BR_HITS ? ' · ' + BR_HITS + ' ' + trText('طلب') : '')) : (BR_ERR ? '🔴 ' + BR_ERR : (S.ai.bridge ? '…' : '⚪ ' + trText('الربط مقفول'))); }
  function bridge(on){
    if(!on){ if(SRV){ try{ SRV.close(); }catch(e){} SRV = null; } bridgeStatus(); return; }
    if(SRV || !NODE) { if(!NODE) BR_ERR = 'Node.js غير متاح'; bridgeStatus(); return; }
    var http = NODE('http');
    SRV = http.createServer(function(req, res){
      var body = '';
      req.on('data', function(c){ body += c; if(body.length > 2e6) req.destroy(); });
      req.on('end', function(){
        function out(o){ res.writeHead(200, {'content-type':'application/json'}); res.end(JSON.stringify(o)); }
        if(req.method === 'GET'){ return out({ok:true, app:'Hamdy Motion Kit', ver:HMK.ver, tools:TOOLS.map(function(t){ return {name:t.name, description:t.description, inputSchema:t.input_schema}; }), instructions:SYS}); }
        var j; try{ j = JSON.parse(body||'{}'); }catch(e){ return out({error:'bad json'}); }
        BR_HITS++; bridgeStatus();
        var R = range();
        exec(j.name, j.input || {}).then(function(r){
          if(r && r.image) return out({image:r.image, text:r.note || ''});
          if(r && r.error) return out({error:r.error});
          out({text:String(r)});
        }, function(e){ out({error:String(e.message||e)}); });
      });
    });
    SRV.on('error', function(e){ BR_ERR = String(e.code || e.message); SRV = null; bridgeStatus(); });
    SRV.listen(S.ai.port || 47811, '127.0.0.1', function(){ BR_ERR = ''; bridgeStatus(); });
  }
  function init(){ if(S.ai && S.ai.bridge) bridge(true); }
  function onSet(k){ if(k==='ai.bridge') bridge(S.ai.bridge); if(k==='ai.model' || k==='ai.frame' || k==='ai.auto') save(); }
  return {renderChat:renderChat, side:side, bindSide:bindSide, init:init, onSet:onSet, exec:exec, TOOLS:TOOLS, SYS:SYS, _kitList:kitList};
}
