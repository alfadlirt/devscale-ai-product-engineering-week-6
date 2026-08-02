import { Hono } from "hono";
import { createEventStream } from "@anvia/server";
import { createPrismaMemoryStore } from "@anvia/memory-prisma";
import { prisma } from "../../utils/prisma.js";
import { initAgent } from "../../utils/agent.js";
import { listAgentSessions } from "./data/agentSession.repository.js";

export const chatRouter = new Hono()
  .get("/", async (c) => {
    const data = await listAgentSessions();
    return c.json(data);
  })
  .get("/:sessionId", async (c) => {
    const sessionId = c.req.param("sessionId");
    const prismaMemory = createPrismaMemoryStore(prisma);
    const messages = await prismaMemory.load({ sessionId });
    return c.json(messages);
  })
  .post("/new", async (c) => {
    const sessionId = crypto.randomUUID();

    return c.json({ sessionId });
  })
  .post("/:sessionId", async (c) => {
    const sessionId = c.req.param("sessionId");
    const body = await c.req.json();
    const messages = body.messages;
    const lastMessage = messages.at(-1);

    const prismaMemory = createPrismaMemoryStore(prisma);

    const agent = initAgent(prismaMemory);

    const stream = agent
      .session(sessionId)
      .prompt(lastMessage)
      .withTrace({ sessionId })
      .stream();

    c.header("X-Session-Id", sessionId);

    return createEventStream(stream, {
      format: "jsonl",
    });
  });
