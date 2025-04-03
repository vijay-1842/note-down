"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import { getData } from "@/utils/axiosInstance";

const Home: React.FC = () => {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    getData("/api/notes").then((data) => {
      setNotes(data);
    });
  }, []);

  return (
    <div>
      <Header />
      <p>Hello User</p>
      <div>
        <div className="my-4 flex justify-between">
          <h2>Your Notes</h2>
          <button onClick={() => alert("Create new note")}>
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
    </div>
  );
};

export default Home;
