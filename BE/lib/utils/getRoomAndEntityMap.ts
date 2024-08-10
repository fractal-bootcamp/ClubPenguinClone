import fs from 'fs';
import path from 'path';
import type { EntityMap } from '../types';


export const getEntityMap = (currentRoom: string): EntityMap => {
    const dummyMap = JSON.parse(fs.readFileSync(path.join(__dirname, './testMap.json'), 'utf-8'));
    return dummyMap;

}


