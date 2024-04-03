import { sql } from "@vercel/postgres";

export async function getUserByTelegramId(telegramId: string) {
    let { rows, rowCount } = await sql`SELECT * FROM users WHERE roleid = 2 AND telegramid = ${telegramId} LIMIT 1;`;

    return rowCount == 0 ? null : rows[0];
}