import { createAgent } from "../../agent.js";

import { PLACE_AGENT_PROMPT } from "./prompt.js";
import { PlaceResultSchema } from "./schema.js";

import type { LangfuseTracing } from "@anvia/langfuse";
import { createWebTools } from "../../tools/web-search.js";

export function createPlaceAgent(tracing: LangfuseTracing) {
  return createAgent({
    agentId: "place-agent",
    additionalInstructions: [PLACE_AGENT_PROMPT],
    additionalTools: [...createWebTools()],
    outputSchema: PlaceResultSchema,
    tracing,
  });
}
