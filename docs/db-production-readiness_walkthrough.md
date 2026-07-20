# Walkthrough — Database Production Readiness & Security

This implementation addresses the database production readiness and security checklist under **Pull Request [#16](https://github.com/DeemanthPoonacha/ZapJot/pull/16)**. We have successfully implemented the security, data validation, and privacy mechanisms required to make the database production-ready.

The changes address the following issues:
- **Firestore Security Rules & Indexes** (resolves [#12](https://github.com/DeemanthPoonacha/ZapJot/issues/12))
- **Service-Layer Schema Validation** (resolves [#13](https://github.com/DeemanthPoonacha/ZapJot/issues/13))
- **Cascading GDPR User Deletion** (resolves [#14](https://github.com/DeemanthPoonacha/ZapJot/issues/14))
- **Secure Image-Signing API Endpoint** (resolves [#15](https://github.com/DeemanthPoonacha/ZapJot/issues/15))

## 1. Security Configuration & Rules

- **`firestore.rules`**: Added rules to restrict all user data to the authorized account owner using wildcard path mapping (`users/{userId}/{document=**}`). Restricted `pushSubscriptions` access to creation for authenticated users, and reading/deleting to the owner.
- **`firestore.indexes.json`**: Created index config definitions for tasks composite queries, events composite queries, and collection group querying of events (`nextNotificationAt`).
- **`firebase.json`**: Linked rule and index configs for easy deployment.
- **Centralized Firebase Admin Initialization (`lib/services/firebase/admin.ts`)**: Extracted Google Service Account config parsing and admin app initialization into a single reusable singleton, consumed by both notifications and image signing routes.

## 2. Input Validation (Zod Schema Integration)

Added Zod validation check calls (`.parse()`) inside the following services before data is written to Firestore:
- **`lib/services/tasks.ts`**: Validates with `createTaskSchema` on `addTask` and `updateTaskSchema` on `updateTask`.
- **`lib/services/events.ts`**: Validates with `createEventSchema` on `addEvent` and `updateEventSchema` on `updateEvent`. Standardized async `.map(...)` mapping to `Promise.all(...)` to prevent reminder sync race conditions.
  - *Fix*: Standardized event ID queries to use Firestore's native `documentId()` selector instead of string match parameters.
- **`lib/services/goals.ts`**: Validates with `createGoalSchema` on `addGoal` and `updateGoalSchema` on `updateGoal`.
- **`lib/services/characters.ts`**: Validates with `createCharacterSchema` / `updateCharacterSchema`, syncing `lowercaseName` on create/update and preventing `id` property overwrite.
- **`lib/services/chapters.ts`**: Validates with `createChapterSchema` / `updateChapterSchema`.
- **`lib/services/journals.ts`**: Validates with `createJournalSchema` / `updateJournalSchema`. Atomic moves implemented using Firestore Transactions.
- **`lib/services/itineraries.ts`**: Validates with `createItinerarySchema` / `updateItinerarySchema`.
- **`components/planner/events/EventForm.tsx`**: Standardized string padding formats on month/day selections to guarantee valid database schema formats.

## 3. Privacy Compliance (Cascading Deletions)

- **`lib/services/user-config.ts`**: Implemented chunked batched cascade deletion in `deleteUserData()` to completely purge all user data subcollections (`tasks`, `events`, `goals`, `characters`, `chapters`, `journals`, `itineraries`) and the user configuration document itself in chunks of 400 documents.

## 4. API Authentication & Client Loading States

- **`app/api/sign-image/route.ts`**: Integrated token verification using the centralized Firebase Admin SDK.
- **`components/ui/upload-avatar.tsx`** & **`components/ui/upload-image.tsx`**:
  - Retrieved current user session auth token and passed it dynamically as query parameter `?token=${token}` to secure signature requests.
  - Implemented `<CustomLoader />` gating states that prevent the widgets from rendering until the Auth token has successfully loaded, eliminating unauthorized API requests.
