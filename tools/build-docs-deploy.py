# -*- coding: utf-8 -*-
"""
论文精读合辑物化脚本：docs/（论文库） → source/docs/（可入库部署的真实文件）

背景：
  source/docs 原本是指向根目录 docs/（668MB 论文库）的 junction，且被 .gitignore
  排除——线上（GitHub Pages / Vercel）从来没有这些文章。本脚本把「门户 + 每篇文章
  index.html + 实际被引用的图片」提取为轻量部署子集：

    1. 图片压缩：PNG/JPG → WebP（最长边 ≤1800px，quality 85），180MB → ~15MB
    2. HTML 引用重写：assets/x.png → assets/x.webp（仅重写实际转换的文件）
    3. 导航注入：每篇文章 nav-links 首位插入「« 合辑」返回链接；
       门户 hero/页脚插入「返回博客主页」链接
    4. distillalign 未登记的文章自动补进 _blogs.json 与门户卡片

  论文库本体不动（只读），产物写入 source/docs/。论文库更新后重跑本脚本即可刷新。

用法：python scripts/build-docs-deploy.py
"""
import io
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.parse

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DOCS = os.path.join(REPO, 'docs')            # 论文库（只读）
DST_DOCS = os.path.join(REPO, 'source', 'docs')  # 部署子集（会被整体重建）

MAX_WIDTH = 1800
WEBP_QUALITY = 85

# distillalign 在论文库里已成文但未登记进 _blogs.json / 门户，这里补齐元数据
EXTRA_BLOGS = [{
    'name': 'distillalign',
    'title': 'DistillAlign: 当 mode covering 遇见 mode seeking',
    'badge': 'arXiv 2607.26811 · Riemann Dynamics / NTU',
    'sub': '多阶段自回归视频蒸馏的分布对齐 — mode covering × mode seeking 协调',
    'cover': 'assets/hero_watercolor.jpg',
}]

BACK_LINK = '<a href="../index.html">« 合辑</a>'
PORTAL_BACK_HERO = ('\n  <a href="/" style="display:inline-block;margin-bottom:14px;'
                    'font-size:13px;color:#7e22ce;text-decoration:none;'
                    'border:1px solid #d8b4fe;border-radius:100px;padding:5px 16px;'
                    'background:rgba(255,255,255,0.6)">← 返回博客主页</a>')
PORTAL_BACK_FOOTER = ('\n  <p style="margin-top:12px"><a href="/" '
                      'style="color:#d8b4fe">← 返回博客主页</a></p>')


def is_image(path):
    return path.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp'))


def resolve_ci(base, rel):
    """按 HTML 引用路径定位磁盘文件（Windows 大小写不敏感，部署到 Linux 后路径必须
    与 HTML 完全一致，因此输出沿用 HTML 引用的原始大小写）。"""
    rel = urllib.parse.unquote(rel)
    p = os.path.join(base, rel.replace('/', os.sep))
    if os.path.exists(p):
        return p
    # 逐段大小写不敏感兜底
    parts = rel.split('/')
    cur = base
    for part in parts:
        hit = [f for f in os.listdir(cur) if f.lower() == part.lower()]
        if not hit:
            return None
        cur = os.path.join(cur, hit[0])
    return cur if os.path.isfile(cur) else None


def convert_image(src_path, dst_path):
    """图片 → WebP（≤MAX_WIDTH 宽，quality 85）。返回是否成功。"""
    im = Image.open(src_path)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
    else:
        im = im.convert('RGB')
    if im.width > MAX_WIDTH:
        im = im.resize((MAX_WIDTH, round(im.height * MAX_WIDTH / im.width)), Image.LANCZOS)
    im.save(dst_path, 'WEBP', quality=WEBP_QUALITY, method=6)
    return True


def process_blog(name, staging_root):
    """提取一篇文章：index.html + 引用资源，返回（重写后的 HTML, 引用清单）。"""
    blog_dir = os.path.join(SRC_DOCS, name)
    html_path = os.path.join(blog_dir, 'index.html')
    html = open(html_path, encoding='utf-8', errors='strict').read()

    refs = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', html)
    local = [r for r in refs if not re.match(r'^[a-z]+:|^#|^mailto:|^data:', r)]

    out_dir = os.path.join(staging_root, name)
    os.makedirs(out_dir, exist_ok=True)

    rewritten = html
    missing = []
    for ref in local:
        src = resolve_ci(blog_dir, ref)
        if src is None:
            missing.append(ref)
            continue
        if is_image(ref):
            out_rel = re.sub(r'\.(png|jpe?g|gif|webp)$', '.webp', ref, flags=re.I)
            dst = os.path.join(out_dir, out_rel.replace('/', os.sep))
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            try:
                convert_image(src, dst)
                rewritten = rewritten.replace(ref, out_rel)
            except Exception as e:
                # 转换失败则原样拷贝，保证不丢图
                shutil.copyfile(src, os.path.join(out_dir, ref.replace('/', os.sep)))
                print(f'  ! {name}: 图片转换失败，原样拷贝 {ref}（{e}）')
        else:
            dst = os.path.join(out_dir, ref.replace('/', os.sep))
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copyfile(src, dst)

    # nav-links 首位插入返回合辑链接（两种导航结构：div 平铺 / ul>li 列表）
    m = re.search(r'<(div|ul)[^>]*class="nav-links"[^>]*>', rewritten)
    if m:
        link = BACK_LINK if m.group(1) == 'div' else f'<li>{BACK_LINK}</li>'
        rewritten = rewritten[:m.end()] + link + rewritten[m.end():]
    else:
        print(f'  ! {name}: 未找到 nav-links，跳过返回链接注入')

    return rewritten, missing


