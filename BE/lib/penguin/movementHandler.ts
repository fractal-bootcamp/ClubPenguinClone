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


export const movementInputHandler = async ({ penguinId, clickDestPos, arrowKeyPressed }: MovementHandlerProps) => {

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
export const doMovementStep = async ({ penguinId }: { penguinId: string }) => {

    // movement handler 
    // give me all the penguins that have a difference between their current position 
    // checkPenguinDiff(allPenguins)
    // if a penguin has a difference, move them once towards it. movementHandler() is one handler and one step

    // refactor Penguin so that it also holds the destination and origin
    // clickHandler sets the destination of the penguin.
    // the game loop runs checkPenguinDiff() which does a filter on array of all penguins
    // (create a redisOp to retrieve list of all penguins)
    // map over diffedPenguins and run movementHandler() so that all penguins are moved one step 
    // closer to their destination (we can use movementHandler off the shelf here)
    // 
    // at this point we might not even need to publish the changes? it's possible
    // because the frontend can just pull the list 
    // once the destination has been reached, set the destination to null again
    // 

    const penguin = await getPenguinData(penguinId)
    if (!penguin) return null

    const { clickDestPos, arrowKeyPressed } = penguin

    if (clickDestPos) {
        const response = doClickMovementStep(penguinId)
        if (response) return response
        return null
    }
    else if (arrowKeyPressed) {
        const response = handleArrowKeyMovement()
        // if (response) return response
        // return null

    }
}

const doClickMovementStep = async (penguinId: string) => {
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
        const response = await setPenguinData(penguinId, updatedPenguin)
        console.log("logging new position:", await getPenguinData(penguinId))

        //TODO: publish changes?

        return response
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

