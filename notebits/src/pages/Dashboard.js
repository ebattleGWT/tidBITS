import React, { useEffect, useState, useCallback } from 'react';
import NoteList from '../components/NoteList';
import NoteModal from '../components/NoteModal';
import './Dashboard.css';

function Dashboard({ notes, selectedTag, onCreateNote, onUpdateNote, onDeleteNote, tags, onAddTag, onReorderNotes, isModalOpen, setIsModalOpen, currentNote, setCurrentNote, onSaveNote }) {
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const filterNotes = useCallback(() => {
    const filtered = notes.filter(note => 
      (selectedTag ? note.tags.includes(selectedTag) : true) &&
      (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredNotes(filtered);
  }, [notes, selectedTag, searchQuery]);

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

  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 50) {
      setIsSearchVisible(false);
    } else {
      setIsSearchVisible(true);
    }
    setLastScrollTop(scrollTop);
  }, [lastScrollTop]);

  return (
    <div className="dashboard">
      <div className={`search-container ${isSearchVisible ? 'visible' : ''}`}>
        <input 
          type="text" 
          placeholder="Search notes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="notes-container" onScroll={handleScroll}>
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