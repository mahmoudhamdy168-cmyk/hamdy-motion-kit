/* NABD Motion Kit v0.3 — animated previews (mirror what the AE engine builds) */
var NABD_PREVIEW = (function(){
"use strict";
var D = NABD_DATA;

/* ================================================================ math */
function clamp(v){ return v<0?0:v>1?1:v; }
function pin(t,k){ return Math.pow(t,k); }
function pout(t,k){ return 1-Math.pow(1-t,k); }
function outCubic(t){ return 1-Math.pow(1-t,3); }
function inCubic(t){ return t*t*t; }
function rnd(n){ var x = Math.sin(n*127.1+311.7)*43758.5453; return x-Math.floor(x); }
function lerp(a,b,u){ return a+(b-a)*u; }
function bez(x1,y1,x2,y2){
  return function(x){
    if(x<=0) return 0; if(x>=1) return 1;
    var t=x, i, cx, dx;
    for(i=0;i<10;i++){
      cx = 3*(1-t)*(1-t)*t*x1 + 3*(1-t)*t*t*x2 + t*t*t - x;
      dx = 3*(1-t)*(1-t)*x1 + 6*(1-t)*t*(x2-x1) + 3*t*t*(1-x2);
      if(Math.abs(dx)<1e-6) break;
      t = Math.max(0, Math.min(1, t - cx/dx));
    }
    return 3*(1-t)*(1-t)*t*y1 + 3*(1-t)*t*t*y2 + t*t*t;
  };
}
function svgURL(s){ return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")'; }

/* =========================================================== motion core */
// same curves as the AE engine (keyframe influence -> cubic bezier)
var EZ_IN  = {linear:bez(0,0,1,1), smooth:bez(.33,0,.3,1), cubic:bez(.2,0,.2,1), expo:bez(.05,0,.05,1), back:bez(.4,0,.67,.67), elastic:bez(.4,0,.67,.67), bounce:bez(.7,0,.67,.67)};
var EZ_OUT = {linear:bez(0,0,1,1), smooth:bez(.7,0,.67,1), cubic:bez(.8,0,.8,1), expo:bez(.95,0,.95,1), back:bez(.85,0,.9,1), elastic:bez(.85,0,.9,1), bounce:bez(.85,0,.9,1)};
var OVER = {back:[0.1,2,6], elastic:[0.14,3,4.5]};

// value of one channel going from -> rest (dir in) at time t seconds, duration dur
function chanIn(from, rest, ez, t, dur){
  var d = rest - from;
  if(t <= dur) return from + d*(EZ_IN[ez]||EZ_IN.cubic)(clamp(t/dur));
  var tau = t - dur, v = d/dur;               // arrival speed (linear arrival)
  if(OVER[ez]){ var o = OVER[ez]; if(tau<2) return rest + v*o[0]*Math.sin(o[1]*tau*2*Math.PI)/Math.exp(o[2]*tau); return rest; }
  if(ez==='bounce'){ return rest + bounceOff(v, tau); }
  return rest;
}
function bounceOff(v, t){
  var e=0.45, g=6000, vl=Math.abs(v)*e, vu = v<0 ? 1 : -1, tCur=0, seg=2*vl/g, tNext=seg, nb=1;
  while(tNext < t && nb <= 6){ vl*=e; seg*=e; tCur=tNext; tNext+=seg; nb++; }
  if(nb>6) return 0;
  var dd = t - tCur; return vu*dd*(vl - g*dd/2);
}
function chanOut(from, rest, ez, t, dur){
  if(t <= 0) return rest;
  return lerp(rest, from, (EZ_OUT[ez]||EZ_OUT.cubic)(clamp(t/dur)));
}
var REST = {op:100, x:0, y:0, s:100, sx:100, sy:100, r:0, sk:0, bl:0, db:0, wipe:0, rwipe:0, blinds:0, rx:0, ry:0, cc:0, block:0, luma:0};

// state of an "in" preset: phase 'in' with t since start, or 'out' with t since out start
function mpState(sp, phase, t, dur){
  var st = {}, tr = sp.tr || {}, k;
  for(k in REST) st[k] = REST[k];
  if(tr.flick){
    var fr=[0,.15,.3,.45,.6,.75,1], fv=[0,100,0,100,30,100,100], u = clamp(t/dur), i, v=100;
    if(phase==='in'){ for(i=0;i<fr.length;i++) if(u>=fr[i]) v=fv[i]; }
    else { for(i=0;i<fr.length;i++) if(u>=fr[i]) v=fv[fv.length-1-i]; if(u>=1) v=0; }
    st.op = v; return st;
  }
  for(k in tr){
    if(!(k in REST)) continue;
    st[k] = phase==='in' ? chanIn(tr[k], REST[k], sp.ease, t, dur) : chanOut(tr[k], REST[k], sp.ease, t, dur);
  }
  return st;
}
function emphState(sp, u){
  var st = {}, k, keys = sp.keys || {};
  for(k in REST) st[k] = REST[k];
  var ez = bez(.45,0,.55,1);
  for(k in keys){
    var L = keys[k], i, v = L[L.length-1][1];
    for(i=0;i<L.length-1;i++){
      if(u>=L[i][0] && u<=L[i+1][0]){ var w = (u-L[i][0])/((L[i+1][0]-L[i][0])||1); v = lerp(L[i][1], L[i+1][1], ez(w)); break; }
    }
    st[k] = v;
  }
  return st;
}
function loopState(sp, t){
  var st = {}, k, v = sp.lp ? sp.lp(t) : {};
  for(k in REST) st[k] = REST[k];
  for(k in v) st[k] = v[k];
  return st;
}
// apply a motion state to an element; sc = px per 1080-unit, ws = feather scale
function applyState(el, st, sc, sp){
  var tf = (st.rx || st.ry ? 'perspective(' + (400*sc*3) + 'px) ' : '') + 'translate(' + (st.x*sc).toFixed(2) + 'px,' + (st.y*sc).toFixed(2) + 'px) rotate(' + st.r.toFixed(2) + 'deg)';
  if(st.rx) tf += ' rotateX(' + st.rx.toFixed(2) + 'deg)';
  if(st.ry) tf += ' rotateY(' + st.ry.toFixed(2) + 'deg)';
  if(st.sx!==100 || st.sy!==100) tf += ' scale(' + (st.sx/100*(st.s/100)).toFixed(4) + ',' + (st.sy/100*(st.s/100)).toFixed(4) + ')';
  else tf += ' scale(' + (st.s/100).toFixed(4) + ')';
  if(st.sk) tf += ' skewX(' + (-st.sk).toFixed(2) + 'deg)';
  el.style.transform = tf;
  el.style.opacity = clamp(st.op/100);
  var f = '';
  var blur = st.bl*sc + st.db*sc*0.35;
  if(blur > 0.05) f = 'blur(' + blur.toFixed(2) + 'px)';
  el.style.filter = f;
  var c = st.wipe, mask = '';
  if(c > 0.05 && sp){
    var wa = sp.wa===undefined?270:sp.wa, fe = sp.feather ? Math.max(4, sp.feather/6) : 0;
    var dir = {90:'to right', 270:'to left', 0:'to bottom', 180:'to top'}[wa] || 'to left';
    // transparent part = first c% in the wipe direction
    mask = 'linear-gradient(' + dir + ', transparent ' + Math.max(0,c-fe) + '%, #000 ' + Math.min(100,c+fe) + '%)';
  } else if(st.cc > 0.05 && sp && sp.cc){
    var cc = st.cc;
    switch(sp.cc){
      case 'CC Jaws': mask = 'linear-gradient(to bottom, #000 ' + (50-cc/2) + '%, transparent ' + (50-cc/2) + '%, transparent ' + (50+cc/2) + '%, #000 ' + (50+cc/2) + '%)'; break;
      case 'CC Grid Wipe': mask = 'radial-gradient(closest-side, #000 ' + (100-cc) + '%, transparent ' + (100-cc+1) + '%) 0 0/25% 25%'; break;
      case 'CC Twister': el.style.transform += ' scaleX(' + Math.cos(cc/100*Math.PI/2).toFixed(3) + ')'; break;
      case 'CC Radial ScaleWipe': mask = 'radial-gradient(circle, transparent ' + (cc*0.75) + '%, #000 ' + (cc*0.75+1) + '%)'; break;
      case 'CS LineSweep': mask = 'linear-gradient(120deg, transparent ' + cc + '%, #000 ' + cc + '%)'; break;
      case 'CC Light Wipe': mask = 'radial-gradient(circle, #000 ' + (100-cc)*0.75 + '%, transparent ' + ((100-cc)*0.75+1) + '%)'; el.style.filter = (el.style.filter||'') + ' brightness(' + (1+cc/60).toFixed(2) + ')'; break;
    }
  } else if(st.block > 0.05){
    el.style.filter = (el.style.filter||'') + ' url(#nabdPx' + Math.max(1, Math.min(4, Math.round(st.block/25))) + ')'; el.style.opacity = clamp(1 - st.block/100);
  } else if(st.luma > 0.05){
    el.style.opacity = clamp(1 - st.luma/100); el.style.filter = (el.style.filter||'') + ' contrast(' + (1+st.luma/50).toFixed(2) + ')';
  } else if(st.rwipe > 0.05){
    mask = 'conic-gradient(from 0deg, transparent ' + st.rwipe + '%, #000 ' + st.rwipe + '%)';
  } else if(st.blinds > 0.05){
    mask = 'repeating-linear-gradient(to bottom, transparent 0, transparent ' + (st.blinds/100*10).toFixed(2) + 'px, #000 ' + (st.blinds/100*10).toFixed(2) + 'px, #000 10px)';
  }
  el.style.webkitMaskImage = mask; el.style.maskImage = mask;
}

/* ===================================================== transition preview */
var SCENE_A = svgURL('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#ff4d6d"/></linearGradient></defs><rect width="160" height="100" fill="url(#g)"/><circle cx="112" cy="36" r="16" fill="#fff3c4"/><path d="M0 78 L38 52 L70 74 L104 46 L160 80 V100 H0Z" fill="#5a1630"/><path d="M0 90 L50 70 L95 88 L160 72 V100 H0Z" fill="#2b0a18"/><text x="14" y="30" font-family="Arial" font-weight="700" font-size="22" fill="#2b0a18">A</text></svg>');
var SCENE_B = svgURL('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2bd2ff"/><stop offset="1" stop-color="#5b4bff"/></linearGradient></defs><rect width="160" height="100" fill="url(#g)"/><circle cx="40" cy="58" r="22" fill="none" stroke="#fff" stroke-width="5" opacity=".9"/><rect x="82" y="38" width="38" height="38" rx="8" fill="#0f1440" transform="rotate(12 101 57)"/><circle cx="132" cy="24" r="6" fill="#fff"/><text x="132" y="92" font-family="Arial" font-weight="700" font-size="22" fill="#0f1440">B</text></svg>');
document.documentElement.style.setProperty('--sceneA', SCENE_A);
document.documentElement.style.setProperty('--sceneB', SCENE_B);

function mountTr(box){
  box.innerHTML = '<div class="clip A"></div><div class="clip B"></div><div class="ov"></div><div class="fx"></div>';
  var fx = box.children[3], i;
  for(i=0;i<5;i++){ var b=document.createElement('div'); b.className='bar'; fx.appendChild(b); }
  return {A:box.children[0], B:box.children[1], ov:box.children[2], fx:fx, bars:fx.children, box:box};
}
function trFrame(id, p, k, acc){
  var first = p < 0.5, a = first ? pin(p/0.5, k) : pout((p-0.5)/0.5, k);
  var r = {A:'', B:'', fA:'', fB:'', ov:0, ovc:'#fff', showB:!first, bars:null};
  var W = 33.3333;
  function sl(dx,dy){ r.A = 'translate(' + (dx*a*W) + '%,' + (dy*a*W) + '%)'; r.B = 'translate(' + (-dx*(1-a)*W) + '%,' + (-dy*(1-a)*W) + '%)'; }
  function blurBoth(m){ var bl = first ? a*m : (1-a)*m; r.fA = r.fB = 'blur(' + bl.toFixed(1) + 'px)'; }
  var lin = first ? p/0.5 : (p-0.5)/0.5;   // un-eased half progress
  switch(id){
    case 'zoomIn':  r.A='scale(' + (1+2*a) + ')'; r.B='scale(' + (0.33+0.67*a) + ')'; break;
    case 'zoomOut': r.A='scale(' + (1-0.67*a) + ')'; r.B='scale(' + (3-2*a) + ')'; break;
    case 'crashZoom': var ka = first ? pin(p/0.5,6) : pout((p-0.5)/0.5,6); r.A='scale(' + (1+3.2*ka) + ')'; r.B='scale(' + (0.25+0.75*ka) + ')'; r.fA='blur(' + (ka*10).toFixed(1) + 'px)'; r.fB='blur(' + ((1-ka)*10).toFixed(1) + 'px)'; break;
    case 'blurZoom': r.A='scale(' + (1+0.35*a) + ')'; r.B='scale(' + (0.75+0.25*a) + ')'; r.fA='blur(' + (a*9).toFixed(1) + 'px)'; r.fB='blur(' + ((1-a)*9).toFixed(1) + 'px)'; break;
    case 'shake':
      var env = Math.sin(p*Math.PI), sd = Math.floor(p*30);
      var sc2 = 1 + 0.12*(first ? a : 1-a);
      r.A = r.B = 'translate(' + ((rnd(sd)-0.5)*2*env*5) + '%,' + ((rnd(sd+5)-0.5)*2*env*5) + '%) rotate(' + ((rnd(sd+9)-0.5)*10*env) + 'deg) scale(' + sc2 + ')';
      break;
    case 'slideLeft': sl(-1,0); break;
    case 'slideRight': sl(1,0); break;
    case 'slideUp': sl(0,-1); break;
    case 'slideDown': sl(0,1); break;
    case 'pushLeft': case 'pushRight':
      sl(id==='pushLeft'?-1:1, 0); var ps = 1-0.18*(first?a:1-a); r.A += ' scale(' + ps + ')'; r.B += ' scale(' + ps + ')'; break;
    case 'stretchLeft': case 'stretchRight':
      sl(id==='stretchLeft'?-1:1, 0); var sw = 1+2.5*(first?a:1-a); r.A += ' scale(' + sw + ',1)'; r.B += ' scale(' + sw + ',1)'; break;
    case 'whipLeft': case 'whipRight': sl(id==='whipLeft'?-1:1, 0); blurBoth(7); break;
    case 'whipUp': case 'whipDown': sl(0, id==='whipUp'?-1:1); blurBoth(7); break;
    case 'spin': r.A='rotate(' + (180*a) + 'deg) scale(' + (1+0.25*a) + ')'; r.B='rotate(' + (-180*(1-a)) + 'deg) scale(' + (1+0.25*(1-a)) + ')'; break;
    case 'spinBack': r.A='rotate(' + (-180*a) + 'deg) scale(' + (1+0.25*a) + ')'; r.B='rotate(' + (180*(1-a)) + 'deg) scale(' + (1+0.25*(1-a)) + ')'; break;
    case 'spinZoom': r.A='rotate(' + (90*a) + 'deg) scale(' + (1+1.6*a) + ')'; r.B='rotate(' + (-90*(1-a)) + 'deg) scale(' + (0.4+0.6*a) + ')'; break;
    case 'swing': sl(-1,0); r.A += ' rotate(' + (25*a) + 'deg)'; r.B += ' rotate(' + (-25*(1-a)) + 'deg)'; break;
    case 'twirl':
      var tw = first ? a : 1-a; r.A = 'rotate(' + (200*a) + 'deg) scale(' + (1+0.5*a) + ')'; r.B = 'rotate(' + (-200*(1-a)) + 'deg) scale(' + (1+0.5*(1-a)) + ')';
      r.fA = r.fB = 'blur(' + (tw*5).toFixed(1) + 'px)'; break;
    case 'warp':
      var wv = Math.sin(p*Math.PI); r.fA = r.fB = 'url(#nabdWarp' + Math.min(4, Math.round(wv*4)) + ')'; break;
    case 'pixelate':
      var pv = first ? pin(p/0.5,2.5) : pout((p-0.5)/0.5,2.5); var lv = Math.round((first?pv:1-pv)*4);
      r.fA = r.fB = lv>0 ? 'url(#nabdPx' + lv + ')' : ''; break;
    case 'glitch':
      var amt = Math.sin(p*Math.PI), seed = Math.floor(p*40);
      r.A = r.B = 'translate(' + ((rnd(seed)-0.5)*2*amt*14) + '%,' + ((rnd(seed+7)-0.5)*2*amt*4) + '%)';
      r.fA = r.fB = 'hue-rotate(' + Math.round(amt*rnd(seed+3)*180) + 'deg) saturate(' + (1+amt*2) + ')';
      r.ov = amt*0.55; r.ovc = 'repeating-linear-gradient(0deg,rgba(255,0,90,.5) 0 3px,transparent 3px 9px,rgba(0,220,255,.45) 9px 11px,transparent 11px 17px)';
      break;
    case 'blockGlitch':
      var steps=[0,3,0,4,2,3,0], si = Math.min(steps.length-1, Math.floor(p*steps.length)), bs = Math.floor(p*24);
      r.fA = r.fB = steps[si] ? 'url(#nabdPx' + steps[si] + ')' : '';
      var am2 = Math.sin(p*Math.PI); r.A = r.B = 'translate(' + ((rnd(bs)-0.5)*2*am2*10) + '%,' + ((rnd(bs+2)-0.5)*am2*2) + '%)';
      break;
    case 'flash': r.ov = first ? a : 1-a; r.ovc = '#fff'; break;
    case 'dip': r.ov = first ? a : 1-a; r.ovc = '#000'; break;
    case 'burn': var bv = first ? a : 1-a; r.fA = r.fB = 'brightness(' + (1+bv*3.2).toFixed(2) + ') blur(' + (bv*6).toFixed(1) + 'px)'; break;
    case 'lightLeak':
      var lp = p, lo = Math.sin(p*Math.PI);
      r.ov = Math.min(1, lo*1.2); r.ovc = 'radial-gradient(60% 90% at ' + (-20+130*lp) + '% 70%, rgba(255,140,40,1), rgba(255,140,40,0) 70%), radial-gradient(55% 80% at ' + (110-120*lp) + '% 30%, rgba(255,60,115,.95), rgba(255,60,115,0) 70%)';
      r.ovBlend = 'screen'; break;
    case 'lensFlash':
      var fv = first ? a : 1-a; r.ov = fv; r.ovc = 'radial-gradient(circle at 50% 50%, #fff ' + (fv*30) + '%, rgba(255,240,210,.9) ' + (fv*55) + '%, rgba(255,240,210,0) ' + (10+fv*90) + '%)';
      r.ovBlend = 'screen'; break;
    case 'fisheye': var fe2 = first ? a : 1-a; r.A = 'scale(' + (1+0.5*a) + ')'; r.B = 'scale(' + (0.7+0.3*a) + ')'; r.fA = r.fB = 'url(#nabdWarp' + Math.min(4, Math.round(fe2*3)) + ') blur(' + (fe2*2).toFixed(1) + 'px)'; break;
    case 'polar': var po = first ? a : 1-a; r.A = 'rotate(' + (a*160) + 'deg) scale(' + (1-0.4*a) + ')'; r.B = 'rotate(' + (-(1-a)*160) + 'deg) scale(' + (0.6+0.4*a) + ')'; r.fA = r.fB = 'blur(' + (po*3).toFixed(1) + 'px) url(#nabdWarp' + Math.min(4, Math.round(po*4)) + ')'; break;
    case 'bulge': var bu = first ? a : 1-a; r.A = r.B = 'scale(' + (1+0.25*bu) + ')'; r.fA = r.fB = 'url(#nabdWarp' + Math.min(4, Math.round(bu*2)) + ')'; break;
    case 'spherize': var sp3 = first ? a : 1-a; r.A = r.B = 'scale(' + (1+0.35*sp3) + ')'; r.fA = r.fB = 'blur(' + (sp3*1.5).toFixed(1) + 'px)'; break;
    case 'ripple': var rp = Math.sin(p*Math.PI); r.fA = r.fB = 'url(#nabdWarp' + Math.min(4, Math.round(rp*4)) + ')'; break;
    case 'zoomRadial': r.A='scale(' + (1+0.8*a) + ')'; r.B='scale(' + (0.55+0.45*a) + ')'; r.fA='blur(' + (a*7).toFixed(1) + 'px)'; r.fB='blur(' + ((1-a)*7).toFixed(1) + 'px)'; break;
    case 'spinBlur': r.A='rotate(' + (90*a) + 'deg) scale(' + (1+0.3*a) + ')'; r.B='rotate(' + (-90*(1-a)) + 'deg) scale(' + (1+0.3*(1-a)) + ')'; blurBoth(6); break;
    case 'rotate90': r.A='rotate(' + (90*a) + 'deg) scale(' + (1+0.4*a) + ')'; r.B='rotate(' + (-90*(1-a)) + 'deg) scale(' + (1+0.4*(1-a)) + ')'; break;
    case 'scrollLeft': sl(-1,0); blurBoth(5); break;
    case 'scrollRight': sl(1,0); blurBoth(5); break;
    case 'scrollUp': sl(0,-1); blurBoth(5); break;
    case 'scrollDown': sl(0,1); blurBoth(5); break;
    case 'blurDissolve': blurBoth(10); break;
    case 'strobe': var sv = [0,1,0,1,0,1,0], si2 = Math.min(6, Math.floor(p*7)); r.ov = sv[si2]; r.ovc = '#fff'; break;
    case 'lightSweep': var lx = -40 + 180*p, lo2 = Math.sin(p*Math.PI); r.ov = lo2; r.ovc = 'linear-gradient(108deg, transparent ' + (lx-25) + '%, rgba(255,248,230,.95) ' + lx + '%, transparent ' + (lx+25) + '%)'; r.ovBlend = 'screen'; break;
    case 'filmBurn': var fb = Math.sin(p*Math.PI)*(0.75+0.25*rnd(Math.floor(p*40))); r.ov = Math.min(1, fb*1.3); r.ovc = 'radial-gradient(70% 90% at 15% 80%, rgba(255,115,20,1), rgba(255,115,20,0) 70%), radial-gradient(60% 80% at 85% 20%, rgba(255,30,10,.95), rgba(255,30,10,0) 70%)'; r.ovBlend = 'screen'; break;
    case 'flare': var fx2 = 10 + 80*p, fo = Math.sin(p*Math.PI); r.ov = fo; r.ovc = 'radial-gradient(circle at ' + fx2 + '% 35%, #fff 0, rgba(255,230,190,.9) 6%, rgba(255,200,140,0) 30%), linear-gradient(90deg, transparent 0, rgba(255,220,180,.5) ' + fx2 + '%, transparent 100%)'; r.ovBlend = 'screen'; break;
    case 'clockWipe':
      var cw = first ? a : 1-a, deg = cw*360;
      r.ov = cw>0.001 ? 1 : 0;
      r.ovc = first ? 'conic-gradient(' + acc + ' 0 ' + deg + 'deg, transparent ' + deg + 'deg)' : 'conic-gradient(transparent 0 ' + (360-deg) + 'deg, ' + acc + ' ' + (360-deg) + 'deg)';
      break;
    case 'starIris': case 'heartIris':
      var iv = first ? a : 1-a; r.ov = iv>0.001 ? 1 : 0;
      r.ovc = acc; r.ovMask = id==='starIris' ? 'star' : 'heart'; r.ovScale = iv*4.2; r.ovRot = (first ? a : -(1-a))*90;
      break;
    case 'dots': case 'squares':
      var cv = first ? a : 1-a, rr = cv*75;
      r.ov = cv>0.001 ? 1 : 0;
      r.ovc = id==='dots' ? 'radial-gradient(circle, ' + acc + ' ' + rr + '%, transparent ' + (rr+1) + '%) 0 0/11.11% 17.7%' : 'conic-gradient(from 0deg, ' + acc + ' 0 0) center/' + (cv*11.4) + '% ' + (cv*17.9) + '% space';
      break;
    default:
      r.shape = id;
  }
  r.a = a; r.first = first; r.lin = lin;
  return r;
}
function shapeBars(el, id, p, a, first, acc){
  var bars = el.bars, i;
  for(i=0;i<bars.length;i++){ bars[i].style.display='none'; bars[i].style.background = acc; bars[i].style.borderRadius='0'; }
  function show(i, l, t, w, h, tf){ var b=bars[i]; b.style.display='block'; b.style.left=l+'%'; b.style.top=t+'%'; b.style.width=w+'%'; b.style.height=h+'%'; b.style.transform=tf||''; }
  var cov = first ? a : 1-a;            // 0 -> 1 (covered at cut) -> 0
  switch(id){
    case 'shapeLeft':  show(0, first ? 100-100*a : -100*a, 0, 101, 100); break;
    case 'shapeRight': show(0, first ? -100+100*a : 100*a, 0, 101, 100); break;
    case 'shapeUp':    show(0, 0, first ? 100-100*a : -100*a, 100, 101); break;
    case 'shapeDown':  show(0, 0, first ? -100+100*a : 100*a, 100, 101); break;
    case 'circle':
      var dd = cov*190; show(0, 50-dd/2*0.625, 50-dd/2, dd*0.625, dd); bars[0].style.borderRadius='50%'; break;
    case 'bars':
      for(i=0;i<5;i++){
        var u = clamp((p*1.0 - i*0.05)/0.95), loc;
        var pp = first ? clamp(((p/0.5) - i*0.12)/0.52) : clamp((((p-0.5)/0.5) - i*0.12)/0.52);
        var e = first ? pin(pp, 3) : pout(pp,3);
        loc = first ? -101 + 101*e : 101*e;
        show(i, i*20, loc, 20.4, 101);
      }
      break;
    case 'split':
      show(0, 0, -50 + 50*cov, 100, 50.5); show(1, 0, 100 - 50*cov, 100, 50.5); break;
    case 'diagonal':
      var x = first ? 150 - 150*a : -150*a; show(0, -35 + x, -80, 170, 260, 'rotate(20deg)'); break;
    case 'circleCorner':
      var dd2 = cov*400; show(0, -dd2/2*0.625, 100-dd2/2, dd2*0.625, dd2); bars[0].style.borderRadius='50%'; break;
    case 'stripes':
      for(i=0;i<5;i++){
        var q = first ? clamp(((p/0.5) - i*0.1)/0.6) : clamp((((p-0.5)/0.5) - i*0.1)/0.6), eq = first ? pin(q,3) : pout(q,3);
        var yy = first ? -230 + 230*eq : 230*eq;
        show(i, -30 + i*34, yy - 70, 36, 240, 'rotate(25deg)'); bars[i].style.background = i%2 ? acc : 'color-mix(in srgb, ' + acc + ' 75%, #000)';
      }
      break;
    case 'brush':
      var bt = first ? clamp(p/0.5) : clamp((p-0.5)/0.5);
      for(i=0;i<3;i++){
        var seg2 = clamp(bt*3 - i), w2 = first ? seg2*110 : 110 - seg2*110, l2 = first ? -5 : -5 + seg2*110;
        if(!first && seg2 <= 0){ w2 = 110; l2 = -5; }
        show(i, i%2 ? 100-l2-w2 : l2, -10 + i*38, w2, 44); bars[i].style.borderRadius = '40px';
      }
      break;
    case 'doubleWipe':
      var a1 = first ? clamp(a*1.25) : clamp(a*1.25 - 0.25), a2 = first ? clamp(a*1.25 - 0.25) : clamp(a*1.25);
      show(0, first ? 100-100*a1 : -100*a1, 0, 101, 100); bars[0].style.background = '#fff';
      show(1, first ? 100-100*a2 : -100*a2, 0, 101, 100);
      break;
    case 'panels':
      for(i=0;i<3;i++){ var dr = i%2 ? -1 : 1, xx = first ? dr*(100-100*a) : -dr*100*a; show(i, xx, i*33.4, 101, 33.6); }
      break;
  }
}
function drawTr(el, id, t, frames, snappy, acc){
  var dur = Math.max(0.35, frames/30) * 1.7, hold = 0.55, cyc = hold*2 + dur + 0.25;
  var tt = t % cyc, p;
  if(tt < hold) p = 0; else if(tt < hold+dur) p = (tt-hold)/dur; else p = 1;
  var f = trFrame(id, p, snappy ? 4 : 2.6, acc);
  var showB = p >= 0.5;
  if(p===0 || p===1){ f = {A:'',B:'',fA:'',fB:'',ov:0,ovc:'#fff', a:0, first:p===0}; }
  el.A.style.opacity = showB?0:1; el.B.style.opacity = showB?1:0;
  el.A.style.transform = f.A; el.B.style.transform = f.B;
  el.A.style.filter = f.fA; el.B.style.filter = f.fB;
  el.ov.style.opacity = f.ov; el.ov.style.background = f.ovc; el.ov.style.mixBlendMode = f.ovBlend || 'normal';
  if(f.ovMask){
    el.ov.style.clipPath = f.ovMask==='star' ? 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)' : 'path("M80 92 C20 60 10 30 40 18 C60 10 76 24 80 32 C84 24 100 10 120 18 C150 30 140 60 80 92Z")';
    el.ov.style.transform = 'scale(' + f.ovScale.toFixed(3) + ') rotate(' + f.ovRot.toFixed(1) + 'deg)';
    el.ov.style.transformOrigin = '50% 55%';
    if(f.ovMask==='heart'){ el.ov.style.clipPath = 'polygon(50% 92%,15% 62%,4% 38%,10% 18%,27% 10%,42% 16%,50% 28%,58% 16%,73% 10%,90% 18%,96% 38%,85% 62%)'; }
  } else { el.ov.style.clipPath = ''; el.ov.style.transform = ''; }
  if(f.shape && p>0 && p<1) shapeBars(el, id, p, f.a, f.first, acc);
  else { for(var i=0;i<el.bars.length;i++) el.bars[i].style.display='none'; }
}

/* ======================================================== motion preview */
var LOGO = '<svg viewBox="0 0 100 100"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--acc)"/><stop offset="1" stop-color="var(--acc2)"/></linearGradient></defs><rect x="6" y="6" width="88" height="88" rx="24" fill="url(#lg)"/><path d="M18 52h14l9-22 14 42 9-20h18" fill="none" stroke="#1a0d05" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function mountMp(box){
  box.innerHTML = '<div class="mpstage"><div class="mpobj">' + LOGO + '</div></div>';
  return {obj: box.querySelector('.mpobj'), box:box};
}
function drawMp(el, sp, t, opt){
  var h = el.box.clientHeight || 80, sc = h/1080 * 0.9;
  var st;
  if(sp.kind==='loop'){ st = loopState(sp, t); }
  else if(sp.kind==='emph'){ var dE = Math.max(0.3,(opt.frames||18)/30)*1.4, cyc = dE + 0.9; var u = clamp(((t%cyc)-0.45)/dE); st = emphState(sp, u); }
  else {
    var d = Math.max(0.3, (opt.frames||18)/30) * 1.25, hold = 0.55 + (sp.ease==='bounce'||OVER[sp.ease] ? 0.6 : 0), gap = 0.3;
    var doIn = opt.dir!=='out', doOut = opt.dir!=='in', cyc2 = (doIn?d:0) + hold + (doOut?d:0) + gap, tt = t % cyc2;
    if(doIn && tt < d + hold){ st = mpState(sp, 'in', tt, d); }
    else if(!doIn && tt < hold){ st = mpState(sp, 'in', 99, d); }
    else {
      var to = tt - (doIn ? d + hold : hold);
      st = to <= d ? mpState(sp, 'out', to, d) : mpState(sp, 'out', d, d);
      if(!doOut) st = mpState(sp, 'in', 99, d);
    }
  }
  applyState(el.obj, st, sc, sp);
}

/* ========================================================== text preview */
var AR = /[؀-ۿ]/;
function unitsOf(text, based){
  if(based==='auto') based = AR.test(text) ? 'words' : 'chars';
  var parts;
  if(based==='chars') parts = Array.from(text);
  else if(based==='lines') parts = text.split(/(\n)/);
  else parts = text.split(/(\s+)/);
  return parts.filter(function(s){ return s!==''; });
}
function mountTx(box, text, based, fs){
  box.innerHTML = '<div class="tstage"><div class="txt" dir="auto"></div></div>';
  var t = box.querySelector('.txt'); t.style.fontSize = fs + 'px';
  var us = [], parts = unitsOf(text || ' ', based);
  var AR = /[\u0620-\u064A\u066E-\u06D3\u06FA-\u06FF]/, NOLEFT = /[\u0622-\u0625\u0627\u0629\u062F-\u0632\u0648\u0649]/;
  parts.forEach(function(s, k){
    if(/^\s+$/.test(s)){ t.appendChild(document.createTextNode(s)); return; }
    var prev = parts[k-1] || '', next = parts[k+1] || '', a = s;
    if(s.length === 1 && AR.test(s)){
      if(prev.length === 1 && AR.test(prev) && !NOLEFT.test(prev)) a = '\u200d' + a;
      if(next.length === 1 && AR.test(next) && !NOLEFT.test(s)) a = a + '\u200d';
    }
    var sp = document.createElement('span'); sp.className='u'; sp.textContent = a; sp._orig = a; t.appendChild(sp); us.push(sp);
  });
  var order = us.map(function(_,i){ return i; });
  for(var i=order.length-1;i>0;i--){ var j = Math.floor(rnd(i*3.1)*(i+1)); var x=order[i]; order[i]=order[j]; order[j]=x; }
  return {box:t, us:us, order:order, fs:fs, text:text || ' '};
}
var GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*';
function txApply(sp, spec, h, i, n, fs, t, acc){
  var k = fs/110, o = 1, tf = '', f = '';
  if(spec.op!==undefined) o = 1 - h*(1 - spec.op/100);
  var x=0, y=0, s=100, r=0, sk=0, bl=0;
  if(spec.pos){ x = spec.pos[0]*h*k; y = spec.pos[1]*h*k; }
  if(spec.sc!==undefined && !spec.loop) s = 100 + (spec.sc-100)*h;
  var svx = 100, svy = 100;
  if(spec.scv){ svx = 100 + (spec.scv[0]-100)*h; svy = 100 + (spec.scv[1]-100)*h; }
  if(spec.rot) r = spec.rot*h;
  if(spec.skew) sk = spec.skew*h;
  if(spec.blur) bl = Math.max(spec.blur[0], spec.blur[1])*h*k*0.35;
  if(spec.trk) x += (i-(n-1)/2)*spec.trk/1000*h*fs;
  tf = (spec.rx || spec.ry ? 'perspective(' + (fs*6) + 'px) ' : '') + 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px) rotate(' + r.toFixed(2) + 'deg) scale(' + Math.max(0,s/100*svx/100).toFixed(4) + ',' + Math.max(0,s/100*svy/100).toFixed(4) + ')' + (sk ? ' skewX(' + (-sk) + 'deg)' : '');
  if(spec.rx) tf += ' rotateX(' + (spec.rx*h).toFixed(2) + 'deg)';
  if(spec.ry) tf += ' rotateY(' + (spec.ry*h).toFixed(2) + 'deg)';
  if(bl > 0.05) f = 'blur(' + bl.toFixed(1) + 'px)';
  sp.style.opacity = clamp(o); sp.style.transform = tf; sp.style.filter = f;
  if(spec.fill) sp.style.color = (h > 0.02 || spec.trail) ? acc : '';
  if(spec.chOff){
    if(h > 0.08){ var s2=''; for(var c=0;c<sp._orig.length;c++){ s2 += GLYPHS.charAt(Math.floor(rnd(i*31+c*7+Math.floor(t*20))*GLYPHS.length)); } sp.textContent = s2; }
    else sp.textContent = sp._orig;
  }
}
function patPos(pattern, i, n, el){
  var pos = n>1 ? i/(n-1) : 0;
  switch(pattern){
    case 'reverse': return 1-pos;
    case 'center': return Math.abs(pos-0.5)*2;
    case 'edges': return 1-Math.abs(pos-0.5)*2;
    case 'shuffle': return rnd(i+7);
  }
  return pos;
}
function typeSrcDraw(el, spec, t, cps, doOut){
  var src = spec.src, txt = el.text, mode = src.mode || 'chars';
  var units = mode==='words' ? txt.split(' ') : (mode==='lines' ? txt.split(/\n/) : Array.from(txt));
  var spd = mode==='words' ? Math.max(0.5, cps/4.5) : (mode==='lines' ? Math.max(0.2, cps/22) : cps);
  var N = units.length, T = N/spd, cyc = T + 1.4 + (src.erase ? N/(spd*2) : 0) + 0.5, tt = t % cyc, n;
  n = Math.min(N, Math.floor(tt*spd) + 1);
  if(src.erase && tt > T + 1.4) n = Math.max(0, N - Math.floor((tt - T - 1.4)*spd*2));
  if(tt > cyc - 0.5 && src.erase) n = 0;
  var out = units.slice(0, n).join(mode==='words' ? ' ' : (mode==='lines' ? '\n' : ''));
  var typing = n > 0 && n < N, cur = src.cur && (typing || Math.floor(t*2.2)%2===0) ? src.cur : '';
  if(el._last !== out + '|' + cur){ el._last = out + '|' + cur; el.box.textContent = out; if(cur){ var c = document.createElement('span'); c.className = 'tcur'; c.textContent = cur; el.box.appendChild(c); } }
}
function typeTwDraw(el, spec, t, cps, doIn, doOut, acc){
  var n = el.us.length, d = spec.twDur || 0.18, T = (n-1)/cps + d, cyc = (doIn?T:0) + 1.3 + (doOut?T:0) + 0.45, tt = t % cyc;
  var ord = el.us.map(function(_, i){
    if(spec.twOrder==='random') return el.order[i];
    if(spec.twOrder==='center') return Math.round(Math.abs(i - (n-1)/2)*2);
    return i;
  });
  el.us.forEach(function(sp, i){
    var h, u, e, k = ord[i];
    if(tt < (doIn?T:0) + 1.3){
      if(!doIn){ h = 0; }
      else {
        u = clamp((tt - k/cps)/d);
        if(spec.twEase==='back'){ var q = u-1; e = 1 + 2.70158*q*q*q + 1.70158*q*q; } else e = 1 - Math.pow(1-u, 3);
        h = 1 - e;
      }
    } else if(doOut && tt < T*2 + 1.3){
      var kk = n-1-i; u = clamp((tt - T - 1.3 - kk/cps)/d); h = 1 - Math.pow(1-u, 3);
    } else h = doOut ? 1 : 0;
    var sp2 = {};
    for(var key in spec) sp2[key] = spec[key];
    if(spec.trail){
      var since = tt - k/cps, tr = (doIn && since >= 0 && since < 0.4 && tt < T + 1.3) ? 1 - since/0.4 : 0;
      var scr = !!(spec.trail.chOff && tr > 0.1);
      sp2.fill = !!(spec.trail.fill && tr > 0.05); sp2.chOff = 0;
      txApply(sp, sp2, h, i, n, el.fs, t, acc);
      if(scr){ var s3=''; for(var c=0;c<sp._orig.length;c++){ s3 += GLYPHS.charAt(Math.floor(rnd(i*31+c*7+Math.floor(t*20))*GLYPHS.length)); } sp.textContent = s3; } else sp.textContent = sp._orig;
      if(!sp2.fill) sp.style.color = '';
      return;
    }
    txApply(sp, sp2, h, i, n, el.fs, t, acc);
  });
}
function drawTx(el, spec, t, doIn, doOut, acc, pattern, cps){
  var n = el.us.length;
  if(spec.src){ typeSrcDraw(el, spec, t, cps || 14, doOut); return; }
  if(spec.tw){ typeTwDraw(el, spec, t, cps || 14, doIn !== false, doOut, acc); return; }
  if(spec.loop){
    el.us.forEach(function(sp, i){
      var h = 0, st = {};
      if(spec.loop==='wiggle'){
        var wf = (spec.wig || 2)/2, nx = D.noise(t*2*wf+i*1.7, i*3), ny = D.noise(t*2*wf+i*2.3, i*7), nr = D.noise(t*2*wf+i*0.9, i*5+2), k = el.fs/110;
        var px2 = spec.pos ? spec.pos[0]*nx*k : 0, py2 = spec.pos ? spec.pos[1]*ny*k : 0;
        sp.style.transform = 'translate(' + px2.toFixed(2) + 'px,' + py2.toFixed(2) + 'px) rotate(' + ((spec.rot||0)*nr).toFixed(2) + 'deg)' + (spec.skew ? ' skewX(' + (spec.skew*nr).toFixed(1) + 'deg)' : '');
        sp.style.opacity = spec.op!==undefined ? clamp(1 - Math.abs(D.noise(t*2*wf + i*3.1, i))) : 1; sp.style.filter = '';
        return;
      } else if(spec.loop==='expr'){
        var lv = spec.lpv ? spec.lpv(t) : 0;
        var esc2 = spec.sc ? 1 + (spec.sc/100-1)*lv : 1;
        sp.style.transform = 'scale(' + esc2.toFixed(3) + ')'; sp.style.opacity = spec.op!==undefined ? 1 - lv : 1; sp.style.filter = '';
        return;
      } else if(spec.loop==='hue'){
        sp.style.transform = ''; sp.style.opacity = 1; sp.style.filter = ''; sp.style.color = 'hsl(' + Math.round(((t*0.25)%1)*360) + ',85%,60%)';
        return;
      } else {
        var off = ((t*70)%125)-25, posi = n>1 ? i/(n-1)*100 : 50, w = 25;
        var amt = (posi>=off && posi<=off+w) ? Math.sin(Math.PI*(posi-off)/w) : 0;
        var wy = spec.pos ? spec.pos[1]*amt*el.fs/110 : 0, wsc = spec.sc ? 1 + (spec.sc/100-1)*amt : 1;
        var wsx = spec.scv ? 1 + (spec.scv[0]/100-1)*amt : 1, wsy = spec.scv ? 1 + (spec.scv[1]/100-1)*amt : 1;
        sp.style.transform = 'translateY(' + wy.toFixed(2) + 'px) scale(' + (wsc*wsx).toFixed(3) + ',' + (wsc*wsy).toFixed(3) + ')';
        if(spec.fill) sp.style.color = amt > 0.15 ? acc : '';
      }
      sp.style.opacity = 1; sp.style.filter = '';
    });
    return;
  }
  var IN=1.1, HOLD=0.9 + (spec.overshoot?0.4:0), OUT=1.0, GAP=0.35, cyc = IN+HOLD+(doOut?OUT:0)+GAP, tt = t%cyc;
  var s = 0.65;
  el.us.forEach(function(sp, i){
    var r = spec.random ? el.order[i] : i, pos = (pattern && pattern!=='normal' && !spec.square) ? patPos(pattern, i, n) : (n>1 ? r/(n-1) : 0), h = 0, u;
    if(tt < IN + HOLD){
      if(!doIn){ h = 0; }
      else {
        var P = tt/IN;
        if(spec.square){ h = (Math.min(1,P)*n > r) ? 0 : 1; }
        else {
          u = P*(1+s) - s*pos;
          if(spec.overshoot){
            var ua = clamp(u), base = 1 - bez(.4,0,.67,.67)(ua);
            if(u > 1){ var tau = (u-1)*IN/(1+s); base = -0.1*1.7*Math.sin(2.5*tau*2*Math.PI)/Math.exp(6*tau); }
            h = base;
          } else { h = 1 - outCubic(clamp(u)); }
        }
      }
    } else if(doOut && tt < IN+HOLD+OUT){
      var Q = (tt-IN-HOLD)/OUT;
      if(spec.square){ h = (Q*n > r) ? 1 : 0; }
      else { u = clamp(Q*(1+s) - s*pos); h = inCubic(u); }
    } else { h = doOut ? 1 : 0; }
    txApply(sp, spec, h, i, n, el.fs, t, acc);
    if(spec.pv) pvChar(sp, spec, i, n, el.fs, t, acc, txG(tt, IN, HOLD, OUT, doIn, doOut));
  });
  if(spec.pv) pvLayer(el, spec, txG(tt, IN, HOLD, OUT, doIn, doOut), t, acc);
  else if(el._pv){ el._pv = 0; el.box.style.filter = ''; el.box.style.clipPath = ''; el.box.style.webkitMaskImage = ''; el.box.style.transform = ''; }
}
/* layer-level progress for effect-based text animations (1 = start state, 0 = rest) */
function txG(tt, IN, HOLD, OUT, doIn, doOut){
  if(tt < IN + HOLD) return doIn ? 1 - outCubic(clamp(tt/IN)) : 0;
  if(doOut && tt < IN + HOLD + OUT) return inCubic(clamp((tt-IN-HOLD)/OUT));
  return doOut ? 1 : 0;
}
function pvHas(spec, k){ return spec.pv.indexOf(k) >= 0; }
function pvLayer(el, spec, g, t, acc){
  var b = el.box, f = [], k = el.fs/110, cp = '', mk = '', tf = '';
  el._pv = 1;
  if(pvHas(spec,'blur')) f.push('blur(' + (g*14*k).toFixed(1) + 'px)');
  if(pvHas(spec,'zoom')){ f.push('blur(' + (g*6*k).toFixed(1) + 'px)'); tf = 'scale(' + (1 + g*0.5).toFixed(3) + ')'; }
  if(pvHas(spec,'glow')) f.push('drop-shadow(0 0 ' + (2 + g*14).toFixed(1) + 'px ' + acc + ') brightness(' + (1 + g*1.5).toFixed(2) + ')');
  if(pvHas(spec,'neon')) f.push('drop-shadow(0 0 6px ' + acc + ') drop-shadow(0 0 14px ' + acc + ')');
  if(pvHas(spec,'turb') && g > 0.02) f.push('url(#nabdWarp' + Math.min(4, 1 + Math.floor(g*4)) + ')');
  if(pvHas(spec,'liquid')) f.push('blur(' + (g*5*k).toFixed(1) + 'px) contrast(' + (1 + g*3).toFixed(2) + ')');
  if(pvHas(spec,'wipe')) cp = 'inset(0 ' + (g*100).toFixed(1) + '% 0 0)';
  if(pvHas(spec,'wipeR')) cp = 'inset(0 0 0 ' + (g*100).toFixed(1) + '%)';
  if(pvHas(spec,'blinds')){ var w = (8*(1-g)).toFixed(2); mk = 'repeating-linear-gradient(#000 0px, #000 ' + w + 'px, transparent ' + w + 'px, transparent 8px)'; }
  if(pvHas(spec,'radial')) mk = 'conic-gradient(#000 ' + ((1-g)*360).toFixed(1) + 'deg, transparent 0deg)';
  b.style.filter = f.join(' '); b.style.clipPath = cp; b.style.webkitMaskImage = mk; b.style.transform = tf;
}
function pvChar(sp, spec, i, n, fs, t, acc, g){
  var k = fs/110;
  if(pvHas(spec,'wave') && g > 0.001){ sp.style.transform += ' translateY(' + (Math.sin(i*0.9 + t*14)*g*fs*0.35).toFixed(2) + 'px)'; }
  if(pvHas(spec,'echo') && g > 0.01){ var dx = g*24*k; sp.style.textShadow = (-dx).toFixed(1) + 'px 0 rgba(255,255,255,.35),' + (-dx*2).toFixed(1) + 'px 0 rgba(255,255,255,.18),' + (-dx*3).toFixed(1) + 'px 0 rgba(255,255,255,.08)'; }
  else if(pvHas(spec,'echo')) sp.style.textShadow = '';
  if(pvHas(spec,'rgb')){ var o = g*7*k*(rnd(i + Math.floor(t*24)) > 0.4 ? 1 : -1); sp.style.textShadow = g > 0.01 ? o.toFixed(1) + 'px 0 rgba(255,0,60,.8),' + (-o).toFixed(1) + 'px 0 rgba(0,220,255,.8)' : ''; }
  if(pvHas(spec,'dissolve')){ var fl = rnd(i*7.3 + 1); sp.style.opacity = (g < fl) ? sp.style.opacity : 0; }
  if(pvHas(spec,'flicker') && g > 0.02 && g < 0.98){ sp.style.opacity = rnd(i*3 + Math.floor(t*30)) > g ? 1 : 0.1; }
}

