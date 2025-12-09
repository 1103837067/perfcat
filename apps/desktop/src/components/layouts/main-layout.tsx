import { Outlet } from "react-router-dom"
import { TitleBar } from "./titlebar"

export function MainLayout() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden pt-8">
        <Outlet />
      </div>
    </div>
  )
}
