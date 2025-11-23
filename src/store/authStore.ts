import { create } from 'zustand';

interface User {
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
    stats?: {
        strength: number;
        defense: number;
        agility: number;
        intelligence: number;
    };
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),

    setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));
