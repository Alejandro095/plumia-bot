import { Telegraf } from "telegraf";
import { message } from 'telegraf/filters';
import { randomBytes } from 'crypto'

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.on(message("text"), ctx => ctx.reply("Hello"));

// Start webhook via launch method (preferred)
if (process.env.ENVIROMENT === "development") {
    bot.launch();
} else {
    bot.launch({
        webhook: {
            domain: process.env.WEBHOOK_DOMAIN!,
            port: Number(process.env.PORT) || 3000,
            secretToken: randomBytes(64).toString("hex"),
        },
    }, () => console.log("Bot is running"));
}