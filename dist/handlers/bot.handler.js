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
exports.messageHandler = void 0;
const telegraf_1 = require("telegraf");
const user_repository_1 = require("./../repositories/user.repository");
const visits_repository_1 = require("./../repositories/visits.repository");
const get_time_diff_in_hours_utils_1 = __importDefault(require("./../utils/get-time-diff-in-hours.utils"));
const MallRepository = __importStar(require("./../repositories/mall.repository"));
const preData = {};
const SHOW_ME_ELAPSED_TIME_MESSAGE = '🔍 Muestrame el tiempo transcurrido';
const ADD_NEW_VEHICLE_MESSAGE = '🚗 Quiero agregar un nuevo vehiculo';
const HELP_ME_MESSAGE = '🆘 ¿Me puedes ayudar con una duda?';
const COST_PER_HOUR_MESSAGE = '🕒 ¿Cual es la tarifa?';
function messageHandler(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const telegramId = (_b = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) !== null && _b !== void 0 ? _b : '';
        let user = yield (0, user_repository_1.getUserByTelegramId)(telegramId);
        // Bievenida a un nuevo usuario por primera vez
        if (!user && !preData[telegramId]) {
            yield ctx.reply(`Hola ${(_c = ctx.from) === null || _c === void 0 ? void 0 : _c.first_name}! Soy PlumIA, tu asistente virtual. 🤖`);
            yield ctx.reply(`Parece que es la primera vez que nos vemos.  Antes de comenzar a utilizar PlumIA, ¡solo necesitamos un par de datos de tu parte!`);
            yield ctx.reply(`¿Cuál es el modelo de tu auto? 🚗`);
            preData[telegramId] = { state: 'registering', steps: [{ step: 'carModel', data: null }] };
            return;
        }
        // Proceso de registro de un nuevo usuario
        if (!user && preData[telegramId] && preData[telegramId].state === 'registering') {
            const steps = preData[telegramId].steps;
            const currentStep = steps.at(-1);
            if ((currentStep === null || currentStep === void 0 ? void 0 : currentStep.step) === 'carModel' && !currentStep.data) {
                const carModel = (_d = ctx.text) !== null && _d !== void 0 ? _d : '';
                currentStep.data = carModel;
                yield ctx.reply(`¿Cuál es la matrícula de tu auto? 🆔`);
                steps.push({ step: 'carPlate', data: null });
                return;
            }
            if ((currentStep === null || currentStep === void 0 ? void 0 : currentStep.step) === 'carPlate' && !currentStep.data) {
                const carPlate = (_e = ctx.text) !== null && _e !== void 0 ? _e : '';
                currentStep.data = carPlate;
                yield ctx.reply(`Vehiculo registrado correctamente! 🎉`);
                let vehicleName = preData[telegramId].steps[0].data;
                let vehiclePlate = preData[telegramId].steps[1].data;
                delete preData[telegramId];
                yield (0, user_repository_1.createUser)({
                    name: (_g = (_f = ctx.from) === null || _f === void 0 ? void 0 : _f.first_name) !== null && _g !== void 0 ? _g : '',
                    lastname: (_j = (_h = ctx.from) === null || _h === void 0 ? void 0 : _h.last_name) !== null && _j !== void 0 ? _j : '',
                    telegramId,
                    vehicleName: vehicleName !== null && vehicleName !== void 0 ? vehicleName : '',
                    licenseplate: vehiclePlate !== null && vehiclePlate !== void 0 ? vehiclePlate : ''
                });
                return;
            }
        }
        // Usuario ya registrado, mostar panel de opciones
        if (user) {
            const message = (_k = ctx.text) !== null && _k !== void 0 ? _k : '';
            if (message === SHOW_ME_ELAPSED_TIME_MESSAGE) {
                let activeVisit = yield (0, visits_repository_1.getAnActiveVisitByUserId)(user.id);
                let diffTime = (0, get_time_diff_in_hours_utils_1.default)((_l = activeVisit === null || activeVisit === void 0 ? void 0 : activeVisit.initialdate) !== null && _l !== void 0 ? _l : new Date(), new Date());
                if (activeVisit) {
                    yield ctx.reply(`Actualmente llevas menos de ${diffTime} hora${diffTime > 1 ? 's' : ''} en tu visita. 🕒`);
                }
                else {
                    yield ctx.reply('Actualmente no tienes ninguna visita activa. 😞');
                }
                return;
            }
            if (message === COST_PER_HOUR_MESSAGE) {
                let activeVisit = yield (0, visits_repository_1.getAnActiveVisitByUserId)(user.id);
                let mallId = yield MallRepository.getBySpotId((_m = activeVisit === null || activeVisit === void 0 ? void 0 : activeVisit.spotid) !== null && _m !== void 0 ? _m : '');
                if (!mallId) {
                    yield ctx.reply('No se ha podido encontrar el centro comercial asociado al lugar de estacionamiento. 😞');
                    return;
                }
                yield ctx.reply(`El costo minimo es de ${mallId === null || mallId === void 0 ? void 0 : mallId.cost} MXN por hora`);
                return;
            }
            if (message === ADD_NEW_VEHICLE_MESSAGE) {
                yield ctx.reply('¡Claro! 🚗');
                return;
            }
            if (message === HELP_ME_MESSAGE) {
                yield ctx.reply('¡Claro! 🆘');
                return;
            }
            yield ctx.reply(`¡Hola ${(_p = (_o = ctx.from) === null || _o === void 0 ? void 0 : _o.first_name) !== null && _p !== void 0 ? _p : user.name}! 👋 ¿En qué puedo ayudarte hoy?`);
            yield ctx.reply('A continuación te muestro algunas de las opciones que tengo disponibles.', telegraf_1.Markup.keyboard([
                telegraf_1.Markup.button.text(SHOW_ME_ELAPSED_TIME_MESSAGE),
                telegraf_1.Markup.button.text(ADD_NEW_VEHICLE_MESSAGE),
                telegraf_1.Markup.button.text(COST_PER_HOUR_MESSAGE),
                telegraf_1.Markup.button.text(HELP_ME_MESSAGE),
            ]));
        }
        if (!user) {
            ctx.reply('Parece que ha ocurrido un error. 😞 Por favor, inténtalo más tarde.');
        }
    });
}
exports.messageHandler = messageHandler;
