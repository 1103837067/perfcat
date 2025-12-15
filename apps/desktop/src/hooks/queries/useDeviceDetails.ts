import { useCallback, useEffect, useState } from "react"
import { executeAdbCommand } from "@/lib/tauri-adb"

export interface DeviceDetails {
  id: string
  model?: string
  state: string
  android_version?: string
  api_level?: string
  battery_level?: string
  battery_temp?: string
  battery_status?: string
  cpu_info?: string
  memory_total?: string
  memory_available?: string
  storage_total?: string
  storage_available?: string
  screen_resolution?: string
  screen_density?: string
  manufacturer?: string
  brand?: string
  product?: string
}

export function useDeviceDetails(deviceId: string | null) {
  const [details, setDetails] = useState<DeviceDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!deviceId) {
      setDetails(null)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    try {
      const deviceDetails: DeviceDetails = {
        id: deviceId,
        state: "unknown",
      }

      // 获取基本设备信息
      try {
        const devicesOutput = await executeAdbCommand(null, ["devices", "-l"])
        for (const line of devicesOutput.split("\n")) {
          if (line.includes(deviceId)) {
            const parts = line.trim().split(/\s+/)
            if (parts.length >= 2) {
              deviceDetails.state = parts[1]
            }
            for (const part of parts.slice(2)) {
              if (part.startsWith("model:")) {
                deviceDetails.model = part.substring(6)
              } else if (part.startsWith("device:")) {
                deviceDetails.product = part.substring(7)
              }
            }
            break
          }
        }
      } catch (e) {
        console.warn("Failed to get device basic info:", e)
      }

      // 获取Android版本和API级别
      try {
        const androidVersion = await executeAdbCommand(deviceId, [
          "shell",
          "getprop",
          "ro.build.version.release",
        ])
        deviceDetails.android_version = androidVersion.trim()
      } catch (e) {
        console.warn("Failed to get Android version:", e)
      }

      try {
        const apiLevel = await executeAdbCommand(deviceId, [
          "shell",
          "getprop",
          "ro.build.version.sdk",
        ])
        deviceDetails.api_level = apiLevel.trim()
      } catch (e) {
        console.warn("Failed to get API level:", e)
      }

      // 获取制造商和品牌
      try {
        const manufacturer = await executeAdbCommand(deviceId, [
          "shell",
          "getprop",
          "ro.product.manufacturer",
        ])
        deviceDetails.manufacturer = manufacturer.trim()
      } catch (e) {
        console.warn("Failed to get manufacturer:", e)
      }

      try {
        const brand = await executeAdbCommand(deviceId, ["shell", "getprop", "ro.product.brand"])
        deviceDetails.brand = brand.trim()
      } catch (e) {
        console.warn("Failed to get brand:", e)
      }

      // 获取电池信息
      try {
        const batteryOutput = await executeAdbCommand(deviceId, ["shell", "dumpsys", "battery"])
        for (const line of batteryOutput.split("\n")) {
          const trimmed = line.trim()
          if (trimmed.startsWith("level:")) {
            deviceDetails.battery_level = trimmed.split(":")[1]?.trim()
          } else if (trimmed.startsWith("temperature:")) {
            const tempStr = trimmed.split(":")[1]?.trim()
            if (tempStr) {
              const temp = parseFloat(tempStr)
              if (!isNaN(temp)) {
                deviceDetails.battery_temp = `${(temp / 10).toFixed(1)}°C`
              }
            }
          } else if (trimmed.startsWith("status:")) {
            const statusCode = trimmed.split(":")[1]?.trim()
            const statusMap: Record<string, string> = {
              "2": "充电中",
              "3": "放电中",
              "4": "未充电",
              "5": "充满",
            }
            deviceDetails.battery_status = statusMap[statusCode || ""] || "未知"
          }
        }
      } catch (e) {
        console.warn("Failed to get battery info:", e)
      }

      // 获取内存信息
      try {
        const memOutput = await executeAdbCommand(deviceId, ["shell", "cat", "/proc/meminfo"])
        for (const line of memOutput.split("\n")) {
          if (line.startsWith("MemTotal:")) {
            const kbMatch = line.match(/(\d+)/)
            if (kbMatch) {
              const kb = parseInt(kbMatch[1])
              deviceDetails.memory_total = `${(kb / 1024 / 1024).toFixed(1)} GB`
            }
          } else if (line.startsWith("MemAvailable:")) {
            const kbMatch = line.match(/(\d+)/)
            if (kbMatch) {
              const kb = parseInt(kbMatch[1])
              deviceDetails.memory_available = `${(kb / 1024 / 1024).toFixed(1)} GB`
            }
          }
        }
      } catch (e) {
        console.warn("Failed to get memory info:", e)
      }

      // 获取存储信息
      try {
        const storageOutput = await executeAdbCommand(deviceId, ["shell", "df", "/data"])
        const lines = storageOutput.split("\n")
        if (lines.length > 1) {
          const parts = lines[1].trim().split(/\s+/)
          if (parts.length >= 4) {
            const totalKb = parseInt(parts[1])
            const availableKb = parseInt(parts[3])
            if (!isNaN(totalKb) && !isNaN(availableKb)) {
              deviceDetails.storage_total = `${(totalKb / 1024 / 1024).toFixed(1)} GB`
              deviceDetails.storage_available = `${(availableKb / 1024 / 1024).toFixed(1)} GB`
            }
          }
        }
      } catch (e) {
        console.warn("Failed to get storage info:", e)
      }

      // 获取屏幕信息
      try {
        const screenOutput = await executeAdbCommand(deviceId, ["shell", "wm", "size"])
        for (const line of screenOutput.split("\n")) {
          if (line.includes("Physical size:")) {
            deviceDetails.screen_resolution = line.split(":")[1]?.trim()
            break
          }
        }
      } catch (e) {
        console.warn("Failed to get screen resolution:", e)
      }

      try {
        const densityOutput = await executeAdbCommand(deviceId, ["shell", "wm", "density"])
        for (const line of densityOutput.split("\n")) {
          if (line.includes("Physical density:")) {
            deviceDetails.screen_density = line.split(":")[1]?.trim()
            break
          }
        }
      } catch (e) {
        console.warn("Failed to get screen density:", e)
      }

      // 获取CPU信息
      try {
        const cpuOutput = await executeAdbCommand(deviceId, ["shell", "cat", "/proc/cpuinfo"])
        let cpuCount = 0
        for (const line of cpuOutput.split("\n")) {
          if (line.startsWith("processor")) {
            cpuCount++
          }
        }
        if (cpuCount > 0) {
          deviceDetails.cpu_info = `${cpuCount} 核心`
        }
      } catch (e) {
        console.warn("Failed to get CPU info:", e)
      }

      setDetails(deviceDetails)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setDetails(null)
    } finally {
      setLoading(false)
    }
  }, [deviceId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    details,
    loading,
    error,
    refresh,
  }
}
