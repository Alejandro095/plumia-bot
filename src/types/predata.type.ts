export interface predataStep {
    step: string;
    data: string | null;
}

export interface predataState { state: 'registering' | 'registered' | 'updateLicensePlate' | null, steps: predataStep[] }

export interface Predata {
    [key: string]: predataState;
};