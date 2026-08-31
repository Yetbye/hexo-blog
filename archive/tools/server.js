#!/usr/bin/env node
// ============================================================
// Hexo Blog Manager v2 — Content Management System
// 管理：文章 / 说说 / 动态 / 数据文件 / 页面 / 部署
// Usage:
//   node server.js              # port 3000, project = repo root
//   node server.js --port 8080 --project /path/to/hexo --token SECRET
// ============================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const crypto = require('crypto');

// ---------- Config ----------
const args = process.argv.slice(2);
let PORT = 3000;
let PROJECT_ROOT = path.resolve(__dirname, '../..');
const AUTH_TOKEN = (() => {
    for (let i = 0; i < args.length; i++) if (args[i] === '--token' && args[i + 1]) return args[i + 1];
    return crypto.randomBytes(8).toString('hex');
})();
for (let i = 0; i < args.length; i++) {
    if (args[i] === '--port' && args[i + 1]) PORT = parseInt(args[i + 1]) || 3000;
    if (args[i] === '--project' && args[i + 1]) PROJECT_ROOT = path.resolve(args[i + 1]);
}

const SRC = (...p) => path.join(PROJECT_ROOT, 'source', ...p);
const DATA_DIR = SRC('data');
const MOMENT_IMG_DIR = SRC('image', 'moment');
const POSTCOVER_DIR = SRC('image', 'postcover');
const ACTIVITY_LOG = path.join(__dirname, 'activity.jsonl');

// YAML support — prefer project's own js-yaml, fallback to none
let yaml = null;
try { yaml = require(path.join(PROJECT_ROOT, 'node_modules', 'js-yaml')); } catch {}

// ---------- Activity log (行动记录) ----------
function logActivity(action, detail) {
    const entry = { ts: new Date().toISOString(), action, detail };
    try {
        fs.appendFileSync(ACTIVITY_LOG, JSON.stringify(entry) + '\n', 'utf8');
        console.log(`[ACTIVITY] ${action}: ${typeof detail === 'string' ? detail : JSON.stringify(detail).slice(0, 120)}`);
    } catch (e) { console.error('[ERROR] activity log:', e.message); }
}

function getActivity(limit = 100) {
    try {
        const lines = fs.readFileSync(ACTIVITY_LOG, 'utf8').trim().split('\n').filter(Boolean);
        return lines.slice(-limit).reverse().map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
    } catch { return []; }
}

// ---------- Safe path helpers ----------
function safeJoin(baseDir, name) {
    const clean = String(name || '').replace(/\0/g, '');
    const resolved = path.resolve(baseDir, clean);
    if (!resolved.startsWith(path.resolve(baseDir) + path.sep)) return null;
    return resolved;
}

// Allowed editable text-file roots (pages & posts & data)
const EDITABLE_TEXT_ROOTS = [SRC('_posts'), SRC('about'), SRC('links'), SRC('flinks'), SRC('_data'), DATA_DIR];
function resolveEditableText(relPath) {
    const rel = String(relPath || '').replace(/\\/g, '/');
    if (rel.includes('..') || rel.includes('\0')) return null;
    const abs = path.resolve(SRC(), rel);
    return EDITABLE_TEXT_ROOTS.some(root => abs === root || abs.startsWith(root + path.sep)) ? abs : null;
}

// Allowed image upload dirs with their public URL prefixes
const IMG_DIRS = [
    { dir: MOMENT_IMG_DIR, url: '/image/moment/' },
    { dir: POSTCOVER_DIR, url: '/image/postcover/' },
    { dir: SRC('image', 'gallery'), url: '/image/gallery/' },
];

// ---------- JSON/YAML file IO ----------
function readDataFile(p) {
    const ext = path.extname(p).toLowerCase();
    const raw = fs.readFileSync(p, 'utf8');
    if (ext === '.json') return JSON.parse(raw);
    if ((ext === '.yml' || ext === '.yaml') && yaml) return yaml.load(raw);
    return raw;
}
function writeDataFile(p, data) {
    const ext = path.extname(p).toLowerCase();
    let content;
    if (ext === '.json') content = JSON.stringify(data, null, 2) + '\n';
    else if (yaml) content = yaml.dump(data, { lineWidth: -1, noRefs: true });
    else throw new Error('js-yaml not available for YAML output');
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content, 'utf8');
}

