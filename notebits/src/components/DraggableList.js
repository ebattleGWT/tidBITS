import React, { useState } from 'react';

function DraggableList({ items, renderItem, onReorder }) {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedItem(items[index]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = items[index];

    if (draggedItem === draggedOverItem) {
      return;
    }

    let newItems = items.filter(item => item !== draggedItem);
    newItems.splice(index, 0, draggedItem);

    if (onReorder) {
      onReorder(newItems);
    }
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  return (
    <>
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        >
          {renderItem(item)}
        </div>
      ))}
    </>
  );
}

export default DraggableList;
