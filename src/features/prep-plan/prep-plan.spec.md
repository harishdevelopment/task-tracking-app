# Feature Spec: Preparation Plans

> Related product context: [docs/product.md](../../../docs/product.md)  
> Architecture context: [docs/architecture.md](../../../docs/architecture.md)  
> Depends on: [src/features/tasks/tasks.spec.md](../tasks/tasks.spec.md)

## Purpose

For each task/event, the app generates a preparation plan: a short ordered list of steps the user needs to complete before the due date. Steps are surfaced daily so the user always knows what to work on next.

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

1. **Generate** — User clicks "Generate Prep Plan" on a task → app calls OpenAI with the task details → 3-5 steps are returned and saved to `task.prepSteps`.
2. **View** — PrepPlan component shows all steps for all upcoming tasks sorted by days-until-due.
3. **Check off** — User checks a step as done → `done: true` is saved to DB immediately; progress bar updates.
4. **Regenerate** — User can request a new plan (replaces existing steps after confirmation).
5. **Urgency** — Prep cards are color-coded: red (≤1 day), amber (≤3 days), green (on track).
6. **Progress** — Each prep card shows a progress bar: `done / total` steps.

## AI Generation Contract

**Input sent to OpenAI:**
- Task title
- Due date (formatted as human-readable string)
- Category
- Assignees (if any)
- Notes

**Expected output (JSON mode):**
```json
{
  "steps": [
    { "text": "Book a venue by Wednesday" },
    { "text": "Send invites to all guests" },
    { "text": "Confirm catering 2 days before" }
  ]
}
```

- Minimum 3 steps, maximum 5 steps.
- Steps must be actionable, specific, and time-aware relative to the due date.
- Steps are ordered from earliest to latest action.
- `OPENAI_API_KEY` must be set in `.env.local`; if missing, the endpoint returns `400`.

## Acceptance Criteria

- [ ] Clicking "Generate Prep Plan" for a task with no prep steps calls `POST /api/tasks/:id/generate-prep` and populates `prepSteps`.
- [ ] Progress bar shows `done / total` and updates instantly when a step is toggled.
- [ ] PrepPlan component shows "No upcoming tasks" when all tasks are done or none exist.
- [ ] Urgency class (`urgency-urgent`, `urgency-soon`, `urgency-normal`) is applied correctly based on `daysLeft`.
- [ ] If `daysLeft === 0`, label shows "today" not "0 days".
- [ ] Assignees line (`👥 Involved:`) is only shown when `assignees.length > 0`.

## Components

| Component | File | Responsibility |
|---|---|---|
| PrepPlan | `src/components/PrepPlan.jsx` | Renders prep cards for all upcoming tasks |
| useTasks | `src/hooks/useTasks.js` | `togglePrepStep(taskId, stepId)` patches `prepSteps` via PUT |

## API Contracts

- `POST /api/tasks/:id/generate-prep` → calls OpenAI, saves steps, returns updated `Task`
- `PUT /api/tasks/:id` (with updated `prepSteps` array) → saves step toggle changes

## Out of Scope

- Per-step target dates (v1 uses urgency of the parent task's due date)
- AI-generated step dates / scheduling across days
