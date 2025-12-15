import { useQuery } from "@tanstack/react-query"
import Database from "@tauri-apps/plugin-sql"
import type { Report } from "@/types/report"

const DB_NAME = "sqlite:reports.db"

// 初始化数据库
async function initDatabase() {
  const db = await Database.load(DB_NAME)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      device_id TEXT NOT NULL,
      device_model TEXT,
      app_package TEXT NOT NULL,
      app_label TEXT,
      metrics TEXT NOT NULL,
      chart_data TEXT NOT NULL,
      start_time INTEGER NOT NULL,
      end_time INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `)

  return db
}

// 获取所有报告
async function getReports(): Promise<Report[]> {
  const db = await Database.load(DB_NAME)
  const reports = await db.select<Report[]>("SELECT * FROM reports ORDER BY created_at DESC")
  return reports
}

// 获取单个报告
async function getReport(id: number): Promise<Report> {
  const db = await Database.load(DB_NAME)
  const reports = await db.select<Report[]>("SELECT * FROM reports WHERE id = $1", [id])
  if (reports.length === 0) {
    throw new Error("Report not found")
  }
  return reports[0]
}

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      await initDatabase()
      return getReports()
    },
  })
}

export function useReport(id: number | null) {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: async () => {
      if (!id) throw new Error("Report ID is required")
      await initDatabase()
      return getReport(id)
    },
    enabled: !!id,
  })
}
