interface NotesPageProps {
  params: Promise<{ noteId: string }>;
}

const NotesPage: React.FC<NotesPageProps> = async ({ params }) => {
  const { noteId } = await params;
  return <div>Note {noteId}</div>;
};

export default NotesPage;
