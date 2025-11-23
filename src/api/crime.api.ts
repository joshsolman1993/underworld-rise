import apiClient from './client';

export interface Crime {
    id: number;
    name: string;
    description: string;
    energyCost: number;
    minMoney: number;
    maxMoney: number;
    xpReward: number;
    difficulty: number;
    jailChance: number;
    jailTimeMinutes: number;
    requiredLevel: number;
}

export interface CommitCrimeResult {
    success: boolean;
    successChance: number;
    moneyEarned?: number;
    xpEarned?: number;
    levelUp?: boolean;
    newLevel?: number;
    jailed?: boolean;
    jailTime?: number;
}

export const crimeApi = {
    getAllCrimes: async (): Promise<Crime[]> => {
        const response = await apiClient.get('/crimes');
        return response.data;
    },

    commitCrime: async (crimeId: number): Promise<CommitCrimeResult> => {
        const response = await apiClient.post(`/crimes/${crimeId}/commit`);
        return response.data;
    },
};
