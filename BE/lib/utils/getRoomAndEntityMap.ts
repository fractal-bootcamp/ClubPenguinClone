import fs from 'fs';
import path from 'path';
import { EntityMap } from '../types';
export const getEntityMap = (currentRoom: string): EntityMap => {

    const mapsPath = path.join(__dirname, '../entityMaps.json');
    const mapsData = JSON.parse(fs.readFileSync(mapsPath, 'utf-8'));
    const entityMap: EntityMap = mapsData[currentRoom] || [];

    return entityMap;

}