// ---------- Frontmatter ----------
// js-yaml 会把 `date: 2025-06-06` 解析成 Date（UTC），dump 时变完整 ISO 串且 UTC+8 会偏移一天。
// 解析后立刻把 Date 转回本地日期字符串，保证 round-trip 无损。
function yamlDateToStr(d) {
    const pad = n => String(n).padStart(2, '0');
    const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (d.getHours() || d.getMinutes() || d.getSeconds()) return `${date} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    return date;
}
function normalizeDates(obj) {
    if (obj instanceof Date) return yamlDateToStr(obj);
    if (Array.isArray(obj)) return obj.map(normalizeDates);
    if (obj && typeof obj === 'object') {
        for (const k of Object.keys(obj)) obj[k] = normalizeDates(obj[k]);
    }
    return obj;
}
function parseFrontmatter(raw) {
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m) return { fm: {}, body: raw };
    if (yaml) {
        try { return { fm: normalizeDates(yaml.load(m[1]) || {}), body: m[2] }; }
        catch { /* fall through */ }
    }
    // regex fallback
    const fm = {};
    let currentKey = null, listItems = [];
    for (const line of m[1].split(/\r?\n/)) {
        const li = line.match(/^\s+-\s+(.*)/);
        const kv = line.match(/^(\w[\w-]*):\s*(.*)/);
        if (li && currentKey) listItems.push(li[1].trim().replace(/^["']|["']$/g, ''));
        else if (kv) {
            if (currentKey && listItems.length) fm[currentKey] = listItems;
            currentKey = kv[1]; listItems = [];
            const v = kv[2].trim();
            if (v !== '') { fm[currentKey] = v.replace(/^\["']|["']$/g, '').replace(/^["']|["']$/g, ''); currentKey = null; }
        }
    }
    if (currentKey && listItems.length) fm[currentKey] = listItems;
    return { fm, body: m[2] };
}
function buildFrontmatter(fm, body) {
    if (yaml) return `---\n${yaml.dump(fm, { lineWidth: -1, noRefs: true })}---\n${body}`;
    // minimal fallback
    const lines = Object.entries(fm).map(([k, v]) =>
        Array.isArray(v) && v.every(x => typeof x === 'string')
            ? `${k}:\n${v.map(x => `  - ${x}`).join('\n')}`
            : `${k}: ${v}`);
    return `---\n${lines.join('\n')}\n---\n${body}`;
}

// ---------- Posts ----------
function listPosts() {
    const out = [];
    (function walk(dir, prefix) {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            if (e.name.startsWith('.')) continue;
            const rel = prefix ? `${prefix}/${e.name}` : e.name;
            if (e.isDirectory()) walk(path.join(dir, e.name), rel);
            else if (e.name.endsWith('.md')) {
                try {
                    const { fm } = parseFrontmatter(fs.readFileSync(path.join(dir, e.name), 'utf8'));
                    out.push({
                        file: rel,
                        title: fm.title || e.name.replace(/\.md$/, ''),
                        date: fm.date || '',
                        updated: fm.updated || '',
                        categories: [].concat(fm.categories || []),
                        tags: [].concat(fm.tags || []),
                        cover: fm.cover || '',
                        slug: fm.slug || '',
                        url: computePostUrl(rel, fm)
                    });
                } catch (err) { console.error(`[WARN] parse ${rel}: ${err.message}`); }
            }
        }
    })(SRC('_posts'), '');
    return out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

// ---------- Data collections (shuoshuo / moments / notebooks / albums / places) ----------
const COLLECTIONS = {
    'shuoshuo':  { file: () => path.join(DATA_DIR, 'shuoshuo.json'),  type: 'json' },
    'moments':   { file: () => path.join(DATA_DIR, 'moments.json'),   type: 'json' },
    'notebooks': { file: () => SRC('notes', 'notebooks.json'),        type: 'json' }, // 笔记本在 source/notes/ 下
    'albums':    { file: () => path.join(DATA_DIR, 'albums.json'),    type: 'json' },
    'places':    { file: () => path.join(DATA_DIR, 'places.json'),    type: 'json' },
};

// ---------- Hexo URL 计算（与 permalink: articles/:slug/ 对齐） ----------
// slug 规则：frontmatter.slug 优先；否则取相对 _posts 的路径去 .md（子目录保留目录前缀）
function computePostUrl(relFile, fm) {
    const rel = String(relFile || '').replace(/\\/g, '/').replace(/\.md$/i, '');
    const slug = (fm && fm.slug) ? String(fm.slug) : rel;
    const encoded = slug.split('/').map(s => encodeURIComponent(s)).join('/');
    return `/articles/${encoded}/`;
}

// 保存笔记本时回填缺失的文章真实 URL（以当前 _posts 为准）
function ensureNotebookUrls(items) {
    const posts = listPosts();
    const byKey = new Map();
    for (const p of posts) {
        if (p.slug) byKey.set(p.slug, p.url);
        byKey.set(p.file.replace(/\.md$/i, ''), p.url);
        byKey.set(p.title, p.url);
    }
    let filled = 0;
    for (const nb of items) {
        for (const a of (nb.articles || [])) {
            if (!a.url) {
                const hit = byKey.get(a.slug) || byKey.get(a.title);
                if (hit) { a.url = hit; filled++; }
            }
        }
    }
    return filled;
}

// ---------- Process management (build/deploy/preview) ----------
let jobs = {}; // id -> {type, proc, startedAt, log[], done, exitCode}
function startJob(type, cmdArgs, timeoutMs) {
    if (Object.values(jobs).some(j => !j.done && j.type === type)) return null;
    const id = crypto.randomBytes(4).toString('hex');
    const job = { type, startedAt: Date.now(), log: [], done: false, exitCode: null };
    jobs[id] = job;
    const proc = spawn('npx', ['hexo', ...cmdArgs], { cwd: PROJECT_ROOT, shell: true });
    job.proc = proc;
    const push = d => { job.log.push(d.toString()); if (job.log.length > 2000) job.log.shift(); };
    proc.stdout.on('data', push);
    proc.stderr.on('data', push);
    const timer = setTimeout(() => { try { proc.kill('SIGTERM'); } catch {} job.log.push(`\n[TIMEOUT] ${timeoutMs / 1000}s exceeded\n`); }, timeoutMs);
    proc.on('close', code => { clearTimeout(timer); job.exitCode = code; job.done = true; job.durationMs = Date.now() - job.startedAt; });
    proc.on('error', err => { clearTimeout(timer); job.log.push('\n[ERROR] ' + err.message + '\n'); job.exitCode = -1; job.done = true; });
    // 修剪历史任务，防止长期运行内存无限增长（保留最近 20 条）
    const ids = Object.keys(jobs);
    if (ids.length > 20) for (const old of ids.slice(0, ids.length - 20)) delete jobs[old];
    logActivity(`job:${type}`, `id=${id} args=${cmdArgs.join(' ')}`);
    return id;
}
function stopPreview() {
    for (const [id, j] of Object.entries(jobs)) {
        if (j.type === 'server' && !j.done) { try { j.proc.kill('SIGTERM'); } catch {} return id; }
    }
    return null;
}

// ---------- Auth & body ----------
function checkAuth(req, res) {
    const token = req.headers['x-auth-token'];
    if (token === AUTH_TOKEN) return true;
    sendJson(res, { error: 'Unauthorized — 需要访问令牌（启动 server 时控制台会显示）' }, 401);
    return false;
}
function readBody(req, limit = 20 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
        let size = 0; const chunks = [];
        req.on('data', c => { size += c.length; if (size > limit) { req.destroy(); reject(new Error('请求体超过限制')); return; } chunks.push(c); });
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

// ---------- HTTP helpers ----------
function sendJson(res, data, status = 200) {
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': `http://localhost:${PORT}`,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    });
    res.end(JSON.stringify(data));
}
function sendHtml(res, p) {
    try {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
        res.end(fs.readFileSync(p, 'utf8'));
    }
    catch { res.writeHead(404); res.end('Not found'); }
}

