import { useCallback, useEffect, useRef } from "react"
import { getMetrics } from "@/lib/tauri-adb"
import { useMonitoringStore } from "@/stores/use-monitoring-store"
import type { MetricKey } from "@/types/adb"

export interface StartMonitorPayload {
  deviceId: string
  packageName: string
  metrics: MetricKey[]
  intervalMs?: number
}

/**
 * Hook负责ADB指标数据获取逻辑
 * 数据统一在store中管理，避免多个实例导致的状态不同步
 */
export function useAdbMetrics() {
  const { setMetrics, setMetricsError } = useMonitoringStore()
  const timerRef = useRef<number | null>(null)

  const stop = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const tick = useCallback(
    async (payload: StartMonitorPayload) => {
      try {
        const result = await getMetrics({
          deviceId: payload.deviceId,
          packageName: payload.packageName,
          metrics: payload.metrics,
        })
        setMetrics(result)
        setMetricsError(null)
      } catch (err) {
        setMetricsError(err instanceof Error ? err.message : String(err))
      }
    },
    [setMetrics, setMetricsError]
  )

  const start = useCallback(
    (payload: StartMonitorPayload) => {
      stop()
      const interval = payload.intervalMs ?? 1000
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
    start,
    stop,
  }
}
