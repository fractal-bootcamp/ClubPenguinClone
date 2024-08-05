import axios from 'axios';

const API_URL = 'http://localhost:9000';

interface Point {
    x: number;
    y: number;
}

// Function to initialize player
export const initializePlayer = async () => {
    try {
        const response = await axios.post(`${API_URL}/initialize-player`, {
            // Optional player details if needed
        });

        console.log('Player initialized:', response.data);
    } catch (error) {
        console.error('Error initializing player:', error);
    }
};

// Function to fetch room data
export const getRoomData = async (): Promise<Point[]> => {
    try {
        const response = await axios.get(`${API_URL}/get-room-data`);
        return response.data;
    } catch (error) {
        console.error('Error fetching room data:', error);
        throw error;
    }
};

// Function to update position
export const updatePosition = async (userId: string, position: { x: number, y: number }) => {
    try {
        const response = await axios.post(`${API_URL}/update-position`, {
            userId,
            position
        });
        return response.data;
    } catch (error) {
        console.error('Error updating position:', error);
        throw error;
    }
};

// Function to get position
export const getPosition = async (userId: string) => {
    try {
        const response = await axios.get(`${API_URL}/get-position/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting position:', error);
        throw error;
    }
};
