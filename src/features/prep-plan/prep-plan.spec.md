# Feature Spec: Preparation Plans

> Related product context: [docs/product.md](../../../docs/product.md)  
> Architecture context: [docs/architecture.md](../../../docs/architecture.md)  
> Depends on: [src/features/tasks/tasks.spec.md](../tasks/tasks.spec.md)

## Purpose

For each task/event, the user can define a preparation plan: a short ordered list of steps to complete before the due date. Steps are surfaced daily so the user always knows what to work on next.

## Data Shape

Prep steps are stored as a JSON array on the parent task row:

```js
// PrepStep object (inside task.prepSteps[])
{
  id:   string,    // UUID
  text: string,    // Human-readable step description
  done: boolean    // Whether the user has checked this step off
}
```

## User Stories

1. **Add steps manually** — User types a prep step in TaskForm and clicks "Add" (or presses Enter) → step is saved with the task.
2. **View** — PrepPlan component shows all steps for all upcoming tasks sorted by days-until-due.
3. **Check off** — User checks a step as done → `done: true` is saved to DB immediately via `togglePrepStep`.
4. **Remove step** — User removes an individual step from the task form before saving.
5. **Urgency** — Prep cards are color-coded: red (≤1 day), amber (≤3 days), green (on track).
6. **Today's focus** — When a task is due within 3 days and has pending steps, the first pending step is highlighted as "Today's focus".

## Acceptance Criteria

- [x] Prep steps can be added and removed in TaskForm before saving a task.
- [ ] PrepPlan component shows "No upcoming tasks" when all tasks are done or none exist.
- [ ] Urgency class (`urgency-urgent`, `urgency-soon`, `urgency-normal`) is applied correctly based on `daysLeft`.
- [ ] If `daysLeft === 0`, label shows "today" not "0 days".
- [ ] Assignees line (`👥 Involved:`) is only shown when `assignees.length > 0`.
- [ ] "Today's focus" block is shown only when `daysLeft <= 3` and there are pending steps.

## Components

| Component | File | Responsibility |
|---|---|---|
| PrepPlan | `src/components/PrepPlan.jsx` | Renders prep cards for all upcoming tasks |
| TaskForm | `src/components/TaskForm.jsx` | Add / remove prep steps when creating or editing a task |
| useTasks | `src/hooks/useTasks.js` | `togglePrepStep(taskId, stepId)` patches `prepSteps` via PUT |

## API Contracts

- `PUT /api/tasks/:id` (with updated `prepSteps` array) → saves step toggle changes

## Out of Scope

- AI-generated prep steps (planned for a future version)
- Per-step target dates (v1 uses urgency of the parent task's due date)
