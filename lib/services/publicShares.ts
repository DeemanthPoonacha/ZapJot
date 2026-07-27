import { db } from "./firebase/db";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { Theme } from "@/types/themes";

export interface PublicShare {
  id: string;
  userId: string;
  type: "journal" | "itinerary" | "theme";
  title: string;
  subtitle?: string;
  content?: string;
  coverImage?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  totalDays?: number;
  days?: any[];
  budget?: number;
  authorName?: string;
  authorPhoto?: string;
  theme?: string;
  themeColors?: Theme["colors"];
  createdAt: string;
  updatedAt: string;
}

export const EXAMPLE_COMMUNITY_THEMES: PublicShare[] = [
  {
    id: "pub_theme_neon_cyberpunk",
    userId: "zapjot_official",
    type: "theme",
    title: "Neon Cyberpunk Glow",
    subtitle: "Vibrant neon magenta to cyan gradient palette for night owls.",
    authorName: "ZapJot Studio",
    themeColors: {
      background: "#131117",
      foreground: "#F1EFF4",
      primary: "#CF47EA",
      secondary: "#27232D",
      accent: "#16CEAF",
      muted: "#27232D",
      border: "#3D3847",
      gradient: "linear-gradient(135deg, #CF47EA 0%, #16CEAF 100%)",
      ambientGradient: "linear-gradient(135deg, color-mix(in srgb, #16CEAF 70%, transparent), #131117, color-mix(in srgb, #27232D 50%, transparent))",
      cardGradient: "linear-gradient(180deg, #131117 0%, color-mix(in srgb, #16CEAF 15%, #131117) 100%)",
    },
    createdAt: "2026-07-24T12:00:00.000Z",
    updatedAt: "2026-07-24T12:00:00.000Z",
  },
  {
    id: "pub_theme_amethyst_glow",
    userId: "zapjot_official",
    type: "theme",
    title: "Amethyst Glow",
    subtitle: "Deep purple velvet with luminous lavender gradient accents.",
    authorName: "Aria Vance",
    themeColors: {
      background: "#17131F",
      foreground: "#F2EBFF",
      primary: "#B87AFF",
      secondary: "#241B2F",
      accent: "#6C40B5",
      muted: "#241B2F",
      border: "#352644",
      gradient: "linear-gradient(135deg, #B87AFF 0%, #6C40B5 100%)",
      ambientGradient: "linear-gradient(135deg, color-mix(in srgb, #6C40B5 70%, transparent), #17131F, color-mix(in srgb, #241B2F 50%, transparent))",
      cardGradient: "linear-gradient(180deg, #17131F 0%, color-mix(in srgb, #6C40B5 15%, #17131F) 100%)",
    },
    createdAt: "2026-07-24T11:00:00.000Z",
    updatedAt: "2026-07-24T11:00:00.000Z",
  },
  {
    id: "pub_theme_emerald_forest",
    userId: "zapjot_official",
    type: "theme",
    title: "Emerald Forest",
    subtitle: "Calming organic sage green palette for focus and deep work.",
    authorName: "Leo Mercer",
    themeColors: {
      background: "#EDF6ED",
      foreground: "#1F3F1F",
      primary: "#2F8F2F",
      secondary: "#D5EAD5",
      accent: "#AAD4AA",
      muted: "#C2D9C2",
      border: "#A8C8A8",
      gradient: "linear-gradient(135deg, #2F8F2F 0%, #AAD4AA 100%)",
      ambientGradient: "linear-gradient(135deg, color-mix(in srgb, #AAD4AA 70%, transparent), #EDF6ED, color-mix(in srgb, #D5EAD5 50%, transparent))",
      cardGradient: "linear-gradient(180deg, #EDF6ED 0%, color-mix(in srgb, #AAD4AA 15%, #EDF6ED) 100%)",
    },
    createdAt: "2026-07-24T10:00:00.000Z",
    updatedAt: "2026-07-24T10:00:00.000Z",
  },
  {
    id: "pub_theme_tangerine_sunset",
    userId: "zapjot_official",
    type: "theme",
    title: "Tangerine Sunset",
    subtitle: "Warm sunset tangerine to peach gradients.",
    authorName: "Elena Frost",
    themeColors: {
      background: "#FFF5EF",
      foreground: "#352116",
      primary: "#F35524",
      secondary: "#F9E1D1",
      accent: "#EAC5AD",
      muted: "#E8D5C9",
      border: "#DBC8BC",
      gradient: "linear-gradient(135deg, #F35524 0%, #EAC5AD 100%)",
      ambientGradient: "linear-gradient(135deg, color-mix(in srgb, #EAC5AD 70%, transparent), #FFF5EF, color-mix(in srgb, #F9E1D1 50%, transparent))",
      cardGradient: "linear-gradient(180deg, #FFF5EF 0%, color-mix(in srgb, #EAC5AD 15%, #FFF5EF) 100%)",
    },
    createdAt: "2026-07-24T09:00:00.000Z",
    updatedAt: "2026-07-24T09:00:00.000Z",
  },
];

