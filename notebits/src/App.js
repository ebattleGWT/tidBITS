import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import authService from './services/authService';
import noteService from './services/noteService';
import tagService from './services/tagService';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tags, setTags] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleCreateNote = useCallback(() => {
    const newNote = {
      title: 'New Note',
      content: '',
      tags: []
    };
    setCurrentNote(newNote);
    setIsModalOpen(true);
    closeSidebar();
  }, [closeSidebar]);

  const handleSaveNote = async (updatedNote) => {
    try {
      if (updatedNote.id) {
        // Update existing note
        const response = await noteService.updateNote(updatedNote);
        setNotes(prevNotes => prevNotes.map(note => note.id === updatedNote.id ? response.data : note));
      } else {
        // Create new note
        const response = await noteService.createNote(updatedNote);
        setNotes(prevNotes => [response.data, ...prevNotes]);
      }
      setIsModalOpen(false);
      setCurrentNote(null);
      loadTags();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleUpdateNote = async (updatedNote) => {
    try {
      const response = await noteService.updateNote(updatedNote);
      setNotes(prevNotes => prevNotes.map(note => note.id === updatedNote.id ? response.data : note));
      
      // Update tags
      const updatedTags = new Set([...tags, ...updatedNote.tags]);
      setTags(Array.from(updatedTags));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const success = await noteService.deleteNote(id);
      if (success) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        loadTags();
      } else {
        console.error('Failed to delete note. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleAddTag = (newTag) => {
    setTags(prevTags => {
      if (!prevTags.includes(newTag)) {
        return [...prevTags, newTag];
      }
      return prevTags;
    });
  };

  const handleRenameTag = (oldTag, newTag) => {
    setTags(prevTags => prevTags.map(tag => tag === oldTag ? newTag : tag));
    setNotes(prevNotes => prevNotes.map(note => ({
      ...note,
      tags: note.tags.map(tag => tag === oldTag ? newTag : tag)
    })));
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(prevTags => prevTags.filter(tag => tag !== tagToDelete));
    setNotes(prevNotes => prevNotes.map(note => ({
      ...note,
      tags: note.tags.filter(tag => tag !== tagToDelete)
    })));
  };

  const handleChangeTagColor = (tag, newColor) => {
    // Implement tag color change logic here
    // This might require adding a new state to track tag colors
  };

  const handleReorderNotes = (newNotes) => {
    setNotes(newNotes);
    // You might want to save this new order to your backend here
  };

  const loadTags = useCallback(async () => {
    try {
      console.log("Fetching tags...");
      const fetchedTags = await tagService.fetchTags();
      console.log("Fetched tags:", fetchedTags);
      if (Array.isArray(fetchedTags) && fetchedTags.length > 0) {
        setTags(fetchedTags);
      } else {
        console.warn("Fetched tags is empty or not an array:", fetchedTags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      setTags([]);
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, []); // Run once on component mount

  useEffect(() => {
    console.log("Tags in App state updated:", tags);
  }, [tags]);

  const loadNotes = useCallback(async () => {
    try {
      const response = await noteService.fetchNotes();
      setNotes(response.data || []);
      
      // Extract unique tags from notes
      const tagsFromNotes = [...new Set(response.data.flatMap(note => note.tags))];
      setTags(prevTags => [...new Set([...prevTags, ...tagsFromNotes])]);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, []);

  useEffect(() => {
    console.log("Tags in App state:", tags);
    const fetchData = async () => {
      if (isAuthenticated) {
        await loadNotes();
        await loadTags();
      }
    };
    fetchData();
  }, [isAuthenticated, loadNotes, loadTags]);

  const handleLogin = async (username, password) => {
    try {
      await authService.login(username, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Router>
      <div className={`App ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {isAuthenticated && (
          <>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              ☰
            </button>
            <Sidebar
              tags={tags}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              onRenameTag={handleRenameTag}
              onDeleteTag={handleDeleteTag}
              onChangeTagColor={handleChangeTagColor}
              isOpen={isSidebarOpen}
              onToggle={toggleSidebar}
              onLogout={handleLogout}
              onCreateNote={handleCreateNote}
              onClose={closeSidebar}
            />
          </>
        )}
        <div className="main-container">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? 
                <Dashboard 
                  notes={notes} 
                  selectedTag={selectedTag} 
                  onCreateNote={handleCreateNote} 
                  onUpdateNote={handleUpdateNote} 
                  onDeleteNote={handleDeleteNote}
                  tags={tags}
                  onAddTag={handleAddTag}
                  onReorderNotes={handleReorderNotes}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  currentNote={currentNote}
                  setCurrentNote={setCurrentNote}
                  onSaveNote={handleSaveNote}
                /> : <Navigate to="/login" />} 
              />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;