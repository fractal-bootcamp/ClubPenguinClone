import React, { useState, useEffect } from "react";
import "./Room.css";
import {
  getRoomData,
  getPosition,
  updatePosition,
  initializePlayer,
} from "../../API endPositions/PositionService";

interface Position {
  x: number;
  y: number;
}

const Room = () => {
  const [Position, setPosition] = useState<Position>({ x: 618, y: 618 });
  const [newPosition, setNewPosition] = useState<Position | null>(null);
  const [room, setRoom] = useState<Position[] | void>([]);
  const [lastValidPosition, setLastValidPosition] = useState<Position | null>(
    null
  );
  const [canMove, setCanMove] = useState<boolean>(false); // New state to track if user can move
  const [isMoving, setIsMoving] = useState<boolean>(false);

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

    if (isWithinRadius(clickedPos, Position, 10)) {
      // User clicked within 5px of the current Position
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

  const moveTowardsDestination = async (destination: Position) => {
    while (Position.x !== destination.x || Position.y !== destination.y) {
      try {
        console.log("new Position towards", destination);
        const newPos = await updatePosition(id, destination);
        setPosition(newPos);
        setLastValidPosition(newPos);

        if (newPos.x === destination.x && newPos.y === destination.y) {
          setCanMove(false);
          setIsMoving(false);
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
        style={{ width: "1000px", height: "1000px", Position: "relative" }}
      >
        {Position && (
          <div
            className="Position-marker"
            style={{
              Position: "absolute",
              left: `${Position.x}px`,
              top: `${Position.y}px`,
              width: "10px",
              height: "10px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          />
        )}
      </div>
      {Position && (
        <p>
          Current Position: x={Position.x}, y={Position.y}
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
