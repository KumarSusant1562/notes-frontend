import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [tenant, setTenant] = useState('');
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [limitReached, setLimitReached] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const res = await axios.post(`${API}/login`, { email, password });
      setToken(res.data.token);
      setRole(res.data.role);
      setTenant(res.data.tenant);
      setError('');
    } catch (err) {
      setError('Login failed');
    }
  };

  const fetchNotes = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(res.data);
      setLimitReached(notes.length >= 3 && role === 'member');
    } catch (err) {
      setError('Failed to fetch notes');
    }
  };

  useEffect(() => {
    fetchNotes();
  
  }, [token]);

  const createNote = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/notes`, { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle('');
      setContent('');
      fetchNotes();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create note');
      if (err.response?.data?.error?.includes('Note limit')) setLimitReached(true);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotes();
      setError('');
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const upgrade = async () => {
    try {
      await axios.post(`${API}/tenants/${tenant}/upgrade`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLimitReached(false);
      fetchNotes();
      setError('');
    } catch (err) {
      setError('Upgrade failed');
    }
  };

  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
        <h2>Login</h2>
        <form onSubmit={login}>
          <input name="email" placeholder="Email" required /><br />
          <input name="password" type="password" placeholder="Password" required /><br />
          <button type="submit">Login</button>
        </form>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div style={{ marginTop: 20 }}>
          <b>Test Accounts:</b>
          <ul>
            <li>admin@acme.test / password</li>
            <li>user@acme.test / password</li>
            <li>admin@globex.test / password</li>
            <li>user@globex.test / password</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Notes ({tenant})</h2>
      <form onSubmit={createNote}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required /><br />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" required /><br />
        <button type="submit" disabled={limitReached}>Create Note</button>
      </form>
      {limitReached && (
        <div style={{ color: 'orange', marginTop: 10 }}>
          Note limit reached. <b>Upgrade to Pro</b> to add more notes.<br />
          {role === 'admin' && <button onClick={upgrade}>Upgrade to Pro</button>}
        </div>
      )}
      <ul>
        {notes.map(note => (
          <li key={note._id}>
            <b>{note.title}</b>: {note.content}
            <button onClick={() => deleteNote(note._id)} style={{ marginLeft: 10 }}>Delete</button>
          </li>
        ))}
      </ul>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={() => setToken('')}>Logout</button>
    </div>
  );
}

export default App;
