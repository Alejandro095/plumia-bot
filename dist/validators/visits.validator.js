"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const visitSchema = joi_1.default.object({
    licensePlate: joi_1.default.string().trim().required(),
    mallId: joi_1.default.number().required(),
});
exports.default = visitSchema;
