/* Hamdy Motion Kit — self-updater.
   On every panel start (and from the ⟳ button) it asks GitHub for the latest commit of HMK.repo,
   reads extension/version.json at that exact commit, downloads only the files whose SHA-256 changed,
   verifies each one, swaps them into the installed extension folder and reloads the panel.
   No network / no repo yet => the installed copy just keeps working. */
var HMK_UPD = (function () {
    var CEP = !!window.__adobe_cep__, req = (typeof require === 'function') ? require : null;
    var busy = false, listeners = [];
    function say(msg, kind) { listeners.forEach(function (f) { try { f(msg, kind); } catch (e) {} }); }
    function onStatus(f) { listeners.push(f); }
    function extDir() {
        var p = decodeURI(window.__adobe_cep__.getSystemPath('extension'));
        return /^Win/i.test(navigator.platform) ? p.replace('file:///', '') : p.replace('file://', '');
    }
    function get(url, asJSON, hops) {
        var https = req('https');
        return new Promise(function (res, rej) {
            var r = https.get(url, { headers: { 'User-Agent': 'HamdyMotionKit-Updater', 'Accept': asJSON === 'api' ? 'application/vnd.github+json' : '*/*' } }, function (rs) {
                if (rs.statusCode >= 300 && rs.statusCode < 400 && rs.headers.location && (hops || 0) < 5) { rs.resume(); return res(get(rs.headers.location, asJSON, (hops || 0) + 1)); }
                var ch = []; rs.on('data', function (c) { ch.push(c); });
                rs.on('end', function () {
                    var b = req('buffer').Buffer.concat(ch);
                    if (rs.statusCode !== 200) { return rej(new Error('HTTP ' + rs.statusCode + ' ' + url)); }
                    if (asJSON) { try { return res(JSON.parse(b.toString('utf8'))); } catch (e) { return rej(e); } }
                    res(b);
                });
            });
            r.on('error', rej);
            r.setTimeout(30000, function () { r.destroy(new Error('timeout')); });
        });
    }
    function mkdirp(d) {
        var fs = req('fs'), path = req('path');
        if (fs.existsSync(d)) { return; }
        mkdirp(path.dirname(d)); fs.mkdirSync(d);
    }
    function sha(buf) { return req('crypto').createHash('sha256').update(buf).digest('hex'); }
    function newer(a, b) {
        var x = String(a).split('.'), y = String(b).split('.'), i;
        for (i = 0; i < 3; i++) { var p = +(x[i] || 0), q = +(y[i] || 0); if (p !== q) { return p > q; } }
        return false;
    }
    function safeRel(rel) { return typeof rel === 'string' && rel && !/(^|[\\\/])\.\.([\\\/]|$)/.test(rel) && !/^[\\\/]/.test(rel) && !/^[a-z]:/i.test(rel); }
    function check(manual) {
        if (!CEP || !req || busy) { return Promise.resolve(false); }
        if (!HMK.repo || /^OWNER\//.test(HMK.repo)) { if (manual) { say('التحديث الأونلاين لسه متوصلش بحساب GitHub.', 'bad'); } return Promise.resolve(false); }
        busy = true;
        if (manual) { say('بدوّر على تحديث...'); }
        var fs = req('fs'), path = req('path'), root = extDir(), commit, man;
        return get('https://api.github.com/repos/' + HMK.repo + '/commits/' + HMK.branch, 'api').then(function (c) {
            commit = c.sha;
            return get('https://raw.githubusercontent.com/' + HMK.repo + '/' + commit + '/' + HMK.dir + '/version.json', true);
        }).then(function (m) {
            man = m;
            if (!newer(man.version, HMK.ver)) { if (manual) { say('عندك آخر نسخة ✓ (' + HMK.ver + ')', 'ok'); } return false; }
            var todo = Object.keys(man.files).filter(function (rel) {
                if (!safeRel(rel)) { return false; }
                try { return sha(fs.readFileSync(path.join(root, rel))) !== man.files[rel]; } catch (e) { return true; }
            });
            say('فيه نسخة جديدة ' + man.version + ' — بنزّل ' + todo.length + ' ملف...');
            var staged = [];
            return todo.reduce(function (p, rel) {
                return p.then(function () {
                    return get('https://raw.githubusercontent.com/' + HMK.repo + '/' + commit + '/' + HMK.dir + '/' + rel.split('/').map(encodeURIComponent).join('/')).then(function (buf) {
                        if (sha(buf) !== man.files[rel]) { throw new Error('ملف بايظ: ' + rel); }
                        var dst = path.join(root, rel), tmp = dst + '.hmkupd';
                        mkdirp(path.dirname(dst));
                        fs.writeFileSync(tmp, buf);
                        staged.push([tmp, dst]);
                    });
                });
            }, Promise.resolve()).then(function () {
                // everything downloaded & verified -> swap in one go
                staged.forEach(function (s) { try { fs.unlinkSync(s[1]); } catch (e) {} fs.renameSync(s[0], s[1]); });
                try { localStorage.setItem('hmk_updated_to', man.version); } catch (e) {}
                say('اتحدّث لـ ' + man.version + ' ✓ بيعيد التشغيل...', 'ok');
                setTimeout(function () { location.reload(); }, 900);
                return true;
            });
        }).catch(function (e) {
            if (manual) { say('مقدرتش أحدّث: ' + (e && e.message ? e.message : e), 'bad'); }
            return false;
        }).then(function (r) { busy = false; return r; });
    }
    return { check: check, onStatus: onStatus };
})();
