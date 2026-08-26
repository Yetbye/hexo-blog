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

hexo.extend.generator.register('raw-html-pages', function () {
  const dir = path.join(hexo.source_dir, '_pages-html');
  let files = [];
  try { files = fs.readdirSync(dir).filter(f => f.endsWith('.html')); }
  catch (e) { return []; }

  return files.map(f => {
    const base = path.basename(f, '.html');
    const i = base.indexOf('-');
    const routePath = i === -1 ? base : base.slice(0, i) + '/' + base.slice(i + 1); // gallery-blue → gallery/blue
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    const meta = META[base] || {};
    return {
      path: `${routePath}/index.html`,
      layout: ['page', 'post'],
      data: {
        layout: 'page',
        title: meta.title || base,
        content,
        top_img: meta.top_img || '',
        comments: false,

      },
    };
  });
});
