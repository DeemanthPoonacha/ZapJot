# 🚀 ZapJot: Production Readiness & Scaling Guide

This guide evaluates the production readiness of ZapJot, estimates its user capacity limits, and provides a step-by-step roadmap to make it fully production-ready for launch.

**Last Updated:** 2026-07-21 (v1.4.0)

---

## 1. Production Readiness Evaluation

### What's Already Done ✅

With the implementation of **Firestore Security Rules**, **Zod Input Validation**, **Secure Cloudinary Signing**, **GDPR Cascade Deletion**, **Google Calendar Real-Time Sync**, **Scheduled Push Notifications**, and **Firebase App Check (scaffolded)**, the core security and data isolation requirements have been met.

### Status Breakdown

| Area | Status | Notes |
|---|---|---|
| **Data Tenancy & Security** | 🟢 Ready | Firestore rules enforce user-scoped isolation via `isOwner(userId)`. |
| **Input Validation** | 🟢 Ready | Zod schemas validate all writes across tasks, events, goals, journals, characters, chapters, and itineraries. |
| **Cascade Data Deletion (GDPR)** | 🟢 Ready | Chunked batch deletion (400 docs/batch) purges all user subcollections recursively. |
| **API Security** | 🟢 Ready | `/api/sign-image` verified via Firebase Admin ID token. `/api/check-notifications` protected by `NOTIF_SECRET` bearer token. |
| **Scheduled Notifications** | 🟢 Ready | Netlify scheduled function triggers `/api/check-notifications` every minute via cron. |
| **Google Calendar Sync** | 🟡 Needs GCP Setup | Code is production-ready (real-time CRUD sync, recurrence, reminders). Requires Google Calendar API enablement and OAuth consent screen configuration in GCP Console. |
| **Firebase App Check** | 🟡 Scaffolded | `appCheck.ts` is implemented with `ReCaptchaV3Provider`. Needs `NEXT_PUBLIC_RECAPTCHA_V3_KEY` env var set and App Check enforcement enabled in Firebase Console. |
| **Observability (Logging/Errors)** | 🔴 Not Ready | No Sentry/LogRocket integration. Client errors are silent. |
| **Pagination & Optimization** | 🔴 Not Ready | Fetches all user documents at once per collection. High-memory risk at scale. |
| **Backup & Recovery** | 🔴 Not Ready | No automated Firestore backups configured. |
| **CI/CD Pipeline** | 🔴 Not Ready | No GitHub Actions workflows. No automated lint/build/test on PR. |
| **Rate Limiting** | 🟡 Partial | AI chat has client-side rate limiting. No server-side API route rate limiting. |
| **Offline Support** | 🔴 Not Ready | No Firestore offline persistence enabled. |

---

## 2. Capacity: How Many Users Can It Handle?

Because ZapJot uses a **fully serverless architecture**, it scales dynamically. The user limit is governed by individual vendor constraints:

### Infrastructure Limits & Cost

| Service | Limits | ZapJot Impact / Max User Capacity |
|---|---|---|
| **Firebase Firestore** | 1,000,000 concurrent connections.<br/>10,000 writes/sec.<br/>Automatic scaling. | **Unlimited Users**. Firebase can easily support 10M+ users. |
| **Firebase Auth** | 100 verification emails/day (Free). | **100 sign-ups/day** on Spark Plan. Upgrade to Blaze Plan is required. |
| **Cloudinary** | Free tier: 25GB bandwidth / 25GB storage. | **~5,000 active users** uploading avatars/journal photos. |
| **Netlify** | Free: 100GB bandwidth/month. 125K scheduled function invocations/month. | **~10,000 active users** browsing the site. Cron runs ~43,200 times/month (every minute). |
| **Google Calendar API** | 1,000,000 queries/day (default). | Effectively unlimited for single-tenant calendar sync. |
| **Gemini AI (Firebase AI Logic)** | Varies by plan and model. | Monitor token usage; implement server-side quotas if needed. |

### Architectural Scaling Bottlenecks

1. **Memory Pagination Bottleneck**:
   Currently, `getJournals`, `getTasks`, and `getEvents` fetch *all* user documents. If an active user creates 2,000 journals over 3 years, loading the list will fetch 2,000 documents at once, slowing down the client and driving up Firebase read costs.
2. **Itinerary Document Size Limit (1MB)**:
   In `lib/services/itineraries.ts`, days and tasks are stored as nested arrays in a single document. If a user plans a 30-day trip with 15 tasks per day, the document size might exceed Firestore's 1MB limit, resulting in write crashes.
