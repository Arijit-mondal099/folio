"use server";

import { headers } from "next/headers";
import OpenAI from "openai";

import { auth } from "@/lib/auth";
import { DEFAULT_MODEL, getOpenAI } from "@/lib/llm";

function stripThinkBlocks(text: string): string {
  // Remove Qwen3-style <think>...</think> reasoning blocks.
  // Strips both completed blocks and any unclosed trailing one.
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<think>[\s\S]*$/i, "")
    .trim();
}

function describeAIError(error: unknown): string {
  if (error instanceof OpenAI.APIError) {
    if (error.status === 429) {
      return "Rate limit reached. Wait ~60 seconds and try again.";
    }
    if (error.status === 401 || error.status === 403) {
      return "AI provider rejected the API key. Check GROQ_API_KEY.";
    }
    return `AI provider error (${error.status ?? "unknown"}): ${error.message}`;
  }
  return error instanceof Error
    ? error.message
    : "AI request failed, please try again";
}

export type TransformAction =
  | "fix-typos"
  | "fix-grammar"
  | "improve-clarity"
  | "shorten"
  | "expand"
  | "summarize"
  | "tone-professional"
  | "tone-casual"
  | "tone-friendly"
  | "translate-english"
  | "translate-spanish"
  | "translate-french"
  | "custom";

const RETURN_ONLY = `Return ONLY the transformed text. No preamble, no explanations, no markdown code fences, no surrounding quotes. Preserve line breaks where appropriate.`;

const SYSTEM_PROMPTS: Record<Exclude<TransformAction, "custom">, string> = {
  "fix-typos": `You are a precise text editor. Fix only typos and obvious spelling mistakes in the text. Do not rewrite, rephrase, or change meaning. ${RETURN_ONLY}`,
  "fix-grammar": `You are a careful grammar editor. Fix grammar, punctuation, and capitalization issues. Preserve the author's voice and meaning. ${RETURN_ONLY}`,
  "improve-clarity": `You are a writing coach. Rewrite the text to be clearer and easier to read while preserving its meaning. ${RETURN_ONLY}`,
  shorten: `Rewrite the text to be shorter and more concise. Preserve the meaning. ${RETURN_ONLY}`,
  expand: `Expand the text with more detail and depth. Stay on topic and consistent with the author's voice. ${RETURN_ONLY}`,
  summarize: `Summarize the text into a brief, accurate summary. ${RETURN_ONLY}`,
  "tone-professional": `Rewrite the text in a professional tone. Preserve the meaning. ${RETURN_ONLY}`,
  "tone-casual": `Rewrite the text in a casual, friendly tone. Preserve the meaning. ${RETURN_ONLY}`,
  "tone-friendly": `Rewrite the text in a warm, friendly tone. Preserve the meaning. ${RETURN_ONLY}`,
  "translate-english": `Translate the text into English. ${RETURN_ONLY}`,
  "translate-spanish": `Translate the text into Spanish. ${RETURN_ONLY}`,
  "translate-french": `Translate the text into French. ${RETURN_ONLY}`
};

export async function transformText(input: {
  text: string;
  action: TransformAction;
  instruction?: string;
}): Promise<{ success: boolean; message: string; data?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user.id) {
      return { success: false, message: "Please try to re-authenticate" };
    }

    const trimmed = input.text.trim();
    if (!trimmed) {
      return { success: false, message: "No text selected" };
    }
    if (trimmed.length > 10_000) {
      return {
        success: false,
        message: "Selection is too long (limit 10,000 characters)"
      };
    }

    const systemPrompt =
      input.action === "custom"
        ? `Apply the following instruction to the text. ${RETURN_ONLY}\n\nInstruction: ${
            input.instruction?.trim() || "Improve the text."
          }`
        : SYSTEM_PROMPTS[input.action];

    const client = getOpenAI();
    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        // /no_think disables Qwen3's chain-of-thought; harmless on other models.
        { role: "user", content: `${trimmed}\n\n/no_think` }
      ]
    });

    const rawOutput = response.choices[0]?.message?.content ?? "";
    const output = stripThinkBlocks(rawOutput);
    if (!output) {
      return { success: false, message: "AI returned an empty response" };
    }

    return {
      success: true,
      message: "Text transformed",
      data: output
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: describeAIError(error)
    };
  }
}
