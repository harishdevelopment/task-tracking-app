# Architecture: PlanTrack

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19 + Vite | JSX, no TypeScript (`.jsx` files) |
| Styling | Plain CSS (`App.css`, `index.css`) | No CSS framework — custom class names |
| Backend | Express 5 (Node.js) | `server.js` at repo root |
| Database | SQLite via `better-sqlite3` | DB file at `~/tasks.db` (user home dir) |
| Dev runner | `concurrently` | Runs Vite + Express side-by-side |

## Directory Layout

```
/
├── docs/                        # Product & architecture specs (this folder)
│   ├── product.md
│   └── architecture.md
├── src/
│   ├── features/                # Spec files per feature
│   │   ├── tasks/tasks.spec.md
│   │   ├── calendar/calendar.spec.md
│   │   ├── prep-plan/prep-plan.spec.md
│   │   └── notifications/notifications.spec.md
│   ├── components/              # React UI components
│   │   ├── EventList.jsx        # Master list of tasks with filters
│   │   ├── TaskForm.jsx         # Create / edit task modal
│   │   ├── TaskTiles.jsx        # Summary tile cards (status counts)
│   │   ├── CalendarView.jsx     # Monthly calendar grid
│   │   ├── PrepPlan.jsx         # Preparation plan cards per task
│   │   └── NotificationSetup.jsx# Browser notification permission + daily alert
│   ├── hooks/
│   │   └── useTasks.js          # Central data hook — all API calls, state, helpers
│   ├── App.jsx                  # Root component — layout, routing between views
│   ├── App.css                  # All app-level styles
│   └── main.jsx                 # React entry point
├── public/
├── server.js                    # Express API + SQLite schema + all REST endpoints
├── vite.config.js
├── eslint.config.js
└── package.json
```

## Data Model

Single `tasks` table in SQLite. Complex fields are JSON-serialised.

```sql
CREATE TABLE tasks (
  id          TEXT PRIMARY KEY,          -- UUID
  title       TEXT NOT NULL DEFAULT '',
  dueDate     TEXT DEFAULT '',           -- ISO date string YYYY-MM-DD
  time        TEXT DEFAULT 'All day',
  category    TEXT DEFAULT 'Other',      -- Family | Social | Event | Work | Health | Other
  assignees   TEXT DEFAULT '[]',         -- JSON array of name strings
  status      TEXT DEFAULT 'todo',       -- todo | in-progress | done
  notes       TEXT DEFAULT '',
  prepSteps   TEXT DEFAULT '[]',         -- JSON array of { id, text, done } objects
  created_at  TEXT DEFAULT (datetime('now')),
  updated_at  TEXT DEFAULT (datetime('now'))
)
```

> AI-generated prep plans are stored inside `prepSteps` on the task row — no separate table.

## API Endpoints

All endpoints served by `server.js` on port **3001** (proxied from Vite on 5173).

| Method | Path | Description |
|---|---|---|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task (including toggling prep steps) |
| DELETE | `/api/tasks/:id` | Delete task |

## Frontend Data Flow

```
App.jsx
  └── useTasks.js (hook)
        ├── fetchTasks()  → GET /api/tasks  → tasks[]
        ├── addTask()     → POST /api/tasks
        ├── updateTask()  → PUT /api/tasks/:id
        ├── deleteTask()  → DELETE /api/tasks/:id
        └── togglePrepStep() → PUT /api/tasks/:id (patches prepSteps array)

Components receive tasks[] as props and call action callbacks.
No global state manager — all state lives in useTasks.js via useState.
```

## Key Design Decisions

- **No TypeScript** — project uses `.jsx` and `.js` only. Do not add `.ts`/`.tsx` files.
- **No CSS framework** — styles are written in `App.css`; do not add Tailwind, Bootstrap, or similar.
- **No auth** — single user, no session or token management.
- **JSONified arrays** — `assignees` and `prepSteps` are stored as JSON strings in SQLite; deserialised in `deserialize()` in `server.js`.
- **DB location** — `~/tasks.db` (user home directory); keeps the project dir clean.
- **Vite proxy** — `/api` requests are proxied from port 5173 → 3001 via `vite.config.js`.

## Urgency Color Coding

| Days until due | Class / Label |
|---|---|
| < 0 | `urgency-overdue` / red (past due) |
| 0–1 | `urgency-urgent` / red |
| 2–3 | `urgency-soon` / amber |
| 4+ | `urgency-normal` / green |
