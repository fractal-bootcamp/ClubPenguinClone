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

interface Position {
  x: number;
  y: number;
}

const Room = () => {
  //Room
  const [room, setRoom] = useState<Position[] | void>([]);

  //Handling movement
  const [position, setPosition] = useState<Position>({ x: 528, y: 630 });
  const [newPosition, setNewPosition] = useState<Position | null>(null);
  const [lastValidPosition, setLastValidPosition] = useState<Position | null>(
    null
  );
  const [canMove, setCanMove] = useState<boolean>(false); // New state to track if user can move
  const [isMoving, setIsMoving] = useState<boolean>(false);

  // Character's movement animation
  const [direction, setDirection] = useState<number>(0);
  const [frame, setFrame] = useState<number>(0);

  //Character's characteristics
  const [body, setBody] = useState(bodySprite);
  const [head, setHead] = useState(headSprite);
  const [weapon, setWeapon] = useState(weaponSprite);

  const id = "string";

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
      const PositionData = await getPosition(id);
      setPosition(PositionData);
      setLastValidPosition(PositionData); // Initialize lastValidPosition
      console.log("lastValidPosition", lastValidPosition);
    } catch (error) {
      console.error("Error fetching Position:", error);
    }
  };

  useEffect(() => {
    fetchRoom();
    fetchPosition();
  }, []);

  const isWithinRadius = (
    Position1: Position,
    Position2: Position,
    radius: number
  ) => {
    const distance = Math.sqrt(
      (Position1.x - Position2.x) ** 2 + (Position1.y - Position2.y) ** 2
    );
    return distance <= radius;
  };

  const handleCanvasClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);
    const clickedPos = { x, y };

    if (isWithinRadius(clickedPos, position, 50)) {
      // User clicked within X px of the current Position
      setCanMove(true);
      setIsMoving(false);
      console.log("Penguin selected. You can now move.");
    } else if (canMove && !isMoving) {
      setIsMoving(true);
      setNewPosition(clickedPos);
      moveTowardsDestination(clickedPos);
    } else if (!canMove) {
      console.log("You must click the penguin first!");
    }
  };

  const handleMarkerClick = async (markerPosition: Position) => {
    if (isWithinRadius(markerPosition, position, 50)) {
      // User clicked within X px of the current Position
      setCanMove(true);
      setIsMoving(false);
      console.log("Marker selected. You can now move.");
    } else if (canMove && !isMoving) {
      setIsMoving(true);
      setNewPosition(markerPosition);
      moveTowardsDestination(markerPosition);
    } else if (!canMove) {
      console.log("You must click the marker first!");
    }
  };

  const moveTowardsDestination = async (destination: Position) => {
    while (position.x !== destination.x || position.y !== destination.y) {
      try {
        console.log("new Position towards", destination);
        const newPos = await updatePosition(id, destination);
        setPosition(newPos);
        setLastValidPosition(newPos);

        // Update direction
        const dx = destination.x - position.x;
        const dy = destination.y - position.y;
        let newDirection;
        if (Math.abs(dx) > Math.abs(dy)) {
          newDirection = dx > 0 ? 2 : 6; // East or West
        } else {
          newDirection = dy > 0 ? 4 : 0; // South or North
        }
        setDirection(newDirection);

        // Update frame
        setFrame((prevFrame) => (prevFrame + 1) % 8);

        if (newPos.x === destination.x && newPos.y === destination.y) {
          setCanMove(false);
          setIsMoving(false);
          setFrame(0); // Reset to standing frame
          console.log("Reached destination:", newPos);
          break;
        }

        // Add a small delay to visualize the movement
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error("Error updating Position:", error);
        setIsMoving(false);
        break;
      }
    }
  };

  return (
    <>
      <div
        className="canvas"
        onClick={handleCanvasClick}
        style={{ width: "2000px", height: "2000px", position: "relative" }}
      >
        {position && (
          <>
            <Character
              x={position.x}
              y={position.y}
              direction={direction}
              frame={isMoving ? frame : 0}
              body={body}
              head={head}
              weapon={weaponSprite}
              onMarkerClick={handleMarkerClick}
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
      {position && (
        <p>
          Current Position: x={position.x}, y={position.y}
        </p>
      )}
      <p>
        {canMove
          ? "You can now click anywhere to move."
          : "Click near the current Position to enable movement."}
      </p>
    </>
  );
};

export default Room;
