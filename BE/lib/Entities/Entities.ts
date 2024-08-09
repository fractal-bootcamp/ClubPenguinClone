import { Coordinate, Wall, MapBeta } from '../penguin/types';

// Helper function to normalize coordinates
function normalizeCoordinates(
    coordinates: Coordinate[],
    originalWidth: number,
    originalHeight: number,
    newWidth: number,
    newHeight: number
): Coordinate[] {
    return coordinates.map(coord => ({
        x: (coord.x / originalWidth) * newWidth,
        y: (coord.y / originalHeight) * newHeight,
    }));
}

// Original wall coordinates
const wall1Coords: Coordinate[] = [
    { x: 102, y: 578 },
    { x: 186, y: 616 },
    { x: 982, y: 205 },
    { x: 885, y: 138 },
];

const wall2Coords: Coordinate[] = [
    { x: 500, y: 775 },
    { x: 582, y: 816 },
    { x: 1385, y: 409 },
    { x: 1254, y: 337 },
];

const wall3Coords: Coordinate[] = [
    { x: 997, y: 977 },
    { x: 963, y: 1010 },
    { x: 1778, y: 616 },
    { x: 1551, y: 530 },
];

// Image size
const originalWidth = 1919;
const originalHeight = 1079;

// New image size (for example purposes)
const newWidth = 1280;
const newHeight = 720;

// Normalize coordinates for the new size
const normalizedWall1Coords = normalizeCoordinates(wall1Coords, originalWidth, originalHeight, newWidth, newHeight);
const normalizedWall2Coords = normalizeCoordinates(wall2Coords, originalWidth, originalHeight, newWidth, newHeight);
const normalizedWall3Coords = normalizeCoordinates(wall3Coords, originalWidth, originalHeight, newWidth, newHeight);

// Define walls
const wall1: Wall = { points: normalizedWall1Coords };
const wall2: Wall = { points: normalizedWall2Coords };
const wall3: Wall = { points: normalizedWall3Coords };

// Define MapBeta
const mapBeta: MapBeta = {
    width: newWidth,
    height: newHeight,
    walls: [wall1, wall2, wall3],
    getWallBoundaries: (wallIndex: number): Coordinate[] => {
        if (wallIndex < 0 || wallIndex >= mapBeta.walls.length) {
            throw new Error("Invalid wall index");
        }
        return mapBeta.walls[wallIndex].points;
    }
};

export { mapBeta };
