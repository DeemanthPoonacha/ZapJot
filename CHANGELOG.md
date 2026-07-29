# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2026-07-29

### Added

- **Planner Pulse Dashboard Summary Bar:** Added global 4-card metric snapshot bar at top of Planner showing live task completion, upcoming events, average goal progress %, and active itineraries. (#50)
- **Home Screen Quick-Add Bars:** Built 1-line quick-add input bars for Tasks (`pending-tasks.tsx`) with priority ⭐ and due date 📅 pickers, and Events (`upcoming-events.tsx`) with date 📅 and time ⏰ pickers directly on the Home dashboard. (#50)
- **Custom Mobile-First Planner Calendar:** Built `CustomPlannerCalendar` supporting `Day`, `Week`, and `Month` view modes, toggleable 1-tap day filtering, Month/Year jump selector modal, and `Include Past Days` toggle badge. (#50)
- **Goal Categories & Milestone Celebrations:** Added goal categories (`Personal`, `Fitness`, `Finance`, `Career`, `Learning`, `Health`), 1-tap category filter chips, and glowing 100% Milestone Achieved celebration banners. (#50)
- **Live Trip Countdown & 1-Click Share:** Added live trip status badges (`🛫 Trip in X days!`) and 1-click share/summary copying to itinerary detail cards. (#50)

### Changed

- **CSS Masonry Columns Layout:** Upgraded `TasksList`, `EventsList`, and `GoalsList` from standard row-aligned grid to `columns-1 md:columns-2 gap-4 space-y-4` (`break-inside-avoid`), completely eliminating vertical dead space gaps between cards. (#50)

### Fixed

- **Firestore Payload Undefined Sanitization:** Added `sanitizeFirestorePayload()` helper in task service to strip `undefined` keys prior to Firestore writes. (#50)
- **Safe Event Date Parsing:** Added safe timestamp/date conversion in `home-header.tsx` to prevent runtime `toDate is not a function` errors. (#50)

## [1.6.0] - 2026-07-27

### Added

- **Theme Publishing & Explore Hub Integration:** Extended `PublicShare` schema and services to allow users to publish custom themes to the community Explore Hub (`/explore`). (#62, #63, #64)
- **Publish Theme Modal:** Added dedicated `PublishThemeModal` with custom display title, tagline description, live card preview, and link copy/unpublish controls. (#63)
- **Theme Preview Modal:** Added eye preview button on theme cards that opens an interactive component showcase and color palette inspector modal. (#63)
- **1-Click Theme Installation:** Implemented `importPublicTheme()` service to allow 1-click theme cloning and instant CSS variable injection from the Explore Hub. (#62)
- **Curated Example Community Themes:** Added 5 built-in community theme presets (`Midnight Sparkle`, `Sunset Glow`, `Deep Emerald`, `Rose Quartz`, `Nordic Slate`) to `EXAMPLE_COMMUNITY_THEMES`. (#64)

### Changed

- **Theme Gradient & Contrast Standardization:** Standardized primary, ambient, and card gradients across built-in themes and color utilities with WCAG YIQ automatic contrast foreground calculation. (#62)
- **Theme Preview Refactor:** Refactored `ThemePreview` to dynamically adapt to theme props or CSS variable fallbacks with scoped container styling. (#64)

## [1.5.1] - 2026-07-24

### Added

- **Gradient Theme Support:** Added gradient-based themes throughout the application with customizable gradient styling across UI components and navigation. (#59)
- **Card Gradient Theming:** Introduced dedicated card gradient theme variables for consistent styling across cards and reusable UI components. (#59)
- **Nested Settings Navigation:** Redesigned Settings with nested navigation, built-in back button support, and breadcrumb navigation for improved usability on desktop and mobile. (#59)
- **Itinerary Import Flow:** Added a streamlined itinerary import experience with a custom confirmation dialog. (#59)

### Changed

- **Public Share Routes:** Migrated public sharing routes from `/share` to `/explore` for a more consistent public experience. (#59)
- **Header Navigation:** Refactored and modularized the application header navigation for improved maintainability and future expansion. (#59)
- **Public Share Schema:** Extended the public share schema to include itinerary budget information. (#59)

### Fixed

- **Explore Page Cleanup:** Removed unused imports and performed internal cleanup following the `/explore` migration. (#59)
- **UI Polish & Maintenance:** Various internal refactors and styling improvements to support the new theming system and navigation architecture. (#59)
- **Settings Back Button:** Added back button to settings page for mobile view. (#59)

## [1.5.0] - 2026-07-23

### Added

- **Public Shared Items Hub (`/shared`):** Built a dual-tab dashboard page for logged-in users with **Public Hub** (browse & 1-click import community itineraries) and **My Public Shares** (manage, copy links, or unshare/delete public shares). (#55)
- **Public Landing Page Navigation (`/explore`):** Added **Explore Community** link to top navigation bar on landing page for public web visitors. (#55)
- **Social Media Card Aesthetic Grid (`PublicShareCard.tsx`):** Rendered public shares grid items as compact mini-social graphic cards using 5 preset themes (`midnight`, `sunset`, `emerald`, `rose`, `nordic`), glassmorphism badges, and author metadata. (#55)
- **Itinerary Cover Photos:** Added Cloudinary cover image upload support to itineraries (`ItineraryForm.tsx`, `ItineraryDetailCard.tsx`, and `PrintableItinerary.tsx`). (#55)
- **1-Click Itinerary Import / Duplication:** Implemented `importPublicItinerary()` which clones a shared itinerary into the user's planner with all activity checkboxes reset to `completed: false` for the importer. (#55)
- **Social Media Card Generator & User Avatar Integration:** High-contrast redesign of `SocialCardCanvas.tsx` & `SocialCardModal.tsx` with user avatar integration, official `/logo.webp` branding, theme preset picker, and copy actions. (#8)
- **Printable Itinerary Export:** Built `PrintableItinerary.tsx` component with print button in `ItineraryDetailCard.tsx` for PDF/print generation. (#9)

### Fixed

- **Cloudinary Overlay Focus Lock:** Solved Radix Dialog/Drawer focus lock when Cloudinary upload widget is active inside modals (`ResponsiveDialogDrawer.tsx` & `globals.css`). (#55)

## [1.4.1] - 2026-07-22

### Added

- **Complete PWA Offline Compatibility:** Added comprehensive Workbox runtime caching (`StaleWhileRevalidate` page route caching, asset caching, Cloudinary image caching) and fallback routing via `@ducanh2912/next-pwa`. (#44)
- **Offline Fallback Page:** Built a dedicated glassmorphic offline page at `app/offline/page.tsx` with connection status and quick navigation links to cached routes. (#45)
- **Network Status & Floating Indicator:** Added `useNetworkStatus` hook and floating top `<OfflineIndicator />` banner + Sonner toasts for connectivity state transitions. (#46)
- **Non-Blocking Firestore Writes (`setDocOptimistic`):** Implemented non-blocking optimistic Firestore write functions (`setDocOptimistic`, `updateDocOptimistic`, `deleteDocOptimistic`) that commit mutations directly to IndexedDB in 0ms without waiting for server network responses. (#47)
- **Optimistic Firestore Cache Reads (`fetchDocsOptimistic`):** Implemented `fetchDocsOptimistic` and `fetchDocOptimistic` helpers across all services to query IndexedDB directly when offline. (#47)
- **Instant In-Memory UI Updates (`setQueriesData`):** Added optimistic React Query memory cache updates (`queryClient.setQueriesData`) across `useTasks`, `useJournals`, `useChapters`, `useCharacters`, `useGoals`, `useItineraries`, and `useEvents` to update UI lists in 0ms offline. (#47)
- **Deterministic Encryption Key Fallback:** Added in-memory key caching and `deriveSimpleKey` fallback in `useDecryptedUserKey` to ensure encryption keys are available 100% offline for journal CRUD. (#47)

## [1.4.0] - 2026-07-21

### Added

- **Google Calendar Real-Time Sync:** Integrated direct write-through synchronization between Firestore events (create, update, delete) and Google Calendar API. (#6)
- **Firebase OAuth & Permissions Linking:** Added on-demand Google Calendar OAuth scope (`https://www.googleapis.com/auth/calendar`) requesting and account linking using `linkWithPopup` for Firebase email/password users. (#6)
- **Recurrence & Reminder Sync:** Supported syncing daily, weekly, monthly, and yearly recurring events using standard iCalendar `RRULE` conversion, and dynamic notification reminder mapping with fallback to user config. (#6)
- **Backlog Automation Workflow Skill:** Added custom project-scoped `backlog-workflow` skill under `.agents/skills/` to automate issue-to-PR processes using a multi-agent split (Orchestrator + Code Implementer).
- **Firestore Security Rules:** Added `firestore.rules`, `firestore.indexes.json`, and `firebase.json` configs to enforce strict user-scoped tenancy isolation and configure composite/collection group indexes. (#12)
- **GDPR Cascading User Deletion:** Implemented a recursive, chunked-batch cascade deletion in `deleteUserData()` to safely purge all collections under a user profile in chunks of 400 documents. (#14)
- **Firebase Token Verification:** Secured `/api/sign-image` endpoint by extracting and validating Firebase ID tokens using the Admin SDK. (#15)
- **Firebase Admin Centralization:** Centralized Firebase Admin SDK initialization into `lib/services/firebase/admin.ts` to reuse the instance and streamline API route authentication. (#15)
- **Auth-Gated Loading States:** Implemented token availability checks (`!token`) and `<CustomLoader />` rendering inside `upload-avatar.tsx` and `upload-image.tsx` to handle async Firebase Auth ID Token loading state smoothly before invoking `CldUploadWidget`. (#15)
- **Netlify Scheduled Functions:** Created `netlify/functions/check-notifications.ts` executing every minute to trigger the notifications checker securely using Netlify's serverless scheduler. (#15)
- **Firebase App Check Integration:** Configured global client-side reCAPTCHA v3 App Check initialization in `AppProviders.tsx` to protect database and auth endpoints. (#22)
- **Sentry Error Tracking**: Set up Sentry Next.js SDK for client, server, and edge runtime error monitoring and crash reporting. (#25)
- **CI/CD Pipeline**: Configured GitHub Actions lint, type-checking, and build validation workflow on push and PR. (#26)
- **Cursor-Based Pagination & Infinite Scroll**: Implemented query pagination in task and journal services, and integrated `react-intersection-observer` for automatic scroll loading in TasksList and JournalsList. (#27)
- **Firestore Offline Caching**: Enabled persistent local caching (`persistentLocalCache` and `persistentMultipleTabManager`) in `db.ts` to allow full offline read/write support. (#29)

### Changed

- **Service-Layer Schema Validation:** Integrated Zod schemas (`create*Schema` and `update*Schema`) inside all write endpoints of `tasks`, `events`, `goals`, `characters`, `chapters`, `journals`, and `itineraries` services to prevent database corruption. (#13)
- **Atomic Journal Moves:** Refactored `moveJournal` to run the write/delete operations atomically within a Firestore Transaction. (#13)

### Fixed

- **Unawaited Participant Synchronization:** Resolved race conditions during event creation/updates by wrapping concurrent updates in `Promise.all()`. (#13)
- **Inconsistent Timestamps:** Unified all updated/created timestamp writes to follow ISO 8601 strings. (#13)
- **Firestore documentId Queries:** Fixed event retrieval filters in `lib/services/events.ts` to query `documentId()` instead of matching against a string property `"id"`. (#13)
- **Standardized EventForm Date Formatting:** Standardized MM/DD padding formats in `EventForm.tsx` to ensure proper matching with repeating event schemas. (#13)

## [1.3.1] - 2026-07-17

### Added

- **Dynamic Calendar Empty State Filtering:** Hides empty day cards when displaying month-ranges or upcoming events list, returning a clean empty state panel instead.
- **Save/Discard AI Reaction Context:** Appends system messages (`ChatRole.SYSTEM`) to the chatbot conversational history to ensure Gemini stays fully informed of user actions while keeping these operations hidden from the message bubbles UI.

### Changed

- **Default Upcoming Events View:** Shifted the calendar default listing to display events from today onwards up to the end of the month, falling back to a full-month view only when the month is changed.

### Fixed

- **Firestore Query Task Omission:** Pre-populated missing default task fields (`status`, `highPriority`, `subtasks`) during direct creation to prevent Firestore `orderBy("highPriority")` queries from omitting newly added items.
- **Yearly Event Format Matching:** Corrected the date formatter helper inside calendar date ranges from `"M-D"` to `"MM-DD"` to align with the database schema and prevent yearly repeating events from hiding.
- **Firebase Write Batch Safety:** Handled nullable fields directly (assigning `null` instead of leaving `undefined`) during batch updates to prevent Firestore SDK validation errors.
- **Next.js Hydration Mismatch:** Resolved layout hydration warnings by using `suppressHydrationWarning` on the root layout component.
- **Today's Focus Crash:** Wrapped third-party quotes API fetch in a try-catch block with a static fallback to prevent layout failures during offline/restricted environments.

## [1.3.0] - 2026-07-17

### Added

- **AI Companion Personality (Zappy):** Implemented a warm, witty, and proactive AI companion system with relative temporal awareness and directives to check existence before creation, merge info semantically, and automatically cross-reference goals, events, itineraries, and tasks.
- **Delete Capabilities for AI:** Equipped the AI agent with tools to permanently delete chapters (`delete_chapter`), journals (`delete_journal`), tasks (`delete_task`), events (`delete_event`), goals (`delete_goal`), characters (`delete_character`), and itineraries (`delete_itinerary`).
- **Daily Briefing Tool:** Added `get_daily_briefing` tool which pulls today's schedule, pending tasks, active goals progress, and recent journals to offer comprehensive daily summaries when greeted.
- **AI Settings Model Selection:** Bound the Settings AI panel dynamically to `AVAILABLE_MODELS` instead of static hardcoded lists.

### Changed

- **Stable Chat Connection:** Refactored the core chat execution engine in `useAiChat.ts` to utilize the stable, non-streaming `chat.sendMessage` instead of `chat.sendMessageStream` to resolve `400 Bad Request` thought signature errors under the hood.
- **UI Loading Indicators:** Switched typewriter text simulation to instant static responses with native pulsing loading indicators (`...`) during active backend operations, eliminating layout thrashing and markdown rendering flicker.

### Fixed

- **Cache Race Conditions:** Patched `localStorage` history reload logic so that active in-memory cache queues are protected from being overwritten by stale values when routing or re-rendering.
- **Vertex AI Schema Standardisation:** Capitalized all raw tool parameter schema types to `OBJECT` via `zodToGeminiSchema(z.object({}))` to satisfy strict Google/Vertex AI validator constraints and resolve 400 Bad Requests.
- **Local Build Guard:** Protected `GOOGLE_SERVICE_ACCOUNT_JSON` JSON parsing in `check-notifications` endpoint to support local compilation without environment keys.
