import { sql } from "@vercel/postgres";
import Visit, { ActiveVisit, VisitDetail } from "./../types/visit.type";

export async function create(visit: Visit): Promise<Visit | null>{
    let { rows, rowCount } = await sql`INSERT INTO visits (vehicleid, spotid, initialdate) VALUES (${visit.vehicleid}, ${visit.spotid}, ${visit.initialdate.toISOString()}) RETURNING *;`;

    return rowCount == 0 ? null : rows[0] as Visit;
}

export async function getDetail(visitId: string): Promise<VisitDetail | null> {
    let { rows, rowCount } = await sql`SELECT S.id AS spotId, S.latitude, S.longitude, M.name AS mall, M.cost, M.information FROM visits V INNER JOIN spots S ON V.spotid = S.id INNER JOIN public.malls M on S.mallid = M.id WHERE V.id = ${visitId};`;

    return rowCount == 0 ? null : rows[0] as VisitDetail;
}

export async function getAnActiveVisit(licensePlate: string): Promise<ActiveVisit | null> {
    let { rowCount, rows } = await sql`SELECT V.id AS visitid, V.initialdate, V.finaldate, V.spotid, VEH.id AS vehicleid, VEH.name AS vehiclename, VEH.licenseplate, VEH.userid FROM visits V INNER JOIN vehicles VEH ON V.vehicleid = VEH.id WHERE VEH.licenseplate = ${licensePlate} AND V.finaldate IS NULL;`;

    return rowCount == 0 ? null : rows[0] as ActiveVisit;
}

export async function getAnActiveVisitByUserId(userId: string): Promise<ActiveVisit | null> {
    let { rowCount, rows } = await sql`SELECT V.id AS visitid, V.initialdate, V.finaldate, V.spotid, VEH.id AS vehicleid, VEH.name AS vehiclename, VEH.licenseplate, VEH.userid FROM visits V INNER JOIN vehicles VEH ON V.vehicleid = VEH.id WHERE VEH.userid = ${userId} AND V.finaldate IS NULL;`;

    return rowCount == 0 ? null : rows[0] as ActiveVisit;
}


export async function updateFinalDate(visitId: string, initialdate: Date): Promise<Visit | null> {
    let { rowCount, rows } = await sql`UPDATE visits SET finaldate = ${initialdate.toISOString()} WHERE id = ${visitId} RETURNING *;`;

    return rowCount == 0 ? null : rows[0] as Visit;
}