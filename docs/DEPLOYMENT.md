# Deployment guide

Production setup (all free plans):

| Piece            | Where                                                                        |
| ---------------- | ---------------------------------------------------------------------------- |
| Website          | Vercel Hobby, project `debjyoti-sarkar` → https://debjyoti-sarkar.vercel.app |
| Database / Auth  | Supabase project `hnouykdscphknsxwcibo` (shared with **HearMe**)             |
| Contact function | Supabase Edge Function `portfolio-contact`                                   |
| Email            | Resend (optional)                                                            |

## Sharing the Supabase project with HearMe

The portfolio lives entirely in its own namespace so it can never break HearMe:

- Tables, functions and policies: schema **`portfolio`** (HearMe uses `public`).
- Storage buckets: **`portfolio-media`**, **`portfolio-documents`**.
- Edge Function: **`portfolio-contact`**; its secrets are all prefixed **`PORTFOLIO_`** because function secrets are
  project-wide.
- **Never run `supabase config push` or `supabase db push` against this project from this repo.** `config push`
  would overwrite HearMe's auth settings (sign-ups, redirect URLs), and `db push` would create a migration history
  that conflicts with HearMe's own workflow. Apply SQL directly instead (below).
- Admin access is the `portfolio.admins` allow-list. HearMe users can sign up to Supabase Auth, but that grants no
  portfolio access.

## Shipping a schema change

1. Add a new file in `supabase/migrations/` and test locally (`npm run db:reset`, `npm run db:types`, `npm run test:e2e`).
2. Apply it to production in a single transaction:

   ```bash
   { echo "begin;"; cat supabase/migrations/<new-file>.sql; echo "commit;"; } > /tmp/migration.sql
   supabase db query --linked --project-ref hnouykdscphknsxwcibo -f /tmp/migration.sql
   ```

3. Commit and push — Vercel redeploys automatically.

## Exposed schema (one-time, already done)

Dashboard → **Integrations → Data API → Settings → Exposed schemas** must include `portfolio` (alongside `public` and
`graphql_public`, which HearMe needs).

## Admin account (already done)

Your existing account `debjyoti.sarkar257@gmail.com` is the portfolio admin — sign in at `/admin` with your **existing
HearMe password**. To grant access to an account later:

```sql
insert into portfolio.admins (user_id)
select id from auth.users where lower(email) = 'someone@example.com' on conflict do nothing;
```

## Contact form: secrets and Resend

Current production secrets: `PORTFOLIO_ALLOWED_ORIGINS`, `PORTFOLIO_RATE_LIMIT_SALT`, `PORTFOLIO_CONTACT_NOTIFY_TO`,
`PORTFOLIO_CONTACT_NOTIFY_FROM`. Messages are always stored and visible in **/admin → Messages**.

To also receive an email for every message:

1. Create a free account at <https://resend.com> **with `debjyoti.sarkar257@gmail.com`** (without a verified domain,
   Resend only delivers to the account's own address from `onboarding@resend.dev` — exactly what's needed here).
2. **API Keys → Create** (sending access), then:

   ```bash
   supabase secrets set --project-ref hnouykdscphknsxwcibo PORTFOLIO_RESEND_API_KEY=re_...
   ```

   No redeploy needed. To change the function code: `supabase functions deploy portfolio-contact --project-ref
hnouykdscphknsxwcibo --no-verify-jwt`.

## Vercel

- `main` → production; every other branch / PR → a preview URL (previews are `noindex`, see `src/app/robots.ts`).
- Environment variables (Project → Settings → Environment Variables):

  | Name                                   | Production                                 | Preview |
  | -------------------------------------- | ------------------------------------------ | ------- |
  | `NEXT_PUBLIC_SUPABASE_URL`             | `https://hnouykdscphknsxwcibo.supabase.co` | same    |
  | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | publishable key                            | same    |
  | `NEXT_PUBLIC_SITE_URL`                 | `https://debjyoti-sarkar.vercel.app`       | —       |

  **Never** add the service-role / secret key to Vercel — the app doesn't use it.

- Previews read the same production data (the free plan's project limit is used by HearMe and WishFlowAI). They can't
  submit the contact form unless their URL is added to `PORTFOLIO_ALLOWED_ORIGINS`.

## Résumé and media

- Résumé: replace `public/resume.pdf` and push (also served at `/resume`).
- Covers, screenshots and note images: upload from **/admin**; they go to the `portfolio-media` bucket.

## Keep-alive (optional)

HearMe's traffic keeps this project active. If the portfolio ever moves to its own free project, enable
`.github/workflows/supabase-keepalive.yml` by adding repository variable `SUPABASE_URL` and secret
`SUPABASE_PUBLISHABLE_KEY` (Settings → Secrets and variables → Actions).

## Custom domain (optional, ~₹800–1,200/yr)

1. Buy a domain (Cloudflare Registrar, Namecheap, Porkbun…).
2. Vercel → Project → **Settings → Domains → Add** `yourdomain.dev` (+ `www`), then add the DNS records Vercel shows
   (typically `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`). HTTPS is automatic.
3. Update `NEXT_PUBLIC_SITE_URL` in Vercel and redeploy, then
   `supabase secrets set --project-ref hnouykdscphknsxwcibo PORTFOLIO_ALLOWED_ORIGINS=https://yourdomain.dev,https://debjyoti-sarkar.vercel.app`.
4. Only submit to <https://hstspreload.org> once every subdomain will always serve HTTPS.

## Post-deploy checks

- Lighthouse (mobile + desktop) on `/`, `/projects`, `/projects/hearme`.
- Send a test message from the live contact form and check **/admin → Messages**.
- <https://securityheaders.com> for headers.
- Google Search Console → add the property → submit `/sitemap.xml`.
