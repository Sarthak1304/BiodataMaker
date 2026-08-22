import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

// AES-256-GCM encryption for message content at rest. The key is derived
// once from MESSAGE_ENCRYPTION_KEY (never logged, never sent to the
// client) so plaintext messages are unreadable from a raw DB dump/leak.
// This protects against DB compromise and cross-user access bugs, but the
// server itself still holds the key — it is not end-to-end encryption.

function getKey(): Buffer {
  const secret = process.env.MESSAGE_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error("MESSAGE_ENCRYPTION_KEY is not set — messaging cannot run without it.");
  }
  // Derive a stable 32-byte key from the secret so any reasonable secret
  // length works, without ever storing the raw key material elsewhere.
  return scryptSync(secret, "biodatamatcher-message-salt", 32);
}

export function encryptMessage(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decryptMessage(payload: string): string {
  const raw = Buffer.from(payload, "base64");
  const iv = raw.subarray(0, 12);
  const authTag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
