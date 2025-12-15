import { useEffect, useRef } from "react"
import { useDeviceStore } from "@/stores/use-device-store"
import { useMonitoringStore } from "@/stores/use-monitoring-store"
import { useAdbApps } from "@/hooks/queries/useAdbApps"

export function useDeviceEffects() {
  const { selectedDevice } = useDeviceStore()
  const { setSelectedApp } = useMonitoringStore()
  const { refresh: refreshApps } = useAdbApps(selectedDevice?.id || null)
  const prevDeviceRef = useRef<string | null>(null)

  useEffect(() => {
    const prev = prevDeviceRef.current
    const current = selectedDevice?.id || null

    if (prev !== null && prev !== current) {
      // 设备变化时清空应用选择
      setSelectedApp("")
    }

    if (current) {
      refreshApps()
    }

    prevDeviceRef.current = current
  }, [selectedDevice, setSelectedApp, refreshApps])
}
