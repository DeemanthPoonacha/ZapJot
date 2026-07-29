import { CharacterCreate } from "@/types/characters";

export interface PhoneContactRaw {
  name?: string[];
  email?: string[];
  tel?: string[];
  icon?: Blob[];
}

/**
 * Checks if the Web Contact Picker API is supported in the current browser.
 */
export function isContactPickerSupported(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return "contacts" in navigator && "ContactsManager" in window;
}

/**
 * Opens native browser Contact Picker to let the user select phone contacts.
 */
export async function pickPhoneContacts(): Promise<PhoneContactRaw[]> {
  if (!isContactPickerSupported()) {
    throw new Error("Contact Picker API is not supported on this browser/device.");
  }

  const props = ["name", "email", "tel", "icon"];
  const opts = { multiple: true };

  try {
    const contacts = await (navigator as any).contacts.select(props, opts);
    return contacts || [];
  } catch (err: any) {
    if (err.name === "SecurityError" || err.name === "InvalidStateError") {
      throw new Error("Contact Picker access was denied or cancelled.");
    }
    throw err;
  }
}

/**
 * Maps a raw phone contact object into a ZapJot CharacterCreate schema object.
 */
export function mapPhoneContactToCharacter(
  raw: PhoneContactRaw,
  userId: string,
): CharacterCreate {
  const name = raw.name?.[0] || "Unnamed Contact";
  const email = raw.email?.[0] || "";
  const phone = raw.tel?.[0] || "";

  const noteDetails = [email && `Email: ${email}`, phone && `Phone: ${phone}`]
    .filter(Boolean)
    .join(" | ");

  const payload: CharacterCreate = {
    userId,
    name,
    lowercaseName: name.toLowerCase(),
    source: "phone",
    notes: noteDetails ? `Imported from Phone Contacts (${noteDetails})` : "Imported from Phone Contacts",
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (email) payload.email = email;
  if (phone) payload.phone = phone;

  return payload;
}
