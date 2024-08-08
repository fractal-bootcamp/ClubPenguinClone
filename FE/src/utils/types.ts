
export type Penguin = {
    id: string,
    email: string,
    name: string,
    color: string,
    currentPos: [number, number],
    // orientation: 'N' | 'E' | 'S' | 'W' | 'NE' | 'SE' | 'SW' | 'NW',
    clickDestPos: [number, number] | null,
    clickOriginPos: [number, number] | null
    arrowKeyPressed: string | null
    currentRoom: string // room id
}

export type WallCorner = {
    x: number,
    y: number
}

export type Wall = WallCorner[]

export type Entity = {
    name: string,
    blocking: boolean,
    onCollisionActions: (() => void)[],
}

export const Wall: Entity = {
    name: 'wall',
    blocking: true,
    onCollisionActions: []
}

export type EntityMapCell = {
    x: number,
    y: number,
    entities: Entity[]
}

export type EntityMap = EntityMapCell[]