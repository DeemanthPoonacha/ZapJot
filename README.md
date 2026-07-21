# ⚡ ZapJot

ZapJot is a fast, secure, and intuitive digital journal, task planner, and personal organizer. Designed for modern productivity, it helps you turn moments into memories and ideas into actions.

🚀 **Live Demo:** [zap-jot.netlify.app](https://zap-jot.netlify.app/)

---

## ✨ Features

- **📖 Life Logging**: Write daily journals and organize them into customizable chapters (e.g. Travel, Thoughts, Work).
- **📅 Planner & Google Calendar**: Manage task checklists, trip itineraries, and events with real-time Google Calendar bi-directional sync.
- **💬 Zappy (AI Companion)**: Chat with a smart assistant powered by Gemini (Firebase AI Logic) to automatically add events, draft journals, summarize plans, and log tasks.
- **👥 People & Relationships**: Keep profiles of contacts in your life, complete with logs of shared memories, birthdays, and relationship logs.
- **🔒 Encrypted & Private**: Sensitive journal entries are encrypted client-side so only you can read them.
- **🔄 Offline-First Ready**: Native Firestore IndexedDB persistent caching allows offline reads and writes that automatically sync once internet is restored.
- **🚀 Infinite Scroll Pagination**: Cursor-based pagination on list items ensures fast, low-memory execution at scale.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Tailwind CSS, Shadcn/ui)
- **Database & Auth:** Firebase Firestore, Firebase Authentication, Firebase Admin SDK
- **AI Backend:** Firebase AI Logic (Gemini API integration)
- **Image Hosting:** Cloudinary (Signed uploading)
- **Error Monitoring:** Sentry Next.js SDK
- **Package Manager:** pnpm

---

## 💻 Local Setup & Development

### Prerequisites

- Node.js (v20 or higher)
- pnpm (v9 or higher)
- Firebase Account & Project ID

### Step-by-Step Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/DeemanthPoonacha/ZapJot.git
   cd ZapJot
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file at the root of the project with your configurations:
   ```env
   # Firebase Web Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=zapjot-8ea6d
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Sentry (Optional for local development)
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

   # Cloudinary Setup
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Secure Cron Token
   NOTIF_SECRET=your_secure_random_token
   ```

4. **Run the Development Server:**
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) to view the application.

5. **Linting and Building:**
   *   Lint checking: `pnpm run lint`
   *   Production compilation check: `pnpm run build`

---

## 📂 Codebase Directory Structure

```
├── .github/workflows/       # GitHub Actions CI pipelines
├── app/                     # Next.js App Router (Layouts & Pages)
├── components/              # Reusable UI components & Landing page elements
├── docs/                    # Technical guides (Calendar, Production, Backups)
├── lib/
│   ├── context/             # React Context Providers (Auth, Theme, App Check)
│   ├── hooks/               # React Hooks (useTasks, useJournals, useEvents)
│   ├── services/            # Firestore and Google Calendar CRUD service functions
│   └── utils/               # Formatting, encryption, and helpers
└── types/                   # TypeScript interfaces and Zod schema validations
```
