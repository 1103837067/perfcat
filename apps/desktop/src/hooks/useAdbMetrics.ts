import { useCallback, useEffect, useRef, useState } from "react"
import { getMetrics } from "@/lib/tauri-adb"
import type { MetricKey, MetricsSnapshot } from "@/types/adb"

export interface StartMonitorPayload {
  deviceId: string
  packageName: string
  metrics: MetricKey[]
  intervalMs?: number
}

export function useAdbMetrics() {
  const [data, setData] = useState<MetricsSnapshot | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  const stop = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    setRunning(false)
  }, [])

  const tick = useCallback(async (payload: StartMonitorPayload) => {
    try {
      const result = await getMetrics({
        deviceId: payload.deviceId,
        packageName: payload.packageName,
        metrics: payload.metrics,
      })
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [])

  const start = useCallback(
    (payload: StartMonitorPayload) => {
      stop()
      const interval = payload.intervalMs ?? 1000
      setRunning(true)
      void tick(payload)
      timerRef.current = window.setInterval(() => {
        void tick(payload)
      }, interval)
    },
    [stop, tick]
  )

  useEffect(() => {
    return () => stop()
  }, [stop])

  return {
    data,
    running,
    error,
    start,
    stop,
  }
}
