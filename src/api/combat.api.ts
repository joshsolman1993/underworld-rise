import apiClient from './client';

export interface OnlinePlayer {
    id: string;
    username: string;
    level: number;
    health: number;
    stats: {
        strength: number;
        defense: number;
        agility: number;
        intelligence: number;
    };
}

export interface CombatResult {
    result: 'attacker_win' | 'defender_win' | 'draw';
    attackerDamage: number;
    defenderDamage: number;
    moneyStolen: number;
    xpGained: number;
    defenderName: string;
}

export interface CombatHistoryItem {
    id: string;
    attackerId: string;
    defenderId: string;
    attacker: {
        username: string;
        level: number;
    };
    defender: {
        username: string;
        level: number;
    };
    result: 'attacker_win' | 'defender_win' | 'draw';
    attackerDamageDealt: number;
    defenderDamageDealt: number;
    moneyStolen: number;
    xpGained: number;
    createdAt: string;
}

export const combatApi = {
    getOnlinePlayers: async (): Promise<OnlinePlayer[]> => {
        const response = await apiClient.get('/combat/players');
        return response.data;
    },

    attack: async (defenderId: string): Promise<CombatResult> => {
        const response = await apiClient.post(`/combat/attack/${defenderId}`);
        return response.data;
    },

    getCombatHistory: async (limit: number = 20): Promise<CombatHistoryItem[]> => {
        const response = await apiClient.get(`/combat/history?limit=${limit}`);
        return response.data;
    },
};