def build_portal(blogs, staging_root):
    """门户页：图片引用重写 + distillalign 卡片 + 数量统计 + 返回博客链接。"""
    html = open(os.path.join(SRC_DOCS, 'index.html'), encoding='utf-8').read()

    # 1) 门户引用的封面图 → webp（博客目录已在 process_blog 中建好）
    missing = []
    for ref in re.findall(r'(?:src|href)=["\']([^"\']+)["\']', html):
        if re.match(r'^[a-z]+:|^#|^mailto:|^data:', ref) or ref.endswith('index.html'):
            continue
        name, rest = ref.split('/', 1)
        src = resolve_ci(os.path.join(SRC_DOCS, name), rest)
        if src is None or not is_image(ref):
            continue
        out_rel = re.sub(r'\.(png|jpe?g|gif|webp)$', '.webp', ref, flags=re.I)
        dst = os.path.join(staging_root, out_rel.replace('/', os.sep))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if not os.path.exists(dst):  # 封面多与文内引用重复，避免二次压缩
            try:
                convert_image(src, dst)
            except Exception as e:
                missing.append((ref, str(e)))
                continue
        # 无论本次是否转换，引用都必须指向 webp（否则与文章页已生成的 webp 不一致）
        html = html.replace(ref, out_rel)

    # 2) 补 distillalign 卡片（插在 DMD2 卡片之后，标签：蒸馏加速/视频生成）
    if 'distillalign/index.html' not in html:
        extra = EXTRA_BLOGS[0]
        cover_webp = re.sub(r'\.(png|jpe?g|gif|webp)$', '.webp', extra['cover'], flags=re.I)
        card = (
            '\n  <!-- DistillAlign -->\n'
            '  <a href="distillalign/index.html" class="blog-card" data-tags="distill video">\n'
            f'    <img src="distillalign/{cover_webp}" alt="DistillAlign" class="card-cover" onerror="this.style.display=\'none\'">\n'
            '    <div class="card-body">\n'
            '      <div class="card-badge">arXiv 2026</div>\n'
            f"      <div class=\"card-title\">{extra['title']}</div>\n"
            f"      <div class=\"card-sub\">{extra['sub']}</div>\n"
            '      <div class="card-tags"><span class="tag tag-distill">蒸馏加速</span><span class="tag tag-video">视频生成</span></div>\n'
            '    </div>\n'
            '  </a>\n')
        # DMD2 卡片结束的位置（</a> 后）
        m = re.search(r'<!-- DMD2 -->.*?</a>\n', html, re.S)
        if m:
            html = html[:m.end()] + card + html[m.end():]
        else:
            html = html.replace('<!-- DummyForcing -->', card + '\n  <!-- DummyForcing -->')
        html = re.sub(r'(<div class="stat-val">)24(</div>\s*<div class="stat-label">篇论文精读)',
                      r'\g<1>25\g<2>', html)

    # 3) 返回博客主页（hero 顶部胶囊 + 页脚）
    if '返回博客主页' not in html:
        html = html.replace('<div class="hero-wrap">', '<div class="hero-wrap">' + PORTAL_BACK_HERO, 1)
        html = html.replace('</footer>', PORTAL_BACK_FOOTER + '\n</footer>', 1)

    open(os.path.join(staging_root, 'index.html'), 'w', encoding='utf-8').write(html)
    return missing


def main():
    blogs = json.load(open(os.path.join(SRC_DOCS, '_blogs.json'), encoding='utf-8'))
    names = [b['name'] for b in blogs] + [b['name'] for b in EXTRA_BLOGS]
    blogs_meta = blogs + EXTRA_BLOGS

    staging = tempfile.mkdtemp(prefix='docs-deploy-')
    print(f'论文库: {SRC_DOCS}')
    print(f'暂存目录: {staging}')
    print(f'文章数: {len(names)}（含补录 distillalign）\n')

    all_missing = {}
    for name in names:
        html, missing = process_blog(name, staging)
        open(os.path.join(staging, name, 'index.html'), 'w', encoding='utf-8').write(html)
        if missing:
            all_missing[name] = missing
        print(f'  ✓ {name}')

    portal_missing = build_portal(blogs_meta, staging)

    # 元数据与共享资源
    json.dump(blogs_meta, open(os.path.join(staging, '_blogs.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=2)
    shared = os.path.join(SRC_DOCS, '_shared')
    if os.path.isdir(shared):
        shutil.copytree(shared, os.path.join(staging, '_shared'))

    if all_missing:
        print('\n⚠ 缺失引用（未拷贝）:')
        for name, m in all_missing.items():
            print(f'  {name}: {m}')
    if portal_missing:
        print(f'\n⚠ 门户封面转换失败: {portal_missing}')

    # —— 交付：移除 junction（若有）→ 重建 source/docs ——
    if os.path.isdir(DST_DOCS):
        rp = subprocess.run(['fsutil', 'reparsepoint', 'query', DST_DOCS],
                            capture_output=True)
        if rp.returncode == 0:
            # junction：rmdir 只删链接不碰论文库，绝不能 rm -rf（会穿透删掉 668MB 库）
            subprocess.run(['cmd', '/c', 'rmdir', DST_DOCS], check=True)
            print('\n已移除 junction source\\docs（论文库不受影响）')
        else:
            shutil.rmtree(DST_DOCS)
            print('\n已清空旧 source\\docs')
    shutil.move(staging, DST_DOCS)

    total = sum(os.path.getsize(os.path.join(dp, f))
                for dp, _, fs in os.walk(DST_DOCS) for f in fs)
    n_files = sum(len(fs) for _, _, fs in os.walk(DST_DOCS))
    print(f'完成：source/docs 共 {n_files} 个文件，{total / 1024 / 1024:.1f} MB')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
