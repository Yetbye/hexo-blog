<script>
(function () {
'use strict';

let PLACES = [];
fetch('/data/places.json').then(r => r.json()).then(d => {
  PLACES = (d || []).filter(p => p.visited !== false);
  renderRegion(CURRENT);
  updateCounters();
}).catch(e => console.error(e));

function getPoems(p) {
  if (p.poems && Array.isArray(p.poems)) return p.poems;
  if (p.poem) return [{ date:p.date||'', poemTitle:p.poemTitle||'行迹', poem:p.poem, note:p.note||'' }];
  return [];
}

function updateCounters() {
  document.getElementById('gm-count').textContent = PLACES.length;
  document.getElementById('gm-poem-count').textContent = PLACES.reduce((s, p) => s + getPoems(p).length, 0);
}

let CURRENT = 'main';
const REGION_META = {
  main:    { name:'华夏' }, west:    { name:'西域' },
  central: { name:'中原' }, east:    { name:'江南' }, south:   { name:'岭南' }
};

document.querySelectorAll('.gm-tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.gm-tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    renderRegion(t.dataset.region);
    document.getElementById('gm-region-chip').textContent = '🗺 ' + REGION_META[t.dataset.region].name;
  });
});

const REGION_THEME = {
  main:    { land:'#E8D9A6', stroke:'#3D2914', accent:'#7A2F3F' },
  west:    { land:'#D4A87A', stroke:'#7A4E2A', accent:'#8B4513' },
  central: { land:'#C9A06A', stroke:'#5D3A1A', accent:'#7A2F3F' },
  east:    { land:'#D5C896', stroke:'#5A7B4E', accent:'#7A2F3F' },
  south:   { land:'#B89A6F', stroke:'#7A4E2A', accent:'#C44D3F' }
};

const REGION_DECOR = {
  main: [
    { type:'sail',  x:780, y:820, label:'东海商帆' },
    { type:'yak',   x:220, y:430, label:'牦牛' },
    { type:'camel', x:150, y:230, label:'骆驼' },
    { type:'kite',  x:380, y:380, label:'敦煌飞天' },
    { type:'tea',   x:600, y:520, label:'茶道' },
    { type:'moon',  x:900, y:200, label:'月圆' }
  ],
  west: [
    { type:'camel', x:300, y:340, label:'丝绸之驿' },
    { type:'sun',   x:700, y:160, label:'长河落日' },
    { type:'rock',  x:600, y:480, label:'火焰山' },
    { type:'moon',  x:780, y:280, label:'玉门月' }
  ],
  central: [
    { type:'bell',  x:420, y:340, label:'大雁塔' },
    { type:'seal',  x:680, y:320, label:'碑林' },
    { type:'kite',  x:520, y:480, label:'飞天' },
    { type:'moon',  x:300, y:180, label:'月牙泉' },
    { type:'tea',   x:580, y:600, label:'问道' }
  ],
  east: [
    { type:'willow', x:280, y:380, label:'西湖柳' },
    { type:'bridge', x:560, y:480, label:'断桥' },
    { type:'tea',    x:400, y:200, label:'龙井茶' },
    { type:'kite',   x:680, y:300, label:'纸鸢' },
    { type:'moon',   x:180, y:600, label:'钱塘月' }
  ],
  south: [
    { type:'sail',  x:650, y:580, label:'珠江帆影' },
    { type:'flower',x:380, y:480, label:'岭南花' },
    { type:'tea',   x:300, y:200, label:'功夫茶' },
    { type:'moon',  x:750, y:400, label:'明月' }
  ]
};

