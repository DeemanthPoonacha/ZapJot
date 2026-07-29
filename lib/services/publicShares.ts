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
    id: "pub_theme_midnight_sparkle",
    userId: "zapjot_official",
    type: "theme",
    title: "Midnight Sparkle",
    subtitle: "Deep slate to indigo with luminous purple accents.",
    authorName: "ZapJot Studio",
    themeColors: {
      background: "#0F172A",
      foreground: "#F8FAFC",
      primary: "#6366F1",
      secondary: "#1E1B4B",
      accent: "#A855F7",
      muted: "#1E293B",
      border: "#334155",
      gradient: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
      ambientGradient: "linear-gradient(135deg, color-mix(in srgb, #A855F7 70%, transparent), #0F172A, color-mix(in srgb, #1E1B4B 50%, transparent))",
      cardGradient: "linear-gradient(180deg, #0F172A 0%, color-mix(in srgb, #A855F7 15%, #0F172A) 100%)",
    },
    createdAt: "2026-07-27T12:00:00.000Z",
    updatedAt: "2026-07-27T12:00:00.000Z",
  },
  {
    id: "pub_theme_sunset_glow",
    userId: "zapjot_official",
    type: "theme",
    title: "Sunset Glow",
    subtitle: "Radiant amber to rose and deep purple sunset gradient.",
    authorName: "Elena Frost",
    themeColors: {
      background: "#181120",
      foreground: "#FFF7ED",
      primary: "#D97706",
      secondary: "#E11D48",
      accent: "#F43F5E",
      muted: "#2A1A36",
      border: "#442656",
      gradient: "linear-gradient(135deg, #D97706 0%, #E11D48 50%, #7E22CE 100%)",
      ambientGradient: "linear-gradient(135deg, color-mix(in srgb, #F43F5E 70%, transparent), #181120, color-mix(in srgb, #D97706 50%, transparent))",
      cardGradient: "linear-gradient(180deg, #181120 0%, color-mix(in srgb, #F43F5E 15%, #181120) 100%)",
    },
    createdAt: "2026-07-27T11:30:00.000Z",
    updatedAt: "2026-07-27T11:30:00.000Z",
  },
  {
    id: "pub_theme_deep_emerald",
    userId: "zapjot_official",
    type: "theme",
    title: "Deep Emerald",
    subtitle: "Rich emerald green to dark teal and slate tones.",
    authorName: "Leo Mercer",
    themeColors: {
      background: "#064E3B",
      foreground: "#ECFDF5",
      primary: "#10B981",
      secondary: "#042F2E",
      accent: "#14B8A6",
      muted: "#065F46",
      border: "#047857",
      gradient: "linear-gradient(135deg, #10B981 0%, #14B8A6 100%)",
      ambientGradient: "linear-gradient(135deg, color-mix(in srgb, #14B8A6 70%, transparent), #064E3B, color-mix(in srgb, #042F2E 50%, transparent))",
      cardGradient: "linear-gradient(180deg, #064E3B 0%, color-mix(in srgb, #14B8A6 15%, #064E3B) 100%)",
    },
    createdAt: "2026-07-27T11:00:00.000Z",
    updatedAt: "2026-07-27T11:00:00.000Z",
  },
  {
    id: "pub_theme_rose_quartz",
    userId: "zapjot_official",
    type: "theme",
    title: "Rose Quartz",
    subtitle: "Luminous pink quartz to deep rose velvet.",
    authorName: "Aria Vance",
    themeColors: {
      background: "#1C1322",
      foreground: "#FFF1F2",
      primary: "#EC4899",
      secondary: "#4C0519",
      accent: "#F43F5E",
      muted: "#2E162B",
      border: "#4A1E45",
      gradient: "linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)",
      ambientGradient: "linear-gradient(135deg, color-mix(in srgb, #EC4899 70%, transparent), #1C1322, color-mix(in srgb, #4C0519 50%, transparent))",
      cardGradient: "linear-gradient(180deg, #1C1322 0%, color-mix(in srgb, #EC4899 15%, #1C1322) 100%)",
    },
    createdAt: "2026-07-27T10:30:00.000Z",
    updatedAt: "2026-07-27T10:30:00.000Z",
  },
  {
    id: "pub_theme_nordic_slate",
    userId: "zapjot_official",
    type: "theme",
    title: "Nordic Slate",
    subtitle: "Minimalist cool slate and dark zinc tones.",
    authorName: "Kairos Dev",
    themeColors: {
      background: "#18181B",
      foreground: "#F4F4F5",
      primary: "#64748B",
      secondary: "#27272A",
      accent: "#94A3B8",
      muted: "#27272A",
      border: "#3F3F46",
      gradient: "linear-gradient(135deg, #64748B 0%, #94A3B8 100%)",
      ambientGradient: "linear-gradient(135deg, color-mix(in srgb, #94A3B8 70%, transparent), #18181B, color-mix(in srgb, #27272A 50%, transparent))",
      cardGradient: "linear-gradient(180deg, #18181B 0%, color-mix(in srgb, #94A3B8 15%, #18181B) 100%)",
    },
    createdAt: "2026-07-27T10:00:00.000Z",
    updatedAt: "2026-07-27T10:00:00.000Z",
  },
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
