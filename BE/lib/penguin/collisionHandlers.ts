import type { Entity, Penguin } from "../types"
import { getEntityMap } from "../utils/getRoomAndEntityMap"

export const CHUNK_SIZE = 10;

export const processCollision = ({ proposedMovePenguin, prevPenguin }: { proposedMovePenguin: Penguin, prevPenguin: Penguin }): Penguin => {
    const { currentPos, clickDestPos } = proposedMovePenguin
    const { currentRoom } = proposedMovePenguin
    console.time('getEntityMap')
    const entityMap = getEntityMap(currentRoom)
    console.timeEnd('getEntityMap')

    console.time('findCell')

    const chunkX = Math.floor(currentPos[0] / CHUNK_SIZE)
    const chunkY = Math.floor(currentPos[1] / CHUNK_SIZE)
    const checkedChunk = entityMap.find((chunk) => chunk.x === chunkX && chunk.y === chunkY)

    console.timeEnd('findCell')
    if (checkedChunk && checkedChunk.entities) {
        console.time('runEntityCollisionActions')
        runEntityCollisionActions({ entities: checkedChunk.entities })
        console.timeEnd('runEntityCollisionActions')
        return calculateProposedOrPrevPenguin
            ({ proposedMovePenguin: proposedMovePenguin, entities: checkedChunk.entities, prevPenguin: prevPenguin })
    }
    else {
        return proposedMovePenguin
    }
}

const runEntityCollisionActions = ({ entities }: { entities: Entity[] }) => {
    entities.forEach(entity => {
        entity.onCollisionActions.forEach(action => action());
    });
}

const calculateProposedOrPrevPenguin = ({ proposedMovePenguin, entities, prevPenguin }: { proposedMovePenguin: Penguin, entities: Entity[], prevPenguin: Penguin }): Penguin => {
    console.time('isBlocked')

    const isBlocked = entities.some(entity => {
        return entity.blocking

    }

    );
    console.timeEnd('isBlocked')

    return isBlocked
        ? { ...proposedMovePenguin, currentPos: prevPenguin.currentPos }
        : proposedMovePenguin;
}