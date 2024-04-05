"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTimeDiffInHours(initialDate, finalDate) {
    return Math.ceil(((new Date(finalDate)).getTime() - (new Date(initialDate)).getTime()) / 3600000);
    ;
}
exports.default = getTimeDiffInHours;
