import React from 'react';
import './NoteForm.css';

function NoteForm({ title, setTitle, content, setContent, onCreate, disabled }) {
  return (
    <form onSubmit={onCreate} className="note-form">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required /><br />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" required /><br />
      <button type="submit" disabled={disabled}>Create Note</button>
    </form>
  );
}

export default NoteForm;
