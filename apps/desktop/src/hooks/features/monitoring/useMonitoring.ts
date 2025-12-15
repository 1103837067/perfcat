import { useMonitoringDataCollection } from "./useMonitoringDataCollection"
import { useMonitoringControl } from "./useMonitoringControl"
import { useMonitoringStore } from "@/stores/use-monitoring-store"
import { useAdbMetrics } from "@/hooks/queries/useAdbMetrics"

/**
 * 监控功能主hook
 * 整合监控相关的所有逻辑，提供统一的API
 * 所有状态统一在store中管理，确保状态同步
 */
export function useMonitoring() {
  // 获取控制函数（start/stop逻辑）
  const { start, stop } = useAdbMetrics()

  // 获取控制函数（业务逻辑）
  const { handleStart, handleStop } = useMonitoringControl(start, stop)

  // 初始化数据收集（从store读取metrics）
  useMonitoringDataCollection()

  // 获取状态（统一从store获取，单一数据源）
  const running = useMonitoringStore(state => state.running)
  const selectedApp = useMonitoringStore(state => state.selectedApp)
  const selectedMetrics = useMonitoringStore(state => state.selectedMetrics)
  const chartData = useMonitoringStore(state => state.chartData)
  const startTime = useMonitoringStore(state => state.startTime)
  const metrics = useMonitoringStore(state => state.metrics)
  const metricsError = useMonitoringStore(state => state.metricsError)

  return {
    // 状态（全部来自store，单一数据源）
    selectedApp,
    selectedMetrics,
    chartData,
    startTime,
    running,
    metrics,
    error: metricsError,
    // 操作
    handleStart,
    handleStop,
  }
}
