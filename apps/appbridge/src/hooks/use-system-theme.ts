import { useEffect } from "react"

/**
 * Hook to automatically sync theme with system preference
 * For Android/mobile devices, this listens to prefers-color-scheme changes
 */
export function useSystemTheme() {
  useEffect(() => {
    const root = document.documentElement

    // Function to update theme based on system preference
    const updateTheme = () => {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (isDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }

    // Set initial theme
    updateTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", updateTheme)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", updateTheme)
    }
  }, [])
}

