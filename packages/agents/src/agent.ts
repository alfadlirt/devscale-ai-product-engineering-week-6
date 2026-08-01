import {
  AgentBuilder,
  type AnyTool,
  type CompletionModel,
  type MemoryStore,
  type ZodSchema,
} from "@anvia/core";
import { createWebTools } from "./tools/web-search.js";
import { BASE_INSTRUCTIONS } from "./prompts/base-instructions.js";
import type { LangfuseTracing } from "@anvia/langfuse";
import { defaultModel } from "./providers/openai.js";

interface CreateAgentOptions {
  agentId: string;
  model?: CompletionModel;
  additionalTools?: AnyTool[];
  additionalInstructions?: string[];
  tracing: LangfuseTracing;
  memory?: MemoryStore;
  outputSchema?: ZodSchema;
}

export function createAgent(opts: CreateAgentOptions) {
  const agent = new AgentBuilder(opts.agentId, opts.model ?? defaultModel)
    .instructions(BASE_INSTRUCTIONS)
    .tools([...(opts.additionalTools ?? [])])
    .observe(opts.tracing);

  if (opts.additionalInstructions) {
    for (const instruction of opts.additionalInstructions) {
      agent.instructions(instruction);
    }
  }

  if (opts.memory) {
    agent.memory(opts.memory);
  }

  if (opts.outputSchema) {
    agent.outputSchema(opts.outputSchema);
  }

  return agent.build();
}
