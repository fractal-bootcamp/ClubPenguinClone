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
import { useInterval } from "../hooks/useInterval";
import { fetchEntityMap } from "../utils/fetchEntityMap";
import { EntityMap } from "../../src/utils/types";

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

const TEST_PENGUIN_ID = import.meta.env.VITE_TEST_PENGUIN_ID;

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

  const [_canMove, setCanMove] = useState<boolean>(false); // New state to track if user can move
  const canMove = true;
  const [isMovingFromBackend, setIsMovingFromBackend] =
    useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const [entityMap, setEntityMap] = useState<EntityMap>([]);
  const [debugMode, setDebugMode] = useState<boolean>(false);



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
  const penguinId = TEST_PENGUIN_ID;

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
      const response = await getPosition(penguinId);
      console.log("bruno response", response);
      const { x, y, isMoving } = response;
      const positionData = { x, y };
      setIsMovingFromBackend(isMoving);

      console.log("inFetch1", isMoving);

      setPosition((prevPosition) => {
        console.log("inFetch", isMoving);
        if (isMoving && areCoordinatesEqual(positionData, prevPosition)) {
          setIsMovingFromBackend(false);
        }

        if (!isMoving && !areCoordinatesEqual(positionData, prevPosition)) {
          setIsMovingFromBackend(true);
        }

        return positionData;
      });
    } catch (error) {
      console.error("Error fetching Position:", error);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  useInterval(fetchPosition, 100);

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

  const handleGetEntityMap = async () => {
    setEntityMap(await fetchEntityMap());
    console.log('entity map', entityMap);
  };

  const fetchAndSetEntityMap = async () => {
    const map = await fetchEntityMap();
    console.log('setting entity map', map);
    setEntityMap(map);
  };


  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode((prevDebugMode) => !prevDebugMode);
    console.log('entities are', entityMap);
    fetchAndSetEntityMap();
  };


  return (
    <>

      <button onClick={toggleDebugMode}>
        {debugMode ? "Disable Debug Mode" : "Enable Debug Mode"}
      </button>
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
        {entityMap.map((entity, index) => (
          <EntityMarker key={index} x={entity.x} y={entity.y} />
        ))}
      </div>

      <div>
        {position && (
          <div>
            <p>
              Current Position: x={position.x}, y={position.y}
            </p>
            <p> Current Direction: {direction} </p>
            <p> Is moving: {isMovingFromBackend} </p>
          </div>
        )}
        <p>
          {canMove
            ? "You can now click anywhere to move."
            : "Click near the current Position to enable movement."}
        </p>
      </div>

      <button onClick={handleGetEntityMap}>Get Entity Map</button>
    </>
  );
};


const EntityMarker = ({ x, y }: { x: number, y: number }) => {
  return (

    <div style={{ position: "absolute", left: `${x}px`, top: `${y}px`, width: "10px", height: "10px", backgroundColor: "red" }} >
      x
    </div>

  )

}

export default Room;
