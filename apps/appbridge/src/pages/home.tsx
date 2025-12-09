import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { getDeviceInfo } from "tauri-plugin-bridge-core-api"

export function HomePage() {
  const [deviceInfo, setDeviceInfo] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        setLoading(true)
        const info = await getDeviceInfo()
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

  if (loading) {
    return (
      <main className="flex flex-1 overflow-y-auto p-6">
        <div className="w-full">
          <p className="text-muted-foreground">加载设备信息中...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-1 overflow-y-auto p-6">
        <div className="w-full">
          <p className="text-destructive">错误: {error}</p>
        </div>
      </main>
    )
  }

  if (!deviceInfo) {
    return null
  }

  return (
    <main className="flex flex-1 overflow-y-auto p-6">
      <div className="w-full max-w-6xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold mb-4">设备信息 (Raw JSON)</h2>

        <Card className="p-4">
          <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words">
            {JSON.stringify(deviceInfo, null, 2)}
          </pre>
        </Card>
      </div>
    </main>
  )
}
