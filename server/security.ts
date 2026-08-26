import type { NextFunction, Request, Response } from "express";

export const MAX_STORY_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_STORY_IMAGE_DIMENSION = 4096;

type StoryImageMime = "image/jpeg" | "image/png" | "image/webp";

function readPngDimensions(bytes: Buffer) {
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || bytes.toString("ascii", 12, 16) !== "IHDR") return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function readJpegDimensions(bytes: Buffer) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    const segmentLength = bytes.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) return null;
    const isStartOfFrame = [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker);
    if (isStartOfFrame) return { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3) };
    offset += segmentLength;
  }
  return null;
}

function readWebpDimensions(bytes: Buffer) {
  if (bytes.length < 30 || bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunk = bytes.toString("ascii", 12, 16);
  if (chunk === "VP8X") return { width: 1 + bytes.readUIntLE(24, 3), height: 1 + bytes.readUIntLE(27, 3) };
  if (chunk === "VP8 ") return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
  if (chunk === "VP8L") {
    const bits = bytes.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

export function assertSafeStoryImage(bytes: Buffer, mime: StoryImageMime) {
  if (bytes.length === 0 || bytes.length > MAX_STORY_IMAGE_BYTES) throw new Error("Keep the photo under 2 MB.");
  const dimensions = mime === "image/png" ? readPngDimensions(bytes) : mime === "image/jpeg" ? readJpegDimensions(bytes) : readWebpDimensions(bytes);
  if (!dimensions || dimensions.width < 1 || dimensions.height < 1 || dimensions.width > MAX_STORY_IMAGE_DIMENSION || dimensions.height > MAX_STORY_IMAGE_DIMENSION) {
    throw new Error("Upload a valid JPG, PNG, or WebP photo up to 4096 pixels per side.");
  }
  return dimensions;
}

export function isSafeStorageKey(key: string) {
  return key.length > 0 && key.length <= 512 && !key.includes("..") && /^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(key);
}

const CAPTURE_WINDOW_MS = 10 * 60 * 1000;
const CAPTURE_MAX_ATTEMPTS = 12;
const captureBuckets = new Map<string, { startedAt: number; count: number }>();

export function consumeCaptureQuota(clientKey: string, now = Date.now()) {
  const bucket = captureBuckets.get(clientKey);
  if (!bucket || now - bucket.startedAt >= CAPTURE_WINDOW_MS) {
    captureBuckets.set(clientKey, { startedAt: now, count: 1 });
    return true;
  }
  if (bucket.count >= CAPTURE_MAX_ATTEMPTS) return false;
  bucket.count += 1;
  return true;
}

export function resetCaptureQuotasForTests() {
  captureBuckets.clear();
}

export function applySecurityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Content-Security-Policy", "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' https:; connect-src 'self' https:; frame-src 'none'; upgrade-insecure-requests");
    if (req.secure || req.headers["x-forwarded-proto"] === "https") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
}
