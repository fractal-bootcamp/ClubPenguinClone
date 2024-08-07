// this function takes in a penguin object
// and the new Position that's been proprosed
// it actually checks if what was sent was a 
// and returns 

import { Penguin } from "./types";
import redis from "../utils/redisClient";
import { getPenguinData, setPenguinData } from "../utils/redisOps";


export type MovementHandlerProps = {
    penguinId: string;
    clickDestPos: [number, number] | null,
    arrowKeyPressed: string | null
}

// if the penguin movement is passed as a click
// then process it as a clik


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


// will this cause a problem if async 
export const movementStepHandler = async ({ penguinId }: { penguinId: string }) => {

    const penguin = await getPenguinData(penguinId)
    if (!penguin) return null

    const { clickDestPos, arrowKeyPressed } = penguin

    if (clickDestPos) {
        const updatedPenguin = await calculateNextPositionStep(penguinId)
        if (!updatedPenguin) return null
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

