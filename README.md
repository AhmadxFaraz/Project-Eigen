# Preparation-Tracker

A vibe-coded, math/engineering-themed preparation tracker for multiple math sections, built to make syllabus completion visual, interactive, and cross-device.

## Overview

Preparation-Tracker turns each unit into a checklist dashboard with:

- topic-wise task tracking
- completion charts
- animated technical background visuals
- account-based cloud sync (so progress persists across browsers/devices)

## Key Features

- Modular architecture with separated HTML, CSS, and JavaScript layers
- 8 implemented unit dashboards (4 for AMS I + 4 for AMS II)
- Structure ready to add more math sections beyond AMS
- Real-time progress analytics (overall + topic-wise)
- Filters: `All`, `To Do`, `Done`
- Per-unit reset control
- Auth flow with separate `Sign In` and `Sign Up` pages
- Top-right header identity indicator after login
- Cloud-backed progress sync per user and per unit

## Cloud Sync (Supabase)

Progress is stored in Supabase table `public.tracker_progress` using:

- `user_id` (auth user)
- `storage_key` (unit key)
- `data` (JSON task state)
- `updated_at` (timestamp for conflict resolution)

Sync strategy:

- newer state wins (timestamp-based merge behavior)
- stale local snapshots do not overwrite newer cloud state
- local-only progress is pushed when needed

## Project Structure

```text
assets/
  theme.css
  theme.js
  css/unit-dashboard.css
  js/
    modules/
      app-core.js
      ui.js
      charts.js
      storage.js
      cloud-sync.js
      auth-ui.js
      header-auth.js
    am1-unit-*.data.js
    am1-unit-*.main.js
    am2-unit-*.data.js
    am2-unit-*.main.js
Applied-Mathematics-I/
Applied-Mathematics-II/
index.html
login.html
signup.html
```

## Local Run

Use any static server (recommended), then open:

- `index.html` for main dashboard
- `login.html` / `signup.html` for authentication

## Note

This project is intentionally structured as a learning-first, vibe-coding build with clear separation of concerns and visibly styled engineering/math aesthetics.

## Tools Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Tailwind CSS (CDN)
- Chart.js
- Supabase (Auth + Postgres + RLS)
- tiny.host (deployment/testing)
