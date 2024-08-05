import { Penguin } from "../lib/penguin/types"
import redis from "./redisClient"

export const setPenguinData = async (penguinId: string, newPenguin: Penguin) => {
    console.log('setting penguin data bro', penguinId, newPenguin)
    return await redis.set(`penguin:${penguinId}`, JSON.stringify(newPenguin))
}