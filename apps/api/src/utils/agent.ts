import {
  tracing,
  createAgent,
  BASE_PLANNER_INSTRUCTIONS,
  createPreferenceAgent,
  createPlaceAgent,
  createScheduleAgent,
  createReviewerAgent,
  PREFERENCE_AGENT_TOOL_DESCRIPTION,
  PLACE_AGENT_TOOL_DESCRIPTION,
  SCHEDULE_AGENT_TOOL_DESCRIPTION,
  REVIEWER_AGENT_TOOL_DESCRIPTION,
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
        description: PREFERENCE_AGENT_TOOL_DESCRIPTION,
      }),
      placeAgent.asTool({
        name: "place_agent",
        description: PLACE_AGENT_TOOL_DESCRIPTION,
      }),
      scheduleAgent.asTool({
        name: "schedule_agent",
        description: SCHEDULE_AGENT_TOOL_DESCRIPTION,
      }),
      reviewerAgent.asTool({
        name: "reviewer_agent",
        description: REVIEWER_AGENT_TOOL_DESCRIPTION,
      }),
      //   ...sandboxTools,
    ],
    tracing,
    memory: memory,
  });

  return mainAgent;
}
