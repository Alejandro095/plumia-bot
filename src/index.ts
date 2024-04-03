import { Telegraf } from "telegraf";
import { message } from 'telegraf/filters';
import { randomBytes } from 'crypto'

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.on(message("text"), ctx => ctx.reply("Hello"));

bot.launch();