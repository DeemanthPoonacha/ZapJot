import { getMessaging, isSupported } from "firebase/messaging";
import { app } from "./base";

export async function initMessaging() {
  const supported = await isSupported();
  if (supported) {
    return getMessaging(app);
  } else {
    console.warn("Messaging not supported");
    return null;
  }
}
