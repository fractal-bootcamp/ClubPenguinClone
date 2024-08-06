import type { Request, Response } from 'express';
import redisClient from '../lib/utils/redisClient'


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
        await redisClient.hSet(`user:${userId}:position`, {
            x: initialPosition.x.toString(),
            y: initialPosition.y.toString()
        });
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
        await redisClient.set('game:state:Room0', JSON.stringify({
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
        const { userId, position }: { userId: string, position: Position } = req.body;

        if (!userId || !position || typeof position.x !== 'number' || typeof position.y !== 'number') {
            return res.status(400).json({ error: 'Invalid input' });
        }

        // Store position
        // Hash
        await redisClient.hSet(`user:${userId}:position`, {
            x: position.x.toString(),
            y: position.y.toString()
        });

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
        const position = await redisClient.hGetAll(`user:${userId}:position`);

        if (!position.x || !position.y) {
            return res.status(404).json({ error: 'Position not found' });
        }


        res.status(200).json({
            x: parseInt(position.x),
            y: parseInt(position.y)
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
        const roomData = await redisClient.get('game:state:Room0');
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