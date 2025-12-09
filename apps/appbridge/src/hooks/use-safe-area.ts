import { useEffect, useState } from "react"

/**
 * Hook to get safe area insets for mobile devices
 * Returns the top inset (status bar height) for Android/iOS
 */
export function useSafeArea() {
  const [topInset, setTopInset] = useState(0)

  useEffect(() => {
    // Try to get safe area inset from CSS env variable
    const getSafeAreaTop = () => {
      // Create a temporary element to measure safe area
      const testEl = document.createElement("div")
      testEl.style.position = "fixed"
      testEl.style.top = "0"
      testEl.style.height = "env(safe-area-inset-top)"
      testEl.style.visibility = "hidden"
      document.body.appendChild(testEl)
      
      const computedHeight = getComputedStyle(testEl).height
      const height = parseFloat(computedHeight) || 0
      document.body.removeChild(testEl)
      
      return height
    }

    // Get initial value
    const initialInset = getSafeAreaTop()
    if (initialInset > 0) {
      setTopInset(initialInset)
    } else {
      // Fallback: Use a reasonable default for Android status bar
      // Android status bar is typically 24-48px depending on device
      setTopInset(24)
    }

    // Listen for orientation changes
    const handleResize = () => {
      const newInset = getSafeAreaTop()
      if (newInset > 0) {
        setTopInset(newInset)
      }
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
    }
  }, [])

  return { topInset }
}

