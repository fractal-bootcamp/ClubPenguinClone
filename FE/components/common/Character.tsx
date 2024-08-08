import React, { useState, useEffect } from "react";
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

  animationFrames: number[];
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

  animationFrames,
}) => {
  //   const backgroundPosition = ` ${getSpritePosition(position)}`;

  const spriteSize = 128;

  // Define the direction to pixel mapping
  const directionMap: { [key: number]: string } = {
    0: "0px -512px", // East (facing right)
    1: "0px -640px", // South-East
    2: "0px -768px", // South
    3: "0px -896px", // South-West
    4: "0px -0px", // West (facing left)
    5: "0px -128px", // North-West
    6: "0px -256px", // North
    7: "0px -384px", // North-East
  };

  // Function to get the pixel value based on direction index
  const getSpriteDirection = (direction: number) => {
    return directionMap[direction] || "0px 0px"; // Default value if direction is invalid
  };

  //   const getSpriteDirection = (direction: number) => {
  //     switch (direction) {
  //       case 0:
  //         return "0px -512px"; // East (facing right)
  //       case 1:
  //         return "0px -640px"; // South-East
  //       case 2:
  //         return "0px -768px"; // South
  //       case 3:
  //         return "0px -896px"; // South-West
  //       case 4:
  //         return "0px -0px"; // West (facing left)
  //       case 5:
  //         return "0px -128px"; // North-West
  //       case 6:
  //         return "0px -256px"; // North
  //       case 7:
  //         return "0px -384px"; // North-East
  //     }
  //   };

  //   const frameSequence = [
  //     0, 128, 256, 384, 512, 640, 768, 896, 1024, 1152, 1280, 1408, 1536, 1664,
  //   ];

  //   const pairedSequence = [
  //     { index: 0, value: 0 },
  //     { index: 1, value: 128 },
  //     { index: 2, value: 256 },
  //     { index: 3, value: 384 },
  //     { index: 4, value: 512 },
  //     { index: 5, value: 640 },
  //     { index: 6, value: 768 },
  //     { index: 7, value: 896 },
  //     { index: 8, value: 1024 },
  //     { index: 9, value: 1152 },
  //     { index: 10, value: 1280 },
  //     { index: 11, value: 1408 },
  //     { index: 12, value: 1536 },
  //     { index: 13, value: 1664 },
  //   ];

  const position: Position = { x, y };

  //     const row = direction; // direction corresponds to the row
  //     const col = frameSequence[frame % frameSequence.length]; // frame sequence column position

  //     return `-${col}px -${row * spriteSize}px`;
  //   };

  //   const spriteStyle = {
  //     backgroundImage: `url(${bodySprite})`,
  //     backgroundPosition: getSpritePosition(direction, frame),
  //     width: `${spriteSize}px`,
  //     height: `${spriteSize}px`,
  //     backgroundSize: `${spriteSize * 15}px ${spriteSize * 8}px`, // Assuming 15 columns and 8 rows
  //   };

  // Function to get the pixel value based on animation frames
  const getSpriteFrame = (direction: number, animationFrames: number[]) => {
    const col = animationFrames[0]; // Only using the first frame of the sequence
    return `-${col}px -${direction * spriteSize}px`;
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
            position: "absolute",
            width: `${spriteSize}px`,
            height: `${spriteSize}px`,
            backgroundImage: `url(${body})`,
            backgroundPosition: getSpriteDirection(direction),
            spriteFrame: getSpriteFrame(direction, animationFrames),
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
            backgroundPosition: getSpriteDirection(direction),
            spriteFrame: getSpriteFrame(direction, animationFrames),
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
            backgroundPosition: getSpriteDirection(direction),
            spriteFrame: getSpriteFrame(direction, animationFrames),
          }}
        />
      </div>
      <CharacterMarker position={position} onClick={onMarkerClick} />
    </>
  );
};

export default Character;
