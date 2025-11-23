import apiClient from './client';

export interface TrainingCosts {
    strength: {
        energyCost: number;
        moneyCost: number;
        currentValue: number;
    };
    defense: {
        energyCost: number;
        moneyCost: number;
        currentValue: number;
    };
    agility: {
        energyCost: number;
        moneyCost: number;
        currentValue: number;
    };
    intelligence: {
        energyCost: number;
        moneyCost: number;
        currentValue: number;
    };
}

export interface TrainResult {
    success: boolean;
    stat: string;
    gain: number;
    newValue: number;
    energySpent: number;
    moneySpent: number;
}

export const gymApi = {
    getTrainingCosts: async (): Promise<TrainingCosts> => {
        const response = await apiClient.get('/gym/costs');
        return response.data;
    },

    train: async (stat: string): Promise<TrainResult> => {
        const response = await apiClient.post('/gym/train', { stat });
        return response.data;
    },
};
