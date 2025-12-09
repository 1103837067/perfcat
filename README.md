# PerfCat - 移动端性能监控工具

基于 Tauri 的跨平台移动端性能监控工具，支持 Android 和 iOS 设备。

## 项目结构

```
perfcat/
├── apps/
│   ├── desktop/           # 桌面应用模版（Tauri）
│   ├── android-bridge/    # Android 桥接应用（Tauri）
│   └── ios-bridge/        # iOS 桥接应用（Tauri + ios-go）
│       └── ios-go/        # iOS 设备控制 Go 程序
├── packages/              # 共享包（待添加）
├── pnpm-workspace.yaml    # pnpm workspace 配置
└── package.json           # 根 package.json
```

## 技术栈

- **前端**: React + TypeScript + Vite
- **桌面框架**: Tauri 2.x
- **iOS 设备控制**: go-ios (Go 语言)
- **包管理**: pnpm workspace

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 开发桌面应用
cd apps/desktop && pnpm tauri:dev

# 开发 Android 桥接应用
cd apps/android-bridge && pnpm tauri:dev

# 开发 iOS 桥接应用
cd apps/ios-bridge && pnpm tauri:dev
```

### 构建 iOS Go 桥接程序

```bash
cd apps/ios-bridge/ios-go
go mod download
go build -o ios-go main.go
```

## iOS 桥接说明

iOS 桥接应用使用 Go 语言实现的 `ios-go` 程序来控制 iOS 设备，替代了原来的 `tidevice`。

### ios-go 功能

- 列出连接的 iOS 设备
- 获取设备详细信息
- 通过 Tauri 命令调用 Go 程序

### 使用方式

在 Rust 代码中通过 `list_ios_devices()` 和 `get_ios_device_info(udid)` 命令调用。

## 开发计划

- [ ] 实现性能数据采集（FPS、内存、能耗）
- [ ] WebView 进程监控
- [ ] 性能数据可视化
- [ ] Android 设备控制集成

