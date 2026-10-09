
import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notes")) || [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const inputRef = useRef(null);

  const saveNotes = (updatedNotes) => {
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter a title and note.");
      return;
    }

    if (editingId !== null) {
      saveNotes(
        notes.map((note) =>
          note.id === editingId
            ? { ...note, title, content }
            : note
        )
      );
      setEditingId(null);
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        title,
        content,
        date: new Date().toLocaleDateString(),
      };

      saveNotes([newNote, ...notes]);
    }

    setTitle("");
    setContent("");
    inputRef.current?.focus();
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    inputRef.current?.focus();
  };

  const deleteNote = (id) => {
    if (window.confirm("Delete this note?")) {
      saveNotes(notes.filter((note) => note.id !== id));
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>My Notes</h1>
          <p>Organize your thoughts and ideas</p>
        </header>

        <form onSubmit={handleSubmit} className="note-form">
          <h2>{editingId !== null ? "Edit Note" : "Add New Note"}</h2>

          <input
            ref={inputRef}
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
          />

          <button type="submit">
            {editingId !== null ? "Update Note" : "Add Note"}
          </button>
        </form>

        <h2 className="section-title">
          Your Notes ({notes.length})
        </h2>

        <div className="notes-grid">
          {notes.length === 0 ? (
            <p className="empty">No notes yet. Add your first note!</p>
          ) : (
            notes.map((note) => (
              <div className="note-card" key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <small>{note.date}</small>

                <div className="actions">
                  <button onClick={() => editNote(note)}>
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
