# -*- coding: utf-8 -*-
"""
论文精读 → Hexo 常规文章

读 source/docs/_blogs.json（25 篇元数据 + 物化详情页），为每篇生成
source/_posts/<date>-<slug>.md。摘要从 _blogs.json 拿，详情正文嵌一个
跳转卡片（用户点击后跳到 /docs/Name/ 已物化的 HTML 页面）。

为什么用「跳转卡片」而不是 iframe：
  iframe 会被 Butterfly 主题的 content 包裹截断，溢出 / 跨域 sandbox 也
  容易出问题。论文库已经物化在 source/docs/，用户点进文章能立即看到完整
  论文精读页，UX 反而比 iframe 更好（地址栏真实 URL、收藏、SEO）。

为什么用 slug 而不是名字：与 Hexo permalink articles/:slug/ 对齐。

用法：python scripts/sync-papers-as-posts.py [--clean]
  --clean  先删旧的论文类 _posts/*.md 再生成
"""
import json
import os
import re
import sys
from urllib.parse import quote

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_JSON = os.path.join(REPO, 'source', 'docs', '_blogs.json')
POSTS_DIR = os.path.join(REPO, 'source', '_posts')
NOTEBOOKS_JSON = os.path.join(REPO, 'source', 'notes', 'notebooks.json')

NOTEBOOK_SLUG = 'paper-reading'
NOTEBOOK_NAME = '论文精读'
NOTEBOOK_ICON = 'fas fa-book-open-reader'
NOTEBOOK_SUBTITLE = '自回归视频扩散 / 分布匹配蒸馏 论文深度精读（25 篇）'


def slugify(name):
    return re.sub(r'[^a-zA-Z0-9-]+', '-', name).strip('-').lower() or 'paper'


def real_cover(name, cover_rel):
    """_blogs.json 里的 cover 是论文库原始 png/jpg 路径；物化脚本 build-docs-deploy.py
    会把 PNG/JPG 转为 WebP（同名改后缀）。这里探测实际存在的文件，返回可用 URL。"""
    if not cover_rel:
        return ''
    candidates = [
        cover_rel,
        re.sub(r'\.(png|jpe?g)$', '.webp', cover_rel, flags=re.I),
    ]
    for cand in candidates:
        path = os.path.join('source', 'docs', name, cand.replace('/', os.sep))
        if os.path.exists(path):
            return f"/docs/{name}/{cand}"
    return f"/docs/{name}/{cover_rel}"


def md_escape(s):
    return (s.replace('\\', '\\\\').replace('|', '\\|')
              .replace('\n', ' ').strip())


def build_post(b):
    name = b['name']
    title = b['title']
    badge = b.get('badge', '').strip()
    sub = b.get('sub', '').strip()
    cover_rel = b.get('cover')  # 如 "assets/Figure_10__Ablations_p15.png"

    date = b.get('date') or '2026-08-31'
    slug = slugify(name)
    # 文件名用 slug（hexo 7 尊重 front-matter 的 slug 字段生成 URL；日期在 front-matter 控制排序）
    file_name = f"{slug}.md"
    file_path = os.path.join(POSTS_DIR, file_name)

    if cover_rel:
        # 物化脚本把 png/jpg 转 webp；探测实际存在的文件以避免 404
        cover_path = real_cover(name, cover_rel)
    else:
        cover_path = ''

    # front-matter：permalink 直接指向 /docs/Name/，generator 注册同路径输出 standalone HTML。
    # 首页文章卡 href = /docs/Name/，点开就是论文精读完整 HTML（无中间跳板）。
    # _posts 仍会被 hexo 渲染到 permalink 路径（输出 butterfly 包装版），但 generator 后写覆盖。
    # title/cover 必须用双引号包：很多论文标题含 ":"，YAML 解析会视为键值对冲突
    fm = ['---']
    title_safe = title.replace('\\', '\\\\').replace('"', '\\"')
    fm.append(f'title: "{title_safe}"')
    fm.append(f'date: {date} 12:00:00')
    fm.append('layout: post')
    if cover_path:
        fm.append(f'cover: "{cover_path}"')
    fm.append(f'permalink: /docs/{name}/')
    fm.append('categories:')
    fm.append('  - 论文精读')
    fm.append('tags:')
    if 'arXiv' in badge or 'Preprint' in badge:
        fm.append('  - arXiv')
    if any(k in badge for k in ('NeurIPS', 'CVPR', 'ICML', 'ICLR', 'ACL')):
        m = re.search(r'(NeurIPS|CVPR|ICML|ICLR|ACL)\s*\d{4}', badge)
        if m: fm.append(f'  - {m.group(0).replace(" ", "-")}')
    if 'distill' in (sub + title).lower() or 'Forcing' in title or 'Distill' in title:
        fm.append('  - 蒸馏加速')
    if '视频' in title or '视频' in sub or 'Video' in (title + sub):
        fm.append('  - 视频生成')
    if '长' in title or 'Long' in title or '长视频' in sub:
        fm.append('  - 长视频')
    if '加速' in title or '高效' in sub or 'Cache' in title:
        fm.append('  - 高效推理')
    fm.append('---')
    fm.append('')

    # 正文：空骨架（首页卡片只展示 front-matter，详情页由 generator 注册同名路径
    # 输出 standalone HTML 覆盖 _posts 渲染）
    body = [f'<!-- 论文精读详情由 source/docs/{name}/index.html 经 raw-html-pages 直接输出。 -->',
            '']
    if badge:
        body.append(f'> **来源**：{badge}')
        body.append('')
    if sub:
        body.append(f'**{sub}**')

    return file_path, '\n'.join(fm) + '\n' + '\n'.join(body), slug


