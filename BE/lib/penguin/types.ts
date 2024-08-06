
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
}