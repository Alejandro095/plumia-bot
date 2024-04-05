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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
function call(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let query = {
                model: "gpt-3.5-turbo",
                max_tokens: 100,
                temperature: 1,
                messages: [
                    {
                        role: "system",
                        content: "Tu eres un bot de telegram encargado de casetas de cobro, te encargaras de responder a los usuarios que soliciten informacion sobre las casetas de cobro"
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            };
            const client = new openai_1.default({
                apiKey: process.env.OPENAI_API_KEY
            });
            const response = yield client.completions.create({
                model: query.model,
                prompt: query.messages.map((message) => `${message.role}: ${message.content}`).join('\n'),
                max_tokens: query.max_tokens,
                temperature: query.temperature
            });
            return response.choices[0].text;
        }
        catch (error) {
            console.error(error);
            return "Error";
        }
    });
}
exports.default = call;
