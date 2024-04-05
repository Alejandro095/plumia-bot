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
exports.updateAvailability = exports.getSpotsByMallId = void 0;
const postgres_1 = require("@vercel/postgres");
function getSpotsByMallId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let { rows, rowCount } = yield (0, postgres_1.sql) `SELECT * FROM spots WHERE mallid = ${id};`;
        return rowCount == 0 ? null : rows;
    });
}
exports.getSpotsByMallId = getSpotsByMallId;
function updateAvailability(spotId, available) {
    return __awaiter(this, void 0, void 0, function* () {
        let { rowCount } = yield (0, postgres_1.sql) `UPDATE spots SET available = ${available} WHERE id = ${spotId};`;
        return rowCount > 0;
    });
}
exports.updateAvailability = updateAvailability;
