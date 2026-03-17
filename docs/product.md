# Product: PlanTrack

## Purpose

PlanTrack is a personal task scheduling and tracking app for a single user.  
It helps the user manage upcoming events and deadlines, automatically builds a preparation plan for each task, tracks how prepared they are, and sends daily reminders so nothing slips through.

All data is stored locally on the user's machine in a SQLite database (`~/tasks.db`) — no cloud account or internet connection required for core functionality.

## Problem Statement

When a person has an upcoming event (e.g., a Saturday dinner, a doctor appointment, or a work presentation) they need to:
- Know what preparation steps are required
- Be reminded of those steps daily as the event approaches
- See at a glance how much of the preparation is done

PlanTrack solves this by combining a task list, an AI-generated prep plan, progress tracking, and scheduled notifications in one place.

## Users

Single-user app. No authentication, no multi-tenancy.

## Core User Stories

### Tasks
- As a user, I can add a task/event with a title, due date, time, category, notes, and a list of people involved (assignees).
- As a user, I can edit or delete a task.
- As a user, I can mark a task as `todo`, `in-progress`, or `done`.
- As a user, I can see all my tasks in a filterable list sorted by due date.
- As a user, my tasks are saved permanently in a local SQLite database and are not lost when I close the browser.

### Preparation Plans
- As a user, I can add preparation steps to a task when creating or editing it.
- Each prep step has a title and can be checked off as done.
- Steps are color-coded by urgency: red (≤1 day), amber (≤3 days), green (on track).
- The PrepPlan view shows all upcoming tasks sorted by due date and highlights "Today's focus" for near-due tasks.

### Calendar
- As a user, I can see all tasks and their due dates on a monthly/weekly calendar.
- Clicking a calendar event highlights the relevant task.

### Notifications
- As a user, I receive in-app daily reminders for tasks due within the next 7 days.
- As a user, I can enable browser desktop notifications for the same reminders.
- As a user, I see a daily "what to focus on today" prep summary for all upcoming tasks.

## Out of Scope (v1)

- Multi-user / authentication
- Email or push notifications
- Recurring tasks
- Offline / PWA support

## Categories

Tasks can be tagged with one of: `Family`, `Social`, `Event`, `Work`, `Health`, `Other`.

## Task Statuses

`todo` → `in-progress` → `done`
