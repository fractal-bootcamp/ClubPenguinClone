// this function takes in a penguin object
// and the new Position that's been proprosed
// it actually checks if what was sent was a 
// and returns 

import type { Entity, Penguin } from "../types";
import { getEntityMap } from "../utils/getRoomAndEntityMap";
import redis from "../utils/redisClient";
import { getPenguinData, setPenguinData } from "../utils/redisOps";
import { processCollision } from "./collisionHandlers";



export const parseInputMovement = async ({ penguinId, clickDestPos, arrowKeyPressed }: MovementHandlerProps) => {

    const penguin = await getPenguinData(penguinId)
    if (!penguin) return null

    if (clickDestPos) {
        const updatedPenguin = { ...penguin, clickDestPos: clickDestPos, clickOriginPos: penguin.currentPos, isMoving: true, arrowKeyPressed: null }
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

        console.time('processCollision')
        const checkedPenguin = processCollision({ proposedMovePenguin: proposedMovePenguin, prevPenguin: penguin })
        console.timeEnd('processCollision')

        const response = await setPenguinData(penguinId, checkedPenguin)
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



const calculateNextPositionStep = async (penguinId: string): Promise<Penguin | null> => {
    const penguin = await getPenguinData(penguinId)

    if (!penguin) return null
    const { currentPos, clickDestPos } = penguin


    if (clickDestPos) {
        const [currX, currY] = currentPos;
        const [destX, destY] = clickDestPos;
        const newX = await calculateNewDim(currX, destX)
        const newY = await calculateNewDim(currY, destY)

        const distance = Math.sqrt(Math.pow(destX - newX, 2) + Math.pow(destY - newY, 2));
        const isAtDestination = isWithinRange(newX, newY, destX, destY, 30); // Use a small threshold


        // TODO: set the orientation of the penguin through the comparison of 
        // current and destination positions
        const updatedPenguin: Penguin = {
            ...penguin,
            currentPos: isAtDestination ? [destX, destY] : [Math.round(newX), Math.round(newY)],
            isMoving: !isAtDestination,
            clickDestPos: isAtDestination ? null : clickDestPos,
            clickOriginPos: isAtDestination ? null : penguin.clickOriginPos
        }

        console.log("Updated penguin in calculateNextPositionStep:", updatedPenguin);
        return updatedPenguin
    }
    else {
        return { ...penguin, isMoving: false };
    }

}

// 0,0 -> 3, 1
// 1,0



const isWithinRange = (x1: number, y1: number, x2: number, y2: number, range: number): boolean => {
    return Math.abs(x1 - x2) <= range && Math.abs(y1 - y2) <= range;
}

const checkIfDestinationIsReached = (currDim: number, destDim: number) => {
    // if (destDim > currDim - 10 && destDim < currDim + 10) {
    //     return true
    // }
    // else {
    //     return false
    // }
    return Math.abs(destDim - currDim) < 1;
}

const calculateNewDim = (currDim: number, destDim: number) => {
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

