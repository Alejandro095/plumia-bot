"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = require("@vercel/postgres");
function createDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS Visits;
    `;
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS Spots;
    `;
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS Malls;
    `;
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS Vehicles;
    `;
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS Users;
    `;
        yield (0, postgres_1.sql) `
        DROP TABLE IF EXISTS Roles;
    `;
        yield (0, postgres_1.sql) `
        CREATE TABLE Roles (
            id INT GENERATED ALWAYS AS IDENTITY,
            type VARCHAR(5),
            PRIMARY KEY (id)
        );
    `;
        yield (0, postgres_1.sql) `
        INSERT INTO Roles(type) VALUES ('ADMIN'), ('USER');
    `;
        yield (0, postgres_1.sql) `
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
        yield (0, postgres_1.sql) `
        CREATE TABLE Vehicles (
            id INT GENERATED ALWAYS AS IDENTITY,
            userId INT,
            name VARCHAR(100),
            licensePlate VARCHAR(10),
            PRIMARY KEY (id),
            CONSTRAINT fk_vehicles_users FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
        );
    `;
        yield (0, postgres_1.sql) `
        CREATE TABLE Malls(
            id INT GENERATED ALWAYS AS IDENTITY,
            userId INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            cost NUMERIC NOT NULL,
            information TEXT NOT NULL,
            PRIMARY KEY (id),
            CONSTRAINT fk_malls_users FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
        );
    `;
        yield (0, postgres_1.sql) `
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
        yield (0, postgres_1.sql) `
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
    });
}
createDatabase()
    .then(() => console.log("Database: Ha sido creada exitosamente."))
    .catch((error) => console.error("Database: Se ha producido un error durante el proceso de creación.\n", error))
    .finally(() => {
    postgres_1.sql.end();
    process.exit(1);
});
