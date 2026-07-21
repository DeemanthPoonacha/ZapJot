# Google Calendar Integration Guide

This guide details how to configure, enable, and use the Google Calendar Integration in `ZapJot`.

---

## 1. Prerequisites (Google Cloud Console Setup)

Google Calendar API integration is client-side, using Firebase Authentication to manage Google OAuth scopes. Before the integration can successfully sync events, you must enable and configure the calendar permissions in your Google Cloud Project:

### Step 1: Enable the API
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your Firebase project (`zapjot-8ea6d`).
3. Search for the **Google Calendar API** and click **Enable**.

### Step 2: Configure Scopes in the OAuth Consent Screen
1. In the left navigation, go to **APIs & Services > OAuth consent screen**.
2. Under **Scopes**, click **Add or Remove Scopes**.
3. Add the following scope to allow read/write access to Google Calendar:
   - `https://www.googleapis.com/auth/calendar`

### Step 3: Register Authorized Redirect URIs
1. Go to **APIs & Services > Credentials**.
2. Select your Web Application OAuth 2.0 Client ID.
3. In the **Authorized Redirect URIs** section, verify or add your Firebase handler URLs:
   - `https://zapjot-8ea6d.firebaseapp.com/__/auth/handler`
   - `https://zapjot-8ea6d.web.app/__/auth/handler`

---

## 2. Enabling Sync in the Application Settings

1. Navigate to the **Settings** page in the ZapJot application.
2. In the **Google Calendar Sync** section, toggle the **Enable Google Calendar Sync** switch.
3. If this is your first time or your session has expired, a Google OAuth popup window will open requesting permissions for Google Calendar. Confirm the request.
4. Click the **Sync Calendar** button to perform a global sync of all existing Firestore events to your Google Calendar.

---

## 3. Supported Sync Features

- **Write-Through CRUD Sync**: Creating, updating, or deleting events inside ZapJot immediately pushes those updates to Google Calendar in real-time.
- **Recurrence Mapping**: Recurring event schedules (`daily`, `weekly`, `monthly`, `yearly`) are mapped to iCalendar `RRULE` strings and synced as recurring series on Google Calendar.
- **Dynamic Reminders**: Syncs reminder notifications (popups) on Google Calendar matching either your custom event notification time or your global settings notification fallback (`notifyMinsBefore`).
- **Private Meta-Tagging**: Synced events are labeled with `"source": "zapjot"` in private extended properties to identify them programmatically.
