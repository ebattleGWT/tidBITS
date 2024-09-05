import React, { useCallback, useState, useMemo } from 'react';
import NoteList from '../components/NoteList';
import NoteModal from '../components/NoteModal';
import './Dashboard.css';
import Sidebar from '../components/Sidebar';
import useUIVisibility from '../hooks/useUIVisibility';

function Dashboard({ 
  notes, 
  selectedTag, 
  onCreateNote, 
  onUpdateNote, 
  onDeleteNote, 
  tags, 
  onAddTag, 
  onReorderNotes, 
  isModalOpen, 
  setIsModalOpen, 
  currentNote, 
  setCurrentNote, 
  onSaveNote,
  setSelectedTag,
  onRenameTag,
  onDeleteTag,
  onChangeTagColor,
  onLogout
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const { isSearchVisible, isSidebarOpen, handleScroll } = useUIVisibility();

  const filteredNotes = useMemo(() => {
    return notes.filter(note => 
      (selectedTag ? note.tags.includes(selectedTag) : true) &&
      (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [notes, selectedTag, searchQuery]);

  const handleNoteClick = useCallback((note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  }, [setCurrentNote, setIsModalOpen]);

  const handleCloseModal = useCallback(() => {
    setCurrentNote(null);
    setIsModalOpen(false);
  }, [setCurrentNote, setIsModalOpen]);

  const handleSaveNote = useCallback((updatedNote) => {
    onSaveNote(updatedNote);
    handleCloseModal();
  }, [onSaveNote, handleCloseModal]);

  const handleScrollWrapper = useCallback((e) => {
    handleScroll(e.target.scrollTop);
  }, [handleScroll]);

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
      <div className="notes-container" onScroll={handleScrollWrapper}>
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
      <Sidebar
        isOpen={isSidebarOpen}
        tags={tags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        onRenameTag={onRenameTag}
        onDeleteTag={onDeleteTag}
        onChangeTagColor={onChangeTagColor}
        onLogout={onLogout}
        onCreateNote={onCreateNote}
      />
    </div>
  );
}

export default Dashboard;