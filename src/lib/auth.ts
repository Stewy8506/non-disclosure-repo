export const getSecretKey = async () => {
  const secret = process.env.ADMIN_PASSWORD || 'default_secret';
  const encoder = new TextEncoder();
  
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
};

export async function createSessionToken(): Promise<string> {
  const key = await getSecretKey();
  const encoder = new TextEncoder();
  const data = encoder.encode("admin_session_granted");
  const signature = await crypto.subtle.sign("HMAC", key, data);
  
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const expectedToken = await createSessionToken();
    return token === expectedToken;
  } catch (e) {
    return false;
  }
}
