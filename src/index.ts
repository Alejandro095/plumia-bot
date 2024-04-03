import express from 'express'
import { Context, Telegraf } from "telegraf";
import * as BotHandlers from './handlers/bot.handler';

async function bootstrap() {
    try {
        if (!process.env.BOT_TOKEN || !process.env.WEBHOOK_DOMAIN || !process.env.PORT) {
            throw new Error("Please provide BOT_TOKEN, WEBHOOK_DOMAIN and PORT in .env file");
        }

        const bot = new Telegraf(process.env.BOT_TOKEN);
        const app = express()

        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))

        if (process.env.ENVIROMENT === "development") {
            bot.launch();
        } else {
            app.use(await bot.createWebhook({
                domain: process.env.WEBHOOK_DOMAIN,
            }));
        }

        bot.command('/start', BotHandlers.messageHandler);
        bot.on("message", BotHandlers.messageHandler);

        app.listen(process.env.PORT, () => {
            console.log(`Server is running.`);
        });
    } catch (error) {
        console.error(error);
    }
}

bootstrap();

// import { Telegraf } from "telegraf";
// import { message } from 'telegraf/filters';

// const bot = new Telegraf(process.env.BOT_TOKEN!);

// bot.on(message("text"), ctx => ctx.reply("Hello"));

// // Start webhook via launch method (preferred)
// if (process.env.ENVIROMENT === "development") {
//     bot.launch();
// } else {
//     bot.launch({
//         webhook: {1
//             domain: process.env.WEBHOOK_DOMAIN!,
//             port: Number(process.env.PORT),
//         },
//     }, () => console.log("Bot is running"));
// }