import { useQuery } from "@tanstack/react-query"
import Database from "@tauri-apps/plugin-sql"
import type { Todo } from "@/types/todo"

const DB_NAME = "sqlite:todos.db"

// 初始化数据库
async function initDatabase() {
  const db = await Database.load(DB_NAME)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `)

  return db
}

// 获取所有 todos
async function getTodos(): Promise<Todo[]> {
  const db = await Database.load(DB_NAME)
  const todos = await db.select<Todo[]>("SELECT * FROM todos ORDER BY created_at DESC")
  return todos
}

export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      await initDatabase()
      return getTodos()
    },
  })
}
