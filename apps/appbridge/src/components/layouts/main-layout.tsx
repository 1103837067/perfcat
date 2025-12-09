import { Outlet } from "react-router-dom"
import { TitleBar } from "./titlebar"

export function MainLayout() {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* 为系统状态栏留出空间 - 使用 CSS env() 变量 */}
      <div className="h-safe-area-inset-top bg-background" />
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
