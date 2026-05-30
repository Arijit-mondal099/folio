import type { JSONContent } from "@tiptap/react";

export type TipTapJSON = JSONContent;

export const EMPTY_DOC: TipTapJSON = {
  type: "doc",
  content: [{ type: "paragraph" }]
};

function wrapLegacyText(text: string): TipTapJSON {
  if (!text) return EMPTY_DOC;
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }]
      }
    ]
  };
}

function isLegacyShape(value: unknown): value is { text: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "text" in value &&
    typeof (value as { text: unknown }).text === "string" &&
    !("type" in value)
  );
}

function isTipTapDoc(value: unknown): value is TipTapJSON {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as { type: unknown }).type === "doc"
  );
}

export function editorJsonToPlainText(content: unknown): string {
  const doc = toEditorContent(content);
  const parts: string[] = [];

  function walk(node: JSONContent | undefined) {
    if (!node) return;
    if (node.type === "text" && typeof node.text === "string") {
      parts.push(node.text);
      return;
    }
    if (Array.isArray(node.content)) {
      for (const child of node.content) walk(child);
    }
    if (node.type === "paragraph" || node.type === "heading") {
      parts.push("\n");
    }
  }

  walk(doc);
  return parts.join("").trim();
}

export function toEditorContent(content: unknown): TipTapJSON {
  try {
    // Strings might be JSON-encoded documents
    if (typeof content === "string") {
      try {
        const parsed = JSON.parse(content);
        return toEditorContent(parsed);
      } catch {
        return wrapLegacyText(content);
      }
    }

    if (isTipTapDoc(content)) {
      return content;
    }

    if (isLegacyShape(content)) {
      return wrapLegacyText(content.text);
    }

    return EMPTY_DOC;
  } catch {
    return EMPTY_DOC;
  }
}
