import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeviceSelect } from "@/components/sidebar/DeviceSelect"
import { Activity, FileText, Smartphone } from "lucide-react"
import { useState } from "react"
import { useAdbDevices } from "@/hooks/queries/useAdbDevices"
import { useDeviceStore } from "@/stores/use-device-store"

interface TabbedHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TabbedHeader({ activeTab, onTabChange }: TabbedHeaderProps) {
  const { selectedDevice, setSelectedDevice } = useDeviceStore()
  const [deviceSearch, setDeviceSearch] = useState("")
  const { devices, loading: loadingDevices, refresh: refreshDevices } = useAdbDevices()

  const handleDeviceChange = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId) ?? null
    setSelectedDevice(device)
    refreshDevices()
  }

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between p-4">
        <div className="w-64">
          <DeviceSelect
            value={selectedDevice?.id || ""}
            devices={devices}
            search={deviceSearch}
            loading={loadingDevices}
            onChange={handleDeviceChange}
            onSearch={setDeviceSearch}
            onRefresh={refreshDevices}
          />
        </div>

        <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              性能监控
            </TabsTrigger>
            <TabsTrigger value="device" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              设备信息
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              报告
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  )
}
