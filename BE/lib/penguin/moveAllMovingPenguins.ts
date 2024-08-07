import { getAllPenguins } from "../utils/redisOps"
import { movementStepHandler } from "./movementHandlers"

export const moveAllMovingPenguins = async () => {
    const penguins = await getAllPenguins()
    const movingPenguins = penguins.filter(
        (penguin) => penguin.clickDestPos || penguin.arrowKeyPressed) // if they have a destination, they're moving

    movingPenguins.map((penguin) => movementStepHandler({ penguinId: penguin.id })
    )
}