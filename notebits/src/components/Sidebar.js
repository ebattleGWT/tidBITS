import React, { useEffect } from 'react';
import './Sidebar.css';

function Sidebar({ tags, onLogout, onCreateNote, isOpen, onClose }) {
  useEffect(() => {
    console.log('Sidebar isOpen:', isOpen);
  }, [isOpen]);

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2>Tags</h2>
        <ul className="tag-list">
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <li key={index} className="sidebar-tag">{tag}</li>
            ))
          ) : (
            <li>No tags available</li>
          )}
        </ul>
        <div className="sidebar-footer">
          <button onClick={onCreateNote}>Create New Note</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;