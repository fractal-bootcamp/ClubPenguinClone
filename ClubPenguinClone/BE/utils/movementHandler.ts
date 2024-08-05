// this function takes in a penguin object
// and the new position that's been proprosed
// it actually checks if what was sent was a 
// and returns 

import redis from "./redisClient";

type Penguin = {
    id: string,
    email: string,
    name: string,
    color: string,
    currentPos: [number, number],
    clickDestPos: [number, number] | null,
    clickOriginPos: [number, number] | null
    arrowKeyPressed: string | null
}

type MovementHandlerProps = {
    penguin: Penguin;

}

// if the penguin movement is passed as a click
// then process it as a clik

export const movementHandler = ({ penguin }: MovementHandlerProps) => {

    if (penguin.clickDestPos) {
        handleClickMovement({ penguin })
    }
    else if (penguin.arrowKeyPressed) {
        handleArrowKeyMovement()

    }
}

const handleClickMovement = ({ penguin }: MovementHandlerProps) => {
    const { currentPos, clickDestPos, clickOriginPos, arrowKeyPressed } = penguin

    if (clickDestPos) {
        const [currX, currY] = currentPos;
        const [destX, destY] = clickDestPos;
        const newX = calculateNewDim(currX, destX)
        const newY = calculateNewDim(currY, destY)
    }

}

// const testRedisConnection = async () => {
//     console.log('running')
//     await redis.set('test2', 'testerer')
//     const response = await redis.get('test2')
//     console.log(response)
// }

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

testRedisConnection();