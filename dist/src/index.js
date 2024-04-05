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
const express_1 = __importDefault(require("express"));
const telegraf_1 = require("telegraf");
const BotHandlers = __importStar(require("./handlers/bot.handler"));
const VisitsHandlers = __importStar(require("./handlers/visits.handler"));
const SpotsHandlers = __importStar(require("./handlers/spots.handler"));
const validators_1 = __importStar(require("./validators"));
const visits_validator_1 = __importDefault(require("./validators/visits.validator"));
const spot_validatos_1 = __importDefault(require("./validators/spot.validatos"));
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!process.env.BOT_TOKEN || !process.env.WEBHOOK_DOMAIN || !process.env.PORT) {
                throw new Error("Please provide BOT_TOKEN, WEBHOOK_DOMAIN and PORT in .env file");
            }
            const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
            const app = (0, express_1.default)();
            // Middlewares
            app.use(express_1.default.json());
            app.use(express_1.default.urlencoded({ extended: true }));
            // Iniciar el bot
            if (process.env.ENVIROMENT === "development") {
                bot.launch();
            }
            else {
                app.use(yield bot.createWebhook({
                    domain: process.env.WEBHOOK_DOMAIN,
                }));
            }
            // Asignar los manejadores de eventos del bot
            bot.command('/start', BotHandlers.messageHandler);
            bot.on("message", BotHandlers.messageHandler);
            // Rutas del recurso de visitas
            app.post('/api/visit/arrived', validators_1.default.body(visits_validator_1.default), VisitsHandlers.arrivedHandler(bot)); // Cuando el visitante llega
            app.post('/api/visit/departed', validators_1.default.body(visits_validator_1.default), VisitsHandlers.departedHandler(bot)); // Cuando el visitante se va
            // Ruta para el recurso de espacios libres
            app.get('/api/spots/available', validators_1.default.query(spot_validatos_1.default), SpotsHandlers.availableHandler(bot)); // Consultar espacios disponibles en un centro comercial
            // Middleware para manejar errores de validación
            app.use(validators_1.validatorMiddleware);
            // Iniciar el servidor
            app.listen(process.env.PORT, () => {
                console.log(`Server is running.`);
            });
        }
        catch (error) {
            console.error(error);
        }
    });
}
bootstrap();