const PUBLIC_SHARES_COLLECTION = "publicShares";

/** Generate a deterministic share ID for an item */
export function getShareId(
  type: "journal" | "itinerary" | "theme",
  itemId: string,
): string {
  return `pub_${type}_${itemId}`;
}

/** Create or update a public share document */
export async function createPublicShare(
  userId: string,
  shareData: Omit<PublicShare, "userId" | "createdAt" | "updatedAt">,
): Promise<PublicShare> {
  const shareId = shareData.id || getShareId(shareData.type, shareData.id);
  const docRef = doc(db, PUBLIC_SHARES_COLLECTION, shareId);

  const rawPayload: PublicShare = {
    ...shareData,
    id: shareId,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Strip undefined values to satisfy Firestore SDK constraints
  const cleanPayload = Object.fromEntries(
    Object.entries(rawPayload).filter(([_, value]) => value !== undefined),
  ) as PublicShare;

  await setDoc(docRef, cleanPayload, { merge: true });
  return cleanPayload;
}

/** Fetch a public share document by shareId (unauthenticated) */
export async function getPublicShare(
  shareId: string,
): Promise<PublicShare | null> {
  try {
    const docRef = doc(db, PUBLIC_SHARES_COLLECTION, shareId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as PublicShare;
    }
  } catch (err) {
    console.error("Error fetching public share:", err);
  }

  // Check example community themes fallback
  const exampleMatch = EXAMPLE_COMMUNITY_THEMES.find((t) => t.id === shareId);
  if (exampleMatch) return exampleMatch;

  return null;
}

/** Revoke/Delete a public share document */
export async function deletePublicShare(shareId: string): Promise<void> {
  const docRef = doc(db, PUBLIC_SHARES_COLLECTION, shareId);
  await deleteDoc(docRef);
}

/** Fetch all publicly shared items for the Explore Gallery */
export async function getPublicShares(
  typeFilter?: "journal" | "itinerary" | "theme" | "all",
  maxResults = 50,
): Promise<PublicShare[]> {
  try {
    const colRef = collection(db, PUBLIC_SHARES_COLLECTION);
    let q;

    if (typeFilter && typeFilter !== "all") {
      q = query(
        colRef,
        where("type", "==", typeFilter),
        orderBy("createdAt", "desc"),
        limit(maxResults),
      );
    } else {
      q = query(colRef, orderBy("createdAt", "desc"), limit(maxResults));
    }

    const snapshot = await getDocs(q);
    const fetchedDocs = snapshot.docs.map((doc) => doc.data() as PublicShare);

    if (typeFilter === "theme") {
      const existingIds = new Set(fetchedDocs.map((d) => d.id));
      const newExamples = EXAMPLE_COMMUNITY_THEMES.filter((e) => !existingIds.has(e.id));
      return [...fetchedDocs, ...newExamples];
    }

    if (typeFilter === "all") {
      const existingIds = new Set(fetchedDocs.map((d) => d.id));
      const newExamples = EXAMPLE_COMMUNITY_THEMES.filter((e) => !existingIds.has(e.id));
      return [...fetchedDocs, ...newExamples];
    }

    return fetchedDocs;
  } catch (err) {
    console.error("Error fetching public shares list:", err);
    if (typeFilter === "theme" || typeFilter === "all") {
      return EXAMPLE_COMMUNITY_THEMES;
    }
    return [];
  }
}

/** Fetch all public shares created by a specific user */
export async function getUserPublicShares(
  userId: string,
): Promise<PublicShare[]> {
  try {
    const colRef = collection(db, PUBLIC_SHARES_COLLECTION);
    const q = query(
      colRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as PublicShare);
  } catch (err) {
    console.error("Error fetching user public shares:", err);
    return [];
  }
}
