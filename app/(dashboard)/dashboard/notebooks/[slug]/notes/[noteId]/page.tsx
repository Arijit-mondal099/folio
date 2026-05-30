import { NoteView } from "./note-view";

interface NotesPageProps {
  params: Promise<{ slug: string; noteId: string }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug, noteId } = await params;
  return <NoteView notebookId={slug} noteId={noteId} />;
}
