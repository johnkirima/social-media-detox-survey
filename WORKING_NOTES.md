# Working Notes — Social Media Detox Survey

> **Internal document. Not public-facing. Not for the repo README.**
> Update this file at the end of every working session before closing.

---

## How to Use This File (For AI Assistants)

1. Read this entire file before doing anything else in this project.
2. Read `README.md` for public-facing context and setup instructions.
3. Do not change the folder structure, file naming conventions, or monorepo layout without discussing it with the developer first.
4. Follow all conventions in the **Conventions** section exactly — do not substitute your own preferences.
5. Do not suggest anything listed in **What Was Tried and Rejected**.
6. Ask before making any large structural change (new routing library, replacing Supabase, restructuring the monorepo, changing the build output path).
7. This project was built with AI assistance. Refactor conservatively — prefer targeted edits over rewrites. Do not rewrite working code to match a different style.
8. The monorepo has shared workspace libs (`lib/*`) that this app intentionally does not use — do not wire the survey into `@workspace/api-client-react` or `@workspace/db`. The app is intentionally frontend-only with Supabase as its backend.

---

## Current State

**Last Updated:** 2026-03-30

The survey app is fully functional in development. It renders, validates, saves to Supabase, and displays results. Azure deployment infrastructure has been configured but has not yet been tested against a live Azure environment. Supabase Row-Level Security is not yet enabled.

### What Is Working
- [x] All 7 survey questions render correctly with correct input types
- [x] Client-side form validation with dark-humor error messages
- [x] Supabase insert on form submission (`survey_responses` table)
- [x] Redirect to `/results` after successful submission
- [x] Results page with 4 diagnostic categories computed from answers
- [x] Dark-themed responsive UI (Tailwind CSS 4)
- [x] Client-side routing between `/` and `/results` (Wouter)
- [x] `vite.config.ts` works in both Replit (dev) and Azure (build) environments
- [x] `staticwebapp.config.json` in place for SPA route fallback on Azure
- [x] GitHub Actions workflow (`.github/workflows/azure-static-web-apps.yml`) written

### What Is Partially Built
- [ ] Azure deployment workflow written but not yet run against a live Azure SWA resource
- [ ] `staticwebapp.config.json` not yet validated in a real Azure environment
- [ ] README.md author/contact/GitHub fields are placeholder — need real values

### What Is Not Started
- [ ] Supabase Row-Level Security (RLS) policy for `survey_responses`
- [ ] Admin/results dashboard to view aggregate responses
- [ ] Shareable result cards or permalinks
- [ ] Classroom mode for instructors

---

## Current Task

**Last stopped:** Configured the project for Azure Static Web App deployment — updated `vite.config.ts` to not throw when Replit-specific env vars (`PORT`, `BASE_PATH`) are absent, added `staticwebapp.config.json` for SPA routing fallback, and wrote the GitHub Actions CI/CD workflow.

**Next step:** Push to GitHub, create the Azure Static Web App resource in the Azure Portal, add the three required GitHub Secrets (`AZURE_STATIC_WEB_APPS_API_TOKEN`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), and confirm the Actions workflow deploys successfully.

---

## Architecture and Tech Stack

| Technology | Version | Why It Was Chosen |
|---|---|---|
| React | 19.1.0 | UI component framework; version pinned by pnpm workspace catalog |
| TypeScript | ~5.9 | Type safety; required by the monorepo base config |
| Vite | ^7.3.0 | Build tool and dev server; used across all workspace artifacts |
| Tailwind CSS | ^4.1.14 | Utility-first dark-mode styling; already in workspace catalog |
| Wouter | ^3.3.5 | Lightweight SPA router; chosen over React Router for simplicity |
| Supabase JS | ^2.100.1 | Database client; user already had a Supabase project provisioned |
| pnpm Workspaces | 10 | Monorepo package manager; project was already structured this way |
| Node.js | 24 | Runtime; Replit environment default |
| Azure Static Web Apps | — | Deployment target chosen by the user |
| GitHub Actions | — | CI/CD required by Azure SWA deployment model |

---

## Project Structure Notes