// ---------- Server ----------
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

// Serve uploaded/source images so the admin UI can preview them
function serveImage(req, res, pathname) {
    const rel = decodeURIComponent(pathname.replace('/img/', ''));
    const abs = safeJoin(SRC('image'), rel);
    if (!abs || !fs.existsSync(abs)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
    const stream = fs.createReadStream(abs);
    stream.on('error', () => { try { res.writeHead(404); res.end(); } catch {} });
    stream.pipe(res);
}

const server = http.createServer(async (req, res) => {
    // DNS rebinding 防护：只接受 localhost / 127.0.0.1 的 Host
    const host = String(req.headers.host || '');
    if (!/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host)) {
        res.writeHead(403); return res.end('Forbidden');
    }
    const url = new URL(req.url, `http://${req.headers.host}`);
    const p = url.pathname;

    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': `http://localhost:${PORT}`,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        });
        return res.end();
    }

    try {
        // ---- static UI ----
        if (p === '/' || p === '/index.html') return sendHtml(res, path.join(__dirname, 'index.html'));
        if (p.startsWith('/img/')) return serveImage(req, res, p);

        // ================= READ APIs (no auth) =================
        if (p === '/api/auth-check') return sendJson(res, { ok: true, tokenRequired: true });

        if (p === '/api/status') {
            const git = await new Promise(resolve => {
                const g = spawn('git', ['status', '--short'], { cwd: PROJECT_ROOT, shell: false });
                let out = ''; g.stdout.on('data', d => out += d); g.on('close', () => resolve(out.trim()));
                g.on('error', () => resolve('(git 不可用)'));
            });
            return sendJson(res, {
                posts: listPosts().length,
                shuoshuo: readCollectionLen('shuoshuo'),
                moments: readCollectionLen('moments'),
                notebooks: readCollectionLen('notebooks'),
                momentImages: safeCount(MOMENT_IMG_DIR),
                postcovers: safeCount(POSTCOVER_DIR),
                gitChanges: git.split('\n').filter(Boolean),
                theme: getThemeInfo(),
            });
        }

        if (p === '/api/posts') return sendJson(res, listPosts());

        if (/^\/api\/posts\/file\/.+/.test(p) && req.method === 'GET') {
            const rel = decodeURIComponent(p.replace('/api/posts/file/', ''));
            const abs = safeJoin(SRC('_posts'), rel); // 始终限制在 _posts/ 内
            if (!abs) return sendJson(res, { error: '路径不允许' }, 400);
            if (!fs.existsSync(abs)) return sendJson(res, { error: '文件不存在' }, 404);
            const raw = fs.readFileSync(abs, 'utf8');
            const { fm, body } = parseFrontmatter(raw);
            return sendJson(res, { file: rel, fm, body, raw });
        }

        if (p === '/api/activity') return sendJson(res, getActivity(parseInt(url.searchParams.get('limit')) || 100));

        if (/^\/api\/collection\/(\w+)$/.test(p) && req.method === 'GET') {
            const name = p.match(/^\/api\/collection\/(\w+)$/)[1];
            const col = COLLECTIONS[name];
            if (!col) return sendJson(res, { error: '未知集合' }, 404);
            const fp = col.file();
            if (!fs.existsSync(fp)) return sendJson(res, []);
            return sendJson(res, readDataFile(fp));
        }

        if (/^\/api\/datafile\/(.+)$/.test(p) && req.method === 'GET') {
            const rel = decodeURIComponent(p.replace('/api/datafile/', ''));
            const abs = resolveEditableText(rel);
            if (!abs || !fs.existsSync(abs)) return sendJson(res, { error: '文件不存在' }, 404);
            return sendJson(res, { data: readDataFile(abs), format: path.extname(abs) === '.json' ? 'json' : 'yml' });
        }

        if (/^\/api\/page\/(.+)$/.test(p) && req.method === 'GET') {
            const rel = decodeURIComponent(p.replace('/api/page/', ''));
            const abs = resolveEditableText(rel);
            if (!abs || !fs.existsSync(abs)) return sendJson(res, { error: '页面不存在' }, 404);
            const raw = fs.readFileSync(abs, 'utf8');
            const { fm, body } = parseFrontmatter(raw);
            return sendJson(res, { file: rel, fm, body, isHtml: body.trim().startsWith('<') });
        }

        if (p === '/api/job/list') {
            return sendJson(res, Object.entries(jobs).map(([id, j]) => ({
                id, type: j.type, done: j.done, exitCode: j.exitCode, durationMs: j.durationMs,
                log: j.log.join(''), startedAt: j.startedAt,
            })));
        }

        // --- 论文库：source/docs/ 下的独立 HTML 博客（skip_render 原样发布） ---
        if (p === '/api/docs') {
            const out = [];
            try {
                for (const e of fs.readdirSync(SRC('docs'), { withFileTypes: true })) {
                    if (!e.isDirectory()) continue;
                    let title = e.name, size = 0;
                    try {
                        const idx = path.join(SRC('docs'), e.name, 'index.html');
                        const html = fs.readFileSync(idx, 'utf8');
                        const m = html.match(/<title>([^<]*)<\/title>/i);
                        if (m) title = m[1].trim().slice(0, 80);
                        size = fs.statSync(idx).size;
                    } catch {}
                    out.push({ dir: e.name, title, url: `/docs/${encodeURIComponent(e.name)}/`, sizeKB: Math.round(size / 1024) });
                }
            } catch {}
            return sendJson(res, out);
        }

        // ================= WRITE APIs (auth) =================

        // --- create/update post ---
        if (p === '/api/posts/save' && req.method === 'POST') {
            if (!checkAuth(req, res)) return;
            const { originalFile, file, fm, body } = JSON.parse((await readBody(req)).toString('utf8'));
            const targetRel = String(file || '').trim();
            if (!/^[\w\u4e00-\u9fa5][\w\u4e00-\u9fa5\-\/ ]*\.md$/.test(targetRel)) return sendJson(res, { error: '文件名只允许中文/字母/数字/-_ 和 .md 结尾' }, 400);
            const abs = safeJoin(SRC('_posts'), targetRel);
            if (!abs) return sendJson(res, { error: '非法路径' }, 400);
            // 重命名时若目标文件已存在且不是原文 → 拒绝，防止覆盖丢失
            if (originalFile && originalFile !== targetRel && fs.existsSync(abs)) {
                return sendJson(res, { error: `目标文件 ${targetRel} 已存在，请换一个文件名` }, 409);
            }
            fs.mkdirSync(path.dirname(abs), { recursive: true });
            const content = buildFrontmatter(fm || {}, body || '');
            fs.writeFileSync(abs, content, 'utf8');
            if (originalFile && originalFile !== targetRel) {
                const oldAbs = safeJoin(SRC('_posts'), originalFile);
                if (oldAbs && oldAbs !== abs && fs.existsSync(oldAbs)) fs.unlinkSync(oldAbs);
            }
            logActivity('post:save', `${originalFile || '(new)'} → ${targetRel}「${fm?.title || ''}」`);
            return sendJson(res, { success: true, file: targetRel });
        }

        if (p === '/api/posts/delete' && req.method === 'POST') {
            if (!checkAuth(req, res)) return;
            const { file } = JSON.parse((await readBody(req)).toString('utf8'));
            const abs = safeJoin(SRC('_posts'), file);
            if (!abs || !fs.existsSync(abs)) return sendJson(res, { error: '文件不存在' }, 404);
            const trashDir = path.join(__dirname, 'trash');
            fs.mkdirSync(trashDir, { recursive: true });
            const ts = Date.now();
            fs.renameSync(abs, path.join(trashDir, `${ts}_${path.basename(file)}`)); // move to local trash, never hard-delete
            logActivity('post:delete', file);
            return sendJson(res, { success: true, note: '已移入本地回收站（tools/trash/），未真正删除' });
        }

        // --- collections (shuoshuo/moments/notebooks/albums) ---
        if (/^\/api\/collection\/(\w+)$/.test(p) && req.method === 'POST') {
            if (!checkAuth(req, res)) return;
            const name = p.match(/^\/api\/collection\/(\w+)$/)[1];
            const col = COLLECTIONS[name];
            if (!col) return sendJson(res, { error: '未知集合' }, 404);
            const items = JSON.parse((await readBody(req)).toString('utf8'));
            if (!Array.isArray(items)) return sendJson(res, { error: '数据必须是数组' }, 400);
            let filled = 0;
            if (name === 'notebooks') filled = ensureNotebookUrls(items); // 回填文章真实 URL
            writeDataFile(col.file(), items);
            logActivity(`${name}:save`, `${items.length} 条${filled ? `，回填 URL ${filled} 个` : ''}`);
            return sendJson(res, { success: true, count: items.length, urlsFilled: filled });
        }

        // --- 标签汇总（GET，免鉴权）---
        if (p === '/api/tags' && req.method === 'GET') {
            const tags = new Map(), cats = new Map();
            for (const post of listPosts()) {
                for (const t of post.tags) tags.set(t, (tags.get(t) || 0) + 1);
                for (const c of post.categories) cats.set(c, (cats.get(c) || 0) + 1);
            }
            const toArr = m => [...m.entries()].map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
            return sendJson(res, { tags: toArr(tags), categories: toArr(cats) });
        }

        // --- datafile save（_data/ 与 data/ 的 JSON/YAML）：支持 {raw} 原文保存（保留注释/格式）或 {data} 结构化保存 ---
        if (/^\/api\/datafile\/(.+)$/.test(p) && req.method === 'POST') {
            if (!checkAuth(req, res)) return;
            const rel = decodeURIComponent(p.replace('/api/datafile/', ''));
            const abs = resolveEditableText(rel);
            const inDataArea = abs && (abs.startsWith(SRC('_data')) || abs.startsWith(DATA_DIR));
            if (!inDataArea) return sendJson(res, { error: '路径不允许（仅限 source/_data/ 与 source/data/）' }, 400);
            const payload = JSON.parse((await readBody(req)).toString('utf8'));
            if (typeof payload.raw === 'string') {
                fs.writeFileSync(abs, payload.raw, 'utf8'); // 原文直写，不经过 yaml.dump
            } else if (payload.data !== undefined) {
                writeDataFile(abs, payload.data);
            } else {
                return sendJson(res, { error: '缺少 raw 或 data 字段' }, 400);
            }
            logActivity('datafile:save', rel);
            return sendJson(res, { success: true });
        }

        // --- page save (about etc.) ---
        if (/^\/api\/page\/(.+)$/.test(p) && req.method === 'POST') {
            if (!checkAuth(req, res)) return;
            const rel = decodeURIComponent(p.replace('/api/page/', ''));
            const abs = resolveEditableText(rel);
            if (!abs) return sendJson(res, { error: '路径不允许' }, 400);
            const { fm, body } = JSON.parse((await readBody(req)).toString('utf8'));
            fs.writeFileSync(abs, buildFrontmatter(fm || {}, body || ''), 'utf8');
            logActivity('page:save', rel);
            return sendJson(res, { success: true });
        }

        // --- image upload (base64 in JSON to avoid multipart parsing) ---
        if (p === '/api/upload/image' && req.method === 'POST') {
            if (!checkAuth(req, res)) return;
            const { target, filename, base64 } = JSON.parse((await readBody(req, 30 * 1024 * 1024)).toString('utf8'));
            const dirInfo = IMG_DIRS.find(d => d.url === target);
            if (!dirInfo) return sendJson(res, { error: '目标目录不允许' }, 400);
            const safeName = String(filename || '').replace(/[^\w.\-\u4e00-\u9fa5]/g, '_');
            if (!/\.(png|jpe?g|gif|webp|bmp)$/i.test(safeName)) return sendJson(res, { error: '仅支持图片格式' }, 400);
            const buf = Buffer.from(base64, 'base64');
            if (buf.length > 25 * 1024 * 1024) return sendJson(res, { error: '图片超过 25MB' }, 400);
            fs.mkdirSync(dirInfo.dir, { recursive: true });
            let finalName = safeName, i = 1;
            while (fs.existsSync(path.join(dirInfo.dir, finalName))) {
                finalName = safeName.replace(/(\.[^.]+)$/, `_${i}$1`); i++;
            }
            fs.writeFileSync(path.join(dirInfo.dir, finalName), buf);
            logActivity('upload:image', `${target}${finalName} (${Math.round(buf.length / 1024)}KB)`);
            return sendJson(res, { success: true, url: dirInfo.url + finalName });
        }

        // --- jobs ---
        if (p === '/api/job/start' && req.method === 'POST') {
            if (!checkAuth(req, res)) return;
            const { type } = JSON.parse((await readBody(req)).toString('utf8'));
            const map = {
                build: [['generate'], 3 * 60 * 1000],
                deploy: [['deploy'], 6 * 60 * 1000],
                clean: [['clean'], 60 * 1000],
                preview: [['server'], 24 * 60 * 60 * 1000],
            };
            if (type === 'stop-preview') { const id = stopPreview(); logActivity('job:stop-preview', id || 'none running'); return sendJson(res, { success: !!id }); }
            const conf = map[type];
            if (!conf) return sendJson(res, { error: '未知任务类型' }, 400);
            if (type === 'deploy' && !confirmDeployGuard(req)) return sendJson(res, { error: '部署需要 X-Confirm: deploy 头' }, 428);
            const id = startJob(type, conf[0], conf[1]);
            if (!id) return sendJson(res, { error: `已有 ${type} 任务在运行` }, 409);
            return sendJson(res, { success: true, id });
        }

        return sendJson(res, { error: 'Not found' }, 404);

    } catch (e) {
        console.error(`[ERROR] ${req.method} ${p}: ${e.message}`);
        return sendJson(res, { error: e.message }, 500);
    }
});

