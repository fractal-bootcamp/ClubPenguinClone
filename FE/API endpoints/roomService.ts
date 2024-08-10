import { Penguin } from "../src/utils/types";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const getPenguinsInRoom = async (roomName: string) => {
    try {
        const response = await fetch(`${VITE_API_URL}/get-penguins-in-room/${roomName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: Penguin[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching penguins in room:', error);
        throw error;
    }
}