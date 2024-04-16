import { Context, Markup } from "telegraf";

import { Predata } from "./../types/predata.type";

import getTimeDiffInHours from "./../utils/get-time-diff-in-hours.utils";

import * as UsersRepository from "./../repositories/user.repository";
import * as VisitsRepository from "./../repositories/visits.repository";
import * as MallRepository from "./../repositories/mall.repository";
import * as VehiclesRepository from "./../repositories/vehicles.repositoy";

const preData: Predata = {};

const HELP_ME_MESSAGE = '🆘 ¿Me puedes ayudar con una duda?';
const SHOW_ME_ELAPSED_TIME_MESSAGE = '🔍 Muestrame el tiempo transcurrido'
const ADD_NEW_VEHICLE_MESSAGE = '🚗 Quiero agregar un nuevo vehiculo';
const UPDATE_LICENSE_PLATE_MESSAGE = '🪪 Actualizar la matricula de mi vehiculo';
const COST_PER_HOUR_MESSAGE = '🕒 ¿Cual es la tarifa?';

const options = Markup.keyboard([
    // Markup.button.text(HELP_ME_MESSAGE),
    Markup.button.text(SHOW_ME_ELAPSED_TIME_MESSAGE),
    // Markup.button.text(ADD_NEW_VEHICLE_MESSAGE),
    Markup.button.text(UPDATE_LICENSE_PLATE_MESSAGE),
    Markup.button.text(COST_PER_HOUR_MESSAGE),
]);

export async function messageHandler(ctx: Context) {
    const telegramId = ctx.from?.id.toString() ?? '';

    let user = await UsersRepository.getUserByTelegramId(telegramId);

    // Bievenida a un nuevo usuario por primera vez
    if (!user && !preData[telegramId]) {
        await ctx.reply(`Hola ${ctx.from?.first_name}! Soy PlumIA, tu asistente virtual. 🤖`);

        await ctx.reply(`Parece que es la primera vez que hablamos. Antes de comenzar a utilizar PlumIA ¡solo necesitamos un par de datos de tu parte!`);

        await ctx.reply(`Primero ocupamos saber ¿Cuál es el modelo de tu auto? 🚗`);

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

            await ctx.reply(`Finalmente ¿Cuál es la matrícula de tu auto? 🆔\n\n ¡Importante! Utiliza el formato ABC-123-A o ABC-12-34`);

            steps.push({ step: 'carPlate', data: null });
            return;
        }

        if (currentStep?.step === 'carPlate' && !currentStep.data) {
            const carPlate = (ctx.text ?? '').trim();

            if (!carPlate.match(/^[A-Z]{3}-\d{3}-[A-Z]$/) && !carPlate.match(/^[A-Z]{3}-\d{2}-\d{2}$/)) {
                await ctx.reply('La matrícula no tiene el formato correcto. Por favor, inténtalo de nuevo. 🤔');
                return;
            }

            currentStep.data = carPlate;

            await ctx.reply(`Vehiculo registrado correctamente! 🎉`);

            let vehicleName = preData[telegramId].steps[0].data;
            let vehiclePlate = preData[telegramId].steps[1].data;

            delete preData[telegramId];

            await UsersRepository.createUser({
                name: ctx.from?.first_name ?? '',
                lastname: ctx.from?.last_name ?? '',
                telegramId,
                vehicleName: vehicleName ?? '',
                licenseplate: vehiclePlate ?? ''
            })

            await ctx.reply(`¡Listo! Ahora puedes comenzar a utilizar PlumIA. 🚀`, options);

            return;
        }
    }

    // Proceso de actualizacion de placa
    if (preData[telegramId] && preData[telegramId].state === 'updateLicensePlate') {
        const steps = preData[telegramId].steps;

        const currentStep = steps.at(-1);

        if (currentStep?.step === 'licensePlate' && !currentStep.data) {
            const carPlate = (ctx.text ?? '').trim();

            if (!carPlate.match(/^[A-Z]{3}-\d{3}-[A-Z]$/) && !carPlate.match(/^[A-Z]{3}-\d{2}-\d{2}$/)) {
                await ctx.reply('La matrícula no tiene el formato correcto. Por favor, inténtalo de nuevo. 🤔');
                return;
            }

            currentStep.data = carPlate;

            let user = await UsersRepository.getUserByTelegramId(telegramId);

            let userId = user?.id;

            if (!user || !userId) {
                await ctx.reply('Parece que ha ocurrido un error. 😞 Por favor, inténtalo más tarde.')
                return;
            }

            await VehiclesRepository.updateVehicle(userId, carPlate);

            await ctx.reply(`Matricula actualizada correctamente! 🎉`, options);

            delete preData[telegramId];

            return;
        }
    }

    // Usuario ya registrado, mostar panel de opciones
    if (user) {
        const message = ctx.text ?? '';

        if (message === SHOW_ME_ELAPSED_TIME_MESSAGE) {
            let activeVisit = await VisitsRepository.getAnActiveVisitByUserId(user.id);

            let diffTime = getTimeDiffInHours(activeVisit?.initialdate ?? new Date(), new Date());

            if (activeVisit) {
                await ctx.reply(`Actualmente llevas menos de ${diffTime} hora${diffTime > 1 ? 's' : ''} en tu visita. 🕒`);
            } else {
                await ctx.reply('Al parecer, no te encuentras dentro de un centro comercial. 😞');
            }
            return;
        }

        if (message === COST_PER_HOUR_MESSAGE) {
            let activeVisit = await VisitsRepository.getAnActiveVisitByUserId(user.id);

            let mallId = await MallRepository.getBySpotId(activeVisit?.spotid ?? '');

            if (!mallId) {
                await ctx.reply('Al parecer, no te encuentras dentro de un centro comercial. 😞');
                return;
            }

            await ctx.reply(`El costo minimo es de ${mallId?.cost} MXN por hora`);
            return;
        }

        if (message === UPDATE_LICENSE_PLATE_MESSAGE) {
            preData[telegramId] = { state: 'updateLicensePlate', steps: [{ step: 'licensePlate', data: null }] };

            await ctx.reply(`¿Cuál es la nueva matrícula de tu auto? 🆔\n\n ¡Importante! Utiliza el formato ABC-123-A o ABC-12-34`);

            return;
        }

        await ctx.reply(`¡Hola ${ctx.from?.first_name ?? user.name}! 👋 ¿En qué puedo ayudarte hoy?`);

        await ctx.reply('A continuación te muestro algunas de las opciones que tengo disponibles.', options);
    }

    if (!user) {
        ctx.reply('Parece que ha ocurrido un error. 😞 Por favor, inténtalo más tarde.')
    }
}