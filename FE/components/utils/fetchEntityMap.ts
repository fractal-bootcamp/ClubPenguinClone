// fetches entity map for a debug overlay

const API_URL = import.meta.env.VITE_API_URL;
export const fetchEntityMap = async () => {
    try {
        const response = await fetch(`${API_URL}/get-test-entity-map`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched entity map data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching entity map:', error);
        return [];
    }
};