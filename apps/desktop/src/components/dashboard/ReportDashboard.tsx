import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { MetricKey } from "@/types/adb"
import type { ReportChartData } from "@/types/report"

interface ReportDashboardProps {
  chartData: ReportChartData
  metrics: MetricKey[]
}

interface StatItem {
  metric: string
  label: string
  dataKey: string
  avg: number
  max: number
  min: number
  count: number
}

export function ReportDashboard({ chartData, metrics }: ReportDashboardProps) {
  const stats: StatItem[] = []

  if (metrics.includes("cpu") && chartData.length > 0) {
    const values = chartData
      .map(d => d.cpu)
      .filter((v): v is number => typeof v === "number" && !isNaN(v))
    if (values.length > 0) {
      stats.push({
        metric: "cpu",
        label: "CPU",
        dataKey: "cpu",
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        max: Math.max(...values),
        min: Math.min(...values),
        count: values.length,
      })
    }
  }

  if (metrics.includes("fps") && chartData.length > 0) {
    const values = chartData
      .map(d => d.fps)
      .filter((v): v is number => typeof v === "number" && !isNaN(v))
    if (values.length > 0) {
      stats.push({
        metric: "fps",
        label: "FPS",
        dataKey: "fps",
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        max: Math.max(...values),
        min: Math.min(...values),
        count: values.length,
      })
    }
  }

  if (metrics.includes("memory") && chartData.length > 0) {
    const values = chartData
      .map(d => d.memory)
      .filter((v): v is number => typeof v === "number" && !isNaN(v))
    if (values.length > 0) {
      stats.push({
        metric: "memory",
        label: "内存 (MB)",
        dataKey: "memory",
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        max: Math.max(...values),
        min: Math.min(...values),
        count: values.length,
      })
    }
  }

  if (metrics.includes("power") && chartData.length > 0) {
    const powerValues = chartData
      .map(d => d.power)
      .filter((v): v is number => typeof v === "number" && !isNaN(v))
    if (powerValues.length > 0) {
      stats.push({
        metric: "power",
        label: "功耗 (mA)",
        dataKey: "power",
        avg: powerValues.reduce((a, b) => a + b, 0) / powerValues.length,
        max: Math.max(...powerValues),
        min: Math.min(...powerValues),
        count: powerValues.length,
      })
    }

    const batteryValues = chartData
      .map(d => d.battery)
      .filter((v): v is number => typeof v === "number" && !isNaN(v))
    if (batteryValues.length > 0) {
      stats.push({
        metric: "battery",
        label: "电量 (%)",
        dataKey: "battery",
        avg: batteryValues.reduce((a, b) => a + b, 0) / batteryValues.length,
        max: Math.max(...batteryValues),
        min: Math.min(...batteryValues),
        count: batteryValues.length,
      })
    }
  }

  if (metrics.includes("traffic") && chartData.length > 0) {
    const rxValues = chartData
      .map(d => d.traffic_rx)
      .filter((v): v is number => typeof v === "number" && !isNaN(v))
    if (rxValues.length > 0) {
      stats.push({
        metric: "traffic_rx",
        label: "下行流量 (KB/s)",
        dataKey: "traffic_rx",
        avg: rxValues.reduce((a, b) => a + b, 0) / rxValues.length,
        max: Math.max(...rxValues),
        min: Math.min(...rxValues),
        count: rxValues.length,
      })
    }

    const txValues = chartData
      .map(d => d.traffic_tx)
      .filter((v): v is number => typeof v === "number" && !isNaN(v))
    if (txValues.length > 0) {
      stats.push({
        metric: "traffic_tx",
        label: "上行流量 (KB/s)",
        dataKey: "traffic_tx",
        avg: txValues.reduce((a, b) => a + b, 0) / txValues.length,
        max: Math.max(...txValues),
        min: Math.min(...txValues),
        count: txValues.length,
      })
    }
  }

  const formatNumber = (value: number) => {
    if (Math.abs(value) >= 100) return value.toFixed(0)
    return value.toFixed(1)
  }

  if (stats.length === 0) {
    return <div className="text-sm text-muted-foreground py-4">暂无统计数据</div>
  }

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">指标</TableHead>
            <TableHead className="text-right">平均值</TableHead>
            <TableHead className="text-right">最大值</TableHead>
            <TableHead className="text-right">最小值</TableHead>
            <TableHead className="text-right">数据点数</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map(stat => (
            <TableRow key={stat.metric}>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {stat.label}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-sm">{formatNumber(stat.avg)}</TableCell>
              <TableCell className="text-right text-sm">{formatNumber(stat.max)}</TableCell>
              <TableCell className="text-right text-sm">{formatNumber(stat.min)}</TableCell>
              <TableCell className="text-right text-sm">{stat.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
