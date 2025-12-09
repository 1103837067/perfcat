import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"

export interface DeviceInfo {
  manufacturer: string
  model: string
  brand: string
  device: string
  product: string
  hardware: string
  androidVersion: string
  sdkInt: number
  codename: string
  screen: {
    width: number
    height: number
    density: number
    densityDpi: number
    scaledDensity: number
  }
  androidId: string
  cpuAbi: string
  fingerprint: string
  serial: string
}

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        setLoading(true)
        // 调用插件命令
        const info = await invoke<DeviceInfo>("plugin:deviceinfo|get_device_info")
        setDeviceInfo(info)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取设备信息失败")
        console.error("Failed to get device info:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDeviceInfo()
  }, [])

  return { deviceInfo, loading, error }
}
