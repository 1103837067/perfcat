import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Play, Square, Settings } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { AppSelect } from "@/components/sidebar/AppSelect"
import { MetricSelector } from "@/components/sidebar/MetricSelector"
import { useAdbApps } from "@/hooks/queries/useAdbApps"
import { useMonitoringStore } from "@/stores/use-monitoring-store"
import { useDeviceStore } from "@/stores/use-device-store"

interface FloatingButtonGroupProps {
  onStart: () => void
  onStop: () => void
  running: boolean
}

export function FloatingButtonGroup({ onStart, onStop, running }: FloatingButtonGroupProps) {
  const { selectedDevice } = useDeviceStore()
  const { selectedApp, selectedMetrics, setSelectedApp, setSelectedMetrics } = useMonitoringStore()
  const [appSearch, setAppSearch] = useState("")
  const prevDeviceRef = useRef<string | null>(null)

  // 设备变化时清空搜索
  useEffect(() => {
    const prev = prevDeviceRef.current
    const current = selectedDevice?.id || null
    if (prev !== null && prev !== current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAppSearch("")
    }
    prevDeviceRef.current = current
  }, [selectedDevice])

  const {
    apps,
    loading: loadingApps,
    error: appError,
    refresh: refreshApps,
  } = useAdbApps(selectedDevice?.id || null)

  const [settingsPopoverOpen, setSettingsPopoverOpen] = useState(false)

  const disabled = !selectedDevice || !selectedApp || selectedMetrics.length === 0

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border bg-background/95 p-2 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Settings */}
      <Popover open={settingsPopoverOpen} onOpenChange={setSettingsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-full"
            disabled={running}
            aria-label="设置"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-6" align="end">
          <div className="space-y-6">
            <div className="text-sm font-medium">监控设置</div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">选择应用</div>
                <AppSelect
                  value={selectedApp}
                  apps={apps}
                  search={appSearch}
                  loading={loadingApps}
                  error={appError}
                  onRefresh={refreshApps}
                  onChange={setSelectedApp}
                  onSearch={setAppSearch}
                  disabled={!selectedDevice}
                />
              </div>

              <div>
                <MetricSelector
                  value={selectedMetrics}
                  onChange={setSelectedMetrics}
                  disabled={running}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Start/Stop Button */}
      <Button
        variant={running ? "destructive" : "default"}
        size="sm"
        className="h-10 w-10 rounded-full"
        onClick={() => {
          if (running) {
            onStop()
          } else {
            onStart()
          }
        }}
        disabled={disabled}
        aria-label={running ? "停止监控" : "开始监控"}
      >
        {running ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    </div>
  )
}