```
social-media-detox-survey/
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml   # CI/CD: build + deploy to Azure SWA
├── artifacts/
│   └── detox-survey/                   # The survey app (this is the primary artifact)
│       ├── public/
│       │   └── staticwebapp.config.json  # Azure SWA SPA routing fallback — do not remove
│       ├── src/
│       │   ├── lib/
│       │   │   └── supabase.ts         # Supabase client, reads VITE_ env vars
│       │   ├── pages/
│       │   │   ├── Survey.tsx          # All 7 questions + form state + submit logic
│       │   │   └── Results.tsx         # Diagnosis logic + answer summary display
│       │   ├── App.tsx                 # Router root (Wouter)
│       │   ├── index.css               # Tailwind + CSS custom properties (dark theme)
│       │   └── main.tsx                # React DOM entry point
│       ├── package.json                # Survey-specific deps (@supabase/supabase-js, wouter)
│       ├── tsconfig.json               # Extends ../../tsconfig.base.json
│       └── vite.config.ts              # Build config — PORT and BASE_PATH are optional
├── artifacts/api-server/               # Shared Express API — NOT used by this survey app
├── artifacts/mockup-sandbox/           # Design canvas sandbox — NOT used by this app
├── lib/                                # Shared libs (api-spec, api-client-react, api-zod, db)
│                                       # — NOT used by this survey app
├── README.md                           # Public-facing documentation
├── WORKING_NOTES.md                    # This file
├── pnpm-workspace.yaml                 # Catalog pins + workspace package discovery
├── tsconfig.base.json                  # Shared TS strict defaults
└── tsconfig.json                       # Root TS project references (libs only)
```

### Non-obvious decisions

- **`dist/public` as output dir** — Vite outputs to `artifacts/detox-survey/dist/public` (not the default `dist`). This matches the Azure workflow's `output_location` setting and the Replit artifact convention.
- **`lib/*` packages are unused** — The monorepo includes `@workspace/api-client-react`, `@workspace/db`, etc. These are wired for other apps. The survey intentionally bypasses them and talks to Supabase directly.
- **`BASE_PATH` defaults to `"/"`** — In Replit dev, the proxy injects `BASE_PATH`. In Azure, it is absent. The Vite config now defaults to `"/"` instead of throwing.

### Files and folders that must not be changed without discussion

- `artifacts/detox-survey/public/staticwebapp.config.json` — Azure SWA will 404 on `/results` without this
- `artifacts/detox-survey/vite.config.ts` — `PORT` and `BASE_PATH` handling is intentionally dual-mode (Replit + Azure)
- `pnpm-workspace.yaml` — catalog versions are shared across all workspace packages; a change here can break unrelated artifacts
- `.github/workflows/azure-static-web-apps.yml` — `skip_app_build: true` is intentional; Azure's Oryx builder does not understand pnpm workspaces

---

## Data / Database

**Provider:** Supabase (external PostgreSQL, hosted)
**Project URL:** `https://zkjxbxovrxfadwblcntf.supabase.co`

### Table: `survey_responses`

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `uuid` | Yes (auto) | `gen_random_uuid()`, primary key |
| `created_at` | `timestamptz` | Yes (auto) | `now()` default |
| `daily_screen_time` | `text` | Yes | Free-text, e.g. "4 hours" or "I lost count" |
| `phone_vs_child` | `text` | Yes | One of: `phone`, `firstborn`, `neither` |
| `toxic_platform` | `text` | Yes | Full display string, e.g. "TikTok (the digital crack pipe)" |
| `detox_methods` | `text[]` | Yes (default `{}`) | Array of checked display strings |
| `algo_ban_minors` | `text` | Yes | One of: `yes_absolutely`, `yes_but_good_luck`, `no_free_speech`, `idk_too_scrolling` |
| `last_offline_day` | `text` | Yes | One of: `recently`, `months_ago`, `years_ago`, `never` |
| `regret_level` | `text` | Yes | String `"1"` through `"5"` |

**RLS status:** Not yet configured. The table is currently open to anonymous inserts via the anon key. Enable RLS with an insert-only policy before any public deployment.

