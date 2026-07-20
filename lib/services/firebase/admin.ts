import admin from "firebase-admin";

if (!admin.apps.length) {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!json) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is missing");
  }

  try {
    const serviceAccount = JSON.parse(json) as admin.ServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("🔥 Firebase Admin Initialized 🔥");
  } catch (e) {
    console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:", e);
  }
}

export default admin;
