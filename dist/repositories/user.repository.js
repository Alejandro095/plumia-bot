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
exports.createUser = exports.getUserByLicensePlate = exports.getUserByTelegramId = void 0;
const postgres_1 = require("@vercel/postgres");
function getUserByTelegramId(telegramId) {
    return __awaiter(this, void 0, void 0, function* () {
        let { rows, rowCount } = yield (0, postgres_1.sql) `SELECT * FROM users WHERE roleid = 2 AND telegramid = ${telegramId} LIMIT 1;`;
        return rowCount == 0 ? null : rows[0];
    });
}
exports.getUserByTelegramId = getUserByTelegramId;
function getUserByLicensePlate(licensePlate) {
    return __awaiter(this, void 0, void 0, function* () {
        let { rows, rowCount } = yield (0, postgres_1.sql) `SELECT u.* FROM vehicles V INNER JOIN users U ON V.userid = U.id WHERE V.licenseplate = ${licensePlate};`;
        return rowCount == 0 ? null : rows[0];
    });
}
exports.getUserByLicensePlate = getUserByLicensePlate;
function createUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ name, lastname, telegramId, vehicleName, licenseplate }) {
        let { rows } = yield (0, postgres_1.sql) `INSERT INTO users (name, lastname, telegramid, roleid) VALUES (${name}, ${lastname}, ${telegramId}, 2) RETURNING *;`;
        if (rows.length == 0 || !rows[0].id) {
            return null;
        }
        let userId = rows[0].id;
        let { rows: rows2 } = yield (0, postgres_1.sql) `INSERT INTO vehicles (userid, name, licenseplate) VALUES (${userId}, ${vehicleName}, ${licenseplate}) RETURNING *;`;
        if (rows2.length == 0) {
            return null;
        }
        return true;
    });
}
exports.createUser = createUser;