---

## Conventions

### Naming

- React component files: `PascalCase.tsx` (e.g. `Survey.tsx`, `Results.tsx`)
- Utility/lib files: `camelCase.ts` (e.g. `supabase.ts`)
- CSS custom properties: `--kebab-case` (e.g. `--background`, `--primary`)
- Env vars exposed to Vite: always prefixed `VITE_` (e.g. `VITE_SUPABASE_URL`)
- Supabase field values: `snake_case` strings matching the column names exactly

### Code Style

- TypeScript strict mode (inherited from `tsconfig.base.json`)
- No `console.log` — not enforced yet but preferred
- Inline state updates with spread: `setAnswers({ ...answers, field: value })`
- All form state lives in a single `useState<SurveyAnswers>` object in `Survey.tsx`
- No external form library (no React Hook Form) — vanilla controlled inputs only

### Framework Patterns

- Routing: Wouter `<Switch>` / `<Route>` with `base={import.meta.env.BASE_URL}`
- Page navigation: `useLocation()` from Wouter, `setLocation("/results?data=...")`
- Results data passed via URL query string (`?data=<encoded JSON>`), not React state or context
- Supabase called directly in the submit handler — no abstraction layer
- Tailwind dark theme: all colors defined as CSS custom properties in `index.css`, mapped via `@theme inline`

### Git Commit Style

```
feat: add [feature name]
fix: [what was broken] → [what it does now]
chore: [maintenance task]
docs: update README / WORKING_NOTES
```

---

## Decisions and Tradeoffs

- **Supabase over Replit's built-in PostgreSQL:** The user already had a Supabase project provisioned. Do not suggest migrating to Replit DB or Drizzle ORM.
- **Wouter over React Router:** Chosen for its minimal footprint in a simple two-page app. Do not suggest switching to React Router v6/v7 unless the routing needs grow significantly.
- **Results passed via URL query string:** Avoids the need for React Context, Zustand, or session storage. Accepted tradeoff: the URL becomes long and is not copy-pasteable as a clean permalink. This is known and acceptable for a class project.
- **`skip_app_build: true` in Azure workflow:** Azure's built-in Oryx builder cannot resolve pnpm workspace dependencies. The workflow installs and builds explicitly before the deploy step, then tells Azure to skip its own build. Do not remove this flag.
- **Free-text for `daily_screen_time`:** Accepted intentionally to allow creative/humorous responses. The tradeoff is dirty data in the database, which is acceptable for a class project.
- **Dark-only theme:** No light mode toggle. The dark aesthetic is part of the brand. Do not add a theme switcher.

---

## What Was Tried and Rejected

- **React Router** — rejected in favor of Wouter; do not suggest switching back
- **React Hook Form** — rejected; the form is simple enough for vanilla controlled inputs
- **Replit built-in PostgreSQL + Drizzle ORM** — rejected; user already had Supabase provisioned and preferred it
- **Passing results via React Context** — rejected in favor of URL query string encoding; avoids a provider wrapper for a two-page app
- **Azure's Oryx auto-build** — rejected; Oryx does not understand pnpm workspace `catalog:` references, causing install failures. The GitHub Actions workflow builds manually and sets `skip_app_build: true`

---

## Known Issues and Workarounds

**Issue 1: RLS not enabled on `survey_responses`**
- Any client with the anon key can insert rows. The anon key is embedded in the frontend bundle (this is standard for Supabase public keys), but without RLS the table is also open to arbitrary reads.
- **Workaround:** None currently. Do not remove the insert logic — just add a Supabase RLS policy when ready.
- **Resolution:** Enable RLS in Supabase and add: `CREATE POLICY "anon insert only" ON survey_responses FOR INSERT TO anon WITH CHECK (true);`

**Issue 2: `/results` breaks on hard refresh or direct URL entry (in Replit dev)**
- In the Replit dev proxy, navigating directly to `/results` may return a blank page because the dev server serves only from root.
- **Workaround:** Always navigate via the survey form submit flow during development. This is not an issue in production Azure SWA (handled by `staticwebapp.config.json`).

