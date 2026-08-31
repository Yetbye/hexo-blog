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
  map: { title: '山河行迹' },
  about: { title: '花主自述' },
  notes: { title: '笔记簿' },
  gallery: { title: '调色盘' },
  'gallery-blue': { title: 'Blue' },
  'gallery-green': { title: 'Green' },
  'gallery-pink': { title: 'Pink' },
  'gallery-impressionism': { title: 'Impressionism' },
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
        title: meta.title || base,
        content,
        comments: false,
        aside: false,
      },
    };
  });
});
