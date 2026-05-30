import OpenAI from "openai";

import { env } from "@/lib/env";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

export const DEFAULT_MODEL = "qwen/qwen3-32b";

let client: OpenAI | undefined;

export function getOpenAI(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: env.GROQ_API_KEY,
      baseURL: GROQ_BASE_URL
    });
  }
  return client;
}
