# Manifest: OwnWeb-Yetbye 审查与优化

## Output Files

| File | Type | Size | Description |
|------|------|------|-------------|
| `MASTER_LOG.md` | Document | ~3KB | 完整行动日志 |
| `MANIFEST.md` | Document | ~2KB | 本文件 |
| `docs/ALIGNMENT_audit-refactor.md` | Document | ~5KB | Stage 1: 需求对齐与项目分析 |
| `docs/CONSENSUS_audit-refactor.md` | Document | ~3KB | Stage 1: 最终共识 |
| `docs/DESIGN_audit-refactor.md` | Document | ~4KB | Stage 2: 架构设计 |
| `docs/TASK_audit-refactor.md` | Document | ~3KB | Stage 3: 原子任务拆分 |
| `docs/FINAL_audit-refactor.md` | Document | ~4KB | Stage 6: 最终报告 |
| `docs/TODO_audit-refactor.md` | Document | ~4KB | Stage 6: TODO 清单与操作指南 |
| `docs/APPROVAL_audit-refactor.md` | Document | ~2KB | Stage 4: 审批清单 |
| `tools/deploy.sh` | Script | ~6KB | 部署自动化脚本 (Bash) |
| `tools/deploy.bat` | Script | ~3KB | 部署自动化脚本 (Windows CMD) |
| `tools/server.js` | Script | ~17KB | Web UI 后端 (Node.js, 含安全加固) |
| `tools/index.html` | Web | ~19KB | Web UI 前端 (纯 HTML) |

## Total: 13 files, ~75KB

## Quick Start

```bash
# 部署脚本
cp one-step-output/tools/deploy.sh ./
./deploy.sh --status        # 查看项目状态
./deploy.sh --build-only    # 仅构建
./deploy.sh                 # 完整部署

# Web UI
cd one-step-output/tools
node server.js              # http://localhost:3000
```
