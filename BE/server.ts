import express from "express";
import cors from "cors";
import { updatePosition, getPosition, getRoomData, initializePlayer, storeInitialGameState } from './controllers/positionController'
import { moveAllMovingPenguins } from "./lib/penguin/moveAllMovingPenguins";


const app = express();
const port = 9000;
const router = express.Router();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5177', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));

router.post('/initialize-player', initializePlayer);
router.post('/update-position', updatePosition);
router.get('/get-position/:penguinId', getPosition);
router.get('/get-room-data', getRoomData)


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
