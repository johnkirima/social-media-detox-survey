# 📵 Social Media Detox Survey

## Description

The Social Media Detox Survey is a dark-humor web application that asks users 7 pointed questions about their social media habits and delivers a personalized "diagnosis" ranging from *Deceptively Functional* to *Terminal Scroll Syndrome*. Built as a class project, it exists to make people laugh at their own screen addictions while collecting real data. It's for anyone who has ever told themselves they "don't really use social media that much" — and lied about it.

---

## Badges

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## Features

- **7 darkly funny survey questions** covering screen time, platform preference, detox attempts, and more
- **Mixed input types** — text input, radio buttons, a dropdown list, and checkboxes all in one form
- **Client-side validation** with sarcastic error messages when fields are left blank
- **Personalized results page** — 4 diagnostic categories generated from your answers, complete with mock-clinical feedback
- **Supabase integration** — every submission is saved to a live PostgreSQL database in real time
- **Fully dark-themed UI** built with Tailwind CSS, optimized for both desktop and mobile
- **No login required** — anonymous submissions so respondents can be honest about their shameful habits
- **Instant redirect to results** after submission, passing answers securely via URL state

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI component framework |
| TypeScript 5.9 | Type safety across all components |
| Vite 7 | Build tool and local dev server |
| Tailwind CSS 4 | Utility-first dark-mode styling |
| Wouter | Lightweight client-side routing |
| Supabase JS | Database client for saving survey responses |
| pnpm Workspaces | Monorepo package management |

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [pnpm 10+](https://pnpm.io/installation) — `npm install -g pnpm`
- A [Supabase](https://supabase.com/) project with the `survey_responses` table created (SQL below)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johnkirima/social-media-detox-survey.git
   cd social-media-detox-survey
   ```

2. **Install all workspace dependencies**
   ```bash
   pnpm install
   ```

3. **Create the Supabase table** — run this in your Supabase project's SQL Editor:
   ```sql
   CREATE TABLE IF NOT EXISTS survey_responses (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at timestamptz DEFAULT now(),
     daily_screen_time text NOT NULL,
     phone_vs_child text NOT NULL,
     toxic_platform text NOT NULL,
     detox_methods text[] DEFAULT '{}',
     algo_ban_minors text NOT NULL,
     last_offline_day text NOT NULL,
     regret_level text NOT NULL
   );
   ```

4. **Set your environment variables** — create a `.env` file inside `artifacts/detox-survey/` (or set them in your host):
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

5. **Start the development server**
   ```bash
   pnpm --filter @workspace/detox-survey run dev
   ```

6. **Open the app** at [http://localhost:PORT](http://localhost:PORT) (PORT is assigned automatically)

---

## Usage

1. Navigate to the root URL — the survey form loads immediately with no login.
2. Answer all 7 questions:
   - Type your average daily screen time in the text field.
   - Select a radio option for the phone vs. firstborn dilemma.
   - Pick your most toxic platform from the dropdown.
   - Check off any detox methods you've attempted.
   - Select your stance on banning algorithms for minors.
   - Choose how long ago you last went offline.
   - Rate your regret level from 1–5.
3. Click **Submit & Face the Truth** — answers are validated, then saved to Supabase.
4. You are redirected to `/results` where your personalized diagnosis is displayed.
5. Click **Take the Survey Again** to restart (you won't).

### Configuration

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public API key |

---

## Project Structure

```
social-media-detox-survey/
├── artifacts/
│   └── detox-survey/               # Main survey application
│       ├── src/
│       │   ├── lib/
│       │   │   └── supabase.ts     # Supabase client initialization
│       │   ├── pages/
│       │   │   ├── Survey.tsx      # 7-question survey form with validation
│       │   │   └── Results.tsx     # Results page with diagnosis logic
│       │   ├── App.tsx             # App root with Wouter routing
│       │   ├── index.css           # Dark theme CSS variables and Tailwind setup
│       │   └── main.tsx            # React DOM entry point
│       ├── package.json            # Package dependencies and scripts
│       ├── tsconfig.json           # TypeScript config (extends workspace base)
│       └── vite.config.ts          # Vite build and dev server config
├── lib/
│   ├── api-spec/                   # OpenAPI spec and Orval codegen config
│   ├── api-client-react/           # Generated React Query hooks
│   ├── api-zod/                    # Generated Zod validation schemas
│   └── db/                         # Drizzle ORM schema and DB connection
├── artifacts/api-server/           # Shared Express API server
├── pnpm-workspace.yaml             # pnpm workspace and catalog pin config
├── tsconfig.base.json              # Shared TypeScript compiler options
├── tsconfig.json                   # Root TypeScript project references
├── package.json                    # Root scripts and shared dev tooling
└── README.md                       # This file
```

---

## Changelog

### v1.0.0 — 2026-03-30

- Initial release of the Social Media Detox Survey
- 7 survey questions with text, radio, dropdown, and checkbox input types
- Supabase database integration for persisting responses
- Results page with 4 personalized diagnostic categories
- Full client-side form validation with dark-humor error messages
- Dark-themed responsive UI built with Tailwind CSS
- Client-side routing between survey and results pages via Wouter

---

## Known Issues / To-Do

- [ ] Supabase Row-Level Security (RLS) is not yet configured — enable RLS and add an insert policy before going to production
- [ ] No confirmation email or receipt sent to respondents after submission
- [ ] Results page is not shareable via a stable permalink — answers currently passed through URL state only, which breaks on hard refresh
- [ ] Screen time input accepts free text; a numeric-only field with unit selection would reduce dirty data
- [ ] No admin dashboard to view or export aggregated survey responses

---

## Roadmap

- **Aggregate results view** — a public-facing page showing anonymized stats across all submissions (most toxic platform, average screen time, etc.)
- **Shareable result cards** — generate a downloadable image of your diagnosis to post on social media (ironically)
- **Classroom mode** — instructor dashboard to view class responses, filter by question, and export to CSV
- **Multilingual support** — translate the survey into Spanish and French for broader classroom use
- **Progressive quiz format** — show one question at a time with a progress bar instead of a single long form

---

## Contributing

Contributions are welcome, especially for improving question quality, accessibility, or Supabase RLS configuration. Please open an issue before submitting a large change so we can discuss the approach first.

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature-name`
3. Make your changes and commit — `git commit -m "feat: describe your change"`
4. Push to your branch — `git push origin feature/your-feature-name`
5. Open a Pull Request against `main` and describe what you changed and why

---

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute it with attribution.

---

## Author

**John Kirima**  
Institution: University of Iowa  
Course: BAIS:3300 - Digital Product Management

---

## Contact

GitHub: [github.com/johnkirima](https://github.com/johnkirima)

---

## Acknowledgements

- [Supabase Documentation](https://supabase.com/docs) — for the database setup and JavaScript client guides
- [Tailwind CSS Docs](https://tailwindcss.com/docs) — utility-first styling reference
- [Wouter](https://github.com/molefrog/wouter) — lightweight React router
- [Vite](https://vite.dev/) — fast build tooling and HMR dev experience
- [shields.io](https://shields.io/) — badge generation
- [Replit](https://replit.com/) — development and hosting environment
- **Replit AI Agent** — assisted with scaffolding, component structure, Supabase integration, and code generation throughout development
