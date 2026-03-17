# Feature Spec: Calendar View

> Related product context: [docs/product.md](../../../docs/product.md)  
> Architecture context: [docs/architecture.md](../../../docs/architecture.md)  
> Depends on: [src/features/tasks/tasks.spec.md](../tasks/tasks.spec.md)

## Purpose

Give the user a visual, time-based overview of all their tasks on a monthly calendar grid. Each task's `dueDate` appears as an event on the calendar.

## User Stories

1. **View month** — User sees the current month with all task due dates plotted as events.
2. **Navigate** — User can go to previous/next months.
3. **Event label** — Each calendar event shows the task title, truncated if long.
4. **Urgency color** — Events are color-coded by urgency (red ≤1 day, amber ≤3 days, green or default otherwise).
5. **Today highlight** — Today's date cell is visually distinct.

## Acceptance Criteria

- [ ] Tasks with a valid `dueDate` appear on the correct calendar cell.
- [ ] Tasks with no `dueDate` (empty string) are not rendered on the calendar.
- [ ] Categories or status changes update calendar event color/label without page reload.
- [ ] Navigating months does not re-fetch from the server; it uses already-loaded `tasks` prop.
- [ ] Calendar is responsive and readable on narrow viewports (≥320px).

## Components

| Component | File | Responsibility |
|---|---|---|
| CalendarView | `src/components/CalendarView.jsx` | Renders calendar grid; receives `tasks[]` as prop |

## Data Requirements

- Receives `tasks: Task[]` from parent (App.jsx / useTasks).
- Reads `task.dueDate` (YYYY-MM-DD) and `task.title`.
- No direct API calls — purely display.

## Out of Scope

- Week / day view (v1 is month only)
- Drag-and-drop rescheduling
- Clicking a calendar event to open task detail (nice-to-have for v2)
- Displaying prep step target dates on the calendar
