# Preparation-Tracker: Private Learning Notes

This file is for your personal learning and architecture understanding.

Current status:

- Implemented sections: AMS I and AMS II (8 units total)
- Planned: additional Math sections to be added in the same architecture

## 1) What each language/file does

- HTML: page structure + script/style imports
- CSS: theme + layout + visual style
- JS: app logic, rendering, charts, storage, cloud sync

### Main shared files

- `assets/theme.css`: global colors, tokens, shared components
- `assets/css/unit-dashboard.css`: unit-page specific styles
- `assets/theme.js`: background animation engine

## 2) Animation mode map

Background animation is selected per page using:

- `<canvas id="bgCanvas" data-bg-mode="...">`

Current mapping:

- All pages use `data-bg-mode="particles"`

## 3) Unit app JS layers

- `assets/js/modules/storage.js`: localStorage + local write metadata timestamps
- `assets/js/modules/cloud-sync.js`: Supabase pull/push and auth user checks
- `assets/js/modules/auth-ui.js`: login/signup page interactions
- `assets/js/modules/header-auth.js`: top-right header label (name/email prefix)
- `assets/js/modules/charts.js`: Chart.js setup/update
- `assets/js/modules/ui.js`: task rendering, filter UI, motivation text
- `assets/js/modules/app-core.js`: app orchestration and sync conflict handling
- `assets/js/am*-unit-*.data.js`: syllabus/task data only
- `assets/js/am*-unit-*.main.js`: per-page app bootstrap only

## 4) Script load order (unit pages)

Each unit page loads JS in this order:

1. `theme.js`
2. `supabase-client.js`
3. `cloud-sync.js`
4. `storage.js`
5. `charts.js`
6. `ui.js`
7. `app-core.js`
8. `am*-unit-*.data.js`
9. `am*-unit-*.main.js`

Why this order: each layer depends on the previous one.

## 5) Supabase setup for cross-device sync

### Configure keys

Edit:

- `assets/js/supabase-config.js`

Set:

- `window.SUPABASE_URL`
- `window.SUPABASE_ANON_KEY`

### SQL: table + RLS policies

```sql
create table if not exists public.tracker_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_key text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, storage_key)
);

alter table public.tracker_progress enable row level security;

drop policy if exists "Users can read own progress" on public.tracker_progress;
drop policy if exists "Users can write own progress" on public.tracker_progress;
drop policy if exists "Users can update own progress" on public.tracker_progress;

create policy "Users can read own progress"
on public.tracker_progress
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can write own progress"
on public.tracker_progress
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own progress"
on public.tracker_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

### Verification query

```sql
select user_id, storage_key, updated_at
from public.tracker_progress
order by updated_at desc
limit 20;
```

## 6) Sync behavior you implemented

- Sync key is `user_id + storage_key` (per account, per unit)
- App compares local write time vs cloud `updated_at`
- Newer state wins to avoid stale overwrite
- If cloud row does not exist:
  - it seeds only when local has real completed tasks
- Push calls retry automatically
- Pull runs on:
  - init
  - auth state changes
  - delayed hydration checks
  - periodic interval while page is open
- Unit pages show bottom-right `Cloud Sync` badge for debug status

## 7) Data flow mental model

- `data.js` = what content exists
- `ui.js` = how content is rendered
- `charts.js` = how progress is visualized
- `storage.js` = how local state is persisted
- `cloud-sync.js` = how account state is persisted
- `app-core.js` = how everything is connected
- `main.js` = page entrypoint

## 8) Step-by-step learning path

For one unit (example: `am1-unit-1`), open files in this order:

1. `Applied-Mathematics-I/unit-1.html`
2. `assets/js/am1-unit-1.data.js`
3. `assets/js/am1-unit-1.main.js`
4. `assets/js/modules/app-core.js`
5. `assets/js/modules/ui.js`
6. `assets/js/modules/charts.js`
7. `assets/js/modules/storage.js`
8. `assets/js/modules/cloud-sync.js`
9. `assets/theme.css`
10. `assets/theme.js`

## 9) Mini practice tasks

1. Add one new task in a `data.js` file and refresh.
2. Change one UI badge class in `ui.js`.
3. Change one chart color in `charts.js`.
4. Inspect local keys in browser storage.
5. Change one theme CSS variable.
6. Switch animation mode via `data-bg-mode` and compare output.
