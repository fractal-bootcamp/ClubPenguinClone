import fs from 'fs';
import path from 'path';
export const getEntityMap = (currentRoom: string) => {

    const mapsPath = path.join(__dirname, '../entityMaps.json');
    const mapsData = JSON.parse(fs.readFileSync(mapsPath, 'utf-8'));
    const entityMap = mapsData[currentRoom] || [];

    return entityMap;

}