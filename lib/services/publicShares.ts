import { db } from "./firebase/db";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export interface PublicShare {
  id: string;
  userId: string;
  type: "journal" | "itinerary";
  title: string;
  subtitle?: string;
  content?: string;
  coverImage?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  totalDays?: number;
  days?: any[];
  authorName?: string;
  authorPhoto?: string;
  createdAt: string;
  updatedAt: string;
}

const PUBLIC_SHARES_COLLECTION = "publicShares";

/** Generate a deterministic share ID for an item */
export function getShareId(type: "journal" | "itinerary", itemId: string): string {
  return `pub_${type}_${itemId}`;
}

/** Create or update a public share document */
export async function createPublicShare(
  userId: string,
  shareData: Omit<PublicShare, "userId" | "createdAt" | "updatedAt">
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
    Object.entries(rawPayload).filter(([_, value]) => value !== undefined)
  ) as PublicShare;

  await setDoc(docRef, cleanPayload, { merge: true });
  return cleanPayload;
}

/** Fetch a public share document by shareId (unauthenticated) */
export async function getPublicShare(shareId: string): Promise<PublicShare | null> {
  try {
    const docRef = doc(db, PUBLIC_SHARES_COLLECTION, shareId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as PublicShare;
    }
  } catch (err) {
    console.error("Error fetching public share:", err);
  }
  return null;
}

/** Revoke/Delete a public share document */
export async function deletePublicShare(shareId: string): Promise<void> {
  const docRef = doc(db, PUBLIC_SHARES_COLLECTION, shareId);
  await deleteDoc(docRef);
}
