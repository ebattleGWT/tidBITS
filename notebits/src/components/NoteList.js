import React from 'react';
import NoteMenu from './NoteMenu';
import DraggableList from './DraggableList';
import './NoteList.css';

function NoteList({ notes, onUpdateNote, onDeleteNote, onNoteClick, onReorderNotes }) {
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const renderNote = (note) => (
    <div className="note-item">
      <div className="note-header">
        <h3>{truncateText(note.title, 30)}</h3>
        <NoteMenu 
          onEdit={() => onNoteClick(note)}
          onDelete={() => onDeleteNote(note.id)}
          onMove={() => {/* Implement move functionality */}}
        />
      </div>
      <p className="note-content" onClick={() => onNoteClick(note)}>{truncateText(note.content, 100)}</p>
      <div className="note-tags">
        {note.tags.map(tag => (
          <span key={tag} className="note-tag">{tag}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="note-list">
      <DraggableList
        items={notes}
        renderItem={renderNote}
        onReorder={onReorderNotes}
      />
    </div>
  );
}

export default NoteList;