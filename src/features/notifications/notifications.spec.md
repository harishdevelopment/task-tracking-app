# Feature Spec: Notifications

> Related product context: [docs/product.md](../../../docs/product.md)  
> Architecture context: [docs/architecture.md](../../../docs/architecture.md)  
> Depends on: [src/features/tasks/tasks.spec.md](../tasks/tasks.spec.md)

## Purpose

Keep the user aware of upcoming tasks and their preparation status through in-app prompts and optional browser desktop notifications. Notifications are generated client-side — no server-side scheduler.

## Notification Types

| Type | Trigger | Message Pattern |
|---|---|---|
| **Due-soon reminder** | Task due within 7 days, status ≠ done | "📅 [Title] is due in X days" |
| **Overdue alert** | Task dueDate < today, status ≠ done | "⚠️ [Title] is overdue!" |
| **Prep nudge** | Task has incomplete prep steps and is due within 7 days | "🔲 You have X prep steps left for [Title]" |

## User Stories

1. **Enable browser notifications** — On first visit, user is prompted to grant browser Notification API permission.
2. **Daily alert** — When the page loads, a browser notification fires for each task due within 7 days (if permission granted).
3. **In-app summary** — The PrepPlan component acts as an in-app "what to focus on today" display — no separate notification centre required in v1.
4. **No re-prompt** — If the user has already granted/denied, do not ask again.

## Acceptance Criteria

- [ ] `NotificationSetup` component requests `Notification.requestPermission()` on mount if permission is `'default'`.
- [ ] If permission is `'granted'`, a `new Notification(...)` fires for each task due within 7 days on page load.
- [ ] Only one notification per task per page load (no duplicates if component re-renders).
- [ ] If permission is `'denied'` or browser does not support Notification API, fail silently.
- [ ] Notifications are not sent for tasks with `status === 'done'`.

## Components

| Component | File | Responsibility |
|---|---|---|
| NotificationSetup | `src/components/NotificationSetup.jsx` | Permission request + browser notification firing |
| PrepPlan | `src/components/PrepPlan.jsx` | In-app daily prep focus view (see prep-plan.spec.md) |

## Data Requirements

- Receives `tasks: Task[]` as prop.
- Filters to tasks where `daysLeft >= 0 && daysLeft <= 7 && status !== 'done'`.
- Uses helper `getDaysUntil(dueDate)` from `src/hooks/useTasks.js`.

## Browser Notification API Notes

```js
// Permission request
if (Notification.permission === 'default') {
  Notification.requestPermission();
}

// Fire notification
if (Notification.permission === 'granted') {
  new Notification('PlanTrack Reminder', {
    body: `${task.title} is due in ${daysLeft} days`,
    icon: '/favicon.ico',
  });
}
```

## Out of Scope

- Email notifications
- Push notifications (service worker)
- In-app notification inbox / bell icon (v2)
- Server-side notification scheduling
