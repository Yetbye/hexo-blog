---
top_img: "/image/media/gallery.jpeg"
---

<!-- ============ 调色盘 · 浮世绘蓝调（自足纸卷画布，明暗主题皆宜） ============ -->
<div class="up-scroll">
  <div class="up-wave-band" aria-hidden="true"></div>
  <div class="up-seigaiha" aria-hidden="true"></div>
  <div class="up-corner up-corner-tl" aria-hidden="true"></div>
  <div class="up-corner up-corner-br" aria-hidden="true"></div>

  <header class="up-hero">
    <span class="up-seal">彩</span>
    <span class="up-eyebrow">COLOR PALETTE · 調色盤</span>
    <h1 class="up-title">四 帖 画 集</h1>
    <p class="up-hand">把喜欢的颜色，一张一张收进来</p>
    <div class="up-brushline" aria-hidden="true"></div>
  </header>

  <section class="up-grid">
    <a class="up-card" href="blue/">
      <div class="up-cover" style="background-image:url('/image/gallery/blue/1.jpg')"></div>
      <div class="up-veil"></div>
      <div class="up-meta">
        <span class="up-tag" style="--c:#1B4B6F">青</span>
        <h2>Blue</h2><p>海与远方的蓝</p>
        <span class="up-go">展卷 →</span>
      </div>
    </a>
    <a class="up-card" href="green/">
      <div class="up-cover" style="background-image:url('/image/gallery/green/1.png')"></div>
      <div class="up-veil"></div>
      <div class="up-meta">
        <span class="up-tag" style="--c:#5A8F7B">苍</span>
        <h2>Green</h2><p>草木生长的绿</p>
        <span class="up-go">展卷 →</span>
      </div>
    </a>
    <a class="up-card" href="pink/">
      <div class="up-cover" style="background-image:url('/image/gallery/pink/1.jpg')"></div>
      <div class="up-veil"></div>
      <div class="up-meta">
        <span class="up-tag" style="--c:#E85D4E">桃</span>
        <h2>Pink</h2><p>春日将尽未尽的粉</p>
        <span class="up-go">展卷 →</span>
      </div>
    </a>
    <a class="up-card" href="Impressionism/">
      <div class="up-cover up-cover-art" aria-hidden="true">浮</div>
      <div class="up-veil"></div>
      <div class="up-meta">
        <span class="up-tag" style="--c:#C9A86C">浮</span>
        <h2>Impressionism</h2><p>印象派的碎光</p>
        <span class="up-go">展卷 →</span>
      </div>
    </a>
  </section>

  <footer class="up-foot">
    <div class="up-brandline" aria-hidden="true"></div>
    <p>每一张图都值得被认真看一次</p>
  </footer>
</div>

