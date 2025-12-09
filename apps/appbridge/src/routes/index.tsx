import { createBrowserRouter } from "react-router-dom"
import { MainLayout } from "@/components/layouts/main-layout"
import { HomePage } from "@/pages/home"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
])
