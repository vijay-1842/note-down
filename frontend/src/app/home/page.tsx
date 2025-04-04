"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import { deleteData, getData } from "@/utils/axiosInstance";
import NoteCreationModal from "./components/NoteCreationModal";
import NoteEditModal from "./components/NoteEditModal";
import { useAppSelector } from "@/hooks/useAppSelector";
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
  last_update: Date;
};

const Home: React.FC = () => {
  const router = useRouter();
  const { token, decoded, authLoaded } = useAppSelector((state) => state.auth);
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
    <div className="flex flex-col items-stretch justify-center min-h-screen w-full">
      <Header />
      <div className="flex flex-grow flex-col max-w-7xl w-full px-4 mx-auto py-8">
        <h1 className="font-bold text-3xl">
          Hello, {decoded?.user_name || "User"}
        </h1>
        <div>
          <div className="my-4 flex justify-between">
            <h2 className="font-bold text-xl">Your Notes</h2>
            <button
              onClick={() => setCreationModalOpen(true)}
              className="text-white bg-purple-800 py-1 px-4 font-bold cursor-pointer rounded-lg cursor-pointer hover:rounded-sm hover:bg-purple-600 hover:shadow-xl transition duration-200"
            >
              Create New Note
            </button>
          </div>
          {notes.length === 0 ? (
            <div className="my-8">No notes available! Create a new one.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {notes.map((note: Note) => {
                const lastUpdated = new Date(note.last_update);
                const formattedDate = lastUpdated.toLocaleTimeString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div
                    key={note.note_id}
                    className="border p-4 rounded-lg shadow-md"
                  >
                    <h3 className="font-bold text-lg">{note.note_title}</h3>
                    <p>{note.note_content}</p>
                    <div className="my-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(note)}
                        className="text-white bg-purple-400 rounded px-4 py-1 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note.note_id)}
                        className="text-white bg-red-400 rounded px-4 py-1 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="text-end">
                      <p className="text-xs">Last Updated: {formattedDate}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
