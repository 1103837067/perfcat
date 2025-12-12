import { invoke } from "@tauri-apps/api/core"
import type { AdbApp, AdbDevice, MetricKey, MetricsSnapshot } from "@/types/adb"

export async function listDevices() {
  return invoke<AdbDevice[]>("tauri_list_devices")
}

export async function listApps(deviceId: string, keyword?: string) {
  return invoke<AdbApp[]>("tauri_list_apps", {
    payload: {
      device_id: deviceId,
      keyword,
    },
  })
}

export interface MetricsPayload {
  deviceId: string
  packageName: string
  metrics: MetricKey[]
}

export async function getMetrics(payload: MetricsPayload) {
  return invoke<MetricsSnapshot>("tauri_get_metrics", {
    payload: {
      device_id: payload.deviceId,
      package: payload.packageName,
      metrics: payload.metrics,
    },
  })
}

export async function setAdbPath(path?: string) {
  return invoke<void>("tauri_set_adb_path", { path })
}
