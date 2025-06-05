import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { auth } from "@/lib/services/firebase/base";
import { analytics } from "@/lib/services/firebase/analytics";
import StyledFirebaseAuth from "./StyledAuthUI";
import Image from "next/image";
import { Link } from "../layout/link/CustomLink";
import { setUpUser } from "@/lib/services/user-config";
import { logEvent } from "firebase/analytics";

export default function FirebaseAuthUI() {
  // Configure FirebaseUI
  const uiConfig: firebaseui.auth.Config = {
    // Redirect to dashboard after sign-in is successful
    signInSuccessUrl: "/home",
    signInFlow: "popup",
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      EmailAuthProvider.PROVIDER_ID,
    ],

    // Terms of service url
    tosUrl: "/terms-of-service",
    // Privacy policy url
    privacyPolicyUrl: "/privacy-policy",
    // Callbacks
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        console.log("🚀 ~ FirebaseAuthUI ~ redirectUrl:", redirectUrl);
        let eventName = "login";
        // Check if the user is new
        if (authResult.additionalUserInfo?.isNewUser) {
          // User is new, perform any additional setup here
          setUpUser(authResult.user.uid, authResult.user.email);
          eventName = "sign_up"; // Change event name to sign_up
        }

        if (analytics) {
          logEvent(analytics, eventName, {
            method: authResult.additionalUserInfo?.providerId,
          });
          console.log("Logged event for sign-in:", eventName);
        }
        return false; // Prevents redirect to signInSuccessUrl
      },
    },
  };

  return (
    <div className="flex flex-col w-full justify-center items-center min-h-screen bg-gradient-to-b md:px-4 md:py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center">
          <Link href="/" className="mb-2">
            <Image
              src="/logo.webp"
              width={60}
              height={60}
              alt="zapjot"
              className="mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome to ZapJot
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to continue to your account <br /> or create a new account
          </p>
        </div>

        {/* Auth UI */}
        <div className="px-8 pb-6">
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </div>

        {/* Demo Info */}
        <div className="bg-gray-50 mt-auto border-t border-gray-100 px-8 py-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-3">
              For demo purposes
            </p>
            <div className="inline-block bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-500 w-16">Email:</span>
                  <code className="px-2 py-1 bg-gray-100 rounded font-mono text-gray-800">
                    jane.doe@gmail.com
                  </code>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-16">Password:</span>
                  <code className="px-2 py-1 bg-gray-100 rounded font-mono text-gray-800">
                    password
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