def upsert_notebook(articles):
    """在 notebooks.json 中确保存在『论文精读』笔记本，列出**4 篇代表作**。
    paper-reading 笔记本卡片点击直接到 /docs/ 合集页（notebooks.json 字段 redirect 控制，
    notes.html 渲染时优先用 redirect 作为卡片链接）。完整 25 篇用首页文章列表覆盖。"""
    if os.path.exists(NOTEBOOKS_JSON):
        nb = json.load(open(NOTEBOOKS_JSON, encoding='utf-8'))
    else:
        nb = []

    # 4 篇代表作：从 25 篇里挑出来（按 name 选）
    REPR_NAMES = ['CausVid', 'SelfForcing', 'DMD', 'LongLive']
    by_name = {a.get('slug'): a for a in articles}
    reprs = []
    for n in REPR_NAMES:
        # slug 是 name 的小写版
        for s, a in by_name.items():
            if s.lower() == n.lower() or s.replace('-', '').lower() == n.lower():
                reprs.append(a)
                break
    if not reprs:
        reprs = articles[:4]  # 兜底

    existing = next((n for n in nb if n.get('slug') == NOTEBOOK_SLUG), None)
    if existing:
        existing['icon'] = NOTEBOOK_ICON
        existing['subtitle'] = NOTEBOOK_SUBTITLE
        existing['articles'] = reprs
        existing['redirect'] = '/docs/'
    else:
        nb.insert(0, {
            'name': NOTEBOOK_NAME,
            'slug': NOTEBOOK_SLUG,
            'icon': NOTEBOOK_ICON,
            'subtitle': NOTEBOOK_SUBTITLE,
            'articles': reprs,
            'redirect': '/docs/',
        })

    with open(NOTEBOOKS_JSON, 'w', encoding='utf-8') as f:
        json.dump(nb, f, ensure_ascii=False, indent=2)


def clean_old():
    """删掉之前由本脚本生成的论文类 _posts/*.md。"""
    removed = 0
    for f in os.listdir(POSTS_DIR):
        p = os.path.join(POSTS_DIR, f)
        if not (f.endswith('.md') and os.path.isfile(p)):
            continue
        try:
            content = open(p, encoding='utf-8').read()
        except Exception:
            continue
        if 'categories:\n  - 论文精读' in content or '  - 论文精读' in content:
            os.remove(p); removed += 1
    return removed


def main():
    clean = '--clean' in sys.argv
    if not os.path.exists(DOCS_JSON):
        sys.exit(f'未找到 {DOCS_JSON}，请先跑 scripts/build-docs-deploy.py')

    blogs = json.load(open(DOCS_JSON, encoding='utf-8'))
    if clean:
        n = clean_old()
        print(f'已清理旧论文文章 {n} 篇')

    nb_articles = []
    for b in blogs:
        file_path, content, slug = build_post(b)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  ✓ {os.path.basename(file_path):36s}  {b["title"][:50]}')
        nb_articles.append({
            'title': b['title'],
            'slug': slug,
            'date': b.get('date') or '2026-08-31',
            'icon': 'fas fa-book-open',
            'url': f'/docs/{b["name"]}/',  # 与首页 _posts permalink 一致，直达完整 HTML
        })

    upsert_notebook(nb_articles)
    print(f'\n完成：{len(blogs)} 篇文章已生成，notebooks.json 已收录')


if __name__ == '__main__':
    main()
