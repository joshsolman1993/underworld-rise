export class UpdateUserStatsDto {
    strength?: number;
    defense?: number;
    agility?: number;
    intelligence?: number;
}

export class GiveResourcesDto {
    moneyCash?: number;
    moneyBank?: number;
    credits?: number;
    energy?: number;
    nerve?: number;
    willpower?: number;
    health?: number;
}

export class BanUserDto {
    reason: string;
    durationMinutes?: number; // If not provided, permanent ban
}

export class CreateCrimeDto {
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

export class UpdateCrimeDto {
    name?: string;
    description?: string;
    energyCost?: number;
    minMoney?: number;
    maxMoney?: number;
    xpReward?: number;
    difficulty?: number;
    jailChance?: number;
    jailTimeMinutes?: number;
    requiredLevel?: number;
}

export class CreateItemDto {
    name: string;
    description: string;
    type: string;
    effectStat: string;
    effectValue: number;
    price: number;
    isTradable: boolean;
    requiredLevel: number;
}

export class UpdateItemDto {
    name?: string;
    description?: string;
    type?: string;
    effectStat?: string;
    effectValue?: number;
    price?: number;
    isTradable?: boolean;
    requiredLevel?: number;
}
