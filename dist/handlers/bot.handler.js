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
exports.startHandler = exports.messageHandler = void 0;
const user_repository_1 = require("./../repositories/user.repository");
const preData = {};
function messageHandler(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const telegramId = (_b = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) !== null && _b !== void 0 ? _b : '';
        let user = yield (0, user_repository_1.getUserByTelegramId)(telegramId);
        if (!user && !preData[telegramId]) {
            ctx.reply(`Hola ${(_c = ctx.from) === null || _c === void 0 ? void 0 : _c.first_name}! Soy PlumIA, tu asistente virtual. 🤖`);
            ctx.reply(`Parece que es la primera vez que nos vemos.  Antes de comenzar a utilizar PlumIA, ¡solo necesitamos un par de datos de tu parte!`);
            ctx.reply(`¿Cuál es el modelo de tu auto? 🚗`);
            preData[telegramId] = { state: 'registering', steps: [{ step: 'carModel', data: null }] };
            return;
        }
        if (!user && preData[telegramId] && preData[telegramId].state === 'registering') {
            const steps = preData[telegramId].steps;
            const currentStep = steps.at(-1);
            if ((currentStep === null || currentStep === void 0 ? void 0 : currentStep.step) === 'carModel' && !currentStep.data) {
                const carModel = (_d = ctx.text) !== null && _d !== void 0 ? _d : '';
                currentStep.data = carModel;
                ctx.reply(`¿Cuál es la matrícula de tu auto? 🆔`);
                steps.push({ step: 'carPlate', data: null });
                return;
            }
            if ((currentStep === null || currentStep === void 0 ? void 0 : currentStep.step) === 'carPlate' && !currentStep.data) {
                const carPlate = (_e = ctx.text) !== null && _e !== void 0 ? _e : '';
                currentStep.data = carPlate;
                console.log('preData', JSON.stringify(preData, null, 2));
                ctx.reply(`Auto registrado correctamente! 🎉`);
                delete preData[telegramId];
                return;
            }
        }
        if (!user) {
            ctx.reply('Parece que ha ocurrido un error. Por favor, intenta nuevamente.');
        }
    });
}
exports.messageHandler = messageHandler;
function startHandler(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const telegramId = (_b = (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id.toString()) !== null && _b !== void 0 ? _b : '';
        let user = yield (0, user_repository_1.getUserByTelegramId)(telegramId);
        if (!user) {
            ctx.reply(`Hola ${(_c = ctx.from) === null || _c === void 0 ? void 0 : _c.first_name}! Soy PlumIA, tu asistente virtual. 🤖`);
            ctx.reply(`Parece que es la primera vez que nos vemos.  Antes de comenzar a utilizar PlumIA, ¡solo necesitamos un par de datos de tu parte!`);
            ctx.reply(`¿Cuál es el modelo de tu auto? 🚗`);
            preData[telegramId] = { state: 'registering', steps: [{ step: 'carModel', data: '' }] };
        }
    });
}
exports.startHandler = startHandler;
