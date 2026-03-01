# Fix: "Could not find the table 'public.prescriptions' in the schema cache"

Create the missing `prescriptions` table in Supabase:

## Steps

1. Open **[Supabase Dashboard](https://supabase.com/dashboard)** and select your project.
2. Go to **SQL Editor** (left sidebar).
3. Click **New query**.
4. Open this file in your project: **`supabase/RUN_THIS_CREATE_PRESCRIPTIONS.sql`**  
   Copy its **entire** contents into the SQL Editor.
5. Click **Run** (or press Ctrl+Enter).
6. You should see **"Success. No rows returned"** — that’s correct.
7. Refresh your app (reload the prescriptions page or try creating a prescription again).

## If you get an error

- **"relation public.appointments does not exist"** (or `doctors` / `users`):  
  Your `appointments`, `doctors`, or `users` tables may have different names or live in another schema. Create those first or adjust the `REFERENCES` in the script to match your schema.
- **"permission denied"**:  
  Use an account that can create tables (e.g. project owner or a role with DDL rights).

After the script runs successfully, the schema cache will include `public.prescriptions` and the error should stop.
