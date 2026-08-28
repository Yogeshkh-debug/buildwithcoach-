import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "./_core/index";
import type { Server } from "node:http";

let server: Server;
let baseUrl = "";

beforeAll(async () => {
  const { app } = await createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address && typeof address !== "string") baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

describe("Vercel Sunday cron authorization", () => {
  it("accepts the configured CRON_SECRET at the protected endpoint", async () => {
    const secret = process.env.CRON_SECRET;
    expect(secret).toBeTruthy();
    const response = await fetch(`${baseUrl}/api/scheduled/weekly-challenge`, {
      headers: { authorization: `Bearer ${secret}` },
    });
    expect(response.status).not.toBe(401);
  }, 15_000);
});
