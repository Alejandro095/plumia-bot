import { sql } from "@vercel/postgres";

async function populateDatabase() {
    // Limpiar la base de datos
    await sql`
        TRUNCATE TABLE visits RESTART IDENTITY CASCADE;
    `;
    await sql`
        TRUNCATE TABLE spots RESTART IDENTITY CASCADE;
    `;
    await sql`
        TRUNCATE TABLE malls RESTART IDENTITY CASCADE;
    `;
    await sql`
        TRUNCATE TABLE vehicles RESTART IDENTITY CASCADE;
    `;
    await sql`
        TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    `;

    // Insertar datos de prueba
    await sql`
        INSERT INTO admins(name, email, password, roleid) VALUES ('Alejandro', 'alex@plumia.mx', 'pass', 1);
    `;

    await sql`
        INSERT INTO users(name, lastname, telegramid, roleid) VALUES ('Alejandro', 'Tovar', '6355799228', 2);
    `;

    await sql`
        INSERT INTO vehicles(userid, name, licenseplate) VALUES (1, 'Aveo', 'ABC123');
    `;

    await sql`
        INSERT INTO malls(userid, name, cost, information) VALUES (1, 'Plaza Centrika', 10, 'Información de Plaza Centrika');
    `;

    await sql`
        INSERT INTO spots(mallid, latitude, longitude, available) VALUES (1, '25.686614', '-100.315292', true), (1, '25.686614', '-100.315292', true), (1, '25.686614', '-100.315292', false);
    `;
}

populateDatabase()
    .then(() => console.log("Database: Ha sido poblada exitosamente."))
    .catch((error) => console.error("Database: Se ha producido un error.\n", error))
    .finally(() => {
        sql.end();
        process.exit(1)
    });