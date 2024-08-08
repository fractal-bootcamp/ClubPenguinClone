import React, { useEffect, useState } from "react";

const mapsData = [
    {
        "x": 0,
        "y": 0,
        "entities": [{
            "blocking": true,
        }]
    },
    {
        "x": 1,
        "y": 0,
        "entities": []
    },
    {
        "x": 2,
        "y": 0,
        "entities": []
    },
    {
        "x": 3,
        "y": 0,
        "entities": []
    },
    {
        "x": 4,
        "y": 0,
        "entities": []
    },
    {
        "x": 5,
        "y": 0,
        "entities": []
    },
    {
        "x": 6,
        "y": 0,
        "entities": []
    },
    {
        "x": 7,
        "y": 0,
        "entities": []
    },
    {
        "x": 8,
        "y": 0,
        "entities": []
    },
    {
        "x": 9,
        "y": 0,
        "entities": []
    },
    {
        "x": 10,
        "y": 0,
        "entities": []
    },
    {
        "x": 11,
        "y": 0,
        "entities": []
    },
    {
        "x": 12,
        "y": 0,
        "entities": []
    },
    {
        "x": 13,
        "y": 0,
        "entities": []
    },
    {
        "x": 14,
        "y": 0,
        "entities": []
    },
    {
        "x": 15,
        "y": 0,
        "entities": []
    },
    {
        "x": 16,
        "y": 0,
        "entities": [{ blocking: true }]
    },
    {
        "x": 17,
        "y": 0,
        "entities": []
    },
    {
        "x": 18,
        "y": 0,
        "entities": []
    },
    {
        "x": 19,
        "y": 0,
        "entities": []
    },
    {
        "x": 20,
        "y": 0,
        "entities": []
    },
    {
        "x": 21,
        "y": 0,
        "entities": []
    },
    {
        "x": 22,
        "y": 0,
        "entities": []
    },
    {
        "x": 23,
        "y": 0,
        "entities": []
    },
    {
        "x": 24,
        "y": 0,
        "entities": []
    },
    {
        "x": 25,
        "y": 0,
        "entities": []
    },
    {
        "x": 26,
        "y": 0,
        "entities": []
    },
    {
        "x": 27,
        "y": 0,
        "entities": []
    },
    {
        "x": 28,
        "y": 0,
        "entities": []
    },
    {
        "x": 29,
        "y": 0,
        "entities": []
    },
    {
        "x": 30,
        "y": 0,
        "entities": []
    },
    {
        "x": 31,
        "y": 0,
        "entities": []
    },
    {
        "x": 32,
        "y": 0,
        "entities": []
    },
    {
        "x": 33,
        "y": 0,
        "entities": []
    },
    {
        "x": 34,
        "y": 0,
        "entities": []
    },
    {
        "x": 35,
        "y": 0,
        "entities": []
    },
    {
        "x": 36,
        "y": 0,
        "entities": []
    },
    {
        "x": 37,
        "y": 0,
        "entities": []
    },
    {
        "x": 38,
        "y": 0,
        "entities": []
    },
    {
        "x": 39,
        "y": 0,
        "entities": []
    },
    {
        "x": 40,
        "y": 0,
        "entities": []
    },
    {
        "x": 41,
        "y": 0,
        "entities": []
    },
    {
        "x": 42,
        "y": 0,
        "entities": []
    },
    {
        "x": 43,
        "y": 0,
        "entities": []
    },
    {
        "x": 44,
        "y": 0,
        "entities": []
    },
    {
        "x": 45,
        "y": 0,
        "entities": []
    },
    {
        "x": 46,
        "y": 0,
        "entities": []
    },
    {
        "x": 47,
        "y": 0,
        "entities": []
    },
    {
        "x": 48,
        "y": 0,
        "entities": []
    },
    {
        "x": 49,
        "y": 0,
        "entities": []
    },
    {
        "x": 50,
        "y": 0,
        "entities": []
    },
    {
        "x": 51,
        "y": 0,
        "entities": []
    },
    {
        "x": 52,
        "y": 0,
        "entities": []
    },
    {
        "x": 53,
        "y": 0,
        "entities": []
    },
    {
        "x": 54,
        "y": 0,
        "entities": []
    },
    {
        "x": 55,
        "y": 0,
        "entities": []
    },
    {
        "x": 56,
        "y": 0,
        "entities": []
    },
    {
        "x": 57,
        "y": 0,
        "entities": []
    },
    {
        "x": 58,
        "y": 0,
        "entities": []
    },
    {
        "x": 59,
        "y": 0,
        "entities": []
    },
    {
        "x": 60,
        "y": 0,
        "entities": []
    },
    {
        "x": 61,
        "y": 0,
        "entities": []
    },
    {
        "x": 62,
        "y": 0,
        "entities": []
    },
    {
        "x": 63,
        "y": 0,
        "entities": []
    },
    {
        "x": 64,
        "y": 0,
        "entities": []
    },
    {
        "x": 65,
        "y": 0,
        "entities": []
    },
    {
        "x": 66,
        "y": 0,
        "entities": []
    },
    {
        "x": 67,
        "y": 0,
        "entities": []
    },
    {
        "x": 68,
        "y": 0,
        "entities": []
    },
    {
        "x": 69,
        "y": 0,
        "entities": []
    },
    {
        "x": 70,
        "y": 0,
        "entities": []
    },
    {
        "x": 71,
        "y": 0,
        "entities": []
    },
    {
        "x": 72,
        "y": 0,
        "entities": []
    },
    {
        "x": 73,
        "y": 0,
        "entities": []
    },
    {
        "x": 74,
        "y": 0,
        "entities": []
    },
    {
        "x": 75,
        "y": 0,
        "entities": []
    },
    {
        "x": 76,
        "y": 0,
        "entities": []
    },
    {
        "x": 77,
        "y": 0,
        "entities": []
    },
    {
        "x": 78,
        "y": 0,
        "entities": []
    },
    {
        "x": 79,
        "y": 0,
        "entities": []
    },
    {
        "x": 80,
        "y": 0,
        "entities": []
    },
    {
        "x": 81,
        "y": 0,
        "entities": []
    },
    {
        "x": 82,
        "y": 0,
        "entities": []
    },
    {
        "x": 83,
        "y": 0,
        "entities": []
    },
    {
        "x": 84,
        "y": 0,
        "entities": []
    },
    {
        "x": 85,
        "y": 0,
        "entities": []
    },
    {
        "x": 86,
        "y": 0,
        "entities": []
    },
    {
        "x": 87,
        "y": 0,
        "entities": []
    },
    {
        "x": 88,
        "y": 0,
        "entities": []
    },
    {
        "x": 89,
        "y": 0,
        "entities": []
    },
    {
        "x": 90,
        "y": 0,
        "entities": []
    },
    {
        "x": 91,
        "y": 0,
        "entities": []
    },
    {
        "x": 92,
        "y": 0,
        "entities": []
    },
    {
        "x": 93,
        "y": 0,
        "entities": []
    },
    {
        "x": 94,
        "y": 0,
        "entities": []
    },
    {
        "x": 95,
        "y": 0,
        "entities": []
    },
    {
        "x": 96,
        "y": 0,
        "entities": []
    },
    {
        "x": 97,
        "y": 0,
        "entities": []
    },
    {
        "x": 98,
        "y": 0,
        "entities": []
    },
    {
        "x": 99,
        "y": 0,
        "entities": []
    },
    {
        "x": 100,
        "y": 0,
        "entities": []
    }]

