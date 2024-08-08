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

  const [lastValidPosition, setLastValidPosition] = useState<Position | null>(
    null
  );
  const [canMove, setCanMove] = useState<boolean>(false); // New state to track if user can move
  const [isMoving, setIsMoving] = useState<boolean>(false);

  // Character's movement animation
  const [direction, setDirection] = useState<number>(0);
  const [frame, setFrame] = useState<number>(0);
  const [animationInterval, setAnimationInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [animation, setAnimation] = useState<boolean>(false);

  //Character's characteristics
  const [body, setBody] = useState(bodySprite);
  const [head, setHead] = useState(headSprite);
  const [weapon, setWeapon] = useState(weaponSprite);

  //hard-coded penguinId
  const penguinId = "cd5f144b-af4d-46cf-8506-29cfb25aea9e";

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
      const positionData = await getPosition(penguinId);

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

  useInterval(fetchPosition, 500);

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
    const clickedPos = { x, y };

    if (clickIsAvatarArea(clickedPos, position, 100)) {
      // User clicked within X px of the current Position
      setCanMove(true);
      console.log("Penguin selected. You can now move.");

      //write a setDirection function that takes the sprite and renders it according to its direction. In the sprite, 128 x 128px,
      // each row is a different direction, and each column is a different frame of the animation.
      // The direction is a number from 0 to 7, and the frame is a number from 0 to 7. The function should return the background position for the sprite.
      // there are eight different positions, row 0 is facing west, row 1 is facing north-west, row 2 is facing north, row 3 is facing north-east,
      // row 4 is facing east, row 5 is facing south-east, row 6 is facing south, and row 7 is facing south-west.
      // The frame is the current frame of the animation, which is a number from 0 to 7. The function should return the background position for the sprite.

      //define that, when the penguin is clicked, by the position of the mouse with respect to the penguin, so that the penguin rotates with the
      //mouse movement, and when the penguin is clicked, the penguin moves to the position of the mouse click.

      //write a setDirection function that takes the sprite and renders it according to its direction.
    } else if (canMove && clickedPos) {
      setCanMove(false);

      setAnimation(true);

      updatePosition(penguinId, clickedPos);

      // setAnimation(false);
    } else if (!canMove) {
      console.log("You must click the penguin first!");
    }
  };

  const handleMarkerClick = async (markerPosition: Position) => {
    // if (clickIsAvatarArea(markerPosition, position, 50)) {
    //   // User clicked within X px of the current Position
    //   setCanMove(true);
    //   setIsMoving(false);
    //   console.log("Marker selected. You can now move.");
    // } else if (canMove && !isMoving) {
    //   setIsMoving(true);
    //   setNewPosition(markerPosition);
    //   moveTowardsDestination(markerPosition);
    // } else if (!canMove) {
    //   console.log("You must click the marker first!");
    // }
  };

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

  const frameSequence = [
    1664, 1536, 1408, 1280, 1152, 1024, 896, 768, 640, 512, 384, 256, 128, 0,
  ];

  useEffect(() => {
    if (animationInterval) {
      clearInterval(animationInterval);
    }

    if (animation) {
      const interval = setInterval(() => {
        setFrame((prevFrame) => (prevFrame + 1) % frameSequence.length);
      }, 130);

      setAnimationInterval(interval);

      return () => clearInterval(interval);
    }
  }, [animation]);
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
        style={{ width: "2000px", height: "2000px", position: "relative" }}
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
              weapon={weaponSprite}
              onMarkerClick={handleMarkerClick}
              animationFrames={frameSequence}
            />
          </>
        )}
        {/* {position && (
          <div
            className="Position-marker"
            style={{
              position: "absolute",
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: "10px",
              height: "10px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          />
        )} */}
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
