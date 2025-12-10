import { useCallback, useEffect, useMemo, useState } from "react"
import { listDevices } from "@/lib/tauri-adb"
import type { AdbDevice } from "@/types/adb"

export function useAdbDevices() {
  const [devices, setDevices] = useState<AdbDevice[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const result = await listDevices()
      setDevices(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const filtered = useMemo(() => {
    if (!search.trim()) return devices
    const keyword = search.trim().toLowerCase()
    return devices.filter(
      (d) =>
        d.id.toLowerCase().includes(keyword) ||
        (d.model?.toLowerCase().includes(keyword) ?? false)
    )
  }, [devices, search])

  return {
    devices: filtered,
    rawDevices: devices,
    search,
    setSearch,
    loading,
    error,
    refresh,
  }
}

