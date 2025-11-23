import apiClient from './client';

export interface BankBalance {
    cash: number;
    bank: number;
    total: number;
}

export interface BankTransaction {
    success: boolean;
    deposited?: number;
    withdrawn?: number;
    newCash: number;
    newBank: number;
}

export interface LaunderResult {
    success: boolean;
    original: number;
    fee: number;
    feePercent: number;
    laundered: number;
    newCash: number;
    newBank: number;
}

export const bankApi = {
    getBalance: async (): Promise<BankBalance> => {
        const response = await apiClient.get('/bank/balance');
        return response.data;
    },

    deposit: async (amount: number): Promise<BankTransaction> => {
        const response = await apiClient.post('/bank/deposit', { amount });
        return response.data;
    },

    withdraw: async (amount: number): Promise<BankTransaction> => {
        const response = await apiClient.post('/bank/withdraw', { amount });
        return response.data;
    },

    launderMoney: async (amount: number): Promise<LaunderResult> => {
        const response = await apiClient.post('/bank/launder', { amount });
        return response.data;
    },
};
