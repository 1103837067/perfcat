# 仓库贡献指南

## 项目结构

本仓库是 PerfX（移动端性能监控工具）的 pnpm workspace 单体仓库，包含桌面端客户端。

- `apps/desktop/`：主要桌面应用（Tauri + Vite + React）。
  - `src/`：React/TS 源码。常用目录：`components/`、`pages/`、`routes/`、`stores/`、`hooks/`、`shared/`、`lib/`、`assets/`。
  - `public/`：构建时拷贝的静态资源。
  - `src-tauri/`：Tauri 的 Rust 侧代码、能力声明、图标与资源。
- `apps/empty/`：占位应用（目前较空）。
- `packages/`：共享包（为空或开发中）。

## 构建、测试与开发命令

在仓库根目录执行（Node >= 18，pnpm >= 8）：

- `pnpm dev`：启动所有应用的开发服务（当前主要是 `apps/desktop`）。
- `pnpm dev:all`：以 Tauri 开发模式启动桌面应用。
- `pnpm build`：构建所有应用。
- `pnpm lint`：对所有应用运行 ESLint。

桌面端专用（在 `apps/desktop/` 下执行，或用 `pnpm --filter @PerfX/desktop <script>`）：

- `pnpm dev`：启动 Vite 开发服务器。
- `pnpm tauri:dev`：Vite + Tauri 桌面壳开发模式。
- `pnpm build` / `pnpm tauri:build`：Web 产物构建 / 原生桌面包构建。
- `pnpm lint` / `pnpm lint:fix`：检查 / 自动修复 ESLint 问题。
- `pnpm format` / `pnpm format:check`：Prettier 格式化 / 校验。

## 编码风格与命名约定

- 技术栈：TypeScript + React（ESM），TailwindCSS。
- 缩进 2 空格；避免过长行。
- Prettier 与 `eslint-plugin-prettier` 强制格式；提交前运行 `pnpm format`。
- 组件文件用 `PascalCase.tsx`；自定义 Hook 用 `useXxx.ts`；工具函数用 `camelCase.ts`。

## 测试规范

当前未配置测试框架。若新增测试：

- 建议放在 `apps/desktop/src/**/__tests__/` 下，或命名为 `*.test.ts(x)`。
- Vite 项目优先考虑 Vitest，除非团队另有约定。

## Commit 与 Pull Request 规范

提交信息遵循类 Conventional Commits：`feat: ...`、`fix: ...`、`refactor: ...` 等，主题短且使用祈使语气。

PR 需包含：

- 变更内容与原因的简要说明。
- UI 变更请附截图或短视频。
- 若修改 `src-tauri/`，说明对应的 Rust/Tauri 影响。
- 关联的 issue/任务（如有）。

## 安全与配置

- 禁止提交敏感信息；本地配置使用 `.env.local`（已被 git 忽略）。
- 修改 `src-tauri/capabilities` 时保持最小权限，并在 PR 中说明必要性。
