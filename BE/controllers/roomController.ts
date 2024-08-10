import type { Request, Response, Router } from 'express';
import { getAllPenguins } from '../lib/utils/redisOps';


export const getPenguinsInRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        const allPenguins = await getAllPenguins()
        const penguinsInRoom = allPenguins.filter((penguin) => penguin.currentRoom === roomId)
        res.status(200).json(penguinsInRoom)
    }
    catch (error) {
        console.error('Error getting penguins in room:', error);
        res.status(500).json({ error: 'Internal server error' });
    }


};