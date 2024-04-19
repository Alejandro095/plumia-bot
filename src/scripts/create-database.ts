import { sql } from "@vercel/postgres";

async function createDatabase() {
    await sql`
        DROP TABLE IF EXISTS Visits;
    `;
    await sql`
        DROP TABLE IF EXISTS Spots;
    `;
    await sql`
        DROP TABLE IF EXISTS Malls;
    `;
    await sql`
        DROP TABLE IF EXISTS Vehicles;
    `;
    await sql`
        DROP TABLE IF EXISTS Users;
    `;
    await sql`
        DROP TABLE IF EXISTS Admins;
    `;
    await sql`
        DROP TABLE IF EXISTS Roles;
    `;

    await sql`
        CREATE TABLE Roles (
            id INT GENERATED ALWAYS AS IDENTITY,
            type VARCHAR(5),
            PRIMARY KEY (id)
        );
    `;
    await sql`
        INSERT INTO Roles(type) VALUES ('ADMIN'), ('USER');
    `;
    await sql`
        CREATE TABLE Users (
            id INT GENERATED ALWAYS AS IDENTITY,
            name VARCHAR(100) NOT NULL,
            lastname VARCHAR(100),
            telegramId varchar(20),
            roleId INT,
            PRIMARY KEY (id),
            CONSTRAINT fk_users_roles FOREIGN KEY(roleId) REFERENCES Roles(id) ON DELETE SET NULL
        );
    `;

    await sql`
        CREATE TABLE Admins (
            id INT GENERATED ALWAYS AS IDENTITY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL,
            roleId INT,
            PRIMARY KEY (id),
            CONSTRAINT fk_admins_roles FOREIGN KEY(roleId) REFERENCES Roles(id) ON DELETE SET NULL
        );
    `;

    await sql`
        CREATE TABLE Vehicles (
            id INT GENERATED ALWAYS AS IDENTITY,
            userId INT,
            name VARCHAR(100),
            licensePlate VARCHAR(10),
            PRIMARY KEY (id),
            CONSTRAINT fk_vehicles_users FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
        );
    `;
    await sql`
        CREATE TABLE Malls(
            id INT GENERATED ALWAYS AS IDENTITY,
            userId INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            cost NUMERIC NOT NULL,
            PRIMARY KEY (id),
            CONSTRAINT fk_malls_admins FOREIGN KEY(userId) REFERENCES Admins(id) ON DELETE CASCADE
        );
    `;
    await sql`
        CREATE TABLE Spots(
            id INT GENERATED ALWAYS AS IDENTITY,
            mallId INT NOT NULL,
            latitude VARCHAR(20),
            longitude VARCHAR(20),
            available BOOLEAN DEFAULT TRUE,
            PRIMARY KEY (id),
            CONSTRAINT fk_spots_malls FOREIGN KEY(mallId) REFERENCES Malls(id) ON DELETE CASCADE
        );
    `;
    await sql`
        CREATE TABLE Visits(
            id INT GENERATED ALWAYS AS IDENTITY,
            vehicleId INT NOT NULL,
            spotId INT NOT NULL,
            initialDate TIMESTAMP WITH TIME ZONE,
            finalDate TIMESTAMP WITH TIME ZONE,
            PRIMARY KEY (id),
            CONSTRAINT fk_visits_vehicles FOREIGN KEY(vehicleId) REFERENCES Vehicles(id) ON DELETE CASCADE,
            CONSTRAINT fk_visits_spots FOREIGN KEY(spotId) REFERENCES Spots(id) ON DELETE CASCADE
        );
    `;
}

createDatabase()
    .then(() => console.log("Database: Ha sido creada exitosamente."))
    .catch((error) => console.error("Database: Se ha producido un error durante el proceso de creación.\n", error))
    .finally(() => {
        sql.end();
        process.exit(1)
    });