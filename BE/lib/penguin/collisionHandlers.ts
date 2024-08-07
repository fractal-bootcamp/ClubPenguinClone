import { Entity, Penguin } from "../types"
import { getEntityMap } from "../utils/getRoomAndEntityMap"

export const collisionCheck = ({ proposedMovePenguin, prevPenguin }: { proposedMovePenguin: Penguin, prevPenguin: Penguin }): Penguin => {
    const { currentPos, clickDestPos } = proposedMovePenguin
    const { currentRoom } = proposedMovePenguin
    const entityMap = getEntityMap(currentRoom)

    const checkedCell = entityMap.find((cell) => cell.x === currentPos[0] && cell.y === currentPos[1])
    if (checkedCell && checkedCell.entities) {
        processEntityCollisionActions({ entities: checkedCell.entities })
        return calculateProposedOrPrevPenguin
            ({ proposedMovePenguin: proposedMovePenguin, entities: checkedCell.entities, prevPenguin: prevPenguin })
    }
    else {
        return proposedMovePenguin
    }
}

const processEntityCollisionActions = ({ entities }: { entities: Entity[] }) => {
    entities.forEach(entity => {
        entity.onCollisionActions.forEach(action => action());
    });
}

const calculateProposedOrPrevPenguin = ({ proposedMovePenguin, entities, prevPenguin }: { proposedMovePenguin: Penguin, entities: Entity[], prevPenguin: Penguin }): Penguin => {

    // Calculate collisions
    const isBlocked = entities.some(entity =>
        entity.blocking
    );

    return isBlocked
        ? { ...proposedMovePenguin, currentPos: prevPenguin.currentPos }
        : proposedMovePenguin;
}