import { prisma } from "../../../utils/prisma.js";

export async function listAgentSessions(limit = 20) {
  return prisma.agentMemorySession.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