/* ======================================================== easing preview */
function easeFn(e){
  if(e.bz) return bez(e.bz[0], e.bz[1], e.bz[2], e.bz[3]);
  if(e.mode==='linear') return function(x){ return x; };
  if(e.mode==='hold') return function(x){ return x<1?0:1; };
  return bez(e.o/100, 0, 1 - e.i/100, 1);
}
function mountEz(box, item){
  box.classList.add('ease');
  box.innerHTML = '<svg viewBox="0 0 160 100" preserveAspectRatio="none"><rect width="160" height="100" fill="#121216"/><g stroke="#26262c" stroke-width="1"><line x1="20" y1="15" x2="20" y2="70"/><line x1="20" y1="70" x2="140" y2="70"/></g><path class="curve" fill="none" stroke="var(--acc)" stroke-width="2.2"/><circle class="cdot" r="3.2" fill="#fff"/><line x1="20" y1="86" x2="140" y2="86" stroke="#2c2c33" stroke-width="4" stroke-linecap="round"/><circle class="bar" cy="86" r="5" fill="var(--acc2)"/></svg>';
  var svg = box.firstChild;
  var el = {curve:svg.querySelector('.curve'), cdot:svg.querySelector('.cdot'), bar:svg.querySelector('.bar'), item:item, trail:[]};
  if(!item.expr){
    var f = easeFn(item), d = '';
    for(var i=0;i<=60;i++){ var x=i/60, y=f(x); d += (i?'L':'M') + (20+x*120).toFixed(1) + ' ' + (70-y*55).toFixed(1); }
    el.curve.setAttribute('d', d); el.f = f;
  }
  return el;
}
function bounceEase(x){
  var n1=7.5625, d1=2.75;
  if(x<1/d1) return n1*x*x;
  if(x<2/d1) return n1*(x-=1.5/d1)*x+0.75;
  if(x<2.5/d1) return n1*(x-=2.25/d1)*x+0.9375;
  return n1*(x-=2.625/d1)*x+0.984375;
}
function exprVal(id, t){
  var c, k;
  switch(id){
    case 'overshoot': c = t%2.2; k = c<0.45 ? outCubic(c/0.45) : 1 + 0.22*Math.sin(2.5*2*Math.PI*(c-0.45))*Math.exp(-6*(c-0.45)); if(c>1.9) k=0; return {x:k, y:k};
    case 'bounce': c = t%2.4; var b = bounceEase(Math.min(1,c/1.3)); if(c>2.0) b=0; return {x:b, y:b};
    case 'loopCycle': c = (t%1.4)/1.4; k = 1-Math.pow(1-c,2); return {x:k, y:k};
    case 'loopPing': c = (t%2.4)/1.2; k = c<1 ? c : 2-c; k = 0.5-0.5*Math.cos(Math.PI*k); return {x:k, y:k};
    case 'loopCont': c = (t*0.45)%1; return {x:c, y:c};
    case 'wiggleSoft': k = 0.5 + 0.3*D.noise(t*1.5, 2); return {x:k, y:k};
    case 'wiggleHard': k = 0.5 + 0.45*D.noise(t*8, 4); return {x:clamp(k), y:clamp(k)};
    case 'spin': return {x:0.5, y:0.5, rot:(t*90)%360};
    default: return {x:0.5, y:0.5};
  }
}
function drawEz(el, t){
  var it = el.item;
  if(!it.expr){
    var c = clamp((t%2.2)/1.5), y = el.f(c);
    el.cdot.setAttribute('cx', 20+c*120); el.cdot.setAttribute('cy', 70-y*55);
    el.bar.setAttribute('cx', 20+y*120);
  } else {
    var v = exprVal(it.id, t);
    el.trail.push(v.y); if(el.trail.length>60) el.trail.shift();
    var d=''; for(var i=0;i<el.trail.length;i++){ d += (i?'L':'M') + (20+i*2).toFixed(1) + ' ' + (70-el.trail[i]*55).toFixed(1); }
    el.curve.setAttribute('d', it.id==='none' ? '' : d);
    el.cdot.setAttribute('cx', 20+(el.trail.length-1)*2); el.cdot.setAttribute('cy', 70-v.y*55);
    el.bar.setAttribute('cx', 20+v.x*120);
  }
}

