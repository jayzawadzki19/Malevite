## Malevite Web

Modern Angular 20 single‑page app for male health tracking. It includes a daily checkup, weekly goals, an optimization dashboard, a daily tasks page, and a profile page. All state is stored locally in `localStorage` and wired together via a centralized scoring system using Angular Signals.

### Tech stack
- Angular 20 standalone components and signals
- Angular Material slider (for checkup metric input)
- Local storage persistence (no backend)

## App structure
- `app/app.routes.ts`: routes and navigation guards
- `app/wrapper-page/*`: tabbed shell with bottom navigation
- `app/checkup-page/*`: morning checkup (metrics + indicator)
- `app/daily-page/*`: daily actionable tasks list
- `app/dashboard-page/*`: charts, weekly goals, streak, and XP
- `app/optimize-page/*`: focus areas derived from metrics
- `app/profile-overview/*`: editable profile with uploads and XP
- `app/common/scoring/scoring.service.ts`: scoring engine and persistence

### Routes
- `/` or `/login`: entry
- `/app/checkup`: submit today’s checkup (guard redirects to `/app/daily` after submission)
- `/app/daily`: daily goals checklist
- `/app/dashboard`: analytics, weekly goals, streak, XP
- `/app/optimize`: focus areas and overall score
- `/app/profile`: profile overview page

## Scoring and state model
Implemented in `app/common/scoring/scoring.service.ts`.

### Morning checkup and streak
- Submitting a checkup appends an entry to `malevite.checkups`.
- Streak counts consecutive days with at least one checkup considering a 4‑hour tolerance window around midnight (local time). Missing a day resets the streak.

### Daily tasks → weekly goals mapping
- Tasks (in `/app/daily`):
  - Sunlight 10min after wake‑up (`sunlight`)
  - Protein‑rich breakfast (`protein`)
  - 3L water (`water`)
  - 45‑minute strength training (`strength`)
  - No screens 60 minutes before sleep (`noscreens`)
- Weekly goals (on dashboard):
  - Get 7.5h Sleep → mapped via `noscreens`, target 7, +50 XP
  - 3x Strength Training → mapped via `strength`, target 3, +50 XP
  - Hydration 5 days → mapped via `water`, target 5, +75 XP

Interaction rules:
- Checking a mapped task for a day increments the current week’s goal progress once per day.
- Unchecking the same day decrements progress.
- When a goal reaches its target the first time in a week, XP is awarded once and flagged to avoid double‑counting.

### Focus areas (Optimize page)
- Latest checkup metrics update area scores with a smoothing function and compute an overall score.
- Mappings: Energy→Energy Levels, Mood→Mental State, Sleep Quality→Sleep Quality, Sex drive→Sex Drive.

### Dashboard
- Weekly goals: icon pill per goal with live progress and XP value.
- Streak: live counter from signals.
- Total XP: cumulative XP earned from completed weekly goals only.
- Recent mornings: last 7 days with emoji trend (↗️ up, ↘️ down, — no data).

## Local storage keys
All keys are namespaced with `malevite.*`.

### Scoring
- `malevite.checkups`: CheckupEntry[]
  - `{ date: ISO_STRING, morningErectionDown: boolean, metrics: { name, value }[] }`
- `malevite.totalXp`: number
- `malevite.dailyTasks.<YYYY-MM-DD>`: `{ id: string, done: boolean }[]`
- `malevite.weeklyGoals.<YYYY-Www>`: `WeeklyGoal[]`
- `malevite.weeklyGoals.marks`: string[] of day marks to keep per‑day idempotency
- `malevite.areaScores`: `{ [areaName: string]: number }`

### Profile
- `malevite.profile`: profile object (username, fullName, email, password, twoFactor, gender, dob, timeZone, connectedApps, units, verified, avatarDataUrl)
- `malevite.profile.uploads`: string[]
- `malevite.profile.reports`: string[]

## Getting started

### Prerequisites
- Node 18+ and Bun 1.1+

### Install dependencies
```bash
bun install
```

### Start dev server
```bash
bun run start
```
Open `http://localhost:4200/`.

### Build for production
```bash
bun run build
```
Artifacts are emitted to `dist/`.

### Run unit tests
```bash
bun run test
```

## Data seeding and reset

### Seed a quick demo state in DevTools console
```js
// Mark today’s strength task done to advance weekly progress
// (Run in the browser console)
const d = new Date();
const dayKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
localStorage.setItem(`malevite.dailyTasks.${dayKey}`, JSON.stringify([{ id: 'strength', done: true }]));
```

### Reset all app data (destructive)
```js
Object.keys(localStorage).filter(k => k.startsWith('malevite.')).forEach(k => localStorage.removeItem(k));
```

## Conventions
- Components are standalone and import their own dependencies.
- Signals are used for app‑wide state; template bindings call signal functions (e.g., `scoring.totalXp()`).
- All persistence reads/writes are try/catch guarded to avoid hard failures in restricted environments.

## Notable files
- `app/common/scoring/scoring.service.ts` – scoring engine and local storage schema
- `app/daily-page/daily-page.component.*` – task toggle UI wired to scoring
- `app/checkup-page/checkup-page.component.*` – submit flow and metrics
- `app/dashboard-page/dashboard-page.component.*` – goals, XP, streak, history emojis
- `app/optimize-page/optimize-page.component.*` – area cards + overall score
- `app/profile-overview/profile-overview.component.*` – profile form with uploads and XP badge

## License
This project is provided as‑is for hackathon/demonstration purposes.
