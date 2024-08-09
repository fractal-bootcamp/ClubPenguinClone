import React, { useState, useEffect } from "react";
import "./Room.css";

//API
import {
  getRoomData,
  getPosition,
  updatePosition,
  initializePlayer,
} from "../../API endpoints/positionService";

//Character and sprites
import Character from "./Character";
import bodySprite from "../../src/assets/isometric-hero/clothes.png";
import headSprite from "../../src/assets/isometric-hero/male_head1.png";
import weaponSprite from "../../src/assets/isometric-hero/shortsword.png";
import { useInterval } from "../hooks/useInterval";

interface Position {
  x: number;
  y: number;
}

const areCoordinatesEqual = (pos1: Position, pos2: Position): boolean => {
  console.log(pos1.x, pos2);
  return (
    Math.round(pos1.x) === Math.round(pos2.x) &&
    Math.round(pos1.y) === Math.round(pos2.y)
  );
};

const Room = () => {
  //Room
  const [room, setRoom] = useState<Position[] | void>([]);

  //Handling movement
  const [position, setPosition] = useState<Position>({ x: 528, y: 630 });

  const [canMove, setCanMove] = useState<boolean>(false); // New state to track if user can move
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isMovingFromBackend, setIsMovingFromBackend] =
    useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Character's movement animation
  const [direction, setDirection] = useState<number>(0);

  const [frame, setFrame] = useState<number>(0);
  const [animationInterval, setAnimationInterval] =
    useState<NodeJS.Timeout | null>(null);

  //Character's characteristics
  const [body, setBody] = useState(bodySprite);
  const [head, setHead] = useState(headSprite);
  const [weapon, setWeapon] = useState(weaponSprite);

  //hard-coded penguinId
  const penguinId = "a37deb36-58a2-4cea-8a4b-e2ebc024f1b5";

  const fetchRoom = async () => {
    try {
      await initializePlayer(); // Initialize player in backend
      const roomData = await getRoomData(); // Fetch room data from backend
      setRoom(roomData); // Set room data
    } catch (error) {
      console.error("Error initializing room:", error);
    }
  };

  // Function to fetch player Position
  const fetchPosition = async () => {
    try {
      const response = await getPosition(penguinId);
      console.log("bruno response", response);
      const { x, y, isMoving } = response;
      const positionData = { x, y };
      setIsMovingFromBackend(isMoving);

      console.log("inFetch1", isMoving);

      setPosition((prevPosition) => {
        console.log("inFetch", isMoving);
        if (isMoving && areCoordinatesEqual(positionData, prevPosition)) {
          setIsMoving(false);
        }

        if (!isMoving && !areCoordinatesEqual(positionData, prevPosition)) {
          setIsMoving(true);
        }

        return positionData;
      });
    } catch (error) {
      console.error("Error fetching Position:", error);
    }
  };

  // Fetch room on component mount
  useEffect(() => {
    fetchRoom();
  }, []);

  useInterval(fetchPosition, 1);

  const clickIsAvatarArea = (
    Position1: Position,
    Position2: Position,
    radius: number
  ) => {
    const distance = Math.sqrt(
      (Position1.x - Position2.x) ** 2 + (Position1.y - Position2.y) ** 2
    );
    return distance <= radius;
  };

  const defaultFrame = 10;

  const handleCanvasClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);
    const newClickedPos = { x, y };

    if (clickIsAvatarArea(newClickedPos, position, 100)) {
      setCanMove(true);
      console.log("Penguin selected. You can now move.");
      // Additional logic to handle penguin direction and animation
    } else if (canMove) {
      setCanMove(false);
      // setIsAnimating(true);
      updatePosition(penguinId, newClickedPos); // Assume updatePosition triggers a re-render
    } else {
      console.log("You must click the penguin first!");
    }
  };

  const animationFrames = [
    1664, 1536, 1408, 1280, 1152, 1024, 896, 768, 640, 512, 384, 256, 128, 0,
  ];

  useEffect(() => {
    if (isMovingFromBackend) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isMovingFromBackend]);

  // const animationFrames = [
  //   0, 128, 256, 384, 512, 640, 768, 896, 1024, 1152, 1280, 1408, 1536, 1664,
  // ];

  //Animate the character when it moves
  useEffect(() => {
    if (isAnimating) {
      const animationDuration = 1000; // 1 second, adjust as needed
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log("Can it move?", canMove);
    if (canMove) {
      const rect = event.currentTarget.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Calculate angle between character and mouse
      const dx = mouseX - position.x;
      const dy = mouseY - position.y;
      let angle = Math.atan2(dy, dx);

      // Convert angle to degrees and ensure it's positive
      angle = ((angle * 180) / Math.PI + 360) % 360;

      // Map angle to 8 directions
      const newDirection = Math.floor(((angle + 22.5) % 360) / 45);

      setDirection((prevDirection) => {
        if (prevDirection !== newDirection) {
          return newDirection;
        }
        return prevDirection;
      });
    }
  };

  // useEffect(() => {
  //   console.log("Direction changed to:", direction);
  // }, [direction]);
  // useEffect(() => {
  //   if (animationInterval) {
  //     clearInterval(animationInterval);
  //   }

  //   if (isMoving && direction !== undefined) {
  //     const interval = setInterval(() => {
  //       setFrame((prevFrame) => (prevFrame + 1) % 13);
  //     }, 130);

  //     setAnimationInterval(interval);

  //     return () => clearInterval(interval);
  //   }
  // }, [direction]);

  // const pairedSequence = [
  //   { index: 0, value: 0 },
  //   { index: 1, value: 128 },
  //   { index: 2, value: 256 },
  //   { index: 3, value: 384 },
  //   { index: 4, value: 512 },
  //   { index: 5, value: 640 },
  //   { index: 6, value: 768 },
  //   { index: 7, value: 896 },
  //   { index: 8, value: 1024 },
  //   { index: 9, value: 1152 },
  //   { index: 10, value: 1280 },
  //   { index: 11, value: 1408 },
  //   { index: 12, value: 1536 },
  //   { index: 13, value: 1664 },
  // ];

  // useEffect(() => {
  //   if (animationInterval) {
  //     clearInterval(animationInterval);
  //   }

  //   if (direction !== undefined) {
  //     // Start animating when direction changes
  //     const interval = setInterval(() => {
  //       setFrame((prevFrame) => (prevFrame + 1) % pairedSequence.length);
  //     }, 500); // Adjust frame rate as needed

  //     setAnimationInterval(interval);

  //     // Cleanup function to clear the interval
  //     return () => clearInterval(interval);
  //   }
  // }, [direction]); // Dependency array includes direction

  return (
    <>
      <div
        className="canvas"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        style={{ width: "1920px", height: "1080px", position: "relative" }}
      >
        {position && (
          <>
            <Character
              x={position.x}
              y={position.y}
              direction={direction}
              frame={frame}
              body={body}
              head={head}
              weapon={weapon}
              isAnimating={isAnimating}
              animationFrames={animationFrames}
            />
          </>
        )}
      </div>
      <div>
        {position && (
          <div>
            <p>
              Current Position: x={position.x}, y={position.y}
            </p>
            <p> Current Direction: {direction} </p>
          </div>
        )}
        <p>
          {canMove
            ? "You can now click anywhere to move."
            : "Click near the current Position to enable movement."}
        </p>
      </div>
    </>
  );
};

export default Room;
