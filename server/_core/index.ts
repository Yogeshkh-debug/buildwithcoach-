import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { sdk } from "./sdk";
import { serveStatic, setupVite } from "./vite";
import { applySecurityHeaders } from "../security";
import { processWeeklyChallenges } from "../weeklyChallenges";
import { getBuyerProgram } from "../db";
import { verifyBuyerSession } from "../buyerSession";
import { storageGetSignedUrl } from "../storage";
import { downloadPrivateProgramPdf, isSupabaseConfigured } from "../supabase";
import { getPrivatePdfHeaders } from "../buyerDownload";
import { parse as parseCookie } from "cookie";

const BUYER_SESSION_COOKIE = "bwc_buyer_session";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.disable("x-powered-by");
  app.use(applySecurityHeaders);
  app.use(express.json({ limit: "3mb" }));
  app.use(express.urlencoded({ limit: "32kb", extended: false }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.get("/api/buyer-program/download/:title", async (req, res) => {
    try {
      const sessionToken = parseCookie(req.headers.cookie ?? "")[BUYER_SESSION_COOKIE];
      const email = sessionToken ? await verifyBuyerSession(sessionToken) : null;
      if (!email) return res.status(401).json({ error: "Sign in to My Programs to open this PDF." });

      const program = await getBuyerProgram(email, req.params.title);
      if (!program) return res.status(404).json({ error: "This PDF is not available for this buyer." });

      let pdfBytes: Buffer;
      if (isSupabaseConfigured) {
        pdfBytes = (await downloadPrivateProgramPdf(program.storageKey)) ?? Buffer.alloc(0);
      } else {
        const storageUrl = await storageGetSignedUrl(program.storageKey);
        const fileResponse = await fetch(storageUrl);
        if (!fileResponse.ok) return res.status(502).json({ error: "The private PDF could not be prepared." });
        pdfBytes = Buffer.from(await fileResponse.arrayBuffer());
      }
      if (pdfBytes.subarray(0, 5).toString("ascii") !== "%PDF-") return res.status(502).json({ error: "The requested program is not a valid PDF." });
      return res.status(200).set(getPrivatePdfHeaders(program.fileName, pdfBytes.byteLength)).send(pdfBytes);
    } catch (error) {
      console.error("[BuyerDownload] Secure PDF access failed", error);
      return res.status(500).json({ error: "The private PDF could not be opened." });
    }
  });
  app.post("/api/scheduled/weekly-challenge", async (req, res) => {
    try {
      const actor = await sdk.authenticateRequest(req);
      if (!actor.isCron || !actor.taskUid) {
        return res.status(403).json({ ok: false, error: "Scheduled task access required." });
      }
      const forwardedProto = req.header("x-forwarded-proto")?.split(",")[0]?.trim();
      const protocol = forwardedProto === "https" || req.protocol === "https" ? "https" : "http";
      const host = req.get("host");
      if (!host) return res.status(400).json({ ok: false, error: "Missing request host." });
      const result = await processWeeklyChallenges({ publicBaseUrl: `${protocol}://${host}`, taskUid: actor.taskUid });
      return res.status(200).json(result);
    } catch (error) {
      console.error("[WeeklyChallenge] Scheduled delivery failed", error);
      return res.status(500).json({ ok: false, error: "Weekly challenge delivery failed." });
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
