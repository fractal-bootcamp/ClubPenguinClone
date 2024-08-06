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

// Function to update position
export const updatePosition = async (penguinId: string, position: { x: number, y: number }) => {
    try {
        const response = await axios.post(`${API_URL}/update-position`, {
            penguinId,
            position
        });
        return response.data;
    } catch (error) {
        console.error('Error updating Position:', error);
        throw error;
    }
};

// Function to get position
export const getPosition = async (penguinId: string) => {
    try {
        console.log('doing a get request')
        const response = await axios.get(`${API_URL}/get-position/${penguinId}`);
        console.log('got response', response)
        return response.data;
    } catch (error) {
        console.error('Error getting Position:', error);
        throw error;
    }
};
