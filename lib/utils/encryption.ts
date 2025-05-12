import { UserEncryptedKey } from "@/types/user";

// --- Encoding Utilities ---
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toBase64 = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)));

const fromBase64 = (str: string) =>
  Uint8Array.from(atob(str), (c) => c.charCodeAt(0)).buffer;

// --- Derive AES Key from UID + Email using SHA-256 ---
export async function deriveSimpleKey(
  uid: string,
  email: string
): Promise<CryptoKey> {
  const combined = encoder.encode(uid + email);
  const hash = await crypto.subtle.digest("SHA-256", combined);
  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, true, [
    "encrypt",
    "decrypt",
  ]);
}

// --- Generate and encrypt a user AES key ---
export async function generateEncryptedUserKey(
  uid: string,
  email: string
): Promise<UserEncryptedKey> {
  const userKey = await deriveSimpleKey(uid, email);

  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    userKey,
    rawAesKey
  );

  return {
    encryptedKey: toBase64(encrypted),
    iv: toBase64(iv.buffer),
  };
}

// --- Decrypt user AES key ---
export async function decryptUserKey(
  uid: string,
  email: string,
  encrypted: string,
  iv: string
): Promise<CryptoKey> {
  const userKey = await deriveSimpleKey(uid, email);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(iv) },
    userKey,
    fromBase64(encrypted)
  );
  return crypto.subtle.importKey("raw", decrypted, { name: "AES-GCM" }, true, [
    "encrypt",
    "decrypt",
  ]);
}

// --- Encrypt content with user's AES key ---
export async function encryptContent(
  plainText: string,
  aesKey: CryptoKey
): Promise<{ encrypted: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoder.encode(plainText)
  );
  return {
    encrypted: toBase64(encrypted),
    iv: toBase64(iv.buffer),
  };
}

// --- Decrypt content with user's AES key ---
export async function decryptContent(
  encrypted: string,
  iv: string,
  aesKey: CryptoKey
): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(iv) },
    aesKey,
    fromBase64(encrypted)
  );
  return decoder.decode(decrypted);
}
