# Security & Data-Flow Audit — August 2026

Branch: `fixes/security-and-flow-audit` · Base: `main` @ `b834555`

This branch carries the fixes from a multi-agent audit of authentication, data
flow, and media/file storage. It is **not merged** and has **one known test
regression** (see the end). Review, resolve the regression, then merge.

## How this was produced

Two things ran: a **deep hunt** (4 finder agents over media storage, auth/access
control, backend data-flow, frontend data handling — each with adversarial
verification of every CRITICAL/HIGH claim), and two **fix waves** (14 module
agents editing disjoint file sets in place). Every backend file compiles
(`py_compile`); the frontend production build passes (`npm run build`). The
backend test suite is **215/216** — one regression, documented below.

---

## Fixed on this branch (26 fixes)

### Security (commit `b80d444`)
| Sev | Fix | File |
|-----|-----|------|
| CRITICAL | **Account takeover closed.** Public `register_step1()` and `StudentRegisterView` no longer set a password on an *already-existing* account — that let anyone who knew an email hijack every password-less (imported / OAuth) account. First passwords must now come via the setup-email token link or OTP reset. | `signin/services.py`, `signin/views.py` |
| HIGH | **Unrestricted upload closed.** Registration photo is validated (JPEG/PNG/WebP, ≤3 MB) and stored under a server-generated UUID filename, so `photo=x.html` can no longer be uploaded and served same-origin as executable HTML (stored-XSS → JWT theft). | `signin/views.py` |
| HIGH | **OTP brute-force closed.** Reset-verify endpoint gains `throttle_scope=auth_check` plus a per-email attempt counter (lockout + OTP invalidation after 5 tries). | `accounts/views.py` |
| HIGH | **Media hardened.** Caddy serves `/media/*` with `X-Content-Type-Options: nosniff` and `Content-Disposition: attachment` so uploads can never execute on the app origin. | `Caddyfile` |

### Authentication & session (commit `d922cd4`)
- Installed `token_blacklist` app → logout and refresh-rotation actually revoke tokens now.
- Defined `OAUTH_CALLBACK_URL` (prod `https://algonex.co.in/auth/callback`, dev `localhost:5173`) to match the SPA redirect_uri → Google OAuth token exchange can succeed.
- `CustomRegisterSerializer` generates a unique username (suffix retry) instead of 500ing on the second same-prefix email.
- **Single-flight token refresh** in `client.js` — concurrent 401s share one refresh call, so they don't burn the rotated token and force a logout.
- OAuth callback awaits `refreshUser()` (UI reflects login without a hard reload); ProfilePage: My Certificates parse fix + a working **Change Password** form.

### Module flows (commit `242130d`)
- `courses/permissions.py`: removed imports of deleted `Module`/`Topic` models that 500'd every instructor object-permission check.
- **Events:** re-register after cancel reuses the cancelled row (no `unique_together` 500); My Events now renders date/location and the Cancel button works.
- **Careers:** external job listings show an "Apply on company site" link instead of dead-ending in the resume modal.
- **Campus Crew:** `.strip()` → `.trim()` so logged-in users don't hit the crash screen.
- **Buddy chat:** `get_jobs`/`get_courses`/`get_programs` use the current M2M tag + feedback relations and null-safe dates → chat discovery no longer errors.

### Admin, data integrity & rendering (commits `d9e8c2a`, `5f35df8`)
- `StudentRegistration.save` recomputes `balance_fee` on every save → admin edits to `total_fee` no longer leave a stale balance.
- Student import + admin: None-safe cells, real name column for `first_name` (never the essay), `paid_fee` readonly, employment/consent fieldset, conflict-drop warning on import.
- `EmailLog` admin add disabled (was inserting blank rows).
- Dockerfile: `fonts-dejavu-core` added so ID cards/invoices render legibly in prod.
- **Fellowship/Internship/Training forms** now POST to `/contact/submit-form/` as leads (were showing "success" while sending nothing).
- `CourseDetailPage` renders review objects properly (was crashing once a course had any review); FAQ/Gallery robust pagination parsing; AnnouncementBanner respects the deactivated flag.

---

## ✅ Regression resolved

The earlier regression (`test_student_register_creates_user_and_payment` 500ing)
was **not** the fonts — the real cause was the new `balance_fee` recompute in
`StudentRegistration.save()` doing `Decimal - float`: the registration view
assigns `paid_fee = 0.0` (a float) while `total_fee` is a Decimal, and
`Decimal - float` raises `TypeError`. Fixed by coercing both operands to
`Decimal` in `save()` before subtracting. **Test suite is now 216/216.**

---

## Still FOUND, not yet fixed (backlog)

From the deep hunt, verified but deliberately out of scope for this branch:

- **Media is still public & enumerable** (ID cards, invoices, resumes, photos). The nosniff/attachment headers stop code execution but not access — needs private S3 storage or signed URLs. (HIGH)
- `/register/step2/` **profile overwrite (IDOR)** — an unauthenticated caller can overwrite any student's profile by email. The takeover fix removes the password vector but the profile-overwrite path should still get an ownership/verification gate. (HIGH)
- **Orphaned media files** accumulate on photo replacement / re-registration. (MEDIUM)
- **Account/password-status enumeration** via `/auth/check-email/` and `/auth/send-setup-email/`. (MEDIUM)
- **Concurrent payment approvals** can lose `paid_fee` updates (no row lock around read-modify-write). (MEDIUM)
- Catalog list pages fetch only **page 1 (10 items)** — no pagination UI, rest unreachable. (MEDIUM)
- Backup/restore APIs authorize by `is_staff OR role=='admin'` — inconsistent with the rest of the platform. (MEDIUM)
- EmailLog dashboard mislabels recipient totals / over-counts BCC as delivered. (LOW)
- ProfilePage passes a DRF error object to `message.error` on the payment-submit path (can crash instead of showing a message). (LOW)

Companion inventory of *all* flows (OK / risky / broken): the Flow Inventory artifact
(https://claude.ai/code/artifact/912ac47b-f26c-4195-985c-d3fd55879d39).
