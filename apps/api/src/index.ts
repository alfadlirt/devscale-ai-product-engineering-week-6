import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { chatRouter } from "./modules/chat/router.js";
import { cors } from "hono/cors";

const app = new Hono().use(cors()).route("/api/chat", chatRouter);

app.get("/api/healthz", (c) => c.json({ status: "ok" }));

serve(
  {
    fetch: app.fetch,
    hostname: process.env.HOST ?? "0.0.0.0",
    port: Number(process.env.PORT ?? 8000),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
