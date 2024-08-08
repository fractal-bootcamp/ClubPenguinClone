import express from "express";
import cors from "cors";
import { updatePosition, getPosition, getRoomData, initializePlayer, storeInitialGameState } from './controllers/positionController'
import { moveAllMovingPenguins } from "./lib/penguin/moveAllMovingPenguins";


const app = express();
const port = 9000;
const router = express.Router();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));

router.post('/initialize-player', initializePlayer);
router.post('/update-position', updatePosition);
router.get('/get-position/:penguinId', getPosition);
router.get('/get-room-data', getRoomData)

app.post('/create-entity-map', (req, res) => {
    const entityMap = req.body;

    if (!entityMap) {
        return res.status(400).json({ error: 'Entity map is required' });
    }

    const fs = require('fs');
    const path = require('path');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Format timestamp
    const outputPath = path.join(__dirname, `../entityMap_${timestamp}.json`);

    fs.writeFileSync(outputPath, JSON.stringify(entityMap, null, 2), 'utf-8');
    console.log(`Entity map written to ${outputPath}`);

    res.status(200).json({ message: 'Entity map saved successfully', path: outputPath });
});





//Initialize the game state when the server starts
storeInitialGameState();


export default router;

app.use('/', router); // Make sure to use the router

app.get("/", (req, res) => {
    res.send("Penguins of the world, unite!");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
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
    incrementGameState()
    moveAllMovingPenguins()
}, 100);
