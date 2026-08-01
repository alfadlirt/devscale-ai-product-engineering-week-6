import { createAgent } from "../../agent.js";

import { SCHEDULE_AGENT_PROMPT } from "./prompt.js";
import { ScheduleOutputSchema } from "./schema.js";

import type { LangfuseTracing } from "@anvia/langfuse";

export function createScheduleAgent(tracing: LangfuseTracing) {
  return createAgent({
    agentId: "schedule-agent",
    additionalInstructions: [SCHEDULE_AGENT_PROMPT],
    additionalTools: [],
    outputSchema: ScheduleOutputSchema,
    tracing,
  });
}
