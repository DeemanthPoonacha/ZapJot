import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase/db";
import { PublicShare } from "./publicShares";
import { Theme } from "@/types/themes";
import { addCustomCssVariables } from "../utils/colors";

/** Import a publicly shared theme from the Hub into user's custom theme collection */
export async function importPublicTheme(
  userId: string,
  share: PublicShare,
): Promise<Theme> {
  if (!share.themeColors) {
    throw new Error("Theme colors missing from public share");
  }

  const themesCollectionRef = collection(db, `users/${userId}/themes`);
  const newThemeRef = doc(themesCollectionRef);

  const newTheme: Theme = {
    id: newThemeRef.id,
    name: share.title || "Imported Theme",
    type: "custom",
    colors: share.themeColors,
  };

  const payload = {
    ...newTheme,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(newThemeRef, payload);

  // Register CSS variables immediately
  addCustomCssVariables(newTheme);

  return newTheme;
}
