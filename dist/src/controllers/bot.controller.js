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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFinishMessage = exports.sendWelcomeMessage = void 0;
const UserRepositoy = __importStar(require("./../repositories/user.repository"));
const VisitRepository = __importStar(require("./../repositories/visits.repository"));
const get_time_diff_in_hours_utils_1 = __importDefault(require("./../utils/get-time-diff-in-hours.utils"));
function sendWelcomeMessage(bot, licensePlate, visit) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let user = yield UserRepositoy.getUserByLicensePlate(licensePlate);
        if (!user || !user.telegramid) {
            return { error: true, message: "Error while retrieving the user information." };
        }
        let visitDetail = yield VisitRepository.getDetail((_a = visit.id) !== null && _a !== void 0 ? _a : '');
        if (!visitDetail) {
            return { error: true, message: "Error while retrieving the detail." };
        }
        let message = `¡Hey, hola ${user.name}! 👋 \n\n`;
        message += `Bienvenido a ${visitDetail.mall}, que disfrutes tu estancia.\n\n`;
        message += `Recuerda que los costos son los siguientes:\n`;
        message += `1. Costo por hora: ${visitDetail.cost} mxn\n\n`;
        message += `A continuación te mando la ubicación de tu lugar de estacionamiento.\n\n`;
        yield bot.telegram.sendMessage(user.telegramid, message);
        yield bot.telegram.sendLocation(user.telegramid, visitDetail.latitude, visitDetail.longitude);
        yield bot.telegram.sendMessage(user.telegramid, `Si necesitas algo más, solo dime! 🚀 ¡Que tengas un excelente genial! 🎉`);
        return { error: false, message: "Message sent successfully", data: true };
    });
}
exports.sendWelcomeMessage = sendWelcomeMessage;
function sendFinishMessage(bot, licensePlate, visit) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        let user = yield UserRepositoy.getUserByLicensePlate(licensePlate);
        if (!user || !user.telegramid) {
            return { error: true, message: "Error while retrieving the user information." };
        }
        let visitDetail = yield VisitRepository.getDetail((_a = visit.id) !== null && _a !== void 0 ? _a : '');
        if (!visitDetail) {
            return { error: true, message: "Error while retrieving the detail." };
        }
        yield bot.telegram.sendMessage(user.telegramid, `¡Hasta la próxima ${user.name}! Ahora te enviaré el costo de tu estadía, que será cargado a tu cuenta configurada. 💳`);
        let durationInHours = (0, get_time_diff_in_hours_utils_1.default)(visit.initialdate, (_b = visit.finaldate) !== null && _b !== void 0 ? _b : new Date());
        yield bot.telegram.sendMessage(user.telegramid, `Duración de la estancia: ${durationInHours} hora${durationInHours > 1 ? 's' : ''}\nCosto por hora: $${visitDetail.cost} mxn\nCosto total: $${visitDetail.cost * durationInHours} mxn`);
        yield bot.telegram.sendMessage(user.telegramid, `¡Espero que hayas disfrutado de tu estancia en ${visitDetail.mall}, que vuelvas pronto! 🏠🌟`);
        return { error: false, message: "Message sent successfully", data: true };
    });
}
exports.sendFinishMessage = sendFinishMessage;
