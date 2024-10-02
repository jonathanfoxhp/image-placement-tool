import React, { useState, useEffect } from "react";

const DraggableImage = () => {
  // State to track image position and dragging status
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Mouse down event: Start dragging
  const handleMouseDown = (e) => {
    console.log("start dragging");
    setIsDragging(!isDragging);
    // Calculate the offset between the image and mouse cursor
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Mouse move event: Move the image
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Ensure dragging stops if cursor leaves the window
      style={{ height: "100vh", width: "100vw", position: "relative" }}
    >
      <img
        src="https://via.placeholder.com/150"
        alt="Draggable"
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          cursor: "grab",
          userSelect: "none",
        }}
      />
    </div>
  );
};

export default DraggableImage;