function drawDecorItem(decor, theme) {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('filter', 'url(#ink-pen)');
  g.setAttribute('opacity', '0.7');
  function line(x1, y1, x2, y2) {
    const l = document.createElementNS(SVG_NS, 'line');
    l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2);
    l.setAttribute('stroke', theme.stroke); l.setAttribute('stroke-width', '0.9');
    return l;
  }
  function circle(cx, cy, r, fill) {
    const c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
    c.setAttribute('fill', fill || 'none'); c.setAttribute('stroke', theme.stroke); c.setAttribute('stroke-width', '0.8');
    return c;
  }
  function path(d, fill) {
    const p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', fill || 'none'); p.setAttribute('stroke', theme.stroke); p.setAttribute('stroke-width', '0.8');
    return p;
  }
  function text(content, x, y, sz) {
    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('x', x); t.setAttribute('y', y);
    t.setAttribute('font-family', "'Ma Shan Zheng',cursive");
    t.setAttribute('font-size', sz || 14);
    t.setAttribute('fill', theme.stroke);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('style', 'paint-order:stroke;stroke:#F2E7C8;stroke-width:2.5;pointer-events:none');
    t.textContent = content;
    return t;
  }
  switch (decor.type) {
    case 'sail':
      g.appendChild(path('M 0 0 L 26 0 L 12 -34 Z', theme.gold));
      g.appendChild(line(13, -34, 13, 2));
      g.appendChild(path('M 13 -30 Q 28 -16 13 -2', theme.accent));
      g.appendChild(path('M -22 6 Q 0 18 40 6'));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 38)); break;
    case 'camel':
      g.appendChild(path('M -25 0 Q -28 -12 -12 -14 Q 6 -17 20 -12 Q 32 -10 28 0 Z'));
      g.appendChild(line(-25, -4, -25, -18));
      g.appendChild(line(-12, 14, -14, 26));
      g.appendChild(line(9, 14, 11, 26));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 44)); break;
    case 'yak':
      g.appendChild(circle(0, 0, 26));
      g.appendChild(path('M -20 -10 Q -34 -26 -22 -34'));
      g.appendChild(path('M 20 -10 Q 34 -26 22 -34'));
      g.appendChild(line(-13, 16, -16, 30));
      g.appendChild(line(13, 16, 16, 30));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 48)); break;
    case 'kite':
      g.appendChild(path('M 0 0 Q 7 -3 5 -18 Q 2 -32 0 -36 Q -2 -32 -5 -18 Q -7 -3 0 0'));
      g.appendChild(path('M -3 -4 Q 0 -9 3 -4'));
      g.appendChild(line(0, 0, 0, 9));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 22)); break;
    case 'tea':
      g.appendChild(path('M -12 -2 L -10 -12 L 10 -12 L 12 -2 Z'));
      g.appendChild(path('M -10 -12 L -8 -20 L 8 -20 L 10 -12'));
      g.appendChild(line(2, -2, 2, 10));
      g.appendChild(path('M -2 4 Q 0 7 2 4'));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 24)); break;
    case 'moon':
      g.appendChild(circle(0, 0, 16, theme.gold));
      g.appendChild(circle(5, -4, 14, '#F2E7C8'));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 30)); break;
    case 'rock':
      g.appendChild(path('M -18 0 L -10 -12 L 2 -8 L 14 -16 L 20 -2 L 16 0 Z'));
      g.appendChild(line(-4, -8, 8, -12));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 18)); break;
    case 'sun':
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        g.appendChild(line(Math.cos(a) * 22, Math.sin(a) * 22, 0, 0));
      }
      g.appendChild(circle(0, 0, 12, '#C44D3F'));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 32)); break;
    case 'bell':
      g.appendChild(path('M -10 -12 L 10 -12 L 8 10 L -8 10 Z'));
      g.appendChild(line(0, -12, 0, -20));
      g.appendChild(circle(0, -20, 3));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 26)); break;
    case 'seal':
      g.appendChild(path('M -10 -10 L 10 -10 L 10 10 L -10 10 Z', theme.sakura));
      g.appendChild(text('迹', 0, 5));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 26)); break;
    case 'willow':
      g.appendChild(line(0, 0, 0, -26));
      g.appendChild(circle(0, -28, 7));
      g.appendChild(path('M 0 -24 Q -5 -12 -3 4'));
      g.appendChild(path('M 0 -24 Q 5 -12 3 4'));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 20)); break;
    case 'bridge':
      g.appendChild(path('M -18 0 Q 0 -12 18 0'));
      g.appendChild(line(-18, 0, -18, 4));
      g.appendChild(line(18, 0, 18, 4));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 18)); break;
    case 'flower':
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        g.appendChild(circle(Math.cos(a) * 7, Math.sin(a) * 7, 6, theme.sakura));
      }
      g.appendChild(circle(0, 0, 4, theme.gold));
      g.setAttribute('transform', `translate(${decor.x}, ${decor.y})`);
      g.appendChild(text(decor.label, 0, 22)); break;
  }
  return g;
}

