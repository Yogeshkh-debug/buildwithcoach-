export function getPrivatePdfHeaders(fileName: string, byteLength: number) {
  const safeFileName = fileName.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 180) || "build-with-coach-program.pdf";
  return {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename="${safeFileName}"`,
    "Content-Length": String(byteLength),
    "Cache-Control": "private, no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
  };
}
