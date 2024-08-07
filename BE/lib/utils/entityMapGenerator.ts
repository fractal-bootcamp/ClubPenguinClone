import { EntityMapCell, Entity, EntityMap } from "../types";

type WallCorner = {
    x: number,
    y: number
}
type Wall = WallCorner[]

const wall1: Wall = [
    { x: 102, y: 578 },
    { x: 186, y: 616 },
    { x: 982, y: 205 },
    { x: 885, y: 138 },
];
const wall2: Wall = [
    { x: 500, y: 775 },
    { x: 582, y: 816 },
    { x: 1385, y: 409 },
    { x: 1254, y: 337 },
];
const wall3: Wall = [
    { x: 997, y: 977 },
    { x: 963, y: 1010 },
    { x: 1778, y: 616 },
    { x: 1551, y: 530 },
];

const WallEntity: Entity = {
    name: 'Wall',
    blocking: true,
    onCollisionActions: []
}



export const generateEntityMap = (walls: Wall[]): EntityMap => {
    const initialMap = Array.from({ length: 2000 }, (_, y) =>
        Array.from({ length: 2000 }, (_, x) => ({ x, y, entities: [] }))
    ).flat();




    const newMap = initialMap.map((cell: EntityMapCell) => {
        walls.forEach(wall => {
            // Get the bounding box from wall coordinates
            const minX = Math.min(...wall.map(coord => coord.x));
            const maxX = Math.max(...wall.map(coord => coord.x));
            const minY = Math.min(...wall.map(coord => coord.y));
            const maxY = Math.max(...wall.map(coord => coord.y));

            // Check if the cell is within the bounds of the wall
            const isWithinWall = cell.x >= minX && cell.x <= maxX && cell.y >= minY && cell.y <= maxY;
            if (isWithinWall) {
                cell.entities.push(WallEntity); // Add wall entity to cell.entities
            }
        })
        return cell;
    })
    return newMap;

}

const entityMap = generateEntityMap([wall1, wall2, wall3]);
console.log(entityMap.map(cell => cell.entities)); // Log entities inside of entityMap