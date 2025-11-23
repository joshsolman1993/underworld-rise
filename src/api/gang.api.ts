import apiClient from './client';

export interface Gang {
    id: string;
    name: string;
    tag: string;
    description: string;
    leaderId: string;
    leader: {
        username: string;
        level: number;
    };
    treasury: number;
    reputation: number;
    createdAt: string;
    memberCount?: number;
    myRole?: 'leader' | 'officer' | 'member';
    members?: GangMember[];
}

export interface GangMember {
    id: string;
    gangId: string;
    userId: string;
    user: {
        id: string;
        username: string;
        level: number;
    };
    role: 'leader' | 'officer' | 'member';
    contributedMoney: number;
    joinedAt: string;
}

export const gangApi = {
    createGang: async (name: string, tag: string): Promise<Gang> => {
        const response = await apiClient.post('/gang/create', { name, tag });
        return response.data;
    },

    getMyGang: async (): Promise<Gang | null> => {
        const response = await apiClient.get('/gang/my');
        return response.data;
    },

    getAllGangs: async (): Promise<Gang[]> => {
        const response = await apiClient.get('/gang/all');
        return response.data;
    },

    getGang: async (gangId: string): Promise<Gang> => {
        const response = await apiClient.get(`/gang/${gangId}`);
        return response.data;
    },

    inviteMember: async (gangId: string, userId: string): Promise<{ message: string }> => {
        const response = await apiClient.post(`/gang/${gangId}/invite/${userId}`);
        return response.data;
    },

    kickMember: async (gangId: string, userId: string): Promise<{ message: string }> => {
        const response = await apiClient.delete(`/gang/${gangId}/kick/${userId}`);
        return response.data;
    },

    leaveGang: async (): Promise<{ message: string }> => {
        const response = await apiClient.post('/gang/leave');
        return response.data;
    },

    disbandGang: async (gangId: string): Promise<{ message: string }> => {
        const response = await apiClient.delete(`/gang/${gangId}/disband`);
        return response.data;
    },

    depositToTreasury: async (gangId: string, amount: number): Promise<{ message: string; newTreasury: number }> => {
        const response = await apiClient.post(`/gang/${gangId}/deposit`, { amount });
        return response.data;
    },
};
