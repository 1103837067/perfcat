import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AdbDevice } from "@/types/adb"

interface DeviceState {
  selectedDevice: AdbDevice | null
  setSelectedDevice: (device: AdbDevice | null) => void
}

const STORAGE_KEYS = {
  device: "PerfX:selected_device",
}

function readStoredDevice(): AdbDevice | null {
  if (typeof window === "undefined") return null
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.device)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (parsed && typeof parsed === "object" && parsed.id) {
      return parsed as AdbDevice
    }
  } catch {
    // ignore parse errors
  }
  return null
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    set => ({
      selectedDevice: readStoredDevice(),
      setSelectedDevice: device => set({ selectedDevice: device }),
    }),
    {
      name: "perfX-device-store",
      partialize: state => ({
        selectedDevice: state.selectedDevice,
      }),
    }
  )
)