**Issue 3: `daily_screen_time` is free text with no validation**
- Users can enter anything, including non-numeric values. The results scoring logic uses `parseFloat()` and defaults to `0` if the value doesn't parse as a number.
- **Workaround:** `parseFloat(...) || 0` in `Results.tsx`. Do not remove this fallback.

---

## Browser / Environment Compatibility

### Frontend

- **Tested in:** Chromium (via Replit preview), Chrome 120+
- **Expected support:** All modern evergreen browsers (Chrome, Firefox, Edge, Safari 16+)
- **Known incompatibilities:** CSS `hsl(from ...)` relative color syntax used in `index.css` for automatic button border intensity is not supported in Firefox < 128 or Safari < 16.4. The fallback values (plain `hsl(var(...))`) are in place and will be used silently.

### Backend / Build Environment

- **OS:** Linux x64 (Replit NixOS; Azure Ubuntu runner)
- **Node.js:** 24 (Replit), 20 LTS (Azure GitHub Actions runner — specified in workflow)
- **Package manager:** pnpm 10
- **Environment variables required at build time:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `NODE_ENV=production`
- **Environment variables required at runtime (dev only):** `PORT`, `BASE_PATH` (injected by Replit; optional with defaults)

---

## Open Questions

- [ ] Should RLS allow anonymous reads as well as inserts, or insert-only? (Affects whether a future results dashboard can query without auth.)
- [ ] Should `daily_screen_time` be changed to a number input with a unit dropdown? Or keep it as a free-text humor field?
- [ ] Should the results be stored in Supabase and retrieved by ID to create shareable permalinks? Or is URL-encoded state sufficient?
- [ ] Will this app be submitted as-is for the class, or does it need further polish (loading states, animations, etc.)?
- [ ] Does the Azure SWA need a custom domain, or is the default `.azurestaticapps.net` subdomain acceptable?

---

## Session Log

### 2026-03-30

**Accomplished:**
- Scaffolded the full survey app inside the existing pnpm monorepo as a new `react-vite` artifact (`artifacts/detox-survey`)
- Built all 7 survey questions in `Survey.tsx` with all required input types (text, radio ×3, dropdown, checkboxes)
- Built `Results.tsx` with 4 diagnostic categories, a confession summary, and a fun fact card
- Integrated Supabase JS client (`src/lib/supabase.ts`); responses save to `survey_responses` on submit
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as shared environment variables
- Styled the full app with a dark theme using Tailwind CSS 4 custom properties
- Generated `README.md` with all project sections
- Generated `WORKING_NOTES.md` (this file)
- Configured for Azure Static Web Apps: updated `vite.config.ts` to be environment-agnostic, added `public/staticwebapp.config.json`, wrote `.github/workflows/azure-static-web-apps.yml`

**Left incomplete:**
- Azure deployment not yet tested end-to-end against a live Azure resource
- RLS not yet enabled on the Supabase table
- README author/contact fields are still placeholders

**Decisions made:**
- Use Supabase (user's existing project) instead of Replit's built-in DB
- Use Wouter for routing (lightweight, sufficient for two pages)
- Pass results via URL query string instead of shared state
- Use `skip_app_build: true` in Azure workflow because Oryx cannot handle pnpm workspaces

**Next step:** Push to GitHub → create Azure SWA resource → add three GitHub Secrets → confirm workflow green

---

## Useful References

- [Supabase JS Client docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Row Level Security guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Azure Static Web Apps documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [Azure SWA `staticwebapp.config.json` reference](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)
- [Azure/static-web-apps-deploy GitHub Action](https://github.com/Azure/static-web-apps-deploy)
- [pnpm workspaces documentation](https://pnpm.io/workspaces)
- [Wouter documentation](https://github.com/molefrog/wouter)
- [Vite `base` config reference](https://vite.dev/config/shared-options.html#base)
- [Tailwind CSS v4 docs](https://tailwindcss.com/docs)
- **AI tools used:** Replit AI Agent — used throughout for scaffolding, component generation, Supabase integration, Azure deployment configuration, and documentation generation. All generated code was reviewed for correctness against actual project files before committing.
