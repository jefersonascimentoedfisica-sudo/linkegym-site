# Security hardening notes

Applied in `codex/security-hardening-critical-fixes`.

## Fixed in this branch

- Removed committed database/Supabase credentials from examples, docs, and scripts.
- Added authenticated API access checks for users, students, bookings, consultations, payments, reviews, favorites, professionals, and personal requests.
- Changed payment routes so Stripe does not return mock payment intents or fake `succeeded` statuses.
- Changed the payment modal so it fails closed when real Stripe checkout is not configured.
- Updated `next`, `drizzle-orm`, `drizzle-kit`, and dependency overrides to remove current `npm audit --omit=dev` findings.
- Fixed professional registration so the phone number is not used as the account password.

## Database validation

Direct database validation was attempted from this workspace, but the configured Postgres host in the old `.env.example` did not resolve over DNS. The legacy Supabase project URL in scripts/docs also did not resolve from this workspace.

Before deploying, run schema validation from an environment with database access:

```bash
npm run db:generate
npm run db:migrate
npm run build
```

## Remaining structural risk

- The build compiles, but strict type validation is still blocked by pre-existing TypeScript debt in legacy pages/components.
- Lint runs, but the codebase still has broad legacy `any`/React lint debt.
- The data model still needs consolidation between `users`, `students`, and professional records.
