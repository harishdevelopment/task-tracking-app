---
description: Daily workflow to detect documentation drift from recent code changes and open a PR with doc updates.
on:
  schedule: daily on weekdays
  skip-if-match: 'is:pr is:open in:title "[daily-doc-sync]"'
permissions: read-all
tools:
  github:
    toolsets: [default]
safe-outputs:
  create-pull-request:
    max: 1
  noop:
---

# Daily Documentation Sync

### Mission

Keep repository documentation accurate and current by detecting documentation drift from recent code changes and proposing precise updates.

### Scope

- Focus on documentation files in this repository, including:
  - `README.md`
  - `docs/**/*.md`
  - `src/features/**/*.spec.md`
  - Other markdown docs that explain behavior, architecture, or workflows
- Compare these docs against recent code changes from the last successful run window (use Git history and GitHub metadata to infer relevant commits/PRs).
- Prioritize user-facing behavior, API contracts, architecture notes, setup/run instructions, and feature acceptance criteria.

### Workflow

1. Identify recent code changes likely to affect documentation.
2. Locate doc files that are missing, stale, or inconsistent with those changes.
3. Apply focused edits only where needed; avoid broad rewrites.
4. Validate that updates are internally consistent and reference the current code behavior.
5. Create one pull request with all doc updates.

### Pull Request Requirements

- Title format: `[daily-doc-sync] Update docs for recent code changes`
- Include a concise summary of what changed and why.
- Include a short checklist of areas reviewed.
- Mention key commits or pull requests that motivated the documentation edits.
- Keep the PR narrowly scoped to documentation updates only.

### Safety And Output Rules

- Do not modify application code unless a tiny code-adjacent doc fix is strictly necessary for consistency.
- Do not open duplicate PRs; if an equivalent open PR already exists, use `noop`.
- If no documentation updates are needed after analysis, call `noop` with a clear explanation of what was checked.
- When successful and updates are required, call `create-pull-request` exactly once.
