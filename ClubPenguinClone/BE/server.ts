import express from "express";

const app = express();
const port = 9000;

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
}, 100);