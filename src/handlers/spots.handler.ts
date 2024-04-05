import * as SpotsController from "./../controllers/spots.controller";
import { Request, Response } from "express";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import * as MallRepository from "./../repositories/mall.repository";

export function availableHandler(bot: Telegraf<Context<Update>>) {
    return async (request: Request, response: Response) => {
        let mallId = request.query.mallId?.toString() ?? '';

        let mall = await MallRepository.getById(mallId);

        let availableSpots = await SpotsController.getAvailableSpots(mallId);

        if (!mall || availableSpots.error) {
            response.status(404).json({ message: "Resource not found" });
            return;
        }

        response.status(200).json({
            mall: mall.name,
            available: availableSpots.data?.available,
            free: availableSpots.data?.free,
            total: availableSpots.data?.total
        });
    }
}