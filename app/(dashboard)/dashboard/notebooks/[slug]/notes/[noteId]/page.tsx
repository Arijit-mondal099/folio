import type { Metadata } from "next";

import { editorJsonToPlainText } from "@/lib/editor-content";
import { getNoteById } from "@/server/notes";

import { NoteView } from "./note-view";

interface NotesPageProps {
  params: Promise<{ slug: string; noteId: string }>;
}

export async function generateMetadata({
  params
}: NotesPageProps): Promise<Metadata> {
  const { slug, noteId } = await params;
  const result = await getNoteById(slug, noteId);
  const title = result.data?.title?.trim();
  const snippet = result.data?.content
    ? editorJsonToPlainText(result.data.content).slice(0, 160)
    : "";
  return {
    title: title || "Note",
    description: snippet || "A note on folio.",
    robots: { index: false, follow: false }
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug, noteId } = await params;
  return <NoteView notebookId={slug} noteId={noteId} />;
}
