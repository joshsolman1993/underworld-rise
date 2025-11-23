import apiClient from './client';

export interface Mission {
    id: number;
    title: string;
    description: string;
    type: 'STORY' | 'DAILY';
    requirementType: 'CRIME' | 'COMBAT' | 'GYM' | 'ITEM';
    requirementValue: number;
    requirementTarget?: string;
    rewardXp: number;
    rewardMoney: number;
    rewardCredits: number;
    minLevel: number;
    order: number;
}

export interface UserMission {
    id: string;
    userId: string;
    missionId: number;
    mission: Mission;
    progress: number;
    isCompleted: boolean;
    isClaimed: boolean;
    createdAt: string;
}

export interface ClaimRewardResponse {
    success: boolean;
    rewards: {
        xp: number;
        money: number;
        credits: number;
    };
    user: {
        xp: number;
        moneyCash: number;
        credits: number;
    };
}

export const missionApi = {
    getMyMissions: async (): Promise<UserMission[]> => {
        const response = await apiClient.get('/missions');
        return response.data;
    },

    claimReward: async (userMissionId: string): Promise<ClaimRewardResponse> => {
        const response = await apiClient.post(`/missions/${userMissionId}/claim`);
        return response.data;
    },
};
