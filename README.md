# ASU Data Center — Demonstration Prototype

A high-fidelity, interactive front-end prototype of the proposed **Ain Shams University
Integrated University Data Center**. Built for a presentation to university leadership —
**this is a static, frontend-only demo with no backend, no database, and no real
university data.** All figures shown are fictional sample data for illustration only.

## What this demonstrates

- One university-wide, role-based view of institutional performance for the President
- Centralized platform / decentralized data ownership
- Descriptive → diagnostic → predictive analytics, with a human decision-maker always
  kept in the loop before any AI-flagged insight becomes an institutional action
- Privacy and governance built into the platform (role-based access, anonymized
  student-level views, audit-ready data pipeline)

## Tech stack

- React + Vite (static site, no backend)
- React Router (`HashRouter`, so it works out of the box on GitHub Pages without a
  server-side rewrite rule)
- Recharts for charts, Lucide for icons
- Plain CSS (no framework) — a custom institutional design system in `src/styles/global.css`

## 1. Install

```bash
npm install
```

## 2. Run locally

```bash
npm run dev
```

Opens at `http://localhost:5173/asu-data-center/` (the `/asu-data-center/` base path is
configured so local dev matches the production GitHub Pages URL).

## 3. Build for production

```bash
npm run build
```

Outputs a static site to `dist/`. Preview it locally with:

```bash
npm run preview
```

### Building for a different repository name

The Vite `base` path defaults to `/asu-data-center/`. If you fork or rename the
repository, either:

- Set it at build time: `VITE_BASE="/your-repo-name/" npm run build`, or
- Edit the fallback in `vite.config.js`.

The included GitHub Actions workflow does this automatically using the actual repo name.

## 4. Deploy to GitHub Pages

**Automatic (recommended):** A workflow at `.github/workflows/deploy.yml` builds and
deploys the site to GitHub Pages on every push to `main`.

1. Push this project to a GitHub repository.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).
4. The site will be published at `https://<your-username>.github.io/<repo-name>/`.

**Manual alternative:**

```bash
npm run build
# then publish the contents of dist/ to a gh-pages branch using any static host
```

## Project structure

```
src/
  components/     Shared UI: Sidebar, Topbar, Layout, KpiCard, Modal, workflow modals
  context/        AppContext (language/RTL/auth/theme), SearchContext
  data/           dummyData.js (all sample data), translations.js (EN/AR strings)
  pages/          One file per route (Executive Overview, Faculties, Finance, ...)
  styles/         global.css — the institutional design system
```

## Demo flow (5–10 minutes)

1. **Login** → Enter Data Center
2. **Executive Overview** — five KPI cards, multi-year performance trend, faculty
   comparison heatmap
3. Click **Engineering** in the faculty table → faculty drill-down → click a department
4. Back to **Executive Overview** → open **AI Insights** → open the at-risk-students
   insight → see why it was flagged → **Flag for Follow-up**
5. **Reports** → **Generate Executive Report** (simulated)
6. **Data Governance** → data pipeline, connected sources, and the privacy & security
   controls built into the platform

## Notes

- All data is fictional and internally consistent (`src/data/dummyData.js`); nothing here
  reflects real Ain Shams University figures.
- No backend, authentication server, or external API calls — this is safe to demo
  offline once built.
- The Arabic toggle (`EN | العربية`) switches the interface to RTL and translates the
  navigation and key headings.
