import express from 'express'
import { Telegraf } from "telegraf";

import * as BotHandlers from './handlers/bot.handler';
import * as VisitsHandlers from './handlers/visits.handler';
import * as SpotsHandlers from './handlers/spots.handler'

import validator, { validatorMiddleware } from './validators';
import visitSchema from './validators/visits.validator';
import availableSchema from './validators/spot.validatos';

async function bootstrap() {
    try {
        if (!process.env.BOT_TOKEN || !process.env.WEBHOOK_DOMAIN || !process.env.PORT) {
            throw new Error("Please provide BOT_TOKEN, WEBHOOK_DOMAIN and PORT in .env file");
        }

        const bot = new Telegraf(process.env.BOT_TOKEN);
        const app = express();

        // Middlewares
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }))

        // Iniciar el bot
        if (process.env.ENVIROMENT === "development") {
            bot.launch();
        } else {
            app.use(await bot.createWebhook({
                domain: process.env.WEBHOOK_DOMAIN,
            }));
        }

        // Asignar los manejadores de eventos del bot
        bot.command('/start', BotHandlers.messageHandler);
        bot.on("message", BotHandlers.messageHandler);

        // Rutas del recurso de visitas
        app.post('/api/visit/arrived', validator.body(visitSchema), VisitsHandlers.arrivedHandler(bot)) // Cuando el visitante llega
        app.post('/api/visit/departed', validator.body(visitSchema), VisitsHandlers.departedHandler(bot)) // Cuando el visitante se va

        // Ruta para el recurso de espacios libres
        app.get('/api/spots/available', validator.query(availableSchema), SpotsHandlers.availableHandler(bot)) // Consultar espacios disponibles en un centro comercial

        // Middleware para manejar errores de validación
        app.use(validatorMiddleware);

        // Iniciar el servidor
        app.listen(process.env.PORT, () => {
            console.log(`Server is running.`);
        });
    } catch (error) {
        console.error(error);
    }
}

bootstrap();