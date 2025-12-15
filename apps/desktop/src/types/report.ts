import type { MetricKey } from "./adb"

export type ReportChartData = Array<Record<string, number | string>>

export interface Report {
  id: number
  name: string
  device_id: string
  device_model: string | null
  app_package: string
  app_label: string | null
  metrics: string // JSON string of MetricKey[]
  chart_data: string // JSON string of ReportChartData
  start_time: number
  end_time: number
  duration: number
  created_at: number
}

export interface CreateReportInput {
  name: string
  device_id: string
  device_model?: string | null
  app_package: string
  app_label?: string | null
  metrics: MetricKey[]
  chart_data: ReportChartData
  start_time: number
  end_time: number
  duration: number
}
