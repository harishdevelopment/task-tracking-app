const BASE = '/api'

export const api = {
  getTasks: () =>
    fetch(`${BASE}/tasks`).then((r) => r.json()),

  createTask: (task) =>
    fetch(`${BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then((r) => r.json()),

  updateTask: (id, updates) =>
    fetch(`${BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).then((r) => r.json()),

  deleteTask: (id) =>
    fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' }).then((r) => r.json()),

  /**
   * Reads tasks from localStorage (key: 'task-tracker-tasks') and
   * posts them to the server in one bulk call. Runs only once — marks
   * completion with a separate localStorage flag so it never re-runs.
   */
  migrateFromLocalStorage: async () => {
    if (localStorage.getItem('__tasks_migrated_to_sqlite')) return 0
    try {
      const raw = localStorage.getItem('task-tracker-tasks')
      const list = raw ? JSON.parse(raw) : []
      if (!Array.isArray(list) || list.length === 0) {
        localStorage.setItem('__tasks_migrated_to_sqlite', '1')
        return 0
      }
      const { imported } = await fetch(`${BASE}/tasks/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: list }),
      }).then((r) => r.json())
      localStorage.setItem('__tasks_migrated_to_sqlite', '1')
      return imported
    } catch (err) {
      console.error('Migration error:', err)
      return 0
    }
  },
}
