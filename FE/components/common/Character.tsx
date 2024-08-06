import React, { useState } from "react";
import CharacterMarker from "./CharacterMarker";

interface CharacterProps {
  x: number;
  y: number;
  direction: number;
  frame: number;
  body: string;
  head: string;
  weapon: string;
  onMarkerClick: (position: Position) => void; // Add prop for click handler
}

interface Position {
  x: number;
  y: number;
}

const Character: React.FC<CharacterProps> = ({
  x,
  y,
  direction,
  frame,
  body,
  head,
  weapon,

  onMarkerClick,
}) => {
  const spriteSize = 128;

  const position: Position = { x, y };

  const getSpritePosition = (index: number) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    return `-${col * spriteSize}px -${row * spriteSize}px`;
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            width: `${spriteSize}px`,
            height: `${spriteSize}px`,
            backgroundImage: `url(${body})`,
            backgroundPosition: getSpritePosition(direction * 8 + frame),
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${spriteSize}px`,
            height: `${spriteSize}px`,
            backgroundImage: `url(${head})`,
            backgroundPosition: getSpritePosition(direction * 8 + frame),
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${spriteSize}px`,
            height: `${spriteSize}px`,
            backgroundImage: `url(${weapon})`,
            backgroundPosition: getSpritePosition(direction * 8 + frame),
          }}
        />
      </div>
      <CharacterMarker position={position} onClick={onMarkerClick} />
    </>
  );
};

export default Character;
