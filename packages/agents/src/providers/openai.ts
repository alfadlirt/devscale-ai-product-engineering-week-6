import { OpenAIClient } from "@anvia/openai";

const openai = new OpenAIClient({
  apiKey: process.env.OPENAI_API_KEY,
  baseUrl: process.env.OPENAI_BASE_URL,
});

// export const defaultModel = openai.completionModel("deepseek-v4-flash");
export const defaultModel = openai.completionModel("grok-4.3");
