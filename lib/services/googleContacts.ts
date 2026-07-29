import { CharacterCreate } from "@/types/characters";

export interface GoogleContactRaw {
  resourceName: string;
  names?: Array<{ displayName?: string; familyName?: string; givenName?: string }>;
  emailAddresses?: Array<{ value?: string }>;
  phoneNumbers?: Array<{ value?: string }>;
  photos?: Array<{ url?: string; default?: boolean }>;
  organizations?: Array<{ title?: string; name?: string }>;
}

/**
 * Checks if Google Contacts sync is enabled in localStorage.
 */
export function isContactsSyncEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("google_contacts_sync_enabled") === "true";
}

/**
 * Sets Google Contacts sync state in localStorage.
 */
export function setContactsSyncEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("google_contacts_sync_enabled", String(enabled));
}

/**
 * Gets Google Contacts access token from localStorage.
 * Returns null if missing or expired.
 */
export function getContactsAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("google_contacts_access_token");
  const expiry = localStorage.getItem("google_contacts_token_expiry");

  if (!token) return null;
  if (expiry && Date.now() > Number(expiry)) {
    return null;
  }
  return token;
}

/**
 * Stores Google Contacts access token and expiry in localStorage.
 */
export function setContactsAccessToken(token: string, expiresInSeconds: number = 3600): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("google_contacts_access_token", token);
  const expiryTime = Date.now() + expiresInSeconds * 1000;
  localStorage.setItem("google_contacts_token_expiry", String(expiryTime));
}

/**
 * Fetches all Google Contacts for the authenticated user using Google People API.
 * Handles pagination automatically using nextPageToken.
 */
export async function fetchGoogleContacts(token: string): Promise<GoogleContactRaw[]> {
  const allContacts: GoogleContactRaw[] = [];
  let pageToken: string | undefined = undefined;

  do {
    const url = new URL("https://people.googleapis.com/v1/people/me/connections");
    url.searchParams.set("personFields", "names,emailAddresses,phoneNumbers,photos,organizations");
    url.searchParams.set("pageSize", "1000");
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch Google Contacts: ${errorText}`);
    }

    const data = await res.json();
    const connections: GoogleContactRaw[] = data.connections || [];
    allContacts.push(...connections);

    pageToken = data.nextPageToken;
  } while (pageToken);

  return allContacts;
}

/**
 * Maps a raw Google People API contact object into a ZapJot CharacterCreate schema object.
 */
export function mapGoogleContactToCharacter(
  raw: GoogleContactRaw,
  userId: string,
): CharacterCreate {
  const name =
    raw.names?.[0]?.displayName ||
    [raw.names?.[0]?.givenName, raw.names?.[0]?.familyName].filter(Boolean).join(" ") ||
    "Unnamed Contact";

  const email = raw.emailAddresses?.[0]?.value || "";
  const phone = raw.phoneNumbers?.[0]?.value || "";

  // Only use photo URL if it's not a default placeholder
  const photo = raw.photos?.[0];
  const image = photo && !photo.default ? photo.url : undefined;

  const org = raw.organizations?.[0];
  const title = [org?.title, org?.name].filter(Boolean).join(" at ") || undefined;

  const noteDetails = [email && `Email: ${email}`, phone && `Phone: ${phone}`]
    .filter(Boolean)
    .join(" | ");

  const payload: CharacterCreate = {
    userId,
    name,
    lowercaseName: name.toLowerCase(),
    googleContactId: raw.resourceName,
    source: "google",
    notes: noteDetails ? `Imported from Google Contacts (${noteDetails})` : "Imported from Google Contacts",
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (image) payload.image = image;
  if (title) payload.title = title;
  if (email) payload.email = email;
  if (phone) payload.phone = phone;

  return payload;
}
