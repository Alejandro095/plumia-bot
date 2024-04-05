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
exports.departedHandler = exports.arrivedHandler = void 0;
const VisitsController = __importStar(require("./../controllers/visits.controller"));
const BotController = __importStar(require("./../controllers/bot.controller"));
function arrivedHandler(bot) {
    return (request, response) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        let { licensePlate, mallId } = request.body;
        let visit = yield VisitsController.createVisit(licensePlate, mallId);
        if (!visit || visit.error || !visit.data) {
            return response.status(400).json({ error: true, message: (_a = visit.message) !== null && _a !== void 0 ? _a : "Error creating visit" });
        }
        yield BotController.sendWelcomeMessage(bot, licensePlate, visit.data);
        response.status(200).json({ error: false, message: "Visit created successfully" });
    });
}
exports.arrivedHandler = arrivedHandler;
function departedHandler(bot) {
    return (request, response) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        let { licensePlate, mallId } = request.body;
        let visit = yield VisitsController.finishVisit(licensePlate, mallId);
        if (!visit || visit.error || !visit.data) {
            return response.status(400).json({ error: true, message: (_a = visit.message) !== null && _a !== void 0 ? _a : "Error" });
        }
        yield BotController.sendFinishMessage(bot, licensePlate, visit.data);
        response.status(200).json({ error: false, message: "Visit finished successfully" });
    });
}
exports.departedHandler = departedHandler;
