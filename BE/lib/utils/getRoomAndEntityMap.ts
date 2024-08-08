import fs from 'fs';
import path from 'path';
import { EntityMap, Wall } from '../types';


export const getEntityMap = (currentRoom: string): EntityMap => {
    const dummyMap = JSON.parse(fs.readFileSync(path.join(__dirname, './testMap.json'), 'utf-8'));

    return dummyMap;

}




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