function renderBgFlowers(theme) {
  const layer = document.getElementById('gm-bg-flowers');
  layer.innerHTML = '';
  const seed = theme.meta.id === 'main' ? 1 : (theme.meta.id === 'west' ? 2 : (theme.meta.id === 'central' ? 3 : (theme.meta.id === 'east' ? 4 : 5)));
  const r = (n) => Math.abs((Math.sin(n * 9301 + seed * 49297) * 233280)) % 1;
  for (let i = 0; i < 14; i++) {
    const cx = r(i + 1) * 1053;
    const cy = r(i + 100) * 935;
    const r2 = 2 + r(i + 200) * 3;
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r2);
    c.setAttribute('fill', theme.accent);
    c.setAttribute('opacity', '0.28');
    layer.appendChild(c);
  }
}

function renderProvinces(theme) {
  const layer = document.getElementById('gm-province-layer');
  layer.innerHTML = '';
  if (!window.CHINA_REGIONS || !CHINA_REGIONS[theme.meta.id]) return;
  CHINA_REGIONS[theme.meta.id].features.forEach(prov => {
    prov.paths.forEach(d => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d);
      p.setAttribute('fill', theme.land);
      p.setAttribute('fill-opacity', '0.4');
      p.setAttribute('stroke', theme.stroke);
      p.setAttribute('stroke-width', '0.9');
      p.setAttribute('stroke-linejoin', 'round');
      layer.appendChild(p);
    });
  });
}

function renderDecor(theme) {
  const layer = document.getElementById('gm-decor-layer');
  layer.innerHTML = '';
  (REGION_DECOR[theme.meta.id] || []).forEach(d => layer.appendChild(drawDecorItem(d, theme)));
}

function projectP(p, r) {
  const phi = p.y * Math.PI / 180;
  const phiMin = r.latMin * Math.PI / 180, phiMax = r.latMax * Math.PI / 180;
  const yMerc = Math.log(Math.tan(Math.PI/4 + phi/2));
  const yMin = Math.log(Math.tan(Math.PI/4 + phiMin/2));
  const yMax = Math.log(Math.tan(Math.PI/4 + phiMax/2));
  return [
    (p.x - r.lonMin) / (r.lonMax - r.lonMin) * r.w,
    (yMax - yMerc) / (yMax - yMin) * r.h
  ];
}

function renderTrajectory(theme) {
  const layer = document.getElementById('trajectory');
  layer.innerHTML = '';
  if (!window.CHINA_REGIONS || !CHINA_REGIONS[theme.meta.id]) return;
  const r = theme.meta;
  const visible = PLACES.filter(p => p.x >= r.lonMin - 1 && p.x <= r.lonMax + 1 && p.y >= r.latMin - 1 && p.y <= r.latMax + 1);
  if (visible.length < 2) return;
  visible.sort((a, b) => (a.poems ? a.poems[0].date : a.date || '').localeCompare(b.poems ? b.poems[0].date : b.date || ''));
  for (let i = 0; i < visible.length - 1; i++) {
    const a = projectP(visible[i], r);
    const b = projectP(visible[i + 1], r);
    const mx = (a[0] + b[0]) / 2 + (i % 2 === 0 ? -28 : 28);
    const my = (a[1] + b[1]) / 2 + 22;
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', `M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`);
    p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#7A2F3F');
    p.setAttribute('stroke-width', '1.8'); p.setAttribute('stroke-dasharray', '5,3');
    p.setAttribute('opacity', '0.75'); p.setAttribute('marker-end', 'url(#arrow)');
    layer.appendChild(p);
  }
}

function renderCityMarkers(theme) {
  const layer = document.getElementById('city-markers');
  layer.innerHTML = '';
  if (!window.CHINA_REGIONS || !CHINA_REGIONS[theme.meta.id]) return;
  const r = theme.meta;
  PLACES.forEach(p => {
    if (p.x < r.lonMin - 1 || p.x > r.lonMax + 1 || p.y < r.latMin - 1 || p.y > r.latMax + 1) return;
    const [x, y] = projectP(p, r);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'city-marker');
    g.setAttribute('transform', `translate(${x}, ${y})`);
    g.setAttribute('data-city', p.name);
    const c1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c1.setAttribute('r', '13');
    c1.setAttribute('fill', '#7A2F3F');
    c1.setAttribute('stroke', '#3D2914');
    c1.setAttribute('stroke-width', '1.5');
    c1.setAttribute('filter', 'url(#stamp)');
    g.appendChild(c1);
    const c2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c2.setAttribute('r', '4'); c2.setAttribute('fill', '#F2E7C8');
    g.appendChild(c2);
    const t1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t1.setAttribute('x', 18); t1.setAttribute('y', -2);
    t1.setAttribute('font-family', "'Ma Shan Zheng',cursive");
    t1.setAttribute('font-size', '22');
    t1.setAttribute('fill', '#3D2914');
    t1.setAttribute('font-weight', '700');
    t1.setAttribute('style', 'paint-order:stroke;stroke:#F2E7C8;stroke-width:4;pointer-events:none');
    t1.textContent = p.name;
    g.appendChild(t1);
    g.addEventListener('click', (e) => { e.stopPropagation(); openNote(p); });
    layer.appendChild(g);
  });
}

