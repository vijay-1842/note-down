"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import { getData } from "@/utils/axiosInstance";
import NoteCreationModal from "./components/NoteCreationModal";

const Home: React.FC = () => {
  const [notes, setNotes] = useState([]);
  const [creationModalopen, setCreationModalOpen] = useState(false);

  const getNotes = () => {
    getData("/api/notes").then((data) => {
      setNotes(data);
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
          <div key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
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
