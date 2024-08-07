// this function takes in a penguin object
// and the new Position that's been proprosed
// it actually checks if what was sent was a 
// and returns 

import { Entity, Penguin } from "../types";
import { getEntityMap } from "../utils/getRoomAndEntityMap";
import redis from "../utils/redisClient";
import { getPenguinData, setPenguinData } from "../utils/redisOps";



export const parseInputMovement = async ({ penguinId, clickDestPos, arrowKeyPressed }: MovementHandlerProps) => {

    const penguin = await getPenguinData(penguinId)
    if (!penguin) return null

    if (clickDestPos) {
        const updatedPenguin = { ...penguin, clickDestPos: clickDestPos, clickOriginPos: penguin.currentPos, arrowKeyPressed: null }
        setPenguinData(penguinId, updatedPenguin)
    }
    if (arrowKeyPressed) {
        const updatedPenguin = { ...penguin, clickDestPos: null, clickOriginPos: null, arrowKeyPressed: arrowKeyPressed }
        setPenguinData(penguinId, updatedPenguin)
    }

}



export type MovementHandlerProps = {
    penguinId: string;
    clickDestPos: [number, number] | null,
    arrowKeyPressed: string | null
}



// will this cause a problem if async 
export const movementStepHandler = async ({ penguinId }: { penguinId: string }) => {

    const penguin = await getPenguinData(penguinId)
    if (!penguin) return null

    const { clickDestPos, arrowKeyPressed } = penguin

    if (clickDestPos) {
        const proposedMovePenguin = await calculateNextPositionStep(penguinId)
        if (!proposedMovePenguin) return null

        const checkedPenguin = collisionCheck({ proposedMovePenguin: proposedMovePenguin, prevPenguin: penguin })

        const response = await setPenguinData(penguinId, updatedPenguin)
        console.log("logging new position:", await getPenguinData(penguinId))

        //TODO: publish changes?

        return response


    }
    else if (arrowKeyPressed) {
        const response = handleArrowKeyMovement()
        // if (response) return response
        // return null
    }


}

const collisionCheck = ({ proposedMovePenguin, prevPenguin }: { proposedMovePenguin: Penguin, prevPenguin: Penguin }) => {
    const { currentPos, clickDestPos } = proposedMovePenguin
    const { currentRoom } = proposedMovePenguin
    const entityMap = getEntityMap(currentRoom)

    const checkedCell = entityMap.find((cell) => cell.x === currentPos[0] && cell.y === currentPos[1])
    if (checkedCell) {
        if (checkedCell.entities) {
            processEntityCollisions
                ({ proposedMovePenguin: proposedMovePenguin, entities: checkedCell.entities, prevPenguin: prevPenguin })
        }
    }




}

const processEntityCollisions = ({ proposedMovePenguin, entities, prevPenguin }: { proposedMovePenguin: Penguin, entities: Entity[], prevPenguin: Penguin }): Penguin => {
    entities.forEach(entity => {
        entity.onCollisionActions.forEach(action => action());
    });

    // Calculate collisions
    const isBlocked = entities.some(entity =>
        entity.blocking
    );

    return isBlocked
        ? { ...proposedMovePenguin, currentPos: prevPenguin.currentPos }
        : proposedMovePenguin;
}


const calculateNextPositionStep = async (penguinId: string): Promise<Penguin | null> => {
    const penguin = await getPenguinData(penguinId)

    if (!penguin) return null
    const { currentPos, clickDestPos } = penguin


    if (clickDestPos) {
        const [currX, currY] = currentPos;
        const [destX, destY] = clickDestPos;
        const newX = await calculateNewDim(currX, destX)
        const newY = await calculateNewDim(currY, destY)

        // TODO: set the orientation of the penguin through the comparison of 
        // current and destination positions
        const updatedPenguin: Penguin = { ...penguin, currentPos: [newX, newY] }
        if (checkIfDestinationIsReached(currX, destX) && checkIfDestinationIsReached(currY, destY)) {
            updatedPenguin.clickDestPos = null;
            updatedPenguin.clickOriginPos = null;
        }

        return updatedPenguin

    }
    else {
        return null
    }

}

// 0,0 -> 3, 1
// 1,0

const checkIfDestinationIsReached = (currDim, destDim) => {
    if (destDim > currDim - 5 && destDim < currDim + 5) {
        return true
    }
    else {
        return false
    }
}

const calculateNewDim = (currDim, destDim) => {
    if (destDim > currDim) {
        const diff = destDim - currDim
        return currDim + 0.1 * diff
    }
    else if (destDim < currDim) {
        const diff = currDim - destDim
        return currDim - 0.1 * diff
    }
    else {
        return currDim
    }
}

const handleArrowKeyMovement = () => {

}

// const testPenguin: Penguin = {
//     id: 'brodie',
//     email: 'test@test.com',
//     name: 'test',
//     color: 'red',
//     currentPos: [0, 0],
//     clickDestPos: null,
//     clickOriginPos: null,
//     arrowKeyPressed: null
// }

// console.log('initial penguin:', testPenguin)
// await setPenguinData('brodie', testPenguin)
// debugger;

