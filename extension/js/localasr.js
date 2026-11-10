/* Hamdy Motion Kit — free on-device transcription (no account, no API key).
   Uses whisper.cpp (MIT, github.com/ggml-org/whisper.cpp). On first use the panel fetches the
   whisper.cpp program and the chosen model by itself into Documents/Hamdy Motion Kit/whisper,
   then everything runs offline on this computer. */
function HMK_MAKE_ASR(A){
  var NODE = A.NODE, Buffer = NODE ? NODE('buffer').Buffer : null;
  var MODELS = {
    fast:  {file:'ggml-small-q5_1.bin',          mb:182,  ar:'سريع'},
    best:  {file:'ggml-large-v3-turbo-q5_0.bin', mb:547,  ar:'دقيق'},
    egypt: {file:'ggml-large-v2-q5_0.bin',       mb:1080, ar:'عامية مصري'}
  };
  var HF = 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/';
  var REL = 'https://api.github.com/repos/ggml-org/whisper.cpp/releases/latest';
  function P(){ return NODE('path'); }
  function fs(){ return NODE('fs'); }
  function base(){ var d = P().join(NODE('os').homedir(), 'Documents', 'Hamdy Motion Kit', 'whisper'); try{ fs().mkdirSync(d, {recursive:true}); }catch(e){} return d; }
  function win(){ return NODE('os').platform() === 'win32'; }
  function findExe(dir){
    var names = win() ? ['whisper-cli.exe', 'main.exe'] : ['whisper-cli'], found = null;
    (function walk(d, depth){
      if(found || depth > 4) return;
      var list = []; try{ list = fs().readdirSync(d); }catch(e){ return; }
      list.forEach(function(n){ if(found) return; var p = P().join(d, n), st; try{ st = fs().statSync(p); }catch(e){ return; }
        if(st.isDirectory()) walk(p, depth + 1); else if(names.indexOf(n) >= 0) found = p; });
    })(dir, 0);
    if(found && win() && /main\.exe$/.test(found)){ var cli = P().join(P().dirname(found), 'whisper-cli.exe'); if(fs().existsSync(cli)) found = cli; }
    return found;
  }
  function macExe(){
    var c = ['/opt/homebrew/bin/whisper-cli', '/usr/local/bin/whisper-cli', '/opt/homebrew/bin/whisper-cpp', '/usr/local/bin/whisper-cpp'];
    for(var i = 0; i < c.length; i++) if(fs().existsSync(c[i])) return c[i];
    return findExe(P().join(base(), 'bin'));
  }
  function exe(){ return win() ? findExe(P().join(base(), 'bin')) : macExe(); }
  function modelPath(q){ return P().join(base(), 'models', MODELS[q].file); }
  function haveModel(q){ try{ var st = fs().statSync(modelPath(q)); return st.size > MODELS[q].mb * 0.9 * 1048576; }catch(e){ return false; } }
  function status(q){ return {exe:!!exe(), model:haveModel(q), mb:MODELS[q].mb, win:win()}; }

  function get(url, dest, onProg, hops){
    return new Promise(function(res, rej){
      var lib = /^https:/.test(url) ? NODE('https') : NODE('http');
      var req = lib.get(url, {headers:{'User-Agent':'HamdyMotionKit', 'Accept':'*/*'}}, function(r){
        if(r.statusCode >= 300 && r.statusCode < 400 && r.headers.location && (hops||0) < 8){ r.resume(); return res(get(new URL(r.headers.location, url).href, dest, onProg, (hops||0) + 1)); }
        if(r.statusCode !== 200){ r.resume(); return rej(new Error('HTTP ' + r.statusCode + ' ' + url)); }
        if(!dest){ var chunks = []; r.on('data', function(c){ chunks.push(c); }); r.on('end', function(){ res(Buffer.concat(chunks)); }); r.on('error', rej); return; }
        var total = +r.headers['content-length'] || 0, got = 0, tmp = dest + '.part', w = fs().createWriteStream(tmp);
        r.on('data', function(c){ got += c.length; if(onProg && total) onProg(got / total); });
        r.pipe(w);
        w.on('finish', function(){ w.close(function(){ try{ if(fs().existsSync(dest)) fs().unlinkSync(dest); fs().renameSync(tmp, dest); res(dest); }catch(e){ rej(e); } }); });
        w.on('error', rej); r.on('error', rej);
      });
      req.on('error', rej);
      req.setTimeout(60000, function(){ req.destroy(new Error('timeout')); });
    });
  }
  function setupEngine(onMsg){
    if(exe()) return Promise.resolve(exe());
    if(!win()) return Promise.reject(new Error('MAC_NEEDS_BREW'));
    var bin = P().join(base(), 'bin'); try{ fs().mkdirSync(bin, {recursive:true}); }catch(e){}
    onMsg('بجهّز برنامج التفريغ (مرة واحدة بس، حوالي 20 ميجا)…', 0);
    return get(REL, null).then(function(buf){
      var j = JSON.parse(buf.toString('utf8')), as = j.assets || [], pick = null;
      ['whisper-blas-bin-x64.zip', 'whisper-bin-x64.zip'].forEach(function(n){ if(!pick) as.forEach(function(a){ if(a.name === n) pick = a; }); });
      if(!pick) throw new Error('مش لاقي نسخة ويندوز من whisper.cpp');
      var zip = P().join(bin, pick.name);
      return get(pick.browser_download_url, zip, function(f){ onMsg('بنزّل برنامج التفريغ… ' + Math.round(f * 100) + '%', f); }).then(function(){ return zip; });
    }).then(function(zip){
      return new Promise(function(res, rej){
        NODE('child_process').execFile('tar', ['-xf', zip, '-C', bin], {windowsHide:true}, function(err){
          try{ fs().unlinkSync(zip); }catch(e){}
          if(err) return rej(err);
          var e = exe(); if(!e) return rej(new Error('whisper-cli.exe مش موجود بعد فك الضغط'));
          res(e);
        });
      });
    });
  }
  function setupModel(q, onMsg){
    if(haveModel(q)) return Promise.resolve(modelPath(q));
    var dir = P().join(base(), 'models'); try{ fs().mkdirSync(dir, {recursive:true}); }catch(e){}
    var m = MODELS[q];
    return get(HF + m.file, modelPath(q), function(f){ onMsg('بنزّل موديل «' + m.ar + '» (' + m.mb + ' ميجا، مرة واحدة بس)… ' + Math.round(f * 100) + '%', f); });
  }
  /* wav: Buffer of 16 kHz mono 16-bit PCM WAV. Returns [{w, s, e}] in seconds. */
  function run(wav, lang, q, onMsg){
    return setupEngine(onMsg).then(function(){ return setupModel(q, onMsg); }).then(function(model){
      var tmp = P().join(NODE('os').tmpdir(), 'hmk_asr_' + Date.now()), wf = tmp + '.wav';
      fs().writeFileSync(wf, wav);
      var th = Math.max(2, Math.min(8, NODE('os').cpus().length - 1));
      var args = ['-m', model, '-f', wf, '-l', (lang === 'auto' ? 'auto' : String(lang).split('-')[0]), '-oj', '-ml', '1', '-sow', '-of', tmp, '-pp', '-t', String(th)];
      onMsg('بفرّغ على جهازك… 0%', 0);
      return new Promise(function(res, rej){
        var p = NODE('child_process').spawn(exe(), args, {windowsHide:true}), errTxt = '';
        function scan(d){ var s = d.toString(); errTxt = (errTxt + s).slice(-4000); var m = s.match(/progress\s*=\s*(\d+)%/g); if(m){ var v = +m[m.length - 1].replace(/\D/g, ''); onMsg('بفرّغ على جهازك… ' + v + '%', v / 100); } }
        p.stderr.on('data', scan); p.stdout.on('data', scan);
        p.on('error', rej);
        p.on('close', function(code){
          try{ fs().unlinkSync(wf); }catch(e){}
          var jf = tmp + '.json';
          if(code !== 0 || !fs().existsSync(jf)) return rej(new Error('whisper.cpp وقف (' + code + '): ' + errTxt.split('\n').slice(-3).join(' ')));
          var j; try{ j = JSON.parse(fs().readFileSync(jf, 'utf8')); }catch(e){ return rej(e); }
          try{ fs().unlinkSync(jf); }catch(e){}
          var out = [];
          (j.transcription || []).forEach(function(sg){
            var t = String(sg.text || '').replace(/\[[^\]]*\]/g, '').trim(), s = (sg.offsets && sg.offsets.from || 0) / 1000, e = (sg.offsets && sg.offsets.to || 0) / 1000;
            if(!t) return;
            // whisper sometimes glues a word to the previous segment without a leading space: keep it as its own word anyway
            out.push({w:t, s:s, e:Math.max(e, s + 0.05)});
          });
          res(out);
        });
      });
    });
  }
  function remove(){ try{ var b = base(); fs().rmSync(b, {recursive:true, force:true}); return true; }catch(e){ return false; } }
  return {MODELS:MODELS, status:status, run:run, base:base, remove:remove};
}
