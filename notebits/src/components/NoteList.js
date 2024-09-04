import React from 'react';
import NoteMenu from './NoteMenu';
import './NoteList.css';

function NoteList({ notes, onUpdateNote, onDeleteNote, onNoteClick, onReorderNotes }) {
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const renderNote = (note) => (
    <div key={note.id} className="note-item">
      <div className="note-header">
        <h3>{truncateText(note.title, 30)}</h3>
        <NoteMenu 
          onEdit={() => onNoteClick(note)}
          onDelete={() => onDeleteNote(note.id)}
        />
      </div>
      <div className="note-content" onClick={() => onNoteClick(note)}>
        <p>{truncateText(note.content, 100)}</p>
      </div>
      <div className="note-tags">
        {note.tags.map(tag => (
          <span key={tag} className="note-tag">{tag}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="note-list">
      {notes.map(renderNote)}
    </div>
  );
}

export default NoteList;