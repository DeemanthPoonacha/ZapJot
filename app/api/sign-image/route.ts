import { v2 as cloudinary } from "cloudinary";
import admin from "@/lib/services/firebase/admin";

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
        return Response.json(
          { error: "Unauthorized: Missing token in query params or headers" },
          { status: 401 },
        );
      }

      try {
        await admin.auth().verifyIdToken(token);
      } catch (authError) {
        console.error("Auth token verification failed:", authError);
        return Response.json(
          { error: "Unauthorized: Invalid token" },
          { status: 401 },
        );
      }
    }

    const body = await request.json();
    console.log("🚀 ~ POST ~ body", body);
    const { paramsToSign } = body;
    console.log("paramsToSign", paramsToSign);
    // Create signature
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!,
    );
    console.log("\n\n signature", signature, "\n\n");
    return Response.json({ signature });
  } catch (error) {
    console.error("Error generating signature:", error);
    return Response.json(
      { error: "Failed to generate signature" },
      { status: 500 },
    );
  }
}
