import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { app } from "./base";

export function initAppCheck() {
  if (typeof window !== "undefined") {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
          process.env.NEXT_PUBLIC_RECAPTCHA_V3_KEY || ""
        ),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (err) {
      console.error("AppCheck error", err);
    }
  }
}
