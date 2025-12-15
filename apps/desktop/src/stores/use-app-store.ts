import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AppState {
  theme: "light" | "dark"
  activeTab: string
  setTheme: (theme: "light" | "dark") => void
  setActiveTab: (tab: string) => void
}

const STORAGE_KEYS = {
  theme: "PerfX:theme",
}

function readStoredTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.theme)
    if (stored === "dark" || stored === "light") {
      return stored
    }
  } catch {
    // ignore parse errors
  }
  return "light"
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      theme: readStoredTheme(),
      activeTab: "performance",
      setTheme: theme => set({ theme }),
      setActiveTab: tab => set({ activeTab: tab }),
    }),
    {
      name: "perfX-app-store",
      partialize: state => ({
        theme: state.theme,
      }),
    }
  )
)
