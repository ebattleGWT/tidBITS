import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteModal from './NoteModal';

function TopBar({ onLogout, onCreateNote, onAddNote }) {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: [] });

  const handleCreateNote = async (note) => {
    try {
      const createdNote = await onCreateNote(note);
      setNewNote({ title: '', content: '', tags: [] });
      setIsCreating(false);
      onAddNote(createdNote); // Call handleAddNote to update the Dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating new note:', error);
    }
  };

  return (
    <div className="top-bar">
      <button onClick={() => setIsCreating(true)}>New Note</button>
      <button onClick={onLogout}>Logout</button>

      {isCreating && (
        <NoteModal
          note={newNote}
          onClose={() => setIsCreating(false)}
          onUpdate={handleCreateNote}
          onDelete={() => setIsCreating(false)} // No delete action needed for new note
        />
      )}
    </div>
  );
}

export default TopBar;