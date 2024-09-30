import React from 'react';
import NoteMenu from './NoteMenu';
import './NoteList.css';
import DOMPurify from 'dompurify';

function NoteList({ notes, onUpdateNote, onDeleteNote, onNoteClick }) {
  const truncateHTML = (html, maxLength) => {
    const strippedString = html.replace(/(<([^>]+)>)/gi, "");
    return strippedString.length > maxLength ? strippedString.substr(0, maxLength - 1) + '&hellip;' : strippedString;
  };

  const renderNote = (note) => (
    <div key={note.id} className="note-item">
      <div className="note-header">
        <h3>{truncateHTML(note.title, 30)}</h3>
        <NoteMenu 
          onEdit={() => onNoteClick(note)}
          onDelete={() => onDeleteNote(note.id)}
        />
      </div>
      <div 
        className="note-content" 
        onClick={() => onNoteClick(note)}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateHTML(note.content, 100)) }}
      />
      <div className="note-tags">
        {note.tags && note.tags.map(tag => (
          <span key={tag} className="note-tag">{tag}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="note-list">
      {notes && notes.length > 0 ? notes.map(renderNote) : <p>No notes found.</p>}
    </div>
  );
}

export default NoteList;