const VITE_API_URL = import.meta.env.VITE_API_URL;
export const getPenguinsInRoom = async (roomId: string) => {
    return await fetch(`${VITE_API_URL}/penguins/room/${roomId}`)
}