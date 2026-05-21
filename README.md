# Wedding Expenses

A small React + Supabase web app for tracking shared wedding spending — per-event totals, per-category breakdown, paid vs outstanding, and who-pays-what (50/50 shared vs non-shared rows).

Built with **Vite + React (JSX) + Tailwind v3 + Supabase + Recharts**.

---

## 1. Setup

```bash
npm install
```

Copy `.env.example` to `.env` (or edit the existing `.env`) with your Supabase project URL and publishable key:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_or_anon_key
```

## 2. Database

In the Supabase dashboard → **SQL Editor**:

1. Run [`supabase/schema.sql`](supabase/schema.sql) — creates the `expenses` table, enums, RLS policies, and `updated_at` trigger.
2. (Optional, recommended) In **Authentication → Providers → Email**, turn **off** "Confirm email" while in development so you can log in immediately after signing up.

## 3. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

1. Sign up with any email + password (≥ 6 chars).
2. Edit `supabase/seed.sql`: replace `REPLACE_WITH_YOUR_EMAIL@example.com` with the email you just signed up with, then run it in the SQL Editor. This imports the original 25 rows from the Excel.
3. You'll land on the dashboard with totals, charts, and the who-pays-what card.

## 4. Build

```bash
npm run build
npm run preview
```

Deploy `dist/` to Vercel, Netlify, Cloudflare Pages, etc.

---

## Folder structure

```
src/
├── components/
│   ├── auth/         # ProtectedRoute
│   ├── dashboard/    # SummaryCards, EventBreakdown, CategoryBreakdown, SplitCard
│   ├── expenses/     # ExpenseTable, ExpenseForm, ExpenseFilters
│   ├── layout/       # AppShell, Navbar
│   └── ui/           # Spinner, Modal, Badge, StatCard
├── constants/        # events, categories, share types, colors
├── context/          # AuthContext (Supabase auth wrapper)
├── hooks/            # useExpenses (loads + CRUD with optimistic local state)
├── lib/              # supabase client
├── pages/            # Login, Dashboard, Expenses
├── utils/            # calculations (pure), formatters
├── App.jsx           # routes
├── main.jsx          # entry
└── index.css         # Tailwind + small @layer components
supabase/
├── schema.sql        # tables, enums, RLS, trigger
└── seed.sql          # 25 imported rows (edit email first)
```

## Notes & extension ideas

- Currency is AUD by default — change in `src/utils/formatters.js`.
- To invite a partner: add a `household_id` column, a `household_members` table, and broaden RLS to `household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())`.
- Receipts: add a `receipt_url` column and use Supabase Storage.
- Realtime: the `useExpenses` hook can be upgraded by adding `supabase.channel('expenses').on('postgres_changes', ...)`.
