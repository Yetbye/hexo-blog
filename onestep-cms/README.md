# onestep-cms — 博客内容管理系统

Hexo Blog Manager v2 · 与 hexo-blog 平级的独立子产品。

## 是什么

一个 Web CMS，让你（和未来的协作者）通过浏览器写文章/说说/动态/数据文件、
管理页面、触发部署——不需要进项目改代码。

## 文件清单

| 文件 | 用途 |
|------|------|
| `server.js` | Node.js 后端，监听 3000 端口，提供 REST API + 静态 UI |
| `index.html` | 前端 SPA，纯 HTML+JS，无构建步骤 |
| `deploy.sh` / `deploy.bat` | 一键部署（clean → generate → deploy） |
| `_region_provinces.js` / `_maptest.js` / `_fixvp.js` | 早期开发辅助脚本，保留作历史 |
| `activity.jsonl` | CMS 操作日志（append-only） |

## 启动

```bash
# 默认：连到 ../hexo-blog 仓库根（hexo-blog 与 onestep-cms 平级时）
node server.js

# 自定义项目路径 + 端口 + 鉴权 token
node server.js --port 8080 --project /path/to/hexo --token YOUR_SECRET
```

打开 http://localhost:3000 输入 token 即可使用。

## 与 hexo-blog 的关系

`onestep-cms/` 与 `hexo-blog/` **是两个独立仓库**（平级），通过 server.js
里的 `--project` 参数指定被管理的项目路径。当前是 hexo-blog 的根仓库
把 onestep-cms 作为子目录携带，便于开发期同步演进。

未来如果要把它们拆成真正的两个 GitHub 仓库，只需：

```bash
# 抽出 onestep-cms 到独立 repo
git subtree split --prefix=onestep-cms -b onestep-cms-standalone
# 在新仓库中：git checkout onestep-cms-standalone
# 回到主仓库：git rm -rf onestep-cms
```

## 设计目标

- 不替换 hexo 自己的 generator 体系，只是用 Web UI 包装 markdown/data 文件的读写
- Token 鉴权、路径遍历防护、命令注入白名单（详见 server.js 头部）
- 操作日志在 activity.jsonl 留痕
