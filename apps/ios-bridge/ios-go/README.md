# iOS Go Bridge

基于 go-ios 的 iOS 设备控制桥接程序。

## 构建

```bash
cd ios-go
go mod download
go build -o ios-go main.go
```

## 使用

该程序通过命令行参数接收 JSON 格式的命令：

```bash
./ios-go '{"action":"list","params":null}'
./ios-go '{"action":"info","params":{"udid":"设备UDID"}}'
```

## 依赖

- [go-ios](https://github.com/danielpaulus/go-ios): iOS 设备控制库