let CURRENT_POEM_IDX = 0;
let CURRENT_CITY = null;
let NOTE_OPENING = false;

function openNote(city) {
  if (!city || NOTE_OPENING) return;
  NOTE_OPENING = true;
  if (CURRENT_CITY && CURRENT_CITY.name === city.name && document.getElementById('gm-note').style.display === 'block') {
    NOTE_OPENING = false;
    return;
  }
  CURRENT_CITY = city;
  CURRENT_POEM_IDX = 0;
  renderNote();
  document.getElementById('gm-note').style.display = 'block';
  setTimeout(() => { NOTE_OPENING = false; }, 200);
}

function renderNote() {
  if (!CURRENT_CITY) return;
  const poems = getPoems(CURRENT_CITY).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const i = Math.max(0, Math.min(CURRENT_POEM_IDX, poems.length - 1));
  const p = poems[i];
  document.getElementById('gm-note-city').textContent = CURRENT_CITY.name;
  document.getElementById('gm-note-count').textContent = poems.length > 1 ? (i + 1) + ' / ' + poems.length : String(poems.length);
  const content = document.getElementById('gm-note-content');
  content.innerHTML = '<div class="gm-poem-card">' +
    '<div class="gm-poem-date">' + esc(p.date || '') + '</div>' +
    '<h3 class="gm-poem-title">《' + esc(p.poemTitle || '行迹') + '》</h3>' +
    '<p class="gm-poem-text">' + esc(p.poem || '') + '</p>' +
    '<p class="gm-poem-note">' + esc(p.note || '') + '</p>' +
    '</div>' +
    (poems.length > 1 ? '<div class="gm-poem-nav">' +
      '<button class="gm-poem-btn" onclick="window.__gmCyclePoem(-1)" ' + (i === 0 ? 'disabled' : '') + '>◀ 上一篇</button>' +
      '<span class="gm-poem-counter">' + (i + 1) + ' / ' + poems.length + '</span>' +
      '<button class="gm-poem-btn" onclick="window.__gmCyclePoem(1)" ' + (i === poems.length - 1 ? 'disabled' : '') + '>下一篇 ▶</button>' +
      '</div>' : '');
  content.onclick = e => e.stopPropagation();
}

window.__gmCyclePoem = function (d) {
  if (!CURRENT_CITY) return;
  const poems = getPoems(CURRENT_CITY);
  CURRENT_POEM_IDX = Math.max(0, Math.min(CURRENT_POEM_IDX + d, poems.length - 1));
  renderNote();
};

function closeNote() {
  document.getElementById('gm-note').style.display = 'none';
  CURRENT_CITY = null;
  CURRENT_POEM_IDX = 0;
}

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderRegion(regionId) {
  if (!window.CHINA_REGIONS) return;
  CURRENT = regionId;
  const r = CHINA_REGIONS[regionId].meta;
  const theme = Object.assign({ meta: r }, REGION_THEME[regionId]);
  closeNote();
  const svg = document.getElementById('gm-map');
  svg.setAttribute('viewBox', `0 0 ${r.w} ${r.h}`);
  document.getElementById('gm-paper').setAttribute('width', r.w);
  document.getElementById('gm-paper').setAttribute('height', r.h);
  document.getElementById('gm-paper-texture').setAttribute('width', r.w);
  document.getElementById('gm-paper-texture').setAttribute('height', r.h);
  renderBgFlowers(theme);
  renderProvinces(theme);
  renderDecor(theme);
  renderTrajectory(theme);
  renderCityMarkers(theme);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('gm-note-close').addEventListener('click', closeNote);
  document.getElementById('gm-map').addEventListener('click', e => {
    if (!e.target.closest('.city-marker') && !e.target.closest('.gm-note-panel')) {
      closeNote();
    }
  });
  setTimeout(() => renderRegion('main'), 100);
});
})();
</script>
