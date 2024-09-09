import React, { useState, useEffect } from 'react';
import NoteList from '../components/NoteList';
import NoteModal from '../components/NoteModal';
import './Dashboard.css';

function Dashboard({ notes, tags, onCreateNote, onUpdateNote, onDeleteNote, fetchNotes, selectedTag, onClearFilter }) {
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleNoteCreate = () => {
    const newNote = { title: '', content: '', tags: [] };
    setSelectedNote(newNote);
    setIsModalOpen(true);
  };

  const handleNoteSave = (updatedNote) => {
    if (updatedNote.id) {
      onUpdateNote(updatedNote);
    } else {
      onCreateNote(updatedNote);
    }
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleNoteDelete = (noteId) => {
    onDeleteNote(noteId);
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="dashboard">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {selectedTag && (
          <div className="selected-tag">
            Filtered by: {selectedTag}
            <button onClick={onClearFilter}>Clear</button>
          </div>
        )}
      </div>
      <div className="notes-container">
        <NoteList
          notes={filteredNotes}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
          onNoteClick={handleNoteClick}
        />
      </div>
      {isModalOpen && (
        <NoteModal
          note={selectedNote}
          onClose={handleModalClose}
          onSave={handleNoteSave}
          onDelete={handleNoteDelete}
          tags={tags}
        />
      )}
      <button className="create-note-button" onClick={handleNoteCreate}>+</button>
    </div>
  );
}

export default Dashboard;