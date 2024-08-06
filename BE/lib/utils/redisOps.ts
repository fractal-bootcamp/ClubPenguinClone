import { Penguin } from "../penguin/types"
import redis from "./redisClient"

const PENGUIN_SET_KEY = 'penguins'

export const setPenguinData = async (penguinId: string, newPenguin: Penguin) => {
    const key = `penguin:${penguinId}`
    await redis.set(key, JSON.stringify(newPenguin))
    return await redis.sadd(PENGUIN_SET_KEY, key)

}

export const getPenguinData = async (penguinId: string): Promise<Penguin | null> => {
    const response = await redis.get(`penguin:${penguinId}`)
    if (response) return JSON.parse(response)
    else return null
}

export const getAllPenguins = async (): Promise<Penguin[]> => {
    const keys = await redis.smembers(PENGUIN_SET_KEY)
    const penguins = await Promise.all(keys.map(key => redis.get(key)))
    return penguins.filter(Boolean).map(penguin => {
        if (!penguin) return null
        return JSON.parse(penguin)
    })
}

export const deletePenguin = async (penguinId: string) => {
    const key = `penguin:${penguinId}`
    await redis.del(key)
    return await redis.srem(PENGUIN_SET_KEY, key)
}