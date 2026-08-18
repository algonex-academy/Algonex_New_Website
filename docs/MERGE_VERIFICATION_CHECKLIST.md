# Pre-Merge Verification Checklist — `fixes/security-and-flow-audit`

Run this locally before merging PR #7. It verifies the fixes on this branch
without deploying. Check every box; if one fails, note it on the PR.

> Prereq: Docker Desktop running. A throwaway `.env` at the repo root is needed
> for the compose stack (dummy values are fine — it is gitignored):
> ```
> DJANGO_SECRET_KEY=local-test-only
> DJANGO_ALLOWED_HOSTS=*
> DB_NAME=algonex
> DB_USER=postgres
> DB_PASSWORD=postgres
> DB_HOST=db
> DB_PORT=5432
> CORS_ALLOWED_ORIGINS=http://localhost:5173
> ```

## 1. Automated checks (must all pass)

- [ ] **Backend test suite = 217 passed**
  ```
  docker compose -f docker-compose.yml -f docker-compose.test.yml \
    run --rm --no-deps backend python -m pytest -q
  ```
  (If `caddy depends on undefined service frontend` blocks it, add a one-off
  override disabling the `caddy` service, or run the CI workflow instead.)
- [ ] **Frontend production build succeeds**
  ```
  cd algonex-frontend && npm ci && npm run build
  ```
- [ ] **Backend imports/migrations load** (catches the new `token_blacklist` app
  and migration `signin/0013`)
  ```
  docker compose -f docker-compose.yml -f docker-compose.test.yml \
    run --rm --no-deps backend python manage.py migrate --check
  ```

## 2. Manual smoke tests (run the stack locally)

Bring the app up (backend + db + frontend) and walk these flows. Each maps to a
fix on this branch.

### Auth & security
- [ ] **Sign-in works with an admin session cookie present** — log into `/admin`,
  then sign in on the SPA in the same browser. No "CSRF Failed" (JWT-only auth).
- [ ] **Register wizard** — complete step 1 → step 2 → success. Confirms the new
  step-2 token flow does not block the legitimate path.
- [ ] **Step-2 IDOR is blocked** — replay a step-2 POST without `reg_token` (or
  with another email's token) → **400**, and the target profile is unchanged.
- [ ] **Account-takeover is closed** — POST `/api/v1/register/step1/` with an
  existing user's email and a new password → that account's password is **not**
  changed (log in with the old credentials still works; new password fails).
- [ ] **Photo upload rejects non-images** — submit `/api/v1/register/` with a
  `.html` file as `photo` → **400**; a real JPEG/PNG ≤3 MB succeeds and is stored
  under a UUID filename.
- [ ] **OTP reset lockout** — request a reset OTP, then submit 5 wrong codes →
  6th attempt is locked out (neutral error), and the OTP is invalidated.
- [ ] **Media headers** — `curl -I` any `/media/...` URL → response carries
  `X-Content-Type-Options: nosniff` and `Content-Disposition: attachment`.

### Session
- [ ] **Refresh a page while logged in** on a PUBLIC page (e.g. home) — you stay
  on the page (not bounced to `/signin`).
- [ ] **Fire several authenticated requests at once after the access token
  expires** — you are NOT logged out (single-flight refresh; rotated token kept).
- [ ] **Logout** then reuse the old refresh token → rejected (token_blacklist).
- [ ] **Google OAuth** (if creds are configured) — callback logs you in without a
  manual page reload.

### Payments & data
- [ ] **Add a payment in admin** (with and without a UPI id) → saves, no 500.
- [ ] **Approve a payment** → `paid_fee`/`balance_fee` update correctly; ID card
  and invoice render with legible text (DejaVu fonts).
- [ ] **Edit `total_fee` in admin** → `balance_fee` recomputes (no stale value,
  no Decimal/float 500).

### Module flows
- [ ] **Campus Crew register page while logged in** → form renders (no crash).
- [ ] **Event: cancel then re-register** for the same event → succeeds (no 500).
- [ ] **My Events** shows date/location and a working Cancel button.
- [ ] **External job listing** → shows "Apply on company site" link (no resume modal).
- [ ] **Buddy chat** → ask for jobs / courses / programs → cards return (no error).
- [ ] **Course detail page for a course that HAS a review** → renders (no crash).
- [ ] **Catalog pages** (courses/events/careers/programs/products) with >10 items
  → items 11–50 are now visible.
- [ ] **Fellowship / Internship / Training forms** → submitting creates a lead
  (check `/admin` ContactForm entries + admin notification), not a silent success.

## 3. Restore drill (do NOT skip — the S3 restore path changed)
- [ ] Create a fresh snapshot in the admin Backups page.
- [ ] Restore that snapshot into a **scratch** database (not prod) and confirm it
  completes, reports honest success, and row counts match. Old pre-`--clean`
  snapshots now also restore via the schema-reset path.

## 4. Known follow-ups NOT fixed on this branch (safe to merge without)

- **Private media storage** (HIGH) — files are hardened against execution but
  still publicly enumerable at `/media/...`. Needs private S3 + signed URLs.
- **Orphaned media** (MEDIUM) — replacing a photo / re-registering leaves the old
  file on disk. Disk hygiene only.
- **Backup/restore admin-role check** (MEDIUM) — `is_staff OR role=='admin'`;
  intentionally left as-is to avoid locking out a legitimate admin.
- **EmailLog dashboard counts** (LOW) — BCC sends are over-counted as delivered.

See `SECURITY_AND_FLOW_AUDIT.md` for the full fix log and the flow inventory link.
