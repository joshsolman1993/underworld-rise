import apiClient from './client';

// ==================== TYPES ====================

export interface AdminUser {
    id: string;
    username: string;
    email: string;
    level: number;
    xp: number;
    moneyCash: number;
    moneyBank: number;
    credits: number;
    health: number;
    energy: number;
    nerve: number;
    willpower: number;
    isAdmin: boolean;
    isBanned: boolean;
    bannedUntil: Date | null;
    bannedReason: string | null;
    gangId: string | null;
    createdAt: Date;
    updatedAt: Date;
    stats?: {
        strength: number;
        defense: number;
        agility: number;
        intelligence: number;
    };
    gang?: {
        id: string;
        name: string;
        tag: string;
    };
}

export interface SystemStats {
    totalUsers: number;
    activeUsers: number;
    totalMoney: number;
    totalGangs: number;
    totalCrimes: number;
    totalItems: number;
    totalCombatLogs: number;
    totalMarketListings: number;
}

export interface UpdateUserStatsDto {
    strength?: number;
    defense?: number;
    agility?: number;
    intelligence?: number;
}

export interface GiveResourcesDto {
    moneyCash?: number;
    moneyBank?: number;
    credits?: number;
    energy?: number;
    nerve?: number;
    willpower?: number;
    health?: number;
}

export interface BanUserDto {
    reason: string;
    durationMinutes?: number;
}

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

export interface Item {
    id: number;
    name: string;
    description: string;
    type: string;
    effectStat: string;
    effectValue: number;
    price: number;
    isTradable: boolean;
    requiredLevel: number;
}

export interface Gang {
    id: string;
    name: string;
    tag: string;
    treasury: number;
    reputation: number;
    leaderId: string;
    leader?: {
        username: string;
    };
}

// ==================== API FUNCTIONS ====================

export const adminApi = {
    // User Management
    getAllUsers: async (page: number = 1, limit: number = 20, search?: string) => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (search) params.append('search', search);

        const response = await apiClient.get(`/admin/users?${params}`);
        return response.data;
    },

    banUser: async (userId: string, banDto: BanUserDto) => {
        const response = await apiClient.patch(`/admin/users/${userId}/ban`, banDto);
        return response.data;
    },

    unbanUser: async (userId: string) => {
        const response = await apiClient.patch(`/admin/users/${userId}/unban`);
        return response.data;
    },

    updateUserStats: async (userId: string, stats: UpdateUserStatsDto) => {
        const response = await apiClient.patch(`/admin/users/${userId}/stats`, stats);
        return response.data;
    },

    giveResources: async (userId: string, resources: GiveResourcesDto) => {
        const response = await apiClient.patch(`/admin/users/${userId}/resources`, resources);
        return response.data;
    },

    deleteUser: async (userId: string) => {
        const response = await apiClient.delete(`/admin/users/${userId}`);
        return response.data;
    },

    // System Stats
    getSystemStats: async (): Promise<SystemStats> => {
        const response = await apiClient.get('/admin/stats');
        return response.data;
    },

    // Crime Management
    getAllCrimes: async (): Promise<Crime[]> => {
        const response = await apiClient.get('/admin/crimes');
        return response.data;
    },

    createCrime: async (crime: Partial<Crime>) => {
        const response = await apiClient.post('/admin/crimes', crime);
        return response.data;
    },

    updateCrime: async (crimeId: number, crime: Partial<Crime>) => {
        const response = await apiClient.patch(`/admin/crimes/${crimeId}`, crime);
        return response.data;
    },

    deleteCrime: async (crimeId: number) => {
        const response = await apiClient.delete(`/admin/crimes/${crimeId}`);
        return response.data;
    },

    // Item Management
    getAllItems: async (): Promise<Item[]> => {
        const response = await apiClient.get('/admin/items');
        return response.data;
    },

    createItem: async (item: Partial<Item>) => {
        const response = await apiClient.post('/admin/items', item);
        return response.data;
    },

    updateItem: async (itemId: number, item: Partial<Item>) => {
        const response = await apiClient.patch(`/admin/items/${itemId}`, item);
        return response.data;
    },

    deleteItem: async (itemId: number) => {
        const response = await apiClient.delete(`/admin/items/${itemId}`);
        return response.data;
    },

    // Gang Management
    getAllGangs: async (): Promise<Gang[]> => {
        const response = await apiClient.get('/admin/gangs');
        return response.data;
    },

    disbandGang: async (gangId: string) => {
        const response = await apiClient.delete(`/admin/gangs/${gangId}`);
        return response.data;
    },

    updateGangTreasury: async (gangId: string, amount: number) => {
        const response = await apiClient.patch(`/admin/gangs/${gangId}/treasury`, { amount });
        return response.data;
    },
};
