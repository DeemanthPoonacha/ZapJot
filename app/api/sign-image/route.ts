import { v2 as cloudinary } from "cloudinary";
import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson) as admin.ServiceAccount;
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (e) {
      console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:", e);
    }
  } else {
    console.warn("GOOGLE_SERVICE_ACCOUNT_JSON is not configured. Firebase admin auth verification disabled in development.");
  }
}

export async function POST(request: Request) {
  try {
    // Perform authentication check if Firebase Admin is initialized
    if (admin.apps.length > 0) {
      const url = new URL(request.url);
      let token = url.searchParams.get("token");

      if (!token) {
        const authHeader = request.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.substring(7);
        }
      }

      if (!token) {
        return Response.json({ error: "Unauthorized: Missing token in query params or headers" }, { status: 401 });
      }

      try {
        await admin.auth().verifyIdToken(token);
      } catch (authError) {
        console.error("Auth token verification failed:", authError);
        return Response.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
      }
    }

    const body = await request.json();
    const { paramsToSign } = body;

    // Create signature
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );
    return Response.json({ signature });
  } catch (error) {
    console.error("Error generating signature:", error);
    return Response.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    );
  }
}