/* ======================================================== title preview */
function mountTitle(box, ti, texts, opt){
  box.innerHTML = '<div class="tistage"><div class="tiframe"></div></div>';
  var fr = box.querySelector('.tiframe'), parts = [];
  var mirror = ti.place==='lower' && opt.side==='l';
  ti.parts.forEach(function(p, i){
    var w = document.createElement('div'); w.className = 'tip';
    var inner = document.createElement('div'); inner.className = 'tii';
    w.appendChild(inner); fr.appendChild(w);
    parts.push({p:p, w:w, inner:inner});
  });
  return {fr:fr, box:box, parts:parts, ti:ti, texts:texts, mirror:mirror, side:opt.side, measured:false};
}
function titleText(el, p, t){
  var tx = el.texts;
  if(p.raw) return p.raw;
  if(p.key==='count'){ var a=parseFloat(tx[0])||0, b=parseFloat(tx[1])||0, u=clamp((t-0.25)/1.5); u = 1-Math.pow(1-u,3); return Math.round(a+(b-a)*u).toLocaleString('en-US') + (tx[2]||''); }
  if(p.key==='down'){ var N=parseFloat(tx[0])||10; return String(Math.max(0, Math.ceil(N - t*3))); }
  if(p.key==='pct'){ var P=parseFloat(tx[0])||0, u2=clamp((t-0.4)/1.2); u2 = bez(.25,0,.25,1)(u2); return Math.round(P*u2) + '%'; }
  return tx[p.key] || ' ';
}
function layoutTitle(el){
  var box = el.box, H = box.clientHeight || 80, Wd = box.clientWidth || 128;
  var sc = H/1080 * (el.ti.place==='lower' ? 1.55 : (el.ti.place==='top' ? 1.2 : 0.95));
  var ox, oy;
  if(el.ti.place==='lower'){ ox = el.side==='l' ? Wd*0.06 : (el.side==='c' ? Wd/2 : Wd*0.94); oy = H*0.76; }
  else if(el.ti.place==='top'){ ox = Wd/2; oy = H*0.28; }
  else { ox = Wd/2; oy = H/2; }
  el.sc = sc;
  var textEls = {};
  el.parts.forEach(function(o){
    var p = o.p, al = p.align || 'c', x = (p.x||0)*(el.mirror?-1:1);
    if(el.mirror && al==='r') al='l'; else if(el.mirror && al==='l') al='r';
    var w = o.w, inner = o.inner;
    w.style.left = (ox + x*sc) + 'px'; w.style.top = (oy + (p.y||0)*sc) + 'px';
    var tx = al==='r' ? '-100%' : (al==='l' ? '0' : '-50%');
    w.style.transform = 'translate(' + tx + ',-50%)';
    var col = p.c==='acc' ? 'var(--acc)' : (p.c || '#fff');
    if(p.t==='text'){
      inner.className = 'tii ttext'; inner.style.fontSize = ((p.size||80)*sc) + 'px'; inner.style.color = col;
      inner.style.fontWeight = p.bold ? 700 : 400; inner.style.letterSpacing = ((p.trk||0)/1000) + 'em';
      inner.textContent = titleText(el, p, 99);
      if(p.glow) inner.style.textShadow = '0 0 ' + (14*sc*6) + 'px ' + col + ', 0 0 ' + (4*sc*6) + 'px ' + col;
      if(p.key!==undefined) textEls[String(p.key)] = o;
    } else if(p.t==='rect' || p.t==='bar'){
      inner.style.width = (p.w*sc) + 'px'; inner.style.height = Math.max(1,p.h*sc) + 'px'; inner.style.background = col; inner.style.borderRadius = ((p.r||0)*sc) + 'px';
      if(p.t==='bar'){ inner.style.transformOrigin = el.mirror ? '100% 50%' : '0 50%'; }
    } else if(p.t==='circle'){
      inner.style.width = inner.style.height = (p.d*sc) + 'px'; inner.style.borderRadius = '50%';
      if(p.stroke){ inner.style.border = (p.stroke*sc) + 'px solid ' + col; inner.style.boxSizing = 'border-box'; } else inner.style.background = col;
    }
  });
  el.parts.forEach(function(o){
    var p = o.p;
    if(p.t!=='box') return;
    var tgt = textEls[String(p.fit)]; if(!tgt) return;
    var pad = p.pad || [30,14];
    o.inner.style.width = (tgt.inner.offsetWidth + pad[0]*2*sc) + 'px';
    o.inner.style.height = (tgt.inner.offsetHeight*0.78 + pad[1]*2*sc) + 'px';
    o.inner.style.background = p.c==='acc' ? 'var(--acc)' : (p.c || '#fff');
    o.inner.style.borderRadius = ((p.r||6)*sc) + 'px';
    o.w.style.left = tgt.w.style.left; o.w.style.top = tgt.w.style.top; o.w.style.transform = tgt.w.style.transform;
  });
  el.measured = true;
}
var MPBYID = {}; D.MOTION.forEach(function(m){ MPBYID[m.id] = m; });
function drawTitle(el, t){
  if(!el.measured){ layoutTitle(el); }
  var SECS = 3.4, cyc = SECS + 0.5, tt = t % cyc, sc = el.sc;
  el.parts.forEach(function(o){
    var p = o.p, st = null;
    if(p.t==='text' && p.key!==undefined && (p.key==='count'||p.key==='down'||p.key==='pct')) o.inner.textContent = titleText(el, p, tt);
    if(p.t==='bar'){
      var u = clamp((tt-0.4)/1.2), P = clamp((parseFloat(el.texts[0])||0)/100);
      o.inner.style.transform = 'scaleX(' + (P*bez(.25,0,.25,1)(u)).toFixed(4) + ')';
      o.w.style.opacity = tt > SECS-0.4 ? clamp((SECS-tt)/0.4) : 1;
      return;
    }
    var IN = p.in, OUT = p.out, sp, d, dl;
    if(tt > SECS){ o.w.style.opacity = 0; return; }
    if(OUT){
      sp = MPBYID[OUT[0]]; d = OUT[1]/30; dl = (OUT[2]||0)/30;
      var e1 = SECS - dl, s1 = e1 - d;
      if(tt >= s1){ st = mpState(sp, 'out', tt - s1, d); }
    }
    if(!st && IN){
      sp = MPBYID[IN[0]]; d = IN[1]/30; dl = (IN[2]||0)/30;
      st = mpState(sp, 'in', Math.max(0, tt - dl), d);
      if(tt < dl) st = mpState(sp, 'in', 0, d);
    }
    if(!st){ st = mpState({tr:{}}, 'in', 99, 1); }
    if(p.loop && MPBYID[p.loop]){ var ls = loopState(MPBYID[p.loop], tt); st.x += ls.x; st.y += ls.y; st.r += ls.r; st.s = st.s*ls.s/100; }
    if(p.ticker){ st.x += 600 - (tt*220) % 2400; }
    applyState(o.inner, st, sc, sp);
    o.w.style.opacity = 1;
  });
}

