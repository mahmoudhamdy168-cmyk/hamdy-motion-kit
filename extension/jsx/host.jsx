/*  HAMDY Motion Kit v0.3 - After Effects engine (ExtendScript, ES3)
    The panel calls:  NABD.run('<json string>')  and gets a JSON string back.
    Errors are returned as codes; the panel shows them in Arabic.            */

// <<LINES_GEO (generated from js/lines_geo.js by tools/inject_geo.py \u2014 edit that file)
/* NABD lines \u2014 shared geometry (ES3: used by the panel previews AND injected into host.jsx) */
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

    var G1 = "\u062a\u0631\u0627\u0646\u0632\u064a\u0634\u0646 \u062e\u0637\u0648\u0637", G2 = "\u0631\u0633\u0645 \u062e\u0637\u0648\u0637", G3 = "\u0644\u0648\u0628 \u062e\u0637\u0648\u0637", G4 = "\u062e\u0637\u0648\u0637 \u0639\u0644\u0649 \u0627\u0644\u0644\u0627\u064a\u0631", G5 = "\u0646\u0635 \u0639\u0644\u0649 \u0645\u0633\u0627\u0631";
    var LIST = [
        { id: "trZig", ar: "\u0641\u0631\u0634\u0627\u0629 \u0645\u062a\u0639\u0631\u062c\u0629", en: "Brush Zigzag", g: G1, mode: "cover" },
        { id: "trDiag", ar: "\u062e\u0637\u0648\u0637 \u0645\u0627\u064a\u0644\u0629", en: "Diagonal Lines", g: G1, mode: "cover" },
        { id: "trCross", ar: "\u062e\u0637\u0648\u0637 \u0645\u062a\u0642\u0627\u0637\u0639\u0629", en: "Cross Lines", g: G1, mode: "cover" },
        { id: "trVert", ar: "\u062e\u0637\u0648\u0637 \u0637\u0648\u0644\u064a\u0629", en: "Vertical Lines", g: G1, mode: "cover" },
        { id: "trSpiral", ar: "\u062d\u0644\u0632\u0648\u0646", en: "Spiral Wipe", g: G1, mode: "cover" },
        { id: "trRings", ar: "\u062f\u0648\u0627\u064a\u0631", en: "Ring Lines", g: G1, mode: "cover" },
        { id: "trWave", ar: "\u0645\u0648\u062c\u0627\u062a", en: "Wave Lines", g: G1, mode: "cover" },
        { id: "elUnderline", ar: "\u062e\u0637 \u062a\u062d\u062a", en: "Swoosh Underline", g: G2, mode: "draw" },
        { id: "elDouble", ar: "\u062e\u0637\u064a\u0646 \u0633\u0648\u0648\u0634", en: "Double Swoosh", g: G2, mode: "draw" },
        { id: "elCircle", ar: "\u062f\u0627\u064a\u0631\u0629 \u0628\u0627\u0644\u0642\u0644\u0645", en: "Hand Circle", g: G2, mode: "draw" },
        { id: "elZigzag", ar: "\u0632\u062c\u0632\u0627\u062c", en: "Zigzag", g: G2, mode: "draw" },
        { id: "elWave", ar: "\u0645\u0648\u062c\u0629", en: "Wave", g: G2, mode: "draw" },
        { id: "elSpiral", ar: "\u062d\u0644\u0632\u0648\u0646\u0629", en: "Spiral", g: G2, mode: "draw" },
        { id: "elRays", ar: "\u0623\u0634\u0639\u0629", en: "Rays", g: G2, mode: "draw" },
        { id: "elArrow", ar: "\u0633\u0647\u0645 \u0645\u0646\u062d\u0646\u064a", en: "Curved Arrow", g: G2, mode: "draw" },
        { id: "elScribble", ar: "\u0634\u062e\u0628\u0637\u0629", en: "Scribble", g: G2, mode: "draw" },
        { id: "elEmph", ar: "\u062e\u0637\u0648\u0637 \u062a\u0646\u0628\u064a\u0647", en: "Emphasis Marks", g: G2, mode: "draw" },
        { id: "elFrame", ar: "\u0625\u0637\u0627\u0631", en: "Frame", g: G2, mode: "draw" },
        { id: "elCorners", ar: "\u0623\u0631\u0643\u0627\u0646", en: "Corners", g: G2, mode: "draw" },
        { id: "elInfinity", ar: "\u0644\u0627 \u0646\u0647\u0627\u064a\u0629", en: "Infinity", g: G2, mode: "draw" },
        { id: "elHeart", ar: "\u0642\u0644\u0628 \u062e\u0637", en: "Line Heart", g: G2, mode: "draw" },
        { id: "elStar", ar: "\u0646\u062c\u0645\u0629 \u062e\u0637", en: "Line Star", g: G2, mode: "draw" },
        { id: "elLightning", ar: "\u0628\u0631\u0642", en: "Lightning", g: G2, mode: "draw" },
        { id: "lpCircle", ar: "\u0645\u0630\u0646\u0628 \u0641\u064a \u062f\u0627\u064a\u0631\u0629", en: "Circle Comet", g: G3, mode: "travel" },
        { id: "lpInfinity", ar: "\u0645\u0630\u0646\u0628 \u0644\u0627 \u0646\u0647\u0627\u064a\u0629", en: "Infinity Comet", g: G3, mode: "travel" },
        { id: "lpHeart", ar: "\u0642\u0644\u0628 \u0628\u064a\u0644\u0641", en: "Heart Chase", g: G3, mode: "travel" },
        { id: "lpOrbit", ar: "\u0645\u062f\u0627\u0631\u0627\u062a", en: "Orbits", g: G3, mode: "travel" },
        { id: "lpWave", ar: "\u0645\u0648\u062c \u0645\u0627\u0634\u064a", en: "Flowing Waves", g: G3, mode: "travel" },
        { id: "lpDash", ar: "\u062f\u0648\u0627\u064a\u0631 \u0645\u062a\u0642\u0637\u0639\u0629", en: "Dashed Rings", g: G3, mode: "travel" },
        { id: "atUnder", ar: "\u062e\u0637 \u062a\u062d\u062a \u0627\u0644\u0644\u0627\u064a\u0631", en: "Underline", g: G4, mode: "attach" },
        { id: "atStrike", ar: "\u0634\u0637\u0628", en: "Strike", g: G4, mode: "attach" },
        { id: "atBox", ar: "\u0628\u0648\u0643\u0633 \u062d\u0648\u0627\u0644\u064a\u0647", en: "Box Outline", g: G4, mode: "attach" },
        { id: "atCorners", ar: "\u0623\u0631\u0643\u0627\u0646 \u062d\u0648\u0627\u0644\u064a\u0647", en: "Corner Marks", g: G4, mode: "attach" },
        { id: "atCircle", ar: "\u062f\u0627\u064a\u0631\u0629 \u062d\u0648\u0627\u0644\u064a\u0647", en: "Circle Around", g: G4, mode: "attach" },
        { id: "atBrackets", ar: "\u0623\u0642\u0648\u0627\u0633 [ ]", en: "Brackets", g: G4, mode: "attach" },
        { id: "atSide", ar: "\u062e\u0637 \u062c\u0646\u0628\u0647", en: "Side Bar", g: G4, mode: "attach" },
        { id: "atDouble", ar: "\u062e\u0637\u064a\u0646 \u062a\u062d\u062a", en: "Double Underline", g: G4, mode: "attach" },
        { id: "tpWave", ar: "\u0646\u0635 \u0639\u0644\u0649 \u0645\u0648\u062c\u0629", en: "Text on Wave", g: G5, mode: "path" },
        { id: "tpArc", ar: "\u0646\u0635 \u0639\u0644\u0649 \u0642\u0648\u0633", en: "Text on Arc", g: G5, mode: "path" },
        { id: "tpCircle", ar: "\u0646\u0635 \u0628\u064a\u0644\u0641 \u0641\u064a \u062f\u0627\u064a\u0631\u0629", en: "Text on Circle", g: G5, mode: "path" },
        { id: "tpS", ar: "\u0646\u0635 \u0639\u0644\u0649 S", en: "Text on S-Curve", g: G5, mode: "path" },
        { id: "tpLoop", ar: "\u0646\u0635 \u0639\u0644\u0649 \u0644\u0627 \u0646\u0647\u0627\u064a\u0629", en: "Text on Infinity", g: G5, mode: "path" },
        { id: "tpSpiral", ar: "\u0646\u0635 \u062d\u0644\u0632\u0648\u0646\u064a", en: "Text on Spiral", g: G5, mode: "path" },
        { id: "tpRise", ar: "\u0646\u0635 \u0637\u0627\u0644\u0639", en: "Text Rising Curve", g: G5, mode: "path" },
        { id: "tpLine", ar: "\u0646\u0635 \u0639\u0644\u0649 \u062e\u0637", en: "Text on Line", g: G5, mode: "path" }
    ];
    return { geo: geo, LIST: LIST, smooth: smooth, ellipse: ellipse };
})();
// LINES_GEO>>

// <<CAR_CORE (generated from js/car_core.js by tools/inject_geo.py)
var NABD_CAR_SRC = "function nabdCar(i, N, o) {\n    var PI = Math.PI, TAU = 2 * PI, S = (o.su !== undefined && o.su !== null);\n    var R = o.R, H = o.H, gap = o.gap, off = o.off, rows = Math.max(1, Math.round(o.rows || 1));\n    var u = S ? o.su : i / N + off, fu = u - Math.floor(u);\n    var p = [0, 0, 0], n = [0, 0, -1], roll = 0, fade = 1, a, row, j, M, y, r, d, ad, sg;\n    function ringP(ang, yy, rad) { return [rad * Math.sin(ang), yy, -rad * Math.cos(ang)]; }\n    function ringN(ang) { return [Math.sin(ang), 0, -Math.cos(ang)]; }\n    function wrapD() { var q = fu * N; if (q > N / 2) { q -= N; } return q; }\n    function edge(x, w) { return Math.max(0, Math.min(1, x / w)); }\n    switch (Math.round(o.shp)) {\n        case 0: // ring\n            a = TAU * fu; p = ringP(a, 0, R); n = ringN(a); break;\n        case 1: // cylinder rows\n        case 2: // counter-rotating rows\n            if (S) { row = i; a = TAU * fu; }\n            else {\n                row = i % rows; j = Math.floor(i / rows); M = Math.ceil(N / rows);\n                a = TAU * (j / M + ((o.shp > 1.5 && row % 2) ? -off : off) + row * 0.5 / M);\n            }\n            if (S && o.shp > 1.5 && row % 2) { a = -a; }\n            y = (row - (rows - 1) / 2) * H;\n            p = ringP(a, y, R); n = ringN(a); break;\n        case 3: // ferris wheel (faces the viewer)\n            a = TAU * fu; p = [R * Math.sin(a), -R * Math.cos(a), 0]; n = [0, 0, -1]; break;\n        case 4: // slot reel (vertical ring)\n            a = TAU * fu; p = [0, -R * Math.sin(a), -R * Math.cos(a)]; n = [0, -Math.sin(a), -Math.cos(a)]; break;\n        case 5: // helix\n        case 6: // tornado / cone\n            var turns = o.turns || 2;\n            a = TAU * fu * turns; y = (0.5 - fu) * H * Math.max(1, rows);\n            r = o.shp > 5.5 ? R * (0.3 + 0.7 * fu) : R;\n            p = ringP(a, y, r); n = ringN(a);\n            if (!S) { fade = Math.min(edge(fu, 0.08), edge(1 - fu, 0.08)); }\n            break;\n        case 7: // atom (3 tilted rings)\n            row = S ? i : i % 3; j = S ? 0 : Math.floor(i / 3); M = Math.ceil(N / 3);\n            a = S ? TAU * fu : TAU * (j / M + off * (1 + row * 0.3));\n            var b = ringP(a, 0, R), bn = ringN(a), tx = 1.2, tz = row * PI / 3;\n            var c1 = Math.cos(tx), s1 = Math.sin(tx), c2 = Math.cos(tz), s2 = Math.sin(tz);\n            var b1 = [b[0], b[1] * c1 - b[2] * s1, b[1] * s1 + b[2] * c1], n1 = [bn[0], bn[1] * c1 - bn[2] * s1, bn[1] * s1 + bn[2] * c1];\n            p = [b1[0] * c2 - b1[1] * s2, b1[0] * s2 + b1[1] * c2, b1[2]];\n            n = [n1[0] * c2 - n1[1] * s2, n1[0] * s2 + n1[1] * c2, n1[2]];\n            break;\n        case 8: // sphere (fibonacci)\n            if (S) { y = (i - 1) * 0.55; a = TAU * fu; }\n            else { y = 1 - 2 * (i + 0.5) / N; a = i * 2.399963 + TAU * off; }\n            r = Math.sqrt(Math.max(0, 1 - y * y));\n            p = [R * r * Math.sin(a), R * y, -R * r * Math.cos(a)]; n = [r * Math.sin(a), y, -r * Math.cos(a)]; break;\n        case 9: // cover flow\n            d = S ? (fu - 0.5) * N : wrapD(); ad = Math.abs(d); sg = d < 0 ? -1 : 1;\n            var cd = Math.max(-1, Math.min(1, d)), c0 = gap * 1.15;\n            p = [ad <= 1 ? d * c0 : sg * (c0 + (ad - 1) * gap * 0.42), 0, Math.min(ad, 1) * R * 0.55];\n            n = [-cd * 0.87, 0, -Math.sqrt(Math.max(0.05, 1 - cd * cd * 0.75))];\n            fade = edge(N / 2 - ad, 1); break;\n        case 10: // conveyor line\n            d = S ? (fu - 0.5) * N : wrapD();\n            p = [d * gap, 0, 0]; fade = edge(N / 2 - Math.abs(d), 1.2); break;\n        case 11: // 3D wave line\n            d = S ? (fu - 0.5) * N : wrapD(); a = d / N * TAU * 1.5;\n            p = [d * gap, R * 0.22 * Math.sin(a), R * 0.45 * Math.cos(a) - R * 0.45]; fade = edge(N / 2 - Math.abs(d), 1.2); break;\n        case 12: // fan of cards\n            d = S ? (fu - 0.5) * N : wrapD(); a = d * (gap / Math.max(1, R)) * 0.9;\n            p = [R * Math.sin(a), R * (1 - Math.cos(a)), Math.abs(d) * 2]; roll = a * 180 / PI; fade = edge(N / 2 - Math.abs(d), 1); break;\n        case 13: // infinity in depth\n            a = TAU * fu; var den = 1 + Math.sin(a) * Math.sin(a);\n            p = [R * 1.45 * Math.cos(a) / den, 0, R * 1.1 * Math.sin(a) * Math.cos(a) / den]; break;\n        case 14: // elliptic orbit\n            a = TAU * fu; p = [R * 1.4 * Math.sin(a), R * 0.08 * Math.sin(2 * a), -R * 0.55 * Math.cos(a)]; break;\n        case 15: // curved panorama wall (rows)\n            if (S) { row = i; a = (fu - 0.5) * 2.4; }\n            else { row = i % rows; j = Math.floor(i / rows); M = Math.ceil(N / rows); var cu = j / M + off; cu -= Math.floor(cu); a = (cu - 0.5) * TAU; fade = edge(1.35 - Math.abs(a), 0.35); }\n            y = (row - (rows - 1) / 2) * H;\n            p = [R * Math.sin(a), y, -R * (1 - Math.cos(a))]; n = [-Math.sin(a), 0, -Math.cos(a)];\n            break;\n        case 16: // floating cloud\n            var sd = (i + 1) * 12.9898, rx = Math.sin(sd) * 43758.5453, ry = Math.sin(sd * 1.7) * 23421.631, rz = Math.sin(sd * 2.3) * 31337.123;\n            rx -= Math.floor(rx); ry -= Math.floor(ry); rz -= Math.floor(rz);\n            var ang2 = TAU * off, bx = (rx * 2 - 1) * R * 1.3, bz = (rz * 2 - 1) * R * 0.8, by = (ry * 2 - 1) * R * 0.6 + Math.sin((o.t || 0) * 1.3 + i) * R * 0.05;\n            if (S) { bx = R * 1.3 * Math.sin(TAU * fu); bz = -R * 0.8 * Math.cos(TAU * fu); by = 0; }\n            p = [bx * Math.cos(ang2) - bz * Math.sin(ang2), by, bx * Math.sin(ang2) + bz * Math.cos(ang2)]; break;\n    }\n    return [p[0], p[1], p[2], n[0], n[1], n[2], roll, fade];\n}\n/* rotation offset in turns for the motion modes: 0 spin, 1 step & hold, 2 swing, 3 manual, 4 spin & stop */\nfunction nabdCarOff(t, mot, spd, rot, hold, N) {\n    var off = rot / 360, m = Math.round(mot), dir = spd < 0 ? -1 : 1;\n    if (m === 0) { off += t * spd / 360; }\n    else if (m === 1) { var per = Math.max(0.1, hold) + 0.55, k = Math.floor(t / per), f = (t - k * per - Math.max(0.1, hold)) / 0.55; f = Math.max(0, Math.min(1, f)); f = f * f * (3 - 2 * f); off += dir * (k + f) / N; }\n    else if (m === 2) { off += Math.sin(t * 2 * Math.PI * Math.abs(spd) / 360) * 0.12; }\n    else if (m === 4) { var D = Math.max(0.3, hold * 2), e = Math.max(0, Math.min(1, t / D)); off += (1 - Math.pow(1 - e, 3)) * spd * D * 1.6 / 360; }\n    return off;\n}";
// CAR_CORE>>

var NABD = (function () {
    var VER = "1.9.20";

    // ================================================================ JSON
    function J(v) {
        var i, out, k, t = typeof v;
        if (v === null || v === undefined) { return "null"; }
        if (t === "number") { return isFinite(v) ? String(v) : "null"; }
        if (t === "boolean") { return v ? "true" : "false"; }
        if (t === "string") {
            return "\"" + v.replace(/[\\"\u0000-\u001f\u007f-\uffff]/g, function (c) {
                return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
            }) + "\"";
        }
        if (v instanceof Array) {
            out = [];
            for (i = 0; i < v.length; i++) { out.push(J(v[i])); }
            return "[" + out.join(",") + "]";
        }
        out = [];
        for (k in v) { if (v.hasOwnProperty(k)) { out.push(J(String(k)) + ":" + J(v[k])); } }
        return "{" + out.join(",") + "}";
    }
    function Err(code) { var e = new Error(code); e.nabd = true; return e; }

    // ============================================================= helpers
    function comp() {
        var c = app.project ? app.project.activeItem : null;
        if (c && (c instanceof CompItem)) { return c; }
        throw Err("NO_COMP");
    }
    function has(o, k) { return o && o.hasOwnProperty(k) && o[k] !== undefined && o[k] !== null; }
    function clampInf(v) { return Math.max(0.1, Math.min(100, v)); }
    function inList(v, arr) { for (var i = 0; i < arr.length; i++) { if (arr[i] === v) { return true; } } return false; }
    function extOf(name) { var m = String(name).match(/\.([^\.]+)$/); return m ? m[1].toLowerCase() : ""; }
    function snap(c, t) { return Math.round(t / c.frameDuration) * c.frameDuration; }
    function sameVal(a, b) {
        if (a instanceof Array && b instanceof Array) {
            if (a.length !== b.length) { return false; }
            for (var i = 0; i < a.length; i++) { if (a[i] !== b[i]) { return false; } }
            return true;
        }
        return a === b;
    }
    function easeDims(prop) {
        var t = prop.propertyValueType;
        if (t === PropertyValueType.TwoD) { return 2; }
        if (t === PropertyValueType.ThreeD) { return 3; }
        return 1;
    }
    function setEase(prop, k, inInf, outInf) {
        var n = easeDims(prop), a = [], b = [], i;
        for (i = 0; i < n; i++) {
            a.push(new KeyframeEase(0, clampInf(inInf)));
            b.push(new KeyframeEase(0, clampInf(outInf)));
        }
        try {
            prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
            prop.setTemporalEaseAtKey(k, a, b);
        } catch (e) {}
    }
    function setLinear(prop, k) { try { prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR); } catch (e) {} }
    function setHold(prop, k) { try { prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD); } catch (e) {} }

    function parade(L) { return L.property("ADBE Effect Parade"); }
    function addEffect(L, mn, name) {
        var p = parade(L);
        p.addProperty(mn);
        var e = p.property(p.numProperties);
        if (name) { try { e.name = name; } catch (x) {} }
        // Transform effect: always follow the comp's motion-blur switch (its own forced blur makes previews heavy and soft)
        if (mn === "ADBE Geometry2") { try { compShutterOn(e); } catch (x2) {} }
        return e;
    }
    function compShutterOn(e) {
        var k, pr, done = false;
        for (k = 1; k <= e.numProperties; k++) {
            pr = e.property(k);
            if (/Shutter Angle/i.test(pr.name) && /Comp/i.test(pr.name)) { pr.setValue(1); done = true; }
        }
        if (!done) { e.property(10).setValue(1); }
    }
    function fxIdx(L) { return parade(L).numProperties; }
    function FX(L, i) { return parade(L).property(i); }

    function topSelected(c) {
        var sel = c.selectedLayers, best = null, i;
        for (i = 0; i < sel.length; i++) { if (!best || sel[i].index < best.index) { best = sel[i]; } }
        return best;
    }
    function rgb(a, def) { return (a && a.length >= 3) ? [a[0], a[1], a[2]] : (def || [1, 1, 1]); }

    function layerRect(L, t) {
        try { return L.sourceRectAtTime(t, false); } catch (e) { return null; }
    }
    function layerCenter(L, t) {
        var r = layerRect(L, t);
        if (!r || (r.width === 0 && r.height === 0)) {
            try { return L.property("ADBE Transform Group").property("ADBE Anchor Point").value.slice(0, 2); } catch (e) { return [0, 0]; }
        }
        return [r.left + r.width / 2, r.top + r.height / 2];
    }
    function layerScale(L) {
        try {
            var s = L.property("ADBE Transform Group").property("ADBE Scale").value;
            return [Math.abs(s[0]) / 100 || 1, Math.abs(s[1]) / 100 || 1];
        } catch (e) { return [1, 1]; }
    }
    // text & shape layers are NOT "instanceof AVLayer" in ExtendScript, so go by matchName
    // helper layers (sounds, style copies, mattes, guide lines) are tucked away as "shy"
    var TUCK = true, TIMING = true, MKN = "", MKAR = true;
    // marker labels show the name of the effect that was applied (in the panel's language)
    function mkLabel(dir) {
        if (!MKN) { return dir === "in" ? "HAMDY IN" : "HAMDY OUT"; }
        return (dir === "in" ? (MKAR ? "\u062f\u062e\u0648\u0644: " : "IN: ") : (MKAR ? "\u062e\u0631\u0648\u062c: " : "OUT: ")) + MKN;
    }
    var MK_DIR_RE = { "in": /^(?:HAMDY IN$|IN: |\u062f\u062e\u0648\u0644: )/, "out": /^(?:HAMDY OUT$|OUT: |\u062e\u0631\u0648\u062c: )/ };
    function clearMarkers(L, re) {
        var M = L.property("ADBE Marker"), k;
        for (k = M.numKeys; k >= 1; k--) { try { if (re.test(M.keyValue(k).comment)) { M.removeKey(k); } } catch (e) {} }
    }
    var PATH_STAGES = { start: ["START", "\u0628\u062f\u0627\u064a\u0629"], stop: ["STOP", "\u0648\u0642\u0641\u0629"], go: ["GO", "\u064a\u0643\u0645\u0651\u0644"], end: ["END", "\u0646\u0647\u0627\u064a\u0629"] };
    function pathLabel(st) { return MKN ? MKN + " - " + PATH_STAGES[st][MKAR ? 1 : 0] : "HAMDY PATH " + PATH_STAGES[st][0]; }
    function tuck(c, L) {
        if (!TUCK) { return; }
        try { L.shy = true; c.hideShyLayers = true; } catch (e) {}
    }
    function isAV(L) {
        var mn = "";
        try { mn = L.matchName; } catch (e) {}
        if (mn) { return mn === "ADBE AV Layer" || mn === "ADBE Text Layer" || mn === "ADBE Vector Layer"; }
        return (L instanceof AVLayer) || (L instanceof TextLayer) || (L instanceof ShapeLayer);
    }
    function animatable(L) {
        if (!isAV(L)) { return false; }
        try { if (L.nullLayer) { return false; } } catch (e) {}
        return true;
    }
    function needSel(c, min) {
        var s = c.selectedLayers;
        if (s.length < (min || 1)) { throw Err((min || 1) > 1 ? "NEED2" : "NO_LAYERS"); }
        return s;
    }
    function centerAnchor(L, t) {
        var tg = L.property("ADBE Transform Group");
        var ap = tg.property("ADBE Anchor Point"), pos = tg.property("ADBE Position"), sc = tg.property("ADBE Scale");
        if (ap.numKeys > 0 || pos.numKeys > 0 || pos.dimensionsSeparated) { return false; }
        var r = layerRect(L, t);
        if (!r) { return false; }
        var na = [r.left + r.width / 2, r.top + r.height / 2];
        var a = ap.value, p = pos.value, s = sc.value;
        var dx = (na[0] - a[0]) * s[0] / 100, dy = (na[1] - a[1]) * s[1] / 100;
        if (a.length > 2) { ap.setValue([na[0], na[1], a[2]]); } else { ap.setValue(na); }
        if (p.length > 2) { pos.setValue([p[0] + dx, p[1] + dy, p[2]]); } else { pos.setValue([p[0] + dx, p[1] + dy]); }
        return true;
    }
    function fitLayer(L, c) {
        var r = layerRect(L, c.time);
        if (!r || r.width <= 0 || r.height <= 0) { return; }
        var s = Math.max(c.width / r.width, c.height / r.height) * 100;
        try { L.property("ADBE Transform Group").property("ADBE Scale").setValue([s, s]); } catch (e) {}
    }

    // 4-key animation used by transitions (out of A, hold, into B)
    function animate4(prop, T, vals, ease) {
        var i;
        for (i = 0; i < 4; i++) { prop.setValueAtTime(T[i], vals[i]); }
        var k0 = prop.nearestKeyIndex(T[0]), kA = prop.nearestKeyIndex(T[1]);
        var kB = prop.nearestKeyIndex(T[2]), k1 = prop.nearestKeyIndex(T[3]);
        setEase(prop, k0, 33, ease);
        setEase(prop, kA, 0.1, 0.1);
        setEase(prop, kB, 0.1, 0.1);
        setEase(prop, k1, ease, 33);
        if (!sameVal(vals[1], vals[2])) {
            try { prop.setInterpolationTypeAtKey(kA, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.HOLD); } catch (e) {}
        }
    }
    function keysAt(prop, times, vals, O, I) {
        var i, k;
        for (i = 0; i < times.length; i++) { prop.setValueAtTime(times[i], vals[i]); }
        for (i = 0; i < times.length; i++) {
            k = prop.nearestKeyIndex(times[i]);
            setEase(prop, k, I, O);
        }
    }

    // ======================================================== shape helpers
    function shapeLayer(c, name, pos) {
        var L = c.layers.addShape();
        L.name = name;
        var tg = L.property("ADBE Transform Group");
        tg.property("ADBE Anchor Point").setValue([0, 0]);
        tg.property("ADBE Position").setValue(pos || [c.width / 2, c.height / 2]);
        return L;
    }
    function addGroup(L, name) {
        var r = L.property("ADBE Root Vectors Group");
        r.addProperty("ADBE Vector Group");
        var i = r.numProperties;
        r.property(i).name = name || ("Group " + i);
        return i;
    }
    function GV(L, gi) { return L.property("ADBE Root Vectors Group").property(gi).property("ADBE Vectors Group"); }
    function GT(L, gi) { return L.property("ADBE Root Vectors Group").property(gi).property("ADBE Vector Transform Group"); }
    function addIn(L, gi, mn) { var v = GV(L, gi); v.addProperty(mn); return v.numProperties; }
    function GP(L, gi, idx) { return GV(L, gi).property(idx); }
    function sRect(L, gi, w, h, pos, round) {
        var i = addIn(L, gi, "ADBE Vector Shape - Rect");
        GP(L, gi, i).property("ADBE Vector Rect Size").setValue([w, h]);
        if (pos) { GP(L, gi, i).property("ADBE Vector Rect Position").setValue(pos); }
        if (round) { GP(L, gi, i).property("ADBE Vector Rect Roundness").setValue(round); }
        return i;
    }
    function sEllipse(L, gi, d, pos) {
        var i = addIn(L, gi, "ADBE Vector Shape - Ellipse");
        GP(L, gi, i).property("ADBE Vector Ellipse Size").setValue([d, d]);
        if (pos) { GP(L, gi, i).property("ADBE Vector Ellipse Position").setValue(pos); }
        return i;
    }
    function sPath(L, gi, pts, closed, inT, outT) {
        var i = addIn(L, gi, "ADBE Vector Shape - Group");
        var s = new Shape();
        s.vertices = pts;
        if (inT) { s.inTangents = inT; }
        if (outT) { s.outTangents = outT; }
        s.closed = !!closed;
        GP(L, gi, i).property("ADBE Vector Shape").setValue(s);
        return i;
    }
    function sFill(L, gi, col, op) {
        var i = addIn(L, gi, "ADBE Vector Graphic - Fill");
        GP(L, gi, i).property("ADBE Vector Fill Color").setValue([col[0], col[1], col[2], 1]);
        if (op !== undefined) { GP(L, gi, i).property("ADBE Vector Fill Opacity").setValue(op); }
        return i;
    }
    function sStroke(L, gi, col, w, round, op) {
        var i = addIn(L, gi, "ADBE Vector Graphic - Stroke");
        var p = GP(L, gi, i);
        p.property("ADBE Vector Stroke Color").setValue([col[0], col[1], col[2], 1]);
        p.property("ADBE Vector Stroke Width").setValue(w);
        if (round) {
            try { GP(L, gi, i).property("ADBE Vector Stroke Line Cap").setValue(2); } catch (e) {}
            try { GP(L, gi, i).property("ADBE Vector Stroke Line Join").setValue(2); } catch (e2) {}
        }
        if (op !== undefined) { GP(L, gi, i).property("ADBE Vector Stroke Opacity").setValue(op); }
        return i;
    }
    function sTrim(L, gi) { return addIn(L, gi, "ADBE Vector Filter - Trim"); }
    function sRepeater(L, gi, copies, pos, rot) {
        var i = addIn(L, gi, "ADBE Vector Filter - Repeater");
        GP(L, gi, i).property("ADBE Vector Repeater Copies").setValue(copies);
        var tr = GP(L, gi, i).property("ADBE Vector Repeater Transform");
        tr.property("ADBE Vector Repeater Position").setValue(pos || [0, 0]);
        if (rot !== undefined) { GP(L, gi, i).property("ADBE Vector Repeater Transform").property("ADBE Vector Repeater Rotation").setValue(rot); }
        return i;
    }
    function ellipseShape(cx, cy, rx, ry) {
        var k = 0.5523, s = new Shape();
        s.vertices = [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]];
        s.inTangents = [[-rx * k, 0], [0, -ry * k], [rx * k, 0], [0, ry * k]];
        s.outTangents = [[rx * k, 0], [0, ry * k], [-rx * k, 0], [0, -ry * k]];
        s.closed = true;
        return s;
    }
    function rampFx(L, p1, c1, p2, c2, shape) {
        var e = addEffect(L, "ADBE Ramp", "HAMDY Ramp"), i = e.propertyIndex;
        try {
            FX(L, i).property(1).setValue(p1);
            FX(L, i).property(2).setValue([c1[0], c1[1], c1[2], 1]);
            FX(L, i).property(3).setValue(p2);
            FX(L, i).property(4).setValue([c2[0], c2[1], c2[2], 1]);
            FX(L, i).property(5).setValue(shape || 1);
        } catch (x) {}
        return i;
    }
    function span(L, t0, t1) {
        try { L.inPoint = t0; } catch (e) {}
        try { L.outPoint = t1; } catch (e2) {}
    }

    // ============================================================= library
    var EXT = {
        ffx: ["ffx"],
        video: ["mov", "mp4", "m4v", "avi", "webm", "mxf", "mkv"],
        image: ["png", "jpg", "jpeg", "psd", "ai", "tif", "tiff", "gif", "svg", "exr", "webp"],
        audio: ["wav", "mp3", "aif", "aiff", "m4a", "aac", "ogg"]
    };
    function typeOf(ext) {
        var k;
        for (k in EXT) { if (EXT.hasOwnProperty(k) && inList(ext, EXT[k])) { return k; } }
        return null;
    }
    function listFiles(folder, out, depth, base, fi) {
        if (depth > 5 || out.length > 3000) { return out; }
        var items = folder.getFiles(), i, f, ty;
        for (i = 0; i < items.length; i++) {
            f = items[i];
            if (f instanceof Folder) { listFiles(f, out, depth + 1, base, fi); }
            else {
                ty = typeOf(extOf(f.displayName));
                if (ty) { out.push({ path: f.fsName, name: f.displayName, rel: f.fsName.substring(base.length + 1), type: ty, folder: fi }); }
            }
        }
        return out;
    }
    function getOrMakeFolder(name) {
        var i, it, root = app.project.rootFolder;
        for (i = 1; i <= app.project.numItems; i++) {
            it = app.project.item(i);
            if (it instanceof FolderItem && it.name === name && it.parentFolder === root) { return it; }
        }
        return app.project.items.addFolder(name);
    }
    function importFile(file) {
        var i, it;
        for (i = 1; i <= app.project.numItems; i++) {
            it = app.project.item(i);
            if (it instanceof FootageItem && it.file && it.file.fsName === file.fsName) { return it; }
        }
        var io = new ImportOptions(file);
        if (io.canImportAs(ImportAsType.FOOTAGE)) { io.importAs = ImportAsType.FOOTAGE; }
        it = app.project.importFile(io);
        try { it.parentFolder = getOrMakeFolder("HAMDY Library"); } catch (e) {}
        return it;
    }

    // ========================================================= transitions
    var TR = { position: 2, uni: 3, scale: 4, sw: 5, rotation: 8, compShutter: 10, shutter: 11 };

    function addTile(L) {
        var e = addEffect(L, "ADBE Tile", "HAMDY Tile"), i = e.propertyIndex;
        try { FX(L, i).property(4).setValue(300); FX(L, i).property(5).setValue(300); FX(L, i).property(6).setValue(1); } catch (x) {}
    }
    function addTransform(L, T, ease, tracks, opts) {
        var e = addEffect(L, "ADBE Geometry2", "HAMDY Transform"), i = e.propertyIndex, k;
        try { compShutterOn(FX(L, i)); } catch (x) {}
        if (opts && opts.nonUniform) { try { FX(L, i).property(TR.uni).setValue(0); } catch (x2) {} }
        for (k in tracks) { if (tracks.hasOwnProperty(k)) { animate4(FX(L, i).property(TR[k]), T, tracks[k], ease); } }
        return i;
    }
    function jitterExpr(amt, rotAmt) {
        return "var p = clamp((time - inPoint) / (outPoint - inPoint), 0, 1);\n" +
            "var amt = Math.sin(p * Math.PI) * " + amt + ";\n" +
            "seedRandom(Math.floor(time / thisComp.frameDuration / 2), true);\n" +
            "value + [random(-amt, amt), random(-amt * " + (rotAmt || 0.25) + ", amt * " + (rotAmt || 0.25) + ")];";
    }
    function findWhoosh(paths) {
        var hits = [], i, j, f, all;
        for (j = 0; paths && j < paths.length; j++) {
            f = new Folder(paths[j]);
            if (!f.exists) { continue; }
            all = listFiles(f, [], 0, f.fsName, j);
            for (i = 0; i < all.length; i++) {
                if (all[i].type === "audio" && /(whoosh|swoosh|woosh|swish|swipe|transition)/i.test(all[i].name)) { hits.push(all[i].path); }
            }
        }
        if (!hits.length) { return null; }
        return new File(hits[Math.floor(Math.random() * hits.length)]);
    }

    function transition(a) {
        var c = comp(), type = a.type;
        var fd = c.frameDuration, W = c.width, H = c.height, cx = W / 2, cy = H / 2;
        var sel = c.selectedLayers, cut = c.time, i;
        if (sel.length >= 2) {
            cut = 0;
            for (i = 0; i < sel.length; i++) { if (sel[i].inPoint > cut) { cut = sel[i].inPoint; } }
        }
        cut = snap(c, cut);
        var half = Math.max(2, Math.round((a.frames || 12) / 2)) * fd;
        var t0 = Math.max(0, cut - half), t1 = Math.min(c.duration, cut + half);
        var T = [t0, Math.max(t0, cut - fd), cut, t1];
        var ease = a.snappy ? 95 : 75;
        var top = topSelected(c);
        var acc = rgb(a.acc, [1, 0.42, 0.24]);
        var L, gi, j, n, li, ei, ti2;
        function slide(dx, dy) { return [[cx, cy], [cx + dx, cy + dy], [cx - dx, cy - dy], [cx, cy]]; }
        var made = [];
        function place(lay) { lay.label = 9; made.push(lay); if (top) { lay.moveBefore(top); } }
        function adj(name) {
            var A = c.layers.addSolid([1, 1, 1], "HAMDY TR | " + name, W, H, c.pixelAspect, t1 - t0);
            A.startTime = t0;
            A.adjustmentLayer = true;
            place(A);
            return A;
        }

        switch (type) {
            // ---------- solids / light
            case "flash":
            case "dip":
                L = c.layers.addSolid(type === "dip" ? [0, 0, 0] : [1, 1, 1], "HAMDY TR | " + type, W, H, c.pixelAspect, t1 - t0);
                L.startTime = t0; place(L);
                animate4(L.property("ADBE Transform Group").property("ADBE Opacity"), T, [0, 100, 100, 0], ease);
                break;
            case "lightLeak":
                var cols = [[1, 0.55, 0.15], [1, 0.25, 0.45]];
                for (j = 0; j < 2; j++) {
                    L = c.layers.addSolid([0, 0, 0], "HAMDY TR | leak " + (j + 1), W, H, c.pixelAspect, t1 - t0 + half);
                    L.startTime = t0 - half * 0.25; place(L);
                    L.blendingMode = BlendingMode.ADD;
                    li = rampFx(L, [W * 0.2, H * 0.5], cols[j], [W * 0.2 + H * 0.9, H * 0.5], [0, 0, 0], 2);
                    keysAt(FX(L, li).property(1), [t0, t1], [[j ? W * 1.1 : -W * 0.2, H * (j ? 0.3 : 0.7)], [j ? -W * 0.1 : W * 1.1, H * (j ? 0.7 : 0.3)]], 33, 33);
                    FX(L, li).property(3).expression = "effect(\"HAMDY Ramp\")(1) + [" + (H * 0.9) + ", 0]";
                    animate4(L.property("ADBE Transform Group").property("ADBE Opacity"), T, [0, 100, 100, 0], 60);
                }
                break;
            case "lensFlash":
                L = c.layers.addSolid([0, 0, 0], "HAMDY TR | lens flash", W, H, c.pixelAspect, t1 - t0);
                L.startTime = t0; place(L);
                L.blendingMode = BlendingMode.ADD;
                li = rampFx(L, [cx, cy], [1, 0.95, 0.85], [cx + H * 0.1, cy], [0, 0, 0], 2);
                animate4(FX(L, li).property(3), T, [[cx + H * 0.05, cy], [cx + W * 1.2, cy], [cx + W * 1.2, cy], [cx + H * 0.05, cy]], ease);
                animate4(L.property("ADBE Transform Group").property("ADBE Opacity"), T, [0, 100, 100, 0], ease);
                break;
            // ---------- shapes
            case "shapeLeft": case "shapeRight": case "shapeUp": case "shapeDown":
                L = shapeLayer(c, "HAMDY TR | " + type);
                span(L, t0, t1); place(L);
                gi = addGroup(L, "wipe");
                sRect(L, gi, W + 40, H + 40);
                sFill(L, gi, acc);
                var dv = { shapeLeft: [W + 40, 0], shapeRight: [-W - 40, 0], shapeUp: [0, H + 40], shapeDown: [0, -H - 40] }[type];
                animate4(GT(L, gi).property("ADBE Vector Position"), T, [dv, [0, 0], [0, 0], [-dv[0], -dv[1]]], ease);
                break;
            case "circle":
                L = shapeLayer(c, "HAMDY TR | circle");
                span(L, t0, t1); place(L);
                gi = addGroup(L, "circle");
                var D = Math.sqrt(W * W + H * H) * 1.05;
                var ei = sEllipse(L, gi, 0);
                sFill(L, gi, acc);
                animate4(GP(L, gi, ei).property("ADBE Vector Ellipse Size"), T, [[0, 0], [D, D], [D, D], [0, 0]], ease);
                break;
            case "bars":
                L = shapeLayer(c, "HAMDY TR | bars");
                span(L, t0, t1); place(L);
                n = 5;
                var bw = W / n, sft = (cut - t0) * 0.12;
                for (j = 0; j < n; j++) {
                    gi = addGroup(L, "bar " + (j + 1));
                    sRect(L, gi, bw + 4, H + 4, [-cx + bw * (j + 0.5), 0]);
                    sFill(L, gi, acc);
                    var a0 = t0 + j * sft, a1 = cut - (n - 1 - j) * sft, b0 = cut + j * sft, b1 = t1 - (n - 1 - j) * sft;
                    var pp = GT(L, gi).property("ADBE Vector Position");
                    pp.setValueAtTime(a0, [0, -H - 10]); pp.setValueAtTime(a1, [0, 0]);
                    pp.setValueAtTime(b0, [0, 0]); pp.setValueAtTime(b1, [0, H + 10]);
                    setEase(pp, 1, 33, ease); setEase(pp, 2, 0.1, 33); setEase(pp, 3, 33, 0.1); setEase(pp, 4, ease, 33);
                }
                break;
            case "split":
                L = shapeLayer(c, "HAMDY TR | split");
                span(L, t0, t1); place(L);
                for (j = 0; j < 2; j++) {
                    gi = addGroup(L, j ? "bottom" : "top");
                    sRect(L, gi, W + 20, H / 2 + 10, [0, j ? H / 4 : -H / 4]);
                    sFill(L, gi, acc);
                    var off = j ? H / 2 + 20 : -H / 2 - 20;
                    animate4(GT(L, gi).property("ADBE Vector Position"), T, [[0, off], [0, 0], [0, 0], [0, off]], ease);
                }
                break;
            case "diagonal":
                L = shapeLayer(c, "HAMDY TR | diagonal");
                span(L, t0, t1); place(L);
                gi = addGroup(L, "bar");
                sRect(L, gi, W * 1.7, H * 2.6);
                sFill(L, gi, acc);
                GT(L, gi).property("ADBE Vector Rotation").setValue(20);
                animate4(GT(L, gi).property("ADBE Vector Position"), T, [[W * 1.5, 0], [0, 0], [0, 0], [-W * 1.5, 0]], ease);
                break;
            case "strobe":
                L = c.layers.addSolid([1, 1, 1], "HAMDY TR | strobe", W, H, c.pixelAspect, t1 - t0);
                L.startTime = t0; place(L);
                var sop = L.property("ADBE Transform Group").property("ADBE Opacity"), sv2 = [0, 100, 0, 100, 0, 100, 0], sj;
                for (sj = 0; sj < sv2.length; sj++) { sop.setValueAtTime(t0 + (t1 - t0) * sj / (sv2.length - 1), sv2[sj]); }
                for (sj = 1; sj <= sop.numKeys; sj++) { setHold(sop, sj); }
                break;
            case "lightSweep":
                L = shapeLayer(c, "HAMDY TR | light sweep");
                span(L, t0, t1); place(L);
                L.blendingMode = BlendingMode.ADD;
                gi = addGroup(L, "beam");
                sRect(L, gi, W * 0.35, H * 2.4);
                sFill(L, gi, [1, 0.97, 0.9]);
                GT(L, gi).property("ADBE Vector Rotation").setValue(18);
                keysAt(GT(L, gi).property("ADBE Vector Position"), [t0, t1], [[-W, 0], [W, 0]], 40, 40);
                li = addEffect(L, "ADBE Gaussian Blur 2", "HAMDY Soft").propertyIndex;
                try { FX(L, li).property(1).setValue(W * 0.08); } catch (xs) {}
                animate4(L.property("ADBE Transform Group").property("ADBE Opacity"), T, [0, 100, 100, 0], 50);
                break;
            case "filmBurn":
                var fcol = [[1, 0.45, 0.08], [1, 0.12, 0.05]];
                for (j = 0; j < 2; j++) {
                    L = c.layers.addSolid([0, 0, 0], "HAMDY TR | burn " + (j + 1), W, H, c.pixelAspect, t1 - t0);
                    L.startTime = t0; place(L);
                    L.blendingMode = BlendingMode.ADD;
                    li = rampFx(L, [j ? W * 0.8 : W * 0.15, H * (j ? 0.25 : 0.8)], fcol[j], [j ? W * 0.8 + H : W * 0.15 + H, H * 0.5], [0, 0, 0], 2);
                    animate4(L.property("ADBE Transform Group").property("ADBE Opacity"), T, [0, 100, 100, 0], 60);
                    L.property("ADBE Transform Group").property("ADBE Opacity").expression = "seedRandom(Math.floor(time * 15) + " + j + ", true);\nvalue * random(0.7, 1);";
                }
                break;
            case "flare":
                L = adj("flare");
                li = addEffect(L, "ADBE Lens Flare", "HAMDY Flare").propertyIndex;
                keysAt(FX(L, li).property(1), [t0, t1], [[W * 0.1, H * 0.3], [W * 0.9, H * 0.4]], 40, 40);
                animate4(FX(L, li).property(2), T, [0, 260, 260, 0], 60);
                break;
            case "circleCorner":
                L = shapeLayer(c, "HAMDY TR | corner circle");
                span(L, t0, t1); place(L);
                gi = addGroup(L, "circle");
                var D2 = Math.sqrt(W * W + H * H) * 2.1;
                ei = sEllipse(L, gi, 0, [-cx, cy]);
                sFill(L, gi, acc);
                animate4(GP(L, gi, ei).property("ADBE Vector Ellipse Size"), T, [[0, 0], [D2, D2], [D2, D2], [0, 0]], ease);
                break;
            case "stripes":
                L = shapeLayer(c, "HAMDY TR | stripes");
                span(L, t0, t1); place(L);
                n = 6;
                var sw2 = (W + H) / n, sst = (cut - t0) * 0.1;
                for (j = 0; j < n; j++) {
                    gi = addGroup(L, "stripe " + (j + 1));
                    sRect(L, gi, sw2 * 1.05, H * 3, [-cx * 1.4 + sw2 * (j + 0.5), 0]);
                    sFill(L, gi, j % 2 ? acc : [Math.min(1, acc[0] * 0.75 + 0.1), acc[1] * 0.75, acc[2] * 0.75]);
                    GT(L, gi).property("ADBE Vector Rotation").setValue(25);
                    var sp2 = GT(L, gi).property("ADBE Vector Position");
                    var ta0 = t0 + j * sst, ta1 = cut - (n - 1 - j) * sst, tb0 = cut + j * sst, tb1 = t1 - (n - 1 - j) * sst;
                    sp2.setValueAtTime(ta0, [0, -H * 2.2]); sp2.setValueAtTime(ta1, [0, 0]);
                    sp2.setValueAtTime(tb0, [0, 0]); sp2.setValueAtTime(tb1, [0, H * 2.2]);
                    setEase(sp2, 1, 33, ease); setEase(sp2, 2, 0.1, 33); setEase(sp2, 3, 33, 0.1); setEase(sp2, 4, ease, 33);
                }
                break;
            case "dots":
            case "squares":
                L = shapeLayer(c, "HAMDY TR | " + type);
                span(L, t0, t1); place(L);
                var cols2 = 9, cell = W / cols2, rows = Math.ceil(H / cell) + 1;
                gi = addGroup(L, "grid");
                var di;
                if (type === "dots") { di = sEllipse(L, gi, 0, [-cx + cell / 2, -cy + cell / 2]); }
                else { di = sRect(L, gi, 0, 0, [-cx + cell / 2, -cy + cell / 2]); }
                sFill(L, gi, acc);
                sRepeater(L, gi, cols2, [cell, 0]);
                sRepeater(L, gi, rows, [0, cell]);
                var big = type === "dots" ? cell * 1.5 : cell * 1.02;
                animate4(GP(L, gi, di).property(type === "dots" ? "ADBE Vector Ellipse Size" : "ADBE Vector Rect Size"), T, [[0, 0], [big, big], [big, big], [0, 0]], ease);
                break;
            case "brush":
                L = shapeLayer(c, "HAMDY TR | brush");
                span(L, t0, t1); place(L);
                gi = addGroup(L, "stroke");
                var bwid = H * 0.42;
                sPath(L, gi, [[-cx - bwid, -cy * 0.62], [cx + bwid, -cy * 0.5], [-cx - bwid, 0], [cx + bwid, cy * 0.12], [-cx - bwid, cy * 0.62], [cx + bwid, cy * 0.75]], false);
                ti2 = sTrim(L, gi);
                sStroke(L, gi, acc, bwid, true);
                keysAt(GP(L, gi, ti2).property("ADBE Vector Trim End"), [t0, cut], [0, 100], 30, 70);
                keysAt(GP(L, gi, ti2).property("ADBE Vector Trim Start"), [cut, t1], [0, 100], 30, 70);
                break;
            case "doubleWipe":
                L = shapeLayer(c, "HAMDY TR | double wipe");
                span(L, t0, t1); place(L);
                var dcol = [[1, 1, 1], acc];
                for (j = 0; j < 2; j++) {
                    gi = addGroup(L, "wipe " + (j + 1));
                    sRect(L, gi, W + 40, H + 40);
                    sFill(L, gi, dcol[j]);
                    var dpos = GT(L, gi).property("ADBE Vector Position"), dl = (cut - t0) * 0.22 * (1 - j);
                    dpos.setValueAtTime(t0 + (j ? (cut - t0) * 0.22 : 0), [W + 40, 0]);
                    dpos.setValueAtTime(cut - dl, [0, 0]);
                    dpos.setValueAtTime(cut + (j ? 0 : (t1 - cut) * 0.22), [0, 0]);
                    dpos.setValueAtTime(t1 - (j ? (t1 - cut) * 0.22 : 0), [-W - 40, 0]);
                    setEase(dpos, 1, 33, ease); setEase(dpos, 2, 0.1, 33); setEase(dpos, 3, 33, 0.1); setEase(dpos, 4, ease, 33);
                }
                break;
            case "panels":
                L = shapeLayer(c, "HAMDY TR | panels");
                span(L, t0, t1); place(L);
                for (j = 0; j < 3; j++) {
                    gi = addGroup(L, "panel " + (j + 1));
                    sRect(L, gi, W + 40, H / 3 + 4, [0, -cy + H / 6 + j * H / 3]);
                    sFill(L, gi, acc);
                    var dirp = j % 2 ? -1 : 1;
                    animate4(GT(L, gi).property("ADBE Vector Position"), T, [[dirp * (W + 40), 0], [0, 0], [0, 0], [-dirp * (W + 40), 0]], ease);
                }
                break;
            case "clockWipe":
                L = shapeLayer(c, "HAMDY TR | clock");
                span(L, t0, t1); place(L);
                gi = addGroup(L, "clock");
                var CD = Math.sqrt(W * W + H * H) * 1.1;
                sEllipse(L, gi, CD / 2);
                ti2 = sTrim(L, gi);
                sStroke(L, gi, acc, CD / 2, false);
                keysAt(GP(L, gi, ti2).property("ADBE Vector Trim End"), [t0, cut], [0, 100], 33, ease);
                keysAt(GP(L, gi, ti2).property("ADBE Vector Trim Start"), [cut, t1], [0, 100], ease, 33);
                break;
            case "starIris":
            case "heartIris":
                L = shapeLayer(c, "HAMDY TR | " + type);
                span(L, t0, t1); place(L);
                gi = addGroup(L, type);
                if (type === "starIris") {
                    var si3 = addIn(L, gi, "ADBE Vector Shape - Star");
                    try { GP(L, gi, si3).property("ADBE Vector Star Type").setValue(1); GP(L, gi, si3).property("ADBE Vector Star Points").setValue(5); GP(L, gi, si3).property("ADBE Vector Star Outer Radius").setValue(100); GP(L, gi, si3).property("ADBE Vector Star Inner Radius").setValue(45); } catch (est) {}
                } else {
                    var hp2 = [], hh;
                    for (j = 0; j < 64; j++) { hh = j / 64 * Math.PI * 2; hp2.push([16 * Math.pow(Math.sin(hh), 3) * 6, -(13 * Math.cos(hh) - 5 * Math.cos(2 * hh) - 2 * Math.cos(3 * hh) - Math.cos(4 * hh)) * 6]); }
                    sPath(L, gi, hp2, true);
                }
                sFill(L, gi, acc);
                var big2 = Math.sqrt(W * W + H * H) / 100 * 100 * 1.6;
                animate4(GT(L, gi).property("ADBE Vector Scale"), T, [[0, 0], [big2, big2], [big2, big2], [0, 0]], ease);
                animate4(GT(L, gi).property("ADBE Vector Rotation"), T, [0, 90, -90, 0], ease);
                break;
            // ---------- adjustment-layer transitions
            default:
                L = adj(type);
                addTile(L);
                switch (type) {
                    case "zoomIn": addTransform(L, T, ease, { scale: [100, 300, 33, 100] }); break;
                    case "zoomOut": addTransform(L, T, ease, { scale: [100, 33, 300, 100] }); break;
                    case "crashZoom":
                        addTransform(L, T, 98, { scale: [100, 420, 25, 100] });
                        li = addEffect(L, "ADBE Gaussian Blur 2", "HAMDY Blur").propertyIndex;
                        try { FX(L, li).property(3).setValue(1); } catch (x0) {}
                        animate4(FX(L, li).property(1), T, [0, 45, 45, 0], 98);
                        break;
                    case "shake":
                        li = addTransform(L, T, ease, { scale: [100, 112, 112, 100] });
                        FX(L, li).property(TR.position).expression = jitterExpr(W * 0.05, 1);
                        FX(L, li).property(TR.rotation).expression = "var p = clamp((time - inPoint) / (outPoint - inPoint), 0, 1);\nseedRandom(Math.floor(time / thisComp.frameDuration / 2) + 7, true);\nvalue + random(-5, 5) * Math.sin(p * Math.PI);";
                        break;
                    case "slideLeft": addTransform(L, T, ease, { position: slide(-W, 0) }); break;
                    case "slideRight": addTransform(L, T, ease, { position: slide(W, 0) }); break;
                    case "slideUp": addTransform(L, T, ease, { position: slide(0, -H) }); break;
                    case "slideDown": addTransform(L, T, ease, { position: slide(0, H) }); break;
                    case "pushLeft": addTransform(L, T, ease, { position: slide(-W, 0), scale: [100, 82, 82, 100] }); break;
                    case "pushRight": addTransform(L, T, ease, { position: slide(W, 0), scale: [100, 82, 82, 100] }); break;
                    case "stretchLeft": addTransform(L, T, ease, { position: slide(-W, 0), sw: [100, 350, 350, 100] }, { nonUniform: true }); break;
                    case "stretchRight": addTransform(L, T, ease, { position: slide(W, 0), sw: [100, 350, 350, 100] }, { nonUniform: true }); break;
                    case "spin": addTransform(L, T, ease, { rotation: [0, 180, -180, 0], scale: [100, 125, 125, 100] }); break;
                    case "spinBack": addTransform(L, T, ease, { rotation: [0, -180, 180, 0], scale: [100, 125, 125, 100] }); break;
                    case "spinZoom": addTransform(L, T, ease, { rotation: [0, 90, -90, 0], scale: [100, 260, 40, 100] }); break;
                    case "swing": addTransform(L, T, ease, { rotation: [0, 25, -25, 0], position: slide(-W, 0) }); break;
                    case "whipLeft": case "whipRight": case "whipUp": case "whipDown":
                        var wv = { whipLeft: [-W, 0], whipRight: [W, 0], whipUp: [0, -H], whipDown: [0, H] }[type];
                        addTransform(L, T, ease, { position: slide(wv[0], wv[1]) });
                        li = addEffect(L, "ADBE Motion Blur", "HAMDY Directional Blur").propertyIndex;
                        try { FX(L, li).property(1).setValue(wv[0] !== 0 ? 90 : 0); } catch (x1) {}
                        animate4(FX(L, li).property(2), T, [0, 220, 220, 0], ease);
                        break;
                    case "blurZoom":
                        addTransform(L, T, ease, { scale: [100, 135, 75, 100] });
                        li = addEffect(L, "ADBE Gaussian Blur 2", "HAMDY Blur").propertyIndex;
                        try { FX(L, li).property(3).setValue(1); } catch (x2) {}
                        animate4(FX(L, li).property(1), T, [0, 90, 90, 0], ease);
                        break;
                    case "twirl":
                        li = addEffect(L, "ADBE Twirl", "HAMDY Twirl").propertyIndex;
                        try { FX(L, li).property(2).setValue(75); FX(L, li).property(3).setValue([cx, cy]); } catch (x3) {}
                        animate4(FX(L, li).property(1), T, [0, 720, -720, 0], ease);
                        li = addEffect(L, "ADBE Gaussian Blur 2", "HAMDY Blur").propertyIndex;
                        animate4(FX(L, li).property(1), T, [0, 20, 20, 0], ease);
                        break;
                    case "warp":
                        li = addEffect(L, "ADBE Turbulent Displace", "HAMDY Warp").propertyIndex;
                        try { FX(L, li).property(3).setValue(160); } catch (x4) {}
                        animate4(FX(L, li).property(2), T, [0, 220, 220, 0], 70);
                        try { FX(L, li).property(6).expression = "time * 500"; } catch (x5) {}
                        break;
                    case "pixelate":
                        li = addEffect(L, "ADBE Mosaic", "HAMDY Pixelate").propertyIndex;
                        var vb = Math.max(2, Math.round(14 * H / W));
                        animate4(FX(L, li).property(1), T, [W, 14, 14, W], 90);
                        animate4(FX(L, li).property(2), T, [H, vb, vb, H], 90);
                        try { FX(L, li).property(3).setValue(1); } catch (x6) {}
                        break;
                    case "glitch":
                        li = addEffect(L, "ADBE Geometry2", "HAMDY Jitter").propertyIndex;
                        try { compShutterOn(FX(L, li)); } catch (x7) {}
                        FX(L, li).property(TR.position).expression = jitterExpr(W * 0.075);
                        li = addEffect(L, "ADBE Wave Warp", "HAMDY Wave").propertyIndex;
                        try { FX(L, li).property(1).setValue(2); FX(L, li).property(3).setValue(60); FX(L, li).property(4).setValue(0); FX(L, li).property(5).setValue(4); } catch (x8) {}
                        animate4(FX(L, li).property(2), T, [0, 70, 70, 0], ease);
                        break;
                    case "blockGlitch":
                        li = addEffect(L, "ADBE Mosaic", "HAMDY Blocks").propertyIndex;
                        var steps = [W, 40, W, 18, 60, 24, W], st, sv, k2;
                        for (j = 0; j < steps.length; j++) {
                            st = t0 + (t1 - t0) * j / (steps.length - 1);
                            sv = steps[j];
                            FX(L, li).property(1).setValueAtTime(st, sv);
                            FX(L, li).property(2).setValueAtTime(st, sv === W ? H : Math.max(2, Math.round(sv * H / W)));
                        }
                        for (k2 = 1; k2 <= FX(L, li).property(1).numKeys; k2++) { setHold(FX(L, li).property(1), k2); setHold(FX(L, li).property(2), k2); }
                        li = addEffect(L, "ADBE Geometry2", "HAMDY Jitter").propertyIndex;
                        try { compShutterOn(FX(L, li)); } catch (x9) {}
                        FX(L, li).property(TR.position).expression = jitterExpr(W * 0.06, 0.1);
                        break;
                    case "burn":
                        li = addEffect(L, "ADBE Brightness & Contrast 2", "HAMDY Burn").propertyIndex;
                        animate4(FX(L, li).property(1), T, [0, 150, 150, 0], ease);
                        li = addEffect(L, "ADBE Gaussian Blur 2", "HAMDY Blur").propertyIndex;
                        animate4(FX(L, li).property(1), T, [0, 35, 35, 0], ease);
                        break;
                    case "fisheye":
                        addTransform(L, T, ease, { scale: [100, 150, 70, 100] });
                        li = addEffect(L, "ADBE Optics Compensation", "HAMDY Fisheye").propertyIndex;
                        animate4(FX(L, li).property(1), T, [0, 120, 120, 0], ease);
                        break;
                    case "polar":
                        li = addEffect(L, "ADBE Polar Coordinates", "HAMDY Polar").propertyIndex;
                        animate4(FX(L, li).property(1), T, [0, 100, 100, 0], ease);
                        break;
                    case "bulge":
                        li = addEffect(L, "ADBE Bulge", "HAMDY Bulge").propertyIndex;
                        try { FX(L, li).property(1).setValue(W * 0.45); FX(L, li).property(2).setValue(W * 0.45); FX(L, li).property(3).setValue([cx, cy]); } catch (xb) {}
                        animate4(FX(L, li).property(4), T, [0, 3.5, 3.5, 0], ease);
                        addTransform(L, T, ease, { scale: [100, 125, 125, 100] });
                        break;
                    case "spherize":
                        li = addEffect(L, "ADBE Spherize", "HAMDY Spherize").propertyIndex;
                        try { FX(L, li).property(2).setValue([cx, cy]); } catch (xsp) {}
                        animate4(FX(L, li).property(1), T, [0, W * 0.7, W * 0.7, 0], ease);
                        break;
                    case "ripple":
                        li = addEffect(L, "ADBE Ripple", "HAMDY Ripple").propertyIndex;
                        try { FX(L, li).property(2).setValue([cx, cy]); FX(L, li).property(6).setValue(60); } catch (xr) {}
                        animate4(FX(L, li).property(1), T, [0, 100, 100, 0], 60);
                        break;
                    case "zoomRadial":
                        addTransform(L, T, ease, { scale: [100, 180, 55, 100] });
                        li = addEffect(L, "ADBE Radial Blur", "HAMDY Radial Blur").propertyIndex;
                        try { FX(L, li).property(2).setValue([cx, cy]); FX(L, li).property(3).setValue(2); } catch (xz) {}
                        animate4(FX(L, li).property(1), T, [0, 80, 80, 0], ease);
                        break;
                    case "spinBlur":
                        addTransform(L, T, ease, { rotation: [0, 90, -90, 0], scale: [100, 130, 130, 100] });
                        li = addEffect(L, "ADBE Radial Blur", "HAMDY Spin Blur").propertyIndex;
                        try { FX(L, li).property(2).setValue([cx, cy]); FX(L, li).property(3).setValue(1); } catch (xsb) {}
                        animate4(FX(L, li).property(1), T, [0, 35, 35, 0], ease);
                        break;
                    case "rotate90": addTransform(L, T, ease, { rotation: [0, 90, -90, 0], scale: [100, 140, 140, 100] }); break;
                    case "scrollLeft": case "scrollRight": case "scrollUp": case "scrollDown":
                        var sv = { scrollLeft: [-W, 0], scrollRight: [W, 0], scrollUp: [0, -H], scrollDown: [0, H] }[type];
                        li = addEffect(L, "ADBE Offset", "HAMDY Scroll").propertyIndex;
                        animate4(FX(L, li).property(1), T, [[cx, cy], [cx + sv[0] * 0.999, cy + sv[1] * 0.999], [cx - sv[0] * 0.999, cy - sv[1] * 0.999], [cx, cy]], ease);
                        li = addEffect(L, "ADBE Motion Blur", "HAMDY Directional Blur").propertyIndex;
                        try { FX(L, li).property(1).setValue(sv[0] !== 0 ? 90 : 0); } catch (xo) {}
                        animate4(FX(L, li).property(2), T, [0, 160, 160, 0], ease);
                        break;
                    case "blurDissolve":
                        li = addEffect(L, "ADBE Box Blur2", "HAMDY Blur").propertyIndex;
                        try { FX(L, li).property(3).setValue(1); } catch (xbd) {}
                        animate4(FX(L, li).property(1), T, [0, 70, 70, 0], 60);
                        break;
                    default: L.remove(); throw Err("UNKNOWN");
                }
        }
        // every layer this transition made lives only around the cut (never the whole comp)
        for (i = 0; i < made.length; i++) {
            try {
                var lo = Math.max(0, t0 - half * 0.5), hi = Math.min(c.duration, t1 + half * 0.5);
                if (made[i].outPoint > hi + fd / 2) { made[i].outPoint = Math.max(made[i].inPoint + fd, t1); }
                if (made[i].inPoint < lo - fd / 2) { made[i].inPoint = Math.min(made[i].outPoint - fd, t0); }
            } catch (espan) {}
        }
        if (a.sfx) {
            var wf = findWhoosh(a.libPaths);
            if (wf) {
                var it = importFile(wf);
                var A = c.layers.add(it);
                A.startTime = Math.max(0, cut - Math.min(it.duration / 2, half));
                A.moveToEnd();
                return "OK_SFX";
            }
            return "OK_NOSFX";
        }
        return "OK";
    }

    // ======================================================= motion presets
    var EZ = { smooth: [33, 70], cubic: [20, 80], expo: [5, 95], back: [40, 0], elastic: [40, 0], bounce: [70, 0] };
    function overExpr(amp, freq, decay, minN) {
        return "// HAMDY overshoot\nvar amp = " + amp + ", freq = " + freq + ", decay = " + decay + ", n = 0;\n" +
            "if (numKeys > 0) { n = nearestKey(time).index; if (key(n).time > time) n--; }\n" +
            "var t = (n == 0) ? 0 : time - key(n).time;\n" +
            "if (n > " + (minN === undefined ? 1 : minN) + " && t < 2) { var v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);\n" +
            "  value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t); } else { value; }";
    }
    function bounceExpr(g) {
        return "// HAMDY bounce\nvar e = 0.45, g = " + g + ", nMax = 6, n = 0;\n" +
            "if (numKeys > 0) { n = nearestKey(time).index; if (key(n).time > time) n--; }\n" +
            "if (n > 1) {\n  var t = time - key(n).time;\n  var v = -velocityAtTime(key(n).time - 0.001) * e;\n" +
            "  var vl = length(v), vu;\n" +
            "  if (value instanceof Array) { vu = (vl > 0) ? normalize(v) : value * 0; } else { vu = (v < 0) ? -1 : 1; }\n" +
            "  var tCur = 0, segDur = 2 * vl / g, tNext = segDur, nb = 1;\n" +
            "  while (tNext < t && nb <= nMax) { vl *= e; segDur *= e; tCur = tNext; tNext += segDur; nb++; }\n" +
            "  if (nb <= nMax) { var d = t - tCur; value + vu * d * (vl - g * d / 2); } else { value; }\n" +
            "} else { value; }";
    }
    function keyPair(prop, ta, va, tb, vb, ez, dir) {
        prop.setValueAtTime(ta, va);
        prop.setValueAtTime(tb, vb);
        var a = prop.nearestKeyIndex(ta), b = prop.nearestKeyIndex(tb);
        if (ez === "linear") { setLinear(prop, a); setLinear(prop, b); return; }
        var p = EZ[ez] || EZ.cubic, O = p[0], I = p[1], tmp;
        if (dir === "out") {
            if (ez === "back" || ez === "elastic" || ez === "bounce") { O = 85; I = 10; }
            else { tmp = O; O = I; I = tmp; }
        }
        setEase(prop, a, 33, O);
        if (dir === "in" && (ez === "back" || ez === "elastic" || ez === "bounce")) { linIn(prop, b); }
        else { setEase(prop, b, I, 33); }
    }
    function linIn(prop, k) { try { prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.BEZIER); } catch (e) {} }

    // ===================================================== timing markers
    // Like Animation Composer: a layer marker "HAMDY IN" (end of the in-animation) and "HAMDY OUT" (start of the
    // out-animation). Drag them on the layer bar and the animation stretches to match \u2014 keys stay where they are,
    // an expression re-times them.
    function setMarker(L, label, t) {
        var M = L.property("ADBE Marker"), k;
        for (k = M.numKeys; k >= 1; k--) { try { if (M.keyValue(k).comment === label) { M.removeKey(k); } } catch (e) {} }
        try { M.setValueAtTime(t, new MarkerValue(label)); } catch (e2) {}
    }
    function timingHead(dir, ref, lab) {
        if (dir === "in") {
            return "// HAMDY TIMING: drag the in-marker on the layer to change where the animation ends\n" +
                "var mL = " + ref + ", T = time, mk = null;\ntry { mk = mL.marker.key(" + q2(lab || "HAMDY IN") + "); } catch (err) { mk = null; }\n" +
                "if (mk && numKeys > 1) { var ka = key(1).time, kb = key(numKeys).time, me = Math.max(ka + thisComp.frameDuration, mk.time);\n" +
                "  if (time > ka) { T = (time < me) ? ka + (time - ka) * (kb - ka) / (me - ka) : kb + (time - me); } }\n";
        }
        return "// HAMDY TIMING: drag the out-marker on the layer to change where the animation starts\n" +
            "var mL = " + ref + ", T = time, mk = null;\ntry { mk = mL.marker.key(" + q2(lab || "HAMDY OUT") + "); } catch (err) { mk = null; }\n" +
            "if (mk && numKeys > 1) { var ka = key(1).time, kb = key(numKeys).time, ms = Math.min(mk.time, mL.outPoint - thisComp.frameDuration), oe = Math.max(ms + thisComp.frameDuration, mL.outPoint);\n" +
            "  T = (time < ms) ? ka - (ms - time) : ka + (time - ms) * (kb - ka) / (oe - ms); }\n";
    }
    function timingWrap(pr, dir, ref, lab) {
        var old = "";
        try { old = pr.expression || ""; } catch (e) {}
        if (/HAMDY TIMING/.test(old)) { return; }
        var body = old ? "var vT = valueAtTime(T);\n" + old.replace(/\.time\b/g, ".__KT__").replace(/\btime\b/g, "T").replace(/\.__KT__/g, ".time").replace(/\.value\b/g, ".__KV__").replace(/\bvalue\b/g, "vT").replace(/\.__KV__/g, ".value") : "valueAtTime(T)";
        try { pr.expression = timingHead(dir, ref, lab) + body; } catch (e2) {}
    }
    function timingWalk(P, dir, ref, lab) {
        var i, pr;
        for (i = 1; i <= P.numProperties; i++) {
            pr = P.property(i);
            if (pr.propertyType === PropertyType.PROPERTY) { try { if (pr.numKeys > 1 && pr.canSetExpression) { timingWrap(pr, dir, ref, lab); } } catch (e) {} }
            else { timingWalk(pr, dir, ref, lab); }
        }
    }
    function markTiming(L, tag, dir, t0, t1, kid) {
        if (!TIMING) { return; }
        var ref = kid ? "parent" : "thisLayer", p = parade(L), i, lab = mkLabel(dir);
        for (i = 1; i <= p.numProperties; i++) { if (p.property(i).name.indexOf(tag) === 0) { timingWalk(p.property(i), dir, ref, lab); } }
        try {
            var an = L.property("ADBE Text Properties").property("ADBE Text Animators");
            for (i = 1; i <= an.numProperties; i++) { if (an.property(i).name.indexOf(tag) === 0) { timingWalk(an.property(i), dir, ref, lab); } }
        } catch (e) {}
        if (!kid) { clearMarkers(L, MK_DIR_RE[dir]); setMarker(L, lab, dir === "in" ? t1 : t0); }
    }

    function mpApply(c, L, sp, dir, t0, t1, kid) {
        var CR = (kid && L.parent) ? L.parent : L;
        var K = c.height / 1080, ls = layerScale(CR), tr = sp.tr || {}, ez = sp.ease || "cubic";
        var tag = "HAMDY " + (dir === "in" ? "IN " : "OUT ") + sp.id;
        var center = layerCenter(CR, dir === "in" ? t1 : t0);
        function pair(prop, from, rest) {
            if (dir === "in") {
                keyPair(prop, t0, from, t1, rest, ez, "in");
                if (ez === "back") { prop.expression = overExpr(0.1, 2, 6); }
                else if (ez === "elastic") { prop.expression = overExpr(0.14, 3, 4.5); }
                else if (ez === "bounce") { prop.expression = bounceExpr(6000 * K); }
            } else {
                keyPair(prop, t0, rest, t1, from, ez, "out");
            }
        }
        var xf = has(tr, "op") || has(tr, "x") || has(tr, "y") || has(tr, "s") || has(tr, "sx") || has(tr, "sy") || has(tr, "r") || has(tr, "sk") || has(tr, "flick");
        var i, e;
        if (xf) {
            e = addEffect(L, "ADBE Geometry2", tag);
            i = e.propertyIndex;
            FX(L, i).property(1).setValue(center);
            FX(L, i).property(2).setValue(center);
            try { compShutterOn(FX(L, i)); } catch (x) {}
            if (has(tr, "sx") || has(tr, "sy")) { FX(L, i).property(3).setValue(0); }
            if (has(tr, "op") && !has(tr, "flick")) { pair(FX(L, i).property(9), tr.op, 100); }
            if (has(tr, "x") || has(tr, "y")) {
                pair(FX(L, i).property(2), [center[0] + (tr.x || 0) * K / ls[0], center[1] + (tr.y || 0) * K / ls[1]], center);
            }
            if (has(tr, "s")) { pair(FX(L, i).property(4), tr.s, 100); }
            if (has(tr, "sx")) { pair(FX(L, i).property(5), tr.sx, 100); }
            if (has(tr, "sy")) { pair(FX(L, i).property(4), tr.sy, 100); }
            if (has(tr, "r")) { pair(FX(L, i).property(8), tr.r, 0); }
            if (has(tr, "sk")) { pair(FX(L, i).property(6), tr.sk, 0); }
            if (has(tr, "flick")) {
                var fr = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1], fv = [0, 100, 0, 100, 30, 100, 100], q, tt, vv;
                for (q = 0; q < fr.length; q++) {
                    tt = dir === "in" ? t0 + (t1 - t0) * fr[q] : t1 - (t1 - t0) * fr[q];
                    vv = fv[q];
                    FX(L, i).property(9).setValueAtTime(tt, vv);
                }
                for (q = 1; q <= FX(L, i).property(9).numKeys; q++) { setHold(FX(L, i).property(9), q); }
            }
        }
        if (has(tr, "bl")) {
            i = addEffect(L, "ADBE Gaussian Blur 2", tag + " Blur").propertyIndex;
            pair(FX(L, i).property(1), tr.bl * K, 0);
        }
        if (has(tr, "db")) {
            i = addEffect(L, "ADBE Motion Blur", tag + " DirBlur").propertyIndex;
            try { FX(L, i).property(1).setValue(sp.dbDir === undefined ? 90 : sp.dbDir); } catch (x2) {}
            pair(FX(L, i).property(2), tr.db * K, 0);
        }
        if (has(tr, "wipe")) {
            i = addEffect(L, "ADBE Linear Wipe", tag + " Wipe").propertyIndex;
            try { FX(L, i).property(2).setValue(sp.wa === undefined ? 270 : sp.wa); FX(L, i).property(3).setValue((sp.feather || 0) * K); } catch (x3) {}
            pair(FX(L, i).property(1), tr.wipe, 0);
        }
        if (has(tr, "rwipe")) {
            i = addEffect(L, "ADBE Radial Wipe", tag + " Radial").propertyIndex;
            try { FX(L, i).property(3).setValue(center); FX(L, i).property(4).setValue(1); } catch (x4) {}
            pair(FX(L, i).property(1), tr.rwipe, 0);
        }
        if ((has(tr, "rx") || has(tr, "ry")) && !kid) {
            try { L.threeDLayer = true; } catch (x3d) {}
            var tgx = L.property("ADBE Transform Group");
            if (has(tr, "rx")) { var rxp = tgx.property("ADBE Rotate X"), rxv = rxp.value; pair(rxp, rxv + tr.rx, rxv); }
            if (has(tr, "ry")) { var ryp = L.property("ADBE Transform Group").property("ADBE Rotate Y"), ryv = ryp.value; pair(ryp, ryv + tr.ry, ryv); }
        }
        if (has(tr, "cc") && sp.cc) {
            i = addEffect(L, sp.cc, tag + " Wipe").propertyIndex;
            pair(FX(L, i).property(1), tr.cc, 0);
        }
        if (has(tr, "block")) {
            i = addEffect(L, "ADBE Block Dissolve", tag + " Blocks").propertyIndex;
            try { FX(L, i).property(2).setValue(24 * K); FX(L, i).property(3).setValue(24 * K); } catch (xbk) {}
            pair(FX(L, i).property(1), tr.block, 0);
        }
        if (has(tr, "luma")) {
            i = addEffect(L, "ADBE Gradient Wipe", tag + " Luma").propertyIndex;
            try { FX(L, i).property(2).setValue(40); } catch (xl) {}
            pair(FX(L, i).property(1), tr.luma, 0);
        }
        if (has(tr, "blinds")) {
            i = addEffect(L, "ADBE Venetian Blinds", tag + " Blinds").propertyIndex;
            try { FX(L, i).property(3).setValue(30 * K); } catch (x5) {}
            pair(FX(L, i).property(1), tr.blinds, 0);
        }
    }

    function mpEmph(c, L, sp, t0, dur, kid) {
        var CR = (kid && L.parent) ? L.parent : L;
        var K = c.height / 1080, ls = layerScale(CR), keys = sp.keys || {}, center = layerCenter(CR, t0);
        var i = addEffect(L, "ADBE Geometry2", "HAMDY FX " + sp.id).propertyIndex;
        FX(L, i).property(1).setValue(center);
        FX(L, i).property(2).setValue(center);
        try { compShutterOn(FX(L, i)); } catch (x) {}
        if (keys.sx || keys.sy) { FX(L, i).property(3).setValue(0); }
        function put(idx, list, fn) {
            var times = [], vals = [], q;
            for (q = 0; q < list.length; q++) { times.push(t0 + list[q][0] * dur); vals.push(fn(list[q][1])); }
            keysAt(FX(L, i).property(idx), times, vals, 55, 55);
        }
        function id(v) { return v; }
        if (keys.s) { put(4, keys.s, id); }
        if (keys.sy) { put(4, keys.sy, id); }
        if (keys.sx) { put(5, keys.sx, id); }
        if (keys.r) { put(8, keys.r, id); }
        if (keys.op) { put(9, keys.op, id); }
        if (keys.x) { put(2, keys.x, function (v) { return [center[0] + v * K / ls[0], center[1]]; }); }
        if (keys.y) { put(2, keys.y, function (v) { return [center[0], center[1] + v * K / ls[1]]; }); }
    }

    function mpLoop(c, L, sp, kid) {
        var ex = sp.ex || {}, center = layerCenter((kid && L.parent) ? L.parent : L, c.time);
        var i = addEffect(L, "ADBE Geometry2", "HAMDY LOOP " + sp.id).propertyIndex;
        FX(L, i).property(1).setValue(center);
        FX(L, i).property(2).setValue(center);
        try { compShutterOn(FX(L, i)); } catch (x) {}
        if (ex.sx || ex.sy) { FX(L, i).property(3).setValue(0); }
        if (ex.pos) { FX(L, i).property(2).expression = ex.pos; }
        if (ex.s) { FX(L, i).property(4).expression = ex.s; }
        if (ex.sy) { FX(L, i).property(4).expression = ex.sy; }
        if (ex.sx) { FX(L, i).property(5).expression = ex.sx; }
        if (ex.r) { FX(L, i).property(8).expression = ex.r; }
        if (ex.op) { FX(L, i).property(9).expression = ex.op; }
        if (ex.sk) { FX(L, i).property(6).expression = ex.sk; }
    }

    function motion(a) {
        var c = comp(), sel = needSel(c), sp = a.spec, d = Math.max(2, a.frames || 18) * c.frameDuration, n = 0, j, L, t;
        t = snap(c, c.time);
        for (j = 0; j < sel.length; j++) {
            L = sel[j];
            if (!animatable(L)) { continue; }
            var grp = [L].concat(styleKids(c, L)), g, G;
            for (g = 0; g < grp.length; g++) {
                G = grp[g];
                if (sp.kind === "loop") { mpLoop(c, G, sp, g > 0); }
                else if (sp.kind === "emph") { mpEmph(c, G, sp, t, d, g > 0); }
                else {
                    if (a.dir === "in" || a.dir === "both") {
                        var s0 = a.at === "playhead" ? t : L.inPoint;
                        mpApply(c, G, sp, "in", s0, Math.min(L.outPoint, s0 + d), g > 0);
                        markTiming(G, "HAMDY IN " + sp.id, "in", s0, Math.min(L.outPoint, s0 + d), g > 0);
                    }
                    if (a.dir === "out" || a.dir === "both") {
                        var e1 = (a.at === "playhead" && a.dir === "out") ? t : L.outPoint;
                        mpApply(c, G, sp, "out", Math.max(L.inPoint, e1 - d), e1, g > 0);
                        markTiming(G, "HAMDY OUT " + sp.id, "out", Math.max(L.inPoint, e1 - d), e1, g > 0);
                    }
                }
            }
            n++;
        }
        if (!n) { throw Err("NO_ANIM_LAYER"); }
        return "OK";
    }

    function clearNabd() {
        var c = comp(), sel = needSel(c), j, i, p, n = 0;
        for (j = 0; j < sel.length; j++) {
            try {
                p = parade(sel[j]);
                for (i = p.numProperties; i >= 1; i--) { if (/^(?:NABD|HAMDY) /.test(p.property(i).name)) { p.property(i).remove(); n++; } }
            } catch (e) {}
            if (sel[j] instanceof TextLayer) {
                var an = sel[j].property("ADBE Text Properties").property("ADBE Text Animators");
                for (i = an.numProperties; i >= 1; i--) { if (/^(?:NABD|HAMDY) /.test(an.property(i).name)) { an.property(i).remove(); n++; } }
            }
        }
        return n ? "OK" : "OK_NOTHING";
    }

    // ================================================================ text
    function layerText(L) {
        try { return String(L.property("ADBE Text Properties").property("ADBE Text Document").value.text); } catch (e) { return ""; }
    }
    function addTextAnim(L, sp, isOut, t0, t1, based) {
        if (sp.three) { try { L.threeDPerChar = true; } catch (e3d) {} }
        var animators = L.property("ADBE Text Properties").property("ADBE Text Animators");
        animators.addProperty("ADBE Text Animator");
        var idx = animators.numProperties, i, pr, v;
        function A() { return L.property("ADBE Text Properties").property("ADBE Text Animators").property(idx); }
        A().name = "HAMDY " + (sp.loop ? "LOOP " : (isOut ? "OUT " : "IN ")) + sp.id;
        var props = sp.props || [];
        for (i = 0; i < props.length; i++) { A().property("ADBE Text Animator Properties").addProperty(props[i][0]); }
        for (i = 0; i < props.length; i++) {
            pr = A().property("ADBE Text Animator Properties").property(props[i][0]);
            v = props[i][1];
            try { pr.setValue(v); }
            catch (e) {
                if (v instanceof Array && v.length === 3) { try { pr.setValue([v[0], v[1]]); } catch (e2) {} }
                else if (v instanceof Array && v.length === 4) { try { pr.setValue([v[0], v[1], v[2]]); } catch (e3) {} }
            }
        }
        if (sp.loop === "wiggle") {
            A().property("ADBE Text Selectors").addProperty("ADBE Text Wiggly Selector");
            try { A().property("ADBE Text Selectors").property(1).property("ADBE Text Range Type2").setValue(based); } catch (ew) {}
            if (sp.wig) { try { A().property("ADBE Text Selectors").property(1).property("ADBE Text Temporal Freq").setValue(sp.wig); } catch (ewf) {} }
            return;
        }
        if (sp.loop === "expr" && sp.amt) {
            A().property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
            try { A().property("ADBE Text Selectors").property(1).property("ADBE Text Range Type2").setValue(based); } catch (ex1) {}
            A().property("ADBE Text Selectors").property(1).property("ADBE Text Expressible Amount").expression = sp.amt + "\n[v, v, v]";
            return;
        }
        if (sp.loop === "hue") {
            A().property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
            A().property("ADBE Text Animator Properties").property("ADBE Text Fill Color").expression = "hslToRgb([(time * 0.25) % 1, 0.85, 0.6, 1])";
            A().property("ADBE Text Selectors").addProperty("ADBE Text Selector");
            return;
        }
        if (!sp.loop && !sp.square && sp.pattern && sp.pattern !== "normal") {
            A().property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
            var es = A().property("ADBE Text Selectors").property(1);
            try { es.property("ADBE Text Range Type2").setValue(based); } catch (eb) {}
            var D0 = Math.max(0.05, t1 - t0);
            var pl = { reverse: "pos = 1 - pos;", center: "pos = Math.abs(pos - 0.5) * 2;", edges: "pos = 1 - Math.abs(pos - 0.5) * 2;", shuffle: "seedRandom(i + 7, true); pos = random();" }[sp.pattern] || "";
            es.property("ADBE Text Expressible Amount").expression =
                "var D = " + D0.toFixed(4) + ", T0 = " + (isOut ? "outPoint - D" : "inPoint") + ", s = 0.65;\n" +
                "var n = textTotal, i = textIndex - 1, pos = n > 1 ? i / (n - 1) : 0;\n" + pl + "\n" +
                "var u = clamp(((time - T0) / D) * (1 + s) - s * pos, 0, 1);\n" +
                "var v = " + (isOut ? "Math.pow(u, 3) * 100" : "Math.pow(1 - u, 3) * 100") + ";\n[v, v, v]";
            return;
        }
        A().property("ADBE Text Selectors").addProperty("ADBE Text Selector");
        var sel = A().property("ADBE Text Selectors").property(1);
        var adv = sel.property("ADBE Text Range Advanced");
        try { adv.property("ADBE Text Range Type2").setValue(based); } catch (e4) {}
        if (sp.random) { try { adv.property("ADBE Text Randomize Order").setValue(1); } catch (e5) {} }
        if (sp.loop === "wave") {
            try { adv.property("ADBE Text Range Shape").setValue(5); } catch (e6) {}
            sel.property("ADBE Text Percent End").setValue(25);
            sel.property("ADBE Text Percent Offset").expression = "((time * 70) % 125) - 25";
            return;
        }
        var key;
        if (sp.square) {
            try { adv.property("ADBE Text Range Shape").setValue(1); } catch (e7) {}
            key = isOut ? sel.property("ADBE Text Percent End") : sel.property("ADBE Text Percent Start");
            key.setValueAtTime(t0, 0);
            key.setValueAtTime(t1, 100);
            for (i = 1; i <= key.numKeys; i++) { setLinear(key, i); }
        } else {
            try { adv.property("ADBE Text Range Shape").setValue(isOut ? 3 : 2); } catch (e8) {}
            key = sel.property("ADBE Text Percent Offset");
            key.setValueAtTime(t0, -100);
            key.setValueAtTime(t1, 100);
            setEase(key, key.nearestKeyIndex(t0), 33, sp.overshoot && !isOut ? 40 : 70);
            if (sp.overshoot && !isOut) { linIn(key, key.nearestKeyIndex(t1)); key.expression = overExpr(0.1, 2.5, 6); }
            else { setEase(key, key.nearestKeyIndex(t1), 70, 33); }
        }
    }
    function applyText(L, c, a) {
        var sp = a.spec;
        if (!sp) { throw Err("UNKNOWN"); }
        var based;
        if (a.based === "chars") { based = 1; }
        else if (a.based === "words") { based = 3; }
        else if (a.based === "lines") { based = 4; }
        else { based = /[\u0600-\u06ff]/.test(layerText(L)) ? 3 : 1; }
        var d = Math.max(2, a.frames || 20) * c.frameDuration;
        try { L.property("ADBE Text Properties").property("ADBE Text More Options").property("ADBE Text Anchor Point Align").setValue([0, -50]); } catch (e) {}
        if (sp.loop) { addTextAnim(L, sp, false, 0, 0, based); return; }
        if (sp.src || sp.tw) { typeApply(L, c, sp, a); return; }
        var kidT = false;
        try { kidT = /^(?:NABD|HAMDY) STYLE/.test(L.name) && !!L.parent; } catch (ek) {}
        var hasAnim = !(sp.fx && sp.fx.length && !(sp.props && sp.props.length));
        if (a.doIn) { if (hasAnim) { addTextAnim(L, sp, false, L.inPoint, Math.min(L.outPoint, L.inPoint + d), based); } textFx(L, sp, "in", L.inPoint, Math.min(L.outPoint, L.inPoint + d)); markTiming(L, "HAMDY IN " + sp.id, "in", L.inPoint, Math.min(L.outPoint, L.inPoint + d), kidT); }
        if (a.doOut) { if (hasAnim) { addTextAnim(L, sp, true, Math.max(L.inPoint, L.outPoint - d), L.outPoint, based); } textFx(L, sp, "out", Math.max(L.inPoint, L.outPoint - d), L.outPoint, !!a.doIn); markTiming(L, "HAMDY OUT " + sp.id, "out", Math.max(L.inPoint, L.outPoint - d), L.outPoint, kidT); }
    }
    // effect-based text animation: sp.fx = [{m: matchName, k: [[idx, from, rest]], s: [[idx, value]], x: [[idx, expr]]}]
    function textFx(L, sp, dir, t0, t1, hadIn) {
        if (!sp.fx || !sp.fx.length) { return; }
        var tag = "HAMDY " + (dir === "in" ? "IN " : "OUT ") + sp.id, i, j, e, ix, f, pr;
        for (i = 0; i < sp.fx.length; i++) {
            f = sp.fx[i];
            if (f.once && dir === "out" && hadIn) { continue; }
            try { e = addEffect(L, f.m, tag + " fx" + i); } catch (ea) { continue; }
            ix = e.propertyIndex;
            for (j = 0; f.s && j < f.s.length; j++) { try { FX(L, ix).property(f.s[j][0]).setValue(f.s[j][1]); } catch (es) {} }
            for (j = 0; f.x && j < f.x.length; j++) { try { FX(L, ix).property(f.x[j][0]).expression = f.x[j][1]; } catch (ex) {} }
            for (j = 0; f.k && j < f.k.length; j++) {
                try {
                    pr = FX(L, ix).property(f.k[j][0]);
                    if (dir === "in") { keyPair(pr, t0, f.k[j][1], t1, f.k[j][2], f.ez || "cubic", "in"); }
                    else { keyPair(pr, t0, f.k[j][2], t1, f.k[j][1], f.ez || "cubic", "out"); }
                } catch (ek) {}
            }
        }
    }
    function makeText(c, str, size, col, just, font, trk) {
        var L = c.layers.addText(String(str).replace(/\r\n|\n/g, "\r"));
        var tdp = L.property("ADBE Text Properties").property("ADBE Text Document");
        var d = tdp.value;
        d.fontSize = size;
        d.applyFill = true;
        d.applyStroke = false;
        d.fillColor = col;
        d.justification = just === "r" ? ParagraphJustification.RIGHT_JUSTIFY : (just === "l" ? ParagraphJustification.LEFT_JUSTIFY : ParagraphJustification.CENTER_JUSTIFY);
        if (trk) { try { d.tracking = trk; } catch (et) {} }
        if (font) { try { d.font = font; } catch (ef) {} }
        tdp.setValue(d);
        return L;
    }
    function textCreate(a) {
        var c = comp();
        if (!a.text) { throw Err("NO_TEXT"); }
        var L = makeText(c, a.text, a.size || 110, [1, 1, 1], "c", a.font, 0);
        L.inPoint = snap(c, c.time);
        L.outPoint = Math.min(c.duration, L.inPoint + Math.max(0.5, a.secs || 3));
        centerAnchor(L, L.inPoint);
        L.property("ADBE Transform Group").property("ADBE Position").setValue([c.width / 2, c.height / 2]);
        applyText(L, c, a);
        return "OK";
    }
    function textApply(a) {
        var c = comp(), sel = c.selectedLayers, n = 0, j;
        var kids, q;
        for (j = 0; j < sel.length; j++) {
            if (!(sel[j] instanceof TextLayer)) { continue; }
            applyText(sel[j], c, a); n++;
            if (!(a.spec && a.spec.src)) {
                kids = styleKids(c, sel[j]);
                for (q = 0; q < kids.length; q++) { if (kids[q] instanceof TextLayer) { applyText(kids[q], c, a); } }
            }
        }
        if (!n) { throw Err("NO_TEXT_LAYER"); }
        return "OK";
    }

    // ============================================================== titles
    function anchorTo(L, t, fx, fy) {
        var r = layerRect(L, t);
        if (!r) { return; }
        L.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([r.left + r.width * fx, r.top + r.height * fy]);
    }
    function q(s) { return String(s).replace(/\\/g, "\\\\").replace(/"/g, "\\\""); }

    function titleBuild(a) {
        var c = comp(), K = c.height / 1080, W = c.width, H = c.height, fd = c.frameDuration;
        var t0 = snap(c, c.time), t1 = Math.min(c.duration, t0 + Math.max(1, a.secs || 4));
        if (t1 - t0 < 0.5) { throw Err("NO_ROOM"); }
        var acc = rgb(a.acc, [1, 0.42, 0.24]), mirror = (a.place === "lower" && a.side === "l");
        var origin;
        if (a.place === "lower") { origin = a.side === "l" ? [W * 0.08, H * 0.82] : (a.side === "c" ? [W / 2, H * 0.82] : [W * 0.92, H * 0.82]); }
        else if (a.place === "top") { origin = [W / 2, H * 0.2]; }
        else { origin = [W / 2, H / 2]; }
        if (a.place === "lower" && a.side === "c") { mirror = false; }
        var N = c.layers.addNull();
        N.name = "HAMDY TITLE | " + a.name;
        N.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, 0]);
        N.property("ADBE Transform Group").property("ADBE Position").setValue(origin);
        span(N, t0, t1);
        var uid = a.uid, parts = a.parts, i, p, L, gi, x, y, al, col, names = {}, si;
        function C(v) { return v === "acc" ? acc : (v ? hex(v) : [1, 1, 1]); }
        function hex(h) { h = String(h).replace("#", ""); if (h.length === 3) { h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2); } return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255]; }
        function pos(L2, px, py) {
            L2.parent = N;
            L2.property("ADBE Transform Group").property("ADBE Position").setValue([px * K, py * K]);
        }
        function anim(L2, part) {
            var dIn, dOut, s0, e1;
            if (part.inSpec) {
                dIn = part.inSpec.frames / 30; s0 = t0 + (part.inSpec.delay || 0) / 30;
                mpApply(c, L2, part.inSpec.spec, "in", s0, Math.min(t1, s0 + dIn));
            }
            if (part.outSpec) {
                dOut = part.outSpec.frames / 30; e1 = t1 - (part.outSpec.delay || 0) / 30;
                mpApply(c, L2, part.outSpec.spec, "out", Math.max(t0, e1 - dOut), e1);
            }
        }
        for (i = 0; i < parts.length; i++) {
            p = parts[i];
            x = (p.x || 0) * (mirror ? -1 : 1);
            y = p.y || 0;
            al = p.align || "c";
            if (mirror && al === "r") { al = "l"; } else if (mirror && al === "l") { al = "r"; }
            col = C(p.c);
            if (p.t === "text") {
                var str = p.raw ? p.raw : (a.texts[String(p.key)] || " ");
                L = makeText(c, str, (p.size || 80) * K, col, al, a.font, p.trk || 0);
                L.name = "HAMDY " + uid + " " + (p.raw ? ("raw" + i) : p.key);
                names[String(p.key)] = L.name;
                span(L, t0, t1);
                anchorTo(L, t0, al === "r" ? 1 : (al === "l" ? 0 : 0.5), 0.5);
                pos(L, x, y);
                if (p.expr) { L.property("ADBE Text Properties").property("ADBE Text Document").expression = p.expr.replace(/__T0__/g, String((p.exprDelay || 0) / 30)); }
                if (p.glow) {
                    var gl = addEffect(L, "ADBE Glo2", "HAMDY Glow").propertyIndex;
                    try { FX(L, gl).property(3).setValue(40 * K); FX(L, gl).property(4).setValue(1.6); } catch (eg) {}
                }
                if (p.ticker) {
                    anchorTo(L, t0, 0, 0.5);
                    L.property("ADBE Transform Group").property("ADBE Position").expression =
                        "var k = thisComp.height / 1080, w = sourceRectAtTime(time, false).width;\n" +
                        "value + [thisComp.width * 0.6 - ((time - inPoint) * 220 * k) % (w + thisComp.width * 1.2), 0];";
                }
                anim(L, p);
                if (p.loopSpec) { mpLoop(c, L, p.loopSpec); }
            } else if (p.t === "rect" || p.t === "bar") {
                L = shapeLayer(c, "HAMDY " + uid + " " + p.t + i, [0, 0]);
                span(L, t0, t1);
                gi = addGroup(L, p.t);
                var w = p.w * K, h = p.h * K, rx = 0;
                if (al === "r") { rx = -w / 2; } else if (al === "l") { rx = w / 2; }
                sRect(L, gi, w, h, [rx, 0], (p.r || 0) * K);
                sFill(L, gi, col);
                if (p.t === "bar") {
                    GT(L, gi).property("ADBE Vector Anchor").setValue([-w / 2, 0]);
                    GT(L, gi).property("ADBE Vector Position").setValue([-w / 2, 0]);
                    var sc = GT(L, gi).property("ADBE Vector Scale"), pct = Math.max(0, Math.min(100, parseFloat(a.texts.pct) || 0));
                    keysAt(sc, [t0 + 0.4, t0 + 1.6], [[0, 100], [pct, 100]], 75, 75);
                    var oc = L.property("ADBE Transform Group").property("ADBE Opacity");
                    keysAt(oc, [t1 - 0.4, t1], [100, 0], 33, 33);
                }
                pos(L, x, y);
                anim(L, p);
            } else if (p.t === "circle") {
                L = shapeLayer(c, "HAMDY " + uid + " circle" + i, [0, 0]);
                span(L, t0, t1);
                gi = addGroup(L, "circle");
                sEllipse(L, gi, p.d * K);
                if (p.stroke) { sStroke(L, gi, col, p.stroke * K, true); } else { sFill(L, gi, col); }
                pos(L, x, y);
                anim(L, p);
            } else if (p.t === "box") {
                L = shapeLayer(c, "HAMDY " + uid + " box" + i, [0, 0]);
                span(L, t0, t1);
                gi = addGroup(L, "box");
                si = sRect(L, gi, 100, 100, [0, 0], (p.r || 6) * K);
                sFill(L, gi, col);
                var tn = "HAMDY " + uid + " " + p.fit, px = (p.pad ? p.pad[0] : 30) * K * 2, py = (p.pad ? p.pad[1] : 14) * K * 2;
                pos(L, x, y);
                var lref = "thisComp.layer(\"" + q(tn) + "\")";
                L.property("ADBE Transform Group").property("ADBE Position").expression = lref + ".transform.position";
                L.property("ADBE Transform Group").property("ADBE Anchor Point").expression = lref + ".transform.anchorPoint";
                GP(L, gi, si).property("ADBE Vector Rect Size").expression = "var r = " + lref + ".sourceRectAtTime(time, false);\n[r.width + " + px + ", r.height + " + py + "];";
                GP(L, gi, si).property("ADBE Vector Rect Position").expression = "var r = " + lref + ".sourceRectAtTime(time, false);\n[r.left + r.width / 2, r.top + r.height / 2];";
                anim(L, p);
            }
        }
        return "OK";
    }

    // ============================================================ elements
    function elBuild(a) {
        var c = comp(), K = c.height / 1080, W = c.width, H = c.height, cx = W / 2, cy = H / 2;
        var t0 = snap(c, c.time), t1 = Math.min(c.duration, t0 + Math.max(1, a.secs || 4));
        var acc = rgb(a.acc, [1, 0.42, 0.24]), id = a.id, L, gi, ti, i, j, top = topSelected(c);
        var name = "HAMDY EL | " + id;
        function done(lay) { span(lay, t0, t1); if (top) { try { lay.moveBefore(top); } catch (e) {} } return lay; }
        function trimDraw(lay, g, tIdx, inDur, outStart) {
            var tp = GP(lay, g, tIdx);
            keysAt(tp.property("ADBE Vector Trim End"), [t0, t0 + inDur], [0, 100], 85, 20);
            if (outStart !== undefined) { keysAt(GP(lay, g, tIdx).property("ADBE Vector Trim Start"), [outStart, Math.min(t1, outStart + inDur)], [0, 100], 85, 20); }
        }
        function solid(col, nm) { return done(c.layers.addSolid(col, name + (nm ? " " + nm : ""), W, H, c.pixelAspect, c.duration)); }
        var tg;
        switch (id) {
            case "burst":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "rays");
                sPath(L, gi, [[0, -70 * K], [0, -160 * K]], false);
                ti = sTrim(L, gi);
                sStroke(L, gi, acc, 12 * K, true);
                sRepeater(L, gi, 8, [0, 0], 45);
                keysAt(GP(L, gi, ti).property("ADBE Vector Trim End"), [t0, t0 + 0.3], [0, 100], 80, 30);
                keysAt(GP(L, gi, ti).property("ADBE Vector Trim Start"), [t0 + 0.15, t0 + 0.5], [0, 100], 60, 30);
                break;
            case "ringPop":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "ring");
                ti = sEllipse(L, gi, 0);
                var sk = sStroke(L, gi, acc, 26 * K, false);
                keysAt(GP(L, gi, ti).property("ADBE Vector Ellipse Size"), [t0, t0 + 0.6], [[0, 0], [420 * K, 420 * K]], 85, 10);
                keysAt(GP(L, gi, sk).property("ADBE Vector Stroke Width"), [t0, t0 + 0.6], [30 * K, 0], 85, 10);
                break;
            case "underline":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "line");
                sPath(L, gi, [[-260 * K, 0], [260 * K, -10 * K]], false, [[0, 0], [-120 * K, 20 * K]], [[120 * K, 14 * K], [0, 0]]);
                ti = sTrim(L, gi);
                sStroke(L, gi, acc, 16 * K, true);
                trimDraw(L, gi, ti, 0.5, t1 - 0.5);
                break;
            case "arrow":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "arrow");
                sPath(L, gi, [[-200 * K, 80 * K], [150 * K, -60 * K]], false, [[0, 0], [-80 * K, 120 * K]], [[60 * K, -160 * K], [0, 0]]);
                sPath(L, gi, [[90 * K, -90 * K], [150 * K, -60 * K], [110 * K, 0]], false);
                ti = sTrim(L, gi);
                sStroke(L, gi, acc, 14 * K, true);
                try { GP(L, gi, ti).property("ADBE Vector Trim Type").setValue(2); } catch (e1) {}
                trimDraw(L, gi, ti, 0.6, t1 - 0.5);
                break;
            case "scribble":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "scribble");
                var pts = [], ang, rr;
                for (i = 0; i <= 70; i++) {
                    ang = -Math.PI / 2 + i / 70 * Math.PI * 2.15;
                    rr = 1 + 0.06 * Math.sin(i * 0.9) + i * 0.0012;
                    pts.push([Math.cos(ang) * 280 * K * rr, Math.sin(ang) * 150 * K * rr]);
                }
                sPath(L, gi, pts, false);
                ti = sTrim(L, gi);
                sStroke(L, gi, acc, 10 * K, true);
                trimDraw(L, gi, ti, 0.8, t1 - 0.6);
                break;
            case "check":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "check");
                sPath(L, gi, [[-110 * K, 0], [-30 * K, 80 * K], [130 * K, -90 * K]], false);
                ti = sTrim(L, gi);
                sStroke(L, gi, acc, 26 * K, true);
                trimDraw(L, gi, ti, 0.45);
                break;
            case "sparkle":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "star");
                var s1 = 120 * K, s2 = 22 * K;
                sPath(L, gi, [[0, -s1], [s2, -s2], [s1, 0], [s2, s2], [0, s1], [-s2, s2], [-s1, 0], [-s2, -s2]], true);
                sFill(L, gi, acc);
                tg = L.property("ADBE Transform Group");
                keysAt(tg.property("ADBE Scale"), [t0, t0 + 0.35], [[0, 0], [100, 100]], 40, 40);
                linIn(tg.property("ADBE Scale"), 2);
                tg.property("ADBE Scale").expression = overExpr(0.12, 2.5, 6);
                keysAt(tg.property("ADBE Rotate Z"), [t0, t0 + 0.8], [-90, 0], 10, 90);
                break;
            case "highlight":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "bar");
                sRect(L, gi, 560 * K, 90 * K, [0, 0], 8 * K);
                sFill(L, gi, acc, 75);
                GT(L, gi).property("ADBE Vector Anchor").setValue([-280 * K, 0]);
                GT(L, gi).property("ADBE Vector Position").setValue([-280 * K, 0]);
                keysAt(GT(L, gi).property("ADBE Vector Scale"), [t0, t0 + 0.45], [[0, 100], [100, 100]], 10, 85);
                break;
            case "dots":
                L = done(shapeLayer(c, name));
                for (j = 0; j < 3; j++) {
                    gi = addGroup(L, "dot " + (j + 1));
                    sEllipse(L, gi, 40 * K, [(j - 1) * 70 * K, 0]);
                    sFill(L, gi, acc);
                    GT(L, gi).property("ADBE Vector Position").expression = "var k = thisComp.height / 1080;\nvalue + [0, -Math.abs(Math.sin((time * 1.6 - " + (j * 0.18) + ") * Math.PI)) * 40 * k];";
                }
                break;
            case "plus":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "plus");
                sRect(L, gi, 160 * K, 40 * K, [0, 0], 8 * K);
                sRect(L, gi, 40 * K, 160 * K, [0, 0], 8 * K);
                sFill(L, gi, acc);
                tg = L.property("ADBE Transform Group");
                keysAt(tg.property("ADBE Scale"), [t0, t0 + 0.3], [[0, 0], [100, 100]], 40, 40);
                linIn(tg.property("ADBE Scale"), 2);
                tg.property("ADBE Scale").expression = overExpr(0.12, 2.5, 6);
                tg.property("ADBE Rotate Z").expression = "(time - inPoint) * 90";
                break;
            case "gradientBg":
                var gBase = solid([0, 0, 0], "base");
                ti = rampFx(gBase, [0, 0], acc, [W, H], [0.12, 0.06, 0.25], 1);
                FX(gBase, ti).property(1).expression = "[thisComp.width * (0.3 + 0.3 * Math.sin(time * 0.6)), thisComp.height * (0.2 + 0.2 * Math.cos(time * 0.4))]";
                FX(gBase, ti).property(3).expression = "[thisComp.width * (0.7 + 0.3 * Math.cos(time * 0.5)), thisComp.height * (0.8 + 0.2 * Math.sin(time * 0.7))]";
                L = solid([0, 0, 0], "glow");
                L.blendingMode = BlendingMode.SCREEN;
                ti = rampFx(L, [cx, cy], [0.35, 0.25, 0.9], [cx + H * 0.7, cy], [0, 0, 0], 2);
                FX(L, ti).property(1).expression = "[thisComp.width * (0.5 + 0.35 * Math.sin(time * 0.45)), thisComp.height * (0.5 + 0.3 * Math.cos(time * 0.55))]";
                FX(L, ti).property(3).expression = "effect(\"HAMDY Ramp\")(1) + [thisComp.height * 0.7, 0]";
                L.moveToEnd();
                gBase.moveToEnd();
                break;
            case "gridBg":
                var gBg = solid([0.07, 0.07, 0.08], "bg");
                L = done(shapeLayer(c, name + " lines"));
                var step = 80 * K;
                gi = addGroup(L, "vertical");
                sPath(L, gi, [[-cx, -cy], [-cx, cy]], false);
                sStroke(L, gi, [1, 1, 1], 1.5 * K, false, 14);
                sRepeater(L, gi, Math.ceil(W / step) + 1, [step, 0]);
                gi = addGroup(L, "horizontal");
                sPath(L, gi, [[-cx, -cy], [cx, -cy]], false);
                sStroke(L, gi, [1, 1, 1], 1.5 * K, false, 14);
                sRepeater(L, gi, Math.ceil(H / step) + 1, [0, step]);
                L.moveToEnd();
                gBg.moveToEnd();
                break;
            case "spotBg":
                L = solid([0, 0, 0], "");
                ti = rampFx(L, [cx, cy], [0.24, 0.24, 0.3], [cx + H * 0.8, cy], [0.02, 0.02, 0.03], 2);
                FX(L, ti).property(1).expression = "value + [Math.sin(time * 0.5) * thisComp.width * 0.05, Math.cos(time * 0.4) * thisComp.height * 0.04]";
                L.moveToEnd();
                break;
            case "grain":
                L = solid([0.5, 0.5, 0.5], "");
                ti = addEffect(L, "ADBE Noise", "HAMDY Noise").propertyIndex;
                try { FX(L, ti).property(1).setValue(100); FX(L, ti).property(2).setValue(0); } catch (e2) {}
                L.blendingMode = BlendingMode.OVERLAY;
                L.property("ADBE Transform Group").property("ADBE Opacity").setValue(30);
                break;
            case "vignette":
                L = solid([0, 0, 0], "");
                var m = L.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
                m.property("ADBE Mask Shape").setValue(ellipseShape(cx, cy, W * 0.62, H * 0.62));
                L.property("ADBE Mask Parade").property(1).inverted = true;
                L.property("ADBE Mask Parade").property(1).property("ADBE Mask Feather").setValue([H * 0.45, H * 0.45]);
                L.property("ADBE Transform Group").property("ADBE Opacity").setValue(70);
                break;
            case "leakLoop":
                var lc = [[1, 0.5, 0.15], [1, 0.2, 0.45]];
                for (j = 0; j < 2; j++) {
                    L = solid([0, 0, 0], "leak " + (j + 1));
                    L.blendingMode = BlendingMode.SCREEN;
                    ti = rampFx(L, [cx, cy], lc[j], [cx + H * 0.6, cy], [0, 0, 0], 2);
                    FX(L, ti).property(1).expression = "seedRandom(" + (j + 3) + ", true);\n[thisComp.width * " + (j ? 0.75 : 0.2) + ", thisComp.height * 0.4] + wiggle(0.25, thisComp.width * 0.3) - value";
                    FX(L, ti).property(3).expression = "effect(\"HAMDY Ramp\")(1) + [thisComp.height * 0.6, 0]";
                    L.property("ADBE Transform Group").property("ADBE Opacity").setValue(65);
                }
                break;
            case "scanlines":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "lines");
                sRect(L, gi, W, 2 * K, [0, -cy]);
                sFill(L, gi, [0, 0, 0], 100);
                sRepeater(L, gi, Math.ceil(H / (6 * K)) + 1, [0, 6 * K]);
                L.property("ADBE Transform Group").property("ADBE Opacity").setValue(35);
                break;
            case "letterbox":
                L = done(shapeLayer(c, name));
                var bh = Math.max(0, (H - W / 2.35) / 2);
                if (bh < 4) { bh = H * 0.12; }
                for (j = 0; j < 2; j++) {
                    gi = addGroup(L, j ? "bottom" : "top");
                    sRect(L, gi, W + 10, bh, [0, j ? cy - bh / 2 : -cy + bh / 2]);
                    sFill(L, gi, [0, 0, 0]);
                    keysAt(GT(L, gi).property("ADBE Vector Position"), [t0, t0 + 0.6], [[0, j ? bh : -bh], [0, 0]], 10, 85);
                }
                break;
            case "confetti":
                L = done(shapeLayer(c, name));
                var pal = [acc, [1, 1, 1], [1, 0.85, 0.2], [0.25, 0.8, 1], [1, 0.35, 0.6]];
                for (j = 0; j < 28; j++) {
                    gi = addGroup(L, "piece " + (j + 1));
                    sRect(L, gi, (j % 3 ? 22 : 14) * K, (j % 3 ? 12 : 26) * K);
                    sFill(L, gi, pal[j % pal.length]);
                    GT(L, gi).property("ADBE Vector Position").expression =
                        "var k = thisComp.height / 1080; seedRandom(" + (j + 1) + ", true);\n" +
                        "var a = random(0, Math.PI * 2), v = random(500, 1150) * k, t = Math.max(0, time - inPoint), g = 1500 * k;\n" +
                        "[Math.cos(a) * v * t * 0.75, Math.sin(a) * v * t * 0.75 - 700 * k * t + 0.5 * g * t * t];";
                    GT(L, gi).property("ADBE Vector Rotation").expression = "seedRandom(" + (j + 1) + ", true);\nrandom(-1, 1) * (time - inPoint) * 600;";
                }
                keysAt(L.property("ADBE Transform Group").property("ADBE Opacity"), [t0 + 1.4, t0 + 2.2], [100, 0], 33, 33);
                break;
            case "heart":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "heart");
                var hp = [], ht;
                for (i = 0; i < 64; i++) {
                    ht = i / 64 * Math.PI * 2;
                    hp.push([16 * Math.pow(Math.sin(ht), 3) * 8 * K, -(13 * Math.cos(ht) - 5 * Math.cos(2 * ht) - 2 * Math.cos(3 * ht) - Math.cos(4 * ht)) * 8 * K]);
                }
                sPath(L, gi, hp, true);
                sFill(L, gi, acc);
                tg = L.property("ADBE Transform Group");
                keysAt(tg.property("ADBE Scale"), [t0, t0 + 0.3], [[0, 0], [100, 100]], 40, 40);
                linIn(tg.property("ADBE Scale"), 2);
                tg.property("ADBE Scale").expression = overExpr(0.14, 3, 5);
                break;
            case "starBurst":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "stars");
                var r1 = 26 * K, r2 = 6 * K, oy = -190 * K;
                sPath(L, gi, [[0, oy - r1], [r2, oy - r2], [r1, oy], [r2, oy + r2], [0, oy + r1], [-r2, oy + r2], [-r1, oy], [-r2, oy - r2]], true);
                sFill(L, gi, acc);
                sRepeater(L, gi, 8, [0, 0], 45);
                keysAt(GT(L, gi).property("ADBE Vector Scale"), [t0, t0 + 0.35, t0 + 0.9], [[0, 0], [110, 110], [0, 0]], 40, 60);
                L.property("ADBE Transform Group").property("ADBE Rotate Z").expression = "(time - inPoint) * 60";
                break;
            case "spinner":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "arc");
                sEllipse(L, gi, 160 * K);
                ti = sTrim(L, gi);
                sStroke(L, gi, acc, 16 * K, true);
                GP(L, gi, ti).property("ADBE Vector Trim End").setValue(70);
                GP(L, gi, ti).property("ADBE Vector Trim Offset").expression = "(time - inPoint) * 360";
                break;
            case "waveDots":
                L = done(shapeLayer(c, name));
                for (j = 0; j < 9; j++) {
                    gi = addGroup(L, "dot " + (j + 1));
                    sEllipse(L, gi, 26 * K, [(j - 4) * 48 * K, 0]);
                    sFill(L, gi, acc);
                    GT(L, gi).property("ADBE Vector Position").expression = "var k = thisComp.height / 1080;\nvalue + [0, Math.sin((time * 2.2 - " + (j * 0.11) + ") * Math.PI * 2) * 28 * k];";
                }
                break;
            case "corners":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "corners");
                var bx = W * 0.36, by = H * 0.26, cl = Math.min(W, H) * 0.08;
                sPath(L, gi, [[-bx, -by + cl], [-bx, -by], [-bx + cl, -by]], false);
                sPath(L, gi, [[bx - cl, -by], [bx, -by], [bx, -by + cl]], false);
                sPath(L, gi, [[bx, by - cl], [bx, by], [bx - cl, by]], false);
                sPath(L, gi, [[-bx + cl, by], [-bx, by], [-bx, by - cl]], false);
                ti = sTrim(L, gi);
                try { GP(L, gi, ti).property("ADBE Vector Trim Type").setValue(2); } catch (ec) {}
                sStroke(L, gi, acc, 10 * K, true);
                trimDraw(L, gi, ti, 0.45, t1 - 0.45);
                break;
            case "zigzag":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "zigzag");
                var zz = [];
                for (i = 0; i <= 12; i++) { zz.push([(-240 + i * 40) * K, (i % 2 ? -18 : 18) * K]); }
                sPath(L, gi, zz, false);
                ti = sTrim(L, gi);
                sStroke(L, gi, acc, 10 * K, true);
                trimDraw(L, gi, ti, 0.5, t1 - 0.5);
                break;
            case "cursor":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "ripple");
                ti = sEllipse(L, gi, 0);
                var rk = sStroke(L, gi, acc, 8 * K, false);
                keysAt(GP(L, gi, ti).property("ADBE Vector Ellipse Size"), [t0 + 0.55, t0 + 1.0], [[0, 0], [160 * K, 160 * K]], 10, 80);
                keysAt(GP(L, gi, rk).property("ADBE Vector Stroke Opacity"), [t0 + 0.55, t0 + 1.0], [100, 0], 10, 80);
                gi = addGroup(L, "arrow");
                var a1 = 1.6 * K;
                sPath(L, gi, [[0, 0], [0, 60 * a1], [15 * a1, 46 * a1], [26 * a1, 70 * a1], [36 * a1, 65 * a1], [25 * a1, 42 * a1], [44 * a1, 42 * a1]], true);
                sFill(L, gi, [1, 1, 1]);
                sStroke(L, gi, [0, 0, 0], 3 * K, true);
                keysAt(GT(L, gi).property("ADBE Vector Position"), [t0, t0 + 0.5], [[220 * K, 160 * K], [0, 0]], 20, 85);
                keysAt(GT(L, gi).property("ADBE Vector Scale"), [t0 + 0.5, t0 + 0.6, t0 + 0.72], [[100, 100], [82, 82], [100, 100]], 50, 50);
                break;
            case "bubble":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "bubble");
                sRect(L, gi, 420 * K, 220 * K, [0, 0], 60 * K);
                sPath(L, gi, [[-110 * K, 90 * K], [-150 * K, 170 * K], [-40 * K, 100 * K]], true);
                sFill(L, gi, [1, 1, 1]);
                tg = L.property("ADBE Transform Group");
                tg.property("ADBE Anchor Point").setValue([-150 * K, 170 * K]);
                tg.property("ADBE Position").setValue([cx - 150 * K, cy + 170 * K]);
                keysAt(tg.property("ADBE Scale"), [t0, t0 + 0.3], [[0, 0], [100, 100]], 40, 40);
                linIn(tg.property("ADBE Scale"), 2);
                tg.property("ADBE Scale").expression = overExpr(0.12, 2.5, 6);
                break;
            case "rays":
                L = done(shapeLayer(c, name));
                gi = addGroup(L, "rays");
                var rl = Math.sqrt(W * W + H * H) * 0.7;
                sPath(L, gi, [[0, 0], [-rl * 0.1, -rl], [rl * 0.1, -rl]], true);
                sFill(L, gi, acc, 18);
                sRepeater(L, gi, 16, [0, 0], 22.5);
                L.property("ADBE Transform Group").property("ADBE Rotate Z").expression = "(time - inPoint) * 8";
                L.moveToEnd();
                break;
            case "bokeh":
                L = done(shapeLayer(c, name));
                L.blendingMode = BlendingMode.ADD;
                for (j = 0; j < 16; j++) {
                    gi = addGroup(L, "orb " + (j + 1));
                    var od = (40 + (j * 37) % 120) * K;
                    sEllipse(L, gi, od);
                    sFill(L, gi, j % 3 ? acc : [1, 0.95, 0.85], 28);
                    GT(L, gi).property("ADBE Vector Position").expression =
                        "seedRandom(" + (j + 11) + ", true);\nvar b = [random(-thisComp.width, thisComp.width) * 0.5, random(-thisComp.height, thisComp.height) * 0.5];\nb + wiggle(0.2, thisComp.height * 0.08) - value;";
                }
                ti = addEffect(L, "ADBE Gaussian Blur 2", "HAMDY Soft").propertyIndex;
                try { FX(L, ti).property(1).setValue(18 * K); } catch (eb2) {}
                break;
            case "glitchBars":
                L = done(shapeLayer(c, name));
                L.blendingMode = BlendingMode.DIFFERENCE;
                for (j = 0; j < 10; j++) {
                    gi = addGroup(L, "bar " + (j + 1));
                    sRect(L, gi, W, (6 + (j * 13) % 40) * K);
                    sFill(L, gi, j % 2 ? acc : [1, 1, 1]);
                    GT(L, gi).property("ADBE Vector Position").expression = "seedRandom(Math.floor(time * 10) * 13 + " + j + ", true);\n[random(-40, 40), random(-thisComp.height, thisComp.height) * 0.5];";
                    GT(L, gi).property("ADBE Vector Group Opacity").expression = "seedRandom(Math.floor(time * 10) * 7 + " + j + ", true);\nrandom() > 0.6 ? 100 : 0;";
                }
                break;
            case "burnLoop":
                L = solid([0, 0, 0], "");
                L.blendingMode = BlendingMode.ADD;
                ti = rampFx(L, [W * 0.85, H * 0.2], [1, 0.42, 0.08], [W * 0.85 + H * 0.9, H * 0.2], [0, 0, 0], 2);
                FX(L, ti).property(1).expression = "value + [Math.sin(time * 0.7) * thisComp.width * 0.08, Math.cos(time * 0.5) * thisComp.height * 0.06]";
                FX(L, ti).property(3).expression = "effect(\"HAMDY Ramp\")(1) + [thisComp.height * 0.9, 0]";
                L.property("ADBE Transform Group").property("ADBE Opacity").expression = "seedRandom(Math.floor(time * 12), true);\n60 + 25 * Math.sin(time * 3) + random(-15, 15);";
                break;
            default: throw Err("UNKNOWN");
        }
        return "OK";
    }

    // =============================================================== eases
    var EXPR = {
        overshoot: overExpr(0.06, 2.5, 6, 0),
        bounce: bounceExpr(5000),
        loopCycle: "loopOut(\"cycle\");",
        loopPing: "loopOut(\"pingpong\");",
        loopCont: "loopOut(\"continue\");",
        wiggleSoft: "wiggle(1.5, 15);",
        wiggleHard: "wiggle(8, 40);",
        spin: "value + time * 90;",
        none: "",
        elasticX: overExpr(0.12, 3.5, 4, 0),
        loopOffset: "loopOut(\"offset\");",
        loopInCycle: "loopIn(\"cycle\");",
        wiggleX: "var w = wiggle(2, 40);\nvalue instanceof Array ? [w[0], value[1]].concat(value.slice(2)) : w;",
        wiggleY: "var w = wiggle(2, 40);\nvalue instanceof Array ? [value[0], w[1]].concat(value.slice(2)) : w;",
        sineY: "var amp = 40, freq = 1;\nvalue instanceof Array ? value + [0, Math.sin(time * freq * Math.PI * 2) * amp] : value + Math.sin(time * freq * Math.PI * 2) * amp;",
        pendulumDecay: "var amp = 25, freq = 1.2, decay = 0.8;\nvar t = time - inPoint;\nvalue + amp * Math.sin(t * freq * Math.PI * 2) / Math.exp(decay * t);",
        posterize: "posterizeTime(12);\nvalue;",
        flickerOp: "seedRandom(Math.floor(time * 12), true);\nrandom() > 0.2 ? value : value * 0.25;",
        squashVel: "var p = thisLayer.transform.position.velocity;\nvar v = Math.min(length(p) / 40, 30);\n[value[0] + v, value[1] - v].concat(value.slice(2));",
        delayFollow: "var L = thisComp.layer(index - 1);\nL.transform.position.valueAtTime(time - 0.1);",
        countUp: "var from = 0, to = 100, dur = 2;\nMath.round(ease(time, inPoint, inPoint + dur, from, to)).toString();",
        typeCursor: "var t = value;\nvar n = Math.floor((time - inPoint) * 15);\nt.substr(0, n) + (Math.floor(time * 2) % 2 ? \"|\" : \"\");"
    };
    function selectedProps(needKeys) {
        var c = comp(), out = [], layers = c.selectedLayers, i, j, p, ps;
        for (i = 0; i < layers.length; i++) {
            ps = layers[i].selectedProperties;
            for (j = 0; j < ps.length; j++) {
                p = ps[j];
                if (p.propertyType !== PropertyType.PROPERTY) { continue; }
                if (needKeys && !(p.selectedKeys && p.selectedKeys.length)) { continue; }
                out.push(p);
            }
        }
        return out;
    }
    function ease(a) {
        var props = selectedProps(true), i, j, p, ks, n = 0;
        for (i = 0; i < props.length; i++) {
            p = props[i]; ks = p.selectedKeys;
            for (j = 0; j < ks.length; j++) {
                try {
                    if (a.mode === "linear") { setLinear(p, ks[j]); }
                    else if (a.mode === "hold") { setHold(p, ks[j]); }
                    else { setEase(p, ks[j], a.i, a.o); }
                    n++;
                } catch (e) {}
            }
        }
        if (!n) { throw Err("NO_KEYS"); }
        return "OK";
    }
    function expr(a) {
        var code = EXPR[a.id];
        if (code === undefined) { throw Err("UNKNOWN"); }
        var props = selectedProps(false), i, n = 0;
        for (i = 0; i < props.length; i++) { if (props[i].canSetExpression) { props[i].expression = code; n++; } }
        if (!n) { throw Err("NO_PROPS"); }
        return "OK";
    }

    // ======================================================= keyframe tools
    function keyData(p, k) {
        var d = { t: p.keyTime(k), v: p.keyValue(k), ii: p.keyInInterpolationType(k), oi: p.keyOutInterpolationType(k) };
        try { d.ie = p.keyInTemporalEase(k); d.oe = p.keyOutTemporalEase(k); } catch (e) {}
        if (p.isSpatial) { try { d.it = p.keyInSpatialTangent(k); d.ot = p.keyOutSpatialTangent(k); } catch (e2) {} }
        return d;
    }
    function keysOp(a) {
        var c = comp(), props = selectedProps(true), i, j, p, ks, D, tmin = 1e9, tmax = -1e9, n = 0;
        if (!props.length) { throw Err("NO_KEYS"); }
        for (i = 0; i < props.length; i++) {
            ks = props[i].selectedKeys;
            for (j = 0; j < ks.length; j++) { tmin = Math.min(tmin, props[i].keyTime(ks[j])); tmax = Math.max(tmax, props[i].keyTime(ks[j])); }
        }
        var fd = c.frameDuration, mapT, swap = false;
        if (a.op === "reverse") { mapT = function (t) { return tmin + tmax - t; }; swap = true; }
        else if (a.op === "playhead") { mapT = function (t) { return t - tmin + c.time; }; }
        else if (a.op === "retime") { mapT = function (t) { return tmin + (t - tmin) * (a.pct || 100) / 100; }; }
        else if (a.op === "nudge") { mapT = function (t) { return t + (a.frames || 1) * fd; }; }
        else { throw Err("UNKNOWN"); }
        for (i = 0; i < props.length; i++) {
            p = props[i]; ks = p.selectedKeys.slice(0); D = [];
            for (j = 0; j < ks.length; j++) { D.push(keyData(p, ks[j])); }
            for (j = ks.length - 1; j >= 0; j--) { p.removeKey(ks[j]); }
            for (j = 0; j < D.length; j++) {
                var nt = Math.round(mapT(D[j].t) / fd) * fd;
                D[j].nt = nt;
                p.setValueAtTime(nt, D[j].v);
            }
            for (j = 0; j < D.length; j++) {
                var d = D[j], k = p.nearestKeyIndex(d.nt);
                try { if (swap) { p.setInterpolationTypeAtKey(k, d.oi, d.ii); } else { p.setInterpolationTypeAtKey(k, d.ii, d.oi); } } catch (e1) {}
                try { if (d.ie) { if (swap) { p.setTemporalEaseAtKey(k, d.oe, d.ie); } else { p.setTemporalEaseAtKey(k, d.ie, d.oe); } } } catch (e2) {}
                try { if (d.it) { if (swap) { p.setSpatialTangentsAtKey(k, d.ot, d.it); } else { p.setSpatialTangentsAtKey(k, d.it, d.ot); } } } catch (e3) {}
                n++;
            }
        }
        return "OK";
    }

    // ========================================================== layer tools
    function rotZ(L) { try { return L.property("ADBE Transform Group").property("ADBE Rotate Z").value; } catch (e) { return 0; } }
    function anchorMove(a) {
        var c = comp(), sel = needSel(c), j, skipped = 0;
        for (j = 0; j < sel.length; j++) {
            var L = sel[j], tg = L.property("ADBE Transform Group"), ap = tg.property("ADBE Anchor Point"), pos = tg.property("ADBE Position");
            if (ap.numKeys > 0) { skipped++; continue; }
            var r = layerRect(L, c.time);
            if (!r) { skipped++; continue; }
            var oa = ap.value, na = [r.left + r.width * a.fx, r.top + r.height * a.fy];
            var s = tg.property("ADBE Scale").value, rad = rotZ(L) * Math.PI / 180;
            var dx = (na[0] - oa[0]) * s[0] / 100, dy = (na[1] - oa[1]) * s[1] / 100;
            var off = [dx * Math.cos(rad) - dy * Math.sin(rad), dx * Math.sin(rad) + dy * Math.cos(rad)];
            if (oa.length > 2) { ap.setValue([na[0], na[1], oa[2]]); } else { ap.setValue(na); }
            if (pos.dimensionsSeparated) {
                var px = tg.property("ADBE Position_0"), py = tg.property("ADBE Position_1");
                shiftProp(px, off[0]); shiftProp(py, off[1]);
            } else {
                shiftProp(pos, off);
            }
        }
        return skipped ? "OK_SKIPPED:" + skipped : "OK";
    }
    function shiftProp(p, off) {
        var k, v;
        function add(v0) {
            if (v0 instanceof Array) { var o = v0.slice(0); o[0] += off[0]; o[1] += off[1]; return o; }
            return v0 + off;
        }
        if (p.numKeys > 0) { for (k = 1; k <= p.numKeys; k++) { v = p.keyValue(k); p.setValueAtKey(k, add(v)); } }
        else { p.setValue(add(p.value)); }
    }
    function centerLayer() {
        var c = comp(), sel = needSel(c), j;
        for (j = 0; j < sel.length; j++) {
            var pos = sel[j].property("ADBE Transform Group").property("ADBE Position");
            if (pos.dimensionsSeparated) { continue; }
            var cur = pos.valueAtTime(c.time, false);
            shiftProp(pos, [c.width / 2 - cur[0], c.height / 2 - cur[1]]);
        }
        return "OK";
    }
    function nullCtl() {
        var c = comp(), sel = needSel(c), i, x = 0, y = 0, p;
        for (i = 0; i < sel.length; i++) {
            p = sel[i].property("ADBE Transform Group").property("ADBE Position").value;
            x += p[0]; y += p[1];
        }
        var top = topSelected(c);
        var N = c.layers.addNull();
        N.name = "HAMDY Controller";
        N.property("ADBE Transform Group").property("ADBE Position").setValue([x / sel.length, y / sel.length]);
        N.moveBefore(top);
        for (i = 0; i < sel.length; i++) { if (!sel[i].parent) { sel[i].parent = N; } }
        return "OK";
    }
    function adjust() {
        var c = comp(), t = snap(c, c.time), top = topSelected(c);
        var L = c.layers.addSolid([1, 1, 1], "HAMDY Adjustment", c.width, c.height, c.pixelAspect, c.duration);
        L.adjustmentLayer = true;
        L.inPoint = t;
        if (top) { L.moveBefore(top); }
        return "OK";
    }
    function fit() { var c = comp(), sel = needSel(c), j; for (j = 0; j < sel.length; j++) { fitLayer(sel[j], c); } return "OK"; }
    function sortByIndex(sel) { var s = sel.slice(0); s.sort(function (x, y) { return x.index - y.index; }); return s; }
    function stagger(a) {
        var c = comp(), sel = sortByIndex(needSel(c, 2)), i;
        for (i = 1; i < sel.length; i++) { sel[i].startTime += i * (a.frames || 3) * c.frameDuration; }
        return "OK";
    }
    function sequence(a) {
        var c = comp(), sel = sortByIndex(needSel(c, 2)), i, target;
        for (i = 1; i < sel.length; i++) {
            target = sel[i - 1].outPoint - (a.overlap || 0) * c.frameDuration;
            sel[i].startTime += target - sel[i].inPoint;
        }
        return "OK";
    }
    function split() {
        var c = comp(), sel = needSel(c), t = snap(c, c.time), j, n = 0;
        for (j = 0; j < sel.length; j++) {
            var L = sel[j];
            if (t <= L.inPoint || t >= L.outPoint) { continue; }
            var D = L.duplicate();
            L.outPoint = t;
            D.inPoint = t;
            n++;
        }
        if (!n) { throw Err("NOT_UNDER"); }
        return "OK";
    }
    function trim(a) {
        var c = comp(), sel = needSel(c), t = snap(c, c.time), j, n = 0;
        for (j = 0; j < sel.length; j++) {
            var L = sel[j];
            if (t <= L.inPoint || t >= L.outPoint) { continue; }
            if (a.side === "in") { L.inPoint = t; } else { L.outPoint = t; }
            n++;
        }
        if (!n) { throw Err("NOT_UNDER"); }
        return "OK";
    }
    function precomp() {
        var c = comp(), sel = sortByIndex(needSel(c)), idx = [], j;
        for (j = 0; j < sel.length; j++) { idx.push(sel[j].index); }
        c.layers.precompose(idx, "HAMDY Precomp", true);
        return "OK";
    }

    // ============================================================== guides
    var PLATFORMS = {
        reels: { top: 220, bottom: 420, left: 60, right: 140 },
        tiktok: { top: 160, bottom: 480, left: 60, right: 160 },
        shorts: { top: 190, bottom: 380, left: 60, right: 190 },
        generic: null
    };
    function gRect(L, c, name, x, y, w, h, color, opacity, strokeW) {
        var gi = addGroup(L, name);
        sRect(L, gi, w, h, [x + w / 2 - c.width / 2, y + h / 2 - c.height / 2]);
        if (strokeW) { sStroke(L, gi, color, strokeW, false, opacity); } else { sFill(L, gi, color, opacity); }
    }
    function guides(a) {
        var c = comp(), W = c.width, H = c.height, z = PLATFORMS[a.plat];
        if (z === undefined) { throw Err("UNKNOWN"); }
        var L = shapeLayer(c, "HAMDY GUIDE | " + a.plat);
        var red = [1, 0.15, 0.15], green = [0.2, 1, 0.45], cyan = [0.2, 0.8, 1], lw = Math.max(2, Math.round(W / 540));
        if (z) {
            var sx = W / 1080, sy = H / 1920;
            var t = z.top * sy, b = z.bottom * sy, l = z.left * sx, r = z.right * sx;
            if (a.zones) {
                gRect(L, c, "Unsafe top", 0, 0, W, t, red, 28);
                gRect(L, c, "Unsafe bottom", 0, H - b, W, b, red, 28);
                gRect(L, c, "Unsafe right", W - r, t, r, H - t - b, red, 28);
                gRect(L, c, "Unsafe left", 0, t, l, H - t - b, red, 18);
            }
            if (a.safe) { gRect(L, c, "Safe area", l, t, W - l - r, H - t - b, green, 100, lw); }
        } else if (a.safe) {
            gRect(L, c, "Action safe 90%", W * 0.05, H * 0.05, W * 0.9, H * 0.9, green, 100, lw);
            gRect(L, c, "Title safe 80%", W * 0.1, H * 0.1, W * 0.8, H * 0.8, cyan, 100, lw);
        }
        if (a.thirds) {
            gRect(L, c, "Third V1", W / 3 - lw / 2, 0, lw, H, cyan, 70);
            gRect(L, c, "Third V2", 2 * W / 3 - lw / 2, 0, lw, H, cyan, 70);
            gRect(L, c, "Third H1", 0, H / 3 - lw / 2, W, lw, cyan, 70);
            gRect(L, c, "Third H2", 0, 2 * H / 3 - lw / 2, W, lw, cyan, 70);
        }
        if (a.center) {
            gRect(L, c, "Center V", W / 2 - lw / 2, H / 2 - W * 0.04, lw, W * 0.08, [1, 1, 1], 90);
            gRect(L, c, "Center H", W / 2 - W * 0.04, H / 2 - lw / 2, W * 0.08, lw, [1, 1, 1], 90);
        }
        L.guideLayer = true;
        L.label = 1;
        L.locked = true;
        return (z && Math.abs(W / H - 9 / 16) > 0.02) ? "OK_NOT916" : "OK";
    }

    // ============================================================= project
    function classify(it) {
        if (it instanceof CompItem) { return "01 Comps"; }
        if (!(it instanceof FootageItem)) { return null; }
        var src = it.mainSource;
        if (src instanceof SolidSource) { return "05 Solids"; }
        if (src instanceof PlaceholderSource) { return "06 Other"; }
        if (src.isStill) { return "04 Images"; }
        if (it.hasVideo) { return "02 Footage"; }
        if (it.hasAudio) { return "03 Audio"; }
        return "06 Other";
    }
    function organize(a) {
        var names = ["01 Comps", "02 Footage", "03 Audio", "04 Images", "05 Solids", "06 Other"];
        var plan = [], i, it, cls, folders = {};
        for (i = 1; i <= app.project.numItems; i++) {
            it = app.project.item(i);
            if (it instanceof FolderItem) { continue; }
            if (!a.deep && it.parentFolder !== app.project.rootFolder) { continue; }
            if (inList(it.parentFolder.name, names) && it.parentFolder.parentFolder === app.project.rootFolder) { continue; }
            cls = classify(it);
            if (cls) { plan.push([it, cls]); }
        }
        if (!plan.length) { throw Err("NOTHING"); }
        for (i = 0; i < plan.length; i++) {
            cls = plan[i][1];
            if (!folders[cls]) { folders[cls] = getOrMakeFolder(cls); }
            plan[i][0].parentFolder = folders[cls];
        }
        return "OK_MOVED:" + plan.length;
    }
    function newComp(a) {
        var c = app.project.items.addComp(a.name || "HAMDY Comp", a.w, a.h, 1, Math.max(1, a.secs || 10), a.fps || 30);
        try { c.parentFolder = getOrMakeFolder("01 Comps"); } catch (e) {}
        c.openInViewer();
        return "OK";
    }

    // ============================================================= library
    function libPick() {
        var f = Folder.selectDialog("Hamdy Motion Kit: choose a resources folder");
        return f ? { path: f.fsName } : { path: null };
    }
    function libList(a) {
        var out = [], i, f;
        for (i = 0; a.paths && i < a.paths.length; i++) {
            f = new Folder(a.paths[i]);
            if (f.exists) { listFiles(f, out, 0, f.fsName, i); }
        }
        return { files: out };
    }
    function libUse(a) {
        var c = comp(), file = new File(a.path);
        if (!file.exists) { throw Err("NO_FILE"); }
        var ext = extOf(file.displayName), j;
        if (ext === "ffx") {
            var sel = c.selectedLayers;
            if (!sel.length) {
                var A = c.layers.addSolid([1, 1, 1], "HAMDY FX | " + file.displayName, c.width, c.height, c.pixelAspect, c.duration);
                A.adjustmentLayer = true;
                A.inPoint = snap(c, c.time);
                sel = [A];
            }
            for (j = 0; j < sel.length; j++) { sel[j].applyPreset(file); }
            return "OK";
        }
        var it = importFile(file);
        var top = topSelected(c);
        var L = c.layers.add(it);
        L.startTime = snap(c, c.time);
        if (top && top !== L) { L.moveBefore(top); }
        if (it.hasVideo) {
            if (a.fit) { fitLayer(L, c); }
            if (a.screen) { L.blendingMode = BlendingMode.SCREEN; }
        }
        return "OK";
    }
    function libOpen(a) { var f = new Folder(a.path || ""); if (f.exists) { f.execute(); return "OK"; } throw Err("NO_FOLDER"); }

    // ======================================================= looks / FX
    function setParam(L, fi, idx, v) {
        var pr = FX(L, fi).property(idx);
        if (v instanceof Array && v.length === 3 && pr.propertyValueType === PropertyValueType.COLOR) { v = [v[0], v[1], v[2], 1]; }
        pr.setValue(v);
    }
    function addOps(L, ops, tag, sizeK) {
        var i, k, fi, op;
        for (i = 0; i < ops.length; i++) {
            op = ops[i];
            try { fi = addEffect(L, op.mn, tag + " " + (op.n || op.mn)).propertyIndex; } catch (ea) { continue; }
            if (op.p) { for (k in op.p) { if (op.p.hasOwnProperty(k)) { try { setParam(L, fi, parseInt(k, 10), resolve(op.p[k], sizeK)); } catch (ep) {} } } }
            if (op.ex) { for (k in op.ex) { if (op.ex.hasOwnProperty(k)) { try { FX(L, fi).property(parseInt(k, 10)).expression = op.ex[k]; } catch (ee) {} } } }
        }
    }
    function resolve(v, sizeK) {
        if (v instanceof Array && v[0] === "fs") { return v[1] * (sizeK || 1); }
        return v;
    }
    function look(a) {
        var c = comp(), ops = a.ops || [], tag = "HAMDY " + (a.kind === "afx" ? "AUDIO" : (a.kind === "vfx" ? "FX" : "LOOK"));
        if (a.kind === "afx" || a.mode === "selected") {
            var sel = needSel(c), j, n = 0;
            for (j = 0; j < sel.length; j++) {
                if (a.kind === "afx") { if (!sel[j].hasAudio) { continue; } }
                else if (!animatable(sel[j])) { continue; }
                addOps(sel[j], ops, tag + " " + a.label, 1);
                n++;
            }
            if (!n) { throw Err(a.kind === "afx" ? "NO_AUDIO_LAYER" : "NO_ANIM_LAYER"); }
            return "OK";
        }
        var t = snap(c, c.time), top = topSelected(c);
        var L = c.layers.addSolid([1, 1, 1], tag + " | " + a.label, c.width, c.height, c.pixelAspect, c.duration);
        L.adjustmentLayer = true;
        L.label = 11;
        if (a.whole) { L.inPoint = 0; } else { L.inPoint = t; }
        if (top) { L.moveBefore(top); } else { L.moveToBeginning(); }
        addOps(L, ops, tag, 1);
        if (a.amount !== undefined && a.amount < 100) { L.property("ADBE Transform Group").property("ADBE Opacity").setValue(a.amount); }
        return "OK";
    }

    // ========================================================= text styles
    function textStyle(a) {
        var c = comp(), st = a.st || {}, targets = [], j, i;
        if (a.mode === "new") {
            if (!a.text) { throw Err("NO_TEXT"); }
            var NL = makeText(c, a.text, a.size || 110, [1, 1, 1], "c", a.font, 0);
            NL.inPoint = snap(c, c.time);
            NL.outPoint = Math.min(c.duration, NL.inPoint + Math.max(0.5, a.secs || 3));
            centerAnchor(NL, NL.inPoint);
            NL.property("ADBE Transform Group").property("ADBE Position").setValue([c.width / 2, c.height / 2]);
            targets.push(NL);
        } else {
            var sel = c.selectedLayers;
            for (j = 0; j < sel.length; j++) { if (sel[j] instanceof TextLayer) { targets.push(sel[j]); } }
            if (!targets.length) { throw Err("NO_TEXT_LAYER"); }
        }
        for (j = 0; j < targets.length; j++) { styleOne(c, targets[j], st); }
        return "OK";
    }
    function styleOne(c, L, st) {
        var i, p = parade(L);
        for (i = p.numProperties; i >= 1; i--) { if (/^(?:NABD|HAMDY) STYLE/.test(p.property(i).name)) { p.property(i).remove(); } }
        for (i = c.numLayers; i >= 1; i--) {
            var ol = c.layer(i);
            if (ol.name === "HAMDY STYLE BOX | " + L.name) { try { ol.remove(); } catch (er) {} }
        }
        var oldKids = styleKids(c, L);
        for (i = oldKids.length - 1; i >= 0; i--) { if (/^(?:NABD|HAMDY) STYLE LYR/.test(oldKids[i].name)) { try { oldKids[i].remove(); } catch (erk) {} } }
        var tdp = L.property("ADBE Text Properties").property("ADBE Text Document"), d = tdp.value;
        var fs = d.fontSize || 110, k = fs / 110;
        try {
            if (st.fill) { d.applyFill = true; d.fillColor = st.fill; } else if (st.grad) { d.applyFill = true; d.fillColor = st.grad[0]; } else { d.applyFill = false; }
            if (st.stroke) { d.applyStroke = true; d.strokeColor = st.stroke; d.strokeWidth = (st.sw || 6) * k; d.strokeOverFill = false; } else { d.applyStroke = false; }
            if (st.trk !== undefined) { d.tracking = st.trk; }
            if (st.caps !== undefined) { try { d.allCaps = !!st.caps; } catch (ec) {} }
        } catch (ed) {}
        tdp.setValue(d);
        var r = layerRect(L, L.inPoint) || { left: -100, top: -50, width: 200, height: 100 };
        var fi;
        if (st.grad) {
            fi = addEffect(L, "ADBE Ramp", "HAMDY STYLE Gradient").propertyIndex;
            try {
                FX(L, fi).property(1).expression = "var r = sourceRectAtTime(time, false); [r.left + r.width / 2, r.top]";
                FX(L, fi).property(2).setValue([st.grad[0][0], st.grad[0][1], st.grad[0][2], 1]);
                FX(L, fi).property(3).expression = "var r = sourceRectAtTime(time, false); [r.left + r.width / 2, r.top + r.height]";
                FX(L, fi).property(4).setValue([st.grad[1][0], st.grad[1][1], st.grad[1][2], 1]);
            } catch (eg) {}
        }
        if (st.bevel) {
            fi = addEffect(L, "ADBE Bevel Alpha", "HAMDY STYLE Bevel").propertyIndex;
            try { FX(L, fi).property(1).setValue((st.bevel.t || 3) * k); FX(L, fi).property(4).setValue(0.6); } catch (eb) {}
        }
        if (st.sweep) {
            fi = addEffect(L, "CC Light Sweep", "HAMDY STYLE Shine").propertyIndex;
            try { FX(L, fi).property(1).expression = "var r = sourceRectAtTime(time, false);\n[r.left + ((time * 0.6) % 1.6 - 0.3) * r.width, r.top + r.height / 2]"; } catch (es) {}
        }
        var copyL = [], stack = [], q1, px = 0, py = 0;
        if (st.layers) {
            for (q1 = 0; q1 < st.layers.length; q1++) {
                if (st.layers[q1].stroke || (!st.layers[q1].dx && !st.layers[q1].dy)) { copyL.push(st.layers[q1]); } else { stack.push(st.layers[q1]); }
            }
        }
        for (q1 = 0; q1 < stack.length; q1++) {
            var sx = (stack[q1].dx || 0) * k, sy = (stack[q1].dy || 0) * k;
            if (stack[q1].fill) { addHardShadow(L, "HAMDY STYLE Stack " + (q1 + 1), stack[q1].fill, sx - px, sy - py); }
            px = sx; py = sy;
        }
        if (st.extrude) {
            var ex = st.extrude, en = Math.max(1, Math.min(16, ex.n || 10)), q3;
            for (q3 = 0; q3 < en; q3++) {
                addHardShadow(L, "HAMDY STYLE Extrude " + (q3 + 1), mix(ex.c, ex.c2 || ex.c, en > 1 ? q3 / (en - 1) : 0), (ex.dx || 0) * k, (ex.dy === undefined ? 1.5 : ex.dy) * k);
            }
        }
        if (st.glow) {
            fi = addEffect(L, "ADBE Glo2", "HAMDY STYLE Glow").propertyIndex;
            try { FX(L, fi).property(2).setValue(st.glow.th || 40); FX(L, fi).property(3).setValue((st.glow.r || 30) * k); FX(L, fi).property(4).setValue(st.glow.i || 1); } catch (egl) {}
        }
        var shs = [st.shadow2, st.shadow], q2;
        for (q2 = 0; q2 < 2; q2++) {
            var sh = shs[q2];
            if (!sh) { continue; }
            fi = addEffect(L, "ADBE Drop Shadow", "HAMDY STYLE Shadow " + (q2 + 1)).propertyIndex;
            try { FX(L, fi).property(1).setValue([sh.c[0], sh.c[1], sh.c[2], 1]); } catch (e1) {}
            try { FX(L, fi).property(2).setValue((sh.op === undefined ? 60 : sh.op) * 2.55); } catch (e2) { try { FX(L, fi).property(2).setValue(sh.op === undefined ? 60 : sh.op); } catch (e2b) {} }
            try { FX(L, fi).property(3).setValue(sh.a === undefined ? 135 : sh.a); FX(L, fi).property(4).setValue((sh.d || 0) * k); FX(L, fi).property(5).setValue((sh.s || 0) * k); } catch (e3) {}
        }
        if (st.box) {
            var B = shapeLayer(c, "HAMDY STYLE BOX | " + L.name, [0, 0]);
            tuck(c, B);
            try { B.inPoint = L.inPoint; B.outPoint = L.outPoint; } catch (eio) {}
            var gb = addGroup(B, "box"), rb = sRect(B, gb, 100, 100, [0, 0], (st.box.r || 8) * k);
            sFill(B, gb, st.box.c, st.box.op === undefined ? 100 : st.box.op);
            B.parent = L;
            B.property("ADBE Transform Group").property("ADBE Position").setValue([0, 0]);
            var lr = "thisComp.layer(\"" + q(L.name) + "\")", px = (st.box.pad ? st.box.pad[0] : 26) * k * 2, py = (st.box.pad ? st.box.pad[1] : 12) * k * 2;
            GP(B, gb, rb).property("ADBE Vector Rect Size").expression = "var r = " + lr + ".sourceRectAtTime(time, false);\n[r.width + " + px + ", r.height + " + py + "];";
            GP(B, gb, rb).property("ADBE Vector Rect Position").expression = "var r = " + lr + ".sourceRectAtTime(time, false);\n[r.left + r.width / 2, r.top + r.height / 2];";
            B.property("ADBE Transform Group").property("ADBE Opacity").expression = lr + ".transform.opacity";
            B.moveAfter(L);
        }
        if (copyL.length) { addCopyLayers(c, L, copyL, k); }
    }

    // ========================================================= typewriter
    function addSlider(L, name, v) {
        var i = addEffect(L, "ADBE Slider Control", name).propertyIndex;
        try { FX(L, i).property(1).setValue(v); } catch (e) {}
        return i;
    }
    function addCheck(L, name, v) {
        var i = addEffect(L, "ADBE Checkbox Control", name).propertyIndex;
        try { FX(L, i).property(1).setValue(v ? 1 : 0); } catch (e) {}
        return i;
    }
    function typeUnits(str, mode) {
        if (mode === "words") { return str.split(" ").length; }
        if (mode === "lines") { return str.split(/\r|\n/).length; }
        return str.length;
    }
    function typeSrcExpr(sp) {
        var m = sp.src.mode || "chars";
        return "// HAMDY TYPE\n" +
            "var spd = Math.max(0.1, effect(\"HAMDY TYPE Speed\")(1)), d0 = effect(\"HAMDY TYPE Delay\")(1) * thisComp.frameDuration;\n" +
            "var showCur = effect(\"HAMDY TYPE Cursor\")(1) > 0, cur = \"" + q(sp.src.cur || "|") + "\", mode = \"" + m + "\", erase = " + (sp.src.erase ? "true" : "false") + ";\n" +
            "var s = \"\" + value;\n" +
            "var u = mode == \"words\" ? s.split(\" \") : (mode == \"lines\" ? s.split(/\\r|\\n/) : null);\n" +
            "var total = u ? u.length : s.length, t = time - inPoint - d0;\n" +
            "var n = Math.max(0, Math.min(total, Math.floor(t * spd + (t > 0 ? 1 : 0))));\n" +
            "if (erase) { var te = outPoint - 0.25 - total / (spd * 2); if (time > te) { n = Math.max(0, total - Math.floor((time - te) * spd * 2)); } }\n" +
            "var out = u ? u.slice(0, n).join(mode == \"words\" ? \" \" : \"\\r\") : s.substr(0, n);\n" +
            "var typing = n > 0 && n < total;\n" +
            "out + ((showCur && (typing || Math.floor(time * 2.2) % 2 == 0)) ? cur : \"\");";
    }
    function twAmountExpr(sp, isOut, dur) {
        var ez = sp.twEase === "back" ?
            "var k = u - 1, e = 1 + 2.70158 * k * k * k + 1.70158 * k * k;" :
            "var e = 1 - Math.pow(1 - u, 3);";
        return "// HAMDY TYPE letters\n" +
            "var spd = Math.max(0.1, effect(\"HAMDY TYPE Speed\")(1)), d = " + dur.toFixed(3) + ", d0 = effect(\"HAMDY TYPE Delay\")(1) * thisComp.frameDuration;\n" +
            "var n = textTotal, i = textIndex - 1;\n" +
            (sp.twOrder === "random" ? "seedRandom(i + 11, true); i = Math.floor(random() * n);\n" : "") +
            (sp.twOrder === "center" ? "i = Math.round(Math.abs(i - (n - 1) / 2) * 2);\n" : "") +
            (isOut ?
                "var T = outPoint - d - (n - 1) / spd, k2 = n - 1 - i, u = clamp((time - T - k2 / spd) / d, 0, 1);\n" + ez + "\nvar v = e * 100;\n" :
                "var u = clamp((time - inPoint - d0 - i / spd) / d, 0, 1);\n" + ez + "\nvar v = (1 - e) * 100;\n") +
            "[v, v, v]";
    }
    function trailExpr(isOut) {
        return "// HAMDY TYPE trail\n" +
            "var spd = Math.max(0.1, effect(\"HAMDY TYPE Speed\")(1)), d0 = effect(\"HAMDY TYPE Delay\")(1) * thisComp.frameDuration;\n" +
            "var i = textIndex - 1, t = time - inPoint - d0 - i / spd;\n" +
            "var v = (t < 0) ? 100 : clamp(1 - t / 0.4, 0, 1) * 100;\n[v, v, v]";
    }
    function addLoopAudio(c, path, t0, dur, above) {
        var f = new File(path);
        if (!f.exists || dur <= 0) { return null; }
        var it = importFile(f), A = c.layers.add(it);
        A.name = "HAMDY SFX | typing";
        tuck(c, A);
        A.startTime = t0;
        if (it.duration < dur) {
            try {
                A.timeRemapEnabled = true;
                A.property("ADBE Time Remapping").expression = "loopOut(\"cycle\")";
            } catch (e) {}
        }
        try { A.outPoint = Math.min(c.duration, t0 + dur); } catch (e2) {}
        if (above) { try { A.moveAfter(above); } catch (e3) {} }
        return A;
    }
    function typeApply(L, c, sp, a) {
        var p = parade(L), i, an;
        for (i = p.numProperties; i >= 1; i--) { if (/^(?:NABD|HAMDY) TYPE/.test(p.property(i).name)) { p.property(i).remove(); } }
        an = L.property("ADBE Text Properties").property("ADBE Text Animators");
        for (i = an.numProperties; i >= 1; i--) { if (/^(?:NABD|HAMDY) (IN|OUT) type/.test(an.property(i).name)) { an.property(i).remove(); } }
        var str = layerText(L), mode = sp.src ? (sp.src.mode || "chars") : "chars";
        var cps = Math.max(1, a.cps || 14);
        var spd = mode === "words" ? Math.max(0.5, cps / 4.5) : (mode === "lines" ? Math.max(0.2, cps / 22) : cps);
        addSlider(L, "HAMDY TYPE Speed", spd);
        addSlider(L, "HAMDY TYPE Delay", a.delay || 0);
        var units = typeUnits(str, mode), typeDur = units / spd;
        if (sp.src) {
            addCheck(L, "HAMDY TYPE Cursor", sp.src.cur ? (a.cursor !== false) : false);
            var st = L.property("ADBE Text Properties").property("ADBE Text Document");
            st.expression = typeSrcExpr(sp);
        } else {
            var based = (a.based === "words") ? 3 : ((a.based === "lines") ? 4 : 1);
            var dur = sp.twDur || 0.18, ins = [], k;
            if (a.doIn !== false) { ins.push(false); }
            if (a.doOut) { ins.push(true); }
            for (k = 0; k < ins.length; k++) {
                an.addProperty("ADBE Text Animator");
                var idx = an.numProperties, A = an.property(idx), j, pr;
                A.name = "HAMDY " + (ins[k] ? "OUT " : "IN ") + sp.id;
                var props = sp.props || [];
                for (j = 0; j < props.length; j++) { A.property("ADBE Text Animator Properties").addProperty(props[j][0]); }
                for (j = 0; j < props.length; j++) {
                    pr = an.property(idx).property("ADBE Text Animator Properties").property(props[j][0]);
                    try { pr.setValue(props[j][1]); } catch (ev) { if (props[j][1] instanceof Array && props[j][1].length > 2) { try { pr.setValue([props[j][1][0], props[j][1][1]]); } catch (ev2) {} } }
                }
                an.property(idx).property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
                var es = an.property(idx).property("ADBE Text Selectors").property(1);
                try { es.property("ADBE Text Range Type2").setValue(based); } catch (eb) {}
                es.property("ADBE Text Expressible Amount").expression = twAmountExpr(sp, ins[k], dur);
            }
            if (sp.trail && a.doIn !== false) {
                an.addProperty("ADBE Text Animator");
                var ti = an.numProperties;
                an.property(ti).name = "HAMDY IN " + sp.id + " trail";
                var TP = an.property(ti).property("ADBE Text Animator Properties");
                if (sp.trail.fill) { TP.addProperty("ADBE Text Fill Color"); try { an.property(ti).property("ADBE Text Animator Properties").property("ADBE Text Fill Color").setValue(rgb(a.acc, [1, 0.42, 0.24]).concat([1])); } catch (ef) {} }
                if (sp.trail.chOff) {
                    an.property(ti).property("ADBE Text Animator Properties").addProperty("ADBE Text Character Offset");
                    try { an.property(ti).property("ADBE Text Animator Properties").property("ADBE Text Character Offset").setValue(sp.trail.chOff); } catch (eo) {}
                }
                an.property(ti).property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
                var es2 = an.property(ti).property("ADBE Text Selectors").property(1);
                try { es2.property("ADBE Text Range Type2").setValue(based); } catch (eb2) {}
                es2.property("ADBE Text Expressible Amount").expression = trailExpr(false);
            }
            typeDur += dur;
        }
        if (a.sfx) { addLoopAudio(c, a.sfx, L.inPoint + (a.delay || 0) * c.frameDuration, Math.min(typeDur, L.outPoint - L.inPoint), L); }
    }

    // ======================================================= layered styles
    function styleKids(c, L) {
        var out = [], i, o;
        for (i = 1; i <= c.numLayers; i++) {
            o = c.layer(i);
            if (o !== L && /^(?:NABD|HAMDY) STYLE/.test(o.name)) { try { if (o.parent === L) { out.push(o); } } catch (e) {} }
        }
        return out;
    }
    function shadowDir(dx, dy) { var a = Math.atan2(dx, -dy) * 180 / Math.PI; return a < 0 ? a + 360 : a; }
    function addHardShadow(L, name, col, dx, dy) {
        var fi = addEffect(L, "ADBE Drop Shadow", name).propertyIndex;
        try { FX(L, fi).property(1).setValue([col[0], col[1], col[2], 1]); } catch (e1) {}
        try { FX(L, fi).property(2).setValue(255); } catch (e2) { try { FX(L, fi).property(2).setValue(100); } catch (e2b) {} }
        try { FX(L, fi).property(3).setValue(shadowDir(dx, dy)); FX(L, fi).property(4).setValue(Math.sqrt(dx * dx + dy * dy)); FX(L, fi).property(5).setValue(0); } catch (e3) {}
    }
    function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    function cleanCopy(D) {
        var p = parade(D), i, tg = D.property("ADBE Transform Group"), pr;
        for (i = p.numProperties; i >= 1; i--) {
            if (/^(?:NABD|HAMDY) STYLE/.test(p.property(i).name)) { p.property(i).remove(); }
            else if (/^(?:NABD|HAMDY) TYPE/.test(p.property(i).name)) { try { p.property(i).property(1).expression = "parent.effect(\"" + p.property(i).name + "\")(1)"; } catch (et) {} }
        }
        for (i = 1; i <= tg.numProperties; i++) {
            pr = tg.property(i);
            try { while (pr.numKeys > 0) { pr.removeKey(1); } } catch (e) {}
            try { if (pr.canSetExpression) { pr.expression = ""; } } catch (e2) {}
        }
    }
    function addCopyLayers(c, L, layers, k) {
        var made = [], i, D, d, tg;
        for (i = layers.length - 1; i >= 0; i--) {
            var ly = layers[i];
            D = L.duplicate();
            cleanCopy(D);
            D.name = "HAMDY STYLE LYR " + (i + 1) + " | " + L.name;
            tuck(c, D);
            try { D.property("ADBE Text Properties").property("ADBE Text Document").expression = "\"\" + parent.text.sourceText"; } catch (es) {}
            var tdp = D.property("ADBE Text Properties").property("ADBE Text Document"), doc = tdp.value;
            try {
                if (ly.fill) { doc.applyFill = true; doc.fillColor = ly.fill; } else { doc.applyFill = false; }
                if (ly.stroke) { doc.applyStroke = true; doc.strokeColor = ly.stroke; doc.strokeWidth = (ly.sw || 6) * k; doc.strokeOverFill = false; } else { doc.applyStroke = false; }
            } catch (ed) {}
            try { tdp.setValue(doc); } catch (ed2) {}
            D.parent = L;
            tg = D.property("ADBE Transform Group");
            try { tg.property("ADBE Anchor Point").expression = "parent.transform.anchorPoint"; } catch (ea) {}
            try { tg.property("ADBE Position").expression = "parent.transform.anchorPoint + [" + ((ly.dx || 0) * k) + ", " + ((ly.dy || 0) * k) + "]"; } catch (ep) {}
            try { tg.property("ADBE Scale").setValue(D.threeDLayer ? [100, 100, 100] : [100, 100]); } catch (esc) {}
            try { tg.property("ADBE Rotate Z").setValue(0); } catch (er) {}
            try { tg.property("ADBE Opacity").setValue(100); } catch (eo) {}
            D.moveAfter(L);
            D.locked = false;
            made.push(D);
        }
        return made;
    }

    // ============================================================ overlays
    function overlay(a) {
        var c = comp(), f = new File(a.file || "");
        if (!f.exists) { throw Err("NO_FILE"); }
        var it = importFile(f), top = topSelected(c), t = snap(c, c.time);
        var L = c.layers.add(it), secs = Math.max(0.5, a.secs || it.duration);
        L.name = "HAMDY OV | " + (a.label || it.name);
        L.startTime = t;
        if (secs > it.duration + 0.01) {
            try { L.timeRemapEnabled = true; L.property("ADBE Time Remapping").expression = "loopOut(\"cycle\")"; } catch (e) {}
        }
        try { L.outPoint = Math.min(c.duration, t + secs); } catch (e2) {}
        fitLayer(L, c);
        try { L.property("ADBE Transform Group").property("ADBE Position").setValue([c.width / 2, c.height / 2]); } catch (e3) {}
        var bm = { screen: BlendingMode.SCREEN, add: BlendingMode.ADD, overlay: BlendingMode.OVERLAY, soft: BlendingMode.SOFT_LIGHT, normal: BlendingMode.NORMAL };
        L.blendingMode = bm[a.blend || "screen"] || BlendingMode.SCREEN;
        if (a.amount !== undefined && a.amount < 100) { L.property("ADBE Transform Group").property("ADBE Opacity").setValue(a.amount); }
        if (a.audio === false) { try { L.audioEnabled = false; } catch (e4) {} }
        L.label = 11;
        if (top && top !== L) { L.moveBefore(top); }
        return "OK";
    }

    // ================================================ on the beat
    function beatExpr(nm) {
        return 'var m = thisComp.layer(' + J(nm) + ').marker, d = 99;\n' +
            'if (m.numKeys > 0) {\n    var k = m.nearestKey(time).index;\n    if (m.key(k).time > time) { k--; }\n    if (k > 0) { d = time - m.key(k).time; }\n}\n' +
            'var e = Math.exp(-d * effect("HAMDY Beat Decay")(1)) * effect("HAMDY Beat Amount")(1) / 100;\n';
    }
    function beatApply(a) {
        var c = comp(), A = c.layer(a.audio), i, times = a.times || [];
        if (!times.length) { throw Err("NO_BEATS"); }
        var mk = A.property("ADBE Marker");
        for (i = mk.numKeys; i >= 1; i--) { try { if (mk.keyValue(i).comment === "beat") { mk.removeKey(i); } } catch (e0) {} }
        for (i = 0; i < times.length; i++) { mk.setValueAtTime(times[i], new MarkerValue("beat")); }
        if (a.mode === "markers") { return "OK_BEATS:" + times.length; }
        if (a.mode === "cut") { return beatCut(c, A, times); }
        var t0 = Math.max(0, times[0] - 0.1), t1 = Math.min(c.duration, times[times.length - 1] + 1.2), E = beatExpr(A.name), L, fx;
        L = c.layers.addSolid(a.mode === "flash" ? [1, 1, 1] : [0.5, 0.5, 0.5], "HAMDY BEAT " + a.mode, c.width, c.height, c.pixelAspect, c.duration);
        if (a.mode !== "flash") { L.adjustmentLayer = true; }
        L.inPoint = t0; L.outPoint = t1; L.label = 11;
        addSlider(L, "HAMDY Beat Amount", a.amt || 100);
        addSlider(L, "HAMDY Beat Decay", a.decay || 10);
        switch (a.mode) {
            case "zoom": fx = addEffect(L, "ADBE Geometry2", "HAMDY Beat Zoom"); fx.property(4).expression = E + 'value + e * 12'; break;
            case "shake":
                fx = addEffect(L, "ADBE Geometry2", "HAMDY Beat Shake");
                fx.property(2).expression = E + 'var s = thisComp.height * 0.025 * e;\nvalue + [Math.sin(time * 61) * s, Math.cos(time * 47) * s]';
                fx.property(8).expression = E + 'value + Math.sin(time * 53) * 2.5 * e';
                fx.property(4).expression = E + 'value + e * 6';
                break;
            case "glow": fx = addEffect(L, "ADBE Glo2", "HAMDY Beat Glow"); fx.property(3).setValue(Math.round(c.height * 0.05)); fx.property(4).expression = E + 'e * 3'; break;
            case "blur": fx = addEffect(L, "ADBE Gaussian Blur 2", "HAMDY Beat Blur"); fx.property(1).expression = E + 'e * 30'; try { fx.property(3).setValue(1); } catch (e1) {} break;
            case "flash":
                L.blendingMode = BlendingMode.ADD;
                L.property("ADBE Transform Group").property("ADBE Opacity").expression = E + 'e * 70';
                break;
        }
        L.moveToBeginning();
        return "OK_BEATS:" + times.length;
    }
    function beatCut(c, A, times) {
        var sel = c.selectedLayers, src = [], i, n = 0, L;
        for (i = 0; i < sel.length; i++) { if (sel[i] !== A && isAV(sel[i]) && sel[i].hasVideo) { src.push(sel[i]); } }
        if (!src.length) { throw Err("NEED_VISUAL"); }
        src.sort(function (x, y) { return x.index - y.index; });
        var gap = times.length > 1 ? (times[times.length - 1] - times[0]) / (times.length - 1) : 0.5, used = [];
        for (i = 0; i < times.length && i < 300; i++) {
            var base = src[i % src.length], t = times[i], e = (i + 1 < times.length) ? times[i + 1] : t + gap;
            L = used[i % src.length] ? base.duplicate() : base; used[i % src.length] = true;
            L.startTime = t;
            L.inPoint = t; L.outPoint = Math.min(c.duration, e);
            n++;
        }
        return "OK_BEATS:" + n;
    }

    // ================================================ align & distribute
    function boxOf(L, t) {
        var r = L.sourceRectAtTime(t, false), T = L.property("ADBE Transform Group");
        var p = T.property("ADBE Position").valueAtTime(t, false), an = T.property("ADBE Anchor Point").valueAtTime(t, false), s = T.property("ADBE Scale").valueAtTime(t, false);
        var sx = s[0] / 100, sy = s[1] / 100;
        var x0 = p[0] + (r.left - an[0]) * sx, y0 = p[1] + (r.top - an[1]) * sy, x1 = x0 + r.width * sx, y1 = y0 + r.height * sy;
        return { x0: Math.min(x0, x1), y0: Math.min(y0, y1), x1: Math.max(x0, x1), y1: Math.max(y0, y1) };
    }
    function moveBy(L, dx, dy, t) {
        var P = L.property("ADBE Transform Group").property("ADBE Position"), k;
        if (P.dimensionsSeparated) {
            var X = L.property("ADBE Transform Group").property("ADBE Position_0"), Y = L.property("ADBE Transform Group").property("ADBE Position_1");
            shiftProp(X, dx); shiftProp(Y, dy); return;
        }
        if (P.numKeys) { for (k = 1; k <= P.numKeys; k++) { var v = P.keyValue(k); v[0] += dx; v[1] += dy; P.setValueAtKey(k, v); } }
        else { var w = P.value; w[0] += dx; w[1] += dy; P.setValue(w); }
    }
    function shiftProp(p, d) { var k; if (p.numKeys) { for (k = 1; k <= p.numKeys; k++) { p.setValueAtKey(k, p.keyValue(k) + d); } } else { p.setValue(p.value + d); } }
    function alignLayers(a) {
        var c = comp(), t = c.time, sel = c.selectedLayers, Ls = [], B = [], i;
        for (i = 0; i < sel.length; i++) { if (isAV(sel[i]) && !sel[i].parent) { Ls.push(sel[i]); } }
        if (!Ls.length) { throw Err("NO_LAYERS"); }
        for (i = 0; i < Ls.length; i++) { B.push(boxOf(Ls[i], t)); }
        var R = { x0: 0, y0: 0, x1: c.width, y1: c.height };
        if (a.to === "sel" && Ls.length > 1) { R = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 }; for (i = 0; i < B.length; i++) { R.x0 = Math.min(R.x0, B[i].x0); R.y0 = Math.min(R.y0, B[i].y0); R.x1 = Math.max(R.x1, B[i].x1); R.y1 = Math.max(R.y1, B[i].y1); } }
        var m = a.mode;
        if (m === "distH" || m === "distV") {
            if (Ls.length < 3 && a.to === "sel") { throw Err("NEED3"); }
            var ix = [], H = m === "distH", tot = 0, span, gap, cur;
            for (i = 0; i < Ls.length; i++) { ix.push(i); tot += H ? (B[i].x1 - B[i].x0) : (B[i].y1 - B[i].y0); }
            ix.sort(function (p, q) { return H ? B[p].x0 - B[q].x0 : B[p].y0 - B[q].y0; });
            span = H ? (R.x1 - R.x0) : (R.y1 - R.y0);
            gap = (span - tot) / Math.max(1, Ls.length - 1);
            if (Ls.length === 1) { gap = 0; }
            cur = H ? R.x0 : R.y0;
            if (a.to !== "sel") { gap = (span - tot) / (Ls.length + 1); cur += gap; }
            for (i = 0; i < ix.length; i++) {
                var b = B[ix[i]];
                if (H) { moveBy(Ls[ix[i]], cur - b.x0, 0, t); cur += (b.x1 - b.x0) + gap; }
                else { moveBy(Ls[ix[i]], 0, cur - b.y0, t); cur += (b.y1 - b.y0) + gap; }
            }
            return "OK";
        }
        for (i = 0; i < Ls.length; i++) {
            var q = B[i], dx = 0, dy = 0;
            if (m === "left") { dx = R.x0 - q.x0; } else if (m === "right") { dx = R.x1 - q.x1; } else if (m === "hcenter") { dx = (R.x0 + R.x1) / 2 - (q.x0 + q.x1) / 2; }
            else if (m === "top") { dy = R.y0 - q.y0; } else if (m === "bottom") { dy = R.y1 - q.y1; } else if (m === "vcenter") { dy = (R.y0 + R.y1) / 2 - (q.y0 + q.y1) / 2; }
            else if (m === "center") { dx = (R.x0 + R.x1) / 2 - (q.x0 + q.x1) / 2; dy = (R.y0 + R.y1) / 2 - (q.y0 + q.y1) / 2; }
            moveBy(Ls[i], dx, dy, t);
        }
        return "OK";
    }

    // ================================================ custom bezier curve -> AE speed/influence
    function easeCurve(a) {
        var props = selectedProps(true), i, j, p, ks, n = 0, x1 = Math.max(0.001, Math.min(0.999, a.x1)), y1 = a.y1, x2 = Math.max(0.001, Math.min(0.999, a.x2)), y2 = a.y2;
        for (i = 0; i < props.length; i++) {
            p = props[i]; ks = p.selectedKeys;
            for (j = 0; j < ks.length; j++) {
                var k = ks[j];
                if (k >= p.numKeys) { continue; }
                if (j + 1 < ks.length && ks[j + 1] !== k + 1 && ks.length > 1) { continue; }
                try { curveSeg(p, k, x1, y1, x2, y2); n++; } catch (e) {}
            }
        }
        if (!n) { throw Err("NO_KEYS"); }
        return "OK";
    }
    function curveSeg(p, k, x1, y1, x2, y2) {
        var dt = p.keyTime(k + 1) - p.keyTime(k), v0 = p.keyValue(k), v1 = p.keyValue(k + 1), dims, sp = [], i;
        var spatial = p.propertyValueType === PropertyValueType.TwoD_SPATIAL || p.propertyValueType === PropertyValueType.ThreeD_SPATIAL;
        if (spatial) { var d = 0; for (i = 0; i < v0.length; i++) { d += (v1[i] - v0[i]) * (v1[i] - v0[i]); } sp = [Math.sqrt(d) / dt]; }
        else if (v0 instanceof Array) { for (i = 0; i < easeDims(p); i++) { sp.push((v1[i] - v0[i]) / dt); } }
        else { sp = [(v1 - v0) / dt]; }
        dims = sp.length;
        var oIn = p.keyInTemporalEase(k), out = [], inn = [], nIn = p.keyOutTemporalEase(k + 1);
        for (i = 0; i < dims; i++) {
            out.push(new KeyframeEase(sp[i] * (y1 / x1), Math.max(0.1, Math.min(100, x1 * 100))));
            inn.push(new KeyframeEase(sp[i] * ((1 - y2) / (1 - x2)), Math.max(0.1, Math.min(100, (1 - x2) * 100))));
        }
        p.setInterpolationTypeAtKey(k, p.keyInInterpolationType(k), KeyframeInterpolationType.BEZIER);
        p.setInterpolationTypeAtKey(k + 1, KeyframeInterpolationType.BEZIER, p.keyOutInterpolationType(k + 1));
        p.setTemporalEaseAtKey(k, oIn.length === dims ? oIn : out, out);
        p.setTemporalEaseAtKey(k + 1, inn, nIn.length === dims ? nIn : inn);
    }

    // ================================================ social & render
    function verticalize(a) {
        var src = comp(), W = a.w || 1080, H = a.h || 1920;
        var c = app.project.items.addComp(src.name + " " + W + "x" + H, W, H, 1, src.duration, 1 / src.frameDuration);
        var fg = c.layers.add(src), sF = Math.min(W / src.width, H / src.height) * 100, sC = Math.max(W / src.width, H / src.height) * 100;
        fg.name = "HAMDY FG"; fg.property("ADBE Transform Group").property("ADBE Scale").setValue([a.mode === "fill" ? sC : sF, a.mode === "fill" ? sC : sF]);
        if (a.mode !== "fill") {
            var bg = c.layers.add(src); bg.name = "HAMDY BG BLUR"; bg.moveAfter(fg);
            bg.property("ADBE Transform Group").property("ADBE Scale").setValue([sC * 1.08, sC * 1.08]);
            var b = addEffect(bg, "ADBE Gaussian Blur 2", "HAMDY BG Blur"); b.property(1).setValue(Math.round(W * 0.06)); try { b.property(3).setValue(1); } catch (e) {}
            var bc = addEffect(bg, "ADBE Brightness & Contrast 2", "HAMDY BG Dim"); try { bc.property(1).setValue(-25); } catch (e2) {}
            try { bg.audioEnabled = false; } catch (e3) {}
        }
        c.openInViewer();
        return "OK";
    }
    function unusedItems(a) {
        var it, i, list = [], n = app.project.numItems;
        for (i = n; i >= 1; i--) {
            it = app.project.item(i);
            if ((it instanceof FootageItem) && it.usedIn.length === 0 && !(it.mainSource instanceof SolidSource)) { list.push(it); }
        }
        if (!a.remove) { var names = []; for (i = 0; i < list.length && i < 40; i++) { names.push(list[i].name); } return { count: list.length, names: names }; }
        for (i = 0; i < list.length; i++) { try { list[i].remove(); } catch (e) {} }
        return "OK_REMOVED:" + list.length;
    }
    function outFolder() {
        var f = app.project.file ? app.project.file.parent : Folder.desktop, o = new Folder(f.fsName + "/Hamdy Exports");
        if (!o.exists) { o.create(); }
        return o;
    }
    function renderNow(a) {
        var c = comp(), q = app.project.renderQueue, rq = q.items.add(c), om = rq.outputModule(1), ok = false, i;
        var names = a.fmt === "hq" ? ["High Quality", "Apple ProRes 422 HQ", "Lossless"] : ["H.264 - Match Render Settings - 15 Mbps", "H.264 - Match Render Settings - 5 Mbps", "H.264 - Match Render Settings - 40 Mbps", "H.264"];
        if (a.fmt !== "ame") { for (i = 0; i < names.length && !ok; i++) { try { om.applyTemplate(names[i]); ok = true; } catch (e) {} } }
        var stamp = new Date(), nm = c.name.replace(/[\\\/:\*\?"<>\|]/g, "_") + "_" + stamp.getHours() + "-" + stamp.getMinutes() + "-" + stamp.getSeconds();
        try { om.file = new File(outFolder().fsName + "/" + nm); } catch (e2) {}
        if (a.fmt === "ame" || !ok) {
            if (q.canQueueInAME) { q.queueInAME(a.fmt === "ame"); return a.fmt === "ame" ? "OK_AME" : "OK_AME_FALLBACK"; }
            if (!ok) { throw Err("NO_TEMPLATE"); }
        }
        q.render();
        return { path: om.file ? om.file.fsName : outFolder().fsName };
    }
    function saveFramePng(a) {
        var c = comp(), t = snap(c, c.time), nm = c.name.replace(/[\\\/:\*\?"<>\|]/g, "_") + "_" + Math.round(t / c.frameDuration) + ".png";
        var f = new File(outFolder().fsName + "/" + nm);
        if (typeof c.saveFrameToPng !== "function") { throw Err("NO_SAVEFRAME"); }
        c.saveFrameToPng(t, f);
        return { path: f.fsName };
    }
    function openFolder(a) { var f = new Folder(a.path || outFolder().fsName); if (f.exists) { f.execute(); } return "OK"; }

    // ================================================ local cut-out (background removal) helpers
    function layerFrame(a) {
        var c = comp(), sel = c.selectedLayers, L = null, i;
        for (i = 0; i < sel.length; i++) { if (isAV(sel[i]) && sel[i].source && sel[i].hasVideo && sel[i].matchName === "ADBE AV Layer") { L = sel[i]; break; } }
        if (!L) { throw Err("NEED_IMAGE"); }
        var src = L.source, still = false;
        try { still = src.mainSource && src.mainSource.isStill; } catch (e0) {}
        if (still && src.file && /\.(png|jpe?g|webp|bmp)$/i.test(src.file.name)) { return { path: src.file.fsName, index: L.index, still: true }; }
        if (!(src instanceof FootageItem) && !(src instanceof CompItem)) { throw Err("NEED_IMAGE"); }
        var t = (c.time - L.startTime) * (L.stretch ? 100 / L.stretch : 1);
        var tc = app.project.items.addComp("HAMDY tmp frame", src.width, src.height, src.pixelAspect || 1, Math.max(0.1, src.duration || 1), 1 / c.frameDuration);
        tc.layers.add(src);
        var f = new File(Folder.temp.fsName + "/hamdy_frame_" + new Date().getTime() + ".png");
        try { tc.saveFrameToPng(Math.max(0, Math.min(t, tc.duration - tc.frameDuration)), f); } catch (e1) { tc.remove(); throw e1; }
        $.sleep(400);
        tc.remove();
        return { path: f.fsName, index: L.index, still: !!still };
    }
    function placeCutout(a) {
        var c = comp(), L = c.layer(a.index), f = new File(a.path);
        if (!f.exists) { throw Err("NO_FILE"); }
        var it = importFile(f), C = c.layers.add(it), T = L.property("ADBE Transform Group"), CT = C.property("ADBE Transform Group"), nm, k;
        C.name = "HAMDY CUTOUT | " + L.name;
        var props = ["ADBE Anchor Point", "ADBE Position", "ADBE Scale", "ADBE Rotate Z", "ADBE Opacity"];
        for (k = 0; k < props.length; k++) {
            try {
                var sp = T.property(props[k]), dp = CT.property(props[k]);
                if (sp.numKeys === 0) { dp.setValue(sp.value); }
                else { dp.expression = 'thisComp.layer(' + J(L.name) + ').transform.' + ({ "ADBE Anchor Point": "anchorPoint", "ADBE Position": "position", "ADBE Scale": "scale", "ADBE Rotate Z": "rotation", "ADBE Opacity": "opacity" })[props[k]]; }
            } catch (e) {}
        }
        try { C.parent = L.parent; } catch (e2) {}
        C.startTime = L.inPoint; C.inPoint = L.inPoint; C.outPoint = L.outPoint;
        C.moveBefore(L);
        if (a.mode === "replace") { L.enabled = false; }
        if (a.mode === "behind") {
            // put the selected text layers (if any) between the photo and the cut-out
            var sel = c.selectedLayers, i, moved = 0;
            for (i = 0; i < sel.length; i++) { if (sel[i].matchName === "ADBE Text Layer") { sel[i].moveAfter(C); moved++; } }
            if (!moved) {
                var tx = c.layers.addText(a.text || "\u062d\u0645\u062f\u064a"); tx.name = "HAMDY BEHIND TEXT";
                var d = tx.property("ADBE Text Properties").property("ADBE Text Document"), td = d.value;
                td.fontSize = Math.round(c.height * 0.22); td.fillColor = [1, 1, 1]; td.justification = ParagraphJustification.CENTER_JUSTIFY; if (a.font) { try { td.font = a.font; } catch (ef) {} }
                d.setValue(td);
                tx.property("ADBE Transform Group").property("ADBE Anchor Point").expression = 'var r = sourceRectAtTime(time, false);\n[r.left + r.width / 2, r.top + r.height / 2]';
                tx.property("ADBE Transform Group").property("ADBE Position").setValue([c.width / 2, c.height * 0.4]);
                tx.inPoint = L.inPoint; tx.outPoint = L.outPoint;
                tx.moveAfter(C);
            }
        }
        return a.still ? "OK" : "OK_FRAME_ONLY";
    }

    // ================================================ speed tools: ease copy/paste/read, auto animations, text break, re-key
    function easeCopy(a) {
        var props = selectedProps(true), p, k;
        if (!props.length) { throw Err("NO_KEYS"); }
        p = props[0]; k = p.selectedKeys[0];
        function pack(arr) { var o = [], i; for (i = 0; i < arr.length; i++) { o.push([arr[i].speed, arr[i].influence]); } return o; }
        var r = { inE: pack(p.keyInTemporalEase(k)), outE: pack(p.keyOutTemporalEase(k)), inT: p.keyInInterpolationType(k), outT: p.keyOutInterpolationType(k) };
        // also read the curve of the segment from this key to the next one (for the curve editor)
        if (k < p.numKeys) {
            try {
                var dt = p.keyTime(k + 1) - p.keyTime(k), v0 = p.keyValue(k), v1 = p.keyValue(k + 1), sp, d = 0, q;
                var spatial = p.propertyValueType === PropertyValueType.TwoD_SPATIAL || p.propertyValueType === PropertyValueType.ThreeD_SPATIAL;
                if (v0 instanceof Array) { if (spatial) { for (q = 0; q < v0.length; q++) { d += (v1[q] - v0[q]) * (v1[q] - v0[q]); } sp = Math.sqrt(d) / dt; } else { sp = (v1[0] - v0[0]) / dt; } } else { sp = (v1 - v0) / dt; }
                var o = p.keyOutTemporalEase(k)[0], n = p.keyInTemporalEase(k + 1)[0], x1 = o.influence / 100, x2 = 1 - n.influence / 100;
                if (Math.abs(sp) > 1e-6) { r.curve = [x1, x1 * o.speed / sp, x2, 1 - (1 - x2) * n.speed / sp]; }
            } catch (e) {}
        }
        return r;
    }
    function easePaste(a) {
        var props = selectedProps(true), i, j, p, ks, n = 0, E = a.ease;
        function unpack(arr, dims) { var o = [], i2; for (i2 = 0; i2 < dims; i2++) { var s = arr[Math.min(i2, arr.length - 1)]; o.push(new KeyframeEase(s[0], Math.max(0.1, Math.min(100, s[1])))); } return o; }
        for (i = 0; i < props.length; i++) {
            p = props[i]; ks = p.selectedKeys;
            for (j = 0; j < ks.length; j++) {
                try {
                    var dims = p.keyInTemporalEase(ks[j]).length;
                    p.setInterpolationTypeAtKey(ks[j], E.inT || KeyframeInterpolationType.BEZIER, E.outT || KeyframeInterpolationType.BEZIER);
                    p.setTemporalEaseAtKey(ks[j], a.which === "out" ? p.keyInTemporalEase(ks[j]) : unpack(E.inE, dims), a.which === "in" ? p.keyOutTemporalEase(ks[j]) : unpack(E.outE, dims));
                    n++;
                } catch (e) {}
            }
        }
        if (!n) { throw Err("NO_KEYS"); }
        return "OK";
    }
    var AUTO = {
        excite: { props: ["keyed"], sl: [["Amplitude", 6], ["Frequency", 2.5], ["Decay", 6]],
            ex: 'var amp = effect("HAMDY Excite Amplitude")(1) / 100, freq = effect("HAMDY Excite Frequency")(1), dec = effect("HAMDY Excite Decay")(1);\nvar n = 0;\nif (numKeys > 0) { n = nearestKey(time).index; if (key(n).time > time) { n--; } }\nif (n > 0 && n == numKeys) {\n    var t = time - key(n).time;\n    var v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);\n    value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(dec * t);\n} else { value; }' },
        bounce: { props: ["keyed"], sl: [["Elasticity", 70], ["Gravity", 4000]],
            ex: 'var e = effect("HAMDY Bounce Elasticity")(1) / 100, g = effect("HAMDY Bounce Gravity")(1), nMax = 9, n = 0;\nif (numKeys > 0) { n = nearestKey(time).index; if (key(n).time > time) { n--; } }\nif (n > 0 && n == numKeys) {\n    var t = time - key(n).time, v = -velocityAtTime(key(n).time - .001) * e, vl = length(v), vu = (vl > 0) ? normalize(v) : (value instanceof Array ? value * 0 : 0);\n    var tCur = 0, segDur = 2 * vl / g, tNext = segDur, nb = 1;\n    while (tNext < t && nb <= nMax) { vl *= e; segDur *= e; tCur = tNext; tNext += segDur; nb++; }\n    if (nb <= nMax) { var d = t - tCur; value + vu * d * (vl - g * d / 2); } else { value; }\n} else { value; }' },
        spin: { props: ["ADBE Rotate Z"], sl: [["Speed", 90]], ex: 'value + (time - inPoint) * effect("HAMDY Spin Speed")(1)' },
        orbit: { props: ["ADBE Position"], sl: [["Radius", 120], ["Speed", 60]], ex: 'var r = effect("HAMDY Orbit Radius")(1), a = degreesToRadians((time - inPoint) * effect("HAMDY Orbit Speed")(1));\nvalue + [Math.cos(a) * r, Math.sin(a) * r].concat(value.length > 2 ? [0] : [])' },
        "float": { props: ["ADBE Position"], sl: [["Height", 25], ["Speed", 1]], ex: 'value + [0, Math.sin((time - inPoint) * effect("HAMDY Float Speed")(1) * 2 * Math.PI) * effect("HAMDY Float Height")(1)].concat(value.length > 2 ? [0] : [])' },
        swing: { props: ["ADBE Rotate Z"], sl: [["Angle", 25], ["Speed", 1.2], ["Decay", 0]], ex: 'var t = time - inPoint;\nvalue + effect("HAMDY Swing Angle")(1) * Math.sin(t * effect("HAMDY Swing Speed")(1) * 2 * Math.PI) * Math.exp(-effect("HAMDY Swing Decay")(1) * t)' },
        pulse: { props: ["ADBE Scale"], sl: [["Amount", 8], ["Speed", 1.5]], ex: 'var s = 1 + Math.abs(Math.sin((time - inPoint) * effect("HAMDY Pulse Speed")(1) * Math.PI)) * effect("HAMDY Pulse Amount")(1) / 100;\nvalue * s' },
        blink: { props: ["ADBE Opacity"], sl: [["Rate", 4], ["Duty %", 50]], ex: 'var r = effect("HAMDY Blink Rate")(1), d = effect("HAMDY Blink Duty %")(1) / 100;\n(((time - inPoint) * r) % 1) < d ? value : 0' },
        shake: { props: ["ADBE Position"], sl: [["Amount", 20], ["Speed", 6]], ex: 'wiggle(effect("HAMDY Shake Speed")(1), effect("HAMDY Shake Amount")(1))' },
        wheel: { props: ["ADBE Rotate Z"], sl: [["Radius", 100]], ex: 'var p = transform.position, d = p.valueAtTime(time)[0] - p.valueAtTime(inPoint)[0];\nvalue + radiansToDegrees(d / Math.max(1, effect("HAMDY Wheel Radius")(1)))' },
        stare: { props: ["ADBE Rotate Z"], sl: [["Offset", 0]], layer: "Target", ex: 'try {\n    var L = effect("HAMDY Stare Target")(1), d = L.toComp(L.anchorPoint) - toComp(anchorPoint);\n    radiansToDegrees(Math.atan2(d[1], d[0])) + effect("HAMDY Stare Offset")(1);\n} catch (e) { value; }' },
        looper: { props: ["keyed"], sl: [["Mode 0-2", 0]], ex: 'var m = Math.round(effect("HAMDY Looper Mode 0-2")(1));\ntry { m == 1 ? loopOut("pingpong") : (m == 2 ? loopOut("continue") : loopOut("cycle")); } catch (e) { value; }' }
    };
    function autoAnim(a) {
        var c = comp(), sel = c.selectedLayers, A = AUTO[a.kind], i, j, n = 0, L, T, ps, p;
        if (!A) { throw Err("BAD_ARGS"); }
        if (!sel.length) { throw Err("NO_LAYERS"); }
        var nm = a.kind.charAt(0).toUpperCase() + a.kind.substr(1);
        for (i = 0; i < sel.length; i++) {
            L = sel[i]; T = L.property("ADBE Transform Group"); if (!T) { continue; }
            var targets = [];
            if (A.props[0] === "keyed") {
                ps = L.selectedProperties;
                for (j = 0; j < ps.length; j++) { if (ps[j].propertyType === PropertyType.PROPERTY && ps[j].numKeys > 0 && ps[j].canSetExpression) { targets.push(ps[j]); } }
                if (!targets.length) { var tn = ["ADBE Position", "ADBE Scale", "ADBE Rotate Z", "ADBE Opacity"]; for (j = 0; j < tn.length; j++) { try { p = T.property(tn[j]); if (p.numKeys > 1) { targets.push(p); } } catch (e) {} } }
            } else {
                p = T.property(A.props[0]);
                if (A.props[0] === "ADBE Position" && p.dimensionsSeparated) { p.dimensionsSeparated = false; }
                targets.push(p);
            }
            if (!targets.length) { continue; }
            for (j = 0; j < A.sl.length; j++) { if (!dpEff(L, "HAMDY " + nm + " " + A.sl[j][0])) { addSlider(L, "HAMDY " + nm + " " + A.sl[j][0], (a.strength || 1) * A.sl[j][1] * (/Decay|Mode|Duty|Gravity|Elasticity|Offset|Rate|Frequency|Speed/.test(A.sl[j][0]) ? 1 / (a.strength || 1) : 1)); } }
            if (A.layer && !dpEff(L, "HAMDY " + nm + " " + A.layer)) { addEffect(L, "ADBE Layer Control", "HAMDY " + nm + " " + A.layer); }
            for (j = 0; j < targets.length; j++) { targets[j].expression = A.ex; n++; }
        }
        if (!n) { throw Err("NO_KEYS"); }
        return "OK";
    }
    function textBreak(a) {
        var c = comp(), sel = c.selectedLayers, i, made = 0;
        for (i = 0; i < sel.length; i++) {
            var L = sel[i]; if (L.matchName !== "ADBE Text Layer") { continue; }
            var str = String(L.property("ADBE Text Properties").property("ADBE Text Document").value.text), units = [], k;
            if (a.by === "line") { units = str.split(/\r|\n/); }
            else if (a.by === "char") { units = str.replace(/\s/g, "").split(""); }
            else { units = str.replace(/[\r\n]+/g, " ").split(/\s+/); }
            var cnt = 0; for (k = 0; k < units.length; k++) { if (units[k] !== "") { cnt++; } }
            if (cnt < 2) { continue; }
            var basedOn = a.by === "line" ? 4 : (a.by === "char" ? 2 : 3), idx = 0;
            for (k = 0; k < units.length; k++) {
                if (units[k] === "") { continue; }
                var D = L.duplicate(); D.name = L.name + " | " + units[k];
                var an = D.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator"); an.name = "HAMDY Break";
                an.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(0);
                an.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
                var s2 = an.property("ADBE Text Selectors").addProperty("ADBE Text Selector"), adv = s2.property("ADBE Text Range Advanced");
                try { adv.property("ADBE Text Range Units").setValue(2); adv.property("ADBE Text Range Type2").setValue(basedOn); adv.property("ADBE Text Selector Mode").setValue(2); } catch (e1) {}
                s2.property("ADBE Text Index Start").setValue(idx); s2.property("ADBE Text Index End").setValue(idx + 1);
                idx++; made++;
            }
            L.enabled = false;
        }
        if (!made) { throw Err("NO_TEXTLAYER"); }
        return "OK";
    }
    function keySave(a) {
        var props = selectedProps(true), out = [], i, j, t0 = 1e9, p, ks;
        for (i = 0; i < props.length; i++) { ks = props[i].selectedKeys; for (j = 0; j < ks.length; j++) { t0 = Math.min(t0, props[i].keyTime(ks[j])); } }
        for (i = 0; i < props.length; i++) {
            p = props[i]; ks = p.selectedKeys; var keys = [];
            for (j = 0; j < ks.length; j++) {
                var k = ks[j], ie = p.keyInTemporalEase(k), oe = p.keyOutTemporalEase(k), pi = [], po = [], q;
                for (q = 0; q < ie.length; q++) { pi.push([ie[q].speed, ie[q].influence]); po.push([oe[q].speed, oe[q].influence]); }
                keys.push({ t: p.keyTime(k) - t0, v: p.keyValue(k), i: pi, o: po, it: p.keyInInterpolationType(k), ot: p.keyOutInterpolationType(k) });
            }
            out.push({ mn: p.matchName, path: propPath(p), keys: keys });
        }
        if (!out.length) { throw Err("NO_KEYS"); }
        return { props: out };
    }
    function propPath(p) { var a = [], q = p; while (q && q.parentProperty) { a.unshift(q.matchName); q = q.parentProperty; } return a; }
    function keyApply(a) {
        var c = comp(), sel = c.selectedLayers, t0 = c.time, i, j, k, n = 0;
        if (!sel.length) { throw Err("NO_LAYERS"); }
        for (i = 0; i < sel.length; i++) {
            for (j = 0; j < a.preset.props.length; j++) {
                var P0 = a.preset.props[j], q = sel[i], z;
                try { for (z = 0; z < P0.path.length; z++) { q = q.property(P0.path[z]); } } catch (e) { q = null; }
                if (!q || !q.setValueAtTime) { continue; }
                var rel = a.mode === "relative" && !(P0.keys[0].v instanceof Array && P0.keys[0].v.length > 3);
                var cur = q.valueAtTime(t0, true), base = P0.keys[0].v;
                for (k = 0; k < P0.keys.length; k++) {
                    var K = P0.keys[k], v = K.v;
                    if (rel) { if (v instanceof Array) { var w = [], d; for (d = 0; d < v.length; d++) { w.push(cur[d] + v[d] - base[d]); } v = w; } else if (typeof v === "number") { v = cur + v - base; } }
                    try { q.setValueAtTime(t0 + K.t * (a.speed || 1), v); var ki = q.nearestKeyIndex(t0 + K.t * (a.speed || 1)); q.setInterpolationTypeAtKey(ki, K.it, K.ot);
                        var ie = [], oe = [], m; for (m = 0; m < K.i.length; m++) { ie.push(new KeyframeEase(K.i[m][0] / (a.speed || 1), K.i[m][1])); oe.push(new KeyframeEase(K.o[m][0] / (a.speed || 1), K.o[m][1])); }
                        q.setTemporalEaseAtKey(ki, ie, oe); } catch (e2) {}
                }
                n++;
            }
        }
        if (!n) { throw Err("NO_MATCH"); }
        return "OK";
    }

    // ================================================ templates (UI, explainer/collage, news, scenes)
    // A template is a list of layer specs designed on a 1920x1080 canvas around an anchor point.
    // Every layer is parented to one control null ("HAMDY TPL \u2026") that holds the colours, so the whole
    // template can be moved, scaled and recoloured after it lands. Same spec drives the panel preview.
    var TEZ = { o: [10, 85], i: [85, 10], io: [60, 60], b: [10, 85] };
    function tplHex(h) { h = String(h).replace("#", ""); return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255]; }
    function tplCol(N, nm, v, cols) {
        if (typeof v === "string" && /^c\d$/.test(v)) { return { expr: 'thisComp.layer(' + J(nm) + ').effect("HAMDY Color ' + v.substr(1) + '")(1)', val: cols[+v.substr(1) - 1] || [1, 1, 1] }; }
        return { val: tplHex(v || "#ffffff") };
    }
    function tplKeys(prop, t0, keys, ez, map) {
        var i, idx = [];
        for (i = 0; i < keys.length; i++) { prop.setValueAtTime(t0 + keys[i][0], map(keys[i][1])); }
        if (ez === "l") { for (i = 0; i < keys.length; i++) { try { setLinear(prop, prop.nearestKeyIndex(t0 + keys[i][0])); } catch (e) {} } return; }
        var E = TEZ[ez || "o"] || TEZ.o;
        for (i = 0; i < keys.length; i++) { idx.push(prop.nearestKeyIndex(t0 + keys[i][0])); }
        for (i = 0; i < idx.length; i++) {
            var inn = i > 0 ? E[1] : 33, out = i < idx.length - 1 ? E[0] : 33;
            try { setEase(prop, idx[i], inn, out); } catch (e2) {}
        }
    }
    function tplShape(c, sp, nm, cols) {
        var L = c.layers.addShape(), G = L.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"), V = G.property("ADBE Vectors Group"), s;
        G.name = "Shape";
        if (sp.t === "rect") {
            s = V.addProperty("ADBE Vector Shape - Rect"); s.property("ADBE Vector Rect Size").setValue(sp.s); s.property("ADBE Vector Rect Roundness").setValue(sp.r || 0);
            if (sp.org === "l") { s.property("ADBE Vector Rect Position").setValue([sp.s[0] / 2, 0]); }
            if (sp.org === "r") { s.property("ADBE Vector Rect Position").setValue([-sp.s[0] / 2, 0]); }
        } else if (sp.t === "ell") {
            s = V.addProperty("ADBE Vector Shape - Ellipse"); s.property("ADBE Vector Ellipse Size").setValue(sp.s);
        } else {
            s = V.addProperty("ADBE Vector Shape - Group");
            var sh = new Shape(), vs = [], k; for (k = 0; k < sp.pts.length; k++) { vs.push([sp.pts[k][0], sp.pts[k][1]]); }
            sh.vertices = vs; sh.closed = !!sp.closed;
            if (sp.smooth) { var it = [], ot = [], q; for (q = 0; q < vs.length; q++) { var pv = vs[Math.max(0, q - 1)], nx = vs[Math.min(vs.length - 1, q + 1)], tx = (nx[0] - pv[0]) / 6, ty = (nx[1] - pv[1]) / 6; it.push([-tx, -ty]); ot.push([tx, ty]); } sh.inTangents = it; sh.outTangents = ot; }
            s.property("ADBE Vector Shape").setValue(sh);
        }
        if (sp.f) { var F = V.addProperty("ADBE Vector Graphic - Fill"), fc = tplCol(null, nm, sp.f, cols); F.property("ADBE Vector Fill Color").setValue(fc.val); if (fc.expr) { F.property("ADBE Vector Fill Color").expression = fc.expr; } }
        if (sp.st) {
            var S2 = V.addProperty("ADBE Vector Graphic - Stroke"), sc = tplCol(null, nm, sp.st[0], cols);
            S2.property("ADBE Vector Stroke Color").setValue(sc.val); if (sc.expr) { S2.property("ADBE Vector Stroke Color").expression = sc.expr; }
            S2.property("ADBE Vector Stroke Width").setValue(sp.st[1] || 4);
            try { S2.property("ADBE Vector Stroke Line Cap").setValue(2); S2.property("ADBE Vector Stroke Line Join").setValue(2); } catch (e) {}
        }
        if (sp.trim) { var T = G.property("ADBE Vectors Group").addProperty("ADBE Vector Filter - Trim"); T.name = "HAMDY Trim"; }
        return L;
    }
    function tplApply(a) {
        var c = comp(), T = a.spec, cols = [], i, j, k = Math.min(c.width / 1920, c.height / 1080), t0 = snap(c, c.time), dur = Math.max(1, a.dur || T.dur || 4);
        if (c.height > c.width) { k = c.width / 1080 * (T.vk || 0.9); }
        for (i = 0; i < 3; i++) { cols.push(tplHex((a.colors && a.colors[i]) || (T.cols && T.cols[i]) || "#ffffff")); }
        var nm = "HAMDY TPL " + (T.en || T.id), n = 1; while (dpFind(c, nm)) { n++; nm = "HAMDY TPL " + (T.en || T.id) + " " + n; }
        var anc = a.anchor || T.anc || [0.5, 0.5];
        var N = c.layers.addNull(); N.name = nm; N.label = 9;
        var NT = N.property("ADBE Transform Group");
        NT.property("ADBE Anchor Point").setValue([0, 0]);
        NT.property("ADBE Position").setValue([c.width * anc[0], c.height * anc[1]]);
        NT.property("ADBE Scale").setValue([k * 100 * (a.scale || 1), k * 100 * (a.scale || 1)]);
        for (i = 0; i < 3; i++) { addColorCtl(N, "HAMDY Color " + (i + 1), cols[i]); }
        var made = [], L, sp, X;
        for (i = 0; i < T.layers.length; i++) {
            sp = T.layers[i];
            if (sp.t === "text") {
                var str = (a.fields && a.fields[sp.fld] !== undefined && a.fields[sp.fld] !== "") ? a.fields[sp.fld] : sp.def;
                var tc = tplCol(N, nm, sp.fc || "#ffffff", cols);
                L = makeText(c, str, sp.fs || 60, tc.val, sp.just || "c", sp.font === "sym" ? "ArialMT" : (a.font || null), sp.trk || 0);
                if (tc.expr) {
                    try { var an = L.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator"); an.name = "HAMDY Color"; an.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color").expression = tc.expr; } catch (ec) {}
                }
                var ax = sp.just === "l" ? "r.left" : (sp.just === "r" ? "r.left + r.width" : "r.left + r.width / 2");
                L.property("ADBE Transform Group").property("ADBE Anchor Point").expression = 'var r = sourceRectAtTime(time, false);\n[' + ax + ', r.top + r.height / 2]';
                if (sp.typ) {
                    var ta = L.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator"); ta.name = "HAMDY Type";
                    ta.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity").setValue(0);
                    var sel = ta.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
                    tplKeys(sel.property("ADBE Text Percent Start"), t0, [[sp.typ[0], 0], [sp.typ[0] + sp.typ[1], 100]], "l", function (v) { return v; });
                }
                if (sp.count) {
                    if (sp.cfld && a.fields && a.fields[sp.cfld] !== undefined && a.fields[sp.cfld] !== "" && !isNaN(parseFloat(String(a.fields[sp.cfld]).replace(/,/g, "")))) { sp.count[1] = parseFloat(String(a.fields[sp.cfld]).replace(/,/g, "")); }
                    L.property("ADBE Text Properties").property("ADBE Text Document").expression = 'var t = Math.max(0, Math.min(1, (time - inPoint - ' + sp.count[2] + ') / ' + sp.count[3] + '));\nt = 1 - Math.pow(1 - t, 3);\nvar v = ' + sp.count[0] + ' + (' + sp.count[1] + ' - ' + sp.count[0] + ') * t;\nvar s = Math.round(v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");\n"' + (sp.pre || "") + '" + s + "' + (sp.suf || "") + '"';
                }
            } else if (sp.t === "bg") {
                L = c.layers.addSolid(cols[0], nm + " BG", c.width, c.height, c.pixelAspect, c.duration);
                tplBg(L, sp, nm, cols);
            } else {
                L = tplShape(c, sp, nm, cols);
            }
            L.name = nm + " | " + (sp.n || sp.t + (i + 1));
            if (sp.t !== "bg") { L.parent = N; }
            X = L.property("ADBE Transform Group");
            if (sp.t !== "bg") { X.property("ADBE Position").setValue(sp.p || [0, 0]); }
            if (sp.rot) { X.property("ADBE Rotate Z").setValue(sp.rot); }
            if (sp.o !== undefined) { X.property("ADBE Opacity").setValue(sp.o); }
            if (sp.sh) { var ds = addEffect(L, "ADBE Drop Shadow", "HAMDY Shadow"); ds.property(2).setValue(sp.sh[0] !== undefined ? sp.sh[0] * 2.55 : 90); ds.property(4).setValue(sp.sh[1] || 12); ds.property(5).setValue(sp.sh[2] || 24); }
            if (sp.rough) { try { var rg = addEffect(L, "ADBE Roughen Edges", "HAMDY Paper Edge"); rg.property(3).setValue(sp.rough); rg.property(4).setValue(8); } catch (er) {} }
            if (sp.glow) { try { var gw = addEffect(L, "ADBE Glo2", "HAMDY Glow"); gw.property(3).setValue(sp.glow); gw.property(4).setValue(1.2); } catch (eg) {} }
            if (sp.jit) {
                X.property("ADBE Position").expression = 'posterizeTime(' + (sp.jit[2] || 8) + ');\nseedRandom(index, false);\nvalue + [random(-1, 1) * ' + sp.jit[0] + ', random(-1, 1) * ' + sp.jit[0] + ']';
                X.property("ADBE Rotate Z").expression = 'posterizeTime(' + (sp.jit[2] || 8) + ');\nseedRandom(index + 7, false);\nvalue + random(-1, 1) * ' + sp.jit[1];
            }
            if (sp.scroll) { X.property("ADBE Position").expression = 'var w = sourceRectAtTime(time, false).width + ' + (sp.gap || 200) + ';\nvar x = ((time - inPoint) * ' + sp.scroll + ') % w;\nvalue - [x, 0]'; }
            if (sp.spin) { X.property("ADBE Rotate Z").expression = 'value + (time - inPoint) * ' + sp.spin; }
            if (sp.pulse) { X.property("ADBE Scale").expression = 'var s = 1 + Math.sin((time - inPoint) * ' + sp.pulse[1] + ') * ' + sp.pulse[0] + ';\nvalue * s'; }
            var A = sp.a || [];
            for (j = 0; j < A.length; j++) { tplAnim(L, X, A[j], t0, sp); }
            L.inPoint = t0; L.outPoint = Math.min(c.duration, t0 + dur);
            if (sp.t === "bg") { L.moveToEnd(); }
            made.push(L);
        }
        // order: first spec at the bottom, last on top, the null above them
        for (i = 0; i < made.length; i++) { if (T.layers[i].t !== "bg") { made[i].moveToBeginning(); } }
        N.moveToBeginning(); N.inPoint = t0; N.outPoint = Math.min(c.duration, t0 + dur);
        var P0 = NT.property("ADBE Position").value, S0 = k * 100 * (a.scale || 1);
        for (i = 0; T.na && i < T.na.length; i++) {
            var na = T.na[i], nk = [];
            for (j = 0; j < na.k.length; j++) { nk.push([na.k[j][0] + (na.d || 0), na.k[j][1]]); }
            if (na.p === "dp") { tplKeys(NT.property("ADBE Position"), t0, nk, na.ez, function (v) { return [P0[0] + v[0] * k * (a.scale || 1), P0[1] + v[1] * k * (a.scale || 1)]; }); }
            else if (na.p === "sc") { tplKeys(NT.property("ADBE Scale"), t0, nk, na.ez, function (v) { return [S0 * v / 100, S0 * v / 100]; }); }
            else if (na.p === "op") { tplKeys(NT.property("ADBE Opacity"), t0, nk, na.ez, function (v) { return v; }); }
        }
        if (T.out !== false) {
            var ot = Math.min(c.duration, t0 + dur), od = 0.35;
            tplKeys(NT.property("ADBE Opacity"), 0, [[ot - od, 100], [ot, 0]], "i", function (v) { return v; });
            var sc0 = k * 100 * (a.scale || 1);
            tplKeys(NT.property("ADBE Scale"), 0, [[ot - od, sc0], [ot, sc0 * 0.94]], "i", function (v) { return [v, v]; });
        }
        if (a.sfx) { try { var S3 = c.layers.add(importFile(new File(a.sfx))); S3.name = "HAMDY SFX | " + (T.en || T.id); S3.startTime = t0 + (T.sfxAt || 0); tuck(c, S3); } catch (es) {} }
        return "OK";
    }
    function tplAnim(L, X, an, t0, sp) {
        var d = an.d || 0, keys = [], q, prop, map;
        for (q = 0; q < an.k.length; q++) { keys.push([an.k[q][0] + d, an.k[q][1]]); }
        var base = sp.p || [0, 0];
        switch (an.p) {
            case "dp": prop = X.property("ADBE Position"); map = function (v) { return [base[0] + v[0], base[1] + v[1]]; }; break;
            case "sc": prop = X.property("ADBE Scale"); map = function (v) { return v instanceof Array ? v : [v, v]; }; break;
            case "sx": prop = X.property("ADBE Scale"); map = function (v) { return [v, 100]; }; break;
            case "sy": prop = X.property("ADBE Scale"); map = function (v) { return [100, v]; }; break;
            case "rot": prop = X.property("ADBE Rotate Z"); map = function (v) { return (sp.rot || 0) + v; }; break;
            case "op": prop = X.property("ADBE Opacity"); map = function (v) { return v; }; break;
            case "trim": prop = L.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property("HAMDY Trim").property("ADBE Vector Trim End"); map = function (v) { return v; }; break;
            case "w": prop = L.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property(1).property("ADBE Vector Rect Size"); map = function (v) { return [v, sp.s[1]]; }; break;
            default: return;
        }
        tplKeys(prop, t0, keys, an.ez, map);
    }
    function tplBg(L, sp, nm, cols) {
        var e, C1 = 'thisComp.layer(' + J(nm) + ').effect("HAMDY Color ', W = L.width, H = L.height;
        switch (sp.kind) {
            case "grad":
                e = addEffect(L, "ADBE 4ColorGradient", "HAMDY Gradient");
                e.property(2).expression = C1 + '1")(1)'; e.property(4).expression = C1 + '2")(1)'; e.property(6).expression = C1 + '3")(1)'; e.property(8).expression = C1 + '1")(1)';
                e.property(1).expression = '[' + W * 0.2 + ' + Math.sin(time * 0.4) * ' + W * 0.15 + ', ' + H * 0.2 + ' + Math.cos(time * 0.3) * ' + H * 0.15 + ']';
                e.property(3).expression = '[' + W * 0.8 + ' + Math.cos(time * 0.35) * ' + W * 0.15 + ', ' + H * 0.25 + ' + Math.sin(time * 0.5) * ' + H * 0.15 + ']';
                e.property(5).expression = '[' + W * 0.75 + ' + Math.sin(time * 0.3) * ' + W * 0.15 + ', ' + H * 0.8 + ' + Math.cos(time * 0.45) * ' + H * 0.12 + ']';
                e.property(7).expression = '[' + W * 0.2 + ' + Math.cos(time * 0.5) * ' + W * 0.12 + ', ' + H * 0.8 + ' + Math.sin(time * 0.4) * ' + H * 0.12 + ']';
                break;
            case "grid":
                e = addEffect(L, "ADBE Fill", "HAMDY Fill"); e.property(3).expression = C1 + '1")(1)';
                e = addEffect(L, "ADBE Grid", "HAMDY Grid");
                try { e.property(1).expression = '[' + W / 2 + ', ' + H / 2 + ' + (time * 30) % ' + Math.round(H / 12) + ']'; e.property(3).setValue([W / 2 + H / 12, H / 2 + H / 12]); e.property(5).setValue(1.5); e.property(8).expression = C1 + '2")(1)'; e.property(9).setValue(25); } catch (eg) {}
                break;
            case "paper":
                e = addEffect(L, "ADBE Fractal Noise", "HAMDY Paper Grain"); try { e.property(4).setValue(140); e.property(5).setValue(-40); e.property(11).setValue(30); } catch (e1) {}
                e = addEffect(L, "ADBE Tint", "HAMDY Paper Tint"); e.property(1).expression = C1 + '2")(1)'; e.property(2).expression = C1 + '1")(1)';
                break;
            case "dots":
                e = addEffect(L, "ADBE Fill", "HAMDY Fill"); e.property(3).expression = C1 + '1")(1)';
                try { e = addEffect(L, "CC Ball Action", "HAMDY Dots"); } catch (e2) {}
                break;
            case "noise":
                e = addEffect(L, "ADBE Fractal Noise", "HAMDY Smoke"); try { e.property(1).setValue(4); e.property(4).setValue(160); e.property(5).setValue(-20); e.property(14).expression = 'time * 40'; } catch (e3) {}
                e = addEffect(L, "ADBE Tint", "HAMDY Smoke Tint"); e.property(1).expression = C1 + '1")(1)'; e.property(2).expression = C1 + '2")(1)';
                break;
        }
    }

    // ================================================ liquid glass (built-in effects only, one control null)
    function glassRect(c, nm, ctl, fill, stroke) {
        var S2 = c.layers.addShape(); S2.name = nm;
        var g = S2.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"); g.name = "Glass";
        var V = g.property("ADBE Vectors Group"), r = V.addProperty("ADBE Vector Shape - Rect");
        var C = 'thisComp.layer("' + ctl + '")';
        r.property("ADBE Vector Rect Size").expression = '[' + C + '.effect("HAMDY Width")(1), ' + C + '.effect("HAMDY Height")(1)]';
        r.property("ADBE Vector Rect Roundness").expression = 'Math.min(' + C + '.effect("HAMDY Width")(1), ' + C + '.effect("HAMDY Height")(1)) / 2 * ' + C + '.effect("HAMDY Roundness %")(1) / 100';
        if (fill) { var f = V.addProperty("ADBE Vector Graphic - Fill"); f.property("ADBE Vector Fill Color").setValue(fill); }
        if (stroke) {
            var s = V.addProperty("ADBE Vector Graphic - Stroke"); s.property("ADBE Vector Stroke Color").setValue([1, 1, 1]);
            s.property("ADBE Vector Stroke Width").expression = C + '.effect("HAMDY Rim")(1) / 25 * thisComp.height / 540';
            s.property("ADBE Vector Stroke Opacity").expression = 'Math.min(100, ' + C + '.effect("HAMDY Rim")(1) * 1.4)';
        }
        S2.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, 0]);
        return S2;
    }
    function liquidGlass(a) {
        var c = comp(), W = c.width, H = c.height, t0 = c.time, dur = a.secs > 0 ? a.secs : c.duration - t0, nm = "HAMDY GLASS CTRL", i = 1;
        while (dpFind(c, nm)) { i++; nm = "HAMDY GLASS CTRL " + i; }
        var N = c.layers.addNull(); N.name = nm; N.label = 14;
        N.property("ADBE Transform Group").property("ADBE Position").setValue([W / 2, H * (a.y || 50) / 100]);
        var sw = a.shape === "circle" ? 0.35 : (a.shape === "card" ? 0.7 : 0.62), sh = a.shape === "circle" ? 0.35 : (a.shape === "card" ? 0.42 : 0.16);
        var base = Math.min(W, H);
        addSlider(N, "HAMDY Width", Math.round(base * sw * (a.shape === "circle" ? 1 : W / base)));
        addSlider(N, "HAMDY Height", Math.round(base * sh * (a.shape === "card" ? 1.2 : 1)));
        addSlider(N, "HAMDY Roundness %", a.shape === "card" ? 22 : 100);
        addSlider(N, "HAMDY Blur", a.blur || 30);
        addSlider(N, "HAMDY Refraction", a.refract || 40);
        addSlider(N, "HAMDY Brightness", 12);
        addSlider(N, "HAMDY Rim", 40);
        var C = 'thisComp.layer("' + nm + '")';
        // adjustment layer = the glass body (blur + lens + brightness) clipped by a matte shape
        var A = c.layers.addSolid([1, 1, 1], "HAMDY GLASS BODY", W, H, c.pixelAspect, c.duration); A.adjustmentLayer = true;
        var b = addEffect(A, "ADBE Gaussian Blur 2", "HAMDY Glass Blur"); b.property(1).expression = C + '.effect("HAMDY Blur")(1) * thisComp.height / 1080'; try { b.property(3).setValue(1); } catch (e0) {}
        try { var ln = addEffect(A, "CC Lens", "HAMDY Glass Lens"); ln.property(1).expression = C + '.toComp(' + C + '.anchorPoint)'; ln.property(2).expression = 'Math.max(' + C + '.effect("HAMDY Width")(1), ' + C + '.effect("HAMDY Height")(1)) / thisComp.width * 100 * 0.62'; ln.property(3).expression = C + '.effect("HAMDY Refraction")(1)'; } catch (e1) {}
        var bc = addEffect(A, "ADBE Brightness & Contrast 2", "HAMDY Glass Light"); bc.property(1).expression = C + '.effect("HAMDY Brightness")(1)';
        var M = glassRect(c, "HAMDY GLASS MATTE", nm, [1, 1, 1], false); M.parent = N; M.property("ADBE Transform Group").property("ADBE Position").setValue([0, 0]);
        M.moveBefore(A); setMatte(A, M, false);
        try { A.trackMatteType = TrackMatteType.ALPHA; } catch (e2) {}
        try { A.setTrackMatte(M, TrackMatteType.ALPHA); } catch (e3) {}
        try { M.enabled = false; } catch (e4) {}
        // rim light + soft shadow
        var R = glassRect(c, "HAMDY GLASS RIM", nm, null, true); R.parent = N; R.property("ADBE Transform Group").property("ADBE Position").setValue([0, 0]);
        try { var gl = addEffect(R, "ADBE Glo2", "HAMDY Rim Glow"); gl.property(3).setValue(Math.round(H * 0.01)); gl.property(4).setValue(0.6); } catch (e5) {}
        R.blendingMode = BlendingMode.ADD;
        var D = glassRect(c, "HAMDY GLASS SHADOW", nm, [0, 0, 0], false); D.parent = N; D.property("ADBE Transform Group").property("ADBE Position").setValue([0, H * 0.012]);
        D.property("ADBE Transform Group").property("ADBE Opacity").setValue(28);
        var db = addEffect(D, "ADBE Gaussian Blur 2", "HAMDY Shadow Blur"); db.property(1).setValue(H * 0.03);
        var all = [D, A, M, R], T = null;
        if (a.text) {
            T = c.layers.addText(a.text); T.name = "HAMDY GLASS TEXT";
            var tp = T.property("ADBE Text Properties").property("ADBE Text Document"), td = tp.value;
            td.fontSize = Math.round(base * sh * 0.42); td.fillColor = [1, 1, 1]; td.justification = ParagraphJustification.CENTER_JUSTIFY;
            if (a.font) { try { td.font = a.font; } catch (ef) {} }
            tp.setValue(td);
            T.property("ADBE Transform Group").property("ADBE Anchor Point").expression = 'var r = sourceRectAtTime(time, false);\n[r.left + r.width / 2, r.top + r.height / 2]';
            T.parent = N; T.property("ADBE Transform Group").property("ADBE Position").setValue([0, 0]);
            all.push(T);
        }
        for (i = 0; i < all.length; i++) { span(all[i], t0, Math.min(c.duration, t0 + dur)); }
        span(N, t0, Math.min(c.duration, t0 + dur));
        // order: shadow, body+matte, rim, text, ctrl (top)
        D.moveToBeginning(); A.moveToBeginning(); M.moveBefore(A); R.moveToBeginning(); if (T) { T.moveToBeginning(); } N.moveToBeginning();
        if (a.anim) {
            var sc = N.property("ADBE Transform Group").property("ADBE Scale"), op = N.property("ADBE Transform Group").property("ADBE Opacity");
            keyPair(sc, t0, [70, 70], t0 + 0.45, [100, 100], "snappy", "in");
            try { setEase(sc, 2, 85, 33); } catch (e6) {}
        }
        return "OK";
    }
    // fix Arabic text direction / composer on selected text layers (AE 24+), plus a fallback that flips a reversed string
    function fixArabic(a) {
        var c = comp(), sel = c.selectedLayers, i, n = 0, L, tp, td;
        for (i = 0; i < sel.length; i++) {
            L = sel[i]; if (L.matchName !== "ADBE Text Layer") { continue; }
            tp = L.property("ADBE Text Properties").property("ADBE Text Document");
            if (tp.numKeys) { continue; }
            td = tp.value;
            try { td.composerEngine = ComposerEngine.UNIVERSAL_TYPE_ENGINE; } catch (e1) {}
            try { td.direction = ParagraphDirection.DIRECTION_RIGHT_TO_LEFT; } catch (e2) {}
            if (a.reverse) { td.text = String(td.text).split("").reverse().join(""); }
            tp.setValue(td); n++;
        }
        if (!n) { throw Err("NO_TEXTLAYER"); }
        return "OK";
    }

    // ================================================ AI assistant (in-panel chat and the Claude Desktop bridge)
    function aiR(v, d) { if (typeof v === "number") { var m = Math.pow(10, d === undefined ? 2 : d); return Math.round(v * m) / m; } if (v instanceof Array) { var o = [], i; for (i = 0; i < v.length; i++) { o.push(aiR(v[i], d)); } return o; } return v; }
    function aiType(L) {
        var mn = L.matchName || "";
        if (mn === "ADBE Text Layer") { return "text"; }
        if (mn === "ADBE Vector Layer") { return "shape"; }
        if (mn === "ADBE Camera Layer") { return "camera"; }
        if (mn === "ADBE Light Layer") { return "light"; }
        try { if (L.nullLayer) { return "null"; } if (L.adjustmentLayer) { return "adjustment"; } } catch (e) {}
        try { if (L.source instanceof CompItem) { return "precomp"; } if (L.source && L.source.mainSource instanceof SolidSource) { return "solid"; } if (L.source && !L.hasVideo) { return "audio"; } if (L.source && L.source.mainSource && L.source.mainSource.isStill) { return "image"; } } catch (e2) {}
        return "footage";
    }
    function aiProp(p, t) {
        var o = { v: aiR(p.valueAtTime(t, false)) };
        if (p.numKeys) { o.keys = []; var k; for (k = 1; k <= Math.min(p.numKeys, 12); k++) { o.keys.push([aiR(p.keyTime(k), 3), aiR(p.keyValue(k))]); } if (p.numKeys > 12) { o.moreKeys = p.numKeys - 12; } }
        if (p.expression && p.expressionEnabled) { o.expr = String(p.expression).substr(0, 300); }
        return o;
    }
    function aiLayer(L, t, deep) {
        var o = { i: L.index, name: L.name, type: aiType(L), "in": aiR(L.inPoint, 3), out: aiR(L.outPoint, 3) };
        try { if (L.parent) { o.parent = L.parent.index; } } catch (e0) {}
        try { if (L.threeDLayer) { o.is3D = true; } } catch (e1) {}
        try { if (!L.enabled) { o.hidden = true; } } catch (e2) {}
        if (!deep) { return o; }
        try { if (L.source && L.source.width) { o.size = [L.source.width, L.source.height]; } } catch (e3) {}
        try { var r = L.sourceRectAtTime(t, false); o.rect = aiR([r.left, r.top, r.width, r.height], 1); } catch (e4) {}
        var T = L.property("ADBE Transform Group"), tr = {}, nm = { "ADBE Anchor Point": "anchor", "ADBE Position": "position", "ADBE Scale": "scale", "ADBE Rotate Z": "rotation", "ADBE Opacity": "opacity" }, k;
        if (T) { for (k in nm) { try { tr[nm[k]] = aiProp(T.property(k), t); } catch (e5) {} } }
        o.transform = tr;
        if (o.type === "text") {
            try { var td = L.property("ADBE Text Properties").property("ADBE Text Document").valueAtTime(t, false); o.text = { str: String(td.text).substr(0, 200), font: td.font, size: aiR(td.fontSize, 1), fill: aiR(td.fillColor, 3), just: String(td.justification) }; } catch (e6) {}
            try { var an = L.property("ADBE Text Properties").property("ADBE Text Animators"); if (an.numProperties) { o.textAnimators = []; for (k = 1; k <= an.numProperties; k++) { o.textAnimators.push(an.property(k).name); } } } catch (e7) {}
        }
        try { var P = parade(L); if (P.numProperties) { o.effects = []; for (k = 1; k <= Math.min(P.numProperties, 20); k++) { o.effects.push(P.property(k).name + " [" + P.property(k).matchName + "]"); } } } catch (e8) {}
        try { var M = L.property("ADBE Mask Parade"); if (M && M.numProperties) { o.masks = M.numProperties; } } catch (e9) {}
        try { if (L.hasTrackMatte) { o.trackMatte = true; } } catch (e10) {}
        return o;
    }
    function aiContext(a) {
        var c = comp(), t = c.time, sel = c.selectedLayers, i, all = [];
        var out = { comp: { name: c.name, w: c.width, h: c.height, fps: aiR(1 / c.frameDuration, 3), dur: aiR(c.duration, 3), time: aiR(t, 3), workArea: [aiR(c.workAreaStart, 3), aiR(c.workAreaStart + c.workAreaDuration, 3)], numLayers: c.numLayers } };
        if (a.t0 !== undefined && a.t0 !== null) { out.range = [aiR(a.t0, 3), aiR(a.t1, 3)]; }
        out.selected = [];
        for (i = 0; i < sel.length && i < 12; i++) { out.selected.push(aiLayer(sel[i], t, true)); }
        if (a.all || !sel.length) { for (i = 1; i <= Math.min(c.numLayers, 60); i++) { all.push(aiLayer(c.layer(i), t, false)); } out.layers = all; }
        if (a.layers) { out.detail = []; for (i = 0; i < a.layers.length && i < 12; i++) { try { out.detail.push(aiLayer(c.layer(a.layers[i]), t, true)); } catch (e) {} } }
        return out;
    }
    function aiRun(a) {
        var c = comp(), sel = c.selectedLayers, SEL = [], i;
        for (i = 0; i < sel.length; i++) { SEL.push(sel[i]); }
        var T0 = (a.t0 !== undefined && a.t0 !== null) ? a.t0 : c.time, T1 = (a.t1 !== undefined && a.t1 !== null) ? a.t1 : Math.min(c.duration, T0 + 1);
        var LOG = [];
        function log(x) { LOG.push(String(x)); }
        var fn = eval("(function (comp, SEL, T0, T1, log, HMK) {\n" + a.code + "\n})");
        var r = fn(c, SEL, T0, T1, log, AIH);
        var res = { log: LOG.join("\n").substr(0, 3000) };
        if (r !== undefined) { try { res.result = (typeof r === "object") ? J(r).substr(0, 3000) : String(r).substr(0, 3000); } catch (e) { res.result = String(r); } }
        return res;
    }
    // small helper library the model can use inside run_script (HMK.*)
    var AIH = {
        key: function (prop, t, v, ease) { prop.setValueAtTime(t, v); var k = prop.nearestKeyIndex(t); if (ease) { AIH.ease(prop, k, ease); } return k; },
        ease: function (prop, k, how) {
            var d = prop.propertyValueType === PropertyValueType.ThreeD_SPATIAL || prop.propertyValueType === PropertyValueType.TwoD_SPATIAL ? 1 : (prop.value instanceof Array ? prop.value.length : 1);
            var inf = { linear: [0.1, 0.1], ease: [33, 33], out: [75, 10], "in": [10, 75], strong: [90, 90], snappy: [85, 40] }[how] || [33, 33];
            var a = [], b = [], j;
            for (j = 0; j < d; j++) { a.push(new KeyframeEase(0, inf[1])); b.push(new KeyframeEase(0, inf[0])); }
            try { prop.setTemporalEaseAtKey(k, a, b); } catch (e) {}
        },
        tr: function (L, nm) { return L.property("ADBE Transform Group").property({ anchor: "ADBE Anchor Point", position: "ADBE Position", scale: "ADBE Scale", rotation: "ADBE Rotate Z", opacity: "ADBE Opacity", x: "ADBE Position_0", y: "ADBE Position_1" }[nm] || nm); },
        fx: function (L, matchName, name) { return addEffect(L, matchName, name || ("HAMDY AI " + matchName)); },
        slider: function (L, name, v) { return FX(L, addSlider(L, name, v)); },
        layer: function (x) { var c = comp(), i; if (typeof x === "number") { return c.layer(x); } for (i = 1; i <= c.numLayers; i++) { if (c.layer(i).name === x) { return c.layer(i); } } return null; }
    };
    function aiFrame(a) {
        var c = comp(), t = (a.t !== undefined && a.t !== null) ? snap(c, a.t) : snap(c, c.time);
        var f = new File(Folder.temp.fsName + "/hamdy_ai_" + new Date().getTime() + ".png");
        if (typeof c.saveFrameToPng !== "function") { throw Err("NO_SAVEFRAME"); }
        c.saveFrameToPng(t, f);
        return { path: f.fsName, w: c.width, h: c.height, t: t };
    }
    function aiSetTime(a) { var c = comp(); c.time = Math.max(0, Math.min(c.duration, a.t)); return { t: c.time }; }

    // ================================================ depth 3D (multiplane): spread layers in Z, keep the frame identical
    // A layer pushed back by z is scaled by (D+z)/D and moved away from the centre by the same factor (D = camera
    // distance to the z=0 plane = camera zoom), so through the camera it looks exactly like before. All of it is live
    // expressions driven by the HAMDY DEPTH CTRL null, so changing the spacing later keeps the frame and only changes depth.
    var DPN = { ctrl: "HAMDY DEPTH CTRL", rig: "HAMDY DEPTH RIG", cam: "HAMDY DEPTH CAM" };
    var DP_Z = 'var C = thisComp.layer("HAMDY DEPTH CTRL");\nvar D = C.effect("HAMDY Base Distance")(1), sp = C.effect("HAMDY Spread")(1);\n' +
        'var idx = effect("HAMDY Depth Index")(1), n = Math.max(1, C.effect("HAMDY Layer Count")(1) - 1);\n' +
        'var z = sp * (idx - C.effect("HAMDY Pivot")(1)) + effect("HAMDY Depth Offset")(1);\nz = Math.max(z, -D * 0.9);\nvar k = (D + z) / D, f = Math.max(0, Math.min(1, idx / n));\n';
    var DP_POS = DP_Z + 'var cx = thisComp.width / 2, cy = thisComp.height / 2;\n[cx + (value[0] - cx) * k, cy + (value[1] - cy) * k, value[2] + z]';
    var DP_SCL = DP_Z + 'var ov = (1 + C.effect("HAMDY Overscan %")(1) / 100 * f) * k;\n[value[0] * ov, value[1] * ov, value[2] * ov]';
    var DP_FOGC = 'thisComp.layer("HAMDY DEPTH CTRL").effect("HAMDY Fog Color")(1)';
    var DP_FOGA = DP_Z + 'f * C.effect("HAMDY Fog %")(1)';
    var DP_FOCUS = 'var C = thisComp.layer("HAMDY DEPTH CTRL");\ntry {\n    var L = C.effect("HAMDY Focus On")(1);\n    length(L.toWorld(L.anchorPoint), toWorld([0, 0, 0]));\n} catch (e) {\n    value;\n}';
    function dpFind(c, nm) { var i; for (i = 1; i <= c.numLayers; i++) { if (c.layer(i).name === nm) { return c.layer(i); } } return null; }
    function dpEff(L, nm) { var p = parade(L), i; for (i = 1; i <= p.numProperties; i++) { if (p.property(i).name === nm) { return p.property(i); } } return null; }
    function dpSlider(L, nm, v) { var e = dpEff(L, nm); if (!e) { e = FX(L, addSlider(L, nm, v)); } else { try { e.property(1).setValue(v); } catch (x) {} } return e; }
    function dpClear(p) {
        if (!p) { return; }
        try { p.expression = ""; } catch (e0) {}
        try { while (p.numKeys > 0) { p.removeKey(1); } } catch (e1) {}
    }
    function dpRigged(c) {
        var out = [], i;
        for (i = 1; i <= c.numLayers; i++) { if (dpEff(c.layer(i), "HAMDY Depth Index")) { out.push(c.layer(i)); } }
        return out;
    }
    function dpCamZoom(K) { return K.property("ADBE Camera Options Group").property("ADBE Camera Zoom"); }
    function dpRig(a) {
        var c = comp(), sel = c.selectedLayers, Ls = [], i, L, skipped = 0;
        for (i = 0; i < sel.length; i++) {
            L = sel[i];
            if (!isAV(L) || /^HAMDY DEPTH/.test(L.name)) { continue; }
            try { if (L.adjustmentLayer || L.nullLayer) { continue; } } catch (e0) {}
            if (L.parent) { skipped++; continue; }
            Ls.push(L);
        }
        if (Ls.length < 2) { throw Err("NEED2"); }
        Ls.sort(function (x, y) { return x.index - y.index; });
        if (a.order === "reverse") { Ls.reverse(); }
        var n = Ls.length, cx = c.width / 2, cy = c.height / 2;
        var K = dpFind(c, DPN.cam), R = dpFind(c, DPN.rig), C = dpFind(c, DPN.ctrl), fresh = !C;
        if (!K) {
            K = c.layers.addCamera(DPN.cam, [cx, cy]);
            try { K.autoOrient = AutoOrientType.NO_AUTO_ORIENT; } catch (e1) {}
            K.label = 14;
        }
        var zp = dpCamZoom(K);
        try { zp.expression = ""; } catch (e2) {}
        var bd = C ? dpEff(C, "HAMDY Base Distance") : null, D = bd ? bd.property(1).value : zp.value;
        try { zp.setValue(D); } catch (e3) {}
        if (!R) {
            R = c.layers.addNull(); R.name = DPN.rig; R.threeDLayer = true; R.label = 14;
            R.property("ADBE Transform Group").property("ADBE Position").setValue([cx, cy, 0]);
            K.parent = R;
        }
        try { var an = R.property("ADBE Transform Group").property("ADBE Anchor Point").value; K.property("ADBE Transform Group").property("ADBE Position").setValue([an[0], an[1], (an[2] || 0) - D]); } catch (e4) {}
        if (!C) {
            C = c.layers.addNull(); C.name = DPN.ctrl; C.label = 14;
            addSlider(C, "HAMDY Base Distance", D);
            addSlider(C, "HAMDY Spread", a.spread || 600);
            addSlider(C, "HAMDY Pivot", 0);
            addSlider(C, "HAMDY Layer Count", n);
            addSlider(C, "HAMDY Overscan %", a.over || 0);
            addColorCtl(C, "HAMDY Fog Color", a.fogColor || [0.62, 0.68, 0.78]);
            addSlider(C, "HAMDY Fog %", a.fog ? 45 : 0);
            addSlider(C, "HAMDY Move Amount", a.amt || 100);
            addSlider(C, "HAMDY Blur Level", 100);
            addEffect(C, "ADBE Layer Control", "HAMDY Focus On");
        } else {
            dpSlider(C, "HAMDY Spread", a.spread || 600); dpSlider(C, "HAMDY Layer Count", n);
            dpSlider(C, "HAMDY Overscan %", a.over || 0); dpSlider(C, "HAMDY Fog %", a.fog ? 45 : 0);
            dpSlider(C, "HAMDY Move Amount", a.amt || 100);
        }
        var piv = a.pivot === "back" ? n - 1 : (a.pivot === "middle" ? (n - 1) / 2 : 0);
        dpSlider(C, "HAMDY Pivot", piv);
        var idx = [];
        for (i = 0; i < n; i++) { idx.push(i); }
        if (a.order === "random") { for (i = 0; i < n; i++) { idx[i] = (i === 0) ? 0 : Math.round(Math.random() * (n - 1) * 10) / 10; } }
        for (i = 0; i < n; i++) {
            L = Ls[i];
            if (!L.threeDLayer) { L.threeDLayer = true; }
            dpSlider(L, "HAMDY Depth Index", idx[i]);
            if (!dpEff(L, "HAMDY Depth Offset")) { addSlider(L, "HAMDY Depth Offset", 0); }
            var T = L.property("ADBE Transform Group"), P = T.property("ADBE Position");
            try { if (P.dimensionsSeparated) { P.dimensionsSeparated = false; } } catch (e5) {}
            P.expression = DP_POS;
            T.property("ADBE Scale").expression = DP_SCL;
            var fg = dpEff(L, "HAMDY Depth Fog");
            if (a.fog && !fg) {
                fg = addEffect(L, "ADBE Tint", "HAMDY Depth Fog");
                fg.property(1).expression = DP_FOGC; fg.property(2).expression = DP_FOGC; fg.property(3).expression = DP_FOGA;
            }
        }
        // focus on the layer that stays in place
        var fl = Ls[Math.max(0, Math.min(n - 1, Math.round(piv)))];
        try { dpEff(C, "HAMDY Focus On").property(1).setValue(fl.index); } catch (e6) {}
        var O = K.property("ADBE Camera Options Group");
        try {
            O.property("ADBE Camera Depth of Field").setValue(a.dof ? 1 : 0);
            if (a.dof) {
                O.property("ADBE Camera Focus Distance").expression = DP_FOCUS;
                O.property("ADBE Camera Aperture").setValue(Math.max(20, D * 0.05));
                O.property("ADBE Camera Blur Level").expression = 'thisComp.layer("HAMDY DEPTH CTRL").effect("HAMDY Blur Level")(1)';
            }
        } catch (e7) {}
        // stacking: controller, rig and camera on top
        try { R.moveToBeginning(); K.moveToBeginning(); C.moveToBeginning(); } catch (e8) {}
        if (!a.keepMove) { dpMoveRig(c, R, K, C, a); }
        return skipped ? "OK_DPSKIP:" + skipped : "OK";
    }
    function dpMoveRig(c, R, K, C, a) {
        var T = R.property("ADBE Transform Group"), P = T.property("ADBE Position"), RY = T.property("ADBE Rotate Y"), RX = T.property("ADBE Rotate X");
        var zp = dpCamZoom(K), bd = dpEff(C, "HAMDY Base Distance"), D = bd ? bd.property(1).value : zp.value, cx = c.width / 2, cy = c.height / 2;
        dpClear(P); dpClear(RY); dpClear(RX); try { zp.expression = ""; zp.setValue(D); } catch (e0) {}
        P.setValue([cx, cy, 0]); RY.setValue(0); RX.setValue(0);
        dpSlider(C, "HAMDY Move Amount", a.amt || 100);
        var s = (a.amt || 100) / 100, t0 = a.at === "start" ? 0 : c.time, t1 = (a.secs > 0) ? Math.min(c.duration, t0 + a.secs) : c.duration;
        if (t1 - t0 < c.frameDuration * 2) { t1 = Math.min(c.duration, t0 + 2); }
        var b = [cx, cy, 0], W = c.width, H = c.height;
        var AMT = 'thisComp.layer("HAMDY DEPTH CTRL").effect("HAMDY Move Amount")(1)';
        switch (a.move) {
            case "push": keyPair(P, t0, b, t1, [cx, cy, D * 0.3 * s], "cubic", "in"); break;
            case "pull": keyPair(P, t0, b, t1, [cx, cy, -D * 0.3 * s], "cubic", "in"); break;
            case "panL": keyPair(P, t0, b, t1, [cx - W * 0.08 * s, cy, 0], "cubic", "in"); break;
            case "panR": keyPair(P, t0, b, t1, [cx + W * 0.08 * s, cy, 0], "cubic", "in"); break;
            case "rise": keyPair(P, t0, b, t1, [cx, cy - H * 0.08 * s, D * 0.08 * s], "cubic", "in"); break;
            case "orbit": keyPair(RY, t0, 0, t1, 12 * s, "cubic", "in"); break;
            case "pushOrbit": keyPair(P, t0, b, t1, [cx, cy, D * 0.25 * s], "cubic", "in"); keyPair(RY, t0, 0, t1, -9 * s, "cubic", "in"); break;
            case "dolly":
                keyPair(P, t0, b, t1, [cx, cy, D * 0.45 * s], "cubic", "in");
                zp.expression = 'value - thisComp.layer("HAMDY DEPTH RIG").transform.position[2]';
                break;
            case "float":
                P.expression = 'var A = ' + AMT + ' * 0.6;\nvalue + [Math.sin(time * 0.7) * A, Math.cos(time * 0.5) * A * 0.5, Math.sin(time * 0.35) * A * 0.8]';
                RY.expression = 'var A = ' + AMT + ' * 0.03;\nvalue + Math.sin(time * 0.4) * A';
                break;
            case "shake":
                P.expression = 'var A = ' + AMT + ' * 0.25;\nwiggle(1.6, A)';
                RX.expression = 'var A = ' + AMT + ' * 0.008;\nwiggle(1.2, A)';
                RY.expression = 'var A = ' + AMT + ' * 0.008;\nwiggle(1.1, A)';
                break;
        }
    }
    function dpMove(a) {
        var c = comp(), K = dpFind(c, DPN.cam), R = dpFind(c, DPN.rig), C = dpFind(c, DPN.ctrl);
        if (!K || !R || !C) { throw Err("NO_DEPTH"); }
        dpMoveRig(c, R, K, C, a);
        return "OK";
    }
    function dpBakeProp(c, p, t0, t1) {
        if (!p || !p.expression || !p.expressionEnabled) { return; }
        var fd = c.frameDuration, ts = [], vs = [], t, still = true, v0 = p.valueAtTime(t0, false), v, j;
        for (t = t0; t <= t1 + fd * 0.5; t += fd) { v = p.valueAtTime(t, false); ts.push(t); vs.push(v); }
        for (j = 1; j < vs.length && still; j++) {
            if (vs[j] instanceof Array) { var q; for (q = 0; q < vs[j].length; q++) { if (Math.abs(vs[j][q] - v0[q]) > 1e-4) { still = false; } } }
            else if (Math.abs(vs[j] - v0) > 1e-4) { still = false; }
        }
        p.expression = "";
        while (p.numKeys > 0) { p.removeKey(1); }
        if (still) { p.setValue(v0); } else { p.setValuesAtTimes(ts, vs); }
    }
    function dpBake(a) {
        var c = comp(), C = dpFind(c, DPN.ctrl), K = dpFind(c, DPN.cam), R = dpFind(c, DPN.rig), Ls = dpRigged(c), i, L, T, fg;
        if (!C) { throw Err("NO_DEPTH"); }
        for (i = 0; i < Ls.length; i++) {
            L = Ls[i]; T = L.property("ADBE Transform Group");
            dpBakeProp(c, T.property("ADBE Position"), Math.max(0, L.inPoint), Math.min(c.duration, L.outPoint));
            dpBakeProp(c, T.property("ADBE Scale"), Math.max(0, L.inPoint), Math.min(c.duration, L.outPoint));
            fg = dpEff(L, "HAMDY Depth Fog");
            if (fg) { dpBakeProp(c, fg.property(1), 0, 0); dpBakeProp(c, fg.property(2), 0, 0); dpBakeProp(c, fg.property(3), 0, 0); }
            try { dpEff(L, "HAMDY Depth Offset").remove(); } catch (e1) {}
            try { dpEff(L, "HAMDY Depth Index").remove(); } catch (e2) {}
        }
        if (R) { T = R.property("ADBE Transform Group"); dpBakeProp(c, T.property("ADBE Position"), 0, c.duration); dpBakeProp(c, T.property("ADBE Rotate Y"), 0, c.duration); dpBakeProp(c, T.property("ADBE Rotate X"), 0, c.duration); }
        if (K) { var O = K.property("ADBE Camera Options Group"); dpBakeProp(c, O.property("ADBE Camera Zoom"), 0, c.duration); dpBakeProp(c, O.property("ADBE Camera Focus Distance"), 0, c.duration); dpBakeProp(c, O.property("ADBE Camera Blur Level"), 0, c.duration); }
        C.remove();
        return "OK";
    }
    function dpRemove(a) {
        var c = comp(), Ls = dpRigged(c), i, L, T, nm;
        for (i = 0; i < Ls.length; i++) {
            L = Ls[i]; T = L.property("ADBE Transform Group");
            try { T.property("ADBE Position").expression = ""; } catch (e1) {}
            try { T.property("ADBE Scale").expression = ""; } catch (e2) {}
            for (nm in { "HAMDY Depth Fog": 1, "HAMDY Depth Offset": 1, "HAMDY Depth Index": 1 }) { try { dpEff(L, nm).remove(); } catch (e3) {} }
            try { L.threeDLayer = false; } catch (e4) {}
        }
        var K = dpFind(c, DPN.cam), R = dpFind(c, DPN.rig), C = dpFind(c, DPN.ctrl);
        if (!K && !R && !C && !Ls.length) { throw Err("NO_DEPTH"); }
        if (K) { K.remove(); } if (R) { R.remove(); } if (C) { C.remove(); }
        return "OK";
    }

    // ================================================ overlay transitions (film burn, leaks, spray, ink\u2026)
    function otrApply(a) {
        var c = comp(), f = new File(a.file || ""), sel = c.selectedLayers, fd = c.frameDuration, i;
        if (!f.exists) { throw Err("NO_FILE"); }
        var cut = c.time;
        if (sel.length >= 2) { cut = 0; for (i = 0; i < sel.length; i++) { if (sel[i].inPoint > cut) { cut = sel[i].inPoint; } } }
        cut = snap(c, cut);
        var top = topSelected(c), it = importFile(f), fr = it.frameRate || 30;
        var nat = it.duration || ((a.frames0 || 30) / fr), want = Math.max(6, a.frames || 30) * fd;
        var st = want / nat * 100, midT = (a.mid || 15) / fr * st / 100;
        var t0 = cut - midT;
        function put(item, nm) {
            var L = c.layers.add(item);
            L.name = nm;
            try { L.stretch = st; } catch (e0) {}
            L.startTime = t0;
            try { L.inPoint = Math.max(0, t0); L.outPoint = Math.min(c.duration, t0 + want); } catch (e1) {}
            try { L.audioEnabled = false; } catch (e2) {}
            fitLayer(L, c);
            try { L.property("ADBE Transform Group").property("ADBE Position").setValue([c.width / 2, c.height / 2]); } catch (e3) {}
            if (a.flip) { try { var sp = L.property("ADBE Transform Group").property("ADBE Scale"), sv = sp.value; sp.setValue([-sv[0], sv[1]]); } catch (e4) {} }
            return L;
        }
        var nm = "HAMDY OTR | " + (a.label || it.name), L = put(it, nm), M = null;
        L.label = 9;
        if (top && top !== L) { L.moveBefore(top); }
        var bm = { screen: BlendingMode.SCREEN, add: BlendingMode.ADD, overlay: BlendingMode.OVERLAY, soft: BlendingMode.SOFT_LIGHT, normal: BlendingMode.NORMAL };
        if (a.kind === "cover") {
            if (a.matte) {
                var mf = new File(a.matte);
                if (mf.exists) {
                    M = put(importFile(mf), "HAMDY MATTE | " + (a.label || it.name));
                    M.moveBefore(L);
                    setMatte(L, M, false);
                    try { M.enabled = false; } catch (e5) {}
                    tuck(c, M);
                }
            }
            var col = a.color;
            if (col && col.length === 3) {
                try {
                    var tn = L.property("ADBE Effect Parade").addProperty("ADBE Tint");
                    tn.name = "HAMDY Tint";
                    tn.property(1).setValue([col[0] * 0.3, col[1] * 0.3, col[2] * 0.3]);
                    tn.property(2).setValue(col);
                    tn.property(3).setValue(100);
                } catch (e6) {}
            }
        } else {
            L.blendingMode = bm[a.blend || "screen"] || BlendingMode.SCREEN;
            if (a.color && a.color.length === 3) {
                try {
                    var tn2 = L.property("ADBE Effect Parade").addProperty("ADBE Tint");
                    tn2.name = "HAMDY Tint";
                    tn2.property(1).setValue([0, 0, 0]);
                    tn2.property(2).setValue(a.color);
                    tn2.property(3).setValue(100);
                } catch (e7) {}
            }
        }
        if (a.amount !== undefined && a.amount < 100) { try { L.property("ADBE Transform Group").property("ADBE Opacity").setValue(a.amount); } catch (e8) {} }
        try {
            var mk = new MarkerValue("HAMDY CUT");
            L.property("ADBE Marker").setValueAtTime(cut, mk);
        } catch (e9) {}
        if (a.sfx) {
            try {
                var S2 = c.layers.add(importFile(new File(a.sfx)));
                S2.name = "HAMDY SFX | " + (a.label || "otr");
                S2.startTime = Math.max(0, cut - Math.min(0.35, midT));
                S2.moveToBeginning();
                tuck(c, S2);
            } catch (es) {}
        }
        return "OK";
    }

    // ===================================================== matte transitions
    function setMatte(L, M, inv) {
        var ty = inv ? TrackMatteType.LUMA_INVERTED : TrackMatteType.LUMA;
        try { L.setTrackMatte(M, ty); return; } catch (e) {}
        M.moveBefore(L);
        L.trackMatteType = ty;
    }
    function matteLayer(c, file, t0, dur, above, t1) {
        var it = importFile(file), M = c.layers.add(it), sd = it.duration || 1;
        M.name = "HAMDY MATTE | " + it.name;
        tuck(c, M);
        M.startTime = t0;
        try { M.audioEnabled = false; } catch (e1) {}
        try {
            M.timeRemapEnabled = true;
            M.property("ADBE Time Remapping").expression = "// HAMDY matte timing\nvar D = " + dur.toFixed(4) + ", S = " + sd.toFixed(4) + " - thisComp.frameDuration;\nclamp((time - inPoint) / D, 0, 1) * S";
        } catch (e) {}
        try { M.inPoint = t0; M.outPoint = Math.min(c.duration, t1); } catch (e3) {}
        fitLayer(M, c);
        try { M.property("ADBE Transform Group").property("ADBE Position").setValue([c.width / 2, c.height / 2]); } catch (e2) {}
        if (above) { M.moveBefore(above); }
        return M;
    }
    function flipMatte(M) {
        try { var sp = M.property("ADBE Transform Group").property("ADBE Scale"), sv = sp.value; sp.setValue([-sv[0], sv[1]]); } catch (e) {}
    }
    function matteTr(a) {
        var c = comp(), f = new File(a.file || ""), sel = c.selectedLayers, fd = c.frameDuration;
        if (!f.exists) { throw Err("NO_FILE"); }
        if (!sel.length) { throw Err("NO_LAYERS"); }
        var dur = Math.max(4, a.frames || 20) * fd, A, B, M;
        if (sel.length === 1) {
            // reveal: the layer appears through the matte and stays visible after
            B = sel[0];
            M = matteLayer(c, f, B.inPoint, dur, B, B.outPoint);
            if (a.flip) { flipMatte(M); }
            setMatte(B, M, false);
            return "OK";
        }
        var s2 = sortByIndex(sel);
        s2.sort(function (x, y) { return x.inPoint - y.inPoint; });
        A = s2[0]; B = s2[s2.length - 1];
        if (A.inPoint === B.inPoint) { throw Err("NEED2"); }
        var cut = snap(c, B.inPoint);
        if (A.index > B.index) { A.moveBefore(B); }
        var want = Math.min(c.duration, cut + dur);
        if (A.outPoint < want - fd / 2) {
            A.outPoint = want;
            if (A.outPoint < want - fd / 2) { try { A.timeRemapEnabled = true; A.outPoint = want; } catch (et) {} }
        }
        M = matteLayer(c, f, cut, dur, A, want);
        if (a.flip) { flipMatte(M); }
        setMatte(A, M, true);
        if (a.sfx) { try { var S2 = c.layers.add(importFile(new File(a.sfx))); S2.name = "HAMDY SFX | matte"; S2.startTime = cut; S2.moveToBeginning(); } catch (es) {} }
        return "OK";
    }

    // ================================================================= edit
    function propPath(p) {
        var path = [], cur = p;
        while (cur && cur.parentProperty) { path.unshift(cur.propertyIndex); cur = cur.parentProperty; }
        return path;
    }
    function byPath(L, path) {
        var p = L, i;
        for (i = 0; i < path.length; i++) { p = p.property(path[i]); if (!p) { throw Err("NO_PROP"); } }
        return p;
    }
    function vt(p) {
        var t = p.propertyValueType;
        if (t === PropertyValueType.OneD) { return "1"; }
        if (t === PropertyValueType.TwoD || t === PropertyValueType.TwoD_SPATIAL) { return "2"; }
        if (t === PropertyValueType.ThreeD || t === PropertyValueType.ThreeD_SPATIAL) { return "3"; }
        if (t === PropertyValueType.COLOR) { return "c"; }
        return null;
    }
    function rnd(v) {
        if (v instanceof Array) { var o = [], i; for (i = 0; i < v.length; i++) { o.push(Math.round(v[i] * 1000) / 1000); } return o; }
        return Math.round(v * 1000) / 1000;
    }
    function propInfo(p, nameHint) {
        var t = vt(p);
        if (!t) { return null; }
        try { if (!p.enabled && p.isModified === false) {} } catch (e0) {}
        var o = { n: nameHint || p.name, path: propPath(p), t: t, nk: p.numKeys, ex: false };
        try { o.ex = !!(p.expressionEnabled && p.expression); } catch (e1) {}
        try {
            if (p.numKeys > 0) { o.k0 = rnd(p.keyValue(1)); o.k1 = rnd(p.keyValue(p.numKeys)); o.t0 = p.keyTime(1); o.t1 = p.keyTime(p.numKeys); }
            else { o.v = rnd(p.value); }
        } catch (e2) { return null; }
        return o;
    }
    function groupOf(name) {
        var m = String(name).match(/^(?:NABD|HAMDY) (IN|OUT|FX|LOOP|TYPE|STYLE) ([^ ]+)/);
        if (m) { return m[1] === "TYPE" ? "HAMDY TYPE" : (m[1] === "STYLE" ? "HAMDY STYLE" : "HAMDY " + m[1] + " " + m[2]); }
        m = String(name).match(/^(?:NABD|HAMDY) ([A-Z]+)/);
        return m ? "HAMDY " + m[1] : String(name);
    }
    function collectFx(L, groups, order, all) {
        var p = parade(L), i, e, j, pr, info;
        for (i = 1; i <= p.numProperties; i++) {
            e = p.property(i);
            if (!all && !/^(?:NABD|HAMDY) /.test(e.name)) { continue; }
            var g = all ? "LAYER" : groupOf(e.name);
            if (!groups[g]) { groups[g] = { g: g, items: [] }; order.push(g); }
            var it = { n: e.name, path: propPath(e), kind: "fx", on: e.enabled, props: [] };
            for (j = 1; j <= e.numProperties; j++) {
                pr = e.property(j);
                try { if (pr.propertyType !== PropertyType.PROPERTY) { continue; } } catch (et) { continue; }
                info = propInfo(pr);
                if (info && it.props.length < 14) { it.props.push(info); }
            }
            groups[g].items.push(it);
        }
    }
    function collectText(L, groups, order) {
        var an = L.property("ADBE Text Properties").property("ADBE Text Animators"), i, A, j, pr, info, s, k;
        for (i = 1; i <= an.numProperties; i++) {
            A = an.property(i);
            if (!/^(?:NABD|HAMDY) /.test(A.name)) { continue; }
            var g = groupOf(A.name);
            if (!groups[g]) { groups[g] = { g: g, items: [] }; order.push(g); }
            var it = { n: A.name, path: propPath(A), kind: "anim", on: A.enabled, props: [] };
            var P = A.property("ADBE Text Animator Properties");
            for (j = 1; j <= P.numProperties; j++) { info = propInfo(P.property(j)); if (info) { it.props.push(info); } }
            var SS = A.property("ADBE Text Selectors");
            for (j = 1; j <= SS.numProperties; j++) {
                s = SS.property(j);
                var names = ["ADBE Text Percent Start", "ADBE Text Percent End", "ADBE Text Percent Offset", "ADBE Text Temporal Freq", "ADBE Text Max Amount"];
                for (k = 0; k < names.length; k++) {
                    try { pr = s.property(names[k]); } catch (e1) { pr = null; }
                    if (pr && (pr.numKeys > 0 || names[k] === "ADBE Text Temporal Freq")) { info = propInfo(pr); if (info) { it.props.push(info); } }
                }
            }
            groups[g].items.push(it);
        }
    }
    function inspect() {
        var c = comp(), sel = c.selectedLayers;
        if (!sel.length) { return { layer: null }; }
        var L = sel[0], groups = {}, order = [], nabdLayer = /^(?:NABD|HAMDY) /.test(L.name), out = [], i;
        try { collectFx(L, groups, order, nabdLayer); } catch (e) {}
        var txt = null;
        if (L instanceof TextLayer) {
            try { collectText(L, groups, order); } catch (e2) {}
            try {
                var d = L.property("ADBE Text Properties").property("ADBE Text Document").value;
                txt = { text: String(d.text), size: d.fontSize, fill: d.applyFill ? rnd(d.fillColor) : null, stroke: d.applyStroke ? rnd(d.strokeColor) : null, sw: d.applyStroke ? d.strokeWidth : 0, trk: d.tracking, font: d.font };
            } catch (e3) {}
        }
        for (i = 0; i < order.length; i++) {
            var G = groups[order[i]], t0 = 1e9, t1 = -1e9, j, k, pp;
            for (j = 0; j < G.items.length; j++) {
                for (k = 0; k < G.items[j].props.length; k++) {
                    pp = G.items[j].props[k];
                    if (pp.nk > 0) { t0 = Math.min(t0, pp.t0); t1 = Math.max(t1, pp.t1); }
                }
            }
            if (t1 > t0) { G.t0 = Math.round(t0 / c.frameDuration); G.fr = Math.round((t1 - t0) / c.frameDuration); }
            out.push(G);
        }
        var kids = [];
        var sk = styleKids(c, L);
        for (i = 0; i < sk.length; i++) { kids.push(sk[i].name); }
        var lt = { idx: L.index, name: L.name, inF: Math.round(L.inPoint / c.frameDuration), outF: Math.round(L.outPoint / c.frameDuration), op: rnd(L.property("ADBE Transform Group").property("ADBE Opacity").value) };
        try { lt.blend = L.blendingMode === BlendingMode.SCREEN ? "screen" : (L.blendingMode === BlendingMode.ADD ? "add" : (L.blendingMode === BlendingMode.OVERLAY ? "overlay" : (L.blendingMode === BlendingMode.NORMAL ? "normal" : "other"))); } catch (eb) {}
        return { layer: lt, groups: out, text: txt, kids: kids, fps: Math.round(1 / c.frameDuration * 100) / 100 };
    }
    function editLayer(c, a) {
        var L = a.idx ? c.layer(a.idx) : c.selectedLayers[0];
        if (!L) { throw Err("NO_LAYERS"); }
        return L;
    }
    function setProp(a) {
        var c = comp(), L = editLayer(c, a), p = byPath(L, a.path), v = a.v, k;
        if (p.propertyValueType === PropertyValueType.COLOR && v.length === 3) { v = [v[0], v[1], v[2], 1]; }
        if (p.numKeys > 0) {
            k = a.key === "last" ? p.numKeys : 1;
            p.setValueAtKey(k, v);
        } else { p.setValue(v); }
        var kids = styleKids(c, L), i, kp;
        if (a.sync !== false) {
            for (i = 0; i < kids.length; i++) {
                try { kp = byPath(kids[i], a.path); if (kp.name === p.name && kp.parentProperty.name === p.parentProperty.name) { if (kp.numKeys > 0) { kp.setValueAtKey(a.key === "last" ? kp.numKeys : 1, v); } else { kp.setValue(v); } } } catch (ek) {}
            }
        }
        return "OK";
    }
    function keyDump(p, k) {
        var o = { t: p.keyTime(k), v: p.keyValue(k), ii: p.keyInInterpolationType(k), oi: p.keyOutInterpolationType(k) };
        try { o.ie = p.keyInTemporalEase(k); o.oe = p.keyOutTemporalEase(k); } catch (e) {}
        return o;
    }
    function retimeProp(p, t0, t1, n0, n1) {
        if (p.numKeys < 1) { return; }
        var ks = [], k, i, d;
        for (k = 1; k <= p.numKeys; k++) { ks.push(keyDump(p, k)); }
        for (k = p.numKeys; k >= 1; k--) { p.removeKey(k); }
        for (i = 0; i < ks.length; i++) {
            d = ks[i];
            var nt = (t1 > t0) ? n0 + (d.t - t0) * (n1 - n0) / (t1 - t0) : n0 + (d.t - t0);
            p.setValueAtTime(nt, d.v);
        }
        for (i = 0; i < ks.length; i++) {
            d = ks[i];
            k = i + 1;
            try { if (d.ie) { p.setTemporalEaseAtKey(k, d.ie, d.oe); } } catch (e2) {}
            try { p.setInterpolationTypeAtKey(k, d.ii, d.oi); } catch (e1) {}
        }
    }
    function eachGroupProp(L, g, fn) {
        var p = parade(L), i, j, e;
        for (i = p.numProperties; i >= 1; i--) {
            e = p.property(i);
            if (g !== "LAYER" && groupOf(e.name) !== g) { continue; }
            fn(e, "fx");
        }
        if (L instanceof TextLayer) {
            var an = L.property("ADBE Text Properties").property("ADBE Text Animators");
            for (i = an.numProperties; i >= 1; i--) { if (groupOf(an.property(i).name) === g) { fn(an.property(i), "anim"); } }
        }
    }
    function walkProps(P, fn) {
        var i, pr;
        for (i = 1; i <= P.numProperties; i++) {
            pr = P.property(i);
            if (pr.propertyType === PropertyType.PROPERTY) { fn(pr); } else { walkProps(pr, fn); }
        }
    }
    function retime(a) {
        var c = comp(), L = editLayer(c, a), fd = c.frameDuration, n0 = a.t0 * fd, n1 = (a.t0 + Math.max(1, a.fr)) * fd;
        var targets = [L].concat(styleKids(c, L)), j;
        for (j = 0; j < targets.length; j++) {
            var T = targets[j], t0 = 1e9, t1 = -1e9;
            eachGroupProp(T, a.g, function (e) { walkProps(e, function (pr) { if (pr.numKeys > 0) { t0 = Math.min(t0, pr.keyTime(1)); t1 = Math.max(t1, pr.keyTime(pr.numKeys)); } }); });
            if (t1 < t0) { continue; }
            eachGroupProp(T, a.g, function (e) { walkProps(e, function (pr) { if (pr.numKeys > 0) { retimeProp(pr, t0, t1, n0, n1); } }); });
        }
        return "OK";
    }
    function delGroup(a) {
        var c = comp(), L = editLayer(c, a), targets = [L].concat(styleKids(c, L)), j;
        if (a.g === "LAYER") { L.remove(); return "OK"; }
        for (j = 0; j < targets.length; j++) { eachGroupProp(targets[j], a.g, function (e) { e.remove(); }); }
        if (a.g === "HAMDY TYPE" && L instanceof TextLayer) {
            try { L.property("ADBE Text Properties").property("ADBE Text Document").expression = ""; } catch (e) {}
            var an = L.property("ADBE Text Properties").property("ADBE Text Animators"), i;
            for (i = an.numProperties; i >= 1; i--) { if (/^(?:NABD|HAMDY) (IN|OUT) type/.test(an.property(i).name)) { an.property(i).remove(); } }
        }
        if (a.g === "HAMDY STYLE") {
            var kids = styleKids(c, L), q2;
            for (q2 = kids.length - 1; q2 >= 0; q2--) { kids[q2].remove(); }
        }
        return "OK";
    }
    function toggleItem(a) {
        var c = comp(), L = editLayer(c, a), e = byPath(L, a.path);
        e.enabled = !!a.on;
        return "OK";
    }
    function setText(a) {
        var c = comp(), L = editLayer(c, a);
        if (!(L instanceof TextLayer)) { throw Err("NO_TEXT_LAYER"); }
        var tdp = L.property("ADBE Text Properties").property("ADBE Text Document"), d = tdp.value;
        if (a.text !== undefined) { d.text = String(a.text).replace(/\r\n|\n/g, "\r"); }
        if (a.size) { d.fontSize = a.size; }
        if (a.fill) { d.applyFill = true; d.fillColor = a.fill; }
        if (a.stroke) { d.applyStroke = true; d.strokeColor = a.stroke; }
        if (a.sw !== undefined) { d.applyStroke = a.sw > 0; if (a.sw > 0) { d.strokeWidth = a.sw; } }
        if (a.trk !== undefined) { d.tracking = a.trk; }
        if (a.font) { try { d.font = a.font; } catch (ef) {} }
        if (tdp.numKeys > 0) { tdp.setValueAtTime(c.time, d); } else { tdp.setValue(d); }
        if (a.size) {
            var kids = styleKids(c, L), i;
            for (i = 0; i < kids.length; i++) {
                if (!(kids[i] instanceof TextLayer)) { continue; }
                var kp = kids[i].property("ADBE Text Properties").property("ADBE Text Document"), kd = kp.value;
                kd.fontSize = a.size; try { kp.setValue(kd); } catch (ek) {}
            }
        }
        return "OK";
    }
    function setLayer(a) {
        var c = comp(), L = editLayer(c, a), fd = c.frameDuration;
        if (a.op !== undefined) { L.property("ADBE Transform Group").property("ADBE Opacity").setValue(a.op); }
        if (a.blend) { var bm = { screen: BlendingMode.SCREEN, add: BlendingMode.ADD, overlay: BlendingMode.OVERLAY, normal: BlendingMode.NORMAL }; if (bm[a.blend]) { L.blendingMode = bm[a.blend]; } }
        if (a.outF !== undefined) { L.outPoint = Math.max(L.inPoint + fd, a.outF * fd); }
        return "OK";
    }

    // ================================================================ lines
    function mkShape(p, ox, oy) {
        var s = new Shape(), v = [], i;
        for (i = 0; i < p.v.length; i++) { v.push([p.v[i][0] + (ox || 0), p.v[i][1] + (oy || 0)]); }
        s.vertices = v; s.inTangents = p.it; s.outTangents = p.ot; s.closed = !!p.cl;
        return s;
    }
    function addColorCtl(L, name, col) {
        var i = addEffect(L, "ADBE Color Control", name).propertyIndex;
        try { FX(L, i).property(1).setValue([col[0], col[1], col[2], 1]); } catch (e) {}
        return i;
    }
    function lineCtl(L, a, travel) {
        var pi = addSlider(L, "HAMDY LINE Progress", travel ? 100 : 0);
        addSlider(L, "HAMDY LINE Width", a.width || 100);
        var cols = a.colors || [[1, 0.42, 0.24], [1, 1, 1]];
        addColorCtl(L, "HAMDY LINE Color 1", cols[0]);
        addColorCtl(L, "HAMDY LINE Color 2", cols[1] || cols[0]);
        if (travel) { addSlider(L, "HAMDY LINE Speed", a.speed || 100); addSlider(L, "HAMDY LINE Length", 100); }
        return pi;
    }
    function trimExpr(k, s, start, ctl) {
        return "var p = " + ctl + ", s = " + s + ", k = " + k.toFixed(3) + ";\n" +
            "clamp(((p" + (start ? " - 50" : "") + ") / 50 * (1 + s) - s * k), 0, 1) * 100";
    }
    // one stroke per path: path -> trim -> stroke (trim must sit above the stroke)
    function buildLinePaths(L, paths, baseW, mode, opt) {
        var i, p, gi, ti, si, ctl = opt.ctl || "effect(\"HAMDY LINE Progress\")(1)", fx = opt.fxRef || "effect";
        var spread = 0;
        for (i = 0; i < paths.length; i++) { if (paths[i].d > 0) { spread = 0.6; } }
        for (i = 0; i < paths.length; i++) {
            p = paths[i];
            gi = addGroup(L, "HAMDY line " + (i + 1));
            var pi = addIn(L, gi, "ADBE Vector Shape - Group");
            if (opt.pathExpr) { GP(L, gi, pi).property("ADBE Vector Shape").expression = opt.pathExpr(i); }
            else { GP(L, gi, pi).property("ADBE Vector Shape").setValue(mkShape(p)); }
            if (!(mode === "travel" && (p.full || p.dash))) {
                ti = sTrim(L, gi);
                var tr = GP(L, gi, ti);
                if (mode === "travel") {
                    tr.property("ADBE Vector Trim Start").setValue(0);
                    GP(L, gi, ti).property("ADBE Vector Trim End").expression = (p.seg || 30) + " * " + fx + "(\"HAMDY LINE Length\")(1) / 100";
                    GP(L, gi, ti).property("ADBE Vector Trim Offset").expression = "(time - inPoint) * " + fx + "(\"HAMDY LINE Speed\")(1) * 1.8 * " + (p.rev ? -1 : 1) + " + " + (p.d * 360).toFixed(1);
                } else {
                    tr.property("ADBE Vector Trim End").expression = trimExpr(p.d, spread, false, ctl);
                    GP(L, gi, ti).property("ADBE Vector Trim Start").expression = trimExpr(p.d, spread, true, ctl);
                }
            }
            si = sStroke(L, gi, [1, 1, 1], 4, opt.cap !== "butt", p.op);
            GP(L, gi, si).property("ADBE Vector Stroke Color").expression = fx + "(\"HAMDY LINE Color " + (p.c + 1) + "\")(1)";
            GP(L, gi, si).property("ADBE Vector Stroke Width").expression = (baseW * p.w).toFixed(2) + " * " + fx + "(\"HAMDY LINE Width\")(1) / 100";
            if (p.dash) {
                try {
                    var ds = GP(L, gi, si).property("ADBE Vector Stroke Dashes");
                    ds.addProperty("ADBE Vector Stroke Dash 1");
                    GP(L, gi, si).property("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Gap 1");
                    GP(L, gi, si).property("ADBE Vector Stroke Dashes").property("ADBE Vector Stroke Dash 1").setValue(baseW * 2.2);
                    GP(L, gi, si).property("ADBE Vector Stroke Dashes").property("ADBE Vector Stroke Gap 1").setValue(baseW * 1.6);
                    GP(L, gi, si).property("ADBE Vector Stroke Dashes").property("ADBE Vector Stroke Offset").expression = "(time - inPoint) * " + fx + "(\"HAMDY LINE Speed\")(1) * " + (p.rev ? -0.8 : 0.8);
                } catch (ed) {}
            }
        }
    }
    function progressKeys(L, pidx, keys, snappy) {
        var pr = FX(L, pidx).property(1), i, k, o = snappy ? 88 : 70;
        for (i = 0; i < keys.length; i++) { pr.setValueAtTime(keys[i][0], keys[i][1]); }
        for (i = 0; i < keys.length; i++) {
            k = pr.nearestKeyIndex(keys[i][0]);
            setEase(pr, k, i === 0 ? 33 : o, i === keys.length - 1 ? 33 : o);
        }
    }
    function fxByName(L, name) {
        var p = parade(L), i;
        for (i = p.numProperties; i >= 1; i--) { if (p.property(i).name === name) { return i; } }
        throw Err("UNKNOWN");
    }
    function lineFx(a) {
        var c = comp(), W = c.width, H = c.height, fd = c.frameDuration;
        var paths = NABD_LINES.geo(a.kind, W, H);
        if (!paths.length) { throw Err("UNKNOWN"); }
        var top = topSelected(c), L, mode = a.mode || "draw", t0, t1, cut = 0, i;
        if (mode === "cover") {
            var sel = c.selectedLayers;
            cut = c.time;
            if (sel.length >= 2) { cut = 0; for (i = 0; i < sel.length; i++) { if (sel[i].inPoint > cut) { cut = sel[i].inPoint; } } }
            cut = snap(c, cut);
            var half = Math.max(3, Math.round((a.frames || 20) / 2)) * fd;
            t0 = Math.max(0, cut - half); t1 = Math.min(c.duration, cut + half);
        } else {
            t0 = snap(c, c.time); t1 = Math.min(c.duration, t0 + Math.max(0.5, a.secs || 3));
        }
        L = shapeLayer(c, "HAMDY LINE | " + (a.label || a.kind), [W / 2, H / 2]);
        L.label = 9;
        L.inPoint = t0; L.outPoint = t1;
        if (top && top !== L) { L.moveBefore(top); }
        var pidx = lineCtl(L, a, mode === "travel");
        var baseW = mode === "cover" ? 1 : Math.min(W, H) * 0.3 * 0.075;
        buildLinePaths(L, paths, baseW, mode, {});
        if (mode === "cover") {
            progressKeys(L, pidx, [[t0, 0], [cut, 50], [t1, 100]], a.snappy);
            if (a.sfx) { try { var S2 = c.layers.add(importFile(new File(a.sfx))); S2.name = "HAMDY SFX | lines"; S2.startTime = Math.max(0, t0); S2.moveToBeginning(); } catch (es) {} }
        } else if (mode === "draw") {
            var d = Math.max(4, a.frames || 20) * fd, ks = [[t0, 0], [Math.min(t1, t0 + d), 50]];
            if (a.erase !== false && t1 - d > t0 + d) { ks.push([t1 - d, 50]); ks.push([t1, 100]); }
            progressKeys(L, pidx, ks, false);
        }
        return "OK";
    }

    // ---------------------------------------------------- lines attached to a layer
    function attachExpr(kind, idx, rtl) {
        var head = "// HAMDY LINE attach\nvar r = parent.sourceRectAtTime(time, false), p = effect(\"HAMDY LINE Pad\")(1);\n" +
            "var l = r.left - p, t = r.top - p, R = r.left + r.width + p, b = r.top + r.height + p, cx = r.left + r.width / 2, cy = r.top + r.height / 2;\n" +
            "var a = Math.min(R - l, b - t) * 0.28;\n";
        var body;
        switch (kind) {
            case "atUnder": body = rtl ? "createPath([[R, b], [l, b]], [], [], false)" : "createPath([[l, b], [R, b]], [], [], false)"; break;
            case "atDouble": body = idx === 0 ? (rtl ? "createPath([[R, b], [l, b]], [], [], false)" : "createPath([[l, b], [R, b]], [], [], false)") :
                (rtl ? "createPath([[R - p * 2, b + p * 0.9], [l + p * 2, b + p * 0.9]], [], [], false)" : "createPath([[l + p * 2, b + p * 0.9], [R - p * 2, b + p * 0.9]], [], [], false)"); break;
            case "atStrike": body = rtl ? "createPath([[R, cy], [l, cy]], [], [], false)" : "createPath([[l, cy], [R, cy]], [], [], false)"; break;
            case "atBox": body = rtl ? "createPath([[R, t], [l, t], [l, b], [R, b]], [], [], true)" : "createPath([[l, t], [R, t], [R, b], [l, b]], [], [], true)"; break;
            case "atCorners":
                body = ["createPath([[l, t + a], [l, t], [l + a, t]], [], [], false)", "createPath([[R - a, t], [R, t], [R, t + a]], [], [], false)",
                    "createPath([[R, b - a], [R, b], [R - a, b]], [], [], false)", "createPath([[l + a, b], [l, b], [l, b - a]], [], [], false)"][idx]; break;
            case "atCircle":
                body = "var rx = (R - l) / 2 * 1.15, ry = (b - t) / 2 * 1.3, k = 0.5523;\n" +
                    "createPath([[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]], [[-rx * k, 0], [0, -ry * k], [rx * k, 0], [0, ry * k]], [[rx * k, 0], [0, ry * k], [-rx * k, 0], [0, -ry * k]], true)"; break;
            case "atBrackets":
                body = idx === 0 ? "var q = a * 0.6; createPath([[l + q, t], [l, t], [l, b], [l + q, b]], [], [], false)" : "var q = a * 0.6; createPath([[R - q, t], [R, t], [R, b], [R - q, b]], [], [], false)"; break;
            case "atSide": body = rtl ? "createPath([[R + p * 0.4, b], [R + p * 0.4, t]], [], [], false)" : "createPath([[l - p * 0.4, b], [l - p * 0.4, t]], [], [], false)"; break;
        }
        return head + body;
    }
    function lineAttach(a) {
        var c = comp(), sel = needSel(c), fd = c.frameDuration, n = 0, j, i;
        var count = { atCorners: 4, atBrackets: 2, atDouble: 2 }[a.kind] || 1;
        for (j = 0; j < sel.length; j++) {
            var T = sel[j];
            if (!animatable(T) || /^(?:NABD|HAMDY) /.test(T.name)) { continue; }
            var r = layerRect(T, T.inPoint) || { width: 200, height: 100 };
            var rtl = /[\u0600-\u06ff]/.test(layerText(T));
            var L = shapeLayer(c, "HAMDY STYLE LINE | " + a.kind + " | " + T.name, [0, 0]);
            tuck(c, L);
            L.parent = T;
            L.property("ADBE Transform Group").property("ADBE Position").setValue([0, 0]);
            try { L.inPoint = T.inPoint; L.outPoint = T.outPoint; } catch (eio) {}
            L.label = 9;
            var pidx2 = lineCtl(L, a, false);
            addSlider(L, "HAMDY LINE Pad", Math.max(6, r.height * 0.16));
            var paths = [];
            for (i = 0; i < count; i++) { paths.push({ v: [[0, 0], [1, 0]], it: [[0, 0], [0, 0]], ot: [[0, 0], [0, 0]], cl: false, w: i && a.kind === "atDouble" ? 0.6 : 1, c: i && a.kind === "atDouble" ? 1 : 0, d: a.kind === "atCorners" ? i * 0.15 : 0 }); }
            buildLinePaths(L, paths, Math.max(3, r.height * 0.07), "draw", { pathExpr: function (k) { return attachExpr(a.kind, k, rtl); } });
            var t0 = a.at === "playhead" ? snap(c, c.time) : T.inPoint, d = Math.max(4, a.frames || 16) * fd;
            var ks = [[t0, 0], [Math.min(T.outPoint, t0 + d), 50]];
            if (a.erase !== false && T.outPoint - d > t0 + d) { ks.push([T.outPoint - d, 50]); ks.push([T.outPoint, 100]); }
            progressKeys(L, pidx2, ks, false);
            if (a.kind === "atBox" || a.kind === "atCircle" || a.kind === "atUnder" || a.kind === "atDouble") { L.moveAfter(T); } else { L.moveBefore(T); }
            n++;
        }
        if (!n) { throw Err("NO_ANIM_LAYER"); }
        return "OK";
    }

    // ---------------------------------------------------------- text on a path
    // travel on a path: the word starts at "Start %", reaches "End %" after "Move Frames" (after "Delay Frames"), then holds
    function clearPathMarkers(L) {
        var M = L.property("ADBE Marker"), k;
        for (k = M.numKeys; k >= 1; k--) { try { if (/^HAMDY PATH | - (?:START|STOP|GO|END|\u0628\u062f\u0627\u064a\u0629|\u0648\u0642\u0641\u0629|\u064a\u0643\u0645\u0651\u0644|\u0646\u0647\u0627\u064a\u0629)$/.test(M.keyValue(k).comment)) { M.removeKey(k); } } catch (e) {} }
    }
    function pathTravel(L, ppi, a) {
        addSlider(L, "HAMDY PATH Start %", a.pStart === undefined ? 0 : a.pStart);
        addSlider(L, "HAMDY PATH End %", a.pEnd === undefined ? 100 : a.pEnd);
        addSlider(L, "HAMDY PATH Move Frames", a.pFrames || 45);
        addSlider(L, "HAMDY PATH Delay Frames", a.pDelay || 0);
        addCheck(L, "HAMDY PATH Pause", !!a.pPause);
        addSlider(L, "HAMDY PATH Pause At %", a.pMid === undefined ? 50 : a.pMid);
        addSlider(L, "HAMDY PATH Pause Frames", a.pHold === undefined ? 20 : a.pHold);
        addSlider(L, "HAMDY PATH Move 2 Frames", a.pFrames2 || 30);
        // timing lives on layer markers (like the motion presets): drag them on the timeline to retime the move
        var fd = comp().frameDuration, t0 = L.inPoint + (a.pDelay || 0) * fd, f1 = a.pFrames || 45;
        clearPathMarkers(L);
        var LS = pathLabel("start"), LP = pathLabel("stop"), LG = pathLabel("go"), LE = pathLabel("end");
        setMarker(L, LS, t0);
        if (a.pPause) {
            var tp = t0 + f1 * fd, tg = tp + (a.pHold === undefined ? 20 : a.pHold) * fd;
            setMarker(L, LP, tp); setMarker(L, LG, tg); setMarker(L, LE, tg + (a.pFrames2 || 30) * fd);
        } else { setMarker(L, LE, t0 + f1 * fd); }
        FX(L, ppi).property(1).expression = "// HAMDY PATH travel: drag the HAMDY PATH START / STOP / GO / END markers on the layer to retime it\n" +
            "var s = effect(\"HAMDY PATH Start %\")(1), e = effect(\"HAMDY PATH End %\")(1), f1 = Math.max(1, effect(\"HAMDY PATH Move Frames\")(1)), dl = effect(\"HAMDY PATH Delay Frames\")(1);\n" +
            "var on = effect(\"HAMDY PATH Pause\")(1), m = effect(\"HAMDY PATH Pause At %\")(1), hd = Math.max(0, effect(\"HAMDY PATH Pause Frames\")(1)), f2 = Math.max(1, effect(\"HAMDY PATH Move 2 Frames\")(1));\n" +
            "var fd = thisComp.frameDuration;\n" +
            "if (on >= 0.5) { e = 2 * m - s; } // with a pause it exits mirrored: same distance past the pause point, the other way\n" +
            "function ez(k) { k = clamp(k, 0, 1); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }\n" +
            "function mt(n, d) { try { return thisLayer.marker.key(n).time; } catch (err) { return d; } }\n" +
            "var t0 = mt(" + q2(LS) + ", inPoint + dl * fd);\n" +
            "if (on < 0.5) { var t1 = mt(" + q2(LE) + ", t0 + f1 * fd); s + (e - s) * ez((time - t0) / Math.max(fd, t1 - t0)); }\n" +
            "else { var tp = mt(" + q2(LP) + ", t0 + f1 * fd), tg = mt(" + q2(LG) + ", tp + hd * fd), te = mt(" + q2(LE) + ", tg + f2 * fd);\n" +
            "  if (time < tp) { s + (m - s) * ez((time - t0) / Math.max(fd, tp - t0)); } else if (time < tg) { m; } else { m + (e - m) * ez((time - tg) / Math.max(fd, te - tg)); } }";
    }
    function textPath(a) {
        var c = comp(), targets = [], j, i, fd = c.frameDuration;
        var geo = NABD_LINES.geo(a.kind, c.width, c.height);
        if (!geo.length) { throw Err("UNKNOWN"); }
        if (a.mode === "new") {
            if (!a.text) { throw Err("NO_TEXT"); }
            var NL = makeText(c, a.text, a.size || 90, [1, 1, 1], "l", a.font, 0);
            NL.inPoint = snap(c, c.time);
            NL.outPoint = a.flow === "travel" ? c.duration : Math.min(c.duration, NL.inPoint + Math.max(0.5, a.secs || 4));
            NL.property("ADBE Transform Group").property("ADBE Position").setValue([c.width / 2, c.height / 2]);
            targets.push(NL);
        } else {
            var sel = c.selectedLayers;
            for (j = 0; j < sel.length; j++) { if (sel[j] instanceof TextLayer) { targets.push(sel[j]); } }
            if (!targets.length) { throw Err("NO_TEXT_LAYER"); }
        }
        for (j = 0; j < targets.length; j++) {
            var L = targets[j], mp = L.property("ADBE Mask Parade"), p = parade(L);
            for (i = mp.numProperties; i >= 1; i--) { if (mp.property(i).name === "HAMDY PATH") { mp.property(i).remove(); } }
            for (i = p.numProperties; i >= 1; i--) { if (/^(?:NABD|HAMDY) PATH/.test(p.property(i).name)) { p.property(i).remove(); } }
            var oldK = styleKids(c, L);
            for (i = oldK.length - 1; i >= 0; i--) { if (/^(?:NABD|HAMDY) STYLE PATHLINE/.test(oldK[i].name)) { oldK[i].remove(); } }
            // left-justify so the margin math is predictable; measure the text before it bends
            var tdp = L.property("ADBE Text Properties").property("ADBE Text Document"), d = tdp.value;
            try { d.justification = ParagraphJustification.LEFT_JUSTIFY; tdp.setValue(d); } catch (ej) {}
            var r = layerRect(L, L.inPoint) || { left: 0, top: -50, width: 300, height: 100 };
            var ox = a.mode === "new" ? 0 : r.left + r.width / 2, oy = a.mode === "new" ? 0 : r.top + r.height / 2;
            mp.addProperty("ADBE Mask Atom");
            var mi = L.property("ADBE Mask Parade").numProperties, M = L.property("ADBE Mask Parade").property(mi);
            M.name = "HAMDY PATH";
            M.property("ADBE Mask Shape").setValue(mkShape(geo[0], ox, oy));
            try { M.maskMode = MaskMode.NONE; } catch (em) {}
            var po = L.property("ADBE Text Properties").property("ADBE Text Path Options");
            po.property("ADBE Text Path").setValue(mi);
            try { L.property("ADBE Text Properties").property("ADBE Text Path Options").property("ADBE Text Reverse Path").setValue(a.reverse ? 1 : 0); } catch (er) {}
            var ppi = addSlider(L, "HAMDY PATH Progress", a.flow === "static" ? (a.pStart || 0) : 50);
            addSlider(L, "HAMDY PATH Speed", a.speed || 160);
            addSlider(L, "HAMDY PATH Text Width", Math.round(r.width));
            var lenExpr = "var P = mask(\"HAMDY PATH\").maskPath, Lp = 0, q0 = P.pointOnPath(0), q1, i;\nfor (i = 1; i <= 48; i++) { q1 = P.pointOnPath(i / 48); Lp += length(q0, q1); q0 = q1; }\n";
            var fm = L.property("ADBE Text Properties").property("ADBE Text Path Options").property("ADBE Text First Margin");
            if (a.flow === "loop") {
                fm.expression = "// HAMDY PATH loop\n" + lenExpr + "var v = (time - inPoint) * effect(\"HAMDY PATH Speed\")(1);\n((v % Lp) + Lp) % Lp";
            } else {
                fm.expression = "// HAMDY PATH\n" + lenExpr + "effect(\"HAMDY PATH Progress\")(1) / 100 * Math.max(0, Lp - effect(\"HAMDY PATH Text Width\")(1))";
                if (a.flow === "travel") { pathTravel(L, ppi, a); }
            }
            if (a.guide) {
                var G = shapeLayer(c, "HAMDY STYLE PATHLINE | " + L.name, [0, 0]);
                tuck(c, G);
                G.parent = L;
                G.property("ADBE Transform Group").property("ADBE Position").setValue([0, 0]);
                try { G.inPoint = L.inPoint; G.outPoint = L.outPoint; } catch (eio) {}
                var gcol = (a.colors && a.colors[0]) || [1, 0.42, 0.24];
                var gpi = addSlider(G, "HAMDY LINE Progress", 100);
                addSlider(G, "HAMDY LINE Width", 100);
                addColorCtl(G, "HAMDY LINE Color 1", gcol);
                addColorCtl(G, "HAMDY LINE Color 2", gcol);
                var fsz = 90;
                try { fsz = d.fontSize || 90; } catch (efs) {}
                buildLinePaths(G, [{ v: geo[0].v, it: geo[0].it, ot: geo[0].ot, cl: geo[0].cl, w: 1, c: 0, d: 0, op: 70 }], Math.max(2, fsz * 0.035), "draw",
                    { pathExpr: function () { return "parent.mask(\"HAMDY PATH\").maskPath"; }, ctl: "effect(\"HAMDY LINE Progress\")(1) * 0.5" });
                var gp = FX(G, gpi).property(1);
                if (a.flow === "travel") { gp.expression = "Math.min(100, parent.effect(\"HAMDY PATH Progress\")(1) * 1.15 + 8)"; }
                else { gp.setValueAtTime(L.inPoint, 0); gp.setValueAtTime(Math.min(L.outPoint, L.inPoint + 18 * fd), 100); setEase(gp, 1, 33, 70); setEase(gp, 2, 70, 33); }
                G.moveAfter(L);
            }
        }
        return "OK";
    }

    // ============================================================= carousel
    function q2(s) { return "\"" + q(s) + "\""; }
    function carParams(cref) {
        return "var C = " + cref + ";\nfunction S(k) { return C.effect(\"HAMDY CAR \" + k)(1); }\n" +
            "var t = time - C.inPoint, NN = NNN;\n" +
            "var off = nabdCarOff(t, S(\"Motion\"), S(\"Speed\"), S(\"Rotation\"), S(\"Hold\"), NN);\n" +
            "var o = { shp: S(\"Shape\"), R: S(\"Radius\"), H: S(\"Height\"), rows: S(\"Rows\"), gap: S(\"Gap\"), off: off, turns: S(\"Turns\"), t: t };\n" +
            "var sp = S(\"Spread\") / 100;\n";
    }
    function carCore(i, N, tail) {
        return "// HAMDY CAROUSEL card\n" + NABD_CAR_SRC + "\n" + carParams("parent").replace("NNN", N) +
            "var q = nabdCar(" + i + ", NN, o);\n" + tail;
    }
    function rrExpr(src) {
        // rounded rectangle centred on the card, sized by Aspect / Round (live)
        return "var C = parent, asp = Math.max(0.1, C.effect(\"HAMDY CAR Aspect\")(1)), w = " + src[0] + ", h = " + src[1] + ", mw, mh;\n" +
            "if (w / h > asp) { mh = h; mw = h * asp; } else { mw = w; mh = w / asp; }\n" +
            "var cx = " + src[2] + ", cy = " + src[3] + ", r = Math.min(mw, mh) / 2 * clamp(C.effect(\"HAMDY CAR Round\")(1), 0, 100) / 100, k = r * 0.5523;\n" +
            "var l = cx - mw / 2, R = cx + mw / 2, T = cy - mh / 2, B = cy + mh / 2;\n" +
            "createPath([[l + r, T], [R - r, T], [R, T + r], [R, B - r], [R - r, B], [l + r, B], [l, B - r], [l, T + r]],\n" +
            "  [[0, 0], [0, 0], [-k, 0], [0, 0], [0, k], [0, 0], [k, 0], [0, 0]],\n" +
            "  [[0, 0], [k, 0], [0, 0], [0, k], [0, 0], [-k, 0], [0, 0], [0, -k]], true)";
    }
    function carSlider(L, name, v) { return addSlider(L, "HAMDY CAR " + name, v); }
    function carCheck(L, name, v) { return addCheck(L, "HAMDY CAR " + name, v); }
    function carColor(L, name, v) { return addColorCtl(L, "HAMDY CAR " + name, v); }
    function carCount(c) {
        var i, n = 0;
        for (i = 1; i <= c.numLayers; i++) { if (/^(?:NABD|HAMDY) CAROUSEL \d+$/.test(c.layer(i).name)) { n++; } }
        return n + 1;
    }
    var CAR_OPEN = { 5: 1, 6: 1, 9: 1, 10: 1, 11: 1, 12: 1, 15: 1 };
    function carousel(a) {
        var c = comp(), W = c.width, H = c.height, m = Math.min(W, H), fd = c.frameDuration;
        var N = Math.max(2, Math.min(40, Math.round(a.count || 8))), shp = a.shp || 0, i;
        var t0 = snap(c, c.time), t1 = Math.min(c.duration, t0 + Math.max(1, a.secs || 8));
        var sel = c.selectedLayers, person = (a.person && sel.length && animatable(sel[0])) ? sel[0] : null;
        if (a.person && !person) { throw Err("NEED_PERSON"); }
        var cx = W / 2, cy = H / 2;
        if (person) {
            var pr = layerRect(person, t0), pa = person.property("ADBE Transform Group").property("ADBE Anchor Point").value, pp = person.property("ADBE Transform Group").property("ADBE Position").value, ps = layerScale(person);
            if (pr) { cx = pp[0] + (pr.left + pr.width / 2 - pa[0]) * ps[0]; cy = pp[1] + (pr.top + pr.height * 0.28 - pa[1]) * ps[1]; }
            try { person.threeDLayer = true; } catch (e3) {}
        }
        var base = "HAMDY CAROUSEL " + carCount(c);
        var cardW = m * 0.2 * (a.size || 100) / 100;
        // ---- control null
        var C = c.layers.addNull();
        C.name = base;
        C.threeDLayer = true;
        C.inPoint = t0; C.outPoint = t1;
        var tg = C.property("ADBE Transform Group");
        tg.property("ADBE Anchor Point").setValue([0, 0, 0]);
        tg.property("ADBE Position").setValue([cx, cy, 0]);
        carSlider(C, "Shape", shp);
        carSlider(C, "Motion", a.motion || 0);
        carSlider(C, "Speed", (a.speed === undefined ? 30 : a.speed) * (a.reverse ? -1 : 1));
        carSlider(C, "Rotation", 0);
        carSlider(C, "Hold", a.hold || 1);
        var spi = carSlider(C, "Spread", 100);
        carSlider(C, "Radius", m * 0.34 * (a.radius || 100) / 100);
        carSlider(C, "Height", cardW * 1.35);
        carSlider(C, "Rows", a.rows || 2);
        carSlider(C, "Gap", cardW * 1.1);
        carSlider(C, "Turns", a.turns || 2);
        carSlider(C, "Card Size", cardW);
        carSlider(C, "Aspect", a.aspect || 1);
        carSlider(C, "Round", a.round === undefined ? 12 : a.round);
        carSlider(C, "Border", a.border || 0);
        carColor(C, "Border Color", a.borderColor || [1, 1, 1]);
        carSlider(C, "Face", a.face || 0);
        carSlider(C, "Tilt X", a.tiltX === undefined ? -12 : a.tiltX);
        carSlider(C, "Tilt Z", a.tiltZ || 0);
        carSlider(C, "Back Fade", a.backFade === undefined ? 35 : a.backFade);
        carSlider(C, "Back Dim", a.backDim === undefined ? 30 : a.backDim);
        carSlider(C, "Depth Blur", a.blur || 0);
        carSlider(C, "Palette", a.palette || 0);
        carColor(C, "Color A", a.colA || [1, 0.42, 0.24]);
        carColor(C, "Color B", a.colB || [0.24, 0.45, 1]);
        carColor(C, "Line Color", a.lineColor || [1, 1, 1]);
        carSlider(C, "Line Width", a.lineWidth || Math.max(2, m * 0.003));
        carCheck(C, "Orbit Line", !!a.orbit);
        carCheck(C, "Spokes", !!a.spokes);
        carCheck(C, "Chain", !!a.chain);
        var ldi = carSlider(C, "Line Draw", 100);
        C.property("ADBE Transform Group").property("ADBE Rotate X").expression = "effect(\"HAMDY CAR Tilt X\")(1)";
        C.property("ADBE Transform Group").property("ADBE Rotate Z").expression = "effect(\"HAMDY CAR Tilt Z\")(1)";
        if (a.intro) {
            var spP = FX(C, spi).property(1);
            spP.setValueAtTime(t0, 0); spP.setValueAtTime(Math.min(t1, t0 + 1.1), 100);
            setEase(spP, 1, 33, 85); setEase(spP, 2, 60, 33);
        }
        var ldP = FX(C, ldi).property(1);
        ldP.setValueAtTime(t0, 0); ldP.setValueAtTime(Math.min(t1, t0 + 1.2), 100);
        setEase(ldP, 1, 33, 70); setEase(ldP, 2, 70, 33);
        // ---- cards
        var imgs = a.images || [], mode = a.content || (imgs.length ? "images" : "colors"), cards = [], anchorL = person || topSelected(c);
        for (i = 0; i < N; i++) {
            var path = null;
            if (mode !== "colors" && imgs.length) {
                if (imgs[i]) { path = imgs[i]; } else if (mode === "images") { path = imgs[i % imgs.length]; }
            }
            var L, f = path ? new File(path) : null;
            if (f && f.exists) {
                L = c.layers.add(importFile(f));
                try { L.audioEnabled = false; } catch (eau) {}
                var mp = L.property("ADBE Mask Parade");
                mp.addProperty("ADBE Mask Atom");
                L.property("ADBE Mask Parade").property(1).name = "HAMDY CARD";
                L.property("ADBE Mask Parade").property(1).property("ADBE Mask Shape").expression = rrExpr(["width", "height", "width / 2", "height / 2"]);
                L.property("ADBE Transform Group").property("ADBE Scale").expression =
                    "var C = parent, asp = Math.max(0.1, C.effect(\"HAMDY CAR Aspect\")(1)), mw = (width / height > asp) ? height * asp : width;\nvar s = C.effect(\"HAMDY CAR Card Size\")(1) / mw * 100; [s, s, s]";
                try {
                    var si = addEffect(L, "ADBE Stroke", "HAMDY CAR Border").propertyIndex;
                    FX(L, si).property(1).setValue(1);
                    FX(L, si).property(4).expression = "parent.effect(\"HAMDY CAR Border Color\")(1)";
                    FX(L, si).property(5).expression = "Math.max(0.1, parent.effect(\"HAMDY CAR Border\")(1) * 2 * 100 / Math.max(1, transform.scale[0]))";
                    FX(L, si).property(6).setValue(100);
                    FX(L, si).property(7).expression = "parent.effect(\"HAMDY CAR Border\")(1) > 0 ? 100 : 0";
                } catch (est) {}
            } else {
                L = c.layers.addShape();
                var gi = addGroup(L, "card");
                var pi = addIn(L, gi, "ADBE Vector Shape - Group");
                GP(L, gi, pi).property("ADBE Vector Shape").expression = rrExpr(["C.effect(\"HAMDY CAR Card Size\")(1)", "C.effect(\"HAMDY CAR Card Size\")(1) / asp", "0", "0"]);
                var fi = sFill(L, gi, [1, 1, 1]);
                GP(L, gi, fi).property("ADBE Vector Fill Color").expression =
                    "var C = parent, pal = Math.round(C.effect(\"HAMDY CAR Palette\")(1)), A = C.effect(\"HAMDY CAR Color A\")(1), B = C.effect(\"HAMDY CAR Color B\")(1), k = " + i + ", n = " + N + ";\n" +
                    "if (pal == 1) { (k % 2) ? B : A; } else if (pal == 2) { hslToRgb([k / n, 0.75, 0.58, 1]); } else if (pal == 3) { A; } else { A + (B - A) * (n > 1 ? k / (n - 1) : 0); }";
                var sti = sStroke(L, gi, [1, 1, 1], 4, true);
                GP(L, gi, sti).property("ADBE Vector Stroke Color").expression = "parent.effect(\"HAMDY CAR Border Color\")(1)";
                GP(L, gi, sti).property("ADBE Vector Stroke Width").expression = "parent.effect(\"HAMDY CAR Border\")(1) * 2";
                GP(L, gi, sti).property("ADBE Vector Stroke Opacity").expression = "parent.effect(\"HAMDY CAR Border\")(1) > 0 ? 100 : 0";
            }
            L.name = base + " | card " + (i + 1);
            L.threeDLayer = true;
            L.inPoint = t0; L.outPoint = t1;
            L.parent = C;
            var LT = L.property("ADBE Transform Group");
            if (!(f && f.exists)) { LT.property("ADBE Anchor Point").setValue([0, 0, 0]); LT.property("ADBE Scale").setValue([100, 100, 100]); }
            var Pi = addEffect(L, "ADBE Point3D Control", "HAMDY CAR P").propertyIndex;
            FX(L, Pi).property(1).expression = carCore(i, N, "[q[0] * sp, q[1] * sp, q[2] * sp]");
            var Ni = addEffect(L, "ADBE Point3D Control", "HAMDY CAR N").propertyIndex;
            FX(L, Ni).property(1).expression = carCore(i, N, "var fc = Math.round(S(\"Face\"));\nif (fc == 1) { [0, 0, -1]; } else if (fc == 2) { C.fromWorldVec([0, 0, -1]); } else { [q[3], q[4], q[5]]; }");
            var Xi = addEffect(L, "ADBE Point3D Control", "HAMDY CAR X").propertyIndex;
            FX(L, Xi).property(1).expression = carCore(i, N, "[q[6], q[7], 0]");
            LT.property("ADBE Position").expression = "effect(\"HAMDY CAR P\")(1)";
            LT.property("ADBE Orientation").expression = "var P = effect(\"HAMDY CAR P\")(1), n = effect(\"HAMDY CAR N\")(1);\nlookAt(P, P - n * 100)";
            LT.property("ADBE Rotate Z").expression = "effect(\"HAMDY CAR X\")(1)[0]";
            var depth = "var C = parent, P = effect(\"HAMDY CAR P\")(1), w = C.toWorld(P), o0 = C.toWorld([0, 0, 0]);\nvar z = clamp((w[2] - o0[2]) / Math.max(1, C.effect(\"HAMDY CAR Radius\")(1)), -1, 1), d01 = (z + 1) / 2;\n";
            LT.property("ADBE Opacity").expression = depth + "effect(\"HAMDY CAR X\")(1)[1] * 100 * (1 - C.effect(\"HAMDY CAR Back Fade\")(1) / 100 * d01)";
            try {
                var bi = addEffect(L, "ADBE Brightness & Contrast 2", "HAMDY CAR Dim").propertyIndex;
                FX(L, bi).property(1).expression = depth + "-C.effect(\"HAMDY CAR Back Dim\")(1) * d01";
            } catch (eb) {}
            if (a.blur) {
                try {
                    var gbi = addEffect(L, "ADBE Gaussian Blur 2", "HAMDY CAR Blur").propertyIndex;
                    FX(L, gbi).property(1).expression = depth + "C.effect(\"HAMDY CAR Depth Blur\")(1) * d01 * 100 / Math.max(1, transform.scale[0])";
                } catch (eg) {}
            }
            L.label = 10;
            if (anchorL && anchorL !== L) { try { L.moveBefore(anchorL); } catch (emv) {} }
            cards.push(L);
        }
        C.moveBefore(cards[cards.length - 1]);
        try { C.moveToBeginning(); } catch (emb) {}
        // ---- lines (2D, drawn behind the cards)
        var LN = c.layers.addShape();
        LN.name = base + " | lines";
        LN.inPoint = t0; LN.outPoint = t1;
        LN.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, 0]);
        LN.property("ADBE Transform Group").property("ADBE Position").setValue([0, 0]);
        var cref = "thisComp.layer(" + q2(base) + ")", k, gl;
        function lineStroke(gi2, visExpr) {
            var tri = sTrim(LN, gi2);
            GP(LN, gi2, tri).property("ADBE Vector Trim End").expression = cref + ".effect(\"HAMDY CAR Line Draw\")(1)";
            var s2 = sStroke(LN, gi2, [1, 1, 1], 2, true);
            GP(LN, gi2, s2).property("ADBE Vector Stroke Color").expression = cref + ".effect(\"HAMDY CAR Line Color\")(1)";
            GP(LN, gi2, s2).property("ADBE Vector Stroke Width").expression = cref + ".effect(\"HAMDY CAR Line Width\")(1)";
            GP(LN, gi2, s2).property("ADBE Vector Stroke Opacity").expression = visExpr;
            if (a.lineStyle === "dashed") {
                try {
                    GP(LN, gi2, s2).property("ADBE Vector Stroke Dashes").addProperty("ADBE Vector Stroke Dash 1");
                    GP(LN, gi2, s2).property("ADBE Vector Stroke Dashes").property("ADBE Vector Stroke Dash 1").setValue(m * 0.012);
                } catch (ed) {}
            }
        }
        for (k = 0; k < 3; k++) {
            gl = addGroup(LN, "orbit " + (k + 1));
            var opi = addIn(LN, gl, "ADBE Vector Shape - Group");
            GP(LN, gl, opi).property("ADBE Vector Shape").expression = "// HAMDY CAROUSEL orbit line\n" + NABD_CAR_SRC + "\n" + carParams(cref).replace("NNN", N) +
                "var sh = Math.round(o.shp), open = " + "{5:1,6:1,9:1,10:1,11:1,12:1,15:1}[sh] ? true : false, K = 72, pts = [], s, q, j;\n" +
                "for (j = 0; j <= (open ? K : K - 1); j++) { o.su = j / K; q = nabdCar(" + k + ", NN, o); pts.push(C.toComp([q[0] * sp, q[1] * sp, q[2] * sp])); }\n" +
                "createPath(pts, [], [], !open)";
            lineStroke(gl, "var C = " + cref + ", sh = Math.round(C.effect(\"HAMDY CAR Shape\")(1)), r = Math.round(C.effect(\"HAMDY CAR Rows\")(1));\n" +
                "var need = (sh == 1 || sh == 2 || sh == 15) ? r : ((sh == 7 || sh == 8) ? 3 : 1);\n(C.effect(\"HAMDY CAR Orbit Line\")(1) > 0 && " + k + " < need) ? 100 : 0");
        }
        for (k = 0; k < N; k++) {
            gl = addGroup(LN, "spoke " + (k + 1));
            var spi2 = addIn(LN, gl, "ADBE Vector Shape - Group");
            GP(LN, gl, spi2).property("ADBE Vector Shape").expression = "var C = " + cref + ", L = thisComp.layer(" + q2(base + " | card " + (k + 1)) + ");\ncreatePath([C.toComp([0, 0, 0]), L.toComp(L.anchorPoint)], [], [], false)";
            lineStroke(gl, cref + ".effect(\"HAMDY CAR Spokes\")(1) > 0 ? 70 : 0");
        }
        gl = addGroup(LN, "chain");
        var chi = addIn(LN, gl, "ADBE Vector Shape - Group");
        GP(LN, gl, chi).property("ADBE Vector Shape").expression = "var pts = [], k, L;\nfor (k = 1; k <= " + N + "; k++) { L = thisComp.layer(" + q2(base + " | card ") + " + k); pts.push(L.toComp(L.anchorPoint)); }\ncreatePath(pts, [], [], true)";
        lineStroke(gl, cref + ".effect(\"HAMDY CAR Chain\")(1) > 0 ? 80 : 0");
        if (a.lineStyle === "glow") {
            try { var gli = addEffect(LN, "ADBE Glo2", "HAMDY CAR Glow").propertyIndex; FX(LN, gli).property(3).setValue(m * 0.02); FX(LN, gli).property(4).setValue(1.5); } catch (egl) {}
        }
        LN.label = 10;
        if (person) { LN.moveAfter(person); } else { LN.moveAfter(cards[0]); for (i = 0; i < cards.length; i++) { if (cards[i].index > LN.index) { LN.moveAfter(cards[i]); } } }
        C.moveToBeginning();
        return "OK";
    }
    function carPick(a) {
        var fl = (File.fs === "Windows") ? "Images/Videos:*.png;*.jpg;*.jpeg;*.webp;*.gif;*.psd;*.tif;*.tiff;*.bmp;*.mp4;*.mov;*.m4v" : function (f) { return (f instanceof Folder) || /\.(png|jpe?g|webp|gif|psd|tiff?|bmp|mp4|mov|m4v)$/i.test(f.name); };
        var r = File.openDialog("Hamdy Motion Kit: choose images", fl, a.multi !== false), out = [], i;
        if (!r) { return { paths: [] }; }
        if (!(r instanceof Array)) { r = [r]; }
        for (i = 0; i < r.length; i++) { out.push(r[i].fsName); }
        return { paths: out };
    }
    function carSwap(a) {
        var c = comp(), sel = c.selectedLayers, f = new File(a.path || ""), n = 0, j;
        if (!f.exists) { throw Err("NO_FILE"); }
        for (j = 0; j < sel.length; j++) {
            if (!/^(?:NABD|HAMDY) CAROUSEL \d+ \| card \d+$/.test(sel[j].name)) { continue; }
            if (!sel[j].source) { throw Err("COLOR_CARD"); }
            sel[j].replaceSource(importFile(f), false);
            n++;
        }
        if (!n) { throw Err("NO_CARD"); }
        return "OK";
    }

    // ============================================================= tracking
    function menuCmd(names) {
        var i, id;
        for (i = 0; i < names.length; i++) {
            try { id = app.findMenuCommandId(names[i]); } catch (e) { id = 0; }
            if (id) { app.executeCommand(id); return true; }
        }
        return false;
    }
    function selectOnly(c, L) {
        var i, s = c.selectedLayers;
        for (i = 0; i < s.length; i++) { try { s[i].selected = false; } catch (e) {} }
        try { L.selected = true; } catch (e2) {}
    }
    function footageSel(c) {
        var sel = needSel(c), i;
        for (i = 0; i < sel.length; i++) { if (isAV(sel[i]) && sel[i].source && !(sel[i].source.mainSource instanceof SolidSource) && !/^(?:NABD|HAMDY) /.test(sel[i].name)) { return sel[i]; } }
        throw Err("NO_FOOTAGE");
    }
    function trkStart(a) {
        var c = comp(), L = footageSel(c), ok = false;
        selectOnly(c, L);
        switch (a.kind) {
            case "point": ok = menuCmd(["Track Motion"]); break;
            case "stabilize": ok = menuCmd(["Stabilize Motion"]); break;
            case "camera":
                ok = menuCmd(["Track Camera"]);
                if (!ok) { try { addEffect(L, "ADBE 3D Tracker", "3D Camera Tracker"); ok = true; } catch (e) {} }
                break;
            case "warp":
                ok = menuCmd(["Warp Stabilizer VFX", "Warp Stabilize VFX", "Warp Stabilizer"]);
                if (!ok) { try { addEffect(L, "ADBE SubspaceStabilizer", "Warp Stabilizer"); ok = true; } catch (e2) {} }
                break;
            case "mask":
                var mp = L.property("ADBE Mask Parade");
                if (!mp.numProperties) { throw Err("NO_MASK"); }
                try { mp.property(mp.numProperties).selected = true; } catch (e3) {}
                ok = menuCmd(["Track Mask"]);
                break;
        }
        if (!ok) { throw Err("MENU_MISSING"); }
        return "OK_TRK_" + a.kind.toUpperCase();
    }
    function trackers(L) {
        var out = [], T = null, i, j, tr, pt, ap;
        try { T = L.property("ADBE MTrackers"); } catch (e) {}
        if (!T) { try { T = L.property("Motion Trackers"); } catch (e2) {} }
        if (!T) { return out; }
        for (i = 1; i <= T.numProperties; i++) {
            tr = T.property(i);
            var pts = [];
            for (j = 1; j <= tr.numProperties; j++) {
                pt = tr.property(j); ap = null;
                try { ap = pt.property("ADBE MTracker Pt Attach Pt"); } catch (e3) {}
                if (!ap) { try { ap = pt.property("Attach Point"); } catch (e4) {} }
                if (ap) { pts.push({ name: pt.name, keys: ap.numKeys, t0: ap.numKeys ? ap.keyTime(1) : 0, t1: ap.numKeys ? ap.keyTime(ap.numKeys) : 0 }); }
            }
            out.push({ name: tr.name, points: pts });
        }
        return out;
    }
    function trkInfo() {
        var c = comp(), sel = c.selectedLayers, i, nulls = [];
        for (i = 1; i <= c.numLayers; i++) { if (/^(?:NABD|HAMDY) TRACK \|/.test(c.layer(i).name)) { nulls.push(c.layer(i).name); } }
        for (i = 0; i < sel.length; i++) {
            if (isAV(sel[i]) && sel[i].source) {
                var t = trackers(sel[i]);
                if (t.length) { return { layer: sel[i].name, trackers: t, nulls: nulls }; }
            }
        }
        return { layer: sel.length ? sel[0].name : null, trackers: [], nulls: nulls };
    }
    function pickTracker(c, a, minPts) {
        var sel = c.selectedLayers, i, j, L = null, T = [];
        for (i = 0; i < sel.length && !L; i++) { if (isAV(sel[i]) && sel[i].source) { T = trackers(sel[i]); if (T.length) { L = sel[i]; } } }
        if (!L) { throw Err("NO_TRACK"); }
        for (j = T.length - 1; j >= 0; j--) {
            if (a.tracker && T[j].name !== a.tracker) { continue; }
            var good = 0, k;
            for (k = 0; k < T[j].points.length; k++) { if (T[j].points[k].keys > 0) { good++; } }
            if (good >= (minPts || 1)) { return { L: L, tr: T[j] }; }
        }
        throw Err(minPts >= 4 ? "NEED_4PTS" : "NO_TRACK_DATA");
    }
    function apRef(L, tr, pt) { return "thisComp.layer(" + q2(L.name) + ").motionTracker(" + q2(tr) + ")(" + q2(pt) + ").attachPoint"; }
    function findTrackNull(c, name) {
        var i, best = null;
        for (i = 1; i <= c.numLayers; i++) {
            var l = c.layer(i);
            if (name ? l.name === name : /^(?:NABD|HAMDY) TRACK \|/.test(l.name)) { if (!best || l.index < best.index) { best = l; } }
        }
        return best;
    }
    function trkNull(a) {
        var c = comp(), P = pickTracker(c, a, 1), L = P.L, tr = P.tr, pts = tr.points;
        var N = c.layers.addNull();
        N.name = "HAMDY TRACK | " + L.name + " | " + tr.name;
        N.inPoint = L.inPoint; N.outPoint = L.outPoint;
        N.label = 2;
        addSlider(N, "HAMDY TRK Smooth", a.smooth || 0);
        var oi = addEffect(N, "ADBE Point Control", "HAMDY TRK Offset").propertyIndex;
        try { FX(N, oi).property(1).setValue([0, 0]); } catch (eo) {}
        var src = "thisComp.layer(" + q2(L.name) + ")", A = apRef(L, tr.name, pts[0].name);
        N.property("ADBE Transform Group").property("ADBE Position").expression =
            "// HAMDY TRACK\nvar L = " + src + ", P = " + A + ", n = Math.round(effect(\"HAMDY TRK Smooth\")(1)), fd = thisComp.frameDuration, s = [0, 0], k, c = 0;\n" +
            "for (k = -n; k <= n; k++) { s = s + L.toComp(P.valueAtTime(time + k * fd)); c++; }\n" +
            "s / c + effect(\"HAMDY TRK Offset\")(1)";
        if (pts.length >= 2 && pts[1].keys > 0) {
            var B = apRef(L, tr.name, pts[1].name);
            addCheck(N, "HAMDY TRK Use Rotation", a.rot !== false);
            addCheck(N, "HAMDY TRK Use Scale", a.scale !== false);
            N.property("ADBE Transform Group").property("ADBE Rotate Z").expression =
                "var A = " + A + ", B = " + B + ", t0 = A.key(1).time;\n" +
                "function ang(t) { var d = B.valueAtTime(t) - A.valueAtTime(t); return Math.atan2(d[1], d[0]); }\n" +
                "effect(\"HAMDY TRK Use Rotation\")(1) > 0 ? radiansToDegrees(ang(time) - ang(t0)) : 0";
            N.property("ADBE Transform Group").property("ADBE Scale").expression =
                "var A = " + A + ", B = " + B + ", t0 = A.key(1).time;\n" +
                "function dist(t) { return length(B.valueAtTime(t), A.valueAtTime(t)); }\n" +
                "var s = effect(\"HAMDY TRK Use Scale\")(1) > 0 ? dist(time) / Math.max(0.001, dist(t0)) * 100 : 100;\n[s, s]";
        }
        N.moveBefore(L);
        var j;
        if (a.attach) {
            var sel = a.attachIdx || [];
            for (j = 0; j < sel.length; j++) { try { var X = c.layer(sel[j]); if (X !== L && X !== N) { X.parent = N; } } catch (ex) {} }
        }
        return "OK";
    }
    function trkAttach(a) {
        var c = comp(), N = findTrackNull(c, a.nullName), sel = c.selectedLayers, n = 0, j;
        if (!N) { throw Err("NO_TRACK_NULL"); }
        for (j = 0; j < sel.length; j++) {
            if (sel[j] === N || (isAV(sel[j]) && sel[j].source && trackers(sel[j]).length)) { continue; }
            sel[j].parent = N; n++;
        }
        if (!n) { throw Err("NO_LAYERS"); }
        return "OK";
    }
    function nullPt(N) { var v = N.property("ADBE Transform Group").property("ADBE Anchor Point").value; return [v[0], v[1]]; }
    function trkText(a) {
        var c = comp(), N = findTrackNull(c, a.nullName);
        if (!N) { throw Err("NO_TRACK_NULL"); }
        var K = c.height / 1080, fd = c.frameDuration, t = snap(c, c.time);
        var T = makeText(c, a.text || "\u0627\u0643\u062a\u0628 \u0647\u0646\u0627", (a.size || 60) * K, [1, 1, 1], "c", a.font, 0);
        T.name = "HAMDY TRACK TEXT | " + (a.text || "text");
        T.inPoint = Math.max(N.inPoint, t); T.outPoint = N.outPoint;
        centerAnchor(T, T.inPoint);
        if (a.style === "callout") {
            var S = shapeLayer(c, "HAMDY TRACK CALLOUT | " + (a.text || ""), [0, 0]);
            S.inPoint = T.inPoint; S.outPoint = T.outPoint;
            S.parent = N;
            var na = nullPt(N);
            S.property("ADBE Transform Group").property("ADBE Position").setValue(na);
            var dx = 160 * K * (a.side === "l" ? -1 : 1), dy = -140 * K;
            var g1 = addGroup(S, "dot");
            sEllipse(S, g1, 22 * K, [0, 0]); sFill(S, g1, rgb(a.acc, [1, 0.42, 0.24]));
            var g2 = addGroup(S, "ring");
            sEllipse(S, g2, 46 * K, [0, 0]); sStroke(S, g2, [1, 1, 1], 3 * K, true);
            var g3 = addGroup(S, "line");
            sPath(S, g3, [[0, 0], [dx * 0.55, dy], [dx * 1.6, dy]], false);
            var ti = sTrim(S, g3);
            sStroke(S, g3, [1, 1, 1], 3 * K, true);
            var te = GP(S, g3, ti).property("ADBE Vector Trim End");
            te.setValueAtTime(T.inPoint, 0); te.setValueAtTime(T.inPoint + 14 * fd, 100);
            setEase(te, 1, 33, 80); setEase(te, 2, 80, 33);
            var sc = GT(S, g2).property("ADBE Vector Scale");
            sc.setValueAtTime(T.inPoint, [0, 0]); sc.setValueAtTime(T.inPoint + 10 * fd, [100, 100]);
            linIn(sc, 2); sc.expression = overExpr(0.1, 2, 6);
            T.parent = N;
            T.property("ADBE Transform Group").property("ADBE Position").setValue([na[0] + dx * 1.6 + (a.side === "l" ? -1 : 1) * 10 * K, na[1] + dy - 40 * K]);
            var op = T.property("ADBE Transform Group").property("ADBE Opacity");
            op.setValueAtTime(T.inPoint + 8 * fd, 0); op.setValueAtTime(T.inPoint + 16 * fd, 100);
            S.moveAfter(T);
        } else {
            T.parent = N;
            var nb = nullPt(N);
            T.property("ADBE Transform Group").property("ADBE Position").setValue([nb[0], nb[1] - 90 * K]);
        }
        return "OK";
    }
    function trkCover(a) {
        var c = comp(), N = findTrackNull(c, a.nullName);
        if (!N) { throw Err("NO_TRACK_NULL"); }
        var A = c.layers.addSolid([1, 1, 1], "HAMDY TRACK " + (a.style === "pixel" ? "PIXEL" : "BLUR"), c.width, c.height, c.pixelAspect, c.duration);
        A.adjustmentLayer = true;
        A.inPoint = N.inPoint; A.outPoint = N.outPoint;
        A.moveBefore(N);
        addSlider(A, "HAMDY TRK Width", a.w || Math.round(c.height * 0.16));
        addSlider(A, "HAMDY TRK Height", a.h || Math.round(c.height * 0.2));
        var amt = addSlider(A, "HAMDY TRK Amount", a.style === "pixel" ? 30 : 40);
        A.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
        var M = A.property("ADBE Mask Parade").property(1);
        M.name = "HAMDY TRACK AREA";
        M.property("ADBE Mask Shape").expression =
            "var N = thisComp.layer(" + q2(N.name) + "), p = fromComp(N.toComp(N.anchorPoint)), rx = effect(\"HAMDY TRK Width\")(1) / 2, ry = effect(\"HAMDY TRK Height\")(1) / 2, k = 0.5523;\n" +
            "createPath([[p[0], p[1] - ry], [p[0] + rx, p[1]], [p[0], p[1] + ry], [p[0] - rx, p[1]]], [[-rx * k, 0], [0, -ry * k], [rx * k, 0], [0, ry * k]], [[rx * k, 0], [0, ry * k], [-rx * k, 0], [0, -ry * k]], true)";
        M.property("ADBE Mask Feather").setValue([12, 12]);
        if (a.style === "pixel") {
            var mi = addEffect(A, "ADBE Mosaic", "HAMDY TRK Mosaic").propertyIndex;
            FX(A, mi).property(1).expression = "Math.max(4, Math.round(120 - effect(\"HAMDY TRK Amount\")(1) * 1.1))";
            FX(A, mi).property(2).expression = "Math.max(4, Math.round((120 - effect(\"HAMDY TRK Amount\")(1) * 1.1) * thisComp.height / thisComp.width))";
        } else if (a.style === "dark") {
            var bi = addEffect(A, "ADBE Brightness & Contrast 2", "HAMDY TRK Dark").propertyIndex;
            FX(A, bi).property(1).expression = "-effect(\"HAMDY TRK Amount\")(1) * 2.5";
        } else {
            var gi = addEffect(A, "ADBE Gaussian Blur 2", "HAMDY TRK Blur").propertyIndex;
            FX(A, gi).property(1).expression = "effect(\"HAMDY TRK Amount\")(1) * thisComp.height / 1080";
            try { FX(A, gi).property(3).setValue(1); } catch (er) {}
        }
        return "OK";
    }
    function trkPin(a) {
        var c = comp(), P = pickTracker(c, a, 4), L = P.L, tr = P.tr, sel = c.selectedLayers, n = 0, j, k;
        var order = a.swap ? [0, 1, 3, 2] : [0, 1, 2, 3];
        for (j = 0; j < sel.length; j++) {
            var X = sel[j];
            if (X === L || !isAV(X)) { continue; }
            var p = parade(X);
            for (k = p.numProperties; k >= 1; k--) { if (p.property(k).name === "HAMDY TRACK PIN") { p.property(k).remove(); } }
            var fi = addEffect(X, "ADBE Corner Pin", "HAMDY TRACK PIN").propertyIndex;
            for (k = 0; k < 4; k++) {
                FX(X, fi).property(k + 1).expression = "var L = " + "thisComp.layer(" + q2(L.name) + ");\nfromComp(L.toComp(" + apRef(L, tr.name, tr.points[order[k]].name) + "))";
            }
            X.inPoint = Math.max(X.inPoint, L.inPoint);
            try { X.motionBlur = true; } catch (emb) {}
            if (X.index > L.index) { X.moveBefore(L); }
            n++;
        }
        if (!n) { throw Err("NEED_PIN_LAYER"); }
        return "OK";
    }
    function trkStab(a) {
        var c = comp(), P = pickTracker(c, a, 1), L = P.L, tr = P.tr, A = apRef(L, tr.name, tr.points[0].name);
        var tg = L.property("ADBE Transform Group");
        if (tg.property("ADBE Anchor Point").numKeys || tg.property("ADBE Position").numKeys) { throw Err("HAS_KEYS"); }
        var pos0 = tg.property("ADBE Position").value;
        addSlider(L, "HAMDY STAB Strength", 100);
        tg.property("ADBE Anchor Point").expression = "// HAMDY STAB\nvar P = " + A + ", s = effect(\"HAMDY STAB Strength\")(1) / 100;\nvalue + (P - P.valueAtTime(P.key(1).time)) * s";
        if (a.rot && tr.points.length >= 2 && tr.points[1].keys) {
            var B = apRef(L, tr.name, tr.points[1].name);
            tg.property("ADBE Rotate Z").expression = "var A = " + A + ", B = " + B + ", t0 = A.key(1).time, s = effect(\"HAMDY STAB Strength\")(1) / 100;\n" +
                "function ang(t) { var d = B.valueAtTime(t) - A.valueAtTime(t); return Math.atan2(d[1], d[0]); }\nvalue - radiansToDegrees(ang(time) - ang(t0)) * s";
        }
        if (a.zoom) { var sv = tg.property("ADBE Scale").value; tg.property("ADBE Scale").setValue([sv[0] * (1 + a.zoom / 100), sv[1] * (1 + a.zoom / 100)].concat(sv.length > 2 ? [sv[2]] : [])); }
        return "OK";
    }
    function trkBake() {
        var c = comp(), sel = needSel(c), fd = c.frameDuration, j, n = 0, k;
        var names = ["ADBE Position", "ADBE Rotate Z", "ADBE Scale", "ADBE Anchor Point"];
        for (j = 0; j < sel.length; j++) {
            var L = sel[j], tg = L.property("ADBE Transform Group");
            for (k = 0; k < names.length; k++) {
                var pr = tg.property(names[k]);
                if (!pr || !pr.expressionEnabled || !pr.expression) { continue; }
                var times = [], vals = [], t;
                for (t = L.inPoint; t < L.outPoint; t += fd) { times.push(t); vals.push(pr.valueAtTime(t, false)); }
                pr.expression = "";
                while (pr.numKeys) { pr.removeKey(1); }
                pr.setValuesAtTimes(times, vals);
                n++;
            }
        }
        return n ? "OK" : "OK_NOTHING";
    }

    // ===================================================== generative fill
    function gfDir() {
        var f = new Folder(Folder.myDocuments.fsName + "/HAMDY Fill");
        if (!f.exists) { f.create(); }
        return f;
    }
    function maskToComp(L, v, t) {
        var tg = L.property("ADBE Transform Group"), an = tg.property("ADBE Anchor Point").valueAtTime(t, false), po = tg.property("ADBE Position").valueAtTime(t, false);
        var sc = tg.property("ADBE Scale").valueAtTime(t, false), r = tg.property("ADBE Rotate Z").valueAtTime(t, false) * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r);
        var x = (v[0] - an[0]) * sc[0] / 100, y = (v[1] - an[1]) * sc[1] / 100;
        return [po[0] + x * cs - y * sn, po[1] + x * sn + y * cs];
    }
    function vecToComp(L, v, t) {
        var tg = L.property("ADBE Transform Group"), sc = tg.property("ADBE Scale").valueAtTime(t, false), r = tg.property("ADBE Rotate Z").valueAtTime(t, false) * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r);
        var x = v[0] * sc[0] / 100, y = v[1] * sc[1] / 100;
        return [x * cs - y * sn, x * sn + y * cs];
    }
    function compMasks(L, t) {
        var mp = L.property("ADBE Mask Parade"), out = [], i, k;
        for (i = 1; i <= mp.numProperties; i++) {
            var m = mp.property(i), sh = m.property("ADBE Mask Shape").valueAtTime(t, false), s = new Shape(), v = [], it = [], ot = [];
            for (k = 0; k < sh.vertices.length; k++) { v.push(maskToComp(L, sh.vertices[k], t)); it.push(vecToComp(L, sh.inTangents[k], t)); ot.push(vecToComp(L, sh.outTangents[k], t)); }
            s.vertices = v; s.inTangents = it; s.outTangents = ot; s.closed = sh.closed;
            out.push(s);
        }
        return out;
    }
    function gfFrame(a) {
        var c = comp(), t = snap(c, c.time), sel = c.selectedLayers, L = null, i;
        for (i = 0; i < sel.length; i++) { if (sel[i].property("ADBE Mask Parade") && sel[i].property("ADBE Mask Parade").numProperties) { L = sel[i]; break; } }
        if (a.needMask && !L) { throw Err("NO_MASK"); }
        var dir = gfDir(), stamp = String(new Date().getTime()), frame = new File(dir.fsName + "/frame_" + stamp + ".png");
        if (typeof c.saveFrameToPng !== "function") { throw Err("NO_SAVEFRAME"); }
        c.saveFrameToPng(t, frame);
        var out = { frame: frame.fsName, mask: null, w: c.width, h: c.height, time: t, src: L ? L.index : 0 };
        if (L) {
            var mf = new File(dir.fsName + "/mask_" + stamp + ".png");
            var T = app.project.items.addComp("NABD_GF_MASK", c.width, c.height, 1, c.frameDuration * 2, 1 / c.frameDuration);
            var bg = T.layers.addSolid([0, 0, 0], "black", c.width, c.height, 1, T.duration);
            var wh = T.layers.addSolid([1, 1, 1], "white", c.width, c.height, 1, T.duration);
            var ms = compMasks(L, t), k;
            for (k = 0; k < ms.length; k++) {
                wh.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
                var M = wh.property("ADBE Mask Parade").property(k + 1);
                M.property("ADBE Mask Shape").setValue(ms[k]);
                try { M.maskMode = MaskMode.ADD; } catch (emm) {}
                M.property("ADBE Mask Feather").setValue([a.feather || 0, a.feather || 0]);
                M.property("ADBE Mask Expansion").setValue(a.grow === undefined ? 12 : a.grow);
            }
            T.saveFrameToPng(0, mf);
            out.mask = mf.fsName;
            out.cleanup = T.id;
        }
        return out;
    }
    function gfCleanup(a) {
        var i, it, ids = {};
        for (i = app.project.numItems; i >= 1; i--) {
            it = app.project.item(i);
            if (it instanceof CompItem && it.name === "NABD_GF_MASK") {
                var k;
                for (k = 1; k <= it.numLayers; k++) { try { ids[it.layer(k).source.id] = true; } catch (e) {} }
                it.remove();
            }
        }
        for (i = app.project.numItems; i >= 1; i--) { it = app.project.item(i); if (it instanceof FootageItem && ids[it.id]) { try { it.remove(); } catch (e2) {} } }
        return "OK";
    }
    function gfImport(a) {
        var c = comp(), f = new File(a.path || "");
        if (!f.exists) { throw Err("NO_FILE"); }
        if (a.ext && (a.ext.l + a.ext.r + a.ext.u + a.ext.d) > 0) {
            var e2 = a.ext, W2 = c.width + e2.l + e2.r, H2 = c.height + e2.u + e2.d;
            var NC = app.project.items.addComp(c.name + " (HAMDY expanded)", W2, H2, c.pixelAspect, c.duration, 1 / c.frameDuration);
            var BG = NC.layers.add(importFile(f));
            BG.name = "HAMDY FILL | expanded background";
            BG.property("ADBE Transform Group").property("ADBE Position").setValue([W2 / 2, H2 / 2]);
            BG.outPoint = NC.duration;
            var OR = NC.layers.add(c);
            OR.property("ADBE Transform Group").property("ADBE Position").setValue([e2.l + c.width / 2, e2.u + c.height / 2]);
            try { NC.openInViewer(); } catch (eo) {}
            return "OK_EXPANDED";
        }
        var it = importFile(f), L = c.layers.add(it), t = a.time === undefined ? c.time : a.time, src = a.src ? c.layer(a.src) : null;
        L.name = "HAMDY FILL | " + (a.label || "AI");
        var ex = a.ext || { l: 0, r: 0, u: 0, d: 0 };
        L.property("ADBE Transform Group").property("ADBE Position").setValue([c.width / 2 + (ex.r - ex.l) / 2, c.height / 2 + (ex.d - ex.u) / 2]);
        L.startTime = 0;
        if (a.hold === "frame") { L.inPoint = t; L.outPoint = Math.min(c.duration, t + c.frameDuration); }
        else if (src) { L.inPoint = src.inPoint; L.outPoint = src.outPoint; }
        else { L.inPoint = t; L.outPoint = c.duration; }
        if (a.patch && src) {
            var ms = compMasks(src, t), k;
            for (k = 0; k < ms.length; k++) {
                L.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
                var M = L.property("ADBE Mask Parade").property(k + 1);
                var sh = ms[k], v = [], j;
                // patch layer space: centred comp-size image => layer px = comp px - offset
                for (j = 0; j < sh.vertices.length; j++) { v.push([sh.vertices[j][0] + ex.l, sh.vertices[j][1] + ex.u]); }
                var s2 = new Shape(); s2.vertices = v; s2.inTangents = sh.inTangents; s2.outTangents = sh.outTangents; s2.closed = sh.closed;
                M.property("ADBE Mask Shape").setValue(s2);
                try { M.maskMode = MaskMode.ADD; } catch (em) {}
                M.property("ADBE Mask Feather").setValue([a.feather === undefined ? 14 : a.feather, a.feather === undefined ? 14 : a.feather]);
                M.property("ADBE Mask Expansion").setValue(a.grow === undefined ? 12 : a.grow);
            }
        }
        if (src) { L.moveBefore(src); } else if (a.below) { L.moveToEnd(); }
        var N = a.follow ? findTrackNull(c, null) : null;
        if (N) { L.parent = N; }
        L.label = 11;
        return "OK";
    }
    function psSend(body) {
        var spec = null;
        try { spec = BridgeTalk.getSpecifier("photoshop"); } catch (e) {}
        if (!spec) { return false; }
        var bt = new BridgeTalk();
        bt.target = spec;
        bt.body = body;
        bt.send();
        try { BridgeTalk.bringToFront(spec); } catch (e2) {}
        return true;
    }
    function psPath(f) { return q2(f.fsName.replace(/\\/g, "/")); }
    // opens the frame in Photoshop, turns the AE mask into a selection and tries Generative Fill right away
    function gfPhotoshop(a) {
        var f = new File(a.path || "");
        if (!f.exists) { throw Err("NO_FILE"); }
        var m = a.mask ? new File(a.mask) : null, P = q2(a.prompt || "");
        var body = "(function(){\n" +
            "var doc = app.open(File(" + psPath(f) + "));\n" +
            (m && m.exists ?
                "try {\n" +
                " var mk = app.open(File(" + psPath(m) + ")); mk.selection.selectAll(); mk.selection.copy(); mk.close(SaveOptions.DONOTSAVECHANGES);\n" +
                " app.activeDocument = doc; var ch = doc.channels.add(); ch.name = 'HMK mask'; doc.activeChannels = [ch]; doc.paste();\n" +
                " doc.activeChannels = doc.componentChannels; doc.selection.deselect(); doc.selection.load(ch); ch.remove();\n" +
                " try {\n" +
                "  var d = new ActionDescriptor(), r = new ActionReference(); r.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));\n" +
                "  d.putReference(charIDToTypeID('null'), r); d.putString(stringIDToTypeID('prompt'), " + P + "); d.putString(stringIDToTypeID('serviceID'), 'clio');\n" +
                "  d.putEnumerated(stringIDToTypeID('mode'), stringIDToTypeID('syntheticFillMode'), stringIDToTypeID('inpaint'));\n" +
                "  var sd = new ActionDescriptor(); sd.putString(stringIDToTypeID('gi_PROMPT'), " + P + "); sd.putString(stringIDToTypeID('gi_MODE'), 'ginp');\n" +
                "  sd.putInteger(stringIDToTypeID('gi_SEED'), -1); sd.putInteger(stringIDToTypeID('gi_NUM_STEPS'), -1); sd.putInteger(stringIDToTypeID('gi_GUIDANCE'), 6); sd.putBoolean(stringIDToTypeID('gi_ADVANCED'), false);\n" +
                "  d.putObject(stringIDToTypeID('serviceOptionsList'), stringIDToTypeID('clio'), sd);\n" +
                "  executeAction(stringIDToTypeID('syntheticFill'), d, DialogModes.NO);\n" +
                " } catch (eg) {}\n" +
                "} catch (e) {}\n" : "") +
            "app.bringToFront();\n})();";
        if (psSend(body)) { return "OK_PS"; }
        f.execute();
        return "OK_PS_OPEN";
    }
    // asks Photoshop to save the current result (all layers merged) as a PNG next to the frame
    function gfPSBack(a) {
        var out = new File(a.out || "");
        var body = "(function(){ try { var d = app.activeDocument, dup = d.duplicate('hmk_out', true); dup.saveAs(File(" + psPath(out) + "), new PNGSaveOptions(), true, Extension.LOWERCASE); dup.close(SaveOptions.DONOTSAVECHANGES); } catch (e) {} })();";
        if (!psSend(body)) { throw Err("NO_PS"); }
        return "OK";
    }
    function gfCAF(a) {
        var c = comp(), sel = needSel(c), L = sel[0], mp = L.property("ADBE Mask Parade"), i;
        if (!mp || !mp.numProperties) { throw Err("NO_MASK"); }
        for (i = 1; i <= mp.numProperties; i++) {
            try { mp.property(i).maskMode = MaskMode.SUBTRACT; } catch (e) {}
            try { mp.property(i).property("ADBE Mask Expansion").setValue(a.grow === undefined ? 10 : a.grow); } catch (e2) {}
        }
        selectOnly(c, L);
        if (a.step === "track") {
            try { mp.property(mp.numProperties).selected = true; } catch (es) {}
            if (!menuCmd(["Track Mask"])) { throw Err("MENU_MISSING"); }
            return "OK_CAF_TRACK";
        }
        menuCmd(["Content-Aware Fill"]);
        return "OK_CAF";
    }

    // ============================================================ trim paths
    function walkVec(P, fn) {
        var i, pr;
        for (i = 1; i <= P.numProperties; i++) {
            pr = P.property(i);
            fn(pr);
            if (pr.matchName === "ADBE Vector Group") { walkVec(pr.property("ADBE Vectors Group"), fn); }
        }
    }
    function trimTargets(c, a) {
        var sel = c.selectedLayers, out = [], j, k;
        for (j = 0; j < sel.length; j++) {
            var L = sel[j];
            if (L instanceof ShapeLayer) { out.push(L); continue; }
            if ((L instanceof TextLayer) || (isAV(L) && L.source && /\.(ai|eps|pdf|svg)$/i.test(L.source.name))) {
                var before = c.numLayers, idx = L.index;
                selectOnly(c, L);
                var ok = menuCmd(L instanceof TextLayer ? ["Create Shapes from Text"] : ["Create Shapes from Vector Layer"]);
                if (ok && c.numLayers > before) {
                    for (k = 1; k <= c.numLayers; k++) { var X = c.layer(k); if (X instanceof ShapeLayer && X.name.indexOf(L.name) === 0 && X !== L && Math.abs(X.index - idx) <= 1) { out.push(X); break; } }
                }
            }
        }
        if (!out.length) { throw Err("NO_SHAPE"); }
        return out;
    }
    function trimApply(a) {
        var c = comp(), T = trimTargets(c, a), fd = c.frameDuration, d = Math.max(4, a.frames || 24) * fd, j, i;
        for (j = 0; j < T.length; j++) {
            var L = T[j], root = L.property("ADBE Root Vectors Group"), p = parade(L);
            for (i = p.numProperties; i >= 1; i--) { if (/^(?:NABD|HAMDY) TRIM/.test(p.property(i).name)) { p.property(i).remove(); } }
            for (i = root.numProperties; i >= 1; i--) { if (root.property(i).name === "HAMDY Trim") { root.property(i).remove(); } }
            // strokes where missing (outlines from text / logos usually only have fills)
            if (a.addStroke) {
                for (i = 1; i <= root.numProperties; i++) {
                    var G = root.property(i);
                    if (G.matchName !== "ADBE Vector Group") { continue; }
                    var hasS = false, fillC = null;
                    walkVec(G.property("ADBE Vectors Group"), function (pr) {
                        if (pr.matchName === "ADBE Vector Graphic - Stroke") { hasS = true; }
                        if (pr.matchName === "ADBE Vector Graphic - Fill" && !fillC) { try { fillC = pr.property("ADBE Vector Fill Color").value; } catch (e) {} }
                    });
                    if (!hasS) {
                        root.property(i).property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
                        var VG = root.property(i).property("ADBE Vectors Group"), st = VG.property(VG.numProperties);
                        st.property("ADBE Vector Stroke Color").setValue(a.strokeColor || fillC || [1, 1, 1, 1]);
                        st.property("ADBE Vector Stroke Width").setValue(a.width || 4);
                        try { st.property("ADBE Vector Stroke Line Cap").setValue(2); st.property("ADBE Vector Stroke Line Join").setValue(2); } catch (ec) {}
                    }
                }
            }
            var si = addSlider(L, "HAMDY TRIM Start", 0), ei = addSlider(L, "HAMDY TRIM End", 100), oi = addSlider(L, "HAMDY TRIM Offset", 0);
            if (a.style === "travel") { addSlider(L, "HAMDY TRIM Speed", a.speed || 100); }
            root.addProperty("ADBE Vector Filter - Trim");
            var tri = root.numProperties;
            L.property("ADBE Root Vectors Group").property(tri).name = "HAMDY Trim";
            var TR = L.property("ADBE Root Vectors Group").property(tri);
            try { TR.property("ADBE Vector Trim Type").setValue(a.individual ? 2 : 1); } catch (et) {}
            TR.property("ADBE Vector Trim Start").expression = "effect(\"HAMDY TRIM Start\")(1)";
            TR.property("ADBE Vector Trim End").expression = "effect(\"HAMDY TRIM End\")(1)";
            L.property("ADBE Root Vectors Group").property(tri).property("ADBE Vector Trim Offset").expression =
                a.style === "travel" ? "effect(\"HAMDY TRIM Offset\")(1) + (time - inPoint) * effect(\"HAMDY TRIM Speed\")(1) * 1.8" : "effect(\"HAMDY TRIM Offset\")(1)";
            // fills appear once the drawing is done, strokes can fade away after
            if (a.fillAfter) {
                var prog = "var e = effect(\"HAMDY TRIM End\")(1), s = effect(\"HAMDY TRIM Start\")(1), f = clamp((e - s - 92) / 8, 0, 1);\n";
                walkVec(L.property("ADBE Root Vectors Group"), function (pr) {
                    if (pr.matchName === "ADBE Vector Graphic - Fill") { pr.property("ADBE Vector Fill Opacity").expression = prog + "value * f"; }
                    if (pr.matchName === "ADBE Vector Graphic - Stroke" && a.strokeFade) { pr.property("ADBE Vector Stroke Opacity").expression = prog + "value * (1 - f * 0.9)"; }
                });
            }
            var t0 = (a.at === "playhead" ? snap(c, c.time) : L.inPoint) + j * (a.stagger || 0) * fd, t1 = Math.min(L.outPoint, t0 + d);
            var S = FX(L, si).property(1), E = FX(L, ei).property(1);
            var keys = function (P, va, vb, ta, tb) { P.setValueAtTime(ta, va); P.setValueAtTime(tb, vb); var ka = P.nearestKeyIndex(ta), kb = P.nearestKeyIndex(tb); setEase(P, ka, 33, a.snappy ? 85 : 66); setEase(P, kb, a.snappy ? 85 : 66, 33); };
            switch (a.style) {
                case "draw": keys(E, 0, 100, t0, t1); break;
                case "drawErase": keys(E, 0, 100, t0, t1); if (L.outPoint - d > t1) { keys(S, 0, 100, L.outPoint - d, L.outPoint); } break;
                case "center": S.setValue(50); E.setValue(50); keys(S, 50, 0, t0, t1); keys(E, 50, 100, t0, t1); break;
                case "reverse": keys(S, 100, 0, t0, t1); break;
                case "erase": keys(S, 0, 100, t0, t1); break;
                case "eraseEnd": keys(E, 100, 0, t0, t1); break;
                case "travel": E.setValue(a.seg || 25); break;
                case "chase": keys(E, 0, 100, t0, t1); keys(S, 0, 100, t0 + d * 0.35, t1 + d * 0.35); break;
            }
        }
        return "OK";
    }

    // ======================================================= the user's own path
    function findPathRef(L) {
        var root = null, i, j, out = null;
        try { if (L.matchName === "ADBE Vector Layer") { root = L.property("ADBE Root Vectors Group"); } } catch (e) {}
        function scan(P, chain) {
            var k, pr;
            for (k = 1; k <= P.numProperties && !out; k++) {
                pr = P.property(k);
                if (pr.matchName === "ADBE Vector Shape - Group") { out = chain + ".content(" + k + ").path"; return; }
                if (pr.matchName === "ADBE Vector Group") { scan(pr.property("ADBE Vectors Group"), chain + ".content(" + k + ")"); }
            }
        }
        if (root) { scan(root, ""); if (out) { return { kind: "shape", ref: "thisComp.layer(" + q2(L.name) + ")" + out }; } }
        var mp = null;
        try { mp = L.property("ADBE Mask Parade"); } catch (e2) {}
        if (mp && mp.numProperties) { return { kind: "mask", ref: "thisComp.layer(" + q2(L.name) + ").mask(" + mp.numProperties + ").maskPath", mask: mp.numProperties }; }
        return null;
    }
    function pickUserPath(c) {
        var sel = c.selectedLayers, i, r;
        for (i = 0; i < sel.length; i++) { r = findPathRef(sel[i]); if (r) { r.L = sel[i]; return r; } }
        throw Err("NO_USER_PATH");
    }
    function pathToHere(src, ref) {
        return "var S = thisComp.layer(" + q2(src) + "), P = " + ref + ", v = P.points(), it = P.inTangents(), ot = P.outTangents(), a = [], b = [], cc = [], i, q;\n" +
            "for (i = 0; i < v.length; i++) { q = fromComp(S.toComp(v[i])); a.push(q); b.push(fromComp(S.toComp(v[i] + it[i])) - q); cc.push(fromComp(S.toComp(v[i] + ot[i])) - q); }\n" +
            "createPath(a, b, cc, P.isClosed())";
    }
    function myPathText(a) {
        var c = comp(), U = pickUserPath(c), fd = c.frameDuration;
        var T = makeText(c, a.text || "\u0627\u0643\u062a\u0628 \u0647\u0646\u0627", a.size || 80, [1, 1, 1], "l", a.font, 0);
        T.name = "HAMDY PATH TEXT | " + (a.text || "text");
        T.inPoint = snap(c, c.time); T.outPoint = a.flow === "travel" ? c.duration : Math.min(c.duration, T.inPoint + Math.max(0.5, a.secs || 4));
        T.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, 0]);
        T.property("ADBE Transform Group").property("ADBE Position").setValue([0, 0]);
        var tw = 300;
        try { var r = layerRect(T, T.inPoint); if (r) { tw = r.width; } } catch (er) {}
        T.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
        var M = T.property("ADBE Mask Parade").property(1);
        M.name = "HAMDY PATH";
        M.property("ADBE Mask Shape").expression = pathToHere(U.L.name, U.ref);
        try { M.maskMode = MaskMode.NONE; } catch (em) {}
        T.property("ADBE Text Properties").property("ADBE Text Path Options").property("ADBE Text Path").setValue(1);
        try { T.property("ADBE Text Properties").property("ADBE Text Path Options").property("ADBE Text Reverse Path").setValue(a.reverse ? 1 : 0); } catch (erv) {}
        var ppi = addSlider(T, "HAMDY PATH Progress", a.flow === "static" ? (a.pStart || 0) : 50);
        addSlider(T, "HAMDY PATH Speed", a.speed || 160);
        addSlider(T, "HAMDY PATH Text Width", Math.round(tw));
        var lenExpr = "var P = mask(\"HAMDY PATH\").maskPath, Lp = 0, q0 = P.pointOnPath(0), q1, i;\nfor (i = 1; i <= 64; i++) { q1 = P.pointOnPath(i / 64); Lp += length(q0, q1); q0 = q1; }\n";
        var fm = T.property("ADBE Text Properties").property("ADBE Text Path Options").property("ADBE Text First Margin");
        if (a.flow === "loop") { fm.expression = "// HAMDY PATH loop\n" + lenExpr + "var v = (time - inPoint) * effect(\"HAMDY PATH Speed\")(1);\n((v % Lp) + Lp) % Lp"; }
        else {
            fm.expression = "// HAMDY PATH\n" + lenExpr + "effect(\"HAMDY PATH Progress\")(1) / 100 * Math.max(0, Lp - effect(\"HAMDY PATH Text Width\")(1))";
            if (a.flow === "travel") { pathTravel(T, ppi, a); }
        }
        T.moveBefore(U.L);
        return "OK";
    }
    function myPathFollow(a) {
        var c = comp(), U = pickUserPath(c), sel = c.selectedLayers, n = 0, j, k;
        for (j = 0; j < sel.length; j++) {
            var X = sel[j];
            if (X === U.L || !animatable(X)) { continue; }
            var p = parade(X);
            for (k = p.numProperties; k >= 1; k--) { if (/^(?:NABD|HAMDY) FOLLOW/.test(p.property(k).name)) { p.property(k).remove(); } }
            var pi = addSlider(X, "HAMDY FOLLOW Progress", 0);
            addCheck(X, "HAMDY FOLLOW Orient", a.orient !== false);
            addSlider(X, "HAMDY FOLLOW Angle", 0);
            addSlider(X, "HAMDY FOLLOW Speed", a.speed || 25);
            var d = Math.max(0.2, (X.outPoint - X.inPoint)), t0 = a.at === "playhead" ? snap(c, c.time) : X.inPoint;
            var pr = FX(X, pi).property(1);
            if (a.flow === "loop") { pr.expression = "((time - inPoint) * effect(\"HAMDY FOLLOW Speed\")(1)) % 100"; }
            else { pr.setValueAtTime(t0, 0); pr.setValueAtTime(Math.min(X.outPoint, t0 + (a.secs || d)), 100); setEase(pr, 1, 33, 60); setEase(pr, 2, 60, 33); }
            var src = "thisComp.layer(" + q2(U.L.name) + ")";
            var head = "var S = " + src + ", P = " + U.ref + ", u = clamp(effect(\"HAMDY FOLLOW Progress\")(1) / 100, 0, 1);\n";
            var tg = X.property("ADBE Transform Group");
            tg.property("ADBE Position").expression = "// HAMDY FOLLOW\n" + head + "var q = S.toComp(P.pointOnPath(u));\n" + (X.parent ? "q = parent.fromComp(q);\n" : "") + (X.threeDLayer ? "[q[0], q[1], value[2]]" : "q");
            tg.property("ADBE Rotate Z").expression = head + "if (effect(\"HAMDY FOLLOW Orient\")(1) > 0) { var p0 = P.pointOnPath(u), t = P.tangentOnPath(u), w = S.toComp(p0 + t) - S.toComp(p0); value + radiansToDegrees(Math.atan2(w[1], w[0])) + effect(\"HAMDY FOLLOW Angle\")(1); } else { value; }";
            n++;
        }
        if (!n) { throw Err("NEED_FOLLOWER"); }
        return "OK";
    }
    function myPathDraw(a) {
        var c = comp(), U = pickUserPath(c), fd = c.frameDuration, L = U.L;
        if (U.kind === "shape") {
            var args = {}, k;
            for (k in a) { if (a.hasOwnProperty(k)) { args[k] = a[k]; } }
            selectOnly(c, L);
            return trimApply(args);
        }
        // a mask on any layer: draw it with the Stroke effect
        var p = parade(L), i;
        for (i = p.numProperties; i >= 1; i--) { if (p.property(i).name === "HAMDY MASK DRAW") { p.property(i).remove(); } }
        var si = addEffect(L, "ADBE Stroke", "HAMDY MASK DRAW").propertyIndex;
        try { FX(L, si).property(1).setValue(U.mask); } catch (e1) {}
        try { FX(L, si).property(4).setValue((a.strokeColor || [1, 1, 1, 1])); } catch (e2) {}
        try { FX(L, si).property(5).setValue(a.width || 6); FX(L, si).property(6).setValue(100); } catch (e3) {}
        var t0 = a.at === "playhead" ? snap(c, c.time) : L.inPoint, d = Math.max(4, a.frames || 24) * fd;
        if (a.style === "travel") {
            FX(L, si).property(8).expression = "((time - inPoint) * 50) % 100";
            FX(L, si).property(9).expression = "Math.min(100, effect(\"HAMDY MASK DRAW\")(8) + " + (a.seg || 25) + ")";
        } else {
            var E = FX(L, si).property(9);
            E.setValueAtTime(t0, 0); E.setValueAtTime(t0 + d, 100); setEase(E, 1, 33, 70); setEase(E, 2, 70, 33);
        }
        try { FX(L, si).property(11).setValue(a.onTransparent ? 3 : 1); } catch (e4) {}
        return "OK";
    }

    // ============================================================ captions
    function capSource() {
        var c = comp(), sel = c.selectedLayers, L, i;
        for (i = 0; i < sel.length; i++) {
            L = sel[i];
            if (isAV(L) && L.source && L.source.file && L.hasAudio) {
                return { path: L.source.file.fsName, index: L.index, start: L.startTime, inPoint: L.inPoint, outPoint: L.outPoint, stretch: L.stretch, name: L.name };
            }
        }
        throw Err(sel.length ? "NO_AUDIO_LAYER" : "NO_LAYERS");
    }
    function f3(a) { var o = [], i; for (i = 0; i < a.length; i++) { o.push(Math.round(a[i] * 1000) / 1000); } return "[" + o.join(", ") + "]"; }
    function captions(a) {
        var c = comp(), K = c.height / 1080, W = c.width, H = c.height, caps = a.caps, st = a.style || {}, o = a.opts || {};
        if (!caps || !caps.length) { throw Err("NO_CAPS"); }
        var fd = c.frameDuration, acc = rgb(o.acc, [1, 0.42, 0.24]), col = rgb(o.color, [1, 1, 1]), bcol = rgb(o.boxColor, [0, 0, 0]);
        var N = c.layers.addNull();
        N.name = "HAMDY CAPTIONS";
        N.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, 0]);
        N.property("ADBE Transform Group").property("ADBE Position").setValue([W / 2, H * (o.y || 72) / 100]);
        span(N, Math.max(0, caps[0].s), Math.min(c.duration, caps[caps.length - 1].e + 0.1));
        var size = (o.size || 70) * K, i, j, L, B, cp, s0, e0, d, tdp, word = st.word, mx = 0;
        var WORD = {
            pop: [["ADBE Text Opacity", 0], ["ADBE Text Scale 3D", [0, 0, 100]]],
            reveal: [["ADBE Text Opacity", 0]],
            blur: [["ADBE Text Opacity", 0], ["ADBE Text Blur", [25 * K, 25 * K]]],
            karaoke: [["ADBE Text Fill Color", [acc[0], acc[1], acc[2], 1]]],
            fill: [["ADBE Text Fill Color", [acc[0], acc[1], acc[2], 1]]],
            bounce: [["ADBE Text Fill Color", [acc[0], acc[1], acc[2], 1]], ["ADBE Text Scale 3D", [118, 118, 100]]]
        };
        var AMT = {
            pop: "var k = clamp((t - s[i]) / 0.12, 0, 1);\nvar v = Math.pow(1 - k, 3) * 100;",
            reveal: "var v = t < s[i] ? 100 : 0;",
            blur: "var k = clamp((t - s[i]) / 0.18, 0, 1);\nvar v = Math.pow(1 - k, 2) * 100;",
            karaoke: "var v = (t >= s[i] && t < e[i]) ? 100 : 0;",
            fill: "var v = t >= s[i] ? 100 : 0;",
            bounce: "var k = (t >= s[i] && t < e[i]) ? clamp((t - s[i]) / 0.08, 0, 1) : 0;\nvar v = k * 100;"
        };
        for (i = 0; i < caps.length; i++) {
            cp = caps[i];
            s0 = Math.max(0, cp.s); e0 = Math.min(c.duration, Math.max(cp.e, s0 + fd * 4));
            L = makeText(c, cp.text, size, col, "c", o.font, o.trk || 0);
            tdp = L.property("ADBE Text Properties").property("ADBE Text Document");
            if (st.stroke || o.stroke) {
                d = tdp.value;
                try { d.applyStroke = true; d.strokeColor = [0, 0, 0]; d.strokeWidth = size * 0.14; d.strokeOverFill = false; tdp.setValue(d); } catch (es) {}
            }
            L.name = "HAMDY CAP " + ("000" + (i + 1)).slice(-3);
            span(L, s0, e0);
            anchorTo(L, s0, 0.5, 0.5);
            L.parent = N;
            L.property("ADBE Transform Group").property("ADBE Position").setValue([0, 0]);
            if (o.shadow) {
                var sh = addEffect(L, "ADBE Drop Shadow", "HAMDY Shadow").propertyIndex;
                try { FX(L, sh).property(2).setValue(153); } catch (eo) { try { FX(L, sh).property(2).setValue(60); } catch (eo2) {} }
                try { FX(L, sh).property(4).setValue(6 * K); FX(L, sh).property(5).setValue(18 * K); } catch (ed) {}
            }
            var ws = cp.words || [], sArr = [], eArr = [];
            for (j = 0; j < ws.length; j++) { sArr.push(ws[j] - s0); }
            for (j = 0; j < ws.length; j++) { eArr.push(j < ws.length - 1 ? ws[j + 1] - s0 : e0 - s0); }
            if (!sArr.length) { sArr = [0]; eArr = [e0 - s0]; }
            if (word && WORD[word]) {
                try { L.property("ADBE Text Properties").property("ADBE Text More Options").property("ADBE Text Anchor Point Option").setValue(2); } catch (eg) {}
                try { L.property("ADBE Text Properties").property("ADBE Text More Options").property("ADBE Text Anchor Point Align").setValue([0, -50]); } catch (ea) {}
                var an = L.property("ADBE Text Properties").property("ADBE Text Animators");
                an.addProperty("ADBE Text Animator");
                var ai = an.numProperties, pr = WORD[word], q2;
                L.property("ADBE Text Properties").property("ADBE Text Animators").property(ai).name = "HAMDY CAP " + word;
                for (q2 = 0; q2 < pr.length; q2++) { L.property("ADBE Text Properties").property("ADBE Text Animators").property(ai).property("ADBE Text Animator Properties").addProperty(pr[q2][0]); }
                for (q2 = 0; q2 < pr.length; q2++) {
                    var pp = L.property("ADBE Text Properties").property("ADBE Text Animators").property(ai).property("ADBE Text Animator Properties").property(pr[q2][0]);
                    try { pp.setValue(pr[q2][1]); } catch (ev) { try { pp.setValue(pr[q2][1].slice(0, 3)); } catch (ev2) {} }
                }
                L.property("ADBE Text Properties").property("ADBE Text Animators").property(ai).property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
                var es2 = L.property("ADBE Text Properties").property("ADBE Text Animators").property(ai).property("ADBE Text Selectors").property(1);
                try { es2.property("ADBE Text Range Type2").setValue(3); } catch (eb3) {}
                es2.property("ADBE Text Expressible Amount").expression =
                    "var s = " + f3(sArr) + ", e = " + f3(eArr) + ";\nvar i = Math.min(textIndex - 1, s.length - 1), t = time - inPoint;\n" + AMT[word] + "\n[v, v, v]";
                if (word === "karaoke" || word === "fill" || word === "bounce") {
                    keysAt(L.property("ADBE Transform Group").property("ADBE Opacity"), [s0, s0 + fd * 2], [0, 100], 33, 33);
                }
            } else if (st.anim === "slideUp") {
                mpApply(c, L, { id: "capUp", ease: "expo", tr: { op: 0, y: 40 } }, "in", s0, Math.min(e0, s0 + 0.25));
            } else if (st.anim === "pop") {
                mpApply(c, L, { id: "capPop", ease: "back", tr: { s: 0 } }, "in", s0, Math.min(e0, s0 + 0.18));
            } else {
                var op = L.property("ADBE Transform Group").property("ADBE Opacity");
                keysAt(op, [s0, s0 + fd * 3], [0, 100], 33, 33);
                if (e0 - s0 > fd * 8) { keysAt(op, [e0 - fd * 3, e0], [100, 0], 33, 33); }
            }
            if (st.box || o.box) {
                B = shapeLayer(c, "HAMDY CAP BOX " + ("000" + (i + 1)).slice(-3), [0, 0]);
                span(B, s0, e0);
                var gb = addGroup(B, "box"), rb = sRect(B, gb, 100, 100, [0, 0], 14 * K);
                sFill(B, gb, bcol, o.boxOp === undefined ? 75 : o.boxOp);
                B.parent = N;
                var lr = "thisComp.layer(\"" + q(L.name) + "\")";
                B.property("ADBE Transform Group").property("ADBE Position").expression = lr + ".transform.position";
                B.property("ADBE Transform Group").property("ADBE Anchor Point").expression = lr + ".transform.anchorPoint";
                GP(B, gb, rb).property("ADBE Vector Rect Size").expression = "var r = " + lr + ".sourceRectAtTime(time, false);\n[r.width + " + (36 * K) + ", r.height + " + (22 * K) + "];";
                GP(B, gb, rb).property("ADBE Vector Rect Position").expression = "var r = " + lr + ".sourceRectAtTime(time, false);\n[r.left + r.width / 2, r.top + r.height / 2];";
                B.property("ADBE Transform Group").property("ADBE Opacity").expression = lr + ".transform.opacity";
                B.moveAfter(L);
            }
            mx++;
        }
        return "OK_CAPS:" + mx;
    }
    function saveText(a) {
        var f = File.saveDialog("Hamdy Motion Kit: save " + (a.ext || "srt"), "*." + (a.ext || "srt"));
        if (!f) { return { path: null }; }
        if (!/\.\w+$/.test(f.name)) { f = new File(f.fsName + "." + (a.ext || "srt")); }
        f.encoding = "UTF-8";
        if (!f.open("w")) { throw Err("NO_WRITE"); }
        f.write(a.text);
        f.close();
        return { path: f.fsName };
    }
    function openText(a) {
        var f = File.openDialog("Hamdy Motion Kit: open " + (a.ext || "srt"));
        if (!f) { return { text: null }; }
        f.encoding = "UTF-8";
        f.open("r");
        var t = f.read();
        f.close();
        return { text: t, name: f.displayName };
    }

    // ============================================================ dispatch
    var NO_UNDO = { ping: 1, inspect: 1, carPick: 1, trkInfo: 1, gfPhotoshop: 1, gfPSBack: 1, libPick: 1, libList: 1, libOpen: 1, capSource: 1, saveText: 1, openText: 1, aiContext: 1, aiFrame: 1, aiSetTime: 1, renderNow: 1, saveFramePng: 1, openFolder: 1, easeCopy: 1, keySave: 1 };
    var CMDS = {
        ping: function () {
            var c = null, w = 0, h = 0;
            try { if (app.project.activeItem instanceof CompItem) { c = app.project.activeItem.name; w = app.project.activeItem.width; h = app.project.activeItem.height; } } catch (e) {}
            return { ver: VER, ae: app.version, comp: c, w: w, h: h };
        },
        transition: transition, motion: motion, textCreate: textCreate, textApply: textApply,
        title: titleBuild, element: elBuild, ease: ease, expr: expr, keys: keysOp,
        anchor: anchorMove, center: centerLayer, nullCtl: nullCtl, adjust: adjust, fit: fit, precomp: precomp,
        clearNabd: clearNabd, stagger: stagger, sequence: sequence, split: split, trim: trim,
        guides: guides, organize: organize, newComp: newComp,
        libPick: libPick, libList: libList, libUse: libUse, libOpen: libOpen,
        capSource: capSource, captions: captions, saveText: saveText, openText: openText,
        look: look, textStyle: textStyle,
        overlay: overlay, otrApply: otrApply, layerFrame: layerFrame, placeCutout: placeCutout, tplApply: tplApply, easeCopy: easeCopy, easePaste: easePaste, autoAnim: autoAnim, textBreak: textBreak, keySave: keySave, keyApply: keyApply, liquidGlass: liquidGlass, fixArabic: fixArabic, beatApply: beatApply, alignLayers: alignLayers, easeCurve: easeCurve, verticalize: verticalize, unusedItems: unusedItems, renderNow: renderNow, saveFramePng: saveFramePng, openFolder: openFolder, aiContext: aiContext, aiRun: aiRun, aiFrame: aiFrame, aiSetTime: aiSetTime, dpRig: dpRig, dpMove: dpMove, dpBake: dpBake, dpRemove: dpRemove, matteTr: matteTr, inspect: inspect, setProp: setProp, retime: retime, delGroup: delGroup, toggleItem: toggleItem, setText: setText, setLayer: setLayer,
        lineFx: lineFx, lineAttach: lineAttach, textPath: textPath,
        carousel: carousel, carPick: carPick, carSwap: carSwap,
        trkStart: trkStart, trkInfo: trkInfo, trkNull: trkNull, trkAttach: trkAttach, trkText: trkText, trkCover: trkCover, trkPin: trkPin, trkStab: trkStab, trkBake: trkBake,
        gfFrame: gfFrame, gfCleanup: gfCleanup, gfImport: gfImport, gfPhotoshop: gfPhotoshop, gfPSBack: gfPSBack, gfCAF: gfCAF, trimApply: trimApply,
        myPathText: myPathText, myPathFollow: myPathFollow, myPathDraw: myPathDraw
    };

    function run(s) {
        var a, res, undo = false;
        try {
            a = eval("(" + s + ")");
            if (!CMDS[a.cmd]) { return J({ ok: false, code: "UNKNOWN" }); }
            TUCK = a.tuck !== false;
            TIMING = a.timing !== false;
            MKN = a.mkName ? String(a.mkName) : ""; MKAR = a.mkLang !== "en";
            if (!NO_UNDO[a.cmd]) { app.beginUndoGroup("Hamdy: " + a.cmd); undo = true; }
            res = CMDS[a.cmd](a);
            if (undo) { app.endUndoGroup(); }
            return J({ ok: true, data: res });
        } catch (e) {
            if (undo) { try { app.endUndoGroup(); } catch (e2) {} }
            return J({ ok: false, code: e.nabd ? e.message : "ERROR", msg: String(e.message || e) + (e.line ? (" (line " + e.line + ")") : "") });
        }
    }
    return { run: run, VER: VER };
})();
