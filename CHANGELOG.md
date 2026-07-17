# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
