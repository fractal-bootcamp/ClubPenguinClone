// this function takes in a penguin object
// and the new position that's been proprosed
// it actually checks if what was sent was a 
// and returns 

import { Penguin } from "./types";
import redis from "../utils/redisClient";
import { getPenguinData, setPenguinData } from "../utils/redisOps";


type MovementHandlerProps = {
    penguinId: string;
    clickDestPos: [number, number] | null,
    clickOriginPos: [number, number] | null
    arrowKeyPressed: string | null
}

// if the penguin movement is passed as a click
// then process it as a clik


export const movementHandler = (props: MovementHandlerProps) => {



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


    if (props.clickDestPos) {
        const response = handleClickMovement(props)
        if (response) return response
        return null
    }
    else if (props.arrowKeyPressed) {
        const response = handleArrowKeyMovement()
        // if (response) return response
        // return null

    }
}

const handleClickMovement = async (props: MovementHandlerProps) => {
    const { penguinId, clickDestPos } = props
    const penguin = await getPenguinData(penguinId)
    if (!penguin) return null
    const { currentPos } = penguin

    if (clickDestPos) {
        const [currX, currY] = currentPos;
        const [destX, destY] = clickDestPos;
        const newX = await calculateNewDim(currX, destX)
        const newY = await calculateNewDim(currY, destY)

        // TODO: set the orientation of the penguin through the comparison of 
        // current and destination positions

        const newPenguin: Penguin = { ...penguin, currentPos: [newX, newY] }
        const response = await setPenguinData(penguinId, newPenguin)
        console.log(response)

        //TODO: publish changes

        return response
    }
    else {
        return null
    }

}

// 0,0 -> 3, 1
// 1,0

const calculateNewDim = (currDim, destDim) => {
    if (destDim > currDim) {
        return currDim + 1
    }
    else if (destDim < currDim) {
        return currDim - 1
    }
    else {
        return currDim
    }
}

const handleArrowKeyMovement = () => {

}

const testPenguin: Penguin = {
    id: 'bruno',
    email: 'test@test.com',
    name: 'test',
    color: 'red',
    currentPos: [0, 0],
}

console.log('initial penguin:', testPenguin)
await setPenguinData('bruno', testPenguin)
debugger;

console.log(await movementHandler({ penguinId: "bruno", clickDestPos: [3, 1], clickOriginPos: [0, 0], arrowKeyPressed: null }))
console.log('new penguin after click:', await getPenguinData('bruno'))
debugger;
console.log(await movementHandler({ penguinId: "bruno", clickDestPos: [3, 1], clickOriginPos: [0, 0], arrowKeyPressed: null }))
console.log('new penguin after click:', await getPenguinData('bruno'))
console.log(await movementHandler({ penguinId: "bruno", clickDestPos: [3, 1], clickOriginPos: [0, 0], arrowKeyPressed: null }))
console.log('new penguin after click:', await getPenguinData('bruno'))


// don't use await
// check and see if the penguin has reached the destination - and if so, set it to null