import apiClient from './client';

export interface ShopItem {
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

export interface PurchaseResult {
    success: boolean;
    item: string;
    price: number;
    newCash: number;
}

export interface InventoryItem {
    id: string;
    userId: string;
    itemId: number;
    quantity: number;
    equipped: boolean;
    item: ShopItem;
}

export const shopApi = {
    getAllItems: async (): Promise<ShopItem[]> => {
        const response = await apiClient.get('/shop/items');
        return response.data;
    },

    purchaseItem: async (itemId: number): Promise<PurchaseResult> => {
        const response = await apiClient.post(`/shop/purchase/${itemId}`);
        return response.data;
    },

    getInventory: async (): Promise<InventoryItem[]> => {
        const response = await apiClient.get('/shop/inventory');
        return response.data;
    },

    equipItem: async (inventoryId: string): Promise<{ success: boolean; equipped: string }> => {
        const response = await apiClient.post(`/shop/equip/${inventoryId}`);
        return response.data;
    },
};
