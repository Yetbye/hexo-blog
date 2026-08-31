/**
 * 原始 HTML 页面生成器（绕过 markdown 渲染器）
 *
 * 背景：hexo-renderer-marked 对 <svg>/<g>/<button>/<figure> 等标签的
 * HTML 块解析不可靠，空行或特定结构会静默吞掉标记（行迹页/画廊曾因此损坏）。
 * 本生成器把 source/_pages-html/*.html 原样注入主题 page 布局，
 * 保留导航/页脚等主题外壳，同时保证标记零损坏。
 *
 * 路由约定：
 *   map.html               → /map/
 *   notes.html             → /notes/
 *   gallery.html           → /gallery/
 *   gallery-blue.html      → /gallery/blue/   （首个 - 视为目录分隔）
 *
 * 论文博客：
 *   source/docs/<Name>/index.html 同时发布到
 *     /docs/<Name>/             (原 URL，笔记本跳转用)
 *     /articles/<slug>/         (首页文章卡片直达，主题 post 布局)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const META = {
  map: { title: '山河行迹', top_img: '/image/media/moments.jpg' },
  about: { title: '花主自述', top_img: '/image/media/about.jpg' },
  notes: { title: '笔记簿', top_img: '/image/media/notes.jpg' },
  gallery: { title: '调色盘', top_img: '/image/media/gallery.jpeg' },
  'gallery-blue': { title: 'Blue', top_img: '/image/gallery/blue/cover.jpg' },
  'gallery-green': { title: 'Green', top_img: '/image/gallery/green/cover.jpg' },
  'gallery-pink': { title: 'Pink', top_img: '/image/gallery/pink/cover.jpg' },
  'gallery-Impressionism': { title: 'Impressionism', top_img: '/image/gallery/Impressionism/cover.jpg' },
};

function slugify(name) { return name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase(); }



hexo.extend.generator.register('raw-html-pages', function () {
  const out = [];

  // 1) 常规 _pages-html/*.html
  const dir = path.join(hexo.source_dir, '_pages-html');
  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    for (const f of files) {
      const base = path.basename(f, '.html');
      const i = base.indexOf('-');
      const routePath = i === -1 ? base : base.slice(0, i) + '/' + base.slice(i + 1);
      const content = fs.readFileSync(path.join(dir, f), 'utf8');
      const meta = META[base] || {};
      out.push({
        path: `${routePath}/index.html`,
        layout: ['page', 'post'],
        data: {
          layout: 'page',
          title: meta.title || base,
          content,
          top_img: meta.top_img || '',
          comments: false,
        },
      });
    }
  } catch (e) { /* 目录可为空 */ }

  // 2) 论文博客 standalone HTML 注册到 /docs/<Name>/（保留原 URL，笔记本/合集页引用）
  //   hexo 7 行为：generator 返回 `data: Buffer` 时，router 直接写 Buffer 到 public/，
  //   不经主题 layout 渲染。Buffer data 在 router 阶段是「最后写入的 winning」，
  //   但 _posts 渲染（hexo post processor 跑在 generator 之后）会覆盖同 path。
  //   解决方案：同时注册 after_generate filter 强制覆盖 _posts 渲染的 butterfly 包装版。
  const docsDir = path.join(hexo.source_dir, 'docs');
  const blogsJson = path.join(docsDir, '_blogs.json');
  if (fs.existsSync(blogsJson) && fs.existsSync(docsDir)) {
    const blogs = JSON.parse(fs.readFileSync(blogsJson, 'utf8'));
    const publicDir = hexo.public_dir;

    for (const b of blogs) {
      const htmlPath = path.join(docsDir, b.name, 'index.html');
      if (!fs.existsSync(htmlPath)) continue;
      const content = fs.readFileSync(htmlPath);
      out.push({
        path: `docs/${b.name}/index.html`,
        data: content,
      });
    }

    // hexo 7 行为：after_generate filter 触发时 _posts 渲染的 stream 写入还没完成，
    // 同步/异步覆盖都会被后续流覆盖。唯一稳妥的时机是 process 退出前（hexo 全部 batchWrite 完成之后）。
    // 用 process.on('beforeExit') 同步执行覆盖（fs.writeFileSync 同步，beforeExit 同步回调不会被打断）。
    process.on('beforeExit', () => {
      let n = 0;
      for (const b of blogs) {
        const htmlPath = path.join(docsDir, b.name, 'index.html');
        if (!fs.existsSync(htmlPath)) continue;
        const content = fs.readFileSync(htmlPath);
        const target = path.join(publicDir, 'docs', b.name, 'index.html');
        try {
          fs.mkdirSync(path.dirname(target), { recursive: true });
          fs.writeFileSync(target, content);
          n++;
        } catch (e) {
          console.error('[raw-html-pages] 覆盖失败', target, e.message);
        }
      }
      if (n > 0) console.log(`[raw-html-pages] beforeExit 覆盖 ${n} 个论文详情页`);
    });
  }

  return out;
});
