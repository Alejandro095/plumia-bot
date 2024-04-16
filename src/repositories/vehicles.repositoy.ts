import { sql } from "@vercel/postgres";

import Vehicle from "@plumia-bot/types/vehicle.type";

export async function getByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    let { rows, rowCount } = await sql`SELECT * FROM vehicles WHERE licenseplate = ${licensePlate} LIMIT 1;`;

    return rowCount == 0 ? null : rows[0] as Vehicle;
}

export async function updateVehicle(vehicleId: string, licensePlate: string): Promise<boolean> {
    let { rowCount } = await sql`UPDATE vehicles SET licenseplate = ${licensePlate} WHERE id = ${vehicleId};`;

    return rowCount > 0;
}