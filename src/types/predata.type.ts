export interface predataStep {
    step: string;
    data: string | null;
}

export interface predataState { state: 'registering' | 'registered' | null, steps: predataStep[] }

export interface Predata {
    [key: string]: predataState;
};