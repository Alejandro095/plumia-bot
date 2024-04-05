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
exports.updateFinalDate = exports.getAnActiveVisitByUserId = exports.getAnActiveVisit = exports.getDetail = exports.create = void 0;
const postgres_1 = require("@vercel/postgres");
function create(visit) {
    return __awaiter(this, void 0, void 0, function* () {
        let { rows, rowCount } = yield (0, postgres_1.sql) `INSERT INTO visits (vehicleid, spotid, initialdate) VALUES (${visit.vehicleid}, ${visit.spotid}, ${visit.initialdate.toISOString()}) RETURNING *;`;
        return rowCount == 0 ? null : rows[0];
    });
}
exports.create = create;
function getDetail(visitId) {
    return __awaiter(this, void 0, void 0, function* () {
        let { rows, rowCount } = yield (0, postgres_1.sql) `SELECT S.id AS spotId, S.latitude, S.longitude, M.name AS mall, M.cost, M.information FROM visits V INNER JOIN spots S ON V.spotid = S.id INNER JOIN public.malls M on S.mallid = M.id WHERE V.id = ${visitId};`;
        return rowCount == 0 ? null : rows[0];
    });
}
exports.getDetail = getDetail;
function getAnActiveVisit(licensePlate) {
    return __awaiter(this, void 0, void 0, function* () {
        let { rowCount, rows } = yield (0, postgres_1.sql) `SELECT V.id AS visitid, V.initialdate, V.finaldate, V.spotid, VEH.id AS vehicleid, VEH.name AS vehiclename, VEH.licenseplate, VEH.userid FROM visits V INNER JOIN vehicles VEH ON V.vehicleid = VEH.id WHERE VEH.licenseplate = ${licensePlate} AND V.finaldate IS NULL;`;
        return rowCount == 0 ? null : rows[0];
    });
}
exports.getAnActiveVisit = getAnActiveVisit;
function getAnActiveVisitByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let { rowCount, rows } = yield (0, postgres_1.sql) `SELECT V.id AS visitid, V.initialdate, V.finaldate, V.spotid, VEH.id AS vehicleid, VEH.name AS vehiclename, VEH.licenseplate, VEH.userid FROM visits V INNER JOIN vehicles VEH ON V.vehicleid = VEH.id WHERE VEH.userid = ${userId} AND V.finaldate IS NULL;`;
        return rowCount == 0 ? null : rows[0];
    });
}
exports.getAnActiveVisitByUserId = getAnActiveVisitByUserId;
function updateFinalDate(visitId, initialdate) {
    return __awaiter(this, void 0, void 0, function* () {
        let { rowCount, rows } = yield (0, postgres_1.sql) `UPDATE visits SET finaldate = ${initialdate.toISOString()} WHERE id = ${visitId} RETURNING *;`;
        return rowCount == 0 ? null : rows[0];
    });
}
exports.updateFinalDate = updateFinalDate;
