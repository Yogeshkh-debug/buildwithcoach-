import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./_core/env";

const BUYER_SESSION_AUDIENCE = "build-with-coach-buyer-library";
const BUYER_SESSION_TTL = "30d";

function buyerSessionSecret() {
  if (!ENV.cookieSecret) throw new Error("Buyer access is not configured.");
  return new TextEncoder().encode(ENV.cookieSecret);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function createBuyerSession(email: string) {
  return new SignJWT({ email: normalizeEmail(email), scope: "buyer-library" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setAudience(BUYER_SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(BUYER_SESSION_TTL)
    .sign(buyerSessionSecret());
}

export async function verifyBuyerSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, buyerSessionSecret(), {
      algorithms: ["HS256"],
      audience: BUYER_SESSION_AUDIENCE,
    });
    const email = payload.email;
    if (typeof email !== "string" || payload.scope !== "buyer-library") return null;
    return normalizeEmail(email);
  } catch {
    return null;
  }
}
