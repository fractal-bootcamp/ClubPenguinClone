import { Penguin } from "../lib/penguin/types"
import redis from "./redisClient"

export const setPenguinData = async (penguinId: string, newPenguin: Penguin) => {
    return await redis.set(`penguin:${penguinId}`, JSON.stringify(newPenguin))
}

export const getPenguinData = async (penguinId: string): Promise<Penguin | null> => {
    const response = await redis.get(`penguin:${penguinId}`)
    if (response) return JSON.parse(response)
    else return null
}