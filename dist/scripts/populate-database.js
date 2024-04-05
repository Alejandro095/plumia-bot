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
function populateDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        // Limpiar la base de datos
        yield (0, postgres_1.sql) `
        TRUNCATE TABLE visits RESTART IDENTITY CASCADE;
    `;
        yield (0, postgres_1.sql) `
        TRUNCATE TABLE spots RESTART IDENTITY CASCADE;
    `;
        yield (0, postgres_1.sql) `
        TRUNCATE TABLE malls RESTART IDENTITY CASCADE;
    `;
        yield (0, postgres_1.sql) `
        TRUNCATE TABLE vehicles RESTART IDENTITY CASCADE;
    `;
        yield (0, postgres_1.sql) `
        TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    `;
        // Insertar datos de prueba
        yield (0, postgres_1.sql) `
        INSERT INTO users(name, lastname, telegramid, roleid) VALUES ('Javier', NULL, NULL, 1);
    `;
        yield (0, postgres_1.sql) `
        INSERT INTO users(name, lastname, telegramid, roleid) VALUES ('Alejandro', 'Tovar', '6355799228', 2);
    `;
        yield (0, postgres_1.sql) `
        INSERT INTO vehicles(userid, name, licenseplate) VALUES (2, 'Aveo', 'ABC123');
    `;
        yield (0, postgres_1.sql) `
        INSERT INTO malls(userid, name, cost, information) VALUES (1, 'Plaza Centrika', 10, 'Información de Plaza Centrika');
    `;
        yield (0, postgres_1.sql) `
        INSERT INTO spots(mallid, latitude, longitude, available) VALUES (1, '25.686614', '-100.315292', true), (1, '25.686614', '-100.315292', true), (1, '25.686614', '-100.315292', false);
    `;
    });
}
populateDatabase()
    .then(() => console.log("Database: Ha sido poblada exitosamente."))
    .catch((error) => console.error("Database: Se ha producido un error.\n", error))
    .finally(() => {
    postgres_1.sql.end();
    process.exit(1);
});
