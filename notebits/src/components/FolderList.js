import React, { useState } from 'react';
import './FolderList.css';

function FolderList({ folders, onMoveToFolder, onCreateFolder, parentId = null }) {
  const nestedFolders = folders.filter(folder => folder.parentId === parentId);

  return (
    <ul className="folder-list">
      {nestedFolders.map(folder => (
        <FolderItem 
          key={folder.id} 
          folder={folder} 
          folders={folders}
          onMoveToFolder={onMoveToFolder}
          onCreateFolder={onCreateFolder}
        />
      ))}
    </ul>
  );
}

function FolderItem({ folder, folders, onMoveToFolder, onCreateFolder }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    onMoveToFolder(data.id, data.type, folder.id);
  };

  return (
    <li 
      className="folder-item"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="folder-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{isOpen ? '▼' : '▶'}</span> {folder.name}
      </div>
      {isOpen && (
        <FolderList 
          folders={folders}
          onMoveToFolder={onMoveToFolder}
          onCreateFolder={(name) => onCreateFolder(name, folder.id)}
          parentId={folder.id}
        />
      )}
    </li>
  );
}

export default FolderList;
