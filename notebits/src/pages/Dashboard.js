import React, { useEffect, useState, useCallback } from 'react';
import NoteList from '../components/NoteList';
import NoteModal from '../components/NoteModal';
import './Dashboard.css';

function Dashboard({ notes, selectedTag, onCreateNote, onUpdateNote, onDeleteNote, tags, onAddTag, onReorderNotes, isModalOpen, setIsModalOpen, currentNote, setCurrentNote, onSaveNote }) {
  const [filteredNotes, setFilteredNotes] = useState([]);
  
  const filterNotes = useCallback(() => {
    const filtered = selectedTag
      ? notes.filter(note => note.tags.includes(selectedTag))
      : notes;
    setFilteredNotes(filtered);
  }, [notes, selectedTag]);

  useEffect(() => {
    filterNotes();
  }, [filterNotes]);

  const handleNoteClick = (note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentNote(null);
    setIsModalOpen(false);
  };

  const handleSaveNote = (updatedNote) => {
    onSaveNote(updatedNote);
    handleCloseModal();
  };

  return (
    <div className="dashboard">
      <div className="main-content">
        <NoteList 
          notes={filteredNotes}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
          onNoteClick={handleNoteClick}
          onReorderNotes={onReorderNotes}
        />
      </div>
      {isModalOpen && (
        <NoteModal
          note={currentNote}
          onClose={handleCloseModal}
          onSave={handleSaveNote}
          onDelete={onDeleteNote}
          tags={tags}
          onAddTag={onAddTag}
        />
      )}
    </div>
  );
}

export default Dashboard;