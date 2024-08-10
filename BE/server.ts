import express from "express";
import cors from "cors";
import {
    updatePosition,
    getPosition,
    getRoomController,
    initializePlayer,
    storeInitialGameState,
} from "./controllers/positionController";
import { moveAllMovingPenguins } from "./lib/penguin/moveAllMovingPenguins";
import path from "path";
import type { Request } from "express";
import multer from "multer";

import { WebSocketServer } from "ws";
import { createEntityMap, getEntityMap, fetchTestEntityMap } from "./controllers/mapController";
import { getPenguinsInRoom } from "./controllers/roomController";

// Extend the Request interface
interface RequestWithFile extends Request {
    file?: Express.Multer.File; // Define the file property
}

const FRONTEND_URL = process.env.FRONTEND_URL;
const app = express();
const port = 9000;
const router = express.Router();

app.use(express.json());
app.use(
    cors({
        origin: FRONTEND_URL, // Allow requests from this origin
        methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
        allowedHeaders: ["Content-Type", "Authorization", "Content-Encoding"], // Allow specific headers
    })
);

app.use(
    express.raw({
        type: "application/gzip",
        limit: "50mb",
    })
);

router.post("/initialize-player", initializePlayer);
router.post("/update-position", updatePosition);
router.get("/get-position/:penguinId", getPosition);
router.get("/get-room-data", getRoomController);

router.get('/get-entity-map', getEntityMap);
router.get('/get-test-entity-map', fetchTestEntityMap);
router.post("/create-entity-map", createEntityMap);

router.get('/get-penguins-in-room/:roomId', getPenguinsInRoom);


//Initialize the game state when the server starts
storeInitialGameState();

export default router;

app.use("/", router); // Make sure to use the router

app.get("/", (req, res) => {
    res.send("Penguins of the world, unite!");
});

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (message) => {
        const data = JSON.parse(message.toString());
        if (data.type === "chat") {
            // Broadcast the message to all clients
            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

// worker
var gameState = 0;

let gameWorker;

if (gameWorker) {
    clearInterval(gameWorker);
}

function incrementGameState() {
    gameState++;
}

gameWorker = setInterval(function () {
    console.log("Game state:", gameState);
    incrementGameState();
    moveAllMovingPenguins();
}, 100);
