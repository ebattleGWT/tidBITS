import React from 'react';
import NoteMenu from './NoteMenu';
import DOMPurify from 'dompurify';
import './NoteList.css';

function NoteList({ notes, onUpdateNote, onDeleteNote, onNoteClick }) {
  const truncateHTML = (html, maxLength) => {
    // Create a new div element
    const div = document.createElement('div');
    // Set its innerHTML to the sanitized HTML
    div.innerHTML = DOMPurify.sanitize(html);
    
    // Replace common block elements with line breaks and spacing
    let content = div.innerHTML
      .replace(/<\/?(p|div|h[1-6]|ul|ol|li|blockquote)[^>]*>/gi, '\n\n')
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/&nbsp;/g, ' ');
    
    // Remove all remaining HTML tags
    content = content.replace(/<[^>]+>/g, '');
    
    // Trim whitespace and collapse multiple line breaks
    content = content.trim().replace(/\n{3,}/g, '\n\n');
    
    // Truncate the content if it's longer than maxLength
    if (content.length > maxLength) {
      content = content.substr(0, maxLength).trim();
      // Ensure we don't cut off in the middle of a word
      content = content.substr(0, Math.min(content.length, content.lastIndexOf(' ')));
      content += '…';
    }
    
    return content;
  };

  const renderNote = (note) => (
    <div 
      key={note.id} 
      className="note-item"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'NOTE', id: note.id }))}
    >
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
      >
        {truncateHTML(note.content, 150)}
      </div>
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