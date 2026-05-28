import { NotebookView } from "./notebook-view";

interface NoteBooksPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NoteBooksPage({ params }: NoteBooksPageProps) {
  const { slug } = await params;
  return <NotebookView notebookId={slug} />;
}
