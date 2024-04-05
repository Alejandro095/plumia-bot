export default interface Visit {
    id?: string;
    vehicleid?: string;
    spotid?: string;
    initialdate: Date;
    finaldate?: Date;
}

export interface VisitDetail {
    spotId: string;
    latitude: number;
    longitude: number;
    mall: string;
    cost: number;
    information: string;
}

export interface ActiveVisit {
    visitid: string;
    initialdate: Date;
    finaldate?: Date;
    spotid: string;
    vehicleid: string;
    vehiclename: string;
    licenseplate: string;
    userid: string;
}