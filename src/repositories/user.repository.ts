import User from "@plumia-bot/types/user.type";
import { sql } from "@vercel/postgres";

export async function getUserByTelegramId(telegramId: string): Promise<User | null> {
    let { rows, rowCount } = await sql`SELECT * FROM users WHERE roleid = 2 AND telegramid = ${telegramId} LIMIT 1;`;

    return rowCount == 0 ? null : rows[0] as User;
}

export async function getUserByLicensePlate(licensePlate: string): Promise<User | null> {
    let { rows, rowCount } = await sql`SELECT u.* FROM vehicles V INNER JOIN users U ON V.userid = U.id WHERE V.licenseplate = ${licensePlate};`;

    return rowCount == 0 ? null : rows[0] as User;
}

export async function createUser({ name, lastname, telegramId, vehicleName, licenseplate }: { name: string, lastname: string, telegramId: string, vehicleName: string, licenseplate: string }) {
    let { rows } = await sql`INSERT INTO users (name, lastname, telegramid, roleid) VALUES (${name}, ${lastname}, ${telegramId}, 2) RETURNING *;`;

    if (rows.length == 0 || !rows[0].id) {
        return null;
    }

    let userId = rows[0].id;

    let { rows: rows2 } = await sql`INSERT INTO vehicles (userid, name, licenseplate) VALUES (${userId}, ${vehicleName}, ${licenseplate}) RETURNING *;`;

    if (rows2.length == 0) {
        return null;
    }

    return true;
}