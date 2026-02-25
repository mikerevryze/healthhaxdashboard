import type { Express } from "express";
import { type Server } from "http";
import { log } from "./logger";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Stress Test Submission
  // Accepts wizard data, forwards to n8n webhook for research + PDF + email
  app.post("/api/stress-test/submit", async (req, res) => {
    try {
      const payload = req.body;

      if (!payload.email || !payload.brandName) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      log(
        `Stress test submission: ${payload.firstName} ${payload.lastName} <${payload.email}> — ${payload.brandName}`,
        "api",
      );

      // Forward to n8n webhook (fire-and-forget)
      const n8nWebhookUrl = process.env.N8N_STRESS_TEST_WEBHOOK;
      if (n8nWebhookUrl) {
        fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch((err) => {
          log(`n8n webhook error: ${err.message}`, "api");
        });
      } else {
        log(
          "N8N_STRESS_TEST_WEBHOOK not configured — skipping automation",
          "api",
        );
      }

      res.json({ success: true, message: "Submission received" });
    } catch (err: any) {
      log(`Stress test submit error: ${err.message}`, "api");
      res.status(500).json({ message: "Submission failed" });
    }
  });

  return httpServer;
}
