import { getAnalytics, isSupported } from "firebase/analytics";
import { app } from "./base";

export async function initAnalytics() {
  const supported = await isSupported();
  if (supported) {
    return getAnalytics(app);
  } else {
    console.warn("Analytics not supported");
    return null;
  }
}