<style>
/* ===== Venus 配方 A：浮世绘蓝调 —— 自足不透明画布 ===== */
.up-scroll {
  position:relative; max-width:1060px; margin:0 auto;
  background:
    radial-gradient(1200px 400px at 85% -60px, rgba(27,75,111,.06), transparent 60%),
    linear-gradient(#FAF9F6, #F5F5F0);
  border:1px solid #E8E8E4; border-radius:20px;
  box-shadow:0 18px 50px rgba(0,0,0,.28);
  padding:0 2.2rem 2.6rem; overflow:hidden;
  font-family:'Noto Sans SC',-apple-system,sans-serif; color:#2C3E50;
}
/* 青海波（靛蓝，低透明） */
.up-seigaiha {
  position:absolute; top:0; left:0; right:0; height:220px; pointer-events:none; opacity:.07;
  background-image:
    radial-gradient(circle at 50% 100%, transparent 17px, #1B4B6F 18px, transparent 19px),
    radial-gradient(circle at 50% 100%, transparent 37px, #1B4B6F 38px, transparent 39px);
  background-size:38px 19px;
  -webkit-mask-image:linear-gradient(#000, transparent); mask-image:linear-gradient(#000, transparent);
}
/* 顶部波浪带（SVG 内联，浮世绘浪头剪影） */
.up-wave-band {
  position:absolute; top:0; left:0; right:0; height:10px; opacity:.9;
  background:linear-gradient(90deg,#1B4B6F 0 25%,#5A8F7B 25% 50%,#E85D4E 50% 75%,#C9A86C 75% 100%);
  background-size:56px 100%; border-radius:20px 20px 0 0;
}
/* 双层角框 */
.up-corner { position:absolute; width:54px; height:54px; pointer-events:none; z-index:2; }
.up-corner::before { content:''; position:absolute; inset:0; border:2px solid #1B4B6F; opacity:.4; }
.up-corner::after  { content:''; position:absolute; inset:6px; border:1px solid #E85D4E; opacity:.45; }
.up-corner-tl { top:22px; left:22px; } .up-corner-tl::before,.up-corner-tl::after { border-right:0; border-bottom:0; }
.up-corner-br { bottom:22px; right:22px; } .up-corner-br::before,.up-corner-br::after { border-left:0; border-top:0; }

/* Hero：印章 + 衬线题 + 手写句 + 笔触线 */
.up-hero { position:relative; z-index:1; text-align:center; padding:3rem 1rem 2.2rem; }
.up-seal {
  display:inline-grid; place-items:center; width:46px; height:46px; margin-bottom:1rem;
  background:#E85D4E; color:#FAF9F6; font-family:'Noto Serif SC',serif; font-size:1.3rem;
  border-radius:8px; transform:rotate(-6deg); box-shadow:0 4px 14px rgba(232,93,78,.35);
}
.up-eyebrow {
  display:block; font-family:'JetBrains Mono',monospace; font-size:.7rem;
  letter-spacing:.44em; color:#5A8F7B; margin-bottom:.8rem;
}
.up-title {
  font-family:'Noto Serif SC',Georgia,serif; font-weight:900; letter-spacing:.14em;
  font-size:clamp(2rem,4.6vw,3rem); margin:0 0 .8rem; color:#2C3E50;
}
.up-hand { font-family:'Ma Shan Zheng',cursive; font-size:1.2rem; color:#1B4B6F; margin:0 0 1.1rem; }
.up-brushline {
  width:180px; height:5px; margin:0 auto; border-radius:99px;
  background:linear-gradient(90deg,transparent,#1B4B6F 30% 70%,transparent); opacity:.55;
}

/* 卡片：立牌式，底部信息常驻、悬停全揭 */
.up-grid {
  position:relative; z-index:1;
  display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.5rem;
}
.up-card {
  position:relative; height:330px; border-radius:14px; overflow:hidden; display:block;
  border:1px solid #E8E8E4; text-decoration:none;
  box-shadow:0 3px 12px rgba(27,75,111,.12);
  transition:transform .4s cubic-bezier(.16,1,.3,1), box-shadow .4s;
}
.up-card:hover { transform:translateY(-9px) rotate(-.4deg); box-shadow:0 18px 40px rgba(27,75,111,.24); }
.up-cover {
  position:absolute; inset:0; background-size:cover; background-position:center;
  filter:saturate(.92); transition:transform .6s cubic-bezier(.16,1,.3,1), filter .4s;
}
.up-card:hover .up-cover { transform:scale(1.06); filter:saturate(1.05); }
.up-cover-art {
  display:grid; place-items:center; font-size:72px; font-family:'Noto Serif SC',serif; color:#fff;
  background:radial-gradient(circle at 30% 20%, #5A8F7B, #1B4B6F 70%);
  text-shadow:0 6px 24px rgba(0,0,0,.4);
}
.up-veil {
  position:absolute; inset:0;
  background:linear-gradient(transparent 42%, rgba(20,40,55,.88));
}
.up-meta { position:absolute; left:0; right:0; bottom:0; padding:1.15rem 1.25rem 1.05rem; color:#fff; }
.up-meta h2 { font-family:'Noto Serif SC',serif; font-size:1.32rem; letter-spacing:.08em; margin:0 0 .1rem; }
.up-meta p { margin:0 0 .55rem; font-size:.84rem; opacity:.82; }
.up-tag {
  float:right; width:34px; height:34px; margin-top:.15rem; border-radius:50%;
  display:grid; place-items:center; background:var(--c,#1B4B6F);
  font-family:'Noto Serif SC',serif; box-shadow:0 0 0 2px rgba(255,255,255,.65), 0 3px 10px rgba(0,0,0,.3);
}
.up-go {
  display:inline-block; font-size:.76rem; letter-spacing:.2em; padding-bottom:2px;
  border-bottom:1px solid rgba(255,255,255,.55);
  transform:translateY(4px); opacity:0; transition:all .35s cubic-bezier(.16,1,.3,1);
}
.up-card:hover .up-go { transform:none; opacity:1; }

/* 页脚 */
.up-foot { position:relative; z-index:1; text-align:center; margin-top:2.4rem; }
.up-brandline {
  width:64px; height:3px; margin:0 auto .9rem; border-radius:99px;
  background:linear-gradient(90deg,#1B4B6F,#E85D4E);
}
.up-foot p { font-family:'Ma Shan Zheng',cursive; font-size:1.05rem; color:#5D6D7E; margin:0; }

@media (max-width:640px){ .up-scroll{padding:0 1rem 2rem;} .up-grid{grid-template-columns:1fr;} }
@media (prefers-reduced-motion:reduce){ *{transition:none!important} .up-card:hover{transform:none} }
</style>
---