// 修复 index.html 中被换行截断的 viewPoem（合并重复两行）+ 确保导航按钮存在
const fs = require('fs');
const f = 'one-step-output/tools/index.html';
let s = fs.readFileSync(f, 'utf8');

const broken = /function viewPoem\(i\)\{ const p=window\.__places\[i\]; alert\(\(p\.poemTitle\?\("《"\+p\.poemTitle\+"》[\s\S]*?\)\:"\)\+\(p\.poem\|\|""\)\); \}/;
if (broken.test(s)) {
  s = s.replace(broken,
    'function viewPoem(i){ const p=window.__places[i]; alert((p.poemTitle?("《"+p.poemTitle+"》\\n"):"")+(p.poem||"")); }');
  console.log('viewPoem 已修复');
} else {
  console.log('viewPoem 模式未命中，检查其他形态');
}

// 导航按钮兜底
if (!s.includes('data-view="mapedit"')) {
  s = s.replace('<button class="nav-item" data-view="docs">',
    '<button class="nav-item" data-view="mapedit"><span class="ico">🗺️</span>行迹点位</button>\n  <button class="nav-item" data-view="docs">');
  console.log('导航按钮已补');
}
fs.writeFileSync(f, s);

// 终检
const m = s.match(/<script>([\s\S]*?)<\/script>/);
try { new Function(m[1]); console.log('CMS JS OK ✓'); }
catch (e) { console.log('CMS JS 仍有错:', e.message); process.exit(1); }
