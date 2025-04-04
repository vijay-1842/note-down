"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import { deleteData, getData } from "@/utils/axiosInstance";
import NoteCreationModal from "./components/NoteCreationModal";
import NoteEditModal from "./components/NoteEditModal";
import { useAppSelector } from '@/hooks/useAppSelector';
import { useRouter } from "next/navigation";

type NoteEditData = {
  note_id: string;
  note_title: string;
  note_content: string;
};

type Note = {
  note_id: string;
  note_title: string;
  note_content: string;
  created_on: Date;
  updated_on: Date;
}

const Home: React.FC = () => {
  const router = useRouter();
  const { token, decoded, authLoaded } = useAppSelector(state => state.auth);
  const [notes, setNotes] = useState<Note[]>([]);
  const [creationModalopen, setCreationModalOpen] = useState<boolean>(false);
  const [editModalopen, setEditModalOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<NoteEditData | null>(null);

  const getNotes = () => {
    getData("/api/notes").then((resp) => {
      setNotes(resp.data);
    });
  };

  const deleteNote = (note_id: string) => {
    deleteData(`api/notes/${note_id}`).then((resp) => {
      if (resp.success) getNotes();
    });
  };

  const handleEdit = (note: Note) => {
    setEditData({
      note_id: note.note_id,
      note_title: note.note_title,
      note_content: note.note_content,
    });
    setEditModalOpen(true);
  };

  useEffect(() => {
    if (!authLoaded) return;
    if (!token) router.replace("/signin");
    else getNotes();
  }, [token, authLoaded]);

  if (!authLoaded || !token) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <p>Hello {decoded?.user_name || "User"}</p>
      <div>
        <div className="my-4 flex justify-between">
          <h2>Your Notes</h2>
          <button onClick={() => setCreationModalOpen(true)}>
            Create New Note
          </button>
        </div>
        {notes.length === 0 && <p>No notes available</p>}
        {notes.map((note: Note) => (
          <div key={note.note_id} className="border p-4 my-2">
            <h3>{note.note_title}</h3>
            <p>{note.note_content}</p>
            <div>
              <button onClick={() => handleEdit(note)}>Edit</button>
              <button onClick={() => deleteNote(note.note_id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <NoteCreationModal
        open={creationModalopen}
        setOpen={setCreationModalOpen}
        getNotes={getNotes}
      />

      {editData && (
        <NoteEditModal
          open={editModalopen}
          setOpen={setEditModalOpen}
          getNotes={getNotes}
          noteData={editData}
          setEditData={setEditData}
        />
      )}
    </div>
  );
};

export default Home;
