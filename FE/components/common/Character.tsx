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
  weapon: string;

  isAnimating: boolean;
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
  weapon,

  isAnimating,
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
  const getSpriteFrame = (direction: number, animationCell: number) => {
    return `-${animationCell}px -${direction * spriteSize}px`;
  };

  useEffect(() => {
    if (isAnimating && animationFrames.length > 0) {
      let frameIndex = 7;
      const animationInterval = setInterval(() => {
        setAnimationCell(animationFrames[frameIndex]);
        frameIndex = (frameIndex - 1) % animationFrames.length;
      }, 80); // Adjust timing as needed

      return () => clearInterval(animationInterval);
    } else {
      setAnimationCell(animationFrames[0] ?? 0); // Reset to first frame when not animating, or 0 if undefined
    }
  }, [isAnimating, animationFrames]);

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
            backgroundImage: `url(${weapon})`,
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
