---
category: pink
---
<!-- ============ Pink · 水彩国风画墙（Venus × paper-reading-blog DNA） ============ -->
<div class="gw-wrap" style="--acc:#E86B8A;--acc2:#FFB7C5">
  <div class="gw-blob gw-blob-a" aria-hidden="true"></div>
  <div class="gw-blob gw-blob-b" aria-hidden="true"></div>

  <header class="gw-hero">
    <span class="gw-seal">桃</span>
    <div class="gw-head-text">
      <span class="gw-eyebrow">GALLERY · PINK</span>
      <h1 class="gw-title">Pink</h1>
      <p class="gw-hand">春日将尽未尽的粉</p>
    </div>
    <a class="gw-back" href="/gallery/">← 回调色盘</a>
  </header>

  <section class="gw-grid">
      <figure class="gw-card" data-idx="0">
        <img src="/image/gallery/pink/1.jpg" alt="Pink 1" loading="lazy">
        <figcaption>桃 · 其一</figcaption>
      </figure>

      <figure class="gw-card" data-idx="1">
        <img src="/image/gallery/pink/2.jpg" alt="Pink 2" loading="lazy">
        <figcaption>桃 · 其二</figcaption>
      </figure>

      <figure class="gw-card" data-idx="2">
        <img src="/image/gallery/pink/3.jpg" alt="Pink 3" loading="lazy">
        <figcaption>桃 · 其三</figcaption>
      </figure>
  </section>

  <footer class="gw-foot"><span>✿</span><p>光落进纸里，就成了画</p></footer>
</div>

<dialog class="gw-lightbox" id="gw-lb">
  <img id="gw-lb-img" alt="">
  <div class="gw-lb-bar">
    <button class="gw-lb-btn" id="gw-prev">‹</button>
    <button class="gw-lb-btn" id="gw-next">›</button>
    <button class="gw-lb-btn" id="gw-close">✕</button>
  </div>
</dialog>

<style>
.gw-wrap{
  --paper:#FBF9F3;--line:#E8DFD0;--ink:#2A2520;--ink3:#9A8E80;
  position:relative;max-width:1100px;margin:0 auto;padding:.6rem .5rem 3rem;
  font-family:'Noto Sans SC',-apple-system,sans-serif;color:var(--ink);
}
/* 水彩晕染：两团大色斑，湿画法质感 */
.gw-blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.22;pointer-events:none;z-index:0}
.gw-blob-a{width:380px;height:260px;left:-80px;top:40px;background:var(--acc)}
.gw-blob-b{width:320px;height:240px;right:-70px;top:220px;background:var(--acc2)}

.gw-hero{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:1.3rem;padding:2.6rem 1rem 2rem}
.gw-seal{
  width:64px;height:64px;flex-shrink:0;display:grid;place-items:center;
  background:var(--acc);color:#fff;font-family:'Noto Serif SC',serif;font-size:1.7rem;font-weight:900;
  border-radius:10px;box-shadow:0 6px 20px color-mix(in srgb,var(--acc) 45%,transparent);
  transform:rotate(-4deg);position:relative;
}
.gw-seal::after{content:'';position:absolute;inset:4px;border:1.5px solid rgba(255,255,255,.55);border-radius:6px}
.gw-head-text{text-align:left}
.gw-eyebrow{font-family:'JetBrains Mono',monospace;font-size:.66rem;letter-spacing:.38em;color:var(--acc)}
.gw-title{font-family:'Noto Serif SC',serif;font-weight:900;font-size:clamp(1.9rem,4vw,2.8rem);letter-spacing:.1em;margin:.15rem 0}
.gw-hand{font-family:'Ma Shan Zheng',cursive;font-size:1.12rem;color:var(--ink3);margin:.2rem 0 0}
.gw-back{
  position:absolute;right:0;top:2.2rem;font-size:.85rem;color:var(--acc);text-decoration:none;
  border-bottom:1px dashed var(--acc);padding-bottom:2px;transition:opacity .25s;
}
.gw-back:hover{opacity:.6}

