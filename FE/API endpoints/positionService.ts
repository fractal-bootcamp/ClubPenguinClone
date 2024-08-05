import axios from 'axios';

const API_URL = 'http://localhost:9000';

interface Position {
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
export const getRoomData = async (): Promise<Position[]> => {
    try {
        const response = await axios.get(`${API_URL}/get-room-data`);
        return response.data;
    } catch (error) {
        console.error('Error fetching room data:', error);
        throw error;
    }
};

// Function to update Position
export const updatePosition = async (id: string, Position: { x: number, y: number }) => {
    try {
        const response = await axios.post(`${API_URL}/update-position`, {
            id,
            Position
        });
        return response.data;
    } catch (error) {
        console.error('Error updating Position:', error);
        throw error;
    }
};

// Function to get Position
export const getPosition = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/get-position/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error getting Position:', error);
        throw error;
    }
};