function confirmDeployGuard(req) { return req.headers['x-confirm'] === 'deploy'; }
function readCollectionLen(name) { try { const a = readDataFile(COLLECTIONS[name].file()); return Array.isArray(a) ? a.length : 0; } catch { return 0; } }
function safeCount(dir) { try { return fs.readdirSync(dir).filter(f => !f.startsWith('.')).length; } catch { return 0; } }
function getThemeInfo() {
    try { const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'themes', 'butterfly', 'package.json'), 'utf8')); return `Butterfly v${pkg.version}`; } catch { return 'unknown'; }
}

// graceful shutdown
let closing = false;
function shutdown(sig) {
    if (closing) return; closing = true;
    console.log(`\n[${sig}] 正在关闭…`);
    for (const j of Object.values(jobs)) if (!j.done && j.proc) { try { j.proc.kill('SIGTERM'); } catch {} }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 4000);
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

if (!(PORT >= 1 && PORT <= 65535)) { console.error('端口无效'); process.exit(1); }

logActivity('server:start', `port=${PORT} project=${PROJECT_ROOT}`);
server.listen(PORT, () => {
    console.log(`
  🌸 Yetbye 内容管理系统 v2
  ────────────────────────────
  地址:      http://localhost:${PORT}
  项目:      ${PROJECT_ROOT}
  访问令牌:  ${AUTH_TOKEN}
  行动日志:  ${ACTIVITY_LOG}
  ────────────────────────────
  Ctrl+C 停止
`);
});