.gw-grid{
  position:relative;z-index:1;
  column-count:3;column-gap:1.3rem;
}
@media(max-width:900px){.gw-grid{column-count:2}}
@media(max-width:560px){.gw-grid{column-count:1}}
.gw-card{
  break-inside:avoid;margin:0 0 1.3rem;position:relative;overflow:hidden;
  background:#fff;border:1px solid var(--line);border-radius:14px;
  box-shadow:0 3px 14px rgba(42,37,32,.08);cursor:zoom-in;
  transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s;
}
.gw-card:hover{transform:translateY(-5px);box-shadow:0 14px 34px rgba(42,37,32,.16)}
.gw-card img{width:100%;display:block;transition:transform .6s cubic-bezier(.16,1,.3,1)}
.gw-card:hover img{transform:scale(1.04)}
.gw-card figcaption{
  position:absolute;left:0;right:0;bottom:0;padding:.65rem 1rem;
  font-family:'Noto Serif SC',serif;font-size:.85rem;letter-spacing:.12em;color:#fff;
  background:linear-gradient(transparent,rgba(42,37,32,.72));
  opacity:0;transform:translateY(8px);transition:all .35s cubic-bezier(.16,1,.3,1);
}
.gw-card:hover figcaption{opacity:1;transform:none}
.gw-empty{text-align:center;color:var(--ink3);padding:3rem 0;font-family:'Ma Shan Zheng',cursive;font-size:1.1rem}

/* 灯箱 */
.gw-lightbox{
  border:none;border-radius:16px;padding:0;background:rgba(30,26,22,.92);
  max-width:92vw;max-height:92vh;
}
.gw-lightbox::backdrop{background:rgba(20,17,15,.82);backdrop-filter:blur(4px)}
.gw-lightbox img{display:block;max-width:90vw;max-height:84vh;margin:auto;border-radius:12px 12px 0 0}
.gw-lb-bar{display:flex;justify-content:center;gap:1rem;padding:.7rem}
.gw-lb-btn{
  width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.35);
  background:transparent;color:#fff;font-size:1.15rem;cursor:pointer;transition:background .2s;
}
.gw-lb-btn:hover{background:rgba(255,255,255,.18)}

.gw-foot{position:relative;z-index:1;text-align:center;margin-top:2.4rem}
.gw-foot span{color:var(--acc)}
.gw-foot p{font-family:'Ma Shan Zheng',cursive;color:var(--ink3);font-size:1.02rem;margin:.3rem 0 0}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>

<script>
(function(){
  'use strict';
  var SLIDES = ["/image/gallery/pink/1.jpg","/image/gallery/pink/2.jpg","/image/gallery/pink/3.jpg"];
  var lb=document.getElementById('gw-lb'), img=document.getElementById('gw-lb-img');
  if(!lb) return;
  var cur=0;
  function show(i){ cur=(i+SLIDES.length)%SLIDES.length; img.src=SLIDES[cur]; }
  document.querySelectorAll('.gw-card').forEach(function(card){
    card.addEventListener('click',function(){
      show(+card.dataset.idx||0);
      if(typeof lb.showModal==='function') lb.showModal(); else lb.setAttribute('open','');
    });
  });
  document.getElementById('gw-prev').addEventListener('click',function(e){e.stopPropagation();show(cur-1)});
  document.getElementById('gw-next').addEventListener('click',function(e){e.stopPropagation();show(cur+1)});
  document.getElementById('gw-close').addEventListener('click',function(){lb.close()});
  lb.addEventListener('click',function(e){ if(e.target===lb) lb.close(); });
  document.addEventListener('keydown',function(e){
    if(!lb.open)return;
    if(e.key==='ArrowLeft')show(cur-1);
    else if(e.key==='ArrowRight')show(cur+1);
  });
})();
</script>
---