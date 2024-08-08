
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


export type EntityCategory = 'wall' | 'penguin' | 'coin' | 'door'

export type Entity = {
    name: EntityCategory,
    blocking: boolean,
    onCollisionActions: (() => void)[],
}

export type EntityMapCell = {
    x: number,
    y: number,
    entities: Entity[]
}

export type EntityMap = EntityMapCell[] 