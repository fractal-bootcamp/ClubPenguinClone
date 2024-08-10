import React, { useState, useEffect } from "react";
import CharacterMarker from "./CharacterMarker";

interface CharacterProps {
  x: number;
  y: number;

  direction: number;
  frame: number;

  animationFrames: number[];

  body: string;
  head: string;
  primaryWeapon: string;
  secondaryWeapon: string;

  isAnimating: boolean;
  animationDuration: number;
}

interface Position {
  x: number;
  y: number;
}

const Character: React.FC<CharacterProps> = ({
  x,
  y,

  direction,
  animationFrames = [],

  body,
  head,
  primaryWeapon,
  secondaryWeapon,

  isAnimating,
  animationDuration,
}) => {
  //   const backgroundPosition = ` ${getSpritePosition(position)}`;
  const [animationCell, setAnimationCell] = useState<number>(
    animationFrames[0] ?? 0
  );

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
  const getSpriteFrame = (direction: number, animationCell: number) => {
    return `-${animationCell}px -${direction * spriteSize}px`;
  };

  useEffect(() => {
    if (isAnimating && animationFrames.length > 0) {
      const fps = 12;
      const frameInterval = 40 / fps;
      let frameIndex = 0;
      const animationInterval = setInterval(() => {
        setAnimationCell(animationFrames[frameIndex]);
        frameIndex = (frameIndex + 7) % animationFrames.length;
      }, frameInterval);

      return () => clearInterval(animationInterval);
    } else {
      setAnimationCell(animationFrames[0] ?? 0); // Reset to first frame when not animating, or 0 if undefined
    }
  }, [isAnimating, animationFrames, animationDuration]);

  //   useEffect(() => {
  //     if (isAnimating && animationFrames.length > 0) {
  //       let frameIndex = 0; // Start from the first frame
  //       const animationInterval = setInterval(() => {
  //         setAnimationCell(animationFrames[frameIndex]);
  //         frameIndex = (frameIndex + 1) % animationFrames.length;
  //       }, 80); // Adjust timing as needed

  //       return () => clearInterval(animationInterval);
  //     } else {
  //       setAnimationCell(animationFrames[0] ?? 0); // Reset to the first frame when not animating
  //     }
  //   }, [isAnimating, animationFrames]);

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
            backgroundPosition: isAnimating
              ? getSpriteFrame(direction + 4, animationCell)
              : getSpriteDirection(direction),
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
            backgroundPosition: isAnimating
              ? getSpriteFrame(direction + 4, animationCell)
              : getSpriteDirection(direction + 4),
          }}
        />
        <div
          style={{
            position: "absolute",

            top: 0,
            left: 0,
            width: `${spriteSize}px`,
            height: `${spriteSize}px`,
            backgroundImage: `url(${primaryWeapon})`,
            backgroundPosition: isAnimating
              ? getSpriteFrame(direction + 4, animationCell)
              : getSpriteDirection(direction),
          }}
        />
        <div
          style={{
            position: "absolute",

            top: 0,
            left: 0,
            width: `${spriteSize}px`,
            height: `${spriteSize}px`,
            backgroundImage: `url(${secondaryWeapon})`,
            backgroundPosition: isAnimating
              ? getSpriteFrame(direction + 4, animationCell)
              : getSpriteDirection(direction),
          }}
        />
      </div>
      <CharacterMarker position={position} />
    </>
  );
};

export default Character;
