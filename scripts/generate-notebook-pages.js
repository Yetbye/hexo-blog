/**
 * 笔记本独立页面生成器
 * 读取 source/notes/notebooks.json，为每个笔记本生成 /notes/:slug/ 独立页面。
 * 页面外壳由本脚本生成（layout: page，走 Butterfly 主题布局），
 * 内容由前端 JS 从 notebooks.json 拉取渲染 —— 数据更新无需重新构建即可生效；
 * 仅「新建笔记本」需要一次重新生成（hexo generate 或重启 server）让新路由存在。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const NB_FILE = () => path.join(hexo.source_dir, 'notes', 'notebooks.json');

function readNotebooks() {
  try {
    return JSON.parse(fs.readFileSync(NB_FILE(), 'utf8'));
  } catch (e) {
    console.error('[notebook-pages] 读取 notebooks.json 失败:', e.message);
    return [];
  }
}

// 页面模板：与 notes 首页同一套 Venus 樱吹雪视觉语言
function notebookShell() {
  const css = `
.vnb-wrap{--paper:#FFFBF8;--paper2:#FFF5F0;--line:#F0E0D8;--ink:#3A2828;--ink2:#6A5050;--ink3:#A08888;--plum:#8B4570;--sakura:#E86B8A;position:relative;max-width:900px;margin:0 auto;padding:1rem .5rem 3rem;font-family:'Noto Sans SC',-apple-system,sans-serif;color:var(--ink)}
/* 青海波底纹：让页面不再素白 */
.vnb-wrap::before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.05;z-index:0;background-image:radial-gradient(circle at 50% 100%,transparent 18px,var(--plum) 19px,transparent 20px),radial-gradient(circle at 50% 100%,transparent 38px,var(--plum) 39px,transparent 40px);background-size:40px 20px}
.vnb-corner{position:absolute;width:52px;height:52px;pointer-events:none;z-index:1}
.vnb-corner::before{content:'';position:absolute;inset:0;border:2px solid var(--plum);opacity:.32}
.vnb-corner::after{content:'';position:absolute;inset:6px;border:1px solid var(--sakura);opacity:.42}
.vnb-corner-tl{top:8px;left:8px}.vnb-corner-tl::before,.vnb-corner-tl::after{border-right:0;border-bottom:0}
.vnb-corner-br{bottom:8px;right:8px}.vnb-corner-br::before,.vnb-corner-br::after{border-left:0;border-top:0}
.vnb-hero{text-align:center;padding:2.4rem 1rem 1.6rem;position:relative;z-index:1}
.vnb-medal{
  width:64px;height:64px;margin:0 auto .9rem;border-radius:16px;display:grid;place-items:center;
  font-size:1.55rem;color:#fff;background:linear-gradient(135deg,var(--plum),var(--sakura));
  box-shadow:0 8px 24px rgba(139,69,112,.3);transform:rotate(-3deg);position:relative;
}
.vnb-medal::after{content:'';position:absolute;inset:4px;border:1.5px solid rgba(255,255,255,.5);border-radius:12px}
.vnb-eyebrow{font-family:'JetBrains Mono',monospace;font-size:.7rem;letter-spacing:.42em;color:var(--sakura);display:inline-block;margin-bottom:.7rem}
.vnb-title{font-family:'Noto Serif SC',Georgia,serif;font-weight:900;font-size:clamp(1.9rem,4.5vw,2.9rem);letter-spacing:.14em;margin:0 0 .6rem}
.vnb-sub{color:var(--ink3);font-size:.92rem;margin:.4rem 0 0}
.vnb-count-chip{
  display:inline-flex;align-items:center;gap:.45rem;margin-top:.9rem;padding:.3rem 1.05rem;
  border-radius:999px;background:var(--paper2);border:1px solid var(--line);font-size:.82rem;color:var(--ink2);
}
.vnb-count{font-family:'Noto Serif SC',serif;font-weight:900;color:var(--sakura);font-size:1.05rem}
.vnb-back{display:inline-flex;align-items:center;gap:.4rem;margin-top:1rem;font-size:.85rem;color:var(--plum);text-decoration:none;border-bottom:1px dashed var(--plum);padding-bottom:2px;transition:opacity .25s}
.vnb-back:hover{opacity:.65}
.vnb-list{position:relative;z-index:1;display:flex;flex-direction:column;gap:.9rem;margin-top:1.5rem}
.vnb-item{display:flex;align-items:center;gap:1rem;background:#fff;border:1px solid var(--line);border-radius:14px;padding:1.05rem 1.3rem;text-decoration:none;color:var(--ink);box-shadow:0 2px 10px rgba(139,69,112,.06);transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s,border-color .3s}
.vnb-item:hover{transform:translateY(-4px);box-shadow:0 10px 26px rgba(139,69,112,.15);border-color:var(--sakura)}
.vnb-ico{width:40px;height:40px;border-radius:11px;flex-shrink:0;display:grid;place-items:center;background:linear-gradient(135deg,var(--plum),var(--sakura));color:#fff;font-size:1rem;box-shadow:0 3px 10px rgba(139,69,112,.25)}
.vnb-item-title{font-family:'Noto Serif SC',serif;font-weight:700;font-size:1.02rem;letter-spacing:.03em}
.vnb-item-date{margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--ink3);white-space:nowrap}
.vnb-state{text-align:center;padding:2.6rem 0;color:var(--ink3)}
.vnb-spin{display:inline-block;width:14px;height:14px;margin-right:.5rem;vertical-align:-2px;border:2px solid var(--line);border-top-color:var(--sakura);border-radius:50%;animation:vnb-r .7s linear infinite}
@keyframes vnb-r{to{transform:rotate(360deg)}}
.vnb-empty{font-family:'Ma Shan Zheng',cursive;color:var(--ink3);font-size:1.15rem;text-align:center;padding:1.4rem 0}
.vnb-foot{text-align:center;margin-top:2.6rem;position:relative;z-index:1}
.vnb-foot span{color:var(--sakura);font-size:1.05rem}
.vnb-foot p{font-family:'Ma Shan Zheng',cursive;color:var(--plum);font-size:1.02rem;margin:.3rem 0 0}
@media(max-width:640px){.vnb-hero{padding:1.8rem .5rem 1.2rem}.vnb-item-date{display:none}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;
  const js = `
(function(){
  'use strict';
  // 从 URL 提取笔记本 slug：/notes/<slug>/
  var m = location.pathname.match(/\\/notes\\/([^\\/]+)\\/?$/);
  var slug = m ? decodeURIComponent(m[1]) : '';
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
  fetch('../notebooks.json').then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})
    .then(function(list){
      var nb = (list||[]).find(function(x){return x.slug===slug});
      if(!nb){document.getElementById('vnb-body').innerHTML='<div class="vnb-state">未找到该笔记本</div>';return}
      document.getElementById('vnb-name').textContent = nb.name;
      document.title = nb.name + ' | 笔记';
      var medal=document.getElementById('vnb-medal');
      if(medal) medal.innerHTML='<i class="'+esc(nb.icon||'fas fa-book')+'"></i>';
      if(nb.subtitle) document.getElementById('vnb-sub').textContent = nb.subtitle;
      var arts = nb.articles||[];
      document.getElementById('vnb-count').textContent = arts.length;
      if(!arts.length){
        document.getElementById('vnb-body').innerHTML='<p class="vnb-empty">这一本还空着，等一个开头。</p>';
        return;
      }
      document.getElementById('vnb-body').innerHTML = arts.map(function(a){
        var href = a.url || ('/articles/' + encodeURIComponent(a.slug||'') + '/');
        return '<a class="vnb-item" href="'+esc(href)+'">' +
          '<span class="vnb-ico"><i class="'+esc(a.icon||'fas fa-file-alt')+'"></i></span>' +
          '<span class="vnb-item-title">'+esc(a.title)+'</span>' +
          (a.date?'<span class="vnb-item-date">'+esc(a.date)+'</span>':'') +
          '</a>';
      }).join('');
    })
    .catch(function(e){
      console.error(e);
      document.getElementById('vnb-body').innerHTML='<div class="vnb-state">⚠ 数据加载失败，请刷新重试</div>';
    });
})();
`;
  return `
<div class="vnb-wrap">
  <div class="vnb-corner vnb-corner-tl" aria-hidden="true"></div>
  <div class="vnb-corner vnb-corner-br" aria-hidden="true"></div>
  <header class="vnb-hero">
    <div class="vnb-medal" id="vnb-medal">📖</div>
    <span class="vnb-eyebrow">NOTEBOOK</span>
    <h1 class="vnb-title" id="vnb-name">…</h1>
    <span class="vnb-count-chip">收录 <span class="vnb-count" id="vnb-count">-</span> 篇</span>
    <p class="vnb-sub" id="vnb-sub"></p>
    <a class="vnb-back" href="/notes/">← 返回全部笔记本</a>
  </header>
  <section id="vnb-body"><div class="vnb-state"><span class="vnb-spin"></span>正在翻开笔记本…</div></section>
  <footer class="vnb-foot"><span>✿</span><p>笔记皆为基础概念的手抄与整理</p></footer>
</div>
<style>${css}</style>
<script>${js}</script>
`;
}

hexo.extend.generator.register('notebook-pages', function (locals) {
  const list = readNotebooks();
  return list
    .filter(nb => nb && nb.slug)
    .map(nb => ({
      path: `notes/${encodeURIComponent(nb.slug)}/index.html`.replace(/%2F/gi, '/'),
      layout: ['page', 'post'],
      data: {
        title: nb.name,
        // content 走 butterfly 的 page 布局输出；frontmatter 由 data 提供
        content: notebookShell(),
        top_img: '/image/media/notes.jpg',
        comments: false,
        aside: false,
        _data_notebook: nb.slug,
      },
    }));
});
