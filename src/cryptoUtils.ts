const encoder = new TextEncoder();
const decoder = new TextDecoder();


async function getKey(): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(import.meta.env.VITE_PASSPHRASE),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(import.meta.env.VITE_SALT), // You can store salt elsewhere if needed
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptObject(obj: unknown): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const key = await getKey();
  const encoded = encoder.encode(JSON.stringify(obj));
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const ivStr = btoa(String.fromCharCode(...iv));
  const cipherStr = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));

  return `${ivStr}:${cipherStr}`;
}

export async function decryptObject(data: string): Promise<unknown> {
  const [ivStr, cipherStr] = data.split(':');
  if (!ivStr || !cipherStr) throw new Error("Invalid encrypted data format");

  const iv = Uint8Array.from(atob(ivStr), c => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(cipherStr), c => c.charCodeAt(0));
  const key = await getKey();

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  const json = decoder.decode(decrypted);
  return JSON.parse(json);
}
