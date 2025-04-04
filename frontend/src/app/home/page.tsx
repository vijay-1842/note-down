"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import { deleteData, getData } from "@/utils/axiosInstance";
import NoteCreationModal from "./components/NoteCreationModal";

const Home: React.FC = () => {
  const [notes, setNotes] = useState([]);
  const [creationModalopen, setCreationModalOpen] = useState(false);

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

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div>
      <Header />
      <p>Hello User</p>
      <div>
        <div className="my-4 flex justify-between">
          <h2>Your Notes</h2>
          <button onClick={() => setCreationModalOpen(true)}>
            Create New Note
          </button>
        </div>
        {notes.length === 0 && <p>No notes available</p>}
        {notes.map((note: any) => (
          <div key={note.note_id} className="border p-4 my-2">
            <h3>{note.note_title}</h3>
            <p>{note.note_content}</p>
            <div>
              <button>Edit</button>
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
    </div>
  );
};

export default Home;
