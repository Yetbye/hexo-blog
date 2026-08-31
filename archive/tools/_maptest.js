// 按块定位运行时异常：把每个内联 <script> 包上 try/catch 后注入 jsdom
const { JSDOM, VirtualConsole } = require('jsdom');

(async () => {
  let html = await (await fetch('http://localhost:4000/map/')).text();
  const places = await (await fetch('http://localhost:4000/data/places.json')).json();

  let bi = 0;
  html = html.replace(/<script>([\s\S]*?)<\/script>/g, (m, body) => {
    bi++;
    return `<script>try{${body}\n}catch(__e){console.error("BLOCK#" + ${bi} + " THREW:", __e.message)}</script>`;
  });
  html = html.replace(/<script src=[^>]*><\/script>/g, '');

  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push((e.message || '').slice(0, 120)));
  vc.on('error', (...a) => errors.push('console.error > ' + a.join(' ').slice(0, 160)));

  const dom = new JSDOM(html, {
    url: 'http://localhost:4000/map/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(window) {
      window.fetch = (u) => Promise.resolve({ ok: true, json: () => Promise.resolve(u.includes('places') ? places : []) });
      window.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 16);
      window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener(){}, removeListener(){} }));
    },
  });

  await new Promise(r => setTimeout(r, 2500));
  const svg = dom.window.document.getElementById('mp-svg');
  console.log(JSON.stringify({
    circleCount: svg ? svg.querySelectorAll('circle').length : -1,
    spotGroups: svg ? svg.querySelectorAll('.mp-spot').length : -1,
    labels: svg ? Array.from(svg.querySelectorAll('text')).map(t => t.textContent).slice(0, 4) : [],
    errors,
  }, null, 2));
  process.exit(0);
})().catch(e => { console.error('HARNESS FAIL:', e.message); process.exit(1); });
