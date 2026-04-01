# MindScreen Pro

This project now has both:

- a Vite frontend
- an Express API backend

Main files:

- `index.html`
- `package.json`
- `.env.example`
- `src/main.js`
- `src/app.js`
- `src/apiClient.js`
- `src/data.js`
- `src/db.js`
- `src/session.js`
- `src/supabase.js`
- `src/styles.css`
- `server/index.js`
- `server/app.js`
- `server/database/schema.sql`
- `supabase/schema.sql`

Run frontend only in VS Code:

1. Open the `mindscreen-new-app` folder in VS Code.
2. Open the terminal in VS Code.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL shown by Vite.

Run full stack in VS Code:

1. Open the `mindscreen-new-app` folder in VS Code.
2. Open the terminal in VS Code.
3. Run `npm install`
4. Run `npm run dev:server`
5. In a second terminal run `npm run dev`
6. Open the local URL shown by Vite.

Or run both together with:

- `npm run dev:full`

Notes:

- The app now tries the API first and falls back to `IndexedDB` if the backend is not running.
- The app uses `localStorage` for admin session state.
- A real Supabase database schema is included in `supabase/schema.sql`.
- A full backend-ready SQL schema is included in `server/database/schema.sql`.
- Behavioral analytics history is stored in the `behavior_snapshots` table when Supabase is configured.
- If you want fresh demo data, click the `Reset DB` button in the app.
- The old root `app.js` and `style.css` are legacy copies from before the Vite upgrade and are no longer the main entry files.

Supabase setup:

1. Create a Supabase project.
2. Open the SQL editor in Supabase.
3. Paste and run `supabase/schema.sql`.
4. Copy `.env.example` to `.env`.
5. Fill in:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Run `npm install`
7. Run `npm run dev`

Current status:

- The app still works locally with IndexedDB.
- When Supabase is configured, user records and behavior snapshots are synced to the cloud.
- If you already ran the old schema, run `supabase/schema.sql` again to add the new `behavior_snapshots` table.

Demo login:

- Email: `admin@mindscreen.app`
- Password: `123456`
