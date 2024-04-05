import Spot, { SpotsAvailable } from '@plumia-bot/types/spot.type';
import * as SpotsRepository from './../repositories/spot.repository';
import ControllerResponse from '@plumia-bot/types/controller-response.type';

export async function getAvailableSpots(mallId: string): Promise<ControllerResponse<SpotsAvailable | null>> {
    let spots = await SpotsRepository.getSpotsByMallId(mallId) as Spot[];

    if (!spots) {
        return {
            error: true,
            message: 'Mall not found'
        };
    }

    let freeSpots = spots.filter((spot: Spot) => spot.available);
    let totalSpots = spots.length;

    return {
        error: false,
        data: {
            available: true,
            total: totalSpots,
            free: freeSpots.length,
            spots: freeSpots
        }
    };
}