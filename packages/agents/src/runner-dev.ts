// Preserved for runner
import { createAgent } from "./agent.js";
import { tracing } from "./tracing.js";
import { createSandboxTools, DockerSandbox } from "@anvia/sandbox";
import { Studio } from "@anvia/studio";
import { BASE_PLANNER_INSTRUCTIONS } from "./prompts/base-instructions.js";
import { createPlaceAgent } from "./sub-agents/place/index.js";
import { createScheduleAgent } from "./sub-agents/schedule/index.js";
import { createPreferenceAgent } from "./sub-agents/preferance/index.js";
import { createReviewerAgent } from "./sub-agents/reviewer/index.js";

const session = await DockerSandbox.node().createSession();
const sandboxTools = createSandboxTools(session);

// sub agent list as a tools
const preferenceAgent = createPreferenceAgent(tracing);
const placeAgent = createPlaceAgent(tracing);
const scheduleAgent = createScheduleAgent(tracing);
const reviewerAgent = createReviewerAgent(tracing);

const mainAgent = createAgent({
  agentId: "main-agent",
  additionalInstructions: [BASE_PLANNER_INSTRUCTIONS],
  additionalTools: [
    preferenceAgent.asTool({ name: "preference_agent", description: "..." }),
    placeAgent.asTool({ name: "place_agent", description: "..." }),
    scheduleAgent.asTool({ name: "schedule_agent", description: "..." }),
    reviewerAgent.asTool({ name: "reviewer_agent", description: "..." }),
    ...sandboxTools,
  ],
  tracing,
});

export const studio = new Studio([
  mainAgent,
  preferenceAgent,
  placeAgent,
  scheduleAgent,
  reviewerAgent,
]).serve({
  port: 4021,
  onShutdown: async () => {
    await session.destroy();
    tracing.flush();
  },
});