/* ======================================================= element preview */
function E(id, t, acc){
  var s = '<svg viewBox="0 0 160 100"><rect width="160" height="100" fill="#121216"/>';
  var c = t % 2.4, u, i, a;
  function draw(path, len, prog, w, extra){ return '<path d="' + path + '" fill="none" stroke="' + acc + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="' + (100 - prog*100).toFixed(2) + '"' + (extra||'') + '/>'; }
  switch(id){
    case 'burst':
      u = clamp(c/0.5);
      var e0 = clamp(c/0.3), s0 = clamp((c-0.15)/0.35);
      e0 = 1-Math.pow(1-e0,2); s0 = 1-Math.pow(1-s0,2);
      for(i=0;i<8;i++){ a = i*Math.PI/4; var r0 = 10 + 18*s0, r1 = 10 + 18*e0;
        if(r1>r0) s += '<line x1="' + (80+Math.sin(a)*r0) + '" y1="' + (50-Math.cos(a)*r0) + '" x2="' + (80+Math.sin(a)*r1) + '" y2="' + (50-Math.cos(a)*r1) + '" stroke="' + acc + '" stroke-width="3" stroke-linecap="round"/>'; }
      break;
    case 'ringPop':
      u = clamp(c/0.6); u = 1-Math.pow(1-u,3);
      if(c<0.6) s += '<circle cx="80" cy="50" r="' + (u*38) + '" fill="none" stroke="' + acc + '" stroke-width="' + (5*(1-u)+0.01) + '"/>';
      break;
    case 'underline':
      u = clamp(c/0.5); var st0 = clamp((c-1.6)/0.5);
      s += '<text x="80" y="48" text-anchor="middle" font-size="18" font-weight="700" fill="#fff" font-family="Plex,sans-serif">كلمة مهمة</text>';
      s += draw('M40 62 C70 60 100 63 120 58', 0, bez(.85,0,.2,1)(u), 3.5, st0>0 ? ' opacity="' + (1-st0) + '"' : '');
      break;
    case 'arrow':
      u = clamp(c/0.6);
      s += draw('M45 72 C60 40 100 30 112 36 M100 28 L112 36 L104 47', 0, bez(.85,0,.2,1)(u), 3);
      break;
    case 'scribble':
      u = clamp(c/0.8);
      var d0 = '', k;
      for(k=0;k<=70;k++){ a = -Math.PI/2 + k/70*Math.PI*2.15; var rr = 1 + 0.06*Math.sin(k*0.9) + k*0.0012; d0 += (k?'L':'M') + (80+Math.cos(a)*44*rr).toFixed(1) + ' ' + (50+Math.sin(a)*24*rr).toFixed(1); }
      s += '<text x="80" y="56" text-anchor="middle" font-size="16" font-weight="700" fill="#fff" font-family="Plex,sans-serif">مهم</text>';
      s += draw(d0, 0, bez(.85,0,.2,1)(u), 2.2);
      break;
    case 'check':
      u = clamp(c/0.45); s += draw('M58 50 L72 64 L102 34', 0, bez(.85,0,.2,1)(u), 6); break;
    case 'sparkle':
      u = chanIn(0, 100, 'back', c, 0.35); var rot = -90*(1 - bez(.1,0,.1,1)(clamp(c/0.8)));
      s += '<g transform="translate(80 50) rotate(' + rot + ') scale(' + Math.max(0,u/100) + ')"><path d="M0 -26 L5 -5 L26 0 L5 5 L0 26 L-5 5 L-26 0 L-5 -5Z" fill="' + acc + '"/></g>';
      break;
    case 'highlight':
      u = clamp(c/0.45); u = bez(.1,0,.15,1)(u);
      s += '<rect x="34" y="40" width="' + (92*u) + '" height="20" rx="2" fill="' + acc + '" opacity=".75"/><text x="80" y="56" text-anchor="middle" font-size="15" font-weight="700" fill="#fff" font-family="Plex,sans-serif">هايلايت</text>';
      break;
    case 'dots':
      for(i=0;i<3;i++){ var y = -Math.abs(Math.sin((t*1.6 - i*0.18)*Math.PI))*12; s += '<circle cx="' + (66+i*14) + '" cy="' + (56+y) + '" r="5" fill="' + acc + '"/>'; }
      break;
    case 'plus':
      u = chanIn(0, 100, 'back', c, 0.3); var rr2 = c*90;
      s += '<g transform="translate(80 50) rotate(' + rr2 + ') scale(' + Math.max(0,u/100) + ')"><rect x="-18" y="-4.5" width="36" height="9" rx="2" fill="' + acc + '"/><rect x="-4.5" y="-18" width="9" height="36" rx="2" fill="' + acc + '"/></g>';
      break;
    case 'gradientBg':
      var gx = 50+30*Math.sin(t*0.6), gy = 30+20*Math.cos(t*0.4), hx = 50+35*Math.sin(t*0.45), hy = 50+30*Math.cos(t*0.55);
      s = '<svg viewBox="0 0 160 100"><defs><linearGradient id="gb" x1="' + (gx-30) + '%" y1="' + (gy-30) + '%" x2="' + (gx+50) + '%" y2="' + (gy+60) + '%"><stop offset="0" stop-color="' + acc + '"/><stop offset="1" stop-color="#1f1040"/></linearGradient><radialGradient id="gr" cx="' + hx + '%" cy="' + hy + '%" r="55%"><stop offset="0" stop-color="#5a40e6" stop-opacity=".9"/><stop offset="1" stop-color="#5a40e6" stop-opacity="0"/></radialGradient></defs><rect width="160" height="100" fill="url(#gb)"/><rect width="160" height="100" fill="url(#gr)" style="mix-blend-mode:screen"/>';
      break;
    case 'gridBg':
      s = '<svg viewBox="0 0 160 100"><rect width="160" height="100" fill="#121214"/><g stroke="#fff" stroke-opacity=".14" stroke-width=".6">';
      for(i=0;i<=16;i++) s += '<line x1="' + (i*10) + '" y1="0" x2="' + (i*10) + '" y2="100"/>';
      for(i=0;i<=10;i++) s += '<line x1="0" y1="' + (i*10) + '" x2="160" y2="' + (i*10) + '"/>';
      s += '</g>'; break;
    case 'spotBg':
      var sx2 = 50 + 6*Math.sin(t*0.5), sy2 = 50 + 6*Math.cos(t*0.4);
      s = '<svg viewBox="0 0 160 100"><defs><radialGradient id="sp" cx="' + sx2 + '%" cy="' + sy2 + '%" r="65%"><stop offset="0" stop-color="#3d3d4c"/><stop offset="1" stop-color="#050507"/></radialGradient></defs><rect width="160" height="100" fill="url(#sp)"/>';
      break;
    case 'grain':
      s = '<svg viewBox="0 0 160 100"><defs><filter id="gn"><feTurbulence type="fractalNoise" baseFrequency=".95" seed="' + (Math.floor(t*12)%6) + '"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".35"/></feComponentTransfer></filter></defs><rect width="160" height="100" fill="#3a3550"/><circle cx="80" cy="50" r="26" fill="#6f5bd6"/><rect width="160" height="100" filter="url(#gn)"/>';
      break;
    case 'vignette':
      s = '<svg viewBox="0 0 160 100"><defs><radialGradient id="vg" cx="50%" cy="50%" r="70%"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></radialGradient></defs><rect width="160" height="100" fill="#d3936a"/><rect width="160" height="100" fill="url(#vg)"/>';
      break;
    case 'leakLoop':
      var l1 = 20 + 60*(0.5+0.5*Math.sin(t*0.5)), l2 = 75 - 50*(0.5+0.5*Math.sin(t*0.37+1));
      s = '<svg viewBox="0 0 160 100"><defs><radialGradient id="la" cx="' + l1 + '%" cy="40%" r="55%"><stop offset="0" stop-color="#ff8a26"/><stop offset="1" stop-color="#ff8a26" stop-opacity="0"/></radialGradient><radialGradient id="lb" cx="' + l2 + '%" cy="60%" r="50%"><stop offset="0" stop-color="#ff3d75" stop-opacity=".9"/><stop offset="1" stop-color="#ff3d75" stop-opacity="0"/></radialGradient></defs><rect width="160" height="100" fill="#141018"/><rect width="160" height="100" fill="url(#la)" opacity=".75"/><rect width="160" height="100" fill="url(#lb)" opacity=".75"/>';
      break;
    case 'scanlines':
      s = '<svg viewBox="0 0 160 100"><rect width="160" height="100" fill="#2a6a8a"/><circle cx="80" cy="50" r="24" fill="#8be0ff"/><g fill="#000" opacity=".35">';
      for(i=0;i<50;i++) s += '<rect x="0" y="' + (i*2) + '" width="160" height=".8"/>';
      s += '</g>'; break;
    case 'confetti':
      var cols3 = [acc,'#fff','#ffd633','#40ccff','#ff5a99'];
      for(i=0;i<28;i++){ var aa = rnd(i)*Math.PI*2, vv = 30+rnd(i+50)*45, tt2 = Math.min(c, 2.0);
        var px = 80 + Math.cos(aa)*vv*tt2*0.75, py = 50 + Math.sin(aa)*vv*tt2*0.75 - 45*tt2 + 0.5*90*tt2*tt2, ro = (rnd(i+9)-0.5)*tt2*1200;
        if(c<2.1) s += '<rect x="' + (px-2) + '" y="' + (py-1.2) + '" width="' + (i%3?4:2.6) + '" height="' + (i%3?2.4:5) + '" fill="' + cols3[i%5] + '" transform="rotate(' + ro + ' ' + px + ' ' + py + ')" opacity="' + clamp((2.1-c)/0.7) + '"/>'; }
      break;
    case 'heart':
      u = chanIn(0, 100, 'elastic', c, 0.3);
      s += '<g transform="translate(80 50) scale(' + Math.max(0,u/100*1.6) + ')"><path d="M0 8 C-14 -4 -14 -16 -6 -18 C-2 -19 0 -16 0 -13 C0 -16 2 -19 6 -18 C14 -16 14 -4 0 8Z" fill="' + acc + '"/></g>';
      break;
    case 'starBurst':
      var sb = c<0.35 ? bez(.4,0,.6,1)(c/0.35)*1.1 : (c<0.9 ? 1.1 - 1.1*bez(.4,0,.6,1)((c-0.35)/0.55) : 0), rot2 = c*60;
      for(i=0;i<8;i++){ var an2 = (i*45+rot2)*Math.PI/180, sx3 = 80+Math.sin(an2)*30, sy3 = 50-Math.cos(an2)*30;
        s += '<g transform="translate(' + sx3 + ' ' + sy3 + ') rotate(' + (i*45+rot2) + ') scale(' + Math.max(0,sb) + ')"><path d="M0 -6 L1.4 -1.4 L6 0 L1.4 1.4 L0 6 L-1.4 1.4 L-6 0 L-1.4 -1.4Z" fill="' + acc + '"/></g>'; }
      break;
    case 'spinner':
      s += '<circle cx="80" cy="50" r="18" fill="none" stroke="#2a2a31" stroke-width="4"/><circle cx="80" cy="50" r="18" fill="none" stroke="' + acc + '" stroke-width="4" stroke-linecap="round" pathLength="100" stroke-dasharray="70 100" transform="rotate(' + (t*360%360 - 90) + ' 80 50)"/>';
      break;
    case 'waveDots':
      for(i=0;i<9;i++){ s += '<circle cx="' + (40+i*10) + '" cy="' + (50 + Math.sin((t*2.2 - i*0.11)*Math.PI*2)*8) + '" r="3" fill="' + acc + '"/>'; }
      break;
    case 'corners':
      u = bez(.85,0,.2,1)(clamp(c/0.45));
      ['M38 32 L38 22 L50 22','M110 22 L122 22 L122 32','M122 68 L122 78 L110 78','M50 78 L38 78 L38 68'].forEach(function(d1){ s += draw(d1, 0, u, 2.5); });
      break;
    case 'zigzag':
      var zz = 'M32 55'; for(i=1;i<=12;i++) zz += ' L' + (32+i*8) + ' ' + (i%2 ? 47 : 55);
      s += '<text x="80" y="40" text-anchor="middle" font-size="15" font-weight="700" fill="#fff" font-family="Plex,sans-serif">مهم جداً</text>';
      s += draw(zz, 0, bez(.85,0,.2,1)(clamp(c/0.5)), 2.5);
      break;
    case 'cursor':
      var mv = bez(.2,0,.15,1)(clamp(c/0.5)), cxp = 80 + 40*(1-mv), cyp = 50 + 28*(1-mv), ck = c>0.5 && c<0.72 ? 0.82 : 1;
      var rpl = clamp((c-0.55)/0.45);
      if(c>0.55 && c<1.0) s += '<circle cx="80" cy="50" r="' + (rpl*16) + '" fill="none" stroke="' + acc + '" stroke-width="2" opacity="' + (1-rpl) + '"/>';
      s += '<g transform="translate(' + cxp + ' ' + cyp + ') scale(' + (0.32*ck) + ')"><path d="M0 0 L0 60 L15 46 L26 70 L36 65 L25 42 L44 42Z" fill="#fff" stroke="#000" stroke-width="3"/></g>';
      break;
    case 'bubble':
      u = chanIn(0, 100, 'back', c, 0.3);
      s += '<g transform="translate(50 72) scale(' + Math.max(0,u/100) + ') translate(-50 -72)"><rect x="40" y="22" width="82" height="42" rx="12" fill="#fff"/><path d="M58 60 L50 74 L72 62Z" fill="#fff"/><g fill="#121216"><circle cx="68" cy="43" r="3"/><circle cx="81" cy="43" r="3"/><circle cx="94" cy="43" r="3"/></g></g>';
      break;
    case 'rays':
      s = '<svg viewBox="0 0 160 100"><rect width="160" height="100" fill="#121216"/><g transform="rotate(' + (t*8) + ' 80 50)" fill="' + acc + '" opacity=".22">';
      for(i=0;i<16;i++) s += '<path d="M80 50 L74 -60 L86 -60Z" transform="rotate(' + (i*22.5) + ' 80 50)"/>';
      s += '</g>'; break;
    case 'bokeh':
      s = '<svg viewBox="0 0 160 100"><defs><filter id="bk"><feGaussianBlur stdDeviation="2.2"/></filter></defs><rect width="160" height="100" fill="#15121c"/><g filter="url(#bk)" style="mix-blend-mode:screen">';
      for(i=0;i<16;i++){ var bx2 = rnd(i+11)*160 + D.noise(t*0.2, i)*12, by2 = rnd(i+31)*100 + D.noise(t*0.2, i+5)*10; s += '<circle cx="' + bx2 + '" cy="' + by2 + '" r="' + (4+ (i*37)%12) + '" fill="' + (i%3 ? acc : '#fff3d9') + '" opacity=".3"/>'; }
      s += '</g>'; break;
    case 'glitchBars':
      s = '<svg viewBox="0 0 160 100"><rect width="160" height="100" fill="#3a3550"/><circle cx="80" cy="50" r="26" fill="#6f5bd6"/><g style="mix-blend-mode:difference">';
      for(i=0;i<10;i++){ var fr2 = Math.floor(t*10); if(rnd(fr2*7+i) > 0.6) s += '<rect x="' + ((rnd(fr2*13+i)-0.5)*8) + '" y="' + (rnd(fr2*13+i+3)*100) + '" width="160" height="' + (1+(i*13)%8) + '" fill="' + (i%2 ? acc : '#fff') + '"/>'; }
      s += '</g>'; break;
    case 'burnLoop':
      var bo = 0.6 + 0.25*Math.sin(t*3) + (rnd(Math.floor(t*12))-0.5)*0.3;
      s = '<svg viewBox="0 0 160 100"><defs><radialGradient id="bl" cx="' + (85+Math.sin(t*0.7)*8) + '%" cy="' + (20+Math.cos(t*0.5)*6) + '%" r="80%"><stop offset="0" stop-color="#ff6b14"/><stop offset="1" stop-color="#ff6b14" stop-opacity="0"/></radialGradient></defs><rect width="160" height="100" fill="#2b2f3d"/><rect width="160" height="100" fill="url(#bl)" opacity="' + clamp(bo) + '" style="mix-blend-mode:screen"/>';
      break;
    case 'letterbox':
      u = clamp(c/0.6); u = bez(.1,0,.15,1)(u); var bh = 16;
      s = '<svg viewBox="0 0 160 100"><rect width="160" height="100" fill="#4a7f9c"/><path d="M0 80 L50 52 L90 72 L160 45 V100 H0Z" fill="#1d3a4a"/><rect x="0" y="' + (-bh + bh*u) + '" width="160" height="' + bh + '" fill="#000"/><rect x="0" y="' + (100 - bh*u) + '" width="160" height="' + bh + '" fill="#000"/>';
      break;
  }
  return s + '</svg>';
}

/* ======================================================= caption preview */
var CAP_SAMPLE_AR = 'ده مثال للكابشن المتحرك';
var CAP_SAMPLE_EN = 'THIS IS HOW YOUR CAPTIONS MOVE';
function mountCap(box, style, opt){
  box.innerHTML = '<div class="capstage"><div class="capbox"><div class="captxt" dir="auto"></div></div></div>';
  var tx = box.querySelector('.captxt'), bx = box.querySelector('.capbox');
  var words = (opt.text || (window.HMK_LANG === 'en' ? CAP_SAMPLE_EN : CAP_SAMPLE_AR)).split(/\s+/).filter(Boolean);
  var per = style.maxWords || opt.maxWords || 3, chunks = [];
  for(var i=0;i<words.length;i+=per) chunks.push(words.slice(i, i+per));
  return {box:box, tx:tx, bx:bx, chunks:chunks, style:style, opt:opt, cur:-1, spans:[]};
}
function drawCap(el, t){
  var st = el.style, wdur = 0.32, per = el.chunks.map(function(c){ return c.length*wdur + 0.25; });
  var total = per.reduce(function(a,b){ return a+b; }, 0) + 0.3, tt = t % total, ci = 0, acc0 = 0;
  while(ci < el.chunks.length-1 && tt >= acc0 + per[ci]){ acc0 += per[ci]; ci++; }
  var lt = tt - acc0;
  if(ci !== el.cur){
    el.cur = ci; el.tx.innerHTML = ''; el.spans = [];
    el.chunks[ci].forEach(function(w, k){ if(k) el.tx.appendChild(document.createTextNode(' ')); var sp = document.createElement('span'); sp.className='cw'; sp.textContent = el.opt.upper ? w.toUpperCase() : w; el.tx.appendChild(sp); el.spans.push(sp); });
    var H = el.box.clientHeight || 80;
    el.tx.style.fontSize = Math.max(13, (el.opt.size||70)/1080*H*1.6) + 'px';
    el.tx.style.webkitTextStroke = (st.stroke || el.opt.stroke) ? Math.max(1, H*0.012) + 'px #000' : '';
    el.tx.style.textShadow = el.opt.shadow ? '0 2px 6px rgba(0,0,0,.7)' : '';
    el.bx.style.background = (st.box || el.opt.box) ? 'rgba(0,0,0,' + ((el.opt.boxOp===undefined?75:el.opt.boxOp)/100) + ')' : 'transparent';
    el.box.querySelector('.capstage').style.alignItems = 'center';
    el.bx.style.top = (el.opt.y || 72) + '%';
  }
  var acc = el.opt.acc || '#ff6b3d', n = el.spans.length;
  el.spans.forEach(function(sp, k){
    var s = k*wdur, e = (k+1)*wdur, o = 1, tf = '', f = '', col = '';
    switch(st.word){
      case 'pop': var kk = clamp((lt - s)/0.12); var v = Math.pow(1-kk,3); o = 1-v; tf = 'scale(' + (1-v) + ')'; break;
      case 'reveal': o = lt < s ? 0 : 1; break;
      case 'blur': var kb = clamp((lt - s)/0.18), vb = Math.pow(1-kb,2); o = 1-vb; f = 'blur(' + (vb*4).toFixed(1) + 'px)'; break;
      case 'karaoke': col = (lt >= s && lt < e) ? acc : ''; break;
      case 'fill': col = lt >= s ? acc : ''; break;
      case 'bounce': var on = lt >= s && lt < e; var kq = on ? clamp((lt - s)/0.08) : 0; col = on ? acc : ''; tf = 'scale(' + (1+0.18*kq) + ')'; break;
    }
    sp.style.opacity = o; sp.style.transform = tf; sp.style.filter = f; sp.style.color = col;
  });
  var whole = 1, wtf = '';
  if(!st.word){
    if(st.anim === 'slideUp'){ var ku = clamp(lt/0.25); var eu = 1 - Math.pow(1-ku,4); whole = eu; wtf = 'translateY(' + ((1-eu)*12) + 'px)'; }
    else if(st.anim === 'pop'){ var sv2 = chanIn(0,100,'back',lt,0.18)/100; wtf = 'scale(' + Math.max(0,sv2) + ')'; }
    else { whole = clamp(lt/0.1); }
  } else if(st.word==='karaoke' || st.word==='fill' || st.word==='bounce'){ whole = clamp(lt/0.07); }
  el.bx.style.opacity = whole; el.bx.style.transform = 'translate(-50%,-50%) ' + wtf;
}

/* ========================================================== look preview */
var PHOTO = svgURL('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5aa9e6"/><stop offset=".55" stop-color="#ffd08a"/><stop offset="1" stop-color="#ff8c5a"/></linearGradient><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d7fb8"/><stop offset="1" stop-color="#174a73"/></linearGradient></defs><rect width="160" height="100" fill="url(#s)"/><circle cx="118" cy="44" r="11" fill="#fff4c9"/><path d="M0 62 L30 46 L52 58 L80 40 L112 60 L160 50 V70 H0Z" fill="#3e6b4a"/><rect y="66" width="160" height="34" fill="url(#w)"/><path d="M0 80 Q40 74 80 80 T160 80 V100 H0Z" fill="#e9c58f"/><circle cx="26" cy="58" r="8" fill="#2f8f3a"/><rect x="25" y="58" width="2" height="12" fill="#5b3a1e"/><path d="M118 76 l8 -16 l8 16z" fill="#e2393f"/><rect x="125.5" y="76" width="1.2" height="12" fill="#333"/><circle cx="56" cy="64" r="4" fill="#e9b48f"/><rect x="52" y="68" width="8" height="12" rx="2" fill="#f4f1ea"/><rect x="52" y="80" width="3" height="8" fill="#2c3e66"/><rect x="57" y="80" width="3" height="8" fill="#2c3e66"/></svg>');
function mountLook(box, it, big){
  var isA = it.kind==='afx';
  if(isA){ box.innerHTML = '<div class="lkstage afx"></div>'; return {box:box, it:it, afx:true, el:box.firstChild}; }
  box.innerHTML = '<div class="lkstage"><div class="lkimg base"></div><div class="lkfx"><div class="lkimg"></div><div class="lkov"></div><div class="lkvig"></div><div class="lkgrain"></div><div class="lkscan"></div><svg class="lkpart" viewBox="0 0 160 100" preserveAspectRatio="none"></svg><div class="lkball"></div></div>' + (big ? '<div class="lkdiv"></div><span class="lkl">قبل</span><span class="lkr">بعد</span>' : '') + '</div>';
  var st = box.firstChild, fx = st.querySelector('.lkfx'), img = fx.querySelector('.lkimg'), pv = it.pv || {};
  [st.querySelector('.base'), img].forEach(function(x){ x.style.backgroundImage = PHOTO; });
  img.style.filter = pv.f || '';
  var ov = fx.querySelector('.lkov'); if(pv.ov){ ov.style.background = pv.ov; ov.style.mixBlendMode = pv.b || 'normal'; } else ov.style.display = 'none';
  var vg = fx.querySelector('.lkvig'); if(pv.vig){ vg.style.background = 'radial-gradient(circle at 50% 50%, transparent ' + (70 - pv.vig*40) + '%, rgba(0,0,0,' + (0.35 + pv.vig*0.6) + ') 100%)'; } else vg.style.display = 'none';
  if(!pv.grain) fx.querySelector('.lkgrain').style.display = 'none';
  if(!pv.scan) fx.querySelector('.lkscan').style.display = 'none';
  var ball = fx.querySelector('.lkball');
  if(!(pv.trail || pv.step || pv.strobe)) ball.style.display = 'none';
  return {box:box, it:it, st:st, fx:fx, img:img, part:fx.querySelector('.lkpart'), ball:ball, grain:fx.querySelector('.lkgrain'), big:big, div:st.querySelector('.lkdiv')};
}
function drawLook(el, t){
  if(el.afx){ el.el.innerHTML = afxSVG(el.it.id, t); return; }
  var pv = el.it.pv || {};
  if(el.big){ var sx = 50 + 38*Math.sin(t*0.9); el.fx.style.clipPath = 'inset(0 0 0 ' + sx + '%)'; el.div.style.left = sx + '%'; }
  if(pv.grain) el.grain.style.backgroundPosition = Math.floor(rnd(Math.floor(t*12))*100) + 'px ' + Math.floor(rnd(Math.floor(t*12)+3)*100) + 'px';
  var s = '', i;
  if(pv.rain){ for(i=0;i<40;i++){ var x = (rnd(i)*180 - 10 + t*30) % 170, y = (rnd(i+40)*100 + t*160 + i*13) % 110 - 5; s += '<line x1="' + x + '" y1="' + y + '" x2="' + (x-1.5) + '" y2="' + (y+7) + '" stroke="rgba(220,235,255,.7)" stroke-width=".5"/>'; } }
  if(pv.snow){ for(i=0;i<36;i++){ var sx2 = (rnd(i)*160 + Math.sin(t+i)*4) % 160, sy = (rnd(i+9)*100 + t*14 + i*7) % 104 - 2; s += '<circle cx="' + sx2 + '" cy="' + sy + '" r="' + (0.6+rnd(i+3)*1.1) + '" fill="#fff" opacity=".9"/>'; } }
  if(pv.dust){ for(i=0;i<30;i++){ var a2 = rnd(i)*6.28, sp2 = (t*0.4 + rnd(i+5)) % 1, rr = sp2*90; s += '<circle cx="' + (80+Math.cos(a2)*rr) + '" cy="' + (50+Math.sin(a2)*rr*0.6) + '" r="' + (0.3+sp2*1.4) + '" fill="#fff" opacity="' + (sp2*0.9) + '"/>'; } }
  el.part.innerHTML = s;
  var tfm = '';
  if(pv.shake){ tfm = 'translate(' + (D.noise(t*6,1)*2.5) + 'px,' + (D.noise(t*6,4)*2.5) + 'px) rotate(' + (D.noise(t*3,7)*0.8) + 'deg) scale(1.08)'; }
  if(pv.pulse){ tfm = 'scale(' + (1 + Math.abs(Math.sin(t*Math.PI*2))*0.04) + ')'; }
  el.img.style.transform = tfm;
  if(pv.trail || pv.step || pv.strobe){
    var tt = pv.step ? Math.floor(t*pv.step)/pv.step : t, bx = 10 + ((tt*0.5)%1)*80;
    var sh = '';
    if(pv.trail){ for(i=1;i<=6;i++){ var bt = t - i*0.033, bxx = 10 + ((bt*0.5)%1)*80; sh += ', ' + ((bxx-bx)*1.6).toFixed(1) + 'px 0 0 rgba(255,107,61,' + (0.6*Math.pow(0.6,i)).toFixed(2) + ')'; } }
    el.ball.style.left = bx + '%'; el.ball.style.boxShadow = '0 0 0 transparent' + sh;
    if(pv.strobe) el.fx.style.filter = (Math.floor(t*6)%5===0) ? 'brightness(2.4)' : '';
  }
}
function afxSVG(id, t){
  var s = '<svg viewBox="0 0 160 100"><rect width="160" height="100" fill="#121216"/>', i, n = 40;
  var shapeF = {telephone:function(x){ return Math.exp(-Math.pow((x-0.5)/0.18,2)); }, radio:function(x){ return Math.exp(-Math.pow((x-0.52)/0.25,2)); }, underwater:function(x){ return Math.exp(-x*5); }, muffled:function(x){ return Math.exp(-x*3); },
                bassBoost:function(x){ return 0.4 + 0.6*Math.exp(-x*4); }, treble:function(x){ return 0.35 + 0.65*x; }}[id];
  for(i=0;i<n;i++){
    var x = i/(n-1), base = 0.25 + 0.75*Math.abs(Math.sin(i*0.9 + t*6))*rnd(i+Math.floor(t*8)), g = shapeF ? shapeF(x) : 1;
    if(id==='echoA' || id==='hall') base *= (0.6 + 0.4*Math.sin(i*0.5 - t*4));
    if(id==='robot') base = (Math.floor(t*12+i)%3) ? 0.7 : 0.25;
    if(id==='backwards') base = 0.25 + 0.75*Math.abs(Math.sin((n-i)*0.9 - t*6))*rnd(n-i+Math.floor(t*8));
    var h = Math.max(2, base*g*64);
    s += '<rect x="' + (8 + i*3.6) + '" y="' + (50-h/2) + '" width="2.4" height="' + h + '" rx="1" fill="var(--acc)" opacity="' + (0.5+0.5*g) + '"/>';
  }
  return s + '</svg>';
}

/* ======================================================== text style css */
function hexA(h, a){ h = String(h).replace('#',''); var r=parseInt(h.substr(0,2),16), g=parseInt(h.substr(2,2),16), b=parseInt(h.substr(4,2),16); return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; }
function styleCSS(st, fs, acc){
  var k = fs/110, c = function(v){ return v==='acc' ? acc : v; }, css = {color:'#fff', shadows:[]};
  if(st.fill) css.color = c(st.fill); else if(!st.grad) css.color = 'transparent';
  if(st.grad){ css.bg = 'linear-gradient(180deg,' + st.grad[0] + ',' + st.grad[1] + ')'; css.clip = true; css.color = 'transparent'; }
  if(st.sweep){ var base = st.grad ? st.grad[1] : c(st.fill||'#ddd'); css.bg = 'linear-gradient(110deg,' + (st.grad ? st.grad[0] : base) + ' 35%, #ffffff 50%, ' + base + ' 65%)'; css.clip = true; css.color = 'transparent'; css.sweep = true; }
  if(st.stroke) css.stroke = Math.max(1, (st.sw||6)*k*0.9) + 'px ' + c(st.stroke);
  [st.shadow2, st.shadow].forEach(function(sh){
    if(!sh) return; var ang = (sh.a===undefined ? 135 : sh.a)*Math.PI/180, d = (sh.d||0)*k;
    css.shadows.push((Math.sin(ang)*d).toFixed(1) + 'px ' + (-Math.cos(ang)*d).toFixed(1) + 'px ' + ((sh.s||0)*k).toFixed(1) + 'px ' + hexA(sh.c, (sh.op===undefined?60:sh.op)/100));
  });
  var hard = [];
  if(st.extrude){
    var ex = st.extrude, en = ex.n || 10;
    for(var q=1;q<=en;q++){ hard.push(((ex.dx||0)*q*k).toFixed(1) + 'px ' + ((ex.dy===undefined?1.5:ex.dy)*q*k).toFixed(1) + 'px 0 ' + mixHex(c(ex.c), c(ex.c2||ex.c), en>1 ? (q-1)/(en-1) : 0)); }
  }
  if(st.layers){
    var px = 0, py = 0;
    st.layers.forEach(function(ly){
      if(ly.stroke || (!ly.dx && !ly.dy)) return;
      var tx2 = (ly.dx||0)*k, ty2 = (ly.dy||0)*k, steps = Math.max(1, Math.ceil(Math.max(Math.abs(tx2-px), Math.abs(ty2-py))));
      for(var z=1; z<=steps; z++){ hard.push((px + (tx2-px)*z/steps).toFixed(1) + 'px ' + (py + (ty2-py)*z/steps).toFixed(1) + 'px 0 ' + c(ly.fill)); }
      px = tx2; py = ty2;
    });
  }
  css.shadows = hard.concat(css.shadows);
  css.copies = (st.layers||[]).filter(function(ly){ return ly.stroke || (!ly.dx && !ly.dy); }).map(function(ly){
    return {color: ly.fill ? c(ly.fill) : 'transparent', stroke: ly.stroke ? Math.max(1, (ly.sw||6)*k*0.9) + 'px ' + c(ly.stroke) : '', dx:(ly.dx||0)*k, dy:(ly.dy||0)*k};
  });
  if(st.glow){ var gc = st.fill ? c(st.fill) : (st.stroke ? c(st.stroke) : (st.grad ? st.grad[1] : '#fff')); css.shadows.unshift('0 0 ' + ((st.glow.r||30)*k*0.5).toFixed(1) + 'px ' + gc, '0 0 ' + ((st.glow.r||30)*k).toFixed(1) + 'px ' + gc); }
  if(st.bevel){ css.shadows.unshift('0 ' + (-1*k).toFixed(1) + 'px 0 rgba(255,255,255,.55)', '0 ' + (1.5*k).toFixed(1) + 'px 0 rgba(0,0,0,.35)'); }
  if(st.box){ css.box = {bg: c(st.box.c)==='transparent' ? 'transparent' : (st.box.c==='acc' ? acc : hexA(st.box.c, (st.box.op===undefined?100:st.box.op)/100)), pad: (st.box.pad[1]*k) + 'px ' + (st.box.pad[0]*k) + 'px', r: (st.box.r*k) + 'px'}; }
  return css;
}
function mixHex(a, b, t){
  var A = hx(a), B = hx(b);
  return 'rgb(' + Math.round(A[0]+(B[0]-A[0])*t) + ',' + Math.round(A[1]+(B[1]-A[1])*t) + ',' + Math.round(A[2]+(B[2]-A[2])*t) + ')';
}
function hx(h){ h = String(h).replace('#',''); return [parseInt(h.substr(0,2),16)||0, parseInt(h.substr(2,2),16)||0, parseInt(h.substr(4,2),16)||0]; }
function mountStyle(box, st, text, acc){
  box.innerHTML = '<div class="tsstage"><span class="tsbox"><span class="tswrap"><span class="tstext" dir="auto"></span></span></span></div>';
  var H = box.clientHeight || 80, fs = Math.max(16, Math.min(64, H*0.32)), b = box.querySelector('.tsbox'), tx = box.querySelector('.tstext');
  tx.textContent = st.caps ? String(text).toUpperCase() : text;
  var css = styleCSS(st, fs, acc);
  tx.style.fontSize = fs + 'px'; tx.style.color = css.color; tx.style.letterSpacing = st.trk ? (st.trk/1000) + 'em' : '';
  if(css.bg){ tx.style.backgroundImage = css.bg; tx.style.webkitBackgroundClip = 'text'; tx.style.backgroundClip = 'text'; if(css.sweep){ tx.style.backgroundSize = '250% 100%'; tx.classList.add('sweep'); } }
  if(css.stroke){ tx.style.webkitTextStroke = css.stroke; tx.style.paintOrder = 'stroke fill'; }
  tx.style.textShadow = css.shadows.join(', ');
  if(css.shadows.length && css.clip){
    var back = document.createElement('span'); back.className = 'tscopy'; back.setAttribute('dir','auto'); back.textContent = tx.textContent;
    back.style.fontSize = tx.style.fontSize; back.style.letterSpacing = tx.style.letterSpacing; back.style.color = 'transparent'; back.style.textShadow = css.shadows.join(', ');
    if(css.stroke){ back.style.webkitTextStroke = css.stroke; }
    box.querySelector('.tswrap').insertBefore(back, tx); tx.style.textShadow = '';
  }
  if(css.box){ b.style.background = css.box.bg; b.style.padding = css.box.pad; b.style.borderRadius = css.box.r; }
  if(css.copies && css.copies.length){
    var wrap = box.querySelector('.tswrap');
    css.copies.slice().reverse().forEach(function(cp){
      var e = document.createElement('span'); e.className = 'tscopy'; e.setAttribute('dir','auto'); e.textContent = tx.textContent;
      e.style.fontSize = tx.style.fontSize; e.style.letterSpacing = tx.style.letterSpacing; e.style.color = cp.color;
      if(cp.stroke){ e.style.webkitTextStroke = cp.stroke; e.style.paintOrder = 'stroke fill'; }
      e.style.transform = 'translate(' + cp.dx + 'px,' + cp.dy + 'px)';
      wrap.insertBefore(e, tx);
    });
  }
  return {box:box};
}

/* ================================================================ lines */
function lnD(p){
  var v = p.v, n = v.length, d = 'M' + v[0][0].toFixed(2) + ' ' + v[0][1].toFixed(2), i, a, b;
  var segs = p.cl ? n : n - 1;
  for(i=0;i<segs;i++){
    a = i; b = (i+1)%n;
    d += 'C' + (v[a][0]+p.ot[a][0]).toFixed(2) + ' ' + (v[a][1]+p.ot[a][1]).toFixed(2) + ' ' + (v[b][0]+p.it[b][0]).toFixed(2) + ' ' + (v[b][1]+p.it[b][1]).toFixed(2) + ' ' + v[b][0].toFixed(2) + ' ' + v[b][1].toFixed(2);
  }
  return d + (p.cl ? 'Z' : '');
}
var LN_TEXT = 'حمدي';
function mountLine(box, it, o){
  var W = 160, H = 90, G = NABD_LINES, h = '<svg class="lnsvg" viewBox="-80 -45 160 90" preserveAspectRatio="xMidYMid slice">';
  h += '<defs><linearGradient id="lnA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a5a"/><stop offset="1" stop-color="#7a2a5a"/></linearGradient><linearGradient id="lnB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d2b55"/><stop offset="1" stop-color="#3f86b8"/></linearGradient></defs>';
  var el = {mode:it.mode, it:it, paths:[], o:o, uid:Math.random().toString(36).slice(2,8)};
  if(it.mode==='cover') h += '<rect class="lnbg" x="-80" y="-45" width="160" height="90" fill="url(#lnA)"/>';
  else h += '<rect x="-80" y="-45" width="160" height="90" fill="#141418"/>';
  var paths = [];
  if(it.mode==='attach'){
    h += '<text x="0" y="9" text-anchor="middle" font-size="30" font-weight="700" fill="#fff" direction="rtl">' + LN_TEXT + '</text>';
    paths = attachPaths(it.id);
  } else if(it.mode==='path'){
    paths = G.geo(it.id, W, H);
  } else paths = G.geo(it.id, W, H);
  var S = Math.min(W,H)*0.3, base = it.mode==='cover' ? 1 : (it.mode==='attach' ? 2.4 : S*0.075), wk = (o.width||100)/100;
  paths.forEach(function(p, i){
    var col = p.c ? o.c2 : o.c1, w = Math.max(0.6, base*p.w*wk);
    if(it.mode==='path'){ col = o.c1; w = 1; }
    var dash = p.dash ? ' stroke-dasharray="' + (w*2.2).toFixed(1) + ' ' + (w*1.6).toFixed(1) + '"' : '';
    h += '<path id="lnp' + i + el.uid + '" d="' + lnD(p) + '" fill="none" stroke="' + col + '" stroke-width="' + w.toFixed(2) + '" stroke-linecap="round" stroke-linejoin="round"' + (p.dash ? '' : ' pathLength="100"') + dash + (p.op ? ' opacity="' + (p.op/100) + '"' : '') + (it.mode==='path' ? ' opacity=".55"' : '') + '/>';
  });
  if(it.mode==='path'){
    h += '<text font-size="11" font-weight="700" fill="#fff" direction="ltr"><textPath href="#lnp0' + el.uid + '" startOffset="0">' + escX(o.text || 'نص ماشي على خط') + '</textPath></text>';
  }
  h += '</svg>';
  box.innerHTML = h;
  el.svg = box.querySelector('svg'); el.bg = box.querySelector('.lnbg');
  el.els = Array.prototype.slice.call(box.querySelectorAll('path'));
  el.data = paths; el.tp = box.querySelector('textPath'); el.txt = box.querySelector('text');
  return el;
}
function escX(t){ return String(t).replace(/[&<>]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; }); }
function attachPaths(kind){
  var l = -30, t = -16, R = 30, b = 16, p = 4, cx = 0, cy = -1, a = Math.min(R-l, b-t)*0.28, S = NABD_LINES.smooth;
  l -= p; t -= p; R += p; b += p;
  function st(pts, cl){ return {v:pts, it:pts.map(function(){ return [0,0]; }), ot:pts.map(function(){ return [0,0]; }), cl:!!cl, w:1, c:0, d:0}; }
  switch(kind){
    case 'atUnder': return [st([[R,b],[l,b]])];
    case 'atDouble': var q = st([[R-p*2,b+p*0.9],[l+p*2,b+p*0.9]]); q.w = 0.6; q.c = 1; return [st([[R,b],[l,b]]), q];
    case 'atStrike': return [st([[R,cy],[l,cy]])];
    case 'atBox': return [st([[R,t],[l,t],[l,b],[R,b]], true)];
    case 'atCorners': return [st([[l,t+a],[l,t],[l+a,t]]), st([[R-a,t],[R,t],[R,t+a]]), st([[R,b-a],[R,b],[R-a,b]]), st([[l+a,b],[l,b],[l,b-a]])].map(function(x,i){ x.d = i*0.15; return x; });
    case 'atCircle': var e = NABD_LINES.ellipse(cx, cy, (R-l)/2*1.15, (b-t)/2*1.3, 0); e.w = 1; e.c = 0; e.d = 0; return [e];
    case 'atBrackets': var q2 = a*0.6; return [st([[l+q2,t],[l,t],[l,b],[l+q2,b]]), st([[R-q2,t],[R,t],[R,b],[R-q2,b]])];
    case 'atSide': return [st([[R+p*0.4,b],[R+p*0.4,t]])];
  }
  return [];
}
function lnTrim(p, d, spread){
  var u1 = clamp(p/50*(1+spread) - spread*d), u0 = clamp((p-50)/50*(1+spread) - spread*d);
  return [u0*100, u1*100];
}
function drawLine(el, t){
  var mode = el.mode, P, spread = 0;
  el.data.forEach(function(p){ if(p.d > 0) spread = 0.6; });
  if(mode==='travel'){
    var spd = (el.o.speed||100)/100;
    el.data.forEach(function(p, i){
      var e = el.els[i];
      if(p.full || p.dash){ if(p.dash) e.style.strokeDashoffset = (-(t*spd*8)*(p.rev?-1:1)).toFixed(2); return; }
      var L = p.seg || 30, off = ((t*spd*50*(p.rev?-1:1) + p.d*100) % 100 + 100) % 100;
      e.setAttribute('stroke-dasharray', L + ' ' + (100-L)); e.style.strokeDashoffset = (-off).toFixed(2);
    });
    return;
  }
  if(mode==='path'){
    var path = el.els[0], len = path.getTotalLength(), off2;
    if(!el._fit){ el._fit = true; var fs = 11; for(var g=0; g<6 && el.txt.getComputedTextLength && el.txt.getComputedTextLength() > len*0.6; g++){ fs *= 0.8; el.txt.setAttribute('font-size', fs.toFixed(1)); } }
    var tl = el.txt.getComputedTextLength ? el.txt.getComputedTextLength() : 60;
    if(el.o.flow==='loop'){ off2 = (t*40) % len; }
    else if(el.o.flow==='static'){ off2 = Math.max(0, len - tl)/2; }
    else { var c = t % 3.2, u = clamp(c/2.6); u = u<.5 ? 2*u*u : 1-Math.pow(-2*u+2,2)/2; off2 = u*Math.max(0, len - tl); }
    el.tp.setAttribute('startOffset', off2.toFixed(1));
    if(el.o.guide===false) path.style.opacity = 0; else path.style.opacity = '';
    return;
  }
  if(mode==='cover'){
    var cyc = 2.4, tt = t % cyc, u2 = clamp((tt-0.3)/1.3); u2 = u2<.5 ? 4*u2*u2*u2 : 1-Math.pow(-2*u2+2,3)/2; P = u2*100;
    el.bg.setAttribute('fill', P < 50 ? 'url(#lnA)' : 'url(#lnB)');
  } else {
    var cy2 = 3.0, t2 = t % cy2;
    if(t2 < 0.9) P = outCubic(t2/0.9)*50; else if(t2 < 1.9 || el.o.erase===false) P = 50; else if(t2 < 2.6) P = 50 + inCubic((t2-1.9)/0.7)*50; else P = 100;
    if(el.o.erase===false && t2 > 2.6) P = 0;
  }
  el.data.forEach(function(p, i){
    var tr = lnTrim(P, p.d, spread), e = el.els[i], a = tr[0], b = tr[1];
    if(b - a < 0.05){ e.style.visibility = 'hidden'; return; }
    e.style.visibility = '';
    e.setAttribute('stroke-dasharray', (b-a).toFixed(2) + ' 1000'); e.style.strokeDashoffset = (-a).toFixed(2);
  });
}

