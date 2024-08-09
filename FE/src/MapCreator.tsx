import { useEffect, useState } from "react";
import { Entity, EntityMap, Wall } from "./utils/types";
import { sendMapToServer } from "./utils/sendMapToServer";



const CHUNK_SIZE = 10;

const width = 1920;
const height = 1080;
const cellsX = Math.ceil(width / CHUNK_SIZE);
const cellsY = Math.ceil(height / CHUNK_SIZE);

// const map = mapsData.map((cell, index) => {
//     return cell.entities.some(entity => entity.blocking)
// })



const calculateNewEntityMap = (collisionMap: boolean[], prevEntityMap: EntityMap, entity: Entity) => {
    const updatedMap = collisionMap.map((collision, index) => {
        return {
            x: index % cellsX,
            y: Math.floor(index / cellsX),
            entities: collision ? [...prevEntityMap[index].entities, entity] : prevEntityMap[index].entities
        }
    });
    return updatedMap;
}


const initialEntityMap: EntityMap = Array.from({ length: cellsX * cellsY }, (_, index) => {

    return {
        x: index % cellsX,
        y: Math.floor(index / cellsX),
        entities: []
    };
});


const MapCreator = () => {
    const [entityMap, setEntityMap] = useState<EntityMap>(initialEntityMap);
    const [collisionMap, setCollisionMap] = useState<boolean[]>(new Array(cellsX * cellsY).fill(false));

    const [collisionMode, setCollisionMode] = useState<'add' | 'remove' | null>(null);

    const triggerMouseOver = (index: number) => {
        if (collisionMode === null) return;
        if (collisionMode === 'add') {
            setCollisionMap(prev => {
                const newCollision = [...prev];
                newCollision[index] = true;
                return newCollision;
            });
        } else if (collisionMode === 'remove') {
            setCollisionMap(prev => {
                const newCollision = [...prev];
                newCollision[index] = false;
                return newCollision;
            });
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'a':
                    setCollisionMode('add');
                    break;
                case 'd':
                    setCollisionMode('remove');
                    break;
                case 's':
                    setCollisionMode(null);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleSaveMap = () => {
        const newMap = calculateNewEntityMap(collisionMap, entityMap, Wall);
        setEntityMap(newMap);
        sendMapToServer(newMap)
    }

    useEffect(() => {
        console.log("the current map is ", entityMap);
    }, [entityMap]);

    return (
        <>
            <button className="flex" onClick={handleSaveMap}>
                Save Map
            </button>
            <div
                className="grid-container"
                style={{
                    background: `url('../../src/assets/wallsMap.png')`,
                    maxHeight: "100vh",
                    maxWidth: "100vw",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: `repeat(${cellsX}, ${CHUNK_SIZE}px)`,
                    gridTemplateRows: `repeat(${cellsY}, ${CHUNK_SIZE}px)`,
                    gap: "1px",
                }}
            >
                {Array.from({ length: cellsX * cellsY }).map((_, index) => (
                    <div
                        key={index}
                        className="grid-cell"
                        style={{
                            width: `${CHUNK_SIZE}px`,
                            height: `${CHUNK_SIZE}px`,
                            backgroundColor: collisionMap[index] ? "black" : "#fff",
                            border: "1px solid #ccc",
                            opacity: collisionMap[index] ? 0.8 : 0,
                        }}
                        onMouseOver={() => triggerMouseOver(index)}
                    />
                ))}

            </div>
        </>
    );
};

export default MapCreator;
