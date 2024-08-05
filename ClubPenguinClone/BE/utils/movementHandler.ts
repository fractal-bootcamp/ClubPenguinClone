// this function takes in a penguin object
// and the new position that's been proprosed
// it actually checks if what was sent was a 
// and returns 

import { Penguin } from "../lib/penguin/types";
import redis from "./redisClient";
import { getPenguinData, setPenguinData } from "./redisOps";


type MovementHandlerProps = {
    penguinId: string;
    clickDestPos: [number, number] | null,
    clickOriginPos: [number, number] | null
    arrowKeyPressed: string | null
}

// if the penguin movement is passed as a click
// then process it as a clik

export const movementHandler = (props: MovementHandlerProps) => {

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
    const targetPenguin = await getPenguinData(penguinId)
    if (!targetPenguin) return null
    const { currentPos } = targetPenguin

    if (clickDestPos) {
        const [currX, currY] = currentPos;
        const [destX, destY] = clickDestPos;
        const newX = await calculateNewDim(currX, destX)
        const newY = await calculateNewDim(currY, destY)
        const newPenguin: Penguin = { ...penguin, currentPos: [newX, newY] }
        const response = await setPenguinData(id, newPenguin)
        console.log(response)
        return response
    }
    else {
        return null
    }

}

const calculateNewDim = (currD, destD) => {
    if (destD > currD) {
        return currD + 1
    }
    else if (destD < currD) {
        return currD - 1
    }
    else {
        return currD
    }
}

const handleArrowKeyMovement = () => {

}

const testPenguin: Penguin = {
    id: 'test',
    email: 'test@test.com',
    name: 'test',
    color: 'red',
    currentPos: [0, 0],
}

console.log('initial penguin:', testPenguin)

debugger;
console.log(await movementHandler({ penguin: testPenguin, clickDestPos: [3, 1], clickOriginPos: [0, 0], arrowKeyPressed: null }))
console.log('new penguin after click:', await getPenguinData('test'))
debugger;
console.log(await movementHandler({ penguin: testPenguin, clickDestPos: [3, 1], clickOriginPos: [0, 0], arrowKeyPressed: null }))
console.log('new penguin after click:', await getPenguinData('test'))
console.log(await movementHandler({ penguin: testPenguin, clickDestPos: [3, 1], clickOriginPos: [0, 0], arrowKeyPressed: null }))
console.log('new penguin after click:', await getPenguinData('test'))   