# PerfX

PerfX 是一个面向移动端性能测试与分析的桌面平台（目前处于早期设想/原型阶段）。目标是把采集、分析、可视化与调试能力整合到一个可扩展的工具链中，逐步覆盖常见的移动性能场景。

当前仓库主要实现了桌面端应用的基础能力（Tauri + Vite + React），后续会在 monorepo 中继续扩展更多应用与共享包。

## 目录结构

- `apps/desktop/`：桌面端主应用。
  - `src/`：前端源码（组件、页面、路由、状态、工具等）。
  - `src-tauri/`：Tauri 的 Rust 侧与能力声明。
- `apps/empty/`：占位应用（待规划）。
- `packages/`：共享包目录（待补充）。

## 本地开发

环境要求：Node >= 18，pnpm >= 8。

在根目录：

- `pnpm install`：安装依赖。
- `pnpm dev`：启动所有应用的 dev（当前主要是桌面端）。
- `pnpm dev:all`：以 Tauri 模式启动桌面端（含原生壳）。
- `pnpm build`：构建所有应用。
- `pnpm lint`：对所有应用进行代码检查。

桌面端单独运行（在 `apps/desktop/`）：

- `pnpm dev`：启动 Vite 开发服务器。
- `pnpm tauri:dev`：启动桌面端开发壳。
- `pnpm build` / `pnpm tauri:build`：构建 Web/桌面产物。

## 贡献与规范

请阅读 `AGENTS.md`，其中包含代码风格、命名、提交与 PR 要求。

## 路线与状态

这是一个不断演进的项目，当前功能只覆盖整体规划的一小部分。欢迎通过 issue/PR 提出需求、设计与实现建议。

