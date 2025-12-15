import { useEffect, useRef } from "react"
import { useMonitoringStore } from "@/stores/use-monitoring-store"

/**
 * Hook负责收集监控数据并更新到store
 * 只负责数据收集，不负责状态同步
 * metrics数据统一从store读取，确保单一数据源
 */
export function useMonitoringDataCollection() {
  const { setChartData, resetChartData, running, metrics } = useMonitoringStore()
  const lastValuesRef = useRef<{
    fps?: number
    cpu?: number
    power?: number
    memory?: number
    battery?: number
    battery_temp?: number
    traffic_rx?: number
    traffic_tx?: number
  }>({})
  const prevRunningRef = useRef<boolean>(false)

  // 监控开始时重置数据（只在从false变为true时重置）
  useEffect(() => {
    if (running && !prevRunningRef.current) {
      resetChartData()
      lastValuesRef.current = {}
    }
    prevRunningRef.current = running
  }, [running, resetChartData])

  // 收集实时指标历史
  useEffect(() => {
    if (!metrics || !running) return

    const now = Date.now()
    const timeLabel = new Date(now).toLocaleTimeString("zh-CN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    // 更新最新值（有值才覆盖）
    if (metrics.fps !== null && metrics.fps !== undefined) lastValuesRef.current.fps = metrics.fps
    if (metrics.cpu !== null && metrics.cpu !== undefined) lastValuesRef.current.cpu = metrics.cpu
    if (metrics.power !== null && metrics.power !== undefined)
      lastValuesRef.current.power = metrics.power
    if (metrics.memory_mb !== null && metrics.memory_mb !== undefined)
      lastValuesRef.current.memory = metrics.memory_mb
    if (metrics.battery_level !== null && metrics.battery_level !== undefined)
      lastValuesRef.current.battery = metrics.battery_level
    if (metrics.battery_temp_c !== null && metrics.battery_temp_c !== undefined)
      lastValuesRef.current.battery_temp = metrics.battery_temp_c

    // 流量：优先使用速率（bps），转换为 KB/s
    const rxKbps =
      metrics.rx_bps !== null && metrics.rx_bps !== undefined ? metrics.rx_bps / 1024 : undefined
    const txKbps =
      metrics.tx_bps !== null && metrics.tx_bps !== undefined ? metrics.tx_bps / 1024 : undefined

    if (rxKbps !== undefined) lastValuesRef.current.traffic_rx = rxKbps
    if (txKbps !== undefined) lastValuesRef.current.traffic_tx = txKbps

    const { fps, cpu, power, memory, battery, battery_temp, traffic_rx, traffic_tx } =
      lastValuesRef.current

    // 仅当至少有一个有效值时记录
    if (
      [fps, cpu, power, memory, battery, battery_temp, traffic_rx, traffic_tx].some(
        v => v !== undefined
      )
    ) {
      const newDataPoint = {
        time: timeLabel,
        fps: fps ?? 0,
        cpu: cpu ?? 0,
        power: power ?? 0,
        memory: memory ?? 0,
        battery: battery ?? 0,
        battery_temp: battery_temp ?? 0,
        traffic_rx: traffic_rx ?? 0,
        traffic_tx: traffic_tx ?? 0,
      }

      setChartData(prev => {
        const newData = [...prev, newDataPoint].slice(-600)
        return newData
      })
    }
  }, [metrics, running, setChartData])
}
