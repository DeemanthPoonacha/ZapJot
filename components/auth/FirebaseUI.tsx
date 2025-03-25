import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { auth } from "@/lib/services/firebase";
import StyledFirebaseAuth from "./StyledAuthUI";

export default function FirebaseAuthUI() {
  // Configure FirebaseUI
  const uiConfig: firebaseui.auth.Config = {
    // Redirect to dashboard after sign-in is successful
    signInSuccessUrl: "/",
    signInFlow: "popup",

    // We will display Google and Email as auth providers
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      EmailAuthProvider.PROVIDER_ID,
    ],

    // Terms of service url
    tosUrl: "/terms-of-service",
    privacyPolicyUrl: "/privacy-policy",

    // Callbacks
    // callbacks: {
    //   signInSuccessWithAuthResult: (authResult) => {
    //     // You can add custom logic here after successful sign-in
    //     router.push("/");
    //     return false; // Prevents redirect to signInSuccessUrl
    //   },
    // },
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Sign in to ZapJot</h1>
      <StyledFirebaseAuth
        className="w-full"
        uiConfig={uiConfig}
        firebaseAuth={auth}
      />
      <div className="mt-4 flex flex-col items-center">
        <div>For Demo</div>
        <span>
          email: <code>jane.doe@gmail.com</code>
        </span>
        <span>
          password: <code>password</code>
        </span>
      </div>
    </div>
  );
}
