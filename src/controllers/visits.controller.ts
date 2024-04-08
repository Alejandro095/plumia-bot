import * as SpotsController from "./spots.controller";

import * as VehiclesRepository from "./../repositories/vehicles.repositoy";
import * as VisitsRepository from "./../repositories/visits.repository";
import * as SpotsRepository from "./../repositories/spot.repository";

import ControllerResponse from "./../types/controller-response.type";
import Visit from "./../types/visit.type";


export async function createVisit(licensePlate: string, mallId: string): Promise<ControllerResponse<Visit | null>>{
    let vehicle = await VehiclesRepository.getByLicensePlate(licensePlate);

    if (!vehicle) {
        return {
            error: true,
            message: 'Vehicle not found'
        };
    }

    let activeVisit = await VisitsRepository.getAnActiveVisit(licensePlate);

    if (activeVisit) {
        return {
            error: true,
            message: 'There is already an active visit'
        };
    }

    let availableSpots = await SpotsController.getAvailableSpots(mallId);

    if (availableSpots.error || (availableSpots.data && availableSpots.data?.free === 0 || !availableSpots.data?.spots[0].id)) {
        return {
            error: true,
            message: availableSpots.message ?? 'No spots available'
        };
    }

    let spotId = availableSpots.data?.spots[0].id;

    let spotUpdated = await SpotsRepository.updateAvailability(spotId, false);

    if (!spotUpdated) {
        return {
            error: true,
            message: 'Error updating spot availability'
        };
    }

    let visit: Visit = {
        spotid: spotId,
        vehicleid: vehicle.id,
        initialdate: new Date(),
    };

    let visitData = await VisitsRepository.create(visit);

    if (!visitData) {
        return {
            error: true,
            message: 'Error creating visit'
        };
    }

    return {
        error: false,
        data: visitData
    };
}

export async function finishVisit(licensePlate: string, mallId: string): Promise<ControllerResponse<Visit | null>> {
    let activeVisit = await VisitsRepository.getAnActiveVisit(licensePlate);

    if (!activeVisit) {
        return {
            error: true,
            message: 'There is no already an active visit'
        };
    }

    let spotUpdated = await SpotsRepository.updateAvailability(activeVisit.spotid, true);

    if (!spotUpdated) {
        return {
            error: true,
            message: 'Error updating spot availability'
        };
    }

    let finalDate = new Date();

    let visitUpdated = await VisitsRepository.updateFinalDate(activeVisit.visitid, finalDate);

    if (!visitUpdated) {
        return {
            error: true,
            message: 'Error updating visit'
        };
    }

    return {
        error: false,
        data: visitUpdated
    }
}