3. **Notification Cron Scalability**:
   The cron function checks notifications every minute by scanning users. As user count grows beyond ~10,000, this scan needs to be indexed or sharded.

---

## 3. Comprehensive Checklist to Go Live

Follow this phased checklist to transition from development to a secure, production-grade environment.

### 🔴 Phase 1: Critical (Must Have Before Launch)

#### 1. Enable Firebase App Check in Production
The code is already scaffolded in `lib/services/firebase/appCheck.ts`. Complete the setup:
- [ ] Register your site with **reCAPTCHA v3** at [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin).
- [ ] Set `NEXT_PUBLIC_RECAPTCHA_V3_KEY` in your Netlify environment variables.
- [ ] Call `initAppCheck()` in the root app layout (currently only called from `ai.ts`).
- [ ] Enable **App Check enforcement** in Firebase Console for Firestore, Auth, and Cloud Storage.

#### 2. Enable Google Calendar API & OAuth Consent
The sync code is production-ready but the GCP project needs configuration:
- [ ] Enable the **Google Calendar API** in [Google Cloud Console](https://console.cloud.google.com/) for project `zapjot-8ea6d`.
- [ ] Add `https://www.googleapis.com/auth/calendar` to the OAuth consent screen scopes.
- [ ] Add authorized redirect URIs:
  - `https://zapjot-8ea6d.firebaseapp.com/__/auth/handler`
  - `https://zapjot-8ea6d.web.app/__/auth/handler`
- [ ] Submit for **Google OAuth verification** if publishing to external users (required for sensitive scopes).

#### 3. Configure Firestore Automated Backups
Firestore does not back up data by default. Implement automated daily exports:
- [ ] Create a Google Cloud Storage bucket for backups (e.g., `gs://zapjot-backups`).
- [ ] Set up a Cloud Scheduler job to trigger daily exports:
  ```bash
  gcloud firestore export gs://zapjot-backups/$(date +%Y-%m-%d)
  ```
- [ ] Set Object Lifecycle Management to delete backups older than 30 days.
- [ ] Test a restore from backup at least once.

#### 4. Integrate Error Tracking & Observability
Ensure you are notified immediately when a user encounters a crash:
- [ ] Install **Sentry** for Next.js: `npx @sentry/wizard@latest -i nextjs`.
- [ ] Wrap client pages in Sentry `ErrorBoundary` components.
- [ ] Capture backend errors in API routes (`/api/sign-image`, `/api/check-notifications`).
- [ ] Set up Slack or email alert rules for P0 errors.

#### 5. Set Up CI/CD Pipeline
Automate quality gates on every pull request:
- [ ] Create `.github/workflows/ci.yml` with:
  - `npm ci` → `npm run lint` → `npx tsc --noEmit` → `npm run build`
- [ ] Enable branch protection on `main` requiring CI checks to pass.
- [ ] Add Netlify deploy previews for PRs targeting `development`.

#### 6. Environment Variable Audit
- [ ] Verify all production environment variables are set in Netlify:
  - `NEXT_PUBLIC_RECAPTCHA_V3_KEY`
  - `NOTIF_SECRET` (cryptographically random, 32+ chars)
  - `CLOUDINARY_API_SECRET`
  - All `NEXT_PUBLIC_FIREBASE_*` variables
- [ ] Ensure `.env.local` and service account JSON files are in `.gitignore`.
- [ ] Rotate any secrets that may have been exposed during development.

---

### 🟡 Phase 2: Important (Should Have Within 2 Weeks)

#### 7. Implement Cursor-Based Pagination
Refactor collection services to fetch data in pages using `limit()` and `startAfter()`:
- [ ] **Tasks & Journals**: Load the first 25 items. Implement infinite scroll or "Load More" controls.
- [ ] **Events**: Paginate by date range (current month + upcoming).
- [ ] Update React Query hooks to support paginated/infinite queries.

#### 8. Refactor Itinerary Model to Subcollections
To prevent reaching the 1MB document limit, migrate the itinerary data:
- [ ] Path: `users/{userId}/itineraries/{itineraryId}/days/{dayId}`
- [ ] Path: `users/{userId}/itineraries/{itineraryId}/days/{dayId}/tasks/{taskId}`
- [ ] Write a one-time migration script for existing data.

#### 9. Server-Side API Rate Limiting
Prevent DDoS attacks and token abuse:
- [ ] Add rate-limiting middleware using `@upstash/ratelimit` or a custom Next.js middleware.
- [ ] Restrict `/api/sign-image` to 30 requests/min per user.
- [ ] Restrict `/api/check-notifications` to only accept requests from Netlify's scheduled function IPs or with valid `NOTIF_SECRET`.

#### 10. Set Up Git Hooks & Code Quality
- [ ] Install **husky** and **lint-staged**:
  ```bash
  npx husky init
  npm install -D lint-staged
  ```
- [ ] Configure pre-commit hooks to run `lint-staged` (ESLint + Prettier on staged files).
- [ ] Add a pre-push hook to run `npx tsc --noEmit`.

#### 11. Enable Offline Data Persistence
Enable offline support so users can write journals or manage tasks in low-connectivity areas:
- [ ] Enable Firestore persistence in the Firebase initialization:
  ```typescript
  import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
  
  const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
  ```

---

### 🟢 Phase 3: Polish (Post-Launch Improvements)

#### 12. Analytics & SEO Optimization
- [ ] Integrate **Google Analytics 4** or **Vercel Analytics**.
- [ ] Create a dynamic `sitemap.xml` and `robots.txt`.
- [ ] Verify all landing page metadata has correct Open Graph tags for social media previews.
- [ ] Add structured data (JSON-LD) for search engine rich results.

#### 13. Performance Optimization
- [ ] Audit bundle size with `@next/bundle-analyzer`.
- [ ] Lazy-load heavy components (AI chat, settings panels, calendar views).
- [ ] Implement image optimization via Next.js `<Image>` component with Cloudinary loader.
- [ ] Add Web Vitals monitoring (LCP, FID, CLS).

#### 14. Progressive Web App (PWA) Enhancements
- [ ] Add a complete `manifest.json` with icons, theme color, and start URL.
- [ ] Implement a service worker for push notification delivery.
- [ ] Enable "Add to Home Screen" prompt for mobile users.

#### 15. Notification System Hardening
- [ ] Implement exponential backoff for failed notification deliveries.
- [ ] Add a dead-letter queue for permanently failed notifications.
- [ ] Consider migrating from polling cron to Firebase Cloud Messaging (FCM) for real-time push.

#### 16. Google Calendar OAuth Token Refresh
- [ ] Implement automatic token refresh using Firebase's `getRedirectResult` or a server-side refresh flow.
- [ ] Handle expired tokens gracefully in the UI with a "Reconnect Calendar" prompt instead of silent failures.

---

## 4. Deployment Checklist (Day-of-Launch)

A condensed checklist for the actual go-live:

- [ ] Merge `development` → `main` via [PR #21](https://github.com/DeemanthPoonacha/ZapJot/pull/21).
- [ ] Verify all Netlify environment variables are set for production.
- [ ] Enable Firebase App Check enforcement.
- [ ] Enable Google Calendar API in GCP Console.
- [ ] Deploy Firestore security rules: `firebase deploy --only firestore:rules`.
- [ ] Deploy Firestore indexes: `firebase deploy --only firestore:indexes`.
- [ ] Verify Netlify scheduled function (`check-notifications`) is running.
- [ ] Smoke-test critical flows: sign-up, create event, sync calendar, delete account.
- [ ] Monitor Sentry and Netlify function logs for the first 24 hours.

---

## 5. Architecture Reference

```
┌─────────────────────────────────────────────────────────┐
│                     ZapJot v1.4.0                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Next.js App (Netlify)                                  │
│  ├── React UI + Tailwind/shadcn                         │
│  ├── React Query (state management)                     │
│  ├── Firebase Auth (Google, Email/Password)             │
│  ├── Firebase AI Logic (Gemini - Zappy AI companion)    │
│  ├── Cloudinary (image uploads, signed)                 │
│  └── Google Calendar API (real-time sync)               │
│                                                         │
│  API Routes                                             │
│  ├── /api/sign-image (Firebase Admin token verified)    │
│  └── /api/check-notifications (NOTIF_SECRET protected)  │
│                                                         │
│  Netlify Scheduled Functions                            │
│  └── check-notifications (cron: every minute)           │
│                                                         │
│  Firebase (Backend)                                     │
│  ├── Firestore (user-scoped data, Zod validated)        │
│  ├── App Check (reCAPTCHA v3 - scaffolded)              │
│  ├── Security Rules (tenant isolation)                  │
│  └── Composite Indexes                                  │
│                                                         │
│  Agent Skills (.agents/skills/)                         │
│  ├── backlog-workflow (issue → branch → PR automation)  │
│  ├── premium-frontend-ui (design standards)             │
│  └── create-github-issues-from-plan (issue generator)   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
