import React, { useState, useEffect } from "react";
import "./Garden.css";

//API
import {
  getRoomData,
  getPosition,
  updatePosition,
  initializePlayer,
  //   getWallData,
} from "../../API endpoints/positionService";

//Character and sprites
import Character from "../common/Character";
import bodySprite from "../../src/assets/isometric-hero/clothes.png";
import headSprite from "../../src/assets/isometric-hero/male_head1.png";
import weaponSprite from "../../src/assets/isometric-hero/shortsword.png";

interface Coordinate {
  x: number;
  y: number;
}

interface Wall {
  id: string;
  coordinates: Coordinate[];
}

interface Position {
  x: number;
  y: number;
}

interface RoomProps {
  width: string;
  height: string;
  backgroundColor?: string;
  borderRadius?: string;
  //   backgroundImage?: string;
  children?: React.ReactNode;
}

const Room: React.FC<RoomProps> = ({
  width,
  height,
  backgroundColor = "white",
  borderRadius = "0px",
  children,
}) => {
  //Room and Walls
  const [room, setRoom] = useState<Position[] | void>([]);
  const [walls, setWalls] = useState<Position[]>([]); // State to store walls

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

  //hard-coded penguinId
  const penguinId = "cd5f144b-af4d-46cf-8506-29cfb25aea9e";

  const fetchRoom = async () => {
    try {
      await initializePlayer(); // Initialize player in backend
      const roomData = await getRoomData(); // Fetch room data from backend
      setRoom(roomData); // Set room data
      //   const wallData = await getWallData(); // Fetch wall data
      //   console.log("wallData", wallData);
      //   setWalls(wallData);
    } catch (error) {
      console.error("Error initializing room:", error);
    }
  };

  // Function to fetch player Position
  const fetchPosition = async () => {
    try {
      const positionData = await getPosition(penguinId);
      setPosition(positionData);
    } catch (error) {
      console.error("Error fetching Position:", error);
    }
  };

  // Fetch room on component mount
  useEffect(() => {
    fetchRoom();
    fetchPosition();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPosition();
    }, 100);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let animationFrame: number;

    const updateFrame = () => {
      if (isMoving) {
        setFrame((prevFrame) => (prevFrame + 1) % 8);
      }
      animationFrame = requestAnimationFrame(updateFrame);
    };

    animationFrame = requestAnimationFrame(updateFrame);

    return () => cancelAnimationFrame(animationFrame);
  }, [isMoving]);

  useEffect(() => {
    let prevPosition = position;
    const checkMovement = () => {
      const dx = position.x - prevPosition.x;
      const dy = position.y - prevPosition.y;

      if (dx !== 0 || dy !== 0) {
        setIsMoving(true);

        // Update direction based on movement
        if (Math.abs(dx) > Math.abs(dy)) {
          setDirection(dx > 0 ? 3 : 1); // Right or Left
        } else {
          setDirection(dy > 0 ? 2 : 0); // Down or Up
        }
      } else {
        setIsMoving(false);
      }

      prevPosition = position;
    };

    const intervalId = setInterval(checkMovement, 100);

    return () => clearInterval(intervalId);
  }, [position]);

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

  // Simple point-in-polygon function
  const pointInPolygon = (
    x: number,
    y: number,
    polygon: Position[]
  ): boolean => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const handleCanvasClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);
    const clickedPos = { x, y };

    if (clickIsAvatarArea(clickedPos, position, 50)) {
      // User clicked within X px of the current Position
      setCanMove(true);
      setIsMoving(false);

      console.log("Penguin selected. You can now move.");
    } else if (canMove && clickedPos) {
      setIsMoving(true);
      setCanMove(false);
      updatePosition(penguinId, clickedPos);
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

  return (
    <>
      <div
        className="canvas"
        onClick={handleCanvasClick}
        style={{
          width,
          height,
          backgroundColor,
          borderRadius,
        }}
      >
        {position && (
          <>
            <Character
              x={position.x}
              y={position.y}
              direction={direction}
              frame={isMoving ? frame : 0}
              isMoving={isMoving}
              body={body}
              head={head}
              weapon={weaponSprite}
              onMarkerClick={handleMarkerClick}
            />
          </>
        )}
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
