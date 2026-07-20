# Walkthrough — Database Production Readiness & Security

We have successfully implemented the security, data validation, and privacy mechanisms required to make the database production-ready.

## 1. Security Configuration & Rules

- **`firestore.rules`**: Added rules to restrict all user data to the authorized account owner using wildcard path mapping (`users/{userId}/{document=**}`). Restricted `pushSubscriptions` access to creation for authenticated users, and reading/deleting to the owner.
- **`firestore.indexes.json`**: Created index config definitions for tasks composite queries, events composite queries, and collection group querying of events (`nextNotificationAt`).
- **`firebase.json`**: Linked rule and index configs for easy deployment.

## 2. Input Validation (Zod Schema Integration)

Added Zod validation check calls (`.parse()`) inside the following services before data is written to Firestore:
- **`lib/services/tasks.ts`**: Validates with `createTaskSchema` on `addTask` and `updateTaskSchema` on `updateTask`.
- **`lib/services/events.ts`**: Validates with `createEventSchema` on `addEvent` and `updateEventSchema` on `updateEvent`. Standardized async `.map(...)` mapping to `Promise.all(...)` to prevent reminder sync race conditions.
- **`lib/services/goals.ts`**: Validates with `createGoalSchema` on `addGoal` and `updateGoalSchema` on `updateGoal`.
- **`lib/services/characters.ts`**: Validates with `createCharacterSchema` / `updateCharacterSchema`, syncing `lowercaseName` on create/update and preventing `id` property overwrite.
- **`lib/services/chapters.ts`**: Validates with `createChapterSchema` / `updateChapterSchema`.
- **`lib/services/journals.ts`**: Validates with `createJournalSchema` / `updateJournalSchema`. Atomic moves implemented using Firestore Transactions.
- **`lib/services/itineraries.ts`**: Validates with `createItinerarySchema` / `updateItinerarySchema`.

## 3. Privacy Compliance (Cascading Deletions)

- **`lib/services/user-config.ts`**: Implemented chunked batched cascade deletion in `deleteUserData()` to completely purge all user data subcollections (`tasks`, `events`, `goals`, `characters`, `chapters`, `journals`, `itineraries`) and the user configuration document itself in chunks of 400 documents.

## 4. API Authentication

- **`app/api/sign-image/route.ts`**: Integrated token verification using Firebase Admin SDK.
- **`components/ui/upload-avatar.tsx`** & **`components/ui/upload-image.tsx`**: Retrived current user session auth token and passed it dynamically as query parameter `?token=${token}` to secure signature requests.
