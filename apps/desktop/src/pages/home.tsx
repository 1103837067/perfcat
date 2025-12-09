import { Sidebar } from "@/components/layouts/sidebar"
import { useState } from "react"

export function HomePage() {
  const [selectedDevice, setSelectedDevice] = useState("")
  const [selectedApp, setSelectedApp] = useState("")

  const handleStart = () => {
    // TODO: 实现启动逻辑
    console.log("启动", { selectedDevice, selectedApp })
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* 侧边栏 */}
      <Sidebar
        selectedDevice={selectedDevice}
        selectedApp={selectedApp}
        onDeviceChange={setSelectedDevice}
        onAppChange={setSelectedApp}
        onStart={handleStart}
      />

      {/* 主内容区域 */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* 首页布局稍后实现 */}
      </main>
    </div>
  )
}
