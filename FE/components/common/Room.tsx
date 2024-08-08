import React, { useState, useEffect, useRef, useCallback } from "react";
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

interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
}

const Room = () => {
  //connect to the server
  const ws = useRef<WebSocket | null>(null);

  //Room
  const [room, setRoom] = useState<Position[] | void>([]);

  //Handling movement
  const [position, setPosition] = useState<Position>({ x: 528, y: 630 });
  const [newPosition, setNewPosition] = useState<Position | null>(null);
  const [lastValidPosition, setLastValidPosition] = useState<Position | null>(
    null
  );
  const [canMove, setCanMove] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  // Character's movement animation
  const [direction, setDirection] = useState<number>(0);
  const [frame, setFrame] = useState<number>(0);

  //Character's characteristics
  const [body, setBody] = useState(bodySprite);
  const [head, setHead] = useState(headSprite);
  const [weapon, setWeapon] = useState(weaponSprite);

  //hard-coded penguinId
  const penguinId = "f98d2ed2-8bb0-41c4-a06d-ceaa98473c1c";

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:9000");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat") {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendMessage = useCallback(() => {
    if (ws.current && inputMessage.trim()) {
      ws.current.send(
        JSON.stringify({
          type: "chat",
          username: "User", // You can replace this with actual username logic
          message: inputMessage,
        })
      );
      setInputMessage("");
    }
  }, [inputMessage]);

  const fetchRoom = async () => {
    try {
      await initializePlayer();
      const roomData = await getRoomData();
      setRoom(roomData);
    } catch (error) {
      console.error("Error initializing room:", error);
    }
  };

  const fetchPosition = async () => {
    try {
      const positionData = await getPosition(penguinId);
      setPosition(positionData);
    } catch (error) {
      console.error("Error fetching Position:", error);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPosition();
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

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

  const handleCanvasClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);
    const clickedPos = { x, y };

    if (clickIsAvatarArea(clickedPos, position, 50)) {
      setCanMove(true);
      console.log("Penguin selected. You can now move.");
    } else if (canMove && clickedPos) {
      setCanMove(false);
      updatePosition(penguinId, clickedPos);
    } else if (!canMove) {
      console.log("You must click the penguin first!");
    }
  };

  const handleMarkerClick = async (markerPosition: Position) => {
    // Marker click logic here if needed
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
      <div
        className="chat-container"
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          width: 300,
          height: 400,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: 10,
          overflowY: "auto",
        }}
      >
        <div className="messages" style={{ height: 320, overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.username}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="input-area" style={{ display: "flex", marginTop: 10 }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            style={{ flexGrow: 1, marginRight: 5 }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
};

export default Room;
