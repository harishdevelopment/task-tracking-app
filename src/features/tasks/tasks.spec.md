# Feature Spec: Tasks

> Related product context: [docs/product.md](../../../docs/product.md)  
> Architecture context: [docs/architecture.md](../../../docs/architecture.md)

## Purpose

The Tasks feature is the core of PlanTrack. It allows the user to create, read, update, and delete tasks (events/deadlines), assign people to them, and track their lifecycle status. All task data is persisted in a SQLite database (`~/tasks.db`) via the Express API — data survives page refreshes and browser restarts.

## Storage

Tasks are stored server-side in SQLite (`~/tasks.db`), not in the browser. The `useTasks` hook in the frontend communicates exclusively with the REST API; there is no `localStorage` usage for task data.

## Data Shape

Each task is a flat object with JSON-serialised array fields:

```js
{
  id:         string,        // UUID
  title:      string,        // Required. Event/task name
  dueDate:    string,        // YYYY-MM-DD
  time:       string,        // e.g. "3:00 PM" or "All day"
  category:   string,        // Work | Personal | Health | Social | Finance | Education | Other
  assignees:  string[],      // Names of people involved
  status:     string,        // todo | in-progress | done
  notes:      string,        // Free-text description / notes
  prepSteps:  PrepStep[],    // See prep-plan.spec.md
  created_at: string,        // ISO datetime
  updated_at: string         // ISO datetime
}
```

## User Stories

1. **Create** — User fills TaskForm (title + dueDate required; others optional) and submits → task appears in EventList immediately.
2. **Edit** — User clicks edit on any task → TaskForm opens pre-populated → save updates the task.
3. **Delete** — User clicks delete → task is removed from list and DB.
4. **Status change** — User can cycle status between `todo` → `in-progress` → `done`.
5. **Filter/sort** — EventList supports filtering by status and sorting by due date.
6. **Assignees** — User can add multiple people (comma-separated or tag input) to a task.
7. **Category** — User picks from a fixed category list when creating/editing.

## Acceptance Criteria

- [ ] A task with only `title` and `dueDate` can be saved successfully.
- [ ] Validation: `title` and `dueDate` are required; form shows inline error if missing.
- [ ] Editing a task preserves its `id`, `created_at`, and `prepSteps`.
- [ ] Deleting a task removes it from the DB and the UI without a page reload.
- [ ] Tasks persist across browser refreshes and restarts (stored in SQLite, not localStorage).
- [ ] Tasks are ordered by `dueDate` ascending by default in EventList.
- [ ] Overdue tasks (dueDate < today, status ≠ done) are visually flagged.

## Components

| Component | File | Responsibility |
|---|---|---|
| EventList | `src/components/EventList.jsx` | Master task list with filters, edit/delete actions |
| TaskForm | `src/components/TaskForm.jsx` | Create/edit modal form |
| TaskTiles | `src/components/TaskTiles.jsx` | Summary stat cards (total, upcoming, in-progress, done) |
| useTasks | `src/hooks/useTasks.js` | Data hook — all API calls and shared state |

## API Contracts

- `GET /api/tasks` → `Task[]` (all tasks, ordered by `created_at DESC` from server; frontend sorts by dueDate)
- `POST /api/tasks` → `Task` (created task)
- `PUT /api/tasks/:id` → `Task` (updated task)
- `DELETE /api/tasks/:id` → `{ success: true }`

## Out of Scope

- Recurring tasks
- Sub-tasks / task hierarchies
- Attachments or file uploads
