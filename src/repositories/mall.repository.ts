import Mall from "@plumia-bot/types/mall.type";
import { sql } from "@vercel/postgres";

export async function getById(id: string) {
    let { rows, rowCount } = await sql`SELECT * FROM malls WHERE id = ${id} LIMIT 1;`;

    return rowCount == 0 ? null : rows[0];
}

export async function getBySpotId(id: string): Promise<Mall | null> {
    let { rows, rowCount } = await sql`SELECT M.* FROM spots S INNER JOIN malls M ON S.mallid = M.id WHERE S.id = ${Number(id ?? 0)} LIMIT 1;`;

    return rowCount == 0 ? null : rows[0] as Mall;
}