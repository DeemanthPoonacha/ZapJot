# 🚀 ZapJot: Production Readiness & Scaling Guide

This guide evaluates the production readiness of ZapJot, estimates its user capacity limits, and provides a step-by-step roadmap to make it fully production-ready for launch.

---

## 1. Production Readiness Evaluation

With the implementation of **Firestore Security Rules**, **Zod Input Validation**, **Secure Cloudinary Signing**, and **GDPR Cascade Deletion**, the core security and data isolation flaws have been resolved.

However, to be considered **fully production-ready** for public release, there are still missing operational elements (Observability, Rate-Limiting, Pagination, and Backups).

### Status Breakdown

| Area | Status | Notes |
|---|---|---|
| **Data Tenancy & Security** | 🟢 Ready | Authenticated users can only read/write their own subcollections. |
| **Input Validation** | 🟢 Ready | Zod schemas validate all writes at the database layer. |
| **Cascade Data Deletion** | 🟢 Ready | GDPR compliant chunked deletion (400 docs max per batch). |
| **API Security** | 🟡 Partially Ready | `/api/sign-image` is secured; `/api/check-notifications` is protected by static secret. |
| **Infrastructure Scalability** | 🟢 Ready | Built on serverless architectures (Firebase, Next.js, Cloudinary). |
| **Observability (Logging/Errors)** | 🔴 Not Ready | No Sentry/LogRocket integration. Silent failures in client. |
| **Pagination & Optimization** | 🔴 Not Ready | Fetches all user tasks/journals/itineraries at once. High-memory risk. |
| **Backup & Recovery** | 🔴 Not Ready | No automated Firestore backups configured. |

---

## 2. Capacity: How Many Users Can It Handle?

Because ZapJot uses a **fully serverless architecture**, it scales dynamically. The user limit is governed by individual vendor constraints:

### Infrastructure Limits & Cost

| Service | Limits | ZapJot Impact / Max User Capacity |
|---|---|---|
| **Firebase Firestore** | 1,000,000 concurrent connections.<br/>10,000 writes/sec.<br/>Automatic scaling. | **Unlimited Users**. Firebase can easily support 10M+ users. |
| **Firebase Auth** | 100 verification emails/day (Free). | **100 sign-ups/day** on Spark Plan. Upgrade to Blaze Plan is required. |
| **Cloudinary** | Free tier: 25GB bandwidth / 25GB storage. | **~5,000 active users** uploading avatars/journal photos. |
| **Netlify / Vercel** | Free: 100GB bandwidth/month. | **~10,000 active users** browsing the site. |

### Architectural Scaling Bottlenecks

1. **Memory Pagination Bottleneck**:
   Currently, `getJournals` and `getTasks` fetch *all* user documents. If an active user creates 2,000 journals over 3 years, loading the list will fetch 2,000 documents at once, slowing down the client and driving up Firebase read costs.
2. **Itinerary Document Size limit (1MB)**:
   In `lib/services/itineraries.ts`, days and tasks are stored as nested arrays in a single document. If a user plans a 30-day trip with 15 tasks per day, the document size might exceed Firestore's 1MB limit, resulting in write crashes.

---

## 3. Comprehensive Checklist to Go Live

Follow this phased checklist to transition from development to a secure, enterprise-grade production environment.

### 🔴 Phase 1: High Priority (Must Have)

#### 1. Implement Firebase App Check
Protect your Firebase resources (Firestore, Cloud Storage) from abuse, billing spikes, and scraping by verifying that requests originate only from your registered domain.
- Register your app with **App Check** in Firebase Console.
- Configure **reCAPTCHA Enterprise** or **Cloudflare Turnstile** providers.
- Initialize App Check in your React app.

#### 2. Configure Firestore Backups
Firestore does not back up data by default. Implement automated daily exports to a Google Cloud Storage bucket.
- Set up a Google Cloud Function to trigger a daily export:
  ```gcloud
  gcloud firestore export gs://[YOUR_BACKUP_BUCKET]
  ```
- Set Object Lifecycle Management on the bucket to delete backups older than 30 days.

#### 3. Integrate Error Tracking & Observability
Ensure you are notified immediately when a user encounters a crash.
- Install **Sentry** for Next.js (`npx @sentry/wizard@latest -i nextjs`).
- Wrap client pages in Sentry ErrorBoundaries.
- Capture backend errors in API routes.

#### 4. Secure the Notification Cron Route
Currently, `/api/check-notifications` is protected by `NOTIF_SECRET`.
- Ensure `NOTIF_SECRET` is set to a long, cryptographically secure random string in production settings.
- Ensure the trigger cron service (like GitHub Actions, cron-job.org, or Google Cloud Scheduler) passes this token in the header.

---

### 🟡 Phase 2: Medium Priority (Should Have)

#### 5. Implement Cursor-Based Pagination
Refactor collection services to fetch data in pages using `limit()` and `startAfter()`.
- **Tasks & Journals**: Load the first 25 items. Implement infinite scroll or "Load More" controls.
- Update filters to support paginated queries.

#### 6. Refactor Itinerary Model to Subcollections
To prevent reaching the 1MB document limit, migrate the itinerary day and task data from arrays to subcollections:
- Path: `users/{userId}/itineraries/{itineraryId}/days/{dayId}`
- Path: `users/{userId}/itineraries/{itineraryId}/days/{dayId}/tasks/{taskId}`

#### 7. Enable Offline Data Persistence
Enable offline support so users can write journals or manage tasks on planes or in low-connectivity areas.
- Enable persistence in Firebase initialization:
  ```typescript
  import { enableMultiTabIndexedDbPersistence } from "firebase/firestore";
  enableMultiTabIndexedDbPersistence(db);
  ```

#### 8. Set Up Environment Protection & Git Hooks
- Ensure no `.env.local` or service accounts are committed to version control.
- Install **husky** and run `lint-staged` on pre-commit to check formatting, lint rules, and runs `pnpm build` before allowing commits.

---

### 🟢 Phase 3: Nice to Have (Post-Launch)

#### 9. Implement Rate Limiting on API Routes
Prevent DDoS attacks and token abuse.
- Add an API rate-limiting middleware using Redis or memory cache (e.g. `@upstash/ratelimit` or a custom Next.js middleware) restricting uploads and signing endpoint requests to 60 requests per minute per IP.

#### 10. Analytics & SEO Optimization
- Integrate Google Analytics or Vercel Analytics.
- Create a dynamic `sitemap.xml` and `robots.txt`.
- Verify the landing page metadata has correct OG (Open Graph) tags for social media previews.
