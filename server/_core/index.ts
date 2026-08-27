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
