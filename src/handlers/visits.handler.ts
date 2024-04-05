import { Request, Response } from "express";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

import * as VisitsController from "./../controllers/visits.controller";
import * as BotController from "./../controllers/bot.controller";

export function arrivedHandler(bot: Telegraf<Context<Update>>) {
    return async (request: Request, response: Response) => {

        let { licensePlate, mallId } = request.body;

        let visit = await VisitsController.createVisit(licensePlate, mallId);

        if (!visit || visit.error || !visit.data) {
           return response.status(400).json({ error: true, message: visit.message ?? "Error creating visit" });
        }

        await BotController.sendWelcomeMessage(bot, licensePlate, visit.data);

        response.status(200).json({ error: false, message: "Visit created successfully"});
    }
}

export function departedHandler(bot: Telegraf<Context<Update>>) {
    return async (request: Request, response: Response) => {

        let { licensePlate, mallId } = request.body;

        let visit = await VisitsController.finishVisit(licensePlate, mallId);

        if (!visit || visit.error || !visit.data) {
            return response.status(400).json({ error: true, message: visit.message ?? "Error" });
        }

        await BotController.sendFinishMessage(bot, licensePlate, visit.data);

        response.status(200).json({ error: false, message: "Visit finished successfully"});
    }
}