import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { MetricKey, MetricsSnapshot } from "@/types/adb"

const METRIC_KEYS: MetricKey[] = ["cpu", "memory", "power", "traffic", "fps"]
const DEFAULT_METRICS: MetricKey[] = ["cpu"]

interface MonitoringState {
  selectedApp: string
  selectedMetrics: MetricKey[]
  chartData: Array<Record<string, number | string>>
  startTime: number | null
  running: boolean
  // metrics数据统一在store中管理
  metrics: MetricsSnapshot | null
  metricsError: string | null
  setSelectedApp: (app: string) => void
  setSelectedMetrics: (metrics: MetricKey[]) => void
  setChartData: (
    data:
      | Array<Record<string, number | string>>
      | ((prev: Array<Record<string, number | string>>) => Array<Record<string, number | string>>)
  ) => void
  setStartTime: (time: number | null) => void
  setRunning: (running: boolean) => void
  setMetrics: (metrics: MetricsSnapshot | null) => void
  setMetricsError: (error: string | null) => void
  resetMonitoring: () => void
  resetChartData: () => void
}

const STORAGE_KEYS = {
  app: "PerfX:selected_app",
  metrics: "PerfX:selected_metrics",
}

function readStoredApp(): string {
  if (typeof window === "undefined") return ""
  return window.localStorage.getItem(STORAGE_KEYS.app) ?? ""
}

function readStoredMetrics(): MetricKey[] {
  if (typeof window === "undefined") return DEFAULT_METRICS
  try {
    const saved = window.localStorage.getItem(STORAGE_KEYS.metrics)
    if (!saved) return DEFAULT_METRICS
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed)) {
      const valid = parsed.filter((m: string): m is MetricKey =>
        METRIC_KEYS.includes(m as MetricKey)
      )
      if (valid.length) return valid
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_METRICS
}

export const useMonitoringStore = create<MonitoringState>()(
  persist(
    set => ({
      selectedApp: readStoredApp(),
      selectedMetrics: readStoredMetrics(),
      chartData: [],
      startTime: null,
      running: false,
      metrics: null,
      metricsError: null,
      setSelectedApp: app => set({ selectedApp: app }),
      setSelectedMetrics: metrics => set({ selectedMetrics: metrics }),
      setChartData: data =>
        set(state => ({
          chartData: typeof data === "function" ? data(state.chartData) : data,
        })),
      setStartTime: time => set({ startTime: time }),
      setRunning: running => {
        console.log("setRunning调用", running, "当前state:", useMonitoringStore.getState())
        set({ running })
        console.log("setRunning调用后，state:", useMonitoringStore.getState())
      },
      setMetrics: metrics => set({ metrics, metricsError: null }),
      setMetricsError: error => set({ metricsError: error }),
      resetChartData: () =>
        set({
          chartData: [],
        }),
      resetMonitoring: () =>
        set({
          chartData: [],
          startTime: null,
          running: false,
          metrics: null,
          metricsError: null,
        }),
    }),
    {
      name: "perfX-monitoring-store",
      partialize: state => ({
        selectedApp: state.selectedApp,
        selectedMetrics: state.selectedMetrics,
      }),
    }
  )
)
