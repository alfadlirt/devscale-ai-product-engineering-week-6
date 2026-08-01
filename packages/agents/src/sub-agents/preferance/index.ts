import { createAgent } from "../../agent.js";

import { PREFERENCE_AGENT_PROMPT } from "./prompt.js";
import { PreferenceSchema } from "./schema.js";

import type { LangfuseTracing } from "@anvia/langfuse";

export function createPreferenceAgent(tracing: LangfuseTracing) {
  return createAgent({
    agentId: "preference-agent",
    additionalInstructions: [PREFERENCE_AGENT_PROMPT],
    additionalTools: [],
    outputSchema: PreferenceSchema,
    tracing,
  });
}
