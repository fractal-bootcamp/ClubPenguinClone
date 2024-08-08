import fs from 'fs'; // Changed require to import
// Removed path import since it's not available in the browser
export const saveMapToFile = (entityMap: any) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Format timestamp
    const outputPath = `../entityMap_${timestamp}.json`; // Use a relative path directly
    fs.writeFileSync(outputPath, JSON.stringify(entityMap, null, 2), 'utf-8');
}