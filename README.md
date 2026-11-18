# ReadEarn

A reading and referral rewards platform built with React, Vite and Supabase.

## Local development

1. Install Node.js.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add your Supabase project URL and publishable/anon key to `.env`.
5. Run `npm run dev`.

## Vercel deployment

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Vercel environment variables.

Never place a Supabase service-role key in frontend code or a VITE_ environment variable.

## Current status

The public landing page is the first implementation step. Authentication, member dashboard, reward ledger, referrals, withdrawals and admin tools will be connected in later steps. Reward eligibility and withdrawal rules must be configured transparently before launch.
