export default interface Spot {
    id: string;
    mallid: string;
    latitude: string;
    longitude: string;
    available: boolean;
}

export interface SpotsAvailable {
    available: boolean;
    free: number;
    total: number;
    spots: Spot[];
}