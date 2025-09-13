import React, { useState } from 'react';
import './NotesList.css';


function NotesList({ notes, onDelete, onEdit }) {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const startEdit = (note) => {
    setEditId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    onEdit(editId, editTitle, editContent);
    setEditId(null);
    setEditTitle('');
    setEditContent('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle('');
    setEditContent('');
  };

  return (
    <div className="notes-grid">
      {notes.map(note => (
        <div key={note._id} className="note-card">
          {editId === note._id ? (
            <>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="edit-input" />
              <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="edit-textarea" />
              <div className="edit-actions">
                <button onClick={saveEdit} className="save-btn">Save</button>
                <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div className="note-title">{note.title}</div>
              <div className="note-content">{note.content}</div>
              <div className="note-actions">
                <button onClick={() => startEdit(note)} className="edit-btn">Edit</button>
                <button onClick={() => onDelete(note._id)} className="delete-btn">Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default NotesList;
