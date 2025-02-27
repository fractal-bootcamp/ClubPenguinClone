import React, { useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface CharacterMarkerProps {
  position: Position;
}

const CharacterMarker: React.FC<CharacterMarkerProps> = ({ position }) => {
  const [isClicked, setIsClicked] = useState(false);

  // Handle click and trigger animation
  const handleClick = () => {
    console.log("Marker clicked!");
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 80); // Reset the animation state
  };

  return (
    <div
      className="character-marker-container" // Container for positioning and centering
      style={{
        position: "absolute",
        left: `${position.x - (isClicked ? -25 : -25)}px`,
        top: `${position.y - (isClicked ? 23 : 25) + 105}px`,
        width: `${isClicked ? 75 : 75}px`,
        height: `${isClicked ? 30 : 30}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000, // Ensure the marker appears above other elements
      }}
    >
      <div
        className="character-marker"
        onClick={handleClick}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: `7px solid ${isClicked ? "darkgrey" : "rgba(255, 255, 255, 0.25)"}`,
          backgroundColor: "transparent",
          transition: "all 0.2s ease-in-out", // Smooth transition for size and color changes
        }}
      />
      {isClicked && (
        <div
          className="small-red-circle"
          style={{
            position: "absolute", // Absolute positioning within the marker
            width: "12px", // Diameter of 6px for a radius of 3px
            height: "3px",
            borderRadius: "50%",
            border: `2px solid ${isClicked ? "darkgrey" : "rgba(255, 255, 255, 0.25)"}`,
            backgroundColor: "transparent",
            transition: "all 0.2s ease-in-out", // Smooth transition for size and color changes
            top: "50%", // Center vertically
            left: "50%", // Center horizontally
            transform: "translate(-50%, -50%)", // Center by adjusting with half of the circle's size
          }}
        />
      )}
    </div>
  );
};

export default CharacterMarker;
