import { Entity, Penguin } from "../types"
import { getEntityMap } from "../utils/getRoomAndEntityMap"

export const processCollision = ({ proposedMovePenguin, prevPenguin }: { proposedMovePenguin: Penguin, prevPenguin: Penguin }): Penguin => {
    const { currentPos, clickDestPos } = proposedMovePenguin
    const { currentRoom } = proposedMovePenguin
    console.time('getEntityMap')
    const entityMap = getEntityMap(currentRoom)
    console.timeEnd('getEntityMap')

    console.time('findCell')
    const checkedCell = entityMap.find((cell) => cell.x === currentPos[0] && cell.y === currentPos[1])
    console.timeEnd('findCell')
    if (checkedCell && checkedCell.entities) {
        console.time('runEntityCollisionActions')
        runEntityCollisionActions({ entities: checkedCell.entities })
        console.timeEnd('runEntityCollisionActions')
        return calculateProposedOrPrevPenguin
            ({ proposedMovePenguin: proposedMovePenguin, entities: checkedCell.entities, prevPenguin: prevPenguin })
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