const map = mapsData.map((cell, index) => {
    return cell.entities.some(entity => entity.blocking)
})





const MapCreator = () => {
    const gridSize = 100; // 100x100 grid
    const [isCollision, setIsCollision] = useState<boolean[]>(map);
    const cellSize = 20; // Size of each cell in pixels

    const [collisionMode, setCollisionMode] = useState<'add' | 'remove' | null>(null);

    const triggerMouseOver = (index: number) => {
        if (collisionMode === null) return;
        if (collisionMode === 'add') {
            setIsCollision(prev => {
                const newCollision = [...prev];
                newCollision[index] = true;
                return newCollision;
            });
        } else if (collisionMode === 'remove') {
            setIsCollision(prev => {
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

    return (
        <div
            className="grid-container"
            style={{
                background: `url('../../src/assets/wallsMap.png')`,
                maxHeight: "100vh",
                maxWidth: "100vw",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
                gap: "1px",
            }}
        >
            {Array.from({ length: gridSize * gridSize }).map((_, index) => (
                <div
                    key={index}
                    className="grid-cell"
                    style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        backgroundColor: isCollision[index] ? "blacka" : "#fff",
                        border: "1px solid #ccc",
                        opacity: isCollision[index] ? 0.8 : 0,
                    }}
                    onMouseOver={() => triggerMouseOver(index)}
                />
            ))}
        </div>
    );
};

export default MapCreator;
