import type { Request, Response } from 'express';
import { getPenguinData, setPenguinData } from '../lib/utils/redisOps';
import { Penguin } from '../lib/penguin/types';
import { randomUUID } from 'crypto';
import { generateRandomColor } from '../lib/utils/generateRandomColor';
import { movementInputHandler } from '../lib/penguin/movementHandler';
import redis from '../lib/utils/redisClient';


interface Position {
    x: number;
    y: number;
}

interface Point {
    x: number;
    y: number;
}


interface GameState {
    roomName: string;
    coordinates: Point[];
    status: 'ongoing' | 'paused' | 'ended'; // You can expand this as needed
    players: string[];
    playerInitialPosition: Point;
}


//hard-coded userId

const userId: string = 'string'


// Generating room
export const generateRoom = (width: number, height: number): Point[] => {
    const room: Point[] = [];

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            room.push({ x, y });
        }
    }

    return room;
};


export const initializePlayer = async (req: Request, res: Response) => {
    // for the future: do userId

    try {
        const initialPosition: Position = { x: 618, y: 618 };
        const newId = randomUUID(); // Generate a new UUID for the penguin
        const randomColor = generateRandomColor();
        const newPenguin: Penguin = { id: newId, color: randomColor, name: "DUMMY_NAME", email: "DUMMY_EMAIL", currentPos: [initialPosition.x, initialPosition.y], clickDestPos: null, clickOriginPos: null, arrowKeyPressed: null };
        await setPenguinData(newId, newPenguin);

        res.status(200).json({ message: 'Player initialized with default position or already set' });
        console.log("initial position", initialPosition)
    } catch (error) {
        console.error('Error initializing player:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Store initial game data (should be done in an appropriate initialization function)
export const storeInitialGameState = async () => {
    try {
        console.log('Storing initial game state...');
        await redis.set('game:state:Room0', JSON.stringify({
            roomName: 'Room0',
            coordinates: generateRoom(1000, 1000),
            status: 'ongoing',
            players: ['player1'],
            playerInitialPosition: { x: 618, y: 618 }
        }));
        console.log('Initial game state stored in Redis.');
    } catch (error) {
        console.error('Error storing initial game state:', error);
    }
};



export const updatePosition = async (req: Request, res: Response) => {
    try {
        // const { userId, position }: { userId: string, position: Position } = req.body;

        const penguinId = 'brodie'
        const { position }: { position: Position } = req.body;


        if (!penguinId || !position || typeof position.x !== 'number' || typeof position.y !== 'number') {
            return res.status(400).json({ error: 'Invalid input' });
        }

        // Store position
        // Hash
        const x = position.x;
        const y = position.y;

        movementInputHandler({ penguinId: penguinId, clickDestPos: [x, y], arrowKeyPressed: null })

        res.status(200).json({ message: 'Position updated successfully' });
    } catch (error) {
        console.error('Error updating position:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Function to get the position
export const getPosition = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const penguin = await getPenguinData(userId)
        if (!penguin) return res.status(404).json({ error: 'Penguin not found' });
        const position = penguin.currentPos

        if (!position) {
            return res.status(404).json({ error: 'Position not found' });
        }


        return res.status(200).json({
            x: position[0],
            y: position[1]
        })
    }
    catch (error) {
        console.error('Error getting position:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getRoomData = async (): Promise<Point[]> => {
    try {

        //Since Room0 is the beta one, this will be hardcoded
        const roomData = await redis.get('game:state:Room0');
        if (!roomData) {
            throw new Error('No room data found');
        }
        const parsedData = JSON.parse(roomData);
        return parsedData.coordinates; // Assuming coordinates are part of the room data
    } catch (error) {
        console.error('Error fetching room data:', error);
        throw error;
    }
};