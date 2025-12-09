import { create } from "zustand"

interface AppState {
  // 主题现在由系统自动管理，不需要手动切换
}

export const useAppStore = create<AppState>(() => ({}))
