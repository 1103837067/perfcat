import { useMutation, useQueryClient } from "@tanstack/react-query"
import Database from "@tauri-apps/plugin-sql"
import { toast } from "sonner"
import type { CreateReportInput, Report } from "@/types/report"

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

// 创建报告
async function createReport(input: CreateReportInput): Promise<Report> {
  await initDatabase()
  const db = await Database.load(DB_NAME)

  const result = await db.execute(
    `INSERT INTO reports (
      name, device_id, device_model, app_package, app_label,
      metrics, chart_data, start_time, end_time, duration
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      input.name,
      input.device_id,
      input.device_model ?? null,
      input.app_package,
      input.app_label ?? null,
      JSON.stringify(input.metrics),
      JSON.stringify(input.chart_data),
      input.start_time,
      input.end_time,
      input.duration,
    ]
  )

  const reports = await db.select<Report[]>("SELECT * FROM reports WHERE id = $1", [
    result.lastInsertId,
  ])

  return reports[0]
}

// 删除报告
async function deleteReport(id: number): Promise<void> {
  await initDatabase()
  const db = await Database.load(DB_NAME)
  await db.execute("DELETE FROM reports WHERE id = $1", [id])
}

export function useCreateReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      toast.success("报告保存成功")
    },
    onError: error => {
      toast.error(`保存失败: ${error.message}`)
    },
  })
}

export function useDeleteReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] })
      toast.success("报告删除成功")
    },
    onError: error => {
      toast.error(`删除失败: ${error.message}`)
    },
  })
}
