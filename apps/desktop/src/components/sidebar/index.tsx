import { DeviceSelect } from "./DeviceSelect"
import { AppSelect } from "./AppSelect"
import { MetricSelector } from "./MetricSelector"
import { CommandBar } from "./CommandBar"
import type { AdbApp, AdbDevice, MetricKey } from "@/types/adb"

interface Props {
  deviceId: string
  devices: AdbDevice[]
  deviceSearch: string
  loadingDevices: boolean
  onDeviceChange: (value: string) => void
  onDeviceSearch: (value: string) => void
  onRefreshDevices: () => void

  appId: string
  apps: AdbApp[]
  appSearch: string
  loadingApps: boolean
  appError?: string | null
  onRefreshApps: () => void
  onAppChange: (value: string) => void
  onAppSearch: (value: string) => void

  metrics: MetricKey[]
  onMetricsChange: (value: MetricKey[]) => void

  running: boolean
  onStart: () => void
  onStop: () => void
}

export function Sidebar(props: Props) {
  const {
    deviceId,
    devices,
    deviceSearch,
    loadingDevices,
    onDeviceChange,
    onDeviceSearch,
    onRefreshDevices,
    appId,
    apps,
    appSearch,
    loadingApps,
    appError,
    onRefreshApps,
    onAppChange,
    onAppSearch,
    metrics,
    onMetricsChange,
    running,
    onStart,
    onStop,
  } = props

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background p-4 space-y-4">
      <DeviceSelect
        value={deviceId}
        devices={devices}
        search={deviceSearch}
        loading={loadingDevices}
        onChange={onDeviceChange}
        onSearch={onDeviceSearch}
        onRefresh={onRefreshDevices}
      />

      <AppSelect
        value={appId}
        apps={apps}
        search={appSearch}
        loading={loadingApps}
        error={appError}
        onRefresh={onRefreshApps}
        disabled={!deviceId}
        onChange={onAppChange}
        onSearch={onAppSearch}
      />

      <CommandBar
        disabled={!deviceId || !appId || metrics.length === 0}
        running={running}
        onStart={onStart}
        onStop={onStop}
        metricSelector={<MetricSelector value={metrics} onChange={onMetricsChange} disabled={running} />}
      />
    </aside>
  )
}

