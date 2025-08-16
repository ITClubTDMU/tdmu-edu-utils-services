import { jwtVerify } from 'jose';

const SB_PROJECT_URL = process.env.SB_PROJECT_URL!; // https://xxx.supabase.co
// const JWKS_URL = `${SB_PROJECT_URL}/auth/v1/.well-known/jwks.json`;
const ISSUER = `${SB_PROJECT_URL}/auth/v1`;
const JWT_SECRET = process.env.JWT_SECRET!;
const secret = new TextEncoder().encode(JWT_SECRET);

// Dùng remote JWKS (tự cache)
// const jwks = createRemoteJWKSet(new URL(JWKS_URL));

export async function verifySupabaseJWT(token: string) {
  const { payload } = await jwtVerify(token, secret, {
    issuer: ISSUER
    // audience: 'authenticated' // tuỳ cấu hình, thường không cần set
  });
  // payload.sub là user id
  return payload;
}
