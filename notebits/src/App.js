import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useNotes } from './hooks/useNotes';
import useUIVisibility from './hooks/useUIVisibility'; // Make sure this import is correct
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import './App.css';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useUIVisibility();
  const { notes, tags, fetchNotes, createNote, updateNote, deleteNote } = useNotes();
  const [selectedTag, setSelectedTag] = useState(null);

  // Add this useEffect to fetch notes and tags when the component mounts
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated, fetchNotes]);

  // Extract unique tags from all notes
  const uniqueTags = React.useMemo(() => {
    const tagSet = new Set();
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [notes]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  const filteredNotes = selectedTag
    ? notes.filter(note => note.tags.includes(selectedTag))
    : notes;

  return (
    <div className={`App ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {isAuthenticated && (
        <>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? '×' : '☰'}
          </button>
          <Sidebar
            tags={uniqueTags}
            onLogout={logout}
            onCreateNote={() => {
              const newNote = { title: 'New Note', content: '', tags: [] };
              createNote(newNote);
              closeSidebar();
            }}
            isOpen={isSidebarOpen}
            onTagClick={handleTagClick}
            selectedTag={selectedTag}
          />
        </>
      )}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard
                  notes={filteredNotes}
                  tags={uniqueTags}
                  onCreateNote={createNote}
                  onUpdateNote={updateNote}
                  onDeleteNote={deleteNote}
                  fetchNotes={fetchNotes}
                  selectedTag={selectedTag}
                  onClearFilter={() => setSelectedTag(null)}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;