/* ============================================================ carousel 3D */
function mountCar(box, it, o){
  var W = box.clientWidth || 160, H = box.clientHeight || 90, m = Math.min(W, H*1.6);
  var N = Math.max(2, Math.min(40, o.count||8)), cw = m*0.17*(o.size||100)/100, asp = o.aspect||1, ch = cw/asp;
  var h = '<div class="car3d" style="perspective:' + (m*2.4).toFixed(0) + 'px"><svg class="carln" viewBox="0 0 ' + W + ' ' + H + '"></svg><div class="carw">';
  for(var i=0;i<N;i++){
    var img = o.images && o.images.length ? (o.images[i] || (o.content==='images' ? o.images[i % o.images.length] : null)) : null;
    if(o.content==='colors') img = null;
    var bg = img ? 'background-image:url(' + img + ');background-size:cover;background-position:center' : 'background:' + carCol(o, i, N);
    h += '<div class="carc" style="width:' + cw.toFixed(1) + 'px;height:' + ch.toFixed(1) + 'px;margin:' + (-ch/2).toFixed(1) + 'px 0 0 ' + (-cw/2).toFixed(1) + 'px;border-radius:' + (Math.min(cw,ch)/2*(o.round||0)/100).toFixed(1) + 'px;' + bg + (o.border ? ';box-shadow:0 0 0 ' + Math.max(1, o.border*cw/160).toFixed(1) + 'px ' + o.borderColor : '') + '"></div>';
  }
  h += '</div></div>';
  box.innerHTML = h;
  var el = {box:box, W:W, H:H, m:m, N:N, cw:cw, o:o, it:it, cards:box.querySelectorAll('.carc'), svg:box.querySelector('.carln'), P:m*2.4};
  el.R = m*0.34*(o.radius||100)/100; el.Hh = ch*1.35; el.gap = cw*1.1;
  return el;
}
function carCol(o, i, N){
  var A = o.colA || '#ff6b3d', B = o.colB || '#3d73ff';
  switch(+o.palette){
    case 1: return i%2 ? B : A;
    case 2: return 'hsl(' + Math.round(i/N*360) + ',75%,58%)';
    case 3: return A;
  }
  return mixHex(A, B, N>1 ? i/(N-1) : 0);
}
function carRot(p, tx, tz){
  var a = tx*Math.PI/180, b = tz*Math.PI/180, c1 = Math.cos(a), s1 = Math.sin(a), c2 = Math.cos(b), s2 = Math.sin(b);
  var y = p[1]*c1 - p[2]*s1, z = p[1]*s1 + p[2]*c1, x = p[0];
  return [x*c2 - y*s2, x*s2 + y*c2, z];
}
function drawCar(el, t){
  var o = el.o, C = NABD_CAR, N = el.N, shp = el.it.shp, tx = o.tiltX === undefined ? -12 : o.tiltX;
  var spread = o.intro ? Math.min(1, outCubic(Math.min(1, (t % 9)/1.1))) : 1;
  var off = C.offset(t % 9, o.motion||0, (o.speed===undefined?30:o.speed)*(o.reverse?-1:1)*1.0, 0, o.hold||1, N);
  var prm = {shp:shp, R:el.R, H:el.Hh, rows:o.rows||el.it.rows||2, gap:el.gap, off:off, turns:o.turns||el.it.turns||2, t:t};
  var cx = el.W/2, cy = el.H/2, P = el.P, fb = (o.backFade===undefined?35:o.backFade)/100, dim = (o.backDim===undefined?30:o.backDim)/100;
  for(var i=0;i<N;i++){
    var q = C.core(i, N, prm), p = carRot([q[0]*spread, q[1]*spread, q[2]*spread], tx, 0), n;
    var face = +o.face||0;
    n = face===1 ? carRot([0,0,-1], tx, 0) : (face===2 ? [0,0,-1] : carRot([q[3],q[4],q[5]], tx, 0));
    var ncx = n[0], ncy = n[1], ncz = -n[2], th = Math.atan2(ncx, ncz), ph = -Math.asin(Math.max(-1, Math.min(1, ncy)));
    var z = Math.max(-1, Math.min(1, p[2]/Math.max(1, el.R))), d01 = (z+1)/2;
    var c = el.cards[i];
    c.style.transform = 'translate3d(' + (cx + p[0]).toFixed(1) + 'px,' + (cy + p[1]).toFixed(1) + 'px,' + (-p[2]).toFixed(1) + 'px) rotateY(' + th.toFixed(4) + 'rad) rotateX(' + ph.toFixed(4) + 'rad) rotateZ(' + q[6].toFixed(2) + 'deg)';
    c.style.opacity = (q[7]*(1 - fb*d01)).toFixed(3);
    c.style.filter = 'brightness(' + (1 - dim*d01).toFixed(3) + ')' + (o.blur ? ' blur(' + (d01*2).toFixed(1) + 'px)' : '');
  }
  // guide lines (same projection as the CSS perspective)
  if(!o.orbit && !o.spokes && !o.chain){ if(el.svg.innerHTML) el.svg.innerHTML = ''; return; }
  function prj(p){ var zc = -p[2], k = P/(P - zc); return [cx + p[0]*k, cy + p[1]*k]; }
  var hs = '', col = o.lineColor || '#ffffff', lw = Math.max(0.8, el.m*0.006), dash = o.lineStyle==='dashed' ? ' stroke-dasharray="' + (lw*3) + ' ' + (lw*2.5) + '"' : '', glow = o.lineStyle==='glow' ? ' style="filter:drop-shadow(0 0 ' + (lw*2.5) + 'px ' + col + ')"' : '';
  if(o.orbit){
    var open = {5:1,6:1,9:1,10:1,11:1,12:1,15:1}[shp], rings = (shp===1||shp===2||shp===15) ? (o.rows||el.it.rows||2) : ((shp===7||shp===8) ? 3 : 1);
    for(var k=0;k<rings;k++){
      var d = '', K = 60;
      for(var j=0;j<=(open?K:K-1);j++){ var pr = {}; for(var kk in prm) pr[kk] = prm[kk]; pr.su = j/K; var qq = C.core(k, N, pr), pp = prj(carRot([qq[0]*spread, qq[1]*spread, qq[2]*spread], tx, 0)); d += (j ? 'L' : 'M') + pp[0].toFixed(1) + ' ' + pp[1].toFixed(1); }
      hs += '<path d="' + d + (open ? '' : 'Z') + '" fill="none" stroke="' + col + '" stroke-width="' + lw + '" opacity=".75"' + dash + glow + '/>';
    }
  }
  if(o.spokes || o.chain){
    var pts = [];
    for(var i2=0;i2<N;i2++){ var q2 = C.core(i2, N, prm); pts.push(prj(carRot([q2[0]*spread, q2[1]*spread, q2[2]*spread], tx, 0))); }
    var c0 = prj([0,0,0]);
    if(o.spokes) pts.forEach(function(p){ hs += '<line x1="' + c0[0].toFixed(1) + '" y1="' + c0[1].toFixed(1) + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '" stroke="' + col + '" stroke-width="' + lw + '" opacity=".6"' + dash + '/>'; });
    if(o.chain) hs += '<path d="' + pts.map(function(p, ii){ return (ii ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('') + 'Z" fill="none" stroke="' + col + '" stroke-width="' + lw + '" opacity=".7"' + dash + glow + '/>';
  }
  el.svg.innerHTML = hs;
}

/* ===================================================== tracking / fill / trim icons */
var TRIM_PATHS = ['M40 70 L80 18 L120 70 Z', 'M80 30 a22 22 0 1 0 0.1 0', 'M22 84 C 50 60, 110 108, 138 84'];

/* ---------- depth 3D (multiplane) preview: layered scene + camera rig, same math as the AE expressions ---------- */
var DP_LAYERS = [
  {k:'sky'},
  {k:'sun'},
  {k:'far', pts:[[-260,40],[-200,-10],[-150,15],[-90,-40],[-30,5],[30,-25],[90,10],[150,-45],[210,0],[260,-20],[260,160],[-260,160]]},
  {k:'mid', pts:[[-240,60],[-170,25],[-100,50],[-20,18],[60,48],[140,22],[240,55],[240,160],[-240,160]]},
  {k:'front'}
];
function mountDepth(box, it){
  var cv = document.createElement('canvas'); cv.width = 640; cv.height = 360; cv.className = 'dpcv';
  cv.style.width = '100%'; cv.style.height = '100%'; cv.style.display = 'block';
  box.innerHTML = ''; box.appendChild(cv);
  return {cv:cv, ctx:cv.getContext('2d'), it:it};
}
function dpCam(move, u, t, s){
  var D = 400, r = [0, 0, 0], yaw = 0, pitch = 0, zoom = D, e = u < .5 ? 4*u*u*u : 1 - Math.pow(-2*u + 2, 3)/2;
  switch(move){
    case 'push': r[2] = D*.3*s*e; break;
    case 'pull': r[2] = -D*.3*s*e; break;
    case 'panL': r[0] = -320*.08*s*e*1.6; break;
    case 'panR': r[0] = 320*.08*s*e*1.6; break;
    case 'rise': r[1] = -180*.08*s*e*1.6; r[2] = D*.08*s*e; break;
    case 'orbit': yaw = 12*s*e; break;
    case 'pushOrbit': r[2] = D*.25*s*e; yaw = -9*s*e; break;
    case 'dolly': r[2] = D*.45*s*e; zoom = D - r[2]; break;
    case 'float': var A = 60*s*.6*.4; r = [Math.sin(t*.7)*A, Math.cos(t*.5)*A*.5, Math.sin(t*.35)*A*.8]; yaw = Math.sin(t*.4)*s*3; break;
    case 'shake': var B = 25*s*.25*.5; r = [(Math.sin(t*5.1) + Math.sin(t*8.3)*.5)*B, (Math.sin(t*4.3 + 1) + Math.sin(t*7.7)*.5)*B, 0]; yaw = Math.sin(t*3.7)*s*.6; pitch = Math.sin(t*4.1)*s*.6; break;
  }
  return {D:D, r:r, yaw:yaw*Math.PI/180, pitch:pitch*Math.PI/180, zoom:zoom};
}
function drawDepth(el, t, o, acc){
  var it = el.it, g = el.ctx, cyc = 4.2, tt = t % cyc, u = clamp((tt - .4)/2.8);
  var loop = it.move==='float' || it.move==='shake';
  var cam = dpCam(it.move, loop ? 1 : u, t, (o.amt||100)/100), D = cam.D;
  var n = DP_LAYERS.length, sp = (o.spread||600)/600*110;
  var piv = o.pivot==='back' ? n - 1 : (o.pivot==='middle' ? (n - 1)/2 : 0);
  var cyw = Math.cos(cam.yaw), syw = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), spch = Math.sin(cam.pitch);
  // camera sits at rig + R * [0,0,-D]
  var cpos = [cam.r[0] - D*syw, cam.r[1], cam.r[2] - D*cyw];
  // layer order: index 0 = front (nearest)
  var order = o.order==='reverse' ? [0,1,2,3,4] : [4,3,2,1,0];
  if(o.order==='random') order = [4,1,3,0,2];
  function proj(x, y, z){
    var px = x - cpos[0], py = y - cpos[1], pz = z - cpos[2];
    var x1 = px*cyw - pz*syw, z1 = px*syw + pz*cyw;
    var y1 = py*cp - z1*spch, z2 = py*spch + z1*cp;
    z2 = Math.max(z2, 1);
    return [160 + x1*cam.zoom/z2, 90 + y1*cam.zoom/z2];
  }
  var Ls = DP_LAYERS.map(function(L, li){
    var idx = order[li], z = Math.max(sp*(idx - piv), -D*.9), k = (D + z)/D, f = clamp(idx/(n - 1));
    k *= 1 + (o.over||0)/100*f;
    return {L:L, z:z, k:k, f:f};
  }).sort(function(a, b){ return b.z - a.z; });
  g.setTransform(2, 0, 0, 2, 0, 0); g.fillStyle = '#0d0d12'; g.fillRect(0, 0, 320, 180);
  var fz = 0; Ls.forEach(function(q){ if(q.L.k==='front') fz = q.z; });
  Ls.forEach(function(q){
    var L = q.L, k = q.k, z = q.z;
    function P(x, y){ return proj(x*k, y*k, z); }
    g.save();
    if(o.dof){ var bl = Math.min(5, Math.abs(z - fz)/D*9); g.filter = bl > .2 ? 'blur(' + bl.toFixed(1) + 'px)' : 'none'; }
    g.beginPath();
    if(L.k==='sky'){ var a = P(-170, -95), b = P(170, 95), c2 = P(170, -95), d = P(-170, 95); g.moveTo(a[0], a[1]); g.lineTo(c2[0], c2[1]); g.lineTo(b[0], b[1]); g.lineTo(d[0], d[1]); g.closePath();
      var gr = g.createLinearGradient(0, a[1], 0, b[1]); gr.addColorStop(0, '#1d2b55'); gr.addColorStop(.7, '#e0794f'); gr.addColorStop(1, '#f2b36b'); g.fillStyle = gr; }
    else if(L.k==='sun'){ var cc = P(55, -10), rr = P(55 + 22, -10); g.arc(cc[0], cc[1], Math.abs(rr[0] - cc[0]), 0, Math.PI*2); g.fillStyle = '#ffe2a0'; }
    else if(L.k==='front'){
      var h0 = P(-70, 20), hr = P(-70 + 11, 20); g.arc(h0[0], h0[1], Math.abs(hr[0] - h0[0]), 0, Math.PI*2);
      var b1 = P(-88, 34), b2 = P(-52, 34), b3 = P(-46, 110), b4 = P(-94, 110); g.moveTo(b1[0], b1[1]); g.lineTo(b2[0], b2[1]); g.lineTo(b3[0], b3[1]); g.lineTo(b4[0], b4[1]); g.closePath();
      g.fillStyle = acc;
    } else {
      L.pts.forEach(function(p, i){ var s2 = P(p[0], p[1]); if(i) g.lineTo(s2[0], s2[1]); else g.moveTo(s2[0], s2[1]); }); g.closePath();
      g.fillStyle = L.k==='far' ? '#6b3a5a' : '#2c1d33';
    }
    g.fill();
    if(o.fog && q.f > 0){ g.globalAlpha = q.f*.45; g.fillStyle = '#9eadc7'; g.fill(); g.globalAlpha = 1; }
    g.restore();
  });
}
function mountTrim(box, it, o){
  var h = '<svg viewBox="0 0 160 100" class="lnsvg"><rect width="160" height="100" fill="#141418"/>';
  TRIM_PATHS.forEach(function(d, i){
    if(i < 2) h += '<path class="tf" d="' + d + '" fill="' + (i ? o.acc : '#ffffff') + '" opacity="0"/>';
    h += '<path class="ts" d="' + d + '" fill="none" stroke="' + (i===1 ? o.acc : '#ffffff') + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="100"/>';
  });
  box.innerHTML = h + '</svg>';
  return {it:it, o:o, s:box.querySelectorAll('.ts'), f:box.querySelectorAll('.tf')};
}
function drawTrim(el, t){
  var it = el.it, st = it.style, cyc = 3.2, tt = t % cyc, u = clamp(tt/1.2), e = u<.5 ? 4*u*u*u : 1-Math.pow(-2*u+2,3)/2;
  var out = clamp((tt-2.0)/0.9), eo = out<.5 ? 4*out*out*out : 1-Math.pow(-2*out+2,3)/2;
  Array.prototype.forEach.call(el.s, function(p, i){
    var dl = it.individual ? i*0.18 : 0, ue = clamp((tt - dl)/1.2), ee = ue<.5 ? 4*ue*ue*ue : 1-Math.pow(-2*ue+2,3)/2, s = 0, en = 100, off = 0;
    switch(st){
      case 'draw': en = ee*100; break;
      case 'drawErase': en = ee*100; s = eo*100; break;
      case 'center': s = 50 - ee*50; en = 50 + ee*50; break;
      case 'reverse': s = 100 - ee*100; break;
      case 'erase': s = ee*100; break;
      case 'chase': en = ee*100; s = clamp((tt - dl - 0.42)/1.2); s = (s<.5 ? 4*s*s*s : 1-Math.pow(-2*s+2,3)/2)*100; break;
      case 'travel': s = 0; en = 25; off = (t*45) % 100; break;
    }
    if(st === 'travel'){ p.setAttribute('stroke-dasharray', '25 75'); p.style.strokeDashoffset = (-off).toFixed(1); p.style.visibility=''; }
    else if(en - s < 0.3){ p.style.visibility = 'hidden'; }
    else { p.style.visibility = ''; p.setAttribute('stroke-dasharray', (en - s).toFixed(2) + ' 1000'); p.style.strokeDashoffset = (-s).toFixed(2); }
    if(it.fillAfter){
      var f = el.f[i]; if(f){ var fa = clamp(((en - s) - 92)/8); f.setAttribute('opacity', (fa*0.95).toFixed(2)); }
      if(it.strokeFade){ p.style.opacity = (1 - clamp(((en - s) - 92)/8)*0.9).toFixed(2); }
    }
  });
}
function trkSVG(it, t, acc){
  var x = 80 + Math.sin(t*1.3)*34, y = 52 + Math.sin(t*2.1)*12, h = '<svg viewBox="0 0 160 100" class="lnsvg"><rect width="160" height="100" fill="#141418"/>';
  h += '<g opacity=".35"><path d="M0 80 L40 60 L80 72 L120 50 L160 64 L160 100 L0 100Z" fill="#3a3f52"/></g>';
  var box = '<rect x="' + (x-9) + '" y="' + (y-9) + '" width="18" height="18" fill="none" stroke="' + acc + '" stroke-width="1.4"/><rect x="' + (x-17) + '" y="' + (y-17) + '" width="34" height="34" fill="none" stroke="' + acc + '" stroke-width=".8" stroke-dasharray="3 2"/><path d="M' + (x-4) + ' ' + y + 'h8M' + x + ' ' + (y-4) + 'v8" stroke="#fff"/>';
  switch(it.id){
    case 'tPoint': case 'tStab': h += '<circle cx="' + x + '" cy="' + y + '" r="6" fill="#c9a47a"/>' + box; break;
    case 'tMask': h += '<ellipse cx="' + x + '" cy="' + y + '" rx="14" ry="18" fill="#c9a47a"/><ellipse cx="' + x + '" cy="' + y + '" rx="17" ry="21" fill="none" stroke="#ffd400" stroke-width="1.4"/>'; break;
    case 'tCam': for(var i=0;i<14;i++){ var px = (i*37 + t*12) % 160, py = 30 + (i*23)%55; h += '<circle cx="' + px.toFixed(1) + '" cy="' + py + '" r="1.8" fill="' + (i%3 ? '#5bd36b' : acc) + '"/>'; } h += '<path d="M60 70 L80 52 L100 70 Z" fill="none" stroke="' + acc + '"/>'; break;
    case 'tWarp': var j = Math.sin(t*9)*2*(1-clamp(((t%3)-1)/0.8)); h += '<rect x="' + (40+j) + '" y="' + (25-j) + '" width="80" height="50" rx="3" fill="none" stroke="#fff" stroke-width="1.2"/><text x="80" y="55" text-anchor="middle" fill="' + acc + '" font-size="11" font-weight="700">STABLE</text>'; break;
    case 'tNull': case 'tAttach': h += '<circle cx="' + x + '" cy="' + y + '" r="6" fill="#c9a47a"/><rect x="' + (x-8) + '" y="' + (y-8) + '" width="16" height="16" fill="none" stroke="#ff4f4f" stroke-width="1.4"/>' + (it.id==='tAttach' ? '<rect x="' + (x+12) + '" y="' + (y-30) + '" width="34" height="14" rx="3" fill="' + acc + '"/><path d="M' + x + ' ' + y + 'L' + (x+12) + ' ' + (y-16) + '" stroke="#fff" stroke-dasharray="2 2"/>' : ''); break;
    case 'tText': h += '<circle cx="' + x + '" cy="' + y + '" r="6" fill="#c9a47a"/><text x="' + x + '" y="' + (y-14) + '" text-anchor="middle" fill="#fff" font-size="12" font-weight="700">حمدي</text>'; break;
    case 'tCall': h += '<circle cx="' + x + '" cy="' + y + '" r="4" fill="' + acc + '"/><circle cx="' + x + '" cy="' + y + '" r="8" fill="none" stroke="#fff"/><path d="M' + x + ' ' + y + 'L' + (x+14) + ' ' + (y-20) + 'H' + (x+42) + '" fill="none" stroke="#fff"/><text x="' + (x+44) + '" y="' + (y-24) + '" fill="#fff" font-size="9" font-weight="700">LABEL</text>'; break;
    case 'tBlur': case 'tPixel': case 'tDark':
      h += '<ellipse cx="' + x + '" cy="' + y + '" rx="15" ry="19" fill="' + (it.id==='tDark' ? '#222' : '#c9a47a') + '"' + (it.id==='tBlur' ? ' style="filter:blur(4px)"' : '') + '/>';
      if(it.id==='tPixel') for(var a2=-2;a2<2;a2++) for(var b2=-2;b2<3;b2++) h += '<rect x="' + (x+a2*7) + '" y="' + (y+b2*7-4) + '" width="7" height="7" fill="hsl(30,' + (30+((a2*7+b2*3)&15)*3) + '%,' + (55+((a2+b2)&3)*6) + '%)"/>';
      break;
    case 'tPin': var k = Math.sin(t*1.1)*8; h += '<path d="M' + (50+k) + ' 28 L' + (112+k*0.5) + ' ' + (24) + ' L' + (116) + ' 72 L' + (46-k*0.4) + ' 76Z" fill="' + acc + '" opacity=".85" stroke="#fff"/><text x="81" y="56" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">NEW</text>'; break;
    case 'tStabUse': h += '<circle cx="80" cy="50" r="6" fill="#c9a47a"/><rect x="71" y="41" width="18" height="18" fill="none" stroke="' + acc + '"/><rect x="' + (30 + Math.sin(t*3)*3) + '" y="' + (18+Math.cos(t*3)*3) + '" width="100" height="64" fill="none" stroke="#fff" stroke-width=".8" stroke-dasharray="3 2"/>'; break;
    case 'tBake': for(var q=0;q<9;q++) h += '<path d="M' + (24+q*14) + ' ' + (50 + Math.sin(q*0.9)*16) + 'l5 5 -5 5 -5 -5z" fill="' + acc + '"/>'; break;
  }
  return h + '</svg>';
}
function gfSVG(it, t, acc){
  var show = (t % 3) > 1.5, h = '<svg viewBox="0 0 160 100" class="lnsvg"><defs><linearGradient id="gfs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb6ff"/><stop offset="1" stop-color="#ffd9a8"/></linearGradient></defs>';
  var scene = '<rect width="160" height="100" fill="url(#gfs)"/><path d="M0 72 Q40 60 80 70 T160 66 V100 H0Z" fill="#4f8a4f"/><circle cx="128" cy="24" r="9" fill="#fff6c8"/>';
  switch(it.op){
    case 'erase': h += scene + (show ? '' : '<rect x="66" y="40" width="22" height="34" rx="4" fill="#c0392b"/><ellipse cx="77" cy="56" rx="17" ry="22" fill="none" stroke="#ffd400" stroke-dasharray="3 2"/>'); break;
    case 'fill': h += scene + (show ? '<path d="M66 72 L77 34 L88 72Z" fill="#2e6b3a"/><rect x="75" y="66" width="4" height="8" fill="#6b4a2e"/>' : '<ellipse cx="77" cy="56" rx="17" ry="22" fill="none" stroke="#ffd400" stroke-dasharray="3 2"/>'); break;
    case 'replace': h += scene + '<rect x="62" y="46" width="30" height="24" rx="3" fill="' + (show ? acc : '#3466c2') + '"/><text x="77" y="40" text-anchor="middle" font-size="8" fill="#111">' + (show ? 'red car' : 'blue car') + '</text>'; break;
    case 'outpaint': h += '<rect width="160" height="100" fill="#141418"/>' + (show ? '<g transform="translate(55 0)">' + '<svg width="50" height="100" viewBox="55 0 50 100" preserveAspectRatio="xMidYMid slice">' + scene + '</svg></g>' : '<svg x="55" width="50" height="100" viewBox="40 0 80 100" preserveAspectRatio="xMidYMid slice">' + scene + '</svg><rect x="55" y="0" width="50" height="100" fill="none" stroke="#ffd400" stroke-dasharray="3 2"/>'); break;
    case 'removebg': h += (show ? '<rect width="160" height="100" fill="#2a2a31"/><g fill="#38383f">' + [0,1,2,3,4,5,6,7].map(function(i){ return '<rect x="' + (i*20) + '" y="' + ((i%2)*12) + '" width="10" height="100"/>'; }).join('') + '</g>' : scene) + '<circle cx="80" cy="44" r="10" fill="#c9a47a"/><rect x="66" y="56" width="28" height="34" rx="8" fill="' + acc + '"/>'; break;
    case 'photoshop': h += scene + '<rect x="10" y="10" width="26" height="26" rx="5" fill="#001e36"/><text x="23" y="28" text-anchor="middle" font-size="12" font-weight="700" fill="#31a8ff">Ps</text><path d="M44 23 h' + (show ? 30 : 10) + '" stroke="#fff" stroke-width="2"/>'; break;
    case 'caf': h += scene + '<rect x="' + (40 + (t*20)%70) + '" y="56" width="18" height="12" rx="2" fill="' + (show ? 'transparent' : '#c0392b') + '" stroke="#ffd400" stroke-dasharray="2 2"/>'; break;
  }
  return h + '</svg>';
}

/* ======================================================= sprite strips */
function mountSprite(box, url, kind){
  var img = '<div class="sprimg" style="background-image:url(' + url + ')"></div>';
  box.innerHTML = '<div class="spr ' + (kind==='ov' ? 'sov' : kind) + '">' + (kind==='ov' ? '<div class="sprbg"></div>' + img + img : img) + '</div>';
  var ims = box.querySelectorAll('.sprimg');
  return {img: ims[0], img2: ims[1] || null, kind: kind};
}
function drawSprite(el, t){
  if(!el.img) return;
  if(el.kind==='ov'){
    var x = (t*3) % 12, f = Math.floor(x), fr = x - f, g = (f+1) % 12;
    el.img.style.backgroundPosition = (f/11*100).toFixed(3) + '% 0'; el.img.style.opacity = (1-fr).toFixed(3);
    el.img2.style.backgroundPosition = (g/11*100).toFixed(3) + '% 0'; el.img2.style.opacity = fr.toFixed(3);
    return;
  }
  var cyc = 2.4, tt = t % cyc, f2 = tt < 0.5 ? 0 : Math.min(11, Math.floor((tt-0.5)/1.2*12));
  if(el._f !== f2){ el._f = f2; el.img.style.backgroundPosition = (f2/11*100).toFixed(3) + '% 0'; }
}

/* ============================================================ sfx wave */
function waveSVG(pk, prog, acc){
  var n = pk.length, w = 160/n, s = '<svg viewBox="0 0 160 100" preserveAspectRatio="none"><rect width="160" height="100" fill="#121216"/>';
  for(var i=0;i<n;i++){ var h = Math.max(1.5, pk[i]*70); s += '<rect x="' + (i*w+0.6) + '" y="' + (50-h/2) + '" width="' + (w-1.2) + '" height="' + h + '" rx="1" fill="' + (prog!==undefined && i/n <= prog ? acc : '#4a4a55') + '"/>'; }
  return s + '</svg>';
}

/* ========================================================= svg filters */
function injectFilters(){
  var d = document.createElement('div');
  d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  var px = '', i, sizes=[0,3,5,8,12];
  for(i=1;i<=4;i++){
    var z = sizes[i];
    px += '<filter id="nabdPx' + i + '" x="0" y="0"><feFlood x="' + (z/2) + '" y="' + (z/2) + '" height="1" width="1"/><feComposite width="' + z + '" height="' + z + '"/><feTile result="a"/><feComposite in="SourceGraphic" in2="a" operator="in"/><feMorphology operator="dilate" radius="' + (z/2) + '"/></filter>';
    px += '<filter id="nabdWarp' + i + '"><feTurbulence type="turbulence" baseFrequency=".012" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="' + (i*14) + '" xChannelSelector="R" yChannelSelector="G"/></filter>';
  }
  px += '<filter id="nabdWarp0"><feOffset/></filter>';
  d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + px + '</svg>';
  document.body.appendChild(d);
}

return {mountTr:mountTr, drawTr:drawTr, mountMp:mountMp, drawMp:drawMp, mountTx:mountTx, drawTx:drawTx,
        mountEz:mountEz, drawEz:drawEz, easeFn:easeFn, mountTitle:mountTitle, drawTitle:drawTitle, elSVG:E, injectFilters:injectFilters,
        mountCap:mountCap, drawCap:drawCap, waveSVG:waveSVG, mountLook:mountLook, drawLook:drawLook, mountStyle:mountStyle,
        clamp:clamp, rnd:rnd, mountSprite:mountSprite, drawSprite:drawSprite, mountLine:mountLine, drawLine:drawLine, mountCar:mountCar, drawCar:drawCar, mountTrim:mountTrim, drawTrim:drawTrim, mountDepth:mountDepth, drawDepth:drawDepth, trkSVG:trkSVG, gfSVG:gfSVG};
})();
