"use client";

import * as React from "react";
import type { Editor } from "@tiptap/react";
// Value imports load TipTap chain-command type augmentations. The void
// references keep the imports from being tree-shaken or flagged as unused.
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
void StarterKit;
void Link;
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Languages,
  Link as LinkIcon,
  Loader2,
  MessageSquareQuote,
  Pilcrow,
  Sparkles,
  SpellCheck,
  Strikethrough,
  Wand2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useTransformText } from "@/lib/ai-queries";
import type { TransformAction } from "@/server/ai";
import { cn } from "@/lib/utils";

export function BubbleToolbar({ editor }: { editor: Editor | null }) {
  const transform = useTransformText();

  if (!editor) return null;

  function getSelectedText(): string {
    if (!editor) return "";
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, " ").trim();
  }

  async function runTransform(action: TransformAction, instruction?: string) {
    if (!editor) return;
    const text = getSelectedText();
    if (!text) return;
    try {
      const result = await transform.mutateAsync({ text, action, instruction });
      editor.chain().focus().deleteSelection().insertContent(result).run();
    } catch {
      // toast surfaced by the hook
    }
  }

  function handleCustom() {
    const instruction = window.prompt(
      "Custom instruction (e.g., 'Convert to bullet points'):"
    );
    if (!instruction || !instruction.trim()) return;
    runTransform("custom", instruction.trim());
  }

  const pending = transform.isPending;

  function toggleLink() {
    if (!editor) return;
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const previous = (editor.getAttributes("link").href as string) ?? "";
    const url = window.prompt("URL", previous);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg border bg-popover p-1 shadow-md">
      <ToolbarButton
        active={editor.isActive("paragraph") && !editor.isActive("heading")}
        onClick={() => editor.chain().focus().setParagraph().run()}
        label="Paragraph"
      >
        <Pilcrow className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        label="Heading 1"
      >
        <Heading1 className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        label="Heading 2"
      >
        <Heading2 className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        label="Heading 3"
      >
        <Heading3 className="size-3.5" />
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        label="Bold"
      >
        <Bold className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        label="Italic"
      >
        <Italic className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        label="Strikethrough"
      >
        <Strikethrough className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        label="Inline code"
      >
        <Code className="size-3.5" />
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        active={editor.isActive("link")}
        onClick={toggleLink}
        label="Link"
      >
        <LinkIcon className="size-3.5" />
      </ToolbarButton>

      <Separator />

      <ToolbarButton
        active={false}
        onClick={() => runTransform("fix-typos")}
        label="Fix typos"
        disabled={pending}
      >
        {pending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Wand2 className="size-3.5" />
        )}
      </ToolbarButton>
      <ToolbarButton
        active={false}
        onClick={() => runTransform("fix-grammar")}
        label="Fix grammar"
        disabled={pending}
      >
        <SpellCheck className="size-3.5" />
      </ToolbarButton>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7"
            disabled={pending}
            onMouseDown={(e) => e.preventDefault()}
            aria-label="More AI actions"
          >
            <Sparkles className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={6} className="w-48">
          <DropdownMenuItem
            onClick={() => runTransform("improve-clarity")}
            onMouseDown={(e) => e.preventDefault()}
          >
            Improve clarity
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => runTransform("shorten")}
            onMouseDown={(e) => e.preventDefault()}
          >
            Make shorter
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => runTransform("expand")}
            onMouseDown={(e) => e.preventDefault()}
          >
            Make longer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => runTransform("summarize")}
            onMouseDown={(e) => e.preventDefault()}
          >
            <MessageSquareQuote className="size-3.5" />
            Summarize
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger onMouseDown={(e) => e.preventDefault()}>
              Change tone
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => runTransform("tone-professional")}
                onMouseDown={(e) => e.preventDefault()}
              >
                Professional
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => runTransform("tone-casual")}
                onMouseDown={(e) => e.preventDefault()}
              >
                Casual
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => runTransform("tone-friendly")}
                onMouseDown={(e) => e.preventDefault()}
              >
                Friendly
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger onMouseDown={(e) => e.preventDefault()}>
              <Languages className="size-3.5" />
              Translate
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => runTransform("translate-english")}
                onMouseDown={(e) => e.preventDefault()}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => runTransform("translate-spanish")}
                onMouseDown={(e) => e.preventDefault()}
              >
                Spanish
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => runTransform("translate-french")}
                onMouseDown={(e) => e.preventDefault()}
              >
                French
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleCustom}
            onMouseDown={(e) => e.preventDefault()}
          >
            Custom instruction…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
  disabled
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      className={cn("h-7 w-7", active && "bg-accent text-accent-foreground")}
    >
      {children}
    </Button>
  );
}

function Separator() {
  return <span className="mx-0.5 h-5 w-px bg-border" />;
}
