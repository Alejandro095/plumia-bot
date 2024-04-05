import Spot from "@plumia-bot/types/spot.type";
import { sql } from "@vercel/postgres";

export async function getSpotsByMallId(id: string): Promise<Spot[] | null> {
    let { rows, rowCount } = await sql`SELECT * FROM spots WHERE mallid = ${id};`;

    return rowCount == 0 ? null : rows as Spot[];
}

export async function updateAvailability(spotId: string, available: boolean): Promise<boolean> {
    let { rowCount } = await sql`UPDATE spots SET available = ${available} WHERE id = ${spotId};`;

    return rowCount > 0;
}