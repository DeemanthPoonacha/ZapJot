# Firestore Automated Backups Configuration Guide

This guide describes how to configure automated daily backups for your Cloud Firestore database in project `zapjot-8ea6d`.

---

## Option 1: Native Firestore Backup Schedules (Recommended)

Google Cloud Firestore now supports native automated backup schedules that don't require any Cloud Functions or custom code.

### Step 1: Enable the Feature via gcloud CLI
1. Open your terminal (ensure you have the Google Cloud SDK installed and authenticated).
2. Run the following command to create a daily backup schedule with a 30-day retention policy:
   ```bash
   gcloud alpha firestore backups schedules create \
     --project="zapjot-8ea6d" \
     --database="(default)" \
     --retention=30d \
     --recurrence=daily
   ```

### Step 2: Listing and Restoring Backups
*   To list your active backup schedules:
    ```bash
    gcloud alpha firestore backups schedules list --project="zapjot-8ea6d"
    ```
*   To list available backups:
    ```bash
    gcloud alpha firestore backups list --project="zapjot-8ea6d"
    ```
*   To restore from a backup to a new database (e.g. `zapjot-restored`):
    ```bash
    gcloud alpha firestore databases restore \
      --project="zapjot-8ea6d" \
      --source-backup="projects/zapjot-8ea6d/locations/[LOCATION]/backups/[BACKUP_ID]" \
      --destination-database="zapjot-restored"
    ```

---

## Option 2: Bucket Export Backups (Classic)

If you prefer to export your database to a standard Google Cloud Storage (GCS) bucket, use the export method.

### Step 1: Create a Backup GCS Bucket
1. Open the [Google Cloud Storage Console](https://console.cloud.google.com/storage).
2. Click **Create Bucket**.
3. Name it `zapjot-firestore-backups` (names must be globally unique).
4. Set the location to matches your database location.
5. Set storage class to **Standard** or **Nearline** (cheaper for backup logs).

### Step 2: Grant Permissions to the Firestore Service Agent
Firestore needs permissions to write files to your GCS bucket.
1. Find your Project Number in GCP Console Dashboard.
2. In the IAM page, find the service account matching:
   `service-[PROJECT_NUMBER]@gcp-sa-firestore.iam.gserviceaccount.com`
3. Grant this service account the **Storage Admin** or **Storage Object Admin** role on the backup bucket.

### Step 3: Automate via Cloud Scheduler and Cloud Functions
You can automate backups by triggering the exports API via a Cloud Scheduler cron job.
1. Enable the **Cloud Scheduler API** and **Cloud Functions API**.
2. Deploy a lightweight Cloud Function that triggers the export:
   ```javascript
   const firestore = require('@google-cloud/firestore');
   const client = new firestore.v1.FirestoreAdminClient();

   exports.scheduledFirestoreExport = async (event, context) => {
     const databaseName = client.databasePath('zapjot-8ea6d', '(default)');
     
     try {
       const [responses] = await client.exportDocuments({
         name: databaseName,
         outputUriPrefix: 'gs://zapjot-firestore-backups',
         collectionIds: [] // Empty array exports all collections
       });
       console.log(`Export operation started: ${responses.name}`);
     } catch (err) {
       console.error('Failed to start Firestore export:', err);
     }
   };
   ```
3. Set a Cloud Scheduler job with cron `0 2 * * *` (runs every day at 2:00 AM) to trigger this function.
