import { createTool } from "@anvia/core";
import { tavily } from "@tavily/core";
import { z } from "zod";

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY! });

export function createWebTools() {
  const webSearch = createTool({
    name: "webSearch",
    description:
      "Search the internet for place candidates. Returns a short answer plus lean result snippets.",
    input: z.object({
      query: z.string().meta({ description: "The query to search" }),
    }),
    execute: ({ query }) => {
      return tavilyClient.search(query, {
        searchDepth: "basic",
        maxResults: 5,
        includeAnswer: true,
        includeRawContent: false,
        includeImages: false,
      });
    },
  });

  const webExtract = createTool({
    name: "webExtract",
    description:
      "Extract information from a specific webpage when search snippets are not enough.",
    input: z.object({
      url: z.url().meta({ description: "The URL to extract" }),
    }),
    execute: ({ url }) =>
      tavilyClient.extract([url], {
        extractDepth: "basic",
        format: "text",
        includeImages: false,
      }),
  });

  return [webSearch, webExtract];
}
