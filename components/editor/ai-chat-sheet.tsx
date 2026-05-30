"use client";

import * as React from "react";
import {
  ArrowDownToLine,
  Check,
  Loader2,
  Send,
  Sparkles,
  X
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export type NoteProposal = {
  action: "replace" | "append";
  content: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

// Forgiving open/close delimiters — accepts:
// - 2+ angle brackets on either side (model sometimes emits `<<` instead of `<<<`)
// - spacing inside delimiters
// - mixed case
// - hyphen / underscore / space between "note" and "action"
// - colon / equals / space between "note-action" and the action name
const OPEN_RE = /<{2,}\s*note[-_ ]?action\s*[:= ]\s*(replace|append)\s*>{2,}/i;
const CLOSE_RE = /<{2,}\s*end[-_ ]?note[-_ ]?action\s*>{2,}/i;

function extractProposal(text: string): {
  proposal: NoteProposal | null;
  displayText: string;
} {
  const open = text.match(OPEN_RE);
  if (!open || open.index === undefined) {
    return { proposal: null, displayText: text };
  }

  const contentStart = open.index + open[0].length;
  const tail = text.slice(contentStart);
  const close = tail.match(CLOSE_RE);
  if (!close || close.index === undefined) {
    return { proposal: null, displayText: text };
  }

  const contentEnd = contentStart + close.index;
  const closeEnd = contentEnd + close[0].length;

  const action = open[1].toLowerCase() as "replace" | "append";
  const content = text.slice(contentStart, contentEnd).trim();
  const displayText = (text.slice(0, open.index) + text.slice(closeEnd)).trim();

  return { proposal: { action, content }, displayText };
}

function hasOpenButUnclosedProposal(text: string): boolean {
  const open = text.match(OPEN_RE);
  if (!open || open.index === undefined) return false;
  const rest = text.slice(open.index + open[0].length);
  return !CLOSE_RE.test(rest);
}

export function AiChatSheet({
  open,
  onOpenChange,
  noteTitle,
  noteText,
  onApplyProposal
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteTitle: string;
  noteText: string;
  onApplyProposal?: (proposal: NoteProposal) => void | Promise<void>;
}) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [useContext, setUseContext] = React.useState(true);
  const [pending, setPending] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  // Abort any in-flight stream when the sheet closes
  React.useEffect(() => {
    if (!open && abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setPending(false);
    }
  }, [open]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending]);

  async function handleSend() {
    const text = input.trim();
    if (!text || pending) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text
    };
    const assistantId = crypto.randomUUID();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: ""
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: text }
          ],
          noteContext:
            useContext && (noteTitle.trim() || noteText.trim())
              ? { title: noteTitle, text: noteText }
              : undefined
        })
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        const friendly = errText || `Error: ${res.status}`;
        toast.error(friendly);
        // Drop the empty placeholder assistant bubble
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: accumulated } : m
          )
        );
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // Sheet closed mid-stream — leave whatever we had
      } else {
        const msg = err instanceof Error ? err.message : "Request failed";
        toast.error(msg);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      }
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="size-4" />
            AI Chat
          </SheetTitle>
          <SheetDescription>
            Ask the assistant about your note. It can reference the current
            content.
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center gap-2 border-b px-4 py-2">
          <input
            id="ai-use-context"
            type="checkbox"
            checked={useContext}
            onChange={(e) => setUseContext(e.target.checked)}
            className="accent-primary"
          />
          <Label htmlFor="ai-use-context" className="text-xs">
            Use this note as context
          </Label>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <EmptyHint />
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((m, i) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isStreaming={pending && i === messages.length - 1}
                  onApplyProposal={onApplyProposal}
                />
              ))}
              {pending && messages[messages.length - 1]?.content === "" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" />
                  Thinking…
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything…"
              rows={2}
              disabled={pending}
              className="min-h-10.5 flex-1 resize-none rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
            />
            <Button
              type="button"
              size="icon-sm"
              onClick={handleSend}
              disabled={pending || !input.trim()}
              aria-label="Send"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            Enter to send · Shift+Enter for newline · Chat history is not saved
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MessageBubble({
  message,
  isStreaming,
  onApplyProposal
}: {
  message: ChatMessage;
  isStreaming: boolean;
  onApplyProposal?: (proposal: NoteProposal) => void | Promise<void>;
}) {
  const isUser = message.role === "user";
  const [dismissed, setDismissed] = React.useState(false);
  const [applying, setApplying] = React.useState(false);
  const [applied, setApplied] = React.useState(false);

  if (isUser) {
    return (
      <div className="flex w-full justify-end">
        <div className="max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm whitespace-pre-wrap wrap-break-word text-primary-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  const { proposal, displayText } = extractProposal(message.content);
  const stillStreamingProposal =
    isStreaming && !proposal && hasOpenButUnclosedProposal(message.content);

  const showProposalPanel = !!proposal && !dismissed && !applied;

  async function handleApply() {
    if (!proposal || !onApplyProposal || applying) return;
    setApplying(true);
    try {
      await onApplyProposal(proposal);
      setApplied(true);
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm wrap-break-word text-foreground">
        {displayText ? (
          <AssistantMarkdown content={displayText} />
        ) : stillStreamingProposal ? (
          <span className="flex items-center gap-2 italic text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Drafting…
          </span>
        ) : message.content ? (
          // Edge case: model replied with ONLY an action block, no preamble
          <span className="italic text-muted-foreground">
            Proposed an edit.
          </span>
        ) : (
          <span className="italic text-muted-foreground">…</span>
        )}
      </div>

      {showProposalPanel && proposal && (
        <ProposalPanel
          proposal={proposal}
          applying={applying}
          onApply={handleApply}
          onDismiss={() => setDismissed(true)}
        />
      )}

      {applied && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Check className="size-3" />
          Applied to note
        </p>
      )}
    </div>
  );
}

function ProposalPanel({
  proposal,
  applying,
  onApply,
  onDismiss
}: {
  proposal: NoteProposal;
  applying: boolean;
  onApply: () => void;
  onDismiss: () => void;
}) {
  const label =
    proposal.action === "replace"
      ? "Proposed: replace entire note"
      : "Proposed: append to note";
  const Icon = proposal.action === "replace" ? Sparkles : ArrowDownToLine;

  return (
    <div className="max-w-[85%] rounded-lg border border-dashed bg-background p-2.5 text-xs">
      <div className="mb-2 flex items-center gap-1.5 font-medium">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={proposal.action === "replace" ? "destructive" : "default"}
          onClick={onApply}
          disabled={applying}
        >
          {applying && <Loader2 className="size-3 animate-spin" />}
          Apply
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onDismiss}
          disabled={applying}
        >
          <X className="size-3.5" />
          Dismiss
        </Button>
      </div>
    </div>
  );
}

function AssistantMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => (
          <ul className="mb-2 list-disc pl-5 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal pl-5 last:mb-0">{children}</ol>
        ),
        li: ({ children }) => <li className="my-0.5">{children}</li>,
        h1: ({ children }) => (
          <h1 className="mb-2 text-base font-semibold">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2 text-sm font-semibold">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-1 text-sm font-semibold">{children}</h3>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary underline underline-offset-2"
          >
            {children}
          </a>
        ),
        code: ({ children, className }) => {
          // Defensive: hide any note-action block that slipped past the
          // top-level regex extraction (it should already be stripped).
          if (className && /\blanguage-note-action\b/.test(className)) {
            return null;
          }
          const isBlock = !!className;
          if (isBlock) {
            return <code className="font-mono text-xs">{children}</code>;
          }
          return (
            <code className="rounded bg-background/60 px-1 py-0.5 font-mono text-[0.85em]">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="mb-2 overflow-x-auto rounded-md bg-background/60 p-2 text-xs last:mb-0">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-2 border-l-2 border-border pl-3 italic text-muted-foreground last:mb-0">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="my-2 border-border" />
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function EmptyHint() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <Sparkles className="size-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Ask the assistant</p>
        <p className="text-xs text-muted-foreground">
          Try &ldquo;Summarize this note&rdquo; or &ldquo;Suggest next
          steps&rdquo;.
        </p>
      </div>
    </div>
  );
}
