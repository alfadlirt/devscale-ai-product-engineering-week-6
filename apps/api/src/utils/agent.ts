import {
  tracing,
  createAgent,
  BASE_PLANNER_INSTRUCTIONS,
  createPreferenceAgent,
  createPlaceAgent,
  createScheduleAgent,
  createReviewerAgent,
} from "@devscale/agent";
import { PrismaMemoryStore } from "@anvia/memory-prisma";

export function initAgent(memory: PrismaMemoryStore) {
  // sub agent list as a tools
  const preferenceAgent = createPreferenceAgent(tracing);
  const placeAgent = createPlaceAgent(tracing);
  const scheduleAgent = createScheduleAgent(tracing);
  const reviewerAgent = createReviewerAgent(tracing);

  const mainAgent = createAgent({
    agentId: "main-agent",
    additionalInstructions: [BASE_PLANNER_INSTRUCTIONS],
    additionalTools: [
      preferenceAgent.asTool({
        name: "preference_agent",
        description: "...",
      }),
      placeAgent.asTool({ name: "place_agent", description: "..." }),
      scheduleAgent.asTool({ name: "schedule_agent", description: "..." }),
      reviewerAgent.asTool({ name: "reviewer_agent", description: "..." }),
      //   ...sandboxTools,
    ],
    tracing,
    memory: memory,
  });

  return mainAgent;
}
