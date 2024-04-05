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
exports.getBySpotId = exports.getById = void 0;
const postgres_1 = require("@vercel/postgres");
function getById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let { rows, rowCount } = yield (0, postgres_1.sql) `SELECT * FROM malls WHERE id = ${id} LIMIT 1;`;
        return rowCount == 0 ? null : rows[0];
    });
}
exports.getById = getById;
function getBySpotId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let { rows, rowCount } = yield (0, postgres_1.sql) `SELECT M.* FROM spots S INNER JOIN malls M ON S.mallid = M.id WHERE S.id = ${Number(id !== null && id !== void 0 ? id : 0)} LIMIT 1;`;
        return rowCount == 0 ? null : rows[0];
    });
}
exports.getBySpotId = getBySpotId;
