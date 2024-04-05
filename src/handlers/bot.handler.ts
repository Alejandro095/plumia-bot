import { Context, Markup } from "telegraf";

import { Predata } from "./../types/predata.type";
import { getUserByTelegramId, createUser } from "./../repositories/user.repository";
import { getAnActiveVisitByUserId } from "./../repositories/visits.repository";
import getTimeDiffInHours from "./../utils/get-time-diff-in-hours.utils";
import * as MallRepository from "./../repositories/mall.repository";

const preData: Predata = {};

const SHOW_ME_ELAPSED_TIME_MESSAGE = '🔍 Muestrame el tiempo transcurrido'
const ADD_NEW_VEHICLE_MESSAGE = '🚗 Quiero agregar un nuevo vehiculo';
const HELP_ME_MESSAGE = '🆘 ¿Me puedes ayudar con una duda?';
const COST_PER_HOUR_MESSAGE = '🕒 ¿Cual es la tarifa?';

export async function messageHandler(ctx: Context) {
    const telegramId = ctx.from?.id.toString() ?? '';

    let user = await getUserByTelegramId(telegramId);

    // Bievenida a un nuevo usuario por primera vez
    if (!user && !preData[telegramId]) {
        await ctx.reply(`Hola ${ctx.from?.first_name}! Soy PlumIA, tu asistente virtual. 🤖`);

        await ctx.reply(`Parece que es la primera vez que nos vemos.  Antes de comenzar a utilizar PlumIA, ¡solo necesitamos un par de datos de tu parte!`);

        await ctx.reply(`¿Cuál es el modelo de tu auto? 🚗`);

        preData[telegramId] = { state: 'registering', steps: [{ step: 'carModel', data: null }] };
        return;
    }

    // Proceso de registro de un nuevo usuario
    if (!user && preData[telegramId] && preData[telegramId].state === 'registering') {
        const steps = preData[telegramId].steps;

        const currentStep = steps.at(-1);

        if (currentStep?.step === 'carModel' && !currentStep.data) {
            const carModel = ctx.text ?? '';

            currentStep.data = carModel;

            await ctx.reply(`¿Cuál es la matrícula de tu auto? 🆔`);

            steps.push({ step: 'carPlate', data: null });
            return;
        }

        if (currentStep?.step === 'carPlate' && !currentStep.data) {
            const carPlate = ctx.text ?? '';

            currentStep.data = carPlate;

            await ctx.reply(`Vehiculo registrado correctamente! 🎉`);

            let vehicleName = preData[telegramId].steps[0].data;
            let vehiclePlate = preData[telegramId].steps[1].data;

            delete preData[telegramId];

            await createUser({
                name: ctx.from?.first_name ?? '',
                lastname: ctx.from?.last_name ?? '',
                telegramId,
                vehicleName: vehicleName ?? '',
                licenseplate: vehiclePlate ?? ''
            })
            return;
        }
    }

    // Usuario ya registrado, mostar panel de opciones
    if (user) {
        const message = ctx.text ?? '';

        if (message === SHOW_ME_ELAPSED_TIME_MESSAGE) {
            let activeVisit = await getAnActiveVisitByUserId(user.id);

            let diffTime = getTimeDiffInHours(activeVisit?.initialdate ?? new Date(), new Date());

            if (activeVisit) {
                await ctx.reply(`Actualmente llevas menos de ${diffTime} hora${diffTime > 1 ? 's' : ''} en tu visita. 🕒`);
            } else {
                await ctx.reply('Actualmente no tienes ninguna visita activa. 😞');
            }
            return;
        }

        if (message === COST_PER_HOUR_MESSAGE) {
            let activeVisit = await getAnActiveVisitByUserId(user.id);

            let mallId = await MallRepository.getBySpotId(activeVisit?.spotid ?? '');

            if (!mallId) {
                await ctx.reply('No se ha podido encontrar el centro comercial asociado al lugar de estacionamiento. 😞');
                return;
            }

            await ctx.reply(`El costo minimo es de ${mallId?.cost} MXN por hora`);
            return;
        }

        if (message === ADD_NEW_VEHICLE_MESSAGE) {
            await ctx.reply('¡Claro! 🚗');
            return;
        }

        if (message === HELP_ME_MESSAGE) {
            await ctx.reply('¡Claro! 🆘');
            return;
        }

        await ctx.reply(`¡Hola ${ctx.from?.first_name ?? user.name}! 👋 ¿En qué puedo ayudarte hoy?`);

        await ctx.reply('A continuación te muestro algunas de las opciones que tengo disponibles.', Markup.keyboard([
            Markup.button.text(SHOW_ME_ELAPSED_TIME_MESSAGE),
            Markup.button.text(ADD_NEW_VEHICLE_MESSAGE),
            Markup.button.text(COST_PER_HOUR_MESSAGE),
            Markup.button.text(HELP_ME_MESSAGE),
        ]));
    }

    if (!user) {
        ctx.reply('Parece que ha ocurrido un error. 😞 Por favor, inténtalo más tarde.')
    }
}