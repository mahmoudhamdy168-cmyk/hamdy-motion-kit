/* Hamdy Motion Kit — free on-device background removal / person cut-out (no account, no key).
   Runs ONNX models with onnxruntime-web (MIT) inside the panel (WASM, CPU).
   Models (downloaded once into Documents/Hamdy Motion Kit/models, from the rembg project's public releases):
     general : isnet-general-use (IS-Net / DIS, Apache-2.0)   — anything (products, logos, people, animals)
     person  : u2net_human_seg   (U^2-Net, Apache-2.0)        — people */
function HMK_MAKE_SEG(A){
  var NODE = A.NODE, ORT_VER = '1.17.3';
  var MODELS = {
    general: {file:'isnet-general-use.onnx', size:1024, mb:176, mean:[0.5,0.5,0.5], std:[1,1,1], ar:'أي حاجة'},
    person:  {file:'u2net_human_seg.onnx',   size:320,  mb:176, mean:[0.485,0.456,0.406], std:[0.229,0.224,0.225], ar:'أشخاص'}
  };
  var URL0 = 'https://github.com/danielgatis/rembg/releases/download/v0.0.0/';
  var SESS = {};
  function P(){ return NODE('path'); } function fs(){ return NODE('fs'); }
  function dir(sub){ var d = P().join(NODE('os').homedir(), 'Documents', 'Hamdy Motion Kit', sub); try{ fs().mkdirSync(d, {recursive:true}); }catch(e){} return d; }
  function mpath(k){ return P().join(dir('models'), MODELS[k].file); }
  function have(k){ try{ return fs().statSync(mpath(k)).size > MODELS[k].mb * 0.9 * 1048576; }catch(e){ return false; } }
  function get(url, dest, onProg, hops){
    return new Promise(function(res, rej){
      var req = NODE('https').get(url, {headers:{'User-Agent':'HamdyMotionKit'}}, function(r){
        if(r.statusCode >= 300 && r.statusCode < 400 && r.headers.location && (hops||0) < 8){ r.resume(); return res(get(new URL(r.headers.location, url).href, dest, onProg, (hops||0) + 1)); }
        if(r.statusCode !== 200){ r.resume(); return rej(new Error('HTTP ' + r.statusCode)); }
        var total = +r.headers['content-length'] || 0, got = 0, tmp = dest + '.part', w = fs().createWriteStream(tmp);
        r.on('data', function(c){ got += c.length; if(onProg && total) onProg(got / total); });
        r.pipe(w); w.on('finish', function(){ w.close(function(){ try{ fs().renameSync(tmp, dest); res(dest); }catch(e){ rej(e); } }); }); w.on('error', rej);
      });
      req.on('error', rej); req.setTimeout(60000, function(){ req.destroy(new Error('timeout')); });
    });
  }
  function loadORT(){
    if(window.ort) return Promise.resolve(window.ort);
    return new Promise(function(res, rej){
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@' + ORT_VER + '/dist/ort.min.js';
      s.onload = function(){ try{ ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@' + ORT_VER + '/dist/'; ort.env.wasm.numThreads = 1; }catch(e){} res(window.ort); };
      s.onerror = function(){ rej(new Error('مش قادر أحمّل محرك الذكاء الاصطناعي (محتاج إنترنت أول مرة).')); };
      document.head.appendChild(s);
    });
  }
  function session(k, onMsg){
    if(SESS[k]) return Promise.resolve(SESS[k]);
    var m = MODELS[k];
    var dl = have(k) ? Promise.resolve() : get(URL0 + m.file, mpath(k), function(f){ onMsg('بنزّل موديل «' + m.ar + '» (' + m.mb + ' ميجا، مرة واحدة بس)… ' + Math.round(f*100) + '%'); });
    return dl.then(loadORT).then(function(ort){
      onMsg('بجهّز الموديل…');
      var buf = fs().readFileSync(mpath(k));
      return ort.InferenceSession.create(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), {executionProviders:['wasm']});
    }).then(function(s){ SESS[k] = s; return s; });
  }
  function loadImg(path){
    return new Promise(function(res, rej){
      var b = fs().readFileSync(path), ext = (path.split('.').pop() || 'png').toLowerCase(), img = new Image();
      img.onload = function(){ res(img); }; img.onerror = function(){ rej(new Error('مش قادر أقرا الصورة')); };
      img.src = 'data:image/' + (ext === 'jpg' ? 'jpeg' : ext) + ';base64,' + b.toString('base64');
    });
  }
  /* returns path of a PNG with transparent background, same size as the input */
  function cut(path, k, onMsg){
    var m = MODELS[k];
    return Promise.all([session(k, onMsg), loadImg(path)]).then(function(r){
      var sess = r[0], img = r[1], S = m.size, cv = document.createElement('canvas');
      onMsg('بفصل الخلفية…');
      cv.width = S; cv.height = S; var g = cv.getContext('2d'); g.drawImage(img, 0, 0, S, S);
      var px = g.getImageData(0, 0, S, S).data, inp = new Float32Array(3 * S * S), i, c;
      var mx = 0; for(i = 0; i < S * S * 4; i++) if(i % 4 !== 3 && px[i] > mx) mx = px[i];
      mx = Math.max(1, mx);
      for(i = 0; i < S * S; i++) for(c = 0; c < 3; c++) inp[c * S * S + i] = (px[i * 4 + c] / mx - m.mean[c]) / m.std[c];
      var feeds = {}; feeds[sess.inputNames[0]] = new ort.Tensor('float32', inp, [1, 3, S, S]);
      return sess.run(feeds).then(function(out){
        var o = out[sess.outputNames[0]].data, lo = 1e9, hi = -1e9;
        for(i = 0; i < S * S; i++){ if(o[i] < lo) lo = o[i]; if(o[i] > hi) hi = o[i]; }
        var mk = document.createElement('canvas'); mk.width = S; mk.height = S; var mg = mk.getContext('2d'), md = mg.createImageData(S, S);
        for(i = 0; i < S * S; i++){ var v = Math.round((o[i] - lo) / Math.max(1e-6, hi - lo) * 255); md.data[i*4] = md.data[i*4+1] = md.data[i*4+2] = 255; md.data[i*4+3] = v; }
        mg.putImageData(md, 0, 0);
        // scale the mask to the full image and use it as alpha
        var W = img.naturalWidth, H = img.naturalHeight, outc = document.createElement('canvas'); outc.width = W; outc.height = H;
        var og = outc.getContext('2d'); og.imageSmoothingQuality = 'high';
        og.drawImage(mk, 0, 0, W, H); og.globalCompositeOperation = 'source-in'; og.drawImage(img, 0, 0, W, H);
        var b64 = outc.toDataURL('image/png').split(',')[1], dest = P().join(dir('cutouts'), P().basename(path).replace(/\.[^.]+$/, '') + '_cut_' + Date.now() + '.png');
        fs().writeFileSync(dest, NODE('buffer').Buffer.from(b64, 'base64'));
        return dest;
      });
    });
  }
  return {MODELS:MODELS, have:have, cut:cut};
}
