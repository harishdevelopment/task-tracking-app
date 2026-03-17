# PlanTrack

A personal event and task tracking app for staying organised. Built with React + Vite on the frontend and an Express + SQLite backend — all data is stored locally on your machine, no cloud account needed.

## What it does

- **Add & manage events/tasks** — title, due date, time, category, status, notes, and involved parties
- **Preparation steps** — break each task into checklist steps and tick them off as you go
- **Calendar view** — see all your events laid out by date
- **Status tracking** — move tasks between *To Do*, *In Progress*, and *Done*
- **Categories** — organise by Family, Social, Church, Work, Health, or Other
- **Browser notifications** — get reminded about upcoming events (via the Notifications setup)
- **Persistent SQLite storage** — everything is saved to a SQLite database in your home directory; nothing is lost on refresh

## System Requirements

| | Minimum |
|---|---|
| **Node.js** | v18 or later |
| **npm** | v9 or later |
| **OS** | macOS, Windows 10/11, or Linux |

Check your versions:
```bash
node --version
npm --version
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the app

```bash
npm run dev
```

This starts both the Vite frontend (port **5173**) and the Express API server (port **3001**) together. Open your browser to:

```
http://localhost:5173
```

> **Note:** Always use `npm run dev` — not the individual `npm run server` or Vite commands — so both processes start together.

## Where the SQLite database is stored

The database is a single file saved in your **home directory**:

| OS | Path |
|---|---|
| macOS / Linux | `~/tasks.db` → e.g. `/Users/yourname/tasks.db` |
| Windows | `%USERPROFILE%\tasks.db` → e.g. `C:\Users\yourname\tasks.db` |

You can inspect or back up this file at any time. To view it directly, use the [DB Browser for SQLite](https://sqlitebrowser.org/) (free, cross-platform).

### Migrating existing data

If you previously used the app and had tasks saved in the browser (localStorage), they are **automatically migrated** into SQLite the first time you open the app after this update. This runs once and won't duplicate your data on subsequent loads.

## macOS Notes

- No extra setup needed. Node.js can be installed via [Homebrew](https://brew.sh): `brew install node`
- If you see a security prompt about `better-sqlite3` (a native module), allow it in **System Settings → Privacy & Security**
- Port 5173 and 3001 are used — make sure nothing else is running on those ports

## Windows Notes

- Install Node.js from [nodejs.org](https://nodejs.org) (LTS recommended)
- Always run `npm install` before `npm run dev` — this installs `concurrently` and other local tools that the scripts depend on
- `better-sqlite3` requires native compilation — install the Windows build tools first if you get an error during `npm install`:
  ```powershell
  npm install --global windows-build-tools
  ```
  Or install **"Desktop development with C++"** via the Visual Studio Installer
- Run the app in **PowerShell** or **Windows Terminal** (not the old `cmd.exe`)
- The database will be at `C:\Users\<yourname>\tasks.db`

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend + backend together (recommended) |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build locally |
| `npm run server` | Start only the Express/SQLite server |
| `npm run lint` | Run ESLint |

