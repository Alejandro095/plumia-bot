"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.availableHandler = void 0;
const SpotsController = __importStar(require("./../controllers/spots.controller"));
const MallRepository = __importStar(require("./../repositories/mall.repository"));
function availableHandler(bot) {
    return (request, response) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        let mallId = (_b = (_a = request.query.mallId) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
        let mall = yield MallRepository.getById(mallId);
        let availableSpots = yield SpotsController.getAvailableSpots(mallId);
        if (!mall || availableSpots.error) {
            response.status(404).json({ message: "Resource not found" });
            return;
        }
        response.status(200).json({
            mall: mall.name,
            available: (_c = availableSpots.data) === null || _c === void 0 ? void 0 : _c.available,
            free: (_d = availableSpots.data) === null || _d === void 0 ? void 0 : _d.free,
            total: (_e = availableSpots.data) === null || _e === void 0 ? void 0 : _e.total
        });
    });
}
exports.availableHandler = availableHandler;
