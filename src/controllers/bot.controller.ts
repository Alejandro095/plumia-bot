import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

import * as UserRepositoy from "./../repositories/user.repository";
import * as VisitRepository from "./../repositories/visits.repository";

import ControllerResponse from "./../types/controller-response.type";
import Visit from "./../types/visit.type";
import getTimeDiffInHours from "./../utils/get-time-diff-in-hours.utils";

export async function sendWelcomeMessage(bot: Telegraf<Context<Update>>, licensePlate: string, visit: Visit): Promise<ControllerResponse<boolean | null>> {
    let user = await UserRepositoy.getUserByLicensePlate(licensePlate);

    if (!user || !user.telegramid) {
        return { error: true, message: "Error while retrieving the user information." };
    }

    let visitDetail = await VisitRepository.getDetail(visit.id ?? '');

    if (!visitDetail) {
        return { error: true, message: "Error while retrieving the detail." };
    }

    let message = `¡Hey, hola ${user.name}! 👋 \n\n`;
    message += `Bienvenido a ${visitDetail.mall}, que disfrutes tu estancia.\n\n`;

    message += `Recuerda que los costos son los siguientes:\n`;
    message += `1. Costo por hora: ${visitDetail.cost} mxn\n\n`;

    message += `A continuación, te mando la ubicación de tu lugar de estacionamiento.\n\n`;

    await bot.telegram.sendMessage(user.telegramid, message);

    await bot.telegram.sendLocation(user.telegramid, visitDetail.latitude, visitDetail.longitude);

    await bot.telegram.sendMessage(user.telegramid, `Si necesitas algo más, solo dime! 🚀 ¡Que tengas un excelente día! 🎉`);

    return { error: false, message: "Message sent successfully", data: true };
}

export async function sendFinishMessage(bot: Telegraf<Context<Update>>, licensePlate: string, visit: Visit): Promise<ControllerResponse<boolean | null>> {
    let user = await UserRepositoy.getUserByLicensePlate(licensePlate);

    if (!user || !user.telegramid) {
        return { error: true, message: "Error while retrieving the user information." };
    }

    let visitDetail = await VisitRepository.getDetail(visit.id ?? '');

    if (!visitDetail) {
        return { error: true, message: "Error while retrieving the detail." };
    }

    await bot.telegram.sendMessage(user.telegramid, `¡Hasta la próxima ${user.name}! Ahora te enviaré el costo de tu estadía, que será cargado a tu targeta configurada. 💳`);

    let durationInHours = getTimeDiffInHours(visit.initialdate, visit.finaldate ?? new Date());

    await bot.telegram.sendMessage(user.telegramid, `Duración de la estancia: ${durationInHours} hora${durationInHours > 1 ? 's': ''}\nCosto por hora: $${visitDetail.cost} mxn\nCosto total: $${visitDetail.cost * durationInHours} mxn`);

    await bot.telegram.sendMessage(user.telegramid, `¡Espero que hayas disfrutado de tu estancia en ${visitDetail.mall}, que vuelvas pronto! 🏠🌟`);

    return { error: false, message: "Message sent successfully", data: true };
}