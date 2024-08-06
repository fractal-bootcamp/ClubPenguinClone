import React, { useState, useEffect } from "react";
import "./Room.css";
import {
  getRoomData,
  getPosition,
  updatePosition,
  initializePlayer,
} from "../../API endpoints/positionService";

interface Point {
  x: number;
  y: number;
}

//For the future: Room will take as props the coordinates defined by the room's entry point

const Room = () => {
  //starting perfect point according to golden proportion
  const [position, setPosition] = useState<Point>({ x: 618, y: 618 });
  //new position
  const [newPosition, setNewPosition] = useState<Point | null>(null);
  const [room, setRoom] = useState<Point[] | void>([]);

  //hard-coded userId
  const userId = "string";

  const fetchRoom = async () => {
    try {
      await initializePlayer(); // Initialize player in backend
      const roomData = await getRoomData(); // Fetch room data from backend
      setRoom(roomData);
    } catch (error) {
      console.error("Error initializing room:", error);
    }
  };

  // Function to fetch player position
  const fetchPosition = async () => {
    try {
      const positionData = await getPosition(userId);
      setPosition(positionData);
    } catch (error) {
      console.error("Error fetching position:", error);
    }
  };

  // Fetch room on component mount
  useEffect(() => {
    fetchRoom();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPosition();
    }, 1500);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle canvas click event to update position
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);
    const newPos = { x, y };

    if (newPos) {
      updatePosition(userId, newPos);
    }

    console.log("Clicked coordinates", newPos);
  };
  return (
    <>
      <div
        className="canvas"
        onClick={handleCanvasClick}
        style={{ width: "1000px", height: "1000px", position: "relative" }}
      >
        {position && (
          <div
            className="position-marker"
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
        )}
      </div>
      {position && (
        <p>
          Clicked position: x={position.x}, y={position.y}
        </p>
      )}
    </>
  );
};

export default Room;
