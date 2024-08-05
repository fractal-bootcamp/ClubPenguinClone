import type { Request, Response } from 'express';
import redisClient from '../redisClient'
import { Penguin } from '../lib/penguin/types';
import { getPenguinData } from '../utils/redisOps';
import { movementHandler } from '../lib/penguin/movementHandler';


type MovementHandlerProps = {
    penguinId: string;
    clickDestPos: [number, number] | null;
    clickOriginPos: [number, number] | null;
    arrowKeyPressed: string | null;
}


interface Position {
    x: number;
    y: number;
}

interface Position {
    x: number;
    y: number;
}


interface GameState {
    roomName: string;
    coordinates: Position[];
    status: 'ongoing' | 'paused' | 'ended'; // You can expand this as needed
    players: string[];
    playerInitialPosition: Position;
}


//hard-coded id

const id: string = 'bruno'


// Generating room
export const generateRoom = (width: number, height: number): Position[] => {
    const room: Position[] = [];

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            room.push({ x, y });
        }
    }

    return room;
};


export const initializePlayer = async (req: Request, res: Response) => {
    // for the future: do id

    //connect with redis client for real
    try {
        const initialPosition: Position = { x: 618, y: 618 };
        await redisClient.hSet(`user:${id}:Position`, {
            x: initialPosition.x.toString(),
            y: initialPosition.y.toString()
        });
        res.status(200).json({ message: 'Player initialized with default Position or already set' });
        console.log("initial Position", initialPosition)
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
        const { id, Position }: { id: string, Position: Position } = req.body;

        if (!id || !Position || typeof Position.x !== 'number' || typeof Position.y !== 'number') {
            return res.status(400).json({ error: 'Invalid input' });
        }

        const penguin = await getPenguinData(id);
        if (!penguin) {
            return res.status(404).json({ error: 'Penguin not found' });
        }

        const result = await movementHandler({
            penguinId: id,
            clickDestPos: [Position.x, Position.y],
            clickOriginPos: penguin.currentPos,
            arrowKeyPressed: null
        });

        if (result) {
            res.status(200).json({ message: 'Position updated successfully', newPosition: result.currentPos });
        } else {
            res.status(400).json({ error: 'Unable to update Position' });
        }
    } catch (error) {
        console.error('Error updating Position:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Function to get the Position
export const getPosition = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const Position = await redisClient.hGetAll(`user:${id}:Position`);

        if (!Position.x || !Position.y) {
            return res.status(404).json({ error: 'Position not found' });
        }


        res.status(200).json({
            x: parseInt(Position.x),
            y: parseInt(Position.y)
        })
    }
    catch (error) {
        console.error('Error getting Position:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const getRoomData = async (): Promise<Position[]> => {
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