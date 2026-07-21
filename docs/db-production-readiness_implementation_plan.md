# Database Production Readiness & Security Plan

This plan details the implementation to make the database production-ready. The changes are submitted in **Pull Request [#16](https://github.com/DeemanthPoonacha/ZapJot/pull/16)** and address:
- **Firestore Security Rules & Indexes** (resolves [#12](https://github.com/DeemanthPoonacha/ZapJot/issues/12))
- **Service-Layer Schema Validation** (resolves [#13](https://github.com/DeemanthPoonacha/ZapJot/issues/13))
- **Cascading GDPR User Deletion** (resolves [#14](https://github.com/DeemanthPoonacha/ZapJot/issues/14))
- **Secure Image-Signing API Endpoint** (resolves [#15](https://github.com/DeemanthPoonacha/ZapJot/issues/15))

## Proposed Changes

### Security Rules and Configuration

#### `firestore.rules`
- Restrict read/write access to user-specific subcollections to the authenticated user matching the `userId` wildcard: `users/{userId}/{document=**}`.
- Restrict `pushSubscriptions` access to creation for any authenticated user, and read/delete only if `resource.data.userId == request.auth.uid`.

#### `firestore.indexes.json`
- Define composite indexes for tasks (`highPriority` desc + `status`), events (`nextOccurrence` asc + filtering), and collection group index for `events` (`nextNotificationAt` asc).

#### `firebase.json`
- Reference `firestore.rules` and `firestore.indexes.json` so they are correctly configured for deployment.

#### [NEW] `lib/services/firebase/admin.ts`
- Centralize Firebase Admin SDK initialization to prevent duplicate client initialization and manage credentials securely via environment variables.

---

### Service-Layer Zod Validation

We will integrate Zod validation (`.parse()`) at the service boundary before any write (`addDoc`, `setDoc`, `updateDoc`).

#### `lib/services/tasks.ts`
- Validate input using `createTaskSchema` on `addTask` and `updateTaskSchema` on `updateTask`.

#### `lib/services/events.ts`
- Validate input using `createEventSchema` on `addEvent` and `updateEventSchema` on `updateEvent`.
- Replace unstable async `.map(...)` loop with `Promise.all(...)` to fix participant reminder sync.
- Refactor event filtering to query Firestore `documentId()` instead of an explicit `"id"` property.

#### `lib/services/goals.ts`
- Validate input using `createGoalSchema` on `addGoal` and `updateGoalSchema` on `updateGoal`.

#### `lib/services/characters.ts`
- Validate input using `createCharacterSchema`/`updateCharacterSchema`.

#### `lib/services/chapters.ts`
- Validate input using `createChapterSchema`/`updateChapterSchema`.

#### `lib/services/journals.ts`
- Validate input using `createJournalSchema`/`updateJournalSchema`.
- Standardize the `updatedAt` field on journal moves/creates to use ISO strings consistently.
- Wrap `moveJournal` (create + delete) in a transaction or ensure safe atomic-like error recovery.

#### `lib/services/itineraries.ts`
- Validate input using `createItinerarySchema`/`updateItinerarySchema`.

#### `components/planner/events/EventForm.tsx`
- Standardize date input formats with padding to align with schema requirements.

---

### Account and Configuration

#### `lib/services/user-config.ts`
- Implement `deleteUserData()`:
  - Query and delete all documents in subcollections: `tasks`, `events`, `goals`, `characters`, `chapters` (and nested `journals`), `itineraries`.
  - Batch delete operations in chunks of 500 documents to avoid Firestore batch size limitations.
  - Delete user-specific settings in `users/{userId}`.

---

### API Authentication & Client Uploads

#### `app/api/sign-image/route.ts`
- Add authorization header check using the centralized Firebase Admin SDK.
- Fallback/bypass in development only if config isn't set, but strictly enforce in production.

#### `components/ui/upload-avatar.tsx` & `components/ui/upload-image.tsx`
- Secure client signatures by calling `signatureEndpoint={`/api/sign-image?token=${token}`}`.
- Prevent widget interaction prior to token load using custom loading states (`<CustomLoader />`).

---

### Serverless Scheduled Cron

#### [NEW] `netlify/functions/check-notifications.ts`
- Implement a Netlify scheduled function triggered every minute (`* * * * *`) that securely fetches `/api/check-notifications` passing the authorization Bearer token.

---

## Verification Plan

### Automated Tests
- Run `pnpm build` to verify there are no TypeScript compile/build errors.

### Manual Verification
- Test creating a task and event with invalid payloads (e.g. empty title, invalid date) and check that validation errors are thrown.
- Test cascading user deletion and verify in Firestore console/emulator that all subcollections under the deleted user are fully purged.
- Verify image upload/signature request includes authorization token.
