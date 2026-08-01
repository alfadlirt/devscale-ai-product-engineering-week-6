import { createAgent } from "../../agent.js";

import { REVIEWER_AGENT_PROMPT } from "./prompt.js";
import { ReviewerResultSchema } from "./schema.js";

import type { LangfuseTracing } from "@anvia/langfuse";

export function createReviewerAgent(tracing: LangfuseTracing) {
  return createAgent({
    agentId: "reviewer-agent",
    additionalInstructions: [REVIEWER_AGENT_PROMPT],
    additionalTools: [],
    outputSchema: ReviewerResultSchema,
    tracing,
  });
}
