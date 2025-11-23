import apiClient from './client';

export interface Drug {
    id: number;
    name: string;
    description: string;
    basePrice: number;
    minPrice: number;
    maxPrice: number;
    currentPrice: number;
    volatility: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
    lastPriceUpdate: string;
}

export interface UserDrug {
    id: string;
    userId: string;
    drugId: number;
    drug: Drug;
    quantity: number;
}

export interface TransactionResponse {
    success: boolean;
    user: {
        moneyCash: number;
    };
    drug: {
        id: number;
        quantity: number;
    };
}

export const drugApi = {
    getAllDrugs: async (): Promise<Drug[]> => {
        const response = await apiClient.get('/drugs');
        return response.data;
    },

    getUserDrugs: async (): Promise<UserDrug[]> => {
        const response = await apiClient.get('/drugs/inventory');
        return response.data;
    },

    buyDrug: async (drugId: number, quantity: number): Promise<TransactionResponse> => {
        const response = await apiClient.post('/drugs/buy', { drugId, quantity });
        return response.data;
    },

    sellDrug: async (drugId: number, quantity: number): Promise<TransactionResponse> => {
        const response = await apiClient.post('/drugs/sell', { drugId, quantity });
        return response.data;
    },
};
