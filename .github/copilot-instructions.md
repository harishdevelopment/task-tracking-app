# PlanTrack — Copilot Instructions

## Spec-Driven Development

This project follows **spec-driven development**. Every feature has a living spec file.  
**Before implementing, modifying, or debugging any feature, always read the relevant spec.**

### Spec Locations

| What to build / change | Read this spec first |
|---|---|
| Any task (create, edit, delete, status, assignees) | `src/features/tasks/tasks.spec.md` |
| Preparation plans, AI generation, step progress | `src/features/prep-plan/prep-plan.spec.md` |
| Calendar view | `src/features/calendar/calendar.spec.md` |
| Notifications (browser or in-app) | `src/features/notifications/notifications.spec.md` |
| Overall product goals and user stories | `docs/product.md` |
| Stack, file layout, data model, API contracts | `docs/architecture.md` |

> If you are unsure which spec applies, read `docs/product.md` and `docs/architecture.md` first.

### Workflow for Every Feature Request

1. Locate and read the relevant spec file(s) listed above.
2. Check acceptance criteria — implement exactly what is checked off; do not gold-plate.
3. If the request contradicts the spec, flag the conflict before proceeding.
4. After implementation, check whether the spec's acceptance criteria are now met.
5. If you add a materially new behaviour, update the spec's acceptance criteria to reflect it.

---

## Stack Constraints

- **Language**: JavaScript only (`.jsx`, `.js`). Do **not** add TypeScript (`.ts`, `.tsx`).
- **Styling**: Plain CSS in `App.css` / `index.css`. Do **not** add Tailwind, Bootstrap, or any CSS-in-JS library.
- **State**: All shared state lives in `src/hooks/useTasks.js`. Do **not** add Redux, Zustand, or Context providers.
- **Backend**: Express 5 in `server.js`. SQLite via `better-sqlite3`. Do **not** swap the DB or add an ORM.
- **No auth**: Single-user app. Do not add authentication or sessions.

## Code Conventions

- Components are function components with named exports, one per file.
- Props flow down; callbacks flow up — no prop drilling beyond two levels.
- `assignees` and `prepSteps` are always JSON-serialised when going into SQLite; use the `deserialize()` helper in `server.js` when reading them out.
- DB file lives at `~/tasks.db` (user home dir). Never hardcode a different path.
- The Vite dev server runs on **5173** and proxies `/api` to Express on **3001**.

## Build & Run

```bash
npm run dev        # starts Vite (port 5173) + Express (port 3001) concurrently
npm run build      # production Vite build
npm run lint       # ESLint check
```

## File Map (quick reference)

```
src/
  components/         React UI components
  hooks/useTasks.js   All API calls + shared task state
  App.jsx             Root layout
server.js             Express API + SQLite schema
docs/
  product.md          What the app does and why
  architecture.md     Stack, layout, data model, API contracts
src/features/
  tasks/              tasks.spec.md
  prep-plan/          prep-plan.spec.md
  calendar/           calendar.spec.md
  notifications/      notifications.spec.md
```

## Updating Specs

When behaviour changes or a new user story is agreed:
1. Update the relevant `.spec.md` file first (acceptance criteria, data shape, API contract).
2. Then implement the change.
3. Specs are the source of truth — code follows the spec, not the other way around.
