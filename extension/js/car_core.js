/* NABD carousel core — ONE function shared by the panel 3D previews and the After Effects expressions.
   Keep it ES3 (no let/const/arrow): tools/inject_geo.py copies its source into the card expressions.
   nabdCar(i, N, o) -> [px, py, pz, nx, ny, nz, roll, fade]
   p = card centre in carousel space (y down, +z away from viewer), n = outward normal (the way the card faces),
   roll = extra Z rotation (deg), fade = 0..1.  o.su set => sampling a guide line: u = o.su and i = ring/row index. */
function nabdCar(i, N, o) {
    var PI = Math.PI, TAU = 2 * PI, S = (o.su !== undefined && o.su !== null);
    var R = o.R, H = o.H, gap = o.gap, off = o.off, rows = Math.max(1, Math.round(o.rows || 1));
    var u = S ? o.su : i / N + off, fu = u - Math.floor(u);
    var p = [0, 0, 0], n = [0, 0, -1], roll = 0, fade = 1, a, row, j, M, y, r, d, ad, sg;
    function ringP(ang, yy, rad) { return [rad * Math.sin(ang), yy, -rad * Math.cos(ang)]; }
    function ringN(ang) { return [Math.sin(ang), 0, -Math.cos(ang)]; }
    function wrapD() { var q = fu * N; if (q > N / 2) { q -= N; } return q; }
    function edge(x, w) { return Math.max(0, Math.min(1, x / w)); }
    switch (Math.round(o.shp)) {
        case 0: // ring
            a = TAU * fu; p = ringP(a, 0, R); n = ringN(a); break;
        case 1: // cylinder rows
        case 2: // counter-rotating rows
            if (S) { row = i; a = TAU * fu; }
            else {
                row = i % rows; j = Math.floor(i / rows); M = Math.ceil(N / rows);
                a = TAU * (j / M + ((o.shp > 1.5 && row % 2) ? -off : off) + row * 0.5 / M);
            }
            if (S && o.shp > 1.5 && row % 2) { a = -a; }
            y = (row - (rows - 1) / 2) * H;
            p = ringP(a, y, R); n = ringN(a); break;
        case 3: // ferris wheel (faces the viewer)
            a = TAU * fu; p = [R * Math.sin(a), -R * Math.cos(a), 0]; n = [0, 0, -1]; break;
        case 4: // slot reel (vertical ring)
            a = TAU * fu; p = [0, -R * Math.sin(a), -R * Math.cos(a)]; n = [0, -Math.sin(a), -Math.cos(a)]; break;
        case 5: // helix
        case 6: // tornado / cone
            var turns = o.turns || 2;
            a = TAU * fu * turns; y = (0.5 - fu) * H * Math.max(1, rows);
            r = o.shp > 5.5 ? R * (0.3 + 0.7 * fu) : R;
            p = ringP(a, y, r); n = ringN(a);
            if (!S) { fade = Math.min(edge(fu, 0.08), edge(1 - fu, 0.08)); }
            break;
        case 7: // atom (3 tilted rings)
            row = S ? i : i % 3; j = S ? 0 : Math.floor(i / 3); M = Math.ceil(N / 3);
            a = S ? TAU * fu : TAU * (j / M + off * (1 + row * 0.3));
            var b = ringP(a, 0, R), bn = ringN(a), tx = 1.2, tz = row * PI / 3;
            var c1 = Math.cos(tx), s1 = Math.sin(tx), c2 = Math.cos(tz), s2 = Math.sin(tz);
            var b1 = [b[0], b[1] * c1 - b[2] * s1, b[1] * s1 + b[2] * c1], n1 = [bn[0], bn[1] * c1 - bn[2] * s1, bn[1] * s1 + bn[2] * c1];
            p = [b1[0] * c2 - b1[1] * s2, b1[0] * s2 + b1[1] * c2, b1[2]];
            n = [n1[0] * c2 - n1[1] * s2, n1[0] * s2 + n1[1] * c2, n1[2]];
            break;
        case 8: // sphere (fibonacci)
            if (S) { y = (i - 1) * 0.55; a = TAU * fu; }
            else { y = 1 - 2 * (i + 0.5) / N; a = i * 2.399963 + TAU * off; }
            r = Math.sqrt(Math.max(0, 1 - y * y));
            p = [R * r * Math.sin(a), R * y, -R * r * Math.cos(a)]; n = [r * Math.sin(a), y, -r * Math.cos(a)]; break;
        case 9: // cover flow
            d = S ? (fu - 0.5) * N : wrapD(); ad = Math.abs(d); sg = d < 0 ? -1 : 1;
            var cd = Math.max(-1, Math.min(1, d)), c0 = gap * 1.15;
            p = [ad <= 1 ? d * c0 : sg * (c0 + (ad - 1) * gap * 0.42), 0, Math.min(ad, 1) * R * 0.55];
            n = [-cd * 0.87, 0, -Math.sqrt(Math.max(0.05, 1 - cd * cd * 0.75))];
            fade = edge(N / 2 - ad, 1); break;
        case 10: // conveyor line
            d = S ? (fu - 0.5) * N : wrapD();
            p = [d * gap, 0, 0]; fade = edge(N / 2 - Math.abs(d), 1.2); break;
        case 11: // 3D wave line
            d = S ? (fu - 0.5) * N : wrapD(); a = d / N * TAU * 1.5;
            p = [d * gap, R * 0.22 * Math.sin(a), R * 0.45 * Math.cos(a) - R * 0.45]; fade = edge(N / 2 - Math.abs(d), 1.2); break;
        case 12: // fan of cards
            d = S ? (fu - 0.5) * N : wrapD(); a = d * (gap / Math.max(1, R)) * 0.9;
            p = [R * Math.sin(a), R * (1 - Math.cos(a)), Math.abs(d) * 2]; roll = a * 180 / PI; fade = edge(N / 2 - Math.abs(d), 1); break;
        case 13: // infinity in depth
            a = TAU * fu; var den = 1 + Math.sin(a) * Math.sin(a);
            p = [R * 1.45 * Math.cos(a) / den, 0, R * 1.1 * Math.sin(a) * Math.cos(a) / den]; break;
        case 14: // elliptic orbit
            a = TAU * fu; p = [R * 1.4 * Math.sin(a), R * 0.08 * Math.sin(2 * a), -R * 0.55 * Math.cos(a)]; break;
        case 15: // curved panorama wall (rows)
            if (S) { row = i; a = (fu - 0.5) * 2.4; }
            else { row = i % rows; j = Math.floor(i / rows); M = Math.ceil(N / rows); var cu = j / M + off; cu -= Math.floor(cu); a = (cu - 0.5) * TAU; fade = edge(1.35 - Math.abs(a), 0.35); }
            y = (row - (rows - 1) / 2) * H;
            p = [R * Math.sin(a), y, -R * (1 - Math.cos(a))]; n = [-Math.sin(a), 0, -Math.cos(a)];
            break;
        case 16: // floating cloud
            var sd = (i + 1) * 12.9898, rx = Math.sin(sd) * 43758.5453, ry = Math.sin(sd * 1.7) * 23421.631, rz = Math.sin(sd * 2.3) * 31337.123;
            rx -= Math.floor(rx); ry -= Math.floor(ry); rz -= Math.floor(rz);
            var ang2 = TAU * off, bx = (rx * 2 - 1) * R * 1.3, bz = (rz * 2 - 1) * R * 0.8, by = (ry * 2 - 1) * R * 0.6 + Math.sin((o.t || 0) * 1.3 + i) * R * 0.05;
            if (S) { bx = R * 1.3 * Math.sin(TAU * fu); bz = -R * 0.8 * Math.cos(TAU * fu); by = 0; }
            p = [bx * Math.cos(ang2) - bz * Math.sin(ang2), by, bx * Math.sin(ang2) + bz * Math.cos(ang2)]; break;
    }
    return [p[0], p[1], p[2], n[0], n[1], n[2], roll, fade];
}
/* rotation offset in turns for the motion modes: 0 spin, 1 step & hold, 2 swing, 3 manual, 4 spin & stop */
function nabdCarOff(t, mot, spd, rot, hold, N) {
    var off = rot / 360, m = Math.round(mot), dir = spd < 0 ? -1 : 1;
    if (m === 0) { off += t * spd / 360; }
    else if (m === 1) { var per = Math.max(0.1, hold) + 0.55, k = Math.floor(t / per), f = (t - k * per - Math.max(0.1, hold)) / 0.55; f = Math.max(0, Math.min(1, f)); f = f * f * (3 - 2 * f); off += dir * (k + f) / N; }
    else if (m === 2) { off += Math.sin(t * 2 * Math.PI * Math.abs(spd) / 360) * 0.12; }
    else if (m === 4) { var D = Math.max(0.3, hold * 2), e = Math.max(0, Math.min(1, t / D)); off += (1 - Math.pow(1 - e, 3)) * spd * D * 1.6 / 360; }
    return off;
}
var NABD_CAR = {
    core: nabdCar, offset: nabdCarOff,
    SHAPES: [
        { id: "car0", shp: 0, ar: "حلقة", en: "Ring", g: "حلقات", d: "الصور بتلف في دايرة حوالين نقطة (أو حوالين شخص)." },
        { id: "car1", shp: 1, ar: "أسطوانة", en: "Cylinder Rows", g: "حلقات", d: "أكتر من صف فوق بعض بيلفوا مع بعض.", rows: 2 },
        { id: "car2", shp: 2, ar: "صفوف عكس بعض", en: "Counter Rows", g: "حلقات", d: "كل صف بيلف عكس اللي جنبه.", rows: 2 },
        { id: "car7", shp: 7, ar: "ذرّة", en: "Atom Rings", g: "حلقات", d: "تلات حلقات مايلة متقاطعة." },
        { id: "car14", shp: 14, ar: "مدار بيضاوي", en: "Elliptic Orbit", g: "حلقات", d: "مدار عريض زي الكواكب." },
        { id: "car3", shp: 3, ar: "عجلة", en: "Ferris Wheel", g: "رأسي", d: "عجلة واقفة الصور فيها دايماً بتبص لك." },
        { id: "car4", shp: 4, ar: "بكرة سلوت", en: "Slot Reel", g: "رأسي", d: "بكرة بتلف لفوق زي ماكينة السلوت." },
        { id: "car5", shp: 5, ar: "حلزون", en: "Helix", g: "حلزون", d: "الصور طالعة في حلزون." , turns: 2 },
        { id: "car6", shp: 6, ar: "إعصار", en: "Tornado", g: "حلزون", d: "حلزون بيوسع لفوق.", turns: 2.5 },
        { id: "car8", shp: 8, ar: "كرة", en: "Sphere", g: "حجوم", d: "الصور متوزعة على كرة بتلف." },
        { id: "car16", shp: 16, ar: "سحابة", en: "Floating Cloud", g: "حجوم", d: "الصور طايرة في الفراغ وبتلف ببطء." },
        { id: "car9", shp: 9, ar: "كافر فلو", en: "Cover Flow", g: "خطوط", d: "صورة في النص والباقي مايلين على الجناب." },
        { id: "car10", shp: 10, ar: "سير متحرك", en: "Conveyor Line", g: "خطوط", d: "الصور ماشية على خط مستقيم." },
        { id: "car11", shp: 11, ar: "موجة", en: "3D Wave", g: "خطوط", d: "الصور ماشية على موجة في العمق." },
        { id: "car13", shp: 13, ar: "لا نهاية", en: "Infinity Path", g: "خطوط", d: "الصور ماشية على شكل ∞ في العمق." },
        { id: "car12", shp: 12, ar: "مروحة كروت", en: "Card Fan", g: "مسطّح", d: "الصور مفرودة زي كوتشينة." },
        { id: "car15", shp: 15, ar: "حيطة منحنية", en: "Panorama Wall", g: "مسطّح", d: "صفوف صور على حيطة مقوسة بتتزحلق.", rows: 2 }
    ]
};
