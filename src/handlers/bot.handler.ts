import { Context } from "telegraf";

import { Predata } from "@plumia-bot/types/predata.type";
import { getUserByTelegramId } from "./../repositories/user.repository";

const preData: Predata = {};

export async function messageHandler(ctx: Context) {
    const telegramId = ctx.from?.id.toString() ?? '';

    let user = await getUserByTelegramId(telegramId);

    if (!user && !preData[telegramId]) {
        ctx.reply(`Hola ${ctx.from?.first_name}! Soy PlumIA, tu asistente virtual. 🤖`);

        ctx.reply(`Parece que es la primera vez que nos vemos.  Antes de comenzar a utilizar PlumIA, ¡solo necesitamos un par de datos de tu parte!`);

        ctx.reply(`¿Cuál es el modelo de tu auto? 🚗`);

        preData[telegramId] = { state: 'registering', steps: [{ step: 'carModel', data: null }]};
        return;
    }

    if (!user && preData[telegramId] && preData[telegramId].state === 'registering') {
        const steps = preData[telegramId].steps;

        const currentStep = steps.at(-1);

        if (currentStep?.step === 'carModel' && !currentStep.data) {
            const carModel = ctx.text ?? '';

            currentStep.data = carModel;

            ctx.reply(`¿Cuál es la matrícula de tu auto? 🆔`);

            steps.push({ step: 'carPlate', data: null });
            return;
        }

        if (currentStep?.step === 'carPlate' && !currentStep.data) {
            const carPlate = ctx.text ?? '';

            currentStep.data = carPlate;

            console.log('preData', JSON.stringify(preData, null, 2));

            ctx.reply(`Auto registrado correctamente! 🎉`);

            delete preData[telegramId];

            return;
        }
    }

    if (!user) {
        ctx.reply('Parece que ha ocurrido un error. Por favor, intenta nuevamente.')
    }
}

export async function startHandler(ctx: Context) {
    const telegramId = ctx.from?.id.toString() ?? '';

    let user = await getUserByTelegramId(telegramId);

    if (!user) {
        ctx.reply(`Hola ${ctx.from?.first_name}! Soy PlumIA, tu asistente virtual. 🤖`);

        ctx.reply(`Parece que es la primera vez que nos vemos.  Antes de comenzar a utilizar PlumIA, ¡solo necesitamos un par de datos de tu parte!`);

        ctx.reply(`¿Cuál es el modelo de tu auto? 🚗`);

        preData[telegramId] = { state: 'registering', steps: [{ step: 'carModel', data: '' }]};
    }
}