"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishVisit = exports.createVisit = void 0;
const SpotsController = __importStar(require("./spots.controller"));
const VehiclesRepository = __importStar(require("./../repositories/vehicles.repositoy"));
const VisitsRepository = __importStar(require("./../repositories/visits.repository"));
const SpotsRepository = __importStar(require("./../repositories/spot.repository"));
function createVisit(licensePlate, mallId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        let activeVisit = yield VisitsRepository.getAnActiveVisit(licensePlate);
        if (activeVisit) {
            return {
                error: true,
                message: 'There is already an active visit'
            };
        }
        let availableSpots = yield SpotsController.getAvailableSpots(mallId);
        if (availableSpots.error || (availableSpots.data && ((_a = availableSpots.data) === null || _a === void 0 ? void 0 : _a.free) === 0 || !((_b = availableSpots.data) === null || _b === void 0 ? void 0 : _b.spots[0].id))) {
            return {
                error: true,
                message: (_c = availableSpots.message) !== null && _c !== void 0 ? _c : 'No spots available'
            };
        }
        let spotId = (_d = availableSpots.data) === null || _d === void 0 ? void 0 : _d.spots[0].id;
        let spotUpdated = yield SpotsRepository.updateAvailability(spotId, false);
        if (!spotUpdated) {
            return {
                error: true,
                message: 'Error updating spot availability'
            };
        }
        let vehicle = yield VehiclesRepository.getByLicensePlate(licensePlate);
        if (!vehicle) {
            return {
                error: true,
                message: 'Vehicle not found'
            };
        }
        let visit = {
            spotid: spotId,
            vehicleid: vehicle.id,
            initialdate: new Date(),
        };
        let visitData = yield VisitsRepository.create(visit);
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
    });
}
exports.createVisit = createVisit;
function finishVisit(licensePlate, mallId) {
    return __awaiter(this, void 0, void 0, function* () {
        let activeVisit = yield VisitsRepository.getAnActiveVisit(licensePlate);
        if (!activeVisit) {
            return {
                error: true,
                message: 'There is no already an active visit'
            };
        }
        let spotUpdated = yield SpotsRepository.updateAvailability(activeVisit.spotid, true);
        if (!spotUpdated) {
            return {
                error: true,
                message: 'Error updating spot availability'
            };
        }
        let finalDate = new Date();
        let visitUpdated = yield VisitsRepository.updateFinalDate(activeVisit.visitid, finalDate);
        if (!visitUpdated) {
            return {
                error: true,
                message: 'Error updating visit'
            };
        }
        return {
            error: false,
            data: visitUpdated
        };
    });
}
exports.finishVisit = finishVisit;
