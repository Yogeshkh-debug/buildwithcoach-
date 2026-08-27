import { storageGetSignedUrl } from "../server/storage.ts";
import { freeStarterDeliveryItem, resolvePlanDeliveryItems } from "../server/planDelivery.ts";

const programs = [
  ...resolvePlanDeliveryItems(["Home Zero", "Gym Build", "Fuel Plan", "Zero to Growth"]),
  freeStarterDeliveryItem,
];

const sizes = [];
for (const program of programs) {
  const url = await storageGetSignedUrl(program.storageKey);
  let response = await fetch(url, { method: "HEAD" });
  if (!response.ok || !response.headers.get("content-length")) {
    response = await fetch(url, { headers: { Range: "bytes=0-0" } });
  }
  const contentRange = response.headers.get("content-range");
  const totalFromRange = contentRange?.match(/\/(\d+)$/)?.[1];
  const bytes = Number(totalFromRange ?? response.headers.get("content-length"));
  if (!response.ok || !Number.isFinite(bytes) || bytes <= 0) {
    throw new Error(`Could not determine the stored size for ${program.title}.`);
  }
  sizes.push({ title: program.title, fileName: program.fileName, bytes });
}

console.log(JSON.stringify({
  programs: sizes,
  maximumSinglePdfBytes: Math.max(...sizes.map((program) => program.bytes)),
  maximumFourProgramOrderBytes: sizes.slice(0, 4).reduce((total, program) => total + program.bytes, 0),
}));
