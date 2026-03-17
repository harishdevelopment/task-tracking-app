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
}
