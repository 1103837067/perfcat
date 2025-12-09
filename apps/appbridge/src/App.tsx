import { RouterProvider } from "react-router-dom"
import { QueryProvider } from "@/components/providers/query-provider"
import { Toaster } from "@/components/ui/sonner"
import { router } from "@/routes"
import { useSystemTheme } from "@/hooks/use-system-theme"

function App() {
  // Automatically sync theme with system preference
  useSystemTheme()

  return (
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </QueryProvider>
  )
}

export default App
