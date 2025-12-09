import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Smartphone, AppWindow } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  selectedDevice: string
  selectedApp: string
  onDeviceChange: (value: string) => void
  onAppChange: (value: string) => void
  onStart: () => void
}

export function Sidebar({
  selectedDevice,
  selectedApp,
  onDeviceChange,
  onAppChange,
  onStart,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* 侧边栏内容 */}
      <div className="flex-1 space-y-4 p-4">
        {!collapsed ? (
          <>
            {/* 设备选择 */}
            <Select value={selectedDevice} onValueChange={onDeviceChange}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="选择设备" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="device-1">设备 1</SelectItem>
                <SelectItem value="device-2">设备 2</SelectItem>
              </SelectContent>
            </Select>

            {/* 应用选择 */}
            <Select value={selectedApp} onValueChange={onAppChange}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <AppWindow className="h-4 w-4 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="选择应用" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="android-bridge">Android Bridge</SelectItem>
                <SelectItem value="ios-bridge">iOS Bridge</SelectItem>
              </SelectContent>
            </Select>

            {/* 启动按钮 */}
            <Button
              onClick={onStart}
              className="w-full"
              disabled={!selectedApp || !selectedDevice}
            >
              启动
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 pt-4">
            {/* 收起状态下的图标按钮 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeviceChange(selectedDevice || "device-1")}
              className="h-10 w-10"
              title="设备选择"
            >
              <Smartphone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAppChange(selectedApp || "android-bridge")}
              className="h-10 w-10"
              title="应用选择"
            >
              <AppWindow className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onStart}
              disabled={!selectedApp || !selectedDevice}
              className="h-10 w-10"
              title="启动"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* 收起/展开按钮 - 嵌入到边框间隙中 */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-5 w-5 rounded-sm border border-border bg-background shadow-sm hover:bg-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  )
}

