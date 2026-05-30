import type { Metadata } from "next";

import { getNoteBookById } from "@/server/note-books";

import { NotebookView } from "./notebook-view";

interface NoteBooksPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params
}: NoteBooksPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getNoteBookById(slug);
  const name = result.data?.name?.trim();
  return {
    title: name || "Notebook",
    description: name ? `Notes in ${name}` : "Your notebook on folio.",
    robots: { index: false, follow: false }
  };
}

export default async function NoteBooksPage({ params }: NoteBooksPageProps) {
  const { slug } = await params;
  return <NotebookView notebookId={slug} />;
}
