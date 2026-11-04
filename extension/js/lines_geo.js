/* NABD lines — shared geometry (ES3: used by the panel previews AND injected into host.jsx) */
var NABD_LINES = (function () {
    var PI = Math.PI;

    // Catmull-Rom smoothing -> AE-style relative tangents
    function smooth(pts, closed, ten) {
        var n = pts.length, it = [], ot = [], i, a, b, k = (ten === undefined ? 1 : ten) / 6;
        for (i = 0; i < n; i++) {
            if (closed) { a = pts[(i - 1 + n) % n]; b = pts[(i + 1) % n]; }
            else { a = pts[Math.max(0, i - 1)]; b = pts[Math.min(n - 1, i + 1)]; }
            var tx = (b[0] - a[0]) * k, ty = (b[1] - a[1]) * k;
            if (!closed && (i === 0 || i === n - 1)) { tx *= 0.5; ty *= 0.5; }
            it.push([-tx, -ty]); ot.push([tx, ty]);
        }
        return { v: pts, it: it, ot: ot, cl: !!closed };
    }
    function straight(pts, closed) {
        var it = [], ot = [], i;
        for (i = 0; i < pts.length; i++) { it.push([0, 0]); ot.push([0, 0]); }
        return { v: pts, it: it, ot: ot, cl: !!closed };
    }
    function ellipse(cx, cy, rx, ry, shift) {
        var K = 0.5523;
        var v = [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]];
        var it = [[-rx * K, 0], [0, -ry * K], [rx * K, 0], [0, ry * K]];
        var ot = [[rx * K, 0], [0, ry * K], [-rx * K, 0], [0, -ry * K]];
        var s = (shift || 0) % 4, o = { v: [], it: [], ot: [], cl: true }, i;
        for (i = 0; i < 4; i++) { o.v.push(v[(i + s) % 4]); o.it.push(it[(i + s) % 4]); o.ot.push(ot[(i + s) % 4]); }
        return o;
    }
    function P(path, w, c, d, extra) {
        path.w = w; path.c = c || 0; path.d = d || 0;
        if (extra) { for (var k in extra) { if (extra.hasOwnProperty(k)) { path[k] = extra[k]; } } }
        return path;
    }
    function rot(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; }
    function samp(n, fn) { var o = [], i; for (i = 0; i <= n; i++) { o.push(fn(i / n)); } return o; }
    function sampC(n, fn) { var o = [], i; for (i = 0; i < n; i++) { o.push(fn(i / n)); } return o; }
    function rev(a) { var o = [], i; for (i = a.length - 1; i >= 0; i--) { o.push(a[i]); } return o; }

    function lemn(S) { return sampC(28, function (u) { var t = u * 2 * PI, d = 1 + Math.sin(t) * Math.sin(t); return [S * 1.25 * Math.cos(t) / d, S * 1.25 * Math.sin(t) * Math.cos(t) / d]; }); }
    function heart(S) { return sampC(30, function (u) { var t = u * 2 * PI, x = 16 * Math.pow(Math.sin(t), 3), y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); return [x * S / 17, y * S / 17 - S * 0.05]; }); }

    function geo(kind, W, H) {
        var S = Math.min(W, H) * 0.3, R = Math.sqrt(W * W + H * H) / 2, out = [], i, n, y, x, pts;
        switch (kind) {
            // ------------------------------------------------ cover transitions
            case "trZig":
                pts = [];
                for (i = 0; i < 4; i++) { y = -H / 2 + H * (i + 0.5) / 4; if (i % 2) { pts.push([0.62 * W, y]); pts.push([-0.62 * W, y]); } else { pts.push([-0.62 * W, y]); pts.push([0.62 * W, y]); } }
                out.push(P(smooth(pts, false, 0.6), H / 4 * 1.45, 0, 0));
                out.push(P(smooth(pts, false, 0.6), H / 4 * 0.32, 1, 0.18));
                break;
            case "trDiag":
            case "trCross":
                n = 6;
                var E = (W + H) / (2 * Math.SQRT2), dd = 2 * E / n, ux = 1 / Math.SQRT2, uy = 1 / Math.SQRT2;
                for (i = 0; i < n; i++) {
                    var o = -E + dd * (i + 0.5), cx = ux * o, cy = uy * o, L = R * 1.15;
                    var a = [cx - L * ux, cy + L * uy], b = [cx + L * ux, cy - L * uy];
                    out.push(P(straight(i % 2 ? [b, a] : [a, b]), dd * 1.15, i % 2, kind === "trCross" ? i / (n - 1) * 0.45 : i / (n - 1)));
                }
                if (kind === "trCross") {
                    for (i = 0; i < n; i++) {
                        var o2 = -E + dd * (i + 0.5), cx2 = ux * o2, cy2 = -uy * o2, L2 = R * 1.15;
                        out.push(P(straight([[cx2 - L2 * ux, cy2 - L2 * uy], [cx2 + L2 * ux, cy2 + L2 * uy]]), dd * 1.15, 1, 0.5 + i / (n - 1) * 0.5));
                    }
                }
                break;
            case "trVert":
                n = 7;
                for (i = 0; i < n; i++) { x = -W / 2 + W * (i + 0.5) / n; var A = [x, -H * 0.62], B = [x, H * 0.62]; out.push(P(straight(i % 2 ? [B, A] : [A, B]), W / n * 1.15, i % 2, Math.abs(i - (n - 1) / 2) / ((n - 1) / 2))); }
                break;
            case "trSpiral":
                var turns = 3.2;
                pts = samp(56, function (u) { var th = u * turns * 2 * PI, r = R * 1.08 * u; return [r * Math.cos(th - PI / 2), r * Math.sin(th - PI / 2)]; });
                out.push(P(smooth(pts, false), R / turns * 1.35, 0, 0));
                out.push(P(smooth(pts, false), R / turns * 0.28, 1, 0.12));
                break;
            case "trRings":
                n = 4;
                for (i = 0; i < n; i++) { var rr = R * 1.04 * (i + 0.5) / n; out.push(P(ellipse(0, 0, rr, rr, i), R / n * 1.22, i % 2, i / (n - 1))); }
                break;
            case "trWave":
                n = 5;
                for (i = 0; i < n; i++) {
                    y = -H / 2 + H * (i + 0.5) / n;
                    var yy = y, amp = H / n * 0.32, ph = i * 1.3;
                    pts = samp(14, function (u) { return [-0.62 * W + 1.24 * W * u, yy + amp * Math.sin(u * 4 * PI + ph)]; });
                    out.push(P(smooth(i % 2 ? rev(pts) : pts, false), H / n * 1.55, i % 2, i / (n - 1)));
                }
                break;
            // ------------------------------------------------ drawn elements
            case "elUnderline":
                out.push(P(smooth([[-1.15 * S, 0.12 * S], [-0.4 * S, 0.2 * S], [0.45 * S, 0.06 * S], [1.15 * S, -0.16 * S]]), 1, 0, 0));
                break;
            case "elDouble":
                out.push(P(smooth([[-1.15 * S, 0.02 * S], [-0.4 * S, 0.1 * S], [0.45 * S, -0.04 * S], [1.15 * S, -0.26 * S]]), 1, 0, 0));
                out.push(P(smooth([[-0.95 * S, 0.24 * S], [-0.3 * S, 0.31 * S], [0.4 * S, 0.2 * S], [0.95 * S, 0.03 * S]]), 0.7, 1, 0.25));
                break;
            case "elCircle":
                pts = samp(16, function (u) { var th = -2.3 + u * 2 * PI * 1.12, k = 1 + 0.05 * Math.sin(3 * th) - 0.06 * u; return [1.15 * S * k * Math.cos(th), 0.6 * S * k * Math.sin(th)]; });
                out.push(P(smooth(pts, false), 0.8, 0, 0));
                break;
            case "elZigzag":
                pts = samp(8, function (u) { return [-1.1 * S + 2.2 * S * u, (Math.round(u * 8) % 2 ? -0.22 : 0.22) * S]; });
                out.push(P(straight(pts), 1, 0, 0));
                break;
            case "elWave":
                pts = samp(24, function (u) { return [-1.15 * S + 2.3 * S * u, 0.24 * S * Math.sin(u * 4 * PI)]; });
                out.push(P(smooth(pts, false), 1, 0, 0));
                break;
            case "elSpiral":
                pts = samp(40, function (u) { var th = u * 5 * PI, r = S * (0.06 + 0.94 * u); return [r * Math.cos(th), r * Math.sin(th)]; });
                out.push(P(smooth(pts, false), 0.8, 0, 0));
                break;
            case "elRays":
                n = 12;
                for (i = 0; i < n; i++) { var th2 = i / n * 2 * PI; out.push(P(straight([[Math.cos(th2) * 0.45 * S, Math.sin(th2) * 0.45 * S], [Math.cos(th2) * 0.95 * S, Math.sin(th2) * 0.95 * S]]), 0.8, i % 2, i / n * 0.35)); }
                break;
            case "elArrow":
                pts = [[-1.05 * S, 0.45 * S], [-0.3 * S, -0.35 * S], [0.45 * S, -0.1 * S], [0.95 * S, 0.32 * S]];
                out.push(P(smooth(pts, false), 1, 0, 0));
                var tip = pts[3], dx = tip[0] - pts[2][0], dy = tip[1] - pts[2][1], dl = Math.sqrt(dx * dx + dy * dy), dir = [dx / dl, dy / dl], hl = 0.3 * S;
                var h1 = rot(dir, 2.6), h2 = rot(dir, -2.6);
                out.push(P(straight([tip, [tip[0] + h1[0] * hl, tip[1] + h1[1] * hl]]), 1, 0, 0.8));
                out.push(P(straight([tip, [tip[0] + h2[0] * hl, tip[1] + h2[1] * hl]]), 1, 0, 0.8));
                break;
            case "elScribble":
                pts = samp(44, function (u) { var t = u * 2 * PI * 4.5; return [-1.1 * S + 2.2 * S * u + 0.2 * S * Math.cos(t), 0.26 * S * Math.sin(t)]; });
                out.push(P(smooth(pts, false), 0.7, 0, 0));
                break;
            case "elEmph":
                var angs = [-2.35, -1.57, -0.79];
                for (i = 0; i < 3; i++) { out.push(P(straight([[Math.cos(angs[i]) * 0.35 * S, Math.sin(angs[i]) * 0.35 * S + 0.3 * S], [Math.cos(angs[i]) * 0.9 * S, Math.sin(angs[i]) * 0.9 * S + 0.3 * S]]), 1.1, 0, i * 0.2)); }
                break;
            case "elFrame":
                out.push(P(straight([[-1.2 * S, -0.62 * S], [1.2 * S, -0.62 * S], [1.2 * S, 0.62 * S], [-1.2 * S, 0.62 * S]], true), 0.8, 0, 0));
                break;
            case "elCorners":
                var cw = 1.2 * S, ch = 0.62 * S, arm = 0.34 * S, sg = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
                for (i = 0; i < 4; i++) { var sx = sg[i][0], sy = sg[i][1]; out.push(P(straight([[sx * cw, sy * (ch - arm)], [sx * cw, sy * ch], [sx * (cw - arm), sy * ch]]), 1, 0, i * 0.12)); }
                break;
            case "elInfinity":
                out.push(P(smooth(lemn(S), true), 0.9, 0, 0));
                break;
            case "elHeart":
                out.push(P(smooth(heart(S), true), 0.9, 0, 0));
                break;
            case "elStar":
                pts = [];
                for (i = 0; i < 10; i++) { var r3 = i % 2 ? 0.42 * S : S, a3 = -PI / 2 + i * PI / 5; pts.push([r3 * Math.cos(a3), r3 * Math.sin(a3)]); }
                out.push(P(straight(pts, true), 0.8, 0, 0));
                break;
            case "elLightning":
                out.push(P(straight([[0.15 * S, -S], [-0.35 * S, 0.05 * S], [0.12 * S, 0.02 * S], [-0.2 * S, S]]), 1, 0, 0));
                break;
            // ------------------------------------------------ travel loops
            case "lpCircle":
                out.push(P(ellipse(0, 0, S, S, 0), 0.35, 1, 0, { full: true, op: 30 }));
                out.push(P(ellipse(0, 0, S, S, 0), 1, 0, 0, { seg: 28 }));
                break;
            case "lpInfinity":
                out.push(P(smooth(lemn(S), true), 0.35, 1, 0, { full: true, op: 30 }));
                out.push(P(smooth(lemn(S), true), 1, 0, 0, { seg: 30 }));
                break;
            case "lpHeart":
                out.push(P(smooth(heart(S), true), 1, 0, 0, { seg: 35 }));
                out.push(P(smooth(heart(S), true), 1, 1, 0.5, { seg: 20 }));
                break;
            case "lpOrbit":
                for (i = 0; i < 3; i++) {
                    var ang = i * PI / 3, e2 = [], q;
                    var base = sampC(24, function (u) { var t = u * 2 * PI; return [S * Math.cos(t), S * 0.32 * Math.sin(t)]; });
                    for (q = 0; q < base.length; q++) { e2.push(rot(base[q], ang)); }
                    out.push(P(smooth(e2, true), 0.25, 1, 0, { full: true, op: 25 }));
                    out.push(P(smooth(e2, true), 0.9, 0, i / 3, { seg: 18 }));
                }
                break;
            case "lpWave":
                for (i = 0; i < 3; i++) {
                    var off = (i - 1) * 0.28 * S, ph2 = i * 0.9;
                    pts = samp(24, function (u) { return [-1.2 * S + 2.4 * S * u, off + 0.16 * S * Math.sin(u * 4 * PI + ph2)]; });
                    out.push(P(smooth(pts, false), 0.7, i % 2, i / 3, { seg: 30 }));
                }
                break;
            case "lpDash":
                out.push(P(ellipse(0, 0, S, S, 0), 0.8, 0, 0, { dash: true }));
                out.push(P(ellipse(0, 0, S * 0.78, S * 0.78, 2), 0.5, 1, 0, { dash: true, rev: true }));
                break;
            // ------------------------------------------------ text paths (single path, width ~0.8W)
            case "tpLine": out.push(P(smooth([[-0.4 * W, 0.04 * H], [0.4 * W, -0.04 * H]], false), 1, 0, 0)); break;
            case "tpWave": out.push(P(smooth(samp(16, function (u) { return [-0.42 * W + 0.84 * W * u, 0.09 * H * Math.sin(u * 4 * PI)]; }), false), 1, 0, 0)); break;
            case "tpArc": out.push(P(smooth(samp(12, function (u) { var a4 = -PI / 2 - 1.1 + 2.2 * u, r4 = 0.5 * W; return [r4 * Math.cos(a4), r4 * Math.sin(a4) + r4 * 0.82]; }), false), 1, 0, 0)); break;
            case "tpCircle": var rc = Math.min(W, H) * 0.3; out.push(P(ellipse(0, 0, rc, rc, 3), 1, 0, 0)); break;
            case "tpS": out.push(P(smooth([[-0.42 * W, 0.12 * H], [-0.16 * W, -0.11 * H], [0.16 * W, 0.11 * H], [0.42 * W, -0.12 * H]], false), 1, 0, 0)); break;
            case "tpLoop": out.push(P(smooth(lemn(Math.min(W, H) * 0.32), true), 1, 0, 0)); break;
            case "tpSpiral": out.push(P(smooth(samp(36, function (u) { var th = PI + u * 3.6 * PI, r5 = Math.min(W, H) * (0.36 - 0.27 * u); return [r5 * Math.cos(th), r5 * Math.sin(th)]; }), false), 1, 0, 0)); break;
            case "tpRise": out.push(P(smooth([[-0.42 * W, 0.2 * H], [-0.1 * W, 0.12 * H], [0.18 * W, -0.04 * H], [0.42 * W, -0.22 * H]], false), 1, 0, 0)); break;
        }
        return out;
    }

    var G1 = "ترانزيشن خطوط", G2 = "رسم خطوط", G3 = "لوب خطوط", G4 = "خطوط على اللاير", G5 = "نص على مسار";
    var LIST = [
        { id: "trZig", ar: "فرشاة متعرجة", en: "Brush Zigzag", g: G1, mode: "cover" },
        { id: "trDiag", ar: "خطوط مايلة", en: "Diagonal Lines", g: G1, mode: "cover" },
        { id: "trCross", ar: "خطوط متقاطعة", en: "Cross Lines", g: G1, mode: "cover" },
        { id: "trVert", ar: "خطوط طولية", en: "Vertical Lines", g: G1, mode: "cover" },
        { id: "trSpiral", ar: "حلزون", en: "Spiral Wipe", g: G1, mode: "cover" },
        { id: "trRings", ar: "دواير", en: "Ring Lines", g: G1, mode: "cover" },
        { id: "trWave", ar: "موجات", en: "Wave Lines", g: G1, mode: "cover" },
        { id: "elUnderline", ar: "خط تحت", en: "Swoosh Underline", g: G2, mode: "draw" },
        { id: "elDouble", ar: "خطين سووش", en: "Double Swoosh", g: G2, mode: "draw" },
        { id: "elCircle", ar: "دايرة بالقلم", en: "Hand Circle", g: G2, mode: "draw" },
        { id: "elZigzag", ar: "زجزاج", en: "Zigzag", g: G2, mode: "draw" },
        { id: "elWave", ar: "موجة", en: "Wave", g: G2, mode: "draw" },
        { id: "elSpiral", ar: "حلزونة", en: "Spiral", g: G2, mode: "draw" },
        { id: "elRays", ar: "أشعة", en: "Rays", g: G2, mode: "draw" },
        { id: "elArrow", ar: "سهم منحني", en: "Curved Arrow", g: G2, mode: "draw" },
        { id: "elScribble", ar: "شخبطة", en: "Scribble", g: G2, mode: "draw" },
        { id: "elEmph", ar: "خطوط تنبيه", en: "Emphasis Marks", g: G2, mode: "draw" },
        { id: "elFrame", ar: "إطار", en: "Frame", g: G2, mode: "draw" },
        { id: "elCorners", ar: "أركان", en: "Corners", g: G2, mode: "draw" },
        { id: "elInfinity", ar: "لا نهاية", en: "Infinity", g: G2, mode: "draw" },
        { id: "elHeart", ar: "قلب خط", en: "Line Heart", g: G2, mode: "draw" },
        { id: "elStar", ar: "نجمة خط", en: "Line Star", g: G2, mode: "draw" },
        { id: "elLightning", ar: "برق", en: "Lightning", g: G2, mode: "draw" },
        { id: "lpCircle", ar: "مذنب في دايرة", en: "Circle Comet", g: G3, mode: "travel" },
        { id: "lpInfinity", ar: "مذنب لا نهاية", en: "Infinity Comet", g: G3, mode: "travel" },
        { id: "lpHeart", ar: "قلب بيلف", en: "Heart Chase", g: G3, mode: "travel" },
        { id: "lpOrbit", ar: "مدارات", en: "Orbits", g: G3, mode: "travel" },
        { id: "lpWave", ar: "موج ماشي", en: "Flowing Waves", g: G3, mode: "travel" },
        { id: "lpDash", ar: "دواير متقطعة", en: "Dashed Rings", g: G3, mode: "travel" },
        { id: "atUnder", ar: "خط تحت اللاير", en: "Underline", g: G4, mode: "attach" },
        { id: "atStrike", ar: "شطب", en: "Strike", g: G4, mode: "attach" },
        { id: "atBox", ar: "بوكس حواليه", en: "Box Outline", g: G4, mode: "attach" },
        { id: "atCorners", ar: "أركان حواليه", en: "Corner Marks", g: G4, mode: "attach" },
        { id: "atCircle", ar: "دايرة حواليه", en: "Circle Around", g: G4, mode: "attach" },
        { id: "atBrackets", ar: "أقواس [ ]", en: "Brackets", g: G4, mode: "attach" },
        { id: "atSide", ar: "خط جنبه", en: "Side Bar", g: G4, mode: "attach" },
        { id: "atDouble", ar: "خطين تحت", en: "Double Underline", g: G4, mode: "attach" },
        { id: "tpWave", ar: "نص على موجة", en: "Text on Wave", g: G5, mode: "path" },
        { id: "tpArc", ar: "نص على قوس", en: "Text on Arc", g: G5, mode: "path" },
        { id: "tpCircle", ar: "نص بيلف في دايرة", en: "Text on Circle", g: G5, mode: "path" },
        { id: "tpS", ar: "نص على S", en: "Text on S-Curve", g: G5, mode: "path" },
        { id: "tpLoop", ar: "نص على لا نهاية", en: "Text on Infinity", g: G5, mode: "path" },
        { id: "tpSpiral", ar: "نص حلزوني", en: "Text on Spiral", g: G5, mode: "path" },
        { id: "tpRise", ar: "نص طالع", en: "Text Rising Curve", g: G5, mode: "path" },
        { id: "tpLine", ar: "نص على خط", en: "Text on Line", g: G5, mode: "path" }
    ];
    return { geo: geo, LIST: LIST, smooth: smooth, ellipse: ellipse };
})();
