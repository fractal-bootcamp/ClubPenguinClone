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
import clothesMale from "../../src/assets/isometric-hero/body/clothes.png";
import leatherArmorMale from "../../src/assets/isometric-hero/body/leather_armor.png";
import steelArmorMale from "../../src/assets/isometric-hero/body/steel_armor.png";
import clothesFemale from "../../src/assets/isometric_heroine/body/clothes.png";
import leatherArmorFemale from "../../src/assets/isometric_heroine/body/leather_armor.png";
import steelArmorFemale from "../../src/assets/isometric_heroine/body/steel_armor.png";

import maleHead1 from "../../src/assets/isometric-hero/head/male_head1.png";
import maleHead2 from "../../src/assets/isometric-hero/head/male_head2.png";
import maleHead3 from "../../src/assets/isometric-hero/head/male_head3.png";
import femaleHead1 from "../../src/assets/isometric_heroine/head/head_long.png";

import dagger from "../../src/assets/isometric-hero/primary-weapon/dagger.png";
import greatbow from "../../src/assets/isometric-hero/primary-weapon/greatbow.png";
import greatstaff from "../../src/assets/isometric-hero/primary-weapon/greatstaff.png";
import greatsword from "../../src/assets/isometric-hero/primary-weapon/greatsword.png";
import longbow from "../../src/assets/isometric-hero/primary-weapon/longbow.png";
import longsword from "../../src/assets/isometric-hero/primary-weapon/longsword.png";
import rod from "../../src/assets/isometric-hero/primary-weapon/rod.png";
import shortbow from "../../src/assets/isometric-hero/primary-weapon/shortbow.png";
import shortsword from "../../src/assets/isometric-hero/primary-weapon/shortsword.png";
import slingshot from "../../src/assets/isometric-hero/primary-weapon/slingshot.png";
import staff from "../../src/assets/isometric-hero/primary-weapon/staff.png";
import wand from "../../src/assets/isometric-hero/primary-weapon/wand.png";

import buckler from "../../src/assets/isometric-hero/secondary-weapon/buckler.png";
import shield from "../../src/assets/isometric-hero/secondary-weapon/shield.png";

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

  const [canMove, setCanMove] = useState<boolean>(false); // New state to track if user can move
  const [isMovingFromBackend, setIsMovingFromBackend] =
    useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Character's movement animation
  const [direction, setDirection] = useState<number>(0);

  const [frame, setFrame] = useState<number>(0);
  const [animationDuration, setAnimationDuration] = useState<number>(1000);

  //hard-coded penguinId
  const penguinId = TEST_PENGUIN_ID;

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  // Character options
  const [headOptions, setHeadOptions] = useState([
    maleHead1,
    maleHead2,
    maleHead3,
    femaleHead1,
    null,
  ]);
  const [bodyOptions, setBodyOptions] = useState([
    clothesMale,
    leatherArmorMale,
    steelArmorMale,
    steelArmorFemale,
    leatherArmorFemale,
    null,
  ]);
  const [primaryWeaponOptions, setPrimaryWeaponOptions] = useState([
    dagger,
    greatbow,
    greatstaff,
    greatsword,
    longbow,
    longsword,
    rod,
    shortbow,
    shortsword,
    slingshot,
    staff,
    wand,
    null,
  ]);
  const [secondaryWeaponOptions, setSecondaryWeaponOptions] = useState([
    buckler,
    shield,
    null,
  ]);

  const [selectedHead, setSelectedHead] = useState<string | null>(femaleHead1);
  const [selectedBody, setSelectedBody] = useState<string | null>(clothesMale);
  const [selectedPrimaryWeapon, setSelectedPrimaryWeapon] = useState<
    string | null
  >(dagger);
  const [selectedSecondaryWeapon, setSelectedSecondaryWeapon] = useState<
    string | null
  >(buckler);

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

  const animationFrames = [1280, 1152, 1024, 896, 768, 640, 512, 384, 256];
  // 256, 128, 01664,
  // 1408,1408,
  useEffect(() => {
    if (isMovingFromBackend) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isMovingFromBackend]);

  useEffect(() => {
    setAnimationDuration(isAnimating ? 2000 : 0);
  }, [isAnimating]);

  // const animationFrames = [
  //   0, 128, 256, 384, 512, 640, 768, 896, 1024, 1152, 1280, 1408, 1536, 1664,
  // ];

  //Animate the character when it moves
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, animationDuration]);

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

  const handleHeadSelection = (head: string | null) => {
    setSelectedHead(head);
  };

  const handleBodySelection = (body: string | null) => {
    setSelectedBody(body);
  };

  const handlePrimaryWeaponSelection = (weapon: string | null) => {
    setSelectedPrimaryWeapon(weapon);
  };

  const handleSecondaryWeaponSelection = (weapon: string | null) => {
    setSelectedSecondaryWeapon(weapon);
  };

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
              body={selectedBody}
              head={selectedHead}
              primaryWeapon={selectedPrimaryWeapon}
              secondaryWeapon={selectedSecondaryWeapon}
              isAnimating={isAnimating}
              animationFrames={animationFrames}
              animationDuration={animationDuration}
            />
          </>
        )}
      </div>
      <div className="controls">
        <h3>Select Head</h3>
        {headOptions.map((head, index) => (
          <button key={index} onClick={() => handleHeadSelection(head)}>
            Head {index + 1}
          </button>
        ))}
        <h3>Select Body</h3>
        {bodyOptions.map((body, index) => (
          <button key={index} onClick={() => handleBodySelection(body)}>
            Body {index + 1}
          </button>
        ))}
        <h3>Select Primary Weapon</h3>
        {primaryWeaponOptions.map((weapon, index) => (
          <button
            key={index}
            onClick={() => handlePrimaryWeaponSelection(weapon)}
          >
            Weapon {index + 1}
          </button>
        ))}
        <h3>Select shield</h3>
        {secondaryWeaponOptions.map((weapon, index) => (
          <button
            key={index}
            onClick={() => handleSecondaryWeaponSelection(weapon)}
          >
            Weapon {index + 1}
          </button>
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
    </>
  );
};

export default Room;
