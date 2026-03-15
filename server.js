import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import { homedir } from 'os'
import { join } from 'path'
import { randomUUID } from 'crypto'

const app = express()
const DB_PATH = join(homedir(), 'tasks.db')
const db = new Database(DB_PATH)

// Create table — assignees and prepSteps stored as JSON strings
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL DEFAULT '',
    dueDate     TEXT DEFAULT '',
    time        TEXT DEFAULT 'All day',
    category    TEXT DEFAULT 'Other',
    assignees   TEXT DEFAULT '[]',
    status      TEXT DEFAULT 'todo',
    notes       TEXT DEFAULT '',
    prepSteps   TEXT DEFAULT '[]',
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now'))
  )
`)

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }))
app.use(express.json())

function deserialize(row) {
  if (!row) return null
  return {
    ...row,
    assignees: JSON.parse(row.assignees || '[]'),
    prepSteps: JSON.parse(row.prepSteps || '[]'),
  }
}

// GET all tasks
app.get('/api/tasks', (_req, res) => {
  const rows = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all()
  res.json(rows.map(deserialize))
})

// POST create task
app.post('/api/tasks', (req, res) => {
  const t = req.body
  const id = t.id || randomUUID()
  db.prepare(`
    INSERT OR REPLACE INTO tasks (id, title, dueDate, time, category, assignees, status, notes, prepSteps, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    t.title || '',
    t.dueDate || '',
    t.time || 'All day',
    t.category || 'Other',
    JSON.stringify(t.assignees || []),
    t.status || 'todo',
    t.notes || '',
    JSON.stringify(t.prepSteps || []),
    t.created_at || new Date().toISOString()
  )
  res.status(201).json(deserialize(db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)))
})

// POST bulk import (localStorage migration)
app.post('/api/tasks/bulk', (req, res) => {
  const { tasks } = req.body
  if (!Array.isArray(tasks) || tasks.length === 0) return res.json({ imported: 0 })

  const insert = db.prepare(`
    INSERT OR REPLACE INTO tasks (id, title, dueDate, time, category, assignees, status, notes, prepSteps, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  db.transaction((list) => {
    for (const t of list) {
      insert.run(
        t.id || randomUUID(),
        t.title || '',
        t.dueDate || '',
        t.time || 'All day',
        t.category || 'Other',
        JSON.stringify(t.assignees || []),
        t.status || 'todo',
        t.notes || '',
        JSON.stringify(t.prepSteps || []),
        t.created_at || t.createdAt || new Date().toISOString()
      )
    }
  })(tasks)

  console.log(`✅ Migrated ${tasks.length} tasks from browser localStorage → SQLite`)
  res.json({ imported: tasks.length })
})

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Task not found' })

  const t = req.body
  db.prepare(`
    UPDATE tasks SET
      title = ?, dueDate = ?, time = ?, category = ?,
      assignees = ?, status = ?, notes = ?, prepSteps = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    t.title      ?? existing.title,
    t.dueDate    ?? existing.dueDate,
    t.time       ?? existing.time,
    t.category   ?? existing.category,
    JSON.stringify(t.assignees  ?? JSON.parse(existing.assignees  || '[]')),
    t.status     ?? existing.status,
    t.notes      ?? existing.notes,
    JSON.stringify(t.prepSteps  ?? JSON.parse(existing.prepSteps  || '[]')),
    req.params.id
  )
  res.json(deserialize(db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id)))
})

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Task server → http://localhost:${PORT}`)
  console.log(`📦 SQLite DB  → ${DB_PATH}`)
})
