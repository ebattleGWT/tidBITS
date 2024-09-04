import React, { useState, useRef, useEffect } from 'react';
import './NoteMenu.css';

function NoteMenu({ onEdit, onDelete, onMove }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit();
    setIsOpen(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
    setIsOpen(false);
  };

  const handleMove = (e) => {
    e.stopPropagation();
    onMove();
    setIsOpen(false);
  };

  return (
    <div className="note-menu" ref={menuRef}>
      <button className="note-menu-button" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>⋮</button>
      {isOpen && (
        <div className="note-menu-dropdown">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleMove}>Move</button>
        </div>
      )}
    </div>
  );
}

export default NoteMenu;
