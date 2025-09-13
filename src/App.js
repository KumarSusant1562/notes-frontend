import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import NotesList from './components/NotesList';
import NoteForm from './components/NoteForm';
import UpgradeBanner from './components/UpgradeBanner';
import './App.css';

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
      setLimitReached(res.data.length >= 3 && role === 'member');
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

  // Edit note handler
  const editNote = async (id, newTitle, newContent) => {
    try {
      await axios.put(`${API}/notes/${id}`, { title: newTitle, content: newContent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotes();
      setError('');
    } catch (err) {
      setError('Failed to edit note');
    }
  };

  
  const showUpgradeBanner = limitReached && (role === 'admin' || role === 'member');

  if (!token) {
    return <Login onLogin={login} error={error} />;
  }

  return (
    <div className="app-container">
      <h2>Notes ({tenant})</h2>
      <NoteForm title={title} setTitle={setTitle} content={content} setContent={setContent} onCreate={createNote} disabled={limitReached} />
      {showUpgradeBanner && <UpgradeBanner limitReached={limitReached} role={role} onUpgrade={upgrade} />}
      <NotesList notes={notes} onDelete={deleteNote} onEdit={editNote} />
      {error && <div className="error">{error}</div>}
      <button className="logout-btn" onClick={() => setToken('')}>Logout</button>
    </div>
  );
}

